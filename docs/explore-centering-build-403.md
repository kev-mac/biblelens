# Explore viewport centering — proposed build 403

The current baseline is merged build 402, `749a01f9faf71768f80a550eba69045bc5c7fdca`, fingerprint `ff4463907cb1ca89830974c21bf83ad514e43f733b7d7ba8a50ece757ec66544`. The parent reports that build is published and installed. This task does not repeat that release, change categories, modify other CI pull requests or publish anything before independent review.

The owner's annotation selects Explore's `main#main` at 493 × 983: remove the unnecessary right-side space, center the active card and darken background tiles further. Its pixels were not supplied to this executor; its footer says 401 and old search chrome, so this review uses fresh actual build 402 renders instead of assuming the concern is obsolete.

## Source diagnosis and focused change

The phone-only carousel rule retains `margin-inline:calc(-1 * var(--lane-gutter))`, where the gutter is 24px. A later rule gives that same lane `width:100%`. The combination shifts the full-width row 24px left of its parent and leaves an unequal strip on the right. Existing build 402 viewport captures already show the active card left of the search field's center. Fresh browser diagnostics will distinguish this offset from an actual visible rail, symmetric page padding and the browser's scrollbar.

The production change is two CSS properties: set that Explore-only mobile row margin to zero, and reduce inactive-card brightness/saturation from .5/.65 to .35/.55. Card dimensions, active artwork/shading, the single row, all seven destinations, the inset search pill and all interaction code remain. People/Places alphabet rails and all directory logic/styles are untouched. Evidence, assessment objects, research, Worker, native configuration, dependency lock and artwork are preserved.

## Verification and release boundary

The new before/after suite renders the actual current build 402 and candidate 403 in Chromium/WebKit, light/dark, at 320 × 844, 390 × 844, 493 × 983, 767 × 1024, 768 × 1024, 983 × 493, 820 × 1180, 1180 × 820 and 1440 × 900. Each of 36 contexts per phase measures all seven active cards: 252 positions per phase, including first, middle, the reported Evidence card and last. It records card/lane/search/main bounds, usable viewport center, scrollbar width, computed margins and visible complementary/alphabet elements. Captures show Stories, Laws, Evidence and Timeline. The after phase must center every active card within 1.5px of the usable viewport center, preserve dimensions and active shading, darken only inactive cards, and retain pointer, pager, keyboard and scrolling behavior. The reference size also tests actual search typing, icon/Enter submission, navigation, clearing and focus return.

The existing build 402 comparison suite against actual build 401, all 56 Explore annotation cases and 12 carousel cases are retained. The existing 56-case People/Places rail suite covers letter bounds, keyboard/tap/drag, native-layout safe areas, rotation and short/split heights. Required release preparation and web/offline assessment, branding and artwork parity remain gates for the final source. Actual screenshots must be inspected separately from assertions; physical devices are not certified here.

Local scoped checks, all 24 review-preservation/range checks, syntax and whitespace pass. Exact-source CI and fresh screenshot inspection are pending. The managed executor has no callable browser-control tool, so the established separate Ubuntu CI runner provides browser execution with Chromium sandboxing required. No local sandbox workaround is attempted.

Fresh Sites metadata shows the same public zLenz: Bible project at Site version 395. The attempted Sites source-helper resource failed to read; no Site source or access state was changed. The parent must reconcile fresh Site source through its supported route before later publication. Keep product/CI pull requests in draft until the coordinating parent completes independent review and the established approval gates. Final artifacts, exact commits, measured centers and remaining verification limits will be recorded below and in the adjacent validation receipt.
