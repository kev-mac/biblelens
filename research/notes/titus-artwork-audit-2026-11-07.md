# Titus artwork review — 2026-11-07

Reviewed **Titus only**, reader book 55, from freshly fetched GitHub main `3ef4b563f60284465333df643c2543eb8961080b`. Read AGENTS.md, RELEASING.md, the incoming 2 Timothy handoff and its audit/inventory/continuity/verification/scripts and validation, CLAUDE.md, historical Titus provenance and current Acts identity guidance. Fast-forwarded the clean older checkout; no edits or stashes discarded. No Philemon art opened or reviewed; only its opener placement metadata supplies the outgoing spacing boundary.

All **three existing chapter openers are retained**, one before verse 1 per chapter, with **zero Story placements, replacements or new images**. The active `src/assets/chapter-titus-NN-opening-v1.webp` files remain 960×540 and total **460,588 bytes**. All **2,010 production files**, including **1,619 assets**, remain byte-identical to starting main. Only review evidence and a handoff are added. Scripture, image metadata, renderers, dependencies, hosted pin and build number are unchanged: still **unpublished build 388**, fingerprint `279a4e898db0ccdb8c63a0c435bd7e245399a3f195eeb4dc785837520db89278`.

## Visual decisions

Viewed all three originals individually at native 960×540, the actual approved Genesis 7 style file, three unscaled style boards and three unscaled neighbor boards. Incoming neighbor is 2 Timothy 4; both internal neighbors were compared. Temporary 1920×570 boards preserve original pixels plus labels under `/tmp/titus-review/`; hashes and findings are in the continuity inventory. These are inspection aids, not app assets.

| Chapter | Retained scene and textual role |
| --- | --- |
| 1 | Cretan coastal homes and olive slopes evoke Crete in 1:5. No exact city, archaeological reconstruction, portrait of Titus/Paul, or visible elders. |
| 2 | Empty teaching courtyard with stools, scroll and lamp evokes teaching across generations in 2:1–8. No exact room or claim a particular historical gathering occurred. |
| 3 | Basket with bread, tied bundle and water flask evoke supporting travelers and necessary needs, 3:13–14. No completed delivery, identification of Zenas/Apollos, or exact route to Nicopolis asserted. |

Inspected stone/roof/pergola supports, foreground jars with handles/necks/rims, basket weave/handles, doorway lintels, olive branches, coastline and town structures; stool legs/stretchers, table supports, scroll rollers/edges, lamp bowl/handle/nozzle/wick/flame, lattice, cloth/rug fringe and vine joins; bread contours, tied bag/knot, flask cork/cord crossings, bench supports, shelf jars, steps, road and retaining wall. No definite malformed object, impossible visible join, readable pseudo-lettering, signature or watermark found. Hidden geometry and precise archaeology are not certified. Blue water and green coast, cool courtyard shade with purple cloth, and blue hills with muted red travel cloth avoid a repeated amber grade while preserving grounded materials and restrained illustration.

There are **no visible people, recurring groups or animals**. Face, complexion, natural hair, age/build, fingers/thumbs/limbs and animal comparisons therefore do not apply. No generation/editing calls occurred and no portrait anchor is established. Actual approved identity files remain mandatory visual inputs for any future identifiable recurring portrayal. Current Acts guidance supersedes obsolete candidate lists: Paul is not King Saul; inactive first-journey v1 is not an anchor; active arrest is v2; Ephesus's artisan is not Paul. Anonymous Acts companions are not certified Titus or Timothy faces; **Titus is not Timothy**. “True child” in 1:4 does not establish biological parentage or a precise age. Book order does not establish elapsed time or aging. Jesus, Artemas, Tychicus, Zenas and Apollos are textual mentions, not portraits here. General groups, greetings and the “evil beasts” quotation in 1:12 do not become visible ethnic stereotypes, identified gatherings or literal animals.

## Preservation and checks

The inventory JSON records hashes, text anchors, native-size object review and spacing. Continuity JSON records inherited reference guidance and actual inspection boards. Reproducible current-source checks are in `titus-artwork-2026-11-07/`; the historical initial-integration script has obsolete baseline constraints and was not used as a current review gate.

Passed locked official-registry npm installation using a writable `/tmp` cache, `build:mobile`, `check:images`, `check:mobile`, `check:release`, exact source preservation, fresh read-only Sites comparison and focused Worker/offline verification. Command outcomes and log hashes are in `validation.json`; raw command logs remain task-local.

All three chapters and **46 verses** preserve exact KJV/ASV/WEB field presence, types and values. No absent/empty edition fields occur in Titus; inherited corpus absences elsewhere remain intact. Three source/Worker/unsigned-native image byte matches; headings, alts, hidden generic captions, one opener before verse 1, three missing-opener rejection cases and **zero offline network calls** verified. Immutable-origin responses use a local source fixture, not live HTTP verification. Story mappings, anchors and small italic captions remain unchanged throughout the app.

Internal gaps are **16 and 15**, minimum **15** verse positions. Boundaries: **2 Timothy→Titus 22**, **Titus→Philemon 15**. No pair involving Titus is below five. No verse or image moved to conceal spacing.

Hosted pin remains pushed `1e26754b308a178be210fa0ee900415bcd3a3553`; all **1,147 pinned Git blobs** equal source. Source, local Worker and unsigned-native release metadata agree on build 388/fingerprint above. Worker **59,167,345 bytes**, SHA-256 `fc13e7bed97a5ae5065de5afd82f11572ce3963d821bd7158428b35892184cf9`.

Fresh credential read-only opening found Sites main still **`64bea042655bc72df95a994a4b6c70237b2c3f5c`**, frozen saved build **386**, fingerprint `e2726d8c93d3761a5925c07893660d8643c8e0bdb0705fad8a84e4ae6108e997`. Five known Matthew/Acts production differences and three canonical-only versioned assets; zero mirror-only production files or independent newer work. Source helper absent; ordinary Git used hidden stdin and a child-process-only authorization header. No credential persisted in files/configuration. Cache absent, so cloned once; **reuse `.release/sites-mirror`**. Mirror remains clean and unpushed.

## Exact blockers

- **Publication held:** inherited automatic approval review rejected deployment of saved public build 386 and one evidence-backed same-version retry pending explicit new approval. Held version `appgprj_6acba627a6cc8191932fbbc47db8895d~appgver_c455c9a2f05081918005c878a24c5f05`. Parent explicitly prohibits publication or bypass. This session attempted no save/deploy, mirror push, audience change, superseding version or alternate route. Frozen saved source/archive untouched.
- **Browser/full-suite QA incomplete:** fresh `npm run check` exits 1 at `scripts/check-release-smoke.mjs:31:32`: missing `/home/agent/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. All preceding checks passed; readability remains inherited report-only. Managed mode has no callable `cua_repl.js`; the [Sites skill](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md) says, “If `cua_repl.js` is unavailable, skip browser QA.” No browser installation, preview server or substitute managed-control route attempted. Browser results are not claimed.
- **Live release/image parity deferred:** inherited denied live HTTP, image-byte and `release:verify` operations remain deferred without materially new relevant authorization. Local fixtures do not establish live parity. Complete release-candidate archive remains incomplete.
- **Native installation pending:** no callable Mac/device connector or configured VPN. Signing, signed `public` vs `www` parity, physical installation/query/launch remain pending. Historical build 359 is not current device evidence. Unsigned offline checks passed.
- **Inherited sync issue:** sync source unchanged and not retested. Intermittent `check-sync-disconnect.mjs` `assert(finishRead)` remains unresolved outside artwork scope.

The outgoing handoff prepares **Philemon for a new cloud session only**. This session does not start Philemon.
