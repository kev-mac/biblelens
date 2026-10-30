import assert from 'node:assert/strict';
import fs from 'node:fs';
import {accepted,releaseContent,releaseReferences} from './rc1-content.mjs';
import {validateSides} from './verse-roles.mjs';
import {validateWitnesses} from './witness-labels.mjs';
import worker from './built-worker.mjs';
import {releaseInfo} from './release-info.mjs';
import {b2Catalog} from './b2-catalog.mjs';
import {loadDraftDebates} from './draft-debates.mjs';
import {debateVerdict} from '../worker/debates.mjs';
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
assert(read('package.json').buildNumber>=276,'RC1 production content remains supported in later builds');
for(const [key,count] of Object.entries({evidence:53,people:138,timeline:8,meaning:56,questions:30}))assert.equal(accepted[key].length,count,key);
assert.deepEqual(accepted.questions.map(row=>row.decisionId),Array.from({length:30},(_,i)=>'B'+String(i+1).padStart(2,'0')));
const proposals=b2Catalog().collections;
assert.deepEqual(accepted.evidence,proposals.evidence.filter(row=>row.provenance.source.startsWith('research/claude-drafts/')||row.provenance.source==='research/b2/academic-context.json').map(row=>row.record));
assert.deepEqual(accepted.people,proposals.people.filter(row=>row.provenance.source.startsWith('research/claude-drafts/')).map(row=>row.record));
assert.deepEqual(accepted.timeline,proposals.timeline.filter(row=>['research/claude-drafts/academic-cards-records.json','research/b2/academic-context.json'].includes(row.provenance.source)).map(row=>row.record));
assert.deepEqual(accepted.meaning,proposals.rewrites.filter(row=>['people','stories'].includes(row.targetCollection)));
const selected=loadDraftDebates().candidates.filter(row=>row.recommended);
assert.deepEqual(accepted.questions,selected.map(row=>({id:row.id,decisionId:row.reading_review.decisionId,question:row.question,comparison:row.comparison,readings:row.reading_review.readings,sources:row.reading_review.sources,limits:row.reading_review.limits,side_a:row.side_a.passages,side_b:row.side_b.passages,labels:[...new Set(row.source_record_ids.map(id=>debateVerdict(read('data/evidence.json').find(record=>record.id===id))))]})));
const evidence=JSON.parse(releaseContent('data/evidence.json')),people=JSON.parse(releaseContent('src/data/characters.json'));
validateSides(evidence,read('data/books.json'),read('data/chapters.json'));validateWitnesses(evidence,read('data/books.json'),read('data/chapters.json'));
for(const original of read('data/evidence.json'))if(!accepted.evidence.some(row=>row.id===original.id))assert.deepEqual(evidence.find(row=>row.id===original.id),original);
assert.equal(people.length,185);assert(!people.some(row=>row.id==='jesus-b6'));
const refs=releaseReferences(read('data/reference/people.json'),read('data/reference/relationships.json'));
for(const profile of accepted.people){assert.equal(profile.reference_binding.inherit_family_edges,false);for(const edge of refs.relationships.filter(edge=>edge.source_id===profile.reference_binding.reference_id))assert(profile.lineage_bindings.links.some(link=>JSON.parse(releaseContent('src/data/character-reference-ids.json'))[link.profile_id]===edge.target_id));}
const json=async path=>{const response=await worker.fetch(new Request('https://rc1.test'+path),{},{});assert.equal(response.status,200,path);return response.json();};
assert.deepEqual(await json('/accepted-questions.json'),accepted.questions);
for(const record of accepted.evidence)assert.equal((await json('/api/debate?id='+record.id)).scope,record.scope);
assert.deepEqual(await json('/characters.json'),people);
assert.deepEqual(read('www/reference/people.json'),await json('/reference/people.json'));
assert.deepEqual(read('www/reference/relationships.json'),refs.relationships);
for(const row of accepted.questions)assert.equal((await json('/api/debate?id='+row.id)).title,row.question);
assert.deepEqual(await json('/release.json'),releaseInfo());
assert.deepEqual(read('www/release.json'),releaseInfo());
assert.equal(Object.keys(await json('/offline-bible.json')).length,1189);
for(const file of ['draft-review.html','draft-review.json','teachings.html','teachings.json'])assert.equal((await worker.fetch(new Request('https://rc1.test/'+file),{},{})).status,404);
const manifest=read('dist/asset-manifest.json');const packed=read('dist/client'+manifest.parts.EVIDENCE);assert.deepEqual(packed,evidence);
// Test the independent packaged native engine, not only the shared build helper.
const native=(await import('../www/device-engine.js')).default;
for(const record of evidence){const request=new Request('https://rc1.test/api/debate?id='+encodeURIComponent(record.id));assert.deepEqual(await (await native.fetch(request,{},{})).json(),{...record,verdict:debateVerdict(record)});}
for(const path of ['/accepted-questions.json','/characters.json','/stories.json','/reference/relationships.json'])assert.deepEqual(read('www'+path),await json(path),path+' web/native parity');
for(const collection of ['evidence','people','timeline']){const production=collection==='evidence'?evidence:collection==='people'?people:JSON.parse(releaseContent('data/timeline-events.json')).events;const originals=collection==='evidence'?read('data/evidence.json'):collection==='people'?read('src/data/characters.json'):read('data/timeline-events.json').events;const allowed=new Set([...originals,...accepted[collection]].map(row=>row.id));assert(production.every(row=>allowed.has(row.id)),collection+' draft addition leaked');}
const questions=read('www/accepted-questions.json');assert.equal(questions.length,30);assert(questions.every(row=>row.readings.length===2&&row.readings.every(reading=>reading.summary)));
for(const file of ['www/device-engine.js','dist/client/accepted-questions.json']){const text=fs.readFileSync(file,'utf8');for(const marker of ['headline-31','jesus-b6','b6Evidence','tier-rubric'])assert(!text.includes(marker),file+': '+marker);}
assert.equal(read('www/release.json').draftOnly,undefined);
console.log('PASS: RC1 exact accepted counts, B01–B30, immutable originals, quotes/witnesses, explicit family bindings, packaged APIs, full offline corpus and production draft exclusion.');
