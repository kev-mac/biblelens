import assert from 'node:assert/strict';
import {b2Catalog} from './b2-catalog.mjs';
import {b6Catalog,sentenceCase} from './b6-drafts.mjs';
import {neutralTree} from './b4-neutral.mjs';
const payload=neutralTree(b6Catalog(b2Catalog()));let checked=0;
function check(record,location){for(const field of ['title','display_title'])if(record[field]){assert.equal(record[field],sentenceCase(record[field]),`${location}.${field} must use sentence case (proper nouns: research/b6/title-proper-nouns.json)`);checked++;}}
for(const [name,rows]of Object.entries(payload.collections))for(const row of rows)check(row.record,name+'/'+row.id);
for(const name of ['b6Evidence','b6Readings'])for(const row of payload[name])check(row.record,name+'/'+row.id);
assert.notEqual(sentenceCase('Gentleness Or Correction'),'Gentleness Or Correction','Negative control must reject title case');
assert.equal(sentenceCase('David and Goliath'),'David and Goliath');
console.log(`PASS: ${checked} draft titles use sentence case; proper-noun allowlist and negative control checked.`);
