import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
import {debateVerdict} from '../worker/debates.mjs';
const sourceRecords=JSON.parse(fs.readFileSync('data/evidence.json','utf8'));
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const output=process.env.BIBLELENS_UI_SHOTS||'.review/phone';fs.mkdirSync(output,{recursive:true});
const executablePath=process.env.CHROME_PATH||(fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined);
const browser=await chromium.launch({headless:true,executablePath});
const errors=[],external=[];
try{
 for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  // A static-server preview must supply its own APIs, without any external service.
  await page.route('**/*',route=>{if(new URL(route.request().url()).origin!==new URL(base).origin){external.push(route.request().url());return route.abort();}return route.continue();});
  await page.goto(base);await page.waitForSelector('.ux-topic-row');await page.waitForFunction(()=>!document.documentElement.classList.contains('bl-starting'));
  await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);
  async function shot(name){await page.evaluate(()=>document.fonts.ready);
   // A screenshot does not wait for lazy images or async image decoding.
   await page.waitForFunction(()=>[...document.querySelectorAll('.phase2-art img')].filter(img=>{
    const rect=img.getBoundingClientRect();return rect.width&&rect.height&&rect.bottom>0&&rect.top<innerHeight&&rect.right>0&&rect.left<innerWidth;
   }).every(img=>img.complete&&img.naturalWidth>0&&img.parentElement.dataset.artState==='ready'));
   const violations=await page.evaluate(()=>[...document.querySelectorAll('.phase2-page *,#notebook-view *,#search-view *')].filter(node=>node.getBoundingClientRect().width&&!node.closest('[hidden]')&&!node.classList.contains('sr-only')).flatMap(node=>{
    const style=getComputedStyle(node),size=parseFloat(style.fontSize);if(['INPUT','TEXTAREA','SELECT'].includes(node.tagName)&&size<16)return ['Input below 16px: '+node.id];
    if([...node.childNodes].some(child=>child.nodeType===3&&child.textContent.trim())&&size<12&&!node.closest('.ux-verse-actions'))return ['Text below 12px: '+node.className];
    if(node.matches('button,a,summary')){const rect=node.getBoundingClientRect();if(rect.height<43.5)return ['Target below 44px: '+node.textContent.slice(0,30)];}
    if(node.matches('.phase2-chips button')&&!node.closest('.ux-interior-chips')){
     const rect=node.getBoundingClientRect(),group=node.parentElement.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(node);const label=range.getBoundingClientRect();
     if(rect.width<43.5||rect.left<group.left||rect.right>group.right+.5||node.scrollWidth>node.clientWidth||label.left<rect.left+parseFloat(style.paddingLeft)-1||label.right>rect.right-parseFloat(style.paddingRight)+1)return ['Crowded filter: '+node.textContent];
    }return [];
   }));assert.deepEqual(violations,[],name+' type and touch sizes');const path=`${output}/${theme}-${name}.png`;if(process.env.BIBLELENS_REUSE_SHOTS!=='1'||!fs.existsSync(path))if(process.env.UX_NO_SHOTS!=='1')await page.screenshot({path});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390,name+' has no horizontal page overflow');}
  async function go(hash,selector){await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await page.waitForFunction(hash=>location.hash===hash,hash);if(selector)await page.waitForSelector(selector);}
  await shot('explore');
  assert.deepEqual(await page.locator('.lens-primary a').allTextContents(),['Read','Explore','Saved']);
  await page.locator('.ux-search').click();await page.waitForSelector('#lens-search-input');await page.locator('#lens-search-input').fill('Genesis 1');await page.locator('#lens-search-form').evaluate(form=>form.requestSubmit());
  await page.waitForSelector('#lens-results-scripture .lens-result');await shot('search');assert(await page.locator('#search-view a[href="#chat"]').isVisible());
  // Seed only this isolated browser profile with supported, pre-existing notebook data.
  await page.evaluate(()=>{state.verseNotes['0:1:1']={book:0,chapter:1,verse:1,name:'Genesis',title:'A question to revisit',text:'Which sources could help explain this passage?'};state.verseBookmarks['0:1:1']={book:0,chapter:1,verse:1,name:'Genesis',color:'yellow'};state.passageBookmarks['0:2']={book:0,chapter:2,name:'Genesis'};state.bookmarks.push(ENTRIES[0].id);state.investigations||={};state.investigations['phase2-review']={id:'phase2-review',title:'Two creation accounts',left:{book:0,chapter:1},right:{book:0,chapter:2},edition:'kjv',note:'Compare the order described in each account.',updatedAt:new Date().toISOString()};persist();});
  await go('#questions?mode=text','#debate-results .phase2-debate-card');await shot('debates-text');
  await page.locator('[data-debate-filters]').click();await page.locator('[data-debate-status="Textual conflict"]').click();await page.waitForFunction(()=>location.hash.includes('status=Textual'));await page.waitForSelector('#debate-results .phase2-debate-card');for(const card of await page.locator('#debate-results .phase2-debate-card').all()){const id=(await card.getAttribute('href')).split('#debate/')[1];const record=sourceRecords.find(row=>row.id===id);assert.equal(record.status,'Textual conflict');assert.equal(await card.locator('.phase2-verdict').textContent(),await page.evaluate(value=>uiTitleCase(value),debateVerdict(record)));}
  const filtered=await page.evaluate(()=>location.hash);const selected=page.locator('#debate-results a[href="#debate/early-ahaziah"]');const href=await selected.getAttribute('href');
  await selected.click();await page.waitForSelector('.phase2-sides:not([aria-busy])');await shot('debate-text');
  assert.equal(await page.locator('.phase2-side').count(),2);assert(await page.locator('.phase2-side blockquote').count()>=2);
  assert.equal(await page.locator('[data-debate-stance]').count(),0);await page.evaluate(()=>BibleLensDebateStore.write('early-ahaziah',{stance:'B'}));await page.locator('[data-debate-save]').click();assert.equal(await page.locator('[data-debate-save]').getAttribute('aria-pressed'),'true');await shot('debate-choice');
  await page.reload();await page.waitForSelector('.phase2-sides:not([aria-busy])');assert.equal(await page.locator('[data-debate-stance]').count(),0);assert.equal(await page.locator('[data-debate-save]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-debate-sources]').click();await page.waitForSelector('#debate-sheet[open]');await shot('sources');await page.keyboard.press('Escape');assert.equal(await page.locator('#debate-sheet').getAttribute('open'),null);
  await page.locator('.phase2-deeper summary').click();await page.locator('.phase2-deeper').scrollIntoViewIfNeeded();await shot('go-deeper');
  await page.goBack();await page.waitForFunction(hash=>location.hash===hash,filtered);await page.waitForSelector('#debate-results .phase2-debate-card');await page.locator('[data-debate-filters]').click();assert.equal(await page.locator('[data-debate-status="Textual conflict"]').getAttribute('aria-pressed'),'true');await page.keyboard.press('Escape');await page.goForward();await page.waitForSelector('.phase2-sides:not([aria-busy])');
  for(const mode of ['science','history']){await go('#questions?mode='+mode,'#debate-results .phase2-debate-card');await shot('debates-'+mode);await page.locator('[data-debate-filters]').click();const statuses=await page.locator('#debate-status-filters button').allTextContents();assert(statuses.includes('Not Settled'));assert(statuses.includes('Evidence Matches the Text')||statuses.includes('Evidence Points Elsewhere'));await page.keyboard.press('Escape');}
  await page.locator('[data-debate-filters]').click();await page.locator('#debate-sheet summary').filter({hasText:'About These Labels'}).click();await shot('label-info');await page.keyboard.press('Escape');
  await go('#debate/legacy-science-1','.phase2-sides:not([aria-busy])');assert((await page.locator('.phase2-side').nth(1).innerText()).toLowerCase().includes('source discussion'));await shot('debate-science');
  await go('#notebook?section=saved','#lens-notebook-list .phase2-debate-card');await shot('notebook-saved');assert.equal(await page.locator('#lens-notebook-list a').first().getAttribute('href'),href);
  await go('#notebook?section=notes','[data-lens-note="verse:0:1:1"]');assert.equal(await page.locator('[data-lens-note="verse:0:1:1"] textarea').inputValue(),'Which sources could help explain this passage?');await shot('notebook-notes');
  await page.goto(base+'/#bookmarks');await page.waitForFunction(()=>location.hash==='#notebook?section=bookmarks');await page.waitForSelector('[data-lens-note="verse:0:1:1"]');assert.equal(await page.locator('[data-lens-filter="bookmarks"]').getAttribute('aria-pressed'),'true');assert(await page.locator('[data-lens-note^="study:"]').count());assert(await page.locator('[data-lens-note="passage:0:2"]').count());await shot('notebook-bookmarks');
  await go('#notebook?section=investigations','[data-lens-note="investigation:phase2-review"]');await shot('notebook-comparisons');
  await go('#notebook?note=verse%3A0%3A1%3A1','[data-lens-note="verse:0:1:1"]');await page.waitForFunction(()=>document.activeElement?.tagName==='TEXTAREA');
  const download=page.waitForEvent('download');await page.locator('#lens-backup').click();const backup=await download;await backup.saveAs(`.review/${theme}-backup.json`);const content=JSON.parse(fs.readFileSync(`.review/${theme}-backup.json`));assert(content.verseNotes['0:1:1']);assert(content.deviceDebates[href.slice(8)].saved);assert.equal(content.deviceDebates[href.slice(8)].stance,'B');
  await page.waitForSelector('.lens-action-toast[hidden]',{state:'attached'});await go('#read/0/1','#verse-1');await page.waitForFunction(()=>comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready')); await shot('read');assert.equal(await page.locator('#chapter-text .verse').count(),31,'Full chapter preserved');assert.equal(await page.locator('[data-lens-inspect]:visible').count(),0,'Verse markers stay out of reading text');await page.locator('#verse-3 .verse-num').click();await page.waitForSelector('#lens-inspector-sheet[open]');await shot('reader-context-drawer');const evidenceLink=page.locator('#lensInspector .lens-evidence h3 a').first();await evidenceLink.waitFor();const evidenceHref=await evidenceLink.getAttribute('href');await evidenceLink.click();await page.waitForSelector(evidenceHref.startsWith('#study/')?'#study-dialog[open]':'.phase2-sides:not([aria-busy])');
  await page.evaluate(()=>BibleLensDebates.openRecords([{id:'study-animals',title:'Creation accounts'}]));await page.waitForFunction(()=>document.querySelector('#study-dialog').open&&current.id==='animals');
  await go('#debate/missing','text=We Couldn’t Find That');await shot('missing-debate');
  await page.goto(base+'/#explore');await page.waitForFunction(()=>view==='read'&&location.hash==='#read');
  await page.goto(base+'/#categories/T?book=all');await page.waitForFunction(()=>view==='evidence'&&location.hash==='#evidence/T?book=all');await page.waitForSelector('.marked-category-content');
  await go('#commandments?code=P1','.commandment-card');assert.equal(await page.locator('.commandment-card').count(),1);
  // Both progressive enhancements can be absent; ordinary navigation/sheets still work.
  await page.evaluate(()=>{document.startViewTransition=undefined;HTMLElement.prototype.showPopover=undefined;});
  await go('#questions?mode=text','#debate-results .phase2-debate-card');await page.locator('[data-debate-filters]').click();await page.waitForSelector('#debate-sheet[open]');await page.keyboard.press('Escape');
  await context.close();

 }
 const enhanced=await browser.newContext({viewport:{width:1200,height:900},reducedMotion:'no-preference'});const page=await enhanced.newPage();page.on('pageerror',error=>errors.push(error.message));await page.goto(base);await page.waitForSelector('.ux-topic-row');
 await page.evaluate(()=>{window.transitionCalls=0;const start=document.startViewTransition.bind(document);document.startViewTransition=callback=>{transitionCalls++;return start(callback);};BibleLensWorkspace.navigate('#questions?mode=text');});await page.waitForSelector('#debate-results a');assert.equal(await page.evaluate(()=>transitionCalls),1);
 await page.evaluate(()=>BibleLensWorkspace.navigate('#debate/early-ahaziah'));await page.waitForSelector('.phase2-sides:not([aria-busy])');assert.equal(await page.locator('.phase2-sides').evaluate(node=>getComputedStyle(node).gridTemplateColumns.split(' ').length),2,'The desktop workspace shows the two readings side by side');await enhanced.close();
 const fallback=await browser.newContext({viewport:{width:390,height:844}});await fallback.addInitScript(()=>{HTMLElement.prototype.showPopover=undefined;document.startViewTransition=undefined;});const fallbackPage=await fallback.newPage();await fallbackPage.goto(base+'/#questions?mode=text');await fallbackPage.waitForSelector('#debate-results a');assert.equal(await fallbackPage.locator('#debate-label-info').count(),0,'Labels live in the Filters sheet');await fallbackPage.locator('[data-debate-filters]').click();await fallbackPage.waitForSelector('#debate-sheet[open]');await fallback.close();
 assert.deepEqual(errors,[],'No browser errors');assert.deepEqual(external,[],'No external network dependency in the tested screens');
 console.log('PASS: 390×844 light/dark screens, unclipped 44px filters, grouped search, all tabs, A/B and source discussion, private persistence/backups, legacy bookmarks, note focus, shared reader drawer, history/refresh, deep links, missing IDs, motion/popover fallbacks and no external requests.');
 console.log('Screenshots: '+output);
}finally{await browser.close();}
