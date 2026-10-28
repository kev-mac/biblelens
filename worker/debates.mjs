// Labels are a presentation of the current record status, never new judgments.
export function debateVerdict(record) {
 const labels = record.mode === 'science' || record.mode === 'history'
  ? {Agrees:'Evidence agrees', Disagrees:'Evidence disagrees', Context:'Not settled'}
  : {'Textual conflict':'Wording differs', Context:'Open question'};
 return labels[record.status] || record.status;
}
export function debateCard(record) {
 return {id:record.id, title:record.title || `What does ${record.ref} show?`, summary:record.summary || record.text,
  ref:record.ref, refs:record.refs || [], mode:record.mode, status:record.status, verdict:debateVerdict(record), tags:record.tags || [record.tag].filter(Boolean)};
}
export function debatePage(records, params) {
 const mode=params.get('mode') || 'text', filter=params.get('filter') || 'all', status=params.get('status') || 'all';
 if(!['text','science','history'].includes(mode)||!['all','Q','T','V','commandments'].includes(filter))return null;
 let rows=records.filter(record=>mode==='text'?!['science','history'].includes(record.mode):record.mode===mode);
 if(filter!=='all')rows=rows.filter(record=>filter==='commandments'?record.mode==='commandments':filter==='Q'?record.mode==='questions':(record.tags||[record.tag]).includes(filter));
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
 return {records:rows.slice(page*24,page*24+24).map(debateCard), total:rows.length, page, counts};
}
