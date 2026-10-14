# Reader browser comments — 2026-10-14

Implemented the nine direct owner comments against the current Site source, retaining its glass palette, Inter/Lora fonts and passage tools. No Claude draft or research evidence content was changed by this UI work.

- Light-mode summaries and citation pills use pale glass backgrounds and readable dark ink. Dark mode retains its darker glass palette.
- Comparison titles and Reader settings use Inter, matching summary typography.
- The question field sits under the Read/Chat/Saved menu and uses a chat-bubble submit icon.
- The open-book control beside the question field replaces the chapter bookmark button and opens a glass dialog with book, chapter and verse selection. Existing saved chapter records are retained.
- Edge arrows are wider overlay controls. Their clickable area is limited to the arrow height so verse numbers remain usable, and the text column has no added margins.
- Holding a verse opens its WEB preview with highlight/bookmark actions; keyboard Enter offers the same actions. Bookmarks glow deep orange; selected verses use transparent glass. Highlights/bookmarks persist in browser storage, appear in Saved, and participate in backup export/import and research export.
- Available categories are on by default. Switching one off hides its related summaries while keeping verse icons. Switching it on opens all related summaries. Individual icons retain independent toggles.

Validation: build and complete npm check suite passed, including 18 deterministic chat fixtures. Actual browser QA at 561x1004 verified light/dark appearance, Inter title/summary parity, one header question field, category-off retaining 13 Q icons while hiding all Q summaries, and category-on opening all four Q cards. Passage selection navigated to Ezekiel 4:9. Verse actions were tested through keyboard and actual held-pointer input; bookmark/highlight persistence survived reload and appeared in Saved. Transparent selection resolved to rgba(255,255,255,.08); bookmarked number resolved to rgb(200,90,23). Checks at 320 and 513px found no horizontal overflow. Wider edge control measured 44px; chapter text remained 546px at the 561px viewport (including the browser scrollbar).

All 1,232 evidence records and selected Claude draft/note hashes matched the integration checkpoint. Fixture checks do not establish live generated-answer correctness. Annotation presence is not exhaustive review. Site access was reported public and preserved.
