import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const root=process.env.HOME+'/git/codex-reports',base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const rows=[],prefix=process.env.UX_REPORT_PREFIX||'ux11c2';
try{for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const width of [320,375,390,1440]){
  const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
  for(const theme of ['dark','light'])for(const mode of ['none','history']){
   await page.goto(base+'/#read/0/1');await page.locator('#verse-1').waitFor();await page.waitForFunction(()=>reading?.book===0&&reading?.chapter===1&&document.querySelector('#chapter-text').getAttribute('aria-busy')==='false');
   await page.evaluate(({theme,mode})=>{state.theme=theme;applyTheme();const select=document.querySelector('#reader-compare');select.value=mode;select.dispatchEvent(new Event('change'));},{theme,mode});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));
   if(await page.locator('#lens-focus').getAttribute('aria-pressed')!=='true')await page.locator('#lens-focus').click();
   const measured=await page.locator('#chapter-text').evaluate(chapter=>{
    const col=chapter.getBoundingClientRect();
    return [...chapter.querySelectorAll('.verse')].map(verse=>{
     const body=verse.querySelector('.verse-body'),r=body.getBoundingClientRect(),v=verse.getBoundingClientRect();
     return {id:verse.id,rightGap:col.right-r.right,verseRightGap:col.right-v.right,paddingRight:getComputedStyle(verse).paddingRight,
      pips:[...verse.querySelectorAll('[data-lens-inspect]')].map(pip=>{const p=pip.getBoundingClientRect();return {inside:p.left>=r.left-.1&&p.right<=r.right+.1,width:p.width,height:p.height,position:getComputedStyle(pip).position,pill:pip.querySelector('.verse-study-pill').getBoundingClientRect().toJSON()};})};
    });
   });
   for(const v of measured){assert(Math.abs(v.rightGap)<=2,JSON.stringify(v));assert(Math.abs(v.verseRightGap)<=2);assert.equal(v.paddingRight,'0px');for(const pip of v.pips){assert(pip.inside&&pip.width>=43.9&&pip.height>=43.9);assert.equal(pip.position,'relative');assert(pip.pill.height<30,'pip stays one line');}}
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
   const targets=await page.locator('#lensReadingBar :is(button,select):visible').evaluateAll(ns=>ns.map(n=>({id:n.id,...n.getBoundingClientRect().toJSON()})));
   for(const a of targets){assert(a.width>=43.9&&a.height>=43.9&&a.left>=0&&a.right<=width,JSON.stringify(a));}
   for(let i=0;i<targets.length;i++)for(let j=i+1;j<targets.length;j++){const a=targets[i],b=targets[j];assert(!(a.left<b.right-.5&&b.left<a.right-.5&&a.top<b.bottom-.5&&b.top<a.bottom-.5),'overlapping controls');}
   if(width<768){assert.equal(targets.length,3);assert(!await page.locator('#lensMasthead .lens-brand').isVisible());assert(!await page.locator('#lensMasthead .lens-tools').isVisible());assert.equal(await page.locator('.ux-reader-eyebrow').innerText(),'GENESIS 1');assert.equal(await page.locator('.chapter-subtitle').innerText(),'The Creation');}
   // Numbers share the first scripture line; their hit area stays outside text flow.
   const inline=await page.locator('#verse-1 .verse-body').evaluate(body=>{
    const n=body.querySelector('.verse-num'),label=n.querySelector('sup'),scripture=body.querySelector('[data-scripture]');
    const range=document.createRange();range.selectNodeContents(scripture);
    const first=range.getClientRects()[0],num=label.getBoundingClientRect(),hit=getComputedStyle(n,'::before');
    return {font:parseFloat(getComputedStyle(body).fontSize),root:parseFloat(getComputedStyle(document.documentElement).fontSize),line:parseFloat(getComputedStyle(body).lineHeight),left:body.getBoundingClientRect().left,first:first.toJSON(),num:num.toJSON(),hitWidth:hit.width,hitHeight:hit.height};
   });
   assert(Math.abs(inline.font/inline.root-1.14)<.01,'default reader size');
   assert(Math.abs(inline.line/inline.font-1.75)<.01,'reader line height');
   assert(inline.num.bottom>=inline.first.top&&inline.num.top<inline.first.bottom,'number stays on first line');
   assert(inline.first.left-inline.left<16,'no first-line gutter');
   assert.equal(inline.hitWidth,'44px');assert.equal(inline.hitHeight,'44px');
   await page.locator('#lens-focus').click();
   const focus=await page.locator('#lens-focus').evaluate(n=>({background:getComputedStyle(n).backgroundColor,shadow:getComputedStyle(n).boxShadow,outline:getComputedStyle(n).outlineStyle}));
   assert.equal(focus.background,'rgba(0, 0, 0, 0)');assert.equal(focus.shadow,'none');assert.equal(focus.outline,'none');
   // Safari may skip buttons in sequential navigation under the host setting.
   await page.keyboard.press('Tab');await page.locator('#lens-focus').focus();
   assert.equal(await page.locator('#lens-focus').evaluate(n=>getComputedStyle(n).outlineWidth),'1px','keyboard focus ring');
   await page.locator('#lens-focus').click();
   // Selecting an empty verse exercises the existing toast/action strip without opening a sheet.
   await page.locator('#verse-1 .verse-num').click();await page.locator('#ux-empty-verse-toast').waitFor();
   for(const selector of ['#ux-empty-verse-toast','#ux-empty-verse-actions']){const box=await page.locator(selector).boundingBox();assert(box.x>=0&&box.x+box.width<=width);}
   await page.evaluate(()=>{selectedVerses.clear();renderReader(true);});
   // Inspect a real pip, measuring the active row while the sheet is open.
   const pip=page.locator('#chapter-text [data-lens-inspect]').first();await pip.click();
   const active=await page.locator('.verse.lens-active-verse').evaluate(n=>({right:n.getBoundingClientRect().right,column:n.closest('#chapter-text').getBoundingClientRect().right,bg:getComputedStyle(n).backgroundColor}));
   assert(Math.abs(active.right-active.column)<=2);assert.equal(active.bg,'rgba(99, 102, 241, 0.08)');
   await page.locator('[data-context-close]').click();await page.evaluate(()=>scrollTo(0,0));
   const compare=await page.locator('#lens-compare').evaluate(n=>({wrap:getComputedStyle(n).whiteSpace,...n.getBoundingClientRect().toJSON()}));assert.equal(compare.wrap,'nowrap');assert(compare.width>=44);
   rows.push({engine,width,theme,mode,verses:measured.length,availableRightGap:Math.max(...measured.map(x=>Math.abs(x.rightGap))),targets:targets.map(x=>x.id)});
   await page.screenshot({path:`${root}/ux11-shots/${prefix}-${engine}-${width}-${theme}-${mode}.png`});
  }
  await page.evaluate(()=>{state.verseBookmarks||={};state.verseBookmarks['0:1:1']={createdAt:Date.now()};renderReader(true);});
  assert.equal(await page.locator('#verse-1 .verse-bookmark-indicator').evaluate(n=>getComputedStyle(n).display),'inline-block','saved number stays inline');
  const savedInline=await page.locator('#verse-1 .verse-body').evaluate(body=>{
   const r=document.createRange();r.selectNodeContents(body.querySelector('[data-scripture]'));
   return body.querySelector('.verse-label').getBoundingClientRect().bottom>=r.getClientRects()[0].top;
  });assert(savedInline,'saved number shares first scripture line');
  await page.evaluate(()=>{delete state.verseBookmarks['0:1:1'];renderReader(true);});
  if(width<768){
   for(const [book,chapter]of [[21,8],[51,5]]){
    await page.goto(`${base}/#read/${book}/${chapter}`);await page.waitForFunction(([book,chapter])=>reading?.book===book&&reading?.chapter===chapter&&document.querySelector('#chapter-text').getAttribute('aria-busy')==='false',[book,chapter]);await page.locator('#verse-1').waitFor();await page.evaluate(()=>document.fonts.ready);
    await page.waitForFunction(()=>{const p=document.querySelector('#ux-chapter-picker'),r=document.createRange();r.selectNodeContents(p);return r.getBoundingClientRect().width<=p.clientWidth+.5;});
    await page.locator('#ux-chapter-picker').click();await page.locator('#passage-picker[open]').waitFor();await page.keyboard.press('Escape');
   }
  }
  await page.goto(base+'/#discover');await page.locator('#lens-settings').click();await page.locator('#reader-settings[open] #reader-font').waitFor();
  await page.locator('#reader-font').evaluate(n=>{n.value='125';n.dispatchEvent(new Event('input'));});
  await page.keyboard.press('Escape');await page.goto(base+'/#read/0/1');await page.locator('#verse-1').waitFor();await page.waitForFunction(()=>reading?.book===0&&reading?.chapter===1&&document.querySelector('#chapter-text').getAttribute('aria-busy')==='false');
  assert(Math.abs(await page.locator('#verse-1 .verse-body').evaluate(n=>parseFloat(getComputedStyle(n).fontSize))-22.8)<.1,'Settings scales scripture');
  await page.close();
 }}finally{await browser.close();}
}}finally{fs.writeFileSync(root+'/UX11-logs/'+prefix+'-reader-matrix.json',JSON.stringify(rows,null,2)+'\n');}
console.log('PASS UX11c Chromium/WebKit: full available verse width, inline pips, active highlight, targets, themes, long labels, empty verse and Explore Settings.');
