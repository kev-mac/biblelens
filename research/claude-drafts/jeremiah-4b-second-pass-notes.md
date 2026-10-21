# Jeremiah second pass, part 2 (workstream D4b), 2026-10-18

First-time reading of the 11 chapters left over from D4: 4, 5, 8, 9, 11, 13, 14, 15, 16, 17, 30. All 11 read in full in the KJV (`data/chapters.json`). Hebrew (WLC via bolls.life) and Brenton's Greek and English (ebible.org) were fetched by script for the verses used. All records are drafts until Codex accepts them. Jeremiah 1-25 chapter numbers are the same in Brenton and the KJV (KJV 31 = Brenton 38 for the one cross-reference).

## Issued (3 records, `jeremiah-4b-second-pass-records.json`; 2 T Septuagint, 1 untagged; all status Context, none V)

- `anger-not-kept-for-ever-or-fire-burning-for-ever-jeremiah-3-12-17-4`: "I will not keep anger for ever" against the fire "in mine anger, which shall burn for ever". Brenton's Greek prints no Jeremiah 17:1-4 (page starts at 17:5). The scope concedes different addressees and that עולם can mean a long time.
- `i-will-not-repent-or-i-am-weary-with-repenting-jeremiah-4-28-15-6`: Hebrew נחם at 4:28 (denied) and 15:6 (worn out by it); Brenton's 15:6 has "will no more spare them" and no weary clause. The scope says the two need not clash.
- `because-of-manasseh-or-every-one-shall-die-for-his-own-iniquity-jeremiah-15-4-31-29-30`: untagged; the scope sets 31:29-30 in "those days".

No existing ID in `data/evidence.json` or any earlier draft covers these verses (checked Jeremiah 3:12, 4:27-28, 5:10/18, 9:16, 15:4/6, 17:4/27, 18:8, 31:29-30; only `exp-late-23-18-7` touches 18:7-10).

## Considered and ruled out

- Jeremiah 4:27 and 5:18 ("not make a full end") against 9:16 ("till I have consumed them") and 14:12 ("I will consume them"): same Hebrew root כלה, but the KJV 9:16 is Hebrew 9:15 (Hebrew chapter 9 is numbered one verse ahead of the KJV in places) and I did not read the Hebrew of 9:15 or the Greek of 9:16 in full. Held for a later look, not issued.
- Jeremiah 9:25-26 ("punish the circumcised with the uncircumcised"; Egypt, Judah, Edom, Ammon, Moab "uncircumcised"): the Hebrew is בְּעָרְלָה "in uncircumcision"; the KJV's meaning is close. Any claim about Egypt's practice would need a primary publication I have not opened. Not issued.
- Jeremiah 11:4-7 beside Jeremiah 7:22-23 (the day of the Exodus, what was commanded): chapter 7 already carries published records; no new wording contrast found.
- Jeremiah 14:11 and 15:1 (do not pray / Moses and Samuel) against 29:7 (pray for the city): different audiences. Not issued.
- Jeremiah 17:25 (kings on David's throne enter the gates if the sabbath is kept) against 22:30: conditional promise; not a contradiction.
- Jeremiah 15:10 (neither lent on usury nor borrowed), 17:21-22 (burden on the sabbath), 16:2 (no wife): no conflict found.
- Jeremiah 30:11 "make a full end of all nations": compared with 4:27 and 5:18 only for wording; consistent.
- Jeremiah 8:7 (stork, turtle, crane, swallow) and 8:17 (cockatrices): bird and serpent name choices only.

## Ledger

`chapter-ledger.json`, Jeremiah secondPass: 3 chapters `records-draft` (4, 15, 17), 8 `reviewed-none` at KJV level (5, 8, 9, 11, 13, 14, 16, 30). All 24 former no-record chapters now have a status. An entry `d4b` under `secondPass` names these files.

## For the owner

No question. The next D units are 2 Chronicles (16 chapters), 1 Chronicles (11), Proverbs (17).
