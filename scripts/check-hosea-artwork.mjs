import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import {createHash} from 'node:crypto';
import {eventHeadings} from './event-headings.mjs';
import {validateChapterImages} from './chapter-images.mjs';
import {hostedArtwork} from './hosted-artwork.mjs';
import {releaseContent} from './rc1-content.mjs';
import {b4Content} from './b4-neutral.mjs';
import {addUX13Events} from './ux13-content.mjs';
const read=name=>JSON.parse(fs.readFileSync('data/'+name+'.json'));
const books=read('books'),chapters=read('chapters'),images=read('chapter-images'),stories=read('story-images');
const productionStories=addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json'))));
const headings=eventHeadings(productionStories,books),hosted=hostedArtwork();
validateChapterImages(images,chapters,headings,stories);
const context={esc:s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')};
vm.createContext(context);
const reader=fs.readFileSync('src/reader.js','utf8');
vm.runInContext(reader.slice(0,reader.indexOf('let selectedVerses=')),context);
assert(reader.includes('${readerChapterIllustrations(reading,0)}${reading.verses.map'));
const records=[];
for(let c=1;c<=14;c++){
 const key='27:'+c,arts=images[key]||[],storyOpeners=(headings[key]?.[1]||[]).filter(t=>stories[t]);
 assert.equal(arts.filter(a=>a.afterVerse===0).length+storyOpeners.length,1,'Exactly one opener: '+key);
 if(c===1){assert(storyOpeners.includes("Hosea's Marriage to Gomer"));assert.equal(arts.length,0);continue;}
 assert.equal(arts.length,1);const art=arts[0],bytes=fs.readFileSync('src'+art.src);
 assert(hosted[art.src]);assert(bytes.length<250000);assert.equal(bytes.toString('ascii',0,4),'RIFF');
 const html=context.readerChapterIllustrations({chapterImages:arts},0);
 assert(html.includes(art.src)&&html.includes(art.alt));assert(!html.includes('figcaption'));
 records.push({chapter:c,...art,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
const missing=structuredClone(images);delete missing['27:2'];
assert.throws(()=>validateChapterImages(missing,chapters,headings,stories),/Hosea 2 needs/);
// Count verse positions continuously, including both adjacent book boundaries.
let offset=0;const positions=[];
for(const book of books.filter(b=>b.id>=26&&b.id<=28))for(let c=1;c<=book.chapters;c++){
 const key=book.id+':'+c,raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
 for(const art of images[key]||[])positions.push({book:book.id,chapter:c,verse:art.afterVerse,src:art.src,position:offset+Math.max(art.afterVerse,1)});
 for(const [v,titles]of Object.entries(headings[key]||{}))for(const t of titles)if(stories[t])positions.push({book:book.id,chapter:c,verse:Number(v),src:stories[t].src,position:offset+Number(v)});
 offset+=raw.verses.length;
}
positions.sort((a,b)=>a.position-b.position);const closePairs=[];
for(let i=1;i<positions.length;i++){const a=positions[i-1],b=positions[i];if((a.book===27||b.book===27)&&b.position-a.position<5)closePairs.push({from:a,to:b,gap:b.position-a.position});}
const report={chapters:14,retainedStories:1,newOpeners:13,records,closePairs,boundaries:'Daniel 12 through Joel 1; recheck after parallel integration',verification:'Source metadata and renderer only; no built Worker, offline byte parity, browser or device claim'};
fs.writeFileSync('research/notes/hosea-artwork-audit-2026-11-04.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS: Hosea 14/14 openers; 13 hosted versioned additions; Story retained; source renderer, alt text, captions, coverage failure case and boundaries checked. Close pairs:',closePairs.length);
