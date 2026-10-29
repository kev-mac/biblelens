'use strict';
// Collection counts come from the same production corpus as their destinations.
(() => {
 const host=document.getElementById('explore-view');if(!host)return;
 host.className='lens-workspace phase2-page ux-explore';
 const topics=[['stories','Stories','Linked accounts','#stories'],['people','People','People in the text','#people'],['places','Places','Cities, lands and journeys','#places'],['commandments','Commandments','Laws in context','#commandments'],['evidence','Evidence','Readings and sources','#discover?section=evidence']];
 const evidence=[['history','History','Ancient sources','#questions?mode=history'],['science','Science','Nature and the text','#questions?mode=science'],['timeline','Timeline','Events in context','#timeline'],['text','Text Comparisons','Linked passages','#questions?mode=text'],['translation','Translations','Wording choices','#questions?filter=T'],['questions','Questions','Different readings','#questions'],['prophecies','Prophecies','Read claims in context','#prophecies']];
 const paths={stories:'M4 4h16v16H4zM4 12h16M12 4v8',people:'M16 21v-2a6 6 0 0 0-12 0v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M18 4a4 4 0 0 1 0 8M22 21v-2a6 6 0 0 0-3-5',places:'M12 22S4 14 4 9a8 8 0 0 1 16 0c0 5-8 13-8 13ZM12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6',commandments:'M5 3h14v18H5zM8 8h8M8 12h8M8 16h5',evidence:'m12 3 10 5-10 5L2 8ZM2 12l10 5 10-5M2 16l10 5 10-5',history:'M3 5h18v14H3zM7 9h10M7 13h6',science:'M9 3h6M10 3v7l-6 10h16l-6-10V3M8 15h8',timeline:'M12 3v18M5 7h14M5 17h14',text:'M3 4h7v16H3zM14 4h7v16h-7z',translation:'M3 5h12M9 3v2M5 9l8 8M12 5c0 6-4 9-9 12M14 21l4-10 4 10M16 17h4',questions:'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 4M12 18h.01',prophecies:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6'};
 let counts=null,rendered=null;
 function updateCounts(){if(!counts)return;for(const tile of host.querySelectorAll('.ux-topic')){const badge=tile.querySelector('.ux-count'),value=counts[tile.dataset.topic];badge.textContent=value.toLocaleString();badge.setAttribute('aria-label',value.toLocaleString()+' records');}}

 function render(){
  const nested=new URLSearchParams(location.hash.split('?')[1]).get('section')==='evidence',showProphecies=counts?.prophecies>=20,items=nested?evidence.filter(([key])=>key!=='prophecies'||showProphecies):topics;
  const view=nested?'evidence-'+showProphecies:'explore';
  if(rendered===view)return;rendered=view;
  host.innerHTML=`${nested?'<a class="lens-button" href="#discover">Explore</a>':''}<h1 tabindex="-1">${nested?'Evidence':'Explore'}</h1><section class="ux-topic-section" aria-label="${nested?'Evidence':'Explore'} collections"><div class="ux-topic-row">${items.map(([key,label,subtitle,url])=>`<a class="ux-topic" id="ux-topic-${key}" data-topic="${key}" href="${url}" aria-label="${label}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[key]}"/></svg><div class="ux-tile-copy"><strong>${label}</strong><small>${subtitle}</small></div><span class="ux-count" aria-label="${counts?counts[key].toLocaleString()+' records':'Loading count'}">${counts?counts[key].toLocaleString():'…'}</span></a>`).join('')}</div></section><nav class="ux-quick-links" aria-label="Quick links"><a href="#debate/numbers-priestly-blessing-amulets">Aaronic Blessing</a><a href="#read/9/7">Davidic Covenant</a><a href="#compare?left=Genesis%201&right=Genesis%202">Parallel accounts in Genesis</a></nav>`;
 }
 fetch('/collection-counts.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(value=>{counts=value;render();updateCounts();}).catch(()=>{host.querySelectorAll('.ux-count').forEach(n=>{n.textContent='';n.setAttribute('aria-label','Count unavailable');});});
 window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#discover'))render();});render();
 const topic=()=>{
  const hash=location.hash,params=new URLSearchParams(hash.split('?')[1]);
  document.body.dataset.topic=/^#(?:people|characters)/.test(hash)?'people':hash.startsWith('#stories')?'stories':hash.startsWith('#places')?'places':hash.startsWith('#commandments')?'commandments':hash.startsWith('#timeline')?'timeline':/^#(?:questions|debate)/.test(hash)?params.get('mode')==='history'?'history':params.get('mode')==='science'?'science':params.get('filter')==='T'?'translation':params.get('mode')==='text'?'text':'questions':'evidence';
 };
 window.addEventListener('hashchange',topic);window.addEventListener('viewchange',topic);topic();
})();
