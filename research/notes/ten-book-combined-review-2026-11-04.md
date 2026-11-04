# Ten-book combined review — 2026-11-04

Integrated all ten feature branches from canonical c90aa0d0 after reading AGENTS.md, RELEASING.md, CLAUDE.md and the branch audits. Fresh Sites source 8e5c594a219ec466a210181c0bf46805fd2b5a3c contains no newer production work; its earlier documentation wording is superseded by canonical main. Main was clean; four stashes remain untouched. Integration uses explicit book IDs 10–19, unions chapter keys and Story changes, and preserves every baseline asset blob and earlier chapter-image entry.

## Cross-book decisions

Actual source images were inspected at native size, rather than relying on thumbnails or descriptions. The branch audits provide the per-image generation/text/anatomy evidence; this integration adds focused cross-book comparisons.

Solomon: story-solomon-becomes-king-v1.webp, story-solomon-s-wisdom-v1.webp, story-the-queen-of-sheba-and-solomon-s-decline-v1.webp, story-david-s-last-charge-and-death-v1.webp and story-solomon-s-reign-and-the-queen-of-sheba-v1.webp share medium-brown complexion, tight dark curls, prominent nose, defined jaw, beard and adult build. Chronicles' final David scene is compatible with the younger accession portrait. Sheba's two scenes show compatible face/profile; beard/hair styling differs, without a definite facial identity break or inferred extra years between parallel accounts. Retain. The inactive census-site v1 is superseded by the branch's person-free v2. These are imagined portraits, not historical evidence.

Joash/Jehoiada: full-size comparison of story-athaliah-and-joash-v1.webp and story-jehoram-ahaziah-athaliah-and-joash-v1.webp confirms the repair-scene king is too youthful for the repair chronology and the priest appears younger. Reject the latter active mapping. Versioned v2 removes both identifiable figures, keeping masons, scaffolding and an offering chest. Original image and Genesis 7 style file were actual tool inputs. Original and final output were inspected at full size; foreground arms/hands, grips and visible limbs are coherent; distant/hidden detail is limited. This resolves the age conflict without inventing new portraits or deleting story coverage.

Ezra: story-ezra-comes-to-jerusalem-v1.webp, story-ezra-and-mixed-marriages-v1.webp and story-ezra-reads-the-law-v1.webp show compatible brown complexion, prominent nose/brow, curly hair and full beard. The Nehemiah reader's grayer hair is plausible across the royal-year interval. Bowed/wrapped and distant views limit exact likeness; no definite break is visible. Retain, without promoting the distant reader to a precise new face anchor.

Esther/Job: compare Mordecai's story-haman-s-plot-v1.webp against Esther 4/10 openers; compare Ahasuerus' coronation/banquet against Esther 6. Identities remain recognizable. Job's testing anchor matches Job 2/16 and Elihu v2; four listeners are present. The Esther 10 opener to Job 1 Story is four verse positions; both required openers stay. Different characters are not relabeled as the same man.

Psalms: actual native images for all six close pairs were inspected: 89:0 → 89:3; 117 → 118; 123 → 124; 131 → 132; 133 → 134; 134 → 135. The moon opener and Davidic Covenant are different subjects. The five short-psalm transitions retain an opener for each psalm; no Story is removed or moved to hide spacing. Rendered phone/iPad checks remain to be completed.

The 2 Kings widow/sons and Jehu doorway corrections, Nehemiah wall replacement, Job 2/16 and Elihu v2 were also inspected at native size. Closed-door corrections and recurring identities are compatible; covered/background anatomy cannot be certified. No new definite defect found. Branch audits' setting-scale and interpretive uncertainties remain.

## Packaging and release work

Build 341 extends the established immutable public-artwork mechanism through Proverbs, including only the nine reviewed new versioned Story replacements. Unchanged Story assets remain embedded. Every active image remains in the shared source and offline native bundle. The first chapter-hosted combined Worker measured 66,561,260 bytes, 500,972 above the 66,060,288 budget; it was not published. Final pin, budget, public-origin bytes, tests, layouts, signed build, device versions/launches and release:verify must be recorded after execution.

Local failures: default Node heap exhausted; rerun uses NODE_OPTIONS=--max-old-space-size=8192. The Documents checkout suffered dataless file read timeouts while the disk was nearly full; its exact commits/edits were transferred to /tmp and only that task-created duplicate was removed. A later mobile write failed ENOSPC. These failures do not constitute passed checks. Existing source/stashes/device data were not deleted.
