'use strict';
// UI fixtures, not a reviewed enumeration of the traditional 613 commandments.
const COMMANDMENT_SAMPLES = [
 {id:143,title:'Leave field corners for the poor',passage:'Leviticus 19:9',summary:'Leave the edges of the harvest and its gleanings for the poor and the stranger.',taxonomy:{polarity:'Positive',sphere:'Humanity',applicability:['Land of Israel Only'],topics:['Agriculture','Poverty','Generosity']},lens:[{reference:'2 Corinthians 9:7',type:'Expansion',description:'A thematic connection to willing generosity toward those in need.'}]},
 {id:144,title:'Do not charge interest to the poor',passage:'Exodus 22:25',summary:'When lending to the poor among your people, do not act as an exacting creditor or impose interest.',taxonomy:{polarity:'Negative',sphere:'Humanity',applicability:['Universal / Today'],topics:['Business','Poverty','Justice']},lens:[{reference:'Luke 6:35',type:'Expansion',description:'Jesus connects lending with love and generosity, expecting nothing in return.'}]},
 {id:145,title:'Offer the daily sacrifice',passage:'Numbers 28:3',summary:'Present two unblemished year-old lambs each day as the regular burnt offering.',taxonomy:{polarity:'Positive',sphere:'God',applicability:['Temple Era Only','Specific Roles'],topics:['Worship','Sacrifice','Priesthood']},lens:[{reference:'Hebrews 10:11',type:'Fulfillment',description:'Hebrews contrasts repeated priestly sacrifices with the offering of Christ.'}]}
];
const COMMANDMENT_FACETS = {
 polarity:['Positive','Negative'],sphere:['God','Humanity'],
 applicability:['Universal / Today','Temple Era Only','Land of Israel Only','Specific Roles'],
 topics:[...new Set(COMMANDMENT_SAMPLES.flatMap(item=>item.taxonomy.topics))].sort()
};
// One source of truth for both tiers. OR within dimensions; AND between dimensions.
function filterCommandments(records,filters,query='') {
 const words=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 return records.filter(item=>Object.keys(COMMANDMENT_FACETS).every(dimension=>{
  const selected=filters[dimension]||[];
  const values=[].concat(item.taxonomy[dimension]||[]);
  return !selected.length||selected.some(value=>values.includes(value));
 })&&words.every(word=>[item.id,item.title,item.passage,item.summary,...Object.values(item.taxonomy).flat(),...(item.lens||[]).flatMap(link=>[link.reference,link.type,link.description])].join(' ').toLocaleLowerCase().includes(word)));
}
function commandmentCard(item) {
 const chip=(value,dimension)=>`<span class="commandment-micro" data-dimension="${dimension}">${esc(value)}</span>`;
 const passage=reference=>`<button type="button" class="commandment-passage" data-commandment-passage="${esc(reference)}" aria-label="Read ${esc(reference)}">${esc(reference)}</button>`;
 return `<article class="commandment-card"><div class="commandment-card-heading"><span class="commandment-number">Mitzvah #${esc(item.id)}</span><h2>${esc(item.title)}</h2></div>${passage(item.passage)}<p>${esc(item.summary)}</p><div class="commandment-metadata" aria-label="Taxonomy">${Object.entries(item.taxonomy).flatMap(([dimension,values])=>[].concat(values).map(value=>chip(value,dimension))).join('')}</div>${item.lens?.length?`<section class="commandment-lens" aria-label="New Testament lens"><h3>New Testament lens</h3>${item.lens.map(link=>`<div class="commandment-lens-item">${passage(link.reference)}<p><b>${esc(link.type)}:</b> ${esc(link.description)}</p></div>`).join('')}</section>`:''}</article>`;
}
function initCommandments() {
 const root=document.querySelector('#commandments-view');if(!root)return;
 const sheet=document.querySelector('#commandments-filters'),matrix=document.querySelector('#commandments-matrix');
 const search=document.querySelector('#commandments-search'),more=document.querySelector('#commandments-more');
 const filters=Object.fromEntries(Object.keys(COMMANDMENT_FACETS).map(key=>[key,[]]));
 matrix.innerHTML=Object.entries(COMMANDMENT_FACETS).map(([dimension,values])=>`<fieldset><legend>${dimension[0].toUpperCase()+dimension.slice(1)}</legend><div class="commandments-options">${values.map(value=>`<label><input type="checkbox" data-commandment-dimension="${dimension}" value="${esc(value)}"><span>${esc(value)}</span></label>`).join('')}</div></fieldset>`).join('');
 function render() {
  const items=filterCommandments(COMMANDMENT_SAMPLES,filters,search.value);
  document.querySelector('#commandments-list').innerHTML=items.length?items.map(commandmentCard).join(''):'<p class="empty">No matching commandments. Try fewer filters or reset your search.</p>';
  document.querySelector('#commandments-count').textContent=`${items.length} of ${COMMANDMENT_SAMPLES.length} sample commandments`;
  root.querySelectorAll('[data-commandment-quick]').forEach(button=>button.setAttribute('aria-pressed',String(filters[button.dataset.commandmentQuick].includes(button.dataset.value))));
  matrix.querySelectorAll('input').forEach(input=>{input.checked=filters[input.dataset.commandmentDimension].includes(input.value);});
  const count=Object.values(filters).reduce((sum,values)=>sum+values.length,0);
  more.textContent=`More Filters${count?' ('+count+')':''}`;
  document.querySelector('#commandments-done').textContent=`Show ${items.length} ${items.length===1?'result':'results'}`;
 }
 function toggle(dimension,value,enabled) {
  const selected=new Set(filters[dimension]);if(enabled)selected.add(value);else selected.delete(value);
  filters[dimension]=[...selected];render();
 }
 root.addEventListener('click',event=>{
  const button=event.target.closest('[data-commandment-quick]');if(!button)return;
  const dimension=button.dataset.commandmentQuick,value=button.dataset.value;
  toggle(dimension,value,!filters[dimension].includes(value));
 });
 matrix.addEventListener('change',event=>{const input=event.target.closest('[data-commandment-dimension]');if(input)toggle(input.dataset.commandmentDimension,input.value,input.checked);});
 search.addEventListener('input',render);
 function clear(){Object.keys(filters).forEach(key=>{filters[key]=[];});render();}
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
  const button=event.target.closest('[data-commandment-passage]');if(!button)return;
  const ref=readRef(button.dataset.commandmentPassage);if(!ref){toast('Passage reader is still loading. Please try again.');return;}
  storiesActive=false;renderStoriesView();setView('explore',false);loadChapter(ref.book,ref.chapter,ref.verse);
 });
 render();
}
initCommandments();
