# App and web search trial

Published as app build **427**, Sites version **418**, on 2026-11-13. The real
owner-only OpenAI trial succeeded using the existing hidden runtime key.
Reading remains public. Online answers remain restricted to the approved owner
until Kevin revisits the provider and billing choice before public release.
See [the release record](smart-search-build427-release.md) for live evidence.

## Behavior

- Typing searches the app. It never calls OpenAI.
- **App + Web**, Enter in the search field, or **Ask** intentionally submits an
  online question. Chat shows its packaged answer before waiting for OpenAI.
- App results remain first and available when the online service fails.
- Inline links label **zLenz** material and newly retrieved **Web** sources.
  Provider HTML and arbitrary generated Markdown links are never interpreted.
- Offline reading and search, including native retrieval, remain local. A native
  online answer uses the existing paired device credential with the Site only.

## Meaning-based retrieval

`src/search-concepts.js` supplies reviewed passage leads for six concepts:
miracles, healing, forgiveness, resurrection, feeding crowds and generosity.
The bridge works offline, respects explicit references and book scope, and
finds real text even when the query word does not occur in a verse. These are
examples, not exhaustive lists or historical verdicts.

For broader online questions, one bounded OpenAI request rewrites the question
into up to three search phrases. The server resolves those phrases against
actual packaged scripture, editorial records, reference aids and Story summaries.
Model-generated verse numbers or URLs never become app citations. The second
OpenAI request receives selected public app sources and performs web search.

This is query expansion plus grounded retrieval, not an embedding/vector index.
It adds no embedding dataset or initial indexing bill. Broad semantic recall
depends on the rewrite and existing corpus search. One live acceptance question
has been verified; broader semantic recall still needs evaluation.
Curated offline concepts cover only the six subjects listed above.

## Privacy and trial limits

`POST /api/answer` accepts only `{query, edition}`. Extra fields, including
notes/history/context, are rejected. The server constructs public app context;
notebook content, prior chat, cookies, identity and device tokens are never
forwarded to OpenAI. The provider receives the submitted question and up to
eight public excerpts totaling 12,000 characters. User-entered private material
in an explicitly submitted question is part of that question.

The server uses the hidden runtime `OPENAI_API_KEY`. There is no client key or
new credential file. Responses request `store:false`; provider data-retention
policies still apply. No request/answer content is persisted in the new tables.

The trial fails closed unless an identity is allowlisted through runtime
`BIBLELENS_AI_ALLOWED_EMAILS` or `BIBLELENS_AI_ALLOWED_USERS`. Sites' verified
identity headers authorize web users. An approved email's first web request
registers its hashed Site identity in `ai_trial_users`, allowing that user's
unexpired paired devices. Changing the allowlist invalidates that enrollment.
Notes sync permission and revocation are preserved.

Atomic D1 reservations enforce 2 submissions per user per rolling minute,
20 per user per UTC day, and 100 across the Site per UTC day. Restarts and
multiple isolates cannot reset these ceilings. Failed requests consume their
reservation. A five-minute, per-user memory cache and in-flight deduplication
avoid repeated calls within an isolate; cross-isolate duplicates remain bounded
by D1. Records older than the current UTC day are deleted on the next request.

Each uncached submission makes at most two Responses requests using
`gpt-6-luna`: a 300-output-token query rewrite and an 1,800-output-token answer
with at most one `web_search` tool call and low search context. The shared
provider deadline is 25 seconds; the client waits at most 35 seconds. There are
no automatic provider retries. These are application limits, not changes to the
API account's financial settings or an exact dollar-spend guarantee.

Official documentation consulted:
[web search](https://developers.openai.com/api/docs/guides/tools-web-search),
[model](https://developers.openai.com/api/docs/models/gpt-6-luna),
[pricing](https://developers.openai.com/api/docs/pricing).
Web search is listed at $10 per 1,000 calls plus model tokens. Token use and
failed/aborted requests can affect charges; the API billing account is the
source of truth. Automated provider tests use mocks. The separate live canary
submitted one real question: 8,613 input tokens, 333 output tokens and one web
search call. Its estimated cost is $0.01103 at the consulted published rates;
the account invoice was not accessed.

## Release handoff

The prior published build 426 and canonical source matched before staging.
Build 427 was prepared from one clean committed source for web and native.
Sites version 418 uses environment revision **2**, retaining the existing hidden
`OPENAI_API_KEY` and the verified owner's secret trial allowlist. The key value
was never read or changed. Both generated additive migrations were applied.

The live owner question, real app links, web PDF, mobile layout, usage record
and anonymous rejection were verified. Device installation is coordinated
separately. Signed assets and live online access from a paired physical device
remain unverified. Do not broaden access before Kevin revisits public billing.

## Validation

`npm run check:combined-search` exercises real SQLite migrations and quotas,
authorization and paired devices, policy revocation, safe links, public context
bounds, semantic planning fixtures, caching, failures/timeouts, client privacy
and offline behavior. It also exercises the real built lazy Worker route and
five concept searches against the packaged corpus. Provider replies are mocked.

`node scripts/check-combined-search-browser.mjs` tests the built UI at 320, 390,
820 and 1440 pixels with a mocked provider and no external browser traffic.
It checks no paid request while typing, one request per deliberate submission,
app-first ordering, inline citations, stale-result removal and default Chat.
Kevin's exact query, "show me examples of miracles", is checked against real
verse text and opens a real app passage in the browser. An unsupported question
is checked with no app sources; invented app citation IDs are rejected. A
qualified question cannot silently receive the general concept example set.
Original book scope is retained when model query rewrites are resolved.

The combined browser tests passed in Chromium at 320, 390, 820 and 1440 pixels.
The existing search browser suite also passed on web at those widths and on the
offline native bundle at 390 and 820 pixels. WebKit was not run. Native build,
offline worker checks, sync checks and release packaging checks passed. These
are local tests. The separate hosted-provider canary is recorded above;
signed-device installation remains pending.

The baseline 50-search suite returned useful results for all 50 queries and
matched at least one expected target in 48. It retrieved 114 of 160 expected
targets; this is not a claim of perfect semantic recall.
