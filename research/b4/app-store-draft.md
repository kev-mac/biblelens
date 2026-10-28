# B4 App Store and privacy wording proposal

Draft only. Original report remains unchanged. Account and legal facts still need review.

# 9 — App Store Readiness

Branch: `codex/appstore-audit` in `/Users/kevin/git/BibleLens-appstore`.

- Audit commit: `6d94258cf66679d40a6d29674ab45c9c7c0f36c3`
- Audited origin/main: `346bdfd173bb04d54745cd2164a23b9bf905eadd`

Docs: `docs/app-store-readiness.md` and `docs/privacy-policy-draft.md`.

Top blockers:

- No Release archive workflow; the helper builds Debug, and distribution signing remains unverified.
- ChatGPT-only sync sign-in has an unresolved Apple guideline 4.8 risk.
- No account/cloud-data deletion; disconnecting leaves cloud notes and can leave pairing codes.
- Privacy policy, provider practices, labels, and final manifest/API coverage need completion.
- Native icon and launch artwork still use Capacitor defaults.
- Declared iOS 15 support conflicts with newer web APIs; iPad behavior needs testing.
- Age-rating frequencies, content rights, review access, and Store metadata remain incomplete.

Owner decisions:

- Legal seller, Apple team, membership payment, permanent bundle ID, and account roles.
- Apple sign-in, an exception request, or an account-free first product.
- Deletion scope, retention periods, local copies, provider logs/backups, and privacy contacts.
- Final privacy labels, sensitive-note handling, and provider disclosures.
- Minimum iOS version; iPad, Mac, and Vision Pro scope.
- Branding, AI behavior, content rights, age-rating answers, and screenshots.
- Countries, permits, EU trader status, export answers, launch price, and required payment/tax setup.
- Testers, durable review access, support contact, and submission timing.

Self-reviewed. Prose screens near grade 7.2; sentence-length and diff checks pass.
The baseline lacks `check:readability`; its branch checker still flags existing app-content issues.
Worktree is clean. Docs only; no push, PR, build, release script, install, publish, or deploy.
The privacy draft is not ready to publish. Sites/source parity remains unverified.

## Proposed Store Copy

Status: draft for Kevin. This copy makes no claim of App Store approval or a completed release.

Name: BibleLens

Subtitle: Explore scripture and sources

Description:

Read scripture and explore the evidence behind different readings.
Compare passages, translations, scientific findings and historical sources.
See what each source supports and where questions remain.

Start with Big Questions or follow your own interests.
Browse stories, people, places, timelines, commandments and prophecies.
Read source links and keep track of the passages you want to revisit.
Imagined artwork is labeled and kept distinct from historical evidence.

Save notes and bookmarks on your device.
Cloud sync is optional. You can export a backup from Settings.
Reading and search work offline in the native app.
External source links need an internet connection.

Read the Bible in the World English Bible, King James Version and American Standard Version.
The app leaves conclusions and how to use them to you.

## Privacy And Readiness Drafts

The full wording proposals are `privacy-policy-draft.md` and `app-store-readiness-draft.md` in this folder.
Their originals are retained with the source commit above. Open account and legal facts remain pending.
No privacy answers, retention period, age rating, deletion policy or distribution approval is invented here.
