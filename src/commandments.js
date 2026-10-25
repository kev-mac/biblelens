'use strict';
// Bundled from the retained, public-domain historical enumeration.
const COMMANDMENTS = /*__COMMANDMENTS__*/[];
const COMMANDMENT_FACETS = {
 polarity:['Positive','Negative'],sphere:['God','Humanity'],
 applicability:['Universal / Today','Temple Era Only','Land of Israel Only','Specific Roles','Context dependent'],
 topics:[...new Set(COMMANDMENTS.flatMap(item=>item.taxonomy.topics))].sort()
};
// Ignore the candidate's own dimension when counting available matches. Selected
// values stay removable, even when a typed search leaves no matching records.
function commandmentFacetCount(records,filters,query,dimension,value){
 return filterCommandments(records,{...filters,[dimension]:[value]},query).length;
}
function commandmentFacetDisabled(records,filters,query,dimension,value){
 return !(filters[dimension]||[]).includes(value)&&commandmentFacetCount(records,filters,query,dimension,value)===0;
}
// One source of truth for both tiers. OR within dimensions; AND between dimensions.
function filterCommandments(records,filters,query='') {
 const words=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 return records.filter(item=>Object.keys(COMMANDMENT_FACETS).every(dimension=>{
  const selected=filters[dimension]||[];
  const values=[].concat(item.taxonomy[dimension]||[]);
  return !selected.length||selected.some(value=>values.includes(value));
 })&&words.every(word=>[item.id,item.code,item.title,item.passage,item.summary,...Object.values(item.taxonomy).flat(),...(item.lens||[]).flatMap(link=>[link.reference,link.type,link.description])].join(' ').toLocaleLowerCase().includes(word)));
}
function commandmentDirective(title){
 const directive=String(title).replace(/^To\s+/i,'').replace(/\b(and|or) to (?=\w)/gi,'$1 ');
 return directive.charAt(0).toUpperCase()+directive.slice(1);
}
function commandmentPassageLink(reference){
 const ref=readRef(reference);if(!ref)return `<button type="button" class="commandment-inline-reference" data-commandment-passage="${esc(reference)}">${esc(reference)}</button>`;
 return `<a class="commandment-inline-reference" href="#read/${ref.book}/${ref.chapter}/${ref.verse}" aria-label="Read ${esc(reference)}">${esc(reference)}</a>`;
}
// Context is a bounded window of the packaged KJV, never generated commentary.
function commandmentContextVerses(verses,verse){
 return verses.filter(row=>row.n>=Math.max(1,verse-2)&&row.n<=verse+2);
}
const commandmentContextCache=new Map();
async function loadCommandmentContext(panel,reference){
 if(panel.dataset.loaded==='true')return;
 const ref=readRef(reference);if(!ref)return;
 const key=ref.book+'/'+ref.chapter;
 panel.setAttribute('aria-busy','true');panel.innerHTML='<h3>Scripture context · KJV</h3><p role="status">Loading surrounding verses…</p>';
 try{
  if(!commandmentContextCache.has(key))commandmentContextCache.set(key,fetch(`/api/chapter?book=${ref.book}&chapter=${ref.chapter}`).then(response=>{if(!response.ok)throw Error('Chapter unavailable');return response.json();}).catch(error=>{commandmentContextCache.delete(key);throw error;}));
  const chapter=await commandmentContextCache.get(key);if(!panel.isConnected)return;
  const rows=commandmentContextVerses(chapter.verses,ref.verse);
  if(!rows.some(row=>row.n===ref.verse))throw Error('Verse unavailable');
  panel.innerHTML='<h3>Scripture context · KJV</h3>'+rows.map(row=>`<p class="commandment-context-verse">${commandmentPassageLink(reference.replace(/:\d+$/,':'+row.n))} <q>${esc(String(row.kjv).replace(/\{[HG]\d+\}|<[^>]*>/g,''))}</q></p>`).join('')+`<a class="commandment-inline-reference" href="#read/${key}">Read the full chapter</a>`;
  panel.dataset.loaded='true';
 }catch{if(panel.isConnected)panel.innerHTML='<h3>Scripture context · KJV</h3><p role="status">Could not load the surrounding verses.</p><button type="button" data-commandment-context-retry>Retry</button>';}
 finally{panel.setAttribute('aria-busy','false');}
}
function commandmentCard(item) {
 const prefix='commandment-'+item.id,title=commandmentDirective(item.title);
 const control=(key,label,paths)=>`<button type="button" class="person-section-toggle" data-commandment-section aria-expanded="false" aria-controls="${esc(prefix)}-${key}" id="${esc(prefix)}-${key}-toggle"><span class="person-section-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths}</svg></span><span class="person-section-label">${label}</span></button>`;
 return `<article class="commandment-card" data-commandment-reference="${esc(item.passage)}"><p class="commandment-number">${esc(item.code)} · ${esc(item.taxonomy.polarity)}</p><div class="commandment-card-heading"><h2>${esc(title)}</h2></div><section class="commandment-summary" aria-label="Passage text"><p>${commandmentPassageLink(item.passage)} <q>${esc(item.summary)}</q></p></section><div class="person-section-controls" role="group" aria-label="${esc(title)} commandment sections">${control('context','Context','<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>')}${item.lens?.length?control('lens','NT lens','<path d="M3 4h7a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H3z"/><path d="M13 7a3 3 0 0 1 3-3h5v14h-5a3 3 0 0 0-3 3"/>'):''}</div><section class="person-section-panel commandment-context" id="${esc(prefix)}-context" aria-labelledby="${esc(prefix)}-context-toggle" hidden></section>${item.lens?.length?`<section class="person-section-panel commandment-lens" id="${esc(prefix)}-lens" aria-labelledby="${esc(prefix)}-lens-toggle" hidden><h3>New Testament lens</h3>${item.lens.map(link=>`<div class="commandment-lens-item">${commandmentPassageLink(link.reference)}<p><b>${esc(link.type)}:</b> ${esc(link.description)}</p></div>`).join('')}</section>`:''}</article>`;
}
async function initCommandments() {
 const root=document.querySelector('#commandments-view');if(!root)return;
 if(!books.length){try{const response=await fetch('/api/books');if(response.ok)books=await response.json();}catch{/* Keep inline passage controls available if the reader is still loading. */}}
 const sheet=document.querySelector('#commandments-filters'),matrix=document.querySelector('#commandments-matrix');
 const search=document.querySelector('#commandments-search'),more=document.querySelector('#commandments-more');
 const filters=Object.fromEntries(Object.keys(COMMANDMENT_FACETS).map(key=>[key,[]]));
 matrix.innerHTML=Object.entries(COMMANDMENT_FACETS).map(([dimension,values])=>`<fieldset><legend>${dimension[0].toUpperCase()+dimension.slice(1)}</legend><div class="commandments-options">${values.map(value=>`<button type="button" class="secondary commandment-facet-toggle" data-commandment-dimension="${dimension}" data-value="${esc(value)}" aria-pressed="false"><span>${esc(value)}</span></button>`).join('')}</div></fieldset>`).join('');
 let visibleCount=60;
 function render() {
  const items=filterCommandments(COMMANDMENTS,filters,search.value);
  document.querySelector('#commandments-list').innerHTML=items.length?items.slice(0,visibleCount).map(commandmentCard).join('')+(items.length>visibleCount?'<button type="button" id="commandments-load-more">Show more</button>':''):'<p class="empty">No matching commandments. Try fewer filters or reset your search.</p>';
  document.querySelector('#commandments-count').textContent=`${items.length} of ${COMMANDMENTS.length} commandments${items.length>visibleCount?` · showing 1–${visibleCount}`:''}`;
  for(const button of matrix.querySelectorAll('[data-commandment-dimension]')){
   const dimension=button.dataset.commandmentDimension,value=button.dataset.value;
   button.setAttribute('aria-pressed',String(filters[dimension].includes(value)));
   button.disabled=commandmentFacetDisabled(COMMANDMENTS,filters,search.value,dimension,value);
   button.title=`${value} · ${commandmentFacetCount(COMMANDMENTS,filters,search.value,dimension,value)} matching commandments`;
  }
  const count=Object.values(filters).reduce((sum,values)=>sum+values.length,0);
  more.querySelector('span').textContent=`Filter${count?' ('+count+')':''}`;
  document.querySelector('#commandments-done').textContent=`Show ${items.length} ${items.length===1?'result':'results'}`;
 }
 function toggle(dimension,value,enabled) {
  const selected=new Set(filters[dimension]);if(enabled)selected.add(value);else selected.delete(value);
  filters[dimension]=[...selected];visibleCount=60;render();
 }
 root.addEventListener('click',event=>{
  const retry=event.target.closest('[data-commandment-context-retry]');if(retry){const panel=retry.closest('.commandment-context');void loadCommandmentContext(panel,panel.closest('.commandment-card').dataset.commandmentReference);return;}
  const section=event.target.closest('[data-commandment-section]');
  if(section){
   if(section.disabled)return;
   const card=section.closest('.commandment-card'),panel=document.getElementById(section.getAttribute('aria-controls')),open=panel.hidden;
   for(const control of card.querySelectorAll('[data-commandment-section]')){const selected=open&&control===section;control.setAttribute('aria-expanded',String(selected));document.getElementById(control.getAttribute('aria-controls')).hidden=!selected;}
   if(open&&panel.classList.contains('commandment-context'))void loadCommandmentContext(panel,card.dataset.commandmentReference);return;
  }

 });
 matrix.addEventListener('click',event=>{const button=event.target.closest('[data-commandment-dimension]');if(button&&!button.disabled)toggle(button.dataset.commandmentDimension,button.dataset.value,!filters[button.dataset.commandmentDimension].includes(button.dataset.value));});
 search.addEventListener('input',()=>{visibleCount=60;render();});
 function clear(){visibleCount=60;Object.keys(filters).forEach(key=>{filters[key]=[];});render();}
 document.querySelector('#commandments-reset').onclick=()=>{search.value='';clear();};
 document.querySelector('#commandments-clear').onclick=clear;
 more.onclick=()=>{sheet.showModal();more.setAttribute('aria-expanded','true');document.body.classList.add('commandments-filter-open');};
 const close=()=>sheet.close();
 document.querySelector('#commandments-close').onclick=close;
 document.querySelector('#commandments-done').onclick=close;
 sheet.addEventListener('close',()=>{document.body.classList.remove('commandments-filter-open');more.setAttribute('aria-expanded','false');more.focus();});
 // Native dialog supplies Escape handling, focus trapping, and background inertness.
 let backdropStart=false;
 sheet.addEventListener('pointerdown',event=>{backdropStart=event.target===sheet&&outside(event);});
 function outside(event){const rect=sheet.getBoundingClientRect();return event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom;}
 sheet.addEventListener('click',event=>{if(backdropStart&&event.target===sheet&&outside(event))close();backdropStart=false;});
 const handle=sheet.querySelector('.commandments-handle');let drag=null;
 handle.addEventListener('pointerdown',event=>{if(!event.isPrimary||event.button!==0)return;drag={id:event.pointerId,y:event.clientY};handle.setPointerCapture(event.pointerId);});
 handle.addEventListener('pointerup',event=>{if(drag?.id===event.pointerId&&event.clientY-drag.y>60)close();drag=null;});
 handle.addEventListener('pointercancel',()=>{drag=null;});
 root.addEventListener('click',event=>{
  if(event.target.closest('#commandments-load-more')){visibleCount+=60;render();return;}
  const button=event.target.closest('[data-commandment-passage]');if(!button)return;
  const ref=readRef(button.dataset.commandmentPassage);if(!ref){toast('Passage reader is still loading. Please try again.');return;}
  storiesActive=false;renderStoriesView();setView('explore',false);loadChapter(ref.book,ref.chapter,ref.verse);
 });
 render();
}
initCommandments();
