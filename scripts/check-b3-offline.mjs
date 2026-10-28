import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import {chromium, webkit} from 'playwright';
import worker from '../dist/server/index.js';

let syncRevision=0;
const failures=[];
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,`http://127.0.0.1:${server.address().port}`);
  if(url.pathname.startsWith('/api/sync')||url.pathname.startsWith('/signin')){
   res.writeHead(200,{'content-type':'application/json','cache-control':'no-store'});
   res.end(JSON.stringify({revision:++syncRevision}));return;
  }
  const response=await worker.fetch(new Request(url,{method:req.method,headers:{...req.headers,'accept-encoding':'identity'}}),{},{});
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){failures.push(error.message);res.writeHead(500);res.end('Failed');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
try{
 const expectedRelease=await (await fetch(base+'/release.json')).json();
 const expected=await (await fetch(base+'/api/chapter?book=65&chapter=22')).json();
 const manifest=await(await fetch(base+'/manifest.webmanifest')).json();
 assert.equal(manifest.name,'BibleLens');assert.equal(manifest.display,'standalone');
 assert((await fetch(base+manifest.icons[0].src)).ok);
 assert.equal((await fetch(base)).headers.get('content-security-policy'),"object-src 'none'; base-uri 'none'; form-action 'self'; worker-src 'self'");
 for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]]){
  const browser=await engine.launch({headless:true});
  try{
   const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),page=await context.newPage();
   const errors=[];page.on('pageerror',error=>errors.push(error.message));
   await page.goto(base+'/#read/0/1');await page.waitForSelector('#verse-1');
   await page.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));});
   await page.evaluate(()=>{state.theme='dark';applyTheme();});
   assert.deepEqual(await page.locator('meta[name="theme-color"]').evaluateAll(nodes=>nodes.map(node=>node.content)),['#10131a','#10131a']);
   await page.evaluate(()=>{state.theme='light';applyTheme();});
   const cache=await page.evaluate(async()=> (await caches.keys()).filter(key=>key.startsWith('biblelens-shell-')));
   assert.deepEqual(cache,['biblelens-shell-'+expectedRelease.sourceHash]);
   const keys=await page.evaluate(async key=>(await(await caches.open(key)).keys()).map(request=>new URL(request.url).pathname),cache[0]);
   assert(keys.includes('/offline-bible.json'));assert(keys.includes('/api/books'));
   assert(!keys.some(path=>path.startsWith('/api/sync')||path.includes('signin')));
   // A deliberately poisoned cache must never override live sync or sign-in.
   await page.evaluate(async key=>{const cache=await caches.open(key);for(const path of ['/api/sync/document','/signin-with-chatgpt'])await cache.put(path,new Response('{"revision":-999}',{headers:{'content-type':'application/json'}}));},cache[0]);
   for(const path of ['/api/sync/document','/signin-with-chatgpt']){
    const first=await page.evaluate(async path=>(await(await fetch(path)).json()).revision,path);
    const second=await page.evaluate(async path=>(await(await fetch(path)).json()).revision,path);
    assert(second>first&&first>0,'Private requests must reach the server every time');
   }
   await context.setOffline(true);
   for(const path of ['/api/sync/document','/api/sync/session','/signin-with-chatgpt'])assert.equal(await page.evaluate(async path=>{try{await fetch(path);return false;}catch{return true;}},path),true,'No stale private data offline');
   const chapter=await page.evaluate(async()=>await(await fetch('/api/chapter?book=65&chapter=22')).json());
   assert.deepEqual(chapter,expected,'An unvisited chapter matches every online field and edition');
   // Full reload while disconnected exercises the cached shell and lazy reader.
   await page.goto(base+'/#read/65/22');await page.waitForSelector('#verse-21');
   assert((await page.locator('#chapter-text').innerText()).includes('Amen'));
   await page.evaluate(()=>BibleLensWorkspace.navigate('#read/0/2'));await page.waitForSelector('#verse-25');
   assert.equal(await page.evaluate(()=>reading.chapter),2);
   await context.setOffline(false);
   await page.locator('#lens-settings').click();await page.waitForSelector('#reader-settings[open]');
   await page.locator('#settings-navigation').click();await page.waitForSelector('#navigation-sheet:popover-open');
   assert.equal(await page.locator('#settings-navigation').getAttribute('aria-expanded'),'true');
   await page.waitForFunction(()=>document.activeElement.hasAttribute('data-navigation-close'));
   await page.keyboard.press('Escape');await page.waitForSelector('#navigation-sheet:popover-open',{state:'hidden'});
   assert.equal(await page.evaluate(()=>document.activeElement.id),'lens-settings');
   // Real transitions run when allowed; the reduce branch never calls the API.
   await page.evaluate(()=>{globalThis.__transitions=0;const start=document.startViewTransition?.bind(document);if(start)document.startViewTransition=(...args)=>{__transitions++;return start(...args);};});
   await page.evaluate(()=>BibleLensWorkspace.navigate('#discover'));await page.waitForSelector('.ux-topic-row');
   assert.equal(await page.evaluate(()=>__transitions),0);
   await page.emulateMedia({reducedMotion:'no-preference'});
   await page.evaluate(()=>BibleLensWorkspace.navigate('#read/0/1'));await page.waitForSelector('#verse-31');
   if(await page.evaluate(()=>!!document.startViewTransition)){
    assert((await page.evaluate(()=>__transitions))>0);
    const before=await page.evaluate(()=>__transitions);
    await page.goBack();await page.waitForSelector('.ux-topic-row');
    assert((await page.evaluate(()=>__transitions))>before,'History uses the same route transition');
   }
   assert.deepEqual(errors,[]);await context.close();
   console.log(`PASS: ${name} manifest/icon, release-versioned cache, unvisited Bible chapter, cold offline reading, poisoned-sync/auth bypass, Popover Escape/focus, reduced-motion transitions.`);
  }finally{await browser.close();}
 }
 assert.deepEqual(failures,[]);
}catch(error){console.error(error);process.exitCode=1;}
finally{await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});}
