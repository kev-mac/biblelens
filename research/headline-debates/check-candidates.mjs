import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { assess, words, report } from './tools/check-readability.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, '../..');
const read = name => fs.readFileSync(path.join(root, name));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const draftPath = path.join(directory, 'candidates.json');
const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
const records = new Map(JSON.parse(read('data/evidence.json')).map(record => [record.id, record]));
const chapters = JSON.parse(read('data/chapters.json'));
const chapterCache = new Map();
const bookIndex = new Map();
for (const key of Object.keys(chapters).filter(key => key.endsWith(':1'))) {
  const chapter = JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key], 'base64')));
  bookIndex.set(chapter.name, chapter.book);
}
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
check(hash(read('data/evidence.json')) === draft.evidence_sha256, 'Evidence differs from the pinned draft source.');
check(hash(read('data/chapters.json')) === draft.kjv_sha256, 'Packaged KJV differs from the pinned draft source.');
check(hash(fs.readFileSync(path.join(directory, 'tools/check-readability.mjs'))) === draft.readability_script_sha256,
  'The copied readability checker differs from the pinned standard.');
check(draft.draft_only === true, 'Draft-only marker is required.');
check(draft.candidates.length === 40, 'Expected 40 candidates.');
check(draft.candidates.filter(c => c.recommended).length === 30, 'Expected 30 recommended candidates.');
const candidateIds = new Set();
const sourceIds = new Set();
const verseKeys = new Set();
const refStrings = new Set();
const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });

function checkRef(ref, candidate) {
  refStrings.add(ref);
  const match = ref.match(/^(.+) (\d+):(\d+)(?:[-–](\d+))?$/);
  if (!match || !bookIndex.has(match[1])) {
    errors.push(`${candidate.id}: invalid KJV reference ${ref}`);
    return;
  }
  const book = bookIndex.get(match[1]);
  const chapterNumber = Number(match[2]);
  const first = Number(match[3]);
  const last = Number(match[4] || match[3]);
  const key = `${book}:${chapterNumber}`;
  if (!chapterCache.has(key) && chapters[key]) {
    chapterCache.set(key, JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key], 'base64'))));
  }
  const chapter = chapterCache.get(key);
  check(first <= last, `${candidate.id}: reversed range ${ref}`);
  for (let verse = first; verse <= last; verse++) {
    check(Boolean(chapter?.verses.find(v => v.n === verse)?.kjv), `${candidate.id}: missing KJV verse in ${ref}`);
    verseKeys.add(`${key}:${verse}`);
  }
  candidate.testaments ??= [];
  const testament = book < 39 ? 'Old Testament' : 'New Testament';
  if (!candidate.testaments.includes(testament)) candidate.testaments.push(testament);
}

function fields(c) {
  return [c.question, c.side_a.label, c.side_b.label, c.summary_60_seconds,
    c.what_would_settle_it, c.why_selected,
    c.side_a.reference_note, c.side_b.reference_note].filter(Boolean);
}

const metrics = [];
for (const candidate of draft.candidates) {
  const c = candidate;
  check(!candidateIds.has(c.id), `Duplicate candidate ID ${c.id}`);
  candidateIds.add(c.id);
  check(c.question.endsWith('?'), `${c.id}: title must be a question.`);
  check(c.source_record_ids.length > 0, `${c.id}: missing record IDs.`);
  check(c.sources.length > 0, `${c.id}: missing source links.`);
  check(c.side_a.kjv_refs.length > 0, `${c.id}: side A needs a KJV reference.`);
  check(c.side_b.kjv_refs.length > 0 || c.comparison === 'text-vs-science', `${c.id}: side B needs KJV references.`);
  check(c.side_b.kjv_refs.length > 0 || Boolean(c.side_b.reference_note), `${c.id}: explain external side B.`);
  check(!c.what_would_settle_it.includes('\n'), `${c.id}: scope test must be one line.`);
  c.testaments = [];
  for (const ref of [...c.side_a.kjv_refs, ...c.side_b.kjv_refs, ...(c.context_kjv_refs || [])]) checkRef(ref, c);
  const expectedMode = { 'text-vs-text': 'contradictions', 'text-vs-science': 'science', 'text-vs-history': 'history' }[c.comparison];
  const availableSources = new Set();
  for (const id of c.source_record_ids) {
    const source = records.get(id);
    check(Boolean(source), `${c.id}: unknown record ${id}`);
    if (!source) continue;
    check(!sourceIds.has(id), `${c.id}: source reused in another candidate: ${id}`);
    sourceIds.add(id);
    check(source.mode === expectedMode, `${c.id}: comparison mode mismatch.`);
    check(source.status === c.current_status, `${c.id}: current status mismatch.`);
    const provenance = c.record_provenance.find(p => p.id === id);
    check(provenance?.scope_verbatim === source.scope && provenance?.checked === source.checked
      && provenance?.status === source.status && provenance?.mode === source.mode, `${c.id}: provenance mismatch.`);
    for (const s of [...source.sources, ...(source.fields || []).flatMap(f => f.sources || [])]) {
      availableSources.add(JSON.stringify(s));
    }
  }
  for (const source of c.sources) check(availableSources.has(JSON.stringify(source)), `${c.id}: source not in record.`);
  const eligible = ['Textual conflict', 'Agrees', 'Disagrees'].includes(c.current_status);
  check(eligible === c.meets_status_filter, `${c.id}: status filter marker mismatch.`);
  check(!c.recommended || eligible, `${c.id}: recommended candidate fails the status filter.`);
  const prose = fields(c);
  for (const text of prose) {
    const result = assess(text);
    check(!result.tooLong, `${c.id}: sentence exceeds 20 words: ${text}`);
    check(!result.unexplained, `${c.id}: unexplained screened jargon: ${text}`);
  }
  const count = words(c.summary_60_seconds).length;
  const summary = assess(c.summary_60_seconds);
  const full = assess(prose.map(p => /[.!?]$/.test(p) ? p : `${p}.`).join(' '));
  check(count >= 120 && count <= 150, `${c.id}: summary has ${count} words.`);
  check(summary.grade >= 5 && summary.grade <= 8.9, `${c.id}: summary grade ${summary.grade.toFixed(2)}.`);
  check(full.grade >= 5 && full.grade <= 8.9, `${c.id}: combined prose grade ${full.grade.toFixed(2)}.`);
  const maxSentence = Math.max(...prose.flatMap(p => [...segmenter.segment(p)].map(s => words(s.segment).length)));
  metrics.push({ id: c.id, summary_words: count, summary_grade: Number(summary.grade.toFixed(2)),
    combined_prose_grade: Number(full.grade.toFixed(2)), maximum_sentence_words: maxSentence });
}

const types = ['text-vs-text', 'text-vs-science', 'text-vs-history'];
const groups = types.map(type => ({ name: type, lines: draft.candidates.filter(c => c.comparison === type).map(c => c.summary_60_seconds) }));
const collectionFailure = report(groups);
const averages = groups.map(g => g.lines.reduce((sum, line) => sum + assess(line).grade, 0) / g.lines.length);
check(averages.every(a => a >= 6 && a <= 8), 'Summary collection averages must be grade 6–8.');
check(!collectionFailure, 'Readability standard collection check failed.');
if (errors.length) {
  console.error('\n' + errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`\nPASS: 40 candidates; 30 recommendations; ${sourceIds.size} distinct source records.`);
  console.log(`KJV: ${refStrings.size} distinct references, resolving to ${verseKeys.size} verses.`);
  console.log(`Summary grades ${Math.min(...metrics.map(m => m.summary_grade))}–${Math.max(...metrics.map(m => m.summary_grade))}.`);
  console.log('Every summary and combined candidate prose block is grade 5–8.9; no long sentences or screened jargon.');
}

if (process.argv.includes('--write') && !errors.length) {
  draft.readability = {
    command: 'npm --prefix research/headline-debates run check:readability',
    note: 'FK uses the copied standard. Short labels are checked for sentence length and jargon, not individual grade.',
    scope: 'Summaries and combined drafted candidate prose. Scripture references, source titles and verbatim record scopes are excluded.',
    collection_averages: Object.fromEntries(types.map((type, i) => [type, Number(averages[i].toFixed(2))])),
    results: metrics,
    unexplained_jargon_lines: 0,
    overlength_sentences: 0
  };
  draft.kjv_reference_verification = { distinct_references: refStrings.size, distinct_verses: verseKeys.size, source: 'data/chapters.json' };
  draft.mix = Object.fromEntries(types.map(type => [type, {
    candidates: draft.candidates.filter(c => c.comparison === type).length,
    recommended: draft.candidates.filter(c => c.comparison === type && c.recommended).length
  }]));
  fs.writeFileSync(draftPath, JSON.stringify(draft, null, 2) + '\n');
  const lines = ['# Headline debate candidates', '', '**Draft only — 40 candidates, 30 recommended.**', '',
    ...draft.editorial_notes.map(note => `- ${note}`), '',
    `Source snapshot: \`${draft.base_commit}\`. Readability standard: \`${draft.readability_standard_commit}\`.`, '',
    '| Comparison | Candidates | Recommended | Average summary grade |', '| --- | ---: | ---: | ---: |',
    ...types.map((type, i) => `| ${type} | ${draft.mix[type].candidates} | ${draft.mix[type].recommended} | ${averages[i].toFixed(2)} |`), '',
    'The four Context reserves are Judas’s death, tomb-morning timing, Joseph’s father and the animals/man creation order.', '',
    'The remaining six reserves meet the status filter. Their selection notes explain the editorial tradeoffs.', '',
    `Readability: all summaries contain 120–150 words. Summary grades range from ${Math.min(...metrics.map(m => m.summary_grade))} to ${Math.max(...metrics.map(m => m.summary_grade))}.`,
    'Each summary and combined prose block meets grade 5–8.9. Every summary collection averages grade 6–8.',
    'No drafted sentence exceeds 20 words. No screened jargon remains unexplained.', '',
    `KJV check: ${refStrings.size} references resolve to ${verseKeys.size} verses in the packaged text.`, '',
    'Run `npm --prefix research/headline-debates run check:readability` from the worktree root.',
    'The local package runs the copied standard against these drafts. The root package has no readability command.', '',
    'Source scopes in JSON are preserved verbatim for review and excluded from drafted-prose scores.', '',
    '## Shortlist', '', '| # | Selection | Question | Comparison | Current status |', '| ---: | --- | --- | --- | --- |',
    ...draft.candidates.map(c => `| ${c.number} | ${c.selection} | [${c.question}](#candidate-${c.number}) | ${c.comparison} | ${c.current_status} |`), ''];
  for (const c of draft.candidates) {
    const metric = metrics.find(m => m.id === c.id);
    lines.push(`<a id="candidate-${c.number}"></a>`, '', `## ${c.number}. ${c.question}`, '',
      `**${c.selection} · ${c.comparison} · Current status: ${c.current_status}**`, '', c.status_note, '');
    for (const [key, label] of [['side_a', 'Side A'], ['side_b', 'Side B']]) {
      const side = c[key];
      lines.push(`**${label}: ${side.label}.** KJV: ${side.kjv_refs.join('; ') || 'None — external scientific evidence'}.`);
      if (side.reference_note) lines.push(side.reference_note);
      lines.push('');
    }
    if (c.context_kjv_refs?.length) lines.push(`**KJV context:** ${c.context_kjv_refs.join('; ')}.`, '');
    lines.push('**60-second summary**', '', c.summary_60_seconds, '',
      `**What would settle it:** ${c.what_would_settle_it}`, '', `**Why it made the list:** ${c.why_selected}`, '',
      `**Readability:** ${metric.summary_words} summary words; FK ${metric.summary_grade}; combined prose FK ${metric.combined_prose_grade}.`, '',
      '**Record trail:**', '', ...c.record_provenance.map(p => `- [data/evidence.json](../../data/evidence.json) · \`${p.id}\` · ${p.status} · checked ${p.checked}`), '',
      '**Sources from the record:**', '', ...c.sources.map(s => `- [${s.label}](${s.url})`), '');
  }
  fs.writeFileSync(path.join(directory, 'candidates.md'), lines.join('\n'));
}
