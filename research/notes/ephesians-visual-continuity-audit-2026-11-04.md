# Ephesians artwork handoff — 2026-11-04

Ephesians only, reader book ID 48, all six chapters. Branch `artwork/ephesians-2026-11-04` starts from freshly fetched GitHub main `6bd1f514ed876677ab0762695176dfb9d64dfa2e`. This session stops at a verified pushed feature branch for the Mark–Philippians combined release. No main merge/push, publication, installation, release/build-number change, or next book was performed.

## Source and preservation

Read AGENTS.md, RELEASING.md, CLAUDE.md, build 343 release verification, Obadiah–Matthew combined review, Matthew visual audit and continuity inventory. The checkout has no `.agents/skills` directory. Cloud runtime and Sites skill instructions were read. Environment startup completed normally. The enforced HTTP policy and supported readiness were inspected; no credential setup or security change was made.

Sites remains public, saved version 332. A fresh supported Sites credential was held in memory and passed through hidden stdin to a read-only authenticated source clone because the Sites workflow helper is not installed. No credential was written to disk or Git config. Mirror commit `57013c141639c6db19098d50708ed6201e396ee2` matches all 1,640 compared production files against starting main. Neither mirror nor live production was changed.

All 1,274 baseline source asset files remain byte-identical. All previous chapter mappings, Story images, Story prose/placements, scripture sources, reader/rendering/caption code, package manifests and lockfile remain exact. The original checkout had no edits or stashes. Build 343 and app 1.1.0 remain unchanged as branch candidate identity, not a claimed new release.

## Coverage and visual review

Six new chapter images, zero existing Ephesians Story images retained, zero existing images replaced. Each chapter has exactly one relevant opener at `afterVerse: 0`, directly below its heading and before verse 1. The actual enriched production Story catalog was checked; Ephesians has no Story placements. All six files are 960×540 WebP, 1,025,100 bytes total, individually below 250,000 bytes.

| Chapter | Scene and textual anchor |
| --- | --- |
| 1 | Unlettered papyrus, pen and seal by an open doorway; letter greeting and sealing imagery, 1:1–2,13–14. |
| 2 | Strong corner stone joining two walls; building metaphor, 2:19–22. |
| 3 | Tree rooted on a green slope below a broad sky; rooted/grounded and breadth/height imagery, 3:17–19. |
| 4 | Craft tools, finished wooden bowl and food basket; honest work and sharing, 4:28. |
| 5 | Path from cool shadow toward dawn; walking as children of light, 5:8–14. |
| 6 | Helmet, breastplate, belt, paired sandals, shield and sheathed sword; armor metaphor, 6:13–17. |

These are imagined literary/settings illustrations, not exact archaeological reconstructions, records of named people's possessions, or a claim every chapter's verse 1 depicts the scene. All new images are person-free, with no animals or identifiable recurring group; no anatomy, hidden-face identity or group-count certification is implied. The armor is a metaphorical still life without battle. No named person is inferred from a vacant room or writing implements. The letter carries no fabricated quotations. Buildings, coastline, tree and workbench are imagined.

All six original generated images were individually viewed at native size. A stray signature-like mark on the first cornerstone draft was rejected and removed with the image editing tool; the corrected result was viewed before acceptance. There were six accepted images and one additional draft repair call. Original generated files remain in `/workspace/generated_images`; no prior source image was removed. Final WebPs were compared side by side at their full 960×540 size with the actual approved Genesis 7 style image. Natural stone, wood, cloth and vegetation remain coherent; pale blue coast, green slope, lavender clouds, burgundy cloth, blue shadow/dawn and overcast armor vary color/light. No definite visible object or text contradiction was found.

Every generation call supplied the actual `src/assets/chapter-genesis-07-opening-v1.webp` as style-only visual input. The repair also supplied the actual rejected draft. No Genesis identity was reused. There is no portrait dependency on unreviewed parallel branches.

The companion continuity inventory lists 68 current-main Gospel/Acts Story candidates involving Jesus, Mary, Joseph, John the Baptist, Peter/disciples, Paul/Saul, Barnabas, Stephen and related named people. Textual mentions are clearly marked candidates, not proof a face is visible. Matthew's approved inventory and combined review were read. Three actual current-main anchors were viewed at full size: `story-the-baptism-and-temptation-of-jesus-v1.webp`, `story-calling-the-first-disciples-v1.webp`, and `story-john-the-baptist-and-the-baptism-of-jesus-v1.webp`. The requested filename with `the-calling` does not exist; the actual filename lacks `the-`. Adult Jesus has brown complexion, dark natural curls, full beard, angular nose and lean adult build; John the Baptist remains distinct. Clothes alone do not map disciples to names. No new scene depicts these people, so no new identity or aging claim is made. The superseded Matthew Transfiguration v1 is neither active nor a new reference.

Alt text retains `Imagined scene:` and describes each accepted picture. No generic caption is added. Existing small italic Story caption rules remain exact. New alt text averages FK grade 5.88 with no overlong sentences or flagged unexplained jargon; the inherited corpus readability command is report-only and still reports existing findings.

## Spacing and integration

The full canon ledger uses build 343's actual enriched production Story catalog, asserting its equality before and after. Opener coordinate 0 gives 63 adjacent / 64 all pairs below five verse positions; coordinate 1 gives 67 adjacent / 68 all. Both ledgers exactly preserve baseline pairs. No near pair touches Ephesians. Exact endpoints, source paths and gaps are recorded in `ephesians-artwork-audit-2026-11-04.json`. Internal opener gaps are 23, 22, 21, 32 and 33 positions.

Starting main has no Galatians or Philippians chapter art/Story placements. Actual preceding artwork is Acts 27:1, 1,353 positions before Ephesians 1:0; following artwork is Hebrews 8:6, 761 positions after Ephesians 6:0. These large gaps do not assume approval of parallel artwork. If the coordinated branches add chapter-start openers, Galatians 6:0 to Ephesians 1:0 is 18 positions and Ephesians 6:0 to Philippians 1:0 is 24. The coordinator must recompute actual adjacent and all near pairs, including retained/new Story placements and both boundaries, after merging all ten books.

## Public pin and packaging

Public asset commit: `2939377048d263753fc05b5ec3843044bb2a4b14`, pushed and remote-SHA verified before pinning. It contains the entire baseline plus six Ephesians files. `data/hosted-artwork.json` keeps all 900 earlier members and adds six: 906 members, 115,315,272 bytes. Every actual immutable `raw.githubusercontent.com` file matched source bytes and SHA-256 (906/906). Detailed per-file hashes are in `ephesians-public-origin-verification-2026-11-04.json`.

Only explicit Ephesians coverage ID 48 and its hosting filename/expected-set rule are added. The hosted-artwork architecture, private-header/query stripping, SHA/length validation, pinned redirect policy and offline bundles remain intact. New art is excluded from the Worker payload, retained in shared source and native assets. Worker: 64,323,298 bytes; limit 66,060,288; headroom 1,736,990. This environment's unchanged-main baseline rebuild was 64,320,028 bytes; the branch adds 3,270 Worker bytes. Published build 343's Mac measurement was 64,367,615 bytes. Recheck the combined package on its build platform.

Merge both branch commits/history, not only the final metadata commit. Union chapter mappings by key, hosted paths by set, explicit book coverage and hosting additions without dropping other branches. Push a new combined asset-union commit, repin to it, and verify every immutable origin before publication. This per-branch pin intentionally contains none of the other nine branches' new images.

## Checks and limits

Passed: locked `npm ci --registry=https://registry.npmjs.org --cache=/tmp/ephesians-npm-cache --ignore-scripts`; shared `build:mobile` (including web build and packaged retrieval/startup checks); `check:images` for 963 registered chapters and all Story art; `check:mobile`; `check:release`; source/asset/catalog preservation, single openers, alt/caption rules, spacing; immutable public-origin comparison; five-file Worker-only `release:sites` staging; `git diff --check`.

The independent actual offline engine exercised all six Ephesians chapters and all three editions: string types and exact source equality, full decorated web/native chapter equality, six source/web/native image-byte/hash matches and zero network requests. Existing empty scripture fields elsewhere are preserved; none occur in Ephesians. Evidence: `ephesians-offline-verification-2026-11-04.json`. Shared branch fingerprint is `3bd1ed3943af8a7c83d47675411069d5c7980ec78cc499f523833753f712bf8a`.

`npm run check` passed its content, annotation, readability and search checks before its final release-smoke browser fixture. That fixture failed before launching: Chromium executable `/home/agent/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell` is absent. No browser download or substitute was attempted. Phone/iPad layouts and actual browser smoke are never-run checks; no callable `cua_repl.js` is supplied. An early image check also ran before native staging completed and encountered missing `www/assets/story-the-creation-v2.webp`; after the build finished the complete image suite passed. An initial preservation-audit output buffer was too small for an existing SVG; increasing only the local audit buffer allowed exact comparison to pass. No application change was made for either check recovery.

Actual live-origin verification is blocked: the ordinary proxy request to `https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` received CONNECT HTTP 403. The denied action was stopped; there was no bypass or retry. Sites metadata/mirror checks and immutable public-origin checks passed independently and do not substitute for live image verification. No automatic approval-review rejection occurred.

Coordinated release must run combined visual/boundary review, browser phone/iPad layouts and release smoke, live/source/offline/signed comparisons, signing and both device installations/version/launch checks. They were not attempted here because this book session expressly stops at its pushed branch. No artwork coverage or identity blocker remains within Ephesians. Local build/check logs, comparison sheets and staging package are `/tmp/ephesians-*`; durable evidence is committed beside this audit.
