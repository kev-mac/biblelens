# Retained Internal Identifiers

Only displayed labels and the collection route change. Existing records, sync data and stored keys keep their identity.

| Surface | Retained names | Reason |
| --- | --- | --- |
| Device storage and backups | `biblelens-debate-device-v1:`, `deviceDebates`, `BibleLensDebateStore`, `biblelens:debatechange` | Existing choices, saved IDs, exports/imports and storage events must continue to work. |
| Records and category enums | `contradictions`, `questions`, existing status strings, all tags and IDs | Search, filters, cloud data and review provenance reference these values. Labels change only at display boundaries. |
| Existing question feature | `BibleLensDebates`, `BibleLensDraftDebates`, `debates`/`debate` view IDs, `debate-*`, `phase*-verdict*` classes and data attributes | DOM selectors, feature loading and accessibility relationships stay stable; none is a product label. |
| Public APIs | `/api/debates`, `/api/debate`, `verdict`, `proposed_verdict`, `current_status`, `needs_owner_ruling` | Existing clients and pinned research joins use these fields. No schema migration is needed for display renames. |
| URLs | `#debate/<id>`, `#debates` alias; query key `verdict` | Every item bookmark stays valid. Collection links use `#questions`; the alias preserves all query parameters and history metadata. |
| Research paths and schemas | `research/headline-debates`, `research/verdict-ledger`, source commit fields, source hashes, candidate IDs `headline-01`–`headline-40` | Verifiers pin originals and quotes. Decision IDs B01–B40 remain mapped to the same candidates; B01–B30 remain selected. |
| Build/check file names | `debates.js`, `debate-ui.js`, `draft-debates.mjs`, existing check names and asset manifest keys | File names are implementation contracts, not navigation copy. |
| Corpus/product identity | BibleLens globals, scripture-lens package, native app IDs, cache and export names, numeric book/verse IDs | Renaming these would be a product/migration/release task. B4 proposes one Bible config and defers its runtime integration. |
| Research originals and prior reports | historical source titles, exact quotations, archival originals, prior source paths | Provenance must remain verifiable. Active draft views apply proposals; historical artifacts are retained. |

The original `CLAUDE.md` role text stays in place. Its researcher restrictions and scheduler controls remain untouched.
Its historical product description is superseded for Codex/UI work by Kevin's B4 rule and updated AGENTS.md.
