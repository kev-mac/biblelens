import {inspectionSource} from './built-worker.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import worker from './built-worker.mjs';
const code=inspectionSource(),ctx={Response,Blob,DecompressionStream,Uint8Array,atob};
vm.createContext(ctx);vm.runInContext(code.slice(0,code.indexOf('async function chat('))+'this.terms=questionTerms;',ctx);
assert.deepEqual(Array.from(ctx.terms('shark')[0]),['shark'],'A real word must not turn into sharp or spark');
assert.deepEqual(Array.from(ctx.terms('salmon')[0]),['salmon'],'A modern noun must not be silently replaced');
const original=globalThis.fetch;let calls=0;
globalThis.fetch=async()=>{calls++;throw Error('Must stay offline');};
async function ask(message,history=[]){const response=await worker.fetch(new Request('https://scripture.test/api/chat',{method:'POST',body:JSON.stringify({message,history})}),{},{});assert.equal(response.status,200);return response.json();}
try{
 for(const question of ['can we eat shark','Can I eat salmon?','Is tuna kosher?','Can we eat shrimp?','Can I eat catfish?']){
  const result=await ask(question);assert.equal(result.mode,'dietary',question);assert.match(result.answer,/both fins and scales/);assert.match(result.answer,/Torah/);assert.match(result.answer,/Christians/);assert.equal(result.modelEligible,false);assert(result.sources.some(s=>s.url==='#read/2/11/9'));assert(result.sources.some(s=>s.url==='#read/4/14/10'));assert(!result.answer.includes('honey'));assert(result.details.includes('classification'));
 }
 const follow=await ask('can we eat it?',[{role:'user',content:'can we eat shark'}]);assert.equal(follow.mode,'dietary');
 const reference=await ask('Explain Proverbs 25:16',[{role:'user',content:'can we eat shark'}]);assert.match(reference.answer,/honey/);assert.notEqual(reference.mode,'dietary');
 const scoped=await ask('Can I eat shark in Leviticus?');assert(scoped.sources.every(s=>s.url.startsWith('#read/2/')));
 for(const question of ['Can we eat pizza?','Can we eat zqxvblorp?']){const result=await ask(question);assert.equal(result.mode,'missing');assert.equal(result.sources.length,0);}
 const dragon=await ask('Can we eat dragon?');assert(!dragon.answer.startsWith('Isaiah 51:8:'),'Nearby nouns do not make an unrelated quote answer a permission question');
 const typo=await ask('forgivness');assert(typo.sources.some(s=>s.url==='#read/18/130/4'),'Unambiguous typo correction still works');
 assert.equal(calls,0);
}finally{globalThis.fetch=original;}
console.log('PASS: modern food intent, contextual answers, dietary follow-ups, explicit reference priority, scope, real-word typo protection and unrelated-permission rejection.');
