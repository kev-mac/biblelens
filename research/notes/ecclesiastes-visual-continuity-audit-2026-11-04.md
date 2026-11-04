# Ecclesiastes artwork and continuity audit — 2026-11-04

Scope: Ecclesiastes only, reader book ID 20, twelve chapters. Feature branch `art/ecclesiastes-chapter-openers-2026-11-04` starts at freshly fetched canonical main `846ba467f3094e065d5d3489c5bb897908f2bf79`, build 341. Read AGENTS.md, RELEASING.md, CLAUDE.md, the Proverbs and 1 Kings visual audits, the ten-book combined continuity review, and build 341 release verification before implementation. The delegated cloud-session instructions override the default publication/install workflow: stop on a dedicated pushed feature branch; no release, merge, main push, build-number change, installation or paid API use.

## Source comparison

Sites public metadata reports version 330. A fresh credential was passed only through hidden stdin and an ephemeral child-process Git configuration to clone the source read-only. The source helper is unavailable locally, so ordinary authenticated Git was used. Mirror main `6489207c16040f17c2247db76080520fc6f422b0` has no mirror-only tracked paths and every shared tracked file matches canonical main. See `ecclesiastes-source-comparison-2026-11-04.json`. No mirror work needs integration. The mirror was not edited or pushed.

One direct GET of the live `/release.json` returned HTTP 403. That denied read was not retried or bypassed. Metadata and matching source do not establish current live image bytes.

## Chapter decisions and text comparison

The baseline has no Ecclesiastes chapter art, Story placements or asset files. Add exactly one opener at `afterVerse: 0` for each chapter. The unchanged shared reader places it below the chapter heading and before verse 1. Alt text starts with “Imagined scene:”; generic chapter captions remain absent. All earlier inline art, Story captions, metadata, scripture and asset bytes remain unchanged.

| Chapter | Literary anchor | Accepted scene |
| --- | --- | --- |
| 1 | 1:5–7 | River mouth, sea, sun and wind-blown reeds |
| 2 | 2:4–6 | Orchard, vineyard, stone pool and irrigation channel |
| 3 | 3:1–2 | Young grain and mature wheat; v2 replaces maize-like seedlings |
| 4 | 4:12 | Three component strands joining into a strong cord |
| 5 | 5:10 | Silver pieces and pouch, illustrating desire for wealth |
| 6 | 6:7 | Bread and lentils, illustrating work for food and unmet desire |
| 7 | 7:6 | Thorn fire beneath a clay cooking pot |
| 8 | 8:2–4 | Empty chair in an imagined royal audience hall |
| 9 | 9:7–8 | Bread, wine, ointment jar and white linen |
| 10 | 10:10 | Iron axe and sharpening stone beside split wood |
| 11 | 11:3–6 | Seed basket and furrows beneath uncertain rain |
| 12 | 12:5–6 | Broken pitcher at a fountain, framed by almond blossom |

These illustrate imagery within their chapters; they do not claim every picture depicts verse 1. The chapter 6 still life does not assert that an identified wealthy man enjoyed his possessions. Chapter 8 does not assign an unnamed king the identity of Solomon. Architecture, tools and landscapes are imagined settings, not exact reconstructions or historical evidence. Chapter 3 juxtaposes planting and ripe grain as literary imagery without claiming a single crop ripened instantly. It replaces the first generated candidate's broad maize-like leaves with narrow young grain. The inactive v1 remains in source history and is excluded from active hosting.

Thirteen candidates were generated for twelve accepted images. Every call received the actual approved `src/assets/chapter-genesis-07-opening-v1.webp` as a style-only input. Chapter 3's edit also received its actual v1 file. No ark or person from the style file was copied. All final images were inspected at their native 960×540 size for coherent objects, materials, scene relevance, lighting and accidental writing. No human or animal appears, so no visible anatomy or identifiable recurring group is introduced. Chapter 4 has three visible component strands; chapter 7's pot is supported by stones; chapter 10's tool head and handle are coherent; chapter 12's pitcher and fragments are compatible. The restrained finish and natural colors vary across blue water, green gardens, pale linen, silver, indigo cloth and violet evening light.

Generation provenance is in `ecclesiastes-artwork-generation-2026-11-04.json`; per-chapter anchors, paths and alt text are in `ecclesiastes-artwork-plan-2026-11-04.json`. Originals remain in `/workspace/generated_images`; source WebPs are resized/transcoded derivatives with no compositional edits outside the image tool.

## Recurring people and continuity

The speaker is described as the son of David and king in Jerusalem. This audit does not equate that literary framing with an established visual identity. The preceding source inventory records 24 Story candidates mentioning David or Solomon across earlier books; textual mention does not certify a visible person. Consult `ecclesiastes-prior-artwork-inventory-2026-11-04.json` and the build 341 combined review for approved identifications.

The build 341 combined review inspected actual Solomon appearances in `story-solomon-becomes-king-v1.webp`, `story-solomon-s-wisdom-v1.webp`, `story-the-queen-of-sheba-and-solomon-s-decline-v1.webp`, `story-david-s-last-charge-and-death-v1.webp` and `story-solomon-s-reign-and-the-queen-of-sheba-v1.webp`. Its approved stable traits are medium-brown complexion, tight dark curls, prominent nose, defined jaw, beard and adult build. That prior review does not supply an old-age portrait for an invented Ecclesiastes narrator. David's appearances and aging remain documented in the Samuel and combined audits. Neither man, the speaker, nor any identifiable recurring group is portrayed in the new scenes. There is no dependence on unapproved parallel artwork and no pending portrait continuity repair.

## Hosting, offline preservation and integration

Asset commit `2bbbdf511c60ca165f637f9ffcb04c5ded48d674` was pushed only to this feature branch before adding the pin. All twelve accepted files use the existing same-origin immutable public-artwork mechanism. `data/hosted-artwork.json` preserves the earlier 634 paths and adds twelve, for 646 total; its pin names that asset commit. The hosted allowlist and explicit chapter registry extend through Ecclesiastes. No image handler, credential behavior, request policy, offline reader or mobile packaging code changes.

All twelve immutable public-origin downloads match source bytes and SHA-256; see `ecclesiastes-public-origin-verification-2026-11-04.json`. All 646 manifest files also match the pinned commit's Git blobs. Every active new source file is 960×540 and below 250,000 bytes; together they total 1,560,648 bytes. Native packaging must retain these same local files; no remote-only native dependency is introduced. Actual built native availability and web/native parity remain unverified because the build cannot run here.

The build 341 Worker was 64,747,604 bytes against the Sites budget of 66,060,288 bytes. The current Worker cannot be measured without a build. Do not infer that the combined batch fits from this source-only work. At integration, union chapter keys and hosted paths, retain each explicit book ID/allowlist alternative, and re-pin to a pushed public commit containing all parallel assets. Do not take an entire side of the hosted-manifest conflict. Rebuild web/mobile and measure the final Worker before any release. Build number remains 341.

## Checks and limitations

- `node research/notes/ecclesiastes-source-audit-2026-11-04.mjs`: passed. All twelve openers, useful alt text, source renderer placement, hidden generic captions, missing-opener rejection, hosted registration and prior source preservation pass. It uses the production Story transforms rather than raw Story data for headings. All 991 baseline asset blobs and all earlier chapter metadata, scripture, Story catalog/mappings and package metadata are unchanged.
- Image-spacing audit: no pair involving Ecclesiastes is below five verse positions in the current branch, including preceding Proverbs and existing following-book metadata. Opener distances are at least ten within Ecclesiastes; Proverbs 31 → Ecclesiastes 1 is 31. A future Song of Solomon 1 opener would be 14 positions after Ecclesiastes 12's opener. Repeat the full spacing ledger after integration with that branch's inline art.
- `npm run check:readability`: exit 0 in inherited report-only mode; existing corpus findings remain. Scripture and Story prose are unchanged.
- `node scripts/check-public-artwork.mjs`: passed, including hashes, cache, fallback and no forwarded credentials/private query data.
- `node scripts/check-mobile-chrome.mjs`: passed. This source fixture does not verify chapter layouts or offline packaging.
- `npm run build:mobile`: blocked with `ERR_MODULE_NOT_FOUND` for `esbuild`. Project dependencies including esbuild, minisearch, purgecss, wordnet-db, wink-lemmatizer and playwright are absent. The session forbids installation, so no packages were installed.
- `npm run check:images`: unavailable because `dist/server/index.js` is absent. `npm run check:mobile`: its chrome fixture passes, then fails because `www/index.html` is absent. `npm run check:release`: release-identity fixture passes, then packaging fails because `dist/asset-manifest.json` is absent. These suites are not reported as passed.
- Managed Sites runtime is enabled, but the required managed browser tool is not callable. Following Sites preview guidance, no substitute browser, browser installation or preview server was used. Phone/iPad layout, actual browser decoding, physical devices, signed assets and installed offline reading remain unverified. No device was available or installed.
- Live checks remain denied HTTP 403. No automatic approval-review rejection occurred. No route or credential bypass was attempted.
- `git diff --check`: passed. Git commits use the verified existing public-history identity `kev-mac <2168970+kev-mac@users.noreply.github.com>`, replacing the checkout's private-email default for this repository only.

Logs are retained under `/tmp/ecclesiastes-*.log`. Remaining work is integration-stage build, full image/release/mobile checks, Worker budget measurement, combined spacing/continuity review, phone/iPad layouts and eventual separately authorized release verification. No other book was started.
