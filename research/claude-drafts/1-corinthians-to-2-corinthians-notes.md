# 1 Corinthians to 2 Corinthians: notes (2026-10-14)

File: `1-corinthians-to-2-corinthians-records.json`: 44 records. 40 T, all witness “Greek New Testament”; 4 untagged conflicts; no V. All carry `sides`. All are drafts until Codex accepts them. The Q file and its notes are `1-corinthians-to-2-corinthians-q-records.json` and `-q-notes.md`.

## Method

Greek from bolls.life: TR (as served, no accents) and TISCH (Tischendorf, eighth edition). Every Tischendorf quotation is asserted against the served page, with an assertion on whether the TR text carries the same words; every KJV quotation is asserted against the packaged `data/chapters.json`; sides validated with `scripts/verse-roles.mjs`; all 76 source addresses answered. A script listed every verse of the two letters whose TR and Tischendorf word lists differ (1 Corinthians 1–16, 2 Corinthians 1–13); about 340 verses came up and the ones below were chosen for a difference in meaning.

## T records (edition differences: the KJV and the TR text agree, Tischendorf’s text differs)

1 Corinthians: 1:14 (“God” absent), 1:15 (“I baptized” / “you were baptized”), 2:4 (“man’s” absent), 2:13 (“Holy” absent), 3:3 (“divisions” absent), 3:4 (“carnal” / “men”), 3:5 (who / what, order), 5:1 (“named” absent), 5:4 (“our … Christ” absent), 5:7 (“for us” absent), 6:20 (“and in your spirit, which are God’s” absent), 7:3 (“due benevolence” / “the debt”), 7:5 (“fasting” absent), 7:14 (“husband” / “brother”), 7:39 (“by the law” absent), 8:7 (“conscience” / “custom”), 9:20 (adds “not being myself under the law”), 10:9 (“Christ” / “the Lord”), 10:28 (two records: εἰδωλόθυτον / ἱερόθυτον; and the closing “for the earth is the Lord’s” absent), 11:24 (“Take, eat” and “broken” absent), 11:29 (“unworthily” and “the Lord’s” absent), 12:31 (“best” / “greater”), 14:34 (“your” absent), 14:38 (imperative / indicative form), 15:44 (“If there is a natural body”), 15:47 (“the Lord” absent), 15:55 (“O grave” / “O death”, order), 16:22 (“Jesus Christ” absent).

2 Corinthians: 1:10 (“doth deliver” / “will deliver”), 1:12 (“simplicity” / “holiness”), 4:6 (“Jesus” absent), 4:10 (“the Lord” absent), 5:17 (“all” absent), 6:16 (“ye” / “we”), 8:4 (ends without “that we would receive”), 11:31 (“our … Christ” absent), 12:1 (“It is not expedient” / “It is necessary to boast”), 12:19 (“Again” / “long ago”), 13:7 (“I pray” / “we pray”).

Quirks: in 6:20, 8:4 and 10:28 the Tischendorf words quoted are a prefix of the TR text, so the quote is asserted as inside the TR text (`same`) and as ending the verse. 1 Corinthians 15:55 shares its verse with the published Hosea 13:14 record (`o-death-i-will-be-thy-plagues-…`); that record compares Hosea with Brenton’s Greek, this one compares the two Greek New Testament editions, and the scope says so.

## Untagged records

- `among-the-which-was-dionysius-the-areopagite-or-the-firstfruits-of-achaia-acts-17-34-1-corinthians-16-15`: believers at Athens (in Achaia) before the “firstfruits of Achaia” at Corinth. Not drafted in the Acts batch, so it is issued here.
- `the-jews-took-counsel-to-kill-saul-or-the-governor-under-aretas-kept-the-city-acts-9-23-2-corinthians-11-32`: who sought Paul at Damascus; both accounts end with the basket and the wall (context refs 9:24, 9:25, 11:33).
- `every-woman-that-prayeth-or-prophesieth-or-let-your-women-keep-silence-in-the-churches-1-corinthians-11-5-1-corinthians-14-34`: same letter. The published `coverage-nt-women-speaking` cites 11:4–6 with 1 Timothy 2 and not 14:34.
- `the-eleven-disciples-or-then-of-the-twelve-matthew-28-16-1-corinthians-15-5`: eleven in the Gospels, “the twelve” in Paul’s list. Luke 24:33 is a context ref; the Luke batch’s own Luke 24:33 records concern Thomas and Mark 16:13.

Wording-only on each; every reasoning says the two can stand together and the extra says the record does not claim a contradiction.

## Considered and left out (quotes read; do not re-issue)

- Name forms and spellings: Priscilla / Priscila (1 Cor 16:19), Belial / Beliar (2 Cor 6:15), Moses (Μωσῆς / Μωϋσῆς), the form of Isr(a)elite, εἰλικρινία, ἀρραβών.
- Small differences of tense, number, order or particle: 1:22 (sign / signs), 1:29, 4:6, 4:13, 7:15 (us / you), 7:38, 8:2, 8:11, 8:24 (2 Cor), 9:15, 10:11, 15:5–7 (εἶτα / ἔπειτα), 15:51, 15:34, 2 Cor 4:4 (“unto them” absent), 11:32 (“desirous” absent), 13:4.
- Different verse numbering only, no difference of meaning: 2 Corinthians 5:14–15 (the “if one died for all” clause sits in 5:14 in the TR page and 5:15 in Tischendorf’s), 11:8–9 and 13:12–14 (Tischendorf’s page runs 13:12 on into the salutation and has no 13:14; its 13:13 is the KJV’s 13:14, and the KJV’s 13:13 “All the saints salute you” is at the end of Tischendorf’s 13:12). Quote the verse by the KJV number if Codex re-checks the 2 Corinthians 13 verses.
- 1 Corinthians 6:14: the KJV’s “raise up us” agrees with Tischendorf’s ἡμᾶς; the TR text served prints ὑμᾶς. Not issued: the KJV follows Tischendorf there, not the TR.
- Cross-book conflicts not issued as already covered or reconcilable at a glance: 1 Corinthians 10:8 against Numbers 25:9 (`numbers-peor-death-count`, published, cites 1 Cor 10:8); 1 Corinthians 9:9 with Deuteronomy 25:4 (`deuteronomy-ox-rule-reuse`); 2 Corinthians 11:24–25 with Deuteronomy 25:3 (`deuteronomy-lash-limit-and-paul`); 1 Corinthians 15:54 and 15:55 with Isaiah 25:8 and Hosea 13:14 (published and drafted); 1 Corinthians 7:10–15 with Matthew 19:9 (`coverage-nt-divorce`); 1 Corinthians 15:20 with Matthew 27:52–53 (the saints rose “after his resurrection”, so no conflict; the Matthew Q covers the saints); 1 Corinthians 15:22 with Ezekiel 18:20 (the verse does not say the death is for Adam’s sin; the Romans batch has its own Romans 5 record); 1 Corinthians 1:17 with Matthew 28:19 (Paul speaks of what he was sent to do); 1 Corinthians 11:14 with Numbers 6:5 (a vow).
- V: none. Paul rebukes the Corinthians for the man with his father’s wife (1 Cor 5:1) and for suits and drunkenness at the table, but the church is of Gentiles and Jews together and nobody there is “under the Law” in the sense the V test requires.

## Not examined

The Old Testament quotations of the two letters other than 15:54–55 (published and drafted): 1 Cor 1:19, 1:31, 2:9, 2:16, 3:19, 3:20, 9:9 (published), 10:7, 14:21, 15:25, 15:27, 15:32, 15:45; 2 Cor 4:13, 6:2, 6:16–18, 8:15, 9:9, 9:10, 10:17, 13:1. The ordering of 1 Corinthians’s travel plans against Acts 18–20 was not examined.

## For Codex

- 1 Corinthians 15:55 and 7:14 and 11:5 overlap published records on the same verses; the scopes say how they differ.
- No new owner ruling was needed; nothing is logged in `owner-questions.md`.
