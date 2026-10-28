import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import worker from './built-worker.mjs';
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
assert(!source.includes('data-marked-record='));assert(source.includes('class="marked-category-pane" data-tone='));assert(!source.includes('class="marked-category-pane" open'));assert(source.includes('${markedPrimaryRows(primary,choice)}${comparisonReasoning(record)'));

const groups=new Map();context.categoryRank=item=>['bookmark','T','V','commandments','Q','academic','contradictions'].indexOf(context.filterCategory(item));vm.runInContext(source.slice(source.indexOf('function markedGroup'),source.indexOf('function markedSummary')),context);context.markedKind='all';for(const record of data.records.filter(r=>context.markedRecordVisible(r)&&context.markedMatchingPlacements(r).length)){const group=context.markedGroup(record);assert(['T','V','commandments','Q','academic','contradictions'].includes(group));groups.set(record.key,group);}assert(groups.size>0);
console.log('PASS: book-scoped comparison retrieval, one row per verse/comparison, canonical verse text, invalid filters, chapter/category filtering and collapsible category groups without comparison icons.');

const actualPrimaryReferences=context.markedPrimaryReferences;
// Expanded cards quote primary passages before reasoning and place secondary references after it.
Object.assign(context,{markedBookSelection:0,books:[{name:'Genesis'}],languageTags:{T:{}},comparisonTone:()=> 'translation',comparisonEvidenceOpen:new Set(),esc:s=>String(s),summaryText:r=>r.summary,comparisonReasoning:r=>r.reasoning,referenceLink:r=>`<a class="verse-citation">${r.label}</a>`,commandmentLabels:()=>'',commandmentRepetitions:()=>'',roleCitations:()=>'<div class="context-citations">Supporting reference</div>',scienceDetails:()=>'',markedPrimaryReferences:()=>[{label:'Genesis 49:10',quotes:['Full scripture quotation']}],markedCardId:()=> 'marked-regression'});
vm.runInContext(readerSource.slice(readerSource.indexOf('function relatedStudyPassages('),readerSource.indexOf('function scienceDetails(')),context);
context.markedKind='all';context.markedMatchingPlacements=()=>[{chapter:49,verse:10}];context.markedChoices=r=>[{...r,tag:'T'}];context.markedGroup=()=> 'V';
vm.runInContext(source.slice(source.indexOf('function markedPrimaryRows'),source.indexOf('function renderMarkedContext')),context);
// Prose links preserve chapter/range navigation and escape user-facing text.
context.books=[{name:'Genesis',chapters:50}];
context.esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
assert.equal(context.markedInlineScriptureLinks('Genesis 2:5–9'),'<a class="comparison-inline-reference" href="#read/0/2/5-9">Genesis 2:5–9</a>');
assert(context.markedInlineScriptureLinks('Genesis 1 and Genesis').includes('href="#read/0/1"'));
assert.equal(context.markedInlineScriptureLinks('<b>Genesis 51</b>'),'&lt;b&gt;Genesis 51&lt;/b&gt;');
assert.equal(context.markedInlineScriptureLinks('Genesis 2:9–5'),'Genesis 2:9–5');
const rendered=context.markedSummary({key:'test',title:'Finding',summary:'Short summary',reasoning:'Reasoned comparison',scope:'Assessment metadata',text:'Detailed evidence',sources:[]});
const expanded=rendered.slice(rendered.indexOf('<div class="comparison-evidence"'),rendered.indexOf('<details class="comparison-details"'));
assert(expanded.indexOf('verse-citation')<expanded.indexOf('Reasoning:'));assert(expanded.includes('Supporting reference'));assert(!expanded.includes('Assessment metadata'));assert(expanded.includes('<q>Full scripture quotation</q>'));assert(expanded.indexOf('Reasoning:')<expanded.indexOf('Supporting reference'));assert(rendered.slice(rendered.indexOf('<details class="comparison-details"')).includes('Assessment metadata'));
console.log('PASS: Marked expansion quotes primary passages, puts secondary references below reasoning and keeps assessment metadata in Details.');
// The selected Genesis card uses its key passage, rather than promoting context links.
context.markedPrimaryReferences=actualPrimaryReferences;
context.readRef=label=>{const match=/^Genesis (\d+):(\d+)/.exec(label);return match?{book:0,chapter:+match[1],verse:+match[2]}:null;};
context.comparisonSides=item=>item.sides||[];
vm.runInContext(readerSource.slice(readerSource.indexOf('function contextRanges('),readerSource.indexOf('function fitContextCitations(')),context);
const celestial=data.records.find(record=>record.id==='genesis-1-celestial-sequence');
const primary=context.markedPrimaryReferences(celestial);
assert.deepEqual(Array.from(primary,ref=>ref.label),['Genesis 1:14']);
assert.equal(primary[0].quotes[0],data.verses['1:14'].kjv);
const celestialCard=context.markedSummary(celestial);
assert(celestialCard.includes('<q>'+data.verses['1:14'].kjv+'</q>'));
assert(celestialCard.includes('Genesis 1:11–13'));assert(celestialCard.includes('Genesis 1:15–19'));
assert(celestialCard.indexOf('Reasoning:')<celestialCard.indexOf('Secondary References'));
const emptySecondary=context.roleCitations({ref:'Genesis 1:14',refs:[],sides:[{ref:'Genesis 1:14'}]});assert.equal(emptySecondary,'');


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
 assert.deepEqual(labels,['Academic','Commandments','Contradictions','Marked','People','Prophecies','Questions','Stories','Translation','Violations']);
 assert.equal((box.innerHTML.match(/No results for these filters\./g)||[]).length,10);
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

// Questions retain evidence and scope in People-style, initially closed sections.
const question=context.markedCategoryProfileCard({summary:'Genesis 1 leaves a question open.',text:'Quoted evidence',scope:'Interpretation limits',sources:[{url:'https://example.com/source',label:'Edition source'}],reasoning:'Reasoned comparison'}, {}, 'question-test', 'A question?', [{label:'Genesis 1:3',quotes:['Let there be light']}], '<div>Secondary References</div>');
assert(question.includes('category-profile-card'));
assert.equal((question.match(/data-category-section aria-expanded="false"/g)||[]).length,2);
assert(question.includes('id="question-test-verses" aria-labelledby="question-test-verses-toggle" hidden'));
assert(question.includes('id="question-test-reasoning" aria-labelledby="question-test-reasoning-toggle" hidden'));
assert(question.includes('Let there be light'));assert(question.includes('Secondary References'));
assert(question.includes('Interpretation limits'));assert(question.includes('Edition source'));
assert(!question.includes('data-summary-toggle'));
console.log('PASS: Questions profile cards preserve quotations, secondary references, reasoning, scope and sources in initially closed sections.');

context.books=JSON.parse(fs.readFileSync('data/books.json','utf8'));
assert.equal(context.markedInlineScriptureLinks('Psalm 148:4'),'<a class="comparison-inline-reference" href="#read/18/148/4">Psalm 148:4</a>');
assert.equal(context.markedInlineScriptureLinks('Psalms 104:6–9'),'<a class="comparison-inline-reference" href="#read/18/104/6-9">Psalms 104:6–9</a>');
console.log('PASS: singular Psalm and plural Psalms references link to the same canonical book.');
