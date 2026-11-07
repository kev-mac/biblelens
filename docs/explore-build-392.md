# Explore annotations — build 392

This follows the accepted build 391 evidence-pill and reader work without
changing its data or removing its features. Build 391 remains preserved in
[successful run 42410122003](https://github.com/kev-mac/biblelens/actions/runs/42410122003)
and [its exact prepared artifact](https://github.com/kev-mac/biblelens/actions/runs/42410122003/artifacts/13589217553).
The `/workspace/biblelens` checkout retains that source and rebuilt bundles;
Explore work uses the isolated `/workspace/biblelens-explore` checkout.

## Resulting behavior

- Remove the All / People & Stories / Evidence / Manuscripts filter row.
  Preserve the original seven collections, plus the two manuscript tools in
  their own lane. The existing evidence-section deep link still opens its two
  collections. Counts, destinations and existing artwork remain unchanged.
- Replace the visible Explore title area with a labeled search field and a
  Search submit button. Retain a screen-reader page heading. Search uses the
  existing library search window and query handling; Escape/Cancel returns to
  the Explore field. Escape in that field clears its draft.
- Hide only Explore's redundant masthead search action. Keep Settings there and
  keep the shared search action available on other views.
- Size collection cards from their container and viewport height. Portrait
  cards use a taller ratio; landscape cards use a wider ratio. Retain cover
  cropping, overlay copy, 21px card corners, scroll snapping,
  pagination and touch/keyboard browsing. Preserve the active card on resize.

## Validation state

Focused Explore rendering, shared query routing, blank/Escape handling,
dismissal focus and CSS contract checks passed, as did the existing reader,
typed-reference and evidence-tag unit checks. Syntax and whitespace checks
passed. The previous Explore carousel test was adjusted for the removed filter
UI and retained nine destinations; no run is claimed for it yet.

The new `check-explore-annotations-browser.mjs` checks 48 Chromium/WebKit cases
across light/dark, portrait/landscape, small phones, the annotated 525×985 size,
iPad sizes and desktop. It exercises real search submission/dismissal, focus,
other-view masthead search, retained destinations, carousel keys/taps, rotation,
cropping, corners, text fit and overflow. It retains screenshots and its actual
case matrix. Browser execution and the complete release gates remain pending a
separate supported CI run for this exact build 392 source. Passing build 391
results must not be attributed to build 392.

## First CI result and follow-up

[Run 42412209652](https://github.com/kev-mac/biblelens/actions/runs/42412209652)
passed release preparation, all retained 80 pill/reader cases, and all 24
Chromium Explore cases. WebKit stopped on an incorrect `innerText` assertion for
the deliberately clipped screen-reader heading. The test now checks its text
content and accessible heading name instead. The run failed overall and did
not accept a prepared release archive.

The run's [screenshots and logs](https://github.com/kev-mac/biblelens/actions/runs/42412209652/artifacts/13590570863)
were downloaded through the authorized artifact tool and their ZIP digest
`9f9e82acacb91b6d107747338962b52ffab743339cb0b2f15bae15e02464d7e0`
verified. Manual inspection covered 525×985 light portrait, 985×525 dark
landscape and WebKit 320×844. It found the Search button stacking below the
input, so the form now explicitly stays in one row with a short placeholder.
The Stories crop now uses an 88% horizontal focal point to retain the doorway
people in portrait, rather than cutting off the person on the right. Source
image bytes and other collection art remain unchanged. Browser checks assert
the compact row and focal point as well.

Focused tests and syntax checks pass for the revised candidate. Its source
fingerprint is `b0593f5516862d9ec7116e88b2a7bbb104829651ce7d00c36a18468d3af83518`.
A new CI run must verify these changes; the first run's passing cases do not
verify this revised source.

The [second run](https://github.com/kev-mac/biblelens/actions/runs/42413466631)
passed release preparation and the retained 80 cases, then caught the compact
search row still wrapping at 320px. The inherited generic `form` rule allowed
wrapping and made its button 100% wide. The revised styles explicitly use
`nowrap` and an intrinsic-width submit button. The portrait Stories count now
sits beside its icon so it does not cover the face at the upper right. The
failure screenshot/archive digest
`8b4c885ad7629ae627d33d79b6642376b9f7735f7744f26c21ed48b1e770c594`
was verified before inspection. That run failed overall.

`npm run check:images` additionally found its active 1 Samuel caption test still
expecting the removed “Imagined scene:” prefix. Aligning that assertion with the
user-approved actual title made the complete image check pass: all Story
assets, all 1,189 chapter images, and all 31 1 Samuel openers retain their text
and web/offline bytes. No image or production caption was changed. An extra
attempt to run the historical Acts checkpoint check failed its fixed build 343
package baseline before reaching captions; it is not a current release gate
and was left unchanged, as were the other historical book checkpoint tests.

The current candidate fingerprint is
`242ae82664a39b4a66caf92a700a4134f7048cbe261279efa6ae1973068aa9f1`.
Focused Explore checks and syntax pass. A fresh CI run, now including the image
gate, must verify this source and all browser matrices before publication.

## Accepted result

[Run 42414444700](https://github.com/kev-mac/biblelens/actions/runs/42414444700)
completed successfully for CI commit
`d848a308d26039204215730300d6b86b3aa6706e`, based on canonical source
`bbe327ca07858a0fd60f9eb855fd093cb67ce90d`. Release preparation, the complete
shared image gate, 24 evidence-pill cases, 56 reader cases and 48 Explore cases
all passed. Browser cases ran in Chromium and WebKit on the GitHub-hosted
runner, with Chromium sandboxing required. No local browser or sandbox repair
was used.

The [accepted artifact](https://github.com/kev-mac/biblelens/actions/runs/42414444700/artifacts/13591475227)
was downloaded through the authorized GitHub artifact tool. Its ZIP SHA-256 is
`98b74de2ffac31eab5c03dae9b31c9ec06a727b93e2f2c11b6cabb5f8f4b2de3`.
It includes the exact prepared web/native bundles, candidate metadata, logs,
screenshots and the actual case matrix; retention expires November 14, 2026.
The inner prepared-bundles archive SHA-256 is
`9f538acd69c081317fedaebee3a823102be903928368ff9992808abc18140234`.
Its manifest identifies build 392 / source fingerprint
`242ae82664a39b4a66caf92a700a4134f7048cbe261279efa6ae1973068aa9f1`.
The 59,182,330-byte Worker SHA-256 is
`e118d536b589495299ea2061dcf0c1b34affb5c5e0daed202ff2270c88c1c23f`;
the local rebuilt Worker matches that digest exactly. Both local web and
unsigned native release metadata match the accepted fingerprint.

An additional byte comparison caught a local native-only build comment
difference in `www/device-bootstrap.js`: esbuild names the symlinked local
dependency path `../biblelens/node_modules/...`, while the CI output names
`node_modules/...`. This is a generated comment, but the local native rebuild
is not claimed byte-identical to the accepted CI native bundle. The verified
archive was safely extracted, without links or traversal paths, to
`/workspace/shared/build392-exact-bundles` (4,466 entries). Use its exact
`dist` and `www` together for artifact transfer, rather than substituting the
local native rebuild. Its candidate metadata retains the tested CI commit and
source fingerprint. No signed app or device installation is included.

Manual inspection of the accepted screenshots covered Chromium 525×985 light,
WebKit 985×525 dark and WebKit 820×1180 light. The search input/button stay in
one row, the Stories count avoids the portrait face, the crop retains the
doorway figures, and tile shapes adjust with orientation. Other cases are
covered by the saved automated matrix; no physical-device QA is claimed.

## Publication and device handoff

No publication or native installation has occurred. A fresh native Sites read
still reports public audience and saved version 386. The retained mirror is
unchanged at `64bea042655bc72df95a994a4b6c70237b2c3f5c`. A fresh source
credential was obtained in memory only; no source push/save/deploy was issued.

The Sites skill and `RELEASING.md` require the source helper to commit, push
and package the exact mirror state. `site-workflow.mjs` is absent from the
installed executor and could not be read through the skill resource provider.
This infrastructure gap blocks that required publishing step. Restore the
supported helper in a capable session, freshly fetch/reconcile the mirror,
copy the canonical source, and stage the already-built Worker with
`npm run release:sites -- <mirror>/dist`. Use the helper's verified pushed
commit/archive for the native save/deploy calls, preserving the public
audience. Do not publish from the old build 391 checkout or rebuild a separate
Sites version. An already-validated Worker-only package is retained at
`/workspace/shared/build392-sites-package`; it has the accepted Worker digest.

Kevin reports the Mac and devices are connected. This cloud session still
exposes only Linux, no Mac/device connector, no configured VPN, no SSH target,
and no `xcodebuild`/`xcrun`. Device installation is pending access from a
Mac-capable session, not denied and not attempted. Preserve local Mac work,
reconcile canonical main, confirm this exact fingerprint, and follow
`RELEASING.md` for signed build/asset comparison and installation. The existing
`--ios --install` script installs only the named iPhone; discover the connected
iPad identifier before installing the same verified signed app there. Verify
build 392 and the fingerprint on both devices. Run `release:verify` after
publication; it has not passed for this unpublished candidate. Preserve the
accepted build 391 artifact and concurrent book-review work.
