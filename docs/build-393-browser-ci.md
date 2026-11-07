# Exact build 393 browser checks

This narrowly scoped draft PR runs the complete release preparation, shared
image checks and retained 28 evidence/context-card and 88 reader cases, plus 48 Explore
cases proving the single-row correction and existing Evidence filter routes.
It uses the established sandbox-required GitHub-hosted runner workflow with
read-only repository permissions, no stored checkout credentials, no secrets,
no deployment and no device access. Only this PR branch triggers the workflow.

Canonical source: `ac122bc36dc5eff07a4ce8aca1a54c0f883a58ea`. Build 393
fingerprint: `b705f48ca78105b9d5f36fdcf3b60f73aedb020b5c678de05919af2d2f25457d`.
A failure stays a failed job. Exact prepared bundles are retained only after
all gates succeed; screenshots/logs remain available on failure. Publication
is handled separately by the parent session using the exact accepted bundle.

This candidate also checks the responsive Read reference field with real
pointer/keyboard entry at the 650px breakpoint, and category-colored context
card borders, metadata information icons and evidence navigation icons. The
actual Genesis 1:16 annotated cards and dialog screenshots are retained.
