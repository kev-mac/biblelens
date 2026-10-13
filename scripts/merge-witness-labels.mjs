import fs from 'node:fs';import {mergeWitnessLabels} from './witness-labels.mjs';
const supplied=process.argv[2]|| (fs.existsSync('research/claude-drafts/witness-labels.json')?'research/claude-drafts/witness-labels.json':'research/witness-labels.json');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const records=read('data/evidence.json'),books=read('data/books.json'),chapters=read('data/chapters.json'),incoming=read(supplied);
const validatedIncoming=mergeWitnessLabels(records,incoming,books,chapters); // Reject duplicates even if a Map would hide them.
const retained=fs.existsSync('research/witness-labels.json')?read('research/witness-labels.json'):[];
mergeWitnessLabels(validatedIncoming.records,retained,books,chapters);
const registry=new Map(retained.map(u=>[u.id,u]));for(const u of incoming)registry.set(u.id,u);
const updates=[...registry.values()],result=mergeWitnessLabels(records,updates,books,chapters);
// Every entry, including future IDs, remains in the retained registry for subsequent batches.
fs.writeFileSync('data/evidence.json',JSON.stringify(result.records,null,2)+'\n');
fs.writeFileSync('research/witness-labels.json',JSON.stringify(updates,null,2)+'\n');
fs.writeFileSync('research/notes/witness-labels-pending.json',JSON.stringify(result.pending,null,2)+'\n');
console.log(JSON.stringify({applied:result.applied,retagged:result.retagged,pending:result.pending.length}));
