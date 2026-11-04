import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {Worker} from 'node:worker_threads';
import {createHash} from 'node:crypto';
import {installDeviceApi} from '../src/device-api.js';
import {eventHeadings} from './event-headings.mjs';
import worker from '../dist/server/index.js';

const baseline='6bd1f514ed876677ab0762695176dfb9d64dfa2e';
const json=p=>JSON.parse(fs.readFileSync(p));
const old=p=>JSON.parse(execFileSync('git',['show',baseline+':'+p],{maxBuffer:64*1024*1024}));
const chapters=json('data/chapters.json'), images=json('data/chapter-images.json'), stories=json('data/story-images.json');
for(const p of ['data/chapters.json','data/stories.json','package.json','package-lock.json'])assert.deepEqual(json(p),old(p),'Preserve baseline '+p);
for(const [key,value]of Object.entries(old('data/chapter-images.json')))assert.deepEqual(images[key],value,'Earlier coverage '+key);
const production=json('dist/client/stories.json'), headings=eventHeadings(production,json('data/books.json'));
const productionCatalogHash=createHash('sha256').update(fs.readFileSync('dist/client/stories.json')).digest('hex');
assert.equal(productionCatalogHash,'a8a3ea748eb42b3fe5e2cce3d38504108dafa1704fa3517fbfed76c7448264b5','Exact build 343 reconciled production Story catalog');
const previous=JSON.parse(execFileSync('git',['show',baseline+':research/notes/obadiah-matthew-combined-source-verification-2026-11-04.json']));
const context={esc:value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')};vm.createContext(context);
const reader=fs.readFileSync('src/reader.js','utf8'),storyRenderer=fs.readFileSync('src/stories.js','utf8');
vm.runInContext(reader.slice(0,reader.indexOf('let selectedVerses=')),context);
vm.runInContext(storyRenderer.slice(0,storyRenderer.indexOf('let storiesActive=')).replace('/*__STORY_IMAGES__*/{}',JSON.stringify(stories)),context);
assert(reader.includes('${readerChapterIllustrations(reading,0)}${reading.verses.map'));
assert(/#chapter-text \.story-illustration figcaption\{[^}]*font:italic/.test(fs.readFileSync('src/overrides.css','utf8')));
class DeviceWorker{
 constructor(){this.worker=new Worker(`const {parentPort}=require('node:worker_threads');globalThis.fetch=()=>{throw Error('Network forbidden');};globalThis.self={postMessage:data=>parentPort.postMessage(data)};import(${JSON.stringify(new URL('../www/device-api-worker.js',import.meta.url).href)}).then(()=>parentPort.on('message',data=>self.onmessage({data})));`,{eval:true});this.worker.on('message',data=>this.onmessage?.({data}));this.worker.on('error',error=>this.onerror?.(error));}
 postMessage(data){this.worker.postMessage(data);}terminate(){this.worker.terminate();}
}
let networkCalls=0;const target={Worker:DeviceWorker,location:{href:'https://device.test/',origin:'https://device.test'},fetch:async()=>{networkCalls++;throw Error('Network forbidden');}};
const restore=installDeviceApi(target),originFetch=globalThis.fetch,pin=json('data/hosted-artwork.json');
globalThis.fetch=async(url,options)=>{const prefix='https://raw.githubusercontent.com/kev-mac/biblelens/'+pin.sourceCommit+'/src';assert(String(url).startsWith(prefix));assert.deepEqual(options.headers,{accept:'image/webp'});const src=String(url).slice(prefix.length);assert(pin.assets.includes(src));return new Response(fs.readFileSync('src'+src),{headers:{'content-type':'image/webp'}});};
const coverage=[];let placements=0;
try{for(let chapter=1;chapter<=28;chapter++){
 const key='43:'+chapter,path='/api/chapter?book=43&chapter='+chapter;
 const web=await(await worker.fetch(new Request('https://biblelens.test'+path),{},{})).json();
 const offline=await(await target.fetch(path)).json();
 const raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
 assert.deepEqual(web.eventHeadings,headings[key]||{});assert.deepEqual(offline.eventHeadings,web.eventHeadings);
 assert.deepEqual(web.chapterImages||[],images[key]||[]);assert.deepEqual(offline.chapterImages,web.chapterImages);
 for(const data of [web,offline])for(const verse of data.verses)for(const edition of ['kjv','asv','web']){assert.equal(typeof verse[edition],'string');assert.equal(verse[edition],raw.verses.find(v=>v.n===verse.n)[edition]);}
 const openers=(images[key]||[]).filter(a=>a.afterVerse===0),titles=(web.eventHeadings[1]||[]).filter(t=>stories[t]);assert.equal(openers.length+titles.length,1,key);
 const art=[...(images[key]||[]),...Object.values(web.eventHeadings).flat().filter(t=>stories[t]).map(t=>stories[t])];
 for(const a of art){assert(a.alt.length>20);const r=await worker.fetch(new Request('https://biblelens.test'+a.src),{},{});assert.equal(r.status,200);assert.deepEqual(Buffer.from(await r.arrayBuffer()),fs.readFileSync('src'+a.src));assert.deepEqual(fs.readFileSync('src'+a.src),fs.readFileSync('www'+a.src));placements++;}
 for(const a of openers){const html=context.readerChapterIllustrations(web,0);assert(html.includes(a.src)&&html.includes('Imagined scene: ')&&!html.includes('<figcaption>'));}
 for(const title of Object.values(web.eventHeadings).flat().filter(t=>stories[t]))assert(context.readerStoryEvent(title).includes('<figcaption>Imagined scene: '));
 coverage.push({chapter,opener:openers[0]?.src||stories[titles[0]].src,kind:openers.length?'chapter':'Story',placements:art.map(a=>a.src),verses:raw.verses.length});
}}finally{restore();globalThis.fetch=originFetch;}
assert.equal(networkCalls,0);assert.equal(coverage.filter(x=>x.kind==='chapter').length,12);assert.equal(placements,29);
function spacing(chapterArt,storyArt,coordinate){let position=0;const events=[];for(let book=0;book<66;book++)for(let chapter=1;chapters[book+':'+chapter];chapter++){const key=book+':'+chapter,raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));for(const a of chapterArt[key]||[])events.push({book,chapter,verse:a.afterVerse,position:position+(a.afterVerse||coordinate),src:a.src});for(const [verse,titles]of Object.entries(headings[key]||{}))for(const title of titles)if(storyArt[title])events.push({book,chapter,verse:+verse,position:position+ +verse,src:storyArt[title].src});position+=raw.verses.length;}events.sort((a,b)=>a.position-b.position);const adjacent=[],all=[];for(let i=0;i<events.length;i++)for(let j=i+1;j<events.length&&events[j].position-events[i].position<5;j++){const pair={a:events[i],b:events[j],gap:events[j].position-events[i].position};all.push(pair);if(j===i+1)adjacent.push(pair);}return{adjacent,all,boundaries:events.filter(x=>[42,43,44].includes(x.book))};}
const ledger={};for(const coordinate of [0,1]){const before=spacing(old('data/chapter-images.json'),old('data/story-images.json'),coordinate),after=spacing(images,stories,coordinate);assert.equal(before.adjacent.length,coordinate?67:63);assert.equal(before.all.length,coordinate?68:64);assert.deepEqual(after.adjacent,before.adjacent);assert.deepEqual(after.all,before.all);ledger[coordinate]={baselineAdjacent:before.adjacent.length,baselineAll:before.all.length,...after};}
const report={baseline,productionCatalogHash,chapters:28,coverage,placements,networkCalls,sourceWebOfflineParity:true,scriptureExact:true,spacing:ledger,baselineReleaseEvidenceKeys:Object.keys(previous)};
fs.writeFileSync('research/notes/acts-artwork-verification-2026-11-04.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS: Acts 28 single openers (12 chapter / 16 Story), 29 placements, exact scripture/source/web/offline bytes, captions, offline engine, zero network; complete-canon close pairs unchanged at both coordinate conventions.');
