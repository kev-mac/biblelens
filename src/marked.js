'use strict';
// Book-scoped comparison browsing uses public records; personal marks use local storage with optional cloud sync.
const markedComparisonCache=new Map();
let markedBookSelection=null,markedChapterSelection=0,markedKind='all',markedTheme='all',markedCommandmentType='all',markedWorkspaceGeneration=0,markedData=null;
const MARKED_CATEGORIES=[['all','All categories'],['bookmark','Marked'],['T','Translation'],['V','Violations'],['commandments','Commandments'],['Q','Questions'],['academic','Academic'],['contradictions','Contradictions']];
function markedChoices(record,placement){const item={...record,...placement},tags=recordTags(item);return tags.length?tags.map(tag=>({...item,tag})):item.mode==='questions'?[{...item,tag:'Q'}]:[item];}
const COMMANDMENT_THEMES=["Worship of God","Sabbath and rest","Family","Life and violence","Marriage and sexual conduct","Property and economics","Truth and justice","Food and purity","Festivals and sacrifice","Care for the poor and the stranger","Love of God and neighbor","Prayer and fasting","Baptism and the Lord's Supper","Church life and order"];
function markedCommandmentMatches(record){return record.mode!=='commandments'||((markedTheme==='all'||record.theme===markedTheme)&&(markedCommandmentType==='all'||record.commandmentType===markedCommandmentType));}
function markedCommandmentGroups(matches){return COMMANDMENT_THEMES.map(theme=>{const group=matches.filter(r=>r.theme===theme).sort((a,b)=>Number(!!b.tenCommandments)-Number(!!a.tenCommandments));return group.length?'<section class="marked-theme-group"><h3 class="marked-theme-heading">'+esc(theme)+' <span class="marked-count">'+group.length+'</span></h3>'+group.map(markedSummary).join('')+'</section>':'';}).join('');}
function markedCommandmentTypeChips(){return '<div class="commandment-filter-chips" role="group" aria-label="Commandment type">'+[['all','All types'],['moral','Moral'],['civil','Civil'],['ritual','Ritual']].map(([key,label])=>'<button type="button" data-commandment-type="'+key+'" aria-pressed="'+(markedCommandmentType===key)+'">'+label+'</button>').join('')+'</div>';}
function markedRecordVisible(record){return record.placements.some(p=>markedChoices(record,p).some(visibleComparison));}
function markedMatchingPlacements(record){return record.placements.filter(p=>(!markedChapterSelection||p.chapter===markedChapterSelection)&&markedChoices(record,p).some(choice=>visibleComparison(choice)&&(markedKind==='all'||filterCategory(choice)===markedKind)));}
function markedCardId(record){return 'marked-comparison-'+markedData.records.findIndex(r=>r.key===record.key);}
function markedVerseRow(chapter,verse){
 const book=markedBookSelection,label=`${books[book].name} ${chapter}:${verse}`,item=markedData.verses[chapter+':'+verse],edition=$('#reader-edition').value||'kjv',text=item?.[edition]||item?.kjv;
 return `<div class="marked-verse-row"><button type="button" class="verse-citation" data-read="${book}/${chapter}/${verse}">${esc(label)}</button>${text?`<p class="marked-verse-text">${esc(String(text).replace(/\{[HG]\d+\}/g,''))}</p>`:`<p class="marked-verse-text" data-marked-verse-text="${book}/${chapter}/${verse}" aria-busy="true">Loading verse text…</p>`}</div>`;
}
function markedGroup(record){
 const choices=markedMatchingPlacements(record).flatMap(p=>markedChoices(record,p)).filter(visibleComparison);
 return markedKind!=='all'?markedKind:choices.sort((a,b)=>categoryRank(a)-categoryRank(b)).map(filterCategory)[0];
}
function markedPrimaryReferences(record){
 const byRef=new Map();
 if(record.sides?.length){for(const side of record.sides){const ref=readRef(side.ref);if(!ref)continue;const key=`${ref.book}/${ref.chapter}/${ref.verse}`;if(!byRef.has(key))byRef.set(key,{...ref,label:side.ref,quotes:[]});const quotes=byRef.get(key).quotes;if(!quotes.includes(side.quote))quotes.push(side.quote);}}
 else{
  const placements=record.placements.filter(p=>p.placementRole==='key');
  const primary=placements.length?placements.map(p=>({book:markedBookSelection,chapter:p.chapter,verse:p.verse})):record.ref?[readRef(record.ref)].filter(Boolean):[];
  for(const ref of primary){const key=`${ref.book}/${ref.chapter}/${ref.verse}`,verse=ref.book===markedBookSelection?markedData.verses[ref.chapter+':'+ref.verse]:null;byRef.set(key,{...ref,label:`${books[ref.book].name} ${ref.chapter}:${ref.verse}`,quotes:verse?.kjv?[verse.kjv]:[]});}
 }
 return [...byRef.values()].sort((a,b)=>a.book-b.book||a.chapter-b.chapter||a.verse-b.verse);
}
function markedPrimaryRows(primary,choice){return '<div class="summary-citations">'+primary.map(ref=>referenceLink(ref,undefined,choice)).join('')+'</div>';}
function markedSummary(record){
 const placement=markedMatchingPlacements(record)[0],selected=markedChoices(record,placement).find(c=>visibleComparison(c)&&(markedKind==='all'||filterCategory(c)===markedKind))||record;
 const group=markedGroup(record),choice={...selected,tag:languageTags[group]?group:undefined,mode:group==='academic'?'science':group};
 const key='marked:'+markedBookSelection+':'+record.key,open=comparisonEvidenceOpen.has(key),id=markedCardId(record),title=record.title||`${books[markedBookSelection].name} ${placement.chapter}:${placement.verse}`;
 const primary=markedPrimaryReferences(record);
 const secondary=roleCitations({...choice,sides:primary.map(ref=>({ref:ref.label,quote:ref.quotes.join(' ')}))});
 return `<article class="marked-comparison-card comparison-panel" id="${id}" data-tone="${comparisonTone(choice)}" tabindex="-1"><div class="comparison-summary" tabindex="0" data-summary-toggle data-evidence-key="${esc(key)}" aria-expanded="${open}" aria-label="Category summary. Double-click or press Enter for details."><h3>${esc(title)}</h3>${commandmentLabels(record)}<p>${esc(summaryText(record))}</p><button type="button" class="summary-expand" data-summary-expand aria-label="${open?'Collapse':'Expand'} references and reasoning" aria-expanded="${open}" aria-controls="${id}-evidence"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><button type="button" class="summary-inspect" data-comparison-inspect aria-label="Details & sources" title="Details & sources"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></button><div class="comparison-evidence" id="${id}-evidence" ${open?'':'hidden'}>${markedPrimaryRows(primary,choice)}${secondary}${relatedStudyPassages(record)}${commandmentRepetitions(record)}${comparisonReasoning(record)?`<p class="summary-reasoning"><b>Reasoning:</b> ${esc(comparisonReasoning(record))}</p>`:''}</div></div><details class="comparison-details" hidden><summary>Details & sources</summary><p>${esc(record.text||record.summary)}</p>${relatedStudyPassages(record)}${scienceDetails(record)}${record.scope?`<p>${esc(record.scope)}</p>`:''}<div class="comparison-sources">${(record.sources||[]).map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)} ↗</a>`).join('')}</div></details></article>`;
}
function renderMarkedContext(){
 const summary=[books[markedBookSelection].name,markedChapterSelection?String(markedChapterSelection):'',markedKind==='all'?'':MARKED_CATEGORIES.find(c=>c[0]===markedKind)[1],markedTheme==='all'?'':markedTheme,markedCommandmentType==='all'?'':markedCommandmentType].filter(Boolean).join(' · ');
 const context=$('#header-context');context.dataset.marked=summary;if(view==='saved'){context.textContent=summary;context.parentElement?.setAttribute('aria-label',summary+' — Filter');}
 $('#marked-context').innerHTML=`<button type="button" id="marked-filter-open" class="secondary" aria-haspopup="dialog" aria-controls="marked-filter-dialog" aria-label="Filter marked verses and categories"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4"/></svg><span>Filter</span></button>`;
 $('#marked-filter-open').onclick=openMarkedFilters;
}
function renderMarkedResults(){
 renderMarkedContext();const box=$('#saved-passages'),book=markedBookSelection;
 const marks=Object.values({...state.verseBookmarks,...state.verseNotes}).filter(v=>v.book===book&&(!markedChapterSelection||v.chapter===markedChapterSelection)).sort((a,b)=>a.chapter-b.chapter||a.verse-b.verse);
 const passages=Object.values({...state.passageBookmarks,...state.passageNotes}).filter(v=>v.book===book&&(!markedChapterSelection||v.chapter===markedChapterSelection));
 const records=markedKind==='bookmark'?[]:markedData.records.filter(markedRecordVisible).filter(markedCommandmentMatches).filter(record=>markedMatchingPlacements(record).length);
 const showMarks=markedKind==='all'||markedKind==='bookmark';
 let html=showMarks&&marks.length?`<h2>Marked</h2><div class="marked-bookmarks">${marks.map(item=>`<article class="passage-saved-card marked-bookmark" data-tone="bookmark">${markedVerseRow(item.chapter,item.verse)}${state.verseNotes[`${book}:${item.chapter}:${item.verse}`]?.title?`<h3>${esc(state.verseNotes[`${book}:${item.chapter}:${item.verse}`].title)}</h3>`:''}${state.verseNotes[`${book}:${item.chapter}:${item.verse}`]?.text?`<p class="passage-saved-note">${esc(state.verseNotes[`${book}:${item.chapter}:${item.verse}`].text)}</p>`:''}${noteActionButtons(`${book}/${item.chapter}/${item.verse}`)}</article>`).join('')}</div>`:'';
 if(showMarks&&passages.length)html+=`<h2>Marked Passages</h2>${passages.map(item=>`<article class="passage-saved-card marked-bookmark" data-tone="bookmark"><button class="verse-citation" data-read="${book}/${item.chapter}">${esc(item.name)} ${item.chapter}</button>${item.title?`<h3>${esc(item.title)}</h3>`:''}${item.text?`<p>${esc(item.text)}</p>`:''}${noteActionButtons(`${book}/${item.chapter}`)}</article>`).join('')}`;
 const personal=html;html='';
 if(records.length||markedData.records.some(r=>r.mode==='commandments')&&['all','commandments'].includes(markedKind))html+='<div class="marked-comparisons">'+MARKED_CATEGORIES.filter(([key])=>!['all','bookmark'].includes(key)).map(([key,label])=>{const matches=records.filter(record=>markedGroup(record)===key);return matches.length||(key==='commandments'&&markedData.records.some(r=>r.mode==='commandments')&&(markedKind==='all'||markedKind==='commandments'))?`<details class="marked-category-pane" data-tone="${comparisonTone({tag:languageTags[key]?key:undefined,mode:key})}"><summary><span class="marked-category-icon">${categoryIcon(key)}</span>${label}<span class="marked-count">${matches.length}</span></summary><div class="marked-category-content">${key==='commandments'?markedCommandmentTypeChips()+(matches.length?markedCommandmentGroups(matches):'<p class="marked-empty">No commandments match these filters.</p>'):matches.map(markedSummary).join('')}</div></details>`:'';}).join('')+'</div>';
 html+=personal;
 const notes=ENTRIES.filter(e=>(state.notes[e.id]||state.noteTitles?.[e.id])&&e.refs.some(ref=>readRef(ref)?.book===book));
 if(showMarks&&notes.length)html+='<h2>Study Notes</h2>'+notes.map(e=>`<article class="passage-saved-card"><button class="text-button" data-open="${e.id}">${esc(state.noteTitles?.[e.id]||e.title)}</button><p>${esc(state.notes[e.id]||'')}</p></article>`).join('');
 box.onclick=ev=>{const button=ev.target.closest('[data-commandment-type]');if(button){markedCommandmentType=button.dataset.commandmentType;renderMarkedResults();box.querySelector('[data-tone="commandments"].marked-category-pane')?.setAttribute('open','');box.querySelector('[data-commandment-type="'+markedCommandmentType+'"]')?.focus();}};
 box.innerHTML=html||'<p class="marked-empty">No verses match these filters.</p>';
 $('#saved-cards').hidden=true;hydrateMarkedVerseTexts(++markedRenderGeneration);requestAnimationFrame(fitContextCitations);
}
async function renderMarkedWorkspace(){
 for(const key of comparisonEvidenceOpen)if(key.startsWith('marked:'))comparisonEvidenceOpen.delete(key);
 const generation=++markedWorkspaceGeneration;
 try{
  if(!books.length){const response=await fetch('/api/books');if(!response.ok)throw Error();books=await response.json();}
  if(generation!==markedWorkspaceGeneration)return;
  if(markedBookSelection===null)markedBookSelection=readingBook;
  renderMarkedContext();$('#saved-passages').innerHTML='<p role="status">Loading categories…</p>';$('#saved-cards').hidden=true;
  let request=markedComparisonCache.get(markedBookSelection);
  if(!request){request=fetch('/api/marked-comparisons?book='+markedBookSelection).then(r=>{if(!r.ok)throw Error();return r.json();});markedComparisonCache.set(markedBookSelection,request);request.catch(()=>markedComparisonCache.delete(markedBookSelection));if(markedComparisonCache.size>4)markedComparisonCache.delete(markedComparisonCache.keys().next().value);}
  const data=await request;if(generation!==markedWorkspaceGeneration||view!=='saved')return;markedData=data;renderMarkedResults();
 }catch{if(generation===markedWorkspaceGeneration){$('#saved-passages').innerHTML='<p>Could not load categories. <button type="button" id="marked-retry">Try again</button></p>';$('#marked-retry').onclick=renderMarkedWorkspace;}}
}
function openMarkedFilters(){
 let dialog=$('#marked-filter-dialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='marked-filter-dialog';dialog.className='glass-dialog';dialog.setAttribute('aria-labelledby','marked-filter-title');document.body.append(dialog);}
 let chosen=markedBookSelection,chapter=markedChapterSelection,kind=markedKind,theme=markedTheme,type=markedCommandmentType,testament=chosen<39?'old':'new',step='book';
 dialog.innerHTML=`<div class="sheet-heading"><h2 id="marked-filter-title">Filter</h2><button type="button" data-marked-filter-close aria-label="Close filters">×</button></div><nav class="passage-steps" aria-label="Filter selection"><button type="button" data-marked-step="book"></button><button type="button" data-marked-step="chapter"></button><button type="button" data-marked-step="category"></button></nav><fieldset data-marked-pane="book"><legend>Book</legend><div class="passage-testaments"><button type="button" data-marked-testament="old">Old Testament</button><button type="button" data-marked-testament="new">New Testament</button></div><div class="marked-book-grid"></div></fieldset><fieldset data-marked-pane="chapter" hidden><legend>Chapter</legend><div class="marked-chapter-grid"></div></fieldset><fieldset data-marked-pane="category" hidden><legend>Category</legend><div class="marked-kind-grid"></div><div class="commandment-dialog-filters" hidden><p>Types are browsing aids; they do not decide present-day applicability.</p><label>Theme<select id="marked-theme-filter">${[['all','All themes'],...COMMANDMENT_THEMES.map(t=>[t,t])].map(([value,label])=>`<option value="${esc(value)}">${esc(label)}</option>`).join('')}</select></label><label>Commandment type<select id="marked-type-filter"><option value="all">All types</option><option value="moral">Moral</option><option value="civil">Civil</option><option value="ritual">Ritual</option></select></label></div></fieldset><button type="button" id="marked-filter-apply" class="primary">Apply filters</button>`;
 dialog.onchange=()=>{theme=dialog.querySelector('#marked-theme-filter').value;type=dialog.querySelector('#marked-type-filter').value;};
 function render(){
  dialog.querySelector('.commandment-dialog-filters').hidden=!['all','commandments'].includes(kind);dialog.querySelector('#marked-theme-filter').value=theme;dialog.querySelector('#marked-type-filter').value=type;
  dialog.querySelectorAll('[data-marked-step]').forEach(button=>{button.textContent=button.dataset.markedStep==='book'?books[chosen].name:button.dataset.markedStep==='chapter'?(chapter?'Chapter '+chapter:'All chapters'):MARKED_CATEGORIES.find(c=>c[0]===kind)[1];button.setAttribute('aria-pressed',String(button.dataset.markedStep===step));});
  dialog.querySelectorAll('[data-marked-pane]').forEach(pane=>pane.hidden=pane.dataset.markedPane!==step);
  dialog.querySelectorAll('[data-marked-testament]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.markedTestament===testament)));
  dialog.querySelector('.marked-book-grid').innerHTML=books.filter(b=>testament==='old'?b.id<39:b.id>=39).map(b=>`<button type="button" data-marked-book="${b.id}" aria-label="${esc(b.name)}" title="${esc(b.name)}" aria-pressed="${b.id===chosen}">${BOOK_CITATION_ABBREVIATIONS[b.id]}</button>`).join('');
  dialog.querySelector('.marked-chapter-grid').style.setProperty('--number-columns',books[chosen].chapters>100?'9':'8');
  dialog.querySelector('.marked-chapter-grid').innerHTML=`<button type="button" class="marked-all-chapters" data-marked-chapter="0" aria-pressed="${chapter===0}">All chapters</button>`+Array.from({length:books[chosen].chapters},(_,i)=>`<button type="button" data-marked-chapter="${i+1}" aria-pressed="${chapter===i+1}">${i+1}</button>`).join('');
  dialog.querySelector('.marked-kind-grid').innerHTML=MARKED_CATEGORIES.map(([key,label])=>`<button type="button" data-marked-kind="${key}" data-tone="${comparisonTone({tag:languageTags[key]?key:undefined,mode:key})}" aria-pressed="${kind===key}">${key==='all'?'':categoryIcon(key)}${label}</button>`).join('');
 }
 dialog.onclick=ev=>{const button=ev.target.closest('button');if(!button)return;if(button.hasAttribute('data-marked-filter-close')){dialog.close();return;}if(button.id==='marked-filter-apply'){markedBookSelection=chosen;markedChapterSelection=chapter;markedKind=kind;markedTheme=theme;markedCommandmentType=type;dialog.close();renderMarkedWorkspace();window.scrollTo({top:0,behavior:'instant'});return;}
  if(button.dataset.markedStep)step=button.dataset.markedStep;
  if(button.dataset.markedTestament)testament=button.dataset.markedTestament;
  if(button.dataset.markedBook!==undefined){chosen=Number(button.dataset.markedBook);chapter=0;step='chapter';}
  if(button.dataset.markedChapter!==undefined){chapter=Number(button.dataset.markedChapter);step='category';}
  if(button.dataset.markedKind){kind=button.dataset.markedKind;}
  render();
 };render();dialog.showModal();
}

const renderSavedPassagesLegacy=renderPassageSaved;
renderPassageSaved=function(){renderSavedPassagesLegacy();if(view==='saved')renderMarkedWorkspace();};
window.addEventListener('viewchange',ev=>{if(ev.detail==='saved')renderMarkedWorkspace();else markedWorkspaceGeneration++;});
if(view==='saved')renderMarkedWorkspace();

// Match the Read category menu: reveal at the bottom while scrolling toward the top.
(() => {
 let lastY=window.scrollY;
 function reveal(){document.body.classList.toggle('marked-filter-visible',view==='saved'&&window.scrollY>=20);}
 window.addEventListener('scroll',()=>{
  const y=Math.max(0,window.scrollY),delta=y-lastY;
  if(view!=='saved'){lastY=y;return;}
  if(y<20)document.body.classList.remove('marked-filter-visible');
  else if(Math.abs(delta)>=4){if(delta>0&&document.activeElement===$('#marked-filter-open'))document.activeElement.blur();document.body.classList.toggle('marked-filter-visible',delta<0);}
  if(Math.abs(delta)>=4||y<20)lastY=y;
 },{passive:true});
 window.addEventListener('viewchange',()=>{lastY=window.scrollY;reveal();});reveal();
})();
