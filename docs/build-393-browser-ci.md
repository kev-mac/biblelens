# Exact build 393 browser checks

This narrowly scoped draft PR runs the complete release preparation, shared
image checks and retained 28 evidence/context-card and 104 reader cases, plus 48 Explore
cases proving the single-row correction and existing Evidence filter routes.
It uses the established sandbox-required GitHub-hosted runner workflow with
read-only repository permissions, no stored checkout credentials, no secrets,
no deployment and no device access. Only this PR branch triggers the workflow.

Canonical source: `dfce76427c8c31c472de580f4db37672cc7036a3`. Build 393
fingerprint: `0cd367da96e2f1c732a7b6c77cee0e42237b7b63f1e99ef06737873713eb1bf3`.
A failure stays a failed job. Exact prepared bundles are retained only after
all gates succeed; screenshots/logs remain available on failure. Publication
is handled separately by the parent session using the exact accepted bundle.

This candidate also checks the responsive Read reference field with real
pointer/keyboard entry at the 650px breakpoint, and category-colored context
card borders, metadata information icons and evidence navigation icons. The
actual Genesis 1:16 annotated cards and dialog screenshots are retained.

The final reader matrix includes 598×1184 and 1157×1184, link-style chapter
access, bordered steps and native translation selection, plus uniform
full-name/abbreviation switching without splitting words. Total: 180 cases.
