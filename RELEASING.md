# BibleLens shared releases

GitHub `kev-mac/biblelens`, branch `main`, is the canonical development source. The Sites repository for `appgprj_6acba627a6cc8191932fbbc47db8895d` is a deployment mirror. Do not develop separate web and iPhone versions. The same `src/`, `worker/`, `data/`, schema, and build scripts produce both outputs.

Before work, fetch GitHub and open the Sites source with the Sites skill. If the Sites mirror has independent new work, compare and integrate it into the canonical checkout first. Preserve dirty files and stashes. Never overwrite a newer Site with an older GitHub snapshot.

Reuse the local Sites mirror at `.release/sites-mirror` when present. Open it with a fresh source credential before each release so Git fetches changes incrementally; do not create a new full-history checkout for every batch. This cache is ignored and is never copied into deployment source or backups.

## Release

1. Commit reviewed source changes on the canonical checkout. Run `npm run release:prepare -- --ios --install` on Kevin's Mac with the iPhone connected. Omit the flags when only preparing artifacts. The script rejects dirty source and newer upstream GitHub commits, runs checks, builds both bundles from one source state, and optionally builds/installs iOS. Keep credentials outside the repository.
2. Open the existing Site using its skill and a fresh source credential. Compare against the source opened before development; reconcile unexpected advances. Copy the canonical source to that checkout, excluding `.git`, `node_modules`, `www`, signing files, local state, outputs, and research drafts absent from the Site. Do not independently rebuild the deployment mirror. Run `npm run release:sites -- /absolute/path/to/Sites-checkout/dist` from the canonical checkout to stage its **already-built**, self-contained Worker and `.openai` metadata. Never copy the whole shared `dist`: Sites may serve `dist/client/index.html` ahead of the Worker and drop CSP headers. The packaging step excludes `client`, `wrangler.json` and the asset manifest; `check:release` verifies this contract, HTML headers and signed-out sync.
3. Use the Sites source helper to commit/push/package that exact state, then save and deploy through native Sites tools, preserving the public audience. Push the canonical source to GitHub. Generated dist output is excluded from source control and published only in the release archive. Sites may have a different commit history; `release.json` identifies the identical source contents used for both builds.
4. Run `npm run release:verify -- /absolute/path/to/Sites-checkout`. It checks the live website, canonical source, mobile assets and deployment mirror against one source fingerprint. Compare the signed app's `public` directory with `www` before installation. A release is incomplete if either platform is stale.

The shared build number is `package.json` → `buildNumber` (currently 222). It is stable across documentation/checkpoint commits. Source fingerprints normalize CRLF to LF so Windows and macOS checkouts identify the same release. Increment it for the next app release. `scripts/release-info.mjs` supplies this same value to web/mobile release.json and to iOS CFBundleVersion; never derive it from the Sites version or Git commit count.

Settings → App version shows the version, build number and source fingerprint on both platforms. The iPhone checks the website and reports mismatches; it cannot install a native update automatically. Website publication does not update an installed iPhone binary. TestFlight/App Store distribution requires a separate Apple distribution setup.

## Cloud sync

On the website, open Settings → Cloud sync, sign in with ChatGPT, and enable sync. Select **Connect iPhone** to create a one-time, ten-minute code. In the native app's Settings → Cloud sync, enter the code and select Connect. The device credential expires after 90 days and can be revoked from the website. Codes and device credentials are stored only as hashes in D1.

Notes, bookmarks, theme and reader preferences sync when changed, on reconnect/focus and every 30 seconds while the app is visible. Reading and search stay on-device. Revision checks prevent stale writes. Three-way merging propagates deletions and retains concurrent note edits together. Local safety backups can be downloaded in Settings, and existing JSON/Markdown exports remain available. Sync is opt-in and never required to read or search.

The additive D1 schema is in `db/schema.ts`; run `npm run db:generate` after future schema changes. Commit the generated `drizzle/` SQL and metadata without modifying applied migrations. The Sites publication workflow provisions the `DB` binding and applies migrations. Authentication uses Sites-provided identity on the web and paired-device bearer credentials on iOS; do not embed a service access token in either bundle.

## Lazy asset builds

`npm run build` now writes public data, chapter files, search shards and UI assets
under `dist/client`. The default Worker includes a compressed fallback and opens
these files only when needed. It remains self-contained for the existing Sites
Worker ESM deployment contract. Native builds retain the same source corpus in
the offline engine; no network access is added to native reading or search.

`BIBLELENS_STATIC_ASSETS=1 npm run build` removes the fallback. This experimental
artifact needs a Cloudflare `ASSETS` binding serving `dist/client`, with
`run_worker_first: true` to preserve response headers and CSP. Its generated
`dist/wrangler.json` describes that contract; it does not provision Sites or D1.
The current Sites Worker starter documents embedded assets only. Do not publish
the experimental artifact through the current Sites workflow until that binding
and asset upload support are confirmed. Do not add `static` to hosting.json:
that field selects a static-only deployment and would drop the API and sync.

Local checks and `npm start` load static-mode files through a Node-only adapter.
They use the real generated handler. A successful local check does not verify
that Sites will provision an asset binding. Keep `dist/client` with an experimental
static artifact; its Worker cannot run without those files and an asset binding.

For the default compressed build, the Sites copy contains only `dist/server` and
`dist/.openai` (including D1 migrations). The canonical `dist/client` and
`dist/wrangler.json` remain available for local checks and experimental Cloudflare
use. `release:sites` rejects an experimental static build without the fallback.
