import fs from 'node:fs';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {addUX13Events} from '../../../scripts/ux13-content.mjs';
import {eventHeadings} from '../../../scripts/event-headings.mjs';
import {validateChapterImages} from '../../../scripts/chapter-images.mjs';
const read=p=>JSON.parse(fs.readFileSync(p));
const baseline='8217c57c';
const old=p=>JSON.parse(execFileSync('git',['show',baseline+':'+p],{encoding:'utf8'}));
const chapters=read('data/chapters.json'),images=read('data/chapter-images.json'),stories=read('data/story-images.json'),books=read('data/books.json'),catalog=addUX13Events(read('data/stories.json'));
const headings=eventHeadings(catalog,books);
validateChapterImages(images,chapters,headings,stories);
const baseImages=old('data/chapter-images.json');for(const [key,value]of Object.entries(baseImages))assert.deepEqual(images[key],value);
assert.deepEqual(stories,old('data/story-images.json'));
for(const p of ['data/chapters.json','data/stories.json','package.json','package-lock.json','src/reader.js'])assert(fs.readFileSync(p).equals(execFileSync('git',['show',baseline+':'+p],{maxBuffer:30*1024*1024})),p+' unchanged');
const baseFiles=execFileSync('git',['ls-tree','-r',baseline,'src/assets'],{encoding:'utf8'}).trim().split('\n');
for(const row of baseFiles){const [,blob,p]=row.match(/^\d+ blob (\w+)\t(.+)$/);assert.equal(execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),blob,p);}
const inventory=[];for(let c=1;c<=4;c++){let key='38:'+c;assert.equal(images[key].length,1);assert.equal(images[key][0].afterVerse,0);assert(!Object.values(headings[key]||{}).flat().some(t=>stories[t]));inventory.push({chapter:c,previousChapterImages:baseImages[key]||[],previousStoryImages:[],final:images[key]});}
const placements=[];let offset=0;const boundaries=[];
for(const b of books.filter(x=>Number.isInteger(x.id)&&x.id>=0&&x.id<=65))for(let c=1;chapters[b.id+':'+c];c++){
const key=b.id+':'+c,raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));
if([37,38,39].includes(b.id))boundaries.push({key,start:offset,verses:raw.verses.length,images:images[key]||[],stories:headings[key]||{}});
for(const art of images[key]||[])placements.push({key,verse:art.afterVerse,position:offset+art.afterVerse,src:art.src});
for(const [v,titles]of Object.entries(headings[key]||{}))for(const title of titles)if(stories[title])placements.push({key,verse:Number(v),position:offset+Number(v),src:stories[title].src});
offset+=raw.verses.length;
}
placements.sort((a,b)=>a.position-b.position);const close=[];for(let i=0;i<placements.length;i++)for(let j=i+1;j<placements.length&&placements[j].position-placements[i].position<5;j++)close.push({a:placements[i],b:placements[j],distance:placements[j].position-placements[i].position,inherited:![placements[i],placements[j]].some(p=>p.key.startsWith('38:')),involvesMalachi:[placements[i],placements[j]].some(p=>p.key.startsWith('38:'))});
assert(!close.some(x=>x.involvesMalachi));
const earlierNameInventory={};for(const name of ['Malachi','Levi','Jacob','Esau','Moses','Elijah'])earlierNameInventory[name]=catalog.filter(g=>books.find(b=>b.name===g.book)?.id<38).flatMap(g=>g.stories.filter(s=>new RegExp('\\b'+name+'\\b','i').test(s.title+' '+s.summary)).map(s=>({book:g.book,title:s.title,src:stories[s.title]?.src||null})));
const out={baseline,inventory,baselineAssetsPreserved:baseFiles.length,earlierNameInventory,identityDecision:'No recognizable people/groups depicted; actual identity inputs unnecessary. Calves are unnamed illustrative animals, not a recurring herd.',closePairs:close,boundaries,parallelBoundaries:'Current baseline only. Recompute after integrating approved Zechariah and Matthew branches; do not assume their pending images approved.'};
fs.writeFileSync('research/notes/malachi-artwork-2026-11-04/source-audit.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({coverage:'4/4',baselineAssetsPreserved:baseFiles.length,closePairs:close.length,malachiClosePairs:0}));
