# 1 Chronicles 1–29 — Q records, notes

Session 2026-10-13. Full review of the book; the H, G, V and untagged records are in `1-chronicles-1-29-records.json` with their own notes. This file: `1-chronicles-1-29-q-records.json` (3 records). All are drafts until Codex accepts them. All take `mode: "questions"`, `tags: ["Q"]`, `status: "Context"` and carry `sides` (side A only).

## Records

1. `the-men-of-gath-slew-ephraims-sons-when-and-where` (7:21, 7:22) — a genealogy stops to tell that men of Gath killed Ezer and Elead over cattle, that “Ephraim their father” mourned, and that a daughter built Bethhoron. Genesis has Ephraim born in Egypt. The verses name no time, do not say from where “they came down”, and do not say who “they” are.
2. `the-word-of-the-lord-came-to-me-thou-hast-shed-blood-when-was-it-given` (22:8, 28:3) — David twice reports God’s word that he may not build because he shed blood. Nathan’s message (1 Chronicles 17:4, 17:12; 2 Samuel 7:5, 7:13) gives no such reason, and Solomon gives another account of it (1 Kings 5:3; 8:18–19). When and through whom the word came is not told in the verses read.
3. `the-lord-made-me-understand-in-writing-by-his-hand-upon-me-how-did-david-receive-the-pattern` (28:19, 28:12) — the temple pattern is what David “had by the spirit” and understood “in writing by his hand upon me”. The verses do not say whether a writing came from God or David wrote, or how the pattern reached him.

## Checks made

- Every KJV quotation and side was asserted by script against `data/chapters.json`; every Hebrew and Greek quotation against the fetched WLC and Brenton pages at the printed verse label. Sides were validated with `scripts/verse-roles.mjs`. All source addresses answered (91 across both files).
- Searches of the packaged KJV, each asserted by script: “Gath” as a whole word in Genesis and Exodus (none); words beginning “blood” in 2 Samuel 7 and 1 Chronicles 17 (none). They are word searches and the records call them that.
- **The book was not read in full.** Verses read in the KJV for these three records: 7:20–27; 17:4, 17:11–14; 22:7–9; 28:2–3, 28:11–13, 28:19. Also read in the Hebrew and Brenton’s Greek: 7:20–24, 17:4, 22:7–9, 28:3, 28:11–12, 28:19. Outside the book (KJV): Genesis 41:52, 46:20, 50:23; 1 Samuel 6:17; 2 Samuel 7:5, 7:13; 1 Kings 5:3, 8:17–19; Exodus 25:40, 31:18.
- Overlap check against `data/evidence.json` (463 records), the drafts in this folder and the six built-in studies, run again just before writing. No record asks any of the three questions. One shared verse with a different subject: Exodus 31:18 (`exodus-replacement-tablets`), context only here.

## Verse numbers

- No numbering difference at the 1 Chronicles verses quoted in these three records.
- KJV 1 Kings 5:3 is 5:17 in the Hebrew; it is quoted in the KJV only.

## Points for Codex

- Record 3 states two wording differences and does not propose them: the Hebrew of 28:19 as quoted has no words answering to the KJV’s “said David”; Brenton’s Greek of 28:19 has David give all to Solomon “in a writing of the hand of the Lord”, and at 28:12 has “in his spirit”. If you want either as a G record, say so and it will be issued separately.
- Record 1 notes that the KJV has “born in that land” where the Hebrew and Greek quoted have “in the land”. Not proposed.
- Records 1, 2 and 3 each place the tag on two verses with a side A on each, as accepted for earlier Q records.

## Considered and not issued

- The prayer of Jabez (4:9–10): who Jabez was is an ordinary omitted detail.
- The writings named at 29:29 (Samuel the seer, Nathan, Gad): the same kind of question as the published source-book records; not repeated for each book.
- Why Uzza died (13:10): answered in the book itself at 15:13.
- Why numbering the people was a sin (21:3, 21:7–8): no verse read states a gap that is not already in the published record on the anger before the numbering.
- “Satan stood up against Israel” (21:1): covered by `early-census-agent` and the published 2 Samuel Q.
- How the birthright passed from Reuben to Joseph’s sons (5:1–2): the verse states the cause; the remaining gap is a detail.
- Bithiah the daughter of Pharaoh (4:18): an unnamed Pharaoh, of the kind already covered.
