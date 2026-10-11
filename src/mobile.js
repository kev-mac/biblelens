'use strict';
(() => {
  const root=document.documentElement;
  const viewport=window.visualViewport;
  const smallScreen=()=>window.matchMedia('(max-width: 850px)').matches;
  const editable=el=>el instanceof Element&&el.matches('textarea,input:not([type="file"]):not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]),[contenteditable="true"]');
  let frame=0,focusTimers=[],lastWidth=window.innerWidth,fullHeight=window.innerHeight;
  function visibleBounds(){const top=viewport?.offsetTop||0,height=viewport?.height||window.innerHeight;return {top,bottom:top+height,height};}
  function keepInputVisible(){const el=document.activeElement;if(!smallScreen()||!editable(el)||el.disabled)return;const bounds=visibleBounds(),rect=el.getBoundingClientRect();const margin=20;const dialog=el.closest('dialog[open]');let top=bounds.top+margin,bottom=bounds.bottom-margin;
    if(dialog){const d=dialog.getBoundingClientRect();top=Math.max(top,d.top+20);bottom=Math.min(bottom,d.bottom-20)}
    // Keep the whole editing field visible; very tall textareas align at the top.
    let delta=0;if(rect.height>bottom-top){if(Math.abs(rect.top-top)>3)delta=rect.top-top}else if(rect.bottom>bottom)delta=rect.bottom-bottom;else if(rect.top<top)delta=rect.top-top;
    if(Math.abs(delta)>2){if(dialog)dialog.scrollBy({top:delta,behavior:'instant'});else window.scrollBy({top:delta,behavior:'instant'})}
  }
  function updateViewport(){frame=0;const bounds=visibleBounds();const width=viewport?.width||window.innerWidth;if(Math.abs(width-lastWidth)>50){fullHeight=window.innerHeight;lastWidth=width}const isEditing=smallScreen()&&editable(document.activeElement);if(!isEditing)fullHeight=Math.max(fullHeight,window.innerHeight,bounds.height);const gap=isEditing?Math.max(0,fullHeight-bounds.height-bounds.top):0;
    root.style.setProperty('--visual-height',`${bounds.height}px`);root.style.setProperty('--visual-top',`${bounds.top}px`);root.style.setProperty('--keyboard-gap',`${gap}px`);root.classList.toggle('mobile-editing',isEditing);root.classList.toggle('keyboard-open',isEditing&&gap>120);keepInputVisible();
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(updateViewport)}
  document.addEventListener('focusin',ev=>{if(!editable(ev.target))return;focusTimers.forEach(clearTimeout);schedule();focusTimers=[80,250,500].map(delay=>setTimeout(schedule,delay))});
  document.addEventListener('focusout',()=>{focusTimers.forEach(clearTimeout);focusTimers=[];setTimeout(schedule,0)});
  document.addEventListener('input',ev=>{if(editable(ev.target))schedule()});
  document.addEventListener('keydown',ev=>{if(smallScreen()&&ev.key==='Enter'&&ev.target.id==='search')ev.target.blur()});
  document.addEventListener('submit',ev=>{if(smallScreen()&&ev.target.id==='evidence-form')document.activeElement?.blur()});
  viewport?.addEventListener('resize',schedule);viewport?.addEventListener('scroll',schedule);window.addEventListener('resize',schedule);window.addEventListener('orientationchange',()=>{fullHeight=window.innerHeight;lastWidth=window.innerWidth;schedule()});
  // Safari gesture events supplement CSS touch-action while preserving one-finger scroll.
  for(const type of ['gesturestart','gesturechange'])document.addEventListener(type,ev=>{if(smallScreen()&&ev.cancelable)ev.preventDefault()},{passive:false});
  document.addEventListener('touchmove',ev=>{if(smallScreen()&&ev.touches.length>1&&ev.cancelable)ev.preventDefault()},{passive:false});
  schedule();
})();
