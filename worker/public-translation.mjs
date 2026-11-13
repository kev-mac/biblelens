// Public, immutable chapter data only. No incoming credentials or query data
// enters the upstream request. Unlike artwork, failed integrity never redirects.
export async function publicTranslationResponse(request,file,ctx={},dependencies={}){
 const headers={'content-type':'application/gzip','cache-control':'public, max-age=31536000, immutable','etag':'"'+file.sha256+'"','x-content-type-options':'nosniff','referrer-policy':'no-referrer'};
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{allow:'GET, HEAD'}});
 if(request.headers.get('if-none-match')===headers.etag)return new Response(null,{status:304,headers});
 if(request.method==='HEAD')return new Response(null,{headers:{...headers,'content-length':String(file.bytes)}});
 const cache=dependencies.cache??globalThis.caches?.default,fetcher=dependencies.fetcher??fetch;
 const key=new URL(request.url);key.search='?translation='+file.sha256;key.hash='';const cacheKey=new Request(key,{method:'GET'});
 try{const hit=await cache?.match(cacheKey);if(hit)return hit;}catch{}
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
 try{
  const response=await fetcher(file.url,{method:'GET',headers:{accept:'application/gzip'},redirect:'manual',signal:controller.signal});
  if(!response.ok||Number(response.headers.get('content-length')||0)>file.bytes)throw Error('Translation unavailable');
  const bytes=await response.arrayBuffer();if(bytes.byteLength!==file.bytes||bytes.byteLength>150000)throw Error('Length mismatch');
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),n=>n.toString(16).padStart(2,'0')).join('');
  if(digest!==file.sha256)throw Error('Hash mismatch');
  const result=new Response(bytes,{headers:{...headers,'content-length':String(bytes.byteLength)}});
  if(cache){const pending=cache.put(cacheKey,result.clone()).catch(()=>{});if(ctx.waitUntil)ctx.waitUntil(pending);else await pending;}
  return result;
 }catch{return new Response('Translation data unavailable',{status:503,headers:{'cache-control':'no-store','content-type':'text/plain; charset=utf-8'}});}
 finally{clearTimeout(timer);}
}

