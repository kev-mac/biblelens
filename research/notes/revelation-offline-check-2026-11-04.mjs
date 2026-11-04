import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import {Worker} from 'node:worker_threads';
import {installDeviceApi} from '../../src/device-api.js';
class DeviceWorker{
 constructor(){
  this.worker=new Worker(`const {parentPort}=require('node:worker_threads');globalThis.fetch=()=>{throw Error('Network forbidden');};globalThis.self={postMessage:data=>parentPort.postMessage(data)};import(${JSON.stringify(new URL('../../www/device-api-worker.js',import.meta.url).href)}).then(()=>parentPort.on('message',data=>self.onmessage({data})));`,{eval:true});
  this.worker.on('message',data=>this.onmessage?.({data}));this.worker.on('error',error=>this.onerror?.(error));
 }
 postMessage(data){this.worker.postMessage(data);}
 terminate(){this.worker.terminate();}
}

let networkCalls=0;
const target={Worker:DeviceWorker,location:{href:'https://device.test/',origin:'https://device.test'},fetch:async()=>{networkCalls++;throw Error('Network forbidden');}};
const restore=installDeviceApi(target),source=JSON.parse(fs.readFileSync('data/chapters.json')),images=JSON.parse(fs.readFileSync('data/chapter-images.json')),rows=[];
try{for(let n=1;n<=22;n++){
const key='65:'+n,response=await target.fetch('/api/chapter?book=65&chapter='+n);assert.equal(response.status,200);const actual=await response.json(),raw=JSON.parse(zlib.gunzipSync(Buffer.from(source[key],'base64')));
assert.equal(actual.verses.length,raw.verses.length);
for(let i=0;i<raw.verses.length;i++)for(const field of ['n','kjv','asv','web']){assert.equal(Object.hasOwn(actual.verses[i],field),Object.hasOwn(raw.verses[i],field),'Presence '+key+' '+field);assert.deepEqual(actual.verses[i][field],raw.verses[i][field],'Value '+key+' '+field);}
assert.deepEqual(actual.chapterImages,images[key]);assert.equal(actual.chapterImages.filter(a=>a.afterVerse===0).length,1);
for(const art of actual.chapterImages)assert.deepEqual(fs.readFileSync('src'+art.src),fs.readFileSync('www'+art.src));
rows.push({key,verses:actual.verses.length,images:actual.chapterImages.length,exactScriptureFields:true});
}assert.equal(networkCalls,0);}finally{restore();}
fs.writeFileSync('research/notes/revelation-offline-verification-2026-11-04.json',JSON.stringify({networkCalls,engine:'Actual packaged device-api-worker through Node worker adapter',rows},null,2)+'\n');console.log('PASS: 22 Revelation chapters, exact scripture property presence/values, image source/offline parity and zero network calls');
