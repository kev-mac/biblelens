# Default theme update — 2026-10-13

Applied the owner's exact eight light and eight dark tokens. Kept --green as primary and --rust as accent. Replaced all sixteen listed old default values in src/; the search found them only in the original default blocks in style.css. Final default token declarations override older cascade layers; retained blue, high-contrast and black-and-white palette blocks are unchanged. Layout, all tag chip colors, all summary tints and both red-letter colors are unchanged. No research or evidence records were edited.

## Text contrast

Ratios use WCAG sRGB relative luminance. Panel and page background are checked separately.

| Theme | Text | Panel | Background | Target |
|---|---|---|---|---|
| Light | Body text | 15.19:1 | 14.14:1 | 4.5:1 |
| Light | Muted text | 5.79:1 | 5.39:1 | 4.5:1 |
| Light | Primary / links | 7.15:1 | 6.65:1 | 7:1 |
| Dark | Body text | 13.28:1 | 14.94:1 | 4.5:1 |
| Dark | Muted text | 7.26:1 | 8.18:1 | 4.5:1 |
| Dark | Primary / links | 7.80:1 | 8.78:1 | 7:1 |

Body and muted text pass 4.5:1. Primary passes 7:1 except light primary on the page background (6.65:1). Exact supplied values are retained; links still pass 4.5:1 on both surfaces. Filled primary controls have 7.15:1 or 6.65:1 light text contrast, and 7.80:1 or 8.78:1 dark contrast.

## Chips, discrepancy toggles and red letters

All T/V/Q and category discrepancy toggles pass 4.5:1 against their own unchanged chip fills in both themes: T 7.62:1; V 7.55:1; Q 7.07:1; History 7.28:1; Contradictions 7.25:1; Science 8.60:1; Context 8.00:1; Plain 11.50:1. Compare On/Off text inherits body ink and passes. Primary links pass 4.5:1 against the new panel and background in both themes.

Red letters: light panel 6.33:1, light background 5.89:1; dark panel 7.21:1, dark background 8.12:1. These pass.

Below 4.5:1: unchanged dark red letters (#ff9290) on pale targeted verse highlights: T 1.71:1; V 1.69:1; Q 1.75:1; History 1.77:1; Contradictions 1.75:1; Science 1.91:1; Context 1.82:1. Light red letters on these fills all pass. This is an existing overlay-color limitation, not a failure of red letters against the new page or panel. Colors are left unchanged as instructed.

Verification is deterministic color calculation and source checks, not live rendered-browser testing. Adjacent JSON retains unrounded values. Build and full checks passed before publication.
