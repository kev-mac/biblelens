// CI-only adapter around the actual generated Worker; never included in assets.
import http from 'node:http';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.env.BIBLELENS_BUILD_ROOT||process.cwd(),port=Number(process.env.BIBLELENS_QA_PORT||8787);
const worker=(await import(pathToFileURL(path.join(root,'dist/server/index.js')))).default;
// Model the real Site's present DB binding with its signed-out auth guard.
// Any attempted SQL is a fixture error; these public image cases never sign in.
const environment={DB:{prepare(){throw Error('Signed-out QA fixture attempted SQL');}}};
const signedOut=await worker.fetch(new Request('http://127.0.0.1:'+port+'/api/sync/session',{headers:{'x-biblelens-sync':'1','sec-fetch-site':'same-origin'}}),environment,{});
assert.equal(signedOut.status,401,'The fixture must preserve the real signed-out session response');await signedOut.body.cancel();
const rows=[];let serial=0;
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1:'+port);
 if(url.pathname==='/__qa_metrics'){res.writeHead(200,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify({serial,rows:rows.filter(r=>r.id>Number(url.searchParams.get('since')||0))}));return;}
 const row={id:++serial,path:url.pathname,method:req.method,start:performance.now()};rows.push(row);if(rows.length>2000)rows.shift();
 try{
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  const request=new Request(url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
  const response=await worker.fetch(request,environment,{}),body=Buffer.from(await response.arrayBuffer());
  Object.assign(row,{status:response.status,bytes:req.method==='HEAD'?0:body.length,elapsedMs:performance.now()-row.start,headers:Object.fromEntries(['content-type','cache-control','etag','content-length'].map(k=>[k,response.headers.get(k)]))});
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(req.method==='HEAD'?undefined:body);
 }catch(error){Object.assign(row,{status:500,error:error.message,elapsedMs:performance.now()-row.start});if(!res.destroyed){res.writeHead(500,{'content-type':'text/plain','cache-control':'no-store'});res.end('QA adapter failure');}}
}).listen(port,'127.0.0.1',()=>console.log('Actual generated image QA Worker:',root,'port',port));
