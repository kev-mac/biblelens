# Smart search build 427 release

Published 2026-11-13 at https://scripture-lens.kvn-mcgwn.chatgpt.site.

- App: 1.1.0, build **427**. Sites saved version: **418**.
- Runtime source: `e70bf019a20928ef5b540e631317696f335124b5`.
- Shared source fingerprint: `41dfb3eca121f62742491bc57fed9b36c0c386b626079166af1beb48c0c4a9f5`.
- Sites source: `808446250c032793306b660d81554c73f225f5bd`.
- Deployment: `appgdep_6af780f247ec81918bcc1ce00baaa271`, succeeded at
  `2026-11-13T21:28:31.115287+00:00`, environment revision **2**.
- Archive SHA-256: `2592288b5760d8251974dbd46d21c141fc7c0d3757b4d93bc75494a8cb1a3c02`.

## Source and release coordination

Canonical main `b985cc34` and the prior Sites source `5be14e05` matched on
product source before staging; both identified build 426 and fingerprint
`e7ed2c94b430154b905846e4be01683269cb78b74296982414a16dec3c66dc8b`.
The existing dirty development checkout was preserved. An isolated worktree
and isolated Sites mirror were used. The prepared self-contained Worker was
packaged without `dist/client`, preserving the established Sites contract.

Batch 13's ledger explicitly held publication during the search release.
Its Flow tabs, downloads and source were untouched. It must integrate from
canonical build 427 before its next release and increment the shared build.

## Provider, privacy and database

Kevin authorized reuse of his existing key for this trial. The hidden runtime
key was reused without viewing its value. No account, credential purchase,
billing setting or spending limit was changed. Reading remains public;
paid online answers require the verified owner's allowlist. Public access must
be reviewed before launch.

The generated additive migrations `0001_common_rocket_raccoon.sql` and
`0002_tough_celestials.sql` were deployed. Live D1 contains the new
`ai_search_requests` and `ai_trial_users` tables alongside the three existing
sync tables. Private notes and history are excluded from provider context.
Only deliberately submitted questions trigger provider calls.

## Real hosted acceptance

One approved-owner question, **show me examples of miracles**, completed through
the real hosted endpoint and existing key. The interface displayed app material
first, then the OpenAI answer with seven app citations and one web citation.

- `zLenz: John 2:7` opened `#read/42/2/7`, the correct KJV chapter and verse.
  Nearby verse 9 describes water made wine.
- `zLenz: Crossing the Sea` opened `#stories/exodus/crossing-the-sea`, with the
  real Exodus 14:1-15:21 Story and matching text.
- The web citation opened the Archdiocese of Hartford's 43-page
  [Introduction to the Gospels PDF](https://archdioceseofhartford.org/wp-content/uploads/2025/12/DownloadableGuidewithCover.pdf).
- Local search for the exact question returned 29 results: 20 Scripture,
  four Evidence and five Events, including Cana, the crossing, calming the
  storm, feeding the crowd and raising Lazarus. Relevant verse texts did not
  need to contain the word "miracle".
- Unsupported local query `qzxv orbital marmalade ethics` returned zero results
  and no invented app source. Mocked online tests also reject invented app IDs.
- At a 390 by 844 phone viewport, document client and scroll widths were both
  375 pixels; the answer occupied 327 pixels and all eight citations remained
  usable, with no horizontal overflow.
- Anonymous `/api/answer` returned 401 without consuming a reservation.

D1 recorded exactly one completed reservation: **8,613 input tokens, 333 output
tokens, one web call**. This submission used the bounded planner and answer
requests. Typing and source navigation added no paid reservations. At the
consulted [published rates](https://developers.openai.com/api/docs/pricing)
($0.10/M input, $0.50/M output, $0.01/web call), the estimate is **$0.01103**.
The actual invoice was not accessed. Automated provider tests were mocked.

## Checks and remaining verification

`npm run release:prepare` passed on clean runtime source. It built matching
web/native bundles and passed combined-search, SQLite migration/quota, privacy,
sync, mobile, release packaging and the required project checks. Chromium
tests covered 320, 390, 820 and 1440 pixel widths; native offline search was
also tested locally at 390 and 820 pixels. WebKit was not run. The baseline
50-query search evaluation found useful results for all queries and at least
one expected target in 48; recall is not exhaustive.

The live server reports build 427. A previously open signed-in page retained
build 426's cached shell; its Refresh App Files action reported failure.
Opening the versioned URL with `?build=41dfb3eca121f62742491bc57fed9b36c0c386b626079166af1beb48c0c4a9f5#chat`
loaded and verified build 427. No private browser storage or notes were cleared.
Cloud sync stayed off during the live test.

`npm run release:verify -- <isolated Sites mirror>` passed after publication:
the live website, prepared native assets, Sites mirror and canonical source
all match build 427 and fingerprint `41dfb3eca121`.

Physical iPhone/iPad installation, comparison of signed assets and live online
access through a paired device are pending the separate Mac handoff. This
record confirms the website and prepared native assets, not an installed
native release. Broader semantic recall remains a future evaluation task.
