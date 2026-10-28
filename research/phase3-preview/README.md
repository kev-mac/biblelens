# Phase 3 Draft Preview

All content here remains a draft. No accepted record is changed.

The UI uses two pinned local draft sources:

- Verdict ledger: `2a131a71c937e0a87d0c0dfc67c2b5bfabfdaaf6`.
- Headline debates: `510b868e82a7c348b1a3336a285fb32401871599`.

The original research directories are copied from those commits without edits.
`presentation.json` selects exact summary sentences for each side’s strongest case.
These selections are presentation proposals, not new findings or a ranking of truth.
The full draft summary and original record limits stay accessible under **Go deeper**.
The two cases do not imply equal support or mutually exclusive claims.

Neither source supplies an evidence-tier rubric or approved tiers.
The UI therefore shows **Evidence tier: Not assigned**.
Kevin must approve a rubric and assignments before those labels can change.
All verdicts remain visibly proposed, including those that match a current status.
Records that need an owner ruling retain that flag.

Current source links include the verified B1 link repairs.
The build checks that source modes, statuses, scopes, and checked dates still match the draft provenance.
KJV quotations are extracted from the same packaged chapters used by the app.
No outside source was fetched, and no image was generated or downloaded.
The evidence area contains no imagined artwork.

## Local Preview

Build both outputs from the same source and switch:

```sh
BIBLELENS_DRAFTS=1 npm run build
BIBLELENS_DRAFTS=1 npm run build:mobile
```

Open `#debates?draft=1`, or select **Preview draft debates** in Explore or Debates.
The default set contains the 30 recommended headlines.
The draft-set control also opens all 40, the ten reserves, or session saves.
Both sides, proposed verdicts, sources, and private choices appear on each detail page.
Choices and saves stay in memory and clear on reload. They never enter cloud sync.

Normal builds exclude the draft data, UI styles, and preview link.
URL or storage flags cannot enable drafts in a normal build.
The build rejects draft mode when `NODE_ENV=production`.
This local preview is not a release or an acceptance decision.

## Checks

- `node scripts/check-draft-debates.mjs` checks source joins, quotes, exact excerpts, the build gate, and escaped card data.
- After normal web/mobile builds, add `--production` to check generated assets for draft leakage.
- After draft web/mobile builds, run `node scripts/check-draft-debates-browser.mjs` against the local preview server.
- Browser captures and results go to `.review/b1/`.

The 190 selected case sentences average FK grade 7.03.
No selected sentence exceeds 20 words or contains unexplained screened jargon.
Source titles and exact research wording stay intact.
