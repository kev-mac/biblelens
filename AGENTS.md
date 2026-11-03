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

## Chapter and story artwork

Work through the 66 books one book per Codex session. Complete and verify the current book, then commit, push, publish, install on the connected iPhone and iPad, and provide a handoff prompt for the next book in a new session. Do not begin the next book in the current session.

Every Bible chapter opens with a relevant image directly below its heading and before verse 1. An existing Story image at verse 1 counts; do not add a duplicate opener. Additional story images remain beside the verses they illustrate. Keep useful alt text, hide generic chapter-image captions, and show only story-related captions in small italic text beneath their images. Avoid unnecessary image clusters; report consecutive images separated by fewer than five verses.

Use the fresh Genesis 7 ark scene approved by Kevin on 2026-11-02 (`src/assets/chapter-genesis-07-opening-v1.webp`) as the style reference for existing and new artwork. Keep its grounded natural light, believable faces and materials, and restrained illustrative finish. Avoid cartoonlike rendering, glossy photographic sharpness, and heavy oil-paint texture. This is a visual target, not a tool percentage. Vary lighting, scenery, composition, time of day and natural colors, including blues, greens, reds and purples; avoid a repeated sepia or amber color grade. Portray people of the ancient Near East and Africa with varied skin tones, features and natural hair textures, respectfully and with dignity. Imagined artwork is never historical evidence or a real portrait.

Kevin explicitly requested on 2026-11-02 that existing images be reviewed starting with Genesis. Keep images that already fit; redo only those needing the new realism or continuity standard. Use versioned replacement files and preserve earlier versions in source history. Maintain recurring characters across chapters and books: keep recognizable facial features, skin tone, height, build, and natural hair texture, while depicting plausible aging and changed circumstances. A character must not become a different-looking person between scenes. Before accepting any scene, compare visible people, ages, relationships, objects, actions, and setting with the relevant verses; do not invent details that contradict the text. Inspect hands, fingers, thumbs, limbs, and other anatomy at full size; reject or repair malformed figures before publication. For Noah's ark, only Noah, his wife, their three adult sons, and their three adult wives may be aboard—eight adults total, with no small children. Keep each image's relevant chapter or story role and do not silently remove coverage. Use one shared source state for web and offline native assets.

### Universal visual continuity rule

Apply this to every recurring named person and recognizable recurring group in all books, including Story art and chapter art. Before making a new scene, inventory their earlier appearances in the current and previous books. Choose clear, text-compatible approved images as the character references; do not use an image with unresolved identity drift as the model. Record the reference paths and stable traits: facial structure, complexion, hairline and natural hair texture, height and build, and age at that point in the narrative. Clothing, pose, and lighting may change; identity must remain recognizable. Check the elapsed narrative time before aging anyone.

Supply the actual approved image files as visual inputs to the image generation or editing tool for every new scene with an identifiable recurring person. Viewing them yourself or describing them in a text prompt does not count. If the available tool cannot use image inputs, choose a text-faithful scene without an identifiable portrayal of that person, or leave the asset pending review. Use Genesis 7 as a style reference, never as the identity reference for another character.

Before accepting an image, compare it side by side at full size with the reference images and every nearby depiction, including images in the same chapter and across book boundaries. Check faces, complexion, hair, apparent age, build, relationships, hands, limbs, and any animals. Record the reference paths, the result, and any unresolved uncertainty in the book audit. Reject and replace an image when the person or recurring group appears to change identity. Do not publish an unresolved continuity break. Keep replacements versioned and retain earlier versions in source history.
