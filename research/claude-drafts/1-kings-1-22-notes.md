# 1 Kings 1–22 — notes for `1-kings-1-22-records.json`

Researcher: Claude · 2026-10-12 · **All 24 records are drafts until Codex accepts them.** The `status` field is the intended published value. Nothing outside `research/claude-drafts/` was changed.

Every Hebrew, Greek and KJV quotation was cut by script from the fetched page or `data/chapters.json` and asserted to be an exact run of characters in the stated verse (Greek after removing page markup and collapsing spaces; Hebrew with the edition's own points and accents). All 22 chapters were fetched in WLC and Brenton Greek, with 14 parallel chapters of 2 Chronicles, but I compared only the verses listed below, chosen from known difficulties in the book. A verse not mentioned here has not been cleared.

Published records touching 1 Kings: `early-stalls` (4:26), `deuteronomy-royal-limits-and-solomon` (10:14–11:4), `jephthah-chemosh-and-ammon` (11:7, 33). None is re-issued. All 24 IDs are new.

## Verse numbers — read before checking quotes

- **Hebrew (WLC):** KJV 4:21–34 = Hebrew 5:1–14; KJV 5:1–18 = Hebrew 5:15–32; KJV 22:43b–53 = Hebrew 22:44–54. In 2 Chronicles: KJV 2:1–18 = Hebrew 1:18–2:17; KJV 14:1–15 = Hebrew 13:23–14:14.
- **Brenton Greek:** follows the Hebrew numbers in chapters 4–5; has its own order in chapter 7 (KJV 7:14, 15, 26 = Greek 7:2, 3, 12); **swaps chapters 20 and 21** (KJV 20 = Greek 21); prints lettered verses (12:24a–z, 16:28a–h, 2:35a–o, 2:46a–l). The lettered verses share an HTML `id` with later verses, so find them by the printed label, not the `id`.
- **Brenton Greek omissions on the cited pages:** chapter 9 prints 1–9, 9a, 10–14, 26–28; chapter 14 prints 21–31 only; chapter 15 has no verse 6 or 32; chapter 22 has no 47–50; chapter 5 has no 5–8.
- `refs` use KJV numbers; each `text` states the Hebrew or Greek number where it differs.

## Records

| ID | Verses | Tags | Why it qualifies |
|---|---|---|---|
| `hiram-oil-twenty-measures-or-twenty-thousand-baths` | 5:11, 2 Chr 2:10 | G | 20 measures against 20,000 baths; Greek of Kings has 20,000 baths. |
| `solomon-overseers-thirty-three-hundred-or-thirty-six-hundred` | 5:16, 2 Chr 2:18 | G | 3,300 against 3,600; Greek of Kings has 3,600. |
| `temple-begun-four-hundred-eightieth-or-four-hundred-fortieth-year` | 6:1 | G | 480th year against 440th. |
| `temple-sixty-by-thirty-cubits-or-forty-by-twenty-five` | 6:2 | G | Length 60 against 40, height 30 against 25. |
| `temple-pillars-eighteen-or-thirty-five-cubits` | 7:15, 2 Chr 3:15 | — | 18 cubits against 35. |
| `molten-sea-two-thousand-or-three-thousand-baths` | 7:26, 2 Chr 4:5 | G | 2,000 against 3,000; Greek of Kings gives no capacity. |
| `hiram-craftsman-mother-of-naphtali-or-of-dan` | 7:14, 2 Chr 2:14 | — | Naphtali against Dan. |
| `dedication-feast-people-sent-away-eighth-day-or-twenty-third` | 8:65–66, 2 Chr 7:9–10 | G | Eighth day against twenty-third; Greek of Kings has seven days, not fourteen. |
| `cities-solomon-gave-hiram-or-huram-gave-solomon` | 2 Chr 8:2, 1 Kgs 9:11–12 | H, G | Hebrew and Greek of Chronicles "gave"; KJV "had restored". The KJV renders the same verb form "had given" at 1 Kings 9:12. Tags apply at 2 Chr 8:2. |
| `solomon-chief-officers-five-hundred-fifty-or-two-hundred-fifty` | 9:23, 2 Chr 8:10 | — | 550 against 250. |
| `ophir-gold-four-hundred-twenty-four-hundred-fifty-or-one-hundred-twenty` | 9:28, 2 Chr 8:18 | G | 420 against 450; Greek of Kings has 120. |
| `solomon-songs-a-thousand-and-five-or-five-thousand` | 4:32 | G | 1,005 against 5,000. |
| `rehoboam-forty-one-and-seventeen-or-sixteen-and-twelve` | 14:21 (Greek 12:24a) | G | A Greek verse the KJV lacks gives age 16 and a 12-year reign. |
| `david-save-only-uriah-greek-lacks-the-exception` | 15:5 | G | Greek has no "save only in the matter of Uriah". |
| `abijam-mother-maachah-of-abishalom-or-michaiah-of-uriel` | 15:2, 2 Chr 13:2 | G | Two names and two fathers; Greek of 2 Chr 13:2 has Maacha. Tag applies at 2 Chr 13:2. |
| `asa-mother-maachah-or-ana` | 15:10, 15:13 | G | Father and son given the same mother in identical words; Greek has Ana. |
| `asa-high-places-not-removed-or-taken-away` | 15:14, 2 Chr 14:3, 5 | — | "Not removed" against "took away". |
| `jehoshaphat-high-places-not-taken-away-or-taken-away` | 22:43, 2 Chr 17:6 | — | Same contrast for the next king. |
| `baasha-dead-by-asa-twenty-sixth-year-or-attacking-in-thirty-sixth` | 16:6, 16:8, 2 Chr 16:1 | G | Dead by year 26, attacking in year 36; Greek of Chronicles has year 38, Greek of 1 Kgs 16:8 has no year. |
| `omri-twelve-years-from-asa-thirty-first-ahab-in-thirty-eighth` | 16:23, 16:29 | G | Arithmetic: 31 + 12 ≠ 38. Greek dates Ahab by Jehoshaphat's second year. |
| `jehoshaphat-ships-refused-ahaziah-or-joined-him` | 22:48–49, 2 Chr 20:35–37 | — | Refused Ahaziah against joined with him. |
| `ahab-blood-armour-washed-or-harlots-washed` | 22:38 | H, G | Hebrew "the harlots washed"; KJV "they washed his armour". The KJV renders the same noun "harlots" at 3:16. Greek has harlots. |
| `prophet-disguised-with-ashes-on-face-or-bandage-over-eyes` | 20:38, 20:41 | G | Ashes on the face against a bandage over the eyes. |
| `elijah-drought-ended-in-third-year-or-after-three-years-six-months` | 18:1, Luke 4:25, James 5:17 | — | "In the third year" against three years and six months. Weakest of the batch — see the question. |

No V record is proposed. Codex's 1 Samuel decision requires a stated whole-Bible check for "unchecked", and I could not make one for any candidate here.

For the untagged number and name conflicts I checked Brenton's Greek of the 1 Kings verse: it has the KJV's reading at 7:15 (Greek 7:3), 7:14 (Greek 7:2), 15:14 and 22:43 (Greek 22:44), and has no verse to compare at 9:23 and 22:48–49.

## Considered and ruled out

- `early-stalls` (4:26 against 2 Chr 9:25): not extended. Brenton's Greek has no verse at that place; it has 40,000 in a lettered verse (2:46i) and 4,000 at 10:26, where the KJV speaks of chariots. Too tangled for one record.
- 14:1–20 (Jeroboam's wife and Ahijah): absent from Brenton's chapter 14, but a shorter form of the story stands at Greek 12:24g–n. A relocation with different details; not compared verse by verse. Say if it is wanted.
- 8:9 (nothing in the ark but the two tables) against Hebrews 9:4: Hebrews describes the tabernacle, an earlier time. Belongs with Exodus 16:34 and Numbers 17:10 in a Hebrews session.
- 21:19 against 22:38 (dogs lick Ahab's blood where Naboth died, or at Samaria): 21:29 postpones part of the sentence; turns on how "in the place where" is read.
- 7:23 (ten cubits across, thirty round): rounding.
- 15:16 "war all their days" against 2 Chr 14:1 "quiet ten years" and 15:19: different reigns' spans; not one statement against another.
- 15:6: repeats 14:30 inside Abijam's reign; Brenton's Greek lacks the verse. Noted in the 15:5 record only.
- 7:15 Greek circumference fourteen cubits against the KJV's twelve; 10:28 KJV "linen yarn" against Greek "from Thekoue"; 19:3 KJV "when he saw that" against Greek "was afraid"; 8:53a Greek plus (the sun and the book of the song): Greek differences with quotes sourced, held back to keep the batch small.
- 12:24a mother's name and the rest of 12:24b–z: not compared.
- 4:24 "on this side the river", 10:22 ships of Tharshish against 2 Chr 9:21, 12:2 against 2 Chr 10:2 (dwelt in Egypt / returned from Egypt): turn on disputed Hebrew; no H shown.
- 4:5 Zabud "principal officer" (Hebrew uses the noun for priest): same case Codex held at 2 Samuel 8:18.
- 11:3 against Song of Solomon 6:8: poetry.
- 16:8, 10, 15 Greek lacks other year-of-Asa dates: covered by one mention in the Baasha record.
- V candidates: Solomon's wives, horses and gold (rebuked, 11:9–11); Solomon's worship at high places (narrator's "only", 3:3); Jeroboam's calves and priests (rebuked, chapters 13–14); Ahab and Naboth (rebuked, 21:19); Elijah's altar on Carmel against Deuteronomy 12 (God answers it in the story); Solomon offering sacrifices himself (8:63–64, 9:25: the text does not describe him doing a priest's act). All dropped, none issued untagged.

## Question for the owner

`elijah-drought-ended-in-third-year-or-after-three-years-six-months` sets 1 Kings against two New Testament verses. Its scope says both can stand if the "third year" is counted from a later point. Under your Absalom ruling I have kept it. Do you want Old Testament records that rest on a New Testament verse issued in the Old Testament book's session, or held for the New Testament book?
