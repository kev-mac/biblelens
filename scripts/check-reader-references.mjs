import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import {readerReferences} from './reader-references.mjs';
import worker from '../dist/server/index.js';
const decorate=readerReferences(JSON.parse(fs.readFileSync('data/reference/people.json')),JSON.parse(fs.readFileSync('data/reference/places.json')));
const red={};vm.createContext(red);vm.runInContext(fs.readFileSync('src/red-letters.js','utf8')+';this.spans=RED_LETTERS',red);
for(const [book,chapter]of [[0,1],[0,6],[8,17],[39,5],[41,2],[42,3]]){
 const data=await(await worker.fetch(new Request(`https://biblelens.test/api/chapter?book=${book}&chapter=${chapter}`),{},{})).json();
 const expected=decorate(data);
 for(const [index,verse]of data.verses.entries()){
  assert.deepEqual(verse.referenceLinks,expected.verses[index].referenceLinks,'Packaged links use the original identity/ambiguity rules');
  assert.equal(JSON.stringify(verse.redLetters),JSON.stringify(red.spans[book+':'+chapter]?.[verse.n]||{}));
  for(const edition of ['kjv','web','asv'])for(const hit of verse.referenceLinks[edition])assert.equal(verse[edition].slice(hit.start,hit.end),hit.label);
 }
}
console.log('PASS: chapter-scoped people/place links retain matcher identity and exact offsets; red-letter spans survive packaging.');
