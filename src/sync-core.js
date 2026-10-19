// Shared, deterministic three-way merging for offline edits and cloud revisions.
(function(root){
 const maps=['notes','noteTitles','passageBookmarks','passageNotes','verseBookmarks','verseNotes'];
 const safeKey=key=>!['__proto__','constructor','prototype'].includes(key);
 const stable=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
 const equal=(a,b)=>stable(a)===stable(b);
 const copy=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
 function snapshot(state){
  const result={bookmarks:Object.fromEntries((state.bookmarks||[]).map(id=>[id,true]))};
  for(const key of maps)result[key]=Object.fromEntries(Object.entries(state[key]||{}).filter(([id])=>safeKey(id)));
  result.preferences={theme:state.theme,textScale:state.textScale,bookPickerPosition:state.bookPickerPosition,...state.readerPreferences};
  return copy(result);
 }
 function preserve(a,b){
  if(a===undefined)return copy(b);if(b===undefined)return copy(a);
  if(typeof a==='string'&&typeof b==='string')return a===b?a:a+'\n\n--- Edit from another device ---\n'+b;
  if(a&&b&&typeof a==='object'&&typeof b==='object')return {...b,...a,title:a.title||b.title,text:(preserve(a.text,b.text)||'')+(a.title&&b.title&&a.title!==b.title?'\n\n--- Title from another device ---\n'+b.title:'')};
  return copy(a);
 }
 function merge(base={},local={},remote={}){
  const result={};let conflicts=0;
  for(const namespace of ['bookmarks',...maps,'preferences']){
   const out=result[namespace]={},b=base[namespace]||{},l=local[namespace]||{},r=remote[namespace]||{};
   for(const key of new Set([...Object.keys(b),...Object.keys(l),...Object.keys(r)])){
    if(!safeKey(key))continue;
    let value;
    if(equal(l[key],b[key]))value=r[key];
    else if(equal(r[key],b[key])||equal(l[key],r[key]))value=l[key];
    else if(namespace==='verseBookmarks'&&l[key]&&r[key]){const highlights=[...(l[key].highlights||[]),...(r[key].highlights||[])];value={...r[key],...l[key],highlights:highlights.filter((h,i)=>highlights.findIndex(other=>h.edition===other.edition&&h.start===other.start&&h.end===other.end&&h.text===other.text)===i).slice(0,200)};}
    else if(['notes','passageNotes','verseNotes','noteTitles'].includes(namespace)){value=preserve(l[key],r[key]);conflicts++;}
    else value=l[key];
    if(value!==undefined)out[key]=copy(value);
   }
  }
  return {data:result,conflicts};
 }
 function apply(state,data){
  state.bookmarks=Object.keys(data.bookmarks||{}).filter(id=>data.bookmarks[id]);
  for(const key of maps)state[key]=copy(data[key]||{});
  const prefs=data.preferences||{};
  if(['dark','light'].includes(prefs.theme))state.theme=prefs.theme;
  if(Number.isFinite(prefs.textScale))state.textScale=Math.min(1.5,Math.max(.85,prefs.textScale));
  if(['fixed','floating'].includes(prefs.bookPickerPosition))state.bookPickerPosition=prefs.bookPickerPosition;
  state.readerPreferences={...state.readerPreferences};
  for(const key of ['edition','compare','commentary','navColors','font','verseFont','categoryFont'])if(typeof prefs[key]==='string')state.readerPreferences[key]=prefs[key];
 }
 root.BibleLensSync={snapshot,merge,apply,equal};
})(typeof window==='undefined'?globalThis:window);
