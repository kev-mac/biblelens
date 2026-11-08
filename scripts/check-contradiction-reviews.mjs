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
assert.deepEqual(reviewed.map(row=>row.id).sort(),[...originalIds,...addedIds].sort(),'Eight Exodus-scoped assessments; no complete book');
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
const inventory=JSON.parse(fs.readFileSync('research/notes/contradiction-integration-batch-395.json'));
assert.equal(inventory.exodus.assessments.length,88);
assert.equal(inventory.exodus.assessments.filter(row=>row.integration==='deferred').length,80);
assert.deepEqual(inventory.exodus.addedRecordIds.slice().sort(),addedIds.slice().sort());
assert.equal(inventory.genesis.addedRecordIds.length,0);
let count=0;
const grades=[];
for(const row of reviewed){
 const review=row.contradictionReview;
 assert.equal(review.book,'Exodus');assert.equal(review.checked,'2026-11-07');
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
for(const id of addedIds){
 const review=reviewed.find(row=>row.id===id);
 const rendered=ctx.contradictionReviewHtml(review);
 assert.equal((rendered.match(/data-cite-context="true"/g)||[]).length,review.contradictionReview.passages.length,id+' lost clickable passage links');
 for(const label of ['Conflict and Context','Context','Common Explanations','Assessment and Limits'])assert(rendered.includes(label),id+' lost '+label);
}
console.log(`PASS: eight scoped reviews, ${count} passage verses in all three packaged editions, original data preservation, escaped review text and clickable context ranges. Detail prose FK ${(grades.reduce((sum,value)=>sum+value,0)/grades.length).toFixed(2)}.`);
