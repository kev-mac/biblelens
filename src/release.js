'use strict';
document.addEventListener('DOMContentLoaded',async()=>{
 const panel=document.createElement('section');panel.className='release-settings';panel.innerHTML='<h3>App version</h3><p data-release-version></p><p data-release-status role="status"></p><button type="button" class="secondary">Check for updates</button>';
 document.querySelector('#reader-settings').append(panel);
 let installed;
 try{installed=await (await fetch('/release.json')).json();panel.querySelector('[data-release-version]').textContent=installed.version+' · Build '+installed.buildNumber+' · '+installed.sourceHash.slice(0,12);}catch{panel.querySelector('[data-release-version]').textContent='Version information unavailable.';return;}
 async function check(){
  const status=panel.querySelector('[data-release-status]');
  try{const remote=await (await fetch('https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json',{cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(8000)})).json();status.textContent=remote.sourceHash===installed.sourceHash&&remote.buildNumber===installed.buildNumber?'This app matches the website release.':document.documentElement.classList.contains('native-ios')?'The website has a different release. Install the latest iPhone build to match it.':'A different website release is available. Reload this page to update.';}catch{status.textContent='Unable to check while offline. This version remains available.';}
 }
 panel.querySelector('button').onclick=check;check();
});
