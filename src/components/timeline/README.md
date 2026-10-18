# Timeline Event Card

Load the shared `src/style.css` first, then `TimelineEventCard.css`. Import
`createTimelineEventCard` from `TimelineEventCard.js` in a browser module:

```js
const node = createTimelineEventCard({
  title: event.title,
  traditional_date: event.traditional_date,
  discrepancy: event.has_discrepancy ? {
    academic_consensus: event.academic_consensus,
    summary: event.summary
  } : null
});
node.classList.add('theme-blue'); // Or inherit --theme-rgb from its parent.
document.querySelector('#timeline').append(node);
```

Omit `discrepancy` for an ordinary event. All content is inserted as text.
Each card gets unique heading/drawer IDs, a native 48px History button,
`aria-expanded`/`aria-controls`, and an initially inert, hidden drawer.
The grid-row transition supports arbitrary summary lengths and respects
reduced-motion preferences.

`examples/timeline-event-card.html` demonstrates both variants with placeholder
content. Serve the repository root over HTTP to load its module.

The app's navigation menu now includes **Timeline** (`#timeline`).
`data/timeline-events.json` connects ten reviewed chronology cases to stable
evidence IDs. `scripts/timeline-catalog.mjs` resolves their existing summaries,
interpretation limits and citations; the shared build packages these into
`timeline.js` for both web and native assets. There is no external runtime fetch.

The reviewed cards deliberately label the comparison **Academic evidence**:
one paper, an uncertain personal identification or a conditional anachronism
must not be presented as a universal academic consensus. A qualified History
flag opens the comparison, summary, limits, sources and review date. An
unflagged card displays its review outcome so absence of a flag does not imply
that an undated narrative has been independently verified.

Run `node scripts/check-timeline.mjs` after building. The audit record is
`research/notes/timeline-audit-2026-10-18.md`.
