# People roles — ROLES1

The owner authorized this local KJV role-tagging task on 2026-10-29.
`data/reference/people.json` retains every imported identity and now has `roles: []`
on each person. Each tag has `role`, `ref`, `basis`, `phrase` and `status`.
The phrase is an exact, case-sensitive substring of the packaged KJV verse.
It records the text's title, including titles reported in speech; it does not
claim independent historical confirmation or endorse a speaker's claim.

`title` requires an explicit individual or collective title in context.
`list` covers the accession entries in Kings/Chronicles, named judges/deliverers
in Judges plus Eli and Samuel, and the Twelve plus Matthias. Paul has a direct
title from his own letter. Barnabas has an explicit title at Acts 14:14.
No priest role follows merely from Levite ancestry. Prophecy, book authorship
or a person's reputation alone does not create a prophet title.

Same-name matches use the existing IDs, supplied verse bindings, aliases and
family links. Titles after patronymics and possessives were reviewed in context;
unresolved attachment is omitted. Herod the Great, Antipas and Agrippa I use
separate records and passages. The two Joash kings use their kingdom titles.
Existing source fields, references, labels and relations are preserved.

All prophet and priest tags remain draft pending Claude's sample review.
The shared web/native builder validates source tags and strips drafts from both
the reference asset and answer-layer people in production. BIBLELENS_DRAFTS=1
includes them using the existing draft-preview gate. Source data remains complete.
The checks reject quote/ref/schema failures; they cannot replace identity review.
The role index is conservative and is not a claim of exhaustive corpus coverage.

The seeded review sample, omissions, browser captures and check results are in
~/git/codex-reports/ROLES1-final.md and ROLES1-logs/. No release was authorized.
