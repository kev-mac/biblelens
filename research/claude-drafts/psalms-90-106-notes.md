# Psalms 90–106 (Book IV) — notes

Companion to `psalms-90-106-records.json` (16 records: 16 G, no H, no V, no untagged; all carry `sides`, two with a side B on a New Testament verse: Hebrews 3:8 and Hebrews 1:12). All are drafts until Codex accepts them. Written 2026-10-13. Q records are in `psalms-90-106-q-records.json` with `psalms-90-106-q-notes.md`.

## What was compared

- Every KJV verse of Psalms 90–106 (17 psalms, 321 verses) was set against Brenton’s English of the Greek verse at the matching number by script; each verse with low word overlap, and each verse with a different number word or proper name, was then read in the KJV, the Hebrew (WLC) and Brenton’s Greek. About 60 verses were printed and read; the 16 below were kept.
- Hebrew and Greek were read in full only at the verses listed in the records and in “Considered” below. The psalms were not read in full in the Hebrew or the Greek.
- Published and drafted records were checked before writing and again just before the files were written. The only published records that list a verse of Psalms 90–106 in `refs` are `rejoice-o-ye-nations-greek-adds-let-all-the-angels-of-god-worship-him` (97:7) and `behemoth-and-leviathan-what-creatures-are-they` (104:26). The six built-in studies in `src/data.js` cite no verse of this part.
- One shared reference: Psalm 104:26 is in the published leviathan question. The record issued here compares only the printed nouns (“leviathan” / “dragon”) and the pronoun of the last clause, and does not say what creature is meant.

## Verse numbers

Greek psalm = KJV psalm − 1 for the whole part (KJV 90 is `grcbrent/PSA089.htm`). Counts, from the fetched pages:

- Hebrew and Greek run **one ahead** of the KJV in 92 and 102 (a title counted as verse 1).
- **No difference** in 90, 91, 93–101 and 103–106 (the title is printed inside verse 1 or not at all).
- Hebrew and Greek offsets agree in every psalm; `lab2.mjs` printed the table. Brenton’s Greek prints no lettered verses in this part.
- Brenton’s Greek page prints “for the Lord will not cast off his people” at the head of Greek 94:4; Brenton’s English page prints the same sentence at the end of its verse 3. The record at 95:4 quotes each where it prints it.
- Brenton’s Greek page prints “to number” (ἐξαριθμήσασθαι) at the end of 89:11 where the English page begins its verse 12 with “and who knows how to number his days”. The record at 90:12 quotes each where it prints it.
- The WLC verse 104:9 prints its first word with a break (“גְּֽבוּלשַׂ֭־מְתָּ”); it is not quoted.
- `refs` and `sides` take KJV numbers; each quotation is given at its own Hebrew or Greek number, and each record says so.

## Records (all G)

| ID | Verse | Why it qualifies |
|---|---|---|
| `thou-turnest-man-to-destruction-or-turn-not-man-back-to-humiliation-greek` | 90:3 | A statement that God turns man to destruction against a negative request and a question. |
| `so-teach-us-to-number-our-days-or-so-make-known-thy-right-hand-greek` | 90:12 | “Number our days” against “thy right hand”; the Greek verb of numbering sits in verse 11. |
| `destruction-that-wasteth-at-noonday-or-the-evil-spirit-at-noonday-greek` | 91:6 | “Destruction” against a second term Brenton’s English renders “the evil spirit”. |
| `i-shall-be-anointed-with-fresh-oil-or-mine-old-age-with-rich-mercy-greek` | 92:10 | A verb of anointing with oil against “old age … with rich mercy”. |
| `my-soul-had-almost-dwelt-in-silence-or-my-soul-had-almost-sojourned-in-hades-greek` | 94:17 | “Silence” against “Hades”. |
| `in-his-hand-are-the-deep-places-of-the-earth-or-for-the-lord-will-not-cast-off-his-people-greek` | 95:4 | A sentence the KJV of Psalm 95 lacks (it is at 94:14) and “ends of the earth” for “deep places”. |
| `the-day-of-temptation-in-the-wilderness-or-the-day-of-irritation-greek-psalm-95-8` | 95:8 | The Greek psalm’s noun for the day differs from the noun of Hebrews 3:8 (side B). |
| `all-the-gods-of-the-nations-are-idols-or-are-devils-greek` | 96:5 | “Idols” against δαιμόνια. |
| `he-weakened-my-strength-in-the-way-or-he-answered-him-in-the-way-of-his-strength-greek` | 102:23 | Two acts done to the speaker against an answer and a request. |
| `as-a-vesture-shalt-thou-change-them-or-shalt-thou-fold-them-greek-psalm-102-26` | 102:26 | “Change” against “fold”, beside the two Greek New Testament editions of Hebrews 1:12 (side B). |
| `which-sing-among-the-branches-or-from-the-midst-of-the-rocks-greek` | 104:12 | “Branches” against “rocks”. |
| `there-is-that-leviathan-or-this-dragon-whom-thou-hast-formed-greek` | 104:26 | “Leviathan” against “dragon”; wording only. |
| `he-was-laid-in-iron-or-iron-passed-through-his-soul-greek` | 105:18 | A person laid in iron against “his soul” as the subject of the verb. |
| `they-rebelled-not-against-his-word-or-they-rebelled-against-his-words-greek` | 105:28 | A negative clause in the KJV and Hebrew; none in the Greek. |
| `sent-leanness-into-their-soul-or-sent-fulness-into-their-souls-greek` | 106:15 | “Leanness” against “fulness”. |
| `phinehas-executed-judgment-or-phinehas-made-atonement-greek` | 106:30 | “Executed judgment” against “made atonement”. |

Each reasoning and scope paragraph states the printed wording only and says what is not claimed. The tags all rest on a Greek word or clause in Brenton’s edition that differs from the KJV; no H is claimed.

## Considered and not issued

- **No H**: the Hebrew-side candidates would each need a dictionary or the KJV’s own renderings elsewhere: 95:8 (“Massah”, “temptation”, whether a name or a noun), 100:3 (“and not we ourselves”, with a written and a read form; the Greek agrees with the KJV), 104:4 (“spirits”), 106:30 (“executed judgment”). Same ground as Psalms 22:16 and 8:5; see `owner-questions.md`. The 95:8 and 106:30 verses are G only.
- **95:10 with Hebrews 3:9–10** (“forty years” placed with “grieved” in the psalm and with “saw my works” in Hebrews; “this generation” against “that generation”): the Greek of the psalm agrees with the Hebrew on the placing, and both statements could stand together; the demonstrative would rest on how Brenton’s English renders ἐκείνῃ (“this”), so a difference cannot be shown from the pages. Not issued.
- **95:11 with Hebrews 3:11 and 4:3** (“Unto whom I sware … that they should not enter” against “So I sware … They shall not enter” and “if they shall enter”): an oath formula; the wording differs but not the statement. Not issued.
- **104:4 with Hebrews 1:7** (“spirits … a flaming fire”): the KJV psalm, the KJV Hebrews and the Greek psalm agree. Left out.
- **91:11–12 with Matthew 4:6 and Luke 4:10–11**: the quotation omits “to keep thee in all thy ways”; no conflict. Left out.
- **Psalms 96, 105 and 106 with 1 Chronicles 16** (96:5 and 1 Chronicles 16:26; 105:6 “Abraham” against 1 Chronicles 16:13 “Israel”; 105:12 “they” against 16:19 “ye”; 105:8 “He hath remembered” against 16:15 “Be ye mindful”): these are conflicts with a book already finished, and 1 Chronicles comes before Psalms; a conflict is issued with the earlier book and none was written there. Not issued here; do not log it again.
- **106:32–33 with Numbers 20:12 and Deuteronomy 1:37** (the cause of Moses’s exclusion): the same, a conflict with earlier books. Used as context in a Q only.
- **105:28 plague order** (darkness first, boils and murrain not named): a list not stated to be exclusive or ordered. Left out.
- **Names**: 105:6, 105:9, 105:23, 106:17, 106:19, 106:28 and 106:30 (Abraam, Cham, Abiron, Choreb, Beelphegor, Phinees) are spelling variants; not issued.
- **Animal names**: 104:17 (stork / heron) and 104:18 (conies / hedgehogs): the identity of an animal across texts is not claimed. Not issued.
- **100:3, 101:5, 102:20, 106:29, 106:36, 92:14**: read; the Greek is a different rendering but not a different statement, or the difference was too slight to issue.
- **No V**: the psalms tell few acts, and none that breaks a law under the test. **No untagged conflict**: verses of a psalm were not set against other books beyond the checks above.
- Psalm 151 is outside this part.

## Held back, quotes sourced

Brenton’s Greek at 101:5 (“him have I driven from me … with him I have not eaten”), 102:20 (“the sons of the slain”), 106:29 (“destruction was multiplied among them”), 103:17 (“the house of the heron”).
