# Early-book annotation quality review

## Duplicates and integration

Reviewed early.json against all 15 current data/evidence.json records and all six src/data.js ENTRIES.

- **Exact duplicate:** early-census-count duplicates src/data.js entry `soldiers` (2 Samuel 24:9 / 1 Chronicles 21:5). Preserve the established entry and merge the new primary-source links, reasoning, and explicit 1 Chronicles 21:6 reference. Do not render two census-total cards. The existing entry already mentions the excluded tribes in its context.
- **Partial overlap:** early-seeing overlaps src/data.js entry `seen` (Exodus 33:11 / John 1:18). Add Exodus 33:20 and 33:23 as context references to that established entry and incorporate the within-chapter idiom discussion. Retain the John comparison. Do not render both cards at Exodus 33:11 unless the interface deliberately supports clearly distinguished subtopics; a single merged assessment is preferable.
- No other duplicate found. The three David census topics (prompting agent, totals, famine alternatives) are distinct claims even though they share chapters.
- No early.json assessment duplicates current data/evidence.json science or historical records.
- Suggested integration count: **18 new assessments plus 2 enhancements to existing assessments**. All 17 assigned books retain a finding because other records target Exodus, 2 Samuel, and 1 Chronicles.

## Numeric and interpretive checks

- Decoded KJV, ASV, and WEB all preserve 22 versus 42 for Ahaziah (2 Kings 8:26 / 2 Chronicles 22:2). Live [WEB 2 Chronicles 22](https://ebible.org/engwebp/2CH22.htm) and [KJV 2 Chronicles 22](https://ebible.org/eng-kjv/2CH22.htm) also show 42. The current KJV-qualified summary is accurate but narrower than necessary; it may say 'In the three packaged editions'. Do not generalize to every translation.
- Decoded KJV, ASV, and WEB all preserve seven versus three years of famine (2 Samuel 24:13 / 1 Chronicles 21:12). Live [WEB 2 Samuel 24](https://ebible.org/engwebp/2SA24.htm) and [KJV 2 Samuel 24](https://ebible.org/eng-kjv/2SA24.htm) confirm seven. No silent correction of the Bible text is warranted.
- All three packaged editions preserve 40,000 versus 4,000 stalls (1 Kings 4:26 / 2 Chronicles 9:25), Arah's 775 versus 652 (Ezra 2:5 / Nehemiah 7:10), and Pahathmoab's 2,812 versus 2,818 (Ezra 2:6 / Nehemiah 7:11).
- Ezra 1's displayed item totals sum to 2,499 versus a stated grand total of 5,400. Retain the qualification that this is a conflict **if the itemization is exhaustive**; omitted categories remain a possible explanation. Do not claim proven scribal error.
- Aaron's death locations differ in the texts, but Moserah could be a regional or alternate location description. Retain that qualification; the cited passages alone do not settle the geography.
- Saul's death comparison is correctly Context rather than unqualified contradiction because 2 Samuel 1 reports a character's claim. Likewise the conquest summaries, Sabbath reasons, and animal quantities have internal qualifications that prevent categorical contradictory labels.
- `early-saul-jabesh` is a narrative-context finding. It establishes how chapters 10, 11, and 31 relate, not external confirmation of Saul's army size or the battle.
- Museum claims remain narrow. The Cyrus Cylinder provides comparable imperial restoration policy, not a copy of Ezra's Jerusalem decree. Susa establishes a real royal setting, not Esther's plot. Lachish relief evidence supports the attack on that city, not all surrounding events.

## Encoding finding and review boundary

**Correction to early.md:** the suspected WEB replacement characters were console display artifacts. Every verse in every decoded chapter was checked for actual U+FFFD codepoints. Counts: KJV 0, ASV 0, WEB 0. ASCII-escaped inspection shows intact Unicode curly quotes (U+2018/U+2019/U+201C/U+201D). No source data change is needed, and no repository files were edited.

The research remains an expanded passage-level batch. This quality pass does not certify whole-Bible, whole-book, or exhaustive whole-chapter review. Additional live full chapters were displayed for the numeric verification, but no new complete-review claim is made.
