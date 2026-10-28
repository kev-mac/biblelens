import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL;
for(const [name,engine]of [['Chromium',chromium],['WebKit',webkit]]){
 const browser=await engine.launch();try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#questions');await page.waitForSelector('.accepted-questions .phase2-debate-card');assert.equal(await page.locator('.accepted-questions .phase2-debate-card').count(),30);
 await page.goto(base+'/#debate/headline-01');await page.waitForSelector('[data-accepted-save]');assert.equal(await page.locator('.phase2-sides section').count(),2);assert.match(await page.locator('#debate-view').innerText(),/Evidence strength: Not assigned/);
 assert.equal(await page.locator('[data-accepted-stance]').count(),0);await page.locator('[data-accepted-save]').click();await page.reload();await page.waitForSelector('[data-accepted-save]');assert.equal(await page.locator('[data-accepted-save]').getAttribute('aria-pressed'),'true');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);assert.deepEqual(errors,[]);console.log('PASS: '+name+' accepted question previews, detail, persistent private choice/save and phone width.');
 }finally{await browser.close();}
}
