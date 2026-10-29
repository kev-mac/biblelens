import fs from 'node:fs';
import assert from 'node:assert/strict';
import {excludeUnknownPlaceCoordinates,placeholderCoordinates,unresolvedPlaceCoordinates} from './place-coordinate-policy.mjs';
import {parsePlaces} from '../src/places-core.js';
import {regionCoverage,inWindow,usableRegionPoint} from '../src/place-regions.js';
const exclusions=JSON.parse(fs.readFileSync('data/reference/place-coordinate-exclusions.json')).excludedCoordinates;
const places=JSON.parse(fs.readFileSync('data/reference/places.json'));
assert.equal(exclusions.length,13);
assert.equal(exclusions.filter(r=>placeholderCoordinates.some(([lat,lon])=>Number(r.latitude)===lat&&Number(r.longitude)===lon)).length,11);
// Recreate the input to verify the same importer policy, without a network import.
const input=structuredClone(places);for(const r of exclusions)Object.assign(input.find(p=>p.id===r.id).fields,{latitude:r.latitude,longitude:r.longitude});
assert.deepEqual(excludeUnknownPlaceCoordinates(input),exclusions);
assert.deepEqual(input,places);
const parsed=parsePlaces(places),regions=regionCoverage([...parsed.values()]);
for(const r of exclusions){const p=parsed.get(r.id);assert.equal(p.coordinates,null);assert(!usableRegionPoint(p));assert(regions.every(region=>!inWindow(p,region)));}
for(const id of unresolvedPlaceCoordinates)assert(exclusions.some(r=>r.id===id));
assert.equal(regions[0].totalAssigned,950);assert(regions.every(r=>r.shown));
console.log('PASS: 11 placeholders + Beer-elim/Hosah unknown; importer reproducible; no region; coverage 950/1298 (73.19%), all nine chips remain.');
