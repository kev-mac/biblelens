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

No publication or native installation has occurred. The Sites mirror was
freshly opened and remains unchanged at saved build 386 / commit
`64bea042655bc72df95a994a4b6c70237b2c3f5c`, with no newer independent work.
No Mac/device or signed native build is available. Follow `RELEASING.md` after
the exact source passes all gates; preserve the accepted build 391 artifact.
