'use strict';
// Fetch at most 24 public records for one open category. Notes stay on-device.
const categoryPages=new Map();
let categoryRequest=0,categoryScope='';
function categoryPersonalItems(){
 const inScope=item=>(markedBookSelection===-1||item.book===markedBookSelection)&&(!markedChapterSelection||item.chapter===markedChapterSelection);
 const verses=Object.values({...state.verseBookmarks,...state.verseNotes}).filter(inScope).map(item=>({kind:'verse',item}));
 const passages=Object.values({...state.passageBookmarks,...state.passageNotes}).filter(inScope).map(item=>({kind:'passage',item}));
 const studies=ENTRIES.filter(e=>(state.notes[e.id]||state.noteTitles?.[e.id])&&e.refs.some(ref=>markedBookSelection===-1||readRef(ref)?.book===markedBookSelection)).map(item=>({kind:'study',item}));
 return [...verses,...passages,...studies];
}
function categoryPersonalCard({kind,item}){
 if(kind==='study')return `<article class="passage-saved-card"><button class="text-button" data-open="${esc(item.id)}">${esc(state.noteTitles?.[item.id]||item.title)}</button><p>${esc(state.notes[item.id]||'')}</p></article>`;
 const key=`${item.book}:${item.chapter}${kind==='verse'?':'+item.verse:''}`,note=kind==='verse'?state.verseNotes[key]||item:state.passageNotes[key]||item;
 const reference=`${books[item.book].name} ${item.chapter}${kind==='verse'?':'+item.verse:''}`;
 return `<article class="passage-saved-card marked-bookmark"><button type="button" class="verse-citation" data-read="${item.book}/${item.chapter}${kind==='verse'?'/'+item.verse:''}">${esc(reference)}</button>${kind==='verse'?`<p class="marked-verse-text" data-marked-verse-text="${item.book}/${item.chapter}/${item.verse}" aria-busy="true">Loading verse text…</p>`:''}${note.title?`<h3>${esc(note.title)}</h3>`:''}${note.text?`<p class="passage-saved-note">${esc(note.text)}</p>`:''}${noteActionButtons(`${item.book}/${item.chapter}${kind==='verse'?'/'+item.verse:''}`)}</article>`;
}
function categoryQuery(kind,page=0,limit=24){return new URLSearchParams({book:markedBookSelection===-1?'all':String(markedBookSelection),chapter:String(markedChapterSelection),kind,page:String(page),limit:String(limit),theme:markedTheme,type:markedCommandmentType});}
async function renderPagedCategories(){
 const generation=++markedWorkspaceGeneration;categoryRequest++;
 const box=$('#saved-passages');
 try{
  if(!books.length){const response=await fetch('/api/books');if(!response.ok)throw Error();books=await response.json();}
  if(generation!==markedWorkspaceGeneration||view!=='saved')return;
  if(markedBookSelection===null)markedBookSelection=readingBook;
  const scope=JSON.stringify([markedBookSelection,markedChapterSelection,markedKind,markedTheme,markedCommandmentType]);if(scope!==categoryScope){categoryPages.clear();categoryScope=scope;}
  renderMarkedContext();$('#saved-cards').hidden=true;box.innerHTML='<p role="status">Loading categories…</p>';
  const response=await fetch('/api/categories?'+categoryQuery('all',0,0));if(!response.ok)throw Error();
  const meta=await response.json();if(generation!==markedWorkspaceGeneration||view!=='saved')return;
  markedData=meta;const personal=categoryPersonalItems(),counts={...meta.counts,bookmark:personal.length};
  box.innerHTML='<div class="marked-comparisons">'+MARKED_CATEGORIES.filter(([key])=>key!=='all'&&(markedKind==='all'||markedKind===key)).map(([key,label])=>`<details class="marked-category-pane" data-category-page="${key}" data-tone="${comparisonTone({tag:languageTags[key]?key:undefined,mode:key})}"><summary><span class="marked-category-icon">${categoryIcon(key)}</span>${label}<span class="marked-count">${counts[key]||0}</span></summary><div class="marked-category-content"></div></details>`).join('')+'</div>';
  async function fill(pane,page){
   const token=++categoryRequest,key=pane.dataset.categoryPage,content=pane.querySelector('.marked-category-content');
   content.innerHTML='<p role="status">Loading results…</p>';
   try{
    let records=[],total=0,current=page;
    if(key==='bookmark'){total=personal.length;current=Math.min(page,Math.max(0,Math.ceil(total/24)-1));records=personal.slice(current*24,(current+1)*24);}
    else{
     const response=await fetch('/api/categories?'+categoryQuery(key,page));if(!response.ok)throw Error();const data=await response.json();
     if(token!==categoryRequest||generation!==markedWorkspaceGeneration||!pane.open||view!=='saved')return;
     markedData=data;records=data.records;total=data.total;current=data.page;
    }
    if(token!==categoryRequest||!pane.open)return;
    categoryPages.set(key,current);
    const pages=Math.ceil(total/24);
    content.innerHTML=(records.length?records.map(record=>key==='bookmark'?categoryPersonalCard(record):markedSummary(record,key)).join(''):'<p class="marked-empty">No results for these filters.</p>')+(pages>1?`<nav class="category-pagination" aria-label="${pane.querySelector('summary').textContent.replace(/\d+$/,'').trim()} results"><button type="button" data-category-offset="-1" ${current===0?'disabled':''}>← Previous</button><span role="status">${current+1} / ${pages}</span><button type="button" data-category-offset="1" ${current+1>=pages?'disabled':''}>Next →</button></nav>`:'');
    hydrateMarkedVerseTexts(++markedRenderGeneration);requestAnimationFrame(fitContextCitations);
   }catch{if(token===categoryRequest&&pane.open)content.innerHTML='<p>Results could not load. <button type="button" data-category-retry>Retry</button></p>';}
  }
  box.addEventListener('toggle',event=>{
   const pane=event.target;if(!pane.matches?.('[data-category-page]')||!pane.open)return;
   for(const other of box.querySelectorAll('[data-category-page]'))if(other!==pane){other.open=false;other.querySelector('.marked-category-content').replaceChildren();}
   void fill(pane,categoryPages.get(pane.dataset.categoryPage)||0);
  },{capture:true,signal:categoryListenerSignal()});
  box.onclick=event=>{
   const button=event.target.closest('[data-category-offset],[data-category-retry]');if(!button||button.disabled)return;
   const pane=button.closest('[data-category-page]'),page=categoryPages.get(pane.dataset.categoryPage)||0;
   void fill(pane,button.hasAttribute('data-category-retry')?page:page+Number(button.dataset.categoryOffset));pane.querySelector('summary').focus();
  };
 }catch{if(generation===markedWorkspaceGeneration)box.innerHTML='<p>Categories could not load. <button type="button" id="categories-retry">Retry</button></p>';box.querySelector('#categories-retry')?.addEventListener('click',renderPagedCategories);}
}
let categoryListeners;
function categoryListenerSignal(){categoryListeners?.abort();categoryListeners=new AbortController();return categoryListeners.signal;}
if(view==='saved')renderPagedCategories();
