# Ezra artwork audit — 2026-11-04

## Source and scope

Ezra only, on isolated branch `feat/ezra-chapter-art-2026-11-04`, based on freshly fetched GitHub main `c90aa0d01679116bef5c921ed4a991e95478f2b3` (see the machine-readable source evidence for the authoritative full SHA). Build remains 340. No changes to scripture, Story passages, renderer, native project, hosting pins or release configuration. No merge, main push, publication, installation or work on another book.

Read current AGENTS.md, RELEASING.md, CLAUDE.md, Joshua and Numbers–Deuteronomy continuity audits, the Ruth/Samuel continuity-fixes audit and the build 340 release audit. The initial `/workspace/biblelens` checkout was build 338; its files remain untouched. A fresh GitHub fetch and separate worktree preserve its state. Existing assets, including Judges and build 340 artwork, remain byte-identical to main.

Freshly authenticated Sites source `8e5c594a219ec466a210181c0bf46805fd2b5a3c`, opened read-only at `/workspace/ezra-sites-mirror`, matches every shared application source file. Its only shared tracked difference is RELEASING.md saying Exodus–Joshua rather than GitHub's newer Exodus–2 Samuel. There are no mirror-only tracked paths or independent newer application edits to integrate. The Sites helper is not installed in this executor; source was cloned with the returned credential passed through hidden stdin to a process-local Git header, without writing it to disk or a remote URL. Native Sites metadata reports public version 329. That is metadata, not live-byte verification.

Live `release.json` HTTP HEAD was blocked at CONNECT with 403 by the cloud network policy. This was not retried or bypassed. No managed browser-control tool is callable here; no preview server or alternate browser installation was attempted. Physical iPhone/iPad, signed asset, installed-build and rendered viewport checks remain unavailable in this session.

## Every chapter

| Chapter | Opener | Decision and text relationship |
| --- | --- | --- |
| 1 | Story: Cyrus's Decree and the Return, verse 1 | Versioned v2 corrects the distant skyline: no completed temple before rebuilding. Foreground travelers, child, vessels and donkeys remain recognizable. The scene illustrates the return across the Story's chapters 1–2, without assigning the foreground man to a named leader. |
| 2 | `chapter-ezra-02-opening-v1.webp`, before verse 1 | New still life of household bundles, gifts and a folded garment; chapter 2:68–70 supplies the gifts and priestly garments. No named people or exact numerical inventory. |
| 3 | Story: Rebuilding the Altar and Foundation, verse 1 | Retained. Foundation work, branches and mixed joy/weeping fit the chapter. Workers are not assigned named identities. |
| 4 | Story: Opposition and Delay, verse 1 | Retained. Discussion at unfinished masonry illustrates opposition; the chapter also includes later correspondence. Do not assign the officials to named kings or conflate its later city-work letters with the earlier temple opposition. |
| 5 | Story: The Temple Completed, verse 1 | Retained. The Story spans 5:1–6:22; its completion scene illustrates the end of that span, rather than claiming the temple is complete at 5:1. |
| 6 | `chapter-ezra-06-opening-v1.webp`, before verse 1 | New archive-scroll still life, grounded in 6:1–5. No king's likeness or fabricated legible quotation. Imagined room and materials. |
| 7 | Story: Ezra Comes to Jerusalem, verse 1 | Retained. Traveler/river scene belongs to the Story spanning chapters 7–8. |
| 8 | `chapter-ezra-08-opening-v1.webp`, before verse 1 | New balance and sample metal vessels beside packing at the river; 8:24–30 describes weighing and entrusting gifts. The few pictured objects do not purport to depict the entire offering. |
| 9 | Story: Ezra and Mixed Marriages, verse 1 | Retained. Prayer and rainy assembly illustrate the Story spanning chapters 9–10. The rain is explicitly in 10:9, not a claim about the weather at 9:1. |
| 10 | `chapter-ezra-10-opening-v2.webp`, before verse 1 | New wide seated rain assembly, seen from behind, grounded in 10:9. No new named portrait, forced departure or violence. |

Exactly ten active placements and ten openers: six Story images, four new chapter openers. Five Story images remain unchanged; one receives a versioned correction. No duplicate chapter opener was added beside a verse-1 Story. Existing v1 Story art remains in source. The new chapter-10 v1 draft was rejected for its monumental colonnaded facade; its generated original remains under `/workspace/generated_images`, but the untracked temporary WebP was removed after editing. Only the accepted v2 is active and committed.

## People, groups and reference inventory

Inventoried all existing chapter metadata, Story metadata, Ezra Story spans, earlier Kings/Chronicles Story portrayals and the later Nehemiah Ezra appearance on current main. No assets from the concurrent feature sessions were used.

| Person/group | Existing appearances in current main, under `src/assets/` | Continuity finding and use |
| --- | --- | --- |
| Ezra | `story-ezra-comes-to-jerusalem-v1.webp`; `story-ezra-and-mixed-marriages-v1.webp`; later `story-ezra-reads-the-law-v1.webp` in Nehemiah 8 | Mature medium-brown man with pronounced nose/brow, curly hair and substantial dark-to-gray beard. Journey headcloth obscures the hairline; bowed prayer face limits exact comparison. The later public reader is grayer, compatible with the narrative interval between the books' royal-year settings, but no exact birth age is established. No definite identity break was found at native resolution. These are qualified scene comparisons, not a new approved facial model for future close portraits. The new chapter-10 scene contains no identifiable Ezra face. The journey/prayer files were actually supplied for its first draft; final edit retained only rear-view people. Nehemiah art was inspected for comparison, not used to establish a new identity. |
| First-return families and leader | `story-cyrus-s-decree-and-the-return-v1.webp`; current v2 correction | Actual v1 was supplied to the image tool. Same prominent blue-clad adult, oval-faced woman with dark curls and cream headcloth, curly-haired child with muted red scarf, companions, complexions, builds and relationships remain compatible. Staff/scroll hands, visible limbs and donkey form were compared. No one is named by the art metadata, so do not arbitrarily call the leader Zerubbabel, Sheshbazzar or Ezra. |
| Returnees, builders, elders, priests and musicians | Ezra's return, foundation, opposition, completed-temple, journey and prayer files; earlier `story-the-fall-of-jerusalem-v1.webp` and `story-the-fall-of-judah-and-cyrus-s-decree-v1.webp` give the exile/return literary context | Recurring communal roles do not prove individual identity across generations. First-return households must not be equated to Ezra's later travel group. Chapter 2/6/8 add no people. Chapter 10 uses distant/rear-view anonymous attendees with the existing rain/temple files as actual inputs; it makes no new close facial assignment. |
| Cyrus | Earlier `story-the-fall-of-judah-and-cyrus-s-decree-v1.webp` portrays a Persian ruler; Ezra 1's return image has no king | No new Cyrus depiction. Earlier royal art is not required to invent an additional king in Ezra. |
| Zerubbabel, Jeshua, Sheshbazzar, Mithredath, Haggai, Zechariah, Darius, Artaxerxes, Tattenai, Shecaniah and other named officials/priests | Ezra prose names them; the six Ezra Story files do not securely identify individual portraits of these figures. No Ezra chapter art existed on the baseline. Earlier Kings/Chronicles and current chapter-image metadata provide no secure Ezra-scene identity assignment | No new recognizable portrayal or invented identity anchor. The archive is unoccupied; assembly speaker is not visible. A future portrait requires an independently established approved reference. Artaxerxes' later Nehemiah royal scene does not justify assigning an anonymous Ezra 4 official to that king. |

Genesis 7 `chapter-genesis-07-opening-v1.webp` was supplied to every generation as **style only**, never identity. The actual return v1, Ezra journey/prayer and completed-temple files were supplied when relevant, as recorded in `ezra-artwork-generation-2026-11-04.json`. No paid API usage or API credential creation occurred.

## Visual acceptance and uncertainty

All six existing Ezra Story files, the later Nehemiah reader, the earlier Cyrus scene, all generated originals and all five accepted output WebPs were viewed at native resolution. The corrected return was compared with v1 in the same review; the rain scene was compared with the retained prayer/completed-temple settings. The accepted files preserve natural varied colors, believable materials and restrained illustration. Existing work already fits closely enough to retain. Three new still lifes contain no anatomy. The rain scene shows backs and covered bodies; no unmistakable visible anatomical fault was found, but hidden hands, seated legs and distant heads cannot be verified. The return foreground hands, feet, limbs, faces and visible donkeys show no clear malformed anatomy; overlapping distant travelers remain limited detail.

These are imagined narrative settings, not archaeological reconstructions, exact city plans, ancient artifacts or real portraits. Retained temple images vary in viewpoint and decoration; none is an authoritative architectural model. The final chapter-10 doorway avoids the rejected draft's invented large colonnade and is broadly compatible with the retained completed-temple entrance. Exact Jerusalem geography, structure dimensions and palace furnishing remain unspecified artistic details. No new portrait depends on unapproved concurrent artwork. No chapter coverage is left pending.

## Placement, accessibility and spacing

Chapter metadata uses `afterVerse: 0`, useful `Imagined scene:` alt text, 960×540 dimensions and versioned same-source WebPs. The reader inserts chapter openers after the heading and before verse 1; existing Story events at verse 1 remain there. Generic chapter captions stay absent. Retained Story captions remain story-specific, small and italic under their images via the existing renderer and CSS. Source and standard image checks verify these contracts; actual phone/iPad rendering still requires the later release environment.

The source-evidence file records all ten placements, byte sizes and SHA-256. There are **no consecutive image pairs fewer than five verses apart**, including internal chapter boundaries. 2 Chronicles 36:1 → Ezra 1:1 is 23 verse positions; Ezra 10:0 → Nehemiah 1:1 is 45. Story coverage and scripture text were not moved to manufacture these distances.

## Verification and release handoff

Completed on the final production source:

- `npm ci --cache /tmp/ezra-npm-cache --no-audit --no-fund`: passed. The first installation attempt could not write the default home cache; using a writable task cache resolved it without permissions changes.
- `npm run build:mobile`: passed, including the normal build's content validation, offline reading/search and startup/recovery checks. Local unsigned artifacts report version 1.1.0/build 340 with source fingerprint `26d936896bac391734b5296a369dac31311647e6a0d90511651fa236b2a531d1`.
- `npm run check:images`: passed all 276 Story assets, all 301 registered chapters (Genesis–2 Samuel plus Ezra), and the retained 1 Samuel-specific checker. It verifies dimensions, byte limits, unchanged scripture, source/web/offline parity, captions, alt text and opening placement. Its inherited 1 Samuel 7 two-verse pair is unchanged and outside this book's work.
- `npm run check:readability`: exit 0 in the repository's existing report-only mode, with inherited findings. No Story prose or scripture was changed.
- Ezra-specific source fault injection: removing each of the four new openers or the chapter-1 Story fails coverage validation. The full packaged cross-book coverage check above also passes.
- Independent source audit: ten chapters, ten opening placements, no close pairs, boundary gaps 23 and 45; every baseline `src/assets` blob and prior chapter-image metadata entry preserved. See `ezra-artwork-source-evidence-2026-11-04.json`.
- `git diff --check`: passed.

Build outputs are ignored, unsigned local artifacts. Browser viewport, physical-device, signed-app and live bytes are outside this session's verified result. Local command logs are `/tmp/ezra-build-mobile-final.log`, `/tmp/ezra-images.log` and `/tmp/ezra-readability.log`; credentials and personal data are absent from the committed evidence.

The feature commit uses `kev-mac <2168970+kev-mac@users.noreply.github.com>`, verified against the latest canonical main commit identities, with command-local Git settings. The inherited private-email configuration was not used or changed. Only this dedicated branch is authorized for push.

The final default lazy Worker is **66,610,565 bytes**, above the Sites 63 MiB limit (66,060,288) by **550,277 bytes**. Do not publish this artifact. During the coordinated multi-book release, add the reviewed Ezra chapter assets to the existing checked public-hosted artwork mechanism, pin the exact pushed public commit, retain offline bundling and rerun packaging/image checks. This session leaves the shared hosting manifest and allowlist unchanged to avoid competing pins across ten isolated book branches. The release budget is a publication handoff blocker, not missing chapter coverage. The parent release session must combine disjoint chapter keys and illustrated-book Map entries, preserving every concurrent book's additions rather than choosing one complete file version.
