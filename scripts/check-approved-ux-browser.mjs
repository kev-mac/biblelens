import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';

const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8878';
const report='.release/approved-ux';fs.mkdirSync(report,{recursive:true});
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{
  for(const [width,theme] of (engine==='chromium'?[[390,'dark'],[474,'dark'],[1280,'light']]:[[390,'dark'],[390,'light']])){
   const context=await browser.newContext({viewport:{width,height:975},serviceWorkers:'block',reducedMotion:'reduce'});
   const page=await context.newPage(),errors=[];page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(e.message));
   async function go(hash,selector){await page.goto(base+'/'+hash);await page.locator(selector+':visible').first().waitFor();await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);await page.evaluate(()=>document.fonts.ready);}
   async function fits(){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'page fits '+page.url());}
   await go('#discover','#ux-topic-stories');
   assert.deepEqual(await page.locator('[data-lens-view]').evaluateAll(ns=>ns.map(n=>n.dataset.lensView)),['read','explore','notebook']);
   assert.equal(await page.locator('.ux-topic').count(),7);
   assert.equal(await page.locator('#ux-topic-prophecies').count(),0);
   await page.getByRole('button',{name:'Evidence',exact:true}).click();
   assert.equal(await page.locator('.ux-topic').count(),2);
   assert(await page.locator('#ux-topic-evidence').isVisible());
   await page.getByRole('button',{name:'People & Stories',exact:true}).click();
   assert.equal(await page.locator('.ux-topic').count(),5);
   await page.getByRole('button',{name:'All',exact:true}).click();await fits();
   await page.screenshot({path:`${report}/${engine}-${width}-${theme}-explore.png`,fullPage:true});
   // Existing bookmarked Evidence hub URLs still lead to their collections.
   await go('#discover?section=evidence','#ux-topic-evidence');
   assert.equal(await page.locator('[data-lens-view=explore]').getAttribute('aria-current'),'page');
   await go('#read/0/1','#verse-1');
   assert.equal(await page.locator('#lens-edition').inputValue(),'web','new reader defaults to WEB');
   await page.waitForFunction(()=>comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));
   const linked=page.locator('[data-lens-inspect]').first();assert(await linked.count(),'evidence remains discoverable');
   const verse=await linked.getAttribute('data-lens-inspect');
   await page.locator(`#verse-${verse} .verse-num`).click();
   await page.locator('#ux-empty-verse-actions').waitFor();
   assert.equal(await page.locator('#lens-inspector-sheet').evaluate(n=>n.open),false,'verse taps leave reading unobscured');
   const key='0:1:'+verse;
   await page.locator('#ux-empty-verse-actions [data-context-bookmark]').click();
   assert.equal(await page.locator('#ux-empty-verse-actions [data-context-bookmark]').getAttribute('aria-pressed'),'true');
   assert(await page.evaluate(key=>!!state.verseBookmarks[key],key));
   // Bookmark rendering restores scroll on the next frame; reopen the normal
   // verse controls after that restoration before choosing the next action.
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   await page.locator(`#verse-${verse} .verse-num`).click();
   await page.locator('#ux-empty-verse-actions [data-context-note]').click();
   await page.locator('#lens-margin-note:visible').fill('Private UX verification note');
   assert.equal(await page.evaluate(key=>state.verseNotes[key].text,key),'Private UX verification note');
   await page.keyboard.press('Escape');
   await page.locator(`#verse-${verse} .verse-num`).click();
   await page.locator('#ux-empty-verse-actions [data-context-evidence]').click();
   await page.locator('#lens-inspector-sheet[open] .lens-evidence').first().waitFor();
   await page.keyboard.press('Escape');
   // Badges open the records directly, while ordinary taps always use the bar.
   await page.locator('[data-lens-inspect]').first().click();await page.locator('#lens-inspector-sheet[open]').waitFor();await page.keyboard.press('Escape');
   const emptyVerse=await page.locator('#chapter-text .verse').evaluateAll(ns=>ns.find(n=>!n.querySelector('[data-lens-inspect]'))?.id);
   assert(emptyVerse,'chapter has a verse without direct links');
   await page.locator('#'+emptyVerse+' .verse-num').click();
   await page.getByRole('button',{name:'Explore chapter context',exact:true}).click();
   await page.locator('#lens-inspector-sheet[open] .lens-context-scope').waitFor();
   assert.match(await page.locator('.lens-context-scope').innerText(),/not a single verse/);
   assert(await page.locator('#lensInspector .lens-evidence').count(),'chapter records are available without inventing a verse link');
   await page.keyboard.press('Escape');await fits();
   // Real old states without a default marker must retain every valid edition.
   for(const edition of ['kjv','asv','web']){
    await page.evaluate(edition=>{state.readerPreferences.edition=edition;delete state.readerEditionDefault;persist();},edition);
    await page.reload();await page.locator('#verse-1').waitFor();assert.equal(await page.locator('#lens-edition').inputValue(),edition);
   }
   await go('#commandments','.commandment-card');
   const before=await page.locator('#commandments-count').innerText();
   await page.locator('#commandments-view nav[aria-label="Law topics"]').getByRole('button',{name:/^Justice \(/}).click();
   assert.notEqual(await page.locator('#commandments-count').innerText(),before);
   assert(await page.locator('.commandment-card').evaluateAll(ns=>ns.every(n=>n.querySelector('.commandment-topic').textContent.includes('Justice'))));
   assert(await page.locator('.commandment-card').first().evaluate(n=>n.querySelector('h2').compareDocumentPosition(n.querySelector('.commandment-number'))&Node.DOCUMENT_POSITION_FOLLOWING));
   await fits();
   await go('#people','.person-section-toggle');
   await page.locator('#characters-list .person-section-toggle:disabled').first().waitFor();
   const colors=await page.locator('#characters-list .person-section-toggle').evaluateAll(ns=>ns.map(n=>({disabled:n.disabled,color:getComputedStyle(n).color,icon:getComputedStyle(n.querySelector('.person-section-icon')).color})));
   assert(colors.every(c=>c.color===c.icon),'icon and label inherit the same state color');
   if(theme==='dark')assert(colors.filter(c=>!c.disabled).every(c=>c.color==='rgb(255, 255, 255)'),'available actions are white');
   assert(colors.filter(c=>c.disabled).every(c=>c.color!=='rgb(255, 255, 255)'),'unavailable actions retain a dim tint');
   for(const selector of ['.directory-filter-open','.directory-filter-open>span']){
    assert.equal(await page.locator('#characters-view .stories-header '+selector).evaluate(n=>getComputedStyle(n).borderTopWidth),'0px',selector);
   }
   await fits();await page.screenshot({path:`${report}/${engine}-${width}-${theme}-people.png`,fullPage:true});
   await go('#questions?mode=history','.phase2-debate-card');await page.locator('.phase2-debate-card').first().click();
   await page.locator('#debate-view .editorial-status-info').waitFor();
   assert(await page.locator('#debate-view>h1').isVisible(),'full record title stays in the body');
   assert((await page.locator('.lens-context h1').innerText()).length<35,'header names the collection');
   await page.locator('#debate-view .editorial-status-info summary').click();
   assert.match(await page.locator('.editorial-status-info').innerText(),/not a scholarly consensus/);
   await fits();assert.deepEqual(errors,[]);
   await context.close();console.log('PASS approved UX:',engine,width,theme);
  }
 }finally{await browser.close();}
}
