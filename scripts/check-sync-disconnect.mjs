import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {syncFixture} from './security-test-fixture.mjs';
import '../src/sync-core.js';
const fixture=syncFixture(),key='biblelens-cloud-sync-v1',core=globalThis.BibleLensSync;
const settle=async()=>{for(let i=0;i<30;i++)await new Promise(resolve=>setImmediate(resolve));};
function client(storage,{native=true,fetcher}={}){
 const events={},elements=new Map(),buttons=[];let poll;
 const node=()=>({children:[],textContent:'',append(...nodes){this.children.push(...nodes);},replaceChildren(...nodes){this.children=nodes;},setAttribute(){},select(){}});
 const status=node(),actions=node(),pair=node(),panel=node();
 panel.querySelector=selector=>({'[data-sync-status]':status,'.sync-actions':actions,'.sync-pair':pair}[selector]);
 const context={state:{bookmarks:[],notes:{offline:'Keep offline notes'}},window:{BibleLensSync:core,addEventListener:(type,fn)=>events[type]=fn},document:{hidden:false,documentElement:{classList:{contains:()=>native}},createElement:tag=>{if(tag==='section')return panel;const n=node();if(tag==='button')buttons.push(n);return n;},querySelector:selector=>{if(!elements.has(selector))elements.set(selector,node());return elements.get(selector);},addEventListener:(type,fn)=>events[type]=fn},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},navigator:{onLine:true},location:{hash:''},AbortSignal,URL,Blob,fetch:fetcher||(()=>{throw Error('Unexpected fetch');}),setTimeout:()=>1,clearTimeout(){},setInterval:fn=>{poll=fn;},applyWorkspaceSnapshot:data=>{core.apply(context.state,data);context.applied++;},persist(){},applied:0};
 vm.runInNewContext(fs.readFileSync('src/sync.js','utf8'),context);events.DOMContentLoaded();
 return {context,events,status,actions,poll:()=>poll(),click:async label=>{const button=actions.children.find(b=>b.textContent===label);assert(button,'Missing button: '+label);await button.onclick();},meta:()=>JSON.parse(storage.get(key))};
}
try{
 const device=await fixture.pair();let fail=true,requests=[];
 const fetcher=async(url,options)=>{const path=new URL(url,'https://bible.test').pathname.replace('/api/sync','');requests.push(path);if(path==='/disconnect'&&fail)throw Error('Offline');return fixture.call(path,{method:options.method,body:options.body&&JSON.parse(options.body),token:options.headers.authorization?.slice(7)});};
 const storage=new Map([[key,JSON.stringify({enabled:true,base:{},owner:device.userId,token:device.token})]]);
 let app=client(storage,{fetcher});await settle();await app.click('Turn Off Sync');
 assert.equal(app.meta().enabled,false);assert.equal(app.meta().disconnectPending,true);assert.equal(app.meta().token,device.token);assert.match(app.status.textContent,/pending/);
 assert.equal(app.context.state.notes.offline,'Keep offline notes');assert.equal((await fixture.call('/document',{token:device.token})).status,200);
 requests=[];app=client(storage,{fetcher});await settle();assert.deepEqual(requests,['/disconnect'],'Reload must retry revocation without resuming sync');
 fail=false;app.events.online();await settle();assert.equal(app.meta().token,null);assert(!app.meta().disconnectPending);assert.equal((await fixture.call('/document',{token:device.token})).status,401);
 requests=[];app.events.focus();app.poll();await settle();assert.deepEqual(requests,[],'Disconnect must stay off');
 console.log('PASS: failed native disconnect survives reload, retries on reconnect, revokes the copied token and keeps offline notes.');
 // Lost success response: retry sees 401 and clears the already-revoked secret.
 const second=await fixture.pair();storage.set(key,JSON.stringify({enabled:false,disconnectPending:true,token:second.token}));await fixture.call('/disconnect',{method:'POST',token:second.token});
 app=client(storage,{fetcher});await settle();assert.equal(app.meta().token,null);assert(!app.meta().disconnectPending);
 console.log('PASS: already-revoked/expired tokens clear on 401 without enabling sync.');
 // Pause a document read, then turn sync off while it is in flight.
 const third=await fixture.pair();storage.set(key,JSON.stringify({enabled:true,base:{},owner:third.userId,token:third.token}));let finishRead;
 app=client(storage,{fetcher:async(url,options)=>url.endsWith('/document')&&!options.method?new Promise(resolve=>{finishRead=resolve;}):fetcher(url,options)});await settle();assert(finishRead);
 await app.click('Turn Off Sync');finishRead(Response.json({revision:1,data:{notes:{remote:'Must not apply after disconnect'}}}));await settle();
 assert.equal(app.context.applied,0);assert.equal(app.context.state.notes.offline,'Keep offline notes');assert.equal(app.meta().enabled,false);assert.equal(app.meta().token,null);
 console.log('PASS: a late sync response cannot apply cloud data or restore credentials after disconnect.');
 storage.set(key,JSON.stringify({enabled:false,token:'unused-web-token',base:{}}));let authorization;
 app=client(storage,{native:false,fetcher:async(url,options)=>{authorization=options.headers.authorization;return Response.json({userId:'security-test'});}});await settle();
 assert.equal(app.meta().token,null);assert.equal(authorization,undefined);
 console.log('PASS: web sync removes unused bearer credentials and sends only the signed-in session.');
}finally{fixture.close();}
