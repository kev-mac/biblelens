import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';

// Run against an approved preview. This script never starts a server or changes browser security.
const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to an approved preview.');
const record=(id,extra={})=>({id,verse:3,ref:'Genesis 1:3',title:'Context '+id,summary:'This summary describes the source context.',reasoning:'Full supporting evidence for '+id,sources:[],...extra});
const shared=record('fixture-shared',{tags:['H','G','T','T']});
const fixtures={history:[shared,shared,record('fixture-translation',{tag:'T'}),record('fixture-context',{tag:'T',activeTags:['H'],placementRole:'context'})],science:[record('fixture-shared',{tag:'H'}),record('fixture-science')],contradictions:[record('fixture-violation',{tag:'V'}),record('fixture-comparison')],questions:[record('fixture-question',{tag:'Q'})],commandments:[record('fixture-law',{tags:['V','H']})]};
const expected={T:2,V:1,commandments:1,Q:1,academic:3,contradictions:1};
const palette={T:'168,85,247',V:'244,63,94',commandments:'20,184,166',Q:'16,185,129',academic:'59,130,246',contradictions:'249,115,22'};
let runs=0;
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{for(const width of [320,390,647,820,1024,1440])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height:1024},hasTouch:width<=820,reducedMotion:'reduce',serviceWorkers:'block'});
  try{
   await context.addInitScript(()=>localStorage.setItem('biblelens-evidence-visible','true'));
   const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
   await page.route('**/api/comparisons?**',route=>route.fulfill({json:{items:fixtures[new URL(route.request().url()).searchParams.get('mode')]||[]}}));
   await page.goto(base+'/#read/0/1');
   await page.waitForFunction(()=>reading?.chapter===1&&comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));
   await page.evaluate(theme=>{state.theme=theme;applyTheme();},theme);
   const pills=page.locator('#verse-3 [data-lens-category]');assert.equal(await pills.count(),6);
   const geometry=await pills.evaluateAll(nodes=>nodes.map(node=>({key:node.dataset.lensCategory,box:node.getBoundingClientRect().toJSON(),pill:node.querySelector('span').getBoundingClientRect().toJSON(),margin:node.closest('.verse-body').getBoundingClientRect().toJSON(),position:getComputedStyle(node).position})));
   for(const item of geometry){assert(item.box.width>=44&&item.box.height>=44);assert(item.box.left>=item.margin.left-.5&&item.box.right<=item.margin.right+.5);assert(item.pill.height<30);assert.equal(item.position,'relative');}
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
     return {tone,text:style.color===expected,border:style.borderTopColor===expected};
    },{rgb:palette[key],dark:theme==='dark'});
    assert.deepEqual(colors,{tone:palette[key],text:true,border:true},'Text and border match the existing category palette in this theme');
    await pill.focus();if(width<=820)await pill.tap();else await page.keyboard.press('Enter');
    const panel=page.locator('#ux-context-panel');await page.locator('#lens-inspector-sheet[open]').waitFor();
    assert.equal(await panel.getAttribute('data-evidence-category'),key);assert.equal(await panel.getAttribute('data-evidence-view'),'summary');
    assert.equal(await panel.locator('.lens-evidence-summary').count(),count);assert(await panel.locator('.lens-category-verse').isVisible());assert(await panel.locator('[data-cite]').isVisible());
    await panel.locator('[data-lens-evidence-record]').last().click();assert.equal(await panel.getAttribute('data-evidence-view'),'full');
    assert.equal(await panel.locator('.lens-evidence').count(),count);assert.equal(await page.evaluate(()=>document.activeElement.dataset.lensEvidenceIndex),String(count-1));
    await panel.locator('.lens-evidence details summary').last().click();assert.match(await panel.innerText(),/Full supporting evidence/);
    await panel.locator('[data-lens-summary]').click();assert.equal(await panel.getAttribute('data-evidence-view'),'summary');
    await page.keyboard.press('Escape');await page.locator('#lens-inspector-sheet').waitFor({state:'hidden'});assert(await pill.evaluate(node=>node===document.activeElement),'Focus returns to the current category pill');
   }
   const launch=page.locator('#verse-3 [data-lens-category="T"]');await launch.click();await page.locator('#lens-inspector-sheet[open]').waitFor();
   await page.locator('[data-lens-chapter]').click();await page.keyboard.press('Escape');
   await page.locator('#lens-inspector-sheet').waitFor({state:'hidden'});assert(await launch.evaluate(node=>node===document.activeElement),'Whole Chapter returns focus to the launching pill');
   const preserved=await page.locator('#verse-3 [data-scripture]').evaluate(node=>{const text=node.firstChild;BibleLensWorkspace.refresh();return node.firstChild===text;});assert(preserved,'Evidence refresh preserves scripture nodes');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);runs++;console.log('PASS evidence pills',engine,width,theme);
  }finally{await context.close();}
 }}finally{await browser.close();}
}
console.log(`PASS: ${runs} phone, tablet and desktop cases; six categories, counts, summaries, evidence sections, inline margins, touch targets, keyboard and focus return.`);
