'use strict';
// Image metadata is separate from research claims. Empty slots make no image request.
(() => {
 const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const ratios={landscape:[1600,900],square:[1000,1000],portrait:[900,1200]};
 function render({kind='placeholder',src='',alt='',credit='',licence='',ratio='landscape',context='discovery',caption=''}={}){
  if(!['placeholder','illustration','source'].includes(kind))throw Error('Choose an image kind.');
  if(!['discovery','evidence'].includes(context))throw Error('Choose an image context.');
  if(!ratios[ratio])throw Error('Choose a fixed image ratio.');
  if(kind==='illustration'&&context==='evidence')throw Error('Illustrations cannot be evidence.');
  if(src&&(!alt.trim()||!credit.trim()||!licence.trim()))throw Error('Images need alt text, credit, and licence details.');
  if(src&&(kind==='placeholder'||!/^\/assets\/[a-z\d][a-z\d._/-]*\.(?:webp|png|jpe?g|avif)$/i.test(src)||src.split('/').includes('..')))throw Error('Choose a packaged image asset.');
  const [width,height]=ratios[ratio];
  const label=kind==='illustration'?'Illustration':kind==='source'?'Source image':'Image slot';
  return `<figure class="bl-media-slot bl-media-${ratio}" data-media-kind="${kind}"><div class="bl-media-frame">${src?`<img src="${escape(src)}" alt="${escape(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async">`:'<p class="bl-media-placeholder">No image selected</p>'}<span class="bl-media-label">${label}</span></div><figcaption>${caption?`<p>${escape(caption)}</p>`:''}${kind==='illustration'?'<p>Imagined artwork. Not a real portrait or historical evidence.</p>':''}<p class="bl-media-credit">Credit: ${escape(credit||'Pending review')} · Licence: ${escape(licence||'Pending review')}</p></figcaption></figure>`;
 }
 window.BibleLensMedia=Object.freeze({render});
})();
