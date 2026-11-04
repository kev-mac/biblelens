# 2 Peter artwork candidate — 2026-11-04

Scope: 2 Peter only, reader book ID 60, three chapters. Branch `artwork/2-peter-2026-11-04` starts from freshly fetched canonical main `5a33980ae6e7e25ad9b0dfb345d8da52229226d9`. This is cloud preparation for the coordinated release, not publication. App version/build remain 1.1.0/344. No main merge/push, signing, publication, installation, device access, Mac configuration, paid API, credential creation, or next book was attempted.

Read AGENTS.md, RELEASING.md, CLAUDE.md, build-344-release-verification, mark-philippians-combined-review, and relevant Matthew/Acts continuity audits and inventories. Checkout `.agents/skills` is absent. Applied the cloud runtime and Sites skills. The managed environment reached running/connected with enforced package-manager network policy and no configured secrets or outbound identities. The required reference file exists and was inspected. Locked dependencies were restored with the documented official-registry `npm ci --registry=https://registry.npmjs.org --cache=/tmp/biblelens-2peter-npm-cache --ignore-scripts`; manifests and lockfile are unchanged.

## Baseline and preservation

Sites remains public at saved version 333. Its freshly opened, read-only mirror HEAD is `8c9650c1d31364a2f573f1de390e085c9503b134`. All 1,762 compared production files match canonical baseline bytes; no independent mirror work was found. The installed Sites helper is absent, so ordinary authenticated Git used a fresh supported source credential through hidden stdin and a child-only authorization environment. No token was saved to disk or Git config. Production and mirror were not changed. Candidate live verification is pending; the Site origin is outside this environment's enforced destination list and was not accessed by a substitute route.

An isolated `/workspace/biblelens-2-peter` worktree preserves the saved checkout, stashes, and concurrent work. All 1,394 baseline asset files remain identical. Baseline chapter mappings, all Story mappings/prose/verse placements, scripture, renderer/CSS, package versions and lockfile remain unchanged. Exact edition field presence/values are preserved, including existing blanks and absent Romans WEB fields; no scripture field assumptions were tightened. Only 2 Peter metadata, explicit book coverage and necessary hosting rules were extended.

## Coverage and full-size visual review

The actual rebuilt, enriched build-344 Story catalog has no images/placements in 2 Peter (also none in the adjoining 1 Peter/1 John books). There were no pre-existing 2 Peter chapter images. Generated three, retained zero existing book images, replaced zero. Exactly one relevant opener is mapped at afterVerse 0 directly below each chapter heading and before verse 1:

| Chapter | Verses | Image and textual anchor |
| --- | ---: | --- |
| 2 Peter 1 | 21 | Clay lamp in a dark cave, dawn and morning star; 1:19 |
| 2 Peter 2 | 22 | Dry spring beneath clouds; the empty-spring metaphor at 2:17 |
| 2 Peter 3 | 18 | Green hills and clear stream beneath fresh sky; literary evocation of 3:13's promise |

Every generation supplied actual `src/assets/chapter-genesis-07-opening-v1.webp` as style-only input to the built-in image_gen tool. Original PNGs (1672×941) remain in `/workspace/generated_images`; Pillow encoded the final 960×540 WebPs at quality 85. Tool input paths, original output paths and final SHA-256/lengths are in `2-peter-generation-ledger-2026-11-04.json`.

Inspected all three original outputs at full size and their final assets, comparing with the actual Genesis style reference and nearby chapter images. Grounded blue dawn, grey/green overcast scenery and bright blue/green renewal vary the palette. The lamp has a coherent wick/flame and handle, the basin is dry, and stream banks and terrain are coherent. No visible lettering, signatures, malformed objects, people, animals or explicitly numbered symbolic objects were found. Human anatomy and invisible objects are not being certified. Natural illustrative finish and believable materials match the style target. These are imagined literary images, not archaeological photographs, predictions or proof.

No new recognizable recurring person or group is portrayed. Peter's title does not establish a portrait; no portrait anchor is inferred from titles, clothes or mentions. Earlier Gospel/Acts continuity findings were read: do not reactivate Matthew Transfiguration v1, Pentecost v1 or first-journey v1; retained Acts Paul scenes are not unconditional anchors. No image depends on unpublished 1 Peter or any parallel book. No Peter, Jesus, Moses, Noah, Paul, Lot, Balaam or angel identity is introduced. The Genesis reference supplies no identity for this book.

Useful imagined-scene alt text remains; generic chapter captions stay hidden and existing small italic Story captions stay unchanged. New descriptions screen at mean grade 4.28, with no overlong sentences or flagged unexplained jargon. Full-corpus readability remains report-only, with inherited findings; it is not a strict corpus pass.

## Spacing and integration dependencies

Both documented coordinates and pair conventions reconcile exactly: opener coordinate 0 has 64 adjacent/65 all near pairs; coordinate 1 has 69/70. Every baseline pair remains unchanged, with no new close pair touching 2 Peter. Retain John 7:53 → John 8 opener (gap 0/1) and Luke 1 opener → verse-5 Story (gap 5/4). Nothing was moved to hide spacing.

The available main baseline has no 1 Peter or 1 John chapter artwork. The nearest available previous image is the inherited New Covenant Story at Hebrews 8:6 (Jeremiah imagery, not Jesus), 381/382 positions before 2 Peter 1's opener. This is an available-baseline measurement, not approval of unpublished boundaries. The combined reviewer must recompute **1 Peter 5 → 2 Peter 1** and **2 Peter 3 → 1 John 1**, and inspect full-size neighboring images after merging the prior ten-book and final-six unions. Current 1,110 registered chapters mean published-baseline coverage plus this book; the unpublished 49-chapter batch and sibling art are not counted as published or imported.

Asset commit and public pin: `96aee74bdf097e37562a01f4f57d63323f928cc4`, pushed before repinning metadata. This commit contains the complete baseline-plus-2-Peter asset union. All 1,018 actual immutable public-origin downloads match source lengths and SHA-256, separate from controlled Worker fixtures. Integrate this branch's complete history; merge metadata by key, coverage/hosting additions explicitly and hosted paths by set union. Push a complete combined asset-union commit and repin before any coordinated release. This per-book pin lacks the other unpublished books.

## Checks and remaining limits

- `build:mobile` passed, building shared web and offline native output. Candidate source fingerprint `3b450ec4049c1061ce3c650ad1bcc829cbb8dab12fe8fa1f78f27d70b880de71`; build stays 344 and does not identify a new installed release.
- `check:images`, `check:mobile`, `check:release`, source/coverage/spacing audit, exact offline-engine audit and Worker-only packaging passed. `git diff --check` passed.
- Actual offline engine passed all three chapters, 61 verses and three placements with zero network calls, matching source and web KJV/ASV/WEB field presence and values exactly.
- All 1,314 active source/native images match. All 296 inline web assets match local bytes; 1,018 hosted assets match actual public-origin bytes and the checked Worker fixtures. Privacy, cookie/header stripping, immutable hash checks and offline architecture remain intact.
- Worker is 63,921,308 bytes / 66,060,288, leaving 2,138,980 bytes. `release:sites` staged only five files under `server` and `.openai` in `/tmp/2peter-sites-stage/dist`; it did not publish or modify the Site.
- Aggregate `npm run check` completed the content, report-only readability and non-browser search checks, then exited 1 at `scripts/check-release-smoke.mjs:31` because Playwright's expected `chromium_headless_shell-1248` executable is missing. This is a failed aggregate command, not a full pass. No download was attempted.
- Managed Linux has a system Chromium executable but no callable `cua_repl.js`; Sites instructions require skipping browser QA in that case. No substitute browser-control route or preview server was used. Browser smoke and phone/iPad layout checks remain pending in the coordinator's supported environment.
- Publication, candidate live parity, signing, physical device installation and launch verification are intentionally left to the parent. Build 344's previously reported device launches remain locked/pending; this session did not resolve them.

Machine evidence: `2-peter-artwork-audit-2026-11-04.json`, `2-peter-offline-verification-2026-11-04.json`, `2-peter-asset-parity-2026-11-04.json`, `2-peter-public-origin-verification-2026-11-04.json`, `2-peter-check-results-2026-11-04.json`, `2-peter-alt-readability-2026-11-04.json`, `2-peter-sites-comparison-2026-11-04.json`. Temporary logs are `/tmp/2peter-*.log`. No terminal infrastructure failure or denied mutation occurred. Stop at the verified feature branch.
