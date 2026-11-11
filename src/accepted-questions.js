'use strict';
(() => {
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const store=window.BibleLensDebateStore;
 let pending,current,version=0;
 const load=()=>pending||=(fetch('/accepted-questions.json').then(r=>{if(!r.ok)throw Error();return r.json();}).catch(e=>{pending=null;throw e;}));
 const href=row=>row.href||'#debate/'+row.id;
 const readings=row=>row.readings.map((reading,index)=>`<section><h3>${index===0?'A':'B'} · ${esc(reading.label)}</h3><p>${esc(reading.summary)}</p></section>`).join('');
 const labels=row=>row.labels.map(label=>`<span class="phase2-verdict" data-assessment="${esc(label.toLowerCase())}">${esc(uiTitleCase(label))}</span>`).join('');
 const order=['B25','B17','B16','B01','B26','B18','B08','B02','B27','B19','B13','B03','B28','B20','B14','B04','B29','B21','B09','B05','B30','B22','B10','B06','B23','B11','B07','B24','B12','B15'];
 const card=row=>`<a class="phase2-debate-card" href="${href(row)}"><div class="story-top-row"><span class="passage-badge">${esc(passagePillText([...row.side_a,...row.side_b].map(p=>p.ref)))}</span></div><h2 class="story-title">${esc(row.question)}</h2>${row.topic?`<p>${esc(row.summary)}</p>`:''}<div class="story-footer"><span class="assessment-tags">${row.labels.length?labels(row):`<span class="phase2-verdict">${row.topic?'Passage comparison':''}</span>`}</span><span class="action-link">View question</span></div></a>`;
 const subjects=()=>[['','All'],['text-vs-text',scriptureComparison('text')],['text-vs-history',scriptureComparison('History')],...['Astronomy','Geology','Biology'].map(value=>[value,value])];
 const subjectTitle=value=>subjects().find(([key])=>key===value)?.[1]||'Contradictions';
 const listHref=({subject='',finding='',query='',page=0}={})=>{
  const params=new URLSearchParams({collection:'featured'});
  if(subject)params.set('subject',subject);if(finding)params.set('finding',finding);if(query)params.set('q',query);if(page)params.set('page',String(page));
  return '#questions?'+params;
 };
 const navigate=hash=>window.BibleLensWorkspace.navigate(hash);
 let lastList='#questions',lastSubject='',searchTimer;
 async function list(host,hash=location.hash){
  const previous=new URLSearchParams(lastList.split('?')[1]||''),params=new URLSearchParams(hash.split('?')[1]||'');
  const searchFocused=document.activeElement?.id==='accepted-search'&&['subject','finding'].every(key=>previous.get(key)===params.get(key));
  const token=++version;current=null;lastList=hash;lastSubject=params.get('subject')||'';
  const subject=lastSubject,selected=params.get('finding')||'',query=params.get('q')||'',heading=subject?subjectTitle(subject):'Contradictions';
  clearTimeout(searchTimer);setView('debates',false);delete host.dataset.directoryMounted;
  if(subject&&!subjects().some(([value])=>value===subject)){host.innerHTML='<h1>Contradictions</h1><div class="lens-empty"><h2>Subject Filter Unavailable</h2><p>Choose an included subject to browse its questions.</p><a class="lens-button" href="#questions">All Contradictions</a></div>';return;}
  host.innerHTML=`<div class="page-heading"><h1 tabindex="-1">${esc(heading)}</h1><button data-accepted-filters type="button" aria-label="Filter questions" aria-haspopup="dialog" aria-controls="accepted-question-filters">Filters</button></div><div class="characters-search-box"><input id="accepted-search" type="search" aria-label="Search questions" value="${esc(query)}" placeholder="Search questions, passages…"></div><nav class="directory-categories" aria-label="Question subjects"></nav><p class="lens-collection-meta accepted-collection-intro">Selected questions and passage comparisons. <a href="#questions?mode=text">Browse all Text Comparisons</a>.</p><div data-accepted-active-filters></div><p class="directory-results" role="status"></p><div class="accepted-questions phase2-debate-grid" role="status">Loading questions…</div>`;
  try{
   const [rows,overview]=await Promise.all([load(),fetch('/comparison-topics.json').then(async r=>({rows:r.ok?await r.json():[],available:r.ok})).catch(()=>({rows:[],available:false}))]);
   if(token!==version)return;
   const ordered=[...overview.rows.map(row=>({...row,topic:true,question:row.title,labels:[],side_a:row.passages.map(ref=>({ref})),side_b:[]})),...order.map(id=>rows.find(r=>r.decisionId===id)).filter(Boolean)];
   const first=row=>[...row.side_a,...row.side_b].map(p=>readRef(p.ref)).filter(Boolean).sort((x,y)=>x.book-y.book||x.chapter-y.chapter||(x.verse||0)-(y.verse||0))[0]||{book:999,chapter:0,verse:0};
   ordered.sort((a,b)=>{const x=first(a),y=first(b);return x.book-y.book||x.chapter-y.chapter||(x.verse||0)-(y.verse||0)||String(a.id||a.title).localeCompare(String(b.id||b.title));});
   const slot=host.querySelector('.accepted-questions'),search=host.querySelector('#accepted-search'),chips=host.querySelector('.directory-categories'),count=host.querySelector('.directory-results');
   slot.removeAttribute('role');
   const inSubject=(row,value)=>!value||row.comparison===value||row.branch===value;
   const collection=ordered.filter(row=>inSubject(row,subject));
   const terms=query.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
   const searched=collection.filter(row=>terms.every(term=>[row.question,...row.labels,...row.side_a.map(s=>s.ref),...row.side_b.map(s=>s.ref)].join(' ').toLocaleLowerCase().includes(term)));
   const matches=searched.filter(row=>!selected||row.labels.includes(selected)),pages=Math.ceil(matches.length/24);
   const page=Math.max(0,Math.min(Math.floor(Number(params.get('page'))||0),Math.max(0,pages-1)));
   const route=change=>listHref({subject,finding:selected,query,page,...change});
   const clear=()=>navigate(route({finding:'',query:'',page:0}));
   search.placeholder=`Search ${collection.length} questions, passages…`;
   const active=[selected?'Finding: '+uiTitleCase(selected):'',query?'Search: “'+query+'”':''].filter(Boolean);
   host.querySelector('[data-accepted-active-filters]').innerHTML=active.length?`<p class="lens-collection-meta" role="status">${esc(active.join(' · '))}</p>${matches.length?'<button class="lens-button" type="button" data-accepted-clear>Clear filters</button>':''}`:'';
   host.querySelector('[data-accepted-clear]')?.addEventListener('click',clear);
   if(!overview.available){
    const warning=document.createElement('p');warning.className='lens-collection-meta';warning.setAttribute('role','status');warning.textContent='Some comparison overviews could not load. The available questions are shown. ';
    const retry=document.createElement('button');retry.type='button';retry.className='lens-button';retry.textContent='Retry overviews';retry.onclick=()=>list(host,hash);warning.append(retry);slot.before(warning);
   }
   count.textContent=`Showing ${matches.length?page*24+1:0}–${Math.min((page+1)*24,matches.length)} of ${matches.length.toLocaleString()} questions`;
   slot.innerHTML=matches.slice(page*24,(page+1)*24).map(card).join('')||(collection.length?`<div class="lens-empty"><h2>No Questions Match These Filters</h2><p>${collection.length.toLocaleString()} questions are available in this collection. Clear the finding and search to browse them.</p><button type="button" class="lens-button" data-accepted-reset>Clear filters</button></div>`:'<div class="lens-empty"><h2>No Questions in This Collection Yet</h2><p>This included collection has no questions to display.</p><a class="lens-button" href="#questions?mode=text">Browse all Text Comparisons</a></div>');
   slot.querySelector('[data-accepted-reset]')?.addEventListener('click',clear);
   const paging=document.createElement('nav');paging.className='phase2-pagination';paging.setAttribute('aria-label','Question pages');paging.hidden=pages<=1;
   paging.innerHTML=`<button type="button" ${page===0?'disabled':''}>Previous</button><span>${page+1} / ${Math.max(1,pages)}</span><button type="button" ${page+1>=pages?'disabled':''}>Next</button>`;
   paging.firstElementChild.onclick=()=>navigate(route({page:page-1}));paging.lastElementChild.onclick=()=>navigate(route({page:page+1}));slot.after(paging);
   let sheet=document.getElementById('accepted-question-filters');
   if(!sheet){sheet=document.createElement('dialog');sheet.id='accepted-question-filters';sheet.className='stories-filter-sheet';sheet.dataset.directorySection='evidence';document.body.append(sheet);}
   sheet.setAttribute('aria-label','Filter '+heading);
   sheet.innerHTML=`<div class="stories-sheet-heading"><h2>Filter ${esc(heading)}</h2><button type="button" aria-label="Close question filters">×</button></div><div class="directory-categories"></div><nav class="ux-study-links" aria-label="Question collections"><a class="lens-button" href="#questions">All Contradictions</a><a class="lens-button" href="#questions?mode=text">Text Comparisons</a><a class="lens-button" href="#discover?section=evidence">Evidence & Interpretations</a></nav>`;
   sheet.querySelector('button').onclick=()=>sheet.close();sheet.querySelectorAll('a').forEach(link=>link.onclick=()=>sheet.close());
   const options=['',...new Set(ordered.flatMap(row=>row.labels))];
   sheet.querySelector('.directory-categories').replaceChildren(...options.map(value=>{
    const button=document.createElement('button'),total=value?searched.filter(row=>row.labels.includes(value)).length:searched.length;
    button.type='button';button.className='filter-pill'+(selected===value?' active':'');button.setAttribute('aria-pressed',String(selected===value));button.disabled=!!value&&!total;
    button.textContent=(value?uiTitleCase(value):'All questions')+' ('+total+')';button.onclick=()=>{sheet.close();navigate(route({finding:value,page:0}));};return button;
   }));
   host.querySelector('[data-accepted-filters]').onclick=()=>sheet.showModal();
   chips.replaceChildren(...subjects().map(([value,label])=>{
    const button=document.createElement('button');button.type='button';button.className='filter-pill'+(subject===value?' active':'');button.dataset.acceptedSubject=value;button.setAttribute('aria-pressed',String(subject===value));
    button.textContent=label+' ('+ordered.filter(row=>inSubject(row,value)).length+')';
    // A finding from another subject must not silently empty this collection.
    button.onclick=()=>navigate(route({subject:value,finding:'',page:0}));return button;
   }));
   search.oninput=()=>{clearTimeout(searchTimer);const value=search.value;searchTimer=setTimeout(()=>navigate(route({query:value,page:0})),200);};
   if(searchFocused)requestAnimationFrame(()=>{search.focus({preventScroll:true});search.setSelectionRange(search.value.length,search.value.length);});
   restoreNavigation();
  }catch{
   if(token!==version)return;
   host.innerHTML=`<h1>${esc(heading)}</h1><div class="lens-empty"><h2>Questions Could Not Load</h2><p>Please try again.</p><button class="lens-button" data-accepted-retry>Retry</button></div>`;host.querySelector('[data-accepted-retry]').onclick=()=>list(host,hash);
  }
 }

 function controls(){if(!current)return;const value=store.read(current.id);const button=document.querySelector('[data-accepted-save]');if(button){button.setAttribute('aria-pressed',String(value.saved));button.textContent=value.saved?'Saved':'Save';}}
 async function detail(id){
  const token=++version;const host=document.getElementById('debate-view');host.dataset.evidenceHeading='Contradictions';setView('debate',false);host.innerHTML='<p>Loading selected question…</p>';
  try{const row=(await load()).find(row=>row.id===id);if(token!==version)return;if(!row){host.innerHTML='<h1>Contradiction Not Found</h1><a class="lens-button" href="#questions">Explore Contradictions</a>';return;}await window.BibleLensFeatures.load('study');if(token!==version)return;current=row;
   const passage=entry=>`<h3>${referenceLink(entry.ref,undefined,{mode:'contradictions'})||`<a class="lens-button" href="${esc(entry.href)}">${esc(passagePillText([entry.ref]))}</a>`}</h3><blockquote>${entry.verses.map(v=>esc(v.text)).join(' ')}</blockquote>`;
   host.innerHTML=`<a class="lens-button" href="${esc(lastList)}">← ${esc(lastSubject?subjectTitle(lastSubject):'Contradictions')}</a><h1 tabindex="-1">${esc(row.question)}</h1><p>Explore both readings and their sources, with research limits to guide your own assessment.</p><div class="phase2-sides">${readings(row)}</div><div>${labels(row)}</div><details class="editorial-status-info"><summary>About these editorial labels</summary><p>These are provisional editorial labels, not a scholarly consensus. Read the sources and limits for this question.</p><a href="#method">Method & Sources</a></details><p>Evidence strength: Not assigned</p><details><summary class="lens-button">Passages and Research Limits</summary>${[...row.side_a,...row.side_b].map(passage).join('')}<p>${esc(row.limits)}</p></details><details><summary class="lens-button">Sources</summary>${row.sources.filter(s=>/^https:\/\//.test(s.url)).map(s=>`<a class="phase2-source" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`).join('')}</details><section class="question-save"><button class="lens-button" data-accepted-save aria-pressed="false">Save</button></section>`;controls();if(!navigationRestore)host.querySelector('h1').focus({preventScroll:true});restoreNavigation();
  }catch{if(token!==version)return;host.innerHTML=`<h1>Question Unavailable</h1><p>The selected question or its passage references could not load.</p><button type="button" class="lens-button" data-accepted-detail-retry>Retry</button><a class="lens-button" href="${esc(lastList)}">Return to questions</a>`;host.querySelector('[data-accepted-detail-retry]').onclick=()=>detail(id);}
 }
 document.addEventListener('click',event=>{if(!current||view!=='debate')return;if(event.target.closest('[data-accepted-save]'))store.write(current.id,{saved:!store.read(current.id).saved});controls();});
 window.BibleLensAcceptedQuestions={list,route(hash){version++;clearTimeout(searchTimer);const sheet=document.getElementById('accepted-question-filters');if(sheet?.open)sheet.close();if(hash.split('?')[0]==='#questions'&&new URLSearchParams(hash.split('?')[1]||'').get('collection')==='featured'&&!hash.includes('draft=1')){list(document.getElementById('debates-view'),hash);return true;}if(/^#debate\/headline-\d\d(?:\?|$)/.test(hash)&&!hash.includes('draft=1')){detail(hash.slice(8).split('?')[0]);return true;}current=null;return false;}};
})();
