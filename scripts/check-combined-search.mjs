import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {DatabaseSync} from 'node:sqlite';
import {aiPublicContext,combinedSearchRequest,parseSearchResponse,safeSearchUrl} from '../worker/combined-search.mjs';
// Fake provider responses only. No live API requests or real credentials.
let fixtureId=0;
const key='test-only-not-a-real-provider-key';
const hash=async value=>Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))).toString('hex');
function fixture(){
 const sqlite=new DatabaseSync(':memory:');
 for(const file of fs.readdirSync('drizzle').filter(file=>file.endsWith('.sql')))sqlite.exec(fs.readFileSync('drizzle/'+file,'utf8'));
 const DB={prepare(sql){return {bind(...args){return {async first(){return sqlite.prepare(sql).get(...args)||null;},async run(){return sqlite.prepare(sql).run(...args);}};}};}};
 const user='trial-user-'+(++fixtureId);return {sqlite,user,env:{OPENAI_API_KEY:key,BIBLELENS_AI_ALLOWED_USERS:user,DB}};
}
function request(user,input={query:'show me examples of miracles',edition:'web'},headers={}){return new Request('https://zlens.example.org/api/answer',{method:'POST',headers:{origin:'https://zlens.example.org','content-type':'application/json','x-biblelens-ai':'1',...(user?{'oai-authenticated-user-id':user}:{}),...headers},body:JSON.stringify(input)});}
const context=[{label:'John 2:9',url:'#read/42/2/9',kind:'Scripture · WEB',text:'The ruler of the feast tasted the water now become wine.'}];
const providerData=()=>({status:'completed',usage:{input_tokens:40,output_tokens:20},output:[{type:'web_search_call',status:'completed'},{type:'message',role:'assistant',content:[{type:'output_text',text:'From zLenz: water becomes wine [A1].\nFrom the web: History source.',annotations:[{type:'url_citation',start_index:51,end_index:65,url:'https://www.britannica.com/topic/miracle',title:'Miracle overview'}]}]}]});
const planData=()=>({status:'completed',usage:{input_tokens:10,output_tokens:5},output:[{type:'message',role:'assistant',content:[{type:'output_text',text:JSON.stringify({queries:['water becomes wine','Jesus feeding a crowd','Jesus calms a storm']})}]}]});
function providerSpy(){const calls=[];return {calls,fetchImpl:async(url,options)=>{assert.equal(url,'https://api.openai.com/v1/responses');assert.equal(options.headers.authorization,'Bearer '+key);calls.push(JSON.parse(options.body));return Response.json(calls.at(-1).tools?providerData():planData());}};}
let externalCalls=0;const forbidden=async()=>{externalCalls++;throw Error('Unexpected provider request');};
let f=fixture();
for(const [req,env,status]of [[request(f.user),{},503],[request(null),f.env,401],[request('other'),f.env,401],[request(f.user,{query:'x',history:['PRIVATE NOTE']}),f.env,400],[request(f.user,{query:'x'.repeat(1201)}),f.env,400],[request(f.user,{query:'x'},{origin:'https://attacker.example.org'}),f.env,403]])assert.equal((await combinedSearchRequest(req,env,async()=>context,{fetchImpl:forbidden})).status,status);
assert.equal(externalCalls,0);
const spy=providerSpy();let leads;
const result=await (await combinedSearchRequest(request(f.user),f.env,async(_query,edition,queries)=>{assert.equal(edition,'web');leads=queries;return [...context,{url:'javascript:bad()',text:'PRIVATE CONTENT'}];},{fetchImpl:spy.fetchImpl})).json();
assert.equal(result.status,'ready');assert.equal(spy.calls.length,2);assert.equal(result.usage.inputTokens,50);assert.equal(result.usage.webCalls,1);
assert.deepEqual(leads,['water becomes wine','Jesus feeding a crowd','Jesus calms a storm']);assert.equal(spy.calls[0].input,'show me examples of miracles');
assert.deepEqual(Object.keys(JSON.parse(spy.calls[1].input)),['question','edition','publicAppSources']);assert.equal(spy.calls[1].store,false);assert.equal(spy.calls[1].max_tool_calls,1);assert.equal(spy.calls[1].tools[0].search_context_size,'low');
for(const secret of ['PRIVATE CONTENT',f.user,key])assert(!JSON.stringify(spy.calls).includes(secret));
assert(result.parts.some(part=>part.sourceType==='web'&&part.url));assert(result.parts.some(part=>part.sourceType==='app'&&part.url===context[0].url));
assert((await (await combinedSearchRequest(request(f.user),f.env,async()=>{throw Error('Cache missed');},{fetchImpl:forbidden})).json()).cached);
assert.equal(f.sqlite.prepare('SELECT COUNT(*) count FROM ai_search_requests').get().count,1);assert.equal(f.sqlite.prepare('SELECT input_tokens FROM ai_search_requests').get().input_tokens,50);
assert.deepEqual(Object.keys(f.sqlite.prepare('SELECT * FROM ai_search_requests').get()),['id','user_hash','created_at','status','input_tokens','output_tokens','web_calls']);
for(const value of ['javascript:alert(1)','http://example.org','https://user:secret@example.org','https://localhost','https://192.168.1.1','https://[::1]','https://host.local','https://example.org:8443'])assert.equal(safeSearchUrl(value),null,value);
assert(safeSearchUrl('https://www.britannica.com/topic/miracle'));
assert.equal(aiPublicContext(Array.from({length:20},(_,index)=>({...context[0],url:'#read/42/2/'+(index+1),text:'x'.repeat(10000)}))).reduce((sum,row)=>sum+row.text.length,0),12000);
assert.throws(()=>parseSearchResponse({...providerData(),output:[]},[]));const bad=providerData();bad.output[1].content[0].annotations[0].url='javascript:bad()';assert.throws(()=>parseSearchResponse(bad,[]));assert.throws(()=>parseSearchResponse({...providerData(),status:'incomplete'},[]));
assert.throws(()=>parseSearchResponse(providerData(),[]),'A model cannot invent an app citation when no app evidence was supplied');
// Persistent ceilings use real SQLite statements rather than a fake counter.
for(const kind of ['minute','user-day','global-day']){
 f=fixture();const now=Date.now(),day=Math.floor(now/86400000)*86400000,userHash=await hash(f.user),total=kind==='minute'?2:kind==='user-day'?20:100;
 for(let i=0;i<total;i++)f.sqlite.prepare('INSERT INTO ai_search_requests(id,user_hash,created_at) VALUES(?,?,?)').run(String(i),kind==='global-day'?'other':userHash,kind==='minute'?now:Math.max(day,now-120000));
 assert.equal((await (await combinedSearchRequest(request(f.user,{query:kind}),f.env,async()=>context,{fetchImpl:forbidden})).json()).status,'limited');
}
f=fixture();let failureCalls=0;const failed=await (await combinedSearchRequest(request(f.user),f.env,async()=>context,{fetchImpl:async()=>{failureCalls++;return new Response('secret diagnostic',{status:401});}})).json();assert.equal(failed.status,'unavailable');assert.equal(failureCalls,1);assert(!JSON.stringify(failed).includes('secret diagnostic'));assert.equal(f.sqlite.prepare('SELECT COUNT(*) count FROM ai_search_requests').get().count,1);
f=fixture();assert.equal((await (await combinedSearchRequest(request(f.user),f.env,async()=>context,{timeoutMs:5,fetchImpl:async(_url,{signal})=>new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('timeout')),{once:true}))})).json()).status,'unavailable');
// Native requires a real unexpired pairing. Revocation of an email policy also
// revokes its trial enrollment without changing note-sync permissions.
f=fixture();delete f.env.BIBLELENS_AI_ALLOWED_USERS;f.env.BIBLELENS_AI_ALLOWED_EMAILS='owner@example.org';
const ownerSpy=providerSpy();const owner=await combinedSearchRequest(request(f.user,{query:'email-owner'},{'oai-authenticated-user-email':'owner@example.org'}),f.env,async()=>context,{fetchImpl:ownerSpy.fetchImpl});assert.equal((await owner.json()).status,'ready');
assert.equal(f.sqlite.prepare('SELECT COUNT(*) count FROM ai_trial_users').get().count,1);assert(!JSON.stringify(f.sqlite.prepare('SELECT * FROM ai_trial_users').get()).includes(f.user));
const token='a'.repeat(64);f.sqlite.prepare('INSERT INTO sync_devices(token_hash,user_id,expires_at) VALUES(?,?,?)').run(await hash(token),f.user,Date.now()+60000);
const nativeRequest=()=>request(null,{query:'email-native',edition:'kjv'},{origin:'capacitor://localhost',authorization:'Bearer '+token});
const nativeSpy=providerSpy(),native=await combinedSearchRequest(nativeRequest(),f.env,async()=>context,{fetchImpl:nativeSpy.fetchImpl});assert.equal((await native.json()).status,'ready');assert.equal(native.headers.get('access-control-allow-origin'),'capacitor://localhost');assert(!JSON.stringify(nativeSpy.calls).includes(token));
f.env.BIBLELENS_AI_ALLOWED_EMAILS='changed-owner@example.org';assert.equal((await combinedSearchRequest(nativeRequest(),f.env,async()=>context,{fetchImpl:forbidden})).status,401);
const client={window:{},navigator:{onLine:true},document:{documentElement:{classList:{contains:()=>false}},querySelector:()=>null},localStorage:{getItem(){throw Error('Browser answers must not read storage');}},URL,AbortController,setTimeout,clearTimeout,fetch:async(url,options)=>{assert.equal(url,'/api/answer');assert.deepEqual(JSON.parse(options.body),{query:'miracles',edition:'kjv'});return Response.json(result);}};
vm.createContext(client);vm.runInContext(fs.readFileSync('src/combined-search.js','utf8'),client);const api=client.window.BibleLensCombined;assert.equal((await api.answer('miracles','kjv')).status,'ready');
const html=api.render({status:'ready',parts:[{text:'<script>bad()</script>'},{text:'Citation',sourceType:'web',url:'javascript:bad()'},{text:'Web source',sourceType:'web',url:'https://www.britannica.com/topic/miracle'}]});assert(!html.includes('<script>'));assert(!html.includes('javascript:'));assert(html.includes('rel="noopener noreferrer"'));assert(html.includes('combined-citation'));client.navigator.onLine=false;client.fetch=forbidden;assert.equal((await api.answer('miracles','kjv')).status,'offline');
const formatted=api.render({status:'ready',parts:[{text:'### From zLenz\n**A report** in '},{text:'zLenz: 2 Kings 6:28',sourceType:'app',url:'#read/11/6/28'},{text:'.\n\n### From the web\n- **Context** and <unsafe>\n[bad](javascript:alert(1)) <img src=x onerror=alert(1)>'}]});
assert(formatted.includes('<h4>From zLenz</h4>'));assert(formatted.includes('<strong>A report</strong>'));assert(formatted.includes('<ul><li><strong>Context</strong>'));assert(!formatted.includes('###'));assert(!formatted.includes('**'));assert(!formatted.includes('<img'));assert(!formatted.includes('href="javascript:'));assert(formatted.includes('href="#read/11/6/28"'));
const workspace=fs.readFileSync('src/workspace.js','utf8');assert(!workspace.split('\n').find(line=>line.includes("addEventListener('input',()=>")).includes('submitOnlineSearch'));assert(workspace.includes("el('lens-web-search').addEventListener('click'"));
const bridge=vm.createContext({});vm.runInContext(fs.readFileSync('src/person-identity.js','utf8')+'\n'+fs.readFileSync('src/search-core.js','utf8')+'\n'+fs.readFileSync('src/search-concepts.js','utf8'),bridge);bridge.catalog=JSON.parse(fs.readFileSync('data/books.json','utf8'));assert.equal(vm.runInContext('BibleLensConcepts.references("miracles in 1 John",catalog).length',bridge),0,'Do not confuse John and 1 John');
console.log('PASS: mocked semantic planning + cited app/web answers; privacy, auth, safe links, cache, SQLite quotas, provider failure/timeout, native pairing, policy revocation and offline client. Zero live API requests.');
if(fs.existsSync('dist/server/index.js')){
 const {default:worker}=await import('./built-worker.mjs');
 for(const [query,book,chapter]of [['show me examples of miracles',42,2],['people coming back to life',42,11],['healing',40,2],['feeding a crowd',40,6],['show miracles in John',42,2]]){
  const data=await (await worker.fetch(new Request('https://search.example.org/api/search?q='+encodeURIComponent(query)+'&edition=web'),{},{})).json();assert(data.passages.some(row=>row.book===book&&row.chapter===chapter),query);assert(data.passages.every(row=>row.text&&row.url.startsWith('#read/')),query);
  if(query==='show miracles in John')assert(data.passages.every(row=>row.book===42));
  if(query==='show me examples of miracles'){assert(data.passages.some(row=>!row.text.toLowerCase().includes('miracle')));assert(data.passages.some(row=>row.text.toLowerCase().includes('wine')));}
 }
 // Regression: subject/object meaning must outrank word overlap with manna.
 for(const edition of ['kjv','web','asv']){
  const message='did Israelites eat their children?';
  const local=await (await worker.fetch(new Request('https://search.example.org/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message,edition})}),{},{})).json();
  assert.equal(local.mode,'concept');assert(local.answer.includes('Some describe events; others warn'));
  assert.equal(local.sources[0].url,'#read/11/6/28');assert(local.evidence[0].text.toLowerCase().includes('son'));
  assert(!local.sources.some(row=>row.url.startsWith('#read/1/16/')));
  const found=await (await worker.fetch(new Request('https://search.example.org/api/search?q='+encodeURIComponent(message)+'&edition='+edition),{},{})).json();
  assert.equal(found.passages[0].url,'#read/11/6/28');assert(found.passages.some(row=>row.url==='#read/24/4/10'));
  for(const row of found.passages){const chapter=await(await worker.fetch(new Request('https://search.example.org/api/chapter?book='+row.book+'&chapter='+row.chapter),{},{})).json();assert(chapter.verses.some(verse=>verse.n===row.verse),'Every reference must open a real verse');}
 }
 for(const message of ['did Egyptians eat their children?','did imaginary Zorg eat their children?']){
  const absent=await(await worker.fetch(new Request('https://search.example.org/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message})}),{},{})).json();assert.equal(absent.mode,'missing');assert.equal(absent.sources.length,0);
 }
 const food=await(await worker.fetch(new Request('https://search.example.org/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:'did Israelites eat manna?'})}),{},{})).json();assert(food.answer.toLowerCase().includes('manna'),'An ordinary food question retains its meaning');
 f=fixture();const relationSpy=providerSpy(),priorFetch=globalThis.fetch;globalThis.fetch=relationSpy.fetchImpl;
 try{const data=await(await worker.fetch(request(f.user,{query:'did Israelites eat their children?'}),f.env,{})).json();assert.equal(data.status,'ready');const supplied=JSON.parse(relationSpy.calls[1].input).publicAppSources;assert.equal(supplied[0].url,'#read/11/6/28');assert(supplied.some(row=>row.text.toLowerCase().includes('eat')));assert(supplied.every(row=>!row.url.startsWith('#read/1/')&&!row.url.startsWith('#stories/')),'Irrelevant model rewrites must not contaminate this relation');assert(relationSpy.calls[1].instructions.includes('warning alone is not evidence'));}finally{globalThis.fetch=priorFetch;}
 // Exercise the actual lazy production route with a mocked provider.
 f=fixture();const integrated=providerSpy(),oldFetch=globalThis.fetch;globalThis.fetch=integrated.fetchImpl;
 try{const response=await worker.fetch(request(f.user),f.env,{});assert.equal((await response.json()).status,'ready');const sources=JSON.parse(integrated.calls[1].input).publicAppSources;assert(sources.some(row=>row.url.startsWith('#read/')&&row.text));assert(sources.some(row=>row.url.startsWith('#stories/')&&row.text));}finally{globalThis.fetch=oldFetch;}
 const unsupported='qzxv orbital marmalade ethics';
 const missing=await (await worker.fetch(new Request('https://search.example.org/api/search?q='+encodeURIComponent(unsupported)),{},{})).json();assert.equal(missing.passages.length,0);assert.equal(missing.research.length,0);
 const qualifiedRequest=new Request('https://search.example.org/api/search?q='+encodeURIComponent('miracles by the imaginary Zorg'));
 const qualified=await (await worker.fetch(qualifiedRequest,{},{})).json();assert.equal(qualified.passages.length,0,'A general concept set must not ignore an unsupported named qualifier');
 f=fixture();const withoutAppCalls=[];globalThis.fetch=async(_url,options)=>{
  const input=JSON.parse(options.body);withoutAppCalls.push(input);
  if(!input.tools){const plan=planData();plan.output[0].content[0].text='{"queries":[]}';return Response.json(plan);}
  const data=providerData(),text='No matching zLenz evidence was found. Web source.';data.output[1].content[0]={type:'output_text',text,annotations:[{type:'url_citation',start_index:37,end_index:47,url:'https://www.britannica.com/topic/miracle',title:'Web reference'}]};return Response.json(data);
 };
 try{const data=await (await worker.fetch(request(f.user,{query:unsupported}),f.env,{})).json();assert.equal(data.status,'ready');assert.equal(JSON.parse(withoutAppCalls[1].input).publicAppSources.length,0);assert(!data.sources.some(source=>source.sourceType==='app'));assert(!data.parts.some(part=>part.sourceType==='app'));}finally{globalThis.fetch=oldFetch;}
 f=fixture();const scopedCalls=[];globalThis.fetch=async(url,options)=>{
  const body=JSON.parse(options.body);scopedCalls.push(body);
  if(!body.tools)return Response.json(planData());
  const data=providerData(),text='No matching zLenz evidence was found. Web source.';data.output[1].content[0]={type:'output_text',text,annotations:[{type:'url_citation',start_index:37,end_index:47,url:'https://www.britannica.com/topic/miracle',title:'Web reference'}]};return Response.json(data);
 };
 try{const data=await (await worker.fetch(request(f.user,{query:'miracles in 1 John'}),f.env,{})).json();assert.equal(data.status,'ready');const supplied=JSON.parse(scopedCalls[1].input).publicAppSources;assert(supplied.every(source=>source.url.startsWith('#read/61/')||!source.url.startsWith('#read/')),'Model rewrites must retain the original book scope');assert(!supplied.some(source=>source.url.startsWith('#stories/john/')),'Do not confuse John stories with 1 John');}finally{globalThis.fetch=oldFetch;}
 console.log('PASS: real packaged concept retrieval and lazy online route use actual edition text and book scope. Provider responses remain mocked.');
}
