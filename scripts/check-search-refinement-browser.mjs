import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium,webkit} from 'playwright';
import worker from './built-worker.mjs';

// Exercise the built app and native offline bundle with local assets only.
const mobile=process.argv.includes('--mobile'),root=path.resolve('www');
const output='.release/search-refinement'+(mobile?'-mobile':''),results=[],apiRequests=[];
const selectedBrowser=process.env.BIBLELENS_TEST_BROWSER||'all';
assert(['all','chromium','webkit'].includes(selectedBrowser));
fs.mkdirSync(output,{recursive:true});
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(mobile){
   if(url.pathname.startsWith('/api/')){apiRequests.push(url.pathname);res.writeHead(503);res.end('Use the on-device API');return;}
   const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
   assert(file.startsWith(root+path.sep));
   const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.woff2':'font/woff2','.svg':'image/svg+xml'};
   res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));return;
  }
  if(url.pathname.startsWith('/assets/')&&/\.(webp|png|jpg)$/.test(url.pathname)&&fs.existsSync('src'+url.pathname)){
   res.writeHead(200,{'content-type':'image/webp'});res.end(fs.readFileSync('src'+url.pathname));return;
  }
  const response=await worker.fetch(new Request(url,{headers:req.headers}),{},{});
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(error.message);}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
try{
 for(const [name,type]of Object.entries({chromium,webkit}).filter(([name])=>selectedBrowser==='all'||name===selectedBrowser)){
  const browser=await type.launch({headless:true,...(name==='chromium'&&process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
  try{for(const width of mobile?[390,820]:[320,390,820,1440]){
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(20000);
   await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
   if(mobile)await context.addInitScript(()=>Object.defineProperty(navigator,'onLine',{get:()=>false}));
   try{
    await page.goto(base+'/#discover');await page.waitForFunction(()=>!document.documentElement.classList.contains('bl-starting'));
    await page.locator('#explore-view h1').focus();await page.keyboard.press('/');await page.locator('#lens-search-overlay[open]').waitFor();
    const input=page.locator('#lens-search-input'),tabs=page.locator('#lens-search-tabs'),status=page.locator('#lens-search-status');
    assert.equal(await input.getAttribute('placeholder'),'Search scripture');assert(await page.locator('#lens-search-suggestions').isVisible());assert(!(await tabs.isVisible()));
    const inputBox=await input.boundingBox(),cancelBox=await page.locator('[data-search-cancel]').boundingBox();
    assert(Math.abs(inputBox.y+inputBox.height/2-cancelBox.y-cancelBox.height/2)<2,'Cancel stays beside search');assert(inputBox.width>=160);
    assert(await input.evaluate(n=>{const s=getComputedStyle(n),canvas=document.createElement('canvas'),c=canvas.getContext('2d');c.font=s.font;return c.measureText(n.placeholder).width<=n.clientWidth-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight);}), 'Short placeholder fits without clipping');
    await page.screenshot({path:`${output}/${name}-${width}-empty.png`});
    const search=async query=>{await input.fill(query);await page.locator('#lens-search-form').evaluate(form=>form.requestSubmit());await page.waitForFunction(q=>new URLSearchParams(location.hash.split('?')[1]).get('q')===q,query);await page.waitForFunction(()=>!document.getElementById('lens-search-results').hasAttribute('aria-busy')&&!document.getElementById('lens-search-tabs').hidden);};
    const count=async key=>Number(await page.locator('#lens-search-count-'+key).innerText());
    // A tab must switch from inactive through a real pointer click after input
    // focus. A selected-tab no-op can hide a dialog that moves during blur.
    const switchFromInput=async key=>{
     const button=page.locator('#lens-search-tab-'+key),panel=page.locator('#lens-search-panel-'+key);
     assert.equal(await button.getAttribute('aria-selected'),'false','Regression starts with an inactive tab');
     await input.focus();assert(await input.evaluate(n=>document.activeElement===n));
     await page.evaluate(()=>{
      window.searchPointerTrace=[];
      const record=event=>{
       const dialog=document.getElementById('lens-search-overlay');
       window.searchPointerTrace.push({type:event.type,tab:event.target.closest('[data-search-tab]')?.dataset.searchTab,top:dialog.getBoundingClientRect().top});
      };
      document.addEventListener('pointerdown',record,{capture:true,once:true});
      document.addEventListener('pointerup',record,{capture:true,once:true});
     });
     await button.click();
     const trace=await page.evaluate(()=>window.searchPointerTrace);
     assert.deepEqual(trace.map(event=>[event.type,event.tab]),[['pointerdown',key],['pointerup',key]],'The same tab receives pointer-down and pointer-up');
     assert(Math.abs(trace[0].top-trace[1].top)<1,'Input blur must not move the search dialog during the click');
     assert.equal(await button.getAttribute('aria-selected'),'true','Pointer click selects the previously inactive tab');
     assert(await panel.isVisible());assert(!(await page.locator('#lens-search-panel-'+(key==='scripture'?'evidence':'scripture')).isVisible()));
    };
    await search('Genesis 1');assert(!(await page.locator('#lens-search-suggestions').isVisible()));assert.equal(await count('scripture'),24);assert((await count('evidence'))<=12);
    assert(await tabs.evaluate(n=>[...n.querySelectorAll('button')].every(e=>e.scrollWidth<=e.clientWidth+1)&&n.scrollWidth<=n.clientWidth+1),'Tab labels and counts fit without overflow');
    assert.match(await status.innerText(),/returned/);await page.locator('#lens-search-tab-scripture').click();await page.locator('#lens-search-panel-scripture .lens-more-results summary').click();assert.equal(await page.locator('#lens-search-panel-scripture .lens-result:visible').count(),24);
    if(width>=900){const boxes=await page.locator('#lens-search-panel-scripture .lens-result').evaluateAll(nodes=>nodes.slice(0,2).map(n=>n.getBoundingClientRect().toJSON()));assert(boxes[0].width>450);assert(boxes[1].x>boxes[0].right);}
    await page.locator('#lens-search-overlay').evaluate(n=>n.scrollTop=0);await page.screenshot({path:`${output}/${name}-${width}-scripture.png`});
    await page.locator('#lens-search-tab-evidence').click();assert(!(await page.locator('#lens-search-panel-scripture').isVisible()));assert(await page.locator('#lens-search-panel-evidence').isVisible());
    const shownEvidence=await count('evidence');if(shownEvidence>5)await page.locator('#lens-search-panel-evidence .lens-more-results summary').click();assert.equal(await page.locator('#lens-search-panel-evidence .lens-result:visible').count(),shownEvidence);
    await page.locator('#lens-search-overlay').evaluate(n=>n.scrollTop=0);await page.screenshot({path:`${output}/${name}-${width}-evidence.png`});
    await page.locator('#lens-search-tab-evidence').focus();await page.keyboard.press('Home');assert.equal(await page.locator('#lens-search-tab-scripture').getAttribute('aria-selected'),'true');await page.keyboard.press('End');assert.equal(await page.locator('#lens-search-tab-evidence').getAttribute('aria-selected'),'true');
    await search('zqxvblorp');assert.equal(await count('scripture'),0);assert.equal(await count('evidence'),0);assert(await page.locator('#lens-search-panel-evidence').getByText('No Evidence Results').isVisible());await page.screenshot({path:`${output}/${name}-${width}-zero.png`});
    await search('mercy');assert((await count('scripture'))>0);assert((await count('evidence'))>0);assert(await page.locator('.lens-search-related').isVisible());
    await page.locator('#lens-search-tab-evidence').click();await switchFromInput('scripture');await switchFromInput('evidence');
    await input.fill('');assert(await page.locator('#lens-search-suggestions').isVisible());await page.locator('[data-search-cancel]').click();await page.waitForFunction(()=>!document.getElementById('lens-search-overlay').open&&location.hash==='#discover');assert.match(page.url(),/#discover$/);await page.waitForTimeout(250);assert(!(await page.locator('#lens-search-overlay').isVisible()));
    await page.locator('#ux-explore-search').fill('John 3:16');await page.locator('#ux-explore-search-form').evaluate(form=>form.requestSubmit());await page.locator('#lens-search-overlay[open]').waitFor();await search('John 3:16');assert.equal(await count('scripture'),1);await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.getElementById('lens-search-overlay').open&&location.hash==='#discover');assert.match(page.url(),/#discover$/);
    await page.locator('#ux-explore-search').fill('John 3:16');await page.locator('#ux-explore-search-form').evaluate(form=>form.requestSubmit());await page.locator('#lens-search-overlay[open]').waitFor();await search('John 3:16');await page.locator('#lens-search-tab-scripture').click();await page.locator('#lens-search-panel-scripture .lens-result').click();await page.locator('#verse-16').waitFor();assert.match(page.url(),/#read\/42\/3\/16/);
    await page.goto(base+'/#questions?mode=history');await page.locator('#debate-results .phase2-debate-card').first().waitFor();
    const checkOrder=async(searchSelector,filterSelector)=>{const nav=page.locator('#debates-view .evidence-section-tabs'),searchBox=page.locator(searchSelector),filters=page.locator(filterSelector);assert(await nav.isVisible());const a=await nav.boundingBox(),b=await searchBox.boundingBox(),c=await filters.boundingBox();assert(a.y+a.height<=b.y+1,'Sections precede search');assert(b.y+b.height<=c.y+1,'Category filters follow search');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));};
    await checkOrder('#debate-search','#debates-view .evidence-category-filters');await page.screenshot({path:`${output}/${name}-${width}-sections.png`});
    const finding=page.locator('#debates-view .evidence-category-filters [data-debate-status]').nth(1);await finding.click();await page.waitForFunction(()=>new URLSearchParams(location.hash.split('?')[1]).has('status'));await page.locator('#debates-view .evidence-category-filters [aria-pressed=true]').waitFor();
    await page.locator('#debates-view [data-debate-mode=translation]').click();await page.waitForFunction(()=>new URLSearchParams(location.hash.split('?')[1]).get('filter')==='T');await page.locator('#debate-results .phase2-debate-card').first().waitFor();assert(!new URLSearchParams(new URL(page.url()).hash.split('?')[1]).has('status'));
    await page.locator('#debates-view [data-evidence-collection=Contradictions]').click();await page.locator('#accepted-search').waitFor();await page.locator('[data-accepted-subject]').first().waitFor();await checkOrder('#accepted-search','#debates-view .directory-categories:not(.evidence-section-tabs)');await page.screenshot({path:`${output}/${name}-${width}-categories.png`});
    await page.goto(base+'/#evidence/T?book=all');await page.locator('#debate-results .phase2-debate-card').first().waitFor();assert.match(page.url(),/#questions\?filter=T$/,'Legacy Translation links retain their canonical destination');await checkOrder('#debate-search','#debates-view .evidence-category-filters');
    await page.goto(base+'/#stories/genesis/cain-and-abel');const story=page.locator('#story-cain-and-abel');await story.locator('.story-summary').waitFor();
    assert.equal(await story.locator('.story-footer,.story-linked-meta').count(),0);assert(await story.locator('.story-actions [data-story-passage]').isVisible());
    assert(await story.evaluate(n=>{const a=n.getBoundingClientRect(),b=n.querySelector('.story-collapse-icon').getBoundingClientRect();return Math.abs(a.x+a.width/2-b.x-b.width/2)<1;}),'407 Story disclosure remains centered');
    assert.deepEqual(errors,[]);assert.deepEqual(apiRequests,[]);results.push({browser:name,width,mobile,status:'PASS'});
   }catch(error){console.error(JSON.stringify({browser:name,width,mobile,url:page.url(),errors,form:await page.locator('#lens-search-form').evaluate(n=>[...n.children].map(e=>({tag:e.tagName,cls:e.className,rect:e.getBoundingClientRect().toJSON(),width:getComputedStyle(e).width,flex:getComputedStyle(e).flex,position:getComputedStyle(e).position}))).catch(()=>[])}));await page.screenshot({path:`${output}/${name}-${width}-failed.png`}).catch(()=>{});throw error;}finally{await context.close();}
  }}finally{await browser.close();}
 }
}finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));fs.writeFileSync(output+'/results.json',JSON.stringify(results,null,2)+'\n');}
if(selectedBrowser!=='all')console.log('NOT RUN: '+(selectedBrowser==='chromium'?'WebKit':'Chromium'));
console.log('PASS: search counts, tabs, caps, zero/mixed/repeated queries, inline Cancel, dismissal, links, responsive columns, Evidence controls and screenshots.',JSON.stringify(results));
