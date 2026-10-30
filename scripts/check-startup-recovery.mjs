import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise the shipped inline bootstrap, not a copy of its state machine.
const html=fs.readFileSync('src/index.html','utf8');
const bootstrap=html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert(bootstrap?.includes('bl-starting'),'The real early startup bootstrap must be present');

function browser({bundled=true,mounted=true,childrenReady=true}={}){
 const classes=new Set(),nodes=new Map(),documentListeners=new Map(),windowListeners=new Map(),timers=new Map();
 let now=0,nextTimer=0,reloads=0,storageTouches=0;
 const title={textContent:'Opening BibleLens'},copy={textContent:'Preparing your reading room.'},retry={hidden:true,onclick:null};
 const panel={id:'biblelens-startup',querySelector:selector=>!childrenReady?null:selector==='[data-startup-title]'?title:selector==='[data-startup-copy]'?copy:selector==='button'?retry:null};
 const styles={id:'biblelens-app-styles',sheet:null},script={id:'biblelens-app-script',dataset:{}};
 if(bundled){nodes.set(styles.id,styles);nodes.set(script.id,script);}
 if(mounted)nodes.set(panel.id,panel);
 const listen=(registry,type,callback,options)=>{const callbacks=registry.get(type)||[];callbacks.push({callback,options});registry.set(type,callbacks);};
 const document={documentElement:{classList:{add:name=>classes.add(name),remove:name=>classes.delete(name)}},getElementById:id=>nodes.get(id)||null,querySelector:selector=>selector==='#biblelens-startup button'&&nodes.has(panel.id)?retry:null,addEventListener:(type,callback,options)=>listen(documentListeners,type,callback,options)};
 const window={addEventListener:(type,callback,options)=>listen(windowListeners,type,callback,options)};
 const location={href:'https://biblelens.test/#read/0/1/2',reload(){reloads++;}};
 function emitWindow(type,event={}){for(const {callback}of windowListeners.get(type)||[])callback({target:window,...event});}
 function emit(type,event={}){
  for(const {callback}of [...documentListeners.get(type)||[]]){
   try{callback({target:document,...event});}
   catch(error){emitWindow('error',{filename:'/application.js',error,message:error.message});}
  }
 }
 const context={document,window,location,setTimeout(callback,delay=0){const id=++nextTimer;timers.set(id,{at:now+delay,callback});return id;},clearTimeout:id=>timers.delete(id)};
 for(const name of ['localStorage','sessionStorage','indexedDB','caches'])Object.defineProperty(context,name,{get(){storageTouches++;throw Error('Startup recovery must never access '+name);}});
 vm.createContext(context);vm.runInContext(bootstrap,context,{filename:'actual-startup-bootstrap.js'});
 function tick(milliseconds){
  const until=now+milliseconds;
  while(true){const next=[...timers].filter(([,timer])=>timer.at<=until).sort((a,b)=>a[1].at-b[1].at||a[0]-b[0])[0];if(!next)break;const [id,timer]=next;timers.delete(id);now=timer.at;timer.callback();}
  now=until;
 }
 function completeResources({events=true}={}){styles.sheet={};script.dataset.biblelensReady='true';if(events){emit('load',{target:styles});emit('load',{target:script});}}
 return {styles,script,title,copy,retry,document,documentListeners,location,emit,emitWindow,tick,completeResources,mount:()=>nodes.set(panel.id,panel),finishPanel:()=>{childrenReady=true;},get starting(){return classes.has('bl-starting');},get reloads(){return reloads;},get storageTouches(){return storageTouches;},get pendingTimers(){return timers.size;}};
}

const normal=browser();assert(normal.starting);
normal.completeResources();assert(normal.starting,'Resource completion alone cannot bypass application DOM initialization');
normal.emit('DOMContentLoaded');assert(normal.starting,'The full DOMContentLoaded dispatch must finish first');normal.tick(0);
assert(!normal.starting);assert.equal(normal.pendingTimers,0);normal.tick(20000);assert(!normal.starting);
assert(normal.documentListeners.get('load').some(listener=>listener.options===true),'Resource load observation uses document capture');
const cached=browser();cached.completeResources({events:false});cached.emit('DOMContentLoaded');cached.tick(0);
assert(!cached.starting,'Completed CSS and bundle sentinel recover even if every resource load event was missed');
const early=browser({mounted:false});early.completeResources();early.mount();early.emit('DOMContentLoaded');early.tick(0);
assert(!early.starting,'Resources completed before the body recovery panel exists are recognized later');
const parsingPanel=browser({childrenReady:false});parsingPanel.completeResources();parsingPanel.finishPanel();parsingPanel.emit('DOMContentLoaded');parsingPanel.tick(0);assert(!parsingPanel.starting,'Resource events during partial recovery-panel parsing cannot mark startup as failed');
console.log('PASS: startup reveals only after both resources and DOM initialization; missed resource events cannot leave a completed app hidden.');

for(const missing of ['stylesheet','script']){
 const partial=browser();
 if(missing==='stylesheet')partial.script.dataset.biblelensReady='true';else partial.styles.sheet={};
 partial.emit('DOMContentLoaded');partial.tick(0);assert(partial.starting,missing+' must finish before reveal');
 partial.tick(20000);assert.equal(partial.title.textContent,'Taking longer than expected');assert.equal(partial.retry.hidden,false);
 if(missing==='stylesheet'){partial.styles.sheet={};partial.emit('load',{target:partial.styles});}
 else{partial.script.dataset.biblelensReady='true';partial.emit('load',{target:partial.script});}
 assert(!partial.starting,'Late '+missing+' completion clears the slow-load curtain without retry');
}
const incompleteBundle=browser();incompleteBundle.styles.sheet={};incompleteBundle.emit('load',{target:incompleteBundle.script});incompleteBundle.emit('DOMContentLoaded');incompleteBundle.tick(0);
assert(incompleteBundle.starting,'A script load event without the completion sentinel is not successful execution');
console.log('PASS: partial CSS/script availability and incomplete bundle execution keep recovery available until actual completion.');

for(const resource of ['styles','script']){
 const failed=browser({mounted:false});failed.emit('error',{target:failed[resource]});
 failed.mount();failed.completeResources();failed.emit('DOMContentLoaded');failed.tick(0);
 assert(failed.starting,'An early resource error remains visible after the body is parsed');
 assert.equal(failed.title.textContent,'Couldn’t load BibleLens');assert.equal(failed.retry.hidden,false);
 assert.equal(typeof failed.retry.onclick,'function');failed.retry.onclick();assert.equal(failed.reloads,1);assert.equal(failed.storageTouches,0);
}
const nativeFailure=browser();nativeFailure.emit('error',{target:{id:'biblelens-device-bootstrap'}});nativeFailure.completeResources();nativeFailure.emit('DOMContentLoaded');nativeFailure.tick(0);assert(nativeFailure.starting,'Native API bootstrap failure must remain visible');assert.equal(nativeFailure.retry.hidden,false);
const runtime=browser();runtime.completeResources();
runtime.document.addEventListener('DOMContentLoaded',()=>{throw Error('Initializer failed');});
runtime.emit('DOMContentLoaded');runtime.tick(0);
assert(runtime.starting);assert.equal(runtime.title.textContent,'Couldn’t load BibleLens');assert.equal(runtime.retry.hidden,false);
const optional=browser();optional.emit('error',{target:{id:'optional-illustration'}});optional.completeResources();optional.emit('DOMContentLoaded');optional.tick(0);assert(!optional.starting,'An optional image failure does not block the application');
optional.emitWindow('error',{filename:'/late-handler.js'});assert(!optional.starting,'A later interaction error does not bring back the startup curtain');
console.log('PASS: failures before body parsing and during DOMContentLoaded initialization retain a usable recovery action; unrelated resources do not block startup.');

const hung=browser();hung.styles.sheet={};hung.tick(19999);assert.equal(hung.retry.hidden,true);
hung.tick(1);assert(hung.starting);assert.equal(hung.title.textContent,'Taking longer than expected');assert.equal(hung.retry.hidden,false);
assert.equal(typeof hung.retry.onclick,'function','Retry must work while a hung deferred script still prevents DOMContentLoaded');
const destination=hung.location.href;hung.retry.onclick();assert.equal(hung.reloads,1);assert.equal(hung.location.href,destination);assert.equal(hung.storageTouches,0);
const development=browser({bundled:false});development.emit('DOMContentLoaded');assert(!development.starting);assert.equal(development.pendingTimers,0);development.tick(20000);assert(!development.starting);
console.log('PASS: hung-defer Retry works before DOMContentLoaded, preserves the destination and never touches user storage; unbundled development bypasses the curtain.');
