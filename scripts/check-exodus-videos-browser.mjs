import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {releaseInfo} from './release-info.mjs';

// No builds, source substitutions, media fixtures or network fallbacks. Run
// after the release owner freezes source and builds the production candidate.
const expected = [
 ['Moses and Aaron Before Pharaoh',11.25],
 ['The Plagues of Egypt',7.25],
 ['The Passover and the Death of the Firstborn',10],
 ['The Exodus from Egypt',11.25],
 ['Crossing the Sea',11.25],
 ['Bitter Water, Manna and Quail',12.75],
 ['Water from the Rock and the Battle with Amalek',10.25],
 ['Jethro Advises Moses',10.75],
 ['The Covenant and Ten Commandments at Sinai',7.5],
 ['The Covenant Is Sealed at Sinai',10],
];
const plan={engines:['chromium','webkit'],sizes:[{name:'phone',width:390,height:844},{name:'ipad',width:820,height:1180}],titles:expected.map(([title])=>title),checks:['poster, alt text, responsive layout and reduced-motion idle','real public R2 decoding, dimensions, duration and time','native controls, pause, middle seek and changing frames','natural end, poster and manual restart','warm offline fallback and reconnect without autoplay','real failed-source fallback and successful Retry','navigation and detached-media teardown'],policy:'Exact production handler and assets, with its existing CSP enforced. Reduced motion; no autoplay or neighbor preload.'};
if(process.argv.includes('--plan')){console.log(JSON.stringify(plan,null,2));process.exit(0);}
if(process.env.SITES_MANAGED_LINUX_CONTAINER==='1'){console.error('NOT RUN: local runner only; use supported managed browser tools.');process.exit(2);}
const option=name=>process.argv.find(value=>value.startsWith('--'+name+'='))?.slice(name.length+3);
const output=path.resolve(option('output')||'.release/videos-410/browser');
fs.mkdirSync(output,{recursive:true});
const report={startedAt:new Date().toISOString(),source:releaseInfo(),plan,results:[],limits:['Phone and iPad sizes are browser viewports, not physical-device or installed-app verification.','Offline checks use an already-loaded page and primed local fallback image, not a cold offline install.','Audio decodes as part of the real MP4 but is not listening-reviewed.','Natural end waits use actual duration. All seek/resume positions stay in the middle of these short clips.']};
const save=()=>fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2)+'\n');
const catalog=JSON.parse(fs.readFileSync('data/story-videos.json','utf8'));
const images=JSON.parse(fs.readFileSync('data/story-images.json','utf8'));
const publicOrigin='https://pub-9f1a7f52c7d046daba4df355a08ed8cd.r2.dev';
let server,browser,stopLive=false;
try{
 const built=JSON.parse(fs.readFileSync('dist/client/release.json','utf8'));
 assert.equal(built.sourceHash,report.source.sourceHash,'Missing/stale candidate. The release owner must build after all edits finish; this runner never builds.');
 assert.equal(built.buildNumber,report.source.buildNumber);
 for(const [title]of expected){const record=catalog[title];assert(record?.status==='ready'&&record.provider==='mp4','Ready MP4 missing: '+title);assert.equal(new URL(record.src).origin,publicOrigin);assert(images[title],'Fallback art missing: '+title);}
 const {default:worker}=await import('./built-worker.mjs'),engines=await import('playwright');
 server=http.createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,`http://127.0.0.1:${server.address().port}`);
   if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
   const response=await worker.fetch(new Request(url,{method:req.method,headers:req.headers}),{},{}),headers=Object.fromEntries(response.headers);
   // Promote the shipped policy, without weakening directives or changing app bytes.
   if(headers['content-security-policy-report-only'])headers['content-security-policy']=headers['content-security-policy-report-only'];
   res.writeHead(response.status,headers);res.end(req.method==='HEAD'?undefined:Buffer.from(await response.arrayBuffer()));
  }catch(error){res.writeHead(500);res.end('Preview failed.');}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const base=`http://127.0.0.1:${server.address().port}`;
 for(const engine of plan.engines){
  if(option('engine')&&option('engine')!==engine)continue;
  try{browser=await engines[engine].launch(engine==='webkit'&&process.platform==='win32'?{ignoreDefaultArgs:['--disable-accelerated-compositing']}:{});}
  catch(error){report.results.push({engine,check:'browser launch',status:'NOT RUN',detail:error.message});save();continue;}
  for(const size of plan.sizes){
   if(option('size')&&option('size')!==size.name)continue;
   for(const [title,expectedDuration]of expected){
    if(option('title')&&!title.toLowerCase().includes(option('title').toLowerCase()))continue;
    const record=catalog[title],slug=title.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    const context=await browser.newContext({viewport:{width:size.width,height:size.height},reducedMotion:'reduce',serviceWorkers:'block'});
    const page=await context.newPage(),requests=[],diagnostics=[];
    page.setDefaultTimeout(15000);
    page.on('request',request=>{if(new URL(request.url()).origin===publicOrigin)requests.push(request.url());});
    page.on('requestfailed',request=>{const url=new URL(request.url());diagnostics.push({event:'requestfailed',url:url.origin+url.pathname,error:request.failure()?.errorText});});
    page.on('pageerror',error=>diagnostics.push({event:'pageerror',message:error.message}));
    page.on('response',response=>{if(response.status()>=400){const url=new URL(response.url());diagnostics.push({event:'response',url:url.origin+url.pathname,status:response.status()});}});
    await page.addInitScript(()=>{window.__cspViolations=[];document.addEventListener('securitypolicyviolation',event=>window.__cspViolations.push({directive:event.violatedDirective,blocked:event.blockedURI}));});
    const result=async(check,run)=>{
     try{const detail=await run();report.results.push({engine,size:size.name,title,check,status:'PASS',...(detail?{detail}:{})});console.log('PASS',engine,size.name,title,check);return true;}
     catch(error){report.results.push({engine,size:size.name,title,check,status:'FAIL',detail:error.message.slice(0,1600),diagnostics:[...diagnostics]});await page.screenshot({path:path.join(output,`${engine}-${size.name}-${slug}-failure.png`),fullPage:true}).catch(()=>{});console.error('FAIL',engine,size.name,title,check,error.message);return false;}
     finally{save();}
    };
    try{
     const response=await page.goto(base+'/#stories/exodus/'+slug);
     assert(response.ok());assert(response.headers()['content-security-policy']?.includes('media-src'),'Application CSP must be enforced');
     const figure=page.locator(`#story-${slug} .story-video`);await figure.waitFor();
     await figure.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
     const play=figure.locator('[data-video-play]'),retry=figure.locator('[data-video-retry]'),still=figure.locator('[data-video-still]'),media=figure.locator('video'),status=figure.locator('[data-video-status]');
     const snapshot=()=>media.evaluate(v=>({time:v.currentTime,duration:v.duration,width:v.videoWidth,height:v.videoHeight,paused:v.paused,ready:v.readyState,controls:v.controls,src:v.getAttribute('src')}));
     const advancing=async(minimum=.35)=>{
      await media.waitFor();const handle=await media.elementHandle();
      await page.waitForFunction(({v,minimum})=>v.error||(!v.paused&&!v.seeking&&v.readyState>=2&&v.currentTime>=minimum),{v:handle,minimum},{timeout:15000});
      assert.equal(await media.evaluate(v=>v.error?.code??null),null,'The real MP4 must decode');
      const first=await snapshot();await page.waitForTimeout(220);const second=await snapshot();
      assert(second.time>first.time+.05&&!second.paused,'Real decoded playback time must advance');return second;
     };
     const seek=async(target)=>{
      await media.evaluate((v,target)=>{v.pause();v.currentTime=target;},target);
      const handle=await media.elementHandle();await page.waitForFunction(({v,target})=>!v.seeking&&v.readyState>=2&&Math.abs(v.currentTime-target)<.25,{v:handle,target},{timeout:10000});
     };
     const retired=async(handle)=>{assert(await handle.evaluate(v=>!v.isConnected&&!v.getAttribute('src')&&v.paused),'Detached media must be paused with its source removed');};
     const framePixels=async()=>{
      await media.evaluate(v=>v.controls=false);const box=await media.boundingBox();
      const bytes=await page.screenshot({clip:{x:box.x+4,y:box.y+4,width:box.width-8,height:box.height-8}});
      await media.evaluate(v=>v.controls=true);return bytes;
     };
     await result('poster, alt text, layout and reduced-motion idle',async()=>{
      await still.evaluate(img=>img.decode());assert.equal(await still.getAttribute('src'),record.poster);assert.equal(await still.getAttribute('alt'),record.posterAlt);
      await page.waitForTimeout(450);assert.equal(await page.locator('video').count(),0);assert.equal(requests.length,0,'Reduced motion must suppress autoplay and all preloading');
      assert.equal(await play.getAttribute('aria-label'),'Play '+title+' video');await play.focus();assert(await play.evaluate(el=>el===document.activeElement));
      const bounds=await figure.boundingBox(),stage=await figure.locator('.story-video-stage').boundingBox(),button=await play.boundingBox();
      assert(stage.x>=bounds.x-1&&stage.x+stage.width<=bounds.x+bounds.width+1);assert(stage.width>0&&stage.height>0);assert(button.width>=44&&button.height>=44);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
      assert((await figure.locator('.sr-only').innerText()).includes(record.description));await page.screenshot({path:path.join(output,`${engine}-${size.name}-${slug}-poster.png`),fullPage:false});
     });
     if(stopLive){report.results.push({engine,size:size.name,title,check:'live lifecycle',status:'NOT RUN',detail:'An earlier real-playback check failed; no automatic retries or alternate media endpoints.'});continue;}
     // Prime only the app's exact original fallback for the warm offline case.
     await page.evaluate(async src=>{const img=new Image();img.src=src;await img.decode();window.__fallbackImage=img;},images[title].src);
     const played=await result('real R2 decode, native controls, pause and middle seek',async()=>{
      await play.press('Enter');const decoded=await advancing();assert(decoded.width>0&&decoded.height>0);assert(Math.abs(decoded.width/decoded.height-16/9)<.03);assert(Math.abs(decoded.duration-expectedDuration)<.15,'Duration must match this reviewed clip');
      assert.equal(decoded.src,record.src);assert(await media.evaluate(v=>v.playsInline&&!v.controls&&!v.loop&&v.preload==='none'));assert.equal(await page.locator('video').count(),1);
      if(!(engine==='webkit'&&process.platform==='win32'))assert(requests.length>0&&requests.every(src=>src===record.src),'Only this exact public R2 object may be fetched');
      await figure.getByRole('button',{name:'Show controls for '+title,exact:true}).click();assert(await media.evaluate(v=>v.controls));await media.evaluate(v=>v.pause());
      const paused=await snapshot();await page.waitForTimeout(250);assert(Math.abs((await snapshot()).time-paused.time)<.12);assert(await media.isVisible());const firstFrame=await framePixels();
      const target=decoded.duration*.4;await seek(target);await page.waitForTimeout(100);const secondFrame=await framePixels();assert(!firstFrame.equals(secondFrame),'Seeking must display a different actual decoded frame');
      await media.evaluate(v=>v.play());await advancing(target-.2);await media.evaluate(v=>v.pause());assert.deepEqual(await page.evaluate(()=>window.__cspViolations),[]);
      await page.screenshot({path:path.join(output,`${engine}-${size.name}-${slug}-playing.png`),fullPage:false});return decoded;
     });
     if(!played){stopLive=true;continue;}
     const ended=await result('natural end restores poster and manual restart',async()=>{
      const handle=await media.elementHandle(),remaining=await media.evaluate(v=>v.duration-v.currentTime);
      await media.evaluate(v=>v.play());await play.waitFor({state:'visible',timeout:Math.ceil(remaining*1000)+15000});
      assert.equal(await media.count(),0);await retired(handle);assert.equal(await still.getAttribute('src'),record.poster);
      await page.waitForTimeout(400);assert.equal(await media.count(),0,'Ended video must not loop or autoplay');await play.click();const restarted=await advancing();assert(restarted.time<2,'Manual restart begins at zero');
     });
     if(!ended){stopLive=true;continue;}
     const offline=await result('warm offline fallback, reconnect without autoplay and resume',async()=>{
      const target=expectedDuration*.45;await seek(target);await media.evaluate(v=>v.play());await advancing(target-.2);await media.evaluate(v=>v.pause());await page.waitForTimeout(100);
      const saved=(await snapshot()).time,handle=await media.elementHandle();await context.setOffline(true);await status.filter({hasText:'offline'}).waitFor();assert.equal(await media.count(),0);await retired(handle);
      assert.equal(await still.getAttribute('src'),images[title].src);await still.evaluate(img=>img.decode());assert(!await play.isVisible());await page.screenshot({path:path.join(output,`${engine}-${size.name}-${slug}-offline.png`),fullPage:false});
      const requestCount=requests.length;await context.setOffline(false);await play.waitFor({state:'visible'});await page.waitForTimeout(450);assert.equal(await media.count(),0);assert.equal(requests.length,requestCount);assert.equal(await still.getAttribute('src'),record.poster);
      await play.click();await media.waitFor();const resumed=await advancing(saved-.55);assert(resumed.time>=saved-.55,'Playback resumes near the last saved point');
      const resumedHandle=await media.elementHandle();await page.evaluate(()=>window.BibleLensStoryVideo.stop());await retired(resumedHandle);assert.equal(await media.count(),0);return {saved,resumed:resumed.time};
     });
     if(!offline){stopLive=true;continue;}
     const failed=await result('failed source fallback and successful Retry',async()=>{
      let intercepted=0;const abort=route=>{intercepted++;return route.abort('failed');};await context.route(record.src,abort);
      await play.click();await retry.waitFor({state:'visible',timeout:20000});assert(intercepted>0,'The deliberate source failure must hit this exact media URL');assert.equal(await media.count(),0);assert.equal(await still.getAttribute('src'),images[title].src);await still.evaluate(img=>img.decode());
      await context.unroute(record.src,abort);await retry.click();const retried=await advancing();assert.equal(retried.src,record.src);assert(!await retry.isVisible());assert.deepEqual(await page.evaluate(()=>window.__cspViolations),[]);
     });
     if(!failed){stopLive=true;continue;}
     await result('navigation tears down active video and clears source',async()=>{
      const handle=await media.elementHandle();await page.getByRole('button',{name:'Read '+title,exact:true}).click();await page.locator('#chapter-text').waitFor();assert.equal(await page.locator('.story-video video').count(),0);await retired(handle);await page.waitForTimeout(300);assert.equal(await page.locator('.story-video video').count(),0);
     });
    }catch(error){report.results.push({engine,size:size.name,title,check:'page setup',status:'FAIL',detail:error.message.slice(0,1600),diagnostics});save();}
    finally{await context.setOffline(false).catch(()=>{});await context.close();save();}
   }
  }
  await browser.close();browser=undefined;
 }
 assert.equal(releaseInfo().sourceHash,report.source.sourceHash,'Source changed during browser verification; results are not an immutable candidate pass');
}catch(error){report.results.push({check:'runner setup or immutable-source gate',status:'FAIL',detail:error.message.slice(0,1600)});}
finally{await browser?.close();if(server)await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});report.finishedAt=new Date().toISOString();save();}
console.log('Browser report: '+path.join(output,'results.json'));
process.exitCode=report.results.some(result=>result.status!=='PASS')?1:0;
