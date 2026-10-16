const DEVICE_ORIGINS=new Set(['capacitor://localhost','http://localhost','https://localhost']);
const MAX_DOCUMENT=1_000_000;
const token=bytes=>Array.from(crypto.getRandomValues(new Uint8Array(bytes)),b=>b.toString(16).padStart(2,'0')).join('');
const digest=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,'0')).join('');

export async function syncRequest(request,env){
 const url=new URL(request.url),origin=request.headers.get('origin');
 const local=origin===url.origin||!origin,native=DEVICE_ORIGINS.has(origin);
 const headers={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store','vary':'Origin','x-content-type-options':'nosniff'};
 if(native){headers['access-control-allow-origin']=origin;headers['access-control-allow-methods']='GET, POST, PUT, OPTIONS';headers['access-control-allow-headers']='Authorization, Content-Type, X-BibleLens-Sync';}
 const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(!local&&!native)return reply({error:'Invalid origin.'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(request.headers.get('x-biblelens-sync')!=='1')return reply({error:'Missing sync request header.'},403);
 if(!env?.DB)return reply({error:'Cloud sync is not configured yet.'},503);
 const now=Date.now(),db=env.DB,bearer=request.headers.get('authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
 let user=local&&!native?request.headers.get('oai-authenticated-user-id'):null;
 let deviceHash;
 if(bearer){deviceHash=await digest(bearer);user=(await db.prepare('SELECT user_id FROM sync_devices WHERE token_hash=? AND expires_at>?').bind(deviceHash,now).first())?.user_id||null;}
 async function body(){const raw=await request.text();if(raw.length>MAX_DOCUMENT+1000)throw Error('Request too large.');return JSON.parse(raw);}
 try{
  if(url.pathname==='/api/sync/pair/redeem'&&request.method==='POST'){
   const input=await body(),code=String(input.code||'').replace(/[^a-f0-9]/gi,'').toLowerCase();
   if(code.length!==16)return reply({error:'Enter the connection code from the website.'},400);
   const row=await db.prepare('DELETE FROM sync_pair_codes WHERE code_hash=? AND expires_at>? RETURNING user_id').bind(await digest(code),now).first();
   if(!row)return reply({error:'This code expired or has already been used. Create a new code on the website.'},400);
   const secret=token(32);await db.prepare('INSERT INTO sync_devices(token_hash,user_id,expires_at) VALUES(?,?,?)').bind(await digest(secret),row.user_id,now+90*86400000).run();
   return reply({token:secret,userId:row.user_id});
  }
  if(!user)return reply({error:'Sign in to sync your notes and bookmarks.'},401);
  if(url.pathname==='/api/sync/session'&&request.method==='GET')return reply({userId:user});
  if(url.pathname==='/api/sync/pair'&&request.method==='POST'){
   if(bearer||!local)return reply({error:'Create connection codes from the signed-in website.'},403);
   const code=token(8);
   await db.batch([db.prepare('DELETE FROM sync_pair_codes WHERE user_id=? OR expires_at<?').bind(user,now),db.prepare('INSERT INTO sync_pair_codes(code_hash,user_id,expires_at) VALUES(?,?,?)').bind(await digest(code),user,now+600000)]);
   return reply({code:code.match(/.{4}/g).join('-'),expiresAt:now+600000});
  }
  if(url.pathname==='/api/sync/disconnect'&&request.method==='POST'){
   if(deviceHash)await db.prepare('DELETE FROM sync_devices WHERE token_hash=?').bind(deviceHash).run();
   else await db.prepare('DELETE FROM sync_devices WHERE user_id=?').bind(user).run();
   return reply({ok:true});
  }
  if(url.pathname!=='/api/sync/document')return reply({error:'Unknown sync endpoint.'},404);
  if(request.method==='GET'){
   const row=await db.prepare('SELECT revision,data FROM sync_documents WHERE user_id=?').bind(user).first();
   return reply({revision:row?.revision||0,data:row?JSON.parse(row.data):{}});
  }
  if(request.method==='PUT'){
   const input=await body();
   if(!Number.isSafeInteger(input.revision)||input.revision<0||!input.data||Array.isArray(input.data)||typeof input.data!=='object')return reply({error:'Invalid sync document.'},400);
   const data=JSON.stringify(input.data);if(data.length>MAX_DOCUMENT)return reply({error:'Notes exceed the cloud sync limit. Export a backup before reducing their size.'},413);
   const row=input.revision===0
    ?await db.prepare('INSERT INTO sync_documents(user_id,revision,data,updated_at) VALUES(?,1,?,?) ON CONFLICT(user_id) DO NOTHING RETURNING revision').bind(user,data,now).first()
    :await db.prepare('UPDATE sync_documents SET revision=revision+1,data=?,updated_at=? WHERE user_id=? AND revision=? RETURNING revision').bind(data,now,user,input.revision).first();
   if(!row)return reply({error:'Another device synced first. Retry with its latest changes.'},409);
   return reply({revision:row.revision});
  }
  return reply({error:'Method not allowed.'},405);
 }catch(error){return reply({error:error instanceof SyntaxError?'Invalid JSON.':'Sync could not finish. Your local notes are safe.'},400);}
}
