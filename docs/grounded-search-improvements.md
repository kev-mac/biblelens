# Grounded search improvements — local review

2026-11-14. Implemented on the isolated `dot/general-semantic-retrieval` branch.
**Not published, pushed, installed, or enabled in production. No real API or
web requests were made; cost was $0.** The paid evaluation remains paused.

## Changes

The existing staged semantic planner proposes references, phrases and topic
headings. The server resolves these against the actual app corpus and selected
edition before supplying context. This remains model-guided retrieval, not an
embedding index. It retains the existing source limits, privacy controls,
authentication, quotas, timeout, explicit-submit behavior and default-off gate.

The new answer protocol separates app excerpts from the model's web summary.
The server constructs the app section from validated quotations. A valid source
ID alone no longer permits a free model-written app claim. Scripture quotes
must contain complete verse lines or the complete supplied passage; altered
words, unknown IDs and incomplete fragments are discarded. If no quotation
passes, the app says supporting evidence was not found in this search. It does
not turn a failed search into a claim that the Bible is silent.

The optional on-device model also has an extractive contract. Its output must
match a complete supplied source. Otherwise the stored response remains in
place. Generic lexical and topic matches are labelled as related passages with
no established direct answer, and cannot be overwritten by device paraphrases.
This trades fluent generated app prose for checkable text.

There is also a general offline lifespan relation lookup. It recognises several
question forms and checks the named subject, age/total-life wording and death
context against real verses. It uses the person index plus corpus candidates;
the person index is incomplete. It distinguishes a total lifespan from an age
at another event, years after an event, another person's age and broad imported
titles such as Lord or Son. No list of people and their ages was added to
production. Explicit nonfinite-duration passages can still be retrieved through
semantic plans without inventing a numeric age at death.

App chapter-window sources now link to their actual verse ranges. If a verified
quote selects one verse from a resolved range, its citation links to that verse.
Web links retain the original publisher URL and Web attribution. Separately,
explicit web-text references can produce a **Read in app** link after actual
book/chapter/verse and edition validation. These reading copies are not labelled
as supporting app citations. Chapter-only, nonexistent and omitted-edition
references do not acquire invented verse links.

Only web paragraphs with usable inline source annotations are retained. Common
English whole-Bible absence claims are replaced with uncertainty. This is not
a semantic fact-check of the external page. Heading rendering also handles
headings split across citation/text parts; the browser regression caught that
additional cause of visible `###` markers.

## Measured results

Against the retained published build 428 artifact, the 24-question lifespan
diagnostic changed as follows:

| Measure | Published 428 | Current local code |
| --- | ---: | ---: |
| Expected verse among answer citations | 10/24 | 24/24 |
| Leading answer quotes the expected verse | 1/24 | 24/24 |
| Expected verse is first in Library scripture results | 1/24 | 24/24 |

All 11 uncertainty cases returned no invented lifespan answer, including Jesus,
Enoch, Job's years after an event, unknown names and cases needing additional
inference. Two positive names (Ishmael and Terah) and four uncertainty cases
(Miriam, David, Elizabeth and Rachel) were reserved until after the main rule
was implemented and passed without subject-specific production changes. The
other cases were used during development; this is a diagnostic set, not an
independent statistical estimate of general search accuracy.

The unchanged 50-query suite still has useful hits for **50/50**, first-five
useful hits for **45/50**, and **114/160** original expected targets. It still
completely satisfies only **34/50** cases. Those scores are unchanged from the
preceding staged ranking improvement. Do not attribute its earlier people/place
ordering gain to these new evidence checks.

Thirteen additional question/reference fixtures resolve real app passages
across laws, narratives, parables, poetry and other subjects. Ten earlier
independent fixtures also pass. **Their plans are mocked and include known
references; they verify corpus resolution, not real model semantic recall.**
The new diagnostic's 23 simulated provider responses incurred no charges.
An additional end-to-end local answer test deliberately supplied the wrong
planner lead, Luke 3:23, for “how long did Moses live”. The real context builder
still supplied Deuteronomy 34:7 as A1, and the mocked answer returned the exact
WEB text and app link. Its two provider responses were simulated too.

## Validation and boundaries

Passed checks cover source IDs, complete quotations, changed words, fabricated
quotes, event-age confusion, absent evidence, explicit-reference precedence,
edition omissions, range precision, safe links, separate web attribution,
uncited paragraphs, common absence wording and a disabled semantic gate making
zero provider calls. Existing cache, SQLite quota, evaluation-cap, authentication,
native pairing, origin, privacy, failure and timeout tests also pass.

Chromium browser checks pass at 320, 390, 820 and 1440 pixels with mocked
provider responses. They cover local typing without online requests, deliberate
submission, app-first source cards, actual passage navigation, source labels,
formatted headings, stale-result clearing and evaluation-group controls.
Browser requests are fulfilled directly by the actual local Worker; Flow tabs
and downloads were untouched. WebKit and a physical device were not tested.

The new offline engine returns Moses's correct WEB verse and uncertainty for
Jesus's exact death age with networking forbidden. Reading, comparison,
concurrency, citation provenance, abort handling, workspace and note-sync
regressions pass. Native inference itself is not exercised.

The normal Windows `npm run build:mobile` reached successful staging but its
Python launcher failed (`spawnSync python3 EACCES`; the Windows execution alias
is unavailable). The standard staging script was subsequently run directly.
A separate PowerShell handoff validated all paths inside this checkout, kept
the previous generated bundles under `.release/combined-search/`, and installed
the staged assets into this worktree's `www` with rollback on failure. No native
SDK signing or device installation occurred. The unchanged Python swap audit
could not be run in this environment.

Remaining limits:

- No live provider behavior has been evaluated. Correct reference selection,
  relevance, the new response-format compliance and web summary accuracy remain
  unmeasured. The 50-query live evaluation is still paused and both runtime
  feature flags remain untouched.
- A verbatim quote can still be irrelevant, selective or require interpretation.
  Existence and quotation checks do not prove entailment or historical truth.
  Web citations identify provenance; they do not independently verify claims.
- Offline language understanding remains bounded. The lifespan lookup handles
  selected English forms and direct textual evidence. It does not calculate a
  lifespan from scattered dates or reign lengths, solve chronology, or provide
  general offline semantic retrieval across every subject. For example, David's
  age may be inferred from other statements; this lookup leaves that inference
  open rather than calling an unrelated age his final lifespan.
- The ordinary online legacy path remains unchanged while the semantic flag
  is off. The new semantic answer protocol must not be described as deployed.

## Review and release

Evidence is in `grounded-search-local-after.json` and
`grounded-search-50-query-after.json`; tests are in
`scripts/check-grounded-search.mjs` and existing combined/browser/mobile checks.
The original investigation and its public source evidence remain in
`moses-search-investigation.md` and `moses-search-evidence.json`.

`worker/answer-layer.mjs` implements the offline relation check;
`worker/index.mjs` supplies semantic context and validates app reading links;
`worker/combined-search.mjs` enforces the quotation protocol and web attribution;
`src/device-conversation.js` gates device output; and `src/combined-search.js`
renders split headings safely. No schema migration or new index service is
needed.

Generated bundles still carry the existing build number 428 for local testing.
Their current source, web and native fingerprints match:
`dae3f495ad068f1a39a00b211f0b93b25bd6b925e66329dd7086c614351caaf6`.
They are not a release candidate and must not replace the published build under
that identity. Before release, coordinate with the parent and video work,
compare current GitHub main and Site source, assign a new shared release number,
run the clean release preparation, and verify the exact web/native identities.
Do not resume paid testing without Kevin's new authorization.
