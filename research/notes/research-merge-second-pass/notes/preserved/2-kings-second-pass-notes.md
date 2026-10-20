# 2 Kings second pass (workstream D13), 2026-10-18

First-time reading of the 8 chapters with no published record: 4, 5, 6, 7, 10, 11, 19, 21. All 8 read in full in the KJV (`data/chapters.json`). Hebrew (WLC via bolls.life) and Brenton's Greek and English (ebible.org) were fetched by script; the Hebrew and Greek in the records are copied from the fetched text. Verse numbers match in the KJV, Hebrew and Brenton at every verse used. All records are drafts until Codex accepts them.

## Issued (5 records, `2-kings-second-pass-records.json`; all T, status Context, none V)

- `land-of-armenia-or-the-land-of-ararat-2-kings-19-37-isaiah-37-38` (T Hebrew; 2 Kings 19:37 and Isaiah 37:38): KJV "land of Armenia" twice; Hebrew אֶרֶץ אֲרָרָט in both; Brenton Ararath. Scope refuses to say the KJV places them wrongly. Isaiah 37:38 has no published record (checked).
- `ass-head-fourscore-pieces-of-silver-or-fifty-greek` (T Septuagint; 2 Kings 6:25): Hebrew eighty, Brenton fifty.
- `full-ears-of-corn-in-the-husk-or-cakes-of-figs-greek` (T Septuagint; 2 Kings 4:42): Hebrew כרמל בצקלנו; Brenton "cakes of figs". Scope does not decide the Hebrew words.
- `two-chariot-horses-or-two-horsemen-greek` (T Septuagint; 2 Kings 7:14): Hebrew שני רכב סוסים; Greek ἐπιβάτας ("horsemen").
- `manasseh-made-his-son-pass-through-the-fire-or-his-children-2-kings-21-6-2-chronicles-33-6` (T Septuagint on 2 Kings 21:6; 2 Chronicles 33:6 carried in refs and sides): Hebrew singular בנו in Kings, plural בניו in Chronicles; Greek of Kings plural. `appliesTo` is limited to 2 Kings 21:6 per the tagging rule in the Codex contract.

No existing ID in `data/evidence.json` or the earlier drafts covers these verses (checked 2 Kings 4:42, 6:25, 7:14, 19:37, 21:6, Isaiah 37:38 and Manasseh).

## Considered and ruled out

- 2 Kings 11:16: Brenton's English prints "house of the Lord", but the Brenton Greek (οἴκου τοῦ βασιλέως) and the Hebrew both read "the king's house", like the KJV. The English is the outlier, so there is no difference between the Greek and the KJV. Lesson: check the Greek, not only the Brenton English.
- 2 Kings 11:4-8 beside 2 Chronicles 23:4-8: already issued in `2-chronicles-second-pass-records.json`.
- 2 Kings 11:6 "gate of Sur": Brenton Greek translates the name as "gate of the high way"; the Chronicles parallel ("gate of the foundation") is a separate question and was not issued.
- 2 Kings 10:13-14 (forty-two brethren): covered by `ahaziah-forty-two-brethren-slain-or-all-his-elder-brothers-already-dead`.
- 2 Kings 10:26-27 "images"/"image" (מַצֵּבוֹת): rendering of a word the KJV varies; no demonstrated difference in meaning without a lexicon.
- 2 Kings 7:2, 7:19 "windows in heaven": Brenton "flood-gates" renders the same Hebrew noun; no meaning difference.
- 2 Kings 7:13 (five horses) beside 7:14 (two taken): the two are taken from the five; no conflict.
- 2 Kings 19 beside Isaiah 37: the 185,000 (19:35, Isaiah 37:36), Tirhakah, and the three-year sign agree. 19:24 "besieged places" (מָצוֹר): the word can mean siege or be a name for Egypt; Brenton has "fortified places". Left unissued because the KJV margin and lexicon senses overlap and no plain difference can be stated without a dictionary citation.
- 2 Kings 19:31 Kethib/Qere on "of hosts": a written/read form, not a meaning difference.
- 2 Kings 21:1, 21:19 (Manasseh 12 and 55; Amon 22 and 2): same figures as 2 Chronicles 33; Hezekiah's 15 added years make Manasseh's age at accession fit (born after the illness), no conflict.
- 2 Kings 21:6 as a V (law broken, Deuteronomy 18:10): the chapter reports the breach and the judgment (21:10-15), and 2 Chronicles 33 reports Manasseh's later repentance; not issued as V.
- 2 Kings 5:5 (ten talents, six thousand gold) and 5:18 (pardon): the Hebrew and Brenton agree in sense.
- 2 Kings 6:23 ("bands of Syria came no more") beside 6:24 (Ben-hadad besieges Samaria): bands (raiding parties) against a full host; no direct conflict stated.
- 2 Kings 4:39 "wild gourds" and 4:38 to 4:44: Brenton agrees with the KJV.

## Ledger

`chapter-ledger.json`, 2 Kings `secondPass`: 5 chapters `records-draft` (4, 6, 7, 19, 21); 3 `reviewed-none` (5, 10, 11; 11 and 10 are already covered by issued records). KJV level read in full; Hebrew and Greek read only at flagged verses.

## For the owner

No question. Next D units by ledger: Ezekiel (15 chapters), 1 Samuel (8), Genesis (8), then Luke, Zechariah and the rest.
