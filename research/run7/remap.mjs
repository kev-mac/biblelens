import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

process.chdir(fileURLToPath(new URL('../..', import.meta.url)));
const read = file => fs.readFileSync(file, 'utf8');
const json = file => JSON.parse(read(file));
const hash = value => createHash('sha256').update(value).digest('hex');
const beforeCommit = '5608d5c';
const historical = file => execFileSync('git', ['show', `${beforeCommit}:${file}`], {encoding:'utf8', maxBuffer:32*1024*1024});
const labels = {
  'Real conflict':'Wording differs',
  'Can be reconciled':'Readings can fit together',
  'Different detail':'Details differ',
  'Open question':'Interpretation remains open',
  'not a debate':'Instruction in context',
  'Evidence agrees':'Evidence matches the text',
  'Evidence disagrees':'Evidence points elsewhere',
  'Not settled':'Not settled',
};
// Log even modest shifts in emphasis. A new label does not add a finding.
const shifts = {
  'Real conflict':'The new label describes wording. It no longer asserts that the claims cannot both stand.',
  'not a debate':'The new label names an instruction in its setting. The old label only set it outside a debate.',
  'Evidence agrees':'The new label names a match with the stated text. It must stay within the supported detail.',
  'Evidence disagrees':'The new label describes where the evidence points. It softens the old label’s direct disagreement.',
};
const old = JSON.parse(historical('research/verdict-ledger/ledger.json'));
const current = json('research/verdict-ledger/ledger.json');
const evidence = json('data/evidence.json');
for (const file of ['data/evidence.json','research/verdict-ledger/ledger.json']) {
  assert.equal(read(file),execFileSync('git',['show',`6c3e246:${file}`],{encoding:'utf8',maxBuffer:32*1024*1024}),`Protected source changed: ${file}`);
}
const sheet = read('research/b4/B1-decisions-before.md');
const group = new Map(sheet.split('\n').filter(line => /^\| A\d\d \|/.test(line)).map(line => {
  const cells = line.split('|').map(cell => cell.trim());
  return [cells[2].match(/^\[([^\]]+)\]/)[1], {item:cells[1], hold:cells[4].startsWith('HOLD'), reason:cells[3]}];
}));
assert.equal(group.size, 66);
assert.equal(old.length, 1933);
const rows = old.map((prior, index) => {
  const now = current[index], record = evidence[index], a = group.get(prior.id);
  assert.equal(prior.id, now.id);
  assert.equal(prior.id, record.id);
  assert.equal(labels[prior.proposed_verdict], now.proposed_verdict);
  const issues = now.notes.filter(note => /^(?:Possible field mismatch|Field mismatch|Status review):/.test(note));
  // A status mismatch already resolved by the ledger's scope-limited proposal
  // is not a new field conflict. Explicit HOLDs and field conflicts stay unmapped.
  const ambiguous = a?.hold || issues.length > 0;
  return {
    id:prior.id, group:a?.item ?? 'remaining', mode:record.mode,
    reviewStatus:'draft, unverified', ownerAccepted:false,
    old_label:prior.proposed_verdict,
    b6_label:now.proposed_verdict,
    proposed_label:ambiguous ? null : labels[prior.proposed_verdict],
    disposition:ambiguous ? 'meaning check' : 'draft proposal',
    meaning_change:!ambiguous && Boolean(shifts[prior.proposed_verdict]),
    label_reason:ambiguous ? 'Resolve the stated field or identity issue before choosing a label.'
      : shifts[prior.proposed_verdict] ?? 'The approved wording keeps the prior meaning and its full limits.',
    prior_reason:now.reason,
    review_issues:ambiguous ? (issues.length ? issues : [a.reason]) : [],
    needs_owner_ruling:now.needs_owner_ruling,
    evidence_sha256:hash(JSON.stringify(record)),
    source_scope:record.scope ?? null,
    source_notes:now.notes,
  };
});
const changes = rows.filter(row => row.meaning_change);
const held = rows.filter(row => row.disposition === 'meaning check');
const counts = Object.fromEntries(Object.values(labels).map(label => [label, rows.filter(row => row.proposed_label === label).length]));
const payload = {
  reviewStatus:'draft, unverified', ownerAccepted:false, decision:'A00a, Kevin, 2026-10-28',
  historical_commit:execFileSync('git',['rev-parse',beforeCommit],{encoding:'utf8'}).trim(),
  source_hashes:Object.fromEntries(['data/evidence.json','research/verdict-ledger/ledger.json','research/b4/B1-decisions-before.md','research/b6/owner-decisions.json'].map(file => [file,hash(read(file))])),
  counts:{total:rows.length, groupA:group.size, remaining:rows.length-group.size, mapped:rows.length-held.length, ambiguous:held.length, meaning_changes:changes.length, labels:counts},
  records:rows,
};
const table = (items, fields) => [
  `| ${fields.map(([name])=>name).join(' | ')} |`,
  `| ${fields.map(()=>'---').join(' | ')} |`,
  ...items.map(row => `| ${fields.map(([,key])=>String(row[key] ?? 'Withheld').replaceAll('|','\\|').replaceAll('\n',' ')).join(' | ')} |`),
].join('\n');
const outputs = {
  'label-proposals.json':JSON.stringify(payload,null,2)+'\n',
  'meaning-changes.md':'# Run 7 meaning changes\n\nAll rows are drafts. These are label-level shifts, including changes in emphasis. They add no evidence claims.\n'
    +'Rows with unresolved meaning are excluded here and listed in meaning-checks.md.\n\n'
    +table(changes,[['Record','id'],['Group','group'],['Old label','old_label'],['New label','proposed_label'],['Why','label_reason']])+'\n',
  'meaning-checks.md':'# Run 7 meaning checks\n\nNo label is assigned to these records. B6 wording is shown only as an audit trail.\n'
    +'Resolve the stated issue against the full source fields before making a draft choice.\n'
    +'The separate B6 Romans/James–Rahab wording hold remains in research/b6/meaning-checks.md.\n\n'
    +table(held.map(row=>({...row,why:row.review_issues.join(' ')})),[['Record','id'],['Group','group'],['Old label','old_label'],['Prior B6 label (withheld)','b6_label'],['Why held','why']])+'\n',
};
if (process.argv.includes('--write')) {
  for (const [file, value] of Object.entries(outputs)) fs.writeFileSync(`research/run7/${file}`,value);
} else {
  for (const [file,value] of Object.entries(outputs)) assert.equal(read(`research/run7/${file}`),value,`Stale ${file}`);
  assert.equal(new Set(rows.map(row=>row.id)).size,1933);
  assert.equal(rows.filter(row=>row.group !== 'remaining').length,66);
  assert.equal(rows.filter(row=>row.group === 'remaining').length,1867);
  for(const row of rows) {
    const allowed = ['science','history'].includes(row.mode) ? Object.values(labels).slice(5)
      : row.mode === 'commandments' ? ['Instruction in context'] : Object.values(labels).slice(0,4);
    if(row.proposed_label) assert(allowed.includes(row.proposed_label),row.id);
    else assert(row.review_issues.length,row.id);
    assert(!('tier' in row));
  }
  assert.equal(json('package.json').buildNumber,275);
  console.log('PASS: exact draft coverage, source pins, mode labels, holds, change tables and no tier assignments.');
}
console.log(JSON.stringify(payload.counts,null,2));
