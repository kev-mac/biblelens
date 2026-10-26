import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
import {titleCase} from '../src/title-case.js';
assert.equal(titleCase('Joseph’s land acquisition'),'Joseph’s Land Acquisition');
assert.equal(titleCase('The fall of Jericho'),'The Fall of Jericho');
assert.equal(titleCase('Sennacherib’s campaign in Judah'),'Sennacherib’s Campaign in Judah');
assert.equal(titleCase('Cyrus and the return: the decree of 538 BCE'),'Cyrus and the Return: The Decree of 538 BCE');
assert.equal(titleCase('“the pre-exilic period”'),'“The Pre-Exilic Period”');
const bundle = await build({entryPoints:['src/timeline-core.js'],bundle:true,write:false,platform:'node',format:'esm'});
const {mergeAcademicDiscrepancies,academicDiscrepancies,renderTimelineCard,formatTimelineDate} = await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
assert.equal(Object.keys(academicDiscrepancies).length,6);
const raw = JSON.parse(fs.readFileSync('data/reference/events.json'));
const original = JSON.stringify(raw);
const merged = mergeAcademicDiscrepancies(raw);
assert.equal(JSON.stringify(raw),original,'Upstream input remains unchanged');
assert.equal(merged.length,450);
for(const title of ['The Great Flood','Tower of Babel','Lifetime of Abraham','Exodus from Egypt','War with Canaanites'])assert(merged.find(e=>e.fields.title===title)?.has_academic_conflict,title);
const fixtures = [
 {name:'The Exodus'}, {fields:{title:'Fall of Jericho'}}, {title:'Conquest-of-Canaan'}, {id:'the_flood',title:'Another label'},
 {fields:{title:'THE TOWER OF BABEL!'}}, {id:'recjkmUO88wihv8Ci',fields:{title:'Changed title'}},
 {title:'Jesus enters Jericho'}, {title:'Crossing the Jordan during flood season'}, {title:'Noah gets drunk and Canaan is cursed'}, {title:'The Exodus commentary published'}
];
const results = mergeAcademicDiscrepancies(fixtures);
assert.deepEqual(results.map(e=>e.has_academic_conflict),[true,true,true,true,true,true,false,false,false,false]);
assert.deepEqual(mergeAcademicDiscrepancies(merged),merged,'Merging is idempotent');
assert.deepEqual(mergeAcademicDiscrepancies([]),[]);
assert.throws(()=>mergeAcademicDiscrepancies({}),TypeError);
assert.equal(formatTimelineDate('-1490'),'1491 BCE');
assert.equal(formatTimelineDate('0'),'1 BCE');
assert.equal(formatTimelineDate('-2347'),'2348 BCE');
assert.equal(formatTimelineDate('29'),'29 CE');
assert.equal(formatTimelineDate(null),'Date not supplied');
const flagged = renderTimelineCard({...results[0],name:'<img src=x onerror=alert(1)>'},3);
assert(flagged.includes('aria-controls="timeline-academic-3"'));
assert(flagged.includes('aria-expanded="false"'));
assert(flagged.includes('Academic (History)'));
assert(flagged.includes('Traditional date') && flagged.includes('Academic assessment'));
assert(flagged.includes('hidden') && /&lt;img/i.test(flagged));
assert(!/<img/i.test(flagged));
const titled={fields:{title:'Joseph’s land acquisition'}};
assert(renderTimelineCard(titled,0).includes('<h2>Joseph’s Land Acquisition</h2>'));
assert.equal(titled.fields.title,'Joseph’s land acquisition','Display casing leaves research titles unchanged');
assert(!renderTimelineCard(results[6],6).includes('data-timeline-history'));
console.log(`Timeline checks passed: ${merged.length} real events, ${merged.filter(e=>e.has_academic_conflict).length} flagged; aliases, false positives, immutability, dates and safe rendering.`);
