import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
const get=(path,encoding)=>worker.fetch(new Request('https://biblelens.test'+path,{headers:encoding?{'accept-encoding':encoding}:{}}),{},{});
const manifest=await(await get('/assets/startup-manifest.json')).json();
for(const path of ['/',manifest.js.path,manifest.css.path,'/reference/places.json']){
 const plain=await get(path),original=Buffer.from(await plain.arrayBuffer());assert.equal(plain.headers.get('content-encoding'),null);
 for(const encoding of ['br, gzip, deflate','gzip;q=0, *;q=1','identity','br','*;q=0.5']){
  const response=await get(path,encoding);
  assert.equal(response.headers.get('content-encoding'),null);
  assert.equal(response.headers.get('vary'),null);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),original);
 }
 if(path==='/')assert.match(original.toString('utf8'),/^<!doctype/i);
}
const binary=await get('/assets/explore-evidence.webp','gzip');assert.equal(binary.headers.get('content-encoding'),null);assert.equal(binary.headers.get('content-type'),'image/webp');
console.log('PASS: packaged identity HTML/JS/CSS/reference and binary assets remain unchanged for every compression preference.');
