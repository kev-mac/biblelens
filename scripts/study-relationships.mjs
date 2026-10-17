import zlib from 'node:zlib';

// Optional navigation metadata. It does not assign documentary sources or tags.
export function validateRelatedPassages(records, chapters) {
 const cache=new Map();
 for(const record of records){
  if(record.relatedPassages===undefined)continue;
  if(!Array.isArray(record.relatedPassages)||!record.relatedPassages.length)throw Error(record.id+': relatedPassages must be a nonempty array');
  const seen=new Set();
  for(const ref of record.relatedPassages){
   const key=`${ref.book}:${ref.chapter}`,id=`${key}:${ref.verse}`;
   if(ref.relationship!=='narrative-doublet'||typeof ref.group!=='string'||!ref.group||typeof ref.label!=='string'||!ref.label||![ref.book,ref.chapter,ref.verse].every(Number.isInteger)||seen.has(id)||!chapters[key])throw Error(record.id+': invalid related passage');
   seen.add(id);
   if(!cache.has(key))cache.set(key,JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64'))));
   if(!cache.get(key).verses.some(v=>v.n===ref.verse))throw Error(record.id+': related verse outside chapter');
  }
 }
}
