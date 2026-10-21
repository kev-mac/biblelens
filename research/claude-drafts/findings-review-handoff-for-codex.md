# Handoff to Codex: findings review of the second-pass merge (2026-10-20)

From: Claude (researcher). To: Codex (verification, implementation, Git checkpoints).
Subject: branch `research-merge-second-pass` at `3b1e9f9`, 250 merged draft records.
Owner authorisation: the owner approved "Septuagint only" for the two held records and asked for this handoff. Nothing here was applied by me.

## 0. What this is and is not
- I read every record (summary, reasoning, scope) and checked Hebrew/Greek readings and every "Greek prints no verse" claim against the merge's cached WLC and Brenton pages (`quote-source-cache.json`). Other readings rest on the quote-check pass and my knowledge of the text. I opened no lexicon.
- **Findings approval is separate from quotation accuracy.** Quote PASS (250/250) says the words are on the cited pages. It does not say the finding is sound or approved. All 250 stay `draft, unverified` until the owner approves findings.
- I touched only `research/claude-drafts/` (this file, and the Jesus profile draft). I did not touch main, the paused task, the queue, the ledger, or the worktree.
- Full per-record table (250 rows, reasons and sources): `findings-review-250.md`, in this folder.

## 1. Result in one table
| Verdict | Count | Action for Codex |
|---|---|---|
| Supported | 224 | No change required. Optional wording tweaks are in section 5. Owner approves findings; not me, not you. |
| Needs correction | 14 | Section 3. Each has exact replacement wording. |
| Unsupported | 12 | Section 4. Drop (or move to a non-finding notes appendix). |

## 2. The two held records: recommendation is Septuagint only
Hebrew stays as background. This matches the owner's decision.

| Record | Change |
|---|---|
| `priests-for-the-devils-or-for-the-idols-and-the-vain-things-greek` (2 Chronicles 11:15) | Keep tag T, witness `Septuagint`. Record in `undecided.md`: "Resolved by owner, 2026-10-20: Septuagint only; Hebrew retained as background." Keep the preserved scope (it already says no Hebrew mistranslation is claimed). In the summary, change "two nouns for one Hebrew word" to "two Greek nouns where the Hebrew has one word (שְׂעִירִים)" so it does not read as a claim about the KJV. |
| `from-the-east-country-into-the-desert-or-galilee-and-arabia-ezekiel-47-8` | Keep tag T, witness `Septuagint`. Same `undecided.md` entry. In the preserved reasoning, delete "The Hebrew words הַגְּלִילָה and הָעֲרָבָה are the forms from which those names come." (an etymology the record does not show); the supplemental reasoning already says the Hebrew words can be common nouns or place names. |

Evidence: the Greek (Brenton 2CH11:15; EZK47:8) prints the idols/vain things and the proper names Galilee and Arabia; the KJV and Hebrew have a common noun in each place. The preserved scope of each record already concedes the Hebrew can carry the KJV's sense, so a Hebrew finding is not shown.

## 3. Fourteen corrections
**Class N = necessary** (a rule is broken or a claim is wrong or unsupported). **Class E = editorial** (a tidy-up on an otherwise sound record). All 14 below are class N. Editorial items are in section 5.

Fields are the record's own: `title`, `summary`, `tags`, `witness`, `appliesTo`, `sides`, `refs`, `scope`, `reasoning`.

### 3.1 `anger-not-kept-for-ever-or-fire-burning-for-ever-jeremiah-3-12-17-4` (jeremiah-4b) — N
- **Problem:** frames a 3:12 vs 17:4 clash; the scope itself says the verses address different parties, עוֹלָם can be indefinite, and "the text does not force a contradiction". The real finding is that Brenton's Greek omits 17:1-4.
- **Evidence:** Brenton JER17 prints verse 5 first (verses 1-4 absent; cache keys 1 and 4 are empty).
- **Replace:** `title`: "“The sin of Judah is written with a pen of iron” — Brenton’s Greek prints no verses 17:1-4". `summary`: "The KJV and the Hebrew edition quoted have four verses (17:1-4) before “Cursed be the man that trusteth in man”, including “ye have kindled a fire in mine anger, which shall burn for ever” (17:4). Brenton’s Greek page for the chapter prints no verse numbered 1 to 4; its first label is 5." `tags` ["T"], `witness` "Septuagint". `appliesTo` ["Jeremiah 17:1","Jeremiah 17:4"]. `refs` drop 3:12. `sides`: keep the 17:1 and 17:4 sides, delete the 3:12 side. `scope`: "T applies at Jeremiah 17:1-4 as an omission on the one Greek page named. This is a statement about one printed edition of the Greek; it does not show that no Greek manuscript has the verses, and the record does not claim the Greek denies that the fire burns." Delete the preserved scope and reasoning about 3:12.
- **ID:** recommend a new ID, e.g. `fire-kindled-in-anger-brentons-greek-prints-no-verses-jeremiah-17-1-4`, with the old ID kept in the crosswalk. Your call if you would rather keep the old ID for provenance.

### 3.2 `i-will-not-repent-or-i-am-weary-with-repenting-jeremiah-4-28-15-6` (jeremiah-4b) — N
- **Problem:** same pattern; the scope says 4:28 and 15:6 "need not clash".
- **Evidence:** Brenton JER15:6 ends "οὐκέτι ἀνήσω αὐτούς" (no weary clause); JER04:28 has "οὐ μετανοήσω".
- **Replace:** `title`: "“I am weary with repenting” — Brenton’s Greek has no such clause at Jeremiah 15:6". `summary`: "The KJV and the Hebrew end Jeremiah 15:6 with “I am weary with repenting” (נִלְאֵיתִי הִנָּחֵם). Brenton’s Greek ends the verse “and I will no longer spare them” (οὐκέτι ἀνήσω αὐτούς) and has no clause about being weary." `appliesTo` ["Jeremiah 15:6"]; `refs` ["Jeremiah 15:6"]; `sides` keep only the 15:6 side. Delete the 4:28 contrast from reasoning and scope; keep "T applies at Jeremiah 15:6 and to the closing clause."

### 3.3 `they-cried-or-they-looked-but-there-was-none-to-save-psalm-18-41-2-samuel-22-42` (psalms) — N (recast or drop)
- **Problem:** untagged cried/looked clash; the scope concedes a person can do both. What survives is a Greek point at 2 Samuel 22:42.
- **Evidence:** Brenton 2SA22:42 "Βοήσονται" (they will cry); Brenton PSA017:42 "Ἐκέκραξαν" (they cried); KJV 2 Samuel 22:42 "looked".
- **Replace (recast):** `title`: "“They looked, but there was none to save” — the Greek of 2 Samuel 22:42 has “they will cry”". `summary`: "The KJV and the Hebrew of 2 Samuel 22:42 say the enemies “looked” (יִשְׁעוּ) but there was none to save. Brenton’s Greek of 2 Samuel 22:42 reads Βοήσονται, “they will cry”, as Brenton’s Greek of Psalm 17:42 (KJV Psalm 18:41) reads Ἐκέκραξαν, “they cried”." `tags` ["T"], `witness` "Septuagint", `appliesTo` ["2 Samuel 22:42"], `refs` keep both verses. `scope`: "T applies at 2 Samuel 22:42, Septuagint only. The KJV agrees with the Hebrew. Psalm 18:41 is context and carries no tag." If you would rather not add a new tagged record from an untagged one, drop it; I recommend recasting.

### 3.4 `great-deliverance-giveth-he-or-the-tower-of-salvation-for-his-king-psalm-18-50-2-samuel-22-51` (psalms) — N (recast or drop)
- **Problem:** centred on written/read (ketiv/qere) forms, which the standing rules keep as background only; scope says no tag applies.
- **Evidence:** Brenton 2SA22:51 "Μεγαλύνων τὰς σωτηρίας βασιλέως αὐτοῦ"; PSA017:51 "Μεγαλύνων τὰς σωτηρίας τοῦ βασιλέως αὐτοῦ".
- **Replace (recast):** `title`: "“He is the tower of salvation for his king” — the Greek of 2 Samuel 22:51 has “magnifying the salvations of his king”". `summary`: "The KJV of 2 Samuel 22:51 reads “He is the tower of salvation for his king”. Brenton’s Greek of 2 Samuel 22:51 reads Μεγαλύνων τὰς σωτηρίας βασιλέως αὐτοῦ, “magnifying the salvations of his king”, as Brenton’s Greek of Psalm 17:51 does. The Hebrew text carries a written form and a read form of the first word in both books; the KJV follows the read form in each, and that notation is background only." `tags` ["T"], `witness` "Septuagint", `appliesTo` ["2 Samuel 22:51"].

### 3.5 `dwell-in-the-house-of-the-lord-for-ever-or-for-length-of-days-psalm-23-6` (psalms) — N
- **Problem:** witness `Hebrew and Septuagint` is not shown. The scope concedes "length of days" can mean a lifetime and "for ever" may be the KJV's reading of the idiom.
- **Evidence:** Brenton PSA092:5 "εἰς μακρότητα ἡμερῶν" (so the Greek also differs from the KJV at Psalm 93:5); Hebrew לְאֹרֶךְ יָמִים at both verses.
- **Replace:** `witness` "Septuagint". `title`: "“I will dwell in the house of the Lord for ever” — the Greek says “for length of days”". `summary`: "At Psalm 23:6 the KJV has “for ever”. Brenton’s Greek (Psalm 22:6) has εἰς μακρότητα ἡμερῶν, “to length of days”, as it does at Psalm 93:5 (Greek 92:5), where the KJV also has “for ever”. The Hebrew in both verses is לְאֹרֶךְ יָמִים; it is background only." `scope`: change the first sentence to "T applies at Psalm 23:6 and 93:5, Septuagint only, and only to the closing phrase." Keep the remaining sentences. Check the Greek Psalm 22:6 page (PSA022) when you re-run the quote check; I confirmed 92:5 but not 22:6 from the cache.

### 3.6 `strength-and-gladness-are-in-his-place-or-strength-and-beauty-are-in-his-sanctuary-1-chronicles-16-27-and-psalm-96-6` (psalms) — N
- **Problem:** title and summary treat "glory and honour" vs "honour and majesty" as a difference; the Hebrew is the same pair (הוֹד וְהָדָר) in both, and the scope says so.
- **Replace:** `title`: "“Strength and gladness are in his place” (1 Chronicles 16:27) and “strength and beauty are in his sanctuary” (Psalm 96:6)". `summary`: "David’s song in 1 Chronicles 16 and Psalm 96 share this verse. 1 Chronicles 16:27 has “strength and gladness” (עֹז וְחֶדְוָה) “in his place” (בִּמְקוֹמוֹ); Psalm 96:6 has “strength and beauty” (עֹז וְתִפְאֶרֶת) “in his sanctuary” (בְּמִקְדָּשׁוֹ). The first pair, “glory and honour” and “honour and majesty”, is the same Hebrew pair (הוֹד וְהָדָר) in both and is not a difference." In `reasoning`, delete the sentence that says the first pair names different things. `sides` unchanged.

### 3.7 `that-troop-and-that-number-or-the-demon-and-fortune-greek-isaiah-65-11` (isaiah) — N
- **Problem:** witness `Hebrew and Septuagint` rests on NET translator notes, not a primary lexical source; the preserved scope will not say Gad and Meni were deities.
- **Replace:** `witness` "Septuagint". `summary`: delete the last sentence ("The Hebrew Gad/Meni name interpretation is also reported in NET’s translator notes…"). `scope`: "T applies at Isaiah 65:11, Septuagint only. The Hebrew לַגַּד and לַמְנִי are quoted as background. NET’s translator notes identify them as deity names; that has not been checked against a primary lexicon, so no Hebrew finding is made." If the owner later supplies a primary source (for example HALOT), the Hebrew-and-Septuagint witness can be revisited; that is the owner's decision.

### 3.8 `bajith-and-lions-upon-moab-or-debon-where-your-altar-is-and-arabians-greek-isaiah-15-2-and-9` (isaiah) — N (split)
- **Problem:** two separate differences bundled; the reasoning says "in both verses the Greek names a worshipping place or people", which 15:9 does not show. Isaiah 15:7 is already a separate record; the README notes that 15:9 uses the preserved clause alignment.
- **Evidence:** Brenton ISA15:2 "ἀπολεῖται γὰρ καὶ Δηβών, οὗ ὁ βωμὸς ὑμῶν"; ISA15:9 "ἐπάξω γὰρ ἐπὶ Δειμὼν Ἄραβας, καὶ ἀρῶ τὸ σπέρμα Μωὰβ, καὶ Ἀριήλ, καὶ τὸ κατάλοιπον Ἄδαμά".
- **Replace with two records.**
  - A (new ID e.g. `bajith-or-debon-where-your-altar-is-greek-isaiah-15-2`): `title` "“He is gone up to Bajith, and to Dibon” — Brenton’s Greek has “Debon, where your altar is”"; `summary` "KJV Isaiah 15:2 has Moab going up to “Bajith, and to Dibon, the high places”. The Hebrew edition quoted prints הַבַּיִת וְדִיבֹן. Brenton’s Greek prints Δηβών, οὗ ὁ βωμὸς ὑμῶν, “Debon, where your altar is”, and prints no word that corresponds to Bajith."; `appliesTo` ["Isaiah 15:2"]; tag T, witness Septuagint.
  - B (new ID e.g. `lions-upon-moab-or-arabians-and-ariel-greek-isaiah-15-9`): `title` "“Lions upon him that escapeth of Moab” — Brenton’s Greek has “Arabians” and “Ariel”"; `summary` "KJV Isaiah 15:9 has “I will bring more upon Dimon, lions upon him that escapeth of Moab, and upon the remnant of the land”. Brenton’s Greek 15:9 has “for I will bring Arabians upon Deimon, and take away the seed of Moab, and Ariel, and the remnant of Adama”. The clauses differ; this record does not claim a one-word substitution of “lions” by “Arabians”." `appliesTo` ["Isaiah 15:9"]; keep the preserved scope's source-check qualification.
  - Delete the sentence "In both verses the Greek names a worshipping place or people where the KJV has either a place name or an animal."

### 3.9 `thou-shalt-be-called-hephzibah-and-thy-land-beulah-or-my-desire-and-inhabited-hebrew-and-greek-isaiah-62-4` (isaiah) — N
- **Problem:** the scope cites "the owner’s ruling" inside the record. Standing instruction: Codex adopts only rulings the owner gives it directly, so records must not cite them.
- **Replace** the first sentence of `scope` with: "T applies at Isaiah 62:4. The KJV leaves Hephzibah and Beulah untranslated where the Hebrew (חֶפְצִי־בָהּ, בְּעוּלָה) consists of ordinary words; the KJV’s own next clause gives the sense." Keep the rest (witness `Hebrew and Septuagint` stays; the Greek translates both names).

### 3.10 `meat-offerings-or-manna-jeremiah-17-26-greek` (jeremiah) — N (hold until checked)
- **Problem:** the record implies the Greek means the wilderness food. In the Septuagint μάννα may transliterate מִנְחָה. If so it is a wording-only difference, which the T test excludes.
- **Evidence:** Brenton JER17:26 prints "θυμιάματα καὶ μάννα καὶ λίβανον". I could not confirm from the cache whether μάννα transliterates מִנְחָה (check the Septuagint usage elsewhere, for example Jeremiah 41:5 and Leviticus).
- **Action:** Codex checks. If it is a transliteration, **drop**. If it is genuinely "manna", keep and replace the sentence "puts μάννα, the word used for the food in the wilderness" with "prints μάννα in the slot where the Hebrew has מִנְחָה; μάννα is also the Greek word for the wilderness food (Exodus 16:31)".

### 3.11 `their-king-inherit-gad-or-melchol-inherited-galaad-jeremiah-49-1-greek` (jeremiah) — N
- **Problem:** the Melchol-for-"their king" half is a transliterated name beside a translated title, which Codex has held before (`o-wheel-or-called-gelgel…`). Gad/Galaad is a real place-name difference.
- **Replace:** `title` "“Why then doth their king inherit Gad” — Brenton’s Greek has “Galaad”"; `summary` "The KJV of Jeremiah 49:1 asks why “their king” inherits Gad. The Hebrew edition quoted prints גָּד, Gad. Brenton’s Greek prints Γαλαάδ, Gilead, in that place. The Greek also prints Μελχόλ where the KJV has “their king”; that is a name form and is not the finding." `scope`: "T applies at Jeremiah 49:1 and only to the place name (Gad / Galaad)."

### 3.12 `abimelech-son-of-jerubbesheth-or-son-of-jerubbaal-son-of-ner-2-samuel-11-21-greek` (2-samuel) — N
- **Problem:** Jerubbesheth vs Jerubbaal is a name-form difference of the held kind (the record's own scope will not say they are two men). The added "son of Ner" and the different town are real.
- **Evidence:** Brenton 2SA11:21 "ἀβιμέλεχ υἱὸν Ἱεροβάαλ υἱοῦ Νήρ … ἐν Θαμασί"; KJV "Abimelech the son of Jerubbesheth … Thebez".
- **Replace:** `title` "Joab’s messenger cites Abimelech — Brenton’s Greek adds “son of Ner” and names the town “Thamasi”"; `summary` "KJV 2 Samuel 11:21 names Abimelech’s father Jerubbesheth and the town Thebez. Brenton’s Greek names the father Ἱεροβάαλ υἱοῦ Νήρ, “Jerubbaal son of Ner”, and the town Θαμασί. This record’s finding is the added “son of Ner” and the different town; the name form Jerubbesheth / Jerubbaal is not offered as a difference." Keep `sides`.

### 3.13 `jeroboams-mother-a-widow-or-a-harlot-1-kings-11-26-and-12-24-greek` (1-kings) — N
- **Problem:** tag placement. Greek 11:26 agrees with the KJV (she is a widow); the difference is the Greek addition at 12:24b. Per the tag-placement lessons, the tag sits only where it applies.
- **Evidence:** Brenton 1KI12:24b "ὄνομα τῆς μητρὸς αὐτοῦ Σαριρὰ, γυνὴ πόρνη".
- **Replace:** `appliesTo` ["1 Kings 12:24"] and make 1 Kings 12:24 the primary `ref`; `refs` keep both verses (11:26 is context). `title` "Jeroboam’s mother — Brenton’s Greek adds at 12:24b that she was “a harlot”". `summary` "The KJV of 1 Kings 11:26 calls Jeroboam’s mother Zeruah, “a widow woman”. Brenton’s Greek of 11:26 also has a widow, but the Greek addition printed after 12:24 (12:24b) names her Sarira and calls her γυνὴ πόρνη, “a harlot”." `scope`: "T applies at the Greek addition 12:24b only; 11:26 is context. A widow can also have been a harlot; the record does not claim the two descriptions conflict." Keep the existing `sides`.

### 3.14 `land-of-armenia-or-the-land-of-ararat-2-kings-19-37-isaiah-37-38` (2-kings) — N
- **Problem:** witness is `Hebrew` only, but Brenton’s Greek also prints Ararath, so under the H-and-G-together ruling the witness should be `Hebrew and Septuagint`.
- **Evidence:** Brenton 2KI19:37 "εἰς γῆν Ἀραράθ"; WLC `אֶרֶץ אֲרָרָט` in both verses. (The Isaiah 37:38 Brenton page is not in the cache; Codex should confirm it prints the same.)
- **Replace:** `witness` "Hebrew and Septuagint". Add to `summary`: "Brenton’s Greek of 2 Kings 19:37 also prints Ἀραράθ, so the Greek agrees with the Hebrew against the KJV." This is a label change that follows a standing ruling, not a new expansion. The owner has just said they prefer conservative witness decisions for the two held records, so flag it to them if you want it confirmed.

## 4. Twelve drops
For each: the scope concedes the wording may mean the same, or no conflict exists, or no meaning difference is shown. Codex rule: a concession of no conflict means no record. **Optional salvage:** move the plain observation into the notes file as a "variant readings, not findings" line if you want it kept for readers.

| # | Record ID | Evidence | Why drop |
|---|---|---|---|
| 1 | `there-were-they-in-great-fear-psalm-14-5-6-and-psalm-53-5` | WLC Ps 14:5-6, 53:5 | Parallel psalms; scope: "does not say either is in error", Lord/God is a known feature; Greek not read. |
| 2 | `foundations-of-the-hills-or-foundations-of-heaven-psalm-18-7-2-samuel-22-8` | WLC Ps 18:7, 2 Sam 22:8 | Scope: "two images for the same shaking of the world"; no tag. |
| 3 | `he-did-fly-or-he-was-seen-upon-the-wings-of-the-wind-psalm-18-10-2-samuel-22-11` | WLC | Scope: flying and being seen are not incompatible; each text follows its Hebrew. |
| 4 | `channels-of-waters-or-channels-of-the-sea-psalm-18-15-and-2-samuel-22-16` | WLC | Scope: waters and sea may be near in sense; one-letter difference. |
| 5 | `let-them-be-turned-back-or-let-them-be-desolate-psalm-70-3-and-psalm-40-15` | WLC Ps 70:3, 40:15 | Scope: the verbs may be near in meaning. |
| 6 | `thy-mercy-is-great-above-the-heavens-or-unto-the-heavens-psalm-108-4-and-psalm-57-10` | WLC Ps 108:4, 57:10 | Psalm 108 reuses Psalm 57; scope: "unto" and "above" may be heard as near. |
| 7 | `all-nations-shall-flow-or-people-shall-flow-isaiah-2-2-and-micah-4-1` | WLC Isa 2:2-4, Mic 4:1-3 | Scope: גוים and עמים stand in parallel; no translation issue. |
| 8 | `for-isaiah-had-said-or-and-isaiah-said-isaiah-38-21-22` | Brenton ISA38:21-22 | Scope: the KJV past perfect is a fair rendering of the Hebrew narrative tense; no meaning difference, and a tense choice is not a Greek finding. The Hebrew + Septuagint witness cannot stand. |
| 9 | `shalt-thou-build-me-an-house-or-thou-shalt-not-build-2-samuel-7-5-greek` | WLC 2 Sam 7:5; 1 Chr 17:4 | Question form vs statement; scope: a rhetorical question conveys a refusal. Wording only. |
| 10 | `rock-of-the-plain-or-the-valley-of-sor-jeremiah-21-13-greek` | Brenton JER21:13 | Greek σόρ transliterates צוּר as a name while the KJV translates; same pattern as the held name-form records; the record says it cannot say whether Sor is a place. |
| 11 | `gate-of-sur-or-gate-of-the-ways-2-kings-11-6-greek` | Brenton 2KI11:6 | KJV keeps the name Sur; the Greek renders a common noun. Same held pattern; the record does not know what סוּר means. |
| 12 | `all-israel-gathered-from-shihor-to-hemath-or-thirty-thousand-chosen-men-1-chronicles-13-2-samuel-6` | WLC 1 Chr 13:5, 2 Sam 6:1 | Scope: 30,000 chosen men may be the delegation of all Israel; "does not say the accounts conflict". |

## 5. Editorial preferences (class E; do not need to block anything)
| Record | Suggested tweak |
|---|---|
| `slay-them-not-and-consume-them-that-they-may-not-be-psalm-59-11-and-13` | Keep. Tidy the reasoning's closing sentence ("This does not establish inconsistent intentions") so it matches the scope's two-stage reconciliation. |
| `the-moon-confounded-and-the-sun-ashamed-or-the-brick-shall-melt-and-the-wall-fall-greek-isaiah-24-23` | Keep the consonant comparison as a fact about the Hebrew; drop any phrasing that says what the translator "read". |
| `the-eyes-of-man-toward-the-lord-or-the-lord-watches-over-men-zechariah-9-1-greek` | Add: "The Hebrew phrase לַיהוָה עֵין אָדָם can be read in either direction, so the record does not claim the Hebrew itself says men look to the Lord." |
| `a-bow-of-steel-or-a-bow-of-bronze-2-samuel-22-35-greek` (and `-new-20261020`) | Possible H look: "steel" vs נְחוּשָׁה. Needs a primary lexical source; owner decides. Not required. |
| `restore-the-lamb-fourfold-or-sevenfold-2-samuel-12-6-greek` and `…-new-20261020`; the `a-bow-of-steel…` pair | The `-new-` versions repeat the preserved findings; integrate one of each and keep the other as provenance. |
| `rock…`/name-form records generally | Keep a list of the name-form holds so later batches do not re-propose them. |

## 6. Suggested order of work for Codex
1. Apply the two held-record decisions (section 2) and record them in `undecided.md`.
2. Apply the 14 corrections (section 3). Items 3.10 and 3.14 need a quick check first.
3. Remove or move the 12 drops (section 4).
4. Re-run the quote check on every changed record; then update counts in `summary.json` and the README table (the record total changes: 250 − 12 − (3.10 if dropped) + 1 for the split at 3.8, plus any new recasts).
5. Commit as another unverified draft checkpoint on the branch. Findings approval stays with the owner.

## 7. Questions for the owner (with my recommendation)
1. **Recasts at 3.3 and 3.4:** add two tagged records from the Psalm 18 / 2 Samuel 22 parallels, or drop them. Recommend recast; both facts are verified from the cached Brenton pages.
2. **Witness label at 3.14:** apply "Hebrew and Septuagint" (standing ruling) or keep "Hebrew" until you confirm. Recommend apply.
3. **Isaiah 65:11 Hebrew claim:** if you want to keep it, supply a primary lexical source; otherwise Septuagint only. Recommend Septuagint only.
