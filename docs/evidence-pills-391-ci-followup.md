# Build 391 CI follow-up

The initial candidate remained unpublished. Its separate GitHub-hosted run
[42407770835](https://github.com/kev-mac/biblelens/actions/runs/42407770835)
actually installed matching Chromium/WebKit browsers, required Chromium
sandboxing, verified the original `b6c048593e1d2efb3be3dd08ebd80a17591fbdcce694c95f119fe45220a84088`
fingerprint and passed the complete `release:prepare` command, including required
browser smoke, sync, release packaging and mobile checks. All 24 pill browser
matrix cases passed. The broader reader matrix failed at its sticky-toolbar
non-overlap assertion after scrolling; publication remained blocked.

That run's public logs and release identities are retained in GitHub artifact
[13588626444](https://github.com/kev-mac/biblelens/actions/runs/42407770835/artifacts/13588626444).
No local browser/security workaround, new credentials, publication, installation
or change to the deployment mirror occurred.

The follow-up fixes two findings:

- The header measurement was set on `html`, but responsive declarations on
  `body` shadowed it. Set the measured value on both so the sticky reading bar
  follows the actual header height after scrolling. The unit and browser checks
  now verify the body value and report the failing engine/viewport scenario.
- Switching a pill window to Whole Chapter cleared `activeVerse`, so closing
  could not locate the launching pill. Resolve the retained opener's verse
  identity when chapter scope is active. Add the Whole Chapter → Escape path
  to unit and browser coverage.

The pill matrix also now checks computed text and border colors against each
existing category palette in both themes. Its previous passing result did not
include those new assertions.

Focused unit, reader-annotation, typed-reference and syntax checks passed for
this follow-up. The revised, still-unpublished build 391 fingerprint is
`c38bab5f53d66772592797219cbe80f3b1b1c0e43191b2b2898e9f71b3dee995`.
It requires a fresh CI run; the first run's pass must not be attributed to this
revised source. The existing local `www`/`dist` outputs still identify the
original candidate until rebuilt. Signed native/device and live parity remain
unverified. Continue the isolated CI branch with this exact canonical source;
keep all release gates in force.

The second run,
[42408474347](https://github.com/kev-mac/biblelens/actions/runs/42408474347),
passed release preparation and the complete 56-case reader matrix, confirming
the sticky-header fix. All 12 Chromium pill cases passed with the added color
and focus checks. WebKit stopped at the first raw CSS color-string comparison:
the category RGB identity was correct, but the text/border strings differed
from the independently computed reference. That run failed overall.

The next candidate changes only the browser color assertion to compare rendered
8-bit sRGB channels, allowing one rounding step per channel and retaining the
engine, viewport, theme, raw CSS values and channel values on any failure.
It still requires exact category RGB identity and tests both text and borders.
No production color rule was changed or failed assertion ignored. A new run is
required to determine whether serialization explains the WebKit result.
The current fingerprint for that candidate is
`c3d6da57a5f73dd4e74cb2f7f79c38e6d8b0bed10faf3ce3dded06987ffae38e`.

The third run,
[42409260952](https://github.com/kev-mac/biblelens/actions/runs/42409260952),
again passed release preparation and all 56 reader cases. The rendered-color
check passed all Chromium cases and both WebKit 320px cases, then failed WebKit
390px light: actual text and border were `[194,136,249,255]`, the correct dark
Translation tone, while the light reference was `[109,55,161,255]`. This confirms
the remaining result was not merely a CSS serialization difference. No prepared
bundle archive was accepted or retained as successful.

The test had mutated `state.theme` without persisting the preference, unlike the
actual Settings control, and sampled colors without waiting for color
transitions. The fixture now persists the theme, verifies its state/body class,
waits for color transitions, and includes actual theme identity in every color
assertion. Production colors remain unchanged. The current unpublished
candidate fingerprint is
`3afe738f05b120305275b8e0aff6dc139bd9392c5c60b637c93e339f01bd8910`;
a fourth run is required. Do not attribute the prior run's results to it.

## Accepted build 391 browser result

The fourth run,
[42410122003](https://github.com/kev-mac/biblelens/actions/runs/42410122003),
completed successfully for the exact `3afe738f05b120305275b8e0aff6dc139bd9392c5c60b637c93e339f01bd8910`
fingerprint. It passed the complete release preparation, all 24 pill cases and
all 56 reader cases in real Chromium/WebKit browsers with Chromium sandboxing
required. This includes rendered category text/border colors in both themes,
Whole Chapter focus return, sticky headers, safe-area simulation, pickers and
typed navigation at phone, tablet and desktop widths. These are browser tests,
not signed native/device installation checks.

The successful CI commit is `ab9d548621f38937a4638bc379fc32c3a409b48c`, based on
canonical app source `5f195786fd931d3b98f3d9e803029ed7307f989c`. The differences
outside canonical source are CI configuration/documentation, excluded from the
release fingerprint. The job retained exact prepared public `dist`/`www`,
candidate metadata, source/Worker identities and hashes in artifact
[13589217553](https://github.com/kev-mac/biblelens/actions/runs/42410122003/artifacts/13589217553).
The artifact is 452,903,235 bytes, ZIP digest
`b544601613089909fc2ca7a41318854fc27238ca0ac2ca8aaf2300049f6bd1e7`,
and expires 2026-11-14 at 15:22 Eastern. Its unsigned native assets do not
constitute an installed app. Preserve this accepted candidate while preparing
later UI work; do not substitute another source fingerprint when publishing it.

No Site publication or native installation was performed during this CI task.
The original local browser-control limitations remain; the separate supported
GitHub runner resolved the test-execution blocker without changing them.
