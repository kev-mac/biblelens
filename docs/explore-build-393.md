# Build 393 UI corrections and release handoff

The final candidate passed [run 42424797447](https://github.com/kev-mac/biblelens/actions/runs/42424797447):
complete `release:prepare`, `check:images`, and 180 Chromium/WebKit cases
(104 reader, 28 evidence/context, 48 Explore). The run completed successfully;
the accepted artifacts were downloaded and their ZIP, inner archive, release
identity and Worker hashes verified locally. Earlier runs below are retained
as an audit, not substituted for this final source's results.

| Identity | Accepted value |
| --- | --- |
| Version / build | 1.1.0 / 393 |
| Canonical code commit | `7fe24ca40349e86336bb733edeff6a4bb409495f` |
| Tested CI commit | `d7504187747b2451f826485ea3e007860d01c9e8` |
| Source SHA-256 | `e2a84cc647ec2458bf0cec4b20412f3617ffa44c3c618763070eafcd9412df05` |
| Worker bytes | 59,185,175 |
| Worker SHA-256 | `c4c05b389cb27d2ef9aadb7e6b7cc2d2eea4880778aac0280e59f1a62df42b6f` |
| Inner prepared-bundles.tar.gz SHA-256 | `70ac5a45d34dd50cbe0172f1a8118aae8c2e811494d345d3fe7533cf0db012bc` |

The CI commit retains canonical main as an ancestor; its additional changes
are CI configuration and documentation. Both compute the source hash above.
Documentation-only checkpoint commits do not change release identity.

- [Exact verified bundles, artifact 13594934612](https://github.com/kev-mac/biblelens/actions/runs/42424797447/artifacts/13594934612):
  452,906,161 bytes, ZIP SHA-256
  `94fa3c6a16dd422daab1ea9abdcc7dfce91976969e34b2df078a3758f9cc259d`.
- [Screenshots, matrices and logs, artifact 13594979908](https://github.com/kev-mac/biblelens/actions/runs/42424797447/artifacts/13594979908):
  87,862,837 bytes, ZIP SHA-256
  `49126eb27c89949cfdc9c3acf69cd7c111afc2c693130f6274afbdf82bbce0f3`.

These GitHub artifacts expire on 2026-11-14. Preserved local paths are
`/workspace/shared/build393-final-verified-bundles.zip` and
`/workspace/shared/build393-final-visual-qa.zip`, with extracted copies beside
them. The safely extracted, byte-verified shared bundles are in
`/workspace/shared/build393-final-exact-bundles/{dist,www}`. The Worker-only
Sites package is `/workspace/shared/build393-final-sites-package`; it contains
only `server` and `.openai`, and its Worker hash matches the tested bundle.
It was packaged from accepted CI bytes with canonical `packageSites`, without
rebuilding the app. Do not use the original frozen build-391 checkout or an
earlier build-393 artifact for this release.

Manual inspection covered Chromium 598×1184 light and WebKit 598×1184 dark
passage screenshots, WebKit 1157×1184 light and Chromium 1157×1184 dark,
the undimmed 598px reader, and WebKit 820×1024 with simulated native safe area.
The narrow reference fields measure 496px / 496.22px by 44px; the wide fields
measure 642px / 642.22px by 44px. Narrow grids use abbreviations throughout;
wide grids show full names on one line. The chapter opener has link styling,
translation controls have visible labels and native selection affordances,
and all three passage steps have borders. Real typing, editing, invalid and
valid submission, pointer Go navigation, keyboard selection and focus passed.

The actual Genesis 1:16 Academic cards were inspected at 469px Chromium light
and 1440px WebKit dark: category-colored borders and distinct information/
evidence icon buttons preserve the two summaries. Explore was inspected at
525×985 Chromium light, 820×1180 WebKit dark and 1180×820 Chromium light:
one Collections carousel, retained search and coherent portrait/landscape
cropping. All 180 matrix rows are PASS. No screenshot comparison to a missing
approved rendering is claimed.

The final reader diagnostics captured only sync-session 503s and corresponding
cancelled requests; no stylesheet failure was recorded. The CI preview has no
D1 binding. A read-only production database overview confirms the `DB` binding
and `sync_devices`, `sync_documents`, `sync_pair_codes` tables exist, but does
not verify authenticated live sync. Existing readability corpus flags and the
reported 1 Samuel 7 close image pair remain in the check logs; artwork and
research data were not changed by this UI correction.

Publication belongs to the coordinating parent session's supported Sites
route. Reconcile the current mirror, publish these exact bytes, then run
`release:verify` and live sync checks. The native `www` is prepared but unsigned
(`signedNativeAssets: false`); Mac build/signing, signed-asset comparison,
iPhone/iPad installation and on-device build verification remain pending.
This session did not publish, install, or retry denied Mac network operations.

## Implemented scope

Build 393 removes the unintended second Text & Translation Tools row added in
build 392. Default Explore again contains exactly one Collections carousel with
the original seven cards. Text Comparisons and Translations remain available
through the existing Evidence & Interpretations destination and its filters;
no cards or replacement rows are added. The approved search box, fluid
portrait/landscape tile sizes, reader controls and evidence pills are preserved.

Regression coverage now asserts one section, one carousel and seven default
cards, with no manuscript row or separate text/translation cards. The exact
source browser matrix also opens Evidence from its carousel card, loads Text
Comparisons, selects Translations through Filters, returns to Text Comparisons
through Filters, and uses the existing Back to Explore link. It checks this
path across the 48 phone, tablet, desktop, orientation and theme cases in
Chromium and WebKit, alongside the retained search/layout/accessibility checks.
The existing Evidence deep link remains available. Older carousel/approved UX
assertions were aligned with the single-row structure; they are not claimed
executed unless separately recorded.

Build 392's passing results do not verify these changes. The accepted final
source, artifacts and remaining release steps are recorded above.

## Read reference field and context-card annotations

The original single-row candidate (`1f2ab02`, fingerprint
`15d7c40a4d63f47eefebb21179741dd7dbb9ebd4764f6d8ebb824eac5fdabbc4`)
passed [run 42417371250](https://github.com/kev-mac/biblelens/actions/runs/42417371250):
full release preparation, images, 24 evidence-pill cases, 56 reader cases and
48 Explore cases including actual Text Comparisons/Translations filter routing.
That candidate predates the additional user requests below and is not the
final release candidate.

Source inspection found a narrow-screen sizing conflict relevant to the
reported one-character reference field. `components.css` makes `form button`
100% wide below 651px. The reference Go button has `flex:none`, and did not
override that width, so it can consume the flex row and squeeze the growing
input to its padding. The existing input's `width:0` is its flex sizing basis;
it was not evidence of an editing prohibition. The initial fix set the Go
button's width to `auto`; the final reference row uses the explicit grid below.
No reference parser or passage navigation was replaced.
This source-proven conflict is consistent with the report, but the user's
exact browser state has not been reproduced or ruled out by a desktop result.

The intermediate reader matrix checked 88 cases across Chromium/WebKit, both themes,
web/simulated native safe areas, widths 320, 390, 647, 650, 651, 768, 820, 844,
1024, 1165 and 1366, including 844×390 landscape and the observed desktop
1165×747. It measures readable reference width (at least 160px and 60% of its
row), height/font, bounds, editability and hit testing; clicks and types a
reference, edits characters, checks Tab/Shift+Tab focus, and exercises invalid
Enter, valid Enter and Go-button navigation. It also checks real keyboard
entry and geometry in global Search. Viewport screenshots and field geometry
are retained, including loaded stylesheet URLs. These additions close the
earlier test gap where `fill()` could succeed in a visually tiny field.

Summary-card borders now use their selected category's existing palette and
the same light/dark color formula as the verse pill. The former Supporting
context metadata is an information icon that toggles an inline explanation of
that existing role, with `aria-expanded`, `aria-controls`, descriptive labels
and tooltips. It does not navigate anywhere. View evidence becomes a separate
book icon retaining full-evidence navigation. Both have 44px targets and
visible keyboard focus. Headings, summaries, verse context, sources and Whole
Chapter behavior are preserved.

The evidence browser matrix now has 28 cases, including the annotated 469×1184
size. It checks all six card/pill colors, icon-only presentation, metadata
disclosure with keyboard and pointer/touch, full-evidence focus and return,
and the actual two Genesis 1:16 Academic cards at mobile and desktop sizes in
both themes and engines. Fixture and real-data screenshots are retained.

Focused Explore, reader/parser and evidence checks pass locally. The
readability audit completed in its existing report-only mode and retained
existing corpus flags; this is not a clean strict readability result.
That intermediate source required a fresh full CI run with 164 browser cases
(28 evidence + 88 reader + 48 Explore); the earlier passing run was preserved
and was not attributed to later changes. No native browser session,
physical-device check, publication or installation is claimed by this task.

## Further passage-picker annotations

The user's supplied 598×1184 dialog screenshot confirms an actual visually
narrow field; the earlier different desktop observation does not disprove it.
The coordinated candidate also restores the chapter opener to link styling:
no stretched field border/background or dropdown arrow, while retaining its
dialog semantics, readable font, 44px target, keyboard focus and picker access.
Translation controls retain native selection with visible labels and the
site's 12px corners, borders and control colors. The three passage steps have
consistent borders, with the selected step distinguished.

The reference row now uses a full-width rectangular input plus an intrinsic
Go column. Its label says Go to a passage, and help text distinguishes passage
references from Search for words/topics. Existing parser and navigation rules
are unchanged. Each visible book grid uses full names on one line if all fit;
if any full name cannot fit, all its labels use abbreviations. Full accessible
names remain on the radio inputs. Actual font metrics, resize observation and
font readiness choose one mode; labels never shrink or split words. Widening
restores full names when they fit. All 86 books remain available through the
existing testament/collection controls.

The reader matrix adds the exact supplied 598×1184 and 1157×1184 viewports.
It now has 104 reader cases, for 180 total browser cases with the existing 28
evidence/context and 48 Explore cases. New assertions inspect link-style
chapter navigation, translation geometry/native appearance and keyboard
selection, visible step borders, uniform book-label mode and single-line fit
in Old/New/Lost groups, in addition to real reference entry/editing/focus.
Independent DOM text measurement checks the production canvas-based label
decision. Screenshots must be inspected before accepting the exact source.

No earlier approved rendering is present in this checkout or attached to this
delegated task. Comparison can use the supplied annotated screenshots and
requested behavior; no missing rendering is invented or claimed matched.

## Intermediate CI audit

[Run 42418351607](https://github.com/kev-mac/biblelens/actions/runs/42418351607)
stopped at the canonical ancestry gate, before dependencies or browser tests.
The checking branch had cherry-picked equivalent source without retaining the
new canonical commit as an ancestor. Merging canonical main into the checking
branch corrected that provenance error; the gate was not weakened.

[Run 42418521654](https://github.com/kev-mac/biblelens/actions/runs/42418521654),
for the earlier `b705f48…` source, passed release preparation, image parity,
all 88 reader/reference/global-search cases and all 48 Explore cases. It failed
the evidence test's keyboard-focus assertion in its first 320px Chromium case.
That fixture programmatically focused an information icon immediately after
a pointer tap, then pressed Enter. The existing app enables its keyboard
focus styling on Tab, so this was not actual keyboard traversal. The fixture
now uses Tab/Shift+Tab to reach the icon and retains the visible-outline
assertion. No production focus rules were removed or weakened. Its other
evidence cases did not run, and no prepared release bundle was accepted.

The failed run's screenshot/log archive SHA-256 is
`b524df56d6bb9d529ab808e1149c6df95c1058674f0ab430720a1ad695f4c22f`.
The latest passage annotations were implemented afterward and remain subject
to a fresh exact-source run covering all 180 cases. Passing intermediate
reader geometry is evidence for that source only, not acceptance of the later
picker changes or context actions.

[Run 42419644938](https://github.com/kev-mac/biblelens/actions/runs/42419644938)
passed preparation/images, all 28 evidence/context-card cases and all 48
Explore cases for source `04104cbe…`. The new reader fixture stopped after
its first 320px context on the final comparison focus assertion. The test had
pressed Enter on an already focused native translation select, opening its
native menu; Escape then dismissed the menu rather than the passage dialog.
The subsequent comparison therefore had the wrong assumed opener. Selection
is now committed with Tab, and the test explicitly verifies the passage
dialog closes and restores chapter-control focus before testing comparison.
The focus assertions and real keyboard translation selection are retained.
No production behavior was changed for that test sequence error. Matrix PASS
rows are now recorded only after the entire viewport context completes, and
failures retain a viewport screenshot. Undimmed reader screenshots are also
retained at 320px and both annotated passage sizes.

That failed result archive SHA-256 is
`d14a2c797a0cbbc3c70cd862aa527c7554553b92f9bbdde8432131501898a8f8`.
No bundle was accepted from it. Its category/color/real-context results are
useful evidence for that source, but do not constitute a complete release.

## Manual review of the first complete candidate

[Run 42420559428](https://github.com/kev-mac/biblelens/actions/runs/42420559428)
passed preparation, images and all 180 cases for source `0cd367da…` / canonical
`dfce764`. Its combined 540,332,486-byte artifact exceeded the native download
tool's 512 MiB limit. A packaging-only workflow used the pinned official
[GitHub artifact action](https://github.com/actions/download-artifact) to
verify the original ZIP checksum, original manifest/CI identity, inner archive,
both release manifests and Worker hash, then copy the accepted bytes into
separate bundles and visual artifacts. Nothing was rebuilt or edited by that
partition. Both resulting ZIP digests were verified locally before inspection.

The 598×1184 Chromium and 1157×1184 WebKit dialog screenshots confirmed the
usable reference row, native translation affordance, step borders and
single-line book labels. Field widths were 496px and 642.22px respectively,
with 44px height. However, the wide dialog still used abbreviations because
its six columns were unnecessarily narrow. The final candidate increases
usable column width with at most five columns, retaining compact responsive
targets and the all-or-none label rule. Browser assertions now explicitly
require full Old Testament names at wide sizes and uniform abbreviations at
narrow sizes, rather than accepting whichever mode the layout happened to
produce. This new source requires another complete exact-source run; the
earlier 180 passes are preserved and are not attributed to it.

Some early reader screenshots show a background Retrying indicator. The
failed request was not captured in the earlier fixture, so no cause is
assigned. The reader test now retains only failed-request origins/paths and
5xx status metadata, without query strings, headers or response contents, to
distinguish asset/style/API failures during the final review. This does not
hide the indicator or weaken any navigation, geometry or editing assertion.

The wider-grid run, [42422814744](https://github.com/kev-mac/biblelens/actions/runs/42422814744),
passed preparation/images and all 28 context cases, then completed 88 reader
layout cases before WebKit at 1024×1024 left Search open after Escape. The
Chromium wide cases rendered full names as required. This was a newly exposed
Search dismissal failure, not a field-width or book-label failure, and the
run was not accepted. Its early failure artifact SHA-256 is
`4451b805a69062cf95ceeefc433fb296d20a235b55314b49cb9441905c0e594f`.

The source allowed debounced input/submission after the Search dialog closed.
The fix cancels queued work on Escape and every close, invalidates stale
search results, ignores late input while closed, and guards both the timer
callback and form submission. Escape is handled in the dialog's capture
phase. A unit regression executes the actual handlers with queued/late events;
the browser regression also types and closes during the debounce window.
Event timing metadata, without query values, is retained to diagnose any
remaining platform-specific failure. The exact native event ordering that
caused the observed failure was not recorded in the earlier fixture.

The network diagnostics identify the background retry as
`GET /api/sync/session` returning 503 on the CI preview. The Node preview has
no D1 binding, and `worker/sync.mjs` deliberately returns that status when
`env.DB` is absent. No stylesheet failure was captured. This is a preview
limitation; signed-in production sync still requires live verification. Sync
code, authorization, revision handling and credentials were not changed.
