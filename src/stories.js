'use strict';
// Book-wide narratives are separate from verse-aligned evidence classifications.
let storiesActive=false,storiesRequest=null,storiesGeneration=0,storiesCatalog=null;
function storiesFilterButton(){
 if(!storiesRequest)loadStories().then(()=>comparisonStatus()).catch(()=>{});
 const available=storiesCatalog===null||!!storiesCatalog.find(entry=>entry.book===books[readingBook]?.name)?.stories.length;
 return `<button type="button" class="agreement category-filter stories" data-category-filter="stories" data-brightness="${available?'open':'empty'}" aria-pressed="${storiesActive}" aria-controls="stories-view" aria-label="Stories" title="Stories" ${!available&&!storiesActive?'disabled':''}><span class="filter-icon">${categoryIcon('stories')}</span><span class="filter-copy"><span class="filter-label">Stories</span></span></button>`;
}
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
function storyCard(story){
 const reference=storyReference(story.passage);
 const passage=reference?`<button type="button" class="story-passage" data-story-passage="${esc(story.passage)}" aria-label="Read ${esc(story.passage)} starting at verse ${reference.verse}">${esc(story.passage)} →</button>`:`<span>${esc(story.passage)}</span>`;
 const references=story.cross_references.map(label=>{const ref=storyReference(label);return ref?`<button type="button" class="verse-citation story-reference" data-cite="${ref.book}/${ref.chapter}/${ref.verse}" data-cite-end="${ref.endVerse}" data-cite-end-chapter="${ref.endChapter}" data-cite-label="${esc(label)}" data-cite-preview aria-haspopup="dialog" aria-expanded="false">${esc(label)}</button>`:'';}).join('');
 return `<article class="story-card" id="story-${storySlug(story.title)}" tabindex="-1"><h3>${esc(story.title)}</h3>${passage}<p>${esc(story.summary)}</p>${references?`<div class="story-references"><span>Referenced in:</span> ${references}</div>`:''}</article>`;
}
async function renderStoriesView(){
 const section=$('#stories-view');if(!section)return;
 const generation=++storiesGeneration;
 section.hidden=!storiesActive;$('#reader-layout').hidden=storiesActive;document.body.classList.toggle('stories-active',storiesActive);
 if(!storiesActive)return;
 const route=typeof location==='undefined'?null:storyRoute();
 const name=route?route[1].replace(/(^|-)([a-z])/g,(_,dash,letter)=>(dash?' ':'')+letter.toUpperCase()):books[readingBook]?.name;
 $('#stories-heading').innerHTML=`Stories in <button type="button" class="passage-heading-picker" aria-label="Choose book, chapter and verse" aria-haspopup="dialog" aria-controls="passage-picker">${esc(name)}</button>`;
 const list=$('#stories-list');list.innerHTML='<p role="status">Loading stories…</p>';
 try{
  const catalog=await loadStories();if(generation!==storiesGeneration||!storiesActive)return;
  const stories=catalog.find(entry=>entry.book===name)?.stories||[];
  list.innerHTML=stories.length?stories.map(storyCard).join(''):'<p class="empty">No stories have been added for this book yet. You can still read every chapter and verse.</p>';
  if(route){const selected=stories.find(story=>storySlug(story.title)===route[2]);if(selected){const card=document.getElementById('story-'+route[2]);card?.classList.add('story-linked');card?.focus({preventScroll:true});section.scrollIntoView?.({block:'start'});card?.scrollIntoView({block:'nearest'});}else list.innerHTML='<p class="empty">Story not found. Choose another story from the Characters directory.</p>';}
 }catch{if(generation===storiesGeneration)list.innerHTML='<p>Could not load stories. <button type="button" data-stories-retry>Retry</button></p>';}
}
document.addEventListener('click',event=>{
 if(event.target.closest('[data-stories-retry]')){renderStoriesView();return;}
 const button=event.target.closest('[data-story-passage]');if(!button)return;
 const ref=storyReference(button.dataset.storyPassage);if(!ref)return;
 storiesActive=false;renderStoriesView();setView('explore',false);loadChapter(ref.book,ref.chapter,ref.verse);
});

// Shared character anchors resolve to the full story card, including on a fresh load.
async function routeLinkedStory(){
 const route=storyRoute();
 if(route){
  storiesActive=true;
  const hash=location.hash;
  try{
   const catalog=await loadStories();if(location.hash!==hash)return;
   const entry=catalog.find(entry=>storySlug(entry.book)===route[1]);
   const story=entry?.stories.find(story=>storySlug(story.title)===route[2]);
   const ref=story&&storyReference(story.passage);
   if(ref){await loadChapter(ref.book,ref.chapter,ref.verse,false);return;}
  }catch{}
  if(location.hash===hash)await renderStoriesView();
 }
 else{storiesActive=false;renderStoriesView();}
}
window.addEventListener('hashchange',routeLinkedStory);
window.addEventListener('DOMContentLoaded',routeLinkedStory);
window.addEventListener('viewchange',event=>{if(event.detail!=='explore'){storiesActive=false;renderStoriesView();}});
