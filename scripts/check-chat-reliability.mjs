import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import worker from '../dist/server/index.js';
const code=fs.readFileSync('dist/server/index.js','utf8'),ctx={Response,Blob,DecompressionStream,Uint8Array,atob};vm.createContext(ctx);vm.runInContext(code.slice(0,code.indexOf('async function chat('))+'this.gather=gatherSources;this.books=namedBooks;',ctx);
const cases=[
 ['did moses kill anyone is exodus?','#read/1/2','slew the Egyptian'],
 ['Did Moses kill anyone in Exodus?','#read/1/2','slew the Egyptian'],
 ['Who did Moses kill?','#read/1/2','slew the Egyptian'],
 ['Did Moses slay an Egyptian?','#read/1/2','slew the Egyptian'],
 ['Who did Cain kill?','#read/0/4','slew him'],
 ['Who killed Goliath in 1 Samuel?','#read/8/17','Goliath'],
 ['What was the fourth plague in Exodus?','#read/1/8','flies'],
 ['Can I eat shrimp?','#read/2/11','fins and scales'],
 ['Is shellfish forbidden?','#read/4/14','ye may not eat'],
 ['What day was Adam created?','#read/0/1','sixth day'],
 ['What day was mankind created?','#read/0/2','formed man'],
 ['Explain John 3:16','#read/42/3','God so loved'],
 ['Explain 1 John 3:16','#read/61/3','laid down his life'],
 ['Who was Ruth?','#read/7/1','Ruth']
];
for(const [question,url,words]of cases){const sources=await ctx.gather(question,4,31,[]);assert(sources.some(s=>s.url===url&&s.text.includes(words)),`Missing known passage: ${question}`);if(/in Exodus|is exodus/i.test(question))assert(sources.filter(s=>s.kind.startsWith('Primary')).every(s=>s.url.startsWith('#read/1/')),`Lost book scope: ${question}`);}
assert.deepEqual(Array.from(ctx.books('Explain 1 John 3:16'),b=>b.id),[61]);
const normal=await ctx.gather('Did Moses kill anyone in Exodus?',4,31,[]),broader=await ctx.gather('Did Moses kill anyone in Exodus?',4,31,[],'',true);assert(broader.reduce((n,s)=>n+s.text.length,0)>normal.reduce((n,s)=>n+s.text.length,0));
const follow=await ctx.gather('who did moses kill? did he kill a soldier beating a slave?',4,31,[],'who did moses kill?');assert(follow.some(s=>s.url==='#read/1/2'));
const old=globalThis.fetch;let calls=0,verifications=0;
try{
 globalThis.fetch=async(url,options)=>{calls++;const payload=JSON.parse(options.body),verify=payload.text.format.name==='answer_verification';if(verify)verifications++;const answer=verify?{supported:false,reason:'Unsupported book-wide denial'}:{summary:'Moses is not recorded as killing anyone in Exodus.',details:'An unsupported denial [1].',source_ids:[1]};return new Response(JSON.stringify({output:[{content:[{type:'output_text',text:JSON.stringify(answer)}]}]}));};
 const response=await worker.fetch(new Request('https://scripture.test/api/chat',{method:'POST',headers:{'oai-authenticated-user-id':'reliability-negative','content-type':'application/json'},body:JSON.stringify({message:'Did Moses kill anyone in Exodus?'})}),{OPENAI_API_KEY:'fixture-only'},{}),answer=await response.json();assert.equal(response.status,200);assert(answer.answer.startsWith('I couldn’t locate'));assert(!answer.answer.includes('not recorded'));assert.equal(calls,2);assert.equal(verifications,0);assert(answer.details.includes('Passages searched:'));assert(answer.sources.some(s=>s.url==='#read/1/2'));
 calls=0;verifications=0;globalThis.fetch=async(url,options)=>{calls++;const payload=JSON.parse(options.body),verify=payload.text.format.name==='answer_verification';if(verify)verifications++;return new Response(JSON.stringify({output:[{content:[{type:'output_text',text:JSON.stringify(verify?{supported:false,reason:'Claim not supported'}:{summary:'An unsupported positive claim.',details:'Claim [1].',source_ids:[1]})}]}]}));};
 const denied=await worker.fetch(new Request('https://scripture.test/api/chat',{method:'POST',headers:{'oai-authenticated-user-id':'reliability-unsupported','content-type':'application/json'},body:JSON.stringify({message:'Who did Moses kill?'})}),{OPENAI_API_KEY:'fixture-only'},{});assert((await denied.json()).answer.startsWith('I couldn’t locate'));assert.equal(calls,4);assert.equal(verifications,2);
}finally{globalThis.fetch=old;}
console.log(`PASS: ${cases.length} known-passage questions, named-book/numbered-book scope, follow-ups, broader retry, rejected negatives and unsupported positives. Model answers in this check are fixtures; hosted generated-answer tests are separate.`);
