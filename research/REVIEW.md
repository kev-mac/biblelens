# Annotation expansion review

Scope: static review of worker/index.mjs, src/reader.js, src/data.js, data/evidence.json, related labels/styles, and research/coverage-audit.json. No publication or live-browser verification performed in this review.

## Findings requiring correction

1. **P2 — The chapter banner counts verse placements as independent comparisons.** `src/reader.js:68` sums every API item. `worker/index.mjs:33–35` intentionally produces one item per applicable verse, so one six-verse annotation contributes six to “sourced comparisons.” Count stable annotation IDs across modes or change the label to “annotation placements.” Legacy records without IDs need a stable subject key. The same distinction belongs in release notes.
2. **P2 — Some contextual comparisons remain categorized as conclusive textual conflicts.** In `data/evidence.json`, `exp-late-24-5-7` contrasts inherited suffering with individual guilt, which are not necessarily competing claims; its own explanation distinguishes consequences from responsibility. `exp-late-19-26-4` explicitly acknowledges the sayings can apply in different circumstances. Change their status to Context and preserve their explanations. Consider the same treatment for `exp-late-25-29-17`, whose reasoning explicitly depends on distinguishing the singular and plural agents in Ezekiel 26. Retain textual-conflict labels for actual incompatible figures/statements under comparable conditions, not every interpretive difference.
3. **P2 — Reader footnote is stale.** `src/index.html:18` says KJV and ASV only and that contradictions cover six studies. WEB is present, and the new evidence collection supplies additional contradiction-mode annotations. Replace this sentence with current coverage language below. About text at line 29 also describes only agreement/disagreement without the new Context category.
4. **P3 — Duplicate legacy subjects and links remain.** Genesis 1:6 and 1:7 contain separate identical “A solid sky dome?” records; consolidate to one stable ID with both appliesTo references. `exp-late-25-29-17` lists the Ezekiel 26 URL twice, and `exp-late-28-2-4` duplicates a source URL. Deduplicate URLs within each record. Genesis 1:14 has genuinely distinct timing and observed-cycle assessments, so those should remain separate.

## Checks that passed

- All ref, appliesTo, and labeled refs in the 79 evidence records resolve to real book/chapter/verse positions in the packaged chapter dataset.
- The audit explicitly distinguishes annotation presence from comprehensive chapter review. Current stored totals: 66 books with annotations, 98 of 1,189 chapters with annotations, 426 distinct annotated verse positions, 79 evidence records, and six study records. These figures do not demonstrate complete review.
- `src/reader.js:37` preserves Context as its own tone, and `src/style.css:114–115` provides neutral styling. Context is not passed through the default conflict style. Tooltip/accessibility labels include Context.
- Multiple distinct assessments at one verse remain available as separate tabs. This preserves separate Genesis 1:14 observations rather than overwriting one.
- The Judas research was merged into the existing study entry, with its primary-text sources and scope limits, rather than retained as an additional evidence record.
- The NT source references and arguments reviewed in the research pass are still correctly represented. They are primary-text observations, not independent proof of historical events. External historical/scientific sources were not all re-fetched in this final review.
- Apparent replacement symbols in terminal output were an encoding-display issue: the UTF-8 evidence file contains zero U+FFFD replacement characters.

## Suggested factual README / release language

“The reader contains all 66 books and 1,189 chapters in KJV, ASV, and WEB. The current annotation collection reaches all 66 books, with annotations attached to 426 distinct verses in 98 chapters. This is expanded passage coverage, not a completed review of the entire Bible. Individual findings include sources, reasoning, and interpretive limits. Annotation coverage and completed research are tracked separately in research/coverage-audit.json and the research notes.”

Do not describe this as complete Bible-wide annotation coverage. No user-facing reviewed/unreviewed labels are recommended.
