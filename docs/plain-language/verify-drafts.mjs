import fs from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { assess, report, words } from './check-readability.mjs';

export const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, '../..');
export const sourceCommit = '346bdfd173bb04d54745cd2164a23b9bf905eadd';
export const standardCommit = '8e2cd1b87419d909e9bcc54a7d822fd9052447d5';
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const archivalRead=file=>execFileSync('git',['show',`${sourceCommit}:${file}`],{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024});
const sourceCards = [...archivalRead('src/atlas-explore.js').matchAll(/\{route:'([^']+)'.*?title:'([^']+)'.*?copy:'([^']+)'/g)]
  .map(([, id, title, original]) => ({ id, title, original }));
const cardDrafts = [...read('docs/plain-language/explore-cards.md').matchAll(/^## (\S+) — ([^\n]+)\n\n\*\*Original:\*\* ([^\n]+)\n\n\*\*Draft:\*\* ([^\n]+)\n\n\*\*Meaning flag:\*\* ([^\n]+)/gm)]
  .map(([, id, title, original, draft, flag]) => ({ id, title, original, draft, flags: flag === 'None.' ? [] : [flag] }));

export const groups = [
  { name: 'Explore cards', count: 8, blurb: true, records: cardDrafts, source: sourceCards },
  { name: 'Stories', count: 276, file: 'stories', records: json('docs/plain-language/stories.json'),
    source: JSON.parse(archivalRead('data/stories.json')).flatMap(book => book.stories.map(story => ({
      id: `${slug(book.book)}-${slug(story.title)}`, book: book.book,
      title: story.title, passage: story.passage, original: story.summary,
    }))) },
  { name: 'People', count: 47, file: 'people', records: json('docs/plain-language/people.json'),
    source: JSON.parse(archivalRead('src/data/characters.json')).map(person => ({ id: person.id, name: person.name, original: person.summary })) },
];

export function statistics(group, field) {
  const results = group.records.flatMap(row => row[field].split(/\r?\n/).filter(line => line.trim()))
    .map(line => assess(line, group));
  const grades = results.map(result => result.grade).filter(grade => grade !== null);
  return {
    grade: grades.reduce((a, b) => a + b, 0) / grades.length,
    long: results.filter(result => result.tooLong).length,
    jargon: results.filter(result => result.unexplained).length,
    flags: group.records.filter(row => row.flags.length).length,
  };
}

export function markdown(group) {
  const source = group.file === 'stories' ? 'data/stories.json' : 'src/data/characters.json';
  const lines = [`# ${group.name} — plain-language drafts`, '',
    `Drafts only. ${group.count} summaries from \`${source}\`. Originals are copied verbatim.`, '',
    'Grades use the unchanged checker from the writing-standard branch. Flags identify meaning-sensitive wording for review.', ''];
  for (const row of group.records) {
    lines.push(`## ${row.id} — ${row.title || row.name}`, '');
    if (row.passage) lines.push(`**Passage:** ${row.passage}`, '');
    lines.push(`**Original:** ${row.original}`, '', `**Draft:** ${row.draft}`, '',
      `**Estimated FK grade:** ${assess(row.original).grade.toFixed(2)} → ${assess(row.draft).grade.toFixed(2)}`, '',
      `**Meaning flag:** ${row.flags.length ? row.flags.join(' ') : 'None.'}`, '');
  }
  return lines.join('\n');
}

export function verify() {
  for(const [file,expected]of Object.entries(json('docs/plain-language/current-sources.json').sha256))assert.equal(createHash('sha256').update(read(file)).digest('hex'),expected,file+': current source drift');
  assert.equal(read('docs/plain-language/check-readability.mjs'), execFileSync('git', [
    'show', `${standardCommit}:scripts/check-readability.mjs`,
  ], { cwd: root, encoding: 'utf8' }), 'Readability logic must remain a verbatim copy');
  for (const group of groups) {
    assert.equal(group.records.length, group.count, group.name);
    assert.equal(group.source.length, group.count, group.name);
    assert.equal(new Set(group.records.map(row => row.id)).size, group.count, `${group.name}: duplicate IDs`);
    for (const [index, row] of group.records.entries()) {
      const source = group.source[index];
      for (const [key, value] of Object.entries(source)) assert.equal(row[key], value, `${row.id}: changed ${key}`);
      assert.equal(typeof row.draft, 'string', row.id);
      assert(row.draft.trim() && row.draft !== row.original, `${row.id}: missing rewrite`);
      assert(Array.isArray(row.flags) && row.flags.every(flag => typeof flag === 'string' && flag.trim()), row.id);
      assert.deepEqual(row.draft.match(/\d+/g) || [], row.original.match(/\d+/g) || [], `${row.id}: changed digits`);
      const result = assess(row.draft, group);
      assert(!result.tooLong, `${row.id}: length limit`);
      assert(!result.unexplained, `${row.id}: screened jargon`);
      // Also check full draft sentences: no newly quoted text may hide a long sentence.
      for (const sentence of new Intl.Segmenter('en', { granularity: 'sentence' }).segment(row.draft)) {
        assert(words(sentence.segment).length <= 20, `${row.id}: full sentence over 20 words`);
      }
      if (group.blurb) assert(words(row.draft).length <= 15, `${row.id}: full blurb over 15 words`);
    }
    const before = statistics(group, 'original');
    const after = statistics(group, 'draft');
    const tableRow = `| ${group.name} | ${group.count} | ${before.grade.toFixed(2)} | ${after.grade.toFixed(2)} | ${before.long} | ${after.long} | ${before.jargon} | ${after.jargon} | ${after.flags} |`;
    assert(read('docs/plain-language/README.md').includes(tableRow), `${group.name}: stale README results`);
    assert(after.grade >= 6 && after.grade <= 8, `${group.name}: average outside grades 6–8`);
    if (group.file) assert.equal(read(`docs/plain-language/${group.file}.md`), markdown(group), `${group.name}: Markdown/JSON mismatch`);
  }
  console.log('PASS: 331 unique pairs; exact source text, IDs and metadata; unchanged readability logic; Markdown/JSON agreement.');
  console.log('PASS: digit preservation, full sentence/card limits, screened jargon and collection averages; current source hashes pinned separately from archival originals.');
  console.log('\nBefore:');
  report(groups.map(group => ({ ...group, lines: group.records.map(row => row.original) })));
  console.log('\nAfter:');
  report(groups.map(group => ({ ...group, lines: group.records.map(row => row.draft) })));
  console.log('\nFlagged items: ' + groups.map(group => `${group.name}: ${statistics(group, 'draft').flags}`).join('; '));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) verify();
