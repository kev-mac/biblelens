// Reproducible cosmetic inventory. Fixtures affect isolated browser contexts only.
import fs from 'node:fs';
import os from 'node:os';
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const output=process.env.UX3_SHOTS||`${os.homedir()}/git/codex-reports/ux3-shots`;
fs.mkdirSync(output,{recursive:true});
const enabled=process.env.UX3_STEPS?.split(',');
const matrixFile=`${output}/audit-matrix.json`;
const results=fs.existsSync(matrixFile)?JSON.parse(fs.readFileSync(matrixFile,'utf8')):[];
// Resume interrupted steps and preserve every existing screenshot.
const complete={
 'legacy-categories':['academic-list','academic-detail','academic-sources','V-empty','Q-list','Q-detail','Q-sources','contradictions-list','contradictions-detail','contradictions-sources','marked-empty','marked-detail'],
 'commandment-panels':['commandment-context','commandment-lens'],
 'saved-empty':['saved-empty-notes','saved-empty-saved','saved-empty-bookmarks','saved-empty-investigations'],
 carousels:[...Array.from({length:5},(_,i)=>`explore-tile-${i+1}`),...Array.from({length:6},(_,i)=>`evidence-tile-${i+1}`)],
 read:['read','verse-tap','verse-note','passage-picker','read-evidence','read-evidence-detail','read-evidence-note','compare-empty','compare-results','compare-second-passage','compare-note','compare-invalid','studies','study-detail','study-perspectives','study-sources','study-notes'],
 stories:['stories-list','story-detail','stories-page-2','stories-empty','story-missing'],
 people:['people-list','people-page-2','person-detail','person-section-1','person-section-2','person-section-3','people-empty'],
 places:['places-list','places-page-2','place-detail','place-sources','place-map','places-empty'],
 commandments:['commandments-list','commandments-filters','commandment-detail','commandment-card','commandments-empty'],
 timeline:['timeline-list','timeline-detail','timeline-empty'],
 questions:['questions-list','question-detail','question-passages','question-sources','history-list','history-detail','science-list','science-detail','text-list','text-detail','translation-list','translation-detail','question-missing'],
 'legacy-and-method':['evidence-directory','evidence-filters','evidence-text-list','prophecies-list','prophecies-filters','prophecy-detail','prophecies-empty','method','method-sources-privacy'],
 search:['search-empty','search-results','search-result-groups','search-no-results'],
 'saved-settings-chat':['saved-notes','saved-saved','saved-bookmarks','saved-investigations','saved-note','saved-comparison','saved-delete','chat-empty','chat-loading','chat-answer','chat-error','settings','settings-system','menu','sync']
};
// A suspended feature download can keep WebKit's font-ready promise pending.
// Other steps explicitly wait for loaded text before capturing.
process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY='1';
for(const [engine,type] of Object.entries({chromium,webkit})) {
 const browser=await type.launch();
 try { for(const [width,height] of [[375,812],[430,932]]) for(const theme of ['light','dark']) {
  if(process.env.UX3_CASE&&process.env.UX3_CASE!==`${engine}-${width}-${theme}`)continue;
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true,colorScheme:theme,reducedMotion:'reduce',serviceWorkers:'block'});
  const page=await context.newPage();page.setDefaultTimeout(15000);
  let record=results.find(r=>r.engine===engine&&r.width===width&&r.theme===theme);if(!record){record={engine,width,height,theme,shots:[],failures:[],geometry:[],errors:[]};results.push(record);}
  const path=name=>`${output}/${engine}-${width}-${theme}-${name}.png`;
  const capture=async(p,name,options={})=>{if(!fs.existsSync(path(name)))await p.screenshot({path:path(name),...options});if(!record.shots.includes(name))record.shots.push(name);};
  page.on('pageerror',e=>record.errors.push(e.message));
  const go=async(hash,selector)=>{await page.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.querySelectorAll(':popover-open').forEach(p=>p.hidePopover());});await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);if(selector)await page.locator(selector).first().waitFor();await page.waitForTimeout(120);await page.evaluate(()=>scrollTo(0,0));};
  const shot=async(name,{full=false}={})=>{
   await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(80);
   const geometry=await page.evaluate(()=>({pageWidth:document.documentElement.scrollWidth,issues:[...document.querySelectorAll('#main *,dialog[open] *, :popover-open *')].filter(n=>{const r=n.getBoundingClientRect();return r.width&&r.height&&!n.closest('[hidden]')&&!n.matches('.sr-only,.ux-carousel-status')&&!n.closest('.ux-topic-row');}).flatMap(n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);return r.right>innerWidth+1||r.left< -1?[{selector:n.id?'#'+n.id:n.tagName+'.'+String(n.className).replaceAll(' ','.'),left:Math.round(r.left),right:Math.round(r.right)}]:[];})}));
   record.geometry=record.geometry.filter(g=>g.name!==name);record.geometry.push({name,...geometry});
   await capture(page,name,{fullPage:full});
  };
  const step=async(name,fn)=>{if(enabled&&!enabled.includes(name))return;const expected=complete[name]||[name.replace('-network-states','-loading'),name.replace('-network-states','-error')];if(expected.every(n=>fs.existsSync(path(n)))){record.failures=record.failures.filter(f=>f.name!==name);return;}try{await fn();record.failures=record.failures.filter(f=>f.name!==name);console.log(`${engine}-${width}-${theme} ${name} PASS`);}catch(e){record.failures.push({name,error:e.message});console.log(`${engine}-${width}-${theme} ${name} FAIL ${e.message.slice(0,150)}`);}fs.writeFileSync(matrixFile,JSON.stringify(results,null,2)+'\n');};
  await page.goto(base);await page.waitForFunction(()=>window.BibleLensWorkspace&&!document.documentElement.classList.contains('bl-starting'));
  await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);
  await step('saved-empty',async()=>{for(const section of ['notes','saved','bookmarks','investigations']){await go('#notebook?section='+section,'#lens-notebook-list');await shot('saved-empty-'+section);}});
  await step('carousels',async()=>{
   for(const [hash,name] of [['#discover','explore'],['#discover?section=evidence','evidence']]){
    await go(hash,'.ux-topic');const count=await page.locator('.ux-topic').count();
    for(let i=0;i<count;i++){if(i)await page.locator('[data-slide="1"]').click();await page.waitForFunction(i=>document.querySelector('.ux-carousel-controls [role=status]').textContent.startsWith((i+1)+' of'),i);await shot(`${name}-tile-${i+1}`);}
   }
  });
  await step('read',async()=>{
   await go('#read/0/1','#verse-1');await shot('read');
   await page.locator('#verse-1 .verse-body').click();await shot('verse-tap');await page.locator('[data-verse-action=note]').click();await page.waitForSelector('#verse-note-dialog[open]');await shot('verse-note');await page.keyboard.press('Escape');
   await page.locator('.passage-heading-picker').click();await shot('passage-picker');await page.keyboard.press('Escape');
   await page.locator('#lens-focus').click();await page.waitForSelector('#lens-inspector-sheet[open]');await page.waitForFunction(()=>!document.querySelector('.lens-coverage')?.classList.contains('loading-state'));await shot('read-evidence');const reasoning=page.locator('#lens-inspector-sheet details>summary').first();if(await reasoning.count()){await reasoning.click();await shot('read-evidence-detail');}await page.locator('#lens-margin-note').scrollIntoViewIfNeeded();await shot('read-evidence-note');await page.keyboard.press('Escape');
   await page.locator('#lens-compare').click();await page.waitForSelector('#lensComparison[open]');await shot('compare-empty');
   await page.locator('#lens-compare-right').fill('Genesis 2');await page.locator('#lens-comparison-form').evaluate(f=>f.requestSubmit());await page.waitForSelector('.lens-comparison-passage');await shot('compare-results');await page.locator('.lens-comparison-passage').last().scrollIntoViewIfNeeded();await shot('compare-second-passage');await page.locator('#lens-investigation-note').scrollIntoViewIfNeeded();await shot('compare-note');
   await page.locator('#lens-compare-right').fill('zzzzz');await page.locator('#lens-comparison-form').evaluate(f=>f.requestSubmit());await shot('compare-invalid');await page.keyboard.press('Escape');
   await page.locator('.study-library>summary').click();await page.locator('#collection').scrollIntoViewIfNeeded();await shot('studies');
   const id=await page.evaluate(()=>ENTRIES[0].id);await go('#study/'+id,'#study-dialog[open]');await shot('study-detail');for(const tab of ['perspectives','sources','notes']){await page.locator('[data-tab='+tab+']').click();await shot('study-'+tab);}await page.keyboard.press('Escape');
  });
  await step('stories',async()=>{
   await go('#stories','.story-card');await shot('stories-list');
   await page.locator('[data-story-section]').first().click();await page.locator('.story-card').first().scrollIntoViewIfNeeded();await shot('story-detail');
   await page.locator('#stories-next').click();await page.locator('#stories-pagination').scrollIntoViewIfNeeded();await shot('stories-page-2');
   await page.locator('#stories-search').fill('zzzzzzzz');await shot('stories-empty');await page.locator('#stories-search').fill('');
   await go('#stories/genesis/missing','#stories-list .empty');await shot('story-missing');
  });
  await step('people',async()=>{
   await go('#people','.ux-person-open');await shot('people-list');
   await page.locator('.characters-pagination button').last().click();await page.locator('.characters-pagination').scrollIntoViewIfNeeded();await shot('people-page-2');
   await page.locator('#characters-search').fill('Moses');await page.locator('a[aria-label="Open Moses"]').click();await page.waitForSelector('#character-sheet[open]');await shot('person-detail');
   const controls=page.locator('#character-sheet .person-section-toggle:not(:disabled)');for(let i=0;i<await controls.count();i++){await controls.nth(i).click();await controls.nth(i).scrollIntoViewIfNeeded();await shot('person-section-'+(i+1));}
   await page.keyboard.press('Escape');await page.locator('#characters-search').fill('zzzzzzzz');await page.waitForFunction(()=>document.querySelector('.characters-count').textContent.startsWith('0–0'));await shot('people-empty');
  });
  await step('places',async()=>{
   await go('#places','.place-profile-card');await shot('places-list');
   await page.locator('[data-places-next]').click();await page.locator('.places-directory-pagination').scrollIntoViewIfNeeded();await shot('places-page-2');
   await page.locator('#places-search').fill('Jerusalem');await page.locator('.place-profile-card').first().waitFor();await shot('place-detail');
   await page.locator('.place-map-source').first().click();await shot('place-sources');await page.keyboard.press('Escape');
   await page.locator('.place-map-preview:not([disabled])').first().click();await page.waitForSelector('#atlas-sheet[open]');await shot('place-map');await page.keyboard.press('Escape');
   await page.locator('#places-search').fill('zzzzzzzz');await shot('places-empty');
  });
  await step('commandments',async()=>{
   await go('#commandments','.commandment-card');await shot('commandments-list');
   await page.locator('#commandments-more').click();await shot('commandments-filters');await page.keyboard.press('Escape');
   await go('#commandments?code=P1','.commandment-card');await shot('commandment-detail');await page.locator('.commandment-card').first().scrollIntoViewIfNeeded();await shot('commandment-card');
   const details=page.locator('.commandment-card details').first();if(await details.count()){await details.locator('summary').click();await details.scrollIntoViewIfNeeded();await shot('commandment-expanded');}
   await page.locator('#commandments-search').fill('zzzzzzzz');await shot('commandments-empty');
  });
  await step('timeline',async()=>{
   await go('#timeline','.timeline-event-card');await shot('timeline-list');
   await page.locator('.timeline-history:visible').first().click();await page.locator('.timeline-event-card').first().scrollIntoViewIfNeeded();await shot('timeline-detail');
   await page.locator('#timeline-view input[type=search]').fill('zzzzzzzz');await shot('timeline-empty');
  });
  await step('questions',async()=>{
   await go('#questions','.accepted-questions a');await shot('questions-list');await page.locator('.accepted-questions a').first().click();await page.waitForSelector('[data-accepted-save]');await shot('question-detail');
   await page.locator('#debate-view details').first().locator('summary').click();await page.locator('#debate-view details').first().scrollIntoViewIfNeeded();await shot('question-passages');
   await page.locator('#debate-view details').last().locator('summary').click();await page.locator('#debate-view details').last().scrollIntoViewIfNeeded();await shot('question-sources');
   await page.locator('[data-accepted-save]').click();
   for(const [mode,filter] of [['history',''],['science',''],['text',''],['translation','?filter=T']]){
    await go('#questions'+(filter||'?mode='+mode),'#debate-results .phase2-debate-card');await shot(mode+'-list');await page.locator('#debate-results .phase2-debate-card').first().click();await page.waitForSelector('.phase2-sides:not([aria-busy])');await shot(mode+'-detail');
   }
   await go('#debate/missing','text=Study record not found');await shot('question-missing');
  });
  await step('legacy-and-method',async()=>{
   await go('#evidence','.category-page-link');await shot('evidence-directory');await page.locator('#marked-filter-top').click();await shot('evidence-filters');await page.keyboard.press('Escape');
   await go('#evidence/T','.marked-category-content');await shot('evidence-text-list');
   await go('#prophecies','.prophecy-card');await shot('prophecies-list');await page.locator('#prophecy-filter-button').click();await shot('prophecies-filters');await page.keyboard.press('Escape');
   const toggle=page.locator('.prophecy-card summary').first();if(await toggle.count()){await toggle.click();await shot('prophecy-detail');}await page.locator('.prophecy-toggle[data-value=Unfulfilled]').click();await page.locator('.prophecy-toggle[data-value=Messianic]').click();await page.locator('#prophecies-list').scrollIntoViewIfNeeded();await shot('prophecies-empty');
   await go('#method','#method-view');await shot('method');await page.locator('#method-view article').last().scrollIntoViewIfNeeded();await shot('method-sources-privacy');
  });
  await step('search',async()=>{
   await go('#search','#lens-search-input');await shot('search-empty');
   await go('#search?q=mercy','#lens-results-scripture .lens-result');await shot('search-results');await page.locator('#lens-search-results').scrollIntoViewIfNeeded();await shot('search-result-groups');
   await go('#search?q=zzzzzzzzzz','#lens-search-status');await page.waitForFunction(()=>!document.querySelector('#lens-search-status').classList.contains('loading-state'));await shot('search-no-results');
  });
  await step('saved-settings-chat',async()=>{
   for(const section of ['notes','saved','bookmarks','investigations']){await go('#notebook?section='+section,'#lens-notebook-list');await shot('saved-'+section);}
   await page.evaluate(()=>{state.verseNotes['0:1:1']={book:0,chapter:1,verse:1,name:'Genesis',title:'A question',text:'Which sources explain this passage?'};state.verseBookmarks['0:1:1']={book:0,chapter:1,verse:1,name:'Genesis',color:'yellow'};persist();});
   await go('#notebook?section=notes','[data-lens-note]');await shot('saved-note');await page.evaluate(()=>{state.investigations||={};state.investigations['ux3']={id:'ux3',title:'Two passages',left:{book:0,chapter:1},right:{book:0,chapter:2},edition:'kjv',note:'A private comparison.',updatedAt:new Date().toISOString()};persist();});await go('#notebook?section=investigations','[data-lens-note]');await shot('saved-comparison');await go('#notebook?section=notes','[data-lens-note]');await page.locator('[data-lens-delete-note]').first().click();await shot('saved-delete');await page.keyboard.press('Escape');
   await go('#chat','#chat-input');await shot('chat-empty');const {default:worker}=await import('./built-worker.mjs');let finish;const gate=new Promise(r=>finish=r);let fail=false;
   await page.route('**/api/chat',async route=>{await gate;if(fail)return route.fulfill({status:503,contentType:'application/json',body:'{"error":"Chat is unavailable. Try again."}'});const response=await worker.fetch(new Request(base+'/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:route.request().postData()}),{},{});await route.fulfill({status:response.status,contentType:'application/json',body:await response.text()});});
   await page.locator('#chat-input').fill('Who was Moses?');await page.locator('#chat-form').evaluate(f=>f.requestSubmit());await shot('chat-loading');finish();await page.waitForFunction(()=>!chatBusy&&document.querySelector('#chat-messages').textContent.length>20);await shot('chat-answer');fail=true;await page.locator('#chat-input').fill('Who was Aaron?');await page.locator('#chat-form').evaluate(f=>f.requestSubmit());await page.waitForFunction(()=>!chatBusy);await shot('chat-error');
   await page.locator('#lens-settings').click();await page.waitForSelector('#reader-settings[open]');await shot('settings');await page.locator('#settings-system').scrollIntoViewIfNeeded();await shot('settings-system');
   await page.locator('#settings-navigation').click();await page.waitForSelector('#navigation-sheet:visible');await shot('menu');await page.keyboard.press('Escape');
   await page.locator('#lens-settings').click();await page.waitForSelector('#reader-settings[open]');await page.locator('.cloud-sync-settings').scrollIntoViewIfNeeded();await shot('sync');await page.keyboard.press('Escape');
  });
  await step('legacy-categories',async()=>{
   for(const key of ['academic','V','Q','contradictions']){
    await go('#evidence/'+key+'?book=all',key==='V'?'.marked-empty':'.marked-comparison-card');if(key==='V'){await shot('V-empty');continue;}await shot(key+'-list');
    const card=page.locator('.marked-comparison-card').first();
    const toggle=card.locator('[data-category-section]:not(:disabled),[data-summary-expand]').first();
    await toggle.click();await card.scrollIntoViewIfNeeded();await shot(key+'-detail');
    await card.locator('[data-comparison-inspect]').click();await page.locator('dialog[open]').waitFor();await shot(key+'-sources');await page.keyboard.press('Escape');
   }
   await page.evaluate(()=>{state.verseNotes={};state.verseBookmarks={};state.passageNotes={};state.passageBookmarks={};state.notes={};state.bookmarks=[];persist();});
   await go('#evidence/bookmark?book=all','.marked-empty');await shot('marked-empty');
   await page.evaluate(()=>{state.verseBookmarks['0:1:1']={book:0,chapter:1,verse:1,name:'Genesis',color:'yellow'};persist();});
   await go('#evidence','#saved-passages');await go('#evidence/bookmark?book=all','.category-personal-profile');await shot('marked-detail');
  });
  await step('commandment-panels',async()=>{
   await go('#commandments?code=P1','.commandment-card');await page.locator('#commandments-search').fill('P1');
   await page.locator('[data-commandment-section][aria-controls$="-context"]').first().click();await page.waitForSelector('.commandment-context[data-loaded=true]');await page.locator('.commandment-context').first().scrollIntoViewIfNeeded();await shot('commandment-context');
   await page.locator('#commandments-search').fill('');
   const lens=page.locator('[data-commandment-section][aria-controls$="-lens"]').first();await lens.click();await page.locator('.commandment-lens:visible').first().scrollIntoViewIfNeeded();await shot('commandment-lens');
  });
  // Cold contexts force real loading/error branches without changing app code.
  for(const [name,hash,pattern,ready] of [
   ['feature','#people','**/assets/characters.*.js','#route-loading'],
   ['compare','#compare?left=Genesis%201&right=Genesis%202','**/api/chapter?*','#lensComparison[open]'],
   ['reader','#read/0/1','**/api/chapter?*','#chapter-text'],
   ['stories','#stories','**/stories.json','#stories-list'],
   ['people','#people','**/reference/people.json','#characters-view'],
   ['places','#places','**/reference/places.json','.places-directory-list'],
   ['questions','#questions','**/accepted-questions.json','.accepted-questions'],
   ['search','#search?q=mercy','**/api/search?*','#lens-search-status'],
   ['question-detail','#debate/early-ahaziah','**/api/debate?*','#debate-view']
  ])await step(name+'-network-states',async()=>{
   const c=await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true,colorScheme:theme,reducedMotion:'reduce',serviceWorkers:'block'}),p=await c.newPage();
   try {
    await c.addInitScript(theme=>{localStorage.setItem('biblelens-theme',theme);},theme);
    let release,requested;const gate=new Promise(r=>release=r),requestGate=new Promise(r=>requested=r);let intercepted=false;
    await p.route(pattern,async route=>{intercepted=true;requested();await gate;await route.fulfill({status:503,contentType:'application/json',body:'{"error":"Local audit failure fixture"}'});});
    await p.goto(base+'/'+hash,{waitUntil:'domcontentloaded'});await p.locator(ready).waitFor({state:'attached',timeout:20000});
    await p.waitForFunction(()=>window.BibleLensWorkspace);await Promise.race([requestGate,new Promise((_,reject)=>setTimeout(()=>reject(Error(pattern+' request not seen')),20000))]);await p.evaluate(theme=>{state.theme=theme;applyTheme();},theme);await p.waitForTimeout(200);
    assert(intercepted,pattern+' did not intercept a request');
    await capture(p,name+'-loading');release();
    await p.waitForFunction(root=>/could not|unavailable|failed/i.test(document.querySelector(root)?.textContent||''),name==='compare'?'#lensComparison':name==='questions'?'#debates-view':name==='places'?'#places-view':ready,{timeout:25000});
    await capture(p,name+'-error');
   }finally{await c.close();}
  });
  await context.close();console.log(JSON.stringify({engine,width,theme,shots:record.shots.length,failures:record.failures}));
  fs.writeFileSync(matrixFile,JSON.stringify(results,null,2)+'\n');
 }} finally {await browser.close();}
}
process.exitCode=results.some(r=>r.failures.length||r.errors.length)?1:0;
