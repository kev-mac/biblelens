// Shared, deterministic three-way merging for offline edits and cloud revisions.
(function(root){
 const maps=['notes','noteTitles','passageBookmarks','passageNotes','verseBookmarks','verseNotes','investigations'];
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
 function mergeDraft(base,draft,incoming){
  base=base??'';draft=draft??'';incoming=incoming??'';
  return equal(draft,base)?incoming:equal(incoming,base)||equal(draft,incoming)?draft:preserve(draft,incoming);
 }
 function validInvestigation(value){
  const passage=p=>p&&Number.isInteger(p.book)&&p.book>=0&&p.book<66&&Number.isInteger(p.chapter)&&p.chapter>0&&p.chapter<=150&&(p.verse===undefined||Number.isInteger(p.verse)&&p.verse>0&&p.verse<=176)&&(p.endVerse===undefined||Number.isInteger(p.endVerse)&&p.endVerse>=(p.verse||1)&&p.endVerse<=176);
  return !!value&&typeof value==='object'&&!Array.isArray(value)&&typeof value.id==='string'&&safeKey(value.id)&&typeof value.title==='string'&&value.title.length<=200&&typeof value.note==='string'&&value.note.length<=100000&&passage(value.left)&&passage(value.right)&&['kjv','web','asv'].includes(String(value.edition).toLowerCase());
 }
 function mergeInvestigation(base={},local,remote,key,out){
  if(!local||!remote)return copy(local||remote);
  const value={...remote,...local,id:key};let alternate=false;
  for(const field of ['note','title','left','right','edition']){
   if(equal(local[field],base[field]))value[field]=copy(remote[field]);
   else if(equal(remote[field],base[field])||equal(local[field],remote[field]))value[field]=copy(local[field]);
   else if(field==='note')value.note=preserve(local.note,remote.note);
   else if(field==='title')value.note=(value.note||'')+'\n\nTitle from another device: '+remote.title;
   else alternate=true;
  }
  if(alternate){
   // Keep a separately openable copy when both devices changed the passage pair.
   let hash=0;for(const character of stable(remote))hash=(Math.imul(hash,31)+character.charCodeAt(0))|0;
   const id=key+'-conflict-'+(hash>>>0).toString(36);out[id]={...copy(remote),id};
  }
  return value;
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
    else if(namespace==='investigations'){value=mergeInvestigation(b[key],l[key],r[key],key,out);conflicts++;}
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
  if(Number.isFinite(prefs.textScale))state.textScale=Math.min(1.8,Math.max(.85,prefs.textScale));
  if(['fixed','floating'].includes(prefs.bookPickerPosition))state.bookPickerPosition=prefs.bookPickerPosition;
  state.readerPreferences={...state.readerPreferences};
  for(const key of ['edition','compare','commentary','navColors','font','verseFont','categoryFont','appFont'])if(typeof prefs[key]==='string')state.readerPreferences[key]=prefs[key];
 }
 // The local journal makes a write durable before waiting for another tab's lock.
 // Applied sequence numbers also make recovery idempotent after an interrupted write.
 function createLocalStore({storage,key='scripture-lens-v1',actor,locks,getState,onMerge=()=>{},onStatus=()=>{}}){
  const prefix=key+':pending:',journalKey=prefix+actor;
  let sequence=0,observed={},queued=null,again=false,blocked=false,recovery=null;
  const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
  function validState(value){
   if(!object(value))throw Error('Invalid saved workspace');
   if(value.bookmarks!==undefined&&(!Array.isArray(value.bookmarks)||value.bookmarks.some(id=>typeof id!=='string')))throw Error('Invalid bookmarks');
   for(const name of maps){
    if(value[name]!==undefined&&!object(value[name]))throw Error('Invalid saved notes');
    for(const [id,item]of Object.entries(value[name]||{})){
     if(!safeKey(id)||(['notes','noteTitles'].includes(name)?typeof item!=='string':name==='investigations'?!validInvestigation(item):!object(item)))throw Error('Invalid saved note');
    }
   }
   if(value.readerPreferences!==undefined&&!object(value.readerPreferences))throw Error('Invalid reader preferences');
   return {bookmarks:[],notes:{},...value};
  }
  function quarantine(raw,source){
   if(recovery?.raw===raw&&recovery.source===source)return;
   recovery={raw,source};
   try{storage.setItem(key+':recovery:'+Date.now()+':'+actor,raw);onStatus({kind:'recovery',message:'An unreadable saved workspace was preserved for recovery. Download it before clearing browser data.'});}
   catch{blocked=true;onStatus({kind:'error',message:'Your saved workspace could not be read or backed up. Download the recovery file before continuing; the original has not been overwritten.'});}
  }
  function read(){
   let raw;
   try{raw=storage.getItem(key);return raw===null?{bookmarks:[],notes:{}}:validState(JSON.parse(raw));}
   catch(error){if(raw!==undefined&&raw!==null)quarantine(raw,key);else {blocked=true;onStatus({kind:'error',message:'Browser storage is unavailable. Export your work before closing this page.'});}return {bookmarks:[],notes:{}};}
  }
  const initial=read();observed=snapshot(initial);
  function journals(){
   const result=[];
   for(let i=0;i<storage.length;i++){
    const name=storage.key(i);if(!name?.startsWith(prefix))continue;
    const raw=storage.getItem(name);
    try{const item=JSON.parse(raw);if(!object(item)||typeof item.actor!=='string'||!safeKey(item.actor)||!Number.isSafeInteger(item.sequence)||item.sequence<1||!object(item.base))throw Error();validState(item.state);result.push({name,raw,...item});}
    catch{quarantine(raw,name);}
   }
   return result.sort((a,b)=>(a.savedAt||0)-(b.savedAt||0)||a.actor.localeCompare(b.actor));
  }
  function commit(){
   if(blocked)throw Error('Recovery backup is required before saving.');
   const disk=read();if(blocked)throw Error('Recovery backup is required before saving.');
   const before=snapshot(getState()),entries=journals(),applied=object(disk._localApplied)?Object.fromEntries(Object.entries(disk._localApplied).filter(([id])=>safeKey(id))):{};
   if(blocked)throw Error('Recovery backup is required before saving.');
   let next=copy(disk),conflicts=0,ownApplied=false,wrote=false;
   for(const entry of entries){
    if((applied[entry.actor]||0)>=entry.sequence)continue;
    const merged=merge(entry.base,snapshot(entry.state),snapshot(next));conflicts+=merged.conflicts;
    next={...next,...entry.state};apply(next,merged.data);applied[entry.actor]=entry.sequence;wrote=true;
    if(entry.actor===actor)ownApplied=true;
   }
   next._localApplied=applied;
   if(wrote)storage.setItem(key,JSON.stringify(next));
   // A lock protects journal cleanup. Without it, retain journals so concurrent
   // commits can recover each other's writes using the applied sequence numbers.
   if(locks?.request)for(const entry of entries)if((applied[entry.actor]||0)>=entry.sequence&&storage.getItem(entry.name)===entry.raw)storage.removeItem(entry.name);
   const remote=snapshot(next),merged=merge(ownApplied?before:observed,snapshot(getState()),remote);
   observed=remote;
   if(!equal(merged.data,snapshot(getState())))onMerge(merged.data,{conflicts:conflicts+merged.conflicts});
   if(wrote)onStatus({kind:'saved',conflicts:conflicts+merged.conflicts});
   return next;
  }
  function flush(){
   if(queued){again=true;return queued;}
   queued=Promise.resolve().then(()=>locks?.request?locks.request(key+':write',commit):commit()).catch(error=>{onStatus({kind:'error',message:'Changes are still in this tab. Browser storage could not finish saving; export your work before closing.'});return null;}).finally(()=>{queued=null;if(again){again=false;flush();}});
   return queued;
  }
  function save(){
   if(blocked)return false;
   try{
    storage.setItem(journalKey,JSON.stringify({actor,sequence:++sequence,savedAt:Date.now(),base:observed,state:getState()}));
    onStatus({kind:'saved'});flush();return true;
   }catch{onStatus({kind:'error',message:'Changes are only in this tab. Browser storage is full or unavailable; export your work before closing.'});return false;}
  }
  return {initial,save,flush,receive:event=>{if(event.key===null||event.key===key||event.key?.startsWith(prefix))flush();},get recovery(){return recovery;}};
 }
 root.BibleLensSync={snapshot,merge,apply,equal,mergeDraft,validInvestigation,createLocalStore};
})(typeof window==='undefined'?globalThis:window);
