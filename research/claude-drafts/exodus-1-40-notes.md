# Exodus 1–40 — H, G, V and untagged conflicts: notes for `exodus-1-40-records.json`

Researcher: Claude · 2026-10-12 · **All 20 records are drafts until Codex accepts them.** The `status` field is the intended published value. Nothing outside `research/claude-drafts/` was changed. The Q records of the same session are in `exodus-1-40-q-records.json` with their own notes.

Every KJV quotation was asserted by script to be an exact run of characters in the stated verse of `data/chapters.json`. Every Hebrew quotation was located in the fetched WLC verse by its consonants and written out with the edition's own points and accents, including a stand-alone paseq (׀) inside the quoted run (Exodus 33:7). Every Brenton Greek quotation was asserted as an exact run in the printed verse of the fetched page. Greek New Testament quotations were asserted against TISCH, and the script checked whether TR has the same words (it does, except for word order at Galatians 3:17, where both are quoted). All 6 `sides` sets passed `validateSides` in `scripts/verse-roles.mjs`. All 105 source addresses of the two Exodus files answered.

Codex's latest notes (`claude-ready-genesis-1-50-2026-10-12.md`) were read first; "Needs owner" is none. `data/evidence.json` (371 records), the six built-in studies and the other draft files were checked for overlap before writing and again by the script that wrote the file. All 20 IDs are new; nothing is an extension.

## Verse numbers — read before checking quotes

- **Exodus 22:** the Hebrew (WLC) and Brenton's Greek number each verse one **lower** than the KJV. KJV 22:8 is 22:7 in both; KJV 22:9 is 22:8. Record 12 says so in its text.
- **Exodus 36–39:** Brenton's Greek orders the making of the tabernacle differently. KJV 38:26 (the 603,550) is printed as **39:3** on the Greek page; the Greek page's 38:25–26 is other matter. Record 19 says so.
- **Jonah 2:** the Hebrew runs one ahead. KJV 2:5 is WLC 2:6.
- **Exodus 33:7:** the Greek page prints `ἐκλήθν` (so spelled). Quoted as printed.
- **Galatians 3:17:** TISCH has `μετὰ τετρακόσια καὶ τριάκοντα ἔτη`; TR as served has `μετα ετη τετρακοσια και τριακοντα`. Same number; both quoted.
- All other verses quoted use the KJV's numbers in both editions.

## Records

| # | ID | Verses | Tags | Why it qualifies |
|---|---|---|---|---|
| 1 | `treasure-cities-pithom-and-raamses-greek-adds-on` | 1:11 | G | Greek names a third city, On; the KJV of Exodus nowhere says Israel built it. |
| 2 | `i-am-that-i-am-or-i-am-the-one-who-is-greek` | 3:14 | G | Greek has a third-person "the one who is" where the KJV has a repeated first-person "I Am". |
| 3 | `the-lord-met-him-and-sought-to-kill-him-or-an-angel-of-the-lord-greek` | 4:24–26 | G | Greek has an angel for the Lord, and different words for Zipporah with no "husband". |
| 4 | `jochebed-his-fathers-sister-or-his-fathers-brothers-daughter-greek` | 6:20 | G | Aunt in the KJV, cousin in the Greek; 137 years against 132. |
| 5 | `sojourning-430-years-in-egypt-or-in-egypt-and-canaan-greek` | 12:40 (tag); Genesis 15:13, Acts 7:6, Galatians 3:17 | G | 430 against 400; Greek adds "and in the land of Chanaan". Deferred from the Genesis session. |
| 6 | `four-hundred-and-thirty-years-in-egypt-and-the-ages-of-kohath-amram-and-moses` | 12:40, 6:18, 6:20, 7:7 | — | Arithmetic: 133 + 137 + 80 = 350 at most, not 430. |
| 7 | `israel-went-up-harnessed-or-in-the-fifth-generation-greek` | 13:18 | G | "Harnessed" against "in the fifth generation". |
| 8 | `the-lord-is-a-man-of-war-or-the-lord-who-crushes-wars-greek` | 15:3 | G | Greek has no "man" and reverses the sense. |
| 9 | `it-is-manna-or-what-is-this-greek` | 16:15 | G | A statement in the KJV, a question in the Greek. |
| 10 | `because-the-lord-hath-sworn-or-with-a-secret-hand-greek` | 17:16 | G | An oath in the KJV, a "secret hand" in the Greek; the Hebrew has neither word. |
| 11 | `kill-adultery-steal-or-adultery-steal-kill-greek-order` | 20:13–15 | G | The Greek of each verse is a different commandment from the KJV's. |
| 12 | `brought-unto-the-judges-or-before-god-greek` | 21:6, 22:8, 22:9 | G | "Judges" in the KJV, "God" in the Greek, three times. |
| 13 | `no-mischief-follow-or-the-child-not-fully-formed-greek` | 21:22–23 | G | The test is harm in the KJV and the child's formation in the Greek. |
| 14 | `they-saw-the-god-of-israel-or-the-place-where-he-stood-greek` | 24:10–11 | G | Greek twice avoids saying that they saw God. |
| 15 | `he-rested-and-was-refreshed-or-fainteth-not-neither-is-weary` | 31:17 (tag); Isaiah 40:28 | G | Direct wording contrast; Greek of Exodus lacks "was refreshed". |
| 16 | `moses-took-the-tabernacle-or-his-own-tent-greek` | 33:7 | G | Greek says "his tent"; the KJV has "the tabernacle" before it is made. |
| 17 | `moses-feared-and-fled-from-pharaoh-or-forsook-egypt-not-fearing-the-king` | 2:14, 2:15, Hebrews 11:27 | — | Direct wording contrast; reconcilable only by a reading Hebrews does not state. |
| 18 | `neither-shalt-thou-go-up-by-steps-unto-mine-altar-or-his-stairs-toward-the-east` | 20:26, Ezekiel 43:17 | — | Command against command; same Hebrew noun. |
| 19 | `silver-from-603550-numbered-before-the-numbering-of-the-second-month` | 38:26, Numbers 1:1, 1:46 | — | Sequence and arithmetic: the same total is used a month before the numbering that gives it. |
| 20 | `red-sea-or-sea-of-suph-hebrew` | 10:19, 13:18, 15:4, 15:22 | H | The Hebrew name has no word for "red"; the KJV renders suph as "flags" and "weeds" elsewhere. |

Totals: 15 G, 1 H, 4 untagged, no V. 6 carry `sides` (records 5, 6, 15, 17, 18, 19); the rest are one wording against another, not two KJV statements.

Tag placement follows Codex's 1 Kings and 2 Kings corrections: in a tagged record `appliesTo` holds only the verses where the tag applies and `ref` is the first of them. Untagged conflicts keep both sides in `appliesTo`.

## No V record

No V is proposed. Acts before Sinai (Amram's marriage, 6:20; the killing of the Egyptian, 2:12) do not qualify. After Sinai the one clear breach in the book, the calf, is rebuked in the same chapter. Later breaches of laws given in Exodus fall to the books in which the acts are told. Record 18 is command against command, which is a contradiction and not a violation.

## Points for Codex

1. **Record 20, the H.** It rests on the meaning of the name: "sea of suph" is not "Red sea", and the KJV itself renders suph as a water plant. The scope says the record makes no claim about where the sea was. If Codex judges "Red sea" to be only the customary name for the same water, and so not a difference in meaning, hold it; nothing else depends on it. Brenton's Greek agrees with the KJV, so there is no G to fall back on.
2. **Record 14 and the built-in study `seen`.** The study cites Exodus 24:9–11. Record 14 does not ask the study's question; it reports that Brenton's Greek twice avoids "saw God", which the study does not mention. Its scope leaves the seeing-God question aside.
3. **Record 3 and the published `exodus-zipporah`.** The published record is about the abruptness of the scene. Record 3 is the Greek wording only. No Q was issued on the passage; see the Q notes.
4. **Records 5 and 6 share Exodus 12:40.** Record 5 is the Greek addition and the 400/430 figures. Record 6 is the arithmetic from the ages. Each stands without the other.
5. **Record 19** quotes verses also cited by `exodus-census-ransom`, `exodus-voluntary-and-fixed-giving` and `numbers-military-census-scope`. Those describe the payment and the census criteria; none sets the date of Exodus 40:17 against the date of Numbers 1:1.
6. **Record 15** is the weakest G: the Greek lacks one verb's sense ("was refreshed") and has "rested" in its place. The conflict with Isaiah stands without the tag if the G is held.
7. **Record 2 and the published `exodus-divine-name`** share 3:13–14; the published record is about when the name was known.
8. **Record 16 and `exodus-cloud-entry-guidance`** share 33:7; the published record notes two tent scenes, and its scope leaves their relation open. Record 16 adds the Greek "his tent".

## Considered and ruled out

- "Borrow" at 3:22, 11:2, 12:35: the Hebrew verb is used for borrowing elsewhere; no shown difference in meaning.
- "Thou shalt not kill" as "murder" (20:13): the Hebrew verb is also used of unintended killing; and `exodus-command-and-penalties` covers the passage.
- "Groves" (34:13): already published for Judges as `judges-groves-or-asheroth`.
- "Naked" at 32:25: the Hebrew can carry the KJV's sense.
- "Harnessed" (13:18) as H: an accepted sense of the Hebrew; G only.
- "Judges" (21:6, 22:8–9) as H: the Hebrew meaning in these laws is unresolved; G only.
- "It is manna" (16:15) as H: the Hebrew can be read either way; G only.
- Visiting the iniquity of the fathers (20:5, 34:7) against Deuteronomy 24:16 and Ezekiel 18:20: those verses are already on published records.
- Face to face (33:11) against 33:20: covered by the study `seen`.
- Jethro's advice against Deuteronomy 1:9–15; six days of unleavened bread at Deuteronomy 16:8; the female servant at 21:7 against Deuteronomy 15:17: already on published records.
- Hebrews 9:4 (the censer and the contents of the ark): the KJV's "censer" removes the clash with Exodus 30:6 as worded; the contents of the ark against 1 Kings 8:9 was not pursued.
- Hebrews 9:19–20 against Exodus 24:5–8; Hebrews 12:21; Acts 7:23 and 7:30 (Moses' age): additions the Exodus account does not exclude; arguments from silence.
- Zipporah and the sons taken to Egypt (4:20) and brought back by Jethro (18:2): 18:2 itself says she had been sent back.
- Jethro at "the mount of God" (18:5) before the arrival at Sinai (19:1–2); the pot of manna laid up "before the Testimony" (16:34): order of telling, not a stated conflict.

## Held back, quotes sourced

Greek differences seen and not issued, to keep the batch small: 2:25 ("was made known to them"), 4:16 ("in things pertaining to God"), 9:16 ("thou wast preserved"), 25:5 ("blue skins" for "badgers' skins"), 32:14 ("was propitiated"), the further Greek plus at 6:20 ("and Mariam their sister", which the KJV has at Numbers 26:59), 1 Kings 9:26 ("the farthest sea" for "Red sea"), Isaiah 40:28 ("shall not hunger" for "fainteth not"; seen in passing and not quoted in record 15). The large difference in order and length between the KJV and Brenton's Greek in chapters 36–39 was not examined beyond locating 38:26.

## Verses compared

All forty chapters were fetched in WLC and Brenton's Greek, but they were **not read in full**. The verses compared in all three texts were: 1:8, 1:11; 2:3, 2:14–15; 3:14; 4:24–26; 6:16, 6:18, 6:20; 7:7; 10:19; 12:40; 13:18; 15:3–4; 16:15; 17:16; 19:22; 20:13–15, 20:26; 21:6, 21:22–23; 22:8–9; 24:9–11; 28:30; 31:17; 33:7; 38:25–26 (with Greek 39:3). Read in the KJV only: 2:1–2, 2:5, 2:11, 2:21–22, 2:23, 3:13, 3:15, 4:19–20, 5:1, 6:1, 12:37, 12:41, 13:2, 14:5, 15:22, 16:31, 17:15, 18:2–4, 19:6, 19:24, 22:28, 24:5, 27:1, 28:1, 28:42, 30:12, 33:8, 36:8, 38:27, 40:2, 40:17. Outside Exodus, in the original languages: Genesis 15:13, 15:16, 46:11; Numbers 1:1–3, 1:46; Deuteronomy 5:17–19; Isaiah 40:28; Ezekiel 43:17; Jonah 2:5; 1 Kings 9:26; Luke 18:20; Acts 7:6; Romans 13:9; Galatians 3:17; Hebrews 11:27. In the KJV only: Genesis 46:8, 50:23; Leviticus 18:12; Numbers 1:18, 1:47, 26:59; Isaiah 19:6; Ezekiel 43:10–13, 43:18; Mark 10:19; James 2:11; Acts 7:23, 7:30. They were chosen from known difficulties in the book and from the item deferred by the Genesis session. A verse not listed has not been cleared.

## Questions — For the owner

None.
