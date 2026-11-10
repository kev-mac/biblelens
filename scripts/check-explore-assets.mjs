import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const names=['ark','places','people','stories','evidence','timeline','commandments','prophecies','method'];
const originals=names.map(name=>'explore-'+name+'.webp');
assert.deepEqual(fs.readdirSync('src/assets').filter(name=>/^explore-[a-z]+\.webp$/.test(name)).sort(),originals.sort(),'Retain all nine original Explore illustrations');
const manifest=JSON.parse(fs.readFileSync('src/assets/explore-renditions.json'));
assert.equal(manifest.schemaVersion,1);assert.deepEqual(Object.keys(manifest.images).sort(),['stories','people','places','commandments','lost','evidence','timeline','hero'].sort());
const provenance=JSON.parse(fs.readFileSync('src/assets/explore-art.provenance.json')).renditionBatches.find(b=>b.id==='explore-responsive-v1');assert(provenance&&provenance.generator==='scripts/create-explore-renditions.py');assert.deepEqual(Object.keys(provenance.images).sort(),Object.keys(manifest.images).sort());
const source=fs.readFileSync('src/atlas-explore.js','utf8');assert(source.includes('/*__EXPLORE_RENDITIONS__*/{}'));
assert(!/<img\s+src=/.test(source),'Explore markup never gives hidden images an eager URL');
assert(source.includes('data-explore-srcset=')&&source.includes('loading="lazy"')&&source.includes('decoding="async"'));
function dimensions(bytes){
 assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
 for(let i=12;i+8<=bytes.length;){const type=bytes.toString('ascii',i,i+4),n=bytes.readUInt32LE(i+4),p=i+8;
  if(type==='VP8X')return [bytes.readUIntLE(p+4,3)+1,bytes.readUIntLE(p+7,3)+1];
  if(type==='VP8 ')return [bytes.readUInt16LE(p+6)&16383,bytes.readUInt16LE(p+8)&16383];
  if(type==='VP8L'){const bits=bytes.readUInt32LE(p+1);return [(bits&16383)+1,((bits>>>14)&16383)+1];}
  i=p+n+(n%2);
 }throw Error('Missing WebP dimensions');
}
const worker=(await import('./built-worker.mjs')).default,mobile=process.argv.includes('--mobile');
const get=path=>worker.fetch(new Request('https://biblelens.test'+path),{},{});
const startupManifest=await(await get('/assets/startup-manifest.json')).json(),startup=await(await get(startupManifest.js.path)).text();
const atlas=await(await get('/atlas-explore.js')).text();assert(!atlas.includes('/*__EXPLORE_RENDITIONS__*/{}'),'The build inserts the checked rendition catalog');
const engine=mobile?fs.readFileSync('www/device-engine.js','utf8'):'';
async function verify(file){
 const bytes=fs.readFileSync('src/assets/'+file),response=await get('/assets/'+file);assert.equal(response.status,200,file);assert.equal(response.headers.get('content-type'),'image/webp');
 assert.deepEqual(Buffer.from(await response.arrayBuffer()),bytes,'Worker source bytes: '+file);
 assert(!startup.includes(bytes.toString('base64')),'No illustration payload in startup: '+file);
 if(mobile){assert.deepEqual(fs.readFileSync('www/assets/'+file),bytes,'Offline bytes: '+file);assert(!engine.includes(bytes.toString('base64')),'Native API engine does not duplicate UI art');}
 return bytes;
}
for(const file of originals)await verify(file);
let oldBytes=0,smallBytes=0;
for(const [role,art]of Object.entries(manifest.images)){
 const original=fs.readFileSync('src/assets/'+art.source);const {sourceSha256,sourceBytes,...documented}=provenance.images[role];assert.deepEqual(documented,art,'Provenance matches rendition catalog');assert.equal(sourceSha256,hash(original));assert.equal(sourceBytes,original.length);assert.deepEqual(dimensions(original),[art.width,art.height]);oldBytes+=original.length;smallBytes+=art.small.bytes;
 assert.equal(art.small.width,640);assert.equal(art.small.height,Math.round(art.height*640/art.width));
 for(const variant of [art.small,art.large]){
  const bytes=await verify(variant.file);assert.equal(bytes.length,variant.bytes);assert.equal(hash(bytes),variant.sha256);assert(variant.file.endsWith('-'+variant.sha256.slice(0,12)+'.webp'));
  assert.deepEqual(dimensions(bytes),[variant.width,variant.height]);
  const response=await get('/assets/'+variant.file);assert.equal(response.headers.get('cache-control'),'public, max-age=31536000, immutable');assert.equal(response.headers.get('etag'),'"'+variant.sha256+'"');assert.equal(response.headers.get('content-length'),String(bytes.length));await response.body.cancel();
  const request=(method,headers)=>worker.fetch(new Request('https://biblelens.test/assets/'+variant.file,{method,headers}),{},{});
  const cached=await request('GET',{'if-none-match':'"other", W/"'+variant.sha256+'"'});assert.equal(cached.status,304);assert.equal((await cached.arrayBuffer()).byteLength,0);
  const head=await request('HEAD');assert.equal(head.status,200);assert.equal((await head.arrayBuffer()).byteLength,0);assert.equal(head.headers.get('etag'),'"'+variant.sha256+'"');assert.equal((await request('POST')).status,405);
  assert(atlas.includes(variant.file),'The Explore catalog includes '+role+' rendition');
 }
 assert.deepEqual(fs.readFileSync('src/assets/'+art.large.file),original,'Full rendition preserves source bytes');assert(art.small.bytes<original.length,'640px rendition saves bytes');
}
const sample=manifest.images.evidence.small,parallel=await Promise.all(Array.from({length:4},()=>get('/assets/'+sample.file)));
for(const response of parallel)assert.equal(hash(Buffer.from(await response.arrayBuffer())),sample.sha256,'Concurrent reads return independent, complete image streams');
assert.equal((await get('/')).headers.get('cache-control'),'no-cache','HTML policy is unchanged');
assert.equal((await get('/assets/explore-evidence.webp')).headers.get('cache-control'),'no-cache','Old mutable names do not get immutable caching');
console.log(`PASS: nine legacy images retained, eight current roles/16 hashed renditions, 640px dimensions and provenance bytes, strong validators/304/HEAD, unchanged HTML/legacy caching, complete concurrent streams and exact web${mobile?'/offline-native':''} parity; ${oldBytes} -> ${smallBytes} small-rendition bytes.`);
