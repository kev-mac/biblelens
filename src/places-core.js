import {referenceJson} from './reference-cache.js';
// Shared, DOM-free atlas parsing and safe text-to-chip helpers.
import {isNarrativeLocationMention} from './people-links.js';
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names=value=>Array.isArray(value)?value.filter(v=>typeof v==='string'):typeof value==='string'?value.split(/[;,|]/).map(s=>s.trim()).filter(Boolean):[];
const plain=value=>String(value||'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
export function parsePlaces(data){
 if(!Array.isArray(data))throw Error('Invalid places dataset');
 const raw=new Map(data.map(r=>[String(r.id),r.fields||r]));
 const places=new Map();
 for(const record of data){
  const f=record.fields||record,id=String(record.id),name=f.name||f.displayTitle||f.kjvName;
  if(!name)continue;
  const lat=f.coordinates?.latitude??f.latitude,lon=f.coordinates?.longitude??f.longitude;
  const latitude=Number(lat),longitude=Number(lon);
  const coordinates=lat!==null&&lat!==undefined&&String(lat).trim()!==''&&lon!==null&&lon!==undefined&&String(lon).trim()!==''&&Number.isFinite(latitude)&&Number.isFinite(longitude)&&Math.abs(latitude)<=90&&Math.abs(longitude)<=180?{latitude,longitude}:null;
  const aliases=[...names(f.aliases),f.kjvName,f.esvName,...names(f.otherNames).map(key=>raw.get(key)?.displayTitle)].filter(n=>n&&n!==name&&!/['’]s$/i.test(n));
  const description=plain(f.description||f.comment||names(f.dictText)[0]);
  places.set(id,{id,refs:f.refs||[],region:names(f.partOf).map(key=>raw.get(key)?.displayTitle).filter(Boolean).join(', '),linkedPassageCount:Number.isInteger(f.linkedPassageCount)?f.linkedPassageCount:null,shortDescription:plain(f.description||f.comment||''),lookupIds:[f.slug,f.placeID].filter(v=>v!==undefined).map(String),name,modern_name:f.modern_name||f.modernName||null,aliases:[...new Set(aliases)],coordinates,description:description.length>600?description.slice(0,600).replace(/\s+\S*$/,'')+'…':description||'No description is available in this reference dataset.',featureType:f.featureType||null,verification:f.recogitoStatus||null,precision:f.precision||null,canonicalId:names(f.canonicalPlace)[0]||id,personNames:names(f.personNames),identificationUncertain:!!f.identificationUncertain,ambiguous:!!f.ambiguous});
 }
 return places;
}
// Feature-type placeholders add no information beneath a map.
export function atlasDescription(place){
 const description=String(place.description||'').trim();
 return /^(city|region|mountain|water|valley|island|place|location)[.!]?$/i.test(description)?'':description;
}
// These words also denote common words, people or tribes. Plain text alone cannot
// identify their geographic sense; keep them accessible by ID rather than auto-linking.
const contextDependentNames=new Set('judgment,pillars,salt,beer,madmen,arab,there,lord,god,put,straight,destruction,place,pool,river,tower,mount,mountain,rahab,abel,adam,dan,gad,asher,benjamin,joseph,judah,israel,manasseh,naphtali,ephraim,zebulun,simeon,reuben,ham,shem,lot,teman,edom,uz,on,no,sin,er,ram,ar,an,ur'.split(','));
export function createPlaceMatcher(places){
 const index=new Map();
 const contextualIndex=new Map();
 const excluded=new Set(contextDependentNames);
 for(const p of places.values()){for(const name of p.personNames)excluded.add(name.toLocaleLowerCase());if(p.ambiguous)excluded.add(p.name.toLocaleLowerCase());}
 // Untyped buildings/objects are not geographical claims. India is retained as a
 // region: its source description explicitly identifies the country in Esther.
 const geographical=new Set(['City','Region','Mountain','Water','Valley','Island']);
 const primary=new Set([...places.values()].filter(p=>geographical.has(p.featureType)||p.name==='India').map(p=>p.name.toLocaleLowerCase()));
 for(const place of places.values())for(const name of [place.name,...place.aliases]){
  if(!geographical.has(place.featureType)&&place.name!=='India')continue;
  if(name!==place.name&&primary.has(name.toLocaleLowerCase()))continue;
  const key=name.toLocaleLowerCase();
  if(!place.ambiguous&&(name.length>=3||key==='ur')&&(!contextDependentNames.has(key)||key==='ur')&&place.personNames.some(person=>person.toLocaleLowerCase()===key)){
   const ids=contextualIndex.get(key)||new Set();ids.add(places.has(place.canonicalId)?place.canonicalId:place.id);contextualIndex.set(key,ids);
  }
  if(place.ambiguous||excluded.has(name.toLocaleLowerCase())||name.length<3||/^rec[A-Za-z0-9]+$/.test(name))continue;
  const ids=index.get(key)||new Set();ids.add(places.has(place.canonicalId)?place.canonicalId:place.id);index.set(key,ids);
 }
 const unique=new Map([...index].filter(([,ids])=>ids.size===1).map(([n,ids])=>[n,[...ids][0]]));
 const alternatives=[...unique.keys()].sort((a,b)=>b.length-a.length).map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
 const pattern=alternatives.length?new RegExp(`(?<![\\p{L}\\p{N}_])(?:${alternatives.join('|')})(?![\\p{L}\\p{N}_])`,'giu'):null;
 // Named people and places can share a spelling. A clear narrative movement or
 // residence phrase can select a unique geographical record; ordinary mentions
 // and scripture keep the stricter existing ambiguity safeguards.
 const contextualNames=new Map([...contextualIndex].filter(([,ids])=>ids.size===1).map(([name,ids])=>[name,[...ids][0]]));
 const contextualAlternatives=[...contextualNames.keys()].sort((a,b)=>b.length-a.length).map(name=>name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
 const contextualPattern=contextualAlternatives.length?new RegExp(`(?<![\\p{L}\\p{N}_])(?:${contextualAlternatives.join('|')})(?![\\p{L}\\p{N}_])`,'giu'):null;
 return (text,context={})=>{
  const value=String(text);
  const hits=pattern?[...value.matchAll(pattern)].filter(m=>/^\p{Lu}/u.test(m[0])).map(m=>({start:m.index,end:m.index+m[0].length,label:m[0],id:unique.get(m[0].toLocaleLowerCase())})):[];
  if(contextualPattern&&context.scope==='story')for(const mention of value.matchAll(contextualPattern)){
   if(!/^\p{Lu}/u.test(mention[0])||hits.some(hit=>hit.start<=mention.index&&hit.end>mention.index))continue;
   const hit={start:mention.index,end:mention.index+mention[0].length,label:mention[0],id:contextualNames.get(mention[0].toLocaleLowerCase()),contextual:true};
   if(isNarrativeLocationMention(value,hit,context.leadingText))hits.push(hit);
  }
  return hits.sort((a,b)=>a.start-b.start);
 };
}
export function locationChip(id,label){return `<button type="button" class="location-chip" data-place-id="${escapeHTML(id)}" aria-haspopup="dialog" aria-controls="atlas-sheet" aria-label="Explore ${escapeHTML(label)} in the atlas"><span aria-hidden="true">◉</span>${escapeHTML(label)}</button>`;}
// Input is plain text, never markup. Existing markup is handled with a DOM walker.
export function wrapLocationNames(textOrNames,match){
 if(Array.isArray(textOrNames))return textOrNames.map(text=>wrapLocationNames(text,match)).join(', ');
 const text=String(textOrNames);let cursor=0,html='';
 for(const hit of match(text)){html+=escapeHTML(text.slice(cursor,hit.start))+locationChip(hit.id,hit.label);cursor=hit.end;}
 return html+escapeHTML(text.slice(cursor));
}
let pending;
export async function loadPlaces(){
 if(!pending)pending=referenceJson('/reference/places.json').then(parsePlaces).catch(error=>{pending=null;throw error;});
 return pending;
}
export async function getLocationDetails(placeId){const places=await loadPlaces(),key=String(placeId);return places.get(key)||[...places.values()].find(p=>p.lookupIds.includes(key))||null;}

// Possessive aliases remain addressable by ID, but do not form separate directory entries.
export function directoryPlaces(places){return [...places.values()].filter(place=>!(/['’]s$/i.test(place.name)&&place.canonicalId!==place.id&&places.has(place.canonicalId)));}
