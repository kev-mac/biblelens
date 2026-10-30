import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875',root=process.env.HOME+'/git/codex-reports',out=process.env.UX_SHOT_DIR||root+'/ux9-shots',matrix=[];
fs.mkdirSync(out,{recursive:true});
for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch();try{for(const width of [320,390,1440]){
 const context=await browser.newContext({viewport:{width,height:width===1440?900:844},hasTouch:width<600,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 const go=async(hash,selector)=>{await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await page.locator(selector).first().waitFor();};
 const shot=async(name)=>{
  await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(80);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,name+' document overflow');
  const small=await page.locator('button:visible,a:visible,select:visible,summary:visible').evaluateAll(nodes=>nodes.filter(n=>!n.disabled&&!n.matches('.skip,.sr-only')).map(n=>{const r=n.getBoundingClientRect();return {label:n.getAttribute('aria-label')||n.textContent.trim().slice(0,45),w:r.width,h:r.height};}).filter(r=>r.w<43.9||r.h<43.9));
  matrix.push({engine,width,screen:name,smallTargets:small});
  if(engine==='chromium'&&process.env.UX_NO_SHOTS!=='1')await page.screenshot({path:`${out}/${width}-${name}.png`});
 };
 await page.goto(base+'/#stories');await page.locator('#stories-list .story-card').first().waitFor();
 await page.route('**/assets/characters.*.js',async route=>{await new Promise(resolve=>setTimeout(resolve,1500));await route.continue();});
 await page.evaluate(()=>BibleLensWorkspace.navigate('#people'));await page.waitForTimeout(150);assert.equal(await page.locator('.lens-context h1').innerText(),'People');assert.equal(await page.title(),'People · BibleLens');await shot('people-loading');await page.locator('.ux-contact').first().waitFor();await page.unroute('**/assets/characters.*.js');
 await page.goto(base+'/#read/0/1');await page.locator('#verse-3 .verse-num').waitFor();await page.waitForFunction(()=>comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));
 await shot('read');const verse=page.locator('#verse-3 .verse-num'),target=await verse.boundingBox();assert(target.width>=44&&target.height>=44);
 await verse.click();await page.locator('#lens-inspector-sheet[open]').waitFor();await shot('verse-evidence');
 for(const quote of await page.locator('#lensInspector .comparison-side q').all())assert(await quote.evaluate(n=>n.clientWidth>=n.closest('.lens-evidence').clientWidth-40),'Evidence quotes fill card');
 await page.locator('[data-context-bookmark]').click();assert.match(await page.locator('#lens-action-toast').innerText(),/^Saved/);await page.keyboard.press('Escape');
 await go('#notebook?section=notes','#lens-notebook-status');assert.match(await page.locator('#lens-notebook-status').innerText(),/^0 saved items/);assert.equal(await page.locator('#lens-notebook-list .lens-note').count(),0);assert(await page.locator('#lens-action-toast').isHidden());await shot('saved-notes');
 await go('#notebook?section=bookmarks','#lens-notebook-list .lens-note');assert.match(await page.locator('#lens-notebook-status').innerText(),/^1 saved item/);await shot('saved-bookmarks');
 await go('#notebook?section=investigations','#lens-notebook-status');assert.match(await page.locator('#lens-notebook-status').innerText(),/^0 saved items/);await shot('saved-comparisons');
 await go('#notebook?section=saved','#lens-notebook-status');assert.equal(await page.locator('[data-lens-filter=saved]').innerText(),'Questions & Profiles');await shot('saved-questions');
 await go('#read/0/1','#verse-3');await page.locator('#verse-3 .verse-num').click();await page.locator('[data-context-compare]').click();assert.equal(await page.locator('#lens-compare-left').inputValue(),'Genesis 1:3');await page.locator('#lens-compare-right').fill('John 1:1');await page.locator('#lens-comparison-form').evaluate(form=>form.requestSubmit());await page.locator('.lens-comparison-passage').first().waitFor();await page.locator('[data-compare-layout=side]').click();const cards=await page.locator('.lens-comparison-passage').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().toJSON()));if(width<600)assert(cards[1].y>=cards[0].bottom);await shot('compare');await page.keyboard.press('Escape');
 await go('#people','.ux-contact');await page.locator('#characters-search').fill('Abdi');await page.waitForFunction(()=>document.querySelector('#characters-list h2')?.textContent.startsWith('Abdi'));const names=await page.locator('#characters-list h2').allTextContents();assert.equal(new Set(names).size,names.length);assert(!names.some(name=>/\(\d+ linked verse/.test(name)));await shot('people-duplicates');
 await page.locator('#characters-search').fill('');await page.locator('.ux-contact').nth(14).waitFor();await page.locator('#ux-alphabet-open').click();const rail=page.locator('.ux-alphabet-grid');for(const button of await rail.locator('button:visible').all()){const r=await button.boundingBox();assert(r.width>=44&&r.height>=44);}assert.equal(await rail.locator('button').count(),26);await page.keyboard.press('Escape');await shot('people');
 await page.locator('#characters-search').fill('Paul');await page.locator('a[aria-label="Open Paul"]').click();await page.locator('#character-sheet .person-section-controls').waitFor();assert.equal(await page.title(),'Paul · BibleLens');assert(await page.locator('#character-sheet [data-person-section=stories]').isEnabled());await shot('paul');await page.keyboard.press('Escape');
 await go('#places','.place-profile-card');await page.locator('#places-search').fill('Ramoth');const placeNames=(await page.locator('.place-profile-card h2').allTextContents()).filter(name=>/^Ramoth \(/.test(name));assert.equal(placeNames.length,3);assert.equal(new Set(placeNames).size,3);await shot('places-duplicates');
 await page.locator('#places-search').fill('Beer-elim');assert.equal(await page.locator('.place-profile-card').count(),1);assert.match(await page.locator('.place-profile-card').innerText(),/1 linked verse/i);await page.locator('.ux-place-open').click();await page.locator('.atlas-identification').filter({hasText:'Location unknown'}).waitFor();assert(await page.locator('#atlas-map').isHidden());await shot('unknown-place');await page.keyboard.press('Escape');
 await page.locator('#places-search').fill('Jerusalem');await page.locator('.ux-place-open').first().click();await page.locator('#atlas-name').filter({hasText:'Jerusalem'}).waitFor();assert(!/Jerusalem's/.test(await page.locator('#atlas-names').innerText()));await shot('map-loading');await page.waitForTimeout(1500);await shot('map');await page.keyboard.press('Escape');
 await go('#timeline','[data-timeline-filter]');assert(await page.locator('[data-timeline-filter]').evaluate(n=>n.getBoundingClientRect().right<=innerWidth));await shot('timeline');
 for(const [name,hash]of [['history','#questions?mode=history'],['science','#questions?mode=science'],['text-comparisons','#questions?mode=text'],['translations','#questions?mode=text&filter=T']]){
  await go(hash,'#debate-results .phase2-debate-card');if(name==='history'||name==='science')assert.equal(await page.locator('#debates-view h1').innerText(),'Text vs. '+name[0].toUpperCase()+name.slice(1));await shot(name);
  for(const button of await page.locator('#debates-view .ux-interior-chips button').all()){await button.scrollIntoViewIfNeeded();assert(await button.evaluate(n=>{const r=n.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}));}
 }
 await go('#stories','#stories-list .story-card');assert(await page.locator('#stories-theme').isHidden());await shot('stories');
 await go('#search?q=Jerusalem','#lens-results-places .lens-result');assert(!/\]\(|\)\(\/|Jerusalem's/.test(await page.locator('#lens-results-places').innerText()));await shot('search');await page.locator('[data-search-cancel]').click();
 await page.route('**/api/search?*',async route=>{await new Promise(resolve=>setTimeout(resolve,2500));await route.continue().catch(()=>{});});
 const started=Date.now();await page.evaluate(()=>BibleLensWorkspace.navigate('#search?q=John+3%3A16'));await page.locator('#lens-results-scripture .lens-result').first().waitFor({timeout:1000});assert(Date.now()-started<1000);assert(await page.locator('.ux-search-skeleton').isVisible());await shot('instant-reference');await page.locator('#lens-search-results[aria-busy=true]').waitFor({state:'hidden'});await page.unroute('**/api/search?*');
 assert.deepEqual(errors,[]);console.log('PASS',engine,width);await context.close();
 }}finally{await browser.close();}
}
fs.writeFileSync((process.env.UX_REPORT_DIR||root+'/UX9-logs')+'/ux9-browser-matrix.json',JSON.stringify(matrix,null,2)+'\n');
const small=matrix.filter(row=>row.smallTargets.length);assert.deepEqual(small,[],'All visible controls meet 44 px targets');
console.log('PASS UX9 browser matrix: Chromium/WebKit 320/390/1440; counts, references, quotes, layouts, titles, unknown locations, chips and instant reference matches.');
