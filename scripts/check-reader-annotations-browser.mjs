import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to an authorized running preview.');
const matrix=[],output='.release/reader-annotations';fs.mkdirSync(output,{recursive:true});
const screens=[[320,844],[390,844],[598,1184],[601,1184],[647,844],[650,844],[651,844],[768,1024],[820,1024],[844,390],[1024,1024],[1157,1184],[1165,747],[1366,1024]];
async function checkBookLabels(page){
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const report=await page.locator('#passage-book-grid [data-book-full]').evaluateAll(nodes=>nodes.map(node=>{
  const style=getComputedStyle(node),probe=document.createElement('span');probe.textContent=node.dataset.bookFull;Object.assign(probe.style,{font:style.font,whiteSpace:'nowrap',position:'fixed',visibility:'hidden',display:'inline-block',width:'max-content',padding:'0',border:'0'});document.body.append(probe);const fullWidth=probe.getBoundingClientRect().width;probe.remove();
  return {full:node.dataset.bookFull,short:node.dataset.bookShort,text:node.textContent,fullWidth,space:node.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight),font:style.font,fits:node.scrollWidth<=node.clientWidth+1,nowrap:style.whiteSpace==='nowrap',name:node.previousElementSibling.getAttribute('aria-label')};
 }));
 const abbreviated=report.some(label=>label.fullWidth>label.space+.5),mode=abbreviated?'abbreviated':'full';assert.equal(await page.locator('#passage-book-grid').getAttribute('data-book-labels'),mode,JSON.stringify(report));
 for(const label of report){assert.equal(label.text,abbreviated?label.short:label.full,'Use one label mode for every book');assert.equal(label.name,label.full);assert(label.fits&&label.nowrap,'Book names stay on one line without clipping: '+JSON.stringify(label));}
 return {mode,labels:report};
}
async function checkBottomNavigation(page){
 await page.evaluate(()=>BibleLensWorkspace.navigate('#read/0/1'));await page.locator('#chapter-footer').filter({hasText:'Genesis 1'}).waitFor();await page.evaluate(()=>scrollTo({top:650,behavior:'instant'}));await page.locator('#reader-floating-picker').waitFor({state:'visible'});assert(await page.locator('#reader-floating-prev').isDisabled(),'Floating pagination preserves the first-chapter boundary');
 await page.evaluate(()=>BibleLensWorkspace.navigate('#read/0/50'));await page.locator('#chapter-footer').filter({hasText:'Genesis 50'}).waitFor();
 await page.evaluate(()=>scrollTo({top:650,behavior:'instant'}));await page.locator('#reader-floating-next').click();await page.waitForFunction(()=>location.hash==='#read/1/1');await page.locator('#chapter-footer').filter({hasText:'Exodus 1'}).waitFor();
 await page.evaluate(()=>scrollTo({top:650,behavior:'instant'}));await page.locator('#reader-floating-prev').click();await page.waitForFunction(()=>location.hash==='#read/0/50');await page.locator('#chapter-footer').filter({hasText:'Genesis 50'}).waitFor();
 await page.evaluate(()=>scrollTo({top:650,behavior:'instant'}));await page.locator('#reader-floating-picker').click();await page.locator('#passage-picker[open]').waitFor();await page.locator('[data-book-testament="new"]').click();
 await page.locator('#passage-book-grid label').filter({has:page.locator('input[value="42"]')}).click();
 await page.locator('[data-passage-pane="chapter"]:visible').waitFor();await page.locator('#passage-chapter-grid label').filter({has:page.locator('input[value="3"]')}).click();
 await page.locator('[data-passage-pane="verse"]:visible').waitFor();await page.locator('#passage-verse-grid label').filter({has:page.locator('input[value="16"]')}).click();
 await page.waitForFunction(()=>location.hash==='#read/42/3/16');await page.locator('#verse-16').waitFor();assert.equal(await page.locator('#passage-picker[open]').count(),0,'Floating picker selects another book, chapter and verse');
 await page.evaluate(()=>BibleLensWorkspace.navigate('#discover'));await page.locator('#ux-explore-search').waitFor();assert(await page.locator('#reader-floating-navigation').isHidden(),'Floating reader controls hide outside Read');
 await page.evaluate(()=>BibleLensWorkspace.navigate('#read/0/1'));await page.locator('#chapter-footer').filter({hasText:'Genesis 1'}).waitFor();assert(await page.locator('#reader-floating-navigation').isHidden(),'Floating controls stay out of the chapter opening');await page.evaluate(()=>BibleLensWorkspace.navigate('#discover'));await page.locator('#ux-explore-search').waitFor();assert(await page.locator('#reader-floating-navigation').isHidden(),'Reader controls hide on other views');
}
try{for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
 try{
  for(const [width,height] of screens)for(const native of [false,true]){
   const context=await browser.newContext({viewport:{width,height},hasTouch:Math.min(width,height)<=1024,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage();
   const errors=[],contextResults=[],network=[];page.on('pageerror',error=>errors.push(error.message));
   page.on('requestfailed',request=>{const url=new URL(request.url());network.push({kind:'failed',origin:url.origin,path:url.pathname,error:request.failure()?.errorText});});
   page.on('response',response=>{if(response.status()>=500){const url=new URL(response.url());network.push({kind:'response',origin:url.origin,path:url.pathname,status:response.status()});}});
   await context.addInitScript(()=>{
    window.__readerSearchEvents=[];
    const record=(type,target,key)=>{const events=window.__readerSearchEvents;events.push({type,target,key,route:location.hash.split('?')[0],focus:document.activeElement?.id,open:!!document.querySelector('#lens-search-overlay[open]')});if(events.length>200)events.shift();};
    document.addEventListener('keydown',event=>{if(event.key==='Escape')record('keydown',event.target.id,event.key);},true);
    for(const type of ['input','submit','close','cancel'])document.addEventListener(type,event=>{if(['lens-search-input','lens-search-form','lens-search-overlay'].includes(event.target.id))record(type,event.target.id);},true);
    window.addEventListener('hashchange',()=>record('hashchange'));
   });
   try{
   await page.goto(base+'/#read/1/1');await page.locator('#ux-chapter-picker').filter({hasText:'Exodus'}).waitFor();
   await page.locator('#chapter-text .story-illustration-reader figcaption').first().waitFor();
   await page.evaluate(native=>{document.documentElement.classList.toggle('native-ios',native);document.body.style.setProperty('--app-safe-top',native?'24px':'0px');},native);
   for(const dark of [false,true]){
    const caseName=`${engine}-${width}x${height}-${native?'native-safe-area':'web'}-${dark?'dark':'light'}`;
    await page.evaluate(dark=>{state.theme=dark?'dark':'light';applyTheme();persist();},dark);await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('#lens-settings:visible,[data-open-settings]:visible').count(),1);
    assert.equal(await page.locator('#lens-compare').count(),0);assert.equal(await page.locator('.study-library:visible').count(),0);
    const measures=await page.locator('#lensMasthead,#lensReadingBar,#ux-chapter-picker,#lens-settings').evaluateAll(nodes=>nodes.map(n=>({id:n.id,...n.getBoundingClientRect().toJSON(),font:parseFloat(getComputedStyle(n).fontSize)})));
    const header=measures.find(n=>n.id==='lensMasthead'),bar=measures.find(n=>n.id==='lensReadingBar'),picker=measures.find(n=>n.id==='ux-chapter-picker');
    assert(header.top>=(native?24:0)-1);assert(bar.top>=header.bottom-1);assert(picker.width>=44&&picker.height>=44&&picker.font>=18);
    const pickerStyle=await page.locator('#ux-chapter-picker').evaluate(node=>{const style=getComputedStyle(node);return {border:style.borderTopWidth,background:style.backgroundColor,grow:style.flexGrow};});assert.equal(pickerStyle.border,'0px');assert.equal(pickerStyle.background,'rgba(0, 0, 0, 0)');assert.equal(pickerStyle.grow,'0');assert.equal(await page.locator('#ux-chapter-picker .ux-picker-arrow').count(),0,'Chapter navigation has link styling, without a dropdown arrow');
    assert(await page.locator('.lens-translation-caption').isVisible());const translationStyle=await page.locator('#lens-edition').evaluate(node=>({radius:getComputedStyle(node).borderRadius,appearance:getComputedStyle(node).appearance,border:getComputedStyle(node).borderTopWidth}));assert.equal(translationStyle.radius,'12px');assert.notEqual(translationStyle.appearance,'none');assert.equal(translationStyle.border,'1px');const editionMeasure=await page.locator('#lens-edition').evaluate(node=>{const style=getComputedStyle(node);return {box:node.getBoundingClientRect().toJSON(),height:style.height,minHeight:style.minHeight,boxSizing:style.boxSizing,font:style.font,transform:style.transform,zoom:style.zoom,inline:node.getAttribute('style'),rootFont:getComputedStyle(document.documentElement).fontSize};});const editionBox=editionMeasure.box;assert(editionBox.width>=44&&editionBox.width<=66&&editionBox.height>=24&&editionBox.height<=34,'Toolbar translation selector stays compact and usable: '+JSON.stringify(editionMeasure));
    assert(measures.every(n=>n.left>=-1&&n.right<=width+1));
    assert(await page.locator('#chapter-text .chapter-heading-row').evaluate(n=>[n,...n.querySelectorAll('*')].every(n=>getComputedStyle(n).textShadow==='none')));
    assert(await page.locator('a:visible').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).textDecorationLine==='none')));
    assert(!(await page.locator('#chapter-text .story-illustration-reader figcaption').first().innerText()).startsWith('Imagined scene:'));
    if([320,598,601,1157].includes(width))await page.screenshot({path:`${output}/${caseName}-reader.png`,fullPage:false});
    await page.locator('#ux-chapter-picker').focus();await page.keyboard.press('Enter');await page.locator('#passage-picker[open]').waitFor();
    const bookLabels=await checkBookLabels(page);if(width>=1157)assert.equal(bookLabels.mode,'full','Wide Old Testament grids make room for all full book names: '+JSON.stringify(bookLabels));if(width<=598)assert.equal(bookLabels.mode,'abbreviated','Narrow grids abbreviate the entire visible group: '+JSON.stringify(bookLabels));assert(await page.getByLabel('Go to a passage',{exact:true}).isVisible());assert.match(await page.locator('#passage-reference-help').innerText(),/Use Search for words or topics/);
    const reference=page.locator('#passage-reference'),referenceGeometry=await reference.evaluate(node=>{
     const box=node.getBoundingClientRect(),control=node.parentElement.getBoundingClientRect(),go=document.getElementById('passage-reference-go').getBoundingClientRect(),style=getComputedStyle(node);
     return {input:box.toJSON(),control:control.toJSON(),go:go.toJSON(),fontSize:parseFloat(style.fontSize),flex:style.flex,disabled:node.disabled,readOnly:node.readOnly,hitAtCenter:document.elementFromPoint(box.x+box.width/2,box.y+box.height/2)===node,stylesheets:[...document.styleSheets].map(sheet=>sheet.href).filter(Boolean)};
    });
    fs.writeFileSync(`${output}/${caseName}-geometry.json`,JSON.stringify(referenceGeometry,null,2)+'\n');
    await page.screenshot({path:`${output}/${caseName}-passage.png`,fullPage:false});
    assert(referenceGeometry.input.width>=160&&referenceGeometry.input.width>=referenceGeometry.control.width*.6,'Reference field has readable editing space: '+JSON.stringify({engine,width,height,native,dark,referenceGeometry}));
    assert(referenceGeometry.input.height>=44&&referenceGeometry.fontSize>=16&&!referenceGeometry.disabled&&!referenceGeometry.readOnly&&referenceGeometry.hitAtCenter,'Reference field is reachable and editable');
    assert(referenceGeometry.input.right<=referenceGeometry.go.left+1&&referenceGeometry.go.right<=referenceGeometry.control.right+1,'Reference and Go stay inside their row');
    await reference.click();assert.equal(await page.evaluate(()=>document.activeElement.id),'passage-reference');await page.keyboard.type('Genesis 2:3');assert.equal(await reference.inputValue(),'Genesis 2:3');
    await page.keyboard.press('Backspace');await page.keyboard.type('4');assert.equal(await reference.inputValue(),'Genesis 2:4');await page.keyboard.press('Backspace');await page.keyboard.type('3');
    await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'passage-reference-go');await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'passage-reference');
    assert.equal(await page.locator('#passage-book-grid input').count(),39);assert.equal(await page.getByRole('radio',{name:'Song of Solomon',exact:true}).count(),1,'Full book names remain accessible in abbreviated mode');
    const choices=await page.locator('#passage-book-grid label').evaluateAll(nodes=>nodes.map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height,scroll:n.firstElementChild.nextElementSibling.scrollWidth,client:n.firstElementChild.nextElementSibling.clientWidth,radius:getComputedStyle(n.firstElementChild.nextElementSibling).borderRadius})));
    assert(choices.every(n=>n.w>=44&&n.h>=44&&n.scroll<=n.client+1&&n.radius==='12px'));
    for(const [group,count]of [['new',27],['lost',20],['old',39]]){await page.locator(`[data-book-testament="${group}"]`).click();assert.equal(await page.locator('#passage-book-grid input').count(),count);await checkBookLabels(page);}
    assert(await page.locator('.passage-steps button').evaluateAll(nodes=>nodes.every(node=>{const s=getComputedStyle(node);return ['Top','Right','Bottom','Left'].every(side=>parseFloat(s['border'+side+'Width'])>=1)&&s.borderTopStyle==='solid'&&s.borderRadius==='12px';})),'All three step controls have consistent borders');
    await page.locator('[data-passage-step="chapter"]').click();assert.equal(await page.locator('#passage-chapter-grid input').count(),40,'All Exodus chapters retained');
    assert(await page.locator('#passage-chapter-grid label').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return r.width>=44&&r.height>=44;})));
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'ux-chapter-picker');
    await page.locator('#lensMasthead .ux-search').click();await page.locator('#lens-search-overlay[open]').waitFor();
    const search=page.locator('#lens-search-input'),searchBox=await search.boundingBox();assert(searchBox.width>=160&&searchBox.height>=44,'Global Search also retains a readable input');
    await search.click();await page.keyboard.type('mercy');assert.equal(await search.inputValue(),'mercy');assert.equal(await page.evaluate(()=>document.activeElement.id),'lens-search-input');
    await page.screenshot({path:`${output}/${caseName}-search.png`,fullPage:false});await page.keyboard.press('Escape');await page.waitForFunction(()=>location.hash.startsWith('#read')&&!document.querySelector('#lens-search-overlay[open]'));
    if([598,1024].includes(width)){
     await page.locator('#lensMasthead .ux-search').click();await page.locator('#lens-search-overlay[open]').waitFor();await search.click();await page.keyboard.type('mercy');await page.keyboard.press('Escape');
     await page.waitForFunction(()=>location.hash.startsWith('#read')&&!document.querySelector('#lens-search-overlay[open]'));await page.waitForTimeout(250);assert.equal(await page.locator('#lens-search-overlay[open]').count(),0,'Escape during the input debounce keeps Search closed');assert(await page.evaluate(()=>location.hash.startsWith('#read')));
    }
    await page.locator('#lens-settings').focus();await page.keyboard.press('Enter');await page.locator('#reader-settings[open]').waitFor();await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'lens-settings');
    await page.evaluate(()=>scrollTo(0,500));await page.waitForTimeout(300);
    const sticky=await page.locator('#lensMasthead,#lensReadingBar').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON())),scenario=JSON.stringify({engine,width,native,dark,sticky});assert(sticky[0].top>=(native?24:0)-1,scenario);assert(sticky[1].top>=sticky[0].bottom-1,scenario);
    assert(Math.abs(await page.locator('body').evaluate(node=>parseFloat(getComputedStyle(node).getPropertyValue('--ux13-masthead-height')))-sticky[0].height)<=1,'Measured header height reaches the body after scrolling');
    assert((await page.locator('#ux-chapter-picker').evaluate(n=>parseFloat(getComputedStyle(n).fontSize)))>=18);
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.mouse.wheel(0,650);await page.waitForFunction(()=>Math.abs(scrollY-650)<2);const floating=page.locator('#reader-floating-navigation'),floatingPicker=page.locator('#reader-floating-picker');await floating.waitFor({state:'visible'});
    await page.locator('#reader-floating-prev').waitFor({state:'visible'});await page.locator('#reader-floating-next').waitFor({state:'visible'});
    const floatGeometry=await floating.evaluate(node=>{const tabs=document.querySelector('#lensMasthead nav.lens-primary'),style=getComputedStyle(tabs);return {box:node.getBoundingClientRect().toJSON(),tabs:tabs.getBoundingClientRect().toJSON(),fixedTabs:style.position==='fixed',buttons:[...node.children].map(button=>({id:button.id,...button.getBoundingClientRect().toJSON()}))};});
    assert.deepEqual(floatGeometry.buttons.map(button=>button.id),['reader-floating-prev','reader-floating-picker','reader-floating-next']);assert(floatGeometry.buttons.every(button=>button.width>=44&&button.height>=44&&button.left>=0&&button.right<=width),'Floating controls retain separate reachable targets');assert(floatGeometry.box.bottom<=(floatGeometry.fixedTabs?floatGeometry.tabs.top:height)-8,'Floating controls clear the app navigation');
    if([320,601,820,1157].includes(width))await page.screenshot({path:`${output}/${caseName}-floating.png`,fullPage:false});
    const scrollBefore=await page.evaluate(()=>scrollY);if(width<=1024)await floatingPicker.tap();else await floatingPicker.click();await page.locator('#passage-picker[open]').waitFor();assert(await floating.isHidden(),'Modal passage selection hides the floating controls');await page.keyboard.press('Escape');await page.locator('#passage-picker').waitFor({state:'hidden'});await floating.waitFor({state:'visible'});assert(await floatingPicker.evaluate(node=>node===document.activeElement),'Closing the picker restores its floating opener');await page.waitForFunction(y=>Math.abs(scrollY-y)<2,scrollBefore);
    await page.locator('#chapter-footer').scrollIntoViewIfNeeded();await page.locator('#reader-floating-prev').waitFor({state:'hidden'});assert(await floatingPicker.isVisible(),'Book selection stays available at the bottom');assert(await page.locator('#prev-bottom').isVisible()&&await page.locator('#next-bottom').isVisible(),'Existing bottom arrows remain');
    if([601,1157].includes(width))await page.screenshot({path:`${output}/${caseName}-bottom.png`,fullPage:false});
    await floatingPicker.focus();await page.keyboard.press('Enter');await page.locator('#passage-picker[open]').waitFor();await page.keyboard.press('Escape');await floating.waitFor({state:'visible'});assert(await floatingPicker.evaluate(node=>node===document.activeElement),'Keyboard opening at the bottom retains opener focus');
    await page.evaluate(()=>scrollTo(0,0));contextResults.push({engine,width,height,native,dark,status:'PASS',bookLabels,reference:referenceGeometry.input,globalSearch:searchBox});
   }
   await page.locator('#lens-edition').focus();await page.keyboard.press('Home');await page.keyboard.press('Tab');await page.waitForFunction(()=>document.getElementById('reader-edition').value==='kjv'&&document.getElementById('lens-edition').value==='kjv');
   await page.evaluate(()=>BibleLensWorkspace.navigate('#read/21/8'));await page.locator('#ux-chapter-picker').filter({hasText:'Song of Solomon'}).waitFor();
   assert((await page.locator('#ux-chapter-picker').evaluate(n=>parseFloat(getComputedStyle(n).fontSize)))>=18);
   await page.locator('#ux-chapter-picker').click();await page.locator('#passage-reference').fill('Exodus 41');await page.locator('#passage-reference').press('Enter');await page.waitForFunction(()=>document.getElementById('passage-reference').getAttribute('aria-invalid')==='true');assert(await page.locator('#passage-reference-status').innerText());
   await page.locator('#passage-reference').fill('Exodus 1:8');await page.locator('#passage-reference').press('Enter');await page.waitForFunction(()=>location.hash==='#read/1/1/8');await page.locator('#verse-8').waitFor();assert.equal(await page.locator('#passage-picker[open]').count(),0);
   await page.locator('#ux-chapter-picker').click();await page.locator('#passage-reference').click();await page.keyboard.type('Genesis 2:3');await page.locator('#passage-reference-go').click();await page.waitForFunction(()=>location.hash==='#read/0/2/3');await page.locator('#verse-3').waitFor();assert.equal(await page.locator('#passage-picker[open]').count(),0,'Pointer/keyboard entry and the Go button navigate to the typed verse');
   await page.locator('#ux-chapter-picker').click();await page.locator('#reader-edition').focus();await page.keyboard.press('End');await page.keyboard.press('Tab');await page.waitForFunction(()=>document.getElementById('reader-edition').value==='asv'&&document.getElementById('lens-edition').value==='asv');await page.keyboard.press('Escape');await page.locator('#passage-picker').waitFor({state:'hidden'});assert.equal(await page.evaluate(()=>document.activeElement.id),'ux-chapter-picker');
   await page.evaluate(()=>BibleLensWorkspace.navigate('#compare?left=Exodus%201&right=Genesis%201'));await page.locator('.lens-comparison-passage').first().waitFor();await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'ux-chapter-picker');
   if(width===601)await checkBottomNavigation(page);
   assert.deepEqual(errors,[]);matrix.push(...contextResults);console.log('PASS reader',engine,width,height,native?'native safe area':'web');
   }catch(error){await page.screenshot({path:`${output}/failure-${engine}-${width}x${height}-${native?'native':'web'}.png`,fullPage:false}).catch(()=>{});throw error;}
   finally{fs.writeFileSync(`${output}/${engine}-${width}x${height}-${native?'native':'web'}-network.json`,JSON.stringify(network,null,2)+'\n');fs.writeFileSync(`${output}/${engine}-${width}x${height}-${native?'native':'web'}-search-events.json`,JSON.stringify(await page.evaluate(()=>window.__readerSearchEvents||[]).catch(()=>[]),null,2)+'\n');await context.close();}
  }
 }finally{await browser.close();}
}}finally{fs.writeFileSync(output+'/matrix.json',JSON.stringify(matrix,null,2)+'\n');}
assert.equal(matrix.length,112);
console.log(JSON.stringify(matrix,null,2));
