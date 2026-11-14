# General meaning-based app retrieval

This is staged work after build 428. It is not published and has not yet been
measured with real model plans. Do not describe the mock tests as evidence of
broad semantic recall.

## General method

The old online planner produced three phrases, which went back through a word
matcher. Its context collector could then add unrelated matches. Build 428's
local correction covered one subject; that did not change this general limit.

The new planner suggests up to eight short passage ranges, three search phrases
and three topical-index headings. It does not supply source URLs or final
citations. The server resolves each lead against the actual app corpus and
selected edition, respecting explicit references and book scope. Missing verses,
invalid ranges and unsupported headings are discarded. Topic headings resolve
through the existing attributed 5,322-entry Nave's index, not a new list of
special cases. Related editorial records and Stories come from real app links.

Only resolved public text receives an app citation ID. The answer model sees at
most eight sources and 12,000 excerpt characters. Source cards show the actual
app text cited in the answer. The earlier local word-match answer is replaced
after successful semantic retrieval; it is not presented as a competing answer.
While retrieval is pending, Chat says it is checking app context.

This is model-guided retrieval, not an embedding index. It has no corpus upload,
initial embedding bill, new account or new credential. The model can suggest
passages by meaning even when their wording differs from the question. It can
also miss obscure material or propose an irrelevant but real passage. Resolving
a verse validates its existence and text, not every claim made about it.
Live relevance and negative-premise tests remain necessary.

Offline search and local private-note search keep the existing corpus and
transport. A general rendering correction now honors the existing person/place
intent order, instead of always putting incidental Scripture matches first. The
general model step requires deliberate online submission. It does not run on
keystrokes. A provider failure leaves local search available. The seven earlier
offline concept bridges remain, but the new online path does not depend on them.

## Privacy and cost boundaries

The client still sends only `{query, edition}`. Notes, chat history, cookies,
identity and device credentials never go to OpenAI. The server supplies public
corpus text. The hidden existing owner key is retained. No API financial setting
is changed.

Ordinary answers make at most two model requests: a planner capped at 600 output
tokens, then the existing 1,800-token answer with at most one web search. The
shared 25-second provider deadline, no-retry behavior, per-user cache, D1
reservations and ordinary 2/minute, 20/day user and 100/day Site ceilings remain.
`/api/retrieve` uses only the planner and app corpus, with the same ordinary
authentication and limits; it makes no web search.

## Real evaluation procedure

The existing expected targets stay unchanged in `docs/search-tests.json`.
The provider receives questions only, never expected results. The real build
428 baseline is saved in `docs/general-semantic-baseline.json`:

- 50/50 queries had a reviewed useful hit; 48/50 hit an original target.
- 114/160 original targets were returned; 34/50 returned every target.
- 26/50 had a useful result in the first five aggregate rows.

The actual local after-run is in `docs/general-semantic-local-after.json`:

| Measure | Build 428 | Staged local renderer |
| --- | ---: | ---: |
| Reviewed useful hits | 50/50 | 50/50 |
| Original targets returned | 114/160 | 114/160 |
| Useful result within first five rows | 26/50 | 45/50 |
| Person/place queries within first five | 0/14 | 14/14 |

Nineteen queries improved in rank. One, "noahs ark", moved from rank 1 to 2
and remained within the first five. This is a general entity-ordering fix,
not evidence of improved semantic recall: the returned target set is unchanged.
The after-score for **real model-guided retrieval remains pending**, rather
than inferred from hand-authored plans. These are retrieval measurements, not
answer-accuracy or precision scores.

The runtime key is not available to local scripts. A bounded owner evaluation
is therefore implemented for a coordinated test deployment:

1. Deploy the reviewed code with the existing owner-only AI allowlist. Keep the
   public reading audience unchanged. Temporarily set
   `BIBLELENS_AI_EVALUATION_ENABLED=1`; this is an application test switch,
   not an API billing setting.
2. As the approved owner, open `/retrieval-evaluation.html`. Each explicit click
   runs the next five fixed public benchmark questions. Wait a minute between
   groups. The endpoint rejects arbitrary questions, extra fields, native
   callers and calls when the switch is absent.
3. The fixed `semantic-v1` case IDs permit at most 50 paid planner requests
   across the Site for this evaluation, once per case, including failures.
   Persistent reservations survive restarts and normal daily cleanup. A separate
   five/minute evaluation ceiling applies. The ordinary user allowance is
   preserved; the shared 100/day Site ceiling still counts evaluation requests.
   There are no web calls, generated answers or automatic retries.
4. Download the recorded results. Run:
   `node scripts/score-semantic-retrieval.mjs docs/general-semantic-baseline.json <downloaded-results.json> <report.json> docs/general-semantic-local-after.json`.
   The report scores actual returned ranges and record IDs against unchanged
   targets and identifies failed retrievals. It distinguishes the added semantic
   cards from the measured local results and reports semantic-only target hits
   separately. Adding candidates changes the budget;
   the comparison must not be called a constant-budget ranking improvement.
5. Inspect results by category, especially unsupported premises, unknown actors,
   ambiguous names and missing-edition verses. Run separate live natural-language
   questions beyond the test set and inspect cited app text. Then disable the
   evaluation switch. Coordinate any release claim and device update with the
   parent; do not claim broad success from useful-hit counts alone.

At the consulted [model pricing](https://developers.openai.com/api/docs/models/gpt-6-luna),
50 bounded planner requests should cost below $0.10. Actual token usage is
recorded, and the invoice remains the source of truth. No real API requests have
been made for this staged implementation.

## Automated checks

`check-semantic-retrieval.mjs` supplies ten explicit fake model plans across
independent subjects to test real corpus resolution. It covers missing verses,
editions, book scope, explicit-reference priority and malformed leads, plus the
evaluation flag, fixed cases, one-time reservations and rate ceiling. This tests
the resolver and safeguards, not the model's ability to generate those plans.

The existing privacy, auth, caching, quota, timeout, offline and Chromium UI
checks are adapted for semantic source cards, real range links, app-first order
and stale-result removal. Live model accuracy remains separately unverified.

Local verification passed: shared web/native build, combined-search and semantic
resolver safeguards, the unchanged-target 50-query evaluation, workspace state
and search, cloud sync isolation and disconnect handling, native offline checks,
and Chromium source-card/profile-order tests at 320, 390, 820 and 1440 pixels.
Provider replies in the automated tests were mocked. WebKit was not run. No real
API calls or new charges occurred in this implementation phase. Full release
preparation with a new shared build number remains part of the coordinated
deployment, followed by the real evaluation above.

The final resolver tests also require an empty semantic plan to yield no app
context, without inheriting a subject patch or raw-query commentary. Commentary
leads retain the original book scope and link to the actual app detail record.
The local browser test runs one evaluation group of five mocked planner calls
and verifies that an immediate second click makes no additional calls.

Reference-boundary checks also passed for precise verses, whole-chapter model
proposals and cross-chapter ranges. Resolved commentary retains its named
witness, limits and alternative reading before longer reasoning text.
