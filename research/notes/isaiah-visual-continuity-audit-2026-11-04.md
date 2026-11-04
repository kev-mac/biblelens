# Isaiah artwork audit — 2026-11-04

## Source and scope

Dedicated branch `art/isaiah-openers-20261104` in `/workspace/isaiah`, an isolated worktree from freshly fetched GitHub main `846ba46`. The original clean `/workspace/biblelens` checkout was preserved. Read AGENTS.md, RELEASING.md, build 341 release verification, and the completed Kings/Chronicles continuity audits before work.

The Sites connector reports saved version 330, source `6489207c16040f17c2247db76080520fc6f422b0`, which matches the build 341 release audit. Direct live `/release.json` returned HTTP 403. No retry or bypass occurred. A fresh mirror source checkout was unavailable: no existing mirror or installed source helper was present; the task excludes new credentials. This is a metadata comparison with recorded release evidence, not a fresh full mirror comparison.

Only Isaiah is changed. No merge, main push, build-number change, publication, device installation, paid API call, new credential, or parallel-branch artwork dependency is part of this work. Dependencies were restored from the unchanged lockfile with npm ci for local checks; no application was installed on a device.

## Scenes and placement

All 66 chapters have one opener: 62 new versioned chapter files at `afterVerse: 0`, plus the four original Story scenes at 6:1, 7:1, 36:1 and 38:1. No original Story artwork, Story placements, scripture or earlier chapter metadata is replaced. New scene plans record the exact relevant verses and descriptive alt text. Generic chapter captions remain hidden, while Story captions remain unchanged below their images. The renderer and CSS are unchanged.

New art depicts objects, settings and literary metaphors without identifiable people or animals. Images of the shoot from a stump, tender plant, flint and footstool illustrate the text's language without assigning an identity to its metaphorical figure. No image is archaeological evidence, an exact ancient city plan, or a verified artifact reconstruction. Isaiah 63 uses grape juice, not an invented literal portrait of the text's divine warrior.

Every new generation received the actual approved `src/assets/chapter-genesis-07-opening-v1.webp` file as a style-only reference. No Genesis person supplies an Isaiah identity. Natural light, plausible materials and a restrained illustrative finish guide the scenes. Full-size final images are checked for scene fit and visual defects. The new people-free scenes have no human or animal anatomy to approve. Original generated PNGs remain outside production source; the generation ledger records their hashes and the final WebP hashes.

## Recurring identities and prior appearances

All paths below are under `src/assets/`. Existing reference files were inspected at their native 1200×675 resolution; no new recognizable person was generated.

- **Isaiah:** `story-hezekiah-and-sennacherib-v1.webp`, `story-hezekiah-s-illness-and-the-babylonian-envoys-v1.webp`, then the current `story-isaiah-s-call-v1.webp`, `story-ahaz-and-the-sign-of-immanuel-v1.webp`, and `story-sennacherib-s-threat-and-hezekiah-v1.webp`. Medium-brown complexion, strong nose, natural dark curls and full beard remain broadly recognizable. The call shows a younger dark-bearded man; the Ahaz scene has some gray, and the Hezekiah scenes show more gray. The reigns span decades, so aging is plausible; exact ages are not asserted. His visible hands and limbs are coherent. The cropped seraph in the call is a vision figure; unseen wings cannot be checked and this is not a documentary temple plan.
- **Ahaz:** `story-ahaz-and-the-sign-of-immanuel-v1.webp` shows the named king as a mature brown-skinned man with black natural curls, beard and broad build. `chapter-2-kings-16-opening-v1.webp` has no portrait. The multi-reign `story-ahaz-and-hezekiah-s-reforms-v1.webp` depicts Hezekiah's cleanup episode, not a secure earlier Ahaz portrait. No face is relabeled as Ahaz by title alone. The current scene is retained; visible anatomy and the meeting beside the water channel fit Isaiah 7:3.
- **Hezekiah:** earlier Kings scenes above, `story-ahaz-and-hezekiah-s-reforms-v1.webp`, `story-sennacherib-s-invasion-and-hezekiah-s-pride-v1.webp`, and current `story-sennacherib-s-threat-and-hezekiah-v1.webp` / `story-hezekiah-s-illness-v1.webp`. Medium-brown skin, dense black curls, strong nose, full beard and adult build are broadly compatible. The current prayer scene has some gray; lighting and narrative timing do not establish an exact chronological age ladder. The illness scene turns toward the wall as Isaiah 38:2 states. Visible hands, fingers and limbs are coherent; occluded anatomy cannot be verified. The tunnel foreman in Chronicles is not assigned Isaiah's identity.
- **Attendants and soldiers:** the Ahaz scene retains two brown-skinned, naturally curly-haired attendants. They are anonymous and are not asserted to be the same individuals as guards in Kings or Chronicles. None is introduced in a new image. Crowds addressed in the prophetic text span generations; no invented recurring group portrait is generated.
- **Other named figures and literary subjects:** Uzziah, Jotham, Cyrus, Abraham, Jacob, the servant and Zion are mentioned in Isaiah; none acquires a new recognizable portrait here. The stump, plant and footstool scenes do not choose a doctrinal identification. No approval of a parallel session's new Jeremiah, Ezekiel or other portrayal is inferred.

Existing Story art remains accepted for this feature branch with the limits above. There is no missing image-reference dependency for any newly generated scene. Future recognizable portraits must use actual approved identity files as visual inputs and compare the completed cross-book record.

## Hosting, offline builds and integration

The existing build 341 hosted-artwork manifest and immutable source pin are unchanged. All new files remain in shared source and the native bundle for offline availability. Before any combined release, commit/push the accepted public assets, extend `scripts/hosted-artwork.mjs` to admit Isaiah and include explicit book ID 22 in its expected hosted entries, then extend `data/hosted-artwork.json` with one immutable public source commit that contains every listed asset. Preserve all earlier entries. Rebuild from the integrated source, enforce the 66,060,288-byte Sites Worker budget, and check live/public-origin/native image hashes. A feature-branch asset commit is not by itself a coordinated release pin.

The final neighboring Song of Solomon/Jeremiah branches must be included in the boundary-spacing review. This session does not overwrite their metadata or assume their pending assets are approved.

## Verification limits

No callable `cua_repl.js` browser tool is provided in this managed environment, so the Sites instructions require skipping browser QA; no preview server, browser installation or alternate browser-control path was used. Phone/iPad rendered layouts, physical-device appearance, signed asset parity, installation, live image bytes and release verification remain unavailable. Direct live access is blocked by HTTP 403 as recorded above. Repository mobile checks establish source/bundle contracts, not physical-device visual acceptance.

Final check results and exact Worker size are recorded after generation in the validation section below.

## Final validation

- `npm run build:mobile`: passed. The shared web build and unsigned native offline bundle use the same source. Startup recovery and offline reading/search checks pass.
- `npm run check:images`: passed for all 276 Story records and 725 registered chapters. Tests verify source/packaged placements, accessible alts, hidden generic chapter captions, unchanged scripture, web/native image bytes, and missing-opener failures. The inherited 1 Samuel 7 close pair is still reported by its own checker; Isaiah adds none.
- `npm run check:mobile`: passed, including mobile chrome contracts and zero-network offline reader checks. This does not simulate native inference or inspect physical devices.
- `npm run check:readability`: exit 0 in the inherited report-only mode, with existing corpus findings; no Story or scripture prose changes.
- Independent audit: all 66 Isaiah openers pass; all 991 baseline asset blobs, scripture, Story placements/images, hosted manifest and earlier chapter metadata are preserved. No Isaiah pair is fewer than five verses apart. Isaiah 66 to Jeremiah 1 is 24 verses in this baseline. The Song of Solomon 8 boundary requires the adjacent session's final source; its baseline has no opener. Recheck both boundaries after integration, including any new inline art.
- Full-size review: 62 active new images and all four retained Story scenes inspected, with prior Kings/Chronicles identities compared. Isaiah 30 v1 was rejected because its large curved fragments could carry coals or water. V2 has fine crushed terracotta and is accepted. The rejected v1 remains inactive in source as version evidence. There were 63 native imagegen calls, yielding 62 active new assets; originals remain in `/workspace/generated_images`.
- `git diff --check`: passed.

**Do not publish the local embedded artifact.** Its Worker is **75,297,070 bytes**, exceeding the **66,060,288-byte** Sites budget by **9,236,782 bytes**. The 62 active new WebP files total 8,459,190 bytes. The coordinated release must host/pin them using the existing architecture and remeasure the final package; native files must remain offline. This branch intentionally leaves the shared hosted manifest/pin untouched while ten isolated sessions proceed.

Evidence: `isaiah-artwork-2026-11-04/scene-plan.json`, `generation.json`, `validation.json`, reproducible `audit.mjs`, `checks.json`, and the numbered `contact-sheet.jpg`. Local check logs are `/tmp/isaiah-build-mobile.log` and `/tmp/isaiah-check-{images,mobile,readability}.log`.

GitHub verified account `kev-mac`, numeric ID `2168970`. Both author and committer use `kev-mac <2168970+kev-mac@users.noreply.github.com>`; no personal email is committed. This is a feature-branch handoff with the release limitations above, not a synchronized publication.
