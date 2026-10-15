// Explicit network import only. Ordinary builds consume the checked-in snapshot.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const output = fileURLToPath(new URL('../data/reference/', import.meta.url));
const revision = '52e049efb3b95e4f1da52d11a3303fbd2d648922';
const base = `https://raw.githubusercontent.com/robertrouse/theographic-bible-metadata/${revision}/`;
const sources = {};
async function fetchSource(name, url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  const body = await response.text();
  sources[name] = {url, sha256: crypto.createHash('sha256').update(body).digest('hex'), bytes: Buffer.byteLength(body)};
  return body;
}
const [peopleText, versesText, naveXml, license, bibliography] = await Promise.all([
  fetchSource('people', base + 'json/people.json'),
  fetchSource('verses', base + 'json/verses.json'),
  fetchSource('nave', 'https://ccel.org/ccel/n/nave/bible.xml'),
  fetchSource('theographicLicense', base + 'LICENSE'),
  fetchSource('theographicBibliography', base + 'docs/data-source-bibliography.md')
]);
const books = JSON.parse(await fs.readFile(new URL('../data/books.json', import.meta.url), 'utf8'));
const bookIds = new Map(books.map(b => [b.code, b.id]));
// Match this project's zero-based book identifiers; references are [book, chapter, verse].
function verseRef(osis) {
  const match = /^(\w+)\.(\d+)\.(\d+)$/.exec(osis || '');
  if (!match || !bookIds.has(match[1])) return null;
  return [bookIds.get(match[1]), Number(match[2]), Number(match[3])];
}
const verses = new Map(JSON.parse(versesText).map(v => [v.id, {ref: verseRef(v.fields.osisRef), people: v.fields.people || []}]));
const verseKeys = new Set([...verses.values()].filter(v => v.ref).map(v => v.ref.join(':')));
const excludedTopicReferences = [];
const upstreamPeople = JSON.parse(peopleText);
const peopleIds = new Set(upstreamPeople.map(p => p.id));
const cleanText = text => String(text || '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const people = upstreamPeople.map(({id, fields: f}) => {
  const relations = {};
  for (const kind of ['father', 'mother', 'children']) {
    relations[kind] = (f[kind] || []).filter(target => peopleIds.has(target)).map(target => ({
      id: target,
      // Upstream links do not cite individual relationship assertions. These are
      // co-mention contexts only: consumers must verify support before answering.
      contextRefs: (f.verses || []).map(v => verses.get(v)).filter(v => v?.ref && v.people.includes(target)).slice(0, 12).map(v => v.ref)
    }));
  }
  return {id, name: f.name, label: f.displayTitle || f.name, aliases: [...new Set([f.name, ...(f.alsoCalled || '').split(',')].map(cleanText).filter(Boolean))],
    gender: f.gender || null, status: f.status || 'unknown', ambiguous: Boolean(f.ambiguous),
    refs: (f.verses || []).map(v => verses.get(v)?.ref).filter(Boolean).slice(0, 16), relations,
    source: `https://github.com/robertrouse/theographic-bible-metadata/blob/${revision}/json/people.json`, sourceRecord: f.slug || f.personLookup || id};
});
const topics = [];
for (const match of naveXml.matchAll(/<term\b([^>]*)>([\s\S]*?)<\/term>\s*<def\b[^>]*>([\s\S]*?)<\/def>/g)) {
  const anchor = /\bid="([^"]+)"/.exec(match[1])?.[1];
  if (!anchor) continue;
  const refs = [];
  for (const ref of match[3].matchAll(/<scripRef\b[^>]*\bparsed="\|([^"|]+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)"/g)) {
    const book = bookIds.get(ref[1]);
    if (book === undefined) continue;
    // Zero verse is an upstream chapter reference; retained, never made a verse.
    const tuple = [book, ...ref.slice(2).map(Number)];
    const [,chapter,verse,endChapter,endVerse] = tuple;
    const validPoint = (c,v) => c > 0 && c <= books[book].chapters && (v === 0 || verseKeys.has([book,c,v].join(':')));
    if (!validPoint(chapter,verse) || (endChapter && !validPoint(endChapter,endVerse)) || (endChapter && (endChapter < chapter || (endChapter === chapter && endVerse < verse)))) {
      excludedTopicReferences.push({topic: cleanText(match[2]), source: ref[0], ref: tuple});
      continue;
    }
    refs.push(tuple);
  }
  const related = [...match[3].matchAll(/<a\b[^>]*href="bible\.[a-z]+\.html[^\"]*"[^>]*>([\s\S]*?)<\/a>/g)].map(x => cleanText(x[1])).filter(Boolean);
  topics.push({id: anchor, label: cleanText(match[2]), refs: [...new Map(refs.map(r => [r.join(':'), r])).values()], related: [...new Set(related)], source: `https://ccel.org/ccel/nave/bible.${anchor.split('-')[0]}.html#${anchor}`});
}
assert(people.length > 3000, 'Theographic structure changed');
assert(topics.length > 5000, 'Nave structure changed');
const noah = people.find(p => p.sourceRecord === 'noah_2210');
assert(noah && people.find(p => p.id === noah.relations.father[0]?.id)?.name === 'Lamech');
assert(people.filter(p => p.name === 'Noah').length === 2, 'Preserve duplicate names');
assert(topics.some(t => t.label === 'LOVE' && t.refs.length > 0));
const notices = [
  {id: 'theographic', title: 'Theographic Bible Metadata', author: 'Robert Rouse / Viz.Bible and contributors', license: 'CC-BY-SA-4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', source: 'https://github.com/robertrouse/theographic-bible-metadata', attribution: 'Adapted from Theographic Bible Metadata by Robert Rouse / Viz.Bible and contributors, CC BY-SA 4.0. Names, relationships and passage tags also credit STEPBible TIPNR (CC BY 4.0), Marshall Genealogy, and Complete Bible Genealogy, as listed by the upstream bibliography. Changes: field selection, flattened identifiers, limited context references, numeric reference conversion. This adapted people dataset remains CC BY-SA 4.0.'},
  {id: 'nave', title: "Nave’s Topical Bible", author: 'Orville J. Nave', license: 'Public Domain', source: 'https://ccel.org/ccel/nave/bible.html', attribution: 'Topic headings and scripture references from Orville J. Nave, Nave’s Topical Bible (1896/1897), via Christian Classics Ethereal Library XML. CrossWire lists the underlying module as Public Domain. CCEL introductory/editorial text is excluded. Changes: extracted headings, reference deduplication and numeric conversion.'}
];
const provenance = {schema: 1, importedAt: new Date().toISOString(), revision, sources, counts: {people: people.length, topics: topics.length, topicReferences: topics.reduce((n,t)=>n+t.refs.length,0), excludedTopicReferences: excludedTopicReferences.length}, excludedTopicReferences, relationshipReferenceMeaning: 'contextRefs are upstream co-mention tags, not verified proof of a relationship. Father/mother/children links are upstream assertions. No spouse edges are supplied by this upstream schema.', classification: 'Third-party reference aids, separate from Claude research and Scripture Lens annotations.'};
await fs.mkdir(output, {recursive:true});
for (const [name, value] of Object.entries({people, topics, notices, provenance})) await fs.writeFile(output + name + '.json', JSON.stringify(value) + '\n');
await fs.writeFile(output + 'THEOGRAPHIC-LICENSE.txt', license);
await fs.writeFile(output + 'THEOGRAPHIC-SOURCES.md', bibliography);
console.log(JSON.stringify(provenance.counts));
