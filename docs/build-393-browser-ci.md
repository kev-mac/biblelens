# Exact build 393 browser checks

This narrowly scoped draft PR runs the complete release preparation, shared
image checks and retained 28 evidence/context-card and 104 reader cases, plus 48 Explore
cases proving the single-row correction and existing Evidence filter routes.
It uses the established sandbox-required GitHub-hosted runner workflow with
read-only repository permissions, no stored checkout credentials, no secrets,
no deployment and no device access. Only this PR branch triggers the workflow.

Canonical source: `7fe24ca40349e86336bb733edeff6a4bb409495f`. Build 393
fingerprint: `e2a84cc647ec2458bf0cec4b20412f3617ffa44c3c618763070eafcd9412df05`.
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

Manual review required a final grid-width correction so full names actually
return on wide screens. The source gate now targets that candidate. Exact
bundles are uploaded separately from screenshots to stay below the native
artifact-download limit, without changing application bytes. The earlier
one-off partition workflow is disabled after its completed transfer.

The wider-grid run exposed a WebKit Search dismissal failure after 88 reader
cases. The current source cancels pending input, invalidates old results and
blocks submissions from a closed Search dialog. Unit and real browser
regressions cover closure during the debounce window, with event traces.
The preview background retry was identified as missing-D1 sync/session 503;
production sync verification remains separate and no sync code was changed.
