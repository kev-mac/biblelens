import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
function luminance(hex){const c=hex.match(/\w\w/g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
for(const [accent,surface] of [['9a4629','fbf9f3'],['9a4629','fffdf8'],['edb28d','14232b'],['edb28d','1a2d36']]){const [high,low]=[luminance(accent),luminance(surface)].sort((a,b)=>b-a);assert((high+.05)/(low+.05)>=3,'Keyboard focus contrast');}
const output='.review/ux1';fs.mkdirSync(output,{recursive:true});
for(const [engine,type] of Object.entries(process.env.UX1_ENGINE==='webkit'?{webkit}:process.env.UX1_ENGINE==='chromium'?{chromium}:{chromium,webkit})){
 const browser=await type.launch({headless:true,...(engine==='chromium'&&fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')?{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}:{})});
 try{for(const [width,height] of [[390,844],[430,932]])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/#discover');await page.waitForSelector('.ux-topic-row');await page.waitForFunction(()=>!document.documentElement.classList.contains('bl-starting'));
  await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);
  const go=async(hash,selector)=>{await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await page.waitForSelector(selector);};
  const shot=async name=>{await page.evaluate(async()=>{await document.fonts.ready;scrollTo({top:0,behavior:'instant'});});await page.screenshot({path:`${output}/${engine}-${width}-${theme}-${name}.png`});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,name+' page overflow');};
  assert.deepEqual(await page.locator('.lens-primary a').allTextContents(),['Read','Explore','Questions','Saved']);
  assert.equal(await page.locator('.ux-topic-row').count(),2);assert.equal(await page.locator('.ux-topic').count(),7);
  assert.deepEqual(await page.locator('.ux-topic-section h2').allTextContents(),['The Bible','Study']);
  await page.waitForFunction(()=>!document.querySelector('[data-count]').textContent.includes('Loading'));
  await page.waitForFunction(()=>[...document.querySelectorAll('.ux-topic img')].filter(img=>img.getBoundingClientRect().left<innerWidth).every(img=>img.complete&&img.naturalWidth));
  await shot('explore');
  for(const [topic,selector] of [['places','.place-profile-card'],['stories','.story-card'],['commandments','.commandment-card'],['science','#debate-results a'],['history','#debate-results a'],['translation','#debate-results a']]){
   await page.locator('[data-topic="'+topic+'"]').scrollIntoViewIfNeeded();if(['stories','commandments','translation'].includes(topic))await shot('explore-'+topic);await page.locator('[data-topic="'+topic+'"]').tap();await page.waitForSelector(selector);
   assert.equal(await page.locator('.lens-primary [aria-current]').innerText(),'Explore');assert(await page.locator('.lens-context').isVisible());assert(await page.locator('#main>section:not([hidden]) h1').count());assert(await page.locator('#main>section:not([hidden]) h1').first().evaluate(n=>parseFloat(getComputedStyle(n).fontSize)>=32),'Large topic title');
   await page.locator('.lens-context [data-ux-back]').click();await page.waitForSelector('.ux-topic-row');
  }
  await page.evaluate(()=>{for(const row of document.querySelectorAll('.ux-topic-row'))row.scrollLeft=0;});

  await page.locator('[data-topic="people"]').tap();await page.waitForSelector('#characters-view .character-card');assert.equal(await page.locator('.lens-primary [aria-current]').innerText(),'Explore');assert.match(await page.locator('.lens-context').innerText(),/Explore.*People/s);await shot('people');
  await page.locator('.ux-person-open').first().tap();await page.waitForSelector('#character-sheet[open]');await page.waitForSelector('#character-sheet .ux-dialog-path');await shot('person-detail');assert.match(await page.locator('#character-sheet .ux-dialog-path').innerText(),/Explore.*People/s);await page.locator('#character-sheet .ux-dialog-path button').tap();
  await go('#discover','.ux-topic-row');
  // Read: large title and chapter picker, then verse text and number equivalence.
  await page.locator('.lens-primary a[data-lens-view="read"]').tap();await page.waitForSelector('#verse-1');await shot('read');
  assert(await page.locator('#read-view h1').first().isVisible());
  const picker=page.locator('.passage-heading-picker');await picker.click();await page.waitForSelector('#passage-picker[open]');await shot('chapter-picker');await page.locator('[data-passage-step="book"]').tap();await page.locator('#passage-book-grid label:has(input[value="0"])').tap();await page.locator('#passage-chapter-grid label:has(input[value="2"])').tap();await page.locator('#passage-verse-grid label:has(input[value="1"])').tap();await page.waitForFunction(()=>readingChapter===2);await page.waitForSelector('#verse-1');
  await go('#read/0/1','#verse-1');
  const text=page.locator('#verse-1 [data-scripture]');
  await text.tap({position:{x:Math.min(40,(await text.boundingBox()).width-1),y:8}});await page.waitForSelector('.verse-preview:not([hidden])');
  const actions=await page.locator('.verse-preview:not([hidden]) button').allTextContents();assert(actions.length>1);
  await page.keyboard.press('Escape');await page.locator('#verse-1 .verse-num').tap();await page.waitForSelector('.verse-preview:not([hidden])');assert.deepEqual(await page.locator('.verse-preview:not([hidden]) button').allTextContents(),actions);await shot('verse-actions');await page.keyboard.press('Escape');
  await go('#questions','.accepted-questions a');await shot('questions');assert.equal(await page.locator('.accepted-questions a').count(),30);assert.deepEqual((await page.locator('.accepted-questions a').evaluateAll(nodes=>nodes.slice(0,4).map(n=>n.hash))),['#debate/headline-25','#debate/headline-17','#debate/headline-16','#debate/headline-01']);assert(!/\bB\d{2}\b/.test(await page.locator('.accepted-questions').innerText()));
  const href=await page.locator('.accepted-questions a').first().getAttribute('href');await page.locator('.accepted-questions a').first().tap();await page.waitForSelector('[data-accepted-save]');assert.equal(await page.locator('.lens-primary [aria-current]').innerText(),'Questions');assert(!await page.getByText('Where do you land?',{exact:true}).count());await shot('question-detail');
  await page.locator('[data-accepted-save]').tap();assert.equal(await page.locator('[data-accepted-save]').getAttribute('aria-pressed'),'true');
  await page.locator('.lens-context [data-ux-back]').click();await page.waitForSelector('.accepted-questions a');
  await go('#notebook?section=saved','#lens-notebook-list .phase2-debate-card');await shot('saved');assert(!/\bB\d{2}\b/.test(await page.locator('#lens-notebook-list').innerText()),'Saved question cards use passage references');assert(await page.locator(`#lens-notebook-list a[href="${href}"]`).count());
  await page.locator(`#lens-notebook-list a[href="${href}"]`).tap();await page.waitForSelector('[data-accepted-save]');await page.locator('.lens-context [data-ux-back]').tap();await page.waitForSelector('#lens-notebook-list .phase2-debate-card');

  // Keyboard focus remains visible after quiet pointer focus.
  const search=page.locator('.ux-search');await search.tap();await page.waitForSelector('#lens-search-input');await shot('search');assert.equal(await page.locator('.lens-primary [aria-current]').innerText(),'Saved');
  const pointerOutline=await page.locator('#lens-search-input').evaluate(n=>{n.focus();return getComputedStyle(n).outlineStyle;});assert.equal(pointerOutline,'none');
  // WebKit on macOS uses Option+Tab to include buttons and links.
  await page.keyboard.press(engine==='webkit'?'Alt+Tab':'Tab');const ring=await page.evaluate(()=>({width:getComputedStyle(document.activeElement).outlineWidth,style:getComputedStyle(document.activeElement).outlineStyle,element:document.activeElement.outerHTML.slice(0,300)}));assert.equal(ring.width,'2px',JSON.stringify(ring));assert.equal(ring.style,'solid');
  assert.deepEqual(errors,[]);await context.close();console.log(`PASS UX1 ${engine} ${width}x${height} ${theme}`);
 }}finally{await browser.close();}
}
