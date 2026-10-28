# D25: Joshua, Judges and Ruth

Counts: 0 accept / 5 accept with fixes / 3 return to research.

Reviewed input: `research/claude-drafts/ot-remainder-1-second-pass-records.json` and `ot-remainder-1-second-pass-notes.md` at `f64e37cad5249adb660ab5377acbad2f52e04270`.

Packaged text and catalogs: `55e438a1071ac8629d5197cbf6c6db9d8346873e`. No draft was changed or merged.

Apply the shared review rules in [README](README.md). An acceptance with fixes is conditional on every listed fix.

The evidence/witness validator and exact KJV side-quote validator were used.
Greek and Hebrew spans were checked against the cited digital edition with Unicode and whitespace normalization.
A matched quotation does not by itself prove the proposed meaning. Findings below distinguish those checks.

## 1. Joshua 20:4–6 (the elders' hearing at the gate) — absent from Brenton’s Greek

ID: `the-slayer-at-the-gate-of-the-city-or-no-such-verses-joshua-20-4-6-greek`

**Verdict: accept with fixes.**

Checks: 3 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence or side-quote schema fails as detailed below.

Passages: Joshua 20:4; Joshua 20:5; Joshua 20:6.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. Keep the limited comparison described below; add no history, science or Q claim.

### Findings and required changes

Set ref to Joshua 20:4. Set appliesTo to Joshua 20:4, Joshua 20:5 and Joshua 20:6 as three strings. The joined KJV quotation matches all three packaged verses. Keep the limit to the cited Greek page, which jumps from verse 3 to verse 7; do not infer the direction of textual change.

Observed validator error: `the-slayer-at-the-gate-of-the-city-or-no-such-verses-joshua-20-4-6-greek: invalid reference Joshua 20:4–6`.

### Writing fixes

- `summary` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources.
- `reasoning`: split screened sentence(s) 2 (22 words; starts `The Greek keeps the central point (the city shelters the slayer until he stands before the congregat`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope`: split screened sentence(s) 1 (32 words; starts `T applies at Joshua 20:4–6 only and compares what is present: the Hebrew and KJV have the gate-heari`); 2 (31 words; starts `This record does not say the Greek dropped them or the Hebrew added them, and it does not say the co`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Joshua 20: KJV](https://ebible.org/eng-kjv/JOS20.htm): HTTP 200; content read.
- [Joshua 20: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/6/20/): HTTP 200; content read.
- [Joshua 20: Brenton Greek edition of the Septuagint](https://ebible.org/grcbrent/JOS20.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/6/20/), printed verse(s): 4,5,6.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/JOS20.htm), printed verse(s): 3,7.

## 2. Ephraim “went northward” (Judges 12:1) — the Greek has a place, “Boraran”

ID: `went-northward-or-passed-to-boraan-judges-12-1-greek`

**Verdict: return to research.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Judges 12:1.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. The meaning threshold is not met yet; keep it out of app data.

### Findings and required changes

The claim that Βοῤῥᾶν names a place is not established by the quoted Greek. Brenton's own English reads north. Capitalization is not proof of a place name. Claude must resolve this with a cited lexical discussion before claiming a T difference.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `summary`, replace these standalone forms with the existing plain English comparison: `צָפֹונָה`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `reasoning` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `scope`: split screened sentence(s) 3 (27 words; starts `The Hebrew form can carry either sense, so this record does not say the KJV mistranslates or that th`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Judges 12: KJV](https://ebible.org/eng-kjv/JDG12.htm): HTTP 200; content read.
- [Judges 12: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/7/12/): HTTP 200; content read.
- [Judges 12: Brenton Greek edition of the Septuagint](https://ebible.org/grcbrent/JDG12.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/7/12/), printed verse(s): 1.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/JDG12.htm), printed verse(s): 1.
- [Brenton’s English on the same chapter](https://ebible.org/eng-Brenton/JDG12.htm) was also read. Its wording exposes the gloss issue described above; it is not a substitute for lexical research.

## 3. Jephthah “buried in one of the cities of Gilead” (Judges 12:7) — the Greek has “in his city Galaad”

ID: `buried-in-one-of-the-cities-of-gilead-or-in-his-city-gilead-judges-12-7-greek`

**Verdict: accept with fixes.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Judges 12:7.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. Keep the limited comparison described below; add no history, science or Q claim.

### Findings and required changes

Keep the plural cities versus his city contrast at 12:7. Remove any implication that the Greek settles whether Gilead is a city or a region; the draft's own scope leaves that open.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `summary`, replace these standalone forms with the existing plain English comparison: `בְּעָרֵי גִלְעָד`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary`: split screened sentence(s) 2 (26 words; starts `The Hebrew is בְּעָרֵי גִלְעָד (in the cities of Gilead); the Greek prints a single city, ἐν πόλει α`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `reasoning` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `scope`: split screened sentence(s) 3 (33 words; starts `This record does not say where Jephthah was buried, whether Gilead names a city or a region here, or`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Judges 12: KJV](https://ebible.org/eng-kjv/JDG12.htm): HTTP 200; content read.
- [Judges 12: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/7/12/): HTTP 200; content read.
- [Judges 12: Brenton Greek edition of the Septuagint](https://ebible.org/grcbrent/JDG12.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/7/12/), printed verse(s): 7.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/JDG12.htm), printed verse(s): 7.

## 4. Micah pays the Levite “by the year” (Judges 17:10) — the Greek has “a day”

ID: `ten-shekels-by-the-year-or-ten-of-silver-a-day-judges-17-10-greek`

**Verdict: accept with fixes.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Judges 17:10.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. Keep the limited comparison described below; add no history, science or Q claim.

### Findings and required changes

Keep the year/day contrast at 17:10. Do not turn the unstated unit of silver into another finding. This comparison does not establish which reading is original.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `summary`, replace these standalone forms with the existing plain English comparison: `לַיָּמִים`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `reasoning`: split screened sentence(s) 2 (25 words; starts `The KJV reads it as   (yearly pay); the Greek reads it as a daily payment, which would be a very dif`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope`: split screened sentence(s) 1 (37 words; starts `T applies at Judges 17:10 only and compares the pay interval and the unit: year (KJV),   (Hebrew), d`); 2 (24 words; starts `This record does not say which interval is intended, whether the Greek is a misreading, or that eith`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Judges 17: KJV](https://ebible.org/eng-kjv/JDG17.htm): HTTP 200; content read.
- [Judges 17: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/7/17/): HTTP 200; content read.
- [Judges 17: Brenton Greek edition of the Septuagint](https://ebible.org/grcbrent/JDG17.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/7/17/), printed verse(s): 10.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/JDG17.htm), printed verse(s): 10.

## 5. Micah’s “house of gods” (Judges 17:5) — the Greek has “house of God”

ID: `an-house-of-gods-or-a-house-of-god-judges-17-5-greek`

**Verdict: accept with fixes.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Judges 17:5.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. Keep the limited comparison described below; add no history, science or Q claim.

### Findings and required changes

Keep singular God versus plural gods at 17:5 as an English/Greek wording comparison. Do not infer that Hebrew grammar settles Micah's intended deity or call the KJV wrong.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `summary`, replace these standalone forms with the existing plain English comparison: `בֵּית אֱלֹהִים`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.
- In `reasoning`, replace these standalone forms with the existing plain English comparison: `אֱלֹהִים`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `reasoning`: split screened sentence(s) 1 (21 words; starts `The Hebrew word אֱלֹהִים is plural in form and is used for the one God and for gods.`); 2 (24 words; starts `The KJV takes it as  , in keeping with the images and teraphim of the same verse; the Greek takes it`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope`: split screened sentence(s) 2 (24 words; starts `The Hebrew form allows both readings, so this is a difference in how the word is taken, not a clash `); 3 (25 words; starts `The record does not say which reading the author meant or that the KJV is wrong. 17:3 and 17:13 ( ) `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Judges 17: KJV](https://ebible.org/eng-kjv/JDG17.htm): HTTP 200; content read.
- [Judges 17: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/7/17/): HTTP 200; content read.
- [Judges 17: Brenton Greek edition of the Septuagint](https://ebible.org/grcbrent/JDG17.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/7/17/), printed verse(s): 5.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/JDG17.htm), printed verse(s): 5.

## 6. Orpah “kissed her mother in law” (Ruth 1:14) — the Greek adds that she returned to her people

ID: `orpah-kissed-her-mother-in-law-or-and-returned-to-her-people-ruth-1-14-greek`

**Verdict: return to research.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Ruth 1:14.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. The meaning threshold is not met yet; keep it out of app data.

### Findings and required changes

The owner already rejected this Orpah addition because Ruth 1:15 gives her return in the same passage. Accurate quotation does not reopen that ruling. Withdraw the repeated proposal; do not seek a new ruling under a new ID.

### Writing fixes

- `summary` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources.
- `reasoning` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `scope`: split screened sentence(s) 2 (23 words; starts `The Greek addition agrees with verse 15 in all three texts, so it states nothing the story does not `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Ruth 1: KJV](https://ebible.org/eng-kjv/RUT01.htm): HTTP 200; content read.
- [Ruth 1: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/8/1/): HTTP 200; content read.
- [Ruth 1: Brenton Greek edition of the Septuagint](https://ebible.org/grcbrent/RUT01.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/8/1/), printed verse(s): 14.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/RUT01.htm), printed verse(s): 14.

## 7. “The Almighty hath dealt very bitterly” (Ruth 1:20) — the Greek has “the Sufficient One”

ID: `the-almighty-or-the-sufficient-one-ruth-1-20-greek`

**Verdict: return to research.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Ruth 1:20.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. The meaning threshold is not met yet; keep it out of app data.

### Findings and required changes

The proposed sufficient/Almighty distinction is not shown to exclude the KJV sense. Brenton's English uses Mighty One. Claude needs a cited contextual sense distinction, not a new English gloss alone.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `summary`, replace these standalone forms with the existing plain English comparison: `שַׁדַּי`; `ὁ ἱκανός`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `reasoning`: split screened sentence(s) 1 (25 words; starts `The Hebrew divine title is carried by a Greek word meaning sufficient or able, here and again in ver`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope`: split screened sentence(s) 1 (63 words; starts `T applies at Ruth 1:20 (and 1:21 for the same Greek word) and compares one divine title as rendered.`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Ruth 1: KJV](https://ebible.org/eng-kjv/RUT01.htm): HTTP 200; content read.
- [Ruth 1: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/8/1/): HTTP 200; content read.
- [Ruth 1: Brenton Greek edition of the Septuagint](https://ebible.org/grcbrent/RUT01.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/8/1/), printed verse(s): 20.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/RUT01.htm), printed verse(s): 20.
- [Brenton’s English on the same chapter](https://ebible.org/eng-Brenton/RUT01.htm) was also read. Its wording exposes the gloss issue described above; it is not a substitute for lexical research.

## 8. “The LORD hath testified against me” (Ruth 1:21) — the Greek has “the Lord humbled me”

ID: `the-lord-hath-testified-against-me-or-the-lord-humbled-me-ruth-1-21-greek`

**Verdict: accept with fixes.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence or side-quote schema fails as detailed below.

Passages: Ruth 1:21.

KJV text quotes: 0/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. Keep the limited comparison described below; add no history, science or Q claim.

### Findings and required changes

Keep the testified/humbled contrast at 1:21 within the named editions. Repair the KJV text and side quote to the packaged spelling and punctuation: remove the comma after full and use Lord, not LORD, at both occurrences. Do not assert a Hebrew lexical conclusion without a lexical source.

Observed validator error: `the-lord-hath-testified-against-me-or-the-lord-humbled-me-ruth-1-21-greek: side quote is not an exact KJV substring at Ruth 1:21`.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `summary`, replace these standalone forms with the existing plain English comparison: `וַיהוָה עָנָה בִי`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.
- In `reasoning`, replace these standalone forms with the existing plain English comparison: `עָנָה`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary` has no flagged length or glossary issue. Retain the source and meaning fixes above.
- `reasoning`: split screened sentence(s) 1 (21 words; starts `The Hebrew verb עָנָה can be read as   or as  ; the KJV takes the first, the Greek the second.`); 2 (24 words; starts `In the Hebrew, Naomi’s next clause ( ) already says harm, so the clause is either a charge of testim`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope`: split screened sentence(s) 2 (39 words; starts `Without a lexicon opened here this record does not say which sense is correct; it only records that `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Ruth 1: KJV](https://ebible.org/eng-kjv/RUT01.htm): HTTP 200; content read.
- [Ruth 1: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/8/1/): HTTP 200; content read.
- [Ruth 1: Brenton Greek edition of the Septuagint](https://ebible.org/grcbrent/RUT01.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/8/1/), printed verse(s): 21.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/RUT01.htm), printed verse(s): 21.

## Batch writing screen

Mean of checked field scores: 6.56. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `d6df116480174bc48e6702cbcbe850ca1fcf1c869c7726fba98c457cf783dca1`
- Notes SHA-256: `d4584d0e618cba7dbd767ba04e2da297eca3c08c11172e52b9b3780833d5245a`
