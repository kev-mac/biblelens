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
context.readRef=reference=>{const match=/^(.+) (\d+):(\d+)/.exec(reference),book=books.findIndex(book=>book.name===match?.[1]);return book<0?null:{book,chapter:Number(match[2]),verse:Number(match[3])};};
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
const built=await (await import('./built-worker.mjs')).default.fetch(new Request('https://test/commandments.js'),{},{});assert((await built.text()).includes('N365'),'The full catalog must reach the built web bundle');
console.log('PASS: all 613 unique commandment identities, 248/365 partitions, retained-source consistency, exact packaged KJV quotations, valid passage/lens routes, AND/OR facets, escaped cards and bounded incremental rendering.');

const noLens=context.commandmentCard({...item,lens:[]});
assert(noLens.includes('id="commandment-'+item.id+'-context" aria-labelledby="commandment-'+item.id+'-context-toggle" hidden'));
assert(!noLens.includes('NT lens'));assert(!noLens.includes('>Verses<'));
assert(noLens.includes('href="#read/1/20/2"'));assert(noLens.includes('<q>'));
assert.equal(context.commandmentDirective('To know that the Lord God exists'),'Know that the Lord God exists');
assert.equal(context.commandmentDirective('Do not steal'),'Do not steal');
const withLens=context.commandmentCard(context.records.find(record=>record.lens.length));
assert(withLens.includes('commandment-lens'));assert(withLens.includes('Hebrews 10:11'));
for(const record of context.records){const html=context.commandmentCard(record);assert(html.includes('-context-toggle'));assert(!html.includes('>Verses<'));assert(!html.includes('<h2>To '));assert.equal(html.includes('>NT lens<'),record.lens.length>0);}
const rows=Array.from({length:10},(_,i)=>({n:i+1,kjv:'Verse '+(i+1)}));
assert.deepEqual(Array.from(context.commandmentContextVerses(rows,1),row=>row.n),[1,2,3]);
assert.deepEqual(Array.from(context.commandmentContextVerses(rows,5),row=>row.n),[3,4,5,6,7]);
assert.deepEqual(Array.from(context.commandmentContextVerses(rows,10),row=>row.n),[8,9,10]);
let fetches=0;context.fetch=async()=>{fetches++;return {ok:true,json:async()=>({verses:rows})};};
const panel=()=>({dataset:{},isConnected:true,innerHTML:'',setAttribute(){}}),first=panel(),second=panel();
await context.loadCommandmentContext(first,'Genesis 1:5');await context.loadCommandmentContext(second,'Genesis 1:6');
assert.equal(fetches,1);assert(first.innerHTML.includes('Verse 3'));assert(!first.innerHTML.includes('Verse 2'));assert(first.innerHTML.includes('Verse 7'));assert(first.innerHTML.includes('Read the full chapter'));assert.equal(first.dataset.loaded,'true');
const failed=panel();context.fetch=async()=>({ok:false});await context.loadCommandmentContext(failed,'Exodus 1:1');assert(failed.innerHTML.includes('data-commandment-context-retry'));
context.fetch=async()=>({ok:true,json:async()=>({verses:rows})});await context.loadCommandmentContext(failed,'Exodus 1:1');assert.equal(failed.dataset.loaded,'true');
console.log('PASS: all 613 directive cards have inline verse links, conditional NT lenses and scripture-only context with bounded verses, caching and retry.');
