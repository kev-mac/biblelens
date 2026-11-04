# Romans artwork review — 2026-11-04

Romans only, reader ID 44, all 16 chapters. Isolated worktree `/workspace/romans`, branch `artwork/romans-2026-11-04`, starts at freshly fetched canonical main `6bd1f514ed876677ab0762695176dfb9d64dfa2e`. Read AGENTS.md, RELEASING.md, CLAUDE.md, build 343 verification, Obadiah–Matthew combined review, Matthew's audit, inventory and approved handoff, and the current production Story metadata. The checkout has no `.agents/skills`; `/workspace/.agents` is empty. The managed environment completed its supported startup wait successfully. This delegated session ends at a verified pushed feature branch; combined publication and native installation belong to the release coordinator.

## Source and preservation

The Sites native service confirms public version 332. A fresh credential was used through hidden stdin and a child-process-only authorization header to clone the existing mirror read-only; no credential was written to disk or Git config. Its HEAD is `57013c141639c6db19098d50708ed6201e396ee2`. All 1,637 compared production files match canonical main. See `romans-mirror-comparison-2026-11-04.json`. No mirror or live source was changed.

All 1,274 baseline asset blobs remain byte-identical. Earlier chapter mappings, all Story artwork and placements, scripture, Story prose, renderer, styles, package/lockfile and release/build number remain unchanged. This branch remains app 1.1.0/build 343; it is a candidate, not another published build 343. The starting checkout and stashes are preserved. New images total 2,094,230 bytes; individual WebPs range from 75,018 to 176,422 bytes.

## Complete coverage

Romans had no existing Story or chapter image. Sixteen generated and accepted chapter openers, zero retained Romans Stories and zero replacements now provide exactly one image beneath each chapter heading before verse 1. Generic chapter captions remain hidden; the existing small italic Story captions elsewhere remain untouched. All descriptions begin `Imagined scene:`. These scenes introduce chapter imagery rather than claiming that each first verse literally depicts the scene. Objects, landscapes and buildings are imagined illustrations, not archaeological evidence or precise reconstructions.

| Chapter | Imagery and textual anchor |
| --- | --- |
| 1 | Sea, hills and broad sky; creation, 1:19–20 |
| 2 | Balanced scales and scroll; impartial judgment and law, 2:1–16 |
| 3 | Open scrolls; law and prophets, 3:19–22 |
| 4 | Stars, hills and an empty tent; Abraham's promise, 4:17–21 |
| 5 | A green shoot after a storm; metaphor for endurance and hope, 5:1–5 |
| 6 | Clear water and empty stone steps; baptism and new life, 6:3–4 |
| 7 | A scroll in lamplight; the law, 7:6–7 |
| 8 | A green valley after rain; creation awaiting renewal, 8:19–23 |
| 9 | Clay, jars and an idle wheel; potter and vessels, 9:20–21 |
| 10 | A mountain path; good news on the mountains, 10:15 |
| 11 | A bound olive graft; the olive tree metaphor, 11:17–24 |
| 12 | Bread, water and a welcome place; hospitality and feeding others, 12:13,20 |
| 13 | Coins and a pouch; tribute, 13:6–7 |
| 14 | Bread, vegetables and a shared table; meals and mutual respect, 14:1–3,17–21 |
| 15 | Bread basket, travel bundle and staff; aid and journey, 15:25–28 |
| 16 | Empty seats in a house courtyard; the house gathering, 16:3–5 |

Each file is `src/assets/chapter-romans-NN-opening-v1.webp`, 960×540. Blank scrolls do not invent quotations. The chapter 11 graft visibly joins a living branch with binding; its leaves, cut and join were inspected. Scales, pans and chains, pottery rims, lamp spouts, basket weaving, food, coins, furniture and paths were checked against the scene's role. No definite visible object or text contradiction was found. No animal or human anatomy occurs in these new files.

## Actual visual inputs and continuity

Every generation call supplied the actual `src/assets/chapter-genesis-07-opening-v1.webp` as a style-only image input. Every generated original was viewed at native resolution, and final compressed images were compared together in a full-resolution review grid. Natural blues, greens, cream stone, red/purple cloth, clear daylight, overcast light, twilight and night vary the palette. No recurring person or recognizable human group is depicted, so no new portrait identity reference is needed and no parallel branch identity is presumed approved. Original generated PNG paths and actual tool-input evidence are recorded in `romans-generation-evidence-2026-11-04.json`; final accepted WebPs are durable source assets. Temporary PNGs/grid are execution artifacts, not required runtime files.

`romans-continuity-inventory-2026-11-04.json` inventories current-main Gospel/Acts Story candidates and earlier named-person image metadata. A textual mention is explicitly not proof that a person is visible. Matthew's inventory and combined review supply the earlier approved Mary/Joseph, adult Jesus, Baptist and disciple review. This session additionally viewed the actual Matthew/Mark baptism images and Matthew calling image, plus Stephen, Saul's conversion, the first journey, Philippi, Athens, Jerusalem arrest, the hearing and shipwreck. The requested candidate `story-the-calling-of-the-first-disciples-v1.webp` is absent; the actual approved mapping is `story-calling-the-first-disciples-v1.webp`, which was inspected. The approved adult Jesus traits remain brown complexion, natural dark curls, full beard, angular nose and lean adult build. Clothing alone does not establish identity. John the Baptist is not apostle John; Romans 16 Mary is not silently mapped to Mary the mother of Jesus or Mary of Bethany. King Saul is distinct from Saul/Paul.

There is an inherited Acts uncertainty for its owner/coordinator: `story-paul-s-first-journey-v1.webp` shows a markedly receded hairline, whereas `story-paul-in-philippi-v1.webp` and the later Jerusalem scenes show dense dark curls. Narrative time should not silently reverse baldness. This session does not certify those depictions as one consistent visible Paul or use that uncertain image as a portrait anchor. They are unchanged and outside Romans' edit scope; the parallel Acts review must assess them. Romans adds no person and has no unresolved portrait dependency. The superseded Matthew Transfiguration v1 stays inactive; accepted cloud-covered v2 remains untouched. No uncertain Moses/Elijah faces were reused.

## Spacing and preservation evidence

`scripts/check-romans-artwork.mjs` uses the enriched production Story catalog, not only the raw Story list. The complete-canon ledger in `romans-artwork-audit-2026-11-04.json` records every adjacent and every all-pairs gap below five verse positions, with exact locations. Baseline and current match exactly: opener coordinate 0 gives 63 adjacent / 64 all; coordinate 1 gives 67 adjacent / 68 all. None touches Romans. The preceding actual image is the Acts 27:1 Shipwreck Story, 74 positions before Romans 1's coordinate-0 opener (75 at coordinate 1). Current main has no chapter art in Acts 28 or 1 Corinthians; the next actual image after Romans is Hebrews 8:6. Do not mistake that absence for an approved future boundary. Recompute all close pairs and Acts/Romans/1 Corinthians boundaries after accepting neighboring branches.

## Hosting and integration

Asset commit and immutable public pin: `aefeae7462abe0b63b1b4844fc2211f3d7bc9c2a`, pushed and verified before pinning. It contains the complete 916-member baseline-plus-Romans union: every previous 900 member plus these sixteen images. All 916 actual immutable public GitHub origin responses matched local bytes/SHA-256, totaling 116,384,402 bytes. The per-file results are in `romans-public-origin-verification-2026-11-04.json`. Local handler fixtures alone are not the evidence for this origin check.

Only explicit Romans ID 44 coverage, the `romans` filename rule, and ID-44 hosting membership are added. No unreviewed neighboring book is declared complete. The existing source-only public origin, byte/hash/size validation, private-query and credential stripping, redirect policy and native offline architecture remain. No hosted artwork is embedded back into the Sites Worker.

Integrate the asset commit and final branch head together. Merge chapter mappings by key, hosted paths by set union and explicit book entries without losing the other sessions' work. Push a new combined immutable asset-union commit before repinning all ten books. Rebuild web/native from one source state, recompute source identity and worker headroom, then perform the coordinated browser/live/signed/device checks and choose the next release number. This branch's pin deliberately does not include the other nine books' new assets.

## Checks and limits

- Locked official-registry installation passed: `npm ci --registry=https://registry.npmjs.org --cache=/tmp/biblelens-romans-npm-cache --ignore-scripts`, 152 packages; manifests/lock unchanged.
- Source coverage, opener rendering, hidden generic captions, fail-closed missing coverage, baseline asset/source equality and complete-canon spacing passed.
- `npm run build:mobile`, `npm run check:images`, `npm run check:mobile`, `npm run check:release`, and `npm run check:readability` passed. Image checks cover 973 registered chapters and all existing Story art with exact source/web/offline parity. Corpus readability is inherited report-only mode with existing findings, not a strict corpus certification. The sixteen new alt fields average grade 5.64, with zero overlong sentences or flagged jargon.
- All sixteen actual offline-engine chapter requests passed with exact image metadata, source/native bytes, verse counts and exact edition field presence/type/value; zero network calls. See `romans-offline-verification-2026-11-04.json`.
- The first offline audit incorrectly required every edition field to exist as a string. Source inspection established eight inherited empty strings and two absent WEB fields at Romans 16:26–27. The corrected audit preserves their exact source state, explicitly asserts the two missing fields, and passes. Scripture was never edited. A final build/check pass follows the changed audit script because scripts contribute to the release fingerprint.
- `release:sites` stages only the five-file Worker package under `/tmp/romans-sites-stage/dist`; no client/static bypass. Final Worker size/source identity are recorded in the companion check-results file.

Live access is **denied**: ordinary inherited-proxy `curl -I --max-time 20 https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` returned CONNECT HTTP 403. It was stopped without bypass or retry. Native Sites metadata and mirror comparison succeeded independently; neither substitutes for live candidate checks.

Managed browser smoke and phone/iPad layouts are **not run**: `SITES_MANAGED_LINUX_CONTAINER=1` and no callable `cua_repl.js` is supplied. The Sites skill prohibits improvised browser paths in this case, so no browser was installed or preview server started. Signing, signed-app parity, device installs/launches and physical screens are **not run** in this session and remain for coordinated release. No automatic approval-review rejection occurred. No main merge/push, publication, install, version bump, new credential provisioning, paid API use or next-book/session start was performed.
