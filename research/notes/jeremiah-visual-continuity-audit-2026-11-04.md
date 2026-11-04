# Jeremiah artwork audit — 2026-11-04

## Source and scope

Jeremiah only, reader book ID 23, 52 chapters. Dedicated branch
`artwork/jeremiah-2026-11-04` starts at freshly fetched canonical GitHub main
`846ba46`, build 341. The original clean `work` checkout was preserved.
AGENTS.md, RELEASING.md, the build 341 release verification and combined review,
and the relevant Kings/Chronicles continuity audits were read before artwork.
The first GitHub fetch failed with transient HTTP 503; the second succeeded.

Fresh authenticated Sites source is `6489207c16040f17c2247db76080520fc6f422b0`,
matching published version 330. Every file under src, data, worker, scripts,
db and drizzle matches canonical main. No independent application work requires
integration. The installed Sites source helper is absent, so a separate shallow
read-only clone was opened with the fresh credential supplied through stdin
and a process-scoped Git header. No mirror changes or pushes occurred.
Direct live release.json access was denied by the proxy with CONNECT HTTP 403.
That denied route was not retried or bypassed. Sites metadata and prior release
logs do not verify live bytes in this session.

No merge, main push, publication, build-number change, device installation, paid
API call or new API credential is authorized or performed by this branch.

## Coverage and scene choices

Seven existing Story-at-verse-1 banners are retained: chapters 1, 18, 20, 28,
36, 37 and 39. Their established passages, verse placements and captions remain.
The cistern rescue is a broad chapters 37–38 Story; the flight banner covers
chapters 39–43. They are not newly claimed literal depictions of verse 1.
The New Covenant image exists in the Story registry but has no Jeremiah reader
heading in the current catalog; it is retained without adding a duplicate or
changing Story passages. Forty-five new chapter openers use afterVerse 0.

New scenes use the chapter's objects, landscapes and literary images without
identifiable people or recurring groups. Settings are imagined context, never
verified reconstructions or archaeological evidence. The broken cistern, olive
tree, chaff and wheat, fig baskets and rising river represent the text's imagery;
they do not assert those symbolic scenes were witnessed historical events.
No named person is silently replaced by an anonymous face.

The generation ledger records each chapter's exact local scripture reference,
scene prompt, actual visual input, original file, final file, byte length and
SHA-256. Only encoding/resizing follows image-tool generation. Every request
supplies `src/assets/chapter-genesis-07-opening-v1.webp` as an actual visual
input for style only: natural light, believable materials and restrained finish.
It is never a reference for Jeremiah's identity. Earlier source versions remain.

## Recurring identity inventory

Paths below are under src/assets. All eight Jeremiah-associated Story files
were inspected at their native 1200×675 resolution, plus a side-by-side sheet.
The provenance prompts were checked to identify people rather than guessing
from similar-looking anonymous figures.

- Jeremiah first appears as a young adult in `story-jeremiah-s-call-v1.webp`:
  medium-brown complexion, dark natural curls, prominent nose, slim build and
  clean-shaven youthful face. `story-the-potter-s-house-and-the-broken-jar-v1.webp`
  shows the seated observer on the right as Jeremiah, with dark curls and beard;
  the worker on the left is the potter and must not become Jeremiah's anchor.
- `story-jeremiah-and-pashhur-v1.webp` and
  `story-hananiah-s-false-prophecy-v1.webp` retain a brown, curly-haired,
  bearded adult Jeremiah with a lean-to-average build and prominent nose.
  Hair length, light and mantle differ. Pashhur is the robed temple official;
  Hananiah is the man holding the broken yoke, not Jeremiah.
- `story-the-scroll-burned-v1.webp`, `story-jeremiah-in-the-cistern-v1.webp`
  and `story-the-fall-of-jerusalem-and-flight-to-egypt-v1.webp` show a graying
  Jeremiah with brown complexion, curls, beard and similar facial profile.
  The call precedes decades of ministry. Chapter ordering is not a precise age
  ladder; chapter 36 is dated to Jehoiakim and the rescue/flight to the later
  siege. The flight portrait is not used to reverse aging or create a new face.
- `story-new-covenant-v1.webp` depicts an older gray-haired/gray-bearded
  Jeremiah. It is an imagined literary teaching banner, with no exact date
  established for the pictured gathering. It is not used as an age reference
  to regenerate the earlier ministry. No new portrait depends on it.
- Baruch appears as the younger scribe in `story-the-scroll-burned-v1.webp`:
  brown complexion, dense dark curls, full dark beard, sturdy adult build.
  No clear earlier active Baruch portrait was found. New chapters 32 and 45
  use documents/equipment without redrawing him.
- Ebed-melech is the foreground rescuer in
  `story-jeremiah-in-the-cistern-v1.webp`: deep-brown complexion, short tight
  curls, dark beard and strong adult build. The headwrapped helper is not
  relabeled Baruch. No new Ebed-melech or helper portrait is generated.
- Pashhur, Hananiah and the unnamed potter have their distinct local Story
  appearances above. None supplies an identity reference for a different man.
- Judean families, temple listeners, guards and displaced households recur
  as groups. Earlier fall-of-Jerusalem art in Kings/Chronicles and this book's
  flight banner are relevant context, not proof that anonymous people are the
  same individuals. No recognizable group is redrawn. Earlier royal/exile
  banners do not securely establish portraits for Zedekiah, Jehoiakim,
  Nebuchadnezzar or Gedaliah for this task; no new portrait invents them.

The retained adult Jeremiah portrayals are broadly compatible, with pose,
lighting and partially hidden features limiting exact likeness. No new
identifiable portrayal requires an unfinished parallel session's image.
Future portrait work must reuse actual approved clear references and check
narrative dates, including the parallel Lamentations/Ezekiel/Daniel reviews.
Those sessions' unapproved images are not references here.

Existing visible hands, limbs, rope grips, potter's action, writing action and
the flight scene's donkeys were reviewed. No clear malformed anatomy was found
at source resolution; occluded detail and small background faces remain limited.
The rescue's cloth padding and the banners' broad narrative roles are retained.
New scenes introduce no living human or animal figures. Chapter 50 has decorative
lion reliefs on its imagined gateway; their visible shapes were also reviewed,
without treating them as a recurring animal identity. Final new-file acceptance,
coverage, spacing, packaging and test results are recorded below.

## Verification limits

This managed Linux environment has no callable cua_repl.js browser tool. The
Sites skill requires skipping preview in that case; no substitute browser was
installed, no alternate browser automation was improvised and no preview server
was started. Source/packaged layout checks cannot establish actual 393px phone
or 744px iPad appearance. Physical devices, signed assets, installed versions
and launches remain coordinated release-session checks on the Mac.

## Final acceptance and checks

All 45 accepted chapter images are 960×540 WebP files below 250,000 bytes each,
5,550,824 bytes total. Every final scene was reviewed at full source size and
in the book-wide contact sheet. Two v1 drafts are inactive: chapter 15 added a
later-looking horned anvil; chapter 40 added a bright ornamental flowering vine.
The actual draft and Genesis 7 style file were supplied to imagegen for each
versioned v2 edit. The accepted v2 files remove those details. Both originals
remain in source. Chapter 51 is a scroll/cord preparation scene beside the river;
it does not claim the pictured bedrock is the stone subsequently bound/thrown.
Architectural scale, exact temple layout, vessel shapes and river geography
remain imagined-setting uncertainties, not reconstructed evidence.

- `npm run build:mobile`: passed, including packaged retrieval, offline search,
  reference answers, conversational fixtures and startup recovery checks.
- `npm run check:images`: passed for all 276 Story assets and 711 registered
  chapters. This verifies packaged placements, opener coverage, unchanged
  scripture, dimensions, alt text, caption rules and exact source/web/offline
  image bytes. Its generic missing-opener test includes Jeremiah's explicit ID.
- `npm run check:mobile`: passed mobile chrome behavior and offline worker
  reading/search/reference checks with zero network requests. These are Node
  adapters; native inference and actual phone/iPad viewport rendering are not
  simulated or verified.
- `npm run check:release`: passed deterministic identity, packaging, embedded
  encoding, hosted-artwork privacy, cache/hash validation and pinned fallback.
- `npm run check:readability`: exit 0 in inherited report-only mode, with existing
  corpus findings. Scripture and Story prose were not changed.
- Independent source audit: 52 chapters, exactly one opener each, 45 chapter
  figures and seven existing Story figures. No pair involving Jeremiah is fewer
  than five verse positions apart. The minimum is five at the short chapter
  45 transition. Current source has no Isaiah 66 or Lamentations opener yet;
  the nearest actual preceding/following images are recorded in the spacing
  ledger. Recheck both immediate boundaries after concurrent branches combine.
- Preservation assertions: all 991 baseline asset files and all earlier
  chapter-image metadata remain byte-identical. Scripture, Story catalog,
  Story image mappings and package/build identity are unchanged.
- `git diff --check`: passed. Build number remains 341.

The final source fingerprint and unsigned web/offline bundle match:
`606f74a2f9a0d6417f19b077720ab262ca25404a51cb851f38b6dcde8a9ec117`.
This is the unpublished branch candidate, not the published build 341 fingerprint.
Local check logs remain at `/tmp/jeremiah-*.log`; structured results, exact image
hashes, public-origin verification and boundary evidence are in the adjacent
`jeremiah-artwork-2026-11-04/` directory.

## Public pin and integration handoff

Artwork asset commit `08703a8cc86a4674d95d771a69dcbeaaddafbaec` is pushed only
to `artwork/jeremiah-2026-11-04`. The hosted manifest preserves all 634 prior
entries and adds the 45 active Jeremiah files, for 679 entries. Its new immutable
source pin points to that asset commit; direct public-origin retrieval verified
all 45 new files against local bytes and SHA-256. Prior asset preservation also
proves this commit contains the earlier pinned file bytes. Inactive drafts are
excluded from the hosted manifest and active offline bundle.

The checked filename allowlist and expected hosted set add only Jeremiah/book
23, preserving the earlier books and nine approved Story replacements. Unchanged
Stories stay embedded. Active new files stay in the shared source and unsigned
native bundle for offline reading. Privacy guards and the same-origin image
handler are unchanged.

Final compressed Worker: **64,724,676 bytes**, against the Sites budget of
66,060,288 bytes, leaving **1,335,612 bytes**. This branch has no local size
blocker. At combined integration, union chapter metadata by explicit book keys,
union active hosted paths and book allowlist entries, and choose a new public
asset commit containing every accepted branch asset. Do not retain this pin
for another branch's files that it does not contain. Rebuild both web and mobile,
recheck the exact Worker budget, all public-origin bytes, continuity and spacing,
and complete rendered/device/live verification before any release.

GitHub's authenticated profile verified login `kev-mac`, numeric ID `2168970`.
Commits use the privacy-safe identity
`kev-mac <2168970+kev-mac@users.noreply.github.com>` locally for author/committer.
No unapproved parallel image is an identity dependency. No main change,
publication, build increment or device installation occurred.
