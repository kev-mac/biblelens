import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium,webkit} from 'playwright';
const worker=(await import('../dist/server/index.js')).default;
const mobile=process.argv.includes('--mobile'),mobileRoot=path.resolve('www'),mobileApiRequests=[];
const output='.release/approved-ui-12-14'+(mobile?'-mobile':'');fs.mkdirSync(output,{recursive:true});
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
const results=[];
const sizes=[[320,844],[390,844],[820,1180],[844,390],[1440,1000]];
const settle=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
async function assertSheet(page,verse){
 await settle(page);
 const metrics=await page.evaluate(verse=>{
  const sheet=document.querySelector('#ux-empty-verse-actions'),nav=document.querySelector('nav.lens-primary'),row=document.querySelector('#verse-'+verse);
  const s=sheet.getBoundingClientRect(),n=nav.getBoundingClientRect(),v=row.getBoundingClientRect();
  const top=Math.max(document.querySelector('#lensMasthead').getBoundingClientRect().bottom,document.querySelector('#lensReadingBar').getBoundingClientRect().bottom)+12;
  return {visible:!sheet.hidden,docked:sheet.dataset.docked==='true',sheet:{top:s.top,bottom:s.bottom,left:s.left,right:s.right,height:s.height},navTop:n.top,verse:{top:v.top,bottom:v.bottom,height:v.height},top,background:getComputedStyle(sheet).backgroundColor,overflow:document.documentElement.scrollWidth>innerWidth,available:s.top-12-top};
 },verse);
 assert(metrics.visible,JSON.stringify(metrics));assert(!metrics.overflow);
 assert(!/rgba\(.*,[\s]*0(?:\.|\))/.test(metrics.background),'Sheet must be opaque: '+metrics.background);
 if(metrics.docked){assert(Math.abs(metrics.sheet.bottom-metrics.navTop)<1,JSON.stringify(metrics));assert.equal(metrics.sheet.left,0);}
 assert(metrics.verse.top>=metrics.top-1,JSON.stringify(metrics));
 if(metrics.verse.height<=metrics.available+1)assert(metrics.verse.bottom<=metrics.sheet.top-11,JSON.stringify(metrics));
 else assert(metrics.verse.top<metrics.sheet.top-12,'At least the start of an unusually long verse stays visible');
 assert(await page.locator('#verse-'+verse).evaluate(n=>n.classList.contains('lens-active-verse')));
 return metrics;
}
try{for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const [width,height]of sizes)for(const theme of ['light','dark']){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce',serviceWorkers:'block'});
 await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
 await context.addInitScript(()=>{
  Object.defineProperty(navigator,'onLine',{get:()=>false});
  Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.__copiedVerse=text;}}});
 });
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#read/0/1');await page.locator('#verse-31').waitFor();
 await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));
 const sheet=page.locator('#ux-empty-verse-actions');
 // First, middle and final verse, including one initially close to the bottom.
 for(const verse of [1,6,31]){
  await page.locator('#verse-'+verse+' .verse-num').click();
  await sheet.waitFor({state:'visible'});await assertSheet(page,verse);
  await page.waitForTimeout(100);assert(await sheet.isVisible(),'Programmatic positioning must not trigger scroll-dismissal');
  await sheet.getByRole('button',{name:'Close verse actions'}).click();assert(await sheet.isHidden());
  assert(await page.locator('#verse-'+verse+' .verse-num').evaluate(n=>n===document.activeElement));
 }
 // All four actions retain their existing behavior.
 await page.locator('#verse-6 .verse-num').click();await assertSheet(page,6);
 await sheet.locator('[data-context-bookmark]').click();assert(await page.evaluate(()=>!!state.verseBookmarks['0:1:6']));await assertSheet(page,6);
 await sheet.locator('[data-context-copy]').click();assert.match(await page.evaluate(()=>window.__copiedVerse),/^Genesis 1:6 /);
 await sheet.locator('[data-context-compare]').click();await page.locator('#lensComparison:not([hidden])').waitFor();assert(await sheet.isHidden());assert.equal(await page.locator('#lens-compare-left').inputValue(),'Genesis 1:6');
 await page.keyboard.press('Escape');await page.locator('#lens-inspector-sheet').waitFor({state:'hidden'});
 await page.locator('#verse-6 .verse-num').click();await sheet.locator('[data-context-note]').click();await page.locator('#lens-margin-note').waitFor({state:'visible'});assert(await sheet.isHidden());await page.keyboard.press('Escape');
 await page.locator('#verse-6 .verse-num').click();await sheet.locator('[data-context-evidence]').click();await page.locator('#lens-inspector-sheet[open]').waitFor();assert(await sheet.isHidden());await page.keyboard.press('Escape');
 // Repeated keyboard selection and dismissal, intentional scroll dismissal.
 for(let i=0;i<2;i++){
  await page.locator('#verse-6 .verse-num').focus();await page.keyboard.press('Enter');await assertSheet(page,6);await page.keyboard.press('Escape');assert(await sheet.isHidden());
 }
 await page.locator('#verse-6 .verse-num').click();await assertSheet(page,6);await page.evaluate(()=>scrollBy({top:100,behavior:'instant'}));await sheet.waitFor({state:'hidden'});
 await page.locator('#verse-6 .verse-num').click();await assertSheet(page,6);
 if(width===390){
  await page.setViewportSize({width:844,height:390});await settle(page);await assertSheet(page,6);
  await page.setViewportSize({width,height});await settle(page);await assertSheet(page,6);
 }
 await page.screenshot({path:`${output}/${engine}-${width}x${height}-${theme}-verse.png`});
 await page.evaluate(()=>BibleLensWorkspace.navigate('#discover'));await sheet.waitFor({state:'hidden'});await page.goBack();await page.locator('#verse-6').waitFor();assert(await sheet.isHidden());await page.goForward();await page.locator('#ux-explore-search').waitFor();assert(await sheet.isHidden());
 // Full image visible; duplicate thumbnail hidden only on desktop.
 await page.goto(base+'/#stories/genesis/cain-and-abel');const card=page.locator('#story-cain-and-abel');await card.locator('.story-full-details[open]').waitFor();
 await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);
 const stage=card.locator('.story-video-stage');await stage.locator('img').waitFor();
 await stage.locator('img').evaluate(img=>img.decode());
 assert.equal(await card.locator('.story-illustration-preview').isVisible(),width<1000);
 const media=await stage.evaluate(n=>{const box=n.getBoundingClientRect();return{width:box.width,height:box.height,fit:getComputedStyle(n.querySelector('img')).objectFit};});
 if(width>=1000){assert(media.height<=360.1);assert(media.width<=640.1);assert.equal(media.fit,'contain');}
 assert(await card.locator('.story-collapse-icon').isVisible());assert.equal((await card.locator('.story-full-details>summary').innerText()).trim(),'');
 assert(await card.locator('.story-summary').evaluate(n=>n.scrollHeight<=n.clientHeight+1),'Full text is not clipped');
 await card.screenshot({path:`${output}/${engine}-${width}x${height}-${theme}-story.png`});
 for(let i=0;i<2;i++){
  await card.locator('.story-full-details>summary').click();assert(await card.locator('.story-illustration-preview').isVisible());assert(await card.locator('.story-summary').isHidden());
  await card.locator('.story-full-details>summary').focus();await page.keyboard.press('Enter');assert.equal(await card.locator('.story-illustration-preview').isVisible(),width<1000);
 }
 // The same desktop cap applies to stories with no video and topic pivots.
 await page.evaluate(async()=>{const catalog=await loadStories();const story=catalog.flatMap(g=>g.stories).find(s=>s.title==='Cain and Abel');await openStoryTopic(story.topics[0],'');});
 const pivot=page.locator('#topic-story-cain-and-abel');await pivot.waitFor();await pivot.locator('.story-full-details>summary').click();
 assert.equal(await pivot.locator('.story-illustration-preview').isVisible(),width<1000);
 if(width>=1000){const image=pivot.locator('.story-illustration-summary>img');await image.evaluate(img=>img.decode());assert((await image.boundingBox()).height<=360.1);assert.equal(await image.evaluate(n=>getComputedStyle(n).objectFit),'contain');}
 assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)));
 assert.deepEqual(errors,[]);assert.deepEqual(mobileApiRequests,[]);results.push({engine,width,height,theme,media,status:'PASS'});console.log('PASS',engine,width,height,theme);await context.close();
 }}finally{await browser.close();}
}}finally{await new Promise(r=>server.close(r));fs.writeFileSync(output+'/results.json',JSON.stringify(results,null,2));}
console.log('PASS: approved verse action sheet and expanded desktop media',results.length);
