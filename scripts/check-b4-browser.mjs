import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
import {findings} from './check-neutral-framing.mjs';
const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to the local draft Worker preview');
fs.mkdirSync('.review/b4',{recursive:true});
for(const [engine,browserType] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await browserType.launch({headless:true});
 try{for(const viewport of [{width:390,height:844},{width:430,height:932}])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport,colorScheme:theme,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin?route.continue():route.abort());
  await page.addInitScript(()=>localStorage.setItem('biblelens-debate-device-v1:legacy-science-1',JSON.stringify({saved:true,stance:'B'})));
  // A cold legacy collection bookmark keeps every query parameter.
  await page.goto(base+'/#debates?mode=science&status=Context');await page.waitForSelector('#debate-results a');
  assert.equal(await page.evaluate(()=>location.hash),'#questions?mode=science&status=Context');
  assert.deepEqual(await page.locator('.lens-primary a').allTextContents(),['Read','Explore','Questions','Saved']);
  assert.equal(await page.evaluate(()=>BibleLensDebateStore.read('legacy-science-1').stance),'B');
  await page.evaluate(()=>BibleLensWorkspace.navigate('#read/0/1'));await page.waitForSelector('#verse-1');
  await page.goBack();await page.waitForSelector('#debate-results a');assert.equal(await page.evaluate(()=>location.hash),'#questions?mode=science&status=Context');
  // Draft-only wording, selection identity, faith/source readings and sources are reachable on phones.
  await page.evaluate(()=>BibleLensWorkspace.navigate('#debates?draft=1&mode=text-vs-text'));await page.waitForSelector('.phase3-card');
  assert.equal(await page.evaluate(()=>location.hash),'#questions?draft=1&mode=text-vs-text');
  assert.match(await page.locator('.phase3-draft-notice').innerText(),/B01–B30 are selected/);
  for(const id of ['headline-01','headline-04','headline-05','headline-22','headline-25']){
   await page.evaluate(id=>BibleLensWorkspace.navigate('#debate/'+id+'?draft=1'),id);await page.waitForSelector('.phase3-readings');
   assert.equal(await page.locator('.phase3-readings h3').count(),2);assert(await page.locator('.phase3-readings a[href^="https://"]').count()>0);
   assert.match(await page.locator('.phase3-verdict-box').innerText(),/What the evidence shows/);
   assert.match(await page.locator('#debate-view .phase3-tier').innerText(),/Not assessed/);
   const text=await page.locator('#debate-view').innerText();assert.deepEqual(findings(text),[],id+' banned framing');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),viewport.width,id+' overflow');
  }
  await page.locator('.phase3-readings').scrollIntoViewIfNeeded();await page.screenshot({path:`.review/b4/readings-${engine}-${viewport.width}-${theme}.png`});
  await page.goto(base+'/draft-review.html');await page.waitForSelector('#results article');
  for(const collection of ['b4Wording','b4Readings']){
   await page.locator('#collection').selectOption(collection);assert(await page.locator('#results article').count()>0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),viewport.width);
  }
  assert.deepEqual(errors,[]);await context.close();
  console.log(`PASS ${engine} ${viewport.width} ${theme}: cold alias, history/query preservation, stored choice, B01–B30, main readings, sources, evidence labels and review pages.`);
 }}finally{await browser.close();}
}
