import fs from 'node:fs';
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
let properNouns;
function titleNames(){
 if(properNouns)return properNouns;
 properNouns=new Set(read('research/b6/title-proper-nouns.json'));
 // Corpus person names supplement the explicit proper-noun list.
 for(const row of read('src/data/characters.json'))for(const word of (row.name||'').match(/[\p{L}]+/gu)||[])if(/^[A-Z]/.test(word))properNouns.add(word);
 return properNouns;
}
export function sentenceCase(title){
 const names=titleNames();let first=true;
 return title.split(/(“[^”]*”|"[^"\n]*")/g).map((part,i)=>i%2?part:part.replace(/[\p{L}]+(?:['’]s)?/gu,word=>{
  const base=word.replace(/['’]s$/,'');const keep=first||names.has(base);first=false;
  return keep?word:word.toLowerCase();
 })).join('');
}
export function b6Catalog(payload){
 const proposals=read('research/b6/style-proposals.json');
 for(const [collection,rows] of Object.entries(payload.collections))for(const row of rows){
  const style=proposals.find(p=>p.collection===collection&&p.id===row.id);
  if(style)Object.assign(row.record,style.draft);
 }
 payload.b6Evidence=read('research/b6/evidence.json').records.map(row=>({...row,record:{...row.draft,id:row.id,title:sentenceCase(row.draft.title||row.title||row.id),sources:row.sources}}));
 payload.b6Readings=read('research/b6/comparison-readings.json').records.map(row=>({...row,record:{id:row.id,title:sentenceCase(row.title),summary:'Draft readings need source and meaning review.',sources:row.sources}}));
 payload.collections.teachings=read('research/b6/teachings.json').records.map(record=>({id:record.id,reviewStatus:'draft',record}));
 payload.collections.people.push({id:'jesus-b6',reviewStatus:'draft',record:read('research/b6/jesus.json')});
 return payload;
}
