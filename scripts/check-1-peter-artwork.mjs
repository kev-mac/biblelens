import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {Worker} from 'node:worker_threads';
import {createHash} from 'node:crypto';
import {installDeviceApi} from '../src/device-api.js';
import {eventHeadings} from './event-headings.mjs';
import {validateChapterImages,illustratedBooks} from './chapter-images.mjs';
import {hostedArtwork} from './hosted-artwork.mjs';
import worker from '../dist/server/index.js';
const baseline='5a33980ae6e7e25ad9b0dfb345d8da52229226d9',directory='research/notes/1-peter-artwork-2026-11-04/';
const json=p=>JSON.parse(fs.readFileSync(p));
const git=args=>execFileSync('git',args,{maxBuffer:128*1024*1024});
const old=p=>JSON.parse(git(['show',baseline+':'+p]));
const chapters=json('data/chapters.json'),images=json('data/chapter-images.json'),stories=json('data/story-images.json');
for(const p of ['data/chapters.json','data/stories.json','data/story-images.json','src/reader.js','src/stories.js','src/overrides.css','package.json','package-lock.json'])assert.deepEqual(fs.readFileSync(p),git(['show',baseline+':'+p]),'Exact baseline bytes '+p);
for(const [key,value]of Object.entries(old('data/chapter-images.json')))assert.deepEqual(images[key],value);
const assetRows=git(['ls-tree','-r',baseline,'src/assets']).toString().trim().split('\n').map(l=>{const [meta,path]=l.split('\t');return {path,blob:meta.split(' ')[2]};});
for(const row of assetRows){const actual=execFileSync('git',['hash-object','--no-filters',row.path],{encoding:'utf8'}).trim();assert.equal(actual,row.blob,row.path);}
const catalog=json('dist/client/stories.json'),headings=eventHeadings(catalog,json('data/books.json'));
// All catalog inputs and transforms remain byte-identical, preserving enriched production headings.
for(const p of ['scripts/story-topics.mjs','scripts/event-headings.mjs','data/reference/topics.json'])assert.deepEqual(fs.readFileSync(p),git(['show',baseline+':'+p]));
validateChapterImages(images,chapters,headings,stories);
const context={esc:value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')};vm.createContext(context);
const reader=fs.readFileSync('src/reader.js','utf8');vm.runInContext(reader.slice(0,reader.indexOf('let selectedVerses=')),context);
assert(reader.includes('${readerChapterIllustrations(reading,0)}${reading.verses.map'));
assert(/#chapter-text \.story-illustration figcaption\{[^}]*font:italic/.test(fs.readFileSync('src/overrides.css','utf8')));
class DeviceWorker{
 constructor(){this.worker=new Worker(`const {parentPort}=require('node:worker_threads');globalThis.fetch=()=>{throw Error('Network forbidden');};globalThis.self={postMessage:data=>parentPort.postMessage(data)};import(${JSON.stringify(new URL('../www/device-api-worker.js',import.meta.url).href)}).then(()=>parentPort.on('message',data=>self.onmessage({data})));`,{eval:true});this.worker.on('message',data=>this.onmessage?.({data}));this.worker.on('error',error=>this.onerror?.(error));}
 postMessage(data){this.worker.postMessage(data);}terminate(){this.worker.terminate();}
}
let networkCalls=0;const target={Worker:DeviceWorker,location:{href:'https://device.test/',origin:'https://device.test'},fetch:async()=>{networkCalls++;throw Error('Network forbidden');}};
const restore=installDeviceApi(target),originFetch=globalThis.fetch,pin=json('data/hosted-artwork.json');
globalThis.fetch=async(url,options)=>{const prefix='https://raw.githubusercontent.com/kev-mac/biblelens/'+pin.sourceCommit+'/src';assert(String(url).startsWith(prefix));assert.deepEqual(options.headers,{accept:'image/webp'});const src=String(url).slice(prefix.length);assert(pin.assets.includes(src));return new Response(fs.readFileSync('src'+src),{headers:{'content-type':'image/webp'}});};
const coverage=[];let blanks=0,absent=0;
try{for(let chapter=1;chapter<=5;chapter++){
 const key='59:'+chapter,path='/api/chapter?book=59&chapter='+chapter;
 const response=await worker.fetch(new Request('https://biblelens.test'+path),{},{});assert.equal(response.status,200);
 const web=await response.json(),offline=await(await target.fetch(path)).json(),raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
 assert.deepEqual(web.eventHeadings,headings[key]||{});assert.deepEqual(offline.eventHeadings,web.eventHeadings);
 assert.deepEqual(web.chapterImages,images[key]);assert.deepEqual(offline.chapterImages,web.chapterImages);
 for(const data of [web,offline]){assert.equal(data.verses.length,raw.verses.length);for(const verse of data.verses)for(const edition of ['kjv','asv','web']){const source=raw.verses.find(v=>v.n===verse.n);assert.equal(Object.hasOwn(verse,edition),Object.hasOwn(source,edition),'Exact field presence');assert.deepEqual(verse[edition],source[edition],'Exact edition value');}}
 for(const v of raw.verses)for(const edition of ['kjv','asv','web']){if(!Object.hasOwn(v,edition))absent++;if(v[edition]==='')blanks++;}
 const openers=(images[key]||[]).filter(a=>a.afterVerse===0),titles=(web.eventHeadings[1]||[]).filter(t=>stories[t]);assert.equal(openers.length+titles.length,1,key);
 assert.equal(Object.values(web.eventHeadings).flat().filter(t=>stories[t]).length,0,'No preexisting 1 Peter Story coverage');
 for(const art of images[key]){const r=await worker.fetch(new Request('https://biblelens.test'+art.src),{},{});assert.equal(r.status,200);const bytes=fs.readFileSync('src'+art.src);assert.deepEqual(Buffer.from(await r.arrayBuffer()),bytes);assert.deepEqual(fs.readFileSync('www'+art.src),bytes);const html=context.readerChapterIllustrations(web,0);assert(html.includes(art.src)&&html.includes('Imagined scene: ')&&!html.includes('<figcaption>'));}
 coverage.push({chapter,verses:raw.verses.length,openers:1,afterVerse:0,src:openers[0].src,alt:openers[0].alt,kind:'chapter',StoryPlacements:[]});
}}finally{restore();globalThis.fetch=originFetch;}
assert.equal(networkCalls,0);
function spacing(chapterArt,coordinate){let position=0;const events=[];for(let book=0;book<66;book++)for(let chapter=1;chapters[book+':'+chapter];chapter++){const key=book+':'+chapter,raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));for(const a of chapterArt[key]||[])events.push({book,chapter,verse:a.afterVerse,position:position+(a.afterVerse||coordinate),src:a.src});for(const [verse,titles]of Object.entries(headings[key]||{}))for(const title of titles)if(stories[title])events.push({book,chapter,verse:+verse,position:position+ +verse,src:stories[title].src});position+=raw.verses.length;}events.sort((a,b)=>a.position-b.position);const adjacent=[],all=[],boundaries=[];for(let i=0;i<events.length;i++){for(let j=i+1;j<events.length&&events[j].position-events[i].position<5;j++){const pair={a:events[i],b:events[j],gap:events[j].position-events[i].position};all.push(pair);if(j===i+1)adjacent.push(pair);}if(i&&events[i-1].book!==events[i].book&&([58,59,60].includes(events[i-1].book)||[58,59,60].includes(events[i].book)))boundaries.push({a:events[i-1],b:events[i],gap:events[i].position-events[i-1].position});}return{adjacent,all,boundaries,nearbyPlacements:events.filter(x=>[58,59,60].includes(x.book))};}
const ledger={};for(const coordinate of [0,1]){const before=spacing(old('data/chapter-images.json'),coordinate),after=spacing(images,coordinate);assert.equal(before.adjacent.length,coordinate?69:64);assert.equal(before.all.length,coordinate?70:65);assert.deepEqual(after.adjacent,before.adjacent);assert.deepEqual(after.all,before.all);ledger[coordinate]={baselineAdjacent:before.adjacent.length,baselineAll:before.all.length,...after,batchClosePairs:after.all.filter(p=>p.a.book===59||p.b.book===59)};}
const hosted=hostedArtwork(),pinned=new Map(git(['ls-tree','-r',pin.sourceCommit,'src/assets']).toString().trim().split('\n').map(l=>{const [meta,path]=l.split('\t');return[path,meta.split(' ')[2]];}));
for(const src of Object.keys(hosted))assert.equal(execFileSync('git',['hash-object','--no-filters','src'+src],{encoding:'utf8'}).trim(),pinned.get('src'+src),'Exact pinned file '+src);
for(const src of old('data/hosted-artwork.json').assets)assert(pin.assets.includes(src));
const report={baseline,preservedAssets:assetRows.length,registeredChapters:[...illustratedBooks.values()].reduce((n,v)=>n+v[1],0),productionCatalogHash:createHash('sha256').update(fs.readFileSync('dist/client/stories.json')).digest('hex'),coverage,networkCalls,blanks,absent,exactEditionValuesAndPresence:true,sourceWebOfflineParity:true,hostedAssets:pin.assets.length,pin:pin.sourceCommit,spacing:ledger};
fs.writeFileSync(directory+'verification.json',JSON.stringify(report,null,2)+'\n');console.log('PASS: 1 Peter all 5 openers, exact edition values/presence, source/web/offline parity, zero network; baseline assets, content and all spacing preserved.');
