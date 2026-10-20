# Tier 1 characters, batch C10: Acts remainder (2026-10-19)

File: `acts-remainder-characters-records.json` (9 profiles, `src/data/characters.json` shape, era `Apostolic`, matching the earlier Acts batch).
People: Ananias (husband of Sapphira), Sapphira, Ananias of Damascus, Simon the sorcerer, Dorcas, Eutychus, Demetrius the silversmith, Claudius Lysias, Luke.

## Method
- People taken from the Acts story drafts; none exist in `src/data/characters.json` or earlier character drafts. KJV verses read from `data/chapters.json` by script; every key verse resolves and every linked story matches `acts-stories.json` title and passage. Summaries in my own words.

## For Codex
- IDs: `ananias-husband-of-sapphira` and `ananias-of-damascus` (distinct from Ananias the high priest, Acts 23:2, not profiled), `simon-magus` (name label is not in the KJV, said in the summary), `demetrius-the-silversmith`.
- `dorcas` has `linked_stories: []`: Acts 9:36-43 falls outside the "Saul's Conversion" story (Acts 9:1-31) and no Acts draft covers it. Option: extend that story or add a Dorcas story; otherwise leave empty.
- `luke` has `geography.residence: []` (no place stated) and spans books Luke, Acts, Colossians, 2 Timothy, Philemon; if the validator needs a non-empty residence, drop the field.
- Links point to story drafts not yet in `data/stories.json`; `validateCharacters` rejects them until merged. Adding profiles changes the total asserted in `scripts/check-characters.mjs`.

## Judgment calls
- Luke: the text never says the author of Acts is named Luke; the summary separates what the three letters say from the traditional authorship reading.
- Ananias and Sapphira are kept as two profiles with spouse links.
- Ananias of Damascus: Acts 22:12 is Paul's later description of the same man; combined.
- Demetrius is not equated with the Demetrius of 3 John 12.
- Lysias: "chief captain" is the KJV term; the name appears only in the letter (23:26).

## Not added
Ananias the high priest, Alexander, Gaius, Aristarchus, Drusilla, Julius, Publius, Rhoda, Mark (Gospels/Acts cameo cast, Tier 2 or later).
Next: E, academic comparison cards (primary publications actually opened).
