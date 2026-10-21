# 2 Samuel second pass (workstream D20), 2026-10-18

First-time reading of the 5 chapters with no published record: 7, 9, 11, 12, 22. All five read in full in the KJV (`data/chapters.json`). Hebrew (WLC via bolls.life) and Brenton's Greek and English (ebible.org) fetched by script; the Hebrew and Greek in the records are copied from the fetched text by script, and every `sides` quote was checked as an exact substring of the packaged KJV. Chapter 22 is the Psalm 18 parallel; its Hebrew was not re-compared with Psalm 18 here, and the four Psalm 18 / 2 Samuel 22 pairs already issued in `psalms-second-pass-records.json` (verses 8, 11, 42, 51) are not repeated. All records are drafts until Codex accepts them.

## Issued (10 records, `2-samuel-second-pass-records.json`; all T, witness Septuagint, status Context, none V)

- `shalt-thou-build-me-an-house-or-thou-shalt-not-build-2-samuel-7-5-greek` (7:5): Hebrew and KJV a question, Greek a flat negation. Scope concedes a rhetorical question can carry the same refusal. The published `the-word-of-the-lord-came-to-me-thou-hast-shed-blood-when-was-it-given` uses 7:5 on a different point.
- `as-i-took-it-from-saul-or-as-i-removed-from-those-whom-i-removed-2-samuel-7-15-greek` (7:15): Greek names no one.
- `from-the-nations-and-their-gods-or-nations-and-tents-2-samuel-7-23-greek` (7:23, last clause only): gods against tents; verse is difficult in all three texts and the scope says so.
- `land-of-saul-thy-father-or-saul-thy-fathers-father-2-samuel-9-7-greek` (9:7, with 9:6 as the B side): scope names the reconciliation (father as forefather).
- `abimelech-son-of-jerubbesheth-or-son-of-jerubbaal-son-of-ner-2-samuel-11-21-greek` (11:21, with Judges 9:1 in KJV only): Jerubbesheth against Jerubbaal, and Thebez against Thamasi. Judges 9 was not compared in Hebrew or Greek.
- `messenger-shewed-david-or-david-was-angry-with-joab-2-samuel-11-22-greek` (11:22, with 11:25): Greek adds David's anger and repeats the questions Joab predicted; the scope names the reconciliation.
- `restore-the-lamb-fourfold-or-sevenfold-2-samuel-12-6-greek` (12:6): four against seven. Exodus 22:1 and Proverbs 6:31 named but not compared in Greek. Codex may want to link to the published `exodus-burglary-restitution`.
- `given-occasion-to-the-enemies-to-blaspheme-or-provoked-the-enemies-2-samuel-12-14-greek` (12:14): "blaspheme" against "provoked"; scope does not gloss the Hebrew verb.
- `who-is-a-rock-save-our-god-or-who-is-a-creator-2-samuel-22-32-greek` (22:32): Greek uses πέτρα at 22:2 and κτίστης here.
- `a-bow-of-steel-or-a-bow-of-bronze-2-samuel-22-35-greek` (22:35): steel against bronze. Tagged T with witness Septuagint only: no lexicon was opened, and a shared root with the Leviticus 26:19 "brass" does not settle the Hebrew, so H is not claimed. Codex or the owner may judge whether H applies.

Checked: no published ID in `data/evidence.json` covers 2 Samuel 7:15, 7:23, 9:7, 11:21, 11:22, 12:6, 12:14, 22:32 or 22:35.

## Considered and ruled out

- 2 Samuel 11:3 Bathsheba "daughter of Eliam" against Greek "Eliab": the Greek of 23:34 also prints Eliab (son of Ahithophel), so the Greek is consistent with itself; a name spelling variant, no conflict stated.
- 11:1 "kings go forth" against the Hebrew written "messengers" (WLC marks it): ketiv/qere, background only.
- 12:30 "their king's crown" against Greek "crown of Molchom their king": the Hebrew מלכם is ambiguous in its consonants; no clear KJV-against-text difference shown.
- 12:25, 9:4, 9:12 name spellings (Jedidiah, Lodebar, Micha): spelling only.
- 7:6 "tabernacle" against Greek "lodging": no meaning difference shown.
- 7:7 "any of the tribes" against Greek "one tribe": the Hebrew has "one of the tribes"; the sense is the same.
- 7:10 "move no more" against Greek "be anxious no more": a verb sense question without a lexicon citation.
- 7:12–16 (the Davidic promise, "iniquity" at 7:14): covered by existing New Testament and Chronicles work; no wording clash found.
- 9:3 "kindness of God" against Greek "mercy of God": synonyms.
- 11:4 (purified), 11:8 (mess of meat), 11:15 (retire ye): Greek agrees in sense.
- 12:3 ewe lamb, 12:5 "shall surely die" against Greek "son of death": idiom.
- 12:8, 12:13, 12:20 "house of the Lord" against Greek "house of God": synonym.
- 12:31 saws, harrows, axes, brick-kiln: Greek names the same instruments; the nouns' exact sense is not settled by a digital edition.
- 22:3, 22:36, 22:44, 22:51: Greek differs in detail but chapter 22 is a Psalm 18 parallel handled in the Psalms pass; a clean 2 Samuel-only contrast was not found at these verses.
- David and Bathsheba (11:2–5) and Uriah (11:15) as V: Nathan's rebuke (12:7–9) and the narrator (11:27) condemn the acts, so not V.
- 11:11 Uriah's oath and 12:23 "I shall go to him": no statement that clashes with another passage.

## Ledger

`chapter-ledger.json`, 2 Samuel `secondPass`: all 5 chapters `records-draft` (7, 9, 11, 12, 22).

## For the owner

No question. Next D unit: remaining no-record chapters (Joshua, Judges, Ruth, Ezra, Nehemiah, Esther, Daniel, Hosea, Jonah, Micah, Zephaniah, Matthew, John, Acts, Romans, 1 Corinthians, Galatians, Ephesians, Hebrews, Revelation) by ledger.
