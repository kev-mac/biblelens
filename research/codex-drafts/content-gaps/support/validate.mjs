import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateWitnesses} from '../../../../scripts/witness-labels.mjs';
import {validateStories} from '../../../../scripts/stories.mjs';
import {timelineCatalog} from '../../../../scripts/timeline-catalog.mjs';
import {passageReference} from '../../../../scripts/story-topics.mjs';
import {assess, report} from '../../../../scripts/check-readability.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../../../..');
const json=p=>JSON.parse(fs.readFileSync(path.resolve(root,p),'utf8'));
const draft=n=>JSON.parse(fs.readFileSync(path.resolve(here,'..',n+'.json'),'utf8'));
const books=json('data/books.json'),chapters=json('data/chapters.json'),evidence=json('data/evidence.json');
const er=draft('evidence').records.map(x=>x.record);
validateWitnesses([...evidence,...er],books,chapters);
const storyCatalog=draft('stories').catalog;
const combinedStories=[...json('data/stories.json'),...storyCatalog].sort((a,b)=>books.findIndex(x=>x.name===a.book)-books.findIndex(x=>x.name===b.book));
validateStories(combinedStories,{books,chapters,topics:json('data/reference/topics.json')});
const timeline=draft('timeline').records.map(x=>x.record);
const joined=timelineCatalog({events:[...json('data/timeline-events.json').events,...timeline]},evidence);
assert.equal(joined.length,50);
for(const x of draft('prophecies').records)for(const key of ['prediction_passage','fulfillment_passage'])if(x.record[key])passageReference(x.record[key],books);
const groups=[
 {name:'Draft evidence',lines:er.flatMap(r=>['summary','reasoning','scope'].map(f=>r[f]))},
 {name:'Draft stories',lines:storyCatalog.flatMap(b=>b.stories.map(s=>s.summary))},
 {name:'Draft prophecies',lines:draft('prophecies').records.flatMap(x=>[x.record.summary,x.scope])},
 {name:'Draft timeline',lines:draft('timeline').records.flatMap(x=>[x.record.traditional_date,x.scope])},
];
const failed=report(groups);
const results=groups.map(g=>{const a=g.lines.map(s=>assess(s,g));const grades=a.map(x=>x.grade).filter(x=>x!==null);return {collection:g.name,lines:a.length,average_fk_grade:grades.reduce((s,g)=>s+g,0)/grades.length,over_length:a.filter(x=>x.tooLong).length,unexplained_jargon:a.filter(x=>x.unexplained).length};});
for(const r of results)assert(r.average_fk_grade>=6&&r.average_fk_grade<=8,`${r.collection}: grade outside 6–8`);
assert.equal(failed,false,'Draft readability must pass');
const result={status:'pass',checks:['Repository validateWitnesses and validateSides, including the combined evidence catalog','Repository validateStories on combined old and draft story books','Repository timelineCatalog on combined old and draft events','Repository prophecy passage parser','Draft prose grade 6–8, sentence length and jargon screen'],readability:results};
fs.writeFileSync(path.join(here,'runtime-validation.json'),JSON.stringify(result,null,2)+'\n');
console.log('PASS: repository runtime validators and all four draft readability groups.');
