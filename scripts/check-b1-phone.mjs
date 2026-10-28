import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium,webkit} from 'playwright';

const output=path.resolve('.review/b1');fs.mkdirSync(output,{recursive:true});
const root=path.resolve('www'),types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server=http.createServer((request,response)=>{
 try{
  const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep))throw Error('Invalid path');
  const body=fs.readFileSync(file);response.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});response.end(body);
 }catch{response.writeHead(404);response.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`,results=[];
try{
 for(const [engineName,engine]of [['chromium',chromium],['webkit',webkit]]){
  const browser=await engine.launch({headless:true});
  try{for(const viewport of [{width:390,height:844},{width:430,height:932}])for(const theme of ['light','dark']){
   const context=await browser.newContext({viewport,colorScheme:theme,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
   await page.addInitScript(()=>{window.b1Csp=[];document.addEventListener('securitypolicyviolation',event=>b1Csp.push(event.violatedDirective));});
   await page.goto(base);await page.waitForSelector('.phase2-hero');
   await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);
   const prefix=`${engineName}-${viewport.width}x${viewport.height}-${theme}`;
   async function shot(name){
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForFunction(()=>[...document.querySelectorAll('.phase2-art img')].filter(img=>{const r=img.getBoundingClientRect();return r.height&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;}).every(img=>img.complete&&img.naturalWidth&&img.parentElement.dataset.artState==='ready'));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),viewport.width,`${prefix} ${name}: page overflow`);
    assert.deepEqual(await page.evaluate(()=>b1Csp),[],`${prefix} ${name}: CSP`);
    await page.screenshot({path:path.join(output,`${prefix}-${name}.png`)});
   }
   async function go(hash,selector){await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await page.waitForSelector(selector);await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));}
   assert.equal(await page.locator('.phase2-rail').count(),9);
   await shot('explore');
   for(const rail of ['text','science','history','translation','people','places','stories','commandments','timeline']){
    const collection=page.locator(`[aria-labelledby="rail-${rail}"]`);
    await collection.locator('.phase2-rail-heading').evaluate(node=>node.scrollIntoView({block:'start',behavior:'instant'}));
    await shot(`rail-${rail}`);
    const heading=await collection.locator('h2').boundingBox(),card=await collection.locator('.phase2-rail-card').first().boundingBox(),nav=await page.locator('.lens-primary').boundingBox();
    assert(heading.y>=60&&card.y>heading.y&&card.y+card.height<=nav.y+1,`${prefix} ${rail}: card must fit above navigation`);
    const link=collection.locator('.phase2-rail-heading a');await link.click();
    await page.waitForFunction(()=>!document.querySelector('#main').hasAttribute('aria-busy'));
    assert.notEqual(await page.evaluate(()=>view),'explore',`${rail}: collection opens`);
    await go('#discover','.phase2-hero');
   }
   await go('#debates?mode=history','#debate-results .phase2-debate-card');await shot('history');
   for(const button of await page.locator('.phase2-chips button').all()){
    const sizes=await button.evaluate(node=>({height:node.getBoundingClientRect().height,width:node.getBoundingClientRect().width,scroll:node.scrollWidth,client:node.clientWidth}));
    assert(sizes.height>=44&&sizes.width>=44&&sizes.scroll<=sizes.client,'History filter target/label');
   }
   await page.locator('#debate-results .phase2-debate-card').first().click();await page.waitForSelector('.phase2-sides:not([aria-busy])');await shot('history-detail');
   await go('#people','#characters-view .character-card');await shot('people');
   await go('#timeline','#timeline-reviewed .timeline-event-card');await shot('timeline');
   const historyChip=page.locator('#timeline-reviewed .timeline-history').first();await historyChip.click();assert.equal(await historyChip.getAttribute('aria-expanded'),'true');await shot('timeline-evidence');
   assert.equal(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),true);
   assert.deepEqual(errors,[],`${prefix}: JavaScript errors`);results.push({engine:engineName,...viewport,theme,reducedMotion:true,screenshots:15,status:'PASS'});
   await context.close();
  }}finally{await browser.close();}
 }
 fs.writeFileSync(path.join(output,'phone-results.json'),JSON.stringify(results,null,2)+'\n');
 console.log('PASS: all nine Explore rails, History, People and Timeline; Chromium/WebKit; 390×844/430×932; light/dark and reduced motion; navigation, CSP, crop, labels and page overflow.');
}finally{await new Promise(resolve=>server.close(resolve));}
