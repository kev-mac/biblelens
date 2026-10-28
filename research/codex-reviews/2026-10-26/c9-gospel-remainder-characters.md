# C9: Remaining Gospel profiles

Counts: 0 accept / 11 accept with fixes / 0 return to research.

Reviewed input: `research/claude-drafts/gospel-remainder-characters-records.json` and `gospel-remainder-characters-notes.md` at `f64e37cad5249adb660ab5377acbad2f52e04270`.

Packaged text and catalogs: `55e438a1071ac8629d5197cbf6c6db9d8346873e`. No draft was changed or merged.

Apply the shared review rules in [README](README.md). An acceptance with fixes is conditional on every listed fix.

All key-verse references were checked against the packaged KJV. Story routes were checked against the current catalog.
The character schema was run on each draft. Family names were also checked against the combined profile set.
A name binding below selects a reference row; it does not approve every family edge inherited from that row.

## 1. Andrew

ID: `andrew`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 2/2 story links match. Raw character schema passes.

Passages: Matthew 4:18; Mark 1:16; John 1:40; John 1:41; John 1:44; John 6:8; John 6:9; John 12:22; Mark 13:3; Acts 1:13.

### Findings and required changes

Change the sibling label Simon Peter to Peter so it resolves to the existing profile. Preserve differences between the Gospel calling scenes instead of inventing a single sequence.

Reference identity: one exact-name row, `andrew_264`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 2 (37 words; starts `In John he is first a follower of John the Baptist, then finds his brother and brings him to Jesus; `); 3 (45 words; starts `He points out the lad with five barley loaves before the feeding of the multitude, brings the enquir`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 2. James son of Zebedee

ID: `james-son-of-zebedee`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 5/6 story links match. Raw character schema fails as detailed below.

Passages: Matthew 4:21; Mark 1:19; Mark 3:17; Luke 8:51; Luke 9:28; Luke 9:54; Mark 10:35; Mark 10:37; Mark 10:41; Acts 12:2.

### Findings and required changes

Use John son of Zebedee as the sibling label, with the reverse link from John's profile. Do not infer Salome as mother from parallel lists. Correct the Mark confession/transfiguration story title, ID and route.

Observed validator error: `Character james-son-of-zebedee: broken story mark-peter-s-confession-and-the-transfiguration`.

- Replace story `mark-peter-s-confession-and-the-transfiguration` with title `Peter's Confession and the Transfiguration in Mark`, passage `Mark 8:27 - 9:29`, ID `mark-peter-s-confession-and-the-transfiguration-in-mark`, route `#stories/mark/peter-s-confession-and-the-transfiguration-in-mark`.

- Add an explicit reference binding for `james-son-of-zebedee` to `sourceRecord: james_717`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

### Writing fixes

- `summary`: split screened sentence(s) 1 (26 words; starts `A fisherman called with his brother John while mending nets in a ship with their father Zebedee; the`); 4 (30 words; starts `He and John ask for the seats at Jesus' right and left hand in his glory, and the other ten are disp`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 3. John son of Zebedee

ID: `john-son-of-zebedee`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 4/5 story links match. Raw character schema fails as detailed below.

Passages: Matthew 4:21; Mark 3:17; Luke 8:51; Luke 9:28; Luke 9:49; Luke 9:54; Mark 10:35; Acts 3:1; Acts 4:13; Acts 8:14.

### Findings and required changes

Use James son of Zebedee as the sibling label, with the reverse link. Preserve the limit that the beloved disciple is unnamed; do not declare authorship or identity from this profile. Correct the Mark confession/transfiguration story title, ID and route.

Observed validator error: `Character john-son-of-zebedee: broken story mark-peter-s-confession-and-the-transfiguration`.

- Replace story `mark-peter-s-confession-and-the-transfiguration` with title `Peter's Confession and the Transfiguration in Mark`, passage `Mark 8:27 - 9:29`, ID `mark-peter-s-confession-and-the-transfiguration-in-mark`, route `#stories/mark/peter-s-confession-and-the-transfiguration-in-mark`.

- Add an explicit reference binding for `john-son-of-zebedee` to `sourceRecord: john_1677`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

- KJV quotation `unlearned and ignorant men` matches Acts 4:13.

### Writing fixes

- `summary`: split screened sentence(s) 2 (46 words; starts `He is named with Peter and James at Jairus's house and the transfiguration, tells Jesus that the dis`); 3 (36 words; starts `In Acts he goes up to the temple with Peter, stands with Peter before the council as one of the 'unl`); 4 (44 words; starts `The Gospel of John never names the disciple whom Jesus loved; the Gospel says only that this discipl`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 4. Matthew (Levi)

ID: `matthew-levi`

**Verdict: accept with fixes.**

Checks: all 8 key-verse references exist; 2/2 story links match. Raw character schema passes.

Passages: Matthew 9:9; Matthew 10:3; Mark 2:14; Mark 2:15; Luke 5:27; Luke 5:28; Luke 5:29; Acts 1:13.

### Findings and required changes

Qualify the Matthew/Levi association in prose. Remove the unqualified Alphaeus parent edge derived only from identifying Matthew with Levi. Use Matthew as the display name and retain the stable ID. Do not inherit Levi family edges without a stated, sourced identity decision.

- Add an explicit reference binding for `matthew-levi` to `sourceRecord: matthew_1971`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

- KJV quotation `Matthew the publican` matches Matthew 10:3.

### Writing fixes

- `summary`: split screened sentence(s) 2 (34 words; starts `Matthew names him Matthew, Mark calls him Levi the son of Alphaeus, and Luke calls him Levi, who lea`); 4 (24 words; starts `The Gospels' lists of the twelve give 'Matthew the publican' (Matthew 10:3), and he is among those i`); 5 (29 words; starts `That the Matthew of Matthew 9:9 and the Levi of Mark and Luke are one man is the usual reading; no v`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 5. Philip the apostle

ID: `philip-the-apostle`

**Verdict: accept with fixes.**

Checks: all 11 key-verse references exist; 2/3 story links match. Raw character schema fails as detailed below.

Passages: John 1:43; John 1:44; John 1:45; John 1:46; John 6:5; John 6:7; John 12:21; John 12:22; John 14:8; John 14:9; Acts 1:13.

### Findings and required changes

Keep Philip the apostle distinct from Philip the evangelist. Remove the held Last Supper Discourse story link while retaining the John verse anchors.

Observed validator error: `Character philip-the-apostle: broken story john-the-last-supper-discourse`.

- Remove story link `john-the-last-supper-discourse`. It is absent from the current catalog. Keep the verse anchors; do not publish a held story to repair this link.

- Add an explicit reference binding for `philip-the-apostle` to `sourceRecord: philip_2344`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

- KJV quotation `Come and see` matches John 1:39; John 1:46.

### Writing fixes

- `summary`: split screened sentence(s) 2 (27 words; starts `He finds Nathanael and says they have found the one of whom Moses and the prophets wrote; to Nathana`); 3 (23 words; starts `Before the feeding of the multitude Jesus asks him where to buy bread and he answers that two hundre`); 5 (23 words; starts `At the last supper he asks to be shown the Father, and Jesus answers that whoever has seen him has s`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 6. Nathanael

ID: `nathanael`

**Verdict: accept with fixes.**

Checks: all 6 key-verse references exist; 2/2 story links match. Raw character schema passes.

Passages: John 1:45; John 1:46; John 1:47; John 1:48; John 1:49; John 21:2.

### Findings and required changes

Do not identify Nathanael with Bartholomew as fact. Remove the unsourced claim about when that suggestion arose; say the cited passages do not make the identification. Preserve John's wording and settings.

Reference identity: one exact-name row, `nathanael_2158`. Keep the profile’s stated family limits.

- KJV quotation `Rabbi, thou art the Son of God; thou art the King of Israel.` matches John 1:49.
- KJV quotation `of Cana in Galilee` matches John 21:2.

### Writing fixes

- `summary`: split screened sentence(s) 2 (36 words; starts `He asks whether any good thing can come out of Nazareth, then is greeted by Jesus as an Israelite in`); 4 (21 words; starts `He appears again only in John 21:2, called 'of Cana in Galilee', among the disciples at the Sea of T`); 5 (28 words; starts `The Gospel never calls him an apostle and never gives him another name; equating him with Bartholome`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 7. Herod Antipas

ID: `herod-antipas`

**Verdict: accept with fixes.**

Checks: all 13 key-verse references exist; 1/1 story links match. Raw character schema passes.

Passages: Luke 3:1; Luke 3:19; Luke 3:20; Matthew 14:1; Matthew 14:3; Matthew 14:9; Matthew 14:10; Mark 6:20; Luke 13:31; Luke 13:32; Luke 23:8; Luke 23:11; Luke 23:12.

### Findings and required changes

Keep the Herod identified as tetrarch distinct from Herod the king and Agrippa. Treat Antipas as a conventional historical label requiring a source, not a KJV quote. Do not conflate the named Philip with an apostle.

Reference identity: one exact-name row, `herod_1505`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 2 (54 words; starts `John the Baptist rebukes him for taking Herodias, his brother Philip's wife, and he shuts John in pr`); 5 (37 words; starts `At the trial Pilate sends Jesus to him; Herod is glad, questions him at length, gets no answer, mock`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 8. Herodias

ID: `herodias`

**Verdict: accept with fixes.**

Checks: all 8 key-verse references exist; 1/1 story links match. Raw character schema passes.

Passages: Luke 3:19; Matthew 14:3; Matthew 14:6; Matthew 14:8; Mark 6:17; Mark 6:19; Mark 6:24; Mark 6:28.

### Findings and required changes

Keep the daughter unnamed in this profile; do not add Salome from an uncited external source. Preserve the family wording in the Gospel passages without importing a fuller dynasty.

Reference identity: one exact-name row, `herodias_1507`. Keep the profile’s stated family limits.

- KJV quotation `the daughter of Herodias` matches Matthew 14:6.

### Writing fixes

- `summary`: split screened sentence(s) 2 (32 words; starts `John the Baptist tells Herod it is not lawful to have her; Mark says she had a quarrel against John `); 3 (40 words; starts `When her daughter dances at Herod's birthday supper and is offered whatever she asks, the daughter g`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 9. Joseph of Arimathaea

ID: `joseph-of-arimathaea`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 2/3 story links match. Raw character schema fails as detailed below.

Passages: Matthew 27:57; Matthew 27:60; Mark 15:43; Mark 15:46; Luke 23:50; Luke 23:51; Luke 23:53; John 19:38; John 19:39; John 19:41.

### Findings and required changes

Keep Joseph of Arimathaea distinct from Jesus's household Joseph and the patriarch. Attribute each burial detail to its Gospel. Correct the Mark trial/crucifixion/burial story title, ID and route.

Observed validator error: `Character joseph-of-arimathaea: broken story mark-trial-crucifixion-and-burial`.

- Replace story `mark-trial-crucifixion-and-burial` with title `Trial, Crucifixion and Burial in Mark`, passage `Mark 14:53 - 15:47`, ID `mark-trial-crucifixion-and-burial-in-mark`, route `#stories/mark/trial-crucifixion-and-burial-in-mark`.

- Add an explicit reference binding for `joseph-of-arimathaea` to `sourceRecord: joseph_1716`. Name-only matching currently finds 0 rows. Check the cited identity and suppress unsupported inherited family edges.

- KJV quotation `secretly for fear of the Jews` matches John 19:38.

### Writing fixes

- `summary`: split screened sentence(s) 1 (42 words; starts `A rich man of Arimathaea, a disciple of Jesus (John adds 'secretly for fear of the Jews'), called an`); 2 (25 words; starts `After the crucifixion he goes boldly to Pilate and asks for the body; Pilate checks with the centuri`); 3 (25 words; starts `He wraps the body in clean linen and lays it in his own new tomb hewn in the rock, rolling a stone t`); 4 (24 words; starts `John says Nicodemus came with about a hundred pound of myrrh and aloes and that they wound the body `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 10. Barabbas

ID: `barabbas`

**Verdict: accept with fixes.**

Checks: all 10 key-verse references exist; 2/3 story links match. Raw character schema fails as detailed below.

Passages: Matthew 27:16; Matthew 27:21; Matthew 27:26; Mark 15:7; Mark 15:11; Mark 15:15; Luke 23:18; Luke 23:19; Luke 23:25; John 18:40.

### Findings and required changes

Keep each Gospel's description of Barabbas attributed to that account. Do not infer conflicting identities from different labels. Correct the Mark trial/crucifixion/burial story title, ID and route.

Observed validator error: `Character barabbas: broken story mark-trial-crucifixion-and-burial`.

- Replace story `mark-trial-crucifixion-and-burial` with title `Trial, Crucifixion and Burial in Mark`, passage `Mark 14:53 - 15:47`, ID `mark-trial-crucifixion-and-burial-in-mark`, route `#stories/mark/trial-crucifixion-and-burial-in-mark`.

Reference identity: one exact-name row, `barabbas_399`. Keep the profile’s stated family limits.

### Writing fixes

- `summary`: split screened sentence(s) 2 (36 words; starts `Mark says he lay bound with those who had made insurrection and had committed murder in it; Luke say`); 3 (29 words; starts `The chief priests move the people to ask for Barabbas and destroy Jesus; Pilate asks what evil Jesus`); 4 (22 words; starts `The Gospels' descriptions of his offence differ in wording (murder in an insurrection, sedition and `). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## 11. Annas

ID: `annas`

**Verdict: accept with fixes.**

Checks: all 5 key-verse references exist; 1/1 story links match. Raw character schema passes.

Passages: Luke 3:2; John 18:13; John 18:19; John 18:24; Acts 4:6.

### Findings and required changes

Keep Annas and Caiaphas distinct. Preserve the limit around the questioner's identity in John 18 instead of settling the pronoun by assumption. Do not infer further children or offices beyond the cited text.

Reference identity: one exact-name row, `annas_269`. Keep the profile’s stated family limits.

- KJV quotation `the high priest` matches Luke 3:2; Luke 22:50; Luke 22:54; John 11:49.

### Writing fixes

- `summary`: split screened sentence(s) 2 (21 words; starts `After the arrest Jesus is led to Annas first, who is father in law to Caiaphas, the high priest that`); 3 (28 words; starts `The high priest questions Jesus about his disciples and doctrine; Jesus answers that he spoke openly`); 5 (26 words; starts `In Acts he is called high priest again when Peter and John are brought before the rulers, with Caiap`); 6 (35 words; starts `John 18:19-24 calls the questioner simply 'the high priest' while naming both men around the passage`). Each prose sentence must have at most 20 words. Preserve quoted text and every limit.

## Batch writing screen

Mean of checked field scores: 10.26. This is a draft diagnostic, not the full app collection score.
The target is grade 6–8 across the collection. Do not make clear prose harder merely to raise a low score.
Sentence numbers use the supplied checker’s prose screen. Scripture and quoted source titles remain exempt.
Shorten prose and explain terms without deleting uncertainty, attribution or scope.
After any later content edit, run `npm run check:readability`; these notes do not change app copy.

## Input fingerprints

- Records SHA-256: `60a8eb8f9c038e3988fce77966b870d2ccfd9ba8ab62a5994e0c3b303e087b59`
- Notes SHA-256: `bc819cb7a1e77288d997ecbe33c7780b1732635fbfbeb773b53db6507276f610`
