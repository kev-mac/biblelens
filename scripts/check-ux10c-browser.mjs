import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const root=process.env.HOME+'/git/codex-reports',out=process.env.UX_SHOT_DIR||root+'/ux10c-shots',logs=process.env.UX_REPORT_DIR||root+'/UX10c-logs';
fs.mkdirSync(out,{recursive:true});fs.mkdirSync(logs,{recursive:true});
const matrix=[];
for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const width of [320,375,390]){
  const context=await browser.newContext({viewport:{width,height:844},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage();
  const go=async(book,chapter)=>{
   await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),`#read/${book}/${chapter}`);
   await page.waitForFunction(([book,chapter])=>reading?.book===book&&reading?.chapter===chapter,[book,chapter]);
   await page.evaluate(()=>document.fonts.ready);
  };
  const shot=async name=>{if(process.env.UX_NO_SHOTS!=='1'&&width!==375)await page.screenshot({path:`${out}/${engine}-${width}-dark-${name}.png`});};
  await page.goto(base+'/#read/0/1');await page.locator('#verse-1').waitFor();
  await page.evaluate(()=>{state.theme='dark';applyTheme();});
  for(const hash of ['#discover','#discover?section=evidence']){
   await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await page.locator('.ux-topic strong').first().waitFor();await page.evaluate(()=>document.fonts.ready);
   const titles=await page.locator('.ux-topic strong').evaluateAll(ns=>ns.map(n=>{const r=document.createRange();r.selectNodeContents(n);const box=n.getBoundingClientRect(),text=r.getBoundingClientRect(),card=n.closest('a').getBoundingClientRect();return {title:n.textContent,lines:r.getClientRects().length,client:n.clientWidth,scroll:n.scrollWidth,left:text.left,right:text.right,cardLeft:card.left,cardRight:card.right,ellipsis:getComputedStyle(n).textOverflow};}));
   for(const title of titles){assert.equal(title.lines,1,JSON.stringify(title));assert(title.scroll<=title.client+1,JSON.stringify(title));assert(title.left>=title.cardLeft&&title.right<=title.cardRight,JSON.stringify(title));assert.notEqual(title.ellipsis,'ellipsis');}
   matrix.push({engine,width,hash,titles});if(hash==='#discover')await shot('explore');
  }
  for(const [book,chapter,name]of [[0,1,'Genesis'],[21,8,'Song of Solomon'],[51,5,'1 Thessalonians'],[65,22,'Revelation']]){
   await go(book,chapter);
   const picker=page.locator('#ux-chapter-picker');assert.equal(await picker.getAttribute('aria-label'),`${name} ${chapter}. Choose chapter`);
   assert.equal(await picker.locator('.ux-picker-book').innerText(),name);
   const controls=await page.locator('#lensReadingBar button:visible,#lensReadingBar select:visible').evaluateAll(ns=>ns.map(n=>({id:n.id,...n.getBoundingClientRect().toJSON()})));
   assert(!controls.some(n=>n.id==='ux-prev'));assert(!controls.some(n=>n.id==='ux-next'));
   assert(await page.locator('#ux-prev').isHidden());assert(await page.locator('#ux-next').isHidden());
   for(const a of controls){assert(a.width>=43.9&&a.height>=43.9,JSON.stringify(a));assert(a.left>=0&&a.right<=width,JSON.stringify(a));assert(Math.abs(a.top-controls[0].top)<1,'Controls stay on one line');}
   for(let i=0;i<controls.length;i++)for(let j=i+1;j<controls.length;j++){const a=controls[i],b=controls[j];assert(!(a.left<b.right-.5&&b.left<a.right-.5&&a.top<b.bottom-.5&&b.top<a.bottom-.5),'Reading controls overlap');}
   for(const [id,label,disabled]of [['ux-prev','Previous chapter',book===0&&chapter===1],['ux-next','Next chapter',book===65&&chapter===22]]){
    assert.equal(await page.locator('#'+id).getAttribute('aria-label'),label);assert.equal(await page.locator('#'+id).isDisabled(),disabled);
   }
   assert.equal(await page.locator('#prev-bottom').isDisabled(),book===0&&chapter===1);assert.equal(await page.locator('#next-bottom').isDisabled(),book===65&&chapter===22);
   if(book===0||book===21)await shot(book===0?'read-genesis-1':'read-song-of-solomon-8');
   matrix.push({engine,width,book,chapter,controls});
  }
  await go(0,1);await page.locator('#next-bottom').click();await page.waitForFunction(()=>reading?.book===0&&reading?.chapter===2);
  await page.locator('#prev-bottom').click();await page.waitForFunction(()=>reading?.book===0&&reading?.chapter===1);
  await go(21,8);await page.locator('#next-bottom').click();await page.waitForFunction(()=>reading?.book===22&&reading?.chapter===1);
  await page.locator('#prev-bottom').click();await page.waitForFunction(()=>reading?.book===21&&reading?.chapter===8);
  await page.locator('#ux-chapter-picker').click();await page.locator('#passage-picker[open]').waitFor();assert.match(await page.locator('#passage-picker').innerText(),/Song of Solomon/);
  await context.close();console.log('PASS UX10c',engine,width);
 }}finally{await browser.close();fs.writeFileSync(logs+'/ux10c-browser-matrix.json',JSON.stringify(matrix,null,2)+'\n');}
}
