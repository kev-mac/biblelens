# Judges 1–21 — Q records, notes

Session 2026-10-13. Q-only backlog session: H, G, V and untagged conflicts were not re-opened. File: `judges-1-21-q-records.json` (4 records). All are drafts until Codex accepts them. All take `mode: "questions"`, `tags: ["Q"]`, `status: "Context"` and carry `sides`.

## Records

1. `after-the-death-of-joshua-which-events-of-judges-1-follow-it` (1:1) — the book opens “after the death of Joshua”, yet 2:6–8 has Joshua dismiss the people and die, and the taking of Kirjathsepher (1:11–13) also stands at Joshua 15:15–17; the verses compared do not say in what order these things happened.
2. `gideons-ephod-what-was-it-and-what-did-israel-do-with-it` (8:27) — an ephod is made from the gold, “put” in Ophrah, and all Israel goes “a whoring after it”; in the other verses compared an ephod is worn or brought by a priest. What the object was and what was done with it is not said.
3. `god-sent-an-evil-spirit-between-abimelech-and-shechem-what-was-it` (9:23) — God is the sender of an “evil spirit” and treachery follows; what the spirit was and how it worked is not said. 1 Samuel 16:14 has the same two Hebrew words and does not say either.
4. `jephthah-did-with-her-according-to-his-vow-what-was-done-to-his-daughter` (11:39) — the vow names a burnt offering; the fulfilment is told only as “did with her according to his vow”, followed by “and she knew no man”. The act is not described.

## Checks made

- Every KJV quotation and side was asserted by script against `data/chapters.json`; every Hebrew and Greek quotation against the fetched WLC and Brenton pages. Sides were validated with `scripts/verse-roles.mjs`. All 33 source addresses answered.
- The book was **not** read in full. Verses read in the KJV, Hebrew and Greek: 1:1, 1:10–13; 2:6–10; 8:24–27; 9:23–24, 9:56–57; 11:30–31, 11:34–40; 17:5. Verses read in the KJV only: 1:8–9, 1:20; 2:1, 2:11; 8:22–23, 8:33; 9:22, 9:25–26; 11:29, 11:32–33; 18:14. Parallels read: Joshua 15:13–17 and 24:28–31; Exodus 28:4, 28:6; 1 Samuel 2:18, 12:11, 16:14–15, 23:9; 2 Samuel 6:14; 1 Kings 22:21–23; Hosea 3:4; Deuteronomy 12:31; Leviticus 27:28–29; Hebrews 11:32 (KJV only; no Greek New Testament is quoted).
- Script-asserted whole-word searches of the packaged KJV (each is a word search, nothing more):
  - “death of Joshua”: Judges 1:1 only;
  - “evil spirit(s)”: Judges 9:23; 1 Samuel 16:14, 16:15, 16:16, 16:23, 18:10, 19:9; Luke 7:21, 8:2; Acts 19:12, 19:13, 19:15, 19:16;
  - “ephod” in Judges: 8:27, 17:5, 18:14, 18:17, 18:18, 18:20;
  - “Jephthah” / “Jephthae” outside Judges: 1 Samuel 12:11 and Hebrews 11:32.

## Verse numbers

- No difference between the KJV, WLC and Brenton at the verses quoted.
- Brenton’s Greek prints “and it was an ordinance in Israel” at the end of 11:39 in the Greek page and at the start of 11:40 in its English page; the words quoted from 11:39 stop before that clause.

## For Codex

- Record 1 shares Joshua 15:13–17 with the published `early-conquest`, whose scope already says that local accounts “may narrate different stages or recap earlier events”. Record 1 asks the question of order directly and places it on Judges 1:1 and 2:6–8, which `early-conquest` does not cite. If the two are judged too alike, hold record 1.
- Record 2 shares 8:24 and 8:26 with the published `midianites-and-ishmaelites` and 17:5 with `micah-graven-image-and-the-law`; record 3 shares 9:24 and 9:56 with `gideon-seventy-sons-count` and Numbers 5:14 with `numbers-jealousy-ordeal`; record 4 shares 1 Samuel 12:11 with `samuel-deliverers-bedan-or-barak`. Each asks a different question.
- Records 1 and 4 carry more than one side-A entry. If a side on a verse other than the tagged one is unwanted, drop the extra entries; nothing else depends on them.
- Record 4 is Q only. It does not re-open the V question on Jephthah’s vow, which was settled earlier, and it proposes no finding about the act.
- Wording differences stated inside the records as wording only and **not** proposed as H or G, because this session does not re-open them for Judges: 2:6 (KJV “when Joshua had let the people go”; the Hebrew and Greek quoted have a plain “and Joshua sent the people away”); 11:39 (KJV “according to his vow”; Hebrew and Greek “did his vow to her”); Brenton’s Greek word for the ephod at Judges 8:27 against Exodus 28:6.

## Considered and not issued

- Who the angel of the Lord is (2:1; 6:11–22; 13:3–22): the published `angel-of-the-lord-speaks-as-god-identity-unstated` already asks it.
- The angel’s name (13:18): published as `angel-name-secret-or-wonderful`.
- What the teraphim were (17:5; 18:14): close to record 2 and to the published Micah record; held back.
- Why Israel was twice defeated after being told to go up against Benjamin (20:18–25): the question turns on a view of how God’s answers ought to work, not on a gap in what the passage tells.
- Who or what Meroz was (5:23): a name in a song, with nothing resting on it in the story.
- How Israel “asked the Lord” (1:1; 20:18): the published Urim and Thummim question covers the means of enquiry.
- Samson’s strength and his hair (16:17–22), the three hundred foxes (15:4), the fleece (6:36–40): unspecified miracles or small details of procedure, not gaps in explanation.
- Shamgar the son of Anath (3:31) and Chushanrishathaim (3:8): identities that would need outside sources.
- Seen in passing and not examined: at 11:31 the KJV has “whatsoever cometh forth” where Brenton’s English has “whosoever shall first come out”; at 11:40 the KJV has “to lament”. Neither was pursued, since H and G are closed for Judges.

## Questions — For the owner

None.
