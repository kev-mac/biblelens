# 1 Kings second pass (workstream D19), 2026-10-18

First-time reading of the 6 chapters with no published record: 1, 2, 3, 12, 17, 21 (the ledger lists six; the queue said seven). All 6 read in full in the KJV (`data/chapters.json`). Hebrew (WLC via bolls.life) and Brenton's Greek and English (ebible.org) were fetched by script; the Hebrew and Greek in the records are copied from the fetched text. Brenton prints the Naboth story as chapter 20 (its chapter 21 is the Ben-hadad war); the verse numbers inside it match the KJV. All records are drafts until Codex accepts them.

## Issued (11 records, `1-kings-second-pass-records.json`; all T, witness Septuagint, status Context, none V)

- `people-piped-with-pipes-or-danced-in-choirs-1-kings-1-40-greek` (1:40): Hebrew pipes, Greek danced in choirs; scope says both could happen.
- `that-thou-mayest-prosper-or-that-thou-mayest-understand-1-kings-2-3-greek` (2:3): printed words only; the Hebrew verb not glossed.
- `blood-of-war-on-his-girdle-or-innocent-blood-on-his-girdle-1-kings-2-5-greek` (2:5, second occurrence): Hebrew repeats "blood of war"; Greek "innocent blood" the second time.
- `jeroboam-and-the-congregation-came-or-the-people-spake-1-kings-12-2-3-12-greek` (12:3, 12:12; 12:20 as the B side): the Greek page prints no verse 2 and names no Jeroboam at the meeting; scope names the reconciliation of "come again" and the written/read note as background only.
- `an-hundred-and-fourscore-thousand-or-a-hundred-and-twenty-thousand-1-kings-12-21-greek` (12:21): Greek 120,000; at 2 Chronicles 11:1 the Greek agrees with the KJV at 180,000 (said in scope, not tagged).
- `ravens-brought-bread-and-flesh-twice-or-bread-in-morning-flesh-in-evening-greek` (17:6).
- `widow-for-me-and-my-son-or-for-me-and-my-children-1-kings-17-12-15-greek` (17:12, 17:13, 17:15): Greek plural children; Greek 17:17 still has a single son, said in scope.
- `elijah-stretched-himself-and-soul-came-again-or-breathed-and-child-cried-out-greek` (17:21, 17:22): scope says the Greek does not deny the soul's return.
- `ahab-palace-or-ahab-threshingfloor-naboth-vineyard-1-kings-21-1-greek` (21:1): two nouns, no claim of mislocation.
- `naboth-did-blaspheme-god-and-the-king-or-blessed-god-and-the-king-greek` (21:10, 21:13): same shape as the published Job 1:11 / 2:5 record; no H, shared root.
- `dogs-lick-thy-blood-or-swine-and-dogs-lick-and-harlots-wash-1-kings-21-19-greek` (21:19, with 22:38 as the B side): Greek adds swine and harlots in the foretelling. The published `ahab-blood-armour-washed-or-harlots-washed` covers 22:38 only; this is the earlier verse. Codex may want a cross-reference.

Checked: no existing ID in `data/evidence.json` or the earlier drafts covers 1 Kings 1:40, 2:3, 2:5, 12:3, 12:12, 12:21, 17:6-22 or 21:1-19. Every `sides` quote was checked as an exact substring of the packaged KJV by script.

## Considered and ruled out

- 1 Kings 3:9 and 3:11 "understanding heart": the Hebrew prints a form of "hear" (שֹׁמֵעַ, לִשְׁמֹעַ) and the Greek "to hear", while the KJV has "understanding". Arguably a plain word difference, but "hearing heart" and "understanding heart" can carry the same sense, so left unissued without a lexicon citation. Could be revisited under the proper-word rule if the owner wants it.
- 1 Kings 3:15: Greek adds the altar before the ark and "in Sion"; nothing in the KJV contradicts it, low value.
- 1 Kings 2:11 (seven years in Hebron, thirty-three in Jerusalem): published coverage exists at 2 Samuel 5:5; not re-issued.
- Brenton 2:47-57 (the Greek repeats Solomon's provision, horses and officials, material the KJV has in chapters 4 and 5): a doublet inside the Greek, not a new statement; the "forty thousand brood mares" at Greek 2:55 matches the number question already handled at 1 Kings 4:26.
- 1 Kings 12:18 Adoram against Greek Adoniram: same man under a longer form (4:6, 5:14 use Adoniram); a spelling difference.
- Brenton 12:34-47 (a Greek-only account of Jeroboam, Ahijah and Shemaiah's garment) overlaps the published Q record `twelve-pieces-ten-tribes-and-one-tribe-which-tribe-is-the-twelfth` and 1 Kings 14:1-18; its numbering has no KJV equivalent, so not issued.
- 1 Kings 12:30 Greek plus "and left the house of the Lord": implied by 12:27-28; no clear new statement.
- 1 Kings 12:28 "calves" against Greek "heifers": the Hebrew noun is the young-bull noun; no meaning difference shown.
- 1 Kings 1:5 "horsemen" against Greek "horses": same Hebrew noun the earlier notes treat as ambiguous.
- 1 Kings 1:9 stone of Zoheleth: Brenton's own note says the Vaticanus renders a different word; text-critical, no plain difference.
- 1 Kings 2:39 Achish son of Maachah against 1 Samuel 27:2 Achish son of Maoch: likely a different king or a variant; no conflict stated.
- 1 Kings 3:1-3 (Pharaoh's daughter, high places) and 21:8-13 (Jezebel's false witnesses) as V: the narrator condemns Ahab and Jezebel (21:19-25), and 3:2-3 is qualified in the text, so not V.
- 1 Kings 17:4 "ravens" (Hebrew עֹרְבִים) against a possible "Arabs" reading: a vowel question, not a KJV-against-text difference shown by the editions used.
- 1 Kings 21:16 Greek adds Ahab's rending and sackcloth at once: the KJV states the same acts at 21:27 in the same passage.
- 1 Kings 21:21 Greek "I will kindle a fire after thee" against KJV "take away thy posterity": the Hebrew verb can mean both burn and sweep away; left out.
- 1 Kings 21:29 ("in his son's days") beside 22:34-40: covered by existing records on Ahab.

## Ledger

`chapter-ledger.json`, 1 Kings `secondPass`: 5 chapters `records-draft` (1, 2, 12, 17, 21); chapter 3 `reviewed-none`. KJV read in full; Hebrew and Greek read at flagged verses only.

## For the owner

No question. Next D unit: 2 Samuel (5 chapters), then the remaining no-record chapters in Joshua, Judges, Ruth, Ezra, Nehemiah, Esther, Daniel, Hosea, Jonah, Micah, Zephaniah, Matthew, John, Acts, Romans, 1 Corinthians, Galatians, Ephesians, Hebrews, Revelation.
