**TL;DR:** BibleLens has a recognizable shared style, but controls that do the same job have drifted in size, corners and feedback. Some differences are useful—category colors and the Chat send arrow—while others make controls harder to recognize or tap. Decide whether to standardize the shapes now or make a smaller accessibility pass first. I recommend consistent, roomier controls while keeping meaningful colors. No app files were changed, and nothing was built or published.

Reviewed all requested pages and reachable Timeline/Places, **dark/light at 1280px and 375px**, on live build **241**. Settings and Places are panels. Live CSS matches this checkout and GitHub main; the stale local build **235** was excluded. Browser review only.

**Counts** refer to tested content; “styles” means control families, with repetitions in the [inventory](inventory.html). Every choice is reversible without migrating notes. P1/P2 notes describe compatibility, not a P2 design.

### D1 — Find text / compose a question: inconsistent, partly intentional

Stories and Timeline searches have 12px corners; Characters and Commandments have 25px outer pills. Characters has **no icon**. Commandments has a magnifier. Chat has a pill containing a **send arrow**, which submits a question rather than filtering a list. Inner inputs are 34px high inside larger wrappers; measure the wrapper when comparing shapes.

| Choice | Appearance and scope | Benefit | Risk | Fit / undo |
|---|---|---|---|---|
| **A — recommended** | Four search pages / four search boxes: 48px high, 12px corners, 16px text, magnifier. Keep Chat's composer and arrow. | Recognizable search pattern; strong distinction from asking Chat. | Characters and Commandments lose their pill silhouette. | P1 strong; P2 compatible. Yes. |
| B | Make Stories and Timeline match the existing pill searches: two pages / two boxes; preserve existing icon choices. | Smallest visual change. | Icon and focus differences remain unless separately addressed. | Both strong. Yes. |

Keyboard testing found four different cues: Stories has a 3px cyan outline, Commandments a 2px teal outline plus wrapper ring, Characters a subtle wrapper shadow, and Chat a 3px rust outline. Characters' missing input outline is compensated by its wrapper; it is **not** wholly missing focus.

### D2 — Select filters: inconsistent; colors intentional, geometry mostly accidental

Actual quick-filter buttons: Characters **1 × 44px pill**, Commandments **3 × 48px / 24px radius**, Prophecies **10 × 44px pills**, Timeline **1 × 26.4px pill**. Dialog filters add Commandments **25 × 48px pills**, Prophecies **10 × 48px / 8px radius**, and Marked **8 × 44px category tiles**. Read's seven category icons are a separate, space-constrained toolbar.

| Choice | Appearance and scope | Benefit | Risk | Fit / undo |
|---|---|---|---|---|
| **A — recommended** | Shared 48px minimum, 14px text; pills for quick filters and softly rounded tiles for dialog grids. Covers five pages / 58 filter buttons in these states. | Consistent touch size without flattening the useful grid/toolbar distinction. | Taller filter panels and more scrolling. | Both strong. Yes. |
| B | Keep page-specific shapes; enlarge only Timeline's one undersized quick filter to 44px. One page / one button. | Minimal disruption. | Leaves the other cross-page differences. | P1 strong; P2 neutral. Yes. |

Preserve the Women button's pink cue and taxonomy colors. Selected state should also have an outline/check, since color alone is weak feedback. Stories' **125 theme chips** are related-story navigation, not toggles: they open a theme panel and have no pressed state. Their 36px height needs the same touch-size decision as reference chips below.

### D3 — Open a passage / preview a reference: inconsistent, with an intentional behavior distinction

Direct passage controls in the tested listings: Stories **25**, Characters **44**, Commandments **61**, Prophecies **6**, Timeline **10**. Stories uses 38px pills, Characters 48px / 18px corners, Commandments 48px / 24px corners, Prophecies 44px / 14px corners, Timeline 48px links with square corners. Abraham’s profile adds **13** direct verse links with 48px height / 10px corners. All lead to reading. Preview citations are separate: seven ~36px Stories pills, plus compact Read/Marked/Chat chips.

| Choice | Appearance and scope | Benefit | Risk | Fit / undo |
|---|---|---|---|---|
| **A — recommended** | Direct passages: 48px, 18px corners, 14px text. Changes **115 buttons/links on five pages**, including Abraham’s profile; Characters’ 44 directory buttons already match. Preview/topic chips: 44px pills across Read, Stories, Marked and Chat (four citation styles plus Stories' theme style; repeat counts vary with expansion). | Same destination looks familiar; previews stay distinguishable. | Stories cards grow, especially their 125 theme chips. | Both strong. Yes. |
| B | Keep all page-specific corners; increase only undersized reference/topic targets to 44px. Affects the Stories, Read, Marked and Chat chip styles. | Preserves page character and reduces rework. | Users still encounter different passage silhouettes. | P1 strong; P2 compatible. Yes. |

Direct passages open Read; citations additionally support hover/focus previews and long-press/context menus. Explicit preview chips can preview on click. Chat's inline verse links intentionally remain plain text.

### D4 — Expand details: inconsistent; different depths intentional

Marked's **seven category rows are about 47px tall with chevrons**, not 28px text links. Commandments' source/passsage rows are 44px. The 28 × 28 controls are the **inner** expand/inspect buttons shared by Read, Marked and Chat. Timeline uses both 44px and 48px History buttons. Its sources summary is only about 21px tall.

| Choice | Appearance and scope | Benefit | Risk | Fit / undo |
|---|---|---|---|---|
| **A — recommended** | Keep plain expandable rows; provide 44px targets and visible chevrons consistently. Four pages / six inner-expand, inspect and sources-summary styles. | Easier touch use; preserves content hierarchy. | More space inside evidence cards. | Both strong. Yes. |
| B | Standardize whole rows at 48px and make the whole summary activate on one click. Adds Commandments: five pages / eight disclosure styles. | Clear, forgiving activation. | Changes existing selection/double-click expectations. | Both strong. Yes. |

Read/Marked/Chat summary text currently expands on **double-click/double-tap**, or Enter/Space when focused; its chevron expands on a single activation. Native `<summary>` rows use a single click or Enter/Space. This is a real behavioral difference. Native rows and focusable summary panels showed Chrome's default focus outline, rather than the app's custom ring; no wholly absent keyboard ring was found in these tested states.

### D5 — Choose a value: mostly consistent; sizes and picker modes differ

Visible dropdowns are in **Stories (2)** and **Settings (3)**, plus translation in the passage picker (1) and two conditional Marked commandment dropdowns. Stories uses 44px height, Settings' two font selectors 42px and its position selector 44px; all have 12px corners. Marked uses a separate 10px rule. Older Read study-library dropdowns exist in source but the whole library is hidden by `src/style.css:722`; they are **not reachable visible controls**.

| Choice | Appearance and scope | Benefit | Risk | Fit / undo |
|---|---|---|---|---|
| **A — recommended** | 48px height and 12px corners for all eight dropdowns across four host surfaces. Enlarge chapter/verse number targets to 44px. | One comfortable size; fixes small picker targets. | Longer picker grids/settings. | Both strong. Yes. |
| B | Preserve current dropdown appearance; enlarge only the two 42px font selectors to 44px and picker hit targets. Two host surfaces; two dropdowns plus the two number-grid styles. | Smaller visual change. | Other sizing differences remain. | P1 strong; P2 neutral. Yes. |

At 375px, passage-picker steps are 36px, testament buttons 38px and number cells about **32.6px square**. Native dropdowns support native keyboard selection; picker steps are ordinary buttons, not arrow-key tabs. Selecting a filter in Commandments/Prophecies applies immediately; Marked has draft choices plus **Apply filters**. Preserve or clearly explain that distinction.

### D6 — Navigation / icon actions: consistent chrome, inconsistent targets

The shared eight header shortcuts are identical across pages apart from active glow. They measure 34px square on desktop, **26 × 40px on phone**. The header’s changing text label also has a short hit area and opens navigation; the small BL mark is in the footer. The navigation panel has ten labeled tiles. Close buttons elsewhere vary from approximately 23 × 26px in Marked's filter panel to 40px in Settings/verse previews, 44px in navigation and 48px in the atlas. Chat Send is 40px; floating Book/New Chat controls are 58px.

| Choice | Appearance and scope | Benefit | Risk | Fit / undo |
|---|---|---|---|---|
| **A — recommended** | Use the labeled navigation panel on phones; give all close/send actions 44px targets. Shared header on all nine routed pages + seven undersized close/send styles. | Solves crowding and improves discovery. | Adds a tap when switching pages on phone. | Both strong. Yes. |
| B | Keep all eight visible shortcuts; use a horizontally scrollable 44px-target strip, and enlarge the same seven undersized action styles. | Keeps direct shortcuts. | Some destinations move offscreen; scroll discoverability. | Both compatible. Yes. |

### D7 — Reset / primary actions: inconsistent, mostly accidental

Reset buttons share the global pill skin but vary in height and text: Stories/Commandments 37px on desktop; Characters at least 44px when visible; Prophecies 44px; Marked's floating Filter approximately 36.5px. Phone media rules enlarge some ordinary buttons, but not all icon/special controls. Settings’ Sign in link is only about 21px tall. Clear filters, Apply filters and Show results also have different effects despite similar emphasis.

| Choice | Appearance and scope | Benefit | Risk | Fit / undo |
|---|---|---|---|---|
| **A — recommended** | Give reset/filter/apply actions a shared 44px minimum; make Apply/Show results visually primary and Reset secondary. Five pages plus Settings / nine reset, filter, completion and sign-in styles. | Better hierarchy and fewer accidental resets. | Requires agreeing which actions deserve emphasis. | Both strong. Yes. |
| B | Enlarge only small targets; retain current equal-weight pills. Same five pages plus Settings / nine styles; only undersized instances change. | Smaller scope. | Main action remains harder to find. | P1 strong; P2 compatible. Yes. |

### Tabs, switches and remaining accessibility / CSS findings

**Intentional and internally consistent:** Characters’ 48px Overview/Connections tabs expose selected state; their code supports ArrowLeft/Right/Home/End. Settings' Categories switch exposes checked state, while its Light/dark button uses pressed state; these are different jobs and should stay distinct. The Categories switch itself is only 40px tall. Color-coded category icons and place-name chips carry useful meaning; keep that meaning through either look.

**Accessibility:** Light dropdown text is **4.46:1**; Commandments' light source disclosure is **4.19:1**, both below 4.5:1. Font size is 11.2px for Prophecies' prediction/fulfillment labels and taxonomy badges (labels, not buttons), 11px for Leaflet attribution, 10px for Read's count badges, and 11.2px for family-chip qualifiers. Gradient contrast estimates are **not confirmed failures**; faint light-mode expand/inspect icons need checking. Characters' wrapper-only focus cue is easy to miss; summary rows rely on browser focus styling. Phone height/width warnings appear in the appendix; these are your requested 44px usability flags, not an automatic claim that each violates WCAG.

**D8 — shared foundation and CSS drift:** The [CSS appendix](css-findings.md) identifies the conflicting rules.  **A (recommended):** after choosing the groups above, consolidate their competing declarations and give all interactive controls, native summaries and focusable summary panels one clearly visible focus cue; set small supporting text to at least 12px while preserving required map attribution. Scope: one shared stylesheet, all nine routed pages plus Settings/Places; no intended content changes. Benefit: reduces future drift; risk: broad regression testing is needed. **B:** patch only the listed accessibility issues and leave the cascade intact. Scope: the named shared/page control families; benefit: smaller immediate change; risk: new overrides can continue the drift. Both are reversible; A suits P1 and P2 equally, B suits P1 and can carry forward to P2.

### Appendix and limits

[Full inventory, screenshots, selectors, source lines and per-group counts](inventory.html). [Raw measurements](measurements.json), [additional expanded states](supplemental.json), [targeted picker/filter states](targeted.json), [ready character profiles](profiles.json), [keyboard/hover evidence](behaviors.json), [summary focus evidence](focus-tests.json). The inventory contains screenshots, computed geometry/colors/icons, selectors and matching source lines for every recorded variant.

Only disposable browser preferences/filters changed. No notes, bookmarks or cloud data changed. Signed-in/pairing/revocation, existing-note/delete, forced-error and every possible content-wrap state were not tested. Hidden legacy controls are labeled as hidden; CSS findings do not establish dead code in native/authenticated states.

**Decision list (answer in one line): D1 A/B, D2 A/B, D3 A/B, D4 A/B, D5 A/B, D6 A/B, D7 A/B, D8 A/B.** My recommendation is **D1 A, D2 A, D3 A, D4 A, D5 A, D6 A, D7 A, D8 A**. No implementation will begin before your answer.
