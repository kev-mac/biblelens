import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to an authorized running preview.');
const matrix=[],output='.release/reader-annotations';fs.mkdirSync(output,{recursive:true});
const screens=[[320,844],[390,844],[647,844],[650,844],[651,844],[768,1024],[820,1024],[844,390],[1024,1024],[1165,747],[1366,1024]];
try{for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
 try{
  for(const [width,height] of screens)for(const native of [false,true]){
   const context=await browser.newContext({viewport:{width,height},hasTouch:Math.min(width,height)<=1024,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage();
   const errors=[];page.on('pageerror',error=>errors.push(error.message));
   await page.goto(base+'/#read/1/1');await page.locator('#ux-chapter-picker').filter({hasText:'Exodus'}).waitFor();
   await page.locator('#chapter-text .story-illustration-reader figcaption').first().waitFor();
   await page.evaluate(native=>{document.documentElement.classList.toggle('native-ios',native);document.body.style.setProperty('--app-safe-top',native?'24px':'0px');},native);
   for(const dark of [false,true]){
    await page.evaluate(dark=>{state.theme=dark?'dark':'light';applyTheme();persist();},dark);await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('#lens-settings:visible,[data-open-settings]:visible').count(),1);
    assert.equal(await page.locator('#lens-compare').count(),0);assert.equal(await page.locator('.study-library:visible').count(),0);
    const measures=await page.locator('#lensMasthead,#lensReadingBar,#ux-chapter-picker,#lens-settings').evaluateAll(nodes=>nodes.map(n=>({id:n.id,...n.getBoundingClientRect().toJSON(),font:parseFloat(getComputedStyle(n).fontSize)})));
    const header=measures.find(n=>n.id==='lensMasthead'),bar=measures.find(n=>n.id==='lensReadingBar'),picker=measures.find(n=>n.id==='ux-chapter-picker');
    assert(header.top>=(native?24:0)-1);assert(bar.top>=header.bottom-1);assert(picker.width>=44&&picker.height>=44&&picker.font>=18);
    assert(measures.every(n=>n.left>=-1&&n.right<=width+1));
    assert(await page.locator('#chapter-text .chapter-heading-row').evaluate(n=>[n,...n.querySelectorAll('*')].every(n=>getComputedStyle(n).textShadow==='none')));
    assert(await page.locator('a:visible').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).textDecorationLine==='none')));
    assert(!(await page.locator('#chapter-text .story-illustration-reader figcaption').first().innerText()).startsWith('Imagined scene:'));
    await page.locator('#ux-chapter-picker').focus();await page.keyboard.press('Enter');await page.locator('#passage-picker[open]').waitFor();
    const reference=page.locator('#passage-reference'),referenceGeometry=await reference.evaluate(node=>{
     const box=node.getBoundingClientRect(),control=node.parentElement.getBoundingClientRect(),go=document.getElementById('passage-reference-go').getBoundingClientRect(),style=getComputedStyle(node);
     return {input:box.toJSON(),control:control.toJSON(),go:go.toJSON(),fontSize:parseFloat(style.fontSize),flex:style.flex,disabled:node.disabled,readOnly:node.readOnly,hitAtCenter:document.elementFromPoint(box.x+box.width/2,box.y+box.height/2)===node,stylesheets:[...document.styleSheets].map(sheet=>sheet.href).filter(Boolean)};
    });
    const caseName=`${engine}-${width}x${height}-${native?'native-safe-area':'web'}-${dark?'dark':'light'}`;
    fs.writeFileSync(`${output}/${caseName}-geometry.json`,JSON.stringify(referenceGeometry,null,2)+'\n');
    await page.screenshot({path:`${output}/${caseName}-passage.png`,fullPage:false});
    assert(referenceGeometry.input.width>=160&&referenceGeometry.input.width>=referenceGeometry.control.width*.6,'Reference field has readable editing space: '+JSON.stringify({engine,width,height,native,dark,referenceGeometry}));
    assert(referenceGeometry.input.height>=44&&referenceGeometry.fontSize>=16&&!referenceGeometry.disabled&&!referenceGeometry.readOnly&&referenceGeometry.hitAtCenter,'Reference field is reachable and editable');
    assert(referenceGeometry.input.right<=referenceGeometry.go.left+1&&referenceGeometry.go.right<=referenceGeometry.control.right+1,'Reference and Go stay inside their row');
    await reference.click();assert.equal(await page.evaluate(()=>document.activeElement.id),'passage-reference');await page.keyboard.type('Genesis 2:3');assert.equal(await reference.inputValue(),'Genesis 2:3');
    await page.keyboard.press('Backspace');await page.keyboard.type('4');assert.equal(await reference.inputValue(),'Genesis 2:4');await page.keyboard.press('Backspace');await page.keyboard.type('3');
    await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'passage-reference-go');await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'passage-reference');
    assert.equal(await page.locator('#passage-book-grid input').count(),39);assert((await page.locator('#passage-book-grid').innerText()).includes('Song of Solomon'));
    const choices=await page.locator('#passage-book-grid label').evaluateAll(nodes=>nodes.map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height,scroll:n.firstElementChild.nextElementSibling.scrollWidth,client:n.firstElementChild.nextElementSibling.clientWidth,radius:getComputedStyle(n.firstElementChild.nextElementSibling).borderRadius})));
    assert(choices.every(n=>n.w>=44&&n.h>=44&&n.scroll<=n.client+1&&n.radius==='12px'));
    await page.locator('[data-passage-step="chapter"]').click();assert.equal(await page.locator('#passage-chapter-grid input').count(),40,'All Exodus chapters retained');
    assert(await page.locator('#passage-chapter-grid label').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return r.width>=44&&r.height>=44;})));
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'ux-chapter-picker');
    await page.locator('#lensMasthead .ux-search').click();await page.locator('#lens-search-overlay[open]').waitFor();
    const search=page.locator('#lens-search-input'),searchBox=await search.boundingBox();assert(searchBox.width>=160&&searchBox.height>=44,'Global Search also retains a readable input');
    await search.click();await page.keyboard.type('mercy');assert.equal(await search.inputValue(),'mercy');assert.equal(await page.evaluate(()=>document.activeElement.id),'lens-search-input');
    await page.screenshot({path:`${output}/${caseName}-search.png`,fullPage:false});await page.keyboard.press('Escape');await page.waitForFunction(()=>location.hash.startsWith('#read')&&!document.querySelector('#lens-search-overlay[open]'));
    await page.locator('#lens-settings').focus();await page.keyboard.press('Enter');await page.locator('#reader-settings[open]').waitFor();await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'lens-settings');
    await page.evaluate(()=>scrollTo(0,500));await page.waitForTimeout(300);
    const sticky=await page.locator('#lensMasthead,#lensReadingBar').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON())),scenario=JSON.stringify({engine,width,native,dark,sticky});assert(sticky[0].top>=(native?24:0)-1,scenario);assert(sticky[1].top>=sticky[0].bottom-1,scenario);
    assert(Math.abs(await page.locator('body').evaluate(node=>parseFloat(getComputedStyle(node).getPropertyValue('--ux13-masthead-height')))-sticky[0].height)<=1,'Measured header height reaches the body after scrolling');
    assert((await page.locator('#ux-chapter-picker').evaluate(n=>parseFloat(getComputedStyle(n).fontSize)))>=18);
    await page.evaluate(()=>scrollTo(0,0));matrix.push({engine,width,height,native,dark,status:'PASS',reference:referenceGeometry.input,globalSearch:searchBox});
   }
   await page.evaluate(()=>BibleLensWorkspace.navigate('#read/21/8'));await page.locator('#ux-chapter-picker').filter({hasText:'Song of Solomon'}).waitFor();
   assert((await page.locator('#ux-chapter-picker').evaluate(n=>parseFloat(getComputedStyle(n).fontSize)))>=18);
   await page.locator('#ux-chapter-picker').click();await page.locator('#passage-reference').fill('Exodus 41');await page.locator('#passage-reference').press('Enter');await page.waitForFunction(()=>document.getElementById('passage-reference').getAttribute('aria-invalid')==='true');assert(await page.locator('#passage-reference-status').innerText());
   await page.locator('#passage-reference').fill('Exodus 1:8');await page.locator('#passage-reference').press('Enter');await page.waitForFunction(()=>location.hash==='#read/1/1/8');await page.locator('#verse-8').waitFor();assert.equal(await page.locator('#passage-picker[open]').count(),0);
   await page.locator('#ux-chapter-picker').click();await page.locator('#passage-reference').click();await page.keyboard.type('Genesis 2:3');await page.locator('#passage-reference-go').click();await page.waitForFunction(()=>location.hash==='#read/0/2/3');await page.locator('#verse-3').waitFor();assert.equal(await page.locator('#passage-picker[open]').count(),0,'Pointer/keyboard entry and the Go button navigate to the typed verse');
   await page.evaluate(()=>BibleLensWorkspace.navigate('#compare?left=Exodus%201&right=Genesis%201'));await page.locator('.lens-comparison-passage').first().waitFor();await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'ux-chapter-picker');
   assert.deepEqual(errors,[]);await context.close();
  }
 }finally{await browser.close();}
}}finally{fs.writeFileSync(output+'/matrix.json',JSON.stringify(matrix,null,2)+'\n');}
assert.equal(matrix.length,88);
console.log(JSON.stringify(matrix,null,2));
