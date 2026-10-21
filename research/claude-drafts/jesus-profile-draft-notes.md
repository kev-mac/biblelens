# Jesus profile, neutral draft (2026-10-20)

File: `jesus-profile-draft.json` (1 profile, `src/data/characters.json` shape, era `Gospels`). Draft for owner review. Nothing here is verified by Codex or approved for publication.

## Method
- Every claim in the summary names the Gospel and verse it comes from. The narrator makes no claim of its own.
- Every cited verse was read from the packaged KJV (`data/chapters.json`) by script; all 17 `key_verses` and the geography references resolve.
- Where the Gospels differ, the summary states both and does not harmonize.
- Gospel text only. Acts and the epistles are not used.

## Differences the draft states without resolving
| Point | Accounts |
|---|---|
| Descent from David | Matthew 1:6 (Solomon) and Luke 3:31 (Nathan) |
| Temple clearing | Matthew 21:12 (last week) and John 2:15 (near the start) |
| Answer to the high priest | Matthew 26:64 "Thou hast said"; Mark 14:62 "I am" |
| Hour of the crucifixion | Mark 15:25 third hour; John 19:14 about the sixth hour at the judgment |
| Last words | Mark 15:34; Luke 23:46; John 19:30 |
| Who was at the tomb | Matthew 28:2, 5 an angel; Mark 16:5 a young man; Luke 24:4 two men; John 20:12 two angels |

## Judgment calls for the owner
- **Length:** the summary is about 700 words; existing profiles are far shorter. It is long on purpose so each claim carries its attribution. Trim for the card, or keep the long form for a detail view.
- **Titles and claims about identity:** the draft lists titles with the speaker who uses them (Peter, an unclean spirit, John's stated purpose at 20:31). I left out sayings such as John 5:18 and 10:30 so the profile does not pick a side; add them if you want the debate framing.
- **Ascension:** only Luke 24:51 is used. Mark 16:19 sits in a passage some editions mark as a later ending, and Acts is not a Gospel.
- **John 1:32-34:** John reports the Baptist's testimony; it does not narrate the baptism, so the draft says so.
- **Siblings:** names follow Matthew 13:55 (James, Joses, Simon, Judas); Mark 6:3 spells the last "Juda". Sisters are unnamed in both. Not harmonized with any later tradition.
- **Parents:** `Joseph (husband of Mary)`; Luke 3:23 says "as was supposed" the son of Joseph. Not interpreted.
- **Spouses and children:** left out. The draft makes no claim either way.

## For Codex
- `check-characters.mjs` asserts a fixed profile total and reciprocal sibling links; adding Jesus changes the total, and any sibling that resolves to an existing profile must list Jesus back.
- `linked_stories` use titles from the 11 Gospel stories in `data/stories.json`; the `story_id` and `route` slugs follow the earlier draft convention and were not run through `storySlug`. Check titles with commas or apostrophes.
- The name resolver for `Joseph (husband of Mary)` was not tested; the existing `joseph` profile is the patriarch.
