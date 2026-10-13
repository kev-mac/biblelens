# 2 Kings 1–25 — notes for `2-kings-1-25-records.json`

Researcher: Claude · 2026-10-12 · **All 27 records are drafts until Codex accepts them.** The `status` field is the intended published value. Nothing outside `research/claude-drafts/` was changed.

Every Hebrew, Greek and KJV quotation was cut by script from the fetched page or `data/chapters.json` and asserted to be an exact run of characters in the stated verse (Greek after removing page markup and collapsing spaces; Hebrew with the edition's own points and accents). Every `sides` quote was checked with `scripts/verse-roles.mjs` `validateSides` against the packaged KJV: 24 records carry sides, all valid. All 25 chapters were fetched in WLC and Brenton Greek, with parallel chapters of 2 Chronicles (21, 22, 24, 25, 28, 34, 35, 36), Jeremiah (22, 36, 52), Isaiah 39, Hosea 1, Deuteronomy 20, 1 Kings 7, Zephaniah 1 and John 3. I compared only the verses listed below, chosen from known difficulties in the book. A verse not mentioned here has not been cleared.

Published records touching 2 Kings: `early-ahaziah` (8:26), `early-lachish` (18:13–14), `numbers-serpent-making-and-worship` (18:4). Only `early-ahaziah` is re-issued, as an extension. The other 26 IDs are new.

## Verse numbers — read before checking quotes

- **2 Kings 12:** the Hebrew (WLC) and Brenton's Greek number each verse one higher than the KJV (KJV 12:13 = 12:14; KJV 12:21 = 12:22). `refs` use KJV numbers; the `text` gives the other number.
- **Brenton Greek 2 Kings 1** prints verses 1–18 and then 18a–18d. The lettered verses are found by the printed label.
- **Brenton Greek Jeremiah:** KJV chapter 36 is Greek chapter 43 (page `JER43.htm`). The page for chapter 52 prints verses 1, 4–14, 16–27 and 31–34; it has no 2, 3, 15 or 28–30.
- All other chapters quoted use the KJV's numbers in both editions.

## Tag placement in this batch

Following Codex's 1 Kings corrections, a tagged record has `appliesTo` limited to the verses where the tag applies, and `ref` is one of them. Where the tag sits on the other book's verse, `ref` is that verse (2 Chronicles 22:8, 22:9, 28:1; Hosea 1:4; Jeremiah 52:28, 52:31). The 2 Kings verse is carried in `refs` and in `sides`, so it still gets a card.

**One exception for Codex to settle:** `early-ahaziah` is an extension, so its `ref` (2 Kings 8:26), title, status, mode and `refs` are kept exactly as published. Its G applies only at 2 Chronicles 22:2, so `appliesTo` is that verse alone and does not contain `ref`. The two rules pull against each other here; either keep it as drafted or restore the published `appliesTo`.

## Records

| ID | Verses | Tags | Why it qualifies |
|---|---|---|---|
| `elijah-went-up-into-heaven-or-no-man-ascended` | 2:11, John 3:13 | G | "Went up into heaven" against "no man hath ascended"; Greek of Kings has "as it were into heaven". |
| `moab-fell-every-good-tree-or-do-not-destroy-the-trees` | 3:19, Deut 20:19 | — | A command in the Lord's name against the siege law. Commanded in the story, so a contrast, not V. |
| `jehoram-of-israel-began-in-second-year-of-jehoram-of-judah-or-eighteenth-of-jehoshaphat` | 1:17, 3:1, 8:16 | G | Each Jehoram begins after the other; Greek 1:17 has no date. |
| `early-ahaziah` (extension) | 8:26, 2 Chr 22:2 | G | 22 against 42; Greek of Chronicles has 20. |
| `ahaziah-began-in-joram-twelfth-year-or-eleventh` | 8:25, 9:29 | — | Twelfth year against eleventh, same book. |
| `ahaziah-died-at-megiddo-or-caught-hiding-in-samaria` | 9:27–28, 2 Chr 22:9 | G | Two accounts of the death; Greek of Chronicles "being treated" for "hid". |
| `ahaziah-forty-two-brethren-slain-or-all-his-elder-brothers-already-dead` | 10:13–14, 2 Chr 21:17, 22:1, 22:8 | G | Brethren alive in Kings, all dead in Chronicles; Greek of 22:8 has "brethren", not "sons of the brethren". |
| `jehu-done-well-to-house-of-ahab-or-blood-of-jezreel-avenged-on-house-of-jehu` | 10:30, Hosea 1:4 | G | Praise against punishment; Greek of Hosea "house of Juda". |
| `temple-repair-money-no-vessels-made-or-vessels-made` | 12:13, 2 Chr 24:14 | — | No vessels made against vessels made. |
| `joash-buried-with-his-fathers-or-not-in-the-sepulchres-of-the-kings` | 12:21, 2 Chr 24:25 | — | With his fathers against not in the kings' tombs. |
| `jehoahaz-seventeen-years-from-joash-twenty-third-jehoash-in-thirty-seventh` | 13:1, 13:10 | — | Arithmetic: 23 + 17 ≠ 37. |
| `azariah-began-in-jeroboam-twenty-seventh-year-or-about-his-fifteenth` | 14:2, 14:17, 14:23, 15:1 | — | Arithmetic: father dies about Jeroboam's 15th year, son dated to the 27th. |
| `hoshea-began-in-jotham-twentieth-year-yet-jotham-reigned-sixteen` | 15:30, 15:33, 17:1 | — | A twentieth year of a sixteen-year reign; second date in 17:1. |
| `king-of-assyria-hearkened-to-ahaz-or-helped-him-not` | 16:7–9, 2 Chr 28:20–21 | — | Hearkened against helped not. |
| `ahaz-twenty-years-old-or-twenty-five-greek-chronicles` | 2 Chr 28:1, 2 Kgs 16:2, 18:2 | G | Greek of Chronicles has 25 for the KJV's 20. No sides: it is one reading against another, not two KJV statements. |
| `hezekiah-hearkened-to-the-envoys-or-was-glad-of-them` | 20:13, Isa 39:2 | G | One sentence, two verbs; Greek of Kings has Isaiah's verb. |
| `huldah-dwelt-in-the-college-or-in-the-second-quarter` | 22:14, 2 Chr 34:22 | H | "College" for a word the KJV renders "the second" of a part of Jerusalem at Zephaniah 1:10. Weakest tag in the batch — see below. |
| `huldah-wife-of-shallum-or-mother-and-keeper-of-the-commandments-greek` | 22:14, 2 Chr 34:22 | G | Greek "mother" at Kings; Greek "kept the commandments" at Chronicles. |
| `josiah-carried-dead-from-megiddo-or-died-after-reaching-jerusalem` | 23:29–30, 2 Chr 35:23–24 | — | Dead at Megiddo against died after reaching Jerusalem. |
| `jehoiakim-none-to-sit-on-the-throne-or-his-son-reigned` | 24:6, Jer 36:30 | — | "None to sit" against "his son reigned". |
| `jehoiachin-eighteen-or-eight-years-old` | 24:8, 2 Chr 36:9 | — | 18 against 8. |
| `zedekiah-jehoiachin-uncle-brother-or-son` | 24:17, 2 Chr 36:10 | G | Uncle against brother; Greek has "son" in Kings and "father's brother" in Chronicles. |
| `first-deportation-eighth-year-ten-thousand-or-seventh-year-three-thousand` | 24:12, 14, 16, Jer 52:28 | G | Year and count differ; Greek of Jeremiah lacks the verse. |
| `nebuzaradan-came-on-the-seventh-day-or-the-tenth` | 25:8, Jer 52:12 | — | Seventh day against tenth. |
| `pillar-chapiter-three-cubits-or-five` | 25:17, Jer 52:22, 1 Kgs 7:16 | — | Three cubits against five. |
| `five-or-seven-men-of-the-kings-presence-taken` | 25:19, Jer 52:25 | — | Five against seven. |
| `jehoiachin-released-on-the-twenty-seventh-day-or-the-twenty-fifth` | 25:27, Jer 52:31 | G | 27th against 25th; Greek of Jeremiah has the 24th. |

Totals: 12 G, 1 H, 14 untagged, no V.

No V record is proposed. A V needs a stated whole-Bible check for "unchecked", and I could not make one for any candidate here.

For the untagged conflicts I looked at Brenton's Greek of each verse; it has the KJV's reading in every case, as each record's `text` or `scope` states.

**The H record.** `huldah-dwelt-in-the-college-…` rests on the KJV's own rendering of the same Hebrew word elsewhere, which Codex has said is not enough by itself for an office title (2 Samuel 8:18). I have issued it because here the other rendering is of the same thing — a part of Jerusalem — and "college" and "second" are different meanings. If Codex holds the H, nothing else in the record survives; drop it.

## Considered and ruled out

- 16:5 ("could not overcome him") against 2 Chr 28:5 ("delivered him into the hand of the king of Syria"): a failed siege of the city and lost battles are different things; the scope would have to concede there is no conflict.
- 18:5 (none like Hezekiah before or after) against 23:25 (none like Josiah before or after): each verse names a different quality, so the text itself reconciles them.
- 22:20 (Josiah gathered to his grave "in peace") against 23:29: the same verse explains "in peace" as not seeing the evil to come.
- 2:11 against 2 Chr 21:12 (a writing from Elijah to Jehoram): needs an inferred order of events.
- 9:1–10 against 1 Kings 19:16 (Elijah told to anoint Jehu): argument from silence.
- 8:26 "daughter of Omri" against 8:18 "daughter of Ahab": 8:18 does not name her.
- 12:21 names of Joash's killers against 2 Chr 24:26; 15:1 Azariah / 15:13 Uzziah; 21:17 Jehoahaz / 22:1 Ahaziah in Chronicles: name variants.
- 12:21: WLC has "Jozabad" where the KJV has "Jozachar". A named-edition spelling; other Hebrew manuscripts not examined.
- 14:7 against 2 Chr 25:11–12; 11:4 against 2 Chr 23:1–8: fuller account, not stated to be exclusive.
- 18:1, 18:9–10 against 17:1 and 16:2 (Hezekiah's accession year): off by a year or two; turns on part-year counting.
- 18:13–16 (Hezekiah's tribute) absent from Isaiah 36: silence. `early-lachish` not extended.
- 23:29 "went up against the king of Assyria": the Hebrew preposition can carry the KJV's sense; no H shown.
- 23:7 "sodomites", 23:5 "planets", 6:25 "dove's dung", 18:17 titles left as names: disputed or unresolved Hebrew; no H shown.
- 8:10 ("say unto him, Thou mayest certainly recover"): rests on written and read forms; background only.
- 20:9–11 (the shadow on the dial): not proposed as science.
- 25:8 nineteenth year against Jer 52:29 eighteenth year: Jeremiah 52:12 itself has the nineteenth; internal to Jeremiah.
- Greek differences seen but held back to keep the batch small, quotes sourced: 2 Chr 36:8 (Greek adds that Jehoiakim "was buried in Ganozae with his fathers", against Jer 22:19); 2 Chr 21:17 (Greek "Ochozias" for "Jehoahaz"); 1:18b–d and 2 Chr 36:2a–c, 4a, 5a–d (Greek verses the KJV lacks); 3:19 (Greek lacks "every choice city"); 2 Chr 28:20 (Greek lacks "but strengthened him not" — noted in the Assyria record, not tagged).
- V candidates: Ahaz's altar and his son passed through the fire (rebuked by the narrator, 16:2–4); Manasseh (rebuked, 21:10–15); Jeroboam's sins continued by each king of Israel (rebuked each time); Naaman bowing in the house of Rimmon (not an Israelite); Elisha and the youths at Bethel (no law named); Jehu's deceit of Baal's worshippers (commended in the story, 10:30). All dropped, none issued untagged.

## Questions

For the owner: Codex's display now shows a full card only on verses named in `sides`. This batch carries sides. The 316 published records have none. Do you want a session that writes `verse-roles.json` (sides for the published records), before or after the next book?

For Codex: the `early-ahaziah` placement, above.
