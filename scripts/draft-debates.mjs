import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const segmenter = new Intl.Segmenter('en', {granularity: 'sentence'});
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

// The switch is build-time only. Query strings and local storage cannot enable
// draft data in a normal build. Never ship a preview through a production build.
export function draftPreviewEnabled(env = process.env) {
  if (env.BIBLELENS_DRAFTS && !['0', '1'].includes(env.BIBLELENS_DRAFTS)) throw Error('BIBLELENS_DRAFTS must be 0 or 1');
  if (env.BIBLELENS_DRAFTS === '1' && env.NODE_ENV === 'production') throw Error('Draft previews are forbidden in production builds');
  return env.BIBLELENS_DRAFTS === '1';
}

export function loadDraftDebates(root = process.cwd()) {
  const read = file => json(path.join(root, file));
  const headline = read('research/headline-debates/candidates.json');
  const presentation = read('research/phase3-preview/presentation.json');
  const ledger = new Map(read('research/verdict-ledger/ledger.json').map(row => [row.id, row]));
  const records = new Map(read('data/evidence.json').map(row => [row.id, row]));
  const chapters = read('data/chapters.json');
  const books = read('data/books.json');
  const cache = new Map();
  if (!headline.draft_only || !presentation.draft_only || presentation.review_status !== 'draft') throw Error('Phase 3 requires draft flags');
  if (headline.candidates.length !== 40 || headline.candidates.filter(row => row.recommended).length !== 30) throw Error('Headline draft count changed');
  const reference = ref => {
    const match = /^(.+) (\d+):(\d+)(?:[-–](\d+))?$/.exec(ref);
    const book = match && books.find(row => row.name === match[1]);
    const key = book && `${book.id}:${Number(match[2])}`;
    if (!key || !chapters[key]) throw Error('Missing draft passage: ' + ref);
    if (!cache.has(key)) cache.set(key, JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key], 'base64'))));
    const first = Number(match[3]), last = Number(match[4] || first), verses = [];
    for (let verse = first; verse <= last; verse++) {
      const text = cache.get(key).verses.find(row => row.n === verse)?.kjv;
      if (!text) throw Error('Missing verse in draft passage: ' + ref);
      verses.push({number: verse, text: text.replace(/\{[HG]\d+\}/g, '')});
    }
    return {ref, href: `#read/${book.id}/${Number(match[2])}/${first}`, verses};
  };
  const candidates = headline.candidates.map(candidate => {
    const sourceRecords = candidate.source_record_ids.map(id => {
      const record = records.get(id), proposal = ledger.get(id);
      const original = candidate.record_provenance.find(row => row.id === id);
      if (!record || !proposal || !original) throw Error('Missing draft source: ' + id);
      for (const [a,b] of [[record.mode, original.mode], [record.status, original.status], [record.scope, original.scope_verbatim], [record.checked, original.checked]]) {
        if (!same(a,b)) throw Error('Draft source needs re-review: ' + id);
      }
      if (proposal.current_status !== record.status || proposal.mode !== record.mode) throw Error('Verdict source changed: ' + id);
      return {id, ref: record.ref, title: record.title, status: record.status, scope: record.scope,
        text: record.text, reasoning: record.reasoning, fields: record.fields || [], proposal};
    });
    const sentences = [...segmenter.segment(candidate.summary_60_seconds)].map(row => row.segment.trim());
    const pairs = presentation.cases[candidate.id];
    if (!pairs || pairs.length !== 2 || pairs.some(indices => !indices.length || indices.some(index => !Number.isInteger(index) || !sentences[index]))) throw Error('Invalid case excerpts: ' + candidate.id);
    const sources = candidate.source_record_ids.flatMap(id => {
      const record = records.get(id); return [...(record.sources || []), ...(record.fields || []).flatMap(field => field.sources || [])];
    }).filter((source,index,all) => all.findIndex(other => other.url === source.url) === index);
    return {...candidate, review_status: 'draft', evidence_tier: presentation.evidence_tier,
      side_a: {...candidate.side_a, passages: candidate.side_a.kjv_refs.map(reference), case: pairs[0].map(index => sentences[index])},
      side_b: {...candidate.side_b, passages: candidate.side_b.kjv_refs.map(reference), case: pairs[1].map(index => sentences[index])},
      context: (candidate.context_kjv_refs || []).map(reference), sourceRecords, sources};
  });
  return {draft_only: true, review_status: 'draft', candidates, source_commits: {
    headlines: presentation.headline_source_commit, verdicts: presentation.verdict_source_commit}};
}

export function packageDraftDebates(assets, env = process.env) {
  if (!draftPreviewEnabled(env)) return false;
  const payload = loadDraftDebates();
  const source = fs.readFileSync('src/draft-debates.js', 'utf8').replace('/*__DRAFT_DEBATES__*/{}', () => JSON.stringify(payload));
  assets['/debates.js'].body = source + '\n' + assets['/debates.js'].body;
  assets['/overrides.css'].body += '\n' + fs.readFileSync('src/draft-debates.css', 'utf8');
  // A small discovery link is compiled only into the explicit draft preview.
  const target = '<div class="phase2-tools">';
  if (!assets['/atlas-explore.js'].body.includes(target)) throw Error('Missing Explore draft entry point');
  assets['/atlas-explore.js'].body = assets['/atlas-explore.js'].body.replace(target, target + '<a class="phase3-preview-link" href="#debates?draft=1">Preview draft debates</a>');
  console.log('DRAFT PREVIEW: 40 headlines; proposed verdicts await Kevin. Not a production build.');
  return true;
}
