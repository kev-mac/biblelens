# Phase 2 search tuning

The Phase 2 baseline is `39a06c069a6ca7e8ce21c53d48a2ff5ed31139e3`.
The 50-query set comes from `codex/search-tests` at `0cf2c3cc9da1af83382afef3a05472dcc55e52f1`.
Both imported files are unchanged, including their older, archived results.
No original targets or accepted alternatives were added, removed, or relabeled.

| Measure | Phase 2 before | After tuning |
| --- | ---: | ---: |
| Queries with a useful hit | 40/50 | 50/50 |
| Queries with an original target | 35/50 | 48/50 |
| Original targets returned | 86/160 | 116/160 |
| Queries returning every original target | 20/50 | 34/50 |
| First useful hit within five rows | 25/50 | 48/50 |

| Query type | Useful hits before | Useful hits after |
| --- | ---: | ---: |
| References | 12/12 | 12/12 |
| People | 8/8 | 8/8 |
| Places | 5/6 | 6/6 |
| Claims and questions | 7/10 | 10/10 |
| Topics | 5/6 | 6/6 |
| Spelling variants | 3/8 | 8/8 |

## What changed

- Bounded spelling correction handles one or two edits, including swapped letters. Known entity names suppress competing fuzzy corrections.
- People use imported aliases and unambiguous curated character aliases. Places use stored aliases and linked alternative names.
- The worker and workspace share book normalization and reference parsing. Compact, abbreviated, ordinal, and spaced references reach the same passages.
- Evidence ranking includes existing study introductions and questions. Distinctive terms and heading matches outweigh loose synonyms.
- Query intent controls group order. Named people and places appear earlier; questions lead with research.
- Each verse index is decoded once per query, with two decoded book indexes retained. Term caching is bounded.
- Phone result-type buttons wrap without splitting their labels.

All matching uses packaged content. Private note contents remain in the UI's local filter and never enter corpus requests or indexes.
Evidence fields, quotations, limits, source links, and selected-edition rules are preserved.

## Automated check

Run `npm ci` when dependencies are missing or stale. Build both outputs before checking:

```sh
npm run build
npm run build:mobile
npm run check:search
```

`check:search` is included in `npm run check`. Its default useful-hit threshold is 50/50.
Use `npm run check:search -- --report .review/search-after.json` to save full results and timing.
The check calls the built worker's actual `/api/search` handler and the actual workspace `runSearch` function.
Adapters supply DOM nodes and capture result groups; matching and ordering remain production code.
The initial notebook is empty, and the selected edition is KJV. External retrieval requests are blocked.
Ranks follow the displayed group order, including rows behind “Show more.”
Additional assertions cover reference formats, invalid ranges, ambiguous aliases, unknown queries, and private notes.
These extra contracts were added after the baseline scoring run.

## Remaining limits

A useful hit is not complete recall or a judgment about a claim's truth. Forty-four original targets remain absent.
The 24-verse cap still omits Genesis 1:25–31. Nearby verses can also be missed by the passage ranking.
Broad topics remain uneven: money and justice pass through the set's existing accepted alternatives.
“Did Jesus exist” reaches a profile; the corpus still lacks a dedicated record answering that historical question.
Spelling ties and shared names can return several entries. Results are navigation aids, not identity or historical findings.
Node timings are diagnostic, not an iPhone performance benchmark. Phone browser review uses the packaged offline worker.
