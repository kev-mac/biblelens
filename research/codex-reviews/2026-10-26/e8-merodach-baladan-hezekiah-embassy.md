# E8: Merodach-baladan and Hezekiah

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

## 1. Merodach-baladan and Hezekiah

ID: `merodach-baladan-hezekiah-embassy`

**Verdict: accept with fixes.**

Checks: every verse in the proposed passage ranges exists. Raw timeline schema fails for the two reasons above.

Passages: 2 Kings 20:12-13; Isaiah 39:1-2; 2 Chronicles 32:31.

[Chronicle ABC 1, column I](https://www.livius.org/sources/content/mesopotamian-chronicles-content/abc-1-from-nabu-nasir-to-samas-suma-ukin/) and [column II](https://www.livius.org/sources/content/mesopotamian-chronicles-content/abc-1-from-nabu-nasir-to-samas-suma-ukin/abc-1.ii/) were opened. The translation draws on Grayson and Glassner. It supports the first accession, twelve-year reign and later conflict, not a date for the embassy. The supplied Hebrew was checked at [2 Kings 20](https://bolls.life/get-text/WLC/12/20/) and [Isaiah 39](https://bolls.life/get-text/WLC/23/39/). The different verbs are present; the Latin forms in the draft are transliterations, not exact Hebrew quotations.

### Findings and required changes

Remove c. 701 BCE as the embassy’s date: the draft expressly says it does not choose between reconstructions. Use a reign-based setting and label 703/702 as a regnal-year notation if retained, rather than a proved two-year second reign. Use packaged Berodachbaladan in 2 Kings and Merodachbaladan in Isaiah. Remove the KJV-margin claim because no such margin is packaged or independently cited. The hearkened/was glad contrast matches the packaged verses. The chronicle confirms reign events, not this embassy or its motive. Codex can shape the supplied research into History Context. Do not describe the Hebrew names as differing only in their first letter: the supplied Kings spelling also includes an aleph absent from Isaiah’s spelling. Keep the plain English name comparison separate from the Hebrew spelling detail.

Observed validator error: `Timeline draft uses unresolved evidence_id: TBD-history-merodach-baladan-hezekiah-embassy`.

### Writing fixes

- `summary`: split screened sentence(s) 1 (38 words; starts `2 Kings 20:12 (KJV Berodach-baladan, margin Merodach-baladan) and Isaiah 39:1 (Merodach-baladan) bot`); 2 (29 words; starts `The Hebrew spells the name with a different first letter in the two books (bero'dak in Kings, meroda`); 3 (32 words; starts `The two accounts also differ in one verb: Kings says Hezekiah 'hearkened' to the envoys (wayyishma),`); 4 (32 words; starts `2 Chronicles 32:31 gives the envoys as ambassadors of the princes of Babylon sent to ask about the w`); 5 (37 words; starts `In the Babylonian Chronicle as translated by Rogers (1912), Merodach-baladan takes the Babylonian th`); 7 (34 words; starts `The chronicle says nothing of Judah, so it neither confirms nor contradicts the embassy, and the bib`); 8 (28 words; starts `Whether it fell in his first reign or his shorter second reign is a matter of reconstruction, not so`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `academic_consensus`: split screened sentence(s) 1 (45 words; starts `The Babylonian Chronicle records Merodach-baladan (Marduk-apal-iddin) as king of Babylon for twelve `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `traditional_date` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `review_status`: split screened sentence(s) 1 (32 words; starts `Context only; an Assyrian-era Babylonian chronicle confirms Merodach-baladan as king of Babylon, and`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

### Source checks

- [Rogers (1912), Cuneiform Parallels to the Old Testament, Babylonian Chronicle col. I lines 28-44 and col. II lines 1-5 (Internet Archive scan, opened)](https://archive.org/details/cuneiformparalle00rogeuoft): HTTP 200; content read.

## Batch writing screen

Mean of checked field scores: 15.39. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `82274d85f6bbb97dbe7741197fc740bcb1be5176d36df2c1950146522589f939`
- Notes SHA-256: `a93c16b5dca125321975554969e8526c6102a7787461d4be5f0c794138232629`
