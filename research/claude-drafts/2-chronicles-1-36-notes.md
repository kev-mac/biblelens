# 2 Chronicles 1–36 — records, notes

Session 2026-10-13. Full review: H, G, V, untagged conflicts and Q. File: `2-chronicles-1-36-records.json` (14 records: 8 G, 6 untagged; no H, no V; 11 carry `sides`). The Q records are in `2-chronicles-1-36-q-records.json` with their own notes. All are drafts until Codex accepts them.

Every KJV, Hebrew and Greek quotation was asserted by script against the packaged KJV and the fetched pages. Sides were validated with `scripts/verse-roles.mjs`. All 77 source addresses answered.

## Verse numbers — read this first

- **2 Kings 12:** the Hebrew and Brenton’s Greek run one verse ahead of the KJV. `joash-conspirators-…` quotes the Hebrew at 12:22 for KJV 12:21 and says so.
- **Numbers 17:10** (KJV) is 17:25 in the Hebrew. `ark-nothing-save-…` quotes only the KJV there and says so.
- **Brenton’s Greek, 2 Chronicles 36:** the page prints lettered verses 2a–2c, 4a and 5a–5d. The wording quoted in `jehoiakim-…` is printed at the plain numbers 6 and 8; the script asserts the page’s printed labels.
- **Brenton’s Greek, 1 Kings 7:** the chapter is ordered differently and prints other matter at 7:24. `molten-sea-…` quotes no Greek for Kings and says so.
- **Brenton’s Greek numbers Jeremiah 36 as chapter 43.** Only the KJV is quoted for Jeremiah 36:30.
- Not quoted, for later reference: in 2 Chronicles 2 the Hebrew and Greek run one verse lower than the KJV (KJV 2:2 = 2:1), and KJV 14:1 is their 13:23, so chapter 14 runs one lower. Brenton’s Greek prints no 2:18, 3:12, 14:15 or 27:8, and prints 35:19a–19d.

## Records

G (Septuagint, Brenton’s Greek):

1. `visions-of-iddo-the-seer-or-of-joel-greek` (9:29) — “Iddo the seer” in the KJV, “Joel” in the Greek, which has “Addo” at 12:15 and 13:22. The written and read Hebrew forms are quoted as background only.
2. `other-beside-the-ammonites-or-some-of-the-minaeans-greek` (20:1) — the KJV’s third group has no name; the Greek names it, with the name it prints at 26:7. The record does not identify the peoples.
3. `jehoshaphat-and-ahaz-king-of-israel-or-king-of-juda-greek` (21:2, 28:19) — “king of Israel” in the KJV and Hebrew, “king of Juda” in the Greek, in both verses. The tag is placed on both.
4. `azariah-or-ahaziah-son-of-jehoram-went-down-to-jezreel` (22:6; side B 2 Kings 8:29) — the KJV and Hebrew have Azariah in one verse; Kings and the Greek of Chronicles have Ahaziah. G on 22:6 only.
5. `joash-conspirators-sons-of-an-ammonitess-and-a-moabitess-or-an-ammanite-and-a-moabite-greek` (24:26) — feminine in the KJV and Hebrew (the parents), masculine in the Greek and in the case of the conspirators’ names.
6. `captives-of-judah-two-hundred-thousand-or-three-hundred-thousand-greek` (28:8) — 200,000 in the KJV and Hebrew, 300,000 in the Greek.
7. `manasseh-taken-among-the-thorns-or-in-bonds-greek` (33:11) — “among the thorns” in the KJV, “in bonds” in the Greek. The Hebrew word is quoted and left untranslated; no H.
8. `jehoiakim-bound-to-be-carried-to-babylon-greek-carried-and-buried-with-his-fathers` (36:6, 36:8) — the Greek says he was carried to Babylon, and adds a death and a burial “with his fathers” that the KJV and Hebrew of the verse lack. The KJV states “slept with his fathers” only in another book (2 Kings 24:6) and states no burial in the verses quoted.

Untagged:

9. `molten-sea-knops-or-oxen-under-the-brim` (4:3; 1 Kings 7:24) — the same sentence with “knops” in Kings and “oxen” in Chronicles.
10. `ark-nothing-save-the-two-tables-or-pot-of-manna-and-rod-also` (5:10; Hebrews 9:4) — “nothing in the ark save the two tables” against “wherein was the golden pot … and Aaron’s rod”. Issued here because 2 Chronicles is the earlier book; the item had been open since the Exodus session.
11. `asa-and-baasha-war-all-their-days-or-no-war-until-the-thirty-fifth-year` (15:19; 1 Kings 15:16) — war all their days, or no war until Asa’s thirty-fifth year.
12. `jehoram-buried-with-his-fathers-or-not-in-the-sepulchres-of-the-kings` (21:20; 2 Kings 8:24).
13. `ahaz-buried-with-his-fathers-or-not-in-the-sepulchres-of-the-kings` (28:27; 2 Kings 16:20). Both burial records copy the shape of the published `joash-buried-…`.
14. `manasseh-altars-in-the-house-of-the-lord-taken-away-by-him-or-beaten-down-by-josiah` (33:15; 2 Kings 23:12) — the scope names the possible reconciliation (the altars set up again) and says no verse quoted reports it.

## Points for Codex

- **Records 10, 12, 13 and 14 are reconcilable clashes.** Each scope names the reconciliation and says the text does not report it. Record 10 also rests on reading “wherein” in Hebrews 9:4 as the ark, which the scope says.
- **Record 4** is a tagged record with a side B in another book; `appliesTo` holds only the tagged verse.
- **Record 5** quotes one Hebrew phrase from 2 Kings 12:22. The first name in that verse as the edition prints it differs in form from the KJV’s “Jozachar”; the record does not quote or rely on it, and no H is proposed for 2 Kings.
- **Record 8** places the tag on two verses for two different Greek wordings and says which is which. It says the Jeremiah verses are sayings, not reports, and does not call the Greek a contradiction of them.
- **Record 11** notes that the KJV’s “no more war” has no word for “more” in the Hebrew or Greek quoted. That is stated as wording only.
- **Record 14** notes that Brenton’s Greek of 33:15 has no verb for casting out. That is stated as wording and not tagged.
- Overlap check run just before writing, against `data/evidence.json` as updated at 10:08 (486 records). Shared verses are context in each case: 16:1 and 1 Kings 15:33 (`baasha-…`), 22:1 (`ahaziah-forty-two-…`), 2 Kings 12:21 (`joash-buried-…`), 2 Kings 24:6 and Jeremiah 36:30 (`jehoiakim-none-to-sit-…`), 9:29 (the Q on the acts of Solomon), Numbers 17:10. The six built-in studies do not cite these verses.

## Verses compared

The book was not read in full. Compared in the KJV, the Hebrew and Brenton’s Greek: 4:3; 5:7, 5:10; 9:15–16, 9:29; 12:15; 13:22; 14:1; 15:19; 16:1; 17:11; 20:1, 20:10, 20:22–23, 20:31; 21:1–2, 21:4–5, 21:12–15, 21:20; 22:1, 22:6; 24:26; 26:7; 28:8, 28:19, 28:27; 33:5, 33:11, 33:15, 33:22; 34:14–15; 35:3, 35:20–22; 36:5–8. Parallels compared: 1 Kings 7:24, 8:9, 10:16–17, 15:16, 15:32–33; 2 Kings 1:17, 2:11, 3:1, 3:11, 8:16, 8:24, 8:29, 12:21, 16:20, 21:5, 23:12, 23:29, 24:5–6; Jeremiah 3:16, 22:18–19, 36:30; Hebrews 9:3–4; Exodus 16:33–34; Numbers 17:10.

In addition a script compared the number words of every KJV verse of the book with Brenton’s English of the same verse number. It does not allow for the numbering offsets in chapters 2 and 14, and it compares numbers only.

## Considered and not issued

- **H at 34:14** (“a book of the law” where the Hebrew phrase is definite): left out. Whether “a” against “the” is a difference of meaning or of wording only is not settled by the standing test, so the stricter reading was taken. Logged in `owner-questions.md`.
- Shields of gold, “three hundred shekels” against “three pound” (9:16; 1 Kings 10:17): the Hebrew of Chronicles names no unit, so the clash depends on the size of the unit in Kings.
- Ahaz “smote” by Syria and Israel (28:5) against “could not overcome him” (2 Kings 16:5): the scope would have to concede that both can stand.
- Josiah’s reforms before or after the book was found (34:3–8): Kings does not say its order is exclusive.
- Manasseh’s repentance not told in Kings; fire from heaven at the dedication (7:1): arguments from silence.
- Zechariah son of Jehoiada (24:20–22) beside “Zacharias son of Barachias” (Matthew 23:35): the conflict exists only if the two are one man, which no verse states.
- V: Hezekiah’s passover eaten “otherwise than it was written” (30:18) is prayed over and pardoned in the passage; Uzziah and Asa are rebuked or punished. No candidate met the test.
- Names in other forms (Jehoshabeath, Uzziah and Azariah, Tilgathpilneser): spelling or form only.

## Held back, quotes sourced

Brenton’s Greek at 16:1 is already covered by a published record. Not issued, to keep the batch small: 17:11 (no “he goats”), 35:20 (“against the king of the Assyrians” for “against Charchemish”), 35:3 (statement for command; stated in a Q record), 33:15 (no verb), 36:5 (adds the name of Jehoiakim’s mother), the lettered verses 35:19a–d and 36:2a–c, 4a, 5a–d, 24:27, 28:27 (“in the city of David”). Seen and not sourced: 1:13.

## Questions for the owner

None that stops anything. One point was decided by the standing rules and logged: H at 34:14.
