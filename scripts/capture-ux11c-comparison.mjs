import fs from 'node:fs';
import {chromium} from 'playwright';
const root=process.env.HOME+'/git/codex-reports',shots=root+'/ux11-shots',out=root+'/ux11-side-by-side',base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
for(const dir of [shots,out,'www/gemini/ux11/ux11-side-by-side'])fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch();
const sections=[];
try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
 const mock=fs.readFileSync(root+'/GEMINI-audit-3-mockups.html','utf8');await page.setContent(mock);
 const frame=await page.locator('.comparison-row').first().locator('.viewport-box').nth(1).locator('.mobile-frame').evaluate(n=>n.outerHTML);
 const styles=[...mock.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
 const capture=async name=>{await page.screenshot({path:shots+'/'+name});fs.copyFileSync(shots+'/'+name,out+'/'+name);fs.copyFileSync(shots+'/'+name,'www/gemini/ux11/ux11-side-by-side/'+name);};
 const pair=(id,title,left,right,caption)=>sections.push(`<section id="${id}"><h2>${title}</h2><div class="pair"><figure><figcaption>${left[0]}</figcaption><img src="ux11-side-by-side/${left[1]}" alt="${left[0]}"></figure><figure><figcaption>${right[0]}</figcaption><img src="ux11-side-by-side/${right[1]}" alt="${right[0]}"></figure></div><p>${caption}</p></section>`);
 for(const width of [390,320]){
  await page.goto('about:blank');await page.setViewportSize({width,height:844});
  await page.setContent(`<style>${styles}body{margin:0;padding:0;display:block;min-height:0}.status-bar{display:none!important}.mobile-frame{width:${width}px!important;height:844px!important;margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important}.tab-bar{flex-shrink:0}</style>${frame}`);
  await capture(`ux11c2-gemini-${width}.png`);
  await page.goto(base+'/#read/0/1');await page.locator('#verse-1').waitFor();await page.evaluate(()=>{state.theme='dark';applyTheme();});await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));
  for(const on of [true,false]){
   if((await page.locator('#lens-focus').getAttribute('aria-pressed')==='true')!==on)await page.locator('#lens-focus').click();
   // Keep pointer focus after a real tap so persistent pressed/focus boxes are visible.
   await page.evaluate(()=>scrollTo(0,0));await capture(`ux11c2-reader-${width}-${on?'on':'off'}.png`);
  }
  pair(`ux11c2-gemini-${width}`,`Gemini Proposed reader vs UX11c2 · ${width} × 844`,['Gemini Proposed',`ux11c2-gemini-${width}.png`],['UX11c2 · Evidence on',`ux11c2-reader-${width}-on.png`], 'Real title “The Creation” replaces “The Creation Week”; complete scripture replaces the shortened second verse and continues below verse 3 with real record counts. Our header is 44 px high, versus 36 px in the static frame, to retain distinct 44 px controls; this lowers the centred heading. The KJV chip has a separate tap target and a wider background. The mock highlights verse 3; no verse is selected in this live view. Our bottom bar is taller with a safe-area indicator, different icon strokes and active-label color, and inset tab centres.');
  pair(`ux11c2-evidence-${width}`,`Evidence on and off · ${width} × 844`,['Evidence on',`ux11c2-reader-${width}-on.png`],['Evidence off',`ux11c2-reader-${width}-off.png`], 'Evidence on adds the state dot and inline record-count pips; its right-aligned pill is wider. The pips can extend a verse onto another line, changing the visible scripture at the bottom. The text, header, type and bottom navigation are shared.');
 }
 const before='ux11c2-before-reader.png';fs.copyFileSync(shots+'/ux11b-reader-pip.png',out+'/'+before);fs.copyFileSync(out+'/'+before,'www/gemini/ux11/ux11-side-by-side/'+before);
 pair('ux11c2-before','UX11b reader vs UX11c2 · 390 × 844',['UX11b · b711675',before],['UX11c2', 'ux11c2-reader-390-on.png'],'UX11b has the brand, Search and Settings row, chapter chevron, Aa and a boxed Evidence button. UX11c2 uses one passage/edition/Evidence row, hides those extra controls on phones, centres the eyebrow and real title, removes the number gutter and scripture bands, and reduces scripture to 0.95rem at 1.75 line height. The canvas is darker. Inline superscript numbers replace UX11b’s tall number boxes; the smaller type shows more scripture and pips. The bottom navigation is retained.');
}finally{await browser.close();}
let html=fs.readFileSync(root+'/UX11-side-by-side.html','utf8').replace(/<section id="ux11c(?:2)?-[\s\S]*?<\/section>/g,'');
html=html.replace('</html>',sections.join('')+'</html>');fs.writeFileSync(root+'/UX11-side-by-side.html',html);fs.writeFileSync('www/gemini/ux11/index.html',html);
console.log('Captured five UX11c2 pairs. Review all five pairs before completion.');
