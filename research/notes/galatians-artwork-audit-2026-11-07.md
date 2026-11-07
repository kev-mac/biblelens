# Galatians artwork review — 2026-11-07

Galatians only, reader book 47, from freshly fetched canonical GitHub main `f1def6e5b16459a187443476ca68ecd7cd84f7b0`. Read AGENTS.md, RELEASING.md, CLAUDE.md, the 2 Corinthians-to-Galatians handoff and preceding verification/continuity evidence, inherited Acts/Romans guidance and the historical Galatians audit/provenance. Fast-forwarded a clean older checkout; no local edits or stashes discarded. Ephesians artwork was not opened or reviewed; its placement metadata was used only for spacing.

All **six existing chapter openers are retained**, exactly one beneath each heading before verse 1; **zero Story placements, replacements or new images**. Active files remain `src/assets/chapter-galatians-NN-opening-v1.webp`, all 960×540. All **2,010 production files**, including **1,619 assets**, remain byte-identical to starting main. No scripture, alt, caption, chapter/Story coverage, heading, span/anchor, hosted source pin, renderer/CSS, dependency or build-number change. Build stays **388**, fingerprint `279a4e898db0ccdb8c63a0c435bd7e245399a3f195eeb4dc785837520db89278`; this is a review checkpoint.

## Image decisions and continuity

Viewed every actual active original individually at native resolution and compared it unscaled beside actual Genesis 7 `src/assets/chapter-genesis-07-opening-v1.webp` as style only. Additional 1920×540 boards compare 2 Corinthians 13→Galatians 1, 2 Corinthians 13→Galatians 2 table settings and Galatians 5→6 botany/fields. Inspected originals in chapter order. Boards are temporary QA aids, without source edits. Per-image passage/object checks, byte lengths and hashes are in `galatians-artwork-inventory-2026-11-07.json`.

| Chapter | Retained scene and textual role |
| --- | --- |
| 1 | Blank scroll, reed pen, ink pot and countryside; 1:1–5,11–24 letter and recalled journeys, no actual manuscript/location claim. |
| 2 | Empty courtyard meal; 2:9–14 table fellowship, no named attendees or invented resolution of the Antioch conflict. |
| 3 | Bare cross on a ridge; 3:1,13–14 cross/tree motif, no body/Jesus portrait or asserted historical site. |
| 4 | Sinai-like mountain landscape; 4:21–31, especially 24–26, Paul’s explicit allegory, no historical-location proof or visible Hagar/Sarah/children. |
| 5 | Fig branch and orchard; 5:22–23 fruit metaphor, no literal fruit species/count assertion. |
| 6 | Young grain, separate mature field and tied sheaf; 6:7–9 sowing/reaping analogy with distinct strips/stages. |

Checked papyrus fibres/rolled edges, reed nib, ink-pot/jug/cup rims and handles, table supports, bread/olives, woven textiles, cross joint/fastener/base, mountain/plant/cloud forms, fig attachments/openings/leaves, wheat heads, sheaf binding and ground contact. No definite defect requires replacement. Chapter 5’s historical pre-commit lettering repair remains accepted: no visible corner lettering remains in the current native file; original provenance is unchanged. Palettes vary among blue morning, green courtyard shade, pale cloud, violet mountains, green/purple fruit and pink-violet dawn. No repeated amber grade.

No people, identifiable recurring groups or animals are visible in any of the six images, including distant scenery. Face/complexion/hair/age/build, hands/fingers/thumbs/limbs and animal anatomy are therefore inapplicable; no hidden anatomy is certified. **No generation/editing call was needed.** No new identifiable scene was made; actual identity input requirements remain in force for every future one. Genesis 7 was used only for style comparison. `galatians-continuity-inventory-2026-11-07.json` distinguishes textual people from visible portraits and preserves inherited approved Acts guidance without creating new face-name anchors.

Galatians recalls three years (1:18), a fourteen-year interval (2:1) and Antioch table conflict (2:11–14). Book order is not elapsed narrative time and does not justify later imprisonment or automatic aging. The empty table is not a portrait of Paul, Cephas/Peter, James, John, Barnabas or Titus; Sinai contains no Abraham/Sarah/Hagar/Isaac/Ishmael. No re-identification or portrait drift arises.

Minimum internal image gap **21 verses**, with **no pair under five**. **2 Corinthians→Galatians: 14; Galatians→Ephesians: 18.** No Ephesians image was opened.

## Checks and blockers

Passed locked dependency installation (`npm ci --ignore-scripts`), `build:mobile` including web, `check:images` (all 1,189 chapters), `check:mobile`, `check:release`, source preservation, fresh Sites comparison, focused verifier and `git diff --check`. Full-suite result and exact log hashes are in `galatians-artwork-2026-11-07/validation.json`. Historical `scripts/check-galatians-artwork.mjs` asserts its initial branch integration baseline; this review uses the current verifier under `galatians-artwork-2026-11-07/` without altering historical evidence.

Focused checks cover **six chapters, 149 verses in KJV/ASV/WEB, six source/Worker/unsigned-native image byte matches, six missing-opener rejection cases, unchanged metadata/headings/captions and zero offline network calls**. No edition field is absent or empty in Galatians; inherited corpus absences elsewhere remain untouched. The local immutable-origin fixture is **not live HTTP delivery**. All **1,147 pinned Git blobs** equal source at unchanged pushed pin `1e26754b308a178be210fa0ee900415bcd3a3553`. Worker is **59,167,345 bytes**, SHA-256 `fc13e7bed97a5ae5065de5afd82f11572ce3963d821bd7158428b35892184cf9`. Web and unsigned native report the same build/fingerprint.

Fresh credential/read-only Sites opening confirms frozen mirror/remote branch `64bea042655bc72df95a994a4b6c70237b2c3f5c`, saved build **386**, fingerprint `e2726d8c93d3761a5925c07893660d8643c8e0bdb0705fad8a84e4ae6108e997`. Compared 2,010 production paths: five known Matthew/Acts differences, three canonical-only versioned images, zero mirror-only paths and no independent newer work. Helper absent; ordinary Git used hidden stdin and a child-process-only authorization header. Credentials were not saved to disk/Git config. Mirror stays clean, never edited/pushed. It was absent here and cloned once; reuse `.release/sites-mirror` next time.

**Publication remains blocked:** automatic approval review previously rejected deploying saved public build 386 and one evidence-backed same-version retry pending explicit new approval. Exact held version: `appgprj_6acba627a6cc8191932fbbc47db8895d~appgver_c455c9a2f05081918005c878a24c5f05`. Parent explicitly prohibits publication/bypass. This session made no save/deploy, mirror push, access change or substitute-version attempt. Frozen saved source/archive untouched; build 388 remains unpublished. Inherited denied live HTTP/image/`release:verify` operations were deferred without new relevant authorization.

Browser QA is incomplete: `SITES_MANAGED_LINUX_CONTAINER=1`, no callable `cua_repl.js`. The [Sites skill](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md) says, “If `cua_repl.js` is unavailable, skip browser QA”; no preview server, browser install or substitute control route used. Full check reaches Playwright smoke but Chromium headless shell **1248** is missing; preceding nonbrowser/search checks pass, readability inherited report-only. No callable Mac/device connector or configured VPN: signing, signed `public` versus `www` parity, physical install/query/launch and device QA pending. Historical build 359 is not current evidence. No complete release-candidate archive produced. Sync unchanged/not retested; inherited intermittent `check-sync-disconnect.mjs` `assert(finishRead)` remains unresolved outside artwork scope.

Ephesians handoff prepared. **Ephesians was not started.**
