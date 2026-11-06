import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {releaseInfo} from './release-info.mjs';

const plan={engines:['chromium','webkit'],sizes:[{name:'phone',width:390,height:844},{name:'ipad',width:820,height:1180}],checks:['poster and reserved layout','no browsing autoplay','real YouTube playing/time events','warm offline fallback and reconnection','blocked player fallback and Retry','navigation stops playback']};
if(process.argv.includes('--plan')){console.log(JSON.stringify(plan,null,2));process.exit(0);}
// No live YouTube request is relevant when every active story uses MP4.
if(!Object.values(JSON.parse(fs.readFileSync('data/story-videos.json','utf8'))).some(v=>v.status==='ready'&&v.provider==='youtube')){
 console.log('NOT APPLICABLE: no active YouTube story videos; run the MP4 and viewport browser checks.');process.exit(0);
}
// Managed Linux preview/browser access must use the provided desktop tools.
// Fail before building, opening a port or launching any replacement browser.
if(process.env.SITES_MANAGED_LINUX_CONTAINER==='1'){
 console.error('Browser checks were NOT RUN. This command is for the existing local Mac/development checkout. Managed Linux must use its supported browser/preview tools; none are started by this command.');process.exit(2);
}
const output=path.resolve('outputs/creation-video-browser');fs.mkdirSync(output,{recursive:true});
const report={startedAt:new Date().toISOString(),source:releaseInfo(),results:[],limits:['Viewport emulation is not physical iPhone/iPad testing.','The offline check uses an already-loaded page and cached fallback image.'],plan};
const save=()=>fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2)+'\n');
let server,browser;
try{
 // Build only when the saved output does not match this exact source tree.
 let built;try{built=JSON.parse(fs.readFileSync('dist/client/release.json','utf8'));}catch{}
 if(built?.sourceHash!==report.source.sourceHash)execFileSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});
 const {default:worker}=await import('./built-worker.mjs');
 const {default:http}=await import('node:http');
 const engines=await import('playwright');
 server=http.createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,`http://127.0.0.1:${server.address().port}`);
   if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
   const response=await worker.fetch(new Request(url,{method:req.method,headers:req.headers}),{},{});
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(req.method==='HEAD'?undefined:Buffer.from(await response.arrayBuffer()));
  }catch{res.writeHead(500);res.end('Preview request failed.');}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const base=`http://127.0.0.1:${server.address().port}`,record=JSON.parse(fs.readFileSync('data/story-videos.json','utf8'))['The Creation'];
 assert.equal(record.status,'ready','The reviewed pilot must be active');
 const fallback=JSON.parse(fs.readFileSync('data/story-images.json','utf8'))['The Creation'];
 let stopLive=false;
 for(const engine of plan.engines){
  try{browser=await engines[engine].launch();}
  catch(error){report.results.push({engine,check:'browser launch',status:'NOT RUN',detail:error.message});stopLive=true;save();continue;}
  for(const size of plan.sizes){
   const context=await browser.newContext({viewport:{width:size.width,height:size.height},reducedMotion:'reduce',serviceWorkers:'block'});
   const page=await context.newPage(),network=[],videoRequests=[];
   // Keep diagnostics free of signed query values, headers and account data.
   const safeUrl=value=>{const u=new URL(value);return u.origin+u.pathname;};
   page.on('request',request=>{if(/\.(?:youtube\.com|youtube-nocookie\.com|ytimg\.com|googlevideo\.com)$/.test(new URL(request.url()).hostname))videoRequests.push(safeUrl(request.url()));});
   page.on('requestfailed',request=>network.push({url:safeUrl(request.url()),error:request.failure()?.errorText}));
   page.on('response',response=>{if(response.status()>=400)network.push({url:safeUrl(response.url()),status:response.status()});});
   await page.addInitScript(()=>{window.__storyVideoProbe=[];window.addEventListener('message',event=>{
    const frame=document.querySelector('.story-video iframe');
    if(frame&&event.source===frame.contentWindow&&event.origin===new URL(frame.src).origin&&event.data?.type==='biblelens:story-video'){
     window.__storyVideoProbe.push({state:event.data.state,time:event.data.time});if(window.__storyVideoProbe.length>128)window.__storyVideoProbe.shift();
    }
   });});
   const result=async(check,run)=>{try{await run();report.results.push({engine,size:size.name,check,status:'PASS'});console.log('PASS',engine,size.name,check);return true;}
    catch(error){const states=await page.evaluate(()=>window.__storyVideoProbe).catch(()=>[]);await page.screenshot({path:path.join(output,`${engine}-${size.name}-${check.replace(/[^a-z]+/gi,'-')}-failure.png`),fullPage:true}).catch(()=>{});report.results.push({engine,size:size.name,check,status:'FAIL',detail:error.message.slice(0,1500),states,network:[...network]});console.error('FAIL',engine,size.name,check,error.message);return false;}finally{save();}};
   try{
    await page.goto(base+'/#stories/genesis/the-creation');await page.locator('#story-the-creation .story-video').waitFor();
    const figure=page.locator('#story-the-creation .story-video'),play=figure.locator('[data-video-play]'),still=figure.locator('[data-video-still]');
    await result('poster and layout',async()=>{
     assert.equal(await still.getAttribute('src'),record.poster);await still.evaluate(img=>img.decode());assert.equal(await figure.locator('iframe').count(),0);assert.equal(videoRequests.length,0,'Browsing must not contact YouTube');
     assert(await play.isVisible());const stage=await figure.locator('.story-video-stage').boundingBox(),bounds=await figure.boundingBox();assert(stage.width>=200&&stage.height>=200);assert(stage.x>=bounds.x-1&&stage.x+stage.width<=bounds.x+bounds.width+1,'Video stage must fit inside the story figure');
     assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Horizontal overflow');
     await page.screenshot({path:path.join(output,`${engine}-${size.name}-poster.png`),fullPage:true});
    });
    // Prime only the ordinary fallback image, so this tests a warm offline
    // transition without pretending to verify a fresh offline app installation.
    await page.evaluate(async src=>{const img=new Image();img.src=src;await img.decode();window.__offlineStoryImage=img;},fallback.src);
    if(!stopLive){
     const passed=await result('real YouTube playback',async()=>{
      await play.click();
      // If the browser blocks autoplay, use the player's own visible Play control.
      const nativePlay=page.frameLocator('.story-video iframe').frameLocator('#player').getByRole('button',{name:/^(Play|Play video|Play \(k\))$/}).first();
      try{await nativePlay.click({timeout:5000});}catch{}
      await page.waitForFunction(()=>window.__storyVideoProbe.some(e=>e.state==='playing')&&window.__storyVideoProbe.some(e=>e.state==='time'&&e.time>1)||document.querySelector('[data-video-retry]')?.getClientRects().length,{},{timeout:45000});
      assert(await page.evaluate(()=>window.__storyVideoProbe.some(e=>e.state==='playing')&&window.__storyVideoProbe.some(e=>e.state==='time'&&e.time>1)),await figure.locator('[data-video-status]').innerText()||'No actual playing/time event arrived');
     });
     // A failed real request ends further live attempts. Continue independent
     // local fallback/layout checks, without trying alternate YouTube endpoints.
     if(!passed)stopLive=true;
    }else report.results.push({engine,size:size.name,check:'real YouTube playback',status:'NOT RUN',detail:'Earlier live check failed; no automatic retry or alternate endpoint.'});
    await result('offline fallback and reconnect',async()=>{
     await context.setOffline(true);await figure.locator('[data-video-status]').filter({hasText:'offline'}).waitFor();assert.equal(await still.getAttribute('src'),fallback.src);assert(await still.isVisible());await still.evaluate(img=>img.decode());assert.equal(await figure.locator('iframe').count(),0);assert(!await play.isVisible());
     await page.screenshot({path:path.join(output,`${engine}-${size.name}-offline.png`),fullPage:true});
     await context.setOffline(false);await play.waitFor();assert.equal(await still.getAttribute('src'),record.poster);assert.equal(await figure.locator('iframe').count(),0,'Reconnection must not autoplay');
    });
    await result('blocked player fallback and Retry',async()=>{
     await context.route('**/story-video-player.html*',route=>route.abort('failed'));
     await play.click();await figure.locator('[data-video-retry]').waitFor({timeout:20000});assert.equal(await still.getAttribute('src'),fallback.src);assert(await still.isVisible());await still.evaluate(img=>img.decode());assert.equal(await figure.locator('iframe').count(),0);
    });
    await result('navigation tears down playback',async()=>{
     await figure.locator('[data-video-retry]').click();await page.getByRole('button',{name:'Read The Creation',exact:true}).click();await page.locator('#verse-1').waitFor();assert.equal(await figure.locator('iframe').count(),0);
    });
   }catch(error){report.results.push({engine,size:size.name,check:'page setup',status:'FAIL',detail:error.message.slice(0,1500),network});save();}
   finally{await context.setOffline(false).catch(()=>{});await context.close();}
  }
  await browser.close();browser=undefined;
 }
}catch(error){report.results.push({check:'runner setup',status:'FAIL',detail:error.message.slice(0,1500)});}
finally{
 await browser?.close();if(server)await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});
 report.finishedAt=new Date().toISOString();save();
}
const incomplete=report.results.some(row=>row.status!=='PASS');
console.log(`Browser report: ${path.join(output,'results.json')}`);
console.log('Physical iPhone/iPad playback and installed-asset parity still require the connected-device release session.');
process.exitCode=incomplete?1:0;
