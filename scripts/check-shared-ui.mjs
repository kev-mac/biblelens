import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {build} from 'esbuild';
import {escapeHTML,escapeHTMLString} from '../src/html-escape.js';
import {APP_FONTS,resolveAppFont,applyAppFont} from '../src/app-fonts.js';

const unsafe=`<img src=x onerror="alert('x')"> &`;
const escaped='&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt; &amp;';
assert.equal(escapeHTML(unsafe),escaped);
for(const value of [null,undefined])assert.equal(escapeHTML(value),'');
assert.equal(escapeHTMLString(null),'null');assert.equal(escapeHTMLString(undefined),'undefined');
for(const value of [0,false,42])assert.equal(escapeHTML(value),String(value));
assert.equal(escapeHTML('&amp;'),'&amp;amp;');
assert.equal(escapeHTML({toString:()=>unsafe}),escaped);
assert.equal(resolveAppFont({font:'lora',verseFont:'georgia',categoryFont:'mono'}),null);
for(const appFont of [undefined,null,'','unknown','constructor','__proto__']){
 assert.equal(resolveAppFont({appFont}),null);
 assert.equal(resolveAppFont({appFont},'inter').key,'inter');
}
for(const [key,family]of Object.entries(APP_FONTS))assert.deepEqual(resolveAppFont({appFont:key}),{key,family});
const properties=['--verse-font-family','--lens-reading-font','--ui-font','--category-font-family'];
const values=new Map(),style={setProperty:(key,value)=>values.set(key,value)};
assert.equal(applyAppFont(style,{font:'lora'}),null);assert.equal(values.size,0);
assert.equal(applyAppFont(style,{appFont:'mono'},{properties}),'mono');
assert.deepEqual([...values.keys()],properties);assert([...values.values()].every(value=>value===APP_FONTS.mono));

// Exercise the browser bridge and production classic-script adapters.
const bundled=await build({entryPoints:['src/shared-ui.js'],bundle:true,write:false,format:'iife',platform:'browser'});
const context={window:{},document:{documentElement:{style}},readerPreferences:{font:'lora'},state:{},persist(){},$:()=>control};
const control={};vm.createContext(context);vm.runInContext(bundled.outputFiles[0].text,context);
assert.equal(context.window.BibleLensUI.escapeHTML(unsafe),escaped);
assert.equal(context.window.BibleLensUI.escapeHTMLString(undefined),'undefined');
const reader=fs.readFileSync('src/reader-state.js','utf8');
vm.runInContext(reader.slice(reader.indexOf('function applyReaderFonts('),reader.indexOf('function applyTextSize(')),context);
assert.equal(control.value,'inter');assert.equal(values.get('--ui-font'),APP_FONTS.inter);
control.onchange({target:{value:'georgia'}});
assert.equal(control.value,'georgia');assert.equal(context.readerPreferences.appFont,'georgia');
assert.equal(context.readerPreferences.font,'georgia');assert.equal(context.readerPreferences.verseFont,'georgia');assert.equal(context.readerPreferences.categoryFont,'georgia');
for(const name of ['teachings','draft-review']){
 const source=fs.readFileSync('src/'+name+'.js','utf8'),fontCode=source.split('\n').find(line=>line.includes('applyAppFont'));
 for(const saved of [{readerPreferences:{font:'lora'}},{readerPreferences:{appFont:'bad'}},{readerPreferences:{appFont:'lora'}},null]){
  values.clear();context.localStorage={getItem:()=>JSON.stringify(saved)};vm.runInContext(fontCode,context);
  assert.equal(values.size,saved?.readerPreferences?.appFont==='lora'?1:0);
  if(values.size)assert.equal(values.get('--ui-font'),APP_FONTS.lora);
 }
 context.localStorage={getItem:()=>'{invalid'};vm.runInContext(fontCode,context);
}
vm.runInContext(fs.readFileSync('src/media-slots.js','utf8'),context);
const media=context.window.BibleLensMedia;
assert(media,'Media API must initialize after the shared bridge');
console.log('PASS: shared escaping, browser bridge, explicit app fonts, reader defaults and standalone fallback behavior.');
