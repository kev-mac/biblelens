# B6 local drafts

These proposals are unpublished and remain unaccepted. Accepted corpus files are unchanged.
The merge of main is `964d0f8`; package build 275 is preserved by the B6 follow-up.
No release, install, deployment, push, main merge, branch deletion, or stash change is authorized.

Kevin chose two readability tiers: strict visible cards and longer disclosed notes.
`scripts/check-readability.mjs` screens both, with strict failure for either tier.
`evidence.json` retains original fields, stable IDs, source lists, and explicit proposed wording.
Only fields failing their original tier receive proposals. Passing fields stay verbatim.
Full edition names stay in Sources. Unquoted edition terminology is simplified or explained.
Existing B1 proposals may be reused when their protected quote and digit tokens match.
This is an editorial proposal workflow; token preservation does not establish equivalence of meaning.
`evidence-field-proposals.json` gives every exact field pair and review reminder.
`outstanding-evidence.json` keeps remaining sentence and jargon work visible.
`meaning-checks.md` retains the Romans/James–Rahab scope hold without rewriting it.
Strict readability still fails; these drafts are not ready for integration.

`comparison-readings.json` covers all 1,693 pending comparison IDs.
Each has two slots with its original source list and scope.
Sourced excerpts are copied exactly from short source-field sentences.
They remain excerpts awaiting individual meaning and source review, not verified tradition attributions.
A scope sentence qualifies only when it explicitly names an alternative or a possible way readings fit.
Other slots say `needs research`. This does not assert that no supporting source could exist.
A source list alone cannot establish that it supports an unstated interpretation.
No external source was fetched and no new finding or tradition was invented.
The full scope remains beside the reading slots in the local preview.

The 21 Teachings & Laws units are drafts with form labels, passage links, and disclosed Context and Sources.
F20 gives no number or new quotation; its supplied forgiveness wording remains held.
The collection is built only in an explicit draft preview.
The Jesus profile is an unpublished, text-attributed draft based on packaged Gospel and Acts passages.
Stories retain their narrative scope and no Exile/Return era is added.

`style-proposals.json` overlays sentence-case titles and the two spot-check corrections.
It changes no researcher files. The title checker uses an explicit proper-noun allowlist and corpus person names.
The Mark title is “Calling the disciples and healings”; no location covers the whole sequence.

Archival verifiers retain their original editorial standards and exact source excerpts.
The headline and ledger source hashes now pin the current accepted evidence.
The plain-language archive checks current source hashes separately from its historical original/draft pairs.
It does not pretend that the retired eight-card Explore snapshot is the current layout.
B2/B4 verifiers separately permit the owner-authorized main release/security source and the new label decision.
Other protected corpus, quotation, digit, and draft-status assertions remain.

Reproduce with `node scripts/prepare-b6-drafts.mjs` and `node scripts/check-b6.mjs`.
Run `node scripts/check-draft-titles.mjs` and both strict readability modes.
Use `BIBLELENS_DRAFTS=1 npm run build:mobile` for the local `www/` preview.
Never publish that preview.
