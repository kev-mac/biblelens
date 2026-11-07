import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import vm from 'node:vm';
import {assess} from './check-readability.mjs';
const records=JSON.parse(fs.readFileSync('data/evidence.json'));
const books=JSON.parse(fs.readFileSync('data/books.json'));
const chapters=JSON.parse(fs.readFileSync('data/chapters.json'));
const reviewed=records.filter(row=>row.contradictionReview);
assert.equal(reviewed.length,5,'This batch includes five Exodus assessments, not a complete book');
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
const html=ctx.contradictionReviewHtml({...reviewed[0],contradictionReview:{...reviewed[0].contradictionReview,conflict:'<script>unsafe</script>'}});
assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));
assert(html.includes('data-cite-end="23"'));assert(html.includes('data-cite-context="true"'));assert(html.includes('aria-haspopup="dialog"'));
assert(html.includes('Common Explanations'));assert(html.includes('Assessment and Limits'));
console.log(`PASS: five scoped reviews, ${count} passage verses in all three packaged editions, escaped review text and clickable context ranges.`);
