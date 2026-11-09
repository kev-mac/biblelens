# Bounded contradiction integration — proposed build 401

Baseline is merged build 400, `b5e89a902202edfc723fa6a46fe01e4374f9039c`. Work stays on `codex/contradiction-batch-401`; build 400 publication/device work remains separate. No new book research session was started. The zLenz branding, reader/Evidence fixes, UI/Worker/native source, Bible texts, original record fields and all eighteen accepted review objects are preserved.

## Source recovery and reconciliation

The current Library workflow materialized both existing sources into this executor, preserving their exact Library identities and version 0 metadata. Readable Exodus HTML is 1,081,196 bytes, SHA-256 `c1969a023fa99b56c4569de7d3dc478277c6706efd097f1fa2c5d71e78bd051d`. Readable Genesis ZIP is 2,291,824 bytes, SHA-256 `c090f1bdf520a21ad7e510aa0b0062e9643740539da55696d4f1f6e2e2e20cf1`. These match the prior integration inventories. No new Library item or replacement was created.

All 39 Genesis inner checksums and 38 manifest entries match. All 109 source-review hashes and 42 mapped record hashes match their prior declarations. The source snapshot's 1,933 record bodies equal current records after excluding only accepted `contradictionReview` additions. Programmatic text comparison verifies the Genesis packet's 172 KJV chapters/5,502 verses and Exodus report's 168 chapters/5,238 verses against the package. These checks establish byte/text identity and mapping, not research truth or the complete producing environment. No script supplied by either source report was executed.

Exodus's complete HTML digest matches exactly. All 88 source article IDs remain present. Prior per-article text hashes are retained without a claim that their undocumented text serialization was re-created. Raw article-element hashes, with an explicit HTML-byte meaning, accompany the three new Exodus mappings. This distinction does not imply a different source file.

## Six additions to existing IDs

| Source book/review | Existing app ID | Bounded question |
| --- | --- | --- |
| Exodus `exodus-19` | `exodus-livestock-scope` | Livestock after the plague's statement about all livestock |
| Exodus `exodus-24` | `exodus-passover-membership` | Foreign exclusion and conditional Passover admission |
| Exodus `exodus-49` | `exodus-commanded-cherubim` | Image prohibition and commanded figures |
| Genesis `death-warning` | `in-the-day-thou-eatest-thou-shalt-surely-die-adam-lived-930-years` | Same-day death warning and Adam's later death |
| Genesis `prelaw-judgment` | `the-earth-is-filled-with-violence-through-them-or-sin-is-not-imputed-when-there-is-no-law-genesis-6-13-romans-5-13` | Judgment before Moses and Romans on law |
| Genesis `benjamin-birthplace` | `benjamin-born-near-ephrath-or-in-padanaram` | The birth scene and family-summary location |

Each assessment includes conflict, cited verses, speaker/story context, competing readings with supporting arguments, assessment and explicit verification limits. All 68 newly cited verse instances were read in the packaged KJV, ASV and WEB (204 edition/verse instances). Surrounding context was read for 124 verse rows in all three editions. Genesis 3:22–24 supports the already-reported separation reading; Genesis 35:6–9 supplies the return/location context. Those additions are recorded explicitly. No named commentary attribution, ancient-language assertion, composition theory or event as history is newly certified. Original source material and original record fields remain intact.

The fifty new prose fields average FK 7.08 with no checked sentence-length or jargon violations. The death-warning assessment retains the strong same-day bodily-death tension; its alternative readings are identified as interpretations. The Passover assessment keeps the separate rules about enslaved people and hired workers and does not turn meal participation into general legal equality. The image assessment retains the exception problem under a universal making ban. No original status or classification is changed.

## Counts and retained gaps

On this proposed branch, Exodus has 16/88 bounded groups with 72 deferred (34 mapped groups and 38 without a listed match). Genesis has 8/109 bounded groups with 101 deferred (29 mapped groups and 72 drafts without app IDs); 34 mapped existing Genesis IDs still await integration. These counts describe the branch, not a published build or a completed book. Main/build 400 retains 13 Exodus and five Genesis objects until this branch is accepted.

All 88 Exodus and 109 Genesis source identities remain in `contradiction-integration-batch-401.json`. Five shared app IDs remain untouched and deferred in both inventories: divine name, family total, testing/tempting, and the two seeing-God records. This avoids duplicate integration. Genesis's six edition-source audits, eight other-book reviews and broader topic claims remain unresolved. Romans 5:12's `adam-and-eve` review remains an unmapped draft; the distinct mapped Romans 5:13 comparison does not complete it. No book is fully integrated and no IDs were invented.

B4 changes only its evidence-source hash. Its proposal collections are unchanged and `ownerAccepted` remains false. Production data is not replaced by the draft overlay.

## Checks and release boundary

Local schema/preservation/range/escaping/link checks pass for all twenty-four review objects, 349 cited verse instances in each edition and the immutable original data. The shared build, mobile engine, exact branding and actual web/offline review parity passed before the final short wording refinement; final committed artifacts must be rebuilt and checked in CI. The current direct draft-generation/production guard and neutral-framing audit pass. RC1 accepted-import/original-quotation checks pass. Full-corpus readability is report-only with inherited findings.

Two optional historical checks remain explicitly separate. The archived `check-b4.mjs` requires missing `codex/b3` and hardcodes build 276; it was not modified to fit current source. Direct current draft/preservation checks pass instead. Legacy RC1b whole-record pins mismatch on twenty-four review additions: eighteen already on main plus these six. Every original object matches its historical pin after removing only the review field. No research pins were changed to hide the failure.

Required exact-source release preparation, actual twenty-four-review bundle parity and a focused real-browser context matrix are pending CI. The matrix retains the existing thirteen fixtures and adds all six new records (228 engine/width/edition cases). Real screenshot inspection and signed-device verification are separate from module/text checks. No local browser sandbox or network restriction is bypassed. This task does not publish, merge, mark a draft ready, operate the Mac or install on devices. Build 400 installation remains parent-owned and separately pending.
