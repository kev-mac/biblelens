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
function commandmentCard(item) {
 const passage=reference=>`<button type="button" class="commandment-passage" data-commandment-passage="${esc(reference)}" aria-label="Read ${esc(reference)}">${esc(reference)}</button>`;
 return `<article class="commandment-card"><div class="commandment-card-heading"><span class="commandment-number">${esc(item.code)} · ${esc(item.taxonomy.polarity)}</span><h2>${esc(item.title)}</h2></div>${passage(item.passage)}<section class="commandment-summary" aria-label="Passage · KJV"><h3>Passage · KJV</h3><p>${esc(item.summary)}</p></section>${item.lens?.length?`<section class="commandment-lens" aria-label="New Testament lens"><h3>New Testament lens</h3>${item.lens.map(link=>`<div class="commandment-lens-item">${passage(link.reference)}<p><b>${esc(link.type)}:</b> ${esc(link.description)}</p></div>`).join('')}</section>`:''}</article>`;
}
function initCommandments() {
 const root=document.querySelector('#commandments-view');if(!root)return;
 const sheet=document.querySelector('#commandments-filters'),matrix=document.querySelector('#commandments-matrix');
 const search=document.querySelector('#commandments-search'),more=document.querySelector('#commandments-more');
 const filters=Object.fromEntries(Object.keys(COMMANDMENT_FACETS).map(key=>[key,[]]));
 matrix.innerHTML=Object.entries(COMMANDMENT_FACETS).map(([dimension,values])=>`<fieldset><legend>${dimension[0].toUpperCase()+dimension.slice(1)}</legend><div class="commandments-options">${values.map(value=>`<button type="button" class="secondary commandment-facet-toggle" data-commandment-dimension="${dimension}" data-value="${esc(value)}" aria-pressed="false"><span>${esc(value)}</span></button>`).join('')}</div></fieldset>`).join('');
 root.querySelectorAll('[data-commandment-quick]').forEach(button=>button.classList.add('commandment-facet-toggle'));
 let visibleCount=60;
 function render() {
  const items=filterCommandments(COMMANDMENTS,filters,search.value);
  document.querySelector('#commandments-list').innerHTML=items.length?items.slice(0,visibleCount).map(commandmentCard).join('')+(items.length>visibleCount?'<button type="button" id="commandments-load-more">Show more commandments</button>':''):'<p class="empty">No matching commandments. Try fewer filters or reset your search.</p>';
  document.querySelector('#commandments-count').textContent=`${items.length} of ${COMMANDMENTS.length} commandments${items.length>visibleCount?` · showing 1–${visibleCount}`:''}`;
  for(const button of [...root.querySelectorAll('[data-commandment-quick]'),...matrix.querySelectorAll('[data-commandment-dimension]')]){
   const dimension=button.dataset.commandmentQuick||button.dataset.commandmentDimension,value=button.dataset.value;
   button.setAttribute('aria-pressed',String(filters[dimension].includes(value)));
   button.disabled=commandmentFacetDisabled(COMMANDMENTS,filters,search.value,dimension,value);
   button.title=`${value} · ${commandmentFacetCount(COMMANDMENTS,filters,search.value,dimension,value)} matching commandments`;
  }
  const count=Object.values(filters).reduce((sum,values)=>sum+values.length,0);
  more.textContent=`More Filters${count?' ('+count+')':''}`;
  document.querySelector('#commandments-done').textContent=`Show ${items.length} ${items.length===1?'result':'results'}`;
 }
 function toggle(dimension,value,enabled) {
  const selected=new Set(filters[dimension]);if(enabled)selected.add(value);else selected.delete(value);
  filters[dimension]=[...selected];visibleCount=60;render();
 }
 root.addEventListener('click',event=>{
  const button=event.target.closest('[data-commandment-quick]');if(!button||button.disabled)return;
  const dimension=button.dataset.commandmentQuick,value=button.dataset.value;
  toggle(dimension,value,!filters[dimension].includes(value));
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
