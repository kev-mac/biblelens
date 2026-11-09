import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const phase=process.env.BIBLELENS_IMAGE_PHASE,root=process.env.BIBLELENS_BUILD_ROOT||process.cwd();assert(['before','after'].includes(phase));
const art=JSON.parse(fs.readFileSync('src/assets/explore-renditions.json')).images;
const files=Object.values(art).map(a=>phase==='before'?a.source:a.small.file),start=performance.now();
const worker=(await import(pathToFileURL(path.join(root,'dist/server/index.js')))).default,importMs=performance.now()-start,rows=[];
for(let round=0;round<4;round++){
 const cpu=process.cpuUsage(),wall=performance.now();let bytes=0;
 await Promise.all(files.map(async file=>{const r=await worker.fetch(new Request('https://images.test/assets/'+file),{},{});assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'image/webp');bytes+=(await r.arrayBuffer()).byteLength;}));
 const used=process.cpuUsage(cpu);rows.push({phase:round?'warm':'cold-isolate',wallMs:performance.now()-wall,cpuMs:(used.user+used.system)/1000,requests:files.length,bytes});
}
const output='.release/explore-image-loading/'+phase;fs.mkdirSync(output,{recursive:true});fs.writeFileSync(output+'/worker-benchmark.json',JSON.stringify({phase,environment:'Node CI generated Worker; not Cloudflare CPU or network latency',importMs,cachePolicy:'fresh process; eight concurrent public binary reads then three warm rounds',rows},null,2)+'\n');console.log('EMBEDDED BENCHMARK',JSON.stringify({phase,importMs,rows}));
