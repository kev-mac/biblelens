# UX14 source gate — incomplete checkpoint

No Lost Books text or interface has been added. The source gate has not passed.
The adjacent JSON is a candidate audit, **not** a production licence manifest.
Raw responses, checksums, failed requests and both Archive OCR files are in
`/Users/kevin/git/codex-reports/UX14-logs/`.

## Blocking source retrieval

The original-spelling [1611 Tobit 1 transcription](https://www.kingjamesbibleonline.org/1611_Tobit-Chapter-1/) downloaded successfully.
Further downloads of Tobit 2 and 1 Esdras 1 returned HTTP 403, as did the book index.
The [1611 Wikisource edition](https://en.wikisource.org/wiki/Bible_(King_James_Version,_1611)) has missing book transcriptions; Tobit returned 404.
[eBible's edition notice](https://ebible.org/eng-kjv/copyright.htm) explicitly identifies standardized 1769 text.
Do not label that alternative as the original 1611 edition.
The [KJBO FAQ](https://www.kingjamesbibleonline.org/FAQ.php) allows scripture text use; site images and other material have separate restrictions.
The problem is complete, verified source retrieval, not a claim that the KJV translation is copyrighted in the US.

## Other source decisions

The [Charles contents](https://www.ccel.org/c/charles/otpseudepig/home.html) names different translators per work and links only part of the volume.
The [full CCEL export](https://ccel.org/ccel/c/charles/otpseudepig/cache/otpseudepig.txt) contains image placeholders, not the full translated corpus.
Archive item `apocryphapseudep02char` has unusable Greek-character OCR for English text.
The separate `apocryphapseudep02charuoft` English OCR was retrieved; it needs translation/commentary separation and image checks.
Neither OCR has been accepted as reader text. Fragmentary and complete works still need a source-level census.

[Mattison's Thomas](https://www.gospels.net/thomas), [Philip](https://www.gospels.net/philip), [Truth](https://www.gospels.net/truth), [Mary](https://www.gospels.net/mary), [Judas](https://www.gospels.net/judas) and [Secret Book of James](https://www.gospels.net/james) explicitly carry public-domain dedications.
Edition years and passage structure remain unverified; do not guess them from website copyright dates.
[Mead's 1921 Pistis Sophia](https://www.gnosis.org/library/pistis-sophia/ps000.htm) has an explicit public-domain notice.
Modern Lambdin, Patterson/Meyer and Patterson/Robinson Thomas translations have no verified redistribution grant here.
[Isenberg's Philip](https://www.gnosis.org/naghamm/gop.html) records a Brill copyright assertion; [Barnstone's Philip](https://gnosis.org/naghamm/GPhilip-Barnstone.html) retains translator copyright.
The JSON records all twelve translation decisions considered. Eligibility does not certify complete, accurate text.

## Required continuation

Obtain a reliable complete 1611 transcription with a retrievable source and checksum; do not silently substitute 1769.
Finish per-book edition/translator/year/licence records and the Charles complete-text census.
Verify chapter and verse divisions against the source editions, including additions and lettered verses.
Complete ten independent passage spot-checks per included collection before importing texts.
Then implement the directory, reader, picker, scoped search and offline sizing; run the requested checks and screenshots.
No build, release, publication, installation, push, source sync or server lifecycle operation was performed.
Live web is build 280; this checkout's existing `www` remains build 279. Do not claim synchronized assets.
