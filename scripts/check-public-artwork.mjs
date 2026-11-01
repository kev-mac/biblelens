import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {publicArtworkResponse} from '../worker/public-artwork.mjs';
const bytes=new TextEncoder().encode('public artwork fixture');
const art={url:'https://raw.githubusercontent.com/kev-mac/biblelens/'+'a'.repeat(40)+'/src/assets/chapter-exodus-06-v1.webp',sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length};
const url='https://biblelens.test/assets/chapter-exodus-06-v1.webp?private-query=never-forward';
let reads=0,puts=0,fetchOptions;const jobs=[],saved=new Map();
const cache={async match(key){assert(!key.url.includes('private-query'));return saved.get(key.url)?.clone();},async put(key,response){puts++;saved.set(key.url,response);}};
const fetcher=async(origin,options)=>{reads++;assert.equal(origin,art.url);fetchOptions=options;return new Response(bytes,{headers:{'content-length':String(bytes.length)}});};
const request=new Request(url,{headers:{cookie:'private-cookie',authorization:'Bearer private-device-token','x-user-id':'private-user'}});
let result=await publicArtworkResponse(request,art,{waitUntil:job=>jobs.push(job)},{cache,fetcher});
assert.equal(result.status,200);assert.deepEqual(new Uint8Array(await result.arrayBuffer()),bytes);await Promise.all(jobs);
assert.equal(puts,1);assert.deepEqual(fetchOptions.headers,{accept:'image/webp'});assert.equal(fetchOptions.credentials,'omit');assert.equal(fetchOptions.redirect,'error');
result=await publicArtworkResponse(request,art,{}, {cache,fetcher});assert.equal(result.status,200);assert.equal(reads,1,'Verified cache hits need no origin request');
assert.equal((await publicArtworkResponse(new Request(url,{method:'HEAD'}),art,{}, {fetcher})).headers.get('content-length'),String(bytes.length));assert.equal(reads,1);
assert.equal((await publicArtworkResponse(new Request(url,{headers:{'if-none-match':'"'+art.sha256+'"'}}),art,{}, {fetcher})).status,304);assert.equal(reads,1);
assert.equal((await publicArtworkResponse(new Request(url,{method:'POST'}),art,{}, {fetcher})).status,405);assert.equal(reads,1);
for(const bad of [async()=>new Response('wrong bytes'),async()=>new Response(new Uint8Array(bytes.length)),async()=>new Response('unavailable',{status:404}),async()=>{throw Error('offline');}]){
 result=await publicArtworkResponse(request,art,{}, {cache:false,fetcher:bad});assert.equal(result.status,302);assert.equal(result.headers.get('location'),art.url);assert.equal(result.headers.get('referrer-policy'),'no-referrer');
 assert(!result.headers.get('location').includes('private-query'));assert(!result.headers.has('set-cookie'));
}
result=await publicArtworkResponse(request,art,{}, {cache:{async match(){throw Error('cache down');},async put(){throw Error('cache down');}},fetcher});assert.equal(result.status,200,'Cache failures do not hide valid artwork');
console.log('PASS: pinned public artwork, exact bytes and hashes, verified cache hits, HEAD/ETag, method guards, pinned fallback on origin failures and no forwarded credentials or private query data.');
