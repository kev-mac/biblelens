# Proverbs chapter artwork — 2026-11-04

Scope: Proverbs only, book ID 19, 31 chapters. Feature work begins at canonical GitHub main `c90aa0d01679116bef5c921ed4a991e95478f2b3`, which records the build 340 release. Read AGENTS.md, RELEASING.md, the Joshua continuity audit, the Ruth/Samuel combined review and build 340 release audit. Existing checkout and all earlier books remain preserved. No build-number change, merge, main push, publication, or installation is authorized in this session.

## Source comparison and limitations

Freshly fetched GitHub main matches the release above. Freshly authenticated Sites source is `8e5c594a219ec466a210181c0bf46805fd2b5a3c`. Every shared application file matches GitHub. No mirror-only tracked files exist. RELEASING.md is the sole differing shared file: the mirror still says Exodus–Joshua instead of Exodus–2 Samuel. No independent application work needs integration. Sites metadata reports public version 329. Direct access to the live release endpoint was blocked by the cloud destination policy (CONNECT 403); no bypass was attempted. Metadata is not a verification of live image bytes.

The environment reports SITES_MANAGED_LINUX_CONTAINER=1, but its required cua_repl.js browser tool is unavailable. Following the Sites preview guidance, no substitute browser automation or preview server was started. Phone/iPad layout, image decoding in those browsers, physical devices, signed assets, and live checks remain release-stage work. No claim of synchronized release or device verification is made.

## Coverage, placement and story preservation

The pre-change audit found no Proverbs chapter images, no Proverbs Story placements and no Proverbs asset files. All 31 chapters receive one opener at afterVerse 0, immediately below the heading and before verse 1 through the existing reader renderer. Scripture and Story metadata are unchanged. There are no pre-existing Proverbs images to retain or replace. Generic opener captions remain hidden; alt text begins with “Imagined scene:”. Existing Story captions and inline images in all books remain unchanged.

See `proverbs-artwork-plan-2026-11-04.json` for every chapter's image path, literary verse anchor, scene brief and alt text, and `proverbs-artwork-audit-2026-11-04.json` for coverage and verification evidence. The scenes use literary images from within each chapter rather than claiming that the first verse literally describes the picture. Architecture, plants, tools and settings are imagined illustrations, not historical evidence or exact reconstructions. The chapter 25 golden apples illustrate a comparison; they are not historical objects being asserted by the app.

## Continuity and actual visual inputs

Every image-generation call received the actual approved file `src/assets/chapter-genesis-07-opening-v1.webp` as a style-only reference. No Noah identity or ark setting was reused. The new scenes have no human figures, personified Wisdom, recurring named people, or identifiable recurring groups. No portrait continuity is invented and no concurrent session's unapproved art is used.

The source inventory records earlier Story candidates mentioning Solomon and Hezekiah across Samuel, Kings and Chronicles. Some are textual mentions or scenes without those people visibly depicted; the inventory does not approve them as identity anchors. Direct identifiable Solomon depictions include `story-solomon-becomes-king-v1.webp`, `story-solomon-s-wisdom-v1.webp`, `story-the-queen-of-sheba-and-solomon-s-decline-v1.webp`, `story-the-census-and-the-temple-site-v1.webp`, `story-david-s-last-charge-and-death-v1.webp`, and `story-solomon-s-reign-and-the-queen-of-sheba-v1.webp`. Kings/Chronicles continuity review is concurrent and these files are not newly certified portrait references by this audit. No prior image of Agur, Jakeh, Ithiel, Ucal or Lemuel was located. None is portrayed here. A future decision to depict these people must establish approved references and plausible narrative ages first. The current non-portrait scenes have no unresolved dependency on those sessions.

## Visual review

Review is against the final native 960×540 assets, at full size, for chapter relevance, objects, materials, color variation and visible anatomy. Scenes vary among fields, water, domestic still lifes, town gates, tools and animals. No human anatomy appears. The ants (6), ox (12), goats (27), lion (28) and rock hyraxes (30) receive individual visible-anatomy review; occluded limbs remain uncertain. No claim is made about anatomy concealed by pose or objects.

Proverbs 3 v1 was rejected because the mechanical screw press risked implying a later technology. Version 2 uses a simple grape-treading basin; the original remains as an inactive version. It is excluded from the active hosted manifest and offline assets. This replacement was generated with both the approved style image and v1 as actual image inputs. No other earlier source image is replaced.

## Image spacing and integration

One opener per chapter gives no consecutive images fewer than five verses apart within Proverbs. Boundary analysis includes Psalms 150 → Proverbs 1 and Proverbs 31 → Ecclesiastes 1 using current-main metadata. Concurrent Psalms additions require rechecking at integration, as do any new Story or inline images from other branches.

Register Proverbs under explicit ID 19; do not fill IDs 10–18 or overwrite their sessions. Merge `data/chapter-images.json` by keys and hosted asset lists by set union. The immutable artwork source pin must name a pushed public commit containing the union of all hosted files. Re-pin after integration if another branch contributes files missing from this branch's source pin. Preserve the existing privacy-safe image handler, source hashes, offline bytes and hosted-origin allowlist. The standard image check now includes all 31 Proverbs chapters and a missing-opener failure case.

Final validation results and feature commits are recorded below after checks complete.

## Final validation

- `npm run build:mobile`: passed. The build also passed packaged retrieval, vocabulary, reference answers, chat understanding, startup consolidation and startup recovery checks. The generated offline bundle includes all active Proverbs images.
- `npm run check:images`: passed. All 276 existing Story images and 322 registered chapters (the prior 291 plus Proverbs 31) passed. The standard renderer check verifies opener position, hidden generic captions, useful alt text, exact packaged placement, unchanged scripture and source/web/offline byte parity. Removing Proverbs 1's opener is a checked failure case.
- `npm run check:release`: passed, including Sites packaging and public-artwork privacy, immutable hashes, cache behavior and failure fallback.
- `npm run check:readability`: exit 0 in report-only mode; inherited collection findings remain. No claim of zero readability findings.
- Direct immutable public-origin retrieval: all 31 active Proverbs files match local source bytes and recorded SHA-256 hashes. Artwork source pin: `02ddeab` (full SHA in hosted-artwork.json).
- Preservation assertions passed for every earlier chapter-art metadata entry, all prior asset blobs, scripture, Story catalog and Story image mappings. Package/build identity remains 1.1.0 / build 340. The branch's source fingerprint differs from the deployed release, as expected for unpublished work.
- Computed image-spacing audit found no pair involving Proverbs below five verses, including current-main book boundaries. Repeat after combining concurrent branches.
- Production Worker size is 65,915,896 bytes against the 66,060,288-byte Sites limit: 144,392 bytes remain. Recheck this limit after combining the ten sessions.
- `git diff --check`: passed.

Artwork asset commit: `02ddeab`, pushed only to `artwork/proverbs-cloud-2026-11-04`. Final integration metadata and audit follow in the same branch. Git identity is the verified existing public-history identity `kev-mac <2168970+kev-mac@users.noreply.github.com>`. No approval denial occurred. Live access remains blocked by the HTTP destination policy; layout and connected-device verification remain unavailable for the reasons above.
