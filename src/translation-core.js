const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function alignmentHtml(record){
 if(!record?.tokens?.length)return '<p class="translation-unavailable" role="status">Word alignment is unavailable for this verse in the Berean table. Your selected English text is shown above.</p>';
 return '<ol class="translation-tiles" dir="ltr" aria-label="Berean word links in English reading order">'+record.tokens.map(([english,original,transliteration,language,,uncertain])=>{
  const rtl=language!=='Greek',lang=({Hebrew:'he',Aramaic:'arc',Greek:'grc'})[language];
  return '<li class="translation-tile"><span class="translation-english" lang="en" dir="ltr">'+escape(english||'No separate English phrase')+'</span><span class="translation-language">'+escape(language)+'</span>'+
   (uncertain?'<span class="translation-gap">Word link unavailable for this added phrase</span>':original?'<bdi class="translation-original" lang="'+lang+'" dir="'+(rtl?'rtl':'ltr')+'">'+escape(original)+'</bdi>':'<span class="translation-gap">No source word supplied</span>')+
   '<span class="translation-transliteration" dir="ltr">'+escape(uncertain?'':transliteration||'Transliteration unavailable')+'</span></li>';
 }).join('')+'</ol>'+(record.notes?.length?'<details class="translation-notes"><summary>Text notes from the publisher</summary>'+record.notes.map(note=>'<p>'+escape(note)+'</p>').join('')+'</details>':'');
}
export function createChapterLoader(fetcher=fetch){
 const cache=new Map();
 return async (book,chapter)=>{
  if(!Number.isInteger(book)||book<0||book>65||!Number.isInteger(chapter)||chapter<1||chapter>150)return null;
  const key=book+'-'+chapter;
  if(!cache.has(key)){
   const request=(async()=>{
    const response=await fetcher('/translation/bsb-v1/'+key+'.json.gz',{credentials:'same-origin'});
    if(response.status===404)return null;
    if(!response.ok)throw Error('Translation chapter unavailable');
    const body=await response.blob();
    if(body.size>150000)throw Error('Unexpected translation chapter size');
    const data=await new Response(body.stream().pipeThrough(new DecompressionStream('gzip'))).json();
    if(!data?.verses||typeof data.verses!=='object')throw Error('Invalid translation chapter');
    return data;
   })().catch(error=>{cache.delete(key);throw error;});
   cache.set(key,request);while(cache.size>8)cache.delete(cache.keys().next().value);
  }
  return cache.get(key);
 };
}
export {escape as translationEscape};

