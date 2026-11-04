# BibleLens build 342 release verification

The Ecclesiastes–Amos ten-book artwork batch is published and installed on both devices.

- Website: https://scripture-lens.kvn-mcgwn.chatgpt.site
- App: 1.1.0 / build 342; Sites saved version 331; public audience preserved.
- Source fingerprint: `e82366ea9caf6c5f5afedfae277d349c6a0b161298693bcc23dd2f6937fc0051`.
- Canonical source checkpoint: `49b8e9d14710cf2f1747263eeb8d66cf5f680b6c`.
- Sites source: `ca12233182d18ffcb68960c469dac0722fd93b85`; successful deployment: `appgdep_6aeab13aebc88191acfb3b46cc0baa1e`.

Books: Ecclesiastes (12), Song of Solomon (8), Isaiah (66), Jeremiah (52), Lamentations (5), Ezekiel (48), Daniel (12), Hosea (14), Joel (3) and Amos (9): 229 chapters. All have exactly one opener. The three reviewed versioned Story replacements remain active. All 991 baseline asset blobs, earlier chapter mappings, scripture/Story prose and four original stashes were preserved. Combined full-size identity comparisons and all neighboring-book spacing results are in ecclesiastes-amos-combined-review-2026-11-04.md and its source-verification ledger. No new close pair below five verse positions involves the batch.

## Verification

- Web/mobile build, complete unchanged content/readability/search components, sync, corrected two-browser search/recovery smoke, image, mobile, release and all-229-chapter offline checks passed. Initial release:prepare stopped at the old smoke fixture; the documented sequence was resumed after diagnosis and correction, not described as a successful uninterrupted command.
- All 888 registered chapters pass packaged coverage, source/web/offline image bytes and unchanged scripture. The offline engine exercises every batch chapter with zero network requests.
- All 504 phone/iPad viewport renders passed; priority screenshots were inspected. Normal live browser reading of Ecclesiastes 3 and real mercy search (40 results, including 24 scripture and 12 evidence records) passed.
- Worker: 64,472,233 bytes against 66,060,288, leaving 1,588,055 bytes. All 843 immutable public-origin images match source bytes. Worker-only Sites archive has five files; generated client/static bypass paths are excluded.
- Signed build and strict codesign passed. All 1,251 www files match App.app/public exactly; only Capacitor's two cordova stubs are additional. Signed/native/source release identity matches build 342.
- iPhone 16 Pro and iPad mini (A17 Pro): install success; installed version 1.1.0/build 342; activated launch success; matching app process present in a later final process listing.
- release:verify passed against the canonical release checkout and Sites mirror: live/source/mirror/mobile fingerprint matches.
- Live audit: all 888 illustrated chapters retain exact artwork metadata and KJV/ASV/WEB text. All 1,142 active images (141,138,892 bytes) match source, www and signed assets. All served from Site origin: true.

## Recovery and limits

Documents file synchronization stalls were recovered in /tmp/biblelens342-local; only task-created duplicate generated outputs were removed. The original canonical checkout and four stashes remain untouched. A connection restart interrupted a build and diagnostic; incomplete results were not counted as passes. The smoke fixture's background offline-cache artwork downloads were made local and hash-checked, retaining every first-search, retry, failure, sync and CSP assertion; all actual public-origin image bytes were independently checked.

The Python release.json probe returned HTTP 403 and was not retried or bypassed. The documented Node release:verify had already succeeded; independent authorized chapter/image endpoint reads used ordinary Node fetch without identity/header changes or bypass credentials. An initial HTTP 500 on Numbers 13 was recovered through bounded retries/resume. Device launch option parsing was corrected before launch; the subsequent iPad Locked denial was respected until read-only lock state and Kevin's retry instruction supplied new evidence. Both final launches passed. No credentials were exposed, new API keys created, device data erased or security settings weakened.

Physical-device screen appearance was not directly inspected. Browser viewport checks and native install/version/launch/process checks provide the stated evidence. Inherited report-only readability findings and the existing 1 Samuel 7 close pair remain disclosed. No release blocker remains.

Machine evidence: build-342-release-verification-2026-11-04.json, build-342-live-asset-verification-2026-11-04.json, build-342-signed-asset-verification-2026-11-04.json and build-342-public-origin-verification-2026-11-04.json. Local logs, signed app, exact deployment archive and screenshots remain under /tmp/biblelens342*. The release source is on GitHub main; the Sites mirror is the deployment cache.
