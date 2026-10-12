import fs from 'node:fs';
import {mergeVerseRoles} from './verse-roles.mjs';
const file='research/claude-drafts/verse-roles.json';
if(!fs.existsSync(file)){console.log('No verse-roles.json supplied; existing primary-verse fallback retained.');}
else{
 const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
 const updates=read(file),merged=mergeVerseRoles(read('data/evidence.json'),updates,read('data/books.json'),read('data/chapters.json'));
 fs.writeFileSync('data/evidence.json',JSON.stringify(merged,null,2)+'\n');console.log(`Merged and validated sides for ${updates.length} records.`);
}
