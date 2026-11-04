import fs from 'node:fs';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {eventHeadings} from '../../scripts/event-headings.mjs';
import {validateChapterImages,illustratedBooks} from '../../scripts/chapter-images.mjs';
import {hostedArtwork} from '../../scripts/hosted-artwork.mjs';
const baseline='6bd1f514ed876677ab0762695176dfb9d64dfa2e';
const json=p=>JSON.parse(fs.readFileSync(p));
const git=(args,options={})=>execFileSync('git',args,{maxBuffer:100*1024*1024,...options});
const before=p=>JSON.parse(git(['show',baseline+':'+p]));
const images=json('data/chapter-images.json'),chapters=json('data/chapters.json'),stories=json('data/story-images.json');
// The previous signed build's actual production catalog includes all release enrichments.
// Story prose/catalog is unchanged; verify the rebuilt catalog against this snapshot later.
const catalog=json(process.env.BASELINE_STORIES||'/tmp/biblelens344-baseline-stories.json');
const headings=eventHeadings(catalog,json('data/books.json'));
validateChapterImages(images,chapters,headings,stories);
for(const [key,value]of Object.entries(before('data/chapter-images.json')))assert.deepEqual(images[key],value);
for(const p of ['data/chapters.json','data/stories.json','src/reader.js','package-lock.json'])assert.deepEqual(fs.readFileSync(p),git(['show',baseline+':'+p]));
const changedStories=[];for(const [k,v]of Object.entries(before('data/story-images.json')))if(JSON.stringify(stories[k])!==JSON.stringify(v)){assert(['Pentecost',"Paul's First Journey"].includes(k));changedStories.push({title:k,before:v,after:stories[k]});}assert.equal(changedStories.length,2);
const rows=git(['ls-tree','-r',baseline,'src/assets'],{encoding:'utf8'}).trim().split('\n').map(line=>{const [meta,path]=line.split('\t');return {path,blob:meta.split(' ')[2]}});
const hashes=git(['hash-object','--no-filters','--stdin-paths'],{encoding:'utf8',input:rows.map(x=>x.path).join('\n')+'\n'}).trim().split('\n');rows.forEach((r,i)=>assert.equal(hashes[i],r.blob,r.path));
function ledger(arts,storyArts,normalized){let offset=0;const placements=[],batch=[];
 for(const key of Object.keys(chapters).sort((a,b)=>{const x=a.split(':').map(Number),y=b.split(':').map(Number);return x[0]-y[0]||x[1]-y[1]})){
 const chapter=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64'))),book=+key.split(':')[0];
 for(const art of arts[key]||[])placements.push({key,verse:art.afterVerse,pos:offset+(normalized?Math.max(1,art.afterVerse):art.afterVerse),src:art.src});
 for(const [v,titles]of Object.entries(headings[key]||{}))for(const title of titles)if(storyArts[title])placements.push({key,verse:+v,pos:offset+(+v),src:storyArts[title].src});
 if(book>=40&&book<=49){const openers=(arts[key]||[]).filter(a=>a.afterVerse===0).length+(headings[key]?.[1]||[]).filter(t=>storyArts[t]).length;batch.push({key,openers,verses:chapter.verses.length});}
 offset+=chapter.verses.length;
 }
 placements.sort((a,b)=>a.pos-b.pos);const adjacent=[],all=[],boundaries=[];
 for(let i=1;i<placements.length;i++){const a=placements[i-1],b=placements[i];if(b.pos-a.pos<5)adjacent.push({a,b,distance:b.pos-a.pos});if(a.key.split(':')[0]!==b.key.split(':')[0]&&(+a.key.split(':')[0]>=39&&+a.key.split(':')[0]<=49||+b.key.split(':')[0]>=40&&+b.key.split(':')[0]<=50))boundaries.push({a,b,distance:b.pos-a.pos});}
 for(let i=0;i<placements.length;i++)for(let j=i+1;j<placements.length&&placements[j].pos-placements[i].pos<5;j++)all.push({a:placements[i],b:placements[j],distance:placements[j].pos-placements[i].pos});
 return {batch,adjacent,all,boundaries};
}
const spacing={};for(const normalized of [false,true]){const current=ledger(images,stories,normalized),old=ledger(before('data/chapter-images.json'),before('data/story-images.json'),normalized);const touches=p=>[p.a,p.b].some(x=>+x.key.split(':')[0]>=40&&+x.key.split(':')[0]<=49);assert.equal(current.batch.length,150);current.batch.forEach(x=>assert.equal(x.openers,1,x.key));const key=p=>p.a.key+':'+p.a.verse+'>'+p.b.key+':'+p.b.verse;const expected=normalized?['41:1:0>41:1:5','42:7:53>42:8:0']:['42:7:53>42:8:0'];assert.deepEqual(current.all.filter(touches).map(key).sort(),expected);for(const type of ['adjacent','all']){const prior=new Set(old[type].map(p=>JSON.stringify(p))),present=new Set(current[type].map(p=>JSON.stringify(p)));for(const p of prior)assert(present.has(p),'Preserve inherited pair');assert.deepEqual(current[type].filter(p=>!prior.has(JSON.stringify(p))).map(key).sort(),expected);}spacing[normalized?'openerAtVerse1':'openerAtVerse0']={baselineAdjacent:old.adjacent.length,currentAdjacent:current.adjacent.length,baselineAll:old.all.length,currentAll:current.all.length,batchClosePairs:current.all.filter(touches),boundaries:current.boundaries,inheritedAdjacent:old.adjacent,inheritedAll:old.all,currentAdjacentPairs:current.adjacent,currentAllPairs:current.all};}
const hosted=hostedArtwork(),pin=json('data/hosted-artwork.json').sourceCommit;
const pinned=new Map(git(['ls-tree','-r',pin,'src/assets'],{encoding:'utf8'}).trim().split('\n').map(line=>{const [meta,path]=line.split('\t');return[path,meta.split(' ')[2]]}));
const sources=Object.keys(hosted).map(src=>'src'+src),sourceHashes=git(['hash-object','--no-filters','--stdin-paths'],{encoding:'utf8',input:sources.join('\n')+'\n'}).trim().split('\n');sources.forEach((p,i)=>assert.equal(sourceHashes[i],pinned.get(p),'Pinned public asset '+p));
const mirror='/Users/kevin/git/BibleLens/.release/sites-mirror';const mirrorPaths=git(['ls-files','src','data','worker','scripts','db','drizzle','package.json','package-lock.json','capacitor.config.json','.openai/hosting.json'],{cwd:mirror,encoding:'utf8'}).trim().split('\n');const baselineTree=new Map(git(['ls-tree','-r',baseline],{encoding:'utf8'}).trim().split('\n').map(line=>{const [meta,path]=line.split('\t');return[path,meta.split(' ')[2]]}));const mirrorHashes=git(['hash-object','--no-filters','--stdin-paths'],{cwd:mirror,encoding:'utf8',input:mirrorPaths.join('\n')+'\n'}).trim().split('\n');mirrorPaths.forEach((p,i)=>assert.equal(mirrorHashes[i],baselineTree.get(p),p));const mirrorProductionFiles=mirrorPaths.length;
const report={baseline,preservedAssets:rows.length,mirrorProductionFiles,changedStories,batchChapters:150,registeredChapters:[...illustratedBooks.values()].reduce((n,v)=>n+v[1],0),hostedAssets:sources.length,pin,spacing};
fs.writeFileSync('research/notes/mark-philippians-combined-source-verification-2026-11-04.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,spacing:Object.fromEntries(Object.entries(spacing).map(([k,v])=>[k,{...v,inheritedAdjacent:undefined,inheritedAll:undefined}]))},null,2));
