# Ezekiel artwork audit — 2026-11-04

Ezekiel only, reader book ID 25, 48 chapters. Branch `artwork/ezekiel-2026-11-04` starts at freshly fetched GitHub main `846ba46`, the build 341 release checkpoint. The original `/workspace/biblelens` checkout is preserved; work uses `/workspace/ezekiel`. Read AGENTS.md, RELEASING.md, build 341 verification, and the relevant Kings/Proverbs continuity reviews first. No other session's branch or unapproved art was used.

## Source and release comparison

GitHub main is canonical. Sites metadata reports public version 330, source `6489207c16040f17c2247db76080520fc6f422b0`, deployment `appgdep_6aea9b1c8ea08191bbbc59c684512e10`; these match the build 341 release audit. No fresh source credential was minted, and no local Sites mirror is present, so mirror file comparison remains unavailable. Direct live `/release.json` returned HTTP 403; no retry or bypass occurred. The metadata comparison is not a live-image verification.

## Coverage and preservation

All 48 chapters now have one source opener. Four existing Story placements at verse 1 remain: chapters 1, 8, 37 and 40. The other 44 chapters receive chapter-specific art at `afterVerse: 0`, through the existing renderer directly below the heading and before verse 1. The Story at 24:15 remains in place. No duplicate opener is added at a Story opening. Generic chapter captions remain hidden; Story-related captions and their renderer remain unchanged.

Every earlier chapter metadata entry, baseline asset blob, scripture text, Story catalog entry and other Story image mapping is preserved. The only changed Story mapping is the versioned Ezekiel vision replacement and its accurate alt text. Package identity remains 1.1.0 / build 341. The illustrated-book registry adds only explicit ID 25, leaving the other concurrent books independent. Its existing generic missing-opener regression now also covers Ezekiel.

See `ezekiel-artwork-plan-2026-11-04.json` for all 44 chapter paths, verse anchors, subjects, alt text and references. `ezekiel-artwork-audit-2026-11-04.json` records all 48 final opening placements, the inline Story, preservation assertions, asset hashes and spacing. These are imagined literary settings and symbolic objects, not historical evidence, exact reconstructions, inscriptions, artifacts or actual portraits. The harbor picture does not identify its wood species; the text names cypress planks and a cedar mast.

## Recurring people and actual image inputs

The five existing Ezekiel appearances are all under `src/assets/`:

- `story-ezekiel-s-vision-and-commission-v1.webp`: brown complexion, dark natural curls, beard and lean adult build, mostly seen from behind.
- `story-the-glory-leaves-the-temple-v1.webp`: compatible dark curls, brown complexion, beard and adult build, in side/back view.
- `story-the-death-of-ezekiel-s-wife-v1.webp`: clearer profile, brown complexion, strong nose, dark curls and graying beard. The woman at the door is the listening neighbor, not a claim that his wife is present after death.
- `story-the-valley-of-dry-bones-v1.webp`: compatible long dark curls, brown complexion, strong nose and graying beard. It illustrates the two-stick sign within chapter 37, rather than asserting that all of the chapter's events occurred in one literal landscape. The listening crowd is anonymous and no face is assigned to another named person.
- `story-ezekiel-is-shown-the-temple-in-a-vision-v1.webp`: Ezekiel appears from behind; his hidden face cannot establish a new portrait anchor. The standing measuring guide is a separate figure and is not identified as Ezekiel or a named recurring human.

Full-size comparisons found no clear identity break requiring a new Ezekiel face. The dates permit several years between early scenes and the wife/restoration scenes, and approximately two decades before chapter 40; the illustrations do not fix an exact age. No new scene invents a portrait or a new aging step.

The original vision image's four separate animal/head forms do not clearly match each creature having four faces and four wings in 1:6–10. Version 2 keeps the original man and canal framing while replacing that visual claim with the approaching bright storm cloud of 1:4. The actual original image and actual Genesis 7 image were supplied to imagegen. The original supplies only the existing figure/scene, not an approval of its creature anatomy. The replacement preserves the same curls, complexion, build, beard, clothing and side/back orientation; it does not invent a new frontal face. His visible planted hand, arm and foot remain coherent. Hidden anatomy remains unverified.

`ezekiel-recurring-inventory-2026-11-04.json` inventories earlier Story/art candidates mentioning Ezekiel, Noah, Daniel, Job, David, Nebuchadnezzar and Pharaoh. A textual mention is not proof that a person is visibly portrayed. Noah, Daniel, Job and David are mentioned or evoked in Ezekiel, but none receives a new portrait here. The Daniel session's new art is not a dependency. Egyptian/Babylonian rulers, Israel/Judah, Tyre's ruler, the symbolic sisters, exiles, armies, priests and shepherds receive no new identifiable portrayal. No missing identity reference is concealed or invented. Future new portraits need their own approved clear references.

Every new chapter scene received the actual `chapter-genesis-07-opening-v1.webp` as a style-only input. No Noah identity or ark setting was copied. The new chapter scenes contain no people or recurring groups. Chapter 17 includes only distant birds; their tiny or occluded detail cannot support an anatomical claim. Stable character references, scene inputs, generated-file locations and hashes are recorded in `ezekiel-artwork-generation-2026-11-04.json`.

## Full-size review and versioned corrections

All final active WebP files were inspected at native 960×540 chapter dimensions or 1200×675 Story dimensions. Scenes use fields, canals, coast, red rock, urban ruins, still lifes and interiors; blue/green landscapes, red and purple fabric, dawn/dusk and fire vary the palette. Judgment scenes often retain dramatic cloud lighting from the style reference. New chapter scenes avoid human anatomy. Existing Story figures were reviewed for faces, visible hands, limbs and relationships, with uncertainty retained for concealed and tiny details.

Five rejected v1 chapter candidates remain inactive in source history: chapter 2's blank scroll became a visibly written scroll; chapter 7's stamped coins became unmarked silver and broken gold; chapter 41's open-legged table became a closed wooden altar; chapter 45's clear pitcher became opaque clay; chapter 48's excess gates became exactly three on the visible wall. Each v2 edit received its actual v1 plus the actual style image. These inactive candidates are excluded from the active hosted manifest and build asset lists. The earlier vision v1 is likewise retained unchanged.

## Hosting, offline architecture and integration

Artwork-only commit `3c2f998f35544abd40aed65955d541b90ce7ceca` is pushed on the dedicated branch. The hosted manifest pins that public commit and adds the 44 active chapter assets plus the vision v2, for 679 total hosted assets. The hosted-artwork validator permits Ezekiel explicitly and keeps all earlier manifest entries. The privacy-safe same-origin handler, immutable hashes, verified cache and redirect fallback are unchanged. The 45 new active files total 5,455,202 bytes; all are below the existing 250,000-byte limit.

The first direct public-origin batch encountered HTTP 502. A subsequent recorded check verified all 45 immutable public-origin images against local bytes and SHA-256. This is separate from the blocked live Site check. See `ezekiel-public-origin-verification-2026-11-04.json`.

All artwork remains in shared source, and the unchanged native build pipeline includes active images offline. The offline bundle could not be built or exercised here, so offline availability is an integration verification requirement, not a completed runtime claim. Build 341's Worker had 1,312,684 bytes of headroom. New art uses hosting rather than embedding; the new combined Worker still must be measured against the 66,060,288-byte Sites limit after integration.

Merge chapter metadata by keys and hosted assets by union; preserve other sessions' explicit illustrated-book entries and allowlist changes. The final source pin must point to a pushed public commit containing the union of every session's active assets. This branch's pin contains earlier main and Ezekiel, not later parallel assets. Re-pin after integration, then build both web and native from one source. No deployment, main push, build-number change, native install or paid API use occurred. No new credential was created. Commits use verified GitHub identity `kev-mac <2168970+kev-mac@users.noreply.github.com>` (account ID 2168970).

## Checks and remaining verification

- Source validation passed: 48 openers, 44 chapter additions, four Story openings, inline Story retained, 707 total registered chapters, useful alt text, no duplicate opening, hidden generic captions, renderer markup, immutable hosted manifest and baseline preservation. A missing Ezekiel 2 opener fails validation. Reproduce with `node research/notes/ezekiel-source-check-2026-11-04.mjs` from the repository root.
- Image-spacing analysis found no consecutive pair involving Ezekiel below five verses, including current-source book boundaries. Minimum spacing is eight verses; chapter 24 opener → Story has fourteen. Ezekiel 48 → Daniel 1 has 35. Lamentations has no current-source art, so the preceding actual image is Jeremiah 39; recheck the immediate Lamentations/Ezekiel boundary after concurrent additions.
- All 45 active new WebP files decode at exact native dimensions and meet the byte budget.
- `check:readability` exits 0 in inherited report-only mode; corpus findings remain. `node scripts/check-public-artwork.mjs` passes privacy, hashes, cache and fallback tests. `git diff --check` passes.
- `build:mobile` is blocked by missing `esbuild`. Dependencies were not installed because installation is excluded from scope. Consequently `check:images` cannot import absent `dist/server/index.js`, `check:mobile` cannot open absent `www/index.html`, and `check:release` cannot read absent `dist/asset-manifest.json`. These are unavailable checks, not passes. Exact errors are in `ezekiel-check-results-2026-11-04.json`.
- This managed environment exposes no callable `cua_repl.js`. Per Sites guidance, no substitute browser was installed and no preview server was started. Phone/iPad layouts, browser image decoding, physical devices, signed assets, offline runtime and live Site byte checks remain pending in the integration/release environment.

No automatic approval denial occurred. The HTTP 403 on the live endpoint was respected. There is no pending named-person continuity dependency; the remaining blockers concern environment/build and release verification. Stop after Ezekiel.
