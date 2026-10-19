// Public evidence only. Private notes are paged locally and never enter this index.
const categoryOrder=['T','V','commandments','Q','academic','contradictions'];
export function categoryKinds(record,placements=record.placements){
 const kinds=new Set();
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
export function createCategoryCatalog(evidence,studies,parseRef,readingSources){
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
 return records;
}
export function categoryPage(catalog,params){
 const rawBook=params.get('book')??'all',book=rawBook==='all'?-1:Number(rawBook),chapter=Number(params.get('chapter')||0),page=Number(params.get('page')||0),limit=Number(params.get('limit')??24),kind=params.get('kind')||'all',theme=params.get('theme')||'all',type=params.get('type')||'all';
 if(!Number.isInteger(book)||book < -1||book>65||!Number.isInteger(chapter)||chapter<0||chapter>150||!Number.isInteger(page)||page<0||page>100000||!Number.isInteger(limit)||limit<0||limit>24||!['all',...categoryOrder].includes(kind))return null;
 const counts=Object.fromEntries(categoryOrder.map(key=>[key,0])),matches=[];
 for(const record of catalog){
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
