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
  res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));return;
 }

 // Local originals stand in for hosted image transport. No outbound fallback.
 if(url.pathname.startsWith('/assets/')&&/\.(webp|png|jpg)$/.test(url.pathname)){
 const file=path.join('src/assets',path.basename(url.pathname));
 if(fs.existsSync(file)){res.writeHead(200,{'content-type':'image/'+(file.endsWith('.webp')?'webp':file.endsWith('.png')?'png':'jpeg')});res.end(fs.readFileSync(file));return;}
 }
 const response=await worker.fetch(new Request(url,{headers:req.headers}),{DB:{prepare(){throw Error('Unexpected SQL');}}},{});
 res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(e){res.writeHead(500);res.end(e.message);}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const results=[];
try{for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const width of [320,390,550,820,1440]){
 const context=await browser.newContext({viewport:{width,height:983},reducedMotion:'reduce'});
 await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
 if(mobile)await context.addInitScript(()=>Object.defineProperty(navigator,'onLine',{get:()=>false}));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#stories');await page.locator('#story-cain-and-abel').waitFor();await page.evaluate(()=>document.fonts.ready);
 const card=page.locator('#story-cain-and-abel'),toggle=card.locator('.story-full-details>summary');
 assert.equal(await card.locator('.story-footer,.story-linked-meta').count(),0);
 const preview=await card.locator('.browse-excerpt').innerText();assert(preview.split(/\s+/).length>=24);
 assert(await card.locator('.story-expand-icon').isVisible());assert(!(await card.locator('.story-collapse-icon').isVisible()));
 await toggle.focus();await page.keyboard.press('Enter');assert(await card.locator('.story-summary').isVisible());
 assert(await card.locator('.story-collapse-icon').isVisible());assert(!(await card.locator('.story-expand-icon').isVisible()));
 await card.locator('.story-entities [data-person-id]').first().waitFor();
 await page.keyboard.press('Tab');await card.locator('.story-entities [data-person-id]').first().focus();assert.equal(await card.locator('.story-entities [data-person-id]').first().evaluate(n=>getComputedStyle(n).outlineStyle),'solid');
 assert(await card.locator('.story-actions [data-story-passage]').isVisible());
 const metrics=await card.evaluate(n=>{const s=n.querySelector('summary').getBoundingClientRect(),c=n.getBoundingClientRect(),icon=n.querySelector('.story-collapse-icon').getBoundingClientRect(),p=n.querySelector('.browse-excerpt');return {centerError:Math.abs(icon.x+icon.width/2-c.x-c.width/2),toggleHeight:s.height,excerptHeight:p.clientHeight,excerptScrollHeight:p.scrollHeight,lineHeight:parseFloat(getComputedStyle(p).lineHeight),overflow:document.documentElement.scrollWidth>innerWidth};});
 assert(metrics.excerptScrollHeight<=metrics.excerptHeight+1);assert(metrics.centerError<1);assert(metrics.toggleHeight>=44);assert(!metrics.overflow);
 if(width===550)assert(metrics.excerptHeight/metrics.lineHeight>=3&&metrics.excerptHeight/metrics.lineHeight<=4.1);
 await card.screenshot({path:`${output}/${engine}-${width}-open.png`});
 await toggle.click();assert(!(await card.locator('.story-summary').isVisible()));await card.screenshot({path:`${output}/${engine}-${width}-closed.png`});
 for(let i=0;i<2;i++){await toggle.click();await toggle.click();}assert(!(await card.locator('.story-summary').isVisible()));
 await card.locator('.story-actions [data-story-passage]').click();await page.locator('#verse-1').waitFor();assert.match(page.url(),/#read\/0\/4/);
 await page.goto(base+'/#stories/genesis/cain-and-abel');await page.locator('#story-cain-and-abel details[open]').waitFor();
 assert.deepEqual(errors,[]);assert.deepEqual(mobileApiRequests,[]);results.push({engine,width,...metrics,status:'PASS'});await context.close();
 }}finally{await browser.close();}
}}finally{await new Promise(r=>server.close(r));fs.writeFileSync(output+'/results.json',JSON.stringify(results,null,2));}
console.log('PASS: story card responsive disclosure, links, direct route and screenshots',results.length);
