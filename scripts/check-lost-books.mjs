import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import vm from 'node:vm';
import {assess} from './check-readability.mjs';
const books=JSON.parse(fs.readFileSync('data/lost-books/books.json','utf8'));
const chapters=JSON.parse(fs.readFileSync('data/lost-books/chapters.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('data/lost-books/manifest.json','utf8'));
assert.deepEqual(manifest.includedBooks,books);
assert.equal(books.filter(b=>b.collection==='Apocrypha').length,14);
for(const [index,b] of books.entries()){
 assert.equal(b.id,66+index);assert.equal(b.license,'Public domain');
 for(const key of ['name','translator','edition','licenseUrl','descriptionSource','numbering'])assert(b[key],b.name+' '+key);
 assert(Object.hasOwn(b,'editionYear'));if(b.editionYear===null)assert(b.editionYearNote);
 assert.match(b.source.sha256,/^[a-f0-9]{64}$/);assert.match(b.source.url,/^https:\/\//);
 assert.equal(b.chapters,b.verseCounts.length);assert.equal(b.chapters,b.sourceChapters.length);
 for(let c=1;c<=b.chapters;c++){
  const ch=chapters[`${b.id}:${c}`];assert(ch,b.name+' '+c);assert.equal(ch.verses.length,b.verseCounts[c-1]);assert.equal(ch.sourceChapter,b.sourceChapters[c-1]);
  const numbers=ch.verses.map(v=>v.n);assert.equal(new Set(numbers).size,numbers.length);assert(numbers.every((n,i)=>Number.isInteger(n)&&n>0&&(!i||n>numbers[i-1])));
  for(const v of ch.verses){assert(v.kjv.trim());assert.deepEqual(v.referenceLinks,{kjv:[],web:[],asv:[]});assert.deepEqual(v.redLetters,{});assert(!/Notes on Translation|op\. cit\./.test(v.kjv));}
 }
 if(b.collection==='Apocrypha'){assert(b.archiveCountVerification);assert(b.countVerification);assert(b.traditionNote);assert.match(b.traditionSource,/^https:\/\//);}
}
for(const collection of new Set(books.map(b=>b.collection))){
 const rows=books.filter(b=>b.collection===collection).flatMap(b=>[b.description,...(b.traditionNote?[b.traditionNote]:[])]).map(text=>assess(text,{blurb:true}));
 const average=rows.reduce((n,r)=>n+r.grade,0)/rows.length;assert(average>=6&&average<=8,collection+' grade '+average);assert(rows.every(r=>!r.tooLong&&!r.unexplained));
 const checks=manifest.spotChecks.filter(c=>c.collection===collection&&c.match);assert(checks.length>=10,collection+' ten passage checks');
}
for(const b of books.filter(b=>b.collection==='Gnostic')){const decision=manifest.gnosticDecisions.find(d=>d.sourceUrl===b.source.url);assert.equal(decision?.decision,'included');assert.equal(decision.dedicationUrl,b.licenseUrl);}
assert(manifest.pending.some(b=>b.name==='1 Enoch'));assert(manifest.pending.some(b=>b.name==='Jubilees'));
// These paths previously discarded any saved note whose book ID exceeded 65.
const source=fs.readFileSync('src/passage.js','utf8');
const context=vm.createContext({books:[...JSON.parse(fs.readFileSync('data/books.json','utf8')),...books],normalizeTextHighlights:value=>value||[],URL,location:{href:'https://example.test/#read/80/1'}});
for(const [start,end] of [['function normalizePassageRecords(','state.passageNotes='],['function normalizeVerseRecords(','state.verseBookmarks='],['function buildVerseShareUrl(','async function shareVerseLink(']]){
 const a=source.indexOf(start),b=source.indexOf(end,a);assert(a>=0&&b>a);vm.runInContext(source.slice(a,b),context);
}
const note={book:80,chapter:1,name:'Gospel of Thomas',verse:180,text:'Private offline note'};
context.note=note;
assert.equal(vm.runInContext('normalizeVerseRecords({"80:1:180":note})["80:1:180"].text',context),note.text);
assert.equal(vm.runInContext('normalizePassageRecords({"80:1":note})["80:1"].text',context),note.text);
assert.match(context.buildVerseShareUrl(80,1,[180]),/#read\/80\/1\/180$/);
assert.throws(()=>context.buildVerseShareUrl(999,1,[1]));
const compressed=zlib.gzipSync(fs.readFileSync('data/lost-books/chapters.json')).length;assert(compressed<5*1024*1024);
console.log(`PASS: ${books.length} licensed books, ${Object.keys(chapters).length} reading chapters, verified source counts, ${manifest.spotChecks.filter(c=>c.match).length} passage checks, collection readability, no evidence/links; corpus gzip ${compressed} bytes.`);
