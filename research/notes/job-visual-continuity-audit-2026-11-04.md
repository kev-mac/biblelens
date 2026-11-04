# Job artwork and visual continuity — 2026-11-04

Feature work only. Isolated branch `artwork/job-cloud-2026-11-04`, based on GitHub main `c90aa0d01679116bef5c921ed4a991e95478f2b3` (build 340). The original `/workspace/biblelens` checkout was preserved. Build numbers, hosted-artwork pins, main, deployment source, installed apps and personal data are unchanged. No other book was started.

Read `AGENTS.md`, `RELEASING.md`, the Joshua continuity audit, the Ruth/Samuel combined review and superseding continuity-fixes audit, and the build 340 release audit. A fresh Sites source credential was used only for a read-only mirror checkout. Mirror `8e5c594a219ec466a210181c0bf46805fd2b5a3c` has no mirror-only tracked paths; its only shared-file difference from canonical main is the documented artwork range in `RELEASING.md`. Canonical-only research documents do not represent independent mirror work. Sites metadata reports saved version 329 and the existing public audience. Direct live `/release.json` verification returned proxy HTTP 403; it was not retried or bypassed. Prior build 340 release verification is recorded evidence, not a new live check here.

## Coverage and retained artwork

Job has 42 chapters. The existing Story images at 1:1, 32:1, 38:1 and 42:1 supply those four openers. The other 38 chapters gain versioned chapter-opening files, all at `afterVerse: 0`, directly before verse 1 through the existing reader renderer. No duplicate opener or additional inline image is introduced. All existing inline and Story placements are preserved. The registered-book map explicitly adds book ID 17 so other concurrent book branches can finish out of order. The missing-Job-opener regression assertion fails closed.

Three Story files remain active unchanged: `story-job-s-testing-v1.webp`, `story-god-answers-from-the-whirlwind-v1.webp`, and `story-job-restored-v1.webp`. `story-elihu-speaks-v1.webp` remains in source but its active mapping uses versioned `story-elihu-speaks-v2.webp`. The old image shows only Elihu and three listeners, while its alt text describes four listeners; its apparent Job has darker hair and a younger face than the established testing scene. V2 shows Elihu, the established older Job and all three friends.

A first Job 9 draft contained unrequested constellation connector lines. Imagegen removed them before acceptance; both generated PNGs and the rejected draft hash are recorded in provenance. The final natural sky was inspected at original PNG and final WebP size.

The poetry openers use imagery actually present in each speech: a drying brook, loom, reeds, mountains, tree stump, extinguished lamp, stone and stylus, mine, gate, scales, weather and animals. These illustrations depict literary images; they do not endorse the friends' arguments as the author's verdict or identify an exact archaeological setting. Job 40 and 41 show river habitat and foaming water without choosing a disputed biological identity for Behemoth or Leviathan. Job 4's lion-den still life illustrates Eliphaz's metaphor rather than an event in Job's life.

## Prior appearances and reference decisions

A source metadata inventory across all active chapter and Story images found Job and this conversation group only in the four Job Story images; no earlier-book approved Job portrait exists. The illustrated opening books Genesis through 2 Samuel contain no active Job portrait. Eliphaz the Temanite is not conflated with Esau's son of the same name. No recognizable Satan, divine figure, Noah, Daniel or other cross-reference character is introduced.

- **Job:** `src/assets/story-job-s-testing-v1.webp` is the clear, text-compatible identity anchor: older adult, medium-brown complexion, broad weathered face, short dense gray curls, rounded gray beard and lean older build, wearing a worn cream robe. The book does not establish exact numerical age at testing. Chapters 2–37 do not imply decades of aging. Job 42 spans restoration and later life; its gray-haired host is broadly compatible, without assigning a date to the banquet.
- **Three friends:** all three appear in the testing scene; tan, blue and rust head wraps distinguish them visually, but individual assignments to Eliphaz, Bildad and Zophar cannot be verified. No invented assignment is made. The restored household scene includes other relatives, whose identities are not assigned. New Elihu V2 uses the testing scene's three friends from behind; it establishes no new uncertain facial identity.
- **Elihu:** the young speaker at the left of `src/assets/story-elihu-speaks-v1.webp` supplies his own identity: medium-brown complexion, dark tight curls, short dark beard, slim young-adult build, cream robe and dark shawl. The other men in that file are excluded as identity anchors because of the Job drift.
- **Whirlwind:** the retained figure is distant and seen from behind. Face and precise age are unverifiable; it is not an identity anchor for new scenes. The restoration scene is a secondary consistency comparison, not an anchor for an exact timeline or household identity assignment.

The actual approved testing image and Genesis 7 style image were supplied as imagegen visual inputs for Job 2 and 16. Genesis 7 supplies style only. The actual testing image, Elihu V1 (young speaker only), and Genesis 7 were supplied for Elihu V2. All other new scenes avoid identifiable recurring people and use the actual Genesis 7 file for style. No cross-session unapproved portrait was used; there is no essential dependency on another concurrent book's generated art.

## Verification and remaining limits

Final coverage, spacing, asset hashes and preservation results are recorded in the accompanying source-evidence JSON; generation provenance lists the original PNG and final versioned WebP paths. Every final image is reviewed at full native size; the identifiable-person scenes are additionally compared with the reference originals. Visible hands, fingers, feet, limbs, faces, relationships and animal anatomy are checked; occluded detail cannot be certified. Old versions are retained.

Chapter-image alt text describes the visible scene and begins `Imagined scene:`. Generic chapter captions remain absent. Story captions use the existing small italic renderer. Shared source assets are retained for offline native bundles. No reader, CSS, scripture, story prose, synchronization or release-workflow code changes are needed.

This managed cloud environment has no `cua_repl.js` browser-control tool. Per the Sites skill, no unsupported preview server/browser path was substituted. Phone/iPad viewport rendering, physical-device inspection, signed native comparison and installation are unavailable here. Direct live verification is blocked by the proxy 403. The branch is not a release or a claim of synchronized live/native assets.

The last release recorded only 113,475 bytes of Worker budget headroom. These new images are currently embedded in the web build and are bundled offline. Release integration must add the active Job files to the checked public-artwork path with a verified immutable source pin, or otherwise satisfy the existing Worker budget. Hosted pins and the public origin allowlist are intentionally left for the combined release integration so independent feature branches do not race to replace shared pins. No publication is authorized in this task.


## Final source checks

- `npm run build:mobile`: final build passed, including packaged retrieval, offline search, startup asset and recovery checks. It creates an unsigned offline bundle; no native signing or installation occurred.
- `npm run check:images`: exit 0. All 276 Story images and 333 registered chapters passed packaged placement, alt text, captions, unchanged scripture and native/web byte parity checks. The inherited 1 Samuel 7:0 → 7:2 close pair remains documented and unchanged.
- `npm run check:readability`: exit 0, in the inherited report-only mode with existing findings. No scripture or Story prose changed.
- Independent source audit: 42 chapters, exactly one opener per chapter, 38 chapter images plus 4 Story openers, no image pairs fewer than five verses apart. The nearest preceding illustrated scene is Esther 8:1, 52 verse positions before Job 1:1. Psalms has no active artwork in this source state; the next existing illustrated scene is Isaiah 6:1, 3,847 verse positions after Job 42:1. These distances describe current main's coverage, not the other sessions' unfinished branches.
- All 670 prior asset Git blobs are unchanged, including the inactive Elihu V1. All prior chapter metadata, non-Elihu Story mappings, scripture, Story prose, build 340 and hosted-artwork pins are unchanged. The original checkout is clean.
- All 39 new WebPs have the required native dimensions (38 at 960×540; Elihu V2 at 1200×675), total 4,745,552 bytes, largest 199,334 bytes. Full-size visual review found no clear malformed visible anatomy or unresolved new identity break; hidden details remain unverified.
- `git diff --check`: passed.

The final default embedded Worker is **71,662,677 bytes**, exceeding the existing 66,060,288-byte Sites budget by **5,602,389 bytes**. This is a concrete release-integration blocker, not a cloud image-generation failure. Add the active Job files to the existing hosted-artwork mechanism and verify the new pin/allowlist and Worker size during the combined release; native images must stay bundled. This session does not publish or change shared hosting pins.
