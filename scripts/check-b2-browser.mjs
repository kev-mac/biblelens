import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base = process.env.BIBLELENS_PREVIEW_URL || 'http://127.0.0.1:18788';
const results = [];
for (const [name,engine] of [['chromium',chromium],['webkit',webkit]]) {
 const browser = await engine.launch({headless:true});
 try {
  for (const viewport of [{width:390,height:844},{width:430,height:932}]) for (const theme of ['light','dark']) {
   const context = await browser.newContext({viewport,colorScheme:theme,reducedMotion:'reduce'}), page = await context.newPage(), errors = [];
   page.on('pageerror',error=>errors.push(error.message));
   await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin ? route.continue() : route.abort());
   await page.addInitScript(()=>{window.reviewViolations=[];document.addEventListener('securitypolicyviolation',event=>reviewViolations.push(event.violatedDirective));});
   await page.goto(base+'/draft-review.html'); await page.waitForSelector('#results article');
   assert.match(await page.locator('#count').innerText(),/^103 drafts/);
   for (const [collection,total] of [['people',138],['timeline',48],['stories',40],['prophecies',25],['rewrites',59],['holds',22],['researchReturns',13]]) {
    await page.locator('#collection').selectOption(collection);assert.match(await page.locator('#count').innerText(),new RegExp('^'+total+' drafts'));
   }
   await page.locator('#collection').selectOption('rewrites');await page.locator('#query').fill('Ahasuerus');
   await page.locator('#query').fill('');assert.equal(await page.locator('#results article').count(),20);
   await page.locator('#more').click();assert.equal(await page.locator('#results article').count(),40);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),viewport.width);
   await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:`.review/b2/review-${name}-${viewport.width}-${theme}.png`});
   assert.deepEqual(await page.evaluate(()=>reviewViolations),[]);assert.deepEqual(errors,[]);
   // Exercise the actual DOM renderer with malicious draft data and source URLs.
   await page.route('**/draft-review.json',async route=>{
    const response=await route.fetch(), data=await response.json();
    data.collections.evidence[0].record.title='<img src=x onerror="window.attacked=true">';
    data.collections.evidence[0].record.sources=[{label:'Unsafe source',url:'javascript:window.attacked=true'}];
    await route.fulfill({response,json:data});
   });
   await page.reload();await page.waitForSelector('#results article');
   assert((await page.locator('#results h2').first().innerText()).startsWith('<img'));
   assert.equal(await page.locator('#results img').count(),0);assert.equal(await page.locator('a[href^="javascript:"]').count(),0);
   assert.equal(await page.evaluate(()=>!!window.attacked),false);assert.deepEqual(errors,[]);
   results.push({engine:name,...viewport,theme,status:'PASS'});await context.close();
  }
 } finally {await browser.close();}
}
fs.writeFileSync('.review/b2/review-browser-results.json',JSON.stringify(results,null,2)+'\n');
console.log('PASS: all draft collections, pagination, phone layout, CSP, safe text and source links; both browsers, sizes and themes.');
