import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import worker from './built-worker.mjs';
import {parseSemanticPlan} from '../worker/combined-search.mjs';
const db=new DatabaseSync(':memory:');for(const file of fs.readdirSync('drizzle').filter(file=>file.endsWith('.sql')))db.exec(fs.readFileSync('drizzle/'+file,'utf8'));
const DB={prepare(sql){return{bind(...args){return{async first(){return db.prepare(sql).get(...args)||null;},async run(){return db.prepare(sql).run(...args);}};}};}};
const env={DB,OPENAI_API_KEY:'test-only-not-a-real-api-key',BIBLELENS_AI_ALLOWED_USERS:'semantic-tester'};
const oldFetch=globalThis.fetch;let plan={queries:[],passages:[],topics:[]},calls=0,userCount=0;
const reply=()=>({status:'completed',usage:{input_tokens:20,output_tokens:30},output:[{type:'message',role:'assistant',content:[{type:'output_text',text:JSON.stringify(plan)}]}]});
globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.openai.com/v1/responses');const body=JSON.parse(options.body);assert(!body.tools,'Retrieval must not request web search');assert.equal(body.store,false);assert.equal(body.max_output_tokens,600);assert(!options.body.includes('PRIVATE NOTE'));calls++;return Response.json(reply());};
async function retrieve(query,edition='kjv',path='/api/retrieve',extraEnv={}){
 const user='semantic-tester-'+(++userCount);return(await worker.fetch(new Request('https://semantic.test'+path,{method:'POST',headers:{'content-type':'application/json','x-biblelens-ai':'1','oai-authenticated-user-id':user},body:JSON.stringify({query,edition})}),{...env,BIBLELENS_AI_ALLOWED_USERS:user,...extraEnv},{}));
}
const cases=[
 ['Who made an iron tool float?', '2 Kings 6:5-7','#read/11/6/5-7'],
 ['Where is a donkey described as speaking?', 'Numbers 22:28-30','#read/3/22/28-30'],
 ['A king asks a medium to summon someone who died', '1 Samuel 28:7-8','#read/8/28/7-8'],
 ['Which prophet eats a scroll?', 'Ezekiel 3:1-3','#read/25/3/1-3'],
 ['Which law says to pay workers before sunset?', 'Deuteronomy 24:14-15','#read/4/24/14-15'],
 ['Someone returns an enemy\'s wandering animal', 'Exodus 23:4-5','#read/1/23/4-5'],
 ['A woman advises a leader to stop bloodshed', '1 Samuel 25:32-33','#read/8/25/32-33'],
 ['People share possessions with those who need help', 'Acts 4:32-35','#read/43/4/32-35'],
 ['Spouses have mutual obligations concerning their bodies', '1 Corinthians 7:3-4','#read/45/7/3-4'],
 ['Someone forgives a debt but will not forgive another debt', 'Matthew 18:28-30','#read/39/18/28-30']
];
try{
 for(const [query,reference,url]of cases){plan={queries:[],passages:[reference],topics:[]};const result=await(await retrieve(query)).json();assert.equal(result.status,'ready',query);assert.equal(result.appResults[0].url,url,query);assert(result.appResults[0].text,query);assert.equal(result.usage.responseCalls,1);assert.equal(result.usage.webCalls,0);assert.equal(result.retrieval.method,'model-guided-corpus');}
 plan={queries:[],passages:[],topics:[]};assert.equal((await(await retrieve('did Israelites eat their children?')).json()).appResults.length,0,'An empty semantic plan cannot inherit a subject patch or unrelated word-only commentary');
 plan={queries:[],passages:['John 3:999','https://attacker.example/a','Genesis 0:1'],topics:['INVENTED SUBJECT']};assert.equal((await(await retrieve('unsupported premise')).json()).appResults.length,0);
 plan={queries:[],passages:['John 3:16'],topics:[]};let result=await(await retrieve('a question specifically in 1 John')).json();assert(!result.appResults.some(row=>row.url.startsWith('#read/42/')),'Original book scope survives a model mistake');
 result=await(await retrieve('John 4:1')).json();assert.equal(result.appResults[0].url,'#read/42/4/1','Explicit requested verse survives unrelated model proposals');
 plan={queries:[],passages:['Acts 8:37'],topics:[]};assert(!(await(await retrieve('Acts 8:37','web')).json()).appResults.some(row=>row.kind.startsWith('Primary scripture')&&row.url.includes('/8/37')),'Do not replace missing edition text');
 const before=calls;assert.equal((await retrieve('John 3:16','kjv','/api/retrieval-evaluation')).status,403);assert.equal((await retrieve('PRIVATE NOTE','kjv','/api/retrieval-evaluation',{BIBLELENS_AI_EVALUATION_ENABLED:'1'})).status,403);assert.equal(calls,before,'Evaluation flag and fixed queries are required');
 plan={queries:[],passages:['John 3:16'],topics:[]};const evaluated=await(await retrieve('John 3:16','kjv','/api/retrieval-evaluation',{BIBLELENS_AI_EVALUATION_ENABLED:'1'})).json();assert.equal(evaluated.status,'ready');assert.equal(db.prepare("SELECT status FROM ai_search_requests WHERE id='eval:semantic-v1:Q01'").get().status,'ready');
 const duplicate=await(await retrieve('John 3:16','kjv','/api/retrieval-evaluation',{BIBLELENS_AI_EVALUATION_ENABLED:'1'})).json();assert.equal(duplicate.status,'limited','A case is reserved once across accounts and isolates');
 for(let i=1;i<=4;i++)db.prepare('INSERT INTO ai_search_requests(id,user_hash,created_at) VALUES(?,?,?)').run('eval:semantic-v1:test-'+i,'evaluation',Date.now());
 const ceiling=await(await retrieve('jn 3:16','kjv','/api/retrieval-evaluation',{BIBLELENS_AI_EVALUATION_ENABLED:'1'})).json();assert.equal(ceiling.status,'limited','Evaluation has its own five-per-minute ceiling');
 db.prepare("UPDATE ai_search_requests SET created_at=? WHERE id LIKE 'eval:%'").run(Date.now()-86400000);
 for(let i=0;i<45;i++)db.prepare('INSERT INTO ai_search_requests(id,user_hash,created_at) VALUES(?,?,?)').run('eval:semantic-v1:cap-'+i,'evaluation',Date.now()-86400000);
 const exhausted=await(await retrieve('jn 3:16','kjv','/api/retrieval-evaluation',{BIBLELENS_AI_EVALUATION_ENABLED:'1'})).json();assert.equal(exhausted.status,'limited','The fifty-call lifetime ceiling survives daily cleanup');assert.equal(db.prepare("SELECT COUNT(*) count FROM ai_search_requests WHERE id LIKE 'eval:%'").get().count,50);
 const parsed=parseSemanticPlan({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({queries:['a','a',null],passages:Array(30).fill('John 3:16'),topics:['CARE']})}]}]});assert.deepEqual(parsed,{queries:['a'],passages:['John 3:16'],topics:['CARE']});
 console.log('PASS: ten independent semantic-plan fixtures resolve actual app text; missing verses, editions, scope, explicit references and unsupported inputs stay safe. Evaluation flag, fixed cases, one-time reservations and rate ceiling pass. Provider replies are mocked; this is not measured model recall.');
}finally{globalThis.fetch=oldFetch;db.close();}
