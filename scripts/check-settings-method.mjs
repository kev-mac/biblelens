import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import '../src/sync-core.js';
const source=fs.readFileSync('src/app.js','utf8');
const code=source.slice(source.indexOf("const systemTheme="),source.indexOf('function corpus'));
const inputs=['system','light','dark'].map(value=>({value})),meta={},classes=new Set();let change;
const media={matches:false,addEventListener:(event,fn)=>{change=fn;}};
const state={theme:'system'};
const context={state,window:{matchMedia:()=>media},document:{querySelectorAll:selector=>selector.startsWith('meta')?[meta]:inputs,body:{classList:{toggle:(key,on)=>on?classes.add(key):classes.delete(key)}}}};
vm.createContext(context);vm.runInContext(code,context);
assert(!classes.has('dark'));assert(inputs[0].checked);
media.matches=true;change();assert(classes.has('dark'));assert.equal(meta.content,'#0B0F17');
state.theme='light';vm.runInContext('applyTheme()',context);change();assert(!classes.has('dark'));
state.theme='dark';vm.runInContext('applyTheme()',context);media.matches=false;change();assert(classes.has('dark'));
for(const theme of ['system','light','dark']){const restored={};BibleLensSync.apply(restored,BibleLensSync.snapshot({bookmarks:[],notes:{},theme}));assert.equal(restored.theme,theme);}
const html=fs.readFileSync('src/index.html','utf8');
for(const id of ['attribution','evidence','categories','features','sources','reference-aids','privacy']){assert(html.includes(`data-method-section="method-${id}"`));assert(html.includes(`id="method-${id}"`));}
assert(html.includes('Optional native AI depends on device support.'));
console.log('PASS System follows OS changes, explicit themes remain stable, sync/backup preserve all three choices, all Method sections remain navigable.');
