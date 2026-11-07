# Ruth artwork cloud review — 2026-11-07

## Source and outcome

Fetched and fast-forwarded the clean canonical checkout to GitHub main `a4e31a3134dfba8a07c40f7af240abaefa516a31`. Opened public Sites with a fresh scoped source credential. The source helper was absent in the filesystem search; ordinary Git used hidden stdin and an in-memory child environment, without credential files or arguments. Fresh mirror HEAD: `11678abafe29583f0a3ffb6fe31a4c043eb79a8a`. No mirror-only paths or independent production changes were found; the only differing mirror-tracked file was the later canonical Judges audit. No stashes or unrelated edits were altered.

**All four existing Ruth images are retained. No replacement, image generation, metadata change or application-code change is needed.** Build remains **366**, fingerprint `76051e3cb94714ca4022fa7bd44140a47512485d2c5875b04097d267faf1a2fe`. Documentation checkpoints do not change release identity. Existing Genesis–Judges corrections and all videos/posters remain intact.

Read AGENTS.md, RELEASING.md, the Judges handoff/audit/inventory/corrections/refinement and build-366 verification, plus the prior Ruth continuity audit and combined continuity-fix audit. This session reviews Ruth only; 1 Samuel has not been started.

## Full-size scene and continuity review

Viewed the actual approved Genesis 7 file (`src/assets/chapter-genesis-07-opening-v1.webp`) for style only, and every Ruth original at its native 1200×675 resolution. Compared the four images across the book for faces, complexion, curls, apparent age, build, relationships, hands/thumbs/fingers, arms and legs. No clear visible malformed anatomy or identity break requires replacement. Occluded fingers, covered limbs and small distant faces cannot support exact anatomy judgments.

| Chapter | Retained file in `src/assets/` | Text and visual decision |
| --- | --- | --- |
| 1 | `story-naomi-and-ruth-return-to-bethlehem-v1.webp` | Ruth supports Naomi on their return (1:19–22). Plausible grip on Naomi's arm and bag straps, natural fabric and daylight. |
| 2 | `story-ruth-gleans-in-boaz-s-field-v1.webp` | Gleaning and Boaz's attention fit 2:3–9. Ruth's lowered face/curls match the first scene; stalk grips, Boaz's open hand, arms and workers have no clear visible defect. |
| 3 | `story-the-threshing-floor-v1.webp` | Ruth and Boaz converse beside grain at night (3:8–14). This selects a conversation moment rather than illustrating every action. Same faces/hair/build, blue night light, plausible visible hands; blanket conceals lower anatomy. |
| 4 | `story-boaz-redeems-and-marries-ruth-v1.webp` | Gate witnesses and sandal transaction fit 4:1–11. Ruth/Naomi's presence is imagined attendance, not a claim that the text places them there. Boaz, the women, seated arms/hands and sandal holder remain coherent. |

Actual approved identity anchors for future scenes:

- Ruth: chapter-1 Story file above establishes a young adult, warm medium-brown complexion, oval face, defined brows, dark natural curls around forehead/cheeks and slim adult build. Chapters 2–4 retain these features; downward pose and differing light limit exact comparison. Teal wrap and cream dress also recur but are not the sole identity evidence.
- Naomi: chapter-1 Story file establishes an older, slight woman, lined brown face, gray curls, cream covering and charcoal outer wrap. Chapter 4 matches without unsupported aging.
- Boaz: chapter-2 Story file establishes a mature, sturdy brown man with broad face, strong nose, dark curls and gray in a full beard. Chapters 3–4 remain compatible over the harvest period; do not infer a numeric age.
- Active chapter/Story metadata has no earlier recognizable Ruth, Naomi or Boaz portrayal in Genesis–Judges. Their book is set during the judges; book order alone does not imply a generation has passed. Anonymous harvest workers/gate witnesses are not established earlier identities. Elimelech, Mahlon, Chilion, Orpah, Obed, Jesse and David are not identifiable in these four scenes.

No image generation occurred. Any future new identifiable scene must receive the actual relevant approved files as image inputs; descriptions alone do not satisfy the continuity rule. Earlier books' named identity ledgers continue to apply independently.

## Coverage and evidence

`ruth-artwork-inventory-2026-11-07.json` records all four paths, alt text, dimensions, byte counts, SHA-256 values, placements and generated API evidence. All four Story images occur at verse 1, before the verse text; no chapter-image entries, duplicate openers or later placements exist. Generated headings match the Story metadata. Existing Story captions and small italic styling remain; generic chapter captions are absent.

Every Ruth source file equals its built Worker response, offline `www` copy and Sites source copy byte for byte. All KJV/ASV/WEB verse strings match the original compressed source. Canonical, generated Worker, offline and mirror release metadata agree. Internal verse-position distances are 22, 23 and 18; Judges→Ruth is 26 and Ruth→1 Samuel is 22. No Ruth or boundary pair is below five. The inherited 1 Samuel 7:0→7:2 close pair is reported by the shared image suite and is outside Ruth's scope.

## Verification limits

Browser QA, live HTTP verification and signed-device parity remain separate requirements. This managed environment exposes no callable `cua_repl.js`/desktop JavaScript tool. No substitute browser control, browser installation or preview server was used. The release gate's actual result is recorded in the companion verification JSON; individual passing checks do not turn an incomplete full gate into a pass.

The live hostname remains outside the enforced egress policy and no environment-change tool is exposed. The inherited denied live request was not retried or bypassed; `release:verify` remains deferred. Native Sites publication metadata cannot establish live release/image delivery.

No Mac connector, configured VPN/authorized device route, Xcode or xcrun is available. Signing, signed `App.app/public` versus `www` comparison, installation, installed-build queries and launches are deferred. Build 359 was the last historical installed report, not a fresh query. No native/web synchronization is claimed. The owner explicitly authorized continued cloud book progress when Mac/devices are unavailable.
