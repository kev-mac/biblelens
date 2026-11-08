import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Worker} from 'node:worker_threads';
import worker from './built-worker.mjs';
import {installDeviceApi} from '../src/device-api.js';
import {releaseInfo} from './release-info.mjs';

// Exercise the actual offline worker, with network access rejected in both realms.
const workerUrl=new URL('../www/device-api-worker.js',import.meta.url).href;
const workers=[];
class DeviceWorker{
 constructor(){
  this.worker=new Worker(`const {parentPort}=require('node:worker_threads');globalThis.fetch=()=>{throw Error('Network forbidden');};globalThis.self={postMessage:data=>parentPort.postMessage(data)};import(${JSON.stringify(workerUrl)}).then(()=>parentPort.on('message',data=>self.onmessage({data})));`,{eval:true});
  workers.push(this.worker);
  this.worker.on('message',data=>this.onmessage?.({data}));
  this.worker.on('error',error=>this.onerror?.(error));
 }
 postMessage(data){this.worker.postMessage(data);}
 terminate(){return this.worker.terminate();}
}
let externalRequests=0;
const target={Worker:DeviceWorker,location:{href:'https://device.test/',origin:'https://device.test'},fetch:async()=>{externalRequests++;throw Error('Network forbidden');}};
const restore=installDeviceApi(target);
const records=JSON.parse(fs.readFileSync('data/evidence.json')).filter(row=>row.contradictionReview);
try{
 for(const row of records){
  const path='/api/debate?id='+encodeURIComponent(row.id);
  const web=await (await worker.fetch(new Request('https://test.invalid'+path),{},{})).json();
  const native=await (await target.fetch(path)).json();
  assert.deepEqual(web.contradictionReview,row.contradictionReview,row.id+' missing from web');
  assert.deepEqual(native,web,row.id+' differs offline');
 }
 const release=releaseInfo();
 assert.deepEqual(await (await worker.fetch(new Request('https://test.invalid/release.json'),{},{})).json(),release);
 assert.deepEqual(JSON.parse(fs.readFileSync('www/release.json')),release);
 assert.equal(externalRequests,0);
 console.log(JSON.stringify({result:'PASS',release,verifiedRecordIds:records.map(row=>row.id),externalRequests,signedNativeAssets:false},null,2));
}finally{restore();await Promise.all(workers.map(worker=>worker.terminate()));}
