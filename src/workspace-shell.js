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
   const heading=el(view+'-view')?.querySelector('h1');
   if(!heading||heading.closest('[hidden]'))return;
   // A cold feature may insert its heading after the first route frame.
   // Preserve a deliberate focus change made while that feature was loading.
   const active=document.activeElement;
   if(active!==document.body&&active!==pendingFocus.opener){clearPageFocus();return;}
   clearPageFocus();heading.tabIndex=-1;heading.focus({preventScroll:true});
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
 const navigate=()=>{clearPageFocus();const oldURL=location.href;navigateHash(hash);window.dispatchEvent(new HashChangeEvent('hashchange',{oldURL,newURL:location.href}));const destination=location.hash;if(!/^#(?:read|compare|investigation|study|characters|people)\//.test(destination)&&!destination.startsWith('#compare')&&!(destination.startsWith('#notebook?')&&new URLSearchParams(destination.split('?')[1]).has('note'))){window.scrollTo({top:0,behavior:'instant'});requestPageFocus(destination);}};
 // setView owns route transitions, including browser history and cold routes.
 navigate();
 };
 document.body.classList.add('lens-app');
 const masthead = el('lensMasthead');
 el('reader-settings').addEventListener('close', () => el('lens-settings').focus({preventScroll:true}));
 const main = el('main');
 const contextNav=document.createElement('nav');contextNav.className='lens-context';contextNav.setAttribute('aria-label','Breadcrumb');contextNav.hidden=true;main.prepend(contextNav);
 const contextPages={stories:'Stories',characters:'People',places:'Places',evidence:'Evidence',timeline:'Timeline',commandments:'Commandments',prophecies:'Prophecies',method:'Method & Sources',chat:'Ask the text',bookmarks:'Bookmarks'};
 function updateContext(){
  const label=contextPages[view];contextNav.hidden=!label;if(!label)return;
  const parent=view==='chat'?['search','Search']:view==='bookmarks'?['notebook','Notebook']:['discover','Explore'];
  contextNav.innerHTML=`<a href="#${parent[0]}"><span aria-hidden="true">←</span> ${parent[1]}</a><span aria-hidden="true">/</span><span aria-current="page">${label}</span>`;
 }
 contextNav.addEventListener('click',event=>{const link=event.target.closest('a');if(!link||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();routeTo(link.hash);});
 window.addEventListener('viewchange',updateContext);
 const aboutHeading=el('method-view')?.querySelector('h1');if(aboutHeading)aboutHeading.textContent='Method & Sources';
 const footerLink=document.querySelector('body > footer .brand');if(footerLink){footerLink.textContent='Method & Sources';footerLink.setAttribute('aria-label','BibleLens Method & Sources');}
 function section(id, html) {const node = document.createElement('section'); node.id = id + '-view'; node.className = 'lens-workspace'; node.hidden = true; node.innerHTML = html; main.append(node); return node;}
 const heading = (kicker, title, copy) => `<div class="lens-page-heading"><span class="lens-kicker">${kicker}</span><h1 tabindex="-1">${title}</h1><p>${copy}</p></div>`;
 const questionPrompts = {
  seen: ['How Do Texts Describe Seeing God?', 'Compare descriptions of divine visibility and their literary contexts.', 'Representations of the divine'],
  judas: ['How Do the Judas Accounts Differ?', 'Compare wording, narrative details and context in the parallel accounts.', 'Parallel accounts'],
  animals: ['How Do the Creation Accounts Order Animals?', 'Compare the sequence and descriptions of animal creation in Genesis.', 'Creation narratives'],
  plants: ['How Do the Creation Accounts Order Plants?', 'Examine the sequence and wording of vegetation in the Genesis accounts.', 'Creation narratives'],
  soldiers: ['Why Do the Census Figures Differ?', 'Compare the totals and narrative settings of the accounts of David’s census.', 'Numerical variants'],
  birth: ['How Are the Birth Narratives Dated?', 'Examine the rulers, events and proposed chronologies associated with the narratives.', 'Historical context']
 };
 const questionCards = ENTRIES.map(entry => {
  const [title,copy,topic] = questionPrompts[entry.id] || [entry.title,entry.intro,entry.topic];
  return `<a class="lens-question-card" href="#study/${esc(entry.id)}"><span class="lens-question-topic">${esc(topic)}</span><h3>${esc(title)}</h3><p>${esc(copy)}</p><span class="lens-question-open">Compare passages <span aria-hidden="true">↗</span></span></a>`;
 }).join('');
 section('explore', `<section class="lens-starter-studies" aria-labelledby="lens-questions-title"><div class="lens-questions-heading"><div><span class="lens-kicker">Textual analysis</span><h2 id="lens-questions-title">Questions for Analysis</h2><p>Examine differences in wording, narrative and historical context.</p></div><a class="lens-ask-own" href="#chat">Ask a research question <span aria-hidden="true">↗</span></a></div><div class="lens-question-cards">${questionCards}</div></section>`);

 function shellRoute(hash){if(!hash||hash==='#'||hash==='#discover'){setView('explore',false);return true;}return false;}
 window.BibleLensWorkspace={navigate:routeTo,route:shellRoute};
 window.addEventListener('viewchange',event=>{
  const primary=event.detail==='debate'?'debates':event.detail==='bookmarks'?'notebook':['read','debates','notebook'].includes(event.detail)?event.detail:'explore';
  for(const link of masthead.querySelectorAll('[data-lens-view]')){if(link.dataset.lensView===primary)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
 });
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');if(!link||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.classList.contains('skip')||link.hasAttribute('data-cite'))return;
  if(link.closest('.lens-masthead,.lens-workspace,#lensComparison,.lens-context')){event.preventDefault();routeTo(link.getAttribute('href'));}
 });
 route();
})();
