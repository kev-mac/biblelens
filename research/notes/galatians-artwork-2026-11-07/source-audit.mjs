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
const baseline='f1def6e5b16459a187443476ca68ecd7cd84f7b0',j=p=>JSON.parse(fs.readFileSync(p));
const books=j('data/books.json'),chapters=j('data/chapters.json'),ci=j('data/chapter-images.json'),si=j('data/story-images.json');
const catalog=addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json')))),headings=eventHeadings(catalog,books);
validateChapterImages(ci,chapters,headings,si);
const bases=[
  "1:1–5,11–24: letter and recalled calling/travel. Blank scroll, pen and countryside are an imagined setting, not Paul’s actual document or a claimed composition site.",
  "2:9–14: fellowship and shared eating; empty courtyard meal recalls the issue of table fellowship without inventing a named participant or asserting that the dispute ended at this table.",
  "3:1,13–14: crucifixion and tree/cross motif. Bare cross is a literary illustration, not the historical instrument, exact site or a portrait of Jesus.",
  "4:21–31, especially 24–26: Sinai within Paul’s explicit allegory. Imagined mountain terrain, not proof of a located biblical site; no Hagar, Sarah or children visible.",
  "5:22–23: fruit of the Spirit metaphor. Figs are an illustrative analogy; text specifies neither a fig species nor a literal count of fruits for the virtues.",
  "6:7–9: sowing and reaping analogy; foreground shoots and separate mature field/sheaf show different strips/stages, not one plant instantly maturing."
];
const details=[
  "Papyrus rolls/edges/fibres, reed nib/shaft, ink-pot rim, jar handles, basket weave, shelf/window and road/hills checked. No writing, person or tiny animal; neutral natural morning, faded red cloth.",
  "Table legs/planks, bread crust/broken pieces, olives, cup/bowl rims, jug handles, woven cushions/rug/fringes, doorway/tree/courtyard checked. All seats empty. Green shade, muted purple and sage textiles.",
  "Cross upright/beam joint and fastener, weathered wood, base set among stones, olive branches, red flowers and cloud/hill terrain checked. No human body, figure, inscription or hidden animal.",
  "Ridge lines, rock strata, shadow/light directions, foreground scrub and wide clouded blue sky checked. No anthropomorphic face, person, animal or literalized maternal allegory.",
  "Fig stems/attachments and terminal openings, branch joints, lobed leaves/veins, trunk bark, orchard and lower corners checked at native size. No remaining signature-like lettering, no people or animals.",
  "Seedling leaves/rows, separated planting strips/path, ripe wheat heads/stalks, sheaf cut ends/binding and ground contact, olive branches and dawn horizon checked. No farmer, animal or anatomy."
];
const inventory=[];
for(let c=1;c<=6;c++){
 const key='47:'+c,arts=ci[key]||[],storyPlacements=Object.entries(headings[key]||{}).flatMap(([v,ts])=>ts.filter(t=>si[t]).map(t=>({verse:+v,title:t,...si[t]})));
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
for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(a.book===47||b.book===47)pairs.push({a,b,gap:b.position-a.position});}
const closePairs=pairs.filter(p=>p.gap<5);assert.equal(closePairs.length,0);
const report={book:'Galatians',baseline,chapters:6,totalPlacements:6,chapterOpeners:6,storyPlacements:0,retained:6,replaced:0,inventory,preservedProductionFiles,preservedAssets,productionDelta:'None. All production files and assets byte-identical to baseline; build 388 unchanged.',minimumInternalGap:Math.min(...pairs.filter(p=>p.a.book===47&&p.b.book===47).map(p=>p.gap)),closePairs,boundaries:pairs.filter(p=>p.a.book!==p.b.book),nextBookArtworkReviewed:false};
fs.writeFileSync('research/notes/galatians-artwork-inventory-2026-11-07.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({chapters:6,retained:6,replaced:0,preservedProductionFiles,preservedAssets,minimumInternalGap:report.minimumInternalGap,boundaries:report.boundaries.map(r=>r.gap),closePairs:0}));
