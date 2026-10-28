import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {accepted,releaseContent} from './rc1-content.mjs';
import {debateVerdict} from '../worker/debates.mjs';
import {assess} from './check-readability.mjs';
import worker from './built-worker.mjs';
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const decisions=read('data/rc1-rulings.json');
const proposals=read('research/run7/label-proposals.json').records;
const group=proposals.filter(row=>row.group!=='remaining');
const eligible=group.filter(row=>row.proposed_label);
const held=proposals.filter(row=>!row.proposed_label);
assert.equal(group.length,66);assert.equal(eligible.length,47);assert.equal(held.length,19);
assert.equal(proposals.filter(row=>row.group==='remaining').length,1867);
assert.equal(decisions.evidenceStrength,'Not assigned');
assert.deepEqual(decisions.rulings,eligible.map(row=>({id:row.id,decisionId:row.group,label:row.proposed_label})));
// Pin eligibility to the exact owner decision defaults, independently of the remap.
const sheet=fs.readFileSync('research/b4/B1-decisions-before.md','utf8');
const defaults=sheet.split('\n').filter(line=>/^\| A\d\d \|/.test(line)).map(line=>line.split('|').map(cell=>cell.trim()));
assert.equal(defaults.length,66);
for(const row of group){const cells=defaults.find(cells=>cells[1]===row.group);assert(cells[2].startsWith('['+row.id+']'));assert.equal(cells[4].startsWith('HOLD'),!row.proposed_label,row.id);}
const originals=read('data/evidence.json'), production=JSON.parse(releaseContent('data/evidence.json'));
const native=(await import('../www/device-engine.js')).default;
const legacy=record=>record.mode==='commandments'?'Instruction in context':(['science','history'].includes(record.mode)?{Agrees:'Evidence matches the text',Disagrees:'Evidence points elsewhere',Context:'Not settled'}:{'Textual conflict':'Wording differs',Context:'Interpretation remains open'})[record.status]||record.status;
for(const row of proposals){
 const original=originals.find(record=>record.id===row.id);
 assert.equal(createHash('sha256').update(JSON.stringify(original)).digest('hex'),row.evidence_sha256);
 const approved=decisions.rulings.find(record=>record.id===row.id);
 assert.equal(debateVerdict(original),approved?.label||legacy(original),row.id);
 if(!accepted.evidence.some(record=>record.id===row.id))assert.deepEqual(production.find(record=>record.id===row.id),original);
}
for(const row of decisions.rulings){
 const result=assess(row.label);assert(!result.tooLong&&!result.unexplained,row.id);
 const source=production.find(record=>record.id===row.id);
 for(const engine of [worker,native]){
  const detail=await (await engine.fetch(new Request('https://rc1b.test/api/debate?id='+row.id),{},{})).json();
  assert.deepEqual(detail,{...source,verdict:row.label});
  const list=await (await engine.fetch(new Request('https://rc1b.test/api/debates?id='+row.id),{},{})).json();
  assert.equal(list.records[0].verdict,row.label);
 }
}
for(const row of held){assert(!decisions.rulings.some(accepted=>accepted.id===row.id));}
for(const id of ['history-jericho-destruction-date','history-darius-mede-succession','history-theudas-revolt-order'])assert.equal(debateVerdict(originals.find(row=>row.id===id)),'Not settled');
for(const file of ['src/debates.js','src/accepted-questions.js'])assert(fs.readFileSync(file,'utf8').includes('Evidence strength: Not assigned'));
assert.equal(read('www/release.json').draftOnly,undefined);
console.log('PASS: 47 exact Group A defaults in web/native detail and lists; 19 holds and 1867 remaining rulings excluded; originals/source hashes preserved; approved short labels and Not assigned strength.');
