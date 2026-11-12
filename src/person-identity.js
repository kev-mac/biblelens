// Shared identity facts only. Callers retain their own name normalization,
// explicit-label formatting, duplicate suppression and reference fallback.
// This small classic script also works as a side-effect import in lazy bundles.
(function (root) {
  if (root.BibleLensPersonIdentity) return;
  function indexPeople(rows, byId) {
    if (!byId) {
      byId = new Map();
      // Search historically used find(), so the first duplicate ID wins.
      for (const row of rows) if (!byId.has(row.id)) byId.set(row.id, row);
    }
    const byName = new Map();
    for (const row of rows) {
      const matches = byName.get(row.name) || [];
      matches.push(row);
      byName.set(row.name, matches);
    }
    return {byId, byName};
  }
  function describePersonIdentity(person, catalog) {
    const role = person.roles?.[0];
    const kingdom = role?.role === 'king' && /king of ([A-Z][a-z]+)/.exec(role.phrase);
    const roleLabel = role ? (kingdom ? 'King of ' + kingdom[1] : role.role[0].toUpperCase() + role.role.slice(1)) : '';
    // Same-role comparisons intentionally use exact names, not normalized names.
    const sameRole = role && (catalog.byName.get(person.name) || []).some(other =>
      other.id !== person.id && other.roles?.some(tag =>
        tag.role === role.role && (!kingdom || tag.phrase.includes('king of ' + kingdom[1]))));
    const parent = [...(person.relations?.father || []), ...(person.relations?.mother || [])]
      .map(relation => catalog.byId.get(relation.id)?.name).find(Boolean);
    const qualifier = roleLabel ? roleLabel + (sameRole && parent ? ', child of ' + parent : '') : parent ? 'child of ' + parent : '';
    return {roleLabel, parent, qualifier};
  }
  root.BibleLensPersonIdentity = {indexPeople, describePersonIdentity};
})(globalThis);
