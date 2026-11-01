import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import {chromium,webkit} from 'playwright';
import worker from './built-worker.mjs';

const output='.release/carousels';fs.mkdirSync(output,{recursive:true});
const server=http.createServer(async(req,res)=>{try{const response=await worker.fetch(new Request(new URL(req.url,'http://preview.test'),{headers:req.headers}),{},{});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(error){res.writeHead(500);res.end(String(error));}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:'+server.address().port;
try{
 for(const [engine,type]of Object.entries({chromium,webkit})){
  const browser=await type.launch();
  try{
   const cases=engine==='chromium'?[[320,'dark'],[390,'dark'],[420,'dark'],[474,'light'],[1280,'dark']]:[[390,'dark'],[420,'light']];
   for(const [width,theme]of cases){
    const page=await browser.newPage({viewport:{width,height:975},isMobile:width<768,hasTouch:width<768,reducedMotion:'reduce',serviceWorkers:'block'}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(20000);
    await page.goto(base+'/#discover');await page.locator('#ux-topic-questions').waitFor();
    await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('.ux-topic').count(),11);
    assert.equal(await page.locator('.ux-daily-question,#ux-topic-prophecies').count(),0);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'only lanes may overflow');
    const lane=page.locator('#ux-lane-topics');
    const boxes=await lane.evaluate(n=>({row:n.getBoundingClientRect().toJSON(),cards:[...n.querySelectorAll('.ux-topic')].map(c=>c.getBoundingClientRect().toJSON())}));
    if(width>=390&&width<=474){assert(boxes.cards[1].right<=boxes.row.right,'two complete cards');assert(boxes.cards[2].left<boxes.row.right&&boxes.cards[2].right>boxes.row.right,'next card peeks into view');}
    const overflow=await page.locator('.ux-topic').evaluateAll(ns=>ns.filter(n=>n.scrollHeight>n.clientHeight+1||n.scrollWidth>n.clientWidth+1).map(n=>n.textContent));assert.deepEqual(overflow,[],'card contents fit');
    if(width<768){
     const section=page.locator('.ux-topic-section').first();
     assert(await section.locator('[data-lane-previous]').isDisabled());
     await section.locator('[data-lane-next]').click();await page.waitForFunction(()=>document.querySelector('#ux-lane-topics').scrollLeft>10);
     await page.waitForFunction(()=>!document.querySelector('#ux-lane-topics').parentElement.querySelector('[data-lane-previous]').disabled);
     await lane.focus();await page.keyboard.press('End');
     await page.waitForFunction(()=>{const n=document.querySelector('#ux-lane-topics');return Math.abs(n.scrollWidth-n.clientWidth-n.scrollLeft)<2;});
     await page.waitForFunction(()=>document.querySelector('#ux-lane-topics').parentElement.querySelector('[data-lane-next]').disabled);
     const last=await page.locator('#ux-topic-lost').boundingBox(),row=await lane.boundingBox();assert(last.x>=row.x-1&&last.x+last.width<=row.x+row.width+1,'last collection is reachable');
     assert.equal(await section.locator('.ux-lane-page[aria-current=true]').count(),1);
     await section.locator('.ux-lane-page').first().click();await page.waitForFunction(()=>document.querySelector('#ux-lane-topics').scrollLeft<2);
     await lane.focus();await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('#ux-lane-topics').scrollLeft>10);
     await page.keyboard.press('Home');await page.waitForFunction(()=>document.querySelector('#ux-lane-topics').scrollLeft<2);
    }
    for(const [filter,count]of [['People & Stories',5],['Evidence',6],['Manuscripts',2],['All',11]]){
     await page.getByRole('button',{name:filter,exact:true}).click();assert.equal(await page.locator('.ux-topic').count(),count);
     const selected=page.locator('.ux-explore-filters [aria-pressed=true]');assert.equal(await selected.innerText(),filter);
     assert(await selected.evaluate(n=>{const a=n.getBoundingClientRect(),b=n.parentElement.getBoundingClientRect();return a.left>=b.left-1&&a.right<=b.right+1;}),'selected filter stays visible');
     if(filter==='Manuscripts'){assert.equal(await page.locator('#ux-topic-text').getAttribute('href'),'#questions?mode=text');assert.equal(await page.locator('#ux-topic-translation').getAttribute('href'),'#questions?filter=T');}
    }
    await page.setViewportSize({width:390,height:975});await page.locator('#ux-lane-topics').focus();await page.keyboard.press('End');
    await page.waitForFunction(()=>{const n=document.querySelector('#ux-lane-topics');return Math.abs(n.scrollWidth-n.clientWidth-n.scrollLeft)<2;});
    await page.locator('#ux-topic-lost').click();await page.locator('#lost-view:not([hidden]) .lost-card').first().waitFor();assert.match(page.url(),/#lost/);
    await page.goto(base+'/#discover');await page.locator('#ux-topic-questions').waitFor();await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);await page.setViewportSize({width,height:975});await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:`${output}/${engine}-${width}-${theme}.png`,fullPage:true});assert.deepEqual(errors,[]);
    await page.close();console.log('PASS Explore carousels:',engine,width,theme);
   }
  }finally{await browser.close();}
 }
}finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
