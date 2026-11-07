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
