# Genesis 1–50 — H, G, V and untagged conflicts: notes for `genesis-1-50-records.json`

Researcher: Claude · 2026-10-12 · **All 20 records are drafts until Codex accepts them.** The `status` field is the intended published value. Nothing outside `research/claude-drafts/` was changed. Q was not re-opened; the ten published Genesis Q records stand as they are.

Every KJV quotation was asserted by script to be an exact run of characters in the stated verse of `data/chapters.json`. Every Hebrew quotation was located in the fetched WLC verse by its consonants and written out with the edition's own points and accents. Every Brenton Greek quotation was asserted as an exact run in the printed verse of the fetched page. Greek New Testament quotations were asserted against TISCH, and the script checked whether TR has the same words (it does everywhere except the name at Luke 3:36, where both are quoted). All 13 `sides` sets passed `validateSides` in `scripts/verse-roles.mjs`. All 98 source addresses answered.

Codex's decisions on the Genesis Q batches were read first (`research/notes/claude-ready-genesis-q-2026-10-12.md`): chapters 1–4, 3 accepted as written; chapters 5–50, 7 accepted, one with a scope sentence narrowed. Codex noted on the Shiloh record that the G examination was deferred to this session; it is record 20 below.

## Verse numbers — read before checking quotes

- **Genesis 32:** the Hebrew (WLC) and Brenton's Greek number each verse one higher than the KJV. KJV 32:30 is 32:31 in both; the record says so.
- **Numbers 26:** Brenton's Greek orders the tribes differently. KJV 26:40 (sons of Bela) is printed as 26:44 on the Greek page; the Hebrew keeps 26:40.
- **Genesis 22:16:** the Greek page prints `ἀγαπτοῦ` (so spelled). It is quoted as printed.
- **Numbers 26:40 in the packaged KJV** prints "ard" without a capital ("the sons of Bela were ard and Naaman"). The text and the side quote use the packaged spelling so that they validate. Codex may want to correct the packaged verse and the side together.
- All other chapters quoted use the KJV's numbers in both editions.

## Records

| # | ID | Verses | Tags | Why it qualifies |
|---|---|---|---|---|
| 1 | `beasts-and-fowl-formed-before-man-or-after` | 2:19 (tag); 2:7, 1:21, 1:25, 1:27 | G | Order of beasts, fowl and man differs between the chapters as worded; Greek 2:19 adds "further". |
| 2 | `god-ended-his-work-on-the-seventh-day-or-the-sixth-greek` | 2:2 | G | Greek "sixth day" for the KJV's first "seventh day". |
| 3 | `in-the-day-thou-eatest-thou-shalt-surely-die-adam-lived-930-years` | 2:17, 5:5 | — | Direct wording contrast; reconcilable only by a reading the text does not state. |
| 4 | `cain-talked-with-abel-greek-gives-his-words` | 4:8 | G | Greek gives Cain's words; the KJV has none anywhere in the chapter. |
| 5 | `men-began-to-call-on-the-name-of-the-lord-or-enos-hoped-greek` | 4:26 | G | Different subject and verb in the Greek. |
| 6 | `ages-at-fatherhood-before-the-flood-greek-differs` | 5:3, 6, 9, 12, 15, 21, 25, 28 | G | Eight of nine ages differ; totals 1,056 and 1,642 years. |
| 7 | `shem-a-hundred-years-old-two-years-after-the-flood` | 11:10, 5:32, 7:6 | — | Arithmetic that does not add up. |
| 8 | `arphaxad-begat-salah-or-cainan-greek-genesis-and-luke` | 11:12, 11:13, 10:24 (tag); Luke 3:36 | G | Genesis and Luke differ by a generation; Greek of Genesis has Luke's Cainan. |
| 9 | `terah-died-at-205-yet-abram-left-haran-at-75-after-his-death` | 11:32, 11:26, 12:4, Acts 7:4 | — | Arithmetic: 70 + 75 = 145, not 205. |
| 10 | `he-gave-him-tithes-of-all-greek-names-abram` | 14:20 | G | Greek names the giver; the KJV of Genesis does not. Weakest G — see below. |
| 11 | `ishmael-past-fourteen-or-a-child-set-on-hagars-shoulder-greek` | 21:14, 21:16 | G | Greek puts the child on Hagar's shoulder and has the child cry; ages make him fourteen or more. |
| 12 | `thine-only-son-isaac-or-thy-beloved-son-greek` | 22:2, 22:12, 22:16 | G | "Only son" beside a living brother; Greek has "beloved" all three times. |
| 13 | `god-did-tempt-abraham-or-god-tempteth-no-man` | 22:1, James 1:13 | — | Direct wording contrast; same Greek verb in both. |
| 14 | `bashemath-daughter-of-elon-the-hittite-or-of-ishmael` | 26:34, 28:9, 36:2, 36:3 | — | One name given two fathers. |
| 15 | `jacob-saw-god-face-to-face-or-no-man-hath-seen-god` | 32:30, Exodus 33:20, John 1:18 | — | Direct wording contrast. Overlaps a built-in study — see below. |
| 16 | `benjamin-born-near-ephrath-or-in-padanaram` | 35:26, 35:24, 35:16, 35:18 | — | Two birthplaces in one chapter. |
| 17 | `benjamin-ten-sons-or-sons-and-grandsons-greek` | 46:21 (tag); Numbers 26:40 | G | Naaman and Ard are sons in Genesis, grandsons in Numbers; Greek of Genesis divides the list. |
| 18 | `israel-bowed-upon-the-beds-head-or-the-top-of-his-staff` | 47:31 (tag); Hebrews 11:21 | G | Bed in Genesis, staff in Hebrews; Greek of Genesis has the staff. |
| 19 | `simeon-and-levi-digged-down-a-wall-or-houghed-an-ox` | 49:6 | H, G | Pointed Hebrew and Greek both have a hamstrung ox where the KJV has a wall dug down. |
| 20 | `until-shiloh-come-or-until-the-things-laid-up-for-him-come-greek` | 49:10 | G | Greek has no name, and differs at two more points in the verse. |

Totals: 12 G, 1 H+G, 7 untagged, no V. 13 carry `sides`; the seven without are one reading against another, not two KJV statements.

**No V record is possible in Genesis.** Every act in the book is before Sinai, and the owner's test excludes pre-Sinai acts.

Tag placement follows Codex's 1 Kings and 2 Kings corrections: in a tagged record `appliesTo` holds only the verses where the tag applies and `ref` is the first of them; the other side is in `refs` and `sides`. Untagged conflicts keep both sides in `appliesTo`.

## Points for Codex

1. **Record 15 and the built-in study `seen`** (`src/data.js`, "Can God be seen?", Exodus 33:11 against John 1:18). The study does not cite Genesis 32:30. The record adds only Jacob's statement and says Exodus 33:11 and 24:10 are not treated. If Codex judges it a duplicate of the study's question, hold it; the Genesis quotes are sourced if 32:30 is wanted as a reference on the study.
2. **Record 1 and the built-in studies `animals` and `plants`.** `animals` is about water or ground as the fowl's origin (1:20, 2:19); `plants` is about 1:11 and 2:5. Record 1 is about the order of beasts, fowl and man, and expressly leaves the plants out. It does not repeat either.
3. **Record 19, the H.** It rests on the vowel points: "ox" and "wall" share consonants. The scope says so plainly. If the H is held, the G still stands by itself, since Brenton's Greek has "hamstrung a bull".
4. **Record 10** is the weakest G: the Greek adds a name, and the KJV names Abraham as the giver at Hebrews 7:2. It is issued because the KJV of Genesis leaves the giver unnamed and the last "he" before it is Melchizedek. Hold it if a plus stated in another book of the KJV is not enough.
5. **Record 20 and the published Q record** `until-shiloh-come-who-or-what-is-shiloh` both sit on 49:10. They are separate findings: the Q asks who Shiloh is; this one compares the Greek. Neither changes the other.
6. **Record 12** quotes Genesis 22:12 and 22:16, where the published Q record on the angel of the Lord also has placements. The findings are unrelated.

## Decisions on the six points (2026-10-12)

The owner asked Claude to decide these, using its judgement of the project’s goals. They are the owner’s delegated decisions, relayed to Codex by the owner; the records themselves are unchanged and cite none of this.

1. **Accept record 15 as a separate record.** It places Jacob’s statement at Genesis 32:30, a verse the study `seen` does not cite. Do not merge it into the study.
2. **Accept record 1 as distinct** from `animals` and `plants`.
3. **Keep H and G on record 19.** The project’s Hebrew source is the pointed text, and as pointed the word is “ox”. If Codex still finds the H unproven, keep the record with G only; do not drop it.
4. **Accept record 10.** A Greek addition is dropped only when the KJV states the same thing in the same passage. A statement in another book does not remove the difference at the verse itself.
5. **Keep records 20 and the published Shiloh Q record separate**, both on 49:10.
6. **“ard” at Numbers 26:40:** compare the packaged verse with its source page (https://ebible.org/eng-kjv/NUM26.htm). If the source has “Ard”, correct the packaged verse and the side quote and text of record 17 in one change. If the source also has “ard”, leave all three as they are.

## Verses compared

All fifty chapters were fetched in WLC and Brenton's Greek, but they were **not read in full**. The verses compared in all three texts were: 1:20–21, 1:25–27; 2:2, 2:4–5, 2:7, 2:17–19; 3:6; 4:8, 4:26; 5:3–32 (the age verses); 7:6, 7:11; 8:4; 10:21, 10:24; 11:10–13, 11:26, 11:31–32; 12:1, 12:4; 14:18–20; 15:13; 16:15–16; 17:25; 21:5, 21:8–20; 22:1–2, 22:12, 22:16; 25:1, 25:9; 26:34; 28:9; 31:3, 31:13; 32:24–30; 35:9, 35:16–19, 35:22–26; 36:2–3, 36:20, 36:24–25; 46:21–22; 47:31; 48:2; 49:5–7, 49:10, 49:22. Outside Genesis: Exodus 4:2, 12:40, 16:4, 21:28, 33:11, 33:20; Numbers 26:38–41; Joshua 11:6; 2 Samuel 8:4; Hosea 12:3–4 (KJV only); 1 Chronicles 1:18, 1:24, 1:32, 8:1–3; Luke 3:35–36; John 1:18; Acts 7:2–6; Galatians 3:17; Hebrews 7:1–2, 11:17, 11:21; James 1:13–14. They were chosen from the "Seen in passing" list of the Q session and from known difficulties in the book. A verse not listed has not been cleared.

Published records touching Genesis were checked first: `early-ark-count`, `exodus-family-counts`, `exodus-divine-name`, `deuteronomy-levi-blessing-and-rebuke`, `joshua-wilderness-circumcision`, `shechem-burial-land-purchaser`, `midianites-and-ishmaelites`, `jacob-shechem-portion-bought-or-taken`, `lord-repented-of-saul-not-a-man-to-repent`, `numbers-blessing-stability-and-relenting`, the science records on chapter 1, and the ten Q records. None is re-issued or extended. All 20 IDs are new.

## The "Seen in passing" items from the Q session

- Terah's age — record 9.
- Ishmael's age when sent away — record 11.
- "Thine only son" — record 12.
- Esau's wives — record 14.
- Benjamin among those born in Padanaram — record 16.
- The Greek of 49:10 — record 20.
- The Greek of 14:20 — record 10.
- The longer Greek of 31:13 — **not proposed.** The Greek "the God who appeared to thee in the place of God" turns the name Bethel into its meaning and adds an appearing the KJV states at 35:1 (“God, that appeared unto thee”); the closing "and I will be with thee" is in the KJV at 31:3. Nothing is added that the KJV lacks nearby.

## Considered and ruled out

- 6:6 ("it repented the Lord") against Numbers 23:19: already published in `lord-repented-of-saul-not-a-man-to-repent` and `numbers-blessing-stability-and-relenting`.
- 15:13 (four hundred years) against Exodus 12:40 (four hundred and thirty): the two verses measure different things, an affliction and a sojourning. The real finding is the Greek of Exodus 12:40, which adds "and in the land of Chanaan"; it belongs to the Exodus session. Quotes sourced.
- 1:20 "fowl that may fly": the Hebrew has a plain verb, but Brenton's Greek reads it much as the KJV does, so the Hebrew is not shown to exclude the KJV's sense. No H. The built-in study `animals` already treats the verse.
- 2:5 "every plant of the field before it was in the earth": the KJV's syntax differs from the usual reading of the Hebrew, but the Hebrew word can mean "before", and the Greek reads as the KJV does. No H. The built-in study `plants` treats the verse.
- 12:1 "the Lord had said" against Acts 7:2 (the call before Haran): the KJV's "had said" already allows Acts' order. No conflict as worded.
- 25:1 Keturah a "wife" against 1 Chronicles 1:32 "concubine": 25:6 itself speaks of Abraham's concubines; the terms are not shown to exclude each other.
- 21:31 against 26:33 (Beersheba named twice); 28:19 against 35:15 (Bethel named twice); 32:28 against 35:10 (Jacob renamed twice): a second naming does not contradict a first.
- 10:5, 20, 31 ("after their tongues") against 11:1: ruled out in the Q session; needs an assumed order.
- 7:17 (forty days) against 7:24 (a hundred and fifty days): different things counted.
- 36:2 Zibeon "the Hivite" against 36:20 "the Horite"; 10:7 against 10:28–29 (Sheba and Havilah in two lines): possibly different men or peoples; not stated to be the same.
- 38 against 46:12 (Judah's grandsons within twenty-two years); 29–30 (eleven children in seven years): need a chronology the text does not give.
- 37:10 ("thy mother") after Rachel's death at 35:19: argument from order of telling.
- 6:4 "giants", 37:3 "coat of many colours", 41:43 "Bow the knee", 30:11 "A troop cometh", 36:24 "mules", 24:47 "upon her face": disputed or unresolved Hebrew, or resting on written and read forms; no H shown.
- 37:36 Potiphar "an officer": the Greek has "eunuch", but the Hebrew word can carry the KJV's sense. No H; G held back.
- 12:6, 13:7, 14:14, 21:32, 36:31: dating and authorship; need outside sources.
- 9:3 against the food laws; 20:12 and 29:28 against Leviticus 18: pre-Sinai, so not V, and not contradictions.
- Greek differences seen and held back to keep the batch small, quotes sourced: 7:11 and 8:4 (twenty-seventh day for the KJV's seventeenth); 46:22 (eighteen souls for fourteen — bound up with the published `exodus-family-counts`); 36:2 ("Ana the son of Sebegon" for "Anah the daughter of Zibeon"; noted in record 14, not tagged); 36:24 (a name, "Iamin", for "mules"); 11:32 ("in the land of Charrhan" added; noted in record 9, not tagged); 11:13 (four hundred years for four hundred and three); 33:19 (lambs for pieces of money — two published records already cite the verse). In Brenton's Greek of chapter 5, Methuselah's 167 and 802 years carry him fourteen years past the flood by that edition's own figures; not proposed, because it is a point inside the Greek and not a difference from the KJV at one verse.

## Questions

For the owner: none.

For Codex: the six points above, and the "ard" spelling in the packaged KJV at Numbers 26:40.
