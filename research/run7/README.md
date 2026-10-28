# Run 7 local proposals

These drafts cover all 1,933 ledger records: 66 Group A rows and 1,867 remaining proposals.
Accepted content, the archival ledger, app labels, and build number remain unchanged.
No tier is assigned to a record or added to the app.

`evidence-tier-rubric.md` proposes four tiers for A00e. Its examples use existing record claims and limits.
They add no research findings and do not settle the held comparisons.

`label-proposals.json` is the complete Run 7 overlay. All rows remain unaccepted drafts.
It compares the ledger before B6's label-only commit with the current ledger.
Both inputs are checked by the generator. The historical commit is pinned in the output.
Each row retains the source scope, prior reason, source notes, and owner-review flag.
The full source record has a hash. The top-level hashes pin the review inputs.
No label is inferred from a record's status in this run.

The approved labels are used for 1,914 draft proposals. The other 19 rows have no proposed label.
`meaning-checks.md` lists those rows, with each old label and the prior B6 wording for reference.
They retain explicit Group A holds, field conflicts, and unresolved history identities.
A resolved status mismatch alone does not create a new hold.
Its prior scope-limited proposal and owner flag remain intact.
The separate Romans/James–Rahab wording hold remains in `research/b6/meaning-checks.md`.
That wording hold does not prevent retaining its open-interpretation label.

`meaning-changes.md` lists 129 mapped rows whose labels change meaning or emphasis.
This conservative log includes narrower claims and positive descriptions replacing exclusions.
It gives every old label, new label, and reason. It makes no change to the underlying finding.
The other mapped labels keep the prior meaning when read with the source limits.
In particular, both reconciliation labels describe a possible reading, not established history.
Both open labels leave a reading unresolved. Both detail labels retain the stated comparison limits.
Not settled is unchanged. All ambiguous rows are excluded from the meaning-change count.

Regenerate with `node research/run7/remap.mjs --write`.
Verify with `node research/run7/remap.mjs`.
The verifier checks exact coverage, source pins, mode labels, draft state, holds, and both tables.
It checks that build number 275 remains unchanged and that no row has a tier.
The rubric and authored review prose also receive the current two-tier readability check.
Copied IDs, labels, source excerpts, and source reasons remain audit data, not rewritten card copy.

This work is local to `codex/b6`. It makes no claim about Sites, signed iOS assets, or a synchronized release.
