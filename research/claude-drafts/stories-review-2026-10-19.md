# Stories review (2026-10-19)

Scope: all 316 story entries: 43 published in data/stories.json (25 Genesis, 18 Exodus) and 273 drafts in `{book}-stories.json` (the 19 Exodus drafts overlap the published Exodus set).
Method: every passage range parsed against the KJV text in data/chapters.json and checked for overlaps (none found); capitalized names in each summary matched against the passage text; every summary read against my knowledge of the passage. Verses were not read in full for each entry, so this is a screen, not a line-by-line check.

## Verdict
- Passage ranges are valid and none overlap.
- Summaries are accurate in the spot checks. Name mismatches flagged by the script are KJV spelling or terms from outside the passage (Ishmael, Perez and Zerah in Genesis 21 and 38; Nile; Levite; Bezalel and Oholiab as Bezaleel and Aholiab), not errors.
- The real defects are five (below), all in drafts. The published Genesis and Exodus entries need no correction.
- Length: summaries run 12–44 words (median 27), roughly 80–300 characters. All are well under the 500-character limit, so depth is the gap, not length.

## Defects in drafts (proposed replacements, each under 500 characters)

1. **jeremiah-stories.json, "Jeremiah and Pashhur; the Temple Sermon" (Jeremiah 20:1-18).** Title promises a temple sermon the passage does not contain (that is chapters 7 and 26).
   - Title: "Jeremiah and Pashhur"
   - Summary: "The priest Pashhur, chief officer of the temple, has Jeremiah beaten and put in the stocks overnight. Released, Jeremiah renames him Magor-missabib and says Pashhur and his household will be taken to Babylon. Jeremiah then voices his anguish at the cost of speaking for the LORD, even cursing the day of his birth."

2. **2-kings-stories.json, "Elisha's Death and the Last Kings of Israel" (2 Kings 13:1-14:29).** The title is wrong (Jeroboam II is not the last king) and the summary has a broken sentence ("and a dead man revived by his bones").
   - Title: "Elisha's Death and the Wars of Jehoash"
   - Summary: "The dying Elisha has King Jehoash strike the ground with arrows to signify victories over Aram. Elisha dies, and a dead man thrown into his tomb revives on touching his bones. Later Jehoash of Israel defeats Amaziah of Judah and takes treasure from the temple, and Jeroboam II restores Israel's borders."

3. **daniel-stories.json, "Daniel's Visions" (Daniel 7:1-12:13).** The phrase "the prayer-answer about seventy weeks" is unclear and the entry never says the material is symbolic.
   - Summary: "Daniel dreams of four beasts and a heavenly court where one like a son of man receives dominion, then sees a ram and a goat. He prays for his people and is told of seventy weeks, and a final vision of kings and a time of trouble ends with many awakening and Daniel told he will rest. Interpreters read these visions in different ways."

4. **matthew-stories.json, "Healings and Calming the Storm" (Matthew 8:1-9:38).** The last sentence runs together three events ("He calls Matthew and raises a girl and heals a woman").
   - Summary: "Jesus heals a leper, a centurion's servant, Peter's mother-in-law and a paralytic. He calms a storm and sends demons into a herd of pigs, and calls Matthew the tax collector. On the way to a ruler's house he heals a woman who touched his cloak, then raises the ruler's daughter. He tells his disciples to pray for laborers for the harvest."

5. **2-samuel-stories.json, "David and Mephibosheth" (2 Samuel 8:1-10:19).** Title covers only one of three chapters; most of the text is David's wars.
   - Title: "David's Wars and Kindness to Mephibosheth"

## Coverage gaps (narrative passages with no entry)
- Genesis 15 (covenant with Abram), 20, 23 (Abraham and Abimelech; Sarah's death).
- Exodus 21-23 (laws) is intentionally outside Stories scope.
- 1 Kings 20 (Ahab and Ben-hadad); 1 Samuel 27.
- Luke has no passion narrative (Luke 22-23), although Matthew, Mark and John do. Also missing: Luke 8-9, 11-14, 17-18.
- Matthew 15, Mark 7-8 and 12-13, John 14-17 (covered inside a long discourse entry).

## Entries that are not stories
These are lists or instruction summarized as one entry. Codex may drop or keep them under the narrative-only rule:
1 Chronicles 1-9 and 23-27; Joshua 13-21; Leviticus 1-7, 11-15, 17-22, 25-27; Numbers 1-4, 7-9, 33-35; Deuteronomy 4-11, 12-26, 27-28, 29-30. Several Chronicles and Kings entries are chains of king summaries rather than single stories.

## Deepened summaries (done 2026-10-20)
All 297 stories now have a 300-500 character summary in `{book}-stories-deepened.json` (30 files; lengths 335-500, median 454). The five defects above are fixed in them (jeremiah, 2-kings, daniel, matthew, 2-samuel).
- Source per book: Genesis and Exodus use the published entries in data/stories.json (25 + 18); every other book uses its draft file. The held Exodus "Instructions for the Tabernacle" entry is not included.
- Passage, cross_references and topics are copied unchanged from the source entry (topics stay empty for drafts).
- Checks run: every passage in the base file has exactly one new summary; length 300-500; capitalized names matched against the KJV passage text (remaining flags are KJV spellings or outside-passage terms). Details were written from knowledge of the text, not re-read verse by verse, so Codex should verify quotes and numbers before publishing.
- Genesis and Exodus replace published entries, so they go through Codex.
