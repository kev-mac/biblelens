# Codex prompt: speed up Explore / Evidence tile images (2026-11-09)

Kevin reports that the Evidence page tile images take a long time to load and asked Claude to hand the fix to Codex. Claude diagnosed it on the live site and in source and changed no app files. Please implement, verify and release through the normal RELEASING.md route.

## What Kevin sees

Explore → Evidence (`#discover?section=evidence`) shows two tiles, Evidence & Interpretations (`explore-evidence.webp`) and Timeline (`explore-timeline.webp`). Their images arrive late. The same images are used by the Explore collection cards.

## Measurements (live build 405, fingerprint `8b830d23…15f863`, desktop Chromium, one session)

- Cold reload of `#questions?mode=text`: eight image requests started together. Time to first byte was 2.5–6.3 s each. Four of the eight (`explore-ark`, `explore-timeline`, `story-the-dedication-of-jerusalem-s-wall-v1`, `story-the-scroll-burned-v1`) came back as a 1,226-byte response that did not decode as an image (`naturalWidth` 0), and the page showed "Retrying…". Claude did not capture the status code or body of those failed responses.
- Warm, one request at a time with `cache: 'no-store'`: about 0.7–0.8 s per image. `/release.json` (117 bytes) also took about 0.78 s, so most of that is per-request Worker and network overhead, not image size.
- Warm, six images in parallel: 0.8–3.9 s each.
- Response headers on `/assets/*.webp`: `cache-control: no-cache`, no `etag`, no `cf-cache-status`, no `age`.

These are single measurements from one machine. They were not repeated on a phone or in WebKit.

## Causes found in source

1. **No caching.** The generic asset branch of the fetch handler in `worker/index.mjs` (the `const asset=ASSETS[...]` return near line 330) sends every asset with `cache-control: no-cache` and no validator. Browsers therefore re-download every tile in full on each visit, and nothing can answer with 304.
2. **Per-request base64 decode.** The same branch builds the body with `Uint8Array.from(atob(asset.body), char => char.charCodeAt(0))` for each request. For a 100–275 KB image that is a per-byte callback on every hit. Claude infers this is a large part of the slow parallel responses and possibly the failed ones; it was not profiled.
3. **All Explore images load eagerly, on every view.** `src/atlas-explore.js` lines 59–60 emit the seven collection images and the Genesis 7 banner as plain `<img>` with no `loading` attribute. They are requested even when Explore is hidden (measured on Text Comparisons, where all eight had zero rendered size), and the two tiles Kevin is looking at compete with the other six.
4. **Oversized files.** The Explore art is 1200 px wide, 108–275 KB per file (`src/assets/explore-*.webp`), and renders at roughly 450 px in the Evidence section. The `explore-*.webp` names carry no version or content hash, which is what currently prevents safe long-lived caching.

## Requested changes

Priority order. Items 1 and 2 are expected to give most of the gain.

1. **Make tile images cacheable.** Either give Explore art content-hashed or versioned filenames and serve them `public, max-age=31536000, immutable`, or at minimum add a strong `etag` and 304 handling with a sensible `max-age`. `worker/public-artwork.mjs` already does this for hosted chapter art and may be the simplest route: moving Explore art onto that edge-cached path would also remove the base64 decode for these files. Keep HTML and other no-cache assets as they are unless you choose to extend the change deliberately.
2. **Load only what is visible.** Do not request Explore images while Explore is hidden. In Explore, load the visible/active tiles first (`fetchpriority="high"` on at most the first visible image) and `loading="lazy"` for the rest. Keep `decoding="async"`, reserved layout space, the existing Retry behaviour and alt text.
3. **Ship tile-sized images.** Add smaller renditions (about 640 px wide) with `srcset`/`sizes`, keeping the 1200 px files for large layouts. Follow the versioned-filename rule in RELEASING.md and record provenance in `src/assets/explore-art.provenance.json`.
4. **If item 1 keeps any image in the embedded bundle,** avoid the per-byte callback decode for binary assets (decode once and reuse, or use a faster decode).
5. **Find out what the 1,226-byte failed responses are** (status, body, which layer produced them) and record it. If it is a Worker CPU or concurrency limit, say so and confirm the change removes it.

## Constraints

- One shared source for web and native. Native reading must stay offline: every image remains packaged in `www`, and no network dependency is added to native Explore.
- Do not change artwork content, evidence data, routes, storage keys, app identity or the zLenz: Bible name.
- Keep the CSP image policy: only the existing public image origin, no remote scripts.
- The hosted-artwork handler must keep forwarding no cookies, authorization or query data.
- Update `scripts/check-explore-assets.mjs`, `check-startup-assets.mjs` and any image-parity checks rather than loosening them.

## Done means

- Second visit to Explore → Evidence loads both tile images from browser cache or a 304, with no full re-download.
- Opening Text Comparisons or Read does not request Explore tile images.
- Cold load of Explore → Evidence: both visible tiles decode successfully on the first attempt, with no "Retrying…", in Chromium and WebKit at phone and desktop widths. Record before/after request counts, bytes and timings.
- `release:prepare`, image parity and the existing Explore matrices pass; publish, `release:verify`, and install the matching native build per RELEASING.md.
- Report anything not verified (physical devices, signed native assets) instead of claiming it.
