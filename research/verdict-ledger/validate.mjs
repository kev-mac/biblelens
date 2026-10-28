import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { baseline, countsTable, directory, loadEvidence, makeLedger, makeReadme, read,
  requiredRuling, source, verdicts } from './draft.mjs';

export function validate(records, ledger, decisions) {
  assert.equal(records.length, source.records, 'Source count changed');
  assert.equal(ledger.length, records.length, 'Ledger count differs from source');
  const sourceIds = new Set(records.map(row => row.id));
  const ledgerIds = new Set(ledger.map(row => row.id));
  assert.equal(sourceIds.size, records.length, 'Duplicate source ID');
  assert.equal(ledgerIds.size, ledger.length, 'Duplicate ledger ID');
  assert.deepEqual([...ledgerIds].sort(), [...sourceIds].sort(), 'Missing or unknown ledger IDs');
  const choices = new Map(decisions.map(row => [row.id, row]));
  assert.equal(choices.size, decisions.length, 'Duplicate decision ID');
  for (const id of choices.keys()) assert(sourceIds.has(id), `Unknown decision ID: ${id}`);
  const fields = ['id', 'mode', 'ref', 'title', 'current_status', 'proposed_verdict', 'changed',
    'reason', 'needs_owner_ruling', 'notes'];
  for (const [index, row] of ledger.entries()) {
    const record = records[index];
    assert.deepEqual(Object.keys(row), fields, `Ledger shape: ${row.id}`);
    assert.equal(row.id, record.id, 'Source order changed');
    for (const field of ['mode', 'ref']) assert.equal(row[field], record[field], `${row.id}.${field}`);
    assert.equal(row.title, record.title ?? null, `Title changed: ${row.id}`);
    assert.equal(row.current_status, record.status, `Status changed: ${row.id}`);
    const allowed = ['science', 'history'].includes(row.mode) ? verdicts.slice(4, 7)
      : row.mode === 'commandments' ? ['Instruction in context', ...verdicts.slice(0, 4)] : verdicts.slice(0, 4);
    assert(allowed.includes(row.proposed_verdict), `Wrong verdict for mode: ${row.id}`);
    assert.equal(typeof row.changed, 'boolean');
    assert.equal(row.changed, row.proposed_verdict !== baseline(record), `Wrong changed flag: ${row.id}`);
    assert.equal(typeof row.needs_owner_ruling, 'boolean');
    if (requiredRuling(record, row.proposed_verdict)) assert(row.needs_owner_ruling, `Missing owner flag: ${row.id}`);
    assert.equal(typeof row.reason, 'string');
    assert(row.reason.trim(), `Empty reason: ${row.id}`);
    assert(Array.isArray(row.notes) && row.notes.every(note => typeof note === 'string'), `Bad notes: ${row.id}`);
    const choice = choices.get(row.id);
    if (row.changed || choice?.owner_notes.length) {
      assert(choice?.evidence.length, `Missing evidence for decision: ${row.id}`);
      assert(/\b(summary|reasoning|scope|text|status)\b/.test(row.reason), `Reason needs field citation: ${row.id}`);
    }
    if (choice) {
      assert.equal(row.proposed_verdict, choice.proposed_verdict, `Decision differs: ${row.id}`);
      for (const { field, quote } of choice.evidence) {
        assert(['summary', 'reasoning', 'scope', 'text', 'status'].includes(field), `Unknown cited field: ${row.id}`);
        assert(quote.trim() && record[field]?.includes(quote), `Quote not in ${row.id}.${field}`);
      }
      if (choice.owner_notes.length) assert(row.needs_owner_ruling, `Field issue lacks flag: ${row.id}`);
    }
  }
  assert.deepEqual(ledger, makeLedger(records, decisions), 'Ledger is stale or differs from decisions');
  return true;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const records = loadEvidence();
  const ledger = read('ledger.json');
  validate(records, ledger, read('decisions.json'));
  assert.equal(fs.readFileSync(path.join(directory, 'README.md'), 'utf8'), makeReadme(ledger), 'README is stale');
  console.log(`PASS: ${ledger.length} source IDs occur exactly once; source hash and verdict checks match.`);
  console.log(countsTable(ledger));
  console.log(`Owner rulings: ${ledger.filter(row => row.needs_owner_ruling).length}`);
}
