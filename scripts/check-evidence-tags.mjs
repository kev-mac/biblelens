import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {DOMParser} from '@xmldom/xmldom';
import postcss from 'postcss';

const read=file=>fs.readFileSync(file,'utf8'),workspace=read('src/workspace.js'),reader=read('src/reader.js');
const context={esc:value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'),
 reading:{verses:[{n:12,kjv:'The verse text.'}]},edition:()=> 'kjv',plain:value=>String(value),
 excerpt:(value,limit)=>String(value).slice(0,limit),referenceLink:()=>'<a href="#read/44/5/12" data-cite="44/5/12">Romans 5:12</a>',refLabel:()=> 'Romans 5:12'};
vm.createContext(context);
vm.runInContext(workspace.slice(workspace.indexOf(' const icon ='),workspace.indexOf(' const savedActionIcons =')),context);
vm.runInContext(reader.slice(reader.indexOf('function filterCategory('),reader.indexOf('function witnessLabel(')),context);
vm.runInContext(workspace.slice(workspace.indexOf(' function uniqueRecords('),workspace.indexOf(' function sourceLink(')),context);
const json=value=>JSON.parse(JSON.stringify(value)),groups=items=>json(context.evidenceGroups(items));
const records=[
 {id:'shared',mode:'history',tags:['H','G','T','T'],title:'Named source',summary:'Source summary'},
 {id:'shared',mode:'history',tags:['H','G','T'],title:'Named source',summary:'Source summary'},
 {id:'translation-2',mode:'history',tag:'T'},
 {id:'violation',mode:'contradictions',tag:'V'},
 {id:'law',mode:'commandments',tags:['V','H']},
 {id:'question',mode:'questions',tag:'Q'},
 {id:'science',mode:'science'},
 {id:'comparison',mode:'contradictions'},
 {id:'bookmark',mode:'bookmark',tag:'T'},
];
assert.deepEqual(groups(records).map(group=>[group.key,group.records.map(item=>item.id)]),[
 ['T',['shared','translation-2']],['V',['violation']],['commandments',['law']],['Q',['question']],['academic',['shared','science']],['contradictions',['comparison']],
]);
// Duplicate placements can contribute different categories; deduplicate only within a category.
assert.deepEqual(groups([{id:'same',mode:'history',activeTags:['T']},{id:'same',mode:'history',activeTags:['H']}]).map(group=>group.key),['T','academic']);
assert.deepEqual(groups([{id:'context',mode:'history',tags:['H','T'],activeTags:['H'],placementRole:'context'}]).map(group=>group.key),['academic']);
assert.deepEqual(groups([{id:'context',mode:'history',tag:'T',activeTags:[],placementRole:'context'}]).map(group=>group.key),['academic']);
assert.deepEqual(groups([{id:'question',mode:'questions',tags:['UNKNOWN']}]).map(group=>group.key),['Q']);
assert.deepEqual(groups([]),[]);
assert.equal(groups([{mode:'science',ref:'Genesis 1:1',title:'Same',summary:'Same'},{mode:'science',ref:'Genesis 1:2',title:'Same',summary:'Same'}])[0].records.length,2,'Anonymous records on different references survive');
assert.equal(groups([{mode:'science',ref:'Genesis 1:1',title:'Same',summary:'Same'},{mode:'science',ref:'Genesis 1:1',title:'Same',summary:'Same'}])[0].records.length,1);
assert.equal(context.uniqueRecords(records).length,records.length-1);
const parse=html=>new DOMParser().parseFromString('<root>'+html+'</root>','text/xml');
for(const group of context.evidenceGroups(records)){
 const doc=parse(context.evidencePillHtml(group,12)),button=doc.getElementsByTagName('button')[0],label=button.textContent;
 assert.equal(button.getAttribute('data-evidence-count'),String(group.records.length));
 assert.equal(button.getAttribute('data-lens-category'),group.key);
 assert.equal(button.getAttribute('data-tone'),({T:'translation',V:'violation',commandments:'commandments',Q:'question',academic:'academic',contradictions:'contradictions'})[group.key],'Use the existing category tone');
 assert.equal(button.getAttribute('aria-haspopup'),'dialog');assert.equal(button.getAttribute('aria-controls'),'lens-inspector-sheet');
 assert.equal(label,group.label.toUpperCase()+(group.records.length>1?` (${group.records.length})`:''));assert(!label.includes('(1)'));
 const summary=parse(context.evidenceSummaryHtml(group,{verse:12}));
 assert.equal(summary.getElementsByTagName('article').length,group.records.length,'Pill count equals summary cards');
 assert.equal(summary.getElementsByTagName('button').length,group.records.length,'Every item has a full-evidence option');
 assert.equal(summary.getElementsByTagName('blockquote')[0].textContent,'The verse text.');
 assert.equal(summary.getElementsByTagName('a')[0].getAttribute('data-cite'),'44/5/12','Verse reference opens existing context preview');
 for(const article of [...Array(summary.getElementsByTagName('article').length)].map((_,index)=>summary.getElementsByTagName('article')[index])){
  assert.equal(article.getAttribute('data-tone'),group.tone,'Summary cards inherit the selected category palette');
  const action=article.getElementsByTagName('button')[0];assert.equal(action.textContent,'');assert.equal(action.getAttribute('title'),'View evidence');assert.equal(action.getElementsByTagName('svg').length,1);
 }
}
const hostile={key:'academic',tone:'academic',label:'Academic',records:[{title:'<script>bad</script>',summary:'<img src=x onerror=bad>',placementRole:'context'}]};
const escaped=context.evidenceSummaryHtml(hostile,{verse:12});assert(!escaped.includes('<script>')&&!escaped.includes('<img'));assert(escaped.includes('Supporting context'));
const supporting=parse(escaped),supportButtons=supporting.getElementsByTagName('button');assert.equal(supportButtons.length,2,'Supporting context metadata gets its own information action');
assert.equal(supportButtons[0].getAttribute('title'),'About supporting context');assert.equal(supportButtons[0].getAttribute('aria-expanded'),'false');assert.equal(supportButtons[0].textContent,'');assert.notEqual(supportButtons[0].getAttribute('aria-label'),supportButtons[1].getAttribute('aria-label'));
const supportNote=[...Array(supporting.getElementsByTagName('p').length)].map((_,index)=>supporting.getElementsByTagName('p')[index]).find(node=>node.getAttribute('id')===supportButtons[0].getAttribute('aria-controls'));assert(supportNote?.hasAttribute('hidden'));assert.match(supportNote.textContent,/provide background for the verse/);

// Exercise the actual inspector actions and async selection, with DOM operations recorded.
const calls=[],nodes=new Map();let listener,resolveComparisons;
Object.assign(context,{activeVerse:12,activeEvidenceCategory:'academic',evidenceSummary:true,emptyRequest:0,
 document:{addEventListener:(_type,fn)=>listener=fn},el:id=>nodes.get(id),
 inspector:{querySelector:selector=>({focus:()=>calls.push(['focus',selector]),scrollIntoView:()=>calls.push(['scroll',selector])})},
 inspectorSheet:{scrollTop:9},renderInspector:()=>calls.push(['render',context.evidenceSummary,context.activeEvidenceCategory]),
 dismissEmpty(){},setFocus(){},updateEvidenceControl(){},showVerseActions:()=>calls.push(['actions']),
 showInspectorSheet:()=>calls.push(['open',context.activeVerse,context.activeEvidenceCategory]),
 ensureComparisons:()=>new Promise(resolve=>resolveComparisons=resolve),comparisonCache:new Map(),comparisonKey:mode=>mode,verseComparisons:()=>records,
 inspectorOpener:null});
vm.runInContext(workspace.slice(workspace.indexOf(' async function inspectVerse('),workspace.indexOf(" document.addEventListener('click',event=>{",workspace.indexOf(' async function inspectVerse('))),context);
const start=workspace.indexOf(" document.addEventListener('click',event=>{",workspace.indexOf(' async function inspectVerse('));
vm.runInContext(workspace.slice(start,workspace.indexOf('\n });',start)+5),context);
const click=(selector,dataset={})=>listener({target:{closest:query=>query===selector?{dataset}:null}});
const infoAttrs={'aria-controls':'support-note','aria-expanded':'false'},info={getAttribute:key=>infoAttrs[key],setAttribute:(key,value)=>infoAttrs[key]=value,removeAttribute:key=>delete infoAttrs[key]},note={id:'support-note',hidden:true};nodes.set('support-note',note);
const toggleInfo=()=>listener({target:{closest:query=>query==='[data-lens-context-info]'?info:null}});
toggleInfo();assert.equal(note.hidden,false);assert.equal(infoAttrs['aria-expanded'],'true');assert.equal(infoAttrs['aria-describedby'],'support-note');assert.equal(context.evidenceSummary,true,'Context information does not navigate away');
toggleInfo();assert.equal(note.hidden,true);assert.equal(infoAttrs['aria-expanded'],'false');assert(!('aria-describedby' in infoAttrs));
click('[data-lens-evidence-record]',{lensEvidenceRecord:'1'});assert.equal(context.evidenceSummary,false);assert.deepEqual(calls.at(-1),['focus','[data-lens-evidence-index="1"]']);
click('[data-lens-summary]');assert.equal(context.evidenceSummary,true);assert.equal(context.inspectorSheet.scrollTop,0);
click('[data-lens-all-evidence]');assert.equal(context.activeEvidenceCategory,null);assert.equal(context.evidenceSummary,false);
const promise=context.inspectVerse(12,true,null,true,'T');assert.equal(context.activeEvidenceCategory,'T');assert(context.evidenceSummary);resolveComparisons();await promise;assert.deepEqual(calls.at(-1),['open',12,'T']);
const stale=context.inspectVerse(12,true,null,true,'academic');const oldResolve=resolveComparisons;
const fresh=context.inspectVerse(13,true,null,true,'Q');const newResolve=resolveComparisons;
const openings=()=>calls.filter(call=>call[0]==='open').length,previous=openings();oldResolve();await stale;assert.equal(openings(),previous,'Stale category request cannot open a window');newResolve();await fresh;assert.deepEqual(calls.at(-1),['open',13,'Q']);
await context.inspectVerse(12,false,null,false,'unknown');assert.equal(context.activeEvidenceCategory,null);
click('[data-lens-chapter]');assert.equal(context.activeVerse,null);assert.equal(context.activeEvidenceCategory,null);
vm.runInContext(workspace.slice(workspace.indexOf(' function evidenceOpener('),workspace.indexOf(' function showInspectorSheet(')),context);
const freshMarker={category:'T'};nodes.set('verse-12',{querySelector:selector=>selector==='[data-lens-category="T"]'?freshMarker:null});
context.activeVerse=12;context.activeEvidenceCategory='T';assert.equal(context.evidenceOpener(),freshMarker,'Resolve the new pill after rendering replaces its opener');
context.activeEvidenceCategory=null;context.inspectorOpener={dataset:{lensCategory:'T',lensInspect:'12'}};assert.equal(context.evidenceOpener(),freshMarker,'Return to the original pill after viewing all verse evidence');
context.activeVerse=null;assert.equal(context.evidenceOpener(),freshMarker,'Whole Chapter retains the launching verse identity for close/Escape');

// Inspect the final CSS cascade, including both themes and the original inline placement.
const rules=[];postcss.parse(read('src/overrides.css')).walkRules(rule=>{if(!rule.parent.name)rules.push(rule);});
const value=(selector,prop)=>rules.filter(rule=>rule.selector===selector).flatMap(rule=>rule.nodes.filter(node=>node.prop===prop)).at(-1)?.value;
const button='html body.lens-app #chapter-text .verse-body .lens-verse-evidence';
assert.equal(value('html body.lens-app #chapter-text .verse-evidence-tags','display'),'inline');
assert.equal(value(button,'position'),'relative');assert.equal(value(button,'width'),'auto');assert.equal(value(button,'min-height'),'24px');assert.equal(value(button,'min-width'),'24px');assert.equal(value(button,'margin'),'0 3px 0 0');
assert.equal(value(button+' .verse-study-pill','border'),'1px solid currentColor');assert.equal(value(button+' .verse-study-pill','border-radius'),'4px');assert.equal(value(button+' .verse-study-pill','padding'),'1px 3px');assert.match(value(button+' .verse-study-pill','font'),/\.5625rem/);
assert(value(button,'color').includes('var(--theme-rgb)'));assert(value('html body.lens-app.dark #chapter-text .verse-body .lens-verse-evidence','color').includes('var(--theme-rgb)'));
assert.equal(value('html body.lens-app #lensInspector .lens-evidence-summary','border-color'),'var(--summary-category-color)');assert(value('html body.lens-app #lensInspector .lens-evidence-summary','--summary-category-color').includes('65%,black'));assert(value('html body.lens-app.dark #lensInspector .lens-evidence-summary','--summary-category-color').includes('70%,white'));
assert.equal(value('html body.lens-app #lensInspector .lens-summary-icon','width'),'44px');assert.equal(value('html body.lens-app #lensInspector .lens-summary-icon','height'),'44px');assert(value('html body.lens-app #lensInspector .lens-summary-icon:focus-visible','outline'));
assert(workspace.includes("row.querySelector('[data-scripture]').append(tags)"),'Append marks without replacing scripture nodes');
console.log('PASS: six categories, overlapping tags, duplicate/anonymous records, placement tags, exact counts, safe summaries, citation previews, full-evidence navigation, stale requests, inline CSS and compact 24px tag targets with 44px context actions. Browser geometry remains a separate check.');
