# BibleLens search tests

**Useful-hit score: 40/50 (80.0%).** At least one original target appeared in 35/50 queries.
All targets appeared in 20/50 queries. The run found 86/160 original targets (53.8%).
25/50 queries had a useful result among the first five rows.

Source: `55e438a1071ac8629d5197cbf6c6db9d8346873e`, fetched from `origin/main`. Branch: `codex/search-tests`.
Run: `2026-10-26T23:48:19.957Z`. Runtime: Node `v25.8.1`. Edition: KJV. Notebook: empty.

This measures local search results, not the truth of claims or the quality of generated answers.
It does not verify the deployed Site, native app, browser layout, or response time.

## Method and scoring

The set has 50 queries and 160 original targets. Those targets were set before the first run.
Every target exists in the checked source. No research claims were added.

Self-review found useful verses beyond the original targets. Nine explicit alternatives now receive credit.
Five queries gained a useful hit; four gained an earlier useful rank. No original targets were removed.
For example, forgiveness returns Daniel 9:9, though it misses the chosen passages about forgiving other people.
The JSON preserves both scores and explains every accepted alternative.

- **Found:** an original target or a reviewed alternative appears.
- **Rank:** one-based order after expanding every group: Scripture, Research, Stories, People, then Places.
- **Group rank:** position within the matching group.
- **Visible rank:** position among the first five rows in each group, before opening Show more.
- **Missing:** an original target has no returned row. It may still be reachable through a linked chapter or study.
- **Complete:** every original target appears. Alternatives do not fill missing-target counts.

People and place tasks require the named directory entries. A verse mentioning a name does not satisfy that navigation task.
Broad-topic targets are useful examples, not a full list of every relevant result.
The score is specific to this small test set. It is not a survey of all learner needs.

The runner calls the shared worker through its actual `/api/search` handler in Node.
It also runs the actual `runSearch` function from `src/workspace.js`.
Small adapters capture rendered result groups and supply the local catalogs. They do not replace search matching or ordering.
The worker data and index are assembled in memory, using the same inputs as `scripts/build.mjs`.
The story catalog uses the existing topic helper. No build or release script runs.
The index has 31,105 verse documents. External requests during search: 0.

Relevant code:

- `worker/index.mjs`: `questionTerms`, `queryReferences`, `searchPassages`, `matchingResearch`, and `workspaceSearch`.
- `src/workspace.js`: `runSearch`, `parseReference`, and `resultGroup`.
- `src/stories.js`: `storyReference` and `storySlug`.
- `scripts/search-vocabulary.mjs`: word forms and related terms.
- `scripts/story-topics.mjs`: the story topics used by the shipped catalog.

## Scores by query type

| Query type | Useful hit | Original target hit | All targets | Target recall | First good in top 5 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Verse references | 12/12 | 12/12 | 7/12 | 52/63 | 11/12 |
| People | 8/8 | 8/8 | 8/8 | 9/9 | 0/8 |
| Places | 5/6 | 5/6 | 5/6 | 7/8 | 0/6 |
| Claims and questions | 7/10 | 7/10 | 0/10 | 14/35 | 7/10 |
| Topics | 5/6 | 2/6 | 0/6 | 3/26 | 5/6 |
| Typos and spelling variants | 3/8 | 1/8 | 0/8 | 1/19 | 2/8 |

## Five worst failure patterns

1. **Typos fail across collections.** Five of eight spelling queries miss every accepted target.
   Only one reaches an original target. `jezus` expands to `jebus`, so it returns the wrong name.
   `mozes` reaches verses about Moses, but not his profile. `golieth` reaches research, but not the person or story.
2. **Question phrasing blocks useful routes.** The place entry is missing for `where is nineveh`.
   The creation question misses both studies. The empty-tomb question returns only 2 Chronicles 2:14.
   Browser catalog filters require every typed word. Research also requires every retained term group to match.
   Partial hits still leave gaps: `who killed goliath` misses the David story and 1 Samuel 17:50.
3. **Topic wording misses key targets.** Five of six topics return something useful, but only 3/26 original targets appear.
   `anxiety` returns nothing. Its term list has no worry or care expansion.
   The combined index includes other translations, but returned verses must match the selected KJV wording.
   `forgiveness` expands to forgivenesses, but not forgive. Its chosen commandment is missing.
4. **Named entities come after other groups.** All 13 exact person or place queries find their directory targets.
   Their first targets rank 10–47 with groups expanded, or 7–18 among initially visible rows.
   Within their own groups, the first targets rank 1–3. Group jump buttons offer a shortcut.
   This is fixed group order, not evidence that every earlier row is irrelevant.
5. **Reference handling differs across search paths.** Five of twelve reference cases miss at least one original target.
   `jn 3:16` and `John3:16` find the verse but miss its story.
   The cross-chapter range misses its overlapping story. `John 3 16` reaches the verse only at rank 16.
   The 24-verse cap omits Genesis 1:25–31. The linked reader can still open the rest of that chapter.

`did jesus exist` returns nothing. Its expected profile is only a starting point, not historical proof.
The corpus review found no dedicated record that answers that historical question. This also limits content coverage.

## All 50 scores

Ranks use expanded group order. A dash means no accepted target appeared.

| ID | Query | Found | First good rank | Group rank | Visible rank | Original hits | Missing |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| [Q01](#q01) | John 3:16 | Yes | 1 | 1 | 1 | 2/2 | 0 |
| [Q02](#q02) | jn 3:16 | Yes | 1 | 1 | 1 | 1/2 | 1 |
| [Q03](#q03) | John3:16 | Yes | 1 | 1 | 1 | 1/2 | 1 |
| [Q04](#q04) | John 3 16 | Yes | 16 | 16 | — | 1/2 | 1 |
| [Q05](#q05) | john 3:16-18 | Yes | 1 | 1 | 1 | 4/4 | 0 |
| [Q06](#q06) | John 3:35–4:2 | Yes | 1 | 1 | 1 | 4/5 | 1 |
| [Q07](#q07) | Gen. 1:1 | Yes | 1 | 1 | 1 | 2/2 | 0 |
| [Q08](#q08) | genesis 1 | Yes | 1 | 1 | 1 | 25/32 | 7 |
| [Q09](#q09) | 1 Cor 13:4-7 | Yes | 1 | 1 | 1 | 4/4 | 0 |
| [Q10](#q10) | II Timothy 1:7 | Yes | 1 | 1 | 1 | 1/1 | 0 |
| [Q11](#q11) | psalm 23 | Yes | 1 | 1 | 1 | 6/6 | 0 |
| [Q12](#q12) | Revelation 21:4 | Yes | 1 | 1 | 1 | 1/1 | 0 |
| [Q13](#q13) | Jesus | Yes | 47 | 3 | 18 | 1/1 | 0 |
| [Q14](#q14) | Mary Magdalene | Yes | 17 | 1 | 10 | 1/1 | 0 |
| [Q15](#q15) | Paul | Yes | 44 | 1 | 16 | 1/1 | 0 |
| [Q16](#q16) | Simon Peter | Yes | 28 | 1 | 9 | 1/1 | 0 |
| [Q17](#q17) | Moses | Yes | 44 | 1 | 16 | 1/1 | 0 |
| [Q18](#q18) | Esther | Yes | 40 | 1 | 16 | 1/1 | 0 |
| [Q19](#q19) | Judas Iscariot | Yes | 15 | 1 | 9 | 1/1 | 0 |
| [Q20](#q20) | Deborah | Yes | 10 | 1 | 7 | 2/2 | 0 |
| [Q21](#q21) | Jerusalem | Yes | 45 | 1 | 16 | 1/1 | 0 |
| [Q22](#q22) | Bethlehem | Yes | 35 | 1 | 14 | 3/3 | 0 |
| [Q23](#q23) | Nazareth | Yes | 29 | 1 | 10 | 1/1 | 0 |
| [Q24](#q24) | Jericho | Yes | 40 | 1 | 16 | 1/1 | 0 |
| [Q25](#q25) | Sea of Galilee | Yes | 12 | 1 | 9 | 1/1 | 0 |
| [Q26](#q26) | where is nineveh | No | — | — | — | 0/1 | 1 |
| [Q27](#q27) | did jesus exist | No | — | — | — | 0/1 | 1 |
| [Q28](#q28) | who killed goliath | Yes | 1 | 1 | 1 | 3/5 | 2 |
| [Q29](#q29) | how did judas die | Yes | 1 | 1 | 1 | 1/3 | 2 |
| [Q30](#q30) | why are there two creation stories | No | — | — | — | 0/3 | 3 |
| [Q31](#q31) | the flood covered the whole earth | Yes | 1 | 1 | 1 | 2/3 | 1 |
| [Q32](#q32) | can i eat shrimp | Yes | 1 | 1 | 1 | 2/4 | 2 |
| [Q33](#q33) | does the bible allow slavery | Yes | 3 | 2 | 3 | 1/4 | 3 |
| [Q34](#q34) | why did god harden pharaohs heart | Yes | 1 | 1 | 1 | 2/3 | 1 |
| [Q35](#q35) | did women find the empty tomb | No | — | — | — | 0/5 | 5 |
| [Q36](#q36) | is love your neighbor in the bible | Yes | 1 | 1 | 1 | 3/4 | 1 |
| [Q37](#q37) | anxiety | No | — | — | — | 0/4 | 4 |
| [Q38](#q38) | forgiveness | Yes | 1 | 1 | 1 | 0/5 | 5 |
| [Q39](#q39) | money | Yes | 1 | 1 | 1 | 0/3 | 3 |
| [Q40](#q40) | love | Yes | 1 | 1 | 1 | 2/6 | 4 |
| [Q41](#q41) | justice | Yes | 1 | 1 | 1 | 0/4 | 4 |
| [Q42](#q42) | doubt | Yes | 1 | 1 | 1 | 1/4 | 3 |
| [Q43](#q43) | jezus | No | — | — | — | 0/1 | 1 |
| [Q44](#q44) | jeruselam | No | — | — | — | 0/1 | 1 |
| [Q45](#q45) | golieth | Yes | 7 | 1 | 6 | 1/3 | 2 |
| [Q46](#q46) | noahs ark | Yes | 1 | 1 | 1 | 0/3 | 3 |
| [Q47](#q47) | mozes | No | — | — | — | 0/1 | 1 |
| [Q48](#q48) | forgivness | Yes | 1 | 1 | 1 | 0/5 | 5 |
| [Q49](#q49) | genisis 1:1 | No | — | — | — | 0/2 | 2 |
| [Q50](#q50) | bethleham | No | — | — | — | 0/3 | 3 |

## Expected results and missing targets

Record and person IDs come from stored data. Story IDs below are the app routes, since stories lack stored IDs.
All source paths and every returned row are retained in `search-tests.json`.

<a id="q01"></a>

### Q01: John 3:16

**Why:** The full reference should open the verse and its stored story.

**Expected:** `John 3:16`; Cleansing the Temple and Nicodemus (story `#stories/john/cleansing-the-temple-and-nicodemus`).

**Missing:** None.

**First good:** `John 3:16`; rank 1, group rank 1.

<a id="q02"></a>

### Q02: jn 3:16

**Why:** The short book name should reach the same verse and story.

**Expected:** `John 3:16`; Cleansing the Temple and Nicodemus (story `#stories/john/cleansing-the-temple-and-nicodemus`).

**Missing:** Cleansing the Temple and Nicodemus (story `#stories/john/cleansing-the-temple-and-nicodemus`).

**First good:** `John 3:16`; rank 1, group rank 1.

<a id="q03"></a>

### Q03: John3:16

**Why:** A missing space should not change the intended verse.

**Expected:** `John 3:16`; Cleansing the Temple and Nicodemus (story `#stories/john/cleansing-the-temple-and-nicodemus`).

**Missing:** Cleansing the Temple and Nicodemus (story `#stories/john/cleansing-the-temple-and-nicodemus`).

**First good:** `John 3:16`; rank 1, group rank 1.

<a id="q04"></a>

### Q04: John 3 16

**Why:** A learner may use spaces where a verse reference needs a colon.

**Expected:** `John 3:16`; Cleansing the Temple and Nicodemus (story `#stories/john/cleansing-the-temple-and-nicodemus`).

**Missing:** Cleansing the Temple and Nicodemus (story `#stories/john/cleansing-the-temple-and-nicodemus`).

**First good:** `John 3:16`; rank 16, group rank 16.

<a id="q05"></a>

### Q05: john 3:16-18

**Why:** The lowercase reference should return each verse in the range.

**Expected:** `John 3:16`; `John 3:17`; `John 3:18`; Cleansing the Temple and Nicodemus (story `#stories/john/cleansing-the-temple-and-nicodemus`).

**Missing:** None.

**First good:** `John 3:16`; rank 1, group rank 1.

<a id="q06"></a>

### Q06: John 3:35–4:2

**Why:** The range crosses chapters. Its story match should include the start of John 4.

**Expected:** `John 3:35`; `John 3:36`; `John 4:1`; `John 4:2`; The Woman at the Well (story `#stories/john/the-woman-at-the-well`).

**Missing:** The Woman at the Well (story `#stories/john/the-woman-at-the-well`).

**First good:** `John 3:35`; rank 1, group rank 1.

<a id="q07"></a>

### Q07: Gen. 1:1

**Why:** The short name and period should resolve to Genesis.

**Expected:** `Genesis 1:1`; The Creation (story `#stories/genesis/the-creation`).

**Missing:** None.

**First good:** `Genesis 1:1`; rank 1, group rank 1.

<a id="q08"></a>

### Q08: genesis 1

**Why:** A chapter query should let the learner reach every verse in that chapter.

**Expected:** `Genesis 1:1`; `Genesis 1:2`; `Genesis 1:3`; `Genesis 1:4`; `Genesis 1:5`; `Genesis 1:6`; `Genesis 1:7`; `Genesis 1:8`; `Genesis 1:9`; `Genesis 1:10`; `Genesis 1:11`; `Genesis 1:12`; `Genesis 1:13`; `Genesis 1:14`; `Genesis 1:15`; `Genesis 1:16`; `Genesis 1:17`; `Genesis 1:18`; `Genesis 1:19`; `Genesis 1:20`; `Genesis 1:21`; `Genesis 1:22`; `Genesis 1:23`; `Genesis 1:24`; `Genesis 1:25`; `Genesis 1:26`; `Genesis 1:27`; `Genesis 1:28`; `Genesis 1:29`; `Genesis 1:30`; `Genesis 1:31`; The Creation (story `#stories/genesis/the-creation`).

**Missing:** `Genesis 1:25`; `Genesis 1:26`; `Genesis 1:27`; `Genesis 1:28`; `Genesis 1:29`; `Genesis 1:30`; `Genesis 1:31`.

**First good:** `Genesis 1:1`; rank 1, group rank 1.

**Limits:** The current search caps verses at 24. Later verses still count as missing search rows.

<a id="q09"></a>

### Q09: 1 Cor 13:4-7

**Why:** The numbered short name should return the full verse range.

**Expected:** `1 Corinthians 13:4`; `1 Corinthians 13:5`; `1 Corinthians 13:6`; `1 Corinthians 13:7`.

**Missing:** None.

**First good:** `1 Corinthians 13:4`; rank 1, group rank 1.

<a id="q10"></a>

### Q10: II Timothy 1:7

**Why:** A Roman numeral should resolve to the second letter to Timothy.

**Expected:** `2 Timothy 1:7`.

**Missing:** None.

**First good:** `2 Timothy 1:7`; rank 1, group rank 1.

<a id="q11"></a>

### Q11: psalm 23

**Why:** The common singular book name should return all six verses.

**Expected:** `Psalms 23:1`; `Psalms 23:2`; `Psalms 23:3`; `Psalms 23:4`; `Psalms 23:5`; `Psalms 23:6`.

**Missing:** None.

**First good:** `Psalms 23:1`; rank 1, group rank 1.

<a id="q12"></a>

### Q12: Revelation 21:4

**Why:** The full reference should return this verse directly.

**Expected:** `Revelation 21:4`.

**Missing:** None.

**First good:** `Revelation 21:4`; rank 1, group rank 1.

<a id="q13"></a>

### Q13: Jesus

**Why:** The Jesus Christ profile is the intended person, among several name matches.

**Expected:** Jesus Christ (person `recgkFqZovgbr3pAi`).

**Missing:** None.

**First good:** Jesus Christ (person `recgkFqZovgbr3pAi`); rank 47, group rank 3.

<a id="q14"></a>

### Q14: Mary Magdalene

**Why:** The full name should identify this Mary without mixing up the profiles.

**Expected:** Mary Magdalene (person `recNuh2eX30cHuOgi`).

**Missing:** None.

**First good:** Mary Magdalene (person `recNuh2eX30cHuOgi`); rank 17, group rank 1.

<a id="q15"></a>

### Q15: Paul

**Why:** The directory has a Paul profile with Saul among its stored names.

**Expected:** Paul (person `recgkzNX07a7kGFYL`).

**Missing:** None.

**First good:** Paul (person `recgkzNX07a7kGFYL`); rank 44, group rank 1.

<a id="q16"></a>

### Q16: Simon Peter

**Why:** The stored profile label matches the full name.

**Expected:** Simon Peter (person `recX9MMADoVI2CSP1`).

**Missing:** None.

**First good:** Simon Peter (person `recX9MMADoVI2CSP1`); rank 28, group rank 1.

<a id="q17"></a>

### Q17: Moses

**Why:** The named person should be easy to find across the library.

**Expected:** Moses (person `recjNRR60PAuFtjha`).

**Missing:** None.

**First good:** Moses (person `recjNRR60PAuFtjha`); rank 44, group rank 1.

<a id="q18"></a>

### Q18: Esther

**Why:** The person should appear even when her name also matches a Bible book.

**Expected:** Esther (person `recRuSINUX52qGLlh`).

**Missing:** None.

**First good:** Esther (person `recRuSINUX52qGLlh`); rank 40, group rank 1.

<a id="q19"></a>

### Q19: Judas Iscariot

**Why:** The second name should distinguish this Judas from other people named Judas.

**Expected:** Judas Iscariot (person `rec95raiD3sLuptbO`).

**Missing:** None.

**First good:** Judas Iscariot (person `rec95raiD3sLuptbO`); rank 15, group rank 1.

<a id="q20"></a>

### Q20: Deborah

**Why:** Two stored profiles share this name. Both should remain available.

**Expected:** Deborah (person `recdcXSSgX1f0LAwb`); Deborah (person `rec6OMKxWHWy6KHjE`).

**Missing:** None.

**First good:** Deborah (person `recdcXSSgX1f0LAwb`); rank 10, group rank 1.

**Limits:** This query does not say which Deborah the learner means.

<a id="q21"></a>

### Q21: Jerusalem

**Why:** The city should appear as a place, with its stored location limits.

**Expected:** Jerusalem (place `recL1WV82pXaRBQ59`).

**Missing:** None.

**First good:** Jerusalem (place `recL1WV82pXaRBQ59`); rank 45, group rank 1.

<a id="q22"></a>

### Q22: Bethlehem

**Why:** The directory has several Bethlehem entries. The query should preserve those choices.

**Expected:** Bethlehem (place `rec81f3wE4gATsRRE`); Bethlehem (place `recsyolL81TBx45nu`); Bethlehem Ephrathah (place `recX46u00iXp2HIOW`).

**Missing:** None.

**First good:** Bethlehem (place `rec81f3wE4gATsRRE`); rank 35, group rank 1.

<a id="q23"></a>

### Q23: Nazareth

**Why:** The exact place name should reach its directory entry.

**Expected:** Nazareth (place `recmRfnw4XzPBH9jc`).

**Missing:** None.

**First good:** Nazareth (place `recmRfnw4XzPBH9jc`); rank 29, group rank 1.

<a id="q24"></a>

### Q24: Jericho

**Why:** The city entry should remain easy to reach beside verses and research.

**Expected:** Jericho (place `recdMHFSmu222VnJG`).

**Missing:** None.

**First good:** Jericho (place `recdMHFSmu222VnJG`); rank 40, group rank 1.

<a id="q25"></a>

### Q25: Sea of Galilee

**Why:** The full water name should reach the matching place entry.

**Expected:** Sea of Galilee (place `recRe6uBpPMDP6u82`).

**Missing:** None.

**First good:** Sea of Galilee (place `recRe6uBpPMDP6u82`); rank 12, group rank 1.

<a id="q26"></a>

### Q26: where is nineveh

**Why:** The question asks for a location. The stored place entry is the direct target.

**Expected:** Nineveh (place `rec5WK4QGcKa48pA6`).

**Missing:** Nineveh (place `rec5WK4QGcKa48pA6`).

**First good:** None.

**Limits:** Finding a verse that names Nineveh does not count as finding its place entry.

<a id="q27"></a>

### Q27: did jesus exist

**Why:** The stored Jesus profile offers a starting point for this question.

**Expected:** Jesus Christ (person `recgkFqZovgbr3pAi`).

**Missing:** Jesus Christ (person `recgkFqZovgbr3pAi`).

**First good:** None.

**Limits:** This is a navigation target only. The review found no dedicated record about Jesus as a historical person. A profile is not independent historical proof.

<a id="q28"></a>

### Q28: who killed goliath

**Why:** The stored comparison and story directly address this question. The listed verses support that comparison.

**Expected:** Who killed Goliath the Gittite: David, or Elhanan? (record `elhanan-slew-goliath-brother-supplied`); `1 Samuel 17:50`; `2 Samuel 21:19`; `1 Chronicles 20:5`; David and Goliath (story `#stories/1-samuel/david-and-goliath`).

**Missing:** `1 Samuel 17:50`; David and Goliath (story `#stories/1-samuel/david-and-goliath`).

**First good:** `1 Chronicles 20:5`; rank 1, group rank 1.

**Limits:** The record compares wording. It does not settle which reading came first or whether the names refer to different people.

<a id="q29"></a>

### Q29: how did judas die

**Why:** The study compares the two stored accounts of Judas and the field.

**Expected:** Judas and the field of blood (study `judas`); `Matthew 27:5`; `Acts 1:18`.

**Missing:** `Matthew 27:5`; `Acts 1:18`.

**First good:** Judas and the field of blood (study `judas`); rank 1, group rank 1.

**Limits:** The study compares narrative statements. It does not provide medical evidence or settle how the accounts fit together.

<a id="q30"></a>

### Q30: why are there two creation stories

**Why:** The two studies compare details in Genesis 1 and 2. The story gives a route into the passage.

**Expected:** Plants before people—or after? (study `plants`); Water or ground: the animals’ origin (study `animals`); The Creation (story `#stories/genesis/the-creation`).

**Missing:** Plants before people—or after? (study `plants`); Water or ground: the animals’ origin (study `animals`); The Creation (story `#stories/genesis/the-creation`).

**First good:** None.

**Limits:** These are routes to the stored comparisons. They do not explain why the texts were composed.

<a id="q31"></a>

### Q31: the flood covered the whole earth

**Why:** The stored record tests the global flood claim. The verse and story supply the text being discussed.

**Expected:** A recent flood covering every mountain? (record `genesis-7-worldwide-flood`); `Genesis 7:19`; Noah and the Flood (story `#stories/genesis/noah-and-the-flood`).

**Missing:** Noah and the Flood (story `#stories/genesis/noah-and-the-flood`).

**First good:** `Genesis 7:19`; rank 1, group rank 1.

**Limits:** The record concerns a recent global physical flood. Regional or literary readings change the claim under review.

<a id="q32"></a>

### Q32: can i eat shrimp

**Why:** These passages state the stored rules about water animals with fins and scales.

**Expected:** `Leviticus 11:9`; `Leviticus 11:10`; `Deuteronomy 14:9`; `Deuteronomy 14:10`.

**Missing:** `Leviticus 11:10`; `Deuteronomy 14:9`.

**First good:** `Deuteronomy 14:10`; rank 1, group rank 1.

**Limits:** These are textual rules, not a ruling about what the learner should eat today.

<a id="q33"></a>

### Q33: does the bible allow slavery

**Why:** The stored records discuss legal categories and instructions within slaveholding households.

**Expected:** Different legal treatment of servants and slaves (record `early-servitude`); Instructions within a slaveholding household (record `coverage-nt-household-slavery`); `Leviticus 25:44`; `Ephesians 6:5`.

**Missing:** Instructions within a slaveholding household (record `coverage-nt-household-slavery`); `Leviticus 25:44`; `Ephesians 6:5`.

**First good:** Different legal treatment of servants and slaves (record `early-servitude`); rank 3, group rank 2.

**Limits:** The records describe texts. They neither endorse slavery nor show how consistently these rules were practiced.

<a id="q34"></a>

### Q34: why did god harden pharaohs heart

**Why:** The record compares passages assigning the hardening to God and to Pharaoh.

**Expected:** Who hardens Pharaoh’s heart? (record `exodus-hardening-agency`); `Exodus 7:3`; `Exodus 8:15`.

**Missing:** `Exodus 8:15`.

**First good:** `1 Samuel 6:6`; rank 1, group rank 1.

**Accepted in self-review:** `1 Samuel 6:6`. The verse recalls Pharaoh hardening his heart. It gives useful context for the question.

**Limits:** The record does not supply a complete explanation of free will or divine motives.

<a id="q35"></a>

### Q35: did women find the empty tomb

**Why:** The stored stories and verses describe women visiting the tomb.

**Expected:** The Empty Tomb (story `#stories/mark/the-empty-tomb`); The Resurrection Appearances (story `#stories/john/the-resurrection-appearances`); `Mark 16:1`; `Mark 16:4`; `John 20:1`.

**Missing:** The Empty Tomb (story `#stories/mark/the-empty-tomb`); The Resurrection Appearances (story `#stories/john/the-resurrection-appearances`); `Mark 16:1`; `Mark 16:4`; `John 20:1`.

**First good:** None.

**Limits:** These are narrative accounts. Finding them does not independently prove the event.

<a id="q36"></a>

### Q36: is love your neighbor in the bible

**Why:** The record and verses contain the requested teaching.

**Expected:** The great commandment (record `commandment-the-great-commandment`); `Leviticus 19:18`; `Matthew 22:39`; `Mark 12:31`.

**Missing:** `Mark 12:31`.

**First good:** `Mark 12:33`; rank 1, group rank 1.

**Accepted in self-review:** `Mark 12:33`. The verse repeats love of a neighbor within the same exchange about commandments.

**Limits:** The record lists what the text commands. It does not rule on its use today.

<a id="q37"></a>

### Q37: anxiety

**Why:** These stored verses discuss worry or care in their selected translations.

**Expected:** `Philippians 4:6`; `Matthew 6:25`; `Matthew 6:34`; `1 Peter 5:7`.

**Missing:** `Philippians 4:6`; `Matthew 6:25`; `Matthew 6:34`; `1 Peter 5:7`.

**First good:** None.

**Limits:** These are reading suggestions, not mental health advice.

<a id="q38"></a>

### Q38: forgiveness

**Why:** The record and verses discuss forgiving other people.

**Expected:** Forgive others (record `commandment-forgive-others`); `Matthew 6:14`; `Matthew 6:15`; `Luke 17:3`; `Luke 17:4`.

**Missing:** Forgive others (record `commandment-forgive-others`); `Matthew 6:14`; `Matthew 6:15`; `Luke 17:3`; `Luke 17:4`.

**First good:** `Daniel 9:9`; rank 1, group rank 1.

**Accepted in self-review:** `Daniel 9:9`. The verse directly names forgiveness. The broad topic does not require one particular passage.

<a id="q39"></a>

### Q39: money

**Why:** These verses discuss money, wealth, or attachment to possessions.

**Expected:** `Matthew 6:24`; `1 Timothy 6:10`; `Hebrews 13:5`.

**Missing:** `Matthew 6:24`; `1 Timothy 6:10`; `Hebrews 13:5`.

**First good:** `Psalms 15:5`; rank 1, group rank 1.

**Accepted in self-review:** `Psalms 15:5`. The verse discusses lending money and taking bribes. It fits the broad money topic.

**Limits:** This is a small target set for a broad topic, not every useful passage.

<a id="q40"></a>

### Q40: love

**Why:** These passages and the record discuss love of others.

**Expected:** `1 Corinthians 13:4`; `1 Corinthians 13:5`; `1 Corinthians 13:6`; `1 Corinthians 13:7`; `John 13:34`; The great commandment (record `commandment-the-great-commandment`).

**Missing:** `1 Corinthians 13:4`; `1 Corinthians 13:5`; `1 Corinthians 13:6`; `1 Corinthians 13:7`.

**First good:** `Jeremiah 31:3`; rank 1, group rank 1.

**Accepted in self-review:** `Jeremiah 31:3`. The verse speaks of lasting love. The broad query does not specify human or divine love.

**Limits:** The KJV uses charity in the Corinthians passage. This tests common wording across the stored translations.

<a id="q41"></a>

### Q41: justice

**Why:** These verses discuss fair judgment and care for people facing harm.

**Expected:** `Deuteronomy 16:19`; `Deuteronomy 16:20`; `Isaiah 1:17`; `Amos 5:24`.

**Missing:** `Deuteronomy 16:19`; `Deuteronomy 16:20`; `Isaiah 1:17`; `Amos 5:24`.

**First good:** `1 Chronicles 18:14`; rank 1, group rank 1.

**Accepted in self-review:** `1 Chronicles 18:14`. The verse directly describes justice in the account of David ruling Israel.

**Limits:** This target list does not settle how ancient rules apply today.

<a id="q42"></a>

### Q42: doubt

**Why:** The verses and the Thomas story give several routes into belief and doubt.

**Expected:** `Mark 9:24`; `James 1:6`; `Matthew 14:31`; The Resurrection Appearances (story `#stories/john/the-resurrection-appearances`).

**Missing:** `Mark 9:24`; `James 1:6`; The Resurrection Appearances (story `#stories/john/the-resurrection-appearances`).

**First good:** `Matthew 28:17`; rank 1, group rank 1.

**Accepted in self-review:** `Matthew 28:17`. The verse describes some people doubting. It fits the broad doubt topic.

<a id="q43"></a>

### Q43: jezus

**Why:** This one-letter spelling error should still find the Jesus Christ profile.

**Expected:** Jesus Christ (person `recgkFqZovgbr3pAi`).

**Missing:** Jesus Christ (person `recgkFqZovgbr3pAi`).

**First good:** None.

<a id="q44"></a>

### Q44: jeruselam

**Why:** This common spelling error should still find the Jerusalem place entry.

**Expected:** Jerusalem (place `recL1WV82pXaRBQ59`).

**Missing:** Jerusalem (place `recL1WV82pXaRBQ59`).

**First good:** None.

<a id="q45"></a>

### Q45: golieth

**Why:** The name differs by one letter. Its person, story, and comparison remain useful targets.

**Expected:** Goliath (person `recYyKPBJ6GIJIBlp`); David and Goliath (story `#stories/1-samuel/david-and-goliath`); Who killed Goliath the Gittite: David, or Elhanan? (record `elhanan-slew-goliath-brother-supplied`).

**Missing:** Goliath (person `recYyKPBJ6GIJIBlp`); David and Goliath (story `#stories/1-samuel/david-and-goliath`).

**First good:** Who killed Goliath the Gittite: David, or Elhanan? (record `elhanan-slew-goliath-brother-supplied`); rank 7, group rank 1.

<a id="q46"></a>

### Q46: noahs ark

**Why:** A learner may omit the apostrophe. The flood story, Noah profile, and ark instructions fit the intent.

**Expected:** Noah and the Flood (story `#stories/genesis/noah-and-the-flood`); Noah (person `recVMHzYdllgvTo09`); `Genesis 6:14`.

**Missing:** Noah and the Flood (story `#stories/genesis/noah-and-the-flood`); Noah (person `recVMHzYdllgvTo09`); `Genesis 6:14`.

**First good:** `Luke 17:27`; rank 1, group rank 1.

**Accepted in self-review:** `Luke 17:27`. The verse directly mentions Noah entering the ark. It is useful despite the missing story and profile.

<a id="q47"></a>

### Q47: mozes

**Why:** The s-to-z spelling error should still find the Moses profile.

**Expected:** Moses (person `recjNRR60PAuFtjha`).

**Missing:** Moses (person `recjNRR60PAuFtjha`).

**First good:** None.

<a id="q48"></a>

### Q48: forgivness

**Why:** The missing e should preserve the same targets as forgiveness.

**Expected:** Forgive others (record `commandment-forgive-others`); `Matthew 6:14`; `Matthew 6:15`; `Luke 17:3`; `Luke 17:4`.

**Missing:** Forgive others (record `commandment-forgive-others`); `Matthew 6:14`; `Matthew 6:15`; `Luke 17:3`; `Luke 17:4`.

**First good:** `Psalms 130:4`; rank 1, group rank 1.

**Accepted in self-review:** `Psalms 130:4`. The verse directly names forgiveness. It shows that the typo still reaches a useful verse.

<a id="q49"></a>

### Q49: genisis 1:1

**Why:** The misspelled book name should still resolve to Genesis 1:1 and its story.

**Expected:** `Genesis 1:1`; The Creation (story `#stories/genesis/the-creation`).

**Missing:** `Genesis 1:1`; The Creation (story `#stories/genesis/the-creation`).

**First good:** None.

<a id="q50"></a>

### Q50: bethleham

**Why:** The one-letter error should preserve the place choices for Bethlehem.

**Expected:** Bethlehem (place `rec81f3wE4gATsRRE`); Bethlehem (place `recsyolL81TBx45nu`); Bethlehem Ephrathah (place `recX46u00iXp2HIOW`).

**Missing:** Bethlehem (place `rec81f3wE4gATsRRE`); Bethlehem (place `recsyolL81TBx45nu`); Bethlehem Ephrathah (place `recX46u00iXp2HIOW`).

**First good:** None.

## Self-review and checks

- All 50 queries are unique. Every expected ID, story route, and selected verse resolves in this source.
- Accepted alternatives were checked against the stored verse text. They add no historical or theological findings.
- Found, missing, complete, and rank fields were recalculated from captured rows.
- A replay from the embedded runner reproduced every result row and score.
- Only the two documentation files are committed. App source, data, and build number stay unchanged.
- `npm run check:readability` exited 0 in report-only mode. It still flags existing app content.

Existing average grades: Evidence 7.89; Stories 7.76; People 8.64; Explore cards 15.52.
The checker reports 3,619 long Evidence lines and 3,356 Evidence lines with unexplained terms.
These findings predate this report. The task does not change app copy.
The new query explanations average grade 6.19. They have no checked sentence-length or jargon flags.

## Repeat the run

Use this checkout and Node 22 or later. Install the locked dependencies only if needed:

```sh
npm ci --ignore-scripts --offline --no-audit --no-fund
```

The command uses the local npm cache. If packages are absent, provide them before running this local-only test.
Extract the runner below into its required path:

```sh
mkdir -p outputs/search-tests
node --input-type=module <<'NODE'
import fs from 'node:fs';
const doc = fs.readFileSync('docs/search-tests.md', 'utf8');
const start = '<!-- SEARCH_TEST_RUNNER_START -->';
const end = '<!-- SEARCH_TEST_RUNNER_END -->';
const block = doc.slice(doc.lastIndexOf(start) + start.length, doc.lastIndexOf(end)).trim();
const code = block.replace(/^```js\n/, '').replace(/\n```$/, '');
fs.writeFileSync('outputs/search-tests/runner.mjs', code + '\n');
NODE
node outputs/search-tests/runner.mjs outputs/search-tests/rerun.json
```

The runner validates target existence and records all returned rows. A missing search target does not stop the run.
Compare `actual` fields with the saved JSON to detect changed results. Keep corpus changes separate from search regressions.
A useful future gate should flag lost hits, lost original targets, or worse first-good ranks.
Expected targets remain desired behavior, even where the saved baseline misses them.
The runner fails if its source boundaries or visible-row assumptions no longer match.

<details>
<summary>Runnable Node test adapter</summary>

<!-- SEARCH_TEST_RUNNER_START -->
```js
import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import MiniSearch from 'minisearch';
import {buildVocabulary} from '../../scripts/search-vocabulary.mjs';
import {tagStoryCatalog,loadTopicOptions} from '../../scripts/story-topics.mjs';

// Run from the repository root. No app build, release script, or remote request.
const read = file => fs.readFileSync(file, 'utf8');
const json = file => JSON.parse(read(file));
const suite = json('docs/search-tests.json');
const books = json('data/books.json'), chapters = json('data/chapters.json');
const evidence = json('data/evidence.json'), people = json('data/reference/people.json');
const places = json('data/reference/places.json'), topics = json('data/reference/topics.json');
const stories = tagStoryCatalog(json('data/stories.json'), topics, loadTopicOptions());
const studiesContext = {};
vm.runInNewContext(read('src/data.js') + '\nthis.studies=ENTRIES;', studiesContext);
const studies = studiesContext.studies;

// Match scripts/build.mjs index construction, using all three stored editions.
const frequencies = {}, documents = [], shards = {};
for (const encoded of Object.values(chapters)) {
  const data = JSON.parse(zlib.gunzipSync(Buffer.from(encoded, 'base64')));
  for (const verse of data.verses) {
    const text = (verse.kjv+' '+verse.web+' '+(verse.asv||'')).replace(/\{[HG]\d+\}/g,'');
    documents.push({id:data.book*1000000+data.chapter*1000+verse.n,text});
    for (const word of new Set(text.toLowerCase().match(/[a-z]{3,}/g)||[])) frequencies[word]=(frequencies[word]||0)+1;
  }
}
for (const book of [...new Set(documents.map(d=>Math.floor(d.id/1000000)))]) {
  const index = new MiniSearch({fields:['text'],tokenize:text=>text.toLowerCase().match(/[a-z]{3,}/g)||[]});
  index.addAll(documents.filter(d=>Math.floor(d.id/1000000)===book));
  shards[book]=JSON.stringify(index);
}
const vocabulary = buildVocabulary(frequencies);
let workerSource = read('worker/index.mjs');
const inject = (source, name, value) => {
  const marker = new RegExp('/\\*__'+name+'__\\*/(?:\\[\\]|\\{\\})');
  assert(marker.test(source), 'Missing data marker: '+name);
  return source.replace(marker, ()=>JSON.stringify(value));
};
for (const [name,value] of Object.entries({BOOKS:books,CHAPTERS:chapters,STUDIES:studies,EVIDENCE:evidence,ASSETS:{},SEARCH:frequencies,MINISEARCH_INDEX:shards,VOCABULARY:vocabulary})) workerSource=inject(workerSource,name,value);
let answer = inject(inject(read('worker/answer-layer.mjs'),'PEOPLE',people),'TOPICS',topics);
const ids=json('src/data/character-reference-ids.json');
const summaries=Object.fromEntries(json('src/data/characters.json').filter(p=>ids[p.id]).map(p=>[ids[p.id],p.summary]));
const categories='const CATEGORY_STORIES='+JSON.stringify(stories)+';\nconst CATEGORY_PROPHECIES='+read('src/data/prophecies.json')+';\nconst CATEGORY_PERSON_SUMMARIES='+JSON.stringify(summaries)+';\n'+read('worker/categories.mjs').replaceAll('export function','function');
for (const [name,value] of Object.entries({MINISEARCH_LIBRARY:'',ANSWER_LAYER:answer,NETS_LINKS:read('worker/nets-links.mjs'),CATEGORIES:categories,SYNC:read('worker/sync.mjs').replace('export async function','async function')})) workerSource=workerSource.replace('/*__'+name+'__*/',()=>value);
assert(!workerSource.includes('/*__'), 'Unresolved worker marker');
workerSource=workerSource.replace('export default {','globalThis.worker = {');
let externalRequests=0;
const context=vm.createContext({MiniSearch,Response,Request,URL,URLSearchParams,Blob,DecompressionStream,Uint8Array,atob,AbortSignal,console,fetch:async()=>{externalRequests++;throw Error('External fetch blocked');}});
vm.runInContext(workerSource,context,{filename:'worker/index.mjs'});
const worker=context.worker;
async function api(query) {
  const response=await worker.fetch(new Request('https://search.test/api/search?'+new URLSearchParams({q:query,edition:suite.edition})),{},{});
  assert.equal(response.status,200,'Search failed: '+query);
  return response.json();
}

// Execute the source UI function itself. Only rendering and fetch are adapted.
const workspace=read('src/workspace.js'), storySource=read('src/stories.js'), reader=read('src/reader.js');
assert(workspace.includes('items.slice(0,5).map(render)'), 'Review visible-row rule after renderer changes');
assert(workspace.includes("resultGroup('Scripture',")&&workspace.includes("+resultGroup('Research',")&&workspace.includes("+resultGroup('Stories',")&&workspace.includes("+resultGroup('People',")&&workspace.includes("+resultGroup('Places',"), 'Review group-order rule after renderer changes');
function between(source,start,end) {
  const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
  assert(a>=0&&b>a,'Source boundary changed: '+start);
  return source.slice(a,b);
}
const searchFunction=between(workspace,' async function runSearch(query){'," el('lens-search-form').onsubmit=");
const parseFunction=between(workspace,' function parseReference(value){',' function openCompare()');
const storyFunctions=between(storySource,'function storyReference(reference){','function storyRoute()');
const readRef=between(reader,'function readRef(ref){','\n');
const dom=new Map();
function el(id) {
  if(!dom.has(id)) dom.set(id,{value:'',innerHTML:'',textContent:'',classList:{add(){},remove(){}},removeAttribute(){},setAttribute(){},querySelectorAll(){return [];},insertAdjacentHTML(){}});
  return dom.get(id);
}
let captured, apiResult;
const htmlEscape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ui=vm.createContext({books,AbortSignal,el,edition:()=>suite.edition,esc:htmlEscape,excerpt:s=>String(s||''),noteRows:()=>[],getResources:async()=>[stories,people,places].map(value=>({status:'fulfilled',value})),resultGroup:(name,items)=>{captured.push({name,items});return '';},fetch:async path=>{assert(path.startsWith('/api/search?'));apiResult=await api(new URL(path,'https://search.test').searchParams.get('q'));return new Response(JSON.stringify(apiResult));}});
vm.runInContext('let searchVersion=0;\n'+readRef+'\n'+storyFunctions+'\n'+parseFunction+'\n'+searchFunction+'\nglobalThis.search=runSearch;',ui);

const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const storyByUrl=new Map(stories.flatMap(g=>g.stories.map(s=>['#stories/'+slug(g.book)+'/'+slug(s.title),{...s,book:g.book}])));
function rowsFromCapture() {
  const rows=[];
  let visibleRank=0;
  for(const {name,items} of captured) for(const [index,item] of items.entries()) {
    let kind,id,label=item.title,url=item.url;
    if(name==='Scripture'){kind='verse';id=apiResult.passages[index].label;}
    else if(name==='Research'){const r=apiResult.research[index];kind=r.kind==='study'?'study':'record';id=r.id;}
    else if(name==='Stories'){kind='story';id=item.url;assert(storyByUrl.has(id));}
    else if(name==='People'){kind='person';id=item.url.slice('#characters/'.length);}
    else if(name==='Places'){kind='place';id=/data-place-id="([^"]+)"/.exec(item.html)?.[1];label=places.find(p=>p.id===id)?.fields.displayTitle;url=null;}
    else throw Error('Unexpected group: '+name);
    assert(id&&label);
    rows.push({kind,id,label,url,group:name,groupRank:index+1,rank:rows.length+1,initiallyVisible:index<5,initialVisibleRank:index<5?++visibleRank:null});
  }
  return rows;
}
function validateTarget(target) {
  if(target.kind==='verse'){
    const m=/^(.+) (\d+):(\d+)$/.exec(target.id),book=books.find(b=>b.name===m?.[1]);
    assert(book,'Unknown book: '+target.id);
    const chapter=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[book.id+':'+m[2]],'base64')));
    assert(chapter.verses.some(v=>v.n===+m[3]&&v[suite.edition]),'Missing verse: '+target.id);
  } else {
    const exists=target.kind==='story'?storyByUrl.has(target.id):({person:people,place:places,record:evidence,study:studies}[target.kind]||[]).some(r=>r.id===target.id);
    assert(exists,'Missing target: '+JSON.stringify(target));
  }
}
assert.equal(suite.cases.length,50);
assert.equal(new Set(suite.cases.map(c=>c.query)).size,50);
const cases=[];
for(const c of suite.cases) {
  assert(c.expected.length&&c.why);
  c.expected.forEach(validateTarget);
  (c.acceptableAlternatives||[]).forEach(validateTarget);
  captured=[];apiResult=null;
  await ui.search(c.query);
  assert(apiResult,'UI did not call search');
  assert(/^\d+ results? shown/.test(el('lens-search-status').textContent),'Unexpected UI status: '+el('lens-search-status').textContent);
  assert(!el('lens-search-status').textContent.includes('unavailable'),'Unavailable collection');
  const results=rowsFromCapture();
  const locate=target=>{const row=results.find(r=>r.kind===target.kind&&r.id===target.id);return {...target,rank:row?.rank??null,groupRank:row?.groupRank??null,initiallyVisible:row?.initiallyVisible??false,initialVisibleRank:row?.initialVisibleRank??null};};
  const targets=c.expected.map(locate),alternatives=(c.acceptableAlternatives||[]).map(locate);
  const hits=targets.filter(t=>t.rank!==null).sort((a,b)=>a.rank-b.rank);
  const good=[...hits,...alternatives.filter(t=>t.rank!==null)].sort((a,b)=>a.rank-b.rank);
  const first=good[0];
  cases.push({...c,actual:{found:good.length>0,expectedHit:hits.length>0,firstGoodRank:first?.rank??null,firstGood:first?{kind:first.kind,id:first.id,groupRank:first.groupRank,initiallyVisible:first.initiallyVisible,initialVisibleRank:first.initialVisibleRank}:null,expectedFound:hits.length,expectedTotal:targets.length,complete:hits.length===targets.length,missing:targets.filter(t=>t.rank===null).map(({rank,groupRank,initiallyVisible,initialVisibleRank,...target})=>target),targets,alternatives,totalResults:results.length,limited:apiResult.limited,status:el('lens-search-status').textContent,results}});
  console.log(c.id,c.query,JSON.stringify({found:good.length>0,rank:first?.rank??null,hits:hits.length,targets:targets.length}));
}
assert.equal(externalRequests,0);
const aggregate=rows=>({queries:rows.length,found:rows.filter(c=>c.actual.found).length,expectedHit:rows.filter(c=>c.actual.expectedHit).length,complete:rows.filter(c=>c.actual.complete).length,top5:rows.filter(c=>c.actual.firstGoodRank!==null&&c.actual.firstGoodRank<=5).length,expectedFound:rows.reduce((s,c)=>s+c.actual.expectedFound,0),expectedTotal:rows.reduce((s,c)=>s+c.actual.expectedTotal,0),meanReciprocalRank:rows.reduce((s,c)=>s+(c.actual.firstGoodRank?1/c.actual.firstGoodRank:0),0)/rows.length});
const inputFiles=['worker/index.mjs','worker/answer-layer.mjs','worker/nets-links.mjs','worker/categories.mjs','worker/sync.mjs','src/workspace.js','src/stories.js','src/reader.js','src/data.js','src/data/characters.json','src/data/character-reference-ids.json','src/data/prophecies.json','data/books.json','data/chapters.json','data/evidence.json','data/stories.json','data/reference/people.json','data/reference/places.json','data/reference/topics.json','scripts/build.mjs','scripts/search-vocabulary.mjs','scripts/story-topics.mjs','package-lock.json'];
const output={...suite,execution:{sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),node:process.version,ranAt:new Date().toISOString(),method:'Source functions in Node; in-memory worker and actual UI runSearch with rendering adapters.',externalRequests,documentCount:documents.length,inputSha256:Object.fromEntries(inputFiles.map(file=>[file,crypto.createHash('sha256').update(read(file)).digest('hex')]))},summary:{...aggregate(cases),byCategory:Object.fromEntries([...new Set(cases.map(c=>c.category))].map(category=>[category,aggregate(cases.filter(c=>c.category===category))]))},cases};
fs.writeFileSync(process.argv[2]||'outputs/search-tests/results.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(output.summary,null,2));
const diagnostics=['anxiety','forgiveness','forgivness','jezus','mozes','genisis 1:1','why are there two creation stories','did women find the empty tomb'].map(query=>({query,terms:vm.runInContext('questionTerms('+JSON.stringify(query)+').map(g=>({original:g.original,primary:g.primary,expanded:[...g],known:[...g].filter(w=>SEARCH[w])}))',context)}));
fs.writeFileSync('outputs/search-tests/diagnostics.json',JSON.stringify(diagnostics,null,2)+'\n');
```
<!-- SEARCH_TEST_RUNNER_END -->

</details>
