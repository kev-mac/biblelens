import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
const samples = JSON.parse(fs.readFileSync('src/data/prophecies.json', 'utf8'));
const schema = JSON.parse(fs.readFileSync('src/data/prophecies.schema.json', 'utf8'));
const bundle = await build({entryPoints:['src/prophecies.js'], bundle:true, write:false, format:'esm', platform:'node'});
const {filterProphecies, prophecyCard, PROPHECY_FACETS} = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
assert.equal(samples.length, 3);
assert.equal(new Set(samples.map(item => item.id)).size, samples.length);
for (const item of samples) {
 assert.deepEqual(Object.keys(item).sort(), schema.required.slice().sort());
 assert.match(item.id, new RegExp(schema.properties.id.pattern));
 for (const key of ['title','prediction_passage','summary']) assert.equal(typeof item[key], 'string');
 assert(item.fulfillment_passage === null || typeof item.fulfillment_passage === 'string');
 assert.deepEqual(Object.keys(item.taxonomy).sort(), ['status','target','type']);
 for (const [facet, values] of Object.entries(PROPHECY_FACETS)) assert(values.includes(item.taxonomy[facet]));
}
const unfulfilled = {...samples[0], id:'awaiting-fulfillment', fulfillment_passage:null, taxonomy:{status:'Unfulfilled', target:'Israel', type:'Conditional'}};
const records = [...samples, unfulfilled];
assert.equal(filterProphecies(records, {}).length, 4);
assert.deepEqual(filterProphecies(records, {target:['Messianic'], status:['Disputed']}).map(item => item.id), ['immanuel-sign']);
assert.equal(filterProphecies(records, {status:['New Testament','Disputed']}).length, 2);
assert.equal(filterProphecies(records, {status:['Historical'], target:['Messianic']}).length, 0);
assert.equal(filterProphecies(records, {status:['Unfulfilled'], type:['Conditional']})[0], unfulfilled);
// Exercise every combination of facet subsets, including empty and multiple selections.
const subsets = values => Array.from({length: 2 ** values.length}, (_, mask) => values.filter((_, i) => mask & (1 << i)));
for (const status of subsets(PROPHECY_FACETS.status)) for (const target of subsets(PROPHECY_FACETS.target)) for (const type of subsets(PROPHECY_FACETS.type)) {
 const actual = filterProphecies(records, {status,target,type});
 const expected = records.filter(item => (!status.length || status.includes(item.taxonomy.status)) && (!target.length || target.includes(item.taxonomy.target)) && (!type.length || type.includes(item.taxonomy.type)));
 assert.deepEqual(actual, expected);
}
assert.equal((prophecyCard(samples[0]).match(/data-prophecy-passage=/g) || []).length, 2);
assert.match(prophecyCard(samples[2]), /Proposed fulfillment/);
const pending = prophecyCard(unfulfilled);
assert.match(pending, /No fulfillment linked/);
assert.equal((pending.match(/data-prophecy-passage=/g) || []).length, 1);
const unsafe = prophecyCard({...samples[0], title:'<script>bad()</script>', summary:'<img onerror="bad()">', prediction_passage:'" onclick="bad()'});
assert(!unsafe.includes('<script>'));
assert(!unsafe.includes('<img'));
assert(unsafe.includes('&quot; onclick=&quot;'));
console.log('Prophecies: samples, 1,024 facet combinations, null fulfillment, disputed labels and HTML escaping passed.');
