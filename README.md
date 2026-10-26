# BibleLens

This snapshot packages KJV, WEB and ASV scripture for all 66 books and 1,189 chapters, with KJV as the default. Reading and existing annotations do not require AI requests.

## Connected study workspace

Read, Explore, Search and Notebook are the main destinations. The reader keeps attributed evidence in a desktop margin or a phone dialog. Focus mode keeps the desktop text clear. Search groups scripture, editorial research, stories, people, places and private notes; private-note matching stays on the device.

Compare accepts two chapters or verse ranges, shows the selected KJV/WEB/ASV text and preserves the stored research's source quotations, alternative readings and scope. Save a comparison to Notebook to resume it later. Notes, bookmarks and saved comparisons support export, backup restore and optional cloud sync. Concurrent tab edits use a durable journal and three-way merge; storage failures and recovery copies remain visible.

The shared design also covers Stories, People and family relationships, Places and the atlas, Evidence, Commandments, Prophecies, Timeline, Method & Sources, conversation, filters, source panels and reader settings. Directory rows, expanded sections, loading and empty states use the same typography, surfaces and controls. Pending chapters, searches, reference lists, evidence and verse previews show a shared progress indicator; chapter and image placeholders reserve their layout space. Image failures offer Retry, and reduced-motion preferences stop spinner animation. Stories search matches all keywords across titles, summaries, passages and themes, including “Jonah fish.” Narrow layouts adapt to the text-size setting; browser layout checks do not replace physical-device testing.

The Study Atlas direction adds a dark ink masthead and consistent Inter typography. Settings → App font applies the chosen face to scripture, headings and controls together; explicit app-wide choices persist, while the new design starts in Inter even when an older reading-only preference exists. Six active Explore categories have cinematic illustrations and real place and person links. The Prophecies and Method & Sources gallery cards are deferred; Method & Sources remains in the footer. These imagined scenes are decorative, not historical evidence; their generation prompts are recorded in `src/assets/explore-art.provenance.json`. Compressed WebP artwork is loaded independently of the startup script and packaged locally for native reading. The reader keeps its compact book/chapter selector and connects copper evidence counts to the reading margin or phone sheet.

Explore is the first navigation destination and opens at the bare app URL. One ordered category gallery replaces the duplicate feature/directory lists. Swipe horizontally, choose a full-label category tab, or use keyboard/previous/next controls; vertical page scrolling never changes the selected category. Reduced-motion preferences disable smooth transitions. Question prompts lead into the existing studies, with detailed passage references inside each study.

Reader actions are explicit: select a verse number to bookmark, write a note, copy or share. Saved verses show a bookmark icon; bookmark changes display confirmation with Undo. Removing a bookmark preserves its note and title. A bookmark containing saved highlights is protected until those highlights are removed separately. Scripture double-taps use normal text selection, and research details open through labeled controls. Outlined evidence counts open the corresponding research.

Startup ships one content-fingerprinted stylesheet and one script package, preserving the original classic-script execution order. A self-contained loading/retry screen covers failed app files; reader book, chapter and picker requests have a 15-second deadline. Both hosted and native builds use the same packaged interface.

## Annotation coverage

The annotation collection is incomplete. This snapshot contains 1,933 evidence records attached to 1,007 of 1,189 chapters, with 4,537 distinct annotated verse locations. The other 182 chapters have no attached evidence. Attached records and reference directories have not received an exhaustive scholarly review.

The evidence panel distinguishes source text from editorial interpretation and retains reasoning, sources, witness labels and limitations. A missing annotation is not a conclusion about historical accuracy or agreement. Run `node scripts/audit-annotations.mjs` to recompute coverage from the current corpus. `research/notes/` records researched passages, access limitations and outstanding work.

## Build and check

Requires Node.js 22 or later. Install the pinned dependencies before building.

```text
npm ci
npm run build
npm run check
npm run check:workspace
npm run check:sync
npm start
```

Open http://127.0.0.1:8787 after starting. The local reader and packaged annotations work without internet after extracting this package. External source links require internet. Chat searches packaged passages and studies locally, with conversational excerpts and source links. It needs no account, API key, paid AI service, or internet connection. No credentials are included.

The automated check exercises all 1,189 chapters and every comparison mode, verifies reference bounds, confirms each evidence placement and checks duplicate annotation IDs. These checks do not certify scholarly completeness or visual browser behavior.

## Mobile app development

The Capacitor target bundles the reader, scripture, annotations, reference aids and search in `www/`. Its `/api/` requests are handled inside a local Web Worker. There is no remote `server.url`, paid inference API, account requirement or hosted backend in this target. Source links remain external and require internet when opened.

```text
npm run build:mobile
npm run check:mobile
npx cap sync
npm run preview:mobile
```

The preview serves static files at `http://127.0.0.1:8788`; it deliberately has no server API. `npm run mobile:android` opens the generated Android project. `npm run mobile:ios` opens the iOS project on a Mac. Android builds require Android Studio, SDK 36 and JDK 21. This checkout uses Android API 28 as its minimum because of the optional local AI plugin. iOS builds require macOS and a Swift 6.2-capable Xcode installation.

`com.scripturelens.app` is a development application identifier. Confirm an identifier under the owner's control before creating store listings or signing a release. Signing keys, store accounts, final icons, release privacy declarations and store submission have not been configured.

Optional on-device explanations are enabled from Reader settings for the current session. The MIT-licensed experimental `@capacitor/local-llm` plugin uses Apple Intelligence on supported iOS 26 devices and Gemini Nano on supported Android hardware. The app does not download a model automatically. Android may offer an explicit model download through Google Play Services; iOS model readiness is managed in system settings. Once the device model is available, inference runs on the device with no per-message API bill. Unsupported or unavailable models, malformed output and inference errors fall back to packaged search.

Generated explanations are labelled in Details & sources. Output checks confirm structure and cited source IDs; they do not prove that generated prose correctly interprets scripture. Qualified dietary, family and permission answers are retained without model rewriting. Native inference and performance require physical device testing; desktop worker checks do not verify them.

The mobile bundle and worker tests verify packaged reading, retrieval, comparisons and note handling. Physical-device performance, native model inference, signing and distribution require separate validation; a web preview does not establish those results.

## Hosted version

https://scripture-lens.kvn-mcgwn.chatgpt.site

The existing hosted audience is preserved. Source identity is retained in `.openai/hosting.json`; it is not an authentication credential.

The shared workspace uses ink/ivory surfaces, copper accents, labeled navigation, keyboard focus indicators and pinch zoom. Settings retains translation, evidence visibility, font, text size, theme and sync controls. Red-letter markup preserves the packaged text and follows publisher speech spans; see data/red-letter-provenance.json and research/notes/reader-warm-red-letters.md for attribution and boundary limits.
