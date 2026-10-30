import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';
const root=process.env.HOME+'/git/codex-reports',out=root+'/ux11-side-by-side',shots=root+'/ux11-shots';fs.mkdirSync(out,{recursive:true});
const source=fs.readFileSync(root+'/gemini-mockups-ux11/stories-canvas.html','utf8');
const styles=[...source.matchAll(/<style>([\s\S]*?)<\/style>/g)].at(-1)[1];
const body=source.slice(source.lastIndexOf('<body>')+6,source.lastIndexOf('</body>')).replace(/<script\b[\s\S]*?<\/script>/g,'');
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await page.setContent(`<style>${styles}body{padding:0;display:block;min-height:0}.wrapper-title,.wrapper-sub,.status-bar{display:none}.phone-frame{width:390px;height:844px;border:0;border-radius:0;box-shadow:none}</style>${body}`);
 await page.screenshot({path:out+'/mock-top.png'});
 await page.locator('.content-area').evaluate(n=>{const second=n.querySelectorAll('.story-card')[1];n.scrollTop=second.offsetTop-n.offsetTop;});
 await page.screenshot({path:out+'/mock-second.png'});
 await page.locator('.content-area').evaluate(n=>n.scrollTop=0);
 await page.screenshot({path:out+'/mock-filter.png'});
 for(const name of ['top','second','filter'])fs.copyFileSync(`${shots}/stories-chromium-390-${name}.png`,`${out}/ours-${name}.png`);
 fs.copyFileSync(root+'/gemini-mockups-ux11/01-stories.png',out+'/supplied-01-stories.png');
}finally{await browser.close();}
const pairs=[['top','Top of list','Real summaries, canonical section chips and linked counts replace mock placeholders. The addendum sets larger titles, summary text, pill radii and card radii. Chips are fully visible with 44 px targets. Inter follows the app-wide choice.'],['second','Second card','The real second story is The Fall of Man (Genesis 3), with its complete approved summary. Its text length sets the card height. Both views scroll to their second card; the app keeps the requested sticky header.'],['filter','Filter sheet','The supplied mock filter button is inert and its HTML contains no filter sheet. The left image therefore shows the supplied reference unchanged; the right shows the real Book filter sheet. No reference sheet was invented.']];
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>UX11a Stories comparison</title><style>body{font:16px/1.5 Inter,system-ui,sans-serif;background:#0b0e14;color:#f8fafc;margin:24px}h1{font-size:24px}section{margin:36px 0}.pair{display:flex;gap:20px;overflow-x:auto}figure{margin:0;flex:0 0 390px}img{width:390px;height:844px;display:block;border:1px solid #334155}figcaption{margin:8px 0;color:#c084fc}p{max-width:800px;color:#cbd5e1}a{color:#c084fc}</style><h1>UX11a · Stories at 390 × 844</h1><p>Left: supplied stories-canvas.html. Right: production Stories in Chromium, dark theme. The mock’s simulated phone frame and OS status bar are removed so app viewports share the same dimensions. <a href="ux11-side-by-side/supplied-01-stories.png">Original 01-stories.png</a>.</p>${pairs.map(([key,title,caption])=>`<section><h2>${title}</h2><div class="pair"><figure><figcaption>Gemini reference</figcaption><img src="ux11-side-by-side/mock-${key}.png" alt="Reference ${title}"></figure><figure><figcaption>BibleLens · real data</figcaption><img src="ux11-side-by-side/ours-${key}.png" alt="BibleLens ${title}"></figure></div><p>${caption}</p></section>`).join('')}</html>`;
fs.writeFileSync(root+'/UX11-side-by-side.html',html);
const destination=path.resolve('www/gemini/ux11');fs.mkdirSync(destination,{recursive:true});fs.cpSync(out,destination+'/ux11-side-by-side',{recursive:true});fs.writeFileSync(destination+'/index.html',html);
console.log('PASS comparison generated from supplied canvas and production captures; missing reference sheet stated explicitly.');
