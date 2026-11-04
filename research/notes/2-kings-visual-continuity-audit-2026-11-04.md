# 2 Kings artwork audit — 2026-11-04

## Source and limits

Dedicated branch `artwork/2-kings-2026-11-04`, based on canonical GitHub main
`c90aa0d01679116bef5c921ed4a991e95478f2b3`, build 340. The starting checkout
was clean but behind main; it was preserved by creating the feature branch
directly from freshly fetched main. Read AGENTS.md, RELEASING.md, the build 340
release verification, and the superseding Ruth/Samuel continuity fixes first.

Sites version 329 is public. Its freshly authenticated source checkout is
`8e5c594a219ec466a210181c0bf46805fd2b5a3c`, build 340. Every file under
canonical `src`, `worker`, `data`, `scripts`, `db` and `drizzle` matched the
mirror before edits. The installed Sites helper was unavailable, so a separate
read-only Git clone was used with the fresh credential passed privately through
stdin. No mirror changes or pushes occurred. Direct live `/release.json`
access failed with proxy CONNECT 403; it was not retried or bypassed.

The task excludes merge, publication, build-number changes and installation.
No paid API, API key creation, or other book's branch was used.

## Coverage and placement

There are 25 chapter openers: 12 existing Story placements at verse 1 and 13
new chapter images at `afterVerse: 0`. The later Story at 23:31 remains there.
Generic chapter captions stay hidden; Story captions remain below the image.
Scripture, story titles, passages, starting verses and the renderer are unchanged.
The explicit illustrated-book Map adds only book ID 11, allowing 1 Kings to
finish independently. Missing 2 Kings 2 coverage now fails the shared check.

| Chapter | Opening image |
| --- | --- |
| 1 | Retained Elijah Taken Up Story (covers chapters 1–2) |
| 2 | Mantle beside the Jordan (2:13–14) |
| 3 | Retained Elisha and Moab Story |
| 4 | Corrected Widow's Oil Story v2 |
| 5 | Retained Naaman Healed Story |
| 6 | Retained Elisha and the Arameans Story |
| 7 | Abandoned camp tent and supplies (7:8) |
| 8 | Corrected Jehu's Revolt Story v2 (covers chapters 8–10) |
| 9 | Oil flask and inner room (9:1–3) |
| 10 | Dispatch scrolls (10:1–6) |
| 11 | Retained Athaliah and Joash Story |
| 12 | Collection chest and repair materials (12:9–12) |
| 13 | Retained Elisha's Death Story |
| 14 | Rocky Edom approach (14:7) |
| 15 | Retained Fall of Samaria Story (covers chapters 15–17) |
| 16 | Imagined Damascus altar courtyard (16:10–11) |
| 17 | Siege setting near Samaria (17:5) |
| 18 | Retained Hezekiah and Sennacherib Story |
| 19 | Dispatch scroll beside sanctuary curtain (19:14) |
| 20 | Retained Hezekiah's Illness Story |
| 21 | Revised law-book Story, without a speculative young Josiah portrait |
| 22 | Worn scroll and temple repairs (22:8) |
| 23 | Ash and wood beside Kidron (23:6); Fall of Jerusalem remains at 23:31 |
| 24 | Empty treasury chests (24:13) |
| 25 | Burned gateway and broken street (25:8–10) |

New chapter art portrays settings and objects, with no identifiable people or
recurring groups. These are imagined narrative settings, not exact city plans,
verified artifacts, temple reconstructions or archaeological evidence. The
mantle and scroll scenes introduce narrative objects without pretending to
reconstruct their actual appearance. Natural blue/green landscapes, red rock,
muted purple fabric and cool interiors vary the palette.

## Recurring-person and group inventory

All paths below are under `src/assets/`. Full-size active 2 Kings Story scenes
were inspected, as were the earlier 1 Kings Elijah appearances. Existing art
is retained where broadly compatible; this audit does not approve another
concurrent session's new portraits.

- **Elijah:** earlier `story-elijah-and-the-drought-v1.webp`,
  `story-elijah-on-mount-carmel-v1.webp`, `story-elijah-at-horeb-v1.webp`, and
  `story-naboth-s-vineyard-v1.webp`. Gray-black natural curls, graying beard,
  medium-brown complexion, angular nose and lean adult build recur. In
  `story-elijah-taken-up-v1.webp` Elijah is a tiny distant figure whose facial
  identity cannot be checked. Keep the existing scene; do not use that distant
  figure as a portrait anchor. A future identifiable Elijah requires approved
  clear references from the completed 1 Kings review.
- **Elisha:** `story-elijah-taken-up-v1.webp` shows him mostly from behind;
  `story-elisha-and-moab-v1.webp` and `story-elisha-and-the-arameans-v1.webp`
  show the recognizable receding/bald crown, dark side curls, medium-brown skin,
  prominent nose and beard. `story-the-widow-s-oil-and-the-shunammite-s-son-v1.webp`
  formerly put a similar man at the open door, contrary to 4:4–5; that man is
  removed in v2. `story-elisha-s-death-and-israel-s-victories-v1.webp` has an
  elderly bald, gray-bearded man. Many reigns intervene before his death; the
  text supports substantial aging, without fixing his starting age. No new
  Elisha portrait is generated. The Arameans scene retains prophet students
  as an anonymous group; their faces are not assigned to named servants.
- **Widow and two sons:** only the local oil Story depicts this family. The
  widow is not the Shunammite woman of later verses. Her medium-brown face,
  braided hair under teal cloth, build, pose and both boys' tight curls,
  complexion and proportions remain recognizable in v2. Actual v1 was supplied
  to imagegen. V2 shuts the door and removes the adult observer, matching 4:4–5.
- **Naaman and servants:** `story-naaman-healed-v1.webp`; curly dark hair,
  beard, medium-brown skin and adult build. Retained, no new portrait. The
  standing attendant is not relabeled Elisha: 5:10 says Elisha sent a messenger.
- **Jehu and messenger:** `story-jehu-s-revolt-v1.webp` → v2. Jehu's tight
  curls, beard, brown complexion and broad adult build remain; the younger
  messenger keeps his facial features, curls and slim build. Actual v1 was
  supplied as the scene and identity input. The open doorway and officers are
  replaced by a closed wooden door, consistent with 9:2–6 and opening it at 9:10.
  These are not Jehoash, Jehoahaz or Jehoram despite similar royal names.
- **Joash/Jehoash of Judah and Jehoiada:** `story-athaliah-and-joash-v1.webp`
  shows a curly-haired child and an older gray-bearded priest. Joash is seven
  at accession (11:21). Retained. The adult royal archer in the Elisha death
  scene is Jehoash of Israel, a different person. The duplicate account in
  `story-jehoram-ahaziah-athaliah-and-joash-v1.webp` belongs to the concurrent
  2 Chronicles review; no new Joash portrait depends on it here.
- **Hezekiah and Isaiah:** `story-hezekiah-and-sennacherib-v1.webp` and
  `story-hezekiah-s-illness-and-the-babylonian-envoys-v1.webp`. Hezekiah retains
  medium-brown skin, thick black curls, strong nose, beard and adult build;
  Isaiah retains graying curls/beard and leaner older appearance. Retained.
  The ordering of illness relative to the siege is not an exact age ladder.
  Later parallel depictions include `story-ahaz-and-hezekiah-s-reforms-v1.webp`,
  `story-sennacherib-s-invasion-and-hezekiah-s-pride-v1.webp`,
  `story-sennacherib-s-threat-and-hezekiah-v1.webp` and
  `story-hezekiah-s-illness-v1.webp`. Future identifiable additions must compare
  the completed reviews, including Isaiah; none are invented here.
- **Josiah/Hilkiah:** `story-manasseh-amon-and-josiah-v1.webp` showed a very
  youthful king at the law-book discovery. Josiah is eight at accession but
  the discovery occurs in his eighteenth regnal year (22:1,3), roughly age 26.
  That portrait is unsuitable as a firm adult identity reference. V2 uses a
  person-free law-book scene instead of inventing aging or borrowing unapproved
  2 Chronicles art. `story-manasseh-s-repentance-and-josiah-s-reforms-v1.webp`
  remains another book's review responsibility. Manasseh and Amon are not
  silently assigned to Josiah's figure.
- **Deported families/armies:** `story-the-fall-of-samaria-v1.webp` and
  `story-the-fall-of-jerusalem-v1.webp` retain dignified varied brown complexions,
  natural curls, family groups and belongings. The events are separated by
  generations, so recurring ethnicity is not individual identity. Neither
  family is assigned the identity of the other. Soldiers and prophet students
  likewise are not presumed to be identical people across reigns or books.

New chapter illustrations received the actual Genesis 7 style file,
`chapter-genesis-07-opening-v1.webp`, solely as style input. The two doorway
edits received their actual original Story files for identity and scene input.
The Josiah replacement received its original scene and the separate style file;
no identifiable people remain in that replacement. Generation provenance and
final hashes are recorded in the accompanying JSON ledger. Original source
versions remain unchanged, including all build 340 assets.

## Visual acceptance and pending verification

Original generated scenes and final WebP files are reviewed at full size.
The new settings have no people or animals, so there is no invented facial
continuity or anatomy to accept. The two doorway edits retain coherent visible
hands, limbs, faces and relationships; occluded body parts cannot be verified.
The temple chest candidate was rejected for a modern-looking handsaw and
repaired to remove tools. A faint geometric sky mark in the Kidron candidate
was also rejected and removed. Rejected candidates remain local, not active.

Rendered phone/iPad layouts cannot be checked here: the managed environment
has no callable browser-control tool. No substitute browser was installed and
no preview server was started. Physical devices, signing, installed build and
launch checks, signed-asset comparison and live image verification require the
coordinated Mac release session. The existing Jerusalem-scale uncertainty from
Samuel remains documented; these new broad settings do not resolve it.

Cross-book continuity integration remains a final review step after the
concurrent 1 Kings/Chronicles reviews; this branch takes no dependency on their
unapproved assets and establishes no replacement named-person portrait.
Final check results, spacing evidence and public source pin follow below.

## Final checks and handoff

- `npm run build:mobile`: passed. The shared Worker and unsigned offline bundle
  include reading/search/startup checks. Build number remains 340; this local
  candidate fingerprint is not the published build 340 fingerprint.
- `npm run check:images`: passed. It covers all 276 Story assets, all 316
  registered chapters, the separate 1 Samuel guard, exact starting verses,
  preserved scripture, alt text, captions, fail-closed coverage and source/web/
  offline image byte parity. Of 13 2 Kings Story files, 10 remain unchanged and
  3 use reviewed v2 replacements. All 26 active 2 Kings placements are covered.
- `npm run check:readability`: exit 0 in existing report-only mode; inherited
  collection findings remain. Only brief image alt descriptions changed.
- `npm run check:release`: passed all release-identity, Sites packaging/CSP,
  app-refresh, embedded encoding and pinned public-artwork checks. This is a
  local workflow check, not `release:verify` against a live deployment.
- `git diff --check`: passed. Independent source evidence verifies all 670
  baseline asset blobs unchanged, every earlier chapter-art entry unchanged,
  and byte-identical scripture, Story catalog and package/build metadata.
- Spacing: no pair below five verse positions, including chapter boundaries.
  The minimum is six, from 2 Kings 23:31 to the chapter-24 opener. The preceding
  boundary from 1 Kings 22:1 is 53; the next existing image is 1 Chronicles
  10:1, 438 verse positions after the 2 Kings 25 opener. Chapters 1–9 of
  1 Chronicles are another session's coverage responsibility. The existing
  1 Samuel 7 close pair remains untouched and documented in its own audit.
- All 13 new chapter assets were committed/pushed first at
  `ca86c6bb606968f48208d9afa95006d0a34942e9`, then pinned in the public manifest.
  Each new immutable public file was fetched and matched against local bytes.
  Prior manifest entries and local asset bytes were preserved. The allowlist
  adds only 2 Kings and does not require pending 1 Kings chapter assets.
- The first candidate Worker was 66,126,400 bytes, above the 66,060,288-byte
  limit. Re-encoding only the three new Story replacements at quality 72,
  with another full-size review, reduced it to **65,904,080 bytes**, leaving
  **156,208 bytes**. Chapter assets remain quality 85. The final mobile build
  and checks above used those smaller reviewed files. The combined ten-book
  release must check its own budget and reconcile all hosted-artwork pins;
  do not overwrite another branch's manifest additions during integration.

Evidence lives in `2-kings-artwork-generation-2026-11-04.json`,
`2-kings-source-evidence-2026-11-04.json` and
`2-kings-public-source-verification-2026-11-04.json`. Local logs are
`/tmp/2-kings-build-mobile.log`, `/tmp/2-kings-images.log`,
`/tmp/2-kings-readability.log` and `/tmp/2-kings-release-checks.log`.

The verified GitHub account is `kev-mac`, numeric ID 2168970. Commits use
`kev-mac <2168970+kev-mac@users.noreply.github.com>`, matching current main's
privacy-safe identity. Only the dedicated feature branch is pushed. No merge,
main push, Sites publication, version bump, signed build or device installation
was performed. No automatic approval review rejection occurred. The live
network denial and missing rendered/device checks remain the verification
limits described above; no unsupported continuity dependency was invented.
