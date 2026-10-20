# Tier 1 characters, batch C5: Ezra, Nehemiah, Esther, Daniel and Jonah cast (2026-10-19)

File: `ezra-daniel-characters-records.json` (14 profiles, `src/data/characters.json` shape, all era Prophets).
People: Cyrus, Zerubbabel, Ezra, Nehemiah, Sanballat (Ezra-Nehemiah); Vashti, Ahasuerus, Esther, Mordecai, Haman (Esther); Daniel, Nebuchadnezzar, Belshazzar (Daniel); Jonah.

## Method
- Chosen from the Ezra, Nehemiah, Esther, Daniel, Jonah, 2 Kings, Jeremiah and 2 Chronicles story drafts, excluding the 47 existing profiles and the C1-C4 drafts (no id clashes).
- Facts read in the KJV text from `data/chapters.json` by script; summaries in my own words. Every key verse and book passes the same existence check as `scripts/characters.mjs`. `linked_stories` IDs, passages and routes are built with the `storySlug` rule from the story drafts.

## For Codex
- `linked_stories` point to story drafts not yet in `data/stories.json`; `validateCharacters` rejects them until merged. Merge stories first, or strip `linked_stories` to `[]`. The total asserted in `scripts/check-characters.mjs` changes when profiles are added.

## Judgment calls
- Era: the validator has no exile-and-return era, so all fourteen use Prophets (as for Elijah, Elisha). See owner-questions.md.
- Ahasuerus: no Xerxes alias, since the name is not in the KJV text; the identification is outside the data. Daniel 9:1 names a different Ahasuerus (father of Darius the Mede); this profile covers the Esther king only.
- Zerubbabel: "son of Shealtiel" (Ezra 3:2, Haggai 1:1) beside 1 Chronicles 3:19 (sons of Pedaiah); only Shealtiel is listed as parent, the tension is stated in the summary. Sheshbazzar (Ezra 1:8) is not identified with him.
- Mordecai: Esther 2:6 can be read as Mordecai or Kish having been carried away with Jeconiah; the profile avoids saying which. A different Mordecai appears in Ezra 2:2, and a different Nehemiah (Ezra 2:2, Nehemiah 3:16); not these profiles.
- Esther: tribe left blank; Benjamin is inferred only through Mordecai's family.
- Belshazzar: Daniel calls Nebuchadnezzar his father; the profile quotes the text's wording rather than settling whether this means ancestor.
- Sanballat: his daughter is not named; Nehemiah 13:28 says a son of Joiada was his son-in-law.
- Nebuchadnezzar and Jonah link story drafts across several books (2 Kings, Jeremiah; Jonah's own three).

## Not added (next C units)
Jeshua, Tobiah, Geshem, Mordecai's namesake, Artaxerxes, Darius the Mede, Shadrach, Meshach, Abednego, Zeresh, Hanani, Elihu, Bildad, Eliphaz, Zophar, then prophets (Isaiah, Jeremiah, Ezekiel, Hosea, Amos and others), Gospels and Acts casts.
