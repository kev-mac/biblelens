import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {mergeWitnessLabels,validateWitnesses,WITNESSES} from './witness-labels.mjs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),records=read('data/evidence.json'),books=read('data/books.json'),chapters=read('data/chapters.json'),labels=read('research/witness-labels.json');
validateWitnesses(records,books,chapters);
const first=records.find(r=>r.tags?.includes('T')),legacy={...first,tags:['H','G','V','Q']};delete legacy.witness;
const pending={id:'future-fixture',witness:'Greek New Testament'},updates=[{id:first.id,witness:'Hebrew and Septuagint'},pending];
const before=JSON.stringify(legacy),result=mergeWitnessLabels([legacy],updates,books,chapters);
assert.deepEqual(result.records[0].tags,['T','V','Q']);assert.equal(result.records[0].summary,legacy.summary);assert.equal(JSON.stringify(legacy),before);assert.deepEqual(result.pending,[pending]);
assert.deepEqual(mergeWitnessLabels(result.records,updates,books,chapters).records,result.records);
assert.equal(mergeWitnessLabels([...result.records,{...first,id:pending.id}],updates,books,chapters).pending.length,0);
assert.throws(()=>mergeWitnessLabels([legacy],[updates[0],updates[0]],books,chapters),/duplicate/);
assert.throws(()=>mergeWitnessLabels([legacy],[{id:first.id,witness:'Greek'}],books,chapters),/invalid witness/);
assert.throws(()=>validateWitnesses([{...first,witness:undefined}],books,chapters),/requires/);
const applied=mergeWitnessLabels(records,labels,books,chapters);assert.deepEqual(applied.records,records);assert.deepEqual(applied.pending,read('research/notes/witness-labels-pending.json'));
// Exercise metadata through the production compact-citation and Chat-source renderers.
const source=fs.readFileSync('src/reader.js','utf8'),c={books,reading:{name:'Genesis'},readingBook:0,readingChapter:1,esc:String,$:()=>({value:'kjv'}),readRef:()=>({book:0,chapter:1,verse:1})};vm.createContext(c);
vm.runInContext(source.slice(source.indexOf('const comparisonCache='),source.indexOf('function scienceDetails')),c);
vm.runInContext(source.slice(source.indexOf('function sourceHtml'),source.indexOf('function chatSummary')),c);
for(const witness of WITNESSES){const r={...first,witness,tag:'T'};const chip=c.referenceLink('Genesis 1:1',undefined,r);assert(chip.includes(`data-cite-witness="${witness}"`));assert(chip.includes('data-icon="languages"'));const html=c.sourceHtml({url:'https://example.com',kind:'Editorial',label:'Source',witness,summary:first.summary});assert(html.includes(witness+': '+first.summary));assert.equal(c.summaryText(r),witness+': '+first.summary);}
console.log(`PASS: ${records.filter(r=>(r.tags||[r.tag]).includes('T')).length} T records; ${applied.pending.length} retained future labels; duplicate/invalid rejection; idempotent merge; single toggle; witness display metadata.`);
