import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
import {parsePlaces} from '../src/places-core.js';
import {regionCoverage,inWindow,usableRegionPoint} from '../src/place-regions.js';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const output=process.env.HOME+'/git/codex-reports/ux7-shots';fs.mkdirSync(output,{recursive:true});
const results=[];
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();try{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const places=[...parsePlaces(await (await page.request.get(base+'/reference/places.json')).json()).values()],regions=regionCoverage(places).filter(r=>r.shown);
 await page.goto(base+'/#discover');await page.locator('.ux-topic-row').waitFor();await page.evaluate(()=>{state.theme='dark';applyTheme();});
 await page.locator('a[href="#places"]').first().tap();await page.locator('.place-profile-card').first().waitFor();
 assert.equal(await page.locator('#places-view .directory-categories button').count(),regions.length+1);
 for(const region of regions){
 const button=page.getByRole('button',{name:region.name,exact:true});await button.tap();assert.equal(await button.textContent(),`${region.name} (${region.usable})`);
 assert.match(await page.locator('#places-count').textContent(),new RegExp(`of ${region.usable} places`));
 await page.locator('[data-places-next]').tap();assert.match(await page.locator('.places-directory-pagination').innerText(),/Page 2 of/);
 await page.locator('#places-search').fill('a');assert.match(await page.locator('.places-directory-pagination').innerText(),/Page 1 of/);
 await page.locator('#places-search').fill('');await button.tap();assert.match(await page.locator('.places-directory-pagination').innerText(),/Page 1 of/);
 const eligible=places.filter(p=>usableRegionPoint(p)&&inWindow(p,region));assert(eligible.length===region.usable);
 }
 await page.getByRole('button',{name:regions[0].name,exact:true}).tap();await page.evaluate(()=>scrollTo(0,0));
 const shot=async name=>{await page.evaluate(()=>document.fonts.ready);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:`${output}/${engine}-390-dark-${name}.png`});};
 await shot('places-region');await page.locator('.ux-place-open').first().tap();await page.locator('#atlas-sheet[open]').waitFor();await page.keyboard.press('Escape');
 await page.evaluate(()=>BibleLensWorkspace.navigate('#people'));await page.locator('#characters-search').waitFor();await page.locator('#characters-search').fill('Moses');await page.locator('a[aria-label="Open Moses"]').waitFor();assert.match(await page.locator('.ux-contact-subtitle').first().textContent(),/774 linked verses/);await shot('people-moses');
 await page.locator('a[aria-label="Open Moses"]').tap();await page.locator('#character-sheet[open]').waitFor();assert.match(await page.locator('#character-detail-name').textContent(),/Moses/);await shot('moses-detail');
 assert.deepEqual(errors,[]);results.push({engine,width:390,theme:'dark',placesRegionPlaceTaps:3,regionsChecked:regions.length,status:'PASS'});await context.close();
 }finally{await browser.close();}
}
fs.writeFileSync(output+'/child-matrix.json',JSON.stringify(results,null,2)+'\n');console.log(results);
