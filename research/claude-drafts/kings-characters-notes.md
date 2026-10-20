# Tier 1 characters, batch C4: Kings cast (2026-10-19)

File: `kings-characters-records.json` (14 profiles, `src/data/characters.json` shape, all era Monarchy).
People: Rehoboam, Jeroboam, Ahab, Jezebel, Jehu, Athaliah, Naaman, Hezekiah, Manasseh, Josiah (1 and 2 Kings); Abner, Adonijah, Amnon, Tamar daughter of David (2 Samuel and 1 Kings 1-2).

## Method
- Chosen from the 1 Kings, 2 Kings and 2 Samuel story drafts, excluding the 47 existing profiles and the C1-C3 drafts. Facts read in the KJV text from `data/chapters.json` by script; summaries in my own words.
- Every key verse and book passes the same existence check as `scripts/characters.mjs`. `linked_stories` titles, passages, IDs and routes are built with the `storySlug` rule from the story drafts.

## For Codex
- `linked_stories` point to story drafts not yet in `data/stories.json`; `validateCharacters` rejects them until merged. Merge stories first, or strip `linked_stories` to `[]`.
- Id `tamar-daughter-of-david` avoids the existing `tamar` (Judah's daughter-in-law). Adding profiles changes the total asserted in `scripts/check-characters.mjs`.

## Judgment calls
- Athaliah: 2 Kings 8:26 says daughter of Omri, 8:18 says the wife of Jehoram of Judah was the daughter of Ahab. I list both under parents without reconciling them.
- Jezebel's children: Ahaziah and Joram are listed on the strength of 2 Kings 9:22 ("thy mother Jezebel" to Joram); the text never lists them in one line.
- Manasseh's Babylon captivity and repentance is from 2 Chronicles 33 only; the summary says so.
- Rehoboam, Hezekiah, Manasseh, Josiah carry KJV New Testament spellings (Roboam, Ezekias, Manasses, Josias, Matthew 1) as aliases.
- Jeroboam's wife is unnamed in the text; profile lists "Wife (unnamed)".
- Hezekiah and Josiah are put in era Monarchy, not Prophets, to match C3.

## Not added (next C units)
Ahaziah, Joram, Omri, Jehoshaphat, Joash, Gehazi, Obadiah, Ahijah, Huldah, Hilkiah, Ahithophel, Hushai, Sheba, Asa, Hoshea, Sennacherib, Rabshakeh; then Ezra-Nehemiah-Esther-Job cast, prophets, Gospels and Acts casts.
