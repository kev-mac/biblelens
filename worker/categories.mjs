// Public evidence only. Private notes are paged locally and never enter this index.
const categoryOrder=['T','V','commandments','Q','academic','contradictions','stories','characters','prophecies'];
export function categoryKinds(record,placements=record.placements){
 const kinds=new Set();
 if(['stories','characters','prophecies'].includes(record.mode))return [record.mode];
 for(const p of placements){
  const tags=p.activeTags??record.tags??(record.tag?[record.tag]:[]);
  if(record.mode==='commandments'){kinds.add('commandments');continue;}
  for(const tag of tags){const kind=({T:'T',G:'T',H:'academic',V:'V',Q:'Q'})[tag];if(kind)kinds.add(kind);}
  if(!tags.length){
   if(record.mode==='questions')kinds.add('Q');
   if(record.mode==='science'||record.mode==='history'&&record.academicAssessment===true)kinds.add('academic');
   if(record.mode==='contradictions'&&record.status!=='Agrees')kinds.add('contradictions');
  }
 }
 return categoryOrder.filter(kind=>kinds.has(kind));
}
export function createCategoryCatalog(evidence,studies,parseRef,readingSources,directory={}){
 const records=[];
 for(const record of evidence){
  const keys=record.sides?.length?record.sides.map(side=>side.ref):[record.ref];
  const placements=[...new Set([...keys,...(record.refs||[]).map(ref=>ref.label),...(record.appliesTo||[])])].flatMap(ref=>{
   const parsed=parseRef(ref);return parsed?[{book:parsed.book,chapter:parsed.chapter,verse:parsed.verse,placementRole:keys.includes(ref)?'key':'context',activeTags:(record.tags||[record.tag]).filter(tag=>tag&&(!['H','G','T','V'].includes(tag)||!record.appliesTo||record.appliesTo.includes(ref)))}]:[];
  });
  if(placements.length)records.push({...record,key:record.mode+':'+record.id,sources:readingSources(record),placements});
 }
 for(const study of studies){
  if(study.type==='Historical / chronological')continue;
  const placements=study.refs.map(parseRef).filter(Boolean).map(p=>({...p,placementRole:'key'}));
  if(placements.length)records.push({id:'study-'+study.id,key:'contradictions:study-'+study.id,mode:'contradictions',status:study.type==='Textual conflict'?'Textual conflict':'Apparent / interpretive conflict',title:study.title,summary:study.summary,text:study.context,reasoning:study.reasoning,scope:study.assessment,refs:study.refs.map(label=>({label,...parseRef(label)})),sources:[...study.refs.map(label=>{const p=parseRef(label);return {label:label+' — scripture',url:`#read/${p.book}/${p.chapter}/${p.verse}`};}),...(study.sources||[])],classification:study.type,relatedPassages:study.relatedPassages,placements});
 }
 // Narratives cover their full passage range; people use recorded verse references.
 const placementsFor=ref=>{
  const first=parseRef(ref);if(!first)return [];
  const range=/[-–]\s*(?:(\d+):)?(\d+)\s*$/.exec(ref);
  const end=range?.[1]?Number(range[1]):first.chapter;
  return Array.from({length:Math.max(1,end-first.chapter+1)},(_,i)=>({...first,chapter:first.chapter+i,verse:i?1:first.verse,placementRole:'key'}));
 };
 for(const group of directory.stories||[])for(const story of group.stories||[]){
  const placements=placementsFor(story.passage);
  if(placements.length)records.push({...story,id:story.passage,key:'stories:'+story.passage,mode:'stories',placements});
 }
 for(const person of directory.people||[]){
  const placements=(person.refs||[]).filter(ref=>Array.isArray(ref)&&ref.length===3&&ref.every(Number.isInteger)&&ref[0]>=0&&ref[0]<=65&&ref[1]>0&&ref[2]>0).map(([book,chapter,verse])=>({book,chapter,verse,placementRole:'key'}));
  if(placements.length)records.push({id:person.id,key:'characters:'+person.id,mode:'characters',title:person.name,summary:directory.summaries?.[person.id]||person.summary||'',aliases:person.aliases||[],placements});
 }
 for(const item of directory.prophecies||[]){
  const placements=[item.prediction_passage,item.fulfillment_passage].filter(Boolean).flatMap(placementsFor);
  if(placements.length)records.push({...item,key:'prophecies:'+item.id,mode:'prophecies',placements});
 }
 return records;
}
export function categoryPage(catalog,params){
 const rawBook=params.get('book')??'all',book=rawBook==='all'?-1:Number(rawBook),chapter=Number(params.get('chapter')||0),page=Number(params.get('page')||0),limit=Number(params.get('limit')??24),kind=params.get('kind')||'all',theme=params.get('theme')||'all',type=params.get('type')||'all';
 if(!Number.isInteger(book)||book < -1||book>65||!Number.isInteger(chapter)||chapter<0||chapter>150||!Number.isInteger(page)||page<0||page>100000||!Number.isInteger(limit)||limit<0||limit>24||!['all',...categoryOrder].includes(kind))return null;
 const terms=(params.get('q')||'').toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
 const counts=Object.fromEntries(categoryOrder.map(key=>[key,0])),matches=[];
 for(const record of catalog){
  if(!terms.every(term=>[record.title,record.summary,record.ref,...(record.refs||[]).map(ref=>typeof ref==='string'?ref:ref.label)].join(' ').toLocaleLowerCase().includes(term)))continue;
  if(record.mode==='commandments'&&(theme!=='all'&&record.theme!==theme||type!=='all'&&record.commandmentType!==type))continue;
  const placements=record.placements.filter(p=>(book===-1||p.book===book)&&(!chapter||p.chapter===chapter));
  if(!placements.length)continue;
  const kinds=categoryKinds(record,placements);for(const key of kinds)counts[key]++;
  if(kinds.length&&(kind==='all'||kinds.includes(kind))){const first=placements[0];matches.push({...record,book:first.book,placements});}
 }
 matches.sort((a,b)=>a.book-b.book||a.placements[0].chapter-b.placements[0].chapter||a.placements[0].verse-b.placements[0].verse||a.key.localeCompare(b.key));
 const total=matches.length,current=limit?Math.min(page,Math.max(0,Math.ceil(total/limit)-1)):0;
 return {book,records:limit?matches.slice(current*limit,(current+1)*limit):[],verses:{},counts,total,page:current,pageSize:limit};
}
