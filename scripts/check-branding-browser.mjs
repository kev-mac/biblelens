import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';

const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to an authorized preview.');
const name='xLenz: Bible',output='.release/branding',matrix=[];
const screens=[[320,844],[390,844],[546,1184],[768,1024],[820,1024],[1024,820],[844,390],[1366,1024]];
const note='A BibleLens note saved before the rename.',title='Keep my BibleLens title';
const legacy={bookmarks:[],notes:{},verseBookmarks:{'0:1:1':{book:0,chapter:1,verse:1}},verseNotes:{'0:1:1':{book:0,chapter:1,verse:1,text:note,title}},theme:'dark',readerPreferences:{edition:'asv',appFont:'inter'}};
fs.mkdirSync(output,{recursive:true});
async function settle(page){
 await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(async()=>{await new Promise(requestAnimationFrame);await Promise.all(document.getAnimations().filter(a=>'transitionProperty' in a&&/color/.test(a.transitionProperty)).map(a=>a.finished.catch(()=>{})));await new Promise(requestAnimationFrame);});
}
async function header(page,width,native){
 const result=await page.locator('#lensMasthead').evaluate(node=>{
  const brand=node.querySelector('.lens-brand'),word=brand.lastElementChild,range=document.createRange();range.selectNode(word.firstChild);
  const rect=n=>n.getBoundingClientRect().toJSON(),nav=node.querySelector('.lens-primary'),tools=node.querySelector('.lens-tools');
  return {header:rect(node),brand:rect(brand),word:rect(word),text:range.getBoundingClientRect().toJSON(),name:word.firstChild.textContent,label:brand.getAttribute('aria-label'),target:brand.getAttribute('href'),tools:rect(tools),nav:getComputedStyle(nav).position==='fixed'?null:rect(nav),overflow:word.scrollWidth>word.clientWidth+1};
 });
 assert.equal(result.name,name);assert.equal(result.label,name+' · Explore');assert.equal(result.target,'#discover');
 assert(!result.overflow&&result.text.width>0&&result.text.right<=result.word.right+1,'The full name fits without clipping: '+JSON.stringify(result));
 assert(result.header.top>=(native?24:0)-1&&result.brand.left>=0&&result.brand.right<=width+1);
 assert(result.brand.top>=result.header.top-1&&result.brand.bottom<=result.header.bottom+1);
 const overlaps=(a,b)=>a.left<b.right-.5&&b.left<a.right-.5&&a.top<b.bottom-.5&&b.top<a.bottom-.5;
 assert(!overlaps(result.brand,result.tools),'Brand and tools overlap: '+JSON.stringify(result));
 if(result.nav)assert(!overlaps(result.brand,result.nav)&&!overlaps(result.tools,result.nav),'Desktop navigation overlaps branding/tools: '+JSON.stringify(result));
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 return result;
}
async function legacyBackup(page,engine,native){
 await page.evaluate(()=>BibleLensWorkspace.navigate('#method'));await page.locator('#method-view:not([hidden])').waitFor();
 const id=await page.evaluate(()=>ENTRIES[0].id);
 const backup={version:1,bookmarks:[id],notes:{[id]:note},noteTitles:{[id]:title}};
 await page.locator('#import-backup').setInputFiles({name:'bible-lens-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await page.waitForFunction(()=>document.getElementById('backup-status').textContent.includes('Backup restored'));
 const downloaded=page.waitForEvent('download');await page.locator('#export-backup').click();const file=await downloaded;
 assert.equal(file.suggestedFilename(),'xLenz-Bible-backup.json');const path=`${output}/legacy-backup-${engine}-${native?'native':'web'}.json`;await file.saveAs(path);
 const saved=JSON.parse(fs.readFileSync(path));assert.equal(saved.version,1);assert.equal(saved.notes[id],note);assert.equal(saved.noteTitles[id],title);assert.equal(saved.verseNotes['0:1:1'].text,note);
 await page.evaluate(()=>BibleLensWorkspace.navigate('#read/0/1'));await page.locator('#verse-1').waitFor();await page.reload();await page.locator('#verse-1').waitFor();
 await page.waitForFunction(()=>document.title.endsWith(' · xLenz: Bible'));
 await page.waitForFunction(({id,note,title})=>state.notes[id]===note&&state.noteTitles[id]===title&&state.bookmarks.includes(id)&&state.verseNotes['0:1:1']?.text===note&&document.getElementById('reader-edition').value==='asv',{id,note,title});
 const actual=await page.evaluate(id=>({note:state.notes[id],title:state.noteTitles[id],marked:state.bookmarks.includes(id),verseNote:state.verseNotes['0:1:1'].text,edition:document.getElementById('reader-edition').value,font:readerPreferences.appFont,legacyKey:!!localStorage.getItem('scripture-lens-v1')}),id);
 assert.deepEqual(actual,{note,title,marked:true,verseNote:note,edition:'asv',font:'inter',legacyKey:true});
}
try{for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
 try{for(const [width,height] of screens)for(const native of [false,true]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:width<=1024,reducedMotion:'reduce',serviceWorkers:'block',acceptDownloads:true}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await context.addInitScript(({legacy,origin})=>{if(location.origin===origin&&!localStorage.getItem('scripture-lens-v1'))localStorage.setItem('scripture-lens-v1',JSON.stringify(legacy));},{legacy,origin:new URL(base).origin});
  // The Node preview has no D1 binding. Use a signed-out response for these
  // branding captures; production sync is covered by its separate release checks.
  await page.route('**/api/sync/session',route=>route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({error:'Sign in to sync your notes and bookmarks.'})}));
  try{
   await page.goto(base+'/#read/0/1');await page.locator('#ux-chapter-picker').waitFor();await page.locator('#verse-1').waitFor();
   assert.equal(await page.locator('#reader-edition').inputValue(),'asv','An existing translation preference is retained');
   await page.evaluate(native=>{document.documentElement.classList.toggle('native-ios',native);document.body.style.setProperty('--app-safe-top',native?'24px':'0px');},native);
   const response=await context.request.get(base+'/manifest.webmanifest');assert(response.ok());const manifest=await response.json();assert.equal(manifest.name,name);assert.equal(manifest.short_name,name);assert.deepEqual([manifest.id,manifest.start_url,manifest.scope],['/','/#discover','/']);
   for(const theme of ['dark','light']){
    await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);await settle(page);
    const views=[];
    for(const [route,ready,label] of [['#read/0/1','#ux-chapter-picker','read'],['#discover','#ux-explore-search','explore']]){
     await page.evaluate(route=>BibleLensWorkspace.navigate(route),route);await page.locator(ready).waitFor();await page.waitForFunction(()=>document.title.endsWith(' · xLenz: Bible'));await settle(page);
     for(const [key,selector] of [['application-name','meta[name="application-name"]'],['apple-mobile-web-app-title','meta[name="apple-mobile-web-app-title"]'],['og:site_name','meta[property="og:site_name"]']])assert.equal(await page.locator(selector).getAttribute('content'),name,key);
     const bounds=await header(page,width,native);await page.screenshot({path:`${output}/${engine}-${width}x${height}-${native?'native':'web'}-${theme}-${label}.png`,fullPage:false});views.push({label,title:await page.title(),bounds});
    }
    assert.equal(await page.locator('#ux-explore-search-form').getAttribute('aria-label'),'Search '+name);
    matrix.push({engine,width,height,native,theme,status:'PASS',views,authFixture:'signed-out401'});fs.writeFileSync(output+'/matrix.json',JSON.stringify(matrix,null,2)+'\n');
   }
   if(width===390)await legacyBackup(page,engine,native);
   assert.deepEqual(errors,[]);console.log('PASS branding',engine,width,height,native?'native':'web');
  }catch(error){
   const failure=await page.evaluate(()=>({route:location.hash,title:document.title,focus:document.activeElement?.id,brand:document.querySelector('.lens-brand')?.textContent,viewport:{width:innerWidth,height:innerHeight}})).catch(()=>({unavailable:true}));
   fs.writeFileSync(`${output}/failure-${engine}-${width}-${native?'native':'web'}.json`,JSON.stringify({error:error.message,...failure},null,2)+'\n');await page.screenshot({path:`${output}/failure-${engine}-${width}-${native?'native':'web'}.png`,fullPage:false}).catch(()=>{});throw error;
  }finally{await context.close();}
 }}finally{await browser.close();}
}}finally{fs.writeFileSync(output+'/matrix.json',JSON.stringify(matrix,null,2)+'\n');}
assert.equal(matrix.length,64);
console.log('PASS: 64 exact-name header/metadata cases, plus legacy backup and saved-preference compatibility in both engines and simulated native layouts.');
