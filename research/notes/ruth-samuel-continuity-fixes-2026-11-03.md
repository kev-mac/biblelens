# Ruth and Samuel continuity fixes — 2026-11-03

## Integrated source

Branch: `artwork/ruth-samuel-continuity-2026-11-03`, isolated at `/workspace/samuel-integration`.

This follows the original `ruth-samuel-combined-continuity-review-2026-11-03.md`. That document and its source evidence are retained as the **pre-fix snapshot**, not the current release checklist. This audit supersedes its actionable findings where resolved below.

The branch merges current GitHub main `82a91ed4697c7e6836f0e56f341998de244df461`, Ruth `d455bbd6494f032f9a9b9cf8a0bed34a0929d3c9`, 1 Samuel `c0a7b9e280e5b5c6350a96adc9c32d2a54ee1076`, and 2 Samuel `564868f05de856e82bde366cc878811fca4b61c5`. All are preserved in ancestry. The sole merge conflict was the shared end of `data/chapter-images.json`; it was resolved by retaining all 22 book-8 additions and all 16 book-9 additions with main's existing entries. All source assets from main and each feature branch were verified against their Git blobs and remain byte-identical. No original asset was deleted or overwritten.

Sites was read during the immediately preceding review using a fresh source credential. It remains at `9983427f11fe71a2e6fb6c58ababe5621f344541`, version 327/build 338, with no independent newer production work found. GitHub contains Judges/build 339. This is a feature-branch handoff, not a synchronized release. Build number stays 339; hosting pins and release configuration are unchanged.

## Findings addressed

### Saul at Endor

Active Story art now uses `src/assets/story-saul-and-the-medium-at-endor-saul-s-death-v2.webp`. The gold circlet is removed, consistent with his disguise in 1 Samuel 28:8. The actual approved Endor v1 and `story-saul-rejected-v1.webp` files were supplied to imagegen as identity inputs; `chapter-genesis-07-opening-v1.webp` was supplied separately for style.

The original generated PNG and final 1200×675 WebP were inspected at native resolution. Saul's nose, complexion, tight curls, beard, adult build and seated pose remain recognizable; the older woman and both companions retain their identities and relationships. The lamp, nighttime doorway and conversation remain. Visible hands and limbs have no clear malformed anatomy; hidden parts cannot be verified. V1 remains in source. The edit does not establish any new David/Samuel/other character portrait.

### 1 Samuel 7 close pair

The new opener is now versioned `src/assets/chapter-1-samuel-07-opening-v2.webp`: an empty house courtyard, closed wooden door, baskets and jar, grounded in the house at Kiriath Jearim in 7:1–2. It replaces the opening memorial-stone composition. It has no identifiable person, ark design or standing stone. The actual Genesis 7 file was supplied as style input only. Original PNG and final 960×540 asset were inspected at native resolution.

The meaningful existing `story-samuel-judges-israel-v1.webp` remains at 7:2, with its original Story heading/caption and placement. It shows Samuel and the later Ebenezer memorial. The two images are still **two verses apart**, but they now introduce distinct settings rather than repeat the same memorial-stone subject. Both opener coverage and the inherited Story coverage are retained. The artwork rules require reporting sub-five-verse pairs, not deleting them automatically. No renderer/heading override or scripture change was introduced to hide the spacing. Phone/iPad layout review remains required.

### Shared coverage validation

`scripts/chapter-images.mjs` now registers Ruth as ID 7 and 1 Samuel as ID 8 while retaining 2 Samuel at ID 9 in the explicit-ID Map. `check:images` also invokes the existing `check-1-samuel-artwork.mjs`, which verifies every opener, preserved scripture and Story placement, captions and local web/offline bytes.

`scripts/check-chapter-images.mjs` now proves missing 1 Samuel 2 chapter art and missing Ruth 1 Story headings fail coverage validation, alongside the existing missing-2-Samuel-opener failure check. The shared suite covers all 291 chapters from Genesis through 2 Samuel. This closes the normal release-check omission identified in the review.

### Lentil field

`src/assets/chapter-2-samuel-23-opening-v2.webp` replaces the broad pea-like leaves and enlarged pods with slender plants, many small paired leaflets and small short pods. The shield and field role remain; there are no people or animals. V1 remains in source. The actual v1 and Genesis 7 files were supplied as scene and style inputs, respectively. Original PNG and final 960×540 WebP were inspected at native resolution.

The correction uses the [University of Wisconsin/University of Minnesota lentil crop description](https://corn.agronomy.wisc.edu/Crops/Lentil.aspx), Growth Habits, by Oplinger et al.: lentils have fine stems, compound leaves with several paired leaflets, and short pods holding one or two flattened seeds. The v2 image's finer foliage and compact pods fit that description better than v1. This resolves the conspicuous pea-like visual concern for this imagined chapter scene; it does not present the artwork as a botanical specimen or identify an ancient cultivar. The USDA search result corroborated short pods, but opening its PDF timed out; no retry was needed because the university source was available.

### Jerusalem scale and other uncertainty

The current `chapter-2-samuel-05-opening-v1.webp` and retained `story-jerusalem-and-the-ark-v1.webp` / `story-absalom-s-rebellion-v1.webp` remain unchanged. Their settlement scale differs markedly. The text distinguishes the captured stronghold and David's subsequent building (5:7–9); the inherited procession banner depicts a later chapter-6 event, and the rebellion is later again. Different viewpoints and imagined construction do not establish a definite textual contradiction. No archaeological identification or exact scale is claimed by the images. An unsupported replacement would not establish a better reconstruction, so this remains a documented **setting-scale uncertainty**, not a demonstrated identity break. Avoid using any of these as an exact city plan for future scenes.

The earlier review inspected all 63 active placements full size, including David's youth, wilderness, accession and royal scenes across both books. None of those David images changed in this integration. The mature adult references and the rebellion's older depiction remain broadly compatible; appendix event dates still do not establish a secure numerical age chain. Ruth, Naomi, Boaz, Samuel, Eli, Nathan, Saul and the other identified portrayals retain the earlier review's qualified results. Anonymous groups are not treated as individual identity anchors across generations. Tamar/Absalom v2 is preserved byte-for-byte from the 2 Samuel branch.

## Evidence and checks

`ruth-samuel-continuity-fixes-generation-2026-11-03.json` records actual input paths, generated-original paths, review results and final hashes for all three new versioned assets. They are 100,782 bytes (Saul), 153,000 bytes (house), and 155,206 bytes (lentils), each below 250,000 bytes.

`ruth-samuel-integrated-source-evidence-2026-11-03.json` records the final 59 openers and 63 active placements with paths, verse positions, byte lengths and SHA-256. Each of the 59 chapters has exactly one opener. The only close pair is 1 Samuel 7:0 → 7:2. Boundary distances remain Judges→Ruth 26, Ruth→1 Samuel 22, 1→2 Samuel 14, and 2 Samuel→1 Kings 25 verse positions. No boundary pair is below five.

Completed on the final production source:

- `npm run build:mobile`: exit 0; includes the shared Worker, offline reading/search and startup checks. Generated outputs are local and unsigned.
- `npm run check:images`: exit 0. All 276 Story assets and all 291 registered chapters pass placement, dimensions, captions/alt text, unchanged scripture, source/web/offline byte parity and fail-closed missing-coverage checks. The separately invoked 31-chapter 1 Samuel check passes and reports the retained close pair.
- `npm run check:readability`: exit 0 in its existing report-only mode, with legacy findings. The only changed visible text is a short opener alt description; scripture and Story prose are unchanged.
- Independent source audit: exactly 59 openers/63 active placements, with the boundary/spacing results above.
- Git blob preservation check: main and all three feature heads are ancestors; every existing `src/assets` blob from each remains present and byte-identical.
- `git diff --check`: passed.

## Handoff limits

Phone/iPad rendered layout and unlocked-device visual checks remain pending, especially 1 Samuel 7 and repeated hill-country compositions. This cloud environment has no callable managed browser-control tool; no alternate browser was installed and no preview server was started. Signed bundle comparison, installation, device launches, live image bytes and `release:verify` require the coordinated Mac/device release session. Earlier live-Site CONNECT 403 denial was respected; it was not retried or bypassed here. No artwork-access blocker occurred, and no automatic approval review rejection occurred.

Only the new isolated feature branch is authorized for push. Main, Sites, public release state and devices remain untouched. The original `/workspace/biblelens` checkout and the separate review snapshots are preserved. No API credentials were created. Before any eventual release, fetch GitHub and freshly compare Sites again, run release preparation from the combined source, preserve the public audience, and complete the verification steps in `RELEASING.md`.
