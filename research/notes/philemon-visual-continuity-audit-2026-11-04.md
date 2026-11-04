# Philemon artwork review — 2026-11-04

Philemon only, reader ID 56, one chapter. Isolated worktree `/workspace/philemon`, branch `artwork/philemon-2026-11-04`, fresh canonical main `5a33980ae6e7e25ad9b0dfb345d8da52229226d9`. Read AGENTS.md, RELEASING.md, CLAUDE.md, build 344 verification, Mark–Philippians combined review, Acts/Matthew continuity audits and their inventories. Applied cloud-runtime and Sites skills. No additional checkout skill was present. This branch is an artwork handoff, not a publication or installation.

Native Sites metadata confirms public version 333. The source helper was unavailable; an authorized read-only clone used the short-lived credential through hidden stdin and process-only Git authorization. Mirror `8c9650c1d31364a2f573f1de390e085c9503b134` matches all 1,761 compared baseline production files. The initial comparison ran before cloning finished and was inconclusive; the completed comparison passed. No mirror or Site mutation occurred, and no credential was persisted in files/config.

## Coverage and visual review

Philemon 1: exactly one new opener at afterVerse 0, directly below its heading and before verse 1. No existing Story/chapter images were present. Counts: one generated, one accepted, zero retained Philemon images, zero replacements/rejections. No scripture, Story prose/placements, reader/CSS, version or build-number edits. All 1,394 baseline source image files remain byte-identical, including every approved v2 and superseded original.

`src/assets/chapter-philemon-01-opening-v1.webp` depicts the guest room requested in verse 22: modest bed, linen, blue/burgundy blanket, clay vessels and a courtyard doorway. This is imagined atmosphere from a request and hope, not evidence of an actual room, a completed visit, Paul's release, or Onesimus's emancipation. The opener introduces chapter imagery; it does not claim verse 1 describes the room. Useful imagined-scene alt text is present; generic captions stay hidden and existing small italic Story captions are unchanged.

The actual Genesis 7 image was supplied to image_gen as style-only input. No people, recurring group or animal appears. Therefore no identity inputs were required, no named person was inferred from a heading, clothing or composition, and no parallel portrait was treated as approved. Named textual references and prior inventory sources are in the continuity inventory. Paul/Saul of Tarsus remains distinct from King Saul; uncertain retained Paul art is not promoted to an identity anchor. No Jesus, Peter, Timothy, Titus or historical figure is newly portrayed.

Viewed the generated original at 1672×941, the final 960×540 WebP and an original-size side-by-side with Genesis 7. Also viewed the last active baseline Philippians opener; no new portrait comparison is involved. Inspected bed legs, stool, pottery, door, wall/roof materials, linens, vine, perspective and image corners. No visible malformed object, lettering or signature found. No anatomy or hidden detail is certified. Natural cool courtyard light, green foliage, muted blue and burgundy keep color variation. Original PNG remains under `/workspace/generated_images`; final encoding is 128,258 bytes, SHA-256 `0c6265352b09a54e3b9f30e56cde50f8d11b5b7a42e98773ab2db4f891109b89`.

## Preservation, spacing and hosting

The exact enriched build-344 production Story catalog is reconstructed and compared against the generated catalog. Baseline source/prose/mappings and assets are checked byte-for-byte. Both all-pair and adjacent spacing conventions remain unchanged: opener coordinate 0 gives 64 adjacent/65 all close pairs; coordinate 1 gives 69/70. Full endpoints/gaps are in the artwork audit JSON. No close pair touches Philemon. Titus and Hebrews have no baseline artwork; recompute after their parallel branches are integrated. Expected opener distances: Titus 3 to Philemon 1 is 15; Philemon 1 to Hebrews 1 is 25. Required openers and original Story locations were not moved to hide spacing. John 7/8 and Luke 1 inherited disclosures remain.

Immutable asset pin `840d01b7e389d208067b92180e41f7abb8225c9e` was pushed before being referenced. It contains all baseline-plus-Philemon image bytes. Actual public GitHub fetches verified all 1,016 members (131,372,218 bytes) against source bytes/SHA-256; results are in the public-origin report. Hosting adds only explicit ID 56 and the Philemon filename rule. Every baseline member, privacy guard, hash/size check, no-referrer fallback and offline file remains. No hosted image is restored to the Worker.

Integrate the whole branch/history, merge chapter metadata by key and hosted paths by set union, retain explicit coverage/hosting rules from all ten branches. This pin lacks parallel new artwork by design. Push a combined complete asset union, repin and verify actual public origins before release. Build number remains 344 here; coordinator chooses the release identity.

## Checks and limits

- Locked `npm ci --registry=https://registry.npmjs.org --cache=/tmp/philemon-npm-cache --ignore-scripts`: passed, 152 packages; manifests/lock unchanged.
- `build:mobile`: passed; shared candidate fingerprint `905eaedb0e676725338a424fdf1f0bf81fbf3169a485c15413a163a5ff952da4`, app 1.1.0/build 344.
- `check:images`: passed all 1,108 registered chapters and 276 Stories, exact source/web/native bytes, caption/placement and fail-closed coverage.
- `check:mobile`: passed actual offline worker reading/search/chat and chrome fixtures with zero network calls; not a visual browser/device test.
- `check:release`: passed identity, Worker-only contract, CSP/sync, encoding, public-source privacy/hash/length/cache/fallback fixtures.
- `check-philemon-artwork.mjs --offline`: passed all 25 verses, exact KJV/ASV/WEB values AND field presence, exactly one opener, generated web/source/offline metadata and bytes, zero network calls. Local controlled handler responses are not live/public-origin verification.
- `check:readability`: exited zero in inherited report-only mode; findings remain. New alt grade 4.82, no overlong sentence or unexplained jargon; simpler than the 6–8 collection target, not a strict corpus pass.
- `release:sites` local staging passed, Worker-only output with no static/client bypass. Worker 63,920,243 bytes against limit 66,060,288, leaving 2,140,045 bytes.
- Initial image/offline checks started before build:mobile finished and failed on missing offline files. They were rerun after the complete atomic bundle exchange and passed; no application change was needed.

Live Site verification is **denied/blocked**: ordinary proxy `curl -I https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` received CONNECT HTTP 403. Stopped without retry/bypass; immutable public GitHub checks are separate. No automatic approval-review rejection occurred.

Aggregate `npm run check` exited 1 only at its final `check-release-smoke.mjs` browser launch: missing Chromium executable `/home/agent/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. All preceding content/readability/search checks passed. Browser smoke was attempted but did not execute a browser; phone/iPad viewport QA was not run. Managed Linux has no supplied `cua_repl.js`; no preview server, browser download or substitute browser was installed/launched. Signing, signed asset parity, publication/live candidate checks, device installation/launch and physical-screen inspection remain with the coordinated release owner. Build-344 device lock blockers were not retried or claimed resolved. No main merge/push, publication, installation, release-number change, paid API/new credentials, security change or other-book work occurred.
