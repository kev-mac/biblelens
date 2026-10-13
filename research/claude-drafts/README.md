# Claude research sessions — standing instructions

Last updated 2026-10-12. Read this first in every new Claude session. It replaces the policy sections of `owner-policy-g-and-v-icons.md` where they differ.

## Roles

- **Claude:** sole researcher. Writes only in `research/claude-drafts/`. Never edits application files, `data/evidence.json`, the coverage audit, Git history or the hosted site.
- **Codex (ChatGPT app):** verifies quotes, integrates, builds, tests, publishes. Its contract is `research/notes/claude-integration-workflow.md` — read it; it defines the record format and the limits every record must keep.
- A full accuracy review by both tools happens when the project is finished. Until then, favour fewer, well-sourced records.

## Owner policy

- Scripture Lens is a **debate tool**.
- **Sources of truth:** Hebrew for the Old Testament, Greek for the New Testament. The Greek Old Testament (Septuagint) is a second ancient witness.
- The **KJV** is the translation compared against those. Do not build findings on ASV wording; ASV may be removed.
- **Tags**
  - **H** — the KJV differs in meaning from the Hebrew.
  - **G** — the Greek differs from the KJV. State "Septuagint" (Old Testament) or "Greek New Testament".
  - **V** — a law, statute or commandment clearly broken and clearly unchecked anywhere in the Bible, by someone under the Law at the time. Pre-Sinai acts and non-Israelites do not qualify. Acts God commands in the story are contradictions, not violations.
  - Untagged records are allowed for direct contradictions that involve no translation or law issue.

## What to propose

Only:

1. Direct wording contrasts between passages, or arithmetic that does not add up.
2. H, G or V cases that meet the tests above.

Do not propose: lists that are not stated to be exclusive, arguments from silence, ethical assessments, poetry read as science, agreement notes, or archaeology and dating without a primary publication you have opened.

## Limits Codex requires in every record

- Different English synonyms are not an H finding unless the meaning differs.
- A shared Hebrew or Greek root does not settle context.
- A digital edition is not proof that every manuscript agrees.
- No rebuke in the passage is not proof of no rebuke anywhere in the Bible — for V, check later books before tagging.

## Sources for original-language text

Fetch with a script, not a summarising web tool, so the wording is exact.

| Text | Address | Notes |
|---|---|---|
| Hebrew OT, Leningrad (WLC) | `https://bolls.life/get-text/WLC/{book}/{chapter}/` | JSON list of verse and text. Books numbered 1–66 (Joshua 6, Judges 7, Ruth 8, 1 Samuel 9) |
| Hebrew OT, Aleppo edition | same, with `HAC` | Consonants only; second witness |
| Greek OT, Brenton's Septuagint | `https://ebible.org/grcbrent/{CODE}{chapter, two digits}.htm` | e.g. `JDG13`. Has lettered extra verses. English: `https://ebible.org/eng-Brenton/…` |
| Greek NT | bolls.life with `TR`, `SBLGNT`, `TISCH` | Strip the Strong's numbers attached to words |
| KJV as packaged | `data/chapters.json` | gzip + base64 JSON per chapter, key `"{bookIndex from 0}:{chapter}"` (Judges = 6) |

Do not quote from bolls.life `LXX`: it serves dictionary forms, not the wording.

## Deliverables per session

1. `{book}-{chapters}-records.json` — a JSON array of complete records in the `data/evidence.json` schema, plus `tags` and `languageContext`. Copy the shape of the published record `jair-household-count-witness`. Each record's `text` must contain the KJV excerpt, the exact Hebrew or Greek wording, the named edition, and the address it was fetched from. Mark each `"status"` as the intended published value; say in the notes file that all are drafts until Codex accepts them.
2. `{book}-{chapters}-notes.md` — short. For each record: one line on why it qualifies. Then a one-line-each list of what was considered and ruled out, and any question for the owner.

Before writing, check `data/evidence.json` for existing IDs covering the same verses. Extend an existing ID instead of duplicating it.

## Keeping token use down

- One session per book.
- Do not print whole chapters into the conversation; search the packaged text for what you need.
- No open web searching unless a record needs an outside source.
- No long reasoning for rejected items.

## Backlog

Earlier prose drafts in this folder predate the record format. Codex has already adopted some of their findings. Before re-issuing anything from them, check `data/evidence.json` and the latest files in `research/notes/` to see what is published, then convert only what is still outstanding and still qualifies:

- `joshua-21-24-review.md`, `judges-3-5-proposals.md`, `judges-6-9-proposals.md`, `judges-10-12-proposals.md`
- `hebrew-greek-sourcing-1.md` — sourced wording for Joshua 7 to Judges 11 and Acts; the strongest unpublished items are the Balak verb (Joshua 24:9 / Judges 11:25), Genesis 48:22 "Shechem", Acts 7:14 against Genesis 46:27, and the KJV renderings at Judges 3:19, 5:26 and Joshua 22:34.

**Cleared 2026-10-12.** The outstanding items were re-issued as records in `joshua-21-24-records.json` and `judges-3-12-records.json`, with notes beside each. The prose drafts above are superseded; do not re-issue from them. `hebrew-greek-sourcing-1.md` §1.5 is wrong about the Leningrad Codex at Joshua 21:36–37 — see `joshua-21-24-notes.md`. Judges 13–21 is in `judges-13-21-records.json`. Ruth is in `ruth-1-4-records.json` (processed by Codex: 6 published, 1 held). 1 Samuel is in `1-samuel-1-31-records.json` (processed by Codex: 19 published, 3 held). 2 Samuel is in `2-samuel-1-24-records.json` (processed by Codex: 16 published, H held on one). 1 Kings is in `1-kings-1-22-records.json` (processed by Codex: 24 published, 9 with tag placement corrected). 2 Kings is in `2-kings-1-25-records.json`. Next book: 1 Chronicles.

Further sources used: the Unicode/XML Leningrad Codex with transcription notes, `https://tanach.us/Server.txt?Judg18:30-18:30` (book abbreviations `Josh`, `Judg`; a range is required).

## Owner rulings on V (2026-10-12)

1. A same-verb match is **not** enough for V. Gideon's fleece (Judges 6:39 against Deuteronomy 6:16) is not a V case.
2. An act the text never describes is **not** "clearly broken". Jephthah's vow (Judges 11:31, 39) is not a V case.
3. A narrator's general remark **does** count as a "check". Micah's image (Judges 17:3–6) is not a V case because of Judges 17:6.

Apply these to later books: V needs the act described, the law matched by more than a shared verb, and no disapproval from the narrator.

## Owner ruling on G (2026-10-12)

Do not propose a Septuagint addition that states nothing the KJV does not already state elsewhere in the same passage (Ruth 1:14 beside 1:15). A longer Greek text still qualifies when it adds something the KJV lacks entirely (Judges 16:13–14).

## Lessons from Codex's first integration (2026-10-12)

Codex accepted 22 of 25 and held 3; its reasons are in `research/notes/claude-ready-batch-2026-10-12.md`. Apply them to every later batch:

- **H needs a shown meaning difference.** If the record's own scope admits the Hebrew can carry the KJV's sense, or leaves the Hebrew meaning unresolved, do not tag H. Tag G if the Greek differs, or leave it out.
- **One Hebrew phrase rendered two ways by the KJV is not H** (Judges 15:19). A scribal marking that suggests another reading is not H either (Judges 18:30).
- **Every quotation must be at the address supplied.** The UXLC note-key definitions are at `Server.xml?…`, not `Server.txt?…`; supply both when quoting a key.
- **Same town is not same parcel, and a word search is not a whole-Bible check.** Do not lean on either.
- **Omit `tags` when there are none**; do not send an empty array.
- **Do not cite an owner ruling inside a record.** Codex only adopts rulings the owner gives it directly.
- **A failed V is not an untagged record.** If a law case misses the V test, drop it.

## Lessons from Codex's Ruth integration (2026-10-12)

Codex accepted 5 of 7 as written, corrected 1 and held 1; reasons are in `research/notes/claude-ready-ruth-2026-10-12.md` and its `-decisions.json`.

- **A G record compares wording; it does not prove the two texts are incompatible.** Codex narrowed `ruth-gleaning-rest-house-or-field` because "no rest in the field" does not rule out time in the house, and "now" could be evening. In `reasoning` and `scope`, say how both statements could stand, and do not call the difference a contradiction unless the two cannot both be true.
- **The additions ruling is now in Codex's contract.** `orpah-returned-to-her-people-greek` was held; do not re-submit it. A Greek plus still qualifies when it says something about a different actor or duty than the KJV states nearby (Ruth 4:5 beside 4:10 was accepted).
- **When the Greek agrees with the KJV against the Hebrew, tag H only and say the Greek agreement is not G** (Ruth 4:4, accepted).
- **Keep written/read (ketiv/qere) forms as background only** — quoted for completeness, never the finding.
- Codex checks only quotes and limits; it does not read chapters. Anything not in a record is not reviewed by anyone, so the notes file must keep saying which verses were compared.

## Notes from the 1 Samuel session (2026-10-12)

- Hebrew and Brenton verse numbers can run one ahead of the KJV (1 Samuel 21; also 24). `refs` take KJV numbers; quote the Hebrew number in `text`.
- Brenton's Greek omits whole verses (1 Samuel 13:1; 17:12–31, 55–58; 18:1–5). To make an omission checkable, state which verse numbers the cited page prints.
- When the Greek agrees with the Hebrew against the KJV, tag both H and G (2 Samuel 21:8, 21:19 — awaiting Codex's view).
- 2 Samuel 21:8 and 21:19 are already issued in the 1 Samuel batch; do not re-issue them in the 2 Samuel session.
- Held back from 1 Samuel to keep the batch small, quotes already sourced: Greek differences at 2:22, 6:19, 15:29 and 18:6.

## Lessons from Codex's 1 Samuel integration (2026-10-12)

Codex accepted 16 of 22 as written, corrected 3 and held 3; reasons are in `research/notes/claude-ready-1-samuel-2026-10-12.md` and its `-decisions.json`. 2 Samuel 21:8 and 21:19 are published.

- **Owner ruling, H and G together:** when the Greek agrees with the Hebrew against the KJV, tag both H and G. Confirmed.
- **Owner ruling, V:** a later verse that calls an act "not lawful" without condemning it does not by itself count as a check. But `david-shewbread-not-lawful` was still held, because the record limited its search for a rebuke to two passages. **A V record must state a whole-Bible check and what it covered.** If that check cannot be made and described, do not propose the V.
- **No claims about translators or print.** Do not say why the KJV translators chose a wording, and do not assert what is in italics in printed KJVs; the packaged text does not show italics. Say only what the three texts print.
- **No claims about what a character knew or meant** beyond the quoted words (`saul-asks-whose-son-david-greek-lacks` was corrected for this).
- **Quote every word the gloss depends on**, including a negation (`οὐκ` was missing at 1 Samuel 10:27).
- **Before calling a Greek plus new, read the KJV verses on both sides of it.** `saul-perfect-lot-greek-longer-prayer` was held: KJV 14:40 already had the two sides. Do not re-submit it without a narrower, demonstrated difference.
- **A bracketed gloss is not a KJV quotation.** Keep KJV wording in quotation marks and the researcher's glosses in square brackets, and never present one as the other.
- **If the scope has to concede that the two statements do not conflict, there is no record** — tagged or untagged (`samuel-saw-saul-no-more-then-naioth` held).

## Notes from the 2 Samuel session (2026-10-12)

- 2 Samuel is in `2-samuel-1-24-records.json` (16 records, no V).
- bolls.life book numbers: 2 Samuel 10, 1 Kings 11, 1 Chronicles 13. Packaged KJV index: 2 Samuel 9, 1 Chronicles 12.
- Samuel–Kings findings often rest on a Chronicles parallel. Fetch the parallel chapter in Hebrew and Greek too, and check `data/evidence.json` for the Chronicles verse as well as the Samuel one.
- For an untagged number conflict, still look at Brenton's Greek of the verse; if it sides with the other book, the record takes a G tag (5:25, 8:13, 24:13).
- `early-census-famine` was re-issued under its published ID with Hebrew, Greek and a G tag. Other early KJV-only records (`early-census-agent`, `early-saul-death`) were not re-checked against the Greek.
- 2 Samuel 19: Hebrew verse numbers run one ahead of the KJV (KJV 18:33 = Hebrew 19:1).
- Held back, quotes sourced: Greek pluses at 8:7 (Shishak) and 14:27 (Tamar and Rehoboam).

## Lessons from Codex's 2 Samuel integration (2026-10-12)

Codex accepted 15 of 16 as written and corrected 1; reasons are in `research/notes/claude-ready-2-samuel-2026-10-12.md` and its `-decisions.json`.

- **Owner ruling, reconcilable clashes:** a record is allowed when two statements clash as worded but could be reconciled by an event the text does not report (`absalom-three-sons-or-no-son` accepted). The scope must name the possible reconciliation and say the text does not report it.
- **A noun the KJV translates differently in the next verse is not enough for H** (`david-sons-and-ira-chief-rulers-or-priests`: H held, G kept). Repetition shows the word is shared, not what it means in that office. H was accepted where a verb for a plain act was rendered as a different act (5:21 "took" / "burned").
- **Place a tag only where it applies.** Codex removed G placements at verses where the Greek did not differ. Put in `appliesTo` only verses the finding is about, and say in `scope` at which verse each tag applies.
- **An extension must keep the published ID, title, status, mode and refs exactly** (`early-census-famine` accepted as a replacement on that basis).
- Untagged number conflicts with a Chronicles parallel were all accepted as written; keep that shape.

## Notes from the 1 Kings session (2026-10-12)

- 1 Kings is in `1-kings-1-22-records.json` (24 records, no V). Next book: 2 Kings.
- bolls.life book numbers: 1 Kings 11, 2 Kings 12, 2 Chronicles 14. Packaged KJV index: 1 Kings 10, 2 Kings 11, 2 Chronicles 13.
- **Brenton's Greek pages print lettered verses** (12:24a–z, 16:28a–h, 2:35a–o, 2:46a–l) whose HTML `id` repeats a later verse number. Split the page on the printed verse label, not the `id`, or text is attributed to the wrong verse.
- Brenton's Greek swaps 1 Kings 20 and 21, follows the Hebrew numbers in chapters 4–5, and reorders chapter 7. Verse-number tables are at the top of `1-kings-1-22-notes.md`.
- Before calling a passage absent from the Greek, search the whole book: 14:1–20 is missing from Brenton's chapter 14 but a form of it stands at 12:24g–n.
- The HAC edition numbers 1 Kings 4–5 differently from WLC and was not used this session; WLC alone was quoted.
- Store Python on this machine cannot use the session scratch folders reliably (path length, redirected AppData). Work in a short folder under `%TEMP%\claude\`.
- Held back, quotes sourced: Greek differences at 7:15 (circumference), 8:53a, 10:28, 19:3; the Greek form of the Jeroboam's-wife story.
- `early-stalls` was not extended; reason in the notes file.

## Lessons from Codex's 1 Kings integration (2026-10-12)

Codex accepted 15 of 24 as written and corrected 9; none held. Reasons are in `research/notes/claude-ready-1-kings-2026-10-12.md` and its `-decisions.json`.

- **All 9 corrections were tag placement.** In a tagged record, `appliesTo` must list only the verses where the tag itself applies — not the other side of the conflict and not context verses. A G that rests on the Greek of Kings goes on the Kings verse only; the Chronicles verse stays in `refs`.
- **`ref` must be a tagged verse.** Codex moved the primary `ref` to the tagged verse where the draft had pointed at an untagged one (`omri-…`: 16:23 → 16:29). In a tagged record, make `ref` the first entry of `appliesTo`.
- **Untagged conflicts keep both sides in `appliesTo`**; all were accepted as written.
- **Verse roles (`sides`) are now in Codex's contract** (`claude-integration-workflow.md`, "Verse roles"). A record may carry `sides: [{"label":"A"|"B","ref":"Book C:V","quote":"…"}]`. Every side `ref` must be in the record's `refs`; every `quote` must be an exact substring of that verse in `data/chapters.json`, or the build fails. Include side A for the verse `ref` points to. Supply `sides` only where the record really has two sides; validate each quote by script before delivery. Sides for already-published records go in `research/claude-drafts/verse-roles.json` as `{id, sides}` entries — not yet written.
- Only the side verses and `ref` now show a full card; other `refs` show a pointer. So `refs` can stay generous, but `sides` must be exact.

## Notes from the 2 Kings session (2026-10-12)

- 2 Kings is in `2-kings-1-25-records.json` (27 records: 12 G, 1 H, 14 untagged, no V; 24 carry `sides`). Next book: 1 Chronicles.
- bolls.life book numbers: Isaiah 23, Jeremiah 24, Hosea 28, Zephaniah 36, John 43. Packaged KJV index is one less.
- 2 Kings 12: Hebrew and Brenton's Greek run one verse ahead of the KJV. Brenton's Greek numbers Jeremiah 36 as chapter 43, and its Jeremiah 52 page lacks verses 2, 3, 15 and 28–30.
- 2 Kings 25 repeats in Jeremiah 52, and 2 Kings 18–20 in Isaiah 36–39. The Jeremiah 52 conflicts (52:12, 22, 25, 28, 31) and Isaiah 39:2 are issued here; do not re-issue them in those books' sessions. Isaiah 36–38 was not compared with 2 Kings 18–20 verse by verse.
- Records already issued that rest on Chronicles verses: 2 Chr 21:17, 22:1, 22:2, 22:8, 22:9, 24:14, 24:25, 28:1, 28:20–21, 34:22, 35:23–24, 36:9, 36:10. Check `data/evidence.json` before proposing anything at these in the Chronicles sessions.
- A tagged record whose tag sits on the other book's verse takes that verse as `ref`; the 2 Kings verse stays in `refs` and `sides`.
- `early-ahaziah` was re-issued as an extension with `ref` kept and `appliesTo` narrowed to the tagged verse; left for Codex to settle.
- A command line long enough to hold a whole build script fails on this machine (ENAMETOOLONG). Write scripts to files under `%TEMP%\claude\` and run them.
- Held back, quotes sourced: Greek pluses and differences at 2 Chr 36:8 (Jehoiakim's burial), 2 Chr 21:17, 2 Kings 1:18b–d, 2 Chr 36:2a–5d, 2 Kings 3:19.

## Q — Unanswered question (new category, 2026-10-12)

Approved by the owner through Codex's prompt (`outputs/Claude-Q-Research-Prompt.txt`) and now in Codex's contract (`claude-integration-workflow.md`, Q section). Read that section before proposing any Q.

- **Q** marks a material gap in a passage's explanation: a consequential identity, mechanism, cause or sequence the text leaves unstated. It is not a verdict of contradiction or scientific error.
- Exclude trivial missing details, questions answered elsewhere, and gaps that exist only if one interpretation is taken as fact. Do not infer Bible-wide silence from an excerpt: state the check actually made and call a word search a word search.
- Record shape: `mode: "questions"`, `tags: ["Q"]`, `status: "Context"`, a question-shaped title, exact KJV quotations, `sides` on the key verses, hypotheses named as readings and not asserted. Combine Q with another tag only when each qualifies by itself.
- File names: `{book-or-batch}-q-records.json` and `-q-notes.md`.
- First batch: `genesis-1-4-q-records.json` (3 records: the first-day light, Cain's feared attackers, Cain's wife). Check it and `data/evidence.json` before proposing a Q on the same verses.

## Owner ruling on Q (2026-10-12)

- **Every book session brings its own Q candidates**, alongside H, G, V and untagged records. Put them in the same session's `{book}-q-records.json` and `-q-notes.md`.
- **All earlier books are to be reviewed for Q.** Backlog, one session per book, in order: Genesis (chapters 1–4 done in `genesis-1-4-q-records.json`; 5–50 outstanding), Exodus, Leviticus, Numbers, Deuteronomy, Joshua, Judges, Ruth, 1 Samuel, 2 Samuel, 1 Kings, 2 Kings. Mark each done here when its file is written. These are Q-only sessions: do not re-open H, G or V for those books.
- **Unanswered Questions is its own category**, beside Science, History and Contradictions; Q is its visible tag. Q-only records take `mode: "questions"`. This supersedes the earlier instruction (in Codex's prompt and in the Q section of `claude-integration-workflow.md`, until Codex updates it) to file Q under one of the three existing modes. Relayed by the owner from Codex, 2026-10-12.
- Do not move an established scientific discrepancy or contradiction into `questions` merely because it raises a question. A record that qualifies as both keeps its own mode and may add the Q tag only if Q qualifies by itself.
- Codex has not yet implemented `mode: "questions"`; Q drafts wait for that. `genesis-1-4-q-records.json` was corrected to the new mode with nothing else changed.

## Open questions for the owner

- None outstanding from 1 Samuel; both were answered (see above).
- From 2 Samuel: answered — such records are allowed (see the 2 Samuel lessons).
- From 1 Kings: answered — see "Owner ruling on records spanning two books" below.
- From 2 Kings: should a session write `verse-roles.json` (sides) for the published records?
- From the Q batch: both answered — see "Owner ruling on Q".

## Owner ruling on records spanning two books (2026-10-12)

A record that sets a verse in one book against a verse in another is issued in the session of **whichever book comes first**, not held for the later book. This includes Old Testament records that rest on a New Testament verse (`elijah-drought-ended-in-third-year-or-after-three-years-six-months`, 1 Kings 18:1 against Luke 4:25 and James 5:17). Fetch and quote the other book's original-language text in the same session. In the later book's session, find the record in `data/evidence.json` and do not re-issue it.
