'use strict';
// Collection counts come from the same production corpus as their destinations.
(() => {
 const host=document.getElementById('explore-view');if(!host)return;
 host.className='lens-workspace phase2-page ux-explore';
 const topics=[['stories','Stories','Read the stories','#stories'],['people','People','People in the text','#people'],['places','Places','Cities, lands and journeys','#places'],['commandments','Laws','Laws in context','#commandments'],['lost','Lost Books','Books beyond the 66','#lost']];
 const evidence=[['evidence','Evidence & Interpretations','Compare texts, sources and readings','#questions?mode=text'],['timeline','Timeline','Events in context','#timeline']];
 const paths={lost:'M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4ZM13 7a3 3 0 0 1 3-3h5v15h-4a4 4 0 0 0-4 2',stories:'M4 4h16v16H4zM4 12h16M12 4v8',people:'M16 21v-2a6 6 0 0 0-12 0v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M18 4a4 4 0 0 1 0 8M22 21v-2a6 6 0 0 0-3-5',places:'M12 22S4 14 4 9a8 8 0 0 1 16 0c0 5-8 13-8 13ZM12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6',commandments:'M5 3h14v18H5zM8 8h8M8 12h8M8 16h5',evidence:'m12 3 10 5-10 5L2 8ZM2 12l10 5 10-5M2 16l10 5 10-5',history:'M3 5h18v14H3zM7 9h10M7 13h6',science:'M9 3h6M10 3v7l-6 10h16l-6-10V3M8 15h8',timeline:'M12 3v18M5 7h14M5 17h14',text:'M3 4h7v16H3zM14 4h7v16h-7z',translation:'M3 5h12M9 3v2M5 9l8 8M12 5c0 6-4 9-9 12M14 21l4-10 4 10M16 17h4',questions:'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 4M12 18h.01',prophecies:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6'};
 const artwork=/*__EXPLORE_RENDITIONS__*/{};
 // Each journey reuses an existing, image-matched responsive rendition.
 const journeys=[
  {title:'Noah and the Flood',href:'#stories/genesis/noah-and-the-flood',art:'hero'},
  {title:'David and Goliath',href:'#stories/1-samuel/david-and-goliath',art:'people'},
  {title:'The Dedication of Jerusalem’s Wall',href:'#stories/nehemiah/the-dedication-of-jerusalem-s-wall',art:'places'},
  {title:'The Scroll Burned',href:'#stories/jeremiah/the-scroll-burned',art:'lost'},
 ];
 const journeyKey='biblelens-explore-journey-v1';
 function chooseJourney(){
  let previous;try{previous=window.sessionStorage.getItem(journeyKey);}catch{}
  const choices=journeys.filter(journey=>journey.href!==previous);
  const journey=choices[Math.floor(Math.random()*choices.length)];
  try{window.sessionStorage.setItem(journeyKey,journey.href);}catch{}
  return journey;
 }
 // Pick once per document, not when counts arrive or Explore is revisited.
 const featuredJourney=chooseJourney();
 const routeScope=()=>new URLSearchParams(location.hash.split('?')[1]).get('section')==='evidence'?'evidence':'all';
 let counts=null,rendered=null,scope=routeScope();
 // Reading habits are explicitly marked and kept locally, separate from synced notes.
 const habitKey='biblelens-explore-reading-v1';
 const plans=[{title:'Start in Genesis',readings:[['genesis-1','Genesis 1',0,1],['genesis-2','Genesis 2',0,2],['genesis-3','Genesis 3',0,3]]},{title:'Wisdom and reflection',readings:[['psalms-23','Psalms 23',18,23],['proverbs-3','Proverbs 3',19,3],['ecclesiastes-3','Ecclesiastes 3',20,3]]}];
 const dailyVerses=[['Psalms 23:1',18,23,1],['Proverbs 3:5',19,3,5],['Ecclesiastes 3:1',20,3,1],['Micah 6:8',32,6,8],['Matthew 5:9',39,5,9],['Luke 6:31',41,6,31],['John 1:5',42,1,5]];
 const dayKey=(date=new Date())=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
 function habits(){
  try{const value=JSON.parse(localStorage.getItem(habitKey)||'{}');return {days:Array.isArray(value?.days)?value.days.filter(d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)).slice(-400):[],done:Array.isArray(value?.done)?value.done.filter(id=>plans.some(p=>p.readings.some(r=>r[0]===id))):[]};}catch{return {days:[],done:[]};}
 }
 function streak(value=habits(),now=new Date()){
  const cursor=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);
  if(!value.days.includes(dayKey(cursor)))cursor.setDate(cursor.getDate()-1);
  let count=0;while(value.days.includes(dayKey(cursor))&&count<400){count++;cursor.setDate(cursor.getDate()-1);}return count;
 }
 function dailyVerse(){const today=new Date(),day=Math.floor(Date.UTC(today.getFullYear(),today.getMonth(),today.getDate())/86400000);return dailyVerses[day%dailyVerses.length];}
 function quickActions(){return `<nav class="explore-quick-actions" aria-label="Reading shortcuts"><button type="button" data-explore-quick="streak" aria-haspopup="dialog"><span aria-hidden="true">🔥</span> Daily Streak <strong data-explore-streak>(${streak()}d)</strong></button><button type="button" data-explore-quick="plans" aria-haspopup="dialog"><span aria-hidden="true">📖</span> Reading Plans</button><button type="button" data-explore-quick="verse" aria-haspopup="dialog"><span aria-hidden="true">💡</span> Verse of the Day</button></nav>`;}
 function connectQuickActions(){
  const dialog=host.querySelector('#explore-quick-dialog');if(!dialog)return;
  const title=dialog.querySelector('h2'),body=dialog.querySelector('[data-quick-body]'),status=dialog.querySelector('[role=status]');let selected='streak';
  function paint(){
   const value=habits();status.textContent='';
   if(selected==='plans'){
    title.textContent='Reading Plans';body.innerHTML='<p>Choose a short path through the text. Read at your own pace.</p>'+plans.map(plan=>`<section><h3>${plan.title}</h3><ol>${plan.readings.map(([id,label,book,chapter],index)=>`<li><a href="#read/${book}/${chapter}"><small>Day ${index+1}</small>${label} →</a><label><input type="checkbox" data-plan-done="${id}" ${value.done.includes(id)?'checked':''}> Mark read</label></li>`).join('')}</ol></section>`).join('');
   }else if(selected==='verse'){
    const [label,book,chapter,verse]=dailyVerse();title.textContent='Verse of the Day';body.innerHTML=`<p>A daily starting point. Open the chapter to read the verse in context.</p><a class="explore-quick-primary" href="#read/${book}/${chapter}/${verse}">${label} →</a><button type="button" data-mark-day ${value.days.includes(dayKey())?'disabled':''}>${value.days.includes(dayKey())?'Today is marked read':'Mark today as read'}</button>`;
   }else{title.textContent='Daily Streak';body.innerHTML=`<p class="explore-streak-total">${streak(value)} <span>consecutive days</span></p><p>Mark a day after you read. A missed day starts a new streak.</p><button type="button" data-mark-day ${value.days.includes(dayKey())?'disabled':''}>${value.days.includes(dayKey())?'Today is marked read':'Mark today as read'}</button>`;}
  }
  function save(value){try{localStorage.setItem(habitKey,JSON.stringify(value));host.querySelector('[data-explore-streak]').textContent=`(${streak(value)}d)`;return true;}catch{status.textContent='Progress could not be saved on this device. Please try again.';return false;}}
  host.querySelectorAll('[data-explore-quick]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.exploreQuick;paint();dialog.showModal();}));
  dialog.querySelector('[data-quick-close]').onclick=()=>dialog.close();
  dialog.addEventListener('click',event=>{if(event.target.closest('a[href]'))dialog.close();if(event.target.closest('[data-mark-day]')){const value=habits();value.days=[...new Set([...value.days,dayKey()])].sort().slice(-400);if(save(value))paint();}});
  dialog.addEventListener('change',event=>{const id=event.target.dataset.planDone;if(!id)return;const value=habits();value.done=value.done.filter(item=>item!==id);if(event.target.checked){value.done.push(id);value.days=[...new Set([...value.days,dayKey()])].sort().slice(-400);}if(!save(value))event.target.checked=!event.target.checked;});
 }
 let imageObserver,imageFrame,priorityAssigned=false;
 function imageMarkup(role,artRole=role){
  const art=artwork[artRole];if(!art)throw Error('Missing Explore rendition: '+role);
  const sizes=role==='hero'?'(min-width:1000px) 800px, 80vw':'(min-width:1100px) 220px, (min-width:760px) 29vw, 44vw';
  return `<img data-explore-image="${role}" data-explore-src="/assets/${art.small.file}" data-explore-srcset="/assets/${art.small.file} ${art.small.width}w, /assets/${art.large.file} ${art.large.width}w" sizes="${sizes}" width="${art.large.width}" height="${art.large.height}" alt="" decoding="async" loading="lazy">`;
 }
 function observeImages(){
  const images=[...host.querySelectorAll('img[data-explore-image]')];if(!images.length)return;
  imageObserver?.disconnect();imageObserver=null;
  if(host.hidden||!host.getClientRects().length)return;
  const visible=image=>{const r=image.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;};
  const activate=image=>{
   if(host.hidden||!visible(image))return;
   image.sizes=Math.ceil(image.getBoundingClientRect().width)+'px';
   if(!image.dataset.exploreSrc)return;
   if(!priorityAssigned){image.setAttribute('fetchpriority','high');image.loading='eager';priorityAssigned=true;}
   image.srcset=image.dataset.exploreSrcset;image.src=image.dataset.exploreSrc;
   delete image.dataset.exploreSrc;delete image.dataset.exploreSrcset;
  };
  images.filter(visible).forEach(activate);
  if('IntersectionObserver' in window){imageObserver=new IntersectionObserver(entries=>{if(host.hidden)return;entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top||a.boundingClientRect.left-b.boundingClientRect.left).forEach(entry=>activate(entry.target));},{rootMargin:'0px'});images.forEach(image=>imageObserver.observe(image));}
 }
 function scheduleImages(){cancelAnimationFrame(imageFrame);imageFrame=requestAnimationFrame(observeImages);}
 function updateCounts(){if(!counts)return;for(const tile of host.querySelectorAll('.ux-topic')){const badge=tile.querySelector('.ux-count'),value=counts[tile.dataset.topic];badge.textContent=value.toLocaleString();badge.setAttribute('aria-label',value.toLocaleString()+' records');}}

 function render(){
  const view=scope;
  if(rendered===view)return;rendered=view;
  imageObserver?.disconnect();priorityAssigned=false;

  const arrow=direction=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${direction==='left'?'m14 6-6 6 6 6':'m10 6 6 6-6 6'}"/></svg>`;
  const group=(id,name,rows)=>`<section class="ux-topic-section" aria-label="${name}"><div class="ux-lane-heading"><h2 id="ux-lane-${id}-title">${name}</h2></div><div class="ux-topic-row" id="ux-lane-${id}" role="group" aria-labelledby="ux-lane-${id}-title">${rows.map(([key,label,subtitle,url])=>`<a class="ux-topic" id="ux-topic-${key}" data-topic="${key}" href="${url}" aria-label="${label}">${imageMarkup(key)}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[key]}"/></svg><span class="ux-count" aria-label="${counts?counts[key].toLocaleString()+' records':'Loading count'}">${counts?counts[key].toLocaleString():'…'}</span><div class="ux-tile-copy"><strong>${label}</strong><small>${subtitle}</small></div><span class="ux-browse" aria-hidden="true">Browse collection ${arrow('right')}</span></a>`).join('')}</div></section>`;
  host.innerHTML=`<h1 class="browse-heading" tabindex="-1">Explore</h1><p class="browse-intro">Find a place to start. Follow what interests you.</p><form id="ux-explore-search-form" class="ux-explore-search" role="search" aria-label="Search zLenz: Bible"><label class="sr-only" for="ux-explore-search">Search scripture, people and evidence</label><input id="ux-explore-search" type="search" maxlength="300" required enterkeyhint="search" autocomplete="off" placeholder="Search scripture"><div class="explore-search-shortcuts"><a href="#questions?mode=text" aria-label="Compare ancient texts" title="Compare ancient texts"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M7 4h12a2 2 0 0 1 2 2v2h-4M7 4a2 2 0 0 0-2 2v12H3v2h12a2 2 0 0 0 2-2V6a2 2 0 0 1 2-2M8 9h6M8 13h6"/></svg></a><a href="#read" aria-label="Open scripture" title="Open scripture"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 6v15M3 4h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5v15h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z"/></svg></a></div><button type="submit" class="lens-button ux-explore-submit" aria-label="Search" title="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg></button><span class="sr-only" id="ux-explore-search-status" role="status"></span></form>${scope==='all'?'<a class="browse-feature" href="'+featuredJourney.href+'">'+imageMarkup('hero',featuredJourney.art)+'<span><small>Featured Story</small><strong>'+featuredJourney.title.toUpperCase()+'</strong></span></a>':''}${quickActions()}${scope==='evidence'?group('evidence','Evidence & Interpretations',evidence):group('collections','Collections',[...topics,...evidence])}<dialog id="explore-quick-dialog" aria-labelledby="explore-quick-title"><div class="explore-quick-heading"><h2 id="explore-quick-title"></h2><button type="button" data-quick-close aria-label="Close reading shortcut">×</button></div><div data-quick-body></div><p class="explore-local-note">Reading progress stays on this device.</p><p role="status" aria-live="polite"></p></dialog>`;
  connectQuickActions();
  if(host.querySelectorAll('img[data-explore-image]').length)scheduleImages();
  const form=host.querySelector('#ux-explore-search-form'),input=host.querySelector('#ux-explore-search'),status=host.querySelector('#ux-explore-search-status');
  form.onsubmit=event=>{event.preventDefault();const query=input.value.trim();if(!query){status.textContent='Enter a Bible reference or keywords to search.';input.focus();return;}window.BibleLensWorkspace.search(query);};
  input.addEventListener('input',()=>{status.textContent='';});
  input.addEventListener('keydown',event=>{if(event.key==='Escape'&&input.value){event.preventDefault();input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));}});

 }
 fetch('/collection-counts.json?inspect=1').catch(()=>fetch('/collection-counts.json')).then(r=>{if(!r.ok)throw Error();return r.json();}).then(value=>{counts=value;render();updateCounts();}).catch(()=>{host.querySelectorAll('.ux-count').forEach(n=>{n.textContent='';n.setAttribute('aria-label','Count unavailable');});});
 window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#discover')){scope=routeScope();render();updateCounts();}});
 render();
 window.addEventListener('viewchange',()=>{if(host.hidden){imageObserver?.disconnect();cancelAnimationFrame(imageFrame);}else scheduleImages();});
 window.addEventListener('resize',scheduleImages);window.addEventListener('scroll',scheduleImages,{passive:true});
 window.addEventListener('hashchange',()=>host.querySelector('#explore-quick-dialog')?.close());
 function refreshStreak(){const badge=host.querySelector('[data-explore-streak]');if(badge)badge.textContent=`(${streak()}d)`;}
 window.addEventListener('storage',event=>{if(event.key===habitKey)refreshStreak();});
 window.addEventListener('focus',refreshStreak);
 const topic=()=>{
  const hash=location.hash,params=new URLSearchParams(hash.split('?')[1]);
  document.body.dataset.topic=/^#(?:people|characters)/.test(hash)?'people':hash.startsWith('#stories')?'stories':hash.startsWith('#places')?'places':hash.startsWith('#commandments')?'commandments':hash.startsWith('#timeline')?'timeline':/^#(?:questions|debate)/.test(hash)?params.get('mode')==='history'?'history':params.get('mode')==='science'?'science':params.get('filter')==='T'?'translation':params.get('mode')==='text'?'text':'questions':'evidence';
 };
 window.addEventListener('hashchange',topic);window.addEventListener('viewchange',topic);topic();
})();
