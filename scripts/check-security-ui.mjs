import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {chromium,webkit} from 'playwright';
import worker from './built-worker.mjs';
import {syncFixture} from './security-test-fixture.mjs';

// Run after both builds. The servers and SQLite accounts exist only for this test.
const marker='<img src=x onerror="globalThis.__securityExecuted=1">';
const attribute='" autofocus onfocus="globalThis.__securityExecuted=1" data-probe="';
const text='</textarea>'+marker+'&"\'';
const brokenChapter='1&extra='+marker;
const data={
 passageNotes:{p:{book:attribute,chapter:marker,name:text,title:text,text},'NaN:NaN':{book:attribute,chapter:marker,name:text,title:text,text}},
 passageBookmarks:{p:{book:0,chapter:marker,name:text}},
 verseNotes:{v:{book:0,chapter:1,verse:marker,name:text,title:text,text}},
 verseBookmarks:{v:{book:0,chapter:1,verse:marker,name:text},'0:1:1':{book:0,chapter:1,verse:1,name:'Genesis',highlights:[
  {edition:attribute,start:0,end:2,text:'In',color:'yellow'},
  {edition:'kjv',start:0,end:2,text:'In',color:'yellow'}]}},
 notes:{animals:text},noteTitles:{animals:text},
 investigations:{comparison:{id:'comparison',title:text,note:text,edition:'kjv',left:{book:0,chapter:1},right:{book:0,chapter:2}},
  coordinates:{id:'coordinates',title:text,note:text,edition:'kjv',left:{book:0,chapter:brokenChapter},right:{book:0,chapter:2}}}
};
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml'};
async function serverFor(platform,fixture,withoutCsp){
 const server=http.createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,`http://127.0.0.1:${server.address().port}`),chunks=[];
   for await(const chunk of req)chunks.push(chunk);
   let response;
   if(url.pathname==='/security-worker.js'){response=new Response('postMessage("ready")',{headers:{'content-type':'application/javascript'}});
   }else if(platform==='mobile'&&!url.pathname.startsWith('/api/sync')){
    const file=path.resolve('www','.'+(url.pathname==='/'?'/index.html':url.pathname));
    if(!file.startsWith(path.resolve('www')+path.sep))throw Error('Invalid fixture path');
    response=new Response(fs.readFileSync(file),{headers:{'content-type':types[path.extname(file)]||'application/octet-stream'}});
   }else{
    const headers=new Headers(req.headers);headers.set('accept-encoding','identity');headers.set('oai-authenticated-user-id','security-test');
    response=await worker.fetch(new Request(url,{method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})}),fixture.env,{});
   }
   const headers=Object.fromEntries(response.headers);let body=Buffer.from(await response.arrayBuffer());
   if(withoutCsp&&headers['content-type']?.includes('text/html')){
    delete headers['content-security-policy'];delete headers['content-security-policy-report-only'];body=Buffer.from(body.toString().replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/i,''));
   }
   res.writeHead(response.status,headers);res.end(body);
  }catch(error){res.writeHead(500);res.end(error.message);}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 return {url:`http://127.0.0.1:${server.address().port}`,close:()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();})};
}
async function inert(page,selector){
 const result=await page.locator(selector).evaluate(node=>({injected:!!node.querySelector('img,script,[onerror],[onfocus],[autofocus],[data-probe]'),executed:globalThis.__securityExecuted,body:node.textContent,values:[...node.querySelectorAll('input,textarea')].map(n=>n.value)}));
 assert.equal(result.injected,false,'Untrusted markup must never become elements or attributes');assert(!result.executed,'Untrusted script executed');return result;
}
for(const [name,engine]of [['Chromium',chromium],['WebKit',webkit]]){
 const browser=await engine.launch({headless:true});
 try{for(const platform of ['web','mobile'])for(const withoutCsp of [true,false]){
  const fixture=syncFixture(),device=await fixture.pair();
  assert.equal((await fixture.call('/document',{method:'PUT',token:device.token,body:{revision:0,data}})).status,200);
  const server=await serverFor(platform,fixture,withoutCsp),context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];
  const consoleErrors=[];page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
  page.on('pageerror',error=>errors.push(error.message));
  // No real cloud account, map service or third party is contacted.
  await page.route('https://**/*',route=>route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify({fixture:true})}));
  // The browser-hosted native bundle intentionally blocks same-origin sync.
  // Route only this fixture's sync calls to its synthetic signed-in session;
  // the unmodified native API guard is covered by check:mobile.
  if(platform==='mobile')await page.addInitScript(()=>{
   const networkFetch=globalThis.fetch.bind(globalThis);let installed=networkFetch;
   Object.defineProperty(globalThis,'fetch',{configurable:true,get:()=>installed,set:implementation=>{
    installed=(input,options)=>{const url=new URL(typeof input==='string'?input:input.url,location.href);return url.origin===location.origin&&url.pathname.startsWith('/api/sync')?networkFetch(input,options):implementation(input,options);};
   }});
  });
  await page.addInitScript(()=>{
   localStorage.setItem('biblelens-cloud-sync-v1',JSON.stringify({enabled:true,owner:'security-test',base:{},token:null}));
   localStorage.setItem('scripture-lens-v1',JSON.stringify({bookmarks:[],notes:{seen:'Keep my offline note'}}));
   globalThis.__violations=[];document.addEventListener('securitypolicyviolation',e=>__violations.push({directive:e.violatedDirective,disposition:e.disposition}));
  });
  try{
   const response=await page.goto(server.url+'/#read/0/1');assert.equal(response.status(),200);
   if(!withoutCsp){
    const headers=response.headers();
    if(platform==='web'){
     assert(headers['content-security-policy-report-only']);assert.equal(headers['content-security-policy'],"object-src 'none'; base-uri 'none'; form-action 'self'; worker-src 'self'");
     assert.equal(await page.locator('meta[http-equiv="Content-Security-Policy"]').count(),0,'Hosted web must not enforce a meta CSP');
    }else assert.equal(await page.locator('meta[http-equiv="Content-Security-Policy"]').count(),1,'Native must enforce its CSP');
   }
   await page.waitForFunction(()=>!document.documentElement.classList.contains('bl-starting')&&typeof reading!=='undefined'&&reading?.verses?.length&&state.investigations?.coordinates,{},{timeout:60000});
   await page.waitForFunction(()=>document.querySelector('[data-sync-status]')?.textContent.includes('Synced'));
   assert.equal(await page.evaluate(()=>state.notes.seen),'Keep my offline note');
   assert.equal(await page.evaluate(()=>state.verseBookmarks['0:1:1'].highlights[0].edition),attribute,'Malicious edition must arrive through sync');
   await page.evaluate(()=>renderPassageSaved());
   assert.equal(await page.locator('#saved-passages [data-marked-verse-text="0/1/1"]').first().getAttribute('data-marked-edition'),'kjv','Valid highlights must survive edition validation');
   // Exercise escaping independently of the edition allowlist, so relaxing that
   // validator in the future cannot silently reopen this attribute sink.
   await page.evaluate(()=>{
    const normalize=normalizeTextHighlights,probe=document.createElement('div');probe.id='security-edition-probe';
    try{normalizeTextHighlights=value=>value;probe.innerHTML=bookmarkVerseTextHtml(0,1,1);}finally{normalizeTextHighlights=normalize;}
    document.body.append(probe);
   });
   await inert(page,'#security-edition-probe');
   assert.equal(await page.locator('#security-edition-probe [data-marked-edition]').first().getAttribute('data-marked-edition'),attribute);
   await page.locator('#security-edition-probe').evaluate(node=>node.remove());
   assert((await inert(page,'#saved-passages')).body.includes(marker));
   await page.evaluate(()=>renderChapterBookmarks());await inert(page,'#chapter-bookmark-list');
   await page.evaluate(()=>BibleLensFeatures.load('evidence'));
   await page.evaluate(()=>{markedBookSelection=0;markedChapterSelection=0;markedKind='bookmark';markedData={records:[],verses:{}};renderMarkedResults();});
   assert((await inert(page,'#saved-passages')).body.includes(marker));
   await page.evaluate(()=>{const items=categoryPersonalItems({book:-1,chapter:0});document.querySelector('#bookmarks-list').innerHTML=items.map(item=>categoryPersonalCard(item)+categoryPersonalCard(item,true)).join('');});
   assert((await inert(page,'#bookmarks-list')).body.includes(marker));
   await page.evaluate(()=>BibleLensWorkspace.route('#notebook'));
   assert((await inert(page,'#lens-notebook-list')).values.includes(text));
   for(const id of ['comparison','coordinates']){
    await page.evaluate(id=>BibleLensWorkspace.route('#investigation/'+id),id);
    await page.waitForFunction(()=>!document.querySelector('#lens-compare-results').hasAttribute('aria-busy')&&document.querySelector('#lens-investigation-note'));
    const result=await inert(page,'#lens-compare-results');assert(result.values.includes(text));
    if(id==='coordinates')assert(result.body.includes(brokenChapter));
   }
   await page.evaluate(()=>BibleLensWorkspace.route('#search?q=offline'));
   await page.waitForFunction(()=>document.querySelector('#lens-search-status').textContent.includes('result'));
   assert((await page.locator('#lens-search-results').textContent()).includes('Keep my offline note'));
   const chapter=await page.evaluate(async()=>await(await fetch('/api/chapter?book=0&chapter=1')).json());assert(chapter.verses.length>0);
   // The mobile request above is served by its packaged module worker.
   if(!withoutCsp){
    assert.deepEqual(await page.evaluate(()=>__violations),[],'Normal startup, sync, reading, search and comparison must satisfy CSP');
    await page.evaluate(async platform=>{
     await import('/vendor/maplibre-gl.mjs');
     await fetch('https://tiles.openfreemap.org/planet');
     await fetch('https://scripture-lens.kvn-mcgwn.chatgpt.site/release.json');
     await new Promise((resolve,reject)=>{const url=platform==='web'?'/security-worker.js':URL.createObjectURL(new Blob(['postMessage("ready")'],{type:'text/javascript'})),worker=new Worker(url,{type:'module'});worker.onmessage=()=>{worker.terminate();URL.revokeObjectURL(url);resolve();};worker.onerror=reject;});
    },platform);
    assert.deepEqual(await page.evaluate(()=>__violations),[],'Map module, self web worker/native blob worker and required connections must remain allowed');
    await page.evaluate(async()=>{
     const script=document.createElement('script');script.textContent='globalThis.__securityExecuted=1';document.head.append(script);
     const image=document.createElement('img');image.setAttribute('onerror','globalThis.__securityExecuted=1');document.body.append(image);image.dispatchEvent(new Event('error'));
     try{await fetch('https://blocked.invalid/probe');}catch{}
    });
    await page.waitForFunction(()=>__violations.some(x=>x.directive==='connect-src'));
    const violations=await page.evaluate(()=>__violations),reportOnly=platform==='web';
    assert.equal(!!await page.evaluate(()=>globalThis.__securityExecuted),reportOnly,'Only the web report-only policy permits the intentional script probe');
    assert(violations.some(x=>x.directive.startsWith('script-src')));
    assert(violations.every(x=>x.disposition===(reportOnly?'report':'enforce')),'Web reports; native blocks');
   }
   assert.deepEqual(errors,[],'Application should not throw during security regression');
   console.log(`PASS: ${name} ${platform}, CSP ${withoutCsp?'removed to isolate escaping':platform==='web'?'report-only':'enforced'}: paired-device write → sync merge → inert passage/note/bookmark/comparison; offline note, reader, search and workers preserved.`);
  }catch(error){console.error(name,platform,{withoutCsp,errors,consoleErrors:consoleErrors.slice(0,5),violations:await page.evaluate(()=>globalThis.__violations)});throw error;}finally{await context.close();await server.close();fixture.close();}
 }}finally{await browser.close();}
}
