**TL;DR:** The comparison pack now combines the original control audit with a separate review of whole cards, summary blocks, panels, legacy study views and note forms. You can make style choices from the boards. The remaining items below are explicitly source-only or untested; no screenshot is presented as evidence of a state that was not opened.

## Scope checked

- Live web build 241. Read, Stories, Chat, Marked, Prophecies, Characters, Commandments, Settings, Timeline, Places, About, navigation and reachable dialogs.
- The original matrix has dark/light at 1280 × 900 and 375 × 900, with 100% text. Original raw data and all screenshots remain intact.
- New whole-object captures include both themes and widths for the main story, character, Commandment, Prophecy and profile surfaces; additional dialogs, rich evidence and legacy views were captured at desktop width. See `gap-captures.json` for the exact per-object matrix. This is not a claim that every new object was recaptured in all four conditions.
- The live user session had text size 115% (18.4px root / 16.1px body). New captures retain that preference and are labeled 115%. The original matrix is labeled 100%. Do not interpret the preference difference as CSS drift.
- Stylesheets reviewed: `src/style.css`, `src/fonts.css`, `src/components/timeline/TimelineEventCard.css`, and the live vendor `leaflet.css`. All three app stylesheets still match the live files. The vendor copy and SHA-256 inventory are saved locally. Fonts CSS contains embedded font registrations rather than controls.
- Source review covered `src/index.html`, `app.js`, `navigation.js`, `reader.js`, `passage.js`, `citations.js`, `marked.js`, `stories.js`, `commandments.js`, `prophecies.js`, `timeline.js`, `timeline-core.js`, `reviewed-timeline.js`, `places.js`, `places-core.js`, `sync.js`, `release.js`, `mobile.js`, and the character/Timeline components. Data examples were selected for rich content, not minimum-card cases.

## Gaps closed in this pass

| Earlier gap | Added evidence |
|---|---|
| Whole card shells absent from the control inventory | Moses directory card, The Line of Seth, Commandment cards, prophecy cards, both Timeline card types, saved verse card, Chat question bubble, legacy passage and assessment blocks |
| Profile biography compared only to a single Read card | Read Academic, Contradictions, Questions and Translation surfaces; Marked assessment; Chat answer; Abraham biography and legacy study introduction |
| Expanded evidence layouts not directly matched to their host page | Verified Read reference-beside-quote versus Marked reference-above-quote, including Water or ground: the animals’ origin |
| Panel surfaces not measured as objects | Settings, passage picker, navigation, character profile, both facet panels, theme-story panel, Marked filter, atlas, verse preview, note editor, Details & sources, legacy workspace |
| Note editor and older workspace controls missed | Opened a blank verse-note editor on an already-marked verse and closed it without saving; legacy title/multiline note fields, study tabs, edition selector and text shortcut |
| Category summary examples too narrow | Actual category-tinted variants retained in the galleries, rather than treating orange/blue as the only colors |
| Focus evidence not displayed with choices | Actual search/composer focus screenshots and native disclosure focus screenshots are in D16 |
| Caption ambiguity about search wrapper versus inner field | Main D4 board depicts whole fields/wrappers; its text-size caption uses the inner input. Detailed measurements separately retain wrapper and input values |

## Source-only or untested states

| Item | What is known | Why it has no verified live capture / scope |
|---|---|---|
| Hidden study-library search, evidence query, collection filters and card grid | `src/index.html:21–23`; ancestor hidden at `src/style.css:722`. They remain in source. | Not made artificially visible in the app. They are listed on `source-previews.html`, an unverified inspection sheet, not labeled live UI. The standalone study dialog itself remains reachable by existing deep link and was captured. |
| Note delete/edit icon buttons | `src/passage.js:91`; 32px transparent icon style at `src/style.css:951` overrides earlier color rules around `:892`. | Existing bookmark had no saved note; no note was created merely to expose these controls. No note content was copied. |
| Delete confirmation | Real markup in `src/index.html`, styles `src/style.css:939–943`. | No deletion was initiated. Source-only inspection sheet includes the markup without app scripts. |
| Signed-in sync controls and pairing code | `src/sync.js`; secondary-button style, ordinary code input, sign-in action. | No sign-in, pairing, token creation, sync enablement or revocation performed. Sign-in link itself was photographed. Account-only behavior is not verified. |
| Offline/retry and loading failures | Retry controls generally reuse `.primary`; source handlers reviewed. | Network failures were not forced. A shared visual style does not prove equal behavior. |
| Legacy character-card Details branch | `CharacterCard.tsx` contains a profile-card disclosure branch; current directory renders passage/profile links. | No artificial switch of the live data model. Source-only example on the inspection sheet. |
| Native-only layouts, safe-area rules, on-device AI enablement and device-only controls | Native selectors reviewed in the shared stylesheet. | Web responsive tests do not verify installed iOS/Android rendering, native keyboard, gestures or signed assets. No build/install/release verification was run. |
| Every possible content wrap / number of results | Repeated records and measured size variants are retained. | Finite representative screenshots cannot prove every possible paragraph, language, count or error-state layout. |
| Source-only inspection sheet | `source-previews.html` embeds the existing CSS and small source examples; no app JS or credentials. | Not browser-verified: the browser tool disallows local file URLs. It is not used as a live screenshot or as proof of exact rendering. No alternative browser route was used to bypass that restriction. The final worksheet was checked for asset links, valid script syntax and multi-choice logic using a plain-JavaScript test; local browser rendering was not verified. |

## Important corrections and interpretation rules

- Read chapter paging is restored by `src/style.css:915`, despite an earlier hidden rule at `:722`. It is not classified as dead merely because the earlier rule says `display:none`.
- Moses’ extra outline may be keyboard/route focus. Story-linked outlining is also a route state. Do not standardize away focus feedback as if it were a permanent card border.
- Meaningful category/person colors, disabled states, selected outlines, and ordinary collapsed/expanded states are not automatically inconsistencies.
- A source family can contain responsive, theme, selection and typography variants. The main board shows its representative; the expandable gallery retains every captured appearance. Individual appearances can also be selected in the worksheet.
- CSS line references for original controls come from matched-rule evidence. Newly measured containers have source-selector candidates attached by class/ID; those candidates are labeled and are not assertions that every declaration wins.
- Potentially overridden properties are described in `css-findings.md`; an unmatched selector is not proof of dead code. Vendor Leaflet includes features the app may never instantiate.
- Contrast on translucent/gradient surfaces requires the actual background. Existing flat-fill calculations and gradient estimates remain distinct. An estimate is not a confirmed contrast failure.

## Data / source protection

No app, data, script, worker, package or configuration files changed; no build, commit, push, publish, install, note edit/delete, bookmark change, account connection or cloud-sync action was performed. A public Bible lookup was submitted to expose Chat’s question/answer cards. Browsing, existing-bookmark note-form opening, display-theme testing and viewport overrides were used for inspection only. Theme returned to dark; normal viewport restored; 115% text preserved. Only files under this review folder were created or edited.

Capture QA excluded a full-page fixed-popover crop that showed background instead of the popover, and substituted the verified viewport capture. A clean viewport Commandment card replaced a crop crossed by the fixed header. Original captures are retained for traceability; these are capture artifacts, not proposed UI styles.
