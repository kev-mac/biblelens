# Full story summaries and disclosure review

Date: 2026-11-10. Baseline: `d29af2d4adf6a30b470eeb5994fd020012a4091f`, app 1.1.0/build 408.

## Scope and preservation

- Rewrote all 276 core summaries and all seven supplemental summaries. The 283 records now contain 78–283 words each, averaging about 186 words. The 500-word limit is a ceiling, not a target.
- Read the cited passage ranges from the packaged Scripture text. Supplemental stories use every reference in their `passages` array. Retained each account's own sequence and ending rather than combining parallel accounts.
- Stored titles, primary passages, cross-references, topics, collection metadata, review metadata and record order remain unchanged. Scripture text, illustrations, video mappings and all 283 independent preview summaries remain unchanged.
- Preview-file SHA-256: `bf93a5a7967d1290002483b18f205b3db262a81e09b22a2ebae1e9fbf3168507`.
- The standalone story commits did not change `src/overrides.css`, `src/workspace-shell.js` or package commands. The later, independently recreated collection layout is documented in `collection-reader-layout-409.md`.

## Editorial checks

Every full summary differs from its earlier text and stays within the new cap. The longest authored sentence has 27 words. The average full-summary reading grade is approximately 7.58; disclosed detail allows up to grade 10. No full preview sentences were copied into the corresponding full summary.

Broad passage ranges are summarized across their actual scope, even when their existing titles name only one episode. Examples include the Solomon and Chronicles selections, Matthew 19–20, Acts 8 and Acts 19–20. The Matthew 10:1–5 selection stops at its actual endpoint. Mark's empty-tomb selection retains its ending at 16:8. Separate versions of Judas's death and other parallel narratives remain separate.

Review corrections included the unnamed prophet's lion encounter and altar sequence in 1 Kings 13, the stated inheritance dispute behind Jephthah's expulsion, and John's interrogation/flogging sequence. Descriptions of violence, coercion and divine judgment were retained where the passage includes them; no motives or historical verification were added.

The repository-wide readability command remains report-only and still reports inherited findings outside this work. Its story-specific length checks pass. Its glossary detector also flags ordinary uses of “witness” in 12 stories (16 paragraph lines). These mean testimony, observers or commemorative signs in context, not the technical term for ancient textual copies. They were reviewed rather than mechanically replaced.

## Implementation

`scripts/stories.mjs` now exports one 500-word ceiling and a shared summary validator. Core validation and supplemental insertion/validation both use it. Regression cases accept 301 and 500 words and reject 501 words for both paths.

The 43 historical RC1 short-summary overlays remain preserved as historical accepted records. They no longer overwrite the new canonical story prose during packaging. A regression check ensures that the release-content layer returns the authored story catalog unchanged. The story-only hash in the draft framing audit was refreshed; its other collections and historical proposals remain intact.

Saved topic tags remain unchanged. The topic regression now tests deterministic, immutable suggestions separately from the stored tags and verifies that each stored tag intersects the cited passage. The expanded Abram account names both Haran the person and Haran the place. A small matcher correction supports the base verbs “enter,” “reach” and “leave,” preventing “They enter Canaan” from linking to the person. Tests preserve the previous movement fixture and cover the expanded account and the place-loading state.

The Read story button is inside the native story disclosure. It is hidden and excluded from focus and the accessibility tree when collapsed. People and place chips retain their original outside placement. The shared renderer covers ordinary cards, supplemental cards, topic pivots and automatically expanded direct links.

## Verification

- Passed `npm run build:mobile`, which builds the shared web and offline mobile bundles.
- Passed `npm run check`, `npm run check:mobile`, `npm run check:release` and the supplemental content checks.
- Confirmed that all 283 authored summaries match the packaged web catalog exactly, the complete web/mobile catalogs match, and both release fingerprints match the current source.
- The initial RC1b run exposed a historical invariant that predated 24 bounded review additions. The follow-up repair preserves the original evidence hashes and independently verifies those additions. See `rc1b-evidence-hash-review.md` for the cause, safeguards and final verification. Evidence content and expected historical hashes remain unchanged.
- Passed 20 responsive browser configurations: Chromium and WebKit at five widths, on both web and offline mobile bundles. Reviewed final collapsed and expanded screenshots.

Browser checks cover Chromium and WebKit at 320, 390, 550, 820 and 1440 pixels, for both the web Worker and offline mobile bundle. Scenarios include repeated Enter/Space toggles, hidden-action focus exclusion, passage navigation, direct routes, topic pivots, supplemental nested passages, and an unclipped 500-word layout fixture. All browser traffic is limited to the local test server.

This is an isolated, unpublished source change. The production Site and installed devices have not been updated. The canonical checkout and Sites mirror matched at baseline; GitHub fetch was unavailable in this task environment. Recheck upstream and the separate pending UI batch before a coordinated release, choose the next shared build number, then follow `RELEASING.md` for web/native publication and installation.
