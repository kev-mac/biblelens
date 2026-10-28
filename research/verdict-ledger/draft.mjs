import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const directory = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(directory, '../..');
export const read = name => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8'));
export const source = read('source.json');
export const verdicts = ['Real conflict', 'Can be reconciled', 'Different detail', 'Open question',
  'Evidence agrees', 'Evidence disagrees', 'Not settled', 'not a debate'];

export function baseline(record) {
  if (record.mode === 'commandments') return 'not a debate';
  if (record.status === 'Textual conflict') return 'Real conflict';
  if (record.status === 'Agrees') return 'Evidence agrees';
  if (record.status === 'Disagrees') return 'Evidence disagrees';
  if (record.status !== 'Context') throw new Error(`Unknown status: ${record.status}`);
  return ['science', 'history'].includes(record.mode) ? 'Not settled' : 'Open question';
}

export function requiredRuling(record, verdict) {
  const original = baseline(record);
  return (original === 'Real conflict' && verdict !== original)
    || (original === 'Evidence disagrees' && verdict !== original)
    || (original !== 'Real conflict' && verdict === 'Real conflict');
}

export function loadEvidence() {
  const bytes = fs.readFileSync(path.join(root, 'data/evidence.json'));
  if (createHash('sha256').update(bytes).digest('hex') !== source.evidence_sha256) {
    throw new Error('Evidence has changed since review. Reconcile the draft before regenerating it.');
  }
  return JSON.parse(bytes);
}

export function makeLedger(records, decisions) {
  const ids = new Set(records.map(record => record.id));
  if (ids.size !== records.length) throw new Error('Duplicate source ID');
  const choices = new Map();
  for (const decision of decisions) {
    if (!ids.has(decision.id) || choices.has(decision.id)) throw new Error(`Invalid decision ID: ${decision.id}`);
    choices.set(decision.id, decision);
  }
  return records.map(record => {
    const decision = choices.get(record.id);
    const original = baseline(record);
    const proposed = decision?.proposed_verdict ?? original;
    const notes = [];
    for (const { field, quote } of decision?.evidence ?? []) {
      if (!quote || !record[field]?.includes(quote)) throw new Error(`Bad excerpt: ${record.id}.${field}`);
      notes.push(`Source ${field}: ${JSON.stringify(quote)}`);
    }
    notes.push(...(decision?.owner_notes ?? []));
    if (requiredRuling(record, proposed)) {
      notes.push(proposed === 'Real conflict'
        ? `Owner ruling required: upgrade from ${original} to Real conflict.`
        : `Owner ruling required: downgrade from ${original} to ${proposed}.`);
    }
    if (['Real conflict', 'Evidence agrees', 'Evidence disagrees'].includes(proposed)) {
      notes.push(`Source scope: ${JSON.stringify(record.scope)}`);
    }
    if (/reported, unverified/.test(`${record.reasoning ?? ''}\n${record.scope ?? ''}`)) {
      notes.push('The source includes unverified supplemental prose; this draft does not verify it.');
    }
    if (!record.title) notes.push('The source has no title; null preserves that gap.');
    return {
      id: record.id, mode: record.mode, ref: record.ref, title: record.title ?? null,
      current_status: record.status, proposed_verdict: proposed, changed: proposed !== original,
      reason: decision?.reason ?? (record.mode === 'commandments'
        ? 'The scope lists a command and adds no finding about the passage.'
        : `The default rule maps ${record.status} to ${original}.`),
      needs_owner_ruling: requiredRuling(record, proposed) || Boolean(decision?.owner_notes.length),
      notes,
    };
  });
}

export function countsTable(ledger) {
  const rows = ['Textual conflict', 'Agrees', 'Disagrees', 'Context'].flatMap(status =>
    verdicts.map(verdict => ({ status, verdict,
      count: ledger.filter(row => row.current_status === status && row.proposed_verdict === verdict).length,
    })).filter(row => row.count));
  return ['| Current status | Proposed verdict | Records |', '| --- | --- | ---: |',
    ...rows.map(row => `| ${row.status} | ${row.verdict} | ${row.count} |`),
    `| **Total** | | **${ledger.length}** |`].join('\n');
}

export const priorities = [
  ['hezekiah-hearkened-to-the-envoys-or-was-glad-of-them', 'Use Different detail when scope says both acts can occur.'],
  ['amalekites-and-canaanites-dwelt-in-the-valley-or-in-that-hill', 'Decide whether a conflict requires the same exclusive group and place.'],
  ['whole-congregation-42360-or-the-sum-of-the-counts-given', 'Decide if a list with gaps can prove that the whole total is wrong.'],
  ['hiram-oil-twenty-measures-or-twenty-thousand-baths', 'Decide how to compare gifts to different people in different units.'],
  ['early-vessels', 'Decide if the list names all the vessels before calling its total a conflict.'],
  ['numbers-levite-total-discrepancy', 'Approve a stronger verdict for clan counts that exceed their stated total.'],
  ['joshua-judah-town-totals', 'Approve a stronger verdict for the southern town count after the stated name adjustment.'],
  ['considered-not-his-own-body-or-considered-his-own-body-romans-4-19-greek-new-testament', 'Decide if these two opposite readings should count as Real conflict.'],
  ['i-neither-learned-wisdom-or-god-has-taught-me-wisdom-greek', 'Decide whether the stated denial and claim of knowledge warrant Real conflict.'],
  ['they-are-not-the-lords-or-they-are-the-lords-jeremiah-5-10-greek', 'Decide whether the opposite closing clauses warrant Real conflict.'],
  ['second-animal-cheweth-the-cud-or-does-not-chew-the-cud-greek', 'Keep this conflict within the words compared; leave the animals’ names open.'],
  ['manasseh-made-his-son-pass-through-the-fire-or-his-children-2-kings-21-6-2-chronicles-33-6', 'Resolve why the scope excludes the verse compared in the summary.'],
  ['david-men-six-hundred-or-four-hundred-keilah-1-samuel-23-13', 'Resolve which other troop counts were actually compared.'],
  ['bear-it-upon-thy-shoulders-or-thou-shalt-be-lifted-up-ezekiel-12-6-7', 'Resolve whether the finding includes verse 12:6.'],
  ['over-philistia-will-i-triumph-or-philistia-triumph-thou-because-of-me-psalm-108-9-and-psalm-60-8', 'Resolve the summary’s source order and the scope’s open order.'],
  ['three-days-and-three-nights-or-the-third-day-matthew-12-40-matthew-16-21', 'Resolve the fixed hour claim before choosing how to count the days.'],
  ['if-one-man-sin-against-another-the-judge-or-they-shall-pray-1-samuel-2-25', 'Resolve the human judge claim while scope leaves the identity open.'],
  ['history-theudas-revolt-order', 'Decide if both texts mean the same man before treating the dates as a conflict.'],
  ['history-darius-mede-succession', 'Decide if the separate king reading supports the stronger verdict.'],
  ['history-jericho-destruction-date', 'Decide if the proposed link to the tested layer supports the stronger verdict.'],
];

export function makeReadme(ledger) {
  const flagged = ledger.filter(row => row.needs_owner_ruling);
  const changed = ledger.filter(row => row.changed).length;
  const byId = new Map(ledger.map(row => [row.id, row]));
  return `# Draft Verdict Ledger

This is a local draft for Phase 3. It changes no evidence or app content.
The source is the requested origin/main snapshot, commit \`${source.commit}\`.
It contains ${ledger.length.toLocaleString('en-US')} records. No claim is made about Sites or installed release versions.

## Method

Each record starts with the owner’s default mapping:

| Mode | Current status | Default verdict |
| --- | --- | --- |
| contradictions or questions | Textual conflict | Real conflict |
| contradictions or questions | Context | Open question |
| science or history | Agrees | Evidence agrees |
| science or history | Disagrees | Evidence disagrees |
| science or history | Context | Not settled |
| commandments | Context | not a debate |

All 42 commandments list commands without making a conflict finding. They remain not a debate.
All 155 question records remain Open question.
The six missing titles remain null; none is invented.

The source order, IDs, modes, references, titles, and current statuses are copied without changes.
\`changed\` means a departure from the default verdict, rather than the new label’s spelling.
There are **${changed} departures** and **${ledger.length - changed} retained defaults**.

Selected departures have a one-sentence reason naming the source field.
Exact supporting excerpts appear in \`notes\` and \`decisions.json\`.
The validator checks those excerpts against the pinned source.
Each flagged field mismatch also has excerpts from the relevant fields.

Real conflict applies to the stated comparison within the source’s limits.
It does not decide which reading is original or which event happened.
Can be reconciled means the record supplies a way both claims could stand.
That possible reading is not presented as a proved history.
Different detail covers differences the record treats as compatible, partial, or about different subjects, times, or rules.
Open question keeps the default where the record leaves the relevant reading or comparison unsettled.

Translation tags alone cause no verdict change.
A printed difference can remain Open question while the reading and its meaning remain open.
Specific claims of opposing readings can support Real conflict, with an owner flag.
Specific limits on exclusive claims can support Different detail.
An unreported extra event or person alone is usually not enough to depart from the default.
Shorter lists are not assumed complete when the record leaves their scope open.

Evidence agrees applies only to the supported detail, such as a place, named tradition, or later practice.
Evidence disagrees keeps every condition in the record’s scope.
The three new history disagreements need owner review because each rests on a stated identification or reading.
The eleven existing disagreements retain their default verdicts.

Every downgrade from Real conflict or Evidence disagrees needs an owner ruling.
Every upgrade to Real conflict also needs one.
Field mismatches and possible field mismatches carry the same flag, even when the default stays.
A possible mismatch asks for clarification; it is not a new finding about the biblical text.
The ledger has **${flagged.length} records needing an owner ruling**.
Flags request future review and do not claim that the owner has approved a change.

## Review Scope

All source records were processed and their summary, reasoning, and scope fields screened.
Existing conflict and disagreement records received direct review.
The review also checked the untagged text comparisons, evidence records, commandments, and explicit wording-conflict candidates.
Question records retain their stated open-question limits.
Repeated edition limits were grouped during screening; they remain in the source.
All 48 records with unverified supplemental prose received a separate field review and carry a note.
The ledger preserves full scope text for proposed Real conflict, Evidence agrees, and Evidence disagrees verdicts.
Other limits remain in the source record under the same ID.

This review uses only claims already in the records.
It adds no outside scholarship, source checks, dates, or reconstructed events.
It does not turn a word search into a whole-Bible review.
Printed editions are not treated as proof about all ancient copies.
The existing research findings and owner rulings remain unchanged.

## Counts by Current Status and Proposed Verdict

Only nonzero cells are shown. Omitted combinations have zero records.

${countsTable(ledger)}

## First 20 Owner Rulings

These priorities favor clear scope limits, repeated types of conflict, and field mismatches that could mislead later edits.

${priorities.map(([id, why], index) => {
    if (!byId.get(id)?.needs_owner_ruling) throw new Error(`Priority lacks flag: ${id}`);
    return `${index + 1}. \`${id}\` — ${why}`;
  }).join('\n')}

## All Records Needing an Owner Ruling

Each line gives the proposed verdict and its record-based reason.
Field issues follow the reason when present. Full excerpts are in the ledger notes.

${flagged.map(row => {
    const issues = row.notes.filter(note => /^(?:Possible field mismatch|Field mismatch|Status mismatch|Status review):/.test(note));
    return `- \`${row.id}\` — **${row.proposed_verdict}**. ${row.reason}${issues.length ? ' ' + issues.join(' ') : ''}`;
  }).join('\n')}

## Validation and Reuse

Run \`node research/verdict-ledger/validate.mjs\` from this checkout.
It checks exact ID coverage, duplicates, source drift, copied fields, allowed verdicts, evidence excerpts, and required owner flags.
It also checks that this README and the ledger match the reviewed decisions.
Regenerate the draft with \`node research/verdict-ledger/draft.mjs\` after editing decisions.
The source hash must match before regeneration; later source changes require another review.

Source SHA-256: \`${source.evidence_sha256}\`.

The writing standard was read from codex/readability-standard at \`${source.writing_standard_commit}\`.
\`npm run check:readability\` was attempted; this origin/main snapshot has no such script.
The branch’s checker was run directly on the draft’s authored prose and the unchanged app collections.
The draft’s checked prose averages below grade 8, with no length or jargon flags.
Existing app copy still has grade, length, and jargon flags; those files remain unchanged.
Exact source excerpts, copied titles, and IDs are kept as evidence rather than rewritten.
The validator also rejected test cases with duplicate, missing, or unknown IDs and missing owner flags.
A fake source excerpt was rejected too. These test cases were held in memory and changed no files.
No release script or build was run.
`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const ledger = makeLedger(loadEvidence(), read('decisions.json'));
  fs.writeFileSync(path.join(directory, 'ledger.json'), JSON.stringify(ledger, null, 2) + '\n');
  fs.writeFileSync(path.join(directory, 'README.md'), makeReadme(ledger));
  console.log(countsTable(ledger));
  console.log(`Owner rulings: ${ledger.filter(row => row.needs_owner_ruling).length}`);
}
