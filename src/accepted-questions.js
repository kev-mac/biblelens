'use strict';
(() => {
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const store=window.BibleLensDebateStore;
 let pending,current,version=0;
 const load=()=>pending||=(fetch('/accepted-questions.json').then(r=>{if(!r.ok)throw Error();return r.json();}).catch(e=>{pending=null;throw e;}));
 const href=row=>'#debate/'+row.id;
 const readings=row=>row.readings.map((reading,index)=>`<section><h3>${index===0?'A':'B'} · ${esc(reading.label)}</h3><p>${esc(reading.summary)}</p></section>`).join('');
 const labels=row=>row.labels.map(label=>`<span class="phase2-verdict">${esc(label)}</span>`).join('');
 const order=['B25','B17','B16','B01','B26','B18','B08','B02','B27','B19','B13','B03','B28','B20','B14','B04','B29','B21','B09','B05','B30','B22','B10','B06','B23','B11','B07','B24','B12','B15'];
 const card=row=>`<a class="phase2-debate-card" href="${href(row)}"><span class="phase2-eyebrow">${esc(row.side_a[0]?.ref||row.side_b[0]?.ref||'Passages')}</span><h2>${esc(row.question)}</h2><div>${labels(row)}<span aria-hidden="true"> →</span></div></a>`;
 async function list(host){
  const token=++version;current=null;setView('debates',false);
  host.innerHTML='<h1 tabindex="-1">Big Questions</h1><nav class="ux-interior-chips" aria-label="Question collections"><a class="lens-button" href="#questions" aria-current="page">All questions</a><a class="lens-button" href="#questions?mode=text">Text Comparisons</a><a class="lens-button" href="#discover?section=evidence">Evidence</a></nav><div class="accepted-questions phase2-debate-grid" role="status">Loading questions…</div>';
  try{const rows=await load();if(token!==version)return;const slot=host.querySelector('.accepted-questions');slot.removeAttribute('role');slot.innerHTML=order.map(id=>rows.find(r=>r.decisionId===id)).filter(Boolean).map(card).join('');restoreNavigation();}
  catch{host.innerHTML='<h1>Big Questions</h1><p>Questions could not load.</p><a class="lens-button" href="#questions">Try again</a>';}
 }
 function controls(){if(!current)return;const value=store.read(current.id);const button=document.querySelector('[data-accepted-save]');if(button){button.setAttribute('aria-pressed',String(value.saved));button.textContent=value.saved?'Saved':'Save';}}
 async function detail(id){
  const token=version;setView('debate',false);const host=document.getElementById('debate-view');host.innerHTML='<p>Loading selected question…</p>';
  try{const row=(await load()).find(row=>row.id===id);if(token!==version)return;if(!row){host.innerHTML='<h1>Big Question not found</h1><a class="lens-button" href="#questions">Explore Big Questions</a>';return;}current=row;
   const passage=entry=>`<h3><a class="lens-button" href="${esc(entry.href)}">${esc(entry.ref)}</a></h3><blockquote>${entry.verses.map(v=>esc(v.text)).join(' ')}</blockquote>`;
   host.innerHTML=`<a class="lens-button" href="#questions">← Big Questions</a><h1 tabindex="-1">${esc(row.question)}</h1><p>Explore both readings and their sources, with research limits to guide your own assessment.</p><div class="phase2-sides">${readings(row)}</div><div>${labels(row)}</div><p>Evidence strength: Not assigned</p><details><summary class="lens-button">Passages and research limits</summary>${[...row.side_a,...row.side_b].map(passage).join('')}<p>${esc(row.limits)}</p></details><details><summary class="lens-button">Sources</summary>${row.sources.filter(s=>/^https:\/\//.test(s.url)).map(s=>`<a class="phase2-source" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`).join('')}</details><section class="question-save"><button class="lens-button" data-accepted-save aria-pressed="false">Save</button></section>`;controls();if(!navigationRestore)host.querySelector('h1').focus({preventScroll:true});restoreNavigation();
  }catch{host.innerHTML='<h1>Question unavailable</h1><a class="lens-button" href="#questions">Return to Big Questions</a>';}
 }
 document.addEventListener('click',event=>{if(!current||view!=='debate')return;if(event.target.closest('[data-accepted-save]'))store.write(current.id,{saved:!store.read(current.id).saved});controls();});
 window.BibleLensAcceptedQuestions={list,route(hash){version++;if(/^#debate\/headline-\d\d(?:\?|$)/.test(hash)&&!hash.includes('draft=1')){detail(hash.slice(8).split('?')[0]);return true;}current=null;return false;}};
})();
