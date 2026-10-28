# C5: Ezra through Daniel profiles

Counts: 0 accept / 14 accept with fixes / 0 return to research.

Reviewed input: `research/claude-drafts/ezra-daniel-characters-records.json` and `ezra-daniel-characters-notes.md` at `f64e37cad5249adb660ab5377acbad2f52e04270`.

Packaged text and catalogs: `55e438a1071ac8629d5197cbf6c6db9d8346873e`. No draft was changed or merged.

Apply the shared review rules in [README](README.md). An acceptance with fixes is conditional on every listed fix.

All key-verse references were checked against the packaged KJV. Story routes were checked against the current catalog.
The character schema was run on each draft. Family names were also checked against the combined profile set.
A name binding below selects a reference row; it does not approve every family edge inherited from that row.

## 1. Cyrus

ID: `cyrus`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 2/2 story links match. Raw character schema passes.

Passages: Ezra 1:1; Ezra 1:2; Ezra 1:3; Ezra 1:7; Ezra 1:8; Ezra 6:14; 2 Chronicles 36:22; Isaiah 45:1; Daniel 6:28; Daniel 10:1.

### Findings and required changes

Say Cyrus permits the return in Ezra; do not imply every Judean returned. Treat Persia as his royal setting, not a proven birthplace. Keep prophetic descriptions attributed to the texts.

Reference identity: one exact-name row, `cyrus_968`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 1 (22 words; starts `King of Persia whose proclamation in his first year sends the Jews back to build the house of the Lo`); 2 (49 words; starts `He says the God of heaven gave him all the kingdoms of the earth, calls on any of God's people to go`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 2. Zerubbabel

ID: `zerubbabel`

**Verdict: accept with fixes.**

Checks: all 9 key-verse references exist; 3/3 story links match. Raw character schema passes.

Passages: Ezra 2:2; Ezra 3:2; Ezra 3:8; Ezra 5:2; 1 Chronicles 3:19; Haggai 1:1; Haggai 2:23; Zechariah 4:9; Matthew 1:12.

### Findings and required changes

Preserve the Shealtiel/Pedaiah tension explicitly. Do not render Shealtiel as an unqualified sole biological-parent edge while the scope admits the other genealogy. Do not merge Zerubbabel with Sheshbazzar.

Reference identity: one exact-name row, `zerubbabel_3054`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 1 (27 words; starts `Leader of the first return from Babylon, called son of Shealtiel in Ezra and Haggai and listed among`); 4 (24 words; starts `Haggai addresses him as governor of Judah and the Lord promises to make him a signet; Zechariah says`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 3. Ezra

ID: `ezra`

**Verdict: accept with fixes.**

Checks: all 11 key-verse references exist; 3/3 story links match. Raw character schema passes.

Passages: Ezra 7:1; Ezra 7:5; Ezra 7:6; Ezra 7:8; Ezra 7:10; Ezra 7:11; Ezra 10:1; Ezra 10:5; Nehemiah 8:1; Nehemiah 8:2; Nehemiah 12:26.

### Findings and required changes

Keep Ezra's roles and travel tied to Ezra 7–10. Add Ezra 7:9 and 10:3 as anchors if the travel dates and covenant details remain. Explain scribe and the covenant in plain words. Replace the inexact direct quote ready in the law of Moses with an unquoted paraphrase, or quote a ready scribe in the law of Moses exactly from Ezra 7:6.

- Add an explicit reference binding for `ezra` to `sourceRecord: ezra_1245`. Name-only matching currently finds 3 rows. Check the cited identity and suppress unsupported inherited family edges.

- KJV quotation `ready in the law of Moses` is not an exact packaged quote. Apply the quote repair above.

### Writing fixes

- `summary`: split screened sentence(s) 2 (35 words; starts `In the seventh year of Artaxerxes he goes up from Babylon to Jerusalem, leaving on the first day of `); 4 (22 words; starts `Told that the people and priests have taken foreign wives, he prays and weeps, and the assembly cove`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 4. Nehemiah

ID: `nehemiah`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 4/5 story links match. Raw character schema fails as detailed below.

Passages: Nehemiah 1:1; Nehemiah 1:2; Nehemiah 1:4; Nehemiah 1:11; Nehemiah 2:1; Nehemiah 2:5; Nehemiah 4:17; Nehemiah 5:14; Nehemiah 12:26; Nehemiah 13:6.

### Findings and required changes

Correct The Wall Completed link to Nehemiah 6:1 - 7:5. Keep the distinct temple and wall episodes. Do not infer that all records named Nehemiah refer to this governor.

Observed validator error: `Character nehemiah: broken story nehemiah-the-wall-completed`.

- Replace story `nehemiah-the-wall-completed` with title `The Wall Completed`, passage `Nehemiah 6:1 - 7:5`, ID `nehemiah-the-wall-completed`, route `#stories/nehemiah/the-wall-completed`.

- Add an explicit reference binding for `nehemiah` to `sourceRecord: nehemiah_2172`. Name-only matching currently finds 3 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 1 (27 words; starts `Son of Hachaliah, serving at Shushan when his brother Hanani and others report that the remnant is i`); 2 (24 words; starts `He weeps, fasts and prays, and in the twentieth year of Artaxerxes, as cupbearer, asks the king to s`); 3 (41 words; starts `Given letters and timber, he goes, rebuilds the wall in the face of opposition with builders who wor`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 5. Sanballat

ID: `sanballat`

**Verdict: accept with fixes.**

Checks: all 8 key-verse references exist; 2/3 story links match. Raw character schema fails as detailed below.

Passages: Nehemiah 2:10; Nehemiah 2:19; Nehemiah 4:1; Nehemiah 4:2; Nehemiah 6:1; Nehemiah 6:2; Nehemiah 6:4; Nehemiah 13:28.

### Findings and required changes

Correct The Wall Completed link to Nehemiah 6:1 - 7:5. Keep the source's Horonite label without deriving a modern nationality or undocumented motive.

Observed validator error: `Character sanballat: broken story nehemiah-the-wall-completed`.

- Replace story `nehemiah-the-wall-completed` with title `The Wall Completed`, passage `Nehemiah 6:1 - 7:5`, ID `nehemiah-the-wall-completed`, route `#stories/nehemiah/the-wall-completed`.

Reference identity: one exact-name row, `sanballat_2470`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 1 (21 words; starts `Sanballat the Horonite, first named when he hears that someone has come to seek the welfare of the c`); 2 (40 words; starts `With Tobiah the Ammonite and Geshem the Arabian he mocks the builders, speaks before the army of Sam`); 4 (21 words; starts `Later a son of Joiada the high priest's family is his son-in-law, and Nehemiah chases the man from h`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 6. Vashti

ID: `vashti`

**Verdict: accept with fixes.**

Checks: all 7 key-verse references exist; 2/2 story links match. Raw character schema passes.

Passages: Esther 1:9; Esther 1:11; Esther 1:12; Esther 1:19; Esther 2:1; Esther 2:4; Esther 2:17.

### Findings and required changes

Keep Vashti's refusal and removal tied to Esther 1. Do not invent her reason for refusing or present later explanations as facts in this profile.

Reference identity: one exact-name row, `vashti_2937`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 2 (23 words; starts `On the seventh day, merry with wine, the king commands seven chamberlains to bring her with the crow`); 3 (31 words; starts `She refuses to come, the king is very wroth, and the counsel of Memucan is that she never again come`); 4 (31 words; starts `The decree goes to every province, and later the king's remembrance of what Vashti had done and what`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 7. Ahasuerus

ID: `ahasuerus`

**Verdict: accept with fixes.**

Checks: all 9 key-verse references exist; 5/5 story links match. Raw character schema passes.

Passages: Esther 1:1; Esther 1:2; Esther 1:3; Esther 2:16; Esther 2:17; Esther 3:1; Esther 7:10; Esther 8:2; Esther 10:3.

### Findings and required changes

Replace the 180-day-feast claim with: He displays his riches for 180 days, then gives a seven-day feast. Anchor it in Esther 1:4–5. Do not settle the king's external historical identity in this scripture-only profile.

Reference identity: one exact-name row, `ahasuerus_117`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 2 (22 words; starts `In his third year he holds a feast of a hundred and eighty days, then seven days for the people in S`); 3 (32 words; starts `He deposes Vashti, takes Esther into his house in his seventh year and makes her queen, promotes Ham`); 4 (23 words; starts `When Esther reveals the plot he has Haman hanged, gives the ring to Mordecai, and lays a tribute on `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 8. Esther

ID: `esther`

**Verdict: accept with fixes.**

Checks: all 8 key-verse references exist; 4/4 story links match. Raw character schema passes.

Passages: Esther 2:7; Esther 2:15; Esther 2:17; Esther 4:14; Esther 4:16; Esther 5:2; Esther 7:3; Esther 8:3.

### Findings and required changes

Keep Hadassah/Esther and the kinship to Mordecai tied to Esther 2. Attribute the story's claims to the book. Do not add a modern historical identification or motive.

Reference identity: one exact-name row, `esther_1343`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 2 (28 words; starts `Taken to the king's house in the tenth month of his seventh year, she obtains favour and is crowned `); 3 (30 words; starts `When Haman's decree is sent she is told that deliverance may come from another place and that she ma`); 4 (26 words; starts `She asks the Jews to fast three days, goes unbidden to the king, holds two banquets, names Haman, an`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 9. Mordecai

ID: `mordecai`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 4/4 story links match. Raw character schema passes.

Passages: Esther 2:5; Esther 2:7; Esther 2:21; Esther 2:22; Esther 3:2; Esther 4:14; Esther 6:11; Esther 8:2; Esther 9:20; Esther 10:3.

### Findings and required changes

Replace the claim that he receives Haman's house with: Esther puts him in charge of Haman's house. Esther 8:1–2 gives the house to Esther. Keep this Mordecai distinct from the returnee in Ezra 2:2.

- Add an explicit reference binding for `mordecai` to `sourceRecord: mordecai_2107`. Name-only matching currently finds 2 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 1 (21 words; starts `A Benjamite in Shushan, son of Jair, son of Shimei, son of Kish, who has brought up his uncle's daug`); 2 (21 words; starts `He tells her not to reveal her people, uncovers the plot of Bigthan and Teresh, and refuses to bow t`); 4 (38 words; starts `Honoured by the king in the street at Haman's own proposal, he later receives the king's ring and Ha`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 10. Haman

ID: `haman`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 3/3 story links match. Raw character schema passes.

Passages: Esther 3:1; Esther 3:2; Esther 3:7; Esther 5:10; Esther 5:14; Esther 7:6; Esther 7:9; Esther 7:10; Esther 9:10; Esther 9:24.

### Findings and required changes

Keep Haman's stated actions and speeches in Esther. Do not add an ethnic genealogy or a motive beyond what the book says.

Reference identity: one exact-name row, `haman_1360`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 2 (29 words; starts `When Mordecai will not bow, Haman seeks to destroy all of Mordecai's people, casts Pur, the lot, for`); 3 (39 words; starts `Though Esther's banquets honour him, he is angry at the sight of Mordecai, builds a gallows fifty cu`); 4 (26 words; starts `Esther names him as the enemy, and he is hanged on the gallows he prepared; his house goes to Esther`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 11. Daniel

ID: `daniel`

**Verdict: accept with fixes.**

Checks: all 11 key-verse references exist; 6/6 story links match. Raw character schema passes.

Passages: Daniel 1:6; Daniel 1:7; Daniel 2:48; Daniel 5:30; Daniel 6:2; Daniel 6:28; Daniel 7:1; Daniel 9:1; Daniel 10:1; Ezekiel 14:14; Matthew 24:15.

### Findings and required changes

Preserve the distinction between the Daniel narrative and Ezekiel's mention of a Daniel. Do not use a shared name to settle that identity or add an authorship claim.

- Add an explicit reference binding for `daniel` to `sourceRecord: daniel_975`. Name-only matching currently finds 3 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 1 (23 words; starts `One of the children of Judah taken to Babylon, renamed Belteshazzar, who resolves not to defile hims`); 3 (34 words; starts `He makes known and interprets Nebuchadnezzar's dream, is set ruler over the province of Babylon, rea`); 4 (23 words; starts `The later chapters record visions of beasts, a ram and goat, seventy weeks and a final revelation in`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 12. Nebuchadnezzar

ID: `nebuchadnezzar`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 6/6 story links match. Raw character schema passes.

Passages: 2 Kings 24:1; 2 Kings 25:8; Jeremiah 39:1; Daniel 1:1; Daniel 2:1; Daniel 3:1; Daniel 3:28; Daniel 4:33; Daniel 4:37; Ezra 1:7.

### Findings and required changes

Keep Daniel's father language for Nebuchadnezzar and Belshazzar attributed to that book; do not turn it into a new biological genealogy. Distinguish the king's orders from acts carried out by his officers.

Reference identity: one exact-name row, `nebuchadnezzar_2167`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 2 (23 words; starts `Kings and Jeremiah record that he besieges Jerusalem, carries off Jeconiah and the temple vessels, a`); 3 (38 words; starts `In Daniel he is troubled by a dream of a great statue and sets Daniel over the wise men; he makes a `); 4 (23 words; starts `He is driven from men and eats grass like oxen until he lifts his eyes to heaven, then praises the K`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 13. Belshazzar

ID: `belshazzar`

**Verdict: accept with fixes.**

Checks: all 7 key-verse references exist; 2/2 story links match. Raw character schema passes.

Passages: Daniel 5:1; Daniel 5:2; Daniel 5:22; Daniel 5:25; Daniel 5:30; Daniel 7:1; Daniel 8:1.

### Findings and required changes

Replace the ambiguous He reads in the writing episode with Daniel reads. Keep the writing and interpretations attributed to Daniel 5. Do not infer a date or genealogy from this profile alone.

Reference identity: one exact-name row, `belshazzar_437`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 1 (26 words; starts `King of the Chaldeans who holds a feast for a thousand lords and sends for the golden and silver ves`); 3 (25 words; starts `His wise men cannot read it, the queen recalls Daniel, and Daniel reproves him for not humbling his `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 14. Jonah

ID: `jonah`

**Verdict: accept with fixes.**

Checks: all 9 key-verse references exist; 3/3 story links match. Raw character schema passes.

Passages: Jonah 1:1; Jonah 1:2; Jonah 1:3; Jonah 1:17; Jonah 3:5; Jonah 4:1; Jonah 4:11; 2 Kings 14:25; Matthew 12:40.

### Findings and required changes

Keep the great fish description in Jonah and later Gospel references attributed separately. Do not turn the story into a scientific claim or identify the fish's species.

Reference identity: one exact-name row, `jonah_1689`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 2 (33 words; starts `Told to cry against Nineveh, he flees toward Tarshish, is thrown overboard in a storm, and is held t`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## Batch writing screen

Mean of checked field scores: 9.42. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `90b06e02cc5a603228fdc4c1cd414fd529751ae199712290a5ed08b7849643dd`
- Notes SHA-256: `6da98584f77aca9cf2c741ed3f267d5e36fe522a75dd3c09ad75fb5ece7913a1`
