# Application styles

`scripts/stylesheets.mjs` defines the source order. Web and native packaging use
these same files, and the startup bundler still emits one fingerprinted CSS file.
The vendored MapLibre stylesheet is wrapped in `components` when packaged.

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

Font refreshes replace only the marked font block in `base.css`. Before changing
cascade precedence, compare the affected screens in both themes and viewport
sizes. The Phase 1 screenshot matrix and pixel comparisons live in ignored
`.review/` in the development worktree.
