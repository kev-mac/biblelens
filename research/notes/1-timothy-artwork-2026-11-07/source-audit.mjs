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
const baseline='a515b04b687d980cfd68248f9aab6b25f1b2f64f',j=p=>JSON.parse(fs.readFileSync(p));
const books=j('data/books.json'),chapters=j('data/chapters.json'),ci=j('data/chapter-images.json'),si=j('data/story-images.json');
const catalog=addUX13Events(JSON.parse(releaseContent('data/stories.json',b4Content('data/stories.json')))),headings=eventHeadings(catalog,books);
validateChapterImages(ci,chapters,headings,si);
const bases=["1:18-19: faith and a good conscience, and shipwreck as a metaphor. The unoccupied damaged boat does not depict a literal wreck experienced by Paul, Timothy, Hymenaeus or Alexander, nor the Acts 27 voyage.", "2:1-2,8: prayer and a quiet peaceful life. Empty courtyard and woven mats evoke this theme; the text does not specify mats or a historical prayer site. No gender-role tableau or Adam/Eve portrait invented.", "3:2: hospitality among qualities of an overseer. Bread, cups, jug and an open door evoke welcome; not a documented bishop household, identified church, spouse or child.", "4:3-5: food received with thanksgiving. Simple meal illustrates this theme without inventing an apostolic menu or portraying the dietary argument as an archaeological finding.", "5:3-16: honoring and providing for widows. Bread, sealed jar and folded cloth evoke practical support; no specific widow, age, marriage history or claimed historical delivery. Jar contents imagined as oil, not visually proven.", "6:6-8: contentment with food and clothing. Cloak, bread and cup express the theme without giving an identifiable portrait to Timothy, Paul, Pilate, servants or masters."];
const details=["Native 960x540: split mast/top, rope tie and loops, boom, slack torn fabric, ribs and inner hull, broken starboard planks, coiled and draped rope, wet rocks, small shore waves, hillside foliage and storm cloud light. Structural damage is intentional shipwreck imagery; no definite malformed object. Blue water/clouds and green coast.", "Native 960x540: three woven mats and edges, pergola crossbeams/posts, grapevine trunk/branches/leaf attachment, jar rims/bodies, lamp nozzle/wick/flame/loop handle, folded cloth stripe/weave, stone bench/paving, doorway lintel and distant settlement. No people, animals or definite object defect; peaceful leafy daylight.", "Native 960x540: jug handle joins and mouth, two cup rims/bases, scored bread and plate, plank tabletop joints/legs, textile folds/fringe, wicker planter weave, bench legs/supports, open door hinge/ring/boards and ceiling beams, wall niche jar and trailing leaves. No people/animals or definite object defect; muted red cloth and natural daylight.", "Native 960x540: blue jug single handle joins/rim, lentil bowl and food, bread crust/torn crumb and small crumbs, olive dish edges, whole/cut figs and stalks, white textile weave/folds/fringe, tabletop planks, shutter hinge, sill and orchard trunks. No people/animals or definite object defect; blue glaze/green fruit avoid uniform amber.", "Native 960x540: two basket handles and weave joins, loaf and linen edge/fringe, sealed jar/cork/handle and vessel foot, purple cloth folds/fringe, door hinge/boards/ironwork, threshold support, shaded interior pottery, flowering stems and leaves. No people/animals or definite object defect; warm exterior light with purple/green accents.", "Native 960x540: thick folded cloak/weave/fringe, single cup rim/foot and body, bread crust, shelf edge/support, niche jar mouth, lintel/hinge/door panel, path paving, olive branches and distant blue hills. No people/animals or definite object defect; cool blue dawn/dusk view, no claim to exact time of day."];
const inventory=[];
for(let c=1;c<=6;c++){
 const key='53:'+c,arts=ci[key]||[],storyPlacements=Object.entries(headings[key]||{}).flatMap(([v,ts])=>ts.filter(t=>si[t]).map(t=>({verse:+v,title:t,...si[t]})));
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
for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(a.book===53||b.book===53)pairs.push({a,b,gap:b.position-a.position});}
const closePairs=pairs.filter(p=>p.gap<5);assert.equal(closePairs.length,0);
const report={book:'1 Timothy',baseline,chapters:6,totalPlacements:6,chapterOpeners:6,storyPlacements:0,retained:6,replaced:0,inventory,preservedProductionFiles,preservedAssets,productionDelta:'None. All production files and assets byte-identical to baseline; build 388 unchanged.',minimumInternalGap:Math.min(...pairs.filter(p=>p.a.book===53&&p.b.book===53).map(p=>p.gap)),closePairs,boundaries:pairs.filter(p=>p.a.book!==p.b.book),nextBookArtworkReviewed:false};
fs.writeFileSync('research/notes/1-timothy-artwork-inventory-2026-11-07.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({chapters:6,retained:6,replaced:0,preservedProductionFiles,preservedAssets,minimumInternalGap:report.minimumInternalGap,boundaries:report.boundaries.map(r=>r.gap),closePairs:0}));
