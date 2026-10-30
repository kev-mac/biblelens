import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8787';
const root=process.env.UX_SHOT_DIR||process.env.HOME+'/git/codex-reports/R281-logs';fs.mkdirSync(root,{recursive:true});
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();try{for(const width of [320,390,1280])for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
  const go=async(hash,selector)=>{await page.goto(base+'/?ux14c='+encodeURIComponent(hash)+hash);await page.locator(selector+':visible').first().waitFor();await page.evaluate(t=>{state.theme=t;applyTheme();},theme);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);};
  await go('#discover','#ux-topic-lost');const tilePath=await page.locator('#ux-topic-lost svg path').getAttribute('d');
  const tileAccent=await page.locator('#ux-topic-lost').evaluate(n=>getComputedStyle(n).getPropertyValue('--topic').trim());
  const otherAccents=await page.locator('.ux-topic:not(#ux-topic-lost)').evaluateAll(ns=>ns.map(n=>getComputedStyle(n).getPropertyValue('--topic').trim()));assert(!otherAccents.includes(tileAccent),'Lost Books has a distinct tile accent');
  await go('#lost','.lost-card');assert.equal(await page.locator('#lost-view .header-icon-svg path').getAttribute('d'),tilePath);
  const contrast=await page.locator('#lost-chips .active,.lost-card .passage-badge,.lost-card .action-link,.lost-card .lost-text-link').evaluateAll(ns=>{
   const rgba=s=>(s.match(/[\d.]+/g)||[]).map(Number),blend=(f,b)=>f.slice(0,3).map((v,i)=>v*(f[3]??1)+b[i]*(1-(f[3]??1))),lum=c=>c.map(v=>(v/=255)<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
   return ns.map(n=>{let bg=[255,255,255],chain=[];for(let a=n;a;a=a.parentElement)chain.unshift(a);for(const a of chain)bg=blend(rgba(getComputedStyle(a).backgroundColor),bg);const fg=blend(rgba(getComputedStyle(n).color),bg),a=lum(fg),b=lum(bg);return {text:n.textContent,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),color:getComputedStyle(n).color};});
  });assert(contrast.every(n=>n.ratio>=4.5),JSON.stringify(contrast.filter(n=>n.ratio<4.5)));assert.equal(new Set(contrast.map(n=>n.color)).size,1,'chips, badges and actions share the accent');
  let heights=[];
  const check=async()=>{const rows=await page.locator('.directory-hub:not([hidden]) .story-card').evaluateAll(ns=>ns.map(n=>({title:n.querySelector('h2,h3')?.textContent,pills:[...n.querySelectorAll('.passage-badge,.directory-reference')].filter(p=>p.getClientRects().length).map(p=>({height:p.getBoundingClientRect().height,text:p.textContent}))})));assert(rows.length);for(const row of rows){assert(row.pills.length<=1,JSON.stringify(row));for(const p of row.pills){assert(!/\d\s*-\s*\d/.test(p.text),'en dash range: '+p.text);heights.push(p.height);}}};
  await check();
  for(const [hash,selector] of [['#stories','.story-card'],['#people','.ux-contact'],['#places','.place-profile-card'],['#commandments','.commandment-card'],['#questions','.phase2-debate-card'],...['history','science','text'].map(k=>['#questions?mode='+k,'.phase2-debate-card']),['#questions?filter=T','.phase2-debate-card']]){await go(hash,selector);await check();if(hash==='#stories'||hash==='#questions'){const next=page.getByRole('button',{name:'Next',exact:true});while(await next.count()&&await next.isVisible()&&await next.isEnabled()){await next.click();await page.waitForTimeout(80);await check();}}}
  assert(heights.every(h=>Math.abs(h-22)<.1),'all directory pill heights: '+[...new Set(heights)]);
  await go('#stories','.story-card');await page.locator('#stories-search').fill('Parallel Accounts in Genesis');await page.locator('.story-passages').waitFor();assert.equal(await page.locator('#stories-list .passage-badge').count(),1);assert.equal(await page.locator('#stories-list .passage-badge').innerText(),'Genesis 1:1 – 2:3 +1');await page.locator('.story-passages summary').click();assert.deepEqual(await page.locator('.story-passages button').allTextContents(),['Genesis 1:1 – 2:3','Genesis 2:4 – 25']);
  await page.locator('#stories-search').fill('Abrahamic Covenant');await page.locator('.story-passages').waitFor();assert.equal(await page.locator('#stories-list .passage-badge').count(),1);assert.match(await page.locator('#stories-list .passage-badge').innerText(),/ \+2$/);
  for(const [id,ref,text]of [['headline-01','1 Chronicles 20:5','Lahmi'],['headline-14','Deuteronomy 14:20','clean fowls']]){await go('#debate/'+id,'#debate-view .phase2-sides');await page.getByText('Passages and Research Limits',{exact:true}).click();assert(await page.getByRole('link',{name:ref,exact:true}).isVisible());assert.match(await page.locator('#debate-view').innerText(),new RegExp(text));}
  if(engine==='chromium'&&width===390){await go('#lost','.lost-card');await page.screenshot({path:root+'/ux14c-lost-'+theme+'.png'});await go('#stories','.story-card');await page.locator('#stories-search').fill('Parallel Accounts in Genesis');await page.locator('.story-passages').waitFor();await page.screenshot({path:root+'/ux14c-passages-'+theme+'.png'});}
  await page.close();console.log('PASS UX14c',engine,width,theme,'contrast, distinct accent, icon, single 22px pills, full passages');
 }}finally{await browser.close();}
}
