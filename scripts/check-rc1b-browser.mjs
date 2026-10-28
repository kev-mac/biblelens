import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL;
assert(base,'Set BIBLELENS_PREVIEW_URL to a local production build');
const rulings=JSON.parse(fs.readFileSync('data/rc1-rulings.json')).rulings;
const examples=[...new Map(rulings.map(row=>[row.label,row])).values()];
for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]]){
 const browser=await engine.launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for(const row of examples){
   await page.goto(base+'/#debate/'+row.id);
   await page.waitForSelector('[data-debate-save]');
   assert.equal(await page.locator('#debate-view .phase2-verdict').textContent(),row.label);
   assert.match(await page.locator('#debate-view').innerText(),/Evidence strength: Not assigned/);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: '+name+' promoted Group A labels, Not assigned strength and phone width.');
 }finally{await browser.close();}
}
