# C7: Gospel profiles

Counts: 0 accept / 17 accept with fixes / 0 return to research.

Reviewed input: `research/claude-drafts/gospels-characters-records.json` and `gospels-characters-notes.md` at `f64e37cad5249adb660ab5377acbad2f52e04270`.

Packaged text and catalogs: `55e438a1071ac8629d5197cbf6c6db9d8346873e`. No draft was changed or merged.

Apply the shared review rules in [README](README.md). An acceptance with fixes is conditional on every listed fix.

All key-verse references were checked against the packaged KJV. Story routes were checked against the current catalog.
The character schema was run on each draft. Family names were also checked against the combined profile set.
A name binding below selects a reference row; it does not approve every family edge inherited from that row.

## 1. Mary

ID: `mary-mother-of-jesus`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 5/5 story links match. Raw character schema passes.

Passages: Luke 1:26; Luke 1:27; Luke 1:38; Luke 1:46; Luke 2:7; Luke 2:51; John 2:1; John 19:25; John 19:27; Acts 1:14.

### Findings and required changes

Change lineage.spouses from Joseph to Joseph of Nazareth and verify it resolves to joseph-husband-of-mary, not the patriarch joseph. Describe the song of praise in plain words. Keep the birth narratives attributed to their Gospels.

- Add an explicit reference binding for `mary-mother-of-jesus` to `sourceRecord: mary_1938`. Name-only matching currently finds 6 rows. Check the cited identity and suppress unsupported inherited family edges.

- KJV quotation `Behold the handmaid of the Lord` matches Luke 1:38.

### Writing fixes

- `summary`: split screened sentence(s) 1 (27 words; starts `A virgin of Nazareth in Galilee, betrothed to Joseph, to whom the angel Gabriel announces that she w`); 3 (23 words; starts `She bears Jesus in Bethlehem, lays him in a manger, presents him in the temple, and later finds him `); 4 (34 words; starts `She is at the wedding in Cana, stands by the cross where Jesus commits her to the disciple whom he l`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 2. Joseph of Nazareth

ID: `joseph-husband-of-mary`

**Verdict: accept with fixes.**

Checks: all 9 key-verse references exist; 4/4 story links match. Raw character schema passes.

Passages: Matthew 1:19; Matthew 1:20; Matthew 1:24; Matthew 2:13; Matthew 2:14; Matthew 2:19; Matthew 2:23; Luke 2:4; Luke 2:41.

### Findings and required changes

Replace the claim that the Gospels never mention him after Jesus is twelve with: These passages do not describe his later life. John 6:42 and Matthew 13:55 still mention him. Qualify the Jesus child link as the household relationship described in the narratives; do not infer biological parentage.

- Add an explicit reference binding for `joseph-husband-of-mary` to `sourceRecord: joseph_1715`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 2 (32 words; starts `When she is found with child he plans to put her away privately, but an angel tells him in a dream t`); 3 (31 words; starts `He goes up with her to Bethlehem for the enrolment, is warned in a dream to take the child to Egypt,`); 4 (31 words; starts `Luke shows him at the presentation and at the Passover visit when Jesus is twelve; the Gospels do no`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 3. Elisabeth

ID: `elisabeth`

**Verdict: accept with fixes.**

Checks: all 7 key-verse references exist; 1/1 story links match. Raw character schema passes.

Passages: Luke 1:5; Luke 1:7; Luke 1:24; Luke 1:36; Luke 1:41; Luke 1:42; Luke 1:60.

### Findings and required changes

Explain daughter of Aaron as a family-line description, not an immediate parent edge to the Exodus Aaron. Keep her pregnancy and kinship to Mary tied to Luke.

Reference identity: one exact-name row, `elisabeth_1152`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 1 (21 words; starts `A daughter of Aaron and the wife of the priest Zacharias, righteous before God but childless and wel`); 2 (21 words; starts `After Zacharias is told in the temple that she will bear a son, she conceives and keeps herself hidd`); 3 (29 words; starts `When Mary, her relative, greets her, the child leaps in her womb and she is filled with the Holy Spi`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 4. Zacharias

ID: `zacharias-father-of-john`

**Verdict: accept with fixes.**

Checks: all 9 key-verse references exist; 1/1 story links match. Raw character schema passes.

Passages: Luke 1:5; Luke 1:9; Luke 1:13; Luke 1:18; Luke 1:20; Luke 1:63; Luke 1:64; Luke 1:67; Luke 1:69.

### Findings and required changes

Say Gabriel links the loss of speech to unbelief in Luke 1:20. Say speech returns when the child is named, not at birth. Do not settle the identification of Matthew 23:35's Zacharias merely by assertion.

- Add an explicit reference binding for `zacharias-father-of-john` to `sourceRecord: zacharias_2971`. Name-only matching currently finds 2 rows. Check the cited identity and suppress unsupported inherited family edges.

- KJV quotation `His name is John` matches Luke 1:63.

### Writing fixes

- `summary`: split screened sentence(s) 2 (37 words; starts `While burning incense in the temple he is told by Gabriel that his wife will bear a son to be named `); 3 (31 words; starts `On the eighth day he writes 'His name is John', his speech returns, and he blesses God and prophesie`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 5. John the Baptist

ID: `john-the-baptist`

**Verdict: accept with fixes.**

Checks: all 12 key-verse references exist; 5/5 story links match. Raw character schema passes.

Passages: Matthew 3:1; Matthew 3:4; Matthew 3:13; Matthew 11:2; Matthew 14:3; Matthew 14:10; Mark 1:4; Luke 3:12; Luke 3:14; John 1:29; John 3:23; John 3:30.

### Findings and required changes

Replace an exact six-month birth interval with Luke's stated pregnancy interval at 1:26 and 1:36. Change turns away the Pharisees and Sadducees to rebukes them in Matthew 3:7. Place the prison message before the account of his death.

- Add an explicit reference binding for `john-the-baptist` to `sourceRecord: john_1676`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 2 (32 words; starts `He appears in the wilderness of Judaea preaching repentance, clothed in camel's hair with a leathern`); 3 (26 words; starts `He tells the crowds, soldiers and publicans how to live, turns away Pharisees and Sadducees, baptize`); 4 (25 words; starts `He rebukes Herod Antipas over Herodias and is imprisoned and beheaded; from prison he sends disciple`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 6. Herod the king

ID: `herod-the-great`

**Verdict: accept with fixes.**

Checks: all 9 key-verse references exist; 2/2 story links match. Raw character schema passes.

Passages: Luke 1:5; Matthew 2:1; Matthew 2:3; Matthew 2:4; Matthew 2:7; Matthew 2:8; Matthew 2:16; Matthew 2:19; Matthew 2:22.

### Findings and required changes

Do not say Agrippa is another Herod in the Gospels; that profile concerns Acts. Keep this ruler distinct from Herod the tetrarch. Treat Great as a conventional label, not a quoted KJV name.

- Add an explicit reference binding for `herod-the-great` to `sourceRecord: herod_1504`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 2 (40 words; starts `When Magi ask where the king of the Jews is born, he is troubled with all Jerusalem, learns from the`); 3 (26 words; starts `Mocked by their departure by another road, he is exceeding wroth and kills the children in Bethlehem`); 4 (23 words; starts `Matthew records that he dies, after which Joseph brings the family out of Egypt; Luke places the bir`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 7. Peter

ID: `peter`

**Verdict: accept with fixes.**

Checks: all 12 key-verse references exist; 4/4 story links match. Raw character schema passes.

Passages: John 1:42; John 1:44; Matthew 4:18; Matthew 14:29; Matthew 16:16; Matthew 26:34; Matthew 26:75; Luke 5:8; Luke 24:12; John 21:15; John 21:17; Acts 1:13.

### Findings and required changes

Make Andrew's reciprocal sibling label Peter, matching this profile's displayed name. Explain passion as the arrest and death accounts. Keep differences among the calling narratives rather than invent one combined sequence.

- Add an explicit reference binding for `peter` to `sourceRecord: peter_2745`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

- KJV quotation `Thou art the Christ, the Son of the living God` matches Matthew 16:16.
- KJV quotation `lovest thou me?` matches John 21:16; John 21:17.

### Writing fixes

- `summary`: split screened sentence(s) 2 (42 words; starts `After the miraculous catch he leaves his nets to follow Jesus, is named first in the lists of the Tw`); 4 (26 words; starts `After the arrest he denies Jesus three times and weeps, runs to the tomb, and is asked by the risen `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 8. Judas Iscariot

ID: `judas-iscariot`

**Verdict: accept with fixes.**

Checks: all 11 key-verse references exist; 4/4 story links match. Raw character schema passes.

Passages: Matthew 10:4; Matthew 26:14; Matthew 26:15; Matthew 26:25; Matthew 26:49; Matthew 27:3; Matthew 27:5; John 12:4; John 12:6; John 13:26; Acts 1:18.

### Findings and required changes

Remove the proposed Kerioth origin; the cited verses do not establish it. Use Birthplace not stated. Preserve the differences between Matthew and Acts on his death without an added reconciliation.

- Add an explicit reference binding for `judas-iscariot` to `sourceRecord: judas_1760`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 1 (28 words; starts `One of the Twelve, named last in the lists as the one who betrayed Jesus, and keeper of the bag, fro`); 2 (23 words; starts `Six days before the Passover he objects to the anointing at Bethany; John says it was not because he`); 3 (40 words; starts `He goes to the chief priests and agrees on thirty pieces of silver to deliver Jesus, is named at the`); 4 (28 words; starts `Matthew says he repents, throws the silver down in the temple and hangs himself; Acts 1 tells of his`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 9. Mary Magdalene

ID: `mary-magdalene`

**Verdict: accept with fixes.**

Checks: all 11 key-verse references exist; 3/3 story links match. Raw character schema passes.

Passages: Luke 8:2; Matthew 27:56; Matthew 27:61; Mark 16:1; Mark 16:9; Luke 24:10; John 19:25; John 20:1; John 20:11; John 20:16; John 20:18.

### Findings and required changes

Replace the quoted I have seen the Lord with a paraphrase: John says she tells the disciples that she has seen the Lord. John 20:18 does not give that direct KJV speech. Change geography.origin to Birthplace not stated; Luke calls her Magdalene. Do not infer Magdala from the name alone without a cited source.

- Add an explicit reference binding for `mary-magdalene` to `sourceRecord: mary_1943`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

- KJV quotation `I have seen the Lord` is not an exact packaged quote. Apply the quote repair above.

### Writing fixes

- `summary`: split screened sentence(s) 1 (24 words; starts `A woman called Magdalene, out of whom Luke says seven devils had gone, who travels with Jesus and mi`); 3 (37 words; starts `At dawn on the first day she finds the stone rolled away; in John she stays weeping by the tomb and `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 10. Martha

ID: `martha-of-bethany`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 3/3 story links match. Raw character schema passes.

Passages: Luke 10:38; Luke 10:40; Luke 10:41; Luke 10:42; John 11:1; John 11:21; John 11:24; John 11:27; John 11:39; John 12:2.

### Findings and required changes

Do not state that Luke 10 names Bethany; its village is unnamed. Keep John's Bethany setting distinct and qualify the cross-account identity. Preserve the family links to Mary of Bethany and Lazarus.

Reference identity: one exact-name row, `martha_1937`. Keep the profile’s stated family limits.

- KJV quotation `if thou hadst been here` matches John 11:21; John 11:32.

### Writing fixes

- `summary`: split screened sentence(s) 1 (39 words; starts `Sister of Mary and Lazarus, of the village of Bethany, who receives Jesus into her house and is cumb`); 2 (31 words; starts `When Lazarus dies she goes out to meet Jesus before he reaches the village, says 'if thou hadst been`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 11. Mary of Bethany

ID: `mary-of-bethany`

**Verdict: accept with fixes.**

Checks: all 12 key-verse references exist; 3/3 story links match. Raw character schema passes.

Passages: Luke 10:39; Luke 10:42; John 11:1; John 11:2; John 11:20; John 11:32; John 11:33; John 11:35; John 12:3; John 12:7; Matthew 26:7; Mark 14:3.

### Findings and required changes

Keep the Bethany family and anointing in John explicit. Do not equate her with Luke 7's unnamed woman. If Luke 10 is used, retain the limit that its village is unnamed.

- Add an explicit reference binding for `mary-of-bethany` to `sourceRecord: mary_1939`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

- KJV quotation `if thou hadst been here` matches John 11:21; John 11:32.

### Writing fixes

- `summary`: split screened sentence(s) 2 (24 words; starts `When Lazarus dies she stays in the house until she is called, then falls at Jesus' feet and says 'if`); 4 (33 words; starts `Six days before the Passover she anoints Jesus' feet with a pound of spikenard and wipes them with h`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 12. Lazarus

ID: `lazarus-of-bethany`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 2/2 story links match. Raw character schema passes.

Passages: John 11:1; John 11:3; John 11:11; John 11:39; John 11:43; John 11:44; John 11:45; John 12:1; John 12:2; John 12:10.

### Findings and required changes

Keep this Lazarus distinct from the character in Luke 16's story. Attribute the return-to-life account to John without inventing a later biography.

- Add an explicit reference binding for `lazarus-of-bethany` to `sourceRecord: lazarus_1812`. Name-only matching currently finds 2 rows. Check the cited identity and suppress unsupported inherited family edges.

- KJV quotation `Lazarus, come forth` matches John 11:43.

### Writing fixes

- `summary`: split screened sentence(s) 3 (33 words; starts `At the tomb Jesus lifts up his eyes, thanks the Father, and cries with a loud voice 'Lazarus, come f`); 4 (32 words; starts `Many of the Jews believe on account of it; six days before the Passover he sits at table with Jesus,`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 13. Nicodemus

ID: `nicodemus`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 2/2 story links match. Raw character schema passes.

Passages: John 3:1; John 3:2; John 3:3; John 3:4; John 3:10; John 3:16; John 7:50; John 7:51; John 19:39; John 19:40.

### Findings and required changes

Keep Nicodemus's three appearances in John and attribute the dialogue to that Gospel. Explain born again and burial customs without assuming the reader shares a belief.

Reference identity: one exact-name row, `nicodemus_2204`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 1 (43 words; starts `A Pharisee and a ruler of the Jews who comes to Jesus by night, says that no one can do these miracl`); 2 (29 words; starts `He asks how a man can be born when he is old, and the conversation moves to the serpent lifted up in`); 4 (21 words; starts `After the crucifixion he brings about a hundred pound of myrrh and aloes and helps Joseph of Arimath`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 14. Pontius Pilate

ID: `pontius-pilate`

**Verdict: accept with fixes.**

Checks: all 12 key-verse references exist; 2/3 story links match. Raw character schema fails as detailed below.

Passages: Luke 3:1; Luke 13:1; Matthew 27:2; Matthew 27:11; Matthew 27:19; Matthew 27:24; Matthew 27:58; Mark 15:15; Luke 23:4; Luke 23:7; John 18:38; John 19:19.

### Findings and required changes

Remove an inferred purpose for sending Jesus to Herod; Luke describes the transfer without that motive. Attribute hand washing to Matthew. Say Matthew describes a guard at the tomb, avoiding a stronger claim about who personally sets it. Fix the Mark story title and route. Match John 19:19’s inscription capitalization exactly: JESUS OF NAZARETH THE KING OF THE JEWS; otherwise present it as a paraphrase without quotation marks.

Observed validator error: `Character pontius-pilate: broken story mark-trial-crucifixion-and-burial`.

- Replace story `mark-trial-crucifixion-and-burial` with title `Trial, Crucifixion and Burial in Mark`, passage `Mark 14:53 - 15:47`, ID `mark-trial-crucifixion-and-burial-in-mark`, route `#stories/mark/trial-crucifixion-and-burial-in-mark`.

- Add an explicit reference binding for `pontius-pilate` to `sourceRecord: pilate_2365`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

- KJV quotation `Art thou the King of the Jews?` matches Matthew 27:11; Mark 15:2; Luke 23:3; John 18:33.
- KJV quotation `Jesus of Nazareth the King of the Jews` is not an exact packaged quote. Apply the quote repair above.

### Writing fixes

- `summary`: split screened sentence(s) 2 (43 words; starts `In the Gospels he asks 'Art thou the King of the Jews?', finds no fault, tries to release Jesus by s`); 3 (28 words; starts `In the end he scourges Jesus and delivers him to be crucified, and has the inscription 'Jesus of Naz`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 15. Caiaphas

ID: `caiaphas`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 4/4 story links match. Raw character schema passes.

Passages: Matthew 26:3; Matthew 26:57; Matthew 26:65; Luke 3:2; John 11:49; John 11:50; John 11:51; John 18:13; John 18:14; Acts 4:6.

### Findings and required changes

Remove Joseph Caiaphas from aliases unless a source for that extra-biblical name is supplied. Keep the high-priest role and family link to Annas within the cited Gospel passages.

Reference identity: one exact-name row, `caiaphas_532`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 2 (34 words; starts `After the raising of Lazarus, John says he tells the council that it is expedient that one man die f`); 3 (36 words; starts `Matthew says the chief priests and elders gathered in his palace to plot to take Jesus by subtilty, `); 4 (36 words; starts `John gives Annas as his father-in-law; in Luke 3:2 Annas and Caiaphas are named together as high pri`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 16. Zacchaeus

ID: `zacchaeus`

**Verdict: accept with fixes.**

Checks: all 9 key-verse references exist; 1/1 story links match. Raw character schema passes.

Passages: Luke 19:1; Luke 19:2; Luke 19:3; Luke 19:4; Luke 19:5; Luke 19:7; Luke 19:8; Luke 19:9; Luke 19:10.

### Findings and required changes

Replace publican with tax collector in app prose. Attribute the statements about salvation to Jesus's speech in Luke. Do not turn them into an app assessment of the reader.

Reference identity: one exact-name row, `zacchaeus_2961`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 1 (23 words; starts `A chief among the publicans of Jericho and rich, who is small of stature and climbs a sycomore tree `); 4 (48 words; starts `Zacchaeus stands and says he gives half his goods to the poor and, if he has taken anything by false`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 17. Thomas

ID: `thomas`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 3/4 story links match. Raw character schema fails as detailed below.

Passages: Matthew 10:3; John 11:16; John 14:5; John 14:6; John 20:24; John 20:25; John 20:27; John 20:28; John 21:2; Acts 1:13.

### Findings and required changes

Keep Thomas's words and doubts tied to John. Remove the held Last Supper Discourse story link; the verse anchors can remain. Do not merge this with another Thomas on a name alone.

Observed validator error: `Character thomas: broken story john-the-last-supper-discourse`.

- Remove story link `john-the-last-supper-discourse`. It is absent from the current catalog. Keep the verse anchors; do not publish a held story to repair this link.

Reference identity: one exact-name row, `thomas_2851`. Keep the profile’s stated family limits.

- KJV quotation `Let us also go, that we may die with him` matches John 11:16.
- KJV quotation `I am the way, the truth, and the life` matches John 14:6.
- KJV quotation `My Lord and my God` matches John 20:28.

### Writing fixes

- `summary`: split screened sentence(s) 2 (25 words; starts `When Jesus sets out for Bethany after Lazarus dies, he says to his fellow disciples 'Let us also go,`); 3 (23 words; starts `At the supper he asks how they can know the way, and Jesus answers 'I am the way, the truth, and the`); 4 (35 words; starts `Absent when Jesus first appears to the disciples on the evening of the resurrection, he says he will`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## Batch writing screen

Mean of checked field scores: 9.49. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `03c97e8b4e12dc16231aa07e36e534cc95074e79eb8cc4d1f1ea5dbb676c8b2e`
- Notes SHA-256: `dcbd235ba42782c04874bb36a657b305fd840fe693df096c3984cb7dc487924e`
