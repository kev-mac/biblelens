import acceptedRulings from '../data/rc1-rulings.json' with {type:'json'};
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
 const page=Math.max(0,Math.min(Math.floor(Number(params.get('page'))||0),Math.max(0,Math.ceil(rows.length/24)-1)));
 return {records:rows.slice(page*24,page*24+24).map(debateCard), total:rows.length, page, counts, collectionTotal, modeCounts, translationTotal:records.filter(record=>(record.tags||[record.tag]).includes('T')).length};
}
