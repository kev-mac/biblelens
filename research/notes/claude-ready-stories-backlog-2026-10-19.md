# Stories backlog integration — 2026-10-19

Base: GitHub main `ce8b166`, pulled after the owner confirmed the pending push. Before that pull, canonical source and freshly opened Sites source matched build 260, fingerprint `36535eb453f6bb341ad34bbd8306e5be12ff5242564f8c61cc4ea726853797c6`. The canonical commandment changes in ce8b166 are retained. This release handles Stories only; it does not integrate second-pass evidence, Tier 1 characters, or academic timeline cards.

Reviewed all 254 supplied entries in the 28 story drafts after Exodus: accept 197 unchanged, correct 36, hold 21. Added 233 stories to the original 25 Genesis and 18 Exodus stories: **276 total in 30 books**. Genesis and Exodus objects and all 47 existing character profiles/anchors remain unchanged. No exhaustive chapter coverage claim follows from these numbers.

Each book has adjacent `claude-ready-<book>-stories-2026-10-19.md`, `-decisions.json` and `-quote-checks.json`, including the original draft SHA-256. Every original passage and cross-reference, including held entries, has canonical book, chapter/verse bounds and ordered ranges checked against packaged text. Corrected ranges receive the same checks. Quote checks preserve exact KJV review context; the story summaries are paraphrases, not verbatim quotations or historical corroboration. Themes on new stories are reproducible outputs of `scripts/story-topics.mjs`.

Narrative-only judgments retain narrated visions, retrospective accounts, and narrative parables explicitly framed as stories Jesus tells. They exclude standalone law collections, administrative/genealogical registers and teaching blocks. Mixed entries are narrowed where the draft supplies a usable narrative component. Three duplicate Mark titles are qualified to retain unique global DOM slugs without changing existing story routes.

## Decisions by book

| Book | Accepted | Corrected | Held | Added |
| --- | ---: | ---: | ---: | ---: |
| Leviticus | 3 | 0 | 8 | 3 |
| Numbers | 13 | 2 | 2 | 15 |
| Deuteronomy | 1 | 5 | 4 | 6 |
| Joshua | 11 | 1 | 0 | 12 |
| Judges | 10 | 0 | 0 | 10 |
| Ruth | 4 | 0 | 0 | 4 |
| 1 Samuel | 10 | 1 | 0 | 11 |
| 2 Samuel | 8 | 2 | 0 | 10 |
| 1 Kings | 11 | 1 | 0 | 12 |
| 2 Kings | 11 | 2 | 0 | 13 |
| 1 Chronicles | 6 | 0 | 2 | 6 |
| 2 Chronicles | 10 | 1 | 0 | 11 |
| Ezra | 5 | 1 | 0 | 6 |
| Nehemiah | 4 | 3 | 0 | 7 |
| Esther | 5 | 0 | 0 | 5 |
| Job | 4 | 0 | 0 | 4 |
| Isaiah | 3 | 1 | 0 | 4 |
| Jeremiah | 6 | 1 | 0 | 7 |
| Ezekiel | 3 | 2 | 1 | 5 |
| Daniel | 5 | 2 | 0 | 7 |
| Hosea | 0 | 1 | 0 | 1 |
| Amos | 1 | 0 | 0 | 1 |
| Jonah | 2 | 1 | 0 | 3 |
| Matthew | 14 | 1 | 4 | 15 |
| Mark | 8 | 4 | 0 | 12 |
| Luke | 12 | 0 | 0 | 12 |
| John | 12 | 2 | 0 | 14 |
| Acts | 15 | 2 | 0 | 17 |

## Needs owner

- Sign Acts of the Siege (Ezekiel 4:1 - 5:17): Predominantly instructions for symbolic actions; the supplied summary turns the commands into completed actions. Held under the owner’s narrative-only scope.
- The Sermon on the Mount (Matthew 5:1 - 7:29): Standalone instructional discourse, despite its brief narrative frame. Held under the owner’s narrative-only scope.
- Parables of the Kingdom (Matthew 13:1 - 13:58): A collection of kingdom teachings; no discrete narrative plot is summarized by this entry. Held under the owner’s narrative-only scope.
- Teaching on Forgiveness and Greatness (Matthew 18:1 - 18:35): Instruction on greatness, discipline and forgiveness; do not publish its inaccurate seventy-seven paraphrase of Matthew 18:22. Held under the owner’s narrative-only scope.
- Teaching in the Temple and the Olivet Discourse (Matthew 22:1 - 25:46): Temple teachings and the Olivet discourse; do not present the whole teaching block as a story. Held under the owner’s narrative-only scope.
- Purity, Nazirites and the Priestly Blessing (Numbers 5:1 - 6:27): Purity, Nazirite and blessing instructions. Held under the owner’s narrative-only scope.
- Borders, Levitical Cities and Cities of Refuge (Numbers 33:50 - 35:34): Boundary and city-of-refuge instructions; no completed allocation is narrated in this range. Held under the owner’s narrative-only scope.
- Offerings at the Tabernacle (Leviticus 1:1 - 7:38): Sacrificial instructions, not a narrated episode. Held under the owner’s narrative-only scope.
- Clean and Unclean Animals (Leviticus 11:1 - 11:47): Dietary law, not a narrated episode. Held under the owner’s narrative-only scope.
- Purity After Childbirth, Skin Disease and Mold (Leviticus 12:1 - 15:33): Purity instructions, not a narrated episode. Held under the owner’s narrative-only scope.
- The Day of Atonement (Leviticus 16:1 - 16:34): Annual ritual instructions; the narrated death of Aaron’s sons is covered separately. Held under the owner’s narrative-only scope.
- Holiness Laws (Leviticus 17:1 - 22:33): A collection of holiness laws. Held under the owner’s narrative-only scope.
- The Appointed Festivals (Leviticus 23:1 - 23:44): Calendar and festival instructions. Held under the owner’s narrative-only scope.
- The Sabbath Year and Jubilee (Leviticus 25:1 - 25:55): Land tenure and Jubilee laws. Held under the owner’s narrative-only scope.
- Blessings and Curses (Leviticus 26:1 - 27:34): Covenant sanctions, vows and tithing instructions. Held under the owner’s narrative-only scope.
- Genealogies from Adam (1 Chronicles 1:1 - 9:44): Genealogical register rather than a story. Held under the owner’s narrative-only scope.
- Organizing the Levites, Priests and Officers (1 Chronicles 23:1 - 27:34): Administrative divisions and personnel lists rather than a discrete story. Held under the owner’s narrative-only scope.
- The Ten Commandments and the Shema (Deuteronomy 5:1 - 6:25): Restated commandments and teaching. Held under the owner’s narrative-only scope.
- Laws for Life in the Land (Deuteronomy 12:1 - 26:19): A long law collection. Held under the owner’s narrative-only scope.
- Blessings and Curses of the Covenant (Deuteronomy 27:1 - 28:68): Instructions and covenant sanctions. Held under the owner’s narrative-only scope.
- Renewal of the Covenant in Moab (Deuteronomy 29:1 - 30:20): Covenant exhortation and promises rather than a discrete narrated episode. Held under the owner’s narrative-only scope.

These scope holds can remain held without blocking the release. Include them only if the owner expands Stories beyond its current scope. The previously held Exodus Instructions for the Tabernacle remains held. The era decision for the Exile/Return cast, Jesus’s character-profile framing and Gallio are unchanged and outside this story batch.

## Validation and release

Targeted story, topic and character checks pass, including all 47 profiles and their existing story destinations. The worktree initially lacked node_modules; its package-lock matched the canonical checkout exactly, so the existing canonical dependency directory was reused without changing package metadata. The separate review audit passes: 254 entry decisions, 657 original/corrected reference checks and 1,762 exact packaged KJV context snapshots. It also verifies every draft hash, approved catalog contents, reproducible themes, all 43 preserved original stories and all 47 character profiles.

Build 261 is reserved for the shared source release. Executed publication, full checks, signed-native asset comparison, installation availability and release verification will be recorded below. No publication or native installation is claimed by this pre-release checkpoint.

People-page completion was preserved in the named stash `People page completion in progress before Claude stories integration`; its unfinished data is excluded from this release. Existing stashes, research drafts, the chapter ledger and research control files are preserved.
