# Psalms 73–89 (Book III) — notes

Companion to `psalms-73-89-records.json` (16 records: 16 G, no H, no V, no untagged; all carry `sides`, one with a side B at Psalms 80:17). All are drafts until Codex accepts them. Written 2026-10-13. Q records are in `psalms-73-89-q-records.json` with `psalms-73-89-q-notes.md`.

## What was compared

- Every KJV verse of Psalms 73–89 (17 psalms, 509 verses) was set against Brenton’s English of the Greek verse at the matching number by script; each verse with low word overlap, and each verse with a different number word or proper name, was then read in the KJV, the Hebrew (WLC) and Brenton’s Greek. About 100 verses were printed and read; the 16 below were kept.
- Hebrew and Greek were read in full only at the verses listed in the records and in “Considered” below. The psalms were not read in full in the Hebrew or the Greek.
- Published and drafted records were checked before writing and again just before the files were written. The only published records that list a verse of Psalms 73–89 in `refs` are `behemoth-and-leviathan-what-creatures-are-they` (74:14), `what-became-of-shiloh-after-the-ark-of-god-was-taken` (78:60–61) and `melchizedek-priest-of-the-most-high-god-origin-unstated` (76:2). The six built-in studies in `src/data.js` cite no verse of this part.
- One shared reference: Psalm 74:14 is in the published leviathan question. The record issued here compares only the Greek wording of the last words of the verse (“the people inhabiting the wilderness” / “the Ethiopian nations”) and does not say what creature leviathan is.

## Verse numbers

Greek psalm = KJV psalm − 1 for the whole part (KJV 73 is `grcbrent/PSA072.htm`). Counts, from the fetched pages:

- Hebrew and Greek run **one ahead** of the KJV (title counted as verse 1) in 75, 76, 77, 80, 81, 83, 84, 85, 88 and 89.
- **No difference** in 73, 74, 78, 79, 82, 86 and 87 (the title is printed inside verse 1).
- Hebrew and Greek offsets agree in every psalm; the script `lab2.mjs` printed the table. Brenton’s Greek prints no lettered verses in this part.
- Brenton’s Greek 77:69 opens with “Σιὼν, ὃ ἠγάπησε”, which the KJV has at 78:68.
- Brenton’s Greek prints “Σὺ συνέτριψας τὰς κεφαλὰς τοῦ δράκοντος” at the end of 73:13 and only the last clause of KJV 74:14 under 73:14. The record quotes only the last words of the verse.
- `refs` and `sides` take KJV numbers; each quotation is given at its own Hebrew or Greek number, and each record says so.

## Records (all G)

| ID | Verse | Why it qualifies |
|---|---|---|
| `my-heart-was-grieved-or-my-heart-rejoiced-greek` | 73:21 | KJV “grieved”; the Greek verb is rendered “has rejoiced” by Brenton’s English. |
| `lift-up-thy-feet-or-lift-up-thine-hands-greek` | 74:3 | “Feet … perpetual desolations” against “hands … their pride”. |
| `burned-up-all-the-synagogues-of-god-or-abolish-the-feasts-of-the-lord-greek` | 74:8 | A burning of “synagogues” against a proposal to abolish “feasts”. |
| `neither-is-there-among-us-any-that-knoweth-how-long-or-will-not-know-us-any-more-greek` | 74:9 | “Any that knoweth how long” against a verb of knowing with “us” as its object. |
| `meat-to-the-people-inhabiting-the-wilderness-or-meat-to-the-ethiopian-nations-greek` | 74:14 | Recipients described by place against by people; leviathan not discussed. |
| `the-wrath-of-man-shall-praise-thee-or-the-inward-thought-of-man-shall-give-thanks-greek` | 76:10 | “Wrath” (both clauses) against “inward thought” (both clauses); “restrain” against “keep a feast”. |
| `i-remembered-god-and-was-troubled-or-and-rejoiced-greek` | 77:3 | “Was troubled” against “rejoiced”. |
| `thou-holdest-mine-eyes-waking-or-all-mine-enemies-set-a-watch-greek` | 77:4 | God as actor against “all mine enemies” as actor. |
| `he-built-his-sanctuary-like-high-palaces-or-as-of-unicorns-greek` | 78:69 | “High palaces” against a word Brenton’s English prints “unicorns”. |
| `laid-jerusalem-on-heaps-or-jerusalem-for-a-storehouse-of-fruits-greek` | 79:1 | “On heaps” against “a storehouse of fruits”. |
| `the-branch-that-thou-madest-strong-or-the-son-of-man-greek` | 80:15 | KJV “branch” at 80:15 and “son of man” at 80:17; Greek “son of man” in both. Side B at 80:17. |
| `valley-of-baca-make-it-a-well-or-valley-of-weeping-the-lawgiver-will-grant-blessings-greek` | 84:6 | Name, well and rain against “valley of weeping”, the appointed place and “the lawgiver”. |
| `the-singers-and-the-players-all-my-springs-or-the-dwelling-of-all-is-as-of-those-that-rejoice-greek` | 87:7 | Two groups of musicians and “springs” against one clause about a dwelling. |
| `shall-the-dead-arise-and-praise-thee-or-shall-physicians-raise-them-up-greek` | 88:10 | “The dead” arise against ἰατροί (“physicians” in Brenton’s English) raise them. |
| `thou-hast-profaned-his-crown-or-thou-hast-profaned-his-sanctuary-greek` | 89:39 | “His crown” against “his sanctuary”; “made void” against “overthrown”. |
| `the-footsteps-of-thine-anointed-or-the-recompence-of-thine-anointed-greek` | 89:51 | “Footsteps” against “recompence” of the anointed. |

All quotations were asserted by script against the packaged KJV, the WLC text served by bolls.life, and Brenton’s Greek and English pages. Every source address was requested and answered (37 addresses). Sides were validated with `scripts/verse-roles.mjs`. Brenton’s own English is quoted in the text of all sixteen records with its address, only to show how that edition renders the Greek; no lexicon was used.

## Points for Codex

- 80:15 has a side B at 80:17, where the KJV words the same Hebrew clause as “son of man”; `appliesTo` is 80:15 only. The Greek and the Hebrew agree against the KJV’s “branch”, but no meaning difference is shown without a dictionary, so it is G only (see the log in `owner-questions.md`).
- 74:9: Brenton’s English supplies “God” as the subject of “will not know us”; the Greek clause itself prints no noun. The record says so.
- 74:14 shares a reference with the published leviathan question; the record is a Greek wording comparison of the last clause only.

## Considered and not issued

- **75:6** (“nor from the south” against Greek “from the desert mountains”): the Greek follows the Hebrew words, and showing that “south” differs in meaning would need a dictionary source. Not tagged H; left out to keep the batch small (logged in `owner-questions.md`).
- **78:24–25** (“corn of heaven” / “angels’ food” against “bread of heaven” / “angels’ bread”): the noun differs but both are food; the Greek agrees with the KJV on “angels”. Left out.
- **78:2 with Matthew 13:35**: the Greek psalm and Matthew word the sentence differently from each other, and neither differs in meaning from the KJV psalm. Left out.
- **73:24** (“shalt guide … receive me to glory” against “hast guided … taken me to thyself with glory”): tense only. **73:4, 73:18, 74:5–6, 74:11, 76:4, 80:1, 83:1, 86:7, 88:4–15, 89:9, 89:22, 89:33–34:** read; the Greek is a different rendering but not a different statement, or the difference was too slight to issue.
- **74:8** was issued as G only; the Hebrew word before “of God” has no lexical source here, so no H.
- **84:6** “Baca”: the proper-name ruling needs the Hebrew name to be made of ordinary words; no lexical source for the name was supplied, so it is G only.
- **88:10 and “rephaim”**: no claim is made about the Hebrew word; Greek wording only.
- **82:1, 82:6** with John 10:34: issued as a Q, not a G; the Greek of the psalm agrees with the KJV there.
- **83:6–11 and 87:4** (names): Brenton’s forms (Agarenes, Idumeans, Raab, Madiam) are spelling variants of the KJV names; not issued.
- **No V**: no act is told in this part. **No untagged conflict**: verses of a psalm were not set against other books beyond the checks above.
- Psalm 151 is outside this part.

## Held back, quotes sourced

Brenton’s Greek at 74:5 (“ἔθεντο τὰ σημεῖα αὐτῶν σημεῖα”), 75:2 (English “a set time”), 81:6 (English “slaved in making the baskets”), 88:15 (English “having been exalted, I was brought low”), 89:38 (“ἀνεβάλου τὸν χριστόν σου”).
