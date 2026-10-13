# 1 Kings 1–22 — Q records, notes

Session 2026-10-13. Q-only backlog session: H, G, V and untagged conflicts were not re-opened. File: `1-kings-1-22-q-records.json` (4 records). All are drafts until Codex accepts them. All take `mode: "questions"`, `tags: ["Q"]`, `status: "Context"` and carry `sides` (side A only).

## Records

1. `but-he-lied-unto-him-why-did-the-old-prophet-of-bethel-lie` (13:18) — the old prophet claims an angel’s command and the narrator says “But he lied unto him”; the man of God eats, is sentenced through the same prophet and is killed. The chapter states the lie, the sentence, the burial and the old prophet’s later words, but no reason for the lie.
2. `elijah-told-to-anoint-hazael-jehu-and-elisha-did-elijah-anoint-any-of-them` (19:15–16) — three anointings are commanded to Elijah. In the verses read he casts his mantle on Elisha; Elisha tells Hazael he will be king; a young prophet sent by Elisha pours oil on Jehu. No anointing by Elijah is reported in the verses read, and the order differs from the order commanded.
3. `twelve-pieces-ten-tribes-and-one-tribe-which-tribe-is-the-twelfth` (11:30–32) — twelve pieces, ten for “ten tribes”, and “one tribe” for Solomon’s son: eleven. 12:20 has “the tribe of Judah only”, 12:21 “with the tribe of Benjamin”. The KJV and Hebrew verses read do not say which tribe is the twelfth; Brenton’s Greek has “two tribes” at 11:32 and 11:36.
4. `the-book-of-the-acts-of-solomon-what-was-it-and-where-is-it` (11:41) — the account of Solomon sends the reader to a book whose title a phrase search finds in this verse only; 2 Chronicles 9:29 names three other writings at the same point. Who wrote it and whether it is one of those three is not said.

## Checks made

- Every KJV quotation and side was asserted by script against `data/chapters.json`; every Hebrew and Greek quotation against the fetched WLC and Brenton pages at the printed verse label. Sides were validated with `scripts/verse-roles.mjs`. All 24 source addresses answered.
- Searches of the packaged KJV, each asserted by script with the result written into the record: “lied”; “old prophet”; “anoint / anointed / anointing” together with “Hazael”, “Jehu” or “Elisha”, and by itself in 1 Kings and in 2 Kings; “ten tribes”; “one tribe”; “twelve pieces”; “acts of Solomon”; “book of the acts”. They are word or phrase searches, and the records call them that.
- **1 Kings was not read in full.** Verses read in the KJV this session: 11:13, 11:29–43; 12:15, 12:17, 12:20, 12:21, 12:23; 13:1–34; 14:19, 14:29; 19:15–17, 19:19–21. Also read in the Hebrew and the Greek: 11:13, 11:30–32, 11:35–36, 11:41; 12:20–21, 12:23; 13:11, 13:14–23, 13:26, 13:29–32; 19:15–17, 19:19–21. Nothing else in the book was examined in this session.
- Parallels read in the KJV: 2 Kings 2:9, 2:13, 2:15; 8:7–15; 9:1–10, 9:12; 23:17–18; 2 Chronicles 9:29; 11:1, 11:12–14; 15:9; 22:7; Joshua 19:1. Also in the Hebrew and the Greek: 2 Kings 2:13; 8:13; 9:1–3, 9:6; 2 Chronicles 9:29.

## Verse numbers

- No difference between the KJV, WLC and Brenton numbers at the verses quoted. Brenton’s pages print each 1 Kings and 2 Kings verse number quoted in Greek (checked by script for 1 Kings 11:13, 11:30, 11:31, 11:32, 11:36, 11:41, 12:20, 12:21, 13:18, 13:31, 19:15, 19:16, 19:19 and 2 Kings 8:13 and 9:6). Brenton’s lettered verses in chapter 12 (24a–z) were not used.

## Points for Codex

- **Overlap is context only.** The build reported one shared verse with a published record: Joshua 19:1 (`the-blessing-of-the-tribes-why-is-simeon-not-named`). Record 3 quotes it only for one of the named readings.
- **Record 3 is issued as a Q and not as an arithmetic conflict.** Its scope says the sign does not state that every piece stands for one tribe on one side, and that 12:20 and 12:21 can both be true if Benjamin joined afterwards, a step the text does not report. Because the Greek quoted does state a count of two, the record limits “do not say” to the KJV and the Hebrew, following the Ruth Q correction.
- **Record 2 does not say the command was disobeyed.** It names that only as one reading among four, and limits the absence claim to the verses listed.
- **Record 1 quotes the Greek plus at 13:31** (“that my bones may be preserved with his bones”) and says it gives a purpose for the burial request, not for the lie.
- **Wording differences stated inside the records and not issued as G**, because this backlog session is Q only: Brenton’s “two tribes” at 11:32 and 11:36 (KJV and Hebrew “one tribe”; Brenton has “one” at 11:13) and “Judah and Benjamin” at 12:20 (KJV and Hebrew “Judah only”); the plus at 13:31. Seen and not examined: Brenton’s “an hundred and twenty thousand” at 12:21 (KJV “an hundred and fourscore thousand”); its “they turned the face of their father” at 13:11; its shorter 13:26 and its different wording of 13:23 and 13:29–30; no “of Abelmeholah” at 19:16; “Joel” for Iddo and “the words of Achia” at 2 Chronicles 9:29. Issue them only if asked.
- Records 2 and 3 place the tag on more than one verse, with a side A on each.

## Considered and not issued

- The lying spirit before the Lord (22:19–23): the published Judges record on the evil spirit cites 22:21–22; a second record would ask the same question.
- The four hundred prophets (22:6) and whose prophets they were: turns on reading Jehoshaphat’s question at 22:7 one way; left out.
- Where Sheba (10:1), Ophir (9:28) and Tharshish (10:22) were: place identifications, not gaps in the passage’s explanation.
- The water poured on the altar in a drought (18:33–35): the passage does not need to say where it was drawn; trivial detail.
- Naboth’s sons (2 Kings 9:26 beside 1 Kings 21:13): rests on a 2 Kings verse; open for the 2 Kings Q session if it qualifies there.
- The man killed by a lion for refusing to strike a prophet (20:35–36): an ethical point, outside what is proposed.
- The unnamed Pharaoh whose daughter Solomon married (3:1): the Exodus Q record on unnamed Pharaohs asks the same kind of question.
- The staves “there unto this day” (8:8): a dating point, not a Q.

## Questions for the owner

None. Nothing was logged in `owner-questions.md`.
