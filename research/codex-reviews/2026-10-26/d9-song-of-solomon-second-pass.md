# D9: Song of Solomon second pass

Counts: 0 accept / 4 accept with fixes / 1 return to research.

Reviewed input: `research/claude-drafts/song-of-solomon-second-pass-records.json` and `song-of-solomon-second-pass-notes.md` at `f64e37cad5249adb660ab5377acbad2f52e04270`.

Packaged text and catalogs: `55e438a1071ac8629d5197cbf6c6db9d8346873e`. No draft was changed or merged.

Apply the shared review rules in [README](README.md). An acceptance with fixes is conditional on every listed fix.

The evidence/witness validator and exact KJV side-quote validator were used.
Greek and Hebrew spans were checked against the cited digital edition with Unicode and whitespace normalization.
A matched quotation does not by itself prove the proposed meaning. Findings below distinguish those checks.

## 1. Song 5:1 — the Greek has a clause before “I am come into my garden” that the KJV and Hebrew lack

ID: `let-my-kinsman-come-down-into-his-garden-first-clause-greek`

**Verdict: return to research.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Song of Solomon 5:1.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. The meaning threshold is not met yet; keep it out of app data.

### Findings and required changes

The invitation occurs in packaged KJV 4:16, immediately before 5:1. This is not a demonstrated added meaning in the passage. Claude must compare across the verse boundary, or withdraw the addition claim. Bread/honeycomb is expressly outside this draft and cannot rescue it without a new scoped proposal.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `reasoning`, replace these standalone forms with the existing plain English comparison: `בָּאתִי לְגַנִּי`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources.
- `reasoning`: split screened sentence(s) 2 (22 words; starts `The Greek verse has two sentences before that point is reached: Καταβήτω ἀδελφιδός μου εἰς κῆπον αὐτ`); 3 (37 words; starts `The KJV therefore has one speaker arriving in the garden; the Greek page first prints an invitation,`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope`: split screened sentence(s) 2 (28 words; starts `The verse is also not word for word the same at the end (the KJV has  , the Greek ἄρτον, ‘bread’); o`); 4 (22 words; starts `It does not show which wording is original, and it does not say what the Hebrew word means beyond th`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Song of Solomon 5: KJV](https://ebible.org/eng-kjv/SNG05.htm): HTTP 200; content read.
- [Song of Solomon 5: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/22/5/): HTTP 200; content read.
- [Song of Solomon 5: Brenton Greek edition of the Septuagint](https://ebible.org/grcbrent/SNG05.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/22/5/), printed verse(s): 1.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/SNG05.htm), printed verse(s): 1.

## 2. Song 5:8 — “I charge you” in the KJV; the Greek adds “by the powers and by the forces of the field”

ID: `i-charge-you-that-ye-tell-him-or-i-have-charged-you-by-the-powers-and-forces-of-the-field-greek`

**Verdict: accept with fixes.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Song of Solomon 5:8.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. Keep the limited comparison described below; add no history, science or Q claim.

### Findings and required changes

Combine the repeated oath finding with the 8:4 draft under this 5:8 record's stable ID. Include both passages and their distinct exact Greek phrases. The 5:8 phrase names powers and forces; do not quote it as identical to 8:4. The existing by-the-roes-and-by-the-hinds-of-the-field-or-by-the-powers-and-by-the-virtues-of-the-field-greek record covers 2:7 and 3:5. Its finding is animal names versus powers, whereas these new verses lack the oath basis in the KJV. Keep that distinction explicit; do not count a repeated phrasing explanation as another finding.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `reasoning`, replace these standalone forms with the existing plain English comparison: `הִשְׁבַּעְתִּי אֶתְכֶם בְּנוֹת יְרוּשָׁלִַם`; `אִם־תִּמְצְאוּ`; `Ὥρκισα ὑμᾶς θυγατέρες Ἱερουσαλήμ`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources.
- `reasoning`: split screened sentence(s) 1 (31 words; starts `The Hebrew has הִשְׁבַּעְתִּי אֶתְכֶם בְּנוֹת יְרוּשָׁלִַם and goes straight to אִם־תִּמְצְאוּ.`); 4 (27 words; starts `The KJV also has the women told the message as a clause, the Greek as a question, τί ἀπαγγείλητε αὐτ`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `reasoning` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources.
- `scope`: split screened sentence(s) 3 (27 words; starts `The KJV   and Brenton’s   are different English words for the same clause; this record does not rest`); 5 (22 words; starts `It does not show which wording is original, and it does not say what the Hebrew word means beyond th`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Song of Solomon 5: KJV](https://ebible.org/eng-kjv/SNG05.htm): HTTP 200; content read.
- [Song of Solomon 5: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/22/5/): HTTP 200; content read.
- [Song of Solomon 5: Brenton Greek edition of the Septuagint](https://ebible.org/grcbrent/SNG05.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/22/5/), printed verse(s): 8.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/SNG05.htm), printed verse(s): 8.

## 3. Song 8:2 — the KJV has “who would instruct me”; the Greek has “the chamber of her that conceived me”

ID: `i-would-instruct-me-in-my-mothers-house-or-into-the-chamber-of-her-that-conceived-me-greek`

**Verdict: accept with fixes.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence or side-quote schema fails as detailed below.

Passages: Song of Solomon 8:2.

KJV text quotes: 0/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. Keep the limited comparison described below; add no history, science or Q claim.

### Findings and required changes

Keep the instruction/chamber clause contrast at 8:2. In the KJV text and side quote, replace the curly apostrophe in mother's with the packaged straight apostrophe. Keep the stable ID despite its awkward wording; the displayed title already says who would instruct me.

Observed validator error: `i-would-instruct-me-in-my-mothers-house-or-into-the-chamber-of-her-that-conceived-me-greek: side quote is not an exact KJV substring at Song of Solomon 8:2`.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `reasoning`, replace these standalone forms with the existing plain English comparison: `אֶל־בֵּית אִמִּי תְּלַמְּדֵנִי`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary`: split screened sentence(s) 2 (21 words; starts `Brenton’s Greek brings him to the house and into the chamber of the woman who conceived her, and pri`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `summary` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources.
- `reasoning`: split screened sentence(s) 1 (26 words; starts `The Hebrew has אֶל־בֵּית אִמִּי תְּלַמְּדֵנִי, where the last word is the verb the KJV renders  .`); 2 (26 words; starts `The Greek prints εἰς οἶκον μητρός μου καὶ εἰς ταμεῖον τῆς συλλαβούσης με, adding a second place, ταμ`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `reasoning` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources.
- `scope`: split screened sentence(s) 2 (26 words; starts `KJV   is one reading of the Hebrew clause; this record does not say the Hebrew cannot be read otherw`); 4 (22 words; starts `It does not show which wording is original, and it does not say what the Hebrew word means beyond th`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Song of Solomon 8: KJV](https://ebible.org/eng-kjv/SNG08.htm): HTTP 200; content read.
- [Song of Solomon 8: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/22/8/): HTTP 200; content read.
- [Song of Solomon 8: Brenton Greek edition of the Septuagint](https://ebible.org/grcbrent/SNG08.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/22/8/), printed verse(s): 2.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/SNG08.htm), printed verse(s): 2.

## 4. Song 8:4 — the KJV charge is unsworn; the Greek adds “by the forces of the field”

ID: `i-charge-you-that-ye-stir-not-up-or-by-the-forces-of-the-field-that-ye-stir-not-up-greek`

**Verdict: accept with fixes.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Song of Solomon 8:4.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. Keep the limited comparison described below; add no history, science or Q claim.

### Findings and required changes

Accept only as an extension of the 5:8 oath finding, not a second duplicate card. Preserve 8:4's shorter forces phrase. Keep separate KJV/Greek quote sides and appliesTo entries for both verses.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `reasoning`, replace these standalone forms with the existing plain English comparison: `הִשְׁבַּעְתִּי אֶתְכֶם בְּנוֹת יְרוּשָׁלִַם`; `מַה־תָּעִירוּ`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources.
- `reasoning`: split screened sentence(s) 1 (44 words; starts `The Hebrew of this verse reads הִשְׁבַּעְתִּי אֶתְכֶם בְּנוֹת יְרוּשָׁלִַם and then מַה־תָּעִירוּ; n`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope`: split screened sentence(s) 2 (28 words; starts `The Hebrew of other verses (the Song’s earlier charges) is not compared here; the record is limited `); 4 (22 words; starts `It does not show which wording is original, and it does not say what the Hebrew word means beyond th`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Song of Solomon 8: KJV](https://ebible.org/eng-kjv/SNG08.htm): HTTP 200; content read.
- [Song of Solomon 8: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/22/8/): HTTP 200; content read.
- [Song of Solomon 8: Brenton Greek edition of the Septuagint](https://ebible.org/grcbrent/SNG08.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/22/8/), printed verse(s): 4.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/SNG08.htm), printed verse(s): 4.

## 5. Song 8:5 — “from the wilderness” in the KJV; the Greek has her “all white”

ID: `who-is-this-that-cometh-up-from-the-wilderness-or-who-is-this-that-comes-up-all-white-greek`

**Verdict: accept with fixes.**

Checks: 1 numeric references match their labels and exist; 2 Hebrew/Greek spans match cited source text. Raw evidence and side-quote schema passes.

Passages: Song of Solomon 8:5.

KJV text quotes: 1/1 exact packaged substrings. Range quotes are covered in the findings where present.

Tags/topics: `contradictions` / `T` and the existing witness enum fit the proposed edition comparison. Keep the limited comparison described below; add no history, science or Q claim.

### Findings and required changes

Keep wilderness/all white at 8:5 within Brenton's printed edition. Do not claim a survey of other Greek editions or all ancient copies.

### Additional language forms

These explanatory snippets are not verbatim substrings of the cited edition. They were checked separately from the full comparison quotes.

- In `reasoning`, replace these standalone forms with the existing plain English comparison: `מִן־הַמִּדְבָּר`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.
- In `scope`, replace these standalone forms with the existing plain English comparison: `ἀπὸ τῆς ἐρήμου`. Keep the exact edition quotation in `text`; do not add a dictionary claim without a lexical source.

### Writing fixes

- `summary` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources.
- `reasoning`: split screened sentence(s) 2 (28 words; starts `The Greek verse prints ἡ ἀναβαίνουσα λελευκανθισμένη, where the participle is the word Brenton gives`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `reasoning` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources.
- `scope`: split screened sentence(s) 5 (22 words; starts `It does not show which wording is original, and it does not say what the Hebrew word means beyond th`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.
- `scope` first-use wording: Brenton: use old Greek translation at first use; keep the full edition name in Sources; Septuagint: use old Greek translation at first use; retain the exact witness enum in data; manuscript: use ancient copies; witness: use ancient copies when it means textual evidence.

### Source checks

- [Song of Solomon 8: KJV](https://ebible.org/eng-kjv/SNG08.htm): HTTP 200; content read.
- [Song of Solomon 8: Hebrew, Westminster Leningrad Codex (WLC) digital text](https://bolls.life/get-text/WLC/22/8/): HTTP 200; content read.
- [Song of Solomon 8: Brenton Greek edition of the Septuagint](https://ebible.org/grcbrent/SNG08.htm): HTTP 200; content read.
- Exact language spans matched on [this cited page](https://bolls.life/get-text/WLC/22/8/), printed verse(s): 5.
- Exact language spans matched on [this cited page](https://ebible.org/grcbrent/SNG08.htm), printed verse(s): 5.

## Batch writing screen

Mean of checked field scores: 6.51. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `9e7379c05f8b5bdff9506fb6bec6ca8b4e6065950e47f2e1733bce344fe7abc6`
- Notes SHA-256: `7a4de875606ad97c0f0dd51f9ac81d8360be2d2028fea6b99bfcbea8f378a257`
