import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
import {debatePage,groupEvidenceDisplay,compareEvidenceReferences} from '../worker/debates.mjs';

// Use an approved prepared preview. Optional source overlay is a no-build UI
// check, not packaged release verification. It never writes or rebuilds assets.
const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to an approved preview.');
const sourceOverlay=process.env.BIBLELENS_SOURCE_OVERLAY==='1';
const records=JSON.parse(fs.readFileSync('data/evidence.json','utf8'));
const groups=groupEvidenceDisplay([...records].sort(compareEvidenceReferences)).filter(group=>group.key);
const output='.release/evidence-display-groups'+(sourceOverlay?'-source':'');fs.mkdirSync(output,{recursive:true});
const results=[];
const settle=page=>page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
const ready=page=>page.waitForFunction(()=>document.querySelector('#debates-view:not([hidden]) #debate-count')?.textContent.startsWith('Showing'));
const go=async(page,hash)=>{await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);await ready(page);await settle(page);};
const selection=group=>{const params=new URLSearchParams({mode:group.key.startsWith('genesis')?'history':'text'});for(const id of group.recordIds)params.append('id',id);return '#questions?'+params;};
const fit=async page=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page fits viewport');
async function overlay(route){
 const url=new URL(route.request().url());
 if(url.pathname==='/api/debates'){await route.fulfill({json:debatePage(records,url.searchParams)});return;}
 if(/^\/assets\/(?:app|debates)\..*\.js$/.test(url.pathname)){
  const response=await route.fetch();let body=await response.text();
  body=body.replace(/  const sources = (.+);\n  for/,(_whole,json)=>{
   const sources=JSON.parse(json).map(([name,body])=>[name,name==='/debate-ui.js'?fs.readFileSync('src/debate-ui.js','utf8'):name==='/debates.js'?fs.readFileSync('src/accepted-questions.js','utf8')+'\n'+fs.readFileSync('src/debates.js','utf8'):body]);
   return '  const sources = '+JSON.stringify(sources)+';\n  for';
  });
  await route.fulfill({response,body});return;
 }
 if(/^\/assets\/(?:app|views|study)\..*\.css$/.test(url.pathname)){
  const response=await route.fetch();await route.fulfill({response,body:await response.text()+'\n'+fs.readFileSync('src/overrides.css','utf8')});return;
 }
 await route.continue();
}
if(sourceOverlay)console.log('SOURCE OVERLAY: current Evidence JavaScript/API/styles over prepared app; packaged QA still required.');
for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch(engine==='chromium'?{chromiumSandbox:true}:{});
 try{for(const width of [320,390,820,1280])for(const theme of ['light','dark']){
  const name=`${engine}-${width}-${theme}`,context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.setDefaultTimeout(20000);page.on('pageerror',error=>errors.push(error.message));
  await context.route('**/*',route=>new URL(route.request().url()).origin!==base?route.abort():sourceOverlay?overlay(route):route.continue());
  try{
   await page.goto(base+'/'+selection(groups[0]));await ready(page);
   await page.evaluate(theme=>{state.theme=theme;applyTheme();persist();},theme);
   for(const group of groups){
    const hash=selection(group);await go(page,hash);
    const tile=page.locator(`[data-evidence-group="${group.key}"]`);
    assert.equal(await tile.count(),1);assert.equal(await page.locator('#debate-results>.phase2-debate-card').count(),1,'One display result');
    assert.equal(await page.locator('#debate-count').innerText(),`Showing 1–1 of 1 result · ${group.recordIds.length} records`);
    const links=tile.locator('.evidence-group-members a');
    assert.deepEqual(await links.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href'))),group.recordIds.map(id=>'#debate/'+id));
    const geometry=await links.evaluateAll(nodes=>nodes.map(node=>({box:node.getBoundingClientRect().toJSON(),parent:node.closest('article').getBoundingClientRect().toJSON(),scroll:node.scrollWidth,client:node.clientWidth})));
    for(const row of geometry){assert(row.box.height>=44);assert(row.box.left>=row.parent.left&&row.box.right<=row.parent.right);assert(row.scroll<=row.client+1);}
    const tags=tile.locator('.phase2-verdict');assert.equal(await tags.count(),group.recordIds.length);
    for(const tag of await tags.all())assert(await tag.evaluate(node=>node.scrollWidth<=node.clientWidth+1),'Assessment fits its border');
    await fit(page);
    await links.first().focus();assert.equal(await links.first().evaluate(node=>getComputedStyle(node).outlineStyle),'solid');
    if(width===390)await tile.screenshot({path:`${output}/${name}-${group.key}.png`});
    if(width===390&&theme==='light'){
     for(const id of group.recordIds){
      const record=records.find(row=>row.id===id);await page.locator(`[data-evidence-group="${group.key}"] a[href="#debate/${id}"]`).click();
      await page.locator('#debate-view .phase2-sides:not([aria-busy])').waitFor();await page.locator('[data-debate-save]').waitFor();
      assert.equal(await page.evaluate(()=>location.hash),'#debate/'+id);
      assert.equal(await page.locator('#debate-view .phase2-summary p').innerText(),record.summary||record.text);
      await page.locator('[data-debate-save]').click();assert.equal(await page.locator('[data-debate-save]').getAttribute('aria-pressed'),'true');
      assert(await page.evaluate(id=>BibleLensDebateStore.read(id).saved,id),'The original ID is saved independently');
      if(record.scope){await page.locator('.phase2-deeper summary').click();assert((await page.locator('.phase2-deeper').innerText()).includes(record.scope));}
      await page.locator('[data-debate-sources]').click();await page.locator('#debate-sheet[open]').waitFor();
      const sources=[...(record.sources||[]),...(record.fields||[]).flatMap(field=>field.sources||[])].filter(source=>/^https:\/\//.test(source.url));
      for(const source of sources)assert(await page.locator('#debate-sheet a').evaluateAll((nodes,url)=>nodes.some(node=>node.getAttribute('href')===url),source.url));
      await page.keyboard.press('Escape');await page.goBack();await ready(page);assert.equal(await page.evaluate(()=>location.hash),hash);
     }
    }
   }
   // Single-member search stays a record, not a synthetic replacement group.
   await go(page,'#questions?mode=history&q=Genesis%2012%3A13');
   const expected=debatePage(records,new URLSearchParams({mode:'history',q:'Genesis 12:13',group:'display'}));
   assert(expected.records.some(record=>record.id==='genesis-wife-sister-12'),'Search finds the exact member');
   assert.equal(await page.locator('#debate-results .phase2-debate-card').count(),expected.displayGroups.length);
   for(const row of expected.records)assert(await page.locator('#debate-results a').evaluateAll((nodes,id)=>nodes.some(node=>node.getAttribute('href')==='#debate/'+id),row.id));
   assert.equal(await page.locator('[data-evidence-group="genesis-wife-sister"]').count(),0);
   await go(page,'#questions?mode=history');
   const first=debatePage(records,new URLSearchParams({mode:'history',group:'display'}));
   assert((await page.locator('#debate-count').innerText()).endsWith(`of ${first.displayTotal.toLocaleString()} results · ${first.total.toLocaleString()} records`));
   await page.locator('[data-debate-page="1"]').click();await ready(page);assert((await page.locator('#debate-count').innerText()).startsWith('Showing 25–48'));
   await page.goBack();await ready(page);assert((await page.locator('#debate-count').innerText()).startsWith('Showing 1–24'));
   await fit(page);assert.deepEqual(errors,[]);results.push({name,sourceOverlay,status:'PASS'});fs.writeFileSync(output+'/matrix.json',JSON.stringify(results,null,2)+'\n');console.log('PASS',name);
  }catch(error){await page.screenshot({path:`${output}/${name}-failure.png`}).catch(()=>{});throw error;}
  finally{await context.close();}
 }}finally{await browser.close();}
}
console.log('PASS: four groups, nine original detail/save links, source/scope parity, counts, search, pagination, Back, 44px links, focus, chips and viewport fit in Chromium/WebKit at four widths and both themes.');
