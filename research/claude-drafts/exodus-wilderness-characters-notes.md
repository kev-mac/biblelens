# Tier 1 characters, batch C1: Exodus to Joshua wilderness cast (2026-10-19)

File: `exodus-wilderness-characters-records.json` (12 profiles, `src/data/characters.json` shape, era `Exodus`).
People: Jethro, Zipporah, Eleazar, Phinehas, Caleb, Korah, Balaam, Balak, Nadab, Abihu, Hur, Bezalel.

## Method
- Selected from `data/reference/people.json` by references in Exodus to Deuteronomy, excluding the 47 existing profiles, and by appearance in the Exodus to Numbers story drafts. Chosen first: named people with a distinct role in a story.
- Every fact was read in the KJV text from `data/chapters.json` (script), summaries in my own words. Names and relations come from the KJV text; Theographic was used only to find candidates and cross-check family links.
- All key verses (and cited books) pass the same existence check as `scripts/characters.mjs`; no ID duplicates an existing profile.

## For Codex
- `linked_stories` use titles and passages from the Exodus to Numbers drafts. Exodus stories are published except `The Book of the Covenant` and `Instructions for the Tabernacle`; every Leviticus and Numbers link points to a draft that is not yet in `data/stories.json`, so `validateCharacters` will reject those links until the stories are merged. Merge the stories first, or strip `linked_stories` to `[]`.
- Adding 12 profiles changes `scripts/check-characters.mjs` counts (total 47, Exodus era 3, tribe 17).
- Sibling links are reciprocal between Nadab, Abihu and Eleazar; Aaron's existing `children` list will now resolve to these profiles.
- Not added: Ithamar, Dathan, Abiram, Sihon, Og (single-episode or no standalone profile; later batch if wanted). Pharaoh is unnamed in these books and was left out.

## Judgment calls
- Hur: the KJV only says he is Bezalel's grandfather of Judah (Ex 31:2; 1 Chr 2:20). Theographic equates him with a son of a Caleb in 1 Chr 2, but that Caleb is a different man from Jephunneh's son in the Hebrew text, so no parentage is given.
- Jethro: the text also calls him Reuel (Ex 2:18); Numbers 10:29 names Hobab as son of Raguel and father-in-law of Moses, which the text leaves ambiguous, so Hobab is not listed as Jethro's child.
- Phinehas: the Eli-line Phinehas (1 Sam) is a different person and is not covered.
- Balaam: described by the text as a seer/soothsayer (Josh 13:22); no moral verdict beyond what the cited NT passages say.
