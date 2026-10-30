import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8787';
const shots=process.env.UX_SHOT_DIR||process.env.HOME+'/git/codex-reports/ux14-shots';fs.mkdirSync(shots,{recursive:true});
const catalog=JSON.parse(fs.readFileSync('data/lost-books/books.json','utf8'));
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();try{
 for(const width of [320,390,1280])for(const theme of ['dark','light']){
  const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  async function go(hash,selector){await page.goto(base+'/'+hash);await page.locator(selector).first().waitFor();await page.evaluate(t=>{state.theme=t;applyTheme();},theme);await page.evaluate(()=>document.fonts.ready);}
  await go('#discover','.ux-topic');await page.waitForFunction(()=>document.querySelector('#ux-topic-lost .ux-count')?.textContent==='20');
  const tiles=await page.locator('.ux-topic').evaluateAll(ns=>ns.map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height})));assert.equal(tiles.length,6);assert(tiles.every(t=>Math.abs(t.w-tiles[0].w)<1&&Math.abs(t.h-tiles[0].h)<1),'equal tile sizes');
  if(engine==='chromium'&&theme==='dark'&&width!==320)await page.screenshot({path:`${shots}/explore-after-${width}.png`,fullPage:true});
  await page.locator('#ux-topic-lost').click();await page.locator('.lost-card').first().waitFor();assert.equal(await page.locator('.lost-card').count(),catalog.length);assert.equal(await page.locator('#lost-query').getAttribute('placeholder'),`Search ${catalog.length} books…`);
  assert.equal(await page.locator('[data-lost-collection="Pseudepigrapha"]').count(),0);
  await page.locator('[data-lost-collection="Gnostic"]').click();assert.equal(await page.locator('.lost-card').count(),6);await page.locator('[data-lost-collection="All"]').click();
  await page.locator('#lost-query').fill('Tobit');assert.equal(await page.locator('.lost-card').count(),1);await page.locator('#lost-query').fill('');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,'no directory overflow');
  const targets=await page.locator('#lost-filter,#lost-chips button,.lost-card .lens-button,.lost-card summary').evaluateAll(ns=>ns.map(n=>({label:n.textContent,h:n.getBoundingClientRect().height})));assert(targets.every(n=>n.h>=44),JSON.stringify(targets.filter(n=>n.h<44)));
  if(engine==='chromium'&&width===390)await page.screenshot({path:`${shots}/lost-books-390-${theme}.png`});
  await page.locator('.lost-card').first().getByRole('link',{name:'Read Tobit',exact:true}).click();await page.locator('#verse-1').waitFor();await page.locator('#lost-reader-edition').waitFor();assert.match(await page.locator('#lost-reader-edition').innerText(),/Apocrypha · KJV/);assert(await page.locator('#lens-focus').isDisabled());assert.equal(await page.locator('#chapter-text .person-chip,#chapter-text .location-chip').count(),0);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,'no reader overflow');
  if(engine==='chromium'&&width===390)await page.screenshot({path:`${shots}/tobit-1-390-${theme}.png`});
  await page.locator('#ux-chapter-picker').click();await page.locator('#passage-picker[open]').waitFor();await page.locator('[data-passage-step="book"]').click();await page.locator('[data-book-testament="lost"]').click();assert.equal(await page.locator('.lost-picker-heading').count(),2);assert.equal(await page.locator('#passage-book-grid input').count(),catalog.length);
  await page.locator('[data-book-testament="new"]').click();assert.equal(await page.locator('#passage-book-grid input').count(),27);assert.match(await page.locator('#passage-book-grid').innerText(),/Revelation/);await page.locator('[data-picker-close]').click();
  await go('#read/80/1','#verse-1');assert.match(await page.locator('#lost-reader-edition').innerText(),/Gnostic · Mattison/);assert.match(await page.locator('#verse-1').innerText(),/hidden sayings/);
  // Search scope follows the entry point and remains user-selectable while typing.
  await go('#lost','.lost-card');await page.locator('#lost-search-text').click();await page.locator('#lost-search-toggle').waitFor();assert.equal(await page.locator('#lost-search-toggle').getAttribute('aria-pressed'),'true');
  await page.locator('#lens-search-input').fill('hidden sayings');await page.waitForFunction(()=>document.querySelector('#lens-search-results')?.textContent.includes('Gospel of Thomas'));assert.match(await page.locator('#lens-search-results').innerText(),/Gnostic · Mattison/);
  await page.locator('#lost-search-toggle').click();await page.waitForFunction(()=>!document.querySelector('#lens-search-results')?.textContent.includes('Gospel of Thomas'));assert.equal(await page.locator('#lost-search-toggle').getAttribute('aria-pressed'),'false');
  await page.locator('#lens-search-input').fill('Tobit');await page.waitForFunction(()=>!document.querySelector('#lens-search-results')?.hasAttribute('aria-busy'));assert.equal(await page.locator('#lost-search-toggle').getAttribute('aria-pressed'),'false');
  assert.deepEqual(errors,[]);await context.close();console.log('PASS UX14',engine,width,theme);
 }
 // Exercise the actual API on every book, plus included/excluded search.
 const request=await browser.newContext();
 for(const book of catalog){const r=await request.request.get(base+`/api/chapter?book=${book.id}&chapter=1`);assert(r.ok());const ch=await r.json();assert.equal(ch.verses.length,book.verseCounts[0]);assert.equal(ch.editionLabel,book.collection+' · '+book.edition);}
 for(const q of ['Tobit','Enoch','book of the words of Tobit','hidden sayings']){const r=await request.request.get(base+'/api/search?lost=1&q='+encodeURIComponent(q));const data=await r.json();assert(data.passages.length,q+' finds text');}
 for(const lost of [0,1]){const r=await request.request.get(base+'/api/search?lost='+lost+'&q=Tobit');const data=await r.json();assert(lost?data.passages.some(p=>p.collection==='Apocrypha'):data.passages.every(p=>!p.collection));}
 await request.close();
 }finally{await browser.close();}
}
