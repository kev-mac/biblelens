'use strict';
// Collection counts come from the same production corpus as their destinations.
(() => {
 const host=document.getElementById('explore-view');if(!host)return;
 host.className='lens-workspace phase2-page ux-explore';
 const topics=[['stories','Stories','Linked accounts','#stories'],['people','People','People in the text','#people'],['places','Places','Cities, lands and journeys','#places'],['commandments','Laws','Laws in context','#commandments'],['lost','Lost Books','Books beyond the 66','#lost']];
 const evidence=[['evidence','Evidence & Interpretations','Compare texts, sources and readings','#questions?mode=text'],['timeline','Timeline','Events in context','#timeline']];
 const textTools=[['text','Text Comparisons','Linked passages','#questions?mode=text'],['translation','Translations','Wording choices','#questions?filter=T']];
 const paths={lost:'M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4ZM13 7a3 3 0 0 1 3-3h5v15h-4a4 4 0 0 0-4 2',stories:'M4 4h16v16H4zM4 12h16M12 4v8',people:'M16 21v-2a6 6 0 0 0-12 0v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M18 4a4 4 0 0 1 0 8M22 21v-2a6 6 0 0 0-3-5',places:'M12 22S4 14 4 9a8 8 0 0 1 16 0c0 5-8 13-8 13ZM12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6',commandments:'M5 3h14v18H5zM8 8h8M8 12h8M8 16h5',evidence:'m12 3 10 5-10 5L2 8ZM2 12l10 5 10-5M2 16l10 5 10-5',history:'M3 5h18v14H3zM7 9h10M7 13h6',science:'M9 3h6M10 3v7l-6 10h16l-6-10V3M8 15h8',timeline:'M12 3v18M5 7h14M5 17h14',text:'M3 4h7v16H3zM14 4h7v16h-7z',translation:'M3 5h12M9 3v2M5 9l8 8M12 5c0 6-4 9-9 12M14 21l4-10 4 10M16 17h4',questions:'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 4M12 18h.01',prophecies:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6'};
 const artwork={
  stories:'explore-ark.webp',
  people:'story-david-and-goliath-v1.webp',
  places:'story-the-dedication-of-jerusalem-s-wall-v1.webp',
  commandments:'explore-commandments.webp',
  lost:'story-the-scroll-burned-v1.webp',
  evidence:'explore-evidence.webp',
  timeline:'explore-timeline.webp',
  text:'story-ezra-reads-the-law-v1.webp',
  translation:'story-the-tower-of-babel-v1.webp',
 };
 const routeScope=()=>new URLSearchParams(location.hash.split('?')[1]).get('section')==='evidence'?'evidence':'all';
 let counts=null,rendered=null,scope=routeScope(),observers=[];
 const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 function connectLane(section){
  const row=section.querySelector('.ux-topic-row'),cards=[...row.querySelectorAll('.ux-topic')],pager=section.querySelector('.ux-lane-pages');
  let stops=[],active=0;
  function sync(){
   active=stops.reduce((best,value,index)=>Math.abs(value-row.scrollLeft)<Math.abs(stops[best]-row.scrollLeft)?index:best,0);
   for(const [index,button] of [...pager.children].entries()){
    const centered=index===active;
    button.setAttribute('aria-current',String(centered));
    cards[index].classList.toggle('ux-topic-centered',centered);
   }
  }
  const stopFor=card=>Math.max(0,Math.min(row.scrollWidth-row.clientWidth,card.offsetLeft+(card.offsetWidth-row.clientWidth)/2));
  function move(index){
   const card=cards[Math.max(0,Math.min(cards.length-1,index))];
   if(card)row.scrollTo({left:stopFor(card),behavior:reducedMotion()?'instant':'smooth'});
  }
  function measure(){
   if(!row.clientWidth)return;
   stops=cards.map(stopFor);
   pager.replaceChildren(...stops.map((stop,index)=>{const button=document.createElement('button');button.type='button';button.className='ux-lane-page';button.setAttribute('aria-label','Show '+cards[index].querySelector('strong').textContent+' and following collections');button.innerHTML='<span aria-hidden="true"></span>';button.onclick=()=>move(index);return button;}));
   pager.hidden=stops.length<=1;row.scrollTo({left:stops[Math.min(active,stops.length-1)]||0,behavior:'instant'});sync();
  }
  row.addEventListener('scroll',sync,{passive:true});
  row.addEventListener('focusin',event=>{const index=cards.indexOf(event.target);if(index>=0&&event.target.matches(':focus-visible'))move(index);});
  row.addEventListener('click',event=>{
   const index=cards.indexOf(event.target.closest('.ux-topic'));
   if(index<0||index===active||event.detail===0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   event.preventDefault();move(index);
  });
  row.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();move(event.key==='Home'?0:event.key==='End'?stops.length-1:active+(event.key==='ArrowRight'?1:-1));});
  const observer=new ResizeObserver(measure);observer.observe(row);observers.push(observer);measure();
 }
 function updateCounts(){if(!counts)return;for(const tile of host.querySelectorAll('.ux-topic')){const badge=tile.querySelector('.ux-count'),value=counts[tile.dataset.topic];badge.textContent=value.toLocaleString();badge.setAttribute('aria-label',value.toLocaleString()+' records');}}

 function render(){
  const view=scope;
  if(rendered===view)return;rendered=view;
  observers.forEach(observer=>observer.disconnect());observers=[];
  const arrow=direction=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${direction==='left'?'m14 6-6 6 6 6':'m10 6 6 6-6 6'}"/></svg>`;
  const group=(id,name,rows)=>`<section class="ux-topic-section" aria-label="${name}"><div class="ux-lane-heading"><h2 id="ux-lane-${id}-title">${name}</h2></div><div class="ux-topic-row" id="ux-lane-${id}" role="group" aria-roledescription="carousel" aria-labelledby="ux-lane-${id}-title" tabindex="0">${rows.map(([key,label,subtitle,url])=>`<a class="ux-topic" id="ux-topic-${key}" data-topic="${key}" href="${url}" aria-label="${label}"><img src="/assets/${artwork[key]}" alt="" decoding="async"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[key]}"/></svg><span class="ux-count" aria-label="${counts?counts[key].toLocaleString()+' records':'Loading count'}">${counts?counts[key].toLocaleString():'…'}</span><div class="ux-tile-copy"><strong>${label}</strong><small>${subtitle}</small></div><span class="ux-browse" aria-hidden="true">Browse collection ${arrow('right')}</span></a>`).join('')}</div><div class="ux-lane-pages" role="group" aria-label="${name} positions"></div></section>`;
  host.innerHTML=`<h1 class="sr-only" tabindex="-1">Explore</h1><form id="ux-explore-search-form" class="ux-explore-search" role="search" aria-label="Search BibleLens"><label class="sr-only" for="ux-explore-search">Search scripture, people and evidence</label><input id="ux-explore-search" type="search" maxlength="300" required enterkeyhint="search" autocomplete="off" placeholder="Search scripture, people, or evidence"><button type="submit" class="lens-button">Search</button><span class="sr-only" id="ux-explore-search-status" role="status"></span></form>${scope==='evidence'?group('evidence','Evidence & Interpretations',evidence):group('collections','Collections',[...topics,...evidence])+group('manuscripts','Text & Translation Tools',textTools)}`;
  const form=host.querySelector('#ux-explore-search-form'),input=host.querySelector('#ux-explore-search'),status=host.querySelector('#ux-explore-search-status');
  form.onsubmit=event=>{event.preventDefault();const query=input.value.trim();if(!query){status.textContent='Enter a Bible reference or keywords to search.';input.focus();return;}window.BibleLensWorkspace.search(query);};
  input.addEventListener('input',()=>{status.textContent='';});
  input.addEventListener('keydown',event=>{if(event.key==='Escape'&&input.value){event.preventDefault();input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));}});
  host.querySelectorAll('.ux-topic-section').forEach(connectLane);
 }
 fetch('/collection-counts.json?inspect=1').catch(()=>fetch('/collection-counts.json')).then(r=>{if(!r.ok)throw Error();return r.json();}).then(value=>{counts=value;render();updateCounts();}).catch(()=>{host.querySelectorAll('.ux-count').forEach(n=>{n.textContent='';n.setAttribute('aria-label','Count unavailable');});});
 window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#discover')){scope=routeScope();render();updateCounts();}});
 render();
 const topic=()=>{
  const hash=location.hash,params=new URLSearchParams(hash.split('?')[1]);
  document.body.dataset.topic=/^#(?:people|characters)/.test(hash)?'people':hash.startsWith('#stories')?'stories':hash.startsWith('#places')?'places':hash.startsWith('#commandments')?'commandments':hash.startsWith('#timeline')?'timeline':/^#(?:questions|debate)/.test(hash)?params.get('mode')==='history'?'history':params.get('mode')==='science'?'science':params.get('filter')==='T'?'translation':params.get('mode')==='text'?'text':'questions':'evidence';
 };
 window.addEventListener('hashchange',topic);window.addEventListener('viewchange',topic);topic();
})();
