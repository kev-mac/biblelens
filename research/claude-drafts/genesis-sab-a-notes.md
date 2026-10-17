# Genesis: SAB "A" items, draft batch notes (2026-10-16)

Batch file: `genesis-sab-a-records.json` (16 draft records, mode `contradictions`). One record carries tags H and G (display names now Academic and Translation); the other 15 are untagged.
Source of the candidates: the Skeptic's Annotated Bible contradictions list, reviewed in `sab-genesis-contradiction-review.md`.

## Checks done

- Every `KJV ref: "quote"` in each record's `text` and every `sides` quote was checked as an exact substring of the packaged KJV verse (`data/chapters.json`, Genesis-Full package). All 16 records pass.
- `sides` refs all occur in the record's `refs`. IDs are new and do not duplicate existing evidence IDs.
- Hebrew and Greek were compared for one record only (Genesis 1:20, below). The other 15 have no H/G comparison and no tag; where a Hebrew sense could matter, the record says so in `scope`.
- For the 1:20 record, the quoted Hebrew (WLC, bolls.life) and Greek (Brenton, ebible.org) were sliced from the fetched source text and checked as exact substrings at the printed verse.
- Nothing has been integrated. These are drafts for Codex verification and owner acceptance.

## Records in the batch

| ID | Primary ref | Status |
|---|---|---|
| fowl-from-the-waters-or-from-the-ground-hebrew-says-the-waters-swarm | Genesis 1:20 | Textual conflict, tags H and G |
| woman-made-with-man-or-after-the-animals | Genesis 1:27 | Context |
| lord-appeared-to-abram-or-no-man-hath-seen-god | Genesis 12:7 | Context |
| cain-fugitive-and-vagabond-yet-builds-a-city | Genesis 4:12 | Context |
| it-repented-the-lord-or-god-is-not-a-man-that-he-should-repent | Genesis 6:6 | Context |
| noah-entered-the-ark-seven-days-before-or-the-day-the-flood-began | Genesis 7:7 | Textual conflict |
| nations-after-their-tongues-before-babel | Genesis 10:5 | Context |
| uz-hul-gether-sons-of-aram-or-sons-of-shem | Genesis 10:23 | Textual conflict |
| four-hundred-years-or-four-hundred-and-thirty | Genesis 15:13 | Context |
| who-named-beersheba-abraham-or-isaac | Genesis 21:31 | Context |
| commanded-to-offer-isaac-yet-child-burning-commanded-not | Genesis 22:2 | Context |
| jacob-buried-at-machpelah-or-at-sychem | Genesis 50:13 | Context |
| anah-brother-of-zibeon-or-son-of-zibeon | Genesis 36:20 | Textual conflict |
| dishon-son-of-seir-or-son-of-anah | Genesis 36:21 | Context |
| korah-son-of-esau-or-chief-of-eliphaz | Genesis 36:5 | Textual conflict |
| benjamin-a-little-one-or-father-of-ten-sons | Genesis 44:20 | Context |

Under the standing ruling that a record comparing verses in different books belongs to whichever book comes first, the cross-book records (6:6, 10:23, 12:7, 15:13, 22:2, 50:13) are issued here.

## A items not drafted, and why

- **1:20, fowl from the waters or the ground.** Checked and drafted as `fowl-from-the-waters-or-from-the-ground-hebrew-says-the-waters-swarm`. Result: the Hebrew of 1:20 has the waters swarm (yishretsu) with living creatures and a separate clause for the fowl ("and fowl fly"), so it does not say the waters bring forth the fowl. 1:21's "that the waters swarmed" attaches to the sea creatures, with the winged fowl a separate object. Hebrew 2:19 forms the beasts and fowl from the ground. Brenton's Greek 1:20 has one verb, exagagetō ("let the waters bring forth"), governing both reptiles and flying birds, so the Greek reads like the KJV. NETS (the modern English translation of the Septuagint, read from its Genesis PDF and then deleted from the machine at the owner's request) agrees: its 1:20 is "Let the waters bring forth creeping things among living creatures and birds flying on the earth". NETS is English only, so Brenton remains the source of the quoted Greek wording; NETS is cited to show how the Greek is read. The conflict the SAB cites therefore exists in the KJV and the Greek and is not clearly present in the Hebrew. H and G both apply, but note the Greek agrees with the KJV and not with the Hebrew, unlike the Shiloh and ox cases in the standing ruling. The animals half of the SAB item (1:24 earth brings forth beasts) does not conflict with 2:19.
- **3:8, God has a body.** Dropped as a contradiction. Genesis 3:8 reports hearing a voice, not seeing. The Abraham appearances (12:7, 17:1, 18:1) carry the real question and are drafted instead.
- **32:24, who Jacob wrestled.** Not drafted. The existing record jacob-saw-god-face-to-face-or-no-man-hath-seen-god covers Genesis 32:30. The man/God/angel identity (Genesis 32:24, 32:28, Hosea 12:3-4) looks more like a Q (unanswered question) candidate than a contradiction. Owner decision: fold in, or request a Q record.
- **46:9 vs 46:15, count of thirty and three.** Not drafted; recommend dropping. By my count the names in 46:8-15 come to 35 including Jacob, Er, Onan and Dinah. Leaving out Er and Onan, who "died in the land of Canaan" (46:12), gives 33 including Jacob and 32 without him. The text's "thirty and three" matches the 33 count, so this is a counting method, not a conflict.
- **49:0, the twelve tribes.** Not drafted. Genesis 49 and Deuteronomy 33 differ in which tribes appear (Deuteronomy 33 has no blessing for Simeon in the verses I checked), but differing lists of blessings are not a contradiction in themselves. The existing record deuteronomy-levi-blessing-and-rebuke already covers the Levi comparison. Hold for owner.
- **25:8, Abraham's burial.** Folded: the SAB item pairs it with Jacob's burial; Genesis 25:9-10 and Acts 7:16 do not conflict on Abraham himself.

## Points addressed to Codex and the owner

1. **Two records on Genesis 22:2.** The Greek "only son" record already uses that verse. Needs an owner decision whether a second record may share it.
2. **Jacob's burial.** `jacob-buried-at-machpelah-or-at-sychem` is separate from `shechem-burial-land-purchaser` (who bought the land). The owner may prefer to merge them.
3. **Abraham appearances.** The record relies on the standing ruling that a new verse may have its own record when an existing study does not cite it. Genesis 12:7, 17:1 and 18:1 are not cited by the Jacob record.
4. **6:6 repent.** Held at the KJV level, per the rule against tagging English synonymy as a Hebrew difference. A Hebrew comparison may justify an H tag or a downgrade.
5. **15:13, Exodus 12:40 variant readings.** The record notes that other ancient texts of Exodus 12:40 are reported to read differently. I did not examine them, so Codex should not treat that as established.
6. **Counts are unchanged** until integration. Annotation presence is not a claim of exhaustive review.
7. **NETS is copyrighted** (Oxford University Press / International Organization for Septuagint and Cognate Studies). The 1:20 record quotes one short NETS phrase and paraphrases 2:19. NETS is only available as a PDF at the cited address, so Codex needs the owner's approval before downloading it, and should delete it afterwards, as the owner asked for here. The owner should confirm the short quotation is acceptable or have it removed.

8. **Do not Unicode-normalise the Hebrew.** The Hebrew quoted in the first record is copied from the WLC source (bolls.life) in source order, which is not NFC. Normalising it (NFC, NFD, or any tool or channel that does so) reorders the combining marks and breaks the exact-substring match against the source. Compare and store it byte-for-byte. During transfer between machines this happened once: a copy came through NFC-normalised and failed its checksum. Line 1 of `genesis-sab-a-records.json` has SHA-256 `21ccc0b7e9cb070b0d004aa813e84a2e8e44b12e55336e3b721722e412069fac` (JSON text only, no brackets or commas) and the whole compact file has SHA-256 `a8ab6ce192596cd9872e1db659bf7894ecdb8a2f3c10667ce145ee0037765c92`.
