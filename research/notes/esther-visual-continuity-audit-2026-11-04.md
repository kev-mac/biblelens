# Esther artwork audit — 2026-11-04

Feature branch: `artwork/esther-cloud-2026-11-04`. Baseline GitHub main: `c90aa0d01679116bef5c921ed4a991e95478f2b3`, build 340. Esther only; no merge, publication, build-number change, installation or device operation.

Read `AGENTS.md`, `RELEASING.md`, `CLAUDE.md`, Ruth's visual audit, the combined Samuel continuity review, its superseding fixes audit, and the build 340 release audit before artwork work. GitHub main was fetched before creating the isolated feature branch. The original checkout was clean, with no work to stash. All 670 original tracked asset blobs are preserved byte-for-byte, including Judges and the Samuel corrections. Scripture and every Story mapping remain unchanged. Commit identity uses the verified `kev-mac` GitHub noreply identity already recorded on main, scoped to this checkout.

## Source comparison and access

Freshly authorized Sites source was cloned read-only at `/workspace/esther-sites-mirror`, head `8e5c594a219ec466a210181c0bf46805fd2b5a3c`, build 340, matching the recorded release. No mirror-only tracked paths exist. The sole differing shared file is `RELEASING.md`: canonical main updates its artwork range from Exodus–Joshua to Exodus–2 Samuel. Canonical-only paths are research records. No independent newer application work requires integration. The Sites helper was absent from this executor; ordinary Git used the fresh credential through hidden stdin and transient process configuration, without persisting credentials. The mirror was not edited or pushed.

The live `release.json` request was denied by the cloud egress proxy (CONNECT 403). It was not retried or bypassed. Sites metadata reports saved version 329; this does not independently prove current live bytes. Live image, CSP and release verification remain unavailable here.

## Chapter coverage

Every chapter now has exactly one image below its chapter heading and before verse 1. Story art at verse 1 supplies five existing openers; no duplicate opener was added there. Existing Story art and placements are retained.

| Chapter | Image retained or added | Text and review |
| --- | --- | --- |
| 1 | `story-vashti-deposed-v1.webp`, Story 1:1 | Vashti refuses the summons (1:12), with attendants and messenger. No clear visible anatomy defect. |
| 2 | `story-esther-becomes-queen-v1.webp`, Story 2:1 | Ahasuerus crowns Esther (2:17). Clear faces, plausible visible hands and dignified attendants. |
| 3 | `story-haman-s-plot-v1.webp`, Story 3:1 | Broad Story coverage anticipates chapter 4: Mordecai in sackcloth speaks with the messenger; Esther appears above. It is not a literal depiction of 3:1. Retained rather than duplicating it. |
| 4 | `chapter-esther-04-opening-v1.webp`, 4:0 | Mordecai grieves in sackcloth outside the gate (4:1–3). The new seated view differs from the retained conversation. |
| 5 | `story-esther-s-banquets-v1.webp`, Story 5:1 | Esther speaks with the king while Haman listens; broad coverage of the two banquets in chapters 5–7. |
| 6 | `chapter-esther-06-opening-v1.webp`, 6:0 | Sleepless king hears the royal records (6:1–3). Same king, without ceremonial crown in a private room. |
| 7 | `chapter-esther-07-opening-v1.webp`, 7:0 | Quiet garden beside a banquet room (7:7); a setting scene, not a claim that the garden was empty throughout the episode. No people. |
| 8 | `story-the-jews-delivered-and-purim-v1.webp`, Story 8:1 | Families exchange food; broad Story coverage of delivery and Purim in chapters 8–10. No duplicate opener. |
| 9 | `chapter-esther-09-opening-v1.webp`, 9:0 | Food gifts and a letter evoke 9:20–22. This chapter overview illustrates its Purim institution, not the fighting in verse 1. No people. |
| 10 | `chapter-esther-10-opening-v1.webp`, 10:0 | Mordecai listens to people as an official seeking their welfare (10:3), with royal dress from 8:15. |

All new files are versioned v1 additions, 960×540 WebP, 89,840–170,908 bytes. No existing file was replaced or deleted. New alts explicitly identify imagined scenes. Generic chapter captions stay hidden; Story captions retain their small italic reader styling. Source rendering places chapter openers immediately after the heading and Story openers before verse 1; decoded API/renderer checks confirm those contracts. No CSS or scripture changes were needed.

## Prior appearances and continuity

Inventoried chapter and Story artwork metadata throughout all earlier canonical books for Esther's named people and recognizable groups. Examined all five Esther Story files at full native resolution, plus the nearby Persian settings in `story-opposition-and-delay-v1.webp`, `story-nehemiah-s-prayer-and-commission-v1.webp`, and `story-the-fall-of-judah-and-cyrus-s-decree-v1.webp`. No earlier image clearly identifies Esther, Mordecai, Vashti or Haman. Ezra 4 names Ahasuerus, but its retained opposition scene depicts local officials, not an identified royal portrait. Cyrus and Nehemiah's Artaxerxes are different kings; their portraits are not Ahasuerus references. No portrait was inferred from similar names in returnee lists. Anonymous Judean families across generations are not treated as the same individuals.

| Person/group | Approved reference paths under `src/assets/` | Stable traits and result |
| --- | --- | --- |
| Mordecai | `story-haman-s-plot-v1.webp` | Older lean man at left; angular lined face, prominent nose, warm brown complexion, short gray-black natural curls, grizzled curly beard. The purple-robed messenger at right is not Mordecai or Haman. New 4 and 10 keep his features and age; circumstances and clothing change. No precise numeric age is imposed. |
| Ahasuerus | `story-esther-becomes-queen-v1.webp`; `story-esther-s-banquets-v1.webp` | Mature long oval face, prominent nose, brown complexion, thick black curls and full curly beard, sturdy build. New chapter 6 is compatible with both. The narrative moves from year seven at the coronation to year twelve at the plot; no abrupt old-age change is introduced. |
| Esther | `story-esther-becomes-queen-v1.webp`; `story-haman-s-plot-v1.webp`; `story-esther-s-banquets-v1.webp` | Brown complexion, long dark natural curls, defined brows and slim adult build. Her small upper-window portrayal limits detailed comparison, but no definite identity break is visible. No new Esther portrait. |
| Vashti | `story-vashti-deposed-v1.webp` | Separate queen with dark curls and regal dress; not Esther. One retained appearance, no new depiction. |
| Haman | `story-esther-s-banquets-v1.webp` | Seated man at right in red; curly dark hair/beard, brown complexion, stockier adult build. Not the messenger in the plot scene. No new depiction. |
| Court servants and guards | Coronation, plot and banquet files above; Vashti scene | Diverse brown complexions, natural dark hair, restrained court clothing. New 4's distant guards remain compatible with the actual supplied plot reference; new 6's anonymous reader uses the supplied court scenes. Tiny distant features cannot establish individual identity. |
| Jewish families of Susa | `story-the-jews-delivered-and-purim-v1.webp` | Retained multigenerational food-sharing group. New 9 is a still life using that actual scene as a setting/material input. New 10's petitioners are anonymous adults, not a claim to repeat named people from earlier books. |

Actual approved image files were supplied to `image_gen.imagegen` for every identifiable recurring person, not merely described. Chapter 10 additionally received the newly reviewed chapter 4 original as a supporting likeness; the approved Story anchor remained an actual input. `chapter-genesis-07-opening-v1.webp` was supplied to every generation for style only. It supplies no character identity.

All five generated originals and final WebPs were inspected at native size. Side-by-side, unscaled review canvases compared the Mordecai chain and the king chain with their actual references. Faces, complexion, hair, beard, age, build, visible hands/limbs and relationships show no clear new break or clearly malformed anatomy. Some fingers overlap naturally; covered legs, tiny background faces and occluded anatomy cannot be fully verified. New chapters 7 and 9 contain no people or animals. No essential reference depends on unapproved work from another concurrent book; no paid API, new API credentials or alternative image service was used.

These are imagined scenes, not historical portraits or exact reconstructions of Susa. Gate architecture, garden details, props and precise ages are interpretive. Existing chapter 3 and 8 Story openers illustrate their wider Story spans; their forward-looking subjects are retained and disclosed.

## Spacing and validation

`esther-artwork-source-evidence-2026-11-04.json` records all ten placements, bytes, SHA-256, scripture comparisons, web/offline equality and consecutive distances, including both book boundaries. No pair within Esther is below five verse positions. Nehemiah 13:1 → Esther 1:1 is 31 positions. **Esther 10:0 → Job 1:1 is four positions**, because Esther 10 has only three verses. Retain both required openers and inspect this short transition during coordinated phone/iPad QA. No Job content was changed. The inherited 1 Samuel 7:0 → 7:2 pair remains disclosed by its existing checker and audit.

- `npm run build:mobile`: passed, including shared Worker generation, offline reading/search and startup checks.
- `npm run check:images`: passed, covering 276 Story images and 301 registered chapters, original scripture, alt text, captions, placement, packaged bytes and web/native parity. Added Esther to the explicit book-ID map and added a negative check proving removal of Esther 4's opener fails coverage validation. Existing book registrations and checks remain.
- `npm run check:readability`: exit 0 in existing report-only mode, with inherited findings; no Story prose changed.
- `node scripts/check-public-artwork.mjs`: passed existing pinned artwork integrity and private-data guards. Esther assets remain embedded and offline-bundled; this does not claim a new public source pin.
- Independent Esther/source-preservation audit: ten openers, ten placements; all 670 baseline assets unchanged; all source/web/native Esther image bytes match; scripture, Story mappings and build number unchanged.
- `git diff --check`: passed.

The first dependency install failed because the default npm cache directory was unavailable. Retrying with a task-owned cache under `/tmp` succeeded. An initial conversion import failed before writing assets and a premature build failed closed on missing Esther coverage; the corrected conversion and completed build above passed. No approval-review rejection occurred.

## Handoff limits and release dependency

No callable `cua_repl.js` browser tool is available in this cloud session. Under the Sites managed-preview rules, no preview server or alternate browser path was started or installed. Phone/iPad rendered layout, image clipping/overflow and the short Esther→Job transition remain **unverified**. Source/CSS checks are not device verification. Physical devices, signed iOS assets and installation are unavailable here. Full release verification was not attempted.

**Coordinated release blocker:** the built default Worker is **66,750,977 bytes**, exceeding the **66,060,288-byte Sites limit by 690,689 bytes**. Build 340 already had only 113,475 bytes of headroom. Before any release, combine the concurrent books, move appropriate new art onto the existing checked immutable public-artwork mechanism with a source pin containing all combined assets, preserve native offline bytes, and rebuild/check the final Worker budget. This feature branch deliberately does not change the global hosting pin while ten independent book branches are running. The current branch must not be published as-is.

Generation provenance, actual input hashes and local original paths are recorded in `esther-artwork-generation-2026-11-04.json`; originals remain in `/workspace/generated_images`. Local check logs are `/tmp/esther-build-mobile.log`, `/tmp/esther-images.log` and `/tmp/esther-readability.log`. Native-size comparison canvases remain `/tmp/esther-mordecai-native-comparison.png` and `/tmp/esther-king-native-comparison.png`. Only final WebPs, metadata, targeted coverage checks and audit records are committed.

Stop after Esther. For eventual integration, preserve every concurrent book's disjoint `data/chapter-images.json` keys and explicit book-ID entries; resolve append conflicts by key, never by replacing the whole file. Fetch GitHub and compare fresh Sites/live state again, resolve the Worker budget, and perform coordinated web/native/device QA before any release.
