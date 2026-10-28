# D21: Esther second pass

Counts: 0 accept / 2 accept with fixes / 3 return to research.

Reviewed input: `research/claude-drafts/esther-second-pass-records.json` and `esther-second-pass-notes.md` at `f64e37cad5249adb660ab5377acbad2f52e04270`.

Packaged text and catalogs: `55e438a1071ac8629d5197cbf6c6db9d8346873e`. No draft was changed or merged.

Apply the shared review rules in [README](README.md). An acceptance with fixes is conditional on every listed fix.

The evidence/witness validator and exact KJV side-quote validator were used.
Greek and Hebrew spans were checked against the cited digital edition with Unicode and whitespace normalization.
A matched quotation does not by itself prove the proposed meaning. Findings below distinguish those checks.

## 1. Esther draws near and touches the top of the sceptre — in Brenton’s Greek the king lifts it and lays it on her neck

ID: `esther-drew-near-and-touched-the-sceptre-or-the-king-laid-it-on-her-neck-esther-5-2-greek`

**Verdict: accept with fixes.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Esther 5:2.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. Keep the limited comparison described below; add no history, science or Q claim.

### Findings and required changes

Keep the touch/neck action difference. Label the printed Greek counterpart 5:1e while linking the KJV 5:2. Do not treat this action alone as proof of incompatible events.

### Writing fixes

- `summary` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources.
- `reasoning`: split screened sentence(s) 1 (37 words; starts `The Hebrew has Esther approach and touch the sceptre the king held out; the Greek has no touch by Es`); 2 (26 words; starts `In the Greek the welcome is the rod laid on her neck and a greeting; in the Hebrew it is the sceptre`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope`: split screened sentence(s) 2 (41 words; starts `It does not say the Hebrew and Greek accounts cannot both be true as one scene (the Greek has alread`); 10 (22 words; starts `The Greek Esther prints extra passages under lettered labels (such as 5:1e); the label is quoted as `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Esther 5: KJV](https://ebible.org/eng-kjv/EST05.htm): HTTP 200; content read.
- [Esther 5: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/17/5/): HTTP 200; content read.
- [Esther 5: Brenton Greek edition of the Septuagint (the Greek Esther page is ESG05)](https://ebible.org/grcbrent/ESG05.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/17/5/), printed verse(s): 2.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/ESG05.htm), printed verse(s): 2.

## 2. Esther “obtained favour in his sight” — Brenton’s Greek says God changed the king’s spirit to gentleness

ID: `she-obtained-favour-in-his-sight-or-god-changed-the-spirit-of-the-king-esther-5-1-greek`

**Verdict: accept with fixes.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Esther 5:2.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. Keep the limited comparison described below; add no history, science or Q claim.

### Findings and required changes

Avoid a second card for the same God-naming finding. Propose this as an extension of god-named-in-the-greek-of-esther-where-the-kjv-names-none, preserving its existing four comparisons. Label Greek 5:1e and KJV 5:2 separately. Revise that record's old exclusion of lettered verses only if this extension is later approved for integration.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `summary`, replace these standalone forms with the existing plain English comparison: `נָשְׂאָה חֵן`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary`: split screened sentence(s) 1 (21 words; starts `KJV and Hebrew Esther 5:2 say the queen carried favour in the king’s eyes (נָשְׂאָה חֵן).`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `reasoning` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `scope`: split screened sentence(s) 3 (31 words; starts `It does not say that the Hebrew excludes God’s action, that the Greek addition is later or earlier, `); 4 (52 words; starts `Brenton’s Greek names God in other places where the KJV does not (2:20, 4:8, 6:1, 6:13), already cov`); 10 (22 words; starts `The Greek Esther prints extra passages under lettered labels (such as 5:1e); the label is quoted as `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Esther 5: KJV](https://ebible.org/eng-kjv/EST05.htm): HTTP 200; content read.
- [Esther 5: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/17/5/): HTTP 200; content read.
- [Esther 5: Brenton Greek edition of the Septuagint (the Greek Esther page is ESG05)](https://ebible.org/grcbrent/ESG05.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/17/5/), printed verse(s): 2.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/ESG05.htm), printed verse(s): 1e.

## 3. Esther would have “held my tongue” — Brenton’s Greek has “I disregarded … the adversary is not worthy of the king’s court”

ID: `i-had-held-my-tongue-or-i-disobeyed-the-adversary-is-not-worthy-of-the-court-esther-7-4-greek`

**Verdict: return to research.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Esther 7:4.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. The meaning threshold is not met yet; keep it out of app data.

### Findings and required changes

The disregarded/disobeyed gloss and the proposed changed meaning lack a cited lexical check. Brenton's English uses consented, and the draft admits the statements may make the same point. Claude must establish the contextual difference before a T card can be accepted.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `scope`, replace these standalone forms with the existing plain English comparison: `נזק`; `παρακούω`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary`: split screened sentence(s) 1 (25 words; starts `The Hebrew has Esther say she would have kept silent had they been sold as slaves, because the adver`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `reasoning`: split screened sentence(s) 1 (35 words; starts `The two clauses start from the same sentence but give a different verb for Esther’s act and a differ`); 2 (23 words; starts `The Hebrew sets a hypothetical (if only slaves, she would have kept silent); the Greek has an unexpl`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope`: split screened sentence(s) 3 (29 words; starts `No lexicon was opened for παρήκουσα (a form of παρακούω) or for נזק, so the glosses are the research`); 4 (28 words; starts `The record does not say the Greek mistranslates, nor that the two sentences cannot share one point (`); 10 (22 words; starts `The Greek Esther prints extra passages under lettered labels (such as 5:1e); the label is quoted as `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Esther 7: KJV](https://ebible.org/eng-kjv/EST07.htm): HTTP 200; content read.
- [Esther 7: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/17/7/): HTTP 200; content read.
- [Esther 7: Brenton Greek edition of the Septuagint (the Greek Esther page is ESG07)](https://ebible.org/grcbrent/ESG07.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/17/7/), printed verse(s): 4.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/ESG07.htm), printed verse(s): 4.
- [Brenton’s English on the same chapter](https://ebible.org/eng-Brenton/ESG07.htm) was also read. Its wording exposes the gloss issue described above; it is not a substitute for lexical research.

## 4. The king “laid a tribute upon the land, and upon the isles of the sea” — Brenton’s Greek has him write upon the kingdom of land and sea

ID: `laid-a-tribute-upon-the-land-and-the-isles-or-wrote-upon-the-kingdom-of-land-and-sea-esther-10-1-greek`

**Verdict: return to research.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Esther 10:1.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. The meaning threshold is not met yet; keep it out of app data.

### Findings and required changes

The claim that the Greek describes writing instead of a levy is not established. Brenton's English explicitly describes a tax. Claude must check the verb in context; a literal gloss alone is insufficient. A separate islands/sea finding would need its own narrowed draft.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `summary`, replace these standalone forms with the existing plain English comparison: `מַס`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.
- In `scope`, replace these standalone forms with the existing plain English comparison: `מס`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary`: split screened sentence(s) 1 (24 words; starts `KJV and Hebrew Esther 10:1 say the king set a levy (מַס) on the land and on the islands of the sea.`); 2 (23 words; starts `Brenton’s Greek says the king wrote upon the kingdom of the land and of the sea; there is no levy an`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `summary` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources.
- `reasoning`: split screened sentence(s) 1 (28 words; starts `The Hebrew states an act of taxation or forced labour on land and islands; the Greek states an act o`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope`: split screened sentence(s) 2 (31 words; starts `The Hebrew noun מס is rendered   by the KJV; it can mean forced labour or a levy, and no lexicon was`); 9 (22 words; starts `The Greek Esther prints extra passages under lettered labels (such as 5:1e); the label is quoted as `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Esther 10: KJV](https://ebible.org/eng-kjv/EST10.htm): HTTP 200; content read.
- [Esther 10: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/17/10/): HTTP 200; content read.
- [Esther 10: Brenton Greek edition of the Septuagint (the Greek Esther page is ESG10)](https://ebible.org/grcbrent/ESG10.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/17/10/), printed verse(s): 1.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/ESG10.htm), printed verse(s): 1.
- [Brenton’s English on the same chapter](https://ebible.org/eng-Brenton/ESG10.htm) was also read. Its wording exposes the gloss issue described above; it is not a substitute for lexical research.

## 5. Mordecai “was next unto king Ahasuerus” — Brenton’s Greek says he “succeeded” (διεδέχετο) king Artaxerxes

ID: `mordecai-next-unto-the-king-or-took-over-from-king-artaxerxes-esther-10-3-greek`

**Verdict: return to research.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Esther 10:3.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. The meaning threshold is not met yet; keep it out of app data.

### Findings and required changes

The draft's succeeded interpretation is not shown to differ from a deputy role. Brenton's English calls Mordecai a viceroy. Claude must document the contextual sense before claiming a succession difference.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `summary`, replace these standalone forms with the existing plain English comparison: `מִשְׁנֶה לַמֶּלֶךְ`; `διαδέχομαι`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `reasoning`: split screened sentence(s) 1 (27 words; starts `The Hebrew places Mordecai in the second rank under a living king; the Greek verb, read in its commo`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope`: split screened sentence(s) 1 (49 words; starts `T applies at Esther 10:3 only and compares the rank statement. διαδέχομαι is also used of one who ta`); 8 (22 words; starts `The Greek Esther prints extra passages under lettered labels (such as 5:1e); the label is quoted as `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Esther 10: KJV](https://ebible.org/eng-kjv/EST10.htm): HTTP 200; content read.
- [Esther 10: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/17/10/): HTTP 200; content read.
- [Esther 10: Brenton Greek edition of the Septuagint (the Greek Esther page is ESG10)](https://ebible.org/grcbrent/ESG10.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/17/10/), printed verse(s): 3.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/ESG10.htm), printed verse(s): 3.
- [Brenton’s English on the same chapter](https://ebible.org/eng-Brenton/ESG10.htm) was also read. Its wording exposes the gloss issue described above; it is not a substitute for lexical research.

## Batch writing screen

Mean of checked field scores: 8.19. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `1698990a2100433de14c69d972cd3a2c871363613bb502e09e68a75d3e5b29d0`
- Notes SHA-256: `b5c18e315ed44f5df53fd5b7bc1a02ce11d95499e05be40a63f39c4054f6d5d8`
