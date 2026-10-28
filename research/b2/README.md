# B2 Local Content Review

Every item is **draft / needs review**. Kevin has accepted none of this batch.
The scholarly `record.status` describes a claim; it does not mean editorial acceptance.
The outer `reviewStatus` and `ownerAccepted: false` control the review state.

Accepted application data is unchanged from `codex/b1`.
The archived researcher inputs under `research/claude-drafts/` remain research proposals, including their scholarly status fields.
They were restored from pinned commits, not adopted as accepted data.
Scheduled research controls and other worktrees were left alone.

| Collection | Draft proposals | Origin |
| --- | ---: | --- |
| Evidence | 103 | 45 fixed translation proposals, four linked History records, 50 gaps, four narrow Context records |
| People | 138 | All ten fixed Tier 1 batches |
| Timeline | 48 | Four fixed events, 40 gaps, four narrow Context events |
| Stories | 40 | Gap drafts; category placement still needs review |
| Prophecies | 25 | Gap drafts; no claim of independent confirmation |
| Meaning checks | 59 | 43 Stories, 13 People, three earlier Explore cards |
| Total | 413 | Independent proposals; never replacements for accepted content |

The 188 fixed inputs map to 187 proposals because two Song oath inputs were combined.
Four complete History records support the fixed academic events. They are counted separately above.
The seven remediation batches are included in the 45 translation proposals, not counted twice.
One fixed proposal extends an accepted Evidence ID. Its outer operation says `proposed revision` and pins the accepted digest.
It remains a separate draft. No accepted record was edited to apply it.

The 21 requested story holds remain, along with the older Exodus hold.
Each range and its exact gate appears in [held-stories.md](held-stories.md).
The current narrative-only scope excludes instructions, lists, and teaching without a separate story plot.
Ezekiel's commanded acts must not be described as completed acts.
Matthew's forgiveness draft also needs its KJV number corrected if the category scope later changes.

The 13 research returns were examined under the owner's explicit B2 research instruction.
Eight findings are proposed for withdrawal; Esther 7:4 still needs contextual verb review.
Four academic cards now have narrower Context drafts with checked primary sources and exact packaged KJV.
Their broader chronology, geography, identity and agency claims remain held.
The original returned objects are unchanged, preserving their review history.
See [research-returns.md](research-returns.md) and [source request hashes](research-sources.json).

All 138 supplied profiles retain sources, explicit reference bindings and family-link limits.
They pass the existing character validator with the 47 accepted profiles.
The 185-profile set does not establish complete coverage against the planning target of about 250.
Jesus inclusion/framing and the Exile/Return era remain owner choices.

[meaning-checks.md](meaning-checks.md) shows every flagged original beside its draft and meaning limit.
The 56 People/Stories targets still match current summaries.
Three earlier Explore cards belong to a retired layout and remain held for retargeting.
They do not restore the deferred Prophecies or Method & Sources gallery cards.

[shot-list.md](shot-list.md) covers 95 current slots and 235 planned slots.
Every entry includes subject, evidence/illustration class, crop, alt text and a rights source or generation plan.
No image was generated or downloaded. Source metadata is a candidate, not rights clearance.
All 25 earlier image-fit holds remain. Source photographs provide only their stated context.
Illustrations carry the label Illustration and cannot serve as historical evidence or real portraits.

## Local Preview

The default build omits the review page, JSON and draft-debate payloads.
Only explicit local `BIBLELENS_DRAFTS=1` builds include them; production mode rejects that flag.
Build both outputs with the same switch, then open `/draft-review.html` or the Explore review link.
Preview server restart belongs to the external job.
The review page offers no acceptance action and never reads or writes personal notes or sync state.
Its renderer uses DOM text nodes and allows only HTTPS source links without embedded credentials.
It uses Inter throughout and supports both phone sizes, dark mode and reduced motion.

Regenerate the review pack with:

```sh
node scripts/b2-catalog.mjs --write
node scripts/b2-shot-list.mjs
node scripts/check-b2.mjs
```

Checks also use the pinned fix verifier and gap validators.
The old plain-language verifier assumes the pre-Phase-2 source tree and cannot be run unchanged here.
The B2 verifier instead checks the 59 applied pairs, exact originals, numbers, sentence limits and the current source boundary.
The B1 verifier separately checks all 276 Story and 47 People original/draft pairs against current accepted summaries.

The standard readability command remains report-only and reports accepted-content debt.
B1 Evidence still has 1,734 held records with unfinished sentence or jargon work.
Its exact queue is [outstanding-evidence.md](../../docs/b1-readability/outstanding-evidence.md).
That unfinished editorial task is not waived by the passing collection average or by this batch.

No push, PR, merge to main, Sites publication, release command, build-number change or native install is authorized.
No current live or signed iOS alignment is claimed.
