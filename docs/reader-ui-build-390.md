# Reader UI and passage selector — build 390

Kevin's six reading-page annotations, subsequent compact-selector request and typed-reference request are implemented together. The current selector was refined; the historical component was not restored. Canonical baseline was clean GitHub main `d95e79e718c4224bee339eb5e05030279c413c0f`, including the earlier five scoped Exodus assessments. No data or artwork files were changed.

## Changes

- Removed text glow from the chapter heading row and its descendants.
- Kept a single Settings entry in the shared masthead. Removed generated settings copies from the reader and collection headers. The masthead remains available across phone, tablet and desktop widths.
- Applied the safe top inset to the page and sticky masthead at every width, including native iPad. Reading and collection bars follow the measured masthead height. Height measurement responds to larger fonts rather than relying only on a fixed offset.
- Kept the reading-page chapter control at 1.125rem with a minimum 44px target. Long names wrap; the old shrink-to-9px loop and scroll-down shrinking rule were removed. Its border, color and chevron identify it as an action. Links no longer use underlines; visible keyboard focus outlines remain.
- Removed the visible `Imagined scene:` caption prefix while retaining the actual title and existing descriptive alt text. Other provenance and image data are unchanged.
- Removed the reader footer Compare button. Passage comparisons remain available through verse actions, comparison URLs and saved investigations. Closing a comparison returns focus to an available control.
- Removed the Records disclosure from the reader UI with `hidden inert`; its records and legacy script hooks remain intact.
- Made the passage dialog denser with auto-fitting grids, smaller full book names and the shared 12px control corner variable. Book and number targets retain minimum 44px dimensions, and rows can grow for text. Old Testament, New Testament and Lost Books tabs remain. The complete selected collection and chapter/verse numbers are retained. Short viewports and larger text can scroll; no choice is clipped or removed to force a fit. Book/chapter selection advances as before; the final Read Passage button appears at the verse step.
- Added the labeled Type a Reference field and Go action alongside the grids. It reuses the existing comparison/search reference parser and existing reader navigation. Book-only input opens chapter 1; chapters, verses, common aliases, numbered books and same-chapter verse ranges are supported. Actual packaged chapter data verifies verse endpoints. Invalid input marks the field and announces a plain status. Network failure preserves the text. Editing, using the grid or closing cancels stale lookup navigation; Enter respects composition input.

## Regression coverage

`npm run check:reader-annotations` exercises the actual header-measurement function, CSS contracts, full book labels/counts, accessible control metadata, actual caption rendering and typed-reference parser/navigation against the packaged corpus. Tests cover valid and invalid references, numbered-book aliases, missing verses, ranges, network failure and cancellation.

Existing picker, header, mobile chrome, workspace state, image-caption and browser regression expectations were updated for the removed controls. The sync-disconnect test initially reproduced its inherited intermittent `assert(finishRead)` failure. Its harness now waits, with a five-second failure deadline, for the actual held document request instead of assuming 30 event-loop turns finish asynchronous token hashing. Every security/late-response assertion remains, and no production sync code changed. The repaired sync suite passed.

`npm run check:reader-annotations:browser` is ready for an authorized running preview. It defines Chromium/WebKit checks at 320, 390, 647, 768, 820, 1024 and 1366 pixels, both themes, and simulated native safe-area offsets. It checks one settings entry, header/control bounds, scrolling, 44px targets, full names, chapter counts, corner consistency, no glow/underlines, captions, keyboard focus, typed invalid/valid input and preserved comparison routes. This matrix has **not run** in this environment. A simulated safe inset is not physical iPad verification.

## Browser and release constraints

The earlier sandbox-enabled Chromium attempt aborted before page load: `/usr/lib/chromium/chrome-sandbox` is owned by `nobody` with mode 4755; Chromium requires root ownership. This batch did not retry that denied browser operation, disable sandboxing, change its permissions or use an alternate browser route. Managed Sites mode is enabled and no callable `cua_repl.js` is available. Consequently no new screenshots or phone/iPad/desktop visual certification are claimed.

GitHub was fetched before editing and before the source commit. The fresh read-only Sites fetch remains at `64bea042655bc72df95a994a4b6c70237b2c3f5c`, latest saved version 386, public audience. The existing source comparison confirms no independent mirror-only production work. The mirror was not edited or pushed. Earlier book sessions and their ten-session cap were untouched.

Release results are recorded in the accompanying validation JSON after preparation completes. Publication must wait for every required gate. The live Site host previously returned proxy CONNECT 403, and no network-policy change or bypass was attempted. No Mac/device connector, Xcode tools or connected iPhone/iPad is available here. Unsigned offline assets do not establish installation; signing, signed-asset parity and device build-number verification remain pending.


## Final result

Implementation is pushed on GitHub main through `bb0eb2d9488e43f64f11e6ec9534cc05df131ec8` (main UI commit `e19e962`, followed by stricter incomplete-reference validation). Final canonical source, compiled Worker and unsigned offline bundle agree on **build 390**, source fingerprint `dfbd0cc1a03a5ff59d2c301d6452f7e05666b1d39692220897b3511c917e69af`. Existing Exodus review objects also match through both compiled web and offline APIs, with zero external requests.

Focused reader/reference tests, existing picker/header/workspace/mobile-chrome tests, sync, readability in its inherited report-only mode, release checks, mobile checks and packaged Story-image/caption checks pass. `release:prepare` rebuilt both bundles from this exact source, then failed at `scripts/check-release-smoke.mjs:31:32` because `/home/agent/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell` is missing. No browser assertions ran and no completed release candidate was produced. The separate browser matrix remains unexecuted.

**Not published or installed.** No Site version save, deployment, mirror mutation/push or device installation was attempted. Latest observed Site metadata still reports saved version 386 and public access. No live verification was retried through the earlier proxy denial. No installed iPhone or iPad build number is available. See `reader-ui-390-validation.json` for exact outcomes and log hashes.

For the next release session: preserve these commits and all later main changes; open/reconcile the Site mirror afresh; use an environment with a functioning permitted browser and live Site access; run the authored visual matrix and every required release gate; then publish the exact shared source. On the connected Mac, sign from that same source, compare signed assets with `www`, install and verify both device build numbers. Existing authorization to commit, push, publish and install remains in force; failed checks and access restrictions must not be bypassed.
