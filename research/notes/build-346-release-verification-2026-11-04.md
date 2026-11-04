# BibleLens build 346 release verification

The Explore update is published at https://scripture-lens.kvn-mcgwn.chatgpt.site as Sites version 335. Both devices have version 1.1.0, build 346 installed. iPhone launch PID 46259 and iPad launch PID 17815 were activated successfully and present in subsequent process listings. Physical device screens were not inspected.

## Behavior and source

The default Explore view has one horizontal row of seven larger cards: Stories, People, Places, Laws, Lost Books, Evidence & Interpretations, and Timeline. The combined evidence card opens `#questions?mode=text`, where readers can switch text, science, history and translation filters and reach Contradictions. Timeline keeps its separate destination. Collection pills, direct Manuscripts shortcuts, keyboard navigation, pager and touch scrolling remain available. Cards retain a 240px minimum width instead of shrinking to fit seven on small screens.

The release source is commit 30bd04f43248cd781468c8bf47df49a46d313a1e. Version 1.1.0/build 346 has source fingerprint `115afea2c21cf5a2c53c6b1a6a900c0405e3a1a1a6e06ba2d69360f46831bdea`. Sites mirror packaging commit is `3663c831dbb2ff14fd3ffc89129298ff508542f0`; deployment `appgdep_6aeb71af72e081919483038b7b166de8` succeeded at 2026-11-04T17:56:13.053568+00:00. The existing public audience and immutable artwork pin `e3ae4ba436c9a79c1fb34c87b1a372ac59faeeca` are unchanged.

## Build recovery and checks

The build now passes prepared assets directly to the Worker optimizer. It avoids constructing, writing and reparsing the roughly 298MB intermediate artwork Worker, and streams equivalent JSON into the immutable pack hash. Regression checks establish byte-identical legacy/prepared results in compressed and static modes, complete emitted files and representative runtime responses. Final full release preparation passed with a 2048MiB Node heap cap in 206.66 seconds; measured peak RSS was 2,973,171,712 bytes. The generated self-contained Worker is 64,011,471 bytes, below the 66,060,288-byte limit by 2,048,817 bytes.

Full preparation passed aggregate content/readability/search checks, Chromium/WebKit runtime/loading/CSP checks, synchronization and release checks, mobile packaging and mobile checks. Readability retains the project's report-only treatment for inherited content. Twelve responsive Explore cases passed across phone, iPad and desktop sizes, including 200% text, and five broader approved UX cases passed. One initial responsive assertion ran before ResizeObserver settled; an unchanged fresh retry passed all twelve. The broader UX test was corrected to wait for bookmark scroll restoration and reopen verse controls normally; no reader runtime change was made. The full preparation was rerun after that test change.

All 1,189 chapters, 1,398 illustration placements and Story coverage passed image and packaged offline checks with zero network access. All scripture values and own-property presence were preserved, including 27 present empty strings and the two absent WEB fields in Romans 16:26–27. All 1,476 baseline source asset files are unchanged. The inherited Genesis 17 opening pair and other disclosed spacing pairs remain unchanged. Strict codesign verification passed; all 1,502 www files match the signed app, with only the two expected Capacitor Cordova stubs extra.

The live browser showed build 346, exactly one row, seven cards at 280px width and equal top positions at a 1280px viewport, with no document overflow. The evidence card loaded the shared mode controls; changing to History loaded 123 records, and returning to Explore worked. Responsive browser checks establish layout behavior; they do not constitute visual inspection of physical device screens.

`release:verify` passed again after installation for live website, mobile assets, Sites mirror and canonical source. All 1,189 live chapters match text, edition-field presence and illustration metadata. All 1,393 live images (175,226,554 bytes) match source, www and the signed app exactly. All were served from the Site origin. The audit completed successfully; transient response details, if any, are recorded in the live asset JSON. No release blockers remain.

## Preservation and evidence

The original checkout remains clean and all four existing stashes are preserved. Signed prior apps, archived worktrees, release archives, user files and Git refs/reflogs remain intact. Only regenerable generated outputs and Xcode caches were cleared. Two history-preserving Git compaction attempts failed for disk space; their failed temporary packs were removed after exit, with refs verified unchanged. No credentials, notes or security settings were changed.

Supporting reports are adjacent: build-346-source-preservation, build-346-signed-asset-verification, build-346-device-verification, build-346-live-browser-verification and build-346-live-asset-verification JSON files. Build recovery implementation is explained in explore-single-row-build-recovery-2026-11-04.md. Runtime logs use `/tmp/biblelens346-*`.
