import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium,webkit} from 'playwright';
const worker=(await import('../dist/server/index.js')).default;
const mobile=process.argv.includes('--mobile'),mobileRoot=path.resolve('www'),mobileApiRequests=[];
const output='.release/story-cards'+(mobile?'-mobile':'');fs.mkdirSync(output,{recursive:true});
const server=http.createServer(async(req,res)=>{
 try{
 const url=new URL(req.url,'http://127.0.0.1');
 if(mobile){
  if(url.pathname.startsWith('/api/')){mobileApiRequests.push(url.pathname);res.writeHead(503);res.end('Use on-device API');return;}
  const file=path.resolve(mobileRoot,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
  if(!file.startsWith(mobileRoot+path.sep)){res.writeHead(403);res.end();return;}
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.woff2':'font/woff2','.svg':'image/svg+xml'};
  if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}
  const contents=fs.readFileSync(file);res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});res.end(contents);return;
 }

 // Local originals stand in for hosted image transport. No outbound fallback.
 if(url.pathname.startsWith('/assets/')&&/\.(webp|png|jpg)$/.test(url.pathname)){
 const file=path.join('src/assets',path.basename(url.pathname));
 if(fs.existsSync(file)){res.writeHead(200,{'content-type':'image/'+(file.endsWith('.webp')?'webp':file.endsWith('.png')?'png':'jpeg')});res.end(fs.readFileSync(file));return;}
 }
 const response=await worker.fetch(new Request(url,{headers:req.headers}),{DB:{prepare(){throw Error('Unexpected SQL');}}},{});
 res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(e){if(!res.headersSent)res.writeHead(500);res.end(e.message);}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
async function assertReadAction(page,card,expanded){
 const action=card.locator('.action-link[data-story-passage]');
 assert.equal(await action.count(),1);
 assert.equal(await action.isVisible(),expanded,'Read story visibility follows disclosure');
 assert.equal(await card.getByRole('button',{name:/^Read /}).count()>0,expanded,'Collapsed Read story is absent from accessibility tree');
 assert.equal(await action.evaluate(n=>!!n.closest('.story-full-details')),true);
 if(!expanded){
  const summary=card.locator('.story-full-details>summary');
  await summary.focus();await action.evaluate(n=>n.focus());
  assert(!(await action.evaluate(n=>n===document.activeElement)),'Collapsed Read story cannot receive focus');
  await page.keyboard.press('Tab');
  assert(!(await action.evaluate(n=>n===document.activeElement)),'Tab skips collapsed Read story');
 }
 assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)),'No horizontal overflow');
}
const results=[];
try{for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const width of [320,390,550,820,1440]){
 const context=await browser.newContext({viewport:{width,height:983},reducedMotion:'reduce',serviceWorkers:'block'});
 await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
 if(mobile)await context.addInitScript(()=>Object.defineProperty(navigator,'onLine',{get:()=>false}));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#stories');await page.locator('#story-cain-and-abel').waitFor();await page.evaluate(()=>document.fonts.ready);
 const card=page.locator('#story-cain-and-abel'),toggle=card.locator('.story-full-details>summary');
 assert.equal(await card.locator('.story-footer,.story-linked-meta').count(),0);
 const preview=await card.locator('.browse-excerpt').innerText();assert(preview.split(/\s+/).length>=24);
 await assertReadAction(page,card,false);
 assert(await card.locator('.story-expand-icon').isVisible());assert(!(await card.locator('.story-collapse-icon').isVisible()));
 await toggle.focus();await page.keyboard.press('Enter');assert(await card.locator('.story-summary').isVisible());
 await assertReadAction(page,card,true);
 assert(await card.locator('.story-collapse-icon').isVisible());assert(!(await card.locator('.story-expand-icon').isVisible()));
 assert.equal(await card.locator('.story-entities').count(),0,'No people/place summary footer');
 const paragraphs=await card.locator('.story-summary>p').evaluateAll(nodes=>nodes.map(n=>({top:n.getBoundingClientRect().top,bottom:n.getBoundingClientRect().bottom,font:parseFloat(getComputedStyle(n).fontSize)})));
 assert(paragraphs.length>1,'Cain has distinct narrative paragraphs');
 for(let i=1;i<paragraphs.length;i++)assert(paragraphs[i].top-paragraphs[i-1].bottom>=paragraphs[i].font-1,'Visible blank space between narrative paragraphs');
 assert(await card.locator('.story-actions [data-story-passage]').isVisible());
 const metrics=await card.evaluate(n=>{const s=n.querySelector('summary').getBoundingClientRect(),c=n.getBoundingClientRect(),icon=n.querySelector('.story-collapse-icon').getBoundingClientRect(),p=n.querySelector('.browse-excerpt');return {centerError:Math.abs(icon.x+icon.width/2-c.x-c.width/2),toggleHeight:s.height,excerptHeight:p.clientHeight,excerptScrollHeight:p.scrollHeight,lineHeight:parseFloat(getComputedStyle(p).lineHeight),overflow:document.documentElement.scrollWidth>innerWidth};});
 assert(metrics.excerptScrollHeight<=metrics.excerptHeight+1);assert(metrics.centerError<1);assert(metrics.toggleHeight>=44);assert(!metrics.overflow);
 if(width===550)assert(metrics.excerptHeight/metrics.lineHeight>=3&&metrics.excerptHeight/metrics.lineHeight<=4.1);
 await card.screenshot({path:`${output}/${engine}-${width}-open.png`});
 await toggle.click();await assertReadAction(page,card,false);assert(!(await card.locator('.story-summary').isVisible()));await card.screenshot({path:`${output}/${engine}-${width}-closed.png`});
 for(let i=0;i<2;i++){await toggle.focus();await page.keyboard.press('Space');await assertReadAction(page,card,true);await toggle.focus();await page.keyboard.press('Enter');await assertReadAction(page,card,false);}
 await toggle.click();await assertReadAction(page,card,true);
 await card.locator('.story-actions [data-story-passage]').click();await page.locator('#verse-1').waitFor();assert.match(page.url(),/#read\/0\/4/);
 await page.goto(base+'/#stories/genesis/cain-and-abel');await page.locator('#story-cain-and-abel details[open]').waitFor();await assertReadAction(page,card,true);
 await toggle.click();await assertReadAction(page,card,false);await toggle.click();await assertReadAction(page,card,true);
 // Topic results use the same renderer but stay collapsed even on a direct route.
 await page.evaluate(async()=>{const catalog=await loadStories();const story=catalog.flatMap(g=>g.stories).find(s=>s.title==='Cain and Abel');await openStoryTopic(story.topics[0],'');});
 const pivot=page.locator('#topic-story-cain-and-abel'),pivotToggle=pivot.locator('.story-full-details>summary');
 await pivot.waitFor();await assertReadAction(page,pivot,false);
 await pivotToggle.focus();await page.keyboard.press('Enter');await assertReadAction(page,pivot,true);
 await pivotToggle.click();await assertReadAction(page,pivot,false);await pivotToggle.click();await assertReadAction(page,pivot,true);
 await pivot.locator('.action-link[data-story-passage]').click();await page.locator('#verse-1').waitFor();assert.match(page.url(),/#read\/0\/4/);
 assert(!(await page.locator('#story-topic-sheet').evaluate(n=>n.open)));
 // Supplemental multi-passage cards obey the same disclosure and nested controls.
 await page.goto(base+'/#stories/jeremiah/new-covenant');
 const covenant=page.locator('#story-new-covenant');await covenant.locator('.story-full-details[open]').waitFor();
 await assertReadAction(page,covenant,true);
 await covenant.locator('.story-passages>summary').click();
 assert(await covenant.locator('.story-passages [data-story-passage]').first().isVisible());
 await covenant.locator('.story-full-details>summary').click();await assertReadAction(page,covenant,false);
 assert(!(await covenant.locator('.story-passages [data-story-passage]').first().isVisible()));
 await covenant.locator('.story-full-details>summary').click();await assertReadAction(page,covenant,true);
 // Exercise the actual 500-word ceiling even if no authored story needs all of it.
 await page.evaluate(()=>{const template=storiesCatalog.flatMap(g=>g.stories)[0];document.getElementById('stories-list').insertAdjacentHTML('beforeend',storyCard({...template,title:'Maximum length layout fixture',summary:Array(499).fill('Narrative').join(' ')+' ending.'},true));});
 const maximum=page.locator('#topic-story-maximum-length-layout-fixture');await assertReadAction(page,maximum,false);
 await maximum.locator('.story-full-details>summary').click();await assertReadAction(page,maximum,true);
 const fullText=maximum.locator('.story-summary');assert((await fullText.innerText()).endsWith('ending.'));
 assert(await fullText.evaluate(n=>n.scrollHeight<=n.clientHeight+1),'500-word summary is not clipped');
 await maximum.locator('.action-link[data-story-passage]').scrollIntoViewIfNeeded();assert(await maximum.locator('.action-link[data-story-passage]').isVisible());
 assert.deepEqual(errors,[]);assert.deepEqual(mobileApiRequests,[]);results.push({engine,width,...metrics,status:'PASS'});await context.close();
 }}finally{await browser.close();}
}}finally{await new Promise(r=>server.close(r));fs.writeFileSync(output+'/results.json',JSON.stringify(results,null,2));}
console.log('PASS: story card responsive disclosure, links, direct route and screenshots',results.length);
