'use strict';
// Shared collection colours are applied to tiles and their destination screens.
(() => {
 const host=document.getElementById('explore-view');if(!host)return;
 host.className='lens-workspace phase2-page ux-explore';
 const topics=[['stories','Stories','stories','#stories'],['people','People','people','#people'],['places','Places','places','#places'],['commandments','Commandments','commandments','#commandments'],['evidence','Evidence','evidence','#discover?section=evidence']];
 const evidence=[['history','History','timeline','#questions?mode=history'],['science','Science','evidence','#questions?mode=science'],['timeline','Timeline','timeline','#timeline'],['text','Text Comparisons','evidence','#questions?mode=text'],['translation','Translations','evidence','#questions?filter=T'],['questions','Questions','evidence','#questions']];
 let rendered=null;
 function render(){
  const nested=new URLSearchParams(location.hash.split('?')[1]).get('section')==='evidence',items=nested?evidence:topics;
  if(rendered===nested)return;rendered=nested;
  host.innerHTML=`${nested?'<a href="#discover">← Explore</a>':''}<h1 tabindex="-1">${nested?'Evidence':'Explore'}</h1><section class="ux-topic-section" aria-label="${nested?'Evidence':'Explore'} carousel"><div class="ux-topic-row" tabindex="0" aria-label="Swipe or use arrow keys to browse">${items.map(([key,label,image,url],i)=>`<a class="ux-topic" data-topic="${key}" href="${url}" aria-label="${label}"><img src="/assets/explore-${image}.webp" width="1200" height="800" alt="" loading="${i?'lazy':'eager'}"><div class="ux-tile-copy"><strong>${label}</strong><small>Open collection</small><span aria-hidden="true">→</span></div><span class="ux-art-label">Imagined illustration</span></a>`).join('')}</div><nav class="ux-carousel-controls" aria-label="Carousel controls"><button type="button" data-slide="-1" aria-label="Previous topic">←</button><span role="status" aria-live="polite"></span><button type="button" data-slide="1" aria-label="Next topic">→</button></nav></section>`;
  const row=host.querySelector('.ux-topic-row'),status=host.querySelector('[role=status]'),prev=host.querySelector('[data-slide="-1"]'),next=host.querySelector('[data-slide="1"]');
  const index=()=>Math.round(row.scrollLeft/(row.clientWidth||1));
  const update=()=>{const i=index();status.textContent=`${i+1} of ${items.length} · ${items[i]?.[1]||''}`;prev.disabled=i===0;next.disabled=i===items.length-1;};
  const move=offset=>row.scrollTo({left:Math.max(0,Math.min(items.length-1,index()+offset))*row.clientWidth,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
  prev.onclick=()=>move(-1);next.onclick=()=>move(1);row.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(row);row.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowLeft'?-1:1);}});update();
 }
 window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#discover'))render();});render();
 const topic=()=>{
  const hash=location.hash,params=new URLSearchParams(hash.split('?')[1]);
  const key=/^#(?:people|characters)/.test(hash)?'people':hash.startsWith('#stories')?'stories':hash.startsWith('#places')?'places':hash.startsWith('#commandments')?'commandments':hash.startsWith('#timeline')?'timeline':/^#(?:questions|debate)/.test(hash)?params.get('mode')==='history'?'history':params.get('mode')==='science'?'science':params.get('filter')==='T'?'translation':params.get('mode')==='text'?'text':'questions':'evidence';
  document.body.dataset.topic=key;
 };
 window.addEventListener('hashchange',topic);window.addEventListener('viewchange',topic);topic();
})();
