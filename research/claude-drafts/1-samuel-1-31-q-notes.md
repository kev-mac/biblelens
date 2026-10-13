# 1 Samuel 1–31 — Q records, notes

Session 2026-10-13. Q-only backlog session: H, G, V and untagged conflicts were not re-opened. File: `1-samuel-1-31-q-records.json` (4 records). All are drafts until Codex accepts them. All take `mode: "questions"`, `tags: ["Q"]`, `status: "Context"` and carry `sides`.

## Records

1. `bring-me-up-samuel-by-what-means-did-samuel-come-up-at-endor` (28:12) — the Lord does not answer Saul (28:6); Saul asks a woman “that hath a familiar spirit” to bring up Samuel (28:11); the next sentence says she “saw Samuel” and cried out. No act of the woman is told, and the verses do not say by whose act Samuel came up or why she cried. The narrative itself uses the name Samuel for the speaker; the scope says so.
2. `what-became-of-shiloh-after-the-ark-of-god-was-taken` (4:11) — worship, priests and ark are at Shiloh in chapters 1–4; after the news of the ark reaches Shiloh (4:12–22) the book tells nothing done there. The ark goes to Kirjathjearim (7:1), priests and shewbread are at Nob (21:1, 21:6). Jeremiah 7:12 says “see what I did to it”; Psalms 78:60 says God “forsook the tabernacle of Shiloh”. What was done, when and by whom is not said.
3. `michal-took-an-image-what-was-it-and-how-came-it-to-be-in-davids-house` (19:13) — the “image” in David’s bed is “the teraphim” in the Hebrew, the word used of Laban’s “gods” (Genesis 31:19, 31:30), Micah’s house of gods (Judges 17:5), what Josiah put away (2 Kings 23:24) and Samuel’s rebuke (1 Samuel 15:23). What it was, whose it was and what it was kept for is not said.
4. `samuel-wrote-the-manner-of-the-kingdom-in-a-book-what-did-it-say` (10:25) — Samuel writes “the manner of the kingdom” in a book and lays it up before the Lord. The verse gives no contents. Whether it was the warning of 8:11–17, limits like Deuteronomy 17:14–20, or something else is not said.

## Checks made

- Every KJV quotation and side was asserted by script against `data/chapters.json`; every Hebrew and Greek quotation against the fetched WLC and Brenton pages at the printed verse label. Sides were validated with `scripts/verse-roles.mjs`. All 47 source addresses answered.
- Word searches of the packaged KJV, each asserted by script with the result written into the record: “Endor”, “familiar spirit”, “Shiloh”, “teraphim”, “manner of the kingdom”, “manner of the king”. They are word searches, and the records call them that.
- The presence of the Hebrew word for teraphim was confirmed by script in WLC at 1 Samuel 19:13, 19:16 and 15:23, Genesis 31:19 and 31:34, Judges 17:5 and 2 Kings 23:24. The Hebrew Bible was not searched for its other occurrences.
- **1 Samuel was not read in full.** Verses read in the KJV this session: 1:3, 1:9, 1:24; 2:14, 2:22; 3:3, 3:21; 4:3–4, 4:10–22; 7:1–2; 8:5–22; 10:17–27; 12:1–25; 14:3; 15:23; 19:8–18; 21:1–6, 21:9; 22:9–19; 28:3, 28:6–25. Also read in the Hebrew and the Greek: 2:22; 8:9, 8:11; 10:25; 14:3; 15:23; 19:13, 19:16; 28:3, 28:6–20. Nothing else in the book was examined in this session.
- Parallels read in the KJV: Joshua 18:1; Judges 17:5, 18:31; 1 Kings 2:27, 14:2–4; 1 Chronicles 10:13–14, 16:39, 21:29; 2 Chronicles 1:3–5; Psalms 78:60–61, 78:67–68; Jeremiah 7:12–14, 26:6–9, 41:5; Deuteronomy 17:14–20, 18:10–12; Leviticus 19:31, 20:6, 20:27; Isaiah 8:19; Genesis 31:19, 31:30–35; 2 Kings 23:24; Zechariah 10:2; Ezekiel 21:21. Also in the Hebrew and the Greek: Genesis 31:19, 31:34; Judges 17:5; 2 Kings 23:24; 1 Chronicles 10:13.

## Verse numbers

No verse-number differences at the verses quoted. Brenton’s pages print each verse number cited (checked by script for 2:22, 10:25, 14:3, 19:13, 28:12, 28:19 and 1 Chronicles 10:13).

## Points for Codex

- **Overlaps are context only.** The build reported shared verses with published records at 1 Samuel 10:24, 14:3, 21:1, 28:6; Joshua 18:1; Leviticus 20:27; Deuteronomy 17:16, 17:18; Judges 17:5. None of those records asks the question of the new record. `the-urim-and-the-thummim-…` and `saul-enquired-of-the-lord-or-enquired-not` share 28:6 with record 1; record 1 is about how Samuel came up, not about the Urim or about 1 Chronicles 10:14.
- **Record 1 does not say the appearance was not Samuel.** It lists that as a reading others have proposed and states that the narrative uses his name at 28:12, 28:15, 28:16 and 28:20.
- **Record 3 is not a V and does not propose one.** No act of worship is described.
- **Wording differences stated inside the records and not issued as H or G**, because this backlog session is Q only: the KJV’s “an image” for the Hebrew “the teraphim” (19:13, 19:16); the KJV’s “idolatry” for the same word at 15:23; Brenton’s Greek word at 19:13; Brenton’s “an upright man” at 28:14 and “with you shall fall” at 28:19; Brenton’s plus at 1 Chronicles 10:13 (“and Samuel the prophet answered him”); Brenton’s shorter 2:22; Brenton’s “of the king” at 10:25. Issue them only if the owner or Codex asks.
- Three records put a side A on a second verse: record 1 on 28:15, record 2 on Jeremiah 7:12, record 3 on 19:16. The tag sits on the first verse only.

## Considered and not issued

- Bedan (12:11): published as `samuel-deliverers-bedan-or-barak`.
- The evil spirit from the Lord (16:14): covered by the published Judges record, which cites the verse.
- The Urim (28:6) and the ephod (2:18, 23:9): covered by published Q records.
- Saul not knowing David (17:55–58), Saul’s age (13:1), Saul’s enquiry (28:6 beside 1 Chronicles 10:14): published.
- Goliath’s head brought “to Jerusalem” (17:54): a gap only on the reading that no Israelite could be in Jerusalem then; left out.
- The number struck at Bethshemesh (6:19): a number and Greek matter, not a Q; outside a Q-only session.
- Samuel’s tribe (1:1 beside 1 Chronicles 6): a possible conflict, not a Q; outside a Q-only session and not examined.
- What the emerods were (5:6): an identification of a disease; not examined.
- The companies of prophets (10:5, 19:20): too general to state as one question.

## Questions for the owner

None.
