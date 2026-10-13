import fs from 'node:fs';
import vm from 'node:vm';
import {gunzipSync} from 'node:zlib';

const books=JSON.parse(fs.readFileSync('data/books.json','utf8'));
const chapters=JSON.parse(fs.readFileSync('data/chapters.json','utf8'));
const evidence=JSON.parse(fs.readFileSync('data/evidence.json','utf8'));
const context={};vm.createContext(context);
vm.runInContext(fs.readFileSync('src/data.js','utf8')+'\nthis.studies=ENTRIES;',context);
const rows=new Map(),errors=[],ids=new Set();
for(const book of books)for(let chapter=1;chapter<=book.chapters;chapter++){
 const key=`${book.id}:${chapter}`,data=JSON.parse(gunzipSync(Buffer.from(chapters[key],'base64')));
 rows.set(key,{book:book.name,bookId:book.id,chapter,verseNumbers:new Set(data.verses.map(v=>v.n)),annotations:new Set(),verses:new Set(),modes:new Set()});
}
function resolve(ref){const m=/^(.*?) (\d+):(\d+)$/.exec(ref||'');const book=m&&books.find(b=>b.name===m[1]);const row=book&&rows.get(`${book.id}:${+m[2]}`);if(!row||!row.verseNumbers.has(+m[3])){errors.push(`Invalid verse reference: ${ref}`);return null;}return {row,verse:+m[3]};}
function record(ref,id,mode){const match=resolve(ref);if(match){match.row.annotations.add(id);match.row.verses.add(match.verse);match.row.modes.add(mode);}}
for(const [index,e] of evidence.entries()){
 const id=e.id||`legacy-evidence-${index}`;if(ids.has(id))errors.push(`Duplicate annotation ID: ${id}`);ids.add(id);
 if(!['science','history','contradictions','questions'].includes(e.mode))errors.push(`Invalid mode: ${id}`);
 for(const name of ['summary','text','scope'])if(!e[name]?.trim())errors.push(`Missing ${name}: ${id}`);
 if(!e.sources?.length)errors.push(`Missing sources: ${id}`);
 for(const source of e.sources||[])if(!source.label||!/^https:\/\//.test(source.url))errors.push(`Invalid source: ${id}`);
 for(const ref of new Set(e.appliesTo||[e.ref]))record(ref,id,e.mode);
 for(const r of e.refs||[]){const book=books[r.book];resolve(`${book?.name} ${r.chapter}:${r.verse}`);}
}
for(const e of context.studies){if(e.type==='Historical / chronological')continue;for(const ref of e.refs)record(ref,`study-${e.id}`,'contradictions');}
const byBook=books.map(book=>{const records=[...rows.values()].filter(r=>r.bookId===book.id);return {book:book.name,chapters:book.chapters,chaptersWithAnnotations:records.filter(r=>r.annotations.size).length,annotatedVerses:records.reduce((n,r)=>n+r.verses.size,0)};});
const queue=[...rows.values()].map(r=>({book:r.book,bookId:r.bookId,chapter:r.chapter,annotationIds:[...r.annotations],annotatedVerses:[...r.verses].sort((a,b)=>a-b),modes:[...r.modes],researchStatus:'exhaustive-review-not-certified'}));
const result={schemaVersion:1,scope:'All 66 books and 1189 chapters',note:'Annotation presence is not proof of comprehensive chapter review. Research status is internal only.',counts:{books:books.length,chapters:rows.size,evidenceRecords:evidence.length,studyRecords:context.studies.length,booksWithAnnotations:byBook.filter(b=>b.chaptersWithAnnotations).length,chaptersWithAnnotations:queue.filter(r=>r.annotationIds.length).length,annotatedVerses:byBook.reduce((n,b)=>n+b.annotatedVerses,0)},byBook,chapters:queue,errors};
fs.mkdirSync('research',{recursive:true});fs.writeFileSync('research/coverage-audit.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({counts:result.counts,errors},null,2));if(errors.length)process.exitCode=1;
