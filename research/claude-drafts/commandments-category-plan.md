# Commandments category: plan (draft, 2026-10-17)

Owner request: add a **Commandments** category to the Marked page. It shows commandments grouped by **theme**, with a short summary under each commandment. Owner chose theme grouping over moral/civil/ritual grouping.

Owner ruling 2026-10-17: the **first version includes New Testament commands** as well as Old Testament ones.

Status: plan only. Nothing is integrated. Claude drafts the content; Codex owns the data, app code, build and tests (see `research/notes/claude-integration-workflow.md`).

## What the page looks like

- Marked page, book filter set (e.g. Exodus 20), new pane **Commandments** with a count, between Violations and Questions.
- Inside the pane: a filter row (All, Moral, Civil, Ritual), then theme sub-groups. Each sub-group has a header with a count and its commandment cards.
- Each card: title, 1–2 sentence summary, reference chips (first chip is the primary reference), an optional note when the commandment is repeated elsewhere or has a translation issue. Expanding the card shows the usual Details and sources.
- Moral/civil/ritual is an optional type tag shown as a filter. It is not a structure and not a claim about which laws still bind.

## Themes (first pass)

Worship of God · Sabbath and rest · Family · Life and violence · Marriage and sexual conduct · Property and economics · Truth and justice · Food and purity · Festivals and sacrifice · Care for the poor and the stranger · Leaders and kings · Love of God and neighbor (NT).

Final list to be set when the first batch is drafted; keep it under about 14.

## Data (Codex)

New `mode: "commandments"` in `data/evidence.json`. Fields beyond the existing record shape:

- `theme` (one of the fixed list), `commandmentType` (optional: moral, civil, ritual)
- `summary` (what the card shows), `refs`, `placements` as for other categories
- optional `repeatedIn` (list of refs), optional `languageContext` for Hebrew or Greek wording notes
- `sources` and `checked` as for other records

Add the fields to `schemas/` and check them in a new `scripts/check-commandments.mjs`.

## App code (Codex)

- `src/marked.js`: add `['commandments','Commandments']` to `MARKED_CATEGORIES`; inside the pane group matches by `theme`; add theme and type filters to the filter dialog.
- `src/reader.js`: add the category to `filterCategory`, `categoryRank`, `comparisonTone`, `CATEGORY_ICON_NAMES` and `visibleComparison`, plus an icon path.
- `src/style.css`: new tone, nested sub-group headers, filter chips.
- `worker/index.mjs`: no change expected; `/api/marked-comparisons` already returns every visible record for the book.
- Extend `scripts/check-marked-workspace.mjs`.

## Content (Claude, in this folder)

- Draft in the normal batch format: `{book}-commandments-records.json` plus notes.
- Policy to settle with the owner before drafting: commandment = an explicit command in the text, not an inferred principle.
- Repeated commandments (Exodus 20 and Deuteronomy 5, for example) are one record with `repeatedIn`, not two.
- A commandment appears on the Marked page only for the books the user filters; no whole-Bible index in the first version.
- NT commands are in scope: the great commandment and love of neighbor, baptism, the Lord's Supper, forgiveness, prayer, giving, and the commands in the epistles (marriage, church order, conduct). Same rule: an explicit command in the text. Sermon and epistle exhortations count only when phrased as a command; descriptions of what someone did do not.
- Themes are shared across both testaments, so one theme (for example Marriage and sexual conduct) can hold OT and NT cards. Each card shows a small OT or NT label from its primary reference.
- Add themes the NT needs and the OT list lacks: Baptism and the Lord's Supper, Prayer and fasting, Church life and order. Merge them into the final list of about 14.
- NT records use Greek NT wording notes in `languageContext`, and may link to the OT command they quote or restate (`repeatedIn`).
- Whether a command still binds is not decided here. The page lists what the text commands; it does not rule on application.
- Order: pilot with Exodus 20–23, Deuteronomy 5–6 and Matthew 5–7 plus Matthew 22:34–40, then check the layout before drafting more.

## Owner decisions (2026-10-17)

1. **Plain reference category.** Commandment records carry no T, V or Q tags. A tag would route the record to that tag's pane (`filterCategory`) instead of Commandments, and the tags are findings with strict tests, which a commandment is not.
2. **Ten Commandments pinned** at the top of their themes, with a small "Ten Commandments" label.
3. **Words of Jesus label** on Jesus' own commands, using the red-letter data in `src/red-letters.js`.

4. **Related-record links: yes, but phase two.** A `relatedRecords` field lets a commandment card link to an existing V or T record (for example the Sabbath card linking to Numbers 15:32–36). Left out of the first version so the pilot stays small; add it once the Commandments pane works. The schema should reserve the field now so nothing needs reworking later.

## Open

None.
