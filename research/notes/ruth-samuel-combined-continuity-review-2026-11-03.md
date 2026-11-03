> Historical pre-fix review. See [the integration and fixes audit](ruth-samuel-continuity-fixes-2026-11-03.md) for the current resolution and remaining checks.

# Ruth, 1 Samuel and 2 Samuel combined continuity review — 2026-11-03

## Result

All 59 chapters have exactly one opening image in the combined source model. All 63 active image placements were inspected at their full native asset resolution: 25 Story figures at 1200×675 and 38 new openers at 960×540. The superseded Tamar/Absalom v1 was inspected as an additional comparison. No definite recurring-character identity break or clearly malformed visible human/animal anatomy was found. This is a qualified visual review, not release approval: the inherited Endor scene has a concrete disguise concern; one close image pair needs layout review; integration and coverage-check work remains. Crop identity and some visual/age comparisons remain uncertain.

No branches were changed, committed, pushed or merged. No replacements were generated; no publication, installation, device changes or preview server occurred. Review files and an isolated Git object merge simulation are the only new work.

## Exact source reviewed

| Source | Commit |
| --- | --- |
| Current GitHub main | `82a91ed4697c7e6836f0e56f341998de244df461` |
| Ruth | `d455bbd6494f032f9a9b9cf8a0bed34a0929d3c9` |
| 1 Samuel | `c0a7b9e280e5b5c6350a96adc9c32d2a54ee1076` |
| 2 Samuel | `564868f05de856e82bde366cc878811fca4b61c5` |
| Sites source, read with a fresh credential | `9983427f11fe71a2e6fb6c58ababe5621f344541` |

Read `AGENTS.md`, `RELEASING.md`, Joshua's audit, Judges' audit on current main, and all three book audits and generation/provenance records. The original `/workspace/biblelens` checkout was left untouched. `/workspace/continuity-review` contains isolated snapshots; `evidence/1-samuel` and `evidence/2-samuel` contain the respective branch differences. It is an inspection workspace, not a release checkout.

The Sites source has no mirror-only tracked paths. Seven shared paths differ from current main: `AGENTS.md`, `data/chapter-images.json`, `data/hosted-artwork.json`, `package.json`, `scripts/chapter-images.mjs`, `scripts/check-chapter-images.mjs`, and `scripts/hosted-artwork.mjs`. These correspond to GitHub's newer continuity rules, Judges and build 339, while the mirror remains build 338. No independent newer application work was found in the mirror. Sites metadata reports version 327; that does not prove live bytes.

## Actionable verified findings

### F1 — The Samuel additions conflict when merged as text

**Status: verified integration blocker.** Both feature branches append entries at the end of `data/chapter-images.json`. `git merge-tree --write-tree` in the isolated clone reports a content conflict in that file when combining the two Samuel branches. Each branch alone simulates cleanly against current main. No real merge or checkout was performed.

The changes are semantically disjoint: 1 Samuel adds 22 `8:<chapter>` keys; 2 Samuel adds 16 `9:<chapter>` keys. Preserve both sets, current main's Judges entries and every existing entry. Preserve 2 Samuel's `data/story-images.json` switch to `story-amnon-tamar-and-absalom-v2.webp`. Do not resolve by taking an entire side. The review script's key-based combination found no competing edits to an identical metadata key.

### F2 — The standard image check omits two completed books' chapter coverage

**Status: verified validation gap.** In the 2 Samuel branch, `scripts/chapter-images.mjs` changes `illustratedBooks` to an explicit-ID Map containing 0–6 and 9, leaving 7 (Ruth) and 8 (1 Samuel) unregistered. `package.json` runs only `check-story-images.mjs` and `check-chapter-images.mjs` for `check:images`. The separate `scripts/check-1-samuel-artwork.mjs` is not invoked by that command.

The Story check covers retained Story assets, but does not enforce all new Samuel chapter openers. Before release, register Ruth `[7,['Ruth',4]]` and 1 Samuel `[8,['1 Samuel',31]]` in the explicit-ID coverage map, retain 2 Samuel at ID 9, and run the separate 1 Samuel check or incorporate its relevant guarantees. Confirm that removing an opener in each completed book fails the release checks. The independent review script verified current coverage; it does not close the release pipeline gap.

### F3 — Saul's visible circlet conflicts with the Endor disguise

**Status: verified visible concern in inherited art; not introduced by the new openers.** `src/assets/story-saul-and-the-medium-at-endor-saul-s-death-v1.webp`, placed at 1 Samuel 28:1, depicts Saul with a gold patterned circlet visible under his hood. The local WEB text at 28:8 explicitly says he disguised himself and changed clothing before the nighttime visit. The retained royal marker undermines that scene's disguise.

Action: make a versioned edit removing the royal circlet while preserving Saul's face, curls, complexion, age, build and the two companions; use the actual approved Saul files as image inputs. Compare against `story-saul-rejected-v1.webp` and the current Endor file. This review did not make that edit. The posture, nighttime setting, woman and two companions otherwise fit the episode; no visible apparition is required to illustrate the conversation.

### F4 — The 1 Samuel 7 pair repeats a stone scene only two verses apart

**Status: verified spacing/editorial issue, already disclosed by the book audit.** `src/assets/chapter-1-samuel-07-opening-v1.webp` at 7:0 shows the Ebenezer stone; `src/assets/story-samuel-judges-israel-v1.webp` at 7:2 shows Samuel beside a memorial stone. Their verse-position difference is 2. Both visually anticipate the stone-setting in 7:12; this is broad chapter/Story imagery rather than a literal illustration of verse 2.

Action: inspect the pair in rendered phone/iPad reading before release and record the retention or adjustment decision. Preserve opener coverage and the existing Story's useful coverage. The rules require reporting close pairs; they do not automatically require removing either image. This is the only sub-five-verse consecutive pair involving these three books in the combined model.

## Uncertainties and editorial concerns

- **2 Samuel 23:0 crop:** `src/assets/chapter-2-samuel-23-opening-v1.webp` has conspicuous rounded pods and broad leaves in the foreground. I cannot confidently identify these as lentils from the image; they read as a generic/pea-like legume. The local text at 23:11 specifically says lentils. The provenance's rejected barley draft and accepted prompt are not visual proof of the plant species. Obtain a botanical visual check or use a versioned depiction with confidently recognizable lentil plants. This is an unresolved subject-accuracy concern, not a verified botanical diagnosis.
- **Jerusalem scale:** the small ridge settlement in `chapter-2-samuel-05-opening-v1.webp` differs markedly from the monumental walls, towers and dense city in `story-jerusalem-and-the-ark-v1.webp` at 5:6 and the backdrop of `story-absalom-s-rebellion-v1.webp` at 15:1. The 5:6 banner illustrates chapter 6's procession. Viewpoints and elapsed construction can differ; the images do not establish an exact reconstruction. Resolve whether this visual scale shift is acceptable before treating these files as setting references for future work. No historical-date judgment was inferred from imagined architecture.
- **David's precise aging:** the rebellion portrait visibly has more gray and a more weathered face than the earlier royal scenes. The appendix portraits at 23:8 and 24:1 look younger. The text does not supply a secure sequential date for every appendix event, so this does not establish reverse aging. Do not use an appendix portrait to reset David's age in a later scene without a narrative-age plan.
- **Occluded anatomy:** covered hands, seated legs, distant faces and overlapping crowd/animal limbs cannot be fully verified. No unmistakable defect was found in the visible portions. This is not a guarantee of anatomy hidden by clothing or framing.
- **Composition repetition:** many new openers use an olive tree framing a hill-country road, wall or distant settlement (for example 1 Samuel 6, 7, 9–11, 20, 23, 25 and 2 Samuel 2–5, 14, 16, 23). Lighting and objects vary, and no uniform sepia grade was found. Assess the reading rhythm at phone size; this is an editorial concern, not a character-continuity failure.

## Character and group comparison

| People | Actual files compared under `src/assets/` | Result and reference guidance |
| --- | --- | --- |
| Ruth | `story-naomi-and-ruth-return-to-bethlehem-v1.webp`; `story-ruth-gleans-in-boaz-s-field-v1.webp`; `story-the-threshing-floor-v1.webp`; `story-boaz-redeems-and-marries-ruth-v1.webp` | Compatible young adult oval face, defined brows, brown complexion, dark curls and slim build. Gleaning pose limits facial comparison. No appearance in later Samuel scenes was identified. |
| Naomi | Return and gate scenes above | Compatible lined face, gray curls, complexion and slight build; no numeric age inferred. |
| Boaz | Gleaning, threshing-floor and gate scenes above | Broad face, curls, graying beard, complexion and sturdy build remain recognizable through the harvest period. |
| Samuel and Eli | `story-hannah-and-the-birth-of-samuel-v1.webp`; `story-eli-s-sons-and-samuel-s-call-v1.webp`; `story-samuel-judges-israel-v1.webp`; `story-israel-demands-a-king-v1.webp`; `story-saul-rejected-v1.webp`; `story-david-anointed-v1.webp` | Child Samuel is compatible across the first two; Eli's reclining face is indistinct. Elder Samuel's features, gray curls/beard and build are broadly compatible. A child-to-elder likeness chain and exact age at chapter 7 remain interpretive. |
| David, youth | `story-david-anointed-v1.webp`; `story-david-and-goliath-v1.webp`; `story-saul-s-jealousy-and-david-s-flight-v1.webp` | Anointing and right-hand robe recipient retain youthful face, short tight curls, complexion and slim build. Goliath view largely hides his face. The bearded donor on the left is Jonathan, not David. |
| David, adult/king | `story-david-in-the-wilderness-v1.webp`; `story-david-becomes-king-v1.webp`; `story-jerusalem-and-the-ark-v1.webp`; `story-the-davidic-covenant-v1.webp`; `story-david-and-mephibosheth-v1.webp`; `story-david-bathsheba-and-uriah-v1.webp`; `story-absalom-s-rebellion-v1.webp`; `story-the-exploits-of-david-s-mighty-men-v1.webp`; `story-the-census-and-the-plague-v1.webp` | Medium-brown complexion, dark natural curls, beard and adult build remain broadly recognizable across the book boundary. The youth-to-adult change is plausible but cannot prove exact likeness. Wilderness and accession are compatible adult reference candidates. Local 2 Samuel 5:4 gives age 30 at accession; do not use Jonathan as the adult anchor. Rebellion and appendix age limits are above. |
| Saul | Rejection and Endor scenes above | Face, prominent nose, curls, beard and complexion are compatible; height cannot be established seated. Disguise concern F3 remains. |
| Jonathan and Abigail | Robe-exchange and wilderness scenes above, respectively | One clear portrayal each; no second identifiable Samuel-book depiction was found to compare. Abigail is the woman in plum, not a recurring anonymous follower. |
| Nathan | Covenant and Bathsheba/Uriah scenes above | Compatible gray curls/beard, complexion, nose and build. Do not relabel him Samuel. |
| Tamar/Absalom | `story-amnon-tamar-and-absalom-v1.webp` versus branch's `story-amnon-tamar-and-absalom-v2.webp` | Faces, complexions, curls, apparent ages and relationship remain recognizable. V2 removes the circlet. Hands and surrounding cloth were redrawn; no clear malformed visible hand was found. Provenance records both actual v1 identity and Genesis 7 style files as inputs. No later securely identifiable Absalom portrait was found in these active scenes; the leading older man in the rebellion image is David. |
| Mephibosheth, Joab, Araunah | `story-david-and-mephibosheth-v1.webp`; `story-sheba-s-revolt-and-the-gibeonites-v1.webp`; `story-the-census-and-the-plague-v1.webp` | One securely contextualized portrayal each; no named cross-book match was established. Mephibosheth's crutches remain visible; seated pose limits limb checks. |

All 38 new openers avoid identifiable recurring human faces. Their actual native files were opened, including the livestock, donkeys and lamb; no clear animal anatomy failure was found. They do not introduce competing character anchors. Existing Samuel Story scenes generally retain the grounded illustrative style of `chapter-genesis-07-opening-v1.webp`, used here only as a style comparator.

Earlier group comparisons included the actual `story-joshua-s-farewell-and-covenant-at-shechem-v1.webp`, `story-the-cycle-of-the-judges-v1.webp`, `chapter-judges-20-opening-v1.webp`, `chapter-judges-21-opening-v1.webp`, Ruth's gate scene and Samuel assemblies/followers. Complexions, natural curls and woven garments remain broadly compatible; anonymous people across generations cannot be mapped to named individuals.

The earlier files cited by the 1 Samuel audit as Philistine/Amalekite context do **not** provide clear visible group identity references: `story-samson-v1.webp` shows Samson carrying gates, and `story-water-from-the-rock-and-the-battle-with-amalek-v1.webp` shows Israelites receiving water. Their titles alone do not establish visible Philistines or Amalekites. Goliath and distant troops provide some current Philistine context, but not a secure recurring crowd identity. No new Samuel opener depicts those groups.

## Coverage, spacing and reproducible evidence

`source-review.mjs` combines only branch-changed metadata keys in memory; it does not merge branches or edit application metadata. It asserts one opener for every Ruth/Samuel chapter and inventories each active file's size and SHA-256. Its full output is `source-evidence.json` in this directory. Counts: Ruth 4 Story openers; 1 Samuel 9 Story + 22 chapter openers with 2 later Story images; 2 Samuel 8 Story + 16 chapter openers with 2 later Story images. Total 59 openers, 4 later images, 63 active placements.

Verse-position distances use the existing audits' convention (position 0 for chapter openers, actual verse number for Story images; chapter lengths accumulate):

| Boundary | Distance |
| --- | ---: |
| Judges 21:0 → Ruth 1:1 | 26 |
| Ruth 4:1 → 1 Samuel 1:1 | 22 |
| 1 Samuel 31:0 → 2 Samuel 1:1 | 14 |
| 2 Samuel 24:1 → 1 Kings 1:1 | 25 |

Only 1 Samuel 7:0 → 7:2 falls below five verses. Within 2 Samuel, 5:0 → 5:6 is six verses and 23:0 → 23:8 is eight. Retained broad Story banners can illustrate a later episode in their passage (notably 1 Samuel 2:12/13:1 and 2 Samuel 1:1, 5:6, 8:1, 11:1, 20:1); no new claim of literal opening-verse depiction is made here.

## What remains before release

1. Address the Endor disguise concern with a versioned, reference-based edit; resolve or explicitly review the crop uncertainty and setting-scale concern. Retain the Tamar/Absalom v2 identity-preserving correction.
2. Integrate both metadata additions without losing coverage, and register all completed books in the shared validation map. Run the relevant image/build checks on that actual combined source. Prior individual-branch passes are reported in the book audits; no combined application build or packaged parity pass was run in this review.
3. Render all three books at phone/iPad widths, particularly the 1 Samuel 7 pair, repeated landscapes, captions, clipping and opening placement; inspect unlocked devices. Managed browser control was not available in the tool catalog, and no substitute browser or installation was attempted.
4. Perform the coordinated release from the Mac using `RELEASING.md`: fresh GitHub/Sites comparison, shared builds, signed iOS asset comparison, publication/install, live image-byte verification, installed build and launch checks, and `release:verify`. Hosting the Samuel images is optional under the current branch design; if chosen, extend the checked allowlist and immutable public pin only after assets exist at their public commit.

**Access and verification limits:** all active repository artwork and audits were accessible; no artwork-access blocker occurred. Original generation PNGs referenced by other sessions were not supplied here; the reviewed production assets are their checked-in 960×540/1200×675 WebP files. Earlier audits record a proxy CONNECT 403 for the live Site's `/release.json`; this session did not retry or bypass that denial. Live bytes, signed bundles, installed devices and rendered layouts remain unverified. There was no automatic approval rejection in this review. No permission or release request is pending; this session was authorized for review only.
