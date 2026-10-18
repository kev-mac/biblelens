import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {loadTimelineCatalog,timelineCatalog} from './timeline-catalog.mjs';

const read = path => JSON.parse(fs.readFileSync(path,'utf8'));
const catalog = read('data/timeline-events.json');
const evidence = read('data/evidence.json');
const events = loadTimelineCatalog().events;
assert.equal(events.length,10);
assert.equal(events.filter(event => event.discrepancy).length,6);
for (const id of ['history-jericho-destruction-date','history-darius-mede-succession','history-theudas-revolt-order']) {
 const record = evidence.find(record => record.id === id);
 assert.equal(record.mode,'history');
 assert.equal(record.status,'Context', 'Conditional chronology must not become a definitive disproof');
 assert(events.some(event => event.evidence_id === id && event.discrepancy));
}
for (const id of ['joseph-famine','joseph-land','sennacherib','cyrus-return']) {
 assert.equal(events.find(event => event.id === id).discrepancy,null);
}
const bad = structuredClone(catalog);
bad.events[0].evidence_id = 'missing';
assert.throws(() => timelineCatalog(bad,evidence),/Missing timeline evidence/);
bad.events[0] = {...catalog.events[0],academic_consensus:''};
assert.throws(() => timelineCatalog(bad,evidence),/Invalid timeline discrepancy/);
bad.events[0] = {...catalog.events[0],additional_sources:[{label:'Unsafe',url:'javascript:alert(1)'}]};
assert.throws(() => timelineCatalog(bad,evidence),/Invalid timeline source/);
bad.events[0] = catalog.events[1];
assert.throws(() => timelineCatalog(bad,evidence),/Duplicate or missing timeline ID/);

const books = read('data/books.json');
const chapters = read('data/chapters.json');
const quotes = read('research/notes/timeline-audit-2026-10-18-quote-checks.json');
for (const {id,ref,quote} of quotes) {
 const [,name,ch,verse] = /^(.*?) (\d+):(\d+)$/.exec(ref);
 const book = books.find(book => book.name === name);
 const chapter = JSON.parse(gunzipSync(Buffer.from(chapters[`${book.id}:${ch}`],'base64')));
 assert.equal(chapter.verses.find(item => item.n === +verse).kjv,quote,ref);
 assert(evidence.find(record => record.id === id).text.includes(quote) || ref === 'Joshua 6:20');
}

// Check the actual Worker assets used by web and by build-mobile.mjs.
const worker = (await import('../dist/server/index.js')).default;
for (const [path,type,content] of [
 ['/reviewed-timeline.js','javascript','history-theudas-revolt-order'],
 ['/timeline.css','css','grid-template-rows:0fr'],
 ['/','html','id="timeline-view"']
]) {
 const response = await worker.fetch(new Request('https://scripture.test'+path),{},{});
 assert.equal(response.status,200,path);
 assert(response.headers.get('content-type').includes(type));
 assert((await response.text()).includes(content));
}
for (const [book,chapter,id] of [[5,6,'history-jericho-destruction-date'],[26,5,'history-darius-mede-succession'],[43,5,'history-theudas-revolt-order']]) {
 const response = await worker.fetch(new Request(`https://scripture.test/api/comparisons?book=${book}&chapter=${chapter}&mode=history`),{},{});
 assert((await response.json()).items.some(record => record.id === id),id);
}
console.log('PASS: 10 timeline cases, 6 qualified flags, 3 new history annotations, exact KJV quotations, unsafe-source rejection and packaged assets.');
