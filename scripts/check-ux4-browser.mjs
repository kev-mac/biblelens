import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const output=process.env.UX4_SHOTS||`${os.homedir()}/git/codex-reports/ux4-shots`;
fs.mkdirSync(output,{recursive:true});
const results=[];
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const [width,height] of [[375,812],[430,932]])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true,colorScheme:theme,reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>window.BibleLensWorkspace&&!document.documentElement.classList.contains('bl-starting'));
  await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);
  const go=async(hash,selector)=>{await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await page.locator(selector).first().waitFor();};
  const shot=async state=>{
   await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${output}/${engine}-${width}-${theme}-${state}.png`});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,state+' page overflow');
  };
  await go('#people','#characters-list .directory-reference');
  assert.deepEqual(await page.locator('.directory-categories button').allTextContents(),['All','Women']);
  assert.equal(await page.locator('.directory-alphabet button').count(),26);
  assert.equal(await page.locator('#characters-list>.character-card').count(),15);
  for(const button of await page.locator('.directory-alphabet button,.directory-save').all()){
   const r=await button.boundingBox();assert(r.width>=44&&r.height>=44,'44px target');
  }
  const columns=()=>page.locator('#characters-list').evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length);
  assert.equal(await columns(),1);
  await page.setViewportSize({width:768,height});assert.equal(await columns(),2);await page.setViewportSize({width,height});
  await shot('people-all');
  await page.getByRole('button',{name:'Next',exact:true}).click();
  await page.getByRole('button',{name:'Women',exact:true}).click();
  assert.match(await page.locator('.characters-pagination').innerText(),/Page 1 of/);
  assert.match(await page.locator('.characters-count').innerText(),/of 201 people/);
  const contrasts=await page.evaluate(()=>{
   const rgb=value=>value.match(/[\d.]+/g).map(Number);
   const blend=(fg,bg)=>fg.slice(0,3).map((c,i)=>c*(fg[3]??1)+bg[i]*(1-(fg[3]??1)));
   const lum=rgb=>rgb.map(c=>c/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((v,c,i)=>v+c*[.2126,.7152,.0722][i],0);
   const probe=document.createElement('span');probe.style.color='var(--lens-paper)';document.body.append(probe);const base=rgb(getComputedStyle(probe).color);probe.remove();
   return ['.directory-reference','.directory-categories [aria-pressed=true]','.directory-save'].map(selector=>{
    const css=getComputedStyle(document.querySelector(selector));
    const bg=blend(rgb(css.backgroundColor),base),ink=rgb(css.color),a=lum(ink),b=lum(bg);
    return {selector,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
   });
  });
  for(const {selector,ratio} of contrasts)assert(ratio>=4.5,selector+' AA '+ratio);
  await shot('people-women');
  // From People: category, result (two activations).
  await page.locator('.ux-person-open').first().click();await page.locator('#character-sheet[open]').waitFor();await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'All',exact:true}).click();
  await page.getByRole('button',{name:'Names starting with M',exact:true}).click();
  assert((await page.locator('#characters-list h2').allTextContents()).every(name=>name.startsWith('M')));
  await shot('people-letter-m');
  await page.evaluate(()=>scrollTo(0,600));
  const sticky=await page.locator('.directory-filters').boundingBox();assert(sticky.y>=0&&sticky.y<150,'Filters stay below the masthead');
  // From People: M, search field, Moses result (three taps; typing is not an activation).
  await page.locator('#characters-search').tap();await page.locator('#characters-search').fill('Moses');
  await page.locator('a[aria-label="Open Moses"]').waitFor();await page.locator('a[aria-label="Open Moses"]').tap();
  await page.locator('#character-sheet[open]').waitFor();assert.match(await page.locator('#character-sheet').innerText(),/Moses/);await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Names starting with M',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'Names starting with M',exact:true}).getAttribute('aria-pressed'),'false');
  await shot('people-search-moses');
  // Search field and result: two taps.
  await page.locator('#characters-search').tap();await page.locator('a[aria-label="Open Moses"]').tap();await page.locator('#character-sheet[open]').waitFor();await page.keyboard.press('Escape');
  const save=page.getByRole('button',{name:'Save Moses',exact:true});await save.click();assert.equal(await save.getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#character-sheet[open]').count(),0,'Saving does not open the profile');
  const ref=page.locator('.directory-reference').first(),href=await ref.getAttribute('href');await ref.click();await page.waitForFunction(hash=>location.hash===hash,href);assert.equal(await page.locator('#character-sheet[open]').count(),0,'References open scripture');
  await go('#people','#characters-search');await page.locator('#characters-search').fill('Abdi');await page.waitForFunction(()=>document.querySelector('#characters-list h2')?.textContent.startsWith('Abdi'));
  const names=await page.locator('#characters-list h2').allTextContents();assert(names.some(n=>n==='Abdi (child of Malluch)'));assert(names.some(n=>n==='Abdi (1 passage)'));await shot('people-same-name');
  await page.getByRole('button',{name:'Women',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.characters-empty'));assert.equal(await page.locator('.directory-alphabet button:not(:disabled)').count(),0);
  await page.getByRole('button',{name:'All',exact:true}).click();await page.locator('#characters-search').fill('King');await page.locator('.character-matched-alias').first().waitFor();assert.match(await page.locator('.character-matched-alias').first().innerText(),/King/);
  await go('#places','.place-profile-card');assert.equal(await page.locator('.place-profile-card').count(),15);await shot('places');
  const placeName=await page.locator('.place-profile-card .character-name').first().innerText();await page.locator('.place-profile-card .directory-save').first().click();
  await page.locator('.ux-place-open').first().click();await page.locator('#atlas-sheet[open]').waitFor();await page.keyboard.press('Escape');
  await go('#notebook?section=saved','[data-directory-remove]');assert.match(await page.locator('#lens-notebook-list').innerText(),/Moses/);assert((await page.locator('#lens-notebook-list').innerText()).includes(placeName));
  await page.getByRole('link',{name:'Moses',exact:true}).click();await page.locator('#character-sheet[open]').waitFor();await page.keyboard.press('Escape');
  await go('#notebook?section=saved','[data-directory-remove]');await page.locator('[data-directory-remove]').first().click();assert.equal(await page.locator('[data-directory-remove]').count(),1);
  // Backup import retains the entity metadata required by Saved.
  await page.evaluate(()=>{const all=BibleLensDebateStore.all();const [id,value]=Object.entries(all).find(([,v])=>v.entity&&v.saved);localStorage.removeItem('biblelens-debate-device-v1:'+id);BibleLensDebateStore.restore({[id]:value});if(!BibleLensDebateStore.read(id).entity)throw Error('Entity backup lost');});
  assert.deepEqual(errors,[]);results.push({engine,width,theme,categoryTaps:2,searchMosesTaps:2,letterSearchMosesTaps:3,status:'PASS'});
  await context.close();console.log(`PASS ${engine} ${width} ${theme}: cards, filters, paging, sticky A–Z, child paths, references, Saved and backup`);
 }}finally{await browser.close();}
}
fs.writeFileSync(`${output}/matrix.json`,JSON.stringify(results,null,2)+'\n');
