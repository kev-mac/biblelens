import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {chromium,webkit} from 'playwright';
import {releaseInfo} from './release-info.mjs';
const base=process.env.BIBLELENS_PREVIEW_URL,phase=process.env.BIBLELENS_IMAGE_PHASE;
assert(base&&['before','after','live'].includes(phase));
const expected=phase==='after'?releaseInfo():{version:'1.1.0',buildNumber:405,sourceHash:'8b830d2339008190e290ec310f23c7787871da42ac7cf69a065729f7dd15f863'};
const catalog=JSON.parse(fs.readFileSync('src/assets/explore-renditions.json')).images;
const imagePaths=new Set(Object.values(catalog).flatMap(a=>['/assets/'+a.source,'/assets/'+a.small.file,'/assets/'+a.large.file]));
const output='.release/explore-image-loading/'+phase,results=[];fs.mkdirSync(output,{recursive:true});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function metrics(since=0){if(phase==='live')return null;const r=await fetch(base+'/__qa_metrics?since='+since,{signal:AbortSignal.timeout(10000)});assert(r.ok);return r.json();}
async function snapshot(page){return page.evaluate(()=>({release:document.getElementById('footer-version')?.textContent,images:[...document.querySelectorAll('#explore-view img')].map(n=>{const r=n.getBoundingClientRect();return {role:n.dataset.exploreImage,src:n.currentSrc||n.getAttribute('src'),srcset:n.getAttribute('srcset'),sizes:n.sizes,width:r.width,height:r.height,top:r.top,bottom:r.bottom,decoded:n.complete&&n.naturalWidth>0,naturalWidth:n.naturalWidth,priority:n.getAttribute('fetchpriority'),loading:n.loading,visible:!document.getElementById('explore-view').hidden&&r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0};}),resources:performance.getEntriesByType('resource').filter(r=>r.initiatorType==='img').map(r=>({url:r.name,startMs:r.startTime,durationMs:r.duration,responseStartMs:r.responseStart,transferSize:r.transferSize,encodedBodySize:r.encodedBodySize,decodedBodySize:r.decodedBodySize})),probe:window.__imageProbe}));}
async function startProbe(page){await page.addInitScript(()=>{
 window.__imageProbe={imageErrors:[],retrySeen:false,layoutShift:0};document.addEventListener('error',e=>{if(e.target instanceof HTMLImageElement)window.__imageProbe.imageErrors.push(e.target.currentSrc||e.target.src);},true);
 new MutationObserver(()=>{if(document.querySelector('.fetch-retry-status:not([hidden])'))window.__imageProbe.retrySeen=true;}).observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
 try{new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__imageProbe.layoutShift+=e.value;}).observe({type:'layout-shift',buffered:true});}catch{}
 });}
function collectResponses(page,label){
 const responses=[],pending=[];
 const relevant=request=>{let r=request;while(r){if(imagePaths.has(new URL(r.url()).pathname))return true;r=r.redirectedFrom();}return false;};
 page.on('response',response=>{if(!relevant(response.request()))return;const visit=typeof label==='function'?label():label,url=new URL(response.url());pending.push((async()=>{const headers=response.headers();let body,error;try{body=await response.body();}catch(e){error=e.message;}
  const webpSignature=body?body.toString('ascii',0,4)==='RIFF'&&body.toString('ascii',8,12)==='WEBP':null;responses.push({visit,origin:url.origin,path:url.pathname,status:response.status(),bodyBytes:body?.length,webpSignature,sha256:body?hash(body):null,bodyError:error,headers:Object.fromEntries(['content-type','cache-control','etag','cf-cache-status','age','server','cf-ray','x-request-id'].map(k=>[k,headers[k]||null])),...(!/^image\//.test(headers['content-type']||'')||response.status()>=400||body?.length===1226||webpSignature===false?{untrustedErrorBody:body?.toString('utf8').slice(0,4096),layer:'unresolved; inspect status/body/headers and correlate platform logs'}:{})});if([401,403].includes(response.status())&&phase==='live')denied=true;
 })());});
 page.on('requestfailed',request=>{if(relevant(request)){const url=new URL(request.url());responses.push({visit:typeof label==='function'?label():label,origin:url.origin,path:url.pathname,requestFailure:request.failure()?.errorText});}});
 return {responses,pending};
}
let denied=false;
try{for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
 try{for(const [width,height]of [[390,844],[1440,900]])for(const dpr of (phase==='live'?[1]:[1,2])){
  if(denied)break;
  const label=`${engine}-${width}x${height}-dpr${dpr}`,row={phase,engine,width,height,dpr,environment:phase==='live'?'current public Site; fresh unauthenticated browser':'CI loopback; actual embedded Worker, not Cloudflare timing',expected,status:'RUNNING',hidden:[],visits:[]};results.push(row);
  try{
   const identity=await fetch(base+'/release.json',{signal:AbortSignal.timeout(15000)});
   const identityText=await identity.text();row.identityResponse={status:identity.status,bytes:Buffer.byteLength(identityText),...(!identity.ok?{untrustedBody:identityText.slice(0,4096)}:{})};if([401,403].includes(identity.status)&&phase==='live'){denied=true;throw Error('Live baseline access rejected: HTTP '+identity.status);}assert(identity.ok);assert.deepEqual(JSON.parse(identityText),expected,'Do not compare a different live/source build');
   for(const route of ['#read/0/1','#questions?mode=text']){
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:dpr,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage();await startProbe(page);
    try{const captured=collectResponses(page,route),beginning=await metrics(),observationStart=performance.now();await page.goto(base+'/'+route);await page.locator(route.startsWith('#read')?'#verse-1':'#debates-view .phase2-debate-card').first().waitFor({timeout:30000});let completionError=null;if(phase==='after')await page.waitForTimeout(1000);else try{await page.waitForFunction(()=>[...document.querySelectorAll('#explore-view img')].every(n=>n.complete),{},{timeout:20000});}catch(e){completionError=e.message;}await Promise.allSettled(captured.pending);const view=await snapshot(page),network=await metrics(beginning?.serial);const requests=network?.rows.filter(r=>imagePaths.has(r.path));row.hidden.push({route,observationMs:performance.now()-observationStart,completionError,responses:captured.responses,networkImageRequests:requests?.length,networkImageBytes:requests?.reduce((n,r)=>n+(r.bytes||0),0),requests,view});
     if(phase==='after'){assert.equal(requests.length,0,'Hidden Explore starts no image requests on '+route);assert(view.images.every(n=>!n.src&&!n.srcset),'Hidden images have no active source attributes');}
     await page.screenshot({path:`${output}/${label}-${route.startsWith('#read')?'read':'comparisons'}.png`,fullPage:false});
    }finally{await context.close();}
    if(denied)throw Error('Live image access rejected; no further live requests');
   }
   const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:dpr,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),cacheEvents=[];await startProbe(page);let visit='cold';const {responses,pending}=collectResponses(page,()=>visit);
   if(engine==='chromium'){const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');cdp.on('Network.responseReceived',e=>{if(imagePaths.has(new URL(e.response.url).pathname))cacheEvents.push({visit,path:new URL(e.response.url).pathname,fromDiskCache:!!e.response.fromDiskCache,fromPrefetchCache:!!e.response.fromPrefetchCache});});}
   try{for(const name of ['cold','warm']){
    visit=name;if(name==='warm')await page.goto('about:blank');const beginning=await metrics(),start=performance.now();let decodeError=null;
    await page.goto(base+'/#discover?section=evidence');await page.locator('#ux-topic-evidence').waitFor({timeout:30000});
    try{await page.waitForFunction(()=>{const nodes=[...document.querySelectorAll('#explore-view .ux-topic img')];return nodes.length===2&&nodes.every(n=>n.complete&&n.naturalWidth>0);},{},{timeout:20000});}catch(e){decodeError=e.message;}
    const decodedMs=performance.now()-start;await Promise.allSettled(pending);const view=await snapshot(page),network=await metrics(beginning?.serial),requests=network?.rows.filter(r=>imagePaths.has(r.path));row.visits.push({name,decodedMs,decodeError,networkImageRequests:requests?.length,networkImageBytes:requests?.reduce((n,r)=>n+(r.bytes||0),0),requests,view});
    if(phase==='after'){
     assert.equal(decodeError,null,'Both visible tiles decode on the first attempt');assert.equal(view.images.filter(n=>n.decoded).length,2);assert.equal(view.images.filter(n=>n.priority==='high').length,1);assert(!view.probe.retrySeen,'No Retrying state on a cold/warm Evidence visit');assert.equal(view.probe.imageErrors.length,0);assert.equal(view.images.filter(n=>n.loading==='lazy').length,1);
     if(name==='warm')assert.equal(requests.filter(r=>r.status!==304).length,0,'A second document visit uses browser cache/304, not a full image download');
     assert(responses.filter(r=>r.visit===name).every(r=>/^image\/webp/.test(r.headers?.['content-type']||'')&&r.status===200));
    }
    await page.screenshot({path:`${output}/${label}-evidence-${name}.png`,fullPage:false});
    if(phase==='after'&&name==='cold'){
     const hiddenStart=await metrics();await page.evaluate(()=>BibleLensWorkspace.navigate('#read/0/1'));await page.locator('#verse-1').waitFor();await page.setViewportSize({width:width-1,height});await page.evaluate(()=>scrollTo(0,300));await page.waitForTimeout(500);const hiddenNetwork=await metrics(hiddenStart.serial),images=hiddenNetwork.rows.filter(r=>imagePaths.has(r.path));assert.equal(images.length,0,'Leaving Explore, resizing and scrolling do not start deferred image requests');row.hiddenAfterVisit={requests:images,view:await snapshot(page)};await page.setViewportSize({width,height});
    }

   }}finally{await Promise.allSettled(pending);row.responses=responses;row.chromiumCacheEvents=cacheEvents;await context.close();}
   row.status=phase==='after'?'PASS':'CAPTURED';console.log('IMAGE METRICS',JSON.stringify({phase,engine,width,height,dpr,status:row.status,hidden:row.hidden.map(r=>({route:r.route,count:r.networkImageRequests,bytes:r.networkImageBytes})),visits:row.visits.map(v=>({name:v.name,ms:v.decodedMs,count:v.networkImageRequests,bytes:v.networkImageBytes,error:v.decodeError})),failedResponses:responses.filter(r=>r.status>=400||r.bodyBytes===1226||r.webpSignature===false||r.requestFailure).map(r=>({path:r.path,status:r.status,bytes:r.bodyBytes,sha256:r.sha256,requestFailure:r.requestFailure,layer:r.layer}))}));
  }catch(error){row.status=phase==='live'?'UNAVAILABLE':'FAIL';row.error=error.stack;console.error('IMAGE CASE',phase,label,row.status,error.message);if(phase!=='live')throw error;}
  finally{fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');}
 }}finally{await browser.close();}
}}finally{fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');}
if(phase!=='live'){assert.equal(results.length,8);assert(results.every(r=>r.status===(phase==='after'?'PASS':'CAPTURED')));}
console.log('Image performance capture complete:',phase,'Physical devices and Cloudflare CPU budget are not certified by loopback tests.');
