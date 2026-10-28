import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {validateRelatedPassages} from './study-relationships.mjs';
import worker from './built-worker.mjs';
const records=JSON.parse(fs.readFileSync('data/evidence.json','utf8'));
const chapters=JSON.parse(fs.readFileSync('data/chapters.json','utf8'));
validateRelatedPassages(records,chapters);
const linked=records.filter(r=>r.relatedPassages);
const expected={'genesis-wife-sister':['12:13','20:2','26:7'],'genesis-beersheba-naming':['21:31','26:33'],'genesis-bethel-naming':['28:19','35:15']};
for(const [group,refs]of Object.entries(expected)){
 const entries=linked.filter(r=>r.relatedPassages[0].group===group);
 assert.equal(entries.length,group==='genesis-beersheba-naming'?1:refs.length);
 for(const record of entries){
  assert.deepEqual(record.relatedPassages.map(r=>`${r.chapter}:${r.verse}`),refs);
  for(const ref of record.refs){
   const response=await worker.fetch(new Request(`https://test/api/comparisons?book=0&chapter=${ref.chapter}&mode=${record.mode}`),{},{});
   const item=(await response.json()).items.find(r=>r.id===record.id);
   assert.deepEqual(item.relatedPassages,record.relatedPassages);
  }
 }
}
const marked=await worker.fetch(new Request('https://test/api/marked-comparisons?book=0'),{},{});
const saved=await marked.json();
for(const record of linked)assert.deepEqual(saved.records.find(r=>r.id===record.id).relatedPassages,record.relatedPassages);
const app=fs.readFileSync('src/reader.js','utf8'),context={referenceLink:r=>`<a href="#read/${r.book}/${r.chapter}/${r.verse}">${r.label}</a>`};
vm.createContext(context);vm.runInContext(app.slice(app.indexOf('function relatedStudyPassages('),app.indexOf('function scienceDetails(')),context);
assert.equal(context.relatedStudyPassages({}),'');
for(const record of linked)for(const ref of record.relatedPassages)assert(context.relatedStudyPassages(record).includes(`#read/0/${ref.chapter}/${ref.verse}`));
const invalid=structuredClone(linked[0]);invalid.relatedPassages[0].verse=999;
assert.throws(()=>validateRelatedPassages([invalid],chapters),/outside chapter/);
console.log('PASS: Genesis doublet groups, comparison/Marked API metadata, related-passage rendering and invalid-reference rejection.');
