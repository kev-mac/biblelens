'use strict';
// Capacitor already packages its own API and Bible. Only web installs a worker.
if ('serviceWorker' in navigator && !document.documentElement.classList.contains('native-ios') && location.protocol.startsWith('http')) {
 window.addEventListener('load', async () => {
  const section=document.createElement('section'),heading=document.createElement('h3'),status=document.createElement('p');
  heading.textContent='Offline reading';status.setAttribute('role','status');
  status.textContent='Saving the Bible for offline reading…';section.append(heading,status);
  document.querySelector('#reader-settings').append(section);
  try{
   const registration=await navigator.serviceWorker.register('/service-worker.js', {scope:'/', updateViaCache:'none'});
   const ready=()=>{status.textContent='Bible saved for offline reading. Cloud sync and sign-in need internet.';};
   if(registration.active)ready();
   const watch=worker=>{if(!worker)return;worker.addEventListener('statechange',()=>{
    if(worker.state==='activated'||worker.state==='installed')ready();
    if(worker.state==='redundant'&&!registration.active)status.textContent='Offline download could not finish. Free some storage and reopen the app to retry.';
   });};
   watch(registration.installing);registration.addEventListener('updatefound',()=>watch(registration.installing));
  }catch{
   status.textContent='Offline download is unavailable. You can keep reading online.';
  }
 });
}
