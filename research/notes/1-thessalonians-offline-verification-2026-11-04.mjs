import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Worker} from 'node:worker_threads';
import {installDeviceApi} from '../../src/device-api.js';
import {conversationInput,conversationalResult} from '../../src/device-conversation.js';

const config=JSON.parse(fs.readFileSync('capacitor.config.json'));
assert.equal(config.webDir,'www');assert(!config.server?.url,'No remote application host');
const html=fs.readFileSync('www/index.html','utf8');
assert(html.indexOf('id="biblelens-device-bootstrap"')>=0,'Offline bootstrap is included');
assert(html.indexOf('id="biblelens-device-bootstrap"')<html.indexOf('id="biblelens-app-script"'),'Offline API bootstrap executes before the application bundle');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g))if(!/^https?:/.test(match[1]))assert(fs.existsSync('www/'+match[1].split('?')[0].replace(/^\//,'')),match[1]);

// Exercise the actual browser worker module and bundled engine through a Node
// adapter. Any attempted network fetch inside the engine fails this check.
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
const restore=installDeviceApi(target);
try{
 const zlib=await import('node:zlib');
 const worker=(await import('../../scripts/built-worker.mjs')).default;
 const originals=JSON.parse(fs.readFileSync('data/chapters.json'));
 const arts=JSON.parse(fs.readFileSync('data/chapter-images.json'));
 const rows=[];
 for(let c=1;c<=5;c++){
  const key='51:'+c,path='/api/chapter?book=51&chapter='+c;
  const offline=await(await target.fetch(path)).json();
  const web=await(await worker.fetch(new Request('https://biblelens.test'+path),{},{})).json();
  const original=JSON.parse(zlib.gunzipSync(Buffer.from(originals[key],'base64')));
  for(const rendered of [offline,web]){
   assert.deepEqual(rendered.chapterImages,arts[key]);
   assert.equal(rendered.verses.length,original.verses.length);
   for(const [i,v] of rendered.verses.entries())for(const e of ['kjv','asv','web']){assert.equal(Object.hasOwn(v,e),Object.hasOwn(original.verses[i],e));assert.equal(v[e],original.verses[i][e]);}
  }
  assert.equal(offline.chapterImages.filter(a=>a.afterVerse===0).length,1);
  for(const art of offline.chapterImages){
   const expected=fs.readFileSync('src'+art.src);assert.deepEqual(fs.readFileSync('www'+art.src),expected);
   // Controlled immutable-origin fixture exercises the actual built Worker route.
   // Independent public-origin report verifies real remote bytes separately.
   const realFetch=globalThis.fetch,pin=JSON.parse(fs.readFileSync('data/hosted-artwork.json')).sourceCommit;
   globalThis.fetch=async(url)=>{assert.equal(String(url),'https://raw.githubusercontent.com/kev-mac/biblelens/'+pin+'/src'+art.src);return new Response(expected);};
   try{const image=await worker.fetch(new Request('https://biblelens.test'+art.src),{},{});assert.equal(image.status,200);assert.deepEqual(Buffer.from(await image.arrayBuffer()),expected);}finally{globalThis.fetch=realFetch;}
  }
  rows.push({key,verses:original.verses.length,openers:1,images:offline.chapterImages.length,editions:['kjv','asv','web'],emptySourceFields:original.verses.flatMap(v=>['kjv','asv','web'].filter(e=>v[e]==='').map(e=>({verse:v.n,edition:e}))),passed:true});
 }
 assert.equal(networkCalls,0);
 const report={passed:true,networkCalls,webImageRoute:"Five actual built Worker responses checked using controlled public-origin fixtures; actual origin separately verified",chapters:rows};
 fs.writeFileSync('research/notes/1-thessalonians-offline-verification-2026-11-04.json',JSON.stringify(report,null,2)+'\n');console.log(report);
}finally{restore();}
