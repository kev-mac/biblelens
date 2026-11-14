import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import worker from './built-worker.mjs';
import {aiPublicContext,parseGroundedSearchResponse,combinedSearchRequest} from '../worker/combined-search.mjs';
import {conversationInput,conversationalResult} from '../src/device-conversation.js';

// These targets are diagnostic gold, never packaged as retrieval rules or sent
// to a real provider. Fake plans test resolution; only offline results measure
// retrieval here. No real keys, accounts, network or paid requests are used.
const positive=[
 ['how long did Adam live',0,5,5],['how long did Seth live',0,5,8],
 ['how long did Enos live',0,5,11],['how long did Cainan live',0,5,14],
 ['how long did Mahalaleel live',0,5,17],['how long did Jared live',0,5,20],
 ['how long did Lamech live',0,5,31],['how long did Methuselah live',0,5,27],
 ['how long did Noah live',0,9,29],['how long did Abraham live',0,25,7],
 ['how long did Isaac live',0,35,28],['how long did Jacob live',0,47,28],
 ['how long did Sarah live',0,23,1],['how long did Joseph live',0,50,26],
 ['how long did Moses live',4,34,7],['how long did Aaron live',3,33,39],
 ['how long did Joshua live',5,24,29],['how long did Jehoiada live',13,24,15],
 ['How old was Moses when he died?',4,34,7],["What was Moses’s age at death?",4,34,7],
 ['What is the lifespan of Sarah?',0,23,1],['How many years did Methuselah live?',0,5,27],
 ['How many years did Ishmael live?',0,25,17],["What was Terah's age at death?",0,11,32]
];
// The final two positive names and these four additional uncertainty cases
// were reserved until after the main rule was implemented. No subject-specific
// production rules are introduced by this test data.
const lateUnsupported=['how old was Miriam when she died','how long did David live','how long did Elizabeth live','how long did Rachel live'];
const unsupported=['how old was Jesus when he died','how old was Enoch when he died','how long did Mary live','how long did Lydia live','how long did imaginary Moses live','how long did Zorg live','how long did Job live',...lateUnsupported];
const semantic=[
 ['Who refused to kill newborn children?', 'Exodus 1:17','#read/1/1/17'],
 ['Daughters ask to inherit their father’s land', 'Numbers 27:7','#read/3/27/7'],
 ['A tax collector returns more than he took', 'Luke 19:8','#read/41/19/8'],
 ['Someone searches carefully for a lost coin', 'Luke 15:8-9','#read/41/15/8-9'],
 ['A snake bites a man who survives', 'Acts 28:3-5','#read/43/28/3-5'],
 ['A poor widow shares her last meal', '1 Kings 17:12-16','#read/10/17/12-16'],
 ['A captive interprets a ruler’s dream', 'Genesis 41:25-28','#read/0/41/25-28'],
 ['A ruler prays for wisdom instead of wealth', '1 Kings 3:9-12','#read/10/3/9-12'],
 ['A child hears a voice at night', '1 Samuel 3:8-10','#read/8/3/8-10'],
 ['Someone refuses to punish a captured enemy', '1 Samuel 24:10-12','#read/8/24/10-12'],
 ['A person travels past someone in need', 'Luke 10:30-33','#read/41/10/30-33'],
 ['Someone is welcomed despite being thought lost', 'Luke 15:20-24','#read/41/15/20-24'],
 ['how long did God live', 'Psalms 90:2','#read/18/90/2']
];
const oldFetch=globalThis.fetch;let mockedCalls=0,unexpectedNetwork=0,plan;
const forbidden=async()=>{unexpectedNetwork++;throw Error('External networking forbidden');};globalThis.fetch=forbidden;
const get=(path,impl=worker)=>impl.fetch(new Request('https://grounded.test'+path),{},{}).then(response=>response.json());
const chat=(message,edition='kjv',impl=worker)=>impl.fetch(new Request('https://grounded.test/api/chat',{method:'POST',body:JSON.stringify({message,edition})}),{},{}).then(response=>response.json());
const rows=[];let prior;
if(process.argv.includes('--compare-published'))prior=(await import('../.release/sites-mirror/dist/server/index.js')).default;
const db=new DatabaseSync(':memory:');for(const name of fs.readdirSync('drizzle').filter(name=>name.endsWith('.sql')))db.exec(fs.readFileSync('drizzle/'+name,'utf8'));
const DB={prepare(sql){return{bind(...args){return{async first(){return db.prepare(sql).get(...args)||null;},async run(){return db.prepare(sql).run(...args);}};}};}};
let userId=0;
async function retrieve(query,edition='kjv',path='/api/retrieve'){
 const user='held-out-'+(++userId);
 return (await worker.fetch(new Request('https://grounded.test'+path,{method:'POST',headers:{'content-type':'application/json','x-biblelens-ai':'1','oai-authenticated-user-id':user},body:JSON.stringify({query,edition})}),{DB,OPENAI_API_KEY:'test-only-not-a-real-api-key',BIBLELENS_AI_ALLOWED_USERS:user,BIBLELENS_SEMANTIC_RETRIEVAL_ENABLED:'1'},{})).json();
}
function answerData(excerpts,web='Cited web source.',status='supported'){
 const text='[APP_EVIDENCE]\n'+JSON.stringify({status,excerpts,answer:'This free model claim must never appear.'})+'\n[WEB]\n'+web;
 const start=text.lastIndexOf('Cited web source.');
 return {status:'completed',usage:{input_tokens:10,output_tokens:20},output:[{type:'web_search_call',status:'completed'},{type:'message',role:'assistant',content:[{type:'output_text',text,annotations:start<0?[]:[{type:'url_citation',start_index:start,end_index:start+'Cited web source.'.length,url:'https://www.biblegateway.com/passage/?search=Deuteronomy+34%3A7',title:'Deuteronomy 34:7'}]}]}]};
}
try{
 for(const [query,book,ch,n]of positive){
  const target=`#read/${book}/${ch}/${n}`,result=await chat(query),library=await get('/api/search?edition=kjv&q='+encodeURIComponent(query));
  const expected=(await get(`/api/chapter?book=${book}&chapter=${ch}`)).verses.find(verse=>verse.n===n);
  assert(result.sources.some(source=>source.url===target),query);assert.equal(result.answerability,'quoted-evidence',query);assert.equal(result.modelEligible,false);assert(result.answer.includes(expected.kjv),query);assert.equal(library.passages[0].url,target,query);
  const before=prior?await chat(query,'kjv',prior):null,beforeLibrary=prior?await get('/api/search?q='+encodeURIComponent(query),prior):null;
  rows.push({query,target,after:{supportingSource:true,leadingTarget:true,libraryFirst:library.passages[0].url,answer:result.answer},before:before?{supportingSource:before.sources?.some(source=>source.url===target),leadingTarget:before.answer.includes(expected.kjv),libraryFirst:beforeLibrary.passages[0]?.url||null,answer:before.answer}:null});
 }
 for(const query of unsupported){const result=await chat(query),library=await get('/api/search?q='+encodeURIComponent(query));assert.equal(result.mode,'missing',query);assert.equal(result.answerability,'insufficient');assert.equal(result.sources.length,0);assert.equal(library.passages.length,0);assert(!/Bible (?:does not|doesn't) say/i.test(result.answer));}
 for(const query of ['how long did Moses live in Egypt','how old was Moses when he fled Egypt'])assert.notEqual((await chat(query)).mode,'fact','Residence and event ages are not total lifespans');
 for(const edition of ['web','asv']){const result=await chat('how long did Moses live',edition);assert.equal(result.sources[0].url,'#read/4/34/7');assert(result.evidence[0].text.includes('hundred'));}
 const noClaim=await chat('how many days did it rain during the flood');assert.equal(noClaim.answerability,'related-passages');assert.equal(noClaim.modelEligible,false);assert(noClaim.answer.includes('not established a direct answer'));
 const moses=await chat('how long did Moses live'),sources=aiPublicContext(moses.evidence);
 const proof={id:sources[0].id,quote:sources[0].text};
 const valid=parseGroundedSearchResponse(answerData([proof]),sources);assert.equal(valid.evidenceStatus,'quoted-evidence');assert(valid.parts.some(part=>part.url==='#read/4/34/7'));assert(!JSON.stringify(valid).includes('free model claim'));
 const rangeSources=aiPublicContext([{label:'Deuteronomy 34:6-7',url:'#read/4/34/6-7',kind:'Primary scripture text · KJV',text:'Deuteronomy 34:6. The preceding complete verse.\nDeuteronomy 34:7. '+proof.quote}]);
 const narrowed=parseGroundedSearchResponse(answerData([{id:'A1',quote:'Deuteronomy 34:7. '+proof.quote}]),rangeSources);assert.equal(narrowed.appResults[0].url,'#read/4/34/7');assert.equal(narrowed.appResults[0].label,'Deuteronomy 34:7');
 for(const excerpt of [{id:'A999',quote:proof.quote},{id:proof.id,quote:proof.quote.replace('twenty','thirty')},{id:proof.id,quote:proof.quote.slice(8)}]){const result=parseGroundedSearchResponse(answerData([excerpt]),sources);assert.equal(result.evidenceStatus,'insufficient');assert.equal(result.appResults.length,0);}
 const noApp=parseGroundedSearchResponse(answerData([proof]),[]);assert.equal(noApp.appResults.length,0);
 const uncited=parseGroundedSearchResponse(answerData([proof],'Moses lived 999 years.\n\nCited web source.'),sources);assert(!uncited.parts.some(part=>part.text.includes('999')));
 const absence=parseGroundedSearchResponse(answerData([],"The Bible doesn't say how long Moses lived. Cited web source.",'insufficient'),sources);assert(!absence.parts.some(part=>part.text.includes("Bible doesn't say")));assert(absence.parts.some(part=>part.text.includes('could not establish')));
 const input=conversationInput('Explain this passage',{modelEligible:true,evidence:moses.evidence});assert(input);
 assert.equal(conversationalResult(JSON.stringify({answer:'The Bible does not say how long Moses lived.',sourceIds:[input.sources[0].id]}),input),null);
 assert(conversationalResult(JSON.stringify({answer:input.sources[0].text,sourceIds:[input.sources[0].id]}),input));
 // Real route + mocked planner. Cases deliberately supply known references;
 // they test broad corpus resolution, not real model selection/semantic recall.
 let webFixture='Deuteronomy 34:7 gives the age. Cited web source.';
 globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.openai.com/v1/responses');const body=JSON.parse(options.body);assert(!options.body.includes('PRIVATE NOTE'));mockedCalls++;if(!body.tools)return Response.json({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(plan)}]}]});const data=answerData([],webFixture,'insufficient');data.output[1].content[0].annotations[0].title='Web reference';return Response.json(data);};
 for(const [query,reference,url]of semantic){plan={queries:[],passages:[reference],topics:[]};const result=await retrieve(query);assert.equal(result.status,'ready');assert.equal(result.appResults[0].url,url);assert(result.appResults[0].text);}
 plan={queries:['Jesus thirty years'],passages:['Luke 3:23'],topics:[]};assert.equal((await retrieve('how old was Jesus when he died')).appResults.length,0,'An existing verse about another life event cannot establish death age');
 plan={queries:[],passages:['Luke 3:999'],topics:[]};assert.equal((await retrieve('unsupported premise')).appResults.length,0);
 plan={queries:[],passages:[],topics:[]};const linked=await retrieve('where is the age stated','kjv','/api/answer');
 assert.equal(linked.status,'ready');assert(linked.parts.some(part=>part.sourceType==='web'&&part.url.startsWith('https://www.biblegateway.com/')),'Keep the original external source');assert(linked.parts.some(part=>part.sourceType==='reading'&&part.url==='#read/4/34/7'),'Add a separately resolved in-app reading copy');assert.equal(linked.appResults.length,0,'A reading copy is not fabricated supporting app evidence');
 for(const [text,edition]of [['Deuteronomy 34. Cited web source.','kjv'],['Deuteronomy 34:999. Cited web source.','kjv'],['Acts 8:37. Cited web source.','web']]){webFixture=text;const result=await retrieve('verify the reference '+(++userId),edition,'/api/answer');assert(!result.parts.some(part=>part.sourceType==='reading'),'Chapter-only, nonexistent and absent-edition verses cannot become precise app links');}
 const legacyEnv={DB,OPENAI_API_KEY:'test-only-not-a-real-key',BIBLELENS_AI_ALLOWED_USERS:'off'};let forbiddenCalls=0;const off=await combinedSearchRequest(new Request('https://grounded.test/api/retrieve',{method:'POST',headers:{'content-type':'application/json','x-biblelens-ai':'1','oai-authenticated-user-id':'off'},body:JSON.stringify({query:'Moses',edition:'kjv'})}),legacyEnv,async()=>[],{fetchImpl:async()=>{forbiddenCalls++;throw Error('Disabled feature called provider');}});assert.equal(off.status,403);assert.equal(forbiddenCalls,0);
 assert.equal(unexpectedNetwork,0);
 const report={kind:'offline-retrieval-and-mocked-provider',realProviderCalls:0,realWebCalls:0,unexpectedNetwork,simulatedProviderCalls:mockedCalls,offlinePositiveCases:positive.length,offlinePositivePass:rows.length,unsupportedCases:unsupported.length,lateHeldOut:{positive:positive.slice(-2).map(row=>row[0]),uncertainty:lateUnsupported},semanticResolutionFixtures:semantic.length,semanticRecallMeasured:false,baseline:prior?{artifact:(await get('/release.json',prior)),supportingSource:rows.filter(row=>row.before.supportingSource).length,leadingTarget:rows.filter(row=>row.before.leadingTarget).length,libraryFirst:rows.filter(row=>row.before.libraryFirst===row.target).length}:null,after:{artifact:await get('/release.json'),supportingSource:rows.length,leadingTarget:rows.length,libraryFirst:rows.length},rows};
 const index=process.argv.indexOf('--report');if(index>=0)fs.writeFileSync(process.argv[index+1],JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({...report,rows:undefined},null,2));
 console.log('PASS: real offline lifespan retrieval, unsupported/event distinctions, edition text, complete-quote claim gates, uncertainty, cited web paragraphs, original web attribution, precise app reading copies, default-off rollout and thirteen independent mocked semantic resolutions. No real API requests.');
}finally{globalThis.fetch=oldFetch;db.close();}
