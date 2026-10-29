'use strict';
// Lock the document while modal content scrolls independently, including iOS.
(() => {
 let saved=null;
 function lock(){
  if(!saved){
   saved={y:window.scrollY,position:document.body.style.position,top:document.body.style.top,width:document.body.style.width};
   document.body.classList.add('dialog-scroll-locked');
   Object.assign(document.body.style,{position:'fixed',top:-saved.y+'px',width:'100%'});
  }
 }
 function update(){
  const open=!!document.querySelector('dialog[open]');if(open)lock();
  if(!open&&saved){
   const previous=saved;saved=null;
   Object.assign(document.body.style,{position:previous.position,top:previous.top,width:previous.width});
   document.body.classList.remove('dialog-scroll-locked');window.scrollTo({top:previous.y,behavior:'instant'});
  }
 }
 const nativeShow=HTMLDialogElement.prototype.showModal;
 HTMLDialogElement.prototype.showModal=function(){
  lock();try{return nativeShow.call(this);}catch(error){update();throw error;}
 };
 new MutationObserver(update).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
 update();
})();

// Shared popup component: enhance native dialogs and auto-popovers, including
// feature markup loaded later. Keep each owner's save/cancel and close hooks.
(() => {
 const prepared=new WeakSet(),bound=new WeakSet(),openers=new WeakMap();
 let activation=null;
 document.addEventListener('click',event=>{const element=event.target.closest('button,a,input,[tabindex]');if(element)activation={element,at:performance.now()};},true);
 const opener=()=>activation&&performance.now()-activation.at<1500?activation.element:document.activeElement;
 const close=surface=>{if(surface instanceof HTMLDialogElement)surface.close();else if(surface.hasAttribute('popover'))surface.hidePopover();else {surface.hidden=true;surface.dispatchEvent(new Event('uxpopupclose'));const opener=openers.get(surface);if(opener?.isConnected)opener.focus({preventScroll:true});}};
 const previews=()=>document.querySelectorAll('.ux-popup[role=dialog]:not(dialog):not([popover]):not([hidden])');
 document.addEventListener('pointerdown',event=>{for(const surface of previews())if(!surface.contains(event.target))close(surface);});
 document.addEventListener('keydown',event=>{if(event.key==='Escape')for(const surface of previews()){event.preventDefault();close(surface);}});
 function prepare(surface){
  if(prepared.has(surface)&&[...surface.querySelectorAll('.ux-popup-close')].some(button=>button.closest('dialog,[popover],[role=dialog]')===surface))return;prepared.add(surface);surface.classList.add('ux-popup');
  const buttons=[...surface.querySelectorAll('button')].filter(button=>!button.closest('dialog,[popover],[role=dialog]')||button.closest('dialog,[popover],[role=dialog]')===surface).filter(button=>/^close\b/i.test(button.getAttribute('aria-label')||button.textContent.trim())||/^[×✕✖]$/.test(button.textContent.trim()));
  let control=buttons.shift();
  if(!control){control=document.createElement('button');surface.prepend(control);}
  for(const extra of buttons)extra.hidden=true;
  control.type='button';control.classList.add('ux-popup-close');control.setAttribute('aria-label','Close');control.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  control.addEventListener('click',()=>close(surface));
  if(bound.has(surface))return;bound.add(surface);
  surface.addEventListener('click',event=>{if(event.target!==surface)return;const r=surface.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close(surface);});
  surface.addEventListener('cancel',event=>{event.preventDefault();close(surface);});
  const restore=()=>{const opener=openers.get(surface);if(opener?.isConnected)opener.focus({preventScroll:true});};
  surface.addEventListener('close',restore);
  surface.addEventListener('beforetoggle',event=>{if(event.newState==='open')openers.set(surface,opener());});
  surface.addEventListener('toggle',event=>{if(event.newState==='closed')restore();});
 }
 const show=HTMLDialogElement.prototype.showModal;
 HTMLDialogElement.prototype.showModal=function(){prepare(this);if(!this.open)openers.set(this,opener());return show.call(this);};
 function scan(){document.querySelectorAll('dialog,[popover],[role=dialog]').forEach(prepare);}
 new MutationObserver(records=>{scan();for(const record of records)if(record.attributeName==='hidden'&&record.oldValue!==null&&!record.target.hidden&&prepared.has(record.target))openers.set(record.target,opener());}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden'],attributeOldValue:true});scan();
 window.BibleLensPopup={prepare,close,show:(surface,opener)=>{prepare(surface);surface.showModal();if(opener)openers.set(surface,opener);}};
})();
