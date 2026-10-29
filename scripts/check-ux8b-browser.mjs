import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const root=process.env.HOME+'/git/codex-reports',out=root+'/ux8b-shots',matrix=[];
fs.mkdirSync(out,{recursive:true});
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'});
  const page=await context.newPage();
  await page.goto(base+'/#read/0/1');await page.locator('#ux-chapter-picker').filter({hasText:'Genesis'}).waitFor();
  await page.evaluate(()=>{state.theme='dark';applyTheme();});
  for(const width of [320,375,390]){
   await page.setViewportSize({width,height:844});
   for(const chapter of ['#read/0/1','#read/21/8']){
    await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),chapter);
    await page.waitForFunction(hash=>location.hash===hash,chapter);
    await page.waitForFunction(hash=>document.querySelector('#ux-chapter-picker').textContent.startsWith(hash==='#read/0/1'?'Genesis 1':'Song of Solomon 8'),chapter);
    await page.locator('#chapter-text .verse').first().waitFor();
    for(const edition of ['kjv','web','asv']){
     await page.locator('#lens-edition').selectOption(edition);
     const controls=await page.locator('#lensReadingBar button:visible,#lensReadingBar select:visible').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {label:n.id||n.getAttribute('aria-label'),x:r.x,y:r.y,w:r.width,h:r.height};}));
     for(const r of controls){assert(r.w>=44&&r.h>=44,`${engine}/${width}: target ${JSON.stringify(r)}`);assert(r.x>=0&&r.x+r.w<=width,`${engine}/${width}: outside viewport ${r.label}`);}
     for(let i=0;i<controls.length;i++)for(let j=i+1;j<controls.length;j++){
      const a=controls[i],b=controls[j];assert(!(a.x<b.x+b.w-.5&&b.x<a.x+a.w-.5&&a.y<b.y+b.h-.5&&b.y<a.y+a.h-.5),`${engine}/${width}: ${a.label} intersects ${b.label}`);
     }
     matrix.push({engine,width,chapter,edition,controls:'PASS'});
    }
   }
  }
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>BibleLensWorkspace.navigate('#read/0/1'));await page.locator('#lens-edition').selectOption('kjv');await page.locator('#ux-chapter-picker').filter({hasText:'Genesis'}).waitFor();await page.evaluate(()=>document.fonts.ready);
  if(process.env.UX_NO_SHOTS!=='1')await page.screenshot({path:`${out}/${engine}-390-read-after.png`});
  await page.evaluate(()=>BibleLensWorkspace.navigate('#search?q=Moses'));await page.locator('#lens-results-people .lens-result').first().waitFor();
  const sizes=await page.locator('#lens-search-overlay .lens-result-group > h2').evaluateAll(nodes=>nodes.map(n=>({size:getComputedStyle(n).fontSize,weight:getComputedStyle(n).fontWeight})));
  assert(sizes.length>=2);for(const s of sizes){assert.equal(s.size,'12px');assert.equal(s.weight,'700');}
  if(process.env.UX_NO_SHOTS!=='1')await page.screenshot({path:`${out}/${engine}-390-search-after.png`});
  await page.locator('[data-search-cancel]').tap();
  await page.evaluate(()=>BibleLensWorkspace.navigate('#places'));await page.locator('.place-profile-card').first().waitFor();await page.locator('#places-search').fill('Baalath beer');await page.locator('.ux-place-open').first().waitFor();assert.equal(await page.locator('.ux-place-open').count(),1);
  await page.locator('.ux-place-open').first().tap();await page.locator('.atlas-identification').filter({hasText:'Location unknown'}).waitFor();assert(await page.locator('#atlas-map').isHidden());assert(await page.locator('#atlas-external').isHidden());assert.equal(await page.locator('#atlas-sheet .maplibregl-marker:visible').count(),0);await page.keyboard.press('Escape');
  for(const button of await page.locator('#places-view .directory-categories button').all()){
   if(await button.getAttribute('aria-label')==='All')continue;
   await button.tap();assert.equal(await page.locator('.ux-place-open').count(),0);
  }
  await page.getByRole('button',{name:'All',exact:true}).tap();assert.equal(await page.locator('.ux-place-open').count(),1);
  matrix.push({engine,unknownPlace:'PASS: note, no pin, All only',searchLabels:'PASS'});
  await context.close();
 }finally{await browser.close();}
}
fs.writeFileSync(root+'/UX8b-logs/browser-matrix.json',JSON.stringify(matrix,null,2)+'\n');console.log('PASS: Chromium/WebKit, 320/375/390, all editions, short/long titles, no control intersections; Search labels; unknown place All only.');
