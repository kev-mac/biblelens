# Lost Books reader corpus

`books.json` is the per-book edition and rights catalog. `chapters.json` holds only
reading text. `manifest.json` extends the preserved attempt-one audit in
`research/notes/ux14-source-audit.json`, including excluded translations, pending
books, source hashes, count mappings and passage comparisons.

The canonical catalog and chapter corpus remain unchanged. Build code appends
IDs 66–85 to the public reader catalog and shares that state with web and native.
Keep these IDs fixed: append future books without reordering existing IDs, so saved
notes, highlights and shared passage links continue to identify the same text.

Apocrypha uses eBible's standardized 1769 KJV bulk VPL archive. Its XML export
independently confirms every locator within that archive. Gutenberg ebook 124
provides a second digitisation: the letter of Jeremiah maps to Baruch 6; its
Sirach 44:22 combines eBible 44:22–23; its Prayer of Manasseh has no verse labels.
The source's 15 divisions for that prayer are retained. Esther's source chapters
10–16 map to reading chapters 1–7, with the source chapter displayed in the reader.

Mattison's six undated web translations carry explicit public-domain dedications.
Do not infer publication dates from related commercial editions. Each is one
reading chapter; numbered reading paragraphs are not ancient verse numbers.
Source page numbers and gaps are preserved, including Mary's missing-page notice.
Section headings and translation notes are excluded from reading text. The
source links retain access to those notes. Ten Thomas passages across the book
match a separate PDF copy of Mattison's public-domain translation.

Enoch, Jubilees and Pistis Sophia remain pending, with reasons in the manifest.
No modern Robinson/Nag Hammadi Library translation is included.

Import from the snapshots retained under `~/git/codex-reports/UX14-logs/`:
`python3 scripts/import-lost-books.py SNAPSHOT_DIR` (requires beautifulsoup4).
Importing regenerates the book and chapter files; the reviewed manifest must be
updated deliberately. `npm run check:ux14` verifies the manifest and browser flow.
