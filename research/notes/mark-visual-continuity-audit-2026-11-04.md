# Mark artwork audit — 2026-11-04

Mark only, reader ID 40, all 16 chapters. Dedicated branch `artwork/mark-2026-11-04` starts from freshly fetched canonical main `6bd1f514ed876677ab0762695176dfb9d64dfa2e` (completed build 343). This delegated session stops at a verified pushed feature branch. Combined integration owns publication and installation. No next book was started.

Read AGENTS.md, RELEASING.md, CLAUDE.md, build 343 verification, Obadiah–Matthew combined review and machine source/spacing ledger, Matthew audit and continuity inventory. No checkout or workspace `.agents/skills` files were present. Applied cloud environment runtime and Sites instructions. Supported environment wait completed successfully. Network policy is enforced and restricted; no VPN is configured.

## Canonical source and mirror

Existing checkout `/workspace/biblelens` was clean, at build 342 before fetch, with no stashes. Fresh origin/main matched the supplied build 343 SHA. A dedicated branch was created from that fresh state; no main write, reset, stash deletion or force push occurred. All 1,274 baseline `src/assets` blobs remain exactly equal to main. Earlier chapter image mappings, all Story metadata, scripture, Story prose, package/lockfiles, renderer/CSS and build number remain unchanged. App version remains 1.1.0/build 343; this is a branch candidate, not a release.

Sites reports public audience and version 332. Its current source mirror is `57013c141639c6db19098d50708ed6201e396ee2`; all 1,638 compared production files match fresh main. No independent mirror production work was found. The Sites helper was absent, so the approved Git remote was cloned read-only with a fresh source credential passed through hidden stdin. The authorization header existed only in the child process environment, not arguments, files or Git config. No mirror commit or publication occurred. The clone remains under `/tmp/mark-sites-mirror`.

## Full coverage and original placements

Nine new chapter images plus seven retained Story openers provide exactly one opener below the chapter heading and before verse 1. All twelve existing Mark Stories retain their original image, prose and verse location: 21 total placements. No Story was replaced. All nine new images are versioned v1 WebPs, 960×540, total 1,349,454 bytes. Retained Stories are 1200×675. One initial Mark 2 empty-house draft was not activated because Mark 2 already has a suitable verse-1 Story; it remains outside the repository under generated_images. Thus ten generation calls produced nine accepted additions and one unused draft.

| Chapter | Opening image and textual role | Other retained Story placement |
| --- | --- | --- |
| 1 | Existing baptism Story, verse 1 | Calling/healing, verse 14 |
| 2 | Existing paralytic Story, verse 1 | — |
| 3 | Empty synagogue, 3:1–6 | — |
| 4 | Existing teaching-from-boat Story, verse 1 | — |
| 5 | Existing Jairus/girl Story, verse 1 | — |
| 6 | Sandals and staff, 6:7–9 | Feeding, verse 30 |
| 7 | Jar, basin and bread, 7:1–5 | — |
| 8 | Seven loaves and a few fish, 8:5–8 | Confession, verse 27 |
| 9 | Bright mountain cloud, 9:7 | — |
| 10 | Jordan valley path, 10:1 | Bartimaeus, verse 46 |
| 11 | Existing temple Story, verse 1 | — |
| 12 | Vineyard, watchtower and winepress, 12:1 | — |
| 13 | Tender fig leaves, 13:28 | — |
| 14 | Existing supper Story, verse 1 | Courtyard/Peter Story, verse 53 |
| 15 | Closed garden tomb, 15:46 | — |
| 16 | Existing empty-tomb Story, verse 1 | — |

Chapter motifs introduce the chapter, not necessarily its first verse. Landscapes and architecture are imagined rather than exact reconstructions. The folded spare linen beside the closed tomb is an atmospheric object, not a claim that Jesus' burial linen was removed before resurrection. Seven loaves were individually counted in chapter 8. The three fish have coherent visible heads, eyes, fins and tails. No people or recognizable recurring groups appear in new images. Generic chapter captions remain hidden; existing small italic imagined-Story captions and alt text remain. New alt text starts `Imagined scene:`.

## Full-size visual and continuity review

All twelve actual Mark Story files and all nine generated originals were viewed at native resolution, with full-size side-by-side pairs for baptism, confession, supper, courtyard and the approved Matthew baptism. Mark's two explicitly titled Peter scenes were also compared side by side. Actual Matthew calling, prayer, trial and final commission images were inspected. Source paths and stable traits are recorded in `mark-continuity-inventory-2026-11-04.json`, which retains the earlier Matthew appearance inventory. Temporary comparison panels are under `/tmp/mark-pair-*.png` and `/tmp/mark-peter-pair.png`.

Jesus retains brown complexion, natural dark curls, full beard, angular nose and lean adult build across ministry and passion. John the Baptist remains an adult with natural dark curls, beard and brown complexion across the parallel baptisms, not an aged apostle John. Peter's explicitly titled confession/courtyard scenes have compatible brown complexion, dark natural curls, full beard and sturdy adult build. Named disciples are not assigned to every unnamed face by clothing. The supper's occluded attendees and the commission's partly hidden figures are not certified exact counts. The girl in the Jairus Story is a child, compatible with the twelve-year-old narrative; exact portrait age cannot be measured. Visible hands, grips, limbs and face relationships in retained Stories were checked; hidden anatomy is not certified. The temple sheep and birds show no definite visible anatomical error.

Mary/Joseph birth imagery remains distinct from ministry time and from Mary Magdalene. The tomb women are not securely assigned face-by-face names; no new identifiable woman was introduced. Paul/Saul, Barnabas and Stephen have no Mark depiction or new asset here; unrelated names and later Acts chronology are not conflated. No accepted scene depends on parallel Luke, John or Acts art. The suggested path `story-the-calling-of-the-first-disciples-v1.webp` does not exist; the actual approved Matthew asset is `story-calling-the-first-disciples-v1.webp`.

Mark's existing confession image depicts Jesus/Peter on a path rather than uncertain Moses/Elijah portraits. New Mark 9 shows a bright cloud without people, maintaining the approved Matthew approach. Superseded Matthew Transfiguration v1 was not activated or used as a reference.

Every new generation supplied the actual `src/assets/chapter-genesis-07-opening-v1.webp` as a style-only visual input. No new named-person portrayal required an identity image input. Greens, blues, purple grapes, cool stone shade, diffuse clouds and rose-purple dusk vary the palette. Believable materials, natural light and restrained illustration remain. Original-resolution review found no definite visible text contradiction, identity break or anatomy fault in accepted images. The actual approved portraits remain the identity anchors, not Genesis people or clothing.

## Spacing and exact scripture

`check-mark-artwork.mjs` obtains the actual enriched production Story headings from the built handler for all 1,189 chapters. It compares identical Story metadata and all baseline scripture, and checks every adjacent pair and every pair less than five verse positions apart. At opener coordinate 0, baseline/current are 63 adjacent and 64 all near pairs; at coordinate 1 they are 67 adjacent and 68 all. Every inherited near pair is preserved exactly; none touches Mark. Full actual locations and gaps are in `mark-artwork-audit-2026-11-04.json`.

Matthew 28:1 to Mark 1:1 is 20 positions. Mark 16:1 to current-main Luke 1:5 is 24 positions, both conventions. The combined release must recompute these boundaries against Luke's accepted opener and the entire union, and compare recurring Gospel people across all accepted branches. No unreviewed parallel image is presumed approved.

All 16 Mark chapters were exercised through the actual offline device worker with zero network requests. All 21 placements match source and local web fixtures byte-for-byte. All KJV/ASV/WEB verse fields are strings and exactly equal source. Five inherited empty ASV strings remain: Mark 7:16, 9:44, 9:46, 11:26, 15:28. Nothing was edited to fill blanks or make an assertion pass. Source and offline metadata match.

## Hosted assets and checks

The immutable asset-union commit is `cffbb1e13661182232f5d516026a5b651ed515b9`, pushed before pinning. It contains all 900 baseline hosted members plus nine Mark files. `data/hosted-artwork.json` pins that exact commit. All 909 actual immutable raw GitHub URLs were fetched and matched exact source bytes and SHA-256 hashes: 115,639,626 total bytes. See `mark-public-origin-verification-2026-11-04.json` for every path/hash/size. No baseline manifest member was dropped. The hosted filename rule and explicit coverage extend only through Mark. Privacy, origin, hash, size and cache checks remain unchanged; every active asset remains in source and native offline bundles. Artwork was not restored into the Worker.

Passed:

- Locked `npm ci --registry=https://registry.npmjs.org --cache=/tmp/biblelens-mark-npm-cache --ignore-scripts`, 152 packages; manifests/lock unchanged.
- `npm run build:mobile`, including the build's content, chat/retrieval, vocabulary and startup checks; shared source hash `a0533e36f5ae0935c9ca6869d89ee44573b46e5d39d4a893e58e411d18c95131`.
- `npm run check:images`: 973 registered chapters, all Story imagery, placement/captions, exact scripture and source/web/native image parity.
- `npm run check:mobile`: mobile chrome and actual offline worker reading/search/chat with zero network.
- `npm run check:release`: release identity, Worker-only packaging/CSP/sync guards, encoding and public-art privacy/hash/cache fixtures.
- `node scripts/check-mark-artwork.mjs`: all 16 Mark chapters, all 21 placements, all three editions, preserved baseline metadata and reconciled spacing.
- `npm run check:readability` exited zero in inherited report-only mode; existing corpus findings remain. Nine new descriptions average grade 7.15, with no overlong sentence or unexplained jargon (`mark-readability-2026-11-04.json`).
- Actual immutable-origin verification: 909/909 hashes and bytes passed, distinct from local fixtures.
- `npm run release:sites -- /tmp/mark-sites-stage/dist`: five-file Worker-only package; no client/static bypass. Worker 64,324,753 bytes against 66,060,288, leaving 1,735,535 bytes.
- Baseline source assets/mappings/prose/scripture preserved; `git diff --check` passed.

The first feature push failed with remote unpack/index-pack temporary pack-file errors. Read-only remote lookup established that the branch was absent; the ordinary retry succeeded, and exact remote SHA verification followed. This was a recovered infrastructure failure, not an approval or policy denial. Commit identity is scoped to `kev-mac <2168970+kev-mac@users.noreply.github.com>`.

Not run: managed browser smoke, phone/iPad layouts, signed iOS comparisons and device installation/launch. `SITES_MANAGED_LINUX_CONTAINER=1`, but no callable supported `cua_repl.js` browser tool was supplied; the Sites skill requires skipping browser QA in that case. No substitute browser was installed or improvised. Signing, device access, build increment and live candidate verification belong to the coordinated release.

Live access is blocked: the ordinary inherited-proxy HEAD request to `https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` returned CONNECT HTTP 403. That denied target was stopped without bypass or repeat; actual raw GitHub checks are not live Site verification. No automatic approval-review rejection occurred. No paid API credentials or security configuration was changed.

## Integration handoff

Integrate the asset commit and final metadata/evidence commit together. Union chapter mappings by key and hosted manifest members by set, retaining every baseline member and other accepted book additions. Mark does not modify Story mappings. Extend explicit book and filename coverage without dropping parallel additions. Create and push a new combined asset-union commit, repin it, then verify every immutable public asset. This branch pin intentionally contains baseline plus Mark only. Rebuild web/native from the same combined source; repeat content, image, spacing, continuity, packaging, actual browser layouts, live, signed and device checks. Choose the release/build increment in that coordinated session. There are no pending Mark artwork identity dependencies; browser/live/device verification remains explicitly outstanding there. This session stops after Mark and does not publish, install, merge/push main or begin another book.
