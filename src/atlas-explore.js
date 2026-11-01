'use strict';
// Collection counts come from the same production corpus as their destinations.
(() => {
 const host=document.getElementById('explore-view');if(!host)return;
 host.className='lens-workspace phase2-page ux-explore';
 const topics=[['stories','Stories','Linked accounts','#stories'],['people','People','People in the text','#people'],['places','Places','Cities, lands and journeys','#places'],['commandments','Laws','Laws in context','#commandments'],['lost','Lost Books','Books beyond the 66','#lost']];
 const evidence=[['history','History','Ancient sources','#questions?mode=history'],['science','Science','Nature and the text','#questions?mode=science'],['timeline','Timeline','Events in context','#timeline'],['text','Text Comparisons','Linked passages','#questions?mode=text'],['translation','Translations','Wording choices','#questions?filter=T'],['questions','Contradictions','Different readings','#questions'],['prophecies','Prophecies','Read claims in context','#prophecies']];
 const paths={lost:'M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4ZM13 7a3 3 0 0 1 3-3h5v15h-4a4 4 0 0 0-4 2',stories:'M4 4h16v16H4zM4 12h16M12 4v8',people:'M16 21v-2a6 6 0 0 0-12 0v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M18 4a4 4 0 0 1 0 8M22 21v-2a6 6 0 0 0-3-5',places:'M12 22S4 14 4 9a8 8 0 0 1 16 0c0 5-8 13-8 13ZM12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6',commandments:'M5 3h14v18H5zM8 8h8M8 12h8M8 16h5',evidence:'m12 3 10 5-10 5L2 8ZM2 12l10 5 10-5M2 16l10 5 10-5',history:'M3 5h18v14H3zM7 9h10M7 13h6',science:'M9 3h6M10 3v7l-6 10h16l-6-10V3M8 15h8',timeline:'M12 3v18M5 7h14M5 17h14',text:'M3 4h7v16H3zM14 4h7v16h-7z',translation:'M3 5h12M9 3v2M5 9l8 8M12 5c0 6-4 9-9 12M14 21l4-10 4 10M16 17h4',questions:'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 4M12 18h.01',prophecies:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6'};
 const filters=[['all','All'],['topics','People & Stories'],['evidence','Evidence'],['manuscripts','Manuscripts']];
 const routeFilter=()=>new URLSearchParams(location.hash.split('?')[1]).get('section')==='evidence'?'evidence':'all';
 let counts=null,rendered=null,filter=routeFilter(),observers=[];
 const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 function connectLane(section){
  const row=section.querySelector('.ux-topic-row'),cards=[...row.querySelectorAll('.ux-topic')],pager=section.querySelector('.ux-lane-pages');
  let stops=[],active=0;
  function sync(){
   active=stops.reduce((best,value,index)=>Math.abs(value-row.scrollLeft)<Math.abs(stops[best]-row.scrollLeft)?index:best,0);
   for(const [index,button] of [...pager.children].entries())button.setAttribute('aria-current',String(index===active));
  }
  function move(index){row.scrollTo({left:stops[Math.max(0,Math.min(stops.length-1,index))]||0,behavior:reducedMotion()?'instant':'smooth'});}
  function measure(){
   const max=Math.max(0,row.scrollWidth-row.clientWidth),first=cards[0]?.offsetLeft||0;
   stops=[...new Set(cards.map(card=>Math.min(max,Math.max(0,card.offsetLeft-first))))];
   pager.replaceChildren(...stops.map((stop,index)=>{const button=document.createElement('button');button.type='button';button.className='ux-lane-page';button.setAttribute('aria-label','Show '+cards[index].querySelector('strong').textContent+' and following collections');button.innerHTML='<span aria-hidden="true"></span>';button.onclick=()=>move(index);return button;}));
   pager.hidden=stops.length<=1;sync();
  }
  row.addEventListener('scroll',sync,{passive:true});
  row.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();move(event.key==='Home'?0:event.key==='End'?stops.length-1:active+(event.key==='ArrowRight'?1:-1));});
  const observer=new ResizeObserver(measure);observer.observe(row);observers.push(observer);measure();
 }
 function updateCounts(){if(!counts)return;for(const tile of host.querySelectorAll('.ux-topic')){const badge=tile.querySelector('.ux-count'),value=counts[tile.dataset.topic];badge.textContent=value.toLocaleString();badge.setAttribute('aria-label',value.toLocaleString()+' records');}}

 function render(){
  const view=filter;
  if(rendered===view)return;rendered=view;
  observers.forEach(observer=>observer.disconnect());observers=[];
  const arrow=direction=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${direction==='left'?'m14 6-6 6 6 6':'m10 6 6 6-6 6'}"/></svg>`;
  const group=(id,name,rows)=>`<section class="ux-topic-section" aria-label="${name}"><div class="ux-lane-heading"><h2 id="ux-lane-${id}-title">${name}</h2></div><div class="ux-topic-row" id="ux-lane-${id}" role="group" aria-roledescription="carousel" aria-labelledby="ux-lane-${id}-title" tabindex="0">${rows.map(([key,label,subtitle,url])=>`<a class="ux-topic" id="ux-topic-${key}" data-topic="${key}" href="${url}" aria-label="${label}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[key]}"/></svg><span class="ux-count" aria-label="${counts?counts[key].toLocaleString()+' records':'Loading count'}">${counts?counts[key].toLocaleString():'…'}</span><div class="ux-tile-copy"><strong>${label}</strong><small>${subtitle}</small></div><span class="ux-browse" aria-hidden="true">Browse collection ${arrow('right')}</span></a>`).join('')}</div><div class="ux-lane-pages" role="group" aria-label="${name} positions"></div></section>`;
  const textTools=evidence.filter(([key])=>['text','translation'].includes(key));
  host.innerHTML=`<h1 tabindex="-1">Explore</h1><nav class="ux-explore-filters" aria-label="Explore collections">${filters.map(([key,label])=>`<button type="button" class="filter-pill" data-explore-filter="${key}" aria-pressed="${filter===key}">${label}</button>`).join('')}</nav>${['all','topics'].includes(filter)?group('topics','People, Places & Texts',topics):''}${['all','evidence'].includes(filter)?group('evidence','Evidence & Interpretations',evidence.filter(([key])=>key!=='prophecies')):''}${filter==='manuscripts'?'<p class="ux-manuscripts-intro">Explore ancient copies with these text and translation tools.</p>'+group('manuscripts','Text & Translation Tools',textTools):''}`;
  host.querySelectorAll('.ux-topic-section').forEach(connectLane);
 }
 fetch('/collection-counts.json?inspect=1').catch(()=>fetch('/collection-counts.json')).then(r=>{if(!r.ok)throw Error();return r.json();}).then(value=>{counts=value;render();updateCounts();}).catch(()=>{host.querySelectorAll('.ux-count').forEach(n=>{n.textContent='';n.setAttribute('aria-label','Count unavailable');});});
 host.addEventListener('click',event=>{const button=event.target.closest('[data-explore-filter]');if(!button)return;const left=button.parentElement.scrollLeft;filter=button.dataset.exploreFilter;render();updateCounts();host.querySelector('.ux-explore-filters').scrollLeft=left;const selected=host.querySelector(`[data-explore-filter="${filter}"]`);selected.focus({preventScroll:true});selected.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});});
 window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#discover')){filter=routeFilter();render();updateCounts();}});
 render();
 const topic=()=>{
  const hash=location.hash,params=new URLSearchParams(hash.split('?')[1]);
  document.body.dataset.topic=/^#(?:people|characters)/.test(hash)?'people':hash.startsWith('#stories')?'stories':hash.startsWith('#places')?'places':hash.startsWith('#commandments')?'commandments':hash.startsWith('#timeline')?'timeline':/^#(?:questions|debate)/.test(hash)?params.get('mode')==='history'?'history':params.get('mode')==='science'?'science':params.get('filter')==='T'?'translation':params.get('mode')==='text'?'text':'questions':'evidence';
 };
 window.addEventListener('hashchange',topic);window.addEventListener('viewchange',topic);topic();
})();
