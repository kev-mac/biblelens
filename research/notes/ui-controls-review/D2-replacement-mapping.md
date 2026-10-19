# D2 — approved replacement mapping

**TL;DR:** Keep the selected C/F/H family for small standalone citations, J for standalone passage actions, and D for links within sentences. Replace inconsistent standalone passage shapes with J's compact rounded treatment without removing any references or changing what they open. Preserve paired prophecy layouts. Owner approved this mapping with “D2 mapping approve.” This is design approval only; implementation remains on hold.

| Existing style | Location/job | Approved replacement | Preserve |
|---|---|---|---|
| **A** | Character-profile key-verse list | **J** compact standalone citation/passage treatment | All verse links, ordering, destinations and list layout |
| **B** | Character-directory passage actions | **J** compact standalone treatment | Full passage label and existing read action |
| **E** | Commandment passage action | **J** compact standalone treatment | Passage destination; D15 requirement to show card information without collapsing |
| **G** | Prophecy prediction/fulfillment nodes | **J** treatment for each passage control, within the **D3-F paired layout** | Origin/fulfillment labels, pairing/directional relationship and current action |
| **I** | Story's main passage action | **J** compact standalone treatment | Full passage range; retain a useful navigation arrow where it communicates the read action |
| **K** | Timeline passage link | **D** colored text-link treatment | Keep its standalone line/context and current navigation; no need to add a chip |

## Selected styles retained

- **C/F/H:** one small standalone evidence-citation family in Chat, Marked and Read, with consistent geometry/spacing and meaningful category colors. Retain each action's current destination or preview behavior; a style change does not silently turn preview into navigation.
- **D:** colored links within running text everywhere, including inline occurrences of any other family. No chip background, border or button padding in sentences.
- **J:** compact rounded standalone citation style in Stories and the replacement family for the direct-passage controls above. Use readable text and retain full ranges; allow wrapping rather than truncate essential references.
- Apply D17's plain surfaces, category colors and approved opacity/gradient settings instead of restoring the old glow. Keep 44px phone tap areas, non-overlapping and separate from prose selection.

**Benefit:** three clear roles with consistent styling, using only owner-selected families; no separate large passage-button family needs to be selected.

**Risk:** J's compact treatment makes major passage actions less prominent than the current larger buttons. Retain clear labels/placement and check wrapping/tap spacing. If the owner wants more emphasis for a main passage action, J can retain its compact shape with a stronger selected/primary color, subject to a preview.

**Reversible:** yes. Preserve source-component distinctions so the appearance can be adjusted without removing data, actions or paired relationships. P1 compatible; the rejected liquid-glass treatment is not part of this mapping.

## Scope

Six previously unselected source families reviewed: A/B/E/G/I/K. Four page areas get a different standalone-control treatment: Characters (directory/profile), Commandments, Prophecies and Stories. Timeline gets an explicit text-link consistency rule and may need no geometry change. Every inline occurrence follows D7 regardless of page. Exact rendered-control totals vary with content; do not substitute audit screenshot counts for affected controls.

## Approval

Owner: “D2 mapping approve. Update the final decision summary and show me anything still unresolved before changing app files.” All mappings above are approved. No app edits authorized or performed.
