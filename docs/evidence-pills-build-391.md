# Inline evidence pills — build 391

This records the initial unpublished candidate. See
[the CI follow-up](evidence-pills-391-ci-followup.md) for the subsequent browser
results, fixes and revised candidate fingerprint. The original fingerprint below
does not identify the revised source.

Source implementation: `d60ba8d` (on top of reader UI build 390).

Verse evidence now uses small, bordered ALL CAPS category pills after the verse
text. Pills wrap separately within the text margins. The latest size refinement
uses `.625rem` text, `2px 4px` visible padding and a `4px` corner radius; the
independent button targets remain at least 44 × 44 CSS pixels. Actual phone and
iPad geometry still needs browser verification.

Colors reuse existing category tones: Translation purple, Violation rose, Laws
teal, Questions green, Academic blue and Text Comparisons orange. A pill omits
the number for one item and shows `(n)` for multiple unique records in its
category. An item with several applicable tags appears in each corresponding
category, once per category. Placement-specific `activeTags` take precedence.
Bookmarks are excluded. Anonymous records on different references are preserved.

A pill opens the existing accessible native dialog with the selected verse,
category and record summaries. The verse reference uses the existing clickable
context preview. Each summary's **View evidence** button opens that category's
full evidence section and focuses the selected record. Full source fields,
reasoning, context, alternate readings, citation links and existing record-page
links remain available. **Back to summary**, **All verse evidence** and **Whole
Chapter** remain available. Close/Escape resolves the current pill after marker
refresh, rather than focusing a removed DOM node. Verse text nodes are preserved
when markers refresh.

No evidence, artwork, notes or sync implementation data changed. The build 390
header, safe areas, caption cleanup, compact picker and typed reference entry
remain in place. Its separate transfer bundle was preserved.

## Validation on 2026-11-07

- `node scripts/check-evidence-tags.mjs`: PASS. Actual grouping, markup and
  inspector handlers cover all six categories, multiple tags, duplicates,
  anonymous records, placement tags, counts, safe escaping, clickable verse
  context, summary/full navigation, stale asynchronous requests, focus identity,
  category tone mapping, smaller pill styling and 44px target declarations.
- Source corpus audit: all 1,933 evidence records map to a category. No record
  was unassigned. Existing data were not rewritten.
- `npm run check:reader-annotations`, picker regression and syntax checks: PASS.
- `npm run check:readability`: PASS.
- `npm run release:prepare`: FAILED at the required browser smoke test, after
  `build:mobile` and all preceding `check` assertions passed. The executable is
  missing at
  `/home/agent/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`.
  Failure location: `scripts/check-release-smoke.mjs:31:32`. No release candidate
  was accepted. No browser installation or sandbox workaround was attempted.
- Independently completed `npm run check:release` and `npm run check:mobile`:
  PASS, against the built outputs.
- `npm run check:sync`: first run alongside other validation FAILED at
  `scripts/check-sync-disconnect.mjs:30` (expected revoked token removal had not
  completed). The unchanged check PASSED when rerun alone after the other checks
  finished. The harness still uses 30 event-loop turns at that assertion; this
  is evidence of a timing-sensitive test, not proof that the underlying cause
  is resolved. No sync production or test changes were made in this task.
- Web/mobile release identity and all five integrated Exodus contradiction
  review records: PASS, with zero external requests. Signed native assets and
  live parity were not verified.
- `src/workspace.js`, `dist/client/workspace.js` and `www/workspace.js` match
  byte for byte.

The new `scripts/check-evidence-tags-browser.mjs` covers Chromium/WebKit,
light/dark, widths 320/390/647/820/1024/1440, all categories, count agreement,
summary/full navigation, inline margins, non-overlapping touch targets, keyboard,
Escape/focus return and preservation of scripture text nodes. It was syntax
checked, **not browser executed**. The updated UX8/UX10 browser tests likewise
remain unexecuted. To run it in an approved browser environment:

```sh
BIBLELENS_PREVIEW_URL='<approved preview URL>' node scripts/check-evidence-tags-browser.mjs
```

## Release state

- Version: `1.1.0`, build `391`.
- Source fingerprint:
  `b6c048593e1d2efb3be3dd08ebd80a17591fbdcce694c95f119fe45220a84088`.
- Worker: 59,180,780 bytes; SHA-256
  `5bbfa3d7746fbce94924a475ed547236b124c34ebac496b8780717770baa3d3a`.
- GitHub main was fetched before development and preparation. The Sites mirror
  was freshly fetched with an ephemeral source credential: unchanged commit
  `64bea042655bc72df95a994a4b6c70237b2c3f5c`, saved build 386; no independent
  newer mirror work was found. The mirror was not modified or pushed.
- **Not published.** The required browser gate failed. No new save/deploy call
  was attempted. The earlier build 386 deployment denial was not bypassed.
- **Not installed.** No connected Mac/iPhone/iPad or Xcode tools are available.
  No signed-app comparison or device build-number verification occurred.
- Approved preview/browser QA is also unavailable in this managed environment:
  no callable managed browser control; the preview relay was unavailable; the
  installed Chromium's sandbox ownership failure remains unchanged. No preview
  server, tunnel, alternate browser-control route or security change was added.

Continue from this canonical source, preserve concurrent research and the
unchanged deployment mirror, provide an approved browser environment, rerun all
required release gates and the new visual matrix, then follow `RELEASING.md` for
publication, signed native comparison, installation and live/device verification.
