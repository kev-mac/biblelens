// Only public, content-checked artwork is fetched. User requests and credentials
// never become origin headers, URLs or cache entries.
export async function publicArtworkResponse(request,art,ctx={},dependencies={}) {
 const headers={'content-type':'image/webp','cache-control':'public, max-age=31536000, immutable','etag':'"'+art.sha256+'"','content-length':String(art.bytes),'x-content-type-options':'nosniff'};
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{allow:'GET, HEAD','cache-control':'no-store'}});
 if(request.headers.get('if-none-match')===headers.etag)return new Response(null,{status:304,headers});
 if(request.method==='HEAD')return new Response(null,{headers});
 const cache=dependencies.cache??globalThis.caches?.default,fetcher=dependencies.fetcher??fetch;
 const key=new URL(request.url);key.search='?art='+art.sha256;key.hash='';const cacheKey=new Request(key,{method:'GET'});
 try{const cached=await cache?.match(cacheKey);if(cached)return cached;}catch{}
 try{
  const response=await fetcher(art.url,{method:'GET',headers:{accept:'image/webp'},credentials:'omit',redirect:'error',signal:AbortSignal.timeout(12000)});
  if(!response.ok||(!response.headers.get('content-encoding')&&Number(response.headers.get('content-length')||0)>art.bytes))throw Error('Artwork unavailable');
  const bytes=await response.arrayBuffer();if(bytes.byteLength!==art.bytes||bytes.byteLength>250000)throw Error('Artwork length mismatch');
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  if(digest!==art.sha256)throw Error('Artwork hash mismatch');
  const result=new Response(bytes,{headers});
  if(cache){const save=cache.put(cacheKey,result.clone()).catch(()=>{});if(ctx.waitUntil)ctx.waitUntil(save);else await save;}
  return result;
 }catch{return new Response('Artwork unavailable. Reading remains available.',{status:503,headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store'}});}
}
