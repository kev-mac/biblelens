import fs from 'node:fs';

export function timelineCatalog(catalog, evidence) {
 const byId = new Map(evidence.map(record => [record.id, record]));
 const ids = new Set();
 const kinds = new Set(['possible-anachronism','conditional-date-conflict','succession-problem','identity-dependent-conflict']);
 return catalog.events.map(event => {
  if (!event.id || ids.has(event.id)) throw Error(`Duplicate or missing timeline ID: ${event.id}`);
  ids.add(event.id);
  const record = byId.get(event.evidence_id);
  if (!record) throw Error(`Missing timeline evidence: ${event.evidence_id}`);
  for (const field of ['title','traditional_date','reviewed','review_status']) {
   if (!event[field]?.trim()) throw Error(`Missing timeline ${field}: ${event.id}`);
  }
  if (event.discrepancy_kind && (!kinds.has(event.discrepancy_kind) || !event.academic_consensus?.trim())) throw Error(`Invalid timeline discrepancy: ${event.id}`);
  if (!event.discrepancy_kind && event.academic_consensus) throw Error(`Unflagged academic comparison: ${event.id}`);
  const sources = [...record.sources, ...(event.additional_sources || [])];
  for (const source of sources) {
   if (!source.label || new URL(source.url).protocol !== 'https:') throw Error(`Invalid timeline source: ${event.id}`);
  }
  return {...event, ref:record.ref, summary:record.summary, scope:record.scope, sources,
   discrepancy:event.discrepancy_kind ? {
    academic_label:'Academic evidence', academic_consensus:event.academic_consensus,
    kind:event.discrepancy_kind.replaceAll('-', ' '), summary:record.summary, scope:record.scope, sources
   } : null};
 });
}

export function loadTimelineCatalog() {
 const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
 const catalog = read('data/timeline-events.json');
 const books = read('data/books.json');
 const events = timelineCatalog(catalog, read('data/evidence.json')).map(event => {
  const match = /^(.*?) (\d+):(\d+)$/.exec(event.ref);
  const book = match && books.find(book => book.name === match[1]);
  if (!book) throw Error(`Invalid timeline passage: ${event.ref}`);
  return {...event, passage_href:`#read/${book.id}/${match[2]}/${match[3]}`};
 });
 return {...catalog, events};
}
