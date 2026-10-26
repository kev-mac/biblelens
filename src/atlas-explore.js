'use strict';
// A small build-time index links directly to existing records. Artwork is imagined.
(() => {
 const host=document.getElementById('explore-view');if(!host)return;
 host.className='lens-workspace phase2-page phase2-explore';
 const collections=[
  {key:'text',image:'evidence',title:'Two accounts',copy:'Compare details and claims across accounts of the same events.',url:'#debates'},
  {key:'science',image:'evidence',title:'Does science agree?',copy:'Compare scientific findings with claims about the natural world.',url:'#debates?mode=science'},
  {key:'history',image:'timeline',title:'What do other ancient sources say?',copy:'Explore historical sources and the limits of what they support.',url:'#debates?mode=history'},
  {key:'translation',image:'evidence',title:'Lost in translation',copy:'Compare wording across translations and ancient copies of the texts.',url:'#debates?filter=T'},
  {key:'people',image:'people',title:'People',copy:'Explore people, their families, and the accounts that connect them.',url:'#people'},
  {key:'places',image:'places',title:'Places',copy:'Explore places and the clues used to find them on a map.',url:'#places'},
  {key:'stories',image:'stories',title:'Stories',copy:'Follow stories across books and explore their themes and settings.',url:'#stories'},
  {key:'commandments',image:'commandments',title:'What does the law actually say?',label:'Commandments',copy:'Explore laws, their source texts, and the settings in which they were written.',url:'#commandments'},
  {key:'timeline',image:'timeline',title:'When did it happen?',label:'Timeline',copy:'Compare the order of events and the evidence for their dates.',url:'#timeline'}
 ];
 const artwork=(name,eager=false)=>`<div class="phase2-art"><img src="/assets/explore-${name}.webp" width="1200" height="800" loading="${eager?'eager':'lazy'}" decoding="async" ${eager?'fetchpriority="high"':''} alt="Imagined illustration of ${name==='evidence'?'hands studying an ancient text':name}"><span>Imagined art</span></div>`;
 const starterStudies=host.querySelector('.lens-starter-studies');
 host.innerHTML=`<form class="phase2-search" id="explore-search"><label class="sr-only" for="explore-query">Search scripture, topics, or people</label><input id="explore-query" type="search" maxlength="300" placeholder="Search scripture, topics, people…"><button aria-label="Search the library" type="submit">⌕</button></form><div class="phase2-intro"><span class="phase2-eyebrow">Follow your curiosity</span><h1 tabindex="-1">Room for questions.</h1><p>Read the texts, explore the evidence, and consider what each account supports.</p></div><div id="explore-hero"><p role="status">Loading today’s debate…</p></div><a class="phase2-continue" id="explore-continue" href="#read">Continue reading <span aria-hidden="true">→</span></a><div id="explore-rails"><p role="status">Loading collections…</p></div><div class="phase2-tools"><a href="#debates?filter=Q">Questions</a><a href="#debates?filter=V">Violations</a><a href="#prophecies">Prophecies</a><a href="#compare">Compare passages</a><a href="#evidence">More evidence filters</a><a href="#places">Study Atlas</a></div><p class="phase2-meta">Artwork is imagined. It is not a real portrait or historical evidence.</p>`;
 if(starterStudies){starterStudies.querySelector('h2').textContent='Starter studies';host.append(starterStudies);}
 host.querySelector('form').onsubmit=event=>{event.preventDefault();window.BibleLensWorkspace.navigate('#search?q='+encodeURIComponent(document.getElementById('explore-query').value.trim()));};
 function continueReading(){const label=typeof reading!=='undefined'&&reading?`${books[readingBook].name} ${readingChapter}`:'';const link=document.getElementById('explore-continue');link.href=label?`#read/${readingBook}/${readingChapter}`:'#read';link.textContent=label?'Continue reading · '+label+' →':'Open the reader →';}
 window.addEventListener('biblelens:readerchange',continueReading);continueReading();
 function images(){for(const img of host.querySelectorAll('img'))img.addEventListener('error',()=>{img.hidden=true;img.parentElement.classList.add('phase2-art-missing');},{once:true});}
 async function load(){
  const day=new Date().toISOString().slice(0,10);
  const results=await Promise.allSettled([fetch('/api/debates?'+new URLSearchParams({day})).then(response=>{if(!response.ok)throw Error();return response.json();}),fetch('/explore-feed.json').then(response=>{if(!response.ok)throw Error();return response.json();})]);
  const hero=document.getElementById('explore-hero'),rails=document.getElementById('explore-rails');
  if(results[0].status==='fulfilled'&&results[0].value.records.length){const record=results[0].value.records[0];hero.innerHTML=`<article class="phase2-hero">${artwork('evidence',true)}<span class="phase2-art-label">Imagined art</span><div class="phase2-hero-copy"><span class="phase2-eyebrow">Debate of the day</span><h2>${esc(record.title)}</h2><p>Compare the passages and explore the record’s explanation.</p><a href="#debate/${encodeURIComponent(record.id)}">Explore this debate <span aria-hidden="true">→</span></a></div></article>`;}else hero.innerHTML='<p>Today’s debate could not load. <button class="lens-button" data-explore-retry>Retry</button></p><a href="#debates">Explore all debates</a>';
  if(results[1].status==='fulfilled')rails.innerHTML=collections.map(collection=>`<section class="phase2-collection" aria-labelledby="rail-${collection.key}"><div class="phase2-rail-heading"><div>${collection.label?`<span class="phase2-eyebrow">${collection.label}</span>`:''}<h2 id="rail-${collection.key}">${collection.title}</h2></div><a href="${collection.url}" aria-label="See all: ${collection.title}">All →</a></div><p class="phase2-rail-description">${collection.copy}</p><div class="phase2-rail">${(results[1].value[collection.key]||[]).map(record=>`<${record.placeId?'button type="button" data-place-id="'+esc(record.placeId)+'"':'a href="'+esc(record.url)+'"'} class="phase2-rail-card">${artwork(collection.image)}<div class="phase2-rail-copy"><h3>${esc(record.title)}</h3><span class="phase2-meta">${esc(record.meta)}</span>${record.verdict?window.BibleLensDebates.badge(record):''}</div></${record.placeId?'button':'a'}>`).join('')}</div></section>`).join('');else rails.innerHTML='<p>Collections could not load. <button class="lens-button" data-explore-retry>Retry</button></p>';
  images();restoreNavigation();
 }
 host.addEventListener('click',event=>{if(event.target.closest('[data-explore-retry]'))load();});
 load();
})();
