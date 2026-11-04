# 1 Chronicles artwork audit — 2026-11-04

## Scope and baseline

Isolated branch `art/1-chronicles-cloud-2026-11-04`, based on canonical GitHub
main `c90aa0d` (Ruth/Samuel release verification, build 340). The original
`/workspace/biblelens` checkout is preserved. This task stops after 1 Chronicles:
no main push/merge, publication, build-number change, signing or installation.

Read AGENTS.md, RELEASING.md, the build 340 release note, 1/2 Samuel visual
audits and the later Ruth/Samuel continuity corrections. Those later corrections
supersede their earlier review snapshots. All 670 baseline `src/assets` files
remain byte-identical. Scripture, Story passages, previous chapter metadata,
hosted-artwork pin, and package build 340 remain unchanged.

Fresh Sites source opened read-only at
`8e5c594a219ec466a210181c0bf46805fd2b5a3c`, version 329, build 340.
Its src/data/scripts/worker/db files match canonical main byte-for-byte.
Native Sites metadata reports the public website at
https://scripture-lens.kvn-mcgwn.chatgpt.site.
Direct live `/release.json` access received proxy CONNECT 403. No bypass or
retry was attempted; live release/image bytes remain unverified here.

## Coverage and scene review

Exactly one opener in each of 29 chapters: six Story figures at verse 1 and
23 new chapter figures at `afterVerse: 0`. Story headings/passages are unchanged.
Four Story images are retained; two receive versioned v2 replacements. Earlier
WebP versions remain in source. The 25 new files total 3,555,262 bytes.

| Chapter | Opening image and textual role |
| --- | --- |
| 1 | Branching hill paths; genealogical spread across lands |
| 2 | Judah's olive terraces and settlements |
| 3 | Shared domestic courtyard; David's descendants |
| 4 | Loom and clay vessels; linen workers and potters (4:21–23) |
| 5 | Pasture east of the Jordan |
| 6 | Levitical pasture town |
| 7 | Northern tribal farms and grain fields |
| 8 | Benjamin's hillside settlement and water cistern |
| 9 | Gate and flour/oil stores; gatekeepers and service |
| 10 | Story v2: quiet burial place beneath an oak (10:12) |
| 11 | Retained Story: David and companions in a courtyard |
| 12 | Empty camp, bow, spear and shield; warriors at Ziklag |
| 13 | Retained Story: ark procession, a later event within 13–16 |
| 14 | Cedar beams and stone; Hiram's help building David's house |
| 15 | Linen tent prepared for the ark; no speculative ark design |
| 16 | Bread and fruit beside a tent; food and thanksgiving |
| 17 | Retained Story: Nathan speaks with David |
| 18 | Metal tribute vessels and shield |
| 19 | Ammonite town approach and camp |
| 20 | Empty siege camp outside Rabbah |
| 21 | Story v2: threshing floor, grain baskets and wooden sledge |
| 22 | Timber, stone and iron nails; preparations before temple construction |
| 23 | Folded linen, lamps and bowls; service supplies |
| 24 | Unmarked lots, linen and rolled parchment; priestly divisions |
| 25 | Lyre, cymbals and drum; musicians' service |
| 26 | Closed gates and sealed stores; gatekeepers and treasuries |
| 27 | Olive groves, vineyard and storehouse; royal estate administration |
| 28 | Retained Story: elderly David passes a plan to Solomon |
| 29 | Gold, silver, bronze vessels and stones; gifts for the temple |

Chapter scenes provide relevant context for the whole chapter, rather than
claiming every object appears in verse 1. The retained 13:1 Story banner depicts
the successful carrying procession later in its 13–16 passage, not the first
cart journey. It stays at its established Story heading. Jerusalem's large
legacy skyline is imagined, not a scale plan or archaeological reconstruction;
the existing Samuel setting-scale uncertainty remains applicable.

The old Saul image showed a tamarisk and a David-like mourner. Chronicles 10:12
specifies an oak and names the men of Jabesh; David is not named at the burial.
The replacement avoids an unsupported named participant and uses an oak.
The old census/temple-site image showed younger David and Solomon beside worked
construction blocks. Its successor emphasizes the threshing-floor setting of
chapter 21, avoiding an implied temple construction under David or a new age claim.

All generated originals were inspected at full size. Rejected drafts introduced
a signature (6), modern-looking keys (9, 26), carpentry tools (14), and garment
hangers (23). Imagegen edits removed those details; corrected originals were
inspected again. Rejected PNGs remain locally, inactive. Materials and settings
remain imagined illustrations, not verified artifacts. No new identifiable
person, group or animal is portrayed, so there is no newly generated anatomy or
identity chain. Retained figures' faces, hands, arms, posture and visible limbs
were checked at full source size; no definite anatomy defect was found.

`src/assets/1-chronicles-chapter-art.provenance.json` records accepted original
paths, actual style inputs, repair inputs, final hashes and byte lengths. Every
new base generation received the actual approved Genesis 7 WebP as **style
only**. Repair calls received their actual draft PNG. Genesis 7 supplied no
character identity. Chapter files are 960×540 and Story replacements 1200×675;
all are below 250,000 bytes. New files use versioned names.

## Recurring identities and dependencies

The earlier Samuel audits supply the prior-appearance inventory; this review
also opened all six Chronicles Story originals and the Samuel accession,
covenant, rebellion and census scenes at full size for comparison.

**David:** earlier active source appearances are `story-david-anointed-v1.webp`,
`story-david-and-goliath-v1.webp`,
`story-saul-s-jealousy-and-david-s-flight-v1.webp`,
`story-david-in-the-wilderness-v1.webp`, `story-david-becomes-king-v1.webp`,
`story-jerusalem-and-the-ark-v1.webp`, `story-the-davidic-covenant-v1.webp`,
`story-davidic-covenant-v1.webp` (alternate Story title),
`story-david-and-mephibosheth-v1.webp`,
`story-david-bathsheba-and-uriah-v1.webp`, `story-absalom-s-rebellion-v1.webp`,
`story-the-exploits-of-david-s-mighty-men-v1.webp`, and
`story-the-census-and-the-plague-v1.webp`, all under `src/assets/`.
Do not mistake Jonathan, the blue-clothed donor in the robe exchange, for David.
Stable adult traits are medium-brown complexion, dense dark curls, full beard,
strong build and often blue outer cloth. Accession in 2 Samuel 5 and Chronicles
11 is the same event, at age 30; later appendix scenes do not establish a secure
numerical aging sequence. Chronicles 11/13/17 broadly retain that identity.
Chronicles 28's gray curls, beard and lined face plausibly depict David near the
end of his reign, rather than a different young man. No new David was generated.

**Nathan:** prior `story-the-davidic-covenant-v1.webp`, the alternate
`story-davidic-covenant-v1.webp`, and
`story-david-bathsheba-and-uriah-v1.webp`; mature brown complexion, gray curls
and beard, dark outer cloth. Chronicles 17 broadly matches the same-event
covenant portrayal. No new Nathan was generated.

**Solomon:** earlier canonical Story paths are
`story-solomon-becomes-king-v1.webp`, `story-solomon-s-wisdom-v1.webp`, and
`story-the-queen-of-sheba-and-solomon-s-decline-v1.webp`. All three were opened
full size, but their concurrent Kings review is not yet approved here. They show
a young brown man with dense dark curls, oval face, short beard and lean build.
Chronicles 28's profile broadly resembles them; a blue mantle is not an identity
anchor by itself. The inactive old chapter-21 banner shows a younger, less
bearded Solomon. Its replacement avoids asserting an elapsed age not supplied
by the passage. **Final cross-book Solomon approval remains pending the Kings
session's accepted references.** No unfinished concurrent portrait was used as
an imagegen reference, and no new Solomon portrait was made.

**Saul/Jonathan:** earlier Saul anchors are `story-saul-rejected-v1.webp` and
`story-saul-and-the-medium-at-endor-saul-s-death-v2.webp` (the corrected version
from the latest audit). Saul is mature, brown, dark-curled, bearded and strong;
Jonathan's earlier robe-exchange identity is separate. Neither is visibly
portrayed in the accepted new burial scene; no new portrait or corpse identity
was invented.

**Groups:** Israelites/elders recur across the earlier books and the accession
and rebellion scenes; priests/Levites and ark bearers recur in Exodus–Joshua,
Samuel and Chronicles 13; warriors recur in the David/Goliath, wilderness and
mighty-men art. Anonymous faces are not assigned individual names or matched
across generations. The retained Chronicles groups have varied brown
complexions, natural curls and woven garments, compatible at that broad level.
No new recognizable group portrait was commissioned. New camp/storage/service
scenes establish no warrior, priest, musician or gatekeeper identity. Joab,
Ornan, Asaph, Heman, Jeduthun and other named people are not newly depicted.

## Placement, spacing and verification

Source evidence is in
`1-chronicles-artwork-source-evidence-2026-11-04.json`: 29 openers/29 placements,
no consecutive image pairs below five verses involving this book. Across the
current source boundaries, the previous 2 Kings figure to Chronicles 1 is 56
verse positions; Chronicles 29's opener to 2 Chronicles 1's Story is 31.
Recalculate after integrating the concurrent adjacent-book branches.

Chapter figures have useful `Imagined scene:` alt text and no generic visible
caption. Story figures retain the existing small italic Story captions. The
shared reader source retains full-width 16:9 art with an 860px maximum; no CSS
change was needed. This source review does not establish rendered phone/iPad QA.

Final validation:

- `npm run build:mobile`: exit 0, including shared Worker, offline corpus/search,
  packaged retrieval and startup checks. No signing or installation attempted.
- `npm run check:images`: exit 0. All 276 Story assets and 320 registered
  chapters pass packaged placement, alt text/caption, dimension, unchanged
  scripture and web/native byte-parity checks. Removing Chronicles 1's opener
  explicitly fails coverage validation.
- `npm run check:readability`: exit 0 in its existing report-only mode with
  inherited corpus findings; scripture and Story prose were not edited.
- `git diff --check`: passed. Baseline preservation checks passed for all 670
  existing assets and previous chapter metadata.
- Source/native fingerprint matches:
  `c4179efbd8f0950579681d3729887348b324cc8216197adfaaaaeb5094fe1d44`.
  Build number remains 340; these are local unsigned branch artifacts.

The compressed Worker is **70,075,351 bytes**, above the Sites release budget
of 66,060,288 bytes by **4,015,063 bytes**. This branch is not deployable as-is.
After the public asset commit exists, the combined release integrator must
extend the checked immutable hosted-artwork path/allowlist and pin, then rebuild
both targets and verify origin hashes/offline parity. Do not silently reuse the
old source pin for these new files. The hosted manifest is unchanged here.

No callable managed `cua_repl.js` browser tool is available. Per the Sites skill,
no alternate browser was installed, no substitute browser-control path was used,
and no preview server was started. Rendered phone/iPad chapter checks remain
pending. Mac signing, signed-asset parity, physical-device layouts, installation,
launches and live `release:verify` are unavailable in this cloud branch task.
The direct live request was denied by the environment proxy; this was a network
policy denial, not an automatic approval-review rejection. All unaffected
source/build/image checks were completed. No paid API fallback or new API
credential was used. Publication remains outside this session's authorization.

Before release: reconcile final Kings/Solomon references and adjacent-book image
spacing, resolve the Worker budget through checked hosting, perform fresh
GitHub/Sites/live comparison, and complete the Mac/device release workflow.
