# CSS evidence

**CSS cause:** Confirmed overridden *properties*, not necessarily entirely dead selectors:

- `src/style.css:470–474`: broad button skin/selected skin competes with `:754`'s later blue glass background. This reaches unrelated page controls; for example Stories theme fills/borders from `:1495` and Character passage gradients from `:1549` lose to more-specific shared rules. Not every property in those later rules is dead.
- Characters search's 16px radius / 48px minimum at `:1324` is replaced by the 25px wrapper and 34px inner input at `:1434–1437`.
- Character filter/button 24px corners at `:1327` lose to the broad 999px pill rule. Women button backgrounds at `:1432` is superseded by its unconditional pink gradient at `:1452`; the more-specific selected gradient at `:1433` still applies.
- Stories passage/reference 24px corners at `:1263` lose to the broader pill rule, despite appearing later in the file. This is specificity, not simply source order.
- Header geometry is repeatedly replaced at `:484`, `:854–864`, `:1468–1474`; the last phone rules produce the narrow shortcut targets. The `.study-library` remains hidden. Chapter-bottom paging is restored in Read by `src/style.css:915`; the earlier hidden rule alone does not establish that paging is unreachable.


The full matched-rule chains and computed values are in [the inventory](inventory.html). These findings concern specific overridden properties, not proof that entire selectors are unreachable in every app state.
