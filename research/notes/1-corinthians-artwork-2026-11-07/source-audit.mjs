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
const baseline='ddbbf81cfe154c07347c741dba83fca711962b2a',j=p=>JSON.parse(fs.readFileSync(p));
const books=j('data/books.json'),chapters=j('data/chapters.json'),ci=j('data/chapter-images.json'),si=j('data/story-images.json');
const catalog=addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json')))),headings=eventHeadings(catalog,books);
validateChapterImages(ci,chapters,headings,si);
const bases=[
 "1:18–25 cross motif; empty cross outside unnamed town, not a reconstruction of a particular crucifixion.",
 "2:9–12 searching depths: clear shallows/deep blue sea as visual analogy, not a literal portrait of the Spirit.",
 "3:6–9 planting and watering: young olive tree, water jug and cultivated field; no Paul/Apollos portraits.",
 "4:1–2 stewardship: grain jars, stored linen and key; an imagined store room, no named steward.",
 "5:7–8 unleavened bread: flat bread, flour and herbs; visual motif, not a literal gathering or identification of an offender.",
 "6:19–20 body as temple: empty colonnaded temple courtyard as literary motif, not a body or exact historical building.",
 "7:17–24 ordinary responsibilities and calling: empty household with loom; no invented spouse, relationship or claim about marital status.",
 "8:1–13 food and conscience: empty dining table and distant temple; not an asserted meal of a particular named person.",
 "9:24–25 athletes and perishable crown: empty running track with leafy wreath, no named athlete.",
 "10:16–17 one bread and cup: single loaf and clay cup; no scene of the wilderness or invented named participants.",
 "11:23–26 remembered bread/cup: broken loaf and cup in evening lamplight; symbolic still life, no Jesus/apostles or claim of exact Last Supper reconstruction.",
 "12:4–7 diverse gifts serving shared purpose: useful pot, basket, shuttle, chisel and rule as analogy; no literal body or severed body parts.",
 "13:12 dim mirror: bronze mirror with blurred architectural reflection; no face or person in reflection.",
 "14:7–8 distinct instrument sounds: flute and bronze trumpet before empty stools; imagined setting, not a claim that these instruments were used in a named service.",
 "15:35–38 seed and growth: grain seeds in soil and green shoots; no literal depiction of resurrected persons.",
 "16:1–4 collection for Jerusalem: coins, bag and rolled sheet beside imagined harbor; no named traveller, donor or assertion that Paul is imprisoned or has already arrived."
];
const details=[
 "Wooden cross beams, binding ropes and stone footing coherent; blue/mauve dawn, green hills; no figure on cross or tiny person in town.",
 "Water/rock transitions, wave surfaces, tree branches and coastal horizon coherent; natural blue/green palette, no swimmers or boats with people.",
 "Sapling roots/trunk/leaves and wet soil, jug rim/handle, field and house checked; no hidden farmer.",
 "Jar lids/rims/handles, grain bowl, folded cloth, key teeth/bow, basket weave and shelving checked; no human form.",
 "Flat bread edges and layers, flour bowl, herbs, cloth fringe and table joints checked; no visible leavened loaf substituted.",
 "Columns/capitals/bases, stairs, pediment and courtyard geometry checked; no statues mistaken for human figures.",
 "Loom upright frame, threads, crossbars and purple woven cloth, stools/legs, shuttle, jug handles and basket checked; exact historical loom mechanism not certified.",
 "Loaf and slice, olives/bowls, platter rim, table/bench legs and distant temple checked; empty seats and no diners.",
 "Track lanes, stone seating, wreath leaf/stem overlap and cloth checked; no distant runners or invented inscriptions.",
 "One loaf, cup rim/base, cloth fringe, table planks, arch/stairs and baskets/jars checked; no communion participant.",
 "Broken loaf interior/crust, cup rim/liquid, lamp handle/spout/wick/flame and jar handles checked; blue dusk and restrained lamp warmth.",
 "Pot rim, basket weave/rim, shuttle/spool thread, chisel blade/handle, wooden rule and bench edges checked; distinct objects without detached human anatomy.",
 "Mirror rim/support/pivots/base and dim window reflection, jar rim/base, linen fringe and tabletop checked; no reflected face.",
 "Flute mouthpiece/finger holes/end opening, trumpet mouthpiece/tube/bell, stool legs and roof supports checked; no limbs or invented written music.",
 "Seed outlines, shallow furrows, green shoot stems/leaves and light checked; purple dawn/green field, no people/animals.",
 "Coin edges, basket weave/rim, bag opening/cord knot, rolled blank sheet, boat hull/mast/rigging and harbor checked; no readable fabricated inscriptions or identifiable tiny travellers."
];
const inventory=[];
for(let c=1;c<=16;c++){
 const key='45:'+c,arts=ci[key]||[],storyPlacements=Object.entries(headings[key]||{}).flatMap(([v,ts])=>ts.filter(t=>si[t]).map(t=>({verse:+v,title:t,...si[t]})));
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
for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(a.book===45||b.book===45)pairs.push({a,b,gap:b.position-a.position});}
const closePairs=pairs.filter(p=>p.gap<5);assert.equal(closePairs.length,0);
const report={book:'1 Corinthians',baseline,chapters:16,totalPlacements:16,chapterOpeners:16,storyPlacements:0,retained:16,replaced:0,inventory,preservedProductionFiles,preservedAssets,productionDelta:'None. All production files and assets byte-identical to baseline; build 388 unchanged.',minimumInternalGap:Math.min(...pairs.filter(p=>p.a.book===45&&p.b.book===45).map(p=>p.gap)),closePairs,boundaries:pairs.filter(p=>p.a.book!==p.b.book),nextBookArtworkReviewed:false};
fs.writeFileSync('research/notes/1-corinthians-artwork-inventory-2026-11-07.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({chapters:16,retained:16,replaced:0,preservedProductionFiles,preservedAssets,minimumInternalGap:report.minimumInternalGap,boundaries:report.boundaries.map(r=>r.gap),closePairs:0}));
