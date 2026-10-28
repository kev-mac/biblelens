import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
import {debateVerdict} from '../worker/debates.mjs';
const sourceRecords=JSON.parse(fs.readFileSync('data/evidence.json','utf8'));
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8788';
const output='.review/phone';fs.mkdirSync(output,{recursive:true});
const executablePath=process.env.CHROME_PATH||(fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined);
const browser=await chromium.launch({headless:true,executablePath});
const errors=[],external=[];
try{
 for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  // A static-server preview must supply its own APIs, without any external service.
  await page.route('**/*',route=>{if(new URL(route.request().url()).origin!==new URL(base).origin){external.push(route.request().url());return route.abort();}return route.continue();});
  await page.goto(base);await page.waitForSelector('.phase2-hero');await page.waitForFunction(()=>!document.documentElement.classList.contains('bl-starting'));
  await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);
  async function shot(name){await page.evaluate(()=>document.fonts.ready);
   // A screenshot does not wait for lazy images or async image decoding.
   await page.waitForFunction(()=>[...document.querySelectorAll('.phase2-art img')].filter(img=>{
    const rect=img.getBoundingClientRect();return rect.width&&rect.height&&rect.bottom>0&&rect.top<innerHeight&&rect.right>0&&rect.left<innerWidth;
   }).every(img=>img.complete&&img.naturalWidth>0&&img.parentElement.dataset.artState==='ready'));
   const violations=await page.evaluate(()=>[...document.querySelectorAll('.phase2-page *,#notebook-view *,#search-view *')].filter(node=>node.getBoundingClientRect().width&&!node.closest('[hidden]')&&!node.classList.contains('sr-only')).flatMap(node=>{
    const style=getComputedStyle(node),size=parseFloat(style.fontSize);if(['INPUT','TEXTAREA','SELECT'].includes(node.tagName)&&size<16)return ['Input below 16px: '+node.id];
    if([...node.childNodes].some(child=>child.nodeType===3&&child.textContent.trim())&&size<12)return ['Text below 12px: '+node.className];
    if(node.matches('button,a,summary')){const rect=node.getBoundingClientRect();if(rect.height<43.5)return ['Target below 44px: '+node.textContent.slice(0,30)];}
    if(node.matches('.phase2-chips button')){
     const rect=node.getBoundingClientRect(),group=node.parentElement.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(node);const label=range.getBoundingClientRect();
     if(rect.width<43.5||rect.left<group.left||rect.right>group.right+.5||node.scrollWidth>node.clientWidth||label.left<rect.left+parseFloat(style.paddingLeft)-1||label.right>rect.right-parseFloat(style.paddingRight)+1)return ['Crowded filter: '+node.textContent];
    }return [];
   }));assert.deepEqual(violations,[],name+' type and touch sizes');await page.screenshot({path:`${output}/${theme}-${name}.png`});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390,name+' has no horizontal page overflow');}
  async function go(hash,selector){await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await page.waitForFunction(hash=>location.hash===hash,hash);if(selector)await page.waitForSelector(selector);}
  await shot('explore');
  assert.deepEqual(await page.locator('.lens-primary a').allTextContents(),['Explore','Read','Big Questions','Notebook']);
  assert.equal(await page.locator('.phase2-rail').count(),9);assert.equal(await page.locator('.phase2-rail-card').count(),54);
  for(const rail of ['text','science','history','translation','people','places','stories','commandments','timeline']){
   const collection=page.locator(`[aria-labelledby="rail-${rail}"]`);
   // Always align this rail, even when its heading is already barely visible.
   await collection.locator('.phase2-rail-heading').evaluate(node=>node.scrollIntoView({block:'start',behavior:'instant'}));
   await shot('explore-'+rail);
   const heading=await collection.locator('h2').boundingBox(),card=await collection.locator('.phase2-rail-card').first().boundingBox(),nav=await page.locator('.lens-primary').boundingBox();
   assert(heading.y>=64&&heading.y<130&&card.y>heading.y&&card.y+card.height<=nav.y,rail+' heading and first card are fully framed above phone navigation');
   const artwork=await collection.locator('.phase2-art img').first().evaluate(img=>({opacity:getComputedStyle(img).opacity,width:img.clientWidth,height:img.clientHeight,placeholder:getComputedStyle(img.previousElementSibling).display}));
   assert.equal(artwork.opacity,'1',rail+' artwork is painted');assert.equal(artwork.placeholder,'none');assert(Math.abs(artwork.width/artwork.height-2.1)<.03,rail+' artwork keeps its reserved crop');
  }
  await page.evaluate(()=>scrollTo(0,0));await page.locator('#explore-query').fill('Genesis 1');await page.locator('#explore-search').evaluate(form=>form.requestSubmit());
  await page.waitForSelector('#lens-results-scripture .lens-result');await shot('search');assert(await page.locator('#search-view a[href="#chat"]').isVisible());
  // Seed only this isolated browser profile with supported, pre-existing notebook data.
  await page.evaluate(()=>{state.verseNotes['0:1:1']={book:0,chapter:1,verse:1,name:'Genesis',title:'A question to revisit',text:'Which sources could help explain this passage?'};state.verseBookmarks['0:1:1']={book:0,chapter:1,verse:1,name:'Genesis',color:'yellow'};state.passageBookmarks['0:2']={book:0,chapter:2,name:'Genesis'};state.bookmarks.push(ENTRIES[0].id);state.investigations||={};state.investigations['phase2-review']={id:'phase2-review',title:'Two creation accounts',left:{book:0,chapter:1},right:{book:0,chapter:2},edition:'kjv',note:'Compare the order described in each account.',updatedAt:new Date().toISOString()};persist();});
  await go('#questions','#debate-results .phase2-debate-card');await shot('debates-text');
  await page.locator('[data-debate-status="Textual conflict"]').click();await page.waitForFunction(()=>location.hash.includes('status=Textual'));await page.waitForSelector('#debate-results .phase2-debate-card');for(const card of await page.locator('#debate-results .phase2-debate-card').all()){const id=(await card.getAttribute('href')).split('#debate/')[1];const record=sourceRecords.find(row=>row.id===id);assert.equal(record.status,'Textual conflict');assert.equal(await card.locator('.phase2-verdict').textContent(),debateVerdict(record));}
  const filtered=await page.evaluate(()=>location.hash);const selected=page.locator('#debate-results a[href="#debate/early-ahaziah"]');const href=await selected.getAttribute('href');
  await selected.click();await page.waitForSelector('.phase2-sides:not([aria-busy])');await shot('debate-text');
  assert.equal(await page.locator('.phase2-side').count(),2);assert(await page.locator('.phase2-side blockquote').count()>=2);
  await page.locator('[data-debate-stance="B"]').click();assert.equal(await page.locator('[data-debate-stance="B"]').getAttribute('aria-pressed'),'true');await page.locator('[data-debate-save]').click();assert.equal(await page.locator('[data-debate-save]').getAttribute('aria-pressed'),'true');await shot('debate-choice');
  await page.reload();await page.waitForSelector('.phase2-sides:not([aria-busy])');assert.equal(await page.locator('[data-debate-stance="B"]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('[data-debate-save]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-debate-sources]').click();await page.waitForSelector('#debate-sheet[open]');await shot('sources');await page.keyboard.press('Escape');assert.equal(await page.locator('#debate-sheet').getAttribute('open'),null);
  await page.locator('.phase2-deeper summary').click();await page.locator('.phase2-deeper').scrollIntoViewIfNeeded();await shot('go-deeper');
  await page.goBack();await page.waitForFunction(hash=>location.hash===hash,filtered);await page.waitForSelector('#debate-results .phase2-debate-card');assert.equal(await page.locator('[data-debate-status="Textual conflict"]').getAttribute('aria-pressed'),'true');await page.goForward();await page.waitForSelector('.phase2-sides:not([aria-busy])');
  for(const mode of ['science','history']){await go('#questions?mode='+mode,'#debate-results .phase2-debate-card');await shot('debates-'+mode);const statuses=await page.locator('#debate-status-filters button').allTextContents();assert(statuses.includes('Not settled'));assert(statuses.includes('Evidence matches the text')||statuses.includes('Evidence points elsewhere'));}
  await page.locator('[data-debate-label-info]').click();await page.waitForSelector('#debate-label-info:popover-open');await shot('label-info');await page.locator('#debate-label-info button').click();
  await go('#debate/legacy-science-1','.phase2-sides:not([aria-busy])');assert((await page.locator('.phase2-side').nth(1).innerText()).toLowerCase().includes('source discussion'));await shot('debate-science');
  await go('#notebook?section=saved','#lens-notebook-list .phase2-debate-card');await shot('notebook-saved');assert.equal(await page.locator('#lens-notebook-list a').first().getAttribute('href'),href);
  await go('#notebook?section=notes','[data-lens-note="verse:0:1:1"]');assert.equal(await page.locator('[data-lens-note="verse:0:1:1"] textarea').inputValue(),'Which sources could help explain this passage?');await shot('notebook-notes');
  await page.goto(base+'/#bookmarks');await page.waitForFunction(()=>location.hash==='#notebook?section=bookmarks');await page.waitForSelector('[data-lens-note="verse:0:1:1"]');assert.equal(await page.locator('[data-lens-filter="bookmarks"]').getAttribute('aria-pressed'),'true');assert(await page.locator('[data-lens-note^="study:"]').count());assert(await page.locator('[data-lens-note="passage:0:2"]').count());await shot('notebook-bookmarks');
  await go('#notebook?section=investigations','[data-lens-note="investigation:phase2-review"]');await shot('notebook-comparisons');
  await go('#notebook?note=verse%3A0%3A1%3A1','[data-lens-note="verse:0:1:1"]');await page.waitForFunction(()=>document.activeElement?.tagName==='TEXTAREA');
  const download=page.waitForEvent('download');await page.locator('#lens-backup').click();const backup=await download;await backup.saveAs(`.review/${theme}-backup.json`);const content=JSON.parse(fs.readFileSync(`.review/${theme}-backup.json`));assert(content.verseNotes['0:1:1']);assert(content.deviceDebates[href.slice(8)].saved);assert.equal(content.deviceDebates[href.slice(8)].stance,'B');
  await page.waitForSelector('.lens-action-toast[hidden]',{state:'attached'});await go('#read/0/1','#verse-1');await page.waitForSelector('[data-lens-inspect]');await shot('read');assert.equal(await page.locator('#chapter-text .verse').count(),31,'Full chapter preserved');await page.locator('[data-lens-inspect]').first().click();await page.waitForFunction(()=>view==='debate'||document.querySelector('#debate-sheet')?.open);if(await page.locator('#debate-sheet').isVisible()){await shot('reader-debate-picker');await page.locator('#debate-sheet a').first().click();}await page.waitForSelector('.phase2-sides:not([aria-busy])');
  await page.evaluate(()=>BibleLensDebates.openRecords([{id:'study-animals',title:'Creation accounts'}]));await page.waitForFunction(()=>document.querySelector('#study-dialog').open&&current.id==='animals');
  await go('#debate/missing','text=Big Question not found');await shot('missing-debate');
  await page.goto(base+'/#explore');await page.waitForFunction(()=>view==='read'&&location.hash==='#read');
  await page.goto(base+'/#categories/T?book=all');await page.waitForFunction(()=>view==='evidence'&&location.hash==='#evidence/T?book=all');await page.waitForSelector('.marked-category-content');
  await go('#commandments?code=P1','.commandment-card');assert.equal(await page.locator('.commandment-card').count(),1);
  // Both progressive enhancements can be absent; ordinary navigation/sheets still work.
  await page.evaluate(()=>{document.startViewTransition=undefined;HTMLElement.prototype.showPopover=undefined;});
  await go('#questions','#debate-results .phase2-debate-card');await page.locator('[data-debate-label-info]').click();await page.waitForSelector('#debate-sheet[open]');await page.keyboard.press('Escape');
  await context.close();
  // Slow or failed artwork must keep a deliberate placeholder and stable layout.
  const artContext=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),artPage=await artContext.newPage();
  let releaseArt;const artGate=new Promise(resolve=>{releaseArt=resolve;});
  await artPage.route('**/assets/explore-{timeline,people}.webp',async route=>{await artGate;if(route.request().url().endsWith('people.webp'))await route.fulfill({status:404,body:'Missing test artwork'});else await route.continue();});
  try{
   await artPage.goto(base);await artPage.waitForSelector('.phase2-hero');await artPage.evaluate(theme=>{state.theme=theme;applyTheme();},theme);
   const sizes={};
   for(const key of ['history','people']){
    const art=artPage.locator(`[aria-labelledby="rail-${key}"] .phase2-art`).first();
    await art.evaluate(node=>node.scrollIntoView({block:'center',behavior:'instant'}));
    assert.equal(await art.getAttribute('data-art-state'),'loading');assert(await art.locator('.phase2-art-placeholder').isVisible());assert.equal(await art.locator('span').textContent(),'Imagined art');sizes[key]=await art.boundingBox();
   }
   releaseArt();
   await artPage.waitForSelector('[aria-labelledby="rail-history"] [data-art-state="ready"]');await artPage.waitForSelector('[aria-labelledby="rail-people"] [data-art-state="error"]');
   for(const key of ['history','people']){
    const art=artPage.locator(`[aria-labelledby="rail-${key}"] .phase2-art`).first(),rect=await art.boundingBox();assert.equal(rect.height,sizes[key].height,key+' artwork does not shift after load/error');assert.equal(rect.width,sizes[key].width);
   }
   const missing=artPage.locator('[aria-labelledby="rail-people"] .phase2-art').first();assert.equal(await missing.locator('.phase2-art-placeholder').textContent(),'Artwork unavailable');assert(await missing.locator('.phase2-art-placeholder').isVisible());assert(await missing.locator('img').isHidden());
  }finally{releaseArt();await artContext.close();}
 }
 const enhanced=await browser.newContext({viewport:{width:1200,height:900},reducedMotion:'no-preference'});const page=await enhanced.newPage();page.on('pageerror',error=>errors.push(error.message));await page.goto(base);await page.waitForSelector('.phase2-hero');
 await page.evaluate(()=>{window.transitionCalls=0;const start=document.startViewTransition.bind(document);document.startViewTransition=callback=>{transitionCalls++;return start(callback);};BibleLensWorkspace.navigate('#questions');});await page.waitForSelector('#debate-results a');assert.equal(await page.evaluate(()=>transitionCalls),1);
 await page.evaluate(()=>BibleLensWorkspace.navigate('#debate/early-ahaziah'));await page.waitForSelector('.phase2-sides:not([aria-busy])');assert.equal(await page.locator('.phase2-sides').evaluate(node=>getComputedStyle(node).gridTemplateColumns.split(' ').length),2,'Container query opens two columns on wide screens');await enhanced.close();
 const fallback=await browser.newContext({viewport:{width:390,height:844}});await fallback.addInitScript(()=>{HTMLElement.prototype.showPopover=undefined;document.startViewTransition=undefined;});const fallbackPage=await fallback.newPage();await fallbackPage.goto(base+'/#questions');await fallbackPage.waitForSelector('#debate-results a');assert.equal(await fallbackPage.locator('#debate-label-info').isVisible(),false,'Unsupported popovers stay hidden until a dialog is requested');await fallbackPage.locator('[data-debate-label-info]').click();await fallbackPage.waitForSelector('#debate-sheet[open]');await fallback.close();
 assert.deepEqual(errors,[],'No browser errors');assert.deepEqual(external,[],'No external network dependency in the tested screens');
 console.log('PASS: 390×844 light/dark screens, all nine framed Explore rails with decoded artwork, slow/failed image placeholders, unclipped 44px filters, grouped search, all tabs, A/B and source discussion, private persistence/backups, legacy bookmarks, note focus, reader badges, history/refresh, deep links, missing IDs, motion/popover fallbacks and no external requests.');
 console.log('Screenshots: '+output);
}finally{await browser.close();}
