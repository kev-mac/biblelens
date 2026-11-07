# Job artwork review — 2026-11-07

Scope: Job chapter and Story stills only. All **42 active images retained**: 38 chapter openers and four Stories across 42 chapters and 1,070 verses. No artwork generation, asset, alt text, placement, scripture, reader, video or unrelated production edit. Build remains **370**, version 1.1.0, source fingerprint **d9aef55ab803d0356d1d952d11d7c1a87c82606f2c3e60ef59864fed78ea2ef2**.

Read AGENTS.md, RELEASING.md, the Esther handoff/audit/inventory/verification, and Job's November 4 audit, generation and source-evidence records. Fresh GitHub main **6f4b4c0e5c8a25fecd9bebffa0af091a3a0859ca** is canonical. Fresh Sites mirror **01d49d40ed6a26e46885f6229abbe6eb3edae5f2** has no independent production work or mirror-only tracked paths. Its three shared-file differences are Esther final publication notes and the Job handoff; 330 canonical-only research files are preserved locally. Documentation absent from the mirror stays absent unless required for this review. No edits or stashes were overwritten.

## Scene decisions

Every actual active file was opened at its native size (chapter 960×540, Story 1200×675), after contact-sheet triage. Inspected faces, hands, thumbs/fingers, feet, connected limbs, animal bodies, materials and scene roles. No demonstrable malformed figure or identity break requires replacement. Occluded and distant detail cannot be certified. Local native-size side-by-side pairs additionally compared the testing Story with Job 2, Job 16, Elihu V2 and restoration; Elihu V1's speaker was compared with V2. The actual Genesis 7 approved file was reopened for style only. Natural materials, restrained detail and varied blue/green/purple skies meet its target; no repeated sepia grade.

| Images | Text-compatible subject and decision |
| --- | --- |
| Testing Story; Job 2, 16 | Grieving Job and three companions; ash heap/potsherd; back view in grief. Retain. Story spans Job 1–2 and keeps its existing 1:1 anchor; its scene draws on 2:11–13. It is not a depiction of the initial household before loss. |
| Job 3–10 | Dark birth-night metaphor; Eliphaz's lion bones/teeth; rain; dry brook; loom; withered reeds; unmarked starry sky; clay vessel. Retain as speech imagery, not an endorsement of the speakers' conclusions. |
| Job 11–15 | Height/depth; birds and animals; empty seat/ashes for Job's plea; sprouting stump; grapes and olive blossom. Retain. |
| Job 17–25 | Grave; extinguished lamp; stone and iron tools; snake; prosperous rural flock; brook/mineral glints; hidden path; harvest outside estate; moon/stars. Retain. Job 22 draws on 22:24–25, not a claim that a real gold deposit is known. |
| Job 26–31 | Sea and clouds; fragile shelter; hand-dug mine; gate bench; ashes; equal balance. Retain. No modern machinery or claims to an excavated setting. |
| Elihu Story; Job 33–37 | Young speaker, established older Job and three friends; clay, broad land, high clouds, rain and lightning/snow. Retain. The listening men are older relative to Elihu; no invented exact ages. |
| Whirlwind Story; Job 39–41 | Distant listener under storm; mountain goats; reed/lotus habitat; foaming water. Retain. Chapters 40/41 avoid resolving disputed Behemoth/Leviathan species. No divine portrait or fabricated text. |
| Restoration Story | Relatives/household sharing food, sheep and renewed surroundings (42:10–17). Retain. The children need not be the deceased children or a counted portrait of all ten later children; no fixed banquet date is asserted. |

The inventory records individual paths, hashes, bytes, placements and text compatibility. Existing metadata and versioned originals remain intact. No new image inputs or generation provenance were created.

## Continuity references

An active chapter/Story metadata inventory found no earlier-book Job/Elihu/friends portrait. Eliphaz the Temanite is not Esau's son of the same name. Prior cross-references are not portrait evidence. No prior royal or patriarchal portrait is assigned to Job.

- **Job:** actual approved `src/assets/story-job-s-testing-v1.webp` is the anchor: older lean adult, warm medium-brown complexion, broad weathered face, prominent nose, short dense gray natural curls and rounded gray beard. Chapter 2 preserves that face/build; chapter 16 preserves the hair/build from behind; Elihu V2 matches the older face and complexion in profile. Restoration has compatible curls, nose, cheeks, beard and build in warmer light. Chapters 2–37 imply no decades of aging. Job 42 spans restoration and 140 further years, so the meal is not assigned to his final age. The whirlwind listener is too distant/back-facing for facial verification and is not an identity reference. Job's shaved head in 1:20 need not describe all later scenes: the speeches mention months (7:3). Artwork does not claim a same-day chronology.
- **Three friends:** actual testing Story establishes tan, blue and rust head wraps, varied brown complexions, dark natural curls/beards and mature builds. Elihu V2 preserves all three from behind; unseen faces cannot establish a contradiction. No reliable assignment of these portraits to Eliphaz, Bildad or Zophar is invented. Restoration's visitors are not automatically the three friends.
- **Elihu:** actual `src/assets/story-elihu-speaks-v1.webp`, **young speaker only**, establishes medium-brown complexion, tight dark curls, short dark beard, defined profile and slim young-adult build. V2 is compatible. The V1 listeners have known unresolved drift and are excluded as references; V2 already repaired this in November 4 work.
- **Household and animals:** no unnamed relative is assigned an unsupported recurring identity; sheep, goats and birds have plausible visible anatomy, with distance/occlusion limits. No cross-book anonymous crowd is treated as one continuing group.

## Verification and limits

`release:prepare` **failed** in `check-release-smoke.mjs` because Chromium headless shell is missing. Shared web/mobile builds and preceding nonbrowser checks completed, with search useful-hit 50/50 and inherited report-only readability findings. No release candidate; the full gate did not pass. Separate unchanged `check:images`, `check:release`, `check:mobile` and isolated `check:sync` passed. The sync pass does not resolve the inherited intermittent `assert(finishRead)` failure; fixed-count 30-setImmediate settling is still only a lead. No assertions or production sync behavior were changed.

Independent Job checks exercised all 42 actual Worker/offline chapter responses, all 1,070 KJV/ASV/WEB verses, event headings, exact image metadata/bytes and reader caption rules. Exactly one opener per chapter, four supplied by Stories; no duplicates or missing images. Zero offline engine network calls. All **1,142** public asset Git blobs match immutable pin **c87ed7459451ea3e2b3400eed783def11f017291**. Hosted origin tests use local fixtures, not live requests. Worker **59,888,449 bytes**, SHA-256 **605bda5692389047d6f536c06b91fdc47f8e26a5a0891e3e52bcbc96dfacada2**, matches the prior artifact.

No within-Job gap is below five verse positions (minimum six). **Esther 10:0 → Job 1:1 is four positions**; preserve both necessary openers and inspect at eventual phone/iPad QA. Job 42:1 → Psalms 1:0 is 16 positions. Only first-placement metadata of Psalms was read for spacing; no next-book review began. The inherited 1 Samuel 7:0 → 7:2 pair remains disclosed.

Managed Sites mode is `1`; no callable `cua_repl.js`/desktop JavaScript tool. No browser install, alternate browser path or preview server was started. Browser layout remains unverified. The inherited denied live destination remains outside enforced policy, without supported configuration changes or materially new relevant evidence. No retry or bypass: `release:verify` and live HTTP/image bytes remain deferred.

No Mac connector, configured VPN/device route, Xcode/xcrun or attached physical-device access. Signing, signed app assets versus www, physical device query/install/launch remain deferred. Historical installed build 359 is not a fresh query. Native Sites success will verify publication only, not device synchronization. Stop after Job; hand off Psalms to a separate session.

## Confirmed publication

Review commit **a872475** is pushed to GitHub main. Mirror **8c91d2a492b0ca6b855900ad5dcdbef863a08fd3** is pushed, with no mirror rebuild. Sites **version 366**, saved ID `appgprj_6acba627a6cc8191932fbbc47db8895d~appgver_791b8222f6b48191877f4ecb9c343773`, deployment **appgdep_6aeeb92c9e9c81918fe92b5f4a5221f0**, returned **succeeded** at https://scripture-lens.kvn-mcgwn.chatgpt.site. Six-file Worker-only archive; content hash `sha256:1dd5e5c93cdc7fb3635a25c45d1c56e9c30d4e548f9789579da525380160dbfa`. Public audience/D1 retained; build 370 and fingerprint unchanged. No live HTTP or signed-device verification is implied.

The first native deploy was rejected by automatic approval review because it did not see explicit publishing authorization and considered the audience unverified. Read trusted owner message `Sentinel_71f14e4a51e88191a1801af8136df6ca` (explicit per-book commit/push/publish/install instruction), checked recent messages for cancellation, and refreshed owner/public Site metadata. Retried only the same known-unexecuted deploy once; it succeeded. No bypass, pending deployment or remaining approval rejection. Final canonical publication documents are newer than the mirror; reconcile next session without changing the production fingerprint.
