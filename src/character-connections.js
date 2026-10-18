import referenceIds from './data/character-reference-ids.json' with {type: 'json'};

// A parent edge means source is the parent of target; a child edge is its inverse.
// IDs, never names, determine identity (the dataset contains many repeated names).
export function createCharacterGraph(people, relationships) {
  const persons = new Map(people.map(person => [person.id, person]));
  const groups = new Map(people.map(person => [person.id, {
    parents: new Set(), spouses: new Set(), siblings: new Set(), children: new Set(),
  }]));
  for (const {source_id: source, target_id: target, relationship_type: type} of relationships) {
    if (source === target || !persons.has(source) || !persons.has(target)) continue;
    const left = groups.get(source), right = groups.get(target);
    if (type === 'parent') { left.children.add(target); right.parents.add(source); }
    if (type === 'child') { left.parents.add(target); right.children.add(source); }
    if (type === 'spouse') { left.spouses.add(target); right.spouses.add(source); }
    if (type === 'sibling') { left.siblings.add(target); right.siblings.add(source); }
  }
  // Include half-siblings, but never infer marriage from shared children.
  for (const family of groups.values()) for (const child of family.children) {
    for (const sibling of family.children) if (child !== sibling) groups.get(child).siblings.add(sibling);
  }
  return {
    getPerson: id => persons.get(id),
    getCharacterConnections(characterId) {
      const family = groups.get(characterId);
      return Object.fromEntries(['parents', 'spouses', 'siblings', 'children'].map(category => [category,
        [...(family?.[category] || [])].map(id => persons.get(id))
          .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id)),
      ]));
    },
  };
}

let pendingGraph;
// Reference assets are loaded only when a profile opens. Failed loads can be retried.
export function loadCharacterGraph() {
  if (!pendingGraph) pendingGraph = Promise.all(['people', 'relationships'].map(async name => {
    const response = await fetch(`reference/${name}.json`);
    if (!response.ok) throw new Error('Could not load family reference data');
    return response.json();
  })).then(([people, relationships]) => createCharacterGraph(people, relationships))
    .catch(error => { pendingGraph = undefined; throw error; });
  return pendingGraph;
}

// Async because the first request loads the shared web/native reference assets.
export async function getCharacterConnections(characterId) {
  return (await loadCharacterGraph()).getCharacterConnections(referenceIds[characterId] || characterId);
}
