import fs from 'node:fs';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {eventHeadings} from '../../scripts/event-headings.mjs';
import {validateChapterImages} from '../../scripts/chapter-images.mjs';
const baseline='6bd1f514ed876677ab0762695176dfb9d64dfa2e';
const json=p=>JSON.parse(fs.readFileSync(p));
const git=(args,options={})=>execFileSync('git',args,{maxBuffer:100*1024*1024,...options});
const before=p=>JSON.parse(git(['show',baseline+':'+p]));
const images=json('data/chapter-images.json'),chapters=json('data/chapters.json'),stories=json('data/story-images.json');
const catalog=json('dist/client/stories.json');
assert.deepEqual(catalog,json('/tmp/john-baseline-stories.json'),'Reconciled production catalog unchanged');
const headings=eventHeadings(catalog,json('data/books.json'));
validateChapterImages(images,chapters,headings,stories);
for(const [key,value]of Object.entries(before('data/chapter-images.json')))assert.deepEqual(images[key],value);
for(const p of ['data/chapters.json','data/stories.json','data/story-images.json','src/reader.js','package.json','package-lock.json'])assert.deepEqual(fs.readFileSync(p),git(['show',baseline+':'+p]));
const rows=git(['ls-tree','-r',baseline,'src/assets'],{encoding:'utf8'}).trim().split('\n').map(line=>{const [meta,path]=line.split('\t');return {path,blob:meta.split(' ')[2]}});
const hashes=git(['hash-object','--stdin-paths'],{encoding:'utf8',input:rows.map(x=>x.path).join('\n')+'\n'}).trim().split('\n');rows.forEach((r,i)=>assert.equal(hashes[i],r.blob,r.path));
const manifest=json('data/hosted-artwork.json');
for(const src of before('data/hosted-artwork.json').assets)assert(manifest.assets.includes(src),'Prior hosted member retained: '+src);
const pinTree=new Map(git(['ls-tree','-r',manifest.sourceCommit,'src/assets'],{encoding:'utf8'}).trim().split('\n').map(line=>{const [meta,path]=line.split('\t');return [path,meta.split(' ')[2]];}));
for(const row of rows)assert.equal(pinTree.get(row.path),row.blob,'Complete baseline present at public pin');
for(const src of manifest.assets)assert.equal(pinTree.get('src'+src),git(['hash-object','src'+src],{encoding:'utf8'}).trim(),'Exact hosted source in immutable pin');
function ledger(arts,normalized){let offset=0;const placements=[],coverage=[];
 for(const key of Object.keys(chapters).sort((a,b)=>{const x=a.split(':').map(Number),y=b.split(':').map(Number);return x[0]-y[0]||x[1]-y[1]})){
  const chapter=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
  for(const art of arts[key]||[])placements.push({key,verse:art.afterVerse,pos:offset+(normalized?Math.max(1,art.afterVerse):art.afterVerse),src:art.src});
  for(const [v,titles]of Object.entries(headings[key]||{}))for(const title of titles)if(stories[title])placements.push({key,verse:+v,pos:offset+(+v),src:stories[title].src,title});
  if(key.startsWith('42:')){const storyPlacements=Object.entries(headings[key]||{}).flatMap(([verse,titles])=>titles.filter(t=>stories[t]).map(title=>({verse:+verse,title,...stories[title]})));coverage.push({key,openers:(arts[key]||[]).filter(a=>a.afterVerse===0).length+storyPlacements.filter(x=>x.verse===1).length,chapterImages:arts[key]||[],storyPlacements});}
  offset+=chapter.verses.length;
 }
 placements.sort((a,b)=>a.pos-b.pos);const adjacent=[],all=[],boundaries=[];
 for(let i=1;i<placements.length;i++){const a=placements[i-1],b=placements[i],pair={a,b,distance:b.pos-a.pos};if(pair.distance<5)adjacent.push(pair);if(a.key.split(':')[0]!==b.key.split(':')[0]&&[a,b].some(x=>x.key.startsWith('42:')))boundaries.push(pair);}
 for(let i=0;i<placements.length;i++)for(let j=i+1;j<placements.length&&placements[j].pos-placements[i].pos<5;j++)all.push({a:placements[i],b:placements[j],distance:placements[j].pos-placements[i].pos});
 return {coverage,adjacent,all,boundaries};
}
const spacing={};let coverage;
for(const normalized of [false,true]){const current=ledger(images,normalized),old=ledger(before('data/chapter-images.json'),normalized);coverage=current.coverage;assert.equal(coverage.length,21);coverage.forEach(x=>assert.equal(x.openers,1,x.key));const newPairs=current.all.filter(p=>!old.all.some(o=>JSON.stringify(o)===JSON.stringify(p)));const inheritedRemoved=old.all.filter(p=>!current.all.some(o=>JSON.stringify(o)===JSON.stringify(p)));spacing[normalized?'openerAtVerse1':'openerAtVerse0']={baselineAdjacent:old.adjacent.length,currentAdjacent:current.adjacent.length,baselineAll:old.all.length,currentAll:current.all.length,newPairs,inheritedRemoved,boundaries:current.boundaries,inheritedAll:old.all,currentAllPairs:current.all};}
const report={baseline,preservedAssets:rows.length,publicPin:manifest.sourceCommit,hostedMembers:manifest.assets.length,completeBaselineAtPin:true,coverage,spacing};
fs.writeFileSync('research/notes/john-artwork-audit-2026-11-04.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({baseline,preservedAssets:rows.length,coverage:coverage.map(x=>({key:x.key,openers:x.openers,chapters:x.chapterImages.length,stories:x.storyPlacements.length})),spacing:Object.fromEntries(Object.entries(spacing).map(([k,v])=>[k,{...v,inheritedAll:undefined,currentAllPairs:undefined}]))},null,2));
