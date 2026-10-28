# Plain-language drafts

Review drafts for all 8 Explore card blurbs, 276 story summaries and 47 people summaries. Each draft sits beside its exact original and ID. These files do not change app copy or data.

## Source and files

The source snapshot is fetched `origin/main` at `346bdfd173bb04d54745cd2164a23b9bf905eadd`. The Writing standard and readability checker come from `codex/readability-standard` at `8e2cd1b87419d909e9bcc54a7d822fd9052447d5`.

- [Explore cards](explore-cards.md): all eight `copy` fields from `src/atlas-explore.js`, including the deferred cards. IDs are the existing route values. Other card fields are outside this draft collection.
- [Stories, JSON](stories.json) and [Stories, Markdown](stories.md): every summary from `data/stories.json`, in source order. The source has no stored story ID. IDs use the app’s existing lowercase book/title slug rule, as used by linked stories. Book, title and passage are unchanged.
- [People, JSON](people.json) and [People, Markdown](people.md): every summary from `src/data/characters.json`, in source order, with the existing ID and name.
- [Readability checker](check-readability.mjs): a byte-for-byte copy of the requested branch’s script.
- [Draft verification](verify-drafts.mjs): checks the pairs and applies that checker’s logic to the originals and drafts.

Each JSON record has `original`, `draft` and `flags` fields. A nonempty `flags` array marks an item for meaning review. Markdown contains the same text and flags, plus estimated grades for each summary.

## Method and self-review

I read and drafted every record myself, then reviewed every change against its original. I used only the supplied records for content. I did not research, correct, combine or expand their accounts.

The edits split long sentences and use familiar words where the meaning stays the same. Clear parts remain intact. Short definitions explain terms already present, such as covenant, circumcision and ark. Names, quantities, relationships, event order, negation, attribution and limits were checked against the source. Metaphors and unspecified acts remain unspecified when a simpler phrase would choose an interpretation.

The second pass reviewed the wording changes in all 331 pairs. A capitalized-word screen helped check that names were retained. A separate number-word screen checked written quantities as well as digits. Differences such as “double” becoming “twice,” or defining tithes as a tenth, retain the quantity already expressed. These screens support the reading review; they cannot prove that two passages mean the same thing.

Flags record places where simplification could change meaning, including wording retained to avoid that risk. They are review notes, not new claims or corrections to the source. For example, the drafts retain “all flesh,” the two uses of “house” in the promise to David, the title Christ, and unspecific descriptions of violence. Some source terms and names, such as cherubim, seraph and Areopagus, remain flagged rather than receiving unsupported detail.

## Grade results

Grades target 6–8 **averaged per collection**, as the Writing standard requires. Individual records can fall outside that range. The method is the supplied Flesch–Kincaid estimate: `0.39 × words/sentences + 11.8 × syllables/words − 15.59`. It estimates syllables from English vowel groups and uses `Intl.Segmenter` for sentences. Each nonempty field line counts once, and the collection result is the arithmetic mean of those line grades, not one score for all joined text. Every summary or blurb here is one line.

| Collection | Items | Before grade | Draft grade | Before over length | Draft over length | Before jargon screen | Draft jargon screen | Flagged items |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Explore cards | 8 | 15.52 | 7.42 | 0 | 0 | 0 | 0 | 3 |
| Stories | 276 | 7.76 | 6.56 | 77 | 0 | 2 | 0 | 43 |
| People | 47 | 8.64 | 6.69 | 16 | 0 | 1 | 0 | 13 |

There are **59 flagged items** out of 331. Each item counts once even if its note raises more than one concern.

All draft sentences have at most 20 words, and each Explore blurb has at most 15 words. The copied checker excludes Scripture/source-title fields and quoted prose spans. The draft verifier also checks full draft sentences and blurbs without quote exemptions. It does not count headings, IDs, source passages or review notes as app prose.

The jargon screen checks only the terms listed in the supplied script. The three original hits are uses of “witness,” including a song and an altar serving as evidence; they do not refer to ancient copies. Zero draft hits does not establish that every word is familiar to every reader. The meaning flags and self-review remain necessary. Grades are estimates, especially for names and short blurbs.

## Reproduce the checks

From the worktree root, run:

```sh
node docs/plain-language/verify-drafts.mjs
```

The base snapshot has no `check:readability` npm script. This local driver imports the unchanged requested checker and runs it on the three draft collections, without changing `package.json` or the app’s scripts. Use the driver rather than running the copied checker directly: the copy retains its original default directory logic.

Verification checks all 331 unique IDs, verbatim originals, source metadata and source-file contents at the recorded commit. It also checks Markdown/JSON agreement, numeric digits, the copied checker’s bytes, sentence/card limits, screened jargon, and collection averages. Tracked changes must stay in `docs/plain-language/`. No build, release or sync checks are needed for these documentation drafts.
