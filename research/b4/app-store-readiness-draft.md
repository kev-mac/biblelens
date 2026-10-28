Draft wording only. Source: `6d94258cf66679d40a6d29674ab45c9c7c0f36c3`.
Historical account, platform and legal facts have not been refreshed. Keep unresolved assumptions pending.

# App Store Readiness Audit

Audit date: October 26, 2026. Status: **not ready for submission**.

This is a source audit for Phase 5. It does not certify a signed app or approve a release.
All fixes below are recommendations for later work.

## Scope and Evidence

- Branch: `codex/appstore-audit`, created from fetched `origin/main`.
- Source commit: `346bdfd173bb04d54745cd2164a23b9bf905eadd`.
- Source version: `package.json` has version `1.1.0` and build `273`. Neither value changed.
- Only this audit and the privacy draft are intended source changes.
- No build, install, release script, push, PR, publication, or deployment was run.
- The main checkout and Phase 1 worktree were not edited. No stash, clean, or reset was used.
- Review used `AGENTS.md`, `CLAUDE.md`, and `RELEASING.md` from this source.
- The Writing standard and checker were also read from `codex/readability-standard`.
- Kevin's B4 rule sets neutral, respectful framing. Readers choose their own conclusions and how to use the app.

Sites was checked through its read-only metadata tools. The latest saved version was `258`.
Its source commit was `9d54a44334567c7a77cf7870cf8a812e203bc48a`.
This identifies a saved mirror version, not evidence that its files match GitHub.
An unauthenticated request to the live `release.json` returned HTTP 403 from this audit environment.
No fresh Sites source checkout was opened. No existing mirror was changed.
The full source and signed app were not compared. Their match remains unknown.
The owner limited work to this checkout. That rule takes priority over the release guide's request to merge mirror changes.

Apple account records and signing assets were not checked. Service contracts and logs were not checked either.
Absence from Git does not establish absence from those services.
Policy links below were checked on the audit date. Recheck them before submission.

Effort estimates cover one engineer's work. They exclude time spent waiting for owner choices or Apple review.
**S:** up to one day. **M:** two to three days. **L:** four to seven days or more.
These are planning estimates, not promises.

## Native Setup and Distribution

| Item | Current State and Evidence | Gap | Recommended Fix | Effort | Owner Needed |
| --- | --- | --- | --- | --- | --- |
| Bundle identity | `capacitor.config.json` and `ios/App/App.xcodeproj/project.pbxproj` use `com.scripturelens.app`. Display name is BibleLens. | Registration and ownership are unverified. The older product name in the ID is not itself invalid. | Confirm the permanent ID before upload. Match the explicit App ID, app record, native target, and Capacitor config. | S | Yes: account access and permanent identity. |
| Team and signing | Both target configurations use team `PTDWKL9NRT` and automatic signing. Project settings include `iPhone Developer`. | Paid membership, distribution permissions, certificate, and App Store profile are unverified. Development signing alone establishes no distribution readiness. | Confirm the team and membership. Use Xcode's App Store distribution flow and inspect the exported signature and profile. | M | Yes: account, membership payment, signing access. |
| Release archive | `scripts/prepare-release.mjs` runs `xcodebuild ... -configuration Debug ... build`. Output is `.release/ios/Build/Products/Debug-iphoneos/App.app`. | It creates no Release archive or App Store export. No shared `.xcscheme` or export-options file is tracked. | Add a reviewed Release archive path and shared scheme in Phase 5. Use the path and checks below. | M | Yes: distribution access. Engineering owns workflow changes. |
| Version identity | `Info.plist` uses build variables. Xcode defaults are version `1.1.0`, build `2`; `package.json` has build `273`. | A direct Organizer archive could retain build `2`. Prior uploaded numbers are unknown. | Feed archive values from `scripts/release-info.mjs`. Check upload history before the next authorized build increment. | S | Yes: upload history and release choice. No bump in this audit. |
| Toolchain | Read-only commands reported Xcode `26.6` (`17F113`) and iOS SDK `26.5`. LocalLLM's package requires Swift tools `6.2`. | The installed tools meet the current SDK floor. This does not establish an archive succeeds. | Record the actual tools and SDK with the final archive. Validate it with the supported production Xcode. | S | No, unless the release machine needs access or an upgrade. |
| App icon | `ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json` names `AppIcon-512@2x.png`. It is 1024 × 1024, RGB, without alpha. | Visual review found the default Capacitor mark and grid. This is not BibleLens branding. | Supply an approved BibleLens icon. Validate its compiled asset and Store preview, including current appearance options. | S–M | Yes: brand approval; any design cost. |
| Launch screen | `Info.plist` selects `LaunchScreen`. `Base.lproj/LaunchScreen.storyboard` uses the Splash asset with `scaleAspectFill`. | The reviewed 2732 × 2732 splash also shows the Capacitor mark. Phone and tablet crops are untested. | Replace the template artwork with a calm launch view matching the app. Check light/dark startup and all supported sizes. | S | Yes: visual approval. |
| Minimum iOS | Project and `ios/App/CapApp-SPM/Package.swift` declare iOS `15.0`. Mobile build scripts target Safari `17`. | `worker/index.mjs` calls `DecompressionStream` without a fallback. iOS 15 compatibility is not credible from these settings alone. | Choose and test a real minimum. Either supply older-system fallbacks or raise the minimum in separately authorized work. | M–L | Yes: supported-device tradeoff. |
| iPad and other devices | `TARGETED_DEVICE_FAMILY = "1,2"`. `Info.plist` allows portrait on iPhone and all four orientations on iPad. Multiple scenes are disabled. | iPad layouts, resizing, keyboard use, and screenshots lack audit evidence. `armv7` remains in required capabilities. | Test iPad as a supported product. Review the old capability entry against the archive. Decide Mac and Vision Pro availability. | M | Yes: platform scope. |
| Permissions and entitlements | No app entitlement file or sensitive permission purpose strings were found under `ios/`. Native code mainly hosts the web view. | Signing can add entitlements. Dependency presence alone cannot establish which permissions the final app uses. | Inspect final entitlements and permission prompts. Add purpose strings only for APIs actually used. | S | Only for any new capabilities or account services. |

Apple requires Xcode 26 or later and an iOS 26 SDK or later for uploads since April 28, 2026. [Apple SDK requirements](https://developer.apple.com/news/upcoming-requirements/?id=04282026a).
The build SDK and the oldest supported iOS version are separate settings.
WebKit introduced Compression Streams in Safari 16.4, after the declared iOS 15 floor. [WebKit release notes](https://webkit.org/blog/13966/webkit-features-in-safari-16-4/).

The app record's bundle ID cannot change after a build upload. [Apple bundle ID guidance](https://developer.apple.com/documentation/xcode/changing-the-bundle-identifier).
An app record also needs the Account Holder's current agreement. [Create an app record](https://developer.apple.com/help/app-store-connect/create-an-app-record/add-a-new-app/).
Icons may use an asset catalog or Icon Composer. [Apple icon guidance](https://developer.apple.com/help/app-store-connect/manage-app-information/add-an-app-icon/).

### Proposed Phase 5 Archive Path

Use one reviewed source state for the web assets and native bundle.
Keep `scripts/release-info.mjs` as the source of version, build number, and source fingerprint.
Do not edit generated `release.json` files.

The future archive command should use these settings:

```text
project:       ios/App/App.xcodeproj
scheme:        App (shared; Archive action set to Release)
configuration: Release
destination:   generic/platform=iOS
archivePath:   .release/appstore/BibleLens.xcarchive
action:        archive
version:       MARKETING_VERSION from release-info
build:         CURRENT_PROJECT_VERSION from release-info
```

Then validate and distribute through Organizer's App Store Connect workflow.
An automated export may use a reviewed export-options file with method `app-store-connect` for this Xcode version.
Check the export options on the release Mac before adding this step to a script.
Xcode may manage the signing assets itself. Do not assume that a manual setting is needed.

Check the archive's version, team, ID, and signing profile. Also check its entitlements, which grant access to system features.
Confirm the distribution app does not allow debugging through `get-task-allow`.
Retain its symbols for crash reports.
Compare the archive's `Products/Applications/App.app/public` files with the prepared `www` files.
If export changes the package, compare the exported signed app too.
Future release-workflow edits require `check:release` under `AGENTS.md`.
After a future publication or install, run `release:verify` and the signed-asset comparison required by `RELEASING.md`.
None of those release actions occurred here.

## Privacy, Accounts, and Data Removal

| Item | Current State and Evidence | Gap | Recommended Fix | Effort | Owner Needed |
| --- | --- | --- | --- | --- | --- |
| App privacy manifest | No app-owned `PrivacyInfo.xcprivacy` exists under `ios/`. The target has no resource entry for one. | App-specific collection is not documented in a manifest. Final archive coverage is unverified. | Add an accurate manifest in later app work. Include it in target resources and review Xcode's privacy report. | M | Yes: approve data practices. |
| SDK manifests and signatures | Capacitor and Cordova `8.5.3` binary downloads contain manifests and signature files. See dependency findings below. | Presence is not signature validation or proof of correct packaging. LocalLLM has no manifest in its package. | Validate resolved binaries and their manifests in the archive. Review every dependency's API use and collection. | M | No for inspection; yes if vendors or terms change. |
| Required-reason APIs | App Swift files use UIKit, WebKit, and Capacitor. A source screen found no listed API calls in reviewed native source. | Text scanning cannot clear every linked binary. JavaScript storage does not establish a native UserDefaults declaration. | Map each detected API to an approved reason. Do not add sample reason codes without matching use. | M | No for code review; owner approves resulting privacy claims. |
| App Privacy labels | `db/schema.ts`, `worker/sync.mjs`, and `src/sync-core.js` show account-linked cloud storage. | A “Data Not Collected” answer would conflict with sync. Provider retention and account fields are unverified. | Complete the data worksheet below. Check provider practices before submitting labels. | M | Yes: provider access, legal decisions, final answers. |
| Privacy policy | `src/index.html` has a short Privacy section within About. It lacks an operator, contact, and full retention/deletion terms. | No complete published policy or dedicated policy link was found in this source. | Resolve the draft's marked assumptions. Publish a stable public URL later and link it in Settings and Store metadata. | M | Yes: operator identity, contact, legal review, provider facts. |
| Sign-in | `src/sync.js` links to Sign in with ChatGPT on the website. iOS opens that site and redeems a pairing code. | No equivalent Apple login exists. Guideline 4.8 is a material review risk. External pairing adds review friction. | Prefer equivalent Sign in with Apple for sync. Map both identities securely to private data. See the analysis below. | L | Yes: identity architecture and Apple account setup. |
| Account deletion | No deletion screen or account-delete endpoint exists in `src/sync.js` or `worker/sync.mjs`. | Users cannot initiate deletion of their BibleLens account data in the app. | Add clear account deletion with confirmation and an authenticated server operation. Cover data, tokens, and outstanding codes. | L | Yes: retention rules and account scope. |
| Disconnect versus deletion | `/api/sync/disconnect` deletes one device token or all device tokens. It never deletes `sync_documents`. | Cloud notes remain. Pair codes can remain valid. Native revocation failures are swallowed before local credentials are cleared. | Keep disconnect separate from deletion. Report failed revocation and invalidate pending codes during account deletion. | M, within deletion work | Yes: approve user-facing behavior. |
| Local copies and stale devices | `src/sync-core.js` preserves conflicting edits. `src/sync.js` keeps a safety backup and local sync base. | A cleared server row alone could be recreated by an old device or active web session. Local copies also persist. | Design a deletion state that rejects stale writes. Offer explicit local removal and explain exports and offline copies. | L, within deletion work | Yes: retention and recovery tradeoffs. |
| Access controls | Server checks origins, request headers, identity, hashed device tokens, and revisions. Notes are scoped by user ID. | Trusted identity-header injection depends on the hosting boundary. Token storage is web local storage on the device. | Verify the gateway cannot accept spoofed identity headers. Review secure token storage and revoke behavior without weakening merge safety. | M | Yes: hosting configuration access. |

A privacy policy must be accessible in the app and in Store metadata. [Review guideline 5.1.1](https://developer.apple.com/app-store/review/guidelines/#privacy).
Account creation, including a linked web flow, requires an in-app way to start account deletion.
A direct deletion-page link can complete the flow. A routine support email requirement is insufficient. [Apple account deletion guidance](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion).

### Dependency and Required-Reason Findings

`package-lock.json` pins Capacitor `8.5.3` and `@capacitor/local-llm` `1.0.0`.
`ios/App/App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved` pins the Capacitor Swift package.
Its commit is `4c7f346d16196e21fbe23d4a7a6fc7af62af6742`.

The locked npm packages were inspected in memory. Their SHA-512 hashes matched the lockfile.
The pinned Swift package uses binary Capacitor and Cordova frameworks.
Both framework downloads matched the package's SHA-256 checksums.
Their device and simulator frameworks contain `PrivacyInfo.xcprivacy` and signature resources.
Each reviewed manifest declares no tracking and empty collected-data and accessed-API arrays.
This describes those SDKs, not BibleLens's cloud data.

The LocalLLM package includes `ios/Sources/LocalLLMPlugin/LocalLLM.swift` and `LocalLLMPlugin.swift`.
Its `Package.swift` declares iOS 15 and Swift tools 6.2. No privacy manifest was present.
It gates text generation on iOS 26 and uses `FoundationModels.LanguageModelSession`.
The app checks the model, asks it for text, and ends the session. It does not call the image-generation method.
Manifest absence alone does not prove this plugin violates Apple's rules.

The API screen covered file dates, system boot time, free disk space, active keyboards, and user defaults.
No candidate calls were found in the reviewed app Swift or locked package native source.
This was not a full binary-symbol audit. Repeat it against the final linked products.
No Preferences or Filesystem plugin is listed in `package.json`.
Do not treat browser `localStorage`, JavaScript dates, or token expiry dates as proof of required-reason API use.

Capacitor is on Apple's required SDK list. Binary dependencies also need valid signatures. [Apple SDK requirements](https://developer.apple.com/support/third-party-SDK-requirements/).
Only declare API reasons that match the actual implementation. [Apple required-reason API reference](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api).
Bundle the manifest in the correct target and verify its schema. [Apple manifest guidance](https://developer.apple.com/documentation/bundleresources/adding-a-privacy-manifest-to-your-app-or-third-party-sdk).

### Sign in With ChatGPT and Guideline 4.8

Guideline 4.8 covers apps that use an outside service for the user's main account. It requires another suitable login option.
That option must limit collected data to a name and email address. It must let users keep their email private.
It must not use app actions for ads without consent.
The guideline is broader than a rule naming Apple as the only provider. [Apple login rules](https://developer.apple.com/app-store/review/guidelines/#login-services).

Assessment: treat the current design as in scope until Apple confirms an exception.
The account gives access to BibleLens sync, even though reading needs no account.
Moving sign-in to a website does not establish an exception.
BibleLens does not merely display an existing user's ChatGPT content.
No code shows a work or school account flow, or a government ID service.
The sign-in system is not wholly run by the owner.

Recommended choice: add equivalent Sign in with Apple with the same sync features.
It must have a real server integration, not a button that redirects to ChatGPT.
Use IDs verified by each sign-in service. Do not join two note stores just because their email addresses match.
Plan how users link accounts and recover duplicate accounts. Also plan how access is revoked and accounts are deleted.
If Apple sign-in is adopted, include its token revocation in deletion. [Apple deletion guidance](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion).

The owner may instead choose a first release with all account and cloud-sync paths removed from that product.
That is a later product change requiring a fresh audit, not permission to hide features during review.
Another option is to seek an App Review ruling with the actual flow before implementation.
No exemption or approval has been obtained.

### Data Inventory and Proposed App Privacy Answers

Apple's label covers data sent off the device and kept by the app or its partners.
Optional sync still needs disclosure; opt-in alone is not an exemption.
The table proposes answers from code and marks items needing confirmation. [Apple App Privacy definitions](https://developer.apple.com/app-store/app-privacy-details/).

| Data and Code Path | What Happens | Proposed Label / Purpose | Linkage and Open Question |
| --- | --- | --- | --- |
| Account ID: `worker/sync.mjs`, `db/schema.ts` | The site supplies a user ID. D1 uses it as the document key and device owner. | User ID; App Functionality. | Linked to the user. No name, email, or password column exists in these tables. Confirm provider-side fields. |
| Notes: `src/sync-core.js` → `snapshot()` | Sync includes note text and titles, passage notes, verse notes, and saved comparisons called `investigations`. | Other User Content; App Functionality. | Linked to the account. Comparisons include passage choices, edition, title, and note. |
| Saved reading choices: `src/sync-core.js` | Bookmarks and verse highlights sync, including selected text and stored metadata. | Other User Content; App Functionality. Review Product Interaction if Apple's form classifies saved selections that way. | Linked. Do not call this a complete reading-history log. |
| Preferences: `src/sync-core.js` | Theme, text scale, picker position, and reader preferences sync. These include edition and app font. | Other Data Types; App Functionality. Confirm whether Product Personalization also fits the final use. | Linked. The separate `scripturelens-device-ai` setting is not in the sync snapshot. |
| Device access: `worker/sync.mjs`, `db/schema.ts` | D1 stores hashed random device tokens, owner IDs, and expiry times. Pair codes are also hashed. | User ID applies to the owner. Review Device ID for the persistent device credential. Purpose: App Functionality. | Linked. This is not IDFA or a hardware identifier. Confirm the label classification before filing. |
| Sync records: same server files | Document revision and last-update time are stored. Pairing expires after ten minutes; device access after 90 days. | App Functionality; include as metadata with the related categories. | Expiry stops access, not necessarily row retention. Expired device rows have no scheduled purge in this code. |
| Native search and Chat: `src/device-api.js`, `src/device-api-worker.js`, `src/device-bootstrap.js` | Search, chapter requests, questions, and recent context go to the bundled worker. Optional system AI runs locally. | No off-device Search History collection is shown by this native path. | Notes are not added to Chat automatically. Text pasted into a question becomes question content. |
| Website use: `src/reader.js`, `worker/index.mjs` | Website search queries and chapter requests reach the site. Chat sends the question, recent messages, and passage context. | Confirm Search History, Other User Content, and usage disclosures if infrastructure retains these requests. | The app server code shows no database write for Chat. Hosting logs and account linkage are unverified. |
| Network metadata: `src/release.js`, `src/places.js`, `src/data/atlas-style.json`, `src/sync.js` | The app checks the public version on startup. Opened maps fetch OpenFreeMap tiles and fonts. Sync contacts Sites. | Confirm retained IP addresses, diagnostics, usage, and any derived location with providers. | The viewed map area is not the user's GPS position. Do not assert zero logs or zero collection. |
| User-chosen exports and links: `src/app.js`, `src/passage.js`, `src/reader.js` | Files download locally. Passage sharing sends a passage URL, not notes. External sources open when selected. | No app-operated public note publishing is shown. Review any support data once a support channel exists. | Recipients of exported files can read them. External sites have their own practices. |
| Beliefs and other sensitive content: `src/sync-core.js` | Free-text notes may contain a person's beliefs or other private facts. No belief profile is inferred in code. | **Decision needed:** assess Sensitive Info with the final disclosures and actual use. | Do not infer a user's religion from use of BibleLens. Do not claim these notes are anonymous. |

No advertising, cross-app tracking, purchases, contacts, camera, microphone, or GPS collection was found in the reviewed app paths.
No app code for usage reports or crash uploads was found there.
These findings describe the reviewed code. They do not establish what every host or system service does.
The owner must check what each provider collects before claiming no tracking across all data types.
An App Tracking Transparency prompt is not needed merely because sync exists.
Reassess if the final app or a partner performs tracking as Apple defines it. [Apple tracking definitions](https://developer.apple.com/app-store/app-privacy-details/).

### Deletion Acceptance Criteria for Phase 5

1. Offer a clear Settings action to delete the BibleLens account and cloud data.
2. Check who is making the request and confirm their choice. Explain how cloud removal, local removal, and disconnecting differ.
3. Delete the user's cloud record, device keys, and pending codes as one coordinated server change.
4. Block stale device writes and active web sessions from silently recreating deleted data.
5. Require explicit consent before creating a new cloud store or uploading surviving local notes.
6. Plan how to clear local notes and backup copies when asked. Include merge bases, pending journals, and recovery copies.
7. Explain that exported files and disconnected devices need separate removal. Do not promise remote wiping of unreachable devices.
8. State which records must be kept by law. Confirm when service backups and logs will be erased.
9. Keep notes tied to their owner. Preserve three-way merges, revision checks, origin checks, and hashed keys that can be revoked.
10. Run `check:sync` after those future changes. Test deletion races, account switching, expired access, and failed revocation.

Deleting BibleLens data must not imply that the person's separate ChatGPT account is also deleted.
A server must not trust a user ID sent by a client as proof of the right to delete data.

## Content, Age Rating, and Store Information

| Item | Current State and Evidence | Gap | Recommended Fix | Effort | Owner Needed |
| --- | --- | --- | --- | --- | --- |
| Age rating | `data/chapters.json` includes the full reading corpus. Stories, art, editorial records, and Chat add other surfaces. | No completed current questionnaire was available. Audience wording does not determine the age-rating answer. | Use the worksheet below. Review all reachable content and the final AI behavior; let Apple calculate the rating. | M–L | Yes: approve answers and any higher age override. |
| Religious and historical content | `src/index.html`, `data/evidence.json`, and source records distinguish text, interpretation, and limits. | This audit did not verify every quotation, record, or image. Sensitive material and generated prose need review. | Review for respectful language and accurate quotations. Keep source limits and uncertainty. Do not invent scholarship or certainty. | L | Yes: final editorial and rights decisions. |
| Private notes and AI | `src/sync-core.js` stores private notes. `src/device-bootstrap.js` can generate explanations, enabled when the system model is ready. | No public feed exists, but generated text creates content-safety risk. No in-app report flow was found. | Explain private notes to Review. Test harmful prompts and misleading answers; add an accessible reporting/contact route and suitable safeguards. | M–L | Yes: AI scope and moderation/contact responsibility. |
| External links | `src/reader.js`, `src/places.js`, and `src/index.html` link to sources, maps, and sign-in. | Native browser behavior, broken links, and linked content were not tested. | Verify every important link on-device. Keep source labels clear. Confirm links cannot expose local notes or native bridge access. | M | Yes for support destinations and external-service terms. |
| Content rights | `data/provenance.json`, `data/reference/notices.json`, and `src/vendor/*LICENSE*` retain source notices. `scripts/build-mobile.mjs` adds native licenses. | A worldwide rights clearance was not supplied. Source labels alone cannot establish rights in every territory. | Review text editions, quotations, adapted datasets, map attribution, fonts, artwork, and generated images. Keep license notices accessible. | M–L | Yes: legal/rights approval; possible license costs. |
| Export compliance | `Info.plist` has no `ITSAppUsesNonExemptEncryption` entry. HTTPS is used; token hashing occurs in `worker/sync.mjs`. | App Store Connect export answers are unknown. Hashing is not proof of end-to-end note encryption. | Inventory shipped crypto, including dependencies. Complete Apple's questions; set the exemption flag later only if justified. | S–M | Yes: legal declaration and territories. |
| Store listing and support | `Info.plist` names BibleLens and sets an education category value. About describes sources and privacy. | No Store listing pack, public support contact, screenshots, review account, or policy URL was provided. | Prepare accurate metadata, category, rights answers, support URL, screenshots, and review instructions. Keep AI and offline claims precise. | M | Yes: seller identity, contacts, category, final copy. |
| Payments and agreements | No StoreKit, paywall, subscription, or checkout path was identified in the reviewed app code. | App price and commercial plans are unknown. Free app access does not waive developer membership or agreements. | Decide launch price. Add paid-app, banking, and tax setup only if the chosen business model needs them. | S–M | Yes: payments, contracts, tax and banking. |
| Regional availability | No App Store territory decisions are tracked. The product contains religious texts and commentary. | Regional permits and EU trader status are unresolved. | Choose territories explicitly. Resolve any required religious/publishing permits and trader information before enabling those stores. | M–L | Yes: legal, identity, territories, possible fees. |
| Accessibility and phone quality | `src/index.html`, `src/style.css`, and reader controls include labels, text size, and reduced-motion styles. | Markup alone proves no VoiceOver support. The visible text-size slider ends at 150%. | Test core tasks with VoiceOver, larger text, contrast, and reduced motion. Keep Inter consistent through `readerPreferences.appFont`. | M | Yes: approve any advertised accessibility support. |
| TestFlight and review | The current script installs a development app directly. No TestFlight evidence or upload automation was found. | A direct install does not validate beta or Store distribution. | Follow the staged checklist below using the final Release archive. | M, plus review waits | Yes: account roles, testers, review contact, final submission. |

Apple's guideline 1.1.5 bars hostile religious comments and false or misleading quotes from religious texts.
Guideline 1.2 also covers AI content tools. Private notes alone do not make the app a public social service.
Show how offline reading, search, and notes make the app useful during review. [Apple content and design rules](https://developer.apple.com/app-store/review/guidelines/).

Keep Method & Sources available through the footer. Keep its Explore card and Prophecies deferred as instructed.
Review reachable deep links too; a hidden gallery card does not prove the underlying content is absent.
Use title case for timeline headings shown to readers. Keep the underlying research titles unchanged.
Describe imagined portraits as imagined. Preserve dignified portrayals of African and Middle Eastern people.

### Age Rating Worksheet

These are proposed answers and review tasks, not completed App Store Connect answers.
Apple now uses 4+, 9+, 13+, 16+, and 18+ ratings, with regional differences.
Its form asks about broad sharing of user content and chat between users. Private notes serve a different role. [Apple age-rating definitions](https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions).

All passage examples below were checked in the bundled `data/chapters.json`, decoded in memory.
They describe included text, not claims that the events occurred.

| Question Area | Proposed Answer or Review Task | Code / Content Basis |
| --- | --- | --- |
| Parental controls and age assurance | No in-app controls found. Do not claim them. | `src/index.html`, settings in `src/reader.js` and `src/sync.js`. |
| Advertising, social media, messaging | Proposed No. Chat is a search/AI interface, not communication between users. | `worker/index.mjs`, `src/reader.js`, `src/device-bootstrap.js`. |
| Broad user-generated content | Proposed No for private notes. Recheck the final AI feature and any sharing expansion with Review. | `src/sync-core.js`, `src/passage.js`; no public note-feed route. |
| Unrestricted web access | Proposed No only if external sources open outside the app and there is no general browser. Verify on-device. | `target="_blank"` links in `src/index.html`, `src/reader.js`, and `src/places.js`. |
| Mature or suggestive themes | Present. Owner must assess frequency across the corpus, summaries, and art. | Judges 19 and Ezekiel 23; `data/stories.json`. |
| Sexual content or nudity | Present in text. Do not answer None because it is scripture. Check frequency and all illustrations. | Genesis 9:21; Ezekiel 23:20; Judges 19:25. |
| Realistic violence; weapons | Present in text. Evaluate frequency under Apple's definitions. | Joshua 6:21; Judges 19:29; 1 Samuel 17:51. |
| Graphic or sadistic violence | Detailed violent text warrants explicit review. Do not make a blanket No claim without assessing presentation. | Judges 19:29; the full passage and artwork need review together. |
| Horror or fear themes | Present in text; assess frequency and intensity. | Revelation 20:10 and its surrounding chapter. |
| Alcohol, tobacco, drugs | Alcohol references are present. Assess frequency; inspect other substances separately. | Genesis 9:21; John 2:10. |
| Profanity or crude humor; cartoon/fantasy violence | No final answer from this audit. Review all editions, excerpts, art, and AI outputs. | `data/chapters.json`, `data/evidence.json`, `src/device-conversation.js`. |
| Medical/treatment; health/wellness | Proposed No for advice features. Review health-related editorial records for wording that could function as advice. | `data/evidence.json`, `worker/answer-layer.mjs`; study content does not establish a health service. |
| Gambling, simulated gambling, contests, loot boxes | Proposed No for app features. Biblical descriptions do not create a gambling mechanic. | No such interaction or payment flow found in reviewed `src/` and `worker/`. |

Do not select the Kids category based on educational content.
Kevin approved neutral framing for all readers. Actual content still determines the questionnaire answers.
Do not promise a 4+, 13+, or 18+ outcome before completing the current form.
This review leaves frequency choices open because it did not inspect the entire corpus and every image.

### Export, Rights, and Regional Decisions

Apps using HTTPS through the operating system often do not need export documents.
The owner must still answer the encryption questions using the actual shipped app. [Apple encryption guidance](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations).
If no export documents are needed, record the answer in a later, reviewed Info.plist change. [App Store Connect encryption workflow](https://developer.apple.com/help/app-store-connect/manage-app-information/determine-and-upload-app-encryption-documentation).

Apple lists an Internet Religious Information Permit as required for apps with religious content in China mainland.
Publishing permits and an ICP filing may also apply. Do not select that territory without resolving these requirements. [Apple territory and content-rights information](https://developer.apple.com/help/app-store-connect/reference/app-information/app-information).
For EU stores, the owner must decide whether they are a trader. Traders must supply verified public contact details. [Apple EU trader requirements](https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements/).
Review each planned African and Middle Eastern market. This audit does not grant legal clearance for any country.

Source notices are useful evidence, not a new rights ruling.
A public-domain label on a dataset does not prove it can be used freely in every country.
Keep the existing limits on copied sources. Continue to link to NETS files without bundling them.
Keep credits for adapted data and the notices that govern sharing it.

### TestFlight and Submission Sequence

1. Fix the account and data-removal gaps first. Resolve the privacy, device-support, and branding gaps too.
2. Confirm membership, team access, permanent bundle ID, agreements, and an App Store Connect app record.
3. Prepare one shared source state and a Release archive with the approved version and build identity.
4. Check signing, entitlements, manifests, the privacy report, and crash symbols. Compare signed web assets with `www`.
5. Validate and upload through Organizer. Wait for processing and resolve errors and export-compliance questions.
6. Add beta description, contact details, review notes, and a durable way to review sync.
7. Start with internal testers. Add external testers after any required Beta App Review.
8. Test upgrade and fresh install, offline launch, reading, search, note edits, exports, and restore.
9. Test sync conflicts, account changes, deletion, old devices, revoked tokens, and service outages with synthetic notes.
10. Test the oldest supported OS, current OS, a non-AI phone, an AI-capable phone, and supported iPads.
11. Test source links, maps, system browser return, share sheets, keyboards, accessibility, and reduced motion.
12. Complete the Store listing using the final app. Include privacy, age rating, rights, country, price, and screenshot details.
13. Select the tested build for App Review. Choose a release method only after the owner approves submission.

TestFlight allows up to 100 internal users and 10,000 external testers. A beta build lasts up to 90 days. [Apple TestFlight overview](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/).
Use a demo account or full demo mode for review. A one-use code expiring in ten minutes is inadequate alone.
Provide access that works more than once. Keep the owner's own account and private notes out of the review setup.
Explain external services, account setup, optional AI, and how to test offline features. [Apple review-access guidance](https://developer.apple.com/help/app-review/before-submitting-for-review/complete-review).

Current screenshot guidance calls for an iPhone Dynamic Island medium-display screenshot and an iPad 13-inch screenshot when supported.
Use the image sizes in the current table. Show the real app, with no transparent areas in the screenshots. [Apple screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications).
Only claim support for access features after testing the tasks users need to do.
Apple's current page says these labels start as optional. Check the live submission form before filing. [Apple accessibility labels](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/overview-of-accessibility-nutrition-labels/).
Compatible iOS apps may appear on Mac and Vision Pro by default. Review those choices before launch. [Apple submission guidance](https://developer.apple.com/app-store/submitting/).

## Owner Decision List

1. Confirm the legal seller, Apple team, paid membership, account roles, and bundle ID to keep.
2. Choose Apple sign-in, seek a ruling from Review, or launch a product that has no accounts.
3. Decide what deletion removes and how long data is kept. Include local copies, service backups, and logs.
4. Name the legal operator and privacy and support contacts. Choose public web addresses and confirm what providers do with data.
5. Approve the App Privacy answers. Include sensitive notes, device keys, logs, and any tracking.
6. Choose the minimum iOS version and supported iPad, Mac, and Vision Pro experience.
7. Approve the icon, launch view, AI behavior, editorial review, rights clearance, and age-rating answers.
8. Choose countries, EU trader status, and any permit work; confirm the export declaration.
9. Choose free or paid launch, required agreements, and any banking/tax setup.
10. Choose testers and a review account or demo mode that stays usable. Name a review contact and plan submission timing.

## Self-Review and Limits

The audit was performed and reviewed by the same agent, as requested.
File paths and key claims were checked against the recorded source commit.
Icon and splash images were viewed. PNG dimensions and color types were inspected.
Locked dependency archives were inspected without installing packages or modifying app code.
No private user notes, account credentials, or live database records were requested.

The baseline has no `check:readability` npm script.
The requested npm command therefore cannot validate this checkout as-is.
The checker from `codex/readability-standard` was used separately for a prose screen and baseline content report.
Its built-in checks cover app content, not Markdown docs.
Code names, file paths, and quoted source titles need a separate review.
Self-review checked the privacy draft for short sentences, plain language, and marked assumptions.
The prose screen estimated grade 7.2 for each document, excluding code, tables, headings, and quoted source titles.
Table cells were also checked for sentences over 20 words. None remained after review.
The baseline collection report still flags existing length and jargon issues. It also flags high grades for People and Explore.
Those app-content issues were outside this docs-only task. The report-only checker result is not a strict readability pass.

This is a docs-only change, so sync and release-workflow checks were not applicable.
No archive, runtime test, Store upload, legal clearance, or complete content review is claimed.
The privacy draft is **not ready to publish**. Confirm its open facts and fix the deletion flow first.
