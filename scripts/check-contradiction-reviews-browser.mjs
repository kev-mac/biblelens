import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';

const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to an authorized running preview.');
const ids=['exodus-crops-surviving-hail','early-sabbath','deuteronomy-ark-builder'];
const records=JSON.parse(fs.readFileSync('data/evidence.json')).filter(row=>ids.includes(row.id));
const output='.release/contradiction-reviews',results=[];
fs.mkdirSync(output,{recursive:true});
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
 try{for(const width of [390,1157])for(const edition of ['kjv','asv','web']){
  const context=await browser.newContext({viewport:{width,height:1184},hasTouch:width===390,reducedMotion:'reduce',serviceWorkers:'block'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  try{
   await page.goto(base+'/#read/1/9');
   await page.locator('#lens-edition').selectOption(edition);
   await page.waitForFunction(edition=>document.querySelector('#reader-edition').value===edition,edition);
   for(const row of records){
    const route='#debate/'+row.id;
    await page.evaluate(route=>BibleLensWorkspace.navigate(route),route);
    const review=page.locator('.contradiction-review:visible');
    await review.waitFor();
    assert.equal(await review.locator('p').first().innerText(),row.contradictionReview.conflict);
    assert.match(await review.innerText(),/Common Explanations/);
    assert.match(await review.innerText(),/Assessment and Limits/);
    const links=review.locator('[data-cite-context="true"]');
    assert.equal(await links.count(),row.contradictionReview.passages.length);
    for(let index=0;index<await links.count();index++){
     const link=links.nth(index),ref=row.contradictionReview.passages[index];
     const [book,chapter,verse]=(await link.getAttribute('data-cite')).split('/').map(Number);
     const end=Number(await link.getAttribute('data-cite-end'));
     const response=await page.request.get(`${base}/api/chapter?book=${book}&chapter=${chapter}`);
     assert(response.ok());const data=await response.json();
     await link.scrollIntoViewIfNeeded();
     if(index%2){await link.focus();await page.keyboard.press('Enter');}
     else if(width===390)await link.tap();
     else await link.click();
     const preview=page.locator('#verse-preview');await preview.waitFor({state:'visible'});
     await page.waitForFunction(()=>!document.querySelector('#verse-preview .preview-text').classList.contains('loading-state'));
     assert.equal(await page.evaluate(()=>location.hash),route,'Citation opens context without leaving the assessment');
     assert.equal(await preview.locator('.preview-edition').innerText(),edition.toUpperCase());
     assert.equal(await preview.locator('strong').first().innerText(),ref);
     const selected=await preview.locator('.preview-selected b').allTextContents();
     assert.deepEqual(selected,Array.from({length:end-verse+1},(_,i)=>String(verse+i)),'Every cited verse is marked');
     const numbers=await preview.locator('.preview-text b').allTextContents();
     assert.deepEqual(numbers,data.verses.filter(v=>v.n>=Math.max(1,verse-2)&&v.n<=end+2).map(v=>String(v.n)),'Context stays within the chapter');
     assert(!/Loading verse|Could not load|absent from/.test(await preview.locator('.preview-text').innerText()));
     const geometry=await preview.boundingBox();assert(geometry.x>=0&&geometry.x+geometry.width<=width+1);
     if(index===0)await page.screenshot({path:`${output}/${engine}-${width}-${edition}-${row.id}-context.png`,fullPage:false});
     await page.keyboard.press('Escape');await preview.waitFor({state:'hidden'});
     assert(await link.evaluate(node=>node===document.activeElement),'Escape returns focus to the citation');
    }
    assert.deepEqual(errors,[]);
    results.push({engine,width,edition,id:row.id,passages:row.contradictionReview.passages,status:'PASS'});
    console.log('PASS reviewed context',engine,width,edition,row.id);
   }
  }catch(error){await page.screenshot({path:`${output}/failure-${engine}-${width}-${edition}.png`,fullPage:false}).catch(()=>{});throw error;}
  finally{fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');await context.close();}
 }}finally{await browser.close();}
}
assert.equal(results.length,36);
console.log('PASS: 36 real-record cases; all new passage ranges, three selected editions, touch/keyboard context windows, margins and focus return.');
