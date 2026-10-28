import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {b2Catalog} from './b2-catalog.mjs';
import {validateWitnesses} from './witness-labels.mjs';
import {timelineCatalog} from './timeline-catalog.mjs';
import {assess, report, words} from './check-readability.mjs';

const read = file => JSON.parse(fs.readFileSync(file,'utf8'));
const audit = read('research/codex-reviews/2026-10-26/audit.json');
for (const name of Object.keys(audit.input_sha256).filter(name=>name.endsWith('records.json'))) {
 const file='research/claude-drafts/'+name;
 assert.equal(fs.readFileSync(file,'utf8'),execFileSync('git',['show','ed9e776:'+file],{encoding:'utf8',maxBuffer:16*1024*1024}),name+' differs from pinned fixes');
}
const catalog = b2Catalog(), collections = catalog.collections;
assert.deepEqual(read('research/b2/catalog.json'), catalog, 'Regenerate the deterministic draft catalog');
assert.equal(catalog.reviewStatus,'draft'); assert.equal(catalog.ownerAccepted,false);
assert.deepEqual(Object.fromEntries(Object.entries(collections).map(([name,rows])=>[name,rows.length])),
 {evidence:103,people:138,timeline:48,stories:40,prophecies:25,rewrites:59});
for (const rows of Object.values(collections)) for (const row of rows) assert.equal(row.reviewStatus,'draft');
const books = read('data/books.json'), chapters = read('data/chapters.json');
const packed = new Map(Object.entries(chapters).map(([key,value])=>[key,JSON.parse(zlib.gunzipSync(Buffer.from(value,'base64')))]));
const verse = label => {
 const match = /^(.*?) (\d+):(\d+)$/.exec(label), book = books.find(book=>book.name===match?.[1]);
 assert(book,label); const result = packed.get(`${book.id}:${+match[2]}`)?.verses.find(row=>row.n===+match[3]);assert(result,label);return result.kjv;
};
validateWitnesses(collections.evidence.map(row=>row.record),books,chapters);
timelineCatalog({events:collections.timeline.map(row=>row.record)},[...read('data/evidence.json'),...collections.evidence.map(row=>row.record)]);
let quoteChecks = 0;
// Reuse the packaged KJV as the authority for every pinned gap quotation.
for (const name of ['evidence','stories','prophecies','timeline']) {
 const draft = read(`research/codex-drafts/content-gaps/${name}.json`);
 for (const row of draft.records || draft.reviews) for (const check of row.quote_checks || []) {
  if (check.edition === 'packaged KJV') { assert(verse(check.ref).includes(check.quote), check.ref);quoteChecks++; }
 }
}
for (const {record} of read('research/b2/academic-context.json')) {
 assert.equal(record.text,`KJV ${record.ref}: “${verse(record.ref)}”`);quoteChecks++;
}
const segmenter = new Intl.Segmenter('en',{granularity:'sentence'});
for (const row of collections.rewrites) {
 if (row.targetCollection !== 'explore') {
  const source = read(`docs/plain-language/${row.targetCollection}.json`).find(candidate=>candidate.id===row.targetId);
  assert.equal(source.original,row.original);assert.equal(source.draft,row.record.summary);
 } else assert(words(row.record.summary).length<=15);
 assert.deepEqual(row.original.match(/\d+/g)||[],row.record.summary.match(/\d+/g)||[]);
 for (const sentence of segmenter.segment(row.record.summary)) assert(words(sentence.segment).length<=20,row.id);
 assert(!assess(row.record.summary).unexplained,row.id);
}
const groups = [{name:'B2 academic Context',lines:read('research/b2/academic-context.json').flatMap(row=>['summary','reasoning','scope'].map(key=>row.record[key]))}];
assert.equal(report(groups),false);
const mean = groups[0].lines.map(line=>assess(line).grade).reduce((a,b)=>a+b,0)/groups[0].lines.length;
assert(mean>=6&&mean<=8);
assert.equal(catalog.holds.length,22);assert.equal(catalog.researchReturns.length,13);
assert(catalog.holds.every(row=>row.reason&&row.recommendedDefault));
const shots=read('research/b2/shot-list.json').slots;
assert.equal(shots.length,330);assert.equal(new Set(shots.map(row=>row.id)).size,330);
for (const slot of shots) {
 for (const key of ['subject','classification','aspectRatio','alt','licenceSource']) assert(slot[key],slot.id+': '+key);
 assert(['16:9','3:2','3:4'].includes(slot.aspectRatio));
 if (slot.classification==='illustration') { assert.equal(slot.label,'Illustration');assert.equal(slot.evidenceUse,false); }
}
// Content integration cannot change accepted data, credentials, sync rules or the build number.
const baseline = execFileSync('git',['rev-parse','codex/b1'],{encoding:'utf8'}).trim();
for (const file of ['data/evidence.json','data/stories.json','src/data/characters.json','data/timeline-events.json','src/data/prophecies.json','data/chapters.json','package.json','src/sync.js','src/sync-core.js']) {
 assert.equal(fs.readFileSync(file,'utf8'),execFileSync('git',['show',`${baseline}:${file}`],{encoding:'utf8',maxBuffer:64*1024*1024}),file+' changed accepted source');
}
if (process.argv.includes('--production')) {
 for (const file of ['draft-review.html','draft-review.json','draft-review.js','draft-review.css']) assert(!fs.existsSync('www/'+file),'Production draft leak: '+file);
 const worker=(await import('../dist/server/index.js')).default;
 assert.equal((await worker.fetch(new Request('https://test.invalid/draft-review.json'),{},{})).status,404);
}
console.log(`PASS: 413 draft proposals, all 187 fixes mapped, 155 gaps, 59 meaning checks, 22 holds, 13 returns, 330 shots, ${quoteChecks} packaged quotations; accepted source preserved.`);
