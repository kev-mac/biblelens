# Daniel artwork audit — 2026-11-04

Daniel only. Branch: `artwork/daniel-openers-2026-11-04`, based on canonical GitHub main `846ba46` after fetching. Read AGENTS.md, RELEASING.md, CLAUDE.md, the combined ten-book review, build 341 release verification and the relevant 2 Kings continuity audit before editing. No main push, merge, publication, device installation, build-number change, paid API call or API-key creation occurred. Existing Sites source access was refreshed for the mirror inspection workflow. The seven images were made with the provided image tool.

## Opening coverage

Each of Daniel's 12 chapters has exactly one opener. Existing Story placements, titles and scripture are unchanged. Chapters 1–7 use Story images at verse 1; chapters 8–12 gain `afterVerse: 0` chapter art, directly below the chapter heading. Existing renderer behavior hides generic chapter captions and displays Story captions below images in small italic text.

| Chapter | Decision / scene |
| --- | --- |
| 1 | Retain Daniel and His Friends in Babylon v1 |
| 2 | Retain Nebuchadnezzar's Dream of the Statue v1 |
| 3 | Retain The Fiery Furnace v1 |
| 4 | Retain Nebuchadnezzar's Humbling v1 |
| 5 | Replace Belshazzar's Feast with v2, feast vessels and plaster wall (5:2–5) |
| 6 | Retain Daniel in the Lions' Den v1 |
| 7 | Replace Daniel's Visions with v2, wind-stirred sea (7:2) |
| 8 | New canal near Susa setting (8:2) |
| 9 | New scroll, lamp and sackcloth setting (9:2–3) |
| 10 | New empty Tigris bank setting (10:4) |
| 11 | New siege-ramp setting (11:15) |
| 12 | New tied scroll beneath a starry sky (12:3–4,9) |

Five original Story files remain active; two receive versioned replacements. All seven new scenes have no identifiable humans or animals. These are imagined settings and supporting objects, not comprehensive portrayals of every event, exact ancient city plans, archaeological evidence or verified artifacts. The chapter 5 still life does not claim to depict the supernatural hand/writing itself. Chapter 7's sea is the vision's opening setting; the old ram/goat scene belonged to chapter 8. The chapter 12 scroll is a visual interpretation of the sealed book. These limits are deliberate, not new historical claims.

## Recurring-person and group inventory

All paths in this section are under `src/assets/`. Original seven Daniel Story files were inspected at full 1200×675 size, along with the Genesis 7 style reference. No new named-person portrait was created.

- Daniel: `story-daniel-and-his-friends-in-babylon-v1.webp`, `story-nebuchadnezzar-s-dream-of-the-statue-v1.webp`, `story-belshazzar-s-feast-v1.webp`, `story-daniel-in-the-lions-den-v1.webp`, and `story-daniel-s-visions-v1.webp`. The young group has varied medium-brown complexions, dark natural curls, slender young builds and different facial hair. Individual names cannot securely be assigned to all four figures from the image alone; it is not a precise face anchor. The statue interpreter has medium-brown skin, strong nose/brow, dark curls and a short full beard. The den portrait has compatible nose/profile and complexion with gray curls/beard and an older lean build. The text moves from youthful training under Nebuchadnezzar to Darius; substantial aging is plausible. The feast's similarly youthful adult Daniel is unsuitable for the later Belshazzar reign, so v2 removes all people. The old visions portrait is not used as an identity reference, and v2 also resolves its chapter mismatch. Chapters 7–8 are placed in Belshazzar's reign, before chapter 6's Darius narrative: chapter order is not a simple aging ladder.
- Hananiah/Shadrach, Mishael/Meshach, Azariah/Abednego: the chapter 1 group and `story-the-fiery-furnace-v1.webp`. Retained young adult brown faces, tight natural curls, later beards and lean-to-average builds are broadly compatible; exact one-to-one face naming remains uncertain. The furnace shows three clothed men and a fourth luminous background figure, compatible with 3:25–27. No new friend portrait is based on uncertain name assignments.
- Nebuchadnezzar: `story-nebuchadnezzar-s-dream-of-the-statue-v1.webp`, `story-the-fiery-furnace-v1.webp`, and `story-nebuchadnezzar-s-humbling-v1.webp`. The crowned king has brown complexion, prominent nose, dark curls and full beard. The humbled figure has similar profile, graying curls/beard and a leaner appearance after changed circumstances; the crown/clothes are not identity requirements. Retain without treating distant/back-facing furnace royalty as a precise face reference.
- Belshazzar: the only explicit local portrait is the rejected feast v1. V2 removes him as well as the incorrectly youthful Daniel. No new king face is invented.
- Darius the Mede: background king at the top of the den in `story-daniel-in-the-lions-den-v1.webp`; too distant for a precise new identity anchor. Do not silently identify him with the Darius of later Persian temple narratives.
- Cyrus: earlier explicit royal imagery occurs in `story-the-fall-of-judah-and-cyrus-s-decree-v1.webp`; the active `story-cyrus-s-decree-and-the-return-v2.webp` shows returning families, not a new Cyrus portrait. Both inspected at full size. Cyrus is named as chronological context in Daniel 10; the new river image does not depict him.
- Earlier Babylonian deportees/guards: `story-the-fall-of-jerusalem-v1.webp` inspected at full size. The families are not silently assigned Daniel and his friends' identities; episodes involve different people and dates. The preceding books' approved audit notes are preserved.
- Gabriel, Michael and the linen-clothed figure: no new portrayal. Michael is not automatically identified with another luminous figure. Gabriel's later Luke Story is not an earlier-book anchor. Ezra's `story-opposition-and-delay-v1.webp` and `story-the-temple-completed-v1.webp` refer to Persian rulers in prose but are not imported as portraits of Daniel's Darius. No parallel Isaiah/Ezekiel/Hosea artwork is used or approved here.

The actual approved `chapter-genesis-07-opening-v1.webp` was supplied to every image-tool call for style only. Each Story replacement also received its actual original v1 file as scene input. No identifiable figure survives either replacement, so no new face or identity depends on the originals or concurrent branches. The five new chapter scenes likewise require no missing named-person reference. Future identifiable additions must resolve the group name assignments and select clear approved references first.

## Visual inspection

Generated originals and all final WebP encodings were inspected at full size. Natural blue/green water, neutral interior light, muted purple cloth, reddish earth and cool night/sea scenes vary the palette. New images have no human/animal anatomy to certify. Retained scenes were inspected for visible faces, hands, grips, limbs and lions: no definite malformed limb or new continuity break was found. Covered limbs, tiny background figures and individual naming within the four friends remain limited. This is a visual review, not a guarantee about hidden detail.

## Validation and preservation

- Source validation passed all 671 registered chapters, including exactly one opener for each Daniel chapter. An initial ad hoc check used the raw Story catalog and failed a baseline Genesis heading; rerunning with the production release-content and UX13 Story transforms passed. No baseline content was changed to satisfy that check.
- Renderer source/VM checks passed chapter alt text, `afterVerse: 0` placement and absence of chapter figcaptions. Existing Story caption markup and small italic styling are preserved.
- Seven final WebP files fully decode, match required 960×540 chapter / 1200×675 Story dimensions, and are each below 250,000 bytes.
- Whole-corpus spacing includes adjacent book boundaries. No pair involving Daniel has fewer than five verse positions. Minimum gap is 14, Daniel 12 opener to Hosea 1:1. Preceding current image is Ezekiel 40:1; a future Ezekiel 48 opener would still be separated from Daniel 1 by the chapter's verses. Recheck the combined branches at integration.
- All 991 baseline asset blobs and 519 earlier chapter mapping keys match canonical main exactly. Scripture, Story catalog, package/build metadata, reader, Story renderer and offline build code remain byte-identical.
- `npm run check:readability`: exit 0 in inherited report-only mode; existing corpus findings remain. Only short artwork alt text changed.
- JavaScript syntax checks and `git diff --check`: passed.

## Hosting and verification limits

Seven new assets were committed and pushed first at `a8a6f07` (full SHA is in `data/hosted-artwork.json`). All seven immutable public GitHub files were fetched and matched local bytes and SHA-256. All earlier hosted asset entries remain, and their local files match the earlier source. The manifest now has 641 assets. The checked hosting allowlist adds only Daniel book ID 26 and the two exact Story replacements; unreviewed intervening books are not required. Both Story replacements use hosted delivery to protect the Sites budget. Every active file remains in shared source for the established offline mobile build.

Integration must union concurrent chapter keys, illustrated-book IDs, Story mappings, exact replacement allowlists and hosted manifest entries, then select one public commit containing all combined assets. Do not copy this branch's pin over concurrent additions. Build 341 measured 64,747,604 bytes against the 66,060,288-byte Worker budget; this branch's final Worker size is unmeasured.

- `npm run build:mobile`: blocked by absent project dependencies (`esbuild` not found). No packages were installed under the task's no-install constraint.
- `npm run check:images`: unavailable because `dist/server/index.js` has not been built.
- `npm run check:mobile`: mobile chrome source check passed; bundle checks stop because `www/index.html` is absent. Offline bundle inclusion/byte parity remains pending a successful build, although source pipeline and assets are preserved.
- Rendered phone/iPad layouts: unavailable; no callable browser-control tool. No browser installed and no preview server started. Physical devices and signed assets are unavailable in this Linux session.
- Sites native metadata reports public saved version 330, mirror commit `6489207c16040f17c2247db76080520fc6f422b0`, matching the build 341 release audit. The required source helper is not present in this environment, so a fresh source-tree mirror comparison is pending. A fresh source credential was obtained but never written to disk or used for a mutation.
- Live `/release.json` failed with proxy CONNECT 403. The request was denied, not retried or bypassed. No live-image or live-release verification is claimed.

Evidence: `daniel-artwork-generation-2026-11-04.json`, `daniel-artwork-source-evidence-2026-11-04.json`, and `daniel-public-source-verification-2026-11-04.json`. Local logs: `/tmp/daniel-readability.log`, `/tmp/daniel-build-mobile.log`, `/tmp/daniel-images.log`, `/tmp/daniel-mobile.log`.

The authenticated GitHub profile is `kev-mac`, numeric ID 2168970; commits use verified privacy-safe `kev-mac <2168970+kev-mac@users.noreply.github.com>`. No automatic approval review rejection occurred. Work stops after Daniel.


## Dependency restoration and completed build checks

Following explicit authorization to restore the documented locked dependencies, `npm ci --registry=https://registry.npmjs.org --no-audit --no-fund --cache=/tmp/daniel-npm-cache` succeeded, adding 152 packages. Every lockfile resolved host is `registry.npmjs.org`. The existing locked lifecycle scripts ran normally; no credential, proxy, TLS, network-policy or package-version changes were made. `package.json` and `package-lock.json` remain byte-identical. Deprecation notices were informational; no dependency upgrade was attempted. No access denial occurred in this follow-up.

The missing-dependency, unbuilt bundle and offline-parity blockers documented above are now resolved:

- `NODE_OPTIONS=--max-old-space-size=4096 npm run build:mobile`: **passed**, including web packaging, build-time content checks, startup and offline asset generation.
- `npm run check:images`: **passed**, all 276 Story records, all 671 registered illustrated chapters, source/web/native byte parity, alt text, captions, correct verse placement and fail-closed coverage. The existing 1 Samuel 7 close pair remains disclosed and untouched; no Daniel pair is below five verses.
- `npm run check:mobile`: **passed**, mobile chrome and actual generated offline worker reading, comparisons, chat, citations, concurrency and zero network access. This uses the project's Node adapter, not a physical native device.
- Focused Daniel offline check: **passed**, all 12 chapters, all 357 verses in KJV/ASV/WEB unchanged, exactly one opener per chapter, all 12 opener files matching source and www, zero network requests. The real generated mobile worker was exercised through the same Node adapter pattern as the project mobile check.
- `npm run check:release`: **passed**, shared release identity, Sites package/CSP contract, safe refresh, embedded image encoding and pinned public-artwork handler/cache/fallback protections. No publication occurred.
- Final compressed Worker: **64,492,496 bytes**, under the **66,060,288-byte** limit by **1,567,792 bytes**. This is the Daniel branch size; concurrent branches still need their own combined build and budget check.
- Web `dist/client/release.json` and offline `www/release.json` match exactly: version **1.1.0**, unchanged build **341**, source fingerprint **e7ab700d626ec72ebda3305706ab46439b1377fa339ee1700f92707aee958162**. This is an unpublished candidate fingerprint, not a claim to match the existing published build 341 contents.

Evidence: `daniel-restored-validation-2026-11-04.json`. Logs: `/tmp/daniel-npm-ci.log`, `/tmp/daniel-build-mobile-restored.log`, `/tmp/daniel-images-restored.log`, `/tmp/daniel-mobile-restored.log`, `/tmp/daniel-offline-restored.log`, `/tmp/daniel-release-restored.log`. Focused check script: `/tmp/daniel-offline-check.mjs`.

Still unavailable: rendered phone/iPad layouts, physical devices/signed app checks, fresh Sites source-tree comparison and live verification. The prior live CONNECT 403 denial was not retried. No main merge/push, publication or device installation occurred; only this feature branch is updated.
