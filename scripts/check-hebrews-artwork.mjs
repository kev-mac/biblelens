import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {Worker} from 'node:worker_threads';
import {createHash} from 'node:crypto';
import {installDeviceApi} from '../src/device-api.js';
import {eventHeadings} from './event-headings.mjs';
import {assess} from './check-readability.mjs';
import worker from '../dist/server/index.js';

const baseline='5a33980ae6e7e25ad9b0dfb345d8da52229226d9';
const json=p=>JSON.parse(fs.readFileSync(p));
const oldBytes=p=>execFileSync('git',['show',baseline+':'+p],{maxBuffer:64*1024*1024});
const old=p=>JSON.parse(oldBytes(p));
const hash=b=>createHash('sha256').update(b).digest('hex');
const chapters=json('data/chapters.json'),images=json('data/chapter-images.json'),stories=json('data/story-images.json');
for(const p of ['data/chapters.json','data/stories.json','data/story-images.json','package.json','package-lock.json','src/reader.js','src/stories.js','src/overrides.css'])assert.deepEqual(fs.readFileSync(p),oldBytes(p),'Preserve exact baseline '+p);
for(const [key,value]of Object.entries(old('data/chapter-images.json')))assert.deepEqual(images[key],value,'Earlier coverage '+key);
const baselineAssets=execFileSync('git',['ls-tree','-r','--name-only',baseline,'src/assets'],{encoding:'utf8'}).trim().split('\n');
for(const p of baselineAssets)assert.equal(hash(fs.readFileSync(p)),hash(oldBytes(p)),'Preserve baseline asset '+p);
const production=json('dist/client/stories.json'),headings=eventHeadings(production,json('data/books.json'));
assert.equal(hash(fs.readFileSync('dist/client/stories.json')),hash(fs.readFileSync('www/stories.json')));
assert.deepEqual(headings['57:8'],{'6':['New Covenant']});
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
const coverage=[];let placements=0,editionFields=0,blankFields=0,absentFields=0;
try{for(let chapter=1;chapter<=13;chapter++){
 const key='57:'+chapter,path='/api/chapter?book=57&chapter='+chapter;
 const web=await(await worker.fetch(new Request('https://biblelens.test'+path),{},{})).json();
 const offline=await(await target.fetch(path)).json();
 const raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
 assert.deepEqual(web.eventHeadings,headings[key]||{});assert.deepEqual(offline.eventHeadings,web.eventHeadings);
 assert.deepEqual(web.chapterImages||[],images[key]||[]);assert.deepEqual(offline.chapterImages,web.chapterImages);
 for(const data of [web,offline]){assert.equal(data.verses.length,raw.verses.length);for(const verse of data.verses)for(const edition of ['kjv','asv','web']){const source=raw.verses.find(v=>v.n===verse.n);assert.equal(Object.hasOwn(verse,edition),Object.hasOwn(source,edition));assert.equal(verse[edition],source[edition]);}}
 for(const v of raw.verses)for(const e of ['kjv','asv','web']){editionFields++;if(!Object.hasOwn(v,e))absentFields++;else if(v[e]==='')blankFields++;}
 const openers=(images[key]||[]).filter(a=>a.afterVerse===0),titles=(web.eventHeadings[1]||[]).filter(t=>stories[t]);assert.equal(openers.length+titles.length,1,key);
 const art=[...(images[key]||[]),...Object.values(web.eventHeadings).flat().filter(t=>stories[t]).map(t=>stories[t])];
 for(const a of art){assert(a.alt.length>20);const r=await worker.fetch(new Request('https://biblelens.test'+a.src),{},{});assert.equal(r.status,200);assert.deepEqual(Buffer.from(await r.arrayBuffer()),fs.readFileSync('src'+a.src));assert.deepEqual(fs.readFileSync('src'+a.src),fs.readFileSync('www'+a.src));placements++;}
 const html=context.readerChapterIllustrations(web,0);assert(html.includes(openers[0].src)&&html.includes('Imagined scene: ')&&!html.includes('<figcaption>'));
 for(const title of Object.values(web.eventHeadings).flat().filter(t=>stories[t]))assert(context.readerStoryEvent(title).includes('<figcaption>Imagined scene: '));
 coverage.push({chapter,opener:openers[0].src,kind:'chapter',placements:art.map(a=>a.src),verses:raw.verses.length});
}}finally{restore();globalThis.fetch=originFetch;}
assert.equal(networkCalls,0);assert.equal(placements,14);
function spacing(chapterArt,coordinate){let position=0;const events=[];for(let book=0;book<66;book++)for(let chapter=1;chapters[book+':'+chapter];chapter++){const key=book+':'+chapter,raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));for(const a of chapterArt[key]||[])events.push({book,chapter,verse:a.afterVerse,position:position+(a.afterVerse||coordinate),src:a.src});for(const [verse,titles]of Object.entries(headings[key]||{}))for(const title of titles)if(stories[title])events.push({book,chapter,verse:+verse,position:position+ +verse,src:stories[title].src});position+=raw.verses.length;}events.sort((a,b)=>a.position-b.position);const adjacent=[],all=[];for(let i=0;i<events.length;i++)for(let j=i+1;j<events.length&&events[j].position-events[i].position<5;j++){const pair={a:events[i],b:events[j],gap:events[j].position-events[i].position};all.push(pair);if(j===i+1)adjacent.push(pair);}const related=events.map((b,i)=>i?{a:events[i-1],b,gap:b.position-events[i-1].position}:null).filter(p=>p&&(p.a.book===57||p.b.book===57));return{adjacent,all,hebrewsNeighbors:related,philemonHebrewsJames:events.filter(x=>[56,57,58].includes(x.book))};}
const ledger={};for(const coordinate of [0,1]){const before=spacing(old('data/chapter-images.json'),coordinate),after=spacing(images,coordinate);assert.equal(before.adjacent.length,coordinate?69:64);assert.equal(before.all.length,coordinate?70:65);assert.deepEqual(after.adjacent,before.adjacent);assert.deepEqual(after.all,before.all);ledger[coordinate]={baselineAdjacent:before.adjacent.length,baselineAll:before.all.length,...after};}
const readability=coverage.map(c=>({chapter:c.chapter,alt:images['57:'+c.chapter][0].alt,...assess(images['57:'+c.chapter][0].alt)}));
assert(readability.every(r=>!r.tooLong&&!r.unexplained));const grade=readability.reduce((n,r)=>n+r.grade,0)/readability.length;assert(grade<=8);
const report={baseline,productionCatalogHash:hash(fs.readFileSync('dist/client/stories.json')),baselineAssetsPreserved:baselineAssets.length,chapters:13,coverage,placements,networkCalls,editionFields,blankFields,absentFields,sourceWebOfflineParity:true,scriptureExactPresenceAndValues:true,localOriginFixtureOnly:true,spacing:ledger,readability:{meanGrade:grade,results:readability}};
fs.writeFileSync('research/notes/hebrews-artwork-verification-2026-11-04.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS: Hebrews 13 single openers, 14 placements; baseline source/assets preserved; exact edition field presence/values; source/web/offline bytes; captions; actual offline engine, zero network; both complete-canon spacing conventions unchanged; new alt mean grade '+grade.toFixed(2));
