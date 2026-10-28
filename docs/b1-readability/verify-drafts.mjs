import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assess, collections, draftCollections, report, words } from '../../scripts/check-readability.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, '../..');
const read = name => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8'));
const source = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
const longSentences = text => [...segmenter.segment(text)].filter(part => words(part.segment).length > 20);
const evidence = read('evidence.json');
const stories = read('stories.json');
const people = read('people.json');
const rules = read('scope-rules.json');
const overrides = read('field-overrides.json');
const evidenceSource = source('data/evidence.json');
const storySource = source('data/stories.json').flatMap(book => book.stories.map(row => ({
  id: `${slug(book.book)}-${slug(row.title)}`, book: book.book, title: row.title, passage: row.passage, original: row.summary,
})));
const peopleSource = source('src/data/characters.json').map(row => ({ id: row.id, name: row.name, original: row.summary }));
const escape = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '&#124;').replace(/\r?\n/g, '<br>');

// Every replacement is an explicit sentence or field pair, not a broad synonym rule.
for (const rule of [...rules, ...overrides]) {
  assert.equal(rule.reviewStatus, 'draft, unverified');
  assert.equal(typeof rule.meaningCheck, 'string');
  assert.equal(longSentences(rule.draft).length, 0, `Long replacement: ${rule.id}`);
  assert(!assess(rule.draft).unexplained, `Unexplained replacement jargon: ${rule.id}`);
}
for (const [draftRows, sourceRows, label] of [[stories, storySource, 'Stories'], [people, peopleSource, 'People']]) {
  assert.equal(draftRows.length, sourceRows.length, label);
  assert.equal(new Set(draftRows.map(row => row.id)).size, draftRows.length, label);
  for (let i = 0; i < draftRows.length; i++) {
    const row = draftRows[i];
    for (const [key, value] of Object.entries(sourceRows[i])) assert.equal(row[key], value, `${row.id}: ${key}`);
    assert.equal(row.reviewStatus, 'draft, unverified', row.id);
    assert.equal(longSentences(row.draft).length, 0, row.id);
    assert(!assess(row.draft).unexplained, row.id);
    assert.deepEqual(row.draft.match(/\d+/g) || [], row.original.match(/\d+/g) || [], row.id);
  }
}
assert.equal(evidence.length, evidenceSource.length);
assert.equal(new Set(evidence.map(row => row.id)).size, evidence.length);
for (let i = 0; i < evidence.length; i++) {
  const row = evidence[i];
  const original = evidenceSource[i];
  assert.equal(row.id, original.id);
  assert.equal(row.reviewStatus, 'draft, unverified');
  assert.deepEqual(row.sources, original.sources || []);
  for (const field of ['summary', 'reasoning', 'scope']) {
    if (typeof original[field] !== 'string') continue;
    if(row.meaningHolds?.[field])assert.equal(row.draft[field],row.original[field],`${row.id}: a meaning hold must retain its supplied field`);
    assert.equal(row.original[field], original[field], `${row.id}: stale ${field}`);
    let expected = original[field];
    for (const rule of [...rules].sort((a, b) => b.original.length - a.original.length)) {
      expected = expected.split(rule.original).join(rule.draft);
    }
    const manual = overrides.find(item => item.id === row.id && item.field === field);
    if (manual) expected = manual.draft;
    assert.equal(row.draft[field], expected, `${row.id}: unaudited rewrite`);
    const result = assess(row.draft[field]);
    if (result.tooLong || longSentences(row.draft[field]).length || result.unexplained) {
      assert(row.flags.some(flag => flag.startsWith(`${field}:`)), `${row.id}: hidden unresolved ${field}`);
    }
  }
  for (const label of ['Greek edition 1', 'Greek edition 2']) {
    if (Object.values(row.draft).some(value => value.includes(label))) assert(row.sourceEditionNames[label], `${row.id}: missing source alias`);
  }
}

const changedEvidence = evidence.filter(row => Object.keys(row.original).some(field => row.original[field] !== row.draft[field]));
const changes = evidence.flatMap(row => Object.keys(row.original).filter(field => row.original[field] !== row.draft[field] || row.meaningHolds?.[field]).map(field => ({
  id: row.id, title: row.title, field, original: row.original[field], draft: row.draft[field],
  meaning: (row.meaningHolds?.[field] ? row.meaningHolds[field] + ' ' : '') + row.appliedRules.filter(item => item.field === field).map(item => {
    const manual = overrides.find(candidate => `manual:${candidate.id}:${candidate.field}` === item.rule);
    return manual?.meaningCheck || rules.find(rule => rule.id === item.rule)?.meaningCheck;
  }).filter(Boolean).join(' '),
  remaining: row.flags.filter(flag => flag.startsWith(`${field}:`)).join(' '),
})));
const markdown = (title, rows) => [
  `# ${title}`, '', 'Drafts only. No row is accepted. Exact original text is beside each proposal.', '',
  '| ID / field | Original | Draft | Meaning check | Remaining hold |',
  '| --- | --- | --- | --- | --- |',
  ...rows.map(row => `| ${escape(row.id)} / ${escape(row.field)} | ${escape(row.original)} | ${escape(row.draft)} | ${escape(row.meaning)} | ${escape(row.remaining || 'Await owner acceptance.')} |`), '',
].join('\n');
const textFiles = {
  'meaning-checks-evidence.md': markdown('B1 Evidence meaning checks', changes),
  'meaning-checks-stories.md': markdown('B1 Stories meaning checks', stories.map(row => ({...row,field:'summary',meaning:row.flags.join(' ') || 'Compare names, actions, order, quantities, attribution, and stated limits. No separate sensitive-meaning flag.',remaining:row.flags.length ? 'Existing meaning flag remains open.' : ''}))),
  'meaning-checks-people.md': markdown('B1 People meaning checks', people.map(row => ({...row,field:'summary',meaning:row.flags.join(' ') || 'Compare relationships, actions, order, attribution, and stated limits. No separate sensitive-meaning flag.',remaining:row.flags.length ? 'Existing meaning flag remains open.' : ''}))),
  'outstanding-evidence.md': [
    '# B1 Evidence: remaining sentence-level work', '',
    'These records are held. Existing wording remains wherever no explicit safe replacement was drafted.',
    'This list does not ask the owner to waive the writing standard. Default: keep held while editors finish the wording.', '',
    '| ID | Passage | Remaining work |', '| --- | --- | --- |',
    ...evidence.filter(row=>row.flags.length).map(row=>`| ${escape(row.id)} | ${escape(row.ref)} | ${escape(row.flags.join(' '))} |`), '',
  ].join('\n'),
};
if (process.argv.includes('--write-tables')) {
  for (const [name, content] of Object.entries(textFiles)) fs.writeFileSync(path.join(directory, name), content);
} else {
  for (const [name, content] of Object.entries(textFiles)) assert.equal(fs.readFileSync(path.join(directory, name), 'utf8'), content, `Stale table: ${name}`);
}
const summary = {
  changedEvidenceRecords: changedEvidence.length,
  changedEvidenceFields: changes.filter(row=>row.original!==row.draft).length,
  meaningTableFields: changes.length,
  evidenceRecords: evidence.length,
  heldEvidenceRecords: evidence.filter(row=>row.flags.length).length,
  stories: stories.length,
  people: people.length,
  oldMeaningFlags: {stories:stories.filter(row=>row.flags.length).length, people:people.filter(row=>row.flags.length).length},
};
console.log('PASS: original text, metadata, IDs, draft flags, exact transformations, source aliases, and meaning tables.');
console.log('PASS: every new replacement and all People/Stories draft sentences are at most 20 words.');
console.log(JSON.stringify(summary, null, 2));
console.log('\nAccepted collections (unchanged):');
report(collections());
console.log('\nDraft collections:');
report(draftCollections());
console.log('\nEvidence remains incomplete: flagged original sentences must be rewritten before any acceptance or integration.');
