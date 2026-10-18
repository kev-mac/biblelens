# Prompt for Codex: content remediation integration

You are the integrator for Scripture Lens (/Users/kevin/git/BibleLens). Claude is the researcher and writes only in `research/claude-drafts/`. You verify, merge into app files and data, build, test and publish.

Read first: `AGENTS.md`, `RELEASING.md`, `research/notes/claude-integration-workflow.md`, `research/claude-drafts/README.md`, and `research/claude-drafts/content-remediation-plan.md` (owner answers are in section 5).

## Scope decided by the owner (2026-10-18)
- Stories: narrative only. Skip Psalms, Proverbs, Ecclesiastes, Song of Solomon, Lamentations; include only the narrative frame of mixed books (e.g. Job 1-2 and 32-42). Thematic entries may come in a later release.
- Characters: Tier 1 only (about 250 curated profiles, people who appear in published stories or have 50+ references). Tier 2 is a later release.
- Prophecies: out of scope for now.
- The chapter-review ledger is internal; do not show it in the app.

## What Claude delivers
- `{book}-stories.json`: `{ "book", "stories": [ {title, passage, summary, cross_references, topics} ] }` in the `data/stories.json` shape. `topics` is `[]`; please fill them with `scripts/story-topics.mjs` against `data/reference/topics.json` (max 5).
- Later: Tier 1 character profiles, thin-book evidence records, and academic comparison cards, each in its existing schema with a notes file.
- Exodus is the first batch: `exodus-stories.json` (19 stories). Genesis is already in `data/stories.json`.

## Your job per batch
1. Check every passage and cross-reference resolves (the same rule as `scripts/check-stories.mjs`), titles and slugs are unique, summaries are neutral and in our own words.
2. Merge into `data/stories.json` (one entry per book, books in canon order), tag topics, run `scripts/check-stories.mjs`, `scripts/check-characters.mjs` and the release checks.
3. Write a decisions file in `research/notes/` for each batch, as you do for evidence records.
4. Tell me which assumptions in the plan (sections B, C, E) do not match your validators or app, so the plan can be corrected before characters and academic cards are written. In particular: does `check-stories.mjs` currently assume only Genesis exists (it asserts `catalog[0]` is Genesis and that Exodus shows "No stories match")? That test will need updating once Exodus is added.

## Limits
Do not change Claude's draft files. Hold anything you doubt and record it under "Needs owner".
