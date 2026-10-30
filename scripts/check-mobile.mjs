import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Worker} from 'node:worker_threads';
import {installDeviceApi} from '../src/device-api.js';
import {conversationInput,conversationalResult} from '../src/device-conversation.js';

const config=JSON.parse(fs.readFileSync('capacitor.config.json'));
assert.equal(config.webDir,'www');assert(!config.server?.url,'No remote application host');
const html=fs.readFileSync('www/index.html','utf8');
assert(html.indexOf('id="biblelens-device-bootstrap"')>=0,'Offline bootstrap is included');
assert(html.indexOf('id="biblelens-device-bootstrap"')<html.indexOf('id="biblelens-app-script"'),'Offline API bootstrap executes before the application bundle');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g))if(!/^https?:/.test(match[1]))assert(fs.existsSync('www/'+match[1].split('?')[0].replace(/^\//,'')),match[1]);

// Exercise the actual browser worker module and bundled engine through a Node
// adapter. Any attempted network fetch inside the engine fails this check.
class DeviceWorker{
 constructor(){
  this.worker=new Worker(`const {parentPort}=require('node:worker_threads');globalThis.fetch=()=>{throw Error('Network forbidden');};globalThis.self={postMessage:data=>parentPort.postMessage(data)};import(${JSON.stringify(new URL('../www/device-api-worker.js',import.meta.url).href)}).then(()=>parentPort.on('message',data=>self.onmessage({data})));`,{eval:true});
  this.worker.on('message',data=>this.onmessage?.({data}));this.worker.on('error',error=>this.onerror?.(error));
 }
 postMessage(data){this.worker.postMessage(data);}
 terminate(){this.worker.terminate();}
}
let networkCalls=0;
const target={Worker:DeviceWorker,location:{href:'https://device.test/',origin:'https://device.test'},fetch:async()=>{networkCalls++;throw Error('Network forbidden');}};
const restore=installDeviceApi(target);
try{
 const books=await (await target.fetch('/api/books')).json();assert.equal(books.length,66+JSON.parse(fs.readFileSync('data/lost-books/books.json','utf8')).length);assert.equal(books.slice(0,66).filter(b=>b.collection).length,0);
 const chapter=await (await target.fetch('/api/chapter?book=42&chapter=3')).json();assert(chapter.verses.some(v=>v.n===16&&v.kjv.includes('God so loved')));
 for(const book of books.filter(b=>b.collection)){const lost=await (await target.fetch('/api/chapter?book='+book.id+'&chapter=1')).json();assert.equal(lost.editionLabel,book.collection+' · '+book.edition);assert(lost.verses.length);}
 const lostSearch=await (await target.fetch('/api/search?lost=1&q=hidden%20sayings')).json();assert(lostSearch.passages.some(p=>p.collection==='Gnostic'));
 const comparison=await (await target.fetch('/api/comparisons?book=0&chapter=1&mode=questions')).json();assert(Array.isArray(comparison.items));
 const categories=await (await target.fetch('/api/categories?book=all&kind=T')).json();assert.equal(categories.records.length,24);assert(categories.total>24);const next=await (await target.fetch('/api/categories?book=all&kind=T&page=1')).json();assert.equal(next.records.length,24);assert.notEqual(next.records[0].key,categories.records[0].key);
 for(const [kind,minimum] of [['stories',1],['characters',3000],['prophecies',3]]){const page=await (await target.fetch('/api/categories?book=all&kind='+kind)).json();assert(page.total>=minimum,kind);assert(page.records.length<=24);assert(page.records.every(record=>record.mode===kind));}
 const debates=await (await target.fetch('/api/debates?mode=science')).json();assert(debates.records.length);assert(debates.records.every(record=>record.mode==='science'));
 const detail=await (await target.fetch('/api/debate?id='+debates.records[0].id)).json();assert.equal(detail.status,debates.records[0].status);assert(detail.scope);assert.equal((await target.fetch('/api/debate?id=missing')).status,404);
 const [shark,john]=await Promise.all(['can we eat shark','Explain John 3:16'].map(async message=>(await target.fetch('/api/chat',{method:'POST',body:JSON.stringify({message})})).json()));
 assert.equal(shark.mode,'dietary');assert(!shark.answer.includes('honey'));assert(john.answer.includes('God so loved'));
 const sermon=await (await target.fetch('/api/chat',{method:'POST',body:JSON.stringify({message:'Sermon on the Mount'})})).json();
 assert.equal(sermon.mode,'named-passage');assert.match(sermon.answer,/Matthew 5–7/);
 for(const chapter of [5,6,7])assert(sermon.sources.some(source=>source.url==='#read/39/'+chapter));
 const input=conversationInput('Explain John 3:16',john,[{role:'user',content:'Who is speaking?'}]);assert(input.sources.length);
 const output=JSON.stringify({answer:'This passage describes God’s love and the promise of life.',sourceIds:[input.sources[0].id]});assert(conversationalResult(output,input));
 assert.equal(conversationalResult(JSON.stringify({answer:'An unsupported citation appears here.',sourceIds:['invented']}),input),null);
 assert.equal(conversationalResult(JSON.stringify({answer:'Visit https://example.test for this answer.',sourceIds:[input.sources[0].id]}),input),null);
 assert.equal(conversationInput('can we eat shark',shark),null,'Qualified dietary answer cannot be overwritten by a model');
 const controller=new AbortController();controller.abort();await assert.rejects(target.fetch('/api/books',{signal:controller.signal}),{name:'AbortError'});
 assert.equal(networkCalls,0,'Reading, comparisons and chat must never reach a server');
}finally{restore();}
console.log('PASS: mobile worker reading, comparisons, chat, concurrent calls, citation provenance, qualified-answer preservation, abort handling and zero network requests. Native inference is not simulated or verified.');
