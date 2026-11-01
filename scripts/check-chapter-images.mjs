import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import zlib from 'node:zlib';
import worker from '../dist/server/index.js';
import {validateChapterImages} from './chapter-images.mjs';
const get=path=>worker.fetch(new Request('https://biblelens.test'+path),{},{});
const images=JSON.parse(fs.readFileSync('data/chapter-images.json'));
const stories=JSON.parse(fs.readFileSync('data/story-images.json'));
const original=JSON.parse(fs.readFileSync('data/chapters.json'));
const source=fs.readFileSync('src/reader.js','utf8');
const context={esc:value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')};
vm.createContext(context);vm.runInContext(source.slice(0,source.indexOf('let selectedVerses=')),context);
let existingChapters=0,newChapters=0;
for(let chapter=1;chapter<=50;chapter++){
 const key='0:'+chapter, response=await get('/api/chapter?book=0&chapter='+chapter);
 assert.equal(response.status,200);const data=await response.json();
 const existing=Object.values(data.eventHeadings).flat().some(title=>stories[title]);
 if(existing)existingChapters++;
 const additions=data.chapterImages||[];if(additions.length)newChapters++;
 assert(existing||additions.length,'Genesis '+chapter+' has an image');
 assert.deepEqual(additions,images[key]||[],'Packaged image placement matches source');
 const raw=JSON.parse(zlib.gunzipSync(Buffer.from(original[key],'base64')));
 for(const verse of data.verses)for(const edition of ['kjv','asv','web'])assert.equal(verse[edition],raw.verses.find(v=>v.n===verse.n)[edition],'Scripture stays untouched');
 for(const art of additions){
  const html=context.readerChapterIllustrations(data,art.afterVerse);
  assert(html.includes(art.src));assert(html.includes('loading="lazy"'));assert(html.includes('Imagined scene: '));
  assert(!/<h[1-6]|<figcaption|title=/.test(html),'Chapter art has no visible title or caption');
  const result=await get(art.src);assert.equal(result.status,200);assert.equal(result.headers.get('content-type'),'image/webp');
  const bytes=Buffer.from(await result.arrayBuffer());assert(bytes.length<250000,'Keep phone downloads small');
  assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.deepEqual(bytes,fs.readFileSync('src'+art.src));assert.deepEqual(bytes,fs.readFileSync('www'+art.src),'Native and web image bytes match');
 }
 assert.equal(context.readerChapterIllustrations(data,0),'');
}
assert.equal(context.readerChapterIllustrations({},1),'');
// Missing or misspelled placements must fail the build rather than silently lose coverage.
const headings={};for(let chapter=1;chapter<=50;chapter++)if(!images['0:'+chapter])headings['0:'+chapter]={1:[Object.keys(stories)[0]]};
validateChapterImages(images,original,headings,stories);
const missing=structuredClone(images);delete missing['0:2'];
assert.throws(()=>validateChapterImages(missing,original,headings,stories),/Genesis 2 needs/);
const invalid=structuredClone(images);invalid['0:2'][0].afterVerse=999;
assert.throws(()=>validateChapterImages(invalid,original,headings,stories),/Unknown image verse/);
assert(source.includes('${readerChapterIllustrations(reading,v.n)}'),'Artwork follows a complete verse');
console.log(`PASS: all 50 Genesis chapters illustrated; ${existingChapters} keep Story coverage, ${newChapters} gain inline images; unchanged scripture, valid placement, title-free accessible art, packaged image parity and fail-closed coverage.`);
