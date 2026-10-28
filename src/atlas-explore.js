'use strict';
// One tile per collection. Counts come from the same accepted corpus as the lists.
(() => {
 const host=document.getElementById('explore-view');if(!host)return;
 host.className='lens-workspace phase2-page ux-explore';
 const topics=[
  ['people','People','people','#people'],['places','Places','places','#places'],
  ['stories','Stories','stories','#stories'],['commandments','Commandments','commandments','#commandments'],
  ['science','Science','evidence','#questions?mode=science'],
  ['history','History & Timeline','timeline','#questions?mode=history'],
  ['translation','Lost in Translation','evidence','#questions?filter=T']
 ];
 const tile=([key,label,image,url])=>`<a class="ux-topic" data-topic="${key}" href="${url}"><img src="/assets/explore-${image}.webp" width="1200" height="800" alt="Imagined illustration" loading="${key==='people'?'eager':'lazy'}"><div class="ux-tile-copy"><strong>${label}</strong><small data-count="${key}">Loading count…</small><span aria-hidden="true">→</span></div></a>`;
 host.innerHTML='<h1 tabindex="-1">Explore</h1>'+[['The Bible',topics.slice(0,4)],['Study',topics.slice(4)]].map(([title,items])=>`<section class="ux-topic-section" aria-label="${title}"><h2>${title}</h2><div class="ux-topic-row">${items.map(tile).join('')}</div></section>`).join('');
 fetch('/collection-counts.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(counts=>{for(const node of host.querySelectorAll('[data-count]'))node.textContent=counts[node.dataset.count].toLocaleString()+' items';}).catch(()=>{for(const node of host.querySelectorAll('[data-count]'))node.textContent='Open collection';});
 for(const img of host.querySelectorAll('img'))img.addEventListener('error',()=>{img.hidden=true;});
})();
