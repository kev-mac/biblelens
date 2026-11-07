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
