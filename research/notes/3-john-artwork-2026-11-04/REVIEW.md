# 3 John artwork branch review — 2026-11-04

3 John only, reader book 63, one chapter. Branch `artwork/3-john-2026-11-04` starts from fresh canonical GitHub main `5a33980ae6e7e25ad9b0dfb345d8da52229226d9`. This is an unpublished preparation branch. Stop here; the parent owns coordinated integration, publication, signing and installation. App remains 1.1.0/build 344.

Read AGENTS.md, RELEASING.md, CLAUDE.md, build 344 verification, Mark–Philippians combined review, Matthew, Acts and Philippians continuity reviews and their inventories. No checkout `.agents/skills` exists; `/workspace/.agents` is empty. The Cloud Environment runtime and Sites skills were read. Supported startup wait succeeded. Official-registry `npm ci --ignore-scripts` used `/tmp/biblelens-3-john-npm-cache` without changing dependency manifests or lockfile. No paid API, new API key, security change or Mac/device action occurred.

## Baseline and mirror

Sites reports public version 333 and source `8c9650c1d31364a2f573f1de390e085c9503b134`. The Sites source helper is absent. A fresh credential passed through hidden stdin to a read-only clone, with its authorization header held only in the child-process environment. All 1,762 compared production files match canonical starting main. Neither mirror nor production was modified. `sites-comparison.json` records the comparison. Original snapshot checkout was clean and its stashes were not changed.

All 1,394 baseline asset files remain byte-identical, including superseded versions. Every earlier chapter-art mapping and all 276 Story-art mappings remain exact. Scripture, Story prose and placements, reader/CSS, manifests, lockfile, version and build number are unchanged. Only book 63 coverage and its filename-hosting rule are extended; no unpublished sibling metadata is imported. The candidate has 1,108 registered chapters; this is not published coverage.

## Coverage and visual review

Generated/retained/replaced for 3 John: **1/0/0**. The sole chapter had no prior chapter image or Story placement. Chapter 1 receives exactly one `afterVerse: 0` opener: `src/assets/chapter-3-john-01-opening-v1.webp`, directly below its heading and before verse 1. It illustrates hospitality and support for travelers in 1:5–8 through an open doorway, bread, water and prepared linen. Objects and setting are an imagined thematic scene, not a reconstruction of Gaius's house or a claim that verse 1 lists these objects.

The generation supplied the actual `src/assets/chapter-genesis-07-opening-v1.webp` as style-only input. The original 1672×941 PNG remains at `/workspace/generated_images/exec-aab50dd0-1812-46fb-9fe7-729bd8b3381a.png`; Pillow encoded the 960×540 WebP. The original, final file and a full-size side-by-side comparison with Genesis 7 were inspected. Natural blue daylight, green hills, muted red cloth and grounded wood/stone/clay textures fit the approved style. Door, table/bench supports, loaf, plate, jug rim/handle, baskets and cloth were checked. No definite visible object defect, generated lettering or signature was found. There are no people or animals; hidden anatomy is not certified.

No recurring portrait or recognizable group is introduced. The epistle's speaker calls himself the elder; its title does not establish a visible apostle identity. Names Gaius and Demetrius do not establish that earlier Acts figures with those names are the same people. Neither an author portrait nor a clothing-based identification was invented. No image depends on unpublished 1 Peter, 2 John, Jude or any other parallel artwork. No identity references are required for this person-free scene. Published Gospel/Acts continuity findings remain as documented in the combined review: preserve Pentecost v2, Paul journey v2, Acts 23 v2, Luke 20 v2, 2 Corinthians 11 v2 and the superseded Matthew Transfiguration decision. New Covenant topical art remains Jeremiah imagery.

Alt text describes the imagined scene. Generic chapter captions remain hidden; the existing small italic Story-caption renderer is untouched. No scripture or Story prose was altered for a check. New description screening reports grade 4.96, no overlong sentences and no unexplained screened jargon. Corpus readability remains report-only, with inherited findings; this is not a strict corpus prose pass.

## Spacing and cross-batch dependencies

The source/spacing audit uses the rebuilt build-344 enriched production Story catalog and unchanged catalog transforms. All inherited pairs remain exact: opener coordinate 0 gives **64 adjacent / 65 all** pairs below five verse positions; coordinate 1 gives **69 / 70**. No close pair touches 3 John. Preserve John 7:53 → John 8 opener (gap 0/1), and Luke 1 opener → verse-5 Story (gap 5/4). No placement was moved to conceal spacing.

Current available nearest active prior image is the inherited Hebrews 8:6 New Covenant Story → 3 John 1 opener, gap 560/561. No later active image is available on this baseline. These endpoints do not certify unpublished neighboring artwork. **Recompute and visually inspect 2 John/3 John/Jude boundaries after the final-six union.** Source lengths are 13, 14 and 25 verses respectively; sibling images and metadata are absent here. There is no portrait dependency, but the coordinated reviewer must compare actual union compositions and spacing.

## Hosting, hashes and checks

Pushed immutable asset commit/pin: **`11e4d9764e5a3505269898b4228f2c8cde1b7b72`**. Its parent is canonical starting main and it contains the complete published-baseline-plus-3-John asset union. Actual `raw.githubusercontent.com` requests verified **1,016/1,016 files**, totaling **131,379,866 bytes**, against source bytes and SHA-256. Per-file results are in `public-origin.json`. New WebP: 135,906 bytes, SHA-256 `e0a7943fa470c8654c6ccb407e9f2f6baa202cdde071d83d8e21ae7c6ad9d5d6`.

Every active hosted asset remains in source and the offline native bundle. Worker privacy, origin, hash and size checks remain intact. Hosting does not embed new artwork in the Worker. Merge the branch history, union the preceding Colossians–1 Peter batch and final six branches by metadata keys and asset membership, push a complete asset-union commit, repin, and verify all immutable URLs. This branch's pin is insufficient for that combined release.

Web/mobile builds, all available nonbrowser aggregate content/search checks, image checks, mobile engine/chrome checks, release/privacy/package tests, source/spacing audit and five-file Worker-only staging passed. The independent packaged offline engine checked the sole chapter, 14 verses, exact KJV/ASV/WEB field presence and values, one opener/image and zero network calls. Controlled Worker checks separately verified exact chapter fields, new image response bytes, all 1,016 source/native hosted asset pairs and identical web/native release metadata. These fixtures do not certify live Site responses. Exact absent/empty scripture fields elsewhere remain preserved by unchanged source; no all-fields-present assumption was added.

Candidate source fingerprint: `403996b097157a7865d9bad96e5e915e4c26e52c12bf55b8abcc6c1715317169`. Worker: **63,920,251 bytes / 66,060,288**, headroom **2,140,037 bytes**. The staged five-file package has no client/static bypass. An initial aggregate content attempt reached an ENOENT while the mobile build replaced `dist`; final sequential nonbrowser checks passed without a source repair. Browser release smoke was excluded from the final command because the supported browser tool is absent. Machine results and durable logs are beside this review.

## Explicit verification limits

- **Denied:** ordinary proxy GET `https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` returned CONNECT HTTP 403. Stopped without retry or bypass. Mirror comparison and immutable-origin network checks completed independently. No candidate live parity claim is made.
- **Unrun:** browser smoke and phone/iPad layouts. Managed environment has no callable `cua_repl.js`; no preview server, unauthorized browser download or substitute control path was used.
- **Parent pending:** combined continuity review, asset union/repin, publication, signing, signed/native parity, installation and device verification. Build 344's inherited iPhone/iPad launch checks remain blocked by locks in its final report; they are not resolved here. The Mac disconnection was not bypassed or reconfigured.
- No automatic approval-review rejection occurred. No main merge/push, publication, install, build increment or another book/session was performed.
