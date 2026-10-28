# Scripture-Neutral Corpus Plan

B4 is local work on `codex/b4`, based on B3 `c612c17`.
No Quran content, translations, references, or implied canon have been added.

## Current Assumptions

`scripture-assumptions.json` records matching files and line numbers in first-party code and data.
The inventory excludes vendored libraries and binary assets. Compressed scripture is covered as a complete corpus.
Line numbers refer to this B4 source state. These are code dependencies, not claims about other scriptures.

| Assumption | Code and data | Consequence |
| --- | --- | --- |
| One Protestant Bible order | `data/books.json`, `src/reader-state.js`, `src/reader.js`, `worker/index.mjs`, picker and chapter checks | 66 numeric book IDs; 39/27 division; testaments, names, abbreviations and chapter totals |
| One canon | books, chapters, chapter names, timelines, evidence, people, stories, reference indexes | No Catholic, Orthodox or alternate Bible ordering; no runtime canon selector |
| Book/chapter/verse structure | `src/reader-data.js`, `passage.js`, `reader-links.js`, `workspace.js`, `citations.js`, `reference-links.js`, worker reference parsing | Numeric references, ranges, next/previous chapter navigation, citations, picker labels and selection |
| Encoded keys and IDs | `data/chapters.json`, search shards, worker/search code, notes/bookmarks/investigations in state and sync | `book:chapter:verse`, numeric packed search IDs, fixed ID validation, legacy fragment routes |
| English Bible editions | reader preferences, edition menus, `reader-state.js`, `worker/index.mjs`, `data/chapters.json` | `web`, `kjv`, `asv`; three per-verse text fields; one current reading default |
| Hebrew/Greek comparison | evidence `witness`, fields, named source editions, `witness-labels.mjs`, NETS links | Edition-specific claims; H/G/T history; Greek/Hebrew book maps; not a generic original-language model |
| KJV quotation authority | `verse-roles.mjs`, `check-verse-roles.mjs`, draft candidates, gap quote checks, commandment validators | Exact quotation checks are edition-specific; absent verses must remain absent |
| Bible annotations | red letters and their importer, chapter names, story tagging, prophecy and commandment validators | Jesus speech, OT/NT links, Maimonides numbering, linked narratives and genre-specific displays |
| Bible reference indexes | `data/reference/*`, `reference-resources.mjs`, worker answer layer | Theographic families, Nave topics, Bible geography and historical event links |
| Bible categories | `src/marked.js`, `reader.js`, `categories.js`, worker category code and evidence schema | History/science/questions plus existing internal comparison, commandments and prophecies keys |
| Product identity | package/capacitor config, manifest/offline scripts, source globals, native project metadata | BibleLens and scripture-lens names, app IDs, caches, export names and update identities |
| Content and media | evidence, stories, people, timeline, Explore assets, image slots, Store/help/privacy copy | Bible-specific topics, examples, art, source notices and descriptive counts |
| Fixed regression fixtures | first-party `scripts/check-*.mjs`, `docs/search-tests.*`, research verifiers | Counts, book numbers, verse schemes, wording and quote baselines intentionally pin today's Bible |

The JSON inventory includes every lexical match in these inspected surfaces, including native metadata.
It cannot establish that every semantic assumption has been found. New corpus work needs a second runtime audit.

## First Step In B4

`corpus-config-proposal.mjs` contains one immutable, tested proposal for today's Bible.
It identifies today's corpus, canon, file paths, unit names and edition keys.
Integration is deferred because the requested all-checks gate is not green, including B3's strict readability failure.
The shared builder retains its existing corpus paths. No runtime reference or data format changes.
When the gate clears, use this one config's paths for Worker injection in the shared web/native builder.
Keep URL, stored reference, category ID, quote rule, schema and edition defaults unchanged.
This is a proposed identity boundary, not multi-corpus support.

## Later Corpus Contract

A versioned registry would provide the following per corpus:

- Stable corpus and canon IDs; ordered sections with stable IDs and aliases.
- Unit labels and a reference adapter: parse, validate, display, compare, navigate and link.
- Text editions with stable IDs, source language, translation status, direction, licence and provenance.
- Edition-specific segment maps, missing-number policies and exact quotation authorities.
- Feature capabilities: red letters, family indexes, laws, prophecies, timelines and commentary.
- Corpus-specific collection labels, navigation examples, notices, source types and image policy.
- A packaging manifest for offline text, search, source versions and quota estimates.

For a later Quran corpus, sections could be surahs and segments ayahs.
The adapter must define its own numbering and basmala policy explicitly for each supplied edition.
Translations must have edition IDs and attribution distinct from the source text.
Arabic direction, shaping, font coverage and mixed-direction citations require device tests.
These are design requirements, not added text, a chosen edition or a claim about a single universal numbering scheme.

## Migration Boundaries

Existing Bible references must keep their meaning forever. Old links remain resolvable.
New references should use a versioned object containing corpus, canon, section and segment IDs.
A resolver can read today's unqualified references as the existing Bible corpus.
Do not rewrite synced keys in place. Use an additive versioned schema and explicit reversible migration.
Preserve offline edits, merge bases, conflict copies, server revisions and all authentication controls.
Keep device pairing, token hashing and revocation independent of corpus selection.
Test cross-device old/new clients before enabling writes in the new format.

Quotation validation must dispatch by corpus and edition. No Bible fallback may supply missing Quran text.
Search packing must stop assuming fixed book/chapter/verse digit slots before a second corpus is enabled.
Offline caching must isolate corpus/version/edition and preserve private-request bypass rules.
Release identity must fingerprint every selected corpus and edition on both web and native.

## Internal Names Retained

`internal-identifiers.md` lists the compatibility surfaces left unchanged and why.
No accepted records or research originals were overwritten. B4 wording remains a draft overlay.

## Gates And Risks

Before a second corpus: validate licences, reference schemes, typography, accessibility and community review.
Run exact quote, missing-segment, search, route, sync, offline and release-identity tests for every enabled corpus.
Never infer that a Bible category has the same role in another scripture.
Do not choose a new product name or native bundle identity as part of a data refactor.
B3's strict readability failure remains; B4 does not certify the whole accepted collection as readable or fairly sourced.
The comparison review queue exposes remaining individual reading/source work instead of assigning unsupported evidence scores.
