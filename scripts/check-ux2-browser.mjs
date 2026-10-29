import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const output=process.env.UX2_SHOTS||`${os.homedir()}/git/codex-reports/ux2-shots`;
fs.mkdirSync(output,{recursive:true});
const results=[];
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch({headless:true});
 try{for(const [width,height] of [[375,812],[430,932]])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true,colorScheme:theme,reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForSelector('.ux-topic-row');await page.waitForFunction(()=>!document.documentElement.classList.contains('bl-starting'));
  await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);
  const go=async(hash,selector)=>{await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await page.waitForSelector(selector);};
  const shot=async name=>{await page.evaluate(()=>document.fonts.ready);const path=`${output}/${engine}-${width}-${theme}-${name}.png`;if(process.env.BIBLELENS_REUSE_SHOTS!=='1'||!fs.existsSync(path))if(process.env.UX_NO_SHOTS!=='1')await page.screenshot({path});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,name+' overflow');};
  assert.deepEqual(await page.locator('.lens-primary a').allTextContents(),['Read','Explore','Saved']);
  assert.deepEqual(await page.locator('.ux-topic strong').allTextContents(),['Stories','People','Places','Commandments','Evidence']);
  assert.equal(await page.locator('.ux-topic-row').count(),1);
  assert.equal(await page.locator('.ux-topic-row').evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length),2);
  await shot('explore-grid');
  await page.locator('[data-topic=people]').tap();await page.waitForSelector('.ux-person-open');
  assert.equal(await page.locator('.characters-alphabet').count(),0);assert.equal(await page.locator('#characters-list>.character-card').count(),15);
  assert.match(await page.locator('.characters-pagination').innerText(),/Page 1 of \d+/);await shot('people-page-1');
  await page.getByRole('button',{name:'Next',exact:true}).tap();assert.match(await page.locator('.characters-pagination').innerText(),/Page 2 of/);
  await page.locator('#characters-search').fill('K');await page.waitForFunction(()=>document.querySelector('#characters-list h2').textContent.startsWith('K'));
  assert.equal(await page.locator('#characters-list>.character-card').count(),15);await shot('people-k');
  let mosesTaps=0;await page.locator('#characters-search').tap();mosesTaps++;
  await page.locator('#characters-search').fill('Moses');await page.waitForSelector('a[aria-label="Open Moses"]');assert((await page.locator('.character-name').first().innerText()).includes('Moses'));
  await page.locator('a[aria-label="Open Moses"]').tap();mosesTaps++;assert(mosesTaps<=2,'Moses opens within two taps from People search');await page.waitForSelector('#character-sheet[open]');assert.match(await page.locator('#character-sheet').innerText(),/Moses/);
  assert.equal(await page.locator('#character-sheet button[aria-label=Close]').count(),1);await page.keyboard.press('Escape');await page.waitForSelector('#character-sheet[open]',{state:'hidden'});
  await go('#discover?section=evidence','.ux-topic-row');
  const counts=await (await page.request.get(base+'/collection-counts.json')).json();
  await page.waitForFunction(()=>document.querySelector('.ux-count')?.textContent!=='…');
  assert.deepEqual(await page.locator('.ux-topic strong').allTextContents(),['History','Science','Timeline','Text Comparisons','Translations','Questions',...(counts.prophecies>=20?['Prophecies']:[])]);await shot('evidence-grid');
  // Child-path matrix: swiping locates a tile; only activations count as taps.
  await go('#discover','.ux-topic-row');
  await page.locator('.ux-topic[data-topic=evidence]').scrollIntoViewIfNeeded();
  await page.locator('.ux-topic[data-topic=evidence]').tap();let questionTaps=1;
  await page.waitForSelector('.ux-topic[data-topic=questions]');
  await page.locator('.ux-topic[data-topic=questions]').scrollIntoViewIfNeeded();
  await page.locator('.ux-topic[data-topic=questions]').tap();questionTaps++;
  await page.waitForSelector('.accepted-questions .phase2-debate-card');
  const crumbs=()=>page.locator('.lens-context').innerText();
  assert.match(await crumbs(),/.+/);
  assert.equal(await page.locator('.lens-primary [aria-current=page]').innerText(),'Explore');
  await shot('questions');
  const questionRoute=await page.locator('.accepted-questions a').first().getAttribute('href');
  await page.locator('.accepted-questions a').first().tap();questionTaps++;
  await page.waitForSelector('[data-accepted-save]');
  assert.match(await crumbs(),/.+/);
  assert.equal(await page.locator('.lens-primary [aria-current=page]').innerText(),'Explore');
  await shot('question-detail');assert(questionTaps<=3);
  await page.locator('.lens-primary [data-lens-view=explore]').tap();const homeTaps=1;
  await page.waitForSelector('.ux-topic-row');assert.equal(await page.evaluate(()=>location.hash),'#discover');assert(homeTaps<=2);
  // Cold old links, aliases, and legacy detail routes retain their pages and owner.
  for(const hash of ['#questions','#debates',questionRoute,'#debate/early-ahaziah']){
   await page.goto(base+'/'+hash);
   await page.waitForSelector(hash===questionRoute?'[data-accepted-save]':hash.includes('/early-')?'.phase2-sides:not([aria-busy])':'.accepted-questions a');
   await page.waitForFunction(()=>document.querySelector('.lens-context [aria-current=page]')?.textContent.trim());
   assert.equal(await page.locator('.lens-primary [aria-current=page]').innerText(),'Explore');
   assert.match(await crumbs(),/.+/);
  }
  await go('#places','.place-profile-card');assert.equal(await page.locator('.places-directory-list>li').count(),15);await shot('places');
  await page.getByRole('button',{name:'Next',exact:true}).tap();assert.match(await page.locator('.places-directory-pagination').innerText(),/Page 2 of/);
  await page.locator('#places-search').fill('Jericho');await page.waitForFunction(()=>document.querySelector('.place-profile-card h2').textContent==='Jericho');assert(await page.locator('.place-profile-card').count()<=15);
  await go('#read/0/1','#lens-focus');await page.waitForSelector('#verse-1');
  await page.locator('#lens-focus').tap();await page.locator('#verse-3 .verse-num').tap();await page.waitForSelector('#lens-inspector-sheet[open]');await page.waitForFunction(()=>comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));await shot('read-evidence');
  assert.equal(await page.locator('#lens-inspector-sheet img').count(),0);
  const close=page.locator('[data-context-close]');assert.equal(await close.count(),1);const r=await close.boundingBox();assert(r.width>=44&&r.height>=44);
  await page.touchscreen.tap(2,2);await page.waitForSelector('#lens-inspector-sheet[open]',{state:'hidden'});assert.equal(await page.evaluate(()=>document.activeElement.className),'verse-num');
  await page.locator('#verse-3 .verse-num').tap();await page.keyboard.press('Escape');await page.waitForSelector('#lens-inspector-sheet[open]',{state:'hidden'});
  await page.locator('#lens-compare').tap();await page.waitForSelector('#lens-inspector-sheet[open]');assert.equal(await page.locator('#lensComparison img').count(),0);await shot('read-compare');
  await page.locator('#lens-compare-right').fill('Genesis 2');await page.getByRole('button',{name:'Compare Passages',exact:true}).tap();await page.waitForSelector('.lens-comparison-passage');await shot('read-compare');
  await page.touchscreen.tap(2,2);await page.waitForSelector('#lens-inspector-sheet[open]',{state:'hidden'});assert.equal(await page.evaluate(()=>document.activeElement.id),'lens-compare');
  await page.locator('.study-library>summary').tap();await page.locator('#collection').scrollIntoViewIfNeeded();assert.equal(await page.locator('#collection input[type=search]').count(),0);await shot('studies');
  await page.locator('#lens-settings').tap();await page.waitForSelector('#reader-settings[open]');assert.equal(await page.locator('#reader-settings button[aria-label=Close]').count(),1);await page.keyboard.press('Escape');await page.waitForSelector('#reader-settings[open]',{state:'hidden'});
  assert.deepEqual(errors,[]);results.push({engine,width,height,theme,status:'PASS',mosesTaps,questionTaps,homeTaps,questionRoutes:'PASS',outsideEvidence:'PASS',outsideCompare:'PASS'});
  fs.writeFileSync(`${output}/matrix.json`,JSON.stringify(results,null,2)+'\n');console.log('PASS '+JSON.stringify(results.at(-1)));await context.close();
 }}finally{await browser.close();}
}
