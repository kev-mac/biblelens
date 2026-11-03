# Judges visual continuity audit · 2026-11-03

## Coverage and placement

All 21 chapters have an image at the opening position: seven existing Story images at verse 1 (1, 4, 6, 9, 13, 17, 19) and fourteen chapter openers at position 0 (2, 3, 5, 7, 8, 10–12, 14–16, 18, 20–21). Existing later Story images remain at verses 2:6, 3:7 and 10:6. Chapter artwork has descriptive imagined-scene alt text and no generic visible caption. No consecutive Judges images are fewer than five verses apart, including chapter breaks.

## Continuity inventory

The earlier Joshua audit documents Joshua's approved identity anchors and unresolved earlier Numbers/Deuteronomy breaks. No new Judges opener depicts Joshua. Judges' existing Story images establish Deborah and Barak (`story-deborah-and-barak-v1.webp`), Gideon (`story-gideon-and-the-midianites-v1.webp`), Jotham (`story-abimelech-v1.webp`), Jephthah and his daughter (`story-jephthah-s-vow-v1.webp`), Samson (`story-samson-v1.webp`), and Micah and the Levite (`story-micah-s-idols-and-the-danites-v1.webp`). They remain at their existing verses. None of the new openers adds a recognizable portrayal of these people. The chapter 2 messenger is viewed from behind; chapter 18 scouts and chapter 20 assembly are anonymous groups. The Gaza gate in chapter 16 is empty. No new identity anchor is established by these openers.

The approved Genesis 7 ark art was supplied as a style input, never as identity. Kevin's evening-sky reference was supplied for the revised chapter 14 and 15 realism. Generated drafts for chapters 12, 14, 15 and 16 repeated the same three figures or supplied invented foreground figures. These were rejected. Chapter 12 uses the earlier empty river scene; chapters 14 and 15 use versioned v2 replacements with no people; chapter 16 uses an empty gate scene. V1 drafts for 14 and 15 are retained in source but are not active or hosted. The accepted scenes were compared in a full-book contact sheet. People-bearing new scenes were inspected at full resolution for visible limbs, hands and context; distant figures do not support facial identity judgments.

## Verification

The 14 active assets were pinned to public GitHub commit `05b8a5a0c729c1e5d9cdc577d6b7a2fb9c5dd492`. `build:mobile`, `check:images`, `check:readability`, and `check:release` passed. The shared release preparation also passed its full checks. The live Site, canonical source, Sites mirror, and mobile assets passed `release:verify` at build 339, source fingerprint `4a4c3a7f0e0a`. All 24 unique Judges chapter and Story image URLs returned bytes identical to `www` and the signed iOS app. The signed `public` directory matches `www`; Capacitor adds only its two Cordova bridge files.

Both the connected iPad and iPhone report installed build 339. Launches were attempted on both, but iOS refused because both devices were locked. Browser checks visited all 21 chapters at 390 px phone and 768 px iPad widths; every chapter showed a loaded, alt-labeled image before verse 1 without horizontal overflow. These checks do not replace visual inspection on the unlocked device screens. The earlier Numbers and Deuteronomy continuity gaps remain as recorded in the prior audit; no new Judges opener extends those disputed portrayals.
