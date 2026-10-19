// A name shared by several people needs passage evidence before it can link.
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const commonNames=new Set(['on','no','an','as','is','us','and','the','all','or','so','he','her','his','she','him','it','can','may','will','god','lord','israel','judah','edom']);
const titleAliases=new Set('son,lamb,saviour,holy,word,prophet,master,light,prince,branch,root,judge,sun,king,messiah,wonderful,counsellor,sceptre,star,shiloh,father,fathers,hosts,host,almighty,last,lawgiver,dayspring,ancient,spirits,comforter'.split(','));
export function createPersonMatcher(people){
 const names=new Map();
 for(const person of people){
  if(!person||typeof person.id!=='string'||typeof person.name!=='string')continue;
  for(const label of new Set([person.name,...(Array.isArray(person.aliases)?person.aliases:[])])){
   if(typeof label!=='string'||label.length<3||commonNames.has(label.toLowerCase())||(label.toLowerCase()!==person.name.toLowerCase()&&titleAliases.has(label.toLowerCase())))continue;
   const key=label.toLowerCase(),matches=names.get(key)||new Map();matches.set(person.id,person);names.set(key,matches);
  }
 }
 const options=[...names.keys()].sort((a,b)=>b.length-a.length).map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
 const pattern=options.length?new RegExp(`(?<![\\p{L}\\p{N}_])(?:${options.join('|')})(?![\\p{L}\\p{N}_])`,'giu'):null;
 return (text,context={})=>{
  if(!pattern)return [];
  return [...String(text).matchAll(pattern)].flatMap(match=>{
   if(!/^\p{Lu}/u.test(match[0]))return [];
   const candidates=[...names.get(match[0].toLowerCase()).values()];
   const inVerse=candidates.filter(p=>p.refs?.some(r=>r[0]===context.book&&r[1]===context.chapter&&r[2]===context.verse));
   const inChapter=candidates.filter(p=>p.refs?.some(r=>r[0]===context.book&&r[1]===context.chapter));
   const matches=inVerse.length?inVerse:inChapter.length?inChapter:candidates;
   if(matches.length!==1||matches[0].ambiguous&&!inVerse.length)return [];
   return [{start:match.index,end:match.index+match[0].length,label:match[0],id:matches[0].id}];
  });
 };
}
export function wrapReferenceNames(text,placeMatch,personMatch,context){
 const people=personMatch(text,context),hits=[...people.map(h=>({...h,person:true})),...placeMatch(text).filter(h=>!people.some(p=>h.start<p.end&&h.end>p.start))].sort((a,b)=>a.start-b.start);
 let cursor=0,html='';
 for(const hit of hits){if(hit.start<cursor)continue;html+=escapeHTML(text.slice(cursor,hit.start));html+=hit.person?`<button type="button" class="person-chip" data-person-id="${escapeHTML(hit.id)}" aria-haspopup="dialog" aria-controls="character-sheet" aria-label="Open People card for ${escapeHTML(hit.label)}">${escapeHTML(hit.label)}</button>`:`<button type="button" class="location-chip" data-place-id="${escapeHTML(hit.id)}" aria-haspopup="dialog" aria-controls="atlas-sheet" aria-label="Explore ${escapeHTML(hit.label)} in the atlas"><span aria-hidden="true">📍</span>${escapeHTML(hit.label)}</button>`;cursor=hit.end;}
 return html+escapeHTML(text.slice(cursor));
}
