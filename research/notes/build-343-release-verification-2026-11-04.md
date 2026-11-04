# BibleLens build 343 release verification

The Obadiah–Matthew ten-book batch is published and installed on both devices.

- Website: https://scripture-lens.kvn-mcgwn.chatgpt.site
- App: 1.1.0 / build 343; Sites version 332; public audience preserved.
- Source fingerprint: `897c1dfad11bd31e4545f5a1803382276e79281b8eda957fb48b4170ed9453a8`.
- Canonical release source: `369181fbd7f72478f2f6c9a5328464085c1aa456`.
- Sites source: `57013c141639c6db19098d50708ed6201e396ee2`; successful deployment: `appgdep_6aeac4db9d68819186250c24776698d0`.

Books: Obadiah 1, Jonah 4, Micah 7, Nahum 3, Habakkuk 3, Zephaniah 3, Haggai 2, Zechariah 14, Malachi 4, Matthew 28: 69 chapters. All have exactly one opener, using 56 new chapter images and 13 existing Story openers. The reviewed Matthew Story v2 remains at its original placement; its original asset is retained. The combined full-size review and continuity references are in obadiah-matthew-combined-review-2026-11-04.md. All 1,215 baseline source asset blobs and all four original stashes were preserved.

## Verification

- Full release:prepare completed successfully: web and mobile builds, aggregate content/readability/search/browser checks, sync, release packaging and mobile tests. Both browser first-search, transient recovery, 21-second cold timeout, persistent-error rejection, CSP and sync controls passed.
- check:images passed for all 957 registered chapters. Packaged offline engine checks all 69 batch chapters, 74 image placements, exact KJV/ASV/WEB source text and zero network requests. Three inherited empty ASV strings are explicitly preserved and asserted.
- All 276 chapter renders passed in Chromium and WebKit at phone and iPad dimensions; sampled screenshots were inspected. Live Matthew 16 showed the chapter opener and replacement Story image; normal mercy search returned 40 results, including 24 scripture and 12 evidence records. Footer showed build 343.
- Worker: 64,367,615 bytes against 66,060,288; 1,692,673 bytes headroom. All 900 immutable public-origin assets match source exactly. Sites saved the five-file Worker-only archive, with no static/client bypass configuration.
- iOS build and strict codesign verification passed. All 1,308 www files match signed App.app/public bytes; only Capacitor's two cordova stubs are extra. Signed plist, web, native and source identity match.
- iPhone 16 Pro and iPad mini (A17 Pro): installation success, installed 1.1.0/build 343, activated launch success, and matching running process in later listings.
- release:verify passed: live/source/mobile/Sites mirror share one fingerprint.
- Actual live bytes: all 957 illustrated chapters retain exact artwork metadata and all three scripture editions; all 1,198 active images (148,563,324 bytes) match source, www and signed files. All images served from the Site origin: true.

## Limits and recovery

The inherited corpus readability command remains report-only and reports existing findings. A separate check of all 57 new image descriptions averages grade 7.06, with no overlong sentences or flagged unexplained jargon. Complete-canon spacing is unchanged: 63 adjacent/64 all close pairs with opener coordinate 0, 67 adjacent/68 all with coordinate 1. No pair below five verse positions touches this batch; the machine ledger preserves every inherited pair and relevant book boundary.

The independent offline audit initially required nonempty strings for every edition. Exact source comparison identified existing empty ASV strings at Matthew 17:21, 18:11 and 23:14. The corrected assertion checks types, exact source text and exactly these three blanks. No scripture was changed. One iPad process query failed with a device streaming connection error; a read-only retry succeeded. Both installs and launches succeeded on the first attempt. No unlock request, access bypass, new credential setup, security change or device-data erasure was needed.

Physical device screens were not directly inspected. Responsive browser checks and native version/launch/process checks are the stated evidence. Original local source and four stashes remain untouched. No next batch was started. No release blocker remains.

Machine reports: build-343-release-verification-2026-11-04.json, build-343-live-asset-verification-2026-11-04.json, build-343-signed-asset-verification-2026-11-04.json, build-343-public-origin-verification-2026-11-04.json and the combined source/spacing ledger. Local logs, signed build, exact archive and screenshots remain under /tmp/biblelens343*. These are temporary execution artifacts; GitHub holds the durable source and reports.
