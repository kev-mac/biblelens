import fs from 'node:fs';import assert from 'node:assert/strict';import zlib from 'node:zlib';import {validateChapterNames} from './chapter-names.mjs';
import worker from '../dist/server/index.js';
const books=JSON.parse(fs.readFileSync('data/books.json','utf8')),names=JSON.parse(fs.readFileSync('data/chapter-names.json','utf8'));
assert.equal(books.length,66);assert.equal(validateChapterNames(names,books),1189);
const missing=structuredClone(names);delete missing.Genesis['1'];assert.throws(()=>validateChapterNames(missing,books),/Genesis 1/);
const empty=structuredClone(names);empty.Revelation['22']='';assert.throws(()=>validateChapterNames(empty,books),/Revelation 22/);
const corpus=JSON.parse(fs.readFileSync('data/chapters.json','utf8'));
for(const book of books)for(let chapter=1;chapter<=book.chapters;chapter++){
 const response=await worker.fetch(new Request(`https://biblelens.test/api/chapter?book=${book.id}&chapter=${chapter}`),{},{});
 assert.equal(response.status,200);const shipped=await response.json();assert.equal(shipped.chapterName,names[book.name][chapter]);
 const original=JSON.parse(zlib.gunzipSync(Buffer.from(corpus[book.id+':'+chapter],'base64')));
 assert.deepEqual(shipped.verses.map(({referenceLinks,redLetters,...verse})=>verse),original.verses,'Every edition retains the exact original verse data');
 assert(shipped.verses.every(verse=>verse.referenceLinks&&verse.redLetters));
}
assert(fs.readFileSync('src/reader.js','utf8').includes('esc(reading.chapterName'));
const genesis4=await(await worker.fetch(new Request('https://biblelens.test/api/chapter?book=0&chapter=4'),{},{})).json();
assert.deepEqual(genesis4.eventHeadings['1'],['Cain and Abel']);
assert.deepEqual(genesis4.eventHeadings['25'],['The Line of Seth'],'Events beginning mid-chapter retain their own verse heading');
assert(!Object.values(genesis4.eventHeadings).flat().includes('Parallel Accounts in Genesis'));
console.log('PASS: all 1,189 packaged chapter names, every original verse in all editions, on-demand link/red-letter metadata, and missing/empty rejection.');
