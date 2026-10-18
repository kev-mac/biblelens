# Stories batch notes (2026-10-18)

Drafts: one `{book}-stories.json` per book, 29 books and 273 stories in total (Genesis is already in data/stories.json). Every passage and cross-reference was checked against data/chapters.json (book, start verse, end verse and order). `topics` is empty everywhere for Codex's tagger.

Books skipped on purpose, per the owner's narrative-only rule: Psalms, Proverbs, Ecclesiastes, Song of Solomon, Lamentations, and the epistles and Revelation (no narrative units). Minor prophets with no narrative (Joel, Obadiah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi) have no file. Job, Isaiah, Jeremiah, Ezekiel, Daniel, Hosea and Amos hold only their narrative sections.

Judgment calls for Codex or the owner:
- 1 Chronicles 1-9 genealogies and the 2 Kings/Chronicles list-like entries are summaries of lists, not stories; drop them if the Stories page should be strictly narrative.
- Gospel entries overlap across Matthew, Mark, Luke and John; cross_references point to the parallels.
- Some entries group a long block (e.g. Leviticus 17-22, Deuteronomy 12-26) because the text is instruction rather than narrative.
- scripts/check-stories.mjs currently asserts Genesis-only behavior (catalog[0], Exodus shows 'No stories match') and will need updating.
