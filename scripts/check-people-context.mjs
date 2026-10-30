import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {addPeopleContext} from './people-context.mjs';
const people=JSON.parse(fs.readFileSync('data/reference/people.json','utf8'));
const chapters=JSON.parse(fs.readFileSync('data/chapters.json','utf8'));
const enriched=addPeopleContext(people,chapters),ids=new Set(people.map(person=>person.id));
assert.equal(enriched.length,people.length);
const abagtha=enriched.find(person=>person.name==='Abagtha');
assert.equal(abagtha.summary_source,'Esther 1:10–11');
assert.deepEqual(abagtha.summary_links.map(hit=>hit.label),['Ahasuerus','Vashti']);
assert(!people.find(person=>person.name==='Abagtha').summary,'Enrichment must not mutate imported source records');
let contexts=0;
for(const person of enriched){
 const context=person.scripture_context;if(!context)continue;contexts++;
 assert(person.refs.some(([book,chapter,verse])=>book===context.book&&chapter===context.chapter&&verse===context.verse));
 const chapter=JSON.parse(gunzipSync(Buffer.from(chapters[context.book+':'+context.chapter],'base64')));
 assert.equal(context.text,chapter.verses.find(verse=>verse.n===context.verse).kjv);
 for(const hit of context.links){assert(ids.has(hit.id));assert.notEqual(hit.id,person.id);assert.equal(context.text.slice(hit.start,hit.end),hit.label);}
}
assert(contexts>=3000);
console.log(`PASS: ${contexts} exact cited scripture excerpts; Abagtha's source, identity links, safe offsets and immutable imported records.`);
