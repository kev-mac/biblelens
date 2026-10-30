'use strict';
// Collection counts come from the same production corpus as their destinations.
(() => {
 const host=document.getElementById('explore-view');if(!host)return;
 host.className='lens-workspace phase2-page ux-explore';
 const topics=[['stories','Events','Linked accounts','#stories'],['people','People','People in the text','#people'],['places','Places','Cities, lands and journeys','#places'],['commandments','Laws','Laws in context','#commandments'],['lost','Lost Books','Books beyond the 66','#lost'],['evidence','Inspect','Readings and sources','#discover?section=evidence']];
 const evidence=[['history','History','Ancient sources','#questions?mode=history'],['science','Science','Nature and the text','#questions?mode=science'],['timeline','Timeline','Events in context','#timeline'],['text','Text Comparisons','Linked passages','#questions?mode=text'],['translation','Translations','Wording choices','#questions?filter=T'],['questions','Contradictions','Different readings','#questions'],['prophecies','Prophecies','Read claims in context','#prophecies']];
 const paths={lost:'M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4ZM13 7a3 3 0 0 1 3-3h5v15h-4a4 4 0 0 0-4 2',stories:'M4 4h16v16H4zM4 12h16M12 4v8',people:'M16 21v-2a6 6 0 0 0-12 0v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M18 4a4 4 0 0 1 0 8M22 21v-2a6 6 0 0 0-3-5',places:'M12 22S4 14 4 9a8 8 0 0 1 16 0c0 5-8 13-8 13ZM12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6',commandments:'M5 3h14v18H5zM8 8h8M8 12h8M8 16h5',evidence:'m12 3 10 5-10 5L2 8ZM2 12l10 5 10-5M2 16l10 5 10-5',history:'M3 5h18v14H3zM7 9h10M7 13h6',science:'M9 3h6M10 3v7l-6 10h16l-6-10V3M8 15h8',timeline:'M12 3v18M5 7h14M5 17h14',text:'M3 4h7v16H3zM14 4h7v16h-7z',translation:'M3 5h12M9 3v2M5 9l8 8M12 5c0 6-4 9-9 12M14 21l4-10 4 10M16 17h4',questions:'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 4M12 18h.01',prophecies:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6'};
 let counts=null,rendered=null,questions=[],feed=null;
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function updateCounts(){if(!counts)return;for(const tile of host.querySelectorAll('.ux-topic')){const badge=tile.querySelector('.ux-count'),value=counts[tile.dataset.topic];badge.textContent=value.toLocaleString();badge.setAttribute('aria-label',value.toLocaleString()+' records');}}

 function render(){
  const nested=new URLSearchParams(location.hash.split('?')[1]).get('section')==='evidence',showProphecies=counts?.prophecies>=20,items=nested?evidence.filter(([key])=>key!=='prophecies'):topics;
  const day=Math.floor(Date.now()/86400000),question=questions.length?questions[((day%questions.length)+questions.length)%questions.length]:null;
  const view=(nested?'evidence-'+showProphecies:'explore')+'-'+(question?.id||'')+'-'+!!feed;
  if(rendered===view)return;rendered=view;
  host.classList.toggle('ux-evidence-hub',nested);
  host.innerHTML=`${nested?'<a class="lens-button" href="#discover">Explore</a>':''}<h1 tabindex="-1">${nested?'Inspect':'Explore'}</h1>${nested&&feed?`<section class="ux-evidence-preview"><h2>First Records in History, Science and Translations</h2><p>One record from each collection, in catalog order.</p><div class="ux-evidence-articles">${['history','science','translation'].flatMap(key=>(feed[key]||[]).slice(0,1).map(record=>`<a class="ux-evidence-article" href="${escape(record.url)}"><div class="lens-evidence-meta"><span>${evidence.find(row=>row[0]===key)[1]}</span>${record.readingMinutes?`<span>${record.readingMinutes} min read</span>`:''}</div><h2>${escape(record.title)}</h2><p>${escape(record.summary)}</p></a>`)).join('')}</div></section>`:''}<section class="ux-topic-section" aria-label="${nested?'Inspect':'Explore'} collections"><div class="ux-topic-row">${items.map(([key,label,subtitle,url])=>`<a class="ux-topic" id="ux-topic-${key}" data-topic="${key}" href="${url}" aria-label="${label}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[key]}"/></svg><div class="ux-tile-copy"><strong>${label}</strong><small>${subtitle}</small></div><span class="ux-count" aria-label="${counts?counts[key].toLocaleString()+' records':'Loading count'}">${counts?counts[key].toLocaleString():'…'}</span></a>`).join('')}</div></section>${!nested&&question?`<a class="ux-daily-question" href="#debate/${escape(question.id)}"><span class="phase2-eyebrow">Question of the Day</span><h2>${escape(question.question)}</h2></a>`:''}`;
  if(nested){const grid=host.querySelector('.ux-topic-section');host.querySelector('h1').after(grid);}
 }
 fetch('/collection-counts.json?inspect=1').catch(()=>fetch('/collection-counts.json')).then(r=>{if(!r.ok)throw Error();return r.json();}).then(value=>{counts=value;render();updateCounts();}).catch(()=>{host.querySelectorAll('.ux-count').forEach(n=>{n.textContent='';n.setAttribute('aria-label','Count unavailable');});});
 fetch('/accepted-questions.json').then(r=>r.ok?r.json():[]).then(rows=>{questions=rows.slice().sort((a,b)=>a.id.localeCompare(b.id));render();updateCounts();}).catch(()=>{});
 fetch('/explore-feed.json').then(r=>r.ok?r.json():null).then(rows=>{feed=rows;render();updateCounts();}).catch(()=>{});
 window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#discover'))render();});
 window.addEventListener('focus',render);document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});setInterval(render,60000);render();
 const topic=()=>{
  const hash=location.hash,params=new URLSearchParams(hash.split('?')[1]);
  document.body.dataset.topic=/^#(?:people|characters)/.test(hash)?'people':hash.startsWith('#stories')?'stories':hash.startsWith('#places')?'places':hash.startsWith('#commandments')?'commandments':hash.startsWith('#timeline')?'timeline':/^#(?:questions|debate)/.test(hash)?params.get('mode')==='history'?'history':params.get('mode')==='science'?'science':params.get('filter')==='T'?'translation':params.get('mode')==='text'?'text':'questions':'evidence';
 };
 window.addEventListener('hashchange',topic);window.addEventListener('viewchange',topic);topic();
})();
