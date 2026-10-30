import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875',root=process.env.HOME+'/git/codex-reports',shots=root+'/ux11-shots';
fs.mkdirSync(shots,{recursive:true});
const gallery=[['gallery-history','#questions?mode=history'],['gallery-science','#questions?mode=science'],['gallery-text','#questions?mode=text'],['gallery-translation','#questions?filter=T'],['gallery-questions','#questions']].map(([name,hash])=>[name,hash,'.phase2-debate-card',null]);
const screens=[['people','#characters','.ux-contact',3067],['places','#places','.place-profile-card',1293],['commandments','#commandments','.commandment-card',613],...gallery];
for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch();try{for(const width of [320,375,390]){
  const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce',serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const [name,hash,selector,total]of screens){
   await page.goto(base+'/'+hash);await page.locator(selector).first().waitFor();await page.locator('.directory-hub:not([hidden]) .stories-header').waitFor();
   await page.evaluate(()=>{state.theme='dark';applyTheme();});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(150);
   const host=page.locator('.directory-hub:not([hidden])');
   assert(await host.locator('.directory-search').isVisible(),name+' search');
   if(total)assert((await host.locator('.directory-search').getAttribute('placeholder')).includes(total.toLocaleString())||(await host.locator('.directory-search').getAttribute('placeholder')).includes(String(total)),name+' real total');
   else if(name.startsWith('gallery-')){
    const data=await page.evaluate(async hash=>hash==='#questions'?{total:(await(await fetch('/accepted-questions.json')).json()).length}:await(await fetch('/api/debates?'+hash.split('?')[1])).json(),hash);
    assert.match(await host.locator('.directory-results').innerText(),new RegExp('of '+data.total.toLocaleString()+' '));assert((await host.locator('.directory-search').getAttribute('placeholder')).includes((data.collectionTotal||data.total).toLocaleString()),name+' real count');
   }else{
    const key=name.slice(9),data=await page.evaluate(async key=>(await fetch('/api/categories?book=all&kind='+key+'&limit=0')).json(),key);
    assert.match(await host.locator('.category-results').innerText(),new RegExp('of '+data.total.toLocaleString()+' results'));
    assert((await host.locator('.directory-search').getAttribute('placeholder')).includes(data.total.toLocaleString()),name+' real count');
   }
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' '+width+' overflow');
   for(const selector of ['.directory-filter-open','.phase2-debate-card','.ux-person-open','.filter-pill','a.action-link','button.action-link','.place-map-action','.person-section-toggle']){
    const boxes=await host.locator(selector+':visible').evaluateAll(ns=>ns.filter(n=>!n.disabled).map(n=>({text:n.textContent,...n.getBoundingClientRect().toJSON()})));
    for(const box of boxes)assert(box.width>=43.9&&box.height>=43.9,name+' '+width+' target '+JSON.stringify(box));
   }
   if(engine==='chromium'&&width===390){await page.evaluate(()=>document.activeElement?.blur());await page.screenshot({path:shots+'/ux11b-'+name+'.png'});}
   const filter=host.locator('.directory-filter-open');await filter.click();const sheet=page.locator('dialog[open]');await sheet.waitFor();
   assert(await sheet.evaluate(n=>n.scrollWidth<=n.clientWidth),name+' sheet overflow');
   for(const box of await sheet.locator('button:visible,a:visible,summary:visible,select:visible').evaluateAll(ns=>ns.filter(n=>!n.disabled).map(n=>n.getBoundingClientRect().toJSON())))assert(box.width>=43.9&&box.height>=43.9,name+' sheet target');
   for(const color of await sheet.locator('button[aria-pressed=true]:visible').evaluateAll(ns=>ns.map(n=>{const hex=getComputedStyle(n.closest('dialog')).getPropertyValue('--directory-accent').trim().replace('#','');return {actual:getComputedStyle(n).color,expected:'rgb('+[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)).join(', ')+')'};})))assert.equal(color.actual,color.expected,name+' selected accent');
   if(name==='people'){assert.equal(await sheet.locator('.directory-categories button').count(),7);assert.match(await sheet.innerText(),/Women \(201\)/);}
   else if(name==='places'){assert((await sheet.locator('.directory-categories button').count())>5);assert.match(await sheet.innerText(),/Egypt & Sinai/);}
   else if(name==='commandments'){assert.equal(await sheet.locator('fieldset').count(),4);assert.match(await sheet.innerText(),/Applicability/);}
   else if(name==='gallery-questions'){assert(await sheet.locator('.directory-categories button').count()>1);assert(await sheet.locator('a[href="#questions?mode=text"]').isVisible());}
   else if(name.startsWith('gallery-')){assert(await sheet.locator('[data-debate-status]').count()>0);assert(await sheet.locator('summary').filter({hasText:'About These Labels'}).isVisible());}
   else {assert(await sheet.locator('select').count()>=2);}
   if(engine==='chromium'&&width===390)await page.screenshot({path:shots+'/ux11b-'+name+'-filter.png'});
   await page.keyboard.press('Escape');
   if(name==='people'){
    await host.locator('#characters-search').fill('Aaron');await page.waitForFunction(()=>document.querySelector('.characters-count').textContent.includes('of 1 people'));await host.locator('#characters-search').fill('');
   }else if(name==='places'){
    await host.locator('#places-search').fill('Beer-elim');await page.waitForFunction(()=>document.querySelector('#places-count').textContent.includes('of 1 place'));await host.locator('#places-search').fill('');
   }else if(name==='commandments'){
    await host.locator('#commandments-search').fill('P1');await page.waitForFunction(()=>document.querySelectorAll('.commandment-card').length===1);await host.locator('#commandments-search').fill('');
    await host.locator('.filter-pill').filter({hasText:'Positive'}).click();assert.match(await host.locator('#commandments-count').innerText(),/of 248/);
   }else if(name==='gallery-history'){
    const title=await host.locator('.story-title').first().innerText();const expected=await page.evaluate(async query=>(await(await fetch('/api/debates?mode=history&q='+encodeURIComponent(query))).json()).total,title);assert(expected>0,'Displayed title is searchable');await host.locator('.directory-search').fill(title);await page.waitForFunction(expected=>document.querySelector('#debate-count')?.textContent.includes('of '+expected+' records'),expected);assert.equal(await host.locator('.directory-search').inputValue(),title);
   }else if(name==='gallery-questions'){
    const title=await host.locator('.story-title').first().innerText();await host.locator('.directory-search').fill(title);assert.match(await host.locator('.directory-results').innerText(),/of 1 questions/);
   }else if(name==='evidence-academic'){
    await host.locator('.directory-search').fill('solid sky');await page.waitForFunction(()=>document.querySelector('.category-results')?.textContent.includes('of 1 results'));assert.match(await host.locator('.story-title').innerText(),/solid sky dome/);await page.reload();await page.waitForFunction(()=>document.querySelector('.category-results')?.textContent.includes('of 1 results'));assert.equal(await host.locator('.directory-search').inputValue(),'solid sky');await host.locator('.directory-search').fill('');await page.waitForFunction(()=>document.querySelector('.category-results')?.textContent.includes('of 40 results'));
   }
   const clear=host.locator('.directory-search-clear');if(await clear.isVisible()){const box=await clear.boundingBox();assert(box.width>=43.9&&box.height>=43.9,name+' clear target');await clear.click();await page.waitForTimeout(250);}
   console.log('PASS',engine,width,name,'count, search, sheet, targets, overflow');
  }
  assert.deepEqual(errors,[]);await page.close();
 }}finally{await browser.close();}
}
