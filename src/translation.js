import {alignmentHtml,createChapterLoader,translationEscape as escape} from './translation-core.js';
const chapter=createChapterLoader();
const dialog=document.createElement('dialog');dialog.id='translation-dialog';dialog.className='glass-dialog translation-dialog';dialog.setAttribute('aria-labelledby','translation-title');document.body.append(dialog);
let version=0,selection=null,opener=null;
function close(){if(dialog.open)dialog.close();else ++version;}
function selectedText(){
 const choice=selection.choices.find(option=>option.value===selection.edition);
 dialog.querySelector('#translation-selected-label').textContent='Selected English: '+(choice?.label||selection.edition.toUpperCase());
 dialog.querySelector('#translation-selected-text').textContent=choice?.text||'This English edition is unavailable for this verse.';
 dialog.querySelector('#translation-edition-limit').textContent=(choice?.label||selection.edition.toUpperCase())+' word alignment is unavailable. Tiles use the Berean Standard Bible.';
}
async function open(options){
 ++version;selection=options;opener=options.opener;
 dialog.innerHTML='<div class="sheet-heading"><h2 id="translation-title">Translation · '+escape(options.label)+'</h2><button type="button" class="lens-button" data-translation-close aria-label="Close translation">Close</button></div>'+
 '<label class="translation-edition-label">English edition <select id="translation-edition">'+options.choices.map(option=>'<option value="'+escape(option.value)+'"'+(option.value===options.edition?' selected':'')+'>'+escape(option.label)+'</option>').join('')+'</select></label>'+
 '<details class="translation-selected"><summary id="translation-selected-label"></summary><blockquote id="translation-selected-text" dir="ltr" lang="en"></blockquote></details><p id="translation-edition-limit"></p>'+
 '<h3>Aligned English: Berean Standard Bible</h3><p class="translation-guide">Read left to right: English, source text, then transliteration.</p>'+

 '<div id="translation-result" aria-live="polite" aria-busy="true"><p role="status">Loading word links…</p></div>'+
 '<details class="translation-sources"><summary>Sources and coverage</summary><p>Links follow the publisher’s table. They can span phrases. Added words and text differences may have no direct word match. Transliteration uses Latin letters.</p><p>Berean Standard Bible translation table, public domain. Source text and Latin spellings come from that table. Hebrew and Aramaic use Hebrew script; the New Testament uses Greek.</p>'+
 '<p>31,086 verses across 66 books. Some traditional verse numbers and Other Books have no data. KJV, WEB, and ASV word alignments are unavailable.</p>'+
 '<p><a href="https://berean.bible/downloads.htm" target="_blank" rel="noopener">Publisher’s translation table</a> · <a href="https://berean.bible/terms.htm" target="_blank" rel="noopener">Public domain terms</a></p></details>';
 selectedText();if(!dialog.open)dialog.showModal();dialog.scrollTop=0;dialog.querySelector('[data-translation-close]').focus({preventScroll:true});
 const request=version,ref=options.ref;
 try{
  const data=await chapter(ref.book,ref.chapter);
  if(request!==version||!dialog.open)return;
  dialog.querySelector('#translation-result').innerHTML=alignmentHtml(data?.verses?.[ref.verse]);
 }catch{
  if(request!==version||!dialog.open)return;
  dialog.querySelector('#translation-result').innerHTML='<p role="status">Word links could not load. Try again when a connection is available. Installed apps include them offline.</p><button type="button" class="lens-button" data-translation-retry>Retry</button>';
 }finally{if(request===version&&dialog.open)dialog.querySelector('#translation-result').setAttribute('aria-busy','false');}
}
dialog.addEventListener('click',event=>{
 if(event.target.closest('[data-translation-close]'))close();
 else if(event.target.closest('[data-translation-retry]'))open(selection);
 else if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}
});
dialog.addEventListener('change',event=>{if(event.target.id==='translation-edition'){selection.edition=event.target.value;selectedText();selection.onEditionChange?.(selection.edition);}});
dialog.addEventListener('close',()=>{++version;if(opener?.isConnected)opener.focus({preventScroll:true});});
window.addEventListener('biblelens:readerloading',close);window.addEventListener('biblelens:readererror',close);
window.addEventListener('hashchange',close);window.addEventListener('viewchange',event=>{if(event.detail!=='read')close();});
window.BibleLensTranslation={open,close};

