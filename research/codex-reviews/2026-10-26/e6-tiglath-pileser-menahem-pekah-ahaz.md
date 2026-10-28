# E6: Tiglath-pileser III, Menahem, Pekah and Ahaz

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

## 1. Tiglath-pileser III, Menahem, Pekah and Ahaz

ID: `tiglath-pileser-menahem-pekah-ahaz`

**Verdict: return to research.**

Checks: every verse in the proposed passage ranges exists. Raw timeline schema fails for the two reasons above.

Passages: 2 Kings 15:19-20; 2 Kings 15:29-30; 2 Kings 16:7-9.

Rogers’s annals, tribute lists, Nimroud tablet and Babylonian material were inspected. Modern RINAP 1 search results identified relevant sources, but full critical text access failed. Search snippets are not treated as successful source verification.

### Findings and required changes

Keep the biblical thousand talents, not Rogers’s introductory thousand shekels. His translated lists support Menahem and Jehoahaz, and his fragment has Pekah/Hoshea. Claude must verify the restored subject and agency in that damaged passage, the Pul/Pulu equation and Jehoahaz/Ahaz identification against a readable current edition. Do not let Rogers’s index alone establish all identities. Do not revive the withdrawn Azariah of Ja’udi equation.

Observed validator error: `Timeline draft uses unresolved evidence_id: TBD-history-tiglath-pileser-menahem-pekah-ahaz`.

### Writing fixes

- `summary`: split screened sentence(s) 3 (22 words; starts `2 Kings 15:19-20 says Menahem gave Pul a thousand talents of silver, raised by fifty shekels from ea`); 4 (21 words; starts `A tribute list of Tiglath-pileser names Menahem of Samaria among rulers who paid, though the survivi`); 5 (27 words; starts `2 Kings 15:29-30 says Tiglath-pileser took northern towns and Gilead and Galilee and carried people `); 7 (23 words; starts `Both accounts agree that Hoshea replaced Pekah; the Bible has a conspiracy by Hoshea, the Assyrian r`); 8 (27 words; starts `A tribute list also names Jehoahaz of Judah, which Rogers's index equates with Ahaz (2 Kings 16:8 ha`); 9 (23 words; starts `Rogers's older view that Azariah of Ja'udi was Azariah of Judah is withdrawn in his own footnote, so`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `academic_consensus`: split screened sentence(s) 1 (40 words; starts `Tiglath-pileser III of Assyria (also called Pulu in Babylonian records) campaigned in Syria and Pale`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `traditional_date`: split screened sentence(s) 1 (23 words; starts `Reigns of Menahem, Pekah and Ahaz (mid to late eighth century BCE; Tiglath-pileser III reigned 745-7`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `review_status` has no flagged length or glossary issue. Retain the source and meaning fixes above.

### Source checks

- [Rogers (1912), Cuneiform Parallels to the Old Testament, Tiglathpileser IV: introduction, annals, Nimroud Tablet and tribute list; Babylonian Chronicle col. I (Internet Archive scan, opened)](https://archive.org/details/cuneiformparalle00rogeuoft): HTTP 200; content read.

## Batch writing screen

Mean of checked field scores: 12.91. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `82274d85f6bbb97dbe7741197fc740bcb1be5176d36df2c1950146522589f939`
- Notes SHA-256: `a93c16b5dca125321975554969e8526c6102a7787461d4be5f0c794138232629`
