import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8787';
fs.mkdirSync('.review/b6',{recursive:true});
for(const [name,engine]of [['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch({headless:true});
 try{for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width:390,height:844},colorScheme:theme,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin?route.continue():route.abort());
  await page.addInitScript(()=>localStorage.setItem('scripture-lens-v1',JSON.stringify({readerPreferences:{appFont:'mono'},notes:{private:'Do not change'}})));
  await page.goto(base+'/teachings.html');await page.waitForSelector('#results article');
  assert.equal(await page.locator('#results article').count(),21);assert.equal(await page.locator('#results a').count(),21);
  assert.equal(await page.locator('#form option').count(),7);assert.equal(await page.locator('#results details[open]').count(),0);
  assert.match(await page.locator('h1').evaluate(el=>getComputedStyle(el).fontFamily),/monospace/);
  assert.match(await page.locator('#form').evaluate(el=>getComputedStyle(el).fontFamily),/monospace/);
  for(const control of await page.locator('select,summary,a').all())assert((await control.boundingBox()).height>=48,'Teachings controls must be at least 48 pixels high');
  await page.locator('#form').selectOption('family list');assert.equal(await page.locator('#results article').count(),1);
  await page.locator('#form').selectOption('');await page.locator('#book').selectOption('Matthew');assert.equal(await page.locator('#results article').count(),4);
  await page.locator('#results article').first().locator('summary').first().click();assert.equal(await page.locator('#results details[open]').count(),1);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);
  await page.screenshot({path:`.review/b6/teachings-${name}-${theme}.png`,fullPage:true});
  await page.goto(base+'/draft-review.html');await page.waitForSelector('#results article');
  await page.locator('#collection').selectOption('b6Readings');assert.match(await page.locator('#count').innerText(),/^1693 drafts/);
  assert.equal(await page.locator('#results details[open]').count(),0);
  await page.locator('#results article').first().locator('summary').first().click();assert.match(await page.locator('#results article').first().innerText(),/Reading the stated claims/);
  await page.locator('#collection').selectOption('people');await page.locator('#query').fill('jesus-b6');assert.equal(await page.locator('#results article').count(),1);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('scripture-lens-v1')).notes.private),'Do not change');
  assert.deepEqual(errors,[]);await context.close();console.log(`PASS: B6 ${name} ${theme}, 21 draft forms/passages, filters, disclosed notes, app-wide font, 1693 reading pairs, Jesus draft and unchanged local notes.`);
 }}finally{await browser.close();}
}
