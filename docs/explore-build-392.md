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
  cropping, focal positions, overlay copy, 21px card corners, scroll snapping,
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

No publication or native installation has occurred. The Sites mirror was
freshly opened and remains unchanged at saved build 386 / commit
`64bea042655bc72df95a994a4b6c70237b2c3f5c`, with no newer independent work.
No Mac/device or signed native build is available. Follow `RELEASING.md` after
the exact source passes all gates; preserve the accepted build 391 artifact.
