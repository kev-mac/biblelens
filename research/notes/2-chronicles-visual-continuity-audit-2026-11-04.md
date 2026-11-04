# 2 Chronicles artwork audit — 2026-11-04

## Source and scope

Dedicated branch `artwork/2-chronicles-cloud-2026-11-04` starts at canonical
GitHub main `c90aa0d01679116bef5c921ed4a991e95478f2b3`, build 340. The starting
checkout was clean and had no stashes. No other book, scripture, Story prose,
existing asset, existing image mapping, release identity, or hosted-image pin
is changed. Judges and Ruth/Samuel build 340 artwork remain intact.

Read AGENTS.md, RELEASING.md, CLAUDE.md, Joshua's continuity audit, the
Numbers/Deuteronomy audit, the 2 Samuel audit, the combined Ruth/Samuel review,
its superseding fixes audit, and the build 340 release verification first.
The explicit branch-only instructions supersede AGENTS.md's usual release step.

Sites metadata reports saved version 329. A fresh source credential opened a
read-only comparison clone at `.release/sites-mirror`, commit
`8e5c594a219ec466a210181c0bf46805fd2b5a3c`. It contains no mirror-only source
paths. The only shared source difference is RELEASING.md: the mirror still says
Exodus–Joshua rather than Exodus–2 Samuel use the hosted path. All production
source is equal; there is no independent application work to integrate.
No Sites source was edited or pushed.

The proxy denied CONNECT to the live Site's `/release.json` with HTTP 403.
That action did not reach the Site; it was not retried or bypassed. Metadata
and mirror comparisons do not verify live bytes. No automatic approval rejection
occurred. No permission question or uncertain remote mutation is pending.

## Coverage and image treatment

The final source has 36 openers: 11 existing Story images at verse 1
and 25 new chapter images at `afterVerse: 0`. No duplicate opener is added to a
Story-led chapter. There were no existing 2 Chronicles chapter-image entries.
Story headings and all established placements remain unchanged.

Retained Story-led chapters: **1, 8, 10, 13, 17, 21, 25, 28, 32, 33, 36**.
Their source paths and verse positions are recorded in
`2-chronicles-artwork-2026-11-04/prior-image-inventory.json`.
All other chapters receive `src/assets/chapter-2-chronicles-NN-opening-v1.webp`.
`2-chronicles-artwork-2026-11-04/scene-plan.json` records each scene, textual
anchor and alt description. These are chapter-context illustrations, not claims
that the illustrated moment occurs in verse 1 or archaeological reconstructions.

Inherited Story banners span multiple chapters: chapter 1 shows the later ark
procession; chapter 8 shows the chapter 9 visit; chapter 13's king/covenant is
not securely assigned to Abijah rather than Asa; chapter 17 shows teaching;
chapter 21 shows Joash's later temple repairs; chapter 25 shows Uzziah's later
incense confrontation; chapter 28 shows Hezekiah's later cleanup; chapter 33
shows Manasseh's later confinement; chapter 36 shows the concluding Persian
decree. This is broad Story coverage, not a newly asserted verse-exact portrait.

All new scenes avoid people and animals. The actual approved file
`src/assets/chapter-genesis-07-opening-v1.webp` was supplied to every generation
as **style only**, never as another character's identity. Its grounded light,
plausible materials and restrained illustrative finish guide the results.
Greens, blues, red/purple textiles, daylight and dusk vary across the set.
Settings and objects do not establish new named identities.

Original generated PNGs were inspected at full native resolution; the final
WebP contact sheet checks sequence and repetition. There is
no new human or animal anatomy to validate. Existing Story images were inspected
at 1200×675 for faces, hands, limbs, relationships and their broad narrative roles;
no definite malformed visible anatomy was found. Occluded/background anatomy
cannot be conclusively checked. This review is qualified, not release approval.

## Recurring people and groups

The prior/current inventory includes exact active image paths and metadata.
The following are **candidate comparisons, not approval to generate portraits**
from unfinished Kings/1 Chronicles work. No asset from a concurrent branch was
fetched, copied or used. Before any portrait replacement, reconcile those sessions'
approved references and supply the actual approved files to the image tool.

- **Solomon:** earlier `story-solomon-becomes-king-v1.webp`,
  `story-solomon-s-wisdom-v1.webp`, `story-the-temple-built-v1.webp`,
  `story-the-queen-of-sheba-and-solomon-s-decline-v1.webp`,
  `story-the-census-and-the-temple-site-v1.webp`, and
  `story-david-s-last-charge-and-death-v1.webp`, all under `src/assets/`.
  Current `story-solomon-s-reign-and-the-queen-of-sheba-v1.webp` shows medium-brown
  complexion, oval face, dark tight curls, full dark beard and sturdy adult build.
  The mature visit images are broadly recognizable, but beard length/fullness
  differs at the same episode. Youth/adult ages in 1 Chronicles need the concurrent
  review; the younger accession and mature visit must not be treated as same-age
  portraits. No new Solomon is drawn here. The temple Story depicts priests,
  not an identifiable Solomon.
- **Queen of Sheba:** earlier Kings visit image and current Chronicles visit
  image above: brown complexion, oval face, dark tightly curled hair, adult
  build, purple wrap and gold jewelry. Broad match; pose and hair volume differ.
  This is the same visit, so no elapsed-age change is assumed. Kings review
  remains a dependency before treating either as a new generation anchor.
- **Rehoboam:** `story-the-kingdom-divides-v1.webp` and
  `story-rehoboam-and-the-division-v1.webp`: medium-brown complexion, short dark
  curls, beard and substantial adult build; burgundy clothing. Broadly compatible
  side views; do not infer height from seated poses. Earlier Kings approval is
  still needed for a new portrait.
- **Joash and Jehoiada:** `story-athaliah-and-joash-v1.webp` shows the child at
  coronation with a notably older gray/white-bearded priest. Current
  `story-jehoram-ahaziah-athaliah-and-joash-v1.webp` shows a much older youth and
  a priest with a fuller dark-gray beard. Joash's aging is possible between
  accession and repairs, but the priest appears younger rather than older.
  **Unresolved identity/age concern:** if the repair-scene priest is Jehoiada,
  do not approve it as an identity anchor. The repair banner's youthful king
  also requires event-date reconciliation with the Kings review. Both inherited
  images remain subject to the textual age check: 2 Kings 12:6 places the
  repair delay in his twenty-third regnal year, making him about 29–30 from
  accession at seven (2 Chronicles 24:1), older than the repair banner's youth.
  Chronicles 24:4 does not itself date the initial intent to repair. Both
  images remain unchanged pending that joint decision; this task does not invent
  a new Jehoiada from unapproved parallel art.
- **Hezekiah:** earlier `story-hezekiah-and-sennacherib-v1.webp` and
  `story-hezekiah-s-illness-and-the-babylonian-envoys-v1.webp`; current
  `story-ahaz-and-hezekiah-s-reforms-v1.webp` and
  `story-sennacherib-s-invasion-and-hezekiah-s-pride-v1.webp`. Brown complexion,
  dark curls, full beard and adult build are broadly compatible. The early cleanup
  and later invasion are separated by years. Clothing changes do not establish
  identity drift. The tunnel foreman's gray beard does not make him Isaiah;
  he is unidentified. Do not promote an anonymous worker into a named reference.
- **Abijah/Asa, Uzziah, Manasseh, Cyrus:** the inherited multi-person/multi-king
  Story titles do not reliably identify every face. Abijah/Asa is ambiguous;
  the incense scene is Uzziah by its episode; the confined man is Manasseh;
  the Persian decree ruler is Cyrus. No secure earlier *same-person* portrait
  was found for these in the inspected active prior Story images. The Kings
  Manasseh/Amon/Josiah image depicts Hilkiah and Josiah's scroll episode, and
  must not be silently relabeled as Manasseh's face. No new portrait is made.
- **Priests, Levites, elders, teachers, workers, royal attendants and families:**
  current Story images and earlier temple/ark/royal Stories contain these groups.
  Anonymous individuals cannot be mapped securely across centuries. The covered
  ark procession retains its existing group; none is redrawn or assigned an
  unsupported identity. No recognizable recurring group is added by the openers.

The Joash/Jehoiada concern remains **pending**, not resolved or approved for
publication. Portrait work in this book must wait for agreed Kings references.
The new context-only openers have no essential dependency on those portraits.
Architectural scale, exact vessel designs, spice species and the Persian banner's
generic city backdrop remain imagined-setting uncertainties, not historical evidence.

## Verification and handoff

Twenty-five new 960×540 WebP assets total **3,176,988 bytes**, each below 250,000
bytes. Existing Story assets remain 1200×675. The generation provenance in
`src/assets/2-chronicles-chapter-art.provenance.json` records actual visual inputs,
original PNG paths, final bytes, SHA-256 and the two rejected drafts. Those
originals remain under `/workspace/generated_images`; no existing source asset
was overwritten. Only format/size encoding follows image-tool generation.

Two first drafts were rejected before integration: chapter 24 included coin-like
discs beside the chest; chapter 29 included a modern-looking hand saw. Imagegen
received each actual draft file plus the style image and removed the unwanted
details. The corrected originals were inspected at full size; neither defect
remains. Only the accepted results are active v1 WebPs. Rejected PNGs are preserved
in the workspace and identified in provenance, not used as references for people.

Independent source evidence is in
`2-chronicles-artwork-2026-11-04/source-evidence.json`: exactly 36 openers,
25 new chapter figures, 11 retained Story figures, no duplicate opener, and
**no consecutive images fewer than five verse positions apart**. The smallest
distance is 10. Current-source boundary distances are 51 from 1 Chronicles 28:1
to 2 Chronicles 1:1, and 23 from 2 Chronicles 36:1 to Ezra 1:1. Recheck combined
branches before release, because adjoining sessions may add placements.

The preservation check confirms all **670 baseline src/assets blobs** remain
byte-identical and every earlier chapter-image metadata entry is unchanged.
Scripture, Story mappings/prose, hosted-image pin and package/build identity
match canonical main byte-for-byte. The validation map adds explicit reader
book ID 13 without requiring unfinished books 10–12 or dropping books 0–9.
The image checker also verifies that deleting the chapter 2 opener fails coverage.

All chapter alts start with `Imagined scene:` and describe the image. Source
rendering places `afterVerse: 0` figures below the chapter heading and before
verse 1; Story-at-1 figures already precede verse 1. Chapter figures have no
generic visible captions; Story captions remain small italic titles. Existing
CSS gives images full available width, a 16:9 ratio, and an 860px reader maximum.

`npm ci` initially failed because its default cache path was outside writable
roots. Re-running with `--cache /tmp/biblelens-npm-cache` succeeded; dependency
inputs are unchanged. `npm run build:mobile` passed, producing the shared local
web output and unsigned offline native bundle. The source assets are bundled
for offline reading. No signing or installation was attempted.

**Release size blocker:** the local compressed Worker is **69,880,281 bytes**,
which is **3,819,993 bytes above** the 63 MiB Sites budget (66,060,288 bytes).
Do not publish this artifact. This branch intentionally leaves the shared
hosted-artwork manifest/pin unchanged while ten book branches proceed. At
integration, commit/push all accepted public artwork, extend the existing checked
host allowlist and manifest to the completed books with one immutable public
asset commit, and rebuild both outputs. Preserve every prior hosted entry and
offline asset; verify the exact resulting Worker budget. No packaging or
publication was attempted here.

Managed browser QA is unavailable: no callable `cua_repl.js` browser tool was
provided. The Sites skill says to skip preview in that case; no replacement
browser was installed or improvised, and no preview server was started.
Phone/iPad rendered layouts, live image bytes, signed asset parity, installed
build/launch checks and release verification remain unavailable here. They
require the coordinated release session with the Mac and devices.

This is a feature-branch handoff with outstanding inherited continuity and release
checks, not a synchronized release. No merge, main push, build increment,
publication or device installation occurred.

Final validation completed:

- `npm run build:mobile`: passed, including offline reading/search and startup
  recovery checks. Generated bundles are unsigned local artifacts only.
- `npm run check:images`: passed. All 276 Story images and **327 registered
  chapters** pass packaged placement, dimensions, accessible alts, caption
  treatment, unchanged scripture, web/offline image byte parity and missing-
  coverage checks. The inherited 1 Samuel 7 pair is still reported by its own
  checker; no 2 Chronicles close pair is present.
- `npm run check:readability`: exit 0 in the repository's existing report-only
  mode, with inherited corpus findings. No scripture or Story prose is changed.
- Independent source preservation/coverage/spacing audit: passed, with exact
  image hashes and book-boundary distances saved beside this audit.
- `git diff --check`: passed.

The GitHub connector verified login `kev-mac`, numeric ID `2168970`. This branch
uses `kev-mac <2168970+kev-mac@users.noreply.github.com>` as both author and
committer, matching recent canonical history without publishing a personal email.
