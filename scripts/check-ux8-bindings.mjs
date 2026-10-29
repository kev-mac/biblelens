import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {gunzipSync} from 'node:zlib';
import worker,{inspectionSource} from './built-worker.mjs';
const out=process.env.HOME+'/git/codex-reports/UX8-logs';fs.mkdirSync(out,{recursive:true});
const source=inspectionSource(),ctx={Response,Blob,DecompressionStream,Uint8Array,atob};vm.createContext(ctx);
vm.runInContext(source.slice(0,source.indexOf('const markedBookCache='))+';this.records=EVIDENCE;this.studies=STUDIES;this.expand=referenceVerses;',ctx);
const books=JSON.parse(fs.readFileSync('data/books.json')),chapters=JSON.parse(fs.readFileSync('data/chapters.json'));
// Independent full-reference parser; never use the application's placement helper.
function refs(record){return [...new Set([record.ref,...(record.refs||[]).map(r=>typeof r==='string'?r:r.label),...(record.sides||[]).map(r=>r.ref),...(record.appliesTo||[])].filter(Boolean))];}
function expand(label){const m=/^(.+?) (\d+):(\d+)(?:\s*[-–—]\s*(\d+))?$/.exec(label);assert(m,'Unparsed citation: '+label);const book=books.find(b=>b.name===m[1]);assert(book,label);return Array.from({length:Number(m[4]||m[3])-Number(m[3])+1},(_,i)=>`${book.id}:${+m[2]}:${+m[3]+i}`);}
const records=[...ctx.records,...ctx.studies.filter(r=>r.type!=='Historical / chronological').map(r=>({...r,id:'study-'+r.id,mode:'contradictions'}))];
const expected=new Map(records.map(r=>[r.id,new Set(refs(r).flatMap(expand))])),actual=new Map(),covered=new Set(),mismatches=[];
for(const book of books)for(let ch=1;ch<=book.chapters;ch++)for(const mode of ['history','science','contradictions','questions','commandments']){
 const response=await worker.fetch(new Request(`https://local.test/api/comparisons?book=${book.id}&chapter=${ch}&mode=${mode}`),{},{});assert.equal(response.status,200);for(const r of (await response.json()).items){const key=`${book.id}:${ch}:${r.verse}`;if(!actual.has(r.id))actual.set(r.id,new Set());actual.get(r.id).add(key);covered.add(key);}
}
for(const r of records){const wanted=expected.get(r.id),got=actual.get(r.id)||new Set();const missing=[...wanted].filter(k=>!got.has(k)),extra=[...got].filter(k=>!wanted.has(k));if(missing.length||extra.length)mismatches.push({id:r.id,refs:refs(r),missing,extra});}
const total=Object.values(chapters).reduce((n,c)=>n+JSON.parse(gunzipSync(Buffer.from(c,'base64'))).verses.length,0);
const genesis=records.filter(r=>expected.get(r.id).has('0:1:1')).map(r=>({id:r.id,refs:refs(r)}));
const plants=ctx.records.find(r=>r.id==='legacy-science-1');assert(refs(plants).includes('Genesis 1:3'));
assert.equal(ctx.expand('Genesis 1:11–19').length,9);assert.equal(ctx.expand('Genesis 1:11–19').some(r=>r.verse===3),false);
const proseExample=ctx.records.filter(r=>/Genesis 1:1(?:[^0-9]|$)/.test(JSON.stringify(r)));
const headlines=await (await worker.fetch(new Request('https://local.test/accepted-questions.json'),{},{})).json();
const collectionOnly=[...ctx.studies.filter(r=>r.type==='Historical / chronological').map(r=>({id:'study-'+r.id,refs:r.refs,policy:'Historical starter omitted from the reader comparison index by the existing source rule.'})),...headlines.map(r=>({id:r.id,refs:[...new Set([...r.side_a,...r.side_b].map(side=>side.ref))],policy:'Question headline presentation; passage links, without a reader placement in the current data model.'}))];
for(const row of collectionOnly){assert(!actual.has(row.id));assert(!row.refs.some(ref=>expand(ref).includes('0:1:1')));}
const report={totalRecordsReviewed:records.length+collectionOnly.length,collectionOnlyRecords:collectionOnly,genesisProseExamples:proseExample.map(r=>({id:r.id,ref:r.ref,scope:r.scope,reason:'Word-use example in prose; author explicitly scopes the comparison to Psalms 8:5. No Genesis placement is declared.'})),recordsChecked:records.length,evidenceRecords:ctx.records.length,starterRecords:records.length-ctx.records.length,totalVerses:total,linkedVerses:covered.size,zeroRecordVerses:total-covered.size,genesis1_1:genesis,mismatches,plants:{refs:refs(plants),reason:'Genesis 1:3 is explicitly cited supporting context about light, not a 1:11-only record.'},ranges:records.flatMap(r=>refs(r).filter(s=>/\d[-–—]\d/.test(s)).map(ref=>({id:r.id,ref}))),records:records.map(r=>({id:r.id,refs:refs(r),attached:[...actual.get(r.id)||[]]}))};
fs.writeFileSync(out+'/binding-audit.json',JSON.stringify(report,null,2)+'\n');
assert.deepEqual(mismatches,[]);assert.deepEqual(genesis,[]);console.log(JSON.stringify({...report,records:undefined},null,2));
