'use strict';
(() => {
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const store=window.BibleLensDebateStore;
 let pending,current,version=0;
 const load=()=>pending||=(fetch('/accepted-questions.json').then(r=>{if(!r.ok)throw Error();return r.json();}).catch(e=>{pending=null;throw e;}));
 const href=row=>'#debate/'+row.id;
 const readings=row=>row.readings.map((reading,index)=>`<section><h3>${index===0?'A':'B'} · ${esc(reading.label)}</h3><p>${esc(reading.summary)}</p></section>`).join('');
 const labels=row=>row.labels.map(label=>`<span class="phase2-verdict">${esc(label)}</span>`).join('');
 const card=row=>`<a class="phase2-debate-card" href="${href(row)}"><span class="phase2-eyebrow">${esc(row.decisionId)}</span><h2>${esc(row.question)}</h2>${readings(row)}<div>${labels(row)}</div><p>Evidence strength: Not assigned</p></a>`;
 async function list(host,mode){
  const slot=document.createElement('section');slot.className='accepted-questions';slot.innerHTML='<h2>Selected Big Questions</h2><p>Explore two readings of each question, with sources and limits to guide your own assessment.</p>';host.querySelector('#debate-count').before(slot);
  try{const rows=await load();if(!slot.isConnected)return;const comparison={text:'text-vs-text',science:'text-vs-science',history:'text-vs-history'}[mode];slot.insertAdjacentHTML('beforeend','<div class="phase2-debate-grid">'+rows.filter(row=>row.comparison===comparison).map(card).join('')+'</div>');}catch{slot.insertAdjacentHTML('beforeend','<p>Selected questions are unavailable. Return to Big Questions to try loading this collection again.</p>');}
 }
 function controls(){if(!current)return;const value=store.read(current.id);document.querySelectorAll('[data-accepted-stance]').forEach(button=>button.setAttribute('aria-pressed',String(value.stance===button.dataset.acceptedStance)));const button=document.querySelector('[data-accepted-save]');if(button){button.setAttribute('aria-pressed',String(value.saved));button.textContent=value.saved?'Saved':'Save';}}
 async function detail(id){
  const token=version;setView('debate',false);const host=document.getElementById('debate-view');host.innerHTML='<p>Loading selected question…</p>';
  try{const row=(await load()).find(row=>row.id===id);if(token!==version)return;if(!row){host.innerHTML='<h1>Big Question not found</h1><a class="lens-button" href="#questions">Explore Big Questions</a>';return;}current=row;
   const passage=entry=>`<h3><a class="lens-button" href="${esc(entry.href)}">${esc(entry.ref)}</a></h3><blockquote>${entry.verses.map(v=>esc(v.text)).join(' ')}</blockquote>`;
   host.innerHTML=`<a class="lens-button" href="#questions">← Big Questions</a><h1 tabindex="-1">${esc(row.question)}</h1><div class="phase2-sides">${readings(row)}</div><div>${labels(row)}</div><p>Evidence strength: Not assigned</p><details><summary class="lens-button">Passages and research limits</summary>${[...row.side_a,...row.side_b].map(passage).join('')}<p>${esc(row.limits)}</p></details><details><summary class="lens-button">Sources</summary>${row.sources.filter(s=>/^https:\/\//.test(s.url)).map(s=>`<a class="phase2-source" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`).join('')}</details><section class="phase2-stance"><h2>Where do you land?</h2><div role="group" aria-label="Your private choice">${['A','B','Not sure'].map(value=>`<button class="lens-button" data-accepted-stance="${value}" aria-pressed="false">${value}</button>`).join('')}</div><p>Your responses remain private on this device. Your backup includes saved questions and personal choices.</p><button class="lens-button" data-accepted-save aria-pressed="false">Save</button></section>`;controls();if(!navigationRestore)host.querySelector('h1').focus({preventScroll:true});restoreNavigation();
  }catch{host.innerHTML='<h1>Question unavailable</h1><a class="lens-button" href="#questions">Return to Big Questions</a>';}
 }
 document.addEventListener('click',event=>{if(!current||view!=='debate')return;const stance=event.target.closest('[data-accepted-stance]');if(stance)store.write(current.id,{stance:stance.dataset.acceptedStance});if(event.target.closest('[data-accepted-save]'))store.write(current.id,{saved:!store.read(current.id).saved});controls();});
 window.BibleLensAcceptedQuestions={list,route(hash){version++;if(/^#debate\/headline-\d\d(?:\?|$)/.test(hash)&&!hash.includes('draft=1')){detail(hash.slice(8).split('?')[0]);return true;}current=null;return false;}};
})();
