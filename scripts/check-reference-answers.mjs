import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import worker from '../dist/server/index.js';
const netsContext={parseRef:()=>({book:0}),BOOKS:[{name:'Genesis'}]};
vm.createContext(netsContext);vm.runInContext(fs.readFileSync('worker/nets-links.mjs','utf8'),netsContext);
const greekRecord={ref:'Genesis 1:1',witness:['Septuagint'],sources:[{label:'Brenton Greek evidence',url:'https://example.test/grcbrent'}],text:'Existing reviewed quotation'};
const readingSources=netsContext.comparisonReadingSources(greekRecord);
assert(readingSources[0].label.includes('NETS (English reading)'));
assert(readingSources[0].url.endsWith('/01-gen-nets.pdf'));
assert.equal(readingSources[1],greekRecord.sources[0],'Retain the actual source of existing quotation evidence');
assert.equal(greekRecord.text,'Existing reviewed quotation');
assert.equal(netsContext.comparisonReadingSources({ref:'Genesis 1:1',sources:[]}).length,0);

const source=fs.readFileSync('dist/server/index.js','utf8'),ctx={Response,Blob,DecompressionStream,Uint8Array,atob};
vm.createContext(ctx);vm.runInContext(source.slice(0,source.indexOf('async function chat('))+'this.confirms=confirmsParent;this.family=familyQuestion;this.intent=questionIntent;',ctx);
const noah={name:'Noah'},lamech={name:'Lamech'},ham={name:'Ham'};
assert(ctx.confirms('Lamech begat Noah.',lamech,noah));
assert(!ctx.confirms('Noah begat Ham.',ham,noah),'Do not reverse a parent-child direction');
assert(!ctx.confirms('Noah had sons. Ham is the father of Canaan.',ham,noah),'Co-mentions do not prove a relationship');
assert(ctx.confirms('Lamech lived an hundred years, and begat a son: And he called his name Noah.',lamech,noah));
assert.equal(ctx.family("who was noah’s dad?").type,'father');
assert.equal(ctx.family('who was his father?',"who was Noah's mother?").name,'noah');

const original=globalThis.fetch;let externalCalls=0;
globalThis.fetch=async()=>{externalCalls++;throw Error('Reference answers must remain offline');};
async function ask(message,extra={}){const response=await worker.fetch(new Request('https://scripture.test/api/chat',{method:'POST',body:JSON.stringify({message,...extra})}),{},{});assert.equal(response.status,200);return response.json();}
try{
 for(const message of ["who was noah's dad?","who was noah's father?",'who was the father of Noah?']){
  const result=await ask(message);assert(result.answer.includes('father was Lamech'));assert(result.answer.includes('Zelophehad'),'Preserve the second Noah identity');
  assert(result.sources.some(s=>s.url.startsWith('#read/0/5/')));assert(result.sources.some(s=>s.url.startsWith('https://github.com/robertrouse/')));assert(!result.answer.includes('father was Ham'));assert.equal(result.modelEligible,false);
 }
 const follow=await ask('who was his father?',{history:[{role:'user',content:"who was Noah's mother?"}]});assert(follow.answer.includes('father was Lamech'));
 const abraham=await ask("who was Abraham's father?");assert(abraham.answer.includes('Terah'));
 const children=await ask("who were Noah's children?");for(const name of ['Ham','Shem','Japheth'])assert(children.answer.includes(name));
 for(const message of ['Can I beat my wife?','May I hit my husband?','Can I beat my slaves?','Is it okay to hurt my children?','What about hitting my wife?']){
  const result=await ask(message);assert(result.answer.startsWith('No. Do not hit or abuse'));assert.equal(result.mode,'permission');assert.equal(result.modelEligible,false);assert(!result.answer.includes('Jael'));assert(!result.sources.some(s=>s.url.startsWith('#read/6/4/')));assert(result.sources.length);
 }
 for(const message of ["who was Noah's mother?",'who was the father of zqxvblorp?',"who was Noah's wife?"]){const result=await ask(message);assert.equal(result.mode,'clarification');assert.equal(result.modelEligible,false);}
 for(const path of ['/reference/people.json','/reference/topics.json','/reference/notices.json','/reference/provenance.json'])assert.equal((await worker.fetch(new Request('https://scripture.test'+path),{},{})).status,200);
 assert.equal(externalCalls,0);
}finally{globalThis.fetch=original;}
console.log('PASS: cited family answers, informal terms, relationship direction, duplicate identities, follow-ups, violence intent, missing evidence and offline reference resources.');
