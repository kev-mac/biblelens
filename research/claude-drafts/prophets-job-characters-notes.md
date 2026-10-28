# Tier 1 characters, batch C6: prophets, Judah's last kings and Job's friends (2026-10-19)

File: `prophets-job-characters-records.json` (17 profiles, `src/data/characters.json` shape).
People: Isaiah, Ahaz, Sennacherib (Isaiah, 2 Kings); Jeremiah, Baruch, Hananiah son of Azur, Zedekiah, Ebed-melech (Jeremiah); Ezekiel; Hosea, Gomer; Amos, Amaziah the priest of Bethel; Eliphaz, Bildad, Zophar, Elihu (Job).

## Method
- Chosen from the Job, Isaiah, Jeremiah, Ezekiel, Hosea and Amos story drafts, excluding the 47 existing profiles and the C1-C5 drafts (Job is already a profile). Verses read from the KJV text in `data/chapters.json` by script; summaries in my own words.
- All key verses and book names pass the same existence check as `scripts/characters.mjs` (run on this file, 0 failures). `linked_stories` IDs and routes are built with the `storySlug` rule from the story drafts.

## For Codex
- `linked_stories` point to story drafts not yet in `data/stories.json`; `validateCharacters` rejects them until merged. Merge stories first, or strip `linked_stories` to `[]`.
- Adding profiles changes the total asserted in `scripts/check-characters.mjs`.
- Id `hananiah-son-of-azur` and `amaziah-priest-of-bethel` avoid clashes with other Hananiahs and Amaziahs (2 Kings 14 king).

## Judgment calls
- Era: Isaiah, Jeremiah and the other prophets and Jeremiah's circle are `Prophets`; Ahaz, Sennacherib, Zedekiah are `Monarchy` (as Hezekiah in C3); Job's friends and Elihu `Wisdom` (as Job).
- Gomer: Hosea 3 does not name the woman; the summary says so.
- Eliphaz: the Edomite Eliphaz of Genesis 36:11 is mentioned only as a possible link, not asserted. Home towns of the friends and Elihu are given as the gentilics the text uses, not as places.
- Jeremiah's `tribe` "Levi (priestly family)" is inferred from "of the priests" in Jeremiah 1:1; Ezekiel's likewise from "the priest".
- Isaiah's wife is "the prophetess" (Isaiah 8:3) and the text does not say she is his wife; I list her as spouse (unnamed) following the common reading, flagged here. Codex may drop it. Mahershalalhashbaz is her son in the same verse.
- Sennacherib: the Isaiah account (36-37) is followed; 2 Kings 18:14-16 tribute is a key verse for contrast. Sons are from Isaiah 37:38.
- Pashur (Jeremiah 20) and Shearjashub were left out of the cast.

## Not added (next C units)
Pashur, Johanan, Gedaliah, Jehoiakim, Jehoiachin, Nebuzaradan, Rabshakeh, Uzziah, Pekah, Rezin, Jeroboam II, Hilkiah, Shaphan, Ahikam; then the Gospels and Acts casts.
