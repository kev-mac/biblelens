**TL;DR:** Live walkthrough in progress. The owner’s first difference is a glowing Read contradiction summary versus a plain-text character summary. Abraham is the detailed comparison profile; the owner authorized “Any in Genesis”; the paired example is Genesis 1:11, “Plants before people—or after?”. No treatment has been selected. No app files have changed.

This live decision list starts at D1. The earlier solo audit in report.md remains separate and is not an owner-approved decision list. Neither the earlier nor later card style is automatically preferred; choices will be made independently for the parts the owner likes.

### D1 — Owner’s words

> “the contradiction summary on the Read page (a glowing glass card) and the character summary in the character profile popup (plain text)”

**Example:** Abraham. Its profile data includes places, relatives, three linked stories and thirteen key verses. The live Overview visibly shows the biography, Places and Scripture anchors. Relatives are in Connections; linked stories are farther down Overview. We will inspect those together as needed.

**Captured:** [Annotated summary](screenshots/live-D1-abraham-annotated.png), [unaltered screenshot](screenshots/live-D1-abraham-raw.png), [measurements](live-D1-measurements.json).

**Measured at the live panel width:** dark theme; viewport 581 × 1239 CSS px. Summary text block 520 × 132.73 px; text 16.1 px / line height 26.565 px. Zero padding, zero radius, no border, transparent background, no shadow or blur. This describes the paragraph itself; the surrounding popup has its own surface.

**Owner’s example selection:** “Any in Genesis”.

**Read example:** Genesis 1:11 — “Plants before people—or after?”. Expanded live to confirm it includes a quoted primary passage, reasoning, a Genesis 2:5 reference and a Details & sources action.

**Visual confirmation:** The summary is a separate glass card; Abraham’s biography is a paragraph on the surrounding popup surface. Their content roles differ (an interpretive assessment versus a biography); that may justify different emphasis, but it does not by itself require different surface treatment.

[Annotated side-by-side comparison](screenshots/live-D1-comparison.png) · [Read annotation](screenshots/live-D1-genesis-annotated.png) · [unaltered Read screenshot](screenshots/live-D1-genesis-raw.png) · [expanded supporting details](screenshots/live-D1-genesis-expanded.png) · [Read measurements](live-D1-read-measurements.json).

| Measurement | Read contradiction summary | Abraham biography |
|---|---|---|
| Block size | 532 × 181.52px | 520 × 132.73px |
| Corners | 20px | 0; paragraph has no own surface |
| Padding | 16px top, 18px sides, 42px bottom | 0 |
| Text / line height | 17.48 / 27.97px | 16.1 / 26.57px |
| Fill | Dark base + orange radial tint | Transparent; popup surface behind it |
| Border | 1px orange at 50% opacity | None |
| Shadow | Outer shadow/glow + inset highlights | None |
| Backdrop blur | 18px | None |
| Behavior | Chevron expands; summary supports double-click/Enter | Static biography |

These sizes reflect the current 581 × 1239px live browser panel, not the earlier desktop/phone test widths. Height also varies with text length and wrapping.

**Pending together:** Owner’s description of which differences matter; equivalent category summaries; rich story cards; character-list cards. Options and a recommendation will follow the walkthrough. Nothing is selected for implementation.

### Owner clarification and supplied examples

> “The earlier edits are formatted well with a few inconsistencies, but the  later edits (commandments, people, etc.) are even more inconsistent. this analysis is an attempt to get consistency.”

> “some of the new cards look good or have elements i like, so I'd liek to be able to decide”

**Interpretation:** Establish a consistent system while allowing the owner to select good elements from either generation. Do not assume “earlier wins,” copy one entire page onto the others, or equate consistency with identical content. No new P2 design is being proposed.

All six supplied screenshots have been preserved locally, including the temporary screenshot files. [Source manifest and image dimensions](owner-examples.json).

| Owner image | Example | Evidence |
|---|---|---|
| 1 | Commandment: To acknowledge His unity | [Original](screenshots/owner-01-commandment-raw.png) · [Annotated](screenshots/owner-01-commandment-annotated.png) |
| 2 | Character-list card: Moses | [Original](screenshots/owner-02-moses-raw.png) · [Annotated](screenshots/owner-02-moses-annotated.png) |
| 3 | Contradiction: Water or ground: the animals’ origin — collapsed | [Original](screenshots/owner-03-contradiction-collapsed-raw.png) · [Annotated](screenshots/owner-03-contradiction-collapsed-annotated.png) |
| 4 | Same contradiction — expanded with Primary passages · KJV | [Original](screenshots/owner-04-contradiction-expanded-raw.png) · [Annotated](screenshots/owner-04-contradiction-expanded-annotated.png) |
| 5 | Story: The Line of Seth | [Original](screenshots/owner-05-seth-story-raw.png) · [Annotated](screenshots/owner-05-seth-story-annotated.png) |
| 6 | Academic: A solid sky dome? — expanded | [Original](screenshots/owner-06-academic-expanded-raw.png) · [Annotated](screenshots/owner-06-academic-expanded-annotated.png) |

**What the examples establish:** Story, Commandment and Moses list cards already have their own colored surfaces, borders and glow. They are not all plain-text blocks. The plain biography inside the profile remains a separate D1 issue. Category tint can intentionally differ while geometry and interaction stay consistent. The collapsed and expanded orange screenshots show legitimate states of the same kind of card; expansion alone is not being called an inconsistency.

### D2 — Passage/reference controls: choose the elements to keep

**Owner evidence:** images 1, 2, 4, 5 and 6. This is an analyst description of the supplied examples, not an invented owner quotation.

Commandments and Stories use large pill-shaped passage controls; Moses uses rounded rectangles and a separate “All 16 passages” link; expanded evidence uses smaller glowing reference pills. [Reference comparison board](screenshots/live-owner-D2-reference-options.png).

**Live measurement of image 6’s matching Academic example:** at 568 × 1027 CSS px, its reference pill is 64.5 × 30.06px, 13.8px text / 22.08px line height, 3px 7px padding, pill radius, 1px blue border and 14px backdrop blur. Other supplied screenshot crops have pixel dimensions only; exact CSS measurements must be matched to the live example and viewport rather than inferred from the images. The earlier browser inventory supplies separate historical measurements, not measurements of these crops.

Draft choices for later owner selection:

- **A:** Use compact evidence-style pills throughout. Benefit: dense, familiar references. Risk: under-44px visible targets and crowded touch interactions unless target sizing is addressed.
- **B:** Use the larger Moses rounded rectangles throughout. Benefit: roomier, clearer touch controls. Risk: substantially increases evidence-card height and wrapping.
- **C:** One consistent family with two roles: roomy passage navigation, compact evidence citations. Benefit: retains good elements from both. Risk: the two roles must stay easy to recognize and accessible.

All are reversible. All can fit P1 or P2; these choices do not select a glass redesign. Page/control counts and final recommendation remain pending the chosen scope.

### D3 — Expanded reference layout: beside versus above quotations

**Owner evidence:** image 4 puts each reference above a full-width quotation and adds “Primary passages · KJV”; image 6 places each reference beside its quotation. The matching live Academic card confirms a grid arrangement, with a 64.5px reference beside a 410.5px quote area at the measured width. [Live measurements](live-owner-read-examples.json) · [live annotation](screenshots/live-owner-academic-annotated.png).

The expanded orange screenshot’s matching layout has now been verified live on Marked. Marked has explicit stacked-reference CSS at `src/style.css:1363–1364`; the live Read Academic example uses the beside-quotation arrangement. This is a verified Read-versus-Marked presentation difference; it should not be attributed to category color alone.

Draft choices for later owner selection:

- **A:** References beside quotations. Benefit: compact scanning. Risk: narrows long quotations on phones.
- **B:** References above full-width quotations. Benefit: roomy reading and clear passage separation. Risk: taller expanded cards.
- **C:** Beside on wide layouts, above on narrow layouts. Benefit: adapts to available space. Risk: requires a clearly tested breakpoint and consistent order.

All are reversible and compatible with either P1 or P2. These are independent of the card surface and chip-shape choices.

### Running owner decision list

- **D1 — Glass summary versus plain-text character biography:** owner selected: “D1: E-style main summaries, including biographies; match D to E; keep B for Chat and C for section introductions.” Review choice recorded only; no app changes performed.
- **D2 — Passage/reference control family:** owner selected **C, D, F, H, J** from the complete comparison boards. Exact owner wording: “D2: C/D/F/H/J”. These are retained style choices only; replacement mapping for unselected controls remains to be reviewed. No implementation authorized or performed.
- **D3 — Expanded quotations beside/below reference chips:** owner selected: “D3: E for quotations; keep A, F and C/D for their different purposes, and B for short commentary.” Use E as the quotation layout, including replacing G in the proposed mapping; retain A for reference lists, F for paired references, C/D for comparison sections, and B for short commentary. Review choice recorded only; no app changes performed.

- **D4 — Search and question-entry boxes:** owner selected: “D4: C for all list searches; keep E for Chat.” Apply Commandments' magnifier/pill treatment to list searches in the proposed mapping; preserve Chat's question composer and send arrow. Review choice recorded only; no app changes performed.

- **D5 — Quick filters:** owner selected: “D5: A sizing for text filters; preserve meaningful colors; selected indicator will be a brighter color, not checkboxes; keep C’s toolbar layout pending a corrected preview.” This supersedes the suggested checkmark indicator. C's board crop needs correction before visual approval. Review choice recorded only; no app changes performed.

  **Sizing revision:** owner subsequently instructed: “Apply that compact sizing to D5 too.” This replaces A's full 48px sizing with compact pills with less padding and 44px phone tap areas; preserve meaningful colors, brighter selected colors without checkboxes, and C's toolbar arrangement pending a corrected preview.

- **D6 — Filter options in panels:** owner selected: “D6: compact pills with less padding; 44px phone tap areas; preserve grids, icons and meaningful colors.” Review choice recorded only; no app changes performed.

- **D7 — Inline navigation restriction:** owner said: “I saw D7-E being used in verses and didn't like it. It distracts from the reading. buttons and chips should not be used in inline text. The colored text is good enough. The pin indicator is should not be larger than the text. Remove it if the size can't be reduced.” Record inline references as colored text links without button/chip backgrounds, borders or padding. Any inline pin must be no larger than surrounding text; omit it if that cannot be achieved. This overrides the proposed pill treatment within verse text and other inline prose, including any conflicting proposed mapping from D2. Standalone controls remain a separate, undecided D7 choice. Review rule recorded only; no app changes performed.

- **D7 — Related navigation:** owner selected: “D7: keep your suggestions for standalone controls, but use colored text links within sentences, with pins no larger than the text.” Retain compact standalone navigation pills, destination icons, two-line linked-story details, All-passages arrow, family-row layout, visibly identifiable character-name links, quieter noninteractive taxonomy labels, and 44px phone tap areas. Within sentences use colored text links, never chips; pins no larger than surrounding text, omitted if they cannot be sized appropriately. Review choice recorded only; no app changes performed.

- **D8 — Dropdowns and value pickers:** owner selected: “D8: H-style dropdowns; consistent compact grids; compact step pills; heading with dropdown cue; 44px phone tap areas; A pending preview.” Use H-style rounded dropdowns for B/D/H/I/J/K, consistent compact grids for C/F, compact step pills for G/L, and a subtle dropdown cue on heading E. A requires a corrected preview. Review choice recorded only; no app changes performed.

- **D9 — Tabs, switches and sliders:** owner selected: “D9: keep your suggestions, with A’s 20px icons for F and 44px phone tap areas.” Here “A’s 20px” refers to Option A on the supplemental icon-size comparison, not D9-A's switch. Preserve Categories switch with On/Off text; matching compact 14px tabs with brighter selection; clear current-mode label; text-size slider with percentage; category icons outside verse sentences, 20px visible size with brighter active state; 44px phone tap areas and keyboard focus/appropriate keyboard behavior. Size illustration: boards/D09-F-size-comparison.png. Review choice recorded only; no app changes performed.

- **D10 — Expand and inspect controls:** owner selected: “D10: consistent label-and-chevron rows; small in-card chevrons; clear Sources controls; matching compact History controls; single activation and 44px phone tap areas.” Preserve category icons/counts, keyboard focus and Enter/Space support; avoid nested interactive targets when making rows clickable. Review choice recorded only; no app changes performed.

- **D11 — Utility actions:** owner selected: “D11: brighter main actions; compact secondary pills; text-only reset/reference links; clear action feedback; 44px phone tap areas; E/M pending previews. Bookmark image should be a ribbon instead of a diamond, Copy link should use two chain links instead of arrow.” Retain backup/restore safeguards. Ribbon applies to bookmark actions; linked-chain icon applies to Copy link, distinct from a Copy text action. Review choice recorded only; no app changes performed.

- **D12 — Navigation and icon actions:** owner selected: “D12: consistent quiet 20px icons; matching close buttons; 48px floating buttons with 24px icons; preserve navigation and map layouts; 44px phone tap areas. For W, use two-paper overlay icon instead of chain link.” W uses overlapping-paper copy imagery. D11 Copy link retains its separate chain-link choice. Preserve accessible names and visible keyboard focus. Review choice recorded only; no app changes performed.

- **D13 — Text fields and note editors:** owner selected: “D13: E-style editors and matching title fields; 12px corners; modest padding; readable text and clear focus; preserve native file chooser.” Review choice recorded only; no app changes performed.

- **D14 — Dialogs and panels:** owner selected: “D14: shared calm panel styling; 24px corners; centered desktop panels and phone bottom sheets; compact 18px verse preview; modest spacing and reachable actions.” Additional owner requirements: “H - Map should be in English, be more zoomed in by default and be longer”; “L - Should use sans serif text for consistency throughout the app”. Interpret longer as taller map surface, pending visual preview; preserve exact owner wording. English map labels and default zoom require a later feasibility/provider check; no provider change assumed. L's note editor uses sans serif. Review choice recorded only; no app changes performed.

- **D15 — Cards and content blocks:** owner selected: “D15: J-based cards, 22px corners, modest padding and restrained glass; preserve category colors and layouts; quieter inner sections; keep Chat bubble and map frame; sans serif headings.” Additional owner directions:
  - Chat bubbles should look like iPhone bubbles, with bottom-right cleft/tail for the owner and bottom-left for BibleLens; remove visible “You” and “BibleLens” names. Preserve programmatic speaker identification. Show a three-dot typing indicator while BibleLens is thinking. These supersede preserving the existing Chat bubble shape in D15-C; retain the distinct conversation role.
  - “Map shouldn't show current streets as they did not exist in biblical times. Elevations and terrain are also not needed.” Combined with D14: English labels, closer default zoom, taller map; a simplified map without modern streets, elevations or terrain. Provider/data feasibility remains to be checked before implementation; do not invent historical geography.
  - “E should use san serif text heading.” Apply sans serif headings to the legacy perspective block, consistent with the D15 heading choice.
  - “D is small enough that it doesn't need to be expanded and collapsed. Put all info on the card.” Commandment cards should show their information directly; this supersedes D10's disclosure treatment for those card contents.
  - “Italicize all cited verse text.” Applies to quoted verse wording, rather than reference labels or surrounding commentary.
  - “Remove the \"(History)\" text from the Academic button.” Use “Academic” as the visible label on the affected button; this overrides earlier proposed “History” naming where it refers to that Academic control. Other History controls require role-based mapping.
  - Review choices only; no app changes performed.

- **D16 — Focus:** owner selected: “D16: consistent blue focus ring, 2px with 2px gap; theme-adjusted contrast; whole-field focus; distinct from selection.” Review choice recorded only; no app changes performed.

### Final review checkpoint

See [final-decisions.md](final-decisions.md) for the consolidated D1–D16 choices, later overrides and remaining mapping questions, and [corrected pending previews](boards/corrected-pending-previews.png) for recaptured D5-C, D8-A and D11-E/M. Pending previews are displayed for review, not automatically approved. No implementation is authorized. D8-A's old hidden-input crop is superseded by its actual visible cells, grouped with D8-F. The final summary supersedes earlier recommendations; the original screenshots and decision history remain available.

Moses’ double outline may be a focus/selection state rather than a different permanent card border; verify in the live interface.

**Next walkthrough prompt:** identify the elements in the six examples that the owner likes. Preserve the owner’s wording; then compare the selected examples live. Do not implement or finalize all style choices as one bundle.


### Complete comparison pack

The independent gap check and grouped boards are saved in [comparison-boards.md](comparison-boards.md) and [comparison-boards.html](comparison-boards.html). These preserve D1–D3 and add D4–D16. No owner style choices have been assumed. See [coverage-gaps.md](coverage-gaps.md) for the exact test matrix and source-only states.

### D17 — Glass appearance

Owner selected a Settings slider with **Off, Subtle, Liquid**, default **Subtle**, and requested a simultaneous comparison before any app edits. Preview: glass-appearance-preview.html. Proposed effect strengths are for review; no app files or preferences changed. The original P2-design exclusion is relaxed only for this explicitly requested glass-level preview, not a complete P2 redesign.

### D17 appearance refinement — owner feedback

The owner said the initial preview looked like thicker borders, more background blur and lower opacity, and requested stronger depth, edge refraction and frost. The preview uses CSS and SVG filters, not React; React would manage components rather than provide the optical effects. The revised Liquid treatment uses deeper layered shadows, a denser frosted fill with fine grain, directional inset highlights and a masked displacement-filter rim. Borders remain 1px; text remains outside the distortion layer. This is a proposed simulation, not a validated reproduction of native iPhone Liquid Glass. SVG backdrop-filter support varies; unsupported rendering falls back to a highlighted rim, without actual displacement. Exact rendering and performance remain unverified in a live app. Optional local preview adjustments expose frost, depth and edge distortion. No app files changed.

### D17 superseding revision — plain surfaces and opacity only

Owner: “I don't like any. I prefer the Off option in your previous reply with slightly more opacity than the Liquid option in that reply. Maybe just make the opacity adjustable.”

This supersedes both glass previews and the Off/Subtle/Liquid preset decision. Use the plain Off-style geometry and flat surface, adjusting only background opacity. Do not reduce text opacity. Do not add blur, glow, refraction, frost grain or glass depth effects. The separate preview surface-opacity-preview.html starts at 80% (slightly above the revised Liquid base fill of about 70%) and offers 50–100% for exploration. These numbers are proposed preview values, not a confirmed default or final range. The selected shapes/layouts from D1–D16 remain; this later material decision overrides glass-effect wording in D1/D15. No app files or app preferences changed.

### D17 preview baseline correction — actual Story colors

Owner requested: “Use the current Story card’s colors and opacity as the starting point for the slider preview so I can compare it accurately. Don’t change app files yet.” The revised surface-opacity-preview.html starts at the current Story card's base alpha 0.10 and preserves its fixed 0.18 top-left gradient, using RGB(99,102,241), verified against src/style.css:1254–1259 and the captured D15-J computed style. At the gradient's strongest point the combined alpha is 0.18 + 0.10×0.82 = 0.262. It uses the current dark page background colors from src/style.css:663. A fixed baseline and adjustable example are shown together. The slider adjusts the base fill only (0–100% exploratory range); text and the 18% gradient remain unchanged. The old generic 80% starting point and widget state are not reused. As requested in the preceding D17 revision, glass blur, glow and bevel effects remain disabled in both samples, so these are accurate color/opacity comparisons, not screenshots of the complete current card appearance. No app files changed. The eventual app default and range remain unconfirmed.

### D17 confirmed base opacity bounds

Owner: “20% opacity should be the max. 10% should be the default. What about gradient levels?” Base fill default is now confirmed at **10%**, with maximum **20%**; preview minimum remains proposed at 0%. The preview keeps the current 18% gradient peak while its base slider is limited to 0–20%. At base 10%, peak combined opacity is 26.2%; at base 20%, peak is 34.4%. Therefore the 20% cap currently applies to the base fill, not total composited opacity. This distinction has been surfaced to the owner; do not claim a 20% total opacity cap or silently change the gradient. A gradient-level decision remains open. No app files changed.

### D17 confirmed gradient control

Owner: “Add a separate gradient strength slider from 0–18%, defaulting to 18%. Show me both sliders in the preview so I can compare the combinations. Don’t change app files yet.” Confirmed gradient range **0–18%**, default **18%**, independent of base opacity (default **10%**, max **20%**). The fixed reference retains base 10% / gradient 18%; the adjustable sample uses both sliders and displays the combined alpha range. Gradient 0% creates a flat tint. The preview base minimum remains 0%, proposed rather than explicitly selected. No app files or preferences changed.

### D17 five levels and reset — supersedes earlier gradient bounds

Owner requested gradient maximum **20%**, default **15%**, an icon-only reset to defaults, levels labeled **1, 2, 3, 4, 5**, and removal of combined-opacity text. Preview maps five steps to 0%, 5%, 10%, 15%, 20% for each slider; this mapping is an explicitly stated interpretation of the numbered-level request. Base default is level 3 (10%); gradient default is level 4 (15%). One reset icon restores both defaults; it has no visible text label but retains an accessible name. The fixed current-app reference remains base 10% / gradient 18%, accurately reflecting the unchanged app rather than the proposed new default. Combined-opacity text is removed. No app files changed.

### D17 presentation refinement — no visible values

Owner: “Don't show the numbers. Put the reset icon where the blue 3 is now.” Remove displayed level values and numbered ticks from both sliders, and numeric styling values from comparison captions. Move the single reset icon into the base-opacity heading row, aligned right where its numeric output was. Keep the five internal steps, existing defaults, maximum values and screen-reader value descriptions. Reset still restores both controls. No app files changed.

### D17 approved — final preview

Owner: “Looks good. Save this as D17 and update the final decision summary with all my changes. Show me anything still undecided.” The final opacity/gradient preview is approved as D17. Defaults: base 10%, gradient 15%; both use steps 0/5/10/15/20%, without visible numbers; reset icon beside Base opacity restores both. Approved snapshot: D17-approved-preview.html; structured decision: D17-decision.json. final-decisions.md has been rewritten as the current summary, with superseded proposals removed from that summary and retained here as history. Pending: D5-C, D8-A, D11-E/M corrected-preview signoff and D2 replacement mapping. No app edits authorized or performed.

### Corrected previews approved; D2 mapping requested

Owner: “D5-C keep; D8-A merge, but I may revert this change; D11-E/M keep. Show me your recommended D2 replacement mapping before changing app files.” Recorded D5-C and D11-E/M as approved; D8-A merge approved with the explicit option to revert. D2-replacement-mapping.md recommends A/B/E/G/I → J-style standalone controls (preserving prophecy pairing); K → D-style text links. C/F/H remain standalone evidence citations; within sentences use D text links. Mapping awaits owner choice. No app edits authorized or performed.

### D2 mapping approved — design review complete

Owner: “D2 mapping approve. Update the final decision summary and show me anything still unresolved before changing app files.” A/B/E/G/I → J-style standalone controls; K → D-style colored text link; C/F/H citation family retained; D-style inline links everywhere; D3-F prophecy pairing and existing destinations/preview actions preserved. All D1–D17 design selections, corrected-preview choices and D2 mapping are now approved. D8-A/F merge remains reversible at the owner's request. Unresolved practical details: feasible map source; exact Chat tails/typing appearance; compact spacing, map height/zoom; theme/phone accessibility and behavior verification. No app implementation authorized or performed.
