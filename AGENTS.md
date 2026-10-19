# BibleLens development and releases

Read RELEASING.md before syncing, building, publishing, or installing. GitHub main is canonical; Sites is its deployment mirror. Check both sources before assuming either is current. Preserve local edits and stashes.

Use one shared source state for web and native builds. Release identity comes from `scripts/release-info.mjs`; never hand-edit built release.json files. After publication/install, run release:verify and compare signed iOS assets with www. Report platform mismatches instead of claiming a synchronized release.

Cloud notes belong to the signed-in user. Preserve offline changes, three-way merge conflict handling, server revision checks, request-origin checks, device-token hashing and revocation. Never publish notes or embed service credentials in a client bundle. Run check:sync for sync changes and check:release for release-workflow changes.

Claude's research role and restrictions in CLAUDE.md remain in force unless the owner explicitly authorizes a different task.

Use sans serif by default throughout the app, including page titles, headings, quotations and editors. Serif fonts are available only when explicitly selected in reader font preferences.
