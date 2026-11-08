# Build 394 compact reader controls

The final candidate is accepted for publication. [Run 42433169571](https://github.com/kev-mac/biblelens/actions/runs/42433169571)
passed complete `release:prepare`, image parity and all 192 Chromium/WebKit
cases: 112 reader, 32 evidence/context and 48 Explore. Final screenshots were
inspected after the earlier green candidate failed manual WebKit review.
The earlier artifacts below are preserved and superseded.

| Identity | Accepted value |
| --- | --- |
| Version / build | 1.1.0 / 394 |
| Canonical code commit | `ab312c5d4d9ec5f6150d4b9e42647e46ade0f2a1` |
| Tested CI commit | `6b4bd11db029af50caadec80c29c67302abd3be6` |
| Source SHA-256 | `3c8106a18e9b197a4071747f117a3e1edd1838ed9194cfb4eb3be96b253fa32a` |
| Worker bytes | 59,188,250 |
| Worker SHA-256 | `6787374b310d225dd84d53cd67bde847774b9926f5999b7b2a1ebbdc433ac454` |
| Inner prepared-bundles.tar.gz SHA-256 | `b4e8c483e16bf511efde6932c2c3b7d957cef5c02cb2a8e2d4d8797a9dcd3766` |

The CI head retains the actual canonical code commit as an ancestor; its extra
changes are the checking workflow. Both compute the accepted source hash.
Documentation checkpoints do not change release identity.

- [Verified bundles, artifact 13598935837](https://github.com/kev-mac/biblelens/actions/runs/42433169571/artifacts/13598935837):
  452,908,978 bytes; ZIP SHA-256
  `7e5b4fea924f5664c49a89aba07d4444d1738b1ef10b7745fe8b09c170b421a0`.
- [Screenshots, matrices and logs, artifact 13598448330](https://github.com/kev-mac/biblelens/actions/runs/42433169571/artifacts/13598448330):
  103,662,021 bytes; ZIP SHA-256
  `79ad179a5a6457a89bae74a3870c236b16733450e0951ff82a3eaa78941ee682`.

The seven-day GitHub artifacts were downloaded and both ZIP hashes verified.
Safe extraction also verified the inner archive checksum, canonical/CI
identities, both release manifests and the Worker hash. Local copies are
`/workspace/shared/build394-final-verified-bundles.zip` and
`/workspace/shared/build394-final-visual-qa.zip`, with extracted copies beside
them. The exact accepted shared bundles are in
`/workspace/shared/build394-final-exact-bundles/{dist,www}` and copied into
`/workspace/biblelens-reader-394/{dist,www}` without rebuilding.

The Worker-only Sites package is
`/workspace/shared/build394-final-sites-package`. It contains only `server`
and `.openai`; its Worker hash matches the table. It was staged from accepted
CI bytes with the canonical packager, preserving the self-contained compressed
fallback and excluding the static client, Wrangler file and asset manifest.
Do not use the original build-391 checkout, build-393 outputs, or any
`build394-first-green-*` artifact for this release.

Manual inspection covered WebKit 601×1184 dark floating and bottom views,
Chromium 601×1184 light and 320×844 light floating views, WebKit 820×1024
light with simulated native safe area, Chromium 1157×1184 dark, and the actual
Genesis 1:16 context cards in WebKit at 601px. The selector renders at 72×32px
in both engines at 320px and 601px; WEB is complete and Translation stays on
one line. The toolbar is opaque while scrolling. Pills render at 9px with
about 14.8px visible height and separate targets of at least 24px. Floating
controls have 44px arrows and a 72px book button, sit above app tabs, and keep
book selection available at the bottom. Historical behavior was checked
against Git source; these are fresh CI renderings, not archived screenshots.

All matrix rows are PASS. Checks include category colors/counts, real typed
reference input, caption/text fit, toolbar opacity, downward wheel scrolling,
floating geometry, modal/view hiding, keyboard/touch activation, opener focus
and scroll retention, cross-book paging and book/chapter/verse selection.
Only reader UI, build metadata and regression checks changed; no research,
corpus or artwork data changed. Existing report-only readability flags and
the reported 1 Samuel 7 close image pair remain in the logs.

The preview's only recorded request problems were `/api/sync/session` 503s
and corresponding cancellations: its Node environment has no D1 binding.
No stylesheet failure was recorded. Production binding/schema had been
confirmed read-only in the earlier release task; authenticated live sync
still needs verification after publication.

Publication belongs to the coordinating session's supported Sites route.
The Site tool still reports latest saved version 388; no build-394 publication
was performed here. Reconcile the fresh mirror, preserve its public audience,
publish the exact accepted package, and run `release:verify` from the
build-394 canonical checkout against that mirror. Native assets are prepared
but unsigned (`signedNativeAssets: false`). Mac build/signing, comparison of
signed public assets with accepted www, iPhone/iPad installation and on-device
build/fingerprint verification remain pending. No denied Mac network action
was retried by this task.

## Implementation and development audit

Kevin's three annotations were supplied from the live build-393 reader at
601×1184. Build 394 reduces the category pills and toolbar translation
selector, and restores the earlier floating passage controls. Kevin clarified
that he meant floating controls and explicitly requested checking Git history.

The visible pills change from .625rem text with 2px/4px padding to .5rem text with
1px/3px padding (9px text at the default 18px root). Their separate, non-overlapping targets are at least 24px
high and wide, replacing the extra 44px inline spacing. Category colors,
ALL CAPS labels, counts, context summaries and evidence navigation remain.
The toolbar translation selector changes from 80×44px to 72×32px at the default font size, retaining
its Translation caption, site colors/corners and native selection affordance.
Other dialog controls and context-card actions retain their larger targets.

Git history identifies the three independent floating controls in commit
`72a278e187689aaba6ec1b44597f263dd833f12a`: a central 72px book button, with
44px previous/next controls on either side in the later cascade. The Study
Atlas redesign `ebefd13c4a82ecf038e6a07417d18667be9e6e23` added the lens-app
rule hiding the legacy comparison dock. The central book control was generated
in the old chapter heading, not in the static footer. The first build-394
candidate incorrectly targeted the footer; it was superseded after Kevin's
clarification and is not accepted for release.

The final implementation restores that independent three-button floating
layout using the existing passage picker and original previous/next actions.
It appears after scrolling into the chapter, including scrolling down in the
reading direction as requested. It clears the current bottom app navigation,
hides during dialogs/text highlighting or outside Read, and preserves disabled
chapter boundaries. As in the earlier code, floating arrows hide when the
original bottom arrows are visible; the floating book button remains usable.
The original static footer remains unchanged. Closing the picker restores its
actual floating or header opener without scrolling away. No old category row
or separate picker is restored, and no saved drag anchors are modified.

Before editing, GitHub main was fetched and the Site's source ref refreshed
with a fresh, stdin-only credential. All 2,019 release-source blob identities
matched canonical main. Site source was `7304735e272c0cbd12d6cc422fbe24e9b69ba5ee`
(saved Site version 388, app build 393). No mirror files were overwritten.
The build-393 worktrees, accepted artifacts and unrelated data are preserved.

Focused reader, typed-reference, book-grid and evidence checks pass locally.
The broader local `npm run check` stopped at the absent generated
`dist/server/index.js` in this fresh checkout; this is not a complete local
check pass. The required CI preparation builds before checking and must pass
for the new exact source before publication. The browser matrices now include
the supplied 601×1184 viewport: 112 reader, 32 evidence/context and 48 Explore
cases. They check reduced control geometry, separate targets, colors/counts,
floating controls while reading down, bottom-tab clearance, modal/view hiding,
opener focus and scroll retention, real previous/next across a book boundary,
and selecting another book/chapter/verse through the floating picker.
Final screenshots were inspected as recorded above.

Publication and native installation are not yet claimed. This cloud session
does not have a Mac build target or connected physical-device verification;
the coordinating session owns the supported publication/install handoff.

The first candidate passed preparation/images and Explore but failed compact
geometry checks. Diagnostic run 42429258508 confirmed a default 18px rem base:
its .5625rem pill rendered at 10.125px with 16.14px height, exceeding the
intended 15px visual limit. The final .5rem pill corrects that size. The
601px translation selector measured 64×32px in both engines, while the reader
fixture reported 64×44px at 320px; that narrower failure was subsequently traced to the flex-basis rule below.
These failed candidates are not accepted release artifacts.

Run 42429883603 passed preparation, image parity and all 32 evidence cases;
the reader stopped at 320px because the toolbar select still rendered 44px
high. Rendered diagnostics showed a 32px minimum and the intended new font.
Source inspection then identified the max-360px rule setting a 44px flex basis
on both the label and select. In the newer column label that basis controls
the select height. The final selector resets its own flex basis with
`flex:none`; the rendered-size assertion is retained. Scroll setup for
cross-book actions is immediate; the visibility check uses an actual downward
mouse wheel event. These corrections were covered by the final exact-source run above.

Run 42430762034 passed preparation/images and all 192 browser cases. Manual
review nevertheless found WebKit clipping the selected edition and wrapping
the Translation caption at 64px, plus scripture visible through the sticky
reading toolbar. This first green candidate is preserved as
`/workspace/shared/build394-first-green-{visual-qa,verified-bundles}` (and ZIPs),
not accepted for publication. The final label uses at least 72px, scales with
app font size, keeps its caption on one line and preserves the compact 32px
select height. The toolbar has the existing opaque theme background. New
assertions check caption fit, room for selected text beside the native arrow,
and background opacity; the resulting screenshots were inspected in the final run above.

Run 42432314875 passed preparation/images and 32 evidence cases, then the new
opacity assertion correctly rejected the reader. An older `:is()` glass rule
includes the more specific masthead navigation selector, so its background
won over a simple reader-bar override. The final rule is scoped through both
Read-view and reader-bar IDs and disables the bar's obsolete backdrop filters.
The opacity assertion remains unchanged; bottom-tab styling is preserved.
