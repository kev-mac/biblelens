import fs from 'node:fs';

// Build-time loader. No network, imports, inference, or annotation writes.
export function loadReferenceResources() {
  const read = name => JSON.parse(fs.readFileSync(new URL(`../data/reference/${name}.json`, import.meta.url), 'utf8'));
  return {people: read('people'), topics: read('topics'), notices: read('notices'), provenance: read('provenance')};
}
