# UX2 implementation and review

Explore: Stories → People → Places → Commandments → Evidence. Evidence uses
History → Science → Timeline → Text Comparisons → Translations → Questions.
Both use full-width scroll-snap cards, swipe, keyboard arrows, labelled previous
and next controls, a live position label and reduced-motion support.

Mappings: History and Science use the existing mode-filtered research lists;
Timeline uses the existing timeline; Text Comparisons uses mode=text;
Translations uses the existing T-tagged translation studies. There is no separate
translation catalogue: this is the closest existing collection. Questions uses
#questions. The Questions bottom tab remains on that same page; Kevin listed
Questions under Evidence and may want that duplicate entry removed later.
Prophecies stays out of the Explore gallery. Method & Sources remains in the footer.

People search previously used substring matches across names and aliases.
Cainan includes Kenan; Jesus includes King. These are real dataset aliases,
not false biography matches. UX2 uses word starts, ranks primary exact/prefix
and word-start names above alias hits, displays aliases and adds a matched-alias
line for alias-only results. Inner substrings no longer match. K names fill the
first page; Kenan/King matches remain reachable with their displayed explanation.
People and Places use 15 results per page, including search results, with page
labels and Previous/Next. Places also displays its searchable modern names.
The letterboard is removed. Regression checks cover K, Moses and paging.

The shared popup component in src/dialog-scroll.js enhances native dialogs,
auto-popovers and existing role=dialog previews, including lazy-loaded content.
It supplies one SVG X with a 44px target and aria-label="Close", outside/Escape
dismissal and opener focus restoration. Existing save/cancel hooks remain.
Evidence and Compare are both native dialogs with the same surface dimensions.
Neither contains decorative artwork. Existing illustration labels are retained.

Surfaces covered: reader Evidence and Compare, starter studies, Settings,
verse notes, chapter bookmarks, delete-note confirmation, passage picker,
response citations, comparison context, highlight actions, cited verse and
related-summary previews, navigation menu, evidence filters, commandment
filters, prophecy filters, story-topic sheet, People profiles and source
popovers, Places/atlas sheet and source popovers, research sources and label
information, and draft research sheets when loaded. All use the shared X.
Studies has one global search entry, plain titles and summaries, and visible
colour-coded topic tags outside the collapsed detail area.

Local checks use a separate production server on 8875. The coordinator's 8788
preview was neither started nor stopped. Build number stays 277; no publication,
installation, native signing or platform synchronization is claimed.

Validation deliberately retains the real local production handler without auth
fixtures. Full hosted smoke probes need Sites sign-in routing and a configured
cloud database, which a local server does not provide. Report those probes as
unavailable if they fail; do not simulate a hosted pass or change sync security.

Final validation: check, check:workspace, check:mobile, check:sync, check:ui,
check:search, check:release, check:ux1b, readability, neutral-framing and draft-title
checks pass. The eight phone combinations pass; 64 screenshots and matrix.json
are in ~/git/codex-reports/ux2-shots/. The 96 colour pairs pass. A separate
Chromium/WebKit audit found exactly one shared X on each of 34 mounted popups.
Release smoke passes startup, reading, search, real map tiles, policy and runtime
in both engines. It fails only cloud sync (503: no local DB) and hosted sign-in
(404: no local Sites sign-in route). These are retained as failures in the logs,
not changed into simulated passes. Source, web and www identities match at 277;
no signed iOS artifact or installation was produced or compared.
