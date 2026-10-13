# 1 Chronicles 1–29 — records, notes

Session 2026-10-13. Full review: H, G, V, untagged conflicts and Q. File: `1-chronicles-1-29-records.json` (16 records: 5 G, 11 untagged; no H, no V; 13 carry `sides`). The Q records are in `1-chronicles-1-29-q-records.json` with their own notes. All are drafts until Codex accepts them.

## Verse numbers — read this first

- **Chapter 6:** the Hebrew and Brenton’s Greek number the verses 15 lower than the KJV (KJV 6:16 = their 6:1; KJV 6:1–15 is their 5:27–41). `refs` and KJV quotations use KJV numbers; Hebrew and Greek are quoted at their own numbers and each record says so. Affected: `korah-…` (KJV 6:22 = 6:7; KJV 6:37–38 = 6:22–23) and `samuel-firstborn-…` (KJV 6:28 = 6:13; KJV 6:33 = 6:18).
- **Chapter 12:** the Hebrew and Brenton’s Greek run one verse ahead of the KJV from verse 5 (KJV 12:4 covers their 12:4–5). Affected: `danites-…` (KJV 12:35 = 12:36).
- **Chapter 1 in Brenton’s Greek:** the page prints verses 1–10, 17 and 24–54. It prints no 11–16 or 18–23, and its verse 17 has two names only. The script asserts the printed labels.
- Brenton’s Greek page for chapter 16 prints no verse 24. Nothing is quoted from it.

## Records

G (Septuagint, Brenton’s Greek):

1. `uz-hul-gether-sons-of-shem-or-sons-of-aram-greek-shorter` (1:17) — the KJV and Hebrew run Uz, Hul, Gether and Meshech on under “The sons of Shem”; Genesis 10:23 gives them to Aram. The Greek verse stops after two names. G on 1:17 only; Genesis is context.
2. `saul-asked-the-familiar-spirit-greek-adds-samuel-answered-him` (10:13) — the Greek verse ends with a clause the KJV and Hebrew lack. The KJV does not state it in this passage; it tells of Samuel speaking in another book (1 Samuel 28), which the scope says.
3. `hezron-married-at-sixty-or-sixty-five-greek` (2:21) — sixty in the KJV and Hebrew, sixty-five in the Greek.
4. `hagarite-spoil-camels-fifty-thousand-or-five-thousand-greek` (5:21) — fifty thousand camels in the KJV and Hebrew, five thousand in the Greek.
5. `danites-at-hebron-28600-or-28800-greek` (12:35) — 28,600 in the KJV and Hebrew, 28,800 in the Greek.

Untagged:

6. `timna-son-of-eliphaz-or-his-concubine` (1:36; Genesis 36:12) — Timna among the sons of Eliphaz, or the concubine who bore Amalek.
7. `zerubbabel-son-of-pedaiah-or-son-of-shealtiel` (3:19; Ezra 3:2, Haggai 1:1, Matthew 1:12) — Chronicles names Salathiel and Pedaiah as two men and gives Zerubbabel to Pedaiah.
8. `sons-of-shemaiah-five-names-counted-as-six` (3:22) — five names, total “six”.
9. `sons-of-jeduthun-five-names-counted-as-six` (25:3) — five names, total “six”; a Shimei appears only at 25:17.
10. `sons-of-benjamin-three-or-five-in-chronicles` (7:6; 8:1–2) — a list closed with “three” and a list numbered first to fifth, sharing one name.
11. `ner-begat-kish-or-kish-and-ner-sons-of-abiel` (8:33; 1 Samuel 9:1, 14:51) — Ner is Kish’s father in Chronicles and his brother in Samuel.
12. `all-saul-house-died-together-or-ishbosheth-lived` (10:6; 2 Samuel 2:8, 2:10) — “all his house died together” against a son who reigns two years.
13. `korah-son-of-amminadab-or-son-of-izhar` (6:22; 6:38; Exodus 6:21) — two lists in one chapter.
14. `samuel-firstborn-vashni-or-joel` (6:28; 1 Samuel 8:2) — two names for the firstborn.
15. `ammon-hired-thirty-two-thousand-chariots-or-footmen` (2 Samuel 10:6; 1 Chronicles 19:7) — thirty-two thousand chariots, or twenty thousand footmen and twelve thousand men. `ref` is the Samuel verse, as in the published records on the same war.
16. `josiah-sons-third-zedekiah-fourth-shallum-and-their-ages` (3:15; 2 Kings 23:31, 24:18) — status `Context`, not `Textual conflict`: the arithmetic rests on three identifications that the scope sets out as conditions.

## Checks made

- Every KJV quotation and side was asserted by script against `data/chapters.json`; every Hebrew and Greek quotation against the fetched WLC and Brenton pages at the printed verse label; Matthew 1:12 against TISCH, with TR confirmed to have the same words. Sides were validated with `scripts/verse-roles.mjs`. All 91 source addresses (both files) answered.
- Word searches of the packaged KJV, each asserted by script and described as a word search in its record: “Zerubbabel … the son of Shealtiel” (nine verses); “Vashni” (one verse); “Shimei” in 1 Chronicles 25 (verse 17 only).
- A script compared the number words of every KJV verse of chapters 1–5 and 7–29 with Brenton’s English of the same verse number. It found the three figures issued as records 3–5, and 29:26–27, where the Greek divides the verses differently with the same figures. Chapter 6 was left out of that scan because of its numbering, and chapter 12 was compared by eye after allowing for the offset. This is a comparison of numbers only; other wording was not compared verse by verse.
- **The book was not read in full.** Verses compared in the KJV, the Hebrew and Brenton’s Greek: 1:17, 1:36; 2:21, 2:23; 3:4, 3:15, 3:17–19, 3:22; 5:21; 6:22–23, 6:28, 6:33–38 (KJV numbers); 7:6; 8:1–2, 8:33; 9:36, 9:39; 10:6, 10:13–14; 12:35; 13:9; 19:6–7; 20:4; 25:3, 25:17; 29:27. Read in the KJV only: 1:4, 1:24, 1:39, 1:51; 2:3, 2:22; 3:16, 3:20; 6:2, 6:16, 6:18, 6:26–27; 8:29–30; 9:35; 12:23; 25:1, 25:6, 25:9. Outside the book, in all three texts: Genesis 10:22–23, 36:11–12; Exodus 6:21, 6:24; 1 Samuel 8:2, 9:1, 14:50–51, 31:6; 2 Samuel 2:8, 6:6, 10:6, 21:18; 2 Kings 23:30–31, 23:36, 24:18; Jeremiah 22:11; Ezra 3:2; Haggai 1:1; and Matthew 1:12 and Luke 3:27 in the Greek New Testament.
- Overlap check against `data/evidence.json` (463 records), the drafts in this folder and the six built-in studies, run before choosing candidates and again just before writing. Twenty existing records cite 1 Chronicles; none states any of the sixteen findings. Shared verses, all with a different subject: 10:13 (the Endor Q) and 10:14 (`saul-enquired-of-the-lord-or-enquired-not`) beside record 2; Genesis 46:21 and Numbers 26:38 (`benjamin-ten-sons-or-sons-and-grandsons-greek`) as context in record 10; 2 Samuel 2:10 (`saul-reign-age-formula-one-year`); 2 Kings 23:30, 24:8 and 24:17 (three published records on other points) as context in record 16; Haggai 1:1 (`exp-late-36-1-1`).

## Points for Codex

- Record 1 is a G record that also sets two KJV verses against each other. The tag is on 1:17 only. If you would rather have it untagged with the Greek as a note, the Greek facts are all in `text`.
- Record 12: Brenton’s Greek of 1 Samuel 31:6 has no words for “and all his men”. It is stated in the scope and not tagged. Record 11: Brenton’s Greek of 1 Samuel 14:51 has an extra name, Jamin; stated and not tagged.
- Record 14: the scope carries one researcher’s note about the consonants of the name Vashni. It is marked as a note and the record does not rest on it. No H is proposed, because the pointed Hebrew and the Greek both give a name.
- Record 15 quotes the whole of 2 Samuel 10:6 from the packaged KJV.
- Packaged KJV: nothing to report at the verses quoted.

## No H, no V

- **H:** no verse compared showed a KJV meaning different from the pointed Hebrew.
- **V:** none proposed. The breaches the book tells are punished or rebuked in the story (Uzza 13:10; the numbering, chapter 21; Saul, 10:13–14). David’s many wives (14:3 beside Deuteronomy 17:17) were left out: no whole-Bible check for a rebuke could be made and described.

## Considered and not issued

- 2:23 (“he took Geshur, and Aram, with the towns of Jair”): the Hebrew and the Greek can each be taken the KJV’s way or with Geshur and Aram as the takers; Brenton’s own English takes it the KJV’s way. Ambiguous, so no H or G.
- 3:4 beside 29:27 (seven years and six months, or seven years): “forty years” can be a round figure, and the same two figures stand together in 2 Samuel 5:4–5.
- 20:4 beside 2 Samuel 21:18 (Gezer or Gob) and 13:9 beside 2 Samuel 6:6 (Chidon or Nachon): differences of place or personal names only.
- Samuel’s tribe (1 Samuel 1:1 “an Ephrathite” beside the Levite line of 1 Chronicles 6:33–38): “Ephrathite” can describe where the family lived, so the scope would have to concede there is no conflict.
- 2:31 beside 2:34 (Sheshan’s “children” and “no sons, but daughters”): the KJV wording does not clash.
- 23:3 beside 23:24, 23:27 (Levites from thirty or from twenty): the chapter itself gives the reason for the change.
- 22:14 (a hundred thousand talents of gold): a large figure, not a conflict with another verse.
- 9:1–17 beside Nehemiah 11: not stated to be the same list.
- 27:7 (Asahel as a monthly captain): an argument from the date of his death, not a wording conflict.
- 29:7 (“drams”): a matter of dating coins, outside what is proposed.
- 2:6 beside 1 Kings 4:31 (sons of Zerah or of Mahol): rests on identifying the men.

## Held back, quotes sourced

- Brenton’s Greek of 20:8 adds that “all four were giants”; 21:13 adds “even all the three”; 11:11 has “first of the thirty”; 26:17–18 is longer; 2 Samuel 21:18 has “in Geth”; 2 Samuel 10:6 has “king Amalek”.
