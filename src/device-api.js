// Installed before the existing reader scripts in the mobile bundle only.
// Same-origin API requests stay in a background worker, including when offline.
export function installDeviceApi(target=globalThis){
 const originalFetch=target.fetch.bind(target),pending=new Map();let engine=null,nextId=0;
 function stop(reason){engine?.terminate();engine=null;for(const p of pending.values()){p.cleanup();p.reject(reason);}pending.clear();}
 function getEngine(){
  if(engine)return engine;
  engine=new target.Worker('./device-api-worker.js',{type:'module',name:'scripture-device-search'});
  engine.onmessage=({data})=>{const task=pending.get(data.id);if(!task)return;pending.delete(data.id);task.cleanup();task.resolve(new Response(data.body,{status:data.status,headers:data.headers}));};
  engine.onerror=()=>stop(new Error('The on-device search stopped. Please try again.'));
  return engine;
 }
 target.fetch=async(input,init={})=>{
  const url=new URL(typeof input==='string'?input:input.url||String(input),target.location.href);
  if(url.origin===target.location.origin&&url.pathname.startsWith('/api/sync'))return new Response(JSON.stringify({error:'Cloud sync is unavailable in this offline preview.'}),{status:503,headers:{'content-type':'application/json'}});
  if(url.origin!==target.location.origin||!url.pathname.startsWith('/api/'))return originalFetch(input,init);
  const request=new Request(url,{...(input instanceof Request?{method:input.method,headers:input.headers,body:['GET','HEAD'].includes(input.method)?undefined:await input.clone().text(),signal:input.signal}:{}),...init});
  if(request.signal.aborted)throw request.signal.reason||new DOMException('Aborted','AbortError');
  const method=request.method,body=['GET','HEAD'].includes(method)?undefined:await request.text();
  return new Promise((resolve,reject)=>{
   const id=++nextId,signal=request.signal;
   const abort=()=>{pending.delete(id);cleanup();reject(signal.reason||new DOMException('Aborted','AbortError'));};
   const cleanup=()=>signal.removeEventListener('abort',abort);
   try{const worker=getEngine();pending.set(id,{resolve,reject,cleanup});signal.addEventListener('abort',abort,{once:true});if(signal.aborted){abort();return;}worker.postMessage({id,path:url.pathname+url.search,method,body});}
   catch(error){pending.delete(id);cleanup();reject(error);}
  });
 };
 const warm=()=>target.fetch('/api/search?q=John%203%3A16').catch(()=>{});
 if(target.requestAnimationFrame)target.requestAnimationFrame(()=>target.requestAnimationFrame(()=>{setTimeout(warm,0);}));
 return ()=>{stop(new Error('Device API closed'));target.fetch=originalFetch;};
}
