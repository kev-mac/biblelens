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
const baseline='00a65a6952e760752b965d212310c15ab2ec4006',j=p=>JSON.parse(fs.readFileSync(p));
const books=j('data/books.json'),chapters=j('data/chapters.json'),ci=j('data/chapter-images.json'),si=j('data/story-images.json');
const catalog=addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json')))),headings=eventHeadings(catalog,books);
validateChapterImages(ci,chapters,headings,si);
const bases=[
 '1:19–20 creation: sea, hills and sky; no literal portrait of God or person.',
 '2:1–16 impartial judgment and law: balanced scales and rolled scroll; illustrative metaphor, not a narrated courtroom.',
 '3:19–22 law and prophets: blank open scroll and rolled scrolls; no fabricated quotation.',
 '4:17–21 Abraham’s promise and descendants: starry sky and empty tent recall Genesis 15:5; no Abraham/Sarah portrait or age claim.',
 '5:1–5 endurance and hope: living shoot through rock after storm, an illustrative metaphor, not a literal narrated plant.',
 '6:3–4 baptism and new life: empty steps into clear water; no claimed reconstruction or identifiable baptized person.',
 '7:6–7 the law: blank scroll in lamplight; lamp/window are imagined setting, no fabricated quotation.',
 '8:19–23 creation awaiting renewal: valley after rain, a visual motif rather than a claim to depict the future literally.',
 '9:20–21 potter and vessels: raw clay, coherent bowls/jars and idle wheel; no potter portrait.',
 '10:15 good-news messengers: path through hills, recalling the quoted Isaiah 52:7 mountains; no identifiable messenger or claimed precise route.',
 '11:17–24 olive graft metaphor: bound leafy branch inserted into living tree; binding/cut/join inspected. No people identified with branches.',
 '12:13,20 hospitality and food/drink: bread, cups, pitcher and empty chair beside open doorway; no literal enemy portrait.',
 '13:6–7 tribute and dues: plain coins and pouch; no invented readable ruler or exact coin provenance.',
 '14:1–3,17–21 meals and mutual respect: bread, greens, olives and pulses at shared table; no identifiable eaters or assertion about a named person’s diet.',
 '15:25–28 contribution and travel plans: bread basket, bundle and staff by doorway; a journey/aid motif, not Paul reaching Rome/Spain or being imprisoned.',
 '16:3–5 house gathering: empty courtyard benches/table; imagined house setting, not certified archaeological Priscilla/Aquila home or their portraits.'
];
const details=[
 'Sea/rocks, olive foliage and horizon coherent; blue/green daylight.',
 'Both pans, suspension chains, pivot and base coherent; rolled scroll, column/arch geometry checked.',
 'Scroll rolls/rods, desk edges and window checked; intentionally blank writing surface.',
 'Empty tent ropes and stakes, stars and hills coherent; deep blue night, no visible person.',
 'Shoot stems/leaves, rock fissure, clouds and sunbeams coherent; natural green/blue palette.',
 'Step edges, water/reflections, rocks and reeds coherent; no body submerged or hidden portrait implied.',
 'Lamp handle/spout/wick/flame and scroll edge checked; dusk blue through window, restrained warm lamp.',
 'Trees, watercourse, cloud light and foreground plants coherent; no tiny people/animals visible.',
 'Vessel rims, bowl, clay lumps and wheel spindle/base inspected; no detached hand or human figure.',
 'Path, terraces/stone buildings and trees coherent; mauve dawn, no identifiable distant traveller.',
 'Actual full-size graft cut, wrapping, branch and leaf forms inspected; no impossible floating branch.',
 'Chair legs/woven seat, cups/pitcher handle, bread/basket and tabletop inspected; purple cloth provides palette variety.',
 'Coin edges, pouch opening/drawstrings and cloth checked; plain faces do not claim inscriptions or precise numismatics.',
 'Food/bowl rims, cup, bread, low table legs and cushions inspected; no apparent human/animal anatomy.',
 'Basket weave/handle, loaves, staff and bundle knot coherent; no named traveller assigned.',
 'Bench/table legs, cups/pitcher handle, lamp/wick/flame and courtyard architecture coherent; dusk blue/purple setting.'
];
const inventory=[];
for(let c=1;c<=16;c++){
 const key='44:'+c,arts=ci[key]||[],storyPlacements=Object.entries(headings[key]||{}).flatMap(([v,ts])=>ts.filter(t=>si[t]).map(t=>({verse:+v,title:t,...si[t]})));
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
for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(a.book===44||b.book===44)pairs.push({a,b,gap:b.position-a.position});}
const closePairs=pairs.filter(p=>p.gap<5);assert.equal(closePairs.length,0);
const report={book:'Romans',baseline,chapters:16,totalPlacements:16,chapterOpeners:16,storyPlacements:0,retained:16,replaced:0,inventory,preservedProductionFiles,preservedAssets,productionDelta:'None. All production files and assets byte-identical to baseline; build 388 unchanged.',minimumInternalGap:Math.min(...pairs.filter(p=>p.a.book===44&&p.b.book===44).map(p=>p.gap)),closePairs,boundaries:pairs.filter(p=>p.a.book!==p.b.book),nextBookArtworkReviewed:false};
fs.writeFileSync('research/notes/romans-artwork-inventory-2026-11-07.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({chapters:16,retained:16,replaced:0,preservedProductionFiles,preservedAssets,minimumInternalGap:report.minimumInternalGap,boundaries:report.boundaries.map(r=>r.gap),closePairs:0}));
