import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {performance} from 'node:perf_hooks';
const source=fs.readFileSync('src/search-core.js','utf8');
// Reference behavior before memoization; independent filtering on every query.
assert(source.includes("kind==='places'?searchablePlaces(rows):rows"));
const baseline=source.replace("kind==='places'?searchablePlaces(rows):rows", "kind==='places'?rows.filter(row=>!(/['’]s$/i.test(row.fields?.displayTitle||'')&&rows.some(other=>other.fields?.displayTitle===row.fields.displayTitle.replace(/['’]s$/i,'')))):rows");
const load=code=>vm.runInNewContext(code+';BibleLensSearch;');
const before=load(baseline),after=load(source);
const rows=JSON.parse(fs.readFileSync('data/reference/places.json','utf8'));
const queries=['Jerusalem','Bethlehem','Jordan','Eden','Egypt','Galilee','Babylon','Nazareth','Jericho','Bethany','where is jerusalm','Mount Sinai','David','xyz',''];
// Compare every catalog name as well as typical and misspelled searches.
for(const query of [...queries,...rows.map(row=>row.fields?.displayTitle).filter(Boolean)]){
 assert.equal(JSON.stringify(after.catalogSearch(rows,'places',query)),JSON.stringify(before.catalogSearch(rows,'places',query)),query);
}
const fixture=[{id:'a',fields:{displayTitle:'Eden'}},{id:'b',fields:{displayTitle:"Eden’s"}}];
assert.equal(after.catalogSearch(fixture,'places','Eden').some(row=>row.id==='b'),false);
const replacement=[fixture[1]];
assert.equal(after.catalogSearch(replacement,'places','Eden').some(row=>row.id==='b'),true,'Replacement arrays invalidate filtering');
fixture[0].fields.displayTitle='Garden';after.invalidateCatalog(fixture);
assert.equal(after.catalogSearch(fixture,'places','Eden').some(row=>row.id==='b'),true,'Explicit invalidation refreshes filtered rows');
assert.equal(after.catalogSearch(fixture,'places','Garden')[0].id,'a','Explicit invalidation refreshes index and vocabulary');
const batch=queries.slice(0,10),measure=api=>{const samples=[];for(let i=0;i<9;i++){const t=performance.now();for(const query of batch)api.catalogSearch(rows,'places',query);samples.push(performance.now()-t);}return samples.sort((a,b)=>a-b)[4];};
const oldMs=measure(before),newMs=measure(after);
console.log(JSON.stringify({passed:true,rows:rows.length,queriesCompared:queries.length+rows.filter(row=>row.fields?.displayTitle).length,median10QueriesMs:{before:oldMs,after:newMs},reductionPercent:100*(1-newMs/oldMs)},null,2));
