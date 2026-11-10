import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const phase=process.env.BIBLELENS_IMAGE_PHASE,root=process.env.BIBLELENS_BUILD_ROOT||process.cwd();assert(['before','after'].includes(phase));
const art=JSON.parse(fs.readFileSync('src/assets/explore-renditions.json')).images;
const samples=Object.entries(art).map(([role,a])=>({role,file:phase==='before'?a.source:a.small.file,...(phase==='before'?{bytes:a.large.bytes,sha256:a.large.sha256}:{bytes:a.small.bytes,sha256:a.small.sha256})}));
const expectedBytes=samples.reduce((n,s)=>n+s.bytes,0),start=performance.now();
const worker=(await import(pathToFileURL(path.join(root,'dist/server/index.js')))).default,importMs=performance.now()-start,rows=[];
for(let round=0;round<4;round++){
 const cpu=process.cpuUsage(),wall=performance.now();
 const bodies=await Promise.all(samples.map(async sample=>{const r=await worker.fetch(new Request('https://images.test/assets/'+sample.file),{},{});assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'image/webp');return Buffer.from(await r.arrayBuffer());}));
 const used=process.cpuUsage(cpu),wallMs=performance.now()-wall;
 // Validate after timing. No compound addition spans an await, and a cached
 // representation must match every original byte/hash on every warm round.
 const verified=bodies.map((body,i)=>{const sha256=createHash('sha256').update(body).digest('hex'),sample=samples[i];assert.equal(body.length,sample.bytes,sample.file+' exact length');assert.equal(sha256,sample.sha256,sample.file+' exact hash');return {role:sample.role,file:sample.file,bytes:body.length,sha256};});
 const bytes=verified.reduce((n,s)=>n+s.bytes,0);assert.equal(bytes,expectedBytes);
 rows.push({phase:round?'warm':'cold-isolate',wallMs,cpuMs:(used.user+used.system)/1000,requests:samples.length,bytes,verified});
}
const output='.release/explore-image-loading/'+phase;fs.mkdirSync(output,{recursive:true});fs.writeFileSync(output+'/worker-benchmark.json',JSON.stringify({phase,environment:'Node CI generated Worker; not Cloudflare CPU or network latency',importMs,cachePolicy:'fresh process; eight concurrent public binary reads then three warm rounds; exact length/hash verification outside timed interval',rows},null,2)+'\n');console.log('EMBEDDED BENCHMARK',JSON.stringify({phase,importMs,rows:rows.map(({verified,...timing})=>timing)}));
