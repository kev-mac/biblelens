import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import worker from '../dist/server/index.js';
let payload;let requestNumber=0;
const originalFetch=globalThis.fetch;
globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.openai.com/v1/responses');payload=JSON.parse(options.body);return new Response(JSON.stringify({output:[{content:[{type:'output_text',text:JSON.stringify({summary:'A short answer.',details:'Passage context [1].',source_ids:[1]})}]}]}));};
async function ask(message,extra={}){const res=await worker.fetch(new Request('https://scripture.test/api/chat',{method:'POST',headers:{'oai-authenticated-user-id':'test-'+(++requestNumber),'content-type':'application/json'},body:JSON.stringify({message,...extra})}),{OPENAI_API_KEY:'test-only'},{});assert.equal(res.status,200);const body=await res.json();assert.equal(body.answer,'A short answer.');assert.equal(body.details,'Passage context [1].');assert.equal(body.context,'Whole Bible');return JSON.parse(payload.input.at(-1).content).sources;}
try{
 const plague=await ask('what was the 4th plague',{book:1,chapter:7});assert(plague.some(s=>s.url==='#read/1/8'&&s.text.includes('flies')));assert(plague.some(s=>s.url==='#read/1/12'));
 const john=await ask('Explain John 3:16',{book:0,chapter:1});assert(john.some(s=>s.url==='#read/42/3'&&s.text.includes('God so loved')));assert(!john.some(s=>s.url==='#read/0/1'));
 const noReader=await ask('Who was Ruth?');assert(noReader.some(s=>s.label.startsWith('Ruth')));
 const moses=await ask('who did moses kill?');assert(moses.some(s=>s.url==='#read/1/2'&&s.text.includes('slew the Egyptian')));
 const cain=await ask('Who did Cain kill?');assert(cain.some(s=>s.url==='#read/0/4'&&s.text.includes('slew him')));
 const goliath=await ask('Who killed Goliath?');assert(goliath.some(s=>s.url==='#read/8/17'));
 const followup=await ask("didn't he kill a soldier that was beating a slave?",{history:[{role:'user',content:'who did moses kill?'}]});assert(followup.some(s=>s.url==='#read/1/2'));
 const judas=await ask('how did Judas die?');assert(judas.some(s=>s.url.startsWith('#read/43/1')));assert(judas.some(s=>s.url.startsWith('#read/39/27')));
 const adam=await ask('what day was adam created');assert(adam.some(s=>s.url==='#read/0/1'&&s.text.includes('sixth day')));assert(adam.some(s=>s.url==='#read/0/2'));
 assert.match(payload.instructions,/Never assert that an event never happened/);
 assert.deepEqual(payload.text.format.schema.required,['summary','details','source_ids']);assert.match(payload.instructions,/NO citation markers/);
}finally{globalThis.fetch=originalFetch;}
const source=fs.readFileSync('src/reader.js','utf8'),c={books:[{id:1,name:'Exodus'}],esc:s=>String(s).replaceAll('<','&lt;'),chatMessages:[{role:'assistant',content:'Flies [source ID 1].',details:'Exodus 8 [1].',sources:[{id:1,label:'Exodus 8',url:'#read/1/8',kind:'Scripture'}]}],$:()=>c.node};c.node={};vm.createContext(c);vm.runInContext(source.slice(source.indexOf('function sourceHtml'),source.indexOf("$('#chat-form').onsubmit")),c);c.chatMessages.unshift({role:'user',content:'Old question'},{role:'assistant',content:'Old answer'});c.renderChat();assert.match(c.node.innerHTML,/Old question/);assert.match(c.node.innerHTML,/Old answer/);assert.match(source,/selected:selection,history/);assert.match(source,/id="reader-question" type="text" autocomplete="off"/);assert.match(fs.readFileSync("src/index.html","utf8"),/id="chat-input" type="text" autocomplete="off"/);assert.match(c.node.innerHTML,/Flies \./);assert.match(c.node.innerHTML,/<details class="comparison-details chat-details">/);assert.doesNotMatch(c.node.innerHTML,/<details[^>]* open/);assert.match(c.node.innerHTML,/class="verse-citation chat-citation"/);assert.doesNotMatch(c.sourceHtml({url:'javascript:alert(1)'}),/javascript/);
console.log('PASS: global retrieval across chapters, plague sequence, named references, no reading prerequisite, separate summary/details and safe citation chips.');
