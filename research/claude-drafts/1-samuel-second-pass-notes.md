# 1 Samuel second pass (workstream D15), 2026-10-18

First-time reading of the 8 chapters with no published record: 2, 5, 6, 20, 23, 24, 26, 29. All 8 read in full in the KJV (`data/chapters.json`) and set beside Brenton's English. Hebrew (WLC via bolls.life) and Brenton's Greek (ebible.org) were fetched by script; the Hebrew and Greek in the records are copied from the fetched text. Verse numbers match in the KJV, Hebrew and Brenton at every verse used (Brenton's English in chapter 24 is offset by one verse from the KJV; no chapter 24 verse is used). All records are drafts until Codex accepts them.

## Issued (9 records, `1-samuel-second-pass-records.json`; all T Septuagint, status Context, none V)

- `ark-sent-to-ekron-or-ascalon-1-samuel-5-10-6-16` (5:10, 6:16): Hebrew עֶקְרוֹן, Greek Ascalon, in both verses.
- `eli-heard-how-his-sons-lay-with-the-women-or-greek-lacks-clause-1-samuel-2-22` (2:22): Greek lacks the clause about the women at the door. Held back by the 1 Samuel Q session; issued now. The Shiloh Q record quotes the Greek but does not tag it.
- `if-one-man-sin-against-another-the-judge-or-they-shall-pray-1-samuel-2-25` (2:25): Hebrew אֱלֹהִים rendered "the judge" in the KJV; Greek "they shall pray for him to the Lord". The scope admits the KJV reading is a recognised one.
- `hannah-song-his-king-or-our-kings-1-samuel-2-10` (2:10): Hebrew singular "his king", Greek plural "our kings"; Greek verse also holds extra material (compare Jeremiah 9:23-24).
- `bethshemesh-men-looked-into-the-ark-or-sons-of-jechonias-not-pleased-1-samuel-6-19` (6:19): Greek adds the "sons of Jechonias were not pleased" clause. Held back earlier; the numbers (seventy, fifty thousand) agree and are not reopened.
- `david-men-six-hundred-or-four-hundred-keilah-1-samuel-23-13` (23:13): Hebrew six hundred, Greek four hundred; 22:2 and 25:13 (KJV) say four hundred, 27:2 and 30:9 six hundred.
- `saul-lay-in-the-trench-or-in-a-chariot-1-samuel-26-5-26-7` (26:5, 26:7): Hebrew מַּעְגָּל, KJV "trench", Greek λαμπήνη ("chariot" in Brenton's English). Scope says the Hebrew word has several senses and no KJV mistranslation is claimed.
- `king-of-israel-come-out-to-seek-a-flea-or-thy-life-1-samuel-26-20` (26:20): Hebrew "one flea" (as in 24:14), Greek "my life". Brenton's English says "thy life" but the Greek is μου; the record follows the Greek.
- `achish-david-with-me-these-days-or-these-years-or-second-year-1-samuel-29-3` (29:3): Hebrew "days or years", Greek "days, this second year".

No existing ID in `data/evidence.json` or earlier drafts covers these verses (checked by script on chapter 2, 5, 6, 20, 23, 24, 26, 29 refs; the only hit is the Shiloh Q record at 2:22, noted above).

## Considered and ruled out

- 2:11 Hebrew "Elkanah went to Ramah" against Greek "she left him there... and departed": subject and verb change in a transitional clause; no conflict between the two.
- 2:29 "kick ye" (תִבְעֲטוּ) against Greek "looked with a shameless eye": a lexical question needing a dictionary citation.
- 2:31-33 (the arm cut off, "an enemy in my habitation"): the Greek is shorter and differs in sense, but I could not state a plain contrast without a longer comparison; not issued to keep the batch small.
- 2:21 "bare three sons and two daughters" against Greek "bore yet three sons": same count.
- 5:6 and 6:1 Greek additions about mice: already ruled out in the 1 Samuel notes (KJV already has the mice at 6:4-5).
- 6:4-5 five emerods and five mice, 6:18 "stone of Abel" against Greek "the great stone": the Greek reads the Hebrew אָבֵל as a stone; a name or noun question, not issued.
- 6:14, 6:18 Joshua / Osee: a name spelling.
- 20:14-16, 20:19, 20:41 "stone Ezel": Brenton notes the Greek obscures the Hebrew; the Greek treats the Hebrew word as the name "ergab". Not a contrast that can be stated plainly.
- 20:29 "my brother, he hath commanded me" against Greek "my brethren": a plural/singular detail inside David's excuse; no conflict stated.
- 23:11-12 Greek puts the answer "It will be shut up" at 23:11; Brenton marks 23:12 as supplied from the Alexandrian text. A real textual note, not a clean contrast; left out.
- 23:14-19 place names (Maserem, Cæne, Echela, Messara): transliterations of Hebrew names and nouns; not issued.
- 24:2 "rocks of the wild goats" against Greek Saddaeem: the Greek turns the Hebrew noun into a name. Not issued.
- 24 and 26: the sparing of Saul twice; this is a story-level doublet, not a wording contrast, and the Hebrew and Greek agree on the two accounts.
- 26:6 "Ahimelech the Hittite" and 26:19 "serve other gods": Greek agrees.
- 29:9 "angel of God": Brenton's English notes that the Hebrew and Alexandrian text have "an angel of God" and the Vaticanus-based text lacks it; the Greek I fetched at that verse omits it. Not issued.

## Ledger

`chapter-ledger.json`, 1 Samuel `secondPass`: 6 chapters `records-draft` (2, 5, 6, 23, 26, 29); 2 `reviewed-none` (20, 24). KJV level read in full; Hebrew and Greek read only at flagged verses.

## For the owner

No question. Next D unit: Genesis (8 no-record chapters), then Luke and Zechariah.
