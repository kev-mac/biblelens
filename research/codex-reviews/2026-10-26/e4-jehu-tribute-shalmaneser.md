# E4: Jehu paying tribute to Shalmaneser III (Black Obelisk)

Counts: 0 accept / 1 accept with fixes / 0 return to research.

Reviewed input: `research/claude-drafts/academic-cards-records.json` and `academic-cards-notes.md` at `f64e37cad5249adb660ab5377acbad2f52e04270`.

Packaged text and catalogs: `55e438a1071ac8629d5197cbf6c6db9d8346873e`. No draft was changed or merged.

Apply the shared review rules in [README](README.md). An acceptance with fixes is conditional on every listed fix.

## Shared schema fixes for this card

The unedited card fails `timelineCatalog`: its `TBD-history-*` evidence ID does not exist.
Resolving that ID alone still fails: `academic_consensus` is present while `discrepancy_kind` is null.
Keep this as Context. Remove `academic_consensus` from the timeline event after moving supported facts into the History record.
Do not invent a discrepancy category to bypass validation.
The linked record needs `mode: "history"`, `status: "Context"`, a single-verse `ref`, and valid `refs`/`appliesTo`.
It also needs `summary`, `text`, `reasoning`, `scope`, and HTTPS `sources` based only on verified supplied research.
The timeline takes summary, scope, ref and sources from that record. Standalone event `passages` and `sources` do not supply them.
Use `additional_sources` for extra timeline citations. Use Title Case for display without changing the research title.
Codex may do this structural work later; this review adds no History record.

## 1. Jehu paying tribute to Shalmaneser III (Black Obelisk)

ID: `jehu-tribute-shalmaneser`

**Verdict: accept with fixes.**

Checks: every verse in the proposed passage ranges exists. Raw timeline schema fails for the two reasons above.

Passages: 2 Kings 9:1-10; 2 Kings 10:11; 2 Kings 10:32-33.

[Tammi Schneider, Penn Museum, Through Assyria’s Eyes](https://www.penn.museum/sites/expedition/through-assyrias-eyes/) confirms the eighteenth-year setting, usual 841 date, caption and Omri-state explanation. Luckenbill sections 590 and 672 were checked separately. The article does not make the genealogy certain.

### Findings and required changes

Keep the tribute and usual identification with Jehu. Describe son of Omri as the inscription’s wording, with the state-label explanation as the usual reading, not a proved genealogy. Use c. 841 BCE for the reported eighteenth-year tribute, not as the date when the obelisk itself was made. Restrict the silence statement to the compared Kings account, rather than every biblical text. Preserve the difference between the caption and the annal. Codex can shape the already supplied research into a History Context record after these fixes.

Observed validator error: `Timeline draft uses unresolved evidence_id: TBD-history-jehu-tribute-shalmaneser`.

### Writing fixes

- `summary`: split screened sentence(s) 1 (32 words; starts `2 Kings 9-10 tells how Jehu, anointed by a prophet's messenger, destroyed the house of Ahab, and 2 K`); 3 (63 words; starts `In Luckenbill's 1926 edition the Black Obelisk caption over one relief reads 'Tribute of Iaua (Jehu)`); 4 (21 words; starts `So an Assyrian source independently names a king of Israel in the ninth century and a payment the Bi`); 5 (44 words; starts `'Son of Omri' does not fit 2 Kings 9-10, where Jehu is not Omri's descendant and ends Omri's line; A`); 6 (25 words; starts `That the Bible does not mention the tribute is not evidence that it did not happen, and the Assyrian`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `academic_consensus`: split screened sentence(s) 1 (52 words; starts `Shalmaneser III's records, including the Black Obelisk reliefs, list tribute from 'Jehu, son of Omri`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `traditional_date` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `review_status` has no flagged length or glossary issue. Retain the source and meaning fixes above.

### Source checks

- [Luckenbill (1926), Ancient Records of Assyria and Babylonia, vol. 1, sections 590 (Black Obelisk relief caption) and 672 (annals, year 18) (Internet Archive scan, opened)](https://archive.org/details/LuckenbillAncientRecordsAssyria01): HTTP 200; content read.

## Batch writing screen

Mean of checked field scores: 13.02. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `82274d85f6bbb97dbe7741197fc740bcb1be5176d36df2c1950146522589f939`
- Notes SHA-256: `a93c16b5dca125321975554969e8526c6102a7787461d4be5f0c794138232629`
