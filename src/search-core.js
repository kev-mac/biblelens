'use strict';
// Shared, bounded text matching. No network, storage, or private-note inputs.
const BibleLensSearch = (() => {
 const normalize=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/['’]s\b/g,'').replace(/[^a-z0-9]+/g,' ').trim();
 const tokens=value=>normalize(value).split(' ').filter(Boolean);
 const stop=new Set('a an the and or of in on at to is are was were be been who whom whose what where when which how why do does did there this that these those can could would should i we you your his her their it its has have had bible biblical please tell me about exist find allow'.split(' '));
 const queryTokens=value=>[...new Set(tokens(value).filter(word=>!stop.has(word)))].slice(0,24);
 // Optimal string alignment counts adjacent transpositions as one edit.
 function distance(a,b,limit=2){
  if(Math.abs(a.length-b.length)>limit)return limit+1;
  let before,previous=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){
   const next=[i];let smallest=i;
   for(let j=1;j<=b.length;j++){
    next[j]=Math.min(next[j-1]+1,previous[j]+1,previous[j-1]+(a[i-1]===b[j-1]?0:1));
    if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])next[j]=Math.min(next[j],before[j-2]+1);
    smallest=Math.min(smallest,next[j]);
   }
   if(smallest>limit)return limit+1;
   before=previous;previous=next;
  }
  return previous[b.length];
 }
 const tolerance=word=>word.length>=7?2:word.length>=4?1:0;
 const names=value=>Array.isArray(value)?value.filter(item=>typeof item==='string'):typeof value==='string'?value.split(/[;,|]/).map(s=>s.trim()).filter(Boolean):[];
 const catalogCache=new WeakMap();
 function catalogIndex(rows,kind,curated){
  let indexed=catalogCache.get(rows);if(indexed)return indexed;
  const byId=new Map(rows.map(row=>[row.id,row.fields||row]));
  const curatedNames=new Map(curated.map(row=>[normalize(row.name),row.aliases||[]]));
  const counts=new Map();for(const row of rows)counts.set(normalize(row.name),(counts.get(normalize(row.name))||0)+1);
  indexed=rows.map(row=>{
   const f=row.fields||row,primary=f.name||f.displayTitle||f.kjvName;
   const aliases=kind==='people'?[f.label,...names(f.aliases),...(counts.get(normalize(f.name))===1?curatedNames.get(normalize(f.name))||[]:[])]:[f.kjvName,f.esvName,...names(f.aliases),...names(f.otherNames).map(id=>byId.get(id)?.displayTitle)];
   const labels=[...new Set([primary,...aliases].filter(Boolean).map(normalize))];
   return {row,primary:normalize(primary),labels,words:[...new Set(labels.flatMap(tokens))]};
  });
  catalogCache.set(rows,indexed);return indexed;
 }
 const catalogVocabulary=(rows,kind,curated=[])=>new Set(catalogIndex(rows,kind,curated).flatMap(row=>row.words));
 function entityQuestion(query){
  const person=/^(?:who (?:was|is)|tell me about)\s+(.+?)\s*[?.!]*$/i.exec(query.trim());
  const place=/^where is\s+(.+?)\s*[?.!]*$/i.exec(query.trim());
  return person?{kind:'people',name:person[1]}:place?{kind:'places',name:place[1]}:null;
 }
 function personLabel(person,rows){
  if(rows.filter(row=>normalize(row.name)===normalize(person.name)).length<2)return person.name;
  const role=person.roles?.[0],kingdom=role?.role==='king'&&/king of ([A-Z][a-z]+)/.exec(role.phrase);
  const roleLabel=role?(kingdom?'King of '+kingdom[1]:role.role[0].toUpperCase()+role.role.slice(1)):'';
  if(!roleLabel&&person.label&&person.label!==person.name)return person.label;
  const parent=[...(person.relations?.father||[]),...(person.relations?.mother||[])].map(r=>rows.find(p=>p.id===r.id)?.name).find(Boolean);
  const count=person.refs?.length||0;
  const sameRole=role&&rows.some(row=>row.id!==person.id&&row.name===person.name&&row.roles?.some(tag=>tag.role===role.role&&(!kingdom||tag.phrase.includes('king of '+kingdom[1]))));
  return person.name+' ('+(roleLabel?roleLabel+(sameRole&&parent?', child of '+parent:''):parent?'child of '+parent:count+' '+(count===1?'passage':'passages'))+')';
 }
 function catalogSearch(rows,kind,query,curated=[],knownEntities=new Set()){
  const question=entityQuestion(query);if(question?.kind===kind)query=question.name;
  const index=catalogIndex(rows,kind,curated),words=queryTokens(query),phrase=words.join(' ');
  if(!words.length)return [];
  const vocabulary=catalogVocabulary(rows,kind,curated);let correctionBudget=2;
  const choices=words.map(word=>{
   if(vocabulary.has(word)||knownEntities.has(word))return [word];
   if(word.endsWith('s')&&vocabulary.has(word.slice(0,-1)))return [word.slice(0,-1)];
   const limit=tolerance(word);if(!limit||word.length>24||correctionBudget--<=0)return [word];
   const candidates=[...vocabulary].map(term=>({term,d:distance(word,term,limit)})).filter(item=>item.d<=limit).sort((a,b)=>a.d-b.d||a.term.localeCompare(b.term));
   return candidates.filter(item=>item.d===candidates[0]?.d).slice(0,6).map(item=>item.term);
  });
  return index.map(item=>{
   const hits=choices.filter(group=>group.some(term=>item.words.includes(term))).length;
   // Partial question matches need an exact name anchor. Fuzzy fragments
   // alone must not turn unrelated multi-word input into a profile match.
   const nameWords=queryTokens(item.primary),fullName=nameWords.length&&nameWords.every(word=>choices.some(group=>group.includes(word)));
   const exactName=nameWords.length&&nameWords.every(word=>words.includes(word)||words.includes(word+'s'));
   const prefix=words.every(word=>item.words.some(term=>term.startsWith(word)));
   const base=item.primary===phrase?120:item.labels.includes(phrase)?110:item.primary.startsWith(phrase)?105:hits===words.length?(fullName?100:90)+hits:exactName?55+hits:prefix?70+hits:0;
   const score=base?base-(item.row.fields?.canonicalPlace?.length?1:0):0;
   return {...item,score};
  }).filter(item=>item.score).sort((a,b)=>b.score-a.score||a.primary.length-b.primary.length||a.row.id.localeCompare(b.row.id)).slice(0,8).map(item=>item.row);
 }
 const bookCache=new WeakMap();
 function bookIndex(books){
  if(bookCache.has(books))return bookCache.get(books);
  const extras={Genesis:['Ge','Gn'],Exodus:['Exo','Ex'],Psalms:['Psalm','Psa','Pss'],'Song of Solomon':['Song of Songs','Canticles'],John:['Jn'],Matthew:['Mt'],Mark:['Mk'],Luke:['Lk'],Revelation:['Revelations'],James:['Jam']};
  const aliases=new Map();
  for(const book of books){
   const forms=[book.name,book.code,...(extras[book.name]||[])];
   const numbered=/^([123]) (.+)$/.exec(book.name);
   if(numbered){const [,n,name]=numbered;for(const prefix of [n,['','I','II','III'][+n],['','first','second','third'][+n],n+['','st','nd','rd'][+n]])for(const part of [name,name.slice(0,3),book.code.replace(/^[123]/,''),...(name==='John'?['Jn']:[])])forms.push(prefix+' '+part);}
   for(const form of forms)aliases.set(normalize(form).replaceAll(' ',''),book);
  }
  const pattern=[...aliases.keys()].sort((a,b)=>b.length-a.length).map(key=>key.replace(/^([123])(?=[a-z])/,'$1\\s*').replace('songofsolomon','song\\s+of\\s+solomon').replace('songofsongs','song\\s+of\\s+songs')).join('|');
  const index={aliases,pattern:new RegExp('\\b('+pattern+')\\.?(?=\\s|\\d|[.:;,?!]|$)','gi')};bookCache.set(books,index);return index;
 }
 function canonicalBooks(value,books){
  const {aliases,pattern}=bookIndex(books);
  let text=String(value||'').replace(/\b(first|second|third|[123](?:st|nd|rd)|iii|ii|i)\s+(?=[a-z])/gi,match=>({first:'1 ',second:'2 ',third:'3 ',i:'1 ',ii:'2 ',iii:'3 '}[match.trim().toLowerCase()]||match[0]+' '));
  // Longest known aliases win, including compact forms such as 1Sam17.
  text=text.replace(pattern,name=>aliases.get(normalize(name).replaceAll(' ',''))?.name||name);
  // Correct a misspelled full book name only in a reference-shaped query.
  const typo=/^\s*([a-z]{5,})\.?\s*(\d[\d\s:–-]*)\s*$/i.exec(text);
  if(typo&&!aliases.has(typo[1].toLowerCase())){
   const ranked=books.filter(book=>!/^\d/.test(book.name)).map(book=>({book,d:distance(typo[1].toLowerCase(),book.name.toLowerCase(),tolerance(typo[1]))})).filter(item=>item.d<=tolerance(typo[1])).sort((a,b)=>a.d-b.d);
   if(ranked.length&&ranked[0].d!==ranked[1]?.d)text=ranked[0].book.name+' '+typo[2];
  }
  return text.replace(/\b([a-z]+)\s*(\d{1,3})\s+(\d{1,3})(?=\s*$|\s*[–-])/gi,'$1 $2:$3').replace(/\s*([:–-])\s*/g,'$1');
 }
function references(message,books){
 const canonical=canonicalBooks(message,books),refs=[];
 const add=(book,chapter,first=null,last=first)=>{if(refs.length<8&&!refs.some(ref=>ref.book===book&&ref.chapter===chapter&&ref.first===first&&ref.last===last))refs.push({book,chapter,first,last});};
 const names=[...books].sort((a,b)=>b.name.length-a.name.length).map(book=>book.name).join('|');
 const pattern=new RegExp('\\b('+names+')\\s*(\\d{1,3})(?::(\\d{1,3})(?:[–-](?:(\\d{1,3}):)?(\\d{1,3}))?)?(?!\\d)','gi');
 for(const match of canonical.matchAll(pattern)){
  const book=books.find(book=>book.name.toLowerCase()===match[1].toLowerCase()).id,start=Number(match[2]),first=match[3]?Number(match[3]):null;
  const endChapter=match[4]?Number(match[4]):start,last=match[5]?Number(match[5]):first;
  if(endChapter<start||first!==null&&(first<1||last<1||endChapter===start&&last<first)){add(book,start,0,0);continue;}
  if(endChapter!==start){for(let ch=start;ch<=Math.min(endChapter,start+7);ch++)add(book,ch,ch===start?first:1,ch===endChapter?last:199);}
  else add(book,start,first,last);
  // Common shorthand: Genesis 1–2; John 3:16, 18; Genesis 1 and 2.
  let tail=canonical.slice(match.index+match[0].length),currentChapter=start;
  const range=first===null?/^\s*[–-]\s*(\d{1,3})(?!\d)/.exec(tail):null;
  if(range&&Number(range[1])<start){refs.splice(-1,1);add(book,start,0,0);continue;}
  if(range){for(let ch=start+1;ch<=Math.min(Number(range[1]),start+7);ch++)add(book,ch);tail=tail.slice(range[0].length);currentChapter=Number(range[1]);}
  for(let i=0;i<7;i++){
   const next=/^\s*(and|versus|vs\.?|[,;&])\s*(?:chapter\s+)?(\d{1,3})(?::(\d{1,3})(?:[–-](\d{1,3}))?)?(?![\d\w])(?=\s|$|[?!.,;])/i.exec(tail);
   if(!next)break;
   if(first!==null&&!next[3]&&next[1]===',')add(book,currentChapter,Number(next[2]),Number(next[2]));
   else {currentChapter=Number(next[2]);add(book,currentChapter,next[3]?Number(next[3]):null,next[4]?Number(next[4]):next[3]?Number(next[3]):null);}
   tail=tail.slice(next[0].length);
  }
 }
 return refs;
}
 return {entityQuestion,personLabel,references,normalize,tokens,queryTokens,distance,tolerance,names,catalogSearch,catalogVocabulary,canonicalBooks};
})();
