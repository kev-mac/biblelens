import assert from 'node:assert/strict';

// Extend every engine/theme/width cell with reader actions and real comparison text.
export async function checkReaderTheme(p,go,theme,width){
 const surfaces=async selector=>{
  const values=await p.locator(selector).evaluateAll(ns=>ns.filter(n=>n.getClientRects().length).map(n=>{
   const rgba=s=>(s.match(/[\d.]+/g)||[]).map(Number),blend=(f,b)=>f.slice(0,3).map((v,i)=>v*(f[3]??1)+b[i]*(1-(f[3]??1))),lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
   let bg=[255,255,255],chain=[];for(let a=n;a;a=a.parentElement)chain.unshift(a);for(const a of chain)bg=blend(rgba(getComputedStyle(a).backgroundColor),bg);
   const fg=blend(rgba(getComputedStyle(n).color),bg),a=lum(fg),b=lum(bg);
   return {label:n.id||n.className,bg,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
  }));
  assert(values.length,selector+' visible');
  for(const v of values){assert(theme==='dark'?v.bg.every(c=>c<100):v.bg.every(c=>c>180),selector+' surface '+JSON.stringify(v));assert(v.ratio>=4.5,selector+' contrast '+JSON.stringify(v));}
  return values;
 };
 await go('#read/0/11/31','#verse-31 .location-chip');
 const names=p.locator('#chapter-text .verse-body :is(.person-chip,.location-chip)');
 assert(await names.count());
 assert(await names.evaluateAll(ns=>ns.every(n=>{const s=getComputedStyle(n);return n.tagName==='A'&&s.color===getComputedStyle(n.parentElement).color&&s.whiteSpace==='normal'&&s.textDecorationStyle==='dotted'&&s.textDecorationLine==='underline'&&s.textDecorationThickness==='1px'&&s.textUnderlineOffset==='3px';})), 'quiet inline name links');
 const ur=p.locator('#verse-31 .location-chip').filter({hasText:'Ur of the Chaldees'});
 // A genuine inline link fragments across lines. Buttons remain atomic even with white-space:normal.
 assert(await ur.evaluate(n=>{const host=document.createElement('div');host.className='verse-body';host.style.cssText='width:100px;position:absolute';const copy=n.cloneNode(true);host.append(copy);n.closest('#chapter-text').append(host);const wraps=copy.getClientRects().length>1;host.remove();return wraps;}),'long names wrap');
 await ur.focus();assert(await ur.evaluate(n=>{const probe=document.createElement('span');probe.style.color='var(--lens-link)';n.after(probe);const matches=getComputedStyle(n).color===getComputedStyle(probe).color;probe.remove();return matches;}),'focused name accent');await ur.blur();
 const bottom=await surfaces('.chapter-bottom button');
 await p.locator('#ux-chapter-picker').click();await p.locator('#passage-picker[open]').waitFor();const picker=await surfaces('#passage-picker');await p.keyboard.press('Escape');
 await p.evaluate(()=>document.querySelector('#lens-settings').click());await p.locator('#reader-settings[open]').waitFor();const settings=await surfaces('#reader-settings');await surfaces('#reader-settings select');await p.keyboard.press('Escape');
 await go('#read/0/1','#verse-1');await p.locator('#verse-1 .verse-num').click();await p.locator('#ux-empty-verse-actions').waitFor();const actions=await surfaces('#ux-empty-verse-actions,.ux-verse-actions button');
 await go('#compare?left=Genesis+11%3A27%E2%80%9332&right=Genesis+12%3A1%E2%80%935','.lens-comparison-passage');
 const compare=await surfaces('#lens-inspector-sheet,#lensComparison,.lens-comparison-passage,.lens-parallel-text p,#lens-compare-left,#lens-compare-right');
 assert(await p.locator('.lens-comparison-passage').count()===2);
 assert(await p.locator('#lensComparison').evaluate(n=>{const sheet=n.closest('dialog'),a=n.getBoundingClientRect(),b=sheet.getBoundingClientRect();return getComputedStyle(n).position==='static'&&a.left>=b.left&&a.right<=b.right+1&&n.scrollWidth<=n.clientWidth+1;}),'comparison fits its sheet');
 for(const layout of ['side','stacked']){await p.locator(`[data-compare-layout=${layout}]`).click();assert(await p.locator('#lensComparison').evaluate(n=>n.scrollWidth<=n.clientWidth+1),'comparison layout overflow '+layout);}
 await p.keyboard.press('Escape');
 await go('#places?place=recgQtoCtBjbsPwAw','.place-details.open');
 const card=p.locator('#place-recgQtoCtBjbsPwAw');assert.equal(await card.locator(':scope > .directory-save').count(),0);
 assert(await card.locator('.place-details .directory-save').evaluate(n=>getComputedStyle(n).position==='static'&&n.getBoundingClientRect().top>n.closest('.place-details').querySelector('h3:last-of-type').getBoundingClientRect().bottom),'save stays below Sources');
 await card.locator('[data-expand-place]').click();assert(!(await card.locator('.directory-save').isVisible()),'collapsed card has no bookmark');
 return {hash:'reader-controls-and-compare',width,theme,bottom,picker,settings,actions,compare};
}
