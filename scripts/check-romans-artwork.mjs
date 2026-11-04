import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {eventHeadings} from './event-headings.mjs';
import {validateChapterImages} from './chapter-images.mjs';
import {hostedArtwork} from './hosted-artwork.mjs';
import {releaseContent} from './rc1-content.mjs';
import {b4Content} from './b4-neutral.mjs';
import {addUX13Events} from './ux13-content.mjs';

const baseline='6bd1f514ed876677ab0762695176dfb9d64dfa2e';
const original=path=>execFileSync('git',['show',baseline+':'+path],{maxBuffer:100*1024*1024});
const read=name=>JSON.parse(fs.readFileSync('data/'+name+'.json'));
const books=read('books'),chapters=read('chapters'),images=read('chapter-images'),stories=read('story-images');
const before=JSON.parse(original('data/chapter-images.json'));
const productionStories=addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json'))));
const headings=eventHeadings(productionStories,books),hosted=hostedArtwork();
validateChapterImages(images,chapters,headings,stories);
for(const path of ['data/chapters.json','data/stories.json','data/story-images.json','package.json','package-lock.json','src/reader.js','src/style.css'].filter(p=>fs.existsSync(p)))assert.deepEqual(fs.readFileSync(path),original(path),path+' preserved');
for(const [key,value]of Object.entries(before))assert.deepEqual(images[key],value,'Earlier artwork preserved: '+key);
const oldAssets=execFileSync('git',['ls-tree','-r','--name-only',baseline,'src/assets'],{encoding:'utf8'}).trim().split('\n');
for(const path of oldAssets)assert.deepEqual(fs.readFileSync(path),original(path),'Earlier asset preserved: '+path);
const oldHosted=JSON.parse(original('data/hosted-artwork.json'));
assert(oldHosted.assets.every(src=>hosted[src]),'All baseline hosted assets remain');
const context={esc:s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')};
vm.createContext(context);
const reader=fs.readFileSync('src/reader.js','utf8');
vm.runInContext(reader.slice(0,reader.indexOf('let selectedVerses=')),context);
assert(reader.includes('${readerChapterIllustrations(reading,0)}${reading.verses.map'));
const records=[];
for(let chapter=1;chapter<=16;chapter++){
 const key='44:'+chapter,arts=images[key]||[],storyOpeners=(headings[key]?.[1]||[]).filter(t=>stories[t]);
 assert.equal(arts.filter(a=>a.afterVerse===0).length+storyOpeners.length,1,'Exactly one opener: '+key);
 assert.equal(arts.length,1);assert.equal(storyOpeners.length,0);
 const art=arts[0],bytes=fs.readFileSync('src'+art.src);
 assert(hosted[art.src]);assert(bytes.length<250000);assert.equal(bytes.toString('ascii',0,4),'RIFF');
 const html=context.readerChapterIllustrations({chapterImages:arts},0);
 assert(html.includes(art.src)&&html.includes(art.alt));assert(!html.includes('figcaption'));
 records.push({chapter,...art,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
const missing=structuredClone(images);delete missing['44:1'];
assert.throws(()=>validateChapterImages(missing,chapters,headings,stories),/Romans 1 needs/);

// Use the enriched production Story catalog and both release-343 coordinate conventions.
function spacing(metadata,openerCoordinate){
 let offset=0;const points=[];
 for(const book of books)for(let chapter=1;chapter<=book.chapters;chapter++){
  const key=book.id+':'+chapter,raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
  for(const art of metadata[key]||[])points.push({book:book.id,chapter,verse:art.afterVerse,src:art.src,position:offset+(art.afterVerse===0?openerCoordinate:art.afterVerse)});
  for(const [verse,titles]of Object.entries(headings[key]||{}))for(const title of titles)if(stories[title])points.push({book:book.id,chapter,verse:Number(verse),src:stories[title].src,position:offset+Number(verse)});
  offset+=raw.verses.length;
 }
 points.sort((a,b)=>a.position-b.position);
 const adjacent=[],all=[];
 for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length&&points[j].position-points[i].position<5;j++){
  const pair={from:points[i],to:points[j],gap:points[j].position-points[i].position};all.push(pair);if(j===i+1)adjacent.push(pair);
 }
 const boundaries=[];
 for(let i=1;i<points.length;i++)if(points[i-1].book!==points[i].book&&(points[i-1].book===44||points[i].book===44))boundaries.push({from:points[i-1],to:points[i],gap:points[i].position-points[i-1].position});
 return {adjacent,all,boundaries};
}
const spacingReport={};
for(const coordinate of [0,1]){
 const old=spacing(before,coordinate),current=spacing(images,coordinate);
 assert.deepEqual(current.adjacent,old.adjacent,'No new adjacent close pairs');assert.deepEqual(current.all,old.all,'No new close pairs');
 spacingReport[coordinate]={baseline:{adjacent:old.adjacent.length,all:old.all.length},current:{adjacent:current.adjacent.length,all:current.all.length},...current};
}
fs.writeFileSync('research/notes/romans-artwork-audit-2026-11-04.json',JSON.stringify({baseline,chapters:16,newOpeners:16,retainedStories:0,replaced:0,preservedAssets:oldAssets.length,records,spacing:spacingReport,integrationRechecks:'Recompute all spacing and Acts/Romans/1 Corinthians boundaries after union of parallel branches; compare approved Acts portraits separately.'},null,2)+'\n');
console.log('PASS: Romans 16/16 openers, baseline source and '+oldAssets.length+' assets preserved; renderer, captions, hosting and spacing:',Object.fromEntries(Object.entries(spacingReport).map(([c,v])=>[c,v.current])));

if(process.argv.includes('--offline')){
 const {Worker}=await import('node:worker_threads');
 const {installDeviceApi}=await import('../src/device-api.js');
 class DeviceWorker{
  constructor(){
   this.worker=new Worker(`const {parentPort}=require('node:worker_threads');globalThis.fetch=()=>{throw Error('Network forbidden');};globalThis.self={postMessage:data=>parentPort.postMessage(data)};import(${JSON.stringify(new URL('../www/device-api-worker.js',import.meta.url).href)}).then(()=>parentPort.on('message',data=>self.onmessage({data})));`,{eval:true});
   this.worker.on('message',data=>this.onmessage?.({data}));this.worker.on('error',error=>this.onerror?.(error));
  }
  postMessage(data){this.worker.postMessage(data);}
  terminate(){this.worker.terminate();}
 }
 let networkCalls=0;const blanks=[],absent=[];
 const target={Worker:DeviceWorker,location:{href:'https://device.test/',origin:'https://device.test'},fetch:async()=>{networkCalls++;throw Error('Network forbidden');}};
 const restore=installDeviceApi(target);
 try{
  for(let chapter=1;chapter<=16;chapter++){
   const response=await target.fetch('/api/chapter?book=44&chapter='+chapter);assert.equal(response.status,200);const data=await response.json();
   assert.deepEqual(data.chapterImages,images['44:'+chapter]);assert.deepEqual(data.eventHeadings,headings['44:'+chapter]||{});
   const raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters['44:'+chapter],'base64')));
   assert.equal(data.verses.length,raw.verses.length);
   for(const verse of data.verses)for(const edition of ['kjv','asv','web']){
    const source=raw.verses.find(v=>v.n===verse.n);
    assert.equal(Object.hasOwn(verse,edition),Object.hasOwn(source,edition));
    assert.equal(typeof verse[edition],typeof source[edition]);assert.equal(verse[edition],source[edition]);
    if(Object.hasOwn(source,edition)){assert.equal(typeof verse[edition],'string');if(verse[edition]==='')blanks.push({chapter,verse:verse.n,edition});}
    else absent.push({chapter,verse:verse.n,edition});
   }
   for(const art of data.chapterImages)assert.deepEqual(fs.readFileSync('www'+art.src),fs.readFileSync('src'+art.src));
  }
  assert.equal(networkCalls,0);
  assert.deepEqual(absent,[{chapter:16,verse:26,edition:'web'},{chapter:16,verse:27,edition:'web'}]);
  fs.writeFileSync('research/notes/romans-offline-verification-2026-11-04.json',JSON.stringify({chapters:16,placements:16,networkCalls,exactSourceScripture:true,exactSourceImageBytes:true,inheritedEmptyStrings:blanks,inheritedAbsentFields:absent},null,2)+'\n');
  console.log('PASS: Romans 16 chapters through actual offline engine; exact scripture types/source, metadata and image bytes; zero network calls. Preserved empty fields:',blanks,'and absent fields:',absent);
 }finally{restore();}
}
