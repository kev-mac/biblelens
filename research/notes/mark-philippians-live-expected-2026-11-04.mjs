import fs from 'node:fs';
const pickVerse=v=>Object.fromEntries(['n','kjv','asv','web'].filter(k=>Object.hasOwn(v,k)).map(k=>[k,v[k]]));
import {illustratedBooks} from '../../scripts/chapter-images.mjs';
import worker from '../../scripts/built-worker.mjs';
const rows=[];
for(const [book,[name,count]] of illustratedBooks)for(let chapter=1;chapter<=count;chapter++){
 const r=await worker.fetch(new Request('https://biblelens.test/api/chapter?book='+book+'&chapter='+chapter),{},{});if(!r.ok)throw Error('Expected chapter unavailable');const d=await r.json();rows.push({book,chapter,chapterImages:d.chapterImages||[],eventHeadings:d.eventHeadings,verses:d.verses.map(pickVerse)});
}
const sources=[...new Set([...Object.values(JSON.parse(fs.readFileSync('data/chapter-images.json'))).flat().map(a=>a.src),...Object.values(JSON.parse(fs.readFileSync('data/story-images.json'))).map(a=>a.src)])].sort();
fs.writeFileSync('/tmp/biblelens344-live-expected.json',JSON.stringify({release:JSON.parse(fs.readFileSync('dist/client/release.json')),chapters:rows,sources}));console.log('Expected live audit:',rows.length,'chapters',sources.length,'image files');
