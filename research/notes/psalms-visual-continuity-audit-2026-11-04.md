# Psalms visual continuity audit — 2026-11-04

## Scope and preserved baseline

Psalms only, on isolated branch `codex/psalms-chapter-art-2026-11-04` at `/workspace/biblelens-psalms`, based on GitHub main `c90aa0d01679116bef5c921ed4a991e95478f2b3` (build 340). The original `/workspace/biblelens` checkout is preserved. No main merge/push, Sites write/publication, build-number change, native signing or device installation is authorized by this branch task.

Read `AGENTS.md`, `RELEASING.md`, the Numbers–Deuteronomy/Joshua continuity audits, the Samuel audits and superseding continuity fixes, and the build 340 release audit before integration. A fresh read-only Sites clone at `8e5c594a219ec466a210181c0bf46805fd2b5a3c` has byte-identical production `src`, `data`, `scripts`, `worker` and `db` content to the starting main. Sites metadata reports version 329. The Sites source helper is unavailable in this environment; the mirror was opened using ordinary Git with the fresh repository credential passed on hidden stdin, never written into a URL or file. No independent mirror work was found. Live `/release.json` returned HTTP 403; it was not retried or bypassed. Current live bytes are unverified here.

## Coverage and poetic scenes

All 150 psalms now have one relevant opener, using `afterVerse: 0`; no released Story image starts at verse 1. The released UX13 Story catalog retains one existing inline image at Psalm 89:3: `Davidic Covenant`, `src/assets/story-davidic-covenant-v1.webp`. It remains unchanged. The raw Story catalog alone omits this generated heading, so the source audit uses the exact released catalog transforms from the build. Total active Psalms placements: 151 (150 new openers and one retained inline Story). Existing image metadata, Story captions, scripture, hosted-artwork pin and assets from all earlier books remain untouched. The shared explicit-ID coverage map adds Psalms as reader ID 18; its checker now tests that removing Psalm 1 fails closed.

The scenes illustrate poetic motifs, settings and metaphors from the local KJV text. They are imagined art, never archaeological evidence, exact city/temple plans, historical portraits or claims of a single narrative date. For example Psalm 37's green tree is a simile about the wicked, not an added claim that the psalm promises prosperity. Psalm 44's sheep illustrate the stated metaphor without a graphic slaughter scene; the scripture remains intact. Some abstract poems use a contextual empty room, pathway or sky rather than a literal event. Scene briefs were checked against the local chapter text. Main generation batches received the complete local psalm; the first draft and versioned corrections used their specific verse motifs.

## Character and group continuity

`psalms-prior-artwork-inventory-2026-11-04.json` inventories all 532 existing chapter/Story placements in books before or at Psalms and the people linked to Psalms by the reference index. These indexed textual references are not proof that each person is visibly identifiable in each scene. It also records the earlier audits' David, Moses and Aaron anchor paths, stable traits and exclusions. The full prior audits remain authoritative for their unresolved breaks. No uncertain or unfinished portrait from any concurrent book is used.

All new scene briefs exclude humans, named portraits and recognizable recurring groups. Motifs include water from rock without Moses, oil without Aaron, royal objects without David, and willow/river imagery without a newly invented exile group. Genesis 7 (`src/assets/chapter-genesis-07-opening-v1.webp`) is supplied as an actual file to each generation as a STYLE reference only; its people are never identity inputs. No new image depends on unapproved Kings/Chronicles/Ezra/Nehemiah/Esther/Job/Proverbs work. The literal approval chain for named faces is therefore not extended by this book. A future change introducing a portrait must inventory and supply actual approved identity files.

All 150 selected WebP openers were reviewed as complete scenes at their native 960×540 size, singly or in sheets whose component images were not resized. Original-size views also checked the versioned corrections and recovered Psalm 130. All four corners of all 153 raw outputs were inspected in original-size strips. Psalm 52 v1 and Psalm 101 v1/v2 contained faint generated lettering and were rejected. The selected `chapter-psalms-052-opening-v2.webp` and `chapter-psalms-101-opening-v3.webp` are clean new scenes, generated with the actual Genesis 7 style input. Rejected original PNGs remain in the cloud workspace and are recorded in provenance; they were never approved or bundled application assets.

Visible birds, chicks, sheep/lambs, cattle, deer, dogs, sea creatures and the Psalm 109 locust have no clear malformed anatomy. Hidden or occluded anatomy cannot be guaranteed. Psalm 104 includes ships and sea creatures from 104:25–26; no exact sea region or ancient animal sighting is claimed. Imagined plant varieties, instruments and architecture are not specimen-level historical reconstructions. Psalm 33's image is used as general stringed-instrument imagery for the new song in 33:3, with no exact string-count claim. Several images repeat olive-tree framing and distant hills; primary subjects and palettes vary, but phone/iPad reading rhythm remains unverified.

The retained Psalm 89:3 David image was opened at full 1200×675 size beside `story-david-becomes-king-v1.webp`, `story-david-in-the-wilderness-v1.webp` and `story-the-davidic-covenant-v1.webp`. Adult complexion, tight dark curls, beard, facial profile and build are broadly compatible. The bowed view limits exact likeness comparison; no clear identity break was found. The visible cupped hands have no clear defect; covered legs cannot be checked. This is a poetic remembrance, not a securely dated later portrait; it is not used to reset David's age or as a new identity anchor. No new portrait was generated.

The initial long generation batch exceeded its record-storage string limit while saving base64 image data. The saved files were preserved, 131 records were recovered, and the unrecorded Psalm 130 file was matched at original size to its morning-wall motif. Remaining calls retained filenames and prompt metadata only. The final manifest accounts for all 153 outputs: 150 selected and three rejected. No paid API, new credentials or substitute image service was used. OCR of 121 drafts was noisy and missed known lettering; visual checks, not OCR, determined acceptance.

## Chapter motif plan

| Psalm | Verse motif | Scene brief |
| --- | --- | --- |
| 1 | 1:3 | A thriving fruit tree beside flowing streams. |
| 2 | 2:9 | A broken clay vessel and plain iron rod on stone. |
| 3 | 3:3 | A worn round shield leaning against a rocky refuge at dawn. |
| 4 | 4:8 | A quiet empty sleeping mat in a simple house at night. |
| 5 | 5:3 | An empty courtyard opening toward the morning sky. |
| 6 | 6:6 | A rumpled empty couch and tear-damp linen in lamplight. |
| 7 | 7:15 | An empty freshly dug pit in rough ground. |
| 8 | 8:3 | The moon and many stars over open country. |
| 9 | 9:9 | A rocky refuge above a harsh exposed valley. |
| 10 | 10:9 | An empty hunters net partly hidden beside a village path. |
| 11 | 11:1 | A small bird flying toward a mountain refuge. |
| 12 | 12:6 | Silver glowing inside an earthen refining furnace. |
| 13 | 13:6 | A simple ancient lyre resting in a dawn-lit doorway. |
| 14 | 14:7 | A hill-country path leading toward distant Zion. |
| 15 | 15:1 | A modest linen tent on a quiet hill. |
| 16 | 16:5 | A clay cup beside boundary cords in pleasant farmland. |
| 17 | 17:8 | A bird sheltering its young beneath a wing. |
| 18 | 18:2 | A massive rock face offering shelter above a valley. |
| 19 | 19:1 | The first sunlight spreading across a broad sky. |
| 20 | 20:5 | Plain woven banners raised above an empty courtyard. |
| 21 | 21:3 | A simple gold crown resting on folded cloth. |
| 22 | 22:15 | A broken dry potsherd on parched earth. |
| 23 | 23:2 | Green pasture beside still water, with a shepherd staff resting nearby. |
| 24 | 24:7 | Tall ancient wooden gates opening in stone walls |
| 25 | 25:4 | A winding footpath through rocky hills. |
| 26 | 26:6 | A stone washing basin beside an empty altar courtyard. |
| 27 | 27:5 | A simple shelter tent on a high rock. |
| 28 | 28:7 | A plain shield leaning on a strong rock. |
| 29 | 29:5 | Storm winds breaking a cedar branch in rugged mountain forest. |
| 30 | 30:5 | Night clouds giving way to bright morning. |
| 31 | 31:3 | An ancient stone refuge on a steep rocky ridge. |
| 32 | 32:7 | A sheltered cleft in rock during rain. |
| 33 | 33:3 | Stringed instruments for a new song; no exact string-count claim. |
| 34 | 34:8 | A small rustic meal of bread and fruit in warm daylight. |
| 35 | 35:2 | Two ancient shields propped beside a rocky path. |
| 36 | 36:8 | A flowing spring feeding a clear river. |
| 37 | 37:35 | A spreading green tree beside an open field. |
| 38 | 38:5 | An empty low sickbed in a shadowed simple room |
| 39 | 39:5 | A small ancient balance and its weights on stone, expressing life's measure. |
| 40 | 40:2 | Firm dry rock above a muddy empty pit. |
| 41 | 41:3 | An empty bed with freshly arranged linen in a humble house. |
| 42 | 42:1 | A single deer bending toward a flowing brook. |
| 43 | 43:3 | Sunlight showing a path up a hill toward a simple sanctuary approach. |
| 44 | 44:22 | A small flock of sheep beside a fenced hillside |
| 45 | 45:8 | Rich woven cloth and small fragrant resin vessels in an ancient chamber. |
| 46 | 46:4 | A calm river running beside a modest ancient stone settlement. |
| 47 | 47:5 | A plain ancient trumpet resting high on stone against an open sky. |
| 48 | 48:12 | A distant ancient hilltop town with stone towers, imaginative and non-specific. |
| 49 | 49:10 | Weathered empty stone tomb entrances in a hillside. |
| 50 | 50:10 | A few cattle grazing on wide green hills. |
| 51 | 51:7 | A leafy hyssop-like sprig beside a clay bowl of clear water |
| 52 | 52:8 | A flourishing olive tree near a simple sanctuary courtyard. |
| 53 | 53:6 | An open hillside route toward distant Zion. |
| 54 | 54:6 | An empty stone altar with a small vessel of grain nearby. |
| 55 | 55:6 | A single dove flying across an open blue sky. |
| 56 | 56:8 | A small clear glass tear bottle resting beside folded linen. |
| 57 | 57:1 | A small bird sheltering under a broad protective wing. |
| 58 | 58:7 | Water draining away through dry rocky channels. |
| 59 | 59:6 | Distant village dogs outside an ancient town at evening |
| 60 | 60:4 | A plain fabric banner on a ridge after a storm. |
| 61 | 61:2 | A high rock rising above a narrow valley. |
| 62 | 62:6 | A sturdy rocky stronghold against a blue sky. |
| 63 | 63:1 | A parched desert landscape beneath clear morning light. |
| 64 | 64:3 | An ancient bow and arrows lying unused on a stone ledge. |
| 65 | 65:13 | Green pasture and grain fields bright after rain. |
| 66 | 66:6 | A dry stony passage between shallow receding waters, poetic allusion |
| 67 | 67:6 | An abundant ripe grain harvest in open farmland. |
| 68 | 68:15 | A rugged many-peaked mountain under moving clouds. |
| 69 | 69:2 | Deep muddy water and reeds in a shaded marsh. |
| 70 | 70:5 | A small shelter in an exposed landscape, expressing need and rescue. |
| 71 | 71:3 | A strong rock refuge overlooking a difficult path. |
| 72 | 72:6 | Gentle rain falling on a mown meadow. |
| 73 | 73:2 | A steep slippery stony path above a ravine. |
| 74 | 74:6 | A damaged ancient sanctuary doorway with split timber |
| 75 | 75:8 | A cup of dark wine on a rough stone table. |
| 76 | 76:3 | A broken bow, shield and sword lying unused on earth. |
| 77 | 77:19 | A luminous path of reflection across a deep stormy sea. |
| 78 | 78:15 | Water pouring from a cleft rock in dry country |
| 79 | 79:1 | An empty damaged stone courtyard with scattered masonry |
| 80 | 80:8 | An old vine spreading along a dry stone wall. |
| 81 | 81:3 | An ancient ram horn and hand drum on woven cloth beneath a night sky. |
| 82 | 82:5 | Cracked stone foundation blocks in deep shadow. |
| 83 | 83:13 | Wind carrying dry chaff across a bare threshing floor. |
| 84 | 84:3 | A sparrow beside a nest in the eaves of a modest ancient courtyard. |
| 85 | 85:11 | Tender green shoots rising from earth under bright clouds. |
| 86 | 86:11 | A narrow country path opening into clear morning light. |
| 87 | 87:1 | Ancient stone foundations on a mountain slope. |
| 88 | 88:6 | A deep empty stone pit beneath a dark sky. |
| 89 | 89:37 | A full moon above an ancient hill-country landscape. |
| 90 | 90:5 | Morning grass with dew, with dry grass further away. |
| 91 | 91:4 | A bird sheltering its small young beneath protective feathers. |
| 92 | 92:12 | A tall date palm and a cedar against clear blue sky. |
| 93 | 93:3 | Powerful rising river waters beneath a pale sky. |
| 94 | 94:22 | A sheltered refuge in a solid rock outcrop. |
| 95 | 95:4 | Mountain heights and a distant sea in one broad landscape. |
| 96 | 96:12 | Sunlit forest trees beside an open field. |
| 97 | 97:4 | Lightning illuminating a rugged landscape at night. |
| 98 | 98:6 | Ancient trumpets and a ram horn resting beside the sea. |
| 99 | 99:5 | An empty ancient footstool before a plain seat in a shaded chamber |
| 100 | 100:4 | An inviting open gate into an empty stone courtyard. |
| 101 | 101:2 | A quiet path through a humble ancient house courtyard. |
| 102 | 102:6 | A lone desert bird among barren stones, natural anatomy |
| 103 | 103:15 | A small wildflower in grass bending in the wind. |
| 104 | 104:25–26 | A broad sea with ships, fish, a turtle and a breaching whale. |
| 105 | 105:41 | Water flowing from a rock into dry desert ground |
| 106 | 106:9 | An empty path beside deep receding sea water, poetic historical allusion. |
| 107 | 107:23 | An ancient wooden sailing ship upon rolling sea waves. |
| 108 | 108:2 | A lyre and small harp catching the first dawn light. |
| 109 | 109:23 | A locust and long evening shadows on a stone path. |
| 110 | 110:7 | A clear brook crossing a rocky path. |
| 111 | 111:5 | Bread and grain set out in an empty ancient courtyard. |
| 112 | 112:4 | A lamp shining in a dark ancient doorway. |
| 113 | 113:3 | Sunlight stretching from the horizon across the land. |
| 114 | 114:8 | A clear pool fed by a spring emerging from rock. |
| 115 | 115:4 | Small gold and silver worked objects lying inert on an ancient workbench |
| 116 | 116:13 | A plain cup lifted on a low stone pedestal in soft daylight |
| 117 | 117:1 | Broad open earth and sky beneath gentle sunlight. |
| 118 | 118:22 | A large dressed cornerstone beside an unfinished ancient stone wall. |
| 119 | 119:105 | A small clay oil lamp lighting a narrow stone footpath at twilight. |
| 120 | 120:4 | Ancient arrows and dark glowing broomwood charcoal beside a stone hearth. |
| 121 | 121:1 | Layered mountain ridges beneath a clear morning sky. |
| 122 | 122:2 | Ancient city gates seen from a quiet road |
| 123 | 123:1 | A wide upward view of clear blue heavens over a low stone roofline. |
| 124 | 124:7 | A broken bird snare with a small bird flying free nearby. |
| 125 | 125:2 | A distant hill town surrounded by larger mountains, imagined non-specific setting. |
| 126 | 126:5 | Ripe grain sheaves standing in a field after sowing and growth. |
| 127 | 127:1 | An unfinished ancient house with tools set down |
| 128 | 128:3 | Young olive shoots growing around a mature trunk beside a simple table. |
| 129 | 129:6 | Dry grass growing on a flat ancient roof. |
| 130 | 130:6 | A quiet empty city wall at the first light of morning. |
| 131 | 131:2 | A folded soft cloth on a quiet domestic bench, expressing stillness |
| 132 | 132:17 | A small clay oil lamp burning in a shaded ancient chamber |
| 133 | 133:2 | Fragrant oil pouring from one small vessel into a shallow bowl |
| 134 | 134:1 | A lamp-lit empty sanctuary courtyard at night |
| 135 | 135:7 | Clouds rising above the land with lightning and rain in the distance. |
| 136 | 136:9 | Moon and stars above a peaceful ridge at night. |
| 137 | 137:2 | An ancient lyre hanging from a willow beside a broad river. |
| 138 | 138:2 | A moonlit empty sanctuary approach with oil lamps |
| 139 | 139:9 | The earliest dawn light over a distant sea. |
| 140 | 140:5 | A concealed empty snare beside a rocky footpath. |
| 141 | 141:2 | Incense smoke rising from a small ancient brazier at evening. |
| 142 | 142:7 | A dark empty cave opening onto a wide bright valley. |
| 143 | 143:6 | Dry cracked earth awaiting rain beneath dim clouds. |
| 144 | 144:12 | A strong young plant and an elegantly worked stone corner pillar in an empty courtyard. |
| 145 | 145:16 | An abundant simple meal with grain, bread, figs and grapes on woven cloth. |
| 146 | 146:7 | A closed ancient doorway with loosened shackles laid outside |
| 147 | 147:16 | Soft snow covering hills and frost on a stone wall. |
| 148 | 148:3 | Sunlight on one horizon fading to moon and stars overhead, poetic sky composition. |
| 149 | 149:3 | A hand drum and ancient lyre resting in a festive empty courtyard. |
| 150 | 150:3–5 | An ensemble of ancient trumpet, lyre, harp, hand drum and cymbals laid out for music. |

## Verification and release dependencies

The source audit (`node research/notes/psalms-artwork-source-audit-2026-11-04.mjs`) passes. It verifies 150 unique openers, valid source image dimensions/size, all 670 baseline `src/assets` files byte-for-byte, all earlier chapter metadata, scripture, Story mappings, package/build number and hosted-artwork pin. Its coverage report records each file's byte length and SHA-256. Total new WebP bytes: 19,896,136; largest: 210,244; every file is below 250,000 bytes.

Consecutive image pairs fewer than five verse positions apart (including chapter boundaries):

| Pair | Distance | Reason retained |
| --- | ---: | --- |
| Psalm 89:0 opener → 89:3 Story | 3 | Moon imagery and the existing covenant remembrance are distinct; the later Story does not count as a verse-1 opener. |
| Psalm 117:0 → 118:0 | 2 | Each short psalm requires its own opener. |
| Psalm 123:0 → 124:0 | 4 | Each psalm requires its own opener. |
| Psalm 131:0 → 132:0 | 3 | Each short psalm requires its own opener. |
| Psalm 133:0 → 134:0 | 3 | Each short psalm requires its own opener. |
| Psalm 134:0 → 135:0 | 3 | Each short psalm requires its own opener. |

No other sub-five-verse pair involving Psalms was found across the Job/Psalms/Proverbs boundaries. No existing Story figure or verse position was removed or shifted. Psalm 89 is the priority rendered-layout check.

`npm run build:mobile` completed successfully from the final production source, including packaged retrieval, search-vocabulary, reference-answer, startup and recovery checks. The unsigned offline bundle and current source agree on fingerprint `b5394fda6779c904a13c9b0467512af518e7a90653e7e8699a2ba77a4cf19ea2`; build number stays 340. `npm run check:readability` exited 0 in its existing report-only mode with inherited corpus findings; no scripture or Story prose was changed. `npm run check:images` passed: all 441 registered chapters, all 276 retained Story assets, unchanged scripture, placement, alt text, hidden generic captions, original Story verses/captions, missing-coverage failure cases and exact source/web/offline byte parity. Its inherited 1 Samuel close-pair report is unchanged. `git diff --check` passed. The original checkout and read-only Sites mirror remain clean. GitHub connected identity is verified as `kev-mac` (public ID 2168970); commits use `2168970+kev-mac@users.noreply.github.com`, not a personal email. Only the dedicated feature branch is pushed.

No managed `cua_repl.js` browser-control tool is available in this cloud session. Per Sites preview instructions, no alternate browser was installed or preview server started. Phone/iPad rendered layout and physical-device checks are unavailable here. Source placement/alt/caption and shared offline-byte checks do not substitute for those visual checks.

Build 340's published Worker had only 113,475 bytes of remaining Sites headroom. This branch produces a 90,825,062-byte default lazy Worker, above the 66,060,288-byte Sites limit by 24,764,774 bytes. These branch assets must not be deployed as an unreviewed embedded expansion. A release integrator must reconcile all concurrent branches, publish the approved public asset commit, extend the checked immutable hosted-artwork allowlist/pin as needed, rebuild both bundles and verify the actual Worker budget. Do not change the existing public pin in parallel book branches. This task does not publish or claim synchronized signed/live assets.

Integration instructions: merge the `18:*` chapter metadata keys and the explicit `[18, ['Psalms',150]]` coverage-map entry while preserving every other concurrent book's IDs and additions. Preserve the new Psalm 1 missing-coverage failure check. The final artwork files are named `chapter-psalms-NNN-opening-v1.webp`, except 052 uses v2 and 101 uses v3. Do not duplicate the existing Psalm 89:3 Story or remove it to hide the close pair. No new scene depends on unfinished parallel-book faces or groups. Existing earlier-book continuity uncertainties remain in their original audits and were not used as new identity anchors.

Validation evidence in this cloud workspace: `/tmp/psalms-build-mobile.log`, `/tmp/psalms-images.log`, `/tmp/psalms-readability.log`, `/tmp/psalms-source-audit.log`, source coverage JSON and the checked-in generation provenance. No automatic approval rejection occurred. The denied action was a read-only GET of `https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json` (HTTP 403); it was not retried or bypassed. No approval request is pending. Live bytes, rendered phone/iPad layout, signed native bundle parity and physical-device behavior remain unverified and require the coordinated release environment. No main merge/push, publication, version increment, installation or work on another book was performed.
