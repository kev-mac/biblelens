import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to the local preview.');
for(const [name,engine] of Object.entries({chromium,webkit})){
 const browser=await engine.launch();
 try{for(const width of [390,1024]){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
  await context.addInitScript(()=>localStorage.setItem('biblelens-evidence-visible','true'));
  const page=await context.newPage();
  await page.goto(base+'/#read/0/1');
  await page.waitForSelector('#verse-4 [data-membership=story]');
  assert.equal(await page.locator('#lens-focus').innerText(),'TAGGING');
  assert.equal(await page.locator('#verse-4 [data-membership=story]').innerText(),'The Creation');
  assert.equal(await page.locator('#verse-4 [data-membership=commandment]').count(),0);
  for(const theme of ['light','dark']){
   await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);
   const style=await page.locator('#verse-4 [data-membership=story]').evaluate(el=>({color:getComputedStyle(el).color,border:getComputedStyle(el).borderRadius,size:getComputedStyle(el).fontSize,overflow:el.getBoundingClientRect().right>innerWidth,height:el.getBoundingClientRect().height}));
   assert.equal(style.color,theme==='dark'?'rgb(197, 171, 255)':'rgb(112, 64, 164)');
   assert.equal(style.border,'4px');assert(!style.overflow);assert(style.height<24,'Story tag stays compact, not a 44px bordered button');
  }
  assert.equal(await page.locator('#lens-focus .ux-evidence-label').evaluate(el=>getComputedStyle(el,'::before').content),'none');
  await page.locator('#lens-focus').click();assert.equal(await page.locator('[data-membership]').count(),0);
  await page.locator('#lens-focus').click();await page.waitForSelector('#verse-4 [data-membership=story]');
  await page.locator('#verse-4 [data-membership=story]').click();await page.waitForFunction(()=>location.hash==='#stories/genesis/the-creation');
  await page.goto(base+'/#read/0/2');await page.waitForSelector('#verse-3 [data-membership=story]');
  assert((await page.locator('#verse-3 [data-membership=story]').allTextContents()).includes('The Creation'));
  assert(!(await page.locator('#verse-4 [data-membership=story]').allTextContents()).includes('The Creation'));
  await page.goto(base+'/#read/1/20');await page.waitForSelector('#verse-2 [data-membership=commandment]');
  assert.equal(await page.locator('#verse-2 [data-membership=commandment]').innerText(),'COMMANDMENT');
  assert((await page.locator('#verse-2 [data-membership=commandment]').getAttribute('title')).includes('P1'));
  await page.waitForFunction(()=>{const el=document.querySelector('#verse-2 [data-membership=commandment]');return el&&getComputedStyle(el).color==='rgb(250, 204, 21)';});
  console.log(name,width,'membership tags and TAGGING passed');
  await context.close();
 }}finally{await browser.close();}
}
