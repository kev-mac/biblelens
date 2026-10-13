# Deuteronomy 1–34 — H, G, V and untagged records, notes

Session 2026-10-13. File: `deuteronomy-1-34-records.json` (11 records: 10 G, 1 H, no V, no untagged; 5 carry `sides`). All are drafts until Codex accepts them. Q records are in `deuteronomy-1-34-q-records.json` with their own notes.

## Records

1. `love-god-with-heart-soul-might-or-with-mind-soul-strength-greek` (6:5, G) — Brenton’s Greek has “mind” where the KJV has “heart”; Matthew 22:37 and Mark 12:30 quote two further forms.
2. `serve-him-or-him-only-shalt-thou-serve-greek` (6:13, G) — the Greek has “him only”, the form quoted in Matthew 4:10, and a clause about cleaving that the KJV has only at 10:20.
3. `passover-thou-shalt-roast-or-boil-and-roast-greek` (16:7, G) — the Greek has “boil and roast” for the KJV’s “roast”; the Hebrew verb is the one Exodus 12:9 uses with “in water”.
4. `a-syrian-ready-to-perish-was-my-father-or-my-father-abandoned-syria-greek` (26:5, G) — in the Greek the father leaves Syria; he is not called a Syrian.
5. `confirmeth-not-all-the-words-of-this-law-hebrew-has-no-all` (27:26, H) — the KJV has “all the words”; the Hebrew quoted has no word for “all”. The Greek and Galatians 3:10 agree with the KJV, so H only.
6. `moses-went-and-spake-or-moses-finished-speaking-greek` (31:1, G) — “went and spake” against “finished speaking all these words”.
7. `bounds-by-the-number-of-the-children-of-israel-or-of-the-angels-of-god-greek` (32:8, G) — “children of Israel” against “angels of God”.
8. `to-me-belongeth-vengeance-or-in-the-day-of-vengeance-i-will-recompense-greek` (32:35, G) — the Greek has a time and a verb where the KJV has “to me” and a noun; Romans 12:19 and Hebrews 10:30 quote a form with both.
9. `rejoice-o-ye-nations-greek-adds-let-all-the-angels-of-god-worship-him` (32:43, G) — the Greek of the verse has the sentence quoted at Hebrews 1:6, which the KJV of Deuteronomy lacks.
10. `from-his-right-hand-went-a-fiery-law-or-angels-with-him-greek` (33:2, G) — “a fiery law” against “angels with him”; “saints” against “Kades”.
11. `he-buried-him-or-they-buried-him-greek` (34:6, G) — singular against plural.

## Checks made

- Every KJV quotation and side was asserted by script against `data/chapters.json`; every Hebrew quotation against the fetched WLC chapter; every Greek quotation against the fetched Brenton page at its printed verse label; Greek New Testament quotations against TISCH, with a script check that TR has the same words. Sides were validated with `scripts/verse-roles.mjs`. All 69 source addresses answered.
- Overlaps were checked against `data/evidence.json`, the six built-in studies and every earlier draft, and re-checked just before writing.

## What was compared

The book was **not** read in full. Verses compared in KJV, Hebrew and Greek: 1:1, 1:5, 3:8, 3:20, 3:25, 4:19–20, 4:46–47, 6:5, 6:13–14, 10:20, 11:30, 16:7, 17:18, 20:17, 26:5, 27:26, 29:26, 31:1–2, 32:8–9, 32:35–36, 32:43, 33:1–3, 33:6–7, 34:5–6, 34:8. Parallels compared: Exodus 12:8–9; 2 Chronicles 35:13; Matthew 4:10, 22:37; Mark 12:30; Luke 4:8, 10:27; Romans 12:19, 15:10; Galatians 3:10; Hebrews 1:6, 10:30; Jude 1:9. Read in the KJV only: 4:15–18, 17:2–5, 29:24–28, 32:40–45, 34:1–12. Candidates were chosen from the places where the Greek of Deuteronomy is known to differ, not from a verse-by-verse comparison.

## Verse numbers

- No differences at the verses quoted in this file. Deuteronomy 29 runs one lower in the Hebrew (see the Q notes). The Hebrew numbering of chapters 5, 12–13, 22–23 and 28–29 was not checked.

## For Codex

- **Four records sit beside published records on the same verse** and are meant as separate records, as with Numbers 4:3 and 35:4: 6:13 (`deuteronomy-oaths-and-matthew`), 16:7 (`deuteronomy-passover-place`, whose scope leaves the cooking terms as a separate question), 27:26 (`deuteronomy-covenant-curse-in-galatians`), 34:6 (`deuteronomy-law-custody-and-reading`). None repeats the published finding.
- **Record 5 is the only H.** Its scope admits that “the words of this law” can be read as all of them. If that concession removes the meaning difference, hold the record; it has no G to fall back on.
- **Record 3 is tagged G, not H.** The Hebrew verb may be a general word for cooking (2 Chronicles 35:13 has it with “in the fire”), so no H is claimed.
- Record 2: the Greek “only” is a word the KJV passage lacks, but KJV 6:14 forbids other gods. If that counts as the KJV stating the same thing in the same passage, hold it.
- Record 10 quotes the edition’s written and read forms as background only.
- Packaged KJV: the divine name is printed “Lord”. Quotations follow the package.

## Considered and not issued

- Plain KJV conflicts (Aaron’s death at Mosera, the spies, Edom’s passage, the ark and the tablets, the sabbath reason, the poor, the passover animals and place, the king’s horses and wives): all already published in KJV wording.
- “On this side Jordan” (1:1, 1:5) against the Greek and Hebrew “beyond Jordan”: the same Hebrew phrase is used of both banks (3:8 and 3:20, 3:25), so no meaning difference can be shown.
- “Let not his men be few” (33:6): the Greek agrees in sense with the KJV and the Hebrew is unresolved.
- “Have no child” (25:5) for the Hebrew “son”: the Hebrew word can carry the KJV’s sense.
- “Chamois” and other animal names (14:5): the animals are not identified.
- “Unicorns” (33:17): ruled out as in Numbers.
- V for Solomon’s horses and silver against 17:16–17: the act is told in 1 Kings, a published record already sets the two side by side, and a whole-Bible check for a rebuke could not be stated.
- Held back, quotes sourced: the Greek adds the Gergesite at 20:17 (KJV has it at 7:1); “this second law” for “a copy of this law” at 17:18.

## Questions — For the owner

None.
