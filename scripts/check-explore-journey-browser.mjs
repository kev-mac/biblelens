import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import http from 'node:http';
import path from 'node:path';
import worker from './built-worker.mjs';
import {chromium,webkit} from 'playwright';
// Only local, already-approved original artwork is substituted for navigation
// checks. Explore's hashed renditions and all app/data responses use the built
// Worker. This harness makes no request to the public artwork origin.
const mobile=process.argv.includes('--mobile'),mobileRoot=path.resolve('www'),mobileApiRequests=[];
const environment={DB:{prepare(){throw Error('Signed-out QA fixture attempted SQL');}}};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://preview.test');
  if(mobile){
   if(url.pathname.startsWith('/api/')){mobileApiRequests.push(url.pathname);res.writeHead(503);res.end('The native bundle must use its on-device API.');return;}
   const file=path.resolve(mobileRoot,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
   if(!file.startsWith(mobileRoot+path.sep)){res.writeHead(403);res.end();return;}
   const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.woff2':'font/woff2','.svg':'image/svg+xml'};
   res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(fs.readFileSync(file));return;
  }
  if(/^\/assets\/[a-z0-9-]+\.webp$/.test(url.pathname)&&!/-[a-f0-9]{12}\.webp$/.test(url.pathname)&&fs.existsSync('src'+url.pathname)){
   res.writeHead(200,{'content-type':'image/webp','cache-control':'no-cache'});res.end(fs.readFileSync('src'+url.pathname));return;
  }
  const response=await worker.fetch(new Request(url,{headers:req.headers}),environment,{});
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(error.message);}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const source=fs.readFileSync('src/atlas-explore.js','utf8');
const journeys=vm.runInNewContext('(()=>{'+source.slice(source.indexOf(' const journeys='),source.indexOf(' const journeyKey='))+'return journeys;})()');
const artwork=JSON.parse(fs.readFileSync('src/assets/explore-renditions.json')).images;
const imagePaths=new Set(Object.values(artwork).flatMap(a=>['/assets/'+a.small.file,'/assets/'+a.large.file]));
const output='.release/explore-journey'+(mobile?'-mobile':''),results=[];
const screens=mobile?[[390,844],[820,1180]]:[[320,844],[550,983],[1440,900]];
async function offlineBundle(context){
 if(!mobile)return;
 await context.addInitScript(()=>Object.defineProperty(navigator,'onLine',{get:()=>false}));
 await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
}
fs.mkdirSync(output,{recursive:true});
async function feature(page){
 await page.locator('#explore-view:not([hidden]) .browse-feature').waitFor();
 await page.waitForFunction(()=>{const image=document.querySelector('.browse-feature img');return image?.complete&&image.naturalWidth>0;},{},{timeout:20000});
 return page.locator('.browse-feature').evaluate(node=>{
  const title=node.querySelector('strong'),image=node.querySelector('img'),label=node.querySelector('small'),range=document.createRange();range.selectNodeContents(title);
  const rect=n=>n.getBoundingClientRect().toJSON();
  return {href:node.getAttribute('href'),title:title.textContent,src:new URL(image.currentSrc).pathname,role:image.dataset.exploreImage,priority:image.getAttribute('fetchpriority'),sizes:image.sizes,card:rect(node),titleBox:rect(title),text:range.getBoundingClientRect().toJSON(),label:label.textContent,labelBox:rect(label),ctaCount:node.querySelectorAll('.explore-hero-cta').length};
 });
}
try{for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
 try{for(const [width,height]of screens)for(const [index,journey]of journeys.entries()){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:width===550?2:1,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  await offlineBundle(context);
  await context.addInitScript(value=>{Math.random=()=>value;},(index+.5)/journeys.length);
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(20000);
  try{
   await page.goto(base+'/#discover');await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},index%2?'light':'dark');
   const first=await feature(page),art=artwork[journey.art];assert.equal(first.href,journey.href);assert.equal(first.title,journey.title.toUpperCase());assert([art.small.file,art.large.file].some(file=>first.src==='/assets/'+file),'Matching optimized image');
   assert.equal(first.role,'hero');assert.equal(first.priority,'high');assert(first.sizes.endsWith('px'));assert.equal(await page.locator('#explore-view img[fetchpriority=high]').count(),1);
   assert(first.card.left>=0&&first.card.right<=width+1);assert(first.text.left>=first.card.left&&first.text.right<=first.card.right+1);assert.equal(first.label,'Featured Story');assert.equal(first.ctaCount,0,'Remove the Begin Journey CTA');assert(first.text.top>=first.labelBox.bottom-1,'Title does not overlap the feature label');assert(first.text.bottom<=first.card.bottom,'Title is not clipped');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.waitForFunction(()=>[...document.querySelectorAll('.ux-count')].every(n=>n.textContent!=='…'));assert.equal((await feature(page)).href,first.href,'Count arrival preserves selection');
   await page.screenshot({path:`${output}/${engine}-${width}-${index}.png`,fullPage:false});
   await page.locator('.browse-feature').focus();assert(await page.locator('.browse-feature').evaluate(n=>parseFloat(getComputedStyle(n).outlineWidth)>=2));
   await page.keyboard.press('Enter');await page.waitForFunction(href=>location.hash===href,journey.href);await page.locator('#stories-view:not([hidden]) .story-title').waitFor();assert.equal(await page.locator('#stories-view .story-title').innerText(),journey.title);assert(await page.locator('#stories-view .story-full-details').getAttribute('open')!==null);
   await page.goBack();assert.equal((await feature(page)).href,first.href,'Browser Back preserves feature');
   await page.evaluate(()=>BibleLensWorkspace.navigate('#discover?section=evidence'));await page.locator('#ux-topic-evidence').waitFor();assert.equal(await page.locator('.browse-feature').count(),0);
   await page.evaluate(()=>BibleLensWorkspace.navigate('#discover'));assert.equal((await feature(page)).href,first.href,'Scope changes preserve feature');
   await page.reload();const next=await feature(page);assert.notEqual(next.href,first.href,'Reload avoids the previous selection');assert(journeys.some(j=>j.href===next.href&&j.title.toUpperCase()===next.title));
   assert.deepEqual(errors,[]);results.push({engine,width,height,index,journey:journey.title,first,reloaded:next.href,status:'PASS'});console.log('PASS journey',engine,width,journey.title);
  }catch(error){results.push({engine,width,index,status:'FAIL',error:error.stack});await page.screenshot({path:`${output}/failure-${engine}-${width}-${index}.png`,fullPage:true}).catch(()=>{});throw error;}
  finally{await context.close();fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');}
 }
 // Storage-denied browsers still choose and open a working feature.
 const blocked=await browser.newContext({viewport:{width:550,height:983},serviceWorkers:'block'});
 await offlineBundle(blocked);
 await blocked.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){throw new DOMException('Blocked','SecurityError');}});});
 try{const page=await blocked.newPage();await page.goto(base+'/#discover');const picked=await feature(page);assert(journeys.some(j=>j.href===picked.href));await page.reload();await feature(page);}finally{await blocked.close();}
 // A new Read document must not request any Explore images, including the chosen hero.
 for(const route of ['#read/0/1','#questions?mode=text']){
  const context=await browser.newContext({viewport:{width:550,height:983},serviceWorkers:'block'}),page=await context.newPage(),requested=[];
  await offlineBundle(context);
  page.on('request',r=>{if(imagePaths.has(new URL(r.url()).pathname))requested.push(r.url());});
  try{await page.goto(base+'/'+route);await page.locator(route.startsWith('#read')?'#verse-1':'#debates-view .phase2-debate-card').first().waitFor();await page.waitForTimeout(500);assert.equal(requested.length,0,'No hidden Explore image requests');assert(await page.locator('#explore-view img').evaluateAll(nodes=>nodes.every(n=>!n.getAttribute('src')&&!n.getAttribute('srcset'))));}finally{await context.close();}
 }
 }finally{await browser.close();}
}}finally{fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');await new Promise(resolve=>server.close(resolve));}
assert.equal(results.length,2*screens.length*journeys.length);
if(mobile)assert.deepEqual(mobileApiRequests,[],'Native story/navigation data never requests a server API');
console.log('PASS:',results.length,mobile?'native-bundle cases with external requests blocked and no server API calls;':'web cases;', 'Chromium/WebKit; all matching titles/images/links, keyboard activation, responsive unclipped hero, stable navigation, reload changes, storage-denied fallback and hidden-image deferral. Physical devices are not verified.');
