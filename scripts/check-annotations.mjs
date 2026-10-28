import {releaseContent} from './rc1-content.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import worker from './built-worker.mjs';

const books=JSON.parse(fs.readFileSync('data/books.json','utf8'));
const evidence=JSON.parse(releaseContent('data/evidence.json'));
for(const record of evidence){if(record.tags!==undefined){assert(Array.isArray(record.tags)&&(record.tags.length>0||record.mode==='history'));assert(record.tags.every(tag=>['H','G','T','V','Q'].includes(tag)));assert.equal(new Set(record.tags).size,record.tags.length);}if(record.tag!==undefined)assert(['H','G','T','V','Q'].includes(record.tag));}
const request=async path=>{const response=await worker.fetch(new Request('https://scripture.test'+path),{},{});assert.equal(response.status,200,path);return response.json();};
const byName=new Map(books.map(b=>[b.name,b]));
const refParts=ref=>{const m=/^(.*?) (\d+):(\d+)$/.exec(ref);return {book:byName.get(m[1]).id,chapter:+m[2],verse:+m[3]};};
let annotationTargets=0,chapterRequests=0;
for(const b of books){
 for(let ch=1;ch<=b.chapters;ch++){
  const chapter=await request(`/api/chapter?book=${b.id}&chapter=${ch}`);chapterRequests++;
  assert.equal(chapter.name,b.name);assert.equal(chapter.chapter,ch);
  const verses=new Set(chapter.verses.map(v=>v.n));
  for(const mode of ['history','science','contradictions','questions','commandments']){
   const result=await request(`/api/comparisons?book=${b.id}&chapter=${ch}&mode=${mode}`);
   const seen=new Set();
   for(const item of result.items){assert(verses.has(item.verse));assert(item.summary&&item.text&&item.sources.length);const key=`${item.id||item.title||item.summary}:${item.verse}`;assert(!seen.has(key),`Duplicate ${key}`);seen.add(key);}
   for(const e of evidence.filter(e=>e.mode===mode)){
    for(const ref of new Set([...(e.sides?.length?e.sides.map(s=>s.ref):[e.ref]),...(e.refs||[]).map(r=>r.label),...(e.appliesTo||[])])){const p=refParts(ref);if(p.book!==b.id||p.chapter!==ch)continue;
     const published=result.items.find(item=>item.verse===p.verse&&(e.id?item.id===e.id:item.summary===e.summary));
     assert(published,`Missing ${ref} ${mode}`);
     assert.equal(published.placementRole,(e.sides?.length?e.sides.some(s=>s.ref===ref):ref===e.ref)?'key':'context');
     assert.equal(published.keyTarget,e.sides?.find(s=>s.label==='A')?.ref||e.ref);
     if(e.sides)assert.deepEqual(published.sides,e.sides);
     if(e.tags){assert.deepEqual(published.tags,e.tags,`Lost language tags at ${ref}`);assert.deepEqual(published.activeTags,e.tags.filter(t=>!['H','G','T','V'].includes(t)||!e.appliesTo||e.appliesTo.includes(ref)),`Incorrect active tags at ${ref}`);}
     if(e.witness)assert.equal(published.witness,e.witness);
     if(e.languageContext)assert.equal(published.languageContext,e.languageContext,`Lost edition context at ${ref}`);
     annotationTargets++;
    }
   }
  }
 }
}
const bad=await worker.fetch(new Request('https://scripture.test/api/comparisons?book=99&chapter=1&mode=history'),{},{});assert.equal(bad.status,400);
console.log(`PASS: ${chapterRequests} chapters, all comparison modes, ${annotationTargets} evidence placements, reference bounds and duplicate IDs.`);
