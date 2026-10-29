// Directory saves share the existing device-only Saved store and backup path.
export function directorySaveButton(kind, id, name) {
 const button=document.createElement('button');button.type='button';button.className='directory-save';
 button.setAttribute('aria-label','Save '+name);button.dataset.directorySave=kind+'-'+id;
 button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>';
 const key=kind+'-'+id;
 const refresh=()=>button.setAttribute('aria-pressed',String(!!globalThis.BibleLensDebateStore?.read(key).saved));
 button.addEventListener('click',event=>{
  event.stopPropagation();
  const store=globalThis.BibleLensDebateStore;
  if(store?.write(key,{saved:!store.read(key).saved,entity:{kind,id,name}}))refresh();
  else {button.setAttribute('aria-label','Could not save '+name+'. Try again.');}
 });
 // Refresh when revisiting after removal in Saved, including another tab.
 button.addEventListener('focus',refresh);refresh();return button;
}

if(typeof window !== 'undefined') window.addEventListener('biblelens:debatechange',()=>{
 for(const button of document.querySelectorAll('[data-directory-save]'))button.setAttribute('aria-pressed',String(!!globalThis.BibleLensDebateStore?.read(button.dataset.directorySave).saved));
});
