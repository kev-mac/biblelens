import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {debatePage,debateVerdict} from '../worker/debates.mjs';
import {exploreFeed} from './explore-feed.mjs';
const records=JSON.parse(fs.readFileSync('data/evidence.json'));
const original=JSON.stringify(records);
for(const record of records){const expected=['science','history'].includes(record.mode)?{Agrees:'Evidence agrees',Disagrees:'Evidence disagrees',Context:'Not settled'}:{'Textual conflict':'Real conflict',Context:'Open question'};assert.equal(debateVerdict(record),expected[record.status],record.id);}
for(const mode of ['text','science','history']){
 const included=records.filter(record=>mode==='text'?!['science','history'].includes(record.mode):record.mode===mode);
 const rows=[];for(let page=0;page<Math.ceil(included.length/24);page++)rows.push(...debatePage(records,new URLSearchParams({mode,page})).records);
 assert.deepEqual(rows.map(row=>row.id),included.map(row=>row.id),'Pagination loses no records');
 for(const status of new Set(included.map(record=>record.status))){const page=debatePage(records,new URLSearchParams({mode,status}));assert.equal(page.total,included.filter(record=>record.status===status).length);assert(page.records.every(record=>record.status===status));}
}
for(const filter of ['Q','T','commandments'])assert(debatePage(records,new URLSearchParams({filter})).total>0,filter);
assert.equal(debatePage(records,new URLSearchParams({filter:'V'})).total,records.filter(record=>(record.tags||[record.tag]).includes('V')).length,'Preserve the empty Violations category without new judgments');
assert.equal(debatePage(records,new URLSearchParams({mode:'invented'})),null);
assert.equal(debatePage(records,new URLSearchParams({status:'Can be reconciled'})).total,0,'No inferred verdicts');
const day=new URLSearchParams({day:'2026-10-26'});assert.deepEqual(debatePage(records,day),debatePage(records,day));assert.equal(debatePage(records,day).total,1);
assert.equal(JSON.stringify(records),original,'Rendering and filtering never alter records');
const feed=exploreFeed();assert.equal(Object.keys(feed).length,9);for(const items of Object.values(feed)){assert(items.length>0);for(const item of items)assert(item.url||item.placeId);}
for(const key of ['text','science','history','translation'])for(const item of feed[key])assert(records.some(record=>record.id===item.id));
const data=new Map(),events={};let fail=false;
const storage={getItem:key=>data.get(key)||null,setItem:(key,value)=>{if(fail)throw Error('Quota');data.set(key,value);},key:index=>[...data.keys()][index],get length(){return data.size;}};
const window={addEventListener:(name,fn)=>events[name]=fn,dispatchEvent(){}};
vm.runInNewContext(fs.readFileSync('src/debate-store.js','utf8'),{window,localStorage:storage,Event:class{}});
const store=window.BibleLensDebateStore;
assert(store.write('legacy-science-1',{stance:'B'}));assert(store.write('legacy-science-1',{saved:true}));assert.equal(store.read('legacy-science-1').stance,'B');assert.equal(store.read('legacy-science-1').saved,true);
assert(store.write('another-record',{saved:true}));assert.equal(Object.keys(store.all()).length,2);
assert.equal(store.write('__proto__',{saved:true}),false,'Reject prototype keys in imported device data');
assert.equal(store.write('bad/id',{saved:true}),false);assert.equal(store.write('legacy-science-1',{stance:'invented'}),false);
fail=true;assert.equal(store.write('legacy-science-1',{stance:'A'}),false);assert.equal(store.read('legacy-science-1').stance,'B');fail=false;
store.restore({'legacy-science-1':{saved:false,stance:'A'},restored:{saved:true,stance:'Not sure'}});
assert.equal(store.read('legacy-science-1').stance,'B','Import preserves a current choice');assert.equal(store.read('legacy-science-1').saved,true);assert.equal(store.read('restored').stance,'Not sure');
const sync=fs.readFileSync('src/sync-core.js','utf8');assert(!sync.includes('deviceDebates'),'Choices stay outside the cloud schema');
const app=fs.readFileSync('src/app.js','utf8');assert(app.includes('deviceDebates:window.BibleLensDebateStore?.all()'));assert(app.includes('restore(backup.deviceDebates)'));
const html=fs.readFileSync('src/index.html','utf8');assert.deepEqual([...html.matchAll(/data-lens-view="([^"]+)"/g)].map(match=>match[1]),['explore','read','debates','notebook']);
const worker=(await import('../dist/server/index.js')).default;
const get=path=>worker.fetch(new Request('https://test.invalid'+path),{},{});
assert.equal((await get('/api/debate?id=missing')).status,404);
const sample=records.find(record=>record.sides?.length>2)||records.find(record=>record.sides?.length);
const detail=await (await get('/api/debate?id='+sample.id)).json();assert.deepEqual(detail,{...sample,verdict:debateVerdict(sample)},'Every exact field and all side quotes survive packaging');
assert.equal((await (await get('/api/debates?mode=science&status=Disagrees')).json()).total,records.filter(record=>record.mode==='science'&&record.status==='Disagrees').length);
console.log('PASS: all current verdicts, full pagination, topic filters, deterministic daily selection, exact detail fields, missing IDs, local choices/saves, backup merge and four tabs.');
