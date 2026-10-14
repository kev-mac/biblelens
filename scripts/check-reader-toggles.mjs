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
assert.equal((initial.match(/ hidden/g)||[]).length,3);
assert.equal((initial.match(/aria-expanded="false"/g)||[]).length,3);
assert(!initial.includes('Agreement'));assert(!initial.includes('Background'));
for(const mode of ['history','contradictions','science'])assert(initial.includes(`class="agreement comparison-tab ${mode}"`));
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
assert.equal((tagged.match(/aria-expanded="false"/g)||[]).length,3);
for(const [tag,tone]of [['T','translation'],['V','violation'],['Q','question']]){assert(tagged.includes(`class="agreement comparison-tab ${tone}"`));assert(tagged.includes(`data-icon="${{T:'languages',V:'gavel',Q:'circle-question-mark'}[tag]}"`));const key=`contradictions-0-${tag}`;panels.set(`comparison-panel-2-${key}`,{hidden:true});const button={dataset:{comparisonVerse:'2',comparisonKey:key},setAttribute(){}};context.toggle(button);assert.equal(panels.get(`comparison-panel-2-${key}`).hidden,false);context.toggle(button);assert.equal(panels.get(`comparison-panel-2-${key}`).hidden,true);}
assert(tagged.includes('Hebrew and Septuagint: Tagged finding'));assert(!tagged.includes('>H</button>'));assert(!tagged.includes('>G</button>'));
for(const witness of ['Hebrew','Septuagint','Hebrew and Septuagint','Greek New Testament']){context.cache.set('0:1:kjv:contradictions',{items:[{verse:2,status:'Context',tags:['T'],witness,summary:'Exact unchanged summary',text:'Limits',sources:[]}]});assert(context.render(2).includes(witness+': Exact unchanged summary'));}
assert(initial.includes('data-icon="history"'));
console.log('PASS: initially closed; independent one/multiple/none toggles; agreements/background hidden; category colors; details preserved; chapter reset.');

// Q is a visible Context observation, without fabricating published findings.
assert(context.visible({mode:'science',status:'Context',tags:['Q']}));
context.cache.set('0:1:kjv:science',{items:[{id:'fixture-question',verse:3,placementRole:'context',keyTarget:'Genesis 1:1',status:'Context',tags:['Q'],title:'Fixture question',refs:[],sources:[]}]});
const pointer=context.render(3);assert(pointer.includes('Context for:'));assert(!pointer.includes('<svg'));assert(pointer.includes('context-tag'));assert(pointer.includes('class="context-tags"'));assert(pointer.includes('Unanswered question'));
const css=fs.readFileSync('src/style.css','utf8');assert(css.includes('.agreement.question,body.dark .agreement.question'));assert(css.includes('[data-tone="question"]'));
const html=fs.readFileSync('src/index.html','utf8');
assert(html.indexOf('id="theme"')>html.indexOf('id="reader-settings"'),'Theme control belongs inside Reader settings');
assert(css.includes('.comparison-dock{position:sticky'),'Comparison filters must remain joined below the sticky header');
assert(css.includes('border-bottom:1px solid var(--line)'),'Read divider belongs below the comparison filters');
assert(css.includes('border:1px solid var(--brand-accent)!important'),'Filter icons need visible burnt-orange borders');
console.log('PASS: Q tag, accessible label, initially hidden summary, independent on/off, Context pointer and light/dark colors.');

context.cache.set('0:1:kjv:science',{items:[]});
context.cache.set('0:1:kjv:questions',{items:[{id:'fixture-questions-category',verse:3,status:'Context',tags:['Q'],title:'Fixture unanswered question',summary:'Fixture only',text:'Limits',sources:[],placementRole:'key'},{id:'fixture-questions-category',verse:5,status:'Context',tags:['Q'],title:'Fixture unanswered question',keyTarget:'Genesis 1:3',placementRole:'context'}]});
const qCard=context.render(3);assert(qCard.includes('Fixture unanswered question'));assert(qCard.includes('comparison-panel-3-questions-0-Q'));assert(qCard.includes('aria-expanded="false"'));assert(context.render(5).includes('Context for:'));assert(source.includes("comparisonModes=['history','contradictions','science','questions']"));
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

