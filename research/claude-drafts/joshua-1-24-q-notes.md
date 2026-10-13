# Joshua 1–24 — Q records, notes

Session 2026-10-13. Q-only backlog session: H, G, V and untagged conflicts were not re-opened. File: `joshua-1-24-q-records.json` (4 records). All are drafts until Codex accepts them. All take `mode: "questions"`, `tags: ["Q"]`, `status: "Context"` and carry `sides`.

## Records

1. `captain-of-the-host-of-the-lord-who-is-he` (5:14) — a figure first called “a man” gives himself a title found in the KJV only at 5:14–15, receives Joshua’s prostration and declares the ground holy; the three verses do not say who he is, and 6:2 does not say whether its speaker is the same.
2. `rahabs-house-upon-the-wall-how-was-it-standing-after-the-wall-fell` (6:22) — the house is “upon the town wall” (2:15), the wall “fell down flat” (6:20), and the spies are then sent into the house (6:22–23); how the house was still there is not said, and it bears on whether the whole wall is meant.
3. `the-book-of-jasher-what-was-it-and-how-much-of-the-sun-passage-is-from-it` (10:13) — the book is named between two statements that the sun stood still; what it was and where its words begin and end is not said. 2 Samuel 1:18 is the only other verse the search finds.
4. `joshua-wrote-these-words-in-the-book-of-the-law-of-god-which-words-in-which-book` (24:26) — which words Joshua wrote, and whether the book is the one Moses finished and had placed by the ark (Deuteronomy 31:24–26), is not said.

## Checks made

- Every KJV quotation and side was asserted by script against `data/chapters.json`; every Hebrew and Greek quotation against the fetched WLC and Brenton pages; Revelation 22:9 against TISCH, with TR confirmed to have the same words. Sides were validated with `scripts/verse-roles.mjs`. All 31 source addresses answered.
- The book was **not** read in full. Verses read in the KJV, Hebrew and Greek: 2:15–16, 2:18; 5:13–15; 6:2, 6:5, 6:20, 6:22–23; 10:12–14; 24:25–27, 24:29; 1:8; 8:31–32. Verses read in the KJV only: 2:17, 2:19–21; 6:1, 6:15–17, 6:21, 6:24–25; 23:6; 24:28. Parallels read: Exodus 3:5, Genesis 23:7, Revelation 22:8–9, 2 Samuel 1:17–18, Deuteronomy 31:24–26.
- Script-asserted searches (each is a word search of the edition named, nothing more):
  - packaged KJV of Joshua: “captain of the host of the Lord” / “captain of the Lord's host” at 5:14 and 5:15 only; “Jasher” at 10:13 only; “book of the law” at 1:8, 8:31, 8:34, 23:6 and 24:26;
  - whole packaged KJV: “Jasher” at Joshua 10:13 and 2 Samuel 1:18; “prince of the host” at Daniel 8:11; “book of the law of God” at Joshua 24:26 and Nehemiah 8:18; “Rahab” and “Rachab” in eleven verses;
  - Brenton’s Greek: the 24 verses printed for Joshua 2 have no form of the word for wall; the 41 verses printed for Joshua 10 have no form of the word for book; 5:14 has no verb for worship.

## Verse numbers

- No difference between the KJV, WLC and Brenton at the verses quoted, except as follows.
- Brenton’s Greek page for Joshua 10 prints 41 verses (no 15 and no 43); for Joshua 6 it prints no verse 4; for Joshua 24 it prints 31a, 33a and 33b.
- Brenton’s Greek has nothing at Joshua 8:31–32 (the Ebal passage stands elsewhere in that edition); no Greek is quoted for 8:31.

## For Codex

- Record 2 shares 2:15–19 and 6:17–23 with the published `early-conquest` and `coverage-nt-faith-works`; it asks a different question from both.
- Record 3 shares 10:12–14 with the published `joshua-prolonged-daylight` (science) and 10:13 with the published Q `the-book-of-the-wars-of-the-lord-what-was-it`, which quotes the Jasher sentence as context only. It is a separate named book; if the two are judged too alike, hold record 3.
- Record 4 shares 24:25–26 with the published `joshua-covenant-assembly-shechem-or-shiloh` and Deuteronomy 31:24, 31:26 and Joshua 1:8 with `deuteronomy-law-custody-and-reading`.
- Records 1, 2 and 3 carry more than one side-A entry. If a side on a verse other than the tagged one is unwanted, drop the extra entries; nothing else depends on them.
- Three Greek differences are stated inside the Q records as wording only and are **not** proposed as G, because this session does not re-open G for Joshua: 5:14 (no “Nay”, no “did worship”), 2:15 (no clause about the house on the wall) with 6:20 (“all the wall fell round about”), and 10:13 (no sentence about the book of Jasher). The quotations are sourced and asserted if a G record is wanted later.

## Considered and not issued

- Why the wilderness generation was not circumcised (5:5–7): the published `joshua-wilderness-circumcision` already states it.
- The mechanism of the long day (10:12–14): published as `joshua-prolonged-daylight`.
- “The hornet” (24:12): published as `joshua-hornet-and-military-victory`.
- How Achan was “taken” (7:14–18): a small detail of procedure.
- How Israel came to mount Ebal with no account of taking that country (8:30): rests on what the book does not tell, with nothing in the passage that raises the question.
- How the Jordan stood “upon an heap” (3:16): an unspecified miracle, not a gap in explanation.
- Who wrote of Joshua’s death (24:29–33): close to record 4 and to the published Deuteronomy record on the narrator’s standpoint.

## Questions — For the owner

None.
