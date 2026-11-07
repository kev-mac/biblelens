// Run from the canonical root. Records Luke only; neighboring metadata is for spacing.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {addUX13Events} from '../../../scripts/ux13-content.mjs';
import {eventHeadings} from '../../../scripts/event-headings.mjs';
import {validateChapterImages} from '../../../scripts/chapter-images.mjs';
const baseline='9c0dea4bc9a6eb579f1c847e52c28a3cb30e35d5',j=p=>JSON.parse(fs.readFileSync(p));
const chapters=j('data/chapters.json'),ci=j('data/chapter-images.json'),si=j('data/story-images.json'),books=j('data/books.json'),catalog=addUX13Events(j('data/stories.json')),headings=eventHeadings(catalog,books);
validateChapterImages(ci,chapters,headings,si);
const chapterBasis={
1:'1:1–4 writing materials motif for the preface, blank sheet does not invent a quotation',2:'2:8–20 sheep resting at night in Bethlehem countryside; imagined landscape',3:'3:9 axe at tree roots beside Jordan, warning motif',4:'4:1–4 wilderness stones, no person or devil portrait',6:'6:1–5 path through grain on the Sabbath, no invented disciple portraits',8:'8:4–15 path, stones, thorns and good soil motif',9:'9:13–17 exactly five loaves (three back/two front) and two fish; prior-to-distribution inventory, not seven-loaf miracle',10:'10:30 Jericho road motif, imagined geography',11:'11:33–36 lamp on stand motif',12:'12:22–28 lilies and field grass motif, not a claim of a botanical identification',13:'13:18–19 mustard in a garden, growing plant rather than a claim this is the mature final tree',14:'14:7–24 feast table motif, no claim all invited people absent at once',16:'16:1–8 oil jars, wheat and account-sheet motif; blank sheet invents no debt values',17:'17:6 sycamine/mulberry beside water teaching motif, no claim actual uprooting occurred',18:'18:9–14 temple court motif, architectural imagining without prayer portraits',20:'20:9–18 vineyard parable, retains active v2 landscape',21:'21:1–4 two small coins, widow offering motif; no invented inscription',22:'22:14–20 bread/cup supper motif, no new apostle count/portraits',23:'23:50–56 closed rock-cut tomb at evening, no portrait of Joseph of Arimathea',24:'24:1–12 open tomb and linen at dawn, empty architectural motif does not assert women/two messengers absent'};
const storyBasis={
'The Births of John and Jesus':'Story Luke 1:5–2:20; depicts 2:7–20 birth/shepherd visit within the full unchanged Story span, not a claim Jesus is already born in 1:5. Young shepherd is anonymous, not infant John; Mary holds swaddled infant beside feeding trough.',
'Presentation and the Boy Jesus in the Temple':'Story 2:21–52; depicts 2:41–50 twelve-year-old Jesus seated among teachers and reunited parents, not eight-day-old presentation. Mary/Joseph plausibly twelve years older; not Simeon/Anna portraits.',
'Rejection at Nazareth':'4:16–20 Jesus stands reading scroll before villagers; previews reading phase, not the later seated explanation or expulsion instant.',
'The Miraculous Catch':'5:1–11 Simon kneels at Jesus knees beside full net in boat; helpers across neighboring boats are partial, not precise total; no unsupported fixed hour asserted.',
"The Centurion and the Widow's Son":'7:11–17 widow reaches toward young son sitting on bier near Nain gate; no claim this is centurion servant or Jairus daughter.',
'The Sinful Woman Anoints Jesus':'7:36–50 unnamed woman with loose hair touches Jesus feet at a meal, ointment vessel nearby; no identification as Mary Magdalene, Bethany Mary, or Jesus mother. Basin is an imagined incidental vessel, not attribution of footwashing to host (7:44).',
'The Good Samaritan and Mary and Martha':'Story 10:25–42; depicts 10:30–35 Samaritan bandaging traveler beside road with mount and jar; no Mary/Martha portrait inferred from broad title.',
'The Lost Sheep, Coin and Son':'Story 15:1–32; depicts 15:20 father embracing returning younger son, distant adult compatible with elder brother; condensed parable vignette not assertion all phases simultaneous.',
'The Rich Man and Lazarus':'16:19–21 Lazarus outside rich household gate with dog and rich man at meal in purple/red-purple and fine garments; earlier earthly phase, not Abraham or Lazarus of Bethany.',
'Zacchaeus':'19:1–10 short-statured adult in sycamore with Jesus looking up; crouch/perspective cannot certify exact height; no invented numeric measurement.',
'New Covenant':'Shared Story passage Jeremiah 31:31–34, deliberately cross-linked by compiled headings at Luke 22:20; older Jeremiah teaching families, not Jesus at Last Supper or literal event at Luke 22:20. Same shared source as Jeremiah review.',
'The Road to Emmaus':'24:13–35 depicts evening recognition at bread-breaking in 24:29–31 with two travelers, one named Cleopas in text but not face-mapped. Other traveler not assigned a biblical name.',
'The Ascension':'Story 24:36–53 depicts 24:50–51 Jesus blessing gathered followers near Bethany before departure; standing pose need not depict already airborne instant. Partial/occluded group is not exact total; women not individually named.'
};
let chapterOpeners=0,storyOpeners=0;
const inventory=[];
for(let c=1;c<=24;c++){
 const key='41:'+c,entries=[...(ci[key]||[]).map(a=>({...a,kind:'chapter',position:a.afterVerse,textBasis:chapterBasis[c]})),...Object.entries(headings[key]||{}).flatMap(([v,tt])=>tt.filter(t=>si[t]).map(t=>({...si[t],kind:'Story',position:+v,title:t,textBasis:storyBasis[t]})))];
 const openers=entries.filter(a=>a.kind==='chapter'?a.position===0:a.position===1);assert.equal(openers.length,1,key);chapterOpeners+=openers[0].kind==='chapter';storyOpeners+=openers[0].kind==='Story';
 for(const a of entries){assert(a.textBasis);const bytes=fs.readFileSync('src'+a.src);a.bytes=bytes.length;a.sha256=createHash('sha256').update(bytes).digest('hex');a.decision='retain';a.fullSizeReview='Actual native-size file viewed; visible faces, complexion, hair, age/build, relationships/actions/objects, hands/fingers/thumbs/limbs and animals checked. Hidden or tiny anatomy not certified.';}
 inventory.push({chapter:c,openers:openers.length,entries});
}
assert.equal(chapterOpeners,20);assert.equal(storyOpeners,4);assert.equal(inventory.flatMap(r=>r.entries).length,33);
const positions=[];let offset=0;
for(const b of books.filter(b=>b.id>=40&&b.id<=42))for(let c=1;c<=b.chapters;c++){
 const k=b.id+':'+c,raw=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[k],'base64')));
 for(const a of ci[k]||[])positions.push({key:k,verse:a.afterVerse,position:offset+a.afterVerse,src:a.src});
 for(const[v,tt]of Object.entries(headings[k]||{}))for(const t of tt)if(si[t])positions.push({key:k,verse:+v,position:offset+(+v),src:si[t].src});offset+=raw.verses.length;
}
positions.sort((a,b)=>a.position-b.position);const consecutive=[];
for(let i=1;i<positions.length;i++){const a=positions[i-1],b=positions[i];if(a.key.startsWith('41:')||b.key.startsWith('41:'))consecutive.push({a,b,gap:b.position-a.position});}
for(const f of ['data/chapters.json','data/stories.json','data/chapter-images.json','data/story-images.json','data/story-videos.json','data/hosted-artwork.json','src/reader.js','src/stories.js','package.json','package-lock.json'])assert.deepEqual(fs.readFileSync(f),execFileSync('git',['show',baseline+':'+f],{maxBuffer:30e6}));
let preservedAssets=0;for(const line of execFileSync('git',['ls-tree','-r',baseline,'src/assets'],{encoding:'utf8',maxBuffer:5e6}).trim().split('\n')){const[m,p]=line.split('\t'),bytes=fs.readFileSync(p);assert.equal(createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex'),m.split(' ')[2],p);preservedAssets++;}
const report={baseline,book:'Luke',chapters:24,chapterOpeners,storyOpeners,storyPlacements:13,totalPlacements:33,inventory,consecutive,closePairs:consecutive.filter(p=>p.gap<5),minimumInternalGap:Math.min(...consecutive.filter(p=>p.a.key.startsWith('41:')&&p.b.key.startsWith('41:')).map(p=>p.gap)),boundaries:consecutive.filter(p=>p.a.key.split(':')[0]!==p.b.key.split(':')[0]),preservedAssets,allProductionMetadataUnchanged:true,nextBookArtworkReviewed:false};
fs.writeFileSync('research/notes/luke-artwork-inventory-2026-11-07.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({chapters:24,totalPlacements:33,preservedAssets,minimumInternalGap:report.minimumInternalGap,boundaries:report.boundaries.map(r=>r.gap),closePairs:report.closePairs.length}));
