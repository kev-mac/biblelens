import assert from 'node:assert/strict';
import {referenceJson} from '../src/reference-cache.js';
const {referenceJson:secondBundle}=await import('../src/reference-cache.js?other-bundle');
const original=globalThis.fetch,requests=[];
globalThis.fetch=(url,options)=>new Promise((resolve,reject)=>requests.push({url,options,resolve,reject}));
try {
 const first=referenceJson('/reference/people.json'),other=secondBundle('reference/people.json');
 assert.equal(first,other,'Separately bundled consumers share the pending promise');assert.equal(requests.length,1);
 const people=[{id:'person',name:'A person'}];requests[0].resolve({ok:true,json:async()=>people});
 assert.equal(await first,people);assert.equal(await referenceJson('/reference/people.json'),people);assert.equal(requests.length,1);
 const failed=referenceJson('/reference/places.json');requests[1].resolve({ok:false,status:503});await assert.rejects(failed,/503/);
 const retry=secondBundle('/reference/places.json');assert.equal(requests.length,3);requests[2].resolve({ok:true,json:async()=>[]});await retry;
 const malformed=referenceJson('/stories.json');requests[3].resolve({ok:true,json:async()=>{throw Error('Bad JSON');}});await assert.rejects(malformed,/Bad JSON/);
 const repaired=referenceJson('/stories.json');requests[4].resolve({ok:true,json:async()=>[]});await repaired;
 assert.throws(()=>referenceJson('/api/sync/document'),/Not a reference asset/);
 assert.equal(requests[0].options.signal.aborted,false);
 console.log('PASS: shared pending/resolved reference requests across bundles, failed HTTP/JSON retry, and exclusion of private endpoints.');
} finally {globalThis.fetch=original;}
