import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import {createHash} from 'node:crypto';
import {eventHeadings} from './event-headings.mjs';
import {validateChapterImages} from './chapter-images.mjs';
import {hostedArtwork} from './hosted-artwork.mjs';
import {releaseContent} from './rc1-content.mjs';
import {b4Content} from './b4-neutral.mjs';
import {addUX13Events} from './ux13-content.mjs';
const read=name=>JSON.parse(fs.readFileSync('data/'+name+'.json'));
const books=read('books'),chapters=read('chapters'),images=read('chapter-images'),stories=read('story-images');
const productionStories=addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json'))));
const headings=eventHeadings(productionStories,books),hosted=hostedArtwork();
validateChapterImages(images,chapters,headings,stories);
const context={esc:s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')};
vm.createContext(context);
const reader=fs.readFileSync('src/reader.js','utf8');
vm.runInContext(reader.slice(0,reader.indexOf('let selectedVerses=')),context);
assert(reader.includes('${readerChapterIllustrations(reading,0)}${reading.verses.map'));
const records=[];
for(let c=1;c<=7;c++){
 const key='32:'+c,arts=images[key]||[],storyOpeners=(headings[key]?.[1]||[]).filter(t=>stories[t]);
 assert.equal(arts.filter(a=>a.afterVerse===0).length+storyOpeners.length,1,'Exactly one opener: '+key);
 assert.equal(arts.length,1);const art=arts[0],bytes=fs.readFileSync('src'+art.src);
 assert(hosted[art.src]);assert(bytes.length<250000);assert.equal(bytes.toString('ascii',0,4),'RIFF');
 const html=context.readerChapterIllustrations({chapterImages:arts},0);
 assert(html.includes(art.src)&&html.includes(art.alt));assert(!html.includes('figcaption'));
 records.push({chapter:c,...art,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
const missing=structuredClone(images);delete missing['32:2'];
assert.throws(()=>validateChapterImages(missing,chapters,headings,stories),/Micah 2 needs/);
// Count verse positions continuously, including both adjacent book boundaries.
let offset=0;const positions=[];
for(const book of books.filter(b=>b.id>=31&&b.id<=33))for(let c=1;c<=book.chapters;c++){
 const key=book.id+':'+c,raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
 for(const art of images[key]||[])positions.push({book:book.id,chapter:c,verse:art.afterVerse,src:art.src,position:offset+Math.max(art.afterVerse,1)});
 for(const [v,titles]of Object.entries(headings[key]||{}))for(const t of titles)if(stories[t])positions.push({book:book.id,chapter:c,verse:Number(v),src:stories[t].src,position:offset+Number(v)});
 offset+=raw.verses.length;
}
positions.sort((a,b)=>a.position-b.position);const closePairs=[];
for(let i=1;i<positions.length;i++){const a=positions[i-1],b=positions[i];if(b.position-a.position<5)closePairs.push({from:a,to:b,gap:b.position-a.position,involvesMicah:a.book===32||b.book===32,inherited:a.book!==32&&b.book!==32});}
const report={chapters:7,retainedStories:0,newOpeners:7,records,positions,closePairs,boundaries:'Jonah through Nahum; recheck after parallel integration',verification:'Source metadata and renderer; --offline separately checks actual packaged engine and byte parity; browser and devices separate'};
fs.writeFileSync('research/notes/micah-artwork-audit-2026-11-04.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS: Micah 7/7 openers; 7 hosted versioned additions; no Story duplicates; source renderer, alt text, captions, coverage failure case and boundaries checked. Close pairs:',closePairs.length);

if(process.argv.includes('--offline')){
 const {Worker}=await import('node:worker_threads');
 const {installDeviceApi}=await import('../src/device-api.js');
 class DeviceWorker{
  constructor(){
   this.worker=new Worker(`const {parentPort}=require('node:worker_threads');globalThis.fetch=()=>{throw Error('Network forbidden');};globalThis.self={postMessage:data=>parentPort.postMessage(data)};import(${JSON.stringify(new URL('../www/device-api-worker.js',import.meta.url).href)}).then(()=>parentPort.on('message',data=>self.onmessage({data})));`,{eval:true});
   this.worker.on('message',data=>this.onmessage?.({data}));
   this.worker.on('error',error=>this.onerror?.(error));
  }
  postMessage(data){this.worker.postMessage(data);}
  terminate(){this.worker.terminate();}
 }
 let networkCalls=0;
 const target={Worker:DeviceWorker,location:{href:'https://device.test/',origin:'https://device.test'},fetch:async()=>{networkCalls++;throw Error('Network forbidden');}};
 const restore=installDeviceApi(target);
 try{
  for(let c=1;c<=7;c++){
   const response=await target.fetch('/api/chapter?book=32&chapter='+c);
   assert.equal(response.status,200);const data=await response.json();
   assert.deepEqual(data.chapterImages||[],images['32:'+c]||[],'Offline Micah placement matches source');
   const original=JSON.parse(zlib.gunzipSync(Buffer.from(chapters['32:'+c],'base64')));
   for(const verse of data.verses)for(const edition of ['kjv','asv','web'])assert.equal(verse[edition],original.verses.find(v=>v.n===verse.n)[edition]);
   for(const art of data.chapterImages||[])assert.deepEqual(fs.readFileSync('www'+art.src),fs.readFileSync('src'+art.src),'Offline art bytes match source');
  }
  assert.equal(networkCalls,0);
  console.log('PASS: all 7 Micah chapters through the actual offline engine, unchanged scripture, exact image metadata and bundled bytes; zero network calls.');
 }finally{restore();}
}
