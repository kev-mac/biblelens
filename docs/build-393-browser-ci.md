# Exact build 393 browser checks

This narrowly scoped draft PR runs the complete release preparation, shared
image checks and retained 24 evidence-pill/56 reader cases, plus 48 Explore
cases proving the single-row correction and existing Evidence filter routes.
It uses the established sandbox-required GitHub-hosted runner workflow with
read-only repository permissions, no stored checkout credentials, no secrets,
no deployment and no device access. Only this PR branch triggers the workflow.

Canonical source: `1f2ab02bf8f261b89c5205d26f667f65e7ae4f5c`. Build 393
fingerprint: `15d7c40a4d63f47eefebb21179741dd7dbb9ebd4764f6d8ebb824eac5fdabbc4`.
A failure stays a failed job. Exact prepared bundles are retained only after
all gates succeed; screenshots/logs remain available on failure. Publication
is handled separately by the parent session using the exact accepted bundle.
