# Stories video integration

The Creation pilot uses YouTube ID `BDNJ8-wtaeA` and its reviewed local poster.
The web player and native bundle share the same manifest and playback assets.
Kevin approved the unlisted upload on KVN MCGWN with embedding enabled:
https://www.youtube.com/watch?v=BDNJ8-wtaeA.

## Selected poster and footage review (2026-11-05)

The current Library skill successfully materialized the exact parent-selected
day-three frame, `biblelens-creation-poster.jpg`, Library file
`libfile_fdc0ee5748308191a9f040624d0ae9ba`, version 0. The supported helper applied
and verified its Library identity and version attributes. The original is RGB,
1280 × 720, 120,694 bytes; SHA-256:
`7bd624a04bc0d459349c003571d399c3cd0f7b7501f01a2aec1e8c0729739234`.

Actual pixels were inspected at full size, along with the compressed result.
Waves meet a rocky coastline with distant hills and emerging plants. The frame
is relevant to the land-and-plants sequence, has natural colors, no people or
anatomy concerns, and no text to compete with the Play button. This supplied
selection is a footage derivative; no exact timestamp was supplied or invented.

The versioned asset is `src/assets/story-video-creation-poster-v1.webp`:
1280 × 720, 67,246 bytes, WebP quality 85; SHA-256:
`c2359bb7a7b8669388f743bb02606d1a1cc0db5f8532979e8b2d7b3d65d4779e`.
The Library original remains separate and unchanged. Both builds package the
same poster. Reader and offline fallback art retain `story-the-creation-v2.webp`.

The approved pilot also materialized from Library file
`libfile_2ca1b9220b2c81919acbd60a7943453f`: 18,208,549 bytes, 53.917 seconds,
1280 × 720 H.264 with AAC audio; SHA-256:
`db7830b6f4dde64b880eb64d651a0ad1cdd9daf7b609116ff135ec3996d9e0af`.
Full-file FFmpeg decoding passed. Sampled frames show the captioned sequence:
light, sky, land and plants, heavenly lights, sea life and birds, land animals
and people, then rest. The accessible description follows these observed scenes.
Footage and contact sheets are inspection inputs, not app assets.

## Playback

Only Stories directory cards use videos. Reader artwork, topic-sheet art, story
summaries, navigation, scripture, private notes and offline reading are retained.
For a ready video, the initial online view shows the locally packaged video-frame
poster and a labeled Play video button. No YouTube request starts until Play.
YouTube's official IFrame Player API keeps its native controls, captions and
fullscreen. The app adds no overlay on the playing video. Playback never starts
on browsing, page load or reconnection. Pausing retains the player and its frame;
ending restores the poster.

The app loads `/story-video-player.html` as the outer frame. On the web this is
same-origin; native apps use the existing HTTPS BibleLens host. That public page
loads the official API and privacy-enhanced YouTube embed. Its HTTPS context and
`strict-origin-when-cross-origin` referrer policy supply the referring page that
YouTube requires, including inside a native WebView. It accepts only ready video
IDs compiled from the manifest. It receives no notes, device token or service
credentials. The native app itself loads no remote script.

The outer app accepts player states only from its current frame and the exact
frame origin. API errors (including blocked embedding and error 153), iframe
errors, or 15 seconds without initial playback/buffering recovery restore the
original image and offer Retry. A connection loss tears down playback and uses
the original image. Reconnection restores the poster; another tap resumes near
the last reported second. Show image is available outside the player, including
when a browser reports a misleading connection state. Leaving Stories, hiding
the app, replacing cards, or page teardown removes the player and its timers.

The framed player reserves a 16:9 area with a 200px minimum height for YouTube's
minimum viewport. Buttons have accessible labels, keyboard focus and touch-size
targets. Status changes are announced; a visible Video description provides a
text alternative. A failed poster falls back to the original image. Artwork
remains labeled as an imagined scene.

The video bytes are never part of the native bundle or the service-worker shell.
Only the small poster and player assets are packaged locally.

## Verification and remaining limits (2026-11-05)

Fresh GitHub checks found main at
`d5aa79ab2ac2b6137b517eb7fcc0f6b85e12ed48` and the feature branch at
`cedfde006f87092ff5bad98ae12969dbe91de193`, with no newer main commits.
The Sites mirror was fetched read-only at
`3663c831dbb2ff14fd3ffc89129298ff508542f0`; its src, worker, data, scripts,
package files and hosting configuration match main. No independent deployed
source needed reconciliation. Main, existing edits and stashes were preserved.
The Sites source helper is absent; no Site source was pushed.

A packaging defect was found and fixed: CSS pruning omitted Play button,
actions and description styles because the study stylesheet did not scan
`story-video.js`. The scan now includes it; an asset regression checks the
actual packaged CSS along with active-ID and poster web/native byte parity.

The previous Library transfer blocker is resolved. However, one normal
proxy-respecting request to the official YouTube oEmbed endpoint still returned
`Tunnel connection failed: 403 Forbidden`. Environment status reports the new
enforced configuration and YouTube host grants. The mismatch is unresolved.
User-message history was checked after the denial; it contains no later change
that warrants another attempt. No alternate YouTube endpoint, proxy bypass or
executor switch was attempted. This was a proxy denial, not an automatic
approval-review rejection.

Managed browser tooling (`cua_repl.js`) is absent. The Sites skill explicitly
requires skipping browser QA in that case, without starting a preview server,
installing a browser or improvising another browser-control path. Therefore
live embedded decoding, online/offline transitions in a real browser,
responsive phone/iPad views, keyboard focus, controls, captions and fullscreen
remain unverified. Physical iPhone/iPad HTTPS bridge acceptance, signed-asset
parity and installed playback also require the release environment. Callback
fixtures are not proof of real YouTube playback. Do not call this a completed
or synchronized release.

Automated fixtures cover poster rendering, no browsing autoplay, offline/error
images, timeout, buffering, retry/resume, reconnection, ended poster, hidden-page
teardown, failed poster and exact message origin/source checks. Manifest
validation requires a reviewed local poster and description before activation.
Asset checks cover the active ID, shared poster/player bytes, dimensions,
retained production CSS, narrow policies and no bundled video or shell YouTube
prefetch. The shared `npm run build:mobile` build passed. All 65 unique non-browser
checks expanded from `check`, `check:mobile`, `check:images`, `check:release`,
`check:sync` and `check:videos` passed; the updated current-stylesheet regression
also passed. Readability passed in its existing report-only mode. The one
browser-dependent `check-release-smoke.mjs` was explicitly skipped; `check:ui`
and physical device tests were not run. Full logs and per-check results are in
`outputs/creation-video-integration/` (ignored). Source syntax and
`git diff --check` passed. The final web and native release records both match
current source fingerprint
`9b831242403183dd3a298de0fc21996fcc66bab8034b52b3b02e5702072495d5`.

Before release, finish real-browser and physical-device QA, then follow
RELEASING.md. Publishing, merging and device installation need Kevin's explicit
approval. Build number 346 remains unchanged for this unreleased work.

## Run real browser checks in the existing local development session

Run `npm run check:videos:browser` from this branch in the existing Mac checkout.
It rebuilds the Worker when its source fingerprint is stale, serves it on a
temporary loopback port, and uses the project's installed Playwright Chromium
and WebKit browsers. No separate preview-server command is needed. It closes
the preview and browsers when done and writes a machine-readable report and
internal screenshots to `outputs/creation-video-browser/` (ignored).

The command checks phone and iPad viewport layouts, the real poster, no YouTube
requests before Play, actual YouTube playing/time events, a warm offline image
transition, reconnection without autoplay, a deliberately blocked player with
Retry, and playback teardown on navigation. Live failures stop further live
attempts; it never switches endpoints to get around a denial. Missing browsers
or failed playback produce an incomplete/failing report, not a passing result.
The report strips URL queries and records no request headers or account data.

`--plan` prints the intended checks without starting a server or browser. On
managed Linux, the command exits 2 before building, serving or launching anything;
that environment must use its provided browser/preview tools. This is preparation
for the already-requested local testing, not a claim that browser checks ran in
the cloud. Physical iPhone/iPad playback, fullscreen/controls/caption usability and
native HTTPS-bridge acceptance remain separate connected-device checks.

The follow-up runner preparation passed JavaScript syntax, `--plan`, and the
managed-environment refusal check (exit 2 before any preview/browser startup).
The shared web/mobile build, `check:videos`, Stories, `check:mobile` and
`check:release` passed again. The real browser runner has not been executed;
its existence is not a passing browser or device result. The full 65-check
integration result above belongs to the preceding integration verification.

## OmniBook browser verification and release blocker (2026-11-05)

The local Chromium and WebKit runner completed all 20 checks successfully at
390 x 844 and 820 x 1180. The real approved YouTube embed produced both playing
and advancing time events in all four engine/viewport combinations. Poster,
no browsing autoplay, warm offline/reconnect, deliberately blocked-player
fallback/Retry and navigation teardown also passed. These are browser viewport
tests, not physical iPhone/iPad or installed-app tests. Results and screenshots
are in `outputs/creation-video-browser/`.

An earlier interactive Chrome attempt reached the error fallback without
confirmed playback. That timeout did not reproduce in the controlled runner;
no player protocol, timeout, endpoint or autoplay policy was changed.

The phone test found that the stage's aspect ratio and 200px minimum height
could enlarge its width beyond the figure. Explicit width bounds now keep it
inside the card, and the runner checks its actual bounds instead of relying
only on document scrolling.

The web build passed, but the mobile build failed while Python moved the
complete staged bundle to `www`: Windows returned `WinError 5: Access is denied`.
Disposable relative-path, absolute-path and same-parent directory moves passed,
including a Node-created directory moved by the same Python runtime. One
evidence-based retry of the real build failed identically. No security settings
or access restrictions were changed, and no alternate move tool was used on
the denied bundle. The required mobile and web/native parity gates remain
blocked. Nothing was merged, pushed or published during this verification.

The expanded release, sync, mobile, video, image and UI groups ran 71 unique
checks: 62 passed and nine failed. Six failures depend on the missing `www`
bundle. The other failures are the framing audit's Windows path exclusion,
a UI assertion equating scroll width with the viewport despite a Windows
scrollbar, and the performance browser check timing out on
`[data-lens-inspect]`. Full per-check logs are retained in
`outputs/repair-release-checks/`; this is not a passing release candidate.

## Windows preparation recovery and build 347

The intelligence-update event supplied during diagnosis did not identify a
controlled-folder block. No security setting or permission was changed. The
inspected complete bundle moved successfully with the original Python helper
after staging had exited. Stopping the compiler alone inside the old process
was insufficient. The builder now runs staging in a child process, waits for
that process to exit, and then invokes the same directory handoff helper.
The full web/mobile build passed with matching release identities.

Release preparation now constructs both bundles before running parity checks,
so those checks can run in a fresh checkout. Existing Windows bundles remain
protected by the helper's refusal to perform an unsupported atomic exchange.
Use a fresh isolated Windows release checkout; preserve any previous generated
bundle before preparing another candidate. Mac and Linux retain their atomic
exchange behavior.

The framing audit now normalizes its existing path exclusion on Windows. UI
checks account for the stable scrollbar gutter, skip invisible disclosure
contents, search for records beyond page one, and establish Evidence state
explicitly. Inline profile tests use the dialog's close behavior. These changes
retain the actual overflow, touch-size, persistence and navigation assertions.

The earlier incomplete results above remain historical. Build 347 is the next
release candidate; final checks and publication are recorded by the release
workflow and handoff.

## Video direction

Keep the approved Creation pilot's grounded realism as the video target. Preserve
recognizable recurring characters and use their approved visual references.
Runtime follows the story: prefer 15 or 30 seconds where sufficient; aim below
one minute, allowing a few seconds over only when needed. Add no filler to reach
a fixed duration. The Fall of Man follows after Creation integration and is not
generated by this change.

## Platform references

- [Official IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
- [YouTube embedding, privacy-enhanced mode and referrer requirements](https://support.google.com/youtube/answer/171780?hl=en)
