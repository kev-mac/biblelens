# E3: Shishak's campaign against Rehoboam (Karnak relief)

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

## 1. Shishak's campaign against Rehoboam (Karnak relief)

ID: `shishak-campaign-karnak`

**Verdict: return to research.**

Checks: every verse in the proposed passage ranges exists. Raw timeline schema fails for the two reasons above.

Passages: 1 Kings 14:25-26; 2 Chronicles 12:2-9.

[Epigraphic Survey, OIP 74](https://isac.uchicago.edu/publications/reliefs-and-inscriptions-karnak-volume-iii-bubastite) and its [plate scan](https://isac-assets.s3.amazonaws.com/isac-publications/oip74.pdf) were obtained. This does not verify the ancient name readings or territorial assignments. No claim of a fresh hieroglyphic reading is made.

### Findings and required changes

Breasted sections 709–717 support a damaged place list and his proposed identifications. His campaign date is about 926 BCE, not proof of the draft’s c. 925 date. The statement groups Gibeon, Beth-horon and Ajalon with securely northern towns without adequate support. Claude must supply current name readings and a qualified geographical grouping. Remove the claim that missing Jerusalem was in a gap as an established fact; it is Breasted’s suggestion. Replace the same-campaign certainty with a qualified usual identification. Do not infer contradiction from silence.

Observed validator error: `Timeline draft uses unresolved evidence_id: TBD-history-shishak-campaign-karnak`.

### Writing fixes

- `summary`: split screened sentence(s) 1 (41 words; starts `1 Kings 14:25-26 says Shishak king of Egypt came up against Jerusalem in Rehoboam's fifth year and t`); 3 (41 words; starts `In Breasted's 1906 edition the list names towns of both Israel and Judah, with many of the securely `); 5 (50 words; starts `So the biblical books report an attack on Judah and Jerusalem and say nothing of Israelite towns, wh`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `academic_consensus`: split screened sentence(s) 1 (31 words; starts `The Bubastite Portal relief at Karnak, built by Sheshonk I (Shoshenq I), records a campaign in Pales`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `traditional_date` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `review_status` has no flagged length or glossary issue. Retain the source and meaning fixes above.

### Source checks

- [Breasted (1906), Ancient Records of Egypt, vol. 4, sections 709-717: Great Karnak Relief of Sheshonk I (Internet Archive scan, opened)](https://archive.org/details/ancientrecordsof0004jame_k7s1): HTTP 200; content read.

## Batch writing screen

Mean of checked field scores: 11.31. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `82274d85f6bbb97dbe7741197fc740bcb1be5176d36df2c1950146522589f939`
- Notes SHA-256: `a93c16b5dca125321975554969e8526c6102a7787461d4be5f0c794138232629`
