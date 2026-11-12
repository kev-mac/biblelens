import assert from 'node:assert/strict';
import {createChapterLoader} from '../src/chapter-cache.js';
import {installDeviceApi} from '../src/device-api.js';

const chapter = {name:'Genesis', chapter:1, verses:[{n:1,kjv:'In the beginning'}]};
const flush = async () => {for (let i=0;i<10;i++) await Promise.resolve();};
function fixture({abort=true,limit=64}={}) {
 const requests=[],timers=new Map();let id=0;
 const target={fetch:(url,options)=>new Promise((resolve,reject)=>requests.push({url,options,resolve,reject})),setTimeout(fn,ms){timers.set(++id,{fn,ms});return id;},clearTimeout(id){timers.delete(id);}};
 if(abort)target.AbortController=AbortController;
 return {target,requests,timers,loader:createChapterLoader(target,{limit}),expire(ms){const timer=[...timers.values()].find(timer=>timer.ms===ms);assert(timer);timer.fn();}};
}
const respond=(request,value=chapter)=>request.resolve({ok:true,json:async()=>value});
const shared=fixture();
const a=shared.loader.get(0,1),b=shared.loader.get(0,1);
assert.equal(shared.requests.length,1);respond(shared.requests[0]);
assert.equal(await a,chapter);assert.equal(await b,chapter);assert.equal(shared.timers.size,0);
assert.equal(await shared.loader.json('/api/chapter?book=0&chapter=1'),chapter);assert.equal(shared.requests.length,1);
await assert.rejects(shared.loader.json('/api/sync/document'),/public reader/);
await assert.rejects(shared.loader.json('https://elsewhere.invalid/api/chapter?book=0&chapter=1'),/public reader/);
for(const values of [[-1,1],[0,0],[0,1.2],[NaN,1]])await assert.rejects(shared.loader.get(...values),/Invalid/);

// One caller leaving must not abort another caller's shared chapter.
const isolated=fixture(),one=new AbortController(),two=new AbortController();
const first=isolated.loader.get(0,1,{signal:one.signal}),second=isolated.loader.get(0,1,{signal:two.signal});
one.abort();await assert.rejects(first,{name:'AbortError'});
assert.equal(isolated.requests[0].options.signal.aborted,false);respond(isolated.requests[0]);assert.equal(await second,chapter);assert.equal(isolated.timers.size,0);
const pre=isolated.requests.length,already=new AbortController();already.abort();await assert.rejects(isolated.loader.get(0,2,{signal:already.signal}),{name:'AbortError'});assert.equal(isolated.requests.length,pre);

// Last-consumer cancellation aborts and evicts. A late response cannot poison retry.
const abandoned=fixture(),controller=new AbortController();
const cancelled=abandoned.loader.get(0,1,{signal:controller.signal});controller.abort();await assert.rejects(cancelled,{name:'AbortError'});assert(abandoned.requests[0].options.signal.aborted);
const retry=abandoned.loader.get(0,1);respond(abandoned.requests[1],{...chapter,name:'Fresh'});assert.equal((await retry).name,'Fresh');respond(abandoned.requests[0],{...chapter,name:'Stale'});await flush();assert.equal((await abandoned.loader.get(0,1)).name,'Fresh');

// Deadlines include a hanging body; transports without abort still time out.
for(const abort of [true,false]){
 const f=fixture({abort}),pending=f.loader.get(0,1);f.requests[0].resolve({ok:true,json:()=>new Promise(()=>{})});await flush();f.expire(15000);await assert.rejects(pending,{name:'TimeoutError'});assert.equal(f.timers.size,0);if(abort)assert(f.requests[0].options.signal.aborted);
 const recovery=f.loader.get(0,1);respond(f.requests[1]);assert.equal(await recovery,chapter);
}
const deadlines=fixture(),short=deadlines.loader.get(0,1),long=deadlines.loader.get(0,1,{timeoutMs:20000});
deadlines.expire(15000);await assert.rejects(short,{name:'TimeoutError'});assert(!deadlines.requests[0].options.signal.aborted);respond(deadlines.requests[0]);assert.equal(await long,chapter);

for(const malformed of [false,true]){
 const f=fixture(),pending=f.loader.get(0,1);f.requests[0].resolve(malformed?{ok:true,json:async()=>{throw Error('Malformed JSON');}}:{ok:false,status:503});await assert.rejects(pending,malformed?/Malformed/:/503/);
 const recovery=f.loader.get(0,1);respond(f.requests[1]);assert.equal(await recovery,chapter);assert.equal(f.timers.size,0);
}
const lru=fixture({limit:2});
for(const ch of [1,2]){const pending=lru.loader.get(0,ch);respond(lru.requests.at(-1),{...chapter,chapter:ch});await pending;}
await lru.loader.get(0,1);const third=lru.loader.get(0,3);respond(lru.requests.at(-1));await third;
await lru.loader.get(0,1);assert.equal(lru.requests.length,3);const evicted=lru.loader.get(0,2);assert.equal(lru.requests.length,4);respond(lru.requests.at(-1));await evicted;
const replacing=fixture({limit:1}),old=replacing.loader.get(0,1),other=replacing.loader.get(0,2),newer=replacing.loader.get(0,1);
replacing.requests[0].reject(Error('Old failure'));await assert.rejects(old);respond(replacing.requests[2]);await newer;assert.equal(await replacing.loader.get(0,1),chapter);assert.equal(replacing.requests.length,3);respond(replacing.requests[1]);await other;

// Use the actual native transport with a local engine fixture. No network.
let network=0,messages=0;
class OfflineWorker {postMessage(message){messages++;queueMicrotask(()=>this.onmessage({data:{id:message.id,status:200,headers:{'content-type':'application/json'},body:JSON.stringify(chapter)}}));}terminate(){}}
const native={fetch:async()=>{network++;throw Error('Offline');},location:{href:'http://localhost/',origin:'http://localhost'},Worker:OfflineWorker,AbortController,setTimeout,clearTimeout};
const loader=createChapterLoader(native);const stop=installDeviceApi(native);
assert.deepEqual(await loader.get(0,1),chapter);assert.deepEqual(await loader.get(0,1),chapter);assert.equal(network,0);assert.equal(messages,1);stop();
console.log('PASS: shared bounded chapter cache, independent cancellation/deadlines, failed-response retry, stale isolation, eviction, public-only endpoints and native offline transport.');
