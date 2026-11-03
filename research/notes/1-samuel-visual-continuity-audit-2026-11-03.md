# 1 Samuel visual continuity audit · 2026-11-03

## Scope and source

Work is isolated to 1 Samuel on `artwork/1-samuel-cloud-2026-11-03`, based on GitHub main `05b8a5a0c729c1e5d9cdc577d6b7a2fb9c5dd492` (Judges openers). No existing edits or stashes were overwritten. Build number remains 338; this is a review branch, not a released build.

The Sites source at `9983427f11fe71a2e6fb6c58ababe5621f344541` was compared read-only with GitHub. Its source differs in the five chapter/hosted-artwork implementation and metadata files changed by the newer Judges work; there is no independent newer application work to integrate. Sites is still build 338. Direct GET of `https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` was denied by the environment proxy (CONNECT 403). Live source identity and live image bytes are therefore unverified. No alternate route was attempted.

## Coverage

All 31 chapters have exactly one opening image before verse 1:

- Retained Story openers: chapters 1, 4, 8, 13, 16, 17, 18, 22 and 28.
- New chapter openers: chapters 2, 3, 5, 6, 7, 9, 10, 11, 12, 14, 15, 19, 20, 21, 23, 24, 25, 26, 27, 29, 30 and 31.

All 11 existing Story illustrations and their verse placements remain intact. In particular, “Eli's Sons and Samuel's Call” remains at 2:12 and “Samuel Judges Israel” at 7:2. No new duplicate opener was added at a verse-1 Story. The new files are versioned `chapter-1-samuel-NN-opening-v1.webp`, 960×540, with useful imagined-scene alt text and no generic visible captions. Existing Story captions use the shared small italic style. Scripture, Story metadata, existing art and build numbers were not edited.

New scenes use landscapes, animals and narrative objects, so they do not establish new human identities. Genesis 7 was supplied as an actual image input to every generation for style only. All accepted originals were inspected at their original image size. The two donkey scenes and livestock scene were checked for ears, limbs, hooves and body structure; none has an obvious malformed animal. The broken idol in chapter 5 is clearly stone, with a detached head and two detached hands; these are narrative objects, not human remains.

The first chapter 5 draft was rejected: the reference copied the return cart from chapter 6 into the earlier Ashdod temple scene and added speculative fish motifs. An imagegen edit removed the entire chest/cart and fish motifs, keeping only the broken idol and temple setting. The corrected original was inspected and accepted. Rejected originals remain in the generated-image directory; they are not active chapter assets. Generation inputs, prompts, local original paths and review outcomes are recorded in `1-samuel-artwork-generation-2026-11-03.json`.

## Earlier people and group inventory

No identifiable character from 1 Samuel is portrayed in the earlier Genesis–Ruth narrative illustrations. Ruth 4 names David in its genealogy, but its retained gate scene portrays Boaz and elders, not David. The following are retained source references, reviewed here; they are useful continuity candidates for subsequent work, not newly commissioned portraits.

| Person | Earlier/current source appearances and stable traits | Review and limits |
| --- | --- | --- |
| Hannah | `src/assets/story-hannah-and-the-birth-of-samuel-v1.webp`: adult, medium-brown complexion, oval face, dark natural curls, teal shawl, average build. | One visible portrayal; no new portrait made. |
| Eli | Same Hannah image, then `src/assets/story-eli-s-sons-and-samuel-s-call-v1.webp`: elderly, deep-brown complexion, gray curls and beard, cream linen, broad build. | Lying figure in the call scene has limited face detail; identity cannot be confirmed fully. No new portrait made. |
| Samuel as a child | Hannah image, then call image: brown complexion, short dense dark curls, rounded youthful face, slim child build, cream linen. | Call scene is somewhat older than dedication scene; compatible with elapsed childhood. Both inspected at full size. |
| Samuel as an adult/elder | `src/assets/story-samuel-judges-israel-v1.webp`, `story-israel-demands-a-king-v1.webp`, `story-saul-rejected-v1.webp`, `story-david-anointed-v1.webp` (all under `src/assets/`): brown complexion, prominent nose, gray curls and beard, sturdy build, dark mantle over cream linen. | The elder scenes are broadly consistent. Chapter 7 already portrays an elderly Samuel; the twenty years in 7:2 alone do not establish his precise age. Child-to-elder likeness and exact aging remain interpretive, not a verified portrait chain. Avoid generating a new Samuel from the child images without an explicit age plan. |
| Saul | `src/assets/story-saul-rejected-v1.webp`, `src/assets/story-saul-and-the-medium-at-endor-saul-s-death-v1.webp`: mature brown-skinned man, prominent nose, dark curly hair and full beard, tall/strong build in standing scene, burgundy mantle. | Seated Endor scene broadly matches face and hair; height cannot be checked while seated. No new portrait made. |
| David | `src/assets/story-david-anointed-v1.webp`, `story-david-and-goliath-v1.webp`, `story-saul-s-jealousy-and-david-s-flight-v1.webp`, `story-david-in-the-wilderness-v1.webp` (all under `src/assets/`): youthful medium-brown complexion, dense short dark curls, slim build, cream linen; later adult has curls, short beard, stronger build and blue mantle. | Anointing and robe-exchange faces are broadly compatible; Goliath image mostly hides his face. Wilderness scene depicts a noticeably more mature David, plausible within the years before kingship but not a controlled aging study. Use the anointing/robe exchange for youth and wilderness for adult continuity; supply actual files to the image tool. |
| Jonathan | `src/assets/story-saul-s-jealousy-and-david-s-flight-v1.webp`: medium-brown adult, longer dark curls, pointed/full beard, blue mantle, lean/strong build. | One source portrayal; do not confuse the blue-clothed Jonathan with youthful David receiving the robe. |
| Abigail | `src/assets/story-david-in-the-wilderness-v1.webp`: medium-brown adult woman, oval face, dark natural curls, plum head covering, average build. | One source portrayal; no new portrait made. |
| Jesse and David's brothers | `src/assets/story-david-anointed-v1.webp`: older seated Jesse and several adult brothers around youthful David. | Individual brothers are unnamed visually and not securely mapped to names; do not reuse a brother as Saul or assert a named brother identity. |
| Woman at Endor and companions | `src/assets/story-saul-and-the-medium-at-endor-saul-s-death-v1.webp`: older brown-skinned woman with gray-streaked curls and headwrap, two adult male companions behind Saul. | Woman is identifiable in one scene; companions are not named or securely identifiable. |

Elkanah, Peninnah, Hophni, Phinehas, Ichabod, Kish, Saul's servant, Nahash, Agag, Michal, Ahimelech, Doeg, Abiathar, Nabal, Ahinoam, Achish, Abishai and the Egyptian servant have no securely identifiable portrayal in the retained 1 Samuel art. Do not assign an anonymous background figure to them or invent continuity anchors.

Earlier group context:

- Israelites and village elders already appear throughout earlier books, including `src/assets/story-joshua-s-farewell-and-covenant-at-shechem-v1.webp`, `story-the-cycle-of-the-judges-v1.webp`, `story-boaz-redeems-and-marries-ruth-v1.webp`, and Judges 20's assembly opener. The retained Samuel assembly, king request and wilderness scenes show varied brown complexions, natural curls and woven linen/wool. No individual elder is securely identifiable across these generations. No new group portraits were made.
- Philistines occur in the earlier Samson narrative (`src/assets/story-samson-v1.webp`) and are visible in 1 Samuel's retained Goliath scene. That scene's armor and distant troops are legacy imagined art, not verified historical costume evidence. No new Philistine faces or uniforms were created; chapter 29 shows only an empty setting with distant tents.
- Amalekites occur in Exodus's `src/assets/story-water-from-the-rock-and-the-battle-with-amalek-v1.webp`. New chapters 15 and 30 show livestock and a burned settlement, with no Amalekite portrayals requiring unapproved group references.
- Priests/Levites recur in Exodus–Joshua sanctuary narratives. Eli belongs to a later generation and is not Aaron or Eleazar; no earlier priest was reused as his identity. New sanctuary settings are empty.
- The ark is an object rather than a person/group. Earlier depictions include the Jordan/Jericho Stories and the retained ark-return image. The rejected chapter 5 draft used the latter actual file as an object reference; the accepted version deliberately omits the ark, avoiding an unverified design chain.

This work does not depend on unapproved Judges, Ruth or 2 Samuel images. New art contains no recognizable people or groups whose identity must be resolved by a parallel task. A later combined-book review should compare David, Jonathan, Saul's legacy portrait, Abigail and recurring groups with 2 Samuel's retained and proposed art before publication.

## Close image pairs

The audit counts consecutive images across all of Ruth, 1 Samuel and 2 Samuel using the current source metadata. One pair involving 1 Samuel is fewer than five verses apart:

- 1 Samuel 7:0 new Ebenezer opener → 7:2 “Samuel Judges Israel”: 2 verses.

Both scenes concern the chapter's memorial/assembly. The verse-2 Story is retained as instructed. No additional pair involving 1 Samuel falls below five verses across chapter or book boundaries. Recalculate after integrating parallel branches.

## Verification and release limits

- Dependency installation completed using a writable temporary npm cache; the initial attempt could not write the default cache.
- `npm run check:readability` completed with exit 0. Its existing report-only findings remain; it is not a strict all-content readability pass.
- `npm run build:mobile` completed with exit 0, producing the shared web Worker and offline bundle. All 22 new files total 3,099,968 bytes and remain embedded in the web bundle and packaged offline; the existing public-hosted artwork pin was not changed. A later release can choose whether to extend public hosting after committing the assets.
- `npm run check:images` completed with exit 0. Its existing chapter loop covers Genesis–Judges, while its Story loop covers 1 Samuel and the other illustrated Story books.
- `node scripts/check-1-samuel-artwork.mjs` completed with exit 0. This separate check covers every 1 Samuel chapter, exactly one opener, preserved Story placement and scripture, alt text, hidden generic captions, retained Story captions and source/web/offline byte parity. External fetches are disabled during this check, so all 1 Samuel art must be available locally. It also enumerates close pairs across Ruth/1 Samuel/2 Samuel. Keeping this check separate avoids coupling the branch to unfinished parallel book coverage.
- `git diff --check` passed. Existing chapter metadata outside book 8 is byte-preserved.
- Browser QA at phone/iPad widths is pending: this managed environment has no callable `cua_repl.js` browser tool. Per the Sites skill, no alternate browser-control route or preview server was started.
- Mac signing, signed bundle comparison, installation, device launch and installed build checks require Kevin's Mac and connected devices. These release steps were outside this task and were not attempted.
- Live release/image verification is blocked by the proxy 403 described above. No publication, main-branch push, build-number change or device install occurred.
