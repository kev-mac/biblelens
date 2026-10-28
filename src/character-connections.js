import profiles from './data/characters.json' with {type:'json'};
import {referenceJson} from './reference-cache.js';
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
  // Reviewed profiles expose only their explicit links, including after sibling inference.
  for(const profile of profiles){if(!profile.lineage_bindings)continue;const id=referenceIds[profile.id];if(!groups.has(id))continue;const family=groups.get(id);for(const key of Object.keys(family))family[key].clear();for(const link of profile.lineage_bindings.links){const target=referenceIds[link.profile_id];if(persons.has(target))family[link.relation].add(target);}}
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
  if (!pendingGraph) pendingGraph = Promise.all(['people', 'relationships'].map(name => referenceJson(`/reference/${name}.json`))).then(([people, relationships]) => createCharacterGraph(people, relationships))
    .catch(error => { pendingGraph = undefined; throw error; });
  return pendingGraph;
}

// Async because the first request loads the shared web/native reference assets.
export async function getCharacterConnections(characterId) {
  return (await loadCharacterGraph()).getCharacterConnections(referenceIds[characterId] || characterId);
}
