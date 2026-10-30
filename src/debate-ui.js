'use strict';
(() => {
 const title=record=>record.title||`What does ${record.ref} show?`;
 const verdict=record=>uiTitleCase(record.verdict||(record.mode==='commandments'?'Instruction in Context':(['science','history'].includes(record.mode)?{Agrees:'Evidence Matches the Text',Disagrees:'Evidence Points Elsewhere',Context:'Not Settled'}:{'Textual conflict':'Wording Differs',Context:'Interpretation Remains Open'})[record.status]||record.status));
 const badge=record=>`<span class="phase2-verdict" data-status="${esc(record.status)}">${esc(verdict(record))}</span>`;
 const href=record=>{const id=record.id.startsWith('study-')?record.id.slice(6):record.id;return (record.kind==='study'||record.id.startsWith('study-'))&&ENTRIES.some(entry=>entry.id===id)?'#study/'+encodeURIComponent(id):'#debate/'+encodeURIComponent(record.id);};
 const card=record=>`<a class="phase2-debate-card" href="${href(record)}"><div class="story-top-row"><span class="passage-badge">${esc(record.side_a?.[0]?.ref||record.ref||(record.id.startsWith('study-')?'Starter record':record.mode==='contradictions'?scriptureComparison('text'):record.mode))}</span>${record.readingMinutes?`<span class="read-badge">${record.readingMinutes} min read</span>`:''}</div><h2 class="story-title">${esc(title(record))}</h2>${record.summary?`<p class="story-summary">${esc(record.summary)}</p>`:''}<div class="story-footer">${badge(record)}<span class="action-link">View record →</span></div></a>`;
 window.BibleLensDebates={card,badge,href,verdict,openRecords:records=>window.BibleLensFeatures.load('debates').then(()=>window.BibleLensDebates.openRecords(records)).catch(()=>toast('Contradictions could not load. Please try again.'))};
})();
