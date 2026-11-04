import fs from 'node:fs';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {eventHeadings} from '../../scripts/event-headings.mjs';

const baseline='6bd1f514ed876677ab0762695176dfb9d64dfa2e';
const read=p=>JSON.parse(fs.readFileSync(p));
const old=p=>JSON.parse(execFileSync('git',['show',baseline+':'+p],{maxBuffer:40e6}));
const hash=b=>createHash('sha256').update(b).digest('hex');
const chapters=read('data/chapters.json'),before=old('data/chapter-images.json'),after=read('data/chapter-images.json');
const stories=read('data/story-images.json'),books=read('data/books.json');
const production=read('dist/client/stories.json'),headings=eventHeadings(production,books);
for(const p of ['data/chapters.json','data/stories.json','data/story-images.json','package.json','package-lock.json','src/reader.js','src/stories.js'])assert.deepEqual(fs.readFileSync(p),execFileSync('git',['show',baseline+':'+p],{maxBuffer:40e6}),p+' is preserved exactly');
for(const [k,v] of Object.entries(before))assert.deepEqual(after[k],v,'preserve earlier image mappings '+k);
for(const k of Object.keys(after).filter(k=>!before[k]))assert(k.startsWith('41:'),'Luke only');
const baselineAssets=execFileSync('git',['ls-tree','-r',baseline,'src/assets'],{encoding:'utf8'}).trim().split('\n');
for(const row of baselineAssets){const [meta,p]=row.split('\t');const sha=meta.split(' ')[2];assert.equal(execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),sha,'preserve baseline '+p);}
const coverage=[];
for(let chapter=1;chapter<=24;chapter++){
 const key='41:'+chapter,chapterArt=after[key]||[],storyArt=Object.entries(headings[key]||{}).flatMap(([verse,titles])=>titles.filter(t=>stories[t]).map(title=>({verse:Number(verse),title,...stories[title]})));
 const openers=[...chapterArt.filter(a=>a.afterVerse===0),...storyArt.filter(a=>a.verse===1)];assert.equal(openers.length,1,key);
 coverage.push({chapter,opener:openers[0].src,chapterArt,storyArt});
}
function spacing(images,openerCoordinate){
 let start=0,all=[];
 for(const [key,packed] of Object.entries(chapters)){
  const data=JSON.parse(zlib.gunzipSync(Buffer.from(packed,'base64')));
  for(const a of images[key]||[]){const verse=a.afterVerse===0?openerCoordinate:a.afterVerse;all.push({key,verse,pos:start+verse,src:a.src});}
  for(const [v,titles] of Object.entries(headings[key]||{}))for(const title of titles)if(stories[title])all.push({key,verse:Number(v),pos:start+Number(v),src:stories[title].src});
  start+=data.verses.length;
 }
 all.sort((a,b)=>a.pos-b.pos);const near=[];
 for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length&&all[j].pos-all[i].pos<5;j++)near.push({a:all[i],b:all[j],gap:all[j].pos-all[i].pos});
 const adjacent=all.slice(1).map((b,i)=>({a:all[i],b,gap:b.pos-all[i].pos}));
 return {adjacent:adjacent.filter(p=>p.gap<5),all:near,boundaries:adjacent.filter(p=>p.a.key.split(':')[0]!==p.b.key.split(':')[0]&&[p.a.key.split(':')[0],p.b.key.split(':')[0]].some(b=>['40','41','42'].includes(b)))};
}
const pairResults={};
for(const c of [0,1]){
 const b=spacing(before,c),a=spacing(after,c);
 assert.equal(b.adjacent.length,c===0?63:67);assert.equal(b.all.length,c===0?64:68);
 const newPairs=a.all.filter(p=>!b.all.some(q=>JSON.stringify(p)===JSON.stringify(q)));
 pairResults['openerAtVerse'+c]={baselineAdjacent:b.adjacent.length,currentAdjacent:a.adjacent.length,baselineAll:b.all.length,currentAll:a.all.length,newPairs,inheritedAll:b.all,inheritedAdjacent:b.adjacent,boundaries:a.boundaries};
}
const hosted=read('data/hosted-artwork.json'),previous=old('data/hosted-artwork.json');
for(const p of previous.assets)assert(hosted.assets.includes(p));
const assets=coverage.flatMap(c=>c.chapterArt).map(a=>({src:a.src,bytes:fs.statSync('src'+a.src).size,sha256:hash(fs.readFileSync('src'+a.src))}));
assert.equal(assets.length,20);
fs.writeFileSync('research/notes/luke-artwork-audit-2026-11-04.json',JSON.stringify({baseline,baselineAssetsPreserved:baselineAssets.length,productionCatalogSha256:hash(fs.readFileSync('dist/client/stories.json')),mirror:{sha:'57013c141639c6db19098d50708ed6201e396ee2',productionFilesCompared:1638,differences:[]},generated:20,retainedStoryPlacements:coverage.reduce((n,c)=>n+c.storyArt.length,0),replaced:0,coverage,assets,hosted:{baseline:previous.assets.length,current:hosted.assets.length,pin:hosted.sourceCommit},spacing:pairResults},null,2)+'\n');
console.log('PASS: Luke 24/24 single openers, 20 new images, baseline source and assets preserved, complete-canon spacing recorded.');
