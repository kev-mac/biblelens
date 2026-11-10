import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium,webkit} from 'playwright';
import worker from './built-worker.mjs';

// Run after the shared build, or with --mobile after build:mobile. The browser
// sees the real packaged app; image transport uses the same local source art.
const mobile=process.argv.includes('--mobile');
const output=path.resolve('.release/collection-layout'+(mobile?'-mobile':''));
fs.mkdirSync(output,{recursive:true});
const mobileRoot=path.resolve('www');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(mobile){
   const file=path.resolve(mobileRoot,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
   if(!file.startsWith(mobileRoot+path.sep)){res.writeHead(403);res.end();return;}
   if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}
   res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));return;
  }
  if(url.pathname.startsWith('/assets/')&&/\.(webp|png|jpg)$/.test(url.pathname)){
   const file=path.join('src/assets',path.basename(url.pathname));
   if(fs.existsSync(file)){res.writeHead(200,{'content-type':types[path.extname(file)]});res.end(fs.readFileSync(file));return;}
  }
  const response=await worker.fetch(new Request(url,{headers:req.headers}),{DB:{prepare(){throw Error('Unexpected SQL');}}},{});
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){if(!res.headersSent)res.writeHead(500);res.end(error.message);}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const results=[];
const settle=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
const fit=async page=>assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'No document-level horizontal overflow');
async function go(page,hash,selector){
 await page.evaluate(hash=>BibleLensWorkspace.navigate(hash),hash);
 await page.locator(selector).first().waitFor();
 await page.waitForFunction(()=>!document.getElementById('main').hasAttribute('aria-busy'));
 await page.evaluate(()=>document.fonts.ready);await settle(page);
}
async function stripMetrics(strip){
 return strip.evaluate(node=>{
  const css=getComputedStyle(node),max=node.scrollWidth-node.clientWidth;
  return {width:node.clientWidth,max,left:node.scrollLeft,wrap:css.flexWrap,mask:css.maskImage||css.webkitMaskImage,
   start:node.classList.contains('ux-overflow-left'),end:node.classList.contains('ux-overflow-right'),
   before:getComputedStyle(node,'::before').content,after:getComputedStyle(node,'::after').content,
   rows:[...new Set([...node.children].map(child=>Math.round(child.getBoundingClientRect().top)))].length};
 });
}
async function checkStrip(strip,width){
 const m=await stripMetrics(strip);
 assert.equal(m.start,m.max>2&&m.left>2,'Start fade follows actual scroll position');
 assert.equal(m.end,m.max>2&&m.max-m.left>2,'End fade follows actual scroll position');
 assert.equal(m.mask!=='none',width<768&&(m.start||m.end),'Fade only for hidden controls');
 for(const pseudo of [m.before,m.after])assert(['none','normal','""'].includes(pseudo),'No chevron or generated scroll control');
 assert.equal(m.wrap,width<768?'nowrap':'wrap');
 if(width>=768)assert(m.max<=2,'Wide filter rows wrap instead of scrolling');
 return m;
}
const routes=[
 ['#stories','#stories-view','#stories-list .story-card'],
 ['#people','#characters-view','#characters-list .ux-contact'],
 ['#places','#places-view','.place-profile-card'],
 ['#commandments','#commandments-view','.commandment-card'],
 ['#questions','#debates-view','.accepted-questions .phase2-debate-card'],
 ['#questions?mode=history','#debates-view','#debate-results .phase2-debate-card'],
 ['#questions?mode=science','#debates-view','#debate-results .phase2-debate-card'],
 ['#questions?mode=text','#debates-view','#debate-results .phase2-debate-card'],
 ['#questions?filter=T','#debates-view','#debate-results .phase2-debate-card'],
 ['#lost','#lost-view','.lost-card'],
 ['#timeline','#timeline-view','.timeline-event-card'],
 ['#prophecies','#prophecies-view','.prophecy-card'],
];
try{
 for(const [engine,type] of Object.entries({chromium,webkit})){
  const browser=await type.launch();
  try{for(const width of [320,390,767,768,1280]){
   const name=`${engine}-${width}`,context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',serviceWorkers:'block'});
   await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
   if(mobile)await context.addInitScript(()=>Object.defineProperty(navigator,'onLine',{get:()=>false}));
   const page=await context.newPage(),errors=[],apiRequests=[];
   page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message));
   page.on('request',req=>{if(new URL(req.url()).pathname.startsWith('/api/'))apiRequests.push(req.url());});
   try{
    await page.goto(base+'/#stories');await page.locator('#stories-list .story-card').first().waitFor();
    const headers=[];
    for(const [hash,host,ready] of routes){
     await go(page,hash,ready);
     const header=page.locator(`${host}.directory-hub .stories-header.collection-header, .lens-context.collection-header:not([hidden])`).first();
     await header.waitFor();
     const metrics=await header.evaluate(node=>{
      const title=node.querySelector('h1'),back=node.querySelector('.back-action,[data-ux-back]'),box=n=>n.getBoundingClientRect().toJSON();
      return {title:title.textContent,header:box(node),heading:box(title),back:box(back),backText:back.textContent,
       headingFont:getComputedStyle(title).font,backFont:getComputedStyle(back).font,
       actions:[...node.querySelectorAll('.directory-filter-open,.directory-settings-open')].map(box),clipped:title.scrollWidth>title.clientWidth+1};
     });
     assert.equal(metrics.backText,'‹ Back');assert(metrics.back.height>=44&&metrics.back.width>=44);
     assert(!metrics.clipped,'Full collection title stays readable: '+hash);
     assert(metrics.heading.x>=metrics.back.x+metrics.back.width-1,'Back never covers the title: '+hash);
     for(const action of metrics.actions){assert(action.height>=44&&action.width>=44);assert(metrics.heading.x+metrics.heading.width<=action.x+1,'Actions never cover the title: '+hash);}
     assert(metrics.header.height>=60&&metrics.header.height<130,'Compact, content-sized collection header: '+hash);
     for(const strip of await page.locator(`${host} .ux-filter-strip:visible`).all())await checkStrip(strip,width);
     await fit(page);headers.push({hash,...metrics});
    }
    assert.equal(new Set(headers.map(h=>h.headingFont)).size,1,'Collection heading typography is consistent');
    assert.equal(new Set(headers.map(h=>h.backFont)).size,1,'Back controls use consistent typography');
    // Overflow changes, keyboard focus, and unrelated DOM updates must not
    // strand controls off screen or snap the user's scroll back to selection.
    await go(page,'#stories','#stories-list .story-card');
    const row=page.locator('#stories-chips');await row.locator('button').last().waitFor();
    await row.evaluate(node=>{node.scrollLeft=0;});await settle(page);
    const start=await checkStrip(row,width);
    if(width<768){
     assert(start.end&&!start.start);assert(start.max>50);
     await row.evaluate(node=>{node.scrollLeft=(node.scrollWidth-node.clientWidth)/2;});await settle(page);
     const middle=await checkStrip(row,width);assert(middle.start&&middle.end);
     await row.locator('button').last().focus();await settle(page);
     const end=await checkStrip(row,width);assert(end.start&&!end.end);
     await page.evaluate(()=>{const note=document.createElement('span');note.textContent='';document.getElementById('stories-results').append(note);note.remove();});await settle(page);
     assert(Math.abs((await stripMetrics(row)).left-end.left)<2,'Unrelated updates preserve filter scroll');
     const last=row.locator('button').last();assert(await last.evaluate(n=>{const a=n.getBoundingClientRect(),b=n.parentElement.getBoundingClientRect();return a.left>=b.left-1&&a.right<=b.right+1;}),'Keyboard-focused final filter is fully visible');
     await page.keyboard.press('Shift+Tab');assert(await row.evaluate(n=>n.contains(document.activeElement)),'Tab stays in normal filter order');
     assert(await page.evaluate(()=>{const css=getComputedStyle(document.activeElement);return css.outlineStyle==='solid'&&parseFloat(css.outlineWidth)>=2&&parseFloat(css.outlineOffset)<=0;}),'Visible inset focus outline is not clipped by the scroll viewport');
     await row.locator('button').first().focus();await settle(page);assert(!(await stripMetrics(row)).start);
    }else assert(start.rows>1,'Long desktop filter set actually wraps');
    await page.screenshot({path:path.join(output,name+'-stories.png'),fullPage:false});
    await row.locator('button').last().click();await settle(page);
    const selection=await row.locator('[aria-pressed=true]').getAttribute('data-stories-section');
    await go(page,'#lost','.lost-card');
    await row.evaluate(node=>{node.scrollLeft=0;});
    await go(page,'#stories','#stories-list .story-card');
    assert.equal(await row.locator('[aria-pressed=true]').getAttribute('data-stories-section'),selection,'Collection selection survives leaving and returning');
    if(width<768)assert(await row.locator('[aria-pressed=true]').evaluate(n=>{const a=n.getBoundingClientRect(),b=n.parentElement.getBoundingClientRect();return a.left>=b.left-1&&a.right<=b.right+1;}),'Returning selected filter is visible after its row was hidden');
    await page.setViewportSize({width:width<768?1280:320,height:1000});await settle(page);
    await checkStrip(row,width<768?1280:320);
    if(width>=768)assert(await row.locator('[aria-pressed=true]').evaluate(n=>{const a=n.getBoundingClientRect(),b=n.parentElement.getBoundingClientRect();return a.left>=b.left-1&&a.right<=b.right+1;}),'Selected filter stays visible when wrapping becomes scrolling');
    await page.setViewportSize({width,height:1000});await settle(page);
    await row.locator('button').first().click();await settle(page);
    // The real row can become short after an async render. Neither edge should
    // retain a fade, including when it was previously scrolled to the end.
    await row.evaluate(node=>{node.scrollLeft=node.scrollWidth;node.replaceChildren(node.firstElementChild);});await settle(page);
    const short=await checkStrip(row,width);assert.equal(short.max,0);assert.equal(short.mask,'none');
    // Resize the same live row across the breakpoint, not only cold viewports.
    await go(page,'#lost','.lost-card');
    await page.setViewportSize({width:width<768?1280:320,height:1000});await settle(page);
    await checkStrip(page.locator('#lost-chips'),width<768?1280:320);
    await page.setViewportSize({width,height:1000});await settle(page);
    // Both a story opener and an untitled chapter opener keep their place.
    const readers=[];
    for(const chapter of [4,7]){
     await go(page,`#read/0/${chapter}`,'#verse-1');
     const title=page.locator('#chapter-text h2.chapter-subtitle'),eyebrow=page.locator('#chapter-text .ux-reader-eyebrow');
     await eyebrow.waitFor();assert.equal(await eyebrow.innerText(),`Genesis ${chapter}`);
     assert((await title.innerText()).trim().length>0);assert(await title.isVisible());
     const image=page.locator('#chapter-text > .chapter-heading-row + .story-illustration > img');await image.waitFor();
     await image.evaluate(n=>n.complete?undefined:new Promise(resolve=>{n.addEventListener('load',resolve,{once:true});n.addEventListener('error',resolve,{once:true});}));
     assert(await image.evaluate(n=>n.naturalWidth>0),'Real local artwork loaded');
     const size=await image.boundingBox(),textWidth=await page.locator('#chapter-text').evaluate(n=>n.getBoundingClientRect().width);
     if(width>=768){assert(Math.abs(size.height-240)<1,'Desktop opening banner is 240px high');assert(textWidth<=701&&textWidth>=670,'Desktop reading width stays near 700px');}
     else assert(Math.abs(size.height-size.width*9/16)<1,'Phones retain the complete 16:9 image');
     const caption=page.locator('#chapter-text .story-illustration-reader figcaption').first();
     if(chapter===4){
      assert.equal(await caption.innerText(),'Cain and Abel');assert(await caption.isVisible());
      const styles=await title.evaluate((n)=>{const c=document.querySelector('#chapter-text .story-illustration-reader figcaption'),a=getComputedStyle(n),b=getComputedStyle(c);return {titleSize:parseFloat(a.fontSize),captionSize:parseFloat(b.fontSize),titleWeight:a.fontWeight,captionStyle:b.fontStyle,titleFamily:a.fontFamily,captionFamily:b.fontFamily};});
      assert(styles.titleSize>styles.captionSize*1.25);assert(Number(styles.titleWeight)>=600);assert.equal(styles.captionStyle,'italic');assert.equal(styles.titleFamily,styles.captionFamily);
     }
     assert.equal(await page.locator('#chapter-text .chapter-illustration-reader figcaption').count(),0,'Generic chapter art has no invented caption');
     await fit(page);await page.screenshot({path:path.join(output,`${name}-genesis-${chapter}.png`),fullPage:false});
     readers.push({chapter,textWidth,image:size});
    }
    // Back retains the existing directory destination and browser history.
    await go(page,'#stories','#stories-list .story-card');
    await page.locator('#stories-view .back-action').focus();await page.keyboard.press('Enter');
    await page.locator('#explore-view:not([hidden]) .ux-topic').first().waitFor();assert.equal(await page.evaluate(()=>location.hash),'#discover');
    await page.goBack();await page.locator('#stories-view:not([hidden]) #stories-list .story-card').first().waitFor();
    assert.deepEqual(errors,[]);if(mobile)assert.deepEqual(apiRequests,[],'Offline engine handles APIs without server requests');
    results.push({engine,width,mobile,status:'PASS',headers,readers});console.log('PASS collection layout',name,mobile?'offline':'web');
   }catch(error){await page.screenshot({path:path.join(output,name+'-failure.png'),fullPage:false}).catch(()=>{});console.error('FAIL',name,{url:page.url(),errors,message:error.message});throw error;}
   finally{await context.close();fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2)+'\n');}
  }}finally{await browser.close();}
 }
 assert.equal(results.length,10);console.log('PASS: collection headers, dynamic fade-only filters, wide wrapping, keyboard navigation, desktop Reader sizing and retained chapter/story labels in Chromium and WebKit.');
}finally{await new Promise(resolve=>server.close(resolve));}
