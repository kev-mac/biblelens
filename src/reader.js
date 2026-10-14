'use strict';
const CHAPTER_NAMES=/*__CHAPTER_NAMES__*/{};
let books=[],reading=null,selectedVerses=new Set(),readingBook=Number(state.reading?.book)||0,readingChapter=Number(state.reading?.chapter)||1,loadVersion=0,readingScroll=0,lastView='explore',chatBusy=false;
const chatMessages=[];
let readerQuestionDraft="";
const readerPreferences=state.readerPreferences||{edition:'kjv',compare:'on',commentary:'context'};
if(state.readerEditionDefault!=='kjv-v1'){readerPreferences.edition='kjv';state.readerEditionDefault='kjv-v1';state.readerPreferences=readerPreferences;persist();}
if(state.readerCompareDefault!=='toggle-v1'){readerPreferences.compare='on';state.readerCompareDefault='toggle-v1';state.readerPreferences=readerPreferences;persist();}
if(!['none','on'].includes(readerPreferences.compare))readerPreferences.compare='on';
if(readerPreferences.commentary==='sab')readerPreferences.commentary='context';
$('#reader-edition').value=readerPreferences.edition;
function updateCompareToggle(){const on=readerPreferences.compare!=='none';$('#reader-compare').value=on?'on':'none';$('#reader-compare').setAttribute('aria-checked',String(on));$('#reader-compare-state').textContent=on?'On':'Off';}updateCompareToggle();
function readRef(ref){const m=/^(.*?) (\d+):(\d+)/.exec(ref);const book=m&&books.find(b=>b.name===m[1]);return book?{book:book.id,chapter:+m[2],verse:+m[3]}:null;}
function chapterStudies(){if(!reading)return [];return ENTRIES.filter(e=>e.refs.some(r=>{const p=readRef(r);return p&&p.book===readingBook&&p.chapter===readingChapter}));}
function applicableStudies(){const entries=chapterStudies();if(!selectedVerses.size)return entries;const matching=entries.filter(e=>e.refs.some(r=>{const p=readRef(r);return p&&p.book===readingBook&&p.chapter===readingChapter&&selectedVerses.has(p.verse)}));return matching.length?matching:entries;}
function chapterOptions(){comparisonSelections.clear();comparisonRecordSelections.clear();comparisonHighlightOrder.clear();const book=books[readingBook];$('#chapter-select').innerHTML=Array.from({length:book.chapters},(_,i)=>`<option value="${i+1}" ${i+1===readingChapter?'selected':''}>${i+1}</option>`).join('');$('#book-select').value=String(readingBook);}
function updateContext(){if(!books.length)return;const label=`${books[readingBook].name} ${readingChapter}`;$('#reader-status').textContent=selectedVerses.size?`${selectedVerses.size} ${selectedVerses.size===1?'verse':'verses'} selected`:`${reading?.verses.length||0} verses · ${$('#reader-edition').value.toUpperCase()}`;$('#clear-selection').hidden=!selectedVerses.size;$('#chapter-footer').textContent=label;$('#reader-picker-label').textContent=label;$('#reader-picker').setAttribute('aria-label',`Reader settings for ${label}`);const first=readingBook===0&&readingChapter===1,last=readingBook===books.length-1&&readingChapter===books[readingBook].chapters;for(const id of ['#prev-bottom'])$(id).disabled=first;for(const id of ['#next-bottom'])$(id).disabled=last;}
async function loadChapter(book,ch,verse=null,updateHash=true,transition=0){const b=books[book];if(!b||!Number.isInteger(ch)||ch<1||ch>b.chapters)return;const version=++loadVersion;readingBook=book;readingChapter=ch;selectedVerses.clear();chapterOptions();$('#reader-status').textContent='Loading chapter…';$('#chapter-text').innerHTML='<p class="chapter-loading">Loading chapter…</p>';$('#comparison-status').hidden=true;try{const response=await fetch(`/api/chapter?book=${book}&chapter=${ch}`);if(!response.ok)throw Error('Chapter could not be loaded');const data=await response.json();if(version!==loadVersion)return;reading=data;if(verse&&data.verses.some(v=>v.n===verse))selectedVerses.add(verse);state.reading={book,chapter:ch};persist();renderReader();if(transition){const surface=$('#chapter-text'),entry=transition>0?'chapter-enter-next':'chapter-enter-previous';surface.classList.add(entry);requestAnimationFrame(()=>requestAnimationFrame(()=>surface.classList.remove(entry)));}if(updateHash)history.replaceState(null,'',`#read/${book}/${ch}${verse?'/'+verse:''}`);if(verse)requestAnimationFrame(()=>$(`#verse-${verse}`)?.scrollIntoView({block:'center',behavior:'smooth'}));else window.scrollTo({top:0,behavior:'instant'});}catch(err){if(version!==loadVersion)return;reading=null;$('#chapter-text').innerHTML='<div class="reader-error"><p>Could not load this chapter.</p><button id="retry-chapter" class="primary">Retry</button></div>';$('#retry-chapter').onclick=()=>loadChapter(book,ch,verse,updateHash);$('#reader-status').textContent='Chapter unavailable. Try again.';}}
const comparisonCache=new Map();
const comparisonSelections=new Map();
const categoryFilters=new Set(['T','V','Q','science','history','contradictions']);
function filterCategory(item){return item.tag|| (item.mode==='questions'?'Q':item.mode);}
function categoryRank(item){return ['T','V','Q','science','history','contradictions'].indexOf(filterCategory(item));}
const comparisonModes=['history','contradictions','science','questions'];
const comparisonLabels={history:'History',contradictions:'Contradictions',science:'Science',questions:'Unanswered Questions'};
const languageTags={T:{label:'Translation',tone:'translation'},V:{label:'Violation',tone:'violation'},Q:{label:'Unanswered question',tone:'question'}};
function recordTags(item){return [...new Set(Array.isArray(item.activeTags)?item.activeTags:Array.isArray(item.tags)?item.tags:item.tag?[item.tag]:[])].map(t=>['H','G'].includes(t)?'T':t).filter((t,i,a)=>languageTags[t]&&a.indexOf(t)===i);}
function witnessLabel(item){return (item.tags||[item.tag]).some(t=>['H','G','T'].includes(t))&&item.witness?item.witness+': ':'';}
function summaryText(item){return witnessLabel(item)+(item.summary||item.text||'');}
function comparisonKey(mode=$('#reader-compare').value){return `${readingBook}:${readingChapter}:${$('#reader-edition').value}:${mode}`;}
function selectionKey(verse){return `${comparisonKey('tabs')}:${verse}`;}
function visibleComparison(item){return recordTags(item).length>0||item.mode==='questions'||item.mode==='contradictions'||(item.status!=='Agrees'&&(item.status==='Disagrees'||item.discrepancy===true));}
function verseComparisons(verse){return comparisonModes.flatMap(mode=>(comparisonCache.get(comparisonKey(mode))?.items||[]).filter(i=>i.verse===verse).map((item,index)=>({...item,mode,key:`${mode}-${index}`}))).filter(visibleComparison);}


const CONTEXT_CHIP_LIMIT=3;
const comparisonRecordSelections=new Map();
const comparisonHighlightOrder=new Map();
let comparisonHighlightSequence=0;
function recordSelection(item){return `${item.id||item.key}:${item.tag||item.mode}`;}
const BOOK_CITATION_ABBREVIATIONS='Gen Exo Lev Num Deu Jos Jud Rut 1Sam 2Sam 1Kin 2Kin 1Chr 2Chr Ezr Neh Est Job Psa Pro Ecc Son Isa Jer Lam Eze Dan Hos Joe Amo Oba Jon Mic Nah Hab Zep Hag Zec Mal Mat Mar Luk Joh Act Rom 1Cor 2Cor Gal Eph Phi Col 1The 2The 1Tim 2Tim Tit Phm Heb Jam 1Pet 2Pet 1Joh 2Joh 3Joh Jud Rev'.split(' ');
function compactCitation(p,label){const name=books[p.book]?.name;return name&&label.startsWith(name+' ')?BOOK_CITATION_ABBREVIATIONS[p.book]+label.slice(name.length):label;}
function comparisonTone(item){return languageTags[item.tag]?.tone||(item.mode==='questions'?'question':item.mode);}
/* Category SVGs: Lucide, ISC. Source paths unchanged; common stroke-width 2.
ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

The following Lucide icons are derived from the Feather project:

airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out

The MIT License (MIT) (for the icons listed above)

Copyright (c) 2013-present Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
const CATEGORY_ICON_PATHS={"T":"<path d=\"m5 8 6 6\" />\n  <path d=\"m4 14 6-6 2-3\" />\n  <path d=\"M2 5h12\" />\n  <path d=\"M7 2h1\" />\n  <path d=\"m22 22-5-10-5 10\" />\n  <path d=\"M14 18h6\" />","V":"<path d=\"m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381\" />\n  <path d=\"m16 16 6-6\" />\n  <path d=\"m21.5 10.5-8-8\" />\n  <path d=\"m8 8 6-6\" />\n  <path d=\"m8.5 7.5 8 8\" />","Q":"<path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\" />\n  <path d=\"M12 17h.01\" />","science":"<circle cx=\"12\" cy=\"12\" r=\"1\" />\n  <path d=\"M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z\" />\n  <path d=\"M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z\" />","history":"<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\" />\n  <path d=\"M3 3v5h5\" />\n  <path d=\"M12 7v5l4 2\" />","contradictions":"<path d=\"M2 12h6\" />\n  <path d=\"M22 12h-6\" />\n  <path d=\"M12 2v2\" />\n  <path d=\"M12 8v2\" />\n  <path d=\"M12 14v2\" />\n  <path d=\"M12 20v2\" />\n  <path d=\"m19 9-3 3 3 3\" />\n  <path d=\"m5 15 3-3-3-3\" />"};
const CATEGORY_ICON_NAMES={"T":"languages","V":"gavel","Q":"circle-question-mark","science":"atom","history":"history","contradictions":"fold-horizontal"};
function categoryIcon(key){const normalized=key==='questions'?'Q':key;return `<svg class="category-icon" data-icon="${CATEGORY_ICON_NAMES[normalized]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${CATEGORY_ICON_PATHS[normalized]}</svg>`;}
function comparisonIcon(item){return categoryIcon(filterCategory(item));}
function referenceLink(ref,label,contextItem){const p=typeof ref==='string'?readRef(ref):ref;if(!p)return '';const full=label||ref.label||(typeof ref==='string'?ref:`${books[p.book]?.name} ${p.chapter}:${p.verse}`);return `<a class="verse-citation${contextItem?' context-source':''}"${contextItem?` data-tone="${comparisonTone(contextItem)}"`:``} href="#read/${p.book}/${p.chapter}/${p.verse}" data-cite="${p.book}/${p.chapter}/${p.verse}" data-cite-end="${p.end||p.verse}" data-cite-label="${esc(full)}"${contextItem&&witnessLabel(contextItem)?` data-cite-witness="${esc(contextItem.witness)}" data-cite-summary="${esc(contextItem.summary||contextItem.text)}"`:``} aria-label="${esc(full)}" title="${esc(full)}"><span>${esc(compactCitation(p,full))}</span></a>`;}
function contextRanges(item){
 const sideRefs=new Set(item.sides?.length?item.sides.map(s=>s.ref):[item.ref]);
 const refs=[...(item.refs||[]),...(item.appliesTo||[])].map(r=>typeof r==='string'?{...readRef(r),label:r}:r).filter(r=>r&&Number.isInteger(r.book)&&!sideRefs.has(r.label||`${books[r.book]?.name} ${r.chapter}:${r.verse}`));
 const sorted=refs.filter((r,i)=>refs.findIndex(o=>o.book===r.book&&o.chapter===r.chapter&&o.verse===r.verse)===i).sort((a,b)=>a.book-b.book||a.chapter-b.chapter||a.verse-b.verse);
 const ranges=[];for(const r of sorted){const last=ranges.at(-1);if(last&&last.book===r.book&&last.chapter===r.chapter&&last.end+1===r.verse)last.end=r.verse;else ranges.push({...r,end:r.verse});}
 return ranges.map(r=>({...r,label:`${books[r.book]?.name||reading.name} ${r.chapter}:${r.verse}${r.end!==r.verse?'–'+r.end:''}`}));
}
function roleCitations(item){
 const ranges=contextRanges(item),visible=ranges.slice(0,CONTEXT_CHIP_LIMIT),remaining=ranges.length-visible.length;
 const groups=ranges.map(r=>referenceLink(r,undefined,item)).join('');
 return `<div class="context-citations"><div class="context-short summary-citations">${visible.map(r=>referenceLink(r,undefined,item)).join('')}${remaining?`<button type="button" class="verse-citation" data-tone="${comparisonTone(item)}" data-context-expand aria-expanded="false" aria-label="Show ${remaining} additional citations">+${remaining}</button>`:''}</div>${remaining?`<div class="context-full" hidden>${groups}<button type="button" class="verse-citation" data-tone="${comparisonTone(item)}" data-context-collapse>Show fewer</button></div>`:''}</div>`;
}
function expandContext(button){const parent=button.closest('.context-citations'),open=button.hasAttribute('data-context-expand');parent.querySelector('.context-short').hidden=open;parent.querySelector('.context-full').hidden=!open;parent.querySelector('[data-context-expand]').setAttribute('aria-expanded',String(open));}
function sideRows(item){return item.sides?.length?`<div class="comparison-sides">${item.sides.slice().sort((a,b)=>{const x=readRef(a.ref),y=readRef(b.ref);return x&&y?x.book-y.book||x.chapter-y.chapter||x.verse-y.verse:0;}).map(side=>`<div class="comparison-side">${referenceLink(side.ref,undefined,item)}<q>${esc(side.quote)}</q></div>`).join('')}</div>`:'';}
function mergeQuoteRanges(ranges){const merged=[];for(const [a,b]of ranges.sort((x,y)=>x[0]-y[0]||x[1]-y[1])){const last=merged.at(-1);if(last&&a<=last[1])last[1]=Math.max(last[1],b);else merged.push([a,b]);}return merged;}
function quoteRanges(text,quotes){const ranges=[];for(const quote of quotes){if(!quote)continue;let start=0;while((start=text.indexOf(quote,start))!==-1){ranges.push([start,start+quote.length]);start+=quote.length;}}return mergeQuoteRanges(ranges);}

function scienceDetails(item){if(!item.fields?.length)return '';return `<div class="science-fields"><h4>Relevant fields & why</h4>${item.fields.map(f=>`<section class="science-field"><h5>${esc(f.branch)}</h5><p>${esc(f.text)}</p><div class="field-sources">${f.sources.map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)} ↗</a>`).join('')}</div></section>`).join('')}</div>`;}
function alternativeReadings(verse){
 const ref=`${reading.name} ${readingChapter}:${verse}`;
 const studies=ENTRIES.filter(e=>e.refs.includes(ref));
 if(!studies.length)return '';
 return `<div class="alternative-readings"><h4>Context & other readings</h4>${studies.map(e=>`<section><h5>${esc(e.title)}</h5><p>${esc(e.context)}</p><p>${esc(e.translation)}</p><p><b>${e.responseUrl?'Attributed response':'Possible reading'}:</b> ${esc(e.response)}</p>${e.responseUrl?`<a href="${esc(e.responseUrl)}" target="_blank" rel="noopener">Response source ↗</a>`:''}<p><b>Our assessment:</b> ${esc(e.assessment)}</p>${comparisonCitations(verse,[{refs:e.refs.map(readRef).filter(Boolean)}])}</section>`).join('')}</div>`;
}
function comparisonCell(verse){
 const mode=$('#reader-compare').value;if(mode==='none')return '';
 const items=verseComparisons(verse);
 if(!items.length)return '<div class="comparison-cell" aria-label="No comparison attached"></div>';
 const choices=items.flatMap(item=>{const tags=recordTags(item);return tags.length?tags.map(tag=>({...item,tag,key:`${item.key}-${tag}`})):item.mode==='questions'?[{...item,tag:'Q',key:`${item.key}-Q`}]:[item];});
 const selected=comparisonSelections.get(selectionKey(verse))||new Set();
 const isOpen=item=>comparisonRecordSelections.get(recordSelection(item))??selected.has(item.key);
 const tone=comparisonTone;
 const category=item=>languageTags[item.tag]?.label||comparisonLabels[item.mode];
 const icon=comparisonIcon;
 const shownChoices=choices.sort((a,b)=>categoryRank(a)-categoryRank(b)).filter(item=>categoryFilters.has(filterCategory(item)));
 const tabs=shownChoices.map(item=>{const duplicate=choices.filter(i=>category(i)===category(item)).length>1;const label=`${category(item)}${item.status?' · '+item.status:''}${item.placementRole==='context'?' · Supporting context':''}${duplicate?' · '+(item.title||String(choices.indexOf(item)+1)):''}`;const open=isOpen(item);return `<button type="button" class="agreement comparison-tab ${tone(item)}${item.placementRole==='context'?' context-tag':''}" id="comparison-tab-${verse}-${item.key}" aria-pressed="${open}" aria-expanded="${open}" aria-controls="comparison-panel-${verse}-${item.key}" data-comparison-record="${esc(recordSelection(item))}" data-comparison-verse="${verse}" data-comparison-key="${item.key}" aria-label="${esc(label)}" title="${esc(label)}">${item.placementRole==='context'?'':icon(item)}</button>`});
 const panels=shownChoices.map(active=>active.placementRole==='context'?`<div class="comparison-panel context-pointer" id="comparison-panel-${verse}-${active.key}" aria-labelledby="comparison-tab-${verse}-${active.key}" ${isOpen(active)?'':'hidden'}>Context for: <a href="#read/${Object.values(readRef(active.keyTarget)||{}).join('/')}" title="${esc(active.title||active.ref)}">${esc(active.title||active.ref)}</a></div>`:`<section class="verse-comparison comparison-panel" data-tone="${tone(active)}" id="comparison-panel-${verse}-${active.key}" aria-labelledby="comparison-tab-${verse}-${active.key}" ${isOpen(active)?'':'hidden'}>${sideRows(active)}${active.title?`<h3>${esc(active.title)}</h3>`:''}<p class="comparison-summary">${esc(summaryText(active))}</p>${active.placementRole?roleCitations(active):comparisonCitations(verse,[active])}<details class="comparison-details"><summary>Details & sources</summary>${active.tag==='T'?`<p class="language-context">${esc(active.witness)}</p>`:''}<p><b>Comparison explanation:</b> ${esc(active.text)}</p>${scienceDetails(active)}${alternativeReadings(verse)}${active.reasoning?`<p><b>Reasoning:</b> ${esc(active.reasoning)}</p>`:''}${active.scope?`<p class="comparison-scope"><b>Our assessment:</b> ${esc(active.scope)}</p>`:''}<div class="comparison-sources">${active.sources?.map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)} ↗</a>`).join('')||''}</div></details></section>`).join('');
 return `<div class="comparison-cell"><div class="comparison-tabs" role="group" aria-label="Comparisons for verse ${verse}"><span class="primary-tags">${tabs.filter((_,i)=>shownChoices[i].placementRole!=='context').join('')}</span><span class="context-tags">${tabs.filter((_,i)=>shownChoices[i].placementRole==='context').join('')}</span></div>${panels}</div>`;
}
function selectComparison(button){
 const verse=Number(button.dataset.comparisonVerse),key=button.dataset.comparisonKey;
 const selected=comparisonSelections.get(selectionKey(verse))||new Set();
 const wasOpen=button.dataset.comparisonRecord?(comparisonRecordSelections.get(button.dataset.comparisonRecord)??selected.has(key)):selected.has(key);
 if(wasOpen)selected.delete(key);else selected.add(key);
 comparisonSelections.set(selectionKey(verse),selected);
 const open=selected.has(key);if(button.dataset.comparisonRecord){comparisonRecordSelections.set(button.dataset.comparisonRecord,open);for(const peer of document.querySelectorAll?.('[data-comparison-record]')||[]){if(peer.dataset.comparisonRecord!==button.dataset.comparisonRecord)continue;peer.setAttribute('aria-pressed',String(open));peer.setAttribute('aria-expanded',String(open));const peerSet=comparisonSelections.get(selectionKey(Number(peer.dataset.comparisonVerse)))||new Set();if(open)peerSet.add(peer.dataset.comparisonKey);else peerSet.delete(peer.dataset.comparisonKey);comparisonSelections.set(selectionKey(Number(peer.dataset.comparisonVerse)),peerSet);const peerPanel=document.getElementById(peer.getAttribute('aria-controls'));if(peerPanel)peerPanel.hidden=!open;}}button.setAttribute('aria-pressed',String(open));button.setAttribute('aria-expanded',String(open));
 const panel=document.getElementById(`comparison-panel-${verse}-${key}`);if(panel)panel.hidden=!open;
 const record=button.dataset.comparisonRecord||`${verse}:${key}`;
 if(open)comparisonHighlightOrder.set(record,++comparisonHighlightSequence);else comparisonHighlightOrder.delete(record);
 refreshVerseHighlights();
}
document.addEventListener('click',ev=>{
 const filter=ev.target.closest('[data-category-filter]');if(filter){const key=filter.dataset.categoryFilter;if(categoryFilters.has(key))categoryFilters.delete(key);else categoryFilters.add(key);renderReader(true);document.querySelector(`[data-category-filter="${key}"]`)?.focus({preventScroll:true});return;}
 const expand=ev.target.closest('[data-context-expand],[data-context-collapse]');if(expand){expandContext(expand);return;}
 const tab=ev.target.closest('[data-comparison-key]');if(tab){selectComparison(tab);return;}
});
function citationButton(ref,item){const p=typeof ref==='string'?readRef(ref):ref;if(!p)return '';const label=typeof ref==='string'?ref:ref.label||`${books[p.book]?.name||reading.name} ${p.chapter}:${p.verse}`;return `<button type="button" class="verse-citation"${item?` data-tone="${comparisonTone(item)}"`:``} data-cite="${p.book}/${p.chapter}/${p.verse}" data-cite-label="${esc(label)}"${item&&witnessLabel(item)?` data-cite-witness="${esc(item.witness)}" data-cite-summary="${esc(item.summary||item.text)}"`:``} aria-label="${esc(label)}" title="${esc(label)}" aria-haspopup="dialog">${esc(compactCitation(p,label))}</button>`;}
function comparisonCitations(verse,items){const refs=[{book:readingBook,chapter:readingChapter,verse,label:`${reading.name} ${readingChapter}:${verse}`},...items.flatMap(i=>i.refs||[])];return `<div class="summary-citations">${refs.filter((r,i)=>refs.findIndex(other=>other.book===r.book&&other.chapter===r.chapter&&other.verse===r.verse)===i ).map(r=>citationButton(r,items[0])).join('')}</div>`;}
function scriptureHtml(v,edition,book=readingBook,ch=readingChapter){
 const text=v[edition]||'',red=RED_LETTERS[`${book}:${ch}`]?.[v.n]?.[edition]||[];
 const ref=`${books[book]?.name||reading?.name} ${ch}:${v.n}`;
 const targets=edition==='kjv'&&book===readingBook&&ch===readingChapter&&$('#reader-compare').value!=='none'?verseComparisons(v.n).flatMap(item=>{
  const tags=recordTags(item),choices=tags.length?tags.map(tag=>({...item,tag,key:`${item.key}-${tag}`})):[item];
  const selected=comparisonSelections.get(selectionKey(v.n))||new Set();
  return choices.filter(choice=>categoryFilters.has(filterCategory(choice))&&(comparisonRecordSelections.get(recordSelection(choice))??selected.has(choice.key))).flatMap(choice=>quoteRanges(text,(choice.sides||[]).filter(s=>s.ref===ref).map(s=>s.quote)).map(([a,b])=>({a,b,tone:comparisonTone(choice),order:comparisonHighlightOrder.get(recordSelection(choice))||comparisonHighlightOrder.get(`${v.n}:${choice.key}`)||0})));
 }):[];
 const points=[...new Set([0,text.length,...red.flat(),...targets.flatMap(t=>[t.a,t.b])])].sort((a,b)=>a-b);
 const segments=points.slice(0,-1).map((a,i)=>{const b=points[i+1],target=targets.filter(t=>a>=t.a&&b<=t.b).sort((x,y)=>y.order-x.order)[0];return {a,b,tone:target?.tone,red:red.some(([x,y])=>a>=x&&b<=y)};});
 const merged=[];for(const part of segments){const last=merged.at(-1);if(last&&last.tone===part.tone&&last.red===part.red)last.b=part.b;else merged.push({...part});}
 return merged.map(({a,b,tone,red})=>{let html=esc(text.slice(a,b));if(tone)html=`<mark class="side-quote" data-tone="${tone}">${html}</mark>`;if(red)html=`<span class="jesus-words">${html}</span>`;return html;}).join('');
}
function refreshVerseHighlights(){
 if(!reading?.verses)return;
 const edition=$('#reader-edition').value;
 for(const verse of reading.verses){const body=document.getElementById(`verse-${verse.n}`)?.querySelector?.('.verse-body');if(body&&verse[edition])body.innerHTML=verseNumber(verse)+scriptureHtml(verse,edition);}
}
function verseNumber(v){return `<button class="verse-num" data-verse="${v.n}" aria-label="${selectedVerses.has(v.n)?'Deselect':'Select'} verse ${v.n}" aria-pressed="${selectedVerses.has(v.n)}">${v.n}</button>`;}
function verseText(v,edition){return `<div class="verse-body" tabindex="0" aria-label="Verse ${v.n}. Hold or press Enter for WEB translation">${verseNumber(v)}${v[edition]?scriptureHtml(v,edition):'<span class="missing-verse">This verse number is absent from the supplied edition’s dataset.</span>'}</div>`;}
function comparisonStatus(){
 const mode=$('#reader-compare').value,status=$('#comparison-status');status.hidden=mode==='none';if(mode==='none'){status.innerHTML='';return;}
 const records=comparisonModes.map(m=>comparisonCache.get(comparisonKey(m)));
 const failures=records.filter(r=>r?.status==='error');
 if(failures.length){status.innerHTML='Some comparison tags could not load. <button class="text-button" id="retry-comparison">Retry</button>';$('#retry-comparison').onclick=()=>{for(const m of comparisonModes)if(comparisonCache.get(comparisonKey(m))?.status==='error')comparisonCache.delete(comparisonKey(m));ensureComparisons();};return;}
 if(records.some(r=>!r||r.status==='loading')){status.textContent='Loading comparison tags…';return;}
 const count=new Set(records.flatMap((r,index)=>(r.items||[]).filter(item=>visibleComparison({...item,mode:comparisonModes[index]})).map(item=>item.id||`${comparisonModes[index]}:${item.title||''}:${item.summary}`))).size;
 const all=records.flatMap((r,index)=>(r.items||[]).map(item=>({...item,mode:comparisonModes[index]}))).filter(visibleComparison);
 const categories=[['T','Translation','translation'],['V','Violations','violation'],['Q','Question','question'],['science','Science','science'],['history','History','history'],['contradictions','Contradictory','contradictions']];
 status.innerHTML=categories.map(([key,label,tone])=>{const matches=all.filter(item=>recordTags(item).length?recordTags(item).includes(key):filterCategory(item)===key);const total=new Set(matches.map(item=>item.id||item.title||item.summary)).size;return `<button type="button" class="agreement category-filter ${tone}" data-category-filter="${key}" aria-pressed="${total>0&&categoryFilters.has(key)}" aria-label="${label}: ${total} comparisons" title="${label}: ${total} comparisons" ${total?'':'disabled'}><span class="filter-icon">${categoryIcon(key)}${total?`<span class="filter-badge" aria-hidden="true">${total}</span>`:""}</span><span class="filter-copy"><span class="filter-label">${label}</span>${total?` <span class="filter-count">${total}</span>`:""}</span></button>`}).join('');
}
async function ensureComparisons(){
 if(!reading||$('#reader-compare').value==='none')return;
 const edition=$('#reader-edition').value,book=readingBook,ch=readingChapter;
 const pending=comparisonModes.filter(mode=>!comparisonCache.has(comparisonKey(mode)));
 const jobs=pending.map(async mode=>{
  const key=comparisonKey(mode);comparisonCache.set(key,{status:'loading'});
  try{
   const res=await fetch(`/api/comparisons?book=${book}&chapter=${ch}&mode=${mode}`,{signal:AbortSignal.timeout(30000)});
   const data=await res.json();if(!res.ok)throw Error(data.error||'Could not load comparisons.');
   comparisonCache.set(key,{status:'ready',items:data.items});
  }catch(err){comparisonCache.set(key,{status:'error',error:err.name==='TimeoutError'?'The comparison took too long. Try again.':err.message});}
 });
 comparisonStatus();if(!jobs.length)return;await Promise.all(jobs);
 if(reading&&book===readingBook&&ch===readingChapter&&edition===$('#reader-edition').value)renderReader(true);
}
function readerQuestionForm(){return `<form id="reader-question-form" autocomplete="off" class="reader-question-form"><input id="reader-question" type="text" autocomplete="off" maxlength="2500" required aria-label="Ask about the Bible" placeholder="Ask about the Bible..." value="${esc(readerQuestionDraft)}" ${chatBusy?'disabled':''}><button type="submit" class="reader-question-submit" aria-label="Send question" title="Send question" ${chatBusy?'disabled':''}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></form>`;}
function submitReaderQuestion(ev){ev.preventDefault();if(chatBusy||!reading)return;const question=$('#reader-question').value.trim();if(!question)return;readerQuestionDraft=question;$('#chat-input').value=question;setView('chat');window.scrollTo({top:0,behavior:'instant'});$('#chat-form').requestSubmit();readerQuestionDraft='';}
document.addEventListener('input',ev=>{if(ev.target.id==='reader-question')readerQuestionDraft=ev.target.value;});
document.addEventListener('submit',ev=>{if(ev.target.id==='reader-question-form')submitReaderQuestion(ev);});
document.addEventListener('keydown',ev=>{if(ev.target.id==='reader-question'&&ev.key==='Enter'&&!ev.shiftKey){ev.preventDefault();ev.target.closest('form').requestSubmit();}});
function renderReader(preserve=false){if(!reading)return;const scroll=window.scrollY;const edition=$('#reader-edition').value,mode=$('#reader-compare').value;const comparing=mode!=='none';const label={history:'Historic',contradictions:'Contradictions',science:'Scientific',questions:'Unanswered Questions'}[mode];$('#chapter-text').classList.toggle('with-comparisons',comparing);$('#chapter-text').innerHTML=`<div class="chapter-heading-row"><h2>${esc(reading.name)} ${reading.chapter}</h2><p class="chapter-subtitle">${esc(CHAPTER_NAMES[reading.name][reading.chapter])}</p>${readerQuestionForm()}</div>${reading.verses.map(v=>`<div class="verse ${selectedVerses.has(v.n)?'selected':''}" id="verse-${v.n}"><div class="verse-content-grid ${comparing?'is-comparing':''}">${verseText(v,edition)}${comparing?comparisonCell(v.n):''}</div></div>`).join('')}`;updateContext();comparisonStatus();if(preserve)requestAnimationFrame(()=>window.scrollTo({top:scroll,behavior:'instant'}));ensureComparisons();}
$('#reader-compare').onclick=()=>{readerPreferences.compare=readerPreferences.compare==='none'?'on':'none';state.readerPreferences=readerPreferences;comparisonSelections.clear();comparisonRecordSelections.clear();comparisonHighlightOrder.clear();updateCompareToggle();persist();renderReader(true);};
function moveChapter(direction){let book=readingBook,ch=readingChapter+direction;if(ch<1&&book>0){book--;ch=books[book].chapters}else if(ch>books[book].chapters&&book<books.length-1){book++;ch=1}loadChapter(book,ch,null,true,direction);}
$('#book-select').onchange=ev=>loadChapter(Number(ev.target.value),1);$('#chapter-select').onchange=ev=>loadChapter(readingBook,Number(ev.target.value));for(const [id,key]of [['#reader-edition','edition']])$(id).onchange=()=>{readerPreferences[key]=$(id).value;if(key==='compare')comparisonSelections.clear();state.readerPreferences=readerPreferences;persist();renderReader(true)};for(const id of ['#prev-bottom'])$(id).onclick=()=>moveChapter(-1);for(const id of ['#next-bottom'])$(id).onclick=()=>moveChapter(1);function applyTextSize(){
 if(state.textScaleBaseline!=='110-v2'){state.textScale=1;state.textScaleBaseline='110-v2';persist();}
 const scale=[0.9,1,1.1,1.2,1.3].includes(state.textScale)?state.textScale:1;
 document.documentElement.style.setProperty('--text-scale',String(scale));
 $('#reader-font').setAttribute('aria-label',`Change all text size (currently ${Math.round(scale*100)} percent)`);
 $('#reader-font').title=`All text size: ${Math.round(scale*100)}%`;
}
$('#reader-font').onclick=()=>{const sizes=[0.9,1,1.1,1.2,1.3],current=sizes.includes(state.textScale)?state.textScale:1;state.textScale=sizes[(sizes.indexOf(current)+1)%sizes.length];applyTextSize();persist();};
applyTextSize();
$('#clear-selection').onclick=()=>{selectedVerses.clear();renderReader(true)};
document.addEventListener('click',ev=>{const button=ev.target.closest('button');if(!button)return;if(button.dataset.verse){const n=Number(button.dataset.verse);if(selectedVerses.has(n))selectedVerses.delete(n);else selectedVerses.add(n);renderReader(true)}if(button.dataset.read){setView('explore');const [b,ch,v]=button.dataset.read.split('/').map(Number);loadChapter(b,ch,v)}if(button.dataset.prompt){$('#chat-input').value=button.dataset.prompt;$('#chat-form').requestSubmit()}});
window.addEventListener('viewchange',ev=>{if(lastView==='explore')readingScroll=window.scrollY;if(ev.detail==='chat')updateContext();if(ev.detail==='explore'&&lastView!=='explore')requestAnimationFrame(()=>window.scrollTo({top:readingScroll,behavior:'instant'}));lastView=ev.detail;});
function sourceHtml(source){return sourceLinkHtml(source)+(source.witness&&source.summary?`<p class="citation-summary">${esc(source.witness)}: ${esc(source.summary)}</p>`:``);}
function sourceLinkHtml(source){const url=source.url||'';const safe=url.startsWith('#read/')||url.startsWith('#study/')||url.startsWith('https://');if(!safe)return '';const match=/^#read\/(\d+)\/(\d+)(?:\/(\d+))?$/.exec(url);if(match){const [b,ch,v]=match.slice(1).map(Number);const name=books.find(book=>book.id===b)?.name||source.label;const label=`${name} ${ch}${v?':'+v:''}`;return v?`<button type="button" class="verse-citation" data-cite="${b}/${ch}/${v}" data-cite-label="${esc(label)}"${source.witness?` data-cite-witness="${esc(source.witness)}" data-cite-summary="${esc(source.summary||'')}"`:``}>${esc(label)}</button>`:`<a class="verse-citation chat-citation" href="${esc(url)}" title="${esc(source.kind)}">${esc(label)}</a>`;}return `<a class="verse-citation chat-citation" href="${esc(url)}" title="${esc(source.kind)}" ${url.startsWith('https://')?'target="_blank" rel="noopener"':''}>${esc(source.label)} ↗</a>`;}
function chatSummary(text){return text.replace(/\[(?:source(?: ID)?\s*)?\d+\]/gi,'').trim();}
function chatWitnessText(text,sources=[]){let result=text||'';const seen=new Set();for(const source of sources){if(!source.witness||!source.summary||seen.has(source.recordId||source.summary))continue;seen.add(source.recordId||source.summary);const label=source.witness+': ';result=result.replaceAll(source.summary,label+source.summary).replaceAll(label+label,label);}return result;}
function renderChat(){if(!chatMessages.length)return;$('#chat-messages').innerHTML=chatMessages.map(m=>`<article class="chat-message ${m.role}"><div class="message-label"><strong>${m.role==='user'?'You':'Scripture Lens · AI'}</strong></div><div class="message-body">${esc(m.role==='assistant'?chatSummary(chatWitnessText(m.content,m.sources)):m.content)}</div>${m.role==='assistant'&&(m.details||m.sources?.length)?`<details class="comparison-details chat-details"><summary>Details & sources</summary>${m.details?`<div class="message-body">${esc(chatWitnessText(m.details,m.sources))}</div>`:''}${m.sources?.length?`<div class="chat-sources">${m.sources.map(sourceHtml).join('')}</div>`:''}</details>`:''}</article>`).join('');}
$('#chat-form').onsubmit=async ev=>{ev.preventDefault();if(chatBusy)return;const question=$('#chat-input').value.trim();if(!question){$('#chat-status').textContent='Enter a question.';return}chatBusy=true;$('#chat-send').disabled=true;$('#chat-input').disabled=true;$('#clear-chat').disabled=true;$('#chat-status').textContent='Finding relevant passages and sources…';$('#chat-messages').setAttribute('aria-busy','true');const history=chatMessages.slice(-8).map(m=>({role:m.role,content:m.content}));const book=readingBook,ch=readingChapter,selection=[...selectedVerses].sort((a,b)=>a-b),context='Whole Bible';chatMessages.push({role:'user',content:question,context});renderChat();$('#chat-input').value='';try{const response=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:question,book,chapter:ch,selected:selection,history}),signal:AbortSignal.timeout(55000)});const data=await response.json();if(!response.ok)throw Error(data.error||'Could not get an answer.');chatMessages.push({role:'assistant',content:data.answer,details:data.details,sources:data.sources,context});renderChat();$('#chat-status').textContent='Check linked sources. AI interpretation may be mistaken.';}catch(err){chatMessages.pop();if(chatMessages.length)renderChat();else $('#chat-messages').innerHTML='';$('#chat-input').value=question;$('#chat-status').textContent=err.name==='TimeoutError'?'The request timed out. Your question is preserved; send it again.':err.message;}finally{chatBusy=false;$('#chat-send').disabled=false;$('#chat-input').disabled=false;$('#clear-chat').disabled=false;$('#chat-messages').setAttribute('aria-busy','false');if(view==='chat'&&!window.matchMedia('(max-width: 850px)').matches)$('#chat-input').focus();}};
$('#chat-input').addEventListener('keydown',ev=>{if(ev.key==='Enter'&&!ev.shiftKey){ev.preventDefault();$('#chat-form').requestSubmit()}});$('#clear-chat').onclick=()=>{chatMessages.length=0;$('#chat-messages').innerHTML='';$('#chat-status').textContent='';$('#chat-input').value='';$('#chat-input').focus()};
function readerRoute(){const match=/^#read\/(\d+)\/(\d+)(?:\/(\d+))?$/.exec(location.hash);if(match&&books.length){setView('explore',false);loadChapter(+match[1],+match[2],match[3]?+match[3]:null,false)}}window.addEventListener('hashchange',readerRoute);
async function initializeReader(){try{const res=await fetch('/api/books');if(!res.ok)throw Error();books=await res.json();$('#book-select').innerHTML=books.map(b=>`<option value="${b.id}">${esc(b.name)}</option>`).join('');if(!books[readingBook]||readingChapter<1||readingChapter>books[readingBook].chapters){readingBook=0;readingChapter=1}const match=/^#read\/(\d+)\/(\d+)(?:\/(\d+))?$/.exec(location.hash);if(match&&books[+match[1]]&&+match[2]>0&&+match[2]<=books[+match[1]].chapters)await loadChapter(+match[1],+match[2],match[3]?+match[3]:null,false);else await loadChapter(readingBook,readingChapter,null,false);updateContext()}catch{$('#reader-status').textContent='Could not load Bible books.';$('#chapter-text').innerHTML='<div class="reader-error"><p>The reader could not connect.</p><button id="retry-books" class="primary">Retry</button></div>';$('#retry-books').onclick=initializeReader;}}initializeReader();

document.addEventListener('keydown',ev=>{if(ev.key==='Tab')document.body.classList.add('keyboard-navigation')});
document.addEventListener('pointerdown',()=>document.body.classList.remove('keyboard-navigation'));

// Reuse the same controls and handlers in the mobile sheet and desktop row.
const readerSheet=$('#reader-settings'),readerToolbar=document.querySelector('.reader-toolbar');
const mobileReader=matchMedia('(max-width:600px)');
function placeReaderControls(){if(!mobileReader.matches&&readerSheet.open)readerSheet.close();$(mobileReader.matches?'#reader-settings-controls':'#reader-toolbar-home').append(readerToolbar);}
mobileReader.addEventListener('change',placeReaderControls);placeReaderControls();
$('#reader-picker').onclick=()=>{readerSheet.showModal();$('#reader-picker').setAttribute('aria-expanded','true');};
$('#reader-settings-close').onclick=()=>readerSheet.close();
readerSheet.addEventListener('close',()=>$('#reader-picker').setAttribute('aria-expanded','false'));
readerSheet.addEventListener('click',ev=>{if(ev.target===readerSheet){const r=readerSheet.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)readerSheet.close();}});

// Horizontal chapter swipes leave scrolling, text selection and controls alone.
function chapterSwipeDirection(dx,dy,elapsed){return elapsed<=1200&&Math.abs(dx)>=70&&Math.abs(dx)>Math.abs(dy)*1.5?(dx<0?1:-1):0;}
(() => {
 const surface=$('#chapter-text');let swipe=null;
 const selectedText=()=>!window.getSelection()?.isCollapsed;
 surface.addEventListener('touchstart',ev=>{
  swipe=null;
  if(!matchMedia('(max-width:850px)').matches||ev.touches.length!==1||selectedText()||ev.target.closest('button,a,input,textarea,select,summary,.comparison-cell'))return;
  const t=ev.touches[0];if(t.clientX<24||t.clientX>window.innerWidth-24)return;
  swipe={id:t.identifier,x:t.clientX,y:t.clientY,started:performance.now()};
 },{passive:true});
 surface.addEventListener('touchmove',ev=>{
  if(!swipe)return;if(ev.touches.length!==1||selectedText()){swipe=null;return;}
  const t=ev.touches[0],dx=t.clientX-swipe.x,dy=t.clientY-swipe.y;
  if(Math.abs(dy)>16&&Math.abs(dy)>=Math.abs(dx)){swipe=null;return;}
  if(Math.abs(dx)>20&&Math.abs(dx)>Math.abs(dy)*1.5&&ev.cancelable)ev.preventDefault();
 },{passive:false});
 surface.addEventListener('touchend',ev=>{
  const gesture=swipe;swipe=null;if(!gesture||selectedText())return;
  const t=[...ev.changedTouches].find(t=>t.identifier===gesture.id);if(!t)return;
  const direction=chapterSwipeDirection(t.clientX-gesture.x,t.clientY-gesture.y,performance.now()-gesture.started);
  if(direction){if(ev.cancelable)ev.preventDefault();moveChapter(direction);}
 },{passive:false});
 surface.addEventListener('touchcancel',()=>{swipe=null;},{passive:true});
})();


// Pinned reader controls resize with the header, filters and text-size setting.
(() => {
 const header=document.querySelector('body > header'),status=$('#comparison-status'),dock=document.querySelector('.comparison-dock'),root=document.documentElement;
 function measurePinnedControls(){
  root.style.setProperty('--site-header-height',Math.ceil(header.getBoundingClientRect().height)+'px');
  const height=Math.ceil(status.getBoundingClientRect().height);
  root.style.setProperty('--comparison-dock-height',height+'px');dock.style.height=height+'px';
 }
 if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(measurePinnedControls);observer.observe(header);observer.observe(status);}
 window.addEventListener('resize',measurePinnedControls);window.addEventListener('viewchange',()=>requestAnimationFrame(measurePinnedControls));measurePinnedControls();
})();
