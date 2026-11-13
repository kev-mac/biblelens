import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {chromium} from 'playwright';
import worker from './built-worker.mjs';
const sqlite=new DatabaseSync(':memory:');
for(const file of fs.readdirSync('drizzle').filter(file=>file.endsWith('.sql')))sqlite.exec(fs.readFileSync('drizzle/'+file,'utf8'));
const DB={prepare(sql){return {bind(...args){return {async first(){return sqlite.prepare(sql).get(...args)||null;},async run(){return sqlite.prepare(sql).run(...args);}};}};}};
const realFetch=globalThis.fetch;let providerCalls=0,onlineRequests=0,user='browser-trial';
globalThis.fetch=async(url,init)=>{
 assert.equal(url,'https://api.openai.com/v1/responses','No external requests except the mocked provider');providerCalls++;
 const request=JSON.parse(init.body);
 if(!request.tools)return Response.json({status:'completed',usage:{input_tokens:10,output_tokens:10},output:[{type:'message',role:'assistant',content:[{type:'output_text',text:'{"queries":["water becomes wine","Jesus calms a storm"]}'}]}]});
 return Response.json({status:'completed',usage:{input_tokens:50,output_tokens:30},output:[{type:'web_search_call',status:'completed'},{type:'message',role:'assistant',content:[{type:'output_text',text:'From zLenz: Read the app passages [A1].\nFrom the web: Source.',annotations:[{type:'url_citation',start_index:51,end_index:57,title:'Reference overview',url:'https://www.britannica.com/topic/miracle'}]}]}]});
};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1:'+server.address().port),headers=new Headers(req.headers);headers.set('oai-authenticated-user-id',user);
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  if(url.pathname==='/api/answer')onlineRequests++;
  const response=await worker.fetch(new Request(url,{method:req.method,headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})}),{DB,OPENAI_API_KEY:'test-only-not-a-real-provider-key',BIBLELENS_AI_ALLOWED_USERS:user},{});
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(error.message);}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:process.platform==='win32'?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{})}),results=[];
try{
 for(const width of [320,390,820,1440]){
  user='browser-trial-'+width;const before=onlineRequests,context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
  await page.goto(base+'/#search');const input=page.locator('#lens-search-input');await input.waitFor({state:'visible'});
  assert(await input.evaluate(node=>{const style=getComputedStyle(node),canvas=document.createElement('canvas'),context=canvas.getContext('2d');context.font=style.font;return context.measureText(node.placeholder).width<=node.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);}), 'The empty search placeholder fits');
  await input.fill('show me examples of miracles');
  await page.waitForFunction(()=>document.querySelector('#lens-search-results')?.textContent.includes('John 2:'));
  assert.equal(onlineRequests,before,'Typing must never request paid search');
  await page.locator('#lens-web-search').click();await page.locator('#lens-web-results .combined-citation').first().waitFor();
  assert.equal(onlineRequests,before+1);assert(await page.locator('#lens-web-results a').filter({hasText:'Web:'}).count());
  assert(await page.locator('#lens-search-results').evaluate(node=>!!(node.compareDocumentPosition(document.querySelector('#lens-web-results'))&Node.DOCUMENT_POSITION_FOLLOWING)));
  const metrics=await page.locator('#lens-search-form').evaluate(node=>({width:node.clientWidth,scroll:node.scrollWidth,input:document.querySelector('#lens-search-input').getBoundingClientRect().width,button:document.querySelector('#lens-web-search').getBoundingClientRect().width}));
  assert(metrics.scroll<=metrics.width+2,JSON.stringify(metrics));assert(metrics.input>=90,JSON.stringify(metrics));
  // Kevin's exact question must open a real app passage, not a generated URL.
  const passageLink=page.locator('#lens-search-results a[href^="#read/"]').first(),href=await passageLink.getAttribute('href'),ref=/^#read\/(\d+)\/(\d+)\/(\d+)/.exec(href);assert(ref);
  const expected=await page.evaluate(async path=>await(await fetch(path)).json(),'/api/chapter?book='+ref[1]+'&chapter='+ref[2]);assert(expected.verses.some(verse=>verse.n===Number(ref[3])));
  await passageLink.click();await page.waitForFunction(hash=>location.hash===hash,href);await page.waitForFunction(({book,chapter})=>typeof readingBook!=='undefined'&&readingBook===book&&readingChapter===chapter&&reading?.verses?.length,{book:Number(ref[1]),chapter:Number(ref[2])});
  await page.goto(base+'/#search');await input.waitFor({state:'visible'});
  // New text invalidates the previous online result. Enter submits once.
  await input.fill('feeding a crowd');assert.equal(await page.locator('#lens-web-results').textContent(),'');await input.press('Enter');await page.locator('#lens-web-results .combined-citation').first().waitFor();assert.equal(onlineRequests,before+2);
  fs.mkdirSync('.release/combined-search',{recursive:true});await page.screenshot({path:'.release/combined-search/search-'+width+'.png'});
  await input.press('Escape');await page.goto(base+'/#chat');await page.locator('#chat-input').waitFor({state:'visible'});
  // Another account isolates the chat quota from the two preceding searches.
  user+='-chat';await page.locator('#chat-input').fill('show me examples of miracles');await page.locator('#chat-send').click();await page.locator('#chat-messages .combined-citation').first().waitFor();
  assert(await page.locator('#chat-messages .message-body').filter({hasText:'These passages describe'}).count());assert.equal(errors.length,0,errors.join('\n'));
  results.push({width,metrics,errors});await context.close();
 }
 fs.writeFileSync('.release/combined-search/browser-results.json',JSON.stringify({results,providerCalls,onlineRequests,liveApiRequests:0},null,2));
 console.log('PASS: 320/390/820/1440px browser layout, app-first results, no paid request while typing, single click/Enter submission, inline source labels, stale-result reset and default chat integration. Provider mocked; zero live API requests.');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));globalThis.fetch=realFetch;sqlite.close();}
