import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const output=process.env.UX6_SHOTS||`${os.homedir()}/git/codex-reports/ux6-shots`;
fs.mkdirSync(output,{recursive:true});const matrix=[];
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const theme of ['dark','light']){
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#discover');await page.locator('.ux-daily-question').waitFor();
 await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);
 const go=async(hash,selector)=>{await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await page.locator(selector).first().waitFor();};
 const shot=async(name)=>{await page.evaluate(()=>document.fonts.ready);if(process.env.UX_NO_SHOTS!=='1')await page.screenshot({path:`${output}/${engine}-390-${theme}-${name}.png`});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,name+' overflow');};
 const questions=await (await page.request.get(base+'/accepted-questions.json')).json();questions.sort((a,b)=>a.id.localeCompare(b.id));
 const today=questions[Math.floor(Date.now()/86400000)%questions.length];
 assert.equal(await page.locator('.ux-daily-question h2').textContent(),today.question);await shot('explore');
 await page.locator('.ux-daily-question').tap();await page.locator('[data-accepted-save]').waitFor();assert.equal(await page.locator('#debate-view h1').textContent(),today.question);
 await go('#people','.ux-contact');await shot('people-all');assert.equal(await page.locator('.ux-contact').count(),15);assert.equal(await page.locator('.ux-contact .directory-reference').count(),0);assert.equal(await page.locator('.directory-alphabet button').count(),26);
 const rail=page.locator('.directory-alphabet');assert((await rail.boundingBox()).width>=44);assert.equal(await rail.evaluate(n=>getComputedStyle(n).touchAction),'none');
 const m=page.getByRole('button',{name:'Jump to M',exact:true}),r=await m.boundingBox();
 await page.mouse.move(r.x+r.width/2,r.y+r.height/2-35);await page.mouse.down();await page.mouse.move(r.x+r.width/2,r.y+r.height/2,{steps:8});
 assert.equal(await page.locator('.ux-letter-bubble').textContent(),'M');assert.equal(await page.locator('.ux-letter-bubble').isVisible(),true);await page.mouse.up();assert.equal(await page.locator('.ux-letter-bubble').isVisible(),false);
 assert((await page.locator('#characters-list h2').allTextContents()).some(name=>name.startsWith('M')));await page.evaluate(()=>scrollTo(0,0));await shot('people');
 await page.locator('#characters-search').tap();await page.locator('#characters-search').fill('Moses');await page.locator('a[aria-label="Open Moses"]').waitFor();
 const clear=page.locator('.ux-search-field:has(#characters-search) .ux-search-clear');assert.equal(await clear.getAttribute('aria-label'),'Clear search');assert((await clear.boundingBox()).height>=44);
 await page.locator('a[aria-label="Open Moses"]').tap();await page.locator('#character-sheet[open]').waitFor();assert.match(await page.locator('#character-detail-name').textContent(),/Moses/);await page.keyboard.press('Escape');
 await clear.tap();await page.waitForFunction(()=>document.querySelector('#characters-search').value==='');await page.locator('.ux-contact').nth(14).waitFor();
 await m.focus();await page.keyboard.press('Enter');assert.equal(await m.getAttribute('aria-pressed'),'true');
 await go('#places','.place-profile-card');await shot('places');
 const places=await (await page.request.get(base+'/reference/places.json')).json();assert(places.every(p=>Number.isInteger(p.fields.linkedPassageCount)));
 assert.equal(await page.locator('.ux-place-count').count(),15);await page.locator('[data-places-next]').tap();assert.match(await page.locator('.places-directory-pagination').innerText(),/Page 2 of/);
 await go('#discover?section=evidence','.ux-evidence-article');await shot('evidence');
 await go('#read/0/1','#verse-3 .verse-num');await shot('read');await page.locator('#verse-3 .verse-num').tap();await page.locator('[data-context-tab]').first().waitFor();await page.waitForFunction(()=>comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));
 assert.equal(await page.locator('.lens-active-verse').getAttribute('id'),'verse-3');const activeRect=await page.locator('.lens-active-verse').boundingBox(),sheetRect=await page.locator('#lens-inspector-sheet').boundingBox();assert(activeRect.y>=0&&activeRect.y<sheetRect.y,'Selected verse remains visible above the sheet');assert.equal(await page.locator('.sheet-handle').count(),1);assert.equal(await page.locator('.ux-verse-actions button').count(),4);
 for(const button of await page.locator('.ux-verse-actions button').all()){assert(await button.getAttribute('aria-label'));assert(await button.getAttribute('title'));const r=await button.boundingBox();assert(r.width>=44&&r.height>=44);}
 await shot('context');await page.touchscreen.tap(2,2);await page.locator('#lens-inspector-sheet[open]').waitFor({state:'hidden'});assert.equal(await page.locator('.lens-active-verse').count(),0);
 // 2 Samuel 24:13 has a real translation record in the production corpus.
 await go('#read/9/24','#verse-13 .verse-num');await page.locator('#verse-13 .verse-num').tap();await page.locator('[data-context-tab=translations]').waitFor();await page.locator('[data-context-tab=translations]').tap();assert.equal(await page.locator('[data-context-tab=translations]').getAttribute('aria-selected'),'true');assert((await page.locator('#ux-context-panel .lens-evidence').count())>0);await shot('translations');
 await page.touchscreen.tap(2,2);await page.locator('#lens-inspector-sheet[open]').waitFor({state:'hidden'});
 await page.locator('#lens-compare').tap();await page.locator('#lens-compare-right').fill('Genesis 2');await page.getByRole('button',{name:'Compare passages',exact:true}).tap();await page.locator('.lens-comparison-passage').first().waitFor();assert.equal(await page.locator('#lens-inspector-sheet .ux-dialog-path').count(),0);await shot('compare');await page.keyboard.press('Escape');
 await page.locator('.ux-search').tap();await page.locator('#lens-search-input').fill('Moses');await page.locator('#lens-search-form').evaluate(n=>n.requestSubmit());await page.locator('#lens-results-people .lens-result').first().waitFor();await page.locator('#lens-results-people .lens-result').first().tap();await page.locator('#character-sheet[open]').waitFor();
 assert.deepEqual(errors,[]);matrix.push({engine,theme,width:390,dragMSearchMosesTaps:3,railMSearchMosesTaps:3,questionOfDayTaps:1,searchMosesTaps:2,translationOutsideDismiss:'PASS',status:'PASS'});console.log('PASS',matrix.at(-1));await context.close();
 }}finally{await browser.close();}
}
fs.writeFileSync(output+'/child-matrix.json',JSON.stringify(matrix,null,2)+'\n');
