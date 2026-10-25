import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';

// Exercise the actual shared worker: these calls also run in the native offline worker.
const originalFetch=globalThis.fetch;let externalCalls=0;
globalThis.fetch=async()=>{externalCalls++;throw Error('Workspace retrieval must stay inside the packaged corpus');};
async function search(q,edition='kjv'){
 const response=await worker.fetch(new Request('https://scripture.test/api/search?'+new URLSearchParams({q,edition})),{},{});
 assert.equal(response.status,200);return response.json();
}
async function ask(message,edition='kjv'){
 const response=await worker.fetch(new Request('https://scripture.test/api/chat',{method:'POST',body:JSON.stringify({message,edition})}),{},{});
 assert.equal(response.status,200);return response.json();
}
try{
 const empty=await search('   ');assert.deepEqual(empty.passages,[]);assert.deepEqual(empty.research,[]);
 const unknown=await search('zqxvblorp');assert.equal(unknown.passages.length+unknown.research.length,0);
 for(const query of ['How do Genesis 1 and Genesis 2 differ?','Compare Gen. 1 versus Gen. 2','Genesis 1 and 2','gen1 vs gen2']){
  const result=await ask(query);
  assert.equal(result.mode,'comparison',query);assert.equal(result.generation,'retrieval');assert.equal(result.modelEligible,false);
  assert.deepEqual(result.comparison.passages.map(p=>[p.book,p.chapter]),[[0,1],[0,2]],query);
  assert.match(result.answer,/vegetation before people|plants/i,query);
  assert(result.comparison.records.some(record=>record.alternativeReading&&record.scope),'Keep competing readings and limits with the authored claims');
  assert(result.comparison.records.some(record=>record.sides?.length&&record.text&&record.languageContext),'Keep stored quotation text and named witness context with the authored records');
  assert.equal(new Set(result.comparison.records.map(record=>record.id)).size,result.comparison.records.length,'One record must not repeat for each source');
  assert(!result.comparison.records.some(record=>record.ref?.startsWith('Genesis 5:')),'An unrelated genealogy must not substitute for a creation comparison');
 }
 const commandments=await ask('Compare Exodus 20 and Deuteronomy 5');
 assert.equal(commandments.mode,'comparison');assert.deepEqual(commandments.comparison.passages.map(p=>[p.book,p.chapter]),[[1,20],[4,5]]);
 const unsupported=await ask('Compare Obadiah 1:1 and Philemon 1:1');assert.equal(unsupported.mode,'comparison');assert.equal(unsupported.comparison.records.length,0);assert.match(unsupported.answer,/no assessment connecting/);
 const numbered=await ask('Compare 1 John 3:16 with John 3:16');assert.deepEqual(numbered.comparison.passages.map(p=>p.book),[61,42]);
 const repeated=await search('Gen. 1 and Gen. 2');assert(repeated.passages.some(p=>p.chapter===1));assert(repeated.passages.some(p=>p.chapter===2));assert(repeated.passages.length<=24);assert(repeated.research.length<=12);assert.equal(repeated.limited,true);
 const range=await search('Jn 3:16-18');assert.deepEqual(range.passages.map(p=>p.verse),[16,17,18]);
 const crossing=await search('John 3:35–4:2');assert.deepEqual(crossing.passages.map(p=>[p.chapter,p.verse]),[[3,35],[3,36],[4,1],[4,2]]);
 for(const query of ['Genesis 999','John 3:999','John 3:0','John 3:18-16'])assert.equal((await search(query)).passages.length,0,query);
 for(const edition of ['kjv','web','asv']){
  const result=await search('Jn 3:16',edition);assert.equal(result.edition,edition);assert.equal(result.passages.length,1);assert.equal(result.passages[0].edition,edition);assert.match(result.passages[0].kind,new RegExp(edition.toUpperCase()));
  const chapter=await (await worker.fetch(new Request('https://scripture.test/api/chapter?book=42&chapter=3'),{},{})).json();
  assert.equal(result.passages[0].text,chapter.verses.find(v=>v.n===16)[edition].replace(/\{[HG]\d+\}/g,'').replace(/\s+/g,' ').trim(),'Quote exactly the selected edition');
  const reply=await ask('Explain John 3:16',edition);assert.equal(reply.edition,edition);assert(reply.answer.includes(result.passages[0].text));
  const dietary=await ask('Can I eat shrimp?',edition);assert.equal(dietary.mode,'dietary');assert(dietary.evidence.every(source=>source.kind.endsWith(edition.toUpperCase())));
 }
 const missingVerse=await search('Acts 8:37','web');assert.equal(missingVerse.passages.length,0,'Never substitute KJV for an absent WEB verse');
 const webReply=await ask('Explain Acts 8:37','web');assert.equal(webReply.mode,'missing');assert.equal(webReply.sources.length,0);
 const topic=await search('forgiveness');assert(topic.passages.length>0);assert(topic.passages.every(p=>p.text&&p.label&&p.url.startsWith('#read/')));
 assert.equal((await worker.fetch(new Request('https://scripture.test/api/search?q=x',{method:'POST'}),{},{})).status,405);
 assert.equal((await worker.fetch(new Request('https://scripture.test/api/search?q='+'x'.repeat(2501)),{},{})).status,400);
 assert.equal(externalCalls,0);
}finally{globalThis.fetch=originalFetch;}
console.log('PASS: unified offline search, multi-passage comparisons, same-book/alias/range parsing, bounded results, source deduplication, alternative readings and exact selected-edition text.');
