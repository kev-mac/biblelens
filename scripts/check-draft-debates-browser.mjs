import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8788';
const output='.review/b1';fs.mkdirSync(output,{recursive:true});
const errors=[],results=[];
for(const [engine,type] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await type.launch({headless:true});
 try{
  for(const viewport of [{width:390,height:844},{width:430,height:932}])for(const theme of ['light','dark']){
   const context=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:'reduce',colorScheme:theme});
   const page=await context.newPage();const prefix=`${engine}-${viewport.width}-${theme}-phase3`;
   page.on('pageerror',error=>errors.push(prefix+': '+error.message));
   page.on('console',message=>{if(message.type()==='error'&&/content security|refused|blocked|csp/i.test(message.text()))errors.push(prefix+': '+message.text());});
   await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin?route.continue():route.abort());
   await page.goto(base+'/#debates?draft=1');
   await page.waitForSelector('.phase3-card');
   await page.waitForFunction(()=>!document.documentElement.classList.contains('bl-starting'));
   await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);
   const shot=async name=>{await page.evaluate(()=>document.fonts.ready);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),viewport.width,prefix+' overflow');await page.screenshot({path:`${output}/${prefix}-${name}.png`});};
   assert.equal(await page.locator('.phase3-card').count(),16);
   assert.equal(await page.locator('.phase3-card .bl-media-slot[data-media-kind="placeholder"]').count(),16);
   assert.equal(await page.locator('.phase3-card img').count(),0);
   await shot('list');
   await page.locator('[data-draft-mode="text-vs-science"]').click();await page.waitForFunction(()=>location.hash.includes('mode=text-vs-science'));assert.equal(await page.locator('.phase3-card').count(),8);
   await page.locator('[data-draft-mode="text-vs-history"]').click();await page.waitForFunction(()=>location.hash.includes('mode=text-vs-history'));assert.equal(await page.locator('.phase3-card').count(),6);
   await page.locator('[data-draft-mode="text-vs-text"]').click();await page.waitForFunction(()=>location.hash.includes('mode=text-vs-text'));assert.equal(await page.locator('.phase3-card').count(),16);
   await page.locator('.phase3-card').first().click();await page.waitForSelector('.phase3-verdict-box');
   assert.equal(await page.locator('.phase3-side').count(),2);assert.equal(await page.locator('.phase3-case').count(),2);
   assert((await page.locator('#debate-view .phase3-tier').innerText()).includes('Not assigned'));
   assert.equal(await page.locator('#debate-view img').count(),0,'No artwork is offered as evidence');
   await shot('detail');
   await page.locator('.phase3-verdict-box').scrollIntoViewIfNeeded();await shot('verdict');
   await page.locator('.phase3-case').last().scrollIntoViewIfNeeded();await shot('cases');
   await page.locator('[data-draft-stance="B"]').click();assert.equal(await page.locator('[data-draft-stance="B"]').getAttribute('aria-pressed'),'true');
   await page.locator('[data-draft-save]').click();assert.equal(await page.locator('[data-draft-save]').getAttribute('aria-pressed'),'true');
   await page.locator('[data-draft-sources]').click();await page.waitForSelector('.phase3-sheet[open]');await shot('sources');
   assert(await page.locator('.phase3-sheet a[href^="https://"]').count()>0);
   await page.keyboard.press('Escape');assert.equal(await page.locator('.phase3-sheet').getAttribute('open'),null);
   assert.equal(await page.evaluate(()=>document.activeElement.hasAttribute('data-draft-sources')),true,'Focus returns to Sources');
   await page.reload();await page.waitForSelector('.phase3-verdict-box');assert.equal(await page.locator('[data-draft-stance="B"]').getAttribute('aria-pressed'),'false');assert.equal(await page.locator('[data-draft-save]').getAttribute('aria-pressed'),'false');
   for(const id of ['headline-17','headline-25']){
    await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),'#debate/'+id+'?draft=1');await page.waitForSelector('.phase3-verdict-box');
    assert.equal(await page.locator('.phase3-case').count(),2);
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await shot(id);
   }
   await page.evaluate(()=>BibleLensWorkspace.navigate('#debates?draft=1&selection=reserves'));await page.waitForSelector('.phase3-card');assert.equal(await page.locator('.phase3-card').count(),10);
   await page.evaluate(()=>BibleLensWorkspace.navigate('#debate/missing?draft=1'));await page.waitForSelector('text=Draft not found');
   await page.evaluate(()=>BibleLensWorkspace.navigate('#debates'));await page.waitForSelector('#debate-results .phase2-debate-card');assert(await page.locator('#debates-view .phase3-preview-link').isVisible());
   results.push({engine,...viewport,theme,reducedMotion:true,status:'pass'});await context.close();
  }
 }finally{await browser.close();}
}
fs.writeFileSync(output+'/phase3-browser-results.json',JSON.stringify({results,errors},null,2)+'\n');assert.deepEqual(errors,[]);
console.log('PASS: Phase 3 draft routes, cards, cases, sources, private choices; Chromium/WebKit, both phone sizes and themes');
