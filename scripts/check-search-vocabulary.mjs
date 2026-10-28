import {inspectionSource} from './built-worker.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import worker from './built-worker.mjs';

const code=inspectionSource(),ctx={Response,Blob,DecompressionStream,Uint8Array,atob};
vm.createContext(ctx);vm.runInContext(code.slice(0,code.indexOf('async function chat('))+'this.vocabulary=VOCABULARY;this.terms=questionTerms;',ctx);
assert(ctx.vocabulary.infant.related.includes('babe'),'WordNet synonyms must reach the packaged vocabulary');
assert(ctx.vocabulary.eaten.forms.includes('eat'),'Irregular forms must be normalized by the build-time lemmatizer');
assert(!ctx.vocabulary.skunk?.related.includes('weeds'),'Do not merge slang senses into the first noun sense');
assert(Object.keys(ctx.vocabulary).length>10000);
assert(code.includes('class MiniSearch'));

const oldFetch=globalThis.fetch;let externalRequests=0;
globalThis.fetch=async()=>{externalRequests++;throw Error('Search must stay offline');};
async function ask(message,extra={}){
 const response=await worker.fetch(new Request('https://scripture.test/api/chat',{method:'POST',body:JSON.stringify({message,...extra})}),{},{});
 assert.equal(response.status,200);return response.json();
}
try{
 for(const question of ['interest','how much interest can i charge on a loan?','loan interest']){
  const answer=await ask(question);assert(answer.sources.some(s=>s.url==='#read/1/22/25'),question);
 }
 const infant=await ask('infant');assert(infant.sources.some(s=>s.url.startsWith('#read/')),'WordNet expansion must return scripture');
 const typo=await ask('forgivness');assert(typo.sources.some(s=>s.url==='#read/18/130/4'),'MiniSearch typo tolerance');
 const plague=await ask('What was the fourth plague in Exodus?');assert(plague.sources.some(s=>s.url.startsWith('#read/1/8/')),'Known topic routing must reach the public reply, not only source gathering');assert(plague.details.includes('flies'));
 for(const question of ['is eating skunk a sin?','Can I eat pork?']){
  const answer=await ask(question);assert(!answer.answer.startsWith('I found'));assert(answer.answer.includes('Leviticus')||answer.answer.includes('Deuteronomy'));
  assert(answer.sources.some(s=>s.url.startsWith('#read/2/11/')||s.url.startsWith('#read/4/14/')),question);
 }
 for(const question of ['zqxvblorp quantum banana reactor','Can I eat zqxvblorp?'])assert.equal((await ask(question)).sources.length,0,'Unknown words must not become a confident answer');
 const scoped=await ask('interest in Exodus');assert(scoped.sources.length);assert(scoped.sources.every(s=>s.url.startsWith('#read/1/')));
 const reference=await ask('Explain John 3:16');assert(reference.answer.includes('God so loved'));assert(reference.sources.some(s=>s.url==='#read/42/3/16'));
 const license=await worker.fetch(new Request('https://scripture.test/search-licenses.txt'),{},{});
 assert.equal(license.status,200);const notices=await license.text();assert(notices.includes('WordNet 3.1'));assert(notices.includes('MIT'));
 assert.equal(externalRequests,0);
}finally{globalThis.fetch=oldFetch;}
console.log('PASS: WordNet synonyms, irregular forms, MiniSearch typos, loan/dietary queries, unknown terms, book scope, explicit references, licenses and offline search.');
