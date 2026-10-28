# E5: The fall of Samaria: Shalmaneser or Sargon?

Counts: 0 accept / 0 accept with fixes / 1 return to research.

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

## 1. The fall of Samaria: Shalmaneser or Sargon?

ID: `samaria-fall-sargon`

**Verdict: return to research.**

Checks: every verse in the proposed passage ranges exists. Raw timeline schema fails for the two reasons above.

Passages: 2 Kings 17:3-6; 2 Kings 18:9-11.

[Posen’s Khorsabad summary-inscription excerpt](https://www.posenlibrary.com/entry/sargon-ii-khorsabad-summary-inscription) was readable without an account and supports the number and chariot count. RINAP 2 pages were not retrievable here, so their modern critical readings are not claimed as checked.

### Findings and required changes

The cited Rogers passages and the open Posen excerpt support Sargon’s claim, 27,290 people and fifty chariots. Correct the biblical wording: 2 Kings 18:10 says they took it; 17:6 says the king of Assyria. Do not use the proposed accession handover as a settled reconciliation. Claude must verify the annal’s damaged opening, chronology and assignment of the capture against a current edition. Keep the separate Sennacherib chronology issue separate.

Observed validator error: `Timeline draft uses unresolved evidence_id: TBD-history-samaria-fall-sargon`.

### Writing fixes

- `summary`: split screened sentence(s) 1 (26 words; starts `2 Kings 17:3-5 and 18:9 name Shalmaneser king of Assyria as the one who came up against Samaria and `); 2 (41 words; starts `The verses that report the capture (17:6, 18:10) say only that 'the king of Assyria' took it in Hosh`); 3 (42 words; starts `Sargon II's annals and his General Inscription, as translated in Rogers (1912), say that he besieged`); 4 (41 words; starts `The Hebrew of Kings never names Sargon, and the inscription never names Shalmaneser in the passages `); 5 (37 words; starts `Rogers himself says Sargon claims the victory though he may not have been present, and that the city`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `academic_consensus`: split screened sentence(s) 1 (27 words; starts `Shalmaneser V besieged Samaria and died soon after; Sargon II succeeded him in 722 and his inscripti`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `traditional_date` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `review_status`: split screened sentence(s) 1 (24 words; starts `Context only; the books name Shalmaneser for the siege, and Sargon's inscriptions claim the capture,`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

### Source checks

- [Rogers (1912), Cuneiform Parallels to the Old Testament, Sargon section: annals lines 10-17 and the General Inscription lines 23-25 (Internet Archive scan, opened)](https://archive.org/details/cuneiformparalle00rogeuoft): HTTP 200; content read.

## Batch writing screen

Mean of checked field scores: 10.58. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `82274d85f6bbb97dbe7741197fc740bcb1be5176d36df2c1950146522589f939`
- Notes SHA-256: `a93c16b5dca125321975554969e8526c6102a7787461d4be5f0c794138232629`
