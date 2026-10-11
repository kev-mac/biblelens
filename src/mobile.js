'use strict';
(() => {
  const root=document.documentElement;
  const viewport=window.visualViewport;
  const smallScreen=()=>window.matchMedia('(max-width: 850px)').matches;
  const editable=el=>el instanceof Element&&el.matches('textarea,input:not([type="file"]):not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]),[contenteditable="true"]');
  let settleTimer=0,focusedField=null,adjusted=false;
  function keepInputVisible(){
    const el=focusedField;
    if(adjusted||!smallScreen()||document.activeElement!==el||!editable(el)||el.disabled)return;
    // One correction per focus. Safari viewport scroll events never trigger this.
    adjusted=true;
    const top=(viewport?.offsetTop||0)+20;
    const bottom=(viewport?.offsetTop||0)+(viewport?.height||window.innerHeight)-20;
    const rect=el.getBoundingClientRect(),dialog=el.closest('dialog[open]');
    const limits=dialog?dialog.getBoundingClientRect():null;
    const minTop=limits?Math.max(top,limits.top+20):top;
    const maxBottom=limits?Math.min(bottom,limits.bottom-20):bottom;
    let delta=0;
    if(rect.height>maxBottom-minTop)delta=rect.top-minTop;
    else if(rect.bottom>maxBottom)delta=rect.bottom-maxBottom;
    else if(rect.top<minTop)delta=rect.top-minTop;
    if(Math.abs(delta)>2)(dialog||window).scrollBy({top:delta,behavior:'instant'});
  }
  function settle(){
    clearTimeout(settleTimer);
    settleTimer=setTimeout(()=>{
      root.style.setProperty('--visual-height',`${viewport?.height||window.innerHeight}px`);
      keepInputVisible();
    },350);
  }
  document.addEventListener('focusin',ev=>{
    if(!editable(ev.target)||!smallScreen())return;
    focusedField=ev.target;adjusted=false;
    // Capture once: scrolling and keyboard animation must not resize the page.
    root.style.setProperty('--editing-space',`${Math.round(window.innerHeight/2)}px`);
    root.classList.add('mobile-editing');
    settle();
  });
  document.addEventListener('focusout',()=>{
    clearTimeout(settleTimer);
    setTimeout(()=>{
      if(editable(document.activeElement))return;
      focusedField=null;adjusted=false;
      root.classList.remove('mobile-editing');
    },0);
  });
  document.addEventListener('keydown',ev=>{if(smallScreen()&&ev.key==='Enter'&&ev.target.id==='search')ev.target.blur()});
  document.addEventListener('submit',ev=>{if(smallScreen()&&ev.target.id==='evidence-form')document.activeElement?.blur()});
  viewport?.addEventListener('resize',settle);
  window.addEventListener('resize',settle);
  window.addEventListener('orientationchange',settle);
  // Safari gesture events supplement CSS touch-action while preserving one-finger scroll.
  for(const type of ['gesturestart','gesturechange'])document.addEventListener(type,ev=>{if(smallScreen()&&ev.cancelable)ev.preventDefault()},{passive:false});
  document.addEventListener('touchmove',ev=>{if(smallScreen()&&ev.touches.length>1&&ev.cancelable)ev.preventDefault()},{passive:false});
  settle();
})();
