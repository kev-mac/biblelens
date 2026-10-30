'use strict';
// Book-wide narratives are separate from verse-aligned evidence classifications.
let storiesActive=false,storiesRequest=null,storiesGeneration=0,storiesCatalog=null;
function storiesFilterButton(){return '';}
let storiesBook='',storiesTheme='',storiesSearch='',storiesPage=0;
const STORIES_PAGE_SIZE=10;
let storiesSection='';
const STORIES_SECTIONS=['Law','History','Poetry & Wisdom','Prophets','Gospels & Acts','Letters & Revelation'];
function loadStories(){
 if(!storiesRequest){storiesRequest=window.BibleLensReferences.json('/stories.json').then(catalog=>{storiesCatalog=catalog;return catalog;});storiesRequest.catch(()=>{storiesRequest=null;});}
 return storiesRequest;
}
function storyReference(reference){
 const parsed=readRef(reference);if(!parsed)return null;
 const end=/[-–]\s*(?:(\d+):)?(\d+)\s*$/.exec(reference);
 return {...parsed,endChapter:end?.[1]?Number(end[1]):parsed.chapter,endVerse:end?Number(end[2]):parsed.verse};
}
function storySlug(value){return value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function storyRoute(){return /^#stories\/([a-z0-9-]+)\/([a-z0-9-]+)$/.exec(location.hash);}
function storyCard(story, pivot=false){
 const reference=storyReference(story.passage);
 const passage=reference?`<button type="button" class="story-passage" data-story-passage="${esc(story.passage)}" aria-label="Read ${esc(story.passage)} starting at verse ${reference.verse}">${esc(story.passage)}</button>`:`<span>${esc(story.passage)}</span>`;
 const id=(pivot?'topic-story-':'story-')+storySlug(story.title);
 const counts=story.linkedCounts||{};
 const parts=[[counts.crossReferences,'cross-reference'],[counts.science,'science note'],[counts.history,'history note'],[counts.text,'text note']].filter(([n])=>n>0);
 const label=([n,text])=>`${n} ${text}${n===1?'':'s'}`,fullMeta=parts.map(label).join(' • ');
 const ranked=[...parts].sort((a,b)=>b[0]-a[0]);
 const meta=parts.length>2?ranked.slice(0,2).map(label).join(' • ')+` • +${ranked.slice(2).reduce((n,[count])=>n+count,0)} more`:fullMeta;
 const context=reference?` data-story-book="${reference.book}" data-story-chapter="${reference.chapter}" data-story-verse="${reference.verse}" data-story-end-chapter="${reference.endChapter}" data-story-end-verse="${reference.endVerse}"`:'';
 return `<article class="story-card" id="${id}" tabindex="-1"${context}><div class="story-top-row"><span class="passage-badge">${esc(story.passage.replace(/\s*[-–]\s*/g,' – '))}</span>${story.readMinutes?`<span class="read-badge">${story.readMinutes} min read</span>`:''}</div><h${pivot?3:2} class="story-title">${esc(story.title)}</h${pivot?3:2}><div class="story-summary">${String(story.summary).split(/\n\s*\n|<br\s*\/?>(?:\s*<br\s*\/?>)?/gi).map(p=>`<p>${esc(p)}</p>`).join('')}</div><div class="story-footer">${meta?`<span class="story-linked-meta" title="${esc(fullMeta)}" aria-label="${esc(fullMeta)}">${esc(meta)}</span>`:''}<button type="button" class="action-link" data-story-passage="${esc(story.passage)}" aria-label="Read ${esc(story.title)}">Read story →</button></div></article>`;
}
async function renderStoriesView(){
 const section=$('#stories-view');if(!section)return;
 const generation=++storiesGeneration;
 section.hidden=!storiesActive;
 $('#stories-pagination').hidden=true;
 if(!storiesActive)return;
 const route=typeof location==='undefined'?null:storyRoute();
 const list=$('#stories-list');list.setAttribute('aria-busy','true');if(!storiesCatalog)list.innerHTML='<p class="loading-state" role="status">Loading stories…</p>';
 try{
  const catalog=await loadStories();if(generation!==storiesGeneration||!storiesActive)return;
  const themes=[];
  $('#stories-book').innerHTML='<option value="">All Books</option>'+catalog.map(entry=>`<option value="${esc(entry.book)}">${esc(entry.book)}</option>`).join('');
  $('#stories-theme').innerHTML='<option value="">All Themes</option>'+themes.map(theme=>`<option value="${esc(theme)}">${esc(theme)}</option>`).join('');
  $('#stories-book').value=storiesBook;$('#stories-theme').value=storiesTheme;$('#stories-search').value=storiesSearch;
  const query=storiesSearch.trim().toLowerCase();
  const terms=query.match(/[\p{L}\p{N}]+/gu)||[];
  const total=catalog.reduce((n,g)=>n+g.stories.length,0);
  $('#stories-search').placeholder=`Search ${total} stories, themes, passages…`;
  $('#stories-search-clear').hidden=!storiesSearch;
  $('#stories-chips').innerHTML=[['',`All Stories`,total],...STORIES_SECTIONS.map(section=>[section,section,catalog.filter(g=>g.section===section).reduce((n,g)=>n+g.stories.length,0)])].filter(([, ,count])=>count).map(([section,label,count])=>`<button type="button" class="filter-pill${storiesSection===section?' active':''}" data-stories-section="${esc(section)}" aria-pressed="${storiesSection===section}">${esc(label)} (${count})</button>`).join('');
  const filtered=!!(query||storiesBook||storiesTheme||storiesSection||route);
  let stories=catalog.filter(entry=>(!storiesBook||entry.book===storiesBook)&&(!storiesSection||entry.section===storiesSection)).flatMap(entry=>entry.stories).filter(story=>(!storiesTheme||(story.topics||[]).includes(storiesTheme))&&terms.every(term=>[story.title,story.summary,story.passage,...(story.topics||[])].join(' ').toLowerCase().includes(term)));
  if(route)stories=stories.filter(story=>storySlug(story.title)===route[2]);
  $('#stories-results').hidden=false;
  $('#stories-reset').hidden=!filtered;
  const pages=Math.ceil(stories.length/STORIES_PAGE_SIZE);
  storiesPage=Math.max(0,Math.min(storiesPage,Math.max(0,pages-1)));
  const start=storiesPage*STORIES_PAGE_SIZE,visible=stories.slice(start,start+STORIES_PAGE_SIZE);
  $('#stories-results').textContent=`Showing ${stories.length?start+1:0}–${start+visible.length} of ${stories.length} narratives`;
  $('#stories-pagination').hidden=pages<=1;
  $('#stories-previous').disabled=storiesPage===0;$('#stories-next').disabled=storiesPage>=pages-1;
  $('#stories-page-status').textContent=pages>1?`${storiesPage+1} / ${pages}`:'';
  list.innerHTML=stories.length?visible.map(story=>storyCard(story)).join(''):'<p class="empty">No stories match these filters. Try another book or theme, or clear your search.</p>';
  if(route){const selected=stories.find(story=>storySlug(story.title)===route[2]);if(selected){const card=document.getElementById('story-'+route[2]);card?.classList.add('story-linked');card?.focus({preventScroll:true});card?.scrollIntoView({block:'nearest'});}else list.innerHTML='<p class="empty">Story not found. Clear Filters to explore other stories.</p>';}
 }catch{if(generation===storiesGeneration)list.innerHTML='<p>Could not load stories. <button type="button" data-stories-retry>Retry</button></p>';}finally{if(generation===storiesGeneration)list.setAttribute('aria-busy','false');}
}
function updateStoriesFilters(){
 storiesPage=0;storiesBook=$('#stories-book').value;storiesTheme=$('#stories-theme').value;storiesSearch=$('#stories-search').value;
 if(storyRoute())history.replaceState(null,'','#stories');
 renderStoriesView();
}
$('#stories-search').addEventListener('input',updateStoriesFilters);
$('#stories-search-clear').addEventListener('click',()=>{$('#stories-search').value='';updateStoriesFilters();$('#stories-search').focus();});
$('#stories-filter-open').addEventListener('click',()=>{$('#stories-filter-sheet').showModal();$('#stories-filter-open').setAttribute('aria-expanded','true');});
$('#stories-filter-close').addEventListener('click',()=>$('#stories-filter-sheet').close());
$('#stories-filter-sheet').addEventListener('close',()=>$('#stories-filter-open').setAttribute('aria-expanded','false'));
$('#stories-chips').addEventListener('click',event=>{const chip=event.target.closest('[data-stories-section]');if(!chip)return;storiesSection=chip.dataset.storiesSection;storiesPage=0;if(storyRoute())history.replaceState(null,'','#stories');renderStoriesView();});
$('#stories-book').addEventListener('change',updateStoriesFilters);
$('#stories-theme').addEventListener('change',updateStoriesFilters);
$('#stories-reset').addEventListener('click',()=>{storiesPage=0;storiesBook='';storiesTheme='';storiesSearch='';storiesSection='';if(storyRoute())history.replaceState(null,'','#stories');renderStoriesView();});
document.addEventListener('click',async event=>{
 const section=event.target.closest('[data-story-section]');
 if(section){const panel=document.getElementById(section.getAttribute('aria-controls'));if(panel){panel.hidden=!panel.hidden;section.setAttribute('aria-expanded',String(!panel.hidden));}return;}

 const paging=event.target.closest('[data-stories-page]');
 if(paging){
  if(paging.disabled)return;
  storiesPage+=Number(paging.dataset.storiesPage);
  await renderStoriesView();
  if(storiesActive){$('#stories-list').focus({preventScroll:true});$('#stories-list').scrollIntoView?.({block:'start',behavior:'smooth'});}return;
 }
 const chip=event.target.closest('[data-story-topic]');if(chip){openStoryTopic(chip.dataset.storyTopic,chip.dataset.storyOrigin);return;}
 if(event.target.closest('[data-stories-retry]')){renderStoriesView();return;}
 const button=event.target.closest('[data-story-passage]');if(!button)return;
 const ref=storyReference(button.dataset.storyPassage);if(!ref)return;
 closeStoryTopic();storiesActive=false;renderStoriesView();setView('read',false);loadChapter(ref.book,ref.chapter,ref.verse);
});

// Shared character anchors resolve to the full story card, including on a fresh load.
async function routeLinkedStory(){
 const route=storyRoute();
 storiesActive=location.hash==='#stories'||!!route;
 if(route){
  storiesPage=0;storiesSection='';
  const hash=location.hash;
  try{const catalog=await loadStories();if(location.hash!==hash)return;storiesBook=catalog.find(entry=>storySlug(entry.book)===route[1])?.book||'';storiesTheme='';storiesSearch='';}catch{}
 }
 await renderStoriesView();
}
window.addEventListener('hashchange',routeLinkedStory);
window.addEventListener('DOMContentLoaded',routeLinkedStory);
window.addEventListener('viewchange',event=>{storiesActive=event.detail==='stories';renderStoriesView();});

function closeStoryTopic(){const sheet=$('#story-topic-sheet');if(sheet?.open)sheet.close();}
async function openStoryTopic(topic,origin){
 const catalog=await loadStories();
 const matches=catalog.flatMap(entry=>entry.stories).filter(story=>story.passage!==origin&&(story.topics||[]).includes(topic));
 const sheet=$('#story-topic-sheet');
 $('#story-topic-heading').textContent=topic;
 $('#story-topic-results').textContent=`${matches.length} other ${matches.length===1?'story':'stories'}`;
 $('#story-topic-body').innerHTML=matches.length?matches.map(story=>storyCard(story,true)).join(''):'<p class="empty">No other stories share this theme yet.</p>';
 if(!sheet.open)sheet.showModal();
 document.body.classList.add('story-topic-open');
 $('#story-topic-body').scrollTop=0;
 $('#story-topic-close').focus();
}
$('#story-topic-close').onclick=closeStoryTopic;
$('#story-topic-sheet').addEventListener('click',event=>{if(event.target!==event.currentTarget)return;const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeStoryTopic();});
$('#story-topic-sheet').addEventListener('close',()=>document.body.classList.remove('story-topic-open'));
$('#story-topic-sheet').addEventListener('cancel',()=>document.body.classList.remove('story-topic-open'));
window.addEventListener('hashchange',()=>{closeStoryTopic();if($('#stories-filter-sheet').open)$('#stories-filter-sheet').close();});
window.addEventListener('viewchange',closeStoryTopic);
