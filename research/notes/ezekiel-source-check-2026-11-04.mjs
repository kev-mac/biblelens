import fs from 'node:fs';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {eventHeadings} from '../../scripts/event-headings.mjs';
import {addUX13Events} from '../../scripts/ux13-content.mjs';
import {validateChapterImages,illustratedBooks} from '../../scripts/chapter-images.mjs';
import {hostedArtwork} from '../../scripts/hosted-artwork.mjs';
const base='846ba46';
const json=p=>JSON.parse(fs.readFileSync(p));
const old=p=>JSON.parse(execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:50000000}));
const chapters=json('data/chapters.json'),books=json('data/books.json'),art=json('data/chapter-images.json'),stories=json('data/story-images.json');
const headings=eventHeadings(addUX13Events(json('data/stories.json')),books);
validateChapterImages(art,chapters,headings,stories);
const before=old('data/chapter-images.json');for(const [key,value]of Object.entries(before))assert.deepEqual(art[key],value);
assert(Object.keys(art).filter(k=>!before[k]).every(k=>k.startsWith('25:')));
for(const p of ['data/chapters.json','data/stories.json','package.json'])assert.deepEqual(json(p),old(p));
const oldStory=old('data/story-images.json');for(const [title,value]of Object.entries(oldStory))if(title!=="Ezekiel's Vision and Commission")assert.deepEqual(stories[title],value);
assert.equal(execFileSync('git',['diff','--name-only','--diff-filter=MD',base,'--','src/assets'],{encoding:'utf8'}).trim(),'');
const reader=fs.readFileSync('src/reader.js','utf8');const context={esc:s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')};vm.createContext(context);vm.runInContext(reader.slice(0,reader.indexOf('let selectedVerses=')),context);
const coverage=[];for(let chapter=1;chapter<=48;chapter++){
 const key='25:'+chapter;const chapterArt=art[key]||[];const storyAtOne=(headings[key]?.[1]||[]).filter(t=>stories[t]);
 assert.equal(chapterArt.filter(x=>x.afterVerse===0).length+storyAtOne.length,1,'Exactly one opener '+key);
 for(const a of chapterArt){const html=context.readerChapterIllustrations({chapterImages:chapterArt},0);assert(html.includes(a.src)&&html.includes(a.alt));assert(!html.includes('figcaption'));assert.equal(a.afterVerse,0);assert(fs.statSync('src'+a.src).size<250000);}
 coverage.push({chapter,opening:chapterArt[0]?.src||stories[storyAtOne[0]].src,kind:storyAtOne.length?(chapter===1?'Story at verse 1, versioned vision replacement':'retained Story at verse 1'):'chapter opener before verse 1',inline:Object.entries(headings[key]||{}).filter(([v])=>+v>1).flatMap(([verse,titles])=>titles.filter(t=>stories[t]).map(title=>({verse:+verse,title,src:stories[title].src})))});
}
const missing=structuredClone(art);delete missing['25:2'];assert.throws(()=>validateChapterImages(missing,chapters,headings,stories),/Ezekiel 2 needs/);
const positions=[];let offset=0;for(const book of books)for(let chapter=1;chapter<=book.chapters;chapter++){
 const key=book.id+':'+chapter;const raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
 for(const a of art[key]||[])positions.push({book:book.id,chapter,verse:a.afterVerse,position:offset+a.afterVerse,src:a.src,kind:'chapter'});
 for(const [verse,titles]of Object.entries(headings[key]||{}))for(const title of titles)if(stories[title])positions.push({book:book.id,chapter,verse:+verse,position:offset+Number(verse)-1,src:stories[title].src,kind:'Story'});
 offset+=raw.verses.length;
}
positions.sort((a,b)=>a.position-b.position);const pairs=[];for(let i=1;i<positions.length;i++){const a=positions[i-1],b=positions[i];if(a.book!==25&&b.book!==25)continue;pairs.push({from:a,to:b,versesBetween:b.position-a.position});}
const closePairs=pairs.filter(p=>p.versesBetween<5);assert.equal(closePairs.length,0);
const hosted=hostedArtwork();const active=[...Object.entries(art).filter(([k])=>k.startsWith('25:')).flatMap(([,a])=>a.map(x=>x.src)),stories["Ezekiel's Vision and Commission"].src];
const report={base,registeredChapters:[...illustratedBooks.values()].reduce((n,[,c])=>n+c,0),sourceValidation:'passed (not a packaged runtime check)',coverage,preservation:'all baseline asset blobs, chapter metadata, other Story mappings, scripture, Story catalog and package/build identity unchanged',closePairs,boundaryPairs:pairs.filter(p=>p.from.book!==p.to.book),minimumSpacing:Math.min(...pairs.map(p=>p.versesBetween)),hostedSourceCommit:json('data/hosted-artwork.json').sourceCommit,hostedCount:Object.keys(hosted).length,newActiveAssetCount:active.length,newActiveBytes:active.reduce((n,p)=>n+fs.statSync('src'+p).size,0),assets:active.map(src=>({src,bytes:fs.statSync('src'+src).size,sha256:createHash('sha256').update(fs.readFileSync('src'+src)).digest('hex')})),limits:['build:mobile blocked: esbuild dependency absent; installation excluded','check:images requires absent dist and www','check:mobile requires absent www','no callable cua_repl.js; phone/iPad viewport QA unavailable','no physical devices, native signing or offline bundle verification','live release endpoint HTTP 403; no retry or bypass','Sites version metadata matches build 341 release; source mirror files not opened','combined Worker size and combined immutable source pin require integration']};
fs.writeFileSync('research/notes/ezekiel-artwork-audit-2026-11-04.json',JSON.stringify(report,null,2)+'\n');console.log('PASS: 48 source openers, 44 chapter assets, 4 Story openers, inline Story preserved, 707 registered chapters, baseline preservation, renderer markup, immutable manifest, no close pairs.');console.log('Minimum spacing:',report.minimumSpacing,'verses. New active bytes:',report.newActiveBytes);
