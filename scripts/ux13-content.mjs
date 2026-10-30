import fs from 'node:fs';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import {passageReference} from './story-topics.mjs';
export const ux13Events=JSON.parse(fs.readFileSync(new URL('../data/ux13-events.json',import.meta.url),'utf8'));
// Screen authored prose only: exact KJV source quotations retain their wording.
export const vaguePlaceActor=/\b(?:travell?ers?|speaker|a man|someone|he|she|they)\b/i;
export function addUX13Events(catalog){
 const groups=structuredClone(catalog),books=JSON.parse(fs.readFileSync('data/books.json','utf8'));
 for(const event of ux13Events){if(groups.some(g=>g.stories.some(s=>s.title===event.title)))continue;const [id]=passageReference(event.passage,books),name=books[id].name;let group=groups.find(g=>g.book===name);if(!group){group={book:name,stories:[]};groups.push(group);}group.stories.push(event);}
 return groups;
}
export function validateUX13Content(){
 const places=JSON.parse(fs.readFileSync('data/reference/places.json')),summaries=JSON.parse(fs.readFileSync('data/reference/place-summaries.json')),chapters=JSON.parse(fs.readFileSync('data/chapters.json')),books=JSON.parse(fs.readFileSync('data/books.json'));
 const decoded=new Map();const verse=r=>{const key=r[0]+':'+r[1];if(!decoded.has(key))decoded.set(key,JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64'))));return decoded.get(key).verses.find(v=>v.n===r[2]);};
 assert.equal(Object.keys(summaries).length,places.length);
 for(const p of places){
  const s=summaries[p.id],label=p.fields.displayTitle+' ('+p.id+')';
  assert(s?.method!=='needs-context-review','Unfinished contextual summary: '+label);
  assert(s?.summary&&s.refs.length,'Missing summary: '+label);
  const own=new Set(p.fields.refs.map(r=>r.join(':'))),cited=new Set(s.refs.map(r=>r.join(':')));
  assert.equal(cited.size,s.refs.length,'Duplicate summary refs: '+label);
  assert(s.refs.every(r=>own.has(r.join(':'))),'Summary refs outside own refs: '+label);
  assert(s.refs.length<=4&&s.refs.length>=Math.min(2,own.size),'Summary needs 2–4 refs (one for a single-ref place): '+label);
  const citation=' ('+s.refs.map(r=>`${books[r[0]].name} ${r[1]}:${r[2]}`).join('; ')+')';
  assert(s.summary.endsWith(citation),'Displayed citations differ from stored refs: '+label);
  const prose=s.summary.slice(0,-citation.length);
  assert(!vaguePlaceActor.test(prose),'Vague or unresolved summary actor: '+label);
  if(p.fields.refs.length>=10){
   if(new Set(p.fields.refs.map(r=>r[0])).size>1)assert(new Set(s.refs.map(r=>r[0])).size>=2,'Summary needs citations from two linked books: '+label);
   const sentences=[...new Intl.Segmenter('en',{granularity:'sentence'}).segment(prose)].filter(part=>part.segment.trim());
   assert(sentences.length>=2&&sentences.length<=3,'Major place needs significance and scope in 2–3 sentences: '+label);
  }
  assert.deepEqual(s.sourceQuotes,s.refs.map(r=>verse(r)?.kjv),'Summary source text differs: '+label);
 }
 assert.equal(ux13Events.filter(e=>e.collection==='Covenants').length,6);
 const comparisons=JSON.parse(fs.readFileSync('data/comparison-topics.json','utf8'));
 const evidence=JSON.parse(fs.readFileSync('data/evidence.json','utf8'));
 assert(!addUX13Events(JSON.parse(fs.readFileSync('data/stories.json','utf8'))).some(group=>group.stories.some(event=>event.title==='Parallel Accounts in Genesis')));
 for(const comparison of comparisons){assert(evidence.some(record=>comparison.href==='#debate/'+record.id&&record.mode==='contradictions'));for(const ref of comparison.passages){const [b,c,v,ec,ev]=passageReference(ref,books);assert(verse([b,c,v])&&verse([b,ec,ev]));}}
 for(const e of ux13Events){assert(e.passages.includes(e.passage)&&e.review&&e.summary);for(const ref of e.passages){const [b,c,v,ec,ev]=passageReference(ref,books);assert(verse([b,c,v])&&verse([b,ec,ev]),'Invalid event reference '+ref);}}
 return `${places.length} place summaries, refs and KJV source quotes; ${ux13Events.length} events (6 covenants)`;
}
