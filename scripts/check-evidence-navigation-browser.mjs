import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {chromium,webkit} from 'playwright';

const base=process.env.BIBLELENS_PREVIEW_URL;
if(!base)throw Error('Set BIBLELENS_PREVIEW_URL to the exact prepared app.');
const live=process.env.BIBLELENS_LIVE_BASE_URL||'https://scripture-lens.kvn-mcgwn.chatgpt.site';
const output='.release/evidence-navigation',matrix=[],baseline=[],recordBaseline=[],coldDetails=[],introLayouts=[];
fs.mkdirSync(output,{recursive:true});
const get=async url=>{const r=await fetch(url);assert(r.ok,url+' '+r.status);return r.json();};
const release=await get(base+'/release.json');
const queries=['mode=text','mode=science','mode=history','filter=T'];
const expected=await Promise.all(queries.map(query=>get(base+'/api/debates?'+query)));
const firstText=expected[0].records[0];
assert.equal(firstText.ref,'Genesis 1:3');assert.equal(firstText.mode,'questions');assert.equal(firstText.status,'Context');
const questions=JSON.parse(fs.readFileSync('www/accepted-questions.json'));
const topics=JSON.parse(fs.readFileSync('www/comparison-topics.json'));
const featured=[...questions,...topics];
const total=featured.length,textTotal=featured.filter(row=>row.comparison==='text-vs-text').length;
const historyTotal=featured.filter(row=>row.comparison==='text-vs-history').length;
const conflicts=questions.filter(row=>row.labels.includes('Conflicts with evidence')).length;
assert(total>0&&textTotal>0&&historyTotal>0&&conflicts>0);
assert.equal(questions.filter(row=>row.comparison==='text-vs-text'&&row.labels.includes('Conflicts with evidence')).length,0,'The original incompatible-filter case is present in real packaged data.');
const save=()=>{fs.writeFileSync(output+'/matrix.json',JSON.stringify(matrix,null,2)+'\n');fs.writeFileSync(output+'/live-baseline.json',JSON.stringify(baseline,null,2)+'\n');fs.writeFileSync(output+'/live-record-baseline.json',JSON.stringify(recordBaseline,null,2)+'\n');fs.writeFileSync(output+'/cold-details.json',JSON.stringify(coldDetails,null,2)+'\n');fs.writeFileSync(output+'/intro-layout.json',JSON.stringify(introLayouts,null,2)+'\n');};
async function settle(page){await page.evaluate(()=>document.fonts.ready);await page.evaluate(async()=>{await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);});}
async function fit(page){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Evidence page stays inside its margins.');}
async function introLayout(page,name,stage){
 await settle(page);
 const result=await page.locator('#debates-view .accepted-collection-intro').evaluate(node=>{
  const link=node.querySelector('a'),range=document.createRange();range.selectNodeContents(link);
  const fragments=[...range.getClientRects()].filter(box=>box.width>0).map(box=>box.toJSON());
  const trailing=node.lastChild;range.selectNodeContents(trailing);const period=range.getBoundingClientRect().toJSON();
  return {display:getComputedStyle(node).display,paragraph:node.getBoundingClientRect().toJSON(),scrollWidth:node.scrollWidth,clientWidth:node.clientWidth,linkText:link.textContent,href:link.getAttribute('href'),fragments,punctuation:trailing.textContent,period};
 });
 assert.equal(result.linkText,'Browse all Text Comparisons');assert.equal(result.href,'#questions?mode=text');assert.equal(result.display,'block','Explanatory copy must use normal paragraph flow.');
 assert(result.fragments.length>=1&&result.fragments.length<=2,'The link must not form a thin word-by-word column: '+JSON.stringify(result));
 assert(result.scrollWidth<=result.clientWidth+1,'The explanatory row fits its margins.');
 assert.equal(result.punctuation,'.');const last=result.fragments.at(-1);
 assert(Math.abs(result.period.top-last.top)<=3&&Math.abs(result.period.left-last.right)<=4,'The full stop stays beside the final link text, on the same line: '+JSON.stringify(result));
 await page.locator('.accepted-collection-intro').screenshot({path:`${output}/${name}-${stage}-intro.png`});
 introLayouts.push({name,stage,...result,status:'PASS'});save();
}
async function acceptedReady(page){await page.locator('#debates-view:not([hidden]) .accepted-questions:not([role])').waitFor();}
async function regularReady(page){await page.waitForFunction(()=>document.getElementById('debate-count')?.textContent.startsWith('Showing'));}
async function go(page,hash){await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);}
async function type(page,selector,text){const input=page.locator(selector);await input.click();await page.keyboard.press('Control+A');await page.keyboard.type(text);assert.equal(await input.inputValue(),text);assert.equal(await page.evaluate(()=>document.activeElement.id),selector.slice(1));}
async function liveCase(browser,engine,width,height){
 const context=await browser.newContext({viewport:{width,height},hasTouch:width<1024,serviceWorkers:'block',reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(30000);
 try{
  const response=await page.goto(live+'/#questions');assert(response?.ok(),'The live Evidence baseline must load without authentication changes.');
  await page.locator('.accepted-questions .phase2-debate-card').first().waitFor();
  const identity=await page.evaluate(async()=>await(await fetch('/release.json')).json());
  await page.locator('[data-accepted-filters]').click();const sheet=page.locator('#accepted-question-filters');await sheet.waitFor({state:'visible'});
  await sheet.getByRole('button',{name:/^Conflicts with Evidence \(/i}).click();
  if(await sheet.isVisible())await page.keyboard.press('Escape');
  await settle(page);await page.screenshot({path:`${output}/live-${engine}-${width}-finding.png`,fullPage:false});
  await page.getByRole('button',{name:/^Bible vs\. Bible \(/}).click();await settle(page);
  const result=await page.evaluate(()=>({route:location.hash,heading:document.querySelector('#debates-view h1')?.textContent,count:document.querySelector('#debates-view .directory-results')?.textContent,visibleRecords:document.querySelectorAll('.accepted-questions .phase2-debate-card').length,empty:document.querySelector('.accepted-questions .lens-empty')?.textContent,subject:document.querySelector('#debates-view [aria-pressed=true]')?.textContent,retainedFinding:document.querySelector('#accepted-question-filters [aria-pressed=true]')?.textContent}));
  const observation={engine,width,height,release:identity,...result,reproduced:result.visibleRecords===0&&/Bible vs\. Bible/.test(result.subject||'')&&/Conflicts with Evidence/i.test(result.retainedFinding||'')};
  baseline.push(observation);save();await page.screenshot({path:`${output}/live-${engine}-${width}-after-subject.png`,fullPage:false});
  console.log('LIVE Evidence baseline',JSON.stringify(observation));
 }catch(error){baseline.push({engine,width,height,status:'BLOCKED',error:error.message});save();await page.screenshot({path:`${output}/live-${engine}-${width}-blocked.png`,fullPage:false}).catch(()=>{});throw error;}
 finally{await context.close();}
}

async function liveRecordCase(browser,engine,width,height){
 const context=await browser.newContext({viewport:{width,height},hasTouch:width<1024,serviceWorkers:'block',reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(30000);
 try{
  const response=await page.goto(live+'/#questions?mode=text');assert(response?.ok());await regularReady(page);
  const initial=await page.evaluate(async()=>({release:await(await fetch('/release.json')).json(),record:(await(await fetch('/api/debates?mode=text')).json()).records[0]}));
  const tile=page.locator('#debate-results .phase2-debate-card').first();assert.equal(await tile.getAttribute('href'),'#debate/'+encodeURIComponent(initial.record.id));
  await settle(page);await page.screenshot({path:`${output}/live-${engine}-${width}-first-text-tile.png`,fullPage:false});
  await tile.getByText('View record',{exact:true}).click();
  await page.waitForFunction(()=>!!document.querySelector('[data-debate-save]')||/Record Unavailable|We Couldn’t Find That/.test(document.getElementById('debate-view')?.innerText||''));await settle(page);
  const state=await page.evaluate(()=>({route:location.hash,heading:document.querySelector('.lens-context h1')?.textContent,recordHeading:document.querySelector('#debate-view h1')?.textContent,rendered:!!document.querySelector('[data-debate-save]'),detailText:document.getElementById('debate-view')?.innerText.slice(0,1400)}));
  const observation={engine,width,height,release:initial.release,id:initial.record.id,ref:initial.record.ref,mode:initial.record.mode,assessment:initial.record.verdict||initial.record.status,...state,wrongHeading:initial.record.mode==='questions'&&state.heading==='Contradictions',unavailable:!state.rendered};
  recordBaseline.push(observation);save();await page.screenshot({path:`${output}/live-${engine}-${width}-first-text-record.png`,fullPage:false});console.log('LIVE first Text Comparisons record',JSON.stringify(observation));
 }catch(error){recordBaseline.push({engine,width,height,status:'BLOCKED',error:error.message});save();await page.screenshot({path:`${output}/live-${engine}-${width}-first-record-blocked.png`,fullPage:false}).catch(()=>{});throw error;}
 finally{await context.close();}
}

const mobile=spawn(process.execPath,['scripts/serve-mobile.mjs'],{stdio:['ignore','pipe','pipe']});
const mobileLog=fs.createWriteStream(output+'/mobile-preview.log');mobile.stdout.pipe(mobileLog,{end:false});mobile.stderr.pipe(mobileLog,{end:false});
const offline='http://127.0.0.1:8788';
try{
 let ready=false;
 for(let attempt=0;attempt<100;attempt++){
  if(mobile.exitCode!==null)throw Error('The owned static mobile preview exited before readiness.');
  try{const actual=await get(offline+'/release.json');assert.deepEqual(actual,release);ready=true;break;}catch{await new Promise(resolve=>setTimeout(resolve,100));}
 }
 assert(ready,'The exact offline bundle preview is ready.');
 for(const [engine,kind] of Object.entries({chromium,webkit})){
  const browser=await kind.launch(engine==='chromium'?{chromiumSandbox:true}:{});
  try{
   for(const [width,height] of [[601,1184],[1366,1024]]){await liveCase(browser,engine,width,height);await liveRecordCase(browser,engine,width,height);}
   for(const bundle of ['web','offline'])for(const id of [firstText.id,expected[1].records[0].id,'early-ark-count']){
    const address=bundle==='web'?base:offline,context=await browser.newContext({viewport:{width:601,height:1184},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage();page.setDefaultTimeout(30000);
    try{
     if(id===firstText.id){
      await page.goto(address+'/#questions?mode=text');await regularReady(page);const tile=page.locator('#debate-results .phase2-debate-card').first();assert.equal(await tile.getAttribute('href'),'#debate/'+encodeURIComponent(id));
      await settle(page);await page.screenshot({path:`${output}/${engine}-${bundle}-first-text-tile.png`,fullPage:false});await tile.getByText('View record',{exact:true}).click();
     }else await page.goto(address+'/#debate/'+id);
     await page.locator('#debate-view .phase2-sides:not([aria-busy])').waitFor();await page.locator('[data-debate-save]').waitFor();
     assert(await page.evaluate(()=>typeof referenceLink==='function'&&typeof contradictionReviewHtml==='function'));
     if(id===firstText.id){await page.waitForFunction(()=>document.querySelector('.lens-context h1')?.textContent==='Questions');assert.equal(await page.locator('#debate-view .phase2-summary p').innerText(),firstText.summary);assert.match(await page.locator('#debate-view .phase2-verdict').innerText(),/Interpretation Remains Open/);assert(await page.locator('#debate-view .phase2-sides blockquote').count()>0);}
     if(id==='early-ark-count')assert(await page.locator('#debate-view .contradiction-review').isVisible(),'A cold comparison shows its verified review.');
     await settle(page);await fit(page);await page.screenshot({path:`${output}/${engine}-${bundle}-cold-${id}.png`,fullPage:false});
     const recordRoute=await page.evaluate(()=>location.hash);
     if(id===firstText.id){
      const cite=page.locator('#debate-view [data-cite]').first();await cite.click();await page.locator('#verse-preview:not([hidden]) .preview-selected').first().waitFor();await settle(page);await page.screenshot({path:`${output}/${engine}-${bundle}-first-text-citation.png`,fullPage:false});await page.locator('#verse-preview .preview-close').click();assert(await cite.evaluate(node=>document.activeElement===node));
      await page.locator('.lens-context [data-ux-back]').click();await regularReady(page);assert.equal(await page.locator('#debates-view h1').innerText(),'Text Comparisons');assert.equal(await page.evaluate(()=>location.hash),'#questions?mode=text');
      await page.locator('#debate-results .phase2-debate-card').first().getByText('View record',{exact:true}).click();await page.locator('[data-debate-save]').waitFor();await page.goBack();await regularReady(page);assert.equal(await page.evaluate(()=>location.hash),'#questions?mode=text');
     }
     coldDetails.push({engine,bundle,id,status:'PASS',route:recordRoute,viaFirstTextTile:id===firstText.id,classificationPreserved:id===firstText.id?'Questions / Interpretation Remains Open':undefined});save();console.log('PASS cold Evidence detail',engine,bundle,id);
    }catch(error){console.error('FAIL cold Evidence detail',JSON.stringify({engine,bundle,id,error:error.message,state:await page.evaluate(()=>({route:location.hash,text:document.getElementById('debate-view')?.innerText.slice(0,1200)})).catch(()=>({}))}));await page.screenshot({path:`${output}/${engine}-${bundle}-cold-${id}-failure.png`,fullPage:false}).catch(()=>{});throw error;}
    finally{await context.close();}
   }
   for(const bundle of ['web','offline'])for(const [width,height] of [[320,844],[601,1184],[820,1180],[1366,1024]]){
    const address=bundle==='web'?base:offline,theme=[320,820].includes(width)?'dark':'light',name=`${engine}-${bundle}-${width}x${height}-${theme}`;
    const context=await browser.newContext({viewport:{width,height},hasTouch:width<=1024,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[],apiRequests=[];
    page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message));page.on('request',request=>{if(new URL(request.url()).pathname.startsWith('/api/'))apiRequests.push(new URL(request.url()).pathname);});
    try{
     await page.goto(address+'/#questions');await acceptedReady(page);
     await page.evaluate(({theme,native})=>{state.theme=theme;applyTheme();document.documentElement.classList.toggle('native-ios',native);document.body.style.setProperty('--app-safe-top',native?'24px':'0px');},{theme,native:bundle==='offline'});
     const parity=await page.evaluate(async queries=>Promise.all(queries.map(async query=>{const r=await fetch('/api/debates?'+query);if(!r.ok)throw Error('Evidence API unavailable');return r.json();})),queries);
     assert.deepEqual(parity,expected,'The actual offline worker and web API return identical record pages and counts.');
     assert.match(await page.locator('#debates-view .directory-results').innerText(),new RegExp('of '+total+' questions'));
     await page.locator('[data-accepted-filters]').click();let sheet=page.locator('#accepted-question-filters');await sheet.waitFor({state:'visible'});
     await sheet.getByRole('button',{name:new RegExp('^Conflicts with Evidence \\('+conflicts+'\\)$','i')}).click();await acceptedReady(page);
     await page.waitForFunction(()=>new URLSearchParams(location.hash.split('?')[1]).get('finding')==='Conflicts with evidence');
     assert.match(await page.locator('[data-accepted-active-filters]').innerText(),/Finding: Conflicts with Evidence/i);
     await page.getByRole('button',{name:`Bible vs. Bible (${textTotal})`,exact:true}).click();await acceptedReady(page);
     await page.waitForFunction(()=>new URLSearchParams(location.hash.split('?')[1]).get('subject')==='text-vs-text'&&!new URLSearchParams(location.hash.split('?')[1]).has('finding'));
     assert.equal(await page.locator('#debates-view h1').innerText(),'Bible vs. Bible');assert.match(await page.locator('#debates-view .directory-results').innerText(),new RegExp('of '+textTotal+' questions'));
     assert(await page.locator('.accepted-questions .phase2-debate-card').count()>0);
     await page.locator('[data-accepted-filters]').click();await sheet.waitFor({state:'visible'});assert(await sheet.getByRole('button',{name:/^Conflicts with Evidence \(0\)$/i}).isDisabled());await settle(page);await page.screenshot({path:`${output}/${name}-filter-sheet.png`,fullPage:false});await page.keyboard.press('Escape');
     await introLayout(page,name,'subject');await fit(page);await page.screenshot({path:`${output}/${name}-subject.png`,fullPage:false});
     if(width===320){const subjectHash=await page.evaluate(()=>location.hash),link=page.locator('.accepted-collection-intro a');await link.focus();await page.keyboard.press('Enter');await regularReady(page);await page.locator('#debate-results .phase2-debate-card').first().waitFor();assert.equal(await page.locator('#debates-view h1').innerText(),'Text Comparisons');await page.goBack();await acceptedReady(page);assert.equal(await page.evaluate(()=>location.hash),subjectHash);}
     await type(page,'#accepted-search','Goliath');await page.waitForFunction(()=>new URLSearchParams(location.hash.split('?')[1]).get('q')==='Goliath');await acceptedReady(page);
     assert.equal(await page.locator('.accepted-questions .phase2-debate-card').count(),1);const listHash=await page.evaluate(()=>location.hash);
     await page.locator('.accepted-questions .phase2-debate-card').first().click();await page.locator('[data-accepted-save]').waitFor();assert.equal(await page.locator('#debate-view .phase2-sides section').count(),2);
     await page.waitForFunction(()=>document.querySelector('.lens-context h1')?.textContent==='Contradictions');
     await page.locator('#debate-view').getByText('Passages and Research Limits',{exact:true}).click();
     const recordHash=await page.evaluate(()=>location.hash),citation=page.locator('#debate-view [data-cite]').first(),citationLabel=await citation.getAttribute('data-cite-label');
     await citation.click();await page.locator('#verse-preview:not([hidden]) .preview-selected').first().waitFor();await page.waitForFunction(()=>!document.querySelector('#verse-preview .preview-text').classList.contains('loading-state'));assert.equal(await page.locator('#verse-preview strong').innerText(),citationLabel);assert.equal(await page.evaluate(()=>location.hash),recordHash);
     await settle(page);await page.screenshot({path:`${output}/${name}-citation-context.png`,fullPage:false});await page.locator('#verse-preview .preview-close').click();await page.locator('#verse-preview').waitFor({state:'hidden'});assert(await citation.evaluate(node=>node===document.activeElement));
     assert.equal(await page.locator('#debate-view>a.lens-button').getAttribute('href'),listHash);
     await page.locator('.lens-context [data-ux-back]').click();await acceptedReady(page);assert.equal(await page.evaluate(()=>location.hash),listHash);assert.equal(await page.locator('#accepted-search').inputValue(),'Goliath');
     await page.locator('.accepted-questions .phase2-debate-card').first().click();await page.locator('[data-accepted-save]').waitFor();await page.goBack();await acceptedReady(page);assert.equal(await page.evaluate(()=>location.hash),listHash);
     await page.getByRole('button',{name:`Bible vs. History (${historyTotal})`,exact:true}).click();await acceptedReady(page);await page.locator('.accepted-questions .lens-empty [data-accepted-reset]').waitFor();
     assert.equal(await page.locator('#debates-view h1').innerText(),'Bible vs. History');assert.match(await page.locator('[data-accepted-active-filters]').innerText(),/Goliath/);
     assert.equal(await page.getByRole('button',{name:'Clear filters',exact:true}).count(),1);
     await page.getByRole('button',{name:'Clear filters',exact:true}).click();await acceptedReady(page);await page.waitForFunction(()=>!new URLSearchParams(location.hash.split('?')[1]).has('q'));
     assert.equal(await page.locator('#debates-view h1').innerText(),'Bible vs. History');assert.match(await page.locator('#debates-view .directory-results').innerText(),new RegExp('of '+historyTotal+' questions'));
     await type(page,'#accepted-search','zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');await page.locator('.accepted-questions .lens-empty [data-accepted-reset]').waitFor();await fit(page);await introLayout(page,name,'filtered-empty');await page.screenshot({path:`${output}/${name}-filtered-empty.png`,fullPage:false});
     await page.getByRole('button',{name:'Clear filters',exact:true}).click();await acceptedReady(page);
     await go(page,'#questions?mode=science&q=zzzz-no-evidence-match');await regularReady(page);await page.locator('#debate-results .lens-empty [data-debate-clear]').waitFor();assert.match(await page.locator('[data-evidence-active-filters]').innerText(),/zzzz-no-evidence-match/);
     await page.getByRole('button',{name:'Clear filters',exact:true}).click();await regularReady(page);await page.locator('#debate-results .phase2-debate-card').first().waitFor();assert.equal(await page.locator('[data-debate-mode=science]').getAttribute('aria-pressed'),'true');
     await go(page,'#questions?mode=science&id='+encodeURIComponent(expected[1].records[0].id));await regularReady(page);await page.locator('#debate-results .phase2-debate-card').first().waitFor();
     await page.locator('[data-debate-mode=text]').click();await regularReady(page);await page.waitForFunction(()=>new URLSearchParams(location.hash.split('?')[1]).get('mode')==='text'&&!new URLSearchParams(location.hash.split('?')[1]).has('id'));await page.locator('#debate-results .phase2-debate-card').first().waitFor();
     assert.match(await page.locator('[data-debate-mode=text]').innerText(),/^Text Comparisons \(/);assert.equal(await page.locator('#debates-view h1').innerText(),'Text Comparisons');
     await page.getByRole('button',{name:'Filter records',exact:true}).click();await page.locator('#debate-sheet[open]').getByRole('link',{name:'Translations',exact:true}).click();await regularReady(page);await page.waitForFunction(()=>new URLSearchParams(location.hash.split('?')[1]).get('filter')==='T');await page.locator('#debate-results .phase2-debate-card').first().waitFor();assert.equal(await page.locator('#debates-view h1').innerText(),'Translations');
     await page.getByRole('button',{name:'Filter records',exact:true}).click();await page.locator('#debate-sheet[open] nav[aria-label="Evidence collections"]').getByRole('link',{name:'Contradictions',exact:true}).click();await acceptedReady(page);assert.equal(await page.evaluate(()=>location.hash),'#questions');assert.equal(await page.locator('#accepted-search').inputValue(),'');assert.match(await page.locator('#debates-view .directory-results').innerText(),new RegExp('of '+total+' questions'));
     await go(page,'#debate/missing-evidence-navigation-record');await page.locator('#debate-view .lens-button').waitFor();assert.match(await page.locator('#debate-view').innerText(),/We Couldn’t Find That/);await page.locator('#debate-view .lens-button').click();await page.locator('#ux-topic-evidence').waitFor();
     await page.locator('#ux-topic-evidence').click();await regularReady(page);await page.locator('#debate-results .phase2-debate-card').first().waitFor();assert.equal(await page.locator('#debates-view h1').innerText(),'Text Comparisons');
     if(bundle==='web'){
      let failure=true;
      await page.route('**/api/debates?*',route=>{const q=new URL(route.request().url()).searchParams.get('q');if(q==='transport-fixture'&&failure)return route.fulfill({status:503,contentType:'application/json',body:'{"error":"test transport failure"}'});if(q==='empty-collection-fixture')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({records:[],total:0,page:0,counts:{},collectionTotal:0,modeCounts:{text:0,science:0,history:0},translationTotal:0})});return route.continue();});
      await go(page,'#questions?mode=science&q=transport-fixture');await page.locator('#debate-results .lens-empty [data-debate-retry]').waitFor();assert.match(await page.locator('#debate-results').innerText(),/Records Could Not Load/);failure=false;await page.locator('[data-debate-retry]').click();await page.locator('#debate-results [data-debate-clear]').waitFor();
      await page.getByRole('button',{name:'Clear filters',exact:true}).click();await page.locator('#debate-results .phase2-debate-card').first().waitFor();
      await go(page,'#questions?mode=science&q=empty-collection-fixture');await regularReady(page);await page.locator('#debate-results .lens-empty h2').filter({hasText:'No Records in This Collection Yet'}).waitFor();await settle(page);await page.screenshot({path:`${output}/${name}-empty-collection-fixture.png`,fullPage:false});
      await page.locator('#debate-results .lens-empty a').click();await page.locator('#debate-results .phase2-debate-card').first().waitFor();
      await page.unroute('**/api/debates?*');
     }
     await fit(page);await settle(page);await page.screenshot({path:`${output}/${name}-records.png`,fullPage:false});assert((await page.title()).endsWith(' · zLenz: Bible'));assert.deepEqual(errors,[]);
     if(bundle==='offline')assert.deepEqual(apiRequests,[],'The actual offline engine handles all Evidence API calls without server requests.');
     matrix.push({engine,bundle,width,height,theme,status:'PASS',release,featured:total,bibleVsBible:textTotal,history:historyTotal,webOfflinePagesIdentical:true,apiRequests:bundle==='offline'?apiRequests.length:undefined,emptyCollectionFixture:bundle==='web'});save();console.log('PASS Evidence navigation',name);
    }catch(error){const diagnostic=await page.evaluate(()=>({route:location.hash,view:typeof view==='undefined'?null:view,readerHelper:typeof referenceLink,headings:[...document.querySelectorAll('#main h1')].filter(n=>n.getClientRects().length).map(n=>n.textContent),detailText:document.getElementById('debate-view')?.innerText.slice(0,1800),focus:document.activeElement?.id})).catch(()=>({unavailable:true}));const failure={error:error.message,engine,bundle,width,height,errors,...diagnostic};console.error('FAIL Evidence navigation',JSON.stringify(failure));fs.writeFileSync(`${output}/failure-${name}.json`,JSON.stringify(failure,null,2)+'\n');await page.screenshot({path:`${output}/failure-${name}.png`,fullPage:false}).catch(()=>{});throw error;}
    finally{await context.close();}
   }
  }finally{await browser.close();}
 }
 assert.equal(matrix.length,16);assert.equal(baseline.length,4);assert.equal(recordBaseline.length,4);assert.equal(coldDetails.length,12);assert.equal(introLayouts.length,32);
 console.log('PASS: 16 web/offline Chromium/WebKit navigation cases and12 cold detail cases, including the exact first Genesis1:3 tile, its Questions classification, real content/citations and Back. Eight live baseline observations/screenshots retained.');
}finally{mobile.kill('SIGTERM');mobileLog.end();save();}
