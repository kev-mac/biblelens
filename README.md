# Scripture Lens

This snapshot packages KJV, WEB and ASV scripture for all 66 books and 1,189 chapters, with KJV as the default. Reading and existing annotations do not require AI requests.

## Annotation coverage

The annotation collection is **incomplete**. As of this snapshot, 161 chapters across all 66 books have annotations, covering 1,124 distinct verse locations. The other 1,028 chapters have no attached annotations. Even annotated chapters have not received an exhaustive research review.

The initial expansion added 64 assessments and enhanced three existing comparisons. Subsequent checkpoints add forty-one Exodus assessments and twenty-three Leviticus assessments and consolidate duplicate records. Sources, reasoning and interpretation limits are available through Details & sources. Internal literary comparisons are distinguished from independent historical or scientific evidence. No general claim of comprehensive review is made.

`research/coverage-audit.json` lists every chapter and its actual annotation locations. `research/notes/` records researched passages, source-access limitations and outstanding work. The reader keeps unannotated verses blank, as requested.

## Build and check

Requires Node.js 22 or later; no dependency installation is needed.

```text
npm run build
npm run check
npm start
```

Open http://127.0.0.1:8787 after starting. The local reader and packaged annotations work without internet after extracting this package. External source links require internet. Hosted AI Chat requires its existing authenticated Sites environment and configured API access; it is unavailable in the local reader. No credentials are included.

The automated check exercises all 1,189 chapters and every comparison mode, verifies reference bounds, confirms each evidence placement and checks duplicate annotation IDs. These checks do not certify scholarly completeness or visual browser behavior.

## Hosted version

https://scripture-lens.kvn-mcgwn.chatgpt.site

The existing private audience is preserved. Source identity is retained in `.openai/hosting.json`; it is not an authentication credential.
