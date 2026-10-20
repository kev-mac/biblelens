# Tier 1 characters, batch C9: Gospel remainder (2026-10-19)

File: `gospel-remainder-characters-records.json` (11 profiles, `src/data/characters.json` shape, era `Gospels`).
People: Andrew, James son of Zebedee, John son of Zebedee, Matthew (Levi), Philip the apostle, Nathanael, Herod Antipas, Herodias, Joseph of Arimathaea, Barabbas, Annas.

## Method
- Chosen from the Matthew, Mark, Luke, John and Acts story drafts; none exist in `src/data/characters.json` or earlier character drafts. KJV verses read from `data/chapters.json` by script; every key verse resolves. Summaries in my own words.
- `linked_stories` use the `storySlug` rule (`{book}-{slug}`). Where Matthew and Mark share a story title, both are linked.

## For Codex
- Links point to story drafts not yet in `data/stories.json`; `validateCharacters` rejects them until the stories are merged (or set `linked_stories` to `[]`).
- Adding profiles changes the total asserted in `scripts/check-characters.mjs`.
- IDs: `philip-the-apostle` (not the evangelist `philip-the-evangelist`), `matthew-levi`, `herod-antipas` (the KJV says only "Herod" or "Herod the tetrarch"), `joseph-of-arimathaea`.

## Judgment calls
- The beloved disciple is not identified with John son of Zebedee (John 21:24 gives no name); stated in his summary.
- Nathanael is not equated with Bartholomew, and Matthew is equated with Levi only as the usual reading; both flagged in the summaries.
- Barabbas's offence is given in each Gospel's own words (they differ in wording).
- Annas: the text does not say whether John 18:19-23 means Annas or Caiaphas; left open. His `children` lists Caiaphas's wife (unnamed), from "father in law" in John 18:13.
- Herodias's daughter is unnamed in the Gospels.

## Not added (next C unit)
Acts remainder: Ananias and Sapphira, Ananias of Damascus, Simon Magus, Dorcas, Eutychus, Demetrius, Claudius Lysias, Luke. Then E.
