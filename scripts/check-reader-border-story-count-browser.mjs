import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {chromium,webkit} from 'playwright';
import worker from './built-worker.mjs';

// Run after the shared build, or with --mobile after build:mobile. The browser
// sees the real packaged app; image transport uses the same local source art.
const mobile=process.argv.includes('--mobile');
const output=path.resolve('.release/reader-border-story-count'+(mobile?'-mobile':''));
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
try {
 for (const [engine,type] of Object.entries({chromium,webkit})) {
  const browser=await type.launch();
  try {for (const [width,height] of [[390,844],[844,390],[820,1180],[1280,900]]) {
   const context=await browser.newContext({viewport:{width,height},hasTouch:width<1000,reducedMotion:'reduce',serviceWorkers:'block'});
   await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
   const page=await context.newPage();
   for(const dark of [false,true]) {
    await page.goto(base+'/#discover');
    await page.locator('#ux-topic-stories .ux-count').filter({hasText:'283'}).waitFor();
    await page.evaluate(dark=>{state.theme=dark?'dark':'light';applyTheme();persist();},dark);
    const counts=await page.locator('.ux-topic').evaluateAll(nodes=>nodes.map(node=>{const badge=node.querySelector('.ux-count'),a=node.getBoundingClientRect(),b=badge.getBoundingClientRect(),style=getComputedStyle(badge);return {topic:node.dataset.topic,right:a.right-b.right,top:b.top-a.top,left:style.left,rightStyle:style.right};}));
    for(const count of counts) {assert(Math.abs(count.right-counts[0].right)<1,'Every count uses the same right inset: '+JSON.stringify(counts));assert(Math.abs(count.top-counts[0].top)<1);assert.equal(count.rightStyle,'10px');}
    await page.evaluate(()=>BibleLensWorkspace.navigate('#read/0/1'));
    const picker=page.locator('#ux-chapter-picker');await picker.filter({hasText:'Genesis 1'}).waitFor();
    for(const keyboard of [false,true]) {
     await page.evaluate(keyboard=>document.body.classList.toggle('keyboard-navigation',keyboard),keyboard);
     await picker.focus();
     const styles=await picker.evaluate(node=>{const s=getComputedStyle(node);return {outline:s.outlineStyle,border:s.borderTopWidth,shadow:s.boxShadow,decoration:s.textDecorationLine,width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height};});
     assert.equal(styles.outline,'none');assert.equal(styles.border,'0px');assert.equal(styles.shadow,'none');assert(styles.width>=44&&styles.height>=44);if(keyboard)assert.equal(styles.decoration,'underline','Keep a non-box visible keyboard focus cue');
    }
    await picker.click();await page.locator('#passage-picker[open]').waitFor();await page.keyboard.press('Escape');await page.locator('#passage-picker').waitFor({state:'hidden'});
    assert.equal(await picker.evaluate(n=>getComputedStyle(n).outlineStyle),'none','No returning focus box after dismissal');
    await page.screenshot({path:output+'/'+engine+'-'+width+'-'+(dark?'dark':'light')+'-reader.png'});
    await page.evaluate(()=>BibleLensWorkspace.navigate('#discover'));await page.locator('#ux-topic-stories').waitFor();await page.screenshot({path:output+'/'+engine+'-'+width+'-'+(dark?'dark':'light')+'-explore.png'});
    results.push({engine,width,height,dark,counts});
   }
   await context.close();
  }}finally{await browser.close();}
 }
 fs.writeFileSync(output+'/results.json',JSON.stringify(results,null,2));
 console.log('PASS: '+results.length+' reader and collection badge cases across Chromium/WebKit, phone portrait/landscape, tablet, desktop, light/dark.');
}finally{server.close();}
