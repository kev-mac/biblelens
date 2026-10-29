import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
for(const [name,type] of Object.entries({chromium,webkit})){
 if(process.env.UX3_ENGINE&&process.env.UX3_ENGINE!==name)continue;
 const browser=await type.launch();
 try{
  for(const theme of ['light','dark']){
   const context=await browser.newContext({viewport:{width:375,height:812},hasTouch:true,isMobile:true,colorScheme:theme,reducedMotion:'reduce'});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base);await page.waitForFunction(()=>window.BibleLensWorkspace&&!document.documentElement.classList.contains('bl-starting'));
   await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);
   const go=async(hash,selector)=>{await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await page.locator(selector).first().waitFor();};
   const links=async()=>{
    await page.evaluate(()=>new Promise(requestAnimationFrame));
    const underlined=await page.evaluate(()=>[...document.querySelectorAll('a')].filter(n=>n.isConnected&&n.getClientRects().length&&!n.matches(':focus-visible')&&getComputedStyle(n).textDecorationLine!=='none').map(n=>n.textContent));
    assert.deepEqual(underlined,[],'Links have no underline outside keyboard focus');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No horizontal page overflow');
   };
   for(const hash of ['#discover','#discover?section=evidence']){
    await go(hash,'.ux-topic');await page.evaluate(()=>document.fonts.ready);
    for(let width=360;width<=430;width++){
     await page.setViewportSize({width,height:812});
     const metrics=await page.locator('.ux-tile-copy strong').evaluateAll(nodes=>nodes.map(n=>{const r=document.createRange();r.selectNodeContents(n);return {text:n.textContent,lines:r.getClientRects().length,width:r.getBoundingClientRect().width,available:n.clientWidth,size:getComputedStyle(n).fontSize};}));
     assert.equal(new Set(metrics.map(n=>n.size)).size,1,'All collection titles use the same size');
     for(const label of metrics){assert(label.width<=label.available+1,label.text+' fits at '+width);assert(label.lines<=2,label.text+' stays within two grid lines at '+width);}
     await links();
    }
   }
   const link=page.locator('.lens-brand');await link.hover();assert.equal(await link.evaluate(n=>getComputedStyle(n).textDecorationLine),'none');await page.keyboard.press('Tab');await link.focus();assert.equal(await link.evaluate(n=>getComputedStyle(n).textDecorationLine),'underline');await link.blur();
   await go('#read/0/1','#verse-1');
   const closeAtCorner=async selector=>{
    const panel=page.locator(selector);if(selector==='#lens-inspector-sheet'&&await page.locator('#lensComparison:visible').count()){await page.keyboard.press('Escape');return;}if(selector==='#lens-inspector-sheet'&&await page.locator('[data-context-close]:visible').count()){const r=await page.locator('[data-context-close]').boundingBox();assert(r.width>=44&&r.height>=44);await links();await page.keyboard.press('Escape');return;}const close=panel.locator('.ux-popup-close:visible');await close.waitFor();
    assert.equal(await close.count(),1);assert.equal(await close.locator('svg').count(),1);
    const {r,p}=await panel.evaluate(n=>{const r=n.querySelector('.ux-popup-close').getBoundingClientRect(),p=n.getBoundingClientRect();return {r:{x:r.x,y:r.y,width:r.width,height:r.height},p:{x:p.x,y:p.y,width:p.width,height:p.height}};});assert(r.width>=44&&r.height>=44);
    assert(Math.abs(r.y-p.y-11)<3&&Math.abs(p.x+p.width-r.x-r.width-11)<3,selector+' close stays at the surface corner '+JSON.stringify({r,p}));
    const icon=await close.locator('svg').boundingBox();assert.equal(icon.width,24);assert.equal(icon.height,24);
    await links();await page.keyboard.press('Escape');
   };
   // Check the shell before any directory stylesheet has loaded.
   for(const [trigger,selector] of [['#verse-3 .verse-num','#lens-inspector-sheet'],['#lens-compare','#lens-inspector-sheet']]){await page.locator(trigger).click();await closeAtCorner(selector);}
   await page.locator('#verse-1 .verse-body').click();await closeAtCorner('#lens-inspector-sheet');
   const id=await page.evaluate(()=>ENTRIES[0].id);await go('#study/'+id,'#study-dialog[open]');await closeAtCorner('#study-dialog');
   await go('#people','.ux-person-open');await page.locator('#characters-search').fill('Moses');await page.locator('a[aria-label="Open Moses"]').click();await closeAtCorner('#character-sheet');await page.locator('#characters-search').fill('');
   for(const [hash,selector] of [['#people','.characters-pagination'],['#places','.places-directory-pagination'],['#evidence/T','.category-pagination']]){
    await go(hash,selector);await links();
    for(const button of await page.locator(selector+' button:visible').all())assert((await button.boundingBox()).height>=44,'Paging targets stay 44px');
   }
   for(const width of [375,430]){
    await page.setViewportSize({width,height:812});
    await go('#evidence/Q?book=all','.category-profile-card');
    const card=page.locator('.category-profile-card').first(),toggle=card.locator('[data-category-section][aria-controls$="-verses"]');
    if(await toggle.getAttribute('aria-expanded')==='true')await toggle.click();await toggle.click();
    const row=card.locator('.context-short');await row.waitFor();
    await page.waitForFunction(()=>{const row=document.querySelector('.category-profile-panel:not([hidden]) .context-short');return row&&row.scrollWidth<=row.clientWidth;});
    const more=row.locator('[data-context-expand]'),hidden=await row.locator('a[hidden]').count();
    assert.equal(await more.isVisible(),hidden>0,'Additional citations stay reachable when the row needs them at '+width);
    if(hidden){const r=await row.boundingBox(),m=await more.boundingBox();assert(m.x>=r.x&&m.x+m.width<=r.x+r.width+1,'Citation count fits inside its row');await more.click();assert(await card.locator('.context-full').isVisible());await card.locator('[data-context-collapse]').click();assert(await row.isVisible());}await links();
   }
   await go('#notebook','#lens-notebook-list');await links();
   const labels=await page.locator('[data-lens-filter]').evaluateAll(nodes=>nodes.map(n=>{const r=document.createRange();r.selectNodeContents(n);return {lines:r.getClientRects().length,width:r.getBoundingClientRect().width,available:n.clientWidth};}));
   for(const label of labels){assert.equal(label.lines,1);assert(label.width<=label.available);}
   assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${name} ${theme}: all 71 widths 360–430; consistent grid titles, links/focus, 44px popup/paging controls, SVG corners, shared verse drawer and Saved filters`);
  }
 }finally{await browser.close();}
}
