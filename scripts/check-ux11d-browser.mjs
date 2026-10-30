import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875',root=process.env.HOME+'/git/codex-reports',rows=[];
for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch();try{for(const width of [320,375,390]){
  const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce',serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const go=async(hash,selector)=>{await page.goto(base+'/'+hash);await page.locator(selector).first().waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(150);};
  await go('#stories','.story-card');
  assert.equal(await page.locator('#stories-list .story-card').count(),24);
  const all=await page.evaluate(async()=>{const catalog=await(await fetch('/stories.json')).json(),list=document.querySelector('#stories-list'),saved=list.innerHTML;list.innerHTML=catalog.flatMap(g=>g.stories).map(story=>storyCard(story)).join('');fitStoryFooters();const measurements=[...list.querySelectorAll('.story-footer')].map(n=>{const meta=n.querySelector('.story-linked-meta'),action=n.querySelector('.action-link'),m=meta?.getBoundingClientRect(),a=action.getBoundingClientRect();return {id:n.closest('article').id,meta:meta?.textContent,overflow:meta&&meta.scrollWidth>meta.clientWidth,aligned:!m||Math.abs(m.top+m.height/2-a.top-a.height/2)<1,collide:m&&m.right>a.left-7};});list.innerHTML=saved;fitStoryFooters();return measurements;});
  assert.equal(all.length,284);assert.deepEqual(all.filter(x=>x.overflow||!x.aligned||x.collide),[],'all story footers');
  for(const [hash,selector]of [['#characters','.ux-contact'],['#places','.place-profile-card'],['#commandments','.commandment-card'],['#questions?mode=history','.phase2-debate-card'],['#questions?mode=science','.phase2-debate-card'],['#questions?mode=text','.phase2-debate-card'],['#questions?filter=T','.phase2-debate-card'],['#questions','.phase2-debate-card']]){
   await go(hash,selector);await page.locator('.directory-hub:not([hidden]) .stories-header').waitFor();
   const host=page.locator('.directory-hub:not([hidden])');
   const footers=await host.locator(selector+' .story-footer').evaluateAll(ns=>ns.map(n=>({actions:n.querySelectorAll('a,button').length+(n.closest('a.phase2-debate-card')?1:0),dividers:[...n.children].filter(x=>getComputedStyle(x).borderTopWidth!=='0px').length})));
   assert(footers.length>0);for(const f of footers){assert.equal(f.actions,1);assert.equal(f.dividers,0);}
   const cards=await host.locator(selector).count();assert(cards<=24,'initial page size');
   assert.equal(await host.locator('.stories-header').evaluate(n=>getComputedStyle(n).borderBottomWidth),'1px');
   if(hash==='#characters'){
    assert.match(await host.locator('.directory-results').innerText(),/1–24 of 3,067/);
    await page.locator('#ux-alphabet-open').click();const sheet=page.locator('#ux-alphabet-sheet[open]');await sheet.waitFor();assert.equal(await sheet.locator('.ux-dialog-path').count(),0);assert.equal(await sheet.locator('.ux-alphabet-grid button').count(),26);assert.equal(await sheet.locator('.ux-popup-close').count(),1);
    const box=await sheet.boundingBox();assert(Math.abs(box.width-width)<1);assert(box.y+box.height<=772+.5);await page.keyboard.press('Escape');
    assert(await page.locator('#ux-alphabet-open').evaluate(n=>n.closest('.stories-search-box')!==null),'alphabet trigger stays in search row');
    await page.locator('.characters-pagination').scrollIntoViewIfNeeded();
    const overlap=await page.evaluate(()=>{const b=document.querySelector('#ux-alphabet-open').getBoundingClientRect(),a=[...document.querySelectorAll('#characters-list .story-footer .action-link')].at(-1).getBoundingClientRect();return a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom;});assert(!overlap,'last action clears floating alphabet button');
   }
   if(hash==='#commandments'){await host.locator('.story-footer .action-link').first().click();await host.locator('.commandment-context:not([hidden]) q').first().waitFor();}
   if(hash==='#places'){
    assert.match(await host.locator('.directory-results').innerText(),/of 1,293 /);
    assert.equal(await host.locator('.directory-references').count(),0);
    await host.locator('.ux-place-open').first().click();const expanded=host.locator('.place-details.open');await expanded.waitFor();assert(await expanded.getByRole('heading',{name:'Sources',exact:true}).isVisible());assert.match(await expanded.locator('.place-inline-passages a').first().getAttribute('href'),/^#read\/\d+\/\d+\/\d+$/);assert(!await page.locator('#atlas-sheet').isVisible());
   }
   if(hash.startsWith('#evidence/')||hash.startsWith('#questions?mode=')){
    const selected=host.locator('.filter-carousel .active').first();if(await selected.count()){assert(await selected.evaluate(n=>{const r=n.getBoundingClientRect(),p=n.closest('.filter-carousel').getBoundingClientRect();return r.left>=p.left-.5&&r.right<=p.right+.5;}),'selected chip fully in view');}
   }
   if(hash==='#evidence/academic?book=all'){await host.locator('[data-comparison-inspect]').first().click();await page.locator('.comparison-context-dialog[open]').waitFor();assert(await page.locator('.comparison-context-dialog .comparison-sides').count()>0,'passages retained in detail');await page.keyboard.press('Escape');}
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),hash+' overflow');
  }
  await go('#questions?mode=text&page=43','.phase2-debate-card');assert.match(await page.locator('#debate-count').innerText(),/Showing 1,033–1,056 of 1,832/);
  await go('#discover','.ux-topic');assert.equal(await page.locator('#ux-topic-places .ux-count').innerText(),'1,293');
  for(const [key,target]of Object.entries({academic:'#questions?mode=history',Q:'#questions',contradictions:'#questions?mode=text',T:'#questions?filter=T',V:'#discover?section=evidence'})){
   for(const legacy of ['#evidence/'+key+'?book=all','#categories/'+key+'?book=all','#saved/'+key+'?book=all','#evidence?kind='+key]){
    await page.goto(base+'/'+legacy);await page.waitForFunction(target=>location.hash===target,target);await page.locator(target.startsWith('#discover')?'.ux-topic':'.phase2-debate-card').first().waitFor();
    assert(!/Violations/.test(await page.locator('body').innerText()),legacy+' has no Violations label');
   }
  }
  await go('#questions?filter=T','.phase2-debate-card');
  const translation=page.locator('[data-debate-mode="translation"]');assert.equal(await translation.getAttribute('aria-pressed'),'true');assert.match(await translation.innerText(),/Translations \(1,357\)/);
  assert.equal(await page.locator('[data-debate-mode="text"]').getAttribute('aria-pressed'),'false');
  assert(await translation.evaluate(n=>{const r=n.getBoundingClientRect(),p=n.closest('.filter-carousel').getBoundingClientRect();return r.left>=p.left-.5&&r.right<=p.right+.5;}));
  await page.locator('[data-debate-filters]').click();assert(!/Violations|Academic|Book, Chapter/.test(await page.locator('#debate-sheet').innerText()));await page.keyboard.press('Escape');
  await go('#read/0/1','#verse-1');await page.waitForFunction(()=>comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));await page.locator('#verse-1 .verse-num').click();await page.locator('#ux-empty-verse-toast').waitFor();
  assert(await page.locator('#ux-empty-verse-actions #ux-empty-verse-toast').count()===1,'empty message is inside action strip');
  const clear=await page.evaluate(()=>{const m=document.querySelector('#ux-empty-verse-toast').getBoundingClientRect(),a=document.querySelector('#ux-empty-verse-actions .ux-verse-actions').getBoundingClientRect(),v=document.querySelector('#verse-1').getBoundingClientRect();return m.bottom<=a.top+.5&&v.bottom<m.top;});assert(clear,'message, actions and selected scripture do not overlap');
  assert.deepEqual(errors,[]);rows.push({engine,width,stories:all.length,status:'PASS'});await page.close();console.log('PASS UX11d',engine,width);
 }}finally{await browser.close();fs.writeFileSync(root+'/UX11-logs/ux11d-matrix.json',JSON.stringify(rows,null,2)+'\n');}
}
