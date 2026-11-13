import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to the authorized local preview.');
fs.mkdirSync('.release/translation',{recursive:true});
const reports=[];
for(const [name,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch(name==='chromium'?{chromiumSandbox:true}:{});
 try{for(const [width,height]of [[320,844],[390,844],[820,1024],[1366,900]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:width<=820,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  let failOnce=true;
  await context.route('**/translation/bsb-v1/*.json.gz',async route=>{
   const name=new URL(route.request().url()).pathname.split('/').pop();
   if(name==='0-3.json.gz'&&failOnce){return route.fulfill({status:503,body:'Unavailable'});}
   if(name==='0-2.json.gz')await new Promise(resolve=>setTimeout(resolve,300));
   const file='data/translation/bsb-v1/'+name;
   return fs.existsSync(file)?route.fulfill({status:200,contentType:'application/gzip',body:fs.readFileSync(file)}):route.fulfill({status:404,body:'Missing'});
  });
  const navigate=async(book,chapter)=>{await page.evaluate(([b,c])=>BibleLensWorkspace.navigate('#read/'+b+'/'+c),[book,chapter]);await page.locator('#chapter-text[aria-busy="false"]').waitFor();await page.locator('#verse-1').waitFor();};
  const open=async verse=>{
   await page.locator('#verse-'+verse+' .verse-num').click();
   await page.locator('#ux-empty-verse-actions [data-context-translation]').click();
   await page.locator('#translation-dialog[open]').waitFor();
   await page.locator('#translation-result[aria-busy="false"]').waitFor();
  };
  await page.goto(base+'/#read/0/1');await page.locator('#verse-28').waitFor();await open(28);
  assert.match(await page.locator('#translation-title').textContent(),/Genesis 1:28/);
  assert.match(await page.locator('#translation-edition-limit').textContent(),/unavailable/);
  const tiles=await page.locator('.translation-tile').evaluateAll(nodes=>nodes.map(n=>({english:n.querySelector('.translation-english').textContent,original:n.querySelector('.translation-original')?.textContent,dir:n.querySelector('.translation-original')?.dir,lang:n.querySelector('.translation-original')?.lang,box:n.getBoundingClientRect().toJSON(),style:getComputedStyle(n.querySelector('.translation-original')||n).unicodeBidi})));
  assert(tiles.find(t=>t.english==='Be fruitful')?.dir==='rtl');assert(tiles.every(t=>!t.original||t.lang==='he'));
  for(let i=1;i<tiles.length;i++)assert(tiles[i].box.y>tiles[i-1].box.y-1&&(Math.abs(tiles[i].box.y-tiles[i-1].box.y)>1||tiles[i].box.x>tiles[i-1].box.x),'English reading order');
  assert.equal(await page.locator('.translation-tiles').evaluate(n=>getComputedStyle(n).display),'flex','Tile layout survives CSS optimization');
  assert.equal(await page.locator('.translation-tile').first().evaluate(n=>getComputedStyle(n).flexDirection),'column','Each tile stacks its three lines');
  assert(await page.locator('.translation-tile').first().evaluate(n=>n.querySelector('.translation-original').getBoundingClientRect().top>n.querySelector('.translation-english').getBoundingClientRect().bottom),'Original text stays below English');
  assert.equal(await page.locator('#translation-dialog').getAttribute('aria-labelledby'),'translation-title');
  assert(await page.locator('#translation-dialog').evaluate(n=>n.scrollWidth<=n.clientWidth+1),'No horizontal overflow');
  assert(tiles.every(t=>t.style.includes('isolate')));if(width<400){assert(new Set(tiles.map(t=>t.box.y)).size>1,'Phone wrapping');assert(tiles.some((t,i)=>i&&Math.abs(t.box.y-tiles[i-1].box.y)<1),'Phone uses multiple tiles per line');}
  const before=await page.locator('.translation-tiles').innerText();
  await page.locator('#translation-edition').selectOption('web');
  assert.match(await page.locator('#translation-selected-label').textContent(),/World English|WEB/i);
  assert.equal(await page.locator('#reader-edition').inputValue(),'web');
  assert.equal(await page.locator('.translation-tiles').innerText(),before,'Edition switch retains clearly labelled BSB alignment');
  await page.locator('#translation-dialog').screenshot({path:'.release/translation/'+name+'-'+width+'.png'});
  await page.keyboard.press('Escape');await page.locator('#translation-dialog').waitFor({state:'hidden'});
  await open(28);await page.locator('[data-translation-close]').click();await page.locator('#translation-dialog').waitFor({state:'hidden'});
  assert.equal(await page.evaluate(()=>document.activeElement?.closest('.verse')?.id),'verse-28');
  await navigate(42,1);await open(1);assert.equal(await page.locator('.translation-original[lang="grc"]').count(),17);await page.keyboard.press('Escape');
  await navigate(26,2);await open(4);assert(await page.locator('.translation-original[lang="arc"]').count());assert(await page.locator('.translation-original[lang="he"]').count());await page.keyboard.press('Escape');
  await navigate(39,17);await open(21);assert.match(await page.locator('#translation-result').textContent(),/unavailable for this verse/);await page.keyboard.press('Escape');
  await navigate(0,3);await open(1);failOnce=false;await page.locator('[data-translation-retry]').click();await page.locator('.translation-tiles').waitFor();await page.keyboard.press('Escape');
  await navigate(0,2);await page.locator('#verse-1 .verse-num').click();await page.locator('#ux-empty-verse-actions [data-context-translation]').click();await navigate(0,1);await page.waitForTimeout(400);assert.equal(await page.locator('#translation-dialog[open]').count(),0);
  for(let i=0;i<3;i++){await open(28);await page.keyboard.press('Escape');}
  assert.equal(errors.length,0,JSON.stringify(errors));reports.push({engine:name,width,height,tiles:tiles.length,passed:true});await context.close();
 }}finally{await browser.close();}
}
fs.writeFileSync('.release/translation/browser-results.json',JSON.stringify(reports,null,2));console.log('PASS: '+reports.length+' browser/viewport cases; RTL, English order, wrapping, edition switching, missing data, Greek/Aramaic, retry, focus, navigation races and repeated context use.');


