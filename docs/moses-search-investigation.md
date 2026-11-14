# Moses lifespan search investigation

Status: read-only investigation, 2026-11-14. No product code, runtime flags,
deployment, account settings, or billing settings changed. Paid testing remains
paused. This investigation made **zero real provider or web calls, costing $0**.

## Confirmed answer and reproduction

The app already contains Deuteronomy 34:7 in KJV, ASV and WEB. Each says Moses
was 120 when he died. Its exact app route is `#read/4/34/7`.

Tests exercised the self-contained Worker retained in
`.release/sites-mirror/dist/server/index.js`: published build 428, source
fingerprint `ba927ea485f20df8b2c8c0d619dc182cdd41d44143093b1283e5f4cee90ab141`.
Local reading/search calls ran in Node with external fetch forbidden. They did
not contact the live Site. The artifact and report contain public scripture only.

| Question | Published local answer | Correct verse among local answer citations | Correct verse among Library results |
| --- | --- | --- | --- |
| how long did Moses live | Exodus 19:13: trumpet sounding long; shall not live | No | No |
| How old was Moses when he died? | Deuteronomy 34:7, age 120 | Yes | Yes |
| What was Moses’s age at death? | Exodus 2:11, Moses grown | No | No |
| how long did Abraham live | Genesis 20:1, Abraham travelling | No | No |
| how old was Sarah when she died | Genesis 21:7, bearing a son in old age | No | Yes, below the first five |
| how old was Joseph when he died | Genesis 50:26, age 110 | Yes | Yes |
| how long did Joshua live | Joshua 9:13, a long journey | No | No |
| how old was Methuselah when he died | Genesis 5:27, age 969 | Yes | Yes |
| how old was Aaron when he died | Numbers 33:39, age 123 | Yes | Yes |

The 14-question diagnostic also covered Goliath's height, Joseph's sale price,
Judas's silver, rain during the flood, and the unsupported request for Jesus's
exact age at death. For the 13 questions with an explicit gold verse, that verse
appeared among local answer citations in 8/13 and Library results in 7/13.
These are **citation presence counts**, not answer accuracy: the flood query
led with Ezra's rain despite also citing Genesis 7:12. Jesus's age query led
with Job 14:8. It did not establish an age and should not be presented as an
answer. These small diagnostic counts do not replace the unchanged 50-query
baseline or establish broad semantic coverage.

None of these 14 exact questions overlaps the original 50-query baseline.
Headless Chromium at 320px and 390px also opened the published app's
`#read/4/34/7` route and rendered verse 7 with the age 120. Browser requests
were fulfilled directly from the local Worker; no external requests occurred.
This verifies the mobile web route, not installation or the native phone model.

## Root causes

1. **Local retrieval and ranking.** `worker/index.mjs` `questionTerms`,
   `enoughMatches`, `searchReply`, and `worker/answer-layer.mjs` `topicPassages`
   mostly match words and nearby windows. “Long” and “live” do not express a
   lifespan attribute to this matcher. Partial window matches can admit a verse
   whose actual subject differs. Topic fallback can accept one overlapping term.
   Library search and chat also rank/assemble passages differently. There is no
   general answerability check before quoting the first local hit.

2. **On-device answer grounding.** The phone can replace that local quote with
   an optional on-device model explanation (`src/device-local-ai.js`). Its
   `src/device-conversation.js` validator checks JSON shape, citation IDs and
   URLs; it does not check that a claim follows from the cited text. Supplying
   the actual three weak Moses sources and a synthetic answer “The Bible does
   not say how long Moses lived.” passes this validator. This demonstrates a
   possible path to Kevin's report; it does **not** prove his device produced
   that exact output. The deterministic local reproduction returned an
   irrelevant quote, not that sentence. No device model was run.

3. **Online context assembly.** Published online search first asks the provider
   for up to three short phrase rewrites and explicitly forbids verse numbers.
   The answer receives at most eight assembled app excerpts. With injected
   rewrites “Moses lifespan age” and “Moses length of life”, the actual published
   context omits Deuteronomy 34:7. With “Moses died years old”, it includes it
   as A5, after four irrelevant original-query sources. A model cannot cite an
   app excerpt that never reached it. Adding longer generic phrase lists alone
   does not fix this or the candidate budget's ordering.

4. **Citations and navigation.** `parseSearchResponse` turns supplied `[A#]`
   markers into app links. Provider web annotations remain web links, including
   Bible Gateway. Plain Bible reference text has no automatic app link. Some
   gathered app sources themselves use a chapter-only URL even when their
   label identifies a verse window. The parser neither requires a precise
   verse for a factual claim nor checks claim entailment. Injecting a
   chapter-only Bible Gateway annotation reproduces that external link
   unchanged. This is a verified implementation path; Kevin's original
   provider text, rewrite, and annotation are unavailable, so its exact cause
   cannot be established retrospectively.

## Staged general approach and demonstrated scope

The existing unshipped semantic branch permits model-proposed references,
topics and phrases, then resolves them against the actual packaged corpus.
For the injected reference `Deuteronomy 34:7`, the actual staged route supplies
that verse first as A1, its exact `#read/4/34/7` URL, the linked Moses comparison
and the real death-of-Moses story. A mocked `[A1]` answer renders the precise
app citation. All 13 positive gold-reference fixtures resolved their actual
app verse/text; an empty plan for Jesus's exact death age supplied no app
sources. The matching chapter routes returned the expected verse text.

Those tests verify **resolution and link provenance given a correct plan**.
They deliberately inject the gold references; they do not show that a real
model will find them. A proposed reference can also exist yet fail to support
the question. Source existence alone cannot establish relevance or truth.
The staged artifact used here has fingerprint
`469f93eb9e3f5810f0315eb3cab07adf7e508129a1a495456cdf874cf063ae55`.
It predates the source-only default-off pause gate and is not published.

Before release, the proposed global changes are:

- Rank resolved semantic passages before weak original-query matches. Keep
  local reading/search available offline; do not turn typing into paid calls.
  A broader offline semantic index would be separate work, with asset size,
  model choice, indexing and evaluation tradeoffs.
- Gate direct answers on evidence sufficiency. Return “I did not find a
  supporting passage” when retrieval fails. Do not let a small retrieved set
  justify “the Bible does not say.” Tighten the optional device explanation
  path too. Prompts and citation-ID checks alone do not prove entailment;
  extractive answers and evidence spans can reduce this risk for direct facts.
- Require exact app verse citations for scripture facts supported by app
  text. Preserve the original web citation's provenance; add a separate
  “Read in app” link only after resolving an explicit reference against the
  selected edition. A chapter-only web citation cannot safely supply an
  invented verse number. Chapter-window app sources should link to their
  actual verse range.
- Test entity/attribute and relation questions across people, dates, numbers,
  events, paraphrases, ambiguous requests, and unsupported premises. Keep the
  50-query targets unchanged, add a held-out factual-answer set, and measure
  app recall, top-rank relevance, claim support and exact-link correctness
  separately. Do not infer those from a single useful result.
- Consider making web lookup conditional when app text already answers the
  question. Published search currently requires one web search for every
  successful online answer. This is a proposed product/cost improvement,
  not a change made by this investigation.

No Moses-specific patch was added. Live planner recall, actual model answer
quality, and phone behavior remain unverified for this proposed approach.
The paid 50-query evaluation remains paused and the semantic feature remains
unpublished. Release requires the parent's coordination and a new release
identity after validation.

## Supporting evidence

`docs/moses-search-evidence.json` records public verse text, exact queries,
local results, citation URLs, mocked contexts and artifact fingerprints.
It separates local production observations from synthetic model responses.
There were 24 simulated provider responses and zero real requests.

Reproduction scripts and fuller local output are retained under the ignored
`.release/combined-search/` directory:

- `investigate-moses.mjs` — 14 local published-Worker cases; blocks networking.
- `investigate-moses-mocks.mjs` — five mocked online scenarios and the device
  answer-shape counterexample; in-memory SQLite, test-only key string.
- `investigate-moses-staged.mjs` — 13 injected correct-reference fixtures and
  one unsupported empty-plan fixture; in-memory SQLite and mocked provider.
- `investigate-moses-browser.mjs` — published reader route at two phone widths,
  with requests fulfilled directly from the local Worker.

The JSON report is retained as source evidence, while these historical-artifact
diagnostics are intentionally outside the normal test suite. Future regression
tests should assert the intended corrected behavior, not encode these defects
as acceptable behavior.
