# Scripture Lens

A debate tool comparing the KJV with the Hebrew (OT) and Greek (NT). Two tools share this repo:
- Claude: researcher. Writes only in research/claude-drafts/. Never edits data/evidence.json, src/, scripts/, research/notes/, or git history.
- Codex: integrator. Verifies quotes, edits app files and data, builds, tests, publishes.

Before any research work, read research/claude-drafts/README.md (standing rules, owner rulings, session plan) and research/notes/claude-integration-workflow.md (Codex's contract).

Research runs automatically from the scheduled task "scripture-lens-next-book" (every 30 minutes, one unit per run, at most two an hour). Do not edit that task or the control files session-clock.txt, running.lock, ALL-DONE.txt in research/claude-drafts/ unless the owner asks.

## Status check (read-only; change nothing)
When asked for status, report briefly:
1. The scheduled task: enabled, next run, last five runs (use the scheduled-tasks tools).
2. Research progress: ticked and next units in the README "Session plan", the T catch-up status, session-clock.txt and running.lock times, any HOLD.txt or ALL-DONE.txt.
3. Codex progress: newest research/notes/claude-ready-*.md and ui-refresh-*.md, the last five git commits, held records and "Needs owner" items, any batch in research/claude-drafts/ with no Codex decisions file.
4. T migration: whether data/evidence.json still has H or G tags; how many records carry witness.
5. New entries in research/claude-drafts/owner-questions.md.
6. Stuck signs: runs with no output, Codex far behind, errors.
End with the percentage of 1,189 chapters researched and published and a one-line verdict: on track, slow, or stuck.

## Shared app source and releases
GitHub main is the canonical development source; Sites is a deployment mirror. Read RELEASING.md and AGENTS.md before build/sync work. Both app versions expose the same source fingerprint in Settings. Cloud sync is optional and preserves local/offline edits. Do not assume a GitHub pull includes independent newer Sites edits.
