'use strict';
(() => {
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const store=window.BibleLensDebateStore;
 let pending,current,version=0;
 const load=()=>pending||=(fetch('/accepted-questions.json').then(r=>{if(!r.ok)throw Error();return r.json();}).catch(e=>{pending=null;throw e;}));
 const href=row=>'#debate/'+row.id;
 const readings=row=>row.readings.map((reading,index)=>`<section><h3>${index===0?'A':'B'} · ${esc(reading.label)}</h3><p>${esc(reading.summary)}</p></section>`).join('');
 const labels=row=>row.labels.map(label=>`<span class="phase2-verdict">${esc(uiTitleCase(label))}</span>`).join('');
 const order=['B25','B17','B16','B01','B26','B18','B08','B02','B27','B19','B13','B03','B28','B20','B14','B04','B29','B21','B09','B05','B30','B22','B10','B06','B23','B11','B07','B24','B12','B15'];
 const card=row=>`<a class="phase2-debate-card" href="${href(row)}"><div class="story-top-row"><span class="passage-badge">${esc(passagePillText([...row.side_a,...row.side_b].map(p=>p.ref)))}</span></div><h2 class="story-title">${esc(row.question)}</h2><div class="story-footer"><span class="phase2-verdict">${esc(row.labels.map(uiTitleCase).join(' • '))}</span><span class="action-link">View question →</span></div></a>`;
 async function list(host){
  const token=++version;current=null;setView('debates',false);delete host.dataset.directoryMounted;
  host.innerHTML='<div class="page-heading"><h1 tabindex="-1">Contradictions</h1><button data-accepted-filters type="button" aria-label="Filter questions" aria-haspopup="dialog" aria-controls="accepted-question-filters">Filters</button></div><div class="characters-search-box"><input id="accepted-search" type="search" aria-label="Search questions" placeholder="Search questions, passages…"></div><nav class="directory-categories" aria-label="Question labels"></nav><p class="directory-results" role="status"></p><div class="accepted-questions phase2-debate-grid" role="status">Loading questions…</div>';
  try{
   const rows=await load();if(token!==version)return;const ordered=order.map(id=>rows.find(r=>r.decisionId===id)).filter(Boolean),slot=host.querySelector('.accepted-questions'),search=host.querySelector('input'),chips=host.querySelector('.directory-categories'),count=host.querySelector('.directory-results');slot.removeAttribute('role');let selected='',subject='',page=0;const paging=document.createElement('nav');paging.className='phase2-pagination';paging.setAttribute('aria-label','Question pages');slot.after(paging);
   search.placeholder=`Search ${ordered.length} questions, passages…`;
   const options=['',...new Set(ordered.flatMap(row=>row.labels))];
   const subjects=[['','All'],['text-vs-text',scriptureComparison('text')],['text-vs-history',scriptureComparison('History')],...['Astronomy','Geology','Biology'].map(value=>[value,value])];
   const inSubject=(row,value)=>!value||row.comparison===value||row.branch===value;
   let sheet=document.getElementById('accepted-question-filters');if(!sheet){sheet=document.createElement('dialog');sheet.id='accepted-question-filters';sheet.setAttribute('aria-label','Filter Contradictions');sheet.className='stories-filter-sheet';sheet.dataset.directorySection='evidence';document.body.append(sheet);}
   sheet.innerHTML='<div class="stories-sheet-heading"><h2>Filter Contradictions</h2><button type="button" aria-label="Close question filters">×</button></div><div class="directory-categories"></div><nav class="ux-study-links" aria-label="Question collections"><a class="lens-button" href="#questions">All contradictions</a><a class="lens-button" href="#questions?mode=text">Text Comparisons</a><a class="lens-button" href="#discover?section=evidence">Evidence</a></nav>';
   sheet.querySelector('button').onclick=()=>sheet.close();sheet.querySelectorAll('a').forEach(link=>link.onclick=()=>sheet.close());
   host.querySelector('[data-accepted-filters]').onclick=()=>sheet.showModal();
   function render(){
    const terms=search.value.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu)||[],matches=ordered.filter(row=>inSubject(row,subject)&&(!selected||row.labels.includes(selected))&&terms.every(term=>[row.question,...row.labels,...row.side_a.map(s=>s.ref),...row.side_b.map(s=>s.ref)].join(' ').toLocaleLowerCase().includes(term)));
    const pages=Math.ceil(matches.length/24);page=Math.min(page,Math.max(0,pages-1));
    count.textContent=`Showing ${matches.length?page*24+1:0}–${Math.min((page+1)*24,matches.length)} of ${matches.length.toLocaleString()} questions`;slot.innerHTML=matches.slice(page*24,(page+1)*24).map(card).join('')||'<div class="lens-empty"><h2>No Contradictions Match</h2><p>Try another subject, finding, or search.</p><button class="lens-button" data-accepted-reset>Reset filters</button></div>';
    slot.querySelector('[data-accepted-reset]')?.addEventListener('click',()=>{subject='';selected='';search.value='';render();renderSubjects();});
    paging.hidden=pages<=1;paging.innerHTML=`<button type="button" ${page===0?'disabled':''}>Previous</button><span>${page+1} / ${Math.max(1,pages)}</span><button type="button" ${page+1>=pages?'disabled':''}>Next</button>`;paging.firstElementChild.onclick=()=>{page--;render();count.scrollIntoView({block:'start'});};paging.lastElementChild.onclick=()=>{page++;render();count.scrollIntoView({block:'start'});};
    for(const target of [sheet.querySelector('.directory-categories')]){target.replaceChildren(...options.map(value=>{const button=document.createElement('button');button.type='button';button.className='filter-pill'+(selected===value?' active':'');button.setAttribute('aria-pressed',String(selected===value));button.textContent=(value?uiTitleCase(value):'All questions')+' ('+(value?ordered.filter(row=>row.labels.includes(value)).length:ordered.length)+')';button.onclick=()=>{selected=value;page=0;render();};return button;}));}
   }
   function renderSubjects(){chips.replaceChildren(...subjects.map(([value,label])=>{const button=document.createElement('button');button.type='button';button.className='filter-pill'+(subject===value?' active':'');button.setAttribute('aria-pressed',String(subject===value));button.textContent=label+' ('+ordered.filter(row=>inSubject(row,value)).length+')';button.onclick=()=>{subject=value;page=0;render();renderSubjects();};return button;}));}
   renderSubjects();
   search.oninput=()=>{page=0;render();};render();restoreNavigation();
  }catch{host.innerHTML='<h1>Contradictions</h1><div class="lens-empty"><h2>Contradictions Could Not Load</h2><p>Please try again.</p><button class="lens-button" data-accepted-retry>Retry</button></div>';host.querySelector('[data-accepted-retry]').onclick=()=>list(host);}
 }

 function controls(){if(!current)return;const value=store.read(current.id);const button=document.querySelector('[data-accepted-save]');if(button){button.setAttribute('aria-pressed',String(value.saved));button.textContent=value.saved?'Saved':'Save';}}
 async function detail(id){
  const token=version;setView('debate',false);const host=document.getElementById('debate-view');host.innerHTML='<p>Loading selected question…</p>';
  try{const row=(await load()).find(row=>row.id===id);if(token!==version)return;if(!row){host.innerHTML='<h1>Contradiction Not Found</h1><a class="lens-button" href="#questions">Explore Contradictions</a>';return;}current=row;
   const passage=entry=>`<h3><a class="lens-button" href="${esc(entry.href)}">${esc(passagePillText([entry.ref]))}</a></h3><blockquote>${entry.verses.map(v=>esc(v.text)).join(' ')}</blockquote>`;
   host.innerHTML=`<a class="lens-button" href="#questions">← Contradictions</a><h1 tabindex="-1">${esc(row.question)}</h1><p>Explore both readings and their sources, with research limits to guide your own assessment.</p><div class="phase2-sides">${readings(row)}</div><div>${labels(row)}</div><p>Evidence strength: Not assigned</p><details><summary class="lens-button">Passages and Research Limits</summary>${[...row.side_a,...row.side_b].map(passage).join('')}<p>${esc(row.limits)}</p></details><details><summary class="lens-button">Sources</summary>${row.sources.filter(s=>/^https:\/\//.test(s.url)).map(s=>`<a class="phase2-source" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`).join('')}</details><section class="question-save"><button class="lens-button" data-accepted-save aria-pressed="false">Save</button></section>`;controls();if(!navigationRestore)host.querySelector('h1').focus({preventScroll:true});restoreNavigation();
  }catch{host.innerHTML='<h1>Question Unavailable</h1><a class="lens-button" href="#questions">Return to Contradictions</a>';}
 }
 document.addEventListener('click',event=>{if(!current||view!=='debate')return;if(event.target.closest('[data-accepted-save]'))store.write(current.id,{saved:!store.read(current.id).saved});controls();});
 window.BibleLensAcceptedQuestions={list,route(hash){version++;if(/^#debate\/headline-\d\d(?:\?|$)/.test(hash)&&!hash.includes('draft=1')){detail(hash.slice(8).split('?')[0]);return true;}current=null;return false;}};
})();
