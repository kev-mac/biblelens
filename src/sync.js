'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const native=document.documentElement.classList.contains('native-ios');
 const cloud='https://scripture-lens.kvn-mcgwn.chatgpt.site';
 const prefix=native?cloud:'';
 const core=window.BibleLensSync,storageKey='biblelens-cloud-sync-v1';
 let meta={enabled:false,base:{},owner:null,token:null},busy=false,applying=false,revoking=false,timer,identity;
 try{meta={...meta,...JSON.parse(localStorage.getItem(storageKey)||'{}')};}catch{}
 // Web sync uses the signed-in session; never retain an unused device bearer.
 if(!native&&(meta.token||meta.disconnectPending)){meta.token=null;delete meta.disconnectPending;saveMeta();}
 if(meta.disconnectPending)meta.enabled=false;
 const panel=document.createElement('section');panel.className='cloud-sync-settings';
 panel.innerHTML='<h3>Cloud Sync</h3><p>Keep bookmarks, notes, appearance, and reader preferences together. Reading and search still work offline.</p><p data-sync-status role="status" aria-live="polite"></p><div class="sync-actions"></div><div class="sync-pair" hidden></div>';
 document.querySelector('#reader-settings').append(panel);
 const status=panel.querySelector('[data-sync-status]'),actions=panel.querySelector('.sync-actions'),pair=panel.querySelector('.sync-pair');
 function say(text){status.textContent=text;}
 function saveMeta(){try{localStorage.setItem(storageKey,JSON.stringify(meta));}catch{meta.enabled=false;throw Error('Device storage is full. Export your notes before enabling sync.');}}
 function backup(){localStorage.setItem('biblelens-before-cloud-sync',JSON.stringify({...state,backedUpAt:new Date().toISOString()}));}
 async function api(path,options={}){
  const response=await fetch(prefix+'/api/sync'+path,{...options,credentials:native?'omit':'same-origin',headers:{'content-type':'application/json','x-biblelens-sync':'1',...(native&&meta.token?{authorization:'Bearer '+meta.token}:{}),...options.headers},signal:AbortSignal.timeout(15000)});
  const data=await response.json();if(!response.ok)throw Object.assign(Error(data.error||'Sync is unavailable.'),{status:response.status});return data;
 }
 async function retryDisconnect(){
  if(!meta.disconnectPending||revoking)return;
  revoking=true;
  try{
   if(meta.token)try{await api('/disconnect',{method:'POST'});}catch(error){if(error.status!==401)throw error;}
   // A 401 also means this credential can no longer authorize sync.
   meta={enabled:false,owner:null,base:{},token:null};saveMeta();render();
   say('Sync is off. This iPhone is disconnected. Your notes remain on this device.');
  }catch{
   say('Sync is off. Disconnect is pending. Reconnect to retry, or use Disconnect all iPhones on the website.');
  }finally{revoking=false;}
 }
 async function disconnect(){
  clearTimeout(timer);
  // Persist the off state before the request. Keep a failed revocation available
  // for retry after reload; never resume document sync with this credential.
  meta={enabled:false,owner:null,base:{},token:native?meta.token:null,...(native&&meta.token?{disconnectPending:true}:{})};
  saveMeta();render();
  if(meta.disconnectPending)await retryDisconnect();else say('Sync is off. Your notes remain on this device.');
 }
 function button(label,action){const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent=label;b.onclick=async()=>{b.disabled=true;try{await action();}catch(error){say(error.message);}finally{b.disabled=false;}};actions.append(b);return b;}
 function downloadBackup(){const value=localStorage.getItem('biblelens-before-cloud-sync');if(!value){say('A safety backup is created when sync first starts.');return;}const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([value],{type:'application/json'}));a.download='BibleLens-before-cloud-sync.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
 function render(){
  actions.replaceChildren();pair.hidden=true;
  if(meta.disconnectPending){
   button('Retry Disconnect',retryDisconnect);
   button('Download Safety Backup',downloadBackup);
  }else if(meta.enabled){
   button('Sync Now',sync);
   button('Turn Off Sync',disconnect);
   button('Download Safety Backup',downloadBackup);
   if(!native){
    if(!identity){const a=document.createElement('a');a.href='/signin-with-chatgpt?return_to='+encodeURIComponent('/#sync');a.target='_top';a.textContent='Sign In Again';actions.append(a);}
    button('Connect iPhone',async()=>{const data=await api('/pair',{method:'POST'});pair.replaceChildren();const p=document.createElement('p');p.textContent='On your iPhone, open Settings → Cloud sync and enter this code. It expires in 10 minutes and works once.';const input=document.createElement('input');input.readOnly=true;input.value=data.code;input.setAttribute('aria-label','iPhone connection code');pair.append(p,input);pair.hidden=false;input.select();});
    button('Disconnect All iPhones',async()=>{await api('/disconnect',{method:'POST'});say('All connected iPhones were disconnected. Their local notes remain available.');});
   }
  }else if(native){
   const p=document.createElement('p');p.textContent='Sign in and enable sync on the website, choose Connect iPhone, then paste its one-time code here.';const input=document.createElement('input');input.placeholder='xxxx-xxxx-xxxx-xxxx';input.autocomplete='off';input.setAttribute('aria-label','Website connection code');pair.replaceChildren(p,input);pair.hidden=false;
   button('Connect',async()=>{const data=await api('/pair/redeem',{method:'POST',body:JSON.stringify({code:input.value})});backup();meta={enabled:true,base:{},owner:data.userId,token:data.token};saveMeta();render();await sync();});
   const a=document.createElement('a');a.href=cloud+'/#sync';a.target='_blank';a.rel='noopener';a.textContent='Open BibleLens Website';actions.append(a);
  }else if(identity){
   button('Enable Cloud Sync',async()=>{backup();meta={enabled:true,base:{},owner:identity.userId,token:null};saveMeta();render();await sync();});
  }else{
   const a=document.createElement('a');a.href='/signin-with-chatgpt?return_to='+encodeURIComponent('/#sync');a.target='_top';a.textContent='Sign In with ChatGPT';actions.append(a);
  }
 }
 async function sync(){
  if(!meta.enabled||meta.disconnectPending||busy)return;busy=true;const sessionMeta=meta,active=()=>meta===sessionMeta&&meta.enabled;say('Syncing…');
  try{
   const session=await api('/session');if(!active())return;
   if(session.userId!==meta.owner){meta.enabled=false;saveMeta();render();throw Error('The signed-in account changed. Your local notes were kept; enable sync explicitly for this account.');}
   for(let attempt=0;attempt<4;attempt++){
    if(!active())return;
    const captured=core.snapshot(state),remote=await api('/document');if(!active())return;
    const merged=core.merge(meta.base,captured,remote.data);
    let revision=remote.revision;
    if(!core.equal(merged.data,remote.data)){
     try{revision=(await api('/document',{method:'PUT',body:JSON.stringify({revision:remote.revision,data:merged.data})})).revision;}catch(error){if(error.status===409)continue;throw error;}
    }
    if(!active())return;
    // A user may edit while network requests are in flight. Keep those edits queued.
    const latest=core.snapshot(state),next=core.merge(captured,latest,merged.data);
    // An unchanged poll must not replace chapter nodes, selection or editor values.
    if(!core.equal(latest,next.data)){
     backup();applying=true;
     try{applyWorkspaceSnapshot(next.data,{source:'cloud',conflicts:merged.conflicts+next.conflicts});persist('cloud');}
     finally{applying=false;}
    }
    meta.base=merged.data;meta.revision=revision;meta.lastSync=Date.now();saveMeta();
    say((merged.conflicts||next.conflicts?'Both versions of conflicting notes were kept. ':'')+'Synced '+new Date(meta.lastSync).toLocaleTimeString()+'.');
    if(!core.equal(next.data,merged.data))schedule();
    return;
   }
   throw Error('Another device is still updating. Your edits are saved locally; sync will retry.');
  }catch(error){if(meta===sessionMeta)say(error.status===401?'Sign in again or reconnect this iPhone. Local changes are saved.':navigator.onLine?error.message:'Offline. Changes are saved here and will sync when you reconnect.');}
  finally{busy=false;}
 }
 function schedule(){if(meta.disconnectPending){retryDisconnect();return;}if(applying||!meta.enabled)return;clearTimeout(timer);timer=setTimeout(sync,800);}
 window.BibleLensCloud={changed:schedule};
 window.addEventListener('online',schedule);window.addEventListener('focus',schedule);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});
 setInterval(()=>{if(!document.hidden){if(meta.disconnectPending)retryDisconnect();else if(meta.enabled)sync();}},30000);
 async function start(){
  if(!native)try{identity=await api('/session');}catch(error){if(error.status!==401)say(error.message);}
  render();
  if(meta.disconnectPending)await retryDisconnect();else if(meta.enabled)await sync();else if(!status.textContent)say('Sync is off. Existing notes stay on this device until you enable it.');
  if(location.hash==='#sync')document.querySelector('#lens-settings').click();
 }
 start();
});
