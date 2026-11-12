# Proposals 21–25

Implemented from the owner's approval, with centered action text and no arrow icons on the new actions.

- 21: Other Books source actions are four separate links. Original destinations remain unchanged; visible text explains that they open new tabs.
- 22: Edition & source is a content-sized centered desktop dialog. Mobile retains the scrollable bottom sheet.
- 23: Laws identify linked New Testament texts and explain the P/N prefix without changing record IDs or counts.
- 24: Dark map previews separate land and water more clearly and retain geographic uncertainty captions, exact coordinates and existing OpenStreetMap destinations. Open map is a separate centered action.
- 25: People contact cards show Save/Saved state and a View full profile action using the existing saved store and profile routes.

## Verification

`node scripts/check-proposals-21-25-browser.mjs` tests the web bundle; add `--mobile` to test the offline bundle. Build the corresponding assets first. The test blocks outbound requests and covers Chromium and WebKit at 320, 390, 820 and 1440px, dialog reopening and dismissal, label wording, save toggles, profile navigation, map disclosure, centered actions and horizontal overflow.

Targeted existing checks: lost-books, commandments, characters, places, shared-ui, saved-card, card-disclosures, popup-dismissal, character-connections, directory-letter-rail, mobile-chrome, mobile, release, and readability.

The full npm check invocation was blocked by the execution network policy at registry.npmjs.org. Do not represent targeted checks as the full aggregate suite. Readability is report-only and reports pre-existing corpus warnings.

No push, deployment or device installation is part of this implementation. Rebuild and verify the integrated source through RELEASING.md before release.
