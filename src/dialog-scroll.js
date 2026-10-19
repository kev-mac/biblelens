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
