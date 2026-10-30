import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import {releaseContent} from './rc1-content.mjs';
import {b4Content} from './b4-neutral.mjs';
import {chromium,webkit} from 'playwright';
const read=p=>JSON.parse(fs.readFileSync(p));
const catalog=read('www/stories.json'),books=read('data/books.json'),chapters=read('data/chapters.json'),evidence=JSON.parse(releaseContent('data/evidence.json',b4Content('data/evidence.json')));
const parse=label=>{const m=/^(.*?) (\d+):(\d+)(?:\s*[-–]\s*(?:(\d+):)?(\d+))?$/.exec(label||'');return m?{book:books.find(b=>b.name===m[1]).id,start:+m[2]*1000+ +m[3],end:+(m[4]||m[2])*1000+ +(m[5]||m[3])}:null;};
const total=catalog.reduce((n,g)=>n+g.stories.length,0);assert.equal(total,284);
for(const g of catalog)for(const story of g.stories){
 const ranges=(story.passages||[story.passage]).map(parse),r=parse(story.passage),seen=new Set();let words=[];for(const r of ranges){
 for(let ch=Math.floor(r.start/1000);ch<=Math.floor(r.end/1000);ch++){const data=JSON.parse(zlib.gunzipSync(Buffer.from(chapters[r.book+':'+ch],'base64')));for(const v of data.verses)if(ch*1000+v.n>=r.start&&ch*1000+v.n<=r.end)if(!seen.has(r.book+':'+ch+':'+v.n)){seen.add(r.book+':'+ch+':'+v.n);words.push(...v.kjv.replace(/\{[HG]\d+\}/g,'').trim().split(/\s+/));}}}
 assert.equal(story.wordCount,words.length,story.title);assert.equal(story.readMinutes,Math.ceil(words.length/200));
 assert.equal(story.linkedCounts.crossReferences,new Set(story.cross_references).size);
 const matches=evidence.filter(e=>[e.ref,...(e.sides||[]).map(s=>s.ref),...(e.appliesTo||[]),...(e.refs||[]).map(x=>typeof x==='string'?x:x.label)].some(label=>{const x=parse(label);return x&&ranges.some(r=>x.book===r.book&&x.start<=r.end&&x.end>=r.start);}));
 for(const [kind,predicate]of [['science',e=>e.mode==='science'],['history',e=>e.mode==='history'],['text',e=>!['science','history'].includes(e.mode)]])assert.equal(story.linkedCounts[kind],new Set(matches.filter(predicate).map(e=>e.id)).size,story.title+' '+kind);
}
const base=process.env.BIBLELENS_PREVIEW_URL||'http://100.84.56.100:8788';
const shots=process.env.HOME+'/git/codex-reports/ux11-shots';
for(const [engine,type]of Object.entries({chromium,webkit})){
 const browser=await type.launch();try{for(const width of [320,390]){
 const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce',serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#stories');await page.locator('.story-card').first().waitFor();await page.waitForFunction(()=>getComputedStyle(document.querySelector('.stories-content')).display==='flex');await page.evaluate(()=>{state.theme='dark';applyTheme()});await page.waitForTimeout(2500);await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('#stories-heading').innerText(),'Events');assert.equal(await page.locator('#stories-search').getAttribute('placeholder'),'Search 284 events, themes, passages…');
 const chipCounts=await page.locator('#stories-chips button').allTextContents();assert.equal(chipCounts.slice(2).reduce((n,s)=>n+Number(/\((\d+)\)/.exec(s)[1]),0),total);
 assert(await page.locator('#stories-chips').evaluate(n=>{const r=n.getBoundingClientRect();return r.top>document.querySelector('#stories-search').getBoundingClientRect().bottom&&r.bottom<document.querySelector('.story-card').getBoundingClientRect().top}));
 assert.equal(await page.locator('.story-summary').first().textContent(),catalog[0].stories[0].summary);
 assert.equal(await page.locator('.read-badge').first().innerText(),catalog[0].stories[0].readMinutes+' min read');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No page overflow');
 for(const meta of await page.locator('.story-linked-meta').all())assert(await meta.evaluate(n=>n.scrollWidth<=n.clientWidth),'Metadata fits one line within its card');
 const overflowingMetadata=await page.evaluate(catalog=>{
  const list=document.querySelector('#stories-list'),saved=list.innerHTML;
  list.innerHTML=catalog.flatMap(group=>group.stories).map(story=>storyCard(story)).join('');fitStoryFooters();
  const failures=[...list.querySelectorAll('.story-footer')].filter(n=>{const meta=n.querySelector('.story-linked-meta'),action=n.querySelector('.action-link');return meta&&(meta.scrollWidth>meta.clientWidth||Math.abs(meta.getBoundingClientRect().top+meta.getBoundingClientRect().height/2-action.getBoundingClientRect().top-action.getBoundingClientRect().height/2)>1);}).map(n=>n.closest('article').id);
  list.innerHTML=saved;fitStoryFooters();return failures;
 },catalog);assert.deepEqual(overflowingMetadata,[],'All 284 real story footers fit one line');
 for(const selector of ['#stories-filter-open','#stories-chips button','.action-link'])for(const box of await page.locator(selector).evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().toJSON())))assert(box.width>=44&&box.height>=44,selector);
 await page.locator('#stories-search').fill('Creation');await page.locator('#stories-search-clear').waitFor();const clear=await page.locator('#stories-search-clear').boundingBox();assert(clear.width>=44&&clear.height>=44);await page.locator('#stories-search-clear').click();
 await page.locator('#stories-filter-open').click();await page.locator('#stories-filter-sheet[open]').waitFor();await page.locator('#stories-book').selectOption('Exodus');await page.waitForFunction(()=>document.querySelector('.passage-badge').textContent.startsWith('Exodus'));await page.locator('#stories-reset').click();await page.locator('#stories-filter-close').click();
 await page.locator('[data-stories-section=History]').click();await page.waitForFunction(()=>document.querySelector('#stories-results').textContent.includes('108'));await page.locator('[data-stories-section=""]').click();await page.waitForFunction(()=>document.querySelector('#stories-results').textContent.includes('284'));await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(100);
 await page.screenshot({path:`${shots}/stories-${engine}-${width}-top.png`});
 if(width===390){await page.locator('.story-card').nth(1).evaluate(n=>scrollTo(0,n.offsetTop-64));await page.screenshot({path:`${shots}/stories-${engine}-390-second.png`});await page.evaluate(()=>scrollTo(0,0));await page.locator('#stories-filter-open').click();await page.screenshot({path:`${shots}/stories-${engine}-390-filter.png`});await page.keyboard.press('Escape');}
 await page.locator('.action-link').first().click();await page.waitForFunction(()=>reading?.book===0&&reading?.chapter===1);assert.deepEqual(errors,[]);await page.close();console.log('PASS Stories',engine,width);
 }}finally{await browser.close();}
}
console.log('PASS all 284 KJV read times, real metadata, chip totals, filters, reader link, full chips, 320/390 overflow and 44 px targets');
