'use strict';
const PACKAGED_RELEASE=/*__RELEASE_INFO__*/null;
async function refreshBibleLensAppFiles(){
 async function bounded(operation){
  let timer;try{return await Promise.race([operation,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('App refresh timed out')),10000);})]);}finally{clearTimeout(timer);}
 }
 const latest=await(await fetch('/release.json',{cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(8000)})).json();
 if(!Number.isSafeInteger(latest.buildNumber)||typeof latest.sourceHash!=='string')throw Error('Latest app files are unavailable');
 // Drop public files before waiting on a worker's outstanding install job.
 if(globalThis.caches)for(const name of await bounded(caches.keys()))if(name.startsWith('biblelens-shell-'))await bounded(caches.delete(name));
 const registrations=await bounded(navigator.serviceWorker?.getRegistrations()||Promise.resolve([]));
 for(const registration of registrations)if(new URL(registration.scope).origin===location.origin)await bounded(registration.unregister());
 const url=new URL(location.href);url.searchParams.delete('build');
 location.replace(url.href);
}
document.addEventListener('DOMContentLoaded',async()=>{
 const panel=document.createElement('section');panel.className='release-settings';panel.innerHTML='<h3>App Version</h3><p data-release-version></p><p data-release-status role="status"></p><button type="button" class="secondary">Check for Updates</button>';
 document.querySelector('#reader-settings').append(panel);
 const footerVersion=document.querySelector('[data-footer-version]');
 let installed;
 try{installed=PACKAGED_RELEASE||await (await fetch('/release.json')).json();panel.querySelector('[data-release-version]').textContent=installed.version+' · Build '+installed.buildNumber+' · '+installed.sourceHash.slice(0,12);if(footerVersion)footerVersion.textContent='v'+installed.version+' · Build '+installed.buildNumber;}catch{panel.querySelector('[data-release-version]').textContent='Version information unavailable.';if(footerVersion)footerVersion.textContent='Version information unavailable.';return;}
 async function check(){
  const status=panel.querySelector('[data-release-status]');
  if(!document.documentElement.classList.contains('native-ios')&&!globalThis.Capacitor?.isNativePlatform?.()&&['localhost','127.0.0.1','[::1]'].includes(location.hostname)){status.textContent='Local preview. The published website is separate.';return;}
  try{const remote=await (await fetch('https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json',{cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(8000)})).json();status.textContent=remote.sourceHash===installed.sourceHash&&remote.buildNumber===installed.buildNumber?'This app matches the website release.':document.documentElement.classList.contains('native-ios')?'The website has a different release. Install the latest iPhone build to match it.':'A different website release is available. Reload this page to update.';}catch{status.textContent='Unable to check while offline. This version remains available.';}
 }
 panel.querySelector('button').onclick=check;check();
 if(!document.documentElement.classList.contains('native-ios')&&!globalThis.Capacitor?.isNativePlatform?.()){
  const refresh=document.createElement('button');refresh.type='button';refresh.className='secondary';refresh.textContent='Refresh App Files';
  const hint=document.createElement('p');hint.textContent='Reload the latest app files. Your notes, bookmarks and settings stay saved.';
  refresh.onclick=async()=>{refresh.disabled=true;try{await refreshBibleLensAppFiles();}catch{refresh.disabled=false;panel.querySelector('[data-release-status]').textContent='App files could not refresh. Check your connection and try again.';}};
  panel.append(refresh,hint);
 }
});
