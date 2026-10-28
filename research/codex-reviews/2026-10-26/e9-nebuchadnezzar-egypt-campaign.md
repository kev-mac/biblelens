# E9: Nebuchadnezzar's campaign against Egypt (567 BCE)

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

## 1. Nebuchadnezzar's campaign against Egypt (567 BCE)

ID: `nebuchadnezzar-egypt-campaign`

**Verdict: accept with fixes.**

Checks: every verse in the proposed passage ranges exists. Raw timeline schema fails for the two reasons above.

Passages: Ezekiel 29:17-20; Ezekiel 30:10-12; Jeremiah 43:8-13; Jeremiah 46:13.

[Aren M. Wilson-Wright, Jeremiah’s Egypt, pp. 31–32](https://www.sbl-site.org/wp-content/uploads/2024/11/9781628374643_OA.pdf) was read and visually checked at PDF pages 46–47. Its transcription retains breaks and the restored name. This verifies the limited notice, not all of the author’s historical reconstruction. The British Museum object page was blocked, so direct museum verification is not claimed.

### Findings and required changes

Keep only the campaign notice and the damaged text’s limits. Replace names Amasis with has the Egyptian king’s name partly restored as Amasis. Change the displayed date to c. 568/567 BCE; retain the underlying research title unchanged. Delete before any outcome: Rogers includes tentative defeat/destruction fragments, which do not establish conquest. Replace same campaign with a proposed comparison; the prophetic passages are not campaign reports. Do not import the newer author’s conclusion about fulfilment or failure. Create no duplicate Tyre finding: cross-link exp-late-25-29-17, whose scope is internal and whose mode is contradictions. A separately scoped History Context record is needed for the external Egypt fragment.

Observed validator error: `Timeline draft uses unresolved evidence_id: TBD-history-nebuchadnezzar-egypt-campaign`.

### Writing fixes

- `summary`: split screened sentence(s) 1 (57 words; starts `In the Hebrew text, Ezekiel 29:17-20 is dated to the 27th year of the exile and says Nebuchadnezzar'`); 2 (42 words; starts `A broken Babylonian tablet, as translated by Rogers (1912), says that in Nebuchadnezzar's 37th year `); 4 (23 words; starts `It does not say Egypt was conquered, taken, or made a province, and the prophetic texts are poems of`); 6 (21 words; starts `Rogers himself says only that the extent of success is not known; later editions (Langdon, Wiseman) `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `academic_consensus`: split screened sentence(s) 1 (24 words; starts `A fragmentary Babylonian tablet in the British Museum, dated to Nebuchadnezzar's 37th year, mentions`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `traditional_date` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `review_status`: split screened sentence(s) 1 (24 words; starts `Context only; the Babylonian fragment and the prophets speak of the same campaign, but the fragment `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

### Source checks

- [Rogers (1912), Cuneiform Parallels to the Old Testament, 'Nebuchadrezzar's Campaign against Egypt (567 B.C.)', text and translation of the British Museum fragment (Internet Archive scan, opened)](https://archive.org/details/cuneiformparalle00rogeuoft): HTTP 200; content read.

## Batch writing screen

Mean of checked field scores: 11.00. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `82274d85f6bbb97dbe7741197fc740bcb1be5176d36df2c1950146522589f939`
- Notes SHA-256: `a93c16b5dca125321975554969e8526c6102a7787461d4be5f0c794138232629`
