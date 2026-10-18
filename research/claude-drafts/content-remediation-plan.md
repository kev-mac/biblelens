# Content remediation plan (drafted 2026-10-18, for owner approval)

Status: proposal only. Nothing here changes the scheduled task or control files. Claude writes in `research/claude-drafts/`; Codex integrates into `data/` and `src/`.

## 1. What the audit found (measured 2026-10-18)

| Content type | Where it lives | Coverage today | Gap |
|---|---|---|---|
| Stories | `data/stories.json` | **Genesis only** (25 stories, 46 of 50 chapters). 65 books have none. | Largest gap by far |
| Characters (curated profiles) | `src/data/characters.json` | 47 profiles: 38 anchor in Genesis, 4 Numbers, 3 Exodus; 28 Patriarchal, 10 Primeval; almost no Judges to Revelation | Curated people stop near the Exodus |
| Characters (directory) | `data/reference/people.json` | 3,067 Theographic people, all listed, but unreviewed and mostly without a written profile | Profiles missing |
| Contradictions / T / Q | `data/evidence.json` (1,353 contradictions, 155 Q) | Every book researched once; 879 of 1,189 chapters carry an annotation | Thin books below |
| Academic comparisons | `data/academic-discrepancies.json`, `data/timeline-events.json` | 6 broad cases and **10 timeline cards**, mostly Genesis to Judah; `history` mode records: Exodus 19, Numbers 20, Leviticus 16, Deuteronomy 12, most other books 1 | NT, Gospels, Kings and Prophets under-covered |
| Science | `mode: science` | 30 records, essentially Genesis 1 to 11 | Rest of the Bible untouched |
| Commandments | 613 catalog, 42 evidence records | Complete as a catalog | Evidence links only |
| Prophecies | `src/data/prophecies.json` | 4 KB file, near empty | Needs a plan of its own |

Chapter annotation coverage, lowest first: Job 33%, Proverbs 45%, Psalms 47%, Jeremiah 54%, Isaiah 55%, 2 Chronicles 56%, Ecclesiastes 58%, 1 Thessalonians 60%, 2 Corinthians 62%, 1 Chronicles 62%, then Zephaniah, 2 Thessalonians, 2 Kings, Ezekiel, Esther, Zechariah (all under 72%). Note `coverage-audit.json` says annotation presence is not proof of review. A chapter with no record may simply have no qualifying finding, so low coverage in poetry and wisdom is partly expected under the "fewer, well-sourced records" rule. The remedy for those is a documented "reviewed, nothing qualifies" ledger, not forced records.

## 2. Principles

1. Same rules as today: Hebrew and Greek are the sources of truth; KJV is the comparison; no arguments from silence; every record carries the Codex limits.
2. Separate "reviewed, nothing found" from "not reviewed". Add a per-chapter ledger so coverage becomes measurable.
3. Stories and Characters are descriptive content, not debate findings. They need a schema, a sourcing rule (Theographic plus KJV text, summaries in our own words) and Codex validators (`check-stories.mjs`, `check-characters.mjs` already exist).
4. One unit per run, as the current cadence allows; no changes to the live research loop.

## 3. Workstreams

### A. Chapter review ledger (do first, small)
Claude drafts `research/claude-drafts/chapter-ledger.json`: for all 1,189 chapters, status `records`, `reviewed-none`, or `unreviewed`, with a one-line reason. Codex confirms against `coverage-audit.json`. This turns "may be incomplete" into a target list. Seed from existing `*-notes.md` "ruled out" lists, which already record what was considered.

### B. Stories for 65 books (largest)
- Unit: one book (or a part of a long one), 4 to 25 stories each, in the existing shape: title, passage, summary, cross_references, topics (use `data/reference/topics.json` and `scripts/story-topics.mjs` vocabulary).
- Order: Exodus to Deuteronomy, Joshua to 2 Kings, the Gospels, Acts, then Ezra to Esther, prophets, epistles, Revelation; wisdom books last with thematic "passages" rather than narratives.
- Output: `{book}-stories.json` plus notes. Codex merges into `data/stories.json`, runs `check-stories.mjs`.
- Estimate: about 66 units; at two per hour roughly 33 hours.

### C. Characters
- Tier 1: promote people who appear in published stories, plus anyone with 50 or more references in `people.json`, to curated profiles in the existing schema (era, lineage, geography, key verses, linked stories). Extend the era set only if the owner agrees. Target about 250.
- Tier 2: short generated-from-source profiles (name, tribe or role, key verses, family from `relationships.json`) for people with 10 or more references.
- Tier 3: leave as directory entries.
- Dependency: linked stories need workstream B first for the same books.

### D. Contradictions and T records, thin books
- Targeted second passes on Job, Proverbs, Psalms, Jeremiah, Isaiah, 1 and 2 Chronicles, Ecclesiastes, 2 Corinthians, 1 and 2 Thessalonians, using the ledger to skip chapters already ruled out.
- Focus on parallel passages (Chronicles against Samuel and Kings, the Gospels, Psalms duplicated in Samuel, Isaiah and Kings, Jeremiah 52 and 2 Kings 24-25), where direct wording and arithmetic contrasts are most likely.
- A completeness pass for the Gospel harmony and Kings/Chronicles number tables as whole-set checks rather than per chapter.

### E. Academic comparisons
- Expand `academic-discrepancies` and timeline cards from 10 to about 40: Exodus and Sinai, Judges and the monarchy, Kings synchronisms (Shishak, Omri, Jehu, Hezekiah), Exile and return, Daniel, Gospel-era figures (Quirinius, Herod, Pilate, Gallio, Erastus), Acts chronology.
- Rule already in force: only primary publications that were opened; no archaeology or dating from memory. Each card needs `reviewed`, source list and a qualified status.
- Add a science pass beyond Genesis 1 to 11 (Job, Psalms, Ecclesiastes, Leviticus hare and bat) if the owner wants the mode kept.

### F. Prophecies
Define the schema and scope question for the owner first (what counts as a prophecy and its fulfilment, who judges). Do not research until answered.

## 4. Sequencing

1. Owner approves this plan and answers the questions below.
2. A (ledger), one or two runs.
3. B and D alternate by book (interleave so each run is one unit); C Tier 1 follows B per testament; E in parallel as separate runs near the end.
4. Codex: one integration batch per day, decisions file per batch as today.
5. Full review by both tools at the end, per the README.

## 5. Owner answers (2026-10-18)

- Q2 Characters: Tier 1 only for now; Tier 2 is a future release.
- Q3 Scheduling: create a new scheduled task; leave `scripture-lens-next-book` alone.
- Q4 Ledger: keep internal, not shown in the app.
- Q5 Prophecies: out of scope for now; maybe a future release (workstream F is deferred).
- Q1 Stories scope: option A, narrative only (including the narrative frame of mixed books such as Job 1-2 and 32-42, and Daniel, Jonah, Esther, Ruth). No thematic entries for Psalms, Proverbs, Ecclesiastes, Song of Solomon, Lamentations or oracle-only chapters for now; option B (thematic entries) maybe later.

## 5a. Original questions

1. Is the stories scope narrative-only, or may wisdom/prophecy books use thematic passages?
2. Character target: Tier 1 only (about 250), or Tier 2 too?
3. May the scheduled task `scripture-lens-next-book` be pointed at a new queue (ALL-DONE.txt is present), or should these run as a separate task?
4. Should "reviewed, nothing qualifies" be shown in the app, or kept internal?
5. Prophecies: in scope for this round?

## 6. Done means

Every chapter has a ledger status; every book has stories; characters cover everyone in a story; thin books have had a second pass; academic cards span OT and NT; `npm` check scripts pass; `coverage-audit.json` regenerated.

## 7. Progress log
- 2026-10-18: stories drafted for 29 books (273 stories); see `stories-batch-notes.md`.
- 2026-10-18: `chapter-ledger.json` created from `coverage-audit.json`: 879 chapters have records, 310 have none. The ledger cannot yet say which of the 310 were reviewed and found empty; that needs the book-by-book pass in workstream D.
- 2026-10-18 finding: earlier session notes state "The book was not read in full" and list the verses actually compared (e.g. 1 Chronicles notes line 41; 2 Chronicles notes line 50). So the 310 no-record chapters are mostly unread, not reviewed-and-empty. Workstream D therefore means first-time reading, not re-checking. Suggested method per book: read the no-record chapters in KJV, compare against parallels and the Hebrew/Greek, check `data/evidence.json` and the earlier notes' ruled-out lists, then log each chapter as `records`, `reviewed-none` or `held`.
- First leads spotted while sampling (not yet verified in Hebrew, not drafted): 2 Chronicles 23:1-8 (Levites and priests as door-keepers) beside 2 Kings 11:4-9 (captains and guard) is not in any earlier notes file; 1 Chronicles 13:1-5 beside 2 Samuel 6:1 (all Israel gathered, captains of thousands, against 30,000 chosen men). Both need a full read before they become records.
