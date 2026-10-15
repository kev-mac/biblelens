import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('www'),types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1:8788');
  if(url.pathname.startsWith('/api/')){res.writeHead(503);res.end('No server API exists in the mobile preview');return;}
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(root+path.sep)||!['GET','HEAD'].includes(req.method)){res.writeHead(403);res.end();return;}
  const data=await fs.readFile(file);res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(8788,'127.0.0.1',()=>console.log('Offline mobile preview: http://127.0.0.1:8788 (static files only)'));
