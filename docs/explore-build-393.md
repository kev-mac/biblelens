# Restore the single Explore carousel

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

Validation and the exact tested commit/artifact will be recorded after the new
CI run. Build 392's passing results do not verify build 393. The publishing
session owns Sites reconciliation/publication of the accepted exact bundle.
This task does not install devices or retry denied Mac network operations.

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
it was not evidence of an editing prohibition. The minimal fix sets only the
Go button's width to `auto`. No reference or search navigation was replaced.
This source-proven conflict is consistent with the report, but the user's
exact browser state has not been reproduced or ruled out by a desktop result.

The expanded reader matrix checks 88 cases across Chromium/WebKit, both themes,
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
The final source now requires a fresh full CI run with 164 browser cases
(28 evidence + 88 reader + 48 Explore); the earlier passing run is preserved
and is not attributed to these later changes. No native browser session,
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
