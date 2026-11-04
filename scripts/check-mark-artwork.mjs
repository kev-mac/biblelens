import fs from 'node:fs';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {Worker} from 'node:worker_threads';
import {installDeviceApi} from '../src/device-api.js';
import web from '../dist/server/index.js';
const baseline='6bd1f514ed876677ab0762695176dfb9d64dfa2e';
const read=p=>JSON.parse(fs.readFileSync(p));
const old=p=>JSON.parse(execFileSync('git',['show',baseline+':'+p],{maxBuffer:100*1024*1024}));
const source=read('data/chapters.json'), images=read('data/chapter-images.json'), stories=read('data/story-images.json');
assert.deepEqual(source,old('data/chapters.json'));assert.deepEqual(read('data/stories.json'),old('data/stories.json'));assert.deepEqual(stories,old('data/story-images.json'));
for(const [key,value]of Object.entries(old('data/chapter-images.json')))assert.deepEqual(images[key],value);
const originalFetch=globalThis.fetch,pin=read('data/hosted-artwork.json');
globalThis.fetch=async(url,options)=>{assert(String(url).startsWith('https://raw.githubusercontent.com/kev-mac/biblelens/'+pin.sourceCommit+'/src/assets/'));assert.deepEqual(options.headers,{accept:'image/webp'});return new Response(fs.readFileSync('src'+new URL(url).pathname.split('/src')[1]),{headers:{'content-type':'image/webp'}});};
const get=async path=>{const r=await web.fetch(new Request('https://biblelens.test'+path),{},{});assert.equal(r.status,200);return r;};
class DeviceWorker{
 constructor(){this.worker=new Worker(`const {parentPort}=require('node:worker_threads');globalThis.fetch=()=>{throw Error('Network forbidden');};globalThis.self={postMessage:data=>parentPort.postMessage(data)};import(${JSON.stringify(new URL('../www/device-api-worker.js',import.meta.url).href)}).then(()=>parentPort.on('message',data=>self.onmessage({data})));`,{eval:true});this.worker.on('message',data=>this.onmessage?.({data}));this.worker.on('error',e=>this.onerror?.(e));}
 postMessage(d){this.worker.postMessage(d);} terminate(){this.worker.terminate();}
}
let networkCalls=0;const target={Worker:DeviceWorker,location:{href:'https://device.test/',origin:'https://device.test'},fetch:async()=>{networkCalls++;throw Error('Network forbidden');}};
const restore=installDeviceApi(target),coverage=[],headings={},blanks=[];
try{
 for(const key of Object.keys(source)){const [book,chapter]=key.split(':');const data=await(await get('/api/chapter?book='+book+'&chapter='+chapter)).json();headings[key]=data.eventHeadings;}
 for(let n=1;n<=16;n++){
  const key='40:'+n,path='/api/chapter?book=40&chapter='+n,online=await(await get(path)).json(),offline=await(await target.fetch(path)).json();
  const raw=JSON.parse(zlib.gunzipSync(Buffer.from(source[key],'base64')));
  assert.deepEqual(offline.chapterImages||[],images[key]||[]);assert.deepEqual(online.chapterImages||[],images[key]||[]);assert.deepEqual(online.eventHeadings,offline.eventHeadings);
  for(const data of [online,offline])for(const v of data.verses)for(const edition of ['kjv','asv','web']){assert.equal(typeof v[edition],'string');assert.equal(v[edition],raw.verses.find(x=>x.n===v.n)[edition]);if(data===offline&&!v[edition])blanks.push({chapter:n,verse:v.n,edition});}
  const art=[...(images[key]||[]).map(a=>({...a,verse:0,kind:'chapter'})),...Object.entries(online.eventHeadings).flatMap(([verse,titles])=>titles.filter(t=>stories[t]).map(t=>({...stories[t],verse:+verse,kind:'story',title:t})))];
  assert.equal(art.filter(a=>a.verse<=1).length,1,'Exactly one opener for '+key);
  for(const a of art){const bytes=fs.readFileSync('src'+a.src);assert.deepEqual(bytes,fs.readFileSync('www'+a.src));assert.deepEqual(bytes,Buffer.from(await(await get(a.src)).arrayBuffer()));}
  coverage.push({chapter:n,placements:art});
 }
 assert.equal(networkCalls,0);
 const priorImages=old('data/chapter-images.json');
 const spacing={};
 for(const coord of [0,1]){
  function positions(chapterImages){let offset=0,result=[];for(let b=0;b<66;b++)for(let n=1;source[b+':'+n];n++){
   let key=b+':'+n,raw=JSON.parse(zlib.gunzipSync(Buffer.from(source[key],'base64')));
   for(const a of chapterImages[key]||[])result.push({key,verse:a.afterVerse===0?coord:a.afterVerse,pos:offset+(a.afterVerse===0?coord:a.afterVerse),src:a.src});
   for(const [v,tt]of Object.entries(headings[key]||{}))for(const t of tt)if(stories[t])result.push({key,verse:+v,pos:offset+(+v),src:stories[t].src});
   offset+=raw.verses.length;
  }return result.sort((a,b)=>a.pos-b.pos);}
  function pairs(pp,adjacent){const out=[];for(let i=0;i<pp.length;i++)for(let j=i+1;j<pp.length&&(adjacent?j===i+1:true);j++){let distance=pp[j].pos-pp[i].pos;if(distance>=5)break;out.push({a:pp[i],b:pp[j],distance});}return out;}
  const before=positions(priorImages),after=positions(images),ba=pairs(before,true),aa=pairs(after,true),ball=pairs(before,false),all=pairs(after,false);
  assert.deepEqual(aa,ba);assert.deepEqual(all,ball);assert.equal(ba.length,coord===0?63:67);assert.equal(ball.length,coord===0?64:68);
  const boundaries=[];for(let i=1;i<after.length;i++){if((after[i-1].key.startsWith('39:')&&after[i].key.startsWith('40:'))||(after[i-1].key.startsWith('40:')&&after[i].key.startsWith('41:')))boundaries.push({a:after[i-1],b:after[i],distance:after[i].pos-after[i-1].pos});}
  spacing['openerAtVerse'+coord]={baselineAdjacent:ba.length,currentAdjacent:aa.length,baselineAll:ball.length,currentAll:all.length,inheritedAdjacent:aa,inheritedAll:all,markNearPairs:all.filter(p=>[p.a,p.b].some(x=>x.key.startsWith('40:'))),boundaries};
 }
 const report={baseline,coverage,blanks,networkCalls,spacing,scripture:'exact source equality in all three editions',parity:'source/local web fixture/offline bytes; not actual public-origin or live verification'};
 fs.writeFileSync('research/notes/mark-artwork-audit-2026-11-04.json',JSON.stringify(report,null,2)+'\n');console.log('PASS: all 16 Mark chapters, 21 placements, single openers, all editions unchanged, source/web/offline bytes, zero network; reconciled complete-canon spacing unchanged.');
}finally{restore();globalThis.fetch=originalFetch;}
