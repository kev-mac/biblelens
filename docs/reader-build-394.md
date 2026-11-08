# Build 394 compact reader controls

Kevin's three annotations were supplied from the live build-393 reader at
601×1184. Build 394 reduces the category pills and toolbar translation
selector, and restores book selection from the existing bottom paging row.

The visible pills change from 10px text with 2px/4px padding to 9px text with
1px/3px padding. Their separate, non-overlapping targets are at least 24px
high and wide, replacing the extra 44px inline spacing. Category colors,
ALL CAPS labels, counts, context summaries and evidence navigation remain.
The toolbar translation selector changes from 80×44px to 64×32px, retaining
its Translation caption, site colors/corners and native selection affordance.
Other dialog controls and context-card actions retain their larger targets.

The current and inspected historical source both retain previous/next arrows
around a plain-text chapter footer; no historical interactive center control
was found. This correction keeps that familiar row and makes its passage
label a keyboard-accessible button opening the existing Book/Chapter/Verse
picker. Closing restores focus to the actual opener and preserves scroll
position. No separate picker or new navigation row is introduced.

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
bottom-row visibility and opener focus, real previous/next across a book
boundary, and selecting another book/chapter/verse through the bottom picker.
Screenshots require manual inspection before accepting the final candidate.

Publication and native installation are not yet claimed. This cloud session
does not have a Mac build target or connected physical-device verification;
the coordinating session owns the supported publication/install handoff.
