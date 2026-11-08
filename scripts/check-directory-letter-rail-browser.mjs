import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';

const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to an authorized running preview.');
const output='.release/directory-letter-rail',results=[];
fs.mkdirSync(output,{recursive:true});
const screens=[[320,844],[390,844],[598,512],[672,1024],[744,600],[834,1194],[1024,1366],[1194,834],[1366,1024],[844,390],[1440,900]];
const frames=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
const selected=(kind,letter)=>kind==='People'?`#characters-list .ux-letter-heading[data-letter="${letter}"]`:`#places-view [data-directory-letter="${letter}"]`;

async function geometry(page,kind){
 await frames(page);
 await page.waitForFunction(kind=>{
  const rail=document.querySelector('#directory-letter-rail-'+kind.toLowerCase());
  const header=document.querySelector('#lensMasthead'),nav=header.querySelector('.lens-primary'),main=document.querySelector('#main');
  const box=rail.getBoundingClientRect(),viewport=visualViewport,top=viewport?.offsetTop||0,bottom=top+(viewport?.height||innerHeight);
  const navBox=nav.getBoundingClientRect(),safe=parseFloat(getComputedStyle(document.body).getPropertyValue('--app-safe-bottom'))||0;
  const limit=Math.min(bottom-safe,main.getBoundingClientRect().bottom,getComputedStyle(nav).position==='fixed'?navBox.top:bottom);
  return box.height>0&&box.top>=header.getBoundingClientRect().bottom+7&&Math.abs(box.bottom-(limit-8))<2;
 },kind,{timeout:5000});
 const value=await page.evaluate(kind=>{
  const host=document.querySelector(kind==='People'?'#characters-view':'#places-view'),rail=host.querySelector('.directory-letter-rail'),edge=host.querySelector('.directory-letter-edge');
  const header=document.querySelector('#lensMasthead'),nav=header.querySelector('.lens-primary'),main=document.querySelector('#main');
  const box=node=>node.getBoundingClientRect().toJSON(),viewport=visualViewport,body=getComputedStyle(document.body);
  const style=node=>Object.fromEntries(['position','top','bottom','height','box-sizing','transform','visibility'].map(key=>[key,getComputedStyle(node).getPropertyValue(key)]));
  const letters=[...rail.children].map(node=>{
   const range=document.createRange();range.selectNodeContents(node);const r=node.getBoundingClientRect();
   return {letter:node.dataset.letter,disabled:node.disabled,box:box(node),glyph:range.getBoundingClientRect().toJSON(),font:getComputedStyle(node).fontSize,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('[data-letter]')?.dataset.letter};
  });
  return {rail:box(rail),edge:box(edge),railStyle:style(rail),edgeStyle:style(edge),header:box(header),navigation:box(nav),fixedNavigation:getComputedStyle(nav).position==='fixed',main:box(main),viewport:{top:viewport?.offsetTop||0,height:viewport?.height||innerHeight,width:innerWidth},safeBottom:parseFloat(body.getPropertyValue('--app-safe-bottom'))||0,letters};
 },kind);
 const bottom=Math.min(value.viewport.top+value.viewport.height-value.safeBottom,value.main.bottom,value.fixedNavigation?value.navigation.top:Infinity);
 assert.equal(value.letters.map(row=>row.letter).join(''),'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
 assert(value.rail.top>=Math.max(value.header.bottom,value.main.top,value.viewport.top)+7);
 assert(Math.abs(value.rail.bottom-(bottom-8))<2,'Fill the usable main viewport instead of stopping at a fixed height');
 assert(Math.abs(value.edge.top-value.rail.top)<1&&Math.abs(value.edge.height-value.rail.height)<1,JSON.stringify({rail:value.rail,edge:value.edge,railStyle:value.railStyle,edgeStyle:value.edgeStyle}));
 assert(value.rail.left>=0&&value.rail.right<=value.viewport.width+1);
 for(const letter of value.letters){assert(letter.box.height>0&&letter.box.width>=44);assert(letter.box.top>=value.rail.top-.5&&letter.box.bottom<=value.rail.bottom+.5);}
 for(let index=1;index<value.letters.length;index++)assert(value.letters[index-1].glyph.bottom<=value.letters[index].glyph.top+1,'Adjacent letters remain visually distinct');
 for(const letter of [value.letters[0],value.letters.at(-1)]){
  assert(letter.glyph.top>=value.header.bottom&&letter.glyph.bottom<=bottom,'First/last visible glyphs clear header and footer');
  assert.equal(letter.hit,letter.letter,'First/last letters can receive pointer input');
 }
 return value;
}

async function openWithKeyboard(page,kind){
 const host=page.locator(kind==='People'?'#characters-view':'#places-view'),edge=host.locator('.directory-letter-edge'),rail=host.locator('.directory-letter-rail');
 if(await rail.isHidden()){await edge.focus();await page.keyboard.press('Enter');await rail.waitFor({state:'visible'});}
 return {host,edge,rail};
}

async function jump(page,rail,kind,letter){
 const button=rail.locator(`[data-letter="${letter}"]`);
 assert(!(await button.isDisabled()),kind+' has '+letter+' entries');
 await button.focus();await page.keyboard.press('Enter');await page.locator(selected(kind,letter)).first().waitFor();await frames(page);
}

async function drag(page,context,engine,kind,touch){
 let {edge,rail}=await openWithKeyboard(page,kind);await page.keyboard.press('Escape');await rail.waitFor({state:'hidden'});
 const edgeBox=await edge.boundingBox(),x=edgeBox.x+edgeBox.width/2,y=edgeBox.y+edgeBox.height*9.5/26;
 const cdp=touch?await context.newCDPSession(page):null;
 const move=async (yy,steps=5)=>{if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:yy}]});else await page.mouse.move(x,yy,{steps});};
 try{
  if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});else {await page.mouse.move(x,y);await page.mouse.down();}
  await rail.waitFor({state:'visible'});await frames(page);
  const preview=page.locator((kind==='People'?'#characters-view':'#places-view')+' .directory-letter-preview');
  await page.waitForFunction(selector=>document.querySelector(selector)?.textContent==='J',(kind==='People'?'#characters-view':'#places-view')+' .directory-letter-preview');
  const disabled=rail.locator('button:disabled').first(),disabledSkipped=(await disabled.count())>0;
  if(disabledSkipped){
   const before=await preview.innerText(),box=await disabled.boundingBox();await move(box.y+box.height/2,1);await frames(page);assert.equal(await preview.innerText(),before,'Dragging over a disabled letter keeps the current selection');
  }
  const last=rail.locator('[data-letter="Z"]'),lastBox=await last.boundingBox();await move(lastBox.y+lastBox.height/2);await page.waitForFunction(selector=>document.querySelector(selector)?.textContent==='Z',(kind==='People'?'#characters-view':'#places-view')+' .directory-letter-preview');await page.locator(selected(kind,'Z')).first().waitFor();
  await geometry(page,kind);
  const firstBox=await rail.locator('[data-letter="A"]').boundingBox();await move(firstBox.y+firstBox.height/2);await page.waitForFunction(selector=>document.querySelector(selector)?.textContent==='A',(kind==='People'?'#characters-view':'#places-view')+' .directory-letter-preview');await page.locator(selected(kind,'A')).first().waitFor();
 }finally{if(cdp){await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}else await page.mouse.up();}
 await rail.waitFor({state:'hidden'});assert(await page.locator((kind==='People'?'#characters-view':'#places-view')+' .directory-letter-preview').isHidden());
 return {engine,kind,input:touch?'browser touch':'mouse',first:'A',last:'Z',disabledSkipped};
}

for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
 try{for(const [width,height] of screens)for(const native of [false,true]){
  const kinds=['People',...([390,834,1440].includes(width)?['Places']:[])];
  for(const kind of kinds){
   const name=`${engine}-${width}x${height}-${native?'native':'web'}-${kind.toLowerCase()}`;
   const context=await browser.newContext({viewport:{width,height},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   try{
    await page.goto(base+'/#'+(kind==='People'?'characters':'places'));
    await page.locator(kind==='People'?'#characters-view .ux-contact':'#places-view .place-profile-card').first().waitFor();
    await page.evaluate(native=>{document.documentElement.classList.toggle('native-ios',native);document.body.style.setProperty('--app-safe-top',native?'24px':'0px');document.body.style.setProperty('--app-safe-bottom',native?'20px':'0px');state.theme=native?'dark':'light';applyTheme();persist();},native);
    await page.evaluate(()=>document.fonts.ready);
    let {rail}=await openWithKeyboard(page,kind);await jump(page,rail,kind,'J');
    const initial=await geometry(page,kind),disabled=initial.letters.filter(letter=>letter.disabled).map(letter=>letter.letter);
    await page.screenshot({path:`${output}/${name}-J.png`,fullPage:false});
    await rail.locator('button:not(:disabled)').first().focus();await page.keyboard.press('End');await page.locator(selected(kind,'Z')).first().waitFor();await geometry(page,kind);
    await rail.locator('button:not(:disabled)').last().focus();await page.keyboard.press('Home');await page.locator(selected(kind,'A')).first().waitFor();await geometry(page,kind);
    const first=rail.locator('[data-letter="J"]');await first.tap();await page.locator(selected(kind,'J')).first().waitFor();await rail.waitFor({state:'hidden'});
    const gestures=[await drag(page,context,engine,kind,false)];
    if(engine==='chromium'&&native&&[390,834,1194].includes(width))gestures.push(await drag(page,context,engine,kind,true));
    ({rail}=await openWithKeyboard(page,kind));await jump(page,rail,kind,'J');
    const dynamic=[];
    if(kind==='People'&&native&&[834,1024].includes(width)){
     const target=width===834?{width:1194,height:834}:{width:744,height:600};await page.setViewportSize(target);dynamic.push({phase:'resize',...(await geometry(page,kind))});await page.screenshot({path:`${output}/${name}-resized.png`,fullPage:false});
     await page.setViewportSize({width,height});await geometry(page,kind);
     await page.evaluate(()=>{document.getElementById('lensMasthead').style.paddingBottom='36px';document.body.style.setProperty('--app-safe-top','52px');document.body.style.setProperty('--app-safe-bottom','32px');document.querySelector('#lensMasthead .lens-primary').style.paddingBottom='32px';});
     const changed=await geometry(page,kind);assert(changed.header.bottom>initial.header.bottom+20,'Header/safe-area change is reflected without reopening');dynamic.push({phase:'header-safe-area',...changed});await page.screenshot({path:`${output}/${name}-header-safe-area.png`,fullPage:false});
    }
    assert.deepEqual(await rail.locator('button:disabled').evaluateAll(nodes=>nodes.map(node=>node.dataset.letter)),disabled,'Resizing preserves disabled letters');
    await page.keyboard.press('Escape');await rail.waitFor({state:'hidden'});
    assert.deepEqual(errors,[]);results.push({engine,width,height,native,kind,status:'PASS',initial,dynamic,gestures});
    console.log('PASS rail',name);
   }catch(error){
    await page.screenshot({path:`${output}/failure-${name}.png`,fullPage:false}).catch(()=>{});
    fs.writeFileSync(`${output}/failure-${name}.json`,JSON.stringify({error:error.stack,geometry:await geometry(page,kind).catch(error=>({unavailable:error.message}))},null,2)+'\n');throw error;
   }finally{fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');await context.close();}
  }
 }}finally{await browser.close();}
}
assert.equal(results.length,56);
console.log('PASS: 56 measured directory cases, A/Z bounds and hit testing, disabled letters, keyboard, tap, mouse drag, Chromium touch drag, rotation/split view, header and safe-area changes.');
