import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import zlib from 'node:zlib';
import worker from '../dist/server/index.js';
import {eventHeadings} from './event-headings.mjs';

// Keep this book's checks independent of concurrently illustrated book branches.
const json=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const chapters=json('data/chapters.json'), images=json('data/chapter-images.json');
const stories=json('data/story-images.json'), catalog=json('data/stories.json');
const headings=eventHeadings(catalog,json('data/books.json'));
const reader=fs.readFileSync('src/reader.js','utf8');
const context={esc:value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')};
vm.createContext(context);
const source=fs.readFileSync('src/stories.js','utf8');
vm.runInContext(source.slice(0,source.indexOf('let storiesActive=')).replace('/*__STORY_IMAGES__*/{}',JSON.stringify(stories)),context);
vm.runInContext(reader.slice(0,reader.indexOf('let selectedVerses=')),context);
const originFetch=globalThis.fetch;
globalThis.fetch=async()=>{throw Error('1 Samuel artwork must be available without external image fetches');};
let openers=0,storyOpeners=0;
try {
 for(let chapter=1;chapter<=31;chapter++){
  const key='8:'+chapter;
  const response=await worker.fetch(new Request('https://biblelens.test/api/chapter?book=8&chapter='+chapter),{},{});
  assert.equal(response.status,200);
  const data=await response.json();
  assert.deepEqual(data.chapterImages||[],images[key]||[],'Packaged placement matches source: '+key);
  assert.deepEqual(data.eventHeadings,headings[key]||{},'Story placement stays unchanged: '+key);
  const raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
  for(const verse of data.verses)for(const edition of ['kjv','asv','web'])assert.equal(verse[edition],raw.verses.find(v=>v.n===verse.n)[edition]);
  const chapterOpeners=(data.chapterImages||[]).filter(art=>art.afterVerse===0);
  const storyTitles=(data.eventHeadings[1]||[]).filter(title=>stories[title]);
  assert.equal(chapterOpeners.length+storyTitles.length,1,'Exactly one opener before verse 1: '+key);
  openers+=chapterOpeners.length;storyOpeners+=storyTitles.length;
  for(const art of data.chapterImages||[]){
   assert.equal(art.afterVerse,0);assert(art.alt.startsWith('Imagined scene: '));
   assert.equal(art.width,960);assert.equal(art.height,540);
   const html=context.readerChapterIllustrations(data,art.afterVerse);
   assert(html.includes(art.src)&&html.includes('alt="')&&!html.includes('<figcaption>'));
  }
  for(const titles of Object.values(data.eventHeadings))for(const title of titles.filter(title=>stories[title])){
   const html=context.readerStoryEvent(title);
   assert(html.includes('<figcaption>Imagined scene: '),'Retain story caption');
  }
  const artwork=[...(data.chapterImages||[]),...Object.values(data.eventHeadings).flat().filter(title=>stories[title]).map(title=>stories[title])];
  for(const art of artwork){
   assert(art.alt.length>20);
   const response=await worker.fetch(new Request('https://biblelens.test'+art.src),{},{});
   assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/webp');
   const bytes=Buffer.from(await response.arrayBuffer());
   assert(bytes.length<250000);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
   assert.deepEqual(bytes,fs.readFileSync('src'+art.src));assert.deepEqual(bytes,fs.readFileSync('www'+art.src),'Offline bytes match: '+art.src);
  }
 }
} finally {globalThis.fetch=originFetch;}
assert.equal(openers,22);assert.equal(storyOpeners,9);
const events=[];let position=0;
for(const book of [7,8,9])for(let chapter=1;chapter<=(book===7?4:book===8?31:24);chapter++){
 const key=book+':'+chapter;
 const raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
 for(const art of images[key]||[])events.push({book,chapter,verse:art.afterVerse,position:position+art.afterVerse,src:art.src});
 for(const [verse,titles]of Object.entries(headings[key]||{}))for(const title of titles)if(stories[title])events.push({book,chapter,verse:Number(verse),position:position+Number(verse),src:stories[title].src});
 position+=raw.verses.length;
}
events.sort((a,b)=>a.position-b.position);
for(let i=1;i<events.length;i++)if((events[i].book===8||events[i-1].book===8)&&events[i].position-events[i-1].position<5)console.log('CLOSE PAIR:',JSON.stringify([events[i-1],events[i]]));
assert(reader.includes('${readerChapterIllustrations(reading,0)}${reading.verses.map'));
const css=fs.readFileSync('src/overrides.css','utf8');
assert(/#chapter-text \.story-illustration figcaption\{[^}]*font:italic/.test(css));
console.log('PASS: all 31 1 Samuel openers (22 chapter, 9 Story), retained Story verses/captions, unchanged scripture, alt text and offline/web byte parity. Browser/device layout remains a separate check.');
