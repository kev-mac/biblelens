// Run from canonical root. Review evidence only; no production files are changed.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {eventHeadings} from '../../../scripts/event-headings.mjs';
import {releaseContent} from '../../../scripts/rc1-content.mjs';
import {b4Content} from '../../../scripts/b4-neutral.mjs';
import {addUX13Events} from '../../../scripts/ux13-content.mjs';
import {validateChapterImages} from '../../../scripts/chapter-images.mjs';
const baseline='a3544e7d1548eb4afa9931b6473eb6c900dac601',j=p=>JSON.parse(fs.readFileSync(p));
const books=j('data/books.json'),chapters=j('data/chapters.json'),ci=j('data/chapter-images.json'),si=j('data/story-images.json');
const catalog=addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json')))),headings=eventHeadings(catalog,books);
validateChapterImages(ci,chapters,headings,si);
const bases=["1:7-8: faith and the message spreading through Macedonia and Achaia. Coastal route illustrates transmission; it is no exact mapped road or claimed view of ancient Thessalonica.", "2:9: labouring night and day to avoid burdening recipients. Lamp, cloth and tools evoke manual work; this letter does not specify a trade, workshop or tent interior.", "3:1-2,6: left at Athens, Timothy sent and returned with news. Path and bridge evoke communication; no identifiable messenger, exact route or dated journey is asserted.", "4:11-12: quiet living and work with your hands. Unoccupied courtyard workbench illustrates manual labour; does not claim a named artisan or displace later resurrection teaching (4:13-18).", "5:4-8: light, day, night and watchfulness imagery. Dawn and unlit lamp illustrate the metaphor; no literal thief, childbirth or returning Jesus scene."];
const details=["Native 960x540: tree branch/leaf attachments, tiled roof/stone wall joints, coastal village and road junctions, sea/horizon and hill shadows. Greens, blue sea/sky, gentle daylight. No people, silhouettes, animals or writing; no definite malformed object.", "Native 960x540: single lamp flame/wick/nozzle/handle, thread winding and loose strand, small comb/loom teeth, yarn basket weave/handles, pottery, coarse cloth fringe, table legs/plank and tent ropes. Warm lamplight balanced by deep blue night. No people, animals or definite object defect.", "Native 960x540: bridge arch voussoirs/parapet/abutments, path meeting crossing, stream through arch, water/rock boundaries, olive branches, grass and distant hills. Grey clouds, blue sky and green valley. No people/animals or definite structure defect.", "Native 960x540: weaving-frame warp strands, spindles and shuttle, yarn basket, purple cloth folds/fringe, bench supports/joints, pottery rim, door/gate, vine/pergola attachment and distant hills. Purple cloth, green foliage and cool daylight. No people/animals or definite object defect.", "Native 960x540: door jamb/lintel grain and stone joinery, unlit lamp nozzle/handle/base, pot mouth, woven cloth/fringe, light/shadow, grass and hillside horizon. Cool blue-grey shade and restrained golden dawn. No people/animals or definite object defect."];
const inventory=[];
for(let c=1;c<=5;c++){
 const key='51:'+c,arts=ci[key]||[],storyPlacements=Object.entries(headings[key]||{}).flatMap(([v,ts])=>ts.filter(t=>si[t]).map(t=>({verse:+v,title:t,...si[t]})));
 assert.equal(arts.length,1);assert.equal(arts[0].afterVerse,0);assert.equal(storyPlacements.length,0);
 const a=arts[0],bytes=fs.readFileSync('src'+a.src);assert.equal(a.width,960);assert.equal(a.height,540);assert(a.alt.startsWith('Imagined scene:'));
 inventory.push({chapter:c,...a,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),textBasis:bases[c-1],fullSizeReview:details[c-1],visiblePeople:[],visibleAnimals:[],anatomy:'No humans or animals visible; fingers, thumbs, limbs and aging comparisons not applicable.',decision:'retain'});
}
const production=p=>['package.json','package-lock.json','capacitor.config.json','.openai/hosting.json'].includes(p)||['src/','worker/','data/','scripts/','db/','drizzle/'].some(d=>p.startsWith(d));
let preservedProductionFiles=0,preservedAssets=0;
const oldPaths=[];
for(const line of execFileSync('git',['ls-tree','-r',baseline],{encoding:'utf8',maxBuffer:8e6}).trim().split('\n')){
 const[m,p]=line.split('\t');if(!production(p))continue;oldPaths.push(p);const bytes=fs.readFileSync(p),normalized=bytes;
 assert.equal(createHash('sha1').update(Buffer.concat([Buffer.from('blob '+normalized.length+'\0'),normalized])).digest('hex'),m.split(' ')[2],p+' unchanged');preservedProductionFiles++;if(p.startsWith('src/assets/'))preservedAssets++;
}
// Reject added production files as well as edits/removals.
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const current=['package.json','package-lock.json','capacitor.config.json','.openai/hosting.json',...['src','worker','data','scripts','db','drizzle'].flatMap(walk)].sort();assert.deepEqual(current,oldPaths.sort());
const points=[];let offset=0;
for(const b of books)for(let c=1;c<=b.chapters;c++){
 const k=b.id+':'+c,raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[k],'base64')));
 for(const a of ci[k]||[])points.push({book:b.id,chapter:c,verse:a.afterVerse,position:offset+a.afterVerse,src:a.src});
 for(const[v,ts]of Object.entries(headings[k]||{}))for(const t of ts)if(si[t])points.push({book:b.id,chapter:c,verse:+v,position:offset+(+v),src:si[t].src});offset+=raw.verses.length;
}
points.sort((a,b)=>a.position-b.position);const pairs=[];
for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(a.book===51||b.book===51)pairs.push({a,b,gap:b.position-a.position});}
const closePairs=pairs.filter(p=>p.gap<5);assert.equal(closePairs.length,0);
const report={book:'1 Thessalonians',baseline,chapters:5,totalPlacements:5,chapterOpeners:5,storyPlacements:0,retained:5,replaced:0,inventory,preservedProductionFiles,preservedAssets,productionDelta:'None. All production files and assets byte-identical to baseline; build 388 unchanged.',minimumInternalGap:Math.min(...pairs.filter(p=>p.a.book===51&&p.b.book===51).map(p=>p.gap)),closePairs,boundaries:pairs.filter(p=>p.a.book!==p.b.book),nextBookArtworkReviewed:false};
fs.writeFileSync('research/notes/1-thessalonians-artwork-inventory-2026-11-07.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({chapters:5,retained:5,replaced:0,preservedProductionFiles,preservedAssets,minimumInternalGap:report.minimumInternalGap,boundaries:report.boundaries.map(r=>r.gap),closePairs:0}));
