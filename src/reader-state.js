'use strict';
let books=/*__BOOK_CATALOG__*/[],reading=null,readingBook=Number(state.reading?.book)||0,readingChapter=Number(state.reading?.chapter)||1;
const readerPreferences=state.readerPreferences||{edition:'kjv',compare:'on',commentary:'context'};
if(state.readerEditionDefault!=='kjv-v1'){readerPreferences.edition='kjv';state.readerEditionDefault='kjv-v1';state.readerPreferences=readerPreferences;persist();}
if(state.readerCompareDefault!=='toggle-v1'){readerPreferences.compare='on';state.readerCompareDefault='toggle-v1';state.readerPreferences=readerPreferences;persist();}
if(!['none','on'].includes(readerPreferences.compare))readerPreferences.compare='on';
if(readerPreferences.commentary==='sab')readerPreferences.commentary='context';
$('#reader-edition').value=readerPreferences.edition;
function updateCompareToggle(){const on=readerPreferences.compare!=='none';$('#reader-compare').value=on?'on':'none';$('#reader-compare').setAttribute('aria-checked',String(on));$('#reader-compare-state').textContent=on?'On':'Off';}updateCompareToggle();
function readRef(ref){const m=/^(.*?) (\d+):(\d+)/.exec(ref);const book=m&&books.find(b=>b.name===m[1]);return book?{book:book.id,chapter:+m[2],verse:+m[3]}:null;}

const READER_FONTS={inter:'"Inter",system-ui,sans-serif',lora:'"Lora",Georgia,serif',georgia:'Georgia,serif',system:'system-ui,sans-serif',mono:'ui-monospace,monospace'};
function applyReaderFonts(){
 // A legacy reading-only preference must not silently become an app-wide choice.
 // New app-wide choices apply consistently; the updated design starts in Inter.
 const value=Object.hasOwn(READER_FONTS,readerPreferences.appFont)?readerPreferences.appFont:'inter';
 for(const property of ['--verse-font-family','--lens-reading-font','--ui-font','--category-font-family'])document.documentElement.style.setProperty(property,READER_FONTS[value]);
 $('#app-font-family').value=value;
}
$('#app-font-family').onchange=ev=>{
 // Mirror legacy keys so older installed clients retain the chosen font too.
 readerPreferences.appFont=readerPreferences.font=readerPreferences.verseFont=readerPreferences.categoryFont=ev.target.value;
 state.readerPreferences=readerPreferences;applyReaderFonts();persist();
};
applyReaderFonts();
function applyTextSize(){
 if(state.textScaleBaseline!=='120-v3'){
  // Old clients stored a physical multiplier. Keep its exact size on migration.
  state.textScale=state.textScale!=null&&Number.isFinite(Number(state.textScale))?Number(state.textScale):1.2;
  state.textScaleBaseline='120-v3';persist();
 }
 const raw=Number(state.textScale),scale=Number.isFinite(raw)?Math.max(.85,Math.min(1.8,raw)):1.2;
 state.textScale=scale;
 document.documentElement.style.setProperty('--text-scale','1');
 document.documentElement.style.setProperty('--reader-text-scale',String(scale));
 const percent=Math.round(scale/1.2*100),slider=$('#reader-font');
 slider.value=String(percent);slider.setAttribute('aria-valuetext',percent+' percent');
 $('#reader-font-value').textContent=percent+'%';
}
$('#reader-font').oninput=ev=>{state.textScale=Number(ev.target.value)/100*1.2;applyTextSize();};
$('#reader-font').onchange=()=>persist();
applyTextSize();
