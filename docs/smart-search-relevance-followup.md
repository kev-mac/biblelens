# Search relevance and formatting follow-up

Correction prepared for build 428 after Kevin tested build 427 with
**did Israelites eat their children?** Publication status is recorded separately
after deployment succeeds.

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

## Does this improve searches overall?

Formatting, direct-answer instructions, relationship-preserving query planning
and the request to omit unrelated contrasts apply to every online answer.
The local retrieval correction is a reviewed concept rule covering this subject
and several phrasings. It does not introduce a general relation parser, new
embeddings, or a new ranking algorithm for unrelated local questions. Other
semantic searches still depend on the six earlier reviewed concepts, query
expansion and the existing lexical matcher.

The unchanged 50-query evaluation covers 12 reference queries, eight people,
six places, ten claim questions, six topics and eight spelling variants. On
the correction it found a reviewed useful hit for 50/50 queries, an original
expected target for 48/50, and 114/160 expected targets overall. Only 26/50
had a useful result in the first five aggregate rows; 34/50 returned every
expected target. These are the same headline counts as build 427. This is
regression evidence, not measured overall ranking improvement. Topic recall
remains limited: 6/26 original expected topic targets were retrieved.

The added relation regressions cover the exact question and variants about
own children, sons, boiling and cannibalism, as well as unsupported actors and
ordinary manna questions. These use actual packaged sources; provider wording
is mocked. There is no claim of universal meaning-based understanding.

Publication and a live owner canary are coordinated with the parent and other
release work. No private data, credentials, Flow tabs, video files or original
dirty checkout were changed.
