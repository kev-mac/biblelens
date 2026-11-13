import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {hostedArtwork,hostedVideoPosters} from './hosted-artwork.mjs';

const manifest=JSON.parse(fs.readFileSync('data/hosted-artwork.json','utf8'));
const videos=JSON.parse(fs.readFileSync('data/story-videos.json','utf8'));
const selected=hostedVideoPosters(manifest,videos),artwork=hostedArtwork();
const sample='/assets/story-video-check-poster-v1.webp';
const ready={Example:{status:'ready',poster:sample}};
assert.deepEqual(hostedVideoPosters({},ready),[],'Hosting remains explicitly opt-in');
assert.deepEqual(hostedVideoPosters({videoPosters:[sample]},ready),[sample]);
assert.throws(()=>hostedVideoPosters({videoPosters:'bad'},ready),/array/);
assert.throws(()=>hostedVideoPosters({videoPosters:[sample,sample]},ready),/Duplicate/);
assert.throws(()=>hostedVideoPosters({videoPosters:[sample]},{Example:{status:'pending',poster:sample}}),/active reviewed/);
assert.throws(()=>hostedVideoPosters({videoPosters:['/assets/story-video-unknown-poster-v1.webp']},ready),/active reviewed/);
assert.throws(()=>hostedVideoPosters({videoPosters:['/assets/../private.webp']},ready),/versioned video posters/);

// A new source pin must contain every retained image, not just the new posters.
const tree=execFileSync('git',['ls-tree','-r',manifest.sourceCommit,'--','src/assets'],{encoding:'utf8',maxBuffer:4*1024*1024});
const blobs=new Map(tree.trim().split('\n').map(line=>{const [meta,file]=line.split('\t');return [file,meta.split(' ')[2]];}));
for(const src of manifest.assets){
 const bytes=fs.readFileSync('src'+src);
 const blob=createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
 assert.equal(blobs.get('src'+src),blob,'Immutable pin must contain exact source bytes: '+src);
}

const assets=JSON.parse(fs.readFileSync('dist/asset-manifest.json','utf8'));
const {default:worker}=await import('./built-worker.mjs');
const originalFetch=globalThis.fetch;let originReads=0;
try{
 globalThis.fetch=async(url,options)=>{
  const [src,art]=Object.entries(artwork).find(([,entry])=>entry.url===url)||[];
  assert(src&&selected.includes(src),'Only the selected immutable poster origins may be requested');
  assert.deepEqual(options.headers,{accept:'image/webp'});
  assert.equal(options.redirect,'manual');originReads++;
  const bytes=fs.readFileSync('src'+src);
  return new Response(bytes,{headers:{'content-length':String(art.bytes)}});
 };
 for(const src of selected){
  assert(assets.publicArtwork.includes(src),'Poster bytes must be outside the embedded Worker');
  const expected=fs.readFileSync('src'+src);
  assert.deepEqual(fs.readFileSync('www'+src),expected,'Native offline poster bytes must be preserved');
  const response=await worker.fetch(new Request('https://biblelens.test'+src+'?private-input=discard',{headers:{cookie:'never-forward',authorization:'Bearer never-forward'}}),{},{});
  assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/webp');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),expected,'Built route must return exact reviewed poster bytes');
  assert.equal(response.headers.get('etag'),'"'+createHash('sha256').update(expected).digest('hex')+'"');
 }
 assert.equal(originReads,selected.length,'Each cold route uses its selected immutable image only');
}finally{globalThis.fetch=originalFetch;}
console.log(`PASS: ${selected.length} hosted video posters, strict opt-in/active validation, ${manifest.assets.length} immutable Git blobs, exact built response/native bytes, no private origin headers, unchanged image-handler security.`);
