// Run from the canonical root. Records Mark only; neighboring metadata is for spacing.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {addUX13Events} from '../../../scripts/ux13-content.mjs';
import {eventHeadings} from '../../../scripts/event-headings.mjs';
import {validateChapterImages} from '../../../scripts/chapter-images.mjs';
const baseline='dfd10f8e3e7ab9d92ed420a9735774c4d28ceee3',j=p=>JSON.parse(fs.readFileSync(p));
const chapters=j('data/chapters.json'),ci=j('data/chapter-images.json'),si=j('data/story-images.json'),books=j('data/books.json'),catalog=addUX13Events(j('data/stories.json')),headings=eventHeadings(catalog,books);
validateChapterImages(ci,chapters,headings,si);
const chapterBasis={3:'3:1–6 synagogue setting; empty architectural motif, not assertion that no man was present',6:'6:7–9 staff and sandals permitted in Mark; no travel bag, bread, money or spare coat',7:'7:1–5 washing jar/basin and bread motif',8:'8:5–8 exactly seven loaves, in rows four and three; three fish illustrate a few, not a specified textual count; partial baskets do not assert total seven',9:'9:7 bright mountain cloud, no new Moses/Elijah/Jesus portraits',10:'10:1 Jordan valley route motif; imagined location',12:'12:1 vineyard parable with wall, tower and winepress',13:'13:28 fig leaves; imagined Jerusalem skyline',15:'15:46 closed rock-cut tomb at evening; external folded linen is spare atmospheric cloth, not Jesus burial wrap outside tomb'};
const storyBasis={
 'John the Baptist and the Baptism of Jesus':'1:4–11 adult Jesus and distinct coarse-garment John in Jordan, dove motif; parallel account does not age either man',
 'Calling the Disciples and Healing in Capernaum':'1:16–20 four fishermen at boats/nets; condensed calling motif, not a claim of one simultaneous conversation with all four',
 'The Paralytic and Controversies':'2:1–5 lowering a man through opened roof amid a crowd; three complete carriers plus cropped fourth at upper edge, not a complete count of three',
 'Parables and Calming the Storm':'4:1–2 Jesus seated teaching from a boat beside listeners on land; banner previews chapter span, not the later storm instant',
 'The Gadarene Demoniac, Jairus and the Woman':'5:37–43 Jesus takes girl by hand; child compatible with twelve years, two parents and three companions; no precise child age measurable',
 'Feeding the Multitude':'6:39–44 distribution on green grass, two fish visible; further loaves during distribution are not pre-miracle inventory; partial crowd/baskets do not claim complete numbers',
 "Peter's Confession and the Transfiguration in Mark":'8:27–30 Peter speaks with Jesus on a path; no Moses/Elijah portraits inferred from broader title',
 'Blind Bartimaeus':'10:46–52 Bartimaeus reaches toward Jesus beside road; transitional rising pose, cloak loosened around lap, not a frame-by-frame reconstruction',
 'Triumphal Entry and the Temple':'11:15–17 overturned table/coins and traders carrying cages; preview within same chapter, not 11:1 entry instant',
 'The Last Supper and Gethsemane in Mark':'14:17–25 evening supper and broken bread; partial/occluded attendees do not certify a complete twelve count',
 'Trial, Crucifixion and Burial in Mark':'14:54,66–72 Peter by fire with servant woman; Jesus guarded in distant doorway; foreground man is Peter, not Jesus',
 'The Empty Tomb':'16:1–8 three women/spice jars and seated white-robed young man at right inside tomb; sunrise; exact woman-to-name mapping uncertain'
};
let chapterOpeners=0,storyOpeners=0;
const inventory=[];
for(let c=1;c<=16;c++){
 const key='40:'+c,entries=[...(ci[key]||[]).map(a=>({...a,kind:'chapter',position:a.afterVerse,textBasis:chapterBasis[c]})),...Object.entries(headings[key]||{}).flatMap(([v,tt])=>tt.filter(t=>si[t]).map(t=>({...si[t],kind:'Story',position:+v,title:t,textBasis:storyBasis[t]})))];
 const openers=entries.filter(a=>a.kind==='chapter'?a.position===0:a.position===1);assert.equal(openers.length,1,key);chapterOpeners+=openers[0].kind==='chapter';storyOpeners+=openers[0].kind==='Story';
 for(const a of entries){assert(a.textBasis);const bytes=fs.readFileSync('src'+a.src);a.bytes=bytes.length;a.sha256=createHash('sha256').update(bytes).digest('hex');a.decision='retain';a.fullSizeReview='Actual native-size file viewed; visible faces, complexion, hair, age/build, relationships/actions/objects, hands/fingers/thumbs/limbs and animals checked. Hidden or tiny anatomy not certified.';}
 inventory.push({chapter:c,openers:openers.length,entries});
}
assert.equal(chapterOpeners,9);assert.equal(storyOpeners,7);assert.equal(inventory.flatMap(r=>r.entries).length,21);
const positions=[];let offset=0;
for(const b of books.filter(b=>b.id>=39&&b.id<=41))for(let c=1;c<=b.chapters;c++){
 const k=b.id+':'+c,raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[k],'base64')));
 for(const a of ci[k]||[])positions.push({key:k,verse:a.afterVerse,position:offset+a.afterVerse,src:a.src});
 for(const[v,tt]of Object.entries(headings[k]||{}))for(const t of tt)if(si[t])positions.push({key:k,verse:+v,position:offset+(+v),src:si[t].src});offset+=raw.verses.length;
}
positions.sort((a,b)=>a.position-b.position);const consecutive=[];
for(let i=1;i<positions.length;i++){const a=positions[i-1],b=positions[i];if(a.key.startsWith('40:')||b.key.startsWith('40:'))consecutive.push({a,b,gap:b.position-a.position});}
for(const f of ['data/chapters.json','data/stories.json','data/chapter-images.json','data/story-images.json','data/story-videos.json','data/hosted-artwork.json','src/reader.js','src/stories.js','package.json','package-lock.json'])assert.deepEqual(fs.readFileSync(f),execFileSync('git',['show',baseline+':'+f],{maxBuffer:30e6}));
let preservedAssets=0;for(const line of execFileSync('git',['ls-tree','-r',baseline,'src/assets'],{encoding:'utf8',maxBuffer:5e6}).trim().split('\n')){const[m,p]=line.split('\t'),bytes=fs.readFileSync(p);assert.equal(createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex'),m.split(' ')[2],p);preservedAssets++;}
const report={baseline,book:'Mark',chapters:16,chapterOpeners,storyOpeners,storyPlacements:12,totalPlacements:21,inventory,consecutive,closePairs:consecutive.filter(p=>p.gap<5),minimumInternalGap:Math.min(...consecutive.filter(p=>p.a.key.startsWith('40:')&&p.b.key.startsWith('40:')).map(p=>p.gap)),boundaries:consecutive.filter(p=>p.a.key.split(':')[0]!==p.b.key.split(':')[0]),preservedAssets,allProductionMetadataUnchanged:true,nextBookArtworkReviewed:false};
fs.writeFileSync('research/notes/mark-artwork-inventory-2026-11-07.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({chapters:16,totalPlacements:21,preservedAssets,minimumInternalGap:report.minimumInternalGap,boundaries:report.boundaries.map(r=>r.gap),closePairs:report.closePairs.length}));
