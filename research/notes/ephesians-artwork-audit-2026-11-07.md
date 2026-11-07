# Ephesians artwork review — 2026-11-07

Ephesians only, reader book 48, from freshly fetched canonical GitHub main `d9653ffd56004e7ca103845e70655699431cc8bb`. Read AGENTS.md, RELEASING.md, CLAUDE.md, the Galatians-to-Ephesians handoff and preceding verification/continuity evidence, inherited Acts/Romans guidance and the historical Ephesians audit/provenance. Fast-forwarded a clean older checkout; no local edits or stashes discarded. Philippians artwork was not opened or reviewed; its placement metadata was used only for spacing.

All **six existing chapter openers are retained**, exactly one beneath each heading before verse 1; **zero Story placements, replacements or new images**. Active files remain `src/assets/chapter-ephesians-NN-opening-v1.webp`, all 960×540. All **2,010 production files**, including **1,619 assets**, remain byte-identical to starting main. No scripture, alt, caption, chapter/Story coverage, heading, span/anchor, hosted source pin, renderer/CSS, dependency or build-number change. Build stays **388**, fingerprint `279a4e898db0ccdb8c63a0c435bd7e245399a3f195eeb4dc785837520db89278`; this is a review checkpoint.

## Image decisions and continuity

Viewed every actual active original individually at native resolution and compared it unscaled beside actual Genesis 7 `src/assets/chapter-genesis-07-opening-v1.webp` as style only. Additional 1920×540 boards compare Galatians 6→Ephesians 1 at the boundary, Galatians 1→Ephesians 1 letter still lifes, and Ephesians 4→6 object materials. Inspected originals in chapter order. Boards are temporary QA aids, without source edits. Per-image passage/object checks, byte lengths and hashes are in `ephesians-artwork-inventory-2026-11-07.json`.

| Chapter | Retained scene and textual role |
| --- | --- |
| 1 | Rolled blank letter, pen, ink pot, seal and open door; 1:1–2,13–14 greeting and sealing metaphor. No actual manuscript or composition-location claim. |
| 2 | Corner stone joining two walls; 2:19–22 building metaphor, not a portrait of Christ or archaeological evidence. |
| 3 | Rooted tree under wide sky; 3:17–19 rooted/grounded and dimensions metaphor, no specific tree/location asserted. |
| 4 | Woodworking tools, bowl and food basket; 4:28 honest labor and sharing, without naming a craftsman or attributing a trade to Paul. |
| 5 | Path from blue shade toward dawn; 5:8–14 walking/light imagery, no bride/groom or invented household scene. |
| 6 | Empty helmet, breastplate, belt, paired sandals, shield and sheathed sword; 6:13–17 armor metaphor, no wearer or battle. |

Checked papyrus rolled edges/fibres, cord, pen nib, pottery/seal, stone coursing and corner joint, tree roots/branches, mallet and hatchet joints, bowl rim, basket weave, fruit/bread, path/roof perspective, helmet opening, breastplate straps/buckles, two empty sandals, shield rim/rivets/boss and sword scabbard. No definite defect requires replacement. The historical 2026-11-04 pre-commit cornerstone signature repair remains clean in active v1; no new edit this session. Palettes vary among blue coast, green sunlit courtyard, lavender sky/green slope, burgundy cloth, blue shade/pink dawn and storm-gray armor backdrop. Natural materials and restrained illustrative finish fit the Genesis 7 target; no repeated amber grade.

No people, identifiable recurring groups or animals are visible in any of the six images, including distant scenery. Face/complexion/hair/age/build, hands/fingers/thumbs/limbs and animal anatomy are therefore inapplicable; no hidden anatomy is certified. **No generation/editing call was needed.** No new identifiable scene was made; actual identity input requirements remain in force for every future one. Genesis 7 was used only for style comparison. `ephesians-continuity-inventory-2026-11-07.json` distinguishes textual people from visible portraits and preserves inherited approved Acts guidance without creating new face-name anchors.

Ephesians uses prison-language at 3:1, 4:1 and 6:20; this does not establish a precise date/location or automatic aging from Galatians. Textual mentions of Paul, Christ, apostles, prophets, parents/children and Tychicus are not visible portraits. The Genesis quotation at 5:31 adds no Adam/Eve appearance. No new face-name assignment or identity anchor is made. Inherited approved Acts Paul guidance remains recorded for later identifiable scenes.

Minimum internal image gap **21 verses**, with **no pair under five**. **Galatians→Ephesians: 18; Ephesians→Philippians: 24.** No Philippians image was opened.

## Checks and blockers

Passed locked dependency installation (`npm ci --ignore-scripts`), `build:mobile` including web, `check:images` (all 1,189 chapters), `check:mobile`, `check:release`, source preservation, fresh Sites comparison, focused verifier and `git diff --check`. Full-suite result and exact log hashes are in `ephesians-artwork-2026-11-07/validation.json`. Historical 2026-11-04 Ephesians provenance remains untouched; current verification is under `ephesians-artwork-2026-11-07/`.

Focused checks cover **six chapters, 155 verses in KJV/ASV/WEB, six source/Worker/unsigned-native image byte matches, six missing-opener rejection cases, unchanged metadata/headings/captions and zero offline network calls**. No edition field is absent or empty in Ephesians; inherited corpus absences elsewhere remain untouched. The local immutable-origin fixture is **not live HTTP delivery**. All **1,147 pinned Git blobs** equal source at unchanged pushed pin `1e26754b308a178be210fa0ee900415bcd3a3553`. Worker is **59,167,345 bytes**, SHA-256 `fc13e7bed97a5ae5065de5afd82f11572ce3963d821bd7158428b35892184cf9`. Web and unsigned native report the same build/fingerprint.

Fresh credential/read-only Sites opening confirms frozen mirror/remote branch `64bea042655bc72df95a994a4b6c70237b2c3f5c`, saved build **386**, fingerprint `e2726d8c93d3761a5925c07893660d8643c8e0bdb0705fad8a84e4ae6108e997`. Compared 2,010 production paths: five known Matthew/Acts differences, three canonical-only versioned images, zero mirror-only paths and no independent newer work. Helper absent; ordinary Git used hidden stdin and a child-process-only authorization header. Credentials were not saved to disk/Git config. Mirror stays clean, never edited/pushed. It was absent here and cloned once; reuse `.release/sites-mirror` next time.

**Publication remains blocked:** automatic approval review previously rejected deploying saved public build 386 and one evidence-backed same-version retry pending explicit new approval. Exact held version: `appgprj_6acba627a6cc8191932fbbc47db8895d~appgver_c455c9a2f05081918005c878a24c5f05`. Parent explicitly prohibits publication/bypass. This session made no save/deploy, mirror push, access change or substitute-version attempt. Frozen saved source/archive untouched; build 388 remains unpublished. Inherited denied live HTTP/image/`release:verify` operations were deferred without new relevant authorization.

Browser QA is incomplete: `SITES_MANAGED_LINUX_CONTAINER=1`, no callable `cua_repl.js`. The [Sites skill](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md) says, “If `cua_repl.js` is unavailable, skip browser QA”; no preview server, browser install or substitute control route used. Full check reaches Playwright smoke but Chromium headless shell **1248** is missing; preceding nonbrowser/search checks pass, readability inherited report-only. No callable Mac/device connector or configured VPN: signing, signed `public` versus `www` parity, physical install/query/launch and device QA pending. Historical build 359 is not current evidence. No complete release-candidate archive produced. Sync unchanged/not retested; inherited intermittent `check-sync-disconnect.mjs` `assert(finishRead)` remains unresolved outside artwork scope.

Philippians handoff prepared. **Philippians was not started.**
