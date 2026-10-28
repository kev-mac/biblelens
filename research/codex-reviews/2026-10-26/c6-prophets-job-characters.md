# C6: Prophets and Job profiles

Counts: 0 accept / 17 accept with fixes / 0 return to research.

Reviewed input: `research/claude-drafts/prophets-job-characters-records.json` and `prophets-job-characters-notes.md` at `f64e37cad5249adb660ab5377acbad2f52e04270`.

Packaged text and catalogs: `55e438a1071ac8629d5197cbf6c6db9d8346873e`. No draft was changed or merged.

Apply the shared review rules in [README](README.md). An acceptance with fixes is conditional on every listed fix.

All key-verse references were checked against the packaged KJV. Story routes were checked against the current catalog.
The character schema was run on each draft. Family names were also checked against the combined profile set.
A name binding below selects a reference row; it does not approve every family edge inherited from that row.

## 1. Isaiah

ID: `isaiah`

**Verdict: accept with fixes.**

Checks: all 9 key-verse references exist; 4/4 story links match. Raw character schema passes.

Passages: Isaiah 1:1; Isaiah 6:1; Isaiah 6:8; Isaiah 7:3; Isaiah 7:14; Isaiah 8:3; Isaiah 20:2; Isaiah 38:1; Isaiah 39:6.

### Findings and required changes

Remove the unqualified prophetess spouse edge; Isaiah 8:3 describes the woman and birth but does not explicitly call her his wife. Preserve her description in qualified prose. Add Isaiah 20:3 for the three-year sign. Do not infer a birthplace from the book's setting.

Reference identity: one exact-name row, `isaiah_617`. Keep the profile’s stated family limits.

- KJV quotation `Here am I; send me` matches Isaiah 6:8.

### Writing fixes

- `summary`: split screened sentence(s) 2 (21 words; starts `He sees the Lord on a throne in the year Uzziah died, answers 'Here am I; send me', and is sent.`); 3 (54 words; starts `He meets Ahaz at the upper pool with his son Shearjashub and offers the sign of Immanuel, goes naked`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 2. Ahaz

ID: `ahaz`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 1/1 story links match. Raw character schema passes.

Passages: Isaiah 7:1; Isaiah 7:2; Isaiah 7:4; Isaiah 7:12; Isaiah 7:14; 2 Kings 16:1; 2 Kings 16:2; 2 Kings 16:3; 2 Kings 16:4; 2 Kings 16:20.

### Findings and required changes

Keep the Ahaz narrative and Isaiah's messages attributed to their books. Do not add a ruling about the later interpretation of the sign in Isaiah 7.

- Add an explicit reference binding for `ahaz` to `sourceRecord: ahaz_118`. Name-only matching currently finds 2 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 2 (34 words; starts `The writer of Kings says he did not do right like David, walked in the way of the kings of Israel, m`); 3 (42 words; starts `When Syria and Israel come up against Jerusalem, Isaiah is sent to tell him to be quiet and not fear`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 3. Sennacherib

ID: `sennacherib`

**Verdict: accept with fixes.**

Checks: all 8 key-verse references exist; 1/1 story links match. Raw character schema passes.

Passages: Isaiah 36:1; Isaiah 36:2; Isaiah 37:36; Isaiah 37:37; Isaiah 37:38; 2 Kings 18:13; 2 Kings 18:14; 2 Kings 18:17.

### Findings and required changes

Keep the Assyrian ruler and the named sons tied to the cited biblical account. Do not add an external campaign date, motive or family reconstruction to this profile.

Reference identity: one exact-name row, `sennacherib_2489`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 2 (22 words; starts `Hezekiah offers tribute, and Sennacherib sends Rabshakeh and others with a great army to Jerusalem, `); 3 (44 words; starts `The account in Isaiah says the angel of the Lord strikes the Assyrian camp with 185,000 dead; Sennac`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 4. Jeremiah

ID: `jeremiah`

**Verdict: accept with fixes.**

Checks: all 11 key-verse references exist; 5/6 story links match. Raw character schema fails as detailed below.

Passages: Jeremiah 1:1; Jeremiah 1:2; Jeremiah 1:3; Jeremiah 1:5; Jeremiah 1:6; Jeremiah 20:2; Jeremiah 28:5; Jeremiah 36:4; Jeremiah 38:13; Jeremiah 43:6; Jeremiah 43:7.

### Findings and required changes

Remove the unqualified Levi tribe field inferred from being a priest. Fix the Pashhur story title and route to the accepted Jeremiah and Pashhur entry. Keep Jeremiah son of Hilkiah distinct from other people with the name.

Observed validator error: `Character jeremiah: broken story jeremiah-jeremiah-and-pashhur-the-temple-sermon`.

- Replace story `jeremiah-jeremiah-and-pashhur-the-temple-sermon` with title `Jeremiah and Pashhur`, passage `Jeremiah 20:1 - 20:18`, ID `jeremiah-jeremiah-and-pashhur`, route `#stories/jeremiah/jeremiah-and-pashhur`.

- Add an explicit reference binding for `jeremiah` to `sourceRecord: jeremiah_853`. Name-only matching currently finds 8 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 1 (30 words; starts `Son of Hilkiah, of the priests at Anathoth in Benjamin, to whom the word of the Lord comes from the `); 2 (24 words; starts `Told that he was known and ordained a prophet to the nations before birth, he answers that he is a c`); 3 (46 words; starts `He is struck and put in the stocks by Pashur, opposes the prophet Hananiah, has his words written by`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 5. Baruch

ID: `baruch`

**Verdict: accept with fixes.**

Checks: all 7 key-verse references exist; 2/2 story links match. Raw character schema passes.

Passages: Jeremiah 36:4; Jeremiah 36:10; Jeremiah 36:26; Jeremiah 36:32; Jeremiah 43:6; Jeremiah 45:1; Jeremiah 45:3.

### Findings and required changes

Remove Seraiah from structured siblings unless the relationship is stated as an inference with its source. Shared father and grandfather names in Jeremiah 32:12 and 51:59 do not expressly say brother. Keep Baruch son of Neriah distinct from other Baruchs.

- Add an explicit reference binding for `baruch` to `sourceRecord: baruch_410`. Name-only matching currently finds 4 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 2 (21 words; starts `In the fourth year of Jehoiakim he writes down all the words of the Lord from Jeremiah's mouth on a `); 3 (26 words; starts `When the king burns the roll, he writes a second one from Jeremiah with many like words added, and t`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 6. Hananiah son of Azur

ID: `hananiah-son-of-azur`

**Verdict: accept with fixes.**

Checks: all 7 key-verse references exist; 1/1 story links match. Raw character schema passes.

Passages: Jeremiah 28:1; Jeremiah 28:2; Jeremiah 28:3; Jeremiah 28:4; Jeremiah 28:15; Jeremiah 28:16; Jeremiah 28:17.

### Findings and required changes

Keep Hananiah son of Azur distinct from Daniel's companion. Attribute the competing predictions and their evaluation to Jeremiah 28. Do not label an app user’s beliefs through this episode.

- Add an explicit reference binding for `hananiah-son-of-azur` to `sourceRecord: hananiah_1395`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 2 (29 words; starts `He says the Lord has broken the yoke of the king of Babylon and that within two full years the templ`); 3 (27 words; starts `Jeremiah answers that the Lord has not sent him and that he makes the people trust a lie; Hananiah d`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 7. Zedekiah

ID: `zedekiah`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 2/2 story links match. Raw character schema passes.

Passages: Jeremiah 37:17; Jeremiah 38:5; Jeremiah 38:24; Jeremiah 39:5; Jeremiah 39:6; Jeremiah 39:7; Jeremiah 52:1; Jeremiah 52:2; Jeremiah 52:3; Jeremiah 52:11.

### Findings and required changes

Keep the Mattaniah/Zedekiah naming in 2 Kings 24:17. Do not link him to the other Zedekiahs. Attribute the warnings and capture to their accounts.

- Add an explicit reference binding for `zedekiah` to `sourceRecord: zedekiah_1950`. Name-only matching currently finds 5 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 3 (38 words; starts `During the siege he secretly asks Jeremiah for a word from the Lord, gives the princes leave to put `); 4 (31 words; starts `The Chaldeans overtake him on the plains of Jericho, kill his sons before his eyes, put out his eyes`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 8. Ebed-melech

ID: `ebed-melech`

**Verdict: accept with fixes.**

Checks: all 7 key-verse references exist; 1/1 story links match. Raw character schema passes.

Passages: Jeremiah 38:7; Jeremiah 38:9; Jeremiah 38:10; Jeremiah 38:11; Jeremiah 38:13; Jeremiah 39:16; Jeremiah 39:18.

### Findings and required changes

Explain the Ethiopian/Cushite label as an ancient designation, without assigning modern nationality. Attribute the promise about trust to Jeremiah 39:18. Do not invent family links.

Reference identity: one exact-name row, `ebed-melech_1029`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 2 (38 words; starts `He speaks to the king in the gate of Benjamin, takes thirty men with the king's permission, lets dow`); 3 (24 words; starts `While Jeremiah is still shut up, the Lord promises Ebed-melech deliverance in the day the city falls`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 9. Ezekiel

ID: `ezekiel`

**Verdict: accept with fixes.**

Checks: all 11 key-verse references exist; 4/6 story links match. Raw character schema fails as detailed below.

Passages: Ezekiel 1:1; Ezekiel 1:2; Ezekiel 1:3; Ezekiel 2:1; Ezekiel 3:15; Ezekiel 4:4; Ezekiel 8:1; Ezekiel 11:24; Ezekiel 24:16; Ezekiel 24:18; Ezekiel 37:1.

### Findings and required changes

Remove the unqualified Levi tribe field inferred from priesthood. Say he is told to lie on his side as a sign, instead of turning the command into a narrated completed act. Remove both missing story links. Keep the verse anchors and the vision framing.

Observed validator error: `Character ezekiel: broken story ezekiel-sign-acts-of-the-siege`.

- Remove story link `ezekiel-sign-acts-of-the-siege`. It is absent from the current catalog. Keep the verse anchors; do not publish a held story to repair this link.
- Remove story link `ezekiel-gog-and-the-restored-temple`. It is absent from the current catalog. Keep the verse anchors; do not publish a held story to repair this link.

Reference identity: one exact-name row, `ezekiel_1237`. Keep the profile’s stated family limits.

- KJV quotation `son of man` matches Ezekiel 2:6; Ezekiel 2:8; Ezekiel 3:25; Ezekiel 4:1.

### Writing fixes

- `summary`: split screened sentence(s) 1 (35 words; starts `A priest, son of Buzi, among the captives by the river Chebar in the land of the Chaldeans, in the f`); 2 (32 words; starts `Addressed as 'son of man', he is commissioned, sits astonished seven days among the exiles at Telabi`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 10. Hosea

ID: `hosea`

**Verdict: accept with fixes.**

Checks: all 9 key-verse references exist; 0/1 story links match. Raw character schema fails as detailed below.

Passages: Hosea 1:1; Hosea 1:2; Hosea 1:3; Hosea 1:4; Hosea 1:6; Hosea 1:9; Hosea 3:1; Hosea 3:2; Hosea 3:3.

### Findings and required changes

Correct Hosea's Marriage to Gomer to Hosea 1:1 - 1:9. Do not merge the unnamed woman of chapter 3 with Gomer as an established identity.

Observed validator error: `Character hosea: broken story hosea-hosea-s-marriage-to-gomer`.

- Replace story `hosea-hosea-s-marriage-to-gomer` with title `Hosea's Marriage to Gomer`, passage `Hosea 1:1 - 1:9`, ID `hosea-hosea-s-marriage-to-gomer`, route `#stories/hosea/hosea-s-marriage-to-gomer`.

Reference identity: one exact-name row, `hosea_1555`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 1 (26 words; starts `Son of Beeri, to whom the word of the Lord came in the days of four kings of Judah and Jeroboam son `); 2 (27 words; starts `Told to take a wife of whoredoms, he marries Gomer, and the three children are named Jezreel, Lo-ruh`); 3 (32 words; starts `Later he is told to love a woman beloved of another and an adulteress, buys her for fifteen pieces o`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 11. Gomer

ID: `gomer`

**Verdict: accept with fixes.**

Checks: all 6 key-verse references exist; 0/1 story links match. Raw character schema fails as detailed below.

Passages: Hosea 1:3; Hosea 1:6; Hosea 1:8; Hosea 3:1; Hosea 3:2; Hosea 3:3.

### Findings and required changes

Change buys back to buys in the chapter 3 description. Remove usually read that way unless a source for that claim is supplied. Keep the woman's identity unresolved. Correct the marriage story range to Hosea 1:1 - 1:9.

Observed validator error: `Character gomer: broken story hosea-hosea-s-marriage-to-gomer`.

- Replace story `hosea-hosea-s-marriage-to-gomer` with title `Hosea's Marriage to Gomer`, passage `Hosea 1:1 - 1:9`, ID `hosea-hosea-s-marriage-to-gomer`, route `#stories/hosea/hosea-s-marriage-to-gomer`.

- Add an explicit reference binding for `gomer` to `sourceRecord: gomer_1329`. Name-only matching currently finds 2 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 2 (21 words; starts `She conceives and bears a son, then a daughter named Lo-ruhamah, and after weaning her, another son `); 3 (44 words; starts `In chapter 3 the text speaks of a woman beloved of her friend yet an adulteress whom Hosea buys back`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 12. Amos

ID: `amos`

**Verdict: accept with fixes.**

Checks: all 6 key-verse references exist; 1/1 story links match. Raw character schema passes.

Passages: Amos 1:1; Amos 7:10; Amos 7:12; Amos 7:13; Amos 7:14; Amos 7:15.

### Findings and required changes

Keep Amos's own description of his work attributed to Amos 7:14–15. Do not infer a later school or biography. Keep this prophet distinct from the Amos in Luke's genealogy.

- Add an explicit reference binding for `amos` to `sourceRecord: amos_238`. Name-only matching currently finds 2 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 1 (27 words; starts `One of the herdmen of Tekoa whose words concern Israel in the days of Uzziah of Judah and Jeroboam s`); 2 (25 words; starts `When Amaziah the priest of Bethel reports him to the king, he is told to flee to Judah and not to pr`); 3 (34 words; starts `He answers that he was no prophet or prophet's son, but a herdman and a gatherer of sycomore fruit, `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 13. Amaziah the priest of Bethel

ID: `amaziah-priest-of-bethel`

**Verdict: accept with fixes.**

Checks: all 4 key-verse references exist; 1/1 story links match. Raw character schema passes.

Passages: Amos 7:10; Amos 7:11; Amos 7:12; Amos 7:13.

### Findings and required changes

Keep Amaziah the priest of Bethel distinct from the king of Judah. Attribute the exchange and threatened consequences to Amos 7; do not add a motive.

- Add an explicit reference binding for `amaziah-priest-of-bethel` to `sourceRecord: amaziah_217`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

- KJV quotation `O thou seer` matches Amos 7:12.

### Writing fixes

- `summary`: split screened sentence(s) 1 (37 words; starts `Priest at Bethel who sends word to Jeroboam of Israel that Amos has conspired against him and that t`); 2 (27 words; starts `He tells Amos, 'O thou seer', to flee to Judah, eat bread and prophesy there, and not at Bethel, sin`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 14. Eliphaz

ID: `eliphaz`

**Verdict: accept with fixes.**

Checks: all 5 key-verse references exist; 2/2 story links match. Raw character schema passes.

Passages: Job 2:11; Job 4:1; Job 42:7; Job 42:8; Job 42:9.

### Findings and required changes

Keep Job's Eliphaz distinct from the son of Esau. Attribute his arguments to his speeches and the closing rebuke to the story. Do not add an unsupported genealogy.

- Add an explicit reference binding for `eliphaz` to `sourceRecord: eliphaz_1145`. Name-only matching currently finds 2 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 3 (47 words; starts `At the close, the Lord says to Eliphaz that his wrath is kindled against him and his two friends bec`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 15. Bildad

ID: `bildad`

**Verdict: accept with fixes.**

Checks: all 4 key-verse references exist; 2/2 story links match. Raw character schema passes.

Passages: Job 2:11; Job 8:1; Job 42:7; Job 42:9.

### Findings and required changes

Keep Bildad's arguments as his speeches, not the app's explanation of suffering. Preserve the closing rebuke and the limits on his origin.

Reference identity: one exact-name row, `bildad_499`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 3 (35 words; starts `The Lord's closing word at the end of the book includes him among the three whose words about God we`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 16. Zophar

ID: `zophar`

**Verdict: accept with fixes.**

Checks: all 4 key-verse references exist; 2/2 story links match. Raw character schema passes.

Passages: Job 2:11; Job 11:1; Job 42:7; Job 42:9.

### Findings and required changes

Keep Zophar's arguments as his speeches, not the app's explanation of suffering. Preserve the closing rebuke without inventing a further fate.

Reference identity: one exact-name row, `zophar_3105`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 2 (32 words; starts `He is one of the two named with Eliphaz in the Lord's rebuke at the end, and does as the Lord comman`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 17. Elihu

ID: `elihu`

**Verdict: accept with fixes.**

Checks: all 5 key-verse references exist; 1/1 story links match. Raw character schema passes.

Passages: Job 32:2; Job 32:3; Job 32:4; Job 32:6; Job 33:6.

### Findings and required changes

Replace the residence claim drawn from Job 2:11 with Not stated; he speaks to Job in Job 32:6. Job 2:11 describes the three friends, not Elihu. Do not infer that he travelled with them.

- Add an explicit reference binding for `elihu` to `sourceRecord: elihu_1130`. Name-only matching currently finds 5 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 2 (39 words; starts `He waits until Job and the three friends have finished because they are older, then his wrath is kin`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## Batch writing screen

Mean of checked field scores: 10.05. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `a29ad583eaca65633bb68abcaa64bf6e7dd667338d080da1ec605f47831d87ca`
- Notes SHA-256: `6f117cccb8250a8f0dde7ddaa2a8617ed80ead8644b32bbaab8a4ff1c4d0078c`
