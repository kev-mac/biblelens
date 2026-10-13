# Ezra 1–10 — notes (2026-10-13)

File: `ezra-1-10-records.json` — 11 records: 6 G, 5 untagged, no H, no V; all 11 carry `sides`. All are drafts until Codex accepts them. The Q records are in `ezra-1-10-q-records.json` with their own notes.

Every KJV quotation and side was asserted by script against `data/chapters.json`; every Hebrew, Aramaic and Greek quotation against the fetched page at its printed verse; sides were validated with `scripts/verse-roles.mjs`; all 36 source addresses answered. `data/evidence.json` (486 records, last changed 10:08) and the six built-in studies were checked before and again just before writing.

## Verse numbers and editions

- Ezra: no difference between the KJV, WLC and Brenton’s Greek at any verse quoted. Brenton’s Greek prints the same number of verses as the KJV in all ten chapters and no lettered verses (asserted by script).
- Ezra 4:8–6:18 and 7:12–26 are Aramaic in the Hebrew Bible; the records say “Aramaic of the Hebrew Bible (WLC)” where they quote those verses.
- Nehemiah 7: WLC runs one verse lower than the KJV from KJV 7:69 on (KJV 7:70 = WLC 7:69). Only the KJV is quoted for Nehemiah 7:70–72.
- **Brenton’s Greek has no Nehemiah pages.** `grcbrent/NEH01.htm` and the rest give 404. Its Nehemiah is printed as chapters 11–23 of the Ezra pages (`grcbrent/EZR11.htm` … `EZR23.htm`, so Nehemiah 7 = `EZR17.htm`); Brenton’s English does have `eng-Brenton/NEH07.htm`. No Greek of Nehemiah is quoted in this batch, and the records say so.

## Records

1. `returned-families-five-more-counts-ezra-or-nehemiah` (untagged) — five family counts that differ between Ezra 2 and Nehemiah’s copy of the same register (Zattu, Azgad, Adin, Senaah, Asaph). Beside the published `early-arah` and `early-pahath`, not a duplicate of them.
2. `whole-congregation-42360-or-the-sum-of-the-counts-given` (untagged) — arithmetic: the counts add to 29,818 (Ezra) and 31,089 (Nehemiah) against a stated 42,360. Sums computed and asserted by script.
3. `gifts-to-the-treasure-61000-drams-or-41000` (untagged) — Ezra 2:69 against Nehemiah 7:70–72.
4. `foundation-of-the-house-laid-by-sheshbazzar-or-by-zerubbabel` (untagged) — Ezra 5:16 against 3:8 and Zechariah 4:9. Reconcilable only by an identity or shared role no quoted verse states; the scope says so.
5. `foundation-laid-in-second-year-of-the-return-or-in-second-year-of-darius` (untagged) — Ezra 3:8–11 against Haggai 2:18. The clash holds on the KJV’s “even”; the scope states the other reading of the Hebrew and Greek.
6. `sheshbazzar-made-governor-or-the-treasurer-greek` (G, 5:14) — different office in the Greek.
7. `azmaveth-bethel-and-ai-harim-three-counts-differ-in-greek` (G, 2:24, 2:28, 2:39) — three figures; found with `numscan.mjs` and read in the Greek.
8. `bishlam-mithredath-tabeel-wrote-or-wrote-in-peace-to-mithradates-greek` (G, 4:7) — a name in the KJV is two ordinary words in the Greek, and writer and addressee differ.
9. `then-said-we-unto-them-or-they-said-names-of-the-builders-greek` (G, 5:4) — first person in the KJV and Aramaic, third person in the Greek; “building” against “city”.
10. `sons-of-shechaniah-and-of-shelomith-families-named-in-greek` (G, 8:5, 8:10) — the Greek has a family name the KJV lacks in each entry.
11. `iddo-the-chief-at-casiphia-or-rulers-with-the-money-of-the-place-greek` (G, 8:17) — no Iddo and no Casiphia in the Greek; “singers” for “ministers”.

## What was compared

- All 280 verses of Ezra were read in Brenton’s English. The KJV was read only at the verses quoted and at those listed below; the book was not read in full in the KJV, Hebrew or Greek.
- `numscan.mjs` compared the number words of every KJV verse of Ezra with Brenton’s English of the same verse.
- Ezra 2:3–60 and Nehemiah 7:8–62 were set side by side in the KJV by script (names and figures). Names in the two lists were not collated.
- Hebrew and Greek were read at: 1:8; 2:8, 2:12, 2:15, 2:24, 2:28, 2:35, 2:39, 2:41, 2:64, 2:68–69; 3:8, 3:10; 4:5–7, 4:24; 5:3–4, 5:14, 5:16; 6:14–15, 6:22; 8:1, 8:3, 8:5, 8:10, 8:17; 10:3, 10:19, 10:44; Haggai 2:10, 2:15, 2:18; Zechariah 4:9. Hebrew only at Nehemiah 7:13, 7:17, 7:20, 7:28, 7:32, 7:38, 7:42, 7:44, 7:66.

## Points for Codex

- Record 2 carries two side-A entries and no side B: the other side is the list, not a single verse.
- Record 2 notes that Brenton’s Greek of 2:64 has “about” before the total, and record 3 that it has minas for drams; neither is tagged.
- Record 4’s `ref` is Ezra 5:16 (side A); 3:8 and Zechariah 4:9 are side B.
- Overlap reported by the script: Ezra 1:11 is also a ref of the published `early-vessels`; here it is context only. Ezra 3:8 is not the 3:2 of the published Zerubbabel record.
- Record 8’s rendering of the Greek differs from Brenton’s own English (“Tabeel wrote peaceably to Mithradates”): the Greek name Tabeel has no case ending, and the scope says that its role is not settled by its form.

## Considered and not issued

- Zechariah “the son of Iddo” (5:1, 6:14) against “the son of Berechiah, the son of Iddo” (Zechariah 1:1) — the KJV uses “son” across a generation elsewhere, so the scope would concede there is no conflict.
- Ezra’s line in 7:1–5 against 1 Chronicles 6:3–15 (fewer names) — a list not stated to be complete.
- The vessels of 1:9–11 — the conflict is published (`early-vessels`); the Greek has the same figures and differs only in what some vessels are called.
- 2:2 against Nehemiah 7:7 (eleven names or twelve; several spellings) — names and spelling.
- 8:1 Greek “king of Babylon” — the KJV itself calls Artaxerxes that at Nehemiah 13:6.
- 10:15 (“were employed about this matter”) for H — the Hebrew quoted can carry more than one sense; no shown difference.
- Departure on the first day (7:9) or the twelfth (8:31) — different starting points are named.
- No V: the one breach told at length (the marriages of chapters 9–10) is rebuked in the passage.
- No H: no verse compared showed a difference in meaning between the KJV and the Hebrew or Aramaic.

## Held back, quotes sourced

Brenton’s Greek at 6:14 (adds “and the Levites”), 6:6 (no Tatnai), 4:23 (“with horses and an armed force”), 8:27 (no “two” before the vessels), 10:38 (“the sons of Banui and the sons of Semei”), 1:9 (“changes” for “knives”), 3:10 (no “the builders”).

## For the owner

Nothing.
