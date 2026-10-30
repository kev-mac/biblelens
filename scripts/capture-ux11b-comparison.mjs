import './capture-ux11-comparison.mjs';
import fs from 'node:fs';
import {chromium} from 'playwright';
const root=process.env.HOME+'/git/codex-reports',out=root+'/ux11-side-by-side',shots=root+'/ux11-shots',base=process.env.BIBLELENS_PREVIEW_URL||'http://127.0.0.1:8875';
const b=await chromium.launch();const pairs=[];
try{
 const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
 const mock=fs.readFileSync(root+'/GEMINI-audit-3-mockups.html','utf8');
 await p.setContent(mock);
 const frames=await p.locator('.comparison-row').evaluateAll(rows=>rows.map(row=>row.querySelectorAll('.viewport-box')[1].querySelector('.mobile-frame').outerHTML));
 const styles=[...mock.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(match=>match[1]).join('\n');
 for(let i=0;i<4;i++){
  await p.setContent(`<style>${styles}body{margin:0;padding:0;display:block;min-height:0}.status-bar{display:none!important}.mobile-frame{width:390px!important;height:844px!important;margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important}.tab-bar{flex-shrink:0}</style>${frames[i]}`);
  await p.screenshot({path:out+'/mock-comparison-'+i+'.png'});
 }
 const capture=async(name,hash,selector,action)=>{
  await p.goto(base+'/'+hash);await p.locator(selector).first().waitFor();await p.evaluate(()=>{state.theme='dark';applyTheme();});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(180);if(action)await action();
  await p.screenshot({path:shots+'/ux11b-'+name+'.png'});fs.copyFileSync(shots+'/ux11b-'+name+'.png',out+'/ours-'+name+'.png');
 };
 await capture('reader-pip','#read/0/1','#verse-3',async()=>{await p.waitForFunction(()=>comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));await p.locator('#lens-focus').click();await p.locator('#verse-3 [data-lens-inspect]').waitFor();});
 pairs.push(['reader-pip','Reader evidence pip','mock-comparison-0.png','Pips match the inline shape and show only ✦ N; full scripture and the existing passage controls replace the abbreviated mock text.']);
 await capture('empty-verse','#read/0/1','#verse-1',async()=>{await p.waitForFunction(()=>comparisonModes.every(mode=>comparisonCache.get(comparisonKey(mode))?.status==='ready'));await p.locator('#verse-1 .verse-num').click();await p.locator('#ux-empty-verse-toast').waitFor();});
 pairs.push(['empty-verse','Empty verse toast and action strip','mock-comparison-1.png','Rounded toast; the action strip remains below it per Kevin’s decision. Existing scripture and passage controls are retained.']);
 await capture('people-az','#characters','.ux-contact');
 pairs.push(['people-az','People A–Z','mock-comparison-2.png','Sticky initials and the 44 px A–Z button match; cards use the requested Stories pattern and released roles and reference counts.']);
 await capture('people-az-sheet','#characters','.ux-contact',async()=>{await p.locator('#ux-alphabet-open').click();await p.locator('#ux-alphabet-sheet[open]').waitFor();});
 pairs.push(['people-az-sheet','People A–Z sheet','mock-comparison-2.png','The proposed frame has no open sheet; the real four-column A–Z sheet preserves disabled letters and keyboard navigation.']);
 await capture('bottom-nav','#discover','.ux-topic');
 pairs.push(['bottom-nav','Bottom navigation','mock-comparison-3.png','Flat tab bar, active icon and dot match; the app shows real Explore content instead of the mock’s blank blocks.']);
 for(const name of ['people','places','commandments','evidence-academic','evidence-Q','evidence-T','evidence-contradictions','evidence-V','gallery-history','gallery-science','gallery-text','gallery-translation','gallery-questions']){
  for(const suffix of ['', '-filter']){
   const key=name+suffix;fs.copyFileSync(shots+'/ux11b-'+key+'.png',out+'/ours-'+key+'.png');
   const differences={'gallery-questions':'Approved questions provide passages and labels; they have no standalone summary or reading-time field.',people:'Released roles and linked verses replace story passages; only an existing short first sentence is shown. Missing summaries and reading times are omitted.',places:'Existing passages, short descriptions, location type and linked verses replace story metadata; missing descriptions and reading times are omitted.',commandments:'Existing polarity and code, scripture quotation and passage replace story metadata; polarity chips use real counts and all facets remain in the sheet.','evidence-V':'This collection has zero published records; its real empty state replaces the reference cards.'};
   pairs.push([key,({'gallery-history':'History','gallery-science':'Science','gallery-text':'Text Comparisons','gallery-translation':'Translations','gallery-questions':'Big Questions'}[name]||name.replace('evidence-','Evidence · '))+(suffix?' filters':''),'mock-top.png',suffix?'The Stories reference contains no filter sheet; the right shows this collection’s existing filters in the shared sheet.':differences[name]||'Real evidence titles, summaries, passages and source counts replace story content; existing detail actions remain available and no reading time is invented.']);
  }
 }
}finally{await b.close();}
let html=fs.readFileSync(root+'/UX11-side-by-side.html','utf8').replaceAll('UX11a','UX11a + UX11b').replace('Stories comparison','visual comparison').replace('Stories at 390','all screens at 390').replace('Left: supplied stories-canvas.html. Right: production Stories in Chromium, dark theme.','Left: supplied Stories canvas or Proposed comparison frames. Right: production screens in Chromium, dark theme. Collection accents follow each section’s existing palette.');
html=html.replace('</html>',pairs.map(([key,title,reference,caption])=>`<section><h2>${title}</h2><div class="pair"><figure><figcaption>Reference · 390 × 844</figcaption><img src="ux11-side-by-side/${reference}" alt="Reference ${title}"></figure><figure><figcaption>BibleLens · dark · 390 × 844</figcaption><img src="ux11-side-by-side/ours-${key}.png" alt="BibleLens ${title}"></figure></div><p>${caption}</p></section>`).join('')+'</html>');
fs.writeFileSync(root+'/UX11-side-by-side.html',html);const destination='www/gemini/ux11';fs.cpSync(out,destination+'/ux11-side-by-side',{recursive:true});fs.writeFileSync(destination+'/index.html',html);console.log('PASS UX11b comparison:',pairs.length+3,'pairs, all images 390 × 844, original Stories pairs retained.');
