# RC1 local integration

Owner scope: Run 8. Branch codex/rc1; no publication, upstream sync, or native installation.
GitHub/Sites currency is not asserted; their synchronization is outside this local-only task.

Merge d7706a1: 976b65a. Five conflicts resolved:
- package.json: retain B6's expanded check chain and prepend B5's retry check; use B5 build 276.
- scripts/build.mjs: keep B6 build stages, fonts, reader metadata and feature bundles; add B5 retry asset and lazy Worker split.
- scripts/check-chapter-names.mjs: retain B6's full 1,189-chapter API/verse checks with B5's built-worker adapter.
- src/index.html: retain B6's hero preload and deferred feature loader order; load retry.js before the existing startup scripts.
- src/overrides.css: retain B6 priority/media/layout rules and append B5's retry status styling.

## Accepted content

`data/rc1-accepted.json` pins the exact accepted source objects. `scripts/rc1-content.mjs`
merges them for both builds; the original source collections and draft overlays remain intact.
53 evidence records: 45 G language fixes, four G History records, four narrow L academic records.
138 profiles retain explicit reference bindings and explicit-only family links.
Eight paired timeline entries retain research titles and use approved display titles.
56 D People/Stories summary pairs apply only when their exact original summary still matches.
B01–B30 use the accepted B4 two-reading previews. Labels present current statuses under the
accepted names; the Group A proposed status migration and Run 7 tier rubric are not applied.
Evidence strength remains Not assigned. Daily discovery rotates among the selected 30.
Saved questions and choices use the existing device-only backup store, outside cloud sync.

H/L03 research dispositions remain withdrawals/holds; returned objects are excluded.
I retains the two stable identifiers and holds the missing Mede article without inventing a replacement.
J retains compatible routes, the four tabs, private saves, narrative-only Stories, and deferred gallery cards.
No new Exile/Return era, public sharing, paths, quiz, glossary or word-study release is introduced.

## Draft boundary and verification

B31–B40, B4/B6 Evidence rewrites, unverified readings, Teachings & Laws, Jesus, all gap
collections, and Run 7 rubric/remap remain drafts. Production has no review/teaching endpoints.
Owner-accepted imports retain their exact wording; legacy readability is report-only.
`npm run check:readability:new` applies strict sentence/jargon/collection limits to new RC1 prose.
The RC1 content/browser verifiers cover counts, original preservation, quotes, family bindings,
preview/detail routes, local saves, full offline corpus, and production exclusion.
B5 integration also requires lazy evidence for the new Big Question endpoints, lazy spelling
corrections, and the complete offline corpus rather than the split chapter-presence index.
The mobile reference export preserves reviewed people summaries from the shared build.
Local smoke uses port 8875 with anonymous auth-boundary fixtures; port 8788 is untouched.

The production smoke probe uses normal navigation for cold reader/search routes.
An Explore-only startup has not loaded the reader route implementation; calling
its internal route method directly is not a valid cold-start probe. The smoke
also accepts B3's safe enforced directives with the script policy report-only.
Gzip response bodies are separate lazy assets, keeping the static Worker core
below one megabyte while retaining gzip negotiation and exact decoded bytes.
The draft review dropdown uses its native arrow under the existing image CSP.

## Resumed Run 8 verification

Retained the partial integration rather than regenerating its accepted snapshots.
The RC1 verifier additionally pins all eight timeline objects and the exact selected
question previews, passages, limits, sources and status-derived labels to their
review inputs. It checks every evidence object through the packaged native API,
web/native JSON parity, and allowed production IDs independently of draft catalogs.
The readability report includes the accepted imports and their disclosed notes.
New interface headings and short labels receive sentence/jargon checks; full new
prose receives the strict collection-grade check. Accepted wording is report-only.
All local browser checks use port 8875 or ephemeral test ports, never port 8788.
Smoke sign-in and anonymous-sync boundaries are local fixtures, not live identity
service verification. No signed iOS build, install or remote release is attempted.
