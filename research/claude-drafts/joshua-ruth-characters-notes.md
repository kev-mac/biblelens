# Tier 1 characters, batch C2: Joshua to Ruth cast (2026-10-19)

File: `joshua-ruth-characters-records.json` (15 profiles, `src/data/characters.json` shape).
People: Rahab, Achan (era Conquest); Othniel, Ehud, Deborah, Barak, Jael, Gideon, Abimelech, Jephthah, Samson, Delilah, Naomi, Ruth, Boaz (era Judges).

## Method
- Chosen from the named people with a distinct role in the Joshua, Judges and Ruth story drafts, excluding the 47 existing profiles (Joshua is already published). Facts read in the KJV text from `data/chapters.json` by script; summaries in my own words.
- Every key verse and cited book passes the same existence check as `scripts/characters.mjs`; no ID duplicates an existing profile.

## For Codex
- `era` "Judges" is valid in `validateCharacters` but no profile uses it yet; the Characters UI era filter may need that value added.
- `linked_stories` point to Joshua, Judges and Ruth drafts not yet in `data/stories.json`, so `validateCharacters` will reject them until those stories are merged. Merge the stories first, or strip `linked_stories` to `[]`.
- Adding 15 profiles changes the totals in `scripts/check-characters.mjs`.
- Ruth is placed in era Judges because Ruth 1:1 sets the book in the days when the judges ruled.
- Aliases are limited to spellings in the KJV text (Rachab, Debora, Jerubbaal, Gedeon, Jephthae, Mara, Booz). Jerubbaal for Gideon is at Judges 6:32 and 9:1.

## Judgment calls
- Deborah's lineage lists only her husband; Judges 5 is treated as her song after the victory without assigning authorship beyond the text.
- Jephthah: summary reports the vow and that "he did with her according to his vow" (Judges 11:39) without deciding whether this means sacrifice or dedication.
- Abimelech's mother is "a concubine in Shechem" (unnamed). Gideon's "seventy sons" excludes Abimelech by the text's own listing (Judges 8:30-31).
- Boaz's father Salmon comes from Ruth 4:21 and Matthew 1:5; the 'son of Rahab' link in Matthew 1:5 is reflected in Rahab's key verses but no spouse link is drawn on Rahab, to keep to what Joshua says.
- Not added: Elimelech, Orpah, Manoah, Jotham, Sisera, Eglon, Achsah, Shamgar, Tola and the minor judges (single-episode or no standalone profile).
