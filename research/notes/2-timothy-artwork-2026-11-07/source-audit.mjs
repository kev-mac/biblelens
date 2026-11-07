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
const baseline='d5d1465619aa3e64b75fe7a844737c6b1db22739',j=p=>JSON.parse(fs.readFileSync(p));
const books=j('data/books.json'),chapters=j('data/chapters.json'),ci=j('data/chapter-images.json'),si=j('data/story-images.json');
const catalog=addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json')))),headings=eventHeadings(catalog,books);
validateChapterImages(ci,chapters,headings,si);
const bases=["1:6,8,16-17: lamp as a visual metaphor for stirring up the gift; iron chain evokes the letter’s imprisonment language. No identified prisoner, exact prison or claim of release; dawn and architecture imagined.", "2:6: ripe grain, harvest basket and curved tool evoke the hardworking farmer comparison. Not a documented field or a literal farming episode of Paul or Timothy; no farmer is portrayed.", "3:14-17: blank scroll, pen and ink evoke learning and scripture. No claim to reproduce a historical manuscript, exact writing, Timothy’s childhood room or a family teaching scene.", "4:13,21: cloak, books and parchments requested, with cool bare-vine landscape suggesting winter approaching. No claim the delivery happened; exact book format, room, colors and season appearance imagined."];
const details=["Native 960x540: lamp bowl/rim, circular handle, nozzle/wick and single flame; overlapping chain link contours and cuff attachment/rivet; stone shelf/support, masonry, bars and window sill. No definite malformed object, impossible join, lettering or watermark. Cool blue window light contrasts with localized warm lamp light. Hidden chain/cuff geometry and exact archaeology not certified.", "Native 960x540: curved metal tool blade/tang and wooden handle/rope wrap; woven basket rim, both handles and weave joins; grain heads/stems, tied sheaf/twine and loose seeds; orchard trunks/branches, field wall and stones. No people/animals or definite object defect. Green hills, blue sky and gold grain; exact crop species, location and implement dating not asserted.", "Native 960x540: two scroll rollers/ends, parchment edges and curled rolls in jar; reed pen nib/body, ink-pot rim and base, jar handles/rim, bowl, basket/shelf supports, table planks/legs, textile folds/fringe, doorway and foliage. Blank parchment has texture without readable pseudo-lettering. No definite object defect. Green-blue daylight and natural materials.", "Native 960x540: folded wool/stripe/fringe and muted red fabric folds; two rolled parchment bundles and cord knots; two bound books, covers, page edges and stitching; bench planks/legs/supports, jar handle/rim, bowl, stone niche/window frame and vine ties/branches. No definite object defect or writing. Cool gray-blue outside light and restrained red/blue accents. No delivery, exact provenance or historical binding certified."];
const inventory=[];
for(let c=1;c<=4;c++){
 const key='54:'+c,arts=ci[key]||[],storyPlacements=Object.entries(headings[key]||{}).flatMap(([v,ts])=>ts.filter(t=>si[t]).map(t=>({verse:+v,title:t,...si[t]})));
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
for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(a.book===54||b.book===54)pairs.push({a,b,gap:b.position-a.position});}
const closePairs=pairs.filter(p=>p.gap<5);assert.equal(closePairs.length,0);
const report={book:'2 Timothy',baseline,chapters:4,totalPlacements:4,chapterOpeners:4,storyPlacements:0,retained:4,replaced:0,inventory,preservedProductionFiles,preservedAssets,productionDelta:'None. All production files and assets byte-identical to baseline; build 388 unchanged.',minimumInternalGap:Math.min(...pairs.filter(p=>p.a.book===54&&p.b.book===54).map(p=>p.gap)),closePairs,boundaries:pairs.filter(p=>p.a.book!==p.b.book),nextBookArtworkReviewed:false};
fs.writeFileSync('research/notes/2-timothy-artwork-inventory-2026-11-07.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({chapters:4,retained:4,replaced:0,preservedProductionFiles,preservedAssets,minimumInternalGap:report.minimumInternalGap,boundaries:report.boundaries.map(r=>r.gap),closePairs:0}));
