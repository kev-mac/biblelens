import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const root=process.env.HOME+'/git/codex-reports',shots=root+'/ux14-shots',base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8787';
fs.mkdirSync(shots,{recursive:true});
const browser=await chromium.launch(),measurements=[];
try{for(const width of [320,390,1280])for(const theme of ['light','dark']){
 const p=await browser.newPage({viewport:{width,height:844},serviceWorkers:'block',reducedMotion:'reduce'});
 let reference;
 for(const [key,hash,selector] of [['events','#stories','#stories-list .story-card'],['lost','#lost','.lost-card']]){
  await p.goto(base+'/'+hash);await p.locator(selector).first().waitFor();await p.locator('.directory-hub:not([hidden]) .directory-search').waitFor();await p.evaluate(t=>{state.theme=t;applyTheme();scrollTo(0,0);},theme);await p.evaluate(()=>document.fonts.ready);await p.locator('.fetch-retry-status').waitFor({state:'hidden'});
  const metrics=await p.evaluate(()=>{
   const host=document.querySelector('.directory-hub:not([hidden])');
   const pairs=[['.stories-header',['height','padding','borderBottomWidth','backgroundColor']],['.back-action',['fontSize','fontWeight','backgroundColor','borderRadius']],['.header-center-title',['position','left','gap']],['.directory-heading',['fontSize','fontWeight','lineHeight']],['.directory-filter-open',['width','height','borderRadius']],['.stories-content',['padding','gap']],['.directory-search',['height','fontSize','padding','borderRadius']],['.filter-pill',['fontSize','padding','minHeight','borderRadius']],['.story-card',['padding','gap','borderRadius','backgroundColor','display','flexDirection']],['.story-title',['fontSize','fontWeight','lineHeight']],['.story-summary',['fontSize','lineHeight']],['.story-footer',['paddingTop','borderTopWidth','fontSize']],['.action-link',['fontSize','fontWeight','minHeight']]];
   return Object.fromEntries(pairs.map(([selector,props])=>{const style=getComputedStyle(host.querySelector(selector));return [selector,Object.fromEntries(props.map(k=>[k,style[k]]))];}));
  });
  if(reference)assert.deepEqual(metrics,reference,`${width} ${theme}: shared component styles`);else reference=metrics;
  const center=await p.locator('.directory-hub:not([hidden]) .header-center-title').boundingBox(),header=await p.locator('.directory-hub:not([hidden]) .stories-header').boundingBox();assert(Math.abs(center.x+center.width/2-header.x-header.width/2)<1,'centered heading');
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),width);
  measurements.push({width,theme,key,metrics});await p.screenshot({path:`${shots}/ux14b-${key}-${theme}-${width}.png`});
 }
 await p.goto(base+'/#discover');await p.waitForFunction(()=>document.querySelector('#ux-topic-lost .ux-count')?.textContent==='20');await p.evaluate(t=>{state.theme=t;applyTheme();scrollTo(0,0);},theme);await p.evaluate(()=>document.fonts.ready);
 await p.locator('.fetch-retry-status').waitFor({state:'hidden'});await p.screenshot({path:`${shots}/ux14b-explore-rest-${theme}-${width}.png`,fullPage:true});
 await p.locator('#ux-topic-lost').scrollIntoViewIfNeeded();
 const tile=await p.locator('#ux-topic-lost').evaluate(n=>{const rect=n.getBoundingClientRect(),title=n.querySelector('strong').getBoundingClientRect(),subtitle=n.querySelector('small').getBoundingClientRect(),bar=document.querySelector('#lens-mobile-bar')?.getBoundingClientRect();return {title:n.querySelector('strong').textContent,subtitle:n.querySelector('small').textContent,accent:getComputedStyle(n).getPropertyValue('--topic').trim(),visible:title.top>=rect.top&&subtitle.bottom<=rect.bottom&&subtitle.bottom<=(bar?.top||innerHeight)};});
 assert.equal(tile.title,'Lost Books');assert.equal(tile.subtitle,'Books beyond the 66');assert(tile.visible,JSON.stringify(tile));assert.equal(tile.accent,theme==='dark'?'#fbbf24':'#b45309');
 await p.screenshot({path:`${shots}/ux14b-explore-tile-${theme}-${width}.png`});
 await p.close();console.log('PASS shared Events/Lost Books components and Explore tile',width,theme);
}}finally{await browser.close();}
fs.writeFileSync(root+'/UX14-logs/ux14b-component-metrics.json',JSON.stringify(measurements,null,2)+'\n');
const dest='www/gemini/ux11/ux14-shots';fs.mkdirSync(dest,{recursive:true});
for(const name of fs.readdirSync(shots).filter(n=>n.startsWith('ux14b-')))fs.copyFileSync(shots+'/'+name,dest+'/'+name);
let html=fs.readFileSync(root+'/UX11-side-by-side.html','utf8').replace(/<section id="ux14b-[\s\S]*?<\/section>/g,'');
const added=['dark','light'].map(theme=>`<section id="ux14b-${theme}"><h2>UX14b Events and Lost Books · ${theme} · 390</h2><div class="pair"><figure><figcaption>Events · shared directory reference</figcaption><img src="ux14-shots/ux14b-events-${theme}-390.png" alt="Events ${theme}"></figure><figure><figcaption>Lost Books · shared directory components</figcaption><img src="ux14-shots/ux14b-lost-${theme}-390.png" alt="Lost Books ${theme}"></figure></div><p>Matching header, search, chips, cards and footer; book-specific summaries, chapter counts, edition and accent.</p></section>`).join('\n');
html=html.includes('</body>')?html.replace('</body>',added+'\n</body>'):html.replace('</html>',added+'\n</html>');
fs.writeFileSync(root+'/UX11-side-by-side.html',html);fs.writeFileSync('www/gemini/ux11/index.html',html);
