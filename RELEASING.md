# BibleLens shared releases

GitHub `kev-mac/biblelens`, branch `main`, is the canonical development source. The Sites repository for `appgprj_6acba627a6cc8191932fbbc47db8895d` is a deployment mirror. Do not develop separate web and iPhone versions. The same `src/`, `worker/`, `data/`, schema, and build scripts produce both outputs.

Before work, fetch GitHub and open the Sites source with the Sites skill. If the Sites mirror has independent new work, compare and integrate it into the canonical checkout first. Preserve dirty files and stashes. Never overwrite a newer Site with an older GitHub snapshot.

## Release

1. Commit reviewed source changes on the canonical checkout. Run `npm run release:prepare -- --ios --install` on Kevin's Mac with the iPhone connected. Omit the flags when only preparing artifacts. The script rejects dirty source and newer upstream GitHub commits, runs checks, builds both bundles from one source state, and optionally builds/installs iOS. Keep credentials outside the repository.
2. Open the existing Site using its skill and a fresh source credential. Compare against the source opened before development; reconcile unexpected advances. Copy the canonical source and its **already-built** `dist` to that checkout, excluding `.git`, `node_modules`, `www`, signing files, local state, outputs, and research drafts absent from the Site. Do not independently rebuild the deployment mirror.
3. Use the Sites source helper to commit/push/package that exact state, then save and deploy through native Sites tools, preserving the public audience. Push the canonical source to GitHub. Generated dist output is excluded from source control and published only in the release archive. Sites may have a different commit history; `release.json` identifies the identical source contents used for both builds.
4. Run `npm run release:verify -- /absolute/path/to/Sites-checkout`. It checks the live website, canonical source, mobile assets and deployment mirror against one source fingerprint. Compare the signed app's `public` directory with `www` before installation. A release is incomplete if either platform is stale.

The shared build number is `package.json` → `buildNumber` (currently 219). It is stable across documentation/checkpoint commits. Increment it for the next app release. `scripts/release-info.mjs` supplies this same value to web/mobile release.json and to iOS CFBundleVersion; never derive it from the Sites version or Git commit count.

Settings → App version shows the version, build number and source fingerprint on both platforms. The iPhone checks the website and reports mismatches; it cannot install a native update automatically. Website publication does not update an installed iPhone binary. TestFlight/App Store distribution requires a separate Apple distribution setup.

## Cloud sync

On the website, open Settings → Cloud sync, sign in with ChatGPT, and enable sync. Select **Connect iPhone** to create a one-time, ten-minute code. In the native app's Settings → Cloud sync, enter the code and select Connect. The device credential expires after 90 days and can be revoked from the website. Codes and device credentials are stored only as hashes in D1.

Notes, bookmarks, theme and reader preferences sync when changed, on reconnect/focus and every 30 seconds while the app is visible. Reading and search stay on-device. Revision checks prevent stale writes. Three-way merging propagates deletions and retains concurrent note edits together. Local safety backups can be downloaded in Settings, and existing JSON/Markdown exports remain available. Sync is opt-in and never required to read or search.

The additive D1 schema is in `db/schema.ts`; run `npm run db:generate` after future schema changes. Commit the generated `drizzle/` SQL and metadata without modifying applied migrations. The Sites publication workflow provisions the `DB` binding and applies migrations. Authentication uses Sites-provided identity on the web and paired-device bearer credentials on iOS; do not embed a service access token in either bundle.
