'use strict';
(() => {
 const videos=/*__STORY_VIDEOS__*/{};
 const live=new Map(),online=()=>navigator.onLine!==false;
 const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(title,art){
  const video=videos[title];if(!video||!art)return '';
  const provider=video.provider==='mp4'?'Video':'YouTube';
  return `<figure class="story-illustration story-video" data-story-video="${escape(title)}" data-video-fallback="${escape(JSON.stringify(art))}"><div class="story-video-stage"><img data-video-still src="${escape(online()?video.poster:art.src)}" alt="${escape(online()?video.posterAlt:art.alt)}" width="1200" height="675" loading="lazy" decoding="async"><div data-video-frame hidden></div><button type="button" class="story-video-play" data-video-play${online()?'':' hidden'} aria-label="Play ${escape(title)}${video.provider==='mp4'?' video':' on YouTube'}">Play video</button></div><figcaption>Imagined scene · ${provider}</figcaption><p class="story-video-status" data-video-status role="status" aria-live="polite">${online()?'':"You're offline. The story image is shown."}</p><div class="story-video-actions"><button type="button" data-video-retry hidden>Retry video</button><button type="button" data-video-image hidden>Show image</button></div><details class="story-video-description"><summary>Video description</summary><p>${escape(video.description)}</p></details></figure>`;
 }
 function mount(root){
  for(const [node,controller] of live)if(!node.isConnected){controller.destroy();live.delete(node);}
  for(const node of root.querySelectorAll('[data-story-video]')){
   if(live.has(node))continue;
   const title=node.dataset.storyVideo,video=videos[title];if(!video)continue;
   const still=node.querySelector('[data-video-still]'),slot=node.querySelector('[data-video-frame]'),play=node.querySelector('[data-video-play]'),retry=node.querySelector('[data-video-retry]'),image=node.querySelector('[data-video-image]'),status=node.querySelector('[data-video-status]');
   // Original artwork remains independent of the local video-frame poster.
   const art=JSON.parse(node.dataset.videoFallback);let frame,timer,generation=0,time=0,mode='idle';
   function clear(){clearTimeout(timer);timer=undefined;}
   function remove(){
    generation++;clear();
    if(frame&&video.provider==='mp4'){frame.pause();frame.removeAttribute('src');frame.load();}
    frame?.remove();frame=undefined;slot.hidden=true;slot.replaceChildren();
   }
   function show(state,text=''){
    const focusInside=frame&&document.activeElement===frame||[play,retry,image].includes(document.activeElement);remove();mode=state;
    const poster=state==='idle'&&online();still.src=poster?video.poster:art.src;still.alt=poster?video.posterAlt:art.alt;still.hidden=false;
    play.hidden=!['idle','image'].includes(state)||!online();retry.hidden=state!=='error'||!online();image.hidden=true;status.textContent=text;
    if(focusInside)(!play.hidden?play:!retry.hidden?retry:node.querySelector('summary')).focus({preventScroll:true});
   }
   function fail(){show('error','Video unavailable. The story image is shown. Try again when your connection is ready.');}
   function deadline(){clear();timer=setTimeout(fail,15000);}
   function stateChange(state,value){
    if(state==='time'){if(Number.isFinite(value)&&value>=0)time=value;return;}
    if(state==='error'){fail();return;}
    if(state==='ended'){time=0;show('idle');return;}
    if(state==='playing'||state==='paused'){clear();mode=state;status.textContent='';}
    else if(state==='buffering'){mode='loading';status.textContent='Loading video.';deadline();}
   }
   function start(){
    if(!online()){show('offline',"You're offline. The story image is shown.");return;}
    remove();mode='loading';status.textContent='Loading video.';play.hidden=true;retry.hidden=true;image.hidden=false;slot.hidden=false;still.hidden=true;
    const attempt=generation;
    if(video.provider==='mp4'){
     const resumeTime=time,media=document.createElement('video');frame=media;
     media.controls=true;media.playsInline=true;media.preload='none';media.poster=video.poster;media.setAttribute('aria-label',title+' video');
     const listen=(event,fn)=>media.addEventListener(event,()=>{if(attempt===generation)fn();});
     listen('loadedmetadata',()=>{if(resumeTime>0&&Number.isFinite(media.duration))media.currentTime=Math.min(resumeTime,Math.max(0,media.duration-0.1));});
     for(const [event,state] of Object.entries({playing:'playing',pause:'paused',ended:'ended',error:'error'}))listen(event,()=>stateChange(state));
     // Network 'stalled' is not necessarily playback starvation. Buffered or
     // paused video must stay usable; only an actual waiting player is timed.
     listen('waiting',()=>{if(!media.paused)stateChange('buffering');});
     listen('timeupdate',()=>{if(mode==='loading'&&!media.paused&&media.readyState>=3&&media.currentTime>time)stateChange('playing');stateChange('time',media.currentTime);});
     media.src=video.src;slot.appendChild(media);deadline();media.focus({preventScroll:true});
     // Only this explicit Play/Retry gesture attaches the remote source. Native
     // controls remain available if the browser declines programmatic playback.
     media.play().catch(error=>{if(attempt!==generation)return;if(error.name==='AbortError'&&media.paused&&mode==='paused')return;if(error.name==='NotAllowedError'){clear();mode='paused';status.textContent='Select Play in the video controls to continue.';}else fail();});
    }else{
     frame=document.createElement('iframe');frame.title=title+' - YouTube video';frame.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
     const native=window.Capacitor?.isNativePlatform?.()||!/^https?:$/.test(location.protocol);
     const url=new URL('/story-video-player.html',native?'https://scripture-lens.kvn-mcgwn.chatgpt.site':location.origin);url.searchParams.set('video',video.videoId);if(time>0)url.searchParams.set('start',Math.floor(time));frame.src=url.href;
     frame.onerror=()=>{if(attempt===generation)fail();};slot.appendChild(frame);deadline();frame.focus({preventScroll:true});
    }
   }
   function message(event){
    if(video.provider==='mp4'||!frame||event.source!==frame.contentWindow||event.origin!==new URL(frame.src).origin||event.data?.type!=='biblelens:story-video')return;
    stateChange(event.data.state,event.data.time);
   }
   play.onclick=retry.onclick=start;image.onclick=()=>show('image','The story image is shown.');
   function network(){if(!online())show('offline',"You're offline. The story image is shown.");else if(mode==='offline')show('idle','Connection restored. Select Play video to continue.');}
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
