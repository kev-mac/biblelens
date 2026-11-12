# Approved interface proposals 31–33/36 and Prophecies removal

Implemented on combined 21–30 source, without publishing or changing build number.

- 31: Reading shortcut emoji replaced by consistent outline SVGs; existing collection palette retained.
- 32: Each reading plan shows a completed/total count and native progress bar. Existing local checkboxes update progress in place without losing keyboard focus; unrelated/duplicate IDs do not inflate counts. Device-local notice retained.
- 33: Starter prompts use 20px padding, 16px spacing, centered text and no trailing arrows; layout remains responsive.
- 36: People, Places and Laws count rows share list-meta-row styling with Stories/Other Books. Existing Stories count and Explore tile badges unchanged.
- User superseded 34/35 with removal: Prophecies collection access, view, category response and lazy bundle retired. Legacy links redirect to Explore. Underlying research files remain intact.

Verification

- `node scripts/build.mjs`: passed, including build search/startup checks.
- `check-proposals-31-36-browser.mjs`: passed Chromium and WebKit at 390/1024px. Checked icon consistency, progress toggle and reload/reopen persistence, keyboard focus, prompt spacing, all three directory rows, no horizontal overflow and old Prophecies links.
- `check-explore-habits`, `check-prophecies-removed`, `check-prophecies`, `check-marked-workspace`, `check-category-pagination`, `check-header-context`, `check-routes`, `check-directory-letter-rail`, `check-shared-ui`: passed.
- Readability report-only check passed with existing corpus warnings; no new narrative content.
- Screenshots: `.release/proposals-31-36/` (plans, chat, people, places, commandments for both browser engines and widths). Mobile Chromium plan/chat/People pixels inspected.
- Set `PLAYWRIGHT_BROWSERS_PATH=C:\Users\kevma\AppData\Local\ms-playwright` to use already installed browsers; otherwise Windows sandbox profile default cannot locate them.
- No GitHub push, Site publish, iOS build/install, external API use, or network-policy changes. Full npm aggregate not retried because its known registry-network restriction remains; focused checks are not a full aggregate pass.

Combined regression: 21–25 browser suite passed Chromium/WebKit at 320, 390, 820 and 1440px (8 cases). The 26–30 browser suite was blocked when its test server attempted raw.githubusercontent.com artwork access; no network workaround was used, so its combined rerun is not a pass.
