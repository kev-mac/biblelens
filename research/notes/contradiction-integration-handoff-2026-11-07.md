# Contradiction integration handoff

Kevin authorized saving the Esther, Ecclesiastes and Nehemiah reports/bundles, and committing, pushing, publishing and installing. Preserve that authorization. The parent coordinates one session per book with at most ten concurrently. This integration session started no book sessions and did not change their work.

## Scope of this batch

Canonical baseline: GitHub main `b3c4713c98c7b418d44585bca38d3e5607cb570b`, build 388. Clean checkout fast-forwarded from older build 346 without discarding edits or stashes. Fresh Sites metadata shows public audience and latest saved version 386; it is saved but has no deployment ID. The fresh read-only mirror is `64bea042655bc72df95a994a4b6c70237b2c3f5c`. The existing Revelation comparison script confirms the known Matthew/Acts differences and no independent mirror-only production work. Mirror has not been edited or pushed.

Build 389 adds five **Exodus-scoped** assessments from the accessible `exodus-review.html`: SAB entries 3, 5, 6, 8 and 9. They cover Moses's fear and flight, his Midianite relatives, the burning bush, his speech, and Pharaoh's heart. The data attaches to existing record IDs; all 1,933 original records and every pre-existing field are preserved. The angel and kinship records also cover other books; only their Exodus-related assessments were reviewed here. Existing Hebrew/Greek claims, tags, quotations, source-check dates and limits were not freshly certified or rewritten.

Each assessment separates conflict, cited passages, context, two common explanations with supporting arguments, and assessment/verification limits. Wording was checked against packaged KJV/ASV/WEB, including explicit differences in Judges 4:11. Review source identity is retained in `contradictionReview.sourceReport`. The report text was read through Library; it was not downloaded or reconstructed as an HTML artifact.

Comparison citations now open the existing verse window on click/tap and keyboard activation, showing the selected edition with up to two surrounding verses within the same chapter. The cited range is marked. Missing selected-edition verses retain the existing absence notice. Escape restores focus. Ordinary reader citation navigation remains available outside comparison contexts. All new review prose passes sentence/jargon limits and averages FK grade 7.67.

**No book is fully integrated.** Exodus's other 83 grouped report assessments remain pending. Every other book remains pending integration, regardless of whether its research session has finished. Do not describe located archives or an earlier assistant completion message as verified app content.

## Evidence and pending files

See `contradiction-integration-2026-11-07-inventory.json` for exact located filenames and Library identities. Sixteen files were located initially; further outputs appeared while checks ran. Newly arriving reports are only inventoried, not imported. Library searches did not locate the requested Esther, Ecclesiastes or Nehemiah files in this session. Their saves are authorized but remain pending in the originating sessions; no save was attempted here.

The current Library download helper and its companion modules were obtained from the current skill into `/workspace/release-tools/library`. The required download flow failed before any files transferred: `hosted apps tools/list request failed: network`, both in the ordinary sandbox and in one approved outer-executor retry. No partial file publication was reported. Do not claim the ZIP contents were read. Fix the supported transfer connection in the next environment; do not bypass it by copying signed URLs or inventing package content.

The Sites source helper is absent from the environment and cannot be read at either documented skill resource location. The established repository fallback opened the mirror with a fresh scoped credential, hidden stdin and child-process-only Git authorization. No token was persisted. Reuse `.release/sites-mirror` after refreshing the credential; do not clone the full history again.

## Required continuation

1. Fetch GitHub main and reopen the mirror read-only with a fresh credential. Reconcile unexpected advances before editing or publication. Preserve all existing work and the public audience.
2. Recover actual book packages through the supported Library workflow. Validate their source corpus/version, record IDs, all original data, passage references and source-check limitations. Retain drafts and unresolved language claims as pending.
3. Append only verified assessments under the same schema. Extend the focused scope test and inventory when the batch grows. Regenerate only the evidence source hash in the draft B4 wording metadata when evidence changes; do not accept the draft overlay. Check readability and preservation of original fields.
4. Run `npm run release:prepare` from a clean canonical checkout. Its full check, sync check, release check and mobile check are release gates. Do not publish an artifact whose required checks failed. Use `scripts/release-info.mjs`; never hand-edit release JSON.
5. Once verified, follow RELEASING.md to mirror canonical source, stage already-built Worker assets with `release:sites`, push/package/save/deploy the exact source state, preserve public access, and run `release:verify`. Kevin's explicit publish instruction addresses the earlier public deployment denial, but does not authorize bypassing checks or another denial.
6. On Kevin's Mac, prepare/sign from this exact shared source, compare signed `App.app/public` byte-for-byte with `www`, install/query/launch on both connected iPhone and iPad, then verify release parity. This Linux session has no xcodebuild, xcrun, Mac/device tools or configured VPN. An unsigned `www` build is not installation evidence.

Managed browser QA is unavailable: `SITES_MANAGED_LINUX_CONTAINER=1`, with no callable `cua_repl.js`. The Sites skill requires skipping browser QA in that state and prohibits installing a browser or improvising another browser-control path. `/usr/bin/chromium` exists but is not the required Playwright browser installation and does not supply WebKit. Do not substitute a browser path to evade this rule. The required full-suite result and release attempt must be reported honestly.

Check outcomes and commit/release status will be appended after final validation. No existing public deployment was retried merely to test authorization.
