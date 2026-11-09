import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';

async function waitForScrollIdle(page){
 return page.evaluate(()=>new Promise((resolve,reject)=>{
  let previous=scrollY,stable=0;const started=performance.now();
  function frame(){const current=scrollY;stable=Math.abs(current-previous)<.1?stable+1:0;previous=current;
   if(stable>=8){resolve(current);return;}if(performance.now()-started>5000){reject(Error('Comparison scroll did not settle at '+current));return;}requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
 }));
}
const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to an authorized running preview.');
const ids=['exodus-crops-surviving-hail','early-sabbath','deuteronomy-ark-builder',...JSON.parse(fs.readFileSync('research/notes/contradiction-integration-batch-397.json')).exodus.addedRecordIds,...JSON.parse(fs.readFileSync('research/notes/contradiction-integration-batch-398.json')).addedRecordIds,...JSON.parse(fs.readFileSync('research/notes/contradiction-integration-batch-401.json')).newItems.map(row=>row.id)];
const records=JSON.parse(fs.readFileSync('data/evidence.json')).filter(row=>ids.includes(row.id));
assert.deepEqual(records.map(row=>row.id).sort(),ids.slice().sort());
const output='.release/contradiction-reviews',results=[];
fs.mkdirSync(output,{recursive:true});
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
 try{for(const width of [390,1157])for(const edition of ['kjv','asv','web']){
  const context=await browser.newContext({viewport:{width,height:1184},hasTouch:width===390,reducedMotion:'reduce',serviceWorkers:'block'});
  const page=await context.newPage(),errors=[];let attempt=null;
  await context.addInitScript(()=>{
   window.__contradictionContextEvents=[];
   const record=(type,target,key)=>{const popup=document.getElementById('verse-preview'),events=window.__contradictionContextEvents;events.push({type,key,target:target?.id||target?.dataset?.cite||target?.tagName,route:location.hash,scrollY,focus:document.activeElement?.id||document.activeElement?.dataset?.cite||document.activeElement?.tagName,popupHidden:popup?.hidden,popupLabel:popup?.querySelector('strong')?.textContent,time:performance.now()});if(events.length>160)events.shift();};
   for(const type of ['scroll','click','pointerdown','focusin','keydown'])document.addEventListener(type,event=>record(type,event.target,event.key),true);
   new MutationObserver(records=>{if(records.some(r=>r.target.id==='verse-preview'))record('preview-visibility',document.getElementById('verse-preview'));}).observe(document,{subtree:true,attributes:true,attributeFilter:['hidden']});
  });
  page.on('pageerror',error=>errors.push(error.message));
  try{
   await page.goto(base+'/#read/1/9');
   await page.locator('#verse-25').waitFor();
   await page.locator('#ux-chapter-picker').click();
   await page.locator('#reader-edition').selectOption(edition);
   await page.keyboard.press('Escape');await page.locator('#passage-picker').waitFor({state:'hidden'});
   await page.waitForFunction(edition=>document.querySelector('#reader-edition').value===edition,edition);
   for(const row of records){
    const route='#debate/'+row.id;
    await page.evaluate(route=>BibleLensWorkspace.navigate(route),route);
    const review=page.locator('.contradiction-review:visible');
    await review.waitFor();
    await page.locator('#debate-view .phase2-sides:not([aria-busy])').waitFor();
    await page.evaluate(()=>document.fonts.ready);await waitForScrollIdle(page);
    assert.equal(await review.locator('p').first().innerText(),row.contradictionReview.conflict);
    assert.match(await review.innerText(),/Common Explanations/);
    assert.match(await review.innerText(),/Assessment and Limits/);
    const links=review.locator('[data-cite-context="true"]');
    assert.equal(await links.count(),row.contradictionReview.passages.length);
    for(let index=0;index<await links.count();index++){
     const link=links.nth(index),ref=row.contradictionReview.passages[index];
     attempt={id:row.id,index,ref,input:index%2?'keyboard':width===390?'touch':'mouse',scrollAtStart:await page.evaluate(()=>scrollY)};
     const [book,chapter,verse]=(await link.getAttribute('data-cite')).split('/').map(Number);
     const end=Number(await link.getAttribute('data-cite-end'));
     const response=await page.request.get(`${base}/api/chapter?book=${book}&chapter=${chapter}`);
     assert(response.ok());const data=await response.json();
     await link.scrollIntoViewIfNeeded();attempt.scrollAfterPosition=await waitForScrollIdle(page);
     if(width===1157){await link.hover();attempt.scrollAfterHover=await waitForScrollIdle(page);assert(await page.locator('#verse-preview').isHidden(),'Hover leaves the comparison citation available for activation');}
     if(index%2){await link.focus();attempt.scrollAfterFocus=await waitForScrollIdle(page);assert(await link.evaluate(node=>node===document.activeElement),'The intended citation retains keyboard focus before activation');assert(await page.locator('#verse-preview').isHidden(),'Focus alone preserves the context link');await page.keyboard.press('Enter');}
     else if(width===390)await link.tap();
     else await link.click();
     const preview=page.locator('#verse-preview');await preview.waitFor({state:'visible'});
     await page.waitForFunction(()=>!document.querySelector('#verse-preview .preview-text').classList.contains('loading-state'));
     assert.equal(await page.evaluate(()=>location.hash),route,'Citation opens context without leaving the assessment');
     assert.equal(await preview.locator('.preview-edition').innerText(),edition.toUpperCase());
     assert.equal(await preview.locator('strong').first().innerText(),ref);
     const selected=await preview.locator('.preview-selected b').allTextContents();
     assert.deepEqual(selected,Array.from({length:end-verse+1},(_,i)=>String(verse+i)),'Every cited verse is marked');
     const displayed=await preview.locator('.preview-selected').allTextContents();
     const plain=value=>value.replace(/\s+/g,' ').trim();
     assert.deepEqual(displayed.map(value=>plain(value.replace(/^\d+\s*/,''))),data.verses.filter(v=>v.n>=verse&&v.n<=end).map(v=>plain(v[edition])),'The window displays the selected edition’s actual verse text');
     const numbers=await preview.locator('.preview-text b').allTextContents();
     assert.deepEqual(numbers,data.verses.filter(v=>v.n>=Math.max(1,verse-2)&&v.n<=end+2).map(v=>String(v.n)),'Context stays within the chapter');
     assert(!/Loading verse|Could not load|absent from/.test(await preview.locator('.preview-text').innerText()));
     const geometry=await preview.boundingBox();assert(geometry.x>=0&&geometry.x+geometry.width<=width+1);
     if(index===0)await page.screenshot({path:`${output}/${engine}-${width}-${edition}-${row.id}-context.png`,fullPage:false});
     await page.keyboard.press('Escape');await preview.waitFor({state:'hidden'});
     const focus=await link.evaluate(node=>({correct:node===document.activeElement,expected:node.outerHTML,actual:document.activeElement?.outerHTML}));
     assert(focus.correct,'Escape returns focus to the current citation: '+JSON.stringify({id:row.id,index,ref,focus}));
    }
    assert.deepEqual(errors,[]);
    results.push({engine,width,edition,id:row.id,passages:row.contradictionReview.passages,status:'PASS'});
    console.log('PASS reviewed context',engine,width,edition,row.id);
   }
  }catch(error){await page.screenshot({path:`${output}/failure-${engine}-${width}-${edition}.png`,fullPage:false}).catch(()=>{});const state=await page.evaluate(()=>({route:location.hash,scrollY,focus:document.activeElement?.outerHTML,popupHidden:document.getElementById('verse-preview')?.hidden,popupLabel:document.querySelector('#verse-preview strong')?.textContent,events:window.__contradictionContextEvents})).catch(error=>({unavailable:error.message}));fs.writeFileSync(`${output}/failure-${engine}-${width}-${edition}.json`,JSON.stringify({error:error.stack,attempt,state},null,2)+'\n');throw error;}
  finally{fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');await context.close();}
 }}finally{await browser.close();}
}
assert.equal(results.length,228);
console.log('PASS: 228 real-record cases; six new bounded reviews and retained ranges in three editions, touch/keyboard context windows, margins and focus return.');
