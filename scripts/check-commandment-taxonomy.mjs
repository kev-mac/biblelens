import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {validateCommandmentsCatalog} from './commandments-catalog.mjs';
const catalog=JSON.parse(fs.readFileSync('data/commandments-catalog.json','utf8'));
assert.equal(validateCommandmentsCatalog(),613);
const code=fs.readFileSync('src/commandments.js','utf8');
const context={document:{querySelector:()=>null},esc:value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))};
vm.createContext(context);
vm.runInContext(code.replace('/*__COMMANDMENTS__*/[]',JSON.stringify(catalog.records))+'\nthis.records=COMMANDMENTS;this.facets=COMMANDMENT_FACETS;',context);
const filter=(state,query='')=>context.filterCommandments(context.records,state,query);
assert.equal(context.records.length,613);
assert.deepEqual(catalog.records.map(r=>r.id),Array.from({length:613},(_,i)=>i+1));
assert.deepEqual(catalog.records.map(r=>r.code),[...Array.from({length:248},(_,i)=>'P'+(i+1)),...Array.from({length:365},(_,i)=>'N'+(i+1))]);
assert.equal(filter({polarity:['Positive']}).length,248);assert.equal(filter({polarity:['Negative']}).length,365);
assert.equal(filter({polarity:['Positive','Negative']}).length,613);
assert.equal(filter({},'N365')[0].code,'N365');assert.equal(filter({},'Hebrews 10:11')[0].code,'P39');
assert(filter({polarity:['Negative'],topics:['Business']}).some(r=>r.code==='N235'));
assert.equal(filter({},'unmatched').length,0);
const {expandCommandmentRef}=await import('./commandments.mjs');
const books=JSON.parse(fs.readFileSync('data/books.json','utf8')),chapters=JSON.parse(fs.readFileSync('data/chapters.json','utf8'));
for(const item of context.records){
 for(const key of ['title','passage','summary'])assert.equal(typeof item[key],'string');
 for(const key of ['polarity','sphere'])assert(context.facets[key].includes(item.taxonomy[key]));
 for(const key of ['applicability','topics'])assert(item.taxonomy[key].every(v=>context.facets[key].includes(v)));
 for(const ref of [...item.references,...item.lens.map(link=>link.reference)])assert(expandCommandmentRef(ref,books,chapters).length,ref);
 for(const link of item.lens)assert(['Fulfillment','Expansion','Apostolic Ruling'].includes(link.type));
}
const item=context.records[0];assert(!context.commandmentCard({...item,lens:[]}).includes('commandment-lens'));
const malicious={...item,title:'<img src=x onerror=alert(1)>',passage:'" onclick="alert(1)'};
const html=context.commandmentCard(malicious);assert(!html.includes('<img'));assert(html.includes('&quot; onclick='));
assert(context.commandmentFacetDisabled(context.records,{},'unmatched','polarity','Positive'));
assert(!context.commandmentFacetDisabled(context.records,{polarity:['Negative']},'unmatched','polarity','Negative'));
for(const state of [{polarity:['Negative'],topics:['Business']},{polarity:['Positive'],sphere:['God']},{topics:['Food'],applicability:['Temple Era Only']},{polarity:['Positive','Negative'],topics:['Sabbath','Family']}]){
 const expected=catalog.records.filter(r=>Object.entries(state).every(([k,vs])=>vs.some(v=>[].concat(r.taxonomy[k]).includes(v))));
 assert.deepEqual(Array.from(filter(state),r=>r.code),expected.map(r=>r.code));
}
assert(!html.includes('commandment-tag'));assert(!code.includes('--tag-rgb'));
assert(code.includes('items.slice(0,visibleCount)'));assert(code.includes('visibleCount+=60'));
const built=await (await import('../dist/server/index.js')).default.fetch(new Request('https://test/commandments.js'),{},{});assert((await built.text()).includes('N365'),'The full catalog must reach the built web bundle');
console.log('PASS: all 613 unique commandment identities, 248/365 partitions, retained-source consistency, exact packaged KJV quotations, valid passage/lens routes, AND/OR facets, escaped cards and bounded incremental rendering.');
