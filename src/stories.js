'use strict';
// Book-wide narratives are separate from verse-aligned evidence classifications.
let storiesActive=false,storiesRequest=null,storiesGeneration=0;
function storiesFilterButton(){return `<button type="button" class="agreement category-filter stories" data-category-filter="stories" data-brightness="open" aria-pressed="${storiesActive}" aria-controls="stories-view" aria-label="Stories" title="Stories"><span class="filter-icon">${categoryIcon('stories')}</span><span class="filter-copy"><span class="filter-label">Stories</span></span></button>`;}
function loadStories(){
 if(!storiesRequest){storiesRequest=fetch('/stories.json').then(response=>{if(!response.ok)throw Error('Stories unavailable');return response.json();});storiesRequest.catch(()=>{storiesRequest=null;});}
 return storiesRequest;
}
function storyReference(reference){
 const parsed=readRef(reference);if(!parsed)return null;
 const end=/[-–]\s*(?:(\d+):)?(\d+)\s*$/.exec(reference);
 return {...parsed,endChapter:end?.[1]?Number(end[1]):parsed.chapter,endVerse:end?Number(end[2]):parsed.verse};
}
function storyCard(story){
 const reference=storyReference(story.passage);
 const passage=reference?`<button type="button" class="story-passage" data-story-passage="${esc(story.passage)}" aria-label="Read ${esc(story.passage)} starting at verse ${reference.verse}">${esc(story.passage)} →</button>`:`<span>${esc(story.passage)}</span>`;
 const references=story.cross_references.map(label=>{const ref=storyReference(label);return ref?`<button type="button" class="verse-citation story-reference" data-cite="${ref.book}/${ref.chapter}/${ref.verse}" data-cite-end="${ref.endVerse}" data-cite-end-chapter="${ref.endChapter}" data-cite-label="${esc(label)}" data-cite-preview aria-haspopup="dialog" aria-expanded="false">${esc(label)}</button>`:'';}).join('');
 return `<article class="story-card"><h3>${esc(story.title)}</h3>${passage}<p>${esc(story.summary)}</p>${references?`<div class="story-references"><span>Referenced in:</span> ${references}</div>`:''}</article>`;
}
async function renderStoriesView(){
 const section=$('#stories-view');if(!section)return;
 const generation=++storiesGeneration;
 section.hidden=!storiesActive;$('#reader-layout').hidden=storiesActive;document.body.classList.toggle('stories-active',storiesActive);
 if(!storiesActive)return;
 const name=books[readingBook]?.name;
 $('#stories-heading').innerHTML=`Stories in <button type="button" class="passage-heading-picker" aria-label="Choose book, chapter and verse" aria-haspopup="dialog" aria-controls="passage-picker">${esc(name)}</button>`;
 const list=$('#stories-list');list.innerHTML='<p role="status">Loading stories…</p>';
 try{
  const catalog=await loadStories();if(generation!==storiesGeneration||!storiesActive)return;
  const stories=catalog.find(entry=>entry.book===name)?.stories||[];
  list.innerHTML=stories.length?stories.map(storyCard).join(''):'<p class="empty">No stories have been added for this book yet. You can still read every chapter and verse.</p>';
 }catch{if(generation===storiesGeneration)list.innerHTML='<p>Could not load stories. <button type="button" data-stories-retry>Retry</button></p>';}
}
document.addEventListener('click',event=>{
 if(event.target.closest('[data-stories-retry]')){renderStoriesView();return;}
 const button=event.target.closest('[data-story-passage]');if(!button)return;
 const ref=storyReference(button.dataset.storyPassage);if(!ref)return;
 storiesActive=false;renderStoriesView();setView('explore',false);loadChapter(ref.book,ref.chapter,ref.verse);
});
