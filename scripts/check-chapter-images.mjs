import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import zlib from 'node:zlib';
import worker from '../dist/server/index.js';
import {validateChapterImages,illustratedBooks} from './chapter-images.mjs';
const originFetch=globalThis.fetch;
const pinned=JSON.parse(fs.readFileSync('data/hosted-artwork.json'));
globalThis.fetch=async(url,options)=>{
 const prefix='https://raw.githubusercontent.com/kev-mac/biblelens/'+pinned.sourceCommit+'/src';
 assert(String(url).startsWith(prefix),'Only pinned public artwork reaches the origin');
 const src=String(url).slice(prefix.length);assert(pinned.assets.includes(src));
 assert.deepEqual(options.headers,{accept:'image/webp'});
 return new Response(fs.readFileSync('src'+src),{headers:{'content-type':'image/webp'}});
};
const get=path=>worker.fetch(new Request('https://biblelens.test'+path),{},{});
const images=JSON.parse(fs.readFileSync('data/chapter-images.json'));
const stories=JSON.parse(fs.readFileSync('data/story-images.json'));
const original=JSON.parse(fs.readFileSync('data/chapters.json'));
const source=fs.readFileSync('src/reader.js','utf8');
const context={esc:value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')};
vm.createContext(context);vm.runInContext(source.slice(0,source.indexOf('let selectedVerses=')),context);
let existingChapters=0,newChapters=0;
const headings={};
try{for(const [book,[name,count]] of illustratedBooks.entries())for(let chapter=1;chapter<=count;chapter++){
 const key=book+':'+chapter, response=await get('/api/chapter?book='+book+'&chapter='+chapter);
 assert.equal(response.status,200);const data=await response.json();headings[key]=data.eventHeadings;
 const existing=Object.values(data.eventHeadings).flat().some(title=>stories[title]);
 if(existing)existingChapters++;
 const additions=data.chapterImages||[];if(additions.length)newChapters++;
 assert(existing||additions.length,name+' '+chapter+' has an image');
 assert.deepEqual(additions,images[key]||[],'Packaged image placement matches source');
 const raw=JSON.parse(zlib.gunzipSync(Buffer.from(original[key],'base64')));
 for(const verse of data.verses)for(const edition of ['kjv','asv','web'])assert.equal(verse[edition],raw.verses.find(v=>v.n===verse.n)[edition],'Scripture stays untouched');
 for(const art of additions){
  const html=context.readerChapterIllustrations(data,art.afterVerse);
  assert(html.includes(art.src));assert(html.includes('loading="lazy"'));assert(html.includes('Imagined scene: '));
  assert(!/<h[1-6]|title=/.test(html),'Chapter art has no heading above the image');assert(!html.includes('<figcaption>'),'Supplemental chapter art has no generic visible caption');
  const result=await get(art.src);assert.equal(result.status,200);assert.equal(result.headers.get('content-type'),'image/webp');
  const bytes=Buffer.from(await result.arrayBuffer());assert(bytes.length<250000,'Keep phone downloads small');
  assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.deepEqual(bytes,fs.readFileSync('src'+art.src));assert.deepEqual(bytes,fs.readFileSync('www'+art.src),'Native and web image bytes match');
 }
 const opener=additions.find(art=>art.afterVerse===0);
 if(opener){
  assert(context.readerChapterIllustrations(data,0).includes(opener.src),'Chapter opener appears before verse 1');
  assert(!(data.eventHeadings?.[1]||[]).some(title=>stories[title]),'Do not crowd a Story image at the start of '+name+' '+chapter);
 }else assert.equal(context.readerChapterIllustrations(data,0),'');
}
}finally{globalThis.fetch=originFetch;}
assert.equal(context.readerChapterIllustrations({},1),'');
// Missing or misspelled placements must fail the build rather than silently lose coverage.
validateChapterImages(images,original,headings,stories);
const missing=structuredClone(images);delete missing['0:2'];
assert.throws(()=>validateChapterImages(missing,original,headings,stories),/Genesis 2 needs/);
const missingSamuel=structuredClone(images);delete missingSamuel['9:2'];
assert.throws(()=>validateChapterImages(missingSamuel,original,headings,stories),/2 Samuel 2 needs/);
const missingFirstSamuel=structuredClone(images);delete missingFirstSamuel['8:2'];
assert.throws(()=>validateChapterImages(missingFirstSamuel,original,headings,stories),/1 Samuel 2 needs/);
const missingRuthHeadings=structuredClone(headings);delete missingRuthHeadings['7:1'];
assert.throws(()=>validateChapterImages(images,original,missingRuthHeadings,stories),/Ruth 1 needs/);
const missingChronicles=structuredClone(images);delete missingChronicles['12:1'];
assert.throws(()=>validateChapterImages(missingChronicles,original,headings,stories),/1 Chronicles 1 needs/);
const invalid=structuredClone(images);invalid['0:2'][0].afterVerse=999;
assert.throws(()=>validateChapterImages(invalid,original,headings,stories),/Unknown image verse/);
assert(source.includes('${readerChapterIllustrations(reading,v.n)}'),'Artwork follows a complete verse');
const chapterCount=[...illustratedBooks.values()].reduce((total,[,count])=>total+count,0);
console.log(`PASS: all ${chapterCount} registered chapters illustrated (${[...illustratedBooks.values()].map(([name])=>name).join(', ')}); ${existingChapters} have existing Story coverage, ${newChapters} gain inline images; unchanged scripture, valid placement, accessible art without generic captions, packaged image parity and fail-closed coverage.`);
