// Explicit network import; normal builds only consume this checked-in snapshot.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const revision = '52e049efb3b95e4f1da52d11a3303fbd2d648922';
const url = `https://raw.githubusercontent.com/robertrouse/theographic-bible-metadata/${revision}/json/events.json`;
const response = await fetch(url);
if (!response.ok) throw new Error(`Timeline import failed: ${response.status}`);
const text = await response.text();
const raw = JSON.parse(text);
if (!Array.isArray(raw) || raw.length !== 450 || raw.some(event => !event.id || !event.fields?.title)) throw new Error('Unexpected Theographic event schema');
const retainedFields = new Set(['title','eventID','startDate','duration','partOf','verseSort','sortKey','rangeFlag']);
const events = raw.map(({id,fields}) => ({id,fields:Object.fromEntries(Object.entries(fields).filter(([key]) => retainedFields.has(key)))}));
const provenance = {revision,url,sha256:crypto.createHash('sha256').update(text).digest('hex'),count:events.length,license:'CC-BY-SA-4.0',attribution:'Robert Rouse / Viz.Bible and contributors',changes:'Selected event identity, title, traditional date, duration, parent and sort fields; academic comparisons are separate Scripture Lens editorial data.',periods:'No periods.json exists at this pinned revision. No periods or missing events have been invented.'};
await fs.writeFile('data/reference/events.json',JSON.stringify(events)+'\n');
await fs.writeFile('data/reference/timeline-provenance.json',JSON.stringify(provenance,null,2)+'\n');
console.log(`Imported ${events.length} Theographic events at ${revision}`);
