'use strict';
(() => {
 const videos=/*__STORY_VIDEOS__*/{};
 const live=new Map(),online=()=>navigator.onLine!==false;
 const motion=window.matchMedia?.('(prefers-reduced-motion: reduce)'),connection=navigator.connection;
 const automatic=()=>online()&&!document.hidden&&!motion?.matches&&!connection?.saveData&&!/^(slow-)?2g$/.test(connection?.effectiveType||'');
 let observer,selected,settle,suspended=false;
 const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(title,art){
  const video=videos[title];if(!video||!art)return '';
  const descriptionId='story-video-description-'+title.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  return `<figure class="story-illustration story-video" tabindex="-1" aria-describedby="${escape(descriptionId)}" data-story-video="${escape(title)}" data-video-fallback="${escape(JSON.stringify(art))}"><div class="story-video-stage"><img data-video-still src="${escape(online()?video.poster:art.src)}" alt="${escape(online()?video.posterAlt:art.alt)}" width="1200" height="675" loading="lazy" decoding="async"><div data-video-frame hidden></div><button type="button" class="story-video-play" data-video-play${online()?'':' hidden'} aria-label="Play ${escape(title)}${video.provider==='mp4'?' video':' on YouTube'}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7 4v16l14-8z"/></svg></button><button type="button" class="story-video-reveal" data-video-reveal hidden aria-label="Show controls for ${escape(title)}"></button></div><p class="story-video-status" data-video-status role="status" aria-live="polite">${online()?'':"You're offline. The story image is shown."}</p><div class="story-video-actions"><button type="button" data-video-retry hidden>Retry video</button></div><span class="sr-only" id="${escape(descriptionId)}">Imagined scene. ${escape(video.description)}</span></figure>`;
 }
 // One owner, with entry/exit hysteresis and a short dwell before autoplay.
 // Reset a viewing only after the stage has been fully offscreen for 500 ms.
 function reconcile(){
  clearTimeout(settle);
  const controllers=[...live.values()].filter(c=>c.connected());
  if(suspended||!automatic()){for(const c of controllers)c.unwarm();return;}
  let best=controllers.filter(c=>c.ratio>=0.6).sort((a,b)=>b.ratio-a.ratio)[0];
  if(selected?.ratio>=0.35&&controllers.includes(selected)&&(!best||best.ratio<selected.ratio+0.15))best=selected;
  if(selected!==best){selected?.leave();selected=best;}
  refreshNeighbors(controllers);
  if(selected)settle=setTimeout(()=>{if(!suspended&&automatic()&&selected?.ratio>=0.35)selected.autoplay();},180);
 }
 function refreshNeighbors(controllers=[...live.values()].filter(c=>c.connected())){
  const index=controllers.indexOf(selected);
  const canWarm=index>=0&&!suspended&&automatic();
  controllers.forEach((controller,position)=>{
   if(controller===selected)return;
   if(canWarm&&Math.abs(position-index)<=2)controller.warm();
   else controller.unwarm();
  });
 }
 function claim(controller){clearTimeout(settle);for(const c of live.values())if(c!==controller)c.leave();selected=controller;refreshNeighbors();}
 function observe(){
  if(observer||!window.IntersectionObserver)return;
  observer=new window.IntersectionObserver(entries=>{
   for(const entry of entries){const c=[...live.values()].find(c=>c.stage===entry.target);if(c)c.visibility(entry.isIntersecting?entry.intersectionRatio:0);}
   reconcile();
  },{threshold:[0,0.01,0.1,0.35,0.6,0.75,0.9,1]});
 }
 function mount(root){
  suspended=false;
  for(const [node,controller] of live)if(!node.isConnected){controller.destroy();live.delete(node);}
  for(const node of root.querySelectorAll('[data-story-video]')){
   if(live.has(node))continue;
   const title=node.dataset.storyVideo,video=videos[title];if(!video)continue;
   const still=node.querySelector('[data-video-still]'),slot=node.querySelector('[data-video-frame]'),play=node.querySelector('[data-video-play]'),retry=node.querySelector('[data-video-retry]'),status=node.querySelector('[data-video-status]');
   const reveal=node.querySelector('[data-video-reveal]');
   const stage=node.querySelector('.story-video-stage')||node;
   const art=JSON.parse(node.dataset.videoFallback);let frame,timer,exitTimer,generation=0,time=0,resumeTime=0,mode='idle',consumed=false,ready=false,muted=false,warmFailed=false;
   function clear(){clearTimeout(timer);timer=undefined;}
   function remove(){
    generation++;clear();ready=false;reveal.hidden=true;
    if(frame&&video.provider==='mp4'){frame.pause();frame.removeAttribute('src');frame.load();}
    frame?.remove();frame=undefined;slot.hidden=true;slot.replaceChildren();
   }
   function show(state,text=''){
    const focusInside=frame&&document.activeElement===frame||[play,retry,reveal].includes(document.activeElement);remove();mode=state;
    const poster=state==='idle'&&online();still.src=poster?video.poster:art.src;still.alt=poster?video.posterAlt:art.alt;still.hidden=false;
    play.hidden=state!=='idle'||!online();retry.hidden=state!=='error'||!online();status.textContent=text;
    if(focusInside)(!play.hidden?play:!retry.hidden?retry:node).focus({preventScroll:true});
   }
   function fail(){if(mode==='preload'){warmFailed=true;show('idle');return;}consumed=true;show('error','Video unavailable. The story image is shown. Try again when your connection is ready.');}
   function deadline(){clear();timer=setTimeout(fail,15000);}
   function stateChange(state,value){
    if(mode==='preload'){if(state==='error')fail();return;}
    if(state==='time'){if(Number.isFinite(value)&&value>=0)time=value;return;}
    if(state==='error'){fail();return;}
    if(state==='ended'){consumed=true;time=0;show('idle');return;}
    if(state==='playing'||state==='paused'){clear();mode=state;status.textContent='';if(state==='playing')claim(controller);}
    else if(state==='buffering'){mode='loading';status.textContent='Loading video.';deadline();}
   }
   function command(action){frame?.contentWindow?.postMessage({type:'biblelens:story-video-command',action,muted},new URL(frame.src).origin);}
   function showControls(){
    frame.controls=true;
    if(document.activeElement===reveal)frame.focus({preventScroll:true});
    reveal.hidden=true;
   }
   reveal.onclick=showControls;
   function playMedia(){
    const attempt=generation;
    if(video.provider!=='mp4'){if(ready)command('play');return;}
    frame.muted=muted;
    if(resumeTime>0&&frame.readyState>=1&&Number.isFinite(frame.duration))frame.currentTime=Math.min(resumeTime,Math.max(0,frame.duration-0.1));
    frame.play().catch(error=>{if(attempt!==generation)return;if(error.name==='AbortError'&&frame.paused&&mode==='paused')return;if(error.name==='NotAllowedError'){clear();mode='paused';showControls();status.textContent='Select Play in the video controls to continue.';}else fail();});
   }
   function create(preload){
    const attempt=generation;resumeTime=time;ready=false;
    if(video.provider==='mp4'){
     const media=document.createElement('video');frame=media;
     media.controls=false;media.playsInline=true;media.preload=preload?'auto':'none';media.loop=false;media.muted=muted;media.poster=video.poster;media.setAttribute('aria-label',title+' video');
     const listen=(event,fn)=>media.addEventListener(event,()=>{if(attempt===generation)fn();});
     listen('loadedmetadata',()=>{if(mode!=='preload'&&resumeTime>0&&Number.isFinite(media.duration))media.currentTime=Math.min(resumeTime,Math.max(0,media.duration-0.1));});
     for(const [event,state] of Object.entries({playing:'playing',pause:'paused',ended:'ended',error:'error'}))listen(event,()=>stateChange(state));
     listen('waiting',()=>{if(mode!=='preload'&&!media.paused)stateChange('buffering');});
     listen('timeupdate',()=>{if(mode==='preload')return;if(mode==='loading'&&!media.paused&&media.readyState>=3&&media.currentTime>time)stateChange('playing');stateChange('time',media.currentTime);});
     media.src=video.src;slot.appendChild(media);if(preload)media.load();
    }else{
     frame=document.createElement('iframe');frame.title=title+' - YouTube video';frame.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
     const native=window.Capacitor?.isNativePlatform?.()||!/^https?:$/.test(location.protocol);
     const url=new URL('/story-video-player.html',native?'https://scripture-lens.kvn-mcgwn.chatgpt.site':location.origin);url.searchParams.set('video',video.videoId);if(time>0)url.searchParams.set('start',Math.floor(time));
     // Warm the official player without playing it. The provider decides how
     // much it can buffer; hidden YouTube playback is never used as a prefetch.
     url.searchParams.set('autoplay',preload?'0':'1');url.searchParams.set('muted',muted?'1':'0');url.searchParams.set('parentOrigin',location.origin);frame.src=url.href;
     frame.onerror=()=>{if(attempt===generation)fail();};slot.appendChild(frame);
    }
   }
   function start(auto=false){
    if(!online()){show('offline',"You're offline. The story image is shown.");return;}
    consumed=true;muted=auto;claim(controller);
    const warmed=frame&&mode==='preload';resumeTime=time;if(!warmed)remove();
    mode='loading';status.textContent='Loading video.';play.hidden=true;retry.hidden=true;slot.hidden=false;still.hidden=true;
    if(!warmed)create(false);
    const isMp4=video.provider==='mp4';
    reveal.hidden=!isMp4;
    deadline();if(!auto||[play,retry].includes(document.activeElement))(isMp4?reveal:frame).focus({preventScroll:true});
    if(video.provider==='mp4'||warmed)playMedia();
   }
   function message(event){
    if(video.provider==='mp4'||!frame||event.source!==frame.contentWindow||event.origin!==new URL(frame.src).origin||event.data?.type!=='biblelens:story-video')return;
    if(event.data.state==='ready'){ready=true;if(mode==='loading')command('play');return;}
    if(event.data.state==='blocked'){clear();mode='paused';status.textContent='Select Play in the video controls to continue.';return;}
    stateChange(event.data.state,event.data.time);
   }
   play.onclick=retry.onclick=()=>start();
   function network(){if(controller.ratio>0||(frame&&mode!=='preload'))consumed=true;if(!online())show('offline',"You're offline. The story image is shown.");else if(mode==='offline')show('idle','Connection restored. Select Play video to continue.');}
   still.addEventListener('error',()=>{if(still.getAttribute('src')===video.poster){still.src=art.src;still.alt=art.alt;}});
   window.addEventListener('message',message);
   const controller={stage,ratio:0,connected:()=>node.isConnected,
    network,autoplay:()=>{if(!consumed&&['idle','preload'].includes(mode))start(true);},
    visibility(ratio){this.ratio=ratio;clearTimeout(exitTimer);if(ratio<0.35)this.leave();if(ratio===0)exitTimer=setTimeout(()=>{if(this.ratio===0&&!document.hidden&&!suspended){consumed=false;warmFailed=false;if(mode==='preload'&&resumeTime>0)show('idle');time=0;resumeTime=0;reconcile();}},500);},
    warm(){if(frame||mode!=='idle'||warmFailed)return;muted=true;mode='preload';create(true);},
    unwarm(){if(mode==='preload')show('idle');},
    leave(){if(frame&&mode!=='preload')show('idle');},
    stop(){if(this.ratio>0||(frame&&mode!=='preload'))consumed=true;if(frame)show('idle');},
    destroy(){clearTimeout(exitTimer);observer?.unobserve(stage);remove();window.removeEventListener('message',message);if(selected===controller)selected=undefined;}
   };
   live.set(node,controller);if(!online())network();observe();observer?.observe(stage);
  }
  reconcile();
 }
 function unmount(root){for(const [node,controller]of live)if(root.contains(node)){controller.destroy();live.delete(node);}reconcile();}
 function stop(){suspended=true;clearTimeout(settle);selected=undefined;for(const c of live.values())c.stop();}
 window.addEventListener('online',()=>{for(const c of live.values())c.network();reconcile();});window.addEventListener('offline',()=>{for(const c of live.values())c.network();reconcile();});
 window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else{suspended=false;reconcile();}});
 const preferencesChanged=()=>{if(!automatic())for(const c of live.values())c.stop();reconcile();};
 motion?.addEventListener?.('change',preferencesChanged);connection?.addEventListener?.('change',preferencesChanged);
 window.BibleLensStoryVideo=Object.freeze({render,mount,unmount,stop});
})();
