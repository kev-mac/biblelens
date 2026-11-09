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

Final exact-source CI passed: run `42567628377`, job `128997533010`, CI commit `30008ba82bb54746b638fc14440b5a950881e3d0`. The product code is `a4e5e3d8334c395de8cfe826fbd95524a0f1097f`; both identify build 401, fingerprint `80ea78e29c620b0e1aeb3cfefc215fdc8729234ff7cd87032184865f44be361a`. Full required `release:prepare` passed, including Chromium/WebKit release smoke, sync, release, mobile and shared builds. All twenty-four review objects passed actual web/offline Worker parity with zero external requests. Current B4 preservation/production guards, exact zLenz metadata and artwork parity also passed.

The matrix retains the existing thirteen fixtures and adds all six new records: nineteen records × Chromium/WebKit × 390/1157px × KJV/ASV/WEB = 228 passing cases, at 1184px height. It checks actual edition text, full selected ranges, two surrounding verses within chapter bounds, touch/mouse/keyboard activation, horizontal margins, Escape/focus return and page errors. Screenshots were generated on the runner. The original five Exodus fixtures are unchanged and outside this focused browser matrix; all twenty-four objects remain covered by schema/preservation and actual web/offline parity checks. No claim is made that screenshots were visually inspected here or that signed native assets were verified.

The first run, `42567017102` at CI commit `587df91722ffc5cfcac69f234aca8a8796589ea9`, passed release preparation and all 228 cases but failed the new CI wrapper's B4 comparison. Node's default `execFileSync` buffer could not hold the 1,245,696-byte retained draft and raised `ENOBUFS`. The only correction was a 16 MiB buffer for that comparison. Every equality, source pin, owner-acceptance check and sandbox requirement remains intact. That failed run produced no candidate bundle; its results artifact `13652331882` is retained separately. The second run passed every step and packaged the candidate.

## Exact artifact and review handoff

Product [PR #13](https://github.com/kev-mac/biblelens/pull/13) and CI-only [PR #14](https://github.com/kev-mac/biblelens/pull/14) remain drafts. The [successful run](https://github.com/kev-mac/biblelens/actions/runs/42567628377) retained:

| Artifact | ID | Bytes | GitHub-reported ZIP SHA-256 |
| --- | --- | ---: | --- |
| `build-401-verified-bundles-42567628377-1` | `13652721367` | 452,944,802 | `55d5b36e905cdd65b36934f7c96ba7943d5221d0e0bd78c82bcb221767731e8d` |
| `build-401-contradiction-results-42567628377-1` | `13652338128` | 34,390,538 | `4b443d8f41116defad57315616b5922cb6f8d452c719869f4bbab0c9cd9e696a` |

Artifacts expire November 16, 2026, about 05:42 UTC. The bundle ZIP contains source identity, `prepared-manifest.json`, inner `prepared-bundles.tar.gz` and its checksum. The results ZIP contains actual context screenshots, `matrix.json`, check logs and source inventories. The packaging step asserted candidate/source/web/offline identity, twenty-four reviews and 228 cases. The manifest records the actual Worker byte count/hash and explicitly says signed native assets were not verified. Those inner bytes/hashes have not been independently downloaded and checked here.

The native GitHub artifact broker returned both final file references successfully, each on `sdmntpreastus2.oaiusercontent.com`. This executor's current observed/enforced restricted policy (spec and observed revision 1) permits only `sdmntprwestus2.oaiusercontent.com` and `sdmntprwestus3.oaiusercontent.com` among these download hosts. Therefore local artifact transfer was not attempted. There was no new HTTP failure or automatic-approval denial, and no allowlist, URL, sandbox or security setting was changed. The independently materialized research sources used their supported permitted Library route; that does not establish access to these output artifacts.

The parent should materialize these exact artifact IDs in a permitted environment, verify the ZIP digests and inner archive/Worker hashes against `prepared-manifest.json`, then inspect actual screenshots before acceptance. Use the exact tested bundles if subsequently authorized for release; this checkout's earlier ignored local `dist`/`www` outputs predate the final wording and are not the candidate. The full inventory retains its initial authoring validation snapshot; `contradiction-integration-validation-build-401.json` carries the final CI/transfer receipt. This post-check handoff changes documentation only and does not alter the tested production fingerprint.

This task did not publish, merge, mark a draft ready, operate the Mac or install on devices. No local browser sandbox or network restriction was bypassed. Main/build 400 and its parent-owned installation task remain separate. Continue the next integration only from an accepted checkpoint, reuse these existing sources and inventories, and keep unresolved mappings, shared cross-book groups and source/language audits pending.
