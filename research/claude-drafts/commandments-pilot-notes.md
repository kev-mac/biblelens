# Commandments pilot: draft notes (2026-10-17)

Plan: `commandments-category-plan.md`. Records: `commandments-pilot-draft.json` (42 records). Drafts only; nothing is accepted until Codex integrates.

## Not a normal batch: read before processing

- The files are named `-draft`, not `-records`, on purpose, so the scheduled integration run does not pick them up. Rename to `commandments-pilot-records.json` and `commandments-pilot-notes.md` when Codex is ready.
- `mode: "commandments"` does not exist yet. Codex's contract lists history, contradictions, science and questions. Codex needs the new mode, plus the app and schema work in the plan, before these records can be inserted.
- New fields not in the current schema: `theme`, `commandmentType` (moral, civil, ritual), `tenCommandments`, `wordsOfJesus`, `repeatedIn`. Per the owner, no T, V or Q tags; `tags` is omitted.
- `wordsOfJesus` is set on all 17 Matthew records (Sermon on the Mount and Matthew 22). Codex should derive the label from `src/red-letters.js` rather than trust this flag. The entries for chapters 22, 6 and 7 exist there.

## How the records were made

- Every KJV quotation was pulled by script from `data/chapters.json`, so it is exact. Each `sides` quote is the full key verse and was checked as a substring of that verse. No Hebrew or Greek wording is quoted, so there is no `languageContext`; the pilot makes no translation claims.
- No evidence IDs overlap (all start `commandment-`).
- Pilot coverage: Exodus 20–23, Deuteronomy 6 (chapter 5 is covered through `repeatedIn` on the Ten Commandments), Matthew 5–7 (selected), Matthew 22:37–40.
- Counts by theme: Property and economics 6, Truth and justice 6, Love of God and neighbor 6, Worship of God 5, Prayer and fasting 4, Life and violence 3, Marriage and sexual conduct 3, Care for the poor and the stranger 3, Sabbath and rest 2, Family 2, Festivals and sacrifice 1, Food and purity 1. Themes with one record are thin only because the pilot is small.
- `repeatedIn` lists are written by hand from memory of cross-references and are not checked against the text. Codex should verify them or drop the field.

## Judgement calls to check

- Rule used: an explicit command in the text. Matthew 5:31–32 is included because it is phrased as an instruction about divorce. Matthew 5:1–20 and 7:13–29 were left out of the pilot, not ruled out.
- Exodus 22:18 (“witch”) and Exodus 23:19 (kid in milk) are included without translation claims, because the owner's rule is what the text commands.
- Exodus 23:1–3 combines three verses because 23:3 (do not favor a poor man in a dispute) qualifies the other two.
- Exodus 21:2 sits under Property and economics because there is no slavery theme. Question for the owner: add a "Slavery and servants" theme if more records land there.
- `commandmentType` is a judgement. Sabbath is marked ritual; the Ten Commandments' Sabbath could equally be moral. It only drives a filter, not the structure.

## Considered and left for later

- Exodus 20:22–26 (altar), 21:12–22:17 (case laws), 22:28–31, 23:20–33. Deuteronomy 5 as its own records. Matthew 5:1–20, 6:24, 7:13–29.
- The optional `relatedRecords` field (phase two). Obvious later links: Sabbath to the Numbers 15 stick-gatherer record; Matthew 5:38–42 to Exodus 21:23–25.

## Questions for the owner

None open. Decisions of 2026-10-17 are in the plan.
