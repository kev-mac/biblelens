# Joshua 21–24 — independent review of existing assessments

Reviewer: Claude · 2026-10-12 · Draft only; nothing outside `research/claude-drafts/` was changed.

Reviewed against: `data/evidence.json` at commit `65d6355` (228 records), `research/notes/joshua-21-22.md`, `research/notes/joshua-23-24.md`, and the packaged KJV/ASV/WEB text in `data/chapters.json`.

Records touching these chapters: `early-conquest`, `joshua-achan-household-responsibility`, `joshua-hornet-and-military-victory`, `shechem-burial-land-purchaser`.

**Verification labels used below**

- **[text]** — I read the wording in the packaged chapter data.
- **[fetched]** — I opened the linked page in this session and it says what I report.
- **[search]** — seen only in a search-result summary; the page itself was not opened.
- **[memory]** — from my own background knowledge, not checked in this session. Treat as a lead, not a fact.

This review is not exhaustive. I checked the four records and the deferred items in the two notes, then looked for missed comparisons. A clean bill on a verse here means only that I found nothing.

---

## A. Corrections to existing records

### A1. `joshua-hornet-and-military-victory` — identification stated as fact; strongest comparison is missing

**Verses:** Joshua 24:8, 24:11, 24:12; Deuteronomy 2:32–34; 3:1–8; Exodus 23:28.

**Problem 1 — an inference is written as the text's own claim.** The record says 24:12 "attributes the displacement of the two Amorite kings" and then compares Deuteronomy's Sihon and Og battles. Joshua 24:12 does not name Sihon or Og **[text]**. Equating them is a reasonable inference, because "two kings of the Amorites" means Sihon and Og elsewhere (Deuteronomy 3:8; 4:47; Joshua 2:10; 9:10 **[text]** — the last two name Sihon and Og outright). Two things cut against simply assuming it:

- Position. Verse 12 follows the Jordan crossing and Jericho (v. 11), and "drave *them* out" most naturally points back to the peoples just listed west of the Jordan **[text]**. Sihon and Og were east of it and were already covered in v. 8.
- Witness. The Greek text reads "twelve kings of the Amorites", not two **[fetched]** (Brenton, Joshua 24:12).

**Problem 2 — the explicit comparison is inside the same speech.** The record leans on Deuteronomy, but Joshua 24:8 already says of the eastern Amorites "they fought with you", and 24:11 says "the men of Jericho fought against you" **[text]**. The weapon denial in v. 12 therefore sits two to four verses from fighting statements by the same speaker. That is explicit and needs no cross-book identification. The record lists 24:8 in `appliesTo` but never quotes its fighting wording.

**Missing context**

- Deuteronomy 7:20 repeats the hornet promise **[text]**; the record cites only Exodus 23:28.
- Genesis 48:22: Jacob says he took a portion from the Amorite "with my sword and with my bow" **[text]**. Joshua 24:12 uses the same pair in the negative. This is a verbal echo; whether it is deliberate is interpretation.

**Suggested revision (summary):** "Joshua 24:12 says a hornet, not Israel's sword or bow, drove out 'the two kings of the Amorites'. The same speech says the Amorites and the men of Jericho fought Israel (24:8, 11). Whether the denial excludes combat or credits the ultimate cause is not stated."

**Suggested additions to scope:** "The verse does not name the two kings. Identifying them as Sihon and Og follows usage elsewhere and is an inference; the Greek text reads twelve kings."

**Sources**

- https://ebible.org/eng-kjv/JOS24.htm — wording of 24:8, 11, 12.
- https://ebible.org/eng-Brenton/JOS24.htm — Greek-based English: "twelve kings".
- https://ebible.org/eng-kjv/GEN48.htm — sword-and-bow wording.

**Unresolved:** Which reading (two / twelve) is earlier. Whether "hornet" is literal, a figure for panic, or something else — the existing scope note already handles this correctly.

---

### A2. `shechem-burial-land-purchaser` — edition wording, an unstated second discrepancy, and a missing Genesis parallel

**Verses:** Joshua 24:32; Genesis 33:18–19; 48:22; 50:12–13; Acts 7:15–16.

**Edition wording.** The record says Acts describes "a tomb at Shechem purchased by Abraham from Hamor's sons". The packaged KJV reads "of the sons of Emmor *the father of* Sychem"; ASV reads "the sons of Hamor *in* Shechem"; WEB reads "the children of Hamor *of* Shechem" **[text]**. In the KJV, Sychem at the end of the verse is a person, not the town. The town reference survives in all three through "carried over into Sychem", so the record's claim holds, but it should rest on that clause. The underlying Greek manuscripts differ here **[memory]**; I did not verify the apparatus.

**Second discrepancy is only hinted at.** The record says Acts' "plural burial statement also needs care". It should be stated plainly, because it is separate from the purchaser question:

- Acts 7:15–16: "Jacob … died, he, and our fathers, and were carried over into Sychem" **[text]**. Read with Jacob included in the subject, Jacob is buried at Shechem.
- Genesis 50:13 buries Jacob at Machpelah **[text per record]**.
- Limit: the plural verb can be read as covering "our fathers" only. The sentence does not force Jacob into it.
- Limit: no Old Testament passage narrates the burial of Joseph's brothers anywhere. Acts' claim about them is unparalleled, not contradicted.

**Missing parallel — Genesis 48:22.** Jacob tells Joseph he is giving him "one portion above thy brethren, which I took out of the hand of the Amorite with my sword and with my bow" **[text]**. Joshua 24:32 says the Shechem parcel was *bought* and became the inheritance of Joseph's descendants **[text]**.

- Explicit: one passage says purchase; the other says taken by weapons.
- Inference: that both refer to the same land. The link rests on the Hebrew word for "portion" resembling the name Shechem **[memory]** and on John 4:5 placing "the parcel of ground that Jacob gave to his son Joseph" near Sychar **[text]**. The KJV wording alone does not show it.
- This belongs in the record as a qualified third comparison, or in the unresolved list.

**Status.** The record is `Context`. The purchaser comparison has the same sellers (sons of Hamor), the same place and act, and a different named buyer. Under the standard in `research/REVIEW.md` ("actual incompatible figures/statements under comparable conditions") that is closer to `Textual conflict` than most `Context` records. I recommend Codex decide deliberately; the burial-place and Genesis 48 points should stay `Context` either way.

**Not a discrepancy — do not add.** Joshua 24:32 KJV says "pieces of silver" and Genesis 33:19 KJV says "pieces of money" **[text]**. Same transaction, same count of one hundred; the difference is translation.

**Sources**

- https://ebible.org/eng-kjv/ACT07.htm — KJV "father of Sychem".
- https://ebible.org/eng-web/ACT07.htm — WEB "of Shechem".
- https://ebible.org/eng-kjv/GEN48.htm — sword-and-bow portion.
- https://ebible.org/eng-kjv/JHN04.htm — parcel given to Joseph.
- https://tips.translation.bible/tip_verse/acts-716/ — translators' note that the plural's scope is ambiguous **[search]**.

**Unresolved:** Greek manuscript readings at Acts 7:16. Whether Genesis 48:22 and 33:19 concern the same land.

---

### A3. `joshua-achan-household-responsibility` (22:20 extension) — accurate; one witness fact bears directly on its main argument

**Verses:** Joshua 7:15, 7:24–25, 22:20.

The 22:20 extension is accurate and appropriately limited. I found no factual error.

**Missing witness fact.** The record's key evidence is the plural in 7:25 ("burned *them* … stoned *them*"). The Greek text of 7:25 ends at "all Israel stoned *him* with stones" and has no plural burning or stoning clause **[fetched]** (Brenton, Joshua 7:25). So the household-execution reading depends on the longer Hebrew-based wording. Greek 7:24 still lists the sons and daughters as brought to the valley **[fetched]**.

**Under-used explicit text.** Joshua 7:15 announces in advance that the offender is to be burned "he and all that he hath" **[text]**. The record's text never quotes it. It is the nearest thing to an explicit statement of scope, though "all that he hath" does not say "children".

**Sources**

- https://ebible.org/eng-Brenton/JOS07.htm — shorter 7:25.
- https://ebible.org/eng-kjv/JOS07.htm — KJV plural wording.

**Unresolved:** Which form of 7:25 is earlier.

---

### A4. `early-conquest` (21:43–45; 22:4; 23; 24:11, 18) — accurate; three sharper comparisons available

No factual error found in the Joshua 21–24 portion. The possession/allocation/settlement distinction is fair and not overstated.

1. **Joshua 21:44 vs Judges 2:23.** "The Lord delivered all their enemies into their hand" **[text]** against "neither delivered he them into the hand of Joshua" **[text]**. This is the closest verbal opposition in the whole comparison, and the record does not yet cite Judges 2:23. It falls in Codex's Judges 1–2 batch; flagging so it is not missed.
2. **Joshua 24:11 is used only as a delivery summary.** Its distinctive claim is that "the men of Jericho fought against you" **[text]**. Joshua 6:1 says Jericho was shut up, "none went out" **[text]**, and 6:20 has the wall fall and the people go straight in **[text]**; no earlier engagement is narrated. Limit: resisting a siege, or fighting once the city was entered (6:20–21), can count as fighting. Minor; a one-sentence addition at most.
3. **Joshua 23:9**, "no man hath been able to stand before you unto this day" **[text]**, sits beside the rout at Ai (7:4–5). The record compares it only with remaining nations. Optional.

**Editorial observation, not a factual one:** the `text` field is now a single paragraph of roughly 1,000 words covering Exodus through Joshua 24. A reader opening the tag at Joshua 23:1 gets all of it. Codex may want to consider whether per-section text is feasible; I have not looked at the application code and am not proposing a change to it.

---

## B. Deferred items — where I can add evidence

### B1. Joshua 24:9, Balak "warred against Israel" — a direct counter-statement exists

Codex deferred this because "warred" may cover the hostile curse commission. That caution is right for Numbers 22–24 alone. But Judges 11:25 addresses the point directly: "did he [Balak] ever strive against Israel, or did he ever fight against them" **[text]** — a rhetorical question expecting "no".

**Proposed new record** (suggested id `balak-war-against-israel`, mode contradictions, status Context)

- **appliesTo:** Joshua 24:9–10; Judges 11:25; Numbers 22:5–6.
- **Summary:** "Joshua says Balak rose and warred against Israel. Jephthah later argues that Balak never fought Israel. Numbers narrates a hired curse and no battle."
- **Reasoning:** If "warred" means armed combat, the two speeches disagree. If it means hostile action by way of Balaam, as the rest of 24:9 goes on to describe, they do not. Joshua 24:9 itself moves straight from "warred" to "sent and called Balaam", which favors the second reading without proving it.
- **Limits:** Both are speeches by characters making an argument, not narrator reports. Jephthah's history in the same speech has other difficulties (Judges 11:24 speaks of Chemosh as the god of the king he is addressing **[text]**; Chemosh is elsewhere Moab's god **[memory]**), so his statement is not automatically the more reliable one.
- **Sources:** https://ebible.org/eng-kjv/JOS24.htm · https://ebible.org/eng-kjv/JDG11.htm · https://ebible.org/eng-kjv/NUM22.htm
- **Supporting detail:** Numbers 22:6 and 22:11 give Balak's aim as to "smite" or "overcome" Israel and drive them out **[text]** — an intention to fight, with no battle reported.
- **Unresolved:** Range of the Hebrew verb.

### B2. Joshua 24:1, 25–26, sanctuary at Shechem — the Greek text says Shiloh

Codex correctly declined to infer an unauthorized altar from 24:26. There is, however, a witness difference that is explicit:

- Packaged text: the assembly is at Shechem (24:1, 25) and a stone is set up "by the sanctuary of the Lord" (24:26) **[text]**.
- Greek text: the assembly is at "Selo" (Shiloh) in 24:1 and 24:25, and 24:25 adds "before the tabernacle of the God of Israel" **[fetched]**.
- Joshua 18:1 and 22:9, 12 put the tabernacle and the assembly at Shiloh **[text]**.

**Proposed new record** (suggested id `joshua-covenant-assembly-shechem-or-shiloh`, mode contradictions, status Context)

- **Summary:** "The Hebrew-based text sets Joshua's covenant assembly and a 'sanctuary of the Lord' at Shechem. Earlier chapters place the tabernacle at Shiloh, and the Greek text reads Shiloh here."
- **Reasoning:** Explicit: two place names in two textual traditions; a sanctuary reference at Shechem; the tabernacle at Shiloh. Inference: that "sanctuary" in 24:26 means the tabernacle, or a second holy place, or a temporarily moved ark. None is stated.
- **Limits:** Do not claim the Greek is a deliberate correction; that is a common scholarly view **[memory]** but it is a hypothesis about scribes. Do not use Deuteronomy 16:21–22 (tree and pillar beside an altar) as a conflict: Joshua 24:26 mentions a stone and an oak, not a planted cult tree, a pillar, or an altar.
- **Sources:** https://ebible.org/eng-kjv/JOS24.htm · https://ebible.org/eng-Brenton/JOS24.htm · https://ebible.org/eng-kjv/JOS18.htm
- **Unresolved:** Direction of the change between the two traditions.

### B3. Levite city lists, Joshua 21 vs 1 Chronicles 6 — the count comparison can be done from the packaged text

Codex deferred this pending "name/alias and textual-witness work". The aliases are indeed unresolved. The *arithmetic* is not, and it is the same kind of comparison as the existing `joshua-judah-town-totals` record.

**Counts in the packaged KJV [text]**

| Group | Joshua 21 names / stated total | 1 Chronicles 6 names / stated total |
|---|---|---|
| Aaron's line | 13 / 13 (vv. 13–19) | 11 / 13 (vv. 57–60) |
| Remaining Kohathites | 10 / 10 (vv. 21–26) | 8 / 10 (vv. 61, 67–70) |
| Gershon | 13 / 13 (vv. 27–33) | 13 / 13 (vv. 62, 71–76) |
| Merari | 12 / 12 (vv. 34–40) | 10 / 12 (vv. 63, 77–81) |
| All | 48 / 48 (v. 41) | 42 / 48 |

Codex's note that Joshua's own lists total 13+10+13+12=48 in this edition is correct.

- Chronicles lacks Juttah and Gibeon (Aaron), Eltekeh and Gibbethon (Kohath), and names two Zebulun towns where Joshua has four.
- Chronicles has no "tribe of Dan" heading; Aijalon and Gath-rimmon follow the Ephraim towns (6:69), and 6:61 attributes the ten to "the half tribe of Manasseh".

**Witness points inside Joshua 21**

- **21:25 names Gath-rimmon for Manasseh**, immediately after Gath-rimmon for Dan in 21:24 **[text]**. Chronicles has Bileam (6:70) **[text]**; the Greek has "Jebatha" **[fetched]**. A copying repetition in the Hebrew is the usual explanation **[memory]**; it is an inference.
- **21:36–37 (the four Reubenite towns)** are missing from some Hebrew manuscripts and older printed editions and present in the Greek and in Chronicles **[search]** — the UBS translators' handbook reports the Hebrew Old Testament Text Project judging them original. Without them, Joshua's names total 44 against a stated 48 and Merari has 8 against 12. I did **not** verify which specific codices lack the verses; do not name Leningrad or Aleppo on my word.
- The Greek calls Bezer a city of refuge at 21:36 **[fetched]**; the packaged KJV does not **[text]**, though Joshua 20:8 does assign Bezer as one **[text]**.

**Related explicit comparison for `early-conquest`.** Joshua 21 assigns Levites Gezer (v. 21), Taanach (v. 25), Aijalon (v. 24), Rehob (v. 31) and Nahalal (v. 35) **[text]**. Joshua 16:10 and 17:11–12 and Judges 1:27–35 say Canaanites or Amorites stayed in Gezer (1:29), Taanach (1:27), Aijalon (1:35), Rehob (1:31) and Nahalol (1:30) **[text for Judges 1; Joshua 16–17 per the existing record]**. Nahalal/Nahalol and the two Rehobs are assumed to be the same places. This fits the record's existing allocation-is-not-possession point and would be a short extension there.

**Proposed record** (suggested id `levite-city-lists-joshua-chronicles`, mode contradictions, status Context; or extend `joshua-judah-town-totals`)

- **Summary:** "Joshua names 48 Levite towns and totals 48. Chronicles gives the same subtotals but names 42. One Joshua town name repeats, and two verses are absent from some Hebrew copies."
- **Limits:** Differing names (Holon/Hilen, Ain/Ashan, Almon/Alemeth, Kibzaim/Jokmeam, Kishon/Kedesh, and the others) may be alternate names or copying variants; do not count each as a contradiction. Chronicles' shortfall can be loss in transmission, abbreviation, or an earlier form of the list — a University of Edinburgh study argues Chronicles preserves the earlier stage **[search]**.
- **Sources:** https://ebible.org/eng-kjv/JOS21.htm · https://ebible.org/eng-kjv/1CH06.htm · https://ebible.org/eng-Brenton/JOS21.htm · https://tips.translation.bible/story/translation-commentary-on-josh-2134-2140/ (21:36–37 status) · https://era.ed.ac.uk/items/ab8b34a9-1ea9-4630-b40f-70f1c8bf55cc (Joshua/Chronicles list relationship)
- **Unresolved:** Manuscript specifics for 21:36–37. Date of the list — scholars have proposed dates from the united monarchy to much later **[search/memory]**; I could not retrieve a primary scholarly source and am **not** proposing a history-mode record on dating.

### B4. Agreed deferrals

- **24:19** (cannot serve / will not forgive): agree. It is hyperbolic warning inside a covenant dialogue that ends with the people being accepted (24:21–25).
- **24:27** (stone "hath heard"): agree. Witness-object figure; no science claim.
- **Altar location in 22:10–11.** KJV says the altar was built at borders of Jordan "that are in the land of Canaan" (v. 10) and then "over against the land of Canaan" (v. 11) **[text]**. Which bank is meant is unclear from the wording. Codex already lists location as unresolved; I would not add a record.
- **22:34 "Ed".** KJV names the altar "Ed"; WEB has no name-word and renders the sentence itself as the name **[text]**. The word is supplied in the KJV **[memory]**. Translation difference, not a discrepancy.

---

## C. Lower-confidence candidates not yet assessed by Codex

Offered for triage. I would not add any of these without further review.

1. **Joshua 24:33.** Eleazar is buried on a hill "given" to Phinehas "in mount Ephraim" **[text]**. Joshua 21:4, 13–19 give Aaron's line towns only in Judah, Simeon and Benjamin **[text]**. Inference: a priestly holding outside the allotted towns. The text does not say it was a Levitical town or who gave it.
2. **Joshua 24:30 vs Judges 2:9.** Timnath-serah vs Timnath-heres **[text]**. Same consonants reordered; spelling variant, not a contradiction. Codex's Judges 2 batch.
3. **Greek additions.** The Greek adds that the stone knives of the Gilgal circumcision were buried with Joshua (after 21:42 and after 24:30) and has extra verses after 24:33 **[fetched]**. Witness difference only.
4. **Joshua 24:2, 14.** Ancestors served other gods beyond the river and "in Egypt" **[text]**. Exodus does not narrate Israelite idolatry in Egypt; Ezekiel 20:7–8 does **[memory]**. Additional information, not a conflict. Do not add.
5. **Shechem's absence from the conquest narrative.** Joshua holds assemblies near or at Shechem (8:30–35; 24) but no capture of Shechem is narrated **[memory]**. Argument from silence. Do not add without scholarly sourcing.

---

## D. Summary for triage

| Item | Type | My confidence | Action suggested |
|---|---|---|---|
| A1 hornet: "two kings" identification; 24:8/11 fighting; Greek "twelve" | Overstated identification + missing context | High | Revise record |
| A2 Shechem: KJV wording; Jacob's burial place; Gen 48:22; status | Missing context; status question | High (wording), medium (status) | Revise record |
| A3 Achan: Greek 7:25 shorter | Missing context | High | One-sentence addition |
| A4 conquest: Judg 2:23; Jericho "fought" | Missing context | High / low | Fold into Judges 2 work |
| B1 Balak warred vs Judges 11:25 | New, explicit | High | New Context record |
| B2 Shechem vs Shiloh | New, witness difference | High on wording | New Context record |
| B3 Levite city counts | New, arithmetic | High on counts; low on manuscripts | New or extended record |
| C1–C5 | Leads | Low | Hold |

No factual errors were found in the two checkpoint notes themselves (verse counts 79 and 49, subgroup totals, and the Deuteronomy 12/27 reading all check out).
