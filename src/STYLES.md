# Application styles

`scripts/stylesheets.mjs` defines the source order. Web and native packaging use
these same files. `shell-styles.mjs` filters the Explore and study sheets against
their declared markup. Other tools retain the full cascade. The loader waits for
styles before showing each view, and inserts study styles before the full sheet.
MapLibre CSS loads only with the interactive map, in the `components` layer.

| Layer | Responsibility |
| --- | --- |
| `reset` | Box sizing and the semantic `hidden` invariant. Declares all layer order. |
| `base` | Bundled fonts and shared root tokens. |
| `components` | Reader, controls, disclosures, directory widgets and timeline cards. |
| `pages` | Workspace layouts, collection pages and sheets. |
| `overrides.design` | Study Atlas appearance and narrowly scoped page exceptions. |
| `overrides.priority` | Existing rules that previously required `!important`, in their original order. |

Normal declarations in later layers win regardless of specificity. The priority
sublayer retains established precedence during this migration; it does not use
`!important`. Add new styles to the layer that owns the component or page.
Only `hidden` and unmodified third-party declarations retain `!important` in
stylesheets; the inline startup recovery curtain also retains its invariants.

Font refreshes replace the marked block in `base.css` and its local WOFF2 assets.
Inter is the default; explicit app-wide choices still load their selected font.
The build minifies each classic script separately, preserving shared globals
and execution boundaries. Web assets negotiate gzip; native files keep the
original bytes. `lazy-assets.mjs` lists feature dependencies. Reference matches,
chapter names and red-letter spans travel with the chapter; source data is unchanged.

Update the style content scopes when moving controls between features. Before changing
cascade precedence, compare the affected screens in both themes and viewport
sizes. The Phase 1 screenshot matrix and pixel comparisons live in ignored
`.review/` in the development worktree.
