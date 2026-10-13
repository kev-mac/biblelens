# Ecclesiastes and Song of Solomon — notes (2026-10-13)

File: `ecclesiastes-to-song-of-solomon-records.json` (20 records: 20 T, all witness “Septuagint”; no V; no untagged; all carry `sides`, none a side B). All records are drafts until Codex accepts them. Q records are in `ecclesiastes-to-song-of-solomon-q-records.json` with their own notes.

## Why each record qualifies (one line each)

Ecclesiastes (12)
- 1:17 — KJV “madness and folly”; Greek prints “parables and understanding” (the same Greek edition prints “madness” and “folly” at 2:12).
- 2:8 — KJV “as musical instruments, and that of all sorts”; Greek names “a butler and female cupbearers”.
- 2:12 — KJV “after the king”; Greek “after counsel”.
- 2:25 — KJV “who else can hasten hereunto, more than I”; Greek “who shall drink, without him”.
- 3:18 — KJV “God might manifest them”; Greek “God will judge them”.
- 8:1 — KJV “the boldness of his face shall be changed”; Greek “a man of shameless countenance will be hated”; the KJV’s two opening questions are not printed in the Greek verse (noted, not the basis).
- 8:10 — KJV “forgotten in the city”; Greek “praised in the city, because they had done thus”.
- 8:12 — KJV “an hundred times”; Greek prints no figure (asserted by script: no number word in the Greek verse).
- 10:1 — KJV “a little folly” does harm; Greek “a little wisdom is more precious than great glory of folly”.
- 10:10 — KJV “wisdom is profitable to direct”; Greek clause carries a negative (“skill is of no advantage”).
- 10:11 — KJV “a babbler”; Greek “the charmer”.
- 12:5 — KJV “desire shall fail”; Greek “the caper shall be scattered”, and a different verb for the insect.

Song of Solomon (8)
- 1:2 (with 4:10 and 7:12) — KJV “love”/“loves”; Greek “breasts”.
- 1:10 — KJV “rows of jewels”; Greek “as those of a dove”.
- 2:7 (with 3:5) — KJV “the roes… the hinds”; Greek “the powers… the virtues”.
- 2:12 — KJV “the singing of birds”; Greek “pruning”.
- 6:4 — KJV name “Tirzah”; Greek “Pleasure” (scope says the two may name the same thing).
- 6:7 — KJV “temples within thy locks”; Greek “cheek… without thy veil”.
- 6:13 — KJV “Shulamite”; Greek “Sunamite” (printed twice in the Greek).
- 7:9 — KJV “lips of those that are asleep”; Greek “my lips and teeth”.

No Hebrew-witness T record: every candidate would have needed a dictionary source to show a difference of meaning, so the Hebrew is quoted only for the printed words and each record says it does not gloss them.

## Verse numbers

- Ecclesiastes: the KJV has 16 verses in chapter 4 and 20 in chapter 5; WLC and Brenton’s Greek have 17 and 19 (KJV 5:1 is 4:17 there). None of the verses quoted is in chapters 4–5. Elsewhere WLC and Brenton print the KJV count in every chapter (checked with `lab.mjs`). Brenton prints no lettered verses in either book.
- Song of Solomon: KJV 6:13 is 7:1 in WLC and in Brenton’s Greek, and KJV 7:n is 7:(n+1). Quoted: 6:13 (Hebrew and Greek 7:1), 7:9 (7:10), 7:12 (7:13). Both numbers are given in each record.
- Brenton’s Greek pages answer at `grcbrent/ECC{cc}.htm` and `grcbrent/SNG{cc}.htm`; English at `eng-Brenton/ECC{cc}.htm` and `eng-Brenton/SNG{cc}.htm`. Bolls.life numbers: Ecclesiastes 21, Song of Solomon 22 (packaged KJV index 20 and 21).

## Verses compared

Every verse of both books was set beside Brenton’s English at the matching number by script (word overlap, then a number-word scan). Verses flagged by either scan (about 105) were read in the KJV, the Hebrew and the Greek; the records above are what survived. The chapters were not read in full as prose; this is a comparison scan, not a full reading. The Greek was not compared with any other Greek edition.

## Existing evidence

`data/evidence.json` and the drafts were searched for refs in either book: published `exp-late-20-9-5` and `exp-late-26-12-1` (Ecclesiastes 9:5) and `exp-late-21-4-1` (Song 4:1). No overlap with any record here. The six built-in studies do not cite either book.

## Considered and not issued

- Ecclesiastes 7:16 (“destroy thyself” / “lest thou be confounded”): the two renderings sit near each other in sense; no clear difference shown.
- Ecclesiastes 7:12 (“a defence”): the Greek is the plainer rendering of the Hebrew’s repeated word; not a difference of meaning.
- Ecclesiastes 11:5 (“spirit” / “wind”): a word with a range of senses covering the KJV’s choice.
- Ecclesiastes 10:19 (“a feast is made for laughter” / “men prepare bread…”): the Greek adds wine and oil; wording only.
- Ecclesiastes 6:6 (“twice told”): Greek prints no “twice”; a small one-figure difference, left out to keep the batch short. Candidate if Codex wants figure records.
- Ecclesiastes 4:6 (“both the hands full” / “two handfuls”): wording only.
- Song 2:4 (“his banner over me was love” / “set love before me”), 5:13 (“bed of spices” / “bowls of spices”), 5:16 (“mouth” / “throat”), 7:10 (“his desire” / “his turning”), 4:13 (“plants” / “shoots”): differences small or inside a range; 5:13 is the best of them and was held back.
- Song 6:12 and 7:12: the Greek of 6:12 adds “There I will give thee my breasts”, which the KJV states at 7:12 in another chapter; not a record.
- Ecclesiastes 9:5 (“the dead know not any thing”) against other books: already published.
- No V: no law is breached by a narrated act in either book.
- No untagged conflict: no two verses in these books word a matter differently.
- Psalm 144-style Q (unnamed adversaries): not repeated; every Q here asks for an identity the text frames by a title or relation, and the notes of the Q file give the ruled-out ones.

## For later sessions

- Records issued here that rest on verses of other books: none as a side. Song 3:11 and 8:12 are quoted in a Q only (the question is limited to the verses quoted).
- Do not issue a Q on “the Preacher” in another book, or a Q on the one shepherd.
- Work folder: `%TEMP%\claude\ecc` (`head9.mjs` writes the two files, `eb.mjs` holds the records, `pv.mjs "E|S c:v"` prints KJV, Hebrew, Greek and English, `tok.mjs` numbers Hebrew words, `scan.mjs` and `nums.mjs` are the two scans, cache of both books in WLC, Brenton Greek and English).
