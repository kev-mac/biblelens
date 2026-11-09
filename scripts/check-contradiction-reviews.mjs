import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {assess} from './check-readability.mjs';
const records=JSON.parse(fs.readFileSync('data/evidence.json'));
const books=JSON.parse(fs.readFileSync('data/books.json'));
const chapters=JSON.parse(fs.readFileSync('data/chapters.json'));
const reviewed=records.filter(row=>row.contradictionReview);
const originalIds=['exodus-hardening-agency','moses-father-in-law-names','angel-of-the-lord-speaks-as-god-identity-unstated','moses-feared-and-fled-from-pharaoh-or-forsook-egypt-not-fearing-the-king','i-am-not-eloquent-or-mighty-in-words-and-in-deeds-exodus-4-10-acts-7-22'];
const addedIds=['exodus-crops-surviving-hail','early-sabbath','deuteronomy-ark-builder'];
const batch397Ids=['exodus-manna-storage','exodus-impartial-judgment','exodus-curtain-layers','exodus-aaron-calf-account','exodus-voluntary-and-fixed-giving'];
const batch398Ids=["early-ark-count","cain-fugitive-and-vagabond-yet-builds-a-city","shem-a-hundred-years-old-two-years-after-the-flood","nations-after-their-tongues-before-babel","who-named-beersheba-abraham-or-isaac"];
const batch401=JSON.parse(fs.readFileSync('research/notes/contradiction-integration-batch-401.json'));
const batch401Ids=batch401.newItems.map(row=>row.id),batch401ById=new Map(batch401.newItems.map(row=>[row.id,row]));
assert.equal(batch401Ids.length,6);
assert.deepEqual(reviewed.map(row=>row.id).sort(),[...originalIds,...addedIds,...batch397Ids,...batch398Ids,...batch401Ids].sort(),'Twenty-four bounded assessments; no complete book');
function stable(value){
 if(Array.isArray(value))return value.map(stable);
 if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])]));
 return value;
}
const digest=value=>createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
// Immutable accepted build 394 baseline: retain all original data and reviews.
assert.equal(records.length,1933);
assert.equal(digest(records.map(({contradictionReview,...row})=>row)),'e606094ecd328dca081d630facc7f803bcc10e5c21c258735b1b3eaba164f6d1','Original evidence fields changed');
assert.equal(digest(reviewed.filter(row=>originalIds.includes(row.id)).map(row=>({id:row.id,review:row.contradictionReview}))),'a04e9a73512403f1694259347f14247bdb552b59ebe3a184bb5dfaeac9d408ba','Previously accepted reviews changed');
assert.equal(digest(reviewed.filter(row=>!batch397Ids.includes(row.id)&&!batch398Ids.includes(row.id)&&!batch401Ids.includes(row.id)).map(row=>({id:row.id,review:row.contradictionReview}))),'bd87e605c7e45c66daef0f1f24f683b3bf26232a842da6fcef6c04a0bd70699e','Previously accepted eight reviews changed');
assert.equal(digest(reviewed.filter(row=>!batch398Ids.includes(row.id)&&!batch401Ids.includes(row.id)).map(row=>({id:row.id,review:row.contradictionReview}))),"c13602e45403dd36042241e56c70508f26e67bce3e7d7bd7f18ca1319a00d8c4",'Previously accepted thirteen reviews changed');
assert.equal(digest(reviewed.filter(row=>!batch401Ids.includes(row.id)).map(row=>({id:row.id,review:row.contradictionReview}))),'c2f88e2ae60b537d9d23220e5a1c56a289b4a36efab6ff6aa1d41cf0bc92db75','Accepted build400 eighteen reviews changed');
const inventory=JSON.parse(fs.readFileSync('research/notes/contradiction-integration-batch-395.json'));
assert.equal(inventory.exodus.assessments.length,88);
assert.equal(inventory.exodus.assessments.filter(row=>row.integration==='deferred').length,80);
assert.deepEqual(inventory.exodus.addedRecordIds.slice().sort(),addedIds.slice().sort());
assert.equal(inventory.genesis.addedRecordIds.length,0);
const currentInventory=JSON.parse(fs.readFileSync('research/notes/contradiction-integration-batch-397.json'));
assert.equal(currentInventory.exodus.assessments.length,88);
assert.equal(currentInventory.exodus.assessments.filter(row=>row.integration==='deferred').length,75);
assert.deepEqual(currentInventory.exodus.addedRecordIds.slice().sort(),batch397Ids.slice().sort());
assert.equal(currentInventory.genesis.addedRecordIds.length,0);
const genesisInventory=JSON.parse(fs.readFileSync('research/notes/contradiction-integration-batch-398.json'));
assert.equal(genesisInventory.reviews.length,109);assert.equal(genesisInventory.reviews.filter(r=>r.integration==='deferred').length,104);assert.deepEqual(genesisInventory.addedRecordIds.slice().sort(),batch398Ids.slice().sort());
assert.equal(batch401.exodus.assessments.length,88);assert.equal(batch401.exodus.assessments.filter(row=>row.integration==='deferred').length,72);
assert.equal(batch401.genesis.reviews.length,109);assert.equal(batch401.genesis.reviews.filter(row=>row.integration==='deferred').length,101);
assert.equal(batch401.genesis.reviews.filter(row=>!row.currentRecordIds.length).length,72);
for(const id of batch401.crossBookMappedIds)assert(!batch401Ids.includes(id),'Cross-book shared groups remain deferred in this batch.');
for(const item of batch401.newItems){
 assert.equal(digest(records.find(row=>row.id===item.id).contradictionReview),item.reviewSemanticSha256,item.id+' differs from the bounded review inventory');
 const entries=item.book==='Genesis'?batch401.genesis.reviews:batch401.exodus.assessments;
 assert(entries.some(row=>row.sourceReviewId===item.sourceReviewId&&row.currentRecordIds.includes(item.id)&&row.integration==='added-bounded-English-text-assessment'),item.id+' lacks its existing source mapping');
}
let count=0;
const grades=[];
for(const row of reviewed){
 const review=row.contradictionReview;
 assert.equal(review.book,batch401ById.get(row.id)?.book||(batch398Ids.includes(row.id)?'Genesis':'Exodus'));assert.equal(review.checked,batch401Ids.includes(row.id)?'2026-11-09':(batch397Ids.includes(row.id)||batch398Ids.includes(row.id))?'2026-11-08':'2026-11-07');
 for(const key of ['conflict','context','assessment','verification','sourceReport'])assert(review[key]?.trim(),row.id+' missing '+key);
 assert(review.explanations.length>=2);
 for(const text of [review.conflict,review.context,review.assessment,review.verification,...review.explanations.flatMap(row=>[row.reading,row.support])]){
  const result=assess(text,{tier:'detail'});assert(!result.tooLong&&!result.unexplained,'Review prose exceeds sentence or jargon limits: '+text);grades.push(result.grade);
 }
 for(const ref of review.passages){
  const match=/^(.+) (\d+):(\d+)(?:-(\d+))?$/.exec(ref);assert(match,'Unsupported range '+ref);
  const book=books.find(b=>b.name===match[1]);assert(book,ref);
  const chapter=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[`${book.id}:${+match[2]}`],'base64')));
  for(let verse=+match[3];verse<=+(match[4]||match[3]);verse++){
   const text=chapter.verses.find(v=>v.n===verse);assert(text,ref);
   for(const edition of ['kjv','asv','web'])assert(text[edition]?.trim(),ref+' missing '+edition);
   count++;
  }
 }
}
assert(grades.reduce((sum,value)=>sum+value,0)/grades.length<=10,'Review prose exceeds grade 10');
const ctx={books,comparisonTone:()=>"contradictions",witnessLabel:()=>'',esc:value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),compactCitation:(p,label)=>label};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('src/reader-state.js','utf8').split('\n').find(line=>line.startsWith('function readRef(')),ctx);
for(const name of ['referenceLink','contradictionReviewHtml'])vm.runInContext(fs.readFileSync('src/reader.js','utf8').split('\n').find(line=>line.startsWith('function '+name+'(')),ctx);
const hardening=reviewed.find(row=>row.id==='exodus-hardening-agency');
const html=ctx.contradictionReviewHtml({...hardening,contradictionReview:{...hardening.contradictionReview,conflict:'<script>unsafe</script>'}});
assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));
assert(html.includes('data-cite-end="23"'));assert(html.includes('data-cite-context="true"'));assert(html.includes('aria-haspopup="dialog"'));
assert(html.includes('Common Explanations'));assert(html.includes('Assessment and Limits'));
for(const id of [...addedIds,...batch397Ids,...batch398Ids,...batch401Ids]){
 const review=reviewed.find(row=>row.id===id);
 const rendered=ctx.contradictionReviewHtml(review);
 assert.equal((rendered.match(/data-cite-context="true"/g)||[]).length,review.contradictionReview.passages.length,id+' lost clickable passage links');
 for(const label of ['Conflict and Context','Context','Common Explanations','Assessment and Limits'])assert(rendered.includes(label),id+' lost '+label);
}
assert.equal(reviewed.filter(row=>row.contradictionReview.book==='Exodus').length,16);assert.equal(reviewed.filter(row=>row.contradictionReview.book==='Genesis').length,8);
console.log(`PASS: twenty-four scoped reviews (16 Exodus, 8 Genesis), ${count} passage verses in all three packaged editions, original fields and all18 accepted reviews preserved, escaped prose and clickable context ranges. Detail prose FK ${(grades.reduce((sum,value)=>sum+value,0)/grades.length).toFixed(2)}.`);
