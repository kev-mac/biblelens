# Reverse-interlinear Translation view

Prepared on OmniBook in the isolated branch feat/reverse-interlinear, based on canonical build422 commit f545d6317661b9ae189fd135305e5dc731f28800. This is an integration candidate, not a new published build.

Selecting a verse exposes Translation in both the action bar and evidence context. The modal keeps the chosen English edition separate from the explicitly labelled Berean Standard Bible word links. English-order tiles stack English, source script, and publisher transliteration. Hebrew/Aramaic runs are isolated RTL inside an LTR wrapping list; Greek remains LTR. English edition switching updates the reader preference and selected text while retaining the BSB label. Selected English text and source/coverage details are expandable. Escape, Close, backdrop, chapter/view navigation, stale fetches, repeated opening, retry, and focus return are handled.

Data and licensing: see [translation-data.md](translation-data.md). No inferred linguistic alignment, generated transliteration, Blue Letter Bible data, API key, paid service, or new account. The official publisher table covers 31,086 populated verse records in 1,189 chapters across 66 books. Nineteen packaged verse references and all Other Books have no alignment; four source words lack transliterations. These gaps are explicitly shown. There is no verified KJV, WEB, or ASV word alignment. Aramaic and mixed Hebrew/Aramaic verses retain the publisher's per-word language.

The 7,078,262-byte compressed dataset is split by chapter. Native assets include every exact file. The web Worker embeds only checked route metadata and fetches the requested chapter from an immutable public GitHub commit, with length/hash verification, timeout, credential/query isolation, no integrity-bypassing redirect, and immutable caching. Asset commit 66c948f97f1065de111fe7a4a655d7f034b34608 must be reachable publicly before release. The data manifest pins this original commit; preserve it by merging the branch history or publish that original commit before any cherry-pick.

Verification after the final build:
- npm run build:mobile: PASS (also builds the web target).
- npm run check: PASS, including its Chromium/WebKit search matrix.
- npm run check:release: PASS.
- npm run check:mobile: PASS.
- npm run check:translation: PASS, all 1,189 file hashes/byte lengths, 31,086 verse records, language/coverage/gap checks, escaped text, loader cache/retry, origin security, integrity failures, real Worker budget, and native byte parity.
- npm run check:translation:browser: PASS, Chromium and WebKit at 320, 390, 820, and 1366 widths. Checks optimized CSS retention, stacked lines, English visual order, isolated RTL, phone wrapping and overflow, semantic dialog labels, selected-edition switching, Greek, mixed Aramaic, missing verse, retry, Escape/Close, focus return, stale navigation, and repeated context use. Screenshots inspected under .release/translation.
- An independent exact-built-Worker route check passed with a mocked public origin, validating exact bytes and no forwarded credentials/query.
- Direct native-bundle browser confirmation: PASS in Chromium and WebKit at 390px, using real packaged Hebrew and Greek chapter files, correct Mattison labelling and unavailable alignment for Other Books, with zero server API or external-origin requests. An earlier extra matrix timed out during cold startup; the direct cold-start-aware confirmation passed both engines. Native tablet rendering beyond byte parity is not claimed here.
- The readability checker completed successfully in its existing report-only mode.
- Physical iOS installation, screen-reader listening, real deployed translation fetches, and release:verify are UNRUN; this branch has not been deployed.

Worker: 65,343,103 bytes, 717,185 bytes below the unchanged 66,060,288-byte (63 MiB) budget. Source/web/native fingerprint: 318ee1c3124db7afb4a8b241ba51ab476af7415cfc435fed2565c98e0c97d588. Inherited build number remains 422; assign the next shared number during coordinated integration.

Sites source tree 92ce1690bb668429b99d97b3f442da11fc938bbc was compared against f545d631: no differences in src, worker, data, scripts, db, drizzle, package files or hosting metadata. GitHub main was fetched again and remained f545d631. Initial full-history mirror retrieval exhausted the disk; its own partial download was removed, and the lightweight tree comparison completed. An initial native staging attempt also ran out of space; a subsequent complete native build and all final checks passed. A concurrent-build test setup failure was resolved by rebuilding and running the final suite sequentially.

Release coordination:
Commandments is independently prepared as cb80056b3ac94f88917d401092f36d3a521822da on fix/commandment-tags-biblical-order. It also edits src/workspace.js and package.json; preserve both changes when integrating. Video batch10 task is 6af74654-7198-8191-99a6-9fe194400031. No other task's files, branch, release number, publication, or installed app were changed.

Blocked action (known not executed): git push origin HEAD:refs/heads/feat/reverse-interlinear to https://github.com/kev-mac/biblelens.git. Automatic approval review rejected it: “Pushing the branch to GitHub is an external commitment/public disclosure not explicitly authorized by the user; preparation of an isolated local commit does not authorize publication.” User history was checked; no new explicit push approval was found, and the operation was not retried. Approval to push is needed before immutable web chapter URLs can work. No merge, Site publication, or physical-device installation was attempted.


