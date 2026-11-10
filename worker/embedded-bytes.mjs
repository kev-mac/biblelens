// Cache public binary bytes, never a Response or a consumed stream. The build
// emits this self-contained function into the embedded Worker.
export function createEmbeddedByteCache(load, {maxBytes=4*1024*1024,maxEntries=24}={}) {
 const entries=new Map(),pending=new Map();let retained=0;
 async function read(key){
  if(entries.has(key)){const bytes=entries.get(key);entries.delete(key);entries.set(key,bytes);return bytes;}
  if(pending.has(key))return pending.get(key);
  // Bound retained promises as well as decoded bytes. Excess concurrent reads
  // can still complete, without extending the isolate's cache.
  if(pending.size>=maxEntries)return load(key);
  const job=Promise.resolve().then(()=>load(key)).then(bytes=>{
   if(!(bytes instanceof Uint8Array))throw Error('Embedded binary loader must return bytes');
   if(bytes.byteLength<=maxBytes){
    while(entries.size&&(entries.size>=maxEntries||retained+bytes.byteLength>maxBytes)){
     const first=entries.keys().next().value;retained-=entries.get(first).byteLength;entries.delete(first);
    }
    entries.set(key,bytes);retained+=bytes.byteLength;
   }
   return bytes;
  }).finally(()=>pending.delete(key));
  pending.set(key,job);return job;
 }
 return read;
}
