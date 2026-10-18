// Shared, DOM-free atlas parsing and safe text-to-chip helpers.
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
  const aliases=[...names(f.aliases),f.kjvName,f.esvName,...names(f.otherNames).map(key=>raw.get(key)?.displayTitle)].filter(n=>n&&n!==name);
  const description=plain(f.description||f.comment||names(f.dictText)[0]);
  places.set(id,{id,lookupIds:[f.slug,f.placeID].filter(v=>v!==undefined).map(String),name,modern_name:f.modern_name||f.modernName||null,aliases:[...new Set(aliases)],coordinates,description:description.length>600?description.slice(0,600).replace(/\s+\S*$/,'')+'…':description||'No description is available in this reference dataset.',verification:f.recogitoStatus||null,precision:f.precision||null,canonicalId:names(f.canonicalPlace)[0]||id,personNames:names(f.personNames),ambiguous:!!f.ambiguous});
 }
 return places;
}
// These words also denote common words, people or tribes. Plain text alone cannot
// identify their geographic sense; keep them accessible by ID rather than auto-linking.
const contextDependentNames=new Set('lord,god,put,straight,destruction,place,pool,river,tower,mount,mountain,rahab,abel,adam,dan,gad,asher,benjamin,joseph,judah,israel,manasseh,naphtali,ephraim,zebulun,simeon,reuben,ham,shem,lot,teman,edom,uz,on,no,sin,er,ram,ar,an,ur'.split(','));
export function createPlaceMatcher(places){
 const index=new Map();
 const excluded=new Set(contextDependentNames);
 for(const p of places.values()){for(const name of p.personNames)excluded.add(name.toLocaleLowerCase());if(p.ambiguous)excluded.add(p.name.toLocaleLowerCase());}
 for(const place of places.values())for(const name of [place.name,...place.aliases]){
  if(place.ambiguous||excluded.has(name.toLocaleLowerCase())||name.length<3||/^rec[A-Za-z0-9]+$/.test(name))continue;
  const key=name.toLocaleLowerCase(),ids=index.get(key)||new Set();ids.add(places.has(place.canonicalId)?place.canonicalId:place.id);index.set(key,ids);
 }
 const unique=new Map([...index].filter(([,ids])=>ids.size===1).map(([n,ids])=>[n,[...ids][0]]));
 const alternatives=[...unique.keys()].sort((a,b)=>b.length-a.length).map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
 const pattern=alternatives.length?new RegExp(`(?<![\\p{L}\\p{N}_])(?:${alternatives.join('|')})(?![\\p{L}\\p{N}_])`,'giu'):null;
 return text=>pattern?[...String(text).matchAll(pattern)].map(m=>({start:m.index,end:m.index+m[0].length,label:m[0],id:unique.get(m[0].toLocaleLowerCase())})):[];
}
export function locationChip(id,label){return `<button type="button" class="location-chip" data-place-id="${escapeHTML(id)}" aria-haspopup="dialog" aria-controls="atlas-sheet" aria-label="Explore ${escapeHTML(label)} in the atlas"><span aria-hidden="true">📍</span> ${escapeHTML(label)}</button>`;}
// Input is plain text, never markup. Existing markup is handled with a DOM walker.
export function wrapLocationNames(textOrNames,match){
 if(Array.isArray(textOrNames))return textOrNames.map(text=>wrapLocationNames(text,match)).join(', ');
 const text=String(textOrNames);let cursor=0,html='';
 for(const hit of match(text)){html+=escapeHTML(text.slice(cursor,hit.start))+locationChip(hit.id,hit.label);cursor=hit.end;}
 return html+escapeHTML(text.slice(cursor));
}
let pending;
export async function loadPlaces(){
 if(!pending)pending=fetch('/reference/places.json').then(r=>{if(!r.ok)throw Error('Could not load places.');return r.json();}).then(parsePlaces).catch(error=>{pending=null;throw error;});
 return pending;
}
export async function getLocationDetails(placeId){const places=await loadPlaces(),key=String(placeId);return places.get(key)||[...places.values()].find(p=>p.lookupIds.includes(key))||null;}
