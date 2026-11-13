import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium,webkit} from 'playwright';
const worker=(await import('../dist/server/index.js')).default;
const mobile=process.argv.includes('--mobile'),mobileRoot=path.resolve('www'),mobileApiRequests=[];
const output='.release/annotation-polish'+(mobile?'-mobile':'');fs.mkdirSync(output,{recursive:true});
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
 const page=await context.newPage();await page.goto(base+'/#discover');await page.locator('#ux-topic-commandments').waitFor();
 assert.equal(await page.locator('#ux-topic-commandments strong').innerText(),'Commandments');
 assert.equal(await page.locator('.ux-browse,.explore-quick-actions').count(),0);
 for(const dark of [false,true]){
 await page.evaluate(dark=>document.body.classList.toggle('dark',dark),dark);
 const color=await page.locator('#explore-view').evaluate(n=>getComputedStyle(n).color);
 assert.equal(color,dark?'rgb(248, 250, 252)':'rgb(23, 32, 51)');
 assert.equal(await page.locator('footer a[href="#method"]').evaluate(n=>parseFloat(getComputedStyle(n).fontSize))<12,true);
 await page.screenshot({path:output+'/explore-'+engine+'-'+width+'-'+(dark?'dark':'light')+'.png',fullPage:true});
 }
 await page.goto(base+'/#commandments');await page.locator('.commandment-card').first().waitFor();
 assert.equal(await page.locator('.commandment-code-help').count(),0);
 assert.equal(await page.getByText('0 linked New Testament texts',{exact:true}).count(),0);
 const first=page.locator('.commandment-card').first();
 assert.equal(await first.locator('.commandment-tags .commandment-number').innerText(),'P1 · Positive');
 assert.equal(await first.locator('.commandment-tags .commandment-topic').first().innerText(),'Worship');assert.equal(await first.locator('.commandment-number').evaluate(n=>getComputedStyle(n).borderTopWidth),'1px');
 await first.getByRole('button',{name:'View Text',exact:true}).click();await first.locator('.commandment-context q').first().waitFor();
 await page.screenshot({path:output+'/commandments-'+engine+'-'+width+'.png'});
 await page.goto(base+'/#people');await page.locator('.ux-contact').first().waitFor();assert.equal(await page.getByText('View full profile',{exact:true}).count(),0);
 await page.goto(base+'/#read/0/1/4');await page.locator('#verse-4 .verse-membership-tag[data-membership=story]').waitFor();
 assert.match(await page.locator('#verse-4 .verse-membership-tag[data-membership=story]').innerText(),/Creation/i);
 assert.equal(await page.locator('#lens-focus .ux-evidence-label').innerText(),'TAGGING');
 await page.screenshot({path:output+'/reader-'+engine+'-'+width+'.png'});
 await page.goto(base+'/#read/1/20/2');await page.locator('#verse-2 .verse-membership-tag[data-membership=commandment]').waitFor();assert.equal(await page.locator('#verse-2 .verse-membership-tag[data-membership=commandment]').innerText(),'COMMANDMENT');
 assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)),'no overflow');
 results.push({engine,width});await context.close();}}finally{await browser.close();}
}}finally{server.close();}console.log('PASS annotation polish',JSON.stringify(results));
