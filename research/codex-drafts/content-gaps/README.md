# Content-gap drafts

**Status: draft / needs review.** Nothing in this folder is approved app content.

This batch starts from `origin/main` at `55e438a1071ac8629d5197cbf6c6db9d8346873e`.
Work took place only in the new `BibleLens-gaps` worktree, on `codex/content-gaps`.
The owner requested this research exception to Codex’s usual integration role.
The same agent drafted, checked and reviewed the work. No second reviewer is implied.

| Group | Draft records | Coverage |
| --- | ---: | --- |
| [Evidence](evidence.json) | 50 | Joshua 1; Job 25; Psalms 22; Ecclesiastes 2 |
| [Stories](stories.json) | 40 | 31 previously absent books: 21 letters, nine minor prophets, Revelation |
| [Prophecies](prophecies.json) | 25 | Additional textual connections; the three current samples are excluded |
| [Timeline](timeline.json) | 40 | Additional entries with a textual sequence review; existing ten entries are excluded |
| **Total** | **155** | All require review before integration |

**Gap method.** The old chapter ledger was checked against current evidence placements and the built-in studies.
A placement uses `ref` and `appliesTo`; a citation in `refs` alone is recorded separately as context.
The [inventory](support/gap-inventory.json) retains both measures and the older ledger counts.

| Book | Old ledger gaps | Current placement gaps | New drafts | No new draft |
| --- | ---: | ---: | ---: | ---: |
| Joshua | 1 | 1 | 1 | 0 |
| Job | 28 | 28 | 25 | 3 |
| Psalms | 79 | 66 | 22 | 44 |
| Ecclesiastes | 5 | 5 | 2 | 3 |
| **Total** | **113** | **100** | **50** | **50** |

Every current gap has an outcome in `evidence.json` → `gap_review`.
The screen compared KJV and Brenton English wording, then checked candidate clauses in Brenton’s Greek.
It was not a full Hebrew review, a whole-Bible review, or a certification that remaining chapters contain no findings.
Clear edition differences became T drafts, with the old Greek translation identified in the required `witness` field.
No new V, scientific, archaeological or dictionary claim was added.
Poetic speech remains poetic speech; none of these comparisons supplies a physical history of its images.

Existing evidence IDs, exact references, earlier drafts, integration decisions and retired findings were checked.
No new evidence destination has an exact reference match in the existing Claude record arrays.
Known retired Psalm parallels were not revived. The Job 37:23 draft remains in its earlier file without duplication.

**Sources and quotations.** Original Greek was fetched by script, not copied from search summaries.
Some direct page requests returned 403 responses. The publisher’s public HTML archives supplied the exact chapter files instead:
[Greek](https://ebible.org/Scriptures/grcbrent_html.zip),
[English translation](https://ebible.org/Scriptures/eng-Brenton_html.zip), and
[KJV](https://ebible.org/Scriptures/eng-kjv_html.zip).
The [source cache](support/source-cache.json) retains 454 extracted pages, addresses, fetch date and page/archive SHA-256 hashes.
Visible verse labels determine quotation locations. Notes and section headings are excluded from verse text.
Scripture is public-domain text in these editions.

Each group retains source links and exact quotations for review.
KJV quotations match `data/chapters.json` exactly; the app’s scripture was not corrected in this task.
Greek and Brenton English quotations match the fetched texts exactly, with no Unicode normalization.
Greek and English verse boundaries differ at Job 11:2–3 and 17:2–3; both clauses are quoted and labelled.
Psalm numbering and Ecclesiastes 5:6 / Greek 5:5 are explicit.
Joshua 20’s printed Greek labels are recorded; the residence rule is checked against the whole short chapter.

There are **3,356 quotation checks**, with zero mismatches against the packaged KJV or the quoted Greek/English edition.
Publisher comparison found **1,272 typography-only instances** and **15 further wording differences**.
Typography comparison ignores case, punctuation and spacing only; exact quotations remain intact.
The fifteen exceptions are pinned in [reviewed publisher differences](support/reviewed-publisher-differences.json).
They include likely packaged typos, name spellings, missing words, and singular/plural differences.
Examples include Exodus 2:9, “women” / “woman”, and Exodus 25:34, “candlesticks” / “candlestick”.
No draft finding depends on those differences. They remain an owner/integrator issue, not silently passed as identical text.

**Format and schema checks.** Workflow status sits outside each proposed app record.
The evidence payload’s `status: Context` describes its assessment, not research approval.
Prophecy taxonomy status likewise describes the proposed interpretation, not approval or independently proved fulfillment.
Story records cannot contain a status field under their existing schema; each has a matching draft review entry.

All 40 stories pass `schemas/stories.schema.json`; all 25 prophecies pass `src/data/prophecies.schema.json`.
There is no standalone evidence or reviewed-timeline JSON Schema in this checkout.
The [supplemental shapes](support/draft-shapes.schema.json) check their draft structure without claiming to replace an official schema.
The repository’s actual evidence, side-quotation, story and timeline validators also pass, including combined old/new catalogs.
Passage bounds, unique IDs/titles, existing evidence links and absent story books are checked.
Results: [schema and source checks](support/validation.json), [runtime and readability checks](support/runtime-validation.json).

| Draft prose collection | Average FK grade | Over-length sentences | Unexplained screened jargon |
| --- | ---: | ---: | ---: |
| Evidence | 6.79 | 0 | 0 |
| Stories | 7.01 | 0 | 0 |
| Prophecies | 7.76 | 0 | 0 |
| Timeline | 6.73 | 0 | 0 |

The checker from `codex/readability-standard` matches the current checker.
The required `npm run check:readability` was run separately.
It exits successfully in report-only mode but flags existing app collections; see [baseline output](support/readability-baseline.txt).
Those existing files were left unchanged. Draft prose passes the stricter collection checks above.
Source titles, exact scripture quotations and machine metadata are excluded from prose scoring.

**Self-review.** Review removed candidates that required an unverified lexical judgment or only expressed a similar meaning.
That includes the mediator wish in Job 9, the ambiguous English gloss at Psalm 17:14, and the haste/amazement comparison at Psalm 116:11.
Ecclesiastes 6:5 was not promoted from Brenton’s English alone; its Greek comparison needs further work.
The proposed Job 31 comparison uses verse 35, where the direction of the written charge is clear in both supplied editions.
The earlier verse 37 lead was dropped because the English rendering did not safely support the Greek claim.
Review also corrected verse boundaries, source extraction, names, grammar and plain-language explanations.

**Open questions and limits for integration.**

- Fifty placement gaps remain without a new record. Their logged outcomes should not become claims of exhaustive review.
- The older story policy allowed narrative units only. This request explicitly includes letters and Revelation in draft scope.
  The new entries name their literary forms: letters, speeches, visions, reported scenes and hypothetical examples.
  Decide the final category policy before importing all 40 into Stories. No reported speech is converted into an independently verified event.
- The 40 timeline entries review passage order and existing evidence pointers. They do **not** supply 40 independently dated historical events.
  Their existing evidence records’ other sources were not fully re-audited. Null discrepancy flags do not mean historical agreement.
  Some pointers lead to a law or an earlier scene used in the comparison; review those destinations before integration.
- “Historical” prophecy labels mean an outcome reported within the texts. They do not establish predictive authorship or outside confirmation.
  Jonah’s linked outcome is averted destruction. Hosea’s earlier verse is a recollection reused by Matthew, not a direct future prediction.
  Matthew’s Jeremiah attribution and the proposed Zechariah link remain disputed; no invented solution is supplied.
- Review the fifteen packaged/publisher differences before any separate scripture correction. This task changes neither edition.

To repeat the checks from this worktree, use Python with `jsonschema` 4.x installed:

```sh
python3 research/codex-drafts/content-gaps/support/validate.py
node research/codex-drafts/content-gaps/support/validate.mjs
npm run check:readability
```

These checks do not build or release the app. The Python check only rewrites reports inside this draft folder.
No `data/`, `src/`, schema, release or build-number file was changed.
