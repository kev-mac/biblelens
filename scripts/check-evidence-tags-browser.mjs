import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';

// Run against an approved preview. This script never starts a server or changes browser security.
const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to an approved preview.');
const record=(id,extra={})=>({id,verse:3,ref:'Genesis 1:3',title:'Context '+id,summary:'This summary describes the source context.',reasoning:'Full supporting evidence for '+id,sources:[],...extra});
const shared=record('fixture-shared',{tags:['H','G','T','T']});
const fixtures={history:[shared,shared,record('fixture-translation',{tag:'T'}),record('fixture-context',{tag:'T',activeTags:['H'],placementRole:'context'})],science:[record('fixture-shared',{tag:'H'}),record('fixture-science')],contradictions:[record('fixture-violation',{tag:'V'}),record('fixture-comparison')],questions:[record('fixture-question',{tag:'Q'})],commandments:[record('fixture-law',{tags:['V','H']})]};
const expected={T:2,V:1,commandments:1,Q:1,academic:3,contradictions:1};
const palette={T:'168,85,247',V:'244,63,94',commandments:'20,184,166',Q:'16,185,129',academic:'59,130,246',contradictions:'249,115,22'};
let runs=0;const results=[],output='.release/evidence-tags';fs.mkdirSync(output,{recursive:true});
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const width of [320,390,469,601,647,820,1024,1440])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height:[469,601].includes(width)?1184:1024},hasTouch:width<=820,reducedMotion:'reduce',serviceWorkers:'block'});
  try{
   await context.addInitScript(()=>localStorage.setItem('biblelens-evidence-visible','true'));
   const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
   await page.route('**/api/comparisons?**',route=>route.fulfill({json:{items:fixtures[new URL(route.request().url()).searchParams.get('mode')]||[]}}));
   await page.goto(base+'/#read/0/1');
   await page.waitForFunction(()=>reading?.chapter===1&&comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));
   // Persist the preference as the Settings control does; startup journal
   // updates must not restore the old theme after a test-only state mutation.
   await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);
   await page.waitForFunction(theme=>state.theme===theme&&document.body.classList.contains('dark')===(theme==='dark'),theme);
   await page.evaluate(async()=>{await new Promise(requestAnimationFrame);await Promise.all(document.getAnimations().filter(animation=>'transitionProperty' in animation&&/color/.test(animation.transitionProperty)).map(animation=>animation.finished.catch(()=>{})));});
   const pills=page.locator('#verse-3 [data-lens-category]');assert.equal(await pills.count(),6);
   const geometry=await pills.evaluateAll(nodes=>nodes.map(node=>({key:node.dataset.lensCategory,box:node.getBoundingClientRect().toJSON(),pill:node.querySelector('span').getBoundingClientRect().toJSON(),margin:node.closest('.verse-body').getBoundingClientRect().toJSON(),position:getComputedStyle(node).position})));
   for(const item of geometry){assert(item.box.width>=24&&item.box.height>=24&&item.box.height<=28,'Tags have compact, separate 24px targets');assert(item.box.left>=item.margin.left-.5&&item.box.right<=item.margin.right+.5);assert(item.pill.height<=15,'Visible bordered pills are smaller than build 393');assert.equal(item.position,'relative');}
   for(let i=0;i<geometry.length;i++)for(let j=i+1;j<geometry.length;j++){const a=geometry[i].box,b=geometry[j].box;assert(!(a.left<b.right-.5&&b.left<a.right-.5&&a.top<b.bottom-.5&&b.top<a.bottom-.5),'Touch targets overlap');}
   const inline=await page.locator('#verse-3 [data-scripture]').evaluate(node=>{const text=[...node.childNodes].find(node=>node.nodeType===Node.TEXT_NODE),tags=node.querySelector('.verse-evidence-tags');return {display:getComputedStyle(tags).display,textBefore:!!(text.compareDocumentPosition(tags)&Node.DOCUMENT_POSITION_FOLLOWING)};});
   assert.deepEqual(inline,{display:'inline',textBefore:true});
   for(const [key,count] of Object.entries(expected)){
    const pill=page.locator(`#verse-3 [data-lens-category="${key}"]`),label=await pill.innerText();
    assert.equal(Number(await pill.getAttribute('data-evidence-count')),count);assert.equal(label,label.toUpperCase());assert.equal(label.includes('('+count+')'),count>1);
    const colors=await pill.evaluate((node,{rgb,dark})=>{
     const mark=node.querySelector('.verse-study-pill'),probe=document.createElement('span');probe.hidden=true;
     probe.style.color=`color-mix(in srgb,rgb(${rgb}) ${dark?70:65}%,${dark?'white':'black'})`;document.body.append(probe);
     const expected=getComputedStyle(probe).color,style=getComputedStyle(mark),tone=getComputedStyle(node).getPropertyValue('--theme-rgb').replace(/\s/g,'');probe.remove();
     // Engines can serialize inherited color(srgb) as rgb(). Compare rendered
     // sRGB channels, retaining the raw values in any failure diagnosis.
     const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d');
     const rgba=value=>{context.clearRect(0,0,1,1);context.fillStyle='#010203';context.fillStyle=value;if(context.fillStyle==='#010203')throw Error('Canvas could not parse '+value);context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data];};
     const desired=rgba(expected),text=rgba(style.color),border=rgba(style.borderTopColor);
     return {tone,desired,text,border,theme:document.body.classList.contains('dark')?'dark':'light',raw:{expected,text:style.color,border:style.borderTopColor}};
    },{rgb:palette[key],dark:theme==='dark'});
    const diagnostic=JSON.stringify({engine,width,theme,key,colors});assert.equal(colors.theme,theme,diagnostic);assert.equal(colors.tone,palette[key],diagnostic);
    for(const actual of [colors.text,colors.border])assert(actual.every((channel,index)=>Math.abs(channel-colors.desired[index])<=1),'Rendered text/border match the existing palette within one 8-bit rounding step: '+diagnostic);
    await pill.focus();if(width<=820)await pill.tap();else await page.keyboard.press('Enter');
    const panel=page.locator('#ux-context-panel');await page.locator('#lens-inspector-sheet[open]').waitFor();
    assert.equal(await panel.getAttribute('data-evidence-category'),key);assert.equal(await panel.getAttribute('data-evidence-view'),'summary');
    assert.equal(await panel.locator('.lens-evidence-summary').count(),count);assert(await panel.locator('.lens-category-verse').isVisible());assert(await panel.locator('[data-cite]').isVisible());
    const cards=await panel.locator('.lens-evidence-summary').evaluateAll(nodes=>nodes.map(node=>{
     const style=getComputedStyle(node),canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');ctx.fillStyle=style.borderTopColor;ctx.fillRect(0,0,1,1);
     return {tone:getComputedStyle(node).getPropertyValue('--theme-rgb').replace(/\s/g,''),border:[...ctx.getImageData(0,0,1,1).data],width:parseFloat(style.borderTopWidth),style:style.borderTopStyle,overflow:node.scrollWidth>node.clientWidth+1};
    }));
    for(const card of cards){assert.equal(card.tone,palette[key]);assert(card.width>=1&&card.style==='solid'&&!card.overflow);assert(card.border.every((channel,index)=>Math.abs(channel-colors.desired[index])<=1),'Summary border matches its category pill: '+JSON.stringify({engine,width,theme,key,card,colors}));}
    const actions=panel.locator('.lens-summary-icon');for(const action of await actions.all()){
     const box=await action.boundingBox();assert(box.width>=44&&box.height>=44);assert.equal((await action.innerText()).trim(),'','Actions use icons instead of visible text');assert(await action.getAttribute('aria-label'));assert(await action.getAttribute('title'));assert.equal(await action.locator('svg[aria-hidden=true]').count(),1);
    }
    if([320,469,601,1440].includes(width))await page.screenshot({path:`${output}/${engine}-${width}-${theme}-${key}-summary.png`,fullPage:false});
    const info=panel.locator('[data-lens-context-info]');assert.equal(await info.count(),key==='academic'?1:0,'Only supporting-context records get a metadata action');
    if(await info.count()){
     const note=page.locator('#'+await info.getAttribute('aria-controls'));assert.equal(await info.getAttribute('aria-expanded'),'false');assert(!(await note.isVisible()));
     await info.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');assert(await info.evaluate(node=>node===document.activeElement),'Tab navigation reaches the information action');await page.keyboard.press('Enter');assert.equal(await info.getAttribute('aria-expanded'),'true');assert(await note.isVisible());assert.match(await note.innerText(),/Supporting context:.*provide background for the verse/);assert(await info.evaluate(node=>node===document.activeElement));
     assert.equal(await info.evaluate(node=>getComputedStyle(node).outlineStyle),'solid','Keyboard focus is visible');
     await page.keyboard.press('Space');assert.equal(await info.getAttribute('aria-expanded'),'false');assert(!(await note.isVisible()));
     if(width<=820)await info.tap();else await info.click();assert(await note.isVisible());assert.equal(await panel.getAttribute('data-evidence-view'),'summary','Metadata does not navigate to an unrelated destination');
     if([320,469,601,1440].includes(width))await page.screenshot({path:`${output}/${engine}-${width}-${theme}-${key}-info.png`,fullPage:false});
    }
    const evidenceAction=panel.locator('[data-lens-evidence-record]').last();await evidenceAction.focus();if(width<=820)await evidenceAction.tap();else await page.keyboard.press('Enter');assert.equal(await panel.getAttribute('data-evidence-view'),'full');
    assert.equal(await panel.locator('.lens-evidence').count(),count);assert.equal(await page.evaluate(()=>document.activeElement.dataset.lensEvidenceIndex),String(count-1));
    await panel.locator('.lens-evidence details summary').last().click();assert.match(await panel.innerText(),/Full supporting evidence/);
    await panel.locator('[data-lens-summary]').click();assert.equal(await panel.getAttribute('data-evidence-view'),'summary');
    await page.keyboard.press('Escape');await page.locator('#lens-inspector-sheet').waitFor({state:'hidden'});assert(await pill.evaluate(node=>node===document.activeElement),'Focus returns to the current category pill');
   }
   const launch=page.locator('#verse-3 [data-lens-category="T"]');await launch.click();await page.locator('#lens-inspector-sheet[open]').waitFor();
   await page.locator('[data-lens-chapter]').click();await page.keyboard.press('Escape');
   await page.locator('#lens-inspector-sheet').waitFor({state:'hidden'});assert(await launch.evaluate(node=>node===document.activeElement),'Whole Chapter returns focus to the launching pill');
   const preserved=await page.locator('#verse-3 [data-scripture]').evaluate(node=>{const text=node.firstChild;BibleLensWorkspace.refresh();return node.firstChild===text;});assert(preserved,'Evidence refresh preserves scripture nodes');
   if([469,601,1440].includes(width)){
    // The annotated real Genesis 1:16 cards, without fixture replacement.
    await page.unroute('**/api/comparisons?**');await page.reload();await page.waitForFunction(()=>reading?.chapter===1&&comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));
    await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);await page.locator('#verse-16 [data-lens-category=academic]').click();await page.locator('#lens-inspector-sheet[open]').waitFor();
    const actual=page.locator('#ux-context-panel');assert.deepEqual(await actual.locator('.lens-evidence-summary h3').allTextContents(),['Plants before the Sun?','Celestial lights and the creation sequence']);assert.equal(await actual.locator('[data-lens-context-info]').count(),2);
    await page.screenshot({path:`${output}/${engine}-${width}-${theme}-genesis-1-16.png`,fullPage:false});
    const about=actual.locator('[data-lens-context-info]').first();await about.click();assert.equal(await about.getAttribute('aria-expanded'),'true');await actual.locator('[data-lens-evidence-record]').first().click();assert.equal(await actual.getAttribute('data-evidence-view'),'full');await actual.locator('[data-lens-summary]').click();assert.equal(await actual.getAttribute('data-evidence-view'),'summary');await page.locator('[data-lens-chapter]').click();await page.keyboard.press('Escape');
   }
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);runs++;console.log('PASS evidence pills',engine,width,theme);
   results.push({engine,width,height:[469,601].includes(width)?1184:1024,theme,status:'PASS',categories:Object.keys(expected),realGenesisContext:[469,601,1440].includes(width)});fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');
  }finally{await context.close();}
 }}finally{await browser.close();}
}
assert.equal(runs,32);console.log(`PASS: ${runs} phone, tablet and desktop cases; six category-colored summary borders, accessible icon actions, metadata disclosure, actual Genesis 1:16 context cards, counts, evidence sections, inline margins, touch targets, keyboard and focus return.`);
