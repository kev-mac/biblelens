# BibleLens development and releases

Read RELEASING.md before syncing, building, publishing, or installing. GitHub main is canonical; Sites is its deployment mirror. Check both sources before assuming either is current. Preserve local edits and stashes.

Use one shared source state for web and native builds. Release identity comes from `scripts/release-info.mjs`; never hand-edit built release.json files. After publication/install, run release:verify and compare signed iOS assets with www. Report platform mismatches instead of claiming a synchronized release.

Cloud notes belong to the signed-in user. Preserve offline changes, three-way merge conflict handling, server revision checks, request-origin checks, device-token hashing and revocation. Never publish notes or embed service credentials in a client bundle. Run check:sync for sync changes and check:release for release-workflow changes.

Claude's research role and restrictions in CLAUDE.md remain in force unless the owner explicitly authorizes a different task.

The owner selected Inter, sans serif throughout. The Study Atlas uses one typeface consistently across scripture, headings and interface controls. Settings → App font changes all of these together using readerPreferences.appFont. Preserve explicit app-wide choices; legacy reading-only preferences are retained as data but must not silently become an app-wide selection. This replaces the earlier Lora/Inter pairing after the owner's feedback about mixed serif and sans serif typography.

BibleLens helps people explore what scripture says, where it comes from, and how historians, scientists and faith traditions read it. It presents the evidence and the strongest case for each reading in neutral, respectful language, and leaves conclusions, and how to use them, to the reader. Don't frame it as for or against any faith. Design for phones first, with clear, thumb-reachable navigation, readable text, image-led discovery and short, plain explanations. Welcome people of any faith or none; do not assume belief, biblical knowledge or devotional intent. Keep actions discoverable, support reduced motion, and use images to invite learning without presenting imagined artwork as evidence. Human illustrations show people of the ancient Near East and Africa with varied skin tones, features and natural hair textures, in dignified portrayals. Imagined artwork is never presented as historical evidence or a real portrait.

Kevin’s ruling (2026-10-30): “Neutrality is leading to whitewashing, so let's adjust the rules. Big Questions can be Conflicts or Contradictions. Text vs Text can also be renamed.” Contradiction(s) and conflict(s) are allowed in visible copy. Keep blocking mocking and debunk-marketing language: “debunk”, “exposed”, “lies”, and “myth” used as a verdict. App Store copy must not market the app as a debunking tool.

Use neutral descriptions of texts, literary forms, historical settings and interpretations. Do not assume religious belief, familiarity with biblical narratives, or devotional intent in interface copy.

Prophecies and Method & Sources are deferred as Explore gallery cards. Keep Method & Sources accessible through the footer. Use title case for displayed timeline headings without changing the underlying research titles.

## Writing standard

- Visible card text (titles, blurbs, one-line summaries, evidence-strength lines, and anything shown before a tap) targets Flesch-Kincaid grade 6–8 per collection average. Sentences have at most 20 words; blurbs have at most 15 words. No unexplained jargon.
- Tap-to-open notes and detail fields may average up to grade 10 per collection. Sentences have at most 30 words. Explain jargon on first use.
- Scripture text and quoted source titles are exempt in both tiers. Plain equivalents: "the old Greek translation" before "the Septuagint"; "the Hebrew text" before "WLC"; "ancient copies" before "manuscripts/witnesses". Full source names belong in Sources.
- Keep each record's scholarly limits, but say them plainly. Never add claims, motives or certainty the record doesn't state.
- Run `npm run check:readability` after content changes.
