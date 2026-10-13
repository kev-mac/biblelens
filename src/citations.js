'use strict';
(() => {
 const popup=document.createElement('section');popup.id='verse-preview';popup.className='verse-preview';popup.hidden=true;popup.setAttribute('role','dialog');popup.setAttribute('aria-label','Cited verse preview');
 popup.innerHTML='<div class="preview-heading"><strong></strong><button type="button" class="preview-close" aria-label="Close verse preview">×</button></div><p class="preview-edition"></p><p class="preview-summary" hidden></p><p class="preview-text" aria-live="polite"></p><a class="preview-link">Read chapter →</a>';
 document.body.append(popup);
 const cache=new Map();let anchor=null,hideTimer=0,requestId=0,suppressedBody=null,suppressedUntil=0;
 function close(){clearTimeout(hideTimer);requestId++;popup.hidden=true;anchor?.setAttribute('aria-expanded','false');anchor=null;}
 function position(){if(!anchor)return;const r=anchor.getBoundingClientRect(),vv=window.visualViewport;const top=vv?.offsetTop||0,width=window.innerWidth,height=vv?.height||window.innerHeight;popup.style.maxHeight=`${Math.max(100,height-24)}px`;const p=popup.getBoundingClientRect();popup.style.left=`${Math.max(12,Math.min(r.left,width-p.width-12))}px`;let y=r.bottom+8;if(y+p.height>top+height-12)y=r.top-p.height-8;popup.style.top=`${Math.max(top+12,Math.min(y,top+height-p.height-12))}px`;}
 async function show(button){clearTimeout(hideTimer);if(anchor!==button)anchor?.setAttribute('aria-expanded','false');anchor=button;button.setAttribute('aria-expanded','true');button.setAttribute('aria-controls',popup.id);
 const dialog=button.closest('dialog[open]');(dialog||document.body).append(popup);popup.hidden=false;
 const label=button.dataset.citeLabel,edition=button.dataset.citeEdition||document.querySelector('#reader-edition').value;const [book,chapter,verse]=button.dataset.cite.split('/').map(Number);const key=`${book}/${chapter}/${edition}`,id=++requestId;
 const summary=popup.querySelector('.preview-summary');summary.hidden=!(button.dataset.citeWitness&&button.dataset.citeSummary);summary.textContent=summary.hidden?'':button.dataset.citeWitness+': '+button.dataset.citeSummary;popup.querySelector('strong').textContent=label;popup.querySelector('.preview-edition').textContent=edition.toUpperCase();popup.querySelector('.preview-text').textContent='Loading verse…';popup.querySelector('a').href=`#read/${book}/${chapter}/${verse}`;position();
 try{let pending=cache.get(key);if(!pending){pending=fetch(`/api/chapter?book=${book}&chapter=${chapter}`).then(r=>{if(!r.ok)throw Error();return r.json()});cache.set(key,pending);pending.catch(()=>cache.delete(key));}const data=await pending;if(id!==requestId)return;const end=Math.max(verse,Number(button.dataset.citeEnd)||verse),verses=data.verses.filter(v=>v.n>=verse&&v.n<=end);popup.querySelector('.preview-text').innerHTML=verses.length?verses.map(v=>`${end>verse?`<b>${v.n}</b> `:''}${v[edition]?scriptureHtml(v,edition,book,chapter):'This verse is absent from the selected edition’s dataset.'}`).join('<br><br>'):'This verse is absent from the selected edition’s dataset.';position();}catch{if(id!==requestId)return;popup.querySelector('.preview-text').textContent='Could not load this verse. Close and try again.';position();}}
 function later(){clearTimeout(hideTimer);hideTimer=setTimeout(close,180);}
 document.addEventListener('pointerover',ev=>{if(ev.pointerType==='touch')return;const b=ev.target.closest('.verse-citation[data-cite]');if(b&&!b.contains(ev.relatedTarget)){show(b);}});
 document.addEventListener('pointerout',ev=>{const b=ev.target.closest('.verse-citation[data-cite]');if(b&&!b.contains(ev.relatedTarget)&&!popup.contains(ev.relatedTarget))later();});
 document.addEventListener('focusin',ev=>{const b=ev.target.closest('.verse-citation[data-cite]');if(b)show(b);});
 document.addEventListener('focusout',ev=>{if(ev.target.closest('.verse-citation[data-cite]')&&!popup.contains(ev.relatedTarget))later();});
 document.addEventListener('click',ev=>{if(suppressedBody&&Date.now()<suppressedUntil&&ev.target.closest('.verse-body')===suppressedBody){ev.preventDefault();suppressedBody=null;return;}const b=ev.target.closest('.verse-citation[data-cite]');if(b){ev.preventDefault();const [book,chapter,verse]=b.dataset.cite.split('/').map(Number);close();document.querySelector('dialog[open]')?.close();setView('explore',false);loadChapter(book,chapter,verse);return;}if(ev.target.closest('.preview-close')||(!popup.contains(ev.target)&&anchor))close();if(ev.target.closest('.preview-link'))close();});
 popup.addEventListener('pointerenter',()=>clearTimeout(hideTimer));popup.addEventListener('pointerleave',later);
 document.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&ev.target.matches('.verse-body')){ev.preventDefault();showWeb(ev.target);return;}if(ev.key==='Escape'&&!popup.hidden){ev.preventDefault();close();}});
 let press=null,pressTimer=0;
 function cancelPress(){clearTimeout(pressTimer);press=null;}
 function showWeb(body){const n=Number(body.closest('.verse')?.id.replace('verse-',''));if(!n)return;body.dataset.cite=`${readingBook}/${readingChapter}/${n}`;body.dataset.citeLabel=`${books[readingBook]?.name||reading.name} ${readingChapter}:${n}`;body.dataset.citeEdition='web';show(body);}
 document.addEventListener('pointerdown',ev=>{if(ev.button!==0)return;const body=ev.target.closest('.verse-body');if(!body)return;cancelPress();press={body,x:ev.clientX,y:ev.clientY,id:ev.pointerId,shown:false};pressTimer=setTimeout(()=>{if(!press)return;press.shown=true;showWeb(body);},500);});
 document.addEventListener('pointermove',ev=>{if(press&&ev.pointerId===press.id&&Math.hypot(ev.clientX-press.x,ev.clientY-press.y)>8)cancelPress();});
 document.addEventListener('pointerup',()=>{if(press?.shown){suppressedBody=press.body;suppressedUntil=Date.now()+750;}cancelPress();});
 document.addEventListener('pointercancel',cancelPress);
 document.addEventListener('contextmenu',ev=>{if(ev.target.closest('.verse-body')){ev.preventDefault();if(press&&!press.shown){press.shown=true;showWeb(press.body);}}});
 window.addEventListener('resize',close);window.addEventListener('viewchange',close);
 document.addEventListener('scroll',ev=>{if(!popup.contains(ev.target)){cancelPress();close();}},true);
})();
