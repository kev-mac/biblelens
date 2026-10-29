import fs from 'node:fs';
import {parsePlaces} from '../src/places-core.js';
import {regionCoverage,usableRegionPoint,inWindow} from '../src/place-regions.js';
const rows=JSON.parse(fs.readFileSync('data/reference/places.json'));
const places=[...parsePlaces(rows).values()],regions=regionCoverage(places);
const label=p=>`${p.name} [${p.id}]`;
const report={total:places.length,coordinates:places.filter(p=>p.coordinates).length,type:places.filter(p=>p.featureType).length,regionFields:rows.filter(p=>p.fields.region).length,verified:places.filter(p=>p.verification==='VERIFIED').length,regions,
 missingCoordinates:places.filter(p=>!p.coordinates).map(label),
 unusableRegionData:places.filter(p=>!p.coordinates||!usableRegionPoint(p)).map(label),
 allOnly:places.filter(p=>!regions.some(region=>region.shown&&usableRegionPoint(p)&&inWindow(p,region))).map(label),
 deferredRegions:['Judea and Samaria','Negev and Sinai','Egypt','Mesopotamia','Asia Minor','Greece and Rome'],
 limitations:'No region fields exist. Do not infer regions from names or historical dictionary prose. Only Galilee has an audited sourced window; its poor coverage keeps it hidden. Other suggested regions are deferred without audited boxes. Counts describe distinct KJV passages carrying actual bundled place links, not all mentions. Ambiguity rules omit uncertain links. Descriptions use existing short comments only; long historical dictionary prose stays in Sources.'};
console.log(JSON.stringify(report,null,2));
