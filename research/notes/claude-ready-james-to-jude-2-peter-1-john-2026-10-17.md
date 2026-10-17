# Claude ready: 2 Peter and 1 John (2026-10-17)

## Outcome

- Accepted unchanged: 21
- Corrected: 0
- Held: 0
- Needs owner: none
- Source batch: `james-to-jude-records.json`

Accepted 21 main records unchanged: 20 Translation records with Greek New Testament witness and one untagged Balaam/Bosor-Beor comparison. The Balaam record remains explicitly noncommittal about whether the printed names are forms of one name. The three 2 Peter records overlapping `coverage-nt-peter-delay` remain separately scoped to Greek-edition wording.

## Verification

Every supplied side and labelled KJV quotation was matched against `data/chapters.json`. Every supplied Greek or Hebrew quotation was matched at its supplied address and printed verse label. The served TR and Tischendorf editions are treated as edition witnesses, not a critical apparatus or proof of the original reading. Existing evidence IDs/findings and all six built-in `ENTRIES` studies were reviewed. Draft and notes files were not edited.

## Decision summary

All 21 records were accepted unchanged. The supplied interpretation limits remain part of each record. No owner ruling was inferred from the researcher notes. See the adjacent decisions and quote-checks JSON files for record-level reasons and counts.

Annotation presence is not exhaustive review.

## Build and checks

`node scripts/merge-witness-labels.mjs` reported 271 applied, 0 retagged and 6 pending. No `research/claude-drafts/verse-roles.json` was supplied. One production build and the full `npm run check` suite passed. Resulting totals are 1,581 evidence records plus 6 built-in studies, 859 annotated chapters, 4,078 unique annotated verses and 5,662 evidence placements.
