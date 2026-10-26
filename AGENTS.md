# BibleLens development and releases

Read RELEASING.md before syncing, building, publishing, or installing. GitHub main is canonical; Sites is its deployment mirror. Check both sources before assuming either is current. Preserve local edits and stashes.

Use one shared source state for web and native builds. Release identity comes from `scripts/release-info.mjs`; never hand-edit built release.json files. After publication/install, run release:verify and compare signed iOS assets with www. Report platform mismatches instead of claiming a synchronized release.

Cloud notes belong to the signed-in user. Preserve offline changes, three-way merge conflict handling, server revision checks, request-origin checks, device-token hashing and revocation. Never publish notes or embed service credentials in a client bundle. Run check:sync for sync changes and check:release for release-workflow changes.

Claude's research role and restrictions in CLAUDE.md remain in force unless the owner explicitly authorizes a different task.

The owner selected Inter, sans serif throughout. The Study Atlas uses one typeface consistently across scripture, headings and interface controls. Settings → App font changes all of these together using readerPreferences.appFont. Preserve explicit app-wide choices; legacy reading-only preferences are retained as data but must not silently become an app-wide selection. This replaces the earlier Lora/Inter pairing after the owner's feedback about mixed serif and sans serif typography.

BibleLens is for Gen Z and younger people using phones to learn, compare evidence and debate ideas. Design for phones first, with clear, thumb-reachable navigation, readable text, image-led discovery and short, plain explanations. Welcome people of any faith or none; do not assume belief, biblical knowledge or devotional intent. Keep actions discoverable, support reduced motion, and use images to invite learning without presenting imagined artwork as evidence. Human illustrations show people of the ancient Near East and Africa with varied skin tones, features and natural hair textures, in dignified portrayals. Imagined artwork is never presented as historical evidence or a real portrait.

Use neutral descriptions of texts, literary forms, historical settings and interpretations. Do not assume religious belief, familiarity with biblical narratives, or devotional intent in interface copy.

Prophecies and Method & Sources are deferred as Explore gallery cards. Keep Method & Sources accessible through the footer. Use title case for displayed timeline headings without changing the underlying research titles.

## Writing standard

- Everything the app writes (UI copy, card blurbs, evidence summary/reasoning/scope, story summaries, people and place text) targets Flesch-Kincaid grade 6–8, averaged per collection. Scripture text and quoted source titles are exempt.
- Per line: sentences of at most 20 words; card blurbs (Explore and collection descriptions) of at most 15 words; no unexplained jargon. Plain equivalents: "the old Greek translation" not "Brenton's Greek" or "the Septuagint" on first use; "the Hebrew text" not "WLC"; "ancient copies" not "manuscripts/witnesses". Full source names belong in Sources.
- Keep each record's scholarly limits, but say them plainly. Never add claims, motives or certainty the record doesn't state.
- Run `npm run check:readability` after content changes.
