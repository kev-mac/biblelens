import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import {Worker} from 'node:worker_threads';
import {installDeviceApi} from '../../src/device-api.js';

// Run from the repository root after build:mobile. Exercise the packaged engine,
// not a second implementation of the reader's chapter API.
class DeviceWorker {
 constructor(){
  this.worker=new Worker(`const {parentPort}=require('node:worker_threads');globalThis.fetch=()=>{throw Error('Network forbidden');};globalThis.self={postMessage:data=>parentPort.postMessage(data)};import(${JSON.stringify(new URL('../../www/device-api-worker.js',import.meta.url).href)}).then(()=>parentPort.on('message',data=>self.onmessage({data})));`,{eval:true});
  this.worker.on('message',data=>this.onmessage?.({data}));
  this.worker.on('error',error=>this.onerror?.(error));
 }
 postMessage(data){this.worker.postMessage(data);}
 terminate(){this.worker.terminate();}
}
let networkCalls=0;
const target={Worker:DeviceWorker,location:{href:'https://device.test/',origin:'https://device.test'},fetch:async()=>{networkCalls++;throw Error('Network forbidden');}};
const restore=installDeviceApi(target);
const chapterImages=JSON.parse(fs.readFileSync('data/chapter-images.json'));
const storyImages=JSON.parse(fs.readFileSync('data/story-images.json'));
const chapters=JSON.parse(fs.readFileSync('data/chapters.json'));
const counts=[1,4,7,3,3,3,2,14,4,28];
let openers=0,images=0;
try {
 for(let book=30;book<=39;book++)for(let chapter=1;chapter<=counts[book-30];chapter++){
  const response=await target.fetch('/api/chapter?book='+book+'&chapter='+chapter);
  assert.equal(response.status,200);
  const data=await response.json();
  assert(data.verses.length&&data.verses.every(v=>v.kjv&&v.asv&&v.web));
  assert.deepEqual(data.chapterImages||[],chapterImages[book+':'+chapter]||[]);
  const atOne=(data.eventHeadings?.[1]||[]).filter(title=>storyImages[title]);
  const additions=(data.chapterImages||[]).filter(a=>a.afterVerse===0);
  assert.equal(atOne.length+additions.length,1,'Exactly one offline opener: '+book+':'+chapter);
  const raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[book+':'+chapter],'base64')));
  for(const v of data.verses)for(const edition of ['kjv','asv','web'])assert.equal(v[edition],raw.verses.find(x=>x.n===v.n)[edition]);
  openers++;
  const sources=[...(data.chapterImages||[]).map(a=>a.src),...Object.values(data.eventHeadings||{}).flat().filter(title=>storyImages[title]).map(title=>storyImages[title].src)];
  for(const src of sources){assert.deepEqual(fs.readFileSync('www'+src),fs.readFileSync('src'+src),'Bundled offline artwork matches shared source: '+src);images++;}
 }
 assert.equal(networkCalls,0);
 console.log(`PASS: ${openers} batch chapters from packaged offline engine, ${images} image placements match native/source bytes, three scripture editions, exactly one opener per chapter, zero network calls.`);
} finally {restore();}
