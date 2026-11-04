# Luke artwork audit — 2026-11-04

Luke only, reader book ID 41, all 24 chapters. Isolated branch `artwork/luke-2026-11-04` starts from freshly fetched GitHub main `6bd1f514ed876677ab0762695176dfb9d64dfa2e`. Build remains 343; app 1.1.0. This is a branch candidate for the coordinated Mark–Philippians release, not a publication. No other book was started.

## Baseline and preservation

Read AGENTS.md, RELEASING.md, CLAUDE.md, build 343 verification, Obadiah–Matthew combined review, Matthew audit and continuity inventory, and relevant Jeremiah review. The environment initially contained build 342; a fresh fetch established build 343. Its original checkout was clean, with no stashes. All 1,274 baseline asset files remain byte-identical; every earlier chapter-art mapping, scripture source, Story prose/catalog source and placements, renderer, styling, package manifests/lock, release number and sync/security behavior remain unchanged. `/workspace/.agents` is empty and the checkout has no additional `.agents` skills.

The Sites skill and cloud-runtime skill were read. Sites metadata confirms public audience, version 332. A fresh supported source credential was supplied through hidden stdin to a read-only Git clone, with a process-scoped header; no credential was written to disk/Git configuration. The installed Sites source helper is absent. Mirror SHA `57013c141639c6db19098d50708ed6201e396ee2` matches all 1,638 compared production files. No independent newer work was found, and the mirror was not modified.

## Coverage

20 new accepted chapter openers plus four retained verse-1 Stories give exactly one opener in each chapter. All 12 Luke Stories and the additional inherited topical New Covenant placement at 22:20 remain, for 13 retained Story placements and 33 total image placements. No original Story image was replaced. Twenty-one generated files include one versioned repair: Luke 20 v1 had tiny generated lettering and was rejected; v2 removes it. V1 remains in source history and on disk but is inactive and absent from the hosted manifest.

| Chapter | Opener | Textual anchor / retained Story |
| --- | --- | --- |
| 1 | `chapter-luke-01-opening-v1.webp` | Luke 1:1–4 |
| 2 | `chapter-luke-02-opening-v1.webp` | Luke 2:8–12 |
| 3 | `chapter-luke-03-opening-v1.webp` | Luke 3:3–9 |
| 4 | `chapter-luke-04-opening-v1.webp` | Luke 4:1–4 |
| 5 | `story-the-miraculous-catch-v1.webp` | The Miraculous Catch |
| 6 | `chapter-luke-06-opening-v1.webp` | Luke 6:1–5 |
| 7 | `story-the-centurion-and-the-widow-s-son-v1.webp` | The Centurion and the Widow's Son |
| 8 | `chapter-luke-08-opening-v1.webp` | Luke 8:5–8 |
| 9 | `chapter-luke-09-opening-v1.webp` | Luke 9:13–17 |
| 10 | `chapter-luke-10-opening-v1.webp` | Luke 10:30–37 |
| 11 | `chapter-luke-11-opening-v1.webp` | Luke 11:33–36 |
| 12 | `chapter-luke-12-opening-v1.webp` | Luke 12:27–28 |
| 13 | `chapter-luke-13-opening-v1.webp` | Luke 13:18–19 |
| 14 | `chapter-luke-14-opening-v1.webp` | Luke 14:7–24 |
| 15 | `story-the-lost-sheep-coin-and-son-v1.webp` | The Lost Sheep, Coin and Son |
| 16 | `chapter-luke-16-opening-v1.webp` | Luke 16:1–9 |
| 17 | `chapter-luke-17-opening-v1.webp` | Luke 17:5–6 |
| 18 | `chapter-luke-18-opening-v1.webp` | Luke 18:9–14 |
| 19 | `story-zacchaeus-v1.webp` | Zacchaeus |
| 20 | `chapter-luke-20-opening-v2.webp` | Luke 20:9–18 |
| 21 | `chapter-luke-21-opening-v1.webp` | Luke 21:1–4 |
| 22 | `chapter-luke-22-opening-v1.webp` | Luke 22:14–20 |
| 23 | `chapter-luke-23-opening-v1.webp` | Luke 23:50–56 |
| 24 | `chapter-luke-24-opening-v1.webp` | Luke 24:1–12 |

Chapter images remain directly below chapter headings and before verse 1; verse-1 Stories count without duplicate openers. Existing Story placements, useful alt text, hidden generic chapter captions and small italic Story captions remain. New descriptions start “Imagined scene:”. The 20 new alt fields average FK grade 6.04, with no overlong sentence or flagged jargon.

## Full-size visual and identity review

Each accepted final WebP was inspected at its full 960×540 resolution. All 13 retained Story images were inspected at 1200×675. Eight unscaled side-by-side 2400×675 comparisons cover Matthew/Luke birth, flight/temple aging, approved baptism/Nazareth, calling/catch, catch/Nain, Nain/anointing, Zacchaeus/Emmaus and Emmaus/ascension. Both approved baptism anchors, actual Matthew calling image, Mark’s neighboring empty tomb and John’s Cana scene were also inspected. Temporary review pairs remain under `/tmp/luke-pairs`; durable paths, findings and limits are in the continuity inventory.

The suggested `story-the-calling-of-the-first-disciples-v1.webp` does not exist. The actual approved file is `src/assets/story-calling-the-first-disciples-v1.webp`, as the Matthew inventory states. Adult Jesus remains brown-complexioned with natural dark curls, full beard, angular nose and lean adult build across the retained ministry scenes. Parallel accounts introduce no decades of aging. Mary and Joseph are compatible across Matthew and Luke infancy scenes, with plausible parental aging twelve years later at the temple. The infant face is small/partly hidden and is not certified as a precise portrait anchor. John the Baptist is not apostle John. Unnamed disciples are not assigned names from clothing; hidden faces and off-frame counts are not certified.

The existing Luke 22:20 New Covenant art depicts Jeremiah, consistent with its topical Story, not a portrait of Jesus at the supper. Its thematic cross-reference and original prose/placement are inherited; the new bread/cup opener supplies Luke-specific context. Luke 16’s parable Lazarus is not conflated with John 11’s Lazarus. Different Marys, Josephs and Johns are not silently merged. Paul/Saul, Barnabas and Stephen appear among cross-book candidate records but are not portrayed by new Luke work. Textual mentions in the inventory are explicitly not evidence of visible faces. Superseded Matthew Transfiguration v1 is not an identity reference.

Every generation supplied the actual approved `src/assets/chapter-genesis-07-opening-v1.webp` as a style-only input. The Luke 20 repair also supplied the actual v1 target. No new image contains an identifiable person or recurring human group, so no new identity input was needed. No portrait depends on a parallel branch. Varied natural blues, greens, red/purple textiles, daylight, cloud, dusk and night prevent repeated amber grading. Imagined landscape/plant/architecture details are not archaeological or botanical claims.

Five loaves and two fish in chapter 9 and two small coins in chapter 21 were individually counted. Sheep faces/ears/resting bodies, fish eyes/fins/mouths, retained donkey and dog, hands/fingers/grips/limbs, parent-child relationships and narrative actions were reviewed. No definite visible anatomy contradiction remains; hidden detail is not certified. Chapter 23 closes the tomb for burial, and chapter 24 shows it open at dawn. Objects, parable landscapes and unlettered writing materials introduce the chapter’s themes without claiming to depict every opening verse.

## Spacing and boundaries

The complete-canon audit uses the actual build-343 enriched production Story catalog. Raw catalog source remains byte-identical. It records both adjacent and all pairs under five verse positions and compares like conventions. Opener coordinate 0 remains 63 adjacent / 64 all near pairs, with no new close pair. Opener coordinate 1 changes from 67/68 to 68/69: Luke 1 opener at 1 to retained Births Story at 5 has gap 4 (gap 5 under coordinate 0). This required opener plus original Story placement is deliberately disclosed; no scripture, Story prose or placement was moved to hide the finding. Every inherited pair remains in the machine ledger.

Mark 16:1 → Luke 1 opener has gap 19 at coordinate 0 / 20 at coordinate 1. Luke 24:36 Ascension → John 1:35 Cana Story has gap 52 under either convention. No close book-boundary pair is introduced. Combined integration must recompute these using accepted Mark and John branches, including their newly required openers; their unreviewed assets were not presumed approved.

## Hosting and immutable assets

The baseline 900 hosted members plus 20 Luke openers form the 920-member union. Exact public asset pin: `504dbc3b7db4df274953c4179233dc89a0c4c8ba`, pushed and remote-SHA verified before pinning. Both asset commits must be retained when integrating. All 920 actual immutable raw-GitHub URLs were fetched and matched source bytes/SHA-256, totaling 117,338,752 bytes, with zero errors. Luke’s accepted assets total 3,048,580 bytes. Per-file hashes are in the public-origin and artwork audit JSON files.

Only explicit Luke ID 41 and the Luke filename rule extend coverage/hosting. Mark ID 40 is not silently registered in this branch. Every prior manifest member remains; all active source images remain offline. Worker public-origin/hash/length/privacy checks remain intact, and hosted art is not embedded into the Worker. At integration union all ten branch metadata sets and public assets, push a new immutable union commit, repin and verify it. This branch pin does not contain the other nine books.

## Checks and limits

- Locked dependency installation passed using `npm ci --registry=https://registry.npmjs.org --cache=/tmp/biblelens-luke-npm-cache --ignore-scripts`: 152 packages, manifests/lock unchanged.
- Final `npm run build:mobile` passed. Source/web/native candidate identity: app 1.1.0/build 343, source fingerprint `f96763f27f7c175c757f31b382111cdfdf82cc63d22248b184178efe92a909a0`. A preliminary build was repeated after preserving original Unicode serialization in chapter metadata; final outputs match the final source.
- `npm run check:images` passed: all 981 registered chapters, all 276 Story images, exact source/web/offline bytes, placement, renderer/caption/alt checks and fail-closed coverage. Its dedicated inherited 1 Samuel close-pair disclosure is distinct from the complete-canon ledger above.
- `npm run check:mobile` passed for mobile chrome and actual worker engine reading/search/chat/concurrency/abort behavior with zero network calls. It does not simulate native inference or rendered device screens.
- `npm run check:release` passed for deterministic source identity, binary hashing, output exclusion, Worker-only Sites packaging, CSP/sync guards, refresh, encoding and public artwork hash/length/privacy/cache/fallback fixtures. Local fixture success is not actual live verification.
- Content checks `check-stories.mjs`, `check-chapter-names.mjs`, and `check-story-topics.mjs` passed. `check:readability` exited zero in inherited report-only mode and reports existing corpus findings; it is not a strict corpus readability pass. The separate 20-alt review meets grade/length/jargon thresholds.
- Independent artwork audit passed: baseline preservation, all 24 single openers and complete-canon pair/boundary records. The final enriched production Story catalog matches the saved build-343 baseline bytes exactly.
- Independent actual packaged offline-engine check passed all 24 Luke chapters, 33 image placements, every verse in KJV/ASV/WEB, exactly one opener and zero network calls. Existing empty strings are preserved at Luke 17:36 ASV and WEB, and Luke 23:17 ASV. Types and exact source equality are checked, not assumed nonempty text.
- `release:sites` local staging passed at `/tmp/luke-sites-stage/dist`: five files under only `server` and `.openai`, no client/static bypass. Final compressed Worker: **64,330,571 bytes** against **66,060,288**, leaving **1,729,717 bytes**. Combined integration must remeasure.
- Actual public-origin union check passed 920/920 assets and every per-file byte length/hash. The handler fixture checks remain separate from these real network fetches.
- `git diff --check` passed. All commits use privacy-safe `kev-mac <2168970+kev-mac@users.noreply.github.com>` for author and committer, scoped to each commit. Dedicated branch push and full remote SHA verification are the handoff boundary.

Live release access is denied: the ordinary environment-proxy HEAD request to `https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` received CONNECT HTTP 403. That route was stopped without retry or bypass. Native Sites metadata, a matching mirror and actual public-origin checks are separate evidence and do not verify live candidate bytes. No auto-review rejection occurred.

Browser smoke and phone/iPad rendered-layout checks were not run: `SITES_MANAGED_LINUX_CONTAINER=1` but no callable `cua_repl.js` tool exists. Per the Sites skill no substitute browser was installed or improvised and no preview server was started. Full browser search/smoke, candidate live-origin decoding, `release:verify`, signed/native byte comparison, signing, device installation/launch/version and physical-screen inspection remain for the coordinated release. No paid API, new API credential, security change, denied-route bypass, main push/merge, Site publication, install or build-number change occurred.

No unresolved new identity dependency remains. Review the disclosed Luke 1 image spacing and inherited Jeremiah topical placement during combined integration. Stop after this pushed Luke feature branch; the coordinated session owns publication and installation.
