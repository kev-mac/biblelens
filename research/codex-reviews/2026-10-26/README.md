# Codex review units — 2026-10-26

**201 reviewed inputs: 188 fixed and ready for owner acceptance; 13 still open for Claude research.**

The fixed inputs yield **187 proposals**, because the two Song oath drafts are combined.
The ready set contains 45 translation proposals, 138 profiles and four History/timeline pairs.
None has been integrated into app data or accepted by the owner.

See [fixes-applied.md](fixes-applied.md) for each draft’s changes and verification.
See [fixes-verification.json](fixes-verification.json) for source checks, quote checks, schema results and final file hashes.
Run `node research/codex-reviews/2026-10-26/verify-fixes.mjs` for the read-only local checks.
The 13 returned record objects remain unchanged. Their reasons are listed below.

The original verdicts were 0 accept, 188 accept with fixes and 13 return.
The individual review files retain that history. The fixes log records corrections to two mistaken review instructions.

## Counts by unit

| Unit | Inputs | Ready for owner | Open fixes | Return | Review |
| --- | ---: | ---: | ---: | ---: | --- |
| D16 | 12 | 11 | 0 | 1 | [d16-genesis-second-pass](d16-genesis-second-pass.md) |
| D25 | 8 | 5 | 0 | 3 | [d25-ot-remainder-1-second-pass](d25-ot-remainder-1-second-pass.md) |
| D26 | 11 | 11 | 0 | 0 | [d26-ot-remainder-2-second-pass](d26-ot-remainder-2-second-pass.md) |
| D21 | 5 | 2 | 0 | 3 | [d21-esther-second-pass](d21-esther-second-pass.md) |
| D10 | 6 | 5 | 0 | 1 | [d10-2-corinthians-second-pass](d10-2-corinthians-second-pass.md) |
| D8 | 8 | 8 | 0 | 0 | [d8-ecclesiastes-second-pass](d8-ecclesiastes-second-pass.md) |
| D9 | 5 | 4 | 0 | 1 | [d9-song-of-solomon-second-pass](d9-song-of-solomon-second-pass.md) |
| C1 | 12 | 12 | 0 | 0 | [c1-exodus-wilderness-characters](c1-exodus-wilderness-characters.md) |
| C2 | 15 | 15 | 0 | 0 | [c2-joshua-ruth-characters](c2-joshua-ruth-characters.md) |
| C3 | 15 | 15 | 0 | 0 | [c3-samuel-kings-characters](c3-samuel-kings-characters.md) |
| C4 | 14 | 14 | 0 | 0 | [c4-kings-characters](c4-kings-characters.md) |
| C5 | 14 | 14 | 0 | 0 | [c5-ezra-daniel-characters](c5-ezra-daniel-characters.md) |
| C6 | 17 | 17 | 0 | 0 | [c6-prophets-job-characters](c6-prophets-job-characters.md) |
| C7 | 17 | 17 | 0 | 0 | [c7-gospels-characters](c7-gospels-characters.md) |
| C8 | 14 | 14 | 0 | 0 | [c8-acts-characters](c8-acts-characters.md) |
| C9 | 11 | 11 | 0 | 0 | [c9-gospel-remainder-characters](c9-gospel-remainder-characters.md) |
| C10 | 9 | 9 | 0 | 0 | [c10-acts-remainder-characters](c10-acts-remainder-characters.md) |
| E2 | 1 | 0 | 0 | 1 | [e2-mesha-moab-revolt](e2-mesha-moab-revolt.md) |
| E3 | 1 | 0 | 0 | 1 | [e3-shishak-campaign-karnak](e3-shishak-campaign-karnak.md) |
| E4 | 1 | 1 | 0 | 0 | [e4-jehu-tribute-shalmaneser](e4-jehu-tribute-shalmaneser.md) |
| E5 | 1 | 0 | 0 | 1 | [e5-samaria-fall-sargon](e5-samaria-fall-sargon.md) |
| E6 | 1 | 0 | 0 | 1 | [e6-tiglath-pileser-menahem-pekah-ahaz](e6-tiglath-pileser-menahem-pekah-ahaz.md) |
| E7 | 1 | 1 | 0 | 0 | [e7-esarhaddon-manasseh-tribute](e7-esarhaddon-manasseh-tribute.md) |
| E8 | 1 | 1 | 0 | 0 | [e8-merodach-baladan-hezekiah-embassy](e8-merodach-baladan-hezekiah-embassy.md) |
| E9 | 1 | 1 | 0 | 0 | [e9-nebuchadnezzar-egypt-campaign](e9-nebuchadnezzar-egypt-campaign.md) |
| **Total** | **201** | **188** | **0** | **13** | |

The seven evidence batches contain 55 inputs: 46 fixed inputs yield 45 proposals; 9 remain returned.
The ten character batches contain 138 fixed profiles and no returns.
The eight academic cards contain 4 fixed History/timeline pairs and 4 returns.
Counts are per input draft. Combining the two Song oath drafts does not create two accepted app cards.

## Original review provenance

The sections below describe the original review. Current fixes, counts and validation are in the linked fixes log.

### Original review provenance

The sections below describe the original review. Current fixes, counts and validation are in the linked fixes log.

### Inputs and boundaries

- Worktree: `/Users/kevin/git/BibleLens-reviews`; branch: `codex/review-units`.
- Fetched `origin`; created this worktree from `origin/main` at `55e438a1071ac8629d5197cbf6c6db9d8346873e`.
- Queue: `codex/open-items:docs/open-items.md`, commit `53645665c44cdf6084f0fc8b88e6d7fc2ccad9d7`.
- Writing standard and checker: `codex/readability-standard`, commit `8e2cd1b87419d909e9bcc54a7d822fd9052447d5`.
- Draft arrays and batch notes: Git objects at `f64e37cad5249adb660ab5377acbad2f52e04270`, under `research/claude-drafts/`.
- Those draft inputs were read through Git, including files absent from the new main-based checkout. No other worktree was edited.
- Read `AGENTS.md`, `RELEASING.md`, `CLAUDE.md`, the draft README, batch notes, remediation notes and the integration workflow.
- The main tree, Phase 1 tree, other worktrees and stashes were left untouched. No stash, clean or reset was used.
- No build, build-number change, release script, push, PR, publication or deployment was run.

The reviewer performed the work and self-review without sub-agents.
Input hashes, source responses, language matches and schema checks are retained in [audit.json](audit.json).
The audit file is review evidence under research; it is not an application data patch.

## Checks completed

- Read each of the 201 records and its batch notes, checking its stated claims, limits and overlap with the current app.
- Checked 1,125 profile key-verse entries against packaged KJV chapters. Checked all evidence refs and every academic passage range.
- Checked 59 single-verse evidence quotations and three joined quotations against packaged KJV text.
- Matched 124 Hebrew/Greek quotation spans to the cited digital source, preserving letters, accents and punctuation after Unicode normalization.
- Checked 180 further Hebrew/Greek snippets in explanatory fields: 92 match exactly and two are lists of separately matching forms.
- The remaining 86 simplified forms, headwords or alternate wordings need the precise prose fixes listed per draft.
- Read the surrounding source wording when the proposed meaning was doubtful. A matching span is not a lexical endorsement.
- Screened 36 profile quotation spans of three or more words, then checked their context. Four require wording or capitalization fixes.
- Checked 334 profile story links. Eighteen need replacement or removal; their exact target fields are listed in the unit notes.
- Checked profile names and family targets against the combined 185-profile set. Sixty-five need explicit reference bindings.
- Checked all 99 unique URLs declared by the evidence and academic drafts. All returned HTTP 200 during review.
- Read 17 further Brenton English pages to check supplied glosses. The audit lists all 116 direct-response checks and content hashes.
- Read the relevant parts of the four cited older academic works. Opened later translations, catalog records and published scholarship as listed per card.
- Also checked the three Hebrew source pages used for the academic name, verb and captivity-word comparisons.
- Recorded failed modern-source access. Search snippets and blocked pages were not treated as verified critical editions.

Sources were checked as digital editions. This is not a survey of all ancient copies or a fresh reading of inscriptions.
Direct HTTPS retrieval was used where the web reader could not open an otherwise readable source.
HTTP success alone was not treated as support for a claim.

## Schema and self-review results

The raw inputs have five failing evidence records, eighteen failing character records and eight failing timeline cards.
Some first errors hide later errors. In particular, Ezra 9:14 and Nehemiah 5:18 quotes point to the wrong verse.
The notes list those side-reference repairs as well as the three invalid primary ranges and two KJV quote mismatches.

Mechanical repairs were simulated in memory using the repo validators:

- All 55 evidence records pass evidence, witness, reference and exact side-quote validation after the listed schema repairs.
- The combined 47 current plus 138 proposed profiles pass character schema validation after the listed link and geography repairs.
- Each academic card fails on its missing evidence ID. Supplying a temporary review fixture exposes the second failure: an unflagged academic comparison.
- The eight cards remain Context proposals. Move their verified content into complete History records; do not invent discrepancy flags.
- The simulations did not alter files in `data/` or `src/`. They do not count as acceptance of the unresolved research.

Family binding checks extend beyond the character schema. Mary must link to Joseph of Nazareth, not the patriarch.
David’s daughter Tamar must not link to Judah’s daughter-in-law. Names alone also confuse several other profiles.
A reference binding does not approve every inherited family edge. Preserve each profile’s explicit identity and kinship limits.

Self-review checked all 201 unique IDs, the 25 unit totals, links between these notes and every verdict.
It also checked raw input hashes against the pinned Git objects and checked the final change scope.
No app integration or UI test was claimed; this task authorized notes only.

## Shared writing fixes

Keep each record’s uncertainty, attribution and scope. Do not add a stronger claim while shortening prose.
All prose sentences must have at most 20 words. Card blurbs must have at most 15 words.
The grade target is 6–8 across each collection; scripture and quoted source titles are exempt.
Each unit lists the exact fields, screened sentence numbers, word counts and opening text needing attention.
The checker is a screen, so quoted scripture must be preserved even when quote punctuation affects a count.

Use the old Greek translation and the Hebrew text at first mention. Keep full edition names in Sources.
Explain the two printed New Testament editions in plain words. Use ancient copies for technical manuscript/witness language.
Retain the exact schema witness enums; prose wording changes do not rename those data values.
Keep miracles, divine speech and narrative judgments attributed to the texts. Do not assume the reader shares those beliefs.

`npm run check:readability` ran on the unchanged app. It completed in report-only mode with existing findings:

| Collection | Lines | Mean grade | Over length | Jargon lines |
| --- | ---: | ---: | ---: | ---: |
| Evidence | 6,035 | 7.89 | 3,619 | 3,356 |
| Stories | 276 | 7.76 | 77 | 2 |
| People | 47 | 8.64 | 16 | 1 |
| Explore cards | 8 | 15.52 | 0 | 0 |

This is not a clean readability result. These baseline findings were left for the separate content work.
Run the check again after any later draft integration or prose edit.

## Return to Claude research

These thirteen drafts cannot be accepted through copy or schema fixes alone:

- [`simeon-and-levi-came-upon-the-city-boldly-or-securely-genesis-34-25`](d16-genesis-second-pass.md): The draft admits that the KJV sense can include the proposed secure/confident sense. Printed words alone do not establish a meaning change. Claude must show a distinct contextual meaning from a cited lexical source, or withdraw this T proposal.
- [`went-northward-or-passed-to-boraan-judges-12-1-greek`](d25-ot-remainder-1-second-pass.md): The claim that Βοῤῥᾶν names a place is not established by the quoted Greek. Brenton's own English reads north. Capitalization is not proof of a place name. Claude must resolve this with a cited lexical discussion before claiming a T difference.
- [`orpah-kissed-her-mother-in-law-or-and-returned-to-her-people-ruth-1-14-greek`](d25-ot-remainder-1-second-pass.md): The owner already rejected this Orpah addition because Ruth 1:15 gives her return in the same passage. Accurate quotation does not reopen that ruling. Withdraw the repeated proposal; do not seek a new ruling under a new ID.
- [`the-almighty-or-the-sufficient-one-ruth-1-20-greek`](d25-ot-remainder-1-second-pass.md): The proposed sufficient/Almighty distinction is not shown to exclude the KJV sense. Brenton's English uses Mighty One. Claude needs a cited contextual sense distinction, not a new English gloss alone.
- [`i-had-held-my-tongue-or-i-disobeyed-the-adversary-is-not-worthy-of-the-court-esther-7-4-greek`](d21-esther-second-pass.md): The disregarded/disobeyed gloss and the proposed changed meaning lack a cited lexical check. Brenton's English uses consented, and the draft admits the statements may make the same point. Claude must establish the contextual difference before a T card can be accepted.
- [`laid-a-tribute-upon-the-land-and-the-isles-or-wrote-upon-the-kingdom-of-land-and-sea-esther-10-1-greek`](d21-esther-second-pass.md): The claim that the Greek describes writing instead of a levy is not established. Brenton's English explicitly describes a tax. Claude must check the verb in context; a literal gloss alone is insufficient. A separate islands/sea finding would need its own narrowed draft.
- [`mordecai-next-unto-the-king-or-took-over-from-king-artaxerxes-esther-10-3-greek`](d21-esther-second-pass.md): The draft's succeeded interpretation is not shown to differ from a deputy role. Brenton's English calls Mordecai a viceroy. Claude must document the contextual sense before claiming a succession difference.
- [`our-authority-which-the-lord-hath-given-us-or-which-the-lord-gave-2-corinthians-10-8-greek-new-testament`](d10-2-corinthians-second-pass.md): Both clauses remain conditional under ἐάν. The future form alone does not establish an unconditional promise to boast. Both also call the authority ours, so missing to us does not establish a different recipient. Claude must show a distinct meaning, or withdraw this T proposal.
- [`let-my-kinsman-come-down-into-his-garden-first-clause-greek`](d9-song-of-solomon-second-pass.md): The invitation occurs in packaged KJV 4:16, immediately before 5:1. This is not a demonstrated added meaning in the passage. Claude must compare across the verse boundary, or withdraw the addition claim. Bread/honeycomb is expressly outside this draft and cannot rescue it without a new scoped proposal.
- [`mesha-moab-revolt`](e2-mesha-moab-revolt.md): Cook confirms the basic Omri/Moab comparison, but the draft fixes the stone at c. 850 BCE and calls the accounts the same revolt. Neither point is established by that comparison. The Louvre catalog and the translation adapted from Smelik support a ninth-century setting and the named rulers, not a settled alignment of every event. Claude must resolve the date and the son/forty-years wording against a current edition, or remove those proposed alignments. Keep victory claims attributed to Mesha. Existing numbers-gad-ataroth-inscription covers Gad at Ataroth only; do not silently replace its scope with the whole revolt.
- [`shishak-campaign-karnak`](e3-shishak-campaign-karnak.md): Breasted sections 709–717 support a damaged place list and his proposed identifications. His campaign date is about 926 BCE, not proof of the draft’s c. 925 date. The statement groups Gibeon, Beth-horon and Ajalon with securely northern towns without adequate support. Claude must supply current name readings and a qualified geographical grouping. Remove the claim that missing Jerusalem was in a gap as an established fact; it is Breasted’s suggestion. Replace the same-campaign certainty with a qualified usual identification. Do not infer contradiction from silence.
- [`samaria-fall-sargon`](e5-samaria-fall-sargon.md): The cited Rogers passages and the open Posen excerpt support Sargon’s claim, 27,290 people and fifty chariots. Correct the biblical wording: 2 Kings 18:10 says they took it; 17:6 says the king of Assyria. Do not use the proposed accession handover as a settled reconciliation. Claude must verify the annal’s damaged opening, chronology and assignment of the capture against a current edition. Keep the separate Sennacherib chronology issue separate.
- [`tiglath-pileser-menahem-pekah-ahaz`](e6-tiglath-pileser-menahem-pekah-ahaz.md): Keep the biblical thousand talents, not Rogers’s introductory thousand shekels. His translated lists support Menahem and Jehoahaz, and his fragment has Pekah/Hoshea. Claude must verify the restored subject and agency in that damaged passage, the Pul/Pulu equation and Jehoahaz/Ahaz identification against a readable current edition. Do not let Rogers’s index alone establish all identities. Do not revive the withdrawn Azariah of Ja’udi equation.

The Jehu, Manasseh, Merodach-baladan and Egypt cards now have complete linked History Context drafts.
They are ready for owner acceptance; no app integration was performed.
The other four still need Claude’s source work on dates, names, restorations or the capture sequence.

## Owner items

No new owner ruling is required to finish this review. The existing queue retains these choices:

- **O1:** Keep the current Prophets era or add Exile and Return. C5 can retain the valid Prophets value meanwhile.
- **O2:** Decide whether and how to include a Jesus profile. No Jesus draft is among these 138 profiles.
- **Story scope:** The queue’s 21 backlog holds and earlier tabernacle-instructions hold still need a narrative-versus-teaching scope decision. Remove held links from profiles meanwhile.

The owner’s Orpah ruling already stands. The repeated draft is returned for withdrawal, not a fresh permission request.
Gallio E1 has no completed research draft and is outside the eight reviewed cards. It remains a Claude research item.
The 185-profile total is not proof of complete character coverage or an approved target of about 250.
