# Tier 1 characters, batch C7: the Gospels cast (2026-10-19)

File: `gospels-characters-records.json` (17 profiles, `src/data/characters.json` shape, era `Gospels`).
People: Mary the mother of Jesus, Joseph of Nazareth, Elisabeth, Zacharias, John the Baptist, Herod the king, Peter, Judas Iscariot, Mary Magdalene, Martha, Mary of Bethany, Lazarus, Nicodemus, Pontius Pilate, Caiaphas, Zacchaeus, Thomas.

## Method
- Chosen from the Matthew, Mark, Luke and John story drafts, excluding the existing profiles and C1-C6 drafts. Verses read from the KJV text in `data/chapters.json` by script; summaries in my own words.
- All key verses, book names and `linked_stories` (id, title, passage, route built with the `storySlug` rule) pass the same checks as `scripts/characters.mjs` (build script: 0 failures).

## For Codex
- `linked_stories` point to Gospel story drafts not yet in `data/stories.json`; `validateCharacters` rejects them until merged. Merge stories first, or strip `linked_stories` to `[]`.
- Adding profiles changes the total asserted in `scripts/check-characters.mjs`.
- Ids avoid clashes: `elisabeth`, `zacharias-father-of-john` (not the prophet Zechariah), `herod-the-great`, `mary-of-bethany`, `lazarus-of-bethany` (not the parable's Lazarus), `joseph-husband-of-mary` (existing `joseph` is the patriarch).

## Judgment calls
- Names follow the KJV (Elisabeth, Zacharias, Herod); modern forms are aliases. `herod-the-great` is displayed as "Herod the king" because the Gospels do not use "the Great".
- Jesus has no profile here: left for the owner (see owner-questions).
- Mary Magdalene is not identified with the sinful woman of Luke 7 or with Mary of Bethany; Mary of Bethany's anointing (John 12) is noted as distinct from the unnamed anointing in Matthew 26 and Mark 14 only in the sense that those texts do not name her.
- Judas: Matthew 27 and Acts 1 accounts of his death differ; both are cited, not harmonized. Origin "Kerioth" is the usual reading of Iscariot, flagged as not stated in the text.
- Peter's wife and Andrew-related details were left out; Peter's `siblings` lists Andrew (John 1:40).
- Herod's children list only Archelaus (Matthew 2:22), the one the Gospels name as his son.
- Caiaphas: Annas as father-in-law is in the text (John 18:13) but is not entered in lineage because `lineage` has no in-law field.

## Not added (next C units)
Andrew, James and John the sons of Zebedee, Matthew (Levi), Philip, Nathanael, Simon Zelotes, Herod Antipas, Herodias, Salome, Joseph of Arimathaea, Barabbas, Annas, the centurions, Simeon and Anna, Jairus, Bartimaeus, Simon the Pharisee; then the Acts cast (Stephen, Barnabas, Philip, Cornelius, Silas, Timothy, Apollos, Priscilla and Aquila, Felix, Festus, Agrippa), then E.
