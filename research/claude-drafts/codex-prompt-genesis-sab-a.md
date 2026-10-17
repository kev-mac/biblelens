# Codex task: verify and integrate the Genesis SAB "A" batch (BibleLens)

You are Codex, verifier and integrator for BibleLens (formerly ScriptureLens; use "BibleLens" in any new text, but do not rename existing backup files or historical notes). Claude is the sole researcher. Follow `research/notes/claude-integration-workflow.md` and every standing owner ruling in it. Do no independent research and do not search for new findings.

## Batch to process

- Records: `claude-drafts/genesis-sab-a-records.json` (16 draft records, all mode `contradictions`).
- Notes: `claude-drafts/genesis-sab-a-notes.md`. Read it first, especially the points addressed to Codex and the owner.
- Background: `sab-genesis-contradiction-review.md` shows where these candidates came from (the Skeptic's Annotated Bible contradiction list). Do not treat the SAB as a source for any record. The records rest only on the packaged KJV, the supplied Hebrew and Greek addresses, and the verses quoted.
- Copy the draft files into `research/claude-drafts/` under the same names if they are not already there. Leave the drafts untouched after copying.

## Tag display names changed (owner, 2026-10-16)

- H is now shown as **Academic**.
- G is now shown as **Translation**.
- Q is now shown as **(Unanswered) Questions**.
- V is unchanged.

Implement the display and label changes everywhere the old names appear: icon labels and accessible names, toggles, legends, help text, counts, the Ask and Chat context text, and any tests that assert the old labels. Claude has not been told whether the stored tag codes (`"H"`, `"G"`, `"Q"`) also change. Keep the codes in all existing and new records unless you decide a code change is needed; if you change any code, migrate every record, report it, and tell the owner. The one tagged record in this batch carries `["H","G"]`.

## Verification (every record)

1. For each `KJV ref: "quote"` in `text`, confirm the quote is an exact substring of that verse in packaged `data/chapters.json`. Do the same for every `sides` quote. Confirm every side ref is in the record's `refs` and the build's side validation passes.
2. Confirm IDs are unique and do not duplicate existing evidence IDs. Check `refs` book indexes, chapters, verses and labels, and that source URLs are well formed.
3. For `fowl-from-the-waters-or-from-the-ground-hebrew-says-the-waters-swarm` (tags H and G): fetch the four supplied addresses and confirm the quoted Hebrew (WLC, `bolls.life` Genesis 1:20 and 2:19) and Brenton Greek (`ebible.org/grcbrent` GEN01 and GEN02) are exact substrings at the printed verses. Claude also read the NETS English translation of the Septuagint (Genesis PDF at https://ccat.sas.upenn.edu/nets/edition/01-gen-nets.pdf, since deleted locally at the owner's request) and cites one short NETS phrase at 1:20. NETS is English, so it is not a source for Greek wording. Do not download the PDF without the owner's approval, delete it afterwards, and hold the NETS excerpt under Needs owner if copyright use is unsettled. The Hebrew in this record is in WLC source order, which is not Unicode NFC. Do not normalise it anywhere (verification, storage, build, display); compare it byte-for-byte. A copy that has been NFC-normalised will fail the exact-substring check. Expected SHA-256 of the whole compact JSON file is a8ab6ce192596cd9872e1db659bf7894ecdb8a2f3c10667ce145ee0037765c92; if the file in the repo hashes differently, say so before verifying. Confirm the stated limits survive in the published record: the demonstrated clause-structure difference (not English synonymy), that the Greek agrees with the KJV and not with the Hebrew, that the Hebrew is the WLC digital text, that the Greek is Brenton's printed Septuagint (Greek Old Testament), and that a named digital edition is not proof that every manuscript agrees.
4. Interpretation limits: reconciling readings must stay visible, none turned into established fact. No record may assert a flood, an exodus date, or any history.

## Decisions required (write them down, do not guess)

Give each record accept / correct / hold with a reason. Hold anything that needs an owner ruling under **Needs owner**, and do not adopt a ruling from a researcher note. In particular:

1. `commanded-to-offer-isaac-yet-child-burning-commanded-not` shares the key verse Genesis 22:2 with the Greek "only son" record. Hold for the owner unless a standing ruling already covers two records on one key verse.
2. `jacob-buried-at-machpelah-or-at-sychem` sits beside `shechem-burial-land-purchaser`. Owner decides separate or merged. Hold if unclear.
3. `lord-appeared-to-abram-or-no-man-hath-seen-god` relies on the standing ruling that a new verse may have its own record when the existing study (`jacob-saw-god-face-to-face-or-no-man-hath-seen-god`) does not cite it. Confirm Genesis 12:7, 17:1 and 18:1 are not cited by that record. If any is, hold.
4. `it-repented-the-lord-or-god-is-not-a-man-that-he-should-repent` is kept at the KJV level with no tag because no Hebrew comparison was made. Do not add a tag.
5. `four-hundred-years-or-four-hundred-and-thirty` mentions that other ancient texts of Exodus 12:40 are reported to read differently. That was not examined. Remove or soften the sentence if you cannot confirm it from supplied sources, and say so in your decisions.
6. The cross-book records (Genesis 6:6, 10:23, 12:7, 15:13, 22:2, 50:13) follow the standing ruling that a comparison across books is issued in the session of whichever book comes first. Confirm none duplicates a record already issued under a later book.

## Integration

Integrate only accepted or corrected records, in the existing evidence schema, preserving every existing field. Run the full build and all checks, including `scripts/check-chat-reliability.mjs`, and the side-validation step. Do not run `merge-verse-roles.mjs` unless a `verse-roles.json` exists for this batch.

Then: checkpoint, back up (`BibleLens-checkpoint-<n>.zip` going forward), push and publish per the integration contract. After publishing, verify on the hosted site: one new Genesis record opens from its key verse, its citation preview matches the packaged KJV, the Academic and Translation toggles show the new names, and the Hebrew and Greek quotes display correctly in the tagged record. Take a screenshot. Run live hosted Chat cases only if you claim anything about generated answers; never describe mocked replies as live evaluation.

## Report

Write `claude-ready-genesis-sab-a-<date>.md` with adjacent decisions and quote-checks JSON. Report the accepted, corrected and held records, the new counts, and the limit: annotation presence is not exhaustive review. State exactly what you changed for the tag renames and what you did not.

## Not in this batch

Do not draft or add records for the other SAB items. Items rated B or C in `sab-genesis-contradiction-review.md` are not approved. The A items Claude held back (Genesis 3:8, 32:24, 46:9, 49:0, 25:8) are explained in the notes and are not to be added.
