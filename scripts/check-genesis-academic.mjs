import fs from 'node:fs';
import zlib from 'node:zlib';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import worker from './built-worker.mjs';

const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const records=read('research/notes/genesis-academic-additions-2026-10-17-records.json');
const evidence=read('data/evidence.json'),chapters=read('data/chapters.json');
const source=fs.readFileSync('src/reader.js','utf8');
const context={recordTags:record=>record.tags||[]};vm.createContext(context);
vm.runInContext(source.slice(source.indexOf('function visibleComparison('),source.indexOf('function verseBookmarkComparisons(')),context);
const request=async path=>{const response=await worker.fetch(new Request('https://scripture.test'+path),{},{});assert.equal(response.status,200);return response.json();};
const marked=await request('/api/marked-comparisons?book=0');
let quotes=0;
for(const record of records){
 assert.deepEqual(evidence.find(e=>e.id===record.id),record,record.id+' integration');
 for(const [,chapter,verse,quote]of record.text.matchAll(/KJV Genesis (\d+):(\d+): “([^”]+)”/g)){
  const data=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[`0:${chapter}`],'base64')));
  assert(data.verses.find(v=>v.n===Number(verse)).kjv.includes(quote),record.id+' exact KJV quotation');quotes++;
 }
 const primary=record.refs.find(ref=>ref.label===record.ref);
 const result=await request(`/api/comparisons?book=0&chapter=${primary.chapter}&mode=${record.mode}`);
 const item=result.items.find(item=>item.id===record.id&&item.verse===primary.verse);
 assert(item&&item.placementRole==='key',record.id+' key placement');
 assert.equal(item.status,record.status);assert(context.visibleComparison(item),record.id+' reader visibility');
 const saved=marked.records.find(item=>item.id===record.id);assert(saved&&context.visibleComparison(saved),record.id+' Marked visibility');
 if(record.mode==='history'){assert.equal(item.academicAssessment,true);assert.equal(item.status,'Context');}
 assert(record.scope&&record.reasoning&&record.sources.some(s=>!s.url.includes('eng-kjv')),record.id+' evidence and limits');
}
assert(quotes>=38);
const flood=records.find(record=>record.id==='genesis-7-worldwide-flood');
assert(flood.fields.length>=5,'Flood assessment needs independent scientific fields');
for(const field of flood.fields){assert(field.text&&field.sources.length);for(const source of field.sources)assert(flood.sources.some(s=>s.url===source.url));}
assert(flood.refs.some(ref=>ref.label==='Genesis 7:22'),'Preserve the land-breathing scope of the extinction claim');
assert(!evidence.some(record=>record.mode==='science'&&record.status==='Agrees'),'Owner removed the eight Science agreements');
assert(!context.visibleComparison({mode:'history',status:'Context'}),'Legacy History visibility must stay unchanged');
console.log(`PASS: ${records.length} Genesis Academic records, ${quotes} exact KJV quotations, reader/Marked visibility, preserved Context statuses and no Science agreements.`);
