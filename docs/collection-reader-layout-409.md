# Collection and Reader layout: build 409

These four approved changes were implemented independently from the existing local source, alongside the expanded story summaries. The rejected Explore branding change is excluded.

- Filter rows show an edge fade only when more controls are off screen. There is no overflow chevron. Rows wrap at widths of 768px and above. Keyboard focus, scroll position, asynchronous updates, selected filters and changing viewport width retain their normal behavior.
- Collection headings share typography and spacing. Compact Back controls keep a 44px target, and title text has its own column rather than overlapping actions. Timeline and Prophecies use the same heading treatment.
- The wider Reader uses a 700px maximum reading layout and a 240px opening image. Phone artwork retains its 16:9 shape.
- The chapter heading remains prominent. Story captions remain visible, smaller and italic. Generic chapter artwork does not acquire an invented caption.

## Verification

Run the shared release preparation, plus `check:rc1`, `check:collection-layout:browser`, `check:collection-layout:mobile`, `check:story-cards:browser` and `check:story-cards:mobile` before publication. The focused collection matrix exercises Chromium and WebKit at 320, 390, 767, 768 and 1280px, twelve collection routes, hidden/returning selections, breakpoint changes, keyboard focus, history, no-overflow states, and Genesis 4/7 Reader headings and imagery. The offline variant requires zero API network requests.

Publish only the exact prepared web artifact and install native assets with the same build and source fingerprint. Follow `RELEASING.md` and verify both installed devices after publication.
