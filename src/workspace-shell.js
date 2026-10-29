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
 const labels={read:'Read',explore:'Explore',debates:'Big Questions',debate:'Question',notebook:'Saved',search:'Search',stories:'Stories',characters:'People',places:'Places',evidence:'Text Comparisons',timeline:'Timeline',commandments:'Commandments',prophecies:'Prophecies',method:'Method & Sources',chat:'Ask the Text'};
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
  if(dialog.id==='lens-inspector-sheet'||dialog.id==='lens-search-overlay'){dialog.querySelector('.ux-dialog-path')?.remove();continue;}
  const title=[...dialog.querySelectorAll('h1,h2,h3')].find(node=>!node.closest('[hidden]'))?.textContent.trim()||dialog.getAttribute('aria-label')||'Details';
  let nav=dialog.querySelector('.ux-dialog-path');
  if(!nav){nav=document.createElement('nav');nav.className='ux-dialog-path';nav.setAttribute('aria-label','Breadcrumb');const button=document.createElement('button');button.type='button';button.textContent='←';button.setAttribute('aria-label','Back');button.onclick=()=>dialog.close();nav.append(button,document.createElement('span'));dialog.prepend(nav);}
  const collection={characters:'People',places:'Places',stories:'Stories',commandments:'Commandments',prophecies:'Prophecies',timeline:'History & Timeline'}[view];
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
 function enhance(){for(const strip of document.querySelectorAll('.directory-categories,.directory-alphabet,.ux-context-tabs,.phase2-modes,.phase2-chips,.lens-notebook-tools>div,.tabs,.reader-category-filters,.reader-filter-chips,.commandments-quick,.prophecy-quick,.chips,.filters,.comparison-tabs,#comparison-status,.ux-quick-links,.phase2-rail')){if(!strips.has(strip)){strips.add(strip);strip.addEventListener('scroll',()=>overflow(strip),{passive:true});new ResizeObserver(()=>overflow(strip)).observe(strip);}overflow(strip);}
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
