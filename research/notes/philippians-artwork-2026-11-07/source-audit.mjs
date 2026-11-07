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
const baseline='cff284070a5e304a4dbd4bc40ffa6f7d17ae3b3d',j=p=>JSON.parse(fs.readFileSync(p));
const books=j('data/books.json'),chapters=j('data/chapters.json'),ci=j('data/chapter-images.json'),si=j('data/story-images.json');
const catalog=addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json')))),headings=eventHeadings(catalog,books);
validateChapterImages(ci,chapters,headings,si);
const bases=[
  "1:7,12-14,16: bonds and the message spreading. Blank scroll and chain in an imagined prison illustrate the letter’s custody language. No portrait of Paul, actual manuscript, exact prison, date or composition location asserted.",
  "2:15-16: shining as lights in the world and holding the word of life. Stars above a quiet town illustrate light imagery; not a reconstruction of Philippi or a claim that verse 1 describes this town.",
  "3:12-14: pressing toward the mark and prize. Empty track illustrates the running/goal metaphor, not a claim Paul competed in this stadium or a dated site reconstruction.",
  "4:10-18: giving, receiving and the gift brought by Epaphroditus. Tied cloth parcel and jug are illustrative gift objects; the text does not specify their material, contents or actual appearance. No messenger or recipient pictured."
];
const details=[
  "Both blank scroll rollers/finials, scroll edge and surface, linked chain/cuff fastening, iron window bars, stone courses, bench textile/fringe and table joints inspected at native 960x540. No malformed visible object or lettering; cell and distant window view contain no people/animals.",
  "Olive trunk/branches and leaves, jug handle/rim, roof timbers/tiles, masonry, window openings, track/path perspective, distant town and stars inspected at native size. Deep blue sky and restrained window light; no tiny pedestrians, silhouettes or animals.",
  "Track surface/edges, seating courses, steps, column capitals/lintels, olive trunk/branches and hills inspected at native size. Empty track and stands, no runners, audience or animals. Natural green and blue morning colors; no invented named face.",
  "Folded textile edges/fringe, cord knot/routes, jug rim/handle attachment, table plank/leg joints, doorway framing, wall niche and landscape inspected at native size. Muted purple fabric, natural brown pottery and green hills. No hands, messenger, recipient or animal."
];
const inventory=[];
for(let c=1;c<=4;c++){
 const key='49:'+c,arts=ci[key]||[],storyPlacements=Object.entries(headings[key]||{}).flatMap(([v,ts])=>ts.filter(t=>si[t]).map(t=>({verse:+v,title:t,...si[t]})));
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
for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(a.book===49||b.book===49)pairs.push({a,b,gap:b.position-a.position});}
const closePairs=pairs.filter(p=>p.gap<5);assert.equal(closePairs.length,0);
const report={book:'Philippians',baseline,chapters:4,totalPlacements:4,chapterOpeners:4,storyPlacements:0,retained:4,replaced:0,inventory,preservedProductionFiles,preservedAssets,productionDelta:'None. All production files and assets byte-identical to baseline; build 388 unchanged.',minimumInternalGap:Math.min(...pairs.filter(p=>p.a.book===49&&p.b.book===49).map(p=>p.gap)),closePairs,boundaries:pairs.filter(p=>p.a.book!==p.b.book),nextBookArtworkReviewed:false};
fs.writeFileSync('research/notes/philippians-artwork-inventory-2026-11-07.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({chapters:4,retained:4,replaced:0,preservedProductionFiles,preservedAssets,minimumInternalGap:report.minimumInternalGap,boundaries:report.boundaries.map(r=>r.gap),closePairs:0}));
