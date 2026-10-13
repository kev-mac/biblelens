# Genesis 1–4 — Q proposals, notes for `genesis-1-4-q-records.json`

Researcher: Claude · 2026-10-12 · **All 3 records are drafts until Codex accepts them.** Nothing outside `research/claude-drafts/` was changed. Written in answer to `outputs/Claude-Q-Research-Prompt.txt` and the Q section of `research/notes/claude-integration-workflow.md`.

Every KJV, Hebrew and Greek quotation was cut by script and asserted to be an exact run of characters in the stated verse. Every `sides` quote passed `validateSides` in `scripts/verse-roles.mjs`. All three records are new IDs, `mode: "questions"`, `tags: ["Q"]`, `status: "Context"`. No existing record is extended or changed.

Existing records inspected: `genesis-1-celestial-sequence` (Genesis 1:11–19, vegetation before the Sun), `legacy-science-1` (1:11, with 1:3 and 1:16 as refs, same point), `science-sky-dome` (1:6–7). None asks what the first-day light was. There is no published record on Genesis 4, and no earlier Q draft in this folder.

## Records

| ID | Key verses | Context verses | Why it qualifies |
|---|---|---|---|
| `genesis-1-light-before-the-lights-source-unstated` | 1:3, 1:5 (A); 1:14 (B) | 1:4, 1:16, 1:18, Job 38:19, Isaiah 45:7, 2 Cor 4:6 | Light, Day and Night and three counted days come before the lights whose stated work is to divide day from night. The source of the earlier light is a mechanism the passage leaves unstated. |
| `cain-feared-being-slain-by-whom` | 4:14, 4:15 (A) | 4:1, 4:2, 4:25, 5:4 | Cain's fear and the Lord's mark both assume other people; four have been named and one is dead. An identity the passage leaves unstated. |
| `cain-wife-unnamed-origin-unstated` | 4:17 (A) | 4:16, 4:1, 5:4 | A wife appears with no name, parent or origin, when the only woman mentioned so far is Eve. |

## How each was bounded

- **Light.** The record does not say light needs the Sun and does not say the passage is wrong. It names three readings (light direct from God; lights existing earlier and appointed or shown on day four; an order not meant as a time sequence) as interpretations, none stated in the text. It records one observation from the original languages: the Hebrew has one noun for the light of day one and a different, related noun for the lights of day four, and Brenton's Greek does the same. No H or G is proposed; the KJV's "light" and "lights" follow that difference.
- **Mode.** Corrected 2026-10-12: all three records now have `mode: "questions"`. They were first drafted as `science` (light) and `history` (Cain) under the earlier instruction, which the owner and Codex have withdrawn: Unanswered Questions is its own category. Only the `mode` line changed in each record; IDs, wording, sources, refs and sides are as first drafted. Codex has still to add support for this mode, so the records wait for that.
- **Cain's attackers.** The record says that four people named is not four people existing. It gives the two usual readings (Adam's other children, Genesis 5:4; or other people) as readings and asserts no kinship.
- **Cain's wife.** Same limits. The record says why this unnamed person is material where most are not: no family she could come from has yet been mentioned.
- **"Answered elsewhere" check.** Each record states the check actually made and calls it a word search, not a whole-Bible reading. Light: all 243 packaged-KJV verses containing "light" or "lights" were listed; those that also mention darkness with making, forming, commanding or dividing were read, with Job 38:19. Cain: every verse outside Genesis containing "Cain" was read (Hebrews 11:4, 1 John 3:12, Jude 1:11; Joshua 15:57 is a town).

## Considered and not proposed

- **Humanity made in 1:26–27 before Adam is formed in 2:7.** Not proposed as Q. The prompt's own limit applies: narrative order does not by itself establish an earlier population, and the question only arises if one reading of the two chapters is taken as fact.
- **Who lived in the city Cain built (4:17).** Folded into the wife record's scope as one sentence; by itself it is the same gap as the attackers.
- **What the mark on Cain was (4:15).** An unspecified detail with no consequence for the story as told; trivial under the Q test.
- **Evening and morning before the Sun as a separate record.** It is the same gap as the light; kept as part of that record.
- **Where the waters and darkness of 1:2 came from.** Arises only on one reading of 1:1 as a summary heading; excluded.
- **Why Abel's offering was accepted and Cain's not (4:4–5).** Answered elsewhere, at least in part: Hebrews 11:4 and 1 John 3:12 each give a reason. Excluded.
- **The serpent's identity and speech (3:1).** Not examined in this batch.

## Questions

For the owner: none outstanding. Both earlier questions are answered: every book session brings its own Q candidates and earlier books are to be reviewed; Q records take `mode: "questions"`.

For Codex: the records use `mode: "questions"`, which the build does not yet accept.
