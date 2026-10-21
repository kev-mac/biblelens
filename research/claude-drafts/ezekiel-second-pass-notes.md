# Ezekiel second pass (workstream D14), 2026-10-18

First-time reading of the 15 chapters with no published record: 2, 3, 6, 7, 12, 13, 15, 22, 24, 26, 33, 35, 42, 44, 47. Every verse of the 15 chapters was read in the packaged KJV against Brenton's English (ebible.org); Hebrew (WLC via bolls.life) and Brenton's Greek (ebible.org) were fetched by script and read at the flagged verses. Hebrew and Greek in the records are copied from the fetched text; KJV quotations come from `data/chapters.json`. KJV, Hebrew and Brenton verse numbers agree at every verse used, except chapter 33 (Brenton Greek prints no verse 26, so it has 32 verses). Brenton's Greek of chapter 7 is much shorter than the Hebrew and its verses are divided differently from the middle of the chapter; only 7:27, which lines up, is used. All records are drafts until Codex accepts them.

## Issued (13 records, `ezekiel-second-pass-records.json`; all T, witness Septuagint, status Context, none V)

- `at-even-my-wife-died-or-no-wife-named-ezekiel-24-18`: Hebrew says the wife died in the evening; the Greek of the verse does not mention her.
- `conspiracy-of-her-prophets-or-her-princes-ezekiel-22-25`: Hebrew נְבִיאֶיהָ (prophets) against Greek οἱ ἀφηγούμενοι (leaders).
- `twelfth-year-tenth-month-or-tenth-year-twelfth-month-ezekiel-33-21`: year and month numbers swapped in the Greek.
- `ye-eat-with-the-blood-and-stand-upon-your-sword-or-not-printed-ezekiel-33-25-26`: the Brenton page prints no 33:26 and ends 33:25 after the introduction (Septuagint page-omission ruling applies).
- `waters-to-the-ankles-and-knees-or-thighs-ezekiel-47-3-4`: Greek has no ankles, thighs for knees.
- `joseph-shall-have-two-portions-or-an-addition-of-a-measuring-line-ezekiel-47-13`: Joseph is not named in the Greek.
- `from-the-east-country-into-the-desert-or-galilee-and-arabia-ezekiel-47-8`: the Greek prints the names Galilee and Arabia.
- `five-hundred-reeds-or-five-hundred-cubits-ezekiel-42-16-19`: reeds against cubits (42:17) and a different order of the sides (west before south).
- `bear-it-upon-thy-shoulders-or-thou-shalt-be-lifted-up-ezekiel-12-6-7`: active "carry" against passive "taken up on shoulders".
- `the-king-shall-mourn-or-the-prince-only-ezekiel-7-27`: the mourning king is not in the Greek verse (Septuagint page-omission ruling applies).
- `telabib-and-astonished-or-no-name-ezekiel-3-15`: the KJV (packaged text) prints "Telabib"; the Greek has no place name and a different participle.
- `shall-set-glory-in-the-land-of-the-living-or-nor-stand-upon-it-ezekiel-26-20`: promise against negative purpose clause.
- `him-that-passeth-out-and-returneth-or-men-and-cattle-ezekiel-35-7`: participles against "men and cattle".

None of these verses has a published or drafted record (checked `data/evidence.json` and all `research/claude-drafts/*.json` for Ezekiel refs).

## Points for Codex

- 33:25-26 and 7:27 rest on the Septuagint page-omission ruling: the verse numbers the cited Brenton page prints are stated in each record.
- 42:16: the WLC marks a written form אֵמוֹת (cubits) against a read form מֵאֹות (hundreds) before קנים; the KJV follows the read form. Mentioned in the scope, not compared further.
- The 47:3 Greek word ἀφέσεως is not interpreted.

## Considered and ruled out

- 3:14 "in bitterness, in the heat of my spirit" against Greek "in the impulse of my spirit": the KJV margin gives "bitter" for the Hebrew word and the clause is a mood description; not issued.
- 3:12-13 "rushing" against Greek "earthquake": both render the one Hebrew noun רעש; a range-of-sense difference, no demonstrated meaning difference.
- 6:14 "more desolate than the wilderness toward Diblath": the KJV margin already prints "desolate from the wilderness" (the Greek sense); not issued.
- 6:4, 6:6 "images" against Greek "consecrated plats" and 7:20 "majesty" against "pride": wording choices for words the KJV itself varies.
- 13:5 "gaps" and 13:18 "armholes": KJV margins give "breaches" and "elbows".
- 15:4 "both the ends of it" against "that which is yearly pruned": different wording but no demonstrated meaning difference without a lexicon; not issued.
- 22:16 "take thine inheritance in thyself": KJV margin gives "be profaned"; not issued.
- 26:2 "the gates of the people" against "the nations are destroyed": wording; the Hebrew phrase is obscure.
- 42:1-12 (chambers) and 47:15-20 (borders, many place names transliterated differently in the Greek): the Greek of the temple-chamber and border passages differs greatly in words; only the numerals and sides at 42:16-19 and the names at 47:8 are issued. A list of transliterated border names (Hethlon/Emaseldam, Hamath/Maabthera) would need a place-name dictionary and was not issued.
- 44:7 "the fat and the blood" against "flesh and blood", 44:20 "poll" against "cover": wording only.
- 12:18, 24:2, 24:5, and similar "quaking/sorrow" pairs: synonym-level differences.
- Ezekiel 2 and 6:1-3 etc.: Brenton's Greek omits "Thus saith the Lord GOD" clauses at the start of several verses (3, 7:2-4, 12:10, 12:23, 12:28, 15:6): these are layout differences in Brenton's verse division, not evidence of omission.

## Ledger

`chapter-ledger.json`, Ezekiel `secondPass`: 10 chapters `records-draft` (3, 7, 12, 22, 24, 26, 33, 35, 42, 47), 5 `reviewed-none` (2, 6, 13, 15, 44). KJV and Brenton English read in full; Hebrew and Greek read only at flagged verses.

## For the owner

No question. Next D units by ledger: 1 Samuel (8 chapters), Genesis (8), then Luke, Zechariah and the rest.
