import fs from 'node:fs';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {eventHeadings} from '../../scripts/event-headings.mjs';
import {validateChapterImages} from '../../scripts/chapter-images.mjs';
import {hostedArtwork} from '../../scripts/hosted-artwork.mjs';
import {addUX13Events} from '../../scripts/ux13-content.mjs';
import {releaseContent} from '../../scripts/rc1-content.mjs';
import {b4Content} from '../../scripts/b4-neutral.mjs';
const baseline='846ba467f3094e065d5d3489c5bb897908f2bf79';
const json=p=>JSON.parse(fs.readFileSync(p));
const before=p=>JSON.parse(execFileSync('git',['show',baseline+':'+p]));
const images=json('data/chapter-images.json'),chapters=json('data/chapters.json'),stories=json('data/story-images.json');
const headings=eventHeadings(addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json')))),json('data/books.json'));
validateChapterImages(images,chapters,headings,stories);
const missing=structuredClone(images);delete missing['20:1'];
assert.throws(()=>validateChapterImages(missing,chapters,headings,stories),/Ecclesiastes 1 needs/);
for(const [key,value]of Object.entries(before('data/chapter-images.json')))assert.deepEqual(images[key],value);
for(const path of ['data/chapters.json','data/stories.json','data/story-images.json','package.json'])assert.deepEqual(fs.readFileSync(path),execFileSync('git',['show',baseline+':'+path],{maxBuffer:100*1024*1024}));
let preservedAssets=0;
for(const line of execFileSync('git',['ls-tree','-r',baseline,'src/assets'],{encoding:'utf8'}).trim().split('\n')){
 const [meta,path]=line.split('\t');const sha=meta.split(' ')[2];
 assert.equal(execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim(),sha,path);preservedAssets++;
}
const source=fs.readFileSync('src/reader.js','utf8');
const context={esc:value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')};
vm.createContext(context);vm.runInContext(source.slice(0,source.indexOf('let selectedVerses=')),context);
assert(source.includes('${readerChapterIllustrations(reading,0)}'),'Shared reader includes opener before verse mapping');
const rows=[];
for(let chapter=1;chapter<=12;chapter++){
 const key='20:'+chapter;assert.equal(images[key].length,1);const art=images[key][0];assert.equal(art.afterVerse,0);
 assert(!Object.values(headings[key]||{}).flat().some(title=>stories[title]));
 const html=context.readerChapterIllustrations({chapterImages:images[key]},0);assert(html.includes(art.src));assert(html.includes(art.alt));assert(!html.includes('<figcaption>'));
 const bytes=fs.readFileSync('src'+art.src);assert(bytes.length<250000);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
 rows.push({chapter,src:art.src,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),openerCount:1,hiddenGenericCaption:true});
}
const placements=[];let offset=0;
for(const key of Object.keys(chapters).filter(k=>[19,20,21].includes(+k.split(':')[0])).sort((a,b)=>{const x=a.split(':').map(Number),y=b.split(':').map(Number);return x[0]-y[0]||x[1]-y[1]})){
 const chapter=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
 for(const art of images[key]||[])placements.push({key,verse:art.afterVerse,pos:offset+Math.max(1,art.afterVerse),src:art.src});
 for(const [v,titles]of Object.entries(headings[key]||{}))for(const title of titles)if(stories[title])placements.push({key,verse:+v,pos:offset+(+v),src:stories[title].src});
 offset+=chapter.verses.length;
}
placements.sort((a,b)=>a.pos-b.pos);
const closePairs=[];for(let i=1;i<placements.length;i++){const a=placements[i-1],b=placements[i];if((a.key.startsWith('20:')||b.key.startsWith('20:'))&&b.pos-a.pos<5)closePairs.push({a,b,distance:b.pos-a.pos});}
const hosted=hostedArtwork();for(const row of rows)assert(hosted[row.src]);
const report={baseline,book:'Ecclesiastes',chapterCount:12,rows,totalImageBytes:rows.reduce((n,r)=>n+r.bytes,0),preservedAssets,closePairs,checks:{coverage:true,missingOpenerRejected:true,sourceRenderer:true,baselinePreservation:true,hostedManifest:true},limitations:['Built web/native parity, Worker size and offline execution unverified: esbuild and other project dependencies absent; installation forbidden by session scope.','Phone/iPad layouts unavailable: managed browser tool absent.','Live release GET denied HTTP 403; no retry or bypass.','Recheck spacing against Song of Solomon branch at integration.']};
fs.writeFileSync('research/notes/ecclesiastes-artwork-audit-2026-11-04.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({chapters:rows.length,totalImageBytes:report.totalImageBytes,preservedAssets,closePairs},null,2));
