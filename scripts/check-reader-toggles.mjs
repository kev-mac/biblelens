import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// Exercise the production renderer and click handler without starting AI Chat.
const source=fs.readFileSync('src/reader.js','utf8');
const panels=new Map();
const context={readingBook:0,readingChapter:1,esc:String,
 $:selector=>({value:selector==='#reader-edition'?'kjv':'science'}),
 document:{getElementById:id=>panels.get(id)},
 reading:{name:'Genesis'},ENTRIES:[],books:[],readRef:()=>null};
vm.createContext(context);
const cacheCode=source.slice(source.indexOf('const comparisonCache='),source.indexOf('function scienceDetails'));
const rendererCode=source.slice(source.indexOf('function comparisonCell('),source.indexOf("document.addEventListener('click'"));
vm.runInContext(cacheCode+'\nfunction refreshVerseHighlights(){} function comparisonCitations(){return "<div class=summary-citations>Citations</div>"} function scienceDetails(){return ""} function alternativeReadings(){return ""}\n'+rendererCode+'\nthis.render=comparisonCell;this.toggle=selectComparison;this.visible=visibleComparison;this.cache=comparisonCache;',context);
for(const mode of ['history','contradictions','science'])context.cache.set(`0:1:kjv:${mode}`,{items:[
 {verse:1,status:'Disagrees',title:mode,summary:mode+' discrepancy',text:'Reason',sources:[]},
 ...(mode==='contradictions'?[]:[{verse:1,status:'Agrees',summary:'Agreement',sources:[]},{verse:1,status:'Context',summary:'Background',sources:[]}])
]});
const initial=context.render(1);
// A saved personal note opens as a comparison summary after loading the page.
context.state={verseBookmarks:{'0:1:14':{book:0,chapter:1,verse:14}},verseNotes:{'0:1:14':{text:'Existing private note'}}};
const savedNote=context.render(14);
assert(savedNote.includes('Existing private note'));
assert(savedNote.includes('id="comparison-panel-14-bookmark" aria-labelledby="comparison-tab-14-bookmark" >'));
context.state.verseNotes['0:1:15']={title:'My own heading',text:'Note without a bookmark'};
const noteOnly=context.render(15);
assert(noteOnly.includes('<h3>My own heading</h3>'));
assert(noteOnly.includes('Note without a bookmark'));
assert(noteOnly.includes('id="comparison-panel-15-bookmark" aria-labelledby="comparison-tab-15-bookmark" >'));
vm.runInContext("comparisonRecordSelections.set('bookmark-0:1:14:bookmark',false)",context);
assert(context.render(14).includes('id="comparison-panel-14-bookmark" aria-labelledby="comparison-tab-14-bookmark" hidden'));
assert.equal((initial.match(/ hidden/g)||[]).length,3);
assert.equal((initial.match(/aria-expanded="true"/g)||[]).length,0);
assert(!initial.includes('Agreement'));assert(!initial.includes('Background'));
for(const mode of ['history','contradictions','science'])assert(initial.includes(`class="agreement comparison-tab ${mode==='contradictions'?mode:'academic'}"`));
const buttons=['history','contradictions','science'].map(mode=>({dataset:{comparisonVerse:'1',comparisonKey:`${mode}-0`},attributes:{},setAttribute(k,v){this.attributes[k]=v;}}));
for(const mode of ['history','contradictions','science'])panels.set(`comparison-panel-1-${mode}-0`,{hidden:true,detailsOpen:true});
context.toggle(buttons[0]);context.toggle(buttons[2]);
assert.equal(panels.get('comparison-panel-1-history-0').hidden,false);
assert.equal(panels.get('comparison-panel-1-science-0').hidden,false);
assert.equal(panels.get('comparison-panel-1-contradictions-0').hidden,true);
context.toggle(buttons[0]);
assert.equal(panels.get('comparison-panel-1-science-0').hidden,false);
assert.equal(panels.get('comparison-panel-1-science-0').detailsOpen,true);
context.toggle(buttons[2]);assert([...panels.values()].every(p=>p.hidden));
assert.equal(buttons[2].attributes['aria-expanded'],'false');
assert.equal(buttons[2].attributes['aria-pressed'],'false');
assert(context.visible({mode:'history',status:'Context',discrepancy:true}));
assert(!context.visible({mode:'science',status:'Agrees',discrepancy:true}));
assert(source.includes('function chapterOptions(){comparisonSelections.clear();'));
context.cache.set('0:1:kjv:contradictions',{items:[{verse:2,status:'Context',tags:['H','G','V','Q'],witness:'Hebrew and Septuagint',title:'Tagged record',summary:'Tagged finding',text:'Limits',sources:[]}]});
const tagged=context.render(2);
assert.equal((tagged.match(/aria-expanded="true"/g)||[]).length,0);
for(const [tag,tone]of [['T','translation'],['V','violation'],['Q','question']]){assert(tagged.includes(`class="agreement comparison-tab ${tone}"`));assert(tagged.includes(`data-icon="${{T:'languages',V:'gavel',Q:'circle-question-mark'}[tag]}"`));const key=`contradictions-0-${tag}`;panels.set(`comparison-panel-2-${key}`,{hidden:true});const button={dataset:{comparisonVerse:'2',comparisonKey:key},setAttribute(){}};context.toggle(button);assert.equal(panels.get(`comparison-panel-2-${key}`).hidden,false);context.toggle(button);assert.equal(panels.get(`comparison-panel-2-${key}`).hidden,true);}
assert(tagged.includes('Hebrew and Septuagint: Tagged finding'));assert(!tagged.includes('>H</button>'));assert(!tagged.includes('>G</button>'));
for(const witness of ['Hebrew','Septuagint','Hebrew and Septuagint','Greek New Testament']){context.cache.set('0:1:kjv:contradictions',{items:[{verse:2,status:'Context',tags:['T'],witness,summary:'Exact unchanged summary',text:'Limits',sources:[]}]});assert(context.render(2).includes(witness+': Exact unchanged summary'));}
assert(initial.includes('data-icon="graduation-cap"'));
vm.runInContext('this.filters=categoryFilters;',context);
context.cache.set('0:1:kjv:contradictions',{items:[{id:'category-q',verse:2,status:'Context',tags:['Q'],summary:'Category fixture',sources:[]}]});
context.filters.delete('Q');const categoryOff=context.render(2);assert(categoryOff.includes('data-icon="circle-question-mark"'));assert(categoryOff.includes('comparison-panel-2-contradictions-0-Q'));assert(categoryOff.includes('aria-expanded="false"'));context.filters.add('Q');assert(context.render(2).includes('aria-expanded="false"'));
console.log('PASS: summaries collapsed by default; category-off retains verse icons; independent toggles, details preservation and chapter reset.');

// Q is a visible Context observation, without fabricating published findings.
assert(context.visible({mode:'science',status:'Context',tags:['Q']}));
context.cache.set('0:1:kjv:science',{items:[{id:'fixture-question',verse:3,placementRole:'context',keyTarget:'Genesis 1:1',status:'Context',tags:['Q'],title:'Fixture question',refs:[],sources:[]}]});
const pointer=context.render(3);assert(!pointer.includes('Context for:'));assert(pointer.includes('data-context-ref="Genesis 1:1"'));assert(!pointer.includes('comparison-panel'));assert(!pointer.includes('<svg'));assert(pointer.includes('context-tag'));assert(pointer.includes('class="context-tags"'));assert(pointer.includes('Unanswered question'));
const css=fs.readFileSync('src/style.css','utf8');assert(css.includes('.agreement.question,body.dark .agreement.question'));assert(css.includes('[data-tone="question"]'));
const html=fs.readFileSync('src/index.html','utf8');
assert(html.indexOf('id="theme"')>html.indexOf('id="reader-settings"'),'Theme control belongs inside Reader settings');
assert(css.includes('.comparison-dock{position:sticky'),'Comparison filters must remain joined below the sticky header');
assert(css.includes('border-bottom:1px solid var(--line)'),'Read divider belongs below the comparison filters');
assert(css.includes('border:1px solid var(--green)!important')&&css.includes('border-color:var(--brand-accent)!important'),'Inactive filter icons need thin blue borders and active icons need burnt-orange borders');
assert(html.includes('id="comparison-dock-toggle"')&&source.includes("classList.toggle('collapsed')"),'Comparison categories need a chevron show/hide control');
assert(css.includes('.filter-icon{width:42px;height:42px;flex:0 0 42px;aspect-ratio:1}'),'Mobile comparison icons should be larger and remain round');
assert(css.includes('.comparison-status{margin-top:0}'),'Mobile comparison tray must join the menu without a gap');
assert(css.includes('.verse-comparison[data-tone="translation"]{--summary-tint:#ebe0f5;--summary-ink:#50356c}'),'Translation summaries must use the translation icon palette');
assert(css.includes('.reader-picker.chapter-round{background:transparent;border:0;border-radius:0}'),'Settings cog should not have an outside circle');
console.log('PASS: Q tag, accessible label, initially hidden summary, independent on/off, Context pointer and light/dark colors.');

context.cache.set('0:1:kjv:science',{items:[]});
context.cache.set('0:1:kjv:questions',{items:[{id:'fixture-questions-category',verse:3,status:'Context',tags:['Q'],title:'Fixture unanswered question',summary:'Fixture only',text:'Limits',sources:[],placementRole:'key'},{id:'fixture-questions-category',verse:5,status:'Context',tags:['Q'],title:'Fixture unanswered question',keyTarget:'Genesis 1:3',placementRole:'context'}]});
const qCard=context.render(3);assert(qCard.includes('Fixture unanswered question'));assert(qCard.includes('comparison-panel-3-questions-0-Q'));assert(qCard.includes('aria-expanded="false"'));assert(context.render(5).includes('data-context-ref="Genesis 1:3"'));assert(!context.render(5).includes('Context for:'));assert(source.includes("comparisonModes=['history','contradictions','science','questions']"));
console.log('PASS: independent Questions category participates in reader loading and Q card/context rendering.');

context.cache.set('0:1:kjv:contradictions',{items:[{id:'fixture-targeted-greek',verse:6,status:'Textual conflict',tags:['G'],activeTags:[],title:'Fixture KJV contrast',summary:'Fixture only',text:'Limits',sources:[]}]});const untargeted=context.render(6);assert(untargeted.includes('data-icon="fold-horizontal"'));assert(!untargeted.includes('>G</button>'));
console.log('PASS: language tag placements retain KJV contrast card without implying Greek discrepancy on the wrong side.');
// Verify the production A+ handler and persistent scale without changing page content.
const fontNode={attrs:{},setAttribute(k,v){this.attrs[k]=v;}};
const scaleValues=new Map();const fontContext={state:{},$:()=>fontNode,document:{documentElement:{style:{setProperty:(k,v)=>scaleValues.set(k,v)}}},persist(){scaleValues.set('saved',true);}};
vm.createContext(fontContext);
vm.runInContext(source.slice(source.indexOf('function applyTextSize(){'),source.indexOf('applyTextSize();',source.indexOf("$('#reader-font').onclick="))+ 'applyTextSize();'.length)+ 'persist();}; applyTextSize();',fontContext);
assert.equal(scaleValues.get('--text-scale'),'1');
for(const expected of [1.1,1.2,1.3,0.9,1]){fontNode.onclick();assert.equal(scaleValues.get('--text-scale'),String(expected));assert.equal(fontContext.state.textScale,expected);assert(fontNode.attrs['aria-label'].includes('all text'));}
fontContext.state.textScale=1.2;fontContext.applyTextSize();assert.equal(scaleValues.get('--text-scale'),'1.2');
const typography=fs.readFileSync('src/style.css','utf8');const declarations=typography.match(/(?<![\w-])font(?:-size)?\s*:[^;}]+/g)||[];assert(declarations.filter(d=>d.includes('px')).every(d=>d==='font-size:calc(16px * var(--text-scale,1))'));assert(typography.includes('var(--chapter-size,1.1875rem)'));
console.log('PASS: A+ scales all typography, cycles sizes, saves preference and preserves smaller summaries.');

const statusNode={};context.$=selector=>selector==='#comparison-status'?statusNode:{value:selector==='#reader-edition'?'kjv':'on'};
context.cache.clear();for(const mode of ['history','contradictions','science','questions'])context.cache.set(`0:1:kjv:${mode}`,{status:'ready',items:[]});
context.cache.set('0:1:kjv:questions',{status:'ready',items:[{id:'context-only',verse:1,placementRole:'context',tags:['Q'],status:'Context'}]});
vm.runInContext(source.slice(source.indexOf('function comparisonStatus('),source.indexOf('async function ensureComparisons(')),context);context.comparisonStatus();
const qFilter=statusNode.innerHTML.match(/<button[^>]*data-category-filter="Q"[\s\S]*?<\/button>/)[0];assert(!qFilter.includes('filter-badge'));assert(!qFilter.includes('disabled'));assert(qFilter.includes('aria-pressed="true"'));
context.cache.set('0:1:kjv:questions',{status:'ready',items:[{id:'key-one',verse:1,placementRole:'key',tags:['Q'],status:'Context'},{id:'key-one',verse:2,placementRole:'key',tags:['Q'],status:'Context'},{id:'context-only',verse:3,placementRole:'context',tags:['Q'],status:'Context'}]});context.comparisonStatus();assert(statusNode.innerHTML.includes('Question: 1 summaries'));
console.log('PASS: badges count distinct summary records only; context-only categories remain available without a badge.');

// Temporary selection survives reader rerenders, but never view changes or reload.
const selectionContext={selectedVerses:new Set([9,2,4]),reading:{},renderReader(){},window:{addEventListener(type,listener){this[type]=listener;}}};
vm.createContext(selectionContext);
vm.runInContext(source.slice(source.indexOf('function selectedVerseNumbers('),source.indexOf('let conversationTone=')),selectionContext);
assert.deepEqual(Array.from(selectionContext.selectedVerseNumbers()),[2,4,9]);
selectionContext.window.viewchange({detail:'explore'});assert.equal(selectionContext.selectedVerses.size,3);
selectionContext.window.viewchange({detail:'chat'});assert.equal(selectionContext.selectedVerses.size,0);
const chapterLoader=source.slice(source.indexOf('async function loadChapter('),source.indexOf('const comparisonCache='));
assert(!chapterLoader.includes('selectedVerses.add('),'Opening a verse URL must scroll without restoring selection');
const settingsTarget={append(node){this.child=node;}},actions={};
const toolbar={querySelector:selector=>{assert.equal(selector,'.reader-actions');return actions;}};
const settingNodes=new Map();
const settingsContext={state:{},persist(){},document:{body:{classList:{toggle(){}}}},$:selector=>{if(selector==='#reader-settings-controls')return settingsTarget;if(!settingNodes.has(selector))settingNodes.set(selector,{});return settingNodes.get(selector);},readerToolbar:toolbar};
vm.createContext(settingsContext);
vm.runInContext(source.slice(source.indexOf('function placeReaderControls('),source.indexOf("$('#reader-picker').onclick=")),settingsContext);
assert.equal(settingsTarget.child,actions);
assert.equal(settingNodes.get('#book-picker-position').value,'floating');
settingNodes.get('#book-picker-position').onchange({target:{value:'fixed'}});
assert.equal(settingsContext.state.bookPickerPosition,'fixed');
console.log('PASS: Settings contains appearance controls only; floating book picker is the default and its fixed preference persists.');
