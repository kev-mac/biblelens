import fs from 'node:fs';
import {chromium} from 'playwright';
const root=process.env.HOME+'/git/codex-reports',shots=root+'/ux13-shots',base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8787';
fs.mkdirSync(shots,{recursive:true});
const browser=await chromium.launch();
try{for(const width of [390,1280])for(const theme of ['light','dark'])for(const key of ['read','ur']){
 const p=await browser.newPage({viewport:{width,height:1000},serviceWorkers:'block',reducedMotion:'reduce'});
 await p.goto(base+'/'+(key==='read'?'#read/0/11/31':'#places?place=recgQtoCtBjbsPwAw'));
 await p.locator(key==='read'?'#verse-31 .location-chip':'.place-details.open').first().waitFor();await p.waitForTimeout(500);
 await p.evaluate(theme=>{state.theme=theme;applyTheme();},theme);await p.evaluate(()=>document.fonts.ready);
 if(key==='read')await p.waitForFunction(()=>comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));
 await p.locator('.fetch-retry-status').waitFor({state:'hidden'});
 if(key==='ur')await p.locator('#place-recgQtoCtBjbsPwAw').evaluate(n=>scrollTo(0,scrollY+n.getBoundingClientRect().top-(innerWidth<768?65:140)));
 await p.screenshot({path:`${shots}/ux13c-after-${key}-${theme}-${width}.png`});
 if(key==='read'){await p.locator('.chapter-bottom').scrollIntoViewIfNeeded();await p.screenshot({path:`${shots}/ux13c-controls-${theme}-${width}.png`});await p.locator('#lens-compare').click();await p.locator('#lens-compare-right').fill('Genesis 12:1–5');await p.locator('#lens-comparison-form button').click();await p.locator('.lens-comparison-passage').first().waitFor();await p.screenshot({path:`${shots}/ux13c-compare-${theme}-${width}.png`});}
 await p.close();
}}finally{await browser.close();}
const dest='www/gemini/ux11/ux13-shots';fs.mkdirSync(dest,{recursive:true});
// Retain the exact review evidence that prompted this follow-up.
for(const [key,source] of [['read','probe-read-390.png'],['ur','probe-places-390.png']]){
 fs.copyFileSync(shots+'/'+source,shots+`/ux13c-review-before-${key}.png`);
 for(const name of [`ux13c-review-before-${key}.png`,`ux13c-after-${key}-light-390.png`])fs.copyFileSync(shots+'/'+name,dest+'/'+name);
}
let html=fs.readFileSync(root+'/UX11-side-by-side.html','utf8').replace(/<section id="ux13c-[\s\S]*?<\/section>/g,'');
const added=[['read','Genesis 11 · Light · 390','Names follow the text colour, with a faint dotted underline. Long names wrap within the sentence.'],['ur','Ur of the Chaldees · Light · 390','The card has no bookmark action. Saving remains below Sources in expanded details.']].map(([key,title,caption])=>`<section id="ux13c-${key}"><h2>UX13c ${title}</h2><div class="pair"><figure><figcaption>Before · Claude UX13 review</figcaption><img src="ux13-shots/ux13c-review-before-${key}.png" alt="Before ${title}"></figure><figure><figcaption>After UX13c</figcaption><img src="ux13-shots/ux13c-after-${key}-light-390.png" alt="After ${title}"></figure></div><p>${caption}</p></section>`).join('\n');
html=html.includes('</body>')?html.replace('</body>',added+'\n</body>'):html.replace('</html>',added+'\n</html>');
fs.writeFileSync(root+'/UX11-side-by-side.html',html);fs.writeFileSync('www/gemini/ux11/index.html',html);
console.log('Captured light/dark reader, Ur, controls and comparisons at 390/1280; added two review pairs.');
