import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {eventHeadings} from './event-headings.mjs';
import {releaseContent} from './rc1-content.mjs';
import {b4Content} from './b4-neutral.mjs';
import {addUX13Events} from './ux13-content.mjs';
import {validateChapterImages} from './chapter-images.mjs';
import {hostedArtwork} from './hosted-artwork.mjs';
import {assess} from './check-readability.mjs';
import {enrichStories} from './story-metrics.mjs';
import {tagStoryCatalog,loadTopicOptions} from './story-topics.mjs';

const baseline='5a33980ae6e7e25ad9b0dfb345d8da52229226d9';
const json=p=>JSON.parse(fs.readFileSync(p));
const prior=p=>execFileSync('git',['show',baseline+':'+p],{maxBuffer:100*1024*1024});
const sha=b=>createHash('sha256').update(b).digest('hex');
const books=json('data/books.json'),chapters=json('data/chapters.json'),images=json('data/chapter-images.json'),stories=json('data/story-images.json');
const production=enrichStories(addUX13Events(tagStoryCatalog(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json'))),json('data/reference/topics.json'),loadTopicOptions())),JSON.parse(releaseContent('data/books.json')),JSON.parse(releaseContent('data/chapters.json')),JSON.parse(releaseContent('data/evidence.json')));
const headings=eventHeadings(production,books),hosted=hostedArtwork();
for(const p of ['data/chapters.json','data/stories.json','data/story-images.json','src/reader.js','src/stories.js','src/components.css','src/overrides.css','package.json','package-lock.json'])assert.deepEqual(fs.readFileSync(p),prior(p),p+' preserved exactly');
const oldImages=JSON.parse(prior('data/chapter-images.json'));
for(const [key,entries]of Object.entries(oldImages))assert.deepEqual(images[key],entries,'Earlier chapter art preserved: '+key);
assert.deepEqual(Object.keys(images).filter(k=>!Object.hasOwn(oldImages,k)).sort(),Array.from({length:1},(_,i)=>'56:'+(i+1)));
const oldHosted=JSON.parse(prior('data/hosted-artwork.json'));
for(const src of oldHosted.assets)assert(hosted[src],'Earlier hosting member preserved');
assert.equal(Object.keys(hosted).length,oldHosted.assets.length+1);
const oldAssetPaths=execFileSync('git',['ls-tree','-r','--name-only',baseline,'src/assets'],{encoding:'utf8'}).trim().split('\n');
for(const p of oldAssetPaths)assert.deepEqual(fs.readFileSync(p),prior(p),'Earlier source asset bytes preserved: '+p);
validateChapterImages(images,chapters,headings,stories);
const reader=fs.readFileSync('src/reader.js','utf8'),context={esc:s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')};
vm.createContext(context);vm.runInContext(reader.slice(0,reader.indexOf('let selectedVerses=')),context);
assert(reader.includes('${readerChapterIllustrations(reading,0)}${reading.verses.map'));
const records=[];
for(let c=1;c<=1;c++){
 const key='56:'+c,arts=images[key]||[],existing=(headings[key]?.[1]||[]).filter(t=>stories[t]);
 assert.equal(arts.length,1);assert.equal(arts.filter(a=>a.afterVerse===0).length+existing.length,1);
 const a=arts[0],bytes=fs.readFileSync('src'+a.src),html=context.readerChapterIllustrations({chapterImages:arts},0);
 assert(hosted[a.src]);assert.equal(a.width,960);assert.equal(a.height,540);assert(bytes.length<250000);
 assert(html.includes(a.src)&&html.includes(a.alt));assert(!html.includes('figcaption'));
 const readability=assess(a.alt.replace(/^Imagined scene: /,''));assert(!readability.tooLong&&!readability.unexplained);
 records.push({chapter:c,...a,bytes:bytes.length,sha256:sha(bytes),readability});
}
const missing=structuredClone(images);delete missing['56:1'];
assert.throws(()=>validateChapterImages(missing,chapters,headings,stories),/Philemon 1 needs/);
function positions(mapping,openerCoordinate){
 let offset=0;const out=[];
 for(const b of books)for(let c=1;c<=b.chapters;c++){
  const key=b.id+':'+c,raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
  for(const a of mapping[key]||[])out.push({key,verse:a.afterVerse,pos:offset+(a.afterVerse===0?openerCoordinate:a.afterVerse),src:a.src});
  for(const [v,titles]of Object.entries(headings[key]||{}))for(const t of titles)if(stories[t])out.push({key,verse:Number(v),pos:offset+Number(v),src:stories[t].src});
  offset+=raw.verses.length;
 }
 return out.sort((a,b)=>a.pos-b.pos);
}
function pairs(p,adjacent){const out=[];for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length&&(j===i+1||!adjacent);j++){const gap=p[j].pos-p[i].pos;if(gap>=5)break;out.push({a:p[i],b:p[j],gap});}return out;}
const spacing={};
for(const coordinate of [0,1]){
 const before=positions(oldImages,coordinate),after=positions(images,coordinate),a=pairs(after,true),all=pairs(after,false),baseA=pairs(before,true),baseAll=pairs(before,false);
 assert.equal(baseA.length,coordinate===0?64:69);assert.equal(baseAll.length,coordinate===0?65:70);
 assert.deepEqual(a,baseA,'No new adjacent close pair');assert.deepEqual(all,baseAll,'No new all-pairs close pair');
 const batch=after.filter(p=>p.key.startsWith('56:'));
 spacing['openerAtVerse'+coordinate]={baselineAdjacent:baseA.length,currentAdjacent:a.length,baselineAll:baseAll.length,currentAll:all.length,allClosePairs:all,batchPositions:batch,batchClosePairs:all.filter(p=>p.a.key.startsWith('56:')||p.b.key.startsWith('56:')),neighboringActiveImages:after.filter(p=>Number(p.key.split(':')[0])>=55&&Number(p.key.split(':')[0])<=57),integrationRecheck:'Recompute after accepting parallel Titus and Hebrews artwork. Neither neighbor has active baseline art. Expected opener distances: Titus 3 to Philemon 1 = 15; Philemon 1 to Hebrews 1 = 25. No neighboring parallel identity is presumed approved.'};
}
const report={baseline,chapters:1,newOpeners:1,retainedStories:0,replaced:0,records,preservedSourceAssets:oldAssetPaths.length,preservedHostedAssets:oldHosted.assets.length,hostedAssets:Object.keys(hosted).length,pin:json('data/hosted-artwork.json').sourceCommit,spacing,altMeanGrade:records.reduce((n,r)=>n+r.readability.grade,0)/1};
fs.writeFileSync('research/notes/philemon-artwork-audit-2026-11-04.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS: Philemon 1/1 single openers, renderer/alt/captions, exact baseline preservation, hosting union, complete-canon spacing.');

if(process.argv.includes('--offline')){
 const {Worker}=await import('node:worker_threads');const {installDeviceApi}=await import('../src/device-api.js');
 class DeviceWorker{
  constructor(){this.worker=new Worker(`const {parentPort}=require('node:worker_threads');globalThis.fetch=()=>{throw Error('Network forbidden');};globalThis.self={postMessage:data=>parentPort.postMessage(data)};import(${JSON.stringify(new URL('../www/device-api-worker.js',import.meta.url).href)}).then(()=>parentPort.on('message',data=>self.onmessage({data})));`,{eval:true});this.worker.on('message',data=>this.onmessage?.({data}));this.worker.on('error',e=>this.onerror?.(e));}
  postMessage(data){this.worker.postMessage(data);}terminate(){this.worker.terminate();}
 }
 let networkCalls=0,verseCount=0;const blanks=[];
 const target={Worker:DeviceWorker,location:{href:'https://device.test/',origin:'https://device.test'},fetch:async()=>{networkCalls++;throw Error('Network forbidden');}};
 const restore=installDeviceApi(target),originalFetch=globalThis.fetch;
 globalThis.fetch=async(url,options)=>{const item=Object.entries(hosted).find(([,a])=>a.url===String(url));assert(item,'Only immutable public source');assert.deepEqual(options.headers,{accept:'image/webp'});return new Response(fs.readFileSync('src'+item[0]),{headers:{'content-type':'image/webp'}});};
 try{
  const {default:worker}=await import('../dist/server/index.js');const results=[];
  const catalog=await(await worker.fetch(new Request('https://biblelens.test/stories.json'),{},{})).json();assert.deepEqual(catalog,production,'Actual built production Story catalog reconciles');
  for(let c=1;c<=1;c++){
   const key='56:'+c,path='/api/chapter?book=56&chapter='+c,response=await target.fetch(path),webResponse=await worker.fetch(new Request('https://biblelens.test'+path),{},{});
   assert.equal(response.status,200);assert.equal(webResponse.status,200);const data=await response.json(),web=await webResponse.json(),raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
   assert.deepEqual(data.chapterImages,images[key]);assert.deepEqual(web.chapterImages,images[key]);assert.deepEqual(web.eventHeadings,data.eventHeadings);
   assert.equal(data.verses.length,raw.verses.length);assert.equal(web.verses.length,raw.verses.length);
   for(const v of data.verses){verseCount++;for(const e of ['kjv','asv','web']){const rv=raw.verses.find(s=>s.n===v.n),wv=web.verses.find(s=>s.n===v.n);assert.equal(Object.hasOwn(v,e),Object.hasOwn(rv,e));assert.equal(Object.hasOwn(wv,e),Object.hasOwn(rv,e));const original=rv[e];assert.equal(v[e],original);assert.equal(web.verses.find(s=>s.n===v.n)[e],original);if(original==='')blanks.push({key,verse:v.n,edition:e});}}
   const a=images[key][0],result=await worker.fetch(new Request('https://biblelens.test'+a.src),{},{}),bytes=Buffer.from(await result.arrayBuffer());assert.equal(result.status,200);assert.deepEqual(bytes,fs.readFileSync('src'+a.src));assert.deepEqual(bytes,fs.readFileSync('www'+a.src));
   results.push({key,verses:data.verses.length,src:a.src,bytes:bytes.length,sha256:sha(bytes)});
  }
  assert.equal(networkCalls,0);fs.writeFileSync('research/notes/philemon-offline-verification-2026-11-04.json',JSON.stringify({chapters:1,verseCount,editions:['kjv','asv','web'],exactScripture:true,sourceBlanks:blanks,networkCalls,results,webOrigin:'Local generated Worker fixture with pinned source-origin byte responses; not live/public-origin verification'},null,2)+'\n');console.log('PASS: all 1 actual offline-engine chapters, '+verseCount+' verses in all editions, source/web/offline image parity, zero network calls.');
 }finally{restore();globalThis.fetch=originalFetch;}
}
