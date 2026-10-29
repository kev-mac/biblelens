// A name shared by several people needs passage evidence before it can link.
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const commonNames=new Set(['on','no','an','as','is','us','and','the','all','or','so','he','her','his','she','him','it','can','may','will','god','lord','israel','judah','edom']);
const titleAliases=new Set('son,lamb,saviour,holy,word,prophet,master,light,prince,branch,root,judge,sun,king,messiah,wonderful,counsellor,sceptre,star,shiloh,father,fathers,hosts,host,almighty,last,lawgiver,dayspring,ancient,spirits,comforter'.split(','));
export function isNarrativeLocationMention(text,hit,leadingText=''){
 const before=leadingText+String(text).slice(0,hit.start);
 return /\b(?:leaves|left|reaches|reached|enters|entered)\s+$|\b(?:settles?|settled|lives?|lived|resides?|resided|stays?|stayed|remains?|remained)\s+(?:in|at)\s+$|\b(?:travels?|traveled|travelled|journeys?|journeyed|returns?|returned|goes|went|moves?|moved)\s+(?:back\s+)?(?:to|through|toward|towards|into|from)\s+$|\b(?:leaves|left|departs?|departed)\s+[^,;.!?]{1,60}\s+for\s+$|\b(?:takes?|took|travels?|traveled|travelled|journeys?|journeyed|departs?|departed)\b[^;.!?]{0,120}\b(?:from|toward|towards|through|into)\s+$/i.test(before);
}
export function createPersonMatcher(people){
 const names=new Map();
 const references=new Map();
 for(const person of people){
  if(!person||typeof person.id!=='string'||typeof person.name!=='string')continue;
  // Imported person references are a bounded sample. Relationship witnesses
  // also locate this person without guessing from a duplicate display name.
  references.set(person.id,[...(person.refs||[]),...Object.values(person.relations||{}).flatMap(relations=>relations.flatMap(relation=>relation.contextRefs||[]))]);
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
   const inVerse=candidates.filter(p=>references.get(p.id).some(r=>r[0]===context.book&&r[1]===context.chapter&&r[2]===context.verse));
   const inChapter=candidates.filter(p=>references.get(p.id).some(r=>r[0]===context.book&&r[1]===context.chapter));
   const inPassage=context.scope==='story'?candidates.filter(p=>references.get(p.id).some(r=>r[0]===context.book&&(r[1]>context.chapter||r[1]===context.chapter&&r[2]>=context.verse)&&(r[1]<context.endChapter||r[1]===context.endChapter&&r[2]<=context.endVerse))):[];
   const matches=context.scope==='story'?(inPassage.length?inPassage:candidates):(inVerse.length?inVerse:inChapter.length?inChapter:candidates);
   if(matches.length!==1||matches[0].ambiguous&&!(context.scope==='story'?inPassage.length:inVerse.length))return [];
   return [{start:match.index,end:match.index+match[0].length,label:match[0],id:matches[0].id}];
  });
 };
}
export function referenceMatches(text,placeMatch,personMatch,context){
 const places=placeMatch(text,context);
 const overlaps=(a,b)=>a.start<b.end&&a.end>b.start;
 const people=personMatch(text,context).filter(person=>!places.some(place=>place.contextual&&overlaps(place,person))&&!(context?.scope==='story'&&context.placesReady===false&&isNarrativeLocationMention(text,person,context.leadingText)));
 const hits=[...people.map(h=>({...h,person:true})),...places.filter(place=>!people.some(person=>overlaps(place,person)))].sort((a,b)=>a.start-b.start);
 return hits;
}
export function wrapReferenceNames(text,placeMatch,personMatch,context){
 const hits=referenceMatches(text,placeMatch,personMatch,context);
 let cursor=0,html='';
 for(const hit of hits){if(hit.start<cursor)continue;html+=escapeHTML(text.slice(cursor,hit.start));html+=hit.person?`<button type="button" class="person-chip" data-person-id="${escapeHTML(hit.id)}" aria-haspopup="dialog" aria-controls="character-sheet" aria-label="Open People card for ${escapeHTML(hit.label)}">${escapeHTML(hit.label)}</button>`:`<button type="button" class="location-chip" data-place-id="${escapeHTML(hit.id)}" aria-haspopup="dialog" aria-controls="atlas-sheet" aria-label="Explore ${escapeHTML(hit.label)} in the atlas"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M12 22S4 14 4 9a8 8 0 0 1 16 0c0 5-8 13-8 13Z"/></svg>${escapeHTML(hit.label)}</button>`;cursor=hit.end;}
 return html+escapeHTML(text.slice(cursor));
}
