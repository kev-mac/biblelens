# Reader controls: owner browser comments

Implemented the eight directly supplied browser comments on October 13, 2026 (owner local date).

- Mobile category filters occupy one evenly spaced row of six icons. Text labels remain on desktop; accessible labels and tooltips identify every category and count. Circular corner counts use the same background/foreground tokens as paging and Send buttons, including zero counts.
- Mobile Reader settings uses a gear in a 40px circle matching the paging controls. Existing book, chapter, edition, Compare and A+ controls remain in its settings sheet.
- Scripture highlights require an open individual comparison icon and an enabled category. Initially closed icons produce no highlight; closing an icon or disabling its category removes the corresponding marks. Opening overlapping comparisons keeps the most recent icon's color and falls back to another open comparison when closed. Record/context peers remain synchronized. Scripture and red-letter text are preserved.
- Category circles have 1px borders when off or unavailable, and 3px when on. Unavailable categories expose false pressed state. Individual comparison circles retain thin off and thick on borders.
- Top paging uses the same round controls and horizontal navigation arrangement as the bottom block. The center contains the chapter description; settings sits beside Next on mobile. The chapter title remains above scripture, with the duplicate subtitle removed.
- Brand uses navy and orange: navy text/outline, orange monogram background and Lens accent. Dark mode uses readable navy-family light text and brighter orange. Existing category palettes remain unchanged.
- Expanded citations are direct flex children, flowing horizontally and wrapping across book boundaries. Show fewer uses the same row flow; citation previews and navigation remain intact.
- All four paging arrows use 18px SVGs with the same viewBox, 2px stroke and arrow geometry as the Send icon, rotated horizontally.

Build and full npm checks passed, including the new production renderer regression for initially closed, individual-off and category-off highlights, overlap fallback and red-letter preservation. The 18 chat tests are fixtures, not live generated-answer evaluation.

Actual built Worker browser checks passed in Edge at widths 320, 375, 492, 534, 600, 601 and 1280, each in light and dark mode (14 views). Verified no horizontal overflow, one evenly spaced mobile icon row, hidden visual labels with accessible names, corner counts, availability/pressed border state, matching gear/paging sizes, matching Send/paging SVG sizes, settings controls, previous/next chapter behavior, individual/category highlight toggles and horizontal wrapped expanded citations. Screenshots were reviewed at both comment widths, narrow phone and desktop. Evidence is in the adjacent ui-mobile-controls-2026-10-13 folder.

Data, research drafts, Worker source, Chat behavior, citation logic and red-letter data have no Git diff. Evidence remains 906 records plus six studies. Annotation presence is not exhaustive review.

Checkpoint and publication evidence is retained in this chat's outputs and automation memory.
