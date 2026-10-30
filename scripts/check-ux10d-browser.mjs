import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const root=process.env.HOME+'/git/codex-reports';
const logs=process.env.UX_REPORT_DIR||root+'/UX10d-logs',shots=process.env.UX_SHOT_DIR||root+'/ux10d-shots';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const books=JSON.parse(fs.readFileSync('data/books.json')),matrix=[];
fs.mkdirSync(logs,{recursive:true});fs.mkdirSync(shots,{recursive:true});
for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const width of [320,375,390,1440]){
  const context=await browser.newContext({viewport:{width,height:844},hasTouch:width<600,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage();
  await page.goto(base+'/#read/0/22');await page.locator('#verse-1').waitFor();
  await page.evaluate(()=>{state.theme='dark';applyTheme();});
  const go=async(book,chapter)=>{
   // WebKit limits history mutations; allow its real navigation path to settle.
   if(engine==='webkit')await page.waitForTimeout(1000);
   await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),`#read/${book}/${chapter}`);
   await page.waitForFunction(([book,chapter])=>reading?.book===book&&reading?.chapter===chapter,[book,chapter]);
   await page.evaluate(()=>document.fonts.ready);
  };
  const measure=async()=>page.locator('#ux-chapter-picker').evaluate(n=>{
   const book=n.querySelector('.ux-picker-book'),chapter=n.querySelector('.ux-picker-chapter'),range=document.createRange();range.selectNodeContents(book);
   const text=range.getBoundingClientRect(),box=book.getBoundingClientRect(),end=chapter.getBoundingClientRect(),picker=n.getBoundingClientRect();
   return {fits:text.width<=box.width+.1&&end.right<=picker.right+.1,textWidth:text.width,available:box.width,ellipsis:getComputedStyle(book).textOverflow};
  });
  for(const book of books){
   // Measure every valid chapter number in the actual picker font, then render
   // the widest label. Prefer the final chapter when widths tie.
   const chapter=await page.locator('.ux-picker-chapter').evaluate((n,count)=>{
    const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');ctx.font=getComputedStyle(n).font;
    let widest=0,chapter=1;for(let i=1;i<=count;i++){const w=ctx.measureText(String(i)).width;if(w>=widest){widest=w;chapter=i;}}return chapter;
   },book.chapters);
   await go(book.id,chapter);
   const picker=page.locator('#ux-chapter-picker');assert.equal(await picker.getAttribute('aria-label'),`${book.name} ${chapter}. Choose chapter`);
   assert.equal(await picker.locator('.ux-picker-book').innerText(),book.name);
   const fit=await measure();matrix.push({engine,width,book:book.name,chapter,...fit});
   if(!fit.fits){assert.equal(fit.ellipsis,'ellipsis');await picker.click();await page.locator('#passage-picker[open]').waitFor();assert((await page.locator('#passage-picker').innerText()).includes(book.name));await page.keyboard.press('Escape');}
   const controls=await page.locator('#lensReadingBar button:visible,#lensReadingBar select:visible').evaluateAll(ns=>ns.map(n=>({id:n.id,...n.getBoundingClientRect().toJSON()})));
   for(const a of controls){assert(a.left>=0&&a.right<=width&&a.width>=43.9&&a.height>=43.9,JSON.stringify(a));}
   for(let i=0;i<controls.length;i++)for(let j=i+1;j<controls.length;j++){const a=controls[i],b=controls[j];assert(!(a.left<b.right-.5&&b.left<a.right-.5&&a.top<b.bottom-.5&&b.top<a.bottom-.5),'Reading controls overlap');}
   assert.equal(await page.locator('#ux-prev').isVisible(),width>600);assert.equal(await page.locator('#ux-next').isVisible(),width>600);
  }
  for(const [book,chapter,name]of [[0,22,'genesis-22'],[21,8,'song-of-solomon-8'],[51,5,'1-thessalonians-5']]){
   await go(book,chapter);if(book===0)assert((await measure()).fits,`${engine} ${width}: Genesis 22 fits`);
   await page.evaluate(()=>scrollTo(0,0));
   if(width===320||width===390)await page.screenshot({path:`${shots}/${engine}-${width}-dark-read-${name}.png`});
  }
  // Exercise the reader's real touch handlers in both engines.
  if(width<600){
   await go(0,22);
   const swipe=async(direction)=>{
    await page.locator('#chapter-text').evaluate((n,direction)=>{
     const touch=x=>({identifier:1,target:n,clientX:x,clientY:300});
     const dispatch=(type,touches,changedTouches)=>{const e=new Event(type,{bubbles:true,cancelable:true});Object.defineProperties(e,{touches:{value:touches},changedTouches:{value:changedTouches}});n.dispatchEvent(e);};
     dispatch('touchstart',[touch(160)],[]);dispatch('touchmove',[touch(160+direction*110)],[]);dispatch('touchend',[],[touch(160+direction*110)]);
    },direction);
   };
   await swipe(-1);await page.waitForFunction(()=>reading?.chapter===23);await swipe(1);await page.waitForFunction(()=>reading?.chapter===22);
  }else{
   await go(0,22);await page.locator('#ux-next').click();await page.waitForFunction(()=>reading?.chapter===23);await page.locator('#ux-prev').click();await page.waitForFunction(()=>reading?.chapter===22);
  }
  await context.close();console.log('PASS UX10d',engine,width);
 }}finally{await browser.close();fs.writeFileSync(logs+'/ux10d-fit-matrix.json',JSON.stringify(matrix,null,2)+'\n');}
}
let table='| Longest label | Chromium 320/375/390 | WebKit 320/375/390 |\n|---|---|---|\n';
for(const book of books){const rows=matrix.filter(r=>r.book===book.name);table+=`| ${book.name} ${rows[0].chapter} | `+['chromium','webkit'].map(engine=>[320,375,390].map(width=>rows.find(r=>r.engine===engine&&r.width===width).fits?'fit':'ellipsis').join('/')).join(' | ')+' |\n';}
fs.writeFileSync(logs+'/ux10d-fit-table.md',table);
console.log('Ellipsis cases:',JSON.stringify(matrix.filter(r=>!r.fits)));
