import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import worker from '../dist/server/index.js';
const request=path=>worker.fetch(new Request('https://example.com'+path),{},{});
for(const book of [0,1,4,39,64]){
 const response=await request('/api/marked-comparisons?book='+book);assert.equal(response.status,200);const data=await response.json();assert.equal(data.book,book);
 assert.equal(new Set(data.records.map(r=>r.key)).size,data.records.length);
 for(const record of data.records){assert(record.placements.length);assert.equal(new Set(record.placements.map(p=>p.chapter+':'+p.verse)).size,record.placements.length);for(const p of record.placements)assert(data.verses[p.chapter+':'+p.verse]?.kjv);}
 if(book===0){assert(data.records.some(r=>r.id==='study-plants'));const ch=await (await request('/api/chapter?book=0&chapter=1')).json();assert.equal(data.verses['1:11'].kjv,ch.verses.find(v=>v.n===11).kjv);}
}
for(const query of ['','?book=-1','?book=66','?book=NaN','?book=0.5'])assert.equal((await request('/api/marked-comparisons'+query)).status,400);
const data=await (await request('/api/marked-comparisons?book=0')).json();
const context={markedData:data,markedChapterSelection:1,markedKind:'all',markedTheme:'all',markedCommandmentType:'all',recordTags:item=>(item.activeTags??item.tags??[]).map(t=>['H','G'].includes(t)?'T':t).filter(t=>['T','V','Q'].includes(t)),filterCategory:item=>item.tag||(['science','history'].includes(item.mode)?'academic':item.mode==='questions'?'Q':item.mode)};
vm.createContext(context);const readerSource=fs.readFileSync('src/reader.js','utf8');vm.runInContext(readerSource.slice(readerSource.indexOf('function visibleComparison('),readerSource.indexOf('function verseBookmarkComparisons(')),context);const source=fs.readFileSync('src/marked.js','utf8');vm.runInContext(source.slice(source.indexOf('function markedChoices'),source.indexOf('function markedVerseRow')),context);
for(const record of data.records)assert(context.markedMatchingPlacements(record).every(p=>p.chapter===1));
context.markedKind='academic';for(const record of data.records)for(const p of context.markedMatchingPlacements(record))assert(context.markedChoices(record,p).some(c=>context.filterCategory(c)==='academic'));
for(const [id,chapter] of [['genesis-7-worldwide-flood',7],['genesis-18-sarah-reproductive-aging',18],['genesis-41-joseph-famine-evidence',41],['genesis-47-joseph-land-acquisition',47]]){context.markedChapterSelection=chapter;const record=data.records.find(r=>r.id===id);assert(record,id);assert(context.markedRecordVisible(record));assert(context.markedMatchingPlacements(record).some(p=>p.placementRole==='key'));}context.markedChapterSelection=1;
assert(!source.includes('data-marked-record='));assert(source.includes('class="marked-category-pane" data-tone='));assert(!source.includes('class="marked-category-pane" open'));assert(source.includes('${markedPrimaryRows(primary,choice)}${secondary}${relatedStudyPassages(record)}${commandmentRepetitions(record)}${comparisonReasoning(record)'));
assert(source.includes("view==='saved'&&window.scrollY<20"));assert(source.includes("if(y<20)document.body.classList.add('marked-filter-visible')"));
const groups=new Map();context.categoryRank=item=>['bookmark','T','V','commandments','Q','academic','contradictions'].indexOf(context.filterCategory(item));vm.runInContext(source.slice(source.indexOf('function markedGroup'),source.indexOf('function markedSummary')),context);context.markedKind='all';for(const record of data.records.filter(r=>context.markedRecordVisible(r)&&context.markedMatchingPlacements(r).length)){const group=context.markedGroup(record);assert(['T','V','commandments','Q','academic','contradictions'].includes(group));groups.set(record.key,group);}assert(groups.size>0);
console.log('PASS: book-scoped comparison retrieval, one row per verse/comparison, canonical verse text, invalid filters, chapter/category filtering and collapsible category groups without comparison icons.');

// Expanded cards keep scope metadata in Details, with reference chips before reasoning.
Object.assign(context,{markedBookSelection:0,books:[{name:'Genesis'}],languageTags:{T:{}},comparisonTone:()=> 'translation',comparisonEvidenceOpen:new Set(),esc:s=>String(s),summaryText:r=>r.summary,comparisonReasoning:r=>r.reasoning,referenceLink:r=>`<a class="verse-citation">${r.label}</a>`,commandmentLabels:()=>'',commandmentRepetitions:()=>'',roleCitations:()=>'<div class="context-citations">Supporting reference</div>',scienceDetails:()=>'',markedPrimaryReferences:()=>[{label:'Genesis 49:10',quotes:['Full scripture quotation']}],markedCardId:()=> 'marked-regression'});
vm.runInContext(readerSource.slice(readerSource.indexOf('function relatedStudyPassages('),readerSource.indexOf('function scienceDetails(')),context);
context.markedKind='all';context.markedMatchingPlacements=()=>[{chapter:49,verse:10}];context.markedChoices=r=>[{...r,tag:'T'}];context.markedGroup=()=> 'T';
vm.runInContext(source.slice(source.indexOf('function markedPrimaryRows'),source.indexOf('function renderMarkedContext')),context);
const rendered=context.markedSummary({key:'test',title:'Finding',summary:'Short summary',reasoning:'Reasoned comparison',scope:'Assessment metadata',text:'Detailed evidence',sources:[]});
const expanded=rendered.slice(rendered.indexOf('<div class="comparison-evidence"'),rendered.indexOf('<details class="comparison-details"'));
assert(expanded.indexOf('verse-citation')<expanded.indexOf('Reasoning:'));assert(expanded.includes('Supporting reference'));assert(!expanded.includes('Assessment metadata'));assert(!expanded.includes('Full scripture quotation'));assert(rendered.slice(rendered.indexOf('<details class="comparison-details"')).includes('Assessment metadata'));
console.log('PASS: Marked expansion shows reference chips before reasoning and keeps assessment metadata in Details.');

const linkedCard=context.markedSummary({...data.records.find(r=>r.relatedPassages),key:"related-test"});assert(linkedCard.includes("Related passages"));

// Empty books keep every category visible, ordered by label; selecting one keeps its empty pane.
{
 const box={},cards={};
 const ctx={state:{verseBookmarks:{},verseNotes:{},passageBookmarks:{},passageNotes:{},notes:{}},ENTRIES:[],markedBookSelection:0,markedChapterSelection:0,markedKind:'all',markedData:{records:[]},markedRenderGeneration:0,renderMarkedContext(){},$:s=>s==='#saved-passages'?box:cards,markedRecordVisible:()=>true,markedCommandmentMatches:()=>true,languageTags:{},comparisonTone:x=>x.mode,categoryIcon:()=>'',markedCommandmentTypeChips:()=>'',hydrateMarkedVerseTexts(){},requestAnimationFrame(){},fitContextCitations(){}};
 vm.createContext(ctx);
 vm.runInContext(source.slice(source.indexOf('const MARKED_CATEGORIES='),source.indexOf('function markedChoices')),ctx);
 vm.runInContext(source.slice(source.indexOf('function renderMarkedResults('),source.indexOf('async function renderMarkedWorkspace(')),ctx);
 ctx.renderMarkedResults();
 const labels=[...box.innerHTML.matchAll(/<\/span>([^<]+)<span class="marked-count">0<\/span>/g)].map(m=>m[1]);
 assert.deepEqual(labels,['Academic','Commandments','Contradictions','Marked','Questions','Translation','Violations']);
 assert.equal((box.innerHTML.match(/No results for these filters\./g)||[]).length,7);
 ctx.markedKind='commandments';ctx.renderMarkedResults();
 assert.equal((box.innerHTML.match(/<details /g)||[]).length,1);
 assert(box.innerHTML.includes('Commandments<span class="marked-count">0'));
 console.log('PASS: alphabetical categories and zero-result panes, including a selected empty category.');
}

// Draft availability respects chapter, category, commandment facets and personal marks.
const availability={state:{},ENTRIES:[],markedChoices:(record,placement)=>[{...record,...placement}],visibleComparison:item=>!item.hidden,filterCategory:item=>item.tag||item.mode};
vm.createContext(availability);
vm.runInContext(source.slice(source.indexOf('function markedFilterHasResults'),source.indexOf('function requestMarkedBookData')),availability);
const sample={records:[{mode:'commandments',theme:'Family',commandmentType:'moral',placements:[{chapter:2,verse:1}]}]};
const has=(choice,personal={})=>availability.markedFilterHasResults(sample,{book:0,...choice},personal);
assert(has({kind:'commandments',chapter:2,theme:'Family',type:'moral'}));
assert(!has({kind:'commandments',chapter:1}));assert(!has({kind:'T'}));
assert(!has({kind:'commandments',theme:'Worship of God'}));assert(!has({kind:'commandments',type:'ritual'}));
assert(has({kind:'bookmark',chapter:1},{verseBookmarks:{test:{book:0,chapter:1}}}));
assert(!has({kind:'bookmark',chapter:2},{verseBookmarks:{test:{book:0,chapter:1}}}));
assert(availability.markedFilterHasResults(null,{book:0},{}));
console.log('PASS: zero-result draft filters respect categories, chapters, personal marks and commandment facets; unknown availability stays selectable.');
