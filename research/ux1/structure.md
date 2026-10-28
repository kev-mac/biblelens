# UX1 structure audit

Source: RC1 0c05b7f, build 276. Reference: ~/git/mockups/explore-v3/.
Scope: local codex/ux1 only. No external source synchronization or publication.

## Before: production screen inventory

| Screen / route family | Entry points | Purpose / overlap |
| --- | --- | --- |
| Explore (#discover, home) | First launch, tab, menu | Daily Big Question, nine sample rails, reader continuation, starter studies and tool links. Duplicates collections and Questions. |
| Read (#read, #read/book/chapter/verse) | Tab, passage links, legacy #explore | Full Bible chapters, editions, evidence, people/place chips, verse actions, notes, bookmarks and highlights. |
| Chapter picker | Chapter heading | Book, chapter and verse selection in one sheet. |
| Verse preview / actions | Number, keyboard Enter, long press | Copy, link, note, bookmark, ask. Text tap was missing. |
| Highlight palette/menu | Text selection / saved highlight | Save selected text and edit its color or remove it. |
| Passage tools / note editor | Reader controls | Chapter notes, selection copy and chapter bookmarks. |
| Evidence (#evidence[/category], #categories, legacy #saved) | Menu, Explore tools, reader categories | Book/chapter/topic filters and research cards. |
| Big Questions (#questions, #debates aliases) | Tab, daily hero, menu, research cards | Mixed accepted headline questions and paged legacy research, with mode/status/tag filters. |
| Question detail (#debate/id) | Question cards, reader evidence | A/B texts or source discussion, summaries, limits, sources, save, choice prompt. |
| Starter study (#study/id) | Read library, Explore, search | Six passage comparisons, perspectives, sources, notes and bookmarks in one sheet. |
| Compare / investigation (#compare, #investigation/id) | Reader, Explore, notebook | Parallel passages, editions, private comparison notes, save/resume. |
| Search (#search?q=) | Explore field, keyboard shortcut | Scripture, research, stories, people, places and private notes. |
| Ask the text (#chat) | Search, menu, verse actions | Local/library question answering, source previews and answer details. |
| Notebook (#notebook?section= / ?note=) | Tab, Settings, menu | Notes, saved questions, bookmarks, comparisons; exports and backups. |
| Bookmarks (#bookmarks) | Menu, old links | Redirects to notebook bookmarks; duplicate entry. |
| People (#people, #characters[/id], #characters/card/id) | Menu, rail, search, text chips | Searchable directory, inline sections, full profile sheet, families, stories and sources. |
| Places (#places) | Menu, rail, search, chips | Directory with geography, sources and map sheet. |
| Stories (#stories[/book/title]) | Menu, rail, reader, search | Search/filter stories, read verses, related story themes in a sheet. |
| Commandments (#commandments?code=) | Menu, rail, research filters | All laws with topics, source verses and context. |
| Timeline (#timeline?event=) | Menu, two rails, search | Dates, event cards, reviewed history, sources. |
| Prophecies (#prophecies) | Menu, Explore tools | Search/filter prophecy records, contexts and sources. |
| Method & Sources (#method) | Footer, menu | Method, taxonomy, licenses and source descriptions. |
| Settings / sync / version | Masthead gear; #sync | App-wide typeface, text size, theme, reader options, backups, private sync, pairing/revocation, version identity. |
| Supporting sheets/popovers | Sources, text references, map controls | Contextual details; close restores opener. Not separate navigation levels. |

## After: four tabs and at most two levels below each

| Tab | Purpose | Level 1 | Level 2 / inline tasks |
| --- | --- | --- | --- |
| Read | Find and read a chapter. | Chapter picker; compare passages; starter studies | Verse actions, notes, bookmarks, highlights, evidence, reference/source previews; all within current workspace. |
| Explore | Find a person, place, story or study topic. | The Bible: People, Places, Stories, Commandments. Study: Science, History & Timeline, Lost in Translation. | Selected person, place, story, law or research record. Family/reference jumps replace the current detail. |
| Questions | Explore 30 Big Questions. | Selected question | Passages, limits and sources expand in that detail; saving stays here. |
| Saved | Return to private notes and saved items. | Notes, saved questions, bookmarks, comparisons; Settings button | Open saved item replaces the workspace under its owning tab; backup/export and sync remain inline tasks. |

Search is the top-right icon on all tabs. It keeps the originating tab highlighted.
Search suggestions expose Ask the Text. Search results link to all existing collections.
Settings remains directly available through the gear and a labeled button in Saved.
The footer retains Method & Sources. No accepted feature requires the old Menu.

People opens a compact list of names. A full-row target opens the existing profile
sheet, keeping biography, family, stories, verses and sources together.

Explore has exactly two horizontal swipe rows, seven tiles and real corpus counts.
No daily question, example cards, starter study rail or secondary tools occur there.
Study lists retain all research filters and pagination. Their visible headings name
Science, History & Timeline or Lost in Translation, rather than Big Questions.
Timeline, Prophecies, all text studies and the reader's starter studies are linked
from those lists. Other collections replace the current list as sibling workspaces;
they do not add another breadcrumb level. Starter studies also remain in Read
as a labeled disclosure below the chapter. Prophecies is folded into Study; it has no gallery tile.
Questions has only accepted B01–B30 cards. Their references are visible; IDs remain
in data. Lists and details keep the existing #questions and #debate/headline routes.

## Question order

B25, B17, B16, B01, B26, B18, B08, B02, B27, B19, B13, B03, B28, B20, B14, B04, B29, B21, B09, B05, B30, B22, B10, B06, B23, B11, B07, B24, B12, B15.

The opening cycles history, science, meaning and wording. All 30 occur once.
The source records, labels, scholarly limits and internal IDs are unchanged.

## Merges, removals and compatibility

- Folded daily hero, sample rails and duplicate starter question cards into their owning collections.
- Questions list no longer combines headline cards with thousands of research records.
- Notebook is labeled Saved; its existing routes, notes and exports remain intact.
- Bookmarks continues redirecting to Saved's bookmarks filter.
- Legacy #explore chapter links still redirect to #read. Explore's route remains #discover.
- #debates redirects to #questions; #categories and legacy #saved retain evidence redirects.
- Removed choice prompts, event handlers and draft-only choice map. Save remains.
- Existing device stance keys stay readable/importable/exportable in debate-store.js;
  no user data is deleted, migrated into sync or published.
- Every non-tab page receives back navigation and a breadcrumb. History-aware Back
  returns to its actual opener; direct links fall back to their owning tab.
- Sheets have back/close controls and breadcrumb context, and restore their opener.
- Focus uses keyboard-only 2px accent rings. Warm accent colors exceed 3:1 against
  light and dark paper/surface colors, including outside each image tile.
- Verse text taps use the same menu as number taps, preserving links and selection.

## Verification

See .review/ux1/ for both phone sizes, engines and themes, for screenshots. Check logs are in ~/git/codex-reports/UX1-logs/.
The browser child-path test navigates chapter picker, People and Big Questions
using visible controls. This is an interaction review, not a study with children.
Build 276 is retained. Production www is rebuilt after any draft verification.

Final verification: 104 production screenshots cover every tab, horizontal tile
positions, chapter selection, person details, question details, saved items and
verse actions. All eight www phone/theme/engine combinations passed.
The strict new-copy audit averages grade 6.73 with no sentence or jargon failures.
The full legacy readability audit remains report-only; its existing content
backlog is unchanged. A concurrent security run timed out during startup; an
isolated diagnostic and the complete isolated UI rerun both passed.
