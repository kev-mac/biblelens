# Search relevance and formatting follow-up

Unpublished correction to build 427, requested after Kevin tested
**did Israelites eat their children?** No new release number is assigned here.

## Reproduction and cause

The exact question against build 427's actual packaged handler returned
Exodus 16:35 and its manna text as the leading Library answer. The lexical
matcher treated the subject, verb and object as unordered terms. Thus
"children of Israel did eat manna" looked relevant despite reversing the
question's meaning. The search endpoint also returned unrelated passages.

The online renderer escaped provider text but displayed it as plain text.
Consequently Markdown headings and bold markers appeared literally. The
online context collector could also include broad food matches, inviting
unhelpful contrasts such as Passover. The reported live wording itself was
not regenerated for this investigation; local provider replies are mocked.

## Corrections

- A seventh reviewed concept in `src/search-concepts.js` recognizes questions
  about eating children. Actual sources begin with 2 Kings 6:28-29 and
  Lamentations 4:10; warnings in Leviticus, Deuteronomy and Jeremiah follow.
  The Library description distinguishes reports from warnings. These are
  textual sources, not independent historical verification.
- `worker/index.mjs` prevents this relation from falling back to bag-of-words
  matches. Unsupported subjects such as Egyptians or an invented actor yield
  no borrowed app examples. Explicit references and book scope retain priority.
  Online context for this concept uses only those resolved real app passages;
  broad planner suggestions cannot reintroduce manna, Passover or unrelated
  stories. Ordinary questions about eating manna retain normal retrieval.
- The provider instructions preserve who acts on whom, ask for a direct answer,
  omit unrelated contrasts, and distinguish reports from warnings. Prompt
  adherence remains generative behavior; it is not guaranteed by a mocked test.
- `src/combined-search.js` and its CSS render headings, bold text, code spans
  and simple lists. Provider HTML stays escaped. Only validated citation
  objects create links; arbitrary Markdown links cannot become active links.

## Regression coverage

The new test failed against the original built bundle (`passage` instead of
the expected reviewed `concept`) and passed after rebuilding the correction.
Actual packaged KJV, WEB and ASV text is tested. Every returned passage resolves
to a real chapter and verse. Unsupported actors, ordinary manna questions,
misleading planner leads, formatted source labels and HTML/link injection are
covered. Existing miracles and no-evidence cases remain covered.

Chromium browser tests use mocked provider replies at 320, 390, 820 and 1440
pixels. They check formatted headings/bold text, real citation navigation to
2 Kings 6:28, the corrected Library description, absence of raw markers and
horizontal overflow, app-first ordering and deliberate submissions only.

Local checks: `build`, `check:combined-search`,
`check:combined-search:browser`, `check:workspace`, `build:mobile`,
`check:mobile` and `check:readability`.
Readability is the existing report-only audit, with pre-existing flagged items.
No real OpenAI calls or additional API charges were incurred in this follow-up.

Publication, a new shared build number and any new live owner canary must be
coordinated with the parent and other release work. The live website remains
build 427 until that separate release. No private data, credentials, Flow tabs,
video files or original dirty checkout were changed.
