import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {eventHeadings} from '../../../scripts/event-headings.mjs';
const base='846ba46';
const read=p=>JSON.parse(fs.readFileSync(p));
const before=p=>JSON.parse(execFileSync('git',['show',base+':'+p],{maxBuffer:40e6}));
const chapters=read('data/chapters.json'),images=read('data/chapter-images.json'),stories=read('data/story-images.json');
const headings=eventHeadings(read('data/stories.json'),read('data/books.json'));
for(const p of ['data/chapters.json','data/stories.json','data/story-images.json','data/hosted-artwork.json'])assert.deepEqual(read(p),before(p),p+' preserved');
const old=before('data/chapter-images.json');for(const [k,v] of Object.entries(old))assert.deepEqual(images[k],v,'prior metadata '+k);
let preservedAssets=0;
for(const line of execFileSync('git',['ls-tree','-r',base,'src/assets'],{encoding:'utf8'}).trim().split('\n')){const [meta,path]=line.split('\t');const sha=meta.split(' ')[2];const bytes=fs.readFileSync(path);const actual=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');assert.equal(actual,sha,'baseline asset '+path);preservedAssets++;}
const report={base,preservedAssets,chapters:[],closePairs:[],boundaryChecks:[],baselinePreserved:true};
let cumulative=0;const placements=[];
for(let b=21;b<=23;b++)for(let c=1;chapters[b+':'+c];c++){
 const key=b+':'+c,d=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
 const points=[];
 for(const [v,titles] of Object.entries(headings[key]||{}))for(const title of titles)if(stories[title])points.push({chapter:key,verse:Number(v),position:cumulative+Number(v)-1,type:'Story',src:stories[title].src});
 for(const a of images[key]||[])points.push({chapter:key,verse:a.afterVerse,position:cumulative+a.afterVerse,type:'chapter',src:a.src});
 if(b===22){
  const open=points.filter(x=>x.type==='Story'?x.verse===1:x.verse===0);assert.equal(open.length,1,'exactly one opener '+key);
  const p=open[0],bytes=fs.readFileSync('src'+p.src);assert(bytes.length<250000);assert.equal(bytes.toString('ascii',0,4),'RIFF');
  report.chapters.push({chapter:c,opener:p,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,verseCount:d.verses.length});
 }
 placements.push(...points);cumulative+=d.verses.length;
}
placements.sort((a,b)=>a.position-b.position);
for(let i=1;i<placements.length;i++){
 const a=placements[i-1],b=placements[i],gap=b.position-a.position;
 if((a.chapter.startsWith('22:')||b.chapter.startsWith('22:'))&&gap<5)report.closePairs.push({a,b,versesApart:gap});
 if(a.chapter.split(':')[0]!==b.chapter.split(':')[0])report.boundaryChecks.push({a,b,versesApart:gap,limit:'Adjacent book branches may add new openers; recheck final integrated source.'});
}
report.totalOpeners=report.chapters.length;
fs.writeFileSync('research/notes/isaiah-artwork-2026-11-04/validation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({openers:report.totalOpeners,closePairs:report.closePairs,boundaries:report.boundaryChecks,baselinePreserved:report.baselinePreserved},null,2));
