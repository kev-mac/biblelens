'use strict';
// Separate per-record keys keep choices and saves out of cloud snapshots.
// Reading at each action also avoids one tab overwriting another record's work.
(() => {
 const prefix='biblelens-debate-device-v1:';
 const validId=id=>typeof id==='string'&&/^[a-zA-Z0-9_-]{1,180}$/.test(id)&&!['__proto__','constructor','prototype'].includes(id);
 const valid=value=>value&&typeof value==='object'&&typeof value.saved==='boolean'&&['A','B','Not sure',null].includes(value.stance);
 const read=id=>{try{const value=JSON.parse(localStorage.getItem(prefix+id));return valid(value)?value:{saved:false,stance:null};}catch{return {saved:false,stance:null};}};
 function all(){const result={};try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key?.startsWith(prefix)){const id=key.slice(prefix.length);if(validId(id))result[id]=read(id);}}}catch{}return result;}
 function write(id,patch){if(!validId(id))return false;const value={...read(id),...patch};if(!valid(value))return false;try{localStorage.setItem(prefix+id,JSON.stringify(value));window.dispatchEvent(new Event('biblelens:debatechange'));return true;}catch{return false;}}
 function restore(data){if(!data||typeof data!=='object'||Array.isArray(data))return;for(const [id,value] of Object.entries(data)){if(!validId(id)||!valid(value))continue;const old=read(id);write(id,{saved:old.saved||value.saved,stance:old.stance||value.stance});}}
 window.addEventListener('storage',event=>{if(event.key===null||event.key.startsWith(prefix))window.dispatchEvent(new Event('biblelens:debatechange'));});
 window.BibleLensDebateStore={read,write,all,restore};
})();
