# Commandment navigation and biblical ordering

## Diagnosis and scope

The Reader's yellow COMMANDMENT membership marker was a `span`: it had neither
a destination nor a click handler. The directory rendered the catalog's retained
historical order, positive P1–P248 followed by negative N1–N365. Genesis 1:28 is
P212 in that enumeration; this is an identifier, not its order in the Torah.

The fix makes the marker a normal link to the matching directory summary. One
verse with several commandments links to all its matched codes. The list sorts
by the primary passage's Torah book, chapter and verse, then the retained ID for
ties. A stable, full-catalog biblical number is shown on each title: Genesis 1:28
is #1. Traditional P/N IDs, record IDs, quotations, references, source content,
and legacy `?code=` URLs are unchanged. Search and filters preserve text order.
Returning to the complete directory clears a previous route selection.

No translation or interlinear feature was implemented; that requires a separate
sample and the owner's approval.

## Source and release coordination

- Isolated branch: `fix/commandment-tags-biblical-order`.
- Base: `f545d6317661b9ae189fd135305e5dc731f28800` (build 422, video batch 9).
- The three affected runtime baseline files matched the already-opened Sites
  mirror at `92ce169` before the fix: `src/commandments.js`, `src/workspace.js`,
  and `src/index.html`. A separate source-opening download was abandoned when it
  exhausted available disk space; only its failed clone was deleted.
- Preserve video batch 10 and later main changes when integrating. This branch
  does not change the shared build number and must not publish an older video
  catalog. Merge the tested source into the release owner's current branch and
  increment the build there, then run the normal shared release workflow.
- This task does not publish, sign, install, or claim physical-device testing.

## Verification

- Web build passed; offline mobile web bundle staged successfully. The Windows
  Store `python3` alias was unavailable, so the repository's unchanged
  `swap-mobile.py` was invoked with the installed bundled Python runtime.
- Catalog tests check all 613 identities, the complete book/chapter/verse order,
  stable tie-breaking, filtered order, legacy single-code routes, multi-code
  selection and invalid codes. Reader membership tests verify the actual links.
- Focused browser regression passed in Chromium and WebKit, at 390px and 1024px,
  against both the web Worker and offline mobile bundle. Coverage includes
  keyboard activation, repeat navigation, Back, visible summaries, pagination,
  filtering/reset, context opening/closing, multiple matches, and margin bounds.
- Phone and tablet screenshots are retained under ignored `.review/commandments/`.
  The phone summary and tablet directory were visually inspected; no horizontal
  overflow was seen.
- Readability report ran successfully; existing report-only warnings remain.
- Full `npm run check` passed, including the search browser matrix at 320px,
  390px, 820px and 1440px in Chromium and WebKit. The initial attempt was
  interrupted by disk exhaustion; failed task downloads were removed and the
  full suite then ran to successful completion.
