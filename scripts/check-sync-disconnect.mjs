import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {syncFixture} from './security-test-fixture.mjs';
import '../src/sync-core.js';
const fixture=syncFixture(),key='biblelens-cloud-sync-v1',core=globalThis.BibleLensSync;
const settle=async()=>{for(let i=0;i<30;i++)await new Promise(resolve=>setImmediate(resolve));};
async function until(check){const deadline=Date.now()+5000;while(!check()){if(Date.now()>deadline)throw Error('Timed out waiting for sync state');await new Promise(resolve=>setTimeout(resolve,5));}}
function client(storage,{native=true,fetcher}={}){
 const events={},elements=new Map(),buttons=[];let poll,timers=0;
 const node=()=>({children:[],textContent:'',append(...nodes){this.children.push(...nodes);},replaceChildren(...nodes){this.children=nodes;},setAttribute(){},select(){}});
 const status=node(),actions=node(),pair=node(),panel=node();
 panel.querySelector=selector=>({'[data-sync-status]':status,'.sync-actions':actions,'.sync-pair':pair}[selector]);
 const context={state:{bookmarks:[],notes:{offline:'Keep offline notes'}},window:{BibleLensSync:core,addEventListener:(type,fn)=>events[type]=fn},document:{hidden:false,documentElement:{classList:{contains:()=>native}},createElement:tag=>{if(tag==='section')return panel;const n=node();if(tag==='button')buttons.push(n);return n;},querySelector:selector=>{if(!elements.has(selector))elements.set(selector,node());return elements.get(selector);},addEventListener:(type,fn)=>events[type]=fn},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},navigator:{onLine:true},location:{hash:''},AbortSignal:{timeout:AbortSignal.timeout.bind(AbortSignal)},AbortController,URL,Blob,fetch:fetcher||(()=>{throw Error('Unexpected fetch');}),setTimeout:()=>++timers,clearTimeout(){},setInterval:fn=>{poll=fn;},applyWorkspaceSnapshot:data=>{core.apply(context.state,data);context.applied++;},persist(){},applied:0};
 vm.runInNewContext(fs.readFileSync('src/sync.js','utf8'),context);events.DOMContentLoaded();
 return {context,events,status,actions,get timers(){return timers;},poll:()=>poll(),click:async label=>{const button=actions.children.find(b=>b.textContent===label);assert(button,'Missing button: '+label);await button.onclick();},meta:()=>JSON.parse(storage.get(key))};
}
try{
 const device=await fixture.pair();let fail=true,requests=[];
 const fetcher=async(url,options)=>{const path=new URL(url,'https://bible.test').pathname.replace('/api/sync','');requests.push(path);if(path==='/disconnect'&&fail)throw Error('Offline');return fixture.call(path,{method:options.method,body:options.body&&JSON.parse(options.body),token:options.headers.authorization?.slice(7)});};
 const storage=new Map([[key,JSON.stringify({enabled:true,base:{},owner:device.userId,token:device.token})]]);
 let app=client(storage,{fetcher});await settle();await app.click('Turn Off Sync');
 assert.equal(app.meta().enabled,false);assert.equal(app.meta().disconnectPending,true);assert.equal(app.meta().token,device.token);assert.match(app.status.textContent,/pending/);
 assert.equal(app.context.state.notes.offline,'Keep offline notes');assert.equal((await fixture.call('/document',{token:device.token})).status,200);
 requests=[];app=client(storage,{fetcher});await settle();assert.deepEqual(requests,['/disconnect'],'Reload must retry revocation without resuming sync');
 fail=false;app.events.online();await until(()=>app.meta().token===null);assert.equal(app.meta().token,null);assert(!app.meta().disconnectPending);assert.equal((await fixture.call('/document',{token:device.token})).status,401);
 requests=[];app.events.focus();app.poll();await settle();assert.deepEqual(requests,[],'Disconnect must stay off');
 console.log('PASS: failed native disconnect survives reload, retries on reconnect, revokes the copied token and keeps offline notes.');
 // Lost success response: retry sees 401 and clears the already-revoked secret.
 const second=await fixture.pair();storage.set(key,JSON.stringify({enabled:false,disconnectPending:true,token:second.token}));await fixture.call('/disconnect',{method:'POST',token:second.token});
 app=client(storage,{fetcher});await until(()=>app.meta().token===null);assert.equal(app.meta().token,null);assert(!app.meta().disconnectPending);
 console.log('PASS: already-revoked/expired tokens clear on 401 without enabling sync.');
 // Pause a document read, then turn sync off while it is in flight.
 const third=await fixture.pair();storage.set(key,JSON.stringify({enabled:true,base:{},owner:third.userId,token:third.token}));let finishRead,startRead,deadline;
 const readStarted=new Promise(resolve=>{startRead=resolve;});
 app=client(storage,{fetcher:async(url,options)=>url.endsWith('/document')&&!options.method?new Promise(resolve=>{finishRead=resolve;startRead();}):fetcher(url,options)});
 // Account lookup hashes a token asynchronously. Wait for the held request,
 // rather than assuming a fixed number of event-loop turns completes that work.
 try{await Promise.race([readStarted,new Promise((_,reject)=>{deadline=setTimeout(()=>reject(Error('Document read did not start within five seconds')),5000);})]);}finally{clearTimeout(deadline);}
 assert(finishRead);
 await app.click('Turn Off Sync');finishRead(Response.json({revision:1,data:{notes:{remote:'Must not apply after disconnect'}}}));await settle();
 assert.equal(app.context.applied,0);assert.equal(app.context.state.notes.offline,'Keep offline notes');assert.equal(app.meta().enabled,false);assert.equal(app.meta().token,null);
 console.log('PASS: a late sync response cannot apply cloud data or restore credentials after disconnect.');
 storage.set(key,JSON.stringify({enabled:false,token:'unused-web-token',base:{}}));let authorization;
 app=client(storage,{native:false,fetcher:async(url,options)=>{authorization=options.headers.authorization;return Response.json({userId:'security-test'});}});await settle();
 assert.equal(app.meta().token,null);assert.equal(authorization,undefined);
 console.log('PASS: web sync removes unused bearer credentials and sends only the signed-in session.');

 // Two tabs share metadata, but not JavaScript objects. A stale tab must re-read
 // the persisted off state even when its storage event has not been delivered.
 const shared=new Map([[key,JSON.stringify({enabled:true,owner:'alice',base:{}})]]);
 let uploads=0,hold=false,finishDocument,uploadSignal,finishUpload;
 const webFetch=async(url,options)=>{
  if(url.endsWith('/session'))return Response.json({userId:'alice'});
  if(options.method==='PUT'){
   uploads++;
   if(hold==='upload')return new Promise(resolve=>{uploadSignal=options.signal;finishUpload=resolve;});
   return Response.json({revision:1});
  }
  if(hold==='read')return new Promise(resolve=>{finishDocument=resolve;});
  return Response.json({revision:0,data:{}});
 };
 const tabA=client(shared,{native:false,fetcher:webFetch}),tabB=client(shared,{native:false,fetcher:webFetch});await settle();
 const timerCount=tabB.timers;tabB.events.storage({key});assert.equal(tabB.timers,timerCount,'Metadata updates must not trigger a cross-tab sync ping-pong');
 await tabA.click('Turn Off Sync');uploads=0;
 tabB.context.state.notes.private='Private edit after disabling sync';
 await tabB.click('Sync Now');await settle();
 assert.equal(uploads,0);assert.equal(tabB.meta().enabled,false);
 assert(tabB.actions.children.some(b=>b.textContent==='Enable Cloud Sync'));
 console.log('PASS: another tab cannot upload or re-enable sync before its storage event arrives.');
 // Re-enable deliberately; disable while another tab holds a document response.
 await tabA.click('Enable Cloud Sync');await settle();
 tabB.events.storage({key});await settle();hold='read';tabB.poll();await settle();assert(finishDocument);
 await tabA.click('Turn Off Sync');tabB.events.storage({key});
 const appliedBefore=tabB.context.applied;uploads=0;
 finishDocument(Response.json({revision:2,data:{notes:{remote:'Late cloud response'}}}));await settle();
 assert.equal(uploads,0);assert.equal(tabB.context.applied,appliedBefore);assert.equal(tabB.meta().enabled,false);
 // Abort an already-issued request and ignore its result. The server may have
 // accepted it before cancellation; we must never apply/re-enable from it.
 hold=false;await tabA.click('Enable Cloud Sync');await settle();tabB.events.storage({key});await settle();
 hold='upload';tabB.context.state.notes.private='In-flight edit';tabB.poll();await settle();assert(finishUpload);
 await tabA.click('Turn Off Sync');tabB.events.storage({key});assert.equal(uploadSignal.aborted,true);
 finishUpload(Response.json({revision:3}));await settle();assert.equal(tabB.meta().enabled,false);
 tabB.events.focus();tabB.poll();await settle();assert.equal(tabB.meta().enabled,false);
 console.log('PASS: cross-tab disable aborts pending uploads and discards late sync responses.');
 // A Cloud Sync safety backup must pass the actual Import Backup handler.
 const savedBackup=shared.get('biblelens-before-cloud-sync');assert(savedBackup);
 const backupValue=JSON.parse(savedBackup);assert.equal(backupValue.version,1);assert(backupValue.exportedAt);
 const appSource=fs.readFileSync('src/app.js','utf8'),importControls={'#import-backup':{},'#backup-status':{}},restored={bookmarks:[],notes:{},noteTitles:{}};
 const importer={state:restored,ENTRIES:Object.keys(backupValue.notes).map(id=>({id})),window:{},$:(id)=>importControls[id],persist(){},renderCards(){},mergeInvestigationBackup(){}};
 vm.createContext(importer);vm.runInContext(appSource.slice(appSource.indexOf("$('#import-backup').onchange="),appSource.indexOf('function route(){')),importer);
 await importControls['#import-backup'].onchange({target:{files:[{size:Buffer.byteLength(savedBackup),text:async()=>savedBackup}],value:'backup.json'}});
 assert.match(importControls['#backup-status'].textContent,/Backup restored/);assert.equal(restored.notes.offline,'Keep offline notes');
 console.log('PASS: the actual safety backup restores through the normal import handler.');
}finally{fixture.close();}
