# Approved proposals 26–30

- 26: Removed generic sheet Back controls that duplicated Close. Person profile Back remains only while a nested person history entry exists.
- 27: Consistent centered actions and focus outlines; no underlined links. Source links label external destinations without arrows. Category colors and disabled gray actions remain.
- 28: System/Light/Dark choices retain explicit preferences; System follows live OS changes. Sync accepts all three choices. Existing update/refresh controls remain.
- 29: Seven Method & Sources sections have in-page navigation, readable single-column layout, and all attribution, source, rights, and privacy details. Clarified the difference between packaged web search and optional native on-device AI. Retained Method markup in initial CSS packaging so direct navigation has its full styles.
- 30: Empty-note Markdown export is disabled. Restore Backup is prominent; Full Backup remains available with no saved entries because it contains settings. Restore outcomes appear in Saved.

## Verification

Web build passed, including startup resource checks. Focused saved-card, settings-method, popup-dismissal, sync, sync-disconnect, characters, reader-annotations and header-context checks passed. Chromium UI checks cover 390/1024 widths, System live changes and explicit-mode persistence, Method navigation/focus, empty export, actual Full Backup download, nested person Back and Close. Screenshots inspected under `.release/proposals-26-30`.

UI test serves local placeholder artwork and aborts remote browser requests; it does not verify hosted image delivery. The first artwork request and aggregate npm check were blocked by environment network policy (raw.githubusercontent.com and registry.npmjs.org respectively). Those denied operations were not retried. Aggregate check is not a full pass. WebKit closed before the initial Saved view loaded and is not verified. Native packaging/install and live publication were not performed.

Integrate after proposals 21–25 on the release coordinator's branch and rerun combined UI checks. No build number change, push, publication, or installation in this task.
