# BibleLens build 344 release verification

Mark–Philippians is reviewed, merged, published and installed. Status: **published and installed; device launches pending**.

- Live website: https://scripture-lens.kvn-mcgwn.chatgpt.site
- App 1.1.0 / build 344; Sites saved version 333; public audience preserved.
- Source fingerprint: `5d6e4c943bf74b3bf8e1c182baaf0e2caf6d99e5931897e924241b1f3032906f`.
- Canonical release source: `911fc4c5a342870964aefe11648eb747f1e623ac`.
- Sites source: `8c9650c1d31364a2f573f1de390e085c9503b134`; successful deployment `appgdep_6aead31152f0819199a536b5f1f0f7a9`.

Books: Mark 16, Luke 24, John 21, Acts 28, Romans 16, 1 Corinthians 16, 2 Corinthians 13, Galatians 6, Ephesians 6 and Philippians 4: 150 chapters. Exactly one opener each, using 113 chapter images and 37 existing Story openers. All 56 Story placements remain. Pentecost and first-journey v2 replacements preserve their original roles; Acts 23 v2 removes faint generated corner lettering. Full-size combined character/style/text/anatomy findings and actual reference paths are in mark-philippians-combined-review-2026-11-04.md. All 1,274 baseline assets, baseline scripture/prose/mappings and four original stashes were preserved.

## Verified checks

- Full release:prepare passed: web/mobile builds, aggregate content/readability/search checks, two-browser healthy/transient/cold/error search recovery, CSP/sync controls, release packaging and mobile tests. check:images passed for all 1,107 registered chapters.
- Packaged offline engine passed all 150 batch chapters and 169 image placements with zero network requests. Exact edition values and field presence match source, preserving 24 blank strings and the absent WEB fields at Romans 16:26–27.
- All 600 full chapter viewport renders and 20 focused renders passed in Chromium/WebKit at phone/iPad dimensions. Focused views cover Luke 1, Luke 22:20, John 7/8 and repaired Acts 23. The normal live browser loaded build 344, decoded the actual Acts 23 v2 image and exercised real search.
- All 1,015 immutable public-origin images match source bytes and SHA-256. Worker is 63,967,306 bytes against 66,060,288, leaving 2,092,982 bytes. The exact five-file Worker-only archive was saved and deployed; no static/client bypass was added.
- iOS build and strict codesign passed. All 1,419 www files match signed App.app/public bytes; only two Capacitor cordova stubs are additional. Signed plist, source, web/native release metadata and Sites mirror share the fingerprint above.
- Both iPhone 16 Pro and iPad mini (A17 Pro) have installed version 1.1.0/build 344. Launch verification remains blocked: iPhone 16 Pro, iPad mini (A17 Pro) returned iOS Locked denials. Manual unlock was requested; no denial was bypassed.
- release:verify passed against live/source/mobile/Sites mirror. Actual network comparison verified all 1,107 illustrated chapters' metadata and KJV/ASV/WEB text, including missing fields. All 1,311 active images (165,147,814 bytes) match source, www and signed assets. All served from Site origin: true.

## Disclosures and remaining work

The inherited prose readability command remains report-only. New alt descriptions independently average grade 6.23 with no overlong sentences or flagged unexplained jargon. Complete-canon spacing records 64 adjacent/65 all near pairs with opener coordinate 0, and 69/70 at coordinate 1. Every baseline pair remains; only the disclosed John boundary pair and coordinate-1 Luke pair were added. Original Story placements and required openers were retained. Luke 22's New Covenant image remains inherited topical Jeremiah imagery.

The initial raw mirror audit used Git clean-filter hashes on an existing CRLF source file; no-filters verified identical raw bytes. One screenshot caught the normal retry indicator for optional /api/sync/session returning 503 in the empty local fixture environment. Focused checks recorded those responses, confirmed no reading/image failures and waited for natural retry completion before final captures. Actual live checks remain separate. The first iPhone install ended with an interrupted remote connection; installed-version reconciliation proved build 343 remained before the successful ordinary retry. Device lock denials were respected. No security setting, device data, private note or source credential was exposed or changed.

Physical-device screen appearance was not directly inspected. Native installed version and launch/process evidence are reported separately. No next batch was started. The device launch blockers, if any, are listed explicitly in the machine report; otherwise no release blocker remains.

Repair deliverable: `src/assets/chapter-acts-23-opening-v2.webp`. Built-in tool, exact inputs/prompt and output hash: mark-philippians-acts23-repair-2026-11-04.json. Generated original remains in the project generated_images folder. Final report evidence includes build-344-live-asset-verification-2026-11-04.json, build-344-signed-asset-verification-2026-11-04.json, build-344-public-origin-verification-2026-11-04.json, the combined source/spacing ledger and both layout reports. Local logs, signed app, exact archive and screenshots are under /tmp/biblelens344*. GitHub holds the durable source and reports; /tmp artifacts are temporary.
