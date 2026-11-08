# Build 394 compact reader controls

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
Screenshots require manual inspection before accepting the final candidate.

Publication and native installation are not yet claimed. This cloud session
does not have a Mac build target or connected physical-device verification;
the coordinating session owns the supported publication/install handoff.

The first candidate passed preparation/images and Explore but failed compact
geometry checks. Diagnostic run 42429258508 confirmed a default 18px rem base:
its .5625rem pill rendered at 10.125px with 16.14px height, exceeding the
intended 15px visual limit. The final .5rem pill corrects that size. The
601px translation selector measured 64×32px in both engines, while the reader
fixture reported 64×44px at 320px; that narrower case remains under investigation.
These failed candidates are not accepted release artifacts.

Run 42429883603 passed preparation, image parity and all 32 evidence cases;
the reader stopped at 320px because the toolbar select still rendered 44px
high. Rendered diagnostics showed a 32px minimum and the intended new font.
Source inspection then identified the max-360px rule setting a 44px flex basis
on both the label and select. In the newer column label that basis controls
the select height. The final selector resets its own flex basis with
`flex:none`; the rendered-size assertion is retained. Scroll setup for
cross-book actions is immediate; the visibility check uses an actual downward
mouse wheel event. Both changes require a fresh exact-source run.

Run 42430762034 passed preparation/images and all 192 browser cases. Manual
review nevertheless found WebKit clipping the selected edition and wrapping
the Translation caption at 64px, plus scripture visible through the sticky
reading toolbar. This first green candidate is preserved as
`/workspace/shared/build394-first-green-{visual-qa,verified-bundles}` (and ZIPs),
not accepted for publication. The final label uses at least 72px, scales with
app font size, keeps its caption on one line and preserves the compact 32px
select height. The toolbar has the existing opaque theme background. New
assertions check caption fit, room for selected text beside the native arrow,
and background opacity; screenshots still require inspection.

Run 42432314875 passed preparation/images and 32 evidence cases, then the new
opacity assertion correctly rejected the reader. An older `:is()` glass rule
includes the more specific masthead navigation selector, so its background
won over a simple reader-bar override. The final rule is scoped through both
Read-view and reader-bar IDs and disables the bar's obsolete backdrop filters.
The opacity assertion remains unchanged; bottom-tab styling is preserved.
