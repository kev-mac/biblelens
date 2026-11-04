# Stories video integration

The Creation pilot is approved, but **is not active or published** in this checkout.
`data/story-videos.json` contains verified YouTube ID `BDNJ8-wtaeA` and keeps it
pending until a reviewed frame poster and its text description are available. Pending entries
render the existing Story image without a disabled player or remote requests.

Kevin chose YouTube and approved an unlisted Creation upload. The parent verified
the upload on KVN MCGWN with embedding enabled:
https://www.youtube.com/watch?v=BDNJ8-wtaeA. No YouTube upload, publication,
visibility change, R2 provisioning, account change or persistent credential was
performed by this implementation. There is no R2 binding in the current manifest;
YouTube removes the need to introduce one for this pilot.

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

## Activate the pilot

1. The parent confirmed the unlisted upload ID `BDNJ8-wtaeA` with embedding
   enabled. Verify actual playback in an official embed when browser access is available.
2. Use the verified upload's thumbnail or actual video through supported normal
   access, or materialize Library file `libfile_2ca1b9220b2c81919acbd60a7943453f` in the
   consuming executor using the current Library skill. Verify readable local
   bytes, inspect actual frames, select a relevant one and save a compressed WebP at
   `src/assets/story-video-creation-poster-v1.webp`. Record the source URL or selected
   timestamp, source checksum, dimensions and review result here. Never bypass an
   access denial or invent a timestamp for a platform-selected thumbnail. Do not use a generated
   lookalike or the existing image as a claimed video frame.
3. Fill `videoId`, `poster`, `posterAlt` and a faithful accessible `description`;
   then set `status` to `ready`. The build validates the active record and includes
   that poster in both web and native assets.
4. Run `npm run check:videos`, shared builds and checks, then browser QA on phone
   and iPad sizes with the real video: online, offline, blocked load, interruption,
   resume, retry, controls, captions, fullscreen, poster, navigation and focus.
   Test the HTTPS bridge on physical iPhone/iPad; a simulated player cannot verify
   native YouTube playback or referrer acceptance. Follow RELEASING.md for a single
   shared release and signed-asset parity.

## Verification and current blockers (2026-11-04)

GitHub main and the clean starting checkout matched (`d5aa79a`). Read-only fetch
of the Sites mirror (`3663c831dbb2ff14fd3ffc89129298ff508542f0`) found no differences
in src, worker, data, scripts, package files or hosting configuration. The cloud
Sites source helper was unavailable; only read-only Git access was used. No main
branch pointer, stash, remote source, account permissions or hosted app changed.

The Library service prepared signed transfers, but its current supported helper
failed with `library file transfer failed: download failed` for both attempts:

- `/workspace/creation-video-input/BibleLens-The-Creation-Pilot.mp4`
- bounded retry: `/workspace/creation-video-input-local-retry/BibleLens-The-Creation-Pilot.mp4`

Neither path yielded readable video bytes. Frame inspection, selected timestamp,
poster extraction and real-video validation remain blocked. No alternate download
URL or executor was used. After the parent supplied the verified YouTube ID, a
supported web open of its watch page returned `Online fetch throttled`. A normal
proxy-respecting HTTPS request to the official YouTube oEmbed metadata endpoint
failed with `Tunnel connection failed: 403 Forbidden`. The enforced network policy
contains no YouTube host grant. That denied destination was not retried, and no
alternate thumbnail URL or executor was used to bypass it. The verified upload
therefore resolves the ID blocker, but thumbnail retrieval, actual frame review,
poster selection and live embedded playback remain blocked in this executor.
The user-message history was checked after the denial; it confirms the upload
authorization and channel choice, but contains no changed network configuration.

Managed browser tooling (`cua_repl.js`) is absent in this executor. Per the Sites
skill, browser previews and phone/iPad visual QA cannot run here; no replacement
browser was installed. Automated state/API fixtures verify controller behavior,
not real YouTube decoding, network playback, visual layout or device behavior.
Do not describe this as a completed or synchronized release.

Final checks passed: `npm run build:mobile` (shared web/mobile build),
`npm run check:videos`, and 65 unique non-browser checks expanded from `check`,
`check:mobile`, `check:images`, `check:release` and `check:sync`. This includes
Stories, all packaged Story/chapter image parity, offline reading/search,
private-note preservation, sync security and release packaging. Readability ran
successfully in its existing report-only mode. The managed-browser-dependent
`scripts/check-release-smoke.mjs` was explicitly skipped; `check:ui` and physical
phone/iPad playback were not run. Source syntax and `git diff --check` passed.
After the follow-up ID change, both generated release records match the current
local source fingerprint:
`86539c6f6f0823854819f2e23b475d582cf7e8f399c69cb37805706791cfdc7a`.
Build number 346 is unchanged because this work has not been released.
Internal build/check logs are in `outputs/creation-video-integration/` (ignored).

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
