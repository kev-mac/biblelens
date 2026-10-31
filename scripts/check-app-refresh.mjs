import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source=fs.readFileSync('src/release.js','utf8');
const latest={version:'1.1.0',buildNumber:305,sourceHash:'current-source'};
function fixture({offline=false}={}){
 const actions=[];
 const context={URL,AbortSignal,document:{addEventListener(){}},navigator:{serviceWorker:{getRegistrations:async()=>[
  {scope:'https://biblelens.test/',unregister:async()=>actions.push('unregister')},
  {scope:'https://other.test/',unregister:async()=>{throw Error('Foreign worker touched');}}
 ]}},location:{href:'https://biblelens.test/?build=303&edition=kjv#read/8/1',origin:'https://biblelens.test',replace:url=>actions.push(['navigate',url])},
 caches:{keys:async()=>['biblelens-shell-old','unrelated-cache'],delete:async name=>actions.push(['delete',name])},
 fetch:async(url,options)=>{assert.equal(url,'/release.json');assert.equal(options.cache,'no-store');assert.equal(options.credentials,'omit');if(offline)throw Error('Offline');return {json:async()=>latest};}};
 Object.defineProperty(context,'localStorage',{get(){throw Error('Saved user data must not be touched');}});
 Object.defineProperty(context,'indexedDB',{get(){throw Error('Offline changes must not be touched');}});
 vm.createContext(context);vm.runInContext(source,context);
 return {context,actions};
}
const online=fixture();await online.context.refreshBibleLensAppFiles();
assert.deepEqual(online.actions,['unregister',['delete','biblelens-shell-old'],['navigate','https://biblelens.test/?edition=kjv#read/8/1']]);
const offline=fixture({offline:true});await assert.rejects(offline.context.refreshBibleLensAppFiles(),/Offline/);assert.deepEqual(offline.actions,[]);

// The loaded bundle's identity must win over newer metadata returned by the server.
let ready;const version={},status={},footer={},button={};
const panel={append(){},querySelector:s=>s==='[data-release-version]'?version:s==='[data-release-status]'?status:button};
const loaded={version:'1.1.0',buildNumber:304,sourceHash:'loaded-source'};
const context={AbortSignal,location:{hostname:'biblelens.test'},document:{addEventListener:(_,fn)=>ready=fn,createElement:tag=>tag==='section'?panel:{},querySelector:s=>s==='[data-footer-version]'?footer:{append(){}},documentElement:{classList:{contains:()=>false}}},fetch:async()=>({json:async()=>latest})};
vm.createContext(context);vm.runInContext(source.replace('/*__RELEASE_INFO__*/null',JSON.stringify(loaded)),context);await ready();await button.onclick();
assert.equal(footer.textContent,'v1.1.0 · Build 304');assert.match(status.textContent,/Reload this page/);
console.log('PASS: app refresh clears only BibleLens public caches and same-origin workers, preserves saved data and routes, keeps offline files on connection failure, and reports the loaded bundle identity.');
