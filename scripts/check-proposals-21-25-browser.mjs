import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium,webkit} from 'playwright';
const worker=(await import('../dist/server/index.js')).default;
const mobile=process.argv.includes('--mobile'),mobileRoot=path.resolve('www'),mobileApiRequests=[];
const output='.release/proposals-21-25'+(mobile?'-mobile':'');fs.mkdirSync(output,{recursive:true});
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
try {for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const width of [320,390,820,1440]){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
 await context.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 if(mobile)await context.addInitScript(()=>Object.defineProperty(navigator,'onLine',{get:()=>false}));
 const page=await context.newPage();
 await page.goto(base+'/#lost');await page.locator('[data-lost-source]').first().click();
 const dialog=page.locator('#lost-source-sheet');await dialog.waitFor();await page.waitForTimeout(350);
 assert.equal(await dialog.locator('.lost-source-actions a').count(),4);
 for(const a of await dialog.locator('.lost-source-actions a').all()){assert.equal(await a.evaluate(n=>getComputedStyle(n).textAlign),'center');assert(!/[→↗›]/.test(await a.innerText()));assert.equal(await a.getAttribute('target'),'_blank');}
 const box=await dialog.boundingBox();if(width>=768){assert(Math.abs(box.y+box.height/2-450)<2,'desktop dialog centered');assert(box.height<700,'desktop dialog fits content');}else assert(Math.abs(box.y+box.height-900)<2,'mobile bottom sheet');
 await page.screenshot({path:output+'/proposals-source-'+engine+'-'+width+'.png'});
 await page.keyboard.press('Escape');assert(!(await dialog.isVisible()));await page.waitForTimeout(400);
 await page.locator('[data-lost-source]').first().click();await dialog.waitFor();await page.waitForTimeout(350);await dialog.locator('button:visible').last().click();assert(!(await dialog.isVisible()));await page.waitForTimeout(400);
 await page.goto(base+'/#commandments');await page.locator('.commandment-code-help').first().waitFor();assert.match(await page.locator('.commandment-card').first().innerText(),/linked New Testament texts?/);
 await page.screenshot({path:output+'/proposals-laws-'+engine+'-'+width+'.png'});
 await page.goto(base+'/#people');const card=page.locator('.ux-contact').first();await card.waitFor();const save=card.locator('.directory-save');assert.equal(await save.innerText(),'Save');await save.click();assert.equal(await save.innerText(),'Saved');await save.click();assert.equal(await save.innerText(),'Save');
 const action=card.locator('.person-profile-action');assert.equal(await action.innerText(),'View full profile');assert.equal(await action.evaluate(n=>getComputedStyle(n).textAlign),'center');
 await action.scrollIntoViewIfNeeded();await page.screenshot({path:output+'/proposals-person-'+engine+'-'+width+'.png'});
 await action.click();await page.waitForTimeout(200);assert.match(await page.evaluate(()=>location.hash),/^#characters\//);
 await page.goto(base+'/#places');await page.locator('.place-profile-card').first().waitFor();const place=page.locator('.place-profile-card').first();await place.locator('button[aria-expanded]').click();
 const mapAction=place.locator('.place-open-map');await mapAction.waitFor();assert.equal(await mapAction.innerText(),'Open map');assert.equal(await mapAction.evaluate(n=>getComputedStyle(n).textAlign),'center');assert.match(await mapAction.getAttribute('href'),/^https:\/\/www.openstreetmap.org\//);assert.match(await place.locator('.place-inline-map figcaption').innerText(),/uncertain/);
 await mapAction.scrollIntoViewIfNeeded();await page.screenshot({path:output+'/proposals-map-'+engine+'-'+width+'.png'});
 await place.locator('button[aria-expanded]').click();assert(!(await mapAction.isVisible()));
 assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)),'no horizontal overflow');
 results.push({engine,width,mobile});await context.close();
 }}finally{await browser.close();}
}}finally{server.close();}
console.log('PASS proposals 21–25',JSON.stringify(results));
