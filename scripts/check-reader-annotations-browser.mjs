import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to an authorized running preview.');
const matrix=[];
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
 try{
  for(const width of [320,390,647,768,820,1024,1366])for(const native of [false,true]){
   const context=await browser.newContext({viewport:{width,height:width<768?844:1024},reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage();
   const errors=[];page.on('pageerror',error=>errors.push(error.message));
   await page.goto(base+'/#read/1/1');await page.locator('#ux-chapter-picker').filter({hasText:'Exodus'}).waitFor();
   await page.locator('#chapter-text .story-illustration-reader figcaption').first().waitFor();
   await page.evaluate(native=>{document.documentElement.classList.toggle('native-ios',native);document.body.style.setProperty('--app-safe-top',native?'24px':'0px');},native);
   for(const dark of [false,true]){
    await page.evaluate(dark=>document.body.classList.toggle('dark',dark),dark);await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('#lens-settings:visible,[data-open-settings]:visible').count(),1);
    assert.equal(await page.locator('#lens-compare').count(),0);assert.equal(await page.locator('.study-library:visible').count(),0);
    const measures=await page.locator('#lensMasthead,#lensReadingBar,#ux-chapter-picker,#lens-settings').evaluateAll(nodes=>nodes.map(n=>({id:n.id,...n.getBoundingClientRect().toJSON(),font:parseFloat(getComputedStyle(n).fontSize)})));
    const header=measures.find(n=>n.id==='lensMasthead'),bar=measures.find(n=>n.id==='lensReadingBar'),picker=measures.find(n=>n.id==='ux-chapter-picker');
    assert(header.top>=(native?24:0)-1);assert(bar.top>=header.bottom-1);assert(picker.width>=44&&picker.height>=44&&picker.font>=18);
    assert(measures.every(n=>n.left>=-1&&n.right<=width+1));
    assert(await page.locator('#chapter-text .chapter-heading-row').evaluate(n=>[n,...n.querySelectorAll('*')].every(n=>getComputedStyle(n).textShadow==='none')));
    assert(await page.locator('a:visible').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).textDecorationLine==='none')));
    assert(!(await page.locator('#chapter-text .story-illustration-reader figcaption').first().innerText()).startsWith('Imagined scene:'));
    await page.locator('#ux-chapter-picker').focus();await page.keyboard.press('Enter');await page.locator('#passage-picker[open]').waitFor();
    assert.equal(await page.locator('#passage-book-grid input').count(),39);assert((await page.locator('#passage-book-grid').innerText()).includes('Song of Solomon'));
    const choices=await page.locator('#passage-book-grid label').evaluateAll(nodes=>nodes.map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height,scroll:n.firstElementChild.nextElementSibling.scrollWidth,client:n.firstElementChild.nextElementSibling.clientWidth,radius:getComputedStyle(n.firstElementChild.nextElementSibling).borderRadius})));
    assert(choices.every(n=>n.w>=44&&n.h>=44&&n.scroll<=n.client+1&&n.radius==='12px'));
    await page.locator('[data-passage-step="chapter"]').click();assert.equal(await page.locator('#passage-chapter-grid input').count(),40,'All Exodus chapters retained');
    assert(await page.locator('#passage-chapter-grid label').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return r.width>=44&&r.height>=44;})));
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'ux-chapter-picker');
    await page.locator('#lens-settings').focus();await page.keyboard.press('Enter');await page.locator('#reader-settings[open]').waitFor();await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'lens-settings');
    await page.evaluate(()=>scrollTo(0,500));await page.waitForTimeout(300);
    const sticky=await page.locator('#lensMasthead,#lensReadingBar').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));assert(sticky[0].top>=(native?24:0)-1);assert(sticky[1].top>=sticky[0].bottom-1);
    assert((await page.locator('#ux-chapter-picker').evaluate(n=>parseFloat(getComputedStyle(n).fontSize)))>=18);
    await page.evaluate(()=>scrollTo(0,0));matrix.push({engine,width,native,dark,status:'PASS'});
   }
   await page.evaluate(()=>BibleLensWorkspace.navigate('#read/21/8'));await page.locator('#ux-chapter-picker').filter({hasText:'Song of Solomon'}).waitFor();
   assert((await page.locator('#ux-chapter-picker').evaluate(n=>parseFloat(getComputedStyle(n).fontSize)))>=18);
   await page.locator('#ux-chapter-picker').click();await page.locator('#passage-reference').fill('Exodus 41');await page.locator('#passage-reference').press('Enter');await page.waitForFunction(()=>document.getElementById('passage-reference').getAttribute('aria-invalid')==='true');assert(await page.locator('#passage-reference-status').innerText());
   await page.locator('#passage-reference').fill('Exodus 1:8');await page.locator('#passage-reference').press('Enter');await page.waitForFunction(()=>location.hash==='#read/1/1/8');await page.locator('#verse-8').waitFor();assert.equal(await page.locator('#passage-picker[open]').count(),0);
   await page.evaluate(()=>BibleLensWorkspace.navigate('#compare?left=Exodus%201&right=Genesis%201'));await page.locator('.lens-comparison-passage').first().waitFor();await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'ux-chapter-picker');
   assert.deepEqual(errors,[]);await context.close();
  }
 }finally{await browser.close();}
}
console.log(JSON.stringify(matrix,null,2));
