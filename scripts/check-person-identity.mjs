import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {releasePeopleRoles} from './people-roles.mjs';

const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const books = read('data/books.json');
const context = vm.createContext({BOOKS: books});
vm.runInContext(fs.readFileSync('src/person-identity.js', 'utf8') + '\n' + fs.readFileSync('src/search-core.js', 'utf8') + '\nglobalThis.search = BibleLensSearch;', context);
const {search} = context;
const helper = context.BibleLensPersonIdentity;
vm.runInContext(fs.readFileSync('src/person-identity.js', 'utf8'), context);
assert.equal(context.BibleLensPersonIdentity, helper, 'Classic and lazy imports share an idempotent helper');
// Match the worker marker order, where BOOKS is a lexical binding after the core.
const workerContext = vm.createContext({});
const workerPrelude = fs.readFileSync('worker/index.mjs', 'utf8').split('const CHAPTERS=')[0]
  .replace('/*__SEARCH_CORE__*/', () => fs.readFileSync('src/person-identity.js', 'utf8') + '\n' + fs.readFileSync('src/search-core.js', 'utf8'))
  .replace('/*__BOOKS__*/[]', () => JSON.stringify(books));
vm.runInContext(workerPrelude + '\nglobalThis.search = BibleLensSearch;', workerContext);
const bundle = await build({entryPoints: ['src/components/characters/people.ts'], bundle: true, write: false, format: 'esm', platform: 'node'});
const {mapPeople, createPeopleSearch} = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));

// Frozen pre-refactor behavior, deliberately independent of the new helper.
function legacyQualifier(person, rows, directory = false) {
  let label = typeof person.label === 'string' && person.label !== person.name ? person.label : '';
  if (directory && label.startsWith(person.name + ' (') && label.endsWith(')')) label = label.slice(person.name.length + 2, -1);
  const role = person.roles?.[0], kingdom = role?.role === 'king' && /king of ([A-Z][a-z]+)/.exec(role.phrase);
  const roleLabel = role ? (kingdom ? 'King of ' + kingdom[1] : role.role[0].toUpperCase() + role.role.slice(1)) : '';
  const parent = [...(person.relations?.father || []), ...(person.relations?.mother || [])].map(relation => rows.find(row => row.id === relation.id)?.name).find(Boolean);
  const sameRole = role && rows.some(row => row.id !== person.id && row.name === person.name && row.roles?.some(tag => tag.role === role.role && (!kingdom || tag.phrase.includes('king of ' + kingdom[1]))));
  const ref = person.refs?.find(ref => !directory || (Array.isArray(ref) && ref.length === 3 && ref.every(Number.isInteger) && books.some(book => book.id === ref[0] && ref[1] > 0 && ref[1] <= book.chapters) && ref[2] > 0));
  const book = ref && books.find(book => book.id === ref[0]);
  const reference = book ? `${book.name} ${ref[1]}:${ref[2]}` : '';
  if (!directory && !roleLabel && label) return label;
  const qualifier = roleLabel ? roleLabel + (sameRole && parent ? ', child of ' + parent : '') : label && directory ? label : parent ? 'child of ' + parent : reference;
  return directory ? qualifier : person.name + (qualifier ? ` (${qualifier})` : '');
}
const directoryNormalize = name => name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function compareCatalog(rows) {
  const mapped = mapPeople(rows);
  const counts = (values, normalize) => {
    const result = new Map();
    for (const row of values) {const key = normalize(row.name); result.set(key, (result.get(key) || 0) + 1);}
    return result;
  };
  const searchCounts = counts(rows, search.normalize), directoryCounts = counts(mapped, directoryNormalize);
  for (const person of rows) {
    const searchExpected = searchCounts.get(search.normalize(person.name)) < 2 ? person.name : legacyQualifier(person, rows);
    assert.equal(search.personLabel(person, rows), searchExpected, `Search ${person.id}`);
    const directoryExpected = directoryCounts.get(directoryNormalize(person.name.trim())) < 2 ? undefined : legacyQualifier(person, rows, true);
    assert.equal(mapped.find(row => row.id === person.id).identity_context, directoryExpected, `Directory ${person.id}`);
  }
  return mapped;
}
const raw = read('data/reference/people.json');
compareCatalog(raw);
compareCatalog(releasePeopleRoles(raw));

const king = kingdom => [{role: 'king', phrase: 'king of ' + kingdom}];
const rows = [
  {id: 'father', name: 'Father'}, {id: 'mother', name: 'Mother'},
  {id: 'k1', name: 'Joash', roles: king('Judah'), relations: {father: [{id: 'missing'}, {id: 'father'}]}},
  {id: 'k2', name: 'Joash', roles: king('Judah'), relations: {mother: [{id: 'mother'}]}},
  {id: 'k3', name: 'Joash', roles: king('Israel'), relations: {father: [{id: 'father'}]}},
  {id: 'unique', name: 'Unique', roles: king('Judah'), label: 'Unique (special)'},
  {id: 'label1', name: 'Label', label: 'Label (explicit)', relations: {father: [{id: 'father'}]}},
  {id: 'label2', name: 'Label', refs: [[0, 1, 1]]},
  {id: 'parent1', name: 'Parentless', relations: {mother: [{id: 'mother'}]}},
  {id: 'parent2', name: 'Parentless'},
  {id: 'unicode1', name: 'Éli', aliases: ['Elias'], roles: [{role: 'priest', phrase: 'priest'}]},
  {id: 'unicode2', name: 'Eli', roles: [{role: 'priest', phrase: 'priest'}], relations: {father: [{id: 'father'}]}},
  {id: 'punct1', name: 'Ab-ner', roles: king('Judah')},
  {id: 'punct2', name: 'Ab ner', roles: king('Israel')},
  {id: 'fallback1', name: 'Fallback', refs: [[0, 999, 1], [0, 1, 2]]},
  {id: 'fallback2', name: 'Fallback'},
];
const mapped = compareCatalog(rows);
assert.equal(workerContext.search.personLabel(rows.find(row => row.id === 'label2'), rows), 'Label (Genesis 1:1)', 'Server/offline worker marker injection');
const directory = id => mapped.find(row => row.id === id);
assert.equal(search.personLabel(rows.find(row => row.id === 'k1'), rows), 'Joash (King of Judah, child of Father)');
assert.equal(directory('k2').identity_context, 'King of Judah, child of Mother');
assert.equal(directory('k3').identity_context, 'King of Israel');
assert.equal(directory('unique').identity_context, undefined);
assert.equal(directory('label1').identity_context, 'explicit');
assert.equal(directory('parent1').identity_context, 'child of Mother');
assert.equal(directory('parent2').identity_context, '');
assert.equal(directory('unicode2').identity_context, 'Priest'); // exact-name role comparison
assert.equal(directory('punct1').identity_context, undefined); // directory retains punctuation
assert.equal(search.personLabel(rows.find(row => row.id === 'punct1'), rows), 'Ab-ner (King of Judah)');
assert.equal(directory('fallback1').identity_context, 'Genesis 1:2');
assert.equal(search.personLabel(rows.find(row => row.id === 'fallback1'), rows), 'Fallback (Genesis 999:1)');
assert.equal(createPeopleSearch(mapped)('Elias')[0].id, 'unicode1');
assert(search.catalogSearch(rows, 'people', 'Elias').some(row => row.id === 'unicode1'));
// Explicit invalidation refreshes the identity index after in-place catalog changes.
rows.find(row => row.id === 'father').name = 'Changed Father';
search.invalidateCatalog(rows);
assert.equal(search.personLabel(rows.find(row => row.id === 'k1'), rows), 'Joash (King of Judah, child of Changed Father)');
console.log(`PASS shared person identity: full and production catalogs (${raw.length} people each), classic script and lazy module, kings, parents, explicit labels, Unicode, aliases and distinct reference/normalization policies`);
