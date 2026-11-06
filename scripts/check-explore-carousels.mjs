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
   const cases=engine==='chromium'?[[320,'dark'],[390,'dark'],[420,'dark'],[474,'light'],[744,'dark'],[834,'light'],[1024,'dark'],[1280,'dark'],[1920,'light']]:[[390,'dark'],[744,'light'],[1024,'dark']];
   for(const [width,theme]of cases){
    const page=await browser.newPage({viewport:{width,height:975},isMobile:width<768,hasTouch:width<768,reducedMotion:'reduce',serviceWorkers:'block'}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(20000);
    await page.context().route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
    await page.goto(base+'/#discover');await page.locator('#ux-topic-evidence').waitFor();
    await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('.ux-topic').count(),7);
    assert.equal(await page.locator('.ux-lane-arrows,[data-lane-previous],[data-lane-next]').count(),0);
    assert.equal(await page.locator('.ux-daily-question,#ux-topic-prophecies').count(),0);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'only lanes may overflow');
    const lane=page.locator('#ux-lane-collections');
    const boxes=await lane.evaluate(n=>({row:n.getBoundingClientRect().toJSON(),cards:[...n.querySelectorAll('.ux-topic')].map(c=>c.getBoundingClientRect().toJSON())}));
    assert.equal(await page.locator('.ux-topic-section').count(),1,'one collection lane');
    assert.deepEqual(await lane.locator('strong').allTextContents(),['Stories','People','Places','Laws','Lost Books','Evidence & Interpretations','Timeline']);
    const [first,second]=boxes.cards;
    assert(Math.abs((first.left+first.right-boxes.row.left-boxes.row.right)/2)<2,'first tile is centered');
    assert(first.width>second.width&&first.height>second.height,'the centered tile is larger');
    assert(second.left<first.right&&second.right>first.right,'the next tile underlaps the centered tile');
    const filters=await lane.locator('.ux-topic').evaluateAll(cards=>cards.map(card=>getComputedStyle(card).filter));
    assert.equal(filters[0],'none');assert(filters[1].includes('brightness'));
    const images=new Set();
    const stories=page.locator('#ux-topic-stories');
    const artwork=await stories.locator('img').elementHandle();
    assert(await artwork.evaluate(async img=>{await img.decode();return img.naturalWidth>0;}));
    await lane.focus();await page.keyboard.press('ArrowRight');
    await page.waitForFunction(()=>document.querySelector('#ux-topic-people').classList.contains('ux-topic-centered'));
    await stories.focus();
    await page.waitForFunction(()=>document.querySelector('#ux-topic-stories').classList.contains('ux-topic-centered'));
    assert(await artwork.evaluate(img=>img.isConnected&&img.naturalWidth>0&&document.activeElement===img.parentElement),'focused Stories retains its decoded image');
    assert.equal(await page.locator('#ux-topic-evidence').getAttribute('href'),'#questions?mode=text');
    assert.equal(await page.locator('#ux-topic-timeline').getAttribute('href'),'#timeline');
    const counts=await(await page.request.get(base+'/collection-counts.json')).json();await page.waitForFunction(()=>document.querySelector('#ux-topic-evidence .ux-count')?.textContent!=='…');
    assert.equal(await page.locator('#ux-topic-evidence .ux-count').innerText(),counts.evidence.toLocaleString(),'single corpus total rather than overlapping category sums');
    if([390,744,1280].includes(width)){await page.locator('.fetch-retry-status').waitFor({state:'hidden'});await page.screenshot({path:`${output}/${engine}-${width}-${theme}-initial.png`,fullPage:true});}
    const overflow=await page.locator('.ux-topic').evaluateAll(ns=>ns.filter(n=>n.scrollHeight>n.clientHeight+1||n.scrollWidth>n.clientWidth+1).map(n=>n.textContent));assert.deepEqual(overflow,[],'card contents fit');
    if(width<768){
     const section=page.locator('.ux-topic-section').first();
     await section.locator('.ux-lane-page').nth(1).click();await page.waitForFunction(()=>document.querySelector('#ux-lane-collections').scrollLeft>10);
     await page.waitForFunction(()=>document.querySelector('#ux-topic-people').classList.contains('ux-topic-centered'));
     const overlap=await lane.locator('.ux-topic').evaluateAll(([previous,current,next])=>{
      const [a,b,c]=[previous,current,next].map(tile=>tile.getBoundingClientRect());
      return a.left<b.left&&a.right>b.left&&c.left<b.right&&c.right>b.right;
     });
     assert(overlap,'both neighbors peek out from behind the centered tile');
     await lane.focus();await page.keyboard.press('End');
     await page.waitForFunction(()=>{const n=document.querySelector('#ux-lane-collections');return Math.abs(n.scrollWidth-n.clientWidth-n.scrollLeft)<2;});
     const last=await page.locator('#ux-topic-timeline').boundingBox(),row=await lane.boundingBox();assert(last.x>=row.x-1&&last.x+last.width<=row.x+row.width+1,'last collection is reachable');
     assert.equal(await section.locator('.ux-lane-page[aria-current=true]').count(),1);
     await section.locator('.ux-lane-page').first().click();await page.waitForFunction(()=>document.querySelector('#ux-lane-collections').scrollLeft<2);
     await lane.focus();await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('#ux-lane-collections').scrollLeft>10);
     await page.keyboard.press('Home');await page.waitForFunction(()=>document.querySelector('#ux-lane-collections').scrollLeft<2);
    }
    for(const [filter,count]of [['People & Stories',5],['Evidence',2],['Manuscripts',2],['All',7]]){
     await page.getByRole('button',{name:filter,exact:true}).click();assert.equal(await page.locator('.ux-topic').count(),count);
     const selected=page.locator('.ux-explore-filters [aria-pressed=true]');assert.equal(await selected.innerText(),filter);
     assert(await selected.evaluate(n=>{const a=n.getBoundingClientRect(),b=n.parentElement.getBoundingClientRect();return a.left>=b.left-1&&a.right<=b.right+1;}),'selected filter stays visible');
     for(const asset of await page.locator('.ux-topic img').evaluateAll(images=>images.map(img=>img.getAttribute('src')))){
      assert(asset,'each tile has artwork');images.add(asset);
     }
     if(filter==='Manuscripts'){assert.equal(await page.locator('#ux-topic-text').getAttribute('href'),'#questions?mode=text');assert.equal(await page.locator('#ux-topic-translation').getAttribute('href'),'#questions?filter=T');}
    }
    assert.equal(images.size,9,'all nine destinations have distinct artwork');
    for(const asset of images)assert(fs.readFileSync('dist/client'+asset).equals(fs.readFileSync('www'+asset)),asset+' matches the mobile bundle');
    async function openTile(id){
     const tile=page.locator(id);
     const position=await tile.evaluate(el=>[...el.parentElement.querySelectorAll('.ux-topic')].indexOf(el));
     await page.locator('.ux-lane-page').nth(position).click();
     await page.waitForFunction(id=>document.querySelector(id)?.classList.contains('ux-topic-centered'),id);
     await tile.click();
    }
    await openTile('#ux-topic-evidence');await page.locator('#debates-view:not([hidden]) .phase2-debate-card').first().waitFor();
    for(const mode of ['history','science','translation','text']){
     await page.locator('[data-debate-mode="'+mode+'"]').click();await page.locator('[data-debate-mode="'+mode+'"][aria-pressed=true]').waitFor();await page.locator('#debates-view:not([hidden]) .phase2-debate-card').first().waitFor();
    }
    await page.getByRole('button',{name:'Filter records',exact:true}).click();
    await page.locator('#debate-sheet').getByRole('link',{name:'Contradictions',exact:true}).click();await page.locator('#accepted-search').waitFor();
    await page.keyboard.press('Escape');
    await page.goto(base+'/#discover?section=evidence');await page.locator('#ux-topic-evidence').waitFor();assert.equal(await page.locator('.ux-topic').count(),2);
    await openTile('#ux-topic-timeline');await page.locator('#timeline-view:not([hidden])').waitFor();assert.match(page.url(),/#timeline/);
    await page.goto(base+'/#discover');await page.locator('#ux-lane-collections').waitFor();
    await page.setViewportSize({width:390,height:975});await page.locator('#ux-lane-collections').focus();await page.keyboard.press('End');
    await page.waitForFunction(()=>{const n=document.querySelector('#ux-lane-collections');return Math.abs(n.scrollWidth-n.clientWidth-n.scrollLeft)<2;});
    await openTile('#ux-topic-lost');await page.locator('#lost-view:not([hidden]) .lost-card').first().waitFor();assert.match(page.url(),/#lost/);
    await page.goto(base+'/#discover');await page.locator('#ux-topic-evidence').waitFor();await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);await page.setViewportSize({width,height:975});await page.evaluate(()=>document.fonts.ready);
    await page.locator('.fetch-retry-status').waitFor({state:'hidden'});
    await page.screenshot({path:`${output}/${engine}-${width}-${theme}.png`,fullPage:true});assert.deepEqual(errors,[]);
    if(width===390||width===744){
     await page.evaluate(()=>document.documentElement.style.fontSize='200%');
     assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'large text keeps page within viewport');
     assert.deepEqual(await page.locator('.ux-topic').evaluateAll(ns=>ns.filter(n=>n.scrollHeight>n.clientHeight+1||n.scrollWidth>n.clientWidth+1).map(n=>n.textContent)),[],'large text fits growing cards');
     await page.screenshot({path:`${output}/${engine}-${width}-${theme}-large-text.png`,fullPage:true});
    }
    await page.close();console.log('PASS Explore carousels:',engine,width,theme);
   }
  }finally{await browser.close();}
 }
}finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
