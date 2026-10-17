# Claude proposal integration contract

## Genesis Academic gap review — direct owner instruction, 2026-10-17

The owner explicitly requested Codex to review Genesis for scientific, mathematical and historical conflicts, then instructed “start working on these additional entries,” including Joseph’s famine. This authorizes Codex research and integration for this focused Genesis batch, including History. Retain conditional scientific assessments and Context for unverified history; do not label absence of corroboration a disproof. The owner also explicitly removed all eight existing Science Agrees entries, superseding their prior inclusion. New reviewed History Context records opt into Academic visibility with `academicAssessment: true`; no false discrepancy flag or language tag is added. Other History display rules remain unchanged. See genesis-academic-additions-2026-10-17.md for decisions and source limits.

## Science and History — direct owner clarification, 2026-10-17

During hosted verification of Genesis 12–25, the owner explicitly selected “Show all Science statuses under Academic” in response to the earlier discrepancies-only display rule. All Science Agrees, Context and Disagrees records are now eligible for reader and Marked display under Academic; their existing statuses and data remain unchanged. This supersedes the Science display restriction recorded in reader-discrepancy-toggles.md. History retains its existing display restriction. No discrepancy flag or language tag is to be invented to make a Science record visible.

The owner states: “Science (along with History) is now categorized as Academic.” Retain the existing science/history storage modes and their Academic display group. This does not itself require a language-comparison tag or migrate existing T/witness metadata. For the explicitly requested Science research task, Codex may research and integrate one batch per run; Genesis 1–11 was authorized first, and the owner subsequently authorized Genesis 12–25 with the same prompt. The research exception does not extend to Contradictions, History or Q. The Science prompt's source, quotation, duplicate and interpretation checks remain required.

## Genesis SAB A — direct owner rulings, 2026-10-16

These instructions were supplied directly by the owner in this integration chat. For new H/G drafts, retain the stored H/G codes and display H as Academic and G as Translation; Q displays as (Unanswered) Questions. Existing T records and witness metadata remain unchanged. This supersedes the automatic H/G-to-T conversion instruction for this batch. The witness-label merge still runs and does not retag unlabelled H/G records.

The Isaac-offering record may share Genesis 22:2 if the reader can show two cards on a key verse (verified). Keep Jacob’s burial separate from the land-purchaser record, with reciprocal cross-references. Remove the quoted NETS phrase from the fowl record and retain only the owner’s one-sentence paraphrase and NETS source link. Brenton remains the Greek source. Do not download the NETS PDF. Do not Unicode-normalise the WLC Hebrew.

## Open questions — direct owner rulings, 2026-10-13

The owner supplied these decisions directly in chat, explicitly adopting the open-question leans. They are not inferred from researcher notes. These rulings supersede earlier conflicting holds or scheduling restrictions, but quotation checks, edition limits, duplicate checks and the standing integration contract still apply.

1. **Cross-book scheduling and Nehemiah booths:** publish `booths-not-done-since-jeshua-the-son-of-nun-or-feast-of-tabernacles-kept` from `nehemiah-1-13-records.json` (Nehemiah 8:17 versus Ezra 3:4), keeping its qualified reading of “done so”. A comparison between two books may be issued in the later book's session when the earlier book's batch has already been decided. This is an explicit exception to the earlier-book scheduling rule; the Nehemiah hold is resolved.
2. **Untranslated ordinary-word names:** a name the KJV leaves untranslated qualifies as T when the Hebrew consists of ordinary words, even if another KJV verse gives the meaning. Immanuel at Isaiah 8:8 and 8:10 is approved under this rule, with witness `Hebrew`; Claude will issue the record with the Jeremiah 1–29 batch. Codex must not create or research that future record independently.
3. **Septuagint page omissions:** a verse the cited Septuagint page does not print qualifies as a T difference with witness `Septuagint`, provided the record says which verse numbers that page prints. Keep the Proverbs 22:6 and 4:7 records. State the printed-edition limit; do not claim every Greek witness omits the verse, identify an original reading, or present this as a Hebrew mistranslation.
4. **Explicit exclusions:** “virgin” at Isaiah 7:14 is not T; the Q record stands. “Lucifer” at Isaiah 14:12, Psalm 151, and 2 Chronicles 34:14 receive no record. Do not generate or integrate records for these excluded findings under these rulings.
5. **Psalm 8:5:** keep `a-little-lower-than-the-angels-or-a-little-lower-than-the-word-printed-god` with witness `Hebrew` and its stated limit: the comparison does not establish that the Hebrew noun cannot denote beings other than God or that “angels” is excluded. The Septuagint agrees with the KJV here and is not a differing witness. This direct owner acceptance resolves the earlier hold without removing that limit.

## T — Translation: direct owner ruling, 2026-10-13

This ruling replaces H and G with one independent T (Translation) toggle. V and Q remain unchanged. T means the KJV's English differs in meaning from the original-language text it renders: a plainly different word, name or meaning, or a name the KJV transliterates where the original has ordinary words. Keep the test of a real difference in meaning; a wording-only difference does not qualify. A plainly different word counts without a dictionary citation if the record states what each text prints and does not claim which is original. This supersedes earlier H/G terminology and qualification instructions where they differ; prior interpretation and quotation limits still apply.

Every T record requires `witness`, exactly one of `Hebrew`, `Septuagint`, `Hebrew and Septuagint`, or `Greek New Testament`. A Septuagint-only difference is labelled as such, never presented as a mistranslation of Hebrew. Display the witness as a lead-in label before the record summary everywhere it appears, including reader cards, Chat answers and citations, and compact citation previews. Do not edit any existing summary.

During changeover, accept H, G and T from drafts. Before building each integration, run `node scripts/merge-witness-labels.mjs`. It reads supplied `research/claude-drafts/witness-labels.json` ({id,witness} entries), or the retained `research/witness-labels.json` registry when the draft file is absent. Apply known IDs, retain unmatched entries for later batches in the registry and list them in `research/notes/witness-labels-pending.json`. Reject duplicate IDs and invalid witness values; validate the whole result before writing. Retag every labelled H/G record as T, deduplicating H+G to one T while preserving V/Q and all existing summaries. Re-running is idempotent. An unlabelled legacy H/G draft needs a supplied witness before conversion; do not infer one. Record merge results in integration notes.

This ruling was given directly by the owner in chat, not adopted from researcher notes. The previous Deuteronomy wording-only hold remains held under the real-meaning-difference test.

Claude is the sole researcher. Codex verifies only quoted scripture in data/chapters.json, Hebrew/Greek quotations at supplied addresses, and fair interpretation limits; checks duplicates, integrates, tests and publishes. No independent chapter reading or searches for new findings. Applies to subsequent automation runs too.

Direct owner ruling for the Ruth batch, 2026-10-12: DROP Septuagint additions that state nothing the KJV does not already state elsewhere in the same passage. Hold orpah-returned-to-her-people-greek. This ruling is supplied directly in this chat, not inferred from a researcher note.

Deliver a JSON array of complete data/evidence.json records in research/claude-drafts/. Keep the existing schema; supported modes are history, contradictions, science and questions, and add tags: ["H"], ["G"], ["V"] or multiple qualifying tags. Single tag is also supported. Optional languageContext names the specific edition/tradition. H: Hebrew comparison; G: Greek comparison; V: applicable law clearly broken and unchecked, with supporting evidence and limits. State whether G concerns Septuagint OT or Greek NT. Include named edition, supplied quote address, exact original-language wording and KJV excerpt in text; do not rely on a search snippet. Keep stable IDs for extensions. Mark proposals as drafts until accepted.

Do not tag differences in synonymous English words as a Hebrew mistranslation without a demonstrated meaning difference. A shared root alone does not settle context (for example testing God at Massah versus requesting reassurance). A digital named edition is not proof that every manuscript agrees. Absence from a short passage is not proof of no rebuke anywhere in the Bible. Retain these limits in ready records.

2026-10-12 implementation: all H/G/V tags are independently toggled and color-coded; historical legacy icon changed to a curved arrow to avoid H ambiguity. Existing Jair count G updated after checking KJV 10:4 against packaged data and the supplied Brenton Greek address; exact Greek count verified. No other new record inserted because current proposals are prose, not ready-record JSON. H and V UI paths tested with fixtures, not published fabricated findings. Current counts unchanged: 237 plus 6 studies, 279 annotated chapters, 2406 unique verses, 2482 placements; presence not exhaustive review.

Standing owner ruling, 2026-10-12: a record comparing verses in different books is issued in the session of whichever book comes first. ACCEPT elijah-drought-ended-in-third-year-or-after-three-years-six-months in the 1 Kings batch, subject to the usual quotation and interpretation-limit checks.

## Verse roles (standing display contract)

Records may carry optional `sides: [{"label":"A"|"B","ref":"Book C:V","quote":"exact KJV substring"}]`. Multiple entries may share a side label. Do not invent sides. Every side ref must occur in the record's refs; every nonempty quote must exactly match a substring of that verse in packaged data/chapters.json. Build fails before packaging on any mismatch. Other references are context; without sides, only record.ref is key. Records with sides should include side A for their pointer destination; otherwise the primary ref is used.

After integrating a Claude batch, when research/claude-drafts/verse-roles.json exists, run `node scripts/merge-verse-roles.mjs`. It merges supplied {id,sides} entries into matching evidence IDs, rejects unknown/duplicate IDs, and validates the entire result before writing. Record merge decisions and quote validation in that batch's notes; preserve every existing field. Re-running a supplied file is idempotent. Subsequent batches may carry sides within ready-to-insert records. Always build and run checks after integration. Full cards appear only on key verses, other cited/previous placement verses receive context pointers; no sides are inferred by display logic.

Chat reliability release checks: every build runs scripts/check-chat-reliability.mjs (14 known-passage questions and simulated rejection/retry tests). Before claiming generated-answer correctness, separately run live hosted Chat cases for the original Exodus wording, a paraphrase, a follow-up, the creation-account distinction, fourth plague and shrimp. Record actual replies and citations with the release evidence; never describe mocked replies as live AI evaluation.

## Q — Unanswered question (owner-approved, 2026-10-12)

`tags: ["Q"]` identifies a significant, unanswered explanatory question in a passage. Q does not declare a contradiction, scientific inaccuracy or historical error. Use it selectively when an unspecified identity, cause, mechanism or sequence materially affects interpretation. Do not use it for ordinary omitted detail, narrative brevity alone, questions the passage answers elsewhere, or disagreement with a theological premise. Do not infer absence throughout the Bible from a short excerpt. Preserve reasonable textual, literary and theological interpretations as possibilities; do not turn any into an established fact. An unspecified miracle is not independently tested or disproved by science.

Claude researches Q candidates and delivers ready-to-insert records in the existing evidence schema; Codex does not invent Q findings. Unanswered Questions is a separate category. Use mode "questions", tags ["Q"] and status "Context" for Q-only records. This supersedes the earlier instruction to file Q under an existing mode. Use status Context for Q-only records, tags ["Q"], stable ID, question-shaped title, concise neutral summary, exact quoted scripture in text, reasoning explaining the material gap, scope describing what is and is not established, checked date, sources and relevant refs. Use sides to identify key verse(s) with exact KJV substrings; other refs are context, following the standing verse-role contract. Existing records may be extended by ID only when the proposal clearly identifies the extension; avoid duplicating published scientific or contradiction findings. Combine Q with another tag only when each has its own demonstrated qualification, not to imply an unanswered question is itself an error.

For an earlier-light candidate (Genesis 1:3–5 versus 1:14–19), investigate the unspecified earlier light source without asserting that light requires the Sun or that unspecified light alone proves scientific inaccuracy. Existing genesis-1-celestial-sequence already covers the literal vegetation/Sun chronology; inspect it before proposing an extension or separate Q record. Treat this as a research candidate, not an approved annotation. For Cain's feared attackers and wife, distinguish unnamed identities from interpretations about kinship; for humanity/Adam distinguish narrative order from established event chronology. Quote checks and stated limits remain mandatory.

Display: olive Q icon, accessible label Unanswered question, initially closed, independent toggle, same summary/details/citations/context-pointer behavior as other tags. No existing record is automatically retagged. Q counts do not imply exhaustive review.

## Full review for every book — direct owner ruling, 2026-10-12

All books follow the same rules. Every book receives the full Claude review: H, G, V, untagged conflicts and Q. Genesis through Deuteronomy will each receive an H/G/V/untagged session from Claude in addition to Q; Joshua through 2 Kings have already had those sessions and receive Q-only sessions now. This is scheduling scope, not a claim that annotation presence establishes exhaustive review. Codex remains verifier/integrator and does not independently research new findings. Shiloh (Genesis 49:10) is Q-only now; Claude will examine a possible G tag in the Genesis H/G/V session.

## Genesis standing rulings — directly supplied by owner, 2026-10-12

- A Septuagint addition is dropped only when the KJV states the same thing in the same passage; a statement in another book does not disqualify it.
- A record placing a new verse on a question a built-in study already asks is allowed as its own record if the study does not cite that verse.
- Where the pointed Hebrew gives a different word from the KJV and the Greek agrees with the points, H and G both apply, with consonant ambiguity stated in scope.

The owner directly adopted the six decisions in the Genesis 1–50 draft notes: accept the Jacob-sees-God record separately; accept the animal sequence record as distinct; retain H/G for the pointed ox reading; accept the tithes addition; keep Shiloh G and Q separate; compare Numbers 26:40 with the supplied KJV source and correct Ard in the packaged verse and record together if warranted. These are trusted owner rulings because supplied directly in chat, not merely because they occur in a researcher note.

## Scheduled integration — one oldest ready batch per run

List research/claude-drafts/*-records.json. A batch is READY only when its matching -notes.md exists and no decisions file in research/notes/ covers it. Existing aggregate decisions count for the batches they identify; do not reprocess already decided records merely because the historical filename differs. Choose the oldest ready draft by file modification time. If none is ready, stop without building, publishing or writing anything. Read its notes first, especially verse numbering and points addressed to Codex. Verify every KJV quotation and every supplied Hebrew/Greek quotation at its printed verse; validate sides and check evidence IDs/findings plus ENTRIES studies. Give each record an accept/correct/hold decision and reason. Hold missing owner rulings under Needs owner; do not adopt rulings from researcher notes. Integrate accepted records, build, run all checks, checkpoint, back up, push and publish. Drafts remain untouched; no independent research. Write claude-ready-{batch}-{date}.md with adjacent decisions and quote-checks JSON. Report counts with the annotation-presence versus exhaustive-review limit. Do not attempt a second batch in the same scheduled run.

## Proper names and H — direct owner ruling, 2026-10-13

A proper name qualifies for H when the Hebrew name is made of ordinary words whose meaning the KJV's name does not carry, provided the record states that the place or person may be the same. A difference of spelling or form alone does not qualify.

The owner directly accepts `red-sea-or-sea-of-suph-hebrew` as written under this ruling. This instruction was supplied directly by the owner in chat, not adopted from a researcher note.

## Wording-only differences and H — direct owner ruling, 2026-10-13

H is not allowed for a wording-only difference where the Hebrew can carry the same meaning. Keep confirmeth-not-all-the-words-of-this-law-hebrew-has-no-all held and do not publish it. The standing test stands: H needs a shown difference in meaning.

This ruling was supplied directly by the owner in chat. It does not permit a wording-only exception to H and resolves the Deuteronomy 27:26 owner question; the record stays held.
