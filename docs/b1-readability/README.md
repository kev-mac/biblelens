# B1 readability drafts

Status: **draft, unverified**. Nothing here is accepted or included in application data.

The three worst collection scores after the B1 merges are People, Evidence, and Stories. Explore cards and Phase 2 interface copy already average within grades 6–8. The audit command selected the three collections; it did not select a smaller sample within them.

People and Stories have complete draft rewrites. Evidence is **partly rewritten**. Its average now falls within the target, but many original sentences still need individual work. A passing report-only command does not mean that Evidence meets the sentence and jargon rules.

| Collection | Records | Audited lines | Accepted FK | Draft FK | Accepted overlength lines | Draft overlength lines | Accepted jargon lines | Draft jargon lines |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| People | 47 | 47 | 8.64 | 6.69 | 16 | 0 | 1 | 0 |
| Evidence | 1,933 | 6,035 | 7.89 | 6.79 | 3,619 | 2,825 | 3,356 | 2,070 |
| Stories | 276 | 276 | 7.76 | 6.56 | 77 | 0 | 2 | 0 |

The Evidence overlay changes 1,706 fields across 1,676 records. It applies 107 explicit sentence pairs and 49 manually drafted fields. Every new replacement sentence has at most 20 words. Unchanged prose remains in the overlay for an honest collection score. **1,714 Evidence records remain held** for long sentences, jargon, or both. These are editorial tasks, not requests to waive the writing standard.

B3 adds 81 exact sentence pairs. These improve 373 fields across 368 records compared with B2, and clear 20 of the 1,734 held records. They do not finish the queue. Strict draft mode still fails. No rule uses a general synonym replacement or automatic clause split.

The Romans/James record `coverage-nt-faith-works` has an additional meaning hold. Its scope includes a Rahab discussion whose intended placement is unclear. That field remains verbatim and appears in the meaning table. Removing or moving it would change the supplied scope.

## Review files

- [Evidence original/draft pairs](evidence.json), [each changed field and its meaning check](meaning-checks-evidence.md), and [remaining work by ID](outstanding-evidence.md).
- [People original/draft pairs](people.json) and [all 47 meaning checks](meaning-checks-people.md).
- [Stories original/draft pairs](stories.json) and [all 276 meaning checks](meaning-checks-stories.md).
- [Exact repeated sentence pairs](scope-rules.json) and [manual field proposals](field-overrides.json).

People and Stories reuse the complete drafts from `11ebeca349d2a00d37adcb9f6847d28f07c129b5`. Their originals still match the accepted B1 data exactly. All 43 story flags and 13 people flags remain open. The earlier three Explore meaning flags remain with the original plain-language review and are not silently accepted here.

Every overlay record and replacement proposal carries `reviewStatus: "draft, unverified"`. JSON also keeps the original text verbatim, stable IDs, and existing meaning flags. The tables list every changed field. None is imported by application code or the production build.

## Meaning limits

Evidence edits only simplify supplied wording. They add no research, verdict, source, certainty, or historical claim. Exact repeated passages are replaced as whole sentences. No general synonym rule or automatic clause splitting is used. Unique passages without a reviewed rewrite remain unchanged and flagged.

Full edition names stay in each draft's `sourceEditionNames` and unchanged `sources`. When a proposal uses numbered Greek editions, the key is explicit: edition 1 is Tischendorf's eighth edition; edition 2 is Textus Receptus. This key must remain visible if Kevin later accepts those proposals for UI use. These aliases must not be integrated without their Sources labels. The old Greek translation means the cited Brenton edition, not every ancient Greek copy.

The manual pass checked negation, conditional language, attributions, source limits, numbers, identity alternatives, and possible reconciliations. During review, a proposed claim that an edition “does not list differences” was narrowed. The final text says it is not a guide to readings across ancient copies. That preserves the original critical-apparatus limit without claiming that an edition has no notes at all.

These checks do not establish semantic equivalence. Kevin's meaning review remains open. Default: keep all drafts unaccepted; continue the Evidence editorial work before integrating it.

## Reproduce

Run from the B1 worktree after the required dependency install and web/mobile builds:

```sh
npm run check:readability
npm run check:readability -- --drafts
node docs/b1-readability/verify-drafts.mjs
```

The first command reports accepted collections. The second reports all three draft overlays using the same `assess` and `report` functions. Both are report-only unless `--strict` is supplied. Strict draft mode currently fails because Evidence remains incomplete.

The verifier checks exact originals, IDs, metadata, source links, draft flags, the explicit transformations, source aliases, and table agreement. It checks full sentences without quote exemptions in every newly written replacement and all People/Stories drafts. It also confirms that unresolved Evidence fields remain flagged. Existing Scripture quotes are retained.

To recreate the Markdown tables from the checked JSON pairs, run `node docs/b1-readability/verify-drafts.mjs --write-tables`. The script writes only this folder. It never edits application data.
