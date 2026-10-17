# BibleLens — Genesis SAB A verification and integration (2026-10-16)

Records file SHA-256 matched before verification: `a8ab6ce192596cd9872e1db659bf7894ecdb8a2f3c10667ce145ee0037765c92`. All three supplied draft files remain untouched. Hebrew was never Unicode-normalised; five original-language excerpts matched UTF-8 byte substrings at their printed WLC/Brenton verses. All 93 KJV text/side quotation checks passed against packaged data/chapters.json. All IDs, source URL shapes, reference coordinates/labels and side membership passed. No NETS PDF was downloaded.

14 records integrated: 10 accepted, 4 corrected. Two held as duplicate findings already published under later books. Decisions and exact quote checks are adjacent JSON files. No independent research or new findings; no B/C or withheld A items added. The background sab-genesis-contradiction-review.md was not present in the checkout; it was not used as a record source.

## Accept

- `lord-appeared-to-abram-or-no-man-hath-seen-god`: Accept: Genesis 12:7, 17:1 and 18:1 occur in neither the Jacob record nor the built-in seen study; standing new-verse ruling applies.
- `cain-fugitive-and-vagabond-yet-builds-a-city`: Exact KJV quotations, valid sides/references, distinct finding, and qualified reconciling readings retained.
- `it-repented-the-lord-or-god-is-not-a-man-that-he-should-repent`: Accept untagged at KJV level. Existing Saul record lacks Genesis 6:6 and Numbers 23:19; new-verse ruling applies, with regret/change-of-purpose readings retained.
- `noah-entered-the-ark-seven-days-before-or-the-day-the-flood-began`: Exact KJV quotations, valid sides/references, distinct finding, and qualified reconciling readings retained.
- `nations-after-their-tongues-before-babel`: Exact KJV quotations, valid sides/references, distinct finding, and qualified reconciling readings retained.
- `who-named-beersheba-abraham-or-isaac`: Exact KJV quotations, valid sides/references, distinct finding, and qualified reconciling readings retained.
- `anah-brother-of-zibeon-or-son-of-zibeon`: Exact KJV quotations, valid sides/references, distinct finding, and qualified reconciling readings retained.
- `dishon-son-of-seir-or-son-of-anah`: Exact KJV quotations, valid sides/references, distinct finding, and qualified reconciling readings retained.
- `korah-son-of-esau-or-chief-of-eliphaz`: Exact KJV quotations, valid sides/references, distinct finding, and qualified reconciling readings retained.
- `benjamin-a-little-one-or-father-of-ten-sons`: Exact KJV quotations, valid sides/references, distinct finding, and qualified reconciling readings retained.

## Correct

- `fowl-from-the-waters-or-from-the-ground-hebrew-says-the-waters-swarm`: Correct: remove quoted NETS wording and replace it with the owner-approved paraphrase; retain NETS link and Brenton as Greek source. Five original-language byte checks pass. H/G retained. Adds the supplied original-language comparison to the question also covered by built-in animals study; study remains visible as context.
- `woman-made-with-man-or-after-the-animals`: Correct: qualify the claim that chapter 1 describes a single act; it groups male/female without specifying simultaneity. Woman/rib sequence differs from the existing animal/man sequence; Genesis 2:22 is new.
- `commanded-to-offer-isaac-yet-child-burning-commanded-not`: Correct: direct owner permits sharing Genesis 22:2 if two cards work. Existing multiple-card validation plus batch-specific rendered-card check verifies support. Retain stopped test versus sacrifices to other gods distinction.
- `jacob-buried-at-machpelah-or-at-sychem`: Correct: direct owner approves separate burial record and reciprocal cross-reference with purchaser record. Preserve ambiguity of Acts plural subject.

## Hold

- `uz-hul-gether-sons-of-aram-or-sons-of-shem`: Duplicates the already-published KJV genealogy comparison in uz-hul-gether-sons-of-shem-or-sons-of-aram-greek-shorter, including the same side verses. No second record inserted.
- `four-hundred-years-or-four-hundred-and-thirty`: Duplicates all four comparison verses and the number/starting-point finding in sojourning-430-years-in-egypt-or-in-egypt-and-canaan-greek. No second record inserted; unverified variant-report sentence is not adopted.

## Owner decisions and interpretation limits

Owner resolved all three explicit questions: two Isaac cards allowed if supported; separate Jacob burial with reciprocal cross-reference; remove NETS quotation, retain supplied paraphrase and link. These rulings are recorded in claude-integration-workflow.md. Needs owner: none for the integrated records. The two duplicates remain uninserted; their published counterparts already cover those findings. The unverified Exodus variant sentence was not adopted. Genesis 12:7, 17:1 and 18:1 are absent from both Jacob’s record and the built-in seen study. Genesis 6:6 and Numbers 23:19 are new verses beside the existing Saul comparison; the new record remains untagged. Reconciling readings remain possibilities. No flood, exodus date or historical event is asserted as established.

The fowl record adds the supplied Hebrew/Greek clause-structure comparison alongside the existing animals study, which remains visible as context. It preserves the distinction from English synonymy; Greek agrees with KJV against the Hebrew clause structure; WLC is a named digital text; Brenton is a printed Septuagint edition; neither establishes every manuscript’s reading. The Hebrew in the stored and built record retains the exact source-order combining marks.

## Display names

H/G/Q stored codes are retained. H routes to the existing Academic display group, G to the existing Translation display group; each has its own card and independent toggle. Existing T records, all 839 T witnesses, V and all existing summaries remain unchanged. Updated reader icon accessible names, category toggles/count labels and cycling, Marked filter/group labels, About/help text, hidden home description and assertions for Q’s display name: (Unanswered) Questions. H/G remain separate codes through worker payloads and built records, with regression coverage. Ask/Chat has no old H/G/Q display-label table to rename; its existing witness lead-ins and record context are retained. Historical notes and the supplied drafts retain their original terminology.

Witness-label merge: 271 applied, 0 retagged, 6 pending retained. No verse-roles.json exists for this batch; no verse-role merge run. Existing sides preserved; build and side-validation enforce exact KJV substrings.

## Validation and counts

Build and full npm check pass, including scripts/check-chat-reliability.mjs and side validation. Actual built endpoint/renderer checks confirm both Isaac records render at Genesis 22:2, and H/G cards retain Hebrew code points and the NETS paraphrase. Checks are packaged retrieval/renderer tests; no live generated-answer correctness is claimed.

New totals: 1,362 evidence records plus 6 built-in studies; 797 annotated chapters across all 66 books; 3,836 unique annotated verses; 5,365 evidence placements (1,800 key cards and 3,565 context pointers). Annotation presence is not exhaustive review.

## Release completed (2026-10-17, America/New_York)

Canonical application checkpoint: `6d2a8c24658df8f9832a5698308dde64c5fd5fac`, pushed to GitHub main. GitHub origin now uses the repository’s canonical moved address, https://github.com/kev-mac/biblelens.git. Backup: BibleLens-checkpoint-219.zip; final evidence checkpoint backup is BibleLens-checkpoint-220.zip.

Public Sites version 198, source commit `c26349146719ee996b6bcd87bfd773daf7a10b5b`, deployed successfully at https://scripture-lens.kvn-mcgwn.chatgpt.site. Deployment ID: `appgdep_6ad2f7a0fc488191bf5b5686d9926ed7`. Existing public audience preserved. Source fingerprint: `ac3756203a48e93c64c1738041086b26b442c857d75b4ffebee11a0c54f47f3d`.

`npm run release:verify -- <Sites-checkout>` passed: live site, Sites application source, www/mobile assets and canonical source match. The native cache still referenced the old ScriptureLens path; a fresh .release/ios-genesis-219 cache produced a successful signed build, without changing application source. All 27 signed App.app/public files matched www byte-for-byte before installation. iPhone installation succeeded. Launch was refused because the device was locked; no native visual-runtime claim is made.

Hosted checks confirmed: both Isaac key cards returned for Genesis 22:2; new fowl record opened from Genesis 1:20; Academic, Translation and (Unanswered) Questions controls/accessibility labels present; citation preview text exactly equals packaged KJV Genesis 1:20; rendered paragraph preserves source-order Hebrew code points and both Brenton Greek excerpts. NETS remains a paraphrase and source link; its PDF was never downloaded. Screenshots and machine-readable hosted checks are in `research/notes/genesis-sab-a-2026-10-17/`. No live generated-answer correctness is claimed.

The Sites checkout’s Git refresh was unusually slow. Its staged source was preserved, accidental filesystem permission changes were reconciled against canonical Git modes, and temporary assume-unchanged flags allowed the helper to finish its own commit/push/package flow; those flags were cleared afterwards. The prepared dist was never rebuilt separately in Sites.

