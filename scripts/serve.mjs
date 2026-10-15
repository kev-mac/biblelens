import http from 'node:http';
import worker from '../dist/server/index.js';

const port=8787;
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,`http://127.0.0.1:${port}`);
  if(!['GET','HEAD'].includes(req.method)&&!(url.pathname==='/api/chat'&&req.method==='POST')){res.writeHead(405);res.end();return;}
  const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>30000){res.writeHead(413,{'content-type':'application/json'});res.end(JSON.stringify({error:'Message is too large.'}));return;}chunks.push(chunk);}
  const response=await worker.fetch(new Request(url,{method:req.method,headers:req.headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})}),{},{});
  res.writeHead(response.status,Object.fromEntries(response.headers));
  res.end(req.method==='HEAD'?undefined:Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500);res.end('Could not load this page.');}
}).listen(port,'127.0.0.1',()=>console.log(`Scripture Lens: http://127.0.0.1:${port}`));
