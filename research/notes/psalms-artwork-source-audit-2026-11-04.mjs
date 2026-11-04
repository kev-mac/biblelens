import fs from 'node:fs';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {eventHeadings} from '../../scripts/event-headings.mjs';
import {validateChapterImages,illustratedBooks} from '../../scripts/chapter-images.mjs';
import {enrichStories} from '../../scripts/story-metrics.mjs';
import {addUX13Events} from '../../scripts/ux13-content.mjs';
import {tagStoryCatalog,loadTopicOptions} from '../../scripts/story-topics.mjs';
import {releaseContent} from '../../scripts/rc1-content.mjs';
import {b4Content} from '../../scripts/b4-neutral.mjs';
const baseline='c90aa0d';
const read=p=>JSON.parse(fs.readFileSync(p));
const git=(...args)=>execFileSync('git',args,{maxBuffer:64*1024*1024});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const books=read('data/books.json'),chapters=read('data/chapters.json');
// Use the same released Story catalog and heading transforms as scripts/build.mjs.
const stories=enrichStories(addUX13Events(tagStoryCatalog(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json'))),read('data/reference/topics.json'),loadTopicOptions())),books,chapters,JSON.parse(releaseContent('data/evidence.json')));
const storyArt=read('data/story-images.json'),art=read('data/chapter-images.json');
const headings=eventHeadings(stories,books),original=JSON.parse(git('show',baseline+':data/chapter-images.json'));
assert.equal(read('package.json').buildNumber,340,'Preserve the release build');
assert.deepEqual(illustratedBooks.get(18),['Psalms',150]);
validateChapterImages(art,chapters,headings,storyArt);
for(const [key,value]of Object.entries(original))assert.deepEqual(art[key],value,'Preserve existing chapter metadata: '+key);
for(const key of Object.keys(art))if(!Object.hasOwn(original,key))assert(key.startsWith('18:'),'Only add Psalms metadata');
for(const p of ['data/chapters.json','data/story-images.json','data/stories.json','package.json','data/hosted-artwork.json'])assert.deepEqual(fs.readFileSync(p),git('show',baseline+':'+p),'Preserve '+p);
let preservedAssets=0;
for(const p of git('ls-tree','-r','--name-only',baseline,'--','src/assets').toString().trim().split('\n')){
 assert.deepEqual(fs.readFileSync(p),git('show',baseline+':'+p),'Preserve asset '+p);preservedAssets++;
}
const placements=[],counts=new Map();let offset=0;
for(const book of books)for(let chapter=1;chapter<=book.chapters;chapter++){
 const key=book.id+':'+chapter;
 const raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64')));counts.set(key,raw.verses.length);
 for(const a of art[key]||[])placements.push({book:book.name,bookId:book.id,chapter,verse:a.afterVerse,kind:'chapter',position:offset+a.afterVerse,src:a.src});
 for(const [v,titles]of Object.entries(headings[key]||{}))for(const title of titles)if(storyArt[title])placements.push({book:book.name,bookId:book.id,chapter,verse:Number(v),kind:'story',position:offset+Number(v),src:storyArt[title].src,title});
 offset+=raw.verses.length;
}
placements.sort((a,b)=>a.position-b.position);
const inventoryPath='research/notes/psalms-prior-artwork-inventory-2026-11-04.json';
const inventory=read(inventoryPath);
inventory.placements=placements.filter(p=>p.bookId<=18&&!(p.bookId===18&&p.kind==='chapter')).map(p=>({...p,...(p.kind==='story'?storyArt[p.title]:art[p.bookId+':'+p.chapter].find(a=>a.src===p.src&&a.afterVerse===p.verse))}));
inventory.catalog='Released Story catalog with the same UX13, topic and enrichment transforms as scripts/build.mjs; original chapter metadata is preserved.';
fs.writeFileSync(inventoryPath,JSON.stringify(inventory,null,2)+'\n');
const closePairs=[];
for(let i=1;i<placements.length;i++){
 const first=placements[i-1],second=placements[i],distance=second.position-first.position;
 if(distance<5&&(first.bookId===18||second.bookId===18))closePairs.push({first,second,distance});
}
const coverage=[];
for(let chapter=1;chapter<=150;chapter++){
 const key='18:'+chapter,entries=art[key]||[];
 assert.equal(entries.length,1,'One Psalm opener');const a=entries[0];assert.equal(a.afterVerse,0);
 assert(!(headings[key]?.[1]||[]).some(t=>storyArt[t]),'No duplicate Story opener');
 const bytes=fs.readFileSync('src'+a.src);assert(bytes.length<250000);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.equal(bytes.readUInt16LE(26)&0x3fff,960);assert.equal(bytes.readUInt16LE(28)&0x3fff,540);
 coverage.push({chapter,verseCount:counts.get(key),...a,bytes:bytes.length,sha256:hash(bytes)});
}
const retainedPsalmsImages=placements.filter(p=>p.bookId===18&&p.kind==='story');
const report={baseline:git('rev-parse',baseline).toString().trim(),branch:git('branch','--show-current').toString().trim(),book:'Psalms',buildNumber:340,preservedAssets,retainedPsalmsImages,newOpeners:coverage.length,closePairs,totalNewImageBytes:coverage.reduce((n,x)=>n+x.bytes,0),coverage};
fs.writeFileSync('research/notes/psalms-chapter-image-coverage-2026-11-04.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({newOpeners:coverage.length,preservedAssets,closePairs:closePairs.map(p=>`${p.first.chapter}:${p.first.verse} → ${p.second.chapter}:${p.second.verse} (${p.distance})`),totalNewImageBytes:report.totalNewImageBytes},null,2));
