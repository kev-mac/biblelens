import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const root=process.env.HOME+'/git/codex-reports',out=root+'/ux10-shots',logs=root+'/UX10-logs';
fs.mkdirSync(out,{recursive:true});fs.mkdirSync(logs,{recursive:true});
const matrix=[],books=JSON.parse(fs.readFileSync('data/books.json')),titles=JSON.parse(fs.readFileSync('data/chapter-names.json'));
for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{
 for(const [width,theme]of [[390,'dark'],[320,'dark'],[390,'light'],[1440,'dark']]){
  const context=await browser.newContext({viewport:{width,height:width===1440?900:844},hasTouch:width<768,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const go=async(hash,selector)=>{await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await page.locator(selector).first().waitFor();};
  const ready=()=>page.waitForFunction(()=>reading&&comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));
  const shot=async name=>{
   await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,name+' document overflow');
   const small=await page.locator('button:visible,a:visible,select:visible,summary:visible').evaluateAll(nodes=>nodes.filter(n=>!n.disabled&&!n.matches('.skip,.sr-only')).filter(n=>{const r=n.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;}).map(n=>{const r=n.getBoundingClientRect();return {label:n.getAttribute('aria-label')||n.textContent.trim().slice(0,50),w:r.width,h:r.height};}).filter(r=>r.w<43.9||r.h<43.9));
   matrix.push({engine,width,theme,screen:name,smallTargets:small});
   if(name.startsWith('read-'))assert(await page.locator('#lens-focus').evaluate(n=>{const range=document.createRange();range.selectNodeContents(n);return range.getBoundingClientRect().height<25;}),'Evidence label stays on one line');
   if(process.env.UX_NO_SHOTS!=='1')await page.screenshot({path:`${out}/${engine}-${width}-${theme}-${name}.png`});
  };
  await page.goto(base+'/#read/0/1');await page.locator('#verse-1').waitFor();await ready();
  await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);
  assert.equal(await page.locator('[data-lens-inspect]').count(),0);
  assert.equal(await page.locator('#lens-focus').getAttribute('aria-pressed'),'false');
  assert.equal(await page.locator('#verse-1 .verse-body').evaluate(n=>getComputedStyle(n).paddingLeft),'0px');
  assert.equal(await page.locator('.chapter-subtitle').innerText(),titles.Genesis['1']);
  await shot('read-off');
  await page.locator('#lens-focus').click();await page.locator('#verse-3 [data-lens-inspect]').waitFor();
  const pip=page.locator('#verse-3 [data-lens-inspect]');assert.match(await pip.innerText(),/^✦ \d+$/);
  assert(await pip.evaluate(n=>n===n.parentElement.lastElementChild&&n.parentElement.classList.contains('verse-body')));
  await shot('read-on');
  const count=Number((await pip.innerText()).split(' ')[1]);await pip.click();await page.locator('#lens-inspector-sheet[open]').waitFor();assert.equal(await page.locator('[data-context-tab=all]').innerText(),`All (${count})`);await page.keyboard.press('Escape');
  await page.reload();await page.locator('#verse-3 [data-lens-inspect]').waitFor();await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);
  if(width===390&&theme==='dark'){
   await go('#read/0/22','#verse-1');await page.locator('.chapter-subtitle').filter({hasText:titles.Genesis['22']}).waitFor();await ready();await shot('genesis-22');
   await go('#read/0/1','#verse-1');await ready();await page.locator('#verse-1 .verse-num').click();await page.locator('#ux-empty-verse-toast').waitFor();
   assert.equal(await page.locator('#ux-empty-verse-toast').innerText(),'Nothing linked to Genesis 1:1 yet.');assert.equal(await page.locator('#lens-inspector-sheet[open]').count(),0);
   assert.deepEqual(await page.locator('#ux-empty-verse-actions button span').allTextContents(),['Save','Copy','Compare','Note']);await shot('empty-verse-toast');
   await page.waitForTimeout(2300);assert(await page.locator('#ux-empty-verse-toast').isHidden());assert(await page.locator('#ux-empty-verse-actions').isVisible());
   await page.locator('#ux-empty-verse-actions [data-context-bookmark]').click();assert.match(await page.locator('#lens-action-toast').innerText(),/^Saved/);
   await page.evaluate(()=>scrollBy(0,100));await page.waitForTimeout(50);assert(await page.locator('#ux-empty-verse-actions').isHidden());await page.evaluate(()=>scrollTo(0,0));
   await go('#people','.ux-contact');assert.equal(await page.locator('.directory-alphabet').count(),0);await page.locator('#ux-alphabet-open').click();await page.locator('#ux-alphabet-sheet[open]').waitFor();await shot('people-az-grid');
   assert.equal(await page.locator('.ux-alphabet-grid').evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length),4);
   const m=page.locator('.ux-alphabet-grid button[aria-label="Jump to M"]');await m.focus();await page.keyboard.press('Enter');assert(await page.locator('#ux-alphabet-sheet').isHidden());
   await page.locator('[data-letter=M]').waitFor();assert.equal(await page.locator('[data-letter=M]').evaluate(n=>getComputedStyle(n).position),'sticky');assert((await page.locator('#characters-list h2').allTextContents()).some(name=>name.startsWith('M')));
   await go('#stories','.story-card');await shot('stories');assert.equal(await page.locator('.story-summary br').count(),0);assert.equal(await page.locator('.story-summary button').count(),0);
   await go('#places','.place-profile-card');await shot('places');assert(!/\d{1,2}\.\d{5},/.test(await page.locator('.ux-place-meta').first().innerText()));assert.equal(await page.locator('#places-view').evaluate(n=>getComputedStyle(n).scrollbarWidth),'none');
   assert(await page.locator('.place-map-action').filter({hasText:'View on Map'}).first().isVisible());
   await go('#questions?mode=history','.phase2-debate-card');await shot('history');assert.equal(await page.locator('#debates-view #debate-status-filters').count(),0);
   const ys=await page.locator('#debates-view .ux-interior-chips button').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().top));assert(Math.max(...ys)-Math.min(...ys)<1);
   await page.locator('[data-debate-filters]').scrollIntoViewIfNeeded();await page.locator('[data-debate-filters]').click();await page.locator('#debate-sheet[open] #debate-status-filters').waitFor();assert(await page.locator('#debate-sheet summary').filter({hasText:'About These Labels'}).isVisible());await page.keyboard.press('Escape');
   await go('#commandments','.commandment-card');await page.locator('#commandments-search').fill('P1');await page.locator('.commandment-card').waitFor();await shot('commandments-search');
   assert.equal(await page.locator('.commandment-card').count(),1);assert.equal(await page.locator('.commandment-summary').evaluate(n=>getComputedStyle(n).overflow),'visible');
   const boxes=await page.locator('#commandments-search,#ux-commandment-controls>button').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().top));assert(Math.max(...boxes)-Math.min(...boxes)<2);
   await go('#search?q=P1','#lens-results-commandments .lens-result');assert(!/…$/.test(await page.locator('#lens-results-commandments .lens-result span').first().innerText()));await page.locator('[data-search-cancel]').click();
   await go('#people','.ux-contact');await page.locator('#characters-search').fill('Elisha');await page.locator('a[aria-label="Open Elisha"]').click();await page.locator('#character-sheet [data-person-section=stories]').waitFor();await page.locator('#character-sheet [data-person-section=stories]').click();await page.locator('#character-sheet .character-story-chip').first().waitFor();assert.match(await page.locator('#character-sheet').innerText(),/Elijah Taken Up/);await page.locator('#character-sheet .character-stories').scrollIntoViewIfNeeded();await shot('elisha-profile');await page.keyboard.press('Escape');
  }
  await go('#discover','.ux-topic');await shot('explore');
  await page.mouse.move(0,0);const colors={stories:'rgba(168, 85, 247, 0.35)',people:'rgba(59, 130, 246, 0.35)',places:'rgba(20, 184, 166, 0.35)',commandments:'rgba(245, 158, 11, 0.35)',evidence:'rgba(99, 102, 241, 0.38)'};
  for(const [key,color]of Object.entries(colors)){assert.equal(await page.locator('#ux-topic-'+key).evaluate(n=>getComputedStyle(n).borderTopColor),color);assert.equal(await page.locator('#ux-topic-'+key+'>svg').evaluate(n=>getComputedStyle(n).backgroundColor),'rgba(0, 0, 0, 0)');}
  await go('#discover?section=evidence','.ux-evidence-preview');assert.equal(await page.locator('.ux-evidence-article').count(),3);assert.match(await page.locator('.ux-evidence-preview>h2').innerText(),/First Records/);const gap=await page.locator('.ux-evidence-preview').evaluate(n=>n.nextElementSibling.getBoundingClientRect().top-n.getBoundingClientRect().bottom);assert(gap>=30,'Evidence previews have a clear break before collections');await go('#discover','.ux-topic');
  const nav=page.locator('#lensMasthead nav.lens-primary');if(width>=768){assert.equal(await nav.evaluate(n=>getComputedStyle(n).position),'static');assert((await nav.boundingBox()).y<100);}else{assert.equal(await nav.evaluate(n=>getComputedStyle(n).position),'fixed');assert.equal(await nav.locator('[aria-current=page]').evaluate(n=>getComputedStyle(n,'::after').width),'4px');}
  if(engine==='chromium'&&width===390&&theme==='dark'){
   // Two chapters per book sample the entire 66-book title path.
   for(const book of books)for(const ch of new Set([1,book.chapters])){await go(`#read/${book.id}/${ch}`,'#verse-1');await page.waitForFunction(([name,ch])=>reading?.name===name&&reading?.chapter===ch,[book.name,ch]);assert.equal(await page.locator('.chapter-subtitle').innerText(),titles[book.name][ch]);assert(await page.locator('.chapter-subtitle').isVisible());}
   await go('#read/18/119/100','#verse-100');await page.waitForFunction(()=>reading?.book===18&&reading?.chapter===119);assert(await page.locator('#verse-100').evaluate(n=>{const number=n.querySelector('.verse-label'),text=n.querySelector('[data-scripture]'),range=document.createRange();range.setStart(text.firstChild,0);range.setEnd(text.firstChild,1);return number.getBoundingClientRect().right<=range.getBoundingClientRect().left;}),'Three-digit inline verse numbers do not overlap Scripture');
   for(const width of [320,375,390]){await page.setViewportSize({width,height:844});for(const hash of ['#read/0/1','#read/21/8','#read/52/3']){await go(hash,'#verse-1');await page.waitForFunction(hash=>reading?.book===Number(hash.split('/')[1])&&reading?.chapter===Number(hash.split('/')[2]),hash);await page.evaluate(()=>document.fonts.ready);const controls=await page.locator('#lensReadingBar button:visible,#lensReadingBar select:visible').evaluateAll(ns=>ns.map(n=>({text:n.textContent,client:n.clientWidth,scroll:n.scrollWidth,...n.getBoundingClientRect().toJSON()})));for(const r of controls){assert(r.left>=0&&r.right<=width,JSON.stringify(r));assert(r.width>=44&&r.height>=44);assert(r.scroll<=r.client+1,'Picker truncates');}for(let i=0;i<controls.length;i++)for(let j=i+1;j<controls.length;j++){const a=controls[i],b=controls[j];assert(!(a.left<b.right-.5&&b.left<a.right-.5&&a.top<b.bottom-.5&&b.top<a.bottom-.5),'Reading controls overlap');}}}
  }
  assert.deepEqual(errors,[]);await context.close();console.log('PASS',engine,width,theme);
 }
 }finally{await browser.close();fs.writeFileSync(logs+'/ux10-browser-matrix.json',JSON.stringify(matrix,null,2)+'\n');}
}
assert.deepEqual(matrix.filter(row=>row.smallTargets.length),[],'Visible controls meet 44 px targets');
console.log('PASS UX10 browser requirements and screenshot matrix.');
