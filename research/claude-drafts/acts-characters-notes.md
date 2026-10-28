# Tier 1 characters, batch C8: the Acts cast (2026-10-19)

File: `acts-characters-records.json` (14 profiles, `src/data/characters.json` shape, era `Apostolic`).
People: Stephen, Barnabas, Philip the evangelist, Cornelius, Silas, Timothy, Apollos, Priscilla, Aquila, Gamaliel, Lydia, Felix, Festus, Agrippa (II).

## Method
- Chosen from `acts-stories.json`, excluding existing profiles (Paul, Peter, Caiaphas, Saul and others). Verses read from the KJV in `data/chapters.json` by script; every key verse resolves; summaries in my own words.
- `linked_stories` use the `storySlug` rule (`acts-{slug}`, `#stories/acts/{slug}`) and match titles and passages in `acts-stories.json`.

## For Codex
- `linked_stories` point to Acts story drafts not yet in `data/stories.json`; `validateCharacters` rejects them until merged. Merge stories first, or set `linked_stories` to `[]`.
- Adding profiles changes the total asserted in `scripts/check-characters.mjs`.
- IDs: `philip-the-evangelist` (not the apostle Philip), `agrippa-ii` (shown as "Agrippa"; the KJV says "king Agrippa" and never "Herod Agrippa II"), `silas` aliased Silvanus (2 Corinthians 1:19 uses the same companion pair; the identification is the usual one, not stated in Acts).

## Judgment calls
- Names follow the KJV (Timotheus appears as an alias; Prisca is an alias from Romans/Timothy usage in other texts and is not cited here).
- Timothy's `parents` lists only Eunice; his father is "a Greek" and unnamed (Acts 16:1).
- Philip's daughters are listed unnamed in `children`.
- Agrippa's relation to Bernice is not stated in Acts, so no sibling or spouse is entered.
- Stephen's `origin` says "not stated"; the text only shows that he was among the seven chosen at Jerusalem.

## Not added (next C units)
Gospel remainder: Andrew, James and John sons of Zebedee, Matthew (Levi), Philip the apostle, Nathanael, Herod Antipas, Herodias, Joseph of Arimathaea, Barabbas, Annas. Acts remainder: Ananias and Sapphira, Ananias of Damascus, Simon Magus, Dorcas, Eutychus, Demetrius, Claudius Lysias, Luke. Then E.
