import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium,webkit} from 'playwright';
import {debatePage,groupEvidenceDisplay,compareEvidenceReferences} from '../worker/debates.mjs';
import {releaseContent} from './rc1-content.mjs';

// Web: BIBLELENS_PREVIEW_URL must point to the approved prepared app.
// --mobile: serve only the actual www package and exercise its offline engine.
// Source overlay is a separate no-build diagnostic, never native/package QA.
const mobile=process.argv.includes('--mobile'),sourceOverlay=process.env.BIBLELENS_SOURCE_OVERLAY==='1';
if(mobile&&sourceOverlay)throw Error('--mobile cannot use BIBLELENS_SOURCE_OVERLAY. Test the actual www package without API or asset overlays.');
const mobileRoot=path.resolve('www'),mobileApiRequests=[];
let base=process.env.BIBLELENS_PREVIEW_URL,server;
if(mobile){
 if(!fs.existsSync(path.join(mobileRoot,'index.html'))||!fs.existsSync(path.join(mobileRoot,'device-bootstrap.js')))throw Error('--mobile requires the release owner’s prepared www package. This test never builds it.');
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.woff2':'font/woff2','.svg':'image/svg+xml'};
 server=http.createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,'http://127.0.0.1');
   if(url.pathname.startsWith('/api/')){mobileApiRequests.push(url.pathname);res.writeHead(503);res.end('Use on-device API');return;}
   const file=path.resolve(mobileRoot,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
   if(!file.startsWith(mobileRoot+path.sep)){res.writeHead(403);res.end();return;}
   if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
   res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));
  }catch(error){if(!res.headersSent)res.writeHead(500);res.end(error.message);}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 base='http://127.0.0.1:'+server.address().port;
}else if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to an approved web preview, or use --mobile for the prepared www package.');
const records=JSON.parse(releaseContent('data/evidence.json'));
const groups=groupEvidenceDisplay([...records].sort(compareEvidenceReferences)).filter(group=>group.key);
const output='.release/evidence-display-groups'+(mobile?'-mobile':sourceOverlay?'-source':'');fs.mkdirSync(output,{recursive:true});
const results=[];
const settle=page=>page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
const ready=page=>page.waitForFunction(()=>document.querySelector('#debates-view:not([hidden]) #debate-count')?.textContent.startsWith('Showing'));
const go=async(page,hash)=>{await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await ready(page);await settle(page);};
const selection=group=>{const params=new URLSearchParams({mode:group.key.startsWith('genesis')?'history':'text'});for(const id of group.recordIds)params.append('id',id);return '#questions?'+params;};
const fit=async page=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page fits viewport');
async function overlay(route){
 const url=new URL(route.request().url());
 if(url.pathname==='/api/debates'){await route.fulfill({json:debatePage(records,url.searchParams)});return;}
 if(/^\/assets\/(?:app|debates)\..*\.js$/.test(url.pathname)){
  const response=await route.fetch();let body=await response.text();
  body=body.replace(/  const sources = (.+);\n  for/,(_whole,json)=>{
   const sources=JSON.parse(json).map(([name,body])=>[name,name==='/debate-ui.js'?fs.readFileSync('src/debate-ui.js','utf8'):name==='/debates.js'?fs.readFileSync('src/accepted-questions.js','utf8')+'\n'+fs.readFileSync('src/debates.js','utf8'):body]);
   return '  const sources = '+JSON.stringify(sources)+';\n  for';
  });
  await route.fulfill({response,body});return;
 }
 if(/^\/assets\/(?:app|views|study)\..*\.css$/.test(url.pathname)){
  const response=await route.fetch();await route.fulfill({response,body:await response.text()+'\n'+fs.readFileSync('src/overrides.css','utf8')});return;
 }
 await route.continue();
}
if(sourceOverlay)console.log('SOURCE OVERLAY: current Evidence JavaScript/API/styles over prepared app; packaged QA still required.');
try{for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
 try{for(const width of [320,390,820,1280])for(const theme of ['light','dark']){
  const name=`${engine}-${width}-${theme}`,context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.setDefaultTimeout(20000);page.on('pageerror',error=>errors.push(error.message));
  await context.route('**/*',route=>new URL(route.request().url()).origin!==base?route.abort():sourceOverlay?overlay(route):route.continue());
  if(mobile)await context.addInitScript(()=>Object.defineProperty(navigator,'onLine',{get:()=>false}));
  try{
   await page.goto(base+'/'+selection(groups[0]));await ready(page);
   if(mobile)assert.equal(await page.evaluate(()=>navigator.onLine),false,'Native QA runs offline');
   const release=await page.evaluate(async()=>{const response=await fetch('/release.json');if(!response.ok)throw Error('Prepared release identity is unavailable');return response.json();});
   await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);
   for(const group of groups){
    const hash=selection(group);await go(page,hash);
    const tile=page.locator(`[data-evidence-group="${group.key}"]`);
    assert.equal(await tile.count(),1);assert.equal(await page.locator('#debate-results>.phase2-debate-card').count(),1,'One display result');
    assert.equal(await page.locator('#debate-count').innerText(),`Showing 1–1 of 1 result · ${group.recordIds.length} records`);
    const links=tile.locator('.evidence-group-members a');
    assert.deepEqual(await links.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href'))),group.recordIds.map(id=>'#debate/'+id));
    const geometry=await links.evaluateAll(nodes=>nodes.map(node=>({box:node.getBoundingClientRect().toJSON(),parent:node.closest('article').getBoundingClientRect().toJSON(),scroll:node.scrollWidth,client:node.clientWidth})));
    for(const row of geometry){assert(row.box.height>=44);assert(row.box.left>=row.parent.left&&row.box.right<=row.parent.right);assert(row.scroll<=row.client+1);}
    const tags=tile.locator('.phase2-verdict');assert.equal(await tags.count(),group.recordIds.length);
    for(const tag of await tags.all())assert(await tag.evaluate(node=>node.scrollWidth<=node.clientWidth+1),'Assessment fits its border');
    await fit(page);
    await links.first().focus();assert.equal(await links.first().evaluate(node=>getComputedStyle(node).outlineStyle),'solid');
    if(width===390)await tile.screenshot({path:`${output}/${name}-${group.key}.png`});
    if(width===390&&theme==='light'){
     for(const id of group.recordIds){
      const record=records.find(row=>row.id===id);await page.locator(`[data-evidence-group="${group.key}"] a[href="#debate/${id}"]`).click();
      await page.locator('#debate-view .phase2-sides:not([aria-busy])').waitFor();await page.locator('[data-debate-save]').waitFor();
      assert.equal(await page.evaluate(()=>location.hash),'#debate/'+id);
      assert.equal(await page.locator('#debate-view .phase2-summary p').innerText(),record.summary||record.text);
      await page.locator('[data-debate-save]').click();assert.equal(await page.locator('[data-debate-save]').getAttribute('aria-pressed'),'true');
      assert(await page.evaluate(id=>BibleLensDebateStore.read(id).saved,id),'The original ID is saved independently');
      if(record.scope){await page.locator('.phase2-deeper summary').click();assert((await page.locator('.phase2-deeper').innerText()).includes(record.scope));}
      await page.locator('[data-debate-sources]').click();await page.locator('#debate-sheet[open]').waitFor();
      const sources=[...(record.sources||[]),...(record.fields||[]).flatMap(field=>field.sources||[])].filter(source=>/^https:\/\//.test(source.url));
      for(const source of sources)assert(await page.locator('#debate-sheet a').evaluateAll((nodes,url)=>nodes.some(node=>node.getAttribute('href')===url),source.url));
      await page.keyboard.press('Escape');await page.goBack();await ready(page);assert.equal(await page.evaluate(()=>location.hash),hash);
     }
    }
   }
   // Single-member search stays a record, not a synthetic replacement group.
   await go(page,'#questions?mode=history&q=Genesis%2012%3A13');
   const expected=debatePage(records,new URLSearchParams({mode:'history',q:'Genesis 12:13',group:'display'}));
   assert(expected.records.some(record=>record.id==='genesis-wife-sister-12'),'Search finds the exact member');
   assert.equal(await page.locator('#debate-results .phase2-debate-card').count(),expected.displayGroups.length);
   for(const row of expected.records)assert(await page.locator('#debate-results a').evaluateAll((nodes,id)=>nodes.some(node=>node.getAttribute('href')==='#debate/'+id),row.id));
   assert.equal(await page.locator('[data-evidence-group="genesis-wife-sister"]').count(),0);
   await go(page,'#questions?mode=history');
   const first=debatePage(records,new URLSearchParams({mode:'history',group:'display'}));
   assert((await page.locator('#debate-count').innerText()).endsWith(`of ${first.displayTotal.toLocaleString()} results · ${first.total.toLocaleString()} records`));
   await page.locator('[data-debate-page="1"]').click();await ready(page);assert((await page.locator('#debate-count').innerText()).startsWith('Showing 25–48'));
   await page.goBack();await ready(page);assert((await page.locator('#debate-count').innerText()).startsWith('Showing 1–24'));
   await fit(page);assert.deepEqual(errors,[]);if(mobile)assert.deepEqual(mobileApiRequests,[],'The actual native engine handles every API request without network fallback');results.push({name,mobile,sourceOverlay,release,status:'PASS'});fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');console.log('PASS',name);
  }catch(error){await page.screenshot({path:`${output}/${name}-failure.png`}).catch(()=>{});throw error;}
  finally{await context.close();}
 }}finally{await browser.close();}
}
console.log('PASS: four groups, nine original detail/save links, source/scope parity, counts, search, pagination, Back, 44px links, focus, chips and viewport fit in Chromium/WebKit at four widths and both themes.'+(mobile?' Native www package ran offline with zero network API fallbacks.':''));
}finally{if(server)await new Promise(resolve=>server.close(resolve));}
