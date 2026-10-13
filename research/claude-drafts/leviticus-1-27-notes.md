# Leviticus 1–27 — H, G, V and untagged records, notes

Session of 2026-10-13. File: `leviticus-1-27-records.json` (12 records: 9 G, 3 untagged, no H, no V; 3 carry `sides`). The Q records are in `leviticus-1-27-q-records.json` with their own notes. All are drafts until Codex accepts them; `status` is the intended published value.

Every KJV quotation and every side was asserted by script against `data/chapters.json`; every Hebrew and Greek quotation against the fetched page at its printed verse; sides were validated with `scripts/verse-roles.mjs`; all 51 source addresses answered (bolls.life returns 429 when asked quickly; they answered on a paced retry).

The chapters were **not** read in full. The verses compared are listed under “What was compared”.

## Verse numbers

- No record rests on a verse where the numbering differs. Hebrew, Brenton’s Greek and the KJV carry the same numbers at every verse quoted.
- Leviticus 5–6 were not used; the Hebrew numbering of those chapters was not checked this session.
- Luke 2:22: Tischendorf (TISCH) and the Textus Receptus text served by bolls.life (TR) differ in one word. Both are quoted. The TR text is served without accents and is quoted as served.

## Records

G (Septuagint unless stated):

1. `second-animal-cheweth-the-cud-or-does-not-chew-the-cud-greek` (Lev 11:6) — KJV and Hebrew: the hare “cheweth the cud”; Brenton’s Greek of the same verse: “does not”.
2. `her-purification-or-their-purification-greek-new-testament` (Luke 2:22, Greek New Testament) — KJV “her purification”, as Leviticus 12 has it; Tischendorf “their”. Issued here because Leviticus is the earlier book.
3. `slaughter-away-from-the-tabernacle-greek-limits-it-to-offerings` (Lev 17:3, 17:4) — the Greek adds strangers and a clause naming burnt and peace offerings.
4. `sacrifices-unto-devils-or-to-vain-things-greek` (Lev 17:7) — “devils” against “vain things”.
5. `seed-pass-through-the-fire-to-molech-or-given-to-serve-a-ruler-greek` (Lev 18:21; 20:2–5) — the Greek has “ruler” in all five verses and no fire.
6. `she-shall-be-scourged-or-there-shall-be-an-inquiry-for-them-greek` (Lev 19:20) — the Greek names no scourging and says “for them”.
7. `eat-with-the-blood-or-eat-on-the-mountains-greek` (Lev 19:26) — “with the blood” against “on the mountains”.
8. `morrow-after-the-sabbath-or-morrow-of-the-first-day-greek` (Lev 23:11) — “the sabbath” against “the first”.
9. `blasphemeth-the-name-or-names-the-name-greek` (Lev 24:16, 24:11) — “blasphemeth” against “names”.

Untagged, each with `sides`:

10. `congregation-sin-of-ignorance-a-bullock-for-sin-or-a-bullock-burnt-and-a-kid-for-sin` (Lev 4:14; Num 15:24) — the sin offering is a bullock in one law and a kid in the other.
11. `flying-creeping-things-some-may-be-eaten-or-none` (Lev 11:21–22; Deut 14:19) — four kinds allowed in one law; “every” one forbidden in the other.
12. `commanded-to-offer-at-sinai-or-commanded-nothing-concerning-burnt-offerings` (Lev 7:38; Jer 7:22) — “commanded … to offer” against “nor commanded them … concerning burnt offerings”.

## Points for Codex

- **Record 1, animal names.** The Hebrew and Greek names are left untranslated in the brackets. Brenton’s Greek lists the two animals of 11:5–6 in the same order as its Deuteronomy 14:7, where it says both chew the cud; the Hebrew lists them in the opposite order in the two books. The record claims only the “does not” in the Greek of 11:6.
- **Record 2, G against one Greek edition.** The TR text agrees with the KJV; the G rests on Tischendorf. The record says so in summary and scope. If G is not to be placed where the TR agrees with the KJV, hold it.
- **Record 5, no H.** The Hebrew of 18:21 has no separate word for “fire”. H is not proposed, because the same verb stands with fire and Molech at 2 Kings 23:10 and the Hebrew can carry the KJV’s sense. Brenton’s English page prints “Moloch” at 20:2–4; the Greek page prints ἄρχοντι there, and only the Greek is quoted.
- **Records 6 and 9, no H.** The Hebrew noun at 19:20 and the Hebrew verb at 24:11 and 24:16 are left unrendered in the brackets, because no one meaning is shown. If a bracket that does not translate the key word is not acceptable, the rest of each record stands without it.
- **Record 9** has `ref` 24:16 (the law) and also tags 24:11 (the story).
- **Records 10–12 overlap published records by verse, not by finding:** `leviticus-inadvertent-guilt` and `numbers-ignorance-and-defiance` (record 10), `leviticus-carcass-and-food-category` does not cite 11:20–23 (record 11). Record 3 shares 17:3–5 with `deuteronomy-local-slaughter-and-sacrifice`, which compares the two laws; record 3 compares the Greek wording only.
- **Packaged KJV:** Leviticus 25:17 prints “thy God:for I am” with no space after the colon. Not quoted in any record.

## What was compared

KJV, Hebrew (WLC) and Brenton’s Greek, verse by verse: Leviticus 1:1–2; 4:13–14, 4:20–21; 7:37–38; 10:1–3; 11:4–7, 11:13, 11:19–23; 12:2–8; 16:2, 16:8–13, 16:21–22, 16:26; 17:3–7; 18:18, 18:21; 19:16–17, 19:20, 19:26; 20:2–5; 21:4, 21:7, 21:13–14; 23:5–8, 23:11, 23:14–16, 23:32, 23:39; 24:7, 24:11, 24:15–16; 25:2–4, 25:8–11, 25:20–22, 25:39–41; 26:30; 27:2–3. Parallels: Numbers 15:22–26; Deuteronomy 14:7, 14:19–20; Joshua 5:11; 2 Kings 23:10; Jeremiah 7:21–23; Luke 2:22–24 (TR, TISCH, SBLGNT).

All other verses of Leviticus were not compared. The published records that cite Leviticus verses and the six built-in studies were checked for overlap before writing and again at the moment of writing.

## Considered and ruled out, or held back

- **V:** none. The acts told in Leviticus (10:1–2; 10:16–20; 24:10–23) are each punished or answered in the passage. Breaches of Leviticus laws told in later books belong to those books.
- **H:** none met the test. 16:8 “scapegoat” is a Q record; H on a name or an unexplained word was not proposed while the Red Sea record is held.
- 11:5–6, 11:13–19, 11:20–23 as science (cud, bat among fowls, four feet) — outside what Claude proposes; not issued.
- 18:16 and 20:21 against Deuteronomy 25:5; 17:3–4 against Deuteronomy 12; 23:18–19 against Numbers 28:27; 7:31–34 against Deuteronomy 18:3; 25:39–46 against Exodus 21 — already published.
- 21:13, Greek “of his own kin” — the KJV says “of his own people” in the next verse; dropped as an addition the passage already states.
- Held back, quotes sourced: Greek differences at 21:4 (“suddenly” for “a chief man”), 24:7 (salt added), 26:30 (“wooden things made with hands” for “images”), 23:16 (“the last week”), 12:3 and 19:16.
- 3:17 against Nehemiah 8:10 (“eat the fat”) — different words; a synonym case.
- 18:9 and 18:18 beside Genesis 20:12 and 29 — earlier than the law; not a conflict of wording.

## Questions — For the owner

None from this batch.
