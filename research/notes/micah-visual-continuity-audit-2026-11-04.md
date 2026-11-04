# Micah artwork audit — 2026-11-04

Scope: Micah only, reader book ID 32, seven chapters. Branch `artwork/micah-2026-11-04`, based on freshly fetched canonical main `8217c57c591928653b7bd452ba5b21b79e4cc3f6`. The original saved checkout was stale and was not used as the development base. A separate worktree at `/workspace/micah` preserves it and its local state. Read AGENTS.md, RELEASING.md, CLAUDE.md, build 342 verification, the Ecclesiastes–Amos combined review and Obadiah handoff, plus relevant earlier continuity/build audits. The delegated task overrides the older one-book release cadence: this session stops at a verified pushed feature branch. No main push, merge, publication, installation or build-number change.

## Source and access

The same selected environment initially remained starting/offline. The resumed supported wait completed with ready; observed state then reported running/connected and enforced restricted networking. No code/artwork action executed before readiness. `/etc/codex/network-policy.json` was read; no VPN is configured. No environment, credential or security settings were changed.

Sites metadata confirms public saved version 331. The Sites source helper is absent from this environment; a read-only ordinary Git clone used the existing Site's freshly issued source access through hidden stdin and ephemeral child-process authentication. Mirror HEAD `ca12233182d18ffcb68960c469dac0722fd93b85` matches the build 342 release source. There are no mirror-only tracked files. The only differing shared path is the combined review note, whose newer release-completion evidence is already on GitHub. No independent mirror application work exists. The mirror remains untouched. Credentials were kept out of files, persistent Git configuration and command arguments.

Live `/release.json` access through the ordinary inherited proxy returned `curl: (56) CONNECT tunnel failed, response 403`, HTTP status `000`, exit 56. It was stopped without retry or bypass. Live origin, rendered live chapters and current production image bytes are unverified here. Sites metadata is not a substitute for those checks.

## Inventory, scenes and visual review

The baseline chapter manifest has no `32:*` entries. Production Story headings and image mappings contain no Micah-the-prophet Story art. `story-micah-s-idols-and-the-danites-v1.webp` belongs to Judges' different Micah; it is not a prophet identity reference. Seven new images are required, with zero retained/replaced Micah images and zero duplicate Story openers. Every baseline artwork file and Story mapping remains unchanged.

Every generation request supplied the actual approved file `/workspace/micah/src/assets/chapter-genesis-07-opening-v1.webp` to `image_gen.imagegen`. It was used solely for style, never as a character identity. All new scenes omit people, recognizable recurring groups, divine portraits and animals. Thus there are no new faces, ages, family relationships, hands, fingers, limbs or animal anatomies to reconcile, and no dependency on unapproved parallel artwork. No identity is inferred from names or national references. The continuity inventory records earlier metadata candidates for named people recalled in Micah; those are candidate references, not invented approved identities. Stable physical traits/age are not applicable because none is newly portrayed.

All seven generated originals were viewed at their original dimensions, and their native 960×540 WebP exports were compared with the style target and nearby scenes in a side-by-side comparison artifact. The approved main Jonah 4 Story and Micah 1 opener were also compared at their native dimensions; Jonah is absent from every new scene. Nahum has no baseline art to compare. Final Jonah/Nahum parallel assets require a new integration review; no approval is assumed.

| Chapter | Text anchor | Accepted scene and checks |
| --- | --- | --- |
| 1 | 1:6 | Limestone rubble, uncovered foundations and stones descending toward the valley, with distant vineyard terraces. Cool overcast blue/green light; no Roman or modern architecture. |
| 2 | 2:2–5 | Empty smallholding and divided fields, cord/stakes, modest stone/mudbrick house. Plausible cord, masonry and cloth; sunrise pink, green and purple. Setting evokes seized land without inventing a visible eviction. |
| 3 | 3:12 | Furrows cross ruined hill foundations; low broken masonry and sparse trees. Reddish soil and violet sky. Evokes the prophecy's plowed Zion without claiming exact historical topography or showing an intact later temple. |
| 4 | 4:3–4 | Vine and fig-tree shade, empty seat, wooden ard and iron pruning hook. Lobed fig leaves and grape clusters are distinct; farm tools, wood joints and vegetation show no definite defect. No remaining weapons. |
| 5 | 5:2 | Small flat-roofed houses on a terraced Judean ridge. Modest village, unpaved path, olive trees, grain and blue hills; no nativity, baby, ruler, star or later church. |
| 6 | 6:10–11 | Beam balance, two pans, coherent cords, unmarked stone weights, pouch and grain measure. Stable support, plausible pan suspension and fabric. Objects evoke dishonest weighing without claiming which weight is false. |
| 7 | 7:1 | Empty woven basket beneath gleaned vines and fig branches with no ripe fruit. No grape clusters falsely turn the chapter's absence of fruit into abundance. Coherent basket weave and plants. |

These are imagined literary scenes, not historical evidence, exact artifact measurements, fixed botanical identifications or precise city reconstructions. Lighting, color and composition vary; there is no uniform amber grade. No definite visual defect, signature or unresolved identity break was found. Fine/occluded environmental detail remains illustrative.

Generation paths, actual tool inputs and review evidence are in `micah-visual-continuity-inventory-2026-11-04.json`. Local originals remain under `/workspace/generated_images`. The native comparison is `/tmp/micah-native-comparison.webp`, and the main-Jonah boundary comparison is `/tmp/micah-jonah-boundary.webp`.

## Coverage, spacing and preservation

Every Micah chapter has exactly one opener at `afterVerse: 0`, directly below the heading and before verse 1 through the unchanged reader. Useful alt text begins “Imagined scene:”. Generic chapter captions remain hidden; existing small italic Story captions and inline placement are unchanged. `scripts/check-micah-artwork.mjs` verifies coverage, missing-coverage rejection, source renderer, captions/alt text, complete Jonah/Micah/Nahum placements and actual packaged offline execution.

No pair below five verse positions occurs in this three-book baseline-plus-Micah range. The main Jonah 4 verse-1 Story to Micah 1 opener gap is 11 positions. All internal Micah transitions exceed five positions. Baseline Nahum has no artwork; the final Micah/Nahum boundary must be rechecked after integration. New Jonah placements/replacements must also be rechecked. The inherited 1 Samuel 7 opener/verse-2 Story pair is unchanged, outside this book. The spacing ledger includes every baseline placement in all three neighboring books, not only this branch's additions.

Preservation verification passed for all 1,215 baseline `src/assets` blobs, all 725 earlier chapter mappings, all 843 earlier hosted-manifest members, scripture, Story metadata, reader and package/lock inputs. No prior version was overwritten or removed. Seven additions total 1,033,102 bytes; each is below 250,000 bytes. See `micah-preservation-verification-2026-11-04.json` and `micah-artwork-audit-2026-11-04.json`.

## Hosted pin and combined integration

Asset checkpoint `94efb4849f6772cdd8eb38b47c633e9ed76c5aed` was pushed and verified on the uniquely named branch before pinning. It contains the complete 850-file asset union: the 843 previous hosted files plus all seven Micah files. Every one of the 850 actual immutable public-origin URLs was fetched with ordinary permitted access and compared byte-for-byte against source: 107,790,800 bytes. This is real public-origin verification, separate from local fixtures and from the denied live Site request. See `micah-public-origin-verification-2026-11-04.json`.

Only explicit reader ID 32 is added to the coverage registry; the hosting filename allowlist gains Micah, and the expected-hosting set explicitly includes ID 32 without registering unfinished intervening books. Existing member lists, hash/byte checks, cookie/authorization/query stripping and public origin remain intact. All seven files stay in shared source and the full offline-native bundle. No artwork is restored to the Sites Worker.

Integrate chapter mappings by key and hosted manifests by set union; retain this branch's history and earlier assets. Reconcile the parallel edits to explicit book registration and hosted allowlists, then pin a new pushed public commit containing the entire combined asset union. This branch pin does not contain other branches' future assets. Re-run origin verification, spacing, visual review, source/web/offline/signed/live byte parity and Worker size after combining. A release coordinator must assign the next release build number; this feature candidate intentionally retains 1.1.0/build 342 and is not the published build 342 fingerprint.

## Verification

Locked `npm ci --registry=https://registry.npmjs.org --no-audit --no-fund --cache=/tmp/micah-npm-cache` succeeded, adding 152 packages. Package and lockfile bytes are unchanged; no upgrade, paid API, new API key or security change. Standard locked lifecycle scripts ran normally.

Passed: shared web/mobile build (`build:mobile` runs the shared build), readability (inherited report-only corpus findings), `check:images` (895 registered chapters, 276 Story records, source/web/native image parity), `check:mobile`, `check:release`, Micah-specific source/spacing check, all seven chapters through the real offline engine with zero network requests, actual complete public-pin verification, baseline preservation and local Worker-only `release:sites` packaging. The controlled fixture's public-origin stubs are not counted as live checks. Source/web/mobile release identity agrees: `c0dbc63e6342793363b9a73e31597e60231be1a729776eb5e193c5fff4544051`.

The compressed Worker measures 64,428,372 bytes against 66,060,288, leaving 1,631,916 bytes. Local Sites staging is `/tmp/micah-sites-package`; it is not a saved or deployed Site version. No build, image, offline, mobile, origin or packaging check failed.

Managed `cua_repl.js` is unavailable, so no preview server, replacement browser or alternative browser-control path was used. Phone/iPad rendered viewport layouts, browser search/recovery smoke, physical screens, signed iOS assets, device install/launch and `release:verify` are never-run integration checks. Live Site checking is blocked by the exact proxy denial above. All 50 available nonbrowser content checks from the documented check suite passed, including source/content/readability and offline search checks. The browser search/recovery smoke was explicitly skipped. The full browser-inclusive `npm run check` is not claimed as passed. No automatic approval rejection occurred.

Supporting local logs are `/tmp/micah-{build-mobile,readability,images,mobile,release,offline,public-origin,package,content}.log`. Machine summary: `micah-validation-2026-11-04.json`.

## Next-book handoff

Nahum is reader ID 33, three chapters, owned by its separate batch session. Do not begin it here. It should fetch current main, inventory its existing art, use the actual approved Genesis 7 style file, and use approved identity files for recognizable recurring portrayals. Nineveh's references alone do not establish Jonah or another person's visual identity. Recheck the final Micah 7 → Nahum 1 boundary after both branches integrate. This session creates no further session, merges no branch and performs no release action.
