# Philemon artwork review — 2026-11-07

Reviewed **Philemon only**, reader book 56, from freshly fetched GitHub main `d3ce58291c72c2fe623579fd3c053642504d8887`. Read current AGENTS.md, RELEASING.md, CLAUDE.md, incoming Titus handoff and its audit/inventory/continuity/verification/scripts/validation, historical Philemon provenance, current Acts continuity guidance and all 25 Philemon verses in KJV/ASV/WEB. Fast-forwarded the clean older checkout; no edits or stashes discarded. No Hebrews artwork opened or reviewed; its opener placement metadata supplies the outgoing spacing boundary only.

The **one existing Philemon opener is retained**, directly below the chapter heading and before verse 1. There are **zero Story placements, replacements or new images**. `src/assets/chapter-philemon-01-opening-v1.webp` remains 960×540, **128,258 bytes**, SHA-256 `0c6265352b09a54e3b9f30e56cde50f8d11b5b7a42e98773ab2db4f891109b89`. All **2,010 production files**, including **1,619 assets**, remain byte-identical to starting main. Only review evidence and the Hebrews handoff are added. Scripture, metadata, renderers, dependencies, hosted pin and build number remain unchanged: **unpublished build 388**, fingerprint `279a4e898db0ccdb8c63a0c435bd7e245399a3f195eeb4dc785837520db89278`.

## Visual and textual decision

Viewed the original separately at native 960×540, the actual approved Genesis 7 style image, and two unscaled 1920×570 inspection boards pairing Philemon with Genesis 7 and incoming Titus 3. Board hashes are in the continuity inventory; temporary boards stay under `/tmp/philemon-review/` and are not app assets.

The empty guest room evokes **1:22**, where Paul requests lodging and hopes to return. The bed, linen, blue/burgundy blanket, clay vessels and courtyard doorway are imagined atmosphere. They do not establish an attested room, exact city or house, Paul's release or completed visit, completed reconciliation, or Onesimus's emancipation. The opening image introduces the chapter without asserting that verse 1 describes this room.

Inspected visible bed posts/legs/rails/woven base, pillow and blanket folds/fringe; stool top/legs/braces, pitcher rim/neck/handle and cup; basket rim/weave/linen, niche jar/basket, rafters/reed roof, stone floor/rug weave/fringe; door frame/planks/crossbars/hinges, courtyard bench/jars, vine branches and distant landscape. No definite malformed object or impossible visible join, readable pseudo-lettering, signature or watermark found. Hidden supports and precise archaeology are not certified. Natural cool courtyard light, green foliage, blue hills and blue/burgundy cloth preserve color variation and grounded materials with a restrained illustrative finish.

There are **no visible people, recurring groups or animals**. Face/complexion/hair, age/build, finger/thumb/limb and animal checks therefore do not apply. No generation/editing calls occurred, and no portrait anchor is added. Actual approved identity image files remain mandatory visual inputs for any future identifiable recurring portrayal.

Paul, Timothy, Philemon, Apphia, Archippus, Onesimus, Epaphras, Mark/Marcus, Aristarchus, Demas, Luke/Lucas and Jesus Christ are textual mentions only. Apphia and Archippus are not assigned wife/son relationships absent from these verses. “My child” and “begotten in my bonds” do not establish biological parentage or Onesimus's age. “Paul the aged” in 1:9 supplies no exact calendar age or visual aging based on book order. Anonymous Acts companions are not certified Timothy/Onesimus/Titus faces. Current Acts guidance supersedes obsolete candidate lists: Paul is not King Saul, the incompatible inactive first-journey v1 is not an anchor, active arrest is v2, and the Ephesus artisan is not Paul.

## Preservation and verification

Current-source scripts in `philemon-artwork-2026-11-07/` verify production preservation, placements and release identity. The historical initial-integration `scripts/check-philemon-artwork.mjs` has obsolete baseline constraints and was not used as this review's gate.

Passed locked official-registry npm installation, `build:mobile`, `check:images`, `check:mobile`, `check:release`, source preservation, fresh read-only Sites comparison and focused Worker/offline verification. Commands, exits and log hashes are recorded in `validation.json`; raw logs remain task-local.

All **25 verses** preserve exact KJV/ASV/WEB field presence, types and values. No absent/empty edition fields occur in Philemon; inherited corpus absences elsewhere remain intact. One source/Worker/unsigned-native image byte match, headings/alts/hidden generic captions, one opener before verse 1, one missing-opener rejection case and **zero offline network calls** verified. Immutable-origin responses use a local source fixture, not live HTTP verification. All Story mappings, anchors and small italic captions remain unchanged.

No internal gap exists with only one placement. Boundaries: **Titus→Philemon 15**, **Philemon→Hebrews 25** verse positions. No pair involving Philemon is below five. No verse or image moved to conceal spacing.

Hosted pin remains pushed `1e26754b308a178be210fa0ee900415bcd3a3553`; all **1,147 pinned Git blobs** equal source. Source, local Worker and unsigned-native release metadata agree on build 388/fingerprint above. Worker **59,167,345 bytes**, SHA-256 `fc13e7bed97a5ae5065de5afd82f11572ce3963d821bd7158428b35892184cf9`.

Fresh credential read-only opening found Sites main still **`64bea042655bc72df95a994a4b6c70237b2c3f5c`**, frozen saved build **386**, fingerprint `e2726d8c93d3761a5925c07893660d8643c8e0bdb0705fad8a84e4ae6108e997`. Five known Matthew/Acts production differences, three canonical-only versioned assets and zero mirror-only production files or independent newer work. Source helper absent; ordinary Git used hidden stdin and a child-process-only authorization header. No credential persisted in files/configuration. Cache was absent, so cloned once; **reuse `.release/sites-mirror`**. Mirror remains clean and unpushed.

## Exact blockers

- **Publication held:** inherited automatic approval review rejected deployment of saved public build 386 and one evidence-backed same-version retry pending explicit new approval. Held version `appgprj_6acba627a6cc8191932fbbc47db8895d~appgver_c455c9a2f05081918005c878a24c5f05`. Parent explicitly prohibits publication or bypass. This session attempted no save/deploy, mirror push, audience change, superseding version or alternate route. Frozen saved source/archive untouched.
- **Browser/full-suite QA incomplete:** managed Sites mode has no callable `cua_repl.js`; the [Sites skill](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md) says, “If `cua_repl.js` is unavailable, skip browser QA.” No preview server, browser installation or substitute browser-control path attempted. Fresh `npm run check` exits 1 at `scripts/check-release-smoke.mjs:31:32`: missing `/home/agent/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. All preceding checks passed. The outcome/log hash is recorded in `validation.json`; browser results are not claimed. Readability is inherited report-only, not a strict corpus pass.
- **Live release/image parity deferred:** inherited denied live HTTP, image-byte and `release:verify` operations remain deferred without materially new relevant authorization. Local fixtures do not establish live parity. Complete release-candidate archive remains incomplete.
- **Native installation pending:** no callable Mac/device connector or configured VPN. Signing, signed `public` vs `www` parity and physical installation/query/launch remain pending. Historical build 359 is not current device evidence. Unsigned offline checks passed.
- **Inherited sync issue:** sync source unchanged and not retested. Intermittent `check-sync-disconnect.mjs` `assert(finishRead)` remains unresolved outside artwork scope.

The outgoing handoff prepares **Hebrews for a new cloud session only**. This session does not start Hebrews.
