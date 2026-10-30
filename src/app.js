const scriptureName = 'Bible';
const scriptureComparison = target => scriptureName + ' vs. ' + (target === 'text' ? scriptureName : target);
'use strict';
// Format interface labels only; research titles and Scripture remain untouched.
function uiTitleCase(value){
 const words=String(value??'').match(/\p{L}[\p{L}\p{N}'’]*/gu)||[];let index=0;
 const minor=new Set(['a','an','and','as','at','but','by','for','from','in','into','nor','of','on','or','the','to','with','vs']);
 return String(value??'').replace(/\p{L}[\p{L}\p{N}'’]*/gu,word=>{const middle=index++>0&&index<words.length;return middle&&minor.has(word.toLowerCase())?word.toLowerCase():word[0].toUpperCase()+word.slice(1);});
}

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state={bookmarks:[],notes:{},theme:'dark'},storageAvailable=true;
let storageIssue='',storageRecoveryNotice='';
function showStorageStatus(status){
 if(status.kind==='error'){storageAvailable=false;storageIssue=status.message;}
 else if(status.kind==='saved'){storageAvailable=true;storageIssue='';}
 else if(status.kind==='recovery')storageRecoveryNotice=status.message;
 let banner=$('#workspace-storage-status');
 if(!banner){
  banner=document.createElement('aside');banner.id='workspace-storage-status';banner.className='workspace-storage-status';banner.setAttribute('role','status');
  const message=document.createElement('p');message.dataset.storageMessage='';banner.append(message);
  const backup=document.createElement('button');backup.type='button';backup.textContent='Export Notes';backup.onclick=()=>download('BibleLens-notes.json',JSON.stringify({version:1,exportedAt:new Date().toISOString(),...state,deviceDebates:window.BibleLensDebateStore?.all()},null,2),'application/json');banner.append(backup);
  const recovery=document.createElement('button');recovery.type='button';recovery.dataset.storageRecovery='';recovery.textContent='Download recovery';recovery.onclick=()=>{if(workspaceStore.recovery)download('BibleLens-recovery.txt',workspaceStore.recovery.raw,'text/plain');};banner.append(recovery);
  (document.querySelector('main')||document.body).prepend(banner);
 }
 banner.hidden=!storageIssue&&!storageRecoveryNotice;
 banner.querySelector('[data-storage-message]').textContent=[storageIssue,storageRecoveryNotice].filter(Boolean).join(' ');
 banner.querySelector('[data-storage-recovery]').hidden=!storageRecoveryNotice&&!status.message?.includes('recovery');
}
const workspaceStorage={getItem:key=>localStorage.getItem(key),setItem:(key,value)=>localStorage.setItem(key,value),removeItem:key=>localStorage.removeItem(key),key:index=>localStorage.key(index),get length(){return localStorage.length;}};
const workspaceStore=window.BibleLensSync.createLocalStore({storage:workspaceStorage,actor:globalThis.crypto?.randomUUID?.()||'tab-'+Date.now()+'-'+Math.random().toString(36).slice(2),locks:globalThis.navigator?.locks,getState:()=>state,onStatus:showStorageStatus,onMerge:(data,detail)=>applyWorkspaceSnapshot(data,{source:'external',...detail})});
state={...state,...workspaceStore.initial};
state.bookmarks=state.bookmarks.filter(id=>ENTRIES.some(e=>e.id===id));
if(!state.noteTitles||typeof state.noteTitles!=='object'||Array.isArray(state.noteTitles))state.noteTitles={};
window.addEventListener('storage',event=>workspaceStore.receive(event));
window.addEventListener('focus',()=>workspaceStore.flush());
document.addEventListener('DOMContentLoaded',()=>workspaceStore.flush());
function updateWorkspaceField(input,previous,incoming){
 if(!input)return;
 const value=window.BibleLensSync.mergeDraft(previous,input.value,incoming);if(input.value===value)return;
 const start=input.selectionStart,end=input.selectionEnd,direction=input.selectionDirection,scroll=input.scrollTop;
 input.value=value;
 if(start!==null&&start!==undefined)input.setSelectionRange?.(Math.min(start,value.length),Math.min(end,value.length),direction||'none');
 input.scrollTop=scroll;
}
function updateLegacyNoteEditors(before,after){
 if(current){updateWorkspaceField($('#study-note'),before.notes?.[current.id],after.notes?.[current.id]);updateWorkspaceField($('#study-note-title'),before.noteTitles?.[current.id],after.noteTitles?.[current.id]);}
 if(typeof reading!=='undefined'&&reading){const key=passageKey();updateWorkspaceField($('#passage-note'),before.passageNotes?.[key]?.text,after.passageNotes?.[key]?.text);updateWorkspaceField($('#passage-note-title-input'),before.passageNotes?.[key]?.title,after.passageNotes?.[key]?.title);}
 if(typeof activeVerseNote!=='undefined'&&activeVerseNote&&$('#verse-note-dialog')?.open){const key=activeVerseNote.key;updateWorkspaceField($('#verse-note-text'),before.verseNotes?.[key]?.text,after.verseNotes?.[key]?.text);updateWorkspaceField($('#verse-note-title-input'),before.verseNotes?.[key]?.title,after.verseNotes?.[key]?.title);}
}
function applyWorkspaceSnapshot(data,{source='external',conflicts=0}={}){
 const before=window.BibleLensSync.snapshot(state);if(window.BibleLensSync.equal(before,data))return false;
 window.BibleLensSync.apply(state,data);
 const refresh=()=>{
  const preferencesChanged=!window.BibleLensSync.equal(before.preferences,data.preferences);
  updateLegacyNoteEditors(before,data);
  if(preferencesChanged){Object.assign(readerPreferences,state.readerPreferences);$('#reader-edition').value=readerPreferences.edition;updateCompareToggle();applyTheme();applyTextSize();applyReaderFonts();if(typeof applyNavigationAppearance==='function')applyNavigationAppearance();if(typeof applyBookPickerPosition==='function')applyBookPickerPosition();}
  renderCards();
  if(reading&&preferencesChanged)renderReader(true);
  else if(reading&&!window.BibleLensSync.equal(before.verseBookmarks,data.verseBookmarks)){
   const refresh=()=>{if(window.getSelection()?.isCollapsed===false)return;document.removeEventListener('selectionchange',refresh);refreshVerseHighlights();renderChapterBookmarks();};
   if(window.getSelection()?.isCollapsed===false)document.addEventListener('selectionchange',refresh);else refresh();
  }
  window.dispatchEvent(new CustomEvent('biblelens:statechange',{detail:{source,conflicts,before,data}}));
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
 return true;
}
let activeType='All studies',current=null,tab='passages',edition='KJV',view='read';
// Keep action feedback visible and announced; Undo never steals reading focus.
let actionToastTimer;
function toast(msg,{undo}={}){
 let notice=$('#lens-action-toast');
 if(!notice){
  notice=document.createElement('aside');notice.id='lens-action-toast';notice.className='lens-action-toast';
  const message=document.createElement('p');message.className='lens-action-message';message.setAttribute('role','status');message.setAttribute('aria-live','polite');message.setAttribute('aria-atomic','true');notice.append(message);
  const action=document.createElement('button');action.type='button';action.className='lens-action-undo';action.textContent='Undo';notice.append(action);document.body.append(notice);
 }
 clearTimeout(actionToastTimer);notice.hidden=false;
 const host=document.activeElement?.closest?.('dialog[open]')||[...document.querySelectorAll('dialog[open]')].at(-1)||document.body;host.append(notice);
 if(host!==document.body)host.addEventListener('close',()=>{if(notice.parentElement===host)([...document.querySelectorAll('dialog[open]')].at(-1)||document.body).append(notice);},{once:true});
 notice.querySelector('.lens-action-message').textContent=msg;
 const button=notice.querySelector('button');button.hidden=typeof undo!=='function';button.disabled=false;
 button.onclick=()=>{if(button.disabled)return;button.disabled=true;clearTimeout(actionToastTimer);undo();};
 function dismiss(){if(notice.contains(document.activeElement)){actionToastTimer=setTimeout(dismiss,2000);return;}notice.hidden=true;}
 actionToastTimer=setTimeout(dismiss,typeof undo==='function'?12000:6000);
}
window.addEventListener('hashchange',()=>{clearTimeout(actionToastTimer);const notice=document.querySelector('#lens-action-toast');if(notice)notice.hidden=true;});
function confirmNoteAction(message,action){
 const dialog=$('#note-confirm-dialog');if(dialog.open)return null;
 $('#note-confirm-message').textContent=message;
 let settled=false;
 function finish(confirmed){if(settled)return;settled=true;dialog.close();if(confirmed)action();}
 $('#note-confirm-cancel').onclick=()=>finish(false);
 $('#note-confirm-accept').onclick=()=>finish(true);
 dialog.oncancel=ev=>{ev.preventDefault();finish(false);};
 dialog.showModal();$('#note-confirm-cancel').focus();return null;
}
function persist(source='local'){const saved=workspaceStore.save();window.dispatchEvent(new CustomEvent('biblelens:statechange',{detail:{source}}));if(saved)globalThis.BibleLensCloud?.changed?.();return saved;}
if(state.glassAppearanceVersion!=='midnight-v1'){if(!['dark','light'].includes(state.theme))state.theme='dark';state.glassAppearanceVersion='midnight-v1';persist();}
function applyTheme(){document.querySelectorAll('meta[name="theme-color"]').forEach(meta=>{meta.content=state.theme==='dark'?'#0B0F17':'#f6f7fb';});document.body.classList.toggle('dark',state.theme==='dark');$('#theme').setAttribute('aria-pressed',String(state.theme==='dark'))}applyTheme();
function corpus(e){return [e.title,e.type,e.topic,e.refs.join(' '),e.intro,e.claim,e.response,e.assessment,e.context,e.translation,...e.passages.flat()].join(' ').toLowerCase()}
function matches(e,q){return q.trim().toLowerCase().split(/\s+/).filter(Boolean).every(word=>corpus(e).includes(word))}

function utilityIcon(name){const paths={bookmark:'<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>',link:'<path d="m10 13 4-4m-6 5-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 5 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0"/>'};return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[name]+'</svg>';}
function classificationLabel(value){return String(value).replace('All studies','All records').replace('Apparent contradiction','Text comparison').replace('a verdict on historicity','a finding about past events');}
function card(e){let saved=state.bookmarks.includes(e.id);return `<article class="card" data-type="${esc(e.type)}"><div class="card-top"><span class="tag" data-topic="${e.type.startsWith('Historical')?'history':e.type==='Translation dependent'?'translation':'text'}">${esc(classificationLabel(e.type))}</span><button class="bookmark ${saved?'saved':''}" data-bookmark="${e.id}" aria-label="${saved?'Remove bookmark for':'Bookmark'} ${esc(e.title)}" aria-pressed="${saved}">${utilityIcon('bookmark')}</button></div><h3><button data-open="${e.id}">${esc(e.title)}</button></h3><p>${esc(e.intro)}</p><div class="card-bottom"><span>${esc(e.refs[0])}<br>${esc(e.refs[1])}</span><button class="open-study" data-open="${e.id}">Examine ↗</button></div></article>`}
function renderCards(){const q=$('#search').value,t=$('#testament').value;updateStudyFilterAvailability();const list=ENTRIES.filter(e=>matches(e,q)&&(activeType==='All studies'||e.type===activeType)&&(t==='All testaments'||e.testament===t||e.testament==='Both'));$('#cards').innerHTML=list.length?list.map(card).join(''):'<div class="empty"><h3>No Matching Records.</h3><p>Try a broader term or reset the filters. This collection contains six records.</p></div>';$('#results-count').textContent=`${list.length} ${list.length===1?'record':'records'} in this collection`;const saved=ENTRIES.filter(e=>state.bookmarks.includes(e.id)||state.notes[e.id]||state.noteTitles?.[e.id]);$('#saved-cards').innerHTML=saved.length?saved.map(e=>card(e).replace('</article>',(state.notes[e.id]||state.noteTitles[e.id]?'<section class="marked-study-note"><h4>'+esc(state.noteTitles[e.id]||'Note')+'</h4><p>'+esc(state.notes[e.id])+'</p></section>':'')+'</article>')).join(''):'<div class="empty"><h3>A Little Room to Think.</h3><p>Bookmark a record or write a note to add it to your desk.</p><button class="primary" data-view="read">Explore the Collection →</button></div>';$('#save-count').textContent=saved.length;if(typeof renderPassageSaved==='function')renderPassageSaved();}
function renderFilters(){$('#filters').innerHTML=['All studies',...Object.keys(TYPES)].map(t=>`<button class="chip ${t===activeType?'active':''}" data-topic="${t.startsWith('Historical')?'history':t==='Translation dependent'?'translation':'text'}" data-filter="${esc(t)}" aria-pressed="${t===activeType}">${esc(classificationLabel(t))}</button>`).join('')}renderFilters();renderCards();
function updateStudyFilterAvailability(){
 const q=$('#search').value,testament=$('#testament').value;
 document.querySelectorAll('[data-filter]').forEach(button=>{const type=button.dataset.filter;button.disabled=type!==activeType&&type!=='All studies'&&!ENTRIES.some(e=>matches(e,q)&&e.type===type&&(testament==='All testaments'||e.testament===testament||e.testament==='Both'));});
 for(const option of $('#testament').options){const t=option.value;option.disabled=t!==testament&&t!=='All testaments'&&!ENTRIES.some(e=>matches(e,q)&&(activeType==='All studies'||e.type===activeType)&&(e.testament===t||e.testament==='Both'));}
}
$('#taxonomy').innerHTML=Object.entries(TYPES).map(([k,v])=>`<div class="taxonomy-item"><b>${esc(classificationLabel(k))}</b>${esc(classificationLabel(v))}</div>`).join('');
// Dedicated directories retain their own search and facet controls.
const CATEGORY_DIRECTORY_VIEWS={places:'places',stories:'stories',characters:'characters',commandments:'commandments',prophecies:'prophecies'};
function categoryDirectoryLocation(key){const page=CATEGORY_DIRECTORY_VIEWS[key];return typeof page==='string'?'#'+(page==='characters'?'people':page):null;}
function updateHeaderContext(){
 const context=$('#header-context');if(!context)return;
 const heading=$('#chapter-text .passage-heading>div'),rect=heading?.getBoundingClientRect();
 const showPassage=view==='read'&&rect&&(rect.bottom<=document.querySelector('body>header').getBoundingClientRect().bottom||rect.top>=window.innerHeight);
 let label=view==='read'?(showPassage?(context.dataset.passage||'Read'):'Read'):({places:'Places',stories:'Events',timeline:'Timeline',prophecies:'Prophecies',characters:'People',commandments:'Laws',chat:'Chat',evidence:'Evidence',bookmarks:'Bookmarks',method:'About',explore:'Explore',lost:'Lost Books',search:'Search',notebook:'Notebook'}[view]||'BibleLens');
 const key=view==='evidence'?/^#evidence\/([^?]+)/.exec(location.hash)?.[1]:null;
 const category={academic:'Academic',commandments:'Laws',contradictions:'Text Comparisons',bookmark:'Marked',characters:'People',prophecies:'Prophecies',Q:'Questions',stories:'Events',T:'Translation'}[key];
 if(category){
  label='Evidence · '+category;
  context.textContent=label;
 }else context.textContent=label;
 if(showPassage&&context.dataset.description){const description=document.createElement('small');description.className='header-description';description.textContent=context.dataset.description;description.title=context.dataset.description;context.append(description);}
 $('#lens-settings')?.setAttribute('aria-label','Settings for '+(view==='read'?label:document.title?.replace(/ · BibleLens$/,'')||label));
 context.parentElement?.setAttribute('aria-label',label+(showPassage&&context.dataset.description?' · '+context.dataset.description:'')+' — Open navigation');
}
let headerContextFrame=0;
function scheduleHeaderContext(){if(headerContextFrame)return;headerContextFrame=requestAnimationFrame(()=>{headerContextFrame=0;if(!document.body.classList.contains('dialog-scroll-locked'))updateHeaderContext();});}
window.addEventListener('scroll',scheduleHeaderContext,{passive:true});
window.addEventListener('resize',scheduleHeaderContext);
// Browser history belongs to meaningful destinations; filters can opt into replace.
const navigationPositions=new Map();let navigationFocusSequence=0,navigationRestore=null;
function navigationId(){return 'entry-'+Date.now()+'-'+Math.random().toString(36).slice(2);}
let navigationEntry=history.state?.biblelens?.id||navigationId();
function navigationPosition(){
 const active=document.activeElement;let focus=null;
 if(active&&active!==document.body){
  if(active.id)focus='#'+CSS.escape(active.id);
  else {if(!active.dataset.historyFocus)active.dataset.historyFocus='focus-'+(++navigationFocusSequence);focus='[data-history-focus="'+active.dataset.historyFocus+'"]';}
 }
 const y=document.body.classList.contains('dialog-scroll-locked')?-parseFloat(document.body.style.top||'0'):window.scrollY;
 return {x:window.scrollX||0,y,focus};
}
function rememberNavigation(){if(navigationRestore)return;navigationPositions.set(navigationEntry,navigationPosition());}
// Keep bookmarked and native legacy destinations while publishing one vocabulary.
// #discover is Explore; legacy #explore remains a reader link.
function canonicalRouteHash(hash){
 let value=hash.startsWith('#')?hash:'#'+hash;
 value=value.replace(/^#debates(?=[?]|$)/,'#questions').replace(/^#explore(?=[/?]|$)/,'#read')
  .replace(/^#(?:categories|saved)(?=[/?]|$)/,'#evidence')
  .replace(/^#bookmarks(?=$)/,'#notebook?section=bookmarks');
 const [path,query='']=value.split('?'),params=new URLSearchParams(query);
 const destinations={academic:'#questions?mode=history',Q:'#questions',contradictions:'#questions?mode=text',T:'#questions?filter=T',V:'#discover?section=evidence'};
 const key=/^#evidence\/([^?]+)/.exec(path)?.[1]||(path==='#evidence'?params.get('kind'):null);
 if(Object.hasOwn(destinations,key))return destinations[key];
 if(path==='#evidence'&&(!key||key==='all'))return '#discover?section=evidence';
 if(path==='#questions'&&params.get('filter')==='V')return destinations.V;
 if(path==='#questions'&&params.get('filter')==='Q')return destinations.Q;
 if(path==='#questions'&&params.get('filter')==='commandments')return '#commandments';
 return value;
}
function navigateHash(hash,{replace=false}={}){
 hash=canonicalRouteHash(hash);
 if(location.hash===hash)return;
 navigationRestore=null;rememberNavigation();
 const position=navigationPositions.get(navigationEntry)||navigationPosition();
 history.replaceState({...history.state,biblelens:{...history.state?.biblelens,id:navigationEntry,position}},'',location.href);
 const from=location.hash;navigationEntry=replace?navigationEntry:navigationId();
 history[replace?'replaceState':'pushState']({biblelens:{id:navigationEntry,from,position:{x:0,y:0,focus:null}}},'',hash);
}
function restoreNavigation(){
 if(!navigationRestore||navigationRestore.hash!==location.hash)return false;
 const match=/^#read\/(\d+)\/(\d+)/.exec(location.hash);
 if(match&&(typeof reading==='undefined'||!reading||readingBook!==Number(match[1])||readingChapter!==Number(match[2])||$('#chapter-text .chapter-loading')))return false;
 if($('#chapter-text .chapter-loading')&&view==='read')return false;
 const restore=navigationRestore;navigationRestore=null;
 requestAnimationFrame(()=>{
  if(restore.hash!==location.hash)return;
  window.scrollTo({left:restore.position.x||0,top:restore.position.y||0,behavior:'instant'});
  const noteKey=location.hash.startsWith('#notebook?')?new URLSearchParams(location.hash.split('?')[1]).get('note'):null;
  const target=restore.position.focus?document.querySelector(restore.position.focus):noteKey?document.querySelector('[data-lens-note="'+CSS.escape(noteKey)+'"] textarea'):null;
  if(target&&!target.closest('[hidden]'))target.focus({preventScroll:true});
  else {const heading=document.querySelector('#'+view+'-view h1, #'+view+'-view h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}}
 });return true;
}
history.replaceState({...history.state,biblelens:{...history.state?.biblelens,id:navigationEntry,position:history.state?.biblelens?.position||navigationPosition()}},'',location.href);
if('scrollRestoration' in history)history.scrollRestoration='manual';
window.addEventListener('scroll',rememberNavigation,{passive:true});document.addEventListener('focusin',rememberNavigation);
window.addEventListener('popstate',event=>{
 navigationEntry=event.state?.biblelens?.id||navigationId();
 navigationRestore={hash:location.hash,position:navigationPositions.get(navigationEntry)||event.state?.biblelens?.position||{x:0,y:0,focus:null}};
 requestAnimationFrame(()=>requestAnimationFrame(restoreNavigation));
});
window.addEventListener('hashchange',()=>{if(!navigationRestore){navigationEntry=history.state?.biblelens?.id||navigationId();history.replaceState({...history.state,biblelens:{...history.state?.biblelens,id:navigationEntry}},'',location.href);}});
window.addEventListener('viewchange',()=>{if(navigationRestore)requestAnimationFrame(()=>requestAnimationFrame(restoreNavigation));});
window.BibleLensNavigation={navigate:navigateHash,restore:restoreNavigation,remember:rememberNavigation};
let viewTransition,viewRender=0;
function setView(v,update=true){
 v=({categories:'evidence',saved:'evidence',discover:'explore',people:'characters'})[v]||v;
 const views=['read','chat','evidence','method','commandments','characters','prophecies','timeline','stories','bookmarks','places','explore','lost','search','notebook','debates','debate'];
 const next=views.includes(v)?v:'read';
 if(update){navigateHash('#'+(({characters:'people',explore:'discover',bookmarks:'notebook?section=bookmarks',debates:'questions'})[next]||next));if(window.BibleLensFeatures?.route(location.hash))return;}
 const changed=view!==next;view=next;const renderId=++viewRender;
 const render=()=>{if(renderId!==viewRender)return;
 document.body.classList.toggle('read-view',view==='read');
 for(const name of views){const section=$('#'+name+'-view');if(section)section.hidden=name!==view;}
 document.querySelectorAll('nav [data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);if(b.closest('header'))b.hidden=['chat','stories','commandments','prophecies','characters'].includes(b.dataset.view);if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 updateHeaderContext();window.dispatchEvent(new CustomEvent('viewchange',{detail:view}));
 };
 if(changed&&document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  viewTransition?.skipTransition();viewTransition=document.startViewTransition(render);
  viewTransition.ready.catch(()=>{});
 }else{viewTransition?.skipTransition();render();}
}

function bookmark(id){if(state.bookmarks.includes(id))state.bookmarks=state.bookmarks.filter(x=>x!==id);else state.bookmarks.push(id);persist();renderCards();if(current?.id===id){const b=$('#study-bookmark');if(b)b.innerHTML=utilityIcon('bookmark')+(state.bookmarks.includes(id)?'Bookmarked':'Bookmark')}toast(state.bookmarks.includes(id)?'Added to your research desk':'Bookmark removed')}
function contextUrl(ref,ed=edition){return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref.replace(/:\d+$/,''))}&version=${ed}`}
function workspace(){const e=current;if(!e)return;$('#study-content').innerHTML=`<div class="study-heading"><div><span class="tag" data-topic="${e.type.startsWith('Historical')?'history':e.type==='Translation dependent'?'translation':'text'}">${esc(classificationLabel(e.type))}</span><h2>${esc(e.title)}</h2><p>${esc(e.intro)}</p></div><div class="study-actions"><button id="study-bookmark" class="secondary">${utilityIcon('bookmark')}${state.bookmarks.includes(e.id)?'Bookmarked':'Bookmark'}</button><button id="share" class="secondary">${utilityIcon('link')}Copy link</button></div></div><div class="workspace-tools"><div class="tabs" role="tablist" aria-label="Record sections">${['passages','perspectives','sources','notes'].map(t=>`<button role="tab" id="tab-${t}" aria-controls="tab-content" aria-selected="${tab===t}" class="${tab===t?'active':''}" data-tab="${t}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}</div><div><label>Edition <select id="edition"><option ${edition==='KJV'?'selected':''}>KJV</option><option ${edition==='ASV'?'selected':''}>ASV</option><option ${edition==='Side by Side'?'selected':''}>Side by Side</option></select></label> <button id="font-size" class="secondary" aria-label="Change all text size">A+</button></div></div><div id="tab-content" role="tabpanel" aria-labelledby="tab-${tab}"></div>`;renderTab();$('#study-bookmark').onclick=()=>bookmark(e.id);$('#share').onclick=async()=>{const url=new URL(location.href);url.hash=`study/${e.id}`;try{await navigator.clipboard.writeText(url.href);toast('Record link copied. Your notes stay private.')}catch{const area=document.createElement('textarea');area.value=url.href;$('#tab-content').prepend(area);area.select();toast('Select and copy the displayed link.')}};$('#edition').onchange=ev=>{edition=ev.target.value;renderTab()};$('#font-size').onclick=()=>{$('#reader-picker').click();$('#reader-font').focus();};}
function renderTab(){const e=current,box=$('#tab-content');if(tab==='passages'){const editions=edition==='Side by Side'?['KJV','ASV']:[edition];box.innerHTML=`<div class="study-tldr"><p class="comparison-summary">${esc(e.summary||e.claim)}</p><span class="summary-attribution">Our summary · provisional assessment</span><div class="summary-citations">${e.refs.map(citationButton).join('')}</div></div><details class="verse-disclosure"><summary>Show Verses</summary><div class="passages">${e.passages.map(p=>editions.map(ed=>`<article class="passage"><h3>${esc(p[0])} · ${ed}${e.id==='animals'&&p[0]==='Genesis 2:19'?' · excerpt':''}</h3><blockquote>${esc(p[ed==='KJV'?1:2])}</blockquote><a href="${contextUrl(p[0],ed)}" target="_blank" rel="noopener">Read full chapter context ↗</a></article>`).join('')).join('')}</div></details><div class="assessment"><div class="eyebrow">CONTEXT & TRANSLATION · PROVISIONAL EDITORIAL NOTES</div><p>${esc(e.context)}</p><p>${esc(e.translation)}</p></div>`}
if(tab==='perspectives')box.innerHTML=`<article class="analysis-box"><div class="eyebrow">OUR ANALYSIS · PROVISIONAL</div><h3>Our Assessment</h3><p class="comparison-summary">${esc(e.summary)}</p><p>${esc(e.assessment)}</p><p><b>Context:</b> ${esc(e.context)}</p><p><b>Translation:</b> ${esc(e.translation)}</p><p><b>Research question:</b> ${esc(e.question)}</p></article><details class="comparison-details"><summary>Other Possible Reading</summary><p>${esc(e.response)}</p>${e.responseUrl?`<a href="${e.responseUrl}" target="_blank" rel="noopener">Attributed Christian response ↗</a>`:''}</details>`;
if(tab==='sources')box.innerHTML=`<div class="source-row"><a href="${e.sab}" target="_blank" rel="noopener">Skeptic’s Annotated Bible — Steve Wells ↗</a><p>Original skeptical source. Linked, separately attributed. Source checked October 11, 2026.</p></div>${e.responseUrl?`<div class="source-row"><a href="${e.responseUrl}" target="_blank" rel="noopener">GotQuestions — Christian response ↗</a><p>Theological/apologetic source. Response summarized separately. Checked October 11, 2026.</p></div>`:''}${e.refs.map(ref=>`<div class="source-row"><a href="${contextUrl(ref,'KJV')}" target="_blank" rel="noopener">${esc(ref)} — full KJV chapter ↗</a> · <a href="${contextUrl(ref,'ASV')}" target="_blank" rel="noopener">ASV chapter ↗</a><p>Primary text for the textual claim. Not independent evidence that a described event occurred.</p></div>`).join('')}<div class="assessment"><div class="eyebrow">EDITORIAL STATUS</div><p>Starter record · provisional classification · not scholarly reviewed. No peer-reviewed historical source or scholarly consensus is asserted in this record. Additional research should be attributed and reviewed before publication.</p></div>`;
if(tab!=='notes')box.insertAdjacentHTML('beforeend',relatedStudyPassages(e));
if(tab==='notes'){box.innerHTML=`<label for="study-note-title"><h3>Note Title</h3></label><input id="study-note-title" type="text" maxlength="160" value="${esc(state.noteTitles[e.id]||'')}" placeholder="Note title"><label for="study-note"><h3>Your Private Research Notes</h3></label><p class="notes-caption">Saved in this browser as you type. Export to preserve them elsewhere.</p><textarea class="notes-area" id="study-note" placeholder="What does the text establish? What assumptions still need evidence?">${esc(state.notes[e.id]||'')}</textarea><p class="notes-caption" id="note-status">${storageAvailable?'Browser-local storage':'Storage unavailable. Export your notes.'}</p>`;$('#study-note-title').oninput=ev=>{state.noteTitles[e.id]=ev.target.value.slice(0,160);persist();renderCards();};$('#study-note').oninput=ev=>{state.notes[e.id]=ev.target.value;persist();renderCards();$('#note-status').textContent=storageAvailable?'Saved in this browser':'Storage unavailable. Export your notes.'};}}
function openStudy(id,update=true){const e=ENTRIES.find(e=>e.id===id);if(!e)return;if(update)navigateHash(`#study/${id}`);current=e;tab='passages';workspace();if(!$('#study-dialog').open)$('#study-dialog').showModal();$('#close-dialog').focus();}
$('#close-dialog').onclick=()=>$('#study-dialog').close();$('#study-dialog').addEventListener('close',()=>{if(location.hash.startsWith('#study/')){if(typeof history.state?.biblelens?.from==='string')history.back();else navigateHash('#'+view,{replace:true});}current=null});$('#study-dialog').addEventListener('click',ev=>{if(ev.target===$('#study-dialog')){const r=ev.target.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)ev.target.close()}});
document.addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;if(b.dataset.open)openStudy(b.dataset.open);if(b.dataset.bookmark)bookmark(b.dataset.bookmark);if(b.dataset.filter){activeType=b.dataset.filter;renderFilters();renderCards()}if(b.dataset.view){setView(b.dataset.view);window.scrollTo({top:0,behavior:'smooth'})}if(b.dataset.tab){tab=b.dataset.tab;workspace();$(`#tab-${tab}`).focus()}});
document.addEventListener('keydown',ev=>{if(ev.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('#study-dialog').open){ev.preventDefault();setView('search');window.BibleLensFeatures.load('study').then(()=>requestAnimationFrame(()=>$('#lens-search-input')?.focus())).catch(()=>{})}if(ev.target.matches('[role="tab"]')&&['ArrowLeft','ArrowRight'].includes(ev.key)){ev.preventDefault();const tabs=['passages','perspectives','sources','notes'];tab=tabs[(tabs.indexOf(tab)+(ev.key==='ArrowRight'?1:3))%4];workspace();$(`#tab-${tab}`).focus()}});
$('#search').oninput=renderCards;$('#testament').onchange=renderCards;$('#reset').onclick=()=>{$('#search').value='';$('#testament').value='All testaments';activeType='All studies';renderFilters();renderCards()};$('#theme').onclick=()=>{state.theme=state.theme==='dark'?'light':'dark';applyTheme();persist()};
$('#evidence-form').onsubmit=ev=>{ev.preventDefault();const q=$('#evidence-query').value.trim();const stop=new Set(['how','did','does','is','a','the','was','what','can','do','of','in','to','and','it','why','when','were','there','god']);let words=q.toLowerCase().replace(/[^a-z0-9\s:]/g,' ').split(/\s+/).filter(w=>w&&!stop.has(w));if(!words.length)words=q.toLowerCase().split(/\s+/).filter(Boolean);const ranked=ENTRIES.map(e=>({e,score:words.filter(w=>corpus(e).includes(w)).length})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,4);$('#evidence-results').innerHTML=ranked.length?`<div class="eyebrow">MATCHING RECORDS · RETRIEVAL, NOT A GENERATED ANSWER</div>${ranked.map(({e})=>`<article class="evidence-result"><button data-open="${e.id}">${esc(e.title)} ↗</button><p class="comparison-summary">${esc(e.summary)}</p></article>`).join('')}`:'<p>No relevant records in this six-record collection. Try “Judas,” “census,” “plants,” or a passage reference.</p>'};
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Export downloaded')}
function studyMarkdown(e){return `# ${e.title}\n\nClassification: ${classificationLabel(e.type)} (provisional editorial)\n\n${e.intro}\n\n## Passage extracts\n${e.passages.map(p=>`\n### ${p[0]} — KJV\n${p[1]}\n\n### ${p[0]} — ASV\n${p[2]}\n`).join('')}\n## Our summary\n${e.summary}\n\nBackground reference: ${e.sab}\n\n## Competing reading\n${e.response}\n${e.responseUrl||'No external source attached; proposed editorial reading.'}\n\n## Evidence and limits\n${e.assessment}\n\nResearch question: ${e.question}\n\n## My private notes\n${state.noteTitles[e.id]?'Title: '+state.noteTitles[e.id]+'\n\n':''}${state.notes[e.id]||'(No notes)'}\n\nProvisional starter record. Not scholarly reviewed. Source check: October 11, 2026.\n`}
$('#export-backup').onclick=()=>download('bible-lens-backup.json',JSON.stringify({version:1,exportedAt:new Date().toISOString(),...state,deviceDebates:window.BibleLensDebateStore?.all()},null,2),'application/json');
function mergeInvestigationBackup(backup){
 const records=backup.investigations;if(!records||typeof records!=='object'||Array.isArray(records))return;
 const incoming=Object.fromEntries(Object.entries(records).filter(([id,item])=>!['__proto__','constructor','prototype'].includes(id)&&window.BibleLensSync.validInvestigation(item)).map(([id,item])=>[id,{...item,id}]));
 state.investigations=window.BibleLensSync.merge({}, {investigations:state.investigations||{}}, {investigations:incoming}).data.investigations;
}
$('#import-backup').onchange=async ev=>{const file=ev.target.files[0];if(!file)return;try{if(file.size>2000000)throw Error('Backup exceeds 2 MB');const backup=JSON.parse(await file.text());if(backup.version!==1||!Array.isArray(backup.bookmarks)||!backup.notes||typeof backup.notes!=='object'||Array.isArray(backup.notes))throw Error('Not a BibleLens backup');const valid=ENTRIES.map(e=>e.id);state.bookmarks=[...new Set([...state.bookmarks,...backup.bookmarks.filter(id=>valid.includes(id))])];for(const id of valid){const note=backup.notes[id];if(typeof note==='string'&&note.length<=100000){const old=state.notes[id];state.notes[id]=old&&old!==note?`${old}\n\n--- Imported note ---\n${note}`:note}}if(backup.noteTitles&&typeof backup.noteTitles==='object'&&!Array.isArray(backup.noteTitles))for(const id of valid){const title=backup.noteTitles[id];if(typeof title!=='string'||title.length>160)continue;if(state.noteTitles[id]&&state.noteTitles[id]!==title){state.notes[id]=(state.notes[id]||'')+'\n\nImported note title: '+title;}else state.noteTitles[id]=title;}if(typeof mergePassageBackup==='function')mergePassageBackup(backup);mergeInvestigationBackup(backup);window.BibleLensDebateStore?.restore(backup.deviceDebates);persist();renderCards();$('#backup-status').textContent='Backup restored. Existing notes were preserved.'}catch(err){$('#backup-status').textContent=`Could not restore: ${err.message}`}ev.target.value=''};
function route(){
  const canonical=canonicalRouteHash(location.hash);
 if(canonical!==location.hash&&location.hash){
  history.replaceState(history.state,'',canonical);
  if(navigationRestore)navigationRestore.hash=canonical;
 }
 if(window.BibleLensFeatures.route(location.hash))return;
 let hash;try{hash=decodeURIComponent(location.hash.slice(1));}catch{hash='read';}if(!hash.startsWith('study/')&&$('#study-dialog').open)$('#study-dialog').close();if(window.BibleLensDebates?.route?.(location.hash))return;if(window.BibleLensWorkspace?.route(location.hash))return;if(hash==='characters'||hash.startsWith('characters/')||hash==='people'||hash.startsWith('people/')){setView('characters',false)}else if(hash.startsWith('evidence/')||hash.startsWith('evidence?')){const key=/^evidence\/([^?]+)/.exec(hash)?.[1],directory=categoryDirectoryLocation(key);if(directory){history.replaceState(history.state,'',directory);route();return;}else setView('evidence',false);window.scrollTo({top:0,behavior:'instant'})}else if(hash.startsWith('stories/')){setView('stories',false)}else if(hash.startsWith('study/')){setView('read',false);const id=hash.slice(6);if(ENTRIES.some(e=>e.id===id))openStudy(id,false);else toast('Record not found in this collection')}else if(hash.startsWith('places?'))setView('places',false);else if(hash.startsWith('commandments?'))setView('commandments',false);else if(hash.startsWith('timeline?'))setView('timeline',false);else if(hash.startsWith('read/'))setView('read',false);else setView(hash,false)}window.addEventListener('hashchange',route);route();

// D8-A: remove this class to restore the separate book-cell styling.
document.body.classList.add('merge-picker-inputs');

// D17 device appearance is separate from private notes and cloud revisions.
(() => {
 const key='biblelens-surfaces-v1',defaults={base:10,gradient:15};
 const valid=value=>Number.isInteger(value)&&value>=0&&value<=20&&value%5===0;
 let appearance={...defaults};
 try{const saved=JSON.parse(localStorage.getItem(key)||'{}');for(const name of Object.keys(defaults))if(valid(saved[name]))appearance[name]=saved[name];}catch{}
 const section=document.createElement('section');section.className='surface-settings';section.setAttribute('aria-label','Surface appearance');
 section.innerHTML='<div class="surface-heading"><label for="surface-base">Base Opacity</label><button type="button" class="icon surface-reset" aria-label="Reset base opacity and gradient to defaults" title="Reset appearance"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/></svg></button></div><input id="surface-base" type="range" min="0" max="20" step="5"><label for="surface-gradient">Gradient Strength</label><input id="surface-gradient" type="range" min="0" max="20" step="5">';
 document.querySelector('#reader-settings').append(section);
 function apply(){for(const name of Object.keys(defaults)){document.body.style.setProperty('--surface-'+name,String(appearance[name]/100));const input=section.querySelector('#surface-'+name);input.value=appearance[name];input.setAttribute('aria-valuetext',appearance[name]+' percent'+(appearance[name]===defaults[name]?', default':''));}}
 function save(){apply();try{localStorage.setItem(key,JSON.stringify(appearance));}catch{toast('Appearance changed for this session. Storage is unavailable.');}}
 for(const name of Object.keys(defaults))section.querySelector('#surface-'+name).addEventListener('input',event=>{appearance[name]=Number(event.target.value);save();});
 section.querySelector('button').addEventListener('click',()=>{appearance={...defaults};save();});apply();
 window.addEventListener('storage',event=>{if(event.key!==key)return;try{const saved=JSON.parse(event.newValue||'{}');appearance=Object.fromEntries(Object.entries(defaults).map(([name,fallback])=>[name,valid(saved[name])?saved[name]:fallback]));apply();}catch{}});
})();

// Fragment routing must never interpret the skip target as a screen.
document.querySelector('.skip').addEventListener('click',event=>{
 event.preventDefault();
 const content=document.getElementById('main');
 content.focus({preventScroll:true});content.scrollIntoView({block:'start',behavior:'instant'});
});

// Normalize visible passage ranges and count distinct references in shared cards.
function passagePillText(references){const refs=[...new Set(references.filter(Boolean).map(ref=>String(ref).replace(/\s*[-–]\s*/g," – ")))];return (refs[0]||"Passages")+(refs.length>1?" +"+(refs.length-1):"");}
