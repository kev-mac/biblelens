# Translation release — build426

Published on 2026-11-13 at https://scripture-lens.kvn-mcgwn.chatgpt.site.

Kevin explicitly approved “merge, push, publish and install” on 2026-11-13 at 19:53:55 UTC. The earlier external-push approval block is resolved. The original feature branch was pushed, then merged with current main through build425, preserving Commandments cb80056 and all video batches through batch12 (165 active videos). No batch13 draft or asset was changed.

## Release identity

- Canonical runtime/main commit: 4d1e2b641670a2a123cbf638c7c8ae5cb224c3eb.
- Translation implementation: 9cb4ca495cbef5852d8413abca581d601db7d386.
- Immutable public alignment data: 66c948f97f1065de111fe7a4a655d7f034b34608.
- Version 1.1.0, build426.
- Source/web/native fingerprint: e7ed2c94b430154b905846e4be01683269cb78b74296982414a16dec3c66dc8b.
- Sites source: 5be14e05d96a40203fb98fec604ea0fe24a99d71.
- Saved version417: appgprj_6acba627a6cc8191932fbbc47db8895d~appgver_6c881200566481918be6cb67e2ce7bcd.
- Deployment appgdep_6af76e36b37c8191bd83ab8c092511f6 succeeded at 20:08:34 UTC; public audience preserved.
- Worker: 62,857,044 bytes, 3,203,244 below the unchanged 66,060,288-byte limit.
- Deployment tar SHA-256: 186dae175a698cf7539dd2c09096428cc854ffd2b1ce290517790941e990454d.

The existing Sites cache was reopened with fresh access. Its build425 source matched canonical a2ca896e before staging; no independent source changes were overwritten. The exact already-built Worker-only package was staged, saved, and deployed through Sites. GitHub main was re-fetched before pushing and remained current.

## Verification

PASS: official release:prepare, including web/native builds, full regression suite, sync, release and mobile checks. The combined Translation browser matrix passed eight Chromium/WebKit cases at 320/390/820/1366 widths; retained Commandments navigation passed four cases at 390/1024. Direct native-bundle confirmation passed in Chromium/WebKit at390 using real packaged Hebrew/Greek files, correct Mattison labelling and unavailable Other Books alignment, with no API or external-origin requests.

PASS after publication: release:verify confirmed live website, native assets, Sites source and canonical fingerprint equality. Exact live gzip data for Genesis1, John1 and Daniel2 matched the source/native byte lengths and SHA-256 values. Four live Chromium/WebKit cases at390/820 passed real Hebrew/Greek/Aramaic loading, missing Matthew17:21, selected-edition switching, RTL, wrapping and no horizontal overflow.

A prepublication release:verify was invoked too early and correctly reported the still-live build425 mismatch; the postpublication verification passed. No release gate was bypassed.

Coverage and primary licensing evidence remain in [translation-data.md](translation-data.md): public-domain publisher-supplied BSB word links, 31,086 populated verses, 19 missing packaged references, all Other Books unavailable, and four missing source transliterations. No verified KJV/WEB/ASV word alignment is claimed. The bsb-v1 chapter namespace is immutable; a future changed dataset needs a new namespace to avoid stale long-lived client caches.

## Physical installation remains pending

This Windows executor could not authenticate to the Mac: the previously known 100.120.117.75 SSH address timed out; the reachable 100.84.56.100 address rejected existing authentication for kevin. No SSH keys, accounts, passwords, or device data were changed. Build426 is NOT claimed installed, signed, or launched on either physical device by this task. Last prior installation evidence was build425.

The local mac-build426-handoff.txt gives the exact approved main commit/fingerprint, publication identifiers, current tests, and instructions to use /Users/kevin/git/BibleLens, preserve edits and concurrent batch13 work, prepare/sign with the established release workflow, independently check the Mac Worker limit, compare every fresh signed public asset with www including all1,189 translation chapters, install on both ready devices without reset/uninstall, and query installed versions and launch state. If a newer coordinated release appears first, do not install a stale build.

This documentation checkpoint does not change the release fingerprint and does not require republication.

