# Judges 3–5 — proposed assessments

Researcher: Claude · 2026-10-12 · Draft only; nothing outside `research/claude-drafts/` was changed.

Read: all 86 packaged KJV verses of Judges 3 (31), 4 (24) and 5 (31), plus the cross-references quoted below, from `data/chapters.json`.

**Duplicate check.** At commit `65d6355` the only record touching Judges is `early-conquest` (Judges 1:19, 21, 27, 29, 32). Searches of `data/evidence.json` for Jabin, Hazor (outside `early-conquest`), Sisera, Deborah, Philistine, Hobab/Reuel as a naming issue, 1 Kings 6:1, Acts 13:20, and grove/Asherah found no existing record. `early-conquest` mentions iron chariots only in connection with Joshua 17.

**Verification labels**

- **[text]** — wording read in the packaged chapter data.
- **[fetched]** — I opened the linked page this session and it says what I report.
- **[search]** — seen only in a search-result summary.
- **[memory]** — background knowledge, not checked this session. A lead, not a fact.

Coverage is not exhaustive. Items are ordered by how strong I think the case is. Section D lists what I looked at and decided not to propose.

---

## A. Strong proposals

### J1. Jabin king of Hazor: killed under Joshua, reigning again under Deborah

- **Verses:** Judges 4:2, 4:17, 4:23–24; Joshua 11:1, 11:10–11, 11:13; 1 Samuel 12:9. No existing ID.
- **Suggested:** id `jabin-of-hazor-joshua-and-judges`, mode contradictions, status Context.
- **Summary:** "Joshua kills Jabin king of Hazor and burns the city. In Judges, Jabin 'king of Canaan' reigns in Hazor and oppresses Israel for twenty years. Neither book explains the relationship."

**Explicit wording [text]**

- Joshua 11:1 names "Jabin king of Hazor". 11:10 Joshua "took Hazor, and smote the king thereof with the sword". 11:11 "there was not any left to breathe: and he burnt Hazor with fire". 11:13 Hazor is the only such city burned.
- Judges 4:2 "Jabin king of Canaan, that reigned in Hazor". 4:17 "Jabin the king of Hazor". 4:24 Israel "destroyed Jabin king of Canaan".
- 1 Samuel 12:9 recalls "Sisera, captain of the host of Hazor" and does not name Jabin.
- Judges 5 never mentions Jabin or Hazor; its enemies are "the kings of Canaan" (5:19) and Sisera.

**Reasoning**

- If both passages mean the same man and event, they disagree on who defeated him and when.
- If they mean two kings of the same name, a rebuilt Hazor must be supplied; neither book says the city was rebuilt or that the name was dynastic.
- A dynastic name is plausible but is a proposal. A king of Hazor with a similar name appears in much older Mari letters **[memory]**; I did not source that and it should not be cited without a link.

**Interpretation limits**

- Joshua 11 does not say Hazor stayed empty; Judges 4 does not say this Jabin was the first of the name.
- "King of Canaan" is a title found only here **[memory]**; it need not mean rule over all Canaan.
- This is a comparison of two texts. It does not show which, if either, preserves the event.

**Sources**

- https://ebible.org/eng-kjv/JOS11.htm — Joshua's defeat and burning of Hazor.
- https://ebible.org/eng-kjv/JDG04.htm — Jabin reigning in Hazor.
- https://ebible.org/eng-kjv/1SA12.htm — Sisera without Jabin.
- https://alhatorah.org/Devorah_and_Barak's_Battle_in_Prose_and_Poetry — notes the song's "kings of Canaan" against the prose's single king **[fetched]**.

**Unresolved:** Whether the Jabin material in Judges 4 was added to a Sisera story (a common scholarly view **[memory]**, unsourced here). Sourcing for the Mari name.

### J1b. Companion history record: Hazor's excavated sequence

- **Verses:** Judges 4:2–3; Joshua 11:10–13.
- **Suggested:** id `hazor-destruction-and-later-settlement`, mode history, status Context.
- **Summary:** "Excavation shows one great burning of Canaanite Hazor in the 13th century BCE, followed by sparse remains. That fits one of the two biblical Hazor accounts more easily than both."

**What the sources support**

- Late Bronze Hazor ended in an intense fire in the 13th century BCE; the upper city has ash up to about a metre deep **[fetched]** (Ebeling).
- After it, Iron I remains are slight: refuse pits cut into the last Canaanite level and a small shrine, suggesting a semi-nomadic population. Substantial rebuilding comes in the 10th century **[fetched]** (Ebeling).
- Who destroyed the city is disputed: Ben-Tor argues for Israelites; Zuckerman for an internal revolt **[search]**. A 2021 study by Bechar, Ben-Tor and others reviews the dating and offers two scenarios **[search — abstract only]**.

**Reasoning**

- If the 13th-century fire is Joshua 11's, the later site shows no royal city with a large chariot force for Judges 4.
- If the fire belongs to the Judges 4–5 period instead, as Aharoni-type reconstructions held **[search]**, then Joshua 11's burning lacks a separate layer.
- Either way, a single destruction layer is being asked to serve two narratives.

**Interpretation limits**

- Judges 4 does not narrate a destruction of Hazor at all, only of Jabin (4:24). The archaeology therefore does not contradict Judges 4's wording; it bears on the scale implied by "king of Canaan" and 900 chariots.
- Sisera is based at Harosheth, not Hazor (4:2). Harosheth's location is not established **[memory]**.
- Dating by pottery leaves the Iron I pits imprecise **[fetched]**.
- The chronology adopted for Joshua matters. An early-date reader would link Joshua 11 to an earlier Hazor destruction; I did not source that argument.

**Sources**

- https://bibleinterp.arizona.edu/node/3567 — Jennie Ebeling, "Recent Archaeological Discoveries at Hazor" (2003): fire, date, Iron I pits.
- https://cris.huji.ac.il/en/publications/the-destruction-of-late-bronze-age-hazor/ — Bechar et al. 2021, abstract: date and cause still debated.
- https://www.biblicalarchaeology.org/daily/news/scorched-wheat-may-provide-answers-on-the-destruction-of-canaanite-tel-hazor/ — burned grain from the destruction **[search]**.

**Unresolved:** Current excavators' view of the Iron I gap. Whether an earlier destruction layer can be tied to either text.

---

### J2. The prose battle and the song: who fought, how many, and where

- **Verses:** Judges 4:6, 4:10, 4:12–16; 5:8, 5:14–19, 5:20–21, 5:23. No existing ID.
- **Suggested:** id `deborah-prose-and-song-battle`, mode contradictions, status Context.
- **Summary:** "The narrative has ten thousand men from two tribes at Mount Tabor. The song praises six tribal groups, rebukes four for staying home, and sets the fight at Taanach."

**Explicit wording [text]**

| | Judges 4 (prose) | Judges 5 (song) |
|---|---|---|
| Tribes | Naphtali and Zebulun (4:6, 10) | Ephraim, Benjamin, Machir, Zebulun, Issachar, Naphtali (5:14–15, 18) |
| Absent | none mentioned | Reuben, Gilead, Dan, Asher rebuked (5:15–17); Meroz cursed (5:23) |
| Numbers | 10,000 (4:6, 10, 14) | "forty thousand in Israel" without shield or spear (5:8) |
| Enemy | Sisera, Jabin's captain (4:2, 7) | "the kings of Canaan" and Sisera (5:19–20) |
| Place | Mount Tabor, river Kishon (4:6–7, 12–14) | "Taanach by the waters of Megiddo"; Kishon (5:19, 21) |
| How won | Lord "discomfited" them "with the edge of the sword" (4:15) | stars fought; the Kishon "swept them away" (5:20–21) |

**Reasoning**

- The tribe lists differ outright: the song credits four groups the prose never mentions.
- The other rows are differences of emphasis that can be combined: a flooded Kishon can explain a rout; Tabor and Taanach both border the same valley.
- The song is widely regarded as much older than the prose **[search]** — one summary calls it among the oldest parts of the Hebrew Bible. That is a scholarly dating, not something the text states.

**Interpretation limits**

- 5:8's forty thousand is not presented as the army at this battle. Traditional commentators read it as enemy soldiers or as a general figure **[fetched]** (Targum, Rashi, Radak as reported by AlHaTorah).
- The prose may name only the core force; the song may praise everyone who sent men **[fetched]**. One modern proposal reads chapter 4 as one battle and chapter 5 as a wider war **[fetched]** (Novetsky).
- Judah, Simeon and Levi appear in neither account; silence is not a statement.
- Do not treat "the stars … fought" as a science claim. It is poetry.

**Sources**

- https://ebible.org/eng-kjv/JDG04.htm and https://ebible.org/eng-kjv/JDG05.htm — the two accounts.
- https://alhatorah.org/Devorah_and_Barak's_Battle_in_Prose_and_Poetry — itemised differences and traditional harmonisations.
- https://scripturecentral.org/archive/books/book-chapter/judges-5 — flood in the song vs unexplained panic in the prose; age of the poem **[search]**.

**Unresolved:** Whether "Machir" and "Gilead" stand for Manasseh and Gad. A scholarly source for the poem's date that is not confessional.

**Optional extension — scale.** Numbers 26:51 counts 601,730 fighting men just before the conquest **[text]**; the song's Israel musters, or contains, forty thousand. This connects to the existing `numbers-military-census-scope` record. Inference only, since 5:8 is not a census.

---

### J3. Sisera's death: asleep on the ground, or falling at her feet

- **Verses:** Judges 4:18–22; 5:24–27. No existing ID.
- **Suggested:** id `sisera-death-prose-and-song`, mode contradictions, status Context.
- **Summary:** "In the narrative Jael drives a tent peg through a sleeping Sisera into the ground. In the song he bows, falls and lies at her feet after the blow."

**Explicit wording [text]**

- 4:21: he "was fast asleep and weary"; she "smote the nail into his temples, and fastened it into the ground".
- 5:26–27: "with the hammer she smote Sisera, she smote off his head, when she had pierced and stricken through his temples. At her feet he bowed, he fell, he lay down."
- The song has no covering with a mantle, no sleep, and no request to stand guard.
- Edition difference: KJV has "she smote off his head" (5:26); ASV and WEB have "smote/struck through his head" **[text]**. Only the KJV wording clashes with "the nail was in his temples" when Barak sees the body (4:22). This sharper form of the difference belongs to the default text.

**Reasoning**

- Read as sequence, "bowed … fell … lay down" describes a man going down from a higher posture, which does not match a sleeper pinned to the ground.
- Read as poetic slow-motion of a death, the verbs describe collapse without implying he was standing.
- The text gives no signal which is meant.

**Interpretation limits**

- Hebrew poetry repeats and intensifies; three verbs are not three events.
- Nothing here bears on whether the event happened.
- The moral question (a guest killed by a host at peace with his king, 4:17, then praised, 5:24) is real but is an ethical assessment, not a discrepancy. I am not proposing it.

**Sources**

- https://ebible.org/eng-kjv/JDG04.htm · https://ebible.org/eng-kjv/JDG05.htm
- https://ebible.org/eng-web/JDG05.htm — for comparing the 5:26 rendering across packaged editions.

**Unresolved:** Meaning of the rare Hebrew verb behind "smote off" in 5:26.

---

### J4. The judges' years against the 480 years of 1 Kings 6:1

- **Verses:** Judges 3:8, 3:11, 3:14, 3:30; 4:3; 5:31 (this batch); Judges 11:26; 1 Kings 6:1; Acts 13:19–21. No existing ID.
- **Suggested:** id `judges-period-year-totals`, mode contradictions, status Context. A cross-book record, extended chapter by chapter like `early-conquest`.
- **Summary:** "Added end to end, the periods in Judges come to about 410 years. With the wilderness, Joshua, Eli, Samuel, Saul and David, that passes the 480 years Kings gives from the exodus to Solomon's temple."

**Explicit wording [text]**

- This batch: 8 years under Chushan-rishathaim, 40 rest, 18 under Eglon, 80 rest, 20 under Jabin, 40 rest. Subtotal 206.
- 1 Kings 6:1: Solomon's fourth year is the 480th after the exodus.
- Judges 11:26: Israel had held the land east of Jordan 300 years by Jephthah's day.
- Acts 13:20 KJV: judges "about the space of four hundred and fifty years, until Samuel". WEB instead attaches the 450 years to the period *before* the judges (13:19–20). This is an edition difference inside the package.

**Arithmetic (mine; every figure below read in the packaged KJV [text])**

- Remaining periods: Midian 7 (6:1), Gideon 40 (8:28), Abimelech 3 (9:22), Tola 23 (10:2), Jair 22 (10:3), Ammon 18 (10:8), Jephthah 6 (12:7), Ibzan 7 (12:9), Elon 10 (12:11), Abdon 8 (12:14), Philistines 40 (13:1), Samson 20 (16:31). With the 206 above: **410**.
- Outside Judges: wilderness 40, Joshua and the elders (no figure), Eli 40 (1 Samuel 4:18), Samuel (no figure), Saul (40 in Acts 13:21), David 40 **[memory]**, Solomon 4. Known figures alone: 164.
- 410 + 164 = 574, before the two unstated spans.

**Reasoning**

- Explicit: every figure above and the 480.
- Inference: that the periods ran one after another across all Israel. Judges never says so. Several judges are regional, and overlapping the periods removes the excess. Judges 10:7 names Philistine and Ammonite oppression together **[text]**, which is a textual hint of overlap.
- Samson's 20 years are placed "in the days of the Philistines" (15:20 **[text]**), so they may sit inside the 40.

**Interpretation limits**

- This is not a contradiction between two stated totals. It is a conflict between one stated total and a reader's sum.
- Many figures are 20, 40 or 80; they may be conventional round numbers. That is an interpretation.
- Do not present the KJV's Acts 13:20 as "the New Testament figure" without the edition note.
- No independent date for the exodus or any judge is established here.

**Sources**

- https://ebible.org/eng-kjv/JDG03.htm, …/JDG04.htm, …/JDG05.htm — the six figures in this batch.
- https://ebible.org/eng-kjv/1KI06.htm — 480 years.
- https://ebible.org/eng-kjv/ACT13.htm and https://ebible.org/eng-web/ACT13.htm — the two placements of 450 years.
- https://biblehub.com/acts/13-20.htm — commentary noting the Acts/Kings variance and the alternative manuscript reading **[search]**.
- https://www.textandtranslation.org/the-acts-1320-problem/ — the variant and its use in harmonising **[search]**.

**Unresolved:** Greek manuscript support for each form of Acts 13:20 (not verified). Whether the Greek of 1 Kings 6:1 reads 440 **[memory]**. Whether to anchor the record at Judges 3:8 or 1 Kings 6:1.

---

## B. Extensions to existing records

### J5. `early-conquest` — why the nations remained (Judges 3:1–6)

- **Verses:** Judges 3:1–6; with 2:20–23 (Codex's batch); Exodus 23:29–30; Deuteronomy 7:22; Joshua 23:12–13.
- **Summary of addition:** "Judges gives further reasons the nations were left: to test Israel's obedience and to teach war to those who had not known it."

**Explicit wording [text]**

- 3:1, 4: left "to prove Israel", to know whether they would obey.
- 3:2: "only" that later generations "might know, to teach them war".
- 2:20–21: because Israel broke the covenant, God will no longer drive them out.
- 2:23: "neither delivered he them into the hand of Joshua" — compare Joshua 21:44, "delivered all their enemies into their hand".
- Exodus 23:29–30 (already in the record): gradual removal so the land is not overrun by animals.

**Reasoning:** Four stated purposes — protection from wild animals, punishment, testing, and military training. They are not mutually exclusive, but "only … to teach them war" (3:2) is restrictive in wording, and punishment-for-disobedience presupposes a failure that the testing rationale treats as still open.

**Limits:** Multiple purposes for one situation are not a contradiction unless one excludes another. The KJV's "only" in 3:2 is the single restrictive word; its force in Hebrew is not something I checked.

**Other details in 3:3–5**

- The list in 3:3 (five Philistine lords, Canaanites, Sidonians, Hivites of Lebanon) matches Joshua 13:2–6 in substance **[memory]**. Agreement; no note.
- 3:5 lists six peoples; Joshua 3:10 and 24:11 list seven (Girgashites added) **[text for 24:11]**. List variation; do not annotate.

**Sources:** https://ebible.org/eng-kjv/JDG02.htm · https://ebible.org/eng-kjv/JDG03.htm · https://ebible.org/eng-kjv/JOS21.htm

**Coordination:** overlaps Codex's Judges 2 work. Suggest Codex write 2:20–23 and include 3:1–6 in the same extension.

### J6. Moses' father-in-law: Hobab, Jethro, Reuel; Kenite or Midianite

- **Verses:** Judges 4:11 (and 1:16, Codex's batch); Numbers 10:29; Exodus 2:18; 3:1; 18:1.
- **Existing records:** `numbers-cloud-and-local-guidance` mentions Hobab as a guide and `exodus-jethro-delegation` concerns Jethro's advice. Neither addresses the names. Suggested new id `moses-father-in-law-names`, mode contradictions, status Context.
- **Summary:** "Judges calls Hobab Moses' father-in-law and a Kenite. Exodus names the father-in-law Reuel and Jethro, a Midianite. Numbers makes Hobab the son of Raguel."

**Explicit wording**

- Judges 4:11: "Hobab the father in law of Moses"; his descendants are Kenites **[text]**.
- Judges 1:16: "the Kenite, Moses' father in law" **[text]**.
- Numbers 10:29: "Hobab, the son of Raguel the Midianite, Moses' father in law" **[text]** — grammatically, the title can attach to either man.
- Exodus 2:18 Reuel; 3:1 and 18:1 Jethro, priest of Midian **[text]**.

**Reasoning:** Three names and two ethnic labels attach to one role. If Numbers makes Hobab the son of Reuel, Judges 4:11 makes father and son both "father-in-law".

**Limits**

- Edition difference: the packaged ASV and WEB both read "Hobab the brother-in-law of Moses" at Judges 4:11; only the KJV has "father in law" **[text]**. With ASV/WEB, Hobab is Reuel's son and Jethro/Reuel's names are the remaining question. The Hebrew term covers more than one in-law relation **[search]**.
- One man with several names, or a clan name (Reuel) beside a personal name, are standard proposals. None is stated in the text.
- Kenites may be a Midianite subgroup; no passage says so.

**Sources**

- https://ebible.org/eng-kjv/JDG04.htm · https://ebible.org/eng-kjv/NUM10.htm · https://ebible.org/eng-kjv/EXO02.htm · https://ebible.org/eng-kjv/EXO03.htm
- https://www.jewishencyclopedia.com/articles/7790 — Hobab entry **[search]**.
- https://www.internationalstandardbible.com/J/jethro.html — notes the Kenite/Midianite labels and the translation of the kinship term **[search]**.

**Coordination:** Judges 1:16 is in Codex's batch. One record should cover both.

---

## C. Moderate and weaker candidates

### J7. Shamgar: after Ehud, but skipped when Ehud dies

- **Verses:** Judges 3:31; 4:1; 5:6.
- **Suggested:** contradictions, Context. Could be a short record or held.
- **Explicit [text]:** 3:31 "after him was Shamgar … he also delivered Israel". 4:1 Israel does evil "when Ehud was dead" — no mention of Shamgar. 5:6 "in the days of Shamgar … the highways were unoccupied": a time of insecurity, not deliverance. No years, tribe or rest period are given for him.
- **Witness:** the Greek adds to 3:30 that Ehud "judged them till he died" **[fetched]**, tightening the link from 3:30 to 4:1 around Shamgar. Some Greek copies repeat the Shamgar notice after Samson **[memory]** — unverified.
- **Limits:** 4:1 may simply resume the main cycle. 5:6 may date an oppression that Shamgar relieved only locally. No contradiction is stated.
- **Sources:** https://ebible.org/eng-kjv/JDG03.htm · https://ebible.org/eng-kjv/JDG05.htm · https://ebible.org/eng-Brenton/JDG03.htm
- **Not proposed:** "son of Anath" as a goddess name or warrior title, and inscribed arrowheads with the same phrase **[memory]**. Background that tends to support the name's authenticity; not a discrepancy.

### J8. "Chariots of iron"

- **Verses:** Judges 4:3, 4:13; also 1:19; Joshua 17:16, 18.
- **Suggested:** history, Context. Hold until a peer-reviewed source is in hand.
- **Explicit [text]:** Sisera has "nine hundred chariots of iron".
- **What sources say:** Some scholars call iron chariots before about 1000 BCE historically improbable — J. F. A. Sawyer, and the archaeometallurgist Naama Yahalom-Mack, as quoted on an advocacy site **[search]**. A Biblical Archaeology Society sidebar replies that the phrase need only mean iron-fitted chariots and cites Egyptian and Hittite references to iron well before 1200 BCE **[fetched]**; that sidebar gives no chariot-construction evidence.
- **Comparison for the number:** Thutmose III's Megiddo campaign records 924 captured chariots from a large coalition **[search]**. That shows the figure is not absurd for a coalition; it does not show one city fielded 900.
- **Limits:** "Of iron" does not say "made wholly of iron". Known Late Bronze chariots were light wooden vehicles **[memory]**. Whether the phrase is a later writer's idiom is a hypothesis.
- **Sources:** https://library.biblicalarchaeology.org/sidebar/did-the-canaanites-really-have-iron-chariots/ · https://armstronginstitute.org/812-iron-chariots-a-biblical-impossibility (advocacy; useful only for locating the Sawyer and Yahalom-Mack quotations) · https://www.nationalgeographic.com/history/article/thutmose-ancient-egypt-pharaoh-military-leader **[search]**
- **Unresolved:** Primary publications for the sceptical view. I would not publish this on the current sourcing.

### J9. Philistines in the early judges period

- **Verses:** Judges 3:3, 3:31.
- **Suggested:** history, Context. Depends on J4.
- **What sources say:** The Medinet Habu reliefs of Ramesses III, about 1175 BCE, show the Peleset among the Sea Peoples; locally made Aegean-style pottery appears at Ashdod, Ekron and Ashkelon at about the same time **[search]** (Biblical Archaeology Society). Whether they arrived as settlers placed by Egypt or as conquerors is disputed **[search]**.
- **Reasoning:** If Judges' periods are summed consecutively back from David, Shamgar and the "five lords" fall well before 1175 BCE. On a compressed chronology they do not. The discrepancy exists only under the long chronology.
- **Limits:** Judges gives no absolute dates. Genesis also names Philistines far earlier; I found no existing record on that and am not proposing one here.
- **Sources:** https://library.biblicalarchaeology.org/sidebar/when-did-the-philistines-arrive-in-canaan-multiple-clues-help-unravel-the-mystery/
- **Unresolved:** Best handled as a paragraph inside J4 once that record exists.

### J10. Chushan-rishathaim of Mesopotamia

- **Verses:** Judges 3:8–10.
- **Suggested:** history, Context. Weak; hold.
- **Explicit [text]:** A king of "Mesopotamia" rules Israel eight years and is defeated by Othniel. The Greek has "Syria of the rivers" **[fetched]**.
- **What sources say:** The name is unknown outside the Bible **[search]** (Jewish Encyclopedia — early 1900s, may be dated). The second element is commonly read as "double wickedness", likely a taunt-name **[search]**. Proposed identities range across Mitanni, a Syrian ruler, a southern tribal chief, and an emendation of Aram to Edom, which would suit Othniel's southern home **[search]**.
- **Limits:** Absence of an external record is not evidence against the event. The Edom reading has no manuscript support that I found. This is "not independently attested", which the project may not count as a discrepancy.
- **Sources:** https://www.jewishencyclopedia.com/articles/4382-chushan-rishathaim · https://www.jewishvirtuallibrary.org/cushan-rishathaim

### J11. "City of palm trees" held by Eglon

- **Verses:** Judges 3:13; Joshua 6:26; 1 Kings 16:34.
- **Suggested:** hold; probably do not add.
- **Explicit:** Eglon "possessed the city of palm trees" **[text]**. Joshua curses whoever rebuilds Jericho **[text]**.
- **Inference:** that the city of palm trees is Jericho. Deuteronomy 34:3 and 2 Chronicles 28:15 make the equation **[text]**; Judges 3:13 does not name it.
- **Why weak:** occupying a site is not rebuilding its foundations and gates, which is what the curse specifies. No conflict unless more is read in.

---

## D. Considered and not proposed

- **3:7 "the groves"** (also Brenton's Greek-based "groves" **[fetched]**). Modern translations render a goddess or cult object, Asherah **[memory]**. A translation matter, and it recurs across many books. Raise only if the project decides to track KJV translation issues systematically.
- **3:19, 26 "quarries"**; **3:22 "the dirt came out"**; **5:14 "pen of the writer"**. KJV renderings of difficult Hebrew. Not discrepancies.
- **3:15 left-handed.** The Greek has "used both hands alike" **[fetched]**. Witness nuance; no conflict.
- **3:29 ten thousand Moabites, none escaped.** Round figure; nothing to compare it with.
- **Ehud's and Jael's deception and killing.** Ethical assessment, not a history, science or textual discrepancy.
- **5:20 stars fighting; 5:4–5 mountains melting.** Poetry.
- **4:4 a woman judging.** No Old Testament text conflicts. New Testament comparisons would be doctrinal inference.
- **5:17 "why did Dan remain in ships?"** Dan is pushed into the hills in Judges 1:34 **[text]** and migrates inland in Judges 18 **[memory]**. Puzzling but unexplained; an unresolved question, not a stated conflict.
- **4:6–11 Kedesh.** If this is Kedesh in upper Galilee, Sisera's flight on foot from the Kishon to a tent "by Kedesh" covers a long distance past Hazor **[memory]**. A second, southern Kedesh has been proposed. Geography unresolved.
- **3:9 Othniel "son of Kenaz, Caleb's younger brother".** Ambiguous whether Othniel or Kenaz is the brother; Caleb's father is Jephunneh elsewhere **[memory]**. Belongs with Judges 1:13 in Codex's batch.
- **1 Samuel 12:9–11.** Samuel's order (Sisera, Philistines, Moab) and his list of deliverers ("Bedan") differ from Judges **[text]**. Best assessed when 1 Samuel 12 is reached.

---

## E. Open questions for further review

1. Greek manuscript evidence for Acts 13:20, and whether Greek 1 Kings 6:1 has a different year count.
2. A citable source for a king of Hazor with a Jabin-like name in older cuneiform texts.
3. Peer-reviewed sourcing for the iron-chariot question and for the date of the Song of Deborah.
4. Whether the project wants "not independently attested" items (J10) at all.
5. How the reader should present KJV-only discrepancies (Judges 4:11 "father in law", 5:26 "smote off his head", Acts 13:20) when the user switches to ASV or WEB.
6. All **[memory]** items above.
