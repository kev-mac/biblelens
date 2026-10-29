'use strict';
let selectedVerses=new Set(),loadVersion=0,readingScroll=0,lastView='read',chatBusy=false;
const chatMessages=[];
// Selection is temporary UI state. Passage routes scroll without selecting.
function selectedVerseNumbers(){return [...selectedVerses].sort((a,b)=>a-b);}
function clearReaderSelection(){if(!selectedVerses.size)return;selectedVerses.clear();if(reading)renderReader(true);}
window.addEventListener('viewchange',ev=>{if(ev.detail!=='read')clearReaderSelection();});
let conversationTone=randomConversationTone();
function randomConversationTone(){const palette=['168,85,247','34,197,94','234,179,8','236,72,153','249,115,22'];return palette[Math.floor(Math.random()*palette.length)];}
function chapterStudies(){if(!reading)return [];return ENTRIES.filter(e=>e.refs.some(r=>{const p=readRef(r);return p&&p.book===readingBook&&p.chapter===readingChapter}));}
function applicableStudies(){const entries=chapterStudies();if(!selectedVerses.size)return entries;const matching=entries.filter(e=>e.refs.some(r=>{const p=readRef(r);return p&&p.book===readingBook&&p.chapter===readingChapter&&selectedVerses.has(p.verse)}));return matching.length?matching:entries;}
function chapterOptions(){comparisonSelections.clear();comparisonEvidenceOpen.clear();comparisonRecordSelections.clear();comparisonHighlightOrder.clear();const book=books[readingBook];$('#chapter-select').innerHTML=Array.from({length:book.chapters},(_,i)=>`<option value="${i+1}" ${i+1===readingChapter?'selected':''}>${i+1}</option>`).join('');$('#book-select').value=String(readingBook);}
function updateContext(){if(!books.length)return;const label=`${books[readingBook].name} ${readingChapter}`;$('#reader-status').textContent=selectedVerses.size?`${selectedVerses.size} ${selectedVerses.size===1?'verse':'verses'} selected`:`${reading?.verses.length||0} verses · ${$('#reader-edition').value.toUpperCase()}`;$('#clear-selection').hidden=!selectedVerses.size;$('#chapter-footer').textContent=label;$('#reader-picker-label').textContent=label;const context=$('#header-context');context.dataset.description=CHAPTER_NAMES[books[readingBook].name]?.[readingChapter]||'';context.dataset.passage=`${label} · ${$('#reader-edition').value.toUpperCase()}`;if(view==='read'){context.innerHTML=esc(label)+' <span class="passage-bullet">•</span> '+esc($('#reader-edition').value.toUpperCase());context.parentElement?.setAttribute('aria-label',label+' — Open navigation');}if(typeof updateHeaderContext==='function')updateHeaderContext();if(view==='read')$('#lens-settings').setAttribute('aria-label',`Settings for ${label}`);const first=readingBook===0&&readingChapter===1,last=readingBook===books.length-1&&readingChapter===books[readingBook].chapters;$('#prev-bottom').disabled=first;$('#next-bottom').disabled=last;}
async function readerJson(url){
 // Bound the response body as well as the initial connection. The explicit
 // timer also works where AbortSignal.timeout is unavailable.
 const controller=typeof AbortController==='function'?new AbortController():null;
 let timer;
 const timeout=new Promise((resolve,reject)=>{timer=setTimeout(()=>{
  const error=new Error('The reader request timed out.');error.name='TimeoutError';
  reject(error);controller?.abort();
 },15000);});
 try{
  const response=(async()=>{const result=await fetch(url,controller?{signal:controller.signal}:undefined);if(!result.ok)throw Error('The reader request failed.');return result.json();})();
  return await Promise.race([response,timeout]);
 }finally{clearTimeout(timer);}
}
async function loadChapter(book,ch,verse=null,updateHash=true){const b=books[book];if(!b||!Number.isInteger(ch)||ch<1||ch>b.chapters)return;if(updateHash)navigateHash(`#read/${book}/${ch}${verse?'/'+verse:''}`);stagePassageDock();const version=++loadVersion;readingBook=book;readingChapter=ch;renderStoriesView();selectedVerses.clear();$('#passage-tools').hidden=true;chapterOptions();$('#reader-status').textContent='Loading chapter…';if(view==='read')window.scrollTo({top:0,behavior:'instant'});$('#chapter-text').setAttribute('aria-busy','true');$('#chapter-text').innerHTML='<p class="chapter-loading loading-state" role="status">Loading chapter…</p><div class="chapter-skeleton" aria-hidden="true"></div>';window.dispatchEvent(new CustomEvent('biblelens:readerloading'));$('#comparison-status').hidden=true;try{const data=await readerJson(`/api/chapter?book=${book}&chapter=${ch}`);if(version!==loadVersion)return;reading=data;state.reading={book,chapter:ch};persist();renderReader();if(view==='read'){if(verse)requestAnimationFrame(()=>{if(view==='read')$(`#verse-${verse}`)?.scrollIntoView({block:'center',behavior:'smooth'});});}window.BibleLensNavigation?.restore();}catch(err){if(version!==loadVersion)return;reading=null;$('#chapter-text').innerHTML='<div class="reader-error"><p>Could not load this chapter.</p><button id="retry-chapter" class="primary">Retry</button></div>';$('#retry-chapter').onclick=()=>loadChapter(book,ch,verse,updateHash);$('#reader-status').textContent='Chapter unavailable. Try again.';window.dispatchEvent(new CustomEvent('biblelens:readererror'));}finally{if(version===loadVersion)$('#chapter-text').setAttribute('aria-busy','false');}}
const comparisonCache=new Map();
const comparisonSelections=new Map();
const comparisonEvidenceOpen=new Set();
const categoryFilters=new Set(['bookmark']);
function filterCategory(item){if(item.mode==='commandments')return 'commandments';return ({H:'academic',G:'T'}[item.tag]||item.tag)||(item.mode==='questions'?'Q':['science','history'].includes(item.mode)?'academic':item.mode);}
function categoryRank(item){return ['bookmark','T','V','commandments','Q','academic','contradictions'].indexOf(filterCategory(item));}
const comparisonModes=['history','contradictions','science','questions','commandments'];
const comparisonLabels={bookmark:'Bookmark',history:'Academic',contradictions:'Text Comparisons',science:'Academic',questions:'Questions',commandments:'Commandments'};
const languageTags={H:{label:'Academic',tone:'academic'},G:{label:'Translation',tone:'translation'},T:{label:'Translation',tone:'translation'},V:{label:'Violation',tone:'violation'},Q:{label:'Questions',tone:'question'}};
function recordTags(item){return [...new Set(Array.isArray(item.activeTags)?item.activeTags:Array.isArray(item.tags)?item.tags:item.tag?[item.tag]:[])].filter((t,i,a)=>languageTags[t]&&a.indexOf(t)===i);}
function witnessLabel(item){return (item.tags||[item.tag]).some(t=>['H','G','T'].includes(t))&&item.witness?item.witness+': ':'';}
function summaryText(item){return witnessLabel(item)+(item.summary||item.text||'');}
function comparisonReasoning(item){return item.reasoning?.trim()||item.text?.trim()||item.scope?.trim()||'';}
function evidenceKey(verse,item){return `${readingBook}:${readingChapter}:${verse}:${item.key}`;}
function comparisonKey(mode=$('#reader-compare').value){return `${readingBook}:${readingChapter}:${$('#reader-edition').value}:${mode}`;}
function selectionKey(verse){return `${comparisonKey('tabs')}:${verse}`;}
function visibleComparison(item){return item.mode==='commandments'||(item.mode==='history'&&item.academicAssessment===true)||item.mode==='bookmark'||recordTags(item).length>0||item.mode==='questions'||item.mode==='contradictions'||item.mode==='science'||(item.status!=='Agrees'&&(item.status==='Disagrees'||item.discrepancy===true));}
function verseBookmarkComparisons(verse){const key=`${readingBook}:${readingChapter}:${verse}`;if(typeof state==='undefined')return [];const note=state.verseNotes?.[key];if(!state.verseBookmarks?.[key]&&!note?.text)return [];return [{id:'bookmark-'+key,verse,mode:'bookmark',key:'bookmark',title:note?.title||(state.verseBookmarks[key]?.highlights?.length?'Highlight':'Note'),summary:note?.text||'',text:'',sources:[]}];}
function comparisonCategoryOpen(key){
 return !!reading?.verses?.some(v=>verseComparisons(v.n).some(item=>{
  const tags=recordTags(item),choices=tags.length?tags.map(tag=>({...item,tag})):item.mode==='questions'?[{...item,tag:'Q'}]:[item];
  return choices.some(choice=>choice.placementRole!=='context'&&filterCategory(choice)===key&&categoryFilters.has(key)&&(comparisonRecordSelections.get(recordSelection(choice))??(choice.mode==='bookmark'&&!!choice.summary)));
 }));
}
function chapterBookmarkButton(){const total=typeof state==='undefined'?0:new Set([...Object.keys(state.verseBookmarks||{}),...Object.keys(state.verseNotes||{}).filter(key=>state.verseNotes[key]?.text)].filter(key=>key.startsWith(`${readingBook}:${readingChapter}:`))).size;return `<button id="chapter-bookmarks" type="button" class="agreement category-filter bookmark" data-category-filter="bookmark" data-brightness="${total?'open':'empty'}" aria-pressed="${comparisonCategoryOpen('bookmark')}" aria-label="Bookmarks: ${total} bookmarked verses in this chapter" title="Bookmarks: ${total}" ${!total&&!comparisonCategoryOpen('bookmark')?'disabled':''} ><span class="filter-icon">${categoryIcon('bookmark')}<span id="chapter-bookmark-count" class="filter-badge" aria-hidden="true" ${total?'':'hidden'}>${total}</span></span><span class="filter-copy"><span class="filter-label">Bookmarks</span></span></button>`;}
function verseComparisons(verse){return [...verseBookmarkComparisons(verse),...comparisonModes.flatMap(mode=>(comparisonCache.get(comparisonKey(mode))?.items||[]).filter(i=>i.verse===verse).map((item,index)=>({...item,mode,key:`${mode}-${index}`}))).filter(visibleComparison)];}


const CONTEXT_CHIP_LIMIT=3;
const comparisonRecordSelections=new Map();
const comparisonHighlightOrder=new Map();
let comparisonHighlightSequence=0;
function recordSelection(item){return `${item.id||item.key}:${item.tag||item.mode}`;}
const BOOK_CITATION_ABBREVIATIONS='Gen Exo Lev Num Deu Jos Jud Rut 1Sam 2Sam 1Kin 2Kin 1Chr 2Chr Ezr Neh Est Job Psa Pro Ecc Son Isa Jer Lam Eze Dan Hos Joe Amo Oba Jon Mic Nah Hab Zep Hag Zec Mal Mat Mar Luk Joh Act Rom 1Cor 2Cor Gal Eph Phi Col 1The 2The 1Tim 2Tim Tit Phm Heb Jam 1Pet 2Pet 1Joh 2Joh 3Joh Jud Rev'.split(' ');
function compactCitation(p,label){const name=books[p.book]?.name;return name&&label.startsWith(name+' ')?BOOK_CITATION_ABBREVIATIONS[p.book]+label.slice(name.length):label;}
function commandmentWordsOfJesus(item){return item.mode==='commandments'&&(item.refs||[]).some(ref=>(typeof RED_LETTER_REFERENCES!=='undefined'?RED_LETTER_REFERENCES.has(`${ref.book}:${ref.chapter}:${ref.verse}`):RED_LETTERS[ref.book+':'+ref.chapter]?.[ref.verse]?.kjv?.length));}
function commandmentLabels(item){if(item.mode!=='commandments')return '';const ref=readRef(item.ref);return '<div class="commandment-labels">'+[ref?(ref.book<39?'Old Testament':'New Testament'):'',item.tenCommandments?'Ten Commandments':'',commandmentWordsOfJesus(item)?'Words of Jesus':''].filter(Boolean).map(label=>'<span>'+esc(label)+'</span>').join('')+'</div>';}
function commandmentRepetitions(item){return item.mode==='commandments'&&item.repeatedIn?.length?'<div class="commandment-repetitions"><span>Repeated or restated in (wording and context may differ):</span><div class="summary-citations">'+item.repeatedIn.map(ref=>{const p=readRef(ref),end=/-(\d+)$/.exec(ref);return p?referenceLink({...p,end:end?+end[1]:p.verse,label:ref},undefined,item):'';}).join('')+'</div></div>':'';}
function comparisonTone(item){if(item.mode==='commandments')return 'commandments';return languageTags[item.tag]?.tone||(item.mode==='questions'?'question':['science','history'].includes(item.mode)?'academic':item.mode);}
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
CATEGORY_ICON_PATHS.academic='<path d="m2 9 10-5 10 5-10 5-10-5Z"/><path d="M6 11v6c4 3 8 3 12 0v-6M22 9v7"/>';
CATEGORY_ICON_PATHS.bookmark='<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>';
CATEGORY_ICON_PATHS.commandments='<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 7h8M8 12h8M8 17h5"/>';
CATEGORY_ICON_NAMES.commandments='list-ordered';
CATEGORY_ICON_NAMES.stories='book-open';CATEGORY_ICON_PATHS.stories='<path d="M12 7v14M2 3h6a4 4 0 0 1 4 4 4 4 0 0 1 4-4h6v15h-6a4 4 0 0 0-4 3 4 4 0 0 0-4-3H2Z"/>';
CATEGORY_ICON_NAMES.academic='graduation-cap';CATEGORY_ICON_NAMES.bookmark='bookmark';
function categoryIcon(key){if(['stories','characters','prophecies'].includes(key))return document.querySelector('#navigation-icons').content.querySelector(`[data-navigation-icon="${key}"]`).outerHTML;const normalized=key==='questions'?'Q':key;return `<svg class="category-icon" data-icon="${CATEGORY_ICON_NAMES[normalized]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${CATEGORY_ICON_PATHS[normalized]}</svg>`;}
function comparisonIcon(item){return categoryIcon(filterCategory(item));}
function referenceLink(ref,label,contextItem){const p=typeof ref==='string'?readRef(ref):ref;if(!p)return '';const full=label||ref.label||(typeof ref==='string'?ref:`${books[p.book]?.name} ${p.chapter}:${p.verse}`);return `<a class="verse-citation${contextItem?' context-source':''}"${contextItem?` data-tone="${comparisonTone(contextItem)}"`:``} href="#read/${p.book}/${p.chapter}/${p.verse}" data-cite="${p.book}/${p.chapter}/${p.verse}" data-cite-end="${p.end||p.verse}" data-cite-label="${esc(full)}"${contextItem&&witnessLabel(contextItem)?` data-cite-witness="${esc(contextItem.witness)}" data-cite-summary="${esc(contextItem.summary||contextItem.text)}"`:``} aria-label="${esc(full)}" title="${esc(full)}"><span>${esc(compactCitation(p,full))}</span></a>`;}
function contextRanges(item){
 const sides=comparisonSides(item),sideRefs=new Set(sides.length?sides.map(s=>s.ref):[item.ref]);
 const refs=[...(item.refs||[]),...(item.appliesTo||[])].map(r=>typeof r==='string'?{...readRef(r),label:r}:r).filter(r=>r&&Number.isInteger(r.book)&&!sideRefs.has(r.label||`${books[r.book]?.name} ${r.chapter}:${r.verse}`));
 const sorted=refs.filter((r,i)=>refs.findIndex(o=>o.book===r.book&&o.chapter===r.chapter&&o.verse===r.verse)===i).sort((a,b)=>a.book-b.book||a.chapter-b.chapter||a.verse-b.verse);
 const ranges=[];for(const r of sorted){const last=ranges.at(-1);if(last&&last.book===r.book&&last.chapter===r.chapter&&last.end+1===r.verse)last.end=r.verse;else ranges.push({...r,end:r.verse});}
 return ranges.map(r=>({...r,label:`${books[r.book]?.name||reading.name} ${r.chapter}:${r.verse}${r.end!==r.verse?'–'+r.end:''}`}));
}
function roleCitations(item){
 const ranges=contextRanges(item),visible=ranges,remaining=ranges.length;if(!remaining)return '';
 const groups=ranges.map(r=>referenceLink(r,undefined,item)).join('');
 return `<section class="context-citations" aria-label="Secondary References"><div class="evidence-reference-label">Secondary References</div><div class="context-short summary-citations">${visible.map(r=>referenceLink(r,undefined,item)).join('')}${remaining?`<button type="button" class="verse-citation" data-tone="${comparisonTone(item)}" data-context-expand aria-expanded="false" aria-label="Show ${remaining} additional citations">+${remaining}</button>`:''}</div>${remaining?`<div class="context-full" hidden>${groups}<button type="button" class="verse-citation" data-tone="${comparisonTone(item)}" data-context-collapse>Show Fewer</button></div>`:''}</section>`;
}
function fitContextCitations(){
 for(const row of document.querySelectorAll('.context-short')){
  if(!row.clientWidth)continue;
  const more=row.querySelector('[data-context-expand]'),links=[...row.querySelectorAll('a')];
  if(!more)continue;
  links.forEach(link=>link.hidden=false);more.hidden=true;
  if(row.scrollWidth<=row.clientWidth)continue;
  more.hidden=false;let hidden=0;
  do{links[links.length-1-hidden].hidden=true;hidden++;more.textContent='+'+hidden;}while(hidden<links.length&&row.scrollWidth>row.clientWidth);
  more.setAttribute('aria-label','Show '+hidden+' additional citations');
 }
}
function expandContext(button){const parent=button.closest('.context-citations'),open=button.hasAttribute('data-context-expand');parent.querySelector('.context-short').hidden=open;parent.querySelector('.context-full').hidden=!open;parent.querySelector('[data-context-expand]').setAttribute('aria-expanded',String(open));}
function comparisonSides(item){
 if(item.sides?.length)return item.sides;
 if(item.placementRole==='context'||item.mode==='bookmark')return [];
 const verse=reading?.verses?.find(v=>v.n===item.verse);
 return verse?.kjv?[{label:'A',ref:`${reading.name} ${readingChapter}:${verse.n}`,quote:verse.kjv}]:[];
}
function sideRows(item){const sides=comparisonSides(item);return sides.length?`<div class="comparison-sides">${sides.slice().sort((a,b)=>{const x=readRef(a.ref),y=readRef(b.ref);return x&&y?x.book-y.book||x.chapter-y.chapter||x.verse-y.verse:0;}).map(side=>`<div class="comparison-side">${referenceLink(side.ref,undefined,item)}<q>${esc(side.quote)}</q></div>`).join('')}</div>`:'';}
function mergeQuoteRanges(ranges){const merged=[];for(const [a,b]of ranges.sort((x,y)=>x[0]-y[0]||x[1]-y[1])){const last=merged.at(-1);if(last&&a<=last[1])last[1]=Math.max(last[1],b);else merged.push([a,b]);}return merged;}
function quoteRanges(text,quotes){const ranges=[];for(const quote of quotes){if(!quote)continue;let start=0;while((start=text.indexOf(quote,start))!==-1){ranges.push([start,start+quote.length]);start+=quote.length;}}return mergeQuoteRanges(ranges);}

function relatedStudyPassages(item){const refs=item.relatedPassages||[];return refs.length?'<section class="related-passages"><h4>Related Passages</h4><div class="summary-citations">'+refs.map(ref=>referenceLink(ref)).join('')+'</div></section>':'';}
function scienceDetails(item){if(!item.fields?.length)return '';return `<div class="science-fields"><h4>Relevant Fields & Why</h4>${item.fields.map(f=>`<section class="science-field"><h5>${esc(f.branch)}</h5><p>${esc(f.text)}</p><div class="field-sources">${f.sources.map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)} ↗</a>`).join('')}</div></section>`).join('')}</div>`;}
function alternativeReadings(verse){
 const ref=`${reading.name} ${readingChapter}:${verse}`;
 const studies=ENTRIES.filter(e=>e.refs.includes(ref));
 if(!studies.length)return '';
 return `<div class="alternative-readings"><h4>Context & Other Readings</h4>${studies.map(e=>`<section><h5>${esc(e.title)}</h5><p>${esc(e.context)}</p><p>${esc(e.translation)}</p><p><b>${e.responseUrl?'Attributed response':'Possible reading'}:</b> ${esc(e.response)}</p>${e.responseUrl?`<a href="${esc(e.responseUrl)}" target="_blank" rel="noopener">Response source ↗</a>`:''}<p><b>Our assessment:</b> ${esc(e.assessment)}</p>${comparisonCitations(verse,[{refs:e.refs.map(readRef).filter(Boolean)}])}</section>`).join('')}</div>`;
}
function comparisonCell(verse){
 const mode=$('#reader-compare').value;if(mode==='none')return '';
 const items=verseComparisons(verse);
 if(!items.length)return '';
 const choices=items.flatMap(item=>{const tags=recordTags(item);return tags.length?tags.map(tag=>({...item,tag,key:`${item.key}-${tag}`})):item.mode==='questions'?[{...item,tag:'Q',key:`${item.key}-Q`}]:[item];});
 const selected=comparisonSelections.get(selectionKey(verse))||new Set();
 const isOpen=item=>categoryFilters.has(filterCategory(item))&&(comparisonRecordSelections.get(recordSelection(item))??(item.mode==='bookmark'));
 const tone=comparisonTone;
 const category=item=>languageTags[item.tag]?.label||comparisonLabels[item.mode];
 const icon=comparisonIcon;
 const shownChoices=choices.filter(item=>item.placementRole!=='context'||categoryFilters.has(filterCategory(item))).sort((a,b)=>categoryRank(a)-categoryRank(b));if(!shownChoices.length)return '';
 const tabChoices=shownChoices.filter((item,index,all)=>!all.some((other,i)=>filterCategory(other)===filterCategory(item)&&(other.placementRole!=='context'&&item.placementRole==='context'||((other.placementRole==='context')===(item.placementRole==='context')&&i<index))));
 const tabs=tabChoices.map(item=>{const group=shownChoices.filter(other=>filterCategory(other)===filterCategory(item)&&other.placementRole!=='context');if(group.length>1){const open=group.some(isOpen),label=category(item),ids=group.map(other=>`comparison-panel-${verse}-${other.key}`).join(' ');return `<button type="button" class="agreement comparison-tab ${tone(item)}" id="comparison-tab-${verse}-${item.key}" aria-pressed="${open}" aria-expanded="${open}" aria-controls="${ids}" data-comparison-category="${filterCategory(item)}" data-comparison-records="${esc(JSON.stringify(group.map(recordSelection)))}" data-comparison-verse="${verse}" data-comparison-key="${item.key}" aria-label="${esc(label)}" title="${esc(label)}">${icon(item)}</button>`;}const duplicate=choices.filter(i=>category(i)===category(item)).length>1;const label=`${category(item)}${item.status?' · '+item.status:''}${item.placementRole==='context'?' · Supporting context':''}${duplicate?' · '+(item.title||String(choices.indexOf(item)+1)):''}`;const open=isOpen(item);if(item.mode==='bookmark'&&!item.summary)return `<button type="button" class="agreement comparison-tab bookmark" data-bookmark-menu="${verse}" aria-label="Bookmarked verse ${verse}: add note, unmark or share" aria-haspopup="dialog">${icon(item)}</button>`;if(item.placementRole==='context'){const target=readRef(item.keyTarget||item.ref),local=target?.book===readingBook&&target?.chapter===readingChapter;return `<button type="button" class="agreement comparison-tab ${tone(item)} context-tag" data-context-local="${local}" ${local?`data-context-jump="${target.verse}"`:'aria-disabled="true"'} aria-label="${esc(label)}: ${local?'reference in this chapter':'reference in another chapter'}" title="${esc(item.keyTarget||item.ref)}"></button>`};return `<button type="button" class="agreement comparison-tab ${tone(item)}" id="comparison-tab-${verse}-${item.key}" aria-pressed="${open}" aria-expanded="${open}" aria-controls="comparison-panel-${verse}-${item.key}" data-comparison-category="${filterCategory(item)}" data-comparison-record="${esc(recordSelection(item))}" data-comparison-verse="${verse}" data-comparison-key="${item.key}" aria-label="${esc(label)}" title="${esc(label)}">${icon(item)}</button>`});
 const panels=shownChoices.filter(active=>active.placementRole!=='context'&&(active.mode!=='bookmark'||active.summary)).map(active=>`<section class="verse-comparison comparison-panel" data-tone="${tone(active)}" id="comparison-panel-${verse}-${active.key}" aria-labelledby="comparison-tab-${verse}-${tabChoices.find(item=>filterCategory(item)===filterCategory(active)).key}" ${isOpen(active)?'':'hidden'}><div class="comparison-summary" ${active.mode==='bookmark'?'':`tabindex="0" data-summary-toggle data-evidence-key="${esc(evidenceKey(verse,active))}" aria-expanded="${comparisonEvidenceOpen.has(evidenceKey(verse,active))}" aria-label="Category summary. Use the expand button or press Enter to show evidence."`}>${active.title?`<h3>${esc(active.title)}</h3>`:''}${commandmentLabels(active)}${esc(summaryText(active))}${active.mode==='bookmark'?'':`<button type="button" class="summary-expand" data-summary-expand aria-label="${comparisonEvidenceOpen.has(evidenceKey(verse,active))?'Collapse':'Expand'} references and reasoning" aria-expanded="${comparisonEvidenceOpen.has(evidenceKey(verse,active))}" aria-controls="comparison-evidence-${verse}-${active.key}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button> <button type="button" class="summary-inspect" data-comparison-inspect aria-label="Details & sources" title="Details & sources" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></button>`}${active.mode==='bookmark'?'':`<div class="comparison-evidence" id="comparison-evidence-${verse}-${active.key}" ${comparisonEvidenceOpen.has(evidenceKey(verse,active))?'':'hidden'}>${sideRows(active)}${active.placementRole&&!comparisonSides(active).length?referenceLink(active.ref||{book:readingBook,chapter:readingChapter,verse},undefined,active):''}${comparisonReasoning(active)?`<p class="summary-reasoning"><b>Reasoning:</b> ${esc(comparisonReasoning(active))}</p>`:''}${active.placementRole?roleCitations(active):comparisonCitations(verse,[active])}${relatedStudyPassages(active)}${commandmentRepetitions(active)}</div>`}</div>${active.mode==='bookmark'?`${noteActionButtons(`${readingBook}/${readingChapter}/${verse}`)}`:''}<details class="comparison-details" ${active.mode==='bookmark'?'hidden':''}><summary>Details & Sources</summary>${active.tag==='T'?`<p class="language-context">${esc(active.witness)}</p>`:''}<p><b>Category explanation:</b> ${esc(active.text)}</p>${relatedStudyPassages(active)}${scienceDetails(active)}${alternativeReadings(verse)}${active.scope?`<p class="comparison-scope"><b>Our assessment:</b> ${esc(active.scope)}</p>`:''}<div class="comparison-sources">${active.sources?.map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)} ↗</a>`).join('')||''}</div></details></section>`).join('');
 return `<div class="comparison-cell"><div class="comparison-tabs" role="group" aria-label="Categories for verse ${verse}"><span class="primary-tags">${tabs.filter((_,i)=>tabChoices[i].placementRole!=='context').join('')}</span><span class="context-tags">${tabs.filter((_,i)=>tabChoices[i].placementRole==='context').join('')}</span></div>${panels}</div>`;
}
function selectComparison(button){
 if(button.dataset.comparisonRecords){const records=JSON.parse(button.dataset.comparisonRecords),open=button.getAttribute('aria-expanded')!=='true';if(open)categoryFilters.add(button.dataset.comparisonCategory);for(const record of records){comparisonRecordSelections.set(record,open);if(open)comparisonHighlightOrder.set(record,++comparisonHighlightSequence);else comparisonHighlightOrder.delete(record);}renderReader(true);return;}
 const verse=Number(button.dataset.comparisonVerse),key=button.dataset.comparisonKey;
 const selected=comparisonSelections.get(selectionKey(verse))||new Set();
 const wasOpen=button.dataset.comparisonRecord?(comparisonRecordSelections.get(button.dataset.comparisonRecord)??false):selected.has(key);
 if(wasOpen)selected.delete(key);else selected.add(key);
 comparisonSelections.set(selectionKey(verse),selected);
 const open=selected.has(key);if(open&&button.dataset.comparisonCategory)categoryFilters.add(button.dataset.comparisonCategory);if(button.dataset.comparisonRecord){comparisonRecordSelections.set(button.dataset.comparisonRecord,open);for(const peer of document.querySelectorAll?.('[data-comparison-record]')||[]){if(peer.dataset.comparisonRecord!==button.dataset.comparisonRecord)continue;peer.setAttribute('aria-pressed',String(open));peer.setAttribute('aria-expanded',String(open));const peerSet=comparisonSelections.get(selectionKey(Number(peer.dataset.comparisonVerse)))||new Set();if(open)peerSet.add(peer.dataset.comparisonKey);else peerSet.delete(peer.dataset.comparisonKey);comparisonSelections.set(selectionKey(Number(peer.dataset.comparisonVerse)),peerSet);const peerPanel=document.getElementById(peer.getAttribute('aria-controls'));if(peerPanel)peerPanel.hidden=!open;}}button.setAttribute('aria-pressed',String(open));button.setAttribute('aria-expanded',String(open));
 const panel=document.getElementById(`comparison-panel-${verse}-${key}`);if(panel)panel.hidden=!open;
 const record=button.dataset.comparisonRecord||`${verse}:${key}`;
 if(open)comparisonHighlightOrder.set(record,++comparisonHighlightSequence);else comparisonHighlightOrder.delete(record);
 refreshVerseHighlights();if(typeof comparisonStatus==='function')comparisonStatus();
}
const categoryVerseCursor=new Map();
function visitCategoryVerse(key){
 const verses=reading.verses.filter(v=>verseComparisons(v.n).some(item=>item.placementRole!=='context'&&(recordTags(item).length?recordTags(item).some(tag=>filterCategory({tag})===key):filterCategory(item)===key))).map(v=>v.n);
 if(!verses.length)return;
 const cursorKey=`${readingBook}:${readingChapter}:${key}`,last=categoryVerseCursor.get(cursorKey),verse=verses[(verses.indexOf(last)+1)%verses.length];categoryVerseCursor.set(cursorKey,verse);
 categoryFilters.add(key);
 for(const item of verseComparisons(verse)){const tags=recordTags(item),choices=tags.length?tags.map(tag=>({...item,tag})):[item];for(const choice of choices)if(filterCategory(choice)===key)comparisonRecordSelections.set(recordSelection(choice),true);}
 renderReader(true);requestAnimationFrame(()=>document.getElementById('verse-'+verse)?.scrollIntoView({behavior:'smooth',block:'center'}));
}
function toggleComparisonCategory(key){
 const open=!comparisonCategoryOpen(key);if(open)categoryFilters.add(key);else categoryFilters.delete(key);
 for(const v of reading.verses)for(const item of verseComparisons(v.n)){
  const tags=recordTags(item),choices=tags.length?tags.map(tag=>({...item,tag,key:`${item.key}-${tag}`})):[item];
  for(const choice of choices)if(filterCategory(choice)===key){comparisonRecordSelections.set(recordSelection(choice),open);if(open)comparisonHighlightOrder.set(recordSelection(choice),++comparisonHighlightSequence);else comparisonHighlightOrder.delete(recordSelection(choice));}
 }
 renderReader(true);
}
document.addEventListener('click',ev=>{
 const filter=ev.target.closest('[data-category-filter]');if(filter){const key=filter.dataset.categoryFilter;if(key==='stories'){storiesActive=!storiesActive;renderStoriesView();comparisonStatus();}else{storiesActive=false;renderStoriesView();visitCategoryVerse(key);comparisonStatus();}document.querySelector(`[data-category-filter="${key}"]`)?.focus({preventScroll:true});return;}
 const jump=ev.target.closest('[data-context-jump]');if(jump){document.getElementById('verse-'+jump.dataset.contextJump)?.scrollIntoView({behavior:'smooth',block:'center'});return;}
 const expand=ev.target.closest('[data-context-expand],[data-context-collapse]');if(expand){expandContext(expand);return;}
 const tab=ev.target.closest('[data-comparison-key]');if(tab){selectComparison(tab);return;}
});
function citationButton(ref,item){const p=typeof ref==='string'?readRef(ref):ref;if(!p)return '';const label=typeof ref==='string'?ref:ref.label||`${books[p.book]?.name||reading.name} ${p.chapter}:${p.verse}`;return `<button type="button" class="verse-citation"${item?` data-tone="${comparisonTone(item)}"`:``} data-cite="${p.book}/${p.chapter}/${p.verse}" data-cite-label="${esc(label)}"${item&&witnessLabel(item)?` data-cite-witness="${esc(item.witness)}" data-cite-summary="${esc(item.summary||item.text)}"`:``} aria-label="${esc(label)}" title="${esc(label)}" aria-haspopup="dialog">${esc(compactCitation(p,label))}</button>`;}
function comparisonCitations(verse,items){const quoted=new Set(items.flatMap(item=>comparisonSides(item).map(side=>side.ref)));const refs=[{book:readingBook,chapter:readingChapter,verse,label:`${reading.name} ${readingChapter}:${verse}`},...items.flatMap(i=>i.refs||[])];return `<div class="summary-citations">${refs.filter((r,i)=>!quoted.has(r.label||`${books[r.book]?.name||reading.name} ${r.chapter}:${r.verse}`)&&refs.findIndex(other=>other.book===r.book&&other.chapter===r.chapter&&other.verse===r.verse)===i ).map(r=>citationButton(r,items[0])).join('')}</div>`;}
function scriptureHtml(v,edition,book=readingBook,ch=readingChapter){
 const text=v[edition]||'',red=v.redLetters?.[edition]||RED_LETTERS[`${book}:${ch}`]?.[v.n]?.[edition]||[];
 const ref=`${books[book]?.name||reading?.name} ${ch}:${v.n}`;
 const targets=edition==='kjv'&&book===readingBook&&ch===readingChapter&&$('#reader-compare').value!=='none'?verseComparisons(v.n).flatMap(item=>{
  const tags=recordTags(item),choices=tags.length?tags.map(tag=>({...item,tag,key:`${item.key}-${tag}`})):[item];
  const selected=comparisonSelections.get(selectionKey(v.n))||new Set();
  return choices.filter(choice=>categoryFilters.has(filterCategory(choice))&&(comparisonRecordSelections.get(recordSelection(choice))??false)).flatMap(choice=>quoteRanges(text,comparisonSides(choice).filter(s=>s.ref===ref).map(s=>s.quote)).map(([a,b])=>({a,b,tone:comparisonTone(choice),order:comparisonHighlightOrder.get(recordSelection(choice))||comparisonHighlightOrder.get(`${v.n}:${choice.key}`)||0})));
 }):[];
 const highlights=typeof normalizeTextHighlights==='function'?normalizeTextHighlights(state.verseBookmarks?.[`${book}:${ch}:${v.n}`]?.highlights).filter(h=>h.edition===edition&&text.slice(h.start,h.end)===h.text):[];
 const points=[...new Set([0,text.length,...red.flat(),...targets.flatMap(t=>[t.a,t.b]),...highlights.flatMap(h=>[h.start,h.end])])].sort((a,b)=>a-b);
 const segments=points.slice(0,-1).map((a,i)=>{const b=points[i+1],target=targets.filter(t=>a>=t.a&&b<=t.b).sort((x,y)=>y.order-x.order)[0];return {a,b,highlight:highlights.filter(h=>a>=h.start&&b<=h.end).at(-1),tone:target?.tone,red:red.some(([x,y])=>a>=x&&b<=y)};});
 const merged=[];for(const part of segments){const last=merged.at(-1);if(last&&last.tone===part.tone&&last.red===part.red&&last.highlight===part.highlight)last.b=part.b;else merged.push({...part});}
 return merged.map(({a,b,tone,red,highlight})=>{let html=globalThis.BibleLensReaderLinks?.html(text.slice(a,b),v.referenceLinks?.[edition],a)??esc(text.slice(a,b));if(highlight)html=`<mark class="text-highlight" data-highlight-book="${book}" data-highlight-chapter="${ch}" data-highlight-verse="${v.n}" data-highlight-color="${highlight.color}" data-highlight-start="${highlight.start}" data-highlight-end="${highlight.end}" data-highlight-edition="${highlight.edition}">${html}</mark>`;if(tone)html=`<mark class="side-quote" data-tone="${tone}">${html}</mark>`;if(red)html=`<span class="jesus-words">${html}</span>`;return html;}).join('');
}
function refreshVerseHighlights(){
 if(!reading?.verses)return;
 const edition=$('#reader-edition').value;
 for(const verse of reading.verses){const body=document.getElementById(`verse-${verse.n}`)?.querySelector?.('.verse-body');if(body&&verse[edition])body.innerHTML=verseNumber(verse)+'<span data-scripture>'+scriptureHtml(verse,edition)+'</span>';}
}
function verseNumber(v){const saved=!!state.verseBookmarks?.[`${readingBook}:${readingChapter}:${v.n}`];return `<button type="button" class="verse-num" data-digits="${String(v.n).length}" data-bookmark-menu aria-label="${saved?'Bookmarked. ':''}Actions for verse ${v.n}" aria-haspopup="dialog"><sup class="verse-label">${v.n}</sup>${saved?'<svg class="verse-bookmark-indicator" viewBox="0 0 24 24" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>':''}</button>`;}
function verseText(v,edition){const saved=!!state.verseBookmarks?.[`${readingBook}:${readingChapter}:${v.n}`];return `<div class="verse-body${saved?' verse-bookmarked':''}" data-inline-references="${v.referenceLinks?'ready':'pending'}" data-book="${readingBook}" data-chapter="${readingChapter}" data-verse="${v.n}" tabindex="0" aria-label="Verse ${v.n}. Hold and drag text to highlight and save; tap the verse text or number for actions">${verseNumber(v)}<span data-scripture>${v[edition]?scriptureHtml(v,edition):'<span class="missing-verse">This verse number is absent from the supplied edition’s dataset.</span>'}</span></div>`;}
function comparisonStatus(){
 const mode=$('#reader-compare').value,status=$('#comparison-status');status.hidden=false;if(mode==='none'){status.hidden=true;status.innerHTML='';return;}
 const records=comparisonModes.map(m=>comparisonCache.get(comparisonKey(m)));
 const failures=records.filter(r=>r?.status==='error');
 if(failures.length){status.innerHTML=storiesFilterButton()+'Some category tags could not load. <button class="text-button" id="retry-comparison">Retry</button>';$('#retry-comparison').onclick=()=>{for(const m of comparisonModes)if(comparisonCache.get(comparisonKey(m))?.status==='error')comparisonCache.delete(comparisonKey(m));ensureComparisons();};return;}
 if(records.some(r=>!r||r.status==='loading')){status.innerHTML=storiesFilterButton()+'<span class="loading-state">Loading category tags…</span>';return;}
 const count=new Set(records.flatMap((r,index)=>(r.items||[]).filter(item=>visibleComparison({...item,mode:comparisonModes[index]})).map(item=>item.id||`${comparisonModes[index]}:${item.title||''}:${item.summary}`))).size;
 const all=records.flatMap((r,index)=>(r.items||[]).map(item=>({...item,mode:comparisonModes[index]}))).filter(visibleComparison);
 const categories=[['T','Translation','translation'],['V','Violations','violation'],['commandments','Commandments','commandments'],['Q','Questions','question'],['academic','Academic','academic'],['contradictions','Contradictory','contradictions']];
 status.innerHTML=storiesFilterButton()+chapterBookmarkButton()+categories.map(([key,label,tone])=>{const matches=all.filter(item=>recordTags(item).length?recordTags(item).some(tag=>filterCategory({tag})===key):filterCategory(item)===key);const total=new Set(matches.filter(item=>item.placementRole!=='context').map(item=>item.id||item.title||item.summary)).size;return `<button type="button" class="agreement category-filter ${tone}" data-category-filter="${key}" data-brightness="${matches.some(item=>item.placementRole!=='context')?'open':'empty'}" aria-pressed="${comparisonCategoryOpen(key)}" aria-label="${label}: ${total} summaries" title="${label}: ${total} summaries" ${!total&&!comparisonCategoryOpen(key)?'disabled':''} ><span class="filter-icon">${categoryIcon(key)}${total?`<span class="filter-badge" aria-hidden="true">${total}</span>`:""}</span><span class="filter-copy"><span class="filter-label">${label}</span>${total?` <span class="filter-count">${total}</span>`:""}</span></button>`}).join('');
}
const comparisonJobs=new Map();
async function ensureComparisons(){
 if(!reading)return;
 const edition=$('#reader-edition').value,book=readingBook,ch=readingChapter;
 const pending=comparisonModes.filter(mode=>!comparisonCache.has(comparisonKey(mode)));
 const jobs=pending.map(mode=>{const job=(async()=>{
  const key=comparisonKey(mode);comparisonCache.set(key,{status:'loading'});
  try{
   const res=await fetch(`/api/comparisons?book=${book}&chapter=${ch}&mode=${mode}`,{signal:AbortSignal.timeout(30000)});
   const data=await res.json();if(!res.ok)throw Error(data.error||'Could not load categories.');
   comparisonCache.set(key,{status:'ready',items:data.items});
  }catch(err){comparisonCache.set(key,{status:'error',error:err.name==='TimeoutError'?'The category took too long. Try again.':err.message});}
 })();comparisonJobs.set(comparisonKey(mode),job);return job;});
 const waiting=comparisonModes.map(mode=>comparisonJobs.get(comparisonKey(mode))).filter(Boolean);
 comparisonStatus();if(!waiting.length)return;await Promise.all(waiting);
 if(reading&&book===readingBook&&ch===readingChapter&&edition===$('#reader-edition').value)refreshReaderComparisons();
}
function refreshReaderComparisons(){
 for(const verse of reading.verses){
  const grid=document.querySelector('#verse-'+verse.n+' .verse-content-grid');if(!grid)continue;
  grid.querySelector('.comparison-cell')?.remove();
  const html=comparisonCell(verse.n);if(html)grid.insertAdjacentHTML('beforeend',html);
  grid.classList.toggle('is-comparing',!!html);
 }
 comparisonStatus();window.dispatchEvent(new CustomEvent('biblelens:readerchange'));
}
function renderReader(preserve=false){if(!reading)return;stagePassageDock();const scroll=window.scrollY;const edition=$('#reader-edition').value,mode=$('#reader-compare').value;const comparing=mode!=='none';const label={history:'Historic',contradictions:'Text Comparisons',science:'Scientific',questions:'Questions'}[mode];document.body.classList.toggle('compare-active',comparing);$('#chapter-text').classList.toggle('with-comparisons',comparing);$('#chapter-text').innerHTML=`<div class="chapter-heading-row"><div class="passage-heading"><div><h1><button type="button" class="passage-heading-picker" aria-label="${esc(reading.name)} ${reading.chapter}. Choose book, chapter and verse" aria-haspopup="dialog" aria-controls="passage-picker">${esc(reading.name)} ${reading.chapter}</button></h1><p class="passage-eyebrow passage-description">${esc(reading.chapterName||CHAPTER_NAMES[reading.name]?.[reading.chapter]||'')}</p></div><button type="button" class="passage-picker-trigger" title="Choose passage. Drag or use arrow keys to move the floating button." aria-label="Choose book, chapter and verse" aria-haspopup="dialog" aria-controls="passage-picker"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v14m-10-3V3h6a4 4 0 0 1 4 4 4 4 0 0 1 4-4h6v15h-6a4 4 0 0 0-4 3 4 4 0 0 0-4-3Z"/></svg></button><button class="chapter-round passage-bookmark" data-passage-save aria-label="Save this passage" aria-pressed="false"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg></button></div><p class="chapter-subtitle">${esc(reading.chapterName||CHAPTER_NAMES[reading.name]?.[reading.chapter]||'')}</p></div>${reading.verses.map(v=>{const comparison=comparing?comparisonCell(v.n):'';return `<div class="verse ${selectedVerses.has(v.n)?'selected':''}" id="verse-${v.n}"><div class="verse-content-grid ${comparison?'is-comparing':''}">${verseText(v,edition)}${comparison}</div></div>`;}).join('')}`;updateContext();comparisonStatus();syncPassageTools();renderStoriesView();window.dispatchEvent(new CustomEvent('biblelens:readerchange'));if(preserve)requestAnimationFrame(()=>window.scrollTo({top:scroll,behavior:'instant'}));ensureComparisons();}
$('#reader-compare').onclick=()=>{readerPreferences.compare=readerPreferences.compare==='none'?'on':'none';state.readerPreferences=readerPreferences;comparisonSelections.clear();comparisonRecordSelections.clear();comparisonHighlightOrder.clear();updateCompareToggle();if(readerPreferences.compare==='none')storiesActive=false;persist();renderReader(true);};
let chapterPaging=false;
function chapterPagingBlocked(){return view!=='read'||!!document.querySelector('dialog[open],.verse-preview:not([hidden])');}
async function chapterMotion(frames,duration){
 const article=$('#chapter-text');
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!article.animate)return;
 const animation=article.animate(frames,{duration,easing:'cubic-bezier(0.25, 1, 0.5, 1)'});
 try{await animation.finished;}catch{}finally{animation.cancel();}
}
async function moveChapter(direction,dragOffset=0){
 if(chapterPaging||chapterPagingBlocked()||!books.length||!reading)return;
 let book=readingBook,ch=readingChapter+direction;
 if(ch<1&&book>0){book--;ch=books[book].chapters}
 else if(ch>books[book].chapters&&book<books.length-1){book++;ch=1}
 chapterPaging=true;
 try{
  if(ch<1||ch>books[book].chapters){
   toast(direction<0?'You are at the first chapter.':'You are at the last chapter.');
   const x=direction<0?8:-8;
   await chapterMotion([{transform:'translate3d(0,0,0)'},{transform:`translate3d(${x}px,0,0)`},{transform:`translate3d(${-x*5/8}px,0,0)`},{transform:'translate3d(0,0,0)'}],300);
   return;
  }
  const version=loadVersion;
  await chapterMotion([{transform:`translate3d(${dragOffset}px,0,0)`,opacity:1},{transform:`translate3d(${-direction*100}%,0,0)`,opacity:0}],160);
  const article=$('#chapter-text');article.style.transform='';article.style.opacity='';article.classList.remove('is-swiping');
  if(version!==loadVersion||chapterPagingBlocked())return;
  await loadChapter(book,ch);
  article.style.opacity='';
  if(loadVersion===version+1)await chapterMotion([{transform:`translate3d(${direction*100}%,0,0)`,opacity:0},{transform:'translate3d(0,0,0)',opacity:1}],220);
 }finally{const article=$('#chapter-text');article.style.transform='';article.style.opacity='';article.classList.remove('is-swiping');chapterPaging=false;}
}
$('#book-select').onchange=ev=>loadChapter(Number(ev.target.value),1);$('#chapter-select').onchange=ev=>loadChapter(readingBook,Number(ev.target.value));for(const [id,key]of [['#reader-edition','edition']])$(id).onchange=()=>{readerPreferences[key]=$(id).value;if(key==='compare')comparisonSelections.clear();state.readerPreferences=readerPreferences;persist();renderReader(true)};for(const id of ['#prev-bottom'])$(id).onclick=()=>moveChapter(-1);for(const id of ['#next-bottom'])$(id).onclick=()=>moveChapter(1);$('#clear-selection').onclick=()=>{selectedVerses.clear();renderReader(true)};
document.addEventListener('click',ev=>{const button=ev.target.closest('button');if(!button)return;if(button.dataset.read){setView('read');const [b,ch,v]=button.dataset.read.split('/').map(Number);loadChapter(b,ch,v)}if(button.dataset.prompt){$('#chat-input').value=button.dataset.prompt;$('#chat-form').requestSubmit()}});
// Text gestures belong to browser selection. Bookmarking uses the verse actions.
window.addEventListener('viewchange',ev=>{if(lastView==='read')readingScroll=window.scrollY;if(ev.detail==='chat')updateContext();if(ev.detail==='read'&&lastView!=='read')requestAnimationFrame(()=>window.scrollTo({top:readingScroll,behavior:'instant'}));lastView=ev.detail;});
function askAboutVerse(book,chapter,verse){
 const reference=`${books[book].name} ${chapter}:${verse}`;
 setView('chat');
 $('#chat-input').value=`In ${reference}, `;
 $('#chat-status').textContent=`What would you like to ask about ${reference}?`;
 $('#chat-input').focus();
}
function sourceHtml(source){return sourceLinkHtml(source)+(source.witness&&source.summary?`<p class="citation-summary">${esc(source.witness)}: ${esc(source.summary)}</p>`:``);}
function parseVerseSpec(spec){
 if(typeof spec!=='string'||spec.length>1000||!/^\d{1,3}(?:-\d{1,3})?(?:,\d{1,3}(?:-\d{1,3})?)*$/.test(spec))return null;
 const numbers=[];for(const part of spec.split(',')){const [first,last=first]=part.split('-').map(Number);if(first<1||last>199||last<first)return null;for(let n=first;n<=last;n++)numbers.push(n);if(numbers.length>199)return null;}
 return [...new Set(numbers)].sort((a,b)=>a-b);
}
function chatReferenceHtml(book,chapter,spec,label,source={},chip=false){
 const verses=spec?parseVerseSpec(spec):null;if(!book||!Number.isInteger(chapter)||chapter<1||chapter>(book.chapters||199)||(spec&&!verses))return esc(label);
 const url='#read/'+book.id+'/'+chapter+(spec?'/'+spec:'');
 return '<a class="'+(chip?'verse-citation chat-citation':'verse-link')+'" href="'+esc(url)+'"'+(verses?' data-cite="'+book.id+'/'+chapter+'/'+verses[0]+'" data-cite-end="'+verses[verses.length-1]+'"':'')+' data-cite-label="'+esc(label)+'"'+(source.witness?' data-cite-witness="'+esc(source.witness)+'" data-cite-summary="'+esc(source.summary||'')+'"':'')+' aria-label="'+esc(label)+'">'+esc(chip?compactCitation({book:book.id},label):label)+'</a>';
}
function sourceLinkHtml(source){
 const url=source.url||'',match=/^#read\/(\d+)\/(\d+)(?:\/([\d,-]+))?$/.exec(url);
 if(match){const book=books.find(b=>b.id===Number(match[1]));const chapter=Number(match[2]),spec=match[3]||'';return chatReferenceHtml(book,chapter,spec,(book?.name||source.label)+' '+chapter+(spec?':'+spec:''),source,true);}
 if(!url.startsWith('#study/')&&!url.startsWith('https://'))return '';
 return '<a class="verse-citation chat-citation" href="'+esc(url)+'" title="'+esc(source.kind||'')+'" '+(url.startsWith('https://')?'target="_blank" rel="noopener"':'')+'>'+esc(source.label||'Source')+' ↗</a>';
}
function chatSummary(text){return String(text||'').replace(/\[(?:source(?: ID)?\s*)?\d+\]/gi,'').replace(/^I found (?:a related passage|related passages|these related passages)[,:]?\s*/i,'').trim();}
function chatTextHtml(text){
 text=String(text||'');const names=books.map(b=>b.name).sort((a,b)=>b.length-a.length).map(name=>name.replace(/[.*+?^$()|[\]\\]/g,'\\$&'));if(!names.length)return esc(text);
 const pattern=new RegExp('\\b('+names.join('|')+')\\s+(\\d{1,3})(?::(\\d{1,3}(?:\\s*[-\u2013]\\s*\\d{1,3})?(?:\\s*,\\s*\\d{1,3}(?:\\s*[-\u2013]\\s*\\d{1,3})?)*))?(?!\\d|:\\d)','gi');
 let result='',offset=0;for(const match of text.matchAll(pattern)){result+=esc(text.slice(offset,match.index));const book=books.find(b=>b.name.toLowerCase()===match[1].toLowerCase());result+=chatReferenceHtml(book,Number(match[2]),(match[3]||'').replace(/\s/g,'').replace(/\u2013/g,'-'),match[0]);offset=match.index+match[0].length;}return result+esc(text.slice(offset));
}
function chatWitnessText(text,sources=[]){let result=text||'';const seen=new Set();for(const source of sources){if(!source.witness||!source.summary||seen.has(source.recordId||source.summary))continue;seen.add(source.recordId||source.summary);const label=source.witness+': ';result=result.replaceAll(source.summary,label+source.summary).replaceAll(label+label,label);}return result;}
function compactChatDetails(text,sources=[]){
 // Full scripture excerpts are available in chip previews; retain reasoning and limits.
 return String(text||'').split(/\n\s*\n/).filter(paragraph=>!sources.some(source=>source.url?.startsWith('#read/')&&paragraph.startsWith(source.label+':'))).join('\n\n').replace(/\s*\[(?:source(?: ID)?\s*)?\d+\]/gi,'');
}
function renderChat(){
 if(!chatMessages.length)return;
 $('#chat-messages').style.setProperty('--receiver-rgb',conversationTone);
 $('#chat-messages').innerHTML=chatMessages.map((m,index)=>{
  if(m.role==='user')return `<article class="chat-message glass-summary user" aria-label="You"><span class="chat-speaker">Your question</span><div class="message-body">${esc(m.content)}</div></article>`;
  const sources=(m.sources||[]).filter((source,index,all)=>all.findIndex(item=>item.url===source.url)===index);
  const summary=chatTextHtml(chatSummary(chatWitnessText(m.content,sources)));
  const chips=sources.map(sourceLinkHtml).filter(Boolean).join('');
  const details=compactChatDetails(chatWitnessText(m.details,sources),sources);
  const key='chat:'+index,open=comparisonEvidenceOpen.has(key);
  return `<article class="chat-message assistant comparison-panel" aria-label="BibleLens"><div class="comparison-summary chat-answer" tabindex="0" data-summary-toggle data-evidence-key="${key}" aria-expanded="${open}" aria-label="Answer summary. Use the expand button or press Enter for details."><p class="lens-answer-provenance">${m.generation==='on-device'?'On-device AI · verify against sources':'Library retrieval · stored text & editorial records'} · ${esc((m.edition||'kjv').toUpperCase())}</p>${m.profiles||''}<div class="message-body">${summary}</div><button type="button" class="summary-expand" data-summary-expand aria-label="${open?'Collapse':'Expand'} references and reasoning" aria-expanded="${open}" aria-controls="chat-evidence-${index}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg><span class="chat-control-label">References & reasoning</span></button><button type="button" class="summary-inspect" data-comparison-inspect aria-label="Details & sources" title="Details & sources"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><span class="chat-control-label">Full details</span></button><div class="comparison-evidence" id="chat-evidence-${index}" ${open?'':'hidden'}>${details?`<div class="message-body chat-reasoning">${chatTextHtml(details)}</div>`:''}${chips?`<div class="chat-summary-sources">${chips}</div>`:''}</div></div><details class="comparison-details chat-details" hidden><summary>Details & Sources</summary><div class="message-body">${chatTextHtml(details||chatSummary(m.content))}</div></details></article>`;
 }).join('')+(chatBusy?'<article class="chat-message assistant chat-typing" aria-label="BibleLens is finding passages"><span aria-hidden="true"><i></i><i></i><i></i></span></article>':'');
 fitChatCitations();
}
$('#chat-form').onsubmit=async ev=>{ev.preventDefault();if(chatBusy)return;const question=$('#chat-input').value.trim();if(!question){$('#chat-status').textContent='Enter a question.';return}chatBusy=true;$('#chat-send').disabled=true;$('#chat-input').disabled=true;$('#clear-chat').disabled=true;$('#chat-status').textContent='Finding relevant passages and sources…';$('#chat-messages').setAttribute('aria-busy','true');const history=chatMessages.slice(-8).map(m=>({role:m.role,content:m.content}));const book=readingBook,ch=readingChapter,selection=[],context='Whole Bible';chatMessages.push({role:'user',content:question,context});renderChat();$('#chat-input').value='';try{const response=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:question,book,chapter:ch,selected:selection,history,edition:$('#reader-edition').value}),signal:AbortSignal.timeout(55000)});const data=await response.json();if(!response.ok)throw Error(data.error||'Could not get an answer.');chatMessages.push({role:'assistant',profiles:await window.BibleLensProfiles?.(question).catch(()=>''),content:data.answer,details:data.details,sources:data.sources,context,generation:data.generation||'retrieval',mode:data.mode,edition:data.edition||$('#reader-edition').value});renderChat();$('#chat-status').textContent=data.sources?.length?'':'No supported answer found. Try a name, topic, or passage reference.';}catch(err){chatMessages.pop();if(chatMessages.length)renderChat();else $('#chat-messages').innerHTML='';$('#chat-input').value=question;$('#chat-status').textContent=err.name==='TimeoutError'?'The request timed out. Your question is preserved; send it again.':err.message;}finally{chatBusy=false;document.querySelector('.chat-typing')?.remove();$('#chat-send').disabled=false;$('#chat-input').disabled=false;$('#clear-chat').disabled=false;$('#chat-messages').setAttribute('aria-busy','false');if(view==='chat'&&!window.matchMedia('(max-width: 850px)').matches)$('#chat-input').focus();}};
$('#chat-input').addEventListener('keydown',ev=>{if(ev.key==='Enter'&&!ev.shiftKey){ev.preventDefault();$('#chat-form').requestSubmit()}});$('#clear-chat').onclick=()=>{conversationTone=randomConversationTone();for(const key of comparisonEvidenceOpen)if(key.startsWith('chat:'))comparisonEvidenceOpen.delete(key);chatMessages.length=0;$('#chat-messages').innerHTML='';$('#chat-status').textContent='';$('#chat-input').value='';$('#chat-input').focus()};
function readerRoute(){const match=/^#read\/(\d+)\/(\d+)(?:\/([\d,-]+))?$/.exec(location.hash);if(!readerInitialization&&match&&books.length&&(!match[3]||parseVerseSpec(match[3]))){setView('read',false);loadChapter(+match[1],+match[2],match[3]?parseVerseSpec(match[3])?.[0]||null:null,false)}}window.addEventListener('hashchange',readerRoute);
async function initializeReader(){
 $('#reader-status').textContent='Loading Bible books…';$('#chapter-text').setAttribute('aria-busy','true');$('#chapter-text').innerHTML='<p class="chapter-loading loading-state" role="status">Loading scripture…</p><div class="chapter-skeleton" aria-hidden="true"></div>';
 try{books=books.length?books:await readerJson('/api/books');$('#book-select').innerHTML=books.map(b=>`<option value="${b.id}">${esc(b.name)}</option>`).join('');if(!books[readingBook]||readingChapter<1||readingChapter>books[readingBook].chapters){readingBook=0;readingChapter=1}const match=/^#read\/(\d+)\/(\d+)(?:\/([\d,-]+))?$/.exec(location.hash);if(match&&(!match[3]||parseVerseSpec(match[3]))&&books[+match[1]]&&+match[2]>0&&+match[2]<=books[+match[1]].chapters)await loadChapter(+match[1],+match[2],match[3]?parseVerseSpec(match[3])?.[0]||null:null,false);else await loadChapter(readingBook,readingChapter,null,false);if(!reading)return;if(location.hash.startsWith('#stories/'))await routeLinkedStory();window.BibleLensWorkspace?.route(location.hash);updateContext()}catch{$('#reader-status').textContent='Could not load Bible books.';$('#chapter-text').innerHTML='<div class="reader-error"><p>The reader could not connect.</p><button id="retry-books" class="primary">Retry</button></div>';$('#retry-books').onclick=initializeReader;window.dispatchEvent(new CustomEvent('biblelens:readererror'));$('#chapter-text').setAttribute('aria-busy','false');}
}
let readerInitialization;
window.BibleLensReader={ensure(){return readerInitialization ||= initializeReader().finally(()=>{readerInitialization=null;});}};
window.addEventListener('viewchange',event=>{if(event.detail==='read'&&!reading)window.BibleLensReader.ensure();});

document.addEventListener('keydown',ev=>{if(ev.key==='Tab')document.body.classList.add('keyboard-navigation')});
document.addEventListener('pointerdown',()=>document.body.classList.remove('keyboard-navigation'));

// Keep the same reader controls in Settings at every viewport width.
// Passage navigation uses a separate dialog so reader settings stay independent.
let passagePicker=null,passagePickerRequest=0;
function passageNumberGrid(field,numbers,preferred){
 const selected=numbers.includes(preferred)?preferred:numbers[0];
 $('#'+field).value=String(selected||'');
 $('#'+field+'-grid').style?.setProperty('--number-columns',numbers.length>100?'9':'8');
 $('#'+field+'-grid').innerHTML=numbers.map(n=>`<label class="passage-number"><input type="radio" name="${field}-choice" value="${n}" ${n===selected?'checked':''}><span>${n}</span></label>`).join('');
}
async function updatePassagePickerVerses(preferred=1){
 const book=Number($('#passage-book').value),chapter=Number($('#passage-chapter').value),request=++passagePickerRequest;
 const field=$('#passage-verse');field.disabled=true;$('#passage-go').disabled=true;$('#passage-verse-grid').innerHTML='<span class="number-grid-status">Loading…</span>';
 try{const data=await readerJson(`/api/chapter?book=${book}&chapter=${chapter}`);if(request!==passagePickerRequest)return;
  passageNumberGrid('passage-verse',data.verses.map(v=>v.n),preferred);field.disabled=false;$('#passage-go').disabled=false;
 }catch{if(request===passagePickerRequest)$('#passage-verse-grid').innerHTML='<span class="number-grid-status">Could not load verses. Choose the chapter to retry.</span>';}
}
function updatePassagePickerChapters(chapter=1){const book=books[Number($('#passage-book').value)];passageNumberGrid('passage-chapter',Array.from({length:book.chapters},(_,i)=>i+1),chapter);}
function renderPassageBooks(testament){
 const selected=Number($('#passage-book').value),group=testament||(selected<39?'old':'new');
 passagePicker.dataset.testament=group;
 $('#passage-book-grid').innerHTML=books.filter(b=>group==='old'?b.id<39:b.id>=39).map(b=>`<label class="passage-number"><input type="radio" name="passage-book-choice" aria-label="${esc(b.name)}" title="${esc(b.name)}" value="${b.id}" ${b.id===selected?'checked':''}><span>${esc(b.name)}</span></label>`).join('');
 for(const button of passagePicker.querySelectorAll('[data-book-testament]'))button.setAttribute('aria-pressed',String(button.dataset.bookTestament===group));
}
function setPassageStep(step){
 passagePicker.dataset.step=step;
 for(const pane of passagePicker.querySelectorAll('[data-passage-pane]'))pane.hidden=pane.dataset.passagePane!==step;
 for(const button of passagePicker.querySelectorAll('[data-passage-step]')){button.setAttribute('aria-pressed',String(button.dataset.passageStep===step));button.textContent=button.dataset.passageStep==='book'?books[Number($('#passage-book').value)]?.name||'Book':button.dataset.passageStep==='chapter'?'Chapter '+($('#passage-chapter').value||'1'):'Verse '+($('#passage-verse').value||'1');}
}
function openPassagePicker(){
 if(!books.length)return;
 if(!passagePicker){passagePicker=document.createElement('dialog');passagePicker.id='passage-picker';passagePicker.className='glass-dialog';passagePicker.setAttribute('aria-labelledby','passage-picker-title');
  passagePicker.innerHTML='<div class="sheet-heading"><h2 id="passage-picker-title">Go to Passage</h2><button type="button" class="icon" data-picker-close aria-label="Close passage picker">×</button></div><form id="passage-picker-form"><div id="passage-translation"></div><nav class="passage-steps" aria-label="Passage selection"><button type="button" data-passage-step="book">Book</button><button type="button" data-passage-step="chapter">Chapter</button><button type="button" data-passage-step="verse">Verse</button></nav><fieldset data-passage-pane="book"><legend>Book</legend><input type="hidden" id="passage-book"><div class="passage-testaments" role="group" aria-label="Book collection"><button type="button" data-book-testament="old">Old Testament</button><button type="button" data-book-testament="new">New Testament</button></div><div id="passage-book-grid" class="passage-book-grid"></div></fieldset><div class="passage-picker-fields"><fieldset data-passage-pane="chapter"><legend>Chapter</legend><input type="hidden" id="passage-chapter"><div id="passage-chapter-grid" class="passage-number-grid"></div></fieldset><fieldset data-passage-pane="verse"><legend>Verse</legend><input type="hidden" id="passage-verse"><div id="passage-verse-grid" class="passage-number-grid" aria-live="polite"></div></fieldset></div><button type="submit" id="passage-go" class="primary">Read Passage</button></form>';document.body.append(passagePicker);
  $('#passage-translation').append($('#reader-edition').closest('label'));
  passagePicker.addEventListener('click',ev=>{const testament=ev.target.closest('[data-book-testament]');if(testament){renderPassageBooks(testament.dataset.bookTestament);return;}const step=ev.target.closest('[data-passage-step]');if(step)setPassageStep(step.dataset.passageStep);});passagePicker.addEventListener('click',ev=>{
   // Radio changes omit an already-selected choice; clicks also cover that tap and keyboard activation.
   const choice=ev.target;if(!choice.matches('input[type="radio"]'))return;
   if(choice.name==='passage-book-choice'){$('#passage-book').value=choice.value;updatePassagePickerChapters();updatePassagePickerVerses();setPassageStep('chapter');}
   if(choice.name==='passage-chapter-choice'){$('#passage-chapter').value=choice.value;updatePassagePickerVerses();setPassageStep('verse');}
   if(choice.name==='passage-verse-choice'){$('#passage-verse').value=choice.value;$('#passage-picker-form').requestSubmit();}
  });
  passagePicker.querySelector('[data-picker-close]').onclick=()=>passagePicker.close();
  $('#passage-picker-form').onsubmit=ev=>{ev.preventDefault();if($('#passage-go').disabled)return;const b=Number($('#passage-book').value),ch=Number($('#passage-chapter').value),v=Number($('#passage-verse').value);passagePicker.close();setView('read',false);loadChapter(b,ch,v);};
  passagePicker.addEventListener('close',()=>{passagePickerRequest++;document.querySelector('.passage-heading-picker')?.focus({preventScroll:true});});
 }
 $('#passage-book').value=readingBook;renderPassageBooks();setPassageStep('book');updatePassagePickerChapters(readingChapter);updatePassagePickerVerses([...selectedVerses][0]||1);setPassageStep('book');passagePicker.showModal();
}
document.addEventListener('click',ev=>{
 if(ev.target.closest('.passage-picker-trigger,.passage-heading-picker'))openPassagePicker();
});
const readerSheet=$('#reader-settings'),readerToolbar=document.querySelector('.reader-toolbar');
// Settings is shared by Read, Chat and Marked; never leave it under a hidden page.
document.body.append(readerSheet);
function placeReaderControls(){$('#reader-settings-controls').append(readerToolbar.querySelector('.reader-actions'));}
placeReaderControls();
function applyBookPickerPosition(){
 const position='floating';
 document.body.classList.toggle('book-picker-floating',position==='floating');
 positionBookPicker();
}
// Keep the floating control within the viewport, including after rotation or a chapter render.
function positionBookPicker(){
 // Retain old saved drag anchors in user data, but the Read control is fixed now.
 document.body.style.removeProperty('--book-picker-left');document.body.style.removeProperty('--book-picker-top');
}
applyBookPickerPosition();
$('#lens-settings').onclick=()=>{
 if(readerSheet.open)return;
 readerSheet.showModal();$('#lens-settings').setAttribute('aria-expanded','true');
};
$('#reader-settings-close').onclick=()=>readerSheet.close();
readerSheet.addEventListener('close',()=>{$('#lens-settings').setAttribute('aria-expanded','false');$('#lens-settings').focus({preventScroll:true});});
readerSheet.querySelector('.settings-notebook-link').addEventListener('click',()=>readerSheet.close());
// Sync and release modules add their panels later. Keep those live nodes and handlers
// in their appropriate settings section, rather than duplicating their controls.
function groupSettingsPanels(){
 for(const panel of readerSheet.querySelectorAll(':scope > .cloud-sync-settings'))$('#settings-notes').append(panel);
 for(const panel of readerSheet.querySelectorAll(':scope > .release-settings'))$('#settings-system').append(panel);
}
new MutationObserver(groupSettingsPanels).observe(readerSheet,{childList:true});
groupSettingsPanels();
readerSheet.addEventListener('click',ev=>{if(ev.target===readerSheet){const r=readerSheet.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)readerSheet.close();}});

// Edge controls are replaced by finger-tracked dragging and footer navigation.
(() => {
 const article=$('#chapter-text'),peek=$('#chapter-swipe-peek');
 let gesture=null,suppressClickUntil=0;
 function destination(direction){
  let book=readingBook,chapter=readingChapter+direction;
  if(chapter<1&&book>0){book--;chapter=books[book].chapters;}
  else if(chapter>books[book].chapters&&book<books.length-1){book++;chapter=1;}
  return books[book]&&chapter>0&&chapter<=books[book].chapters?{book,chapter}:null;
 }
 function reset(){gesture=null;article.classList.remove('is-swiping');article.style.transform='';peek.hidden=true;peek.classList.remove('ready');}
 article.addEventListener('touchstart',ev=>{
  if(chapterPaging)return;
  reset();
  if(ev.touches.length!==1||chapterPagingBlocked()||!reading||window.getSelection()?.toString()||ev.target.closest('button,a,input,textarea,select,[contenteditable],.comparison-panel,.verse-preview'))return;
  const touch=ev.touches[0];gesture={x:touch.clientX,y:touch.clientY,axis:null,dx:0,version:loadVersion};
 },{passive:true});
 article.addEventListener('touchmove',ev=>{
  if(!gesture)return;
  if(ev.touches.length!==1||chapterPagingBlocked()||window.getSelection()?.toString()||gesture.version!==loadVersion){reset();return;}
  const touch=ev.touches[0],dx=touch.clientX-gesture.x,dy=touch.clientY-gesture.y;
  if(!gesture.axis){
   if(Math.max(Math.abs(dx),Math.abs(dy))<10)return;
   if(Math.abs(dx)<=Math.abs(dy)*1.3){reset();return;}
   gesture.axis='x';article.classList.add('is-swiping');
  }
  if(ev.cancelable)ev.preventDefault();
  const target=destination(dx<0?1:-1),limit=article.getBoundingClientRect().width*.8;
  gesture.dx=Math.sign(dx)*Math.min(Math.abs(dx)*(target?1:.2),limit);
  article.style.transform='translate3d('+gesture.dx+'px,0,0)';
  if(!target){peek.hidden=true;return;}
  peek.textContent=books[target.book].name+' '+target.chapter+(dx<0?' →':' ←');
  peek.dataset.direction=dx<0?'next':'previous';peek.style.setProperty('--swipe-progress',String(Math.min(1,Math.abs(gesture.dx)/80)));
  peek.classList.toggle('ready',Math.abs(gesture.dx)>=80);peek.hidden=false;
 },{passive:false});
 article.addEventListener('touchcancel',reset,{passive:true});
 article.addEventListener('touchend',ev=>{
  const start=gesture;
  if(!start)return;
  gesture=null;peek.hidden=true;
  if(start.axis==='x')suppressClickUntil=Date.now()+500;
  if(ev.touches.length||start.axis!=='x'||Math.abs(start.dx)<80||start.version!==loadVersion||chapterPagingBlocked()||!destination(start.dx<0?1:-1)){reset();return;}
  moveChapter(start.dx<0?1:-1,start.dx);
 },{passive:true});
 article.addEventListener('click',ev=>{if(Date.now()<suppressClickUntil){ev.preventDefault();ev.stopImmediatePropagation();}},true);
 window.addEventListener('viewchange',reset);window.addEventListener('resize',reset);
})();

// The category tray can collapse to a small chevron while remaining available.
(() => {
 const dock=document.querySelector('.comparison-dock'),toggle=$('#comparison-dock-toggle');
 toggle.addEventListener('click',()=>{const collapsed=dock.classList.toggle('collapsed');toggle.setAttribute('aria-expanded',String(!collapsed));toggle.setAttribute('aria-label',collapsed?'Show categories':'Hide categories');});
})();


// Legacy dock offsets stay independent of the live masthead. The former
// hidden header contributed zero; retain that scroll geometry during migration.
(() => {
 const status=$('#comparison-status'),dock=document.querySelector('.comparison-dock'),root=document.documentElement;
 function measurePinnedControls(){
  root.style.setProperty('--site-header-height','0px');
  const height=Math.ceil(status.getBoundingClientRect().height);
  root.style.setProperty('--comparison-dock-height',height+'px');dock.style.height=height+'px';
 }
 if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(measurePinnedControls);observer.observe(status);}
 window.addEventListener('resize',measurePinnedControls);window.addEventListener('viewchange',()=>requestAnimationFrame(measurePinnedControls));measurePinnedControls();
})();

document.addEventListener('click',ev=>{const edit=ev.target.closest('[data-edit-verse-note]');if(edit)openVerseNote(readingBook,readingChapter,Number(edit.dataset.editVerseNote));});
$('#chapter-bookmarks-close').onclick=()=>$('#chapter-bookmarks-dialog').close();
$('#chapter-bookmark-list').addEventListener('click',ev=>{if(ev.target.closest('[data-read]'))$('#chapter-bookmarks-dialog').close();});

// Keep the circular book control as tall as its adjacent heading block.
(() => {
 let observed=null,frame=0;
 const size=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
  const heading=document.querySelector('.passage-heading'),text=heading?.querySelector(':scope > div');if(!heading||!text)return;
  const height=Math.ceil(text.getBoundingClientRect().height);
  if(height>0&&heading.style.getPropertyValue('--passage-book-diameter')!==height+'px')heading.style.setProperty('--passage-book-diameter',height+'px');
 });};
 const resize=typeof ResizeObserver==='function'?new ResizeObserver(size):null;
 new MutationObserver(()=>{const target=document.querySelector('.passage-heading > div');if(target!==observed){if(observed)resize?.unobserve(observed);observed=target;if(target)resize?.observe(target);}size();}).observe($('#chapter-text'),{childList:true});
 window.addEventListener('resize',size);window.addEventListener('viewchange',size);size();
})();

// Measure citation rows so the overflow count follows the available space.
function fitChatCitations(){
 document.querySelectorAll('.chat-summary-sources').forEach(row=>{
  row.querySelector('[data-chat-more]')?.remove();
  const links=[...row.children];links.forEach(link=>link.hidden=false);
  if(!links.length||!row.clientWidth||row.scrollWidth<=row.clientWidth)return;
  const more=document.createElement('button');more.type='button';more.className='chat-citation verse-citation';more.dataset.chatMore='';more.setAttribute('aria-haspopup','dialog');row.append(more);
  let hidden=0;
  do{links[links.length-1-hidden].hidden=true;hidden++;more.textContent='+'+hidden;}while(hidden<links.length&&row.scrollWidth>row.clientWidth);
  more.setAttribute('aria-label','Show '+hidden+' more citations');
  more.onclick=()=>{
   let dialog=document.querySelector('#chat-citations-dialog');
   if(!dialog){dialog=document.createElement('dialog');dialog.id='chat-citations-dialog';dialog.className='glass-dialog';dialog.setAttribute('aria-label','Response citations');document.body.append(dialog);}
   dialog.innerHTML='<div class="sheet-heading"><h2>Citations</h2><button type="button" class="preview-close" aria-label="Close citations">×</button></div><div class="chat-all-citations"></div>';
   links.forEach(link=>{const copy=link.cloneNode(true);copy.hidden=false;dialog.querySelector('.chat-all-citations').append(copy);});
   dialog.querySelector('button').onclick=()=>dialog.close();dialog.showModal();
  };
 });
}
new ResizeObserver(fitChatCitations).observe(document.querySelector('#chat-messages'));

new ResizeObserver(()=>requestAnimationFrame(fitContextCitations)).observe(document.querySelector('#chapter-text'));
window.addEventListener('resize',fitContextCitations);

// Summary evidence stays below its summary; detailed sources open in a context dialog.
(() => {
 const dialog=document.createElement('dialog');dialog.className='comparison-context-dialog';dialog.setAttribute('aria-labelledby','comparison-context-title');document.body.append(dialog);
 let opener=null;
 function toggle(summary){const evidence=summary.querySelector('.comparison-evidence');if(!evidence)return;evidence.hidden=!evidence.hidden;const key=summary.dataset.evidenceKey;if(evidence.hidden)comparisonEvidenceOpen.delete(key);else comparisonEvidenceOpen.add(key);summary.setAttribute('aria-expanded',String(!evidence.hidden));const control=summary.querySelector('[data-summary-expand]');if(control){control.setAttribute('aria-expanded',String(!evidence.hidden));control.setAttribute('aria-label',(evidence.hidden?'Expand':'Collapse')+' '+(control.dataset?.summaryLabel||'references and reasoning'));}requestAnimationFrame(()=>{fitContextCitations();fitChatCitations();});}
 document.addEventListener('keydown',ev=>{if((ev.key==='Enter'||ev.key===' ')&&ev.target.matches('[data-summary-toggle]')){ev.preventDefault();toggle(ev.target);}});
 document.addEventListener('click',ev=>{const expand=ev.target.closest('[data-summary-expand]');if(expand){toggle(expand.closest('[data-summary-toggle]'));return;}const button=ev.target.closest('[data-comparison-inspect]');if(!button)return;const panel=button.closest('.comparison-panel'),details=panel.querySelector('.comparison-details');opener=button;dialog.innerHTML='<div class="comparison-context-heading"><h2 id="comparison-context-title">Details & Sources</h2><button type="button" data-close-comparison aria-label="Close details and sources">×</button></div><div class="comparison-context-content"></div>';const content=dialog.querySelector('.comparison-context-content');for(const child of details.children)if(child.tagName!=='SUMMARY')content.append(child.cloneNode(true));for(const sources of content.querySelectorAll('.comparison-sources')){const citations=document.createElement('details');citations.className='citations-disclosure';citations.innerHTML='<summary>Citations</summary>';sources.replaceWith(citations);citations.append(sources);}dialog.showModal();});
 dialog.addEventListener('click',ev=>{if(ev.target===dialog||ev.target.closest('[data-close-comparison]'))dialog.close();});dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
})();

// Reveal the full category icon row while scrolling toward the top.
(() => {
 const dock=document.querySelector('.comparison-dock');dock.classList.add('pill-expanded');
 let lastY=window.scrollY;
 function hide(){document.body.classList.remove('comparison-menu-visible');}
 function syncDock(){if(document.body.classList.contains('dialog-scroll-locked'))return;const y=window.scrollY,delta=y-lastY;if(y<20){hide();lastY=y;return;}if(Math.abs(delta)<4)return;if(delta<0)document.body.classList.add('comparison-menu-visible');else hide();lastY=y;}
 window.addEventListener('scroll',syncDock,{passive:true});window.addEventListener('viewchange',()=>{hide();lastY=window.scrollY;});
})();

// Keep chapter navigation alongside the revealed dock only while its original
// buttons are outside the viewport. Reuse their actions and boundary state.
(() => {
 const dock=document.querySelector('.comparison-dock'),originals=[$('#prev-bottom'),$('#next-bottom')];
 const nav=document.createElement('nav');nav.className='dock-pagination';nav.setAttribute('aria-label','Chapter navigation');nav.hidden=true;
 for(const [index,label] of ['Previous chapter','Next chapter'].entries()){
  const button=document.createElement('button');button.type='button';button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="'+(index?'m9 5 7 7-7 7':'m15 5-7 7 7 7')+'"/></svg>';button.setAttribute('aria-label',label);
  button.addEventListener('click',()=>originals[index].click());nav.append(button);
 }
 dock.prepend(nav);
 const visible=element=>{const r=element.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<window.innerHeight;};
 function update(){
  nav.hidden=!document.body.classList.contains('read-view')||!document.body.classList.contains('comparison-menu-visible')||originals.some(visible);
  const shown=!nav.hidden;if(document.body.classList.contains('reader-pagination-visible')!==shown)document.body.classList.toggle('reader-pagination-visible',shown);
  [...nav.children].forEach((button,index)=>button.disabled=originals[index].disabled);
 }
 const observer=new IntersectionObserver(update);originals.forEach(button=>observer.observe(button));
 new MutationObserver(update).observe(document.body,{attributes:true,attributeFilter:['class']});
 originals.forEach(button=>new MutationObserver(update).observe(button,{attributes:true,attributeFilter:['disabled']}));
 window.addEventListener('resize',update);window.addEventListener('scroll',update,{passive:true});update();
})();

// Match the reader's draggable floating control, with a separate saved position.
function positionChatButton(anchor=state.chatButtonAnchor){
 const style=$('#clear-chat').style;
 if(!anchor||!Number.isFinite(anchor.x)||!Number.isFinite(anchor.y)){style.removeProperty('--chat-button-left');style.removeProperty('--chat-button-top');return;}
 style.setProperty('--chat-button-left',(8+Math.max(0,Math.min(1,anchor.x))*Math.max(0,window.innerWidth-74))+'px');
 style.setProperty('--chat-button-top',(8+Math.max(0,Math.min(1,anchor.y))*Math.max(0,window.innerHeight-74))+'px');
}
(() => {
 let drag=null,suppressUntil=0;
 function anchorAt(x,y){return {x:Math.max(0,Math.min(1,(x-8)/Math.max(1,window.innerWidth-74))),y:Math.max(0,Math.min(1,(y-8)/Math.max(1,window.innerHeight-74)))};}
 document.addEventListener('pointerdown',ev=>{
  const button=ev.target.closest('#clear-chat');
  if(!button||button.disabled||!ev.isPrimary||ev.button!==0||document.body.classList.contains('lens-app'))return;
  const rect=button.getBoundingClientRect();drag={button,id:ev.pointerId,x:ev.clientX,y:ev.clientY,left:rect.left,top:rect.top,moved:false,anchor:null};button.setPointerCapture(ev.pointerId);
 });
 document.addEventListener('pointermove',ev=>{
  if(!drag||drag.id!==ev.pointerId)return;
  const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;
  if(!drag.moved&&Math.hypot(dx,dy)<6)return;
  drag.moved=true;drag.button.classList.add('is-dragging');ev.preventDefault();
  drag.anchor=anchorAt(drag.left+dx,drag.top+dy);positionChatButton(drag.anchor);
 },{passive:false});
 function finish(ev){
  if(!drag||drag.id!==ev.pointerId)return;
  if(drag.moved){suppressUntil=Date.now()+500;if(ev.type==='pointercancel')positionChatButton();else{state.chatButtonAnchor=drag.anchor;persist();}}
  drag.button.classList.remove('is-dragging');drag=null;
 }
 document.addEventListener('pointerup',finish);document.addEventListener('pointercancel',finish);
 document.addEventListener('click',ev=>{if(Date.now()<suppressUntil&&ev.target.closest('#clear-chat')){ev.preventDefault();ev.stopImmediatePropagation();}},{capture:true});
 document.addEventListener('keydown',ev=>{
  const button=ev.target.closest('#clear-chat'),directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
  if(!button||button.disabled||!directions[ev.key]||document.body.classList.contains('lens-app'))return;
  ev.preventDefault();const rect=button.getBoundingClientRect(),[dx,dy]=directions[ev.key],step=ev.shiftKey?30:10;
  state.chatButtonAnchor=anchorAt(rect.left+dx*step,rect.top+dy*step);positionChatButton();persist();
 });
 window.addEventListener('resize',()=>positionChatButton());
})();
positionChatButton();

// Native text selection keeps iOS selection handles and vertical scrolling.
// A color tap is the only save action. Render after selection collapses so
// saving never destroys a selection or its drag handles.
(() => {
 let timer=0,dirty=false,selecting=false,pendingEntries=[],pendingKey='',color=null;
 const colors={yellow:'#facc15',green:'#4ade80',blue:'#60a5fa',pink:'#f472b6',purple:'#c084fc',orange:'#fb923c'};
 const picker=document.createElement('div');picker.className='highlight-color-picker';picker.hidden=true;picker.setAttribute('role','toolbar');picker.setAttribute('aria-label','Highlight color');
 picker.innerHTML='<span class="highlight-color-label">Choose a color to save</span>'+Object.entries(colors).map(([key,hex])=>`<button type="button" data-highlight-choice="${key}" style="--swatch:${hex};background:${hex}!important;color:#132131!important" aria-label="${key[0].toUpperCase()+key.slice(1)} highlight" aria-pressed="${key===color}"><span aria-hidden="true">✓</span></button>`).join('')+'<button type="button" data-highlight-close aria-label="Close highlight colors">×</button>';
 document.body.append(picker);
 // Keep selection handles and the selected text when a swatch receives a tap.
 picker.addEventListener('pointerdown',event=>event.preventDefault());
 picker.addEventListener('click',event=>{
  const choice=event.target.closest('[data-highlight-choice]');
  if(choice&&Object.hasOwn(colors,choice.dataset.highlightChoice)){
   const entries=selectionEntries();if(!entries.length)return;
   color=choice.dataset.highlightChoice;pendingEntries=entries;pendingKey=selectionKey(entries);
   for(const entry of pendingEntries)for(const range of entry.highlights)range.color=color;
   document.documentElement.style.setProperty('--selection-highlight-color',colors[color]+'80');
   if(saveTextHighlights(pendingEntries)){dirty=true;comparisonStatus();}showPicker();
  }
  if(event.target.closest('[data-highlight-close]')){picker.hidden=true;document.body.classList.remove('highlight-selecting');window.getSelection()?.removeAllRanges();}
 });
 function showPicker(){
  const selection=window.getSelection();
  if(!pendingEntries.length||!selection?.rangeCount||selection.isCollapsed){picker.hidden=true;return;}
  const rect=selection.getRangeAt(0).getBoundingClientRect();
  const viewport=window.visualViewport,top=viewport?.offsetTop||0,left=viewport?.offsetLeft||0,width=viewport?.width||window.innerWidth,height=viewport?.height||window.innerHeight;
  const docked=window.matchMedia('(any-pointer: coarse)').matches;
  picker.dataset.docked=String(docked);picker.style.width=docked?Math.min(440,width-16)+'px':'';
  picker.hidden=false;document.body.classList.add('highlight-selecting');
  for(const button of picker.querySelectorAll('[data-highlight-choice]'))button.setAttribute('aria-pressed',String(button.dataset.highlightChoice===color));
  const box=picker.getBoundingClientRect(),header=document.querySelector('body>header')?.getBoundingClientRect().bottom||top;
  if(docked){
   picker.style.left=left+(width-box.width)/2+'px';
   picker.style.top=Math.max(top+8,top+height-box.height-8)+'px';return;
  }
  picker.style.left=Math.max(left+8,Math.min(rect.left+rect.width/2-box.width/2,left+width-box.width-8))+'px';
  const y=rect.bottom+10+box.height<=top+height-8?rect.bottom+10:rect.top-box.height-10;
  picker.style.top=Math.max(header+8,Math.min(y,top+height-box.height-8))+'px';
 }
 const scriptureAt=node=>{const element=node?.nodeType===1?node:node?.parentElement;return element?.closest('#chapter-text [data-scripture]')||(element?.matches('#chapter-text .verse-body')?element.querySelector('[data-scripture]'):null);};
 function textOf(fragment){for(const icon of fragment.querySelectorAll('[aria-hidden="true"]'))icon.remove();return fragment.textContent||'';}
 function selectionEntries(){
  const selection=window.getSelection();
  if(!selection?.rangeCount||selection.isCollapsed||!scriptureAt(selection.anchorNode)||!scriptureAt(selection.focusNode)||document.querySelector('dialog[open]'))return [];
  const range=selection.getRangeAt(0),edition=$('#reader-edition').value,entries=[];
  for(const scripture of document.querySelectorAll('#chapter-text [data-scripture]')){
   if(!range.intersectsNode(scripture))continue;
   const body=scripture.closest('.verse-body'),book=Number(body.dataset.book),chapter=Number(body.dataset.chapter),verse=Number(body.dataset.verse);
   if(book!==readingBook||chapter!==readingChapter)continue;
   const clipped=document.createRange();clipped.selectNodeContents(scripture);
   if(range.compareBoundaryPoints(Range.START_TO_START,clipped)>0)clipped.setStart(range.startContainer,range.startOffset);
   if(range.compareBoundaryPoints(Range.END_TO_END,clipped)<0)clipped.setEnd(range.endContainer,range.endOffset);
   const prefix=document.createRange();prefix.selectNodeContents(scripture);prefix.setEnd(clipped.startContainer,clipped.startOffset);
   const start=textOf(prefix.cloneContents()),text=textOf(clipped.cloneContents()),source=reading.verses.find(v=>v.n===verse)?.[edition];
   if(!text.trim()||typeof source!=='string'||source.slice(start.length,start.length+text.length)!==text)continue;
   entries.push({book,chapter,verse,highlights:[{edition,start:start.length,end:start.length+text.length,text,color}]});
  }
  return entries;
 }
 function selectionKey(entries){return JSON.stringify(entries.map(entry=>({...entry,highlights:entry.highlights.map(({color,...range})=>range)})));}
 function resetChoice(){color=null;document.documentElement.style.removeProperty('--selection-highlight-color');}
 function changed(){
  clearTimeout(timer);
  const entries=selectionEntries();
  if(!entries.length){
   if(selecting){picker.hidden=true;return;}
   pendingEntries=[];pendingKey='';resetChoice();picker.hidden=true;document.body.classList.remove('highlight-selecting');
   if(dirty){dirty=false;renderReader(true);}return;
  }
  const key=selectionKey(entries);if(key!==pendingKey)resetChoice();
  pendingKey=key;pendingEntries=entries;document.body.classList.add('highlight-selecting');
  picker.hidden=true;if(!selecting)timer=setTimeout(showPicker,400);
 }
 document.addEventListener('selectionchange',changed);
 document.addEventListener('pointerdown',event=>{if(event.target.closest('#chapter-text [data-scripture]')){selecting=true;pendingKey='';resetChoice();picker.hidden=true;document.body.classList.add('highlight-selecting');clearTimeout(timer);}},{capture:true});
 function finishSelection(){selecting=false;clearTimeout(timer);timer=setTimeout(()=>{changed();},80);}
 document.addEventListener('pointerup',finishSelection);
 document.addEventListener('pointercancel',finishSelection);
 document.addEventListener('touchend',finishSelection,{passive:true});
 window.addEventListener('viewchange',()=>{
  clearTimeout(timer);selecting=false;pendingEntries=[];pendingKey='';resetChoice();picker.hidden=true;document.body.classList.remove('highlight-selecting');
  if(dirty){dirty=false;renderReader(true);}
 });
 const reposition=()=>{if(!picker.hidden&&!selecting)showPicker();};
 window.addEventListener('resize',reposition);
 window.visualViewport?.addEventListener('resize',reposition);
 window.visualViewport?.addEventListener('scroll',reposition);
 document.addEventListener('scroll',reposition,{passive:true,capture:true});
})();

// A saved highlight has its own menu; verse-number actions remain separate.
(() => {
 const colors={yellow:'#facc15',green:'#4ade80',blue:'#60a5fa',pink:'#f472b6',purple:'#c084fc',orange:'#fb923c'};
 const menu=document.createElement('div');menu.className='highlight-context-menu';menu.hidden=true;menu.setAttribute('role','dialog');menu.setAttribute('aria-label','Highlight actions');
 menu.innerHTML='<div class="highlight-menu-heading"><span>Highlight</span><button type="button" data-highlight-dismiss aria-label="Close highlight actions">×</button></div><div class="highlight-menu-colors" role="group" aria-label="Highlight color">'+Object.entries(colors).map(([key,hex])=>`<button type="button" data-highlight-recolor="${key}" style="--swatch:${hex};background:${hex}!important;color:#132131!important" aria-label="${key[0].toUpperCase()+key.slice(1)} highlight" aria-pressed="false"><span aria-hidden="true">✓</span></button>`).join('')+'</div><div class="highlight-menu-actions"><button type="button" data-highlight-copy>Copy</button><button type="button" data-highlight-remove>Remove Highlighting</button></div>';
 document.body.append(menu);
 let press=null,timer=0,active=null,suppressUntil=0;
 function cancel(){clearTimeout(timer);press=null;}
 function close(){menu.hidden=true;active=null;cancel();}
 function show(mark,x,y,keyboard=false){
  const book=Number(mark.dataset.highlightBook),chapter=Number(mark.dataset.highlightChapter),verse=Number(mark.dataset.highlightVerse);
  const range=normalizeTextHighlights(state.verseBookmarks[`${book}:${chapter}:${verse}`]?.highlights).find(h=>h.edition===mark.dataset.highlightEdition&&h.start===Number(mark.dataset.highlightStart)&&h.end===Number(mark.dataset.highlightEnd));
  if(!range)return;
  active={book,chapter,verse,range};suppressUntil=Date.now()+800;cancel();window.getSelection()?.removeAllRanges();
  for(const button of menu.querySelectorAll('[data-highlight-recolor]'))button.setAttribute('aria-pressed',String(button.dataset.highlightRecolor===range.color));
  menu.hidden=false;
  window.BibleLensPopup?.prepare(menu);
  const viewport=window.visualViewport,left=viewport?.offsetLeft||0,top=viewport?.offsetTop||0,width=viewport?.width||window.innerWidth,height=viewport?.height||window.innerHeight;
  const box=menu.getBoundingClientRect();menu.style.left=Math.max(left+8,Math.min(x-box.width/2,left+width-box.width-8))+'px';
  menu.style.top=Math.max(top+64,Math.min(y+12,top+height-box.height-8))+'px';
  if(keyboard)menu.querySelector('[data-highlight-copy]').focus({preventScroll:true});
 }
 document.addEventListener('pointerdown',event=>{
  if(menu.contains(event.target))return;
  if(!menu.hidden){close();return;}
  const mark=event.target.closest('.text-highlight[data-highlight-start]');if(!mark||event.button!==0)return;
  press={mark,id:event.pointerId,x:event.clientX,y:event.clientY};timer=setTimeout(()=>{if(press)show(press.mark,press.x,press.y);},500);
 },true);
 document.addEventListener('pointermove',event=>{if(press&&event.pointerId===press.id&&Math.hypot(event.clientX-press.x,event.clientY-press.y)>8)cancel();},true);
 for(const type of ['pointerup','pointercancel'])document.addEventListener(type,cancel,true);
 document.addEventListener('contextmenu',event=>{const mark=event.target.closest('.text-highlight[data-highlight-start]');if(!mark)return;event.preventDefault();event.stopImmediatePropagation();if(menu.hidden)show(mark,event.clientX,event.clientY);},true);
 document.addEventListener('click',event=>{if(Date.now()<suppressUntil&&event.target.closest('.text-highlight[data-highlight-start]')){event.preventDefault();event.stopImmediatePropagation();}},true);
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!menu.hidden){event.preventDefault();close();return;}
  if(event.key==='F10'&&event.shiftKey){const mark=event.target.closest('.verse-body')?.querySelector('.text-highlight');if(mark){event.preventDefault();const rect=mark.getBoundingClientRect();show(mark,rect.left,rect.bottom,true);}}
 });
 menu.addEventListener('click',async event=>{
  if(event.target.closest('[data-highlight-dismiss]')){close();return;}
  if(!active)return;const {book,chapter,verse,range}=active;
  const recolor=event.target.closest('[data-highlight-recolor]');
  if(recolor){editTextHighlight(book,chapter,verse,range,recolor.dataset.highlightRecolor);close();return;}
  if(event.target.closest('[data-highlight-remove]')){editTextHighlight(book,chapter,verse,range,null);close();return;}
  if(event.target.closest('[data-highlight-copy]')){
   try{
    if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(range.text);
    else{const input=document.createElement('textarea');input.value=range.text;input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();const copied=document.execCommand('copy');input.remove();if(!copied)throw Error('Copy unavailable');}
    toast('Highlighted text copied');close();
   }catch{toast('Could not copy. Try selecting the text and using Copy.');}
  }
 });
 document.addEventListener('scroll',()=>{cancel();if(!menu.hidden)close();},{passive:true,capture:true});
 window.addEventListener('viewchange',close);window.addEventListener('resize',close);
})();
