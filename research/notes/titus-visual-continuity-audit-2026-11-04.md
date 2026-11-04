# Titus artwork audit — 2026-11-04

Titus only, reader ID 55, all three chapters. Dedicated branch `artwork/titus-2026-11-04` starts from freshly fetched canonical GitHub main `5a33980ae6e7e25ad9b0dfb345d8da52229226d9`. Read AGENTS.md, RELEASING.md, CLAUDE.md, build 344 release verification, Mark–Philippians combined review, Acts and Matthew visual audits and continuity inventories. Applied Cloud Environment and Sites skills. No additional checkout skill exists. Stop at the verified pushed feature branch: integration, publication, signing and installation belong to the coordinator.

## Baseline and preservation

Fresh Sites metadata reports public version 333. The supported source helper is absent from this managed environment; a read-only Git clone used its fresh authorized credential over hidden stdin and a process-only Git authorization header. No credential was saved in a file, repository config or source. Sites mirror HEAD `8c9650c1d31364a2f573f1de390e085c9503b134` matches all 1,760 compared production files from current canonical main. No independent source advance was found. Neither mirror nor Site was modified.

All 1,394 baseline src/assets files remain byte-identical. All 1,015 earlier hosted members, existing approved versions and chapter mappings remain. Scripture, Story prose and placements, renderer/CSS, package and lock files are unchanged. App remains 1.1.0/build 344, as required for a feature candidate. No stashes were applied, removed or created. Saved environment checkout was clean and outdated; work begins on a new branch from fetched main rather than its snapshot.

## Coverage, visual review and continuity

No Titus Story record/image or chapter image existed in the current baseline. Generated three images, accepted three, retained zero existing Titus images, replaced zero. Every chapter has exactly one opener after its heading and before verse 1. New source paths are `src/assets/chapter-titus-01-opening-v1.webp`, `chapter-titus-02-opening-v1.webp`, and `chapter-titus-03-opening-v1.webp`. Each is 960×540 and under 250,000 bytes; combined size 460,588 bytes.

- Titus 1: Cretan coastal homes and olive-covered slopes (1:5), introducing the setting without an exact town identification.
- Titus 2: an empty teaching courtyard with stools, unlettered scroll and lamp (2:1–8), an imagined teaching motif rather than evidence of a particular historical gathering.
- Titus 3: a basket, water flask and travel bundle beside a road (3:13–14), illustrating provision for journeys and necessary needs.

All actual generated originals were inspected at their original 1672×941 resolution, individually and in side-by-side original-resolution canvases with the actual Genesis 7 style reference. The final WebPs retain the compositions. Original files remain in /workspace/generated_images; exact prompts, original paths, actual tool inputs, output sizes and SHA-256 values are in titus-generation-ledger-2026-11-04.json. The actual `src/assets/chapter-genesis-07-opening-v1.webp` was supplied to image_gen for every scene strictly as style input. Natural blue/green coast, cool courtyard shade, purple textile and muted red travel cloth vary the palette. Materials and objects are coherent, with no visible invented lettering/signature or definite scene contradiction. No humans or animals appear, so no faces, hands, anatomy or hidden counts are certified.

The Titus inventory and prior Acts/Matthew inventories distinguish textual mentions, topical art and visible identities. Names, the epistle heading and a cross-reference do not prove a portrait or settle authorship. No identifiable recurring person/group is added and no uncertain parallel portrait is used or approved. No new identity-image input is needed. Paul/Saul is not King Saul; apostle John is not John the Baptist. Retained Paul scenes remain conditional rather than blanket future anchors. Jesus's established brown complexion, natural dark curls, beard, angular nose and lean adult build, and Peter/Paul chronology, remain governed by the build 344 combined review. No parallel account is used to invent decades of aging. Luke 22:20 topical Jeremiah is not promoted to a Jesus reference. Active Pentecost v2, first-journey v2, Acts 23 v2, Luke 20 v2, repaired 2 Corinthians 11 v2 and Transfiguration v2 remain unchanged. No new portrayal depends on unresolved identities, and no prior coverage is erased.

Generic chapter captions stay hidden, useful imagined-scene alt text remains, and small italic Story captions are preserved. Scripture or Story prose was not rewritten for a check.

## Spacing

The exact enriched build 344 Story catalog hash remains `a8a3ea748eb42b3fe5e2cce3d38504108dafa1704fa3517fbfed76c7448264b5`. Full-canon endpoint/gap ledgers preserve every baseline pair: opener coordinate 0 has 64 adjacent / 65 all close pairs; coordinate 1 has 69 adjacent / 70 all. No new pair below five verse positions. Titus opener gaps are 16 and 15 under both conventions. Current main has no 2 Timothy or Philemon artwork, so no actual neighboring boundary image is invented; the ledger records the Titus events and the coordinator must recompute boundaries after merging those parallel branches. Required John 7:53→John 8 opener (gap 0/1) and Luke 1 opener→verse-5 Story (gap 5/4) disclosures remain. No placement or scripture was moved to hide spacing.

## Immutable hosting and integration

Asset commit/pin `fcd68480723c3f4dcdf862b47f5a83b05268fc37` was pushed successfully before the manifest referenced it. It contains the full baseline-plus-Titus union. All 1,018 members were fetched from their actual immutable raw.githubusercontent.com public URLs and matched source bytes and SHA-256: 131,704,548 bytes. Per-file URLs/hashes/results are in titus-public-origin-verification-2026-11-04.json. All earlier members remain; only three Titus assets, explicit coverage ID 55 and its necessary filename/hosting rule are added. Public-source restriction, privacy/header stripping, immutable pin, hash/length checks, no-referrer fallback and native offline architecture remain intact. No artwork was embedded back into the Worker.

Merge the entire feature history, including its asset commit. Merge chapter metadata by key, explicit coverage by book ID and hosted asset lists by set union. This branch pin intentionally has no parallel new art. The coordinated release must push its complete ten-book asset union, repin to that commit, verify actual public origins, then rebuild web/native and recheck boundaries. Do not replace concurrent metadata wholesale.

## Checks and exact limits

Durable command logs are in titus-checks-2026-11-04/. Machine coverage and complete spacing ledger: titus-artwork-verification-2026-11-04.json. Preservation, Sites comparison, readability, generation and origin evidence use the same Titus/date naming.

- Locked official-registry `npm ci --ignore-scripts --registry=https://registry.npmjs.org --cache=/tmp/titus-npm-cache` passed: 152 packages; no dependency manifest/lock change.
- Final `npm run build:mobile` passed, building shared web/native. Identity: 1.1.0/build 344, fingerprint `fe4a753dd772507a51fe07f62e5749f51b6a6cbc8906a21a2abc04efba409631`.
- Final `npm run check:images` passed: all 1,110 registered chapters, all 276 Story images, unchanged scripture/placement, captions, coverage guards and exact packaged image bytes.
- `node scripts/check-titus-artwork.mjs` passed after final build: all three chapters, 46 verses, exactly one opener each, exact KJV/ASV/WEB values AND field presence, source/web/offline image bytes, actual packaged offline engine with zero network calls, unchanged earlier mappings/prose and full-canon spacing. Baseline source equality also preserves all inherited missing and blank fields, including absent Romans 16:26–27 WEB.
- `npm run check:mobile` passed mobile chrome fixtures and actual worker reading/comparison/chat zero-network checks. This is not visual browser or native inference/device validation.
- `npm run check:release` passed identity/drift, Worker-only contract, CSP/sync controls, encoding and public-image privacy/hash fixtures. Local controlled fixtures are not live-origin checks.
- `npm run check:readability` exited zero in inherited report-only mode, with existing findings. New alt descriptions independently average grade 6.20, zero overlong sentences or flagged unexplained jargon. No strict corpus pass is claimed.
- `npm run check` failed only at final browser smoke launch: missing Chromium executable `/home/agent/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. Preceding content, annotation, reference, search/vocabulary and workspace checks passed; search useful-hit threshold was 50/50. Browser smoke itself did not run.
- `npm run release:sites -- /tmp/titus-sites-stage/dist` passed local Worker-only staging. Worker 63,921,315 bytes against 66,060,288 leaves 2,138,973 bytes. No static/client bypass. No candidate was saved or published.
- `git diff --check` passed. Final branch remote head is verified after push using the privacy-safe kev-mac author/committer identity scoped to commands.

Live access is **denied/blocked**: normal proxy HEAD request to `https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` received CONNECT HTTP 403. The known-denied operation was stopped without retry or bypass. Public GitHub checks above are independent and do not certify the live Site. No automatic approval-review rejection occurred.

Browser/phone/iPad viewport review is **not run**: no supported cua_repl.js was supplied and Chromium is absent. No browser was installed, download policy bypass attempted, or replacement control path improvised. The aggregate smoke command encountered the missing browser launcher, and supplies no visual result. Full browser smoke/layouts, actual live candidate parity, signing, signed-native comparison, physical-device install/launch and physical screen inspection remain with the coordinated release. Build 344's existing iPhone/iPad locked-launch blockers were not retried or claimed passed. This session did not merge/push main, publish/install, change release numbers or start another book.
