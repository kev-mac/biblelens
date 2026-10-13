# 2 Samuel 1–24 — Q records, notes

Session 2026-10-13. Q-only backlog session: H, G, V and untagged conflicts were not re-opened. File: `2-samuel-1-24-q-records.json` (4 records). All are drafts until Codex accepts them. All take `mode: "questions"`, `tags: ["Q"]`, `status: "Context"` and carry `sides`.

## Records

1. `because-he-slew-the-gibeonites-when-and-how-did-saul-slay-them` (21:1) — a three-year famine is “for Saul, and for his bloody house, because he slew the Gibeonites”, and seven of Saul’s descendants die for it. The chapter gives the charge, the oath and Saul’s motive, but no time, place or account of the act; 21:1 has “slew”, 21:2 “sought to slay”. A word search finds no Gibeonite and no “Gibeon” in 1 Samuel.
2. `after-forty-years-absalom-forty-years-counted-from-what` (15:7) — Absalom’s request, which opens the revolt, is dated “after forty years” with no starting point. The time notes before it are three years (13:38) and two years (14:28); David’s whole reign is forty years (5:4); Absalom is listed among the sons born in Hebron (3:2–3). Both editions quoted have “forty”.
3. `ziba-or-mephibosheth-whose-account-of-the-day-david-fled-was-true` (16:3 and 19:27) — Ziba says Mephibosheth stayed behind expecting the kingdom; Mephibosheth says his servant deceived and slandered him. The narrator reports Mephibosheth’s unkempt state (19:24) and draws no conclusion; David says “Thou and Ziba divide the land”. Which account was true is not said.
4. `again-the-anger-of-the-lord-was-kindled-against-israel-for-what` (24:1) — the anger “against Israel” comes before David is moved to number the people; no act of Israel is named, and “again” has no stated antecedent. David calls the sin his own and asks “these sheep, what have they done?” (24:17); seventy thousand of the people die.

## Checks made

- Every KJV quotation and side was asserted by script against `data/chapters.json`; every Hebrew and Greek quotation against the fetched WLC and Brenton pages at the printed verse label. Sides were validated with `scripts/verse-roles.mjs`. All 29 source addresses answered.
- Word searches of the packaged KJV, each asserted by script with the result written into the record: “Gibeonite(s)”, “Gibeon” in 1 Samuel, “Beeroth”, “forty years” in 2 Samuel, “Ziba”, “Mephibosheth”, “anger of the Lord was kindled” in 2 Samuel. They are word searches, and the records call them that.
- **2 Samuel was not read in full.** Verses read in the KJV this session: 3:2–3; 4:2–4; 5:4–5; 6:7; 9:1–13; 13:38; 14:28, 14:33; 15:1–12; 16:1–5; 19:17, 19:24–31; 21:1–14; 24:1–25. Also read in the Hebrew and the Greek: 3:2–3; 4:2–4; 5:4–5; 9:2–3, 9:9–11, 9:13; 13:38; 14:28, 14:33; 15:1, 15:6–10; 16:1–5; KJV 19:24–30; 21:1–7, 21:9, 21:14; 24:1–3, 24:10, 24:15, 24:17. Nothing else in the book was examined in this session.
- Parallels read in the KJV, Hebrew and Greek: Joshua 9:15, 9:17, 9:19–20, 9:27; 1 Samuel 22:19; 1 Kings 2:11; 1 Chronicles 21:1, 21:3, 21:7; Exodus 30:12. In the KJV only: 1 Chronicles 21:2, 21:4–6, 21:8.

## Verse numbers

- **2 Samuel 19: the Hebrew (WLC) and Brenton’s Greek run one verse ahead of the KJV.** Record 3 quotes the Hebrew and the Greek at their own numbers (19:25, 19:27, 19:28, 19:30) and gives the KJV number beside each (19:24, 19:26, 19:27, 19:29). `refs` and `sides` take KJV numbers.
- No difference at the other verses quoted. Brenton’s pages print each verse number cited (checked by script for 15:7, 16:3, 19:25, 19:27, 19:28, 19:30, 21:1, 21:2, 21:5, 24:1 and 1 Chronicles 21:1).

## Points for Codex

- **Overlaps are context only.** The build reported shared verses with published records at 2 Samuel 24:1 and 1 Chronicles 21:1 (`early-census-agent`) and Joshua 9:15 and 9:27 (`joshua-gibeonite-covenant`), and with the 1 Samuel Q draft at 1 Samuel 22:19. Record 4 does not take up who moved David, and its scope says so; it asks what the anger against Israel was for. The built-in study `soldiers` cites 24:9, which record 4 does not use.
- **Record 3 carries sides A and B and places its tag on two verses** (16:3 and 19:27), because the question is which of two speeches is true. Side B has two entries (19:26 and 19:27). Earlier Q records used side A only; if B is not wanted in a Q record, the B entries can be relabelled A with nothing else changed.
- **Record 2 is not issued as a contradiction.** The arithmetic about Absalom’s birth is stated with its condition (that he was born while David reigned in Hebron), and the scope says the later chapters are not shown to be in order of time. No text with a number other than forty was opened; the record says so and names a smaller number only as a reading.
- **Record 1 does not set “slew” (21:1) against “sought to slay” (21:2).** The scope says both can be true of one campaign.
- **Wording differences stated inside the records and not issued as H or G**, because this backlog session is Q only: Brenton’s added “and pursued us” at 21:5; Brenton’s “to his father” at 15:7 (KJV “unto the king”); Brenton’s “Saddle the ass for me”, an order to the servant, at KJV 19:26 (KJV and Hebrew “I will saddle”); Brenton’s “son of the son of Saul” at KJV 19:24. Seen and not examined: Brenton’s longer wording of 21:1 (“upon Saul and upon his house is guilt”), its “in Gabaon of Saul” at 21:6 (KJV “in Gibeah of Saul”), its added bones “of them that were hanged” at 21:14, and its longer 24:15 (“and David chose for himself the death; and it was the days of wheat harvest”). Issue them only if asked.
- Records 1 and 4 put a side A on a second verse (21:2; 24:17). The tag sits on the first verse only.

## Considered and not issued

- The book of Jasher (1:18): covered by the published Joshua record, which cites the verse.
- The Amalekite’s account of Saul’s death (1:6–10): published as `early-saul-death`.
- Elhanan and Goliath (21:19), Michal’s sons (21:8), David’s sons as priests (8:18), Absalom’s sons (14:27 beside 18:18): published.
- Why Uzzah was struck (6:6–7): the verse gives a cause (“for his error”); not a gap.
- The “gutter” and the unfinished sentence at 5:8: turns on the Hebrew wording and on words the KJV supplies; not a Q, and outside a Q-only session.
- Whether Abner went in to Rizpah (3:7–8): Abner’s answer neither admits nor denies it, but nothing later in the passage turns on it; left out as not material.
- “Thy master’s wives” (12:8): which wives are meant is not said; left out, because the gap exists only if the phrase is taken as a report of a marriage.
- Why numbering the people was a sin (24:10 beside Exodus 30:12): touched on in record 4 only as the reading that the people shared in a fault of the numbering; not issued separately, because Exodus 30:12 is offered as an answer and deciding whether it applies would take one interpretation as fact.

## Question for the owner

None.
