import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context=vm.createContext({books:JSON.parse(fs.readFileSync('data/books.json'))});vm.runInContext(fs.readFileSync('src/search-core.js','utf8')+';this.search=BibleLensSearch;',context);
const search=context.search,people=JSON.parse(fs.readFileSync('data/reference/people.json'));
for(const question of ['Who was Moses?','Who is Moses?','Tell me about Moses']){
 const results=search.catalogSearch(people,'people',question);assert.equal(results[0].name,'Moses');
}
assert.equal(search.catalogSearch(people,'people','Mos')[0].name,'Moses');
const places=JSON.parse(fs.readFileSync('data/reference/places.json'));
assert.equal(search.catalogSearch(places,'places','Where is Jericho?')[0].fields.displayTitle,'Jericho');
const abdi=search.catalogSearch(people,'people','Who was Abdi?').filter(row=>row.name==='Abdi');assert(abdi.length>1);assert.equal(new Set(abdi.map(row=>search.personLabel(row,people))).size,abdi.length);assert(abdi.every(row=>search.personLabel(row,people).startsWith('Abdi')));
console.log('PASS: person/place question profiles, Moses prefix, and duplicate labels use supplied identities.');
