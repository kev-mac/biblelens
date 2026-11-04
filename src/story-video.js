'use strict';
(() => {
 const videos=/*__STORY_VIDEOS__*/{};
 const live=new Map(),online=()=>navigator.onLine!==false;
 const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(title,art){
  const video=videos[title];if(!video||!art)return '';
  return `<figure class="story-illustration story-video" data-story-video="${escape(title)}" data-video-fallback="${escape(JSON.stringify(art))}"><div class="story-video-stage"><img data-video-still src="${escape(online()?video.poster:art.src)}" alt="${escape(online()?video.posterAlt:art.alt)}" width="1200" height="675" loading="lazy" decoding="async"><div data-video-frame hidden></div><button type="button" class="story-video-play" data-video-play${online()?'':' hidden'} aria-label="Play ${escape(title)} on YouTube">Play video</button></div><figcaption>Imagined scene · YouTube</figcaption><p class="story-video-status" data-video-status role="status" aria-live="polite">${online()?'':"You’re offline. The story image is shown."}</p><div class="story-video-actions"><button type="button" data-video-retry hidden>Retry video</button><button type="button" data-video-image hidden>Show image</button></div><details class="story-video-description"><summary>Video description</summary><p>${escape(video.description)}</p></details></figure>`;
 }
 function mount(root){
  for(const [node,controller] of live)if(!node.isConnected){controller.destroy();live.delete(node);}
  for(const node of root.querySelectorAll('[data-story-video]')){
   if(live.has(node))continue;
   const title=node.dataset.storyVideo,video=videos[title];if(!video)continue;
   const still=node.querySelector('[data-video-still]'),slot=node.querySelector('[data-video-frame]'),play=node.querySelector('[data-video-play]'),retry=node.querySelector('[data-video-retry]'),image=node.querySelector('[data-video-image]'),status=node.querySelector('[data-video-status]');
   // The original art is passed separately so an unavailable poster can never
   // replace the offline fallback or initiate a remote thumbnail request.
   const art=JSON.parse(node.dataset.videoFallback);let frame,timer,generation=0,time=0,mode='idle';
   function clear(){clearTimeout(timer);timer=undefined;}
   function remove(){generation++;clear();frame?.remove();frame=undefined;slot.hidden=true;slot.replaceChildren();}
   function show(state,text=''){
    const focusInside=frame&&document.activeElement===frame||[play,retry,image].includes(document.activeElement);remove();mode=state;
    const poster=state==='idle'&&online();still.src=poster?video.poster:art.src;still.alt=poster?video.posterAlt:art.alt;still.hidden=false;
    play.hidden=!['idle','image'].includes(state)||!online();retry.hidden=state!=='error'||!online();image.hidden=true;status.textContent=text;
    if(focusInside)(!play.hidden?play:!retry.hidden?retry:node.querySelector('summary')).focus({preventScroll:true});
   }
   function fail(){show('error','Video unavailable. The story image is shown. Try again when your connection is ready.');}
   function deadline(){clear();timer=setTimeout(fail,15000);}
   function start(){
    if(!online()){show('offline','You’re offline. The story image is shown.');return;}
    remove();mode='loading';status.textContent='Loading video…';play.hidden=true;retry.hidden=true;image.hidden=false;slot.hidden=false;still.hidden=true;
    frame=document.createElement('iframe');frame.title=title+' — YouTube video';frame.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
    const native=window.Capacitor?.isNativePlatform?.()||!/^https?:$/.test(location.protocol);
    const url=new URL('/story-video-player.html',native?'https://scripture-lens.kvn-mcgwn.chatgpt.site':location.origin);url.searchParams.set('video',video.videoId);if(time>0)url.searchParams.set('start',Math.floor(time));frame.src=url.href;
    const attempt=generation;frame.onerror=()=>{if(attempt===generation)fail();};slot.appendChild(frame);deadline();frame.focus({preventScroll:true});
   }
   function message(event){
    if(!frame||event.source!==frame.contentWindow||event.origin!==new URL(frame.src).origin||event.data?.type!=='biblelens:story-video')return;
    const state=event.data.state;
    if(state==='time'){if(Number.isFinite(event.data.time)&&event.data.time>=0)time=event.data.time;return;}
    if(state==='error'){fail();return;}
    if(state==='ended'){time=0;show('idle');return;}
    if(state==='playing'){clear();mode='playing';status.textContent='';}
    else if(state==='paused'){clear();mode='paused';status.textContent='';}
    else if(state==='buffering'){mode='loading';status.textContent='Loading video…';deadline();}
   }
   play.onclick=retry.onclick=start;image.onclick=()=>show('image','The story image is shown.');
   function network(){if(!online())show('offline','You’re offline. The story image is shown.');else if(mode==='offline')show('idle','Connection restored. Select Play video to continue.');}
   still.addEventListener('error',()=>{if(still.getAttribute('src')===video.poster){still.src=art.src;still.alt=art.alt;}});
   window.addEventListener('message',message);
   live.set(node,{network,stop:()=>{if(frame)show('idle');},destroy:()=>{remove();window.removeEventListener('message',message);}});
   network();
  }
 }
 function unmount(root){for(const [node,controller]of live)if(root.contains(node)){controller.destroy();live.delete(node);}}
 window.addEventListener('online',()=>{for(const c of live.values())c.network();});window.addEventListener('offline',()=>{for(const c of live.values())c.network();});
 const stop=()=>{for(const c of live.values())c.stop();};window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 window.BibleLensStoryVideo=Object.freeze({render,mount,unmount,stop});
})();
