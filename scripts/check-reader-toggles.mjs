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
vm.createContext(context);const noteSource=fs.readFileSync('src/passage.js','utf8');vm.runInContext(noteSource.slice(noteSource.indexOf('function noteActionButtons('),noteSource.indexOf('function deletePersonalNote(')),context);
const cacheCode=source.slice(source.indexOf('const comparisonCache='),source.indexOf('function scienceDetails'));
const rendererCode=source.slice(source.indexOf('function comparisonCell('),source.indexOf("document.addEventListener('click'"));
vm.runInContext(cacheCode+'\nfunction refreshVerseHighlights(){} function comparisonCitations(){return "<div class=summary-citations>Citations</div>"} function scienceDetails(){return ""} function alternativeReadings(){return ""}\n'+rendererCode+'\nthis.render=comparisonCell;this.toggle=selectComparison;this.visible=visibleComparison;this.cache=comparisonCache;',context);
for(const mode of ['history','contradictions','science'])context.cache.set(`0:1:kjv:${mode}`,{items:[
 {verse:1,status:'Disagrees',title:mode,summary:mode+' discrepancy',text:'Reason',sources:[]},
 ...(mode==='contradictions'?[]:[{verse:1,status:'Agrees',summary:mode+' Agreement',sources:[]},{verse:1,status:'Context',summary:mode+' Background',sources:[]}])
]});
assert.equal(context.render(176),'');
const initial=context.render(1);
// Multiple records share one category button while keeping every summary available.
context.cache.set('0:1:kjv:contradictions',{items:[
 {id:'group-first',verse:60,placementRole:'key',status:'Disagrees',summary:'First grouped summary',sources:[]},
 {id:'group-second',verse:60,status:'Disagrees',summary:'Second grouped summary',sources:[]}
]});
const grouped=context.render(60);
assert.equal((grouped.match(/data-comparison-category="contradictions"/g)||[]).length,1);
assert(grouped.includes('First grouped summary'));assert(grouped.includes('Second grouped summary'));
assert(grouped.includes('aria-controls="comparison-panel-60-contradictions-0 comparison-panel-60-contradictions-1"'));
let groupedRenders=0;context.renderReader=()=>groupedRenders++;
const groupButton={dataset:{comparisonRecords:JSON.stringify(['group-first:contradictions','group-second:contradictions']),comparisonCategory:'contradictions'},getAttribute:()=> 'false'};
context.toggle(groupButton);assert.equal((context.render(60).match(/class="verse-comparison comparison-panel"[^>]* hidden/g)||[]).length,0);
groupButton.getAttribute=()=> 'true';context.toggle(groupButton);
assert.equal((context.render(60).match(/class="verse-comparison comparison-panel"[^>]* hidden/g)||[]).length,2);
assert.equal(groupedRenders,2);
// Restore the existing fixtures used below.
context.cache.set('0:1:kjv:contradictions',{items:[{verse:1,status:'Disagrees',title:'contradictions',summary:'contradictions discrepancy',text:'Reason',sources:[]}]});
console.log('PASS: one category icon controls all summaries across mixed placement roles.');
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
assert.equal((initial.match(/aria-labelledby="comparison-tab-[^"]+" hidden/g)||[]).length,5);
assert.equal((initial.match(/aria-expanded="true"/g)||[]).length,0);
assert.equal((initial.match(/class="comparison-evidence"[^>]* hidden/g)||[]).length,5);assert(initial.indexOf('comparison-summary')<initial.indexOf('comparison-evidence'));assert(initial.includes('data-comparison-inspect'));assert(initial.includes('science Agreement'));assert(initial.includes('science Background'));assert(!initial.includes('history Agreement'));assert(!initial.includes('history Background'));
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
for(const status of ['Agrees','Context','Disagrees'])assert(context.visible({mode:'science',status}),status+' Science must be available under Academic');
assert(!context.visible({mode:'history',status:'Agrees',discrepancy:true}));
assert(!context.visible({mode:'history',status:'Context'}));
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
context.filters.delete('Q');assert.equal(context.render(3),'');context.filters.add('Q');
const pointer=context.render(3);assert(!pointer.includes('Context for:'));assert(pointer.includes('data-context-local="false"'));assert(pointer.includes('aria-disabled="true"'));context.readRef=()=>({book:0,chapter:1,verse:1});const local=context.render(3);assert(local.includes('data-context-jump="1"'));assert(local.includes('data-context-local="true"'));context.readRef=()=>null;assert(!pointer.includes('comparison-panel'));assert(!pointer.includes('<svg'));assert(pointer.includes('context-tag'));assert(pointer.includes('class="context-tags"'));assert(pointer.includes('Questions'));
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
const qCard=context.render(3);assert(qCard.includes('Fixture unanswered question'));assert(qCard.includes('comparison-panel-3-questions-0-Q'));assert(qCard.includes('aria-expanded="false"'));assert(context.render(5).includes('data-context-local="false"'));assert(!context.render(5).includes('Context for:'));assert(source.includes("comparisonModes=['history','contradictions','science','questions']"));
console.log('PASS: independent Questions category participates in reader loading and Q card/context rendering.');

context.cache.set('0:1:kjv:contradictions',{items:[{id:'fixture-targeted-greek',verse:6,status:'Textual conflict',tags:['G'],activeTags:[],title:'Fixture KJV contrast',summary:'Fixture only',text:'Limits',sources:[]}]});const untargeted=context.render(6);assert(untargeted.includes('data-icon="fold-horizontal"'));assert(!untargeted.includes('>G</button>'));
console.log('PASS: language tag placements retain KJV contrast card without implying Greek discrepancy on the wrong side.');
// Verify the production range input, proportional scale and saved preference.
const fontNode={attrs:{},setAttribute(k,v){this.attrs[k]=v;}},fontOutput={};
const scaleValues=new Map();const fontContext={state:{},$:s=>s==='#reader-font-value'?fontOutput:fontNode,document:{documentElement:{style:{setProperty:(k,v)=>scaleValues.set(k,v)}}},persist(){scaleValues.set('saved',true);}};
vm.createContext(fontContext);
vm.runInContext(source.slice(source.indexOf('function applyTextSize(){'),source.indexOf("$('#clear-selection').onclick")),fontContext);
assert.equal(scaleValues.get('--text-scale'),'1');assert.equal(fontOutput.textContent,'100%');
for(const percent of [85,95,100,115,130,150]){fontNode.oninput({target:{value:String(percent)}});assert.equal(scaleValues.get('--text-scale'),String(percent/100));assert.equal(fontContext.state.textScale,percent/100);assert.equal(fontOutput.textContent,percent+'%');assert.equal(fontNode.attrs['aria-valuetext'],percent+' percent');}
fontNode.onchange();assert(scaleValues.get('saved'));
fontContext.state.textScale=Infinity;fontContext.applyTextSize();assert.equal(scaleValues.get('--text-scale'),'1');
assert(html.includes('id="reader-font" type="range"'));
console.log('PASS: text-size slider scales live from 85 to 150 percent, labels values and persists on change.');

const statusNode={};context.$=selector=>selector==='#comparison-status'?statusNode:{value:selector==='#reader-edition'?'kjv':'on'};
context.cache.clear();for(const mode of ['history','contradictions','science','questions'])context.cache.set(`0:1:kjv:${mode}`,{status:'ready',items:[]});
context.cache.set('0:1:kjv:questions',{status:'ready',items:[{id:'context-only',verse:1,placementRole:'context',tags:['Q'],status:'Context'}]});
vm.runInContext(source.slice(source.indexOf('function comparisonStatus('),source.indexOf('async function ensureComparisons(')),context);context.comparisonStatus();
const qFilter=statusNode.innerHTML.match(/<button[^>]*data-category-filter="Q"[\s\S]*?<\/button>/)[0];assert(!qFilter.includes('filter-badge'));assert(qFilter.includes('disabled'));assert(qFilter.includes('data-brightness="empty"'));assert(qFilter.includes('aria-pressed="false"'));
context.cache.set('0:1:kjv:questions',{status:'ready',items:[{id:'key-one',verse:1,placementRole:'key',tags:['Q'],status:'Context'},{id:'key-one',verse:2,placementRole:'key',tags:['Q'],status:'Context'},{id:'context-only',verse:3,placementRole:'context',tags:['Q'],status:'Context'}]});context.comparisonStatus();assert(statusNode.innerHTML.includes('Questions: 1 summaries'));
context.reading.verses=[{n:1},{n:2},{n:3}];context.comparisonStatus();assert(statusNode.innerHTML.includes('data-brightness="empty"'));
vm.runInContext("categoryFilters.add('Q');comparisonRecordSelections.set('key-one:Q',true)",context);context.comparisonStatus();assert(statusNode.innerHTML.match(/data-category-filter="Q"[^>]*data-brightness="open"/));
vm.runInContext("comparisonRecordSelections.set('key-one:Q',false)",context);context.comparisonStatus();assert(statusNode.innerHTML.match(/data-category-filter="Q"[^>]*data-brightness="open"/));
let visited=[];context.renderReader=()=>{};context.fitChatCitations=()=>{};context.requestAnimationFrame=fn=>fn();panels.set('verse-1',{scrollIntoView(){visited.push(1);}});panels.set('verse-2',{scrollIntoView(){visited.push(2);}});context.visitCategoryVerse('Q');context.visitCategoryVerse('Q');context.visitCategoryVerse('Q');assert.deepEqual(visited,[1,2,1]);context.visitCategoryVerse('T');assert.deepEqual(visited,[1,2,1]);
console.log('PASS: active categories cycle through matching verses; empty categories do nothing; context-only categories stay off.');

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
const pointerHandlers={},positionStyles=new Map(),bodyClasses=new Set();let positionSaves=0;
const settingsContext={state:{},persist(){positionSaves++;},Date,window:{innerWidth:414,innerHeight:810,addEventListener(){}},document:{addEventListener(type,fn,options){pointerHandlers[type+(options?.capture?':capture':'')]=fn;},body:{style:{setProperty(k,v){positionStyles.set(k,v);},removeProperty(k){positionStyles.delete(k);}},classList:{toggle(k,on){if(on)bodyClasses.add(k);else bodyClasses.delete(k);},contains(k){return bodyClasses.has(k);}}}},$:selector=>{if(selector==='#reader-settings-controls')return settingsTarget;if(!settingNodes.has(selector))settingNodes.set(selector,{});return settingNodes.get(selector);},readerToolbar:toolbar};
vm.createContext(settingsContext);
vm.runInContext(source.slice(source.indexOf('function placeReaderControls('),source.indexOf("$('#reader-picker').onclick=")),settingsContext);
assert.equal(settingsTarget.child,actions);
assert.equal(settingNodes.get('#book-picker-position').value,'floating');
settingNodes.get('#book-picker-position').onchange({target:{value:'fixed'}});
assert.equal(settingsContext.state.bookPickerPosition,'fixed');
console.log('PASS: Settings contains appearance controls only; floating book picker is the default and its fixed preference persists.');
settingNodes.get('#book-picker-position').onchange({target:{value:'floating'}});
const floatButton={getBoundingClientRect:()=>({left:336,top:612}),setPointerCapture(){},classList:{add(){},remove(){}}};
const dragPointer={target:{closest:()=>floatButton},pointerId:1,isPrimary:true,button:0,clientX:365,clientY:641,preventDefault(){}};
const beforeDrag=positionSaves;pointerHandlers.pointerdown(dragPointer);pointerHandlers.pointermove({...dragPointer,clientX:367});pointerHandlers.pointerup(dragPointer);assert.equal(positionSaves,beforeDrag,'A tap must not save a drag position');
pointerHandlers.pointerdown(dragPointer);pointerHandlers.pointermove({...dragPointer,clientX:82,clientY:480});pointerHandlers.pointerup(dragPointer);
assert.equal(positionSaves,beforeDrag+1);assert.equal(positionStyles.get('--book-picker-left'),'53px');assert.equal(positionStyles.get('--book-picker-top'),'451px');
let clickSuppressed=false;pointerHandlers['click:capture']({...dragPointer,stopImmediatePropagation(){clickSuppressed=true;}});assert(clickSuppressed,'Finishing a drag must not open the picker');
settingsContext.window.innerWidth=320;settingsContext.window.innerHeight=480;settingsContext.positionBookPicker();assert(parseFloat(positionStyles.get('--book-picker-left'))<=254);assert(parseFloat(positionStyles.get('--book-picker-top'))<=414);
const savedAnchor=JSON.stringify(settingsContext.state.bookPickerAnchor);pointerHandlers.pointerdown(dragPointer);pointerHandlers.pointermove({...dragPointer,clientX:-900,clientY:-900});pointerHandlers.pointercancel({...dragPointer,type:'pointercancel'});assert.equal(JSON.stringify(settingsContext.state.bookPickerAnchor),savedAnchor,'Cancellation must preserve the saved position');
console.log('PASS: floating control ignores tap jitter, saves drag positions, suppresses post-drag clicks, clamps after resize and preserves position on cancellation.');


// Legacy cards use their stored explanation when they predate the reasoning field.
assert.equal(context.comparisonReasoning({text:'Existing explanation'}),'Existing explanation');
assert.equal(context.comparisonReasoning({reasoning:'Specific reasoning',text:'Full source text'}),'Specific reasoning');
assert.equal(context.comparisonReasoning({scope:'Existing assessment'}),'Existing assessment');
context.cache.clear();context.cache.set('0:1:kjv:contradictions',{items:[{id:'legacy-evidence',verse:20,title:'Legacy card',summary:'Short summary',text:'Stored explanation',refs:[{book:0,chapter:2,verse:19,label:'Genesis 2:19'}],sources:[]}]});
vm.runInContext("comparisonEvidenceOpen.add('0:1:20:contradictions-0')",context);
vm.runInContext(source.slice(source.indexOf('function citationButton('),source.indexOf('function scriptureHtml(')),context);
const expanded=context.render(20);assert(expanded.includes('<b>Reasoning:</b> Stored explanation'));assert(expanded.includes('Genesis 2:19'));assert(expanded.includes('id="comparison-evidence-20-contradictions-0" >'));
assert(context.render(20).includes('id="comparison-evidence-20-contradictions-0" >'),'Evidence expansion survives rerendering');
console.log('PASS: legacy reasoning fallback, citation rendering and retained evidence expansion.');
// Exercise touch double-taps and keyboard disclosure with the production handlers.
const disclosureHandlers={};
const detailDialog={className:'',setAttribute(){},addEventListener(){}};
context.document={createElement:()=>detailDialog,body:{append(){}},querySelectorAll:()=>[],addEventListener:(type,fn)=>disclosureHandlers[type]=fn};
vm.runInContext(source.slice(source.indexOf('// Summary evidence stays'),source.indexOf('// Reveal the full category icon row')),context);
const disclosureControl={attrs:{},setAttribute(k,v){this.attrs[k]=v;}};
const evidence={hidden:true},summary={dataset:{evidenceKey:'touch-fixture'},attrs:{},querySelector:s=>s==='.comparison-evidence'?evidence:disclosureControl,setAttribute(k,v){this.attrs[k]=v;},matches:()=>true};
const touchTarget={closest:s=>s==='button,a'?null:summary};
const touch={pointerType:'touch',target:touchTarget,clientX:50,clientY:60};
for(let i=0;i<2;i++){disclosureHandlers.pointerdown(touch);disclosureHandlers.pointerup(touch);}
assert(!evidence.hidden);assert.equal(summary.attrs['aria-expanded'],'true');
disclosureHandlers.dblclick({target:touchTarget,preventDefault(){}});assert(!evidence.hidden,'A synthesized dblclick must not undo the touch expansion');
disclosureHandlers.keydown({key:'Enter',target:summary,preventDefault(){}});assert(evidence.hidden);
console.log('PASS: touch double-tap expands once, synthetic dblclick is deduplicated, and keyboard collapses evidence.');

const expandButton={closest:()=>summary};
disclosureHandlers.click({target:{closest:s=>s==='[data-summary-expand]'?expandButton:null}});
assert(!evidence.hidden);assert.equal(summary.attrs['aria-expanded'],'true');
assert(initial.includes('class="summary-expand"'));assert(!initial.includes('${esc(evidenceKey'));assert(initial.includes('data-evidence-key="0:1:1:history-0"'));assert(expanded.includes('aria-expanded="true"'));assert(initial.includes('aria-label="Expand references and reasoning"'));
console.log('PASS: centered disclosure button expands references and reasoning.');

assert(expanded.indexOf('summary-reasoning')<expanded.indexOf('class="summary-citations"'),'Secondary references follow the reasoning');

assert.equal(disclosureControl.attrs['aria-label'],'Collapse references and reasoning');assert.equal(disclosureControl.attrs['aria-expanded'],'true');
assert(expanded.indexOf('comparison-summary')<expanded.indexOf('<h3>Legacy card</h3>'));

// Font settings are independent and accept only the bundled or system families.
const fontNodes=new Map(),fontProperties=new Map();let fontSaves=0;
const fontsContext={readerPreferences:{verseFont:'invalid',categoryFont:'georgia'},state:{},persist:()=>fontSaves++,document:{documentElement:{style:{setProperty:(key,value)=>fontProperties.set(key,value)}}},$:id=>{if(!fontNodes.has(id))fontNodes.set(id,{});return fontNodes.get(id)}};vm.createContext(fontsContext);
vm.runInContext(source.slice(source.indexOf('const READER_FONTS='),source.indexOf('function applyTextSize(')),fontsContext);
assert.equal(fontNodes.get('#verse-font-family').value,'inter');assert.equal(fontNodes.get('#category-font-family').value,'georgia');
fontNodes.get('#verse-font-family').onchange({target:{value:'lora'}});assert.equal(fontsContext.readerPreferences.verseFont,'lora');assert.equal(fontsContext.readerPreferences.categoryFont,'georgia');assert.equal(fontSaves,1);assert(fontProperties.get('--verse-font-family').includes('Lora'));assert(fontProperties.get('--category-font-family').includes('Georgia'));
console.log('PASS: independent verse/category fonts, safe fallback and persisted preferences.');

// Legacy stored H/G codes keep distinct display groups and toggle independently.
vm.runInContext("this.tags=recordTags;this.group=filterCategory;this.languageLabels=languageTags",context);
assert.deepEqual(Array.from(context.tags({tags:['H','G']})),['H','G']);
assert.equal(context.group({tag:'H'}),'academic');assert.equal(context.group({tag:'G'}),'T');
assert.equal(context.languageLabels.H.label,'Academic');assert.equal(context.languageLabels.G.label,'Translation');assert.equal(context.languageLabels.Q.label,'Questions');
context.cache.clear();for(const mode of ['history','contradictions','science','questions'])context.cache.set(`0:1:kjv:${mode}`,{status:'ready',items:[]});
context.cache.set('0:1:kjv:contradictions',{status:'ready',items:[{id:'dual-language-fixture',verse:1,placementRole:'key',tags:['H','G'],status:'Context',title:'Dual-language fixture',summary:'Fixture only',text:'Limits',sources:[]}]});
vm.runInContext("categoryFilters.add('academic');categoryFilters.add('T')",context);
const dual=context.render(1);assert(dual.includes('data-comparison-record="dual-language-fixture:H"'));assert(dual.includes('data-comparison-record="dual-language-fixture:G"'));assert(dual.includes('aria-label="Academic'));assert(dual.includes('aria-label="Translation'));
context.comparisonStatus();assert(statusNode.innerHTML.includes('Academic: 1 summaries'));assert(statusNode.innerHTML.includes('Translation: 1 summaries'));
vm.runInContext("comparisonRecordSelections.set('dual-language-fixture:H',true);comparisonRecordSelections.set('dual-language-fixture:G',false)",context);
const onlyH=context.render(1);assert(onlyH.includes('comparison-panel-1-contradictions-0-H" aria-labelledby="comparison-tab-1-contradictions-0-H" >'));assert(onlyH.includes('comparison-panel-1-contradictions-0-G" aria-labelledby="comparison-tab-1-contradictions-0-G" hidden'));
console.log('PASS: H/G codes retained; Academic/Translation cards and independent toggle groups; Q display name.');
