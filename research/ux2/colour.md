# UX2 colour provenance

Source: `5cf2cda1a49baaee334b104ec90949c4d9457239`, Phase 2, build **273**.
Its indigo palette matches `~/git/mockups/biblelens-redesign/index.html`, including
light `#4056cf` and dark `#a6b3ff`, with violet, rose, green and amber topic colours.
`docs/phase2-structure.md` documents the Phase 2 foundation; `src/STYLES.md`
documents the shared web/native cascade. The older design-system extraction
branch and `research/notes/default-theme-contrast-2026-10-13.md` describe the
prior muted blue defaults, rather than this newer palette.

Compared local `origin/main` **853c116 (build 275)**, `55e438a` (Phase 1,
build 273), all local/remote branch refs and every registered worktree's CSS
(read only). The complete signatures are in
`~/git/codex-reports/UX2-logs/palette-history.log`.
`git log --all -S '#4056cf' -- '*.css'` identifies the Phase 2 introduction;
`git log --all -S '#fbf9f3' -- '*.css'` identifies the older warm tokens and
UX1's later restoration. No other worktree or its git state was changed.

The reversion is **97b56e176444bac2831fa5112e28bb90b5ff78c8**, build **276**:
its UX1 rules append unlayered warm Study Atlas tokens after the Phase 2 rules.
The unlayered rules beat the layered Phase 2 palette. **216f08a**, build 277,
inherits that cascade. This was a normal UX1 commit, not a merge commit;
there is no evidence that a later merge on canonical main caused this reversion.
Phase 1 `55e438a` itself still uses the warm Study Atlas palette.
No fetch, live service mutation or Sites write was performed in this local task;
the requested canonical comparison is the pinned build-275 source, not a claim
that the current website or deployment mirror was inspected or synchronized.

## Active token changes

| Token | Light before → after | Dark before → after |
| --- | --- | --- |
| --lens-paper | #fbf9f3 → #f6f7fb | #14232b → #121520 |
| --lens-surface | #fffdf8 → #ffffff | #1a2d36 → #1b1f2c |
| --lens-ink | #142e39 → #1c2235 | #f4f0e5 → #f0f1f8 |
| --lens-muted | #58696c → #62697d | #b6c2bf → #a3abc1 |
| --lens-rule | #d8d6cb → #e7e9f1 | #3e5057 → #303648 |
| --lens-copper, --lens-link, --lens-focus | #9a4629 → #4056cf | #edb28d → #a6b3ff |
| --lens-copper-soft | #f3e5d9 → #edf0ff | #40342e → #292f51 |
| --lens-link-soft | #e7eeed → #edf0ff | #253f49 → #292f51 |

The shared legacy aliases --bg, --panel, --ink, --muted, --green, --soft,
--line and --brand-accent now follow the active app tokens, including dialogs.
Explicit app-wide font choices and Inter defaults are preserved.

## Stable topic colours

| Topic | Light | Dark |
| --- | --- | --- |
| Stories / Translations | #7452c6 | #c5abff |
| People / Questions | #a83d64 | #ffacce |
| Timeline | #136c86 | #8fd5ed |
| Places / Science | #237360 | #9adfc8 |
| Commandments / History | #966020 | #e9c18a |
| Evidence / Text Comparisons | #4056cf | #a6b3ff |

Timeline adds a blue-green pair to keep the six Evidence topics distinct.
These semantic families use tile borders, page/header accents, chips and
breadcrumbs. Topic identity also uses text; colour is not the only signal.
`node scripts/check-ux2-colour.mjs` checks 96 text, focus and topic/background
pairs at 4.5:1, including selected-chip fills. All pass, exceeding the 3:1
large-text/icon threshold. Values are saved in `contrast.json`. Artwork labels
and tile copy use solid dark backing so contrast does not depend on the image.
Existing highlight swatches and evidence-status semantics retain their meanings.
