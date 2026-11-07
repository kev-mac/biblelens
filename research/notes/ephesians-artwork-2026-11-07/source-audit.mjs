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
const baseline='d9653ffd56004e7ca103845e70655699431cc8bb',j=p=>JSON.parse(fs.readFileSync(p));
const books=j('data/books.json'),chapters=j('data/chapters.json'),ci=j('data/chapter-images.json'),si=j('data/story-images.json');
const catalog=addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json')))),headings=eventHeadings(catalog,books);
validateChapterImages(ci,chapters,headings,si);
const bases=[
  "1:1-2,13-14: letter greeting and sealing metaphor. Blank rolled papyrus, pen and seal are an imagined literary still life; no claim of Paul’s actual manuscript, room, handwriting or composition location.",
  "2:19-22: household/building and chief cornerstone metaphor. One broad corner block joins two stone walls; not a claimed archaeological discovery or literal portrait of Christ.",
  "3:17-19: rooted and grounded in love, breadth/length/depth/height. Rooted tree and wide landscape illustrate the metaphor; no specified tree species or location asserted by scripture.",
  "4:28: honest labor and giving to those in need. Woodworking tools, completed bowl and food basket recall work/sharing, not a named carpenter or a specific trade attributed to Paul.",
  "5:8-14: walking as children of light. Path from cool shade toward dawn illustrates light/walking language; no invented bride, groom, named person or exact biblical town.",
  "6:13-17: armor metaphor with helmet, breastplate, belt, paired sandals, shield and sheathed sword. Empty equipment is not a combat scene, portrait, actual apostolic possession or claim of a fully dated archaeological reconstruction."
];
const details=[
  "Papyrus fibres/rolled edge, cord knot/tails, reed shaft/cut nib, ink-pot rim, seal handle/base, sealing material, jug handles, basket weave, cloth, stone doorway/door ring and blue coastal view checked at native 960x540. No lettering or people/animals in doorway/distance.",
  "Corner block alignment/weight, joined walls and coursing, stone texture, paving, olive stems/leaves/fruit, pergola, vines and background windows checked. Old pre-commit corner-mark repair remains clean. No person/animal in background or signature-like lettering.",
  "Trunk/branch junctions, roots joining trunk and entering soil, leaves, ground vegetation, rock forms, hills/mist and cloud light checked. Natural greens, blue hills, lavender sky; no face-like subject, human or animal.",
  "Mallet head/handle, hatchet edge/shaft joint, bowl rim/woodgrain, shavings, basket handles/weave, loaf, fruit, bench supports, burgundy/beige textile fringes and background tree checked. No craftsman/hands or animal visible.",
  "Stone steps/path perspective, wall courses, roof timbers, door/window openings, jar handles, basket weave, vine leaves/grapes, olive branches and shadow/dawn direction checked. Blue shade/pink-violet dawn; no tiny pedestrians/animals.",
  "Helmet cheek pieces/opening and rim, breastplate arm/neck holes, straps/buckles, belt coil, two empty sandals with soles/straps, shield boards/rim/rivets/boss, sheathed sword hilt/scabbard/tip, bench/cloth checked. No body parts, wearer, hands or animals; dark eye-like helmet opening is empty."
];
const inventory=[];
for(let c=1;c<=6;c++){
 const key='48:'+c,arts=ci[key]||[],storyPlacements=Object.entries(headings[key]||{}).flatMap(([v,ts])=>ts.filter(t=>si[t]).map(t=>({verse:+v,title:t,...si[t]})));
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
for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(a.book===48||b.book===48)pairs.push({a,b,gap:b.position-a.position});}
const closePairs=pairs.filter(p=>p.gap<5);assert.equal(closePairs.length,0);
const report={book:'Ephesians',baseline,chapters:6,totalPlacements:6,chapterOpeners:6,storyPlacements:0,retained:6,replaced:0,inventory,preservedProductionFiles,preservedAssets,productionDelta:'None. All production files and assets byte-identical to baseline; build 388 unchanged.',minimumInternalGap:Math.min(...pairs.filter(p=>p.a.book===48&&p.b.book===48).map(p=>p.gap)),closePairs,boundaries:pairs.filter(p=>p.a.book!==p.b.book),nextBookArtworkReviewed:false};
fs.writeFileSync('research/notes/ephesians-artwork-inventory-2026-11-07.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({chapters:6,retained:6,replaced:0,preservedProductionFiles,preservedAssets,minimumInternalGap:report.minimumInternalGap,boundaries:report.boundaries.map(r=>r.gap),closePairs:0}));
