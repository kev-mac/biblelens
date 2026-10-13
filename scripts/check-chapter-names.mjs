import fs from 'node:fs';import assert from 'node:assert/strict';import {validateChapterNames} from './chapter-names.mjs';
const books=JSON.parse(fs.readFileSync('data/books.json','utf8')),names=JSON.parse(fs.readFileSync('data/chapter-names.json','utf8'));
assert.equal(books.length,66);assert.equal(validateChapterNames(names,books),1189);
const missing=structuredClone(names);delete missing.Genesis['1'];assert.throws(()=>validateChapterNames(missing,books),/Genesis 1/);
const empty=structuredClone(names);empty.Revelation['22']='';assert.throws(()=>validateChapterNames(empty,books),/Revelation 22/);
const worker=fs.readFileSync('dist/server/index.js','utf8');
const marker='const CHAPTER_NAMES=';const start=worker.indexOf(marker);assert(start>=0);
// Worker assets are JSON-encoded strings; inspect the reader asset to verify every name survives packaging.
// Parse the generated reader script from its JSON string value without executing the Worker.
const encoded=worker.match(/"\/reader\.js":\{"type":"[^"]+","body":("(?:\\.|[^"\\])*")\}/);
assert(encoded,'Reader asset missing');const reader=JSON.parse(encoded[1]);
const payload=reader.slice(reader.indexOf(marker)+marker.length).split(';\n')[0].split(';\r\n')[0];
const shipped=JSON.parse(payload);
for(const book of books)for(let chapter=1;chapter<=book.chapters;chapter++)assert.equal(shipped[book.name][chapter],names[book.name][chapter]);
assert(!Object.keys(shipped).some(key=>key.startsWith('_')));
assert(reader.includes('esc(CHAPTER_NAMES[reading.name][reading.chapter])'));
console.log('PASS: all 1,189 chapter names across 66 books; missing/empty rejection; exact packaged strings; notes excluded.');
