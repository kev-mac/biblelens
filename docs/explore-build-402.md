# Explore refinements — proposed build 402

Baseline: main `9c4dee52ff66c01c10a3f30420d7f21d74e85322`, accepted build 401. Preserve its twenty-four contradiction assessments, zLenz: Bible name, one Collections carousel and existing destinations. The unrelated CI PR #14 is untouched.

The owner requested a slightly narrower active collection card, darker/blacker background cards, and a magnifying-glass submit button inside a more pill-shaped search field. The supplied observations identify a 493 × 983 viewport. The original annotation images were not attached or assigned recoverable file identities in this session; no claim is made that they were viewed.

## Changes

- The fluid card width changes from 88 to 82 percent of its container; height-based caps change proportionally from 64/96 to 60/90 viewport-height units. The short-landscape height floor also scales to 15rem. Portrait/landscape aspects, crop positions, rounded corners and the single row remain.
- Inactive cards use brightness .5 and saturation .65, previously .67/.81. The active class still removes the filter, so selecting a background card restores its normal appearance. Active copy, image shading and artwork are unchanged.
- The named Search submit button now contains a magnifying glass inside the input's right edge. The field has pill corners, reserved text padding and explicit focus treatment; the icon retains a 44 × 44 touch target. The existing custom Clear control has separate space, while redundant native WebKit search decorations are suppressed only in this field. The shared search handler, required/max-length constraints, Enter, Escape, result routes and accessibility labels remain.

No evidence, Bible, Worker, native configuration, dependency or artwork files change. No extra row, card or navigation control is introduced.

## Final checks and visual review

Product code is `c34cf3178abe8403977a25431a810f0130d9ca2c`. Final CI source is `928e6b3e16a0b29e95da39fbb38d8e242ce0d95f`, run [42644440182](https://github.com/kev-mac/biblelens/actions/runs/42644440182), job `129253775402`, conclusion success. Both identify version 1.1.0, build 402, fingerprint `ff4463907cb1ca89830974c21bf83ad514e43f733b7d7ba8a50ece757ec66544`. Local scoped search/carousel invariants, syntax, whitespace, branding and twenty-four review-preservation/range checks pass. Full required release preparation passed against this final source, including Chromium/WebKit release smoke, sync, release, mobile and shared builds. Actual web/offline parity passed for all twenty-four reviews with zero external requests; branding and artwork parity passed.

The focused comparison freshly rendered actual build 401 and final build 402 in Chromium and WebKit, light/dark, at 320 × 844, 390 × 844, 493 × 983, 983 × 493, 820 × 1180, 1180 × 820 and 1440 × 900. All twenty-eight before captures and twenty-eight after cases passed. Checks cover slight narrowing, increased neighboring-card exposure, inactive-only darkening, active shading preservation, inset icon bounds, text clearance, separate Clear/Search targets, keyboard focus, actual typing, both submit methods, result navigation and no page overflow. Chromium used genuine touch swipes at the annotated viewport; WebKit used real horizontal wheel scrolling and touch pager taps. Physical WebKit touch swipes are not verified.

All fifty-six retained/extended responsive Explore cases and twelve existing carousel cases passed. The verified results archive contains 173 PNGs; Codex inspected sixteen actual final screenshots, rather than claiming the entire archive was visually reviewed. These cover the reference size in both engines, 320px phone, tablet portrait/landscape, desktop, both neighbors beside People and the filled field in Chromium/WebKit. The final views retain one collection row, reveal more of the darker background cards and show a clear pill field. Filled WebKit now shows only the intended custom Clear and Search controls. Captures wait for natural scroll and retry settlement; no UI state was hidden by a test override. Full-page PNG height can exceed the named viewport height; the stored matrix records the actual viewport geometry.

At the 493 × 983 reference viewport, Chromium's active card changed from 378.39 to 352.59px and the right neighbor's exposed edge from 25.81 to 38.72px. WebKit changed from 391.59 to 364.89px and 26.72 to 40.06px respectively. Both fields are 48px high and both submit targets are 44 × 44px.

The separate post-CI visual receipt in `explore-build-402-validation.json` lists all sixteen inspected PNG paths and byte hashes. The immutable CI manifest still says `screenshotsVisuallyInspected:false`, correctly describing its state before this later review. The source annotation images remain unavailable; these are fresh actual-source captures, not archived versions of the user's images. Physical devices and signed native assets were not verified.

## Exact artifacts and remaining release steps

Product [PR #15](https://github.com/kev-mac/biblelens/pull/15) and CI-only [PR #16](https://github.com/kev-mac/biblelens/pull/16) remain drafts. The successful final run retained:

| Artifact | ID | ZIP SHA-256 | Verification on this executor |
| --- | --- | --- | --- |
| `build-402-verified-bundles-42644440182-1` | `13687452509` | `2bd3aba853ce8f8f5d7031c77e08f34f08074e0b50923491243fcb68733ed511` | GitHub receipt only; final bundle not downloaded here |
| `build-402-explore-results-42644440182-1` | `13687402642` | `aedcf146a002fb9d7d803f26d6111f354fcd73c8991ebb4a149ddceb4d8fd911` | Downloaded bytes and ZIP digest independently verified; matrices and sixteen PNGs inspected |

Artifacts expire November 16, 2026, about 15:39 UTC. The independently verified results contain CI's final prepared manifest: Worker 59,204,075 bytes, SHA-256 `ed1468cddf81945c9661ac15e0a77ccc2f3fac2b3716dde8a6908f898ca4dd14`; inner tar SHA-256 `5dafc0694a4717a1c1e8df7b538da9f8ba5df47e21d17b2f979d8f902e6994b0`. Those are CI-computed receipts, not independent verification of the final bundle/Worker bytes on this executor.

The final bundle broker returned `sdmntprwestus.oaiusercontent.com`, without the numeral 2 or 3. This executor's current observed/enforced restricted policy (spec and observed revision 1) allows `sdmntprwestus2.oaiusercontent.com` and `sdmntprwestus3.oaiusercontent.com`, not that host. Local final bundle transfer was not attempted. The final results reference used permitted WestUS3 and was downloaded unchanged through ordinary native-file HTTP transfer; it is not a Library-backed item. No URL was rewritten, no region was requested, and no policy/security setting was changed. No new HTTP or automatic-approval denial occurred.

Earlier check and visual findings were corrected and are recorded in the validation JSON. In particular, the passing run `42640530633` was superseded after actual visual review found duplicate native WebKit erase chrome. Its bundle `13684893898` and results `13685139571`, fingerprint `207dd6982da2a70007bde2e96754220f19542660293cb4807c3b1770b9c73184`, must not be used for release. Use only the final artifacts above after independent bundle verification.

This managed executor has no callable `cua_repl.js`, so no local preview/browser workaround was attempted; supported CI provided the browser runs and actual images inspected here. Fresh Sites metadata still confirms the existing public project, title and version 394. The source credential was obtained privately, but the attempted helper resource returned “failed to read skill resource”; no header/token workaround or Site write was attempted. The parent must reconcile fresh Site source through its supported route before publication.

The remaining steps are concrete: materialize final bundle artifact `13687452509` in an already permitted environment, verify its ZIP/inner tar/actual Worker against the receipts, obtain the established product readiness/merge approval, reconcile Site source, stage the exact tested bundle and verify publication/install under `RELEASING.md`. Keep both PRs in draft until the applicable approval requirements are satisfied. No merge, publication, device installation or CI PR #14 change was performed. The standing install-when-published instruction remains for the parent's supported device workflow. This handoff/validation checkpoint changes documentation only; the tested production fingerprint is unchanged.
