import zlib from 'node:zlib';
export function validateSides(records,books,chapters){
 const cache=new Map();
 for(const record of records){
  if(record.sides===undefined)continue;
  if(!Array.isArray(record.sides)||!record.sides.length)throw Error(`${record.id}: sides must be a nonempty array`);
  const refs=new Set((record.refs||[]).map(r=>typeof r==='string'?r:r.label));
  for(const side of record.sides){
   if(!side||!['A','B'].includes(side.label)||typeof side.quote!=='string'||!side.quote.length||!refs.has(side.ref))throw Error(`${record.id}: invalid side or ref outside refs: ${side?.ref}`);
   const m=/^(.*?) (\d+):(\d+)$/.exec(side.ref),book=m&&books.find(b=>b.name===m[1]);
   const key=book&&`${book.id}:${+m[2]}`;
   if(!key||!chapters[key])throw Error(`${record.id}: side verse missing: ${side.ref}`);
   if(!cache.has(key))cache.set(key,JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64'))));
   const verse=cache.get(key).verses.find(v=>v.n===+m[3]);
   if(!verse?.kjv?.includes(side.quote))throw Error(`${record.id}: side quote is not an exact KJV substring at ${side.ref}`);
  }
 }
}
export function mergeVerseRoles(records,updates,books,chapters){
 const byId=new Map(records.map(r=>[r.id,r])),seen=new Set();
 const merged=records.map(r=>({...r}));const output=new Map(merged.map(r=>[r.id,r]));
 for(const update of updates){
  if(!byId.has(update.id)||seen.has(update.id))throw Error(`Unknown or duplicate verse-role ID: ${update.id}`);
  if(update.sides===undefined)throw Error(`${update.id}: missing sides`);
  seen.add(update.id);output.get(update.id).sides=update.sides;
 }
 validateSides(merged,books,chapters);return merged;
}
