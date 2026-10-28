# E academic cards: run log

## E1 Gallio at Corinth (Acts 18:12) — HELD, no card drafted (2026-10-19)
Lead: Acts 18:12 names Gallio proconsul of Achaia; the Delphi inscription (Fouilles de Delphes III.4, no. 286, Plassart 1970) names L. Junius Gallio and carries Claudius's 26th imperial acclamation (52 CE). This anchors Paul's Corinth stay but is a chronological anchor, not a discrepancy, so any card would be Context only.
Blocker: the rule needs a primary publication actually opened. Only search summaries and Wikipedia's bibliography were reached; the PHI text (epigraphy.packhum.org/text/240470) returned 403. Nothing was quoted or dated from memory.
Next try: an open-access edition or article reproducing the Greek (Murphy-O'Connor, St. Paul's Corinth, pp. 161-169, is only on Google Books), or move to another lead whose source is open (e.g. Mesha Stele/2 Kings 3 via an open edition, Shishak list at Karnak).

## E2 Mesha Stele and 2 Kings 3 (2026-10-19): one card drafted
Source actually opened: Cook, A Text-book of North-Semitic Inscriptions (1903), Moabite Stone no. 1, Hebrew text and English translation, Internet Archive full-text scan (djvu txt, lines 1100-1600). Quoted nothing from memory; lines paraphrased: Mesha son of Chemosh-[...], king of Moab, Dibonite; Omri afflicted Moab many days; his son also; Omri took Medeba, dwelt in it his days and half his sons' days, forty years; Chemosh restored it in Mesha's days; Mesha took Ataroth, Nebo (vessels of Yahweh), Yahaz.
Judgement: Context only. Cook's commentary says the stone "corrects" 2 Kings 1:1 (revolt after Ahab's death); that rests on a 1903 reading and restoration, so the card does not use it. Mesha's text is silent on the allied invasion; no argument from silence.
Limits: edition is 1903; Codex should check against a current edition (e.g. KAI 181 or an open article) before publishing. Output: `academic-cards-records.json`.
Next E unit: Shishak (1 Kings 14:25 / Karnak list), Pilate stone, Erastus, Tel Dan stele, Sennacherib prism already covered; use Internet Archive texts, which are reachable.

## E3 Shishak and the Karnak relief (2026-10-19): one card drafted
Source actually opened: Breasted, Ancient Records of Egypt vol. 4 (1906), sections 709-717, Internet Archive scan `ancientrecordsof0004jame_k7s1` (djvu txt). Read: introduction (relief carved on the Bubastite gate wall, stock phrases, little campaign detail), the list's Israel/Judah grouping, identified towns (Taanach, Beth-shean, Gibeon, Beth-horon, Ajalon, Megiddo, Socoh, Arad), and the remark that Jerusalem is not found in the surviving list.
Judgement: Context only. No argument from silence in either direction (damaged list; biblical books do not list the Israelite towns). Dates in Breasted (about 926/924 BCE) are 1906; the card gives only the usual c. 925 and flags the check for Codex.
Limits: Breasted's list is incomplete; one scan (bre4 Google copy) was a different volume, so only the k7s1 scan was used. Next E unit: Tel Dan stele, Pilate stone, Erastus (use Internet Archive); stop at ~40 cards or when no open primary source is reachable.

## E4 Jehu and the Black Obelisk (2026-10-19): one card drafted
Tel Dan, Pilate stone and Erastus were skipped: their editions (1990s, 1961, 1929) are not on Internet Archive in a form I could open. Replaced by Shalmaneser III.
Source actually opened: Luckenbill, Ancient Records of Assyria and Babylonia vol. 1 (1926), Internet Archive djvu text `Luckenbill_Ancient_Records_Assyria01_djvu.txt`; read sections 588-592 (obelisk reliefs) and 671-672 (annals year 18). Paraphrased, nothing from memory.
Judgement: Context only. No argument from silence either way; "son of Omri" flagged as a kingdom label (the usual reading), not proved.
Next E unit: Cyrus Cylinder (Rogers 1912, open), Nebuchadnezzar chronicle (Jehoiachin), Taylor/Hezekiah already covered; Pilate/Erastus only if an open edition turns up.

## E5 Fall of Samaria and Sargon (2026-10-19): one card drafted
Cyrus Cylinder skipped: `cyrus-return` card already exists in data/timeline-events.json (evidence early-cyrus). Jehoiachin: Rogers (1912) has only a prose retelling drawn from the Bible, no primary tablet text; Weidner's ration tablets and Wiseman's Chronicle are not open. Replaced by Sargon.
Source actually opened: Rogers, Cuneiform Parallels to the Old Testament (1912), Internet Archive `cuneiformparalle00rogeuoft` djvu text: Sargon introduction, annals lines 10-17, General Inscription lines 23-25. KJV and Hebrew (WLC) of 2 Kings 17:3-6, 18:9-11 fetched by script.
Judgement: Context only. The Hebrew 17:6 and 18:11 leave the capturing king unnamed; no argument from silence either way. Output appended to `academic-cards-records.json` (now 4 cards).
Next E unit: Tiglath-pileser III and Menahem/Pekah/Ahaz (2 Kings 15:19-20, 16:7-9), Rogers pp. ~310-325; then Nebuchadnezzar and Jehoiakim only if a primary text is open.

## E6 Tiglath-pileser III with Menahem, Pekah and Ahaz (2026-10-19): one card drafted
Source actually opened: Rogers, Cuneiform Parallels to the Old Testament (1912), Internet Archive `cuneiformparalle00rogeuoft` djvu text: Tiglathpileser IV introduction (Pulu, Azariah footnote, Menahem, Pekah, Hosea), Annals line 150 (Menahem of Samaria in the tribute list), Annals lines 227-228 and the Hosea passage (lines 15-18 on the reverse), Nimroud tablet line 61 (Jehoahaz of Judah), Babylonian Chronicle col. I. Hebrew (WLC) of 2 Kings 15:19-20, 29-30, 16:7-9 fetched from bolls.life; KJV from data/chapters.json.
Judgement: Context only. Dropped the Azariah/Uzziah link (Rogers retracts it in his own footnote). Rogers's prose "1,000 shekels" conflicts with the Hebrew "talents"; flagged for Codex, not used. The wording difference (Hoshea's conspiracy vs the Assyrian king's appointment) is presented as differing emphasis, not a contradiction; no argument from silence.
Not done: Pilate stone, Erastus, Tel Dan, Gallio, Jehoiachin have no open primary edition.
Next E unit: Nebuchadnezzar and Jehoiakim/Jehoiachin only if an open primary text is found (e.g. Rogers pp. ~360), then Esarhaddon/Manasseh (2 Chronicles 33, Kings 21), Merodach-baladan/Hezekiah.

## E7 Esarhaddon and Manasseh (2026-10-19): one card drafted
Source actually opened: Rogers, Cuneiform Parallels to the Old Testament (1912), Internet Archive `cuneiformparalle00rogeuoft` djvu text: Esarhaddon introduction (pp. 349-350) and Prism B col. V lines 12-23 (the list of kings from Baal of Tyre and Manasseh of Judah onward). KJV from data/chapters.json (2 Kings 21:1-3; 2 Chronicles 33:1-2, 10-13); Hebrew (WLC) of 2 Chronicles 33:10-13 fetched by script from bolls.life.
Judgement: Context only. The Assyrian list is a building-materials levy and says nothing of a capture or Babylon; no argument from silence either way. Kings and Chronicles differ by selection, not contradiction, on Assyria. Rogers's Sidon remark was not used.
Not done: Merodach-baladan/Hezekiah (Isaiah 39, 2 Kings 20) and Nebuchadnezzar/Jehoiakim have not been checked yet; Taylor prism already covered.
Next E unit: Merodach-baladan and Hezekiah (Rogers, Babylonian records), then Nebuchadnezzar only if an open primary text exists.

## E8 Merodach-baladan and Hezekiah (2026-10-19): one card drafted
Source actually opened: Rogers, Cuneiform Parallels to the Old Testament (1912), Internet Archive `cuneiformparalle00rogeuoft` djvu text: Babylonian Chronicle col. I lines 28-44 and col. II lines 1-5 (Merodach-baladan's twelve years; Sargon's battle in his twelfth year) and the Sennacherib introduction. Hebrew (WLC) of 2 Kings 20:12-13, Isaiah 39:1-2, 2 Chronicles 32:31 fetched by script from bolls.life; KJV fetched the same way.
Judgement: Context only. Real wording differences between the parallels (name spelling, 'hearkened' vs 'was glad', 'recovered' only in Isaiah) are noted, not argued. The chronicle is silent on Judah; no argument from silence. Rogers's reconstruction of the embassy's motive is not used. Date of embassy left open.
Next E unit: Nebuchadnezzar and Jehoiakim/Jehoiachin only if an open primary text is found; otherwise NT leads (Pilate, Erastus, Gallio remain without open editions). Consider stopping E at 7 cards if nothing open remains.

## E9 Nebuchadnezzar's campaign against Egypt (2026-10-19): one card drafted
Jehoiakim/Jehoiachin skipped again: Rogers (1912, pp. 360-363) is a prose retelling drawn from the Bible, no primary text. Replaced by the Egypt fragment.
Source actually opened: Rogers, Cuneiform Parallels to the Old Testament (1912), Internet Archive `cuneiformparalle00rogeuoft` djvu text: Nebuchadrezzar introduction (pp. 360-363) and section 3, "Campaign Against Egypt (567 B.C.)", lines 5-27 with transliteration. Hebrew (WLC) of Ezekiel 29:17-20, 30:10-12, Jeremiah 43:10-13, 46:13 fetched by script from bolls.life.
Judgement: Context only. The tablet is badly broken: it shows a battle year and the Egyptian king's name, no result. No argument from silence; no fulfilment claim either way. Summary in own words, no quotation.
Limits: 1912 edition, fragmentary; Codex to verify against a current edition. Card count in academic-cards-records.json: 8.
Next E unit: no open primary edition is known for the remaining leads (Pilate, Erastus, Gallio, Tel Dan, Jehoiachin). Suggest closing E at 8 cards unless the owner points to an open source.
