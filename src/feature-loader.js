'use strict';
(() => {
 const manifest=/*__FEATURES__*/{},pending=new Map(),loaded=new Set(),styles=new Map();
 const nonce=document.currentScript?.nonce||'';
 async function recoverVersion(){
  // Cached pages can reference files from a release that has since changed.
  // Refresh only public app files; saved notes and sign-in are untouched.
  if(document.querySelector('script[src*="device-bootstrap"]'))return;
  try{
   const response=await fetch('/assets/startup-manifest.json',{cache:'no-store'});
   if(!response.ok)return;
   const latest=await response.json(),current=document.getElementById('biblelens-app-styles')?.getAttribute('href');
   if(latest.css?.path&&current&&latest.css.path!==current){
    const url=new URL(location.href),build=latest.css.sha256;
    if(build&&url.searchParams.get('build')!==build){url.searchParams.set('build',build);location.replace(url.href);}
   }
  }catch{/* Offline readers retain their data and can use Retry. */}
 }
 function style(path){
  if(!styles.has(path))styles.set(path,new Promise((resolve,reject)=>{
   let attempt=0;
   function request(){
    const link=document.createElement('link');link.rel='stylesheet';link.href=path+(attempt?'?retry='+attempt:'');
    let finished=false;
    const fail=()=>{
     if(finished)return;finished=true;clearTimeout(timer);link.remove();
     if(++attempt<3){setTimeout(request,300*attempt);return;}
     styles.delete(path);void recoverVersion();reject(Error('Styles could not load. Check your connection and retry.'));
    };
    const timer=setTimeout(fail,20000);
    link.onload=()=>{if(finished)return;finished=true;clearTimeout(timer);resolve();};link.dataset.featureStyle=path;link.onerror=fail;
    const full=document.querySelector('link[data-feature-style="'+manifest.styles+'"]');if(path===manifest.studyStyles&&full)full.before(link);else document.head.append(link);
   }
   request();
  }));
  return styles.get(path);
 }
 async function load(name){
  const stylesheet=name==='study'?manifest.studyStyles:manifest.styles;
  // A failed stylesheet must not expose a partly initialized, unstyled reader.
  await style(stylesheet);
  if(loaded.has(name))return;
  if(!pending.has(name))pending.set(name,new Promise((resolve,reject)=>{
   const script=document.createElement('script');
   const fail=message=>{clearTimeout(timer);script.remove();pending.delete(name);void recoverVersion();reject(Error(message));};
   const timer=setTimeout(()=>fail('This screen could not start. Reload zLenz: Bible to retry.'),20000);script.src=manifest[name];if(nonce)script.nonce=nonce;
   script.onload=()=>{clearTimeout(timer);script.remove();if(script.dataset.biblelensReady!=='true'){pending.delete(name);reject(Error('This screen could not start. Reload zLenz: Bible to retry.'));return;}resolve();};
   script.onerror=()=>fail('This screen could not load. Check your connection and retry.');document.head.append(script);
  }));
  await pending.get(name);loaded.add(name);
 }
 function requirements(hash){
  const path=hash.split('?')[0];
  if(!path||['#','#discover','#sync'].includes(path))return [];
  if(/^#debate(?:\/|$)/.test(path))return ['study','debates'];
  if(/^#(?:questions|debates)$/.test(path))return ['debates'];
  const directory=/^#(?:evidence|categories|saved)(?:[/?]|$)/.test(path)?'evidence':/^#(?:people|characters)(?:\/|$)/.test(path)?'characters':/^#places(?:\/|$)/.test(path)?'places-directory':/^#timeline(?:\/|$)/.test(path)?'timeline':/^#commandments(?:\/|$)/.test(path)?'commandments':null;
  return ['study',...(directory?[directory]:[])];
 }
 let routing=null;
 function route(hash){
  const required=requirements(hash);
  if(required.every(name=>loaded.has(name))){routing=null;document.getElementById('route-loading')?.setAttribute('hidden','');document.getElementById('main')?.removeAttribute('aria-busy');return false;}
  if(routing?.hash===hash)return true;
  const job={hash};routing=job;
 const label=/^#(?:compare|investigation)/.test(hash)?'Compare Passages':/^#read/.test(hash)?'Read':/^#search/.test(hash)?'Search':/^#commandments/.test(hash)?'Commandments':/^#(?:people|characters)/.test(hash)?'People':/^#places/.test(hash)?'Places':/^#timeline/.test(hash)?'Timeline':/^#stories/.test(hash)?'Events':/^#debate\//.test(hash)?'Question':/^#questions/.test(hash)?'Text Comparisons':/^#notebook/.test(hash)?'Saved':'Explore';
  const context=document.querySelector('#header-context');if(context)context.textContent=label;const nav=document.querySelector('.lens-context');if(nav){nav.hidden=false;nav.innerHTML='<h1>'+label+'</h1>';}document.title=label+' · zLenz: Bible';document.querySelector('#lens-settings')?.setAttribute('aria-label','Settings for '+label);
  queueMicrotask(async()=>{
   if(routing!==job||location.hash!==hash)return;
   const main=document.getElementById('main');let panel=document.getElementById('route-loading');
   if(!panel){panel=document.createElement('section');panel.id='route-loading';panel.className='lens-workspace';main.append(panel);}
   for(const section of main.querySelectorAll(':scope > section'))section.hidden=section!==panel;
   panel.dataset.destinationLabel=label;panel.hidden=false;panel.innerHTML='<p role="status">Opening this screen…</p>';main.setAttribute('aria-busy','true');
   try{
    for(const name of required)await load(name);
    if(routing!==job||location.hash!==hash)return;
    panel.hidden=true;main.removeAttribute('aria-busy');routing=null;
    window.dispatchEvent(new CustomEvent('biblelens:featuresready'));
    window.BibleLensFeatures.resume();
    if(/^#(?:read|explore|study|compare|investigation)(?:[/?]|$)/.test(hash))window.BibleLensReader?.ensure();
   }catch(error){
    if(routing!==job||location.hash!==hash)return;
    main.removeAttribute('aria-busy');panel.replaceChildren();const copy=document.createElement('p');copy.setAttribute('role','alert');copy.textContent=error.message;const retry=document.createElement('button');retry.className='lens-button';retry.textContent='Retry';retry.onclick=()=>{if(/could not start/.test(error.message)){location.reload();return;}routing=null;route(location.hash);};panel.append(copy,retry);
   }
  });
  return true;
 }
 requestAnimationFrame(()=>requestAnimationFrame(()=>{if(!document.querySelector('script[src*="device-bootstrap"]'))fetch('/api/search?q=John%203%3A16').catch(()=>{});}));
 window.BibleLensFeatures={load,style,route,resume:()=>window.dispatchEvent(new HashChangeEvent('hashchange'))};
 document.addEventListener('click',event=>{
  const settings=event.target.closest('#lens-settings');
  if(settings&&!loaded.has('study')){event.preventDefault();event.stopImmediatePropagation();load('study').then(()=>settings.click()).catch(error=>toast(error.message));return;}

 },true);
 let referenceContextVersion=0;
 function openReferenceContext(kind,id,button){
  const hash=location.hash,version=++referenceContextVersion;
  const position={left:window.scrollX,top:document.body.classList.contains('dialog-scroll-locked')?-parseFloat(document.body.style.top||'0'):window.scrollY};
  return load(kind==='person'?'characters':'map').then(()=>{
   if(version!==referenceContextVersion||location.hash!==hash||!button.isConnected)return;
   const dialog=document.querySelector(kind==='person'?'#character-sheet':'#atlas-sheet');
   if(dialog&&!dialog.open)dialog.addEventListener('close',()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(location.hash===hash&&!document.querySelector('dialog[open]'))window.scrollTo({...position,behavior:'instant'});
   })),{once:true});
   if(kind==='person')window.dispatchEvent(new CustomEvent('open-person',{detail:{id,opener:button}}));
   else window.BibleLensAtlas.open(id,button);
  }).catch(error=>toast(error.message));
 }
 function openAtlas(id,button){if(button.classList.contains('ux-place-open'))return;return openReferenceContext('place',id,button);}
// Holding a place opens its in-app contents, and scrolling cancels the hold.
let placePress=null,placeTimer=0,suppressPlaceUntil=0;
function cancelPlacePress(){clearTimeout(placeTimer);placePress=null;}
document.addEventListener('pointerdown',event=>{
 const chip=event.target.closest('[data-place-id]');if(!chip||event.button!==0)return;
 cancelPlacePress();placePress={chip,id:event.pointerId,x:event.clientX,y:event.clientY};
 placeTimer=setTimeout(()=>{if(!placePress)return;suppressPlaceUntil=Date.now()+1000;openAtlas(chip.dataset.placeId,chip);cancelPlacePress();},500);
},true);
document.addEventListener('pointermove',event=>{if(placePress&&placePress.id===event.pointerId&&Math.hypot(event.clientX-placePress.x,event.clientY-placePress.y)>8)cancelPlacePress();},true);
for(const type of ['pointerup','pointercancel'])document.addEventListener(type,cancelPlacePress,true);
document.addEventListener('scroll',cancelPlacePress,true);
document.addEventListener('contextmenu',event=>{const chip=event.target.closest('[data-place-id]');if(!chip)return;event.preventDefault();event.stopImmediatePropagation();cancelPlacePress();suppressPlaceUntil=Date.now()+1000;if(!document.querySelector('#atlas-sheet')?.open)openAtlas(chip.dataset.placeId,chip);},true);
// Capture prevents reader verse gestures and citation navigation from handling a chip tap.
document.addEventListener('click',event=>{const chip=event.target.closest('[data-place-id]');if(!chip||chip.classList.contains('ux-place-open'))return;event.preventDefault();event.stopImmediatePropagation();if(Date.now()<suppressPlaceUntil)return;openAtlas(chip.dataset.placeId,chip);},true);
for(const type of ['pointerdown','dblclick','contextmenu'])document.addEventListener(type,event=>{if(event.target.closest('[data-place-id]'))event.stopImmediatePropagation();},true);
// People cards open over the current reading position, like the atlas.
document.addEventListener('click',event=>{const chip=event.target.closest('[data-person-id]');if(!chip)return;event.preventDefault();event.stopImmediatePropagation();if(window.getSelection()?.toString())return;openReferenceContext('person',chip.dataset.personId,chip);},true);
for(const type of ['pointerdown','dblclick'])document.addEventListener(type,event=>{if(event.target.closest('[data-person-id]'))event.stopImmediatePropagation();},true);

 function references(){if((['stories','evidence'].includes(view)||(view==='read'&&typeof reading!=='undefined'&&reading&&!reading.verses[0]?.referenceLinks)))requestAnimationFrame(()=>requestAnimationFrame(()=>load('references').catch(()=>{})));}
 window.addEventListener('biblelens:readerchange',references);window.addEventListener('viewchange',references);
})();
