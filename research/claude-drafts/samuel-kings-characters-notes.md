# Tier 1 characters, batch C3: Samuel and David cast (2026-10-19)

File: `samuel-kings-characters-records.json` (15 profiles, `src/data/characters.json` shape).
People: Hannah, Eli, Samuel (era Judges); Saul, Jonathan, David, Michal, Abigail, Bathsheba, Nathan, Absalom, Joab, Solomon, Mephibosheth, Uriah (era Monarchy).

## Method
- Chosen from people with a distinct role in the 1 Samuel, 2 Samuel and early 1 Kings story drafts, excluding the 47 existing profiles. Facts read in the KJV text from `data/chapters.json` by script; summaries in my own words.
- Every key verse and cited book passes the same existence check as `scripts/characters.mjs`; no ID duplicates an existing profile. `linked_stories` titles and passages match the drafts exactly.

## For Codex
- `linked_stories` point to 1 Samuel, 2 Samuel and 1 Kings drafts not yet in `data/stories.json`; `validateCharacters` rejects them until merged. Merge stories first, or strip `linked_stories` to `[]`.
- Adding 15 profiles changes the totals in `scripts/check-characters.mjs`.

## Judgment calls
- Samuel, Eli and Hannah are era Judges (1 Samuel 4:18; 7:15). Samuel could also sit under Monarchy; flag if the owner prefers.
- Saul's sons: Ishui is listed at 1 Samuel 14:49 and Abinadab at 31:2; I list both without asserting they are one person.
- Meribbaal (1 Chronicles 8:34) is given as an alias of Mephibosheth, and Chileab as Daniel (1 Chronicles 3:1) in Abigail's profile; both are standard readings of parallel lists, not stated in so many words. Bathsheba's father Eliam is Ammiel in 1 Chronicles 3:5.
- Michal and Mephibosheth summaries keep to the text: no motive given beyond "despised him in her heart"; the Ziba/Mephibosheth dispute is reported as two accounts.
- Not added (next C unit, Kings cast): Ahab, Jezebel, Jeroboam, Rehoboam, Naaman, Jehu, Athaliah, Hezekiah, Josiah, and from Samuel: Amnon, Tamar, Abner, Ahithophel, Adonijah, Hophni and Phinehas, Goliath.
