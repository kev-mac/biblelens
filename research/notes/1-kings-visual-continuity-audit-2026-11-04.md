# 1 Kings artwork and continuity audit — 2026-11-04

Scope: 1 Kings only. Isolated branch `artwork/1-kings-2026-11-04`, based on canonical main `c90aa0d01679116bef5c921ed4a991e95478f2b3` (build 340). The original `/workspace/biblelens` checkout is preserved. Read AGENTS.md, RELEASING.md, CLAUDE.md, the Judges continuity audit, the Ruth/Samuel combined review and corrective audit, and build 340 release verification before changes. The explicit cloud-session instructions authorize feature-branch work only; publication and device installation remain separate.

## Source comparison

A fresh Sites credential was used only in process memory for a read-only shallow clone at `/workspace/sites-1-kings-compare`. The Sites source helper is not installed in this environment; ordinary Git used the issued credential through stdin and an ephemeral child-process configuration. Mirror main is `8e5c594a219ec466a210181c0bf46805fd2b5a3c`, the build 340 publication source. No mirror-only tracked paths or independent application edits were found. The only differing shared tracked file was RELEASING.md: GitHub correctly says Exodus–2 Samuel, while the mirror says Exodus–Joshua. GitHub has 344 additional tracked research/documentation paths absent from the deployment mirror. The mirror remains clean and untouched.

Sites metadata reports public version 329. A single attempt to read `https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` returned HTTP 403. That denied read was not retried or bypassed. Metadata and source comparison do not independently verify current live bytes.

## Chapter decisions

All 22 chapters have exactly one opener. Eleven existing Story images at verse 1 are retained. Eleven versioned chapter images are added at position 0, below the heading and before verse 1. The additional Story at 16:8 remains at its original verse. No existing image, Story metadata, scripture, caption, or prior-book entry is replaced.

| Chapter | Decision and pictured subject | Text used for comparison |
| --- | --- | --- |
| 1 | Retain Solomon's anointing, priest with oil horn, Nathan and Bathsheba, mule | 1:32–40 |
| 2 | New empty throne chamber with blue mantle; a succession setting without a new David portrait | 2:10–12 |
| 3 | Retain Solomon hearing two women and the living child | 3:16–27 |
| 4 | New grain, flour, barley and straw in a provisions store | 4:22–28 |
| 5 | Retain temple construction Story, timber and worked stones | 5:6,17–18; Story spans chapters 5–8 |
| 6 | New close view of cedar panels, carved buds/flowers and wooden floor | 6:15–18 |
| 7 | New empty hall with cedar pillars and beams | 7:1–7 |
| 8 | New cloud-filled temple doorway, interior obscured | 8:10–13 |
| 9 | Retain queen of Sheba's visit, a Story spanning chapters 9–11 | 10:1–13; broad Story placement at 9:1 is preserved |
| 10 | New spices, gold vessels and rough precious stones on purple cloth | 10:2,10 |
| 11 | New partial detail of torn garment beside a path | 11:29–31; partial framing makes no total fragment-count claim |
| 12 | Retain Rehoboam hearing the elders | 12:6–14 |
| 13 | Retain the man of God addressing Jeroboam near the altar | 13:1–6; not a claim to freeze the exact instant of the arm's affliction |
| 14 | New partly covered bread, cakes and honey jar at a house doorway | 14:3–6; covered loaves do not assert a competing total |
| 15 | New reused stones and timber beside an unfinished wall | 15:22 |
| 16 | New distant burning royal house; keep Omri/Samaria Story at verse 8 | 16:18,24; different events eight verse positions apart |
| 17 | Retain Elijah at Cherith with ravens and food | 17:3–6 |
| 18 | Retain Elijah beside the burning, water-soaked altar | 18:30–38 |
| 19 | Retain Elijah at the cave with mantle near his face | 19:9–13 |
| 20 | New distant siege camp below a hilltop city | 20:1; an imagined view of the siege setting, not an exact gateway location or army count |
| 21 | Retain Elijah confronting Ahab at Naboth's vineyard | 21:17–20 |
| 22 | Retain Micaiah addressing two seated kings at the gate | 22:10–17 |

New files are `src/assets/chapter-1-kings-{02,04,06,07,08,10,11,14,15,16,20}-opening-v1.webp`. All are 960×540 WebP files below 250,000 bytes. Generation provenance, actual input/output paths, sizes and SHA-256 values are in `1-kings-artwork-generation-2026-11-04.json`. All eleven generation calls received the actual approved Genesis 7 file as style input, with explicit instructions that it was not an identity reference. No new scene contains a person or animal. The initial chapter 2 candidate had faint generated lettering at bottom right; it was rejected. An imagegen edit using the actual original file removed it. Both generated originals are retained locally; only the reviewed result is active.

## Recurring people and groups

The following actual active files were inspected at native size. Paths below are relative to `src/assets/`. Prior Samuel inventory and David's aging/setting limits remain in the corrective audit; this book adds no David portrait.

| Person/group | Earlier/current appearances and stable traits | Result/reference guidance |
| --- | --- | --- |
| Solomon | `story-solomon-becomes-king-v1.webp`, `story-solomon-s-wisdom-v1.webp`, `story-the-temple-built-v1.webp`, `story-the-queen-of-sheba-and-solomon-s-decline-v1.webp` | Compatible medium-brown complexion, dark natural curls, strong brows, defined nose/jaw, short beard and adult build. Teal/blue robe is secondary to facial identity. No prior securely identified Solomon portrait was found in Samuel's active art. These scenes do not depict the explicitly old Solomon of 11:4. |
| Nathan | Earlier `story-the-davidic-covenant-v1.webp`, `story-david-bathsheba-and-uriah-v1.webp`; older staff-bearing observer in `story-solomon-becomes-king-v1.webp` | Earlier actual files were compared. Brown complexion, prominent nose, graying natural curls/beard and lean build remain broadly compatible with further aging. Do not relabel Zadok, the man pouring oil, as Nathan. |
| Bathsheba | Woman beside Nathan in `story-solomon-becomes-king-v1.webp` | No second securely identified active prior portrait: the Samuel Story with her name depicts Nathan and David. Do not invent an earlier visual likeness. Mother of an adult son; numerical age cannot be established from the artwork. |
| Zadok | Anointing priest in `story-solomon-becomes-king-v1.webp` | Elderly gray curls/beard, brown complexion, pale robe and lean build. No second securely identified earlier portrayal found; not a Nathan anchor. |
| Rehoboam / Jeroboam | `story-the-kingdom-divides-v1.webp` / `story-the-man-of-god-from-judah-v1.webp` | Distinct narrative identities despite similar royal costumes and curls. Do not treat the chapter 12 king as a Jeroboam reference. No new portrait is introduced. |
| Elijah | `story-elijah-and-the-drought-v1.webp`, `story-elijah-on-mount-carmel-v1.webp`, `story-elijah-at-horeb-v1.webp`, `story-naboth-s-vineyard-v1.webp` | Recognizable brown complexion, weathered angular face, prominent nose, graying curls/full beard and coarse dark mantle. Broadly compatible apparent age/build across these episodes. Elijah is the vineyard's left-hand speaker, not Naboth. |
| Ahab | Right-hand king in `story-naboth-s-vineyard-v1.webp`; left-hand red-robed king in `story-ahab-and-micaiah-v1.webp` | Broad facial structure, brown complexion, curls and beard compatible. Beard appears grayer at the vineyard than at the gate: lighting and exact apparent age remain uncertain. No definite identity break established; do not use the later image to assert numerical age or reverse aging. |
| Jehoshaphat / Micaiah | Blue-robed seated king / standing staff-bearing speaker in `story-ahab-and-micaiah-v1.webp` | One contextualized portrayal each in the prior/current sequence. Do not confuse Micaiah with Elijah because both have gray beards and rough mantles. |
| Omri / anonymous workers | `story-zimri-s-coup-and-omri-s-rise-v1.webp` | Pointing older man and builders in Samaria setting. Preserve this Story; no new Omri, Zimri or Elah portrait. |
| Queen of Sheba / attendants | `story-the-queen-of-sheba-and-solomon-s-decline-v1.webp` | Queen's brown complexion, dark curls, oval face and adult build remain her sole secure portrayal here. No new queen or servant identities. |
| Other anonymous groups | Temple builders, elders, guards, onlookers, two women and infant in retained Stories | Dignified ancient Near Eastern portrayals. Similar dress does not establish individual continuity across generations. None appears in the new openers. No new group identity anchor is created. |

David's prior active images are inventoried in the Samuel audit: anointing, Goliath, flight, wilderness, accession, ark procession, covenant, Mephibosheth, Nathan's rebuke, rebellion, mighty men and census. Joab has one contextualized Samuel revolt portrayal. Neither is recognizably depicted by these additions. Recalled or off-image people (including Ahijah, Benaiah, Abishag, Adonijah and Hiram) are not assigned invented portraits. Later concurrent-book artwork was not used as a reference. There is no essential dependency on an unapproved concurrent asset.

Visible hands, fingers/thumbs, limbs, faces, the infant, mule and ravens were inspected in the retained Story scenes. No clear malformed visible anatomy was found. Covered, distant or overlapping parts cannot be fully verified. All new original scenes were inspected at full size and contain no anatomy to check. The new partial temple/cedar details are imagined craftsmanship, not exact architectural plans. The Samuel Jerusalem-scale uncertainty is preserved, and no new city plan is offered as its resolution.

## Verification and handoff

Completed checks on the final production source:

- `npm run build:mobile`: exit 0, including the shared Worker, offline bundle, search and startup recovery checks.
- `npm run check:images`: exit 0; all 276 Story assets and 313 registered chapters pass. This includes 1 Kings placement, alt text, hidden generic chapter captions, unchanged scripture and exact source/web/offline image bytes. Story captions remain small and italic through the existing renderer/CSS. No renderer was changed.
- `npm run check:readability`: exit 0 in its existing report-only mode, with inherited review findings. Scripture and Story prose are unchanged.
- `npm run check:release`: exit 0; release identity, packaged CSP/sync behavior, encoding and public-image privacy/hash checks pass. These fixture checks do not verify physical devices or live deployment.
- Source audit: exactly 22 openers (11 chapter, 11 Story), 23 image placements, no pair below five verse positions. Minimum internal spacing is eight, at 16:0 → 16:8. The 2 Samuel → 1 Kings boundary distance is 25 and 1 Kings → 2 Kings is 53. The inherited 1 Samuel 7:0 → 7:2 pair is still reported by the shared suite and remains unchanged.
- Preservation audit: all 670 baseline `src/assets` Git blobs, all pre-existing chapter metadata, all Story mappings, scripture and package/build metadata match main build 340. `git diff --check` passes.

The eleven reviewed assets were committed and pushed first as `32e5b7707bc505965739434fd8971a9063952786` on this dedicated feature branch. `data/hosted-artwork.json` pins that public source and retains all earlier entries, adding eleven 1 Kings paths. All 328 hosted files match their pinned Git blobs. All eleven new immutable public origin URLs were fetched and matched source bytes, with evidence in `1-kings-artwork-evidence-2026-11-04.json`. No private request data is included in this manifest. Native files remain fully bundled for offline reading. The allowlist and expected coverage now extend through 1 Kings; the explicit-ID chapter registry adds ID 10 without modifying earlier IDs.

The initial unhosted Worker was 67,358,578 bytes, above the existing 66,060,288-byte Sites limit. After using the established pinned path, the final Worker is 65,905,213 bytes, with 155,075 bytes of headroom. The unchanged release packaging check passes. Future combined releases must recheck this small budget.

**Concurrent-branch integration dependency:** merge chapter metadata by book/chapter key, preserve every branch's explicit book IDs and allowlist alternatives, and pin the combined hosted manifest to a public commit containing all integrated assets. A pin from any one book branch cannot contain the other branches' new files. Do not resolve shared metadata or source-pin conflicts by taking an entire side.

Phone/iPad browser layout checks are unavailable: this managed environment has no callable `cua_repl.js` or other managed browser-control tool. No browser was installed and no alternate browser-control path or preview server was used. Physical devices, signed iOS assets, installation, live image byte verification and release:verify are outside this cloud feature session. The full browser-inclusive `npm run check` was not run. Local supporting logs are `/tmp/1-kings-build-mobile-final.log`, `/tmp/1-kings-check-images.log`, `/tmp/1-kings-readability.log`, and `/tmp/1-kings-check-release.log`.

Build number remains 340. No merge, main push, publication, Sites version save/deployment, installation, credential provisioning for paid APIs or other-book work is authorized or performed. The only Git identity used for commits is the verified existing public noreply identity `kev-mac <2168970+kev-mac@users.noreply.github.com>`.
