# Codex task: research and draft Science records for BibleLens, book by book

You are Codex for BibleLens (formerly ScriptureLens; use "BibleLens" in new text, but do not rename existing backup files or historical notes). For this task only, the owner has asked you to act as researcher as well as integrator for the **Science** category, doing for science what Claude did for Contradictions. Claude's standing rule that Codex does no independent research applies to Contradictions, History and Q, not to this task. Everything else in `research/notes/claude-integration-workflow.md` and every standing owner ruling in it still applies. If a ruling there conflicts with this prompt, stop and list the conflict under **Needs owner**.

## What Science records are

A Science record sets a specific claim a passage makes about the natural world beside what current, citable science says. The reader decides what to make of it. The existing `mode: "science"` records in `data/evidence.json` (29 today) are the model; read all of them first, especially `joshua-prolonged-daylight`, `science-sky-dome`, `genesis-1-celestial-sequence`, `numbers-quail-plague-diagnosis-limit` and `deuteronomy-forty-days-no-water`.

Status values in use: `Agrees`, `Disagrees`, `Context`. Use `Disagrees` only when a literal reading of the stated claim conflicts with the cited science. Use `Agrees` only when the passage states an observation the cited science supports. Use `Context` when the passage gives no mechanism, the science cannot test the claim, or the reading decides the answer.

## Method (the same as for Contradictions)

1. Work one book, or one part of a long book, per batch, in canonical order starting at Genesis. Name the batch `<book>-<chapters>`.
2. Read the packaged KJV of the whole range from `data/chapters.json` (gzip + base64 JSON per chapter, key `"{bookIndex from 0}:{chapter}"`). Find passages that state a checkable claim about nature: astronomy, earth and atmosphere, water, geology, plants, animals, human biology, medicine, measurement, ordinary physical processes.
3. Before drafting, check `data/evidence.json` and `research/claude-drafts/` for records already on the same verses. Extend an existing ID instead of duplicating it. A side-by-side record on a verse a built-in study already covers is allowed only when it asks a different question.
4. For each candidate, find a **primary or authoritative scientific source you have actually opened** (NASA, NOAA, USGS, NIH/NLM, CDC, WHO, a university press textbook such as OpenStax, a peer-reviewed paper). Do not cite a source you have not read. Cite the page that supports the exact claim, not a site home page.
5. Draft the record. Then run the checks below.

## What to propose

- A concrete claim in the KJV text that science can address: an order of events, a number or measurement, a physical effect, a cause attributed to a natural process, an observed behaviour of an animal or plant, a medical description.
- Agreement is allowed when it is specific and supported. Do not pad with agreement notes.

## What not to propose

- Poetry or figurative language read as a science claim, unless a literal reading is the explicit point of the record and the record says so.
- Miracles as such. Science models natural processes; it cannot test an unspecified miracle. The record may state that the account gives no mechanism. It must not say a miracle is scientifically disproved or impossible.
- Archaeology, dating or history (that is History mode) and doctrinal or ethical assessments.
- Arguments from silence, and claims that need a source you have not opened.
- Anything where the Hebrew or Greek word is unclear and the science comparison depends on one meaning. Use tag `H` or `G` only if you actually compared the original (see Tags). Otherwise state the uncertainty in `scope`.

## Limits every record must carry

- Reconciling readings stay visible: figurative reading, phenomenological language ("the sun rose"), later visibility of something existing, or miracle. None is turned into established fact.
- The record compares what the text says with what the cited source says. It does not reconstruct events, assign dates, calculate physical consequences, or conclude that the passage is wrong or right as a whole.
- Science sources describe current models; say so where the model is contested or provisional.
- Different English synonyms are not an H finding unless the meaning differs. A shared Hebrew or Greek root does not settle context. A digital edition is not proof that every manuscript agrees.
- Annotation presence is not exhaustive review of the book.

## Record format

Match the existing science records and the schema in `data/evidence.json`: `id` (stable, kebab-case, new), `mode: "science"`, `ref`, `appliesTo`, `title` (neutral, usually phrased as a question or short label), `status`, `summary` (one or two plain sentences), `text` (exact KJV quotations in the form `KJV Genesis 1:11: “…”`, then the scientific statement and its source name), `reasoning`, `scope`, `sources` (each `{label, url}`; at least one KJV chapter address such as `https://ebible.org/eng-kjv/GEN01.htm` and at least one scientific source), `refs` (`{label, book, chapter, verse}`, book index from 0), `checked` (today's date), and `sides` (`{label, ref, quote}` using exact KJV substrings) only where the record sets two claims against each other. Add `fields` (branch entries with `branch`, `text`, `sources`) when the existing records of that kind do. Add `tags` and `languageContext` only per the Tags rule.

## Tags

Tag display names are Academic (H), Translation (G), (Unanswered) Questions (Q); V is unchanged. Stored codes stay H, G, Q, V unless the integration contract says otherwise. Add `H` or `G` to a science record only if you fetched the Hebrew (WLC, `bolls.life`) or Greek (Brenton `ebible.org/grcbrent`, or Greek NT) and the comparison changes what is being evaluated. Fetch with a script, not a summarising tool, so the wording is exact, and do not Unicode-normalise Hebrew text (it is in source order, not NFC); compare byte-for-byte. Do not use `V` or `Q` here.

## Checks before a record is accepted

1. Every KJV quotation in `text` and every `sides` quote is an exact substring of that verse in packaged `data/chapters.json`.
2. Every cited scientific URL was opened by you in this task and supports the statement attributed to it. Quote or closely paraphrase only a short phrase; do not copy passages from the source.
3. IDs are unique; `refs` book indexes, chapters, verses and labels are correct; source URLs are well formed.
4. No record asserts a history, a date, or a verdict on the whole passage.
5. Status matches the rule above, and `scope` names the main alternative reading.

## Deliverables per batch

1. `research/claude-drafts/<book>-<chapters>-science-records.json`: a JSON array of complete records.
2. `research/claude-drafts/<book>-<chapters>-science-notes.md`: for each record, one line on why it qualifies and what status it has and why; then a one-line-each list of candidates considered and ruled out; then any question for the owner under **Needs owner**.

Then integrate only the records that pass: add them to `data/evidence.json` preserving every existing field, run the full build and all checks including `scripts/check-chat-reliability.mjs`, and the side-validation step. Write `claude-ready-<book>-<chapters>-science-<date>.md` with adjacent decisions and quote-checks JSON, listing accepted, corrected and held records and the new counts. Checkpoint, back up (`BibleLens-checkpoint-<n>.zip` going forward), push and publish per the integration contract, then verify on the hosted site that one new record opens from its key verse, its citation preview matches the packaged KJV, and its sources open. Take a screenshot. Run live hosted Chat cases only if you claim anything about generated answers; never describe mocked replies as live evaluation.

## Pace and scope

Do one batch per run and stop. Favour fewer, well-sourced records over many. Hold anything uncertain under **Needs owner** and do not adopt a ruling from your own notes. First batch: Genesis 1 to 11, checking against the existing records `legacy-science-1` to `legacy-science-7`, `science-sky-dome` and `genesis-1-celestial-sequence` so nothing is duplicated.
