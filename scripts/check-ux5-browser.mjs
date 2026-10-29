import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const output=process.env.UX5_SHOTS||`${os.homedir()}/git/codex-reports/ux5-shots`;
fs.mkdirSync(output,{recursive:true});
const matrix=[];
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{
  // Exercise delayed production counts on both sides of the editorial threshold.
  for(const total of [19,20]){
   const context=await browser.newContext(),page=await context.newPage();
   let resolveCounts;const ready=new Promise(resolve=>{resolveCounts=resolve;});
   await page.route('**/collection-counts.json',async route=>{await ready;const response=await route.fetch();await route.fulfill({json:{...await response.json(),prophecies:total}});});
   await page.goto(base+'/#discover?section=evidence');await page.locator('.ux-topic').first().waitFor();
   assert.equal(await page.locator('[data-topic=prophecies]').count(),0,'Hide until counts are known');resolveCounts();
   await page.waitForFunction(()=>document.querySelector('.ux-count')?.textContent!=='…');
   assert.equal(await page.locator('[data-topic=prophecies]').count(),total>=20?1:0,'Production threshold '+total);
   await page.evaluate(()=>BibleLensWorkspace.navigate('#prophecies'));await page.locator('.prophecy-card').first().waitFor();
   await context.close();
  }
  for(const [width,height] of [[375,812],[430,932]])for(const theme of ['dark','light']){
  const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>!document.documentElement.classList.contains('bl-starting'));
  assert.equal(await page.evaluate(()=>state.theme),'dark','Fresh device defaults dark');
  await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);
  const contrast=await page.evaluate(()=>{
   const css=getComputedStyle(document.body),luminance=hex=>{const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
   const rows=[];for(const ink of ['--lens-ink','--lens-muted','--lens-link'])for(const bg of ['--lens-paper','--lens-surface','--lens-copper-soft']){const a=luminance(css.getPropertyValue(ink).trim()),b=luminance(css.getPropertyValue(bg).trim());rows.push({ink,bg,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)});}return rows;
  });for(const row of contrast)assert(row.ratio>=4.5,theme+' AA '+JSON.stringify(row));
  const go=async(hash,selector)=>{await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await page.locator(selector).first().waitFor();};
  const shot=async name=>{console.log(engine,width,theme,name);await page.evaluate(()=>document.fonts.ready);if(process.env.UX_NO_SHOTS!=='1')await page.screenshot({path:`${output}/${engine}-${width}-${theme}-${name}.png`});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,name+' overflow');};
  await page.waitForFunction(()=>document.querySelector('.ux-count')?.textContent!=='…');
  assert.equal(await page.locator('.ux-topic-row').evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length),2);
  const counts=await (await page.request.get(base+'/collection-counts.json')).json();
  for(const tile of await page.locator('.ux-topic').all()){const key=await tile.getAttribute('data-topic');assert.equal(await tile.locator('.ux-count').textContent(),counts[key].toLocaleString());}
  for(const small of await page.locator('.ux-tile-copy small').all())assert(await small.evaluate(n=>n.scrollWidth<=n.clientWidth),'Subtitle fits within tile');
  await shot('explore');await shot('tab-bar');await page.locator('.ux-quick-links').scrollIntoViewIfNeeded();await shot('quick-links');
  await page.locator('.ux-topic[data-topic=people]').tap();await page.locator('#characters-list .ux-person-open').first().waitFor();await shot('people');
  await page.locator('.ux-person-open').first().tap();await page.locator('#character-sheet[open]').waitFor();await page.keyboard.press('Escape');const peopleTaps=2;
  await go('#discover','.ux-topic');await page.locator('.ux-topic[data-topic=evidence]').tap();await page.locator('.ux-topic[data-topic=questions]').waitFor();assert.equal(await page.locator('.ux-topic[data-topic=prophecies]').count(),counts.prophecies>=20?1:0);await shot('evidence');await page.locator('.ux-topic').last().scrollIntoViewIfNeeded();await shot('evidence-bottom');
  await page.locator('.ux-topic[data-topic=questions]').tap();await page.locator('.accepted-questions a').first().waitFor();await page.locator('.accepted-questions a').first().tap();await page.locator('[data-accepted-save]').waitFor();const questionTaps=3;
  await go('#read/0/1','#ux-next');await page.locator('#verse-1 .verse-num').waitFor();await shot('reader-bar');
  await page.getByRole('button',{name:'Text size',exact:true}).tap();const size=await page.evaluate(()=>state.textScale);await page.locator('#ux-font-more').tap();assert.equal(await page.evaluate(()=>state.textScale),size+.05);await page.locator('#ux-font-less').tap();
  await page.locator('#ux-font-style').tap();assert.equal(await page.evaluate(()=>readerPreferences.appFont),'lora');await page.locator('#ux-font-style').tap();assert.equal(await page.evaluate(()=>readerPreferences.appFont),'inter');
  await page.locator('#verse-11 .verse-num').tap();await page.locator('#lens-inspector-sheet[open]').waitFor();assert.equal(await page.locator('dialog[open]').count(),1);await shot('drawer');assert(await page.locator('#lens-inspector-sheet').evaluate(n=>n.scrollWidth<=n.clientWidth),'Drawer has no horizontal overflow');
  const rect=await page.locator('#lens-inspector-sheet').boundingBox();assert(Math.abs(rect.y+rect.height-height)<2,'Phone drawer is a bottom sheet');
  await page.touchscreen.tap(2,2);await page.locator('#lens-inspector-sheet[open]').waitFor({state:'hidden'});assert.equal(await page.evaluate(()=>document.activeElement.className),'verse-num');
  await page.locator('#verse-1 .verse-body').focus();await page.keyboard.press('Enter');await page.locator('#lens-inspector-sheet[open]').waitFor();assert.equal(await page.locator('.verse-preview:not([hidden])').count(),0);await page.keyboard.press('Escape');
  await page.locator('#ux-next').tap();await page.waitForFunction(()=>readingChapter===2&&reading?.chapter===2);const nextTaps=1;
  await page.locator('#lens-compare').tap();await page.locator('#lens-compare-right').fill('Genesis 1');await page.getByRole('button',{name:'Compare passages',exact:true}).tap();await page.locator('.lens-comparison-passage').first().waitFor();assert.equal(await page.locator('dialog[open]').getAttribute('id'),'lens-inspector-sheet');await page.keyboard.press('Escape');
  await page.locator('.ux-search').tap();await page.locator('#lens-search-input').fill('Moses');await page.locator('#lens-search-form').evaluate(n=>n.requestSubmit());await page.locator('#lens-results-people .lens-result').first().waitFor();await shot('search');await page.locator('#lens-results-people').scrollIntoViewIfNeeded();await shot('search-results');
  assert.match(await page.locator('.lens-result-group').first().innerText(),/Moses/);await page.locator('#lens-results-people .lens-result').first().tap();await page.locator('#character-sheet[open]').waitFor();const searchTaps=2;await page.keyboard.press('Escape');
  await go('#search?q=Who%20was%20Moses%3F','#lens-search-input');await page.locator('#lens-results-people .lens-result').waitFor();assert.equal(await page.locator('.lens-result-group').first().getAttribute('id'),'lens-results-people');assert.equal(await page.locator('#lens-results-people strong').first().textContent(),'Moses');await page.keyboard.press('Escape');await page.locator('#lens-search-overlay[open]').waitFor({state:'hidden'});await page.waitForFunction(()=>!location.hash.startsWith('#search'));
  await page.keyboard.press('Control+k');await page.locator('#lens-search-overlay[open]').waitFor();await page.touchscreen.tap(1,1);await page.locator('#lens-search-overlay[open]').waitFor({state:'hidden'});
  await go('#chat','#chat-input');await page.locator('#chat-input').fill('Who was Moses?');await page.locator('#chat-form').evaluate(n=>n.requestSubmit());await page.locator('.ux-profile-answers strong').first().waitFor();assert.equal(await page.locator('.ux-profile-answers strong').first().textContent(),'Moses');
  assert.deepEqual(errors,[]);matrix.push({engine,width,theme,peopleTaps,questionTaps,searchTaps,nextTaps,verseOutside:'PASS',mosesQuestion:'PASS'});fs.writeFileSync(`${output}/child-matrix.json`,JSON.stringify(matrix,null,2)+'\n');console.log('PASS',matrix.at(-1));await context.close();
 }
 const page=await browser.newPage({viewport:{width:1280,height:900}});await page.goto(base+'/#read/0/1');await page.locator('#verse-1 .verse-num').click();const r=await page.locator('#lens-inspector-sheet').boundingBox();assert(Math.abs(r.x+r.width-1280)<2&&r.y===0,'Desktop drawer is a right rail');await page.keyboard.press('Escape');await page.evaluate(()=>BibleLensWorkspace.navigate('#discover'));await page.locator('.ux-topic-row:visible').waitFor();assert.equal(await page.locator('.ux-topic-row').evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length),4);await page.close();
 }finally{await browser.close();}
}
