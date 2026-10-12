import http from 'node:http';
import worker from '../dist/server/index.js';

const port=8787;
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,`http://127.0.0.1:${port}`);
  if(url.pathname==='/api/chat'){
   res.writeHead(503,{'content-type':'application/json'});
   res.end(JSON.stringify({error:'AI Chat is available on the authenticated hosted site. The local reader and annotations work without it.'}));return;
  }
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  const response=await worker.fetch(new Request(url,{method:req.method}),{},{});
  res.writeHead(response.status,Object.fromEntries(response.headers));
  res.end(req.method==='HEAD'?undefined:Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500);res.end('Could not load this page.');}
}).listen(port,'127.0.0.1',()=>console.log(`Scripture Lens: http://127.0.0.1:${port}`));
