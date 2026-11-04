# BibleLens build 341 release verification

The ten-book artwork batch is published and installed on both connected devices.

- Website: https://scripture-lens.kvn-mcgwn.chatgpt.site
- App: 1.1.0, build 341. Sites saved version: 330.
- Source fingerprint: `e349a6e2440fa87b2b455f91bcfb5654b33cbf9e10cb9e0b6713d6274aedaa0d`.
- Canonical source before final documentation: `86421d0df955a09c5ffaef6adfc68a953709e451`.
- Sites source: `6489207c16040f17c2247db76080520fc6f422b0`.
- Successful deployment: `appgdep_6aea9b1c8ea08191bbbc59c684512e10`.

Books: 1 Kings, 2 Kings, 1 Chronicles, 2 Chronicles, Ezra, Nehemiah, Esther, Job, Psalms and Proverbs. All 368 batch chapters are covered. The Joash/Jehoiada age conflict was resolved with a versioned temple-repair scene without identifiable royal or priestly figures; originals remain in source history. Cross-book continuity decisions and the seven retained close pairs are in the combined review and spacing ledger. All 670 baseline asset blobs, prior chapter metadata, scripture and Story prose/placements were preserved. Four pre-existing stashes were untouched.

## Validation

- Full release:prepare passed: web build, complete content/search checks (including Chromium/WebKit smoke), sync, release packaging, mobile build and mobile checks. Final image checks pass all 659 registered chapters and 276 Story records.
- 736 phone/iPad viewport renders passed for all batch chapters; images decode, stay within the viewport, preserve captions and have no horizontal overflow or page errors. Priority screenshots were inspected. This is viewport QA; physical-device screen appearance was not directly inspected.
- Worker: 64,747,604 bytes against 66,060,288 bytes; 1,312,684 bytes of headroom. All 634 pinned immutable public-origin assets match source bytes. Native artwork remains offline.
- Signed build succeeded, strict codesign passed, and all 1,045 www files match App.app/public exactly. The only signed-only files are Capacitor's cordova.js and cordova_plugins.js stubs.
- iPhone 16 Pro and iPad mini (A17 Pro): install successful, installed version 1.1.0/build 341, activated launch successful, app process present after launch.
- release:verify passed against the canonical checkout and Sites mirror. Live, mirror, mobile and canonical fingerprints match.
- Live audit: 659 chapters retain exact artwork metadata, opening coverage and KJV/ASV/WEB scripture; all 936 active live image files match signed/www/source bytes. Total bytes compared: 113,975,480; all images served from the Site origin.

## Recovery and limits

The first upload failed when the execution environment disconnected; checking saved versions before retry prevented duplication. Reconnection and publication also resolved the earlier live HTTP 403 verification block. Initial disk and memory failures were recovered using task-created duplicate cleanup and a 4096 MB Node heap. No user source, stashes, device data or security settings were removed or weakened. The earlier sandboxed signature trust error passed unchanged verification through the normal macOS trust service.

Readability retains its inherited report-only corpus findings. No release blocker remains. Final evidence is in build-341-release-verification-2026-11-04.json, build-341-live-asset-verification-2026-11-04.json, and the combined continuity/spacing ledgers. Local install/launch/version/process logs and viewport screenshots remain under /tmp/biblelens341*.
