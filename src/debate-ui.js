'use strict';
(() => {
 const title=record=>record.title||`What does ${record.ref} show?`;
 const verdict=record=>uiTitleCase(record.verdict||(record.mode==='commandments'?'Instruction in Context':(['science','history'].includes(record.mode)?{Agrees:'Evidence Matches the Text',Disagrees:'Evidence Points Elsewhere',Context:'Not Settled'}:{'Textual conflict':'Wording Differs',Context:'Interpretation Remains Open'})[record.status]||record.status));
 const badge=record=>`<span class="phase2-verdict" data-status="${esc(record.status)}">${esc(verdict(record))}</span>`;
 const href=record=>{const id=record.id.startsWith('study-')?record.id.slice(6):record.id;return (record.kind==='study'||record.id.startsWith('study-'))&&ENTRIES.some(entry=>entry.id===id)?'#study/'+encodeURIComponent(id):'#debate/'+encodeURIComponent(record.id);};
 const card=record=>`<a class="phase2-debate-card" href="${href(record)}"><span class="phase2-eyebrow">${esc(record.id.startsWith('study-')?'Starter record':record.mode==='contradictions'?'Text vs. Text':record.mode)}</span>${record.readingMinutes?`<span class="ux-reading-time">${record.readingMinutes} min read</span>`:''}<h2>${esc(title(record))}</h2>${record.summary?`<p>${esc(record.summary)}</p>`:''}<span class="phase2-meta">${esc(record.side_a?.[0]?.ref||record.ref)}</span><div>${badge(record)}<span aria-hidden="true"> ↗</span></div></a>`;
 window.BibleLensDebates={card,badge,href,verdict,openRecords:records=>window.BibleLensFeatures.load('debates').then(()=>window.BibleLensDebates.openRecords(records)).catch(()=>toast('Big Questions could not load. Please try again.'))};
})();
