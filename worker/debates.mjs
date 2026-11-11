import acceptedRulings from '../data/rc1-rulings.json' with {type:'json'};
import books from '../data/books.json' with {type:'json'};
const bookOrder=new Map(books.flatMap(book=>[[book.name.toLowerCase(),book.id],...(book.name==='Psalms'?[['psalm',book.id]]:[])]));
export function evidenceReferenceKey(record){
 for(const ref of [record.ref,...(record.refs||[])]){
  if(ref&&typeof ref==='object'&&Number.isInteger(ref.book))return [ref.book,ref.chapter||0,ref.verse||ref.first||0];
  const match=/^(.+?)\s+(\d+)(?::(\d+))?/.exec(typeof ref==='string'?ref:ref?.label||'');
  const book=match&&bookOrder.get(match[1].toLowerCase());
  if(book!==undefined&&book!==null)return [book,Number(match[2]),Number(match[3]||0)];
 }
 return [Number.MAX_SAFE_INTEGER,0,0];
}
export function compareEvidenceReferences(a,b){const x=evidenceReferenceKey(a),y=evidenceReferenceKey(b);return x[0]-y[0]||x[1]-y[1]||x[2]-y[2]||String(a.id||a.title||'').localeCompare(String(b.id||b.title||''));}
const rulings=new Map(acceptedRulings.rulings.map(row=>[row.id,row.label]));
// Only explicit owner-accepted rulings override the original status display.
export function debateVerdict(record) {
 if(rulings.has(record.id))return rulings.get(record.id);
 if(record.mode==='commandments')return 'Instruction in context';
 const labels = record.mode === 'science' || record.mode === 'history'
  ? {Agrees:'Evidence matches the text', Disagrees:'Conflicts with evidence', Context:'Not settled'}
  : {'Textual conflict':'Wording differs', Context:'Interpretation remains open'};
 return labels[record.status] || record.status;
}
// Read the record prose at 200 words per minute; short records have no estimate.
export function recordReadingMinutes(record) {
 const texts=[record.title,record.summary,record.text,record.reasoning,record.scope,record.languageContext,
 typeof record.alternativeReading==='string'?record.alternativeReading:record.alternativeReading?.text||record.alternativeReading?.summary,
 ...(record.fields||[]).map(field=>field.text)].filter(value=>typeof value==='string'&&value.trim());
 const words=[...new Set(texts)].join(' ').replace(/<[^>]*>/g,' ').trim().split(/\s+/).filter(Boolean).length;
 return words>=100?Math.ceil(words/200):null;
}
export function debateCard(record) {
 return {readingMinutes:recordReadingMinutes(record), id:record.id, title:record.title || `What does ${record.ref} show?`, summary:record.summary || record.text,
  ref:record.ref, refs:record.refs || [], mode:record.mode, status:record.status, verdict:debateVerdict(record), tags:record.tags || [record.tag].filter(Boolean)};
}
// Owner-approved presentation groups only. Members remain independent research
// records; this allowlist never changes IDs, detail routes, claims or placements.
const evidenceDisplayGroups=[
 {key:'genesis-wife-sister',title:'Wife-sister accounts',kind:'passages',ids:['genesis-wife-sister-12','genesis-wife-sister-20','genesis-wife-sister-26']},
 {key:'genesis-bethel-naming',title:'Bethel naming accounts',kind:'passages',ids:['genesis-bethel-naming-28','genesis-bethel-naming-35']},
 {key:'samuel-repayment-versions',title:'Fourfold or sevenfold repayment',kind:'versions',ids:['restore-the-lamb-fourfold-or-sevenfold-2-samuel-12-6-greek','restore-the-lamb-fourfold-or-sevenfold-2-samuel-12-6-greek-new-20261020']},
 {key:'samuel-bow-versions',title:'Steel or bronze bow',kind:'versions',ids:['a-bow-of-steel-or-a-bow-of-bronze-2-samuel-22-35-greek','a-bow-of-steel-or-a-bow-of-bronze-2-samuel-22-35-greek-new-20261020']}
];
export function groupEvidenceDisplay(records){
 const membership=new Map(evidenceDisplayGroups.flatMap(group=>group.ids.map(id=>[id,group]))),groups=[],seen=new Set();
 for(const record of records){
  const group=membership.get(record.id);
  if(!group){groups.push({recordIds:[record.id]});continue;}
  if(seen.has(group.key))continue;seen.add(group.key);
  const members=records.filter(row=>group.ids.includes(row.id));
  groups.push(members.length<2?{recordIds:[record.id]}:{key:group.key,title:group.title,kind:group.kind,recordIds:members.map(row=>row.id)});
 }
 return groups;
}
export function debatePage(records, params) {
 const mode=params.get('mode') || 'text', filter=params.get('filter') || 'all', status=params.get('status') || 'all';
 if(!['text','science','history'].includes(mode)||!['all','Q','T','V','commandments'].includes(filter))return null;
 let rows=records.filter(record=>mode==='text'?!['science','history'].includes(record.mode):record.mode===mode);
 if(filter!=='all')rows=rows.filter(record=>filter==='commandments'?record.mode==='commandments':filter==='Q'?record.mode==='questions':(record.tags||[record.tag]).includes(filter));
 const collectionTotal=rows.length,modeCounts=Object.fromEntries(['text','science','history'].map(key=>[key,records.filter(record=>key==='text'?!['science','history'].includes(record.mode):record.mode===key).length]));
 const terms=(params.get('q')||'').toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
 rows=rows.filter(record=>terms.every(term=>[record.title||`What does ${record.ref} show?`,record.summary,record.text,record.ref,...(record.refs||[]).map(ref=>typeof ref==='string'?ref:ref.label)].join(' ').toLocaleLowerCase().includes(term)));
 const counts=Object.fromEntries([...new Set(rows.map(record=>record.status))].map(value=>[value,rows.filter(record=>record.status===value).length]));
 if(status!=='all')rows=rows.filter(record=>record.status===status);
 const day=params.get('day');
 if(day){
  const stamp=Date.parse(day+'T00:00:00Z');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Number.isFinite(stamp)||new Date(stamp).toISOString().slice(0,10)!==day)return null;
  const pool=rows.filter(record=>record.title&&record.title.length<=100&&record.title.split(/\s+/).length<=15&&record.sides?.some(side=>side.label==='A')&&record.sides.some(side=>side.label==='B'));
  if(pool.length){const index=Math.floor(stamp/86400000);rows=[pool[((index%pool.length)+pool.length)%pool.length]];}
 }
 const ids=params.getAll('id');if(ids.length)rows=rows.filter(record=>ids.includes(record.id));
 rows.sort(compareEvidenceReferences);
 // Only the list UI opts in. Saved selections, daily records and other API
 // consumers keep the original record-based contract unless they request this.
 const display=params.get('group')==='display'?groupEvidenceDisplay(rows):null;
 const page=Math.max(0,Math.min(Math.floor(Number(params.get('page'))||0),Math.max(0,Math.ceil((display?.length??rows.length)/24)-1)));
 const displayPage=display?.slice(page*24,page*24+24),selected=displayPage?new Set(displayPage.flatMap(group=>group.recordIds)):null;
 return {records:(selected?rows.filter(record=>selected.has(record.id)):rows.slice(page*24,page*24+24)).map(debateCard), total:rows.length, page, counts, collectionTotal, modeCounts, translationTotal:records.filter(record=>(record.tags||[record.tag]).includes('T')).length,...(display?{displayGroups:displayPage,displayTotal:display.length}:{})};
}
