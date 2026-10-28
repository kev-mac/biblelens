# B4 Self-Review

Baseline: `codex/b3` at `c612c17f8b508d0d3ab3499df92ee6162a7f7fe0`.
Scope: local `codex/b4` only. B3's final report was present before work began.
No release checkout was edited, fetched, merged, installed or published.

## Result And Limits

The shell uses Big Questions and the `#questions` collection route.
Cold and in-app `#debates` links redirect while preserving filters, query strings and history state.
Individual `#debate/<id>` links, backups, device choices, category keys and sync IDs remain unchanged.
The displayed evidence heading is What the evidence shows. Evidence strength remains explicitly unassessed.
The current conflict-status display becomes Wording differs; no new evidence rating is invented.

B01–B30 still map to the same 30 selected questions. Ten reserves remain available.
All 40 previews have two proposed readings, links and limits.
These combine the pinned summaries with clearly identified editorial inferences from the linked passages.
Four new faith-source summaries are attributed individually, not presented as the view of every tradition.
The remaining comparison review queue is explicit: 1,736 records, 43 linked to previews, 1,693 requiring individual review.
Supplying paired readings for the previews does not complete source and tradition coverage for those remaining records.

## Accepted Content And Draft Boundaries

Accepted Evidence, stories, people, timeline, prophecies, scripture and starter-study files match B3 exactly.
The draft overlay stages 1,144 Evidence field changes. Sources, quotations, numbers and identity fields are protected.
The staged source hashes and exact proposed paths must match before the builder applies the overlay.
Normal builds preserve accepted prose and exclude draft pages and question payloads.
Draft previews alone show the wording changes and proposed readings.
The preview fingerprint includes the two new packaged B4 proposal files.
No built release.json was edited by hand. Version 1.1.0 and build 274 are unchanged.

The B1 decision sheet changes wording only; its IDs, order and recommended choices are checked.
The original sheet is retained alongside the revised review copy.
Original App Store/privacy drafts are recovered from their recorded Git object inside this worktree.
New wording remains a draft. Historical platform/account/legal findings are marked as unrefreshed.
No age rating, rights clearance, data-deletion policy, retention period or provider practice is invented.

## Findings Fixed During Review

- Restored internal enum/property names accidentally touched during the first bulk rename; syntax and integrity checks catch these.
- Replaced negative statements about incompatibility with explicit limits, rather than implying there are no textual differences.
- Preserved all quotation spans, source objects, passage numbers and source joins in the staged Evidence overlay.
- Routed the canonical collection through the existing lazy loader and internal view IDs.
- Preserved the bare legacy `#debate` error route; added checks for every cold question route.
- Updated browser expectations for the approved route and label changes; old-link behavior has separate regression checks.
- Kept Evidence selected by default on the review page after adding B4 collections.
- Limited quotation exemptions to 14 exact existing spans. New quoted claims still fail the framing check.
- Included JSX text, accessible labels and displayed secondary fields in the framing scan.
- Corrected a local static-preview server to read a file before writing headers; its earlier native test failure was harness-only.

## Corpus Audit And Gate

The plan and machine inventory cover canon, book order, reference structure, editions, quotations,
reader and search IDs, categories, reference aids, product/native identity and regression fixtures.
The inventory records exact lexical-match locations, plus semantic limits; it is not a claim of exhaustive semantic discovery.
A tested immutable config is supplied as a proposal. Runtime integration is deferred because the all-checks gate is not green.
No Quran text, translation, reference or source has been added.

## Verification

Normal and draft shared web/native builds pass. Standard app, workspace, mobile, sync and release unit checks pass.
B2 catalog/quote/runtime checks, review browser matrix, image-slot safety and gap schema/runtime checks pass.
B1 current draft integrity and phone matrix pass. Phase 3 web/native phone matrices and B4 route/source matrix pass.
B3 offline, private-request cache bypass, menu/focus, motion and history tests pass in Chromium and WebKit.
Phone screenshots were inspected for the new reading sections and Big Questions navigation.
New reading proposals average FK 7.25; the Store description also meets the collection grade and sentence limits.

Strict B3 readability still fails: 1,714 held Evidence records, 2,825 overlength lines and 2,070 jargon lines.
Three archival standalone verifiers also fail: old Explore snapshot, old headline Evidence hash and old ledger Evidence hash.
All three failures were reproduced in an untouched B3 Git archive under `.review/b4/baseline`.
Current B1/B2/B4 validators still verify the active proposals, quotations and source integrity; no old gate was weakened.
No live deployment or signed iOS verification is claimed. The unrelated release job can advance independently.
