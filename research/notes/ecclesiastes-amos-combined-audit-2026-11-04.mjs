import fs from 'node:fs';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {eventHeadings} from '../../scripts/event-headings.mjs';
import {validateChapterImages,illustratedBooks} from '../../scripts/chapter-images.mjs';
import {hostedArtwork} from '../../scripts/hosted-artwork.mjs';
import {addUX13Events} from '../../scripts/ux13-content.mjs';
import {releaseContent} from '../../scripts/rc1-content.mjs';
import {b4Content} from '../../scripts/b4-neutral.mjs';
const baseline='846ba467f3094e065d5d3489c5bb897908f2bf79';
const json=p=>JSON.parse(fs.readFileSync(p));
const before=p=>JSON.parse(execFileSync('git',['show',baseline+':'+p],{maxBuffer:100*1024*1024}));
const images=json('data/chapter-images.json'),chapters=json('data/chapters.json'),stories=json('data/story-images.json');
const headings=eventHeadings(addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json')))),json('data/books.json'));
validateChapterImages(images,chapters,headings,stories);
for(const [key,value]of Object.entries(before('data/chapter-images.json')))assert.deepEqual(images[key],value);
for(const p of ['data/chapters.json','data/stories.json','src/reader.js','package-lock.json'])assert.deepEqual(fs.readFileSync(p),execFileSync('git',['show',baseline+':'+p],{maxBuffer:100*1024*1024}));
const expectedChanges=new Set(['Ezekiel’s Vision and Commission',"Ezekiel's Vision and Commission","Belshazzar's Feast","Daniel's Visions"]);
const changedStories=[];for(const [k,v]of Object.entries(before('data/story-images.json')))if(JSON.stringify(stories[k])!==JSON.stringify(v)){assert(expectedChanges.has(k),k);changedStories.push({title:k,before:v,after:stories[k]});}assert.equal(changedStories.length,3);
let preservedAssets=0;
for(const line of execFileSync('git',['ls-tree','-r',baseline,'src/assets'],{encoding:'utf8'}).trim().split('\n')){const [meta,p]=line.split('\t');assert.equal(execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim(),meta.split(' ')[2],p);preservedAssets++;}
const placements=[],bookRows=[];let offset=0;
for(const key of Object.keys(chapters).sort((a,b)=>{const x=a.split(':').map(Number),y=b.split(':').map(Number);return x[0]-y[0]||x[1]-y[1]})){
 const chapter=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64'))),book=+key.split(':')[0];
 for(const art of images[key]||[])placements.push({key,verse:art.afterVerse,pos:offset+Math.max(1,art.afterVerse),src:art.src});
 for(const [v,titles]of Object.entries(headings[key]||{}))for(const title of titles)if(stories[title])placements.push({key,verse:+v,pos:offset+(+v),src:stories[title].src});
 if(book>=20&&book<=29){const openers=(images[key]||[]).filter(a=>a.afterVerse===0).length+(headings[key]?.[1]||[]).filter(t=>stories[t]).length;assert.equal(openers,1,key);bookRows.push({key,openers,verses:chapter.verses.length});}
 offset+=chapter.verses.length;
}
placements.sort((a,b)=>a.pos-b.pos);
const closePairs=[],boundaries=[];for(let i=1;i<placements.length;i++){const a=placements[i-1],b=placements[i],x=+a.key.split(':')[0],y=+b.key.split(':')[0];if((x>=20&&x<=29)||(y>=20&&y<=29)){if(b.pos-a.pos<5)closePairs.push({a,b,distance:b.pos-a.pos});if(x!==y)boundaries.push({a,b,distance:b.pos-a.pos});}}
assert.equal(bookRows.length,229);assert.equal(closePairs.length,0);
const hosted=hostedArtwork();for(const [key,v]of Object.entries(images))if(+key.split(':')[0]>=20&&+key.split(':')[0]<=29)for(const a of v)assert(hosted[a.src]);
const pin=json('data/hosted-artwork.json').sourceCommit;for(const src of Object.keys(hosted))assert.deepEqual(fs.readFileSync('src'+src),execFileSync('git',['show',pin+':src'+src],{maxBuffer:1024*1024}),src);
const mirror='/Users/kevin/git/BibleLens/.release/sites-mirror';let mirrorProductionFiles=0;
for(const p of execFileSync('git',['ls-files','src','data','worker','scripts','db','drizzle','package.json','package-lock.json','capacitor.config.json','.openai/hosting.json'],{cwd:mirror,encoding:'utf8'}).trim().split('\n')){assert.deepEqual(fs.readFileSync(mirror+'/'+p),execFileSync('git',['show',baseline+':'+p],{maxBuffer:100*1024*1024}),p);mirrorProductionFiles++;}
const report={baseline,preservedAssets,mirrorProductionFiles,changedStories,batchChapters:bookRows.length,registeredChapters:[...illustratedBooks.values()].reduce((n,v)=>n+v[1],0),hostedAssets:Object.keys(hosted).length,pin,closePairs,boundaries,chapters:bookRows};
fs.writeFileSync('research/notes/ecclesiastes-amos-combined-source-verification-2026-11-04.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,chapters:undefined,changedStories:changedStories.map(r=>r.title)},null,2));
