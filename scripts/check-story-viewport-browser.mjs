import {sharedUISource} from './shared-ui-fixture.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {releaseInfo} from './release-info.mjs';

// This runner never builds: run npm run build after source edits finish, then
// run this check. Deterministic fixtures test browser lifecycle, not decoding.
const plan={engines:['chromium','webkit'],sizes:[{name:'phone',width:390,height:844},{name:'ipad',width:820,height:1180}],checks:['real IntersectionObserver autoplay and neighbor preloads','continuous loop, jitter and fresh return','exclusive active player and distant unloading','manual controls, reduced motion and Save-Data','offline/reconnect, hidden page and unmount','YouTube cue-only preload protocol','approved MP4 decoding and changing frames'],policy:'enforced CSP; fixture media/API doubles are explicitly separate from live decoding'};
if(process.argv.includes('--plan')){console.log(JSON.stringify(plan,null,2));process.exit(0);}
if(process.env.SITES_MANAGED_LINUX_CONTAINER==='1'){console.error('NOT RUN: local development runner only; use supported managed browser tools.');process.exit(2);}
const option=name=>process.argv.find(arg=>arg.startsWith('--'+name+'='))?.split('=').slice(1).join('=');
const output=path.resolve(option('output')||'outputs/story-viewport-browser');fs.mkdirSync(output,{recursive:true});
const report={startedAt:new Date().toISOString(),source:releaseInfo(),plan,results:[],browserEvents:[],limits:['Viewport emulation does not verify physical devices or installed native apps.','Windows WebKit runs with compositing enabled: its default disabled-compositing test port crashes on application View Transition snapshots, including the baseline player. Production APIs and motion remain enabled.','Fixture media methods and YouTube API are doubles; their PASS results do not claim remote playback.','Visibility state is simulated because headless engines do not reliably hide background tabs. IntersectionObserver and scrolling are real.','One approved MP4 per engine is decoded live; YouTube remote availability is covered by the separate existing live runner.','Offline fixture verifies application transitions, not cold offline installation.']};
const save=()=>fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2)+'\n');
const catalog=JSON.parse(fs.readFileSync('data/story-videos.json','utf8'));
const mp4=Object.values(catalog).find(v=>v.status==='ready'&&v.provider==='mp4');
assert(mp4,'An approved MP4 record is needed');
// Keep YouTube lifecycle coverage as an explicit API fixture even when the
// production catalog contains only MP4s. This ID is never added to the app.
const activeYouTube=Object.values(catalog).filter(v=>v.status==='ready'&&v.provider==='youtube');
const youtube=activeYouTube[0]||{provider:'youtube',videoId:'BDNJ8-wtaeA',poster:mp4.poster,posterAlt:'Protocol fixture',description:'YouTube protocol fixture; not active story footage.'};
const fixtureCatalog=Object.fromEntries(Array.from({length:7},(_,i)=>['Fixture '+i,{...(i===2?youtube:mp4),poster:'/fixture.svg',src:'/fixture.mp4?card='+i}]));
const playerFixtureSource=fs.readFileSync('src/story-video.js','utf8').replace('/*__STORY_VIDEOS__*/{}',JSON.stringify(fixtureCatalog));
assert(playerFixtureSource!==fs.readFileSync('src/story-video.js','utf8'),'Fixture catalog injection marker must match');
const fixtureSource=sharedUISource+playerFixtureSource;
const fixtureBootstrap=`const root=document.getElementById('fixture');root.innerHTML=Object.keys(${JSON.stringify(fixtureCatalog)}).map(title=>'<article>'+BibleLensStoryVideo.render(title,{src:'/fixture.svg?fallback',alt:'Fixture artwork'})+'</article>').join('');BibleLensStoryVideo.mount(root);`;
const fixtureHTML='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/fixture.css"></head><body class="lens-app"><header>Scroll fixture</header><main id="fixture"></main><footer>End</footer><script src="/fixture-source.js"></script><script src="/fixture-bootstrap.js"></script></body></html>';
const revealCSS=fs.readFileSync('src/overrides.css','utf8').split('\n').filter(line=>line.includes('.story-video-reveal')||line.includes('.story-video-corner-controls')).join('\n');
const fixtureCSS='*{box-sizing:border-box}body{margin:0}header,footer{height:150vh}article{height:110vh;display:flex;align-items:center;justify-content:center}figure{margin:0;width:90%;max-width:640px}.story-video-stage{height:360px;position:relative}img,video,iframe{width:100%;height:100%;object-fit:contain}iframe{border:0}[data-video-frame]{position:absolute;inset:0}[hidden]{display:none!important}button{min-width:44px;min-height:44px}.story-video-play{position:absolute;left:45%;top:45%}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden}'+revealCSS;

// Installed before app scripts in each frame, with no network requests. Retain
// detached nodes to prove teardown clears sources rather than just removing UI.
function fixtureInit({saveData=false}={}){
 Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData,addEventListener(){},removeEventListener(){}}});
 window.__media=[];window.__yt=[];window.__csp=[];window.__bridgeEvents=[];
 window.addEventListener('message',event=>{if(event.data?.type==='biblelens:story-video')window.__bridgeEvents.push({state:event.data.state,time:event.data.time});});
 document.addEventListener('securitypolicyviolation',e=>window.__csp.push({directive:e.violatedDirective,blocked:e.blockedURI}));
 const states=new WeakMap();
 const state=v=>{if(!states.has(v)){states.set(v,{paused:true,ended:false,time:0,plays:0,loads:0});window.__media.push(v);}return states.get(v);};
 // Do not feed fake bytes to the browser decoder: that would introduce native
 // error events unrelated to the lifecycle being tested. Reflect src locally.
 const nativeGet=HTMLMediaElement.prototype.getAttribute,nativeRemove=HTMLMediaElement.prototype.removeAttribute;
 Object.defineProperty(HTMLMediaElement.prototype,'src',{configurable:true,get(){return state(this).src||'';},set(value){state(this).src=String(value);}});
 HTMLMediaElement.prototype.getAttribute=function(name){return name==='src'?(state(this).src??null):nativeGet.call(this,name);};
 HTMLMediaElement.prototype.removeAttribute=function(name){if(name==='src')delete state(this).src;else nativeRemove.call(this,name);};
 for(const [name,get]of Object.entries({paused:v=>state(v).paused,ended:v=>state(v).ended,duration:()=>30,readyState:()=>4,videoWidth:()=>1280,videoHeight:()=>720}))Object.defineProperty(HTMLMediaElement.prototype,name,{configurable:true,get(){return get(this);}});
 Object.defineProperty(HTMLMediaElement.prototype,'currentTime',{configurable:true,get(){return state(this).time;},set(value){state(this).time=value;}});
 HTMLMediaElement.prototype.load=function(){const s=state(this);s.loads++;if(this.getAttribute('src'))queueMicrotask(()=>this.dispatchEvent(new Event('loadedmetadata')));};
 HTMLMediaElement.prototype.play=function(){const s=state(this);s.paused=false;s.ended=false;s.plays++;queueMicrotask(()=>this.dispatchEvent(new Event('playing')));return Promise.resolve();};
 HTMLMediaElement.prototype.pause=function(){const s=state(this),was=s.paused;s.paused=true;if(!was)this.dispatchEvent(new Event('pause'));};
 window.__stats=()=>window.__media.map(v=>({connected:v.isConnected,src:v.getAttribute('src'),muted:v.muted,loop:v.loop,preload:v.preload,controls:v.controls,...state(v)}));
 window.__end=index=>{const v=document.querySelectorAll('[data-story-video]')[index].querySelector('video'),s=state(v);s.time=30;s.paused=true;s.ended=true;v.dispatchEvent(new Event('ended'));};
 window.__hidden=value=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>value});Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>value?'hidden':'visible'});document.dispatchEvent(new Event('visibilitychange'));};
 window.YT={Player:class{
  constructor(id,options){this.options=options;this.time=0;this.state=-1;this.frame=document.createElement('iframe');this.frame.title='Fixture YouTube';document.getElementById(id).appendChild(this.frame);window.__yt.push(this);setTimeout(()=>{options.events.onReady({target:this});},0);}
  getIframe(){return this.frame;}getCurrentTime(){return this.time;}getPlayerState(){return this.state;}
  mute(){this.muted=true;}unMute(){this.muted=false;}isMuted(){return !!this.muted;}
  cueVideoById(value){this.cue=value;this.state=5;this.options.events.onStateChange({data:5});}
  loadVideoById(value){this.loaded=value;this.playVideo();}
  seekTo(value){this.time=value;}
  playVideo(){this.plays=(this.plays||0)+1;this.state=1;this.options.events.onStateChange({data:1});}
  pauseVideo(){this.state=2;this.options.events.onStateChange({data:2});}
  stopVideo(){this.state=0;}destroy(){this.destroyed=true;this.frame.remove();}
 }};
}
let server,browser,stopLive=false;
try{
 let built;try{built=JSON.parse(fs.readFileSync('dist/client/release.json','utf8'));}catch{}
 if(!process.argv.includes('--fixture-only'))assert.equal(built?.sourceHash,report.source.sourceHash,'Build is missing/stale. Run npm run build after edits finish; this runner does not build.');
 const {default:worker}=await import('./built-worker.mjs'),engines=await import('playwright');
 if(process.argv.includes('--fixture-only')){
  // Fixture controller source is loaded directly above. Only these bridge
  // assets come from the build, so validate their actual bytes rather than a
  // global fingerprint which also changes when the test runner is edited.
  const normalize=value=>value.replace(/\r\n/g,'\n');
  for(const name of ['story-video-player.js','story-video-player.html','story-video-player.css']){
   const response=await worker.fetch(new Request('http://127.0.0.1/'+name),{},{});assert.equal(response.status,200,'Built bridge asset missing: '+name);
   let actual=normalize(await response.text()),expected=normalize(fs.readFileSync('src/'+name,'utf8'));
   if(name.endsWith('.js'))expected=expected.replace('/*__STORY_VIDEO_IDS__*/[]',JSON.stringify(Object.values(catalog).filter(v=>v.status==='ready'&&v.provider==='youtube').map(v=>v.videoId)));
   if(name.endsWith('.html')){assert(actual.includes('http-equiv="Content-Security-Policy"'),'Built bridge must retain enforced CSP');actual=actual.replace(/<meta http-equiv="Content-Security-Policy" content="[^"]*">/,'');}
   assert.equal(actual,expected,'Built bridge is stale: '+name);
  }
 }
 server=http.createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,`http://127.0.0.1:${server.address().port}`);
   if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
   const fixtures={'/fixture.html':['text/html',fixtureHTML],'/fixture.css':['text/css',fixtureCSS],'/fixture-source.js':['text/javascript',fixtureSource],'/fixture-bootstrap.js':['text/javascript',fixtureBootstrap],'/fixture.svg':['image/svg+xml','<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675"><rect width="1200" height="675" fill="#345"/></svg>']};
   if(fixtures[url.pathname]){const [type,body]=fixtures[url.pathname];res.writeHead(200,{'content-type':type,'content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; media-src 'self'; frame-src 'self'; object-src 'none'"});res.end(body);return;}
   if(url.pathname==='/fixture.mp4'){res.writeHead(204);res.end();return;}
   // Only this isolated browser-fixture server admits its explicit API double.
   // The packaged production bridge retains the actual active catalog IDs.
   if(url.pathname==='/story-video-player.js'&&!activeYouTube.length){res.writeHead(200,{'content-type':'text/javascript'});res.end(fs.readFileSync('src/story-video-player.js','utf8').replace('/*__STORY_VIDEO_IDS__*/[]',JSON.stringify([youtube.videoId])));return;}
   const response=await worker.fetch(new Request(url,{method:req.method,headers:req.headers}),{},{}),headers=Object.fromEntries(response.headers);
   // The app report-only policy is not the player policy. The bridge carries
   // its own enforced CSP meta tag permitting the official YouTube API.
   if(url.pathname==='/'&&headers['content-security-policy-report-only'])headers['content-security-policy']=headers['content-security-policy-report-only'];
   res.writeHead(response.status,headers);res.end(req.method==='HEAD'?undefined:Buffer.from(await response.arrayBuffer()));
  }catch(error){res.writeHead(500);res.end('Preview failed');console.error(error.message);}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const base=`http://127.0.0.1:${server.address().port}`;
 for(const engine of plan.engines){
  if(option('engine')&&option('engine')!==engine)continue;
  // Playwright's Windows WebKit default disables compositing. Its software
  // snapshot path crashes on this app's View Transitions, even with the old
  // manual-only player. Use the supported launch option, not an app/API stub.
  // DEBUG=pw:browser additionally captures native process stderr for diagnosis.
  const launchOptions=engine==='webkit'&&process.platform==='win32'?{ignoreDefaultArgs:['--disable-accelerated-compositing']}:{};
  try{browser=await engines[engine].launch(launchOptions);}catch(error){report.results.push({engine,check:'launch',status:'NOT RUN',detail:error.message});save();continue;}
  let expectedBrowserClose=false;browser.on('disconnected',()=>{report.browserEvents.push({engine,event:'disconnected',expected:expectedBrowserClose,at:new Date().toISOString()});save();});
  for(const size of plan.sizes){
   if(option('size')&&option('size')!==size.name)continue;
   async function scenario(name,options,run){
    if(option('check')&&!name.toLowerCase().includes(option('check').toLowerCase()))return;
    const context=await browser.newContext({viewport:{width:size.width,height:size.height},serviceWorkers:'block',reducedMotion:options.reduce?'reduce':'no-preference'});
    const page=await context.newPage(),diagnostics=[];
    page.on('crash',()=>diagnostics.push({type:'page crash'}));
    page.on('pageerror',error=>diagnostics.push({type:'pageerror',message:error.message}));
    page.on('console',message=>{if(message.type()==='error')diagnostics.push({type:'console',message:message.text().slice(0,1000)});});
    page.on('requestfailed',request=>{const u=new URL(request.url());diagnostics.push({type:'requestfailed',url:u.origin+u.pathname,error:request.failure()?.errorText});});
    page.on('response',response=>{if(response.status()>=400){const u=new URL(response.url());diagnostics.push({type:'response',url:u.origin+u.pathname,status:response.status()});}});
    await page.addInitScript(fixtureInit,{saveData:!!options.saveData});
    // Local API double only: never fetch third-party media in lifecycle tests.
    await context.route('https://www.youtube.com/iframe_api',r=>r.fulfill({contentType:'text/javascript',body:'window.onYouTubeIframeAPIReady();'}));
    const unexpected=[];await context.route('**/*',async r=>{const u=new URL(r.request().url());if(u.origin===base||u.href==='https://www.youtube.com/iframe_api')return r.fallback();unexpected.push(u.origin+u.pathname);return r.abort();});
    try{
     await page.goto(base+'/fixture.html');await page.locator('[data-story-video]').nth(6).waitFor({state:'attached'});
     const card=i=>page.locator('[data-story-video]').nth(i);
     const center=async i=>{await card(i).evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));await page.waitForTimeout(500);};
     const stats=()=>page.evaluate(()=>window.__stats());
     const playing=()=>page.waitForFunction(()=>window.__stats().some(s=>s.connected&&!s.paused));
     await run({page,context,card,center,stats,playing});
     assert.deepEqual(unexpected,[],'Fixture must not make live third-party requests');
     assert.deepEqual(await page.evaluate(()=>window.__csp),[],'Fixture CSP violations');
     report.results.push({engine,size:size.name,check:name,status:'PASS'});console.log('PASS',engine,size.name,name);
    }catch(error){
     const frames=await Promise.all(page.frames().map(async frame=>({url:frame.url().split('?')[0],probe:await frame.evaluate(()=>({csp:window.__csp,events:window.__bridgeEvents,yt:window.__yt?.map(p=>({state:p.state,plays:p.plays,vars:p.options.playerVars,destroyed:p.destroyed})),cards:[...document.querySelectorAll('[data-story-video]')].map(el=>({title:el.dataset.storyVideo,status:el.querySelector('[data-video-status]')?.textContent,frames:el.querySelectorAll('iframe').length}))})).catch(error=>({error:error.message}))})));
     report.results.push({engine,size:size.name,check:name,status:'FAIL',detail:error.message.slice(0,1600),diagnostics,frames});await page.screenshot({path:path.join(output,`${engine}-${size.name}-${name.replace(/[^a-z]+/gi,'-')}.png`),fullPage:false}).catch(()=>{});console.error('FAIL',engine,size.name,name,error.message);
    }
    finally{await context.close();save();}
   }
   await scenario('autoplay, preload, once per viewing and teardown',{},async({page,card,center,stats,playing})=>{
    await center(4);await playing();
    let current=card(4).locator('video');assert(await current.evaluate(v=>!v.paused&&v.muted&&v.loop&&!v.controls&&v.playsInline));
    assert.equal((await stats()).filter(s=>s.connected&&!s.paused).length,1);
    const reveal=card(4).getByRole('button',{name:'Show controls for Fixture 4'});
    assert.equal(await reveal.evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
    await reveal.click();assert(await current.evaluate(v=>v.controls&&!v.paused));
    for(const i of [3,5,6]){const v=card(i).locator('video');assert.equal(await v.count(),1,'Adjacent MP4 exists');assert.equal(await v.getAttribute('preload'),'auto');assert(await v.evaluate(v=>v.paused&&!!v.getAttribute('src')));}
    const previous = card(2).locator('iframe');
    assert.equal(new URL(await previous.getAttribute('src')).searchParams.get('autoplay'),'0');
    for(const i of [0,1])assert.equal(await card(i).locator('video,iframe').count(),0,'Distant media is unloaded');
    const before=(await stats()).reduce((n,v)=>n+v.plays,0);await page.evaluate(()=>window.__end(4));await page.waitForTimeout(300);
    for(const dy of [8,-12,7,-3]){await page.evaluate(y=>scrollBy(0,y),dy);await page.waitForTimeout(100);}
    assert.equal((await stats()).reduce((n,v)=>n+v.plays,0),before+1,'Ended video loops once without extra jitter restarts');
    await card(4).locator('.story-video-stage').evaluate(el=>{const r=el.getBoundingClientRect();scrollTo(0,scrollY+r.bottom-72);});await page.waitForTimeout(650);await center(4);
    assert.equal((await stats()).reduce((n,v)=>n+v.plays,0),before+1,'Partial visibility below retention threshold must not rearm playback');
    await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(700);await center(4);await playing();
    assert((await stats()).reduce((n,v)=>n+v.plays,0)>before,'Full leave and return starts a fresh viewing');
    assert(await card(4).locator('video').evaluate(v=>v.currentTime<1&&!v.controls));
    await center(1);await playing();assert.equal((await stats()).filter(s=>s.connected&&!s.paused).length,1);assert.equal(await card(4).locator('video,iframe').count(),0);
    await page.evaluate(()=>BibleLensStoryVideo.unmount(document.getElementById('fixture')));
    assert.equal(await page.locator('video, [data-video-frame] iframe').count(),0);
    assert((await stats()).every(s=>s.paused&&!s.src),'Unmount releases all media sources');
   });
   await scenario('YouTube neighbor cue and explicit controls',{},async({page,card,center})=>{
    await center(1);const iframe=card(2).locator('iframe');await iframe.waitFor({state:'attached'});const frame=await iframe.elementHandle().then(h=>h.contentFrame());
    await frame.waitForFunction(()=>window.__yt.length>0);
    const state=await frame.evaluate(()=>{const p=window.__yt[0];return {vars:p.options.playerVars,videoId:p.options.videoId,cue:p.cue,plays:p.plays||0};});
    assert.equal(state.vars.autoplay,0,'Neighbor YouTube API must not autoplay');assert.equal(state.plays,0);assert.equal(state.videoId,youtube.videoId,'The API is initialized with the selected video cued and autoplay disabled');assert.equal(state.vars.mute,1);
    await center(2);await frame.waitForFunction(()=>window.__yt.some(p=>p.plays>0));
    assert(await frame.evaluate(()=>window.__yt.some(p=>p.muted)),'Viewport autoplay is muted');
    assert.equal(await card(2).locator('[data-video-image]').count(),0);await page.evaluate(()=>window.BibleLensStoryVideo.stop());
    const play=card(2).locator('[data-video-play]');await play.waitFor();assert(await play.getAttribute('aria-label'));await play.focus();assert(await play.evaluate(el=>el===document.activeElement));
   });
   for(const mode of ['reduced motion','Save-Data'])await scenario(mode+' disables automatic work',{reduce:mode==='reduced motion',saveData:mode==='Save-Data'},async({page,card,center,playing,stats})=>{
    await center(4);assert.equal(await page.locator('video, [data-video-frame] iframe').count(),0,'Preference prevents autoplay AND neighbor preloads');
    await card(4).locator('[data-video-play]').press('Enter');await playing();
    const video=card(4).locator('video'),reveal=card(4).getByRole('button',{name:/Show controls for/});
    assert(await video.evaluate(v=>!v.controls&&v.playsInline));assert(await reveal.evaluate(el=>el===document.activeElement));
    await reveal.press('Enter');assert(await video.evaluate(v=>v.controls&&v===document.activeElement));assert.equal(await reveal.count(),0);assert.equal((await stats()).filter(s=>s.connected).length,1);
    await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(400);assert((await stats()).every(s=>s.paused),'Offscreen explicit playback stops');
   });
   await scenario('offline, reconnect and hidden page',{},async({page,context,card,center,playing,stats})=>{
    await center(4);await playing();await context.setOffline(true);await card(4).locator('[data-video-status]').filter({hasText:'offline'}).waitFor();
    assert.equal(await card(4).locator('[data-video-still]').getAttribute('src'),'/fixture.svg?fallback');assert((await stats()).every(s=>s.paused&&!s.src));
    const plays=(await stats()).reduce((n,s)=>n+s.plays,0);await context.setOffline(false);await page.waitForTimeout(500);assert.equal((await stats()).reduce((n,s)=>n+s.plays,0),plays,'Reconnect does not replay automatically');
    await card(4).locator('[data-video-play]').click();await playing();await page.evaluate(()=>window.__hidden(true));await page.waitForTimeout(200);assert((await stats()).every(s=>s.paused),'Hidden document stops every player');
    await page.evaluate(()=>window.__hidden(false));await page.waitForTimeout(250);assert((await stats()).every(s=>s.paused),'Becoming visible does not replay without a fresh viewing');
   });
   for(const interruption of ['hidden page','offline','reduced motion change'])await scenario(interruption+' preserves unseen viewings',{},async({page,context,card,center,playing})=>{
    await center(4);await playing();await page.waitForTimeout(700); // Initial zero-ratio timers have expired.
    if(interruption==='hidden page'){await page.evaluate(()=>window.__hidden(true));await page.evaluate(()=>window.__hidden(false));}
    else if(interruption==='offline'){await context.setOffline(true);await card(4).locator('[data-video-status]').filter({hasText:'offline'}).waitFor();await context.setOffline(false);}
    else{await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);await page.emulateMedia({reducedMotion:'no-preference'});}
    await page.waitForTimeout(300);assert.equal(await card(4).locator('video').count(),0,'Restoration must not replay the interrupted viewing');
    await center(1);await playing();assert(await card(1).locator('video').evaluate(v=>!v.paused&&v.muted),'Previously unseen story still autoplays on its first viewing');
   });
  }
  // One real approved MP4 per engine, not per size or story, bounds bandwidth.
  if(!stopLive&&!process.argv.includes('--fixture-only')){
   const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference',serviceWorkers:'block'}),page=await context.newPage();
   const diagnostics=[],checkpoints=[];let closing=false;
   page.on('crash',()=>diagnostics.push({type:'page crash'}));
   page.on('close',()=>diagnostics.push({type:'page closed',expected:closing}));
   context.on('close',()=>diagnostics.push({type:'context closed',expected:closing}));
   page.on('pageerror',error=>diagnostics.push({type:'pageerror',message:error.message}));
   try{
    await page.goto(base+'/#stories/genesis/the-fall-of-man');checkpoints.push('page loaded');const card=page.locator('#story-the-fall-of-man .story-video');await card.waitFor();checkpoints.push('story card visible');await card.evaluate(el=>el.scrollIntoView({block:'center'}));const video=card.locator('video');await video.waitFor();
    await page.waitForFunction(()=>{const v=document.querySelector('.story-video video');return v&&!v.paused&&v.currentTime>1&&v.videoWidth>0&&v.readyState>=2;},null,{timeout:20000});
    assert(await video.evaluate(v=>v.muted&&v.loop&&!v.controls&&v.playsInline));checkpoints.push('muted autoplay decoded and advanced');
    const firstTime=await video.evaluate(v=>v.currentTime);const first=await video.screenshot();await page.waitForTimeout(1500);const second=await video.screenshot();assert(await video.evaluate(v=>v.currentTime)>firstTime+0.5);assert(!first.equals(second),'Decoded video frames must change');
    checkpoints.push('changing frames verified');await page.getByRole('button',{name:'Read The Fall of Man',exact:true}).click();await page.locator('#chapter-text').waitFor();assert.equal(await page.locator('.story-video video').count(),0);checkpoints.push('reader navigation released video');
    report.results.push({engine,check:'live approved MP4 muted autoplay, frames and navigation',status:'PASS',checkpoints,diagnostics});
   }catch(error){stopLive=true;report.results.push({engine,check:'live approved MP4 muted autoplay, frames and navigation',status:'FAIL',detail:error.message.slice(0,1600),checkpoints,diagnostics});}
   finally{closing=true;await context.close();save();}
  }else report.results.push({engine,check:'live approved MP4 muted autoplay, frames and navigation',status:'NOT RUN',detail:stopLive?'Earlier live failure; no retries or alternate host.':'--fixture-only requested'});
  expectedBrowserClose=true;await browser.close();browser=undefined;
 }
}catch(error){report.results.push({check:'runner setup',status:'FAIL',detail:error.message.slice(0,1600)});}
finally{await browser?.close();if(server)await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});report.finishedAt=new Date().toISOString();save();}
console.log('Browser report: '+path.join(output,'results.json'));
process.exitCode=report.results.some(r=>r.status!=='PASS'&&!(process.argv.includes('--fixture-only')&&r.status==='NOT RUN'&&r.detail==='--fixture-only requested'))?1:0;
