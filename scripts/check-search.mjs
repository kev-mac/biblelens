import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {performance} from 'node:perf_hooks';
import worker from '../dist/server/index.js';

// Keep the original targets and reviewed alternatives unchanged. Run the real
// worker and UI search function; adapt only the DOM and rendering boundary.
const suite=JSON.parse(fs.readFileSync('docs/search-tests.json','utf8'));
assert.equal(suite.cases.length,50);assert.equal(suite.cases.reduce((sum,test)=>sum+test.expected.length,0),160);
const source=fs.readFileSync('src/workspace.js','utf8');
const between=(text,start,end)=>{
 const first=text.indexOf(start),last=text.indexOf(end,first+start.length);
 assert(first>=0&&last>first,`Search adapter boundary: ${start}`);
 return text.slice(first,last);
};
const nodes=new Map(),groups=[];
const el=id=>{
 if(!nodes.has(id))nodes.set(id,{value:'',textContent:'',innerHTML:'',attributes:{},listeners:{},classList:{add(){},remove(){}},setAttribute(key,value){this.attributes[key]=value;},removeAttribute(key){delete this.attributes[key];},querySelectorAll(){return [];},addEventListener(key,fn){this.listeners[key]=fn;},focus(){this.focused=true;},insertAdjacentHTML(){}});
 return nodes.get(id);
};
let externalRequests=0,lastSearch;const requests=[],privateNotes=[];
const originalFetch=globalThis.fetch;
globalThis.fetch=async()=>{externalRequests++;throw Error('Search must not request external services');};
const localFetch=async input=>{
 assert(String(input).startsWith('/'),'Only packaged routes are allowed');requests.push(String(input));
 const response=await worker.fetch(new Request('https://search.test'+input),{},{});
 if(String(input).startsWith('/api/search?'))lastSearch=await response.clone().json();
 return response;
};
const books=await (await localFetch('/api/books')).json();
const context=vm.createContext({console,el,books,fetch:localFetch,AbortSignal,URLSearchParams,window:{BibleLensReferences:{json:async url=>{const response=await localFetch(url);if(!response.ok)throw Error('Reference unavailable');return response.json();}}},
 edition:()=>suite.edition,esc:value=>String(value??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;'),
 refLabel:ref=>`${books[ref.book].name} ${ref.chapter}${ref.verse?':'+ref.verse:''}`,refHash:ref=>`#read/${ref.book}/${ref.chapter}${ref.verse?'/'+ref.verse:''}`,
 excerpt:value=>String(value??''),noteRows:()=>privateNotes,
 resultGroup:(name,items)=>{const previous=groups.findIndex(row=>row.name===name);if(previous>=0)groups.splice(previous,1);groups.push({name,items});return context.renderResultGroup(name,items);},
});
vm.runInContext(fs.readFileSync('src/data.js','utf8'),context);
// Search helpers are plain shared JavaScript, also bundled into the browser.
if(fs.existsSync('src/search-core.js'))vm.runInContext((fs.readFileSync('src/person-identity.js','utf8')+'\n'+fs.readFileSync('src/search-core.js','utf8')+'\n'+fs.readFileSync('src/search-concepts.js','utf8')),context);
vm.runInContext(`let searchVersion=0,resources,includeLost=false,searchTab='scripture';\n`+
 between(source,' function resultGroup(title,items)',' function updateSearchSuggestions(query)').replace('function resultGroup(', 'function renderResultGroup(')+
 between(source,' async function getResources()',' function noteRows()')+
 between(source,' function updateSearchSuggestions(query)'," el('lens-search-input').addEventListener")+
 between(source,' function parseReference(value)',' function openCompare()')+
 between(fs.readFileSync('src/stories.js','utf8'),'function storyReference(','function storyRoute(')+
 between(fs.readFileSync('src/reader-state.js','utf8'),'function readRef(','\n'),context);

const rows=[];
try{
 for(const test of suite.cases){
  groups.length=0;const start=performance.now();
  await context.runSearch(test.query);
  assert.equal(String(el('lens-search-count-scripture').textContent),String(lastSearch.passages.length),test.id+' Scripture count');
  assert.equal(String(el('lens-search-count-evidence').textContent),String(lastSearch.research.length),test.id+' Evidence count');
  assert.equal(el('lens-search-suggestions').hidden,true,test.id+' typed suggestions');
  const elapsedMs=performance.now()-start;
  assert(!/unavailable|could not|Try again/.test(el('lens-search-status').textContent),`${test.id}: ${el('lens-search-status').textContent}`);
  let visible=0;
  const results=groups.flatMap(({name,items})=>items.map((item,index)=>{
   const record=name==='Research'?lastSearch.research.find(row=>row.title===item.title):null;
   const kind={Scripture:'verse',Research:record?.kind==='study'?'study':'record',Events:'story',People:'person',Places:'place',Commandments:'commandment'}[name];
   const id=name==='Commandments'?item.id:name==='Scripture'?item.title:name==='Research'?record?.id:name==='People'?item.url.slice('#characters/'.length):name==='Places'?/data-place-id="([^"]+)"/.exec(item.html)?.[1]:item.url;
   assert(kind&&id,`Unidentified result in ${name}`);
   return {kind,id,group:name,groupRank:index+1,visibleRank:index<5?++visible:null};
  })).map((row,index)=>({...row,rank:index+1}));
  const find=target=>results.find(row=>row.kind===target.kind&&row.id===target.id);
  const missing=test.expected.filter(target=>!find(target));
  const useful=[...test.expected,...test.acceptableAlternatives].map(find).filter(Boolean).sort((a,b)=>a.rank-b.rank);
  rows.push({id:test.id,query:test.query,category:test.category,found:!!useful.length,expectedHit:missing.length<test.expected.length,expectedFound:test.expected.length-missing.length,expectedTotal:test.expected.length,complete:!missing.length,firstGoodRank:useful[0]?.rank??null,firstVisibleRank:useful.some(row=>row.visibleRank!==null)?Math.min(...useful.map(row=>row.visibleRank??Infinity)):null,elapsedMs:Math.round(elapsedMs),missing:missing.map(({kind,id})=>({kind,id})),results});
 }
 // Contracts beyond the fixed benchmark catch aliases, ambiguity, invalid
 // references and privacy failures that a useful-hit score alone could hide.
 for(const query of ['the son of God','act with mercy','Isaiah 1:1']){context.referenceInput=query;assert.equal(vm.runInContext('BibleLensSearch.canonicalBooks(referenceInput,books)',context),query,'Ordinary words must not acquire book scope');}
 const search=async query=>{groups.length=0;await context.runSearch(query);return lastSearch;};
 for(const query of ['1 sam 17:4','1Sam17:4','first samuel 17:4','I Samuel 17:4','1 Samuel 17 4']){
  const result=await search(query);assert.deepEqual(result.passages.map(p=>p.label),['1 Samuel 17:4'],query);
  assert(groups.find(g=>g.name==='Events').items.some(item=>item.url==='#stories/1-samuel/david-and-goliath'),query+' story');
 }
 for(const query of ['1Sam17','first samuel 17']){const result=await search(query);assert.equal(result.passages[0]?.label,'1 Samuel 17:1',query);assert(result.limited);}
 for(const query of ['John 3:0','John 3:999','John 3:18-16','John 4:2–3:35','Genesis 2–1','Genesis 999']){
  const result=await search(query);assert.equal(result.passages.length+result.research.length,0,query);assert.equal(groups.find(g=>g.name==='Events').items.length,0,query+' stories');
 }
 for(const [query,kind,id] of [['Cephas','People','recX9MMADoVI2CSP1'],['Saul','People','recgkzNX07a7kGFYL'],['Saul','People','recjMT68aIzFLh6cQ'],['Devil','People','recLFwe2uKBqJwmWn'],['Zion','Places','recL1WV82pXaRBQ59'],['Sea of Tiberias','Places','recRe6uBpPMDP6u82'],['Jersualem','Places','recL1WV82pXaRBQ59']]){
  await search(query);assert(groups.find(g=>g.name===kind).items.some(item=>kind==='People'?item.url==='#characters/'+id:item.html.includes('data-place-id="'+id+'"')),query+' alias/typo');
 }
 const creation=await search('why are there two creation stories');assert(creation.research.some(row=>row.id==='animals'));assert(creation.research.some(row=>row.id==='plants'));assert(creation.research.slice(0,5).some(row=>['animals','plants'].includes(row.id)),'Creation evidence must rank ahead of loose word matches');
 for(const query of ['forgiveness','forgivness'])assert((await search(query)).research.some(row=>row.id==='commandment-forgive-others'),query+' word family');
 await search('Jericho');assert.equal(groups.find(g=>g.name==='People').items.length,0,'An exact place must not be corrected into a person');
 for(const query of ['zqxvblorp','zqxvblorp quantum banana reactor']){const result=await search(query);assert.equal(result.passages.length+result.research.length,0,query);assert(groups.every(group=>!group.items.length),query+' catalogs');}
 privateNotes.push({kind:'verse',key:'0:1:1',title:'Local mercy note',label:'Genesis 1:1',text:'mercy PRIVATE-NOTE-SEARCH-SENTINEL',record:{book:0,chapter:1,verse:1}});
 const noteSnapshot=JSON.stringify(privateNotes);await search('mercy');
 assert.equal(groups.find(g=>g.name==='Your notebook').items.length,1,'Local notes still match');
 assert.equal(JSON.stringify(privateNotes),noteSnapshot,'Search does not mutate private notes');
 assert(!requests.some(request=>request.includes('PRIVATE-NOTE-SEARCH-SENTINEL')||request.includes('Local mercy note')),'Private note contents never enter corpus requests');
 // Tabs use actual returned counts and never trigger another search or mix in
 // related collection counts. Keep both panels, links and expanded result lists.
 await search('Genesis 1');
 assert.equal(lastSearch.passages.length,24);assert(lastSearch.limited);
 assert(el('lens-search-results').innerHTML.includes('See All 24'));
 assert(el('lens-search-results').innerHTML.includes('aria-label="Related collections"'));
 const requestCount=requests.length;
 context.selectSearchTab('evidence',true);
 assert.equal(el('lens-search-panel-scripture').hidden,true);assert.equal(el('lens-search-panel-evidence').hidden,false);
 assert.equal(el('lens-search-tab-evidence').attributes['aria-selected'],'true');assert.equal(el('lens-search-tab-evidence').tabIndex,0);
 const key=(value)=>{let prevented=false,stopped=false;el('lens-search-tabs').listeners.keydown({key:value,target:{closest:()=>({})},preventDefault(){prevented=true;},stopPropagation(){stopped=true;}});assert(prevented&&stopped);};
 key('Home');assert.equal(el('lens-search-panel-scripture').hidden,false);
 key('End');assert.equal(el('lens-search-panel-evidence').hidden,false);
 key('ArrowRight');assert.equal(el('lens-search-panel-scripture').hidden,false);
 el('lens-search-tabs').listeners.click({target:{closest:()=>({dataset:{searchTab:'evidence'}})}});
 assert.equal(el('lens-search-panel-evidence').hidden,false);assert.equal(requests.length,requestCount,'Tab switches do not fetch again');
 await search('zqxvblorp');assert.equal(el('lens-search-count-scripture').textContent,0);assert.equal(el('lens-search-count-evidence').textContent,0);
 assert(el('lens-search-results').innerHTML.includes('No Scripture Results'));assert(el('lens-search-results').innerHTML.includes('No Evidence Results'));
 await context.runSearch('');assert.equal(el('lens-search-tabs').hidden,true);assert.equal(el('lens-search-suggestions').hidden,false);assert.equal(el('lens-search-results').innerHTML,'');
 const realFetch=context.fetch;context.fetch=async()=>{throw Error('Controlled outage');};
 await context.runSearch('Genesis 1');assert.equal(el('lens-search-count-scripture').textContent,'—');assert.equal(el('lens-search-count-evidence').textContent,'—');assert(el('lens-search-results').innerHTML.includes('This search could not load'));
 context.fetch=realFetch;await search('John 3:16');assert.equal(el('lens-search-count-scripture').textContent,1);assert.equal(el('lens-search-panel-evidence').hidden,false,'Repeated searches retain the chosen tab when it has matches');context.selectSearchTab('scripture');
 // A response from the prior query must not replace newer counts or cards.
 let releaseOld;context.fetch=async input=>{if(String(input).includes('q=mercy'))await new Promise(resolve=>releaseOld=resolve);return realFetch(input);};
 const stale=context.runSearch('mercy');await search('John 3:16');releaseOld();await stale;
 assert.equal(el('lens-search-count-scripture').textContent,1);assert(el('lens-search-results').innerHTML.includes('John 3:16'));
 context.fetch=realFetch;
 assert.equal(externalRequests,0);
}finally{globalThis.fetch=originalFetch;}
const summarize=cases=>({queries:cases.length,found:cases.filter(row=>row.found).length,expectedHit:cases.filter(row=>row.expectedHit).length,complete:cases.filter(row=>row.complete).length,expectedFound:cases.reduce((sum,row)=>sum+row.expectedFound,0),expectedTotal:cases.reduce((sum,row)=>sum+row.expectedTotal,0),top5:cases.filter(row=>row.firstGoodRank&&row.firstGoodRank<=5).length,visibleTop5:cases.filter(row=>row.firstVisibleRank!==null&&row.firstVisibleRank<=5).length});
const times=rows.map(row=>row.elapsedMs).sort((a,b)=>a-b);
const report={summary:summarize(rows),byCategory:Object.fromEntries([...new Set(rows.map(row=>row.category))].map(category=>[category,summarize(rows.filter(row=>row.category===category))])),timing:{medianMs:times[Math.floor(times.length/2)],p95Ms:times[Math.ceil(times.length*.95)-1],maxMs:times.at(-1)},externalRequests,cases:rows};
const args=process.argv.slice(2),reportPath=args[args.indexOf('--report')+1];
if(args.includes('--report')){assert(reportPath,'--report needs a path');fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({summary:report.summary,byCategory:report.byCategory,timing:report.timing,externalRequests},null,2));
for(const row of rows.filter(row=>!row.found))console.log(`MISS ${row.id}: ${row.query}`);
const minimum=args.includes('--min')?Number(args[args.indexOf('--min')+1]):50;
assert(Number.isInteger(minimum)&&minimum>=0&&minimum<=suite.cases.length);
assert(report.summary.found>=minimum,`Useful hits ${report.summary.found}/${suite.cases.length}; minimum ${minimum}`);
console.log('PASS: reference formats, ranges, aliases, ambiguous names, spelling, unknown queries and local private-note contracts.');
console.log('PASS: real capped/mixed/zero/repeated searches, accurate tab counts, click/keyboard tab switching without fetch, empty suggestions, unavailable counts and stale-response protection (module tests; browser layout unverified).');
console.log(`PASS: search useful-hit threshold ${minimum}/${suite.cases.length}; original targets and alternatives preserved.`);
