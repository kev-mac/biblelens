'use strict';
// Passage notes and bookmarks remain browser-local, like study notes.
function normalizePassageRecords(value){
 const clean={};
 if(!value||typeof value!=='object'||Array.isArray(value))return clean;
 for(const [key,item]of Object.entries(value)){
  if(!item||typeof item!=='object'||!Number.isInteger(item.book)||item.book<0||item.book>65||!Number.isInteger(item.chapter)||item.chapter<1||item.chapter>150||key!==item.book+':'+item.chapter||typeof item.name!=='string'||item.name.length>80)continue;
  clean[key]={book:item.book,chapter:item.chapter,name:item.name,title:typeof item.title==='string'?item.title.slice(0,200):'',text:typeof item.text==='string'?item.text.slice(0,100000):''};
 }
 return clean;
}
state.passageNotes=normalizePassageRecords(state.passageNotes);
state.passageBookmarks=normalizePassageRecords(state.passageBookmarks);
function normalizeVerseRecords(value){
 const clean={};if(!value||typeof value!=='object'||Array.isArray(value))return clean;
 for(const [key,item]of Object.entries(value)){if(!item||!Number.isInteger(item.book)||item.book<0||item.book>65||!Number.isInteger(item.chapter)||item.chapter<1||item.chapter>150||!Number.isInteger(item.verse)||item.verse<1||item.verse>176||key!==`${item.book}:${item.chapter}:${item.verse}`||typeof item.name!=='string'||item.name.length>80)continue;clean[key]={book:item.book,chapter:item.chapter,verse:item.verse,name:item.name,title:typeof item.title==='string'?item.title.slice(0,200):'',text:typeof item.text==='string'?item.text.slice(0,100000):''};}return clean;
}
state.verseBookmarks=normalizeVerseRecords(state.verseBookmarks);
// Retire highlight-only state; bookmarks and all note text remain intact.
const hadLegacyVerseHighlights=Object.keys(state.verseHighlights||{}).length>0;
const legacyVerseHighlights=normalizeVerseRecords(state.verseHighlights);
state.verseHighlights={};
state.verseNotes=normalizeVerseRecords(state.verseNotes);
for(const [key,item]of Object.entries(legacyVerseHighlights)){if(item.text||item.title)state.verseNotes[key]=mergePersonalNote(state.verseNotes[key],item);}
if(hadLegacyVerseHighlights)persist();
function toggleVerseMark(kind,book,chapter,verse){
 if(kind!=='bookmark')return false;
 const key=`${book}:${chapter}:${verse}`,registry=state.verseBookmarks;
 function apply(){
  if(registry[key]){delete registry[key];delete state.verseNotes[key];}
  else registry[key]={book,chapter,verse,name:books[book].name};
  persist();renderReader(true);renderPassageSaved();return !!registry[key];
 }
 const note=state.verseNotes[key];
 if(registry[key]&&(note?.text?.trim()||note?.title?.trim()))return confirmNoteAction('Unmark '+books[book].name+' '+chapter+':'+verse+'? This will permanently delete your personal note and its title for this verse.',apply);
 return apply();
}
let activePassageKey=null;
function passageKey(){return readingBook+':'+readingChapter;}
function passageRecord(text='',title=''){return{book:readingBook,chapter:readingChapter,name:books[readingBook].name,title,text};}
function passageMarkdown(item){return '# '+item.name+' '+item.chapter+'\n\n'+(item.title?'## '+item.title+'\n\n':'')+(item.text||'(Bookmarked passage; no note)')+'\n';}
function mergePersonalNote(old,note){
 if(!old)return note;
 const title=old.title||note.title||'';
 const importedTitle=old.title&&note.title&&old.title!==note.title?'Imported title: '+note.title+'\n\n':'';
 return{...note,title,text:old.text&&old.text!==note.text?old.text+'\n\n--- Imported note ---\n'+importedTitle+note.text:importedTitle+(old.text||note.text)};
}
function passageResearchMarkdown(){
 const passages=Object.values({...state.passageBookmarks,...state.passageNotes}).map(item=>passageMarkdown(item));
 const verses=Object.entries({...state.verseBookmarks,...state.verseNotes}).map(([key,item])=>`# ${item.name} ${item.chapter}:${item.verse}\n\n${item.title?'## '+item.title+'\n\n':''}${state.verseBookmarks[key]?'Bookmarked verse. ':''}\n\n${state.verseNotes[key]?.text||''}\n`);
 return [...passages,...verses].join('\n---\n\n');
}
function mergePassageBackup(backup){
 const bookmarks=normalizePassageRecords(backup.passageBookmarks),notes=normalizePassageRecords(backup.passageNotes);
 Object.assign(state.passageBookmarks,bookmarks);
 for(const [key,note]of Object.entries(notes)){
  state.passageNotes[key]=mergePersonalNote(state.passageNotes[key],note);
 }
 for(const [key,note]of Object.entries(normalizeVerseRecords(backup.verseNotes))){state.verseNotes[key]=mergePersonalNote(state.verseNotes[key],note);}
 for(const [key,item]of Object.entries(normalizeVerseRecords(backup.verseHighlights))){if(item.text||item.title)state.verseNotes[key]=mergePersonalNote(state.verseNotes[key],item);}
 Object.assign(state.verseBookmarks,normalizeVerseRecords(backup.verseBookmarks));state.verseHighlights={};
}
const markedChapterCache=new Map();
let markedRenderGeneration=0;
async function hydrateMarkedVerseTexts(generation=markedRenderGeneration){
 if(typeof document.querySelectorAll!=='function')return;
 const fields=[...document.querySelectorAll('[data-marked-verse-text]')],groups=new Map();
 const requested=$('#reader-edition')?.value,edition=['kjv','web','asv'].includes(requested)?requested:'kjv';
 for(const field of fields){const [book,chapter,verse]=field.dataset.markedVerseText.split('/').map(Number),key=book+':'+chapter;if(!groups.has(key))groups.set(key,{book,chapter,fields:[]});groups.get(key).fields.push({field,verse});}
 const pending=[...groups.values()];let next=0;
 async function hydrateGroup(){while(generation===markedRenderGeneration&&next<pending.length){const group=pending[next++],key=group.book+':'+group.chapter;
  try{
   let chapterData;
   if(group.book===readingBook&&group.chapter===readingChapter&&reading?.verses)chapterData=reading;
   else{
    let request=markedChapterCache.get(key);
    if(!request){request=fetch(`/api/chapter?book=${group.book}&chapter=${group.chapter}`).then(response=>{if(!response.ok)throw Error('Chapter unavailable');return response.json();});markedChapterCache.set(key,request);request.catch(()=>markedChapterCache.delete(key));if(markedChapterCache.size>64)markedChapterCache.delete(markedChapterCache.keys().next().value);}
    chapterData=await request;
   }
   if(generation!==markedRenderGeneration)return;
   for(const {field,verse}of group.fields){const item=chapterData.verses?.find(item=>item.n===verse),used=item?.[edition]?edition:'kjv',value=item?.[used];field.textContent=value?String(value).replace(/\{[HG]\d+\}/g,'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()+' ('+used.toUpperCase()+')':'This verse is unavailable in the supplied edition. Open the passage to read it.';field.setAttribute('aria-busy','false');}
  }catch{if(generation!==markedRenderGeneration)return;for(const {field}of group.fields){field.textContent='Verse text could not load. Open this verse to read it.';field.setAttribute('aria-busy','false');}}
 }}
 await Promise.all(Array.from({length:Math.min(3,pending.length)},()=>hydrateGroup()));
}
function noteActionButtons(ref,editAttribute='data-edit-marked-note'){
 const pencil='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m16 3 5 5M4 20l4-1L21 6a2.1 2.1 0 0 0-3-3L5 16z"/></svg>';
 const trash='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></svg>';
 const [book,chapter,verse]=ref.split('/').map(Number),key=verse?`${book}:${chapter}:${verse}`:`${book}:${chapter}`,note=(verse?state.verseNotes:state.passageNotes)[key];
 if(!note?.text?.trim()&&!note?.title?.trim())return '';
 return `<span class="note-actions"><button type="button" class="note-icon" data-delete-note="${ref}" aria-label="Delete note" title="Delete note">${trash}</button><button type="button" class="note-icon" ${editAttribute}="${ref}" aria-label="Edit note" title="Edit note">${pencil}</button></span>`;
}
function deletePersonalNote(ref){
 const [book,chapter,verse]=ref.split('/').map(Number),key=verse?`${book}:${chapter}:${verse}`:`${book}:${chapter}`,registry=verse?state.verseNotes:state.passageNotes;
 if(!registry[key])return false;
 return confirmNoteAction('Delete this note? The bookmark will be kept.',()=>{delete registry[key];persist();if(reading)renderReader(true);renderPassageSaved();return true;});
}
function renderPassageSaved(){
 const box=$('#saved-passages');if(!box)return;
 const records={...state.passageBookmarks,...state.passageNotes},items=Object.entries(records);
 box.innerHTML=items.length?'<h2>Marked Passages</h2><div class="passage-saved-grid">'+items.map(([key,item])=>'<article class="passage-saved-card">'+(item.title?'<h3>'+esc(item.title)+'</h3>':'')+'<button class="secondary" data-read="'+item.book+'/'+item.chapter+'">'+esc(item.name)+' '+item.chapter+'</button>'+(item.text?'<p class="passage-saved-note">'+esc(item.text)+'</p>':'<p>Bookmarked passage</p>')+noteActionButtons(item.book+'/'+item.chapter)+'</article>').join('')+'</div>':'';
 const marked=Object.entries({...state.verseBookmarks,...state.verseNotes});
 if(marked.length)box.innerHTML+='<h2>Marked Verses</h2><div class="passage-saved-grid">'+marked.map(([key,item])=>`<article class="passage-saved-card">${item.title?`<h3>${esc(item.title)}</h3>`:''}<button class="secondary" data-read="${item.book}/${item.chapter}/${item.verse}">${esc(item.name)} ${item.chapter}:${item.verse}</button><p class="marked-verse-text" data-marked-verse-text="${item.book}/${item.chapter}/${item.verse}" aria-live="polite" aria-busy="true">Loading verse text…</p><p>${state.verseBookmarks[key]?'Bookmarked verse':'Verse note'}</p>${state.verseNotes[key]?.text?`<p class="passage-saved-note">${esc(state.verseNotes[key].text)}</p>`:''}${noteActionButtons(`${item.book}/${item.chapter}/${item.verse}`)}</article>`).join('')+'</div>';
 const studyCount=ENTRIES.filter(e=>state.bookmarks.includes(e.id)||state.notes[e.id]).length;
 $('#save-count').textContent=studyCount+items.length+marked.length;
 const empty=$('#saved-cards .empty');if(empty)empty.hidden=items.length+marked.length>0;
 hydrateMarkedVerseTexts(++markedRenderGeneration);
}
function stagePassageDock(){
 const dock=document.querySelector('.comparison-dock');
 if(dock)$('#reader-layout').before(dock);
}
function syncPassageTools(){
 if(!reading)return;
 const count=selectedVerseNumbers().length;$('#passage-tools').hidden=!count;$('#share-selected-label').textContent=`Copy selected (${count})`;$('#passage-share').disabled=!count;
 const key=passageKey(),changed=key!==activePassageKey;
 activePassageKey=key;
 if(changed||!count){$('#passage-note-editor').hidden=true;$('#passage-note-toggle').setAttribute('aria-expanded','false');}
 $('#passage-note').value=state.passageNotes[key]?.text||'';
 if($('#passage-note-title-input'))$('#passage-note-title-input').value=state.passageNotes[key]?.title||'';
 $('#passage-note-status').textContent=state.passageNotes[key]?'Note saved in this browser.':'';
 const saved=!!state.passageBookmarks[key],button=document.querySelector('[data-passage-save]');
 button?.setAttribute('aria-pressed',String(saved));button?.setAttribute('aria-label',saved?'Unmark this passage':'Mark this passage');
 const dock=document.querySelector('.comparison-dock');
 if(dock)$('#reader-layout').before(dock);
 document.querySelector('.passage-bookmark')?.remove();
 renderChapterBookmarks();
 renderPassageSaved();
}
function renderChapterBookmarks(){
 const items=Object.values(state.verseBookmarks).filter(item=>item.book===readingBook&&item.chapter===readingChapter).sort((first,second)=>first.verse-second.verse);
 const button=$('#chapter-bookmarks');if(!button)return;
 button.setAttribute('aria-label',`Bookmarks: ${items.length} bookmarked verses in this chapter`);
 $('#chapter-bookmark-count').textContent=items.length;
 $('#chapter-bookmark-count').hidden=!items.length;
 $('#chapter-bookmark-list').innerHTML=items.length?items.map(item=>`<button type="button" class="verse-citation" data-read="${item.book}/${item.chapter}/${item.verse}">${esc(item.name)} ${item.chapter}:${item.verse}</button>`).join(''):'<p>No bookmarks in this chapter. Hold a verse to bookmark it.</p>';
}
$('#passage-note-toggle').onclick=()=>{
 if(!reading)return;
 const editor=$('#passage-note-editor'),open=editor.hidden;
 editor.hidden=!open;$('#passage-note-toggle').setAttribute('aria-expanded',String(open));
 if(open)$('#passage-note').focus();
};
function savePassageNote(){
 if(!reading)return;
 const key=passageKey(),text=$('#passage-note').value.slice(0,100000),title=($('#passage-note-title-input')?.value||'').slice(0,200);
 if(text.trim()||title.trim())state.passageNotes[key]=passageRecord(text,title);else delete state.passageNotes[key];
 persist();$('#passage-note-status').textContent=storageAvailable?(text.trim()||title.trim()?'Note saved in this browser.':'Note cleared.'):'Storage unavailable. Copy your note to keep it.';
 renderPassageSaved();
}
$('#passage-note').addEventListener('input',savePassageNote);
$('#passage-note-title-input')?.addEventListener('input',savePassageNote);
document.addEventListener('click',ev=>{
 const remove=ev.target.closest('[data-delete-note]');if(remove){deletePersonalNote(remove.dataset.deleteNote);return;}
 const edit=ev.target.closest('[data-edit-marked-note]');
 if(edit){
  const [book,chapter,verse]=edit.dataset.editMarkedNote.split('/').map(Number);
  if(verse){openVerseNote(book,chapter,verse);return;}
  setView('explore',false);
  loadChapter(book,chapter).then(()=>{if(readingBook===book&&readingChapter===chapter&&reading){selectedVerses.add(reading.verses[0].n);renderReader(true);$('#passage-note-editor').hidden=false;$('#passage-note-toggle').setAttribute('aria-expanded','true');$('#passage-note-title-input').focus();}});
  return;
 }
 const button=ev.target.closest('[data-passage-save]');if(!button||!reading)return;
 const key=passageKey();
 if(state.passageBookmarks[key])delete state.passageBookmarks[key];else state.passageBookmarks[key]=passageRecord();
 persist();syncPassageTools();toast(state.passageBookmarks[key]?'Passage marked':'Passage unmarked');
});
$('#passage-share').onclick=async()=>{
 if(!reading)return;
 const verses=typeof selectedVerseNumbers==='function'?selectedVerseNumbers():[];
 if(!verses.length){toast('Select a verse to copy.');return;}
 await copyVerseSelection(readingBook,readingChapter,verses);
};
renderPassageSaved();

let activeVerseNote=null;
function openVerseNote(book,chapter,verse){
 const key=`${book}:${chapter}:${verse}`;activeVerseNote={book,chapter,verse,key,name:books[book].name};
 $('#verse-note-title').textContent=`${books[book].name} ${chapter}:${verse} · Note`;
 $('#verse-note-text').value=state.verseNotes[key]?.text||'';
 if($('#verse-note-title-input'))$('#verse-note-title-input').value=state.verseNotes[key]?.title||'Note';
 $('#verse-note-dialog').showModal();$('#verse-note-text').focus();
}
$('#verse-note-close').onclick=()=>$('#verse-note-dialog').close();
$('#verse-note-form').onsubmit=ev=>{
 ev.preventDefault();if(!activeVerseNote)return;
 const {key,...record}=activeVerseNote,text=$('#verse-note-text').value.slice(0,100000),title=($('#verse-note-title-input')?.value||'').slice(0,200),hasNote=!!(text.trim()||title.trim());
 if(hasNote)state.verseNotes[key]={...record,title:title.trim()||'Note',text};else delete state.verseNotes[key];
 if(hasNote){categoryFilters.add('bookmark');comparisonRecordSelections.set(`bookmark-${key}:bookmark`,true);}
 persist();$('#verse-note-dialog').close();renderReader(true);renderPassageSaved();toast(hasNote?'Verse note saved':'Verse note cleared');
};

function buildVerseShareUrl(book,chapter,verses){
 if(!Number.isInteger(book)||book<0||book>65||!Number.isInteger(chapter)||chapter<1||chapter>150)throw new Error('Invalid passage reference');
 const selected=[...new Set(Array.isArray(verses)?verses:[])].filter(v=>Number.isInteger(v)&&v>0&&v<=176).sort((a,b)=>a-b);
 if(!selected.length)throw new Error('Select at least one verse to share');
 const ranges=[];let start=selected[0],end=start;
 for(const verse of selected.slice(1)){if(verse===end+1)end=verse;else{ranges.push(start===end?String(start):`${start}-${end}`);start=end=verse;}}
 ranges.push(start===end?String(start):`${start}-${end}`);
 const url=new URL(location.href);url.hash=`read/${book}/${chapter}/${ranges.join(',')}`;return url.href;
}
async function copyVerseSelection(book,chapter,verses){
 const url=buildVerseShareUrl(book,chapter,verses),reference=new URL(url).hash.split('/').pop(),title=`${books[book].name} ${chapter}:${reference}`;
 let chapterData=book===readingBook&&chapter===readingChapter?reading:null;
 if(!chapterData){try{const response=await fetch(`/api/chapter?book=${book}&chapter=${chapter}`);if(!response.ok)throw Error();chapterData=await response.json();}catch{toast('Could not load the selected verses. Please try again.');return false;}}
 const selected=[...new Set(verses)].sort((a,b)=>a-b),edition=$('#reader-edition')?.value||'kjv',lines=[];
 for(const verse of selected){const item=chapterData?.verses?.find(item=>item.n===verse),value=item?.[edition]||item?.kjv;if(!value){toast('A selected verse is unavailable. Choose another verse.');return false;}const plain=String(value).replace(/\{[HG]\d+\}/g,'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();lines.push(`${books[book].name} ${chapter}:${verse} (${(item?.[edition]?edition:'kjv').toUpperCase()})\n${plain}`);}
 const text=lines.join('\n\n'),clipboardText=text+'\n\n'+url;
 try{await navigator.clipboard.writeText(clipboardText);toast('Copied');return true;}
 catch{
  const field=document.createElement('textarea');field.value=clipboardText;field.readOnly=true;field.setAttribute('aria-hidden','true');field.style.cssText='position:fixed;opacity:0;pointer-events:none;left:-9999px;top:0';document.body.append(field);
  try{field.select();const copied=document.execCommand('copy');toast(copied?'Copied':'Could not copy. Please try again.');return copied;}
  finally{field.remove();window.getSelection()?.removeAllRanges();}
 }
}
