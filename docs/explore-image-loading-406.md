# Explore image loading — proposed build 406

Canonical baseline: `59efd771ab426d9ab4cfbb0680b7aba59f628d1c`, build 405, fingerprint `8b830d2339008190e290ec310f23c7787871da42ac7cf69a065729f7dd15f863`. Preserve the accepted grid, reading shortcuts, shared font, all artwork content and all research data.

## Source opening and release coordination

The coordinator completed the official Sites 1.1.4 source-helper opening, exit 0, on the existing coordinator-owned Mac mirror. Returned project: `appgprj_6acba627a6cc8191932fbbc47db8895d`; clean source commit: `c073a3915b5f639ca159f227c4a77f3d7b60b627`. Applying canonical `release-info.mjs` to both actual trees produced exactly the baseline release above. No independent production changes need reconciliation. The complete helper receipt is retained in the delegation history; the Mac path is not passed to cloud tools. Site version 398 remains public. The coordinator will reopen the mirror freshly before publication.

The earlier cloud helper-materialization failure is resolved by this completed opening and fingerprint comparison. No Mac GitHub retry, native build or install is performed by this cloud task. Publication waits for the matching native path; the coordinator owns final review, Mac work and joint publication/install.

## Focused implementation

Eight current art roles use checked-in 640px renditions and exact original-width copies. Six originals are 1200px; Stories and the hero are 960px and are not upscaled. All 16 filenames contain a content hash; source hashes, bytes, dimensions and conversion settings are recorded in `src/assets/explore-art.provenance.json`. Every original remains unchanged. The nine older `explore-*.webp` illustrations remain served for existing routes. New hashed files get a strong ETag, immutable one-year caching, HEAD and conditional 304 responses. HTML, mutable original names, CSP and the hosted-artwork origin handler retain their policies.

Explore emits deferred URL attributes, explicit dimensions, `srcset`/`sizes`, async decoding and lazy defaults. Only actually visible images receive active sources. At most the first visible illustration gets high priority. View changes, scrolling and resizing update loading without activating hidden Explore images. Existing navigation, reading progress, captions/alt semantics, styling and Retry fetch behavior are preserved.

The deployed Sites build does not execute the raw `Uint8Array.from(atob(...), callback)` expression for these responses. `static-worker.mjs` replaces it with `assetBody`; the generated embedded fallback performs Z85 decoding and Gzip decompression. A public binary-byte cache now coalesces those reads and retains at most 4MiB/24 entries with LRU eviction. It stores bytes rather than Response objects or streams; every request receives a fresh body. Failures and oversized bodies are not retained. Text/data-pack caching is unchanged. Native still packages every rendition on disk and has no new network dependency.

## Measurements and verification boundary

The 640px images total 473,490 bytes versus 1,108,238 original bytes: 57.28% less. Evidence plus Timeline total 130,356 versus 371,754 bytes: 64.94% less. Large layouts/high-density displays can select the original-width rendition, so actual transferred bytes are measured per viewport/DPR rather than assuming every browser selects 640px.

Initial shared build, actual Worker/source/native image equality, validators/304/HEAD, concurrent complete streams, startup assets, bounded-cache cases and static grid/habit checks passed. Full checks against the final committed state, actual Chromium/WebKit cold/warm measurements and final screenshot inspection are pending.

The performance matrix separates client-cold/new-document warm visits, hidden Read/Text Comparisons views, server HTTP bytes, browser timings/cache events and a fresh-process Node Worker benchmark. Loopback timings do not establish Cloudflare CPU limits or production network latency. Optional current-public-Site captures verify baseline identity first and record failed statuses, body bytes, response headers, redirect chains and bounded untrusted error bodies. Access rejection stops that live action; it is not bypassed.

Three relevant recent image events in a bounded live Worker log query returned 200 with 12–13ms Worker CPU time. The logs did not identify the reported 1,226-byte failures. Their status/body/layer remain unresolved unless reproduced; do not call them a confirmed CPU or concurrency failure. Physical devices, signed native assets and post-publication `release:verify` remain coordinator checks.

The stale carousel assertions in the old responsive annotation suite are updated to the accepted build-405 grid while retaining its 56 responsive/theme/search/navigation cases. The current six-case grid/story/disclosure matrix remains. Build-403 carousel-specific comparison/centering scripts describe a retired layout and are not used to certify the current grid.

## Initial diagnostic checkpoint

Run 42721966300 passed full release preparation, image/native parity, 56 responsive cases and the six-case grid/detail matrix. The new performance gate rejected its first Chromium case because it observed a Retry notice. The QA adapter lacked the Site DB binding: the actual signed-out sync request then returned 503, while the real binding-present signed-out handler returns 401. The adapter now asserts that authentic 401 behavior without issuing SQL; the no-Retry acceptance assertion remains. Non-image server failures are also recorded for diagnosis. The benchmark previously used a compound addition around an awaited parallel read, which lost byte counts; completed bodies are now verified against all eight exact lengths and SHA-256 hashes outside the timed interval, then reduced together. Every direct warm round must still return the full 473,490 expected bytes. Initial artifact 13720319643 is diagnostic only and is not releaseable. Its broker host is outside this executor’s allowlist, so no local transfer was attempted. Final exact-source checks and artifacts remain pending.
