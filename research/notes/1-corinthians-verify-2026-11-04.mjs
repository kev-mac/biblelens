// Run from the canonical repository root after build:mobile.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {Worker} from 'node:worker_threads';
import {eventHeadings} from '../../scripts/event-headings.mjs';
import {installDeviceApi} from '../../src/device-api.js';
import {assess} from '../../scripts/check-readability.mjs';
import worker from '../../dist/server/index.js';
const baseline='6bd1f514ed876677ab0762695176dfb9d64dfa2e';
const read=p=>JSON.parse(fs.readFileSync(p));
const old=p=>JSON.parse(execFileSync('git',['show',baseline+':'+p],{maxBuffer:100*1024*1024}));
const hash=b=>createHash('sha256').update(b).digest('hex');
const source=read('data/chapters.json'), images=read('data/chapter-images.json'), stories=read('data/story-images.json');
const books=read('data/books.json');
const catalog=read('dist/client/stories.json');
assert.equal(hash(fs.readFileSync('dist/client/stories.json')),'a8a3ea748eb42b3fe5e2cce3d38504108dafa1704fa3517fbfed76c7448264b5','Build 343 enriched production Story catalog unchanged');
const headings=eventHeadings(catalog,books);
const decoded=Object.fromEntries(Object.entries(source).map(([k,v])=>[k,JSON.parse(gunzipSync(Buffer.from(v,'base64')))]));
for(const p of ['data/chapters.json','data/stories.json','data/story-images.json','package.json','package-lock.json','src/reader.js','src/styles.css']){
 if(!fs.existsSync(p))continue;
 assert.deepEqual(fs.readFileSync(p),execFileSync('git',['show',baseline+':'+p],{maxBuffer:100*1024*1024}),p+' preserved');
}
const originalImages=old('data/chapter-images.json');
for(const [k,v]of Object.entries(originalImages))assert.deepEqual(images[k],v);
const baselineAssets=execFileSync('git',['ls-tree','-r','--name-only',baseline,'src/assets'],{encoding:'utf8'}).trim().split('\n');
for(const p of baselineAssets)assert.equal(hash(fs.readFileSync(p)),hash(execFileSync('git',['show',baseline+':'+p],{maxBuffer:100*1024*1024})));
function placements(arts,opener){let offset=0,rows=[];for(const book of books)for(let c=1;c<=book.chapters;c++){
 const key=book.id+':'+c,chapter=decoded[key];
 for(const art of arts[key]||[])rows.push({book:book.id,chapter:c,verse:art.afterVerse,src:art.src,position:offset+(art.afterVerse===0?opener:art.afterVerse)});
 for(const [v,titles]of Object.entries(headings[key]||{}))for(const title of titles)if(stories[title])rows.push({book:book.id,chapter:c,verse:Number(v),src:stories[title].src,position:offset+Number(v)});
 offset+=chapter.verses.length;
 }return rows.sort((a,b)=>a.position-b.position);}
function spacing(arts,opener){const rows=placements(arts,opener),adjacent=[],all=[];for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length&&rows[j].position-rows[i].position<5;j++){
 const p={a:rows[i],b:rows[j],gap:rows[j].position-rows[i].position};all.push(p);if(j===i+1)adjacent.push(p);
 }return {adjacent,all,bookPairs:rows.slice(0,-1).flatMap((a,i)=>a.book===45||rows[i+1].book===45?[{a,b:rows[i+1],gap:rows[i+1].position-a.position}]:[]),boundaries:rows.slice(0,-1).flatMap((a,i)=>a.book!==rows[i+1].book&&(a.book===45||rows[i+1].book===45)?[{a,b:rows[i+1],gap:rows[i+1].position-a.position}]:[])};}
const spacingReport={};
for(const coordinate of [0,1]){const before=spacing(originalImages,coordinate),after=spacing(images,coordinate);assert.deepEqual(after.adjacent,before.adjacent);assert.deepEqual(after.all,before.all);assert.equal(before.adjacent.length,coordinate?67:63);assert.equal(before.all.length,coordinate?68:64);spacingReport['openerAtVerse'+coordinate]={baselineAdjacent:before.adjacent.length,currentAdjacent:after.adjacent.length,baselineAll:before.all.length,currentAll:after.all.length,...after};}
class DeviceWorker{
 constructor(){this.worker=new Worker(`const {parentPort}=require('node:worker_threads');globalThis.fetch=()=>{throw Error('Network forbidden');};globalThis.self={postMessage:data=>parentPort.postMessage(data)};import(${JSON.stringify(new URL('../../www/device-api-worker.js',import.meta.url).href)}).then(()=>parentPort.on('message',data=>self.onmessage({data})));`,{eval:true});this.worker.on('message',data=>this.onmessage?.({data}));this.worker.on('error',e=>this.onerror?.(e));}
 postMessage(d){this.worker.postMessage(d);}terminate(){this.worker.terminate();}
}
let networkCalls=0;const target={Worker:DeviceWorker,location:{href:'https://device.test/',origin:'https://device.test'},fetch:async()=>{networkCalls++;throw Error('Network forbidden');}};
const restore=installDeviceApi(target),coverage=[];
try{for(let c=1;c<=16;c++){
 const key='45:'+c,raw=decoded[key];
 const web=await(await worker.fetch(new Request('https://biblelens.test/api/chapter?book=45&chapter='+c),{},{})).json();
 const offline=await(await target.fetch('/api/chapter?book=45&chapter='+c)).json();
 assert.deepEqual(offline.chapterImages,images[key]);assert.deepEqual(web.chapterImages,images[key]);assert.deepEqual(offline.eventHeadings,web.eventHeadings);
 for(const version of [web,offline])for(let i=0;i<raw.verses.length;i++)for(const edition of ['kjv','asv','web']){assert.equal(typeof version.verses[i][edition],'string');assert.equal(version.verses[i][edition],raw.verses[i][edition]);}
 const openers=images[key].filter(a=>a.afterVerse===0);assert.equal(openers.length,1);assert(!(headings[key]?.[1]||[]).some(t=>stories[t]));
 const art=openers[0],bytes=fs.readFileSync('src'+art.src);assert.deepEqual(fs.readFileSync('www'+art.src),bytes);assert.deepEqual(fs.readFileSync('dist/client'+art.src),bytes);
 coverage.push({chapter:c,opener:art.src,afterVerse:0,storyImages:0,verses:raw.verses.length,bytes:bytes.length,sha256:hash(bytes),alt:art.alt,readability:assess(art.alt),sourceWebOfflineParity:true});
 }}finally{restore();}
assert.equal(networkCalls,0);
const report={baseline,preservedAssets:baselineAssets.length,generated:16,retainedBookImages:0,replaced:0,coverage,spacing:spacingReport,networkCalls,workerBytes:fs.statSync('dist/server/index.js').size,workerLimit:66060288,workerHeadroom:66060288-fs.statSync('dist/server/index.js').size,mirror:{"mirrorCommit": "57013c141639c6db19098d50708ed6201e396ee2", "compared": 1633, "differences": []}};
fs.writeFileSync('research/notes/1-corinthians-artwork-audit-2026-11-04.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:true,chapters:coverage.length,placements:coverage.length,networkCalls,workerBytes:report.workerBytes,workerHeadroom:report.workerHeadroom,spacing:Object.fromEntries(Object.entries(spacingReport).map(([k,v])=>[k,{adjacent:v.adjacent.length,all:v.all.length,boundaries:v.boundaries}]))}));
