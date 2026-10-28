# Image Shortlist For Phase 4

Checked: 2026-10-26. Preparation only; no candidate images were downloaded, saved, or viewed.
This list covers 40 debate candidates and 50 place entries, using 64 distinct source images.
Coverage includes provisional choices and regional fallbacks. It does not mean every image is ready for use.

Use [sourcing rules](sourcing-rules.md), [the flat shortlist](shortlist.csv), and [the licence log template](licence-log-template.csv) together.
Each CSV row contains its subject, source, licence link, credit, fit note, and stable target ID.
The tables below link to shared source entries. Those entries hold full credits and source-page checks.

## Scope And Checks

- Base: fetched `origin/main`, commit `55e438a1071ac8629d5197cbf6c6db9d8346873e`.
- Debate list: `codex/headline-debates`, commit `510b868e82a7c348b1a3336a285fb32401871599`.
- List file: `research/headline-debates/candidates.json`, read through `git show` without checking out that branch.
- The owner's `8-headlines.md` report names 30 recommendations. This shortlist also covers the branch's ten reserves.
- The debate mix is 26 text comparisons, eight science comparisons, and six history comparisons.
- The recommendations contain 16 text comparisons, eight science comparisons, and six history comparisons.
- Existing record IDs and selection labels remain intact. Image choices do not change scholarly findings or status.
- Writing rules were checked at `codex/readability-standard`, commit `8e2cd1b87419d909e9bcc54a7d822fd9052447d5`.
- Sites was not inspected. This local task makes no claim about deployed source or release alignment.

Commons checks used its text API, file-page rights metadata, and page source.
Museum and government checks used text pages. No image URL was fetched, including thumbnails.
Search hits were screened for the wrong subject, later illustrations, copies, and missing rights.
Quoted source titles retain the source's wording. A title is not a new BibleLens claim.
Dimensions come from metadata, not inspection of image files.
All source selections still need a visual check before production.

“Metadata checked” means the file page supplies a licence and creator. It is not a guarantee of the uploader's rights.
“HOLD” marks an unresolved rights claim or target fit. Read both status columns in the CSV.
Other notes identify caption limits, restoration, or size limits without changing the underlying record.
All proposed uses are Context. No photo is offered as proof of an entire biblical account.

## How Places Were Ranked

`data/reference/places.json` has 1,298 entries but no citation-count field.
This list uses unique packaged KJV verses that the app's existing place matcher links to each place ID.
One place gets one count per verse, even when repeated. Longer names match before shorter names.
Aliases resolve through the existing matcher. Ties sort by English name, then stable ID.
Only KJV text is counted; repeated translations, dictionary prose, and research notes are excluded.
The list is the first 50 entries under this metric, not a manually selected set.

This is a count of app-recognised references, not an exhaustive geographical reading of the Bible.
The matcher excludes many names shared by people, tribes, and ordinary words, including bare Israel and Judah.
It can still inherit errors from the source data. Its counts do not confirm a site's identity.
For example, the Bethel alias points to a row with conflicting labels and coordinates.
That row remains visible as HOLD. No dataset corrections were made in this task.

The cutoff is ten verses. Jazer and Zoar rank 49 and 50; Gerar follows with nine.
The CSV preserves rank, count, source verification label, precision label, and place ID.
Source labels such as VERIFIED are inherited data, not fresh archaeological review.

Reproduce the ranking from the worktree root with this read-only code:

```sh
node --input-type=module <<'JS'
import fs from 'node:fs';
import zlib from 'node:zlib';
import {parsePlaces, createPlaceMatcher} from './src/places-core.js';
const places = parsePlaces(JSON.parse(fs.readFileSync('data/reference/places.json')));
const match = createPlaceMatcher(places);
const counts = new Map();
const chapters = JSON.parse(fs.readFileSync('data/chapters.json'));
for (const encoded of Object.values(chapters)) {
  const chapter = JSON.parse(zlib.gunzipSync(Buffer.from(encoded, 'base64')));
  for (const verse of chapter.verses) {
    for (const id of new Set(match(verse.kjv).map(hit => hit.id))) {
      counts.set(id, (counts.get(id) || 0) + 1);
    }
  }
}
const ranked = [...counts].map(([id, count]) => ({id, name: places.get(id).name, count}));
ranked.sort((a, b) => b.count - a.count
  || a.name.localeCompare(b.name, 'en') || a.id.localeCompare(b.id));
console.table(ranked.slice(0, 50).map((row, index) => ({rank: index + 1, ...row})));
JS
```

Input SHA-256 values:

| Input | SHA-256 |
| --- | --- |
| `data/reference/places.json` | `ed7630720176b0f62332c37481eeb908c2752f76c1a12d5ad46ab50ccd97c9dc` |
| `data/chapters.json` | `f91b3b893eaac46035dfc342f520b56f7a5f80879c448f7065d00ec8fad033aa` |
| `src/places-core.js` | `89c880459076a42cdd8907c5ad946f3101f24c3aa98297cd50df8da01a25214c` |

## Licence Mix

Public-domain counts include two claims on HOLD: the Matson mountain photo and the old Hebrew page scan.
CC0 counts include museum images released under the museum's open-access terms.
Counts by target repeat sources where one image serves several possible cards.

| Licence | Distinct sources | Target rows |
| --- | ---: | ---: |
| CC BY 2.0 | 3 | 3 |
| CC BY 2.5 | 1 | 1 |
| CC BY 4.0 | 7 | 10 |
| CC BY-SA 2.0 | 7 | 11 |
| CC BY-SA 3.0 | 11 | 13 |
| CC BY-SA 4.0 | 17 | 29 |
| CC0 1.0 | 10 | 11 |
| Public domain | 8 | 12 |

## Debate Candidates

Numbers 1–30 are the recommended set. Numbers 31–40 retain their reserve status.
The flat CSV carries the full source record IDs and exact selection labels.
A linked image entry supplies the source URL, licence link, and credit for each row.

| No. | Debate | Image subject | Fit And Limit | Review |
| --- | --- | --- | --- | --- |
| 1 | Who killed Goliath: David or Elhanan? | [Elah valley](#img-021) | Elah valley landscape. It cannot identify Goliath’s killer or settle which wording came first. | Candidate |
| 2 | Who prompted David's count: God or Satan? | [Jerusalem from the Mount of Olives](#img-030) | Jerusalem gives setting only. It cannot establish the cause of David’s count. | Candidate |
| 3 | Did Aaron die at Mount Hor or Mosera? | [Jebel Harun mountain](#img-028) | Jebel Harun offers a proposed mountain setting. This photograph cannot choose between Mount Hor and Mosera. | HOLD. Site identification needs review; retain the record’s unresolved location. |
| 4 | Did Solomon have 4,000 or 40,000 horse stalls? | [Buildings called stables at Megiddo](#img-009) | Buildings called stables offer context. Do not assign them to Solomon or use them to verify either number. | HOLD. Check the building label and date before a final caption. |
| 5 | Was Ahaziah 22 or 42 when he became king? | [Jerusalem from the Mount of Olives](#img-030) | Modern Jerusalem offers setting only. It cannot establish Ahaziah’s age or the earliest number in the text. | Candidate |
| 6 | Was David the seventh or eighth son? | [Modern Bethlehem panorama](#img-037) | Modern Bethlehem offers broad setting only. It cannot establish Jesse’s family list. | Candidate |
| 7 | Was the priest Ahimelech or Abiathar? | [Decorated page in an old Hebrew Bible](#img-017) | An old Hebrew book gives text context. This page does not identify the priest or resolve Mark’s wording. | HOLD. No disputed verse has been verified on this page; use only as book context. |
| 8 | Did God regret making Saul king? | [Decorated page in an old Hebrew Bible](#img-017) | An old Hebrew book gives text context. Its decoration cannot decide whether the passages use regret in different senses. | HOLD. No disputed verse has been verified on this page; use only as book context. |
| 9 | Did the 430 years cover Egypt alone? | [Nile near Luxor](#img-043) | The Nile gives Egyptian context. It cannot establish the length or starting point of the 430 years. | Candidate |
| 10 | Did Moses leave Egypt in fear? | [Nile near Luxor](#img-043) | The Nile gives Egyptian context. It cannot establish Moses’s motives or which departure Hebrews means. | Candidate |
| 11 | Did the ark hold only the stone tablets? | [Jerusalem from the Mount of Olives](#img-030) | Jerusalem gives temple context only. No pictured object is the ark, and no contents are shown. | Candidate |
| 12 | Do the return lists add up to 42,360? | [Jerusalem from the Mount of Olives](#img-030) | Jerusalem gives a destination context. The photograph cannot count the returned people or explain the lists’ totals. | Candidate |
| 13 | Are altar steps banned or required? | [Jerusalem from the Mount of Olives](#img-030) | A city view gives setting only. Do not identify visible steps as the altar described in either passage. | Candidate |
| 14 | Are locusts allowed as food or banned? | [Desert locust specimen](#img-018) | A modern locust specimen gives animal context. Do not identify it as the precise kind named by either law. | Candidate. The source describes a stacked photograph; retain that detail in Sources. |
| 15 | Was Jesus entering or leaving Jericho? | [Jericho viewed from Tell es-Sultan](#img-029) | Tell es-Sultan gives place context. It cannot settle travel direction or prove that different city boundaries explain the accounts. | HOLD. Review ancient and later city limits before any location-specific caption. |
| 16 | Does God need rest or never grow tired? | [Decorated page in an old Hebrew Bible](#img-017) | An old Hebrew book gives text context. Its decoration cannot decide whether refreshment describes fatigue or a figure of speech. | HOLD. No disputed verse has been verified on this page; use only as book context. |
| 17 | Did plants appear before the Sun? | [Sun observed at an ultraviolet wavelength](#img-056) | A solar observation gives science context. It cannot settle Genesis’s meaning or test an unspecified miracle. | Candidate. Colours show measured wavelengths; they are not the Sun’s appearance to human eyes. |
| 18 | Does the poem describe a motionless Earth? | [Earth photographed by Apollo 17](#img-019) | Earth from space gives science context. A still photo cannot establish motion or decide how a poem should be read. | Candidate |
| 19 | Is the sky a solid roof or layers of gas? | [Moon above Earth’s atmosphere](#img-041) | A photographed horizon gives atmosphere context. It cannot settle the disputed meaning of the sky passage. | Candidate |
| 20 | Does a delayed sunset fit Earth’s normal spin? | [Earth photographed by Apollo 17](#img-019) | Earth from space gives science context. It does not show stopped rotation or reconstruct the battle. | Candidate |
| 21 | Did birds come before land animals? | [Original Berlin Archaeopteryx fossil](#img-044) | The source identifies an original fossil. The photograph alone cannot establish the sequence of animals in Genesis. | Candidate |
| 22 | Does a recent worldwide flood fit the evidence? | [Rock layers at the Grand Canyon](#img-051) | Rock layers give geological context. This photo alone cannot test a worldwide flood or an unspecified miracle. | Candidate |
| 23 | Is Earth thousands or billions of years old? | [Earth photographed by Apollo 17](#img-019) | Earth from space gives science context. This image supplies no age measurement or creation date. | Candidate |
| 24 | Can seeing striped rods shape a lamb’s coat? | [Modern Jacob sheep](#img-039) | Modern patterned sheep give animal context. Do not label them as Jacob’s flock or proof that rods change inherited coats. | Candidate |
| 25 | Does Quirinius’s census fit a birth under Herod? | [Coin of Augustus](#img-011) | A coin of Augustus gives Roman context. It cannot date the census or resolve the birth chronology. | Candidate |
| 26 | Does Herod’s rule confirm the whole birth story? | [Coin of Herod the Great](#img-013) | A coin gives context for Herod’s rule. It cannot establish the birth story or the visit of the magi. | Candidate |
| 27 | Does a new ruler prove the family’s journey? | [Coin of Herod Archelaus](#img-012) | A coin gives context for Archelaus. It cannot verify the family’s journey or replace the record’s limit on his title. | Candidate |
| 28 | Does Pilate’s record confirm every detail in Luke? | [Pilate inscription](#img-046) | The inscription offers limited context for Pilate’s office. It cannot verify every official, title, or date in Luke. | HOLD. Verify the pictured original and letters before quoting any reading. |
| 29 | Does the census revolt record prove its ending? | [Galilee landscape near Tiberias](#img-023) | The Galilee landscape gives regional context. It cannot verify the revolt leader’s death or the followers’ dispersal. | Candidate |
| 30 | Do Assyrian records prove the whole campaign account? | [Lachish relief in the British Museum](#img-033) | An ancient relief depicts the campaign. It cannot verify every speech, payment, or supernatural claim in Kings. | Candidate. Retain the relief’s role as an ancient royal portrayal. |
| 31 | Does Judas’s end involve hanging or a fall? | [Jerusalem from the Mount of Olives](#img-030) | Jerusalem gives setting only. The view cannot show how Judas died or prove the accounts conflict. | Candidate |
| 32 | Was it dark or light at the tomb? | [Tombs of Benei Hezir and Zechariah](#img-062) | A real tomb gives burial context. It is not presented as Jesus’s tomb and cannot establish the visit’s timing. | Candidate |
| 33 | Was Joseph’s father Jacob or Heli? | [Modern Bethlehem panorama](#img-037) | Modern Bethlehem gives broad setting only. The view cannot identify Joseph’s father or resolve the family lists. | Candidate |
| 34 | Were animals formed before or after the man? | [Modern Jacob sheep](#img-039) | Modern animals give subject context. The image cannot establish the order meant by the two creation passages. | Candidate |
| 35 | Was David offered three or seven years of famine? | [Wheat fields near Givat Brenner](#img-064) | A modern grain field gives food context. It cannot establish a famine’s length or the earliest wording. | Candidate |
| 36 | Did David pay in silver or gold? | [Later silver coin from Tyre](#img-034) | A later coin gives money context only. It cannot establish David’s payment, its unit, or the property’s extent. | Candidate. The coin is much later than the setting; never depict it as David’s payment. |
| 37 | Did Michal bear five sons or raise them? | [Jerusalem from the Mount of Olives](#img-030) | Jerusalem gives setting only. The view cannot establish Michal’s children or explain the name in the text. | Candidate |
| 38 | Did Noah board before the flood or that day? | [Rock layers at the Grand Canyon](#img-051) | A landscape offers earth context only. It cannot date boarding or confirm that the narrative describes a historical flood. | Candidate |
| 39 | Who laid the foundation: Sheshbazzar or Zerubbabel? | [Jerusalem from the Mount of Olives](#img-030) | Jerusalem gives setting only. It cannot identify who laid the foundation or resolve the two names. | Candidate |
| 40 | Do the dead stay inactive or wake again? | [Tombs of Benei Hezir and Zechariah](#img-062) | A real tomb gives burial context. It cannot test an afterlife or decide the meaning of either text. | Candidate |

## Fifty Most-Referenced Places

Ranks follow the KJV matcher metric above. Regional fallbacks are marked clearly and retain the place's own ID.

| Rank | Place | Verses | Image subject | Fit And Limit | Review |
| --- | --- | ---: | --- | --- | --- |
| 1 | Jerusalem | 773 | [Jerusalem from the Mount of Olives](#img-030) | Modern city panorama; keep later buildings distinct from the periods discussed. | Candidate |
| 2 | Egypt | 558 | [Nile near Luxor](#img-043) | The Nile near Luxor gives regional context. It does not show all of ancient Egypt. | Candidate |
| 3 | Babylon | 264 | [Ruins of Babylon](#img-054) | Present-day ruins offer site context. Label restoration before calling any visible wall ancient. | Candidate. Check which visible features are restored before a final caption. |
| 4 | Jordan | 179 | [Jordan River](#img-031) | A photographed stretch of river gives context. It does not identify a biblical crossing point. | Candidate |
| 5 | Mount Zion | 135 | [Jerusalem from the Mount of Olives](#img-030) | Jerusalem panorama offers broad context for Zion. Do not label a particular hill from this image. | HOLD. The dataset’s southeast-hill description differs from modern Mount Zion usage. |
| 6 | Samaria | 115 | [Ruins at Sebastia](#img-053) | Ruins at Sebastia offer site context. Do not assign every visible structure to the Israelite kingdom. | Candidate. Check the period of visible remains before a final caption. |
| 7 | Assyria | 108 | [Assyrian winged bull statue from Nimrud](#img-006) | An Assyrian museum object offers regional context. Its carved creature is an ancient design, not a real animal. | Candidate |
| 8 | Syria | 71 | [Modern Damascus panorama](#img-038) | Modern Damascus gives regional context. Its modern boundaries do not define ancient Syria. | Candidate |
| 9 | Galilee | 66 | [Galilee landscape near Tiberias](#img-023) | A landscape near Tiberias gives regional context. It does not settle the region’s ancient boundaries. | HOLD. The dataset marks this region NOT_IDENTIFIABLE; use only a broad regional label. |
| 10 | Bethel (of Judah) | 59 | [Burj Beitin ruins](#img-010) | Beitin is a possible research lead only. Do not label this image as the dataset’s Bethel of Judah. | HOLD. HOLD: the row’s name, description, and coordinates conflict; alias counts do not resolve which Bethel is meant. |
| 11 | Jericho | 58 | [Jericho viewed from Tell es-Sultan](#img-029) | Tell es-Sultan gives site context. The view does not date a destruction layer or verify Joshua’s account. | Candidate |
| 12 | Damascus | 55 | [Modern Damascus panorama](#img-038) | Modern Damascus gives city context. Later buildings cannot establish an ancient event. | Candidate |
| 13 | Bashan | 52 | [Golan landscape](#img-026) | Golan landscape gives broad regional context. It does not establish the limits of Bashan. | HOLD. The dataset marks Bashan NOT_IDENTIFIABLE; keep this as regional context. |
| 14 | Sodom | 47 | [Dead Sea shore](#img-016) | Dead Sea shore gives regional context only. It does not locate Sodom or verify its destruction. | HOLD. No exact site is established; approve a regional image or leave the card without one. |
| 15 | Heshbon | 37 | [Column at Tell Hesban](#img-014) | Tell Hesban offers site context. The visible structure cannot establish the events described in a biblical account. | Candidate. Check the period of the photographed column before a final caption. |
| 16 | Tyre | 36 | [Arch at Tyre](#img-003) | Ruins at Tyre give city context. State their period before linking them to a specific text. | Candidate. Check the arch’s period and restored portions before a final caption. |
| 17 | Mount Sinai | 34 | [Sunrise from Jebel Musa](#img-057) | Jebel Musa offers a traditional mountain setting. The photograph does not establish where the law was given. | HOLD. Traditional identification must remain explicit; the dataset’s VERIFIED label is not a new scholarly finding. |
| 18 | Beersheba | 33 | [Residential remains at Tel Beer Sheva](#img-050) | Excavated remains give site context. Do not identify a structure with a named person’s home. | Candidate |
| 19 | Hamath | 32 | [Orontes River at Hama](#img-045) | The Orontes at Hama gives place context. Modern buildings do not depict ancient Hamath. | Candidate |
| 20 | Gath | 30 | [Tel Zafit site view](#img-059) | Tel Zafit gives a proposed site view. It cannot verify the narratives about Gath or Goliath. | HOLD. The dataset marks Gath NOT_IDENTIFIABLE; confirm the site label before use. |
| 21 | Nazareth | 29 | [Archival Nazareth panorama](#img-005) | An archival town view gives place context. The photographed buildings do not show first-century Nazareth. | Candidate |
| 22 | Red Sea | 28 | [Red Sea coast at Makadi Bay](#img-049) | A modern coast gives regional context. Do not identify this bay as a crossing site. | Candidate |
| 23 | Persia | 25 | [Apadana and Tachara ruins at Persepolis](#img-002) | Persepolis remains give regional context. They do not define every period or boundary called Persia. | HOLD. The dataset marks Persia NOT_IDENTIFIABLE; use a named site within a broad region. |
| 24 | Macedonia | 23 | [Ruins at Philippi](#img-052) | Ruins at Philippi offer regional context. Do not describe every structure as standing during Paul’s visits. | Candidate. Check the visible structure’s period before a final caption. |
| 25 | Lachish | 22 | [Siege ramp at Tel Lachish](#img-055) | The site photograph gives context for Lachish. It cannot establish all details of the campaign accounts. | Candidate |
| 26 | Arnon | 21 | [Wadi Mujib](#img-063) | Wadi Mujib gives river-valley context. The view does not establish ancient borders or travel routes. | Candidate |
| 27 | Carmel | 21 | [Al-Karmil from the east](#img-001) | Al-Karmil offers context for Carmel town. This is not a photograph of Mount Carmel. | HOLD. The matcher separates Mount Carmel, but bare-name citations may still need review. |
| 28 | Euphrates | 21 | [Euphrates and Lake Assad from orbit](#img-022) | The river and a modern reservoir give geographical context. They do not show the ancient river course. | Candidate. Source is 1041 × 694 pixels; suitable for cards, not a large detail view. |
| 29 | Asia | 20 | [Column from the Temple of Artemis at Sardis](#img-015) | A column from Sardis gives regional context. The museum display includes restored parts and a copied base. | Candidate. Label the restored display; Asia here is the ancient region, not the whole modern continent. |
| 30 | Cush | 20 | [Pyramids at Meroe](#img-047) | Meroe offers regional context. Its monuments do not establish every biblical use of the name Cush. | HOLD. The dataset marks Cush NOT_IDENTIFIABLE; the image cannot resolve the name’s full geographical range. |
| 31 | Ekron | 20 | [Ekron inscription](#img-020) | The Ekron inscription gives object context. Do not translate letters or infer events from the photograph alone. | Candidate. Verify the object label and any proposed reading before a final caption. |
| 32 | Ashdod | 19 | [Bone combs from Tel Ashdod](#img-008) | Combs attributed to Tel Ashdod give object context. Do not infer a biblical event from them. | Candidate. Confirm the objects’ collection details and date before a final caption. |
| 33 | Gomorrah | 19 | [Dead Sea shore](#img-016) | Dead Sea shore gives regional context only. It does not locate Gomorrah or verify its destruction. | HOLD. No exact site is established; approve a regional image or leave the card without one. |
| 34 | Gaza | 18 | [Gaza port](#img-024) | An archival port photo gives modern coastal context. It does not show ancient Gaza or its present condition. | Candidate. Use the source photo date; do not describe the scene as current. |
| 35 | Ephesus | 17 | [Library of Celsus facade](#img-035) | The library remains give city context. Do not present this restored facade as a scene from Paul’s visits. | Candidate. Check the building date and restoration label before a final caption. |
| 36 | Nineveh | 17 | [Reconstructed Mashki Gate at Nineveh](#img-048) | The photographed gate includes reconstruction. Use it for site context, not as an untouched ancient structure. | Candidate. Retain the photo date; check the photographed reconstruction and later site changes. |
| 37 | Capernaum | 16 | [Synagogue ruins at Capernaum](#img-058) | Synagogue remains give site context. Do not identify the visible building as the one in a Gospel account. | Candidate. Confirm the visible remains’ date before a final caption. |
| 38 | Keilah | 16 | [Al-Karmil from the east](#img-001) | Nearby hill country offers regional context only. This view of Al-Karmil does not show Keilah itself. | HOLD. Exact-site image remains unresolved; the dataset marks Keilah NOT_IDENTIFIABLE. |
| 39 | Caesarea | 15 | [Theatre at Caesarea](#img-061) | The theatre gives city context. Do not link a photographed seat or stage to a named event. | Candidate. Label rebuilt portions before a final caption. |
| 40 | Gezer | 14 | [Archaeological remains at Tel Gezer](#img-004) | Excavated remains offer site context. They do not independently establish a named biblical event. | Candidate |
| 41 | Joppa | 13 | [Modern Jaffa harbour](#img-040) | Modern Jaffa harbour gives coastal context. It does not reconstruct the port in a biblical account. | Candidate |
| 42 | Mahanaim | 13 | [Jabbok river view](#img-027) | The Jabbok river area gives regional context. This view does not locate Mahanaim. | HOLD. Exact site remains unresolved; the dataset gives only a rough location. |
| 43 | Ashtaroth | 12 | [Golan landscape](#img-026) | A broad regional landscape offers a fallback. It does not show the proposed Tell Ashtara site. | HOLD. A direct site photo remains unresolved; do not infer certainty from the dataset’s VERIFIED label. |
| 44 | Megiddo | 12 | [Buildings called stables at Megiddo](#img-009) | Excavated buildings give site context. Do not assign the buildings or their use to a particular ruler without review. | Candidate. Check the buildings’ date and the source’s cautious “so-called stables” label. |
| 45 | Ziklag | 12 | [Khirbet ar-Rai site](#img-032) | Khirbet ar-Rai is a proposed location. The photograph cannot settle the identification of Ziklag. | HOLD. Approve only a clearly marked candidate-site caption; the dataset’s location must be reconciled. |
| 46 | Achaia | 11 | [Temple of Apollo at Corinth](#img-060) | Corinth’s temple gives regional context. One site does not define all of ancient Achaia. | Candidate |
| 47 | Michmash | 11 | [Mosque in modern Mukhmas](#img-042) | The mosque gives modern village context. Do not present it as a building from the biblical accounts. | Candidate. The photo is modern; a landscape without a prominent later building may fit better. |
| 48 | Zobah | 11 | [Beqaa Valley and surrounding region from orbit](#img-007) | An orbital view gives broad regional context. It does not identify Zobah or establish its borders. | HOLD. The dataset marks Zobah NOT_IDENTIFIABLE; approve only a broad regional label. |
| 49 | Jazer | 10 | [Modern Amman landscape](#img-036) | The Amman area gives regional context. This city view does not identify Jazer. | HOLD. Exact-site image remains unresolved; the dataset marks Jazer NOT_IDENTIFIABLE. |
| 50 | Zoar | 10 | [Ghor es-Safi landscape](#img-025) | Ghor es-Safi gives regional context. The landscape does not establish the location of Zoar. | HOLD. The dataset’s historical description names another proposed site; reconcile before a specific-site caption. |

## Shared Source Catalogue

These are links to source pages, not embedded images or image-download links.
Credits describe source candidates. Add crop and format changes to final credits after later processing.
Each Commons revision link records the checked description page; it does not freeze later changes to the image file.
Creator and collection links remain separate so they can be used in final credits.

<a id="img-001"></a>

### IMG-001 — Al-Karmil from the east

- Source: [Al-Karmil0239.JPG](<https://commons.wikimedia.org/wiki/File:Al-Karmil0239.JPG>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1036198060); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Al-Karmil0239.JPG#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [עדירל](<https://commons.wikimedia.org/w/index.php?title=User:%D7%A2%D7%93%D7%99%D7%A8%D7%9C&action=edit&redlink=1>).
- Credit: “Al-Karmil0239.JPG” — עדירל; Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2015-03-06 09:53:30.
- Source size: 4608 × 2343 pixels.

<a id="img-002"></a>

### IMG-002 — Apadana and Tachara ruins at Persepolis

- Source: [Ruins of Apadana and Tachara in Persepolis.jpg](<https://commons.wikimedia.org/wiki/File:Ruins_of_Apadana_and_Tachara_in_Persepolis.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1181860633); 2026-10-26.
- Licence: [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Ruins_of_Apadana_and_Tachara_in_Persepolis.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Carole Raddato](<https://www.flickr.com/photos/carolemage>).
- Credit: “Ruins of Apadana and Tachara in Persepolis.jpg” — Carole Raddato; Wikimedia Commons; CC BY-SA 2.0; source candidate, no edits made.
- Source date: 22 April 2019, 08:24:46 (according to Exif data).
- Source size: 4928 × 3264 pixels.

<a id="img-003"></a>

### IMG-003 — Arch at Tyre

- Source: [Tyre Ruins-Triumph arch way.jpg](<https://commons.wikimedia.org/wiki/File:Tyre_Ruins-Triumph_arch_way.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1210966243); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Tyre_Ruins-Triumph_arch_way.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Oussama Tahmaz](<https://commons.wikimedia.org/w/index.php?title=User:Oussama_Tahmaz&action=edit&redlink=1>).
- Credit: “Tyre Ruins-Triumph arch way.jpg” — Oussama Tahmaz; Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2023-04-23 17:24:56.
- Source size: 2604 × 4624 pixels.

<a id="img-004"></a>

### IMG-004 — Archaeological remains at Tel Gezer

- Source: [Tel Gezer - Archaeological Ruin.jpg](<https://commons.wikimedia.org/wiki/File:Tel_Gezer_-_Archaeological_Ruin.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1277621564); 2026-10-26.
- Licence: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Tel_Gezer_-_Archaeological_Ruin.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Davidbena](<https://commons.wikimedia.org/wiki/User:Davidbena>).
- Credit: “Tel Gezer - Archaeological Ruin.jpg” — Davidbena; Wikimedia Commons; CC0 1.0; source candidate, no edits made.
- Source date: 2024-03-10.
- Source size: 3648 × 2432 pixels.

<a id="img-005"></a>

### IMG-005 — Archival Nazareth panorama

- Source: [Nazareth Panorama, Bestanddeelnr 255-3223.jpg](<https://commons.wikimedia.org/wiki/File:Nazareth_Panorama,_Bestanddeelnr_255-3223.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=972419097); 2026-10-26.
- Licence: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Nazareth_Panorama,_Bestanddeelnr_255-3223.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Credit: “Nazareth Panorama, Bestanddeelnr 255-3223” — Willem van de Poll / Nationaal Archief; collection 2.24.14.02; CC0 1.0; no edits made.
- Source date: Unknown date.
- Source size: 2626 × 2643 pixels.

<a id="img-006"></a>

### IMG-006 — Assyrian winged bull statue from Nimrud

- Source: [Human-headed winged bull (lamassu)](<https://www.metmuseum.org/art/collection/search/322608>).
- Checked page: museum item and policy; 2026-10-26.
- Licence: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/); Metadata checked.
- Rights evidence: [source terms](https://www.metmuseum.org/policies/image-resources). The item page marks the image Public Domain. The museum’s open-access policy supplies CC0 terms.
- Creator or collection: [The Metropolitan Museum of Art; ancient maker unnamed](<https://www.metmuseum.org/>).
- Credit: “Human-headed winged bull (lamassu)” — The Metropolitan Museum of Art; Gift of John D. Rockefeller Jr., 1932; 32.143.1; CC0 1.0; source candidate, no edits made.
- Source size: not confirmed from metadata.

<a id="img-007"></a>

### IMG-007 — Beqaa Valley and surrounding region from orbit

- Source: [ISS061-E-21946 - View of Lebanon - Beqaa Valley - Bar Elias (Barelias) - Baalbek - Sargaja - Al-Zabadani Plain - Northern parts of Anti-Lebanon mountain range - Damascus (cropped).jpg](<https://commons.wikimedia.org/wiki/File:ISS061-E-21946_-_View_of_Lebanon_-_Beqaa_Valley_-_Bar_Elias_(Barelias)_-_Baalbek_-_Sargaja_-_Al-Zabadani_Plain_-_Northern_parts_of_Anti-Lebanon_mountain_range_-_Damascus_(cropped).jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1258793867); 2026-10-26.
- Licence: [Public domain](https://commons.wikimedia.org/wiki/File:ISS061-E-21946_-_View_of_Lebanon_-_Beqaa_Valley_-_Bar_Elias_(Barelias)_-_Baalbek_-_Sargaja_-_Al-Zabadani_Plain_-_Northern_parts_of_Anti-Lebanon_mountain_range_-_Damascus_(cropped).jpg#Licensing); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:ISS061-E-21946_-_View_of_Lebanon_-_Beqaa_Valley_-_Bar_Elias_(Barelias)_-_Baalbek_-_Sargaja_-_Al-Zabadani_Plain_-_Northern_parts_of_Anti-Lebanon_mountain_range_-_Damascus_(cropped).jpg#Licensing). PD-USGov-NASA: Commons identifies a NASA work. Keep NASA credit and check any third-party notices before use.
- Additional source: [collection, source, or policy](https://www.nasa.gov/nasa-brand-center/images-and-media/).
- Creator or collection: [Earth Science and Remote Sensing Unit, NASA Johnson Space Center](<https://commons.wikimedia.org/wiki/NASA>).
- Credit: “ISS061-E-21946 - View of Lebanon - Beqaa Valley - Bar Elias (Barelias) - Baalbek - Sargaja - Al-Zabadani Plain - Northern parts of Anti-Lebanon mountain range - Damascus (cropped).jpg” — Earth Science and Remote Sensing Unit, NASA Johnson Space Center; Wikimedia Commons; Public domain; source candidate, no edits made.
- Source date: 2019-10-30 08:10:19.
- Source size: 4709 × 2367 pixels.

<a id="img-008"></a>

### IMG-008 — Bone combs from Tel Ashdod

- Source: [Ancient Bone Combs from Tel Ashdod.jpg](<https://commons.wikimedia.org/wiki/File:Ancient_Bone_Combs_from_Tel_Ashdod.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1285738420); 2026-10-26.
- Licence: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Ancient_Bone_Combs_from_Tel_Ashdod.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [שועל .](<https://he.wikipedia.org/wiki/%D7%9E%D7%A9%D7%AA%D7%9E%D7%A9:%D7%A9%D7%95%D7%A2%D7%9C>).
- Credit: “Ancient Bone Combs from Tel Ashdod.jpg” — שועל .; Wikimedia Commons; CC BY-SA 3.0; source candidate, no edits made.
- Source date: 2012-12-16.
- Source size: 2624 × 2448 pixels.

<a id="img-009"></a>

### IMG-009 — Buildings called stables at Megiddo

- Source: [The So-Called Stables at Megiddo (20531412300).jpg](<https://commons.wikimedia.org/wiki/File:The_So-Called_Stables_at_Megiddo_(20531412300).jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1184490439); 2026-10-26.
- Licence: [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:The_So-Called_Stables_at_Megiddo_(20531412300).jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Ian Scott](<https://www.flickr.com/people/38000818@N06>).
- Credit: “The So-Called Stables at Megiddo (20531412300).jpg” — Ian Scott; Wikimedia Commons; CC BY-SA 2.0; source candidate, no edits made.
- Source date: 2011-06-03 03:57.
- Source size: 4000 × 3000 pixels.

<a id="img-010"></a>

### IMG-010 — Burj Beitin ruins

- Source: [Beitin-1805.jpg](<https://commons.wikimedia.org/wiki/File:Beitin-1805.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=822033982); 2026-10-26.
- Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Beitin-1805.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Bukvoed](<https://commons.wikimedia.org/wiki/User:Bukvoed>).
- Credit: “Beitin-1805.jpg” — Bukvoed; Wikimedia Commons; CC BY 4.0; source candidate, no edits made.
- Source date: 2018-11-10 16:18:05.
- Source size: 3555 × 2336 pixels.

<a id="img-011"></a>

### IMG-011 — Coin of Augustus

- Source: [Roman coin, Denarius of Augustus (obverse) (FindID 711401).jpg](<https://commons.wikimedia.org/wiki/File:Roman_coin,_Denarius_of_Augustus_(obverse)_(FindID_711401).jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1037946243); 2026-10-26.
- Licence: [CC BY 2.0](https://creativecommons.org/licenses/by/2.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Roman_coin,_Denarius_of_Augustus_(obverse)_(FindID_711401).jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Credit: “Roman coin, Denarius of Augustus (obverse) (FindID 711401).jpg” — Oxfordshire County Council, Anni Byard, 2015-03-17 14:37:49; Wikimedia Commons; CC BY 2.0; source candidate, no edits made.
- Source date: Pre AD 41.
- Source size: 1600 × 1200 pixels.

<a id="img-012"></a>

### IMG-012 — Coin of Herod Archelaus

- Source: [Herod Archelaus.jpg](<https://commons.wikimedia.org/wiki/File:Herod_Archelaus.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=853653330); 2026-10-26.
- Licence: [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Herod_Archelaus.jpg#Licensing). File page offers CC BY-SA 3.0. Retain the CNG name and website required by its credit template.
- Creator or collection: [Classical Numismatic Group, Inc.](<http://www.cngcoins.com>).
- Credit: “Herod Archelaus.jpg” — Classical Numismatic Group, Inc., http://www.cngcoins.com; Wikimedia Commons; CC BY-SA 3.0; no edits made.
- Source size: 500 × 243 pixels.
- Size limit: below the 640-pixel card target. Keep native size or find a larger licensed source.

<a id="img-013"></a>

### IMG-013 — Coin of Herod the Great

- Source: [Herod coin.jpg](<https://commons.wikimedia.org/wiki/File:Herod_coin.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1103004160); 2026-10-26.
- Licence: [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Herod_coin.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Ingsoc](<https://commons.wikimedia.org/wiki/User:%D7%A1%D7%95%D7%A6%D7%90%D7%A0%D7%92>).
- Credit: “Herod coin.jpg” — Ingsoc; Wikimedia Commons; CC BY-SA 3.0; source candidate, no edits made.
- Source date: 5/6/07.
- Source size: 1173 × 603 pixels.
- Size limit: suitable for a small card; do not enlarge for the detail target.

<a id="img-014"></a>

### IMG-014 — Column at Tell Hesban

- Source: [Tell Hesban (Column).jpg](<https://commons.wikimedia.org/wiki/File:Tell_Hesban_(Column).jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1009965297); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Tell_Hesban_(Column).jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Bashar Tabbah](<https://mapandlens.com>).
- Credit: “Tell Hesban (Column).jpg” — Bashar Tabbah; Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 8 March 2013, 17:32.
- Source size: 2500 × 1667 pixels.

<a id="img-015"></a>

### IMG-015 — Column from the Temple of Artemis at Sardis

- Source: [Marble column from the Temple of Artemis at Sardis MET DP144130.jpg](<https://commons.wikimedia.org/wiki/File:Marble_column_from_the_Temple_of_Artemis_at_Sardis_MET_DP144130.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1201192610); 2026-10-26.
- Licence: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Marble_column_from_the_Temple_of_Artemis_at_Sardis_MET_DP144130.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Additional source: [collection, source, or policy](https://www.metmuseum.org/art/collection/search/252453).
- Credit: “Marble column from the Temple of Artemis at Sardis MET DP144130.jpg” — The Metropolitan Museum of Art; Gift of The American Society for the Excavation of Sardis, 1926; 26.59.1; CC0 1.0; source candidate, no edits made.
- Source date: circa 300 B.C..
- Source size: 3738 × 3790 pixels.

<a id="img-016"></a>

### IMG-016 — Dead Sea shore

- Source: [Israel Dead Sea shore (4264506785).jpg](<https://commons.wikimedia.org/wiki/File:Israel_Dead_Sea_shore_(4264506785).jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1208532142); 2026-10-26.
- Licence: [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Israel_Dead_Sea_shore_(4264506785).jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Marc Tarlock from San Francisco](<https://www.flickr.com/people/21503112@N07>).
- Credit: “Israel Dead Sea shore (4264506785).jpg” — Marc Tarlock from San Francisco; Wikimedia Commons; CC BY-SA 2.0; source candidate, no edits made.
- Source date: 2010-01-01 13:03.
- Source size: 4040 × 2753 pixels.

<a id="img-017"></a>

### IMG-017 — Decorated page in an old Hebrew Bible

- Source: [Leningrad Codex Carpet Page closeup.jpg](<https://commons.wikimedia.org/wiki/File:Leningrad_Codex_Carpet_Page_closeup.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1051384095); 2026-10-26.
- Licence: [Public domain](https://commons.wikimedia.org/wiki/File:Leningrad_Codex_Carpet_Page_closeup.jpg#Licensing); HOLD.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Leningrad_Codex_Carpet_Page_closeup.jpg#Licensing). HOLD: Commons labels the ancient page PD-old-70. Confirm the scan’s reuse basis and country limits before production.
- Additional source: [collection, source, or policy](https://dornsife.usc.edu/wsrp/the-leningrad-codex-folio-474a-illuminated-carpet-page/).
- Credit: “Leningrad Codex Carpet Page closeup” — ancient maker unnamed; scan by USC Dornsife, via Wikimedia Commons; public-domain claim pending review; no edits made.
- Source date: 1008.
- Source size: 1280 × 1280 pixels.
- Size limit: suitable for a small card; do not enlarge for the detail target.

<a id="img-018"></a>

### IMG-018 — Desert locust specimen

- Source: [Desert locust - Wüstenheuschrecke - Criquet pèlerin - Schistocerca gregaria.jpg](<https://commons.wikimedia.org/wiki/File:Desert_locust_-_W%C3%BCstenheuschrecke_-_Criquet_p%C3%A8lerin_-_Schistocerca_gregaria.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1262559270); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Desert_locust_-_W%C3%BCstenheuschrecke_-_Criquet_p%C3%A8lerin_-_Schistocerca_gregaria.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [NorbertNagel](<https://commons.wikimedia.org/wiki/User:NorbertNagel>).
- Credit: “Desert locust - Wüstenheuschrecke - Criquet pèlerin - Schistocerca gregaria.jpg” — NorbertNagel; Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2026-01-04 12:00:24.
- Source size: 6190 × 4126 pixels.

<a id="img-019"></a>

### IMG-019 — Earth photographed by Apollo 17

- Source: [Apollo 17 Blue Marble original orientation (AS17-148-22727).jpg](<https://commons.wikimedia.org/wiki/File:Apollo_17_Blue_Marble_original_orientation_(AS17-148-22727).jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1193074319); 2026-10-26.
- Licence: [Public domain](https://commons.wikimedia.org/wiki/File:Apollo_17_Blue_Marble_original_orientation_(AS17-148-22727).jpg#Licensing); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Apollo_17_Blue_Marble_original_orientation_(AS17-148-22727).jpg#Licensing). PD-USGov-NASA: Commons identifies a NASA work. Keep NASA credit and check any third-party notices before use.
- Additional source: [collection, source, or policy](https://www.nasa.gov/nasa-brand-center/images-and-media/).
- Credit: “Apollo 17 Blue Marble original orientation (AS17-148-22727).jpg” — NASA; Wikimedia Commons; Public domain; source candidate, no edits made.
- Source date: 1972-12-07 10:39.
- Source size: 2400 × 2400 pixels.

<a id="img-020"></a>

### IMG-020 — Ekron inscription

- Source: [Ekron inscription.jpg](<https://commons.wikimedia.org/wiki/File:Ekron_inscription.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1290178362); 2026-10-26.
- Licence: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Ekron_inscription.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [אור פ (Or P), Hebrew Wikipedia](<https://en.wikipedia.org/wiki/he:User:%D7%90%D7%95%D7%A8_%D7%A4>).
- Credit: “Ekron inscription.jpg” — אור פ (Or P), Hebrew Wikipedia; Wikimedia Commons; CC BY-SA 3.0; source candidate, no edits made.
- Source date: 2013-03.
- Source size: 3648 × 2736 pixels.

<a id="img-021"></a>

### IMG-021 — Elah valley

- Source: [The Elah valley.jpg](<https://commons.wikimedia.org/wiki/File:The_Elah_valley.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1291194659); 2026-10-26.
- Licence: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:The_Elah_valley.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Credit: “The Elah valley.jpg” — Davidbena; Wikimedia Commons; CC0 1.0; source candidate, no edits made.
- Source date: 2024-01-07.
- Source size: 3648 × 2432 pixels.

<a id="img-022"></a>

### IMG-022 — Euphrates and Lake Assad from orbit

- Source: [Euphrates Lake and River from ISS.jpg](<https://commons.wikimedia.org/wiki/File:Euphrates_Lake_and_River_from_ISS.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1263363177); 2026-10-26.
- Licence: [Public domain](https://commons.wikimedia.org/wiki/File:Euphrates_Lake_and_River_from_ISS.jpg#Licensing); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Euphrates_Lake_and_River_from_ISS.jpg#Licensing). PD-USGov-NASA: Commons identifies a NASA work. Keep NASA credit and check any third-party notices before use.
- Additional source: [collection, source, or policy](https://www.nasa.gov/nasa-brand-center/images-and-media/).
- Credit: “Euphrates Lake and River from ISS.jpg” — NASA; Wikimedia Commons; Public domain; source candidate, no edits made.
- Source date: 2021-04-22.
- Source size: 1041 × 694 pixels.
- Size limit: suitable for a small card; do not enlarge for the detail target.

<a id="img-023"></a>

### IMG-023 — Galilee landscape near Tiberias

- Source: [Galilee Landscape - Near Tiberias - Israel (5710607964).jpg](<https://commons.wikimedia.org/wiki/File:Galilee_Landscape_-_Near_Tiberias_-_Israel_(5710607964).jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1200797804); 2026-10-26.
- Licence: [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Galilee_Landscape_-_Near_Tiberias_-_Israel_(5710607964).jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Adam Jones from Kelowna, BC, Canada](<https://www.flickr.com/people/41000732@N04>).
- Credit: “Galilee Landscape - Near Tiberias - Israel (5710607964).jpg” — Adam Jones from Kelowna, BC, Canada; Wikimedia Commons; CC BY-SA 2.0; source candidate, no edits made.
- Source date: 2011-05-11 01:23.
- Source size: 3456 × 2304 pixels.

<a id="img-024"></a>

### IMG-024 — Gaza port

- Source: [Gaza sea port.jpg](<https://commons.wikimedia.org/wiki/File:Gaza_sea_port.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1268656151); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Gaza_sea_port.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Obaida alnakhala](<https://commons.wikimedia.org/w/index.php?title=User:Obaida_alnakhala&action=edit&redlink=1>).
- Credit: “Gaza sea port.jpg” — Obaida alnakhala; Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2018-08-06 19:10:30.
- Source size: 4032 × 3024 pixels.

<a id="img-025"></a>

### IMG-025 — Ghor es-Safi landscape

- Source: [Wild Jordan - Ghor Safi.jpg](<https://commons.wikimedia.org/wiki/File:Wild_Jordan_-_Ghor_Safi.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=962529820); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Wild_Jordan_-_Ghor_Safi.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Taha Al-Hayali](<https://commons.wikimedia.org/w/index.php?title=User:Taha9009&action=edit&redlink=1>).
- Credit: “Wild Jordan - Ghor Safi.jpg” — Taha Al-Hayali; Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2022-07-22 16:12:45.
- Source size: 4624 × 3468 pixels.

<a id="img-026"></a>

### IMG-026 — Golan landscape

- Source: [Landscape Golan WV.JPG](<https://commons.wikimedia.org/wiki/File:Landscape_Golan_WV.JPG>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1153283869); 2026-10-26.
- Licence: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Landscape_Golan_WV.JPG#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Grauesel](<http://www.wikivoyage-old.org/shared/User%3AGrauesel>).
- Credit: “Landscape Golan WV.JPG” — Grauesel; Wikimedia Commons; CC BY-SA 3.0; source candidate, no edits made.
- Source date: 2010-03-23.
- Source size: 1500 × 1125 pixels.
- Size limit: suitable for a small card; do not enlarge for the detail target.

<a id="img-027"></a>

### IMG-027 — Jabbok river view

- Source: [River Jabok.jpg](<https://commons.wikimedia.org/wiki/File:River_Jabok.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1076791864); 2026-10-26.
- Licence: [CC BY 2.0](https://creativecommons.org/licenses/by/2.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:River_Jabok.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Credit: “River Jabok.jpg” — Verity Cridland; Wikimedia Commons; CC BY 2.0; source candidate, no edits made.
- Source date: 2006-03-25 07:42:25.
- Source size: 2048 × 1532 pixels.

<a id="img-028"></a>

### IMG-028 — Jebel Harun mountain

- Source: [Petra in Transjordan. Distant view of Mt. Hor, Jebel Harun LOC matpc.01682.jpg](<https://commons.wikimedia.org/wiki/File:Petra_in_Transjordan._Distant_view_of_Mt._Hor,_Jebel_Harun_LOC_matpc.01682.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1266107745); 2026-10-26.
- Licence: [Public domain](https://commons.wikimedia.org/wiki/File:Petra_in_Transjordan._Distant_view_of_Mt._Hor,_Jebel_Harun_LOC_matpc.01682.jpg#Licensing); HOLD.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Petra_in_Transjordan._Distant_view_of_Mt._Hor,_Jebel_Harun_LOC_matpc.01682.jpg#Licensing). HOLD: Commons states PD-Matson and PD-old-70-1923. The linked collection states no known restrictions; confirm the specific copyright basis.
- Additional source: [collection, source, or policy](https://www.loc.gov/pictures/collection/matpc/item/mpc2004001774/PP).
- Credit: “Petra in Transjordan. Distant view of Mt. Hor, Jebel Harun” — Matson Collection, Library of Congress; matpc.01682; public-domain claim pending review; no edits made.
- Source date: 1900.
- Source size: 6071 × 4458 pixels.

<a id="img-029"></a>

### IMG-029 — Jericho viewed from Tell es-Sultan

- Source: [Jericho from Tell es-Sultan 03.jpg](<https://commons.wikimedia.org/wiki/File:Jericho_from_Tell_es-Sultan_03.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1024919822); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Jericho_from_Tell_es-Sultan_03.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Davide Mauro](<https://commons.wikimedia.org/wiki/User:Codas>).
- Credit: “Jericho from Tell es-Sultan 03.jpg” — Davide Mauro; Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2022-11-11 10:03:34.
- Source size: 9078 × 3916 pixels.

<a id="img-030"></a>

### IMG-030 — Jerusalem from the Mount of Olives

- Source: [Jerusalem panorama from Mount of Olives 07112018.jpg](<https://commons.wikimedia.org/wiki/File:Jerusalem_panorama_from_Mount_of_Olives_07112018.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1287947515); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Jerusalem_panorama_from_Mount_of_Olives_07112018.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Beko](<https://commons.wikimedia.org/wiki/User:Beko>).
- Credit: “Jerusalem panorama from Mount of Olives 07112018.jpg” — Beko; Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2018-11-07 13:52:42.
- Source size: 11512 × 3163 pixels.

<a id="img-031"></a>

### IMG-031 — Jordan River

- Source: [Jordan River Bushy.jpg](<https://commons.wikimedia.org/wiki/File:Jordan_River_Bushy.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1159387394); 2026-10-26.
- Licence: [Public domain](https://commons.wikimedia.org/wiki/File:Jordan_River_Bushy.jpg#Licensing); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Jordan_River_Bushy.jpg#Licensing). PD-user-en: Bcrawford92 released the photograph into the public domain, as stated on the file page.
- Creator or collection: [Bcrawford92 at English Wikipedia](<https://en.wikipedia.org/wiki/User:Bcrawford92>).
- Credit: “Jordan River Bushy.jpg” — Bcrawford92 at English Wikipedia; Wikimedia Commons; Public domain; source candidate, no edits made.
- Source date: 6 February 2007 (original upload date).
- Source size: 1944 × 2068 pixels.

<a id="img-032"></a>

### IMG-032 — Khirbet ar-Rai site

- Source: [Khirbet-ar-Rai-236.jpg](<https://commons.wikimedia.org/wiki/File:Khirbet-ar-Rai-236.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=748679978); 2026-10-26.
- Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Khirbet-ar-Rai-236.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Bukvoed](<https://commons.wikimedia.org/wiki/User:Bukvoed>).
- Credit: “Khirbet-ar-Rai-236.jpg” — Bukvoed; Wikimedia Commons; CC BY 4.0; source candidate, no edits made.
- Source date: 2023-03-10 11:12:56.
- Source size: 5472 × 3648 pixels.

<a id="img-033"></a>

### IMG-033 — Lachish relief in the British Museum

- Source: [Lachish Relief, British Museum 16.jpg](<https://commons.wikimedia.org/wiki/File:Lachish_Relief,_British_Museum_16.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1106931434); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Lachish_Relief,_British_Museum_16.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Mike Peel (www.mikepeel.net)](<https://commons.wikimedia.org/wiki/User:Mike_Peel>).
- Credit: “Lachish Relief, British Museum 16.jpg” — Mike Peel (www.mikepeel.net); Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2010-09-12.
- Source size: 2531 × 3400 pixels.

<a id="img-034"></a>

### IMG-034 — Later silver coin from Tyre

- Source: [Silver Shekel of Tyre.jpg](<https://commons.wikimedia.org/wiki/File:Silver_Shekel_of_Tyre.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1270972863); 2026-10-26.
- Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Silver_Shekel_of_Tyre.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Moose1983](<https://commons.wikimedia.org/w/index.php?title=User:Moose1983&action=edit&redlink=1>).
- Credit: “Silver Shekel of Tyre” — Moose1983; photo courtesy of the Matthew C. Materio Collection; Wikimedia Commons; CC BY 4.0; no edits made.
- Source date: 2025-08-03.
- Source size: 3717 × 1674 pixels.

<a id="img-035"></a>

### IMG-035 — Library of Celsus facade

- Source: [Ephesus Celsus Library Façade.jpg](<https://commons.wikimedia.org/wiki/File:Ephesus_Celsus_Library_Fa%C3%A7ade.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1243481857); 2026-10-26.
- Licence: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Ephesus_Celsus_Library_Fa%C3%A7ade.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Benh LIEU SONG](<https://commons.wikimedia.org/wiki/User:Benh>).
- Credit: “Ephesus Celsus Library Façade.jpg” — Benh LIEU SONG; Wikimedia Commons; CC BY-SA 3.0; source candidate, no edits made.
- Source date: Taken on 21 June 2010.
- Source size: 9163 × 7100 pixels.

<a id="img-036"></a>

### IMG-036 — Modern Amman landscape

- Source: [Amman landscape.jpg](<https://commons.wikimedia.org/wiki/File:Amman_landscape.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1193294579); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Amman_landscape.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Waed altamimi](<https://commons.wikimedia.org/w/index.php?title=User:Waed_altamimi&action=edit&redlink=1>).
- Credit: “Amman landscape.jpg” — Waed altamimi; Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2021-03-28.
- Source size: 1440 × 1080 pixels.
- Size limit: suitable for a small card; do not enlarge for the detail target.

<a id="img-037"></a>

### IMG-037 — Modern Bethlehem panorama

- Source: [Bethlehem Panorama 2010 MZW 0833.JPG](<https://commons.wikimedia.org/wiki/File:Bethlehem_Panorama_2010_MZW_0833.JPG>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1280269678); 2026-10-26.
- Licence: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Bethlehem_Panorama_2010_MZW_0833.JPG#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [M Z Wojalski Lodz PL](<https://commons.wikimedia.org/wiki/User:M_Z_Wojalski>).
- Credit: “Bethlehem Panorama 2010 MZW 0833.JPG” — M Z Wojalski Lodz PL; Wikimedia Commons; CC BY-SA 3.0; source candidate, no edits made.
- Source date: 2010-05-07 16:44:20.
- Source size: 2067 × 1033 pixels.

<a id="img-038"></a>

### IMG-038 — Modern Damascus panorama

- Source: [Syria, Panorama of Damascus city.jpg](<https://commons.wikimedia.org/wiki/File:Syria,_Panorama_of_Damascus_city.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1206507205); 2026-10-26.
- Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Syria,_Panorama_of_Damascus_city.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Vyacheslav Argenberg](<https://commons.wikimedia.org/wiki/User:Argenberg>).
- Credit: “Syria, Panorama of Damascus city.jpg” — Vyacheslav Argenberg; Wikimedia Commons; CC BY 4.0; source candidate, no edits made.
- Source date: 2008-08-16 18:06:27.
- Source size: 4000 × 2248 pixels.

<a id="img-039"></a>

### IMG-039 — Modern Jacob sheep

- Source: [Jacob sheep - geograph.org.uk - 2255493.jpg](<https://commons.wikimedia.org/wiki/File:Jacob_sheep_-_geograph.org.uk_-_2255493.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=943716739); 2026-10-26.
- Licence: [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Jacob_sheep_-_geograph.org.uk_-_2255493.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Rod Allday](<https://www.geograph.org.uk/profile/22976>).
- Credit: “Jacob sheep - geograph.org.uk - 2255493.jpg” — Rod Allday; Wikimedia Commons; CC BY-SA 2.0; source candidate, no edits made.
- Source date: 2011-01-30.
- Source size: 640 × 480 pixels.
- Size limit: suitable for a small card; do not enlarge for the detail target.

<a id="img-040"></a>

### IMG-040 — Modern Jaffa harbour

- Source: [PikiWiki Israel 60329 port of jaffa.jpg](<https://commons.wikimedia.org/wiki/File:PikiWiki_Israel_60329_port_of_jaffa.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=687277421); 2026-10-26.
- Licence: [CC BY 2.5](https://creativecommons.org/licenses/by/2.5); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:PikiWiki_Israel_60329_port_of_jaffa.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Credit: “PikiWiki Israel 60329 port of jaffa” — ראובן אברמוביץ ציפס; Heritage conservation picture Project - Jaffa Port Pikiwiki Israel; CC BY 2.5; no edits made.
- Source date: 2007.
- Source size: 3504 × 2336 pixels.

<a id="img-041"></a>

### IMG-041 — Moon above Earth’s atmosphere

- Source: [Top of Atmosphere.jpg](<https://commons.wikimedia.org/wiki/File:Top_of_Atmosphere.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1250807845); 2026-10-26.
- Licence: [Public domain](https://commons.wikimedia.org/wiki/File:Top_of_Atmosphere.jpg#Licensing); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Top_of_Atmosphere.jpg#Licensing). PD-USGov-NASA: Commons identifies a NASA work. Keep NASA credit and check any third-party notices before use.
- Additional source: [collection, source, or policy](https://www.nasa.gov/nasa-brand-center/images-and-media/).
- Credit: “Top of Atmosphere.jpg” — NASA Earth Observatory; Wikimedia Commons; Public domain; source candidate, no edits made.
- Source date: 2006-07-20.
- Source size: 3027 × 2010 pixels.

<a id="img-042"></a>

### IMG-042 — Mosque in modern Mukhmas

- Source: [Mosque in Mukhmas.jpg](<https://commons.wikimedia.org/wiki/File:Mosque_in_Mukhmas.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=915645698); 2026-10-26.
- Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Mosque_in_Mukhmas.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [מסתכלים לכיבוש בעיניים](<https://commons.wikimedia.org/w/index.php?title=User:%D7%9E%D7%A1%D7%AA%D7%9B%D7%9C%D7%99%D7%9D_%D7%9C%D7%9B%D7%99%D7%91%D7%95%D7%A9_%D7%91%D7%A2%D7%99%D7%A0%D7%99%D7%99%D7%9D&action=edit&redlink=1>).
- Credit: “Mosque in Mukhmas.jpg” — מסתכלים לכיבוש בעיניים; Wikimedia Commons; CC BY 4.0; source candidate, no edits made.
- Source date: 2024-05-30.
- Source size: 1536 × 2048 pixels.

<a id="img-043"></a>

### IMG-043 — Nile near Luxor

- Source: [Luxor Nile R35.jpg](<https://commons.wikimedia.org/wiki/File:Luxor_Nile_R35.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1271083115); 2026-10-26.
- Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Luxor_Nile_R35.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Marc Ryckaert](<https://commons.wikimedia.org/wiki/User:MJJR>).
- Credit: “Luxor Nile R35.jpg” — Marc Ryckaert; Wikimedia Commons; CC BY 4.0; source candidate, no edits made.
- Source date: 2013-03-17 09:55:38.
- Source size: 3810 × 2615 pixels.

<a id="img-044"></a>

### IMG-044 — Original Berlin Archaeopteryx fossil

- Source: [Archaeopteryx lithographica (Berlin specimen).jpg](<https://commons.wikimedia.org/wiki/File:Archaeopteryx_lithographica_(Berlin_specimen).jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1018600433); 2026-10-26.
- Licence: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Archaeopteryx_lithographica_(Berlin_specimen).jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [H. Raab ( User: Vesta )](<https://commons.wikimedia.org/wiki/User:Vesta~commonswiki>).
- Credit: “Archaeopteryx lithographica (Berlin specimen).jpg” — H. Raab ( User: Vesta ); Wikimedia Commons; CC BY-SA 3.0; source candidate, no edits made.
- Source date: 2009-07-05.
- Source size: 1888 × 2552 pixels.

<a id="img-045"></a>

### IMG-045 — Orontes River at Hama

- Source: [Orontes River in Hama, Syria.jpg](<https://commons.wikimedia.org/wiki/File:Orontes_River_in_Hama,_Syria.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1206507011); 2026-10-26.
- Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Orontes_River_in_Hama,_Syria.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Vyacheslav Argenberg](<https://commons.wikimedia.org/wiki/User:Argenberg>).
- Credit: “Orontes River in Hama, Syria.jpg” — Vyacheslav Argenberg; Wikimedia Commons; CC BY 4.0; source candidate, no edits made.
- Source date: 2008-08-19 15:38:56.
- Source size: 4000 × 3000 pixels.

<a id="img-046"></a>

### IMG-046 — Pilate inscription

- Source: [Dedicatory inscription found reused in the staircase of the theatre of Caesarea, the first and only mention of Pontius Pilates' name ever unearthed, 26-36 AD, Israel Museum, Jerusalem (15655925251).jpg](<https://commons.wikimedia.org/wiki/File:Dedicatory_inscription_found_reused_in_the_staircase_of_the_theatre_of_Caesarea,_the_first_and_only_mention_of_Pontius_Pilates%27_name_ever_unearthed,_26-36_AD,_Israel_Museum,_Jerusalem_(15655925251).jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1161476219); 2026-10-26.
- Licence: [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Dedicatory_inscription_found_reused_in_the_staircase_of_the_theatre_of_Caesarea,_the_first_and_only_mention_of_Pontius_Pilates%27_name_ever_unearthed,_26-36_AD,_Israel_Museum,_Jerusalem_(15655925251).jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Carole Raddato from Frankfurt, Germany](<https://www.flickr.com/people/41523983@N08>).
- Credit: “Dedicatory inscription found reused in the staircase of the theatre of Caesarea, the first and only mention of Pontius Pilates' name ever unearthed, 26-36 AD, Israel Museum, Jerusalem (15655925251).jpg” — Carole Raddato from Frankfurt, Germany; Wikimedia Commons; CC BY-SA 2.0; source candidate, no edits made.
- Source date: 23 October 2014, 14:05 (according to Exif data).
- Source size: 1356 × 1812 pixels.

<a id="img-047"></a>

### IMG-047 — Pyramids at Meroe

- Source: [Sudan Meroe Pyramids 30sep2005.jpg](<https://commons.wikimedia.org/wiki/File:Sudan_Meroe_Pyramids_30sep2005.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1090376248); 2026-10-26.
- Licence: [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Sudan_Meroe_Pyramids_30sep2005.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Fabrizio Demartis](<https://www.flickr.com/people/81919133@N00/>).
- Credit: “Sudan Meroe Pyramids 30sep2005.jpg” — Fabrizio Demartis; Wikimedia Commons; CC BY-SA 2.0; source candidate, no edits made.
- Source date: 2005-09-30.
- Source size: 1280 × 960 pixels.
- Size limit: suitable for a small card; do not enlarge for the detail target.

<a id="img-048"></a>

### IMG-048 — Reconstructed Mashki Gate at Nineveh

- Source: [Nineveh mashki gate from west.JPG](<https://commons.wikimedia.org/wiki/File:Nineveh_mashki_gate_from_west.JPG>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1235376065); 2026-10-26.
- Licence: [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Nineveh_mashki_gate_from_west.JPG#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Credit: “Nineveh mashki gate from west.JPG” — Photo by Fredarch.; Wikimedia Commons; CC BY-SA 3.0; source candidate, no edits made.
- Source date: 1990-04.
- Source size: 612 × 517 pixels.
- Size limit: below the 640-pixel card target. Keep native size or find a larger licensed source.

<a id="img-049"></a>

### IMG-049 — Red Sea coast at Makadi Bay

- Source: [Red sea coast, Makadi bay.jpg](<https://commons.wikimedia.org/wiki/File:Red_sea_coast,_Makadi_bay.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1209162887); 2026-10-26.
- Licence: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Red_sea_coast,_Makadi_bay.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Dirgela](<https://commons.wikimedia.org/wiki/User:Dirgela>).
- Credit: “Red sea coast, Makadi bay.jpg” — Dirgela; Wikimedia Commons; CC0 1.0; source candidate, no edits made.
- Source date: 2015-01-22 15:42:28.
- Source size: 2937 × 2203 pixels.

<a id="img-050"></a>

### IMG-050 — Residential remains at Tel Beer Sheva

- Source: [Tel-beer-sheva-wohnhaeuser.JPG](<https://commons.wikimedia.org/wiki/File:Tel-beer-sheva-wohnhaeuser.JPG>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1211611176); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Tel-beer-sheva-wohnhaeuser.JPG#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Mboesch](<https://commons.wikimedia.org/wiki/User:Mboesch>).
- Credit: “Tel-beer-sheva-wohnhaeuser.JPG” — Mboesch; Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2015-10-01 14:06:53.
- Source size: 3672 × 2448 pixels.

<a id="img-051"></a>

### IMG-051 — Rock layers at the Grand Canyon

- Source: [Grand Canyon layers.jpg](<https://commons.wikimedia.org/wiki/File:Grand_Canyon_layers.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1136448874); 2026-10-26.
- Licence: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Grand_Canyon_layers.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Mx. Granger](<https://commons.wikimedia.org/wiki/User:Mx._Granger>).
- Credit: “Grand Canyon layers.jpg” — Mx. Granger; Wikimedia Commons; CC0 1.0; source candidate, no edits made.
- Source date: 2021-12-11 11:14:05.
- Source size: 4096 × 3072 pixels.

<a id="img-052"></a>

### IMG-052 — Ruins at Philippi

- Source: [Ruins at the Archaeological Site of Philippi, Greece.jpg](<https://commons.wikimedia.org/wiki/File:Ruins_at_the_Archaeological_Site_of_Philippi,_Greece.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1266149593); 2026-10-26.
- Licence: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Ruins_at_the_Archaeological_Site_of_Philippi,_Greece.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Salwa Farwaneh Dameh](<https://commons.wikimedia.org/wiki/User:Salwa_Farwaneh_Dameh>).
- Credit: “Ruins at the Archaeological Site of Philippi, Greece.jpg” — Salwa Farwaneh Dameh; Wikimedia Commons; CC0 1.0; source candidate, no edits made.
- Source date: 2026-07-08 03:09:14.
- Source size: 1536 × 2048 pixels.

<a id="img-053"></a>

### IMG-053 — Ruins at Sebastia

- Source: [Ancient ruins by Sebastia 01.jpg](<https://commons.wikimedia.org/wiki/File:Ancient_ruins_by_Sebastia_01.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=792082666); 2026-10-26.
- Licence: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Ancient_ruins_by_Sebastia_01.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Daniel Ventura](<https://commons.wikimedia.org/wiki/User:Daniel_Ventura>).
- Credit: “Ancient ruins by Sebastia 01.jpg” — Daniel Ventura; Wikimedia Commons; CC BY-SA 3.0; source candidate, no edits made.
- Source date: 2007-04-04.
- Source size: 2048 × 1536 pixels.

<a id="img-054"></a>

### IMG-054 — Ruins of Babylon

- Source: [Ruins of Babylon, Mesopotamia, Iraq.jpg](<https://commons.wikimedia.org/wiki/File:Ruins_of_Babylon,_Mesopotamia,_Iraq.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1063266489); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Ruins_of_Babylon,_Mesopotamia,_Iraq.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Osama Shukir Muhammed Amin FRCP(Glasg)](<https://commons.wikimedia.org/wiki/User:Neuroforever>).
- Credit: “Ruins of Babylon, Mesopotamia, Iraq.jpg” — Osama Shukir Muhammed Amin FRCP(Glasg); Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2012-01-30 20:31:01.
- Source size: 2048 × 1362 pixels.

<a id="img-055"></a>

### IMG-055 — Siege ramp at Tel Lachish

- Source: [Tel Lachish siege ramp.jpg](<https://commons.wikimedia.org/wiki/File:Tel_Lachish_siege_ramp.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1197454411); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Tel_Lachish_siege_ramp.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [DaringDonna](<https://commons.wikimedia.org/wiki/User:DaringDonna>).
- Credit: “Tel Lachish siege ramp.jpg” — DaringDonna; Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2026-01-06 09:49:20.
- Source size: 6000 × 4000 pixels.

<a id="img-056"></a>

### IMG-056 — Sun observed at an ultraviolet wavelength

- Source: [The Sun by the Atmospheric Imaging Assembly of NASA's Solar Dynamics Observatory - 20100819.jpg](<https://commons.wikimedia.org/wiki/File:The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1287622958); 2026-10-26.
- Licence: [Public domain](https://commons.wikimedia.org/wiki/File:The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg#Licensing); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg#Licensing). PD-USGov-NASA: Commons identifies a NASA work. Keep NASA credit and check any third-party notices before use.
- Additional source: [collection, source, or policy](https://www.nasa.gov/nasa-brand-center/images-and-media/).
- Credit: “The Sun by the Atmospheric Imaging Assembly of NASA's Solar Dynamics Observatory - 20100819.jpg” — NASA/SDO (AIA); Wikimedia Commons; Public domain; source candidate, no edits made.
- Source date: 2010-08-19 00:32:21.
- Source size: 4044 × 3860 pixels.

<a id="img-057"></a>

### IMG-057 — Sunrise from Jebel Musa

- Source: [Sunrise from the summit of Mount Sinai or Gabal Musa.jpg](<https://commons.wikimedia.org/wiki/File:Sunrise_from_the_summit_of_Mount_Sinai_or_Gabal_Musa.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1203107320); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Sunrise_from_the_summit_of_Mount_Sinai_or_Gabal_Musa.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Sara Nabih](<https://commons.wikimedia.org/w/index.php?title=User:Sara_Nabih&action=edit&redlink=1>).
- Credit: “Sunrise from the summit of Mount Sinai or Gabal Musa.jpg” — Sara Nabih; Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2016-02-07 06:34:40.
- Source size: 3743 × 2807 pixels.

<a id="img-058"></a>

### IMG-058 — Synagogue ruins at Capernaum

- Source: [Capernaum Synagogue Ruins.jpg](<https://commons.wikimedia.org/wiki/File:Capernaum_Synagogue_Ruins.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1262423817); 2026-10-26.
- Licence: [CC BY 2.0](https://creativecommons.org/licenses/by/2.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Capernaum_Synagogue_Ruins.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [zeevveez](<https://flickr.com/people/29001414@N00>).
- Credit: “Capernaum Synagogue Ruins.jpg” — zeevveez; Wikimedia Commons; CC BY 2.0; source candidate, no edits made.
- Source date: 2008-11-04 11:47:52.
- Source size: 3264 × 2448 pixels.

<a id="img-059"></a>

### IMG-059 — Tel Zafit site view

- Source: [Tel Zafit, 21 February 2026 108.jpg](<https://commons.wikimedia.org/wiki/File:Tel_Zafit,_21_February_2026_108.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1224860111); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Tel_Zafit,_21_February_2026_108.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [מקף־עברי](<https://commons.wikimedia.org/wiki/User:%D7%9E%D7%A7%D7%A3%D6%BE%D7%A2%D7%91%D7%A8%D7%99>).
- Credit: “Tel Zafit, 21 February 2026 108.jpg” — מקף־עברי; Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2026-02-21 14:52:58.
- Source size: 6240 × 4160 pixels.

<a id="img-060"></a>

### IMG-060 — Temple of Apollo at Corinth

- Source: [The Temple of Apollo in Ancient Corinth on June 6, 2018.jpg](<https://commons.wikimedia.org/wiki/File:The_Temple_of_Apollo_in_Ancient_Corinth_on_June_6,_2018.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=899735274); 2026-10-26.
- Licence: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:The_Temple_of_Apollo_in_Ancient_Corinth_on_June_6,_2018.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [George E. Koronaios](<https://commons.wikimedia.org/wiki/User:George_E._Koronaios>).
- Credit: “The Temple of Apollo in Ancient Corinth on June 6, 2018.jpg” — George E. Koronaios; Wikimedia Commons; CC0 1.0; source candidate, no edits made.
- Source date: 2018-06-03 16:59:35.
- Source size: 6000 × 4000 pixels.

<a id="img-061"></a>

### IMG-061 — Theatre at Caesarea

- Source: [Roman theatre at Caesarea.jpg](<https://commons.wikimedia.org/wiki/File:Roman_theatre_at_Caesarea.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1110903126); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Roman_theatre_at_Caesarea.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Mohammad Hijjawi](<https://commons.wikimedia.org/wiki/User:Mohammad_Hijjawi>).
- Credit: “Roman theatre at Caesarea.jpg” — Mohammad Hijjawi; Wikimedia Commons; CC BY-SA 4.0; source candidate, no edits made.
- Source date: 2016-11-15 10:43:46.
- Source size: 5312 × 2988 pixels.

<a id="img-062"></a>

### IMG-062 — Tombs of Benei Hezir and Zechariah

- Source: [ISR-2015-Jerusalem-Tomb of Benei Hezir & Tomb of Zechariah.jpg](<https://commons.wikimedia.org/wiki/File:ISR-2015-Jerusalem-Tomb_of_Benei_Hezir_%26_Tomb_of_Zechariah.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1248001287); 2026-10-26.
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:ISR-2015-Jerusalem-Tomb_of_Benei_Hezir_%26_Tomb_of_Zechariah.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Andrew Shiva / Wikipedia](<https://commons.wikimedia.org/wiki/User:Godot13>).
- Credit: “ISR-2015-Jerusalem-Tomb of Benei Hezir & Tomb of Zechariah” — Andrew Shiva / Wikipedia; CC BY-SA 4.0; no edits made.
- Source date: 2015-06-10 08:32:33.
- Source size: 6867 × 3863 pixels.

<a id="img-063"></a>

### IMG-063 — Wadi Mujib

- Source: [Wadi Mujib Jordan.jpg](<https://commons.wikimedia.org/wiki/File:Wadi_Mujib_Jordan.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1210520493); 2026-10-26.
- Licence: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Wadi_Mujib_Jordan.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [Salwa Farwaneh Dameh](<https://commons.wikimedia.org/wiki/User:Salwa_Farwaneh_Dameh>).
- Credit: “Wadi Mujib Jordan.jpg” — Salwa Farwaneh Dameh; Wikimedia Commons; CC0 1.0; source candidate, no edits made.
- Source date: 2026-02-26 21:02:30.
- Source size: 1536 × 2048 pixels.

<a id="img-064"></a>

### IMG-064 — Wheat fields near Givat Brenner

- Source: [Wheat Fields, Near Givat Brenner, Israel שדות חיטה, ליד גבעת ברנר - panoramio.jpg](<https://commons.wikimedia.org/wiki/File:Wheat_Fields,_Near_Givat_Brenner,_Israel_%D7%A9%D7%93%D7%95%D7%AA_%D7%97%D7%99%D7%98%D7%94,_%D7%9C%D7%99%D7%93_%D7%92%D7%91%D7%A2%D7%AA_%D7%91%D7%A8%D7%A0%D7%A8_-_panoramio.jpg>).
- Checked page: [permanent revision](https://commons.wikimedia.org/w/index.php?oldid=1027173307); 2026-10-26.
- Licence: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0); Metadata checked.
- Rights evidence: [source terms](https://commons.wikimedia.org/wiki/File:Wheat_Fields,_Near_Givat_Brenner,_Israel_%D7%A9%D7%93%D7%95%D7%AA_%D7%97%D7%99%D7%98%D7%94,_%D7%9C%D7%99%D7%93_%D7%92%D7%91%D7%A2%D7%AA_%D7%91%D7%A8%D7%A0%D7%A8_-_panoramio.jpg#Licensing). File-page licence and creator metadata checked; visual inspection pending.
- Creator or collection: [ekeidar](<https://web.archive.org/web/20161028143925/http://www.panoramio.com/user/328581?with_photo_id=108959994>).
- Credit: “Wheat Fields, Near Givat Brenner, Israel שדות חיטה, ליד גבעת ברנר - panoramio.jpg” — ekeidar; Wikimedia Commons; CC BY-SA 3.0; source candidate, no edits made.
- Source date: Taken on 10 April 2013.
- Source size: 4288 × 2511 pixels.

## Unresolved Choices And Self-Review

There are 25 target-fit holds: seven debates and 18 place entries.
Some reflect provisional sites; others need a page or building identity check before a precise caption.
Two source rights claims are also on HOLD. Neither should enter production until its stated gap is resolved.

The owner needs to choose whether regional fallbacks suit cards for places without a settled site image.
These include Sodom, Gomorrah, Keilah, Mahanaim, Ashtaroth, Zobah, and Jazer.
Bethel needs a data decision before any site image is assigned. Carmel and Zion need careful names.
Keep traditional or proposed labels for Mount Sinai, Mount Hor, Gath, Ziklag, and Zoar where noted.
Broader regions retain their inherited uncertainty; a single named view does not establish their borders.

The Archelaus coin is 500 × 243 pixels; the Nineveh gate is 612 × 517 pixels.
Both fall below the proposed card target. Keep their native size or seek larger licensed alternatives in Phase 4.
The Met bull's image dimensions remain unchecked. Other small sources have limits in the catalogue.
No source passed a visual, crop, or mobile readability review in this text-only task.

Self-review checked all 90 mappings, 64 distinct source pages, stable IDs, counts, and full licence links.
It caught a required photographer credit, a project credit, and a collection credit missing from simple author metadata.
Those credits now appear explicitly for the tombs, Jaffa, and the silver coin.
CNG's required company name and link are retained. No image owner was contacted.
Replica inscriptions, illustrated coin cards, and coins of other rulers were rejected as misleading fits.

The new fit notes average grade 7.42 for debates and 7.22 for places.
They have no sentences above 20 words and no flags from the supplied jargon screen.
The sourcing-rules prose averages grade 7.49 under the same screen.
`npm run check:readability` completed in report-only mode and flagged existing app copy.
That checker does not scan these docs; the new prose received a separate check using its exported functions.
No app text, data, build number, or release files were changed.
