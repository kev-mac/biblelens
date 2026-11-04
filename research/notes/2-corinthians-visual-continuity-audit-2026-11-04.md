# 2 Corinthians artwork review — 2026-11-04

2 Corinthians only, reader ID 46, all 13 chapters. Branch `artwork/2-corinthians-2026-11-04` starts from freshly fetched main `6bd1f514ed876677ab0762695176dfb9d64dfa2e`. This session stops at a verified pushed branch; coordinated integration owns review of the ten-book union, publication, signing and installation. Build stays 343, app 1.1.0.

## Source and preservation

Read AGENTS.md, RELEASING.md, CLAUDE.md, build 343 release verification, Obadiah–Matthew combined review, Matthew visual continuity audit and its continuity inventory. The checkout has no `.agents/skills`; `/workspace/.agents` is empty. The managed runtime initially was starting; supported `wait_for_environment` returned ready before filesystem work. No terminal infrastructure failure occurred.

Sites reports public version 332. Its freshly opened source head is `57013c141639c6db19098d50708ed6201e396ee2`. All 1,638 compared tracked production files match starting GitHub main. The Sites source helper is unavailable here, so a read-only shallow clone used the supported fresh source credential through hidden stdin, held only in a child process authorization environment. No token was stored in files, shell arguments or Git config. The mirror was not modified or pushed. A first stdin setup exited with EOF before receiving any credential; the corrected invocation completed successfully.

All 1,274 baseline source asset files remain byte-identical. Every previous chapter and Story mapping, scripture, Story prose, renderer, captions, CSS, package manifest and lockfile remains unchanged. There was no initial dirty work or stash to alter in this checkout; no other checkout was overwritten. The production Story catalog rebuilt from build 343 source matches the saved baseline SHA-256 exactly.

## Every chapter's coverage

There were zero existing 2 Corinthians chapter images and zero Story placements in the baseline production catalog. Thirteen new chapter images provide exactly one opener per chapter, directly below its heading and before verse 1 (`afterVerse: 0`), with no duplicate Story opener. All are 960×540 versioned WebPs, with useful `Imagined scene:` alt text. The renderer still hides generic chapter captions and retains small italic Story captions throughout the existing corpus.

| Chapter | Scene | Textual anchor | Active file suffix |
| --- | --- | --- | --- |
| 1 | Sheltered harbor after a storm | 1:3–11,15–16 | `01-opening-v1.webp` |
| 2 | Open door toward a coastal path | 2:12–13 | `02-opening-v1.webp` |
| 3 | Scroll, ink, reed pen and linen veil | 3:1–3,13–16 | `03-opening-v1.webp` |
| 4 | Treasure in an ordinary clay jar | 4:7 | `04-opening-v1.webp` |
| 5 | Worn linen tent at dusk | 5:1–4 | `05-opening-v1.webp` |
| 6 | Wooden yoke beside a field | 6:14 | `06-opening-v1.webp` |
| 7 | Basin of water in a refreshed courtyard | 7:1,4–13 | `07-opening-v1.webp` |
| 8 | Modest gifts prepared for a shared journey | 8:2–4,12–15 | `08-opening-v1.webp` |
| 9 | Seed, furrows and grain | 9:6,10 | `09-opening-v1.webp` |
| 10 | Tied letter by a coastal window | 10:9–11 | `10-opening-v1.webp` |
| 11 | Empty basket and rope at a city wall window | 11:32–33 | `11-opening-v2.webp` |
| 12 | Thorn branch and new leaves | 12:7–10 | `12-opening-v1.webp` |
| 13 | Courtyard prepared for a peaceful gathering | 13:10–11 | `13-opening-v1.webp` |

All filenames begin `src/assets/chapter-2-corinthians-`. These are literary or setting illustrations, not archaeological evidence, exact surviving locations, or claims that every verse-1 sentence depicts the scene. The doorway and yoke are metaphors; chapter 12 does not diagnose Paul's unspecified thorn. Sowing and harvest appear in adjacent parts of a landscape, not as a claimed miraculous instant harvest. Coins are a visual interpretation of treasure or gifts, not identified historical specimens. Blank scrolls do not fabricate a biblical document or quotation.

## Visual review and identity continuity

All 13 original generations supplied the actual `src/assets/chapter-genesis-07-opening-v1.webp` as a style-only image input. Each original was inspected at its generated resolution against its intended verses and the style image. Scenes contain no humans, animals or identifiable recurring group. Visible ropes, basket weaving, jar mouths, coins, reed pens, yoke bows, tent poles/ropes, benches, leaves and setting were checked for coherence. No human or animal anatomy is present to certify. Colors vary across blue dawn, green daylight, purple dusk, cool night and muted red/blue textiles, with grounded natural materials and restrained illustration.

Chapter 11's first generated image had signature-like marks at the bottom-right. It was rejected, edited with that actual image as input, and the repaired result was independently viewed. Its v1 is retained inactive in source; v2 is the only mapped/hosted chapter-11 image. Counts: 13 accepted new openers, zero retained book images, zero replacements of pre-existing book art, 13 original generations plus one repair edit. There are 14 new WebP source files because of the inactive v1. Active new art totals 1,990,078 bytes; the largest is 198,882 bytes.

`2-corinthians-continuity-inventory-2026-11-04.json` inventories the 64 relevant approved-main Gospel/Acts source candidates and links the prior Matthew inventory, including Paul/Saul, Timothy/Titus, Jesus, Mary/Joseph, John, disciples, Barnabas/Stephen and Moses/Eve allusions. Textual mentions are not proof that a named person is visible. Actual Matthew baptism, first-disciple calling and Mark baptism anchors were inspected together: compatible brown complexion, natural dark curls, full beard, angular nose and lean adult Jesus; no added aging between parallel accounts. The requested `story-the-calling-of-the-first-disciples-v1.webp` does not exist; the actual approved mapping is `story-calling-the-first-disciples-v1.webp`.

No portrait was generated, so there is no new identity-input dependency on the concurrent Acts, Gospel or letter sessions. No clothing-based name-to-face assignment, hidden count certification, Moses/Elijah portrait reuse or Transfiguration-v1 reactivation was made. Existing source candidates were not silently certified as a complete independent portrait review.

## Spacing and public hosting

The complete-canon ledger uses the actual reconciled build 343 production Story catalog, verified unchanged after rebuilding. It records adjacent pairs and all pairs below five verse positions using both opener coordinates. Baseline and branch are identical: 63 adjacent / 64 all with opener at coordinate 0; 67 adjacent / 68 all with opener at coordinate 1. All are inherited, and none touches 2 Corinthians. Every exact endpoint, source and gap is in `2-corinthians-source-verification-2026-11-04.json`.

At coordinate 1, actual baseline-art neighbors are Acts 27:1 to 2 Corinthians 1:1 (948 positions), and 2 Corinthians 13:1 to Hebrews 8:6 (1,054 positions). 1 Corinthians and Galatians currently have no baseline artwork. Prospective opener-only boundary distances are 24 from 1 Corinthians 16:1 to 2 Corinthians 1:1 and 14 from 2 Corinthians 13:1 to Galatians 1:1. Integration must recompute actual pairs after adding neighboring parallel work, including any later Story images; those prospective distances do not approve unreviewed branches.

Asset commit and exact public pin: `da7f1bd2d8286f6fb4bd12d2d9a698a22daede05`, pushed and remote-verified before pinning. It contains the entire baseline-plus-this-book source asset union. All 900 previous hosted members remain; 13 active new members bring the union to 913. Every immutable raw GitHub asset was fetched and matched source bytes and SHA-256: 913/913, 116,280,250 bytes. Exact per-file hashes are in `2-corinthians-public-origin-verification-2026-11-04.json`; new-art hashes and generation provenance are in `src/assets/2-corinthians-chapter-art.provenance.json`.

Hosting adds only explicit reader ID 46 and the `2-corinthians` filename rule. Privacy, request stripping, hash/size checks, allowlisted origin, redirect policy and native offline copies remain. No artwork was restored into the Sites Worker. Final Worker is 64,327,344 bytes against 66,060,288, leaving 1,732,944 bytes. Local `release:sites` produces the five-file Worker-only package under `/tmp/2cor-sites-stage/dist`, without a static/client bypass.

## Completed checks and precise limits

- Locked npm install passed from the official registry using `/tmp/biblelens-2cor-npm-cache`, with `--ignore-scripts`; manifests/lockfile unchanged.
- Final `build:mobile` passed, including web and native builds and its search/retrieval/bootstrap checks. Both outputs share source fingerprint `fccf0b96792ef835285dc58cd05568d055f89b2532abb737560aa4aa8b265ce4`, app 1.1.0/build 343. An initial pre-pin build also passed; the final build is the stated candidate.
- `check:images` passed all 970 registered chapters and 276 Story images, exact source/web/offline bytes, opener placement, alt/caption behavior, unchanged scripture and fail-closed coverage. Inherited 1 Samuel spacing remains disclosed.
- `check:mobile` and `check:release` passed, covering the packaged offline worker, UI chrome fixtures, deterministic source identity, Worker-only packaging, CSP/sync controls, byte encoding and public-image hash/privacy fixtures.
- Separate packaged offline-engine check passed all 13 chapters, 13 placements and exact KJV/ASV/WEB source equality, string field types, and zero network requests. There are no empty source strings in this book; inherited blanks elsewhere were preserved, not rewritten. See `2-corinthians-offline-verification-2026-11-04.json`.
- Story, chapter-name and annotation checks passed. Chapter-name verification preserves all 1,189 packaged chapters' original verses in every edition.
- Source preservation, exact one-opener coverage, full-canon spacing, pinned Git-tree comparison, public-origin hash checks, local Sites packaging and `git diff --check` passed.
- `check:readability` exited zero in inherited report-only mode, with existing corpus findings. New image alt text separately averages grade 6.41, with zero sentence-length or unexplained-jargon findings.

Live verification is blocked: the ordinary proxy-backed request to `https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` returned CONNECT HTTP 403. It was stopped without retry or bypass. Public GitHub-origin verification is independent of live-site verification. This was a network-policy denial, not an automatic approval-review rejection.

Browser smoke and phone/iPad viewport QA were **never run**. This is managed Linux (`SITES_MANAGED_LINUX_CONTAINER=1`), and no callable supported `cua_repl.js` tool was supplied. A Chromium binary and preview CLI are present, but the Sites skill says to skip browser QA when the managed browser tool is unavailable; no preview server or alternative control path was improvised. `release:verify`, public candidate decoding, signing, signed-app comparison, physical devices, installation/launch and physical-screen checks are pending for the coordinated release, outside this book branch's authorized endpoint. No paid API, new API credential, security change, main push, merge, Site publication, build increment or next book was attempted.

Integrate both branch commits/history. Union all ten branches' chapter metadata, explicit coverage and hosting rules; preserve every earlier member. Push a new combined asset-union commit, repin and verify every immutable source, then rebuild/check web and native together. This branch pin intentionally lacks the other nine books' new images. The coordinated session must perform its independent full-size combined review, actual boundary spacing, supported browser checks and live/signed/device verification before claiming a released batch.
