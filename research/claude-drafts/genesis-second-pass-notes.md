# Genesis second pass (workstream D16), 2026-10-18

First-time reading of the 8 chapters with no published record: 13, 27, 29, 34, 38, 40, 42, 43. All 8 read in full in the KJV (`data/chapters.json`) beside Brenton's English; Hebrew (WLC via bolls.life) and Brenton's Greek (ebible.org) fetched by script, verse counts matched in all three at every chapter. Every KJV excerpt and Greek excerpt in the records was checked by script as an exact substring of the fetched verse; Hebrew was copied from the fetched verse. All records are drafts until Codex accepts them.

## Issued (12 records, `genesis-second-pass-records.json`; all T, status Context, none V)

- `abram-went-up-into-the-south-or-into-the-wilderness-genesis-13-1-13-3` (Septuagint): Negev / ἔρημος.
- `lot-dwelt-in-the-cities-of-the-plain-toward-sodom-or-a-city-in-sodom-genesis-13-12` (Septuagint): cities / one city; toward / in Sodom. 14:12 noted so the scope does not claim a conflict.
- `abram-seed-as-the-dust-of-the-earth-or-the-sand-of-the-earth-genesis-13-16` (Septuagint): dust / sand.
- `plain-of-mamre-or-oaks-of-mamre-genesis-13-18` (Hebrew and Septuagint): "plain" against a tree word; same Hebrew at 14:13 and 18:1, not examined in Greek. Codex: check whether a later Mamre batch already covers 14:13 or 18:1.
- `thy-mothers-sons-bow-down-or-sons-of-thy-father-genesis-27-29` (Septuagint): mother's / father's sons; "peoples" / "rulers".
- `simeon-and-levi-came-upon-the-city-boldly-or-securely-genesis-34-25` (Hebrew and Septuagint): "boldly" against בֶּטַח / ἀσφαλῶς. Scope concedes the word can be read of either party.
- `judah-and-hirah-his-friend-or-his-shepherd-genesis-38-12-38-20` (Septuagint): רֵעֵהוּ / ποιμήν.
- `tamar-sat-in-an-open-place-or-at-the-gates-of-aenan-genesis-38-14-38-21` (Septuagint): Greek prints a place name; scope admits "open place" is a recognised reading.
- `captain-of-the-guard-charged-joseph-or-the-chief-of-the-prison-genesis-40-3-40-4` (Septuagint): Greek omits "house of the captain of the guard" at 40:3 and has ἀρχιδεσμώτης at 40:4. 39:21-23 are context refs only.
- `nakedness-of-the-land-or-the-tracks-of-the-land-genesis-42-9-42-12` (Septuagint): עֶרְוָה / ἴχνη.
- `we-are-true-men-or-we-are-peaceable-genesis-42-11` (Septuagint): כֵּנִים / εἰρηνικοί at 42:11, 19, 31, 33, 34; two verses quoted.
- `joseph-asks-after-jacob-greek-adds-blessed-be-that-man-genesis-43-28` (Septuagint): Greek plus, Joseph's reply.

No ID in `data/evidence.json` covers these verses (checked by script; the only hits in these chapters are Hebrews 12:17 at Genesis 27:34/38 and Ruth 4:5 at Genesis 38:8). The draft `genesis-13-herds-and-land-capacity` (science) is unrelated.

## Considered and ruled out

- 13:11 "journeyed east" against Greek "went from the east": Hebrew מִקֶּדֶם can carry both senses.
- 13:14 "westward" against "seaward": same meaning.
- 13:17 Greek "and to thy seed for ever": KJV states it at 13:15 (additions ruling).
- 27:38 Greek "Isaac being troubled": KJV 27:33 already says Isaac trembled (additions ruling).
- 27:39 "of the fatness" (Hebrew min can be "away from"): interpretive, Greek agrees with KJV.
- 29:1 Greek adds Laban's parentage; 29:12 "her father's brother" (Hebrew and Greek both ἀδελφός): a kinship-word question, not a translation difference.
- 29:17 "tender eyed" against "weak": lexical.
- 29:32 Greek "and has given me a son": KJV has the birth in the same verse.
- 34:2 "defiled" against ἐταπείνωσεν "humbled": different Hebrew verbs, but KJV's sense is the usual one; no stated meaning gap. 34:24 "went out of the gate" against "went in at the gate": both name citizens; 34:27 "slain" against "wounded": Brenton's own note says "slain" is frequently the sense.
- 38:5 who "was at Chezib": the subject is ambiguous in the Hebrew.
- 38:11 Brenton's English says "father-in-law's house", but the Greek prints τοῦ πατρός σου, matching the Hebrew: an English-translation point, no record.
- 38:14 Greek "ornamented her face" against "wrapped herself": possible, but not issued to keep the batch small.
- 38:21-22 KJV "harlot" for Hebrew קְדֵשָׁה (38:15 has זוֹנָה): a lexical question needing a dictionary citation.
- 40:2 "officers" / "eunuchs", 40:13 and 40:19 "lift up thy head" against "remember thy office" / "take away thy head": an idiom rendered by sense; 40:16 "white baskets": uncertain Hebrew word.
- 42:4 "mischief" / "disease", 42:15 "life of Pharaoh" / "health", 42:38 "grave" / Hades (Sheol): general vocabulary questions, not a plain contrast at these verses.
- 43:11 present list (balm, spices, myrrh, nuts, almonds against gum, frankincense, stacte, turpentine, walnuts): the identity of several Hebrew product words is uncertain; no firm comparison.
- 43:14 "God Almighty" / "my God", 43:23 "Peace be to you" / "God be merciful": title and greeting wording.

## Ledger

`chapter-ledger.json`, Genesis `secondPass`: 7 chapters `records-draft` (13, 27, 34, 38, 40, 42, 43) and 1 `reviewed-none` (29). KJV level read in full; Hebrew and Greek read only at flagged verses.

## For the owner

No question. Next D unit: Luke, then Zechariah.
