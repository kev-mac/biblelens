import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import worker from '../dist/server/index.js';
let payload,answerPayload;let requestNumber=0;
const originalFetch=globalThis.fetch;
globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.openai.com/v1/responses');payload=JSON.parse(options.body);if(payload.text.format.name==='research_answer')answerPayload=payload;return new Response(JSON.stringify({output:[{content:[{type:'output_text',text:JSON.stringify(payload.text.format.name==='answer_verification'?{supported:true,reason:'Fixture verification'}:{summary:'A short answer.',details:'Passage context [1].',source_ids:[1]})}]}]}));};
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
 for(const wording of ['what day was mankind created','what day was man created','when was humanity made']){const human=await ask(wording);assert(human.some(s=>s.url==='#read/0/1'&&s.text.includes('sixth day')));assert(human.some(s=>s.url==='#read/0/2'));}
 assert.match(answerPayload.instructions,/Describe that reading conditionally/);assert.match(answerPayload.instructions,/distinction in the summary itself/);
 for(const wording of ['is shrimp ok to eat according to the Bible?','Can Christians eat prawns?','Is shellfish forbidden?','What about lobster and crab?','Are oysters or clams unclean?','Can I eat mussels and scallops?']){const seafood=await ask(wording,{book:0,chapter:1});assert(seafood.some(s=>s.url==='#read/2/11'&&s.text.includes('fins and scales')));assert(seafood.some(s=>s.url==='#read/4/14'&&s.text.includes('ye may not eat')));assert(seafood.some(s=>s.url==='#read/40/7'));assert(seafood.some(s=>s.url==='#read/43/10'&&s.text.includes('any man common or unclean')));assert(seafood.some(s=>s.url==='#read/44/14'));}
 const seafoodFollowup=await ask('is it allowed then?',{history:[{role:'user',content:'Can I eat shrimp?'}]});assert(seafoodFollowup.some(s=>s.url==='#read/2/11'));assert(seafoodFollowup.some(s=>s.url==='#read/4/14'));
 assert.match(answerPayload.instructions,/rather than requiring the modern animal name/);assert.match(answerPayload.instructions,/uncontested seafood command/);
 assert.match(answerPayload.instructions,/Never assert that an event never happened/);
 assert.equal(payload.text.format.name,'answer_verification');assert.match(payload.instructions,/every substantive claim/);
 const translation=JSON.parse(fs.readFileSync('data/evidence.json','utf8')).find(r=>r.tags?.includes('T'));
 const translationSources=await ask(`${translation.title||''} ${translation.ref} ${translation.summary}`);
 assert(translationSources.some(s=>s.witness&&s.summary));for(const s of translationSources.filter(s=>s.witness))assert(s.text.startsWith(s.witness+': '+s.summary));
 assert.match(answerPayload.instructions,/lead that statement with its exact witness label/);assert.match(payload.instructions,/Septuagint-only difference/);
}finally{globalThis.fetch=originalFetch;}
const source=fs.readFileSync('src/reader.js','utf8'),c={books:[{id:1,name:'Exodus'}],esc:s=>String(s).replaceAll('<','&lt;'),chatMessages:[{role:'assistant',content:'Flies [source ID 1].',details:'Exodus 8 [1].',sources:[{id:1,label:'Exodus 8',url:'#read/1/8',kind:'Scripture'}]}],$:()=>c.node};c.node={};vm.createContext(c);vm.runInContext(source.slice(source.indexOf('function sourceHtml'),source.indexOf("$('#chat-form').onsubmit")),c);c.chatMessages.unshift({role:'user',content:'Old question'},{role:'assistant',content:'Old answer'});c.renderChat();assert.match(c.node.innerHTML,/Old question/);assert.match(c.node.innerHTML,/Old answer/);assert.match(source,/selected:selection,history/);assert.match(source,/id="reader-question" type="text" autocomplete="off"/);assert.match(fs.readFileSync("src/index.html","utf8"),/id="chat-input" type="text" autocomplete="off"/);assert.match(c.node.innerHTML,/Flies \./);assert.match(c.node.innerHTML,/<details class="comparison-details chat-details">/);assert.doesNotMatch(c.node.innerHTML,/<details[^>]* open/);assert.match(c.node.innerHTML,/class="verse-citation chat-citation"/);assert.doesNotMatch(c.sourceHtml({url:'javascript:alert(1)'}),/javascript/);
console.log('PASS: global retrieval across chapters, plague sequence, named references, no reading prerequisite, separate summary/details and safe citation chips.');
