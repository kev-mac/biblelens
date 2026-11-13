# Translation data provenance
Retrieved 2026-11-13 from the publisher's [BSB translation tables](https://berean.bible/downloads.htm), direct file https://bereanbible.com/bsb_tables.tsv.
The input SHA-256 and byte length are recorded in data/translation/manifest.json.

The publisher's [terms](https://berean.bible/terms.htm) dedicate the Berean Bible and Majority Bible texts to the public domain, effective April 30, 2023; all uses are freely permitted. The [licensing page](https://berean.bible/licensing.htm) states that no license application is required. These terms expressly link the Berean Interlinear Bible too. No account, key, paid service, Blue Letter Bible content, or proprietary alignment is used.

The source table supplies English BSB order (BSB Sort), original-language text (WLC / Nestle Base), transliteration (Translit), language (Hebrew, Aramaic, Greek), and BSB English associations. We retain the base column, not the expanded variant-edition column. This is the text supplied with the publisher's table; it is not a claim to reproduce any modern critical edition or every ancient manuscript.

This is BSB word association data. It is neither a KJV/WEB/ASV alignment nor a new literal gloss. The selected English edition is displayed separately. The publisher's often many-to-one associations and English additions do not establish a one-to-one translation. Empty English links remain marked as source words without a separate English phrase. Empty source links remain explicitly unavailable. Four source rows containing multi-clause additions are flagged; the UI does not present those clauses as a single source-word translation. Publisher textual notes are retained as plain text.

Import: node scripts/import-translation.mjs /absolute/path/to/bsb_tables.tsv
The importer strips display-only HTML, keeps brackets, notes, diacritics, and publisher associations, validates schema/language/order, excludes empty spacers, maps Psalm to Psalms, and splits/gzips by canonical book/chapter. It performs no automated linguistic alignment or transliteration. Raw 85,525,369-byte input is deliberately not committed or bundled.

Coverage: 1,189 chapters, 31,086 populated verse records, 443,626 word/phrase associations. Hebrew occurs in 22,878 verse records, Aramaic in 268 (including mixed Daniel 2:4), Greek in 7,941. Language counts overlap on mixed verses. 16 traditional NT verse numbers have no BSB table translation: Matthew 17:21; 18:11; 23:14; Mark 7:16; 9:44; 9:46; 11:26; 15:28; Luke 17:36; 23:17; John 5:4; Acts 8:37; 15:34; 24:7; 28:29; Romans 16:24. The packaged corpus also has Romans 14:24-26; the table has those concluding verses at Romans 16:25-27. We do not silently remap them. Those 19 references show unavailable. Other Books (noncanonical collection) has no table coverage.

Compressed chapter files total 7,078,262 bytes. Web uses immutable GitHub source files through a same-origin length/hash-checked route. Native builds copy exactly the same gzip files and work offline. Full data is never embedded in the hosted Worker. The source pin and all per-chapter checksums are in the manifest.


Four source words lack transliterations: Numbers 23:13; Ruth 4:6; Proverbs 17:27; Proverbs 18:17. Their tiles say “Transliteration unavailable”; no Latin spelling is generated. The missing-reference list and source file hash are machine-readable in the manifest.
