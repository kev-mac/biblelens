import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
import {releaseInfo} from './release-info.mjs';

const base=process.env.BIBLELENS_PREVIEW_URL,phase=process.env.BIBLELENS_CENTERING_PHASE;
assert(base&&['before','after'].includes(phase),'Set an authorized preview and before/after phase.');
const output='.release/explore-centering/'+phase,results=[];
const ids=['stories','people','places','commandments','lost','evidence','timeline'];
const screens=[[320,844],[390,844],[493,983],[767,1024],[768,1024],[983,493],[820,1180],[1180,820],[1440,900]];
const previous=phase==='after'?JSON.parse(fs.readFileSync('.release/explore-centering/before/matrix.json')):[];
const expected=phase==='before'?{version:'1.1.0',buildNumber:402,sourceHash:'ff4463907cb1ca89830974c21bf83ad514e43f733b7d7ba8a50ece757ec66544'}:releaseInfo();
fs.mkdirSync(output,{recursive:true});
async function settle(page){
 await page.evaluate(async()=>{
  await document.fonts.ready;
  await Promise.all([...document.querySelectorAll('#ux-lane-collections img')].map(image=>image.decode()));
  await Promise.all(document.getAnimations().filter(a=>'transitionProperty' in a).map(a=>a.finished.catch(()=>{})));
  await new Promise((resolve,reject)=>{const row=document.getElementById('ux-lane-collections');let old=row.scrollLeft,stable=0;const start=performance.now();function frame(){const x=row.scrollLeft;stable=Math.abs(x-old)<.1?stable+1:0;old=x;if(stable>=8)return resolve();if(performance.now()-start>5000)return reject(Error('Carousel did not settle'));requestAnimationFrame(frame);}requestAnimationFrame(frame);});
 });
 await page.locator('.fetch-retry-status').waitFor({state:'hidden'});
}
async function measure(page){return page.evaluate(()=>{
 const main=document.getElementById('main'),view=document.getElementById('explore-view'),section=view.querySelector('.ux-topic-section'),row=document.getElementById('ux-lane-collections'),card=row.querySelector('.ux-topic-centered'),field=document.getElementById('ux-explore-search');
 const rect=node=>node.getBoundingClientRect().toJSON(),style=node=>{const s=getComputedStyle(node);return {display:s.display,gridTemplateColumns:s.gridTemplateColumns,paddingLeft:s.paddingLeft,paddingRight:s.paddingRight,marginInlineStart:s.marginInlineStart,marginInlineEnd:s.marginInlineEnd,filter:s.filter};};
 const root=document.documentElement,available=root.clientWidth,center=available/2,c=rect(card),r=rect(row),activeStyle=getComputedStyle(card);
 const visible=node=>{const s=getComputedStyle(node),b=rect(node);return s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0'&&b.width>0&&b.height>0&&b.right>0&&b.left<available&&b.bottom>0&&b.top<innerHeight;};
 const rails=[...document.querySelectorAll('aside,[role=complementary],.directory-letter-rail,.directory-letter-edge')].filter(visible).map(node=>({id:node.id,className:node.className,rect:rect(node)}));
 const inactive=[...row.querySelectorAll('.ux-topic:not(.ux-topic-centered)')].map(node=>({id:node.id,filter:getComputedStyle(node).filter}));
 return {id:card.id,viewport:{innerWidth,clientWidth:available,layoutWidth:rect(root).width,reservedGutterPixels:available-rect(root).width,scrollbarGutter:getComputedStyle(root).scrollbarGutter,actualVerticalOverflow:root.scrollHeight>root.clientHeight,visualWidth:visualViewport?.width,visualOffsetLeft:visualViewport?.offsetLeft,scrollbarWidth:innerWidth-available,mobileLaneQuery:matchMedia('(max-width:767px)').matches,center},active:{...c,center:(c.left+c.right)/2,error:(c.left+c.right)/2-center,filter:activeStyle.filter,color:activeStyle.color,aspectRatio:activeStyle.aspectRatio,minHeight:activeStyle.minHeight,borderRadius:activeStyle.borderRadius,imageFit:getComputedStyle(card.querySelector('img')).objectFit,imagePosition:getComputedStyle(card.querySelector('img')).objectPosition,overlay:getComputedStyle(card,'::after').backgroundImage},main:{rect:rect(main),style:style(main)},view:rect(view),section:rect(section),row:{rect:r,center:(r.left+r.right)/2,style:style(row),scrollLeft:row.scrollLeft},field:rect(field),visibleRails:rails,inactive,pageOverflow:root.scrollWidth>available+1};
 });}
function assertCentered(value){
 assert(Math.abs(value.active.error)<=1.5,'Active card misses the usable viewport center: '+JSON.stringify(value));
 assert(Math.abs(value.row.center-value.viewport.center)<=1,'Lane itself must be centered in the usable viewport');
 assert(Math.abs((value.field.left+value.field.right)/2-value.viewport.center)<=1,'Search and carousel share the viewport center');
 assert.equal(value.viewport.scrollbarGutter,'auto','Explore does not reserve a scrollbar gutter when it does not need scrolling');
 assert(Math.abs(value.viewport.reservedGutterPixels)<=1,'No empty right-side root gutter remains');
 assert(!value.pageOverflow);assert.equal(value.active.filter,'none');assert.equal(value.visibleRails.length,0,'Explore must not display a directory/complementary rail');
}
async function choose(page,index){await page.locator('#explore-view .ux-lane-page').nth(index).tap();await page.waitForFunction(id=>document.getElementById('ux-topic-'+id)?.classList.contains('ux-topic-centered'),ids[index]);await settle(page);}
try{for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
 try{for(const [width,height]of screens)for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[],positions=[];
  page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(20000);
  try{
   assert.deepEqual(await(await page.request.get(base+'/release.json')).json(),expected);
   await page.goto(base+'/#discover');await page.locator('#ux-topic-stories').waitFor();await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);await settle(page);
   assert.equal(await page.locator('#explore-view .ux-topic-section').count(),1);assert.equal(await page.locator('#ux-lane-collections .ux-topic').count(),7);
   const old=previous.find(row=>row.engine===engine&&row.width===width&&row.height===height&&row.theme===theme);
   for(let index=0;index<ids.length;index++){
    await choose(page,index);const value=await measure(page);assert.equal(value.id,'ux-topic-'+ids[index]);assert.equal(value.active.filter,'none');assert(!value.pageOverflow);assert.equal(value.visibleRails.length,0);
    if(phase==='before'){
     const offset=value.viewport.mobileLaneQuery?-24:0,mainCenter=(value.main.rect.left+value.main.rect.right)/2;assert(Math.abs(value.active.center-mainCenter-offset)<=1.5,'Record the lane offset separately from the additional reserved root gutter: '+JSON.stringify({engine,width,height,value}));
    }else{
     assertCentered(value);assert(old&&old.positions[index].id===value.id,'Missing actual build 402 position');const prior=old.positions[index];
     for(const key of ['aspectRatio','minHeight','borderRadius','imageFit','imagePosition'])assert.equal(value.active[key],prior.active[key],'Preserve responsive card sizing and artwork rules: '+key);
     if(Math.abs(value.section.width-prior.section.width)<=1)assert(Math.abs(value.active.width-prior.active.width)<=1&&Math.abs(value.active.height-prior.active.height)<=1,'Unchanged available width preserves actual card dimensions');
     else assert(value.active.width>=prior.active.width-1&&value.active.width-prior.active.width<=Math.abs(value.section.width-prior.section.width)+1,'Responsive cards may use only the space reclaimed from the gutter');
     assert.equal(value.active.color,prior.active.color);assert.equal(value.active.overlay,prior.active.overlay,'Active artwork shading remains unchanged');
     const brightness=filter=>Number(/brightness\(([^)]+)\)/.exec(filter)?.[1]);for(let i=0;i<value.inactive.length;i++)assert(brightness(value.inactive[i].filter)<brightness(prior.inactive[i].filter),'Every inactive card becomes darker');
     if(prior.viewport.mobileLaneQuery)assert(Math.abs(value.active.error)<Math.abs(prior.active.error)-20,'The existing phone offset is resolved, not ignored as a stale report');
    }
    positions.push(value);
    if([0,3,5,6].includes(index))await page.screenshot({path:`${output}/${engine}-${width}x${height}-${theme}-${ids[index]}.png`,fullPage:false});
   }
   const gestures=[];
   if(phase==='after'){
    const lane=page.locator('#ux-lane-collections');
    for(const [key,index]of [['Home',0],['ArrowRight',1],['End',6]]){await lane.focus();await page.keyboard.press(key);await page.waitForFunction(id=>document.getElementById('ux-topic-'+id).classList.contains('ux-topic-centered'),ids[index]);await settle(page);assertCentered(await measure(page));}
    await choose(page,5);
    const target=await page.evaluate(()=>{const row=document.getElementById('ux-lane-collections'),active=row.querySelector('.ux-topic-centered'),next=active.nextElementSibling,a=active.getBoundingClientRect(),b=next.getBoundingClientRect(),r=row.getBoundingClientRect();const left=Math.max(a.right,b.left,r.left),right=Math.min(b.right,r.right),top=Math.max(b.top,r.top,0),bottom=Math.min(b.bottom,r.bottom,innerHeight);return {x:(left+right)/2,y:(top+bottom)/2,width:right-left,height:bottom-top};});
    assert(target.width>4&&target.height>4,'The background Timeline edge can be selected');await page.mouse.click(target.x,target.y);await page.waitForFunction(()=>document.getElementById('ux-topic-timeline').classList.contains('ux-topic-centered'));await settle(page);assert.equal(await page.evaluate(()=>location.hash),'#discover');assertCentered(await measure(page));gestures.push('visible background card click');
    await choose(page,1);
    if(engine==='chromium'&&width===493){const box=await lane.boundingBox(),cdp=await context.newCDPSession(page),y=Math.max(1,Math.min(height-20,box.y+100)),start=box.x+box.width*.75,end=box.x+box.width*.25;try{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start,y}]});for(let step=1;step<=8;step++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start+(end-start)*step/8,y}]});await page.waitForTimeout(20);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}finally{await cdp.detach();}gestures.push('Chromium browser touch swipe');}
    else{await lane.hover();await page.mouse.wheel(500,0);gestures.push('horizontal wheel');}
    await page.waitForFunction(()=>!document.getElementById('ux-topic-people').classList.contains('ux-topic-centered'));await settle(page);assertCentered(await measure(page));
    if(width===493){const input=page.locator('#ux-explore-search');await input.click();await page.keyboard.type('John 3:16');await page.screenshot({path:`${output}/${engine}-${width}x${height}-${theme}-search.png`,fullPage:false});await page.locator('#ux-explore-search-form>button[type=submit]').tap();await page.locator('#lens-search-overlay[open]').waitFor();const link=page.locator('#lens-results-scripture .lens-result').first();await link.waitFor();const route=await link.getAttribute('href');await link.click();await page.waitForFunction(route=>location.hash===route,route);await page.locator('#verse-16').waitFor();await page.evaluate(()=>BibleLensWorkspace.navigate('#discover'));await input.waitFor();await page.locator('#ux-explore-search-form .ux-search-clear').tap();await page.keyboard.type('mercy');await input.press('Enter');await page.locator('#lens-search-results .lens-result').first().waitFor();await page.keyboard.press('Escape');await page.waitForFunction(()=>location.hash==='#discover'&&document.activeElement.id==='ux-explore-search');}
   }
   assert.deepEqual(errors,[]);results.push({phase,engine,width,height,theme,status:'PASS',release:expected,positions,gestures});console.log('PASS Explore centering',phase,engine,width,height,theme,'positions',positions.length,'max error',Math.max(...positions.map(row=>Math.abs(row.active.error))).toFixed(3));
  }catch(error){results.push({phase,engine,width,height,theme,status:'FAIL',positions,error:error.stack});console.error('CENTERING FAILURE',JSON.stringify({phase,engine,width,height,theme,geometry:await measure(page).catch(e=>({unavailable:e.message}))}));await page.screenshot({path:`${output}/failure-${engine}-${width}x${height}-${theme}.png`,fullPage:false}).catch(()=>{});throw error;}
  finally{fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');await context.close();}
 }}finally{await browser.close();}
}}finally{fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');}
assert.equal(results.length,36);assert.equal(results.flatMap(row=>row.positions).length,252);
console.log(`PASS: 36 ${phase} contexts, 252 first/middle/Evidence/last and other card positions, usable viewport/scrollbar diagnostics, inactive shading and actual screenshots. Physical devices and physical WebKit swipes are not verified.`);
