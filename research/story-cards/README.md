# Story card refinement

The 283 displayed stories have independently written browsing excerpts in `data/story-excerpts.json`. They are not generated from the first sentences of expanded narratives. A build-time coverage check and `check-story-cards.mjs` enforce catalog coverage, distinct openers, and short sentences.

Cards retain the existing artwork and passage navigation. A centered chevron opens the narrative; a centered X closes it. People/place links and Read story share one compact action row. Note counts and their separate footer are removed. Excerpts remain readable rather than being clipped; narrow layouts place them below the thumbnail/title row.

## Verification

`node scripts/check-story-cards-browser.mjs` exercises the generated web Worker in Chromium and WebKit at 320, 390, 550, 820 and 1440 pixels. Add `--mobile` after `npm run build:mobile` to exercise the actual offline bundle at the same widths. Both variants check disclosure, keyboard focus, action links, clipping, overflow and direct story navigation and save screenshots under `.release/story-cards*`.

Browser fixtures block all outside requests. Web fixtures substitute local original artwork for remote original-image transport. These checks establish UI and navigation behavior; they do not establish public hosting performance or device installation success.

## Editorial scope

Independent reviewers compared all excerpts with claim-bearing passages decoded from the local scripture corpus. This is a narrative-fidelity check, not a historical or theological adjudication or an audit of every verse. Only the requested Cain and Abel expanded paragraph was rewritten. Some pre-existing expanded summaries have inherited inaccuracies identified during excerpt review; they require a separate follow-up rather than an unannounced whole-catalog rewrite.

Phinehas's linked range includes Numbers 25:7–13 so the actions referenced in his excerpt are available alongside the covenant promise.
