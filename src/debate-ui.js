'use strict';
(() => {
 const title=record=>record.title||`What does ${record.ref} show?`;
 const verdict=record=>record.verdict||(['science','history'].includes(record.mode)?{Agrees:'Evidence agrees',Disagrees:'Evidence disagrees',Context:'Not settled'}:{'Textual conflict':'Real conflict',Context:'Open question'})[record.status]||record.status;
 const badge=record=>`<span class="phase2-verdict" data-status="${esc(record.status)}">${esc(verdict(record))}</span>`;
 const href=record=>{const id=record.id.startsWith('study-')?record.id.slice(6):record.id;return (record.kind==='study'||record.id.startsWith('study-'))&&ENTRIES.some(entry=>entry.id===id)?'#study/'+encodeURIComponent(id):'#debate/'+encodeURIComponent(record.id);};
 const card=record=>`<a class="phase2-debate-card" href="${href(record)}"><span class="phase2-eyebrow">${esc(record.id.startsWith('study-')?'Starter study':record.mode==='contradictions'?'Text vs text':record.mode)}</span><h2>${esc(title(record))}</h2><span class="phase2-meta">${esc(record.ref)}</span><div>${badge(record)}<span aria-hidden="true"> ↗</span></div></a>`;
 window.BibleLensDebates={card,badge,href,verdict,openRecords:records=>window.BibleLensFeatures.load('debates').then(()=>window.BibleLensDebates.openRecords(records)).catch(()=>toast('Debates could not load. Please try again.'))};
})();
