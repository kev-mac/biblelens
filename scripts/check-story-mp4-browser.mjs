import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {execFileSync} from 'node:child_process';
import {releaseInfo} from './release-info.mjs';

const plan={engines:['chromium','webkit'],sizes:[{name:'phone',width:390,height:844},{name:'ipad',width:820,height:1180}],checks:['posters and responsive controls','no media requests before Play','real MP4 playback, pause and seek','ended poster and restart','offline image, reconnect and resume','network failure and Retry','navigation teardown'],policy:'enforced application CSP'};
if(process.argv.includes('--plan')){console.log(JSON.stringify(plan,null,2));process.exit(0);}
if(process.env.SITES_MANAGED_LINUX_CONTAINER==='1'){console.error('NOT RUN: use the managed environment browser tools. This runner is for local development.');process.exit(2);}
const output=path.resolve('outputs/r2-video-browser');fs.mkdirSync(output,{recursive:true});
const report={startedAt:new Date().toISOString(),source:releaseInfo(),plan,results:[],limits:['Phone and iPad viewports are emulation, not physical-device or installed-app verification.','Offline checks use an already-loaded page and primed fallback image.','Windows WebKit does not expose/intercept MP4 network requests: its source-failure test uses enforced CSP rejection. Chromium verifies network aborts and the requested media URL.']};
const save=()=>fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2)+'\n');
const records=Object.entries(JSON.parse(fs.readFileSync('data/story-videos.json','utf8'))).filter(([,v])=>v.status==='ready'&&v.provider==='mp4');
const images=JSON.parse(fs.readFileSync('data/story-images.json','utf8'));
// Windows WebKit can briefly report zero at seeked before its native clock
// catches up. Require settled advancing playback, with a post-metadata budget
// shorter than the saved position: a restart from zero must never pass.
const waitResumed=(media,minimum)=>media.evaluate((v,minimum)=>new Promise((resolve,reject)=>{
 const started=performance.now(),samples=[];let readyAt,goodAt,goodTime;
 const poll=setInterval(()=>{
  const now=performance.now();if(v.readyState>=1&&readyAt===undefined)readyAt=now;
  samples.push({time:v.currentTime,seeking:v.seeking,paused:v.paused,ready:v.readyState});if(samples.length>12)samples.shift();
  if(v.readyState>=2&&!v.seeking&&!v.paused&&v.playbackRate<=1&&v.currentTime>=minimum){
   if(goodAt===undefined){goodAt=now;goodTime=v.currentTime;}
   else if(now-goodAt>=300&&v.currentTime>goodTime+.1){clearInterval(poll);resolve();return;}
  }else goodAt=undefined;
  if(v.error||now-started>15000||readyAt!==undefined&&now-readyAt>3000){clearInterval(poll);reject(Error('Resume did not settle near the saved position: '+JSON.stringify(samples)));}
 },50);
}),minimum);
let server,browser,stopLive=false;
try{
 for(const title of ['The Fall of Man','Cain and Abel','The Line of Seth'])assert(records.some(([name])=>name===title),'Approved R2 video missing: '+title);
 let built;try{built=JSON.parse(fs.readFileSync('dist/client/release.json','utf8'));}catch{}
 if(built?.sourceHash!==report.source.sourceHash)execFileSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});
 const {default:worker}=await import('./built-worker.mjs');const engines=await import('playwright');
 server=http.createServer(async(req,res)=>{
  try{const url=new URL(req.url,`http://127.0.0.1:${server.address().port}`);if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
   const response=await worker.fetch(new Request(url,{method:req.method,headers:req.headers}),{},{}),headers=Object.fromEntries(response.headers);
   if(url.pathname==='/'&&headers['content-security-policy-report-only'])headers['content-security-policy']=headers['content-security-policy-report-only'];
   res.writeHead(response.status,headers);res.end(req.method==='HEAD'?undefined:Buffer.from(await response.arrayBuffer()));
  }catch{res.writeHead(500);res.end('Preview failed.');}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});const base=`http://127.0.0.1:${server.address().port}`;
 for(const engine of plan.engines){
  // Match the normal-motion viewport runner: the Windows WebKit software
  // compositor crashes on complex View Transition snapshots. Keep real
  // production features enabled and use the supported compositing launch path.
  try{browser=await engines[engine].launch(engine==='webkit'&&process.platform==='win32'?{ignoreDefaultArgs:['--disable-accelerated-compositing']}:{});}catch(error){report.results.push({engine,check:'browser launch',status:'NOT RUN',detail:error.message});save();continue;}
  for(const size of plan.sizes)for(const [title,record] of records){
   const slug=title.toLowerCase().replace(/[^a-z0-9]+/g,'-'),context=await browser.newContext({viewport:{width:size.width,height:size.height},reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),mediaRequests=[],violations=[];
   page.on('request',r=>{if(new URL(r.url()).hostname.endsWith('.r2.dev'))mediaRequests.push(r.url());});
   await page.addInitScript(()=>{window.__cspViolations=[];document.addEventListener('securitypolicyviolation',e=>window.__cspViolations.push({directive:e.violatedDirective,blocked:e.blockedURI}));});
   const result=async(check,fn)=>{try{await fn();report.results.push({engine,size:size.name,title,check,status:'PASS'});console.log('PASS',engine,size.name,title,check);return true;}catch(error){report.results.push({engine,size:size.name,title,check,status:'FAIL',detail:error.message.slice(0,1200)});await page.screenshot({path:path.join(output,`${engine}-${size.name}-${slug}-failure.png`),fullPage:true}).catch(()=>{});console.error('FAIL',engine,size.name,title,check,error.message);return false;}finally{save();}};
   try{
    await page.goto(base+'/#stories/genesis/'+slug);const figure=page.locator(`#story-${slug} .story-video`);await figure.waitFor();
    const play=figure.locator('[data-video-play]'),retry=figure.locator('[data-video-retry]'),still=figure.locator('[data-video-still]'),media=figure.locator('video'),status=figure.locator('[data-video-status]');
    await result('poster, responsive layout and no browsing requests',async()=>{
     assert.equal(await still.getAttribute('src'),record.poster);await still.evaluate(img=>img.decode());assert.equal(await page.locator('video').count(),0);assert.equal(mediaRequests.length,0);
     assert.equal(await play.getAttribute('aria-label'),'Play '+title+' video');await play.focus();assert(await play.evaluate(el=>el===document.activeElement));
     const bounds=await figure.boundingBox(),stage=await figure.locator('.story-video-stage').boundingBox();assert(stage.x>=bounds.x-1&&stage.x+stage.width<=bounds.x+bounds.width+1);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
     assert.equal(await figure.locator('figcaption,details,[data-video-image]').count(),0);assert.equal(await play.locator('svg').count(),1);assert.equal(await play.innerText(),'');const buttonBounds=await play.boundingBox();assert(buttonBounds.width>=44&&buttonBounds.width<=48&&buttonBounds.height>=44&&buttonBounds.height<=48);const description=figure.locator('.sr-only');assert((await description.innerText()).includes(record.description));const descriptionBounds=await description.boundingBox();assert(descriptionBounds.width<=1&&descriptionBounds.height<=1);
     await page.screenshot({path:path.join(output,`${engine}-${size.name}-${slug}-poster.png`),fullPage:true});
    });
    await page.evaluate(async src=>{const img=new Image();img.src=src;await img.decode();window.__fallbackImage=img;},images[title].src);
    const waitPlaying=()=>media.evaluate(v=>new Promise((resolve,reject)=>{let timer=setTimeout(()=>{clearInterval(poll);reject(Error('MP4 did not decode and advance'));},15000);let poll=setInterval(()=>{if(v.currentTime>1&&!v.paused&&v.readyState>=2){clearTimeout(timer);clearInterval(poll);resolve({time:v.currentTime,duration:v.duration,width:v.videoWidth,height:v.videoHeight});}else if(v.error){clearTimeout(timer);clearInterval(poll);reject(Error('Media error '+v.error.code));}},100);}));
    if(!stopLive){
     const passed=await result('real MP4 playback, pause and seek',async()=>{
      await play.press('Enter');await media.waitFor();const decoded=await waitPlaying();assert(decoded.width>0&&decoded.height>0,'The player exposes a video frame');assert(decoded.duration>10);
      assert.equal(await media.getAttribute('preload'),'none');assert(await media.evaluate(v=>v.controls&&v.playsInline));assert.equal(await media.getAttribute('src'),record.src);assert.equal(await page.locator('video').count(),1);if(!(engine==='webkit'&&process.platform==='win32'))assert(mediaRequests.length>0&&mediaRequests.every(u=>u===record.src),'Only the chosen video is fetched');
      await media.evaluate(v=>v.pause());const before=await media.evaluate(v=>v.currentTime);await page.waitForTimeout(250);assert(Math.abs(await media.evaluate(v=>v.currentTime)-before)<0.15);assert(await media.isVisible());
      // Some WebKit ports report the rendered size instead of encoded size.
      // Prove changing visual frames, not just a clock or a static poster.
      const pixels=async()=>{await media.evaluate(v=>v.controls=false);const box=await media.boundingBox();const image=await page.screenshot({clip:{x:box.x+4,y:box.y+4,width:box.width-8,height:box.height-8}});await media.evaluate(v=>v.controls=true);return image;};
      const firstFrame=await pixels();
      await media.evaluate(v=>new Promise(resolve=>{v.addEventListener('seeked',()=>resolve(),{once:true});v.currentTime=5;}));await media.evaluate(v=>v.play());await waitPlaying();assert(await media.evaluate(v=>v.currentTime>=5));await media.evaluate(v=>v.pause());const laterFrame=await pixels();assert(!firstFrame.equals(laterFrame),'The displayed video frame must change after seeking, not remain a poster');await media.evaluate(v=>v.play());assert.deepEqual(await page.evaluate(()=>window.__cspViolations),[]);
      await page.screenshot({path:path.join(output,`${engine}-${size.name}-${slug}-playing.png`),fullPage:true});
     });if(!passed)stopLive=true;
    }else report.results.push({engine,size:size.name,title,check:'real MP4 playback, pause and seek',status:'NOT RUN',detail:'An earlier live test failed; no automatic retries or alternate endpoint.'});
    if(!stopLive){
     await result('ended poster and restart',async()=>{await media.evaluate(v=>{v.currentTime=v.duration-0.25;return v.play();});await play.waitFor({timeout:10000});assert.equal(await media.count(),0);assert.equal(await still.getAttribute('src'),record.poster);await play.click();await media.waitFor();await waitPlaying();assert(await media.evaluate(v=>v.currentTime<4));});
     await result('offline image, reconnect without autoplay and resume',async()=>{
      await media.evaluate(v=>new Promise(resolve=>{v.addEventListener('seeked',()=>resolve(),{once:true});v.currentTime=7;}));await waitPlaying();await page.waitForTimeout(150);await context.setOffline(true);await status.filter({hasText:'offline'}).waitFor();assert.equal(await media.count(),0);assert.equal(await still.getAttribute('src'),images[title].src);await still.evaluate(img=>img.decode());assert(!await play.isVisible());
      await page.screenshot({path:path.join(output,`${engine}-${size.name}-${slug}-offline.png`),fullPage:true});await context.setOffline(false);await play.waitFor();assert.equal(await media.count(),0);assert.equal(await still.getAttribute('src'),record.poster);await play.click();await media.waitFor();await waitResumed(media,7);await page.evaluate(()=>window.BibleLensStoryVideo.stop());assert.equal(await media.count(),0);
     });
    }
    const blockedByPolicy=engine==='webkit'&&process.platform==='win32';
    await result(blockedByPolicy?'CSP-blocked media restores image and offers Retry':'failed source restores image and offers Retry',async()=>{
     if(!blockedByPolicy)await context.route(record.src,r=>r.abort('failed'));if(await media.count())await page.evaluate(()=>window.BibleLensStoryVideo.stop());if(await retry.isVisible())await retry.click();else await play.click();if(blockedByPolicy){await media.waitFor();await media.evaluate(v=>{v.src='data:video/mp4;base64,AAAA';v.load();});}await retry.waitFor({timeout:20000});assert.equal(await media.count(),0);assert.equal(await still.getAttribute('src'),images[title].src);await still.evaluate(img=>img.decode());
    });
    await result('navigation tears down playback',async()=>{await retry.click();await page.getByRole('button',{name:'Read '+title,exact:true}).click();await page.locator('#chapter-text').waitFor();assert.equal(await page.locator('.story-video video').count(),0);});
   }catch(error){report.results.push({engine,size:size.name,title,check:'page setup',status:'FAIL',detail:error.message.slice(0,1200)});save();}
   finally{await context.setOffline(false).catch(()=>{});await context.close();}
  }
  await browser.close();browser=undefined;
 }
}catch(error){report.results.push({check:'runner setup',status:'FAIL',detail:error.message.slice(0,1200)});}
finally{await browser?.close();if(server)await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});report.finishedAt=new Date().toISOString();save();}
console.log('Browser report: '+path.join(output,'results.json'));console.log('Physical-device and installed-app playback remain separate checks.');process.exitCode=report.results.some(r=>r.status!=='PASS')?1:0;
