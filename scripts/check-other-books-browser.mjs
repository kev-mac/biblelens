import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium,webkit} from 'playwright';
// Default: packaged web. --mobile: packaged www UI and its on-device API/engine.
// --source-ui is diagnostic only, never final artifact evidence or a mobile mode.
// BIBLELENS_BUILT_ROOT allows either prepared output to be checked without copying it.
const sourceUI=process.argv.includes('--source-ui'),mobile=process.argv.includes('--mobile');
assert(!(sourceUI&&mobile),'--source-ui is diagnostic only; use --mobile alone for packaged offline verification');
const builtRoot=path.resolve(process.env.BIBLELENS_BUILT_ROOT||'.');
const mobileRoot=path.join(builtRoot,'www'),mobileApiRequests=[];
const worker=mobile?null:(await import(pathToFileURL(path.join(builtRoot,'dist/server/index.js')))).default;
const mode=sourceUI?'source-ui-diagnostic':mobile?'packaged-mobile-offline':'packaged-web';
if(sourceUI)console.log('DIAGNOSTIC SOURCE UI: six edited scripts over an existing build; not final packaged artifact evidence.');
if(mobile)console.log('PACKAGED MOBILE OFFLINE: serving only www; HTTP API requests are rejected.');
const catalog=JSON.parse(fs.readFileSync('data/lost-books/books.json','utf8'));
const uiFiles=new Set(['app.js','atlas-explore.js','lost-books.js','reader.js','workspace-shell.js','workspace.js']);
const servedSources=new Set();
function sourceBody(name){
 let body=fs.readFileSync('src/'+name,'utf8');
 if(name==='atlas-explore.js')body=body.replace('/*__EXPLORE_RENDITIONS__*/{}',JSON.stringify(JSON.parse(fs.readFileSync('src/assets/explore-renditions.json','utf8')).images));
 servedSources.add(name);return body;
}
const output='.release/other-books'+(sourceUI?'-source-ui':mobile?'-mobile':'');fs.mkdirSync(output,{recursive:true});
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(mobile){
   if(url.pathname.startsWith('/api/')){mobileApiRequests.push(url.pathname);res.writeHead(503);res.end('Use on-device API');return;}
   const file=path.resolve(mobileRoot,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
   if(!file.startsWith(mobileRoot+path.sep)){res.writeHead(403);res.end();return;}
   if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
   const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.svg':'image/svg+xml','.wasm':'application/wasm'};
   res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));return;
  }
  if(sourceUI&&uiFiles.has(url.pathname.slice(1))){
   res.writeHead(200,{'content-type':'text/javascript; charset=utf-8'});res.end(sourceBody(url.pathname.slice(1)));return;
  }
  // Use local image originals for transport; no external requests are needed.
  if(url.pathname.startsWith('/assets/')&&/\.(webp|png|jpg)$/.test(url.pathname)){
   const file=path.join('src/assets',path.basename(url.pathname));
   if(fs.existsSync(file)){res.writeHead(200,{'content-type':'image/'+(file.endsWith('.webp')?'webp':file.endsWith('.png')?'png':'jpeg')});res.end(fs.readFileSync(file));return;}
  }
  const response=await worker.fetch(new Request(url,{headers:req.headers}),{},{});
  if(sourceUI&&url.pathname.endsWith('.js')){
   // Startup/study bundles keep their original classic-script boundaries in a JSON array.
   // Replace only the six changed entries, retaining all other packaged scripts and data.
   const body=(await response.text()).replace(/(  const sources = )([^\n]+)(;\n  for \(const \[path, source\] of sources\))/,(_match,before,json,after)=>before+JSON.stringify(JSON.parse(json).map(([name,text])=>[name,uiFiles.has(name.slice(1))?sourceBody(name.slice(1)):text]))+after);
   res.writeHead(response.status,{'content-type':'text/javascript; charset=utf-8'});res.end(body);return;
  }
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){if(!res.headersSent)res.writeHead(500);res.end(error.message);}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port,results=[];
const noOverflow=async(page)=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No page overflow');
try{for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const width of [320,390,1280]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
  await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
  if(mobile)await context.addInitScript(()=>Object.defineProperty(navigator,'onLine',{get:()=>false}));
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/#discover');await page.locator('#ux-topic-lost').waitFor();
  if(mobile){assert.equal(await page.evaluate(()=>navigator.onLine),false);assert.equal(await page.locator('script[src*="device-bootstrap"]').count(),1,'Packaged device API bootstrap is present');}
  assert.match(await page.locator('#ux-topic-lost').innerText(),/Other Books/);
  assert.equal(await page.locator('#ux-topic-lost').getAttribute('href'),'#lost');await noOverflow(page);
  await page.locator('#ux-topic-lost').click();await page.locator('.lost-card').first().waitFor();
  assert.equal(await page.locator('#lost-heading').innerText(),'Other Books');
  await page.waitForFunction(()=>document.title.startsWith('Other Books'));
  assert.equal(await page.locator('#lost-filter').getAttribute('aria-label'),'Filter Other Books');
  assert.equal(await page.locator('#lost-query').getAttribute('aria-label'),'Search Other Books');
  assert.equal(await page.locator('.lost-card').count(),catalog.length);
  assert.deepEqual(await page.locator('#lost-chips button').allTextContents(),['All (20)','Apocrypha (14)','Gnostic (6)']);
  for(const book of catalog){
   const card=page.locator('.lost-card').filter({has:page.getByRole('heading',{name:book.name,exact:true})});
   assert.equal(await card.locator('.story-summary').textContent(),book.description+' '+(book.traditionNote||''));
   assert.equal(await card.locator('.action-link').getAttribute('href'),`#read/${book.id}/1`);
  }
  await page.locator('#lost-filter').click();await page.locator('#lost-filter-sheet[open]').waitFor();
  assert.equal(await page.locator('#lost-filter-heading').innerText(),'Filter Other Books');
  assert.match(await page.locator('#lost-filter-sheet').innerText(),/Apocrypha is also called Deuterocanonical in some traditions\./);
  await page.locator('#lost-filter-sheet [data-lost-collection="Gnostic"]').click();assert.equal(await page.locator('.lost-card').count(),6);
  await page.locator('#lost-filter-sheet [data-lost-collection="All"]').click();
  await page.locator('#lost-filter-sheet').getByRole('button',{name:'Close',exact:true}).click();
  assert.match(page.url(),/#lost$/);await noOverflow(page);
  await page.getByRole('link',{name:'Read Tobit',exact:true}).click();await page.locator('#verse-1').waitFor();
  assert.match(page.url(),/#read\/66\/1$/);
  await page.locator('#ux-chapter-picker').click();await page.locator('#passage-picker[open]').waitFor();
  const other=page.locator('[data-book-testament="lost"]');assert.equal(await other.innerText(),'Other Books');
  await other.click();assert.equal(await page.locator('#passage-book-grid input').count(),catalog.length);
  assert.deepEqual(await page.locator('.lost-picker-heading').allTextContents(),['Apocrypha','Gnostic']);
  assert.deepEqual(await page.locator('#book-select optgroup').evaluateAll(nodes=>nodes.map(node=>node.label)),['Other Books · Apocrypha','Other Books · Gnostic']);
  await page.locator('[data-book-testament="old"]').click();assert.equal(await page.locator('#passage-book-grid input').count(),39);
  await other.click();assert.equal(await page.locator('#passage-book-grid input').count(),20);await noOverflow(page);
  await page.locator('[data-picker-close]').click();assert(!(await page.locator('#passage-picker').isVisible()));
  await page.goBack();await page.locator('.lost-card').first().waitFor();assert.match(page.url(),/#lost$/);
  await page.goForward();await page.locator('#verse-1').waitFor();assert.match(page.url(),/#read\/66\/1$/);
  await page.goto(base+'/#read/80/1/180');await page.locator('#verse-180').waitFor();assert.match(page.url(),/#read\/80\/1\/180$/);
  await page.goto(base+'/#lost');await page.locator('.lost-card').first().waitFor();
  await page.locator('#lost-filter').click();await page.locator('#lost-search-text').click();await page.locator('#lens-search-overlay[open]').waitFor();
  const toggle=page.getByRole('button',{name:'Include Other Books',exact:true});
  assert.equal(await toggle.getAttribute('aria-pressed'),'true');
  await page.locator('#lens-search-input').fill('hidden sayings');
  await page.waitForFunction(()=>document.querySelector('#lens-search-results')?.textContent.includes('Gospel of Thomas'));
  for(let i=0;i<2;i++){
   await toggle.click();await page.waitForFunction(()=>!document.querySelector('#lens-search-results')?.textContent.includes('Gospel of Thomas'));
   assert.equal(await toggle.getAttribute('aria-pressed'),'false');
   await toggle.click();await page.waitForFunction(()=>document.querySelector('#lens-search-results')?.textContent.includes('Gospel of Thomas'));
   assert.equal(await toggle.getAttribute('aria-pressed'),'true');
  }
  await noOverflow(page);
  await page.getByRole('button',{name:'Cancel',exact:true}).click();await page.waitForURL(/#lost$/);await page.locator('.lost-card').first().waitFor();
  assert.match(page.url(),/#lost$/);assert(!(await page.locator('#lens-search-overlay').isVisible()));
  assert(!/Lost Books/i.test(await page.locator('body').innerText()));
  if(width===390)await page.screenshot({path:`${output}/${engine}-390.png`});
  assert.deepEqual(errors,[]);if(mobile)assert.deepEqual(mobileApiRequests,[],'All reading/search API requests stay in the on-device engine');
  results.push({engine,width,mode,...(mobile?{httpApiRequests:mobileApiRequests.length}:{}),status:'PASS'});
  console.log('PASS Other Books',engine,width,mode);await context.close();
 }}finally{await browser.close();}
}}finally{server.close();fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');}
assert.equal(results.length,6);
if(mobile)assert.deepEqual(mobileApiRequests,[],'No late HTTP API requests escaped the on-device engine');
if(sourceUI)assert.deepEqual([...servedSources].sort(),[...uiFiles].sort(),'All six edited scripts were exercised');
console.log('PASS ['+mode+']: Other Books labels, unchanged groups/text/tradition notes, legacy routes, picker, repeated Search toggles, Cancel, and Back/Forward.');
