import {validateSides} from './verse-roles.mjs';
import zlib from 'node:zlib';
export const WITNESSES=['Hebrew','Septuagint','Hebrew and Septuagint','Greek New Testament'];
export function validateWitnesses(records,books,chapters){
 const ids=new Set(),cache=new Map(),modes=['history','contradictions','science','questions','commandments'];
 for(const r of records){
  if(!r.id||ids.has(r.id))throw Error('Missing or duplicate evidence ID: '+r.id);ids.add(r.id);
  if(!modes.includes(r.mode)||typeof r.summary!=='string'||!r.summary||typeof r.text!=='string'||(r.refs!==undefined&&!Array.isArray(r.refs))||!Array.isArray(r.sources))throw Error(r.id+': invalid evidence record');
  const tags=r.tags|| (r.tag?[r.tag]:[]);
  if(!Array.isArray(tags)||tags.some(t=>!['H','G','T','V','Q'].includes(t))||new Set(tags).size!==tags.length)throw Error(r.id+': invalid tags');
  if(r.tag!==undefined&&!['H','G','T','V','Q'].includes(r.tag))throw Error(r.id+': invalid tag');
  if((tags.includes('T')||r.tag==='T')&&!WITNESSES.includes(r.witness))throw Error(r.id+': T requires a valid witness');
  if(r.witness!==undefined&&!WITNESSES.includes(r.witness))throw Error(r.id+': invalid witness');
  for(const ref of [r.ref,...(r.refs||[]).map(p=>typeof p==='string'?p:p.label),...(r.appliesTo||[])]){
   const m=/^(.*?) (\d+):(\d+)$/.exec(ref),b=m&&books.find(b=>b.name===m[1]);
   if(!b||!chapters[`${b.id}:${+m[2]}`]||+m[3]<1)throw Error(r.id+': invalid reference '+ref);
   const key=`${b.id}:${+m[2]}`;if(!cache.has(key))cache.set(key,JSON.parse(zlib.gunzipSync(Buffer.from(chapters[key],'base64'))));
   if(!cache.get(key).verses.some(v=>v.n===+m[3]))throw Error(r.id+': verse outside chapter '+ref);
  }
 }
 validateSides(records,books,chapters);
}
export function mergeWitnessLabels(records,updates,books,chapters){
 if(!Array.isArray(updates))throw Error('Witness labels must be an array');
 const seen=new Set(),labels=new Map();
 for(const u of updates){if(!u?.id||seen.has(u.id))throw Error('Missing or duplicate witness ID: '+u?.id);if(!WITNESSES.includes(u.witness))throw Error(u.id+': invalid witness');seen.add(u.id);labels.set(u.id,u.witness);}
 let applied=0,retagged=0;
 const merged=records.map(r=>{const witness=labels.get(r.id)||r.witness;if(!witness)return {...r};const result={...r,witness};if(labels.has(r.id))applied++;
  if((r.tags||[r.tag]).some(t=>t==='H'||t==='G'))retagged++;
  if(r.tags)result.tags=[...new Set(r.tags.map(t=>['H','G'].includes(t)?'T':t))];
  if(['H','G'].includes(r.tag))result.tag='T';
  return result;
 });
 validateWitnesses(merged,books,chapters);
 const ids=new Set(records.map(r=>r.id));return {records:merged,pending:updates.filter(u=>!ids.has(u.id)),applied,retagged};
}
