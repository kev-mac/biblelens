# Build 391 browser checks on a separate runner

This narrowly scoped workflow runs only for the same-repository
`codex/browser-checks-391` pull request when its workflow file changes. It does
not publish, install, change repository security settings, create credentials,
alter the Sites mirror or start a server in the managed Codex environment.

The GitHub-hosted Ubuntu 22.04 runner installs the repository's locked packages
and their matching Playwright Chromium and WebKit browsers. Official GitHub
actions are pinned by SHA. The workflow grants only repository contents read
access and does not retain checkout credentials. A small test-only preload
requires `chromiumSandbox: true` even for older tests whose launch options omit
it; there is no sandbox-disable flag or machine security workaround.

The checkout must descend from source commit
`1ecbce3e50e7c4b094ac2a1f2d89dae095265f5c` and must retain build 391 fingerprint
`b6c048593e1d2efb3be3dd08ebd80a17591fbdcce694c95f119fe45220a84088`.
CI configuration and documentation are outside the release fingerprint; no app
source, build number or checked-in test changes are included in this branch.

The job runs `release:prepare`, including both bundled outputs, the complete
check suite, required Chromium/WebKit smoke, sync, release-packaging and mobile
checks. It then verifies both bundles' identities and serves the built Worker
on runner loopback to execute `check-evidence-tags-browser.mjs` and
`check-reader-annotations-browser.mjs`. A failed preparation gate remains a
failed job; the UI steps can collect additional evidence when exact matching
bundles were built. Only selected public test logs and release manifests are
uploaded, with seven-day retention.

The checking agent session inherited the original cloud environment and could
not acquire a working browser. Direct GitHub Actions REST access through the
managed shell was forbidden. This workflow uses the normal repository PR and
GitHub-hosted runner mechanisms, not a proxy around that restriction. Read run
status through the authorized GitHub connector. Do not claim browser execution
until the returned run/job steps and logs confirm it. Keep publication and
installation pending until all release rules pass.
