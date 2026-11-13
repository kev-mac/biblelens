# Search relevance and formatting follow-up

Published as build **428**, Sites version **419**, after Kevin tested build 427
with **did Israelites eat their children?**

- Runtime commit: `3baf55f47136387cb8bb4347f9ebb7e47de3da41`.
- Source fingerprint: `ba927ea485f20df8b2c8c0d619dc182cdd41d44143093b1283e5f4cee90ab141`.
- Sites source: `dd69ad96f2899172580225e09d069251997f0c3f`.
- Deployment: `appgdep_6af78d4612e481919f7b19584adfe621`, succeeded at
  `2026-11-13T22:21:05.708493+00:00`, environment revision **2**.
- URL: https://scripture-lens.kvn-mcgwn.chatgpt.site.
- Archive SHA-256: `0faa399d72eee9e1048517ff72cb53142997095c9d077cb98a4805e38a3374b5`.

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
These automated checks made no real OpenAI calls. The separate hosted canary
below made one deliberately submitted real question.

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

## Live release verification

Before staging, the current Sites source was clean at `80844625`, build 427,
fingerprint `41dfb3eca121`. It matched canonical main's prior release. Batch 13
remained on publication hold; its Flow tabs and files were untouched. No new
database migration or environment change was needed for build 428.

`release:prepare` passed from clean committed runtime source and built both
platforms. The shared web/native source, Sites mirror and live website passed
`release:verify` for build 428. Chromium was used; WebKit was not run.

The real signed-in owner submitted the exact question once on the live build.
It returned seven app citations and one web citation. The answer began with
2 Kings 6:28-29 and Lamentations 4:10, then explicitly distinguished warnings
in Leviticus and Deuteronomy from reports of events. It had no manna or
Passover contrast. The renderer produced two real headings and two bold spans,
with no raw `###` or `**` markers.

The app citation opened `#read/11/6/28`, showing the actual KJV verses 28 and
29. The real Bible Gateway link opened 2 Kings 6:24-29 in the cited editions.
At a 390 by 844 phone viewport, document client and scroll widths were both
375 pixels; answer width was 327 pixels, with no horizontal overflow. The
temporary viewport was reset afterward.

D1 recorded exactly one additional completed reservation: **9,687 input tokens,
296 output tokens, one web call**. At the previously consulted published rates,
the estimate is **$0.0111167**. The invoice was not accessed. The hidden existing
key and owner-only trial restriction were preserved.

The device task separately confirmed iPhone pairing, successful sync and a live
online answer on installed build 427. Build 428 installation and signed-asset
comparison must be completed by that Mac task; this Windows release session
cannot run Xcode. Preserve the existing pairing and notes during installation.
No private data, credentials, Flow tabs, video files or original dirty checkout
were changed by this correction.
