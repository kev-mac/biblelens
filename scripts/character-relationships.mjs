import fs from 'node:fs';
import {fileURLToPath} from 'node:url';

// Stable upstream source records disambiguate names such as Jacob, Enoch and Job.
const disambiguated = {
  jacob: 'israel_682', enoch: 'enoch_1192', noah: 'noah_2210', sarah: 'sarah_2473',
  ishmael: 'ishmael_630', simeon: 'simeon_2741', levi: 'levi_1820', judah: 'judah_1751',
  gad: 'gad_1262', issachar: 'issachar_645', joseph: 'joseph_1710', benjamin: 'benjamin_463',
  tamar: 'tamar_2821', joshua: 'joshua_1727', elijah: 'elijah_1131', miriam: 'miriam_2087', job: 'job_1639',
};

export function characterRelationshipData(people, profiles) {
  const bindings = {};
  for (const profile of profiles) {
    const matches = disambiguated[profile.id]
      ? people.filter(person => person.sourceRecord === disambiguated[profile.id])
      : people.filter(person => person.name === profile.name);
    if (matches.length !== 1) throw Error(`Ambiguous reference identity: ${profile.id}`);
    bindings[profile.id] = matches[0].id;
  }
  const edges = new Map();
  function add(source_id, target_id, relationship_type, origin) {
    if (source_id === target_id) return;
    const edge = {source_id, target_id, relationship_type, origin};
    edges.set(`${source_id}:${target_id}:${relationship_type}`, edge);
  }
  for (const person of people) {
    for (const type of ['father', 'mother']) for (const parent of person.relations[type] || []) add(parent.id, person.id, 'parent', 'theographic');
    for (const child of person.relations.children || []) add(person.id, child.id, 'parent', 'theographic');
  }
  // Upstream supplies no spouse edges. Preserve only explicit existing profile links.
  for (const profile of profiles) for (const name of profile.lineage?.spouses || []) {
    const written = profiles.filter(person => person.name === name);
    const matches = people.filter(person => person.name === name);
    const target = written.length === 1 ? bindings[written[0].id] : matches.length === 1 ? matches[0].id : undefined;
    if (target) add(...[bindings[profile.id], target].sort(), 'spouse', 'scripture-lens-profile');
  }
  return {bindings, relationships: [...edges.values()].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const {bindings, relationships} = characterRelationshipData(
    JSON.parse(fs.readFileSync('data/reference/people.json', 'utf8')),
    JSON.parse(fs.readFileSync('src/data/characters.json', 'utf8')),
  );
  fs.writeFileSync('src/data/character-reference-ids.json', JSON.stringify(bindings, null, 2) + '\n');
  fs.writeFileSync('data/reference/relationships.json', JSON.stringify(relationships) + '\n');
  console.log(`Normalized ${relationships.length} family edges and ${Object.keys(bindings).length} profile identities.`);
}
