'use strict';
// Fetch at most 24 public records for one open category. Notes stay on-device.
const categoryPages=new Map();
let categoryRequest=0,categoryScope='',categorySearch='';
function categoryPersonalItems({book=markedBookSelection,chapter=markedChapterSelection,bookmarksOnly=false}={}){
 const inScope=item=>(book===-1||item.book===book)&&(!chapter||item.chapter===chapter);
 const verses=Object.values({...state.verseBookmarks,...(bookmarksOnly?{}:state.verseNotes)}).filter(inScope).map(item=>({kind:'verse',item}));
 const passages=Object.values({...state.passageBookmarks,...(bookmarksOnly?{}:state.passageNotes)}).filter(inScope).map(item=>({kind:'passage',item}));
 const studies=ENTRIES.filter(e=>(state.bookmarks.includes(e.id)||!bookmarksOnly&&(state.notes[e.id]||state.noteTitles?.[e.id]))&&e.refs.some(ref=>{const p=readRef(ref);return p&&(book===-1||p.book===book)&&(!chapter||p.chapter===chapter);})).map(item=>({kind:'study',item}));
 return [...verses,...passages,...studies];
}
function categoryPersonalCard({kind,item},profile=false){
 if(profile===true)return categoryPersonalProfile(kind,item);
 if(kind==='study')return `<article class="passage-saved-card"><button class="text-button" data-open="${esc(item.id)}">${esc(state.noteTitles?.[item.id]||item.title)}</button><p>${esc(state.notes[item.id]||'')}</p></article>`;
 const key=`${item.book}:${item.chapter}${kind==='verse'?':'+item.verse:''}`,note=kind==='verse'?state.verseNotes[key]||item:state.passageNotes[key]||item;
 const reference=`${books[item.book]?.name||item.name||'Passage'} ${item.chapter}${kind==='verse'?':'+item.verse:''}`;
 return `<article class="passage-saved-card marked-bookmark"><button type="button" class="verse-citation" data-read="${esc(item.book)}/${esc(item.chapter)}${kind==='verse'?'/'+esc(item.verse):''}">${esc(reference)}</button>${kind==='verse'?bookmarkVerseTextHtml(item.book,item.chapter,item.verse):''}${note.title?`<h3>${esc(note.title)}</h3>`:''}${note.text?`<p class="passage-saved-note">${esc(note.text)}</p>`:''}${noteActionButtons(`${item.book}/${item.chapter}${kind==='verse'?'/'+item.verse:''}`)}</article>`;
}
function categoryPersonalProfile(kind,item){
 const study=kind==='study',ref=study?'':`${item.book}/${item.chapter}${kind==='verse'?'/'+item.verse:''}`;
 const key=ref.replaceAll('/',':'),note=study?{title:state.noteTitles?.[item.id],text:state.notes[item.id]}:(kind==='verse'?state.verseNotes[key]:state.passageNotes[key])||item;
 const reference=study?item.title:`${books[item.book]?.name||item.name||'Passage'} ${item.chapter}${kind==='verse'?':'+item.verse:''}`;
 const id='personal-'+kind+'-'+(study?item.id:ref.replaceAll('/','-')),hasNote=!!(note.title||note.text);
 const icon=paths=>`<span class="person-section-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths}</svg></span>`;
 return `<article class="marked-bookmark category-personal-profile" data-tone="bookmark"><h3>${esc(note.title||reference)}</h3>${note.title?`<p class="character-aliases">${esc(reference)}</p>`:''}${kind==='verse'?bookmarkVerseTextHtml(item.book,item.chapter,item.verse):study?`<p>${esc(item.summary||'')}</p>`:''}<div class="person-section-controls" role="group" aria-label="${esc(reference)} saved passage sections"><button type="button" class="person-section-toggle" ${study?`data-open="${esc(item.id)}"`:`data-read="${esc(ref)}"`} aria-label="Read ${esc(reference)}">${icon('<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>')}<span class="person-section-label">Read</span></button><button type="button" class="person-section-toggle" data-personal-section aria-controls="${esc(id)}-note" id="${esc(id)}-note-toggle" aria-expanded="false" ${hasNote?'':'disabled'}>${icon('<path d="M4 3h16v18H4zM8 8h8m-8 4h8m-8 4h5"/>')}<span class="person-section-label">Note</span></button></div><section class="person-section-panel" id="${esc(id)}-note" aria-labelledby="${esc(id)}-note-toggle" hidden><h4>Note</h4>${note.text?`<p class="passage-saved-note">${esc(note.text)}</p>`:''}${study?'':noteActionButtons(ref)}</section></article>`;
}
function categoryQuery(kind,page=0,limit=24){return new URLSearchParams({book:markedBookSelection===-1?'all':String(markedBookSelection),chapter:String(markedChapterSelection),kind,page:String(page),limit:String(limit),theme:markedTheme,type:markedCommandmentType,q:categorySearch});}
function categoryRoute(){
 const match=/^#evidence\/([^?]+)(?:\?(.*))?$/.exec(location.hash);
 return match&&MARKED_CATEGORIES.some(([key])=>key===match[1]&&key!=='all')?{key:match[1],params:new URLSearchParams(match[2]||'')}:null;
}
function categoryLocation(key, index=false){
 const params=categoryQuery(index?key:'all',0,0);params.delete('page');params.delete('limit');
 return '#evidence'+(index?'':'/'+key)+'?'+params;
}
async function renderPagedCategories(){
 const directory=categoryDirectoryLocation(categoryRoute()?.key);if(directory){history.replaceState(null,'',directory);setView(directory.slice(1),false);return;}
 const generation=++markedWorkspaceGeneration;categoryRequest++;
 const box=$('#saved-passages'),route=categoryRoute();
 try{
  if(!books.length){books=await window.BibleLensReferences.json('/api/books');}
  if(generation!==markedWorkspaceGeneration||view!=='evidence')return;
  const params=route?.params||new URLSearchParams(location.hash.split('?')[1]||'');
  if(params.has('book')){const book=params.get('book')==='all'?-1:Number(params.get('book'));if(Number.isInteger(book)&&book>=-1&&book<books.length)markedBookSelection=book;}
  if(params.has('chapter')){const chapter=Number(params.get('chapter'));if(Number.isInteger(chapter)&&chapter>=0&&chapter<=(books[markedBookSelection]?.chapters||0))markedChapterSelection=chapter;}
  if(params.has('q'))categorySearch=params.get('q');
  const searchInput=document.getElementById('directory-evidence-search');if(searchInput)searchInput.value=categorySearch;
  if(params.has('theme'))markedTheme=params.get('theme');
  if(params.has('type')&&['all','moral','civil','ritual'].includes(params.get('type')))markedCommandmentType=params.get('type');
  if(route)markedKind=route.key;
  else if(params.has('kind')&&MARKED_CATEGORIES.some(([key])=>key===params.get('kind')))markedKind=params.get('kind');
  else if(!location.hash.includes('?'))markedKind='all';
  if(markedBookSelection===null)markedBookSelection=readingBook;
  const scope=JSON.stringify([markedBookSelection,markedChapterSelection,markedKind,markedTheme,markedCommandmentType,categorySearch]);if(scope!==categoryScope){categoryPages.clear();categoryScope=scope;}
  $('#categories-heading').textContent=route?MARKED_CATEGORIES.find(([key])=>key===route.key)[1]:'Evidence';
  renderMarkedContext();$('#saved-cards').hidden=true;box.innerHTML='<p role="status">Loading evidence…</p>';
  const response=await fetch('/api/categories?'+categoryQuery('all',0,0));if(!response.ok)throw Error();
  const meta=await response.json();if(generation!==markedWorkspaceGeneration||view!=='evidence')return;
  markedData=meta;const personal=categoryPersonalItems(),counts={...meta.counts,bookmark:personal.length};
  if(!route){
   const links=[...MARKED_CATEGORIES,['timeline','Timeline'],['places','Places']].sort(([a,al],[b,bl])=>al.localeCompare(bl));
   const descriptions={academic:'Science, history and the world of the text.',bookmark:'Your saved passages and private notes.',T:'Language, manuscripts and translation choices.',V:'Accounts examined against biblical commands.',commandments:'The traditional 613, with context and related passages.',Q:'Questions raised by the text and its interpretations.',contradictions:'Compare accounts that differ in detail or perspective.',stories:'Follow narratives across books and themes.',characters:'People, relationships and their place in the story.',prophecies:'Predictions, linked accounts and interpretive context.',timeline:'Explore events in their historical setting.',places:'Locate biblical places and read their stories.'};
   const placesIcon='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
   const timelineIcon='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3v18M5 6h6m-6 6h10m-10 6h6"/><circle cx="14" cy="6" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="14" cy="18" r="2"/></svg>';
   box.innerHTML='<div class="marked-comparisons">'+links.filter(([key])=>key!=='all'&&(markedKind==='all'||markedKind===key)).map(([key,label])=>`<a class="marked-category-pane category-page-link" href="${key==='timeline'?'#timeline':esc(categoryDirectoryLocation(key)||categoryLocation(key))}" data-category-page="${key}" data-tone="${comparisonTone({tag:languageTags[key]?key:undefined,mode:key})}"><span class="marked-category-icon">${key==='timeline'?timelineIcon:key==='places'?placesIcon:categoryIcon(key)}</span><span><span class="library-category-title">${label}</span><span class="library-category-description">${esc(descriptions[key]||'Explore the collection.')}</span></span><span class="marked-count">${key==='timeline'?'All events':key==='places'?'All places':(counts[key]||0).toLocaleString()}</span></a>`).join('')+'</div>';
   box.onclick=null;return;
  }
  const key=route.key;
  const search=document.getElementById('directory-evidence-search');if(search)search.placeholder=`Search ${(counts[key]||0).toLocaleString()} records, titles, references…`;
  let chips=document.getElementById('evidence-directory-chips');
  if(!chips){chips=document.createElement('nav');chips.id='evidence-directory-chips';chips.className='filter-carousel';chips.setAttribute('aria-label','Evidence collections');document.querySelector('#saved-passages').before(chips);}
  chips.innerHTML=MARKED_CATEGORIES.filter(([kind])=>['T','V','Q','academic','contradictions'].includes(kind)).map(([kind,label])=>`<a class="filter-pill${key===kind?' active':''}" href="${esc(categoryLocation(kind))}">${esc(label)} (${(counts[kind]||0).toLocaleString()})</a>`).join('');
  box.innerHTML='<div class="marked-category-content" aria-live="polite"></div>';
  const content=box.querySelector('.marked-category-content');
  async function fill(page){
   const token=++categoryRequest;
   content.innerHTML='<p role="status">Loading results…</p>';
   try{
    let records=[],total=0,current=page;
    if(key==='bookmark'){total=personal.length;current=Math.min(page,Math.max(0,Math.ceil(total/24)-1));records=personal.slice(current*24,(current+1)*24);}
    else{
     const response=await fetch('/api/categories?'+categoryQuery(key,page));if(!response.ok)throw Error();const data=await response.json();
     if(token!==categoryRequest||generation!==markedWorkspaceGeneration||view!=='evidence')return;
     markedData=data;records=data.records;total=data.total;current=data.page;
    }
    if(token!==categoryRequest||generation!==markedWorkspaceGeneration||view!=='evidence')return;
    categoryPages.set(key,current);
    const pages=Math.ceil(total/24),label=MARKED_CATEGORIES.find(([kind])=>kind===key)[1];
    content.innerHTML=`<p class="category-results" role="status">Showing ${(total?current*24+1:0).toLocaleString()}–${Math.min((current+1)*24,total).toLocaleString()} of ${total.toLocaleString()} results</p>`+(records.length?records.map(record=>key==='bookmark'?categoryPersonalCard(record,true):['stories','characters','prophecies'].includes(key)?categoryDirectoryCard(record,key):markedSummary(record,key)).join(''):'<p class="marked-empty">No results for these filters.</p>')+(pages>1?`<nav class="category-pagination" aria-label="${label} results"><button type="button" data-category-offset="-1" ${current===0?'disabled':''}>← Previous</button><span role="status">${current+1} / ${pages}</span><button type="button" data-category-offset="1" ${current+1>=pages?'disabled':''}>Next →</button></nav>`:'');
    hydrateMarkedVerseTexts(++markedRenderGeneration);requestAnimationFrame(fitContextCitations);
   }catch{if(token===categoryRequest)content.innerHTML='<p>Results could not load. <button type="button" data-category-retry>Retry</button></p>';}
  }
  box.onclick=async event=>{
   const personal=event.target.closest('[data-personal-section]');
   if(personal){if(personal.disabled)return;const panel=document.getElementById(personal.getAttribute('aria-controls'));panel.hidden=!panel.hidden;personal.setAttribute('aria-expanded',String(!panel.hidden));return;}

   const section=event.target.closest('[data-category-section]');
   if(section){
    if(section.disabled)return;
    const card=section.closest('.category-profile-card'),panel=document.getElementById(section.getAttribute('aria-controls')),open=panel.hidden;
    for(const control of card.querySelectorAll('[data-category-section]')){const selected=open&&control===section;control.setAttribute('aria-expanded',String(selected));document.getElementById(control.getAttribute('aria-controls')).hidden=!selected;}requestAnimationFrame(fitContextCitations);return;
   }

   const button=event.target.closest('[data-category-offset],[data-category-retry]');if(!button||button.disabled)return;
   const page=categoryPages.get(key)||0;
   await fill(button.hasAttribute('data-category-retry')?page:page+Number(button.dataset.categoryOffset));
   if(generation===markedWorkspaceGeneration&&view==='evidence'){$('#categories-heading').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
  };
  await fill(categoryPages.get(key)||0);
 }catch{if(generation===markedWorkspaceGeneration)box.innerHTML='<p>Evidence could not load. <button type="button" id="categories-retry">Retry</button></p>';box.querySelector('#categories-retry')?.addEventListener('click',renderPagedCategories);}
}
if(view==='evidence')renderPagedCategories();

function categoryDirectoryCard(record,kind){
 if(kind==='stories')return storyCard(record);
 const refs=kind==='characters'?record.placements.slice(0,3).map(p=>({label:`${books[p.book].name} ${p.chapter}:${p.verse}`,ref:p})):[record.prediction_passage,record.fulfillment_passage].filter(Boolean).map(label=>({label,ref:readRef(label)}));
 const citations=refs.filter(r=>r.ref).map(({label,ref})=>`<button type="button" class="verse-citation" data-read="${ref.book}/${ref.chapter}/${ref.verse}">${esc(label)}</button>`).join(' ');
 return `<article class="category-directory-card" data-directory-kind="${kind}"><h3>${esc(record.title)}</h3>${record.summary?`<p>${esc(record.summary)}</p>`:''}<div class="category-directory-references">${citations}</div>${kind==='characters'?`<a class="text-button" href="#characters/${encodeURIComponent(record.id)}" aria-label="Full profile for ${esc(record.title)}">Details ↓</a>`:`<p class="category-prophecy-status">${esc(Object.values(record.taxonomy||{}).join(' · '))}</p>`}</article>`;
}
let bookmarksPage=0,bookmarksGeneration=0;
async function renderBookmarks(){
 const generation=++bookmarksGeneration,box=$('#bookmarks-list');if(view!=='bookmarks')return;
 try{
  if(!books.length){books=await window.BibleLensReferences.json('/api/books');}
  if(generation!==bookmarksGeneration||view!=='bookmarks')return;
  const items=categoryPersonalItems({book:-1,chapter:0,bookmarksOnly:true});
  bookmarksPage=Math.min(bookmarksPage,Math.max(0,Math.ceil(items.length/24)-1));
  const pages=Math.ceil(items.length/24);
  box.innerHTML=items.length?`<p role="status">${items.length} ${items.length===1?'bookmark':'bookmarks'}</p>`+items.slice(bookmarksPage*24,(bookmarksPage+1)*24).map(categoryPersonalCard).join('')+(pages>1?`<nav class="category-pagination" aria-label="Bookmarks results"><button type="button" data-bookmarks-offset="-1" ${bookmarksPage===0?'disabled':''}>← Previous</button><span role="status">${bookmarksPage+1} / ${pages}</span><button type="button" data-bookmarks-offset="1" ${bookmarksPage+1>=pages?'disabled':''}>Next →</button></nav>`:''):'<p class="empty">No bookmarks yet. Bookmark a verse, chapter or record to keep it here.</p>';
  hydrateMarkedVerseTexts(++markedRenderGeneration);
 }catch{box.innerHTML='<p>Bookmarks could not load. <button type="button" data-bookmarks-retry>Retry</button></p>';}
}
$('#bookmarks-list').addEventListener('click',event=>{
 const button=event.target.closest('[data-bookmarks-offset],[data-bookmarks-retry]');if(!button||button.disabled)return;
 if(button.dataset.bookmarksOffset)bookmarksPage+=Number(button.dataset.bookmarksOffset);
 void renderBookmarks();window.scrollTo({top:0,behavior:'instant'});
});
window.addEventListener('viewchange',event=>{if(event.detail==='bookmarks')void renderBookmarks();else bookmarksGeneration++;});
const renderPassagesBeforeBookmarks=renderPassageSaved;
renderPassageSaved=function(){renderPassagesBeforeBookmarks();if(view==='bookmarks')void renderBookmarks();};
if(view==='bookmarks')void renderBookmarks();

document.addEventListener('input',event=>{if(event.target.id!=='directory-evidence-search')return;categorySearch=event.target.value;categoryPages.clear();const route=categoryRoute();if(route){route.params.set('q',categorySearch);history.replaceState(null,'','#evidence/'+route.key+'?'+route.params);}renderPagedCategories();});
