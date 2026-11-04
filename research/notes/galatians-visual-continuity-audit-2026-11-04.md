# Galatians artwork handoff — 2026-11-04

Galatians only, reader book ID 47, all six chapters. Branch `artwork/galatians-2026-11-04` starts from freshly fetched canonical main `6bd1f514ed876677ab0762695176dfb9d64dfa2e` (published build 343). The delegated scope stops after a verified feature-branch push. No main merge/push, publication, signing, device operation, release/build increment, or next-book session occurs here.

## Source comparison and preservation

Read AGENTS.md, RELEASING.md, CLAUDE.md, build 343 release verification, the Obadiah–Matthew combined review and machine ledger, Matthew's visual audit, continuity inventory and approved next-book handoff, plus relevant Numbers/Deuteronomy and Kings continuity evidence. Neither checkout nor workspace `.agents/skills` exists. Cloud runtime and Sites skill instructions were read; runtime is ready with enforced restricted network policy and no configured API secret or outbound identity.

Sites reports public version 332. The Sites helper is absent from this cloud filesystem. A fresh issued source credential was supplied through hidden stdin and held only in child-process configuration for a read-only mirror clone, without writing it to disk or Git config. Mirror `57013c141639c6db19098d50708ed6201e396ee2` matches all 1,637 compared production files. Neither mirror nor production was changed.

All 1,274 baseline source asset files remain byte-identical, including superseded originals. Every earlier chapter mapping, all 900 hosting entries, scripture, Story prose/placements/image metadata, renderer/CSS, package/lockfile and app/build numbers are preserved. No local stashes existed and none were created or changed. The initially clean snapshot checkout was placed on a fresh feature branch; no concurrent branch was overwritten.

## Six chapter decisions

There are no Galatians Stories or images in either the source or reconciled enriched production catalog. Six new versioned 960×540 chapter files provide exactly one opener directly below each heading, before verse 1. Each uses `afterVerse: 0`. Alt text begins `Imagined scene:`; generic captions stay hidden. The unchanged Story renderer retains its small italic captions and original verse positions elsewhere.

| Chapter | Scene | Textual anchor |
| --- | --- | --- |
| 1 | Unlettered letter, reed pen and hills beyond a window | 1:1–5, 11–24; letter/journey atmosphere, not a claimed original document |
| 2 | Bread, olives and water cups around one low courtyard table | 2:9–14; fellowship and shared eating, without named portraits |
| 3 | Bare wooden cross on a rocky ridge | 3:13–14; literary cross motif without a body or identifiable Jesus |
| 4 | Rugged Sinai mountain landscape and cloud shadows | 4:24–26; named landscape within Paul's allegory, not an exact historical location |
| 5 | Purple and green figs on a leafy branch | 5:22–23; fruit metaphor, without assigning a literal fruit count to the virtues |
| 6 | New shoots, mature wheat and tied sheaf in separate field strips | 6:7–9; sowing/reaping metaphor, distinct planting stages in different strips |

All six original-resolution outputs were inspected, then final WebPs were compared at native resolution beside the actual approved Genesis 7 file in 1920×540 pairs. All five adjacent chapter pairs (1/2 through 5/6) were also viewed at native resolution; no competing identity or new contradiction was found. Materials, objects, scenery, crop, textual role, botany and absence of people/animals were checked. Lighting and palettes vary among clear blue morning, green courtyard shade, cool cloud, violet mountain shadows, green/purple fruit and pink-violet dawn. No visible anatomy or recurring human identity is introduced. Exact ancient architecture, landscape and artifacts remain imagined.

The first chapter-5 output had faint generated corner lettering and was rejected before any commit. An imagegen edit supplied that actual output plus the actual Genesis 7 style reference, removed the lettering, and was inspected at original resolution. Only the accepted repaired image is active. Both generated originals remain local and their paths, hashes, prompts and actual input files are in `src/assets/galatians-chapter-art.provenance.json`. The six accepted WebPs total 926,846 bytes. Generated/edited calls: six initial generations and one repair; active new openers: six; retained/replaced Galatians Story images: zero.

## Identity inputs and continuity limits

Every generation and repair supplied the actual `src/assets/chapter-genesis-07-opening-v1.webp` file as a style-only visual input. The accepted scenes have no person, hidden portrait, hand or recurring group; therefore no identity visual input was required and no new image depends on parallel branches.

`galatians-continuity-inventory-2026-11-04.json` inventories actual source Story and chapter candidates across 12 people/group categories, includes the approved Matthew traits/references, and distinguishes text mentions from identified faces. It records Jesus, Mary, Joseph, John the Baptist, apostle John, Peter, other disciples, Paul/Saul, Barnabas, Stephen, James/Titus and Abraham/Sarah/Hagar/Isaac. Unrelated Josephs/Johns/Sauls are not one identity. Clothing is not used to assign names, nor are obscured people counted or certified.

Actual approved Matthew baptism/calling and Mark baptism files were inspected: Jesus has brown complexion, natural dark curls, full beard, angular nose and lean adult build; John the Baptist has dense longer curls and beard. Parallel accounts add no extra aging. The delegated `story-the-calling-of-the-first-disciples-v1.webp` candidate does not exist; the active approved file is `story-calling-the-first-disciples-v1.webp`, confirmed in source and Matthew's inventory.

The actual Acts conversion, first journey, council and Stephen images were inspected as candidate evidence. Paul/Saul is a brown-skinned dark-curled, bearded adult in the conversion scene; the journey figure has a higher hairline. Galatians recalls elapsed years, including a fourteen-year interval, but this session does not certify unresolved council/companion face assignments as new identity anchors. No name-to-face map was invented for Barnabas or apostles. No new portrait uses them. Superseded Transfiguration v1 is not reactivated or used for Moses/Elijah identity.

## Coverage, spacing and offline verification

`scripts/check-galatians-artwork.mjs` uses the same transformed, tagged and enriched production Story catalog as the build. It verifies exactly one opener per chapter, visible metadata and renderer behavior, fail-closed missing coverage, all previous source assets/mappings and hosting members, and complete-canon adjacent/all image pairs below five positions. The built catalog is compared exactly with that reconstructed production catalog.

Spacing remains exactly build 343's baseline: 63 adjacent/64 all near pairs at opener coordinate 0; 67 adjacent/68 all at coordinate 1. Every inherited close pair and actual endpoint/gap is retained in `galatians-artwork-audit-2026-11-04.json`. None touches Galatians. The current-main 2 Corinthians and Ephesians have no active artwork, so no actual boundary image pair exists in this branch. Integration must recompute after accepting those parallel branches; chapter opener distances at coordinate 0 on both sides are 14 from 2 Corinthians 13 to Galatians 1 and 18 from Galatians 6 to Ephesians 1. These expected distances are explicitly distinguished from currently active pairs.

The actual packaged offline engine exercises all six chapters, 149 verses in KJV/ASV/WEB, exact source field equality/types and source/web/offline image byte parity, with zero network calls. It preserves any existing empty edition strings rather than assuming nonempty scripture; Galatians has none. This local Worker test uses source-byte fixtures for the pinned remote image origin and is not a claim about live Site bytes. The separate immutable-origin check below uses actual network responses.

## Immutable hosting and combined integration

Asset commit and public pin: `b6ad042bc2e4589331d06ba87f71d0f61e9e9c89`. It was pushed and its exact remote SHA verified before the manifest was pinned. It contains the entire baseline-plus-Galatians union. All 906 actual immutable raw GitHub URLs passed exact byte and SHA-256 comparison, totaling 115,217,018 bytes. Individual URLs, lengths and hashes are in `galatians-public-origin-verification-2026-11-04.json`.

Only explicit Galatians ID 47 coverage, its filename allowlist, six chapter metadata entries and six hosting members are added. The complete shared source/native assets remain offline. No hosted artwork was restored to the Worker; privacy, immutable pin, byte length, hash, credential/query stripping and fallback restrictions remain intact.

Integrate this branch's full history, including the asset commit. Union chapter keys and hosted members across all ten books; add explicit coverage/hosting rules without dropping earlier members. Create and push a new complete combined asset commit, then repin and verify every immutable URL. This branch pin intentionally contains only baseline plus Galatians, not the other parallel additions. Repeat combined visual/boundary checks and web/native builds before coordinated publication, signing and installations.

## Checks and remaining verification

- Locked `npm ci --registry=https://registry.npmjs.org --cache=/tmp/biblelens-galatians-npm-cache --ignore-scripts` passed, 152 packages; package manifests and lockfile unchanged.
- `check:readability` passed in inherited report-only mode; pre-existing corpus findings remain. Six new alt descriptions average FK grade 4.78, with no overlong sentence or unexplained flagged jargon. Story/content checks passed.
- `build:mobile`, `check:images`, `check:mobile`, `check:release`, the independent six-chapter offline audit, all 1,189 packaged chapter-name/source-text checks and local Worker-only `release:sites` staging passed. A chapter-name check attempted before a generated Worker existed initially reported missing module; it passed after building. Final source identity is `55b28d87d8b8cc6f4d73a5a0224e838cebb533b9a6662aeb0b307c016d9a30fc` on source, web and native, app 1.1.0/build 343 (unreleased branch candidate). Worker size is 64,323,326 bytes against 66,060,288, leaving 1,736,962 bytes. Worker-only staging contains five files under `server` and `.openai`, with no client/static bypass. Measurements and check evidence are in `galatians-check-results-2026-11-04.json`.
- The audit script was finalized after the first build; source-identity comparison caught the stale fingerprint. The bundles were rebuilt from final source and relevant checks repeated before handoff. No hand-edited release metadata was used.
- `git diff --check` passed. Commits use command-scoped `kev-mac <2168970+kev-mac@users.noreply.github.com>` for author/committer.

Browser smoke, phone/iPad viewport checks and screenshots are **not run**: managed Linux has no callable `cua_repl.js`/supported browser tool. Following the Sites skill, no browser substitute was installed and no preview server was started. Public-origin verification passed independently; it does not replace live Site or browser checks.

Live verification is **denied**: ordinary proxied `curl -I https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` received CONNECT HTTP 403 from the enforced environment policy. That exact read was stopped without retry, alternate routing or bypass. No automatic approval-review rejection occurred. The coordinated release must perform actual live/source/offline/signed parity, browser/layout checks, signing, both device installs/version/launch checks and physical-screen inspection where available. Those operations were neither attempted nor claimed complete here.
