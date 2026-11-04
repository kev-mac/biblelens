import fs from 'node:fs';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import {Worker} from 'node:worker_threads';
import {createHash} from 'node:crypto';
import web from '../../dist/server/index.js';
import {installDeviceApi} from '../../src/device-api.js';
class OfflineWorker {
 constructor(){
  this.worker=new Worker(`const {parentPort}=require('node:worker_threads');globalThis.fetch=()=>{throw Error('Network forbidden');};globalThis.self={postMessage:data=>parentPort.postMessage(data)};import(${JSON.stringify(new URL('../../www/device-api-worker.js',import.meta.url).href)}).then(()=>parentPort.on('message',data=>self.onmessage({data})));`,{eval:true});
  this.worker.on('message',data=>this.onmessage?.({data}));this.worker.on('error',error=>this.onerror?.(error));
 }
 postMessage(data){this.worker.postMessage(data);}
 terminate(){this.worker.terminate();}
}
let networkCalls=0;
const device={Worker:OfflineWorker,location:{href:'https://offline.test/',origin:'https://offline.test'},fetch:async()=>{networkCalls++;throw Error('Network forbidden');}};
const restore=installDeviceApi(device);
const images=JSON.parse(fs.readFileSync('data/chapter-images.json'));
const chapters=JSON.parse(fs.readFileSync('data/chapters.json'));
const rows=[];
try {
 for(let chapter=1;chapter<=12;chapter++){
  const key='20:'+chapter,path='/api/chapter?book=20&chapter='+chapter;
  const native=await(await device.fetch(path)).json();
  const hosted=await(await web.fetch(new Request('https://web.test'+path),{},{})).json();
  assert.deepEqual(native.chapterImages,images[key]);assert.deepEqual(hosted.chapterImages,images[key]);
  assert.deepEqual(native.verses,hosted.verses);
  const raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
  for(const verse of native.verses)for(const edition of ['kjv','asv','web'])assert.equal(verse[edition],raw.verses.find(v=>v.n===verse.n)[edition]);
  const src=images[key][0].src,source=fs.readFileSync('src'+src),offline=fs.readFileSync('www'+src);
  assert.deepEqual(offline,source);
  rows.push({chapter,src,bytes:source.length,sha256:createHash('sha256').update(source).digest('hex'),offlineChapterLoaded:true,webNativeMetadataAndScriptureMatch:true,offlineImageBytesMatch:true});
 }
 assert.equal(networkCalls,0);
} finally {restore();}
const workerBytes=fs.statSync('dist/server/index.js').size,budgetBytes=63*1024*1024;
assert(workerBytes<budgetBytes);
const webRelease=JSON.parse(fs.readFileSync('dist/client/release.json'));
const nativeRelease=JSON.parse(fs.readFileSync('www/release.json'));
assert.deepEqual(webRelease,nativeRelease);assert.equal(webRelease.buildNumber,341);
const report={workerBytes,budgetBytes,headroomBytes:budgetBytes-workerBytes,release:webRelease,offlineNetworkCalls:networkCalls,rows,limits:['Node adapter verifies bundled offline engine and image bytes; physical device and phone/iPad browser layout remain unverified.','Live release GET remains denied HTTP 403 and was not retried.']};
fs.writeFileSync('research/notes/ecclesiastes-build-verification-2026-11-04.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({workerBytes,budgetBytes,headroomBytes:report.headroomBytes,chapters:rows.length,offlineNetworkCalls:networkCalls},null,2));
