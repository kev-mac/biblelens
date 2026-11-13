# Selected video posters and the Worker size budget

The combined build420 source could exceed the fixed 66,060,288-byte Sites
Worker budget on the Mac. Its Windows Worker was 65,818,217 bytes; the Mac
handoff reported 51,962 bytes over the same limit. No limit is increased here.

Build421 uses the existing checked image handler for exactly the ten active,
reviewed batch7 posters. They total 770,422 source bytes and are unchanged.
`data/hosted-artwork.json` explicitly lists these paths in `videoPosters` and
`assets`. The immutable public source pin is the already-pushed batch7 asset
commit `0de1ae4daebbd80946238ffc2ce9c7c157926812`.

`hosted-artwork.mjs` accepts only versioned poster paths belonging to ready
videos. Duplicate, unknown, inactive, unversioned and nonposter entries are
rejected. Existing chapter and Story coverage requirements remain. There is
no R2 poster dependency, wildcard origin, new script permission, experimental
static mode or video-player change. The existing image proxy retains hash and
byte verification, cache behavior, credential isolation and immutable fallback.

Native/offline packaging still writes each exact poster file. Only the web
Worker's embedded copy is removed; the same public path serves its reviewed
bytes. Original files, version history, Reader art, story fallback images,
story text and all 115 active video records remain unchanged. This fix does
not activate the incomplete batch8 generations.

## Verification

- Windows web Worker: **64,857,019 bytes**, down **961,198 bytes**; headroom
  **1,203,269 bytes** under the unchanged limit. A Mac rebuild and actual size
  measurement remain required; its earlier size difference is not assumed fixed.
- Web and offline build421 fingerprints both:
  `6e685e4e69605c1d4d65e8ced111bd6bc240cf6f3dff95e4662a2a36a54f2020`.
- All 1,157 selected image blobs match the immutable commit exactly.
- The ten real public GitHub poster files were downloaded and matched byte for
  byte with their source. No source image was recompressed or deleted.
- `check:release`, `check:videos`, and post-mobile `check:images` passed, including
  the new strict-selection/built-route/native-parity regression. Existing
  intentional 1 Samuel7 close-pair reporting remains unchanged.
- A representative newly hosted poster passed the exact built application's
  real-public-video tests in Chromium and WebKit at phone and iPad widths:
  four cases, including advancing playback, pause, changed-frame seeking,
  offline fallback/reconnect, looping and navigation cleanup. Other poster
  routes have exact-byte fixture coverage; this is not a full 115-video matrix.
- No physical-device playback or audio listening is claimed. No publication
  or device installation was performed by this session.

Further batches should explicitly select reviewed posters only after their
immutable asset commit is pushed, preserve native byte parity, measure the real
Worker and run the same checks. Do not silently raise the package budget or
discard older assets to make room.
