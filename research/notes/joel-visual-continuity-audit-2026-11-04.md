# Joel chapter artwork — 2026-11-04

Joel only: reader book ID 28, three chapters. Branch `artwork/joel-2026-11-04` starts from freshly fetched GitHub main `846ba46` (build 341). Read AGENTS.md, RELEASING.md, CLAUDE.md, the Psalms/Proverbs continuity audits, the combined ten-book review and the final build 341 release audit before editing. The task's explicit prohibition on publication, installation and new credentials overrides the ordinary release workflow. No merge, main push, build-number change, device installation, paid API call or new credential occurred. A later parent follow-up explicitly authorized investigating and completing checks using locked dependencies from the official registry; that validation is recorded below.

## Coverage and scene review

The production Story catalog, including release-content corrections, topic tagging, UX13 additions and enrichment, has no Joel image placements. The baseline has no Joel chapter images. Three new versioned openers use `afterVerse: 0`, immediately below the chapter heading and before verse 1 through the unchanged reader renderer. There are no Joel images to retain or replace. All previous chapter-image metadata, prior image files, Story metadata and placements, scripture, reader code and package identity remain unchanged.

- Joel 1: withered vines, a dry tree and bent grain, illustrating 1:10–12.
- Joel 2: fruiting figs and vines, grain and rain over green hills, illustrating 2:22–24.
- Joel 3: a spring from a stone sanctuary into a dry valley, illustrating 3:18.

The openers illustrate motifs within each chapter; they do not claim to depict the first verse literally. The sanctuary and landscape in chapter 3 are imagined poetic scenery, not an exact reconstruction of Jerusalem's temple or an asserted location for the valley of Shittim. No textual interpretation or scripture was changed. Useful alt text starts with “Imagined scene:”. Generic chapter captions remain hidden, and Story captions elsewhere remain untouched.

All three generated originals and final 960×540 WebP files were inspected as complete scenes. Natural light and restrained finish follow the approved Genesis 7 target, with dry muted fields, green orchards and blue sky/water rather than a repeated amber cast. Plants, rocks, water, tools, grain and architecture were checked against the local KJV motifs. No humans or animals are present; no visible hands, limbs or animal anatomy require repair. Final files total 499,746 bytes, each under the existing 250,000-byte image limit. Original PNGs remain under `/workspace/generated_images`; exact paths and hashes are in the JSON audit.

## Continuity inventory and actual inputs

`joel-prior-artwork-inventory-2026-11-04.json` records the Joel-linked people index, earlier reference counts/samples, and previous chapter/Story candidates mentioning relevant groups. Textual index links are candidates, not portrait approval. “Edom/Esau”, “Israel” and “valley of Jehoshaphat” must not be read as evidence that those ancestral/royal individuals are personally depicted in Joel. Other men named Joel in earlier books are not automatically the prophet, son of Pethuel.

The selected illustrations portray no named person, recognizable recurring group, deity or personification. No prior face is used or newly certified; facial structure, complexion, hair, build and narrative age are therefore inapplicable to these scenes. Future portraits of Joel, priests, Judeans or other groups require approved identity references and an elapsed-time review before generation. None of these scenes depends on unapproved concurrent artwork.

Every generation received the actual approved file `src/assets/chapter-genesis-07-opening-v1.webp` as a visual input for STYLE ONLY. No Noah identity, ark or reference setting was reused. This was the built-in `image_gen.imagegen` tool, without paid API usage or provisioned credentials.

## Checks and spacing

- Source coverage validation passes all 662 registered chapters, including Joel 3/3. Removing each Joel opener independently fails closed.
- Source renderer checks pass heading → opener → scripture order, useful alt text, lazy/async image decoding and hidden generic captions. All prior artwork metadata, source assets, scripture, Story prose/placements, reader code and package identity pass preservation assertions.
- All 637 hosted files pass the existing allowlist, manifest, size and SHA-256 validation. Each new Joel file was fetched from its immutable public GitHub URL and matches the local bytes and recorded hash.
- `npm run check:readability`: exit 0, with inherited report-only corpus findings. This is not a zero-finding report.
- `node scripts/check-mobile-chrome.mjs`: passed. `node scripts/check-public-artwork.mjs`: passed, including hashes, cache, method guards, pinned failure fallback and no forwarded private headers/query data.
- `git diff --check`: passed before final commit.

There are no image pairs involving Joel fewer than five verse positions apart in the current production metadata. Joel 1 → 2 is 20 positions; Joel 2 → 3 is 32. Nearest exterior images are Hosea 1:1 → Joel 1 opener (196) and Joel 3 opener → Amos 7:1 (131). The immediate adjacent boundary chapters, Hosea 14 and Amos 1, currently have no image. If their concurrent sessions add only openers, the boundary distances are 9 and 21 respectively. Recompute all pairs after integration, including any new inline or Story art.

## Source comparison and unavailable checks

Sites metadata confirms public version 330, consistent with the build 341 release audit. There is no cached Sites checkout or existing source credential here. A fresh source credential was not requested because this task forbids new credentials. The mirror's current bytes were therefore not compared; compare and reconcile them during authorized integration before publication. No Sites source or live content was written.

The live `/release.json` HEAD request failed with a destination-policy CONNECT 403. It was not retried or bypassed. That denial does not prevent the separate, permitted immutable GitHub-origin checks above. No current live byte, layout or release verification is claimed.

`npm run build:mobile` failed before building: `ERR_MODULE_NOT_FOUND` for `esbuild`; this checkout has no `node_modules`. No dependency installation was attempted under the explicit no-install instruction. `npm run check:images` cannot start without `dist/server/index.js`. `npm run check:mobile` passes its chrome check, then cannot start its offline worker test without `www/index.html`. These were the initial results; the authorized validation follow-up below resolves the dependency, build and packaged-check blockers.

The environment reports `SITES_MANAGED_LINUX_CONTAINER=1`, but `cua_repl.js` is unavailable. The [Sites skill](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md) explicitly says: “If `cua_repl.js` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.” Consequently no preview server or alternate browser was launched. Phone/iPad viewport rendering, physical devices, signed assets and native install/launch checks remain unavailable.

## Hosting and integration handoff

Asset commit `bf8044a020960e0b854b87d4b507456eec3e8f5d` is pushed only to this dedicated feature branch and supplies the immutable hosted-artwork pin. Its tree contains every previously hosted file plus the three new Joel files. The hosted allowlist and explicit book-ID coverage map add Joel only; IDs 20–27 and other sessions remain untouched. The unchanged shared build loops include these same assets in native output while the web Worker uses the established same-origin pinned public-image handler.

Build 341's verified Worker was 64,747,604 bytes against 66,060,288 (1,312,684 bytes headroom). New images are hosted rather than embedded in that Worker. The authorized follow-up measured the current Worker at 64,701,734 bytes, leaving 1,358,554 bytes of headroom. Preserve the compressed self-contained Worker contract and recheck the budget after combining all sessions. Keep all images in shared source and the native offline bundle.

Integrate chapter metadata by key, coverage entries by explicit ID, hosted filenames by set union, and all allowlist changes. Re-pin once to a pushed public commit containing the complete combined asset set; this branch's pin does not contain future parallel assets. Rebuild both outputs, run the complete image/mobile/release suites, verify offline bytes and layouts, and compare the Sites mirror/live release before any authorized publication. No new continuity blocker remains for the selected unpopulated scenes. Mirror, live and device verification remain unavailable; build, packaged image and offline mobile checks subsequently passed below.

Git identity was verified against recent public repository history and set locally to `kev-mac <2168970+kev-mac@users.noreply.github.com>`. The inherited personal email was not used for commits. No automatic approval rejection occurred.


## Authorized dependency and validation follow-up

The parent requested: “Please investigate missing esbuild and finish available build/image/mobile checks if safely possible using documented locked dependencies and official registry.” No earlier installation denial had occurred. The environment's enforced policy allows `registry.npmjs.org`; every package URL in the version 3 lockfile uses that official host.

`npm ci --ignore-scripts --no-audit --no-fund --fetch-retries=0 --registry=https://registry.npmjs.org --cache=/tmp/joel-npm-cache` succeeded. Lifecycle scripts were disabled. The locked esbuild 0.28.2 optional Linux binary successfully transformed a test input without an additional installation script. Neither `package.json` nor `package-lock.json` changed. No new credentials, network-policy change, browser installation or access bypass was used.

All requested available suites now pass, with exit code 0:

- `NODE_OPTIONS=--max-old-space-size=4096 npm run build:mobile`: shared web and offline mobile build, packaged retrieval, vocabulary/reference answers, chat understanding and startup/recovery checks passed.
- `npm run check:images`: 276 Story records and all 662 registered chapters passed, including Joel 3/3, source/web/native bytes, placement, alt text, hidden generic captions, unchanged scripture and missing-opener failure cases. The inherited 1 Samuel 7 opener → verse 2 Story close pair is reported and unchanged; it does not involve Joel.
- `npm run check:mobile`: mobile chrome behavior and real packaged offline worker reading, comparisons, chat, citation provenance, abort/concurrent handling passed with zero external network calls. Native inference remains outside this check.
- `npm run check:release`: release identity, Sites packaging and CSP, refresh/data preservation, embedded byte encoding and pinned public-artwork privacy/failure fallback passed.

The final default compressed Worker is **64,701,734 bytes**, under the **66,060,288-byte** budget by **1,358,554 bytes**. All three Joel images match `src`, `dist/client` and `www` exactly. Generated web and mobile release metadata both report version 1.1.0, build 341, source fingerprint `0265035d263021d12e827fbfb6967f35432d221cfa1698a003b5160d98626dd4`. This fingerprint identifies the unpublished feature source; it is not a claim that live or installed devices match it.

The JSON audit includes every command, exit code, local log path/hash, PASS output, asset hashes and release metadata. Initial failure logs remain under `/tmp`; follow-up logs have the `-followup.log` suffix. Generated build outputs and installed dependencies remain ignored local files. No application changes were needed to resolve the missing dependency.

Still unavailable: Sites mirror comparison, live bytes after the respected CONNECT 403, managed-browser phone/iPad viewports, physical devices, native signing/install/launch. These are not implied by the successful offline worker or packaging tests. Combined-branch integration still requires a union asset pin, a new budget measurement and a spacing rerun. No publication or main merge/push occurred.
