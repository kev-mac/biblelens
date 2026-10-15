'use strict';
// Passage notes and bookmarks remain browser-local, like study notes.
function normalizePassageRecords(value){
 const clean={};
 if(!value||typeof value!=='object'||Array.isArray(value))return clean;
 for(const [key,item]of Object.entries(value)){
  if(!item||typeof item!=='object'||!Number.isInteger(item.book)||item.book<0||item.book>65||!Number.isInteger(item.chapter)||item.chapter<1||item.chapter>150||key!==item.book+':'+item.chapter||typeof item.name!=='string'||item.name.length>80)continue;
  clean[key]={book:item.book,chapter:item.chapter,name:item.name,text:typeof item.text==='string'?item.text.slice(0,100000):''};
 }
 return clean;
}
state.passageNotes=normalizePassageRecords(state.passageNotes);
state.passageBookmarks=normalizePassageRecords(state.passageBookmarks);
function normalizeVerseRecords(value){
 const clean={};if(!value||typeof value!=='object'||Array.isArray(value))return clean;
 for(const [key,item]of Object.entries(value)){if(!item||!Number.isInteger(item.book)||item.book<0||item.book>65||!Number.isInteger(item.chapter)||item.chapter<1||item.chapter>150||!Number.isInteger(item.verse)||item.verse<1||item.verse>176||key!==`${item.book}:${item.chapter}:${item.verse}`||typeof item.name!=='string'||item.name.length>80)continue;clean[key]={book:item.book,chapter:item.chapter,verse:item.verse,name:item.name};}return clean;
}
state.verseBookmarks=normalizeVerseRecords(state.verseBookmarks);
state.verseHighlights=normalizeVerseRecords(state.verseHighlights);
function toggleVerseMark(kind,book,chapter,verse){
 const key=`${book}:${chapter}:${verse}`,registry=kind==='bookmark'?state.verseBookmarks:state.verseHighlights;
 if(registry[key])delete registry[key];else registry[key]={book,chapter,verse,name:books[book].name};
 persist();renderReader(true);renderPassageSaved();return !!registry[key];
}
let activePassageKey=null;
function passageKey(){return readingBook+':'+readingChapter;}
function passageRecord(text=''){return{book:readingBook,chapter:readingChapter,name:books[readingBook].name,text};}
function passageMarkdown(item){return '# '+item.name+' '+item.chapter+'\n\n'+(item.text||'(Bookmarked passage; no note)')+'\n';}
function passageResearchMarkdown(){const passages=Object.entries({...state.passageBookmarks,...state.passageNotes}).map(([,item])=>passageMarkdown(item));const verses=Object.entries({...state.verseHighlights,...state.verseBookmarks}).map(([key,item])=>`# ${item.name} ${item.chapter}:${item.verse}\n\n${state.verseBookmarks[key]?'Bookmarked verse. ':''}${state.verseHighlights[key]?'Highlighted verse.':''}\n`);return [...passages,...verses].join('\n---\n\n');}
function mergePassageBackup(backup){
 const bookmarks=normalizePassageRecords(backup.passageBookmarks),notes=normalizePassageRecords(backup.passageNotes);
 Object.assign(state.passageBookmarks,bookmarks);
 for(const [key,note]of Object.entries(notes)){
  const old=state.passageNotes[key]?.text;
  state.passageNotes[key]={...note,text:old&&old!==note.text?old+'\n\n--- Imported note ---\n'+note.text:note.text};
 }
 Object.assign(state.verseBookmarks,normalizeVerseRecords(backup.verseBookmarks));Object.assign(state.verseHighlights,normalizeVerseRecords(backup.verseHighlights));
}
function renderPassageSaved(){
 const box=$('#saved-passages');if(!box)return;
 const records={...state.passageBookmarks,...state.passageNotes},items=Object.entries(records);
 box.innerHTML=items.length?'<h2>Saved Passages</h2><div class="passage-saved-grid">'+items.map(([key,item])=>'<article class="passage-saved-card"><button class="secondary" data-read="'+item.book+'/'+item.chapter+'">'+esc(item.name)+' '+item.chapter+'</button>'+(item.text?'<p class="passage-saved-note">'+esc(item.text)+'</p>':'<p>Bookmarked passage</p>')+'</article>').join('')+'</div>':'';
 const marked=Object.entries({...state.verseHighlights,...state.verseBookmarks});
 if(marked.length)box.innerHTML+='<h2>Saved Verses</h2><div class="passage-saved-grid">'+marked.map(([key,item])=>`<article class="passage-saved-card"><button class="secondary" data-read="${item.book}/${item.chapter}/${item.verse}">${esc(item.name)} ${item.chapter}:${item.verse}</button><p>${state.verseBookmarks[key]?'Bookmarked':''}${state.verseBookmarks[key]&&state.verseHighlights[key]?' · ':''}${state.verseHighlights[key]?'Highlighted':''}</p></article>`).join('')+'</div>';
 const studyCount=ENTRIES.filter(e=>state.bookmarks.includes(e.id)||state.notes[e.id]).length;
 $('#save-count').textContent=studyCount+items.length+marked.length;
 const empty=$('#saved-cards .empty');if(empty)empty.hidden=items.length+marked.length>0;
}
function stagePassageDock(){
 const dock=document.querySelector('.comparison-dock');
 if(dock)$('#reader-layout').before(dock);
}
function syncPassageTools(){
 if(!reading)return;
 const key=passageKey(),changed=key!==activePassageKey;
 activePassageKey=key;
 if(changed){$('#passage-note-editor').hidden=true;$('#passage-note-toggle').setAttribute('aria-expanded','false');$('#passage-share-link').hidden=true;}
 $('#passage-note').value=state.passageNotes[key]?.text||'';
 $('#passage-note-status').textContent=state.passageNotes[key]?.text?'Note saved in this browser.':'';
 const saved=!!state.passageBookmarks[key],button=document.querySelector('[data-passage-save]');
 button?.setAttribute('aria-pressed',String(saved));button?.setAttribute('aria-label',saved?'Remove saved passage':'Save this passage');
 $('#passage-export').disabled=!state.passageNotes[key]?.text&&!saved;
 const dock=document.querySelector('.comparison-dock'),question=document.querySelector('#chapter-text #reader-question-form');
 if(dock)$('#reader-layout').before(dock);
 const picker=question?.querySelector?.('.passage-picker-trigger');if(picker)document.querySelector('.passage-heading')?.append(picker);
 if(question){let host=$('#reader-question-host');if(!host){host=document.createElement('div');host.id='reader-question-host';document.querySelector('body > header').append(host);}host.replaceChildren(question);}
 document.querySelector('.passage-bookmark')?.remove();
 renderPassageSaved();
}
$('#passage-note-toggle').onclick=()=>{
 if(!reading)return;
 const editor=$('#passage-note-editor'),open=editor.hidden;
 editor.hidden=!open;$('#passage-note-toggle').setAttribute('aria-expanded',String(open));
 if(open)$('#passage-note').focus();
};
$('#passage-note').addEventListener('input',ev=>{
 if(!reading)return;
 const key=passageKey(),text=ev.target.value.slice(0,100000);
 if(text.trim())state.passageNotes[key]=passageRecord(text);else delete state.passageNotes[key];
 persist();$('#passage-note-status').textContent=storageAvailable?(text.trim()?'Note saved in this browser.':'Note cleared.'):'Storage unavailable. Export your note to keep it.';
 $('#passage-export').disabled=!text.trim()&&!state.passageBookmarks[key];renderPassageSaved();
});
document.addEventListener('click',ev=>{
 const button=ev.target.closest('[data-passage-save]');if(!button||!reading)return;
 const key=passageKey();
 if(state.passageBookmarks[key])delete state.passageBookmarks[key];else state.passageBookmarks[key]=passageRecord();
 persist();syncPassageTools();toast(state.passageBookmarks[key]?'Passage added to Saved':'Passage removed from Saved');
});
$('#passage-share').onclick=async()=>{
 if(!reading)return;
 const url=new URL(location.href);url.hash='read/'+readingBook+'/'+readingChapter;
 const title=reading.name+' '+readingChapter;
 if(navigator.share){try{await navigator.share({title,url:url.href});return;}catch(error){if(error.name==='AbortError')return;}}
 try{await navigator.clipboard.writeText(url.href);toast('Passage link copied. Your notes stay private.');}
 catch{const field=$('#passage-share-link');field.value=url.href;field.hidden=false;field.focus();field.select();toast('Copy the passage link. Your notes stay private.');}
};
$('#passage-export').onclick=()=>{
 if(!reading)return;
 const key=passageKey(),record=state.passageNotes[key]||state.passageBookmarks[key];
 if(record)download(record.name+'-'+record.chapter+'-notes.md',passageMarkdown(record),'text/markdown');
};
renderPassageSaved();
