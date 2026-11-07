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
const baseline='8ab9aae0ea72b371b9c8a814bcdd273e7a32ce49',j=p=>JSON.parse(fs.readFileSync(p));
const books=j('data/books.json'),chapters=j('data/chapters.json'),ci=j('data/chapter-images.json'),si=j('data/story-images.json');
const catalog=addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json')))),headings=eventHeadings(catalog,books);
validateChapterImages(ci,chapters,headings,si);
const bases=[
 "1:3–11,15–16 comfort amid affliction and planned sea travel; shelter after a storm is a visual analogy, not a specific narrated rescue or exact port.",
 "2:12–13 an opened door at Troas and departure to Macedonia; empty doorway toward coast as metaphor, not an asserted surviving building.",
 "3:1–3,13–16 letters/ink and veil motifs; blank rolled sheet and linen, no Moses, Israelites or literal picture of the Spirit.",
 "4:7 treasure in clay vessels; coins illustrate the treasure metaphor without equating the gospel with money or identifying historical coins.",
 "5:1–4 earthly tent metaphor; worn empty tent, no invented body, heavenly architecture or named camper.",
 "6:14 unequal yoke metaphor; empty wooden double yoke without animals or an invented human pairing.",
 "7:1,4–13 cleansing and renewed comfort; basin and refreshed courtyard are visual motifs, no literal meeting with Titus.",
 "8:2–4,12–15,19–24 generosity and administered gifts/travel; modest coins, parcels and bread as imagined gift objects, no invented donor or Titus portrait.",
 "9:6,10 sowing and harvest analogy; seed basket, prepared soil and neighboring ripe field, not instant harvest or a named sower.",
 "10:9–11 absent letters and presence; tied blank scroll and pen, no assertion that Paul is imprisoned or depiction of a stronghold assault.",
 "11:32–33 recalled Damascus basket escape; empty basket and rope beside high wall window, no invented guards or current Paul portrait. This recollection is earlier than letter composition.",
 "12:7–10 thorn and strength in weakness; dry thorn branch and new leaves as analogy, no diagnosis of Paul’s unspecified thorn or literal vision of the third heaven.",
 "13:10–11 building up, comfort and peace; empty courtyard benches/table as imagined gathering setting, not a named attendance claim or claim Paul is already present."
];
const details=[
 "Boat hull/planks, mast/yard, furled sail, rigging and mooring ropes, bollard, waves/breakwater, shelter posts and jar handles checked; natural cool dawn, no tiny crew.",
 "Door boards/hinges/ring, threshold, vine stems/leaves, baskets and jar rims, coastal path and sea checked; empty interior and path, green/blue daylight.",
 "Rolled sheet edges/fibres and binding knot, ink pot rim/liquid, cut reed nib and woven linen fringe checked; no fabricated writing or face hidden in cloth.",
 "Jar mouth/rim/base and coin overlaps, shelf bowl/basket, cloth fringe and natural light checked; no portrait relief readable on coins.",
 "Tent poles, ridge, fabric patches/seams/holes, pegs/rope attachments and support stones checked; open interior empty; purple dusk and green hillside.",
 "Double yoke beam/joints, two wooden bows, lashings and hanging rope loop checked; coherent object, empty field, no animals or displaced limbs.",
 "Basin rim/base, water reflection and surface, folded towel weave/fringe, wet paving/arch/vines checked; no reflected person, restrained green light.",
 "Coin edges/overlaps, open bag mouth/drawstring, parcel binding knots, basket rim/weave, bread crust, jar handles, red/blue textiles and bench checked; no donors or travellers.",
 "Seed outlines, basket rim/weave, furrow edges, grain stalks/heads, olive branches and distant horizon checked; distinct growth areas, no farmer or hidden animal.",
 "Rolled sheet edges/binding knot, reed nib/shaft, jar handles/rims, curtain weave, shutter/hinges and tiny harbor checked; no readable text or identifiable traveller.",
 "Basket rim/weave/handles and base, rope coil/knot/strands, window masonry, moon/clouds and city skyline checked; no signature-like mark, no person in basket or beyond wall. Active v2 retained; v1 remains inactive.",
 "Thorn branch joints/tips, fresh leaf stems/veins, droplets, wet rock and sky checked; leaves belong to a separate living plant, no anatomical fragment or literal affliction claim.",
 "Bench/table legs and joints, cups/jar handles and rims, fruit bowl, cloth/cushion weave, olive branches and doorway checked; all seats empty, blue/red cloth balances green daylight."
];
const inventory=[];
for(let c=1;c<=13;c++){
 const key='46:'+c,arts=ci[key]||[],storyPlacements=Object.entries(headings[key]||{}).flatMap(([v,ts])=>ts.filter(t=>si[t]).map(t=>({verse:+v,title:t,...si[t]})));
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
for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(a.book===46||b.book===46)pairs.push({a,b,gap:b.position-a.position});}
const closePairs=pairs.filter(p=>p.gap<5);assert.equal(closePairs.length,0);
const report={book:'2 Corinthians',baseline,chapters:13,totalPlacements:13,chapterOpeners:13,storyPlacements:0,retained:13,replaced:0,inventory,preservedProductionFiles,preservedAssets,productionDelta:'None. All production files and assets byte-identical to baseline; build 388 unchanged.',minimumInternalGap:Math.min(...pairs.filter(p=>p.a.book===46&&p.b.book===46).map(p=>p.gap)),closePairs,boundaries:pairs.filter(p=>p.a.book!==p.b.book),nextBookArtworkReviewed:false};
fs.writeFileSync('research/notes/2-corinthians-artwork-inventory-2026-11-07.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({chapters:13,retained:13,replaced:0,preservedProductionFiles,preservedAssets,minimumInternalGap:report.minimumInternalGap,boundaries:report.boundaries.map(r=>r.gap),closePairs:0}));
