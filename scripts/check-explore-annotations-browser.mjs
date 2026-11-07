import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL;if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to an approved preview.');
const output='.release/explore-annotations';fs.mkdirSync(output,{recursive:true});const results=[];
const screens=[[320,844],[844,320],[390,844],[844,390],[525,985],[985,525],[820,1180],[1180,820],[1024,1366],[1366,1024],[1440,900],[1920,1080]];
const ids=['stories','people','places','commandments','lost','evidence','timeline'];
try{for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
 try{for(const [width,height]of screens)for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height},hasTouch:Math.min(width,height)<=1024,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(20000);
  try{
   await page.goto(base+'/#discover');const input=page.locator('#ux-explore-search');await input.waitFor();
   await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('.ux-explore-filters,[data-explore-filter]').count(),0);
   assert.equal(await page.locator('#explore-view>h1.sr-only').textContent(),'Explore');assert.equal(await page.getByRole('heading',{name:'Explore',exact:true}).count(),1,'Screen readers retain a named page heading');
   assert.equal(await page.locator('#lensMasthead .ux-search:visible').count(),0);assert.equal(await page.locator('#lens-settings:visible').count(),1);
   assert.equal(await page.locator('#explore-view .ux-topic-section').count(),1,'Default Explore has exactly one collection row');assert.equal(await page.locator('#explore-view .ux-topic-row').count(),1);assert.equal(await page.locator('#explore-view .ux-topic').count(),7);assert.equal(await page.locator('#ux-lane-collections .ux-topic').count(),7);assert.equal(await page.locator('#ux-lane-manuscripts,#ux-topic-text,#ux-topic-translation').count(),0,'No appended tools row or extra cards');
   for(const id of ids)assert.equal(await page.locator('#ux-topic-'+id).count(),1);
   const lane=page.locator('#ux-lane-collections'),card=page.locator('#ux-topic-stories');await page.waitForFunction(()=>document.getElementById('ux-topic-stories').classList.contains('ux-topic-centered'));
   const measures=await card.evaluate(node=>{const r=node.getBoundingClientRect(),row=node.parentElement.getBoundingClientRect();return {width:r.width,height:r.height,left:r.left,right:r.right,rowLeft:row.left,rowRight:row.right,radius:getComputedStyle(node).borderRadius,imageFit:getComputedStyle(node.querySelector('img')).objectFit};});
   assert(measures.left>=measures.rowLeft-1&&measures.right<=measures.rowRight+1,JSON.stringify(measures));assert.equal(measures.radius,'21px');assert.equal(measures.imageFit,'cover');
   assert(width>height?measures.width>measures.height:measures.height>measures.width,JSON.stringify({width,height,measures}));
   assert.deepEqual(await page.locator('#explore-view .ux-topic').evaluateAll(nodes=>nodes.filter(node=>node.scrollHeight>node.clientHeight+1||node.scrollWidth>node.clientWidth+1).map(node=>node.id)),[],'Overlay copy fits all cards');
   for(const selector of ['#ux-explore-search','#ux-explore-search-form>button']){const box=await page.locator(selector).boundingBox();assert(box.width>=44&&box.height>=44&&box.x>=0&&box.x+box.width<=width);}
   const fieldBox=await input.boundingBox(),submitBox=await page.locator('#ux-explore-search-form>button').boundingBox();assert(Math.abs(fieldBox.y-submitBox.y)<=1,'Search stays in one compact row: '+JSON.stringify({engine,width,height,fieldBox,submitBox}));
   assert.equal(await card.locator('img').evaluate(node=>getComputedStyle(node).objectPosition),'88% 50%','The portrait crop retains the people at the doorway');
   if(width<height){const bounds=await card.boundingBox(),badge=await card.locator('.ux-count').boundingBox();assert(badge.x+badge.width<bounds.x+bounds.width*.65,'The portrait count stays away from the face at the upper right');}
   await lane.focus();await page.keyboard.press('End');await page.waitForFunction(()=>document.getElementById('ux-topic-timeline').classList.contains('ux-topic-centered'));
   await page.keyboard.press('Home');await page.waitForFunction(()=>document.getElementById('ux-topic-stories').classList.contains('ux-topic-centered'));
   await lane.focus();await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.getElementById('ux-topic-people').classList.contains('ux-topic-centered'));
   const firstPage=page.locator('.ux-topic-section').first().locator('.ux-lane-page').first();if(Math.min(width,height)<=1024)await firstPage.tap();else await firstPage.click();await page.waitForFunction(()=>document.getElementById('ux-topic-stories').classList.contains('ux-topic-centered'));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Only collection lanes scroll horizontally');
   if(width===525&&height===985){
    await lane.focus();await page.keyboard.press('End');await page.waitForFunction(()=>document.getElementById('ux-topic-timeline').classList.contains('ux-topic-centered'));
    const before=await page.locator('#ux-topic-timeline').boundingBox();await page.setViewportSize({width:985,height:525});
    await page.waitForFunction(()=>{const card=document.getElementById('ux-topic-timeline'),a=card.getBoundingClientRect(),b=card.parentElement.getBoundingClientRect();return card.classList.contains('ux-topic-centered')&&a.left>=b.left-1&&a.right<=b.right+1;});
    const after=await page.locator('#ux-topic-timeline').boundingBox();assert(after.width>before.width&&after.height<before.height,'Rotation makes the retained tile wider and shorter');
    await page.setViewportSize({width,height});
   }
   await input.fill('John 3:16');await input.press('Enter');await page.locator('#lens-search-overlay[open]').waitFor();
   assert.equal(await page.locator('#lens-search-input').inputValue(),'John 3:16');await page.locator('#lens-results-scripture .lens-result').first().waitFor();
   await page.keyboard.press('Escape');await page.waitForFunction(()=>location.hash==='#discover'&&document.activeElement.id==='ux-explore-search');assert.equal(await input.inputValue(),'John 3:16');
   await input.press('Escape');assert.equal(await input.inputValue(),'');assert.equal(await page.locator('#lens-search-overlay[open]').count(),0);
   await input.fill('mercy');await page.locator('#ux-explore-search-form>button').click();await page.locator('#lens-search-overlay[open]').waitFor();await page.locator('#lens-search-results .lens-result').first().waitFor();
   await page.locator('[data-search-cancel]').click();await page.waitForFunction(()=>location.hash==='#discover'&&document.activeElement.id==='ux-explore-search');
   // Reach both tools through the existing Evidence destination and its filters.
   await page.locator('.ux-topic-section .ux-lane-page').nth(5).click();await page.waitForFunction(()=>document.getElementById('ux-topic-evidence').classList.contains('ux-topic-centered'));
   await page.locator('#ux-topic-evidence').click();await page.locator('#debates-view:not([hidden]) .phase2-debate-card').first().waitFor();
   assert.equal(await page.locator('#debates-view h1').textContent(),'Text Comparisons');assert.equal(await page.locator('[data-debate-mode=text]').getAttribute('aria-pressed'),'true');
   await page.getByRole('button',{name:'Filter records',exact:true}).click();await page.locator('#debate-sheet[open]').getByRole('link',{name:'Translations',exact:true}).click();
   await page.locator('#debates-view:not([hidden]) .phase2-debate-card').first().waitFor();await page.waitForFunction(()=>new URLSearchParams(location.hash.split('?')[1]).get('filter')==='T'&&document.querySelector('[data-debate-mode=translation]')?.getAttribute('aria-pressed')==='true');
   assert.equal(await page.locator('#debates-view h1').textContent(),'Translations');
   await page.getByRole('button',{name:'Filter records',exact:true}).click();await page.locator('#debate-sheet[open] nav[aria-label="Evidence collections"]').getByRole('link',{name:'Text Comparisons',exact:true}).click();
   await page.waitForFunction(()=>location.hash==='#questions?mode=text'&&document.querySelector('[data-debate-mode=text]')?.getAttribute('aria-pressed')==='true');await page.locator('#debates-view:not([hidden]) .phase2-debate-card').first().waitFor();
   await page.locator('#debates-view a[aria-label="Back to Explore"]').click();await input.waitFor();assert.equal(await page.locator('#explore-view .ux-topic-section').count(),1);assert.equal(await page.locator('#explore-view .ux-topic').count(),7);
   if(width===525&&height===985){
    await page.evaluate(()=>BibleLensWorkspace.navigate('#read/0/1'));await page.locator('#verse-1').waitFor();assert(await page.locator('#lensMasthead .ux-search').isVisible(),'Other views retain masthead search');
    await page.locator('#lensMasthead .ux-search').click();await page.locator('#lens-search-overlay[open]').waitFor();await page.keyboard.press('Escape');await page.waitForFunction(()=>location.hash.startsWith('#read'));
    await page.evaluate(()=>BibleLensWorkspace.navigate('#discover?section=evidence'));await page.locator('#ux-topic-evidence').waitFor();assert.equal(await page.locator('#explore-view .ux-topic').count(),2);
    await page.evaluate(()=>BibleLensWorkspace.navigate('#discover'));await input.waitFor();assert.equal(await page.locator('#explore-view .ux-topic').count(),7);assert.equal(await page.locator('#explore-view .ux-topic-section').count(),1);
   }
   assert.deepEqual(errors,[]);
   if([525,985,820,1180,1440].includes(width)){await input.fill('');await page.locator('.ux-topic-section').first().locator('.ux-lane-page').first().click();await page.waitForFunction(()=>document.getElementById('ux-topic-stories').classList.contains('ux-topic-centered'));await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${output}/${engine}-${width}x${height}-${theme}.png`,fullPage:true});}
   results.push({engine,width,height,theme,status:'PASS',tile:measures});console.log('PASS Explore',engine,width,height,theme);
  }catch(error){results.push({engine,width,height,theme,status:'FAIL',error:error.message});await page.screenshot({path:`${output}/failure-${engine}-${width}x${height}-${theme}.png`,fullPage:true}).catch(()=>{});throw error;}
  finally{await context.close();}
 }}finally{await browser.close();}
}}finally{fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');}
assert.equal(results.length,48);console.log('PASS: 48 portrait/landscape phone, annotated viewport, iPad and desktop cases; one Collections row, seven destinations, Text Comparisons/Translations reached through Evidence filters, fluid tile cropping, search, dismissal, focus, masthead actions and keyboard/touch navigation.');
