# Zechariah second pass (workstream D18), 2026-10-18

First-time reading of the 4 chapters with no published record: 2, 3, 8, 9. All four read in full in the KJV (`data/chapters.json`), the Hebrew (WLC via bolls.life), Brenton's Greek (ebible.org) and Brenton's English; all fetched by script, and the Hebrew and Greek in the records are copied from the fetched text. Brenton and the Hebrew number Zechariah 1:18–21 as 2:1–4, so KJV 2:6 is verse 10 and KJV 2:13 is verse 17 in both; chapters 3, 8 and 9 numbers agree. All records are drafts until Codex accepts them.

## Issued (9 records, `zechariah-second-pass-records.json`; all T Septuagint, status Context, none V)

- `i-have-spread-you-abroad-or-i-will-gather-you-zechariah-2-6-greek` (2:6): Hebrew "I have spread you abroad (as the four winds)", Greek "I will gather you (from the four winds)".
- `raised-up-out-of-his-holy-habitation-or-from-his-holy-clouds-zechariah-2-13-greek` (2:13): Hebrew מִמְּעוֹן קָדְשׁוֹ, Greek "from his holy clouds".
- `let-them-set-a-fair-mitre-and-i-said-or-no-speaker-zechariah-3-5-greek` (3:5): Hebrew "And I said", absent in the Greek.
- `my-servant-the-branch-or-my-servant-the-east-zechariah-3-8-greek` (3:8): Hebrew צֶמַח, Greek Ἀνατολήν; Brenton's margin points to Luke 1:78.
- `men-wondered-at-or-men-who-watch-for-portents-zechariah-3-8-greek` (3:8): Hebrew מוֹפֵת "sign", Greek τερατοσκόποι ("diviners" in Brenton's English). The KJV margin already admits "sign".
- `i-will-engrave-the-graving-or-i-am-digging-a-trench-zechariah-3-9-greek` (3:9): engrave an engraving against dig a pit.
- `the-inhabitants-of-one-city-go-to-another-or-five-cities-gather-into-one-zechariah-8-21-greek` (8:21): "one to another" against "five cities into one city".
- `he-shall-speak-peace-unto-the-heathen-or-multitude-and-peace-from-the-nations-zechariah-9-10-greek` (9:10): Greek clause is syntactically ambiguous; the record sets the clauses side by side and picks no reading.
- `prisoners-of-hope-turn-to-the-strong-hold-or-prisoners-of-the-gathering-zechariah-9-12-greek` (9:12): "prisoners of hope" against "prisoners of the assembly".

Each `sides` quote was checked as an exact substring of the KJV verse in `data/chapters.json`. None of the nine IDs exists in `data/evidence.json` (checked by script); no published record touches Zechariah 2, 3, 8 or 9 verses.

## Considered and ruled out

- 2:8 "inhabited as towns without walls" against Greek "fruitfully inhabited": same promise of full habitation; a lexical shade only.
- 2:11 "joined to the LORD" against Greek "flee for refuge to the Lord": a verb choice with the same direction; not issued.
- 3:1–2 Joshua / Jesus and Satan / diabolos: name and word renderings.
- 8:10 "I set all men every one against his neighbour" against Greek "I will send away all men, each against his neighbour": same sense.
- 8:12 "the seed shall be prosperous": the Greek omits "seed"; a small omission with no changed claim.
- 8:22 "strong nations" against Greek "many nations": a one-word adjective change; not issued to keep the batch small.
- 9:1 Hadrach / Sedrach and "rest thereof" / "his sacrifice": a place name and an obscure Hebrew noun; no plain contrast.
- 9:16 "stones of a crown, lifted up as an ensign" against Greek "holy stones roll upon his land": a real difference, left out to keep the batch small; sourced if wanted.

## Ledger

`chapter-ledger.json`, Zechariah `secondPass`: chapters 2, 3, 8, 9 all `records-draft`. KJV, Hebrew and Greek read in full.

## For the owner

No question. Next D unit: check the ledger for the remaining no-record chapters (Zechariah was the last named in the earlier list); then the queue moves to C (Tier 1 characters).
