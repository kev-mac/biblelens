import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code=fs.readFileSync('src/commandments.js','utf8');
const context={document:{querySelector:()=>null},esc:value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))};
vm.createContext(context);
vm.runInContext(code+'\nthis.samples=COMMANDMENT_SAMPLES;this.facets=COMMANDMENT_FACETS;',context);
const filter=(state,query='')=>context.filterCommandments(context.samples,state,query);
assert.equal(context.samples.length,3);
for(const item of context.samples){
 assert(Number.isInteger(item.id)&&item.id>=1&&item.id<=613);
 for(const key of ['title','passage','summary'])assert.equal(typeof item[key],'string');
 for(const key of ['polarity','sphere'])assert(context.facets[key].includes(item.taxonomy[key]));
 for(const key of ['applicability','topics'])assert(Array.isArray(item.taxonomy[key]));
 for(const link of item.lens){assert(['Fulfillment','Expansion','Apostolic Ruling'].includes(link.type));assert(link.reference&&link.description);}
}
assert.equal(filter({}).length,3);
assert.equal(filter({polarity:['Negative'],topics:['Business']})[0].id,144);
assert.equal(filter({polarity:['Negative'],sphere:['God']}).length,0);
assert.equal(filter({applicability:['Temple Era Only','Universal / Today']}).length,2);
assert.equal(filter({polarity:['Positive','Negative']}).length,3);
assert.equal(filter({},'  BUSINESS poor ')[0].id,144);
assert.equal(filter({},'Hebrews 10:11')[0].id,145);
assert.equal(filter({},'unmatched').length,0);
assert(!context.commandmentCard({...context.samples[0],lens:[]}).includes('commandment-lens'));
assert(!context.commandmentCard({...context.samples[0],lens:undefined}).includes('commandment-lens'));
const malicious={...context.samples[0],title:'<img src=x onerror=alert(1)>',passage:'" onclick="alert(1)'};
const html=context.commandmentCard(malicious);assert(!html.includes('<img'));assert(html.includes('&quot; onclick='));
const books=JSON.parse(fs.readFileSync('data/books.json','utf8'));
const chapters=JSON.parse(fs.readFileSync('data/chapters.json','utf8'));
const {expandCommandmentRef}=await import('./commandments.mjs');
for(const item of context.samples)for(const ref of [item.passage,...item.lens.map(link=>link.reference)])assert(expandCommandmentRef(ref,books,chapters).length);
// Empty candidate values are disabled independently of same-dimension OR choices.
assert(context.commandmentFacetDisabled(context.samples,{polarity:['Negative']},'', 'sphere','God'));
assert(!context.commandmentFacetDisabled(context.samples,{polarity:['Negative']},'', 'topics','Business'));
assert(context.commandmentFacetDisabled(context.samples,{topics:['Business']},'', 'polarity','Positive'));
assert(!context.commandmentFacetDisabled(context.samples,{polarity:['Negative']},'unmatched','polarity','Negative'));
assert(context.commandmentFacetDisabled(context.samples,{},'unmatched','polarity','Positive'));
assert.equal(context.commandmentFacetCount(context.samples,{polarity:['Negative'],topics:['Business']},'','polarity','Positive'),0);
const tagged=context.commandmentCard(context.samples[1]);
assert(!tagged.includes('taxonomy-dot'));assert(!tagged.includes('commandment-tag'));assert(!tagged.includes('commandment-metadata'));assert(!code.includes('--tag-rgb'));
console.log('PASS: sample taxonomy, AND/OR search, escaped cards, passage coordinates, uncluttered cards, zero-match disabling and removable selections.');
