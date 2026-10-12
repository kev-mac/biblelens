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

**Cleared 2026-10-12.** The outstanding items were re-issued as records in `joshua-21-24-records.json` and `judges-3-12-records.json`, with notes beside each. The prose drafts above are superseded; do not re-issue from them. `hebrew-greek-sourcing-1.md` §1.5 is wrong about the Leningrad Codex at Joshua 21:36–37 — see `joshua-21-24-notes.md`. Judges 13–21 is in `judges-13-21-records.json`. Ruth is in `ruth-1-4-records.json` (processed by Codex: 6 published, 1 held). 1 Samuel is in `1-samuel-1-31-records.json`. Next book: 2 Samuel.

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

## Open questions for the owner

- V: does a later verse that calls an act "not lawful" without condemning it (Matthew 12:4 on 1 Samuel 21:6) count as the act being "checked"? Record `david-shewbread-not-lawful` depends on the answer.
