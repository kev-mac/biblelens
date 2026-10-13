# 2 Kings 1–25 — Q records, notes

Session 2026-10-13. Q-only backlog session: H, G, V and untagged conflicts were not re-opened. File: `2-kings-1-25-q-records.json` (4 records). All are drafts until Codex accepts them. All take `mode: "questions"`, `tags: ["Q"]`, `status: "Context"` and carry `sides` (side A only, on the tagged verse).

## Records

1. `great-indignation-against-israel-whose-indignation-and-why-did-israel-depart` (3:27) — the king of Moab offers his eldest son on the wall; the next sentence reports “great indignation against Israel” and the winning armies go home. The verse names no one who was indignant and does not say what the indignation did.
2. `the-blood-of-naboth-and-the-blood-of-his-sons-what-happened-to-naboths-sons` (9:26) — Jehu recalls a word of the Lord about the blood of Naboth “and the blood of his sons”. The verses read in 1 Kings 21 report Naboth’s stoning only, and a word search of that chapter for “son” or “sons” finds nothing about his children. The sons’ blood is stated; the event is not told.
3. `the-lord-gave-israel-a-saviour-who-was-the-saviour` (13:5) — an unnamed saviour is given in the account of Jehoahaz, though Hazael oppressed Israel “all the days of Jehoahaz” (13:22). Relief is told under Jehoash (13:25) and Jeroboam (14:27, “he saved them by the hand of Jeroboam”); no verse read says either is the saviour of 13:5.
4. `i-have-found-the-book-of-the-law-which-book-and-how-had-it-been-lost` (22:8) — the book found in the temple is called the book of the law, the book of the covenant and (2 Chronicles 34:14) a book of the law of the Lord given by Moses. The verses read do not say how much writing it held, where it had been, or how it came to be unknown to the king.

## Checks made

- Every KJV quotation and side was asserted by script against `data/chapters.json`; every Hebrew and Greek quotation against the fetched WLC and Brenton pages at the printed verse label; the script also asserts that Brenton’s page prints each verse number quoted. Sides were validated with `scripts/verse-roles.mjs`. All 26 source addresses answered.
- Searches of the packaged KJV, each asserted by script with the result written into the record: “Naboth”; “son / sons” in 1 Kings 21; “great indignation”; “indignation” in 2 Kings; “saviour / saviours” in 2 Kings; “book of the law”; “book of the covenant / book of this covenant”. They are word or phrase searches, and the records call them that.
- **2 Kings was not read in full.** Verses read in the KJV this session: 3:9, 3:18–19, 3:24–27; 5:17–19; 8:12; 9:21–26; 10:32–33; 13:3–7, 13:14, 13:19, 13:22–25; 14:6, 14:26–27; 22:3, 22:8–13; 23:2–3, 23:21–25. Of these, also read in the Hebrew and Brenton’s Greek: 3:18, 3:27, 9:25–26, 13:5, 13:25, 14:27, 22:8, 22:13, 23:2, 23:24. Outside the book: 1 Kings 21:3, 21:10, 21:13–16, 21:19, 21:21–22, 21:29; 2 Chronicles 34:14–15, 34:21, 34:30; Deuteronomy 31:24–26 (KJV), with 1 Kings 21:13, 2 Chronicles 34:14 and Deuteronomy 31:26 also in the Hebrew and the first two in the Greek.
- Overlap check against `data/evidence.json` (459 records), the drafts in this folder and the six built-in studies, run again just before writing. No record asks any of the four questions. Shared verses, all with a different subject: 2 Kings 3:18 (`moab-fell-every-good-tree-or-do-not-destroy-the-trees`, the tree law); Deuteronomy 31:26 (`deuteronomy-law-custody-and-reading` and the Joshua 24:26 Q, context in both); 2 Kings 23:24 (the Michal Q, context only).

## Verse numbers

- No numbering difference at the 2 Kings verses quoted. (2 Kings 12 runs one ahead in the Hebrew and Greek; nothing is quoted from it.)
- **Brenton’s Greek prints the Naboth chapter (KJV 1 Kings 21) as chapter 20.** The Greek of KJV 1 Kings 21:13 is quoted from Brenton’s 20:13 and the record says so; its source address is `1KI20.htm`. The Hebrew is quoted at 21:13.

## Points for Codex

- Record 2: `refs` and the KJV quotations use 1 Kings 21; one Greek quotation is at Brenton’s 1 Kings 20:13, for the reason above. The source list therefore carries both a Hebrew address for 1 Kings 21 and a Greek address for 1 Kings 20.
- Record 3 states a wording difference and does not propose it: Brenton’s Greek of 13:5 has “deliverance” (σωτηρίαν) where the Hebrew and KJV have a person. Record 4 states that Brenton’s Greek prints no article before “book” at 22:8. Neither is issued as G, because this is a Q-only session. Issue them only if asked.
- Record 1 quotes Brenton’s Greek noun at 3:27 (μετάμελος) and Brenton’s own English for it (“indignation”), and gives no gloss of its own for that noun. No G is proposed.
- Seen and not examined: Brenton’s Greek of 9:26 has “him” where the KJV has “I will requite thee”; Brenton’s Greek of 3:18 has “I will deliver” where the KJV has “he will deliver”; 2 Chronicles 34:14, KJV “a book of the law” beside the Hebrew wording (open for the 2 Chronicles session, a full review).

## Considered and not issued

- Naaman and the house of Rimmon (5:18–19): whether “Go in peace” grants the request is a question about how to take a reply, not an unstated fact of the story.
- Elisha’s message to Benhadad (8:10): rests on a written/read form in the Hebrew, which is background only.
- The shadow on the dial of Ahaz (20:11), the angel in the Assyrian camp (19:35), the man revived at Elisha’s grave (13:21): unspecified miracles, not Q.
- Pul and Tiglathpileser (15:19, 15:29): answering it needs outside records not opened.
- “So king of Egypt” (17:4): a missing name of the kind already covered by the published Pharaoh Q.
- The unrecorded words of Jonah son of Amittai (14:25): an ordinary omitted detail.
- Already published or drafted and so dropped: the anointing of Hazael and Jehu (1 Kings Q draft), the brasen serpent (18:4), Elijah’s ascent (2:11).

## Questions for the owner

None.
