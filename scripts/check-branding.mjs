import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {packageOfflineApp} from './offline-app.mjs';

const name='zLenz: Bible',read=path=>fs.readFileSync(path,'utf8');
const config=JSON.parse(read('capacitor.config.json'));
assert.equal(config.appName,name);assert.equal(config.appId,'com.scripturelens.app');assert.equal(config.webDir,'www');
assert.equal(JSON.parse(read('package.json')).name,'scripture-lens');
const plist=read('ios/App/App/Info.plist'),strings=read('android/app/src/main/res/values/strings.xml');
const ios=plist.match(/<key>CFBundleDisplayName<\/key>\s*<string>([^<]+)<\/string>/)?.[1];
const android=key=>strings.match(new RegExp('<string name="'+key+'">([^<]+)</string>'))?.[1];
assert.equal(ios,name);assert.equal(android('app_name'),name);assert.equal(android('title_activity_main'),name);
assert.equal(android('package_name'),config.appId);assert.equal(android('custom_url_scheme'),config.appId);
assert(plist.includes('<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>'));
const meta=(html,key)=>html.match(new RegExp('<meta (?:name|property)="'+key+'" content="([^"]+)"'))?.[1];
function checkHtml(html){
 assert(html.includes('<title>'+name+'</title>'));
 for(const key of ['application-name','apple-mobile-web-app-title','og:site_name','og:title'])assert.equal(meta(html,key),name,key);
 assert(html.includes('aria-label="'+name+' · Explore"'));
 assert(html.includes('<span>'+name+'<small>'));
 assert(html.includes('Opening '+name)&&html.includes('Couldn’t load '+name));
}
checkHtml(read('src/index.html'));
const assets={'/release.json':{body:JSON.stringify({sourceHash:'branding-contract'})}};packageOfflineApp(assets);
const manifest=JSON.parse(assets['/manifest.webmanifest'].body);
assert.equal(manifest.name,name);assert.equal(manifest.short_name,name);
assert.deepEqual([manifest.id,manifest.start_url,manifest.scope,manifest.display],['/','/#discover','/','standalone']);
for(const file of ['src/draft-review.html','src/story-video-player.html','src/teachings.html'])assert(read(file).match(/<title>[^<]+<\/title>/)[0].includes(name),file);

// The old storage identity and user-authored names survive the branding change.
const legacy={bookmarks:[],notes:{},verseNotes:{'0:1:1':{text:'My BibleLens note',title:'Keep this historical title'}},readerPreferences:{edition:'asv',appFont:'inter'}};
const memory=new Map([['scripture-lens-v1',JSON.stringify(legacy)]]);
const storage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value),removeItem:key=>memory.delete(key),key:index=>[...memory.keys()][index],get length(){return memory.size;}};
const context={};vm.createContext(context);vm.runInContext(read('src/sync-core.js'),context);
const store=context.BibleLensSync.createLocalStore({storage,actor:'brand-contract',getState:()=>legacy});
assert.equal(store.initial.verseNotes['0:1:1'].text,legacy.verseNotes['0:1:1'].text);
assert.equal(store.initial.readerPreferences.edition,'asv');
assert.match(read('src/sync.js'),/x-biblelens-sync/i);assert.match(read('worker/sync.mjs'),/x-biblelens-sync/i);
assert(read('src/app.js').includes('window.BibleLensSync.createLocalStore'));

const receipt={name,characters:name.length,appId:config.appId,iosDisplayName:ios,androidDisplayName:android('app_name'),androidActivityTitle:android('title_activity_main'),manifest:{name:manifest.name,short_name:manifest.short_name,id:manifest.id,start_url:manifest.start_url,scope:manifest.scope},legacyStorageKey:'scripture-lens-v1',storeAvailability:'not checked or reserved',signedDeviceMetadata:'pending native build/install'};
if(process.argv.includes('--built')){
 for(const folder of ['dist/client','www']){
  checkHtml(read(folder+'/index.html'));
  const actual=JSON.parse(read(folder+'/manifest.webmanifest'));assert.deepEqual(actual,manifest);
 }
 fs.mkdirSync('.release/branding',{recursive:true});fs.writeFileSync('.release/branding/native-name-metadata.json',JSON.stringify(receipt,null,2)+'\n');
}
console.log('PASS: exact web/PWA/native display name, unchanged app identity/routes, and legacy saved data.',JSON.stringify(receipt));
