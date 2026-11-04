# Ruth and Samuel build 340 release — 2026-11-04 UTC

Canonical release source: `e834d8bc7acaee7bdca9e0527c600b3805ae81d0`, following the fast-forward of `artwork/ruth-samuel-continuity-2026-11-03` (`d81db27b`). Version 1.1.0, build 340, source fingerprint `43fde089c84c39a26a5dece8131b3053dc2e02ed0656276f7a84beddb73eac59`.

Before integration, GitHub main `d884175d`, freshly opened Sites mirror `e47d263295f3e7baf48491b9432c9dda9a4f1d3e`, and live release all matched Judges build 339 / fingerprint `4a4c3a7f0e0ac270fabefa980cd790fa205636333f8f03c6e5105db84663ba6d`. Canonical checkout and mirror were clean. All four existing stashes remain unchanged. No conflicts occurred. All 627 baseline `src/assets` Git blobs were verified unchanged before and after integration. No existing chapter-image metadata entry changed. The only existing Story mappings changed were the reviewed Endor and Tamar/Absalom corrections.

The initial combined Worker exceeded the 63 MiB Sites budget (72,636,449 bytes). It was stopped before signing or publication. The 38 active Samuel chapter openers were added to the existing checked public-artwork path, pinned to public commit `f434fe8cf21d195af9cae656d98e6601c0acbed5` in `data/hosted-artwork.json`; consult that manifest for the exact pin. Every pinned Samuel origin image was fetched and compared byte-for-byte before deployment. The public path allowlist and 1 Samuel checker were extended accordingly. Offline native images remain bundled. The final Worker is 65,946,813 bytes, below the 66,060,288-byte limit with only 113,475 bytes of headroom; future releases must check this budget.

## Validation and publication

- `npm run release:prepare -- --ios` passed: shared web build; full `check` including Chromium and WebKit search-failure recovery; sync checks; release checks; mobile build and checks; signed Xcode build.
- After the mobile build, `check:readability` and `check:images` passed. Readability remains report-only with inherited findings. Image checks cover 276 Story images and 291 registered chapters, preserved scripture, opener coverage, captions, alt text and web/offline byte parity.
- All 59 Ruth/1 Samuel/2 Samuel chapters rendered at 393×852 and 744×1133: 118 renders, decoded images, no horizontal overflow, unclipped art and hidden generic chapter captions. Representative screenshots were inspected, including Ruth 1, 1 Samuel 7 and 28, and 2 Samuel 5, 13 and 23.
- The 1 Samuel 7 opener and Story image remain two verse positions apart, intentionally retained as distinct scenes. No boundary pair is below five verses. Jerusalem settlement scale remains a documented imagined-setting uncertainty; these depictions are not exact city plans or archaeological evidence. The continuity audit and versioned corrections remain in source history.
- `codesign --verify --deep --strict` passed. Every one of the 738 shared `www` files matches signed `App.app/public` bytes. The signed directory adds only Capacitor's generated `cordova.js` and `cordova_plugins.js`.
- The exact built Worker was staged through `release:sites`, without an independent mirror rebuild. Sites source helper committed/pushed `8e5c594a219ec466a210181c0bf46805fd2b5a3c`. Saved Sites version 329, deployment `appgdep_6aea7c901358819198116ac9fc60ff46`, succeeded with the existing public audience at https://scripture-lens.kvn-mcgwn.chatgpt.site.
- `release:verify -- /Users/kevin/git/BibleLens/.release/sites-mirror` passed against the actual live website, canonical source, mobile bundle and mirror at build 340 / fingerprint above.
- Live Chromium and WebKit smoke tests passed startup, reading, search, map, signed-out sync, sign-in resolution, CSP and runtime checks. Signed-out sync correctly returns 401. Chromium observed two transient 500s for the commandments catalog and contradiction comparison request; both returned 200 on direct recheck. No page runtime errors or enforced CSP failures occurred; hosting injection produced expected report-only CSP notices.

## Installed devices

Both connected devices installed the same verified signed app and reported version 1.1.0, bundle version 340 through `devicectl device info apps`.

The first correctly formed launch attempts were denied because both devices were locked (CoreDevice 10002, underlying FBSOpenApplicationErrorDomain 7 / Locked). No lock or security restriction was bypassed. After Kevin explicitly replied `unlocked`, one retry on each succeeded: iPhone process 40322 and iPad process 16328. Both launch results report success. Browser viewport QA does not substitute for a manual inspection of every chapter on physical devices.

The only Xcode warning was skipped AppIntents metadata extraction because no AppIntents framework dependency exists. The original source checkout, feature branches, old artwork versions, local release cache and personal data are preserved.

Local evidence: `/tmp/biblelens-release340-prepare.log`, `/tmp/biblelens340-images.log`, `/tmp/biblelens340-readability.log`, `/tmp/biblelens340-layout/results.json`, `/tmp/biblelens340-live-smoke.json`, `/tmp/biblelens340-summary.json`, and per-device installation/info/launch JSON files under `/tmp/biblelens340-*`. These local logs are not part of the public app.

Final live image verification passed: all 80 Judges/Ruth/1 Samuel/2 Samuel chapters have live image coverage, and all 88 distinct active images match source, offline www and signed assets byte-for-byte. No release blocker remains. Physical-device launches are confirmed; every-chapter physical-device visual inspection was not automated.

Next session handoff: Review 1 Kings artwork only, starting from canonical main build 340. Read AGENTS.md and RELEASING.md, fetch GitHub and freshly open the Sites mirror, preserve Judges/Ruth/Samuel and all intervening changes, inventory recurring-character references across Samuel, retain the documented Jerusalem-scale and David-age uncertainties, and complete the same checked web/native release workflow.
