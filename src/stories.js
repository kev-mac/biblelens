'use strict';
// Book-wide narratives are separate from verse-aligned evidence classifications.
let storiesActive=false,storiesRequest=null,storiesGeneration=0,storiesCatalog=null;
function storiesFilterButton(){return '';}
let storiesBook='',storiesTheme='',storiesSearch='';
function loadStories(){
 if(!storiesRequest){storiesRequest=fetch('/stories.json').then(response=>{if(!response.ok)throw Error('Stories unavailable');return response.json();}).then(catalog=>{storiesCatalog=catalog;return catalog;});storiesRequest.catch(()=>{storiesRequest=null;});}
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
 const passage=reference?`<button type="button" class="story-passage" data-story-passage="${esc(story.passage)}" aria-label="Read ${esc(story.passage)} starting at verse ${reference.verse}">${esc(story.passage)} →</button>`:`<span>${esc(story.passage)}</span>`;
 const topics=(story.topics||[]).map(topic=>`<button type="button" class="story-theme" data-story-topic="${esc(topic)}" data-story-origin="${esc(story.passage)}" aria-haspopup="dialog" aria-controls="story-topic-sheet"><span aria-hidden="true">#</span> ${esc(topic)}</button>`).join('');
 const references=story.cross_references.map(label=>{const ref=storyReference(label);return ref?`<button type="button" class="verse-citation story-reference" data-cite="${ref.book}/${ref.chapter}/${ref.verse}" data-cite-end="${ref.endVerse}" data-cite-end-chapter="${ref.endChapter}" data-cite-label="${esc(label)}" data-cite-preview aria-haspopup="dialog" aria-expanded="false">${esc(label)}</button>`:'';}).join('');
 return `<article class="story-card" id="${pivot?'topic-story-':'story-'}${storySlug(story.title)}" tabindex="-1"><h3>${esc(story.title)}</h3>${passage}<p>${esc(story.summary)}</p>${topics?`<div class="story-themes"><span class="story-themes-label">Themes</span>${topics}</div>`:''}${references?`<div class="story-references"><span>Referenced in:</span> ${references}</div>`:''}</article>`;
}
async function renderStoriesView(){
 const section=$('#stories-view');if(!section)return;
 const generation=++storiesGeneration;
 section.hidden=!storiesActive;
 if(!storiesActive)return;
 const route=typeof location==='undefined'?null:storyRoute();
 const list=$('#stories-list');list.innerHTML='<p role="status">Loading stories…</p>';
 try{
  const catalog=await loadStories();if(generation!==storiesGeneration||!storiesActive)return;
  const themes=[...new Set(catalog.flatMap(entry=>entry.stories.flatMap(story=>story.topics||[])))].sort();
  $('#stories-book').innerHTML='<option value="">All books</option>'+catalog.map(entry=>`<option value="${esc(entry.book)}">${esc(entry.book)}</option>`).join('');
  $('#stories-theme').innerHTML='<option value="">All themes</option>'+themes.map(theme=>`<option value="${esc(theme)}">${esc(theme)}</option>`).join('');
  $('#stories-book').value=storiesBook;$('#stories-theme').value=storiesTheme;$('#stories-search').value=storiesSearch;
  const query=storiesSearch.trim().toLowerCase();
  const stories=catalog.filter(entry=>!storiesBook||entry.book===storiesBook).flatMap(entry=>entry.stories).filter(story=>(!storiesTheme||(story.topics||[]).includes(storiesTheme))&&(!query||[story.title,story.summary,story.passage,...(story.topics||[])].join(' ').toLowerCase().includes(query)));
  $('#stories-results').textContent=`${stories.length} ${stories.length===1?'story':'stories'}`;
  list.innerHTML=stories.length?stories.map(story=>storyCard(story)).join(''):'<p class="empty">No stories match these filters. Try another book or theme, or clear your search.</p>';
  if(route){const selected=stories.find(story=>storySlug(story.title)===route[2]);if(selected){const card=document.getElementById('story-'+route[2]);card?.classList.add('story-linked');card?.focus({preventScroll:true});card?.scrollIntoView({block:'nearest'});}else list.innerHTML='<p class="empty">Story not found. Clear filters to explore other stories.</p>';}
 }catch{if(generation===storiesGeneration)list.innerHTML='<p>Could not load stories. <button type="button" data-stories-retry>Retry</button></p>';}
}
function updateStoriesFilters(){
 storiesBook=$('#stories-book').value;storiesTheme=$('#stories-theme').value;storiesSearch=$('#stories-search').value;
 if(storyRoute())history.replaceState(null,'','#stories');
 renderStoriesView();
}
$('#stories-search').addEventListener('input',updateStoriesFilters);
$('#stories-book').addEventListener('change',updateStoriesFilters);
$('#stories-theme').addEventListener('change',updateStoriesFilters);
$('#stories-reset').addEventListener('click',()=>{storiesBook='';storiesTheme='';storiesSearch='';if(storyRoute())history.replaceState(null,'','#stories');renderStoriesView();});
document.addEventListener('click',event=>{
 const chip=event.target.closest('[data-story-topic]');if(chip){openStoryTopic(chip.dataset.storyTopic,chip.dataset.storyOrigin);return;}
 if(event.target.closest('[data-stories-retry]')){renderStoriesView();return;}
 const button=event.target.closest('[data-story-passage]');if(!button)return;
 const ref=storyReference(button.dataset.storyPassage);if(!ref)return;
 closeStoryTopic();storiesActive=false;renderStoriesView();setView('explore',false);loadChapter(ref.book,ref.chapter,ref.verse);
});

// Shared character anchors resolve to the full story card, including on a fresh load.
async function routeLinkedStory(){
 const route=storyRoute();
 storiesActive=location.hash==='#stories'||!!route;
 if(route){
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
window.addEventListener('hashchange',closeStoryTopic);
window.addEventListener('viewchange',closeStoryTopic);
