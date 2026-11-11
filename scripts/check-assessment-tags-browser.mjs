import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium,webkit} from 'playwright';
import worker from './built-worker.mjs';

// Test the actual prepared web bundle. --mobile requires the release owner's
// matching build:mobile output and exercises the same check against offline assets.
const mobile=process.argv.includes('--mobile'),sourceStyles=process.argv.includes('--source-styles'),root=path.resolve('www');
if(sourceStyles)console.log('SOURCE STYLE CHECK: built JavaScript with current src/overrides.css, not final packaged CSS.');
const output='.release/assessment-tags'+(mobile?'-mobile':'');fs.mkdirSync(output,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(sourceStyles&&/^\/assets\/(?:app|views|study)\..*\.css$/.test(url.pathname)){
   const response=await worker.fetch(new Request(url,{headers:req.headers}),{},{});
   res.writeHead(200,{'content-type':'text/css'});res.end(await response.text()+'\n'+fs.readFileSync('src/overrides.css','utf8'));return;
  }
  if(mobile){
   const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
   if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
   res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));return;
  }
  if(url.pathname.startsWith('/assets/')&&/\.(webp|png|jpg)$/.test(url.pathname)){
   const file=path.join('src/assets',path.basename(url.pathname));
   if(fs.existsSync(file)){res.writeHead(200,{'content-type':types[path.extname(file)]||'image/png'});res.end(fs.readFileSync(file));return;}
  }
  const response=await worker.fetch(new Request(url,{headers:req.headers}),{},{});
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){if(!res.headersSent)res.writeHead(500);res.end(error.message);}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port,results=[];
const settle=page=>page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
const go=async(page,hash,selector)=>{await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await page.locator(selector).first().waitFor();await settle(page);};
const metrics=async locator=>locator.evaluate(node=>{
 const css=getComputedStyle(node),box=node.getBoundingClientRect();
 return Object.fromEntries(['fontSize','fontWeight','lineHeight','letterSpacing','borderRadius','paddingTop','paddingRight','paddingBottom','paddingLeft','borderTopWidth','borderTopStyle'].map(p=>[p,css[p]]).concat([['height',box.height],['color',css.color],['text',node.textContent],['assessment',node.dataset.assessment]]));
});
const fit=async page=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal page overflow');
async function checkTags(page,reference){
 const tags=page.locator('#debates-view .phase2-verdict[data-assessment]');assert(await tags.count()>0);
 for(let i=0;i<await tags.count();i++){
  const tag=tags.nth(i),actual=await metrics(tag);
  for(const key of ['fontSize','fontWeight','lineHeight','letterSpacing','borderRadius','paddingTop','paddingRight','paddingBottom','paddingLeft','borderTopWidth','borderTopStyle'])assert.equal(actual[key],reference[key],actual.text+': '+key);
  assert.equal(await tag.getAttribute('role'),null,'Labels are not new controls');
  assert(await tag.evaluate(node=>node.scrollWidth<=node.clientWidth+1),'Full label fits its border');
 }
 await fit(page);return tags.count();
}
try{
 for(const [engine,type]of Object.entries({chromium,webkit})){
  const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
  try{for(const width of [320,390,820,1280])for(const theme of ['light','dark']){
   const name=`${engine}-${width}-${theme}`,context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(30000);
   await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
   if(mobile)await context.addInitScript(()=>Object.defineProperty(navigator,'onLine',{get:()=>false}));
   try{
    await page.goto(base+'/#read/0/1');await page.locator('#chapter-text .verse-study-pill').first().waitFor();
    await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);await settle(page);
    const reference=await metrics(page.locator('#chapter-text .verse-study-pill').first());
    await go(page,'#questions','.accepted-questions .phase2-debate-card');
    const acceptedCount=await checkTags(page,reference);
    const cards=page.locator('.accepted-questions .phase2-debate-card');
    assert(await cards.count()>0);assert(!await page.getByText('View details',{exact:true}).count());
    assert(!await page.locator('.accepted-questions .phase2-debate-card .phase2-eyebrow').count(),'No rejected record-type headers');
    if(width===390){
     await page.screenshot({path:`${output}/${name}-accepted.png`,fullPage:false});
     const card=cards.filter({has:page.locator('[data-assessment]')}).first(),href=await card.getAttribute('href');
     await card.locator('.phase2-verdict').first().click();await page.waitForFunction(hash=>location.hash===hash,href);await page.locator('[data-accepted-save]').waitFor();
     await page.goBack();await page.locator('.accepted-questions .phase2-debate-card').first().waitFor();await checkTags(page,reference);
     await page.goForward();await page.locator('[data-accepted-save]').waitFor();await page.goBack();await page.locator('.accepted-questions .phase2-debate-card').first().waitFor();
     await page.locator('[data-accepted-filters]').click();await page.locator('#accepted-question-filters').waitFor({state:'visible'});await page.keyboard.press('Escape');await page.locator('#accepted-question-filters').waitFor({state:'hidden'});await checkTags(page,reference);
    }
    const colors={};
    for(const mode of ['science','history','text']){
     await go(page,'#questions?mode='+mode,'#debate-results .phase2-debate-card');await checkTags(page,reference);
     Object.assign(colors,await page.locator('#debate-results .phase2-verdict').evaluateAll(nodes=>Object.fromEntries(nodes.map(node=>[node.dataset.assessment,getComputedStyle(node).color]))));
    }
    if(colors['not settled']&&colors['interpretation remains open'])assert.notEqual(colors['not settled'],colors['interpretation remains open']);
    if(width===390){
     await page.screenshot({path:`${output}/${name}-records.png`,fullPage:false});
     const card=page.locator('#debate-results .phase2-debate-card').first();await card.locator('.phase2-verdict').click();await page.locator('[data-debate-save]').waitFor();
     await page.goBack();await page.locator('#debate-results .phase2-debate-card').first().waitFor();await checkTags(page,reference);
    }
    if(width===320){await page.evaluate(()=>document.documentElement.style.fontSize='200%');await settle(page);const large=await page.locator('#debate-results .phase2-verdict').first().evaluate(node=>({scroll:node.scrollWidth,client:node.clientWidth,box:node.getBoundingClientRect().toJSON(),html:node.outerHTML,display:getComputedStyle(node).display,whiteSpace:getComputedStyle(node).whiteSpace,overflowWrap:getComputedStyle(node).overflowWrap,font:getComputedStyle(node).font,footer:node.parentElement.getBoundingClientRect().toJSON()}));assert(large.scroll<=large.client+1,'At 200% font scale the assessment itself stays inside its border: '+JSON.stringify(large));}
    assert.deepEqual(errors,[]);results.push({name,status:'PASS',sourceStyles,acceptedCount,reference,colors});fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');console.log('PASS',name);
   }catch(error){await page.screenshot({path:`${output}/${name}-failure.png`}).catch(()=>{});throw error;}
   finally{await context.close();}
  }}finally{await browser.close();}
 }
 console.log('PASS: Chromium/WebKit, phone/tablet/desktop, both themes, exact Read tag metrics, separate verdict colors, wrapped labels, unchanged card actions, repeated navigation, Back/Forward, filter dismissal and 200% label wrapping. Whole-page large-text layout is a separate check.');
}finally{server.close();}
