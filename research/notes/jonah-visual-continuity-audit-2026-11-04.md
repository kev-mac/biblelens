# Jonah artwork review — 2026-11-04

Scope: Jonah only, reader book ID 31, four chapters. Freshly fetched canonical main was `8217c57c591928653b7bd452ba5b21b79e4cc3f6`. Feature branch: `artwork/jonah-2026-11-04`. This session stops at a pushed branch; coordinated integration owns publication and device installation. No main merge/push, release/build-number change, publication, installation, further book or additional session occurred.

Read AGENTS.md, RELEASING.md, CLAUDE.md, build-342-release-verification-2026-11-04.md, ecclesiastes-amos-combined-review-2026-11-04.md, obadiah-artwork-handoff-2026-11-04.md and relevant earlier continuity notes. No checkout-local additional skills were present. The cloud runtime and Sites skills were read. The Sites helper executable is absent here; the existing mirror was opened with ordinary Git and the scoped source credential kept in process memory/stdin, without storing the header/token. Mirror HEAD `ca12233182d18ffcb68960c469dac0722fd93b85` has 1,573 canonical production files identical to fresh main. Sites reports public version 331; its audience was not changed. Local edits/stashes and previous release evidence were preserved.

## Inventory and scene decisions

| Chapter | Baseline | Decision |
| --- | --- | --- |
| 1 | Story at 1:1: Jonah Flees and Is Swallowed | Retain the existing opener; no duplicate. The shore scene depicts the conclusion of its 1:1–2:10 literary unit. |
| 2 | No chapter image or Story start | Add one opener based on the prayer's waters/deep/seaweed imagery, especially 2:3–6. |
| 3 | Story at 3:1: Nineveh Repents | Retain existing opener. |
| 4 | Story at 4:1: Jonah's Anger | Retain existing opener. |

Counts: one generated/accepted new image, three retained Story images, zero replacements, zero removed artwork. All four chapters have exactly one opener before verse 1. All original Story placements, captions and alt text remain byte-identical. Chapter art has useful imagined-scene alt text and no generic visible caption; Story captions retain the existing small italic presentation. Scripture, Story prose, reader code, package manifest and lockfile are unchanged. Every one of the 1,215 baseline src/assets blobs and every earlier chapter-image entry remains byte-identical (machine ledger below).

New asset: `src/assets/chapter-jonah-02-opening-v1.webp`, 960×540, 72,778 bytes. Imagined seaweed swaying over submerged rocks in blue-green water; this is a poetic evocation, not a literal fish-interior diagram. No visible person, animal, deity, text or signature. Actual approved style file `src/assets/chapter-genesis-07-opening-v1.webp` was supplied to image_gen as its referenced image, not merely described. The generated original remains `/workspace/generated_images/exec-657c1e51-9533-4cd0-909f-207a96dea352.png`. The generated scene and final WebP were inspected at full size. Its restrained finish, natural underwater light, olive vegetation, cool blues and rock texture fit the target without repeating amber grading. Final resizing/encoding preserves the composition. The scene introduces no human identity/anatomy dependency.

## Continuity inventory and actual visual comparison

Reference paths below are under src/assets. Prior-book Jonah mention in 2 Kings 14:25 does not establish a visible portrait. `story-elisha-s-death-and-israel-s-victories-v1.webp` was inspected: its visible figures are Elisha and the king in the arrow scene, not Jonah. No earlier approved identifiable Jonah portrayal was located. Textual references and generic Assyrians are not identity references.

The three current Jonah depictions were inspected individually at full original resolution and together in `/tmp/jonah-original-resolution-comparison.png`, assembled without resizing the 1200×675 source panels:

- `story-jonah-flees-and-is-swallowed-v1.webp`: adult with medium-brown complexion, dense dark natural curls at the nape, dark beard seen in rear/side profile, average-to-sturdy build, practical light tunic and dark striped mantle. Apparent age roughly 35–50; exact age is not asserted by the text. Wet, compressed curls and a rear angle limit facial comparison.
- `story-nineveh-repents-v1.webp`: same compatible complexion, strong nose/profile, dark curly hair, full dark beard and sturdy build. Apparent age remains compatible with the same adult over days, not decades. Sackcloth and posture may change. The king is the separate crowned figure at center, with a royal mantle held beside him; he is not Jonah. The street/repentance scene fits chapter 3 as a literary summary, without claiming the whole composition happened simultaneously.
- `story-jonah-s-anger-v1.webp`: compatible strong nose, complexion, natural curls, beard and build; pale strands are highlights/minor gray, not a new elderly identity. Same adult life stage. Seated frustrated posture, shade shelter, withered foliage and city outlook fit 4:5–8. Exact plant species and architectural details remain illustrative.

No definite identity break or malformed visible anatomy was found. Shore palms/fingers and planted forearms, speaking hands/arms and listener gestures, seated knees/feet/arm and partly hidden hand beside the face are coherent. Occluded fingers and distant faces are not certified. No animals require review in the active Jonah images. The three retained scenes have different lighting/compositions and tactile ancient materials; no replacement is justified solely by stylistic preference. No new recognizable recurring person/group was generated, so no unapproved parallel identity image was used. The Genesis 7 image is only a style reference.

## Spacing and boundaries

`jonah-source-verification-2026-11-04.json` records every consecutive image pair fewer than five verse positions apart across the current source, plus all pairs touching Jonah. Chapter openers are assigned verse position 0 and Story images their actual starting verse; gaps count cumulative verse positions, not UI pixel distance. There are 58 inherited close pairs under this convention and zero involving Jonah. No new close pair was added. The familiar 1 Samuel 7 opener/Story pair is inherited (positions 0 and 2). Existing earlier-book exceptions remain untouched and listed individually in the ledger.

Jonah gaps: 1:1 Story → chapter 2 opener: 16; chapter 2 opener → 3:1 Story: 11; 3:1 → 4:1: 10. Current-main nearest outside images are Amos 9 opener → Jonah 1:1 (37) and Jonah 4:1 → Matthew 1:18 (593). Obadiah and Micah have no active images in this baseline. Combined integration must recheck the actual approved Obadiah/Jonah/Micah boundary union; neighboring parallel work has not been assumed approved.

## Hosting and packaging

Only explicit coverage ID 31 and the Jonah chapter filename family were added. Required hosting membership adds just the new chapter image; all previous 843 members remain. No artwork is restored into the Worker, and no handler/privacy/size guard changes were made. Full native assets remain available offline.

Immutable branch asset pin: `be451c0b00d8d9ed92d026923b62bec7faa9303e`. That pushed public commit contains the complete baseline asset union plus the new Jonah image. `jonah-public-origin-verification-2026-11-04.json` verifies all 844 exact immutable public-origin files against source SHA-256/bytes. No cookies, credentials, notes or private query data were sent. The initial Node probe lacked environment-proxy mode and timed out; the incomplete bulk attempt was terminated, never counted as a pass. Using Node's supported `NODE_USE_ENV_PROXY=1` with the inherited proxy/CA succeeded. No access denial, alternate proxy, TLS change, new credential or paid API was involved.

This pin does not contain other concurrent books' new files. Integration must union all chapter mappings, explicit coverage IDs, filename allowlist additions and hosting members; push one complete combined asset commit, then replace the pin and rebuild both outputs. Do not choose this branch pin for a larger manifest unless every referenced blob exists there.

## Verification outcomes

Passed:

- Documented locked `npm ci --registry=https://registry.npmjs.org --cache=/tmp/jonah-npm-cache --no-audit --no-fund`: 152 dependencies restored; manifests/lockfile unchanged. Existing deprecation notices retained.
- `NODE_OPTIONS=--max-old-space-size=4096 npm run build:mobile`: final shared web/mobile build passed after pin update, including its bundled retrieval/startup/reference checks. Final Worker: 64,425,226 bytes against 66,060,288, leaving 1,635,062 bytes.
- `npm run check:readability`: passed, with inherited report-only findings. No visible prose was changed.
- `npm run check:images`: passed all 892 explicitly registered chapters, retained Story verses/captions and source/web/native image byte parity. Origin calls in this controlled test use pinned local bytes; the independent real-origin audit above is separate.
- `npm run check:mobile`: passed chrome/keyboard logic and actual mobile-worker reading/search/citation checks with zero network requests.
- `npm run check:release`: passed release identity, Worker-only Sites packaging/CSP/authentication, app refresh, embedded encoding, hosted-artwork hash/privacy/redirect checks. The fixture's historical “Build 219” label is its test data, not this branch's app build number (342 remains unchanged).
- Actual offline engine checks for all four Jonah chapters: one opener each, complete packaged verses, exact source/native bytes and zero network requests; see `jonah-offline-verification-2026-11-04.json`.
- Source preservation/coverage/spacing ledger: 1,215 retained baseline asset blobs, unchanged earlier mappings, scripture/prose/reader/packages. The first audit attempt hit Node's default exec buffer on chapters.json; rerun with sufficient buffer passed, with no source change.
- Full immutable public-origin audit: 844/844 exact files passed, no denial. `git diff --check` passed.

Never run/pending for integration:

- Browser viewport renders and browser smoke: managed Linux has no `cua_repl.js`/browser-control tool, so no preview server, browser installation or alternate control path was attempted. Phone/iPad layout remains pending, not a pass.
- Actual live Jonah endpoint/image parity, publication, signed iOS asset parity, install/version/activated launches, physical-device screens and `release:verify`. These are intentionally outside this isolated branch task. The current live Site version/mirror were checked, but no live artwork parity is claimed. The live hostname is absent from the environment's allowed HTTP hosts.
- Full `npm run check` was not run because it includes browser smoke; targeted required suites above passed. No signing or macOS/device tools are present in this cloud environment.

Logs are `/tmp/jonah-final-build.log`, `/tmp/jonah-readability.log`, `/tmp/jonah-images.log`, `/tmp/jonah-mobile.log`, `/tmp/jonah-release.log` and `/tmp/jonah-source-audit.log`. No approval denial or unresolved artwork/continuity dependency remains. Browser/live/signed-device verification remains a coordinated release responsibility.

## Integration / next-book handoff

Stop after Jonah. Micah (reader ID 32, seven chapters) is the next canonical book but already belongs to the concurrent batch; do not create a duplicate session. Its owner should inventory current Story/artwork, use actual Genesis 7 style input and approved identity image inputs where applicable, and inspect full-size continuity without assuming Jonah's characters appear in Micah. Combined review must recheck Obadiah/Jonah/Micah spacing and retain all three Jonah Story mappings. Resolve the shared public pin only after the complete ten-book union is pushed, rerun packaging/offline/browser/public-origin/live/signed parity checks, then publish/install in the coordinated release session.
