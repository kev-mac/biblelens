# Claude research sessions — standing instructions

Last updated 2026-10-14 (after the Revelation session; the plan is finished). Read this first in every new Claude session. It replaces the policy sections of `owner-policy-g-and-v-icons.md` where they differ.

## Roles

- **Claude:** sole researcher. Writes only in `research/claude-drafts/`. Never edits application files, `data/evidence.json`, the coverage audit, Git history or the hosted site.
- **Codex (ChatGPT app):** verifies quotes, integrates, builds, tests, publishes. Its contract is `research/notes/claude-integration-workflow.md` — read it; it defines the record format and the limits every record must keep.
- A full accuracy review by both tools happens when the project is finished. Until then, favour fewer, well-sourced records.

## Owner policy

- Scripture Lens is a **debate tool**.
- **Sources of truth:** Hebrew for the Old Testament, Greek for the New Testament. The Greek Old Testament (Septuagint) is a second ancient witness.
- The **KJV** is the translation compared against those. Do not build findings on ASV wording; ASV may be removed.
- **Tags** (H and G are replaced by T from 2026-10-13; see “Tag T replaces H and G” below)
  - **H** — the KJV differs in meaning from the Hebrew.
  - **G** — the Greek differs from the KJV. State "Septuagint" (Old Testament) or "Greek New Testament".
  - **V** — a law, statute or commandment clearly broken and clearly unchecked anywhere in the Bible, by someone under the Law at the time. **(Updated 2026-10-14: see “Owner ruling: V updated”.)** Pre-Sinai acts and non-Israelites do not qualify. Acts God commands in the story are contradictions, not violations.
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

3. **Sessions run on a timer** (owner instruction, 2026-10-12). The scheduled task `scripture-lens-next-book` in the Claude app fires every 30 minutes (at :05 and :35) and does one book, or one part of a long book, per run. **Do not call any scheduled-task tool from inside a run**: the app asks for an approval nobody is there to give, and the run hangs (this is what happened at the end of the Exodus run). Three files in this folder control the runs, and the task prompt says how to use them: `session-clock.txt` (last start time; a run stops if under 25 minutes have passed — owner limit: two sessions an hour), `running.lock` (a session is working; delete it on EVERY exit, including a quiet stop; a lock older than 60 minutes is treated as stale, because a session can die on a server error and leave it behind), and `ALL-DONE.txt` (every book is finished). None of them is a batch file. **Counting what Codex has not processed:** every batch up to and including `job-22-42-records.json` and its Q file has been processed (checked at the Psalms 1–41 session; the Psalms 1–41 batch was written then and not yet processed), whatever its decisions file is called (the Joshua and Judges batches share `claude-ready-batch-2026-10-12`, and the two Genesis Q batches share `claude-ready-genesis-q-2026-10-12`). Count only batches written after that, and count a book’s records file and its Q file as one batch. The owner is not watching: do not ask questions in chat. Never hold the runs for a question and do not send notifications; see “Owner instruction: do not hold the process up”. **2026-10-13 18:30:** Codex was rate-limited until about 9:15 PM, so the owner asked Claude to keep researching and shortened the gap to 15 minutes. The “Codex is behind” threshold was raised from two to twelve units for that reason. A server error (529) killed the 17:05 session and left a stale running.lock that blocked every run until it was deleted by hand; the lock now goes stale after 60 minutes. **2026-10-13 ~18:50:** the owner returned the pace to every 30 minutes (two sessions an hour) after trying 15. The “Codex is behind” threshold stays at twelve units while Codex is rate-limited.

## Keeping token use down

- One session per book. **Long books are split (owner instruction, 2026-10-12):** a book of more than 40 chapters is done in parts of at most 30 chapters at natural breaks, one part per session; Psalms in its five books (1–41, 42–72, 73–89, 90–106, 107–150). The first session on a long book writes the plan of parts here and does the first part only. Files are named by the chapters covered. A conflict between two parts is issued with the earlier part. Books this applies to: Psalms (150), Isaiah (66), Jeremiah (52), Ezekiel (48). Q-only backlog sessions are not split.
- Do not print whole chapters into the conversation; search the packaged text for what you need.
- No open web searching unless a record needs an outside source.
- No long reasoning for rejected items.

## Backlog

Earlier prose drafts in this folder predate the record format. Codex has already adopted some of their findings. Before re-issuing anything from them, check `data/evidence.json` and the latest files in `research/notes/` to see what is published, then convert only what is still outstanding and still qualifies:

- `joshua-21-24-review.md`, `judges-3-5-proposals.md`, `judges-6-9-proposals.md`, `judges-10-12-proposals.md`
- `hebrew-greek-sourcing-1.md` — sourced wording for Joshua 7 to Judges 11 and Acts; the strongest unpublished items are the Balak verb (Joshua 24:9 / Judges 11:25), Genesis 48:22 "Shechem", Acts 7:14 against Genesis 46:27, and the KJV renderings at Judges 3:19, 5:26 and Joshua 22:34.

**Cleared 2026-10-12.** The outstanding items were re-issued as records in `joshua-21-24-records.json` and `judges-3-12-records.json`, with notes beside each. The prose drafts above are superseded; do not re-issue from them. `hebrew-greek-sourcing-1.md` §1.5 is wrong about the Leningrad Codex at Joshua 21:36–37 — see `joshua-21-24-notes.md`. Judges 13–21 is in `judges-13-21-records.json`. Ruth is in `ruth-1-4-records.json` (processed by Codex: 6 published, 1 held). 1 Samuel is in `1-samuel-1-31-records.json` (processed by Codex: 19 published, 3 held). 2 Samuel is in `2-samuel-1-24-records.json` (processed by Codex: 16 published, H held on one). 1 Kings is in `1-kings-1-22-records.json` (processed by Codex: 24 published, 9 with tag placement corrected). 2 Kings is in `2-kings-1-25-records.json` (processed by Codex: 26 published, 1 held). Genesis is in `genesis-1-50-records.json` (H, G, V and untagged; processed by Codex: 20 published, 3 corrected). Exodus is in `exodus-1-40-records.json` and `exodus-1-40-q-records.json` (processed by Codex 2026-10-13: 19 of 20 published, 1 held; all 3 Q published). Leviticus is in `leviticus-1-27-records.json` and `leviticus-1-27-q-records.json` (processed by Codex 2026-10-13: all 12 and all 3 Q published, 5 corrected). Numbers is in `numbers-1-36-records.json` and `numbers-1-36-q-records.json` (processed by Codex 2026-10-13: all 15 and all 3 Q published, 5 corrected). Deuteronomy is in `deuteronomy-1-34-records.json` and `deuteronomy-1-34-q-records.json` (processed by Codex 2026-10-13: 10 of 11 published, 1 held; all 3 Q published). Joshua Q is in `joshua-1-24-q-records.json` (4 Q, all published, all corrected). Judges Q is in `judges-1-21-q-records.json` (4 Q, all published, 2 corrected). Ruth Q is in `ruth-1-4-q-records.json` (3 Q, all published, 2 corrected). 1 Samuel Q is in `1-samuel-1-31-q-records.json` (4 Q, all published, 3 corrected). 2 Samuel Q is in `2-samuel-1-24-q-records.json` (4 Q, all published, 2 corrected). 1 Kings Q is in `1-kings-1-22-q-records.json` (4 Q, all published, 2 corrected). 2 Kings Q is in `2-kings-1-25-q-records.json` (4 Q, all published, 2 corrected). The Q backlog is finished. 1 Chronicles is in `1-chronicles-1-29-records.json` and `1-chronicles-1-29-q-records.json` (processed by Codex 2026-10-13: all 16 and all 3 Q published, 7 corrected). 2 Chronicles is in `2-chronicles-1-36-records.json` and `2-chronicles-1-36-q-records.json` (processed by Codex 2026-10-13: all 14 and all 3 Q published, 6 corrected). Ezra is in `ezra-1-10-records.json` and `ezra-1-10-q-records.json` (processed by Codex 2026-10-13: all 11 and all 3 Q published, 4 corrected). Nehemiah is in `nehemiah-1-13-records.json` and `nehemiah-1-13-q-records.json` (processed by Codex 2026-10-13: 10 of 11 published, 1 held; all 3 Q published). Esther is in `esther-1-10-records.json` and `esther-1-10-q-records.json` (processed by Codex 2026-10-13: all 11 and all 3 Q published, 3 corrected). Job is done in two parts (see “Job: plan of parts”): Job 1–21 is in `job-1-21-records.json` and `job-1-21-q-records.json` (processed by Codex 2026-10-13: all 12 and all 3 Q published, 2 corrected); Job 22–42 is in `job-22-42-records.json` and `job-22-42-q-records.json` (processed by Codex 2026-10-13: all 13 and all 3 Q published, 4 corrected). Job is finished. Psalms is done in five parts (see “Psalms: plan of parts”): Psalms 1–41 is in `psalms-1-41-records.json` and `psalms-1-41-q-records.json` (processed by Codex 2026-10-13: all 13 and all 3 Q published, 3 corrected). Psalms 42–72 is in `psalms-42-72-records.json` and `psalms-42-72-q-records.json` (processed by Codex 2026-10-13: all 20 and all 3 Q published, 4 + 2 corrected). Psalms 73–89 is in `psalms-73-89-records.json` and `psalms-73-89-q-records.json` (processed by Codex 2026-10-13: all 16 and all 3 Q published, 4 + 1 corrected). Psalms 90–106 is in `psalms-90-106-records.json` (16 records) and `psalms-90-106-q-records.json` (3 Q), awaiting Codex. Psalms 90–106 was processed by Codex 2026-10-13 (all 16 and all 3 Q published, 10 + 1 corrected). Psalms 107–134 is in `psalms-107-134-records.json` (15 T records) and `psalms-107-134-q-records.json` (3 Q), awaiting Codex. Psalms 135–150 is in `psalms-135-150-records.json` (18 T records) and `psalms-135-150-q-records.json` (3 Q), awaiting Codex; this finishes Psalms. Proverbs is in `proverbs-1-31-records.json` (20 T) and `proverbs-1-31-q-records.json` (3 Q), awaiting Codex. Ecclesiastes and Song of Solomon are in `ecclesiastes-to-song-of-solomon-records.json` (20 T) and `ecclesiastes-to-song-of-solomon-q-records.json` (3 Q), awaiting Codex. Isaiah 1–27 is in `isaiah-1-27-records.json` (16 T) and `isaiah-1-27-q-records.json` (3 Q), awaiting Codex. Isaiah 28–39 is in `isaiah-28-39-records.json` (16 T) and `isaiah-28-39-q-records.json` (3 Q), awaiting Codex. Isaiah 40–66 is in `isaiah-40-66-records.json` (16 T) and `isaiah-40-66-q-records.json` (3 Q), awaiting Codex; this finishes Isaiah. Jeremiah 1–29 is in `jeremiah-1-29-records.json` (18 T) and `jeremiah-1-29-q-records.json` (3 Q), awaiting Codex. Jeremiah 30–52 is in `jeremiah-30-52-records.json` (16 T, 1 untagged) and `jeremiah-30-52-q-records.json` (3 Q), awaiting Codex; this finishes Jeremiah. Lamentations is in `lamentations-1-5-records.json` (17 T) and `lamentations-1-5-q-records.json` (3 Q), awaiting Codex. Ezekiel 1–24 is in `ezekiel-1-24-records.json` (18 T, 3 untagged) and `ezekiel-1-24-q-records.json` (3 Q), awaiting Codex. Ezekiel 25–48 is in `ezekiel-25-48-records.json` (25 T, 24 Septuagint and 1 Hebrew and Septuagint; 4 untagged) and `ezekiel-25-48-q-records.json` (3 Q), awaiting Codex; this finishes Ezekiel. Daniel to Hosea is in `daniel-to-hosea-records.json` (31 T, 30 Septuagint and 1 Hebrew and Septuagint; 1 untagged) and `daniel-to-hosea-q-records.json` (3 Q), awaiting Codex. Joel to Micah is in `joel-to-micah-records.json` (36 T, 3 untagged) and `joel-to-micah-q-records.json` (3 Q), awaiting Codex. Nahum to Malachi is in `nahum-to-malachi-records.json` (45 T, all Septuagint; 3 untagged) and `nahum-to-malachi-q-records.json` (3 Q), awaiting Codex; this finishes the Old Testament. Matthew is in `matthew-1-28-records.json` (27 T, all Greek New Testament; 15 untagged) and `matthew-1-28-q-records.json` (3 Q), awaiting Codex. Mark is in `mark-1-16-records.json` (36 T, all Greek New Testament; 11 untagged) and `mark-1-16-q-records.json` (3 Q), awaiting Codex. Luke is in `luke-1-24-records.json` (40 T, all Greek New Testament; 7 untagged) and `luke-1-24-q-records.json` (3 Q), awaiting Codex. John 1–21 is in `john-1-21-records.json` (49 T, all Greek New Testament; 6 untagged) and `john-1-21-q-records.json` (3 Q), awaiting Codex. Acts is in `acts-1-28-records.json` (57 T, all Greek New Testament; 9 untagged) and `acts-1-28-q-records.json` (3 Q), awaiting Codex. Romans is in `romans-1-16-records.json` (38 T, all Greek New Testament; 6 untagged) and `romans-1-16-q-records.json` (3 Q), awaiting Codex. 1 Corinthians to 2 Corinthians is in `1-corinthians-to-2-corinthians-records.json` (40 T, all Greek New Testament; 4 untagged) and `1-corinthians-to-2-corinthians-q-records.json` (3 Q), awaiting Codex. Galatians to 2 Thessalonians is in `galatians-to-2-thessalonians-records.json` (53 T, all Greek New Testament; 2 untagged) and `galatians-to-2-thessalonians-q-records.json` (3 Q), awaiting Codex. 1 Timothy to Hebrews is in `1-timothy-to-hebrews-records.json` (51 T: 50 witness “Greek New Testament”, 1 “Septuagint”; 2 untagged) and `1-timothy-to-hebrews-q-records.json` (3 Q), awaiting Codex. James to Jude is in `james-to-jude-records.json` (63 T, all Greek New Testament; 1 untagged) and `james-to-jude-q-records.json` (3 Q), awaiting Codex. Revelation is in `revelation-1-22-records.json` (48 T, all Greek New Testament) and `revelation-1-22-q-records.json` (3 Q), awaiting Codex; this finishes the plan.

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
- **Owner ruling, V:** a later verse that calls an act "not lawful" without condemning it does not by itself count as a check. But `david-shewbread-not-lawful` was still held, because the record limited its search for a rebuke to two passages. [Superseded 2026-10-14 by “Owner ruling: V updated”: a V record states the check actually made; a whole-Bible check is no longer required.] If the check actually made cannot be stated plainly, do not propose the V.
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
- **All earlier books are to be reviewed for Q.** Backlog, one session per book, in order: Genesis (**done**: chapters 1–4 in `genesis-1-4-q-records.json`, 5–50 in `genesis-5-50-q-records.json`), Exodus (**done**: `exodus-1-40-q-records.json`), Leviticus (**done**: `leviticus-1-27-q-records.json`), Numbers (**done**: `numbers-1-36-q-records.json`), Deuteronomy (**done**: `deuteronomy-1-34-q-records.json`), Joshua (**done**: `joshua-1-24-q-records.json`), Judges (**done**: `judges-1-21-q-records.json`), Ruth (**done**: `ruth-1-4-q-records.json`), 1 Samuel (**done**: `1-samuel-1-31-q-records.json`), 2 Samuel (**done**: `2-samuel-1-24-q-records.json`), 1 Kings (**done**: `1-kings-1-22-q-records.json`), 2 Kings (**done**: `2-kings-1-25-q-records.json`). **The backlog is finished.** Mark each done here when its file is written. For Joshua to 2 Kings these are Q-only sessions: do not re-open H, G or V for those books. Genesis to Deuteronomy also need H, G, V and untagged review — see "Owner ruling: all books follow the same rules".
- **Unanswered Questions is its own category**, beside Science, History and Contradictions; Q is its visible tag. Q-only records take `mode: "questions"`. This supersedes the earlier instruction (in Codex's prompt and in the Q section of `claude-integration-workflow.md`, until Codex updates it) to file Q under one of the three existing modes. Relayed by the owner from Codex, 2026-10-12.
- Do not move an established scientific discrepancy or contradiction into `questions` merely because it raises a question. A record that qualifies as both keeps its own mode and may add the Q tag only if Q qualifies by itself.
- Codex implemented `mode: "questions"` at 21:08 on 2026-10-12 (build validates it; workflow file and saved prompt updated to match). `genesis-1-4-q-records.json` was corrected to the new mode with nothing else changed and is awaiting Codex's quote check; no Q record is published yet.

## Notes from the Genesis 5–50 Q session (2026-10-12)

- `genesis-5-50-q-records.json` holds 7 Q records (sons of God 6:2; Canaan cursed 9:25; God's "us" 11:7 with 1:26 and 3:22; Melchizedek 14:18; angel of the Lord 16:10; three men at Mamre 18:2; Shiloh 49:10). Published by Codex (7 accepted, 1 corrected). Check it before proposing a Q on those verses, and in Exodus do not re-issue the angel-of-the-Lord question for Exodus 3:2–4; it is quoted there as context.
- A Q record's tagged `ref` must carry a side A, like any tagged record.
- Word searches: search case-sensitively and on the whole word. "Shiloh" matched "Taanathshiloh" (Joshua 16:6) until this was done.
- Typed Hebrew may not match the fetched text character for character because vowel and accent marks can sit in a different order. Compare under Unicode NFD and write out the edition's own characters.
- The chapters were not read in full; the notes file lists the verses read. Ruled-out items and non-Q items seen in passing are listed there.

## Lessons from Codex’s Genesis 1–50 integration (2026-10-12)

Codex accepted all 20 (17 as written, 3 corrected, none held); reasons are in `research/notes/claude-ready-genesis-1-50-2026-10-12.md` and its `-decisions.json`. The three delegated rules are now in Codex’s workflow file.

- **Being carried does not prove infancy.** `ishmael-…` had its age claim narrowed. Do not let a summary or reasoning imply that a Greek wording makes something physically impossible; state the two wordings and the ages.
- **Keep the paseq (׀) in Hebrew quotations.** The consonant-matching helper in `%TEMP%\claude\gen\build.mjs` dropped it at Genesis 28:9 and Codex restored it. Fix the helper so a stand-alone ׀ inside the quoted run is written out.
- The packaged KJV at Numbers 26:40 now reads “Ard”; Codex corrected the verse and the record together.

## Codex runs on a schedule (set 2026-10-12)

Codex integrates through a scheduled task in the ChatGPT app, not by hand. Each run takes the oldest batch whose `-records.json` **and** `-notes.md` both exist in this folder and which has no decisions file in `research/notes/`. So:

- **Write the notes file last.** Its presence tells Codex the batch is finished. Do not write a notes file for a batch that is still changing.
- Do not rewrite a records file after its notes file exists; Codex may already have taken it. Issue corrections as a new batch file.
- One batch per run, oldest first. A batch may wait for the next run; that is normal.
- Codex holds any record that needs an owner ruling it has not been given and lists it under "Needs owner" in its notes. Check for that list at the start of each session and bring it to the owner.

## Owner ruling: V updated (2026-10-14)

Given by the owner after the first full pass found no V record in 66 books. The owner's example of the intended standard: **a person under the Law clearly broke a specific commandment, and the Bible records no reproach or punishment from God.** (Examples the owner gave: David and the shewbread; Hezekiah’s Passover.) **No V check has been run under this rule yet. Do not run one until the owner says go.**

### The updated V test
A record qualifies as V when all of these hold:
1. **A specific law is identified** by verse (a commandment, statute or ritual rule), and the record says what it requires.
2. **The act is described** in the text, and it clearly breaks that law as worded. A shared verb or a similar theme is not enough; an act the text never describes is not clearly broken.
3. **The person was under the Law at the time:** an Israelite after Sinai. Acts before Sinai and acts by non-Israelites do not qualify (unchanged).
4. **No reproach or punishment from God follows.** All of these count as unchecked: silence, commendation, blessing, healing, or a pardon granted at the person’s request. These do count as a check: a rebuke or punishment from God; a rebuke by a prophet or by the narrator speaking for God; an evaluative remark by the narrator against the act (Judges 17:6 stands). **Reproach from other people does not count as a check.**
5. **The check is the one actually made, stated plainly.** The record says what was read: the passage and its chapter, the verses that cite or comment on the act (cross-references and a word search on the person and the key terms), and that this is not a reading of the whole Bible. The earlier requirement of a “whole-Bible check” is withdrawn: it could not be met and no record was ever possible under it.
6. **Acts God commands in the story** are contradictions, not violations (unchanged).
7. **Where a later text calls the act “not lawful”** and does not condemn it, that still does not count as a check (unchanged; this is the David case, Matthew 12:4).

### Two defaults the owner can overturn (logged in owner-questions.md)
- **An act the same texts argue was lawful is not “clearly broken”** (Jesus and the Sabbath, Matthew 12; Mark 2): not a V. Default stricter.
- **The exclusions for pre-Sinai acts and non-Israelites stay** (the Hebrew midwives, Exodus 1; Rahab, Joshua 2). Default stricter.

### When the owner says go
One dedicated session (or a few) collects every V candidate the notes files already name, applies this test uniformly, and issues V records with the statement of the check made. Candidates to start from: `david-shewbread-not-lawful` (1 Samuel 21:6, held earlier because its search was limited to two passages) and Hezekiah’s Passover (2 Chronicles 30:18–20 with Numbers 9:10–13). **Status: not started.**

## Session plan (owner-approved 2026-10-13)

One unit per session, taken in this order. A unit is a whole book, a part of a long book (at most 30 chapters), or a **group of consecutive whole books of one testament totalling at most 30 chapters** (owner instruction: group the short books). Every unit is a full review: T, V, untagged conflicts and Q. A grouped unit is one session and one pair of files (`{first}-to-{last}-records.json` and `-q-records.json`, with `-notes.md` and `-q-notes.md` written last); each record’s refs stay in their own book, and the notes list the verses compared per book. The T catch-up list (below) is done first. Mark a unit done here when its notes file is written.

- [x] psalms-107-134 (done 2026-10-13: `psalms-107-134-records.json` 15 T, `psalms-107-134-q-records.json` 3 Q; awaiting Codex). Psalms 107–150 is 44 chapters, over the 30-chapter limit, so Book V was cut at 134, the end of the songs of degrees.
- [x] psalms-135-150 (done 2026-10-13: `psalms-135-150-records.json` 18 T, `psalms-135-150-q-records.json` 3 Q; awaiting Codex; this finishes Psalms)
- [x] proverbs-1-31 (done 2026-10-13: `proverbs-1-31-records.json` 20 T, `proverbs-1-31-q-records.json` 3 Q; awaiting Codex)
- [x] ecclesiastes-to-song-of-solomon (done 2026-10-13: `ecclesiastes-to-song-of-solomon-records.json` 20 T, `ecclesiastes-to-song-of-solomon-q-records.json` 3 Q; awaiting Codex)
- [x] isaiah-1-27 (done 2026-10-13: `isaiah-1-27-records.json` 16 T, `isaiah-1-27-q-records.json` 3 Q; awaiting Codex). Isaiah plan of parts, set by this session: **1–27, 28–39, 40–66** (27, 12 and 27 chapters; each within 30).
- [x] isaiah-28-39 (done 2026-10-13: `isaiah-28-39-records.json` 16 T, `isaiah-28-39-q-records.json` 3 Q; awaiting Codex)
- [x] isaiah-40-66 (done 2026-10-13: `isaiah-40-66-records.json` 16 T, `isaiah-40-66-q-records.json` 3 Q; awaiting Codex; this finishes Isaiah)
- [x] jeremiah-1-29 (done 2026-10-13: `jeremiah-1-29-records.json` 18 T (17 Septuagint, 1 Hebrew: the Immanuel record), `jeremiah-1-29-q-records.json` 3 Q; awaiting Codex)
- [x] jeremiah-30-52 (done 2026-10-13: `jeremiah-30-52-records.json` 17 records (16 T, all Septuagint, 1 untagged), `jeremiah-30-52-q-records.json` 3 Q; awaiting Codex; this finishes Jeremiah. Plan of parts was 1–29, 30–52)
- [x] lamentations-1-5 (done 2026-10-13: `lamentations-1-5-records.json` 17 T (16 Septuagint, 1 Hebrew and Septuagint), `lamentations-1-5-q-records.json` 3 Q; awaiting Codex)
- [x] ezekiel-1-24 (done 2026-10-13: `ezekiel-1-24-records.json` 21 records (18 T, all Septuagint; 3 untagged), `ezekiel-1-24-q-records.json` 3 Q; awaiting Codex). Ezekiel plan of parts, set by this session: **1–24, 25–48** (24 chapters each).
- [x] ezekiel-25-48 (done 2026-10-13: `ezekiel-25-48-records.json` 29 records (25 T: 24 Septuagint, 1 Hebrew and Septuagint; 4 untagged), `ezekiel-25-48-q-records.json` 3 Q; awaiting Codex; this finishes Ezekiel)
- [x] daniel-to-hosea (done 2026-10-13: `daniel-to-hosea-records.json` 32 records (31 T: 30 Septuagint, 1 Hebrew and Septuagint; 1 untagged: Daniel 1:1 beside Jeremiah 25:1), `daniel-to-hosea-q-records.json` 3 Q; awaiting Codex)
- [x] joel-to-micah (done 2026-10-13: `joel-to-micah-records.json` 39 records (36 T, all Septuagint; 3 untagged: Joel 3:10 with Micah 4:3, Joel 2:28 with Acts 2:17, Micah 5:2 with Matthew 2:6), `joel-to-micah-q-records.json` 3 Q; awaiting Codex)
- [x] nahum-to-malachi (done 2026-10-14: `nahum-to-malachi-records.json` 48 records (45 T, all Septuagint; 3 untagged: Matthew 27:9 with Zechariah 11:12–13, Malachi 3:1 with Matthew 11:10, Zechariah 12:10 with John 19:37), `nahum-to-malachi-q-records.json` 3 Q; awaiting Codex; this finishes the Old Testament)
- [x] matthew-1-28 (done 2026-10-14: `matthew-1-28-records.json` 42 records (27 T, all witness “Greek New Testament”; 15 untagged), `matthew-1-28-q-records.json` 3 Q; awaiting Codex)
- [x] mark-1-16 (done 2026-10-14: `mark-1-16-records.json` 47 records (36 T, all witness “Greek New Testament”; 11 untagged), `mark-1-16-q-records.json` 3 Q; awaiting Codex)
- [x] luke-1-24 (done 2026-10-14: `luke-1-24-records.json` 47 records (40 T, all witness “Greek New Testament”; 7 untagged), `luke-1-24-q-records.json` 3 Q; awaiting Codex)
- [x] john-1-21 (done 2026-10-14: `john-1-21-records.json` 55 records (49 T, all witness “Greek New Testament”; 6 untagged), `john-1-21-q-records.json` 3 Q; awaiting Codex)
- [x] acts-1-28 (done 2026-10-14: `acts-1-28-records.json` 66 records (57 T, all witness “Greek New Testament”; 9 untagged), `acts-1-28-q-records.json` 3 Q; awaiting Codex)
- [x] romans-1-16 (done 2026-10-14: `romans-1-16-records.json` 44 records (38 T, all witness “Greek New Testament”; 6 untagged), `romans-1-16-q-records.json` 3 Q; awaiting Codex)
- [x] 1-corinthians-to-2-corinthians (done 2026-10-14: `1-corinthians-to-2-corinthians-records.json` 44 records (40 T, all witness “Greek New Testament”; 4 untagged), `1-corinthians-to-2-corinthians-q-records.json` 3 Q; awaiting Codex)
- [x] galatians-to-2-thessalonians (done 2026-10-14: `galatians-to-2-thessalonians-records.json` 55 records (53 T, all witness “Greek New Testament”; 2 untagged), `galatians-to-2-thessalonians-q-records.json` 3 Q; awaiting Codex)
- [x] 1-timothy-to-hebrews (done 2026-10-14: `1-timothy-to-hebrews-records.json` 53 records (51 T: 50 witness “Greek New Testament”, 1 “Septuagint”; 2 untagged), `1-timothy-to-hebrews-q-records.json` 3 Q; awaiting Codex)
- [x] james-to-jude (done 2026-10-14: `james-to-jude-records.json` 64 records (63 T, all witness “Greek New Testament”; 1 untagged: 2 Peter 2:15 “Bosor” with Numbers 22:5 “Beor”), `james-to-jude-q-records.json` 3 Q; awaiting Codex)
- [x] revelation-1-22 (done 2026-10-14: `revelation-1-22-records.json` 48 records (48 T, all witness “Greek New Testament”; 0 untagged), `revelation-1-22-q-records.json` 3 Q; awaiting Codex; this finishes the plan)

Greek New Testament units compare the KJV with the Greek (TR, SBLGNT, TISCH) and use witness `"Greek New Testament"`; the Old Testament quoted in the New is compared as the README’s cross-book rule says.

## Tag T replaces H and G (2026-10-13)

Owner decision. **New records use `tags: ["T"]` and never H or G.** V and Q are unchanged.

- **T (Translation):** the KJV’s English differs in meaning from the original-language text it renders: a plainly different word, name or meaning, or a name the KJV transliterates where the original has ordinary words. Still required: a real difference in meaning. A wording-only difference does not qualify (Deuteronomy 27:26). A plainly different word counts without a dictionary citation, provided the record states what each text prints and does not claim which is original. A word with a range of senses, where the KJV’s choice is inside that range, does not qualify. A proper name qualifies under the Red Sea ruling below.
- **`witness` field, required on every T record,** exactly one of: `"Hebrew"`, `"Septuagint"`, `"Hebrew and Septuagint"`, `"Greek New Testament"`. It says which original-language text differs from the KJV. The reader shows it as a lead-in label before the summary. **Do not put the label in the summary text.** A Septuagint-only difference is labelled as such; never describe it as a mistranslation of the Hebrew.
- Mapping from the old tags: Hebrew differs (the old H, including where the Greek agrees with the KJV) → `"Hebrew"`; only the Septuagint differs (the old G) → `"Septuagint"`; both differ → `"Hebrew and Septuagint"`; the Greek of the New Testament differs from the KJV → `"Greek New Testament"`.
- Tag placement is unchanged: `appliesTo` holds only the verses where the difference applies, and `ref` is the first of them. Say in `scope` at which verse the difference applies.
- `witness-labels.json` in this folder holds `{id, witness}` for all 277 existing H and G records, published and drafted. 255 published, 22 in drafts not yet integrated. Codex merges it by script and retags them T. Read by hand: `her-purification-or-their-purification-greek-new-testament` is the only Greek New Testament one; `exodus-family-counts` and `shechem-burial-land-purchaser` are Septuagint. It is not a batch file; leave it alone.
- **Summaries still to rewrite (not blocking):** `sisera-death-prose-and-song` and `moses-father-in-law-names` compare the KJV with the ASV and WEB; the policy no longer rests findings on ASV.

### T catch-up list (one session, before the next book)

Agreed with the owner 2026-10-13. These were left out under the stricter reading of H and are to be written as T records, each with its own sourced quotes. File name `t-catch-up-1-records.json` with `t-catch-up-1-notes.md` last. A session that finds this list not yet done does it as its unit of work, then marks it done here.

- Psalms 22:16 (“they pierced” against the Hebrew’s “like a lion”), `"Hebrew"`.
- Job 1:11 and 2:5 (“curse” where the Hebrew prints the verb for “bless”), and Job 3:8 (“mourning” against the Hebrew word for “leviathan”). Add T beside the existing Greek records; use new IDs, do not extend.
- Psalms 80:15 (“branch” against “son”).
- Psalms 84:6 (“Baca”, a name the KJV leaves untranslated), under the Red Sea ruling.
- Psalms 8:5 (“angels” against the Hebrew’s *elohim*). **State the limit:** *elohim* can mean divine beings and the Greek agrees with the KJV. Issue only if the scope can say what is different without claiming the KJV’s sense is impossible.
- Leave out: Psalms 74:8 and 75:6 (they depend on how the Hebrew word is understood).
- **Also re-judge every entry in `owner-questions.md` dated before the switch to T that was decided as “no H”** (for example Psalms 95:8 “Massah”, 100:3, 106:30 and the Psalms 73–89 and 2 Chronicles 34:14 entries). Apply the T definition above: issue a record where the original prints a plainly different word or name; keep leaving out wording-only differences and words whose range of senses covers the KJV’s choice. Record each outcome in the notes file, and mark the entry in the log as re-judged under T.
- Status: **done** (2026-10-13): `t-catch-up-1-records.json` (6 T records) and `t-catch-up-1-notes.md`. Awaiting Codex.

### Notes from the T catch-up session (2026-10-13)

- 6 T records: Psalms 22:16 (Hebrew), 8:5 (Hebrew; conditional, logged), 80:15 (Hebrew and Septuagint), 84:6 (Septuagint), Job 1:11 and 2:5 together (Hebrew and Septuagint), Job 3:8 (Hebrew and Septuagint). Four sit beside published Greek records on the same verses, as the list asked; Codex may fold them.
- Re-judged and still left out under T (do not re-issue, do not log again): Psalms 95:8, 100:3, 106:30, 74:8, 75:6, 2 Chronicles 34:14, and the “gods” verses 82:1, 82:6, 97:7, 138:1. The log entries are marked.
- Work folder: `%TEMP%\claude\tc1` (`head5.mjs` is `head4.mjs` with a `witness` field and the T file names; `tcb.mjs` holds the records). In a T record leave out side B unless the two verses word the matter differently; the context verse goes in `refs` only.
- A verse that has a written/read form (Job 1:21) breaks word-number quoting (`HW`); type the consonants with `H` instead.

## Chapter names (2026-10-13)

`chapter-names.json` in this folder holds a name for every chapter of all 66 books (1,189), written in an owner-led session for Codex to load into the reader. It is not a records batch and research sessions should leave it alone. Owner’s style rules, recorded in the file: title case; the most popular name where a chapter has one, even if it is an interpretation; each significant event named, in order, separated by semicolons, three at most; KJV forms of names.

## Owner instruction: do not hold the process up (2026-10-13)

The owner got no notification for either hold and said: “stop holding the process up.” From now on:

- **No holds and no notifications.** `HOLD.txt` is retired; delete one if found. An open question never stops a run.
- **Decide, log, carry on.** When Codex holds a record under “Needs owner”, or a candidate would need a new ruling, decide by the standing rules; where they do not settle it, take the stricter reading (the record stays held, the candidate is left out). Log it in `owner-questions.md` in this folder, newest first, with the question, what was decided and what the owner would tell Codex to decide otherwise. Add a one-line note here so it is not logged twice.
- `owner-questions.md` is a log the owner reads when they choose. It is not a gate and not a batch file.
- The only quiet stops left are: another session running, the 25-minute gap, Codex more than two books behind, and `ALL-DONE.txt`.

## Owner rulings: the open-question lean list (2026-10-13)

The owner replied “accept leans” to the eight open items in `owner-questions.md`. They are answered; do not log them again.

- **Names:** a name the KJV leaves untranslated qualifies as T when the Hebrew is made of ordinary words, even where another KJV verse (Matthew 1:23) gives its meaning. **Immanuel** (Isaiah 8:8 and 8:10) is to be issued as a T record with witness `"Hebrew"` in the first unit after Isaiah (a deferred item on that unit’s line in the Session plan).
- **“Virgin” (Isaiah 7:14):** no T; the KJV’s word is inside the Hebrew word’s range and the Q record stands. **“Lucifer” (14:12):** left out.
- **Verses a Septuagint page does not print:** a T difference with witness `"Septuagint"`, if the record says which verse numbers the cited page prints. Proverbs 22:6 and 4:7 stay. Do not issue further omissions from the list in the log.
- **Psalm 151:** no record (no KJV verse to place a tag on).
- **Psalms 8:5:** the record stays, with its stated limit.
- **Late cross-book records (replaces the earlier stricter note):** a record that compares verses in two books may be issued in the later book’s session if the earlier book’s batch is already decided. Codex is to publish the held booths record (Nehemiah 8:17 with Ezra 3:4).
- **2 Chronicles 34:14 (“a” for “the”):** wording only; left out.

## Owner ruling on wording-only H (2026-10-13)

Answers Codex’s “Needs owner” item in `research/notes/claude-ready-deuteronomy-1-34-2026-10-13.md`. The owner said no and sent the ruling to Codex directly. **Answered.**

- H is not allowed for a wording-only difference where the Hebrew can carry the same meaning. `confirmeth-not-all-the-words-of-this-law-hebrew-has-no-all` (Deuteronomy 27:26) stays held; do not re-issue it.
- The standing test stands: H needs a shown difference in meaning. A word the KJV has and the Hebrew lacks is not enough by itself.

## Owner ruling on H and proper names (2026-10-13)

Answers Codex’s "Needs owner" item in `research/notes/claude-ready-exodus-1-40-2026-10-13.md` (held: `red-sea-or-sea-of-suph-hebrew`). The owner accepted Claude’s recommendation and sent the ruling to Codex directly. **This item is answered; it is not a reason to hold the runs.**

- A proper name qualifies for H when the Hebrew name is made of ordinary words whose meaning the KJV’s name does not carry (“sea of suph” / “Red sea”), provided the record states that the place or person may be the same.
- A difference of spelling or form alone does not qualify.
- Do not re-issue `red-sea-or-sea-of-suph-hebrew`; Codex accepts the held draft under this ruling. Later books (Numbers, Deuteronomy, Joshua and others) also have “Red sea”: do not issue a new record for each; the Exodus record’s scope already says the name occurs elsewhere.

## Decisions delegated by the owner (2026-10-12)

The owner asked Claude to decide the open points of the Genesis batch by its own judgement of the project’s goals. They stand as rulings unless the owner changes them. Codex adopts them only when the owner relays them directly.

- **G, additions:** a Greek addition is dropped only when the KJV states the same thing **in the same passage**. If the KJV states it only in another book, the addition still qualifies (Genesis 14:20 beside Hebrews 7:2). Say in the scope where else the KJV states it.
- **Built-in studies:** a record that places a new verse on a question a built-in study already asks is allowed, as its own record, if the study does not cite that verse (Genesis 32:30 beside `seen`). Say in the scope what the record adds. A record that only repeats the study’s own verses is still a duplicate.
- **H on vowel points:** the pointed Leningrad text is the project’s Hebrew. Where the points give a different word from the KJV’s and the Greek agrees with the points, tag H and G, and state in the scope that the consonants alone would allow the KJV’s word (Genesis 49:6).
- **A Q record and a tagged record may share a verse** as two records (Genesis 49:10).
- **Typos in the packaged KJV:** quote as packaged and report to Codex; Codex corrects only where the source page differs from the package.

## Lessons from Codex’s Genesis Q integration (2026-10-12)

Codex accepted all 10 Genesis Q records (chapters 1–4: 3 as written; chapters 5–50: 6 as written, 1 corrected). Reasons are in `research/notes/claude-ready-genesis-q-2026-10-12.md` and its `-decisions.json`. All ten are published.

- **Do not write a sentence that reads as universal silence.** “None says what the angel of the Lord is” was narrowed to “These checked passages do not explicitly settle which of the named readings applies in Genesis.” Say what the checked passages do not settle, not what nobody says.
- A Q record may place its tag on verses in earlier chapters when the question is the same one (`god-speaks-as-us-addressees-unstated` kept 1:26 and 3:22).
- A New Testament verse that remarks on a gap without filling it does not answer the question (Melchizedek and Hebrews 7:3 accepted).
- Codex updates `data/evidence.json` while a Claude session is running. Re-read the latest `claude-ready-*.md` and re-run the overlap check just before writing the batch.

## Notes from the Genesis H/G/V session (2026-10-12)

- Genesis is in `genesis-1-50-records.json` (20 records: 12 G, 1 H+G, 7 untagged, no V; 13 carry `sides`). Awaiting Codex. Q was not re-opened.
- **No V is possible in Genesis**: every act is pre-Sinai.
- **The six built-in studies in `src/data.js` (`ENTRIES`) are not in `data/evidence.json`.** Check them as well before proposing: `seen` (Exodus 33:11, 33:20, 24:9–11; Numbers 12:8; Deuteronomy 4–5; John 1:18), `judas` (Matthew 27:3–8; Acts 1:18–19), `animals` (Genesis 1:20, 2:19), `plants` (Genesis 1:11, 2:5), `soldiers` (2 Samuel 24:9; 1 Chronicles 21:5–6), `birth` (Matthew 2:1; Luke 2:2). In the Exodus session do not issue “face to face” against “no man shall see me” as a new record; `seen` covers it, and `jacob-saw-god-face-to-face-or-no-man-hath-seen-god` (Genesis 32:30) is awaiting Codex’s view on the overlap.
- Verse numbers: Genesis 32 runs one ahead of the KJV in both WLC and Brenton. Brenton’s Numbers 26 orders the tribes differently (KJV 26:40 is printed 26:44).
- The packaged KJV prints “ard” without a capital at Numbers 26:40; reported to Codex. Quote the packaged spelling so that sides validate.
- Hebrew quotations are now found by typing the consonants only; the script matches them against the edition with points removed and writes out the edition’s own characters. Brenton’s written and read notes (`[… כ] (… ק)`) match as typed.
- Greek New Testament: quote TISCH (accented) and have the script confirm that TR has the same words; where it does not (Luke 3:36, Cainan and Cainam) quote both.
- Bolls.life book numbers: Luke 42, John 43, Acts 44, Galatians 48, 1 Timothy 54, Hebrews 58, James 59. Packaged KJV index is one less.
- **Deferred to the Exodus session, quotes sourced:** Exodus 12:40, where Brenton’s Greek adds “and in the land of Chanaan” (beside Genesis 15:13, Acts 7:6, Galatians 3:17).
- Held back, quotes sourced: Greek differences at 7:11 and 8:4 (twenty-seventh day), 46:22 (eighteen souls), 36:2 (Anah a son), 36:24 (“Iamin” for “mules”), 37:36 (“eunuch”), 11:13, 33:19; the longer Greek of 31:13 was ruled out.
- Work folder for scripts this session: `%TEMP%\claude\gen` (`build.mjs`, `orig.mjs`, cache of all 50 chapters in WLC and Brenton).

## Notes from the Exodus session (2026-10-12)

- Exodus is in `exodus-1-40-records.json` (20 records: 15 G, 1 H, 4 untagged, no V; 6 carry `sides`) and `exodus-1-40-q-records.json` (3 Q: the unnamed Pharaohs 1:8; the priests at Sinai 19:22; the Urim and Thummim 28:30). Awaiting Codex. Next book: Leviticus.
- The deferred Exodus 12:40 item is issued (`sojourning-430-years-in-egypt-or-in-egypt-and-canaan-greek`), with Genesis 15:13, Acts 7:6 and Galatians 3:17. Do not re-issue it in Acts or Galatians.
- Records issued here that rest on verses of later books — check `data/evidence.json` before proposing anything at them: Numbers 1:1 and 1:46 (the 603,550 used before the numbering), Deuteronomy 5:17–19 and Luke 18:20 (order of three commandments), Isaiah 40:28, Ezekiel 43:17 (stairs of the altar), Jonah 2:5, Hebrews 11:27, Leviticus 8:8, Numbers 27:21, Deuteronomy 33:8, Ezra 2:63, Nehemiah 7:65 (Urim and Thummim Q).
- Verse numbers: in Exodus 22 the Hebrew and Brenton’s Greek run one **lower** than the KJV (KJV 22:8 = 22:7). Brenton’s Greek reorders Exodus 36–39; KJV 38:26 is printed 39:3. Jonah 2 runs one ahead in the Hebrew.
- Bolls.life book numbers: Ezekiel 26, Jonah 32, Romans 45, Mark 41. Packaged KJV index is one less.
- The Hebrew helper now keeps a stand-alone paseq (׀) inside a quoted run (`%TEMP%\claude\exo\head.mjs`, function `H`). `head.mjs` holds the checked helpers and the final validation; `build.mjs` holds only the records. Copy both for the next book. `o.mjs` prints KJV, WLC, Brenton Greek and Brenton English for any verse and has the 66 ebible book codes.
- No Q was issued on Exodus 4:24–26: the published `exodus-zipporah` already states that gap. The Greek of those verses is a G record.
- The one H (`red-sea-or-sea-of-suph-hebrew`) rests on the meaning of a name; Codex was told it may hold it. Wait for its view before issuing H on other names.
- No V: pre-Sinai acts do not qualify, and the calf is rebuked. V for breaches of Exodus laws belongs to the book that tells the act.
- Held back, quotes sourced: Greek differences at 2:25, 4:16, 9:16, 25:5 (“blue skins”), 32:14; 1 Kings 9:26 (“the farthest sea”); Isaiah 40:28 (“shall not hunger”). The Greek order of Exodus 36–39 was not examined. Not pursued and still open: Hebrews 9:4 (the contents of the ark) against 1 Kings 8:9.
- The first Exodus session (22:43) ended before writing any file; this one reused its cache in `%TEMP%\claude\exo\cache` (all 40 chapters in WLC, Brenton Greek and Brenton English, plus parallels).

## Lessons from Codex’s Exodus integration (2026-10-13)

Codex accepted 19 of 20 main records (16 as written, 3 corrected, 1 held) and all 3 Q records (1 as written, 2 corrected). Reasons are in `research/notes/claude-ready-exodus-1-40-2026-10-13.md`, `claude-ready-exodus-1-40-q-2026-10-13.md` and their `-decisions.json`.

- **H on a proper name is held and waits for the owner.** `red-sea-or-sea-of-suph-hebrew` was held: a literal place-name etymology does not show a change of meaning when the English name may be the usual name of the same water. Codex listed it under “Needs owner”. Do not issue H on a name, or on an unexplained word treated as a name, until the owner answers (see the open questions).
- **Do not let a wording imply more than it says.** “Crushes wars” does not establish that the Lord never fights; “was refreshed” does not by itself mean recovered strength. State a tension as conditional on a reading.
- **A shared Greek verb does not settle context**, just as a shared Hebrew root does not.
- **Do not imply only one event** where the text may report two (Moses leaving Egypt).
- **In Q records, limit every absence claim to the passages checked.** Codex removed “every other garment item” and a whole-book exclusion. Write “these checked verses do not say”, never “the book never says”, unless the whole book was read and the notes say so.
- Identical totals do not establish one census; arithmetic bounds must state the condition they rest on. Both were accepted because the scope said so.

## Notes from the Leviticus session (2026-10-13)

- Leviticus is in `leviticus-1-27-records.json` (12 records: 9 G, 3 untagged, no H, no V; 3 carry `sides`) and `leviticus-1-27-q-records.json` (3 Q: the second lot “for the scapegoat” 16:8; which sabbath 23:11; the fiftieth year 25:10). Awaiting Codex. Next book: Numbers.
- Records issued here that rest on verses of later books — check `data/evidence.json` before proposing anything at them: Numbers 15:22 and 15:24 (the congregation’s offering), Deuteronomy 14:7, 14:19 and 14:20 (cud; flying creeping things), Jeremiah 7:22–23 (no command concerning burnt offerings), Luke 2:22 (“her” or “their” purification), 2 Kings 23:10 (context only), Joshua 5:11 (context only).
- Not issued and still open for later sessions: Amos 5:25 beside the wilderness sacrifices; Hebrews 9:4 against 1 Kings 8:9.
- No verse-number differences at the verses quoted. The Hebrew numbering of Leviticus 5–6 was not checked.
- Bolls.life book numbers: Leviticus 3, Numbers 4, Deuteronomy 5, Amos 30. It answers 429 when many requests are sent quickly: check addresses one at a time with a pause (`urls.mjs` in the work folder), not with `--urls` in `head.mjs`.
- A G record on the Greek New Testament where the Textus Receptus text agrees with the KJV and Tischendorf differs was issued (Luke 2:22) and flagged to Codex. Wait for its view before issuing another of that kind.
- Science items seen and not issued, because they are outside what Claude proposes: 11:5–6 (cud), 11:13–19 (the bat among fowls), 11:20–23 (four feet).
- Held back, quotes sourced: Greek differences at 21:4, 24:7, 26:30, 23:16, 12:3, 19:16.
- Work folder: `%TEMP%\claude\lev` (`head.mjs`, `build.mjs`, `o.mjs`, `urls.mjs`, `ov3.mjs` for overlap checks by verse, id or pattern; cache of all 27 chapters in WLC, Brenton Greek and Brenton English). Copy the folder for Numbers and change the book in `fetch.mjs` and the file names in `head.mjs`.
- Codex processed Exodus while this session was running and left a question for the owner, so the runs were put on hold at the end of this session. The owner answered and removed the hold before the Numbers session.

## Notes from the Numbers session (2026-10-13)

- Numbers is in `numbers-1-36-records.json` (15 records: 12 G, 1 H+G, 2 untagged, no V; 6 carry `sides`) and `numbers-1-36-q-records.json` (3 Q: the Ethiopian woman 12:1; the book of the wars of the Lord 21:14; the thirty-two persons given to the priest 31:40–41). Awaiting Codex. Next book: Deuteronomy.
- **Numbers to Deuteronomy were already heavily annotated by Codex’s first pass** (45 published records cite Numbers; the `deuteronomy-*` IDs do the same there). Almost every plain conflict is published in KJV wording only. Run the overlap check before doing anything else, and expect the new work to be Greek and Hebrew wording.
- Where a published record states a KJV conflict and the Greek removes it (Numbers 4:3 and 35:4), a separate G record was issued beside the published one and flagged to Codex. Wait for its view before doing the same in Deuteronomy.
- Records issued here that rest on verses of later books — check `data/evidence.json` before proposing anything at them: Deuteronomy 1:44 (Amorites of the mountain), Deuteronomy 5:22 (context only), Judges 1:17 (Hormah), Joshua 10:13 and Habakkuk 3:7 (context only, in Q records).
- No verse-number differences at the verses quoted.
- Bolls.life book numbers: Numbers 4, Deuteronomy 5, Judges 7, Habakkuk 35. Four parallel requests at a time gave no 429.
- The packaged KJV prints “Lord'S” where the source has the divine name in the possessive (Numbers 31:37–41 and elsewhere), and “og the king of bashan” at Numbers 21:33. Cut quotations and sides so they avoid those words; both reported to Codex.
- No V: every breach told in Numbers is punished in the story or commanded in it.
- Not issued and still open for later sessions: Amos 5:25 beside the wilderness sacrifices; Hebrews 9:4 against 1 Kings 8:9.
- Held back, quotes sourced: Greek differences at 21:30, 21:1 (“Atharin” for “the spies”), 21:15, 14:45 and 27:14. Ruled out: “thigh to rot” (5:21) for H, “unicorn” (23:22), the manna’s taste (11:8 beside Exodus 16:31).
- The census figures of chapters 1, 2 and 26 were not compared with the Greek number by number.
- Work folder: `%TEMP%\claude\num` (same scripts as `lev`; `fetch.mjs` now also fetches Brenton’s English for parallels; cache of all 36 chapters). In Git Bash do not put a here-document and a multi-line quoted command on the same line: the here-document swallows the commands after it. Write scripts with the file tool instead.

## Lessons from Codex’s Leviticus and Numbers integration (2026-10-13)

Codex accepted every record of both books (Leviticus 12 and 3 Q; Numbers 15 and 3 Q), correcting 10; none held, nothing for the owner. Reasons are in `research/notes/claude-ready-leviticus-1-27-2026-10-13.md`, `claude-ready-numbers-1-36-2026-10-13.md`, the two `-q-` files and their `-decisions.json`.

- **A separate G record beside a published KJV-only record is accepted** (Numbers 4:3, 35:4), and so is a G beside a built-in study at the same verse when the subject differs (Numbers 12:8).
- **A G record on the Greek New Testament where TR agrees with the KJV and TISCH differs is accepted** (Luke 2:22), as a comparison with a named edition.
- **Do not identify an animal or a place across texts.** “The Greek animal is the KJV’s hare” was removed; a Paran and Zin conflict was made conditional on the two being exclusive; collective names (Amalekites, Canaanites) do not make a definite conflict.
- **Compare like with like.** Before setting two figures against each other, state what each measures (the suburbs: outward from the wall, and the side).
- **Check the grammatical form before saying two verses have “the same form”** (Numbers 11:25 plural, Deuteronomy 5:22 singular).
- **Limit every absence claim to the verses supplied**, in main records as in Q (“not in the five verses quoted”, never “not in Leviticus”).
- **In Q records, do not call a named source unnamed, and do not write an exhaustive claim about feasts or cycles**; make an inferred antecedent or date conditional.

## Notes from the Deuteronomy session (2026-10-13)

- Deuteronomy is in `deuteronomy-1-34-records.json` (11 records: 10 G, 1 H, no V, no untagged; 5 carry `sides`) and `deuteronomy-1-34-q-records.json` (3 Q: who buried Moses 34:6; the host of heaven “divided unto all nations” 4:19; Simeon not named in the blessing 33:1). Awaiting Codex. Next: Joshua, Q only.
- **About 330 Deuteronomy verses already carried published records** before this session; every plain KJV conflict looked for was already there. All new records are Greek or Hebrew wording.
- Records issued here that rest on verses of later books — check `data/evidence.json` before proposing anything at them: Matthew 4:10, 22:37; Mark 12:30; Romans 12:19, 15:10; Galatians 3:10; Hebrews 1:6, 10:30; Jude 1:9; Psalm 97:7; 2 Chronicles 35:13; Joshua 19:1. Do not re-issue the Hebrews 1:6 quotation, the “vengeance is mine” quotation or the Galatians 3:10 “all” in those books’ sessions.
- Verse numbers: Deuteronomy 29 runs one lower in the Hebrew (KJV 29:26 = WLC 29:25); Brenton’s Greek prints the KJV’s number there. Other chapters’ numbering was not checked.
- The one H (27:26, “all”) admits in its scope that the sense may be the same; Codex was told it may hold it. Wait for its view before issuing H on a supplied word of quantity.
- No V: the one candidate (Solomon’s horses and silver against 17:16–17) is told in 1 Kings, is already published as a comparison, and no whole-Bible check for a rebuke could be stated.
- The book was not read in full; the notes file lists the verses compared.
- Not issued and still open for later sessions: Amos 5:25 beside the wilderness sacrifices; Hebrews 9:4 against 1 Kings 8:9.
- Held back, quotes sourced: the Greek adds the Gergesite at 20:17; “this second law” at 17:18. Ruled out: “on this side Jordan” (1:1), “let not his men be few” (33:6), “have no child” (25:5), animal names (14:5).
- Bolls.life book numbers: Deuteronomy 5, Joshua 6, 2 Chronicles 14, Psalms 19, Matthew 40, Mark 41, Romans 45, Galatians 48, Hebrews 58, Jude 65.
- Work folder: `%TEMP%\claude\deu` (`head.mjs`, `build.mjs`, `o.mjs`, `fetch.mjs`, `urls.mjs`, `ov3.mjs`, `v.mjs`; cache of all 34 chapters in WLC, Brenton Greek and Brenton English, plus parallels). When copying `fetch.mjs` for another book, change the book number in **both** the address and the cache file name, and the chapter count.

## Notes from the Joshua Q session (2026-10-13)

- Joshua Q is in `joshua-1-24-q-records.json` (4 Q: the captain of the host of the Lord 5:14; Rahab’s house on the wall 6:22; the book of Jasher 10:13; what Joshua wrote “in the book of the law of God” 24:26). Awaiting Codex. Next: Judges, Q only.
- Batches Codex has not processed when this session ended: Deuteronomy (main and Q, one batch) and Joshua Q. That is two, so the next run may still work; a run that finds three must stop quietly (the rule is “more than two”, counted before the run starts).
- Records issued here that rest on verses of later books — check `data/evidence.json` before proposing anything at them: 2 Samuel 1:17–18 (the book of Jasher; do not re-issue it in the 2 Samuel Q session), Revelation 22:8–9, Exodus 3:5, Genesis 23:7 (context only).
- Three Greek differences were stated inside the Q records as wording and not issued as G, because the Joshua backlog session is Q only: 5:14 (no “Nay”, no “did worship”), 2:15 with 6:20 (no house on the wall; “all the wall fell round about”), 10:13 (no sentence about the book of Jasher). Codex was told; issue them as G only if the owner or Codex asks.
- Brenton’s Greek pages: Joshua 10 prints 41 verses (no 15, no 43); Joshua 6 prints no verse 4; Joshua 24 prints 31a, 33a and 33b; nothing is printed at 8:31–32. No Brenton page answers for Daniel 8 at `grcbrent/DAN08.htm` (404): find the right address before the Daniel session.
- The book was not read in full; the notes file lists the verses read.
- Considered and not issued: the route to mount Ebal (8:30), how Achan was taken (7:14–18), who wrote of Joshua’s death (24:29–33). Already published and so dropped: the uncircumcised generation (5:5–7), the long day, the hornet.
- Work folder: `%TEMP%claudejosq` (same scripts as `deu`; `head.mjs` writes the Q file only; cache of all 24 chapters in WLC, Brenton Greek and Brenton English). For the next Q-only book copy this folder, not `deu`.

## Notes from the Judges Q session (2026-10-13)

- Judges Q is in `judges-1-21-q-records.json` (4 Q: the order of events around Joshua’s death 1:1; Gideon’s ephod 8:27; the evil spirit God sent 9:23; what was done to Jephthah’s daughter 11:39). Awaiting Codex. Next: Ruth, Q only.
- **Batches Codex has not processed when this session ended: Deuteronomy (main and Q, one batch), Joshua Q and Judges Q. That was three.** Out of date: Codex has since processed all three (see the Ruth Q session notes for the current count).
- Records issued here that rest on verses of later books — check `data/evidence.json` before proposing anything at them: 1 Samuel 16:14 (the evil spirit from the Lord; do not re-issue that question in the 1 Samuel Q session — extend or point to the Judges record), 1 Kings 22:21–22 (the lying spirit, context only), 1 Samuel 2:18 and 23:9, Hosea 3:4 (ephod, context only), 1 Samuel 12:11 and Hebrews 11:32 (Jephthah named, context only), Joshua 15:13–17 and 24:28–29.
- Three wording differences were stated inside the Q records and not issued as H or G, because the Judges backlog session is Q only: 2:6 (KJV “had let the people go”), 11:39 (KJV “according to his vow”), and Brenton’s Greek word for the ephod at 8:27 against Exodus 28:6. Seen and not examined: 11:31 “whatsoever” against Brenton’s “whosoever”; 11:40 “to lament”. Codex was told; issue them only if the owner or Codex asks.
- No verse-number differences at the verses quoted. Brenton’s Greek prints “and it was an ordinance in Israel” at the end of 11:39; its English prints it at the start of 11:40.
- The book was not read in full; the notes file lists the verses read.
- Considered and not issued: the teraphim (17:5), the two defeats before Benjamin (20:18–25), Meroz (5:23), how Israel “asked the Lord” (1:1). Already published and so dropped: the angel of the Lord, the angel’s name (13:18).
- A single-quoted string in `build.mjs` breaks on the straight apostrophe of “Lord's”; use a template string for any text that quotes it.
- Work folder: `%TEMP%claudejdgq` (same scripts as `josq`; `build.mjs` now has a whole-Bible word-search helper, `hits`, with asserted results; cache of all 21 chapters in WLC, Brenton Greek and Brenton English, plus parallels). For Ruth copy this folder.

## Lessons from Codex’s Deuteronomy and Joshua Q integration (2026-10-13)

Codex processed Deuteronomy (10 of 11 accepted, 2 corrected, 1 held; all 3 Q accepted, 1 corrected) and Joshua Q (all 4 accepted, all 4 corrected) at 04:11 on 2026-10-13. Reasons are in `research/notes/claude-ready-deuteronomy-1-34-2026-10-13.md`, `claude-ready-deuteronomy-1-34-q-2026-10-13.md`, `claude-ready-joshua-1-24-q-2026-10-13.md` and their `-decisions.json`. Judges Q was processed afterwards (see below).

- **Held, and listed under "Needs owner":** `confirmeth-not-all-the-words-of-this-law-hebrew-has-no-all` (Deuteronomy 27:26). The Hebrew has no word for “all”, but “the words of this law” can carry the same total sense, so no meaning difference is shown. Codex asks whether a wording-only H exception is wanted. **Answered: the record stays held (see “Owner ruling on wording-only H”).** Do not re-issue the record and do not issue H on a supplied word of quantity.
- **Check the same passage before calling a Greek word an addition** — again. “Only” at 6:13 was removed because KJV 6:14 already excludes other gods.
- **Do not treat a referent as settled** when it is inferred (which speech “these words” points back to, 31:1).
- **In Q records, every statement about the passage must be checked against the quoted words.** “No message” was wrong: the captain gives a command (Joshua 5:15). “Had said” does not fix when a command was given (Joshua 6:22). A narrator’s attribution does not make a passage plain literal narrative (Joshua 10:13). Writing in a book is not the same as adding new law (Joshua 24:26). A burial by God is not shown to explain an unknown grave (Deuteronomy 34:6).
- Codex now takes more than one batch in a run when the owner tells it to.

## Lessons from Codex’s Judges Q integration (2026-10-13)

Codex accepted all 4 Judges Q records (2 as written, 2 corrected, none held; nothing for the owner). Reasons are in `research/notes/claude-ready-judges-1-21-q-2026-10-13.md` and its `-decisions.json`.

- **Say what a figure measures.** 1,700 shekels is the weight of the earrings collected, not necessarily of the finished ephod (Judges 8:26–27).
- **Do not call something “untold” when the passage reports it by reference.** Judges 11:39 does report the fulfilment, by pointing back to the vow; what it lacks is a separate description. Say exactly which part is missing.
- A Q about the order of events inside one book, with another book’s parallel as context, is accepted and is not a cross-book conflict issued out of turn.
- More than one side-A entry in a Q record was accepted.

## Notes from the Ruth Q session (2026-10-13)

- Ruth Q is in `ruth-1-4-q-records.json` (3 Q: how Elimelech’s land came to be Naomi’s to sell 4:3; what joined redeeming the field to raising the name of the dead 4:5; in whose line Obed was counted 4:17). Awaiting Codex. Next: 1 Samuel, Q only.
- **Batches Codex has not processed when this session ended: Ruth Q only (one).** Count from here: every batch up to and including `judges-1-21-q-records.json` is processed.
- Records issued here that rest on verses of later books — check `data/evidence.json` before proposing anything at them: 1 Chronicles 2:12, Matthew 1:5 and Luke 3:32 (Boaz begat Obed; do not re-issue the Obed question in those books’ sessions), 2 Kings 8:3 and 8:6 (context only).
- No verse-number differences at the verses quoted. All 85 verses were read in the KJV; the notes file lists the verses also read in Hebrew and Greek.
- Seen and not examined, because the Ruth backlog session is Q only: Brenton’s Greek of 4:14 ends “thy name” where the KJV has “his name”; Brenton’s Greek of Deuteronomy 25:6 has “the child” where the KJV has “the firstborn”. Codex was told; issue them only if the owner or Codex asks.
- Considered and not issued: the unnamed nearer kinsman (4:1), the threshing floor (3:4–9), which judge’s days (1:1), gleaning while holding land. Reasons are in the notes file.
- The apostrophe lesson again: any string in `build.mjs` that contains a straight apostrophe (“Elimelech's”, “husband's”) must be a template string — titles and reasoning as well as quotations.
- The build script’s word-ban check rejects the word for a land “owner”; write “holder”.
- Work folder: `%TEMP%claude
uthq` (same scripts as `jdgq`; cache of all 4 chapters in WLC, Brenton Greek and Brenton English, plus parallels). For 1 Samuel copy this folder, change the book number (bolls.life 9), the code (`1SA`) and the chapter count (31) in `fetch.mjs`, and the file names in `head.mjs`.

## Lessons from Codex’s Ruth Q integration (2026-10-13)

Codex accepted all 3 Ruth Q records (1 as written, 2 corrected, none held; nothing for the owner). Reasons are in `research/notes/claude-ready-ruth-1-4-q-2026-10-13.md` and its `-decisions.json`.

- **“None of the readings is stated” must be true of every text quoted, the Greek included.** The Greek of Ruth 4:3 says the land “has been given” to Naomi, so one reading was stated by a quoted text. Before writing that no quoted verse states a reading, check each reading against the Hebrew and the Greek quoted as well as the KJV.
- **Narrow the open question to what the quoted verses leave open.** The genealogies do trace descent through Boaz; what is open is the legal reckoning. Say what the verses do state before saying what they leave out.
- A Q beside a published G on the same verse is accepted when it asks a different question.

## Notes from the 1 Samuel Q session (2026-10-13)

- 1 Samuel Q is in `1-samuel-1-31-q-records.json` (4 Q: by what means Samuel came up at Endor 28:12; what became of Shiloh after the ark was taken 4:11; the image in David’s bed 19:13; the book of “the manner of the kingdom” 10:25). Awaiting Codex. Next: 2 Samuel, Q only.
- **Batches Codex has not processed when this session ended: 1 Samuel Q only (one).** Count from here: every batch up to and including `ruth-1-4-q-records.json` is processed.
- Records issued here that rest on verses of later books — check `data/evidence.json` before proposing anything at them: Jeremiah 7:12, 7:14, 26:6 and 41:5 and Psalms 78:60–61 (Shiloh; do not re-issue that question in the Psalms or Jeremiah sessions), 1 Kings 14:2, 2 Chronicles 1:3, 1 Chronicles 10:13 (the woman at Endor; do not re-issue in the Chronicles session), 2 Kings 23:24, Isaiah 8:19 (context only).
- Wording differences stated inside the Q records and not issued as H or G, because the 1 Samuel backlog session is Q only: KJV “an image” for the Hebrew “the teraphim” (19:13, 19:16) and “idolatry” for the same word (15:23); Brenton’s Greek at 28:14 (“an upright man”), 28:19 (“with you shall fall”), 2:22 (no clause about the women at the tabernacle), 10:25 (“of the king”) and 1 Chronicles 10:13 (adds “and Samuel the prophet answered him”). Codex was told; issue them only if the owner or Codex asks. The 1 Chronicles 10:13 plus is a candidate G for the 1 Chronicles session, which is a full review.
- No verse-number differences at the verses quoted. The book was not read in full; the notes file lists the verses read.
- Considered and not issued: Goliath’s head brought to Jerusalem (17:54), the number struck at Bethshemesh (6:19), Samuel’s tribe (1:1 beside 1 Chronicles 6 — a possible conflict, open for the 1 Chronicles session), the emerods (5:6), the companies of prophets. Already published and so dropped: Bedan, the evil spirit from the Lord, the Urim, the ephod.
- The build’s word-ban check also rejects any word containing “ruling”; none was needed.
- Work folder: `%TEMP%claudesam1q` (same scripts as `ruthq`; `build.mjs` also asserts that Brenton’s page prints each verse number quoted; cache of all 31 chapters in WLC, Brenton Greek and Brenton English, plus parallels). For 2 Samuel copy this folder, change the book number (bolls.life 10), the code (`2SA`) and the chapter count (24) in `fetch.mjs`, and the file names in `head.mjs`.

## Notes from the 2 Samuel Q session (2026-10-13)

- 2 Samuel Q is in `2-samuel-1-24-q-records.json` (4 Q: when and how Saul slew the Gibeonites 21:1; “after forty years” counted from what 15:7; whether Ziba or Mephibosheth told the truth 16:3 and 19:27; what the anger against Israel was for before the numbering 24:1). Awaiting Codex. Next: 1 Kings, Q only.
- **Batches Codex has not processed when this session ended: 1 Samuel Q and 2 Samuel Q (two).** Every batch up to and including `ruth-1-4-q-records.json` is processed. Two is within the limit, so the next run may work; a run that finds three must stop quietly.
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them: 1 Chronicles 21:1, 21:3 and 21:7 (the anger before the numbering; do not re-issue that question in the 1 Chronicles session), 1 Kings 2:11 (context only; David’s forty years), Joshua 9:15, 9:17 and 9:27 and 1 Samuel 22:19 (context only).
- **2 Samuel 19: the Hebrew and Brenton’s Greek run one verse ahead of the KJV through the whole chapter** (KJV 19:24 = 19:25), not only at the start. Quote the Hebrew and Greek at their own numbers and give the KJV number beside them.
- The Ziba record carries sides A and B and places its tag on two verses. Codex was told the B entries can be relabelled A; wait for its view before using side B in another Q record.
- Wording differences stated inside the Q records and not issued as H or G, because the 2 Samuel backlog session is Q only: Brenton’s added “and pursued us” at 21:5; “to his father” at 15:7; “Saddle the ass for me” at KJV 19:26; “son of the son of Saul” at KJV 19:24. Seen and not examined: Brenton’s longer 21:1 and 24:15, “Gabaon of Saul” at 21:6, the added bones at 21:14. Codex was told; issue them only if the owner or Codex asks.
- The book was not read in full; the notes file lists the verses read.
- Considered and not issued: the “gutter” at 5:8 (Hebrew wording, not a Q), whether Abner went in to Rizpah (3:7), “thy master’s wives” (12:8), why numbering was a sin (24:10 beside Exodus 30:12; open for the 1 Chronicles session only if it qualifies there by itself). Already published and so dropped: the book of Jasher, the Amalekite’s account, Elhanan, Michal’s sons, David’s sons as priests, Absalom’s sons.
- In `build.mjs`, write every string that holds quoted text as a template string from the start; all assertions then passed on the first run.
- Work folder: `%TEMP%claudesam2q` (same scripts as `sam1q`; `b0.mjs` is the helper header and `b1.mjs` the records, joined into `build.mjs`; cache of all 24 chapters in WLC, Brenton Greek and Brenton English, plus parallels). For 1 Kings copy this folder, change the book number (bolls.life 11), the code (`1KI`) and the chapter count (22) in `fetch.mjs`, and the file names in `head.mjs`. Remember Brenton’s lettered verses and its swapped chapters 20 and 21 in 1 Kings (see the 1 Kings session notes).

## Notes from the 1 Kings Q session (2026-10-13)

- 1 Kings Q is in `1-kings-1-22-q-records.json` (4 Q: why the old prophet of Bethel lied 13:18; whether Elijah anointed Hazael, Jehu or Elisha 19:15–16; twelve pieces, ten tribes and “one tribe” 11:30–32; the book of the acts of Solomon 11:41). Awaiting Codex. Next: 2 Kings, Q only.
- **Batches Codex has not processed when this session ended: 1 Samuel Q, 2 Samuel Q and 1 Kings Q (three).** Every batch up to and including `ruth-1-4-q-records.json` is processed. Three is more than two: the next run must count again and stop quietly unless Codex has processed at least one of them.
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them: 2 Kings 8:13, 8:15, 9:1, 9:3 and 9:6 (Hazael and Jehu; do not re-issue the anointing question in the 2 Kings Q session), 2 Kings 2:13 and 23:18 (context only), 2 Chronicles 9:29 (the sources for Solomon; do not re-issue in the Chronicles session), 2 Chronicles 11:12 and 22:7, Joshua 19:1 (context only).
- No verse-number differences at the verses quoted.
- Wording differences stated inside the Q records and not issued as G, because the 1 Kings backlog session is Q only: Brenton’s “two tribes” at 11:32 and 11:36 and “Judah and Benjamin” at 12:20; the plus “that my bones may be preserved with his bones” at 13:31. Seen and not examined: Brenton’s 120,000 at 12:21 (KJV 180,000), its wording of 13:11, 13:23, 13:26 and 13:29–30, no “of Abelmeholah” at 19:16, and “Joel” for Iddo at 2 Chronicles 9:29 (a candidate for the 2 Chronicles session, which is a full review). Codex was told; issue the 1 Kings ones only if the owner or Codex asks.
- The book was not read in full; the notes file lists the verses read.
- Considered and not issued: the lying spirit (22:19–23; the published Judges record cites it), the four hundred prophets (22:6), Sheba, Ophir and Tharshish, the water on Carmel (18:33), the unnamed Pharaoh (3:1). **Open for the 2 Kings Q session if it qualifies there:** Naboth’s sons (2 Kings 9:26 beside 1 Kings 21:13).
- Bolls.life answered 429 once when 4 requests ran in parallel during the first fetch; running `fetch.mjs` again filled the gap.
- Work folder: `%TEMP%\claude\k1q` (same scripts as `sam2q`; `b0.mjs` and `b1.mjs` joined into `build.mjs`; cache of all 22 chapters in WLC, Brenton Greek and Brenton English, plus parallels in 2 Kings and 2 Chronicles). For 2 Kings copy this folder, change the book number (bolls.life 12), the code (`2KI`) and the chapter count (25) in `fetch.mjs`, and the file names in `head.mjs`. Remember that 2 Kings 12 runs one verse ahead in the Hebrew and the Greek.

## Lessons from Codex’s 1 Samuel and 2 Samuel Q integration (2026-10-13)

Codex accepted all 8 (1 Samuel Q: 1 as written, 3 corrected; 2 Samuel Q: 2 as written, 2 corrected; none held, nothing for the owner). Reasons are in `research/notes/claude-ready-1-samuel-1-31-q-2026-10-13.md`, `claude-ready-2-samuel-1-24-q-2026-10-13.md` and their `-decisions.json`.

- **Side B in a Q record is accepted** where the record sets two reported speeches against each other (Ziba and Mephibosheth).
- **Do not infer from a definite article** that something was already known in the household (“the teraphim”).
- **Do not assert the contents or title of a writing the verse only describes** (“the manner of the kingdom”); say what the verse says the writing was about.
- **Say what is stated before saying what is unknown.** “What was done is unknown” was narrowed: the killing of the Gibeonites is stated; its time, place and extent are not.
- **Narrow a whole-book absence to the passages compared** whenever the book was not read in full — again.
- Do not let prose fix an order of events, or assume a party’s innocence, beyond what the narrative presents (2 Samuel 24:1).

## Notes from the 2 Kings Q session (2026-10-13)

- 2 Kings Q is in `2-kings-1-25-q-records.json` (4 Q: whose “great indignation against Israel” 3:27; what happened to Naboth’s sons 9:26; who the saviour was 13:5; which book Hilkiah found and how it had gone out of knowledge 22:8). Awaiting Codex. **The Q backlog is finished. Next: 1 Chronicles, full review with Q.**
- **Batches Codex has not processed when this session ended: 1 Kings Q and 2 Kings Q (two).** Every batch up to and including `2-samuel-1-24-q-records.json` is processed. Two is within the limit, so the next run may work; a run that finds three must stop quietly.
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them: 2 Chronicles 34:14 (the book found; do not re-issue that question in the 2 Chronicles session), Deuteronomy 31:26 (context only), 1 Kings 21:13, 21:14, 21:16 and 21:19 (Naboth).
- Brenton’s Greek prints the Naboth chapter (KJV 1 Kings 21) as chapter 20; the Greek of KJV 21:13 was quoted from Brenton’s 20:13 with that stated in the record. No numbering difference at the 2 Kings verses quoted.
- Wording differences stated inside the Q records and not issued as G, because the 2 Kings backlog session is Q only: Brenton’s “deliverance” for “a saviour” at 13:5; no article before “book” at 22:8. Seen and not examined: Brenton’s “him” for “thee” at 9:26, “I will deliver” for “he will deliver” at 3:18, the Greek noun at 3:27, and KJV “a book of the law” at 2 Chronicles 34:14 beside the Hebrew (a candidate for the 2 Chronicles session, which is a full review). Codex was told; issue the 2 Kings ones only if the owner or Codex asks.
- The book was not read in full; the notes file lists the verses read.
- Considered and not issued: Naaman in the house of Rimmon (5:18–19), Elisha’s message to Benhadad (8:10), the dial of Ahaz, Pul and Tiglathpileser (15:19), “So king of Egypt” (17:4), Jonah’s unrecorded words (14:25). Reasons are in the notes file.
- **For the 1 Chronicles session (full review), collected from earlier notes:** candidates — the Greek plus at 10:13 (“and Samuel the prophet answered him”), Samuel’s tribe (1 Samuel 1:1 beside 1 Chronicles 6), why numbering was a sin (only if it qualifies by itself). Do not re-issue: the anger before the numbering (21:1, 21:3, 21:7), the woman at Endor (10:13 as a Q), the Obed question (2:12), the built-in study `soldiers` (21:5–6), or the 2 Samuel records that already rest on Chronicles parallels. Bolls.life book number 13, packaged KJV index 12, code `1CH`.
- Work folder: `%TEMP%claudek2q` (same scripts as `k1q`; cache of all 25 chapters in WLC, Brenton Greek and Brenton English, plus parallels). `head.mjs` there writes a Q file only; for 1 Chronicles take `head.mjs` and `build.mjs` from `%TEMP%claudedeu` (the last full-review folder, which writes both files) and the `hits`, `must` and `labels` helpers from `k2q0.mjs`.

## Lessons from Codex’s 1 Kings Q integration (2026-10-13)

Codex accepted all 4 (2 as written, 2 corrected; none held, nothing for the owner). Reasons are in `research/notes/claude-ready-1-kings-1-22-q-2026-10-13.md` and its `-decisions.json`.

- **A list in a command does not fix an order.** Three people named to be anointed are three recipients, not a sequence, unless the verse says so.
- **A reference to a source book is a pointer for more information**, not a statement that the account depends on that book for completeness.

## Notes from the 1 Chronicles session (2026-10-13)

- 1 Chronicles is in `1-chronicles-1-29-records.json` (16 records: 5 G, 11 untagged, no H, no V; 13 carry `sides`) and `1-chronicles-1-29-q-records.json` (3 Q: when and where the men of Gath slew Ephraim’s sons 7:21; when the word about bloodshed came to David 22:8; how David received the pattern “in writing by his hand” 28:19). Awaiting Codex. **Next: 2 Chronicles, full review with Q.**
- **Batches Codex has not processed when this session ended: 2 Kings Q and 1 Chronicles (two).** Every batch up to and including `1-kings-1-22-q-records.json` is processed. Two is within the limit, so the next run may work; a run that finds three must stop quietly.
- **Verse numbers:** 1 Chronicles 6 runs 15 lower in the Hebrew and Brenton’s Greek (KJV 6:16 = 6:1; KJV 6:1–15 = 5:27–41). 1 Chronicles 12 runs one ahead from verse 5 (KJV 12:35 = 12:36). Brenton’s Greek page for chapter 1 prints verses 1–10, 17 and 24–54 only; its chapter 16 prints no verse 24.
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them: Genesis 10:23 and 36:12; Exodus 6:21; 1 Samuel 8:2, 9:1 and 14:51; 2 Samuel 2:8, 2:10 and 10:6; 2 Kings 23:31 and 24:18 with Jeremiah 22:11 (the order of Josiah’s sons; do not re-issue in Jeremiah); Ezra 3:2, Haggai 1:1 and Matthew 1:12 (Zerubbabel’s father; do not re-issue in Ezra, Nehemiah, Haggai, Matthew or Luke); 1 Kings 5:3 and 8:18–19 (context in a Q).
- A script (`numscan.mjs` in the work folder) compares the number words of each KJV verse with Brenton’s English of the same verse number. It found three G records in one pass (2:21, 5:21, 12:35). Use it for 2 Chronicles and later books; it does not allow for numbering offsets, so read its output with the offsets in mind.
- No H: no verse compared showed a meaning difference. No V: the breaches told are punished or rebuked; David’s many wives (14:3) were left out because no whole-Bible check for a rebuke could be stated.
- Considered and not issued (reasons in the notes file): 2:23 (ambiguous in Hebrew and Greek alike), 3:4 beside 29:27, Gezer and Gob (20:4), Chidon and Nachon (13:9), Samuel’s tribe, Levites from thirty or twenty (23:3, 23:24). The earlier candidate “why numbering was a sin” did not qualify as a Q.
- Held back, quotes sourced: Brenton’s Greek at 20:8 (“all four were giants”), 21:13, 11:11, 26:17–18; 2 Samuel 21:18 (“in Geth”); 2 Samuel 10:6 (“king Amalek”); 1 Samuel 31:6 (no “all his men”); 1 Samuel 14:51 (an extra name, Jamin).
- **For the 2 Chronicles session, collected from earlier notes:** candidates — Brenton’s “Joel” for Iddo at 9:29; KJV “a book of the law” at 34:14 beside the Hebrew; the Greek pluses at 36:8, 21:17 and 36:2a–5d (held back from 2 Kings). Do not re-issue: the sources for Solomon (9:29 as a Q), the book found (34:14 as a Q), or the records already resting on 21:17, 22:1, 22:2, 22:8, 22:9, 24:14, 24:25, 28:1, 28:20–21, 34:22, 35:13, 35:23–24, 36:9, 36:10, 1:3, 11:12 and 22:7. Bolls.life book number 14, packaged KJV index 13, code `2CH`. Brenton prints lettered verses in chapter 36 (36:2a–5d); check the printed labels of every chapter before quoting.
- No Brenton page answers for Nehemiah 11 or 12 at `grcbrent/NEH11.htm` (404), although `EZR03.htm` answers: find the right address before the Nehemiah session.
- Work folder: `%TEMP%claudec1` (`head.mjs` from `deu`, writing both files; `build.mjs` with the `hits` and `must` helpers and a small `fig` helper for one-figure G records; `ovc.mjs` lists every existing record that cites a given book; `numscan.mjs`; cache of all 29 chapters in WLC, Brenton Greek and Brenton English, plus parallels). For 2 Chronicles copy this folder, change the book number (14), the code (`2CH`) and the chapter count (36) in `fetch.mjs`, the file names in `head.mjs`, and the book index (13) in `numscan.mjs`.

## Lessons from Codex’s 2 Kings Q and 1 Chronicles integration (2026-10-13)

Codex accepted everything (2 Kings Q: 2 as written, 2 corrected; 1 Chronicles: 11 as written, 5 corrected; 1 Chronicles Q: 1 as written, 2 corrected; none held, nothing for the owner). Reasons are in `research/notes/claude-ready-2-kings-1-25-q-2026-10-13.md`, `claude-ready-1-chronicles-1-29-2026-10-13.md`, `claude-ready-1-chronicles-1-29-q-2026-10-13.md` and their `-decisions.json`.

- **Do not put an English rendering beside a Greek quotation as if the cited page printed it.** An English attribution “not established by the supplied Greek address” was removed. Glosses stay in square brackets as the researcher’s own.
- **No lexical aside without a lexical source.** Say what the pointed text prints; do not say what a word “means” in a dictionary sense unless a source is supplied.
- **Discovery is not first knowledge.** A reaction in the story (alarm, mourning) does not establish that something was unknown before, or wholly out of use.
- **Where a phrase can attach to either of two names, make the relationship conditional** (the “uncle” phrase, 1 Samuel 14:50–51).
- **“All his house” is not shown to be unrestricted**; make such readings conditional.
- **Different units and lists not said to be complete do not make an exclusive conflict or an exclusive reconciliation.**
- **Where the men came from does not say where the event happened.**
- Name-and-number conflicts with a parallel book, and one-figure G records, were accepted as written. The `numscan.mjs` approach is sound.

## Notes from the 2 Chronicles session (2026-10-13)

- 2 Chronicles is in `2-chronicles-1-36-records.json` (14 records: 8 G, 6 untagged, no H, no V; 11 carry `sides`) and `2-chronicles-1-36-q-records.json` (3 Q: the writing from Elijah 21:12; the words of Necho “from the mouth of God” 35:22; where the ark had been 35:3). Awaiting Codex. **Next: Ezra, full review with Q.**
- **Batches Codex has not processed when this session ended: 2 Chronicles only (one).** Every batch up to and including 1 Chronicles is processed.
- **Verse numbers:** 2 Chronicles 2 runs one lower in the Hebrew and Brenton’s Greek (KJV 2:2 = 2:1); KJV 14:1 is their 13:23, so chapter 14 runs one lower. Brenton’s Greek prints no 2:18, 3:12, 14:15 or 27:8; it prints 35:19a–d and 36:2a–c, 4a, 5a–d. Brenton’s 1 Kings 7 is reordered (other matter at 7:24). Numbers 17:10 is 17:25 in the Hebrew.
- **34 published records already cited 2 Chronicles** before this session, most of them issued from Samuel and Kings. Run `ovc.mjs` first in Ezra and Nehemiah too.
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them: Hebrews 9:3–4 (the contents of the ark; the item open since Exodus is now issued — do not re-issue it in Hebrews), 1 Kings 7:24, 8:9, 15:16 and 15:32; 2 Kings 8:24, 8:29, 12:21, 16:20, 21:5 and 23:12; Jeremiah 22:19 and 36:30 (Jehoiakim’s burial; do not re-issue in Jeremiah); 2 Kings 2:11, 3:11, 1:17, 8:16 and 23:29 (context in Q records).
- No H: the one candidate (34:14, “a book” where the Hebrew phrase is definite) was left out and logged in `owner-questions.md`; do not log it again. No V: the breaches told are rebuked, punished or pardoned in the passage.
- Still open for a later session: Amos 5:25 beside the wilderness sacrifices (Amos); which Zacharias is meant at Matthew 23:35 beside 2 Chronicles 24:20–22 (a possible Q for the Matthew session; as a conflict it depends on an identity no verse states).
- Considered and not issued (reasons in the notes file): the gold shields (9:16), Ahaz “smote” or not overcome (28:5), the order of Josiah’s reforms, Manasseh’s repentance, the ambushments (20:22).
- Held back, quotes sourced: Brenton’s Greek at 17:11 (no “he goats”), 35:20 (“against the king of the Assyrians”), 35:3 (statement for command), 33:15 (no verb for casting out), 36:5 (adds the name of Jehoiakim’s mother), 24:27, 28:27, and the lettered verses of chapters 35 and 36.
- **Do not put a here-document on a Bash command line at all** (it swallowed the rest of the command and the run waited until the time limit). Write every script with the file tool and run it with `node`.
- For Ezra and Nehemiah: Brenton’s codes are `EZR` and `NEH`; `grcbrent/NEH11.htm` and `NEH12.htm` gave 404 earlier, so check which Nehemiah pages answer before quoting. Ezra 2 and Nehemiah 7 are parallel lists: `numscan.mjs` can be pointed at them, and the published records at Ezra 2:63, 3:2 and Nehemiah 7:65 must be checked first. 2 Chronicles 36:22–23 repeats in Ezra 1:1–3. Bolls.life book numbers: Ezra 15, Nehemiah 16, Esther 17, Job 18. Packaged KJV index is one less.
- Work folder: `%TEMP%\claude\c2` (same scripts as `c1`; `build.mjs` holds all 17 records; `ed.mjs` shows how to patch `build.mjs` by exact string; cache of all 36 chapters in WLC, Brenton Greek and Brenton English, plus parallels). For Ezra copy this folder, change the book number (15), the code (`EZR`) and the chapter count (10) in `fetch.mjs`, the file names in `head.mjs`, and the book index (14) and name in `numscan.mjs`.

## Notes from the Ezra session (2026-10-13)

- Ezra is in `ezra-1-10-records.json` (11 records: 6 G, 5 untagged, no H, no V; all carry `sides`) and `ezra-1-10-q-records.json` (3 Q: which kings Ahasuerus and Artaxerxes are 4:6–7; what became of the foreign wives and their children 10:44; which king is “the king of Assyria” 6:22). Awaiting Codex. **Next: Nehemiah, full review with Q.**
- **Batches Codex has not processed when this session ended: 2 Chronicles and Ezra (two).** Every batch up to and including 1 Chronicles is processed. Two is within the limit, so the next run may work; a run that finds three must stop quietly.
- **Brenton’s Greek has no Nehemiah pages.** Its Nehemiah is printed as chapters 11–23 of the Ezra pages: Nehemiah chapter *c* is `https://ebible.org/grcbrent/EZR{c+10}.htm` (Nehemiah 7 = `EZR17.htm`). Brenton’s English does have `eng-Brenton/NEH{cc}.htm`. For the Nehemiah session change `fetch.mjs`, the `brenton` reader in `o.mjs` and the address builder `uB` in `head.mjs` so that Greek for Nehemiah is read from, and cited at, the `EZR` page, and check the printed verse labels of those pages before quoting.
- Verse numbers: none differ in Ezra at the verses quoted; Brenton’s Greek prints the same verse count as the KJV in all ten chapters. Nehemiah 7: WLC runs one lower than the KJV from KJV 7:69 on (KJV 7:70 = WLC 7:69). Ezra 4:8–6:18 and 7:12–26 are Aramaic; say “Aramaic of the Hebrew Bible (WLC)” when quoting them.
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them, and **do not re-issue in Nehemiah, Haggai or Zechariah**: Nehemiah 7:13, 7:17, 7:20, 7:38, 7:44 (five family counts), 7:66 (the total 42,360 against the sum of the list, both books), 7:70–72 (the gifts), 7:28, 7:32, 7:42 and 7:5 (context); Haggai 2:18 (the day the foundation was laid), 2:10 and 2:15; Zechariah 4:9 (Zerubbabel laid the foundation); Nehemiah 2:1 and 13:6, Esther 1:1 and Daniel 9:1 (context in Q records). The Q on Ahasuerus and Artaxerxes covers the question of which kings are meant; do not re-issue it for Esther 1:1 or Nehemiah 2:1.
- Still open for Nehemiah: the names of Ezra 2:2 against Nehemiah 7:7 and the other count pairs of the two lists were not issued (names and spelling; the records say the collation is not complete). The Greek of Nehemiah 7 was not compared with anything.
- Considered and not issued (reasons in the notes file): Zechariah “son of Iddo” (5:1) beside Zechariah 1:1; Ezra’s line (7:1–5) beside 1 Chronicles 6; the two departure dates (7:9, 8:31); 10:15 for H; Greek “king of Babylon” at 8:1.
- Held back, quotes sourced: Brenton’s Greek at 6:14 (adds “and the Levites”), 6:6, 4:23, 8:27, 10:38, 1:9, 3:10.
- Still open for a later session: Amos 5:25 beside the wilderness sacrifices (Amos); which Zacharias is meant at Matthew 23:35 (Matthew).
- A here-document on a Bash command line worked this session when it was the first thing on the line and the commands that follow were on later lines; the file tool is still the safer way.
- Work folder: `%TEMP%\claude\ezr` (same scripts as `c2`; `build.mjs` has whole-verse helpers `HF` and `GF`, a number-word parser `num` with asserted sums, and `REG()` for the Nehemiah 7:5 quotation; `cmp.mjs` sets Ezra 2 beside Nehemiah 7; `en.mjs` prints Brenton’s English of whole chapters; `look.mjs` prints chosen verses in KJV, Hebrew and Greek; cache of all 10 chapters plus Nehemiah 7, 8 and 12 in WLC and Brenton’s English). For Nehemiah copy this folder, change the book number (16), the chapter count (13) and the Greek page rule in `fetch.mjs`, the file names in `head.mjs`, and the book index (15) and name in `numscan.mjs`.

## Lessons from Codex’s 2 Chronicles and Ezra integration (2026-10-13)

Codex accepted everything (2 Chronicles: 10 as written, 4 corrected; its Q: 1 as written, 2 corrected; Ezra: 8 as written, 3 corrected; its Q: 2 as written, 1 corrected; none held, nothing for the owner). Reasons are in `research/notes/claude-ready-2-chronicles-1-36-2026-10-13.md`, `claude-ready-ezra-1-10-2026-10-13.md`, the two `-q-` files and their `-decisions.json`.

- **Do not write that two statements can both be right “only if” something.** An exclusive reconciliation claim was removed. Name possible reconciliations as possibilities.
- **An arithmetic gap does not show that every person should have been in the list.** State the sum and the total; do not say what the list ought to contain.
- **A conjunction in the KJV (“even”) does not by itself make two dates the same.** Make the attachment conditional.
- **Different names do not show that a reader could not connect the people.** Say the names differ; do not say they cannot be one person.
- **Narrative order does not establish cause**, and the composition of a writing is not its delivery.
- **Keep the qualifying KJV word in the quotation** (“war … all their days” lost a word that mattered).
- Narrow every absence to the verses quoted — again.

## Notes from the Nehemiah session (2026-10-13)

- Nehemiah is in `nehemiah-1-13-records.json` (11 records: 2 H+G, 7 G, 2 untagged, no V; 9 carry `sides`) and `nehemiah-1-13-q-records.json` (3 Q: Chisleu and Nisan both in the twentieth year 1:1 and 2:1; which breaking of the wall is reported 1:3; the wood offering “as it is written in the law” 10:34). Awaiting Codex. **Next: Esther, full review with Q.**
- **Batches Codex has not processed when this session ended: Nehemiah only (one).** Every batch up to and including Ezra is processed.
- **Verse numbers:** Brenton’s Greek prints Nehemiah chapter *c* at `grcbrent/EZR{c+10}.htm`. KJV 4:1–6 = Hebrew 3:33–38 and KJV 4:7–23 = Hebrew and Greek 4:1–17. WLC has no verse for KJV 7:68, so KJV 7:69–73 = WLC 7:68–72; Brenton keeps the KJV numbers and prints no 68. KJV 9:38 = Hebrew and Greek 10:1, so chapter 10 runs one ahead. Brenton’s chapter 3 prints 6a for KJV 3:7; chapter 11 prints no 16, 20, 21, 28, 29, 32–35; chapter 12 prints no 4–6, 38, 40, 41.
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them: Ezra 3:4 (the feast of tabernacles kept), Ezra 2:66–67 and 2:21–22, Ezra 10:6, Leviticus 23:42 and 2 Chronicles 8:13 (context), Numbers 14:4 (context), Zechariah 7:1 and Esther 3:7 (the month numbers, context in a Q; **do not issue a Q on the months in Esther or Zechariah**), 2 Kings 25:10 and Ezra 4:12, 4:23 (context in a Q), Leviticus 6:12 and 1:7 (context in a Q).
- An H+G was issued for a whole verse the KJV has and the Hebrew edition lacks (7:68). Codex was told it may hold the H. Wait for its view before issuing another H that rests on an absent verse. It was not logged in `owner-questions.md`, because the standing test (a shown difference of meaning) was judged to cover it; if Codex lists it under “Needs owner”, log it then.
- An H+G on a name was issued under the proper-names rule (“tower of Meah” / “tower of the hundred”, 3:1 and 12:39).
- No V: every breach told is rebuked in the passage.
- Considered and not issued (reasons in the notes file): Nehemiah 11 beside 1 Chronicles 9; 7:7 beside Ezra 2:2; the third of a shekel (10:32); the branches of 8:15 beside Leviticus 23:40; “the book of the chronicles” (12:23); “Darius the Persian” (12:22).
- Held back, quotes sourced: Brenton’s Greek at 3:8 (“fortified”), 2:1 (“the wine was before me”, “there was not another before him”), 12:4–6 (nine names not printed), 7:73 (no clause about the seventh month), 1:3 (“walls”).
- Still open for a later session: Amos 5:25 beside the wilderness sacrifices (Amos); which Zacharias is meant at Matthew 23:35 (Matthew).
- **For Esther:** bolls.life book number 17, packaged KJV index 16, code `EST`. Brenton’s Greek Esther is expected to be longer than the Hebrew; check which page addresses answer and how any added verses are labelled before quoting, and apply the additions rule (a Greek plus qualifies when it says something the KJV does not state in the same passage). Do not re-issue the question of which king Ahasuerus is (published from Ezra 4) or a Q on the month Nisan.
- A bug to avoid: chapter numbers read back from a `"name|chapter"` key are strings, so `c + 10` made `EZR310`. `head.mjs` now uses `+c + 10`. The address check (`urls.mjs`) caught it; always run it before writing.
- A here-document on a Bash call that also holds other commands failed twice this session (once it ran past the time limit, once it broke on an apostrophe). Write scripts with the file tool.
- Work folder: `%TEMP%\claude\neh` (same scripts as `ezr`; the records are in `nb.mjs`, which imports `head.mjs`; `lab.mjs` prints the verse counts of KJV, WLC and Brenton per chapter with missing and lettered labels — run it first in every book; cache of all 13 chapters in WLC, Brenton Greek as `br-NEH{cc}.htm` and Brenton English, plus the Ezra cache). For Esther copy this folder, change the book number (17), code (`EST`), chapter count (10) and the Greek page rule in `fetch.mjs` and `uB` in `head.mjs`, the file names in `head.mjs`, and the book index (16) and name in `numscan.mjs`, `lab.mjs` and `en.mjs`.

## Notes from the Esther session (2026-10-13)

- Esther is in `esther-1-10-records.json` (11 records: 11 G, no H, no V, no untagged; all carry `sides`) and `esther-1-10-q-records.json` (3 Q: who had been carried away with Jeconiah, Mordecai or Kish 2:6; why Mordecai did not bow 3:2; deliverance “from another place” 4:14). Awaiting Codex. **Next: Job, full review with Q, in parts.**
- **Batches Codex has not processed when this session ended: Nehemiah and Esther (two).** Every batch up to and including Ezra is processed. Two is within the limit, so the next run may work; a run that finds three must stop quietly.
- **Brenton’s Greek Esther is at `grcbrent/ESG{cc}.htm`** (`EST{cc}.htm` answers 404); its English is at `eng-Brenton/ESG{cc}.htm`. It prints added passages under lettered labels (1:1b–1s, 3:13a–g, 4:17a–z, 5:1a–f, 5:2a–b, 8:12a–x, 10:3a–l). On the chapter 1 page the label `1` opens the added passage and the sentence matching KJV 1:1 is labelled `1s`. It prints no 4:6, 9:5 or 9:30. No numbering offsets in WLC.
- **Before a book’s session, check that its Greek page code answers.** Books whose Greek differs much from the Hebrew may have their own code (Esther `ESG`; Daniel gave 404 at `DAN08.htm` earlier and may be the same case). The index at `https://ebible.org/grcbrent/` is drawn by script and lists no codes in its HTML; try the likely code with a request.
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them: Ezra 4:6–7 (the king’s name; context), 1 Samuel 15:8 (Agag; context), 2 Kings 24:15 and Jeremiah 24:1 (Jeconiah carried away; context in a Q; do not issue a Q on Mordecai’s age in Jeremiah), Genesis 23:7 and 1 Samuel 24:8 (bowing to men; context in a Q).
- A G record on the king’s name (Ahasuerus in the KJV, Artaxerxes in the Greek) was issued at Esther 1:1 beside the published Ezra 4 question. Codex was told it may hold it as a duplicate. Wait for its view before issuing another G on a king’s name (Daniel has the same kind of difference).
- No H: the Hebrew was read only at the verses listed in the notes file; two candidates (“green” 1:6; “mules, camels, and young dromedaries” 8:10, 8:14) would need a dictionary source and were left out. No V. No untagged conflict found.
- Considered and not issued (reasons in the notes files): the Greek-internal tensions (the chamberlains’ plot told twice; Haman’s family hanged at 8:12r), the names of the seven chamberlains and princes, why Esther hid her people, the second gathering of the virgins (2:19).
- Held back, quotes sourced: Brenton’s Greek at 2:21, 1:1r, 8:11, 8:17 (“were circumcised”), 9:5, 2:19, 6:8, 9:19–22, 9:31, 10:1, 4:1, 7:4.
- Still open for a later session: Amos 5:25 beside the wilderness sacrifices (Amos); which Zacharias is meant at Matthew 23:35 (Matthew).
- **For Job:** bolls.life book number 18, packaged KJV index 17, code `JOB` (check that it answers for the Greek). Brenton’s Greek Job is expected to be shorter than the Hebrew in places and to carry an added ending after 42:17 and a longer speech of Job’s wife at 2:9; run `lab.mjs` first. Natural breaks: the prologue and first cycle of speeches (1–14), the second cycle (15–21), the third cycle and Job’s closing speeches (22–31), Elihu (32–37), the Lord’s speeches and the epilogue (38–42). Much of the book is poetry: do not read poetry as science, and expect most records to be Greek wording.
- All quotation assertions passed on the first run with every string in the records file written as a template string and the edits applied by exact-string replacement (`ed.mjs`).
- Work folder: `%TEMP%\claude\est` (same scripts as `neh`; the records are in `eb.mjs`; `dump.mjs` prints a whole Brenton chapter with its printed labels, lettered verses included — `en.txt` and `br.txt` hold the whole book; `look.mjs` takes `chapter:verse[:khg]` arguments; `G()` accepts a lettered label as a string). For Job copy this folder, change the book number (18), code and chapter count in `fetch.mjs`, `uB` and the file names in `head.mjs`, and the book index (17) and name in `numscan.mjs`, `lab.mjs`, `en.mjs`, `dump.mjs` and `look.mjs`.

## Lessons from Codex’s Nehemiah and Esther integration (2026-10-13)

Codex accepted 10 of 11 Nehemiah records (8 as written, 2 corrected, 1 held), all 3 Nehemiah Q (1 corrected), all 11 Esther records (2 corrected) and all 3 Esther Q (1 corrected). Reasons are in `research/notes/claude-ready-nehemiah-1-13-2026-10-13.md`, `claude-ready-esther-1-10-2026-10-13.md`, the two `-q-` files and their `-decisions.json`.

- **Held, and listed under “Needs owner”:** `booths-not-done-since-jeshua-the-son-of-nun-or-feast-of-tabernacles-kept` (Nehemiah 8:17 with Ezra 3:4). A conflict between two books belongs to the earlier book’s session; Ezra was already decided, and no exception was given for a late finding. Decided: it stays held; logged in `owner-questions.md`; do not log it again and do not re-issue it.
- **Do not write a conflict whose other verse is in a book already finished.** If such a conflict is seen late, leave it out and name it in the notes file under “considered and not issued”. A G or H record on this book’s own verse may still cite an earlier book as context.
- **The H+G for a verse the Hebrew edition lacks was accepted** (Nehemiah 7:68), and so was the H+G on a name made of ordinary words (“tower of Meah”).
- **The G on a king’s name was accepted** beside the published Ezra 4 question (Esther 1:1). The same may be done in Daniel if it qualifies there.
- **In Q records, do not write that readings “have been given” or “offered by others”** without a source. Write “Possible readings:”.
- **State a year or calendar reckoning as an assumption**, not as a fact (Nehemiah 1:1 with 2:1).
- **Order of telling is not order of events** (Esther 8:9), and deliverance of a people does not show that every member survived (Esther 4:14).
- Limit a claim about neighbouring verses to “some verses” unless every one was checked; narrow every absence to the verses quoted — again.

## Job: plan of parts (written by the first Job session, 2026-10-13)

Job has 42 chapters and is done in two parts, divided where the second cycle of speeches ends:

1. **Job 1–21** — the prologue and the first two cycles of speeches. **Done**: `job-1-21-records.json`, `job-1-21-q-records.json`.
2. **Job 22–42** — the third cycle, Job’s closing speeches, Elihu, the Lord’s speeches and the epilogue. **Done**: `job-22-42-records.json`, `job-22-42-q-records.json`. Job is finished.

## Notes from the Job 1–21 session (2026-10-13)

- Job 1–21 is in `job-1-21-records.json` (12 records: 12 G, no H, no V, no untagged; all carry `sides`) and `job-1-21-q-records.json` (3 Q: Satan’s standing among the sons of God 1:6; where Uz was and when Job lived 1:1; who the redeemer is 19:25). Awaiting Codex. **Next: Job 22–42, full review with Q.**
- **Batches Codex has not processed when this session ended: Job 1–21 only (one).** Every batch up to and including Esther is processed.
- **Verse numbers:** in chapters 1–21 WLC and Brenton’s Greek print every KJV verse number. Brenton’s Greek adds lettered verses 2:9a–9e (the wife’s speech) and 19:4a. Brenton’s Greek Job is at `grcbrent/JOB{cc}.htm` and answers. **KJV 41:1 is WLC 40:25** (the Hebrew of chapters 40–41 is numbered differently; check `lab.mjs` and the Hebrew numbers before quoting in part 2). Brenton’s chapter 42 prints 17a–17e after verse 17.
- Records issued here that rest on verses of the second part or of other books — check `data/evidence.json` before proposing anything at them: Job 41:1 (“leviathan”, context in the 3:8 record); Job 42:17 with the Greek 42:17b and 17c (quoted in the Uz question; **the Greek ending 42:17a–e may still be issued as a G record in part 2**, and 17a, 17d and 17e were not quoted); Genesis 10:23, 36:28 and 36:33, Jeremiah 25:20, Lamentations 4:21, Ezekiel 14:14, James 5:11 (Uz and Job, context; do not issue a Q on Uz in Jeremiah or Lamentations); 1 Chronicles 21:1, Psalms 109:6, Zechariah 3:1–2, Revelation 12:10 (Satan, context; do not re-issue the question of Satan’s standing in Zechariah); Proverbs 23:11 and Isaiah 44:6 (redeemer, context).
- No H: two candidates (“curse” for the Hebrew verb of blessing at 1:11 and 2:5; “their mourning” at 3:8 where the Hebrew word has the letters of “leviathan”) were issued as G only and logged in `owner-questions.md`; do not log them again. Do not tag H in part 2 on a word because the KJV renders it otherwise elsewhere (for example “the proud” for the Hebrew word at 26:12).
- No V and no untagged conflict. The speeches are verse; a speaker’s statement set against another book was not issued (the published `exp-late-17-42-7` says the book corrects its own speakers).
- Considered and not issued (reasons in the notes files): 14:14 (Brenton’s Greek can be read as the same question), 7:9 and 14:12 beside verses on rising from the grave (1 Samuel 2:6 is in a finished book; John 5:28–29 would rest on a speech in verse), “perfect and upright” (1:1) beside Romans 3:23, the fire “of God” (1:16), the Greek plus at 1:21.
- Held back, quotes sourced: Brenton’s Greek at 5:1 (“holy angels” for “saints”), 9:13 (“whales under heaven” for “the proud helpers”), 7:20 (“If I have sinned”), 9:33 (“Would that there were our mediator”), 5:7 (“the young of the vulture” for “sparks”), 20:15 (“an angel” for “God”), 21:22, 1:3 (“she-asses of the pastures”, “great works on the earth”), 1:1 (four terms for two), 19:3 (no “ten times”), 19:4a.
- **For Job 22–42:** candidates — the Greek ending 42:17a–e (Job’s resurrection “it is written”, the borders of Idumea and Arabia, Jobab, the kings of Edom, the friends as kings); the sons of God at 38:7 in the Greek; “the proud” (26:12) and “leviathan” (41:1) in the Greek; the daughters’ and sons’ number at 42:13 in the Greek; Job’s years at 42:16 in the Greek. A Q candidate: why Elihu is not named in the prologue or in the Lord’s verdict (32:2 with 42:7). Do not re-issue the published `exp-late-17-42-7` (42:7), the Uz question, or the Q on the redeemer.
- Still open for a later session: Amos 5:25 beside the wilderness sacrifices (Amos); which Zacharias is meant at Matthew 23:35 (Matthew).
- All quotation assertions passed on the first run. Seven wording edits were then applied by exact-string replacement (`ed.mjs`).
- Work folder: `%TEMP%\claude\job` (same scripts as `est`; the records are in `jb.mjs`; cache of chapters 1–21 and 40–42 in WLC, Brenton Greek and Brenton English). For part 2 keep this folder: change the chapter range in `fetch.mjs`, `lab.mjs`, `numscan.mjs` and `dump.mjs` to 22–42, the file names in `head.mjs` to `job-22-42`, and start a new records file (`jc.mjs`) that imports `head.mjs`.

## Notes from the Job 22–42 session (2026-10-13)

- Job 22–42 is in `job-22-42-records.json` (13 records: 13 G, no H, no V, no untagged; all carry `sides`) and `job-22-42-q-records.json` (3 Q: why Elihu is not named in the Lord’s verdict 32:2 and 42:7; which words of Job were “right” 42:7; what creatures behemoth and leviathan are 40:15 and 41:1). Awaiting Codex. **Job is finished. Next: Psalms 1–41, full review with Q.**
- **Batches Codex has not processed when this session ended: Job 1–21 and Job 22–42 (two).** Every batch up to and including Esther is processed. Two is within the limit, so the next run may work; a run that finds three must stop quietly. (The two Job parts are two batches: each has its own records and notes files.)
- **Verse numbers:** KJV 40:1–24 = WLC and Brenton 40:1–24; KJV 41:1–8 = their 40:25–32; KJV 41:9–34 = their 41:1–26. Brenton’s Greek prints no 23:14 and no 35:3, and prints lettered verses 23:15a, 36:28a–b and 42:17a–e. Elsewhere in 22–42 the counts match.
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them: Genesis 36:32–35 (the kings of Edom, context in the Greek-ending record); Psalms 74:14 and 104:26 and Isaiah 27:1 (leviathan, context in a Q; **do not issue a Q on what leviathan is in the Psalms or Isaiah sessions**; a G record on the Greek wording of those verses is still open there if it qualifies).
- The Greek ending (42:17a–e) is issued as one G record. Codex was told the sentence about rising again (17a) can be issued separately if it prefers; wait for its view.
- Four short English quotations from Brenton’s own English pages stand in scopes with their addresses, asserted by script (`EN()` in `jc.mjs`). This was done so that a gloss of an unusual Greek word rests on a printed page and not on a dictionary claim. Wait for Codex’s view before making it a habit.
- No H: the candidates (22:30 “the island of the innocent”; 26:12 “the proud”) would need a dictionary source and were left out, as in part 1; not logged again in `owner-questions.md`. No V. No untagged conflict: 42:11 beside 2:7 would be a conflict with part 1, which is finished, and was left out.
- Considered and not issued (reasons in the notes files): the star names (38:31–32), the birds of 39:13, 35:4, the absent Greek verses 23:14 and 35:3, the Greek pluses 23:15a and 36:28a–b, Zophar’s missing third speech, who speaks chapter 28.
- Held back, quotes sourced: Brenton’s Greek at 40:20, 38:32, 31:35, 24:1, 37:18, 32:1, 32:2, 42:7 (“Thou hast sinned”), 42:10, 42:12.
- Still open for a later session: Amos 5:25 beside the wilderness sacrifices (Amos); which Zacharias is meant at Matthew 23:35 (Matthew).
- A here-document that is the only thing after `cat > file <<'EOF'` and is followed by commands on later lines worked three times this session. A `sed` that puts a straight apostrophe inside a single-quoted JavaScript string broke the script once; use a template string.
- **For Psalms 1–41:** bolls.life book number 19, packaged KJV index 18, code `PSA` with **three-digit** chapter numbers (`PSA001.htm`; `pad()` in `o.mjs` and `fetch.mjs` already allow for it). **Brenton’s Greek numbers the Psalms differently from the KJV**: expect KJV 9 and 10 to be one Greek psalm, so that from KJV 11 to 113 the Greek number is one lower, with further joins and splits near 114–116 and 147; confirm this from the fetched pages before quoting anything, and build the address from the Greek number. **Titles count as verse 1 in the Hebrew and the Greek in many psalms**, so verse numbers run one (sometimes two) ahead of the KJV; the packaged KJV may hold the title outside the verses. Run `lab.mjs` first and write the table of offsets into the notes file. `refs` and `sides` take KJV numbers; quote the Hebrew and Greek at their own numbers and say so. The Psalms are verse: do not read poetry as science, do not set one psalm’s figure of speech against another book, and expect most records to be Greek wording and New Testament quotations of a psalm (check `data/evidence.json` first: Psalms 78:60–61, 97:7 and 109:6 already carry records or context). Do not issue a Q on Shiloh (78:60) or on leviathan.
- Work folder: `%TEMP%\claude\job` (in Git Bash `/tmp/claude/job`; part 2 records are in `jc.mjs`, wording edits in `ed2.mjs`–`ed4.mjs`; cache of all 42 chapters in WLC, Brenton Greek and Brenton English; `en2.txt` and `br2.txt` hold Brenton’s chapters 22–42 with printed labels). For Psalms copy this folder to `%TEMP%\claude\psa`, change the book number (19), code (`PSA`), chapter range (1–41) and the Greek-number rule in `fetch.mjs` and in `uB` in `head.mjs`, the file names in `head.mjs` (`psalms-1-41`), and the book index (18) and name in `numscan.mjs`, `lab.mjs`, `en.mjs`, `dump.mjs` and `look.mjs`.

## Lessons from Codex’s Job integration (2026-10-13)

Codex accepted everything (Job 1–21: 10 as written, 2 corrected; its Q: 3 as written; Job 22–42: 12 as written, 1 corrected; its Q: all 3 corrected; none held, nothing for the owner). Reasons are in `research/notes/claude-ready-job-1-21-2026-10-13.md`, `claude-ready-job-22-42-2026-10-13.md`, the two `-q-` files and their `-decisions.json`.

- **The closing limits must name only the editions the record quotes.** Codex removed boilerplate about Hebrew quotations from Q records that quoted no Hebrew, and an empty “Fetched from” line from a KJV-only record. `head.mjs` in `%TEMP%\claude\psa` now builds the limits and `languageContext` from what was actually quoted; a KJV-only record still needs its “Fetched from” line suppressed by hand.
- **A side B that points at a verse the record does not set against side A implies a conflict.** Codex removed a chapter 1 side B from a wording record. Use side B only where the two verses themselves word the matter differently.
- **Do not decide from a transliteration that a word is a name or a common noun.** Limit the finding to the wording supplied.
- **Do not treat two descriptions as two groups** unless the text says so (“children of mine own body” and sons of concubines).
- **In Q reasoning, state implications as readings**, not as a settled division of the text.
- The Greek ending of Job was accepted as one record; the four English quotations from Brenton’s own English pages were checked and accepted. Both may be done again where needed.

## Psalms: plan of parts (owner instruction; written by the first Psalms session, 2026-10-13)

1. **Psalms 1–41** (Book I). **Done**: `psalms-1-41-records.json`, `psalms-1-41-q-records.json`.
2. **Psalms 42–72** (Book II). **Done**: `psalms-42-72-records.json`, `psalms-42-72-q-records.json`.
3. **Psalms 73–89** (Book III). **Done**: `psalms-73-89-records.json`, `psalms-73-89-q-records.json`.
4. **Psalms 90–106** (Book IV). **Done**: `psalms-90-106-records.json`, `psalms-90-106-q-records.json`.
5. **Psalms 107–134** (first half of Book V, cut where the songs of degrees end; 44 chapters in one part would exceed the 30-chapter limit). **Done**: `psalms-107-134-records.json`, `psalms-107-134-q-records.json`.
6. **Psalms 135–150**. **Done**: `psalms-135-150-records.json`, `psalms-135-150-q-records.json`. Psalms is finished.

## Notes from the Psalms 1–41 session (2026-10-13)

- Psalms 1–41 is in `psalms-1-41-records.json` (13 records: 13 G, no H, no V, no untagged; all carry `sides`, five with a side B on a New Testament verse) and `psalms-1-41-q-records.json` (3 Q: what “Selah” tells the reader or singer 3:2; what “them” refers to 12:7; which book is “the volume of the book” 40:7). Awaiting Codex. **Next: Psalms 42–72, full review with Q.**
- **Batches Codex has not processed when this session ended: Psalms 1–41 only (one).** Every batch up to and including Job 22–42 is processed.
- **Greek numbering, confirmed from the fetched pages:** Brenton’s Greek prints KJV Psalms 9 and 10 as one psalm (Greek 9, 39 verses). KJV 1–8 = Greek 1–8; KJV 9:v = Greek 9:(v+1); KJV 10:v = Greek 9:(v+21); **from KJV 11 on, Greek psalm = KJV psalm − 1**, so the page for KJV Psalm 42 is `grcbrent/PSA041.htm` (already in the cache). This holds for the whole of the next three parts (up to KJV 113); check the joins near KJV 114–116 and 147 in the last part. In `pb.mjs` the helper `G()` takes the **Greek** psalm and verse numbers and `H()` the Hebrew verse number; the source label says “(Greek numbering)”.
- **Titles:** the packaged KJV does not hold the psalm titles, so nothing in a title can be quoted from the KJV or given a side. WLC and Brenton count a title as verse 1 in Psalms 3–9, 12, 18–22, 30, 31, 34, 36, 38–41 and run one ahead there; elsewhere a title is printed inside verse 1. In Book II expect more of this, and **two-verse titles (Psalms 51, 52, 54, 60) where the Hebrew runs two ahead**. `lab.mjs` prints the counts; `chk.mjs` confirms that the Greek offset equals the Hebrew offset psalm by psalm; `pv.mjs c:v` prints a KJV verse with the Hebrew and Greek at that number and the next.
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them, and **do not re-issue in those books’ sessions**: Revelation 2:27 (“rule them with a rod of iron”; 12:5 and 19:15 were not compared), Ephesians 4:26, Matthew 21:16, Matthew 27:46 (Mark 15:34 not compared), Romans 3:10–18, Romans 10:18, Hebrews 10:5 and 10:7; context only: Psalms 140:3, Isaiah 59:7–8, Habakkuk 3:3. Psalm 53:3 repeats 14:3 and was not compared: **do not issue the Romans 3 addition again at Psalm 53**; a difference between the Greek of 53 and the KJV is still open there. Psalm 70 repeats 40:13–17 and Psalm 108 repeats parts of 57 and 60.
- No H: two candidates (22:16 “they pierced” where the Leningrad text has the letters of “like a lion”; 8:5 “angels” where the Hebrew has the word usually rendered “God”) were left out and logged in `owner-questions.md`; do not log them again, and do not tag H in later psalms on the same ground (82:1 and 82:6, 97:7, 138:1 have the same word). No V. No untagged conflict: verses of a psalm were not set against other books.
- Still to do in later parts if they qualify: New Testament quotations where the KJV psalm and the KJV New Testament word the sentence differently and the Greek psalm sides with the New Testament (candidates: 45:6–7 with Hebrews 1:8–9; 51:4 with Romans 3:4; 68:18 with Ephesians 4:8; 69:22–23 with Romans 11:9–10; 95:7–11 with Hebrews 3–4; 102:25–27 with Hebrews 1:10–12; 104:4 with Hebrews 1:7; 110:1; 116:10 with 2 Corinthians 4:13; 118:22). The extra Greek psalm (151) is outside the KJV; if Brenton prints it, it may be one G record in the last part.
- Considered and not issued (reasons in the notes files): 16:10, Psalm 18 beside 2 Samuel 22, the title of Psalm 34 beside 1 Samuel 21, Psalm 14 beside 53, 2:7 as a Q, 6:5 and 30:9 as a Q.
- Held back, quotes sourced: Brenton’s Greek at 29:6, 33:7, 17:15, 37:28, 9:16, 12:5; the joining of Psalms 9 and 10.
- Still open for a later session: Amos 5:25 beside the wilderness sacrifices (Amos); which Zacharias is meant at Matthew 23:35 (Matthew).
- The build’s word-ban check rejects any word containing “ruling” — it caught “ruling with an iron rod”; write “to rule”.
- Bolls.life book numbers: Psalms 19, Habakkuk 35, Matthew 40, Romans 45, Ephesians 49, Hebrews 58, Revelation 66. No 429 with three requests at a time.
- Work folder: `%TEMP%\claude\psa` (in Git Bash `/tmp/claude/psa`; the records are in `pb.mjs`; wording edits in `ed.mjs`–`ed4.mjs`; cache of Psalms 1–41 in WLC and of Greek Psalms 1–41 in Brenton Greek and English, plus the New Testament chapters). For Psalms 42–72 keep this folder: change the chapter range in `fetch.mjs` (WLC 42–72; Brenton pages 41–71), `lab.mjs` and `chk.mjs`, the file names in `head.mjs` to `psalms-42-72`, and start a new records file (`pc.mjs`) that imports `head.mjs`. `numscan.mjs`, `dump.mjs`, `en.mjs` and `look.mjs` still point at Job and were not used.

## Notes from the Psalms 42–72 session (2026-10-13)

- Psalms 42–72 is in `psalms-42-72-records.json` (20 records: 20 G, no H, no V, no untagged; all carry `sides`, three with a side B on a New Testament verse: Romans 3:4, Ephesians 4:8, Romans 11:9) and `psalms-42-72-q-records.json` (3 Q: who the king of Psalm 45 is and who is called “God” 45:6; who the friend of Psalm 55 is 55:13; what “the book of the living” is 69:28). Awaiting Codex. **Next: Psalms 73–89, full review with Q.**
- **Batches Codex has not processed when this session ended: Psalms 1–41 and Psalms 42–72 (two).** Every batch up to and including Job 22–42 is processed. Two is within the limit, so the next run may work; a run that finds three must stop quietly.
- **Verse numbers:** Greek psalm = KJV psalm − 1 for the whole part. Hebrew and Greek run one ahead of the KJV in 42, 44–49, 53, 55–59, 61–65, 67–70; two ahead in 51, 52, 54 and 60; no difference in 43, 50, 66, 71 and 72. Offsets agree between the Hebrew and the Greek in every psalm. Brenton’s Greek prints no lettered verses in this part. `lab2.mjs` prints the table.
- **Method that worked:** `scan2.mjs` sets each KJV verse beside Brenton’s English of the matching Greek verse and prints those with low word overlap; `scan3.mjs` prints verses whose number words or proper names differ; `pv2.mjs c:v[:span]` prints a KJV verse with the Hebrew and Greek at the right numbers. All three are in `%TEMP%claudepsa`. Use them in Psalms 73–150 (change the range).
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them, and **do not re-issue in those books’ sessions**: Romans 3:4 (justified in thy sayings; do not re-issue in Romans), Romans 11:9–10 (the table a snare), Ephesians 4:8 (gifts received or given; do not re-issue in Ephesians). Context only: Hebrews 1:8–9, Exodus 32:32–33, Philippians 4:3, Revelation 20:12.
- No H: candidates that would need a dictionary source (72:9 “wilderness” against “Ethiopians”, 60:8 “washpot”, 45:13 “within”) were issued as G only. No V. No untagged conflict: verses of a psalm were not set against other books beyond the three New Testament quotations.
- 50:11: the digital Hebrew text prints the word the KJV renders “wild beasts” with a letter missing at that word, so the Hebrew of that clause is not quoted. Do not quote it without checking another edition.
- Considered and not issued (reasons in the notes files): 60:6 (Shechem, Succoth), 68:12, 68:15 (Bashan), 69:31, 55:20–21 (the Greek differs markedly; held back to keep the batch small), 65:3, 69:20, 70:1, the Selah and title matters, and the Q candidates 51 (answered in the psalm’s Hebrew title), 72:1 and 72:20 (title question), 44 (general lament), 58:1, 49:15, 51:11.
- Held back, quotes sourced: Brenton’s Greek at 55:21 (Greek 54:21), 69:20, 69:31, 68:12, 70:1.
- Still to do in later parts if they qualify (from the Psalms 1–41 list, unchanged): 95:7–11 with Hebrews 3–4; 102:25–27 with Hebrews 1:10–12; 104:4 with Hebrews 1:7; 110:1; 116:10 with 2 Corinthians 4:13; 118:22; and Psalm 151 if Brenton prints it. 45:6–7 with Hebrews 1:8–9 and 69:9 with John 2:17 / Romans 15:3 were compared and show no difference; 69:25 with Acts 1:20 (“their” against “his”) is the Greek psalm and the KJV psalm against Acts and was not issued.
- Still open for a later session: Amos 5:25 beside the wilderness sacrifices (Amos); which Zacharias is meant at Matthew 23:35 (Matthew).
- A Python heredoc in the shell swallowed a sed command at the start of this session; patch scripts with Node files written by the file tool or a `cat > file` here-document that is the only thing on its line. The file tool needs the Windows path (`C:UserskevmaAppDataLocalTempclaudepsa`), not `/tmp/claude/psa`.
- Work folder: `%TEMP%claudepsa` (`head2.mjs` writes the Psalms 42–72 files; `pc.mjs` holds the records; `fix.mjs` applies exact-string patches from a JSON file; cache of Psalms 42–72 in WLC and Brenton Greek and English, plus Romans 3 and 11 and Ephesians 4). For Psalms 73–89 keep this folder: change the range in `fetch.mjs` (WLC 73–89; Brenton pages 72–88), `lab2.mjs`, `scan2.mjs`, `scan3.mjs` and the book-index/range checks at the top of a new records file (`pd.mjs`), and copy `head2.mjs` to `head3.mjs` with the file names `psalms-73-89`.

## Lessons from Codex’s Psalms 1–72 integration (2026-10-13)

Codex accepted everything (Psalms 1–41: 10 as written, 3 corrected; its Q: 3 as written; Psalms 42–72: 16 as written, 4 corrected; its Q: 1 as written, 2 corrected; none held, nothing for the owner). Reasons are in `research/notes/claude-ready-psalms-1-41-2026-10-13.md`, `claude-ready-psalms-42-72-2026-10-13.md`, the two `-q-` files and their `-decisions.json`.

- **Do not claim that “none of the readings is stated” when a quoted New Testament verse gives its own application** (Hebrews 1:8 at Psalm 45:6). Say what the verse applies and that the record does not say whether that settles the psalm’s own setting.
- **Do not settle identity across verse groups where the scope leaves it open**; retain the actions the text states (Psalm 55).
- **Do not claim identical inflection when a shared verb differs in person** (Psalm 2:9 against Revelation 2:27).
- **Distinguish being angry from inflicting wrath**; do not assert a contradiction between a state and its expression (Psalm 7:11).
- **Do not infer a count of one from a singular form**; make the collective reading explicit (Psalm 68:17).
- **Keep punctuation exactly as the supplied WLC verse prints it**; a medial full stop absent from the edition was removed (Psalm 47:10).
- Greek psalm numbers in a summary must be the Greek numbers (a summary that used KJV numbers was corrected).

## Notes from the Psalms 73–89 session (2026-10-13)

- Psalms 73–89 is in `psalms-73-89-records.json` (16 records: 16 G, no H, no V, no untagged; all carry `sides`, one with a side B at Psalms 80:17) and `psalms-73-89-q-records.json` (3 Q: which destruction of the sanctuary Psalms 74 and 79 lament 74:7 and 79:1; who the “gods” of Psalm 82 are 82:1 and 82:6; whose casting off Psalm 89 laments 89:38–39). Awaiting Codex. **Next: Psalms 90–106, full review with Q.**
- **Batches Codex has not processed when this session ended: Psalms 73–89 only (one).** Every batch up to and including Psalms 42–72 is processed.
- **Verse numbers:** Greek psalm = KJV psalm − 1 for the whole part. Hebrew and Greek run one ahead of the KJV in 75–77, 80, 81, 83–85, 88 and 89; no difference in 73, 74, 78, 79, 82, 86 and 87. Offsets agree between the Hebrew and the Greek in every psalm. Brenton’s Greek prints no lettered verses in this part. Brenton’s Greek 77:69 opens with “Σιὼν, ὃ ἠγάπησε” (KJV 78:68).
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them: none issued with a verse of another book as a side. Context only: 2 Kings 25:9 and John 10:34–35 (in Q records). Psalm 74:14 shares a reference with the published leviathan question; the G record there compares only the Greek wording of the last words. Do not issue a Q on the destruction of the sanctuary, the “gods” of Psalm 82 or the anointed of Psalm 89 in other sessions.
- No H: four candidates (75:6 “south”, 74:8 “synagogues”, 80:15 “branch”, 84:6 “Baca”) would need a dictionary source; three issued as G only, 75:6 left out; logged in `owner-questions.md`, do not log them again. No V. No untagged conflict.
- Considered and not issued (reasons in the notes files): 75:6, 78:24–25, 78:2 with Matthew 13:35, 73:24, name forms at 83:6–11 and 87:4, and the Q candidates 73:17, 87:4–6, 83:6–8, 80:17.
- Held back, quotes sourced: Brenton’s Greek at 74:5, 75:2, 81:6, 88:15, 89:38.
- Still to do in later parts if they qualify (unchanged from the earlier list): 95:7–11 with Hebrews 3–4; 102:25–27 with Hebrews 1:10–12; 104:4 with Hebrews 1:7; 110:1; 116:10 with 2 Corinthians 4:13; 118:22; and Psalm 151 if Brenton prints it. 78:2 with Matthew 13:35 was compared and shows no difference of meaning from the KJV psalm.
- Still open for a later session: Amos 5:25 beside the wilderness sacrifices (Amos); which Zacharias is meant at Matthew 23:35 (Matthew).
- **For Psalms 90–106:** Greek psalm = KJV psalm − 1 through 113 (KJV 90 is `grcbrent/PSA089.htm`). Check the 90–106 counts with `lab2.mjs` first; 96–99 and 104–106 have New Testament and Chronicles parallels (Psalm 96 with 1 Chronicles 16:23–33; Psalm 105:1–15 with 1 Chronicles 16:8–22; Psalm 106:1, 47–48 with 1 Chronicles 16:34–36; check `data/evidence.json` for 1 Chronicles 16 before proposing anything). Psalm 90 is headed “A Prayer of Moses”. Bolls.life book numbers are unchanged (Psalms 19; Hebrews 58).
- Method that worked: `scan2.mjs` (word overlap of the KJV against Brenton’s English at the matching number) and `scan3.mjs` (number words and proper names) with `pv2.mjs c:v[:span]`; `tok.mjs c:v` prints the Hebrew words of a verse with numbers so that `HW(c, v, i, j)` can quote them without typing Hebrew; `ovp.mjs` lists published and drafted records that cite Psalms 73–89 (change the pattern).
- Work folder: `%TEMP%claudepsb` (`head3.mjs` writes the Psalms 73–89 files; `pd.mjs` holds the records; `edp*.mjs` are exact-string patches; cache of Psalms 73–89 in WLC and Brenton Greek and English). For Psalms 90–106 copy this folder, change the range in `fetch.mjs` (WLC 90–106; Brenton pages 89–105), `lab2.mjs`, `scan2.mjs`, `scan3.mjs`, the offsets table at the top of a new records file and the file names in `head3.mjs` (`psalms-90-106`, also the `startsWith` filter in `finish`).

## Lessons from Codex’s Psalms 73–89 integration (2026-10-13)

Codex accepted all 16 and all 3 Q (4 and 1 corrected; none held; nothing for the owner). Reasons are in `research/notes/claude-ready-psalms-73-89-2026-10-13.md`, `claude-ready-psalms-73-89-q-2026-10-13.md` and their `-decisions.json`.

- **Inflected forms and the actor of a clause must be stated precisely** (`the-wrath-of-man-shall-praise-thee-…`: noun forms, and who acts in the second clause).
- **Do not say two Hebrew clauses “print the same words”** unless they do; keep the distinction of noun and verb form (`the-branch-that-thou-madest-strong-…`).
- **Do not settle the referent of a Greek pronoun** that the text leaves unstated (`valley-of-baca-…`).
- **Brenton’s English rendering of a supplied object or of a praise referent is a rendering, not an explicit Greek pronoun**; say so (`shall-the-dead-arise-…`).
- **A Q that uses another book as context for a possible reading is accepted** when the record says it is context and not a cross-book finding; **limit an absence claim to the psalm verses** (Psalms 74 and 79: 2 Kings 25:9 reports a burning).

## Notes from the Psalms 90–106 session (2026-10-13)

- Psalms 90–106 is in `psalms-90-106-records.json` (16 records: 16 G, no H, no V, no untagged; all carry `sides`, two with a side B on a New Testament verse: Hebrews 3:8 and Hebrews 1:12) and `psalms-90-106-q-records.json` (3 Q: who “they” are who “rebelled not” 105:28; which event Psalm 104:6–9 describes; whose spirit is provoked 106:33). Awaiting Codex. **Next: Psalms 107–150, full review with Q.**
- **Batches Codex has not processed when this session ended: Psalms 90–106 only (one).** Every batch up to and including Psalms 73–89 is processed.
- **Verse numbers:** Greek psalm = KJV psalm − 1 for the whole part. Hebrew and Greek run one ahead of the KJV in 92 and 102; no difference in the other fifteen. Offsets agree between Hebrew and Greek in every psalm. Brenton’s Greek prints no lettered verses here. The Greek page and the English page of Brenton divide two verses differently (Greek 89:11/12 and 94:3/4); the records quote each where it prints it.
- **For Psalms 107–150:** the Greek-number rule still holds through KJV 113 (Greek 112). The joins and splits are near KJV 114–116 and 147 (from the usual Septuagint numbering, to be confirmed from the fetched pages with `lab2.mjs` before quoting: Greek 113 holds KJV 114 and 115 together; Greek 114 and 115 are the two halves of KJV 116; Greek 116 is KJV 117, and the Greek number stays one lower up to KJV 146; Greek 146 and 147 are the two halves of KJV 147; from KJV 148 the numbers agree). Psalm 119 has 176 verses; Psalms 120–134 are the songs of degrees; Psalm 151 may be printed by Brenton outside the KJV (one G record at most). Candidates still open from the earlier lists: 110:1 (Matthew 22:44 and parallels), 116:10 with 2 Corinthians 4:13, 118:22 with Matthew 21:42 and parallels, 109:8 with Acts 1:20 (and 69:25, compared in the Psalms 42–72 session and not issued). Check `data/evidence.json` for Psalms 109:6 before proposing anything there (a published record cites it). Psalm 108 repeats parts of Psalms 57 and 60; Psalm 144 repeats parts of Psalm 18; Psalm 151 is outside the KJV.
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them: Hebrews 3:8 (the day of temptation; do not re-issue it in Hebrews), Hebrews 1:12 (“fold” and “change”; do not re-issue in Hebrews — the Tischendorf and Textus Receptus difference is stated there). Context only: Genesis 1:9, 7:19, 9:11 (the Q on 104:6–9; do not issue a Q on the waters of Psalm 104 in other sessions), Numbers 20:10 and 20:12, Isaiah 63:10 (the Q on 106:33).
- **Chronicles parallels not issued, on purpose.** Psalm 96 (with 1 Chronicles 16:23–33), 105:1–15 (with 16:8–22) and 106:1, 47–48 (with 16:34–36) differ from 1 Chronicles 16 in a few words (“Abraham” / “Israel” 105:6 and 16:13; “they” / “ye” 105:12 and 16:19; “He hath remembered” / “Be ye mindful” 105:8 and 16:15; “idols” 96:5 and 16:26). No record on 1 Chronicles 16 was issued in the 1 Chronicles session, and the rule is that such a conflict belongs to the earlier book’s session; so they were left out and named in the notes. Do not log them again, and do not issue them in a later session.
- No H: candidates (95:8 “Massah” as a name or a noun, 100:3 written and read forms, 106:30 “executed judgment”) would need a dictionary source or rest on the KJV’s own renderings; they are G only or left out. Same ground as Psalms 22:16 and 8:5 (see `owner-questions.md`); do not log them again. No V. No untagged conflict.
- Considered and not issued (reasons in the notes files): 95:10 and 95:11 with Hebrews 3–4, 104:4 with Hebrews 1:7, 91:11–12 with Matthew 4:6, the plague order of 105, animal names at 104:17–18, and the Q candidates “my rest” (95:11), the speaker of 91, “sacrifices of the dead” (106:28).
- Held back, quotes sourced: Brenton’s Greek at 101:5, 102:20, 106:29, 103:17.
- Still open for a later session: Amos 5:25 beside the wilderness sacrifices (Amos); which Zacharias is meant at Matthew 23:35 (Matthew).
- Work folder: `%TEMP%claudepsc` (in Git Bash `/tmp/claude/psc`; `head4.mjs` writes the Psalms 90–106 files; `pe.mjs` holds the records; `ed1.mjs` is an exact-string patch; cache of Psalms 90–106 in WLC and Brenton Greek and English, plus Hebrews 1–4 and 10, 1 Chronicles 16). For Psalms 107–150 copy this folder, change the range in `fetch.mjs`, `lab2.mjs`, `scan2.mjs`, `scan3.mjs`, the offsets at the top of a new records file, and the file names in `head4.mjs` (`psalms-107-150`, also the `startsWith` filter in `finish`). In a records file the Hebrew helper `HW(c, v, i, j)` takes word numbers from `tok.mjs c:v`; check the printed Hebrew of each quotation after a run (one record quoted the wrong clause until the printed Hebrew was read).
- A heredoc containing a straight apostrophe in the shell command failed with an unexpected-EOF error; write notes files with the file tool.

## Lessons from Codex’s Psalms 90–106 integration (2026-10-13)

Codex accepted all 16 (6 as written, 10 corrected) and all 3 Q (2 as written, 1 corrected); none held, nothing for the owner. Reasons are in `research/notes/claude-ready-psalms-90-106-2026-10-13.md`, `claude-ready-psalms-90-106-q-2026-10-13.md` and their `-decisions.json`.

- **Do not cite word positions of the Hebrew in the scope** (“the word printed fourth”). Ten corrections removed “inaccurate or unnecessary ordinal word positions from the Hebrew limitation”. Say “the Hebrew word at the end of the quotation” or name it by its letters, or say only that the record does not say what the Hebrew means.
- **A noun comparison does not establish a different referent** of a pronoun (leviathan, 104:26): state the noun and leave the referent open.
- **Limit an absence statement to the supplied quoted verses** — again.
- **A Q that uses another book as context for a possible reading is accepted** when the record says it is context. Restore a negative inside a quoted KJV substring.

## Notes from the Psalms 107–134 session (2026-10-13)

- Psalms 107–134 is in `psalms-107-134-records.json` (15 records: 15 T — 1 “Hebrew and Septuagint”, 14 “Septuagint”; no V, no untagged; all carry `sides`, none a side B) and `psalms-107-134-q-records.json` (3 Q: whose words the curses of 109:6–19 are; who “my Lord” is at 110:1; which turning of the captivity 126:1 recalls). Awaiting Codex. **Next: Psalms 135–150, full review with Q.**
- **The unit was cut at 134.** 44 chapters exceed the 30-chapter limit; Book V is two sessions: 107–134 (this one) and 135–150.
- **Batches Codex has not processed when this session ended: T catch-up and Psalms 107–134 (two).** Every batch up to and including Psalms 90–106 is processed. Two is within the limit; a run that finds three must stop quietly.
- **Greek numbering (confirmed from the fetched pages):** Greek = KJV − 1 for KJV 107–113; Brenton prints KJV 114 and 115 as one psalm (Greek 113, 26 verses: KJV 114:1–8 = 113:1–8, KJV 115:1–18 = 113:9–26); KJV 116:1–9 = Greek 114:1–9 and KJV 116:10–19 = Greek 115, which prints a verse 4a and no verse 5 (KJV 116:14 = 4a); KJV 117–146 = Greek 116–145; KJV 147 is Greek 146 (KJV 147:1–11) and 147 (KJV 147:12–20); KJV 148–150 are 148–150. The map is in `%TEMP%claudepsdgm.mjs`. In 107–134 the Hebrew runs one ahead only in 108 (title is verse 1). Still to confirm by `lab3.mjs` for 135–150: the Hebrew is one ahead at 140 and 142; Greek 144 (KJV 145) prints a verse 13a.
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them: Matthew 22:43–45 and Acts 2:34–36 (the question of “my Lord” at Psalm 110:1; **do not re-issue in Matthew, Mark, Luke or Acts**); the published Melchizedek and Satan Q records already cite 110:4 and 109:6 as context. **Psalm 108:7–9 repeats 60:6–8 and is covered by the published `judah-is-my-lawgiver-or-judas-is-my-king-greek`; do not re-issue.**
- Candidates held back, quotes sourced: Greek differences at 109:10 (“seek their bread … out of their desolate places” against “cast out of their habitations”), 116:11 (“in my haste” against “in mine amazement”), 120:4 (“juniper” against “of the desert”), 109:4, 109:24. Left out: 109:6 (“Satan” against “the devil”), 116:10 with 2 Corinthians 4:13 (the Hebrew conjunction’s range covers “therefore”), 109:8 with Acts 1:20, 110:1 with Matthew 22:44, 118:22 with Matthew 21:42 (wording only).
- No V; no untagged conflict. Verses were scanned by script (`scan2.mjs`: overlap against Brenton’s English; `scan3.mjs`: numbers and names) and only flagged verses read in Hebrew and Greek. 119:1–176 handled the same way; repeated lists of terms for the law were not issued.
- **Method that worked for T records:** one `rec()` per verse with `witness`, the Greek taken from Brenton at the Greek number and its English from Brenton’s own page quoted only to show how that edition renders the Greek; no lexicon claims; the scope states what is not said. `head6.mjs` now omits “Fetched from” and `languageContext` for a KJV-only (Q) record.
- **Do not write “translators”**: the build’s word-ban check rejects it (also “owner”, “italic” and any word containing “ruling”). Write “the Greek wording”.
- Still open for a later session: Amos 5:25 beside the wilderness sacrifices (Amos); which Zacharias is meant at Matthew 23:35 (Matthew).
- For Psalms 135–150: bolls.life book 19 (Psalms), packaged KJV index 18; Psalm 136 repeats “for his mercy endureth for ever” 26 times (do not issue); Psalm 137 is already cited by `exp-late-18-137-1` and `exp-late-30-1-10`; Psalm 138:1 “gods” and 140:3 (Romans 3 addition, published) are decided; Psalm 144 repeats parts of Psalm 18 (conflicts belong to the earlier part, 1–41); Psalm 151 may be printed by Brenton at `grcbrent/PSA151.htm` (check; one T record at most, outside the KJV only if the page exists). Hebrew is one ahead at 140 and 142.
- Work folder: `%TEMP%claudepsd` (in Git Bash `/tmp/claude/psd`; `pf.mjs` holds the records; `head6.mjs` writes the Psalms 107–134 files; `gm.mjs` is the Greek map; `scan2.mjs lo hi th`, `scan3.mjs lo hi`, `pv2.mjs c:v[:span]`, `tok.mjs c:v`; cache of Psalms 107–150 in WLC and of Greek pages 106–150 in Brenton Greek and English already fetched). For 135–150 copy `head6.mjs` to `head7.mjs` with the file names `psalms-135-150` (also the `startsWith` filter and the `notes exist` check), and write the records in a new file.

## Notes from the Psalms 135–150 session (2026-10-13)

- Psalms 135–150 is in `psalms-135-150-records.json` (18 records: 18 T, all witness "Septuagint"; no V, no untagged; all carry `sides`, none a side B) and `psalms-135-150-q-records.json` (3 Q: which waters “above the heavens” 148:4; which writing “the judgment written” means 149:9; who the “strange children” are 144:7 and 144:11). Awaiting Codex. **Psalms is finished. Next: Proverbs 1–31, full review with Q.**
- **Batches Codex has not processed when this session ended: T catch-up, Psalms 107–134 and Psalms 135–150 (three).** Every batch up to and including Psalms 90–106 is processed. Three is more than two: the next run must count again and stop quietly unless Codex has processed at least one of them.
- **Verse numbers:** Greek psalm = KJV psalm − 1 for KJV 135–146; KJV 147:1–11 = Greek 146 and KJV 147:12–20 = Greek 147; KJV 148–150 = Greek 148–150. Greek 144 (KJV 145) prints a verse 13a. The Hebrew runs one ahead only in 140 and 142. Psalm 151 answers at `grcbrent/PSA151.htm` (7 verses, titled “outside the number”); it is outside the KJV, so no T record can sit on it (logged in `owner-questions.md`; do not re-issue).
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them: Psalms 104:14 (context in the 147:8 plus; do not re-issue in a Psalms record), Genesis 1:6–8 and Hosea 5:7 (context in Q records; do not issue a Q on “strange children” in Hosea or on the waters above the firmament in Genesis).
- No H or G tag exists any more; all new records are T with a witness. The only difference of the Hebrew with the KJV that was stated as a fact is a word the Hebrew edition does not print (139:20 “name”, 141:7 “wood”), asserted by script; no record claims the Hebrew word means anything. 138:1 “gods” / “angels” was not re-issued (decided earlier).
- Considered and not issued (reasons in the notes files): 139:19 “Surely” / “Oh that”, 139:5, 137:9 (“stones” / “the rock”), 144:13 (numbers), 144:2, 144:12, 145:5, 147:9, 140:8 (held back, quotes sourced), 143:2 with Romans 3:20, and the Q candidates 139:15–16, 147:4, 137:7–9, 145 acrostic.
- Method that worked: `scan2.mjs 135 150 0.5` and `scan3.mjs 135 150` (flag, then read flagged verses with `pv2.mjs c:v` and `tok.mjs c:v`); `HW(c, v, i, j)` quotes Hebrew by word number; `noLetters(c, v, letters)` asserts that a Hebrew verse does not contain the letters of a word; `hitsOf(regex)` asserts a whole-Bible word search. The build’s word-ban check rejects “owner”, “ruling”, “translators” and “italic”.
- Still open for a later session: Amos 5:25 beside the wilderness sacrifices (Amos); which Zacharias is meant at Matthew 23:35 (Matthew).
- **For Proverbs:** bolls.life book number 20, packaged KJV index 19, Brenton code `PRO` (check the page answers; the Greek Proverbs is longer and reordered in places — check labels with `lab3.mjs` first and confirm whether Greek chapters 24–31 are in a different order from the Hebrew). The Hebrew and Greek verse numbers may differ through chapters 24–31. Do not re-issue any record that rests on Matthew, Romans or Hebrews quotations of Proverbs without checking `data/evidence.json` (Proverbs 3:11–12 with Hebrews 12:5–6, 10:12 and 11:31 with 1 Peter 4:8 and Romans 12:20 with Proverbs 25:21–22 are candidates). Proverbs is verse and aphorism: expect T records and a few Q.
- Work folder: `%TEMP%claudepse` (in Git Bash `/tmp/claude/pse`; `head7.mjs` writes the Psalms 135–150 files; `pg.mjs` holds the records; `ed1.mjs` is an exact-string patch; cache of Psalms 107–151 in WLC and Brenton). For Proverbs copy `head7.mjs` to `head8.mjs` with the file names `proverbs-1-31` (also the `startsWith` filter and the `notes exist` check), change the book number in `fetch.mjs` (20), the code (`PRO`), the chapter count, the book index (19) in `gm.mjs`/`lab3.mjs`/`scan2.mjs`/`scan3.mjs`/`pv2.mjs`/`tok.mjs` and the book name; the Greek number rule is the same as the Hebrew unless the pages show otherwise.

## Lessons from Codex’s T catch-up and Psalms 107–134 integration (2026-10-13)

Codex accepted 4 of 6 catch-up records (3 as written, 1 corrected, 2 held), 14 of 15 Psalms 107–134 records (10 as written, 4 corrected, 1 held) and all 3 Q (2 corrected). Reasons are in `research/notes/claude-ready-t-catch-up-1-2026-10-13.md`, `claude-ready-psalms-107-134-2026-10-13.md`, `claude-ready-psalms-107-134-q-2026-10-13.md` and their `-decisions.json`. Nothing under “Needs owner”.

- **Held: `a-little-lower-than-the-angels-or-a-little-lower-than-the-word-printed-god` (Psalms 8:5).** A scope that admits the KJV’s word lies inside the Hebrew noun’s range does not show a meaning difference; a researcher’s conditional is not an owner exception. Do not re-issue. (Logged as decided in `owner-questions.md`.)
- **Held as duplicate: `valley-of-baca-or-valley-of-weeping` (Psalms 84:6).** A Hebrew record at a verse where a published Greek record already states the same name-against-weeping comparison adds nothing unless it adds a distinct Hebrew comparison. Check published records at the verse before adding a record that only changes the witness.
- **Held: `from-the-north-and-from-the-south-or-from-the-north-and-from-the-sea` (Psalms 107:3).** A gloss taken from another verse does not establish a different meaning here, and Brenton’s English at the same verse renders the Greek word “south”. Do not rest a difference on a gloss from another verse.
- **Corrected:** the Greek half of a title must use Brenton’s own English wording, not a researcher’s rendering; an unquoted alternative rendering of a Greek conjunction was removed.
- A Hebrew record beside a published Greek record on the same verses is accepted when it adds the Hebrew printed noun or verb under the plainly-different-word rule (Psalms 80:15, Job 1:11, Job 3:8).

## Notes from the Proverbs session (2026-10-13)

- Proverbs is in `proverbs-1-31-records.json` (20 records: 20 T, all witness “Septuagint”; no V, no untagged; all carry `sides`, four with a side B on a New Testament verse: Hebrews 12:6, James 4:6, 1 Peter 4:18, 2 Corinthians 9:7) and `proverbs-1-31-q-records.json` (3 Q: what the wisdom of Proverbs 8 is 8:22; who Agur, Jakeh, Ithiel and Ucal are 30:1; who is asked after at 30:4). Awaiting Codex. **Next: Ecclesiastes and Song of Solomon (one session, two books).**
- **Batches Codex has not processed when this session ended: Psalms 135–150 and Proverbs (two).** Every batch up to and including Psalms 107–134 and the T catch-up is processed.
- **Verse numbers:** Hebrew and KJV numbers agree throughout. **Brenton’s Greek has no page for chapter 30** (`grcbrent/PRO30.htm` and `eng-Brenton/PRO30.htm` are not there); the Hebrew chapter 30 and 31:1–9 are printed inside Brenton’s chapter 24 (24:22f–t = 30:1–14; 24:35–53 = 30:15–33; 24:54–62 = 31:1–9), and Brenton’s chapter 31 prints verses 10–31 only. The Greek reorders parts of chapters 15, 16 and 20 (KJV 16:6 = Greek 15:27a; KJV 20:20–22 = Greek 20:9a–c) and omits many verses (22:6, 4:7, 13:6, 15:31, 16:1, 3, 4, 6, 18:23–24, 19:1–2, 20:14–19, 21:5, 1:16, 8:33). Lettered extra verses: 3:16a, 3:22a, 4:27a–b, 6:8a–c, 6:11a, 8:21a, 9:10a–18d, 15:27a–29a, 18:22a, 22:8a, 22:9a and others.
- Records issued here that rest on verses of other books — check `data/evidence.json` before proposing anything at them, and do not re-issue in those books’ sessions: Hebrews 12:6 (“scourgeth every son whom he receiveth”; do not re-issue in Hebrews), James 4:6 and 1 Peter 5:5 (“God resisteth the proud”; 1 Peter 5:5 not compared), 1 Peter 4:18 (do not re-issue in 1 Peter), 2 Corinthians 9:7 (do not re-issue in 2 Corinthians). Context only: Nehemiah 11:7 (Ithiel in a Q).
- **Two records rest on a verse Brenton’s Greek page does not print (22:6, 4:7).** The reasoning was the Nehemiah 7:68 precedent; both were logged in `owner-questions.md`. Wait for Codex’s view before issuing more omissions; the list above is sourced and may be issued later if accepted.
- No V; no untagged conflict (26:4 with 26:5 is published). Held back, quotes sourced: 10:10, 11:16, 13:7, 14:10, 14:34, 25:11, 31:3 (Greek differences), and the animal names at 30:26, 30:28, 30:31.
- Romans 12:20 with 25:21–22 and 1 Peter 4:8 with 10:12 were not compared with the Greek New Testament wording.
- Method that worked: `best.mjs lo hi th` finds, for each KJV verse, the best-matching verse anywhere in Brenton’s English of the book (so reordered verses are caught) and prints those below the threshold; `pv.mjs c:v[:greekChapter:label]` prints the KJV, Hebrew, Greek and English; `tok.mjs c:v` numbers the Hebrew words for `HW(c, v, i, j)`; `dump.mjs c [br|en]` prints a whole Brenton page with its printed labels.
- **Do not name a script file so that its name ends in `o.mjs`** (`pro.mjs` ran the command-line branch of `o.mjs` when an argument was passed). Do not put a here-document on a command line that has other commands.
- The build’s word-ban check rejects “owner”, “ruling”, “translators” and “italic” (including inside words).
- Work folder: `%TEMP%\claude\pro` (in Git Bash `/tmp/claude/pro`; `head8.mjs` writes the Proverbs files; `prb.mjs` holds the records; cache of all 31 Hebrew chapters, Brenton Greek and English pages and Hebrews 12, James 4, 1 Peter 4–5, 2 Corinthians 9). For the next book copy this folder, change the book number (21 for Ecclesiastes, 22 for Song of Solomon), the Brenton code (`ECC`, `SNG`; check that the pages answer), the chapter counts, the book index (20, 21) in `lib`-using scripts and the file names in `head8.mjs`.

## Lessons from Codex’s Psalms 135–150 and Proverbs integration (2026-10-13)

Codex accepted 18 of 18 Psalms 135–150 records (12 as written, 6 corrected), 2 of 3 of its Q (1 held), 18 of 20 Proverbs records (11 as written, 7 corrected, 2 held) and all 3 Proverbs Q (1 corrected). Reasons are in `research/notes/claude-ready-psalms-135-150-2026-10-13.md`, `claude-ready-proverbs-1-31-2026-10-13.md`, the two `-q-` files and their `-decisions.json`.

- **Held, “Needs owner”: `…brentons-greek-prints-no-verse-22-6` and `…no-verse-4-7`.** Whether a whole verse that one printed Septuagint edition omits is a T difference needs a direct owner ruling; a researcher precedent is not one. Decided: both stay held and are logged in `owner-questions.md`. **Do not issue another omitted-verse record.**
- **Held (Q): the “strange children” of Psalm 144.** Unnamed adversaries in a rescue prayer are ordinary omitted detail; the verses already describe their conduct. Do not re-issue.
- **No whole-book search claim that was not supplied.** Four corrections removed “nothing in the whole book” statements; a claim of absence must rest on a search the record supplies (and says is a word search) or be limited to the quoted verse.
- **Use Brenton’s own English wording** for the Greek, not a researcher rendering, including inside titles.
- **Do not state a claim about the Greek that the quoted words do not carry** (an “appetite condition” was removed at Proverbs 23:2).
- A side-by-side record on the same verse as a built-in study is accepted when the question differs (Psalm 148 with `science-sky-dome`).

## Notes from the Ecclesiastes and Song of Solomon session (2026-10-13)

- The unit is in `ecclesiastes-to-song-of-solomon-records.json` (20 records: 20 T, all witness “Septuagint”; no V, no untagged; all carry `sides`, none a side B) and `ecclesiastes-to-song-of-solomon-q-records.json` (3 Q: who the Preacher is 1:1; who the “one shepherd” is 12:11; whether “my beloved”, the king and Solomon are one person, Song 1:4). Awaiting Codex. **Next: Isaiah (three parts; the first session sets the breaks).**
- **Batches Codex has not processed when this session ended: this unit only (one).** Every batch up to and including Proverbs is processed.
- **Verse numbers:** Ecclesiastes: KJV 5:1 = Hebrew and Greek 4:17 (so chapter 4 has 17 and chapter 5 has 19 there); nothing else differs. Song of Solomon: KJV 6:13 = 7:1, and KJV 7:n = 7:(n+1) in the Hebrew and the Greek. Brenton prints no lettered verses in either book. Brenton’s Greek of the Song prints “Sunamite” where the KJV has “Shulamite” (6:13, twice).
- Records issued here that rest on verses of other books: none as a side. Published records already cite Ecclesiastes 9:5 and Song 4:1.
- No Hebrew-witness T: each Hebrew candidate would need a dictionary source (Ecclesiastes 12:5 “desire” beside the caper, 10:11 “babbler”, Song 2:7 “roes”, 1:10 “rows of jewels”); the records quote the Hebrew and say they do not gloss it.
- Considered and not issued (reasons in the notes file): 7:16, 7:12, 11:5, 10:19, 6:6, 4:6 (Ecclesiastes); 2:4, 5:13, 5:16, 7:10, 4:13 (Song). Held back, quotes sourced: Song 5:13 (“bed” / “bowls”), Ecclesiastes 6:6 (“twice told”).
- A script that builds the record text before `begin()` runs breaks on `G()`: pass extra text as a function (`extraText: () => […]`) so it is evaluated after `begin()`.
- **For Isaiah:** bolls.life book 23, packaged KJV index 22, Brenton code `ISA` (check the pages answer; the Greek Isaiah differs much from the Hebrew). 66 chapters: parts of at most 30 at natural breaks (suggested: 1–27, 28–39, 40–66, the last two separate or joined only if 40–66 stays within 30 — 40–66 is 27 chapters). Check `data/evidence.json` and the 2 Kings notes first: Isaiah 36–39 repeats 2 Kings 18–20 and Isaiah 39:2 is already issued. Do not re-issue Isaiah 40:28 (Exodus session). New Testament quotations of Isaiah (Matthew 1:23, 4:15–16, 8:17, 12:18–21, 13:14–15; Acts 8:32–33, 28:26–27; Romans 9–11 and 15:12) need `data/evidence.json` checked; many are published. Use `best.mjs`-style full-book matching because the Greek reorders verses in places.
- Work folder: `%TEMP%claudeecc` (in Git Bash `/tmp/claude/ecc`; `head9.mjs` writes the files, `eb.mjs` the records, `pv.mjs`, `tok.mjs`, `scan.mjs`, `nums.mjs`, cache of both books). For Isaiah copy this folder, change the book number (23), code (`ISA`), chapter range, the book-index/name tables in `o.mjs`-using scripts and the file names in `head9.mjs`.

## Notes from the Isaiah 1–27 session (2026-10-13)

- Isaiah 1–27 is in `isaiah-1-27-records.json` (16 records: 16 T, all witness "Septuagint"; no V, no untagged; all carry `sides`, three with a side B on a New Testament verse: Romans 9:29, Acts 28:26–27, 1 Corinthians 15:54) and `isaiah-1-27-q-records.json` (3 Q: which child 7:14 means; which land 18:1 addresses; the watchman of 21:11–12). Awaiting Codex. **Next: Isaiah 28–39, then 40–66.**
- **Batches Codex has not processed when this session ended: Ecclesiastes–Song and Isaiah 1–27 (two).** Every batch up to and including Proverbs is processed.
- **Verse numbers:** KJV 9:1 = Hebrew and Greek 8:23, and KJV 9:n = 9:(n−1) there (n = 2–21). KJV 8 has 22 verses, Hebrew and Greek 8 have 23. Elsewhere in 1–27 numbers agree. Brenton's Greek has pages ISA01–ISA27 (and onward); bolls.life book 23, packaged KJV index 22.
- Records issued here that rest on verses of other books — do not re-issue in those books: Romans 9:29 (with 1:9), Acts 28:26–27 (with 6:9–10; John 12:40 and Matthew 13:14–15 were NOT compared and remain open), 1 Corinthians 15:54 (with 25:8). The Q on Isaiah 7:14 is issued here; do not issue a Q on "virgin" or "Immanuel" in Matthew 1:22–23 (the use of the verse there is not examined in the record).
- Left out (do not re-issue): 7:14 "virgin" as a T (the Hebrew word has a range of senses that the KJV's choice lies inside; the Greek agrees with the KJV); 14:12 "Lucifer"; 8:8, 8:10 "Immanuel" / "God with us" (Matthew 1:23 gives the meaning). Logged in `owner-questions.md`.
- Method: `scanI.mjs lo hi th` (KJV verse against the same-numbered and best-matching verse in Brenton's English), `o.mjs "Isaiah c:v"`, `tokI.mjs c:v` for Hebrew word numbers (use Hebrew numbering), `isb.mjs` holds the records, `head10.mjs` writes the files. Work folder `%TEMP%\claude\isa` (Git Bash `/tmp/claude/isa`); the cache has Isaiah 1–27 in WLC and Brenton Greek and English, plus Acts 28, Romans 9 and 1 Corinthians 15 (TR, TISCH). For 28–39 change the chapter range in `fetch.mjs`, `scanI.mjs`, `all.mjs` and the file names in `head10.mjs`/`isb.mjs` finish; Isaiah 36–39 repeats 2 Kings 18–20 (Isaiah 39:2 published; 36:1 and 45:1 appear in built-in studies).
- A long heredoc on the command line fails here (ENAMETOOLONG): write scripts with the file tool.

## Notes from the Isaiah 28–39 session (2026-10-13)

- Isaiah 28–39 is in `isaiah-28-39-records.json` (16 records: 16 T, all witness "Septuagint"; no V, no untagged; all carry `sides`, one with a side B on Romans 9:33) and `isaiah-28-39-q-records.json` (3 Q: the stone of 28:16; the king of 30:33; the king of 32:1). Awaiting Codex. **Next: Isaiah 40–66.**
- **Batches Codex has not processed when this session ended: Ecclesiastes–Song, Isaiah 1–27 and Isaiah 28–39 (three).**
- Verse numbers agree in the KJV, WLC and Brenton throughout 28–39. Brenton pages ISA28–ISA39.
- Records issued here that rest on verses of other books — do not re-issue in those books: Romans 9:33 (with 28:16; Romans 10:11 and 1 Peter 2:6 were NOT compared and remain open). The Q on 28:16 does not examine the New Testament use.
- Isaiah 36–39 was still not compared with 2 Kings 18–20 verse by verse. Left out, quotes sourced: the Greek omission at 36:7 (high places) and the Greek of 29:1 ("let them kill sacrifices" / "eat with Moab"). No V: 30:1–2 and 31:1 are checked by the passage ("Woe").
- Method: work folder `%TEMP%\claude\isa` (Git Bash `/tmp/claude/isa`): `fetch.mjs` and `scanI.mjs` (ranges now 28–39), `isb2.mjs` holds the records (a `T({parts:[…]})` helper takes several verses), `head11.mjs` writes the files. For 40–66 change the chapter ranges in `fetch.mjs`, `all.mjs` (loop to 66), `scanI.mjs` and the file names in `head11.mjs`. The Write tool resolves `/tmp` to `C:\tmp`: write scripts to the Windows temp path or move them. A python heredoc hung the shell here; use a node script file.
- Records to avoid at 40–66: Isaiah 40:28 (Exodus session), Isaiah 45:1 (built-in study); Romans 9–11 and 15:12 quotations need `data/evidence.json` checked.

## Notes from the Isaiah 40–66 session (2026-10-13)

- Isaiah 40–66 is in `isaiah-40-66-records.json` (16 records: 16 T, all witness "Septuagint"; no V, no untagged; all carry `sides`, four with a side B on a New Testament verse quoted in KJV only: 1 Peter 1:24, Romans 11:34, Romans 11:26, Luke 4:18) and `isaiah-40-66-q-records.json` (3 Q: the servant of 49:3–6; who comes from Edom 63:1; the "we" of 53:1). Awaiting Codex. **Next: Jeremiah (first session sets the parts).**
- **Batches Codex has not processed when this session ended: Ecclesiastes–Song, Isaiah 1–27, Isaiah 28–39 and Isaiah 40–66 (four).**
- Verse numbers: agree at every verse quoted. KJV 64:1 is the end of Hebrew and Greek 63:19, and KJV 64:n = 64:(n−1) after that; Brenton prints no counterpart of KJV 56:12 or 64:12 (not issued).
- Records issued here that rest on verses of other books — do not re-issue in those books: 1 Peter 1:24 (with 40:6), Romans 11:34 (with 40:13), Romans 11:26 (with 59:20), Luke 4:18 (with 61:1). The Greek of those New Testament verses was NOT fetched or compared; they remain open in their own sessions as Greek New Testament comparisons.
- Held back, quotes read: 41:2, 42:1 (Jacob/Israel in the Greek), 46:8, 47:3, 48:14, 53:3, 53:8, 53:9, 53:11, 54:9, 61:7, 63:3, 63:18, 65:23, 66:9. Not compared: Isaiah 36–39 against 2 Kings 18–20 verse by verse (still open).
- Method: work folder `%TEMP%claudeisa` (Git Bash `/tmp/claude/isa`): `isb3.mjs` holds the records (one `T({...})` call per single-verse record), `head12.mjs` writes the files, `scanI.mjs 40 66 0.25` screens, `tokI.mjs c:v` numbers the Hebrew words. For Jeremiah copy the folder and change the book number (24), code (`JER`), index (23); Brenton's Greek numbers Jeremiah differently (it follows the Septuagint order: Jeremiah 25–31 are placed as 32–38 and the oracles against the nations are reordered), so match by text, not number. Brenton's Jeremiah 36 is chapter 43 (README, 2 Kings notes).

## Notes from the Jeremiah 1–29 session (2026-10-13)

- Jeremiah 1–29 is in `jeremiah-1-29-records.json` (18 records: 18 T; 17 witness "Septuagint", 1 witness "Hebrew" = the deferred Immanuel record `o-immanuel-or-god-is-with-us-same-hebrew-isaiah-8-8`; no V, no untagged; all carry `sides`) and `jeremiah-1-29-q-records.json` (3 Q: Sheshach 25:26; the ark 3:16; the seventy years 25:11–12). Awaiting Codex. **Next: Jeremiah 30–52** (plan of parts: 1–29, 30–52).
- **Batches Codex has not processed when this session ended: Ecclesiastes–Song, Isaiah 1–27, Isaiah 28–39, Isaiah 40–66 and Jeremiah 1–29 (five).**
- **Verse numbers:** KJV and Hebrew agree. **Brenton's Greek Jeremiah is in a different order:** KJV 25:15–38 = Greek 32:15–38; KJV 26–29 = Greek 33–36 with the same verse numbers at the verses quoted; for the rest of the book the Greek order goes: KJV 30–31 = Greek 37–38, KJV 46–51 = Greek 26–31 (not examined this session). Brenton prints KJV 26:7 at 33:7, 28:1 at 35:1, 29:2/29:11/29:24 at 36:2/36:11/36:24. Many verses are missing from Brenton (10:6–8, 10:10, 17:1–4, 8:11–12, 29:12–18, 29:25–29, 25:23–25); omitted verses are not issued.
- Records issued here that rest on verses of other books — do not re-issue: Isaiah 8:8 and 8:10 (Immanuel; Matthew 1:23 in `refs`).
- Jeremiah 30–52: Brenton chapters for KJV 30–31 are 37–38 and for KJV 46–51 are 26–31; KJV 52 = Greek 52 (lacks 52:2, 3, 15, 28–30, README 2 Kings notes) and is already issued in the 2 Kings session (52:12, 22, 25, 28, 31); Jeremiah 36 is Greek 43; do not re-issue. 33:15 (Branch) and 31:15 (Rachel; Matthew 2:18) and 31:31–34 (Hebrews 8:8–12) need `data/evidence.json` checked.
- Left out, quotes read: 4:26 (Carmel), 15:12, 29:22, 22:25 (Nebuchadrezzar omitted), 25:26 (no Sheshach counterpart); 10:9 is an English-only difference in Brenton's own rendering (the Greek word is "purple").
- Method: work folder `%TEMP%claudejer` (Git Bash `/tmp/claude/jer`): `fetch.mjs` (book 24, `JER`; range edited per run; the cache has JER 1–36), `scanI.mjs lo hi th` screens by best match across the book, `pvj.mjs c:v[:greekChapter:label]` prints KJV, numbered Hebrew words, Greek and English, `isbJ.mjs` holds the records, `head13.mjs` writes the files (copy of head12 with the file names changed). `ws.mjs <regex>` is a whole-Bible word search of the packaged KJV. For 30–52 change the fetch range (and add Greek chapters 37–38, 26–31, 43), the chapter range in `scanI.mjs`/`all.mjs` and the file names. A long heredoc on the command line fails; use the file tool.
- The build's word ban rejects "ruling" even inside a KJV quotation (Jeremiah 22:30 "ruling any more"): quote the clause, not the verse.

## Notes from the Jeremiah 30–52 session (2026-10-13)

- Jeremiah 30–52 is in `jeremiah-30-52-records.json` (17 records: 16 T, all witness "Septuagint"; 1 untagged: `zedekiah-shalt-die-in-peace-…-jeremiah-34-5`; no V; all carry `sides`) and `jeremiah-30-52-q-records.json` (3 Q: the new thing of 31:22; how the captain of the guard knows the Lord's word 40:2; why Ishmael killed Gedaliah 40:14). Awaiting Codex. **Next: Lamentations (one session; Brenton code `LAM`, bolls.life book 25, packaged KJV index 24; 5 chapters; check whether Brenton's Lamentations page answers).**
- **Batches Codex has not processed when this session ended: Ecclesiastes–Song, Isaiah 1–27, 28–39, 40–66, Jeremiah 1–29 and Jeremiah 30–52 (six)** (count taken at the start of the run from the `claude-ready-*` files: everything up to and including Proverbs is decided).
- **Verse numbers:** KJV and Hebrew agree. Brenton's Greek chapters: KJV 30–31 = 37–38; 32–36 = 39–43; 41 = 48; 43 = 50; 46 = 26; 48 = 31; 50 = 27; 51 = 28 (KJV 49 is split between Greek 29–30; KJV 47 = Greek 29). Verse numbers inside those chapters agree at every verse quoted. Brenton omits whole verses (33:14–26 and many in 46–49); not issued.
- Records issued here that rest on verses of other books — do not re-issue in those books: none as a side. Context only: 2 Kings 25:25 (Ishmael, Q). Jeremiah 34:3 with Ezekiel 12:13 was left out (Ezekiel 12:13 does not name the king in the verse); the Ezekiel session may issue it if the referent can be shown.
- Left out, quotes read (do not re-issue): 30:13, 30:17, 31:2, 31:20, 31:25, 34:18, 35:19, 42:10, 46:14, 48:11, 49:28, 49:33, 51:41, 52:11. Not compared with the Greek New Testament: 31:15 (Matthew 2:18), 31:31–34 (Hebrews 8:8–12), 33:15 (Branch).
- One record rests on a word-level omission (43:10 "my servant"; script-checked that Greek 50:10 has no servant word). Wait for Codex's view before issuing more word-level omissions.
- Method: work folder `%TEMP%claudejer` (Git Bash `/tmp/claude/jer`): `fetch2.mjs` (WLC 24/30–52, Brenton Greek and English 26–52), `scanJ.mjs lo hi tlow thigh` (KJV against best match in Brenton English across the book, prints a similarity band), `pvj.mjs c:v:greekChapter` (KJV, numbered Hebrew words, Greek, English), `chk.mjs "Book c:v" …` (published and drafted records that cite a verse), `isbJ2.mjs` (records; a `T({parts:[…]})` helper takes several verses), `head14.mjs` (file names). A python heredoc hung the shell again: write helper scripts with the file tool or as a node script file, and wrap node runs in `timeout`.

## Notes from the Lamentations session (2026-10-13)

- Lamentations is in `lamentations-1-5-records.json` (17 records: 17 T; 16 witness "Septuagint", 1 "Hebrew and Septuagint" = `…-4-16-hebrew-and-greek`; no V, no untagged; all carry `sides`) and `lamentations-1-5-q-records.json` (3 Q: the man of 3:1; the anointed of 4:20; the day of 1:21). Awaiting Codex. **Next: Ezekiel (first session sets the parts; 48 chapters, at most 30 each; suggested 1–24 and 25–48).**
- **Batches Codex has not processed when this session ended: Ecclesiastes–Song, Isaiah 1–27, 28–39, 40–66, Jeremiah 1–29, Jeremiah 30–52 and Lamentations (seven).** Everything up to and including Proverbs is decided.
- **Verse numbers:** KJV, WLC and Brenton agree throughout. Brenton's Lamentations pages `LAM01`–`LAM05` answer (Greek and English); chapter 3 prints no verses 22–24 or 29 and carries duplicated acrostic labels. bolls.life book 25, packaged KJV index 24.
- Records issued here that rest on verses of other books: none. Lamentations 5:7 with Ezekiel 18:20 is already published (`exp-late-24-5-7`, `exp-late-25-18-19`); do not re-issue in Ezekiel.
- Left out (quotes read, do not re-issue): see the notes file; main ones 1:17, 4:3, 5:11, 3:5, 2:22, 1:19 (Greek "and found it not"), 4:21 (Uz).
- Method: work folder `%TEMP%claudelam` (Git Bash `/tmp/claude/lam`): `dumpall.mjs` prints KJV with Brenton's English per verse (screen by eye for a short book), `pvj.mjs c:v` (KJV, numbered Hebrew words, Greek, English), `chk.mjs` (published and drafted records citing a verse), `isbL.mjs` (records; `T({...})` takes one verse, a Hebrew word range or typed consonants), `head15.mjs`. For Ezekiel copy it; book number 26, code `EZK`, KJV index 25; check Brenton's Ezekiel numbering (the Greek omits and reorders in places, 7, 12, 32 and 36–39).

## Notes from the Ezekiel 1–24 session (2026-10-13)

- Ezekiel 1–24 is in `ezekiel-1-24-records.json` (21 records: 18 T, all witness "Septuagint"; 3 untagged: the faces at 1:10 and 10:14, 18:9 with 21:3, 20:11 with 20:25; no V; all carry `sides`) and `ezekiel-1-24-q-records.json` (3 Q: the thirtieth year 1:1; the 390 and 40 years 4:5; the prophet deceived 14:9). Awaiting Codex. **Next: Ezekiel 25–48** (plan of parts: 1–24, 25–48).
- **Batches Codex has not processed when this session ended: Ecclesiastes–Song, Isaiah 1–27, 28–39, 40–66, Jeremiah 1–29, Jeremiah 30–52, Lamentations and Ezekiel 1–24 (eight).** Everything up to and including Proverbs is decided (the newest Codex notes are the Psalms 135–150, Proverbs and owner-rulings files).
- **Verse numbers:** KJV, WLC and Brenton agree at every verse quoted. KJV 20:45–49 = Hebrew and Greek 21:1–5; KJV 21:n = Hebrew and Greek 21:(n+5) (Brenton 21 has 37 verses, Brenton 20 has 44). Brenton has no 1:14, 10:14, 11:11–12. Brenton pages EZK01–EZK48 (EZK01–24 fetched); bolls.life book 26, packaged KJV index 25.
- Records issued here that rest on verses of other books: none. Already published and not to be re-issued in 25–48: Ezekiel 18:20 and 18:19 with Lamentations 5:7; Ezekiel 21:27 in the Shiloh Q; Ezekiel 29:17 and 26:7, 26:12 (`exp-late-25-29-17`); Ezekiel 43:17–18 with Exodus 20:26.
- Left out (quotes read, do not re-issue): 1:2 Jehoiachin/Joakim (the Greek form is the same for the son at 2 Kings 24:6), 1:16 beryl, 16:10 badgers’ skin, 20:46–47 Darom and Nageb, 12:13 with Jeremiah 34:3 (the accounts fit; the Jeremiah note’s question is closed), and the omissions at 3:15, 8:7, 17:20, 7:16. Greek differences at 7:7, 7:23, 16:27, 16:29–30, 20:26, 24:17 depend on obscure Hebrew words.
- Method: work folder `%TEMP%\claude\ezk` (Git Bash `/tmp/claude/ezk`): `fetch.mjs` (WLC book 26, Brenton Greek and English; range edited per run; cache has EZK 1–24), `scan.mjs lo hi tlow thigh` (KJV against best match in Brenton English across the book), `nums.mjs` (number words at the aligned verse) and `nm.mjs` (names at the aligned verse; both map KJV 20:45–49 and 21:n), `pve.mjs c:v[:greekChapter:label]` (KJV, numbered Hebrew words, Greek, English), `chk.mjs`, `isbE.mjs` (records; `T({parts:[…]})` takes several verses), `head16.mjs`. For 25–48 change the fetch range, the chapter ranges in the scan scripts and the file names in `head16.mjs`; Brenton's Greek of chapters 36–39 and 40–48 differs most from the Hebrew. Write scripts with the file tool; a long heredoc on the command line fails, and an empty python heredoc hung the shell.
- The number and name scans found most of the findings; the best-match screen alone is too noisy for Ezekiel because Brenton's English is wordier than the KJV. Run `nums.mjs` and `nm.mjs` first next time.

## Lessons from Codex’s Isaiah integration (2026-10-13)

Codex decided all six Isaiah batches: 47 of 48 main records accepted (37 as written, 10 corrected, 1 held), 8 of 9 Q accepted (1 held). Nothing under “Needs owner”. Reasons are in `research/notes/claude-ready-isaiah-*-2026-10-13.md` and their `-decisions.json`.

- **Held (T): Isaiah 58:6.** The scope admitted the Greek opening can introduce a question, and a difference only in Brenton’s English does not establish a Greek meaning difference. When a Greek difference rests on Brenton’s English alone, or the same rhetorical meaning can be read in both, leave it out. (Ezekiel 25:8 here states that the question form is not the finding.)
- **Held (Q): the Tophet king of Isaiah 30:33.** An unnamed king whose passage already names the subject and the fire (30:31–33) is not a material gap. A Q needs a gap the surrounding verses do not close.
- **Corrections were claims, not quotes:** an unsupported assertion of “different beings” from two printed terms; a one-word description of a two-word quotation; an unsupported “different place” conclusion beside a plainly different name (keep the name difference, drop the place conclusion); a contradictory claim about the object of a verb; a title quotation that must match Brenton’s English exactly (including an omitted KJV word).
- **A Greek name beside a KJV name is accepted** (Tarshish and Carthage) provided the record does not say the places differ.
- Codex adds quoted same-chapter comparison verses as context refs; give them yourself where a record names them.

## Notes from the Ezekiel 25–48 session (2026-10-13)

- Ezekiel 25–48 is in `ezekiel-25-48-records.json` (29 records: 25 T — 24 witness “Septuagint”, 1 witness “Hebrew and Septuagint” (`the-valley-of-hamongog-or-the-burial-place-of-gog-ezekiel-39-11`); 4 untagged: the temple offerings of Ezekiel 45–46 beside Numbers 28; no V; all carry `sides`, none a side B on a tagged record) and `ezekiel-25-48-q-records.json` (3 Q: the one addressed at 28:12–14; Gog and the latter years 38:2, 38:8; whether the house of 43:10–11 is to be built). Awaiting Codex. **Next: Daniel to Hosea (one session, two books: 12 + 14 chapters).**
- **Batches Codex has not processed when this session ended: Jeremiah 1–29, Jeremiah 30–52, Lamentations, Ezekiel 1–24 and Ezekiel 25–48 (five).** Everything up to and including Isaiah 40–66 is decided.
- **Verse numbers:** KJV, WLC and Brenton agree at every verse quoted. Brenton’s Greek page and Brenton’s English page differ at 32:1 (year) and 38:3 (the name “Rhos” is in the English only); records quote the Greek and avoid those points. The Greek of 40–48 is much reordered and shorter; only plain number, name and noun differences were issued.
- Records issued here that rest on verses of other books — do not re-issue in those books: Numbers 28:3–4, 28:9, 28:11, 28:19, 28:22 (against Ezekiel 45:22–23 and 46:4, 46:6, 46:13). The meal-offering amounts (Ezekiel 45:24, 46:5, 46:7 against Numbers 28:12, 28:20) were NOT issued: they need the tenth-deal and ephah relation stated from a verse, and were left out.
- Left out (quotes read, do not re-issue): see the notes file; main ones 25:5, 25:16, 27:13, 27:19, 28:12, 29:10 and 30:6, 30:15, 31:11, 38:12, 45:12 and the omissions listed there.
- The Hamongog record is an application of the Immanuel rule (a name made of ordinary words, with the meaning given by the KJV in the same verse); it is issued as witness “Hebrew and Septuagint” because the Greek also prints a noun of a different meaning.
- Method: work folder `%TEMP%claudeezk2` (Git Bash `/tmp/claude/ezk2`): `fetch.mjs` (chapters 25–48), `nums.mjs` and `nm.mjs` (number and name scans, now without the Ezekiel 20/21 offset), `scan.mjs lo hi tlow thigh`, `pve.mjs c:v`, `kv.mjs "Book c:v-v"` (KJV text of any verse range), `chk2.mjs` (published and drafted records citing Ezekiel 25–48), `isbE2.mjs` (records; `T({parts:[…]})` takes several verses and `ctx:true` marks a context-only verse), `head17.mjs`. A python heredoc hung the shell again: never use one.
- **For Daniel to Hosea:** Daniel has Aramaic chapters 2:4–7:28; bolls.life WLC book 27 (Daniel), 28 (Hosea); packaged KJV index 26, 27; Brenton code `DAN` (the Greek has the Old Greek and Theodotion texts, and additions: Susanna, Bel and the Dragon, the Prayer of Azariah; check which Brenton prints — Brenton’s Daniel pages may print the Theodotion text). Hosea book 28 (README 2 Kings notes). Check `data/evidence.json` for Daniel 1:1 with Jeremiah 25:1 and 46:2 and for Hosea 11:1 with Matthew 2:15 before proposing.

## Lessons from Codex’s Jeremiah, Lamentations and Ezekiel integration (2026-10-13)

Codex decided Jeremiah 1–29 (16 of 18 accepted, 2 held), Jeremiah 30–52 (17 of 17), Lamentations (17 of 17, 1 corrected; Q: 2 of 3, 1 held), Ezekiel 1–24 (19 of 21, 2 held; Q 3 of 3) and Ezekiel 25–48 (29 of 29, 12 corrected; Q 3 of 3 corrected). Nothing is under “Needs owner” beyond the holds below. Reasons are in the `claude-ready-*` files of those books and their `-decisions.json`.

- **Held (T): `without-form-and-void-or-it-was-not-jeremiah-4-23-greek`.** A contrast between English presentations of the Greek does not show a Greek meaning difference when the record itself declines to establish what the Greek clause means. Do not issue a Greek difference whose scope has to say the Greek meaning is unresolved.
- **Held (T): name forms.** `shemaiah-the-nehelamite-or-samaeas-the-aelamite-jeremiah-29-24-greek`, `jaazaniah-the-son-of-shaphan-or-jechonias-the-son-of-saphan-ezekiel-8-11-greek` and `o-wheel-or-called-gelgel-ezekiel-10-13-greek` were held: different name forms, or a translated designation beside a transliterated name, do not by themselves show a different meaning or referent. A KJV name left untranslated where the Hebrew has ordinary words stays allowed (owner ruling on names); a Greek name beside a KJV common noun was accepted where the record states what each text prints (Ezekiel 17:4 “traffick” and “Chanaan”).
- **Corrected:** do not adopt Brenton’s grammatical analysis of the Greek (a “passive”); a Greek-only difference at a verse where the Hebrew noun is the same as the KJV’s is witness “Septuagint”, not “Hebrew and Septuagint” (Lamentations 4:16); complete a Brenton English excerpt at the printed label; do not add punctuation or an “I” to a KJV quotation; add the explicitly discussed neighbouring verse as context; separate quotations across two verses; state that measured objects are differently described before setting two measures against each other.
- **Held (Q): Lamentations 1:21 “the day that thou hast called”.** The adjacent verse explains the reciprocal judgment; an unspecified date or earlier occasion is not a separate material gap. Narrow a Q title to the actual unexplained means or identity (Ezekiel 14:9) and bound every absence claim to the verses supplied.

## Notes from the Daniel to Hosea session (2026-10-13)

- The unit is in `daniel-to-hosea-records.json` (32 records: 31 T, 30 witness “Septuagint” and 1 “Hebrew and Septuagint” = `loruhamah-and-loammi-or-not-pitied-and-not-my-people-hosea-1-6-hebrew-and-greek`; 1 untagged: Daniel 1:1 beside Jeremiah 25:1; no V; all carry `sides`, three with a side B on a New Testament verse: Matthew 2:15, 1 Corinthians 15:55, Hebrews 13:15) and `daniel-to-hosea-q-records.json` (3 Q: the fourth man in the furnace 3:25; Darius the Mede 5:31; king Jareb, Hosea 5:13). Awaiting Codex. **Next: Joel to Micah (Joel, Amos, Obadiah, Jonah, Micah: 3 + 9 + 1 + 4 + 7 = 24 chapters; bolls.life books 29–33, packaged KJV index 28–32, Brenton codes `JOL`, `AMO`, `OBA`, `JON`, `MIC`; check that the pages answer).**
- **Codex was fully caught up when this session started** (every batch through Ezekiel 25–48 decided; the newest notes are the Ezekiel files).
- **Brenton’s Greek of Daniel is at `grcbrent/DAG01`–`DAG12`** (English `eng-Brenton/DAG*`); the `DAN` Greek pages are 404. A second English text titled Daniel is at `eng-Brenton/DAN*` with no Greek page found. The KJV address for Daniel is `eng-kjv/DAN##`. Every Daniel record states which page it quotes and does not say whether it is the Old Greek or Theodotion. The Greek page of chapter 3 prints labels 24–90 between KJV 3:23 and 3:24 (65 labels: 67–70 are not printed; 72a and 72b are); KJV 3:24–30 = Greek 3:91–97.
- **Verse numbers:** Daniel (WLC): KJV 4:1–3 = 3:31–33; KJV 4:n = 4:(n−3); KJV 5:31 = 6:1; KJV 6:n = 6:(n+1); the Aramaic runs from 2:4 to 7:28. Brenton’s Greek follows the KJV numbers in Daniel 4, and the WLC numbers for 5:31 and chapter 6. Hosea: KJV 1:10–11 = 2:1–2; KJV 2:n = 2:(n+2); KJV 11:12 = 12:1; KJV 12:n = 12:(n+1); KJV 13:16 = 14:1; KJV 14:n = 14:(n+1); Brenton follows the Hebrew numbers.
- **Already published, not re-issued:** Hosea 1:4 (“house of Jehu” against the Greek “Juda”) is `jehu-done-well-to-house-of-ahab-or-blood-of-jezreel-avenged-on-house-of-jehu`. No other published record cites Daniel or Hosea except `jacob-saw-god-face-to-face-or-no-man-hath-seen-god` (Hosea 12:4), `gideons-ephod-what-was-it-and-what-did-israel-do-with-it` (Hosea 3:4) and the Ezra 4 kings Q (Daniel 9:1).
- Records issued here that rest on verses of other books — do not re-issue in those books: Matthew 2:15 (with Hosea 11:1; how Matthew uses the verse was NOT examined), 1 Corinthians 15:55 (with Hosea 13:14), Hebrews 13:15 (with Hosea 14:2), Jeremiah 25:1 and 46:2 (with Daniel 1:1; the untagged record is issued here under the late cross-book rule).
- **Not examined:** Daniel 1:1 against 2 Kings 24:1; Hosea 12:3–4 against Genesis 25:26 and 32:24–30; Hosea 13:4 “no saviour” against 2 Kings 13:5 (a published Q covers the saviour).
- Left out, quotes read, do not re-issue (see the notes file): Daniel 5:7, 5:16 and 5:29 “scarlet” (Brenton’s own English splits the same Greek word), 9:26–27, 10:6, 11:30, 11:37; Hosea 13:2, 14:4, 14:8, 2:12, 13:5, 9:9 and 10:9, 9:10, 8:9.
- Method: work folder `%TEMP%\claude\dan` (Git Bash `/tmp/claude/dan`): `map.mjs` (KJV to Hebrew and Brenton numbering for both books), `dump.mjs Book c1 c2` (KJV with Brenton’s English), `pv.mjs Book:c:v` (KJV, numbered Hebrew words, Greek, English), `g.mjs Book c label…` (raw Brenton labels), `head18.mjs` (checked helpers; `Graw` for a raw Brenton label), `isbD.mjs` (records and final assertions), `cnt.mjs` (verse counts), `chk.mjs` (overlap). The best-match screen is useless for these books; read the dump. For Joel to Micah copy the folder, change the book numbers in `fetch.mjs` and `map.mjs` (and CODES in `o.mjs` if a Brenton code differs) and the file names in `head18.mjs`.
- Write scripts with the file tool; a here-document on a command line that also holds other commands failed again. A `for … for … { …; if (!ch) break; }` one-liner inside a template string silently counted nothing: brace the loops and print a visit count.

## Notes from the Joel to Micah session (2026-10-13)

- The unit is in `joel-to-micah-records.json` (39 records: 36 T, all witness “Septuagint”; 3 untagged; no V; all carry `sides`, one with a side B on Acts 15:17 and two untagged with a side B on Acts 2:17 and Matthew 2:6) and `joel-to-micah-q-records.json` (3 Q: the northern army Joel 2:20; Sepharad Obadiah 1:20; she which travaileth Micah 5:3). Awaiting Codex. **Next: Nahum to Malachi (Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi: 3 + 3 + 3 + 2 + 14 + 4 = 29 chapters; bolls.life books 34–39, packaged KJV index 33–38, Brenton codes `NAM`, `HAB`, `ZEP`, `HAG`, `ZEC`, `MAL`; check that the pages answer). Habakkuk 1:5 and 2:4 and Zechariah 11:12–13 and 12:10 are quoted in the New Testament; check `data/evidence.json` and the Matthew 27:9 record before proposing.**
- **Codex was fully caught up when this session started except for the Daniel to Hosea batch** (one batch outstanding; the newest decided are the Ezekiel files).
- **Verse numbers:** Joel KJV 2:28–32 = Hebrew and Brenton 3:1–5 and KJV 3:n = 4:n; Jonah KJV 1:17 = 2:1 and KJV 2:n = 2:(n+1); Micah KJV 5:1 = 4:14 and KJV 5:n = 5:(n−1); Amos and Obadiah agree. Brenton’s Amos 8:1 page prints both Greek “fowler’s basket” phrases under 8:1 while its English runs the second into 8:2.
- Already published and not re-issued: `exp-late-28-2-4` (Joel 2:4, 2:25 army imagery), `exp-late-31-3-4` (Jonah 3:4 and 4:2 averted destruction), `exp-late-32-4-1` (Micah 4:1 with Isaiah 2:2), `exp-late-32-6-6`, `exp-late-27-6-4`, `exp-late-29-5-21` (Micah 6:8 and Amos 5:21), `exp-late-30-1-10` and `exp-late-18-137-1` (Obadiah 1:10–11). None of them compares wording, so they do not overlap the new records beyond sharing a verse.
- Records issued here that rest on verses of other books — do not re-issue in those books: Acts 15:17 (with Amos 9:12), Acts 2:17 (with Joel 2:28), Matthew 2:6 (with Micah 5:2), Isaiah 2:4 (with Joel 3:10 and Micah 4:3; issued under the late cross-book rule).
- **Not examined:** Obadiah 1:1–9 against Jeremiah 49:7–22 (parallel passages, not compared verse by verse); Amos 5:25–27 against Acts 7:42–43; Jonah 1:17 against Matthew 12:40; Micah 7:6 against Matthew 10:35–36.
- Left out, quotes read, do not re-issue (see the notes file): the place-name and name-form differences of Micah 1 and Amos 1–2, Beersheba against “the Well of the Oath” (Amos 5:5; a translated designation beside a name), Amos 5:26 (Chiun against Raiphan), 7:7 (“plumbline” against “adamant”; obscure Hebrew), 4:3, 8:3; Jonah 1:17 (“fish”/“whale”); Joel 2:20 (the KJV’s “army”); Joel 3:4 (“coasts of Palestine” against “Galilee of the Gentiles”). Micah 6:5 (“Shittim” against “the reeds”) was left out only for batch size; it would be a second record on the Joel 3:18 pattern.
- The Joel 3:18 record (“valley of Shittim” against “valley of flags”) is witness “Septuagint”, not “Hebrew”: the KJV prints Shittim also as a name elsewhere and the record does not claim the Hebrew name is ordinary words. If the owner or Codex wants it as “Hebrew and Septuagint” (the Hamongog and Immanuel pattern), change the witness and add the Hebrew word alone as the finding.
- Method: work folder `%TEMP%claudejm` (Git Bash `/tmp/claude/jm`): `fetch.mjs` (WLC books 29–33 and Brenton Greek and English `JOL AMO OBA JON MIC`; the cache holds all 24 chapters plus Matthew 2, Acts 2 and 15 TR and TISCH and Isaiah 2 WLC via `fnt.mjs`), `map.mjs` (KJV to Hebrew numbering), `dump.mjs Book c1 c2` (KJV with Brenton’s English), `pv.mjs Book:c:v` (KJV, numbered Hebrew words, Greek, English), `head19.mjs` (checked helpers), `isbJ.mjs` (records and final assertions; `--urls` checks addresses, `--write` writes the main records file and refuses if its notes exist). The read of the dump was the screen; no scan scripts were needed for books this short. bolls.life answers 429 under a burst of URL checks: retry the failures singly with a pause. **Do not use the Write tool with a `/tmp/...` path: it resolves to `C:	mp`; use the full `C:/Users/kevma/AppData/Local/Temp/claude/...` path.** A python heredoc with `-` hung the shell again.

## Notes from the Nahum to Malachi session (2026-10-14)

- The unit is in `nahum-to-malachi-records.json` (48 records: 45 T, all witness “Septuagint”; 3 untagged; no V; all carry `sides`, with a side B on Acts 13:41, Hebrews 10:38, Matthew 27:10, John 19:37 and Matthew 26:31 in five T records) and `nahum-to-malachi-q-records.json` (3 Q: the two anointed ones Zechariah 4:14; the woman in the ephah Zechariah 5:7; the guests Zephaniah 1:7). Awaiting Codex. **This finishes the Old Testament. Next: Matthew 1–28 (Greek New Testament units use witness “Greek New Testament”; compare the KJV with TR, SBLGNT and TISCH; bolls.life book 40, packaged KJV index 39).**
- **Codex was nearly caught up when this session started:** the Daniel to Hosea and Joel to Micah batches were the only ones without decisions files (the newest decided are the Ezekiel files).
- **Verse numbers:** Nahum KJV 1:15 = Hebrew and Brenton 2:1 and KJV 2:n = 2:(n+1); Zechariah KJV 1:18–21 = 2:1–4 and KJV 2:n = 2:(n+4); Malachi KJV 4:n = 3:(n+18) in the Hebrew, **but Brenton prints the KJV 4:5 as 3:22, the KJV 4:6 as 3:23 and the KJV 4:4 (the law) as 3:24** (the law comes last). Habakkuk, Zephaniah and Haggai agree. Brenton has no page for the chapter after the last of any of the six books (404).
- Records issued here that rest on verses of other books — do not re-issue in those books: Matthew 27:9–10 with Zechariah 11:12–13 (untagged; also side B on the Zechariah 11:13 T record), Matthew 11:10 with Malachi 3:1, John 19:37 with Zechariah 12:10, Acts 13:41 with Habakkuk 1:5, Hebrews 10:38 with Habakkuk 2:4, Matthew 26:31 with Zechariah 13:7.
- Already published and not re-issued: `exp-late-33-3-7`, `exp-late-34-3-8`, `exp-late-35-3-8`, `exp-late-36-1-1`, `exp-late-37-7-3`, `exp-late-38-3-8`; the Haggai and Zechariah 4:9 records from the Ezra batch; the existing Q records on Zechariah 1:12, 3:1–2, 7:1, Habakkuk 3:3 and 3:7.
- **Not examined:** Zechariah 9:9 against Matthew 21:5 and John 12:15; Zechariah 12:10 against Revelation 1:7; Zechariah 13:7 against Mark 14:27; Habakkuk 2:4 against Romans 1:17 and Galatians 3:11; Malachi 3:1 against Mark 1:2 (the Textus Receptus prints “in the prophets”, the Tischendorf text “in Isaiah”: check in the Mark session whether to issue it); Malachi 4:5–6 against Luke 1:17 and Matthew 17:11.
- **Matthew session pick-ups:** Matthew 27:9 is already issued (do not re-issue). Quotations of Hosea 11:1 (Matthew 2:15) and Jeremiah 31:15 (Matthew 2:18) were issued in the Daniel to Hosea and Jeremiah sessions if at all: check `data/evidence.json` and the drafts before proposing.
- Left out, quotes read, do not re-issue (see the notes file): the name and range-of-sense items listed there (Nahum 1:1, 3:9, 3:15; Habakkuk 3:7; Zephaniah 2:14; Zechariah 3:1, 5:11 and others), plus about thirty verses capped for batch size that would pass as T if a later session wants more (Zechariah 2:6, 3:8, 9:6, 12:2 and 14:6–7 among them).
- Haggai 1:11 (drought / sword): the Leningrad text points the word as drought, the KJV’s reading; only the Greek differs, so the witness is “Septuagint”, with the shared consonants stated in the scope.
- Method: work folder `%TEMP%\claude\mal` (Git Bash `/tmp/claude/mal`): `fetch.mjs` (WLC books 34–39 and Brenton Greek and English `NAM HAB ZEP HAG ZEC MAL`; `mkdir cache` first; extra chapters answer 404 and make the run slow because of retries), `fnt.mjs` (New Testament TR and TISCH chapters), `map.mjs` (KJV to Hebrew numbering and, for Malachi 4, Brenton’s own order), `dump.mjs Book c1 c2`, `pv.mjs Book:c:v` (numbered Hebrew words, Greek, English), `tlib.mjs` (the T builder with checked quoting; side B for a New Testament verse), `r1.mjs` to `r4.mjs` (records), `main.mjs` (`--urls`, `--write`), `notes.mjs` (notes from the records file, so the notes file is written last). **A bash heredoc containing an apostrophe (`it's`) or several quote marks hung or broke the shell again; write files with the Write tool and the full `C:/Users/kevma/AppData/Local/Temp/claude/...` path.**

## Notes from the Matthew session (2026-10-14)

- The unit is in `matthew-1-28-records.json` (42 records: 27 T, all witness “Greek New Testament”, of which 22 are edition differences (KJV and TR agree, Tischendorf differs) and 5 are word differences (both editions print the same Greek, the KJV’s English differs in meaning); 15 untagged; no V; all carry `sides`) and `matthew-1-28-q-records.json` (3 Q: the star 2:2; the Nazarene 2:23; the saints who rose 27:52). Awaiting Codex. **Next: Mark 1–16 (bolls.life book 41, packaged KJV index 40; TR and TISCH at `https://bolls.life/get-text/TR/41/{chapter}/` and `…/TISCH/41/{chapter}/`; no Brenton).**
- **Codex was nearly caught up when this session started:** only the Joel to Micah and Nahum to Malachi batches were without decisions files. Daniel to Hosea was decided (31 accepted, 1 held: `mene-mene-tekel-upharsin-or-mane-thekel-phares-daniel-5-25-greek`, a wording-only difference; it stays held, do not re-issue).
- **Method for a Greek New Testament unit:** TR (served without accents, final sigma as ς) and TISCH (accented) from bolls.life. `N(book,c,v,sub,sameTR)` quotes TISCH and asserts whether the TR text has the same words; `TRq` quotes the TR text as served. A verse the TISCH page prints with no text is asserted empty and stated as such. A script that lists every verse whose word lists differ between TR and TISCH (`scan.mjs`) is the screen; the output is long, read it. The bolls.life SBLGNT text carries morphology codes glued to each word; do not quote it.
- **Work folder:** `%TEMP%\claude\mat` (Git Bash `/tmp/claude/mat`): `fnt.mjs` and `fnt2.mjs` (fetch), `scan.mjs lo hi`, `pv.mjs c:v` (Matthew: KJV, TR, TISCH) and `pvx.mjs "Book c:v"` (any book), `kvx.mjs`, `srch.mjs word lo hi` (whole-word KJV search), `mlib.mjs` (`TT` for T records, `UU` for untagged), `r1.mjs` (T), `r3.mjs` (untagged), `r4.mjs` (Q), `main.mjs` (`--urls`, `--write`), `notes.mjs`. A backslash-b typed into a heredoc became a backspace and backticks inside a node -e string were eaten by the shell: write every script and every README edit with the file tool.
- Three records rest on a verse the Tischendorf page prints with no text (17:21, 18:11, 23:14). They follow the Proverbs 22:6 pattern (one page, stated). 21:44 was also empty and was not issued (batch size). If Codex holds the three under “Needs owner”, they stay held, as the Septuagint omissions did.
- **Left out, quotes read, do not re-issue:** name forms (Asa / Asaph and Amon / Amos at 1:7–10, Lebbaeus at 10:3), wording only (22:44 footstool, 9:13 “to repentance”, the beatitude order), archaic or range-of-sense English (take no thought, bottles, offend, whale, lunatick, anise), and one Greek word rendered two ways (life / soul at 16:25–26; everlasting / eternal at 25:46).
- **Not examined:** the Old Testament quotations in Matthew other than those already issued (2:18, 3:3, 4:4–7, 4:15–16, 8:17, 12:18–21, 13:14–15, 15:8–9, 21:5, 21:13, 21:42); the fourteen-generations arithmetic at 1:17; Malachi 3:1 against Mark 1:2 is left for the Mark session.
- Records issued here that rest on verses of other books — do not re-issue in those books: Mark 5:1–2, 6:8, 10:11, 10:18, 10:35, 10:46, 11:2, 12:40, 13:32, 14:24, 14:30, 15:23, 15:26; Luke 3:23, 4:5–9, 7:3, 8:26–27, 11:4, 18:35, 19:10, 22:20, 23:38–40; John 1:21, 19:19, 19:24, 20:1.
- The published `coverage-nt-jericho` and `coverage-nt-divorce` records share verses with the new blind-men and Matthew 19:9 records; the scopes say how they differ.

## Notes from the Mark session (2026-10-14)

- The unit is in `mark-1-16-records.json` (47 records: 36 T, all witness “Greek New Testament”, of which 34 are edition differences (KJV and TR agree, Tischendorf differs; four of them are verses the Tischendorf page prints with no text: 9:44 and 9:46, 11:26, 15:28) and 2 are cases where the editions differ in the form or choice of word (7:3 “oft” against πυγμῇ, scoped separately; 7:19 neuter against masculine participle); 11 untagged; no V; all carry `sides`) and `mark-1-16-q-records.json` (3 Q: the young man with the linen cloth 14:51; “let him that readeth understand” 13:14; “salted with fire” 9:49). Awaiting Codex. **Next: Luke 1–24 (bolls.life book 42, packaged KJV index 41; TR and TISCH at `https://bolls.life/get-text/TR/42/{chapter}/` and `…/TISCH/42/{chapter}/`).**
- **Codex was three batches behind when this session started:** only Joel to Micah, Nahum to Malachi and Matthew had no decisions files. Everything up to Daniel to Hosea is decided.
- **Method:** the Matthew work folder copied to `%TEMP%\claude\mrk` (Git Bash `/tmp/claude/mrk`): `fnt.mjs [book:chapter …]` (fetches Mark 1–16 and any extra Gospel chapters), `scan.mjs lo hi` (verses where TR and TISCH word lists differ; the output for Mark is about 400 lines, read it), `pv.mjs "Mark c:v"` and `pvx.mjs` (KJV, TR, TISCH), `srch.mjs word lo hi`, `ovr.mjs` and `ovr.mjs pattern…` (overlap by ref or id against evidence and all drafts), `mlib.mjs` (`TT` for T, `UU` for untagged; `TT` now takes `scopeText` to replace the standard scope and defaults the book to Mark), `r1.mjs` (T), `r3.mjs` (untagged), `r4.mjs` (Q), `main.mjs` (`--urls`, `--write`), `notes.mjs`. In a bash command do not pass a regex with a backslash-b through the shell (it becomes a backspace; the script silently finds nothing): use `srch.mjs`. A python heredoc inside `||` hung the shell: write edit scripts with the file tool.
- **The ref of a record is its first appliesTo verse and must carry side A:** a two-book untagged record whose first part is the later book needs that part to be side A (or reorder the parts).
- **TR against Tischendorf in Mark differs much more than in Matthew** (about 400 verses). Only differences of meaning were issued; εὐθέως / εὐθύς, name spellings, tenses and word order were not.
- Records issued here that rest on verses of other books — do not re-issue in those books: Matthew 10:15 (context), 6:15, 26:73, 27:55, 28:2, 28:8, 21:19, 14:5, 17:1, 10:3; Luke 9:28, 6:16, 24:4, 24:9, 22:37; John 19:14, 18:28, 19:17, 19:25, 2:13, 2:15, 20:12, 14:22; Malachi 3:1 (side B of the Mark 1:2 record).
- **Cross-Gospel untagged conflicts issued here** (Mark with another Gospel, the earlier-book rule): the hour of the crucifixion (Mark 15:25, John 19:14), the passover (Mark 14:12, John 18:28), the women’s silence (Mark 16:8, Matthew 28:8), six or eight days (Mark 9:2, Luke 9:28), who bore the cross (Mark 15:21, John 19:17), Thaddaeus (Mark 3:18, Luke 6:16), the fig tree (Matthew 21:19, Mark 11:20), who wished John dead (Matthew 14:5, Mark 6:19), the temple cleansing (Mark 11:15, John 2:15), the women at the cross (Mark 15:40, John 19:25), the figures at the tomb (Mark 16:5, Luke 24:4). Do not re-issue them in Luke or John; Luke and John sessions should check the list before proposing a conflict with Mark.
- **Left out, quotes read, do not re-issue** (see the notes file): 1:10, 1:11, 1:24, 2:17, 3:5, 4:12, 5:36, 6:22, 6:43–44, 7:21–22, 11:3, 12:31; the small omissions listed there; Mark 6:5 against Matthew 13:58, 14:3 against John 12:3, 1:14 against John 3:24 and 6:3 against Matthew 13:55.
- **Not examined:** the Old Testament quotations of Mark other than Malachi 3:1 (1:3, 4:12, 7:6–7, 10:6–8, 11:17, 12:10–11, 12:26, 12:29–31, 12:36, 13:24–25, 15:34); the feeding accounts and Peter’s denials across the four Gospels.
- Nothing logged in `owner-questions.md`: no new ruling was needed.

## Notes from the Luke session (2026-10-14)

- The unit is in `luke-1-24-records.json` (47 records: 40 T, all witness “Greek New Testament”, of which 34 are edition differences (KJV and TR agree, Tischendorf differs), 4 are verses the Tischendorf page prints with no text (17:36, 23:17, 24:12, 24:40) and 2 are one Greek word rendered two ways in the KJV (“inn” / “guestchamber” for κατάλυμα; “hell” for Hades and Gehenna); 7 untagged; no V; all carry `sides`) and `luke-1-24-q-records.json` (3 Q: which lord commended the steward 16:8; “It is enough” at the two swords 22:38; “within you” 17:21). Awaiting Codex. **Next: John 1–21 (bolls.life book 43, packaged KJV index 42; TR and TISCH at `https://bolls.life/get-text/TR/43/{chapter}/` and `…/TISCH/43/{chapter}/`).**
- **Codex was not behind:** only Joel to Micah, Nahum to Malachi, Matthew and Mark had no decisions file when this session started.
- **Method:** the Mark work folder copied to `%TEMP%claudelke` (Git Bash `/tmp/claude/lke`): `fnt.mjs [book:chapter …]` (fetches the unit and extra chapters; the `cache` folder must exist), `scan.mjs lo hi` (book name inside the script; about 680 lines for Luke), `pv.mjs`/`pvx.mjs`, `ovr.mjs`, `mlib.mjs` (`TT` default book now Luke), `r1.mjs` (T), `r3.mjs` (untagged), `r4.mjs` (Q), `main.mjs --urls|--write`, `notes.mjs`. The KJV uses straight apostrophes (Philip's, men's): a curly one in a KJV quotation fails the assertion. Do not build edit scripts with backticks or nested quotes inside `node -e`; use the file tool.
- **TISCH quote that sits as a substring of the TR text** needs `same: true` (and `ends` for an omission at a verse end); a quote that straddles an omitted word needs the default. A vocative that equals a dative in plain letters (Luke 23:42) must be quoted with its neighbouring word.
- Records issued here that rest on verses of other books — do not re-issue in those books: Matthew 5:1, 27:50, 27:51; Mark 16:1, 16:13; John 20:24, 13:27, 1:29, 1:34 (context 20:19). The Mark 16:1 and 16:13 conflicts were not in the Mark batch; they are issued here because no record covers the pair.
- **Left out, quotes read, do not re-issue** (see the notes file): the many small omissions listed there; 2:2 (“first made”), 6:1, 13:24 (“gate” / “door”); Luke 2:39 against Matthew 2:14–23, Luke 24:50–51 against Acts 1:3 and Luke 2:1–2 against Matthew 2:1 (silence or outside dating).
- **Not examined:** the Old Testament quotations of Luke other than 4:18–19 and 22:37 (listed in the notes); the four-Gospel accounts of Peter’s denials; the anointing at 7:36–50.
- Nothing logged in `owner-questions.md`: no new ruling was needed.

## Notes from the John session (2026-10-14)

- The unit is in `john-1-21-records.json` (55 records: 49 T, all witness “Greek New Testament”, almost all edition differences (KJV and TR agree, Tischendorf differs); 6 untagged; no V; all carry `sides`) and `john-1-21-q-records.json` (3 Q: the disciple whom Jesus loved 13:23; what Jesus wrote on the ground 8:6; which feast 5:1). Awaiting Codex. **Next: Acts 1–28 (bolls.life book 44, packaged KJV index 43; TR and TISCH at `https://bolls.life/get-text/TR/44/{chapter}/` and `…/TISCH/44/{chapter}/`).**
- **Codex was not far behind:** only Joel to Micah, Nahum to Malachi, Matthew, Mark and Luke had no decisions file when this session started (5 units, under the 12 limit).
- **Method:** the Luke work folder copied to `%TEMP%claudejhn`: `fnt.mjs [book:chapter …]` (book number inside the script), `scan.mjs lo hi` (book name inside), `pv.mjs`, `ovr.mjs`, `mlib.mjs` (`TT` default book John; new part keys: `tv` = the verse number on the TISCH page when it is numbered differently from the KJV; `nopage` = the TISCH page prints no such verse), `r1.mjs` (T), `r3.mjs` (untagged), `r4.mjs` (Q), `main.mjs --urls|--write`, `notes2.mjs`. Write every script with the file tool; a long heredoc through the shell failed on a quote.
- **TISCH page quirks in John:** its verses 1:38–1:51 are numbered one away from the KJV; it prints 5:4 empty and no 21:25. The TR page served lacks “as though he heard them not” (8:6) that the KJV has: a KJV reading that neither page carries is not issued.
- **Cross-Gospel untagged records issued here:** Matthew 28:9 with John 20:17, Matthew 3:14 with John 1:33, Matthew 26:57 with John 18:13. Do not re-issue in Acts or later sessions. Internal conflicts issued: John 3:22 with 4:2, 5:31 with 8:14, 9:39 with 12:47.
- Records issued here that rest on verses of other books — do not re-issue in those books: Matthew 3:14, 26:57, 28:9; Luke 24:39 (context).
- **Left out, do not re-issue:** name forms (Moses, Mary, Pilate), εἶπον / εἶπαν and similar, “Jesus” for “the Lord”, 3:16, 7:52, and the other small items in the notes file.
- **Not examined:** the Old Testament quotations of John (listed in the notes file) other than 19:37 and 10:34.
- Nothing logged in `owner-questions.md`: no new ruling was needed.

## Notes from the Acts session (2026-10-14)

- The unit is in `acts-1-28-records.json` (66 records: 57 T, all witness “Greek New Testament”, of which 55 are edition differences (KJV and TR agree, Tischendorf differs; four are verses the Tischendorf page prints with no text: 8:37, 15:34, 24:7 inside the 24:6–8 record, 28:29), 1 is a word record (12:4 “Easter”, both editions print πάσχα) and 1 is a name difference (27:14); 9 untagged; no V; all carry `sides`) and `acts-1-28-q-records.json` (3 Q: why the Spirit had not yet fallen on the baptized Samaritans 8:16; how the Spirit forbade 16:6–7; whose vow at Cenchrea 18:18). Awaiting Codex. **Next: Romans 1–16 (bolls.life book 45, packaged KJV index 44; TR and TISCH at `https://bolls.life/get-text/TR/45/{chapter}/` and `…/TISCH/45/{chapter}/`).**
- **Codex was not far behind:** only Joel to Micah, Nahum to Malachi, Matthew, Mark, Luke and John had no decisions file when this session started (6 units, under the 12 limit).
- **Method:** the John work folder copied to `%TEMP%claudeact` (Git Bash `$TEMP/claude/act`): `fnt.mjs [book:chapter …]` (book 44, chapters 1–28 inside the script; the `cache` folder must exist), `scan.mjs 1 28` (about 650 lines for Acts), `pv.mjs`/`pvx.mjs`/`kvx.mjs`, `ovr.mjs`, `mlib.mjs` (`TT` default book Acts; `UU` now takes `heb: [consonants]` and `hg` for an Old Testament part, which quotes the WLC text), `r1.mjs` (T; helper `E(slug, c, v, {...})` builds a single-verse edition record), `r3.mjs` (untagged), `r4.mjs` (Q), `main.mjs --urls|--write`. The `absent` check in `TT` now compares without accents or case. Do not run a Python heredoc through the shell on this machine: it hung the shell for two minutes.
- **A TISCH quote that sits inside the TR text** needs `same: true` (and `ends` when the quoted words end the verse); a quote that straddles an omitted word needs the default. A word the TR prints with a double letter (ἐννεοί) or an extra article (ἐκ τοῦ μισθοῦ) breaks a quote that spans it: quote the shorter run.
- Records issued here that rest on verses of other books — do not re-issue in those books: Matthew 27:5, 27:7 (27:6 context); Galatians 1:18–19; Amos 5:27; Psalms 16:9; Isaiah 53:8; Exodus 4:10; Luke 22:1 (context).
- `emmor-the-father-of-sychem-…-acts-7-16-…` shares Acts 7:16 with the published `shechem-burial-land-purchaser`; the notes say how they differ.
- **Left out, quotes read, do not re-issue** (see the notes file): name forms and spellings, small differences of tense, order or particle, range-of-sense English (19:2 “since ye believed”, 17:22, 26:28), 11:12, and several small omissions left out for batch size (8:10, 9:12, 13:42, 17:5, 18:25, 24:26). Acts 4:34 with 6:1 and 2:38 with 8:16 were left out as reconcilable at a glance.
- **Not examined:** most Old Testament quotations of Acts (listed in the notes file) and Paul’s visits to Jerusalem against Galatians 1–2 other than Galatians 1:18–19.
- Nothing logged in `owner-questions.md`: no new ruling was needed.

## Notes from the Romans session (2026-10-14)

- The unit is in `romans-1-16-records.json` (44 records: 38 T, all witness “Greek New Testament”; 6 untagged; all carry `sides`) and `romans-1-16-q-records.json` (3 Q: the I of 7:14; who subjected the creature 8:20; Andronicus and Junia 16:7). Awaiting Codex. **Next: 1 Corinthians to 2 Corinthians (bolls.life books 46 and 47, packaged KJV indexes 45 and 46).**
- Method as in the Acts session; work folder `%TEMP%/claude/rom`. A session that died earlier had built the scripts there and not written files (no lock was left); this session fixed five failing quotes (5:1, 10:15, 15:15, 15:24, 16:16) and wrote the files. Do not re-run `--write`: notes exist.
- Codex had 7 units without decisions at the start (Joel to Micah partly decided), under the limit.
- Records resting on verses of other books — do not re-issue: Luke 1:6, Hosea 8:4, Leviticus 11:8, Genesis 6:13.
- Nothing logged in `owner-questions.md`.

## Notes from the 1 Corinthians to 2 Corinthians session (2026-10-14)

- The unit is in `1-corinthians-to-2-corinthians-records.json` (44 records: 40 T, all witness “Greek New Testament”, all edition differences (KJV and TR agree, Tischendorf differs); 4 untagged; no V; all carry `sides`) and `1-corinthians-to-2-corinthians-q-records.json` (3 Q: baptized for the dead 15:29; the thorn in the flesh 2 Cor 12:7; because of the angels 11:10). Awaiting Codex. **Next: Galatians to 2 Thessalonians (bolls.life books 48–53, packaged KJV indexes 47–52; Galatians 6, Ephesians 6, Philippians 4, Colossians 4, 1 Thessalonians 5, 2 Thessalonians 3).**
- **Codex was 8 units behind at the start** (Joel to Micah partly decided, then Nahum to Malachi through Romans without decision files), under the limit of 12.
- **Method:** the Romans work folder copied to `%TEMP%/claude/cor`: `fnt.mjs` (books 46 and 47 inside), `scan.mjs lo hi "1 Corinthians"` (book name is the fourth argument), `pv.mjs`/`pvx.mjs`/`kvx.mjs`, `ovr.mjs`, `mlib.mjs` (`TT` takes `b` per part; default 1 Corinthians), `r1.mjs` (T; helper `E(slug, book, c, v, {...})`), `r3.mjs`, `r4.mjs`, `main.mjs --urls|--write`. `python3 -` with no input hangs the shell: never call it. Write README edits with a script file, not a shell string: backticks in a double-quoted string are executed.
- **Assertion rules that bit:** `absent` means absent from the TISCH page (not from the TR); a TISCH quote that is a prefix of the TR text needs `same: true` and `ends`; a quote that straddles an omitted word must not be a substring of the TR text, so quote across the gap. The TR and Tischendorf spell Areopagite differently: quote the shorter run.
- **KJV that follows Tischendorf, not the TR as served:** 1 Corinthians 6:14 (“raise up us”). Not issued.
- **2 Corinthians 13:** Tischendorf’s page runs the KJV’s 13:12 and 13:13 together and has no 13:14. No record rests on those verses.
- Records issued here that rest on verses of other books — do not re-issue in those books: Acts 17:34 and Acts 9:23 (9:24–25 context); Matthew 28:16 (Luke 24:33 context).
- **Left out, do not re-issue:** name forms and spellings; small tense, number and order differences; the cross-book items listed in the notes file; no V.
- **Not examined:** the Old Testament quotations of the two letters listed in the notes file.
- Nothing logged in `owner-questions.md`: no new ruling was needed.

## Notes from the Galatians to 2 Thessalonians session (2026-10-14)

- The unit is in `galatians-to-2-thessalonians-records.json` (55 records: 53 T, all witness “Greek New Testament”, all edition differences (KJV and TR agree, Tischendorf differs); 2 untagged: Galatians 6:2 with 6:5 (two Greek nouns for “burden”) and Ephesians 6:2 with Exodus 20:6 (“first commandment with promise”); no V; all carry `sides`) and `galatians-to-2-thessalonians-q-records.json` (3 Q: what withholdeth 2 Thessalonians 2:6–7; the epistle from Laodicea Colossians 4:16; angels and the mediator Galatians 3:19–20). Awaiting Codex. **Next: 1 Timothy to Hebrews (bolls.life books 54–58, packaged KJV indexes 53–57; 1 Timothy 6, 2 Timothy 4, Titus 3, Philemon 1, Hebrews 13).**
- **Codex was 9 units behind at the start** (Joel to Micah partly decided, then Nahum to Malachi through 1 Corinthians to 2 Corinthians without decisions files), under the limit of 12. Expect the count to be 10 after this session; the next run may stop if it passes 12.
- **Method:** the 1 Corinthians to 2 Corinthians work folder copied to `%TEMP%/claude/gal`: `fnt.mjs` (books 48–53 with chapters 6, 6, 4, 4, 5, 3 inside; the `cache` folder must exist), `scan.mjs lo hi "Book"`, `pv.mjs`/`pvx.mjs`/`kvx.mjs`, `ovr.mjs`, `mlib.mjs` (`TT` takes `b` per part), `r1.mjs` (T; helper `E(slug, book, c, v, {...})`; the id suffix uses the book slug), `r3.mjs`, `r4.mjs`, `main.mjs --urls|--write`, `notes.mjs` (writes the Q notes then the main notes). In `head21.mjs` the `finish` file names and the draft exclusion must be changed for each unit. A bash heredoc holding an apostrophe broke the shell again: write every script with the file tool.
- **Assertion rules that bit:** `absent` means absent from the TISCH page; for a verse where the TR has extra words and TISCH ends earlier, the TISCH quote is a prefix of the TR text and needs `same: true` and `ends`. A name the two editions spell differently (Λαοδικίας / λαοδικειας) breaks a quote that spans it: quote the neighbouring words.
- **KJV that follows Tischendorf, not the TR as served:** Galatians 4:15 (“Where is then the blessedness”) and 4:17 (“exclude you”). Not issued.
- **Subscriptions** (“written from Rome …”) and Tischendorf’s lack of them are not issued; the TISCH page prints the two clauses of Philippians 1:16–17 in the other order, issued as one record.
- Records issued here that rest on verses of other books — do not re-issue in those books: Exodus 20:4 and 20:6 (Ephesians 6:2 with Exodus 20:6).
- **Left out, do not re-issue:** name forms and spellings; “Christ Jesus” / “Jesus Christ”; small tense, number and order differences; Galatians 1:11–12 with 1 Corinthians 15:3, Galatians 1:1 with John 2:19 and Galatians 2:1–10 with Acts 15 (reconcilable at a glance); Galatians 2:16 with James 2:24 (covered by `coverage-nt-faith-works`).
- **Not examined:** the Old Testament quotations of the six letters listed in the notes file.
- Nothing logged in `owner-questions.md`: no new ruling was needed.

## Notes from the 1 Timothy to Hebrews session (2026-10-14)

- The unit is in `1-timothy-to-hebrews-records.json` (53 records: 51 T, 50 witness “Greek New Testament” (48 edition differences where the KJV and TR agree and Tischendorf differs; 2 word or noun records: Hebrews 2:16 and 9:1) and 1 witness “Septuagint” (Jeremiah 31:32 with Hebrews 8:9); 2 untagged: 1 Timothy 6:16 with Exodus 24:10 and 33:11, and Titus 1:2 and Hebrews 6:18 with 1 Kings 22:22–23; no V; all carry `sides`) and `1-timothy-to-hebrews-q-records.json` (3 Q: saved in childbearing 1 Timothy 2:15; whose repentance and what Esau sought Hebrews 12:17; Jannes and Jambres 2 Timothy 3:8). Awaiting Codex. **Next: James to Jude (James 5, 1 Peter 5, 2 Peter 3, 1 John 5, 2 John 1, 3 John 1, Jude 1 = 21 chapters; bolls.life books 59–65, packaged KJV indexes 58–64; TR and TISCH at `https://bolls.life/get-text/TR/{book}/{chapter}/` and `…/TISCH/…`).**
- **Codex was nine or ten units behind at the start** (Nahum to Malachi partly decided; Matthew through Galatians to 2 Thessalonians without decisions files), under the limit of 12. Expect the count to be 10 or 11 after this session; the next run may stop if it passes 12.
- **Method:** the Galatians work folder copied to `%TEMP%/claude/heb`: `fnt.mjs` (books 54–58 with chapters 6, 4, 3, 1, 13 inside; the `cache` folder must exist), `scan.mjs lo hi "Book"`, `pv.mjs`, `ovr.mjs`, `mlib.mjs`, `r1.mjs` (T; helper `E(slug, book, c, v, {...})`; a custom `TT({...})` for the two word records; a hand-built `rec` with `H`, `Graw` and `N` for a record that mixes Hebrew, Septuagint and New Testament), `r3.mjs` (untagged, with `heb` and `gr`), `r4.mjs` (Q), `main.mjs --urls|--write`, `notes.mjs`, `fw.mjs` (fetches WLC chapters by book and chapter number into the cache). Records must be regenerated with `--write` only while no notes file exists.
- **Assertion rules that bit:** a TISCH quote that is a suffix of a TR phrase containing it as a substring (ὃς inside θεὸς) must be quoted with a neighbouring word; a TISCH quote with an article the TR lacks (τὸν θεόν) must be shortened; accent marks matter (πατρὸς against πατρός).
- **KJV that follows Tischendorf, not the TR as served:** Hebrews 10:2, 11:4, 12:3, 13:23. Not issued.
- **Hebrews 2:16 and 9:1 are new in kind** (a KJV noun or phrase the Greek does not print, with both editions or one edition lacking it). Wait for Codex’s view before issuing another of that kind in James to Jude.
- Records issued here that rest on verses of other books — do not re-issue in those books: Jeremiah 31:32 (with Hebrews 8:9); Exodus 24:10, 33:11 (with 1 Timothy 6:16); 1 Kings 22:22–23 (with Titus 1:2 and Hebrews 6:18); Exodus 7:11, 7:22, 8:7 and Genesis 27:34, 27:38 (context in Q records).
- **Left out, do not re-issue** (see the notes file): name forms and spellings; tense and spelling forms; “Christ Jesus” / “Jesus Christ” (1 Timothy 5:21); range-of-sense English (Hebrews 4:9 “rest”, 9:15–17 “testament”, 1 Timothy 6:10 “root of all evil”); Hebrews 1:9 “iniquity”; Hebrews 3:9; Hebrews 11:26.
- **Not examined:** the Old Testament quotations of the five books other than those listed; Hebrews 9:20 with Exodus 24:8 (read, not issued).
- Nothing logged in `owner-questions.md`: no new ruling was needed.

## Notes from the James to Jude session (2026-10-14)

- The unit is in `james-to-jude-records.json` (64 records: 63 T, all witness “Greek New Testament”, all edition differences (KJV and TR agree, Tischendorf differs); 1 untagged: Balaam “son of Bosor” (2 Peter 2:15) with “son of Beor” (Numbers 22:5, Hebrew WLC); no V; all carry `sides`) and `james-to-jude-q-records.json` (3 Q: the spirits in prison 1 Peter 3:19–20; the gospel preached to the dead 1 Peter 4:6; the sin unto death 1 John 5:16–17). Awaiting Codex. **Next: Revelation 1–22 (bolls.life book 66, packaged KJV index 65; TR and TISCH at `https://bolls.life/get-text/TR/66/{chapter}/` and `…/TISCH/66/{chapter}/`). It is the last unit; when it is done write ALL-DONE.txt.**
- **Codex was about 10 units behind at the start** (Nahum to Malachi partly decided, through Habakkuk and Zephaniah; Matthew through 1 Timothy to Hebrews without decisions files), under the limit of 12. Expect the count to be 11 after this session; the Revelation run stops quietly if it is above 12.
- **Codex lessons from Habakkuk and Zephaniah (2026-10-14):** 13 accepted, 3 corrected, none held. Corrections: where the Septuagint prints a name or a description in place of the KJV’s name or description, say that the two may refer to the same figure or place and that no different referent is established (Zephaniah 1:5, 1:11); do not let a record say what an antecedent is where the clause does not (Habakkuk 2:4 “his”).
- **Method:** the 1 Timothy to Hebrews work folder copied to `%TEMP%/claude/jam`: `fnt.mjs` (books 59–65 with chapters 5, 5, 3, 5, 1, 1, 1 inside), `scan.mjs lo hi "Book"`, `pv.mjs`, `ovr.mjs` (overlap search of published and drafted records), `mlib.mjs`, `r1.mjs` (T; helper `E(slug, book, c, v, {...})` with `d` for the title tail and `why`), `r3.mjs`, `r4.mjs`, `main.mjs --urls|--write`, `notes.mjs`, `fw.mjs` (WLC chapters by book number). `srch.mjs "phrase" lo hi` searches the packaged KJV (it ends with a harmless TypeError at the last book). Write scripts with the file tool.
- **Assertion rules that bit:** `absent` means absent from the TISCH page, so it is never used for a word Tischendorf prints; a TISCH quote that is a suffix of the TR text (μοιχαλίδες, οὐκ οἴδατε) needs `same: true`; a quote that spans a word the TR spells with a final nu (κριθῶσιν) must be cut; a TR clause with an extra pronoun (καταρτίσαι ὑμᾶς) must be quoted as the page prints it. A burst of bolls.life 429 answers in `--urls` is rate limiting: check the failed addresses singly.
- **KJV that follows Tischendorf, not the TR as served:** James 2:18 (“without thy works”), 1 Peter 1:3 (“begotten us”) and 1:4 (“for you”), 1 John 2:23 (the italic clause). Not issued.
- **3 John:** Tischendorf’s page splits the KJV’s verse 14 into 14 and 15; no record rests on that split.
- **1 John 5:7–8** is one record for the two verses (the Tischendorf page prints no heavenly witnesses and no “in the earth”); do not re-issue it by verse.
- Records issued here that rest on verses of other books — do not re-issue in those books: Numbers 22:5 (with 2 Peter 2:15). The Hebrew of Numbers 31:8 and Deuteronomy 23:4 (“son of Beor”) was not fetched.
- **Left out, do not re-issue** (see the notes file): name forms and spellings; “Christ Jesus” / “Jesus Christ”; differences in tense, number, order or particle where the KJV’s English fits both Greek words; James 1:13 with Genesis 22:1, James 2:21–25 and 1 John 1:8 / 3:6 / 3:9 (already covered).
- **Not examined:** the Old Testament quotations of the seven books listed in the notes file.
- Nothing logged in `owner-questions.md`: no new ruling was needed.

## Notes from the Revelation session (2026-10-14)

- The unit is in `revelation-1-22-records.json` (48 records: 48 T, all witness “Greek New Testament”; 47 edition differences (KJV and TR agree, Tischendorf differs) and 1 word record, 16:5, where both editions print ὁ ὅσιος and the KJV has “and shalt be”; no untagged; no V; all carry `sides`) and `revelation-1-22-q-records.json` (3 Q: the two witnesses 11:3–12; the 144,000 and the multitude 7:4, 7:9, 14:1–4; the number of the beast 13:17–18). Awaiting Codex. **This was the last unit; ALL-DONE.txt was written.**
- Codex was ten units behind at the start (Matthew through James to Jude without decisions files), under the limit of 12.
- Method: the James to Jude work folder copied to `%TEMP%/claude/rev` (`fnt.mjs` with book 66 and 22 chapters, `scan.mjs`, `pv.mjs`, `mlib.mjs`, `r1.mjs`, `r4.mjs`, `main.mjs --urls|--write`).
- Assertion rules that bit: a TISCH quote that is a substring of the TR text needs `same: true`, and then the TR verb form must match (6:7 prints λέγοντος in TISCH and λέγουσαν in the TR, so `same` is false there); a second quote in one part cannot be a substring of the TR if `same` is false (14:5: use `ends` and `absent` for the second difference).
- The Revelation records that rest on verses of other books: Zechariah 4:14 (KJV only, in the two-witnesses Q). Do not re-issue.
- Nothing logged in `owner-questions.md`: no new ruling was needed.

## Owner ruling: all books follow the same rules (2026-10-12)

Given by the owner in the Claude session, in answer to the two Genesis questions: "All books should follow the same rules."

Claude's reading of it, to be corrected by the owner if wrong:

- Every book gets the same full review: H, G, V, untagged conflicts and Q. No book is Q-only because of where it falls in the order.
- Exodus, Leviticus, Numbers and Deuteronomy have never had a Claude session for H, G, V or untagged conflicts. Each now gets one. (Genesis had its session on 2026-10-12: `genesis-1-50-records.json`.) For Exodus to Deuteronomy, do it in the same session as that book's Q review. Genesis needs a separate session, since its Q review is already written; start from the items listed under "Seen in passing" in `genesis-5-50-q-notes.md`.
- Joshua to 2 Kings have already had their full sessions, so their backlog sessions stay Q-only.
- Genesis 49:10 (Shiloh) is to be examined for G in the Genesis session, like any other verse where the Greek differs from the KJV. The Q record stands as issued.

## Open questions for the owner

- From Codex’s Deuteronomy integration (2026-10-13): **answered — no; see “Owner ruling on wording-only H”. Nothing is on hold.** The question was: should H be allowed where the Hebrew lacks a word the KJV supplies but the Hebrew wording can carry the same meaning (Deuteronomy 27:26, “all the words of this law”; held record `confirmeth-not-all-the-words-of-this-law-hebrew-has-no-all`)? Claude’s recommendation: no — keep the standing test (“H needs a shown meaning difference”) and leave the record held. 

- From Codex’s Exodus integration (2026-10-13): answered — see "Owner ruling on H and proper names". Codex has the ruling and has published `red-sea-or-sea-of-suph-hebrew`. Nothing is outstanding from Leviticus or Numbers.

- From the Genesis 5–50 Q session: both answered — see "Owner ruling: all books follow the same rules".

- None outstanding from 1 Samuel; both were answered (see above).
- From 2 Samuel: answered — such records are allowed (see the 2 Samuel lessons).
- From 1 Kings: answered — see "Owner ruling on records spanning two books" below.
- From 2 Kings: should a session write `verse-roles.json` (sides) for the published records?
- From Nehemiah (2026-10-13), decided and logged in `owner-questions.md`, not a hold: may the held booths record (Nehemiah 8:17 with Ezra 3:4) be published late? Decided no; it stays held.
- From Joel to Micah (2026-10-13), decided and logged in `owner-questions.md`, not a hold: may a wording contrast between an Old Testament verse and the New Testament verse that quotes it (Joel 2:28 with Acts 2:17; Micah 5:2 with Matthew 2:6) be issued untagged? Decided yes, with scopes that say the two could both stand.
- From Job 1–21 (2026-10-13), decided and logged, not a hold: is “curse” for the Hebrew verb of blessing (1:11, 2:5), or “their mourning” for the letters of “leviathan” (3:8), a meaning difference for H? Decided no; both issued as G only.
- From Psalms 1–41 (2026-10-13), decided and logged in `owner-questions.md`, not a hold: is “they pierced” (22:16) where the Leningrad text has the letters of “like a lion”, or “angels” (8:5) where the Hebrew has the word usually rendered “God”, a meaning difference for H? Decided no; both candidates were left out.
- From 2 Chronicles (2026-10-13), decided and logged in `owner-questions.md`, not a hold: is “a book” for a definite Hebrew phrase (34:14) a meaning difference for H? Decided no; the candidate was left out.
- From the Q batch: both answered — see "Owner ruling on Q".

## Owner ruling on records spanning two books (2026-10-12)

A record that sets a verse in one book against a verse in another is issued in the session of **whichever book comes first**, not held for the later book. This includes Old Testament records that rest on a New Testament verse (`elijah-drought-ended-in-third-year-or-after-three-years-six-months`, 1 Kings 18:1 against Luke 4:25 and James 5:17). Fetch and quote the other book's original-language text in the same session. In the later book's session, find the record in `data/evidence.json` and do not re-issue it.
