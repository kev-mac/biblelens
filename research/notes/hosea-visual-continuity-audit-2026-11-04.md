# Hosea artwork — 2026-11-04

Scope: Hosea only, book ID 27, 14 chapters. Started clean from fetched GitHub main `846ba467f3094e065d5d3489c5bb897908f2bf79` on `artwork/hosea-2026-11-04`. Read AGENTS.md, RELEASING.md, CLAUDE.md, build 341 release audit, latest combined review, Proverbs audit and relevant Kings continuity material. No other book, release identity, scripture, Story catalog, or earlier artwork is changed. User authorization limits this session to a feature branch, without publication or device installation.

## Source comparison

Sites metadata reports public saved version 330, matching build 341's release record. Read-only mirror HEAD is `6489207c16040f17c2247db76080520fc6f422b0`. Comparison against starting canonical main finds no independent application changes. The Sites helper is not installed here; ordinary authenticated Git cloned the mirror for read-only comparison, with short-lived credential supplied through hidden stdin and kept out of files and Git config. The first unauthenticated Git read failed for missing username; authenticated clone succeeded. Neither mirror nor production was changed.

Live `https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` access was denied by the proxy with CONNECT 403. No bypass or retry was attempted. Live image bytes remain unverified in this session; the earlier build 341 audit is historical evidence, not a new live check.

## Coverage and retained art

Hosea 1 retains `src/assets/story-hosea-s-marriage-to-gomer-v1.webp` at verse 1, which counts as its opener. Full-size review shows Hosea, Gomer, two boys and one girl in a domestic meal. Their ages are illustrative: this is a composite of the chapter's three births, not a claim that all were born simultaneously. Visible faces, arms, hands and proportions were reviewed; obscured anatomy cannot be certified. The eldest boy is not assigned an exact age. No new rendering of these people is introduced.

Chapters 2–14 receive one versioned opener each at afterVerse 0. Existing reader logic puts them below the chapter heading and before verse 1. Chapter art has useful alt text beginning “Imagined scene:” and no visible generic caption. Existing Story art/captions remain. These scenes illustrate imagery within each chapter; they do not claim every opening verse literally describes the picture. Plants, architecture, tools and landscapes are imagined, not historical evidence or exact reconstructions.

## Continuity and actual tool inputs

`hosea-continuity-inventory-2026-11-04.json` inventories prior Story candidates for Hosea, Gomer, their children, kings, Jehu, Jacob, David, Moses and recurring national groups. Textual mentions are not automatically certified as visible portraits or approved identity anchors. Earlier chapter art remains available and unchanged. Hosea and Gomer's only located prior named Story image is retained as above. Other named people in the text are not portrayed in new scenes.

Every new image-generation request supplied the actual approved `src/assets/chapter-genesis-07-opening-v1.webp` as a style-only file input. It supplies no identity reference for another person. All thirteen additions omit people, identifiable groups, divine figures and animals, using text-faithful landscapes or objects. Hence no new recognizable portrayal depends on missing references or on unapproved parallel art. A future portrait scene must inventory approved earlier chapter and Story appearances, supply those actual images and check narrative ages first. No portrait is invented to fill a dependency.

Scene anchors: 2:14–15 wilderness/vineyard; 3:2 silver/barley (unmarked pieces, not later minted coins or exact quantities); 4:3 mourning land; 5:10 moved boundary stone; 6:3–4 rain and dawn; 7:4–8 oven/bread; 8:7 wind and barren stalks; 9:2 empty winepress/threshing floor; 10:8 thorn-covered altar; 11:4 yoke/fodder without literalizing Israel as a child; 12:1 oil jars without a Jacob or Exodus portrait; 13:15 dry spring/east wind; 14:5–7 lilies, olive, grain and vine.

Each final asset is reviewed at native 960×540, alongside the style reference and neighboring scenes. No human or animal anatomy is introduced. Retained Story artwork is reviewed at 1200×675. Hidden details remain uncertain. Lighting ranges from blue-green dawn and rain to red oven embers, dry land and restorative vegetation; no uniform amber treatment is imposed.

Chapter 5 net versions v1–v3 were rejected for faint signature-like corner marks. The accepted v4 uses the chapter’s moved-boundary-stone comparison instead. All three rejected files remain inactive for source-history review; they are absent from the active manifest and offline packaging. Every edit received its actual predecessor and Genesis 7 style file; v4 received Genesis 7 only, as recorded in the generation ledger.

## Hosting, offline and integration

Use existing same-origin hosted-artwork architecture, pinned immutable public GitHub assets, SHA-256 hashes and byte lengths. Extend the explicit hosted allowlist and chapter coverage registry only for Hosea ID 27. Preserve all prior manifest members. Every new image remains in shared `src/assets` for offline native packaging. Do not remove embedded Story art, change the handler's credential stripping, or introduce a new origin.

The asset commit must be pushed before pinning the manifest. When combining concurrent branches, merge chapter metadata by book/chapter keys, hosted lists by set union and explicit registry/allowlist additions. Re-pin to a pushed public commit containing every integrated asset, and verify each immutable URL before release. A branch-specific pin does not contain other branches' new files.

Build 341 used 64,747,604 of 66,060,288 Worker bytes, leaving 1,312,684. This branch uses hosting for additions to avoid embedding their full image payloads. New Worker size cannot be measured without build dependencies. The combined build must pass the Sites budget before publication and retain native offline art.

## Checks and limits

The dedicated source check verifies 14/14 single openers, source WebP format/size, alt text, hidden generic captions, reader placement, registered coverage (including missing-opener rejection), hosted manifest completeness, SHA-256 evidence and image pairs fewer than five verse positions apart. It includes current-main Daniel 12 → Hosea 1 and Hosea 14 → Joel 1 metadata. Repeat spacing after parallel integration.

`npm run check:readability` exits 0 in inherited report-only mode; pre-existing corpus findings remain. `build:mobile` stops because `esbuild` is absent. `check:mobile` passes mobile chrome behavior, then stops because `www/index.html` does not exist. Full image/Worker/offline parity checks need generated dist/www and cannot be represented as passed. No dependencies were installed.

Managed browser QA requires cua_repl.js, unavailable in this tool set. No substitute browser automation or preview server was used. Phone/iPad browser layout, decoding, physical-device appearance, signed assets, native offline operation and live images remain integration/release checks. No publication, installation, main push, merge, build-number change or paid API was performed.

## Final source validation

`node scripts/check-hosea-artwork.mjs` passed: all 14 Hosea chapters have exactly one opener, with 13 new hosted assets and the retained chapter 1 Story. No close pair involves Hosea under current-main metadata, including adjacent book boundaries. The shortest internal opener transition is Hosea 3 → 4, five verse positions. Source-format, renderer, captions, alt text, manifest completeness and missing-coverage rejection passed. Earlier corpus checks use the production Story overlays, matching build logic.

`check:images` stops on missing `dist/server/index.js`; `check:release` passes deterministic identity and native version logic, then stops on missing `dist/asset-manifest.json`. These are unavailable built-artifact checks, not successes. `check:mobile` has the limits above. Run full build/mobile/image/release checks after dependency-enabled integration.

All 991 baseline asset blobs, every earlier chapter-image entry, scripture, Story metadata, reader/CSS and package/build identity were preserved by comparison with starting main. Source additions contain 13 active WebPs totaling 1,845,016 bytes, plus three inactive rejected chapter 5 versions. The 13 immutable public URLs were retrieved successfully and exactly match source hashes. Asset pin: `162030654c8445c5fde399a5ab47f9689b8ee865`, pushed to `artwork/hosea-2026-11-04`. Public source verification is distinct from blocked live-site verification.

Git identity was verified against connected GitHub login/id and existing public history, then set locally to `kev-mac <2168970+kev-mac@users.noreply.github.com>`. No auto-review rejection occurred. Only the feature branch was pushed. No merge, main push, Site write, publication or device installation occurred. The final integration/audit commit follows the asset commit on that branch.
