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

## Original manual-play pilot

This section records the original pilot. The viewport update below supersedes
its automatic-play and preloading behavior.

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
the last reported second. No separate Show image control is shown. Leaving Stories, hiding
the app, replacing cards, or page teardown removes the player and its timers.

The framed player reserves a 16:9 area with a 200px minimum height for YouTube's
minimum viewport. Buttons have accessible labels, keyboard focus and touch-size
targets. Status changes are announced; a screen-reader description provides a
text alternative. The idle control is a small play silhouette without a visible
caption or description disclosure. A failed poster falls back to the original image. Artwork
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

## Direct R2 videos (2026-11-05, feature branch)

Kevin selected the current `r2.dev` URL temporarily for The Fall of Man,
Cain and Abel, and The Line of Seth. This development endpoint is rate-limited
and is not a production hosting recommendation. Migrating to a production custom
hostname requires changing the explicit approved origin in
`scripts/story-videos.mjs` and the three manifest URLs, then rebuilding both
clients. Do not silently switch hosts or add wildcard media permissions.

The manifest now supports `provider: "mp4"` with a plain HTTPS `src`, alongside
the unchanged Creation YouTube record. Validation rejects unapproved hosts,
credentials, queries, fragments and non-MP4 paths. Only the approved R2 origin
is added to the shared application's media policy. The YouTube bridge still
receives only YouTube IDs. No source video enters the repository, native bundle
or service-worker shell.

MP4 playback is local to the app's HTML video element, with native controls,
inline playback and a locally packaged poster. Browsing creates no video element
and makes no R2 request. Only Play or Retry attaches a source; preload is `none`.
Pause keeps the frame. Errors, offline, navigation, hidden pages and
unmount stop playback and release the remote media resource. Reconnection never
autoplays; the next tap resumes near the last reported time. Ending restores the
poster and resets the next play. Loading/buffering has the existing 15-second
fallback. A browser autoplay restriction retains the native Play control.

The existing Story/reader images remain unchanged as offline/error fallback.
Each video retains its accessible description, announced status, keyboard-focus
handling, and original imagined-scene label. Descriptions below concern observed
visual footage; no unreviewed audio transcript or caption track was invented.
Fall of Man already contains burned-in captions and a title.

### Reviewed source frames

All three original public downloads fully decoded with FFmpeg. Eight frames per
video and each final compressed poster were visually inspected at full size.
No new imagery or biblical research was created. All posters are 1280 x 720,
lossy WebP, and below 100 KB. Selected faces, hands and limbs had no obvious
malformations. Fall's original title/caption bands remain outside the Play area;
the other selected frames are text-free.

- The Fall of Man: 28.80 seconds, 11,563,547 bytes. Source SHA-256
  `9a3a1dbbc1a8c90bf13169b379aefa6b9de1dd01fc6663d593027f28ded3ae71`.
  Poster at 4.0 seconds: Eve faces the serpent in a fruit tree.
  `story-video-fall-of-man-poster-v1.webp`, 91,898 bytes; SHA-256
  `26ed5b92939e97744fa7d5cba034dad70c7b76a72ed19106799a26de19f55f80`.
- Cain and Abel: 17.50 seconds, 6,946,169 bytes. Source SHA-256
  `a4ca8323e7a65b353bb9979cdb0642fa5ff55ca2cac3730949f3ec7888e05a43`.
  Poster at 1.0 second: two men with grain and a lamb beside a stone altar.
  `story-video-cain-and-abel-poster-v1.webp`, 90,734 bytes; SHA-256
  `5463ac9f259807ab95627d3c27f74505887c75d046195eac4c5e3140d3a7204a`.
- The Line of Seth: 17.50 seconds, 8,319,041 bytes. Source SHA-256
  `360800be5213d80a61378e90ab03e15608ddf8acebd032c9344849b4a28aeb5e`.
  Poster at 1.0 second: three adults and a child walk through green hills.
  `story-video-line-of-seth-poster-v1.webp`, 91,064 bytes; SHA-256
  `626134ab08644e5cc2d1ea310fbb0ec6643ba4cafcce3047f07d490edce7d0a2`.

### Verification scope

The new `check-story-mp4.mjs` covers lifecycle and validation fixtures.
`check-story-mp4-browser.mjs` uses the real Worker with the application CSP
**enforced**, not merely reported, and tests actual public MP4 decoding on phone
and iPad viewport sizes. `check:videos:browser` runs both the unchanged Creation
browser suite and the new MP4 suite. Full result files are written to ignored
`outputs/r2-video-browser/` and `outputs/creation-video-browser/`.

Before development, GitHub main `845e9ad43e6e3a2d3835d97fb285586b33071a8a`
and freshly fetched Sites `ac64ca098da8f926803ca8a024937280142c7fe4` matched
exactly for src, worker, data, scripts, package files and hosting configuration.
The pre-existing local Sites mirror has divergent history; the helper stopped
without overwriting it. It was inspected through its fetched commit only.
The authoritative Windows checkout, its main branch and stash remain untouched;
this change uses a separate feature worktree. Windows checkout CRLF conversion
was normalized to repository LF for the unchanged Worker template before building.

This is an unreleased feature branch. Build 347 remains unchanged until release
preparation. No merge, Site publication or device installation is included.
Physical iPhone/iPad playback and signed installed assets require a separate
connected-device release session.

Windows WebKit's media requests are not observable or abortable through the
Playwright network API. A bounded diagnostic confirmed actual changing visual
frames, pause/seek, end/restart, and offline resume, rather than relying only on
a playing clock. The final runner checks these behaviors in both engines. It
uses an intentionally CSP-blocked media source for WebKit's error/Retry test;
Chromium additionally verifies network-abort fallback and the exact R2 request.
The test waits for a seek to finish before simulating connection loss. Cutting
the connection during a pending seek is not evidence that the destination frame
was watched or its position reported.

Final verification completed on 2026-11-05: all 72 MP4 browser cases passed
(three videos, Chromium/WebKit, phone/iPad viewports), with real advancing and
changing frames. All 20 existing Creation YouTube browser cases also passed.
The final shared web/mobile build and `check`, `check:mobile`, `check:release`,
`check:sync`, and `check:videos` passed. The broader security, phone UI,
performance and hosted-CSP suite passed on the same application code. Readability
passed in its existing report-only mode. Independent code review found no
remaining actionable issue after the buffered-stall and pending-pause fixes.
Web and native release records match source fingerprint
`c309c93f9d56eba2cb4ac8ab49b58e5cd07a1205525d680de897bae51c368bf3`.
No physical-device, audio-transcript, deployment or native-install claim is made.

## Viewport playback (current behavior, unreleased feature)

This section supersedes the earlier gesture-only browsing behavior above.
On ordinary connections, a Story video plays muted once after its video stage
is at least 60% visible for 180 ms. Native video/YouTube controls retain Play,
Pause, sound and fullscreen. Automatic playback does not take keyboard focus.
A browser that refuses autoplay keeps its controls and a short Play prompt.
Videos never loop. Ending returns the poster, with the small Play control for
an explicit replay. Show image also suppresses automatic restart.

Only one player may run. Leaving the viewing area stops playback. Hysteresis
keeps the current story until it falls below 35% visibility or another story
is clearly more visible. Small scroll changes do not restart a paused or ended
video. A stage must be completely offscreen for 500 ms before a later viewing
can start fresh. Hidden pages, navigation, offline transitions and unmounts
release active and preloaded resources. Returning to the tab or reconnecting
does not replay the current viewing automatically.

The previous and next available video in the currently rendered Story list
are prepared while the current story is in view. No other story video is
prefetched. MP4 neighbors use the browser's preload=auto hint, and the same
video element is promoted when viewed. Browsers decide how many bytes to fetch
and may fetch the full clip. This is a two-neighbor limit, not a byte guarantee.
YouTube neighbors initialize the official player with autoplay disabled and
sound muted. YouTube controls media buffering; its API does not promise full
video-byte preloading. No hidden video is played to force buffering. The bridge
accepts Play commands only from its parent window and the exact parent origin.

Reduced motion, Save-Data and slow-2g/2g connections disable automatic playback
and adjacent preloading. Manual Play still works. Browsers without
IntersectionObserver also retain manual playback. The existing local artwork
and error/Retry behavior remain available offline or on playback failure.
No video is added to the native package or service-worker cache.

`check-story-viewport.mjs` covers the observer state machine using fixtures.
`check-story-viewport-browser.mjs` covers real browser scrolling and intersection
changes with explicit media/API doubles, plus bounded actual MP4 decoding and
changing-frame checks. Existing reduced-motion YouTube/MP4 browser suites retain
manual-play regressions. Browser viewport tests are not installed iPhone/iPad
verification. Build 349 is unchanged; this feature is not a published release.

### Viewport feature verification on OmniBook (2026-11-05)

The feature worktree started from GitHub main `84e5a1f1`. Freshly fetched Sites
source `e41f5b06` matched main's src, worker, data, scripts, package files and
hosting configuration. The divergent mirror, original Windows checkout and
existing stash were preserved. No Site source was pushed or deployed.

The final shared web/mobile build passed with source fingerprint
`ad51140f8b395da660109e743180fda199b5b96e171f5a8a48a0c03598aac177`.
All 69 unique checks from check, check:mobile, check:release, check:sync,
check:videos and check:ui passed after setup corrections: exact-hash audit
inputs needed their unchanged Git LF bytes, and two UI runners needed an
explicit local preview URL. Syntax and whitespace checks passed.

All 32 deterministic viewport browser scenarios passed in Chromium and WebKit
at 390 x 844 and 820 x 1180. This covers real scrolling/IntersectionObserver,
with clearly labeled media/API doubles, including adjacent reuse, YouTube cue
promotion, once-per-viewing, exclusive playback, keyboard controls, preferences,
offline/tab restoration, unseen stories and unmount cleanup. An initial
YouTube fixture failure was caused by enforcing the app policy on the separate
player page; the runner now preserves that page's dedicated enforced policy.

Actual Chromium MP4 muted autoplay, changing frames and navigation passed.
A separate real Chromium Creation check received YouTube playing and advancing
time events without a Play gesture, verified the muted request and Show image
teardown. Existing manual YouTube checks passed all 20 engine/viewport cases.
The existing real MP4 suite passed 71 of 72 cases; Windows WebKit's iPad-sized
Fall of Man reconnect/resume check failed its time >= 7 assertion. Other clips
and the phone-sized Fall case passed that flow.

Windows WebKit's new real-autoplay case remains incomplete: some attempts
closed before the card became visible; an isolated attempt decoded advancing,
changing frames but closed on navigation to the reader. The deterministic
WebKit lifecycle results do not resolve this native media-engine behavior.
Keep these failures visible and finish real Safari/connected-device QA before
release. No physical iPhone/iPad, signed assets or installed apps were tested.

Detailed reports remain in ignored outputs: viewport-regressions,
story-viewport-final, story-viewport-webkit-isolated, r2-video-browser,
creation-video-browser and live-youtube-viewport.json. No publication or
native installation is claimed.

A bounded WebKit iPad follow-up kept the stage fully visible throughout and
observed the app explicitly restore 7.224 seconds. WebKit then briefly reported
0.01 seconds at its native seeked/timeupdate events, before recovering to
7.344 and advancing to 8.079 without another JavaScript seek. This points to
transient native seek timing rather than the observer clearing the saved time.
The original failed immediate assertion remains in the report; the follow-up
is not substituted for a complete suite pass. See outputs/probe-webkit-resume.json.

## Noah and shared build 350 candidate (2026-11-05)

Kevin approved integrating the supplied Noah footage with the viewport update,
then testing, merging and publishing both. The exact manifest key is
`Noah and the Flood`, Genesis 6:9–9:17. Its approved public R2 URL is
https://pub-9f1a7f52c7d046daba4df355a08ed8cd.r2.dev/BibleLens-Noah-and-the-Flood.mp4.

A normal range GET returned 206 with bytes 0–1023/5964451, and a normal full
GET returned 200. A separate earlier HEAD failure did not prevent the media
GET. No access controls were bypassed. The file is 5,964,451 bytes, 17.5 seconds,
1280 x 720 H.264 at 24 fps with AAC audio. Full FFmpeg decoding passed. SHA-256:
`3a34bf97ba5db7da6af30de5997b855499cf689c9faf8f3a0de005fbd114ff56`.

Sampled actual frames show an older man welcoming two adults into the ark,
animals outside, the ark on floodwater and the man before a grounded ark with
a rainbow. The accessible description follows those visible scenes. The
poster is the actual frame at 16 seconds, inspected at full size and compressed
to `src/assets/story-video-noah-and-the-flood-poster-v1.webp`, 1280 x 720,
52,980 bytes, WebP quality 77. SHA-256:
`3ad4e73948b9243153689f70a5396741fec4a700407bddee1dcb420ffaa265c3`.
The existing `story-noah-and-the-flood-v2.webp` remains the offline/error
fallback. The approved footage is not bundled, cached or re-uploaded.

The earlier WebKit failures above were investigated rather than discarded.
The reconnect check now waits for a settled, non-seeking time of at least
7 seconds that advances for 300 ms, bounded to 3 seconds after metadata
(15 seconds overall loading). A self-check rejects a restart from zero.
Windows WebKit also reproduced its renderer crash on unchanged main during
the existing app View Transition. Omitting only Playwright’s default
`--disable-accelerated-compositing` launch argument on Windows allowed actual
muted playback, changing frames and normal navigation without disabling
any production feature or CSP. The runner records this port-specific setup,
crash events and checkpoints; no application workaround or user-agent
exception was added. Viewport emulation does not verify Safari on physical
iPhone/iPad or installation of native binaries.

### Final build 350 verification (2026-11-06)

The required release:prepare run passed, including the shared web/mobile
build and 65 unique release, reader, sync and mobile checks. Seven additional
security/UI/artwork checks passed, for 72 unique checks in total. Both bundles
and the staged Sites source match fingerprint
`48a0362f526e8f42833eb97d49f07b0d1cbab638e44a162c98986ec459f5ce52`.

All 34 viewport browser checks passed: 32 real-scrolling lifecycle fixtures
and actual muted MP4 decoding, changing frames and navigation in Chromium
and Windows WebKit. All 96 real R2 checks passed across the four ready clips,
two engines and phone/iPad-sized viewports, including Noah playback, seek,
end/restart, warm offline fallback, settled reconnect/resume, failure/Retry
and navigation. All 20 real YouTube manual-play checks passed. A separate
Chromium check received actual YouTube playing/advancing time events without
a Play gesture and verified muted autoplay and Show image teardown.

Reports are retained in ignored outputs: release-350-prepare.log,
release-350-regressions, story-viewport-build350, r2-video-browser,
creation-video-browser and live-youtube-viewport-build350.json. Earlier
browser reports remain under their build349 names and probe files.
Physical iPhone/iPad Safari, signed native asset parity and installed binaries
were not tested. Shared offline assets are prepared; web publication alone
does not update installed native apps.

## Revised Creation and Fall footage (build 352 candidate, 2026-11-06)

Kevin authorized replacing the two videos and publishing the verified release.
The revised Creation is 13.25 seconds (5,833,067 bytes); Fall is 12.75 seconds
(3,670,353 bytes). Both are H.264, 1280 x 720 at 24 fps, with AAC audio and no
burned-in captions or visible watermark. Creation now uses the same approved
R2 origin as the other clips. Versioned object names preserve prior footage:
`BibleLens-The-Creation-v3.mp4` and `BibleLens-The-Fall-of-Man-v3.mp4`.
Upload, public-file verification and release results must be recorded below
before this candidate is called published.

Creation retains approved prior motion scenes in a shorter edit, replacing
the clothed pre-Fall human shot with a new face portrait. Fall opens with a
1.5-second hold of its corrected temptation still, then shows Eve eating,
passing fig-like fruit to Adam, Adam eating, concerned eyes, and departure
in skin garments. Framing and foliage conceal bodies before eating. Genesis
does not name the fruit species; its fig-like form is an artistic choice.
The short retellings omit some events. Audio fully decodes but was not
listening-reviewed; this does not certify audible quality or a transcript.

New local posters are actual frames: Creation at 5.5 seconds, land and plants;
Fall at 0.75 seconds, temptation with concealed bodies. Both are 1280 x 720
WebP, quality 72, below 100 KB, inspected at full size. Their names are
`story-video-creation-poster-v2.webp` and
`story-video-fall-of-man-poster-v2.webp`. Existing reader/Story illustrations,
offline/error fallback images, other videos, viewport autoplay, adjacent
preloading and reduced-motion/data behavior are unchanged. No MP4 is bundled.

The catalog now has no active YouTube videos. The live YouTube runner reports
NOT APPLICABLE, while the existing protocol/lifecycle fixtures remain. The
viewport browser fixture supplies its explicit YouTube API-double ID only
inside the isolated fixture server; production bridge IDs still come solely
from the active catalog. MP4 decoding checks include the revised Creation.

Source video SHA-256 values:
- Creation: `5440db95566c1c69dc688a521ae206301619a86f168bd07789077160019a0b55`.
- Fall: `d89ee03703c73e411c15924d0f134b00aa2950ddc3c84c09f08f78327b6f3f99`.

### Candidate verification and current blockers

Canonical baseline `f57082275eb3c529bffb5e05e76b8477ee090ac8` and freshly opened
Sites mirror `27664c064e3c92eaeff97c24cd4ee2d98ff7bcc3` match for app source,
package files and hosting configuration. This work uses a new isolated checkout;
no existing user checkout or stash was changed.

The shared web/mobile build passed. All 67 non-browser checks expanded from
`check`, `check:sync`, `check:release`, `check:mobile`, `check:images` and
`check:videos` passed, with zero failures. `check-release-smoke.mjs` was
explicitly NOT RUN: managed Linux requires the supplied browser tools. This
is not a full `release:prepare` pass. The managed preview command stopped
because this Worker project has neither a dev script nor static.directory;
no alternate server/browser was launched or security setting changed.

Both bundles identify build 352, fingerprint
`5a6f8ba5730c77a3ec0e37355bfe90d5b3cc5425b85baf6c5ff947398e2d0de7`.
Player/autoplay source and `data/story-images.json` match the original baseline.
Detailed check results are in ignored `outputs/genesis-video-checks/`.

R2 upload is pending Google device verification for the authorized Cloudflare
account; neither versioned video object has been uploaded by this session.
Accordingly, the revised remote URLs and real playback remain unverified.
A normal proxy-respecting GET of the live `/release.json` returned HTTP 403;
user history was checked, and no retry or alternate path was used. This was
an HTTP access failure, not an automatic approval-review rejection.

No main merge, GitHub main push, Sites publication, or native installation has
been performed for this candidate. No authorized Mac/device execution surface
is available in this session. Device build numbers, launches, signed-asset
parity, and physical-device playback therefore remain unverified.

### Reviewed build 352 preparation on OmniBook (2026-11-06)

Kevin supplied the public v3 locations and confirmed both videos played.
This release integrates the reviewed Creation/Fall commit `5839a104` only;
the later five-video batch is separate. The R2 403/error 1010 denial was not
retried or bypassed. Remote decoding and audible quality are not claimed here.

Fresh GitHub main `f5708227` and Sites source `27664c06` matched for release
source. The older local Sites history is retained on
`preserved/sites-local-2026-11-06`; existing worktrees and stash are preserved.
Final `npm run release:prepare` passed. With `check:images`, all 68 unique check
scripts passed, including local Chromium/WebKit search smoke probes. All 32
phone/iPad viewport browser fixtures passed. Their two remote-decoding cases
were explicitly NOT RUN with `--fixture-only`. Readability remains report-only.

An earlier sync-disconnect scheduling assertion passed in isolation and in the
final complete preparation. Windows needed unchanged Git LF template/audit
bytes. Repreparing existing `www` exposed the Unix-only replacement API in
`swap-mobile.py`; the previous output was preserved under
`outputs/before-final-352-www`, and final preparation into a fresh output passed.
No production source changed. Logs retain the earlier timing/platform failures.
Both bundles are 1.1.0 build 352, source fingerprint
`5a6f8ba5730c77a3ec0e37355bfe90d5b3cc5425b85baf6c5ff947398e2d0de7`.
Evidence: ignored `outputs/release-352-prepare.log`, `release-352-images.log`
and `story-viewport-browser/results.json`. Publication results follow separately.

Native work is in Mac session `01a1b070-aba7-7f00-936e-f37ad071d76f`, waiting
for local execution approval after CoreDeviceService initialization timed out.
No exact device inventory, installed build, successful launch or signed-native
asset parity has been verified. SSH authentication failed and was not retried.
The earlier denied live `/release.json` was not retried; full live
`release:verify` remains unperformed. Prepared local assets and a successful
Sites deployment do not establish a synchronized installed release.

### Build 352 publication checkpoint (2026-11-06)

Canonical commit `1db27aa4be752fef3bb105fb21c771a75074b23c` was pushed to
GitHub main. The supported Sites helper pushed source
`f2e55819fadbe6ccc9eb3813759d929b39eb5536` and packaged the already-built
Worker. Sites saved version 341 and confirmed successful deployment
`appgdep_6aedb2b52634819194c4dfa8726ac9c5` at
https://scripture-lens.kvn-mcgwn.chatgpt.site. Sites version 341 is app build 352.
Local Worker `/release.json`, web assets, mobile assets and mirror source all
match fingerprint `5a6f8ba5730c77a3ec0e37355bfe90d5b3cc5425b85baf6c5ff947398e2d0de7`.
No denied remote URL was fetched for this comparison. Full live verification
and native installation remain pending as described above.

Kevin has now verified all five follow-up clips: The Family of Noah, The Tower
of Babel, The Call of Abram, Abram and Lot, and Hagar and Ishmael. They are not
in this release. Preparing the first two Library files failed before final
installation because the supported transfer helper requires `os.setxattr`,
which Windows Python lacks. No file without its required Library metadata was
used. A cloud-side transfer/upload or Kevin's R2 upload and public URLs are
needed before integrating the next batch; its app release should use a new
build number. No R2 upload or availability claim is made for those five clips.

## Fifteen-video build 353 preparation (2026-11-06)

The separate `feature/genesis-video-batch15-2026-11-06` branch stages the next
15 Genesis stories, from The Family of Noah through The Death of Rachel.
All 15 exact existing Story keys have pending MP4 records; the five currently
ready videos remain intact. Build 353 is a candidate, not a published release.
No R2 URL, video-derived poster, footage description or playback result is
invented. Pending records are excluded from both clients by `storyVideos()`.
Reader artwork and offline/error fallbacks are retained.

Kevin verified the first five and subsequently authorized pushing, publishing
and installing the next ten. That authorization does not establish that he
listened to or playback-verified those ten separately. The short clips are
partial retellings; descriptions must state the scenes actually shown.

Before activating a record, obtain the upload worker's exact public R2 URL,
an actual-frame versioned WebP poster with its timestamp, and alt text and a
description grounded in that footage. Retain file size, duration and SHA-256
upload evidence. The existing origin allowlist and no bundled MP4 rule remain.
Do not retry the previously denied R2 verification requests or switch routes
without materially new relevant evidence. Windows Library transfer remains
blocked by unavailable `os.setxattr`; no metadata-free file was used.

The latest visible user direction at 11:11 UTC defers his upload help and asks
not to be interrupted while the next ten are made. This preparation does not
request another sign-in or assume the separate upload worker succeeded.
The Mac build-352 task still reports waitingOnApproval after CoreDeviceService
timed out. Exact available devices, signing, installed versions and launches
remain unverified; build-353 installation has not started.

Preparation checks passed: `check-story-videos.mjs`, `check-story-mp4.mjs`,
`check-story-viewport.mjs` and `git diff --check`. Readability completed in its
existing report-only mode. No build-353 bundle, real-media browser check,
publication or native installation is claimed by this preparation checkpoint.

## Uploaded-video release 355 (2026-11-06)

Kevin explicitly requested the site/app update, publication and installation
after the R2 upload. The candidate preserves canonical build 354 (`cb5a070c`),
including the Explore artwork fix and newer Story controls/preloading.
The signed-in R2 completed object list was inspected on both pages. It contains
all thirteen Extended replacements and eight other new clips. The upload-panel
34/38 counter is not used as proof. File names and displayed rounded sizes match
the supplied local files. No media URL was guessed from an unfinished upload.

All 21 corresponding local MP4s fully decoded without errors. Five actual
frames from each were compared beside the existing Story reference. Nineteen
were selected for activation with versioned 1280x720 WebP posters below 100 KB,
plain descriptions of the scenes actually shown, and retained offline artwork.
No MP4 is packaged. Public file hashes, sizes, durations, poster timestamps,
reference paths and review holds are in `docs/story-video-batch-355.json`.
Contact sheets and the detailed local decode audit remain in ignored
`outputs/uploaded-video-355`. Audio was not listening-reviewed; sparse frame
sampling is not a full motion/anatomy or physical-device playback certification.

Two videos are held under AGENTS.md's instruction, "Do not publish an unresolved
continuity break." Joseph and His Brothers changes the young Joseph's facial
structure and natural hair texture from the approved reference. Jacob Blesses
His Family changes the elderly, white-bearded Jacob into a substantially younger
grey-bearded man. Their revised clips are uploaded but remain pending repair.
The Family of Noah, The Tower of Babel and Abram and Lot are not in the completed
R2 object list and also remain pending. The previously rejected Birth and Rescue
of Moses has no new footage to activate. The release has 24 active clips total,
including the five already published. No additional content approval is pending.

The old device blocker has been superseded: the Mac session successfully signed
and installed build 354 on Kevin's iPhone 16 Pro and iPad mini (A17 Pro).
The next installation must be built from this release's exact source and checked
again; the earlier device installation is not evidence that build 355 is installed.

### Build 355 publication and verification checkpoint

GitHub main now includes `16c2bfea5e2af496ef1143f0111d957542c70c1b`.
The complete release preparation and image checks passed (68 unique scripts).
All 32 Mac Chromium/WebKit viewport lifecycle fixtures passed. Nineteen new
clips passed normal remote playback, control reveal, pause and seek in Chromium
at phone and iPad sizes (38 cases), and in Mac WebKit phone size (19 cases).
Mac WebKit 27.2 returned 206 media responses with no CSP violations. Jacob's
Household loaded there in 2.59 seconds; the other clips loaded in 1.86-2.59 seconds.

Windows WebKit passed six phone clips but timed out on Jacob's Household at
20 seconds; later cases were not run. That failure is retained, not counted as
a pass or replaced by the Mac result. Earlier smoke-harness assertions were
corrected for the existing hidden-controls behavior, poster-readiness races
and the Windows port's scaled intrinsic video dimensions; no app code changed.
Reports remain in `outputs/uploaded-video-355` and on the Mac under
`/Users/kevin/git/BibleLens-355-native/.release/355-mac-webkit-live`.

Sites source `ffd83f5aada31104b4ffc316f1c79e4dc562fcd7` produced saved version
344, published successfully as deployment `appgdep_6aee056cae9c8191ab78903f90bce973`
at https://scripture-lens.kvn-mcgwn.chatgpt.site. The actual built Worker was
packaged without static bypass paths. Normal `release:verify` then passed:
live website, canonical source, Sites mirror and mobile assets all match
build 355 and fingerprint
`c2e71980892615a6db1a76363bb085a756ddb38a6cb31dfb6290dd408248f28e`.
The later explicit request to try R2, newly uploaded objects and successful
normal 206 responses provided new evidence for the new-media checks; none of
the five older media URLs were fetched for this verification.

The Mac signed app passed strict codesign verification. Its 1530 packaged public
files match its prepared `www` byte-for-byte, allowing only the two confirmed
empty Cordova files generated by Capacitor. No MP4 is bundled. Device inventory
and installed-app queries confirmed version 1.1.0/build 355 on both devices:
Kevin's iPhone 16 Pro (`97707562-C3A3-5A57-9F88-C607D1E81C92`) and iPad mini
(A17 Pro) (`F6C4425C-EBDA-5E00-86B9-05DAF442F07C`). The iPhone launched normally
with PID 57931. The iPad's ordinary launch was denied because it was locked
(`FBSOpenApplicationErrorDomain`, error 7); its installation and build number
are verified, but launch remains pending until Kevin unlocks it. The lock was
not bypassed. Physical-device video playback, audio quality, fullscreen and
cold offline operation are not certified by browser emulation or a launch.

## Three remaining uploads: build 356 (2026-11-06)

Kevin confirmed the three remaining uploads. The R2 dashboard completed list
now contains `BibleLens-The-Family-of-Noah.mp4` (5.55 MB),
`BibleLens-The-Tower-of-Babel.mp4` (4.43 MB), and `BibleLens-Abram-and-Lot.mp4`
(6.21 MB). The supplied local ZIP contains exactly those three MP4s and its
SHA256SUMS file; all checksums and full-file FFmpeg decoding passed.

Five actual frames per clip were compared beside the existing Story artwork.
No new identity break was observed in those sampled scenes. Versioned actual-frame
1280x720 WebP posters are each below 65 KB. The descriptions follow the visible
scenes rather than claiming a complete retelling. Source-file hashes, sizes,
durations, poster timestamps and poster hashes are in `docs/story-video-batch-356.json`.
Detailed local audits and contact sheets remain under `outputs/uploaded-video-356`.
Audio is not listening-reviewed; sampled frames do not certify every motion frame.

The shared manifest now has 27 ready videos. Joseph and His Brothers and Jacob
Blesses His Family remain pending their separate continuity repairs, without
blocking these three uploads. Reader artwork, offline fallbacks and video
runtime code are retained. No MP4 is bundled. Build 356 preserves the complete
canonical build-355 source and uses one shared source state for web and native.

The Windows build completed its web artifact but its mobile handoff failed with
`WinError 5` on the generated-directory rename. That denied operation was not
retried or replaced with another move tool. The already-authorized Mac native
build is the shared release environment for this batch. Its first Worker was
117,117 bytes above the existing 63 MiB publication limit, so three simpler
actual frames were selected and inspected after compression. Their combined
poster payload is 46,624 bytes; dimensions remain 1280x720. No video, reader
artwork, security policy or publication budget was changed. Poster metadata and
alt text follow the newly selected timestamps. The first candidate's playback
checks are retained as earlier evidence, not claimed for the final source hash.

### Build 356 publication and device checkpoint

The final shared Mac release preparation, signing and image checks passed.
Its Worker is 66,027,880 bytes, below the unchanged 66,060,288-byte limit.
The three final poster hashes match the audit and packaged native files.
All three final-source clips passed Mac WebKit playback, control reveal, pause
and seek. Reports are under
`/Users/kevin/git/BibleLens-356-final/.release/356-final-webkit`.

Canonical source `fee1d6285ee9eb6b1cf65bc41f304d850797f427` was pushed to main.
Sites version 345 published successfully as deployment
`appgdep_6aee2116aa3481918e5c4b268fb8cb8b` at
https://scripture-lens.kvn-mcgwn.chatgpt.site. Unmodified `release:verify`
confirmed the live site, canonical source, Sites mirror and mobile assets all
match build 356 and fingerprint
`b66fca522aeb38e020d97faa3596d2f8898b933948ccd432cd9f9b6415789281`.
The signed app passed strict signature verification. All 1,533 `www` files
match the signed public assets byte-for-byte, excepting only the two confirmed
empty Cordova files added by Capacitor. No MP4 is bundled.

Installed-app queries verified 1.1.0/build 356 on Kevin's iPhone 16 Pro
(`97707562-C3A3-5A57-9F88-C607D1E81C92`) and iPad mini (A17 Pro)
(`F6C4425C-EBDA-5E00-86B9-05DAF442F07C`). The iPhone launched successfully,
PID 58789. iOS denied the iPad's launch because it was locked
(`FBSOpenApplicationErrorDomain`, error 7); no lock bypass or repeat launch
was attempted. Unlocking the iPad and opening BibleLens completes that check.
Physical-device video playback, audible quality and cold offline operation
remain outside this verification. The two continuity repairs remain pending.

The old unpublished Windows Site snapshot is retained in its named stash,
`Preserve unpublished initial build 356 snapshot before shared Mac budget fix`.
Existing user checkouts, changes and stashes were preserved.

## Continuity repairs: build 357 (2026-11-06)

Kevin confirmed the completed R2 uploads of the repaired Joseph and His
Brothers and Jacob Blesses His Family continuity-v3 clips. Their local source
files independently match the supplied byte lengths and SHA-256 hashes, and
both decode fully without FFmpeg errors. Source metadata and versioned poster
hashes are recorded in `docs/story-video-batch-357.json`.

Five frames per clip were compared beside the approved Story artwork. Joseph
was also inspected at 2, 8, 10, 14, 16 and 20 seconds. His youthful face, curly
hair, complexion and build remain recognizable across the sampled scenes.
Jacob's six-second portrait keeps the elderly face, white beard and striped
hood; his hands and sons remain outside the frame. No unresolved identity
break was observed in these samples. Audio was not listening-reviewed and
sampled frames do not certify every motion frame. Review sheets remain local
under `outputs/uploaded-video-357`.

The manifest now contains 29 ready clips and no pending continuity holds.
Descriptions follow the visible scenes: Jacob's portrait does not claim to
show sons or a blessing gesture. Two actual-frame 1280x720 WebP posters total
20,838 bytes and were inspected after compression to fit the existing Worker
budget. Existing reader artwork and offline fallback behavior are retained;
no MP4 is bundled. The Mac remains the shared build and release environment.

### Build 357 publication and device checkpoint

Full Mac `release:prepare -- --ios`, image checks and strict signature
verification passed. Both repaired clips passed Mac WebKit playback, advancing
time, decoded dimensions, control reveal, pause and seek. Reports remain at
`/Users/kevin/git/BibleLens-357-final/.release/357-final-webkit/results.json`.
All 1,535 `www` files match the signed app's public assets byte-for-byte; its
only extra files are the two confirmed empty generated Cordova scripts.
No MP4 is bundled. The Worker is 66,054,848 bytes, 5,440 bytes below the
unchanged 66,060,288-byte publication limit.

Canonical source `b1ecf5f790baf0b617289ae852f05ef721db4eed` was pushed to main.
Sites source `668e9a2f8348422a478916632347b06a21540671` published as version 346,
deployment `appgdep_6aee3855e5988191ae29a5e8cbae97c8`, preserving public access.
Unmodified `release:verify` confirmed the live website, canonical source,
Sites mirror and mobile assets all identify build 357 and source fingerprint
`91b8cfb0c3b45f5712f9fa19b1497b8521131fb133d67e642d7b5511c6b29a92`.

Installed-app queries confirmed BibleLens 1.1.0/build 357 on Kevin's iPhone
16 Pro (`97707562-C3A3-5A57-9F88-C607D1E81C92`) and iPad mini (A17 Pro)
(`F6C4425C-EBDA-5E00-86B9-05DAF442F07C`). The iPhone launched and a process
query confirmed PID 59334. iOS denied the iPad's ordinary launch because the
device was locked (`FBSOpenApplicationErrorDomain`, error 7); installation is
verified, but launch needs Kevin to unlock it and open BibleLens. No lock
bypass or repeat launch was attempted. Physical-device video playback,
audible quality, fullscreen and cold offline operation remain unverified.

## Ten Exodus videos: build 410 (2026-11-11)

The final ten Story videos run from Moses and Aaron Before Pharaoh through
The Covenant Is Sealed at Sinai. Each exact public object was downloaded on
the Mac, matched its reviewed byte length and SHA-256, and fully decoded.
The existing 29 ready records remain unchanged; these additions bring the
ready total to 39. Media activation uses the existing approved public origin.

The ten films total 60,777,662 bytes and last 7.25–12.75 seconds. Their ten
active 1280×720 WebP posters total 667,290 bytes, each below 100 KB. The
versioned Water/Amalek poster is an actual frame of the corrected support
scene. Earlier assets remain preserved. Metadata, hashes, selected timestamps,
descriptions and review limits are in `docs/story-video-batch-410.json`.
No MP4 bytes enter the repository, Worker or native bundle. Reader artwork,
previews, summaries, evidence records and offline fallback art are unchanged.

The original Water/Amalek support shot was held because the implied Aaron
looked different from his approved portrayal. Its replacement retains the
passed water scene and shows a grey-haired Aaron with the approved shorter
white beard, distinct from seated Moses and his longer beard. Independent
full-size comparisons at 6.0, 8.0 and 9.5 seconds support the correction.
Both wrists/forearms are supported from opposite sides; arms are held outward
at chest height and the battle remains offscreen.

Early paused seeking stalled or retained old frames in six original encodes
under WebKit, including in plain video without the app lifecycle code. Six
conservative H.264 Main 3.1 versions use one-second keyframes and no B frames.
All original frame timestamps/counts, dimensions, rate, exact duration and
AAC packets/timing are preserved. Video recompression is lossy: measured SSIM
was at least 0.990464 and PSNR at least 44.37 dB. The six new encodes passed all
18 repeated local paused-seek checks. This identifies an encoding/runtime
compatibility issue, not GOP length alone. Four unaffected files are unchanged.

Kevin authorized uploading the six correct files to the bucket root. The
single batch completed successfully, preserving old objects. Public verification
then passed for all ten final URLs, including the repaired Water/Amalek film.
The targeted `npm run check:videos:exodus` runner uses those actual public URLs,
the production handler and enforced application CSP. It tests both engines at
phone and iPad sizes, native controls, changed paused frames, ending/restart,
offline fallback/reconnect/resume, failed-source Retry and navigation cleanup.
Final release gates apply to one immutable combined web/native source state.

These are selective wordless scenes, not complete retellings. Reviews used
sampled source frames and final montages, not every motion frame. Audio fully
decodes but was not listening-reviewed. Browser viewport tests do not claim
physical-device playback verification.

## Disclosure playback controls (2026-11-11, unreleased)

Opening a Stories card with its down chevron now starts its video inline and
muted when the video is visible (or as it scrolls into view), including when viewport autoplay is disabled by motion/data preferences:
opening the disclosure is an explicit request. The video loops while active.
Small corner controls provide Play/Pause and Mute/Unmute with accessible labels
and 44px touch targets. Manual pause is respected; closing the disclosure stops
its media without stopping unrelated cards. Leaving the viewport or Stories,
hiding the app, and connection failure retain the existing teardown/image
fallback behavior. This supersedes the earlier play-once policy for Stories.

The MP4 tests exercise expansion, collapse, looping, pause/resume and mute state.
YouTube retains its native controls and trusted-source command validation.
Real browser/device playback must still be verified before release; deterministic
fixtures do not prove media decoding or physical iOS behavior.

## Six Exodus and Leviticus videos (2026-11-13 integration)

The Golden Calf, Moses Sees God's Glory, Building the Tabernacle, Aaron and His
Sons Are Ordained, Nadab and Abihu, and The Blasphemer Stoned now have ready MP4
records. The existing 39 records remain unchanged, making 45 ready videos in
this integration. Each new public R2 object downloaded successfully on the
OmniBook and decoded fully without errors. Durations are approximately eight
seconds. `docs/story-video-batch-2026-11-13-six.json` records the exact object
names, byte lengths, SHA-256 hashes, passages, reference artwork and poster times.

Each idle poster is an actual frame from its video, stored as a versioned
1280x720 WebP below 100 KB. Five frames per clip were inspected and selected
frames were compared at full size with the approved Story artwork. Descriptions
follow the visible scenes. Nadab and Abihu's deaths remain offscreen; the
Blasphemer clip depicts a hearing and custody, not the stoning. These selective
illustrations do not claim to retell every event in the passages.

Story references, Reader images, summaries, player code and offline fallbacks
are unchanged. MP4 files remain remote and are not bundled. The web and native
outputs use the shared manifest and posters. Audio decoded technically but was
not listening-reviewed, and the samples do not certify every motion frame.
Kevin authorized continuing when public playback alone cannot be verified.
This isolated integration does not itself publish or install a release; the
release owner combines it with the pending annotation and subsequent video work.

## Second ten-video batch (2026-11-13)

Ten selective illustrations from Victories over Sihon and Og through Moses Recalls the Second Tablets were generated using actual approved Story images as Flow ingredients. They retain the existing player and offline fallback art. Final videos last about five to eight seconds, following the useful action rather than a fixed target. The first well scene was rejected for a leaking jar and identity drift; its face-free replacement depicts the well and landscape. Earlier originals remain local.

All ten final encodes fully decode, use conservative H.264 Main 3.1 with one-second keyframes and no B frames, and have zero-based re-encoded AAC timelines. Versioned posters are actual reviewed frames below 100 KB. Full-size samples and 1fps contact sheets were compared with the supplied references. Audio was technically decoded but not listening-reviewed; sampled review does not certify every motion frame. The audit records each selective scene and what it omits. Public streaming verification, if unavailable, is nonblocking by the owner's explicit instruction. Native signing and device installation require the separate Mac handoff.

## Third ten-video batch (2026-11-13)

Ten selective illustrations from Deuteronomy 31 through Joshua 10 use actual approved Story images as Flow ingredients. The two Joshua commissions retain distinct passage associations. Moses and Joshua remain separate identities. Story-led trims remove unnecessary holds. Versioned actual-frame posters are below 100 KB. Reader images, summaries, offline fallback art and all 65 previous ready videos are unchanged. No MP4 is bundled.

Full local decoding and sampled full-size reference comparisons passed. Audio was technically decoded but not listening-reviewed; sampled inspection does not certify every motion frame. Public playback is tested where available, but inability to verify it alone is nonblocking by the owner’s explicit instruction. Native signing and installation are handed to the separate Mac session.

The Jordan take was replaced after the passage check: priests now remain stationary as families cross (Joshua 3:17). Earlier takes remain inactive and preserved. The correction adds 12 credits, for 132 total and an observed ending balance of 2,292 AI credits.

## Fourth ten-video batch (2026-11-13)

Ten selective illustrations from Joshua 11 through Judges 9 use actual approved Story artwork as Flow ingredients. Joshua ages plausibly at Shechem; Caleb and Phinehas remain distinct. Anonymous families and messengers stay anonymous. The Abimelech story depicts Jotham. The first Gideon take was rejected for switching hands; its replacement keeps the torch in his left hand and horn in his right. Prior originals and all 75 ready videos are preserved.

Final clips run five to seven seconds, trimmed to useful action. Actual-frame posters are below 100 KB. Local full-file decoding and sampled full-size comparisons passed. Audio was technically decoded but not listening-reviewed; samples do not certify every motion frame. Public playback is tested where available, but its absence alone is nonblocking under the owner’s instruction. No MP4 is bundled; shared source preserves all Reader artwork, summaries and offline fallbacks. Signing and installation are handed to a separate Mac session.

## Fifth ten-video batch (2026-11-13)

Ten selective wordless illustrations from Jephthah through Samuel’s call use the actual approved Story images as Flow ingredients. Corrected Samson gate geometry is retained. The two Levites remain separate people. Ruth, Naomi and Boaz remain recognizable across four scenes; Hannah, young Samuel and Eli follow their accepted portraits. Jephthah and Gibeah use non-graphic arrival scenes, without depicting harm. Descriptions identify each selected moment rather than claiming full narrative coverage.

Final clips run five to seven seconds, trimmed to useful action. Actual-frame posters are below 100 KB. Original and compatibility files fully decoded, and full-size samples and 1fps sheets were compared with actual inputs. Audio was technically decoded but not listening-reviewed, and samples do not certify every motion frame. Exports resumed through Flow’s normal full viewer after refreshing the project; no generation was repeated. All 85 prior ready videos and Reader/offline fallbacks are preserved. MP4s remain remote. Signing and installation are handed to the separate Mac workflow.

## Sixth ten-video batch (2026-11-13)

Ten selective wordless illustrations from the ark return through David becoming king use actual approved Story images as Flow ingredients. Elder Samuel remains recognizable across four clips. Saul retains his corrected hood without a circlet at Endor. Youthful clean-shaven David is distinct from Jonathan and ages plausibly into the bearded adult David with Abigail and at Hebron. The first David-and-Goliath request was rejected by Flow and produced no video; the accepted alternative depicts adult Goliath waiting, with no young David or combat. Its scope is explicit in the description.

The final clips run five to seven seconds, trimmed to useful action. Original and final files fully decode; 1fps sheets and full-size samples were compared with actual inputs for identities, hands, limbs, props and text-compatible actions. Audio was technically decoded but not listening-reviewed, and sampled inspection does not certify every motion frame. Posters are reviewed actual frames below 100 KB. All 95 prior ready records, summaries, Reader artwork and offline fallback art are preserved. MP4s remain remote. Public playback is tested when available but its absence alone is nonblocking under the owner’s explicit instruction. Native signing and installation remain in the separate Mac workflow.

## Seventh ten-video batch (2026-11-13)

Ten selective wordless illustrations from Jerusalem and the Ark through Solomon Becomes King use actual approved Story images as Flow ingredients. Adult David and Nathan remain recognizable between the covenant and confrontation. David ages plausibly in the flight scene; all companions retain covered heads and David remains barefoot. Tamar and Absalom use active v2 without a circlet, and the scene depicts shelter, not assault. Joab remains distinct from David; Araunah and the wise woman retain their own approved faces. Solomon, Zadok, Nathan and Bathsheba retain their approved anointing portrayals. Appendix ages are not assigned an unsupported chronology. Descriptions identify the selected moments, without claiming full retellings.

Final clips last five or six seconds, trimmed to useful action rather than a fixed duration. Original and final files fully decode; full-size samples and 1fps sheets were compared with the actual inputs for identity, anatomy, animals, props and text-compatible actions. Audio was technically decoded but not listening-reviewed; sampled inspection does not certify every motion frame. Actual-frame posters are below 100 KB. All 105 previous ready records, Reader artwork, full/preview summaries and offline fallback art are preserved. No MP4 is bundled. Public playback is tested when available, but its absence alone is nonblocking under the owner’s explicit instruction. Native signing and installation remain in the separate Mac workflow.
