import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
import {releaseInfo} from './release-info.mjs';

const base=process.env.BIBLELENS_PREVIEW_URL,phase=process.env.BIBLELENS_COMPARISON_PHASE;
assert(base&&['before','after'].includes(phase),'Set an authorized preview URL and comparison phase.');
const output='.release/explore-comparison/'+phase,results=[];
const screens=[[320,844],[390,844],[493,983],[983,493],[820,1180],[1180,820],[1440,900]];
const baseline=phase==='after'?JSON.parse(fs.readFileSync('.release/explore-comparison/before/matrix.json')):[];
const expected=phase==='before'?{version:'1.1.0',buildNumber:401,sourceHash:'80ea78e29c620b0e1aeb3cfefc215fdc8729234ff7cd87032184865f44be361a'}:releaseInfo();
fs.mkdirSync(output,{recursive:true});
async function settle(page){
 await page.evaluate(async()=>{
  await document.fonts.ready;
  await Promise.all([...document.querySelectorAll('#ux-lane-collections img')].map(img=>img.decode()));
  await Promise.all(document.getAnimations().filter(a=>'transitionProperty' in a).map(a=>a.finished.catch(()=>{})));
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 });
 await page.evaluate(()=>new Promise((resolve,reject)=>{const row=document.getElementById('ux-lane-collections');let previous=row.scrollLeft,stable=0;const started=performance.now();function frame(){const current=row.scrollLeft;stable=Math.abs(current-previous)<.1?stable+1:0;previous=current;if(stable>=8)return resolve();if(performance.now()-started>5000)return reject(Error('Carousel scroll did not settle'));requestAnimationFrame(frame);}requestAnimationFrame(frame);}));
 await page.locator('.fetch-retry-status').waitFor({state:'hidden'});
}
async function geometry(page){return page.evaluate(()=>{
 const field=document.querySelector('#ux-explore-search'),button=field.form.querySelector(':scope>button[type=submit]'),lane=document.querySelector('#ux-lane-collections');
 const rect=node=>node.getBoundingClientRect().toJSON(),cards=[...lane.querySelectorAll('.ux-topic')],current=lane.querySelector('.ux-topic-centered'),next=current.nextElementSibling;
 const active=rect(current),row=rect(lane),background=rect(next),style=getComputedStyle(field);
 return {active:{...active,id:current.id,filter:getComputedStyle(current).filter,color:getComputedStyle(current).color,overlay:getComputedStyle(current,'::after').backgroundImage},inactiveFilter:getComputedStyle(next).filter,peek:Math.max(0,Math.min(background.right,row.right)-Math.max(active.right,background.left,row.left)),field:{...rect(field),radius:parseFloat(style.borderTopRightRadius),paddingRight:parseFloat(style.paddingRight)},button:{...rect(button),name:button.getAttribute('aria-label')||button.textContent,visibleText:button.textContent,svg:!!button.querySelector('svg')},count:cards.length,pageOverflow:document.documentElement.scrollWidth>innerWidth+1};
 });}
try{for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
 try{for(const [width,height]of screens)for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(20000);
  try{
   const release=await(await page.request.get(base+'/release.json')).json();assert.deepEqual(release,expected);
   await page.goto(base+'/#discover');const input=page.locator('#ux-explore-search'),submit=page.locator('#ux-explore-search-form>button'),lane=page.locator('#ux-lane-collections');await input.waitFor();
   await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);
   await page.waitForFunction(()=>document.querySelector('#ux-topic-stories')?.classList.contains('ux-topic-centered'));await settle(page);
   assert.equal(await page.locator('#explore-view .ux-topic-section').count(),1);
   const measures=await geometry(page);assert.equal(measures.count,7);assert(!measures.pageOverflow);assert.equal(measures.active.filter,'none');assert(measures.peek>4,'A neighboring card remains visible');
   await page.screenshot({path:`${output}/${engine}-${width}x${height}-${theme}-stories.png`,fullPage:true});
   if(phase==='after'){
    const old=baseline.find(r=>r.engine===engine&&r.width===width&&r.height===height&&r.theme===theme);assert(old,'Missing actual baseline geometry');
    const ratio=measures.active.width/old.geometry.active.width;
    assert(ratio>.88&&ratio<.98,'Active tile is slightly narrower: '+JSON.stringify({ratio,measures,old:old.geometry}));
    assert(measures.peek>old.geometry.peek+2,'More of the neighboring card is exposed');
    const brightness=value=>Number(/brightness\(([^)]+)\)/.exec(value)?.[1]);
    assert(brightness(measures.inactiveFilter)<brightness(old.geometry.inactiveFilter),'Only the inactive filter is darker');
    assert.equal(measures.active.color,old.geometry.active.color);assert.equal(measures.active.overlay,old.geometry.active.overlay,'Active card shading remains unchanged');
    const {field,button}=measures;assert(await input.evaluate(node=>getComputedStyle(node).appearance==='none'),'The custom field suppresses duplicate platform search chrome');
    assert.equal(button.name,'Search');assert.equal(button.visibleText,'');assert(button.svg);
    assert(button.width>=44&&button.height>=44&&field.height>=48);
    assert(button.left>=field.left&&button.right<=field.right+1&&button.top>=field.top&&button.bottom<=field.bottom+1,'Icon touch target lies inside the input boundary');
    assert(field.radius>=field.height/2&&field.right-field.paddingRight<=button.left-4,'Pill shape reserves a separate text area');
    await input.focus();await page.keyboard.press('Tab');assert(await submit.evaluate(node=>document.activeElement===node));
    assert(await submit.evaluate(node=>getComputedStyle(node).outlineStyle!=='none'&&parseFloat(getComputedStyle(node).outlineWidth)>=2),'Keyboard focus is visible');
   }
   await page.locator('.ux-lane-page').nth(1).tap();await page.waitForFunction(()=>document.querySelector('#ux-topic-people').classList.contains('ux-topic-centered'));await settle(page);
   const neighbors=await lane.evaluate(row=>{const [a,b,c]=[...row.querySelectorAll('.ux-topic')].slice(0,3).map(n=>n.getBoundingClientRect().toJSON()),bounds=row.getBoundingClientRect().toJSON();return {leftVisible:Math.max(0,Math.min(a.right,b.left)-Math.max(a.left,bounds.left)),rightVisible:Math.max(0,Math.min(c.right,bounds.right)-Math.max(c.left,b.right)),a,b,c,row:bounds};});assert(neighbors.leftVisible>4&&neighbors.rightVisible>4,'Both background cards remain visible beside People: '+JSON.stringify({engine,width,height,neighbors}));
   assert.equal(await page.locator('#ux-topic-people').evaluate(n=>getComputedStyle(n).filter),'none','Selecting a background card restores its active brightness');
   await page.screenshot({path:`${output}/${engine}-${width}x${height}-${theme}-people.png`,fullPage:true});
   let gesture='not required for baseline capture';
   if(phase==='after'){
    if(engine==='chromium'&&width===493){
     const box=await lane.boundingBox(),session=await context.newCDPSession(page),y=box.y+Math.min(110,box.height/2),start=box.x+box.width*.75,end=box.x+box.width*.25;
     try{await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start,y}]});for(let step=1;step<=8;step++){await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start+(end-start)*step/8,y}]});await page.waitForTimeout(20);}await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}finally{await session.detach();}
     await page.waitForFunction(()=>!document.querySelector('#ux-topic-people').classList.contains('ux-topic-centered'));gesture='real Chromium touch swipe';
    }else{
     await lane.hover();await page.mouse.wheel(500,0);await page.waitForFunction(()=>!document.querySelector('#ux-topic-people').classList.contains('ux-topic-centered'));gesture='horizontal wheel plus touch pager';
    }
    await settle(page);assert.equal(await page.evaluate(()=>location.hash),'#discover','Scrolling does not open a tile accidentally');
    await input.click();await page.keyboard.type('John 3:16');assert.equal(await input.inputValue(),'John 3:16');
    const clear=page.locator('#ux-explore-search-form .ux-search-clear');await clear.waitFor({state:'visible'});const clearBox=await clear.boundingBox(),submitBox=await submit.boundingBox(),fieldBox=await input.boundingBox();
    assert(clearBox.x+clearBox.width<=submitBox.x+1,'Clear and submit touch targets remain separate');assert(fieldBox.x+fieldBox.width-await input.evaluate(n=>parseFloat(getComputedStyle(n).paddingRight))<=clearBox.x-4,'Typed text stops before both controls');
    if(width===493){await page.screenshot({path:`${output}/${engine}-${width}x${height}-${theme}-typed-search.png`,fullPage:true});}
    await submit.tap();await page.locator('#lens-search-overlay[open]').waitFor();const result=page.locator('#lens-results-scripture .lens-result').first();await result.waitFor();
    const destination=await result.getAttribute('href');assert.match(destination,/^#read\//);await result.click();await page.waitForFunction(destination=>location.hash===destination,destination);await page.locator('#verse-16').waitFor();
    await page.evaluate(()=>BibleLensWorkspace.navigate('#discover'));await input.waitFor();await input.focus();await input.press('Escape');await page.keyboard.type('mercy');await input.press('Enter');
    await page.locator('#lens-search-overlay[open]').waitFor();assert.equal(await page.locator('#lens-search-input').inputValue(),'mercy');await page.locator('#lens-search-results .lens-result').first().waitFor();await page.keyboard.press('Escape');await page.waitForFunction(()=>document.activeElement?.id==='ux-explore-search'&&location.hash==='#discover');
    await input.fill('Genesis '.repeat(37));assert(await submit.evaluate(button=>{const r=button.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return button===hit||button.contains(hit);}), 'Long input cannot cover the submit target');
    await clear.tap();assert.equal(await input.inputValue(),'');assert(await input.evaluate(n=>document.activeElement===n),'The existing Clear search control still works and restores input focus');
    if(width===320||width===493){await page.evaluate(()=>document.documentElement.style.fontSize='200%');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Large text stays inside page margins');const box=await input.boundingBox(),button=await submit.boundingBox();assert(button.y>=box.y&&button.y+button.height<=box.y+box.height+1);}
   }
   assert.deepEqual(errors,[]);results.push({phase,engine,width,height,theme,status:'PASS',release,geometry:measures,gesture});console.log('PASS Explore comparison',phase,engine,width,height,theme);
  }catch(error){results.push({phase,engine,width,height,theme,status:'FAIL',error:error.stack});await page.screenshot({path:`${output}/failure-${engine}-${width}x${height}-${theme}.png`,fullPage:true}).catch(()=>{});throw error;}
  finally{fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');await context.close();}
 }}finally{await browser.close();}
}}finally{fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');}
assert.equal(results.length,28);console.log(`PASS: 28 ${phase} cases with actual ${phase==='before'?'build 401 baseline captures':'before/after geometry, darker inactive cards, inset search, real input and navigation'}. WebKit touch swipes and physical devices are not verified.`);
