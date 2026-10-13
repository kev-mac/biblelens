# Translation tag migration — 2026-10-13

Direct owner ruling recorded in claude-integration-workflow.md. Supplied witness-labels.json contains 277 unique IDs with valid witness values: 255 exist in the current evidence collection and were labelled and retagged from H/G to T; 22 remain pending for future batches. H+G collapses to one T. V and Q are preserved. No existing H/G record lacks a supplied label.

All 633 summaries and every other pre-existing non-tag field were compared with the pre-migration evidence and remain identical. No findings were researched, no summary was rewritten, and no Claude draft was edited. The merge validates witness values, unique IDs, allowed tags, references and every existing side quote before writing. The retained registry preserves unmatched labels; repeat merges are idempotent. The build independently requires a valid witness on every T record.

Reader summaries and full/compact citation previews use the explicit witness as a lead-in label. T is one independent toggle with a consistent highlight color. Chat source packets preserve the original summary and witness; displayed citations show both, verbatim reused summaries receive the witness prefix, and generation/verification instructions require witness labels for paraphrases and reject presenting a Septuagint-only difference as a Hebrew mistranslation.

Build and full checks passed, including duplicate/invalid/missing witness rejection, pending labels becoming applicable, idempotence, T/V/Q toggles, unchanged summaries, all four witness displays, citation-preview reset and Chat-source metadata. AI checks use fixtures; live generated-answer correctness and live visual layout were not tested. Annotation presence is not exhaustive review.
