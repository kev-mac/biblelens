import fs from 'node:fs';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import {passageReference} from './story-topics.mjs';
export const ux13Events=JSON.parse(fs.readFileSync(new URL('../data/ux13-events.json',import.meta.url),'utf8'));
export function addUX13Events(catalog){
 const groups=structuredClone(catalog),books=JSON.parse(fs.readFileSync('data/books.json','utf8'));
 for(const event of ux13Events){if(groups.some(g=>g.stories.some(s=>s.title===event.title)))continue;const [id]=passageReference(event.passage,books),name=books[id].name;let group=groups.find(g=>g.book===name);if(!group){group={book:name,stories:[]};groups.push(group);}group.stories.push(event);}
 return groups;
}
export function validateUX13Content(){
 const places=JSON.parse(fs.readFileSync('data/reference/places.json')),summaries=JSON.parse(fs.readFileSync('data/reference/place-summaries.json')),chapters=JSON.parse(fs.readFileSync('data/chapters.json')),books=JSON.parse(fs.readFileSync('data/books.json'));
 const decoded=new Map();const verse=r=>{const key=r[0]+':'+r[1];if(!decoded.has(key))decoded.set(key,JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64'))));return decoded.get(key).verses.find(v=>v.n===r[2]);};
 assert.equal(Object.keys(summaries).length,places.length);
 for(const p of places){const s=summaries[p.id];assert(s?.method!=='needs-context-review','Unfinished contextual summary: '+p.id);assert(s?.summary&&s.refs.length,'Missing summary: '+p.id);const own=new Set(p.fields.refs.map(r=>r.join(':')));assert(s.refs.every(r=>own.has(r.join(':'))),'Summary refs outside own refs: '+p.id);assert.deepEqual(s.sourceQuotes,s.refs.map(r=>verse(r)?.kjv),'Summary source text differs: '+p.id);}
 assert.equal(ux13Events.filter(e=>e.collection==='Covenants').length,6);
 for(const e of ux13Events){assert(e.passages.includes(e.passage)&&e.review&&e.summary);for(const ref of e.passages){const [b,c,v,ec,ev]=passageReference(ref,books);assert(verse([b,c,v])&&verse([b,ec,ev]),'Invalid event reference '+ref);}}
 return `${places.length} place summaries, refs and KJV source quotes; ${ux13Events.length} events (6 covenants)`;
}
