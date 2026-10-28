# Draft fixes applied — 2026-10-26

**188 input drafts fixed; 13 remain open for Claude research.**

The 188 fixed inputs yield 187 proposals: 45 translation records, 138 profiles, and four History/timeline pairs.
The two Song oath inputs form one proposal. The Esther God-naming input extends the existing record by stable ID.
No proposal has been accepted by the owner or integrated into app data.

## Scope and verification

- Worktree: `/Users/kevin/git/BibleLens-draftfix`; branch: `codex/draft-fixes`, based on `codex/review-units`.
- Fetched origin before creating the isolated worktree. All work and self-review were performed without sub-agents.
- The 18 JSON inputs were absent from the review checkout. Restored only those files from the review’s pinned draft commit.
- Checked all 36 original record/note fingerprints against that commit. The 13 returned objects remain deeply equal to their originals.
- No edits to `data/`, `src/`, release identity, built assets, main, Phase 1, other worktrees or stashes.
- No build, release script, push, PR, publish, deploy, stash, clean or reset.

Run `node research/codex-reviews/2026-10-26/verify-fixes.mjs` from the repository root for the read-only local checks.
Full results, file fingerprints and source response hashes are in [fixes-verification.json](fixes-verification.json).

Ready subset results:

- 49 evidence/history records pass witness, reference and exact side-quote validation; 45 are translation proposals and four are History Context.
- All 138 proposed profiles pass the character validator alongside 47 current profiles, for 185 combined.
- Four revised timeline events pass against their complete linked History records. The four returned events retain unresolved draft IDs.
- 61 KJV quotation spans in evidence/history text and 42 quoted profile spans match packaged text exactly.
- 1,154 profile verse anchors exist; all 326 retained story links pass catalog validation.
- All 109 fetched source URLs returned HTTP 200. Content checks passed for 114 retained Hebrew/Greek spans and 12 English translation quotes.
- The 106 accepted-input language spans from the original audit still match the fetched source text. The extra spans include retained Esther comparisons.
- Checked the academic Hebrew passages and read the supplied historical sources. PDF pages 46–47 were rendered and visually checked.
- Read 38 selected packaged verses again for the corrected profile actions, timing, kinship and quotation limits.

The source checks cover the cited digital editions and supplied research. They do not establish every ancient copy or a new reading of inscriptions.
Source success alone was not treated as evidence for a claim. No new finding was researched.

## Writing and self-review

Ready collection mean grades: translation evidence 6.34; profiles 6.29; History 7.89.
The summary/reasoning/scope screen has no overlength sentences or unexplained checker terms.
The same checks pass for profile geography, aliases and lineage text, plus revised timeline date/status prose.
Scripture quotations, source titles and exact language quotations remain exempt.
Plain edition labels replace shorthand in prose; full edition names remain in Sources.

`npm run check:readability` completed in report-only mode. It still reports the unchanged app baseline findings recorded in README.
This is a passing check for the revised draft prose, not a claim that all app prose passes.

Self-review checked every listed fix against the final objects, all 188 input mappings and the retained 13 returns.
It caught an extra name collision: Jeroboam’s son Nadab must not link to Aaron’s son Nadab.
That link is suppressed. Mary/Joseph, Peter/Andrew, the Zebedee brothers and the specified royal-family links use explicit targets.

## Corrections to review instructions

Source verification takes precedence over a mistaken label or quote in the review:

- **Esther rod passage:** the Greek page prints **5:2**, not 5:1e. The original audit also matched it at 2. Greek 5:1e is the separate God-changing-the-king passage.
- **Pilate inscription:** packaged John 19:19 prints **Jesus Of Nazareth The King Of The Jews**. The review’s uppercase replacement would fail an exact packaged quote check.
- **Belshazzar:** Daniel 5:25 prints **Mene, Mene, Tekel, Upharsin**. Corrected the draft’s uppercase quotation.
- **Ecclesiastes 7:18:** removed the extra space before the English quotation’s final period to match its source.

These are source/quotation corrections within the requested fixes, not new research claims.

## Draft-only structural instructions

`reference_binding` pins each profile to its reviewed reference row and disables inherited family edges.
`lineage_bindings` lists only explicit profile targets. Ambiguous or unsupported names remain text without automatic links.
These fields are draft integration instructions; current runtime behavior was not changed.

`academic-cards-records.json` contains four complete `history_records` linked by the four revised events.
They remain Context and do not invent discrepancy flags. Verified claims moved out of `academic_consensus`.
`display_title` supplies Title Case and the Egypt date correction while each underlying research title stays unchanged.
`draft_related_records` links the Egypt proposal to the existing internal Tyre comparison without duplicating that finding.
These draft metadata fields also require deliberate handling during any later owner-approved integration.

## Per-draft fixes and verification

### `abram-went-up-into-the-south-or-into-the-wilderness-genesis-13-1-13-3`

Draft: [genesis-second-pass-records.json](../../claude-drafts/genesis-second-pass-records.json). Review: [d16-genesis-second-pass.md](d16-genesis-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: The KJV places Abram's journey “into the south” and then “from the south” toward Bethel. The Hebrew text supports the south wording. The old Greek translation describes travel into the wilderness at both points.
Scope now: This comparison concerns Genesis 13:1 and 13:3 in the old Greek translation. No error in translating the Hebrew is claimed. The Hebrew may name a district; this record does not choose between that sense and direction. The wording does not prove different places on the ground. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 2 KJV text quotes and 4 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `lot-dwelt-in-the-cities-of-the-plain-toward-sodom-or-a-city-in-sodom-genesis-13-12`

Draft: [genesis-second-pass-records.json](../../claude-drafts/genesis-second-pass-records.json). Review: [d16-genesis-second-pass.md](d16-genesis-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: The KJV says Lot lived in cities of the plain and pitched his tent toward Sodom. The Hebrew text has cities, while the old Greek translation has one city and places his tent in Sodom.
Scope now: The comparison concerns Genesis 13:12 in the old Greek translation; the KJV agrees with the Hebrew text. Genesis 14:12 says Lot “dwelt in Sodom”. Both descriptions may fit the account, but the timing of any move is unstated. The Hebrew wording is not shown to exclude being in Sodom. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `abram-seed-as-the-dust-of-the-earth-or-the-sand-of-the-earth-genesis-13-16`

Draft: [genesis-second-pass-records.json](../../claude-drafts/genesis-second-pass-records.json). Review: [d16-genesis-second-pass.md](d16-genesis-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: Genesis 13:16 twice compares Abram's descendants to “the dust of the earth” in the KJV and Hebrew text. The old Greek translation twice uses sand of the earth.
Scope now: The comparison concerns Genesis 13:16 in the old Greek translation. The KJV agrees with the Hebrew text; no Hebrew translation error is claimed. Other verses comparing descendants with dust or sand are outside this check. This is a wording comparison, not a science claim. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `plain-of-mamre-or-oaks-of-mamre-genesis-13-18`

Draft: [genesis-second-pass-records.json](../../claude-drafts/genesis-second-pass-records.json). Review: [d16-genesis-second-pass.md](d16-genesis-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: The KJV says Abram “dwelt in the plain of Mamre”. The Hebrew text uses a plural word for trees. The old Greek translation places him by the oak of Mambre.
Scope now: The finding applies only at Genesis 13:18 to the Hebrew text and old Greek translation. Genesis 14:13 and 18:1 have related Hebrew wording, but their Greek wording was not compared here. Oak, terebinth and other large trees remain possible readings of the Hebrew word. The record does not decide whether a grove stood on a plain or why the KJV uses its wording. The separate Mamre question about visitors concerns another issue. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `thy-mothers-sons-bow-down-or-sons-of-thy-father-genesis-27-29`

Draft: [genesis-second-pass-records.json](../../claude-drafts/genesis-second-pass-records.json). Review: [d16-genesis-second-pass.md](d16-genesis-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: The KJV and Hebrew text name the sons of Jacob's mother as bowing to him. The old Greek translation names his father's sons. The verse also contrasts peoples bowing in the KJV and Hebrew text with rulers bowing in Greek.
Scope now: The comparison concerns Genesis 27:29 in the old Greek translation. The KJV agrees with the Hebrew text. A Hebrew note gives a form to write and a form to read for the bowing verb. That note is background, not this finding. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 2 KJV text quotes and 4 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `judah-and-hirah-his-friend-or-his-shepherd-genesis-38-12-38-20`

Draft: [genesis-second-pass-records.json](../../claude-drafts/genesis-second-pass-records.json). Review: [d16-genesis-second-pass.md](d16-genesis-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: The KJV calls Hirah Judah's friend at Genesis 38:12 and 38:20, agreeing with the Hebrew text. The old Greek translation calls him Judah's shepherd in both verses.
Scope now: The comparison concerns Genesis 38:12 and 38:20 in the old Greek translation. The KJV agrees with the supplied Hebrew text; no Hebrew translation error is claimed. This record does not establish the earliest Hebrew vowel signs or whether they differed. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 2 KJV text quotes and 4 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `tamar-sat-in-an-open-place-or-at-the-gates-of-aenan-genesis-38-14-38-21`

Draft: [genesis-second-pass-records.json](../../claude-drafts/genesis-second-pass-records.json). Review: [d16-genesis-second-pass.md](d16-genesis-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: The KJV describes an open place by the road to Timnath at Genesis 38:14 and 38:21. The old Greek translation instead names Aenan, using its gates at 38:14 and the place at 38:21.
Scope now: The comparison concerns Genesis 38:14 and 38:21 in the old Greek translation. The Hebrew form can be read as a place name or ordinary words involving eyes or springs. This record does not establish an error in the KJV's Hebrew translation. It does not identify Aenan with another biblical Enaim or Enam. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 2 KJV text quotes and 4 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `captain-of-the-guard-charged-joseph-or-the-chief-of-the-prison-genesis-40-3-40-4`

Draft: [genesis-second-pass-records.json](../../claude-drafts/genesis-second-pass-records.json). Review: [d16-genesis-second-pass.md](d16-genesis-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: Genesis 40:3 in the KJV places the officers in the captain of the guard's house, within the prison. The old Greek translation does not include the house phrase there. At 40:4, it names the prison's chief where the KJV and Hebrew text name the captain of the guard.
Scope now: The comparison concerns Genesis 40:3 and 40:4 in the old Greek translation. The KJV agrees with the Hebrew text. Both titles may apply during the same period or to one man; this record does not decide. Genesis 39:21–23 supplies KJV context, not another Greek comparison. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 2 KJV text quotes and 4 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `nakedness-of-the-land-or-the-tracks-of-the-land-genesis-42-9-42-12`

Draft: [genesis-second-pass-records.json](../../claude-drafts/genesis-second-pass-records.json). Review: [d16-genesis-second-pass.md](d16-genesis-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Genesis 42:9 and 42:12, the KJV has Joseph accuse the brothers of seeking “the nakedness of the land”. The Hebrew text agrees. The old Greek translation uses the land's tracks or footprints.
Scope now: The comparison concerns Genesis 42:9 and 42:12 in the old Greek translation. The KJV agrees with the Hebrew text. The Greek could use tracks as an image for weak points or access routes; that reading is not established here. The wording does not prove separate spying missions or an error in the Greek translation. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 2 KJV text quotes and 4 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `we-are-true-men-or-we-are-peaceable-genesis-42-11`

Draft: [genesis-second-pass-records.json](../../claude-drafts/genesis-second-pass-records.json). Review: [d16-genesis-second-pass.md](d16-genesis-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: The KJV calls the brothers true men at Genesis 42:11 and 42:34, agreeing with the Hebrew text. The old Greek translation calls them peaceable.
Scope now: The comparison concerns Genesis 42:11 and 42:34 in the old Greek translation. Genesis 42:19, 31 and 33 remain context here. The KJV agrees with the Hebrew text, and no error in the Greek translation is claimed. Other Genesis uses of the Hebrew word were not examined. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 2 KJV text quotes and 4 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `joseph-asks-after-jacob-greek-adds-blessed-be-that-man-genesis-43-28`

Draft: [genesis-second-pass-records.json](../../claude-drafts/genesis-second-pass-records.json). Review: [d16-genesis-second-pass.md](d16-genesis-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Genesis 43:28, the KJV has the brothers report their father's health and bow down. The Hebrew text gives no spoken reply from Joseph there. The old Greek translation adds a reply blessing that man by God before the bowing.
Scope now: The comparison concerns Genesis 43:28 in the old Greek translation. The KJV agrees with the Hebrew text. The wording does not establish Joseph's feelings or identify “that man” beyond the Greek words. Verses 43:27–29 were compared; no other addition of this kind was found there. A Hebrew note gives written and read forms for bowed; that note is background, not this finding. The added reply is not claimed for all ancient Greek copies. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `the-slayer-at-the-gate-of-the-city-or-no-such-verses-joshua-20-4-6-greek`

Draft: [ot-remainder-1-second-pass-records.json](../../claude-drafts/ot-remainder-1-second-pass-records.json). Review: [d25-ot-remainder-1-second-pass.md](d25-ot-remainder-1-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: Joshua 20:4–6 in the KJV describes a hearing at a refuge city's gate. It also describes the stay until the high priest dies. The Hebrew text includes these verses. The cited page of the old Greek translation jumps from verse 3 to verse 7.
Scope now: The finding covers Joshua 20:4, 20:5 and 20:6 only. It does not establish whether Greek lost the verses or Hebrew gained them. Numbers 35 and Deuteronomy 19 were not compared here, and no conflict with them is claimed. Other ancient Greek copies were not checked. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `appliesTo`: `["Joshua 20:4–6"]` → `["Joshua 20:4", "Joshua 20:5", "Joshua 20:6"]`.
- `languageContext`: `"Hebrew Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- `ref`: `"Joshua 20:4–6"` → `"Joshua 20:4"`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `buried-in-one-of-the-cities-of-gilead-or-in-his-city-gilead-judges-12-7-greek`

Draft: [ot-remainder-1-second-pass-records.json](../../claude-drafts/ot-remainder-1-second-pass-records.json). Review: [d25-ot-remainder-1-second-pass.md](d25-ot-remainder-1-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: The KJV puts Jephthah's burial “in one of the cities of Gilead”. The Hebrew text uses cities of Gilead. The old Greek translation instead has his city, Galaad.
Scope now: This comparison concerns Judges 12:7 only. It does not identify the burial site or settle whether Gilead names a city or region here. It does not claim the KJV's added “one of” is wrong or explain the translators' motives. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `ten-shekels-by-the-year-or-ten-of-silver-a-day-judges-17-10-greek`

Draft: [ot-remainder-1-second-pass-records.json](../../claude-drafts/ot-remainder-1-second-pass-records.json). Review: [d25-ot-remainder-1-second-pass.md](d25-ot-remainder-1-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: Judges 17:10 in the KJV offers the Levite ten shekels of silver “by the year”. The old Greek translation gives ten of silver for a day. The Hebrew text uses a phrase involving days.
Scope now: The finding concerns only the year/day contrast at Judges 17:10. The unstated silver unit in Hebrew and Greek is not another finding. The record does not decide the intended interval, establish an exact wage or claim the Greek misread its source. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `an-house-of-gods-or-a-house-of-god-judges-17-5-greek`

Draft: [ot-remainder-1-second-pass-records.json](../../claude-drafts/ot-remainder-1-second-pass-records.json). Review: [d25-ot-remainder-1-second-pass.md](d25-ot-remainder-1-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: Judges 17:5 in the KJV says Micah “had an house of gods”. The old Greek translation uses a singular phrase, house of God.
Scope now: The finding concerns the KJV/Greek wording at Judges 17:5, not two established conflicting facts. It does not decide the author's intended reading or call the KJV wrong. Judges 17:3 and 17:13 were not compared here. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `the-lord-hath-testified-against-me-or-the-lord-humbled-me-ruth-1-21-greek`

Draft: [ot-remainder-1-second-pass-records.json](../../claude-drafts/ot-remainder-1-second-pass-records.json). Review: [d25-ot-remainder-1-second-pass.md](d25-ot-remainder-1-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Ruth 1:21, the KJV has Naomi say “the Lord hath testified against me”. The old Greek translation says the Lord humbled her.
Scope now: This comparison concerns Ruth 1:21 only. No dictionary was opened to settle the Hebrew word's meaning. The finding is limited to the KJV and the named Greek edition, without claiming a Hebrew translation error. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- `sides`: `[{"label": "A", "ref": "Ruth 1:21", "quote": "the LORD hath testified against me"}]` → `[{"label": "A", "ref": "Ruth 1:21", "quote": "the Lord hath testified against me"}]`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `perfect-peace-and-at-such-a-time-or-let-the-word-and-answer-be-completed-ezra-7-12-greek`

Draft: [ot-remainder-2-second-pass-records.json](../../claude-drafts/ot-remainder-2-second-pass-records.json). Review: [d26-ot-remainder-2-second-pass.md](d26-ot-remainder-2-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: Ezra 7:12 in the KJV greets Ezra with “perfect peace, and at such a time”. The old Greek translation asks that the word and answer be completed. The source language of this verse is Aramaic.
Scope now: This finding concerns the greeting/completion wording at Ezra 7:12 only. The difficult Aramaic phrase does not establish a KJV translation error here. This record does not prove the meaning of a Persian official formula. The cited Greek edition groups Ezra and Nehemiah under Esdras. These digital editions do not show what all ancient copies contain or which wording came first. Other copies of the source text were not checked. Sources name the Aramaic text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew and Aramaic Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Aramaic text and the old Greek translation; full edition names are in Sources."`.
- Updated source labels/links; original verified citations retained, with review-supplied checks added where needed.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `banishment-or-chastisement-ezra-7-26-greek`

Draft: [ot-remainder-2-second-pass-records.json](../../claude-drafts/ot-remainder-2-second-pass-records.json). Review: [d26-ot-remainder-2-second-pass.md](d26-ot-remainder-2-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: Ezra 7:26 in the KJV lists death, banishment, loss of goods and imprisonment. The old Greek translation uses chastisement, or corrective punishment, as its second item. Both lists have four items.
Scope now: The finding concerns only the second penalty at Ezra 7:26. The fourth items are outside this comparison. No KJV error or settled meaning of the Aramaic word in Persian official usage is claimed. The cited Greek edition groups Ezra and Nehemiah under Esdras. These digital editions do not show what all ancient copies contain or which wording came first. Other copies of the source text were not checked. Sources name the Aramaic text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew and Aramaic Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Aramaic text and the old Greek translation; full edition names are in Sources."`.
- Updated source labels/links; original verified citations retained, with review-supplied checks added where needed.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `our-priests-or-our-children-ezra-9-7-greek`

Draft: [ot-remainder-2-second-pass-records.json](../../claude-drafts/ot-remainder-2-second-pass-records.json). Review: [d26-ot-remainder-2-second-pass.md](d26-ot-remainder-2-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Ezra 9:7, the KJV and Hebrew text name “our kings, and our priests” among those handed over. The old Greek translation instead names our sons.
Scope now: The finding concerns the priests/sons wording at Ezra 9:7 only. It does not decide which group Ezra intended or whether the Greek had a different Hebrew source. No KJV translation error is claimed. The cited Greek edition groups Ezra and Nehemiah under Esdras. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew and Aramaic Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `an-unclean-land-or-a-land-of-removal-ezra-9-11-greek`

Draft: [ot-remainder-2-second-pass-records.json](../../claude-drafts/ot-remainder-2-second-pass-records.json). Review: [d26-ot-remainder-2-second-pass.md](d26-ot-remainder-2-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Ezra 9:11, the KJV and Hebrew text describe an unclean land and the people's impurity. The old Greek translation uses wording about a land being moved and removal.
Scope now: The finding concerns the paired terms at Ezra 9:11 only. It does not identify the prophetic text cited there or establish a different Hebrew source behind the Greek. No KJV translation error is claimed. The cited Greek edition groups Ezra and Nehemiah under Esdras. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew and Aramaic Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `punished-less-than-deserved-and-would-not-thou-be-angry-ezra-9-13-14-greek`

Draft: [ot-remainder-2-second-pass-records.json](../../claude-drafts/ot-remainder-2-second-pass-records.json). Review: [d26-ot-remainder-2-second-pass.md](d26-ot-remainder-2-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Ezra 9:13, the KJV says God has “punished us less than our iniquities deserve”. Verse 14 asks whether God would be angry if they sinned again. The old Greek translation describes God as unequalled, lightening their wrongs, then pleads that God not be angry.
Scope now: The finding concerns Ezra 9:13 and Ezra 9:14 only. The question and plea may reflect choices in translation. This record does not decide Ezra's intended meaning or claim a KJV error. The cited Greek edition groups Ezra and Nehemiah under Esdras. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `appliesTo`: `["Ezra 9:13–14"]` → `["Ezra 9:13", "Ezra 9:14"]`.
- `languageContext`: `"Hebrew and Aramaic Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- `ref`: `"Ezra 9:13–14"` → `"Ezra 9:13"`.
- `sides`: `[{"label": "A", "ref": "Ezra 9:13", "quote": "thou our God hast punished us less than our iniquities deserve"}, {"label": "A", "ref": "Ezra 9:13", "quote": "wouldest not thou be angry with us till thou hadst consumed us"}]` → `[{"label": "A", "ref": "Ezra 9:13", "quote": "thou our God hast punished us less than our iniquities deserve"}, {"label": "A", "ref": "Ezra 9:14", "quote": "wouldest not thou be angry with us till thou hadst consumed us"}]`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `other-men-have-our-lands-or-they-belong-to-the-honourable-nehemiah-5-5-greek`

Draft: [ot-remainder-2-second-pass-records.json](../../claude-drafts/ot-remainder-2-second-pass-records.json). Review: [d26-ot-remainder-2-second-pass.md](d26-ot-remainder-2-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Nehemiah 5:5, the KJV says “other men have our lands and vineyards”. The Hebrew text names others. The old Greek translation calls them honourable people.
Scope now: The finding concerns one phrase at Nehemiah 5:5 only. It does not settle which group the Greek means or establish a different Hebrew source. No KJV translation error is claimed. The cited Greek edition groups Ezra and Nehemiah under Esdras. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew and Aramaic Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `the-hundredth-part-or-of-the-money-nehemiah-5-11-greek`

Draft: [ot-remainder-2-second-pass-records.json](../../claude-drafts/ot-remainder-2-second-pass-records.json). Review: [d26-ot-remainder-2-second-pass.md](d26-ot-remainder-2-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Nehemiah 5:11, the KJV asks for lands to be restored. It also names a hundredth part of money, grain, wine and oil. The Hebrew text includes the hundredth wording. The old Greek translation gives no hundredth fraction.
Scope now: The finding concerns this phrase at Nehemiah 5:11 only. The record does not decide between a hundredth and interest due as readings of the Hebrew. It does not claim a KJV error or establish a different Hebrew source for Greek. The cited Greek edition groups Ezra and Nehemiah under Esdras. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew and Aramaic Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `bread-of-the-governor-or-bread-of-extortion-nehemiah-5-14-18-greek`

Draft: [ot-remainder-2-second-pass-records.json](../../claude-drafts/ot-remainder-2-second-pass-records.json). Review: [d26-ot-remainder-2-second-pass.md](d26-ot-remainder-2-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Nehemiah 5:14 and 5:18, the KJV says Nehemiah did not take “the bread of the governor”. The Hebrew text names the governor too. The old Greek translation uses force at 5:14 and bread of force or extortion at 5:18.
Scope now: The finding concerns only Nehemiah 5:14 and 5:18, not the whole range between them. The joined quotation skips verses 15–17. The record does not decide whether Greek read the Hebrew differently or restated it. It does not judge whether Nehemiah's allowance was lawful or claim a KJV translation error. The food-list finding remains separate. The cited Greek edition groups Ezra and Nehemiah under Esdras. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `appliesTo`: `["Nehemiah 5:14–18"]` → `["Nehemiah 5:14", "Nehemiah 5:18"]`.
- `languageContext`: `"Hebrew and Aramaic Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- `ref`: `"Nehemiah 5:14–18"` → `"Nehemiah 5:14"`.
- `sides`: `[{"label": "A", "ref": "Nehemiah 5:14", "quote": "have not eaten the bread of the governor"}, {"label": "A", "ref": "Nehemiah 5:14", "quote": "required not I the bread of the governor"}]` → `[{"label": "A", "ref": "Nehemiah 5:14", "quote": "have not eaten the bread of the governor"}, {"label": "A", "ref": "Nehemiah 5:18", "quote": "required not I the bread of the governor"}]`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `fowls-or-a-goat-nehemiah-5-18-greek`

Draft: [ot-remainder-2-second-pass-records.json](../../claude-drafts/ot-remainder-2-second-pass-records.json). Review: [d26-ot-remainder-2-second-pass.md](d26-ot-remainder-2-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Nehemiah 5:18, the KJV lists one ox, six choice sheep and fowls for the daily meal. The Hebrew text has birds. The old Greek translation has a goat in their place.
Scope now: This finding concerns the food-list wording at Nehemiah 5:18 only. It does not decide what Nehemiah actually served or claim a KJV translation error. The governor's allowance remains a separate finding. The cited Greek edition groups Ezra and Nehemiah under Esdras. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew and Aramaic Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `men-of-tyre-dwelt-therein-not-in-the-greek-nehemiah-13-16`

Draft: [ot-remainder-2-second-pass-records.json](../../claude-drafts/ot-remainder-2-second-pass-records.json). Review: [d26-ot-remainder-2-second-pass.md](d26-ot-remainder-2-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Nehemiah 13:16, the KJV and Hebrew text identify fish sellers as people from Tyre. The old Greek translation describes people bringing fish without naming Tyre.
Scope now: The finding concerns the name at Nehemiah 13:16 only. It does not settle the sellers' origin or claim that a translator deliberately removed the name. The cited Greek edition groups Ezra and Nehemiah under Esdras. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew and Aramaic Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `or-for-yourselves-not-in-the-greek-nehemiah-13-25`

Draft: [ot-remainder-2-second-pass-records.json](../../claude-drafts/ot-remainder-2-second-pass-records.json). Review: [d26-ot-remainder-2-second-pass.md](d26-ot-remainder-2-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Nehemiah 13:25, the KJV forbids taking foreign daughters for the men's sons “or for yourselves”. The Hebrew text includes that ending. The old Greek translation ends with the sons.
Scope now: The finding concerns the closing phrase at Nehemiah 13:25 only. It does not claim deliberate removal, absence from all ancient Greek copies or a KJV translation error. The cited Greek edition groups Ezra and Nehemiah under Esdras. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew and Aramaic Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `esther-drew-near-and-touched-the-sceptre-or-the-king-laid-it-on-her-neck-esther-5-2-greek`

Draft: [esther-second-pass-records.json](../../claude-drafts/esther-second-pass-records.json). Review: [d21-esther-second-pass.md](d21-esther-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: Esther 5:2 in the KJV and Hebrew text has Esther approach and touch the king's sceptre. The old Greek translation at printed label 5:2 has the king place the rod on her neck. He then greets her.
Scope now: This comparison links KJV Esther 5:2 with the Greek page's printed label 5:2. The surrounding Greek lettered passage describes Esther fainting and the king coming down to her. Its added wording has no direct KJV counterpart. The actions do not prove the accounts could not describe one scene. Greek lettered labels are retained as the page prints them. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

Source correction: Printed Greek label is 5:2. The review prose incorrectly requested 5:1e; its own audit already matched this quote at verse 2. God-changing-the-king passage is 5:1e.

### `she-obtained-favour-in-his-sight-or-god-changed-the-spirit-of-the-king-esther-5-1-greek`

Draft: [esther-second-pass-records.json](../../claude-drafts/esther-second-pass-records.json). Review: [d21-esther-second-pass.md](d21-esther-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: The old Greek translation names God in five places where the KJV and Hebrew text do not. Mordecai tells Esther to fear God at 2:20 and call on the Lord at 4:8. At 6:1, the Lord removes the king’s sleep. At 6:13, Haman hears that a living God is with Mordecai. At Greek 5:1e, God changes the king’s spirit to gentleness; the paired KJV passage is 5:2. A whole-word search of the packaged KJV’s Esther finds no God, gods or Lord, in any letter case.
Scope now: This comparison includes Esther 2:20, 4:8, 6:1 and 6:13. It also pairs KJV 5:2 with Greek 5:1e. Only that added comparison uses a lettered Greek passage. Other lettered passages are not included. The KJV word search does not establish what the book implies. The finding does not decide whether the Greek addition is earlier or later or which wording came first. Greek lettered labels remain distinct from KJV verse numbers. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `appliesTo`: `["Esther 5:2"]` → `["Esther 6:1", "Esther 2:20", "Esther 4:8", "Esther 6:13", "Esther 5:2"]`.
- `draft_action`: `null` → `"extend-existing-record"`.
- `id`: `"she-obtained-favour-in-his-sight-or-god-changed-the-spirit-of-the-king-esther-5-1-greek"` → `"god-named-in-the-greek-of-esther-where-the-kjv-names-none"`.
- `languageContext`: `"Hebrew Old Testament and Greek Old Testament · Westminster Leningrad Codex (WLC) digital text and Brenton’s Septuagint"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- `ref`: `"Esther 5:2"` → `"Esther 6:1"`.
- `refs`: `[{"label": "Esther 5:2", "book": 16, "chapter": 5, "verse": 2}]` → `[{"label": "Esther 6:1", "book": 16, "chapter": 6, "verse": 1}, {"label": "Esther 2:20", "book": 16, "chapter": 2, "verse": 20}, {"label": "Esther 4:8", "book": 16, "chapter": 4, "verse": 8}, {"label": "Esther 6:13", "book": 16, "chapter": 6, "verse": 13}, {"label": "Esther 5:2", "book": 16, "chapter": 5, "verse": 2}]`.
- `sides`: `[{"label": "A", "ref": "Esther 5:2", "quote": "she obtained favour in his sight"}]` → `[{"label": "A", "ref": "Esther 6:1", "quote": "On that night could not the king sleep"}, {"label": "A", "ref": "Esther 2:20", "quote": "for Esther did the commandment of Mordecai"}, {"label": "A", "ref": "Esther 4:8", "quote": "to make request before him for her people"}, {"label": "A", "ref": "Esther 6:13", "quote": "but shalt surely fall before him"}, {"label": "A", "ref": "Esther 5:2", "quote": "she obtained favour in his sight"}]`.
- Updated source labels/links; original verified citations retained, with review-supplied checks added where needed.
- `title`: `"Esther “obtained favour in his sight” — Brenton’s Greek says God changed the king’s spirit to gentleness"` → `"God Named in Five Greek Passages of Esther"`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.
- Extended the existing stable ID; preserved all four prior comparisons, sources, references and side quotations. Added Greek 5:1e beside KJV 5:2 and revised the former lettered-passage exclusion.

Verification: evidence/witness/reference/side schema passes; 5 KJV text quotes and 10 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `which-vail-is-done-away-in-christ-or-because-it-is-done-away-in-christ-2-corinthians-3-14-greek-new-testament`

Draft: [2-corinthians-second-pass-records.json](../../claude-drafts/2-corinthians-second-pass-records.json). Review: [d10-2-corinthians-second-pass.md](d10-2-corinthians-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: The KJV ends 2 Corinthians 3:14 with “which vail is done away in Christ”. Two printed Greek editions link the clause differently. The older received text has which; the later edited text has because or that.
Scope now: The finding concerns the clause link at 2 Corinthians 3:14 only. The earlier wording about this very day is outside the finding. This compares two printed Greek New Testament editions served by bolls.life. The older received text agrees with the KJV here; the later edited text differs. Full edition names are in Sources. The two editions do not provide a full review of ancient copies or establish which wording came first. Other small spelling and word-order differences are outside this finding.

Other edits:
- `languageContext`: `"Greek New Testament · Tischendorf 8th edition (TISCH) and Textus Receptus (TR) as served by bolls.life"` → `"Two printed Greek New Testament editions: an older received text and a later edited text. Full names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `our-care-for-you-or-your-care-for-us-2-corinthians-7-12-greek-new-testament`

Draft: [2-corinthians-second-pass-records.json](../../claude-drafts/2-corinthians-second-pass-records.json). Review: [d10-2-corinthians-second-pass.md](d10-2-corinthians-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At 2 Corinthians 7:12, the KJV describes “our care for you”. Two printed Greek editions differ: the older received text agrees, while the later edited text has your care for us.
Scope now: The finding concerns the care pronouns at 2 Corinthians 7:12 only. It does not imply a different historical occasion. This compares two printed Greek New Testament editions served by bolls.life. The older received text agrees with the KJV here; the later edited text differs. Full edition names are in Sources. The two editions do not provide a full review of ancient copies or establish which wording came first. Other small spelling and word-order differences are outside this finding.

Other edits:
- `languageContext`: `"Greek New Testament · Tischendorf 8th edition (TISCH) and Textus Receptus (TR) as served by bolls.life"` → `"Two printed Greek New Testament editions: an older received text and a later edited text. Full names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `we-were-comforted-in-your-comfort-or-in-our-comfort-2-corinthians-7-13-greek-new-testament`

Draft: [2-corinthians-second-pass-records.json](../../claude-drafts/2-corinthians-second-pass-records.json). Review: [d10-2-corinthians-second-pass.md](d10-2-corinthians-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: The KJV begins 2 Corinthians 7:13 with “Therefore we were comforted in your comfort”. The older of two printed Greek editions agrees. The later edited text has our comfort after a printed sentence break.
Scope now: The finding concerns the comfort pronoun and sentence break at 2 Corinthians 7:13. The punctuation belongs to the printed edition, not every ancient copy. This compares two printed Greek New Testament editions served by bolls.life. The older received text agrees with the KJV here; the later edited text differs. Full edition names are in Sources. The two editions do not provide a full review of ancient copies or establish which wording came first. Other small spelling and word-order differences are outside this finding.

Other edits:
- `languageContext`: `"Greek New Testament · Tischendorf 8th edition (TISCH) and Textus Receptus (TR) as served by bolls.life"` → `"Two printed Greek New Testament editions: an older received text and a later edited text. Full names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `whereof-ye-had-notice-before-or-promised-before-2-corinthians-9-5-greek-new-testament`

Draft: [2-corinthians-second-pass-records.json](../../claude-drafts/2-corinthians-second-pass-records.json). Review: [d10-2-corinthians-second-pass.md](d10-2-corinthians-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At 2 Corinthians 9:5, the KJV describes a gift “whereof ye had notice before”. The older of two printed Greek editions has announced beforehand; the later edited text has promised beforehand.
Scope now: The finding concerns the announced/promised verb at 2 Corinthians 9:5 only. Neither reading is claimed for every ancient copy. This compares two printed Greek New Testament editions served by bolls.life. The older received text agrees with the KJV here; the later edited text differs. Full edition names are in Sources. The two editions do not provide a full review of ancient copies or establish which wording came first. Other small spelling and word-order differences are outside this finding.

Other edits:
- `languageContext`: `"Greek New Testament · Tischendorf 8th edition (TISCH) and Textus Receptus (TR) as served by bolls.life"` → `"Two printed Greek New Testament editions: an older received text and a later edited text. Full names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `minister-bread-multiply-and-increase-or-will-supply-multiply-and-increase-2-corinthians-9-10-greek-new-testament`

Draft: [2-corinthians-second-pass-records.json](../../claude-drafts/2-corinthians-second-pass-records.json). Review: [d10-2-corinthians-second-pass.md](d10-2-corinthians-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At 2 Corinthians 9:10, the KJV expresses a wish about God's provision, agreeing with the older printed Greek edition. The later edited text uses future forms: will supply, multiply and increase.
Scope now: The finding concerns the three compared verbs at 2 Corinthians 9:10 only. This compares two printed Greek New Testament editions served by bolls.life. The older received text agrees with the KJV here; the later edited text differs. Full edition names are in Sources. The two editions do not provide a full review of ancient copies or establish which wording came first. Other small spelling and word-order differences are outside this finding.

Other edits:
- `languageContext`: `"Greek New Testament · Tischendorf 8th edition (TISCH) and Textus Receptus (TR) as served by bolls.life"` → `"Two printed Greek New Testament editions: an older received text and a later edited text. Full names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `before-the-angel-that-it-was-an-error-or-in-the-presence-of-god-it-was-ignorance-greek`

Draft: [ecclesiastes-second-pass-records.json](../../claude-drafts/ecclesiastes-second-pass-records.json). Review: [d8-ecclesiastes-second-pass.md](d8-ecclesiastes-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: The KJV places the excuse that something was an error before the angel. The old Greek translation places it before God.
Scope now: The comparison is KJV Ecclesiastes 5:6 beside printed Hebrew and Greek 5:5. Only the angel/God clause is compared; the verse numbers must remain distinct. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition. No wider Hebrew word meaning is established here. The linked English version shows how this edition renders its Greek, not a dictionary definition. Similar English words alone do not prove a changed meaning. Shared roots do not settle context.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `god-answereth-him-in-the-joy-of-his-heart-or-god-troubles-him-in-the-joy-of-his-heart-greek`

Draft: [ecclesiastes-second-pass-records.json](../../claude-drafts/ecclesiastes-second-pass-records.json). Review: [d8-ecclesiastes-second-pass.md](d8-ecclesiastes-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: The KJV says God answers the man in the joy of his heart. The linked English version of the old Greek translation uses troubles for its verb.
Scope now: The comparison is KJV Ecclesiastes 5:20 beside printed Hebrew and Greek 5:19. Only the quoted clause is compared; the verse numbers remain distinct. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition. No wider Hebrew word meaning is established here. The linked English version shows how this edition renders its Greek, not a dictionary definition. Similar English words alone do not prove a changed meaning. Shared roots do not settle context.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `nor-known-any-thing-or-nor-known-rest-greek`

Draft: [ecclesiastes-second-pass-records.json](../../claude-drafts/ecclesiastes-second-pass-records.json). Review: [d8-ecclesiastes-second-pass.md](d8-ecclesiastes-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Ecclesiastes 6:5, the KJV says the unborn child has not seen the sun or known anything. The old Greek translation says the child has not known rest.
Scope now: Only the quoted clause at Ecclesiastes 6:5 is compared. This is not a general claim about awareness after death. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition. No wider Hebrew word meaning is established here. The linked English version shows how this edition renders its Greek, not a dictionary definition. Similar English words alone do not prove a changed meaning. Shared roots do not settle context.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `a-thousand-years-twice-told-or-the-returns-of-a-thousand-years-greek`

Draft: [ecclesiastes-second-pass-records.json](../../claude-drafts/ecclesiastes-second-pass-records.json). Review: [d8-ecclesiastes-second-pass.md](d8-ecclesiastes-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Ecclesiastes 6:6, the KJV gives a thousand years twice told. The old Greek translation refers to returns of a thousand years without an explicit twice.
Scope now: Only the quoted clause at Ecclesiastes 6:6 is compared. No exact Greek total is inferred. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition. No wider Hebrew word meaning is established here. The linked English version shows how this edition renders its Greek, not a dictionary definition. Similar English words alone do not prove a changed meaning. Shared roots do not settle context.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `a-gift-destroyeth-the-heart-or-oppression-destroys-his-noble-heart-greek`

Draft: [ecclesiastes-second-pass-records.json](../../claude-drafts/ecclesiastes-second-pass-records.json). Review: [d8-ecclesiastes-second-pass.md](d8-ecclesiastes-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Ecclesiastes 7:7, the KJV names a gift that destroys the heart. The old Greek translation instead links oppression with destruction of a noble heart.
Scope now: Only the compared clause at Ecclesiastes 7:7 is included. It adds no motive to a person or claim that the two effects exclude one another. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition. No wider Hebrew word meaning is established here. The linked English version shows how this edition renders its Greek, not a dictionary definition. Similar English words alone do not prove a changed meaning. Shared roots do not settle context.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `withdraw-not-thine-hand-or-defile-not-thine-hand-greek`

Draft: [ecclesiastes-second-pass-records.json](../../claude-drafts/ecclesiastes-second-pass-records.json). Review: [d8-ecclesiastes-second-pass.md](d8-ecclesiastes-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Ecclesiastes 7:18, the KJV tells the reader not to withdraw the hand. The old Greek translation instead says not to defile the hand.
Scope now: Only the quoted clause at Ecclesiastes 7:18 is compared. The passage's figurative setting is retained; this is not a claim about washing hands. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition. No wider Hebrew word meaning is established here. The linked English version shows how this edition renders its Greek, not a dictionary definition. Similar English words alone do not prove a changed meaning. Shared roots do not settle context.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

Source correction: Removed a stray space before the final period of the quoted English translation at Ecclesiastes 7:18.

### `walk-in-the-sight-of-thine-eyes-or-walk-blameless-and-not-in-the-sight-of-thine-eyes-greek`

Draft: [ecclesiastes-second-pass-records.json](../../claude-drafts/ecclesiastes-second-pass-records.json). Review: [d8-ecclesiastes-second-pass.md](d8-ecclesiastes-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Ecclesiastes 11:9, the KJV tells the young man to walk by his heart and what his eyes see. The old Greek translation adds blameless and not before the phrase about his eyes.
Scope now: The finding concerns the compared clause at Ecclesiastes 11:9, with the shared closing warning kept as context. It does not present the whole verses as opposite systems of conduct. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition. No wider Hebrew word meaning is established here. The linked English version shows how this edition renders its Greek, not a dictionary definition. Similar English words alone do not prove a changed meaning. Shared roots do not settle context.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `childhood-and-youth-are-vanity-or-youth-and-folly-are-vanity-greek`

Draft: [ecclesiastes-second-pass-records.json](../../claude-drafts/ecclesiastes-second-pass-records.json). Review: [d8-ecclesiastes-second-pass.md](d8-ecclesiastes-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Ecclesiastes 11:10, the KJV calls childhood and youth vanity. The old Greek translation instead names youth and folly.
Scope now: Only the compared nouns at Ecclesiastes 11:10 are included. The finding is limited to the named edition. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition. No wider Hebrew word meaning is established here. The linked English version shows how this edition renders its Greek, not a dictionary definition. Similar English words alone do not prove a changed meaning. Shared roots do not settle context.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `i-charge-you-that-ye-tell-him-or-i-have-charged-you-by-the-powers-and-forces-of-the-field-greek`

Draft: [song-of-solomon-second-pass-records.json](../../claude-drafts/song-of-solomon-second-pass-records.json). Review: [d9-song-of-solomon-second-pass.md](d9-song-of-solomon-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: Song of Solomon 5:8 and 8:4 appeal to Jerusalem's daughters. The KJV gives no basis for these oaths. The old Greek translation adds powers and forces of the field at 5:8. It adds forces of the field at 8:4.
Scope now: Only the added oath wording at Song of Solomon 5:8 and 8:4 is compared. The different message/question wording at 5:8 is outside the finding. Sick and wounded are not treated as a separate meaning difference, and the Hebrew word is not defined here. The earlier oath record remains separate; repeated explanation is not counted as another finding. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `appliesTo`: `["Song of Solomon 5:8"]` → `["Song of Solomon 5:8", "Song of Solomon 8:4"]`.
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- `refs`: `[{"label": "Song of Solomon 5:8", "book": 21, "chapter": 5, "verse": 8}]` → `[{"label": "Song of Solomon 5:8", "book": 21, "chapter": 5, "verse": 8}, {"label": "Song of Solomon 8:4", "book": 21, "chapter": 8, "verse": 4}]`.
- `sides`: `[{"label": "A", "ref": "Song of Solomon 5:8", "quote": "I charge you, O daughters of Jerusalem, if ye find my beloved"}]` → `[{"label": "A", "ref": "Song of Solomon 5:8", "quote": "I charge you, O daughters of Jerusalem, if ye find my beloved"}, {"label": "B", "ref": "Song of Solomon 8:4", "quote": "I charge you, O daughters of Jerusalem, that ye stir not up, nor awake my love, until he please"}]`.
- Updated source labels/links; original verified citations retained, with review-supplied checks added where needed.
- `title`: `"Song 5:8 — “I charge you” in the KJV; the Greek adds “by the powers and by the forces of the field”"` → `"The Greek adds oath phrases at Song of Solomon 5:8 and 8:4"`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.
- Combined the two oath inputs, retaining both passages, distinct Greek phrases, sources and side quotations.

Verification: evidence/witness/reference/side schema passes; 2 KJV text quotes and 4 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `i-would-instruct-me-in-my-mothers-house-or-into-the-chamber-of-her-that-conceived-me-greek`

Draft: [song-of-solomon-second-pass-records.json](../../claude-drafts/song-of-solomon-second-pass-records.json). Review: [d9-song-of-solomon-second-pass.md](d9-song-of-solomon-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Song of Solomon 8:2, the KJV names “my mother's house, who would instruct me”. The old Greek translation names the house and the chamber of the woman who conceived her, without instruct.
Scope now: Only this clause at Song of Solomon 8:2 is compared. The KJV wording is one reading of the Hebrew clause. This record does not exclude other readings or define the verb. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- `sides`: `[{"label": "A", "ref": "Song of Solomon 8:2", "quote": "my mother’s house, who would instruct me"}]` → `[{"label": "A", "ref": "Song of Solomon 8:2", "quote": "my mother's house, who would instruct me"}]`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `i-charge-you-that-ye-stir-not-up-or-by-the-forces-of-the-field-that-ye-stir-not-up-greek`

Draft: [song-of-solomon-second-pass-records.json](../../claude-drafts/song-of-solomon-second-pass-records.json). Review: [d9-song-of-solomon-second-pass.md](d9-song-of-solomon-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: Song of Solomon 5:8 and 8:4 appeal to Jerusalem's daughters. The KJV gives no basis for these oaths. The old Greek translation adds powers and forces of the field at 5:8. It adds forces of the field at 8:4.
Scope now: Only the added oath wording at Song of Solomon 5:8 and 8:4 is compared. The different message/question wording at 5:8 is outside the finding. Sick and wounded are not treated as a separate meaning difference, and the Hebrew word is not defined here. The earlier oath record remains separate; repeated explanation is not counted as another finding. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `appliesTo`: `["Song of Solomon 8:4"]` → `["Song of Solomon 5:8", "Song of Solomon 8:4"]`.
- `id`: `"i-charge-you-that-ye-stir-not-up-or-by-the-forces-of-the-field-that-ye-stir-not-up-greek"` → `"i-charge-you-that-ye-tell-him-or-i-have-charged-you-by-the-powers-and-forces-of-the-field-greek"`.
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- `ref`: `"Song of Solomon 8:4"` → `"Song of Solomon 5:8"`.
- `refs`: `[{"label": "Song of Solomon 8:4", "book": 21, "chapter": 8, "verse": 4}]` → `[{"label": "Song of Solomon 5:8", "book": 21, "chapter": 5, "verse": 8}, {"label": "Song of Solomon 8:4", "book": 21, "chapter": 8, "verse": 4}]`.
- `sides`: `[{"label": "A", "ref": "Song of Solomon 8:4", "quote": "I charge you, O daughters of Jerusalem, that ye stir not up, nor awake my love, until he please"}]` → `[{"label": "A", "ref": "Song of Solomon 5:8", "quote": "I charge you, O daughters of Jerusalem, if ye find my beloved"}, {"label": "B", "ref": "Song of Solomon 8:4", "quote": "I charge you, O daughters of Jerusalem, that ye stir not up, nor awake my love, until he please"}]`.
- Updated source labels/links; original verified citations retained, with review-supplied checks added where needed.
- `title`: `"Song 8:4 — the KJV charge is unsworn; the Greek adds “by the forces of the field”"` → `"The Greek adds oath phrases at Song of Solomon 5:8 and 8:4"`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.
- Combined the two oath inputs, retaining both passages, distinct Greek phrases, sources and side quotations.

Verification: evidence/witness/reference/side schema passes; 2 KJV text quotes and 4 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `who-is-this-that-cometh-up-from-the-wilderness-or-who-is-this-that-comes-up-all-white-greek`

Draft: [song-of-solomon-second-pass-records.json](../../claude-drafts/song-of-solomon-second-pass-records.json). Review: [d9-song-of-solomon-second-pass.md](d9-song-of-solomon-second-pass.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: At Song of Solomon 8:5, the KJV asks who comes from the wilderness while leaning on her beloved. The old Greek translation in the cited edition has all white and does not print wilderness.
Scope now: Only the quoted clause at Song of Solomon 8:5 in this Greek edition is compared. Other Greek editions were not checked. No claim is made about wording in all ancient copies. These digital editions do not show what all ancient copies contain or which wording came first. Other Hebrew copies were not checked. Sources name the Hebrew text and the old Greek translation used here. English in square brackets is the researcher’s rendering, not KJV wording or a dictionary definition.

Other edits:
- `languageContext`: `"Hebrew Old Testament · Westminster Leningrad Codex (WLC) digital text; Greek Old Testament (Septuagint) · Brenton Greek edition"` → `"The Hebrew text and the old Greek translation; full edition names are in Sources."`.
- Rechecked exact quotations and printed verse labels; replaced simplified foreign-language prose with plain wording.

Verification: evidence/witness/reference/side schema passes; 1 KJV text quotes and 2 retained Hebrew/Greek spans match. Source URLs and hashes are recorded in the verification file.

### `jethro`

Draft: [exodus-wilderness-characters-records.json](../../claude-drafts/exodus-wilderness-characters-records.json). Review: [c1-exodus-wilderness-characters.md](c1-exodus-wilderness-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: The priest of Midian whose daughter Zipporah marries Moses. Exodus says he gives Moses refuge and releases him to return to Egypt. He later brings Moses' wife and sons to the camp at the mountain of God. He praises the Lord after hearing of Israel's escape from Egypt and offers sacrifices. He advises Moses to appoint officials to share the work of judging the people. Exodus uses Jethro and Reuel; Numbers 10:29 uses Raguel. These name links do not settle Hobab's relationship to Moses.

Other edits:
- `aliases`: `["Reuel", "Raguel"]` → `["Reuel (Exodus 2:18; name link remains qualified)", "Raguel (Numbers 10:29; relationship wording remains qualified)"]`.
- `narrative_anchors.books`: `["Exodus"]` → `["Exodus", "Numbers"]`.

Verification: combined character schema passes; 9 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `jethro_2431` → `recxxH0xyhQyXuyh2`; inherited family edges disabled. Explicit family targets: `[{"relation": "children", "label": "Zipporah", "profile_id": "zipporah"}]`.

### `zipporah`

Draft: [exodus-wilderness-characters-records.json](../../claude-drafts/exodus-wilderness-characters-records.json). Review: [c1-exodus-wilderness-characters.md](c1-exodus-wilderness-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A daughter of the Midianite priest who becomes Moses' wife and bears Gershom and Eliezer. On the journey, she circumcises her son after the Lord threatens a man's life. Exodus 4:24 uses “him” without naming the man. She uses a sharp stone and speaks of a “bloody husband”. Exodus 18:2 says Moses had sent her back but does not say when. Her father brings her and her sons to Moses at the mountain of God.

Other edits:
- `narrative_anchors.key_verses`: `["Exodus 2:21", "Exodus 2:22", "Exodus 4:25", "Exodus 4:26", "Exodus 18:2", "Exodus 18:3", "Exodus 18:4"]` → `["Exodus 2:21", "Exodus 2:22", "Exodus 4:25", "Exodus 4:26", "Exodus 18:2", "Exodus 18:3", "Exodus 18:4", "Exodus 4:24"]`.

Verification: combined character schema passes; 8 verse anchors and 3 story links pass. 2 quoted spans match packaged KJV.
Identity: `zipporah_3095` → `recsI3r5rXZZGdGal`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Jethro", "profile_id": "jethro"}, {"relation": "spouses", "label": "Moses", "profile_id": "moses"}]`.

### `eleazar`

Draft: [exodus-wilderness-characters-records.json](../../claude-drafts/exodus-wilderness-characters-records.json). Review: [c1-exodus-wilderness-characters.md](c1-exodus-wilderness-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Aaron's third-named son, who becomes high priest after his two older brothers and Aaron die. Numbers places Aaron's death on Mount Hor, where Moses puts Aaron's garments on Eleazar. He works with Moses during the census and the war against Midian. Later, he helps divide the land with Joshua.

Other edits:
- `geography.origin`: `"Born in Israel's Egyptian setting (Exodus 6:23)"` → `"Birthplace not stated; named among Aaron's sons in Exodus 6:23."`.

Verification: combined character schema passes; 8 verse anchors and 4 story links pass. 0 quoted spans match packaged KJV.
Identity: `eleazar_1062` → `recyDlo13a3T5DDGh`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Aaron", "profile_id": "aaron"}, {"relation": "children", "label": "Phinehas", "profile_id": "phinehas"}, {"relation": "siblings", "label": "Nadab", "profile_id": "nadab"}, {"relation": "siblings", "label": "Abihu", "profile_id": "abihu"}]`.

### `phinehas`

Draft: [exodus-wilderness-characters-records.json](../../claude-drafts/exodus-wilderness-characters-records.json). Review: [c1-exodus-wilderness-characters.md](c1-exodus-wilderness-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Eleazar's son. Numbers describes an Israelite bringing a Midianite woman into the camp during a plague at Shittim. Phinehas takes a javelin and kills them both. In the account, the Lord says he turned away wrath. The Lord promises him peace and a lasting priesthood. He later carries sacred objects during the war against Midian. He leads the group sent to the eastern tribes during the altar dispute.

Verification: combined character schema passes; 8 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `phinehas_2349` → `recPDRskzPNTboSMu`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Eleazar", "profile_id": "eleazar"}]`.

### `caleb`

Draft: [exodus-wilderness-characters-records.json](../../claude-drafts/exodus-wilderness-characters-records.json). Review: [c1-exodus-wilderness-characters.md](c1-exodus-wilderness-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Jephunneh's son, whom Numbers calls a Kenezite and a man of Judah. He is one of twelve men sent to spy out Canaan and urges Israel to go up at once. He and Joshua tear their clothes when the people refuse. Numbers says he survives the wilderness generation because he followed the Lord fully. At eighty-five, he asks for the hill country of Hebron and drives out the sons of Anak. This profile does not identify him with the Caleb in 1 Chronicles 2:18.

Verification: combined character schema passes; 9 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `caleb_537` → `recVua5TkKSl3y6Ol`; inherited family edges disabled. Explicit family targets: `[]`.

### `korah`

Draft: [exodus-wilderness-characters-records.json](../../claude-drafts/exodus-wilderness-characters-records.json). Review: [c1-exodus-wilderness-characters.md](c1-exodus-wilderness-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A Levite from Kohath's family and a son of Izhar. In Numbers 16, he gathers followers with Dathan, Abiram and 250 leaders against Moses and Aaron. They say the whole community is holy. The account describes the earth swallowing Korah's company and fire consuming the 250 who offered incense. Numbers 26:11 says Korah's children did not die. These accounts are not combined into a more detailed death sequence here.

Verification: combined character schema passes; 7 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `korah_1795` → `rece4MdvDF2ule9OY`; inherited family edges disabled. Explicit family targets: `[]`.

### `balaam`

Draft: [exodus-wilderness-characters-records.json](../../claude-drafts/exodus-wilderness-characters-records.json). Review: [c1-exodus-wilderness-characters.md](c1-exodus-wilderness-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Beor's son from Pethor, whom Balak king of Moab calls to curse Israel. Numbers describes an angel and a speaking donkey before Balaam is allowed to go. From Moab's heights he blesses Israel instead, including a message about a star from Jacob. Numbers 31 links him to Israel's actions at Peor and says Israel killed him in the war against Midian. Second Peter and Revelation also criticize him.

Verification: combined character schema passes; 10 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `balaam_593` → `rec1S6Nkd3KyN5heV`; inherited family edges disabled. Explicit family targets: `[]`.

### `balak`

Draft: [exodus-wilderness-characters-records.json](../../claude-drafts/exodus-wilderness-characters-records.json). Review: [c1-exodus-wilderness-characters.md](c1-exodus-wilderness-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: The son of Zippor and king of Moab, alarmed by Israel's defeat of the Amorites and its numbers. He sends for Balaam to curse Israel and takes him to a series of high places. Each message blesses Israel instead. Numbers 24:10 describes Balak's anger.

Other edits:
- `narrative_anchors.key_verses`: `["Numbers 22:2", "Numbers 22:4", "Numbers 22:6", "Numbers 22:41", "Numbers 23:7", "Micah 6:5", "Joshua 24:9"]` → `["Numbers 22:2", "Numbers 22:4", "Numbers 22:6", "Numbers 22:41", "Numbers 23:7", "Micah 6:5", "Joshua 24:9", "Numbers 24:10"]`.

Verification: combined character schema passes; 8 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `balak_387` → `recoJAyYl3Qele6ey`; inherited family edges disabled. Explicit family targets: `[]`.

### `nadab`

Draft: [exodus-wilderness-characters-records.json](../../claude-drafts/exodus-wilderness-characters-records.json). Review: [c1-exodus-wilderness-characters.md](c1-exodus-wilderness-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Aaron's firstborn son, who goes up the mountain with Moses and Aaron. Exodus says they see the God of Israel. Nadab is appointed a priest. Leviticus says he and Abihu offer fire the Lord had not commanded, and fire from the Lord consumes them. Numbers says they die without children.

Other edits:
- `geography.origin`: `"Born in Israel's Egyptian setting (Exodus 6:23)"` → `"Birthplace not stated; named among Aaron's sons in Exodus 6:23."`.
- `narrative_anchors.linked_stories`: `[{"story_id": "exodus-the-book-of-the-covenant", "title": "The Book of the Covenant", "passage": "Exodus 21:1 - 24:18", "route": "#stories/exodus/the-book-of-the-covenant"}, {"story_id": "leviticus-aaron-and-his-sons-are-ordained", "title": "Aaron and His Sons Are Ordained", "passage": "Leviticus 8:1 - 9:24", "route": "#stories/leviticus/aaron-and-his-sons-are-ordained"}, {"story_id": "leviticus-nadab-and-abihu", "title": "Nadab and Abihu", "passage": "Leviticus 10:1 - 10:20", "route": "#stories/leviticus/nadab-and-abihu"}]` → `[{"story_id": "leviticus-aaron-and-his-sons-are-ordained", "title": "Aaron and His Sons Are Ordained", "passage": "Leviticus 8:1 - 9:24", "route": "#stories/leviticus/aaron-and-his-sons-are-ordained"}, {"story_id": "leviticus-nadab-and-abihu", "title": "Nadab and Abihu", "passage": "Leviticus 10:1 - 10:20", "route": "#stories/leviticus/nadab-and-abihu"}]`.

Verification: combined character schema passes; 7 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `nadab_2128` → `recCSN4kRre7qWV1P`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Aaron", "profile_id": "aaron"}, {"relation": "siblings", "label": "Abihu", "profile_id": "abihu"}, {"relation": "siblings", "label": "Eleazar", "profile_id": "eleazar"}]`.

### `abihu`

Draft: [exodus-wilderness-characters-records.json](../../claude-drafts/exodus-wilderness-characters-records.json). Review: [c1-exodus-wilderness-characters.md](c1-exodus-wilderness-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Aaron's second-named son, who goes up the mountain with Moses. Exodus says they see the God of Israel. He is appointed a priest. Leviticus says he and Nadab offer uncommanded fire in incense holders and die before the Lord.

Other edits:
- `geography.origin`: `"Born in Israel's Egyptian setting (Exodus 6:23)"` → `"Birthplace not stated; named among Aaron's sons in Exodus 6:23."`.
- `narrative_anchors.linked_stories`: `[{"story_id": "exodus-the-book-of-the-covenant", "title": "The Book of the Covenant", "passage": "Exodus 21:1 - 24:18", "route": "#stories/exodus/the-book-of-the-covenant"}, {"story_id": "leviticus-aaron-and-his-sons-are-ordained", "title": "Aaron and His Sons Are Ordained", "passage": "Leviticus 8:1 - 9:24", "route": "#stories/leviticus/aaron-and-his-sons-are-ordained"}, {"story_id": "leviticus-nadab-and-abihu", "title": "Nadab and Abihu", "passage": "Leviticus 10:1 - 10:20", "route": "#stories/leviticus/nadab-and-abihu"}]` → `[{"story_id": "leviticus-aaron-and-his-sons-are-ordained", "title": "Aaron and His Sons Are Ordained", "passage": "Leviticus 8:1 - 9:24", "route": "#stories/leviticus/aaron-and-his-sons-are-ordained"}, {"story_id": "leviticus-nadab-and-abihu", "title": "Nadab and Abihu", "passage": "Leviticus 10:1 - 10:20", "route": "#stories/leviticus/nadab-and-abihu"}]`.

Verification: combined character schema passes; 7 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `abihu_33` → `rec2LyU5fsvL5DWDi`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Aaron", "profile_id": "aaron"}, {"relation": "siblings", "label": "Nadab", "profile_id": "nadab"}, {"relation": "siblings", "label": "Eleazar", "profile_id": "eleazar"}]`.

### `hur`

Draft: [exodus-wilderness-characters-records.json](../../claude-drafts/exodus-wilderness-characters-records.json). Review: [c1-exodus-wilderness-characters.md](c1-exodus-wilderness-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A man who stands with Aaron during the battle with Amalek and helps hold up Moses' hands until sunset. When Moses goes up the mountain, he leaves Hur with Aaron to settle disputes. Exodus 31:2 names a Hur as Bezaleel's grandfather. It does not establish that this is the same Hur.

Other edits:
- `geography.origin`: `"Tribe of Judah, as Bezalel's grandfather (Exodus 31:2); his own parentage is not stated in the Exodus text"` → `"Birthplace and tribe not stated in the cited Exodus account."`.
- `lineage.tribe`: `"Judah"` → `null`.
- `narrative_anchors.linked_stories`: `[{"story_id": "exodus-water-from-the-rock-and-the-battle-with-amalek", "title": "Water from the Rock and the Battle with Amalek", "passage": "Exodus 17:1 - 17:16", "route": "#stories/exodus/water-from-the-rock-and-the-battle-with-amalek"}, {"story_id": "exodus-the-book-of-the-covenant", "title": "The Book of the Covenant", "passage": "Exodus 21:1 - 24:18", "route": "#stories/exodus/the-book-of-the-covenant"}]` → `[{"story_id": "exodus-water-from-the-rock-and-the-battle-with-amalek", "title": "Water from the Rock and the Battle with Amalek", "passage": "Exodus 17:1 - 17:16", "route": "#stories/exodus/water-from-the-rock-and-the-battle-with-amalek"}]`.

Verification: combined character schema passes; 6 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `hur_1571` → `recbO7tUz8fk12ExW`; inherited family edges disabled. Explicit family targets: `[]`.

### `bezalel`

Draft: [exodus-wilderness-characters-records.json](../../claude-drafts/exodus-wilderness-characters-records.json). Review: [c1-exodus-wilderness-characters.md](c1-exodus-wilderness-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A craftsman from Judah, son of Uri and grandson of Hur. Exodus says the Lord calls him by name and fills him with God's spirit, wisdom and skill. With Aholiab of Dan, he makes the sacred tent, its furnishings and the priests' garments as commanded.

Other edits:
- `aliases`: `["Bezaleel"]` → `["Bezalel"]`.
- `name`: `"Bezalel"` → `"Bezaleel"`.
- `narrative_anchors.linked_stories`: `[{"story_id": "exodus-instructions-for-the-tabernacle", "title": "Instructions for the Tabernacle", "passage": "Exodus 25:1 - 31:18", "route": "#stories/exodus/instructions-for-the-tabernacle"}, {"story_id": "exodus-building-the-tabernacle", "title": "Building the Tabernacle", "passage": "Exodus 35:1 - 40:38", "route": "#stories/exodus/building-the-tabernacle"}]` → `[{"story_id": "exodus-building-the-tabernacle", "title": "Building the Tabernacle", "passage": "Exodus 35:1 - 40:38", "route": "#stories/exodus/building-the-tabernacle"}]`.

Verification: combined character schema passes; 9 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `bezaleel_490` → `rec4QEZboAvgaMvkX`; inherited family edges disabled. Explicit family targets: `[]`.

### `rahab`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A woman of Jericho whom Joshua describes as a sex worker. She hides two spies on her roof, misleads the king's men and lowers the spies through her window. She says fear of Israel has fallen on the land and asks for kindness to her father's household. Joshua says she and her family survive Jericho's fall, and she lives among Israel. Matthew names Rachab in its family list; Hebrews and James also name Rahab. These later references do not establish every proposed family link here.

Verification: combined character schema passes; 10 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `rahab_2388` → `rec1KxZ8I6FX57Q0T`; inherited family edges disabled. Explicit family targets: `[]`.

### `achan`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A man of Judah who takes goods set apart at Jericho: a garment, silver and gold. He hides them in his tent, and Israel later loses at Ai. Joshua describes groups being selected until Achan is singled out. He admits wanting and taking the goods. The account describes stoning and burning in the valley of Achor. Its pronouns are not used here to settle exactly who or what is burned.

Verification: combined character schema passes; 4 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `achan_61` → `recL9x2FrJ8IWdGFA`; inherited family edges disabled. Explicit family targets: `[]`.

### `othniel`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Kenaz's son, who captures a town and receives Caleb's daughter Achsah as his wife. The phrase “younger brother” can refer to Kenaz or Othniel; this profile does not choose between them. Judges says Israel cries out under Chushanrishathaim of Mesopotamia. The Lord raises Othniel as a deliverer, and the Lord's spirit comes on him. The account gives the land forty years of rest until his death.

Other edits:
- `lineage.siblings`: `["Caleb"]` → `null`.

Verification: combined character schema passes; 4 verse anchors and 1 story links pass. 1 quoted spans match packaged KJV.
Identity: `othniel_2259` → `recgfx8iuSsor6yXf`; inherited family edges disabled. Explicit family targets: `[]`.

### `ehud`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A left-handed man of Benjamin and son of Gera. Judges says the Lord raises him when Israel cries out under Eglon king of Moab. He brings tribute to Eglon, then returns to kill him with a dagger and escapes. He rallies Israel, which defeats Moab. Judges gives the land eighty years of rest. This profile does not identify him with the other Ehud in Chronicles.

Verification: combined character schema passes; 3 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `ehud_1039` → `recyOsE7tW60nOWh3`; inherited family edges disabled. Explicit family targets: `[]`.

### `deborah`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A prophet and the wife of Lapidoth who judges Israel beneath a palm tree in Ephraim's hill country. She calls Barak to lead ten thousand men against Sisera and agrees to go with him. Judges records her warning that the Lord will give Sisera into a woman's hand. Judges 5:1 names Deborah and Barak as singers of the victory song. This Deborah is distinct from Rebekah's nurse.

Other edits:
- `aliases`: `["Debora"]` → `null`.
- `narrative_anchors.key_verses`: `["Judges 4:4", "Judges 4:5", "Judges 4:6", "Judges 4:9"]` → `["Judges 4:4", "Judges 4:5", "Judges 4:6", "Judges 4:9", "Judges 5:1"]`.

Verification: combined character schema passes; 5 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `deborah_997` → `rec6OMKxWHWy6KHjE`; inherited family edges disabled. Explicit family targets: `[]`.

### `barak`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Abinoam's son from Kedesh-naphtali, called by Deborah to gather ten thousand men at Mount Tabor against Sisera. He insists that she go with him. She warns that the honour of victory will pass to a woman. He pursues Sisera and finds him dead in Jael's tent. Hebrews 11:32 later names Barak among people it praises for faith.

Verification: combined character schema passes; 5 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `barak_401` → `recIugPvqGMSEmfHN`; inherited family edges disabled. Explicit family targets: `[]`.

### `jael`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: The wife of Heber the Kenite. Judges says Sisera flees to her tent after his army's defeat, since Jabin and Heber's household are at peace. She welcomes him and drives a tent nail through his temples while he sleeps. She shows Barak the dead man. The song in Judges 5 blesses her above women in tents.

Other edits:
- `geography.origin`: `"Her husband's Kenite tent (Judges 4:17)"` → `"Birthplace not stated; she lives in Heber's tent in Judges 4:17."`.

Verification: combined character schema passes; 4 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `jael_689` → `recxJQqsngI2rJbuw`; inherited family edges disabled. Explicit family targets: `[]`.

### `gideon`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Joash's son, an Abiezrite from Manasseh. Judges describes an angel calling him to save Israel while he threshes wheat in a winepress. He asks for a sign with a fleece. He reduces his army to three hundred and defeats Midian with trumpets and torches in jars. He refuses to rule but makes an ephod, an object used in worship whose precise form is not given. Judges calls it a trap for Israel and his household. The text lists seventy sons, then introduces Abimelech separately; no revised total is supplied here.

Verification: combined character schema passes; 11 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `gideon_1314` → `recjU9TzJTjllYnUJ`; inherited family edges disabled. Explicit family targets: `[]`.

### `abimelech`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Gideon's son by a concubine from Shechem, a partner distinct from a wife. His mother's relatives support his claim to rule. Judges 9:5 says he kills seventy brothers on one stone, while also saying Jotham survives. The people make him king at Shechem. Judges says God sends an evil spirit between him and Shechem's men. He destroys the city. At Thebez, a woman breaks his skull with a millstone. The text calls his death God's repayment for his wickedness.

Other edits:
- `lineage.siblings`: `["Jotham", "Sixty-nine other sons of Gideon (Judges 9:5)"]` → `["Jotham", "Seventy brothers in Judges 9:5, which also says Jotham survived"]`.

Verification: combined character schema passes; 6 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `abimelech_41` → `recRZHTq3D9Hs5FG6`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Gideon", "profile_id": "gideon"}]`.

### `jephthah`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A warrior from Gilead, whose parents are Gilead and a woman the text calls a harlot. The elders call him back to lead against Ammon. Judges says the Lord's spirit comes on him. He vows, or promises, to offer whoever first leaves his house to greet him as a burnt offering. His only daughter comes out first. The text says he acts according to his vow; this profile does not settle sacrifice versus dedication. He later fights Ephraim at the Jordan crossings and judges Israel for six years.

Verification: combined character schema passes; 9 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `jephthah_839` → `recIo7V1LEn9xfvcc`; inherited family edges disabled. Explicit family targets: `[]`.

### `samson`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Manoah's son from Dan, announced as set apart for God from birth. Judges says he will begin to free Israel from the Philistines. He marries a Philistine woman from Timnath, kills many Philistines and judges Israel for twenty years. Samson tells Delilah that shaving his hair will take away his strength. Judges 16:20 also says the Lord has left him. He is shaved, blinded and made to grind in Gaza's prison. At the Philistine temple, he asks to die with them and brings the building down.

Other edits:
- `narrative_anchors.key_verses`: `["Judges 13:2", "Judges 13:5", "Judges 14:1", "Judges 15:20", "Judges 16:4", "Judges 16:19", "Judges 16:21", "Judges 16:30", "Hebrews 11:32"]` → `["Judges 13:2", "Judges 13:5", "Judges 14:1", "Judges 15:20", "Judges 16:4", "Judges 16:19", "Judges 16:21", "Judges 16:30", "Hebrews 11:32", "Judges 16:17", "Judges 16:20"]`.

Verification: combined character schema passes; 11 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `samson_2468` → `recwcML6FMulTblKH`; inherited family edges disabled. Explicit family targets: `[]`.

### `delilah`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A woman Samson loves in the valley of Sorek. Judges 16 says the Philistine rulers ask her to draw out the source of his strength. She presses him until he tells her. She lets him sleep on her knees and calls a man to shave his seven locks. The account says his strength then leaves him. It does not give her birthplace or ethnic identity.

Other edits:
- `geography.origin`: `"Valley of Sorek (Judges 16:4)"` → `"Birthplace not stated; the account places her in the valley of Sorek (Judges 16:4)."`.

Verification: combined character schema passes; 3 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `delilah_1005` → `rec3CJaR6qJKZgcUA`; inherited family edges disabled. Explicit family targets: `[]`.

### `naomi`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Elimelech's wife from Bethlehem, who moves to Moab during a famine. There she loses her husband and her sons Mahlon and Chilion. She returns to Bethlehem with her daughter-in-law Ruth. She asks to be called Mara, saying the Almighty has dealt bitterly with her. She guides Ruth toward Boaz. When Obed is born, the neighbours say a son is born to Naomi. Their words in Ruth 4:17 do not make Naomi his birth mother.

Verification: combined character schema passes; 6 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `naomi_2147` → `rec9C2DCAjPXuMVoL`; inherited family edges disabled. Explicit family targets: `[]`.

### `ruth`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A Moabite woman who marries Mahlon, Naomi's son. After his death, she stays with Naomi and says Naomi's people and God will be hers. In Bethlehem, she gathers grain left by harvesters in the field of Boaz, a relative. Following Naomi's advice, she asks him to act as a close relative at the threshing floor. The account describes the nearer relative declining the family and land arrangement. Boaz marries her, and she bears Obed, Jesse's father and David's grandfather. Matthew names her in its family list.

Verification: combined character schema passes; 8 verse anchors and 4 story links pass. 0 quoted spans match packaged KJV.
Identity: `ruth_2450` → `recUgHX8TjNBQ3aXd`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Boaz", "profile_id": "boaz"}]`.

### `boaz`

Draft: [joshua-ruth-characters-records.json](../../claude-drafts/joshua-ruth-characters-records.json). Review: [c2-joshua-ruth-characters.md](c2-joshua-ruth-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A wealthy relative of Elimelech in Bethlehem who lets Ruth gather grain left in his field. At the threshing floor, she asks him to spread his skirt over her as a close relative. He arranges to buy the family land at the town gate. He marries Ruth to preserve the dead man's name through his inheritance. Their son Obed is Jesse's father. Matthew names Booz as the son of Salmon and Rachab. That family list does not itself settle further claims about Rachab's identity.

Verification: combined character schema passes; 7 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `boaz_519` → `recD5yp1lrQTH1DZp`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Ruth", "profile_id": "ruth"}]`.

### `hannah`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: One of Elkanah's two wives from Ramathaim-zophim. She has no children, and Peninnah taunts her. At Shiloh, Eli first mistakes her intense prayer for drunkenness. She promises to give a son to the Lord. She bears Samuel and brings him to Shiloh after he stops nursing, leaving him there to serve. First Samuel 2 opens with her prayer of praise. The account later gives her three more sons and two daughters.

Verification: combined character schema passes; 7 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `hannah_1400` → `recjwefZcKPa9FN7N`; inherited family edges disabled. Explicit family targets: `[{"relation": "children", "label": "Samuel", "profile_id": "samuel"}]`.

### `eli`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: The priest at Shiloh who watches Hannah pray and later trains the child Samuel. First Samuel calls his sons Hophni and Phinehas “sons of Belial”, a harsh description of their wrongdoing. They misuse their office. Eli rebukes them but does not stop them. An unnamed man of God warns of judgment on Eli's family. The account later describes the Lord giving Samuel a similar warning. At ninety-eight, Eli hears that the ark is taken and his sons are dead. He falls from his seat and dies. The text says he judged Israel forty years.

Verification: combined character schema passes; 8 verse anchors and 3 story links pass. 1 quoted spans match packaged KJV.
Identity: `eli_1072` → `recH9ECLXz8IgSUgF`; inherited family edges disabled. Explicit family targets: `[]`.

### `samuel`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Elkanah and Hannah's son, given to serve the Lord at Shiloh under Eli. First Samuel describes the Lord calling him as a child. The text presents him as a prophet known from Dan to Beersheba. He judges Israel on a yearly circuit and lives at Ramah. He anoints Saul as leader and later anoints David among his brothers. He rebukes Saul, saying obedience is better than sacrifice. The book covers the end of the judges and the start of the kingdom. It says Samuel judged Israel throughout his life.

Verification: combined character schema passes; 8 verse anchors and 6 story links pass. 0 quoted spans match packaged KJV.
Identity: `samuel_2469` → `recZsS2Zu0zIDwqdv`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Hannah", "profile_id": "hannah"}]`.

### `saul`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Kish's son from Benjamin, described as taller than any other man in Israel. Samuel anoints him, and he becomes Israel's first king. He fights the Philistines. Samuel says the Lord has rejected him as king for failing to keep the Lord's word. David enters his service. First Samuel 18:8–12 describes Saul's anger and fear; the later account follows his pursuit of David. When the Lord no longer answers, he consults a medium at Endor. Archers wound him on Mount Gilboa, and he falls on his sword. Jonathan and two other sons die that day.

Other edits:
- `narrative_anchors.key_verses`: `["1 Samuel 9:2", "1 Samuel 10:1", "1 Samuel 15:23", "1 Samuel 18:20", "1 Samuel 28:6", "1 Samuel 28:7", "1 Samuel 31:2", "1 Samuel 31:4", "Acts 13:21"]` → `["1 Samuel 9:2", "1 Samuel 10:1", "1 Samuel 15:23", "1 Samuel 18:20", "1 Samuel 28:6", "1 Samuel 28:7", "1 Samuel 31:2", "1 Samuel 31:4", "Acts 13:21", "1 Samuel 18:8", "1 Samuel 18:9", "1 Samuel 18:10", "1 Samuel 18:11", "1 Samuel 18:12"]`.

Verification: combined character schema passes; 14 verse anchors and 6 story links pass. 0 quoted spans match packaged KJV.
Identity: `saul_2478` → `recjMT68aIzFLh6cQ`; inherited family edges disabled. Explicit family targets: `[{"relation": "children", "label": "Jonathan", "profile_id": "jonathan"}, {"relation": "children", "label": "Michal", "profile_id": "michal"}]`.

### `jonathan`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Saul's son and David's friend. He and his armour carrier attack a Philistine outpost without telling Saul. The people later refuse to let Saul put Jonathan to death. He and David make a lasting agreement. Jonathan gives David his robe, sword and bow and warns him of Saul's plans. He says David will be king, with himself next in rank. He dies with Saul at Gilboa. David's song of grief calls Jonathan's love wonderful.

Other edits:
- `lineage.siblings`: `null` → `["Michal"]`.

Verification: combined character schema passes; 9 verse anchors and 4 story links pass. 0 quoted spans match packaged KJV.
Identity: `jonathan_1692` → `recFPPmYLHmfePYj9`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Saul", "profile_id": "saul"}, {"relation": "children", "label": "Mephibosheth", "profile_id": "mephibosheth"}, {"relation": "siblings", "label": "Michal", "profile_id": "michal"}]`.

### `david`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Jesse's youngest son from Bethlehem, summoned from the sheep and then anointed by Samuel. He kills Goliath with a sling and stone and serves Saul. He later flees Saul, leading an outlaw group in the wilderness and at Ziklag. After Saul's death, he becomes king at Hebron. The account gives him seven and a half years there and thirty-three in Jerusalem. It describes the Lord promising him a lasting royal line and throne. Nathan confronts him over Bathsheba and Uriah's death. The book also describes Absalom's revolt. The New Testament names David in Jesus' family list and Paul's speech at Antioch.

Other edits:
- `lineage.children`: `["Amnon", "Chileab", "Absalom", "Adonijah", "Shephatiah", "Ithream", "Solomon", "Tamar"]` → `["Amnon", "Chileab", "Absalom", "Adonijah", "Shephatiah", "Ithream", "Solomon", "Tamar, daughter of David"]`.
- `lineage.spouses`: `["Michal", "Ahinoam the Jezreelitess", "Abigail, widow of Nabal", "Maacah", "Haggith", "Abital", "Eglah", "Bathsheba"]` → `["Michal", "Ahinoam the Jezreelitess", "Abigail", "Maacah", "Haggith", "Abital", "Eglah", "Bathsheba"]`.
- `narrative_anchors.key_verses`: `["1 Samuel 16:11", "1 Samuel 16:13", "1 Samuel 17:12", "1 Samuel 17:50", "1 Samuel 27:6", "2 Samuel 5:3", "2 Samuel 5:4", "2 Samuel 5:7", "2 Samuel 7:16", "2 Samuel 11:4", "2 Samuel 12:13", "2 Samuel 18:33", "Acts 13:22"]` → `["1 Samuel 16:11", "1 Samuel 16:13", "1 Samuel 17:12", "1 Samuel 17:50", "1 Samuel 27:6", "2 Samuel 5:3", "2 Samuel 5:4", "2 Samuel 5:7", "2 Samuel 7:16", "2 Samuel 11:4", "2 Samuel 12:13", "2 Samuel 18:33", "Acts 13:22", "1 Samuel 16:12"]`.

Verification: combined character schema passes; 14 verse anchors and 12 story links pass. 0 quoted spans match packaged KJV.
Identity: `david_994` → `rec1ZMFtfbEvoGC73`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Michal", "profile_id": "michal"}, {"relation": "spouses", "label": "Abigail", "profile_id": "abigail"}, {"relation": "spouses", "label": "Bathsheba", "profile_id": "bathsheba"}, {"relation": "children", "label": "Amnon", "profile_id": "amnon"}, {"relation": "children", "label": "Absalom", "profile_id": "absalom"}, {"relation": "children", "label": "Adonijah", "profile_id": "adonijah"}, {"relation": "children", "label": "Solomon", "profile_id": "solomon"}, {"relation": "children", "label": "Tamar, daughter of David", "profile_id": "tamar-daughter-of-david"}]`.

### `michal`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Saul's younger daughter, who loves David. Saul gives her to David after he brings back two hundred Philistine foreskins. When Saul sends men to kill David, she lowers David through a window. He escapes. Saul later gives her to Phalti son of Laish. David demands her return through Abner and Ishbosheth. When the ark enters Jerusalem, she sees David dancing and despises him in her heart. Second Samuel 6:23 says she had no child until her death. This profile does not settle that statement against 2 Samuel 21:8.

Verification: combined character schema passes; 9 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `michal_2073` → `recjqxIrJX2UB8DdR`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Saul", "profile_id": "saul"}, {"relation": "spouses", "label": "David", "profile_id": "david"}, {"relation": "siblings", "label": "Jonathan", "profile_id": "jonathan"}]`.

### `abigail`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Nabal's wife from Carmel, whom First Samuel describes as having good understanding. Nabal is described as harsh. After he insults David's men, Abigail brings David bread, wine, sheep, grain, raisins and figs without telling Nabal. About ten days later, Nabal dies. David then sends for Abigail, and she becomes his wife. Second Samuel 3:3 names their son Chileab; the parallel list in 1 Chronicles 3:1 names him Daniel.

Other edits:
- `narrative_anchors.key_verses`: `["1 Samuel 25:3", "1 Samuel 25:18", "1 Samuel 25:19", "1 Samuel 25:38", "1 Samuel 25:42", "2 Samuel 3:3"]` → `["1 Samuel 25:3", "1 Samuel 25:18", "1 Samuel 25:19", "1 Samuel 25:38", "1 Samuel 25:42", "2 Samuel 3:3", "1 Samuel 25:37", "1 Samuel 25:39", "1 Chronicles 3:1"]`.

Verification: combined character schema passes; 9 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `abigail_26` → `reckcSleXhZyNw9hI`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "David", "profile_id": "david"}]`.

### `bathsheba`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Eliam's daughter and Uriah the Hittite's wife in Second Samuel. First Chronicles' parallel family list uses the names Bathshua and Ammiel; the name link is not proved here. David sees Bathsheba from his roof, sends for her and has sex with her. She conceives; David arranges Uriah's death and marries her. Their first child dies. She later bears Solomon, whom the text says the Lord loved. With Nathan, she raises the succession with the ageing David, who promises Solomon the throne. Solomon later seats her at his right hand. Matthew calls her the wife of Urias.

Other edits:
- `lineage.parents`: `["Eliam (Ammiel in 1 Chronicles 3:5)"]` → `["Eliam"]`.
- `lineage.spouses`: `["Uriah the Hittite", "David"]` → `["Uriah", "David"]`.

Verification: combined character schema passes; 9 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `bathsheba_416` → `rec48avi3AS18d5V6`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Uriah", "profile_id": "uriah"}, {"relation": "spouses", "label": "David", "profile_id": "david"}, {"relation": "children", "label": "Solomon", "profile_id": "solomon"}]`.

### `nathan`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A prophet at David's court, distinct from David's son of that name. In Second Samuel 7, he first supports David's plan for a house for the ark. He changes his answer after receiving the Lord's word. He tells David about a rich man taking a poor man's lamb, then says, “Thou art the man”. David confesses, and Nathan says the Lord has put away his sin. The name Jedidiah is given to the child through Nathan. Later, Nathan joins Bathsheba in urging David to make Solomon king. David directs Nathan and Zadok to anoint Solomon.

Verification: combined character schema passes; 8 verse anchors and 3 story links pass. 1 quoted spans match packaged KJV.
Identity: `nathan_2153` → `rec2OlshepuMiuLDJ`; inherited family edges disabled. Explicit family targets: `[]`.

### `absalom`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: David's third son, born at Hebron to Maacah, the daughter of Geshur's king. Second Samuel praises his beauty. He has Amnon killed after Amnon rapes his sister Tamar, then flees to Geshur for three years. Joab brings him back. He wins over people seeking the king's judgment and proclaims himself king at Hebron. David leaves Jerusalem. Absalom catches his head in an oak and is killed by Joab and ten armour carriers. David mourns him with “O my son Absalom”. The account names three sons and a daughter; this profile does not settle that against 2 Samuel 18:18.

Other edits:
- `lineage.siblings`: `["Tamar", "Amnon"]` → `["Tamar, daughter of David", "Amnon", "Adonijah"]`.

Verification: combined character schema passes; 11 verse anchors and 2 story links pass. 1 quoted spans match packaged KJV.
Identity: `absalom_59` → `recEdhjnlbofKC5rc`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "David", "profile_id": "david"}, {"relation": "siblings", "label": "Tamar, daughter of David", "profile_id": "tamar-daughter-of-david"}, {"relation": "siblings", "label": "Amnon", "profile_id": "amnon"}, {"relation": "siblings", "label": "Adonijah", "profile_id": "adonijah"}]`.

### `joab`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Zeruiah's son, brother of Abishai and Asahel, and commander of David's army. Second Samuel says he kills Abner to avenge Asahel. He later kills Amasa and strikes Absalom with darts against David's wishes. David calls Zeruiah's sons too hard for him. Joab supports Adonijah in the struggle for the throne; he had not supported Absalom. Following David's charge, Solomon orders Benaiah to kill Joab beside the altar. Joab is buried at his own house in the wilderness.

Verification: combined character schema passes; 9 verse anchors and 5 story links pass. 0 quoted spans match packaged KJV.
Identity: `joab_1617` → `reci5XsSfPw9RZWBA`; inherited family edges disabled. Explicit family targets: `[]`.

### `solomon`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: David and Bathsheba's son, also given the name Jedidiah because of the Lord. He becomes king after David, despite Adonijah's attempt to take the throne. He asks God for understanding to judge the people. The account says God gives him wisdom and further gifts he did not request. He builds the temple over seven years. Kings lists seven hundred wives and three hundred concubines, partners distinct from wives. It says his heart turns toward other gods in old age. It gives him forty years as king in Jerusalem.

Other edits:
- `lineage.siblings`: `null` → `["Adonijah"]`.

Verification: combined character schema passes; 10 verse anchors and 4 story links pass. 0 quoted spans match packaged KJV.
Identity: `solomon_2762` → `rec0BAacWSGBXZ0zI`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "David", "profile_id": "david"}, {"relation": "parents", "label": "Bathsheba", "profile_id": "bathsheba"}, {"relation": "siblings", "label": "Adonijah", "profile_id": "adonijah"}]`.

### `mephibosheth`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Jonathan's son, whose feet are disabled after his nurse drops him while fleeing when he is five. David restores Saul's land to him and gives him a place at the king's table for Jonathan's sake. During Absalom's revolt, Ziba says Mephibosheth stayed behind hoping to gain the kingdom. David gives Ziba his goods. On David's return, Mephibosheth says Ziba deceived him. David tells them to divide the land; Mephibosheth says Ziba can take it all. This profile does not decide between their accounts. A parallel family list uses Meribbaal; he is distinct from the Mephibosheth in 2 Samuel 21:8.

Other edits:
- `aliases`: `["Meribbaal"]` → `["Meribbaal (name in the parallel genealogy)"]`.

Verification: combined character schema passes; 9 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `mephibosheth_1999` → `rec6D4qakD8wceZv8`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Jonathan", "profile_id": "jonathan"}]`.

### `uriah`

Draft: [samuel-kings-characters-records.json](../../claude-drafts/samuel-kings-characters-records.json). Review: [c3-samuel-kings-characters.md](c3-samuel-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Bathsheba's husband, called a Hittite and listed among David's thirty-seven leading warriors. David orders Joab to place him where the battle is fiercest and withdraw so he will be killed. Uriah dies during the siege. Joab's message anticipates David's anger. Matthew refers to him as Urias. The Hittite label does not establish his birthplace.

Verification: combined character schema passes; 6 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `uriah_2898` → `recqDQWQP9P7218TS`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Bathsheba", "profile_id": "bathsheba"}]`.

### `rehoboam`

Draft: [kings-characters-records.json](../../claude-drafts/kings-characters-records.json). Review: [c4-kings-characters.md](c4-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Solomon's son by Naamah the Ammonite, who becomes king at Shechem at forty-one. The people ask him to ease the burdens Solomon imposed. He rejects the elders' advice for that of his young peers. He promises “scorpions” where Solomon used whips. Ten tribes leave him, while Judah and Benjamin remain. Kings says a message through Shemaiah stops him from attacking Israel. In his fifth year, Shishak of Egypt takes treasures from the temple and royal house. War with Jeroboam continues throughout his reign.

Other edits:
- `geography.origin`: `"Jerusalem, son of Solomon (1 Kings 14:21)"` → `"Birthplace not stated; rules from Jerusalem (1 Kings 14:21)."`.

Verification: combined character schema passes; 10 verse anchors and 2 story links pass. 1 quoted spans match packaged KJV.
Identity: `rehoboam_2412` → `recqQthL4TAHb0KeC`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Solomon", "profile_id": "solomon"}]`.

### `jeroboam`

Draft: [kings-characters-records.json](../../claude-drafts/kings-characters-records.json). Review: [c4-kings-characters.md](c4-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Nebat and Zeruah's son from Zereda, called an Ephrathite. Solomon puts him over the labour force of Joseph's tribes. Ahijah tears a garment into twelve pieces and gives him ten, with a conditional promise of a lasting royal line. Solomon seeks to kill him, so he flees to Egypt until Solomon dies. The people call him back and make him king at Shechem. He sets up golden calves at Bethel and Dan, appoints priests outside Levi and establishes an eighth-month feast. Kings uses his sin to judge later rulers. He reigns twenty-two years, followed by his son Nadab.

Verification: combined character schema passes; 10 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `jeroboam_872` → `recXhPherZAxvXTS4`; inherited family edges disabled. Explicit family targets: `[]`.

### `ahab`

Draft: [kings-characters-records.json](../../claude-drafts/kings-characters-records.json). Review: [c4-kings-characters.md](c4-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Omri's son, who rules Israel from Samaria for twenty-two years. Kings says he does more evil than all before him. He marries Jezebel, Ethbaal's daughter, and serves Baal. Elijah announces a drought, meets him on Carmel and confronts him after Naboth's death. Ahab then humbles himself. While fighting Syria at Ramoth-gilead, an arrow shot at random strikes him. Kings says he dies that evening in his chariot and dogs lick the blood washed from it. This profile does not settle Athaliah's parentage or identify Ahab with Jeremiah's Ahab.

Other edits:
- `geography.origin`: `"Samaria, son of Omri (1 Kings 16:29)"` → `"Birthplace not stated; rules from Samaria (1 Kings 16:29)."`.

Verification: combined character schema passes; 10 verse anchors and 4 story links pass. 0 quoted spans match packaged KJV.
Identity: `ahab_113` → `rec91wntVnuliHv7E`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Jezebel", "profile_id": "jezebel"}]`.

### `jezebel`

Draft: [kings-characters-records.json](../../claude-drafts/kings-characters-records.json). Review: [c4-kings-characters.md](c4-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Ethbaal's daughter and Ahab's wife. Kings says Ahab marries Jezebel and serves Baal. It describes her killing the Lord's prophets and supporting four hundred prophets of the groves. She threatens Elijah's life after Carmel. Using letters sealed with Ahab's seal, she arranges false charges against Naboth and his death by stoning. When Jehu reaches Jezreel, she paints her face and looks from a window. Court servants throw her down, and she is trampled. Only her skull, feet and palms remain when people come to bury her. Jehu links this to Elijah's words about dogs eating her flesh.

Other edits:
- `narrative_anchors.key_verses`: `["1 Kings 16:31", "1 Kings 18:4", "1 Kings 18:19", "1 Kings 19:2", "1 Kings 21:7", "1 Kings 21:8", "1 Kings 21:23", "2 Kings 9:22", "2 Kings 9:30", "2 Kings 9:33", "2 Kings 9:36"]` → `["1 Kings 16:31", "1 Kings 18:4", "1 Kings 18:19", "1 Kings 19:2", "1 Kings 21:7", "1 Kings 21:8", "1 Kings 21:23", "2 Kings 9:22", "2 Kings 9:30", "2 Kings 9:33", "2 Kings 9:36", "1 Kings 22:52"]`.

Verification: combined character schema passes; 12 verse anchors and 4 story links pass. 0 quoted spans match packaged KJV.
Identity: `jezebel_1605` → `recJRZ55dvZRRb0mg`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Ahab", "profile_id": "ahab"}]`.

### `jehu`

Draft: [kings-characters-records.json](../../claude-drafts/kings-characters-records.json). Review: [c4-kings-characters.md](c4-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Son of Jehoshaphat and grandson of Nimshi, serving as a commander at Ramoth-gilead. A prophet sent by Elisha anoints him king of Israel. He shoots Joram at Naboth's plot, orders Ahaziah struck down and sees Jezebel thrown from her window. He has Ahab's seventy sons killed at Samaria and destroys Baal's worshippers and temple. Kings describes the Lord promising his descendants four generations on the throne. It also criticizes his continued calf worship and incomplete obedience. He reigns twenty-eight years. His father's name does not identify him with King Jehoshaphat of Judah.

Verification: combined character schema passes; 11 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `jehu_817` → `receyzziW4sDhoPTk`; inherited family edges disabled. Explicit family targets: `[]`.

### `athaliah`

Draft: [kings-characters-records.json](../../claude-drafts/kings-characters-records.json). Review: [c4-kings-characters.md](c4-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Ahaziah of Judah's mother. Second Kings 8:26 calls her Omri's daughter; 8:18 calls Jehoram's wife Ahab's daughter. These labels do not settle the exact family relationship here. After Ahaziah dies, she attacks the royal family. Jehosheba, Joram's daughter and Ahaziah's sister, hides the infant Joash in the temple for six years while Athaliah rules. In the seventh year, Jehoiada makes an agreement with the captains and guards and crowns Joash. Athaliah is taken out and killed near the horses' entrance to the royal house.

Other edits:
- `lineage.parents`: `["Omri (2 Kings 8:26) or Ahab (2 Kings 8:18); the text uses both"]` → `null`.

Verification: combined character schema passes; 7 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `athaliah_359` → `recjyWBYEzNaB2uZC`; inherited family edges disabled. Explicit family targets: `[]`.

### `naaman`

Draft: [kings-characters-records.json](../../claude-drafts/kings-characters-records.json). Review: [c4-kings-characters.md](c4-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A Syrian commander whom Second Kings describes as honoured and brave, but affected by leprosy. A captive Israelite girl tells his wife about the prophet in Samaria. Naaman travels with his king's letter. Elisha tells him to wash seven times in the Jordan. He is angry, but follows his servants' advice and washes. The account says he is healed. He declares that God is found only in Israel and takes earth home for worship. He asks pardon for bowing in Rimmon's temple while attending his master. Jesus mentions Naaman while discussing lepers in Israel during Elisha's time.

Verification: combined character schema passes; 9 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `naaman_2122` → `recNRf3uss32ZuTw7`; inherited family edges disabled. Explicit family targets: `[]`.

### `hezekiah`

Draft: [kings-characters-records.json](../../claude-drafts/kings-characters-records.json). Review: [c4-kings-characters.md](c4-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Ahaz and Abi's son, who becomes Judah's king at twenty-five and reigns twenty-nine years. He removes shrines and images and breaks Moses' bronze serpent, which people had used for worship. He calls it Nehushtan. When Sennacherib attacks Judah's towns, Hezekiah pays the demand. He later prays after an Assyrian official's challenge. Kings describes the Lord's angel striking the Assyrian camp. In the illness account, Isaiah tells him to prepare for death. He prays and receives fifteen more years, with a backward-moving shadow as a sign. After he shows Babylonian envoys his treasures, Isaiah warns they will be carried to Babylon. These episodes do not establish an independent chronology here.

Other edits:
- `geography.origin`: `"Jerusalem, son of Ahaz (2 Kings 18:1)"` → `"Birthplace not stated; rules from Jerusalem (2 Kings 18:2)."`.

Verification: combined character schema passes; 11 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `hezekiah_1512` → `recNlVijtEIdQhAIm`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Ahaz", "profile_id": "ahaz"}, {"relation": "children", "label": "Manasseh", "profile_id": "manasseh"}]`.

### `manasseh`

Draft: [kings-characters-records.json](../../claude-drafts/kings-characters-records.json). Review: [c4-kings-characters.md](c4-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Hezekiah's son, who becomes Judah's king at twelve and reigns fifty-five years. Kings describes him restoring shrines, building altars for Baal and heavenly bodies, and making his son pass through fire. It also describes his dealings with spirits and the innocent blood he sheds in Jerusalem. Kings reports a warning of disaster for Jerusalem because of his sins. Chronicles adds an account of Assyrian captains taking him in chains to Babylon. It says he humbles himself there and returns to Jerusalem. His son Amon follows him.

Other edits:
- `geography.origin`: `"Jerusalem, son of Hezekiah (2 Kings 21:1)"` → `"Birthplace not stated; rules from Jerusalem (2 Kings 21:1)."`.

Verification: combined character schema passes; 10 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `manasseh_1930` → `rec5LjGfCEP8klGHt`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Hezekiah", "profile_id": "hezekiah"}]`.

### `josiah`

Draft: [kings-characters-records.json](../../claude-drafts/kings-characters-records.json). Review: [c4-kings-characters.md](c4-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Amon and Jedidah's son, who becomes Judah's king at eight and reigns thirty-one years. Kings says he does right in the Lord's sight. In his eighteenth year, Hilkiah finds the law book in the temple. Josiah tears his clothes and sends to Huldah, a prophet. He reads the book to the people and makes an agreement to follow it. He removes idols and shrines in Judah and at Bethel. Kings links his actions at Bethel to an earlier prophet's words. It describes his Passover and his turning to the Lord as unequalled. Pharaoh-nechoh kills him at Megiddo.

Other edits:
- `narrative_anchors.books`: `["2 Kings", "1 Kings", "Matthew"]` → `["2 Kings", "1 Kings", "Matthew", "1 Chronicles"]`.
- `narrative_anchors.key_verses`: `["1 Kings 13:2", "2 Kings 22:1", "2 Kings 22:8", "2 Kings 22:14", "2 Kings 23:3", "2 Kings 23:15", "2 Kings 23:21", "2 Kings 23:22", "2 Kings 23:25", "2 Kings 23:29", "2 Kings 23:30"]` → `["1 Kings 13:2", "2 Kings 22:1", "2 Kings 22:8", "2 Kings 22:14", "2 Kings 23:3", "2 Kings 23:15", "2 Kings 23:21", "2 Kings 23:22", "2 Kings 23:25", "2 Kings 23:29", "2 Kings 23:30", "1 Chronicles 3:15", "2 Kings 23:34", "2 Kings 24:17"]`.

Verification: combined character schema passes; 14 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `josiah_1730` → `recNOn1RcB3sCzCnh`; inherited family edges disabled. Explicit family targets: `[{"relation": "children", "label": "Zedekiah", "profile_id": "zedekiah"}]`.

### `abner`

Draft: [kings-characters-records.json](../../claude-drafts/kings-characters-records.json). Review: [c4-kings-characters.md](c4-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Ner's son and commander of Saul's army. First Samuel 14:50–51 supplies the family wording; this profile does not call Abner Saul's uncle. After Saul dies, Abner makes Ish-bosheth king at Mahanaim and leads his forces against David's men. During the fighting at Gibeon, he twice warns Asahel to stop pursuing him, then kills him with his spear. He quarrels with Ish-bosheth over Rizpah and offers to bring Israel over to David. David receives him at Hebron. Joab kills him at the gate; the account gives revenge for Asahel as the reason. David mourns publicly and walks behind his body.

Verification: combined character schema passes; 8 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `abner_57` → `recX02UfwuM8OP0p3`; inherited family edges disabled. Explicit family targets: `[]`.

### `adonijah`

Draft: [kings-characters-records.json](../../claude-drafts/kings-characters-records.json). Review: [c4-kings-characters.md](c4-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: David's fourth son, born to Haggith after Absalom. As David ages, Adonijah declares he will be king, with chariots and fifty runners. Joab and Abiathar support him, and he holds a feast at En-rogel. Nathan and Bathsheba urge David to name Solomon. Adonijah flees to the altar and is spared on condition of good conduct. After David's death, he asks Bathsheba to request Abishag as his wife. Solomon sends Benaiah to kill him. This profile adds no hidden motive for Adonijah's request.

Verification: combined character schema passes; 9 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `adonijah_97` → `recMIpVUk92YKxyNs`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "David", "profile_id": "david"}, {"relation": "siblings", "label": "Absalom", "profile_id": "absalom"}, {"relation": "siblings", "label": "Solomon", "profile_id": "solomon"}]`.

### `amnon`

Draft: [kings-characters-records.json](../../claude-drafts/kings-characters-records.json). Review: [c4-kings-characters.md](c4-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: David's firstborn son, born at Hebron to Ahinoam. Second Samuel describes his desire for his half-sister Tamar and his distress. Following Jonadab's advice, he pretends to be ill and asks Tamar to bring food. He rapes her, then the account says his hatred exceeds his earlier desire. He has her thrown out. David is very angry, but this episode reports no action by him. Two years later, Absalom orders his servants to kill Amnon during a sheep-shearing feast while Amnon is drinking wine.

Other edits:
- `lineage.siblings`: `["Absalom", "Tamar (half-sister)"]` → `["Absalom", "Tamar, daughter of David"]`.

Verification: combined character schema passes; 8 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `amnon_232` → `rec894DFEhD0nzF6w`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "David", "profile_id": "david"}, {"relation": "siblings", "label": "Absalom", "profile_id": "absalom"}, {"relation": "siblings", "label": "Tamar, daughter of David", "profile_id": "tamar-daughter-of-david"}]`.

### `tamar-daughter-of-david`

Draft: [kings-characters-records.json](../../claude-drafts/kings-characters-records.json). Review: [c4-kings-characters.md](c4-kings-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: David's daughter and Absalom's sister, whom Second Samuel describes as beautiful. She wears the special garment of the king's unmarried daughters. David sends her to prepare food for Amnon. She begs Amnon not to force her and says he could ask the king for her. Amnon rapes her and throws her out. She tears her garment, puts ashes on her head and cries aloud. Absalom takes her in, and the account describes her remaining desolate in his house. She is distinct from Judah's daughter-in-law and from Absalom's daughter Tamar in 2 Samuel 14:27.

Other edits:
- `lineage.siblings`: `["Absalom", "Amnon (half-brother)"]` → `["Absalom", "Amnon"]`.

Verification: combined character schema passes; 8 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `tamar_2822` → `recWfXI5GaLhZTDeT`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "David", "profile_id": "david"}, {"relation": "siblings", "label": "Absalom", "profile_id": "absalom"}, {"relation": "siblings", "label": "Amnon", "profile_id": "amnon"}]`.

### `cyrus`

Draft: [ezra-daniel-characters-records.json](../../claude-drafts/ezra-daniel-characters-records.json). Review: [c5-ezra-daniel-characters.md](c5-ezra-daniel-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: King of Persia, whose first-year proclamation in Ezra permits Judeans to return and rebuild Jerusalem's temple. He says the God of heaven gave him his kingdoms and calls God's people to go. He asks neighbours to help with silver, gold and goods. He returns temple vessels taken by Nebuchadnezzar, counting them out to Sheshbazzar. Ezra links this to Jeremiah's words. Isaiah calls Cyrus the Lord's anointed, and Daniel says Daniel prospers into his reign. These texts do not say every Judean returned or establish Cyrus's birthplace.

Other edits:
- `geography.origin`: `"Persia (Ezra 1:1)"` → `"Birthplace not stated; king of Persia in Ezra 1:1."`.

Verification: combined character schema passes; 10 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `cyrus_968` → `recYS0HXBlTsRDtlc`; inherited family edges disabled. Explicit family targets: `[]`.

### `zerubbabel`

Draft: [ezra-daniel-characters-records.json](../../claude-drafts/ezra-daniel-characters-records.json). Review: [c5-ezra-daniel-characters.md](c5-ezra-daniel-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A leader among those returning from Babylon. Ezra and Haggai call him Shealtiel's son, while 1 Chronicles 3:19 lists him among Pedaiah's sons. This profile leaves that difference unresolved and does not identify him with Sheshbazzar. With Jeshua, he builds the altar and lays the temple foundation in the second year. After work stops, messages from Haggai and Zechariah prompt them to begin again. Haggai calls him Judah's governor and describes the Lord promising to make him a signet, a seal of authority. Zechariah says he will finish the temple. Matthew places him in Jechonias's family line.

Other edits:
- `lineage.parents`: `["Shealtiel"]` → `null`.

Verification: combined character schema passes; 9 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `zerubbabel_3054` → `rec0lXwCB3xvWjTVN`; inherited family edges disabled. Explicit family targets: `[]`.

### `ezra`

Draft: [ezra-daniel-characters-records.json](../../claude-drafts/ezra-daniel-characters-records.json). Review: [c5-ezra-daniel-characters.md](c5-ezra-daniel-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A priest from Aaron's line through Seraiah and a trained reader and teacher of Moses' law. In Artaxerxes' seventh year, he leaves Babylon with the king's letter on the first day of the first month. Ezra 7:9 places his arrival in Jerusalem on the first day of the fifth month. The book says he prepares to study, follow and teach the law. After hearing about marriages to foreign women, he prays and weeps. Ezra 10:3 describes an agreement to send the women away. Nehemiah describes him reading the law to the people on the first day of the seventh month.

Other edits:
- `narrative_anchors.key_verses`: `["Ezra 7:1", "Ezra 7:5", "Ezra 7:6", "Ezra 7:8", "Ezra 7:10", "Ezra 7:11", "Ezra 10:1", "Ezra 10:5", "Nehemiah 8:1", "Nehemiah 8:2", "Nehemiah 12:26"]` → `["Ezra 7:1", "Ezra 7:5", "Ezra 7:6", "Ezra 7:8", "Ezra 7:10", "Ezra 7:11", "Ezra 10:1", "Ezra 10:5", "Nehemiah 8:1", "Nehemiah 8:2", "Nehemiah 12:26", "Ezra 7:9", "Ezra 10:3"]`.

Verification: combined character schema passes; 13 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `ezra_1245` → `recKCifIYcTXovrF4`; inherited family edges disabled. Explicit family targets: `[]`.

### `nehemiah`

Draft: [ezra-daniel-characters-records.json](../../claude-drafts/ezra-daniel-characters-records.json). Review: [c5-ezra-daniel-characters.md](c5-ezra-daniel-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Hachaliah's son, serving at Shushan when Hanani and others report Jerusalem's broken wall and the people's distress. He weeps, fasts and prays. In Artaxerxes' twentieth year, he serves the king's drink and asks to rebuild the city. He receives letters and timber. Nehemiah describes the wall builders facing opposition, carrying weapons as they work. He governs Judah for twelve years without taking the governor's food allowance. He later returns to the king, then comes back to make further reforms. This profile does not identify every Nehemiah in the records as this governor.

Other edits:
- `narrative_anchors.linked_stories`: `[{"story_id": "nehemiah-nehemiah-s-prayer-and-commission", "title": "Nehemiah's Prayer and Commission", "passage": "Nehemiah 1:1 - 2:10", "route": "#stories/nehemiah/nehemiah-s-prayer-and-commission"}, {"story_id": "nehemiah-rebuilding-the-wall", "title": "Rebuilding the Wall", "passage": "Nehemiah 2:11 - 4:23", "route": "#stories/nehemiah/rebuilding-the-wall"}, {"story_id": "nehemiah-debt-relief", "title": "Debt Relief", "passage": "Nehemiah 5:1 - 5:19", "route": "#stories/nehemiah/debt-relief"}, {"story_id": "nehemiah-the-wall-completed", "title": "The Wall Completed", "passage": "Nehemiah 6:1 - 7:73", "route": "#stories/nehemiah/the-wall-completed"}, {"story_id": "nehemiah-nehemiah-s-reforms", "title": "Nehemiah's Reforms", "passage": "Nehemiah 13:1 - 13:31", "route": "#stories/nehemiah/nehemiah-s-reforms"}]` → `[{"story_id": "nehemiah-nehemiah-s-prayer-and-commission", "title": "Nehemiah's Prayer and Commission", "passage": "Nehemiah 1:1 - 2:10", "route": "#stories/nehemiah/nehemiah-s-prayer-and-commission"}, {"story_id": "nehemiah-rebuilding-the-wall", "title": "Rebuilding the Wall", "passage": "Nehemiah 2:11 - 4:23", "route": "#stories/nehemiah/rebuilding-the-wall"}, {"story_id": "nehemiah-debt-relief", "title": "Debt Relief", "passage": "Nehemiah 5:1 - 5:19", "route": "#stories/nehemiah/debt-relief"}, {"story_id": "nehemiah-the-wall-completed", "title": "The Wall Completed", "passage": "Nehemiah 6:1 - 7:5", "route": "#stories/nehemiah/the-wall-completed"}, {"story_id": "nehemiah-nehemiah-s-reforms", "title": "Nehemiah's Reforms", "passage": "Nehemiah 13:1 - 13:31", "route": "#stories/nehemiah/nehemiah-s-reforms"}]`.

Verification: combined character schema passes; 10 verse anchors and 5 story links pass. 0 quoted spans match packaged KJV.
Identity: `nehemiah_2172` → `recHC0HgcWgcXChGp`; inherited family edges disabled. Explicit family targets: `[]`.

### `sanballat`

Draft: [ezra-daniel-characters-records.json](../../claude-drafts/ezra-daniel-characters-records.json). Review: [c5-ezra-daniel-characters.md](c5-ezra-daniel-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Called the Horonite in Nehemiah. With Tobiah and Geshem, he mocks the people rebuilding Jerusalem's wall. He speaks before Samaria's army. When the wall lacks only its doors, he sends four requests for Nehemiah to meet him near Ono. Nehemiah says they intend harm; this is Nehemiah's account of their purpose. Later, a son of Joiada from the high priest's family becomes Sanballat's son-in-law. Nehemiah drives that man away. The Horonite label is not used here to assign a modern nationality.

Other edits:
- `narrative_anchors.linked_stories`: `[{"story_id": "nehemiah-rebuilding-the-wall", "title": "Rebuilding the Wall", "passage": "Nehemiah 2:11 - 4:23", "route": "#stories/nehemiah/rebuilding-the-wall"}, {"story_id": "nehemiah-the-wall-completed", "title": "The Wall Completed", "passage": "Nehemiah 6:1 - 7:73", "route": "#stories/nehemiah/the-wall-completed"}, {"story_id": "nehemiah-nehemiah-s-reforms", "title": "Nehemiah's Reforms", "passage": "Nehemiah 13:1 - 13:31", "route": "#stories/nehemiah/nehemiah-s-reforms"}]` → `[{"story_id": "nehemiah-rebuilding-the-wall", "title": "Rebuilding the Wall", "passage": "Nehemiah 2:11 - 4:23", "route": "#stories/nehemiah/rebuilding-the-wall"}, {"story_id": "nehemiah-the-wall-completed", "title": "The Wall Completed", "passage": "Nehemiah 6:1 - 7:5", "route": "#stories/nehemiah/the-wall-completed"}, {"story_id": "nehemiah-nehemiah-s-reforms", "title": "Nehemiah's Reforms", "passage": "Nehemiah 13:1 - 13:31", "route": "#stories/nehemiah/nehemiah-s-reforms"}]`.

Verification: combined character schema passes; 8 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `sanballat_2470` → `rec52hiVeIo48q2Ru`; inherited family edges disabled. Explicit family targets: `[]`.

### `vashti`

Draft: [ezra-daniel-characters-records.json](../../claude-drafts/ezra-daniel-characters-records.json). Review: [c5-ezra-daniel-characters.md](c5-ezra-daniel-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Ahasuerus's queen, who holds a feast for women while he feasts with the princes. On the seventh day, the king is merry with wine. He sends seven court servants to bring her wearing the royal crown and display her beauty. She refuses, and he becomes angry. Esther gives no reason for her refusal. Memucan advises barring her from the king's presence and giving her position to another woman. A decree goes to every province. The later search for a queen leads to Esther taking her place.

Verification: combined character schema passes; 7 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `vashti_2937` → `recX0LVuxaIsDqO6p`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Ahasuerus", "profile_id": "ahasuerus"}]`.

### `ahasuerus`

Draft: [ezra-daniel-characters-records.json](../../claude-drafts/ezra-daniel-characters-records.json). Review: [c5-ezra-daniel-characters.md](c5-ezra-daniel-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Esther's king ruling 127 provinces from India to Ethiopia, with his throne at Shushan. In his third year, he displays his riches for 180 days, then gives a seven-day feast. He removes Vashti and makes Esther queen in his seventh year. He promotes Haman and gives his ring for the decree against the Jews. After Esther reveals the plot, he orders Haman's death and gives the ring to Mordecai. The book later says he imposes tribute on the land and islands. This profile does not settle his external historical identity.

Other edits:
- `narrative_anchors.key_verses`: `["Esther 1:1", "Esther 1:2", "Esther 1:3", "Esther 2:16", "Esther 2:17", "Esther 3:1", "Esther 7:10", "Esther 8:2", "Esther 10:3"]` → `["Esther 1:1", "Esther 1:2", "Esther 1:3", "Esther 2:16", "Esther 2:17", "Esther 3:1", "Esther 7:10", "Esther 8:2", "Esther 10:3", "Esther 1:4", "Esther 1:5"]`.

Verification: combined character schema passes; 11 verse anchors and 5 story links pass. 0 quoted spans match packaged KJV.
Identity: `ahasuerus_117` → `reck4FOoejZddGY7H`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Vashti", "profile_id": "vashti"}, {"relation": "spouses", "label": "Esther", "profile_id": "esther"}]`.

### `esther`

Draft: [ezra-daniel-characters-records.json](../../claude-drafts/ezra-daniel-characters-records.json). Review: [c5-ezra-daniel-characters.md](c5-ezra-daniel-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Hadassah, Abihail's daughter, whose cousin Mordecai raises her as his own daughter after her parents die. Esther says she enters the king's house in the tenth month of his seventh year and becomes queen. At Mordecai's direction, she keeps her people secret. When Haman's decree comes, Mordecai says help may come elsewhere and her position may be for this moment. She asks the Jews to fast three days and approaches the king without being called. The book describes two banquets, her naming Haman and a second decree for the Jews.

Verification: combined character schema passes; 8 verse anchors and 4 story links pass. 0 quoted spans match packaged KJV.
Identity: `esther_1343` → `recRuSINUX52qGLlh`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Ahasuerus", "profile_id": "ahasuerus"}]`.

### `mordecai`

Draft: [ezra-daniel-characters-records.json](../../claude-drafts/ezra-daniel-characters-records.json). Review: [c5-ezra-daniel-characters.md](c5-ezra-daniel-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Jair's son from Benjamin, living in Shushan and raising his cousin Esther. Esther traces his family through Shimei and Kish. He tells Esther to conceal her people, uncovers Bigthan and Teresh's plot and refuses to bow to Haman. When Haman's decree comes, he tears his clothes, wears mourning cloth and urges Esther to act. The king honours him publicly using Haman's own proposal. He later receives the king's ring. Esther puts him in charge of Haman's house, which the king gave to her. He writes about keeping Purim and becomes second to the king. This profile distinguishes him from Ezra's returnee Mordecai.

Verification: combined character schema passes; 10 verse anchors and 4 story links pass. 0 quoted spans match packaged KJV.
Identity: `mordecai_2107` → `recCNBE1sRdiZd1js`; inherited family edges disabled. Explicit family targets: `[]`.

### `haman`

Draft: [ezra-daniel-characters-records.json](../../claude-drafts/ezra-daniel-characters-records.json). Review: [c5-ezra-daniel-characters.md](c5-ezra-daniel-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Hammedatha's son, called an Agagite, whom Ahasuerus promotes above the princes. When Mordecai refuses to bow, Haman seeks to destroy Mordecai's people. He casts a lot to choose the day and offers the king ten thousand talents of silver. Despite his invitations to Esther's banquets, seeing Mordecai angers him. On advice from Zeresh and friends, he builds a gallows fifty cubits high. The king makes him lead Mordecai through the city in honour. Esther names him as the enemy, and he is hanged on his own gallows. His house goes to Esther, and his ten sons are killed.

Verification: combined character schema passes; 10 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `haman_1360` → `recWbF7K0mK6Cjo7U`; inherited family edges disabled. Explicit family targets: `[]`.

### `daniel`

Draft: [ezra-daniel-characters-records.json](../../claude-drafts/ezra-daniel-characters-records.json). Review: [c5-ezra-daniel-characters.md](c5-ezra-daniel-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A child of Judah taken to Babylon and renamed Belteshazzar. Daniel says he refuses the king's food and wine and receives understanding of dreams and visions from God. He explains Nebuchadnezzar's dream and is made ruler over Babylon's province. He reads the writing for Belshazzar. Under Darius, he is thrown into a lions' den for praying despite a decree. Later chapters describe beasts, a ram and goat, seventy weeks and a final vision in Cyrus's third year. Ezekiel names a Daniel with Noah and Job; the shared name does not settle his identity here. Matthew records Jesus referring to Daniel as a prophet.

Verification: combined character schema passes; 11 verse anchors and 6 story links pass. 0 quoted spans match packaged KJV.
Identity: `daniel_975` → `recc4xDKjSwM1pH12`; inherited family edges disabled. Explicit family targets: `[]`.

### `nebuchadnezzar`

Draft: [ezra-daniel-characters-records.json](../../claude-drafts/ezra-daniel-characters-records.json). Review: [c5-ezra-daniel-characters.md](c5-ezra-daniel-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: King of Babylon. Kings and Jeremiah describe his siege of Jerusalem, Jeconiah's captivity and the removal of temple vessels. His officers later burn the temple. Daniel describes his troubling dream of a statue and his promotion of Daniel over the wise men. He makes a gold image and orders three Judean men thrown into a furnace, then praises their God. Daniel also describes him living apart from people and eating grass like oxen. He later raises his eyes to heaven and praises its King. Cyrus returns the temple vessels he had taken. Daniel's father language about Belshazzar does not establish a biological link here.

Other edits:
- `lineage.children`: `["Belshazzar (called his son in Daniel 5:22)"]` → `null`.

Verification: combined character schema passes; 10 verse anchors and 6 story links pass. 0 quoted spans match packaged KJV.
Identity: `nebuchadnezzar_2167` → `recTMYikvzJ27cDlA`; inherited family edges disabled. Explicit family targets: `[]`.

### `belshazzar`

Draft: [ezra-daniel-characters-records.json](../../claude-drafts/ezra-daniel-characters-records.json). Review: [c5-ezra-daniel-characters.md](c5-ezra-daniel-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Daniel calls him king of the Chaldeans. He feasts with a thousand lords and orders vessels taken from Jerusalem's temple brought out. The book describes a hand writing on the wall and his wise men failing to read it. The queen recalls Daniel. Daniel rebukes Belshazzar for not humbling himself despite knowing what happened to Nebuchadnezzar. Daniel reads and explains “Mene, Mene, Tekel, Upharsin”. Belshazzar clothes him in scarlet but is killed that night. The book places other visions in Belshazzar's first and third years. Its father language for Nebuchadnezzar does not settle biological parentage here.

Other edits:
- `lineage.parents`: `["Nebuchadnezzar (so called in Daniel 5:2)"]` → `null`.

Verification: combined character schema passes; 7 verse anchors and 2 story links pass. 1 quoted spans match packaged KJV.
Identity: `belshazzar_437` → `recunH0SANFhGPvSJ`; inherited family edges disabled. Explicit family targets: `[]`.

Source correction: Packaged Daniel 5:25 has Mene, Mene, Tekel, Upharsin; adjusted capitalization during the required quote recheck.

### `jonah`

Draft: [ezra-daniel-characters-records.json](../../claude-drafts/ezra-daniel-characters-records.json). Review: [c5-ezra-daniel-characters.md](c5-ezra-daniel-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Amittai's son from Gathhepher, named as a prophet during Jeroboam son of Joash's reign. Jonah says the Lord sends him to Nineveh, but he flees toward Tarshish. Sailors throw him overboard during a storm. The book describes three days and nights in a great fish, where he prays. Sent again, he announces Nineveh's fall in forty days. The people believe God and fast. Jonah becomes angry and sits outside the city; the Lord asks whether Nineveh should be spared. The Gospels later describe Jesus speaking of Jonah's sign. This profile does not identify a fish species or make a science claim.

Verification: combined character schema passes; 9 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `jonah_1689` → `recDDzG65U8UNAY4h`; inherited family edges disabled. Explicit family targets: `[]`.

### `isaiah`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Amoz's son, whose visions concern Judah and Jerusalem from Uzziah's reign to Hezekiah's. Isaiah describes seeing the Lord on a throne in the year Uzziah dies. He answers, “Here am I; send me”. He meets Ahaz with his son Shearjashub and offers the sign of Immanuel. Isaiah 8:3 describes a prophetess bearing his son without explicitly calling her his wife. Isaiah 20:3 describes his three years naked and barefoot as a sign against Egypt and Ethiopia. He speaks to Hezekiah during the Assyrian crisis and his illness. He warns that Babylon will carry away Hezekiah's treasures and sons.

Other edits:
- `geography.origin`: `"Judah and Jerusalem, son of Amoz (Isaiah 1:1)"` → `"Birthplace not stated; his visions concern Judah and Jerusalem (Isaiah 1:1)."`.
- `lineage.spouses`: `["The prophetess (unnamed)"]` → `null`.
- `narrative_anchors.key_verses`: `["Isaiah 1:1", "Isaiah 6:1", "Isaiah 6:8", "Isaiah 7:3", "Isaiah 7:14", "Isaiah 8:3", "Isaiah 20:2", "Isaiah 38:1", "Isaiah 39:6"]` → `["Isaiah 1:1", "Isaiah 6:1", "Isaiah 6:8", "Isaiah 7:3", "Isaiah 7:14", "Isaiah 8:3", "Isaiah 20:2", "Isaiah 38:1", "Isaiah 39:6", "Isaiah 20:3"]`.

Verification: combined character schema passes; 10 verse anchors and 4 story links pass. 1 quoted spans match packaged KJV.
Identity: `isaiah_617` → `recit3DiamFt2zO0S`; inherited family edges disabled. Explicit family targets: `[]`.

### `ahaz`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Jotham's son, who becomes Judah's king at twenty and reigns sixteen years in Jerusalem. Kings criticizes him for following Israel's kings, making his son pass through fire and offering sacrifices at shrines. When Syria and Israel threaten Jerusalem, Isaiah brings him a message to stay calm and not fear. Ahaz refuses the offered sign. Isaiah then gives the sign of Immanuel to David's family. This profile does not settle later readings of that sign. Hezekiah succeeds Ahaz.

Verification: combined character schema passes; 10 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `ahaz_118` → `recQoq4AXnZxZhOFh`; inherited family edges disabled. Explicit family targets: `[{"relation": "children", "label": "Hezekiah", "profile_id": "hezekiah"}]`.

### `sennacherib`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: King of Assyria, whom the biblical account places attacking Judah's fortified towns in Hezekiah's fourteenth year. Hezekiah offers tribute. Sennacherib sends Rabshakeh and other officials with a large army to Jerusalem's upper pool. Isaiah describes the Lord's angel striking the Assyrian camp, leaving 185,000 dead. The account says Sennacherib returns to Nineveh. Later, his sons Adrammelech and Sharezer kill him in his god's temple, and Esarhaddon succeeds him.

Verification: combined character schema passes; 8 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `sennacherib_2489` → `reczabgSpj7QAzpHQ`; inherited family edges disabled. Explicit family targets: `[]`.

### `jeremiah`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Hilkiah's son from the priests at Anathoth in Benjamin. His book describes receiving the Lord's words from Josiah's thirteenth year until Jerusalem's captivity. Told he was appointed a prophet before birth, he objects that he is young and cannot speak. Pashur strikes him and puts him in stocks. He opposes Hananiah's message and has Baruch write down his words. During Jerusalem's last siege, he is lowered into a pit and rescued by Ebed-melech. He later joins the group taken into Egypt against his warning.

Other edits:
- `lineage.tribe`: `"Levi (priestly family)"` → `null`.
- `narrative_anchors.linked_stories`: `[{"story_id": "jeremiah-jeremiah-s-call", "title": "Jeremiah's Call", "passage": "Jeremiah 1:1 - 1:19", "route": "#stories/jeremiah/jeremiah-s-call"}, {"story_id": "jeremiah-jeremiah-and-pashhur-the-temple-sermon", "title": "Jeremiah and Pashhur; the Temple Sermon", "passage": "Jeremiah 20:1 - 20:18", "route": "#stories/jeremiah/jeremiah-and-pashhur-the-temple-sermon"}, {"story_id": "jeremiah-hananiah-s-false-prophecy", "title": "Hananiah's False Prophecy", "passage": "Jeremiah 28:1 - 28:17", "route": "#stories/jeremiah/hananiah-s-false-prophecy"}, {"story_id": "jeremiah-the-scroll-burned", "title": "The Scroll Burned", "passage": "Jeremiah 36:1 - 36:32", "route": "#stories/jeremiah/the-scroll-burned"}, {"story_id": "jeremiah-jeremiah-in-the-cistern", "title": "Jeremiah in the Cistern", "passage": "Jeremiah 37:1 - 38:28", "route": "#stories/jeremiah/jeremiah-in-the-cistern"}, {"story_id": "jeremiah-the-fall-of-jerusalem-and-flight-to-egypt", "title": "The Fall of Jerusalem and Flight to Egypt", "passage": "Jeremiah 39:1 - 43:13", "route": "#stories/jeremiah/the-fall-of-jerusalem-and-flight-to-egypt"}]` → `[{"story_id": "jeremiah-jeremiah-s-call", "title": "Jeremiah's Call", "passage": "Jeremiah 1:1 - 1:19", "route": "#stories/jeremiah/jeremiah-s-call"}, {"story_id": "jeremiah-jeremiah-and-pashhur", "title": "Jeremiah and Pashhur", "passage": "Jeremiah 20:1 - 20:18", "route": "#stories/jeremiah/jeremiah-and-pashhur"}, {"story_id": "jeremiah-hananiah-s-false-prophecy", "title": "Hananiah's False Prophecy", "passage": "Jeremiah 28:1 - 28:17", "route": "#stories/jeremiah/hananiah-s-false-prophecy"}, {"story_id": "jeremiah-the-scroll-burned", "title": "The Scroll Burned", "passage": "Jeremiah 36:1 - 36:32", "route": "#stories/jeremiah/the-scroll-burned"}, {"story_id": "jeremiah-jeremiah-in-the-cistern", "title": "Jeremiah in the Cistern", "passage": "Jeremiah 37:1 - 38:28", "route": "#stories/jeremiah/jeremiah-in-the-cistern"}, {"story_id": "jeremiah-the-fall-of-jerusalem-and-flight-to-egypt", "title": "The Fall of Jerusalem and Flight to Egypt", "passage": "Jeremiah 39:1 - 43:13", "route": "#stories/jeremiah/the-fall-of-jerusalem-and-flight-to-egypt"}]`.

Verification: combined character schema passes; 11 verse anchors and 6 story links pass. 0 quoted spans match packaged KJV.
Identity: `jeremiah_853` → `recVuseK2cy7CXlve`; inherited family edges disabled. Explicit family targets: `[]`.

### `baruch`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Neriah's son, who writes down Jeremiah's words. In Jehoiakim's fourth year, he records Jeremiah's spoken messages from the Lord on a scroll. After the king burns it, Baruch writes another at Jeremiah's direction, with further words added. The book says the Lord hides both men from arrest. A separate message to Baruch records his grief and lack of rest. After Jerusalem falls, he is taken into Egypt with Jeremiah. Shared family names do not expressly establish Seraiah as his brother.

Other edits:
- `lineage.siblings`: `["Seraiah"]` → `null`.

Verification: combined character schema passes; 7 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `baruch_410` → `recklAsmU2Bd8lfCZ`; inherited family edges disabled. Explicit family targets: `[]`.

### `hananiah-son-of-azur`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Azur's son, a prophet from Gibeon, distinct from Daniel's companion. In Zedekiah's fourth year, he speaks before priests and people in the temple. He announces that the Lord has broken Babylon's power. He predicts the return of temple vessels, Jeconiah and the captives within two years. Jeremiah replies that the Lord did not send him and that his message makes people trust a lie. Jeremiah 28 says Hananiah dies that year, in the seventh month.

Verification: combined character schema passes; 7 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `hananiah_1395` → `recRexfzjGS7kUEIQ`; inherited family edges disabled. Explicit family targets: `[]`.

### `zedekiah`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Josiah and Hamutal's son, named Mattaniah before the king of Babylon renames him Zedekiah in 2 Kings 24:17. He becomes Judah's king at twenty-one and reigns eleven years. The account criticizes his rule and describes his revolt against Babylon. During the siege, he secretly asks Jeremiah for the Lord's word. He lets the princes put Jeremiah in a pit, then allows Ebed-melech to lift him out. He asks Jeremiah to keep their talks secret. Babylonian forces catch him near Jericho, kill his sons before him, blind him and take him to Babylon. Jeremiah says he remains imprisoned until death.

Verification: combined character schema passes; 10 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `zedekiah_1950` → `rec5naIzF29A8wJIP`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Josiah", "profile_id": "josiah"}]`.

### `ebed-melech`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A court servant whom Jeremiah calls an Ethiopian eunuch, using an ancient designation associated with Cush. This label does not assign him a modern nationality. He hears Jeremiah has been put in a pit and appeals to the king at Benjamin's gate. With permission, he takes thirty men and lowers cloth and ropes to lift Jeremiah out. Jeremiah remains in the prison court. Jeremiah 39:18 presents the Lord's promise to save Ebed-melech when the city falls. The stated reason is his trust in the Lord.

Other edits:
- `geography.origin`: `"Ethiopia (Jeremiah 38:7); serving in the king's house"` → `"Called Ethiopian in Jeremiah 38:7, an ancient designation associated with Cush; no modern nationality is assigned."`.

Verification: combined character schema passes; 7 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `ebed-melech_1029` → `recbwmT9xPSLwJUYu`; inherited family edges disabled. Explicit family targets: `[]`.

### `ezekiel`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Buzi's son and a priest among captives by the river Chebar in Chaldea. His book places its opening visions in the fifth year of Jehoiachin's captivity. It describes the heavens opening and visions of God. Addressed as “son of man”, Ezekiel is sent to speak and sits stunned among the exiles at Telabib. He is told to lie on his side as a sign of Israel's wrongdoing. The book describes his wife's death and a command not to mourn. Later, he describes the Spirit setting him in a valley of bones.

Other edits:
- `lineage.tribe`: `"Levi (priest)"` → `null`.
- `narrative_anchors.linked_stories`: `[{"story_id": "ezekiel-ezekiel-s-vision-and-commission", "title": "Ezekiel's Vision and Commission", "passage": "Ezekiel 1:1 - 3:27", "route": "#stories/ezekiel/ezekiel-s-vision-and-commission"}, {"story_id": "ezekiel-sign-acts-of-the-siege", "title": "Sign Acts of the Siege", "passage": "Ezekiel 4:1 - 5:17", "route": "#stories/ezekiel/sign-acts-of-the-siege"}, {"story_id": "ezekiel-the-glory-leaves-the-temple", "title": "The Glory Leaves the Temple", "passage": "Ezekiel 8:1 - 11:25", "route": "#stories/ezekiel/the-glory-leaves-the-temple"}, {"story_id": "ezekiel-the-death-of-ezekiel-s-wife", "title": "The Death of Ezekiel's Wife", "passage": "Ezekiel 24:15 - 24:27", "route": "#stories/ezekiel/the-death-of-ezekiel-s-wife"}, {"story_id": "ezekiel-the-valley-of-dry-bones", "title": "The Valley of Dry Bones", "passage": "Ezekiel 37:1 - 37:28", "route": "#stories/ezekiel/the-valley-of-dry-bones"}, {"story_id": "ezekiel-gog-and-the-restored-temple", "title": "Gog and the Restored Temple", "passage": "Ezekiel 38:1 - 40:4", "route": "#stories/ezekiel/gog-and-the-restored-temple"}]` → `[{"story_id": "ezekiel-ezekiel-s-vision-and-commission", "title": "Ezekiel's Vision and Commission", "passage": "Ezekiel 1:1 - 3:27", "route": "#stories/ezekiel/ezekiel-s-vision-and-commission"}, {"story_id": "ezekiel-the-glory-leaves-the-temple", "title": "The Glory Leaves the Temple", "passage": "Ezekiel 8:1 - 11:25", "route": "#stories/ezekiel/the-glory-leaves-the-temple"}, {"story_id": "ezekiel-the-death-of-ezekiel-s-wife", "title": "The Death of Ezekiel's Wife", "passage": "Ezekiel 24:15 - 24:27", "route": "#stories/ezekiel/the-death-of-ezekiel-s-wife"}, {"story_id": "ezekiel-the-valley-of-dry-bones", "title": "The Valley of Dry Bones", "passage": "Ezekiel 37:1 - 37:28", "route": "#stories/ezekiel/the-valley-of-dry-bones"}]`.

Verification: combined character schema passes; 11 verse anchors and 4 story links pass. 1 quoted spans match packaged KJV.
Identity: `ezekiel_1237` → `recY9sUcNV86uep0R`; inherited family edges disabled. Explicit family targets: `[]`.

### `hosea`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Beeri's son, whose book names four kings of Judah and Jeroboam son of Joash of Israel. Hosea describes a command to marry a sexually unfaithful woman, followed by his marriage to Gomer. The children are named Jezreel, Lo-ruhamah and Lo-ammi, with each name carrying a message to Israel. Chapter 3 tells him to love a woman involved with another man. He buys her for silver and barley and tells her to wait for him. The book links these actions to the Lord's love for Israel. Chapter 3 does not name the woman as Gomer.

Other edits:
- `narrative_anchors.linked_stories`: `[{"story_id": "hosea-hosea-s-marriage-to-gomer", "title": "Hosea's Marriage to Gomer", "passage": "Hosea 1:1 - 3:5", "route": "#stories/hosea/hosea-s-marriage-to-gomer"}]` → `[{"story_id": "hosea-hosea-s-marriage-to-gomer", "title": "Hosea's Marriage to Gomer", "passage": "Hosea 1:1 - 1:9", "route": "#stories/hosea/hosea-s-marriage-to-gomer"}]`.

Verification: combined character schema passes; 9 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `hosea_1555` → `recYvCkt5KDp2pOCz`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Gomer", "profile_id": "gomer"}]`.

### `gomer`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Diblaim's daughter, whom Hosea marries following the Lord's command in Hosea 1. She bears a son, then a daughter named Lo-ruhamah. After weaning her, she bears another son, Lo-ammi. Chapter 3 describes an unnamed woman involved with another man. Hosea buys her and tells her to remain with him. The passage does not state that she is Gomer.

Other edits:
- `narrative_anchors.linked_stories`: `[{"story_id": "hosea-hosea-s-marriage-to-gomer", "title": "Hosea's Marriage to Gomer", "passage": "Hosea 1:1 - 3:5", "route": "#stories/hosea/hosea-s-marriage-to-gomer"}]` → `[{"story_id": "hosea-hosea-s-marriage-to-gomer", "title": "Hosea's Marriage to Gomer", "passage": "Hosea 1:1 - 1:9", "route": "#stories/hosea/hosea-s-marriage-to-gomer"}]`.

Verification: combined character schema passes; 6 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `gomer_1329` → `rec9IxtCluFRXyfwn`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Hosea", "profile_id": "hosea"}]`.

### `amos`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A herdsman from Tekoa whose words concern Israel during Uzziah's and Jeroboam son of Joash's reigns. Amos 1 places them two years before an earthquake. Amaziah, Bethel's priest, reports him to the king and tells him to stop speaking there and return to Judah. In Amos 7:14–15, Amos says he was neither a prophet nor a prophet's son. He describes tending herds and gathering sycomore fruit. He says the Lord took him from his flock and sent him to Israel. This prophet is distinct from the Amos in Luke's family list.

Verification: combined character schema passes; 6 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `amos_238` → `rect0HgZKMJNmCSiU`; inherited family edges disabled. Explicit family targets: `[]`.

### `amaziah-priest-of-bethel`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Bethel's priest, distinct from the king of Judah with the same name. In Amos 7, he tells Jeroboam that Amos is plotting against him and the land cannot bear his words. He reports a prediction of Jeroboam's violent death and Israel's captivity. Calling Amos “O thou seer”, he tells him to leave for Judah and earn his living by speaking there. He orders him to stop speaking at Bethel because it is the king's chapel and court.

Verification: combined character schema passes; 4 verse anchors and 1 story links pass. 1 quoted spans match packaged KJV.
Identity: `amaziah_217` → `recqjHv9fRC7GRgBa`; inherited family edges disabled. Explicit family targets: `[]`.

### `eliphaz`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Called the Temanite, he is one of Job's three friends. They agree to visit, mourn and comfort Job, and Eliphaz speaks first. At the close, the story describes the Lord rebuking him and the other two friends for their words about God. They are told to offer bulls and rams while Job prays for them. Genesis 36 names an Eliphaz in Esau's family; Job does not identify its speaker as that man.

Verification: combined character schema passes; 5 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `eliphaz_1145` → `recE1c6dLNGYPFRiW`; inherited family edges disabled. Explicit family targets: `[]`.

### `bildad`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Called the Shuhite, he visits Job with Eliphaz and Zophar to mourn and comfort him. He speaks after Eliphaz. His arguments are his own speeches, not this profile's explanation of suffering. At the close, the story includes him in the Lord's rebuke of the three friends' words about God. He joins the others in making an offering while Job prays. The name Shuhite is retained without a further claim about his origin.

Verification: combined character schema passes; 4 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `bildad_499` → `rectCt5FFUjDdSPnY`; inherited family edges disabled. Explicit family targets: `[]`.

### `zophar`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Called the Naamathite, he agrees to visit Job with the other two friends and speaks in turn. His arguments remain his own speeches, not this profile's explanation of suffering. At the close, the story includes him in the Lord's rebuke. He joins the others in offering seven bulls and seven rams while Job prays. No further fate is supplied here.

Verification: combined character schema passes; 4 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `zophar_3105` → `reczamkTBkamDRCDW`; inherited family edges disabled. Explicit family targets: `[]`.

### `elihu`

Draft: [prophets-job-characters-records.json](../../claude-drafts/prophets-job-characters-records.json). Review: [c6-prophets-job-characters.md](c6-prophets-job-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Barachel's son, called a Buzite from Ram's family. Job 32 says he waits for the older speakers to finish. It describes his anger at Job for defending himself rather than God. He is also angry at the three friends for condemning Job without finding an answer. He speaks in chapters 32–37 and says he too is made of clay. The Lord's later rebuke does not name him. Job 2:11 describes the three friends' visit, not Elihu's journey or home.

Other edits:
- `geography.residence`: `["Came to Job in his affliction (Job 2:11)"]` → `["Not stated; he speaks to Job in Job 32:6."]`.

Verification: combined character schema passes; 5 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `elihu_1130` → `rec6l8j9BdrS5fiDM`; inherited family edges disabled. Explicit family targets: `[]`.

### `mary-mother-of-jesus`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A virgin from Nazareth, engaged to Joseph of Nazareth. Luke describes Gabriel announcing that she will bear Jesus, and her reply, “Behold the handmaid of the Lord”. She visits her relative Elisabeth and sings a prayer praising God. Luke places Jesus' birth in Bethlehem, where Mary lays him in a feeding trough. She presents him in the temple and later finds him there among the teachers. John places her at Cana's wedding and the cross, where Jesus entrusts her to the disciple he loved. Acts names her among those gathered after Jesus' ascent.

Other edits:
- `lineage.spouses`: `["Joseph"]` → `["Joseph of Nazareth"]`.

Verification: combined character schema passes; 10 verse anchors and 5 story links pass. 1 quoted spans match packaged KJV.
Identity: `mary_1938` → `recnheSkryxih4g9J`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Joseph of Nazareth", "profile_id": "joseph-husband-of-mary"}]`.

### `joseph-husband-of-mary`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A man from David's family, engaged to Mary. Matthew calls him just and says he plans a private separation after learning she is pregnant. It describes an angel telling him to marry her and name the child Jesus. Luke places him with Mary at Bethlehem for registration. Matthew describes dream warnings leading him to take the family to Egypt and later return to Nazareth. Luke includes him at the temple presentation and the Passover visit when Jesus is twelve. These accounts describe his household relationship with Jesus without establishing biological parentage. These passages do not describe his later life. The Gospels do not name him at the cross.

Other edits:
- `lineage.children`: `["Jesus"]` → `["Jesus (household relationship; no biological parentage inferred)"]`.
- `lineage.spouses`: `["Mary"]` → `["Mary, mother of Jesus"]`.

Verification: combined character schema passes; 9 verse anchors and 4 story links pass. 0 quoted spans match packaged KJV.
Identity: `joseph_1715` → `recz2xTRGz9XZD6dT`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Mary, mother of Jesus", "profile_id": "mary-mother-of-jesus"}]`.

### `elisabeth`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Zacharias's wife, whom Luke describes as righteous, childless and advanced in years. Luke calls her a daughter of Aaron, meaning a family line rather than an immediate father. After an announcement to Zacharias in the temple, she becomes pregnant and stays hidden for five months. When her relative Mary visits, Luke describes the child moving within her and Elisabeth being filled with the Holy Spirit. She blesses Mary as her Lord's mother. At her child's naming, she insists he be called John.

Verification: combined character schema passes; 7 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `elisabeth_1152` → `rec2g4pDxdGNNM4A3`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Zacharias", "profile_id": "zacharias-father-of-john"}, {"relation": "children", "label": "John the Baptist", "profile_id": "john-the-baptist"}]`.

### `zacharias-father-of-john`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A priest from Abia's service group and Elisabeth's husband. Luke describes Gabriel telling him in the temple that Elisabeth will bear a son named John. Gabriel links Zacharias's loss of speech to his unbelief. On the eighth day, Zacharias writes, “His name is John”. His speech returns when the child is named, and he praises God. His speech describes a saving power raised in David's family. This profile does not settle the identity of the Zacharias in Matthew 23:35.

Verification: combined character schema passes; 9 verse anchors and 1 story links pass. 1 quoted spans match packaged KJV.
Identity: `zacharias_2971` → `recxG5Gs5geHBVxh4`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Elisabeth", "profile_id": "elisabeth"}, {"relation": "children", "label": "John the Baptist", "profile_id": "john-the-baptist"}]`.

### `john-the-baptist`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Zacharias and Elisabeth's son. Luke places the announcement to Mary in Elisabeth's sixth month of pregnancy, without giving an exact interval between births. Matthew describes John preaching changed lives in Judaea's wilderness, wearing camel hair and eating locusts and wild honey. He baptizes people who confess their sins in the Jordan. Luke records advice to crowds, soldiers and tax collectors; Matthew describes his rebuke of Pharisees and Sadducees. He baptizes Jesus, and John records his statement that Jesus must increase while he decreases. After rebuking Herod over Herodias, he is imprisoned. He sends disciples to question Jesus before the account of his execution.

Other edits:
- `narrative_anchors.key_verses`: `["Matthew 3:1", "Matthew 3:4", "Matthew 3:13", "Matthew 11:2", "Matthew 14:3", "Matthew 14:10", "Mark 1:4", "Luke 3:12", "Luke 3:14", "John 1:29", "John 3:23", "John 3:30"]` → `["Matthew 3:1", "Matthew 3:4", "Matthew 3:13", "Matthew 11:2", "Matthew 14:3", "Matthew 14:10", "Mark 1:4", "Luke 3:12", "Luke 3:14", "John 1:29", "John 3:23", "John 3:30", "Luke 1:26", "Luke 1:36", "Matthew 3:7"]`.

Verification: combined character schema passes; 15 verse anchors and 5 story links pass. 0 quoted spans match packaged KJV.
Identity: `john_1676` → `recNRRITyGzXsl4yp`; inherited family edges disabled. Explicit family targets: `[{"relation": "parents", "label": "Zacharias", "profile_id": "zacharias-father-of-john"}, {"relation": "parents", "label": "Elisabeth", "profile_id": "elisabeth"}]`.

### `herod-the-great`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: King of Judaea when Matthew places Jesus' birth. “Great” is a conventional label, not his quoted KJV name. Visiting wise men ask about the newborn king, troubling Herod and Jerusalem. Religious leaders name Bethlehem, and he tells the visitors to report back. Matthew says their return by another road angers him. He orders the killing of children aged two and under in Bethlehem and nearby areas. After his death, Matthew describes Joseph bringing the family from Egypt. Luke places John's birth in his reign. He is distinct from Herod the tetrarch and the Herod in Acts known as Agrippa.

Verification: combined character schema passes; 9 verse anchors and 2 story links pass. 1 quoted spans match packaged KJV.
Identity: `herod_1504` → `recz5ADicu9ijfZju`; inherited family edges disabled. Explicit family targets: `[]`.

### `peter`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A fisherman from Bethsaida, Andrew's brother, called Simon and named Peter by Jesus. Luke describes him leaving his nets after an extraordinary catch. The Gospels' calling accounts are kept distinct here. Peter comes first in lists of the Twelve. Matthew describes him walking on water, sinking and declaring, “Thou art the Christ, the Son of the living God”. Jesus rebukes him for resisting the warning of his coming suffering and death. Peter sees Jesus transformed on the mountain and later promises not to deny him. After the arrest, he denies Jesus three times and weeps. John describes his tomb visit and the risen Jesus asking about his love and directing him to feed his sheep.

Verification: combined character schema passes; 12 verse anchors and 4 story links pass. 1 quoted spans match packaged KJV.
Identity: `peter_2745` → `recX9MMADoVI2CSP1`; inherited family edges disabled. Explicit family targets: `[{"relation": "siblings", "label": "Andrew", "profile_id": "andrew"}]`.

### `judas-iscariot`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: One of the Twelve, named as Jesus' betrayer. John says he keeps the money bag and steals from it. His protest at the Bethany anointing lacks concern for the poor. Matthew describes his agreement with the priests for thirty silver pieces. At supper, he is identified as the betrayer. He later leads the arresting group and identifies Jesus with a kiss. Matthew says he repents, returns the silver and hangs himself. Acts gives a different death account; this profile does not combine them. The cited verses do not establish his birthplace.

Other edits:
- `geography.origin`: `"Kerioth, as the name Iscariot is commonly read; the text does not say (John 6:71)"` → `"Birthplace not stated."`.

Verification: combined character schema passes; 11 verse anchors and 4 story links pass. 0 quoted spans match packaged KJV.
Identity: `judas_1760` → `rec95raiD3sLuptbO`; inherited family edges disabled. Explicit family targets: `[]`.

### `mary-magdalene`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A woman called Magdalene, from whom Luke says seven devils had gone. She travels with Jesus and supports him from her resources. The Gospels place her among the women at the cross and describe her seeing his burial place. She finds the tomb's stone moved at dawn. John describes her weeping there and Jesus calling her by name. John says she tells the disciples that she has seen the Lord. The Gospels do not identify her with Luke 7's unnamed woman or Mary of Bethany. Her birthplace is not stated in the cited passage.

Other edits:
- `aliases`: `["Mary of Magdala"]` → `null`.
- `geography.origin`: `"Magdala, as the name Magdalene is read (Luke 8:2)"` → `"Birthplace not stated; Luke calls her Magdalene (Luke 8:2)."`.

Verification: combined character schema passes; 11 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `mary_1943` → `recNuh2eX30cHuOgi`; inherited family edges disabled. Explicit family targets: `[]`.

### `martha-of-bethany`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Mary and Lazarus's sister from Bethany in John. Luke 10 describes a Martha welcoming Jesus and asking him to make Mary help with serving. Its village is unnamed, so the cross-account identity remains qualified here. In John, Martha meets Jesus after Lazarus dies and says, “if thou hadst been here”. She declares him the Christ and God's Son. At the tomb, she objects that the body will smell. John later describes her serving at a meal six days before Passover.

Other edits:
- `geography.residence`: `["Bethany (John 11:1; Luke 10:38)"]` → `["Bethany (John 11:1); Luke 10:38 leaves its village unnamed."]`.

Verification: combined character schema passes; 10 verse anchors and 3 story links pass. 1 quoted spans match packaged KJV.
Identity: `martha_1937` → `recPXwhg9FEPcFmK7`; inherited family edges disabled. Explicit family targets: `[{"relation": "siblings", "label": "Mary of Bethany", "profile_id": "mary-of-bethany"}, {"relation": "siblings", "label": "Lazarus", "profile_id": "lazarus-of-bethany"}]`.

### `mary-of-bethany`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Martha and Lazarus's sister from Bethany in John. Luke 10 describes a Mary hearing Jesus while Martha serves, but leaves the village unnamed. This profile keeps that cross-account identity qualified. In John, Mary remains home after Lazarus dies until she is called. She falls at Jesus' feet and says, “if thou hadst been here”. John describes Jesus weeping and raising Lazarus. Before Passover, Mary pours costly spikenard perfume on Jesus' feet and wipes them with her hair. Judas objects; Jesus links her act to his burial. Matthew and Mark leave their Bethany anointing woman unnamed. She is not identified here with Luke 7's unnamed woman.

Verification: combined character schema passes; 12 verse anchors and 3 story links pass. 1 quoted spans match packaged KJV.
Identity: `mary_1939` → `recEKfDWYNYOUAUVH`; inherited family edges disabled. Explicit family targets: `[{"relation": "siblings", "label": "Martha", "profile_id": "martha-of-bethany"}, {"relation": "siblings", "label": "Lazarus", "profile_id": "lazarus-of-bethany"}]`.

### `lazarus-of-bethany`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Martha and Mary's brother from Bethany, whom John says Jesus loves. He becomes ill and dies, spending four days in the grave before Jesus arrives. John describes Jesus thanking the Father and calling, “Lazarus, come forth”. Lazarus emerges in burial cloths, and Jesus tells others to free him. Many believe because of this account's event. Before Passover, Lazarus eats with Jesus, and the chief priests plan to kill him too. This Lazarus is distinct from the character in Luke 16's story.

Verification: combined character schema passes; 10 verse anchors and 2 story links pass. 1 quoted spans match packaged KJV.
Identity: `lazarus_1812` → `recy6ANqZT7KobHD2`; inherited family edges disabled. Explicit family targets: `[{"relation": "siblings", "label": "Martha", "profile_id": "martha-of-bethany"}, {"relation": "siblings", "label": "Mary of Bethany", "profile_id": "mary-of-bethany"}]`.

### `nicodemus`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A Pharisee, a member of a Jewish religious group, and a leader who visits Jesus at night in John. He says Jesus' miracles show God is with him. Jesus speaks of being born again through water and the Spirit: a new birth Nicodemus struggles to understand. The dialogue turns to the raised serpent and God's love in John 3:16. In John 7, Nicodemus asks whether the law judges someone before hearing him. After the crucifixion, he brings about a hundred pounds of myrrh and aloes, substances used in preparing a body. He helps Joseph of Arimathaea bury Jesus.

Verification: combined character schema passes; 10 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `nicodemus_2204` → `recqejs2MEv6iwkuw`; inherited family edges disabled. Explicit family targets: `[]`.

### `pontius-pilate`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: The Roman governor of Judaea before whom Jesus appears after his arrest. The Gospels record him asking, “Art thou the King of the Jews?” and declaring no fault. Luke describes him sending Jesus to Herod. The accounts also describe the offer involving Barabbas; Matthew adds his wife's warning and his hand washing. He has Jesus whipped and hands him over for crucifixion. John gives the cross inscription as “Jesus Of Nazareth The King Of The Jews”. He grants Joseph of Arimathaea the body. Matthew describes a guard at the tomb. Luke 13:1 mentions Galileans whose blood Pilate mixed with their sacrifices.

Other edits:
- `narrative_anchors.linked_stories`: `[{"story_id": "matthew-trial-crucifixion-and-burial", "title": "Trial, Crucifixion and Burial", "passage": "Matthew 26:57 - 27:66", "route": "#stories/matthew/trial-crucifixion-and-burial"}, {"story_id": "mark-trial-crucifixion-and-burial", "title": "Trial, Crucifixion and Burial", "passage": "Mark 14:53 - 15:47", "route": "#stories/mark/trial-crucifixion-and-burial"}, {"story_id": "john-arrest-trial-and-crucifixion", "title": "Arrest, Trial and Crucifixion", "passage": "John 18:1 - 19:42", "route": "#stories/john/arrest-trial-and-crucifixion"}]` → `[{"story_id": "matthew-trial-crucifixion-and-burial", "title": "Trial, Crucifixion and Burial", "passage": "Matthew 26:57 - 27:66", "route": "#stories/matthew/trial-crucifixion-and-burial"}, {"story_id": "mark-trial-crucifixion-and-burial-in-mark", "title": "Trial, Crucifixion and Burial in Mark", "passage": "Mark 14:53 - 15:47", "route": "#stories/mark/trial-crucifixion-and-burial-in-mark"}, {"story_id": "john-arrest-trial-and-crucifixion", "title": "Arrest, Trial and Crucifixion", "passage": "John 18:1 - 19:42", "route": "#stories/john/arrest-trial-and-crucifixion"}]`.

Verification: combined character schema passes; 12 verse anchors and 3 story links pass. 2 quoted spans match packaged KJV.
Identity: `pilate_2365` → `reczuS92gSUORr83E`; inherited family edges disabled. Explicit family targets: `[]`.

Source correction: Packaged John 19:19 has Jesus Of Nazareth The King Of The Jews, not the uppercase wording requested by the review.

### `caiaphas`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: The high priest in the year of Jesus' death. After Lazarus is raised, John records him saying it is better for one man to die for the people. John interprets those words through Caiaphas's role as high priest. Matthew describes leaders plotting Jesus' arrest in his palace. After Jesus is brought there, Caiaphas tears his clothes at Jesus' reply. John calls Annas his father-in-law. Luke names Annas and Caiaphas together as high priests. Acts includes Caiaphas among the rulers questioning Peter and John.

Other edits:
- `aliases`: `["Joseph Caiaphas"]` → `null`.

Verification: combined character schema passes; 10 verse anchors and 4 story links pass. 0 quoted spans match packaged KJV.
Identity: `caiaphas_532` → `rechjMXjFfG41iAfc`; inherited family edges disabled. Explicit family targets: `[]`.

### `zacchaeus`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A wealthy chief tax collector in Jericho. Luke says he is short and climbs a sycomore tree to see Jesus. Jesus calls him by name and says he must stay at his house. The crowd objects that Jesus is visiting a sinner. Zacchaeus says he gives half his goods to the poor and repays any false charges fourfold. Luke records Jesus saying salvation has come to the house. Jesus describes his mission as seeking and saving the lost.

Verification: combined character schema passes; 9 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `zacchaeus_2961` → `recmzOmqOEixMQS2w`; inherited family edges disabled. Explicit family targets: `[]`.

### `thomas`

Draft: [gospels-characters-records.json](../../claude-drafts/gospels-characters-records.json). Review: [c7-gospels-characters.md](c7-gospels-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: One of the Twelve, called Didymus, meaning twin. In John, he urges the others to go with Jesus after Lazarus dies: “Let us also go, that we may die with him”. At supper, he asks about the way; Jesus replies, “I am the way, the truth, and the life”. He misses Jesus' first appearance to the gathered disciples after the resurrection. He says he will not believe without seeing the nail marks and touching Jesus' side. John describes another appearance eight days later, when Thomas answers, “My Lord and my God”. He is later present at the sea of Tiberias and named in the upper-room gathering.

Other edits:
- `narrative_anchors.linked_stories`: `[{"story_id": "john-the-raising-of-lazarus", "title": "The Raising of Lazarus", "passage": "John 11:1 - 11:57", "route": "#stories/john/the-raising-of-lazarus"}, {"story_id": "john-the-last-supper-discourse", "title": "The Last Supper Discourse", "passage": "John 13:1 - 17:26", "route": "#stories/john/the-last-supper-discourse"}, {"story_id": "john-the-resurrection-appearances", "title": "The Resurrection Appearances", "passage": "John 20:1 - 20:31", "route": "#stories/john/the-resurrection-appearances"}, {"story_id": "john-breakfast-by-the-sea-of-tiberias", "title": "Breakfast by the Sea of Tiberias", "passage": "John 21:1 - 21:25", "route": "#stories/john/breakfast-by-the-sea-of-tiberias"}]` → `[{"story_id": "john-the-raising-of-lazarus", "title": "The Raising of Lazarus", "passage": "John 11:1 - 11:57", "route": "#stories/john/the-raising-of-lazarus"}, {"story_id": "john-the-resurrection-appearances", "title": "The Resurrection Appearances", "passage": "John 20:1 - 20:31", "route": "#stories/john/the-resurrection-appearances"}, {"story_id": "john-breakfast-by-the-sea-of-tiberias", "title": "Breakfast by the Sea of Tiberias", "passage": "John 21:1 - 21:25", "route": "#stories/john/breakfast-by-the-sea-of-tiberias"}]`.

Verification: combined character schema passes; 10 verse anchors and 3 story links pass. 3 quoted spans match packaged KJV.
Identity: `thomas_2851` → `reckJ4vuXzqDbTrMP`; inherited family edges disabled. Explicit family targets: `[]`.

### `stephen`

Draft: [acts-characters-records.json](../../claude-drafts/acts-characters-records.json). Review: [c8-acts-characters.md](c8-acts-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: One of seven chosen in Acts to help distribute food to widows among Greek-speaking disciples. The language description does not assign a modern nationality. Acts describes him as full of faith, the Holy Spirit and power, and doing wonders. Men from several synagogues dispute with him and accuse him of speaking against the temple and law. His defence retells Israel's history and accuses his hearers of resisting the Holy Spirit. Acts describes him seeing Jesus at God's right hand. He is stoned outside the city while praying, “Lord Jesus, receive my spirit”, and asking forgiveness for his attackers. Saul approves his death.

Verification: combined character schema passes; 8 verse anchors and 1 story links pass. 1 quoted spans match packaged KJV.
Identity: `stephen_2802` → `recUipM9EEsnFSZI0`; inherited family edges disabled. Explicit family targets: `[]`.

### `barnabas`

Draft: [acts-characters-records.json](../../claude-drafts/acts-characters-records.json). Review: [c8-acts-characters.md](c8-acts-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Joses, a Levite from Cyprus, whom the apostles call Barnabas. Acts 4:36 explains the name as “The son of consolation”, or encouragement. He sells land and gives the money to the apostles. He introduces Saul to the apostles and supports his account of preaching in Damascus. Sent to Antioch, he welcomes what Acts calls God's grace. Acts praises his character, faith and fullness of the Holy Spirit. He brings Saul from Tarsus, and Antioch's church sends them on a journey. Later, he wants John Mark to join them. A sharp dispute with Paul separates them; Barnabas sails to Cyprus with Mark.

Verification: combined character schema passes; 8 verse anchors and 4 story links pass. 1 quoted spans match packaged KJV.
Identity: `barnabas_1722` → `recUA9Fc2yoNk8c5d`; inherited family edges disabled. Explicit family targets: `[]`.

### `philip-the-evangelist`

Draft: [acts-characters-records.json](../../claude-drafts/acts-characters-records.json). Review: [c8-acts-characters.md](c8-acts-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: One of the seven chosen with Stephen at Jerusalem. After the persecution following Stephen's death, Acts describes Philip preaching Christ in Samaria, where men and women are baptized. An angel directs him toward Gaza. He meets an Ethiopian officer reading Isaiah, explains the passage and baptizes him. Acts then describes Philip being carried away and found at Azotus. He preaches along the coast to Caesarea. Years later, Paul's group stays at his home there, where he has four unmarried daughters who prophesy. This profile is separate from Philip the apostle.

Verification: combined character schema passes; 7 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `philip_2347` → `recNsU6uPfTysNEKM`; inherited family edges disabled. Explicit family targets: `[]`.

### `cornelius`

Draft: [acts-characters-records.json](../../claude-drafts/acts-characters-records.json). Review: [c8-acts-characters.md](c8-acts-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A Roman officer in the Italian unit at Caesarea. Acts describes him and his household as devoted to God, with Cornelius giving to the poor and praying often. It describes an angel telling him to send for Peter at Joppa while Peter has a vision. Cornelius gathers relatives and close friends. Acts says the Holy Spirit comes upon those listening to Peter. Peter directs their baptism and stays at their request. Later, Peter explains the visit in Jerusalem. In Acts 11:18, his listeners conclude that God has granted life-giving repentance to non-Jews.

Other edits:
- `narrative_anchors.key_verses`: `["Acts 10:1", "Acts 10:2", "Acts 10:22", "Acts 10:44", "Acts 10:48"]` → `["Acts 10:1", "Acts 10:2", "Acts 10:22", "Acts 10:44", "Acts 10:48", "Acts 11:18"]`.

Verification: combined character schema passes; 6 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `cornelius_956` → `recq0lOFoVY6zUYkV`; inherited family edges disabled. Explicit family targets: `[]`.

### `silas`

Draft: [acts-characters-records.json](../../claude-drafts/acts-characters-records.json). Review: [c8-acts-characters.md](c8-acts-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A leader in Jerusalem's church, sent with Judas Barsabas to bring its council's letter to Antioch. Acts describes him as a prophet who encourages the believers. After Paul's dispute with Barnabas, Paul chooses Silas as a companion. At Philippi, they are beaten and jailed. Acts describes them praying and singing at midnight before an earthquake. Silas stays with Timothy at Berea and later rejoins Paul at Corinth. Letters name Silvanus with Paul and Timothy and mention his preaching among the Corinthians. The proposed Silas/Silvanus link remains qualified; the name forms alone do not prove it.

Other edits:
- `aliases`: `["Silvanus"]` → `null`.

Verification: combined character schema passes; 7 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `silas_2740` → `recSo7V3yW4zpZBLM`; inherited family edges disabled. Explicit family targets: `[]`.

### `timothy`

Draft: [acts-characters-records.json](../../claude-drafts/acts-characters-records.json). Review: [c8-acts-characters.md](c8-acts-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A disciple whom Acts introduces at Lystra, without stating his birthplace. His mother is a Jewish believer and his father is Greek. Local believers speak well of him. Paul takes him along and circumcises him because of the Jews in that region. He stays with Silas at Berea, rejoins Paul at Corinth and travels into Asia. Paul's letters call him his son in faith and recall the faith of Lois, his grandmother, and Eunice, his mother. First Timothy 1:3 places him at Ephesus. His father's name is not supplied here.

Other edits:
- `geography.origin`: `"Lystra (Acts 16:1)"` → `"Birthplace not stated; Acts 16:1 introduces him at Lystra."`.
- `narrative_anchors.key_verses`: `["Acts 16:1", "Acts 16:3", "Acts 17:14", "Acts 18:5", "Acts 20:4", "1 Timothy 1:2", "2 Timothy 1:5"]` → `["Acts 16:1", "Acts 16:3", "Acts 17:14", "Acts 18:5", "Acts 20:4", "1 Timothy 1:2", "2 Timothy 1:5", "1 Timothy 1:3"]`.

Verification: combined character schema passes; 8 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `timotheus_2863` → `recIRlDcRDv2MBfxW`; inherited family edges disabled. Explicit family targets: `[]`.

### `apollos`

Draft: [acts-characters-records.json](../../claude-drafts/acts-characters-records.json). Review: [c8-acts-characters.md](c8-acts-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A Jew born in Alexandria, described in Acts as a skilled speaker with strong knowledge of scripture. He teaches in Ephesus while knowing only John's baptism. Aquila and Priscilla explain God's way to him more fully. With letters from the believers, he goes to Achaia and helps those who believe. In First Corinthians, Paul writes, “I have planted, Apollos watered; but God gave the increase”. A later letter asks that Apollos and Zenas receive help for their journey. No claim about authorship of Hebrews is made here.

Verification: combined character schema passes; 6 verse anchors and 2 story links pass. 1 quoted spans match packaged KJV.
Identity: `apollos_276` → `recoxUPwUPGU1IP9X`; inherited family edges disabled. Explicit family targets: `[]`.

### `priscilla`

Draft: [acts-characters-records.json](../../claude-drafts/acts-characters-records.json). Review: [c8-acts-characters.md](c8-acts-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Aquila's wife, who leaves Italy with him after Claudius orders Jews to leave Rome. Acts 18:2 names Aquila as Jewish without expressly saying this about Priscilla. At Corinth, they welcome Paul and work with him making tents. They travel with Paul to Ephesus, where they explain God's way more fully to Apollos. Paul calls them his helpers, and a church meets in their house. Her name appears before or after Aquila's in different passages. Second Timothy 4:19 uses Prisca.

Other edits:
- `narrative_anchors.books`: `["Acts", "Romans", "1 Corinthians"]` → `["Acts", "Romans", "1 Corinthians", "2 Timothy"]`.
- `narrative_anchors.key_verses`: `["Acts 18:2", "Acts 18:3", "Acts 18:18", "Acts 18:26", "Romans 16:3", "1 Corinthians 16:19"]` → `["Acts 18:2", "Acts 18:3", "Acts 18:18", "Acts 18:26", "Romans 16:3", "1 Corinthians 16:19", "2 Timothy 4:19"]`.

Verification: combined character schema passes; 7 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `priscilla_2370` → `recOpU2GjcCC2kTg9`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Aquila", "profile_id": "aquila"}]`.

### `aquila`

Draft: [acts-characters-records.json](../../claude-drafts/acts-characters-records.json). Review: [c8-acts-characters.md](c8-acts-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A Jew born in Pontus, who arrives from Italy with Priscilla after Claudius's decree. Acts says he shares Paul's trade, and they make tents together at Corinth. He travels with Paul to Ephesus and joins Priscilla in teaching Apollos. Paul calls the pair his helpers and sends greetings “with the church that is in their house”. These passages do not give the date or circumstances of their conversion.

Verification: combined character schema passes; 6 verse anchors and 2 story links pass. 1 quoted spans match packaged KJV.
Identity: `aquila_279` → `rec5L6bAZR3j8fYAE`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Priscilla", "profile_id": "priscilla"}]`.

### `gamaliel`

Draft: [acts-characters-records.json](../../claude-drafts/acts-characters-records.json). Review: [c8-acts-characters.md](c8-acts-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A Pharisee and law teacher whom Acts describes as widely respected. During the apostles' trial, he asks that they leave briefly and warns the council to act carefully. He argues that a human movement will fail, while a movement from God cannot be overthrown. Opposing it could mean fighting God. The council agrees, but has the apostles beaten and forbids speaking in Jesus' name. Paul later says Gamaliel taught him. Acts does not say this advice means Gamaliel joined the movement. He is distinct from the Gamaliel in Numbers.

Verification: combined character schema passes; 4 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `gamaliel_1277` → `reciIAjF1PRn4qPbM`; inherited family edges disabled. Explicit family targets: `[]`.

### `lydia`

Draft: [acts-characters-records.json](../../claude-drafts/acts-characters-records.json). Review: [c8-acts-characters.md](c8-acts-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A seller of purple goods from Thyatira who worships God. She hears Paul at a riverside prayer gathering outside Philippi. Acts says the Lord opens her heart to his words. She and her household are baptized, and she urges Paul's group to stay at her house. After prison, Paul and Silas return there to meet and comfort the believers. The account does not state her marital status, wealth or household members' ages.

Verification: combined character schema passes; 3 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `lydia_1837` → `recL7FKDcTneTvG5r`; inherited family edges disabled. Explicit family targets: `[]`.

### `felix`

Draft: [acts-characters-records.json](../../claude-drafts/acts-characters-records.json). Review: [c8-acts-characters.md](c8-acts-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: The Roman governor to whom Paul is sent under guard from Jerusalem to Caesarea. He hears the high priest's accusation and Paul's reply. Acts describes his knowledge of the movement and his delay until Lysias can come. He and his Jewish wife Drusilla hear Paul discuss faith in Christ. Paul speaks about right conduct, self-control and coming judgment. Felix becomes afraid and sends him away. Acts 24:26 also says he hopes Paul will offer money. Two years later, Festus replaces him. Acts says Felix leaves Paul imprisoned to please the Jewish leaders.

Other edits:
- `aliases`: `["Antonius Felix"]` → `null`.

Verification: combined character schema passes; 6 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `felix_1257` → `recSRPfTSaf7TsRiN`; inherited family edges disabled. Explicit family targets: `[]`.

### `festus`

Draft: [acts-characters-records.json](../../claude-drafts/acts-characters-records.json). Review: [c8-acts-characters.md](c8-acts-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Porcius Festus, named in Acts 24:27 as Felix's successor. Three days after arriving, he visits Jerusalem. Leaders ask him to bring Paul there, while planning an ambush. Festus holds the hearing at Caesarea. Acts says he wishes to please the leaders when he asks Paul about a Jerusalem trial. Paul appeals to Caesar. After consulting his council, Festus grants the appeal. He later presents the case to visiting King Agrippa so he can decide what to write.

Verification: combined character schema passes; 5 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `portius_2367` → `reckKYeZ5P0KFuSkB`; inherited family edges disabled. Explicit family targets: `[]`.

### `agrippa-ii`

Draft: [acts-characters-records.json](../../claude-drafts/acts-characters-records.json). Review: [c8-acts-characters.md](c8-acts-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A king whom Acts calls Agrippa, visiting Caesarea with Bernice to greet Festus. He allows Paul to speak. Paul describes his earlier life as a Pharisee, persecution of the church and vision near Damascus. Paul asks, “King Agrippa, believest thou the prophets? I know that thou believest”. Agrippa replies, “Almost thou persuadest me to be a Christian”. He and Festus agree that Paul has done nothing deserving death or imprisonment. Agrippa says Paul could have been freed without his appeal to Caesar. Acts does not give the fuller historical name Herod Agrippa II in this account.

Other edits:
- `aliases`: `["King Agrippa", "Herod Agrippa II"]` → `["King Agrippa"]`.

Verification: combined character schema passes; 4 verse anchors and 1 story links pass. 2 quoted spans match packaged KJV.
Identity: `agrippa_111` → `recMxoVUt13ExT48g`; inherited family edges disabled. Explicit family targets: `[]`.

### `andrew`

Draft: [gospel-remainder-characters-records.json](../../claude-drafts/gospel-remainder-characters-records.json). Review: [c9-gospel-remainder-characters.md](c9-gospel-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A fisherman from Bethsaida and Peter's brother. John first presents him as a follower of John the Baptist who brings Peter to Jesus. Matthew and Mark describe Jesus calling the brothers from their fishing nets. These scenes are not combined into one sequence here. Andrew points out the boy with five barley loaves before the feeding of the crowd. With Philip, he brings Greek visitors' request to Jesus. He is one of four who ask Jesus privately about the temple's future on the Mount of Olives.

Other edits:
- `lineage.siblings`: `["Simon Peter"]` → `["Peter"]`.

Verification: combined character schema passes; 10 verse anchors and 2 story links pass. 0 quoted spans match packaged KJV.
Identity: `andrew_264` → `recpvMKljbEMuiK9e`; inherited family edges disabled. Explicit family targets: `[{"relation": "siblings", "label": "Peter", "profile_id": "peter"}]`.

### `james-son-of-zebedee`

Draft: [gospel-remainder-characters-records.json](../../claude-drafts/gospel-remainder-characters-records.json). Review: [c9-gospel-remainder-characters.md](c9-gospel-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Zebedee's son, called with his brother John while they mend nets in their father's boat. They leave the boat and father to follow Jesus. Mark says Jesus names them Boanerges, sons of thunder. With Peter and John, James enters Jairus's house and sees Jesus transformed on the mountain. He and John ask for seats beside Jesus in glory, upsetting the other ten. Jesus says they will drink his cup. Luke describes them asking to call down fire after a Samaritan village refuses Jesus. Acts says King Herod kills James, John's brother, with a sword.

Other edits:
- `lineage.siblings`: `["John"]` → `["John son of Zebedee"]`.
- `narrative_anchors.linked_stories`: `[{"story_id": "matthew-peter-s-confession-and-the-transfiguration", "title": "Peter's Confession and the Transfiguration", "passage": "Matthew 16:13 - 17:27", "route": "#stories/matthew/peter-s-confession-and-the-transfiguration"}, {"story_id": "matthew-calling-the-first-disciples", "title": "Calling the First Disciples", "passage": "Matthew 4:12 - 4:25", "route": "#stories/matthew/calling-the-first-disciples"}, {"story_id": "luke-the-miraculous-catch", "title": "The Miraculous Catch", "passage": "Luke 5:1 - 5:11", "route": "#stories/luke/the-miraculous-catch"}, {"story_id": "mark-peter-s-confession-and-the-transfiguration", "title": "Peter's Confession and the Transfiguration", "passage": "Mark 8:27 - 9:29", "route": "#stories/mark/peter-s-confession-and-the-transfiguration"}, {"story_id": "matthew-the-rich-young-man", "title": "The Rich Young Man", "passage": "Matthew 19:1 - 20:34", "route": "#stories/matthew/the-rich-young-man"}, {"story_id": "acts-peter-s-escape-and-herod-s-death", "title": "Peter's Escape and Herod's Death", "passage": "Acts 12:1 - 12:25", "route": "#stories/acts/peter-s-escape-and-herod-s-death"}]` → `[{"story_id": "matthew-peter-s-confession-and-the-transfiguration", "title": "Peter's Confession and the Transfiguration", "passage": "Matthew 16:13 - 17:27", "route": "#stories/matthew/peter-s-confession-and-the-transfiguration"}, {"story_id": "matthew-calling-the-first-disciples", "title": "Calling the First Disciples", "passage": "Matthew 4:12 - 4:25", "route": "#stories/matthew/calling-the-first-disciples"}, {"story_id": "luke-the-miraculous-catch", "title": "The Miraculous Catch", "passage": "Luke 5:1 - 5:11", "route": "#stories/luke/the-miraculous-catch"}, {"story_id": "mark-peter-s-confession-and-the-transfiguration-in-mark", "title": "Peter's Confession and the Transfiguration in Mark", "passage": "Mark 8:27 - 9:29", "route": "#stories/mark/peter-s-confession-and-the-transfiguration-in-mark"}, {"story_id": "matthew-the-rich-young-man", "title": "The Rich Young Man", "passage": "Matthew 19:1 - 20:34", "route": "#stories/matthew/the-rich-young-man"}, {"story_id": "acts-peter-s-escape-and-herod-s-death", "title": "Peter's Escape and Herod's Death", "passage": "Acts 12:1 - 12:25", "route": "#stories/acts/peter-s-escape-and-herod-s-death"}]`.

Verification: combined character schema passes; 10 verse anchors and 6 story links pass. 0 quoted spans match packaged KJV.
Identity: `james_717` → `rechkAyIwugqcLaaY`; inherited family edges disabled. Explicit family targets: `[{"relation": "siblings", "label": "John son of Zebedee", "profile_id": "john-son-of-zebedee"}]`.

### `john-son-of-zebedee`

Draft: [gospel-remainder-characters-records.json](../../claude-drafts/gospel-remainder-characters-records.json). Review: [c9-gospel-remainder-characters.md](c9-gospel-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Zebedee's son and James's brother, called with James from their fishing boat. He joins Peter and James at Jairus's house and when Jesus is transformed on the mountain. He reports stopping a man who casts out devils in Jesus' name. With James, he requests seats beside Jesus and proposes fire against a Samaritan village. Acts places him with Peter at the temple, before the council and in Samaria. The council calls them “unlearned and ignorant men”. John's Gospel leaves the beloved disciple unnamed while saying that disciple testified and wrote these things. This profile does not identify that disciple as John or settle authorship.

Other edits:
- `lineage.siblings`: `["James"]` → `["James son of Zebedee"]`.
- `narrative_anchors.linked_stories`: `[{"story_id": "matthew-peter-s-confession-and-the-transfiguration", "title": "Peter's Confession and the Transfiguration", "passage": "Matthew 16:13 - 17:27", "route": "#stories/matthew/peter-s-confession-and-the-transfiguration"}, {"story_id": "matthew-calling-the-first-disciples", "title": "Calling the First Disciples", "passage": "Matthew 4:12 - 4:25", "route": "#stories/matthew/calling-the-first-disciples"}, {"story_id": "luke-the-miraculous-catch", "title": "The Miraculous Catch", "passage": "Luke 5:1 - 5:11", "route": "#stories/luke/the-miraculous-catch"}, {"story_id": "mark-peter-s-confession-and-the-transfiguration", "title": "Peter's Confession and the Transfiguration", "passage": "Mark 8:27 - 9:29", "route": "#stories/mark/peter-s-confession-and-the-transfiguration"}, {"story_id": "acts-the-lame-man-healed-and-arrest-of-peter-and-john", "title": "The Lame Man Healed and Arrest of Peter and John", "passage": "Acts 3:1 - 4:31", "route": "#stories/acts/the-lame-man-healed-and-arrest-of-peter-and-john"}]` → `[{"story_id": "matthew-peter-s-confession-and-the-transfiguration", "title": "Peter's Confession and the Transfiguration", "passage": "Matthew 16:13 - 17:27", "route": "#stories/matthew/peter-s-confession-and-the-transfiguration"}, {"story_id": "matthew-calling-the-first-disciples", "title": "Calling the First Disciples", "passage": "Matthew 4:12 - 4:25", "route": "#stories/matthew/calling-the-first-disciples"}, {"story_id": "luke-the-miraculous-catch", "title": "The Miraculous Catch", "passage": "Luke 5:1 - 5:11", "route": "#stories/luke/the-miraculous-catch"}, {"story_id": "mark-peter-s-confession-and-the-transfiguration-in-mark", "title": "Peter's Confession and the Transfiguration in Mark", "passage": "Mark 8:27 - 9:29", "route": "#stories/mark/peter-s-confession-and-the-transfiguration-in-mark"}, {"story_id": "acts-the-lame-man-healed-and-arrest-of-peter-and-john", "title": "The Lame Man Healed and Arrest of Peter and John", "passage": "Acts 3:1 - 4:31", "route": "#stories/acts/the-lame-man-healed-and-arrest-of-peter-and-john"}]`.

Verification: combined character schema passes; 10 verse anchors and 5 story links pass. 1 quoted spans match packaged KJV.
Identity: `john_1677` → `recvAB7vkczUEFH8Z`; inherited family edges disabled. Explicit family targets: `[{"relation": "siblings", "label": "James son of Zebedee", "profile_id": "james-son-of-zebedee"}]`.

### `matthew-levi`

Draft: [gospel-remainder-characters-records.json](../../claude-drafts/gospel-remainder-characters-records.json). Review: [c9-gospel-remainder-characters.md](c9-gospel-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Matthew describes Jesus calling a tax collector named Matthew with “Follow me”, after which he follows. Mark describes a similar call to Levi, Alphaeus's son, while Luke names Levi. Luke says Levi leaves everything and holds a feast with tax collectors and others. Mark also places the meal at Levi's house. Matthew 10:3 names “Matthew the publican” among the Twelve; Acts includes Matthew in the upper room. The Matthew/Levi association is kept qualified here because no cited verse directly states it. Alphaeus is therefore not entered as Matthew's unqualified parent.

Other edits:
- `aliases`: `["Levi", "Levi the son of Alphaeus"]` → `null`.
- `lineage.parents`: `["Alphaeus"]` → `null`.
- `name`: `"Matthew (Levi)"` → `"Matthew"`.

Verification: combined character schema passes; 8 verse anchors and 2 story links pass. 2 quoted spans match packaged KJV.
Identity: `matthew_1971` → `recVRtBEdN8mgLhHN`; inherited family edges disabled. Explicit family targets: `[]`.

### `philip-the-apostle`

Draft: [gospel-remainder-characters-records.json](../../claude-drafts/gospel-remainder-characters-records.json). Review: [c9-gospel-remainder-characters.md](c9-gospel-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A man from Bethsaida, also home to Andrew and Peter. John describes Jesus finding him in Galilee and saying, “Follow me”. He tells Nathanael they have found the figure Moses and the prophets wrote about. When Nathanael questions Nazareth, Philip replies, “Come and see”. Before the crowd is fed, he says two hundred pennyworth of bread would not be enough. Greek visitors approach him; he and Andrew bring their request to Jesus. At supper, he asks to see the Father. Jesus replies that seeing him means seeing the Father. Acts names him in the upper room. He is distinct from Philip the evangelist.

Other edits:
- `narrative_anchors.linked_stories`: `[{"story_id": "john-the-first-disciples-and-the-wedding-at-cana", "title": "The First Disciples and the Wedding at Cana", "passage": "John 1:35 - 2:12", "route": "#stories/john/the-first-disciples-and-the-wedding-at-cana"}, {"story_id": "john-bread-of-life", "title": "Bread of Life", "passage": "John 6:1 - 6:71", "route": "#stories/john/bread-of-life"}, {"story_id": "john-the-last-supper-discourse", "title": "The Last Supper Discourse", "passage": "John 13:1 - 17:26", "route": "#stories/john/the-last-supper-discourse"}]` → `[{"story_id": "john-the-first-disciples-and-the-wedding-at-cana", "title": "The First Disciples and the Wedding at Cana", "passage": "John 1:35 - 2:12", "route": "#stories/john/the-first-disciples-and-the-wedding-at-cana"}, {"story_id": "john-bread-of-life", "title": "Bread of Life", "passage": "John 6:1 - 6:71", "route": "#stories/john/bread-of-life"}]`.

Verification: combined character schema passes; 11 verse anchors and 2 story links pass. 2 quoted spans match packaged KJV.
Identity: `philip_2344` → `recg3914bVvyjBOfN`; inherited family edges disabled. Explicit family targets: `[]`.

### `nathanael`

Draft: [gospel-remainder-characters-records.json](../../claude-drafts/gospel-remainder-characters-records.json). Review: [c9-gospel-remainder-characters.md](c9-gospel-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Philip brings him to Jesus after saying they have found the figure described in the law and prophets. Nathanael questions whether good can come from Nazareth. John describes Jesus greeting him as an Israelite without deceit and saying he saw him under the fig tree. Nathanael replies, “Rabbi, thou art the Son of God; thou art the King of Israel.” John 21:2 calls him “of Cana in Galilee” among the disciples at the sea of Tiberias. The cited passages do not call him an apostle or identify him with Bartholomew.

Verification: combined character schema passes; 6 verse anchors and 2 story links pass. 2 quoted spans match packaged KJV.
Identity: `nathanael_2158` → `recd33WGbx9DkJuTk`; inherited family edges disabled. Explicit family targets: `[]`.

### `herod-antipas`

Draft: [gospel-remainder-characters-records.json](../../claude-drafts/gospel-remainder-characters-records.json). Review: [c9-gospel-remainder-characters.md](c9-gospel-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Called Herod the tetrarch, ruling Galilee in Tiberius's fifteenth year. Antipas is a conventional historical label, not the KJV name. John rebukes his marriage to Herodias, his brother Philip's wife, and Herod imprisons him. Mark says Herod fears John and listens gladly. At a birthday feast, he promises Herodias's daughter whatever she asks. Though sorry, he orders John's execution to keep his oath. Hearing about Jesus, he says John has risen. Luke records a warning that Herod seeks Jesus' death and Jesus calling him a fox. At trial, Herod questions and mocks Jesus, then returns him to Pilate. Luke says the two rulers become friends that day.

Other edits:
- `name`: `"Herod Antipas"` → `"Herod the tetrarch"`.

Verification: combined character schema passes; 13 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `herod_1505` → `recV4ujd4P2vfpd2D`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Herodias", "profile_id": "herodias"}]`.

### `herodias`

Draft: [gospel-remainder-characters-records.json](../../claude-drafts/gospel-remainder-characters-records.json). Review: [c9-gospel-remainder-characters.md](c9-gospel-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Herod the tetrarch's wife, described in the Gospels as previously married to his brother Philip. John tells Herod that this marriage is unlawful. Mark says Herodias wants John killed but cannot while Herod protects him. At Herod's birthday feast, her daughter dances and receives a promise of whatever she requests. Herodias tells her to ask for John's head. The daughter brings it to her mother on a platter. The Gospels leave the daughter unnamed; no fuller family tree is added here.

Other edits:
- `lineage.spouses`: `["Philip (Herod's brother)", "Herod Antipas"]` → `["Philip (Herod's brother)", "Herod the tetrarch"]`.

Verification: combined character schema passes; 8 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `herodias_1507` → `recP9mHoD9qFMGnMt`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Herod the tetrarch", "profile_id": "herod-antipas"}]`.

### `joseph-of-arimathaea`

Draft: [gospel-remainder-characters-records.json](../../claude-drafts/gospel-remainder-characters-records.json). Review: [c9-gospel-remainder-characters.md](c9-gospel-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A man from Arimathaea, distinct from Mary's husband and the patriarch Joseph. Matthew calls him rich; John describes him as a secret disciple who fears the Jewish leaders. Mark calls him a respected council member awaiting God's kingdom. Luke says he did not agree with the council's actions. Mark describes him boldly asking Pilate for Jesus' body, which Pilate grants after checking that Jesus is dead. Matthew says he wraps it in clean linen and places it in his own new rock-cut tomb. John describes Nicodemus bringing myrrh and aloes and both men wrapping the body with these substances.

Other edits:
- `narrative_anchors.linked_stories`: `[{"story_id": "matthew-trial-crucifixion-and-burial", "title": "Trial, Crucifixion and Burial", "passage": "Matthew 26:57 - 27:66", "route": "#stories/matthew/trial-crucifixion-and-burial"}, {"story_id": "mark-trial-crucifixion-and-burial", "title": "Trial, Crucifixion and Burial", "passage": "Mark 14:53 - 15:47", "route": "#stories/mark/trial-crucifixion-and-burial"}, {"story_id": "john-arrest-trial-and-crucifixion", "title": "Arrest, Trial and Crucifixion", "passage": "John 18:1 - 19:42", "route": "#stories/john/arrest-trial-and-crucifixion"}]` → `[{"story_id": "matthew-trial-crucifixion-and-burial", "title": "Trial, Crucifixion and Burial", "passage": "Matthew 26:57 - 27:66", "route": "#stories/matthew/trial-crucifixion-and-burial"}, {"story_id": "mark-trial-crucifixion-and-burial-in-mark", "title": "Trial, Crucifixion and Burial in Mark", "passage": "Mark 14:53 - 15:47", "route": "#stories/mark/trial-crucifixion-and-burial-in-mark"}, {"story_id": "john-arrest-trial-and-crucifixion", "title": "Arrest, Trial and Crucifixion", "passage": "John 18:1 - 19:42", "route": "#stories/john/arrest-trial-and-crucifixion"}]`.

Verification: combined character schema passes; 10 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `joseph_1716` → `recSPfp8wBRE8aSY9`; inherited family edges disabled. Explicit family targets: `[]`.

### `barabbas`

Draft: [gospel-remainder-characters-records.json](../../claude-drafts/gospel-remainder-characters-records.json). Review: [c9-gospel-remainder-characters.md](c9-gospel-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A prisoner offered for release during the feast. Matthew calls him notable. Mark links him with rebels who committed murder; Luke names revolt and murder; John calls him a robber. These descriptions remain attributed to their Gospels and do not establish different identities. Matthew describes the priests urging the crowd to choose Barabbas and demand Jesus' death. Pilate asks what wrong Jesus has done, then releases Barabbas and hands Jesus over for crucifixion. The accounts give no later biography for Barabbas.

Other edits:
- `narrative_anchors.linked_stories`: `[{"story_id": "matthew-trial-crucifixion-and-burial", "title": "Trial, Crucifixion and Burial", "passage": "Matthew 26:57 - 27:66", "route": "#stories/matthew/trial-crucifixion-and-burial"}, {"story_id": "mark-trial-crucifixion-and-burial", "title": "Trial, Crucifixion and Burial", "passage": "Mark 14:53 - 15:47", "route": "#stories/mark/trial-crucifixion-and-burial"}, {"story_id": "john-arrest-trial-and-crucifixion", "title": "Arrest, Trial and Crucifixion", "passage": "John 18:1 - 19:42", "route": "#stories/john/arrest-trial-and-crucifixion"}]` → `[{"story_id": "matthew-trial-crucifixion-and-burial", "title": "Trial, Crucifixion and Burial", "passage": "Matthew 26:57 - 27:66", "route": "#stories/matthew/trial-crucifixion-and-burial"}, {"story_id": "mark-trial-crucifixion-and-burial-in-mark", "title": "Trial, Crucifixion and Burial in Mark", "passage": "Mark 14:53 - 15:47", "route": "#stories/mark/trial-crucifixion-and-burial-in-mark"}, {"story_id": "john-arrest-trial-and-crucifixion", "title": "Arrest, Trial and Crucifixion", "passage": "John 18:1 - 19:42", "route": "#stories/john/arrest-trial-and-crucifixion"}]`.

Verification: combined character schema passes; 10 verse anchors and 3 story links pass. 0 quoted spans match packaged KJV.
Identity: `barabbas_399` → `recDz78J2GRUtxKWi`; inherited family edges disabled. Explicit family targets: `[]`.

### `annas`

Draft: [gospel-remainder-characters-records.json](../../claude-drafts/gospel-remainder-characters-records.json). Review: [c9-gospel-remainder-characters.md](c9-gospel-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Named with Caiaphas as high priest in Luke when John begins receiving God's word. John says Jesus is first brought to Annas, Caiaphas's father-in-law, after his arrest. It then describes “the high priest” questioning Jesus about his followers and teaching. Jesus says he spoke openly, and an officer strikes him. John says Annas sent Jesus bound to Caiaphas. The passage names both men without settling the questioner's identity here. Acts again calls Annas high priest when Peter and John face the rulers. Caiaphas, John, Alexander and others from the high priest's family are also present.

Verification: combined character schema passes; 5 verse anchors and 1 story links pass. 1 quoted spans match packaged KJV.
Identity: `annas_269` → `recGotpPx4VIXOGPr`; inherited family edges disabled. Explicit family targets: `[]`.

### `ananias-husband-of-sapphira`

Draft: [acts-remainder-characters-records.json](../../claude-drafts/acts-remainder-characters-records.json). Review: [c10-acts-remainder-characters.md](c10-acts-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A Jerusalem believer whose wife is Sapphira, distinct from the Damascus disciple and the high priest named Ananias. Acts says the couple sell property and knowingly keep part of the price while bringing the rest to the apostles. Peter says both land and money had been theirs to use freely. He accuses Ananias of lying to God. The account says Ananias falls down dead and fear spreads among those who hear. Young men wrap and bury him.

Verification: combined character schema passes; 6 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `ananias_258` → `reciQ6JZbbGyzAk2N`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Sapphira", "profile_id": "sapphira"}]`.

### `sapphira`

Draft: [acts-remainder-characters-records.json](../../claude-drafts/acts-remainder-characters-records.json). Review: [c10-acts-remainder-characters.md](c10-acts-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Ananias's wife, who knows about the plan to keep part of the land's price. Acts says she comes in about three hours later, unaware of what has happened. Peter separately asks her whether the land sold for the stated amount, and she says yes. He asks why they agreed to test the Lord's Spirit. He says the men who buried her husband are at the door. Acts describes her falling dead at Peter's feet and being buried beside her husband.

Other edits:
- `lineage.spouses`: `["Ananias"]` → `["Ananias, Sapphira's husband"]`.

Verification: combined character schema passes; 6 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `sapphira_2472` → `recPzUsFBorefZzaf`; inherited family edges disabled. Explicit family targets: `[{"relation": "spouses", "label": "Ananias, Sapphira's husband", "profile_id": "ananias-husband-of-sapphira"}]`.

### `ananias-of-damascus`

Draft: [acts-remainder-characters-records.json](../../claude-drafts/acts-remainder-characters-records.json). Review: [c10-acts-remainder-characters.md](c10-acts-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A disciple at Damascus, distinct from Sapphira's husband and the high priest. Acts 9 describes the Lord sending him in a vision to Judas's house on Straight Street. Saul is praying there and has seen Ananias coming to lay a hand on him. Ananias objects, citing Saul's persecution and authority to arrest believers. The Lord's reply describes Saul as chosen to speak before non-Jews, kings and Israel. Ananias goes, lays hands on Saul and calls him brother. He says he was sent for Saul's sight and filling with the Holy Spirit. In Paul's later account, Ananias follows the law and is respected by local Jews.

Verification: combined character schema passes; 8 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `ananias_259` → `recmTY4FOegpNmW1w`; inherited family edges disabled. Explicit family targets: `[]`.

### `simon-magus`

Draft: [acts-remainder-characters-records.json](../../claude-drafts/acts-remainder-characters-records.json). Review: [c10-acts-remainder-characters.md](c10-acts-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A man in Samaria whom Acts describes as using sorcery and presenting himself as great. People call him God's great power. After Philip preaches, Simon believes, is baptized and follows him, amazed by the signs. Acts describes Peter and John laying hands on people, who receive the Holy Spirit. Simon offers money for that power. Peter rebukes him and tells him to turn from his wrongdoing and pray. Simon asks them to pray that the threatened harm will not happen. Acts gives no later biography. Magus is a conventional label, not his name in the KJV; he is distinct from Peter and Simon the tanner.

Verification: combined character schema passes; 9 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `simon_2752` → `rec7mbq5BahDRoSlS`; inherited family edges disabled. Explicit family targets: `[]`.

### `dorcas`

Draft: [acts-remainder-characters-records.json](../../claude-drafts/acts-remainder-characters-records.json). Review: [c10-acts-remainder-characters.md](c10-acts-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Tabitha, also called Dorcas, is a disciple in Joppa whom Acts describes as generous and active in helping others. She becomes ill, dies and is laid in an upstairs room. Two men ask Peter to come from nearby Lydda. Widows show him clothing she made and weep. Acts describes Peter clearing the room, kneeling to pray and saying, “Tabitha, arise”. She opens her eyes and sits up, and he presents her alive to the believers and widows. The account says many in Joppa believe after hearing this.

Verification: combined character schema passes; 6 verse anchors and 0 story links pass. 1 quoted spans match packaged KJV.
Identity: `dorcas_2810` → `recDt7JkmnmKqdnB7`; inherited family edges disabled. Explicit family targets: `[]`.

### `eutychus`

Draft: [acts-remainder-characters-records.json](../../claude-drafts/acts-remainder-characters-records.json). Review: [c10-acts-remainder-characters.md](c10-acts-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A young man present at Troas, sitting in an upstairs window while Paul speaks until midnight before leaving. Acts says he falls deeply asleep, falls from the third floor and is taken up dead. Paul goes down, embraces him and says his life is in him. Paul returns upstairs, breaks bread and talks until dawn. The account describes Eutychus being brought in alive, greatly comforting the group. It does not establish his beliefs from attendance or explain a medical mechanism.

Verification: combined character schema passes; 6 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `eutychus_1230` → `recuqHd9gHVWFFHNK`; inherited family edges disabled. Explicit family targets: `[]`.

### `demetrius-the-silversmith`

Draft: [acts-remainder-characters-records.json](../../claude-drafts/acts-remainder-characters-records.json). Review: [c10-acts-remainder-characters.md](c10-acts-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: A silversmith in Ephesus who makes silver shrines for Diana. Acts records him warning other craftspeople that Paul's teaching threatens their income and the goddess's temple. He says Paul teaches that handmade gods are not gods. The workers shout, “Great is Diana of the Ephesians”, and confusion spreads through the city. The town clerk calms the crowd. He says the accused men neither rob temples nor insult their goddess, and directs complaints to the courts. This profile covers the silversmith in Acts, without identifying him with the Demetrius in 3 John.

Verification: combined character schema passes; 6 verse anchors and 1 story links pass. 1 quoted spans match packaged KJV.
Identity: `demetrius_1007` → `recnjSr5ffVmmz3Rf`; inherited family edges disabled. Explicit family targets: `[]`.

### `claudius-lysias`

Draft: [acts-remainder-characters-records.json](../../claude-drafts/acts-remainder-characters-records.json). Review: [c10-acts-remainder-characters.md](c10-acts-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: The Roman commander at Jerusalem, distinct from Emperor Claudius. Acts describes him rescuing Paul from a crowd and binding him with two chains. He asks whether Paul is the Egyptian rebel; Paul replies that he is a Jew from Tarsus. The officer orders a whipping to question Paul but draws back on learning Paul is Roman. He says he bought citizenship, while Paul says he was born with it. After Paul's nephew reports an ambush plot, he sends Paul to Felix at Caesarea under a large guard. His letter names him and says Paul has done nothing deserving death or imprisonment. Those assessments remain the officer's claims.

Verification: combined character schema passes; 10 verse anchors and 1 story links pass. 0 quoted spans match packaged KJV.
Identity: `claudius_948` → `recTx6ajkAepIsmh5`; inherited family edges disabled. Explicit family targets: `[]`.

### `luke`

Draft: [acts-remainder-characters-records.json](../../claude-drafts/acts-remainder-characters-records.json). Review: [c10-acts-remainder-characters.md](c10-acts-remainder-characters.md).

Fixes: rewrote the summary in plain, short sentences while retaining the reviewed limits.
Summary now: Paul's companion named in three letters. Philemon calls Lucas a fellow worker; Colossians calls Luke “the beloved physician”; Second Timothy says only Luke is with Paul. The last passage does not establish a final imprisonment. Acts never names Luke, though its narration changes to “we” in parts of the journeys. Acts addresses Theophilus and refers to “The former treatise”; Luke's Gospel also addresses Theophilus. The traditional link between these books, Luke and the unnamed travelling narrator is not an explicit statement of the texts.

Other edits:
- `geography.residence`: `[]` → `["Not stated in the cited letters."]`.

Verification: combined character schema passes; 9 verse anchors and 2 story links pass. 3 quoted spans match packaged KJV.
Identity: `luke_1836` → `recFqCoLVEfASibXd`; inherited family edges disabled. Explicit family targets: `[]`.

### `jehu-tribute-shalmaneser`

Draft: [academic-cards-records.json](../../claude-drafts/academic-cards-records.json). Review: [e4-jehu-tribute-shalmaneser.md](e4-jehu-tribute-shalmaneser.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: The Black Obelisk caption lists tribute from Jehu, son of Omri. He is usually identified with the king in 2 Kings 9–10. Those chapters describe Jehu ending Ahab's house and Hazael taking Israel's eastern lands. They do not report this tribute. A separate Assyrian account places the tribute in Shalmaneser III's eighteenth year, usually dated to 841 BCE.
Scope now: The date of about 841 BCE applies to the reported tribute, not the making of the obelisk. The identification of Jehu and the kingdom-label reading remain usual interpretations. They do not prove a family link to Omri. The silence claim concerns only the compared account in 2 Kings 9–10. Its silence does not disprove the tribute. The cited Assyrian passages do not describe Jehu's coup. The later museum article checks the older translation; no new reading of the ancient signs is claimed.

Other edits:
- Added the complete History Context record `history-jehu-tribute-shalmaneser`; linked the event to it.
- Moved the verified facts into that record and removed the unflagged `academic_consensus`.
- Kept the research title; added the draft display title.

Verification: evidence, single-verse references, KJV quote and linked timeline schema pass. Historical sources were read with the limits listed above.

### `esarhaddon-manasseh-tribute`

Draft: [academic-cards-records.json](../../claude-drafts/academic-cards-records.json). Review: [e7-esarhaddon-manasseh-tribute.md](e7-esarhaddon-manasseh-tribute.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: Esarhaddon's palace-building list names Manasseh king of Judah among rulers required to send materials. This demand suggests that Judah was under Assyrian rule. It is an inference from the list. In 2 Kings 21:1–2, Manasseh begins ruling at twelve, reigns fifty-five years and does evil. In 2 Chronicles 33:11–13, Assyrians take him to Babylon. The account says he humbles himself and returns to Jerusalem.
Scope now: Chronicles does not name the Assyrian king who takes Manasseh. This record does not identify him as Esarhaddon. The quotation uses the packaged KJV's among the thorns; no alternative word meaning is established. The claim about Assyrian control rests on an inference from the demand for materials. The later translation is a check on Rogers, not a fresh reading of the tablet.

Other edits:
- Added the complete History Context record `history-esarhaddon-manasseh-tribute`; linked the event to it.
- Moved the verified facts into that record and removed the unflagged `academic_consensus`.
- Kept the research title; added the draft display title.

Verification: evidence, single-verse references, KJV quote and linked timeline schema pass. Historical sources were read with the limits listed above.

### `merodach-baladan-hezekiah-embassy`

Draft: [academic-cards-records.json](../../claude-drafts/academic-cards-records.json). Review: [e8-merodach-baladan-hezekiah-embassy.md](e8-merodach-baladan-hezekiah-embassy.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: Kings and Isaiah describe a Babylonian king sending letters and a gift after hearing that Hezekiah had been ill. The KJV names him Berodachbaladan in 2 Kings 20:12 and Merodachbaladan in Isaiah 39:1. Kings says Hezekiah hearkened to the visitors; Isaiah says he was glad of them. Isaiah also says Hezekiah had recovered. A Babylonian chronicle records Merodach-baladan's reign, but does not report this embassy.
Scope now: The compared biblical passages give no year for the embassy. This record does not choose between the king's first and later reign. It makes no claim about a KJV margin. The English names are the spellings in the packaged KJV. The Hebrew names differ in more than their first letter: Kings also includes a letter absent from Isaiah. The two Hebrew verbs also differ. No quoted Latin form is presented as exact Hebrew. The chronicle neither confirms nor contradicts the embassy, and does not establish its motive.

Other edits:
- Added the complete History Context record `history-merodach-baladan-hezekiah-embassy`; linked the event to it.
- Moved the verified facts into that record and removed the unflagged `academic_consensus`.
- Kept the research title; added the draft display title.

Verification: evidence, single-verse references, KJV quote and linked timeline schema pass. Historical sources were read with the limits listed above.

### `nebuchadnezzar-egypt-campaign`

Draft: [academic-cards-records.json](../../claude-drafts/academic-cards-records.json). Review: [e9-nebuchadnezzar-egypt-campaign.md](e9-nebuchadnezzar-egypt-campaign.md).

Fixes: revised the comparison, its reasoning and its limits using only the supplied finding.
Summary now: A damaged Babylonian text reports a campaign against Egypt in Nebuchadnezzar's thirty-seventh year. The usual date is 568/567 BCE. The Egyptian king's name is partly restored as Amasis. Ezekiel and Jeremiah predict Nebuchadnezzar's attack on Egypt. This is a proposed comparison with those passages. They are predictions, not reports of the campaign.
Scope now: The broken text does not establish that Egypt was conquered, taken or made a province. It does not settle whether the predictions were fulfilled or failed. A missing or unclear result cannot decide that question. The newer author draws wider conclusions about history. This record does not adopt them. The existing Tyre record compares biblical passages internally. This History record concerns only the Egypt fragment and its proposed link with these texts. The date belongs to the reported campaign, not a date stated in the prophetic passages.

Other edits:
- Added the complete History Context record `history-nebuchadnezzar-egypt-campaign`; linked the event to it.
- Moved the verified facts into that record and removed the unflagged `academic_consensus`.
- Kept the research title; added the draft display title.

Verification: evidence, single-verse references, KJV quote and linked timeline schema pass. Historical sources were read with the limits listed above.

## Returns left unchanged

All 13 remain open. Their record objects are unchanged; reasons and Claude research requests remain in [README](README.md#return-to-claude-research).

- `simeon-and-levi-came-upon-the-city-boldly-or-securely-genesis-34-25` — unchanged; see [d16-genesis-second-pass.md](d16-genesis-second-pass.md).
- `went-northward-or-passed-to-boraan-judges-12-1-greek` — unchanged; see [d25-ot-remainder-1-second-pass.md](d25-ot-remainder-1-second-pass.md).
- `orpah-kissed-her-mother-in-law-or-and-returned-to-her-people-ruth-1-14-greek` — unchanged; see [d25-ot-remainder-1-second-pass.md](d25-ot-remainder-1-second-pass.md).
- `the-almighty-or-the-sufficient-one-ruth-1-20-greek` — unchanged; see [d25-ot-remainder-1-second-pass.md](d25-ot-remainder-1-second-pass.md).
- `i-had-held-my-tongue-or-i-disobeyed-the-adversary-is-not-worthy-of-the-court-esther-7-4-greek` — unchanged; see [d21-esther-second-pass.md](d21-esther-second-pass.md).
- `laid-a-tribute-upon-the-land-and-the-isles-or-wrote-upon-the-kingdom-of-land-and-sea-esther-10-1-greek` — unchanged; see [d21-esther-second-pass.md](d21-esther-second-pass.md).
- `mordecai-next-unto-the-king-or-took-over-from-king-artaxerxes-esther-10-3-greek` — unchanged; see [d21-esther-second-pass.md](d21-esther-second-pass.md).
- `our-authority-which-the-lord-hath-given-us-or-which-the-lord-gave-2-corinthians-10-8-greek-new-testament` — unchanged; see [d10-2-corinthians-second-pass.md](d10-2-corinthians-second-pass.md).
- `let-my-kinsman-come-down-into-his-garden-first-clause-greek` — unchanged; see [d9-song-of-solomon-second-pass.md](d9-song-of-solomon-second-pass.md).
- `mesha-moab-revolt` — unchanged; see [e2-mesha-moab-revolt.md](e2-mesha-moab-revolt.md).
- `shishak-campaign-karnak` — unchanged; see [e3-shishak-campaign-karnak.md](e3-shishak-campaign-karnak.md).
- `samaria-fall-sargon` — unchanged; see [e5-samaria-fall-sargon.md](e5-samaria-fall-sargon.md).
- `tiglath-pileser-menahem-pekah-ahaz` — unchanged; see [e6-tiglath-pileser-menahem-pekah-ahaz.md](e6-tiglath-pileser-menahem-pekah-ahaz.md).
