// Regression checks for the collection grid and compact browsing disclosures.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import {chromium,webkit} from 'playwright';
import worker from './built-worker.mjs';
const server=http.createServer(async(req,res)=>{const r=await worker.fetch(new Request(new URL(req.url,'http://preview.test')),{},{});res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
fs.mkdirSync('.release/browse',{recursive:true});
try{for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const width of [320,390,1280]){
  const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
  await page.goto(base);await page.locator('#ux-topic-stories').waitFor();
  assert.equal(await page.locator('.ux-topic').count(),7);
  assert.equal(await page.locator('[aria-roledescription=carousel]').count(),0);
  const cards=await page.locator('.ux-topic').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().toJSON()));
  assert(Math.abs(cards[0].top-cards[1].top)<1,'two collections visible in the same row');
  assert(cards[0].right<=cards[1].left,'no overlapping cards');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal page overflow');
  await page.locator('img').evaluateAll(ns=>Promise.all(ns.filter(n=>n.checkVisibility()&&n.getBoundingClientRect().top<844&&n.getBoundingClientRect().bottom>0).map(n=>Promise.race([n.decode().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,5000))]))));
  await page.screenshot({path:`.release/browse/${engine}-${width}-explore.png`,fullPage:true});
  await page.locator('#ux-topic-stories').click();await page.locator('#story-the-creation').waitFor();
  const first=page.locator('#story-the-creation');
  assert(!(await first.locator('details').getAttribute('open')));
  assert((await first.locator('.browse-excerpt').innerText()).split(/\s+/).length<=15);
  assert(!(await first.locator('.story-summary').isVisible()));
  await page.locator('img').evaluateAll(ns=>Promise.all(ns.filter(n=>n.checkVisibility()&&n.getBoundingClientRect().top<844&&n.getBoundingClientRect().bottom>0).map(n=>Promise.race([n.decode().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,5000))]))));
  await page.screenshot({path:`.release/browse/${engine}-${width}-stories.png`,fullPage:false});
  await first.locator('.story-full-details>summary').click();
  assert(await first.locator('.story-summary').isVisible());
  assert((await first.locator('.story-summary').innerText()).includes('God blesses the seventh day'));
  assert(await first.locator('[data-story-passage]').isVisible());
  assert((await first.locator('.story-title').evaluate(n=>getComputedStyle(n).fontFamily)).includes('Inter'));
  await page.goto(base+'/#questions?mode=text');await page.locator('.phase2-debate-card').first().waitFor();
  const record=page.locator('.phase2-debate-card').first();
  assert((await record.locator('.story-summary').innerText()).split(/\s+/).length<=15);
  await page.locator('img').evaluateAll(ns=>Promise.all(ns.filter(n=>n.checkVisibility()&&n.getBoundingClientRect().top<844&&n.getBoundingClientRect().bottom>0).map(n=>Promise.race([n.decode().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,5000))]))));
  await page.screenshot({path:`.release/browse/${engine}-${width}-comparisons.png`,fullPage:false});
  await record.click();await page.locator('.phase2-summary').waitFor();
  assert((await page.locator('.phase2-summary').innerText()).length>100,'full record summary preserved');
  assert(await page.locator('.phase2-deeper').count(),'research limits retained');
  await page.close();
 }}finally{await browser.close();}
}}finally{server.close();}
console.log('PASS: collection grid, direct navigation, 15-word excerpts, full story/research details, Inter, mobile and desktop in Chromium/WebKit.');
