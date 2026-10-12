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
vm.runInContext(cacheCode+'\nfunction comparisonCitations(){return "<div class=summary-citations>Citations</div>"} function scienceDetails(){return ""} function alternativeReadings(){return ""}\n'+rendererCode+'\nthis.render=comparisonCell;this.toggle=selectComparison;this.visible=visibleComparison;this.cache=comparisonCache;',context);
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
console.log('PASS: initially closed; independent one/multiple/none toggles; agreements/background hidden; category colors; details preserved; chapter reset.');
