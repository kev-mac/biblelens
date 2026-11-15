# Search maintenance release — build 432

**Current status: published successfully as Sites version 423.** Native signing
and installation are handed to the parent-managed Mac session; this Windows
session does not claim a physical-device installation or launch.

Prepared from the isolated general-search branch, integrating canonical main
`083d53ea43fb5a96eace644e60a94fe47e5b2e3f` and the implemented search checkpoint
`03ecf4fc9126f2fe645d619ada9c5830a6a27792`. Before integration, the refreshed Site
source `164de28ab6364be73da02bd989a730430cf73b31` matched all 3,461 shared runtime,
data, script, schema and configuration files on main. Both describe build 431,
fingerprint `79bbe306e6270a7af1b64d36ffcb8659c747a5ef68662a8ac5bf1660e6da2431`.
The existing 185 video records and their assets are retained unchanged.

The release includes direct offline lifespan retrieval from actual scripture,
uncertainty for insufficient evidence, stricter device quotation checks, related
passage labels, precise app range links, split-heading rendering and the staged
semantic retrieval/quotation protocol. The semantic and evaluation feature flags
remain absent from production environment revision 2. **The unverified new online
protocol is disabled.** The existing allowlisted online service continues its
legacy protocol. No account, key, allowance or billing settings are changed.

The implementation report and diagnostic results are in
`grounded-search-improvements.md`, `grounded-search-local-after.json` and
`grounded-search-50-query-after.json`. Earlier local tests found 24/24 direct
lifespan answers versus 1/24 leading correct answers in the retained production
artifact, with 11 uncertainty cases. The unchanged 50-query suite had 50/50
useful hits, 45/50 first-five hits and 114/160 original expected targets. Those
are bounded local results, not a measurement of broad live semantic recall.

Paid API testing remains paused. No real model or web-search calls may be made
for preparation, deployment verification or native installation. Release checks
must use their existing local/mock provider fixtures. Native handoff must not
submit an online question as a smoke test.

Batch 15's latest inspected state is generation/storage work paused, with no
new release recorded. Main and the Site will be rechecked before publishing;
any advance must be reconciled. Do not overwrite a concurrent release.

Release preparation, publication identity and native handoff are recorded below
after they complete. This source note alone is not evidence of deployment or
device installation.

## Preparation and current status

The complete required `npm run release:prepare` passed: shared web/native build,
`check`, `check:sync`, `check:release` and `check:mobile`. Chromium/WebKit search
recovery and all eight search viewport cases passed. Additional mocked combined
search browser checks passed at 320/390/820/1440 pixels, and `check:images` passed
with its unchanged 1 Samuel 7 close-pair report. The bundled Python runtime was
used through a local ignored executable alias, resolving the Windows launcher
failure without changing product source or bypassing the mobile swap tests.

GitHub main and the review branch were atomically advanced to runtime commit
`6b7af4d8c898d67ffd4bebab91be9ee57ff636ac`. The prepared source, web bundle, native
bundle and Sites mirror share fingerprint
`7f5b93b4c2636f897a6817bf7cc101e1483b56b82e193f12110ef33341928b2e`.
The Worker is 64,890,000 bytes, below the unchanged 66,060,288-byte limit.

**The initial publication handoff was blocked.** Automatic approval review rejected
the secure source-workflow handoff over source-identity/archive metadata. The
exact build 432 mirror state is preserved in local Site commit
`eaca9763f4b535e8f23363ce4ae7dddfa2f6125e`; at that checkpoint it had not been
pushed to the Site repository. The waiting helper was cancelled. No new Site
version or deployment was created by those rejected attempts, and no direct or
alternate publication route was attempted.

An independently prepared local archive and detailed recovery metadata are kept
under the ignored `.release/combined-search/` directory. They are reviewable
preparation artifacts only. At that checkpoint a public metadata check returned build
431 with fingerprint
`79bbe306e6270a7af1b64d36ffcb8659c747a5ef68662a8ac5bf1660e6da2431`.
The saved Site version was then 422, with runtime environment revision 2.

Zero real API or web-search calls were made. Paid validation remains paused and
the new online semantic/quotation protocol remains disabled. Native signing and
installation were not attempted at that checkpoint.

## Approved retry and successful publication

Kevin explicitly approved retrying publication with the verified build 432
source/archive and then installing on available devices. The corrected secure
handoff succeeded using Site source commit
`eaca9763f4b535e8f23363ce4ae7dddfa2f6125e`. The helper pushed that exact source
and packaged the already prepared Worker; no independent rebuild was performed.

Sites version **423** was saved as
`appgprj_6acba627a6cc8191932fbbc47db8895d~appgver_ae98440de2a8819196d17b3ce98feb73`.
Deployment `appgdep_6afa18d3a4d88191a1c427f5994331b7` succeeded at
2026-11-15T20:41:06.253248+00:00. Website:
https://scripture-lens.kvn-mcgwn.chatgpt.site.
The public audience and environment revision **2** were preserved.

`release:verify` passed against the actual live website, canonical source,
prepared native bundle and Sites mirror. All identify build **432** and
fingerprint
`7f5b93b4c2636f897a6817bf7cc101e1483b56b82e193f12110ef33341928b2e`.
The final local archive is 51,167,110 bytes with SHA-256
`6938677cce030584deb2b45a4d1a4e858d74ebe3bea08552401215229379a2f7`.

Live deterministic Library/chat checks returned Moses's age as 120 from the
actual WEB text of Deuteronomy 34:7, linked to `#read/4/34/7`. The unsupported
exact death-age query for Jesus returned uncertainty and no app citations.
Four actual-public browser cases passed: Chromium and WebKit at 390px and 820px,
typing the Library query and opening the correct verse without overflow. Paid
endpoints were blocked before page loading; zero were attempted. No real model
or web-search requests were made. The new online protocol and evaluation flags
remain disabled, with live model selection/format compliance still unverified.

The parent-managed Mac session can now fetch the approved source, build/sign,
compare every signed `public` asset with `www`, verify the same live fingerprint,
and install on available paired devices. It must report each installed build
and launch result separately and preserve notes, settings and Cloud Sync without
uninstall/reset. Paid online questions must not be used as installation smoke
tests. No physical-device installation or native-inference result is claimed by
this Windows session.
