'use strict';
(() => {
 const popup=document.createElement('section');popup.id='verse-preview';popup.className='verse-preview';popup.hidden=true;popup.setAttribute('role','dialog');popup.setAttribute('aria-label','Cited verse preview');
 popup.innerHTML='<div class="preview-heading"><strong></strong><button type="button" class="preview-close" aria-label="Close verse preview">×</button></div><p class="preview-edition"></p><p class="preview-text" aria-live="polite"></p><a class="preview-link">Read chapter →</a>';
 document.body.append(popup);
 const cache=new Map();let anchor=null,pinned=false,hideTimer=0,requestId=0;
 function close(){clearTimeout(hideTimer);requestId++;popup.hidden=true;anchor?.setAttribute('aria-expanded','false');anchor=null;pinned=false;}
 function position(){if(!anchor)return;const r=anchor.getBoundingClientRect(),vv=window.visualViewport;const top=vv?.offsetTop||0,width=window.innerWidth,height=vv?.height||window.innerHeight;popup.style.maxHeight=`${Math.max(100,height-24)}px`;const p=popup.getBoundingClientRect();popup.style.left=`${Math.max(12,Math.min(r.left,width-p.width-12))}px`;let y=r.bottom+8;if(y+p.height>top+height-12)y=r.top-p.height-8;popup.style.top=`${Math.max(top+12,Math.min(y,top+height-p.height-12))}px`;}
 async function show(button,pin=false){clearTimeout(hideTimer);if(anchor!==button){anchor?.setAttribute('aria-expanded','false');pinned=false;}anchor=button;pinned=pin||pinned;button.setAttribute('aria-expanded','true');button.setAttribute('aria-controls',popup.id);
 const dialog=button.closest('dialog[open]');(dialog||document.body).append(popup);popup.hidden=false;
 const label=button.dataset.citeLabel,edition=document.querySelector('#reader-edition').value;const [book,chapter,verse]=button.dataset.cite.split('/').map(Number);const key=`${book}/${chapter}/${edition}`,id=++requestId;
 popup.querySelector('strong').textContent=label;popup.querySelector('.preview-edition').textContent=edition.toUpperCase();popup.querySelector('.preview-text').textContent='Loading verse…';popup.querySelector('a').href=`#read/${book}/${chapter}/${verse}`;position();
 try{let pending=cache.get(key);if(!pending){pending=fetch(`/api/chapter?book=${book}&chapter=${chapter}`).then(r=>{if(!r.ok)throw Error();return r.json()});cache.set(key,pending);pending.catch(()=>cache.delete(key));}const data=await pending;if(id!==requestId)return;const v=data.verses.find(v=>v.n===verse);popup.querySelector('.preview-text').innerHTML=v?.[edition]?scriptureHtml(v,edition,book,chapter):'This verse is absent from the selected edition’s dataset.';position();}catch{if(id!==requestId)return;popup.querySelector('.preview-text').textContent='Could not load this verse. Close and try again.';position();}}
 function later(){if(!pinned){clearTimeout(hideTimer);hideTimer=setTimeout(close,180);}}
 document.addEventListener('pointerover',ev=>{if(ev.pointerType==='touch')return;const b=ev.target.closest('.verse-citation');if(b&&!b.contains(ev.relatedTarget)){pinned=false;show(b);}});
 document.addEventListener('pointerout',ev=>{const b=ev.target.closest('.verse-citation');if(b&&!b.contains(ev.relatedTarget)&&!popup.contains(ev.relatedTarget))later();});
 document.addEventListener('focusin',ev=>{const b=ev.target.closest('.verse-citation');if(b)show(b);});
 document.addEventListener('focusout',ev=>{if(ev.target.closest('.verse-citation')&&!popup.contains(ev.relatedTarget))later();});
 document.addEventListener('click',ev=>{const b=ev.target.closest('.verse-citation');if(b){ev.preventDefault();if(anchor===b&&pinned)close();else show(b,true);return;}if(ev.target.closest('.preview-close')||(!popup.contains(ev.target)&&anchor))close();if(ev.target.closest('.preview-link'))close();});
 popup.addEventListener('pointerenter',()=>clearTimeout(hideTimer));popup.addEventListener('pointerleave',later);
 document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&!popup.hidden){ev.preventDefault();close();}});
 window.addEventListener('resize',close);window.addEventListener('viewchange',close);
 document.addEventListener('scroll',ev=>{if(!popup.contains(ev.target))close();},true);
})();
