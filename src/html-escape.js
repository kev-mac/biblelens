// Escape text and quoted HTML attributes, not URLs, CSS or script contents.
const entities={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
export function escapeHTML(value){
 return String(value??'').replace(/[&<>"']/g,char=>entities[char]);
}
// Some existing renderers deliberately stringify null and undefined.
export function escapeHTMLString(value){return escapeHTML(String(value));}
