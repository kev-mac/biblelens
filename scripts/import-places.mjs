// Reproducible, attributed subset of the same Theographic revision as the timeline.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {excludeUnknownPlaceCoordinates} from './place-coordinate-policy.mjs';
const revision='52e049efb3b95e4f1da52d11a3303fbd2d648922';
const url=`https://raw.githubusercontent.com/robertrouse/theographic-bible-metadata/${revision}/json/places.json`;
const response=await fetch(url);if(!response.ok)throw Error(`Places download failed: ${response.status}`);
const source=await response.text(),records=JSON.parse(source);
const fields=['displayTitle','kjvName','esvName','latitude','longitude','comment','aliases','otherNames','canonicalPlace','dictText','featureType','precision','recogitoStatus','ambiguous','slug','placeID'];
const places=records.map(({id,fields:f})=>({id,fields:Object.fromEntries(fields.filter(k=>f[k]!==undefined).map(k=>[k,k==='dictText'?f[k].map(t=>t.split(/\n\s*\n/)[0].slice(0,1000)):f[k]]))}));
// Preserve reviewed coordinate/source conflicts as explicit uncertainty flags.
const coordinateReviews=JSON.parse(fs.readFileSync('data/reference/place-coordinate-reviews.json','utf8'));
for(const place of places)if(coordinateReviews[place.id])place.fields.identificationUncertain=true;
// Apply at import time so normal builds and future imports retain unknown points.
const excludedCoordinates=excludeUnknownPlaceCoordinates(places);
fs.writeFileSync('data/reference/place-coordinate-exclusions.json',JSON.stringify({revision,url,excludedCoordinates},null,2)+'\n');
// Text alone cannot distinguish personal names from geographic names.
const people=JSON.parse(fs.readFileSync('data/reference/people.json','utf8'));
const personNames=new Set(people.flatMap(p=>[p.name,p.label,...(p.aliases||[])]).filter(n=>typeof n==='string').map(n=>n.toLowerCase()));
for(const place of places){const f=place.fields;f.personNames=[f.displayTitle,f.kjvName,f.esvName,...String(f.aliases||'').split(/[;,|]/)].filter(n=>typeof n==='string'&&personNames.has(n.trim().toLowerCase()));}
fs.writeFileSync('data/reference/places.json',JSON.stringify(places)+'\n');
fs.writeFileSync('data/reference/places-provenance.json',JSON.stringify({revision,url,sha256:crypto.createHash('sha256').update(source).digest('hex'),count:places.length,license:'CC-BY-SA-4.0',attribution:'Robert Rouse / Viz.Bible and contributors',changes:'Selected identity, names, coordinates, relationship, precision and verification fields. Dictionary text shortened to its first paragraph, at most 1000 characters; historical dictionary descriptions are not modern archaeological assessments. Modern names are not inferred from historical prose.'},null,2)+'\n');
console.log(`Imported ${places.length} places`);
