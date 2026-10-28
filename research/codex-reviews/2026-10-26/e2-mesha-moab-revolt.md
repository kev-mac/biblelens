# E2: Moab's revolt against Israel (Mesha)

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

## 1. Moab's revolt against Israel (Mesha)

ID: `mesha-moab-revolt`

**Verdict: return to research.**

Checks: every verse in the proposed passage ranges exists. Raw timeline schema fails for the two reasons above.

Passages: 2 Kings 1:1; 2 Kings 3:4-5; 2 Kings 3:27.

[Louvre object record](https://collections.louvre.fr/en/ark%3A/53355/cl010120339); [translation adapted from Smelik](https://www.livius.org/sources/content/anet/320-the-stela-of-mesha/). Both opened. The forty-years line is visible, but identifying the son and aligning the reigns remains unresolved.

### Findings and required changes

Cook confirms the basic Omri/Moab comparison, but the draft fixes the stone at c. 850 BCE and calls the accounts the same revolt. Neither point is established by that comparison. The Louvre catalog and the translation adapted from Smelik support a ninth-century setting and the named rulers, not a settled alignment of every event. Claude must resolve the date and the son/forty-years wording against a current edition, or remove those proposed alignments. Keep victory claims attributed to Mesha. Existing numbers-gad-ataroth-inscription covers Gad at Ataroth only; do not silently replace its scope with the whole revolt.

Observed validator error: `Timeline draft uses unresolved evidence_id: TBD-history-mesha-moab-revolt`.

### Writing fixes

- `summary`: split screened sentence(s) 1 (25 words; starts `2 Kings 3:4-5 says Mesha king of Moab paid Israel a very large tribute in lambs and wool and rebelle`); 2 (41 words; starts `The Mesha inscription, written from the Moabite side, says Omri king of Israel afflicted Moab many d`); 4 (27 words; starts `It does not mention the allied invasion of 2 Kings 3 or the king of Edom, and silence in a victory t`); 5 (23 words; starts `How the 'forty years' and the 'son' of Omri fit the Kings chronology is a matter of reading and rest`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `academic_consensus`: split screened sentence(s) 2 (22 words; starts `850 BCE) names Omri king of Israel, says Israel oppressed Moab and that Mesha regained Israelite-hel`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `traditional_date` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `review_status` has no flagged length or glossary issue. Retain the source and meaning fixes above.

### Source checks

- [Cook (1903), A Text-book of North-Semitic Inscriptions, no. 1: Moabite Stone, text and translation (Internet Archive scan, opened)](https://archive.org/details/atextbooknorths00cookgoog): HTTP 200; content read.

## Batch writing screen

Mean of checked field scores: 7.80. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `82274d85f6bbb97dbe7741197fc740bcb1be5176d36df2c1950146522589f939`
- Notes SHA-256: `a93c16b5dca125321975554969e8526c6102a7787461d4be5f0c794138232629`
