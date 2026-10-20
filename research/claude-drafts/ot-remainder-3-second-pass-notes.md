# Old Testament remainder, part 3: Daniel, Hosea, Jonah, Micah, Zephaniah (workstream D27), 2026-10-19

Scope: the 6 no-record chapters Daniel 2, Daniel 9, Hosea 7, Jonah 2, Micah 7, Zephaniah 2. KJV and Brenton Greek from ebible.org (Daniel's Greek page is `DAG`, headed "translation of the Seventy, Daniel"), Hebrew and Aramaic (WLC) from bolls.life (books 27, 28, 32, 33, 36). All fetched by script and read in full; Hebrew and Greek in the records are copied by script, and every `sides` quote was checked as a substring of the fetched KJV verse. All records are drafts until Codex accepts them.

## Issued (23 records, `ot-remainder-3-second-pass-records.json`; all T, witness Septuagint, status Context)
- Hosea 7:10 "testifieth" against "shall be humbled"; 7:12 "as their congregation hath heard" against "in the hearing of their affliction"; 7:14 "assemble themselves" against "cut themselves"; 7:16 "not to the most High" against "turned to nothing".
- Jonah 2:4, 2:5, 2:6 (KJV numbering): "yet I will look again" against a question; "weeds wrapped about my head" against "head sank into clefts of mountains"; "hast brought up my life" against "let the corruption of my life come up".
- Micah 7:3 "asketh for a reward" against "peaceable words"; 7:11 "walls to be built" against "daubing brick"; 7:12 "come from Assyria" against "cities to levelling"; 7:18 "for ever" against "for a testimony".
- Zephaniah 2:1 "not desired" against "uninstructed"; 2:5-6 "Cherethites / cottages" against "Crete"; 2:9 "nettles and saltpits" against Damascus added; 2:14 "cormorant and bittern, uncover the cedar work" against "chameleons and hedgehogs, height is cedar".
- Daniel 2:11 "rare" against "heavy"; 2:20 "might" against "understanding".
- Daniel 9:4 "dreadful" against "wonderful"; 9:16 "righteousness" against "mercy"; 9:24 "make an end of sins" against "seal sins" (ketiv/qere); 9:25 "troublous times" against "times emptied out"; 9:26 "Messiah be cut off, but not for himself" against "an anointing destroyed"; 9:27 "sacrifice and oblation to cease / overspreading of abominations" against "my sacrifice and libation taken away / upon the temple".

## For Codex
- Check each KJV quote against ebible.org (DAN02, DAN09, HOS07, JON02, MIC07, ZEP02). Refs use 0-based book indices 26, 27, 31, 32, 35. No ID collides with data/evidence.json, and no existing record touches these chapters (checked).
- Jonah: the KJV numbers 2:1 as 1:17, so the Hebrew/Greek verse is one higher than the KJV verse. The records use KJV numbering and say so in `scope`.
- Daniel 2 is Aramaic (2:4b onward); `languageContext` names Hebrew and Aramaic. The Greek page for Daniel does not say whether it is the Old Greek or Theodotion form; the scope says this was not established. Codex may want to check before the Daniel 9 records go live, because the Greek of 9:24-27 differs sharply between the Old Greek and Theodotion in other editions, and the tag T/Septuagint depends on which text this is.
- Daniel 9:24 depends on the ketiv/qere shown in the WLC text; the record does not say which reading is original.
- Daniel 9:25-27 are the verses most used in prophecy debates. The records give only the word-level difference between KJV, Hebrew and this Greek; they take no position on dating or fulfilment.

## Considered, not issued
- Hosea 7:5 "our king" against "your kings" (person and number differ; small), 7:3, 7:11 "silly dove" against "senseless dove", 7:15 "bound and strengthened" against "were chastened": wording or too small to qualify.
- Micah 7:1 "summer fruits" against "straw in harvest" (borderline), 7:4 "brier" against "moth", 7:19 "subdue" against "sink", 7:15 "unto him" against "ye shall see": held back as wording or uncertain Hebrew; 7:10 the Greek page prints "ροῦ" for "Ποῦ" (an obvious typing fault in that page, not a reading).
- Zephaniah 2:3 "it may be" against "that ye may be sheltered", 2:4, 2:7-8, 2:10-13 (2:13 "north" against "Borras" is the same word), 2:15 "rejoicing city" against "scornful city": close or the Hebrew word is uncertain.
- Daniel 2:5 "cut in pieces / dunghill" against "destruction / plundered" and 2:9 "one decree" absent from the Greek: real differences but the Aramaic terms are rare; held back in favour of fewer records. Daniel 2:15 "hasty" against "shameless", 2:34 Greek adds "from a mountain", 2:46 "oblation": held back. Daniel 2:27 "soothsayers" against a transliteration: no difference. Daniel 9:2, 9:7-14, 9:21: same sense.
- Jonah 2:2-3 "hell" against "Hades": same place-word. Jonah 2:8-10: wording only.
