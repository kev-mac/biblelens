# Scripture Lens

This snapshot packages KJV, WEB and ASV scripture for all 66 books and 1,189 chapters, with KJV as the default. Reading and existing annotations do not require AI requests.

## Annotation coverage

The annotation collection is **incomplete**. As of this snapshot, 236 chapters across all 66 books have annotations, covering 2,074 distinct verse locations. The other 953 chapters have no attached annotations. Even annotated chapters have not received an exhaustive research review.

The initial expansion added 64 assessments and enhanced three existing comparisons. Subsequent checkpoints add forty-one Exodus, twenty-nine Leviticus and thirty-eight Numbers and thirty-one Deuteronomy assessments and consolidate duplicate records. Sources, reasoning and interpretation limits are available through Details & sources. Internal literary comparisons are distinguished from independent historical or scientific evidence. No general claim of comprehensive review is made.

`research/coverage-audit.json` lists every chapter and its actual annotation locations. `research/notes/` records researched passages, source-access limitations and outstanding work. The reader keeps unannotated verses blank, as requested.

Reader tags start closed and independently toggle their summary, citations and Details & sources. History tags are gold, Contradictions peach/orange and Science green throughout both themes. History and Science display only explicit discrepancies; agreement and background assessments remain saved in the research collection. Coverage counts describe stored research attachments, not the number of visible discrepancy tags.

## Build and check

Requires Node.js 22 or later; no dependency installation is needed.

```text
npm run build
npm run check
npm start
```

Open http://127.0.0.1:8787 after starting. The local reader and packaged annotations work without internet after extracting this package. External source links require internet. Chat searches packaged passages and studies locally, with conversational excerpts and source links. It needs no account, API key, paid AI service, or internet connection. No credentials are included.

The automated check exercises all 1,189 chapters and every comparison mode, verifies reference bounds, confirms each evidence placement and checks duplicate annotation IDs. These checks do not certify scholarly completeness or visual browser behavior.

## Hosted version

https://scripture-lens.kvn-mcgwn.chatgpt.site

The existing hosted audience is preserved. Source identity is retained in `.openai/hosting.json`; it is not an authentication credential.

Compare is an on/off switch enabled by default. Read and Ask replace Explore and Chat. Both themes use warm tan/orange palettes. Red-letter markup preserves the packaged text and follows publisher speech spans; see data/red-letter-provenance.json and research/notes/reader-warm-red-letters.md for attribution and boundary limits.
