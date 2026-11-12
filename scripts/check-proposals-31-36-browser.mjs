import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium,webkit} from 'playwright';
const worker=(await import('../dist/server/index.js')).default;
const mobile=process.argv.includes('--mobile'),mobileRoot=path.resolve('www'),mobileApiRequests=[];
const output='.release/proposals-31-36'+(mobile?'-mobile':'');fs.mkdirSync(output,{recursive:true});
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
try{for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();try{for(const width of [390,1024]){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
 await context.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 const page=await context.newPage();await page.goto(base+'/#discover');
 await page.locator('[data-explore-quick="plans"]').waitFor();assert.equal(await page.locator('.explore-quick-actions svg').count(),3);
 await page.locator('[data-explore-quick="plans"]').click();const plan=page.locator('[data-plan-progress="0"]');const done=plan.locator('input').first();
 assert.equal(await plan.locator('[data-plan-status]').innerText(),'0 of 3 readings completed');await done.focus();await done.press("Space");assert.equal(await plan.locator('progress').getAttribute('value'),'1');assert.equal(await plan.locator('[data-plan-status]').innerText(),'1 of 3 readings completed');assert(await done.evaluate(n=>document.activeElement===n),'checking progress keeps keyboard focus');
 await page.screenshot({path:output+'/plans-'+engine+'-'+width+'.png'});await page.keyboard.press('Escape');await page.locator('[data-explore-quick="plans"]').click();assert(await done.isChecked());await done.uncheck();assert.equal(await plan.locator('progress').getAttribute('value'),'0');await page.keyboard.press('Escape');
 await page.reload();await page.locator('[data-explore-quick="plans"]').click();assert(!(await done.isChecked()));await page.keyboard.press('Escape');
 await page.goto(base+'/#chat');await page.locator('.chat-starter-grid button').first().waitFor();const prompt=page.locator('.chat-starter-grid button').first();assert.equal(await prompt.evaluate(n=>getComputedStyle(n).paddingTop),'20px');assert.equal(await prompt.evaluate(n=>getComputedStyle(n).textAlign),'center');assert.equal(await page.locator('.chat-starter-grid').evaluate(n=>getComputedStyle(n).gap),'16px');await page.screenshot({path:output+'/chat-'+engine+'-'+width+'.png'});
 for(const [route,selector] of [['people','.characters-count'],['places','#places-count'],['commandments','#commandments-count']]){await page.goto(base+'/#'+route);const count=page.locator(selector);await count.waitFor();await page.waitForFunction(s=>document.querySelector(s)?.closest('.list-meta-row'),selector);assert.equal(await count.evaluate(n=>getComputedStyle(n).position),'static');assert.match(await count.innerText(),/Showing/);await page.screenshot({path:output+'/'+route+'-'+engine+'-'+width+'.png'});assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)),'no overflow');}
 for(const route of ['prophecies','prophecies/test','evidence/prophecies']){await page.goto(base+'/#'+route);await page.waitForTimeout(300);assert(!await page.locator('#prophecies-view').count());assert.match(await page.evaluate(()=>location.hash),/^#discover/);}
 results.push({engine,width});await context.close();}}finally{await browser.close();}
}}finally{server.close();}console.log('PASS proposals 31–33/36 and removed Prophecies',JSON.stringify(results));


