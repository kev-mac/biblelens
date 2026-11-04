import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const expected=JSON.parse(fs.readFileSync('/tmp/biblelens343-live-expected.json','utf8'));
const base='https://scripture-lens.kvn-mcgwn.chatgpt.site';
const signed='.release/ios/Build/Products/Debug-iphoneos/App.app/public';
assert.deepEqual(expected.release,JSON.parse(fs.readFileSync('www/release.json')));
// release:verify already checked the live identity. Do not repeat the denied
// Python /release.json probe. These are the chapter/image endpoints required by
// the independent byte audit, using the project's ordinary Node fetch client.
let failed;
const recovered=[];
const cachePath='/tmp/biblelens343-live-byte-cache.json';
const cache=fs.existsSync(cachePath)?JSON.parse(fs.readFileSync(cachePath,'utf8')):{release:expected.release,chapters:{},images:{}};assert.deepEqual(cache.release,expected.release);
const flush=()=>fs.writeFileSync(cachePath,JSON.stringify(cache));
async function get(path){
 for(let attempt=0;attempt<3;attempt++){
  const response=await fetch(base+path,{signal:AbortSignal.timeout(40000)});
  if([429,500,502,503,504].includes(response.status)&&attempt<2){recovered.push({url:base+path,status:response.status,attempt:attempt+1});await response.body?.cancel();await new Promise(r=>setTimeout(r,1000));continue;}
  if(!response.ok){failed={url:base+path,status:response.status};throw Error('HTTP '+response.status+' at '+base+path);}
  return response;
 }
}
async function pool(rows,fn){let next=0;const out=[],errors=[];await Promise.all(Array.from({length:6},async()=>{while(next<rows.length&&!failed){const i=next++;try{out[i]=await fn(rows[i]);if(i%20===0)flush();}catch(error){failed||={error:error.message};errors.push(error);}}}));flush();if(errors.length)throw errors[0];return out;}
async function chapter(c){const key=c.book+':'+c.chapter;if(cache.chapters[key])return cache.chapters[key];const response=await get('/api/chapter?book='+c.book+'&chapter='+c.chapter),data=await response.json();assert.deepEqual(data.chapterImages||[],c.chapterImages);assert.deepEqual(data.eventHeadings||{},c.eventHeadings);assert.deepEqual(data.verses.map(v=>({n:v.n,kjv:v.kjv,asv:v.asv,web:v.web})),c.verses);return cache.chapters[key]={book:c.book,chapter:c.chapter,verses:c.verses.length};}
async function asset(src){if(cache.images[src])return cache.images[src];const response=await get(src);assert(response.headers.get('content-type')?.includes('image/webp'));const bytes=Buffer.from(await response.arrayBuffer());for(const prefix of ['src','www',signed])assert.deepEqual(bytes,fs.readFileSync(prefix+src),src+' '+prefix);return cache.images[src]={src,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),finalOrigin:new URL(response.url).origin};}
try{
 // Establish success on one chapter and one image before starting a bounded batch.
 await chapter(expected.chapters.find(c=>c.book===30&&c.chapter===1));
 await asset('/assets/chapter-obadiah-01-opening-v1.webp');
 const ordered=[...expected.chapters].sort((a,b)=>Number(b.book>=30)-Number(a.book>=30)||a.book-b.book||a.chapter-b.chapter);
 const chapters=await pool(ordered,chapter);console.log('PASS live metadata and KJV/ASV/WEB text:',chapters.length,'chapters');
 const images=await pool(expected.sources,asset);
 const report={release:expected.release,identityEvidence:'/tmp/biblelens343-release-verify.log',chaptersVerified:chapters.length,batchChaptersVerified:chapters.filter(c=>c.book>=30&&c.book<=39).length,imagesVerified:images.length,totalImageBytes:images.reduce((n,a)=>n+a.bytes,0),allImagesServedFromSiteOrigin:images.every(a=>a.finalOrigin===base),recoveredTransientResponses:recovered,chapters,images};
 fs.writeFileSync('research/notes/build-343-live-asset-verification-2026-11-04.json',JSON.stringify(report,null,2)+'\n');console.log('PASS live/source/www/signed bytes:',images.length,'images',report.totalImageBytes,'bytes');
}catch(error){flush();fs.writeFileSync('/tmp/biblelens343-live-byte-blocker.json',JSON.stringify({failed,error:error.message},null,2));throw error;}
