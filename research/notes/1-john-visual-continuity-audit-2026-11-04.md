# 1 John artwork preparation — 2026-11-04

Reader book ID 61, all five chapters, isolated branch `artwork/1-john-2026-11-04`. Prepared from freshly fetched canonical GitHub main `5a33980ae6e7e25ad9b0dfb345d8da52229226d9`. This is an unpublished feature candidate, app 1.1.0/build 344. The session stops at a verified pushed feature branch; the parent owns combined review, merge, publication, signing and installation.

Read AGENTS.md, RELEASING.md, CLAUDE.md, build-344 release verification, Mark–Philippians combined review, Matthew/John/Acts continuity audits and relevant inventories. Neither checkout nor workspace `.agents` provided additional skills. Read cloud-runtime, its network reference, Sites and managed preview instructions. Startup completed through the supported environment wait. The enforced network policy was inspected. Locked official-registry `npm ci` used `/tmp/biblelens-1-john-npm-cache` and installed 152 packages without changing either dependency input. No paid API, new API key, security change or Mac/device action was used.

## Baseline and preservation

Native Sites metadata reports public saved version 333. The Sites source helper was absent. A fresh source credential was supplied through hidden stdin to a read-only clone, with its header only in the child process environment, never in a file, command argument or Git configuration. Mirror HEAD `8c9650c1d31364a2f573f1de390e085c9503b134` matches all 1,998 compared production Git blobs from canonical main. No independent mirror application work was found; the mirror was not modified.

All 1,394 baseline `src/assets` blobs remain exact. Every previous chapter mapping, Story image/version, scripture field, Story prose/verse placement, renderer, CSS, package manifest and lockfile is unchanged. All 276 baseline Story mappings remain. The inherited Pentecost v2, Paul first-journey v2, Acts 23 v2, Luke 20 v2, 2 Corinthians 11 v2 and Transfiguration v2 remain active. No unpublished sibling metadata or image was imported. Earlier release evidence and local stashes were not altered.

## Chapter inventory and visual review

No baseline 1 John chapter image or Story image exists. Generated/retained/replaced counts for this book are **5/0/0**. Each chapter receives one 960×540 WebP at `afterVerse: 0`, directly below its heading and before verse 1. All new alt descriptions begin `Imagined scene:`; generic chapter captions remain hidden and the original small italic Story captions remain unchanged.

| Chapter | Verses | Opener and textual theme |
| --- | --- | --- |
| 1 | 10 | `chapter-1-john-01-opening-v1.webp`: daylight across an empty shared table; fellowship and light, 1:3–7 |
| 2 | 29 | `chapter-1-john-02-opening-v1.webp`: a path from shade into daylight; walking in light, 2:8–11 |
| 3 | 24 | `chapter-1-john-03-opening-v1.webp`: bread, cloth and water ready to share; practical care, 3:17–18 |
| 4 | 21 | `chapter-1-john-04-opening-v1.webp`: an open doorway and a shared meal; welcome as an imagined expression of mutual love, 4:7–12, 20–21 |
| 5 | 21 | `chapter-1-john-05-opening-v1.webp`: blank scroll and lamp at dusk; reflection and prayer, 5:13–15, 21 |

These are chapter-level literary motifs, not claims that verse 1 names these objects or that the letter records these exact rooms/events. The buildings, food, plants and landscape are imagined, not archaeological evidence. Hospitality is an illustrative expression of mutual love, not an attributed historical meal. No inscription or invented quotation is visible; the scroll remains blank. Chapter 5 does not turn the textual three witnesses into invented figures or claim to settle edition differences.

Every image_gen call received the actual `src/assets/chapter-genesis-07-opening-v1.webp` file as **style-only** input. The provenance JSON records every exact prompt/input, original PNG path/hash, output hash/bytes and the Pillow WebP encoding. Original PNGs remain in `/workspace/generated_images`. Viewed all five original PNGs and final WebPs at original resolution, plus five 1920×540 side-by-side comparisons with the actual 960×540 style reference. Compared neighboring images as well: shared-room and courtyard-meal compositions are distinct, provisions are a separate close view, the path is a landscape, and the final alcove is blue/violet dusk. Greens, blues, red cloth, purple cloth and localized lamplight vary the palette. Stone, wood, basket weaving, vessel handles, bread, door hinges and lamp/flame were checked. No definite lettering, object or setting defect was found.

There are no people, hands, animals or identifiable recurring groups in the new art. No hidden anatomy or distant face is certified. There is no new named-person identity or age claim. The continuity inventory lists published-main earlier Gospel/Acts candidates and marks them unused; neither the title 1 John nor textual mentions prove a visible author identity. No unpublished 1 Peter, 2 Peter, 2 John or Revelation image was used as a portrait reference. New Covenant imagery remains topical Jeremiah where inherited; no Jesus portrait is inferred from it.

## Hosting, spacing and offline verification

The five new files total 658,212 bytes. Immutable asset pin `698309b1cddd4b11e254ea5ee1f40174ee9945a1` was pushed before the manifest referenced it and contains the complete published-baseline-plus-1-John source asset union. The manifest preserves all 1,015 inherited hosted members and adds five, for 1,020. Hosting rules add only explicit 1 John membership. Actual public-origin network verification matched all **1,020 files / 131,902,172 bytes** against source bytes and SHA-256. This is separate from controlled local handler fixtures and live Site verification.

The audit uses the actual rebuilt build-344 enriched Story catalog and preserves all inherited near pairs. Opener coordinate 0: **64 adjacent / 65 all**; opener coordinate 1: **69 / 70**. No new pair is closer than five verse positions. John 7:53 → John 8 opener remains gap 0/1 and Luke 1 opener → verse-5 Story remains gap 5/4; required openers and original Stories were not moved. The current available predecessor artwork before 1 John is Philippians 4, separated by unillustrated books; the machine ledger records that actual boundary without pretending it is a 2 Peter boundary.

**Pending union dependencies:** 2 Peter 3 → 1 John 1 and 1 John 5 → 2 John 1 must be checked when their branches are integrated. Colossians–1 Peter remains unpublished and absent here. The combined previous-ten/final-six reviewer must union chapter metadata by key, preserve every hosted asset/version and explicit book member, push a complete combined asset-union commit and repin before rebuilding. Do not select this branch's whole manifest over sibling additions. There is no portrait dependency on another branch.

Actual packaged offline engine checks passed all **5 chapters / 105 verses / 5 images** with **zero network calls**, exact KJV/ASV/WEB field presence and values, and source/web/offline image parity. Whole `data/chapters.json` remains byte-identical to baseline, preserving empty strings and absent Romans 16:26–27 WEB fields without requiring fields to exist. Whole active-image parity passed **1,316 files / 165,806,026 bytes** across shared source, packaged web handler under controlled origin fixtures and native `www`.

## Check outcomes and limits

- `build:mobile`, `check:images` (1,112 explicitly registered chapters), `check:mobile`, `check:release`, Worker-only `release:sites` packaging, book source/coverage/spacing audit, actual offline check, public-origin check, full active-image parity and `git diff --check` passed.
- `npm run check` passed its non-browser content/search components and report-only readability, then failed at the browser release-smoke step because Chromium headless-shell is absent at `/home/agent/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. Browser smoke did not run. The full aggregate command is not a pass.
- Corpus readability retains inherited report-only findings. New descriptions separately average grade **6.12**, with no overlong sentences or flagged unexplained jargon.
- Web/native release fingerprint is `67d511445906474226d9c0854d04754576bbb1c4ed5de1205496f5f65977bd59`. Final compressed Worker is **63,922,416 bytes**, below 66,060,288 by **2,137,872 bytes**. Worker-only staging is `/tmp/1-john-sites-dist`, with no client/static bypass.
- Live `HEAD https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` was **denied** at proxy CONNECT with HTTP 403. No retry or bypass followed. Native Sites metadata and mirror comparison passed but do not certify live bytes.
- Managed preview flag is set, but no callable `cua_repl.js` was supplied. Per the Sites instructions, no alternate browser, download or preview server was improvised. Phone/iPad rendered layouts remain unrun. No automatic approval-review rejection occurred and no approval is pending.
- Publication, candidate live parity, signing, signed-bundle comparison, physical device install/version/launch and physical-screen checks remain with the parent. Build 344's earlier launch checks remain blocked by device locks; this session did not resolve or retry them. No main merge/push, release increment, publication, installation or next-book session was performed.

Durable evidence uses the prefix `research/notes/1-john-`: continuity inventory, generation provenance, Sites comparison, artwork audit script/JSON, alt readability, offline script/JSON, public-origin hashes and source/web/offline parity script/JSON. Local command logs and comparison sheets are `/tmp/1-john-*`; they are temporary. The verified final pushed HEAD is reported separately to avoid a self-referential commit hash.
