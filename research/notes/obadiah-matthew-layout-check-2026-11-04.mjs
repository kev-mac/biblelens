import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import {chromium,webkit} from 'playwright';
import worker from '../../scripts/built-worker.mjs';
const counts=[1,4,7,3,3,3,2,14,4,28];
const root='/tmp/biblelens343-layout';fs.mkdirSync(root,{recursive:true});
const pinned=JSON.parse(fs.readFileSync('data/hosted-artwork.json'));
const sourceFetch=globalThis.fetch;
globalThis.fetch=async(url,opts)=>{
 const prefix='https://raw.githubusercontent.com/kev-mac/biblelens/'+pinned.sourceCommit+'/src';
 assert(String(url).startsWith(prefix),'Unexpected outgoing request: '+url);
 const src=String(url).slice(prefix.length);assert(pinned.assets.includes(src));
 return new Response(fs.readFileSync('src'+src),{headers:{'content-type':'image/webp'}});
};
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://127.0.0.1:'+server.address().port);const h=new Headers(req.headers);h.set('accept-encoding','identity');const response=await worker.fetch(new Request(url,{headers:h}),{},{});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(e){console.error(e);res.writeHead(500);res.end(String(e));}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port,rows=[];
try{for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();try{
 for(const [label,viewport] of [['phone',{width:393,height:852}],['ipad',{width:744,height:1133}]]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  // Full 69-chapter matrix in both engines and both viewports.
  const cases=[];for(let book=30;book<=39;book++)for(let chapter=1;chapter<=counts[book-30];chapter++)cases.push([book,chapter]);
  for(const [book,chapter]of cases){
   await page.goto(base+'/#read/'+book+'/'+chapter);await page.locator('#verse-1').waitFor();
   await page.waitForFunction(([b,c])=>typeof readingBook!=='undefined'&&readingBook===b&&readingChapter===c&&document.querySelector('#chapter-text')?.getAttribute('aria-busy')==='false',[book,chapter]);
   const figures=page.locator('#chapter-text .story-illustration');assert(await figures.count()>0);
   for(const img of await figures.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(img=>img.decode());}
   const check=await page.evaluate(()=>{const figures=[...document.querySelectorAll('#chapter-text .story-illustration')],v=document.querySelector('#verse-1'),first=figures[0];return{overflow:document.documentElement.scrollWidth>innerWidth,openerBeforeVerse:!!(first.compareDocumentPosition(v)&Node.DOCUMENT_POSITION_FOLLOWING),images:figures.map(f=>{const img=f.querySelector('img'),r=img.getBoundingClientRect();return{src:img.getAttribute('src'),decoded:img.complete&&img.naturalWidth>0,within:r.left>=-1&&r.right<=innerWidth+1,alt:!!img.alt,caption:f.classList.contains('chapter-illustration-reader')?f.querySelector('figcaption')===null:!!f.querySelector('figcaption')};})};});
   assert(!check.overflow,`${engine} ${label} ${book}:${chapter} overflow`);assert(check.openerBeforeVerse);assert(check.images.every(i=>i.decoded&&i.within&&i.alt&&i.caption),JSON.stringify(check));assert.deepEqual(errors,[]);
   if([['30:1','31:2','37:4','37:8','37:11','38:4','39:6','39:15','39:16','39:18','39:23','39:25','39:27']].flat().includes(book+':'+chapter)){await figures.first().scrollIntoViewIfNeeded();await page.screenshot({path:`${root}/${engine}-${label}-${book}-${chapter}.png`});}
   rows.push({engine,label,book,chapter,images:check.images.length});
  }
  await context.close();console.log('PASS',engine,label,cases.length,'chapters');
 }
 }finally{await browser.close();}
}
fs.writeFileSync('research/notes/obadiah-matthew-phone-ipad-layout-2026-11-04.json',JSON.stringify(rows,null,2)+'\n');console.log('PASS',rows.length,'phone/iPad viewport renders');
}finally{globalThis.fetch=sourceFetch;await new Promise(r=>server.close(r));}
