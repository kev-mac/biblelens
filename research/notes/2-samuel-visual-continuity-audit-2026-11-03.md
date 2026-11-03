# 2 Samuel visual continuity audit · 2026-11-03

## Scope and source

Work is isolated on `artwork/2-samuel-cloud-2026-11-03`, based on GitHub main
`05b8a5a0c729c1e5d9cdc577d6b7a2fb9c5dd492` (Judges artwork, build 339).
The clean starting checkout and other books' artwork were preserved. This task
does not merge, push main, publish, change the build number, or install devices.

Sites source was opened read-only using a fresh credential. Its commit is
`9983427f11fe71a2e6fb6c58ababe5621f344541`, build 338, source fingerprint
`737fc5043ce828e821281d7925cfb8934b930add6bcc56c067a7f3629d9b3e28`.
That matches the Joshua audit's published source. The mirror has no independent
new production work to integrate; GitHub adds Judges. Sites metadata reports
version 327. Direct GET of the live `/release.json` was denied by the environment
proxy (CONNECT 403); no bypass or retry was attempted. Live bytes remain unchecked.

## Chapter coverage

All 24 chapters have exactly one opener. Eight existing Story figures at verse 1
count as openers. Sixteen new chapter figures use `afterVerse: 0`, below the
chapter heading and before verse 1. The two later Story figures remain at their
existing verses. Scripture, Story passages, headings, and existing placements
are unchanged.

| Chapter | Opener | Scene |
| --- | --- | --- |
| 1 | Existing Story | David Becomes King |
| 2 | New chapter | Road to Hebron |
| 3 | New chapter | Ridge road, camp, spear and shield |
| 4 | New chapter | House, grain jar and sleeping mat |
| 5 | New chapter | Jerusalem above a ravine |
| 6 | New chapter | Instruments for the procession |
| 7 | Existing Story | The Davidic Covenant |
| 8 | Existing Story | David and Mephibosheth |
| 9 | New chapter | A place at the king's table |
| 10 | New chapter | Ammonite town and military camp |
| 11 | Existing Story | David, Bathsheba and Uriah |
| 12 | New chapter | Lamb from Nathan's parable |
| 13 | Versioned Story edit | Tamar and Absalom; remove Absalom's royal circlet |
| 14 | New chapter | Tekoa road and mourning shawl |
| 15 | Existing Story | Absalom's Rebellion |
| 16 | New chapter | Two donkeys and provisions |
| 17 | New chapter | Jordan crossing at night |
| 18 | New chapter | Oak woodland |
| 19 | New chapter | Jordan ferry |
| 20 | Existing Story | Sheba's Revolt and the Gibeonites |
| 21 | New chapter | Famine and empty grain store |
| 22 | New chapter | Rock refuge from David's song |
| 23 | New chapter | Lentil field and shield |
| 24 | Existing Story | The Census and the Plague |

Later Story images: Jerusalem and the Ark at 5:6; The Exploits of David's Mighty
Men at 23:8. Some inherited Story illustrations depict a later scene within their
multi-chapter narrative: 1:1 shows anointing, 5:6 shows the chapter 6 procession,
8:1 shows chapter 9's meal, 11:1 shows chapter 12's confrontation, and 20:1 shows
the later city-wall encounter. They remain broad Story banners at their established
Story headings, rather than newly claimed depictions of the opening verse.

New files are `src/assets/chapter-2-samuel-NN-opening-v1.webp` for chapters
2, 3, 4, 5, 6, 9, 10, 12, 14, 16, 17, 18, 19, 21, 22, and 23. All are 960×540.
Provenance is in `src/assets/2-samuel-chapter-art.provenance.json`.
The chapter 23 barley draft was rejected before integration: 23:11 specifies
lentils. The replacement depicts low legume plants. Chapter 10 is a contextual
Ammonite town/camp view, not a claim that the chapter narrates the later siege.

## Identity inventory and references

Every new chapter scene avoids identifiable recurring people or groups. Each
generation received the actual approved file
`src/assets/chapter-genesis-07-opening-v1.webp` as style input only. It was never
used as another character's identity reference. Settings and ordinary props do
not establish new named identities. Full-size sources were inspected; the lamb
and both resting donkeys were also checked for plausible heads, ears, limbs,
hooves and body proportions. No new human anatomy is introduced by the openers.

Earlier portrayals considered before work:

- **David:** `src/assets/story-david-anointed-v1.webp` (youth, short dark curls,
  brown complexion, plain linen); `story-david-and-goliath-v1.webp` (rear/profile
  youth, limited face); `story-saul-s-jealousy-and-david-s-flight-v1.webp` (David
  is the younger linen-clothed recipient on the right; the bearded blue-clothed
  donor on the left is Jonathan, as confirmed by the recorded prompt);
  `story-david-in-the-wilderness-v1.webp` (adult, medium-brown complexion, dark
  tight curls, full short beard, sturdy build, blue mantle). These are under
  `src/assets/`. Do not use Jonathan as David's anchor. The clear 2 Samuel adult
  reference is `src/assets/story-david-becomes-king-v1.webp`, consistent with the
  wilderness adult and the narrative age of 30 at accession (5:4).
- **David within this book:** that accession image, `story-jerusalem-and-the-ark-v1.webp`,
  `story-the-davidic-covenant-v1.webp`, `story-david-and-mephibosheth-v1.webp`,
  `story-david-bathsheba-and-uriah-v1.webp`, `story-absalom-s-rebellion-v1.webp`,
  `story-the-exploits-of-david-s-mighty-men-v1.webp`, and
  `story-the-census-and-the-plague-v1.webp` were inspected at full size. The blue
  mantle, complexion, curly hair and beard are broadly consistent. The rebellion
  figure is older with gray in his beard. Appendix scenes do not establish a
  secure chronological age sequence; do not use a younger-looking appendix
  portrait to reverse that aging without checking the event's date.
- **Nathan:** first identifiable appearance here is
  `src/assets/story-the-davidic-covenant-v1.webp`; compare
  `src/assets/story-david-bathsheba-and-uriah-v1.webp`. Both show a mature
  medium-to-deep brown man with gray curls, gray beard and dark outer cloth.
  No new Nathan image was generated.
- **Tamar and Absalom:** first identifiable appearances are in
  `src/assets/story-amnon-tamar-and-absalom-v1.webp`. Tamar has a medium-brown
  complexion, oval face, dark curls and dark blue wrap. Absalom has a medium-brown
  complexion, long dark curls, beard and sturdy build. The existing image itself
  was supplied as the actual identity input for its versioned edit. The circlet
  was removed because this scene precedes his revolt. Genesis 7 was supplied
  separately for style. No unapproved parallel-book portrait was substituted.
- **Mephibosheth:** first clear adult depiction is
  `src/assets/story-david-and-mephibosheth-v1.webp`; dark curls and beard,
  medium-brown complexion, plain linen, seated, crutches at his side. No earlier
  identifiable adult image was found in the preceding books' active Story art.
- **Joab:** identified by the city-wall Story in
  `src/assets/story-sheba-s-revolt-and-the-gibeonites-v1.webp`; medium-brown
  adult with tight curls, short beard, sturdy build and blue outer cloth.
  Earlier anonymous soldiers cannot securely be assigned to him. They were not
  promoted to identity references.
- **Araunah:** `src/assets/story-the-census-and-the-plague-v1.webp` shows an older
  brown man with gray beard, headwrap and striped earth-tone outer cloth. No
  earlier identifiable active portrayal was found.
- **Recurring groups:** elders, priests/ark bearers, David's followers and mighty
  men appear in retained Story art. Individual anonymous faces cannot be securely
  mapped across crowds or generations; no new recognizable group portraits were
  made. The new musical-instrument image does not redraw priests or the ark.
  Other named people mentioned in the text are not given new portraits.

The parallel 1 Samuel review must be reconciled before a combined release,
especially any changes to David's approved youth/adult anchors. No new opener
depends on that task's unfinished art. Retained appendix age ambiguity and the
Story banners' broad placement are disclosed rather than silently treated as
new, verse-exact portraits. Do not publish an unresolved identity break found
during that combined review.

## Spacing and verification

The ordered source audit includes the end of 1 Samuel, all of 2 Samuel and the
start of 1 Kings. It found **no consecutive image pairs fewer than five verses
apart** involving 2 Samuel. The within-chapter pairs are 5:0 → 5:6 (6 verses)
and 23:0 → 23:8 (8 verses).

All new chapter images have useful alt text prefixed `Imagined scene:`. Chapter
figures omit generic captions; Story figures retain the existing small italic
Story caption. Source CSS keeps figures at 100% width, 16:9, with an 860px maximum
in the reader. This is a source review, not a rendered phone/iPad layout pass.

Managed browser QA is unavailable: this environment has no `cua_repl.js` tool.
Per the Sites skill, no replacement browser was installed or improvised. Rendered
390px/768px checks and unlocked-device visual inspection remain pending. Signed
iOS assets, installed builds, launches and release verification require the Mac
and connected devices and are outside this branch-only task.

The new 2 Samuel chapter assets remain embedded web assets and are copied into
the offline native bundle. This task does not change the hosted artwork pin or
claim these unpublished files exist at a public immutable commit. If the release
integrator elects to host them like Judges, extend the checked host manifest and
book allowlist after the public asset commit exists, then rebuild both outputs.

Final verification:

- `npm run build:mobile`: passed from final production source, including the
  versioned Story edit. No signing or installation was attempted.
- `npm run check:images`: passed. All 276 Story assets and all 256 registered
  Genesis–Judges plus 2 Samuel chapters passed packaged web/native byte parity,
  placement, dimensions, alt text and caption checks. Removing 2 Samuel 2's
  opener is explicitly checked to fail validation.
- `npm run check:readability`: exited successfully; it reports existing corpus
  readability warnings. No scripture or Story prose was edited.
- Source audit: exactly one opener in each of 24 chapters; no duplicate Story
  openers, and no close pairs involving this book across either boundary.
- Source image check: all 16 openers are 960×540 and each is below 250,000 bytes
  (2,266,146 bytes total). The Story v2 is 1200×675 and 126,048 bytes.
- Full-size artwork, side-by-side Tamar/Absalom v1/v2, and the 16-opener contact
  sheet were reviewed. Nine Story images are retained unchanged, one is revised,
  and sixteen chapter images are new. The original Story v1 remains in source.
- `git diff --check`: passed. Build number remains 339, inherited from main.

Integration note: `illustratedBooks` is now a Map keyed by explicit reader book
IDs, so 2 Samuel (9) can be verified while Ruth (7) and 1 Samuel (8) finish
independently. When merging those tasks, preserve each completed book's entry;
do not assign 2 Samuel the next contiguous array index.
