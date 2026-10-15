# Offline search vocabulary and ranking

Search now uses MiniSearch for passage ranking and conservative typo correction.
The build uses `wink-lemmatizer` and the Princeton WordNet 3.1 data distributed by
`wordnet-db`; all three packages are pinned in package.json and package-lock.json.
They require no API keys or external calls during searches.

`scripts/search-vocabulary.mjs` produces a vocabulary filtered to the indexed
Bible words. It keeps single-word synonyms from the first WordNet sense per part
of speech, normalizes word forms, and caps the expansions. It does not traverse
WordNet concept relationships or include the full WordNet database in the Worker.
The current build produces 19,237 entries and indexes 31,105 verse documents.
Required third-party notices are available at `/search-licenses.txt`.

The existing hand-maintained Bible vocabulary remains authoritative for its
groups; interest/usury and loan/lend groups supplement the general dictionary.
Common question wording is filtered before retrieval. Search ranks by concept
coverage and MiniSearch relevance, with dictionary synonyms below direct matches.
Unrecognized terms still withhold results. Nearby passages supply context, and
explicit references and book scope are retained.

The land-animal food examples retrieve related dietary passages. These matches
do not establish a named-skunk rule or a present-day religious judgment. No
scripture text, research records, or Claude drafts were edited for this change.

Validation: the existing chat reliability cases and the new vocabulary suite
pass during every build. The full npm check suite passed in both the local and
clean publishing checkouts. HTTP requests to the publishing checkout's local
server returned cited passages for the original loan/skunk questions and the
misspelling `forgivness`. Production behavior requires separate verification.

Maintain the generator and the domain groups, then run `npm run build` followed
by `npm run check`. The generated vocabulary and MiniSearch index are embedded
in `dist/server/index.js`. No reader interface changes are part of this update.
