# Ruth visual continuity audit · 2026-11-03

## Scope and source

Ruth only, reviewed in the isolated branch `artwork/ruth-cloud-2026-11-03`, based on fetched GitHub main `05b8a5a0c729c1e5d9cdc577d6b7a2fb9c5dd492`. That source already includes Judges. The original checkout was clean and was left unchanged. No release, build-number change, main push, or device installation is part of this task.

The Sites source was read using a fresh repository credential, with no push. Its HEAD is `9983427f11fe71a2e6fb6c58ababe5621f344541`, matching saved version 327. A tree comparison found no mirror-only paths or independent new application work. Differences are canonical research drafts/audits, the added continuity rule, Judges artwork and its validation metadata, and GitHub's existing build 339 versus the mirror's build 338. Ruth image metadata and all four Ruth image blobs are identical between sources. The Sites source helper is not installed in this environment, so the read used ordinary authenticated Git and an ignored shallow source cache. The initial full-history read was stopped before completion to avoid downloading unnecessary history.

## Coverage and retained artwork

All four chapters already have one Story image at verse 1. The reader renders that Story figure below the chapter heading and before verse 1. There are no Ruth chapter-image entries or later inline images to move, remove, or duplicate. All four existing images are retained; no new or replacement image was needed or generated.

| Chapter | Story image in `src/assets/` | Narrative review |
| --- | --- | --- |
| 1 | `story-naomi-and-ruth-return-to-bethlehem-v1.webp` | Ruth supports Naomi on the return toward Bethlehem, consistent with 1:19–22. |
| 2 | `story-ruth-gleans-in-boaz-s-field-v1.webp` | Ruth gathers grain with Boaz and harvest workers nearby, consistent with 2:3–9. |
| 3 | `story-the-threshing-floor-v1.webp` | Ruth speaks with Boaz beside grain at night, consistent with their conversation in 3:8–14. The image does not attempt to show every action in the passage. |
| 4 | `story-boaz-redeems-and-marries-ruth-v1.webp` | Boaz sits with witnesses at the gate during the sandal transaction in 4:1–11. Ruth and Naomi at the edge are imagined attendance, neither asserted by the verses nor presented as evidence. |

Existing alt text describes each visible scene. Reader captions use the Story title prefixed with “Imagined scene:” and existing reader CSS makes them small and italic. Story cards omit captions. No generic chapter caption was added.

## Continuity inventory and visual review

The existing Story and chapter image metadata contain no earlier recognizable portrayal of Ruth, Naomi, or Boaz before Ruth. These images establish their current visual identities; no parallel task's unapproved art was used. Genesis 7 (`src/assets/chapter-genesis-07-opening-v1.webp`) was viewed for style only. No generation took place, so there was no image-input transfer to perform.

- Ruth: chapter 1 establishes a young adult with a warm medium-brown complexion, oval face, defined brows, dark natural curls around the forehead and cheeks, and a slim build. Her face, complexion, curls, and apparent age remain compatible in chapters 2–4. The teal covering and cream dress also recur. Chapter 2's downward pose limits direct face comparison but does not show a different identity.
- Naomi: chapters 1 and 4 show an older woman with a lined face, gray curls, medium-brown complexion, cream head covering, dark outer garment, and a slight build. Her face and apparent age remain compatible. The text gives no numeric age; the review does not infer one.
- Boaz: chapter 2 establishes a mature adult with a medium-brown complexion, dark curly hair, a graying beard, broad face, and sturdy build. Chapters 3 and 4 retain those traits without an implausible age change over the harvest period.
- Harvest workers, gate elders, and the nearer relative are not confidently identifiable as any earlier depicted group or person. Their clothing does not establish identity. Elimelech, Mahlon, Chilion, Orpah, Obed, Jesse, David, and named ancestors are not identifiable in these active Ruth images; no new portrayal was invented for them.

All four retained 1200×675 files were viewed at their full native resolution and compared across the book. Visible hands, arms, limbs, and relationships were inspected. No clear malformed anatomy or identity break was found. Partly hidden hands and distant faces cannot support detailed judgments. The restrained illustrative finish, natural light, material texture, and people remain compatible with the Genesis 7 target. Daylight field and road scenes, blue night sky, and shaded gate provide variation without a uniform amber grade.

## Image spacing

Measured as verse-position differences in the continuous reading sequence, including book boundaries:

| Pair | Verses apart |
| --- | ---: |
| Judges 21:0 → Ruth 1:1 | 26 |
| Ruth 1:1 → 2:1 | 22 |
| Ruth 2:1 → 3:1 | 23 |
| Ruth 3:1 → 4:1 | 18 |
| Ruth 4:1 → 1 Samuel 1:1 | 22 |

No pair involving Ruth is fewer than five verses apart. Boundary results reflect the fetched source; recheck after integrating parallel branches.

## Verification

- `npm run check:readability`: exited 0; the existing corpus report includes legacy length/jargon findings. This task changes no visible content.
- `npm run build:mobile`: passed, including its bundled search/startup checks. Generated output remains untracked and is not a signed app.
- `npm run check:images` after the mobile build: passed Story image checks and Genesis–Judges chapter checks. The general chapter check does not yet enforce Ruth coverage, so a separate direct check of all four Ruth chapter API responses verified the verse-1 Story title, absence of duplicate chapter art, and byte equality between source, Worker response, and `www`.
- Retained source/Worker/offline image SHA-256 values: chapter 1 `dcf02cd79287f78078d2fab82961e4c4d0470e400cc22587769ed2830af182ab`; chapter 2 `6df20fa052ca641d7afc2b4cd93d84532724af7605e76d51c3e14966fb1257d4`; chapter 3 `a465e168619959f4c0fe218081de9c005b6e32b93c8ce697af940ea94181f086`; chapter 4 `2b3186fe2c197657b97f00fb8cdb82842c9173e66be78da89019ea4fef4fbdbd`.
- Phone and iPad browser layouts were not inspected in this cloud session. Signed iOS asset parity, installed builds, device launches, and final release verification require the Mac/device release task. No claim of a synchronized release is made.
- Live `https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` access was denied by the enforced cloud proxy (CONNECT HTTP 403). No retry or bypass was attempted. Sites metadata reports current version 327, source commit `9983427f11fe71a2e6fb6c58ababe5621f344541`; saved version identity alone does not verify live image bytes.

No Ruth image work is pending and no dependency on the parallel Samuel tasks was found. Live, browser-layout, and signed-device verification remain pending.

The initial feature-branch push to GitHub was rejected with GH007 because the checkout's configured author/committer email is private. No remote branch was created by that push. On follow-up, the authenticated GitHub profile verified account `kev-mac` with ID `2168970`. The existing Judges commit `05b8a5a0c729c1e5d9cdc577d6b7a2fb9c5dd492` records `2168970+kev-mac@users.noreply.github.com` as author and committer email; the GitHub connector attributes both roles on that exact commit to the same authenticated account. This verifies the existing no-reply address without guessing it. The Ruth audit commit was amended to use that address for both roles, and the handoff patch was refreshed. Account privacy settings and global Git settings were not changed. No main push was attempted. The CLI account read was denied by the cloud proxy; no bypass or retry of that denied read was attempted.
