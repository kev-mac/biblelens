# B1 local integration

Base: `origin/main` at `5042278e4961c9c1981f2f5958f527f60b513f78`, build 274.
All work is local on `codex/b1`; the owner prohibited publication and installation.
The main worktree and existing stashes are preserved. No remote fetch was made under the local-only limit.
The cached Sites mirror was at `ceb470c` (build 274 source). The last release report records live rollback to build 273.
No claim is made about current live or signed native alignment.

| Merge | Input | Result | Conflict resolution |
| --- | --- | --- | --- |
| Phase 2 structure + fix-ups | `39a06c069a6ca7e8ce21c53d48a2ff5ed31139e3` | `893132387145ee1b1a07522329d2a83101a04ab3` | `worker/index.mjs`: retain CSP headers from main and add debate APIs. |
| Phase 2 performance | `027f9a8c04568b6d95367f24e884675d97176c03` | `7091d8f77079b0ce9ff4f832cc4146e7b4db37e2` | Startup packaging retains exact script hashes with minification; worker retains CSP plus gzip negotiation. Remove duplicate `check:ui` key; retain security, Phase 2 and performance suites. |
| Search tuning | `c29577c` | `7d19700f0886d52ea5dfb3200a2bc4ae0a1fc93c` | Keep all check scripts. Add shared search core to lazy startup/build paths; preserve packaged chapter decoration, fonts and deferred assets. Keep shared resource cache and add character summaries. |
| Link repairs | `37c58c564c3d444bc5c264cc582253d8f1ab20c2` | `2b317cd4a0a1436bb6b796c30def8e54f295cba5` | No conflicts; only previously verified source URL repairs change accepted data. |
| Hosted CSP | `cf3082919cceb38004affcc08fe23a6ca942e509` | `1658c4b4ea3f6fb280cc2cf46a08f915a5a2f5c9` | Keep debate APIs/gzip and adopt report-only web policy. Keep native enforcement and lazy/minified body hashes. Combine all UI suites. Security fixtures open Read and load deferred evidence before probing sinks; request identity bytes when editing fixture HTML. Explicitly retain build 274, omitting R275's release increment as instructed. |

`a79f353` records the integration correction for deferred CSP bodies, search test cache, and native generated-output cleanup.
The draft research directories are copied verbatim from `2a131a71c937e0a87d0c0dfc67c2b5bfabfdaaf6` and `510b868e82a7c348b1a3336a285fb32401871599`.
They remain drafts. Neither branch's research judgments are accepted by this integration.

Production builds exclude draft payloads. Explicit `BIBLELENS_DRAFTS=1` builds are local review previews.
`NODE_ENV=production` rejects that flag. Preview metadata includes a distinct fingerprint and `draftOnly: true`.
Mobile packaging clears its fixed generated directory before writing; old draft files cannot survive a default rebuild.

Review artifacts: `.review/b1/`. Owner decisions: `/Users/kevin/git/codex-reports/B1-decisions.md`.
