# Chat reliability checkpoint — 2026-10-12

Root cause reproduced: the question "did moses kill anyone is exodus?" originally selected Leviticus chapters and omitted Exodus 2, although the existing kill/slew family worked for "who did moses kill?". This was a ranking/book-scope gap, followed by an unsupported generated denial.

Changed the packaged index from chapters to numeric verse postings (KJV + WEB retrieval vocabulary; quotations remain packaged KJV). Search now recognizes named books without chapter numbers, avoids confusing John with 1 John, removes question filler/book names from scoring, scores nearby verse context, and retrieves short verse windows. Explicit chapter requests and existing cross-account context rules remain. Follow-up questions retain the earlier subject's candidate passages. A broader retry expands candidate passages from 12 to 24 within the named-book scope. No internet retrieval added.

Each generated answer now requires a source check and a separate model evidence review, including its short summary. Suspect broad negatives trigger broader retrieval before release. Rejected answers retry with broader packaged evidence; a second rejection yields a clear insufficient-evidence response listing searched passages. Model verification is a fallible check, not a guarantee of correctness. Default accepted answer uses two AI calls, and a rejected attempt may use up to four calls; the existing hosted model/credential remain unchanged.

Every build runs 14 known-passage questions with paraphrases, typo wording, numbered-book references and earlier failure cases. Simulated-answer tests prove retries and withholding, including invalid negatives and unsupported positives. Existing checks pass for all 1,189 chapter endpoints, annotation placements, red letters, UI and citation behavior. These are deterministic tests, not proof of live generation. Live generated answers will be checked after deployment and recorded in the outputs verification file.

No changes to evidence.json or annotation coverage. Claude's unintegrated 2 Kings drafts remain pending.
