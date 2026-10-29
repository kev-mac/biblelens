'use strict';
// The connected study workspace reuses the reader, corpus and private-note model.
(() => {
 const el = id => document.getElementById(id);
 const plain = value => String(value || '').replace(/\{[HG]\d+\}|<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
 const excerpt = (value, limit = 180) => {const text = plain(value); return text.length > limit ? text.slice(0, limit).replace(/\s+\S*$/, '') + '…' : text;};
 const edition = () => el('reader-edition').value || 'kjv';
 const refLabel = ref => `${books[ref.book]?.name || 'Passage'} ${ref.chapter}${ref.verse ? ':' + ref.verse + (ref.endVerse && ref.endVerse !== ref.verse ? '–' + ref.endVerse : '') : ''}`;
 const refHash = ref => `#read/${ref.book}/${ref.chapter}${ref.verse ? '/' + ref.verse : ''}`;
 let activeVerse = null, inspectorChapter = '', searchVersion = 0, compareVersion = 0, notebookFilter = 'notes', currentInvestigation = null, comparison = null;
 let resources, contextTab='all', contextKey='';
 // Indicator visibility is a local display choice, independent of record availability.
 function displayChoice(key,fallback){try{return localStorage.getItem(key)||fallback;}catch{return fallback;}}
 function saveDisplayChoice(key,value){try{localStorage.setItem(key,value);}catch{}}
 let evidenceVisible=displayChoice('biblelens-evidence-visible','false')==='true';
 let compareLayout=displayChoice('biblelens-compare-layout',innerWidth<420?'stacked':'side');
 const icon = paths => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
 const icons = {
  read: icon('<path d="M12 5v16M2 3h5a5 5 0 0 1 5 3 5 5 0 0 1 5-3h5v16h-5a5 5 0 0 0-5 2 5 5 0 0 0-5-2H2Z"/>'),
  explore: icon('<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6Z"/>'),
  search: icon('<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>'),
  notebook: icon('<rect x="5" y="3" width="15" height="18" rx="1"/><path d="M2 7h6M2 12h6M2 17h6M12 8h4M12 12h4"/>'),
  compare: icon('<path d="M10 3H3v18h7M14 3h7v18h-7M12 2v20"/>')
 };
 const masthead=el('lensMasthead'), main=el('main');
 const routeTo=window.BibleLensWorkspace.navigate;
 function section(id, html) {const node = document.createElement('section'); node.id = id + '-view'; node.className = 'lens-workspace'; node.hidden = true; node.innerHTML = html; main.append(node); return node;}
 const heading = (kicker, title, copy) => `<div class="lens-page-heading"><span class="lens-kicker">${kicker}</span><h1 tabindex="-1">${title}</h1><p>${copy}</p></div>`;
 const searchView=section('search', `<form class="lens-search-form" id="lens-search-form"><label class="sr-only" for="lens-search-input">Search the library</label><input id="lens-search-input" type="search" maxlength="300" placeholder="A passage, a person, a question…" autocomplete="off"><button class="lens-button" type="button" data-search-cancel>Cancel</button></form><div class="lens-search-suggestions"><span>Try</span>${['Genesis 1','mercy','Mary','Jerusalem'].map(q=>`<button class="lens-button" data-lens-query="${q}">${q}</button>`).join('')}<a href="#chat">Ask a question ↗</a></div><p id="lens-search-status" role="status"></p><div id="lens-search-results" class="lens-search-results"></div>`);
 const searchDialog=document.createElement('dialog');searchDialog.id='lens-search-overlay';searchDialog.setAttribute('aria-label','Search the library');document.body.append(searchDialog);searchDialog.append(searchView);searchView.hidden=false;
 let searchReturn=location.hash.startsWith('#search')?'#discover':location.hash||'#discover';
 window.addEventListener('hashchange',event=>{const previous=new URL(event.oldURL||location.href).hash;if(location.hash.startsWith('#search')&&!previous.startsWith('#search'))searchReturn=previous||'#discover';if(!location.hash.startsWith('#search')){clearTimeout(inputTimer);if(searchDialog.open)searchDialog.close();}});
 searchDialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();searchDialog.close();}});
 searchDialog.addEventListener('close',()=>{if(location.hash.startsWith('#search'))routeTo(searchReturn);});
 section('notebook', heading('Your private record', 'Saved', 'Keep your notes, saved Big Questions, bookmarks, and passage comparisons.') + `<button class="lens-button" data-open-settings>Settings</button><div class="lens-notebook-tools"><div role="group" aria-label="Filter notebook">${[['notes','Notes'],['saved','Saved'],['bookmarks','Bookmarks'],['investigations','Comparisons']].map(([id,label])=>`<button type="button" class="lens-button" data-lens-filter="${id}" aria-pressed="${id==='notes'}">${label}</button>`).join('')}</div><div><button class="lens-button" id="lens-export">Export notes</button><button class="lens-button" id="lens-backup">Full backup</button></div></div><p id="lens-notebook-status" class="lens-collection-meta" role="status"></p><div id="lens-notebook-list" class="lens-notebook-list"></div>`);
 const layout = document.createElement('div'); layout.className = 'lens-reading-layout';
 el('reader-layout').before(layout); layout.append(el('reader-layout'));
 const readingBar = document.createElement('div'); readingBar.id='lensReadingBar'; readingBar.className='lens-reading-bar';
 readingBar.innerHTML=`<div class="lens-reading-location"><span class="lens-kicker">The reading room</span><span id="lens-reading-meta"></span></div><div class="lens-reading-actions"><label class="lens-edition-label"><span class="sr-only">Reading translation</span><select id="lens-edition" aria-label="Reading translation"><option value="kjv">KJV</option><option value="web">WEB</option><option value="asv">ASV</option></select></label><button type="button" id="lens-focus" class="lens-button" aria-pressed="false">Focus</button><button type="button" id="lens-compare" class="lens-button">${icons.compare}<span>Compare</span></button></div>`;
 layout.before(readingBar);
 const inspector = document.createElement('aside'); inspector.id='lensInspector'; inspector.className='lens-inspector'; inspector.setAttribute('aria-label','Passage evidence and notes'); layout.append(inspector);
 const inspectorSheet=document.createElement('dialog');inspectorSheet.id='lens-inspector-sheet';inspectorSheet.className='lens-inspector-sheet';inspectorSheet.setAttribute('aria-label','Passage evidence');inspectorSheet.innerHTML='<div class="sheet-handle" aria-hidden="true"></div><button type="button" class="lens-inspector-sheet-close lens-button" aria-label="Close passage evidence">Close <span aria-hidden="true">×</span></button>';document.body.append(inspectorSheet);
 let inspectorOpener=null;
 function showInspectorSheet(opener){inspectorOpener=opener||el('lens-focus');inspector.hidden=false;compare.hidden=true;compare.open=false;inspectorSheet.append(inspector);if(activeVerse&&innerWidth<1024&&!inspectorSheet.open){const row=el('verse-'+activeVerse);if(row)window.scrollTo({top:window.scrollY+row.getBoundingClientRect().top-64,behavior:'instant'});}if(!inspectorSheet.open)BibleLensPopup.show(inspectorSheet,inspectorOpener);document.getElementById('verse-'+activeVerse)?.classList.add('lens-active-verse');inspectorSheet.scrollTop=0;inspector.querySelector('[data-context-close]')?.focus({preventScroll:true});}
 inspectorSheet.querySelector('button').onclick=()=>inspectorSheet.close();
 inspectorSheet.addEventListener('close',()=>{layout.append(inspector);inspector.hidden=true;document.querySelectorAll('.lens-active-verse').forEach(node=>node.classList.remove('lens-active-verse'));inspectorOpener?.focus({preventScroll:true});});
 function showComparison(){inspector.hidden=true;compare.hidden=false;compare.open=true;if(!inspectorSheet.open)BibleLensPopup.show(inspectorSheet,el('lens-compare'));}
 const mobileLayout=matchMedia('(max-width:760px)');
 const updateEvidenceControl=()=>{el('lens-focus').textContent='Evidence';el('lens-focus').setAttribute('aria-pressed',String(evidenceVisible));};
 mobileLayout.addEventListener('change',updateEvidenceControl);

 const compare = document.createElement('section'); compare.id='lensComparison'; compare.className='lens-comparison'; compare.hidden=true; compare.setAttribute('aria-labelledby','lens-compare-heading');
 compare.innerHTML=`<div class="lens-inspector-header"><div><span class="lens-kicker">Read in parallel</span><h2 id="lens-compare-heading" tabindex="-1">Two passages. One workspace.</h2></div><button type="button" class="lens-panel-close lens-button" id="lens-compare-close" aria-label="Close comparison">×</button></div><form id="lens-comparison-form" class="lens-comparison-form"><label>First passage<input id="lens-compare-left" required maxlength="80" placeholder="Genesis 1" autocomplete="off"></label><label>Second passage<input id="lens-compare-right" required maxlength="80" placeholder="Genesis 2" autocomplete="off"></label><button class="lens-button lens-button-primary" type="submit">Compare passages</button></form><p id="lens-compare-status" role="status">Use a chapter or a verse range, such as Genesis 1:1–5.</p><div class="ux-compare-layout" role="group" aria-label="Passage layout"><button type="button" data-compare-layout="stacked">Stacked</button><button type="button" data-compare-layout="side">Side by side</button></div><div id="lens-compare-results"></div>`;
 inspectorSheet.append(compare);compare.open=false;compare.close=()=>inspectorSheet.close();
 function updateCompareLayout(){compare.dataset.layout=compareLayout;for(const button of compare.querySelectorAll('[data-compare-layout]'))button.setAttribute('aria-pressed',String(button.dataset.compareLayout===compareLayout));}
 compare.addEventListener('click',event=>{const button=event.target.closest('[data-compare-layout]');if(button){compareLayout=button.dataset.compareLayout;saveDisplayChoice('biblelens-compare-layout',compareLayout);updateCompareLayout();}});updateCompareLayout();
 function setFocus(on) {
  document.body.classList.toggle('lens-focus-mode',on); inspector.hidden=on; updateEvidenceControl();
 }
 el('lens-focus').onclick=()=>{evidenceVisible=!evidenceVisible;saveDisplayChoice('biblelens-evidence-visible',String(evidenceVisible));renderInspector();updateEvidenceControl();};updateEvidenceControl();
 el('lens-edition').value=edition();
 el('lens-edition').onchange=()=>{el('reader-edition').value=el('lens-edition').value; el('reader-edition').dispatchEvent(new Event('change')); if(comparison&&!compare.hidden)runComparison(comparison.left,comparison.right);};
 el('lens-compare').onclick=()=>openCompare();
 el('lens-compare-close').onclick=()=>compare.close();
 inspectorSheet.addEventListener('close',()=>{compare.hidden=true;compare.open=false;document.body.classList.remove('lens-comparing'); ++compareVersion; if(location.hash.startsWith('#compare')||location.hash.startsWith('#investigation'))navigateHash(refHash({book:readingBook,chapter:readingChapter})); el('lens-compare').focus();});
 function uniqueRecords(items) {return items.filter((item,index,all)=>all.findIndex(other=>(other.id||other.title+other.summary)===(item.id||item.title+item.summary))===index);}
 function sourceLink(source){const url=source.url||''; return /^https:\/\//.test(url)?`<a class="lens-source-link" href="${esc(url)}" target="_blank" rel="noopener">${esc(source.label||'Source')} ↗</a>`:'';}
 function evidenceHtml(item) {
  const reasoning = item.reasoning || item.text || '', summary = (item.witness ? item.witness + ': ' : '') + (item.summary || item.text || '');
  const alternative = item.alternativeReading || item.alternative || '';
  const alternatives = typeof alternative === 'string' ? alternative : alternative.text || alternative.summary || '';
  const kindLabel=recordTags(item).map(tag=>languageTags[tag]?.label).filter(Boolean).join(' · ') || ({science:'Science',history:'History',contradictions:'Text comparisons',questions:'Questions',commandments:'Commandments'}[item.mode]||item.kind||'Research');
  const refs = (item.refs || []).map(r=>typeof r==='string'?readRef(r):({...r,verse:r.verse||r.first})).filter(r=>Number.isInteger(r?.book)&&Number.isInteger(r.chapter));
  return `<article class="lens-evidence"><div class="lens-evidence-meta"><span data-topic="${item.tag==='T'?'translation':({science:'science',history:'history',questions:'questions',commandments:'commandments',contradictions:'text'})[item.mode]||'text'}">${esc(kindLabel)}</span><span>${esc([...new Set([item.ref,...(item.sides||[]).map(side=>side.ref),...(item.refs||[]).map(ref=>typeof ref==='string'?ref:ref.label||refLabel(ref))].filter(Boolean))].join(' · '))}</span></div><h3>${item.id?`<a href="${window.BibleLensDebates?window.BibleLensDebates.href(item):'#debate/'+encodeURIComponent(item.id)}">${esc(item.title||item.ref||'Passage observation')}</a>`:esc(item.title||item.ref||'Passage observation')}</h3><p>${esc(summary)}</p>${typeof sideRows==='function'?sideRows(item):''}<details><summary>Reasoning & sources</summary>${reasoning&&reasoning!==summary?`<p>${esc(reasoning)}</p>`:''}${item.text&&item.text!==summary&&item.text!==reasoning?`<h4>Recorded source text</h4><p>${esc(item.text)}</p>`:''}${item.languageContext?`<h4>Language & witness</h4><p>${esc(item.languageContext)}</p>`:''}${item.scope?`<h4>Scope & limits</h4><p>${esc(item.scope)}</p>`:''}${alternatives?`<h4>Alternative reading</h4><p>${esc(alternatives)}</p>`:''}${(item.fields||[]).map(field=>`<h4>${esc(field.branch)}</h4><p>${esc(field.text)}</p>${(field.sources||[]).map(sourceLink).join('')}`).join('')}${refs.length?`<div class="lens-evidence-refs">${refs.map(ref=>referenceLink(ref,ref.label)).join('')}</div>`:''}<div class="lens-evidence-sources">${(item.sources||[]).map(sourceLink).join('')||'<p class="lens-collection-meta">No external source is attached to this record.</p>'}</div>${item.checked?`<p class="lens-collection-meta">Source check recorded ${esc(item.checked)}</p>`:''}</details></article>`;
 }
 function renderInspector() {
  if(!reading)return;
  const chapter=`${readingBook}:${readingChapter}`;
  if(inspectorChapter!==chapter){activeVerse=null; inspectorChapter=chapter;}
  const cache=comparisonModes.map(mode=>comparisonCache.get(comparisonKey(mode)));
  const ready=cache.every(record=>record?.status==='ready'), failed=cache.some(record=>record?.status==='error');
  const evidenceEnabled=readerPreferences.compare!=='none';
  const evidenceLoading=evidenceEnabled&&!ready&&!failed;
  el('lens-focus').classList.toggle('loading-state',evidenceLoading);
  el('lens-focus').setAttribute('aria-busy',String(evidenceLoading));
  const records=evidenceEnabled?uniqueRecords((activeVerse?verseComparisons(activeVerse):reading.verses.flatMap(v=>verseComparisons(v.n))).filter(item=>item.mode!=='bookmark')):[];
  el('lens-reading-meta').classList.remove('loading-state');el('lens-reading-meta').textContent=`${reading.verses.length} verses · ${edition().toUpperCase()}`;
  el('lens-edition').value=edition();
  document.querySelectorAll('#chapter-text .verse').forEach(node=>node.classList.toggle('lens-active-verse',inspectorSheet.open&&node.id===`verse-${activeVerse}`));
  // Evidence indicators are real buttons, separate from the reader's bookmark actions.
  for(const marker of document.querySelectorAll('[data-lens-inspect]'))marker.remove();
  for(const verse of reading.verses){if(!evidenceEnabled||!evidenceVisible)break;const row=el('verse-'+verse.n);if(!row||row.querySelector('[data-lens-inspect]'))continue;const count=uniqueRecords(verseComparisons(verse.n).filter(item=>item.mode!=='bookmark')).length;if(!count)continue;const button=document.createElement('button');button.type='button';button.className='lens-verse-evidence';button.dataset.lensInspect=verse.n;button.innerHTML='<span aria-hidden="true">•</span> '+count;button.setAttribute('aria-label',`${count} linked ${count===1?'record':'records'}`);button.setAttribute('aria-pressed',String(activeVerse===verse.n));row.querySelector('.verse-num').after(button);}
  for(const marker of document.querySelectorAll('[data-lens-inspect]'))marker.setAttribute('aria-pressed',String(Number(marker.dataset.lensInspect)===activeVerse));
  if(inspector.contains(document.activeElement)&&/^(TEXTAREA|INPUT)$/.test(document.activeElement.tagName))return;
  const linked=activeVerse?[...el('verse-'+activeVerse)?.querySelectorAll('[data-person-id],[data-place-id]')||[]]:[];
  const openDetails=[...inspector.querySelectorAll('details[open]')].map(node=>node.closest('.lens-evidence')?.querySelector('h3')?.textContent);
  const ref={book:readingBook,chapter:readingChapter,...(activeVerse?{verse:activeVerse}:{})};
  const key=activeVerse?`${chapter}:${activeVerse}`:chapter, registry=activeVerse?state.verseNotes:state.passageNotes;
  if(contextKey!==key){contextTab='all';contextKey=key;}
  const group=item=>(item.tags||[item.tag]).includes('T')?'translations':['science','history'].includes(item.mode)?'science':item.mode==='contradictions'?'cross':'other';
  const tabs=[['all','All'],['cross','Cross references'],['science','Science & history'],['translations','Translations']].map(([id,label])=>({id,label,count:id==='all'?records.length:records.filter(item=>group(item)===id).length})).filter(tab=>tab.id==='all'||tab.count);
  if(!tabs.some(tab=>tab.id===contextTab))contextTab='all';
  const shown=records.filter(item=>contextTab==='all'||group(item)===contextTab);
  inspector.innerHTML=`<div class="lens-inspector-header"><button type="button" class="lens-button" data-lens-return aria-label="Back to verse">‹</button><h2 class="lens-inspector-title" tabindex="-1">${esc(refLabel(ref))}</h2><button type="button" class="lens-button" data-context-close aria-label="Close passage evidence">×</button></div>${!ready?`<p class="lens-coverage" role="status">${failed?'Some evidence could not load.':'Loading attached evidence…'}</p>`:''}${activeVerse?`<div class="ux-verse-actions"><button class="lens-button" data-context-bookmark aria-pressed="${!!state.verseBookmarks?.[key]}" aria-label="Bookmark verse" title="Bookmark verse">${icon('<path d="m19 21-7-4-7 4V3h14z"/>')}<span>Save</span></button><button class="lens-button" data-context-copy aria-label="Copy verse" title="Copy verse">${icon('<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>')}<span>Copy</span></button><button class="lens-button" data-context-compare aria-label="Compare passages" title="Compare passages">${icons.compare}<span>Compare</span></button><button class="lens-button" data-context-note aria-label="Write a note" title="Write a note">${icon('<path d="M4 20h4L21 7l-4-4L4 16zM14 6l4 4"/>')}<span>Note</span></button></div>`:''}${activeVerse&&records.length?`<div class="ux-context-tabs" role="tablist" aria-label="Verse evidence">${tabs.map(tab=>`<button type="button" role="tab" id="context-tab-${tab.id}" aria-controls="ux-context-panel" aria-selected="${tab.id===contextTab}" tabindex="${tab.id===contextTab?0:-1}" data-context-tab="${tab.id}">${tab.label} (${tab.count})</button>`).join('')}</div>`:''}<div class="lens-evidence-list" id="ux-context-panel" ${activeVerse&&records.length?`role="tabpanel" aria-labelledby="context-tab-${contextTab}"`:''}>${shown.slice(0,activeVerse?30:8).map(evidenceHtml).join('')}${evidenceEnabled&&ready&&!records.length?'<p class="lens-empty">Nothing linked to this verse yet.</p>':''}${!activeVerse&&records.length>8?'<p class="lens-collection-meta">Showing 8 records. Choose a verse to see its full set.</p>':''}</div>${activeVerse&&alternativeReadings(activeVerse)?`<details class="lens-alternative-readings"><summary>Context & other readings</summary>${alternativeReadings(activeVerse)}</details>`:''}${linked.length?`<section class="ux-context-links"><h3>People and places</h3>${linked.map(node=>node.outerHTML).join('')}</section>`:''}<button class="lens-button" data-lens-chapter>Whole chapter</button><section class="lens-note-editor" hidden><h3>Your margin note</h3><label class="sr-only" for="lens-margin-note">Private note on ${esc(refLabel(ref))}</label><textarea id="lens-margin-note" maxlength="100000" rows="4" placeholder="What do you notice? What needs more evidence?">${esc(registry?.[key]?.text||'')}</textarea><p class="lens-collection-meta" id="lens-margin-status">Private · saved on this device${globalThis.BibleLensCloud?' · sync follows Settings':''}</p><a href="#notebook">Open Saved ↗</a></section>`;
  for(const details of inspector.querySelectorAll('details'))if(openDetails.includes(details.closest('.lens-evidence')?.querySelector('h3')?.textContent))details.open=true;
  el('lens-margin-note').oninput=event=>{const target=ref.verse?state.verseNotes:state.passageNotes;target[key]={...target[key],book:ref.book,chapter:ref.chapter,name:books[ref.book].name,...(ref.verse?{verse:ref.verse}:{}),text:event.target.value};persist();el('lens-margin-status').textContent=storageAvailable?'Saved on this device.':'Storage unavailable — export your notebook to keep this note.';};
 }
 inspector.addEventListener('keydown',event=>{const tab=event.target.closest('[data-context-tab]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const tabs=[...inspector.querySelectorAll('[data-context-tab]')],index=tabs.indexOf(tab);tabs[event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length].click();});
 function inspectVerse(verse,focus=false,opener=null){contextTab='all';activeVerse=verse;setFocus(false);renderInspector();updateEvidenceControl();if(focus){showInspectorSheet(opener||el('verse-'+verse)?.querySelector('.verse-num'));}}
 document.addEventListener('click',event=>{
  const tab=event.target.closest('[data-context-tab]');if(tab){const offset=inspector.querySelector('.ux-context-tabs').scrollLeft;contextTab=tab.dataset.contextTab;renderInspector();inspector.querySelector('.ux-context-tabs').scrollLeft=offset;inspector.querySelector('[data-context-tab="'+contextTab+'"]')?.focus({preventScroll:true});return;}
  if(event.target.closest('[data-context-bookmark]')){toggleVerseMark('bookmark',readingBook,readingChapter,activeVerse);renderInspector();return;}
  if(event.target.closest('[data-context-close]')){inspectorSheet.close();return;}
  if(event.target.closest('[data-context-note]')){const editor=inspector.querySelector('.lens-note-editor');editor.hidden=false;el('lens-margin-note').focus();return;}
  if(event.target.closest('[data-search-cancel]')){clearTimeout(inputTimer);searchDialog.close();return;}
  if(event.target.closest('[data-context-copy]')){Promise.resolve().then(()=>navigator.clipboard.writeText(refLabel({book:readingBook,chapter:readingChapter,verse:activeVerse})+' '+plain(reading.verses.find(v=>v.n===activeVerse)?.[edition()]))).then(()=>toast('Verse copied.')).catch(()=>toast('Copy unavailable on this device.'));return;}
  if(event.target.closest('[data-context-compare]')){openCompare();return;}
  const marker=event.target.closest('[data-lens-inspect]');if(marker){inspectVerse(Number(marker.dataset.lensInspect),true);return;}
  if(event.target.closest('[data-lens-return]')){if(inspectorSheet.open)inspectorSheet.close();const target=el('verse-'+activeVerse);target?.scrollIntoView({block:'center'});target?.querySelector('[data-lens-inspect]')?.focus({preventScroll:true});return;}
  const jump=event.target.closest('[data-lens-jump]');if(jump){el(jump.dataset.lensJump)?.scrollIntoView({block:'start'});return;}
  if(event.target.closest('[data-lens-chapter]')){activeVerse=null;renderInspector();return;}
  if(event.target.closest('[data-lens-enable-evidence]')){el('reader-compare').click();return;}
  if(event.target.closest('[data-lens-retry]')){for(const mode of comparisonModes)if(comparisonCache.get(comparisonKey(mode))?.status==='error')comparisonCache.delete(comparisonKey(mode));ensureComparisons();renderInspector();return;}
  const query=event.target.closest('[data-lens-query]');if(query){el('lens-search-input').value=query.dataset.lensQuery;el('lens-search-form').requestSubmit();return;}

 });
 document.addEventListener('click',event=>{
  const verse=event.target.closest('#chapter-text .verse');if(!verse||window.getSelection()?.toString())return;
  if(event.target.closest('input,textarea'))return;
  event.preventDefault();event.stopImmediatePropagation();
  const opener=event.target.closest('button,a')||verse.querySelector('.verse-num');
  inspectVerse(Number(verse.id.replace('verse-','')),false);showInspectorSheet(opener);
 },true);
 window.addEventListener('biblelens:readerchange',renderInspector);
 window.addEventListener('biblelens:readererror',()=>{el('lens-focus').classList.remove('loading-state');el('lens-focus').setAttribute('aria-busy','false');el('lens-reading-meta').classList.remove('loading-state');el('lens-reading-meta').textContent='Passage unavailable';inspector.innerHTML='<p>Passage evidence is unavailable until the chapter loads.</p>';});
 window.addEventListener('biblelens:readerloading',()=>{el('lens-reading-meta').textContent='Loading passage…';inspector.innerHTML='<p class="loading-state" role="status">Opening passage evidence…</p>';});
 window.addEventListener('viewchange',event=>{if(event.detail!=='read'&&inspectorSheet.open)inspectorSheet.close();document.body.classList.remove('lens-comparing');const primary=event.detail==='debate'?'debates':event.detail==='chat'?'explore':event.detail==='bookmarks'?'notebook':['read','debates','notebook'].includes(event.detail)?event.detail:'explore';for(const link of masthead.querySelectorAll('[data-lens-view]')){if(link.dataset.lensView===primary)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}if(event.detail==='notebook')renderNotebook();if(event.detail!=='read'){if(compare.open)compare.close();compare.hidden=true;}});
 window.addEventListener('biblelens:statechange',event=>{
  if(event.detail?.source!=='local'&&event.detail?.before&&event.detail?.data){
   const {before,data}=event.detail;
   if(el('lens-margin-note')){const namespace=activeVerse?'verseNotes':'passageNotes',key=inspectorChapter+(activeVerse?':'+activeVerse:'');updateWorkspaceField(el('lens-margin-note'),before[namespace]?.[key]?.text,data[namespace]?.[key]?.text);}
   for(const row of el('lens-notebook-list').querySelectorAll('[data-lens-note]')){
    const [kind,...parts]=row.dataset.lensNote.split(':'),key=parts.join(':');
    const values=snapshot=>kind==='study'?{title:snapshot.noteTitles?.[key],text:snapshot.notes?.[key]}:kind==='investigation'?{title:snapshot.investigations?.[key]?.title,text:snapshot.investigations?.[key]?.note}:snapshot[kind+'Notes']?.[key]||{};
    const previous=values(before),incoming=values(data);updateWorkspaceField(row.querySelector('input'),previous.title,incoming.title);updateWorkspaceField(row.querySelector('textarea'),previous.text,incoming.text);
   }
   if(currentInvestigation&&el('lens-investigation-note')){updateWorkspaceField(el('lens-investigation-note'),before.investigations?.[currentInvestigation]?.note,data.investigations?.[currentInvestigation]?.note);updateWorkspaceField(el('lens-investigation-title'),before.investigations?.[currentInvestigation]?.title,data.investigations?.[currentInvestigation]?.title);}
  }
  if(view==='notebook'&&!el('notebook-view').contains(document.activeElement))renderNotebook();if(event.detail?.source!=='local')renderInspector();
 });
 async function getResources(){if(!resources)resources=Promise.allSettled(['/stories.json','/reference/people.json','/reference/places.json','/characters.json'].map(url=>window.BibleLensReferences.json(url)));const result=await resources;if(result.some(item=>item.status==='rejected'))resources=null;return result;}
 function noteRows(){
  const rows=[];
  for(const [kind,notes,marks] of [['passage',state.passageNotes,state.passageBookmarks],['verse',state.verseNotes,state.verseBookmarks]]){
   for(const [key,record]of Object.entries({...marks,...notes})){const note=notes?.[key];rows.push({kind,key,record,text:note?.text||'',title:note?.title||'',label:`${record.name} ${record.chapter}${record.verse?':'+record.verse:''}`,marked:!!marks?.[key],url:refHash(record)});}
  }
  for(const entry of ENTRIES){if(state.notes[entry.id]||state.noteTitles[entry.id]||state.bookmarks.includes(entry.id))rows.push({kind:'study',key:entry.id,text:state.notes[entry.id]||'',title:state.noteTitles[entry.id]||'',label:entry.title,marked:state.bookmarks.includes(entry.id),url:'#study/'+entry.id});}
  for(const [key,record]of Object.entries(state.investigations||{}))rows.push({kind:'investigation',key,record,title:record.title||'',text:record.note||'',label:`${refLabel(record.left)} / ${refLabel(record.right)}`,url:'#investigation/'+encodeURIComponent(key)});
  return rows;
 }
 window.BibleLensProfiles=async query=>{
  const question=BibleLensSearch.entityQuestion(query);if(!question)return '';
  const catalogs=await getResources(),rows=catalogs[question.kind==='people'?1:2];if(rows.status!=='fulfilled')return '';
  const matches=BibleLensSearch.catalogSearch(rows.value,question.kind,question.name);
  const exact=matches.filter(row=>[row.name,row.label,...(row.aliases||[]),row.fields?.displayTitle,row.fields?.kjvName].filter(value=>typeof value==='string').some(value=>BibleLensSearch.normalize(value)===BibleLensSearch.normalize(question.name)));
  return exact.length?`<section class="ux-profile-answers" aria-label="Matching profiles">${exact.map(row=>question.kind==='people'?`<a class="lens-result" href="#characters/${esc(row.id)}"><strong>${esc(BibleLensSearch.personLabel(row,rows.value))}</strong><span>People profile</span></a>`:`<button class="lens-result" data-place-id="${esc(row.id)}"><strong>${esc(row.fields.displayTitle)}${row.fields.featureType?' ('+esc(row.fields.featureType)+')':''}</strong><span>Place profile</span></button>`).join('')}</section>`:'';
 };
 function resultGroup(title,items){
  if(!items.length)return '';
  const render=item=>item.html||`<a class="lens-result" href="${esc(item.url)}"><strong>${esc(item.title)}</strong>${item.meta?`<small>${esc(item.meta)}</small>`:''}<span>${esc(excerpt(item.text))}</span></a>`;
  return `<section class="lens-result-group" id="lens-results-${title.toLowerCase().replace(/ /g,'-')}"><h2>${title==='Research'?'Evidence':title}</h2><div class="lens-result-list">${items.slice(0,5).map(render).join('')}</div>${items.length>5?`<details class="lens-more-results"><summary>See all ${items.length}</summary><div class="lens-result-list">${items.slice(5).map(render).join('')}</div></details>`:''}</section>`;
 }
 async function runSearch(query){
  const version=++searchVersion,searchEdition=edition();el('lens-search-input').value=query;
  const box=el('lens-search-results'),status=el('lens-search-status');box.innerHTML='';box.removeAttribute('aria-busy');status.classList.remove('loading-state');
  if(!query.trim()){status.textContent='Search by reference or keywords. Your private notes are searched only on this device.';return;}
  status.classList.add('loading-state');status.textContent='Searching the library…';box.setAttribute('aria-busy','true');
  const passageRefs=BibleLensSearch.references(query,books);
  const passageQuery=parseReference(query);
  const overlapsStory=story=>{const ref=storyReference(story.passage);return ref&&passageRefs.some(p=>(p.first===null||p.first>0&&p.last>=p.first)&&ref.book===p.book&&ref.chapter<=p.chapter&&ref.endChapter>=p.chapter&&(p.first===null||(ref.chapter<p.chapter||ref.verse<=p.last)&&(ref.endChapter>p.chapter||ref.endVerse>=p.first)));};
  const words=query.toLowerCase().split(/\s+/).filter(Boolean),matches=value=>words.every(word=>String(value).toLowerCase().includes(word));
  try{
   const [search,references]=await Promise.allSettled([fetch(`/api/search?q=${encodeURIComponent(query)}&edition=${searchEdition}`,{signal:AbortSignal.timeout(20000)}).then(async res=>{if(!res.ok)throw Error('Scripture search could not load. Try again.');return res.json();}),getResources()]);
   if(version!==searchVersion)return;
   const data=search.status==='fulfilled'?search.value:{passages:[],research:[]};
   const catalogs=references.status==='fulfilled'?references.value:[],catalog=index=>catalogs[index]?.status==='fulfilled'?catalogs[index].value:[];
   const terms=data.terms?.length?data.terms:BibleLensSearch.queryTokens(query).map(word=>[word]);
   const storyScore=story=>{
    if(passageRefs.length)return overlapsStory(story)?1:0;
    const title=new Set(BibleLensSearch.tokens(story.title)),text=new Set(BibleLensSearch.tokens(story.title+' '+story.passage+' '+(story.topics||[]).join(' ')+' '+story.summary));
    const hits=terms.filter(group=>group.some(word=>text.has(word))).length,headingHits=terms.filter(group=>group.some(word=>title.has(word))).length;
    return terms.length&&(hits>=Math.ceil(terms.length*.6)||headingHits>=2)?hits+headingHits*3:0;
   };
   const stories=catalog(0).flatMap(group=>group.stories.map(story=>({...story,book:group.book}))).map(story=>({story,score:storyScore(story)})).filter(row=>row.score).sort((a,b)=>b.score-a.score).slice(0,8).map(({story})=>({title:story.title,url:`#stories/${storySlug(story.book)}/${storySlug(story.title)}`,text:story.summary,meta:story.passage}));
   const knownEntities=new Set([...BibleLensSearch.catalogVocabulary(catalog(1),'people',catalog(3)),...BibleLensSearch.catalogVocabulary(catalog(2),'places')]);
   const people=BibleLensSearch.catalogSearch(catalog(1),'people',query,catalog(3),knownEntities).map(person=>({title:BibleLensSearch.personLabel(person,catalog(1)),url:'#characters/'+person.id,text:'Imported reference profile · relationships and passage links'}));
   const places=BibleLensSearch.catalogSearch(catalog(2),'places',query,[],knownEntities).map(place=>({html:`<button type="button" class="lens-result" data-place-id="${esc(place.id)}"><strong>${esc(place.fields.displayTitle+(catalog(2).filter(p=>p.fields.displayTitle===place.fields.displayTitle).length>1&&place.fields.featureType?' ('+place.fields.featureType+')':''))}</strong><small>Historical reference · location identification may be uncertain</small><span>${esc(excerpt(place.fields.dictText?.[0]||place.fields.featureType))}</span></button>`}));
   const notes=noteRows().filter(note=>passageQuery?(note.record?.book===passageQuery.book&&note.record?.chapter===passageQuery.chapter&&(!passageQuery.verse||!note.record.verse||note.record.verse>=passageQuery.verse&&note.record.verse<=passageQuery.endVerse)):matches(note.title+' '+note.label+' '+note.text)).slice(0,12).map(note=>({title:note.title||note.label,url:note.kind==='investigation'?note.url:'#notebook?note='+encodeURIComponent(note.kind+':'+note.key),text:note.text,meta:'Private notebook · '+note.label}));
   const sections={Scripture:data.passages.map(p=>({title:p.label,url:p.url,text:p.text,meta:(data.edition||searchEdition).toUpperCase()})),Research:data.research.map(r=>({title:r.title,url:r.kind==='annotation'?'#debate/'+encodeURIComponent(r.id):r.url,text:r.summary,meta:'Editorial interpretation · '+(r.ref||r.kind||'')})),Stories:stories,People:people,Places:places,'Your notebook':notes};
   const entityQuestion=BibleLensSearch.entityQuestion(query);
   const order=entityQuestion?.kind==='people'&&people.length?['People','Scripture','Research','Stories','Places']:entityQuestion?.kind==='places'&&places.length?['Places','Scripture','Research','Stories','People']:passageRefs.length?['Scripture','Research','Stories','People','Places']:/^where\b/i.test(query)?['Places','Research','Scripture','Stories','People']:/^(who|what|why|how|did|does|is|can)\b/i.test(query)?['Research','Stories','People','Places','Scripture']:people.length?['People','Places','Scripture','Research','Stories']:places.length?['Places','People','Scripture','Research','Stories']:['Scripture','Research','Stories','People','Places'];
   box.innerHTML=[...order,'Your notebook'].map(title=>resultGroup(title,sections[title])).join('');

   const total=data.passages.length+data.research.length+stories.length+people.length+places.length+notes.length;
   status.textContent=`${total} ${total===1?'result':'results'} shown${data.limited?' · Refine your search for more specific matches':''}${search.status==='rejected'?' · Scripture and research search unavailable. Try again.':''}${catalogs.some(r=>r.status==='rejected')?' · Some reference collections are unavailable.':''}.`;
   if(!total)box.innerHTML='<div class="lens-empty"><h2>No connections found yet.</h2><p>Try a shorter phrase, a full book name, or a passage such as John 3:16. The reference collections have uneven coverage.</p></div>';
  }catch(error){if(version===searchVersion)status.textContent=error.message||'Search could not finish. Try again.';}finally{if(version===searchVersion){box.removeAttribute('aria-busy');status.classList.remove('loading-state');}}
 }
 let inputTimer;el('lens-search-input').addEventListener('input',()=>{clearTimeout(inputTimer);inputTimer=setTimeout(()=>el('lens-search-form').requestSubmit(),150);});
 el('lens-search-form').onsubmit=event=>{event.preventDefault();clearTimeout(inputTimer);const q=el('lens-search-input').value.trim();routeTo('#search'+(q?'?q='+encodeURIComponent(q):''));};
 let savedRender=0;
 function renderNotebook(){
  const renderId=++savedRender;
  if(notebookFilter==='saved'){renderSaved(renderId);return;}
  const all=noteRows(),rows=all.filter(note=>notebookFilter==='all'||notebookFilter==='investigations'&&note.kind==='investigation'||notebookFilter==='bookmarks'&&note.marked||notebookFilter==='notes'&&(note.text||note.title));
  el('lens-notebook-status').textContent=`${all.length} saved ${all.length===1?'item':'items'} · Private. Passage links never include your notes.`;
  el('lens-notebook-list').innerHTML=rows.length?rows.map(note=>`<article class="lens-note" data-lens-note="${esc(note.kind+':'+note.key)}"><div class="lens-note-heading"><div><span class="lens-kicker">${note.kind==='investigation'?'Saved comparison':note.marked?'Bookmarked '+(note.kind==='study'?'record':'passage'):'Private note'}</span><h2><a href="${esc(note.url)}">${esc(note.label)}</a></h2></div><a class="lens-button" href="${esc(note.url)}">${note.kind==='investigation'?'Resume':'Open'} ↗</a></div><label class="sr-only">Note title</label><input aria-label="Note title for ${esc(note.label)}" data-lens-note-title maxlength="160" value="${esc(note.title)}" placeholder="Add a title"><label class="sr-only">Your note</label><textarea aria-label="Private note for ${esc(note.label)}" data-lens-note-text maxlength="100000" rows="3" placeholder="Keep a thought, a question, or a source…">${esc(note.text)}</textarea><div class="lens-note-actions"><span class="lens-note-save-status" role="status"></span><button type="button" class="lens-button" data-lens-delete-note>${note.kind==='investigation'?'Delete comparison':'Delete note'}</button>${note.marked?'<button type="button" class="lens-button" data-lens-remove-bookmark>Remove bookmark</button>':''}</div></article>`).join(''):'<div class="lens-empty"><span class="lens-kicker">A place to return to</span><h2>Give a thought somewhere to live.</h2><p>Write a margin note while reading, mark a verse, or save a comparison. It will be waiting here.</p><a class="lens-button lens-button-primary" href="#read">Return to reading</a></div>';
  for(const button of document.querySelectorAll('[data-lens-filter]'))button.setAttribute('aria-pressed',String(button.dataset.lensFilter===notebookFilter));
 }
 async function renderSaved(renderId){
  const saved=Object.entries(window.BibleLensDebateStore.all()).filter(([,value])=>value.saved);
  const entities=saved.filter(([,value])=>value.entity);
  const ids=saved.filter(([,value])=>!value.entity).map(([id])=>id);
  const entityRows=entities.map(([key,{entity}])=>`<article class="lens-note"><h2>${entity.kind==='person'?`<a href="#characters/${encodeURIComponent(entity.id)}">${esc(entity.name)}</a>`:`<button class="lens-button" data-place-id="${esc(entity.id)}">${esc(entity.name)}</button>`}</h2><button type="button" class="lens-button" data-directory-remove="${esc(key)}">Remove from Saved</button></article>`);
  for(const button of document.querySelectorAll('[data-lens-filter]'))button.setAttribute('aria-pressed',String(button.dataset.lensFilter==='saved'));
  el('lens-notebook-status').textContent=`${saved.length} saved ${saved.length===1?'item':'items'} · Stored on this device. Full backups include them.`;
  el('lens-notebook-list').innerHTML=entityRows.length?entityRows.join(''):ids.length?'<p role="status">Loading saved Big Questions…</p>':'<div class="lens-empty"><h2>Keep a question to return to.</h2><p>Save a Big Question to find it here.</p><a class="lens-button" href="#questions">Explore Big Questions</a></div>';
  const rows=await Promise.all(ids.map(async id=>{try{const response=await fetch('/api/debate?'+new URLSearchParams({id}));if(!response.ok)throw Error();return window.BibleLensDebates.card(await response.json());}catch{return `<p>Saved record: ${esc(id)}. <a href="#debate/${encodeURIComponent(id)}">Open or retry</a></p>`;}}));
  if(renderId===savedRender&&saved.length)el('lens-notebook-list').innerHTML=entityRows.concat(rows).join('');
 }
 window.addEventListener('biblelens:debatechange',()=>{if(view==='notebook'&&notebookFilter==='saved')renderNotebook();});
 el('lens-notebook-list').addEventListener('click',event=>{
  const remove=event.target.closest('[data-directory-remove]');if(remove)window.BibleLensDebateStore.write(remove.dataset.directoryRemove,{saved:false});
 });
 el('notebook-view').addEventListener('click',event=>{
  const filter=event.target.closest('[data-lens-filter]');if(filter){routeTo('#notebook?section='+filter.dataset.lensFilter);return;}
  const action=event.target.closest('[data-lens-delete-note],[data-lens-remove-bookmark]'),row=action?.closest('[data-lens-note]');if(!row)return;
  const [kind,...parts]=row.dataset.lensNote.split(':'),key=parts.join(':'),removeMark=action.hasAttribute('data-lens-remove-bookmark');
  if(removeMark&&kind==='verse'){if(state.verseBookmarks[key]){const [book,chapter,verse]=parts.map(Number);toggleVerseMark('bookmark',book,chapter,verse);renderNotebook();}return;}
  confirmNoteAction(removeMark?'Remove this bookmark? Your note will be kept.':kind==='investigation'?'Delete this saved comparison and its private note?':'Delete this note? Any bookmark will be kept.',()=>{
   if(kind==='investigation')delete state.investigations[key];else if(kind==='study'){if(removeMark)state.bookmarks=state.bookmarks.filter(id=>id!==key);else{delete state.notes[key];delete state.noteTitles[key];}}else delete state[kind+(removeMark?'Bookmarks':'Notes')][key];persist();renderNotebook();
  });
 });
 el('notebook-view').addEventListener('input',event=>{
  if(!event.target.matches('[data-lens-note-title],[data-lens-note-text]'))return;
  const row=event.target.closest('[data-lens-note]'),[kind,...parts]=row.dataset.lensNote.split(':'),key=parts.join(':'),title=row.querySelector('input').value,text=row.querySelector('textarea').value;
  if(kind==='investigation'){Object.assign(state.investigations[key],{title,note:text,updatedAt:new Date().toISOString()});}
  else if(kind==='study'){state.notes[key]=text;state.noteTitles[key]=title;}
  else{const record=state[kind+'Notes'][key]||state[kind+'Bookmarks'][key];state[kind+'Notes'][key]={...record,title,text};}
  persist();row.querySelector('.lens-note-save-status').textContent=storageAvailable?'Saved on this device':'Storage unavailable — export to keep your work';
 });
 el('lens-backup').onclick=()=>el('export-backup').click();
 el('lens-export').onclick=()=>download('BibleLens-notebook.md','# BibleLens notebook\n\n'+noteRows().map(note=>`## ${note.title||note.label}\n\n${note.label}\n\n${note.text||'(Bookmark; no note)'}\n`).join('\n'),'text/markdown');
 function parseReference(value){
  const match=/^(.+?)\s*(\d{1,3})(?::(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?)?$/.exec(BibleLensSearch.canonicalBooks(value,books).trim());if(!match)return null;
  const name=match[1].toLowerCase().replace(/[.\s]/g,''),book=books.find(b=>b.name.toLowerCase().replace(/\s/g,'')===name)||books.filter(b=>b.name.toLowerCase().replace(/\s/g,'').startsWith(name)&&name.length>=3).reduce((only,b,i,all)=>all.length===1?b:null,null);
  if(!book||+match[2]<1||+match[2]>book.chapters||match[3]&&(+match[3]<1||+match[3]>176)||match[4]&&+match[4]<+match[3])return null;
  return {book:book.id,chapter:+match[2],...(match[3]?{verse:+match[3],endVerse:+(match[4]||match[3])}:{})};
 }
 function openCompare(){setView('read',false);compare.hidden=false;if(!compare.open)showComparison();document.body.classList.add('lens-comparing');el('lens-compare-left').value=reading?refLabel({book:readingBook,chapter:readingChapter,...(activeVerse?{verse:activeVerse}:{})}):'Genesis 1';el('lens-compare-right').value=comparison?refLabel(comparison.right):'';el('lens-compare-heading').focus({preventScroll:true});compare.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});el('lens-compare-right').focus({preventScroll:true});}
 el('lens-comparison-form').onsubmit=event=>{event.preventDefault();const left=parseReference(el('lens-compare-left').value),right=parseReference(el('lens-compare-right').value);if(!left||!right){el('lens-compare-status').textContent='Use a valid book and chapter, with an optional verse range. For example: Genesis 1:1–5.';return;}currentInvestigation=null;const params=new URLSearchParams({left:refLabel(left),right:refLabel(right),edition:edition()});routeTo('#compare?'+params);};
 async function runComparison(left,right){
  const version=++compareVersion,preserveDraft=comparison&&JSON.stringify(comparison.left)===JSON.stringify(left)&&JSON.stringify(comparison.right)===JSON.stringify(right)&&comparison.id===currentInvestigation;comparison={left,right,id:currentInvestigation};compare.hidden=false;if(!compare.open)showComparison();document.body.classList.add('lens-comparing');el('lens-compare-left').value=refLabel(left);el('lens-compare-right').value=refLabel(right);el('lens-compare-status').classList.add('loading-state');el('lens-compare-status').textContent='Opening both passages and their attached research…';el('lens-compare-results').setAttribute('aria-busy','true');el('lens-compare-results').inert=true;
  const currentEdition=edition(),draft=preserveDraft&&el('lens-investigation-note')?{title:el('lens-investigation-title').value,note:el('lens-investigation-note').value}:null;
  try{
   const [a,b,research]=await Promise.all([...[left,right].map(async ref=>{const res=await fetch(`/api/chapter?book=${ref.book}&chapter=${ref.chapter}`,{signal:AbortSignal.timeout(20000)});if(!res.ok)throw Error('A passage could not load. Try again.');const chapter=await res.json();if(ref.verse&&(!chapter.verses.some(v=>v.n===ref.verse)||ref.endVerse>chapter.verses.at(-1).n))throw Error('That verse range is outside this chapter. Check both references.');return chapter;}),fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:`Compare ${refLabel(left)} and ${refLabel(right)}`,edition:currentEdition}),signal:AbortSignal.timeout(30000)}).then(async res=>res.ok?res.json():null).catch(()=>null)]);
   if(version!==compareVersion)return;
   const renderPassage=(ref,data)=>`<article class="lens-comparison-passage"><div class="lens-kicker">Primary text · ${currentEdition.toUpperCase()}</div><h3>${esc(refLabel(ref))}</h3><a href="${esc(refHash(ref))}">Open in reader ↗</a><div class="lens-parallel-text">${data.verses.filter(v=>!ref.verse||(v.n>=ref.verse&&v.n<=ref.endVerse)).map(v=>`<p><sup>${v.n}</sup> ${esc(plain(v[currentEdition])||'This verse is absent from this edition’s dataset.')}</p>`).join('')}</div></article>`;
   const records=research?.comparison?.records||[],saved=state.investigations?.[currentInvestigation],copy=draft||saved;
   el('lens-compare-results').innerHTML=`<div class="lens-comparison-grid">${renderPassage(left,a)}${renderPassage(right,b)}</div><section class="lens-comparison-notes"><span class="lens-kicker">Connections & limits</span><h3>Attached research</h3><p>These are stored editorial records linked to the passages. Read each record’s sources and limits to assess the evidence.</p>${records.length?records.map(evidenceHtml).join(''):`<p class="lens-empty">${research?'No shared research record is attached to these passages. Compare the wording and context directly.':'Research could not load. The primary passages are available; compare again to retry.'}</p>`}</section><section class="lens-note-editor"><h3>Keep this investigation</h3><label for="lens-investigation-title">Title</label><input id="lens-investigation-title" maxlength="160" value="${esc(copy?.title||refLabel(left)+' / '+refLabel(right))}"><label for="lens-investigation-note">Your private note</label><textarea id="lens-investigation-note" maxlength="100000" rows="4" placeholder="What differs? Which interpretation needs support?">${esc(copy?.note||'')}</textarea><div class="lens-note-actions"><button type="button" class="lens-button lens-button-primary" id="lens-save-investigation">${saved?'Save changes':'Save to notebook'}</button><span id="lens-investigation-status" role="status">${saved?'Saved comparison opened.':''}</span></div></section>`;
   el('lens-compare-status').textContent=`${currentEdition.toUpperCase()} · ${records.length} attached research ${records.length===1?'record':'records'} · direct passage comparison`;
   el('lens-save-investigation').onclick=()=>{state.investigations||={};const id=currentInvestigation||crypto.randomUUID();state.investigations[id]={id,title:el('lens-investigation-title').value.trim()||refLabel(left)+' / '+refLabel(right),left,right,edition:currentEdition,note:el('lens-investigation-note').value,updatedAt:new Date().toISOString()};currentInvestigation=id;comparison.id=id;persist();el('lens-investigation-status').textContent=storageAvailable?'Saved to your private notebook.':'Storage unavailable. Export your notebook now to keep this comparison.';el('lens-save-investigation').textContent='Save changes';navigateHash('#investigation/'+encodeURIComponent(id),{replace:true});};
  }catch(error){if(version===compareVersion){el('lens-compare-status').textContent=error.message;el('lens-compare-results').innerHTML='';}}finally{if(version===compareVersion){el('lens-compare-status').classList.remove('loading-state');el('lens-compare-results').removeAttribute('aria-busy');el('lens-compare-results').inert=false;}}
 }
 function workspaceRoute(hash){
  const [path,query='']=hash.split('?'),params=new URLSearchParams(query);
  if(!path || path==='#' || path==='#discover'){setView('explore',false);return true;}
  if(path==='#search'){searchView.hidden=false;if(!searchDialog.open)BibleLensPopup.show(searchDialog,document.querySelector('.ux-search'));runSearch(params.get('q')||'');el('lens-search-input').focus({preventScroll:true});return true;}
  if(path==='#notebook'){notebookFilter=params.has('note')?'all':['notes','saved','bookmarks','investigations'].includes(params.get('section'))?params.get('section'):'notes';setView('notebook',false);renderNotebook();const note=params.get('note');if(note)requestAnimationFrame(()=>{const row=[...el('lens-notebook-list').children].find(n=>n.dataset.lensNote===note);row?.querySelector('textarea')?.focus();});return true;}
  if(path==='#compare'||path.startsWith('#investigation/')){
   setView('read',false);compare.hidden=false;if(!compare.open)showComparison();if(!books.length){el('lens-compare-status').textContent='Loading the library…';return true;}
   let left,right;
   if(path.startsWith('#investigation/')){try{currentInvestigation=decodeURIComponent(path.slice(15));}catch{currentInvestigation='';}const record=state.investigations?.[currentInvestigation];if(!record){++compareVersion;el('lens-compare-results').removeAttribute('aria-busy');el('lens-compare-results').inert=false;el('lens-compare-status').textContent='This comparison is not in this device’s notebook. Connect your sync account or restore a backup.';el('lens-compare-results').innerHTML='';return true;}({left,right}=record);el('reader-edition').value=record.edition;}
   else{currentInvestigation=null;left=parseReference(params.get('left')||'');right=parseReference(params.get('right')||'');if(['kjv','web','asv'].includes(params.get('edition')))el('reader-edition').value=params.get('edition');}
   if(left&&right){readerPreferences.edition=edition();state.readerPreferences=readerPreferences;if(reading)renderReader(true);runComparison(left,right);requestAnimationFrame(()=>compare.scrollIntoView({block:'start'}));}else openCompare();return true;
  }
  return false;
 }
 window.BibleLensWorkspace={route:workspaceRoute,navigate:routeTo,refresh:renderInspector,inspectVerse};
 renderInspector();inspector.hidden=true;
})();
