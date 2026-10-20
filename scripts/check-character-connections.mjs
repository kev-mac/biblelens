import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {build} from 'esbuild';
import {createCharacterGraph, getCharacterConnections} from '../src/character-connections.js';
import {characterRelationshipData} from './character-relationships.mjs';

const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const people = read('data/reference/people.json');
const profiles = read('src/data/characters.json');
const relationships = read('data/reference/relationships.json');
const bindings = read('src/data/character-reference-ids.json');
const generated = characterRelationshipData(people, profiles);
assert.deepEqual(generated, {relationships, bindings}, 'Regenerate family data after changing people or spouse links');
const graph = createCharacterGraph(people, relationships);
for (const edge of relationships) {
  assert(graph.getPerson(edge.source_id)); assert(graph.getPerson(edge.target_id));
}
const personId = record => people.find(person => person.sourceRecord === record).id;
assert.equal(bindings.jacob, personId('israel_682'));
assert.equal(bindings.enoch, personId('enoch_1192'));
assert.equal(bindings.job, personId('job_1639'));
const family = id => graph.getCharacterConnections(bindings[id] || id);
assert(family('abraham').children.some(person => person.id === bindings.isaac));
assert(family('isaac').parents.some(person => person.id === bindings.abraham));
assert(family('abraham').spouses.some(person => person.id === bindings.sarah));
assert(family('sarah').spouses.some(person => person.id === bindings.abraham));
assert(family('isaac').siblings.some(person => person.id === bindings.ishmael));
assert(!family('cain').children.some(person => person.id === bindings.enoch));
assert(!family('job').parents.some(person => person.id === bindings.issachar));
assert.deepEqual(family('missing'), {parents: [], spouses: [], siblings: [], children: []});

const fixture = createCharacterGraph(['a', 'b', 'c', 'd', 'e'].map(id => ({id, name: id === 'c' ? 'b' : id})), [
  {source_id: 'a', target_id: 'b', relationship_type: 'parent'},
  {source_id: 'b', target_id: 'a', relationship_type: 'child'},
  {source_id: 'a', target_id: 'b', relationship_type: 'parent'},
  {source_id: 'c', target_id: 'a', relationship_type: 'child'},
  {source_id: 'a', target_id: 'd', relationship_type: 'spouse'},
  {source_id: 'd', target_id: 'b', relationship_type: 'parent'},
  {source_id: 'b', target_id: 'e', relationship_type: 'sibling'},
  {source_id: 'b', target_id: 'b', relationship_type: 'sibling'},
  {source_id: 'missing', target_id: 'b', relationship_type: 'parent'},
  {source_id: 'a', target_id: 'e', relationship_type: 'friend'},
]);
assert.equal(fixture.getCharacterConnections('a').children.length, 2, 'Deduplicate inverse edges without merging identical names');
assert.equal(fixture.getCharacterConnections('d').spouses[0].id, 'a');
assert.deepEqual(fixture.getCharacterConnections('c').siblings.map(person => person.id), ['b']);
assert.deepEqual(fixture.getCharacterConnections('e').siblings.map(person => person.id), ['b']);
assert.equal(fixture.getCharacterConnections('b').spouses.length, 0);
assert.equal(fixture.getCharacterConnections('b').parents.length, 2);

// Verify the actual dataset supports the requested traversal through intermediate profiles.
const start = bindings.adam, end = personId('jesus_905');
const visited = new Set(), queue = [start];
while (queue.length) {
  const id = queue.shift(); if (visited.has(id)) continue; visited.add(id);
  queue.push(...family(id).children.map(person => person.id));
}
assert(visited.has(end), 'A continuous descendant path must reach Jesus from Adam');

// Lazy loading retries after errors, shares requests, and accepts application slugs.
const originalFetch = globalThis.fetch;
let requests = 0;
try {
  globalThis.fetch = async () => ({ok: false});
  await assert.rejects(getCharacterConnections('abraham'));
  globalThis.fetch = async url => { requests++; return {ok: true, json: async () => url.includes('people') ? people : relationships}; };
  const [first, second] = await Promise.all([getCharacterConnections('abraham'), getCharacterConnections(bindings.abraham)]);
  assert.deepEqual(first, second); assert.equal(requests, 2);
} finally { globalThis.fetch = originalFetch; }

const bundle = await build({entryPoints: ['src/components/characters/Connections.ts'], bundle: true, write: false, format: 'iife', globalName: 'Connections'});
const node = tag => ({tag, children: [], dataset: {}, attributes: {}, append(...children) { this.children.push(...children); }, setAttribute(key, value) { this.attributes[key] = value; }});
const context = {document: {createElement: node, createTextNode: text => ({textContent: text})}};
vm.createContext(context); vm.runInContext(bundle.outputFiles[0].text, context);
const empty = context.Connections.FamilyConnections(family('missing'));
assert(!empty.children.some(child => child.className === 'character-connection-row'), 'Empty families must omit category labels');
const section = context.Connections.FamilyConnections(family('abraham'));
const sourceToggle=section.children.find(child=>child.className==='character-source-toggle');
const sourcePopover=section.children.find(child=>child.className==='character-source-popover');
assert.equal(sourceToggle.textContent,'Source');assert.equal(sourceToggle.attributes.popovertarget,sourcePopover.id);
assert.equal(sourcePopover.attributes.popover,'auto');assert.equal(sourcePopover.attributes.role,'dialog');
assert(sourcePopover.children.some(child=>child.className==='characters-note'),'Preserve the complete attribution inside the popover');
assert(sourcePopover.children.some(child=>child.href==='reference/THEOGRAPHIC-LICENSE.txt'),'Keep the full license accessible');
assert(!section.children.some(child=>child.className==='characters-note'),'Family credit is presented through Source rather than an inline block');
const childrenRow = section.children.find(row => row.children?.[0]?.textContent === 'Children:');
const isaac = childrenRow.children[1].children.find(chip => chip.dataset.relativeId === 'isaac');
assert.equal(isaac.tag, 'button'); assert.equal(isaac.children[1].textContent, 'Isaac');
assert.equal(isaac.children[0].attributes['aria-hidden'], 'true');
const spouseRow=section.children.find(row=>row.children?.[0]?.textContent==='Spouses:');
assert(spouseRow.children[1].children.find(chip=>chip.dataset.relativeId==='sarah').className.includes('character-relative-female'));
assert(!isaac.className.includes('character-relative-female'));
const reference = context.Connections.connectionProfile(graph.getPerson(personId('jesus_905')));
assert.equal(reference.id, end); assert.equal(reference.name, 'Jesus');
assert.equal(context.Connections.connectionProfile(graph.getPerson(bindings.jacob)).id, 'jacob');
const hostile = {...graph.getPerson(bindings.isaac), name: '<img src=x onerror=alert(1)>'};
const safe = context.Connections.FamilyConnections({parents: [hostile], spouses: [], siblings: [], children: []});
assert.equal(safe.children[1].children[1].children[0].children[1].textContent, hostile.name);
console.log('PASS: family direction, identity, duplicates, half-siblings, Adam–Jesus traversal, retry/cache, reference profiles, empty categories and text-safe chips.');
