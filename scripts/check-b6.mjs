import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {assess} from './check-readability.mjs';
import {b2Catalog} from './b2-catalog.mjs';
import {b6Catalog,sentenceCase} from './b6-drafts.mjs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),hash=x=>createHash('sha256').update(x).digest('hex');
// Tier and title negative controls are independent examples, not production rewrites.
const sentence='The people in this account walk through the town with their friends and then return to their homes late that same evening.';
assert(assess(sentence,{tier:'visible'}).tooLong);assert(!assess(sentence,{tier:'detail'}).tooLong);
assert(assess('One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twentyone twentytwo twentythree twentyfour twentyfive twentysix twentyseven twentyeight twentynine thirty thirtyone.',{tier:'detail'}).tooLong);
assert(assess('One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen.',{blurb:true}).tooLong);
assert.equal(sentenceCase('Gentleness Or Correction'),'Gentleness or correction');
assert.equal(sentenceCase('David And Goliath'),'David and Goliath');
const accepted=read('data/evidence.json'),overlay=read('research/b6/evidence.json');
assert.equal(overlay.sourceHash,hash(fs.readFileSync('data/evidence.json')));assert.equal(overlay.records.length,accepted.length);
let fields=0;
for(const [i,row]of overlay.records.entries()){
 const source=accepted[i];assert.equal(row.id,source.id);assert.equal(row.reviewStatus,'draft, unverified');assert.deepEqual(row.sources,source.sources||[]);
 for(const [field,original]of Object.entries(row.original)){
  assert.equal(original,source[field]);const proposed=row.draft[field],tier=['title','summary'].includes(field)?'visible':'detail';
  if(proposed===original)continue;fields++;const result=assess(original,{tier});assert(result.tooLong||result.unexplained,'Passing field changed '+row.id+':'+field);
  assert.deepEqual(proposed.match(/“[^”]*”|"[^"\n]*"|\d+/g)||[],original.match(/“[^”]*”|"[^"\n]*"|\d+/g)||[],row.id+': protected text');
  if(row.meaningHolds?.[field])assert.fail('Meaning hold rewritten '+row.id);
 }
}
const paired=read('research/b6/comparison-readings.json').records;assert.equal(paired.length,1693);assert.equal(new Set(paired.map(r=>r.id)).size,1693);
for(const row of paired){const source=accepted.find(r=>r.id===row.id);assert.equal(row.sourceHash,hash(JSON.stringify(source)));assert.deepEqual(row.sources,source.sources||[]);assert.equal(row.readings.length,2);for(const r of row.readings){if(r.summary){assert(source[r.sourceField]?.includes(r.summary),'Unsupported reading '+row.id);assert(row.sources.length);assert(!assess(r.summary,{tier:'detail'}).tooLong,row.id);}else assert.equal(r.status,'needs research');}}
const payload=b6Catalog(b2Catalog());
const titles=[];
for(const [collection,rows]of Object.entries(payload.collections))for(const row of rows)for(const key of ['title','display_title'])if(row.record[key])titles.push({collection,id:row.id,title:row.record[key]});
for(const row of titles)assert.equal(row.title,sentenceCase(row.title),`Draft title must use sentence case: ${row.collection}/${row.id}: ${row.title}`);
assert.equal(payload.collections.teachings.length,21);const forms=new Set(['teaching','law','ritual instructions','symbolic instructions','family list','work list']);
for(const row of payload.collections.teachings){assert(forms.has(row.record.form));assert.equal(row.reviewStatus,'draft');assert(row.record.sources.length);assert(!assess(row.record.summary).tooLong);assert(!assess(row.record.context,{tier:'detail'}).tooLong);}
const jesus=read('research/b6/jesus.json');assert.equal(jesus.ownerAccepted,false);assert.equal(jesus.reviewStatus,'draft');assert(jesus.sources.length);
for(const file of ['data/evidence.json','data/stories.json','src/data/characters.json','data/timeline-events.json','src/data/prophecies.json','data/chapters.json'])assert.equal(fs.readFileSync(file,'utf8'),execFileSync('git',['show','codex/b4:'+file],{encoding:'utf8',maxBuffer:64*1024*1024}),file+' accepted content changed');
assert.equal(read('package.json').buildNumber,276);
console.log(`PASS: B6 tier negative controls, ${fields} failing-field proposals, 1693 source-bound reading pairs, sentence-case draft titles, 21 teaching drafts, unpublished Jesus and accepted-source preservation.`);
