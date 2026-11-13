import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';

const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to the prepared web or offline preview.');
fs.mkdirSync('.review/commandments',{recursive:true});
for(const [name,engine] of Object.entries({chromium,webkit})){
 const browser=await engine.launch();
 try{for(const width of [390,1024]){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
  await context.addInitScript(()=>localStorage.setItem('biblelens-evidence-visible','true'));
  const page=await context.newPage();
  const cards=page.locator('#commandments-list .commandment-card');
  const checkSummary=async()=>{
   await page.waitForFunction(()=>!document.querySelector('#commandments-view').hidden&&document.querySelector('#commandments-list [data-commandment-code="P212"]'));
   assert.equal(await cards.count(),1);
   assert.equal(await cards.first().getAttribute('data-commandment-sequence'),'1');
   assert.match(await cards.locator('h2').innerText(),/^#1\s/);
   assert.match(await cards.locator('.commandment-summary').innerText(),/Genesis 1:28.*Be fruitful/s);
   assert(await cards.locator('.commandment-summary').isVisible(),'Summary appears without an extra disclosure');
  };
  await page.goto(base+'/#read/0/1/28');
  const tag=page.locator('#verse-28 [data-membership=commandment]');
  await tag.waitFor();assert.equal(await tag.getAttribute('href'),'#commandments?code=P212');
  await tag.focus();await page.keyboard.press('Enter');await checkSummary();
  await page.screenshot({path:`.review/commandments/${name}-${width}-selected.png`,fullPage:true});
  await page.goBack();await tag.waitFor();assert(!await page.locator('#read-view').getAttribute('hidden'));
  await tag.click();await checkSummary();

  // The selected code must not linger when entering the complete collection.
  await page.evaluate(()=>{location.hash='#commandments';});
  await page.waitForFunction(()=>document.querySelectorAll('#commandments-list .commandment-card').length===24);
  assert.equal(await cards.first().getAttribute('data-commandment-code'),'P212');
  assert.deepEqual(await cards.evaluateAll(rows=>rows.map(row=>Number(row.dataset.commandmentSequence))),Array.from({length:24},(_,i)=>i+1));
  await page.locator('#commandments-load-more').click();assert.equal(await cards.count(),48);
  assert.equal(await cards.nth(47).getAttribute('data-commandment-sequence'),'48');
  const search=page.locator('#commandments-search');
  await search.fill('P21');assert.equal(await cards.count(),1);assert.equal(await cards.first().getAttribute('data-commandment-code'),'P21');
  await search.fill('Genesis');assert.equal(await cards.count(),3);assert.equal(await cards.first().getAttribute('data-commandment-sequence'),'1');
  await page.locator('#commandments-reset').click();assert.equal(await cards.count(),24);
  await page.screenshot({path:`.review/commandments/${name}-${width}-directory.png`,fullPage:true});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Commandment list stays within margins');

  await page.locator('#commandments-more').click();await page.locator('#commandments-filters').waitFor({state:'visible'});
  await page.locator('#commandments-close').click();await page.locator('#commandments-filters').waitFor({state:'hidden'});
  assert.equal(await page.locator('#commandments-more').getAttribute('aria-expanded'),'false');
  await cards.first().locator('[data-commandment-section]').click();
  await cards.first().locator('.commandment-context').waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelector('#commandments-list .commandment-context').dataset.loaded==='true');
  await cards.first().locator('[data-commandment-section]').click();
  assert(!await cards.first().locator('.commandment-context').isVisible());

  // Multiple commandments at one verse use one tag without losing a match.
  await page.goto(base+'/#read/4/6/13');
  const multi=page.locator('#verse-13 [data-membership=commandment]');await multi.waitFor();
  assert.match(await multi.getAttribute('href'),/^#commandments\?codes=/);
  await multi.click();
  await page.waitForFunction(()=>document.querySelectorAll('#commandments-list .commandment-card').length===2);
  assert.deepEqual(new Set(await cards.evaluateAll(rows=>rows.map(row=>row.dataset.commandmentCode))),new Set(['P4','P7']));
  await page.locator('#commandments-reset').click();assert.equal(await cards.count(),24);
  await search.fill('P212');await checkSummary();
  await context.close();console.log(`PASS ${name} ${width}: tag/repeat/back navigation, visible summary, all/list/filter/reset order, stable IDs, context close and multi-commandment links`);
 }}finally{await browser.close();}
}
