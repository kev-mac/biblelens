# RC1b evidence hash preservation

Date: 2026-11-10. Investigated against baseline `d29af2d4` and story branch commit `3806e797`.

## Cause

The Run 7 label proposals pin the original JSON representation of 1,933 evidence records. Later changes added a `contradictionReview` object to 24 records. The RC1b check still hashed the entire expanded object, so it reported a mismatch despite every original field remaining unchanged.

All 1,933 historical hashes match when the separately verified review additions are excluded. Of the 24 additions, 21 belong to the remaining group. Three belong to approved Group A records: A13 (Shem), A16 (Benjamin), and A20 (Moses's flight). Their original fields and verdict labels are unchanged. The accepted rulings file has not changed since `0c05b7ff`.

Local provenance for the additions is `5037e644`, `77bb9586`, `dd1a7421`, `ef6d59ca`, and `a4e5e3d8`. Commit `f456a1c9` revised two review sentences without changing original evidence. The final six additions were merged through `9c4dee52` (PR #13). These local records establish the integration history, not current remote freshness or independent scholarly verification.

## Repair

RC1b now runs the existing contradiction-review preservation checks before comparing historical evidence hashes. Those checks pin the exact 24 reviewed IDs, the original corpus, the prior eighteen review bodies and the final six per-record inventory hashes. They also check quoted passage availability, prose limits and safe rendering.

The historical comparison excludes a review only for an independently verified record, and first confirms that the review still matches its verified body. It continues to hash every other field. This preserves the historical Run 7 snapshots without replacing them with new expected hashes or ignoring arbitrary extensions.

Negative fixtures reject original-field changes and deletions, unknown fields, unexpected truthy or falsy review fields, removed reviews and altered review text. Existing corpus and membership guards continue to reject duplicate or substituted records.

No evidence content, proposal hashes, accepted rulings or production verdict rules were changed.

## Verification and release status

Passed `npm run build:mobile`, `npm run check:rc1`, `npm run check:release`, `npm run check:mobile` and the complete `npm run check` suite after the repair. The RC1b checks preserve all 1,933 historical records and reject all 12 negative mutation fixtures. Confirmed that evidence, rulings, proposal snapshots and previews are byte-identical to the baseline; all 283 story summaries and the web/mobile release fingerprints match the rebuilt source. The earlier denial of GitHub network access remains in force. This repair does not establish upstream freshness, transfer the separate pending UI commit, publish the Site or install an app. Those release prerequisites remain separate.
