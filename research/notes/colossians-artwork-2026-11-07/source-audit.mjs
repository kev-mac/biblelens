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
const baseline='34a90d08310a32890bcc66a5ca505a21d9f2e7f3',j=p=>JSON.parse(fs.readFileSync(p));
const books=j('data/books.json'),chapters=j('data/chapters.json'),ci=j('data/chapter-images.json'),si=j('data/story-images.json');
const catalog=addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json')))),headings=eventHeadings(catalog,books);
validateChapterImages(ci,chapters,headings,si);
const bases=["1:6,10: the gospel bearing fruit and being fruitful in every good work. Fig tree/garden illustrate the fruit metaphor; no named historical garden or portrait asserted.", "2:6-7: walking in Christ, rooted and built up in him. Olive roots over a stone terrace illustrate rootedness; no literal reported planting or exact site asserted.", "3:9-14: putting off the old self and putting on the new, kindness and love. Tunic and sash illustrate clothing language, not a reported event or a named person’s garments.", "4:5-6: wise conduct and speech seasoned with salt. Bowl of coarse salt illustrates the speech metaphor; open gate is background, not a claimed depiction of Paul’s bonds or actual letter setting."];
const details=["Native 960x540 inspection of fig stems and attachment, leaf lobes/veins, branch junctions/bark, terrace stonework, orchard rows and blue hills. Purple fruit and green leaves, natural daylight. No people, tiny silhouettes, animals, lettering or definite object defect.", "Native inspection of olive leaf/fruit attachments, trunk fork and bark, exposed root routes over stone courses, terraces and distant slopes. Overcast light and grey-green palette. No people/animals or definite malformed object.", "Native inspection of tunic neckline/placket, both sleeves/cuffs, hem stitching, folds, sash fringe/weave, bench plank/leg joins, pottery/basket, window stonework and distant town. Blue tunic and muted red sash. Empty garment; no body, human/animal or definite defect.", "Native inspection of bowl rim/base, salt pile and spilled crystals, cloth weave/fringe, olive leaves/branch, stone ledge, jug rim and gate panel/hinge construction. Cool dusk and natural leaf shadows. No people, animals, writing or definite object defect."];
const inventory=[];
for(let c=1;c<=4;c++){
 const key='50:'+c,arts=ci[key]||[],storyPlacements=Object.entries(headings[key]||{}).flatMap(([v,ts])=>ts.filter(t=>si[t]).map(t=>({verse:+v,title:t,...si[t]})));
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
for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(a.book===50||b.book===50)pairs.push({a,b,gap:b.position-a.position});}
const closePairs=pairs.filter(p=>p.gap<5);assert.equal(closePairs.length,0);
const report={book:'Colossians',baseline,chapters:4,totalPlacements:4,chapterOpeners:4,storyPlacements:0,retained:4,replaced:0,inventory,preservedProductionFiles,preservedAssets,productionDelta:'None. All production files and assets byte-identical to baseline; build 388 unchanged.',minimumInternalGap:Math.min(...pairs.filter(p=>p.a.book===50&&p.b.book===50).map(p=>p.gap)),closePairs,boundaries:pairs.filter(p=>p.a.book!==p.b.book),nextBookArtworkReviewed:false};
fs.writeFileSync('research/notes/colossians-artwork-inventory-2026-11-07.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({chapters:4,retained:4,replaced:0,preservedProductionFiles,preservedAssets,minimumInternalGap:report.minimumInternalGap,boundaries:report.boundaries.map(r=>r.gap),closePairs:0}));
