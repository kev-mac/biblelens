'use strict';
(() => {
 const el=id=>document.getElementById(id);
 let pendingFocus=null,focusObserver=null,focusFrame=0;
 function clearPageFocus(){pendingFocus=null;focusObserver?.disconnect();focusObserver=null;cancelAnimationFrame(focusFrame);focusFrame=0;}
 function schedulePageFocus(){
  if(!pendingFocus||focusFrame)return;
  focusFrame=requestAnimationFrame(()=>{
   focusFrame=0;
   if(!pendingFocus)return;
   if(pendingFocus.hash!==location.hash||navigationRestore){clearPageFocus();return;}
   if(el('main').hasAttribute('aria-busy'))return;
   const pageHeading=el(view+'-view')?.querySelector('h1');
   const heading=view==='read'?el('ux-chapter-picker'):pageHeading?.getClientRects().length?pageHeading:contextNav.querySelector('h1');
   if(!heading||heading.closest('[hidden]'))return;
   // A cold feature may insert its heading after the first route frame.
   // Preserve a deliberate focus change made while that feature was loading.
   const active=document.activeElement;
   if(active!==document.body&&active!==pendingFocus.opener){clearPageFocus();return;}
   clearPageFocus();if(heading.tagName!=='BUTTON')heading.tabIndex=-1;heading.focus({preventScroll:true});
  });
 }
 function requestPageFocus(hash){
  pendingFocus={hash,opener:document.activeElement};
  focusObserver=new MutationObserver(schedulePageFocus);
  focusObserver.observe(el('main'),{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','aria-busy']});
  schedulePageFocus();
 }
 window.addEventListener('biblelens:featuresready',schedulePageFocus);
 window.addEventListener('viewchange',schedulePageFocus);
 window.addEventListener('popstate',clearPageFocus);
 window.addEventListener('hashchange',()=>{if(pendingFocus&&pendingFocus.hash!==location.hash)clearPageFocus();});
 const routeTo = hash => {
 if(hash.startsWith('#search')&&view!=='search')searchParent=primary();
 const navigate=()=>{clearPageFocus();const oldURL=location.href;navigateHash(hash);window.dispatchEvent(new HashChangeEvent('hashchange',{oldURL,newURL:location.href}));const destination=location.hash;if(!/^#(?:read|compare|investigation|study|characters|people)\//.test(destination)&&!destination.startsWith('#compare')&&!(destination.startsWith('#notebook?')&&new URLSearchParams(destination.split('?')[1]).has('note'))){window.scrollTo({top:0,behavior:'instant'});requestPageFocus(destination);}};
 // setView owns route transitions, including browser history and cold routes.
 navigate();
 };
 document.body.classList.add('lens-app');
 document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();routeTo('#search');}if(event.key==='Tab')document.body.classList.add('keyboard-navigation');});
 document.addEventListener('pointerdown',()=>document.body.classList.remove('keyboard-navigation'));
 const masthead = el('lensMasthead');
 el('reader-settings').addEventListener('close', () => el('lens-settings').focus({preventScroll:true}));
 // Top-layer source panels must stay outside the collapsed legacy headings.
 for(const id of ['ux-commandment-info','ux-timeline-info']){const panel=el(id);if(panel)document.body.append(panel);}
 const main = el('main');
 const contextNav=document.createElement('nav');contextNav.className='lens-context';contextNav.setAttribute('aria-label','Page navigation');contextNav.hidden=true;main.prepend(contextNav);
 let searchParent='explore';
 const labels={read:'Read',explore:'Explore',debates:'Contradictions',debate:'Question',notebook:'Saved',search:'Search',stories:'Events',characters:'People',places:'Places',evidence:'Text Comparisons',timeline:'Timeline',commandments:'Laws',prophecies:'Prophecies',method:'Method & Sources',chat:'Ask the Text'};
 const roots={read:'#read',explore:'#discover',debates:'#questions',notebook:'#notebook'};
 function primary(){
  if(view==='search'||view==='chat')return searchParent;
  if(['read','notebook'].includes(view))return view;
  return 'explore';
 }
 function back(fallback){if(history.state?.biblelens?.from&&history.state.biblelens.from!==location.hash)history.back();else routeTo(fallback);}
 function updateContext(){
  if(el('main').hasAttribute('aria-busy')){
   const title=el('route-loading')?.dataset.destinationLabel||'Opening this screen…';
   contextNav.hidden=false;if(contextNav.querySelector('h1')?.textContent!==title)contextNav.innerHTML='<h1 tabindex="-1" aria-current="page">'+esc(title)+'</h1>';
   document.title=title+' · BibleLens';el('lens-settings').setAttribute('aria-label','Settings for '+title);return;
  }
  const active=primary();
  for(const link of masthead.querySelectorAll('[data-lens-view]')){if(link.dataset.lensView===active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
  const host=el(view+'-view');if(!host)return;
  const pageHeading=host.querySelector('h1');
  if(view==='read'&&pageHeading){const readerTitle=/^#(?:compare|investigation)/.test(location.hash)?'Compare Passages':'Read';if(pageHeading.textContent!==readerTitle)pageHeading.textContent=readerTitle;}
  let title=pageHeading?.textContent.trim()||labels[view]||'BibleLens';
  if(/^#(?:compare|investigation)/.test(location.hash))title='Compare Passages';
  if(/^#stories\//.test(location.hash))title=host.querySelector('.story-card h2')?.textContent.trim()||title;
  const top=['read','explore','notebook'].includes(view)&&!/^#(?:compare|investigation|study)/.test(location.hash);
  contextNav.hidden=top;
  if(!top){
   const root=active==='debates'?'Questions':labels[active],rootHash=roots[active];
   const questions=view==='debate'||view==='debates'&&(location.hash==='#questions'||location.hash.includes('draft=1'));
   const detail=questions?'<a href="#discover?section=evidence">Evidence</a><span aria-hidden="true">›</span>'+(view==='debate'?'<a href="#questions">Questions</a><span aria-hidden="true">›</span>':''):'';
   const html='<button type="button" data-ux-back aria-label="Back">‹</button><h1 tabindex="-1" aria-current="page">'+esc(title)+'</h1>';
   const headingHadFocus=document.activeElement===pageHeading||document.activeElement===contextNav.querySelector('h1');
   host.classList.add('ux-compact-interior');
   if(!contextNav.querySelector('h1')||contextNav.querySelector('h1').textContent!==title)contextNav.innerHTML=html;
   if(headingHadFocus)contextNav.querySelector('h1').focus({preventScroll:true});
   contextNav.dataset.fallback=rootHash;
  }
  const profileTitle=document.querySelector('#character-sheet[open] #character-detail-name')?.textContent;
  document.title=(profileTitle||title)+' · BibleLens';el('lens-settings').setAttribute('aria-label','Settings for '+(view==='read'?el('ux-chapter-picker')?.textContent.trim()||'Read':profileTitle||title));
 }
 contextNav.addEventListener('click',event=>{if(event.target.closest('[data-ux-back]')){back(contextNav.dataset.fallback);return;}const link=event.target.closest('a');if(!link||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();routeTo(link.hash);});
 document.addEventListener('click',event=>{if(event.target.closest('[data-ux-commandment-filters]'))el('commandments-more').click();if(event.target.closest('.ux-search'))searchParent=primary();if(event.target.closest('[data-open-settings]'))el('lens-settings').click();});
 window.addEventListener('viewchange',updateContext);
 window.addEventListener('hashchange',()=>requestAnimationFrame(updateContext));
 // Lazy views render their titles after viewchange. Observe only page content,
 // excluding our breadcrumb itself, so async titles never leave stale paths.
 const observer=new MutationObserver(records=>{if(records.some(record=>!contextNav.contains(record.target)))requestAnimationFrame(updateContext);});
 observer.observe(main,{childList:true,subtree:true,characterData:true});
 // Sheets are inline tasks. Keep async profile titles and reused sheets current.
 function dialogPaths(){for(const dialog of document.querySelectorAll('dialog[open]')){
  if(dialog.id==='lens-inspector-sheet'||dialog.id==='lens-search-overlay'||dialog.id==='ux-alphabet-sheet'){dialog.querySelector('.ux-dialog-path')?.remove();continue;}
  const title=[...dialog.querySelectorAll('h1,h2,h3')].find(node=>!node.closest('[hidden]'))?.textContent.trim()||dialog.getAttribute('aria-label')||'Details';
  let nav=dialog.querySelector('.ux-dialog-path');
  if(!nav){nav=document.createElement('nav');nav.className='ux-dialog-path';nav.setAttribute('aria-label','Breadcrumb');const button=document.createElement('button');button.type='button';button.textContent='←';button.setAttribute('aria-label','Back');button.onclick=()=>dialog.close();nav.append(button,document.createElement('span'));dialog.prepend(nav);}
  const collection={characters:'People',places:'Places',stories:'Events',commandments:'Laws',prophecies:'Prophecies',timeline:'History & Timeline'}[view];
  const path=[primary()==='debates'?'Questions':labels[primary()]||'Explore',collection,title].filter(Boolean).join(' › ');
  if(nav.lastElementChild.textContent!==path)nav.lastElementChild.textContent=path;
 }}
 const dialogObserver=new MutationObserver(records=>{if(records.some(record=>!record.target.closest?.('.ux-dialog-path')))requestAnimationFrame(()=>{dialogPaths();updateContext();});});
 dialogObserver.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['open']});
 const aboutHeading=el('method-view')?.querySelector('h1');if(aboutHeading)aboutHeading.textContent='Method & Sources';
 const footerLink=document.querySelector('body > footer .brand');if(footerLink){footerLink.textContent='Method & Sources';footerLink.setAttribute('aria-label','BibleLens Method & Sources');}
 function section(id, html) {const node = document.createElement('section'); node.id = id + '-view'; node.className = 'lens-workspace'; node.hidden = true; node.innerHTML = html; main.append(node); return node;}
 const heading = (kicker, title, copy) => `<div class="lens-page-heading"><span class="lens-kicker">${kicker}</span><h1 tabindex="-1">${title}</h1><p>${copy}</p></div>`;
 section('explore','');

 function shellRoute(hash){if(!hash||hash==='#'||hash.split('?')[0]==='#discover'){setView('explore',false);return true;}return false;}
 window.BibleLensWorkspace={navigate:routeTo,route:shellRoute};
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');if(!link||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.classList.contains('skip')||link.hasAttribute('data-cite'))return;
  if(link.closest('.lens-masthead,.lens-workspace,#lensComparison,.lens-context')){event.preventDefault();routeTo(link.getAttribute('href'));}
 });
 route();
})();

// Search fields retain their existing handlers; clearing fires the same input event.
(() => {
 const strips=new WeakSet();
 const overflow=strip=>{strip.classList.toggle('ux-overflow-right',strip.scrollWidth-strip.clientWidth-strip.scrollLeft>2);strip.classList.toggle('ux-overflow-left',strip.scrollLeft>2);};
 function enhance(){for(const strip of document.querySelectorAll('.stories-filters,.ux-interior-chips,.directory-categories,.ux-context-tabs,.phase2-modes,.phase2-chips,.lens-notebook-tools>div,.tabs,.reader-category-filters,.reader-filter-chips,.commandments-quick,.prophecy-quick,.chips,.filters,.comparison-tabs,#comparison-status,.ux-quick-links,.phase2-rail')){if(!strips.has(strip)){strips.add(strip);strip.addEventListener('scroll',()=>overflow(strip),{passive:true});new ResizeObserver(()=>overflow(strip)).observe(strip);}overflow(strip);}
 for(const input of document.querySelectorAll('input[type="search"]')){
  let wrap=input.parentElement;
  if(!wrap.classList.contains('ux-search-field')){
   wrap=document.createElement('div');wrap.className='ux-search-field';input.before(wrap);wrap.append(input);
   const clear=document.createElement('button');clear.type='button';clear.className='ux-search-clear';clear.textContent='×';clear.setAttribute('aria-label','Clear search');clear.title='Clear search';
   clear.onclick=()=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();clear.hidden=true;};wrap.append(clear);
   input.addEventListener('input',()=>{clear.hidden=!input.value;});
  }
  wrap.querySelector('.ux-search-clear').hidden=!input.value;
 }}
 new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});window.addEventListener('hashchange',enhance);enhance();
})();

// The directory canvas uses the Events components; collection modules keep
// ownership of their records, search, filters and pagination.
(()=>{
 const icon='<svg class="header-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/></svg>';
 const searchIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4-4"/></svg>';
 const filterIcon='<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 14h16M4 21h16"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="14" r="2"/></svg></span>';
 function prepareSearchBox(box){
  box.classList.add('stories-search-box');box.insertAdjacentHTML('afterbegin',searchIcon);const input=box.querySelector('input');input.classList.add('directory-search');
  const clear=document.createElement('button');clear.type='button';clear.className='directory-search-clear';clear.setAttribute('aria-label','Clear Search');clear.textContent='×';clear.hidden=!input.value;
  input.addEventListener('input',()=>{clear.hidden=!input.value;});clear.onclick=()=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();};box.append(clear);
 }
 function mount(id,section){
  const host=document.getElementById(id),heading=host?.querySelector('.page-heading h1');
  if(!heading||host.dataset.directoryMounted)return;
  host.dataset.directoryMounted='true';host.dataset.directorySection=section;host.classList.add('directory-hub');
  const oldHeading=heading.closest('.page-heading'),header=document.createElement('header');header.className='stories-header';
  header.innerHTML='<a class="back-action" href="#discover" aria-label="Back to Explore">‹ Explore</a><div class="header-center-title">'+icon+'</div>';
  const glyph=document.querySelector('#navigation-icons')?.content.querySelector('[data-navigation-icon="'+({people:'characters',commandments:'commandments',evidence:'evidence'}[section]||'')+'"]');
  if(glyph){const copy=glyph.cloneNode(true);copy.classList.add('header-icon-svg');header.querySelector('.header-icon-svg').replaceWith(copy);}
  if(section==='places')header.querySelector('.header-icon-svg').innerHTML='<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>';
  heading.classList.add('directory-heading');header.querySelector('.header-center-title').append(heading);
  let filter=host.querySelector('#commandments-more,#marked-filter-top,[data-debate-filters],[data-accepted-filters]');
  if(!filter){
   filter=document.createElement('button');filter.type='button';filter.setAttribute('aria-label','Filter '+heading.textContent);filter.setAttribute('aria-haspopup','dialog');
   const sheet=document.createElement('dialog');sheet.className='stories-filter-sheet';sheet.dataset.directorySection=section;
   sheet.id=id+'-filters';sheet.innerHTML='<div class="stories-sheet-heading"><h2>Filter '+heading.textContent+'</h2><button type="button" aria-label="Close filters">×</button></div><div class="directory-categories"></div>';
   sheet.setAttribute('aria-label','Filter '+heading.textContent);filter.setAttribute('aria-controls',sheet.id);
   filter.onclick=()=>{const source=host.querySelector('.filter-carousel'),target=sheet.querySelector('.directory-categories');target.replaceChildren();for(const control of source?.querySelectorAll('button')||[]){const proxy=control.cloneNode(true);proxy.onclick=()=>{control.click();proxy.setAttribute('aria-pressed',control.getAttribute('aria-pressed'));proxy.classList.add('active');for(const sibling of target.children)if(sibling!==proxy){sibling.setAttribute('aria-pressed','false');sibling.classList.remove('active');}};target.append(proxy);}sheet.showModal();};
   sheet.querySelector('button').onclick=()=>sheet.close();document.body.append(sheet);
   window.addEventListener('viewchange',()=>{if(sheet.open)sheet.close();});
  }
  filter.classList.add('directory-filter-open');filter.innerHTML=filterIcon;header.append(filter);
  const content=document.createElement('div');content.className='stories-content';
  const searchBox=host.querySelector('.characters-search-box,#commandments-search-box');
  const chips=host.querySelector('.directory-categories');
  if(chips){chips.classList.add('filter-carousel');chips.remove();}
  if(searchBox){prepareSearchBox(searchBox);content.append(searchBox);}
  if(chips)content.append(chips);
  if(section==='evidence'&&id==='evidence-view'){
   const box=document.createElement('div');box.className='stories-search-box';box.innerHTML='<input id="directory-evidence-search" class="directory-search" type="search" aria-label="Search evidence records" placeholder="Search records, titles, references…">';if(typeof categorySearch==='string')box.querySelector('input').value=categorySearch;prepareSearchBox(box);content.append(box);
  }
  // Existing attribution and applicability copy belongs with the filters.
  const sheet=document.getElementById(filter.getAttribute('aria-controls'));
  if(section==='commandments'){
   const source=oldHeading.querySelector('.commandments-source');if(source){source.removeAttribute('popover');source.open=false;sheet?.querySelector('.commandments-sheet-scroll')?.prepend(source);}
   for(const p of oldHeading.querySelectorAll('p'))sheet?.querySelector('.commandments-sheet-scroll')?.prepend(p);
  }
  oldHeading.remove();for(const child of [...host.children])content.append(child);host.replaceChildren(header,content);
 }
 function enhance(){
  mount('characters-view','people');mount('places-view','places');mount('commandments-view','commandments');mount('debates-view','evidence');
  if(/^#evidence\//.test(location.hash))mount('evidence-view','evidence');
  for(const host of document.querySelectorAll('.directory-hub')){
   for(const box of host.querySelectorAll('.stories-search-box')){const input=box.querySelector('input'),clear=box.querySelector('.directory-search-clear');if(input&&clear)clear.hidden=!input.value;}
   for(const chip of host.querySelectorAll('.filter-carousel button')){chip.classList.add('filter-pill');chip.classList.toggle('active',chip.getAttribute('aria-pressed')==='true');}
   for(const row of host.querySelectorAll('.filter-carousel')){const selected=row.querySelector('.active,[aria-pressed=true]');if(selected){const r=selected.getBoundingClientRect(),box=row.getBoundingClientRect();if(r.left<box.left||r.right>box.right-16)row.scrollLeft+=r.left-box.left-Math.max(0,(box.width-r.width)/2);}}
   for(const result of host.querySelectorAll('.characters-count,#places-count,#commandments-count')){result.classList.add('directory-results');if(/^\d/.test(result.textContent))result.textContent='Showing '+result.textContent;}
   for(const card of host.querySelectorAll('.ux-contact,.place-profile-card,.commandment-card,.marked-comparison-card,.phase2-debate-card')){
    if(card.classList.contains('story-card'))continue;card.classList.add('story-card');
    const title=card.querySelector('h2,h3');title?.classList.add('story-title');
    const summary=card.querySelector('.character-summary,.comparison-summary>p');summary?.classList.add('story-summary');
    card.querySelector('.commandment-number')?.classList.add('passage-badge');
   }
  }
  // Keep the real footer within the People scroller, outside its alphabet dock.
  const footer=document.querySelector('footer'),people=document.getElementById('characters-view');
  const destination=people&&!people.hidden&&people.classList.contains('directory-hub')?people.querySelector('.stories-content'):null;
  if(footer&&destination&&footer.parentElement!==destination)destination.append(footer);
  else if(footer&&!destination&&footer.parentElement!==document.body)document.getElementById('main').after(footer);

 }
 let scheduled=false;const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;observer.disconnect();enhance();observer.observe(document.getElementById('main'),{subtree:true,childList:true});});};
 const observer=new MutationObserver(schedule);observer.observe(document.getElementById('main'),{subtree:true,childList:true});
 window.addEventListener('hashchange',schedule);schedule();
})();
