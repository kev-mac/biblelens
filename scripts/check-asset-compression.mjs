import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
import worker from '../dist/server/index.js';
const get=(path,encoding)=>worker.fetch(new Request('https://biblelens.test'+path,{headers:encoding?{'accept-encoding':encoding}:{}}),{},{});
const manifest=await(await get('/assets/startup-manifest.json')).json();
for(const path of ['/',manifest.js.path,manifest.css.path,'/reference/places.json']){
 const plain=await get(path),original=Buffer.from(await plain.arrayBuffer());assert.equal(plain.headers.get('content-encoding'),null);
 const zipped=await get(path,'br, gzip, deflate');assert.equal(zipped.headers.get('content-encoding'),'gzip');assert.equal(zipped.headers.get('vary'),'Accept-Encoding');
 const body=Buffer.from(await zipped.arrayBuffer());assert.deepEqual(gunzipSync(body),original);assert(body.length<original.length);
 for(const encoding of ['gzip;q=0, *;q=1','identity','br'])assert.equal((await get(path,encoding)).headers.get('content-encoding'),null);
 assert.equal((await get(path,'*;q=0.5')).headers.get('content-encoding'),'gzip');
}
const binary=await get('/assets/explore-evidence.webp','gzip');assert.equal(binary.headers.get('content-encoding'),null);assert.equal(binary.headers.get('content-type'),'image/webp');
console.log('PASS: gzip negotiation, explicit refusal, unchanged decoded HTML/JS/CSS/reference data, and binary assets.');
