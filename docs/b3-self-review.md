# B3 Self-Review Against codex/b2

Baseline: `8ccc900e5cc283f63952c27d599717a019ca98fd`.
Only the B3 worktree was edited. The canonical release checkout and existing previews were not modified.
Cached GitHub and Sites references were inspected without fetching or synchronizing either source.
Their different tips do not establish a synchronized release or current remote state.

## Evidence Drafts

Reviewed all 81 added exact sentence pairs and their stated meaning limits.
No general synonym replacement or automatic clause splitting was used.
The transformation verifier reconstructs each field from the accepted original, explicit pairs and existing field overrides.
Originals, IDs, source objects and draft status remain checked against accepted data.
Edition aliases keep their full names in the source metadata. None is integrated into the app.

The changes improve 373 fields across 368 records relative to B2.
They clear 20 of the 1,734 held records. The remaining 1,714 records are still unfinished.
The strict audit remains a failure; a grade average of 6.79 does not override sentence or jargon limits.
There are still 2,825 overlength field lines and 2,070 unexplained-jargon lines under that audit.
People and Stories retain their existing meaning flags.

The Romans/James scope includes a Rahab discussion whose intended placement is unclear.
That whole field remains verbatim, with a new explicit meaning hold in the checked table.
The verifier now rejects a rewritten field when its meaning hold requires the original.
Untouched fields retain their earlier flags; new flags distinguish quote-stripped audit results from literal sentence counts.
Neither audit thresholds nor quotation exemptions were relaxed.

## Offline App and Navigation

The manifest reuses the existing app icon. Its copied source bytes are included in release fingerprinting.
Light and dark browser colors follow the explicit app theme, including synced theme changes.
The public offline endpoint reuses the same decorated chapter map as the web API and native engine.
It avoids a second corpus in the Worker assets and native package.
The worker cache name comes from `release-info.mjs`, never a hand-edited release file.

Installation uses an atomic public-resource download, omitted credentials and rejected redirects.
Failure leaves the active version intact. The update waits for existing clients instead of forcing a mixed-version reload.
Activation removes only old BibleLens shell caches. User storage and unrelated caches are untouched.
Requests use an allowlist before cache lookup. Sync, sign-in, private APIs, authorization headers and non-GET requests bypass it.
Tests poison the actual cache with stale private responses, then verify online freshness and offline failure.
An unvisited chapter matches every online field, and a cold reload reads it without internet.
Cloud sync merge bases, revision checks, origins, token hashes, revocation and offline edits remain unchanged.

Route transitions are centralized in `setView`, covering history and cold feature routes.
Self-review found the older workspace wrapper also starting transitions; it was removed to prevent nested transitions.
Cancellation keeps the latest render and handles the expected rejected readiness promise.
Reduced motion bypasses transitions and menu scroll animation.

The Settings menu had been hidden by both markup and CSS. It is now discoverable there.
Its supported path uses native Popover dismissal and Escape, with the old dialog as a compatibility fallback.
Modal editors retain their dialog semantics. Closing the menu restores the visible Settings button.
A focus check caught the Settings close event stealing focus from the new popover.
The handoff waits for the Settings close event before opening the menu and focusing its close control.
Escape restores Settings.
Phone matrices cover the existing layouts; the new browser test covers both engines and motion settings.

## Security and Proposal Scope

The captured Sites injections execute with three enforced restrictions next to the existing report-only policy.
The same header also enforces `worker-src 'self'` on the web.
A same-origin map worker replaces the web blob; native retains its required custom-origin blob path.
The replay exercises three captured injections in Chromium and WebKit, through the stubbed challenge-script boundary.
It does not claim to replay the remote Cloudflare challenge implementation or verify a live deployment.
The full-script-policy negative control still demonstrates blocked hosting injection.
The inherited Phase 3 browser check treated WebKit’s missing report-to diagnostic as a blocked resource.
It now filters only that diagnostic and also asserts zero enforced CSP events before and after reload.
Actual CSP errors remain failures; hosted and native Phase 3 matrices are both exercised.

No installed Capacitor plugin provides secure credential storage.
The exact Keychain, migration, crash, pairing, disconnect and validation plan is in `research/b3/secure-storage-plan.md`.
No new native plugin, entitlement, signing or install was attempted.
The existing native token remains in localStorage pending that separate implementation.

The Teachings & Laws proposal covers all 21 holds, the older Exodus hold separately, and three example cards.
Family and work lists keep explicit form labels. No instructions become completed events.
It changes no category or accepted content. F20 still requires its supplied KJV correction before acceptance.

The cleanup report is an inventory and proposal only. No branch, stash, tag or worktree was removed or archived.
All registered worktrees are conservatively kept because active jobs and dirty state were not inspected.

## Remaining Risks

The unfinished Evidence queue blocks completion of B3.
Offline storage needs an initial successful download and can be evicted or refused by the browser.
Offline support guarantees shell and Bible reading; server search, evidence APIs and sign-in still need internet.
The icon is the existing 1024-pixel asset, without a new maskable crop.
Native secure storage and signed-device behavior remain unverified.
`npm ci` reports seven moderate advisories in the inherited dependency tree; no dependency was changed.
No publication, installation, build-number change or signed-platform synchronization is claimed.
