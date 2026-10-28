# E7: Esarhaddon and Manasseh of Judah

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

## 1. Esarhaddon and Manasseh of Judah

ID: `esarhaddon-manasseh-tribute`

**Verdict: accept with fixes.**

Checks: every verse in the proposed passage ranges exists. Raw timeline schema fails for the two reasons above.

Passages: 2 Kings 21:1-2; 2 Chronicles 33:10-13.

[Oppenheim’s Prism B translation, ANET third edition](https://www.livius.org/sources/content/anet/291-esarhaddons-prism-b/) confirms Manasseh, the list order and transport of building materials. It is a later translation, not a new collation of the tablet. The ORACC critical page failed to load; no reading from it is asserted. [The Hebrew text of 2 Chronicles 33](https://bolls.life/get-text/WLC/14/33/) was also opened. Seeing the word does not by itself settle the proposed hooks gloss.

### Findings and required changes

Keep Manasseh’s presence in the palace-building list and describe vassal status as the inference from that demand. The named kings and material transport are supported. Use the packaged KJV wording among the thorns in quotations; remove the unverified hooks gloss or explicitly source it before use. Do not identify Chronicles’ unnamed Assyrian king as Esarhaddon. Delete the speculative reason that a building list is not the place to expect captivity; simply state that this list does not mention it. Codex can shape the supplied research into History Context.

Observed validator error: `Timeline draft uses unresolved evidence_id: TBD-history-esarhaddon-manasseh-tribute`.

### Writing fixes

- `summary`: split screened sentence(s) 1 (29 words; starts `2 Kings 21:1-2 says Manasseh was twelve when he began to reign, reigned fifty-five years and did evi`); 2 (51 words; starts `2 Chronicles 33:11 adds that the Lord brought the captains of the host of the king of Assyria, who t`); 3 (51 words; starts `In Rogers's 1912 translation of Esarhaddon's Prism B, the king says he demanded from the kings of th`); 5 (34 words; starts `It does not mention a capture, a journey to Babylon or a return, and a royal building list is not th`); 6 (31 words; starts `Kings and Chronicles are silent or select differently about Assyria; the two biblical accounts diffe`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `academic_consensus`: split screened sentence(s) 1 (35 words; starts `Esarhaddon's building inscription lists Manasseh king of Judah among the kings of the west required `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `traditional_date`: split screened sentence(s) 1 (21 words; starts `Reign of Manasseh (long reign, 55 years in the text; Esarhaddon of Assyria reigned 680-669 BCE on th`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `review_status`: split screened sentence(s) 1 (25 words; starts `Context only; an Assyrian royal inscription names Manasseh as a tributary, and 2 Chronicles 33 and 2`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

### Source checks

- [Rogers (1912), Cuneiform Parallels to the Old Testament, Esarhaddon introduction (pp. 349-350) and Prism B, col. V, lines 12-23 (Internet Archive scan, opened)](https://archive.org/details/cuneiformparalle00rogeuoft): HTTP 200; content read.

## Batch writing screen

Mean of checked field scores: 14.11. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `82274d85f6bbb97dbe7741197fc740bcb1be5176d36df2c1950146522589f939`
- Notes SHA-256: `a93c16b5dca125321975554969e8526c6102a7787461d4be5f0c794138232629`
