import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {splitWorker} from './static-worker.mjs';
const assets={
 '/':{type:'text/html',body:'<p>Prepared assets</p>',csp:"default-src 'self'"},
 '/release.json':{type:'application/json',body:'{"buildNumber":1}'},
 '/hello.txt':{type:'text/plain',body:'Quotes " and \\; Unicode: café 🙂\n',gzip:'unused negotiated representation'},
 '/all-bytes.bin':{type:'application/octet-stream',encoding:'base64',body:Buffer.from(Array.from({length:256},(_,i)=>i)).toString('base64')},
};
const snapshot=JSON.stringify(assets),chapter=Buffer.from('{"book":0,"chapter":1,"verses":[]}').toString('base64');
const source=table=>`const BOOKS=[{"name":"Fixture"}];
const CHAPTERS={"0:1":${JSON.stringify(chapter)}};
const STUDIES=[];
const EVIDENCE=[];
const ACCEPTED_QUESTIONS=[];
const ASSETS=${JSON.stringify(table)};
const SEARCH={};
const MINI_INDEX={};
const VOCABULARY={};
const PEOPLE=[];
const TOPICS=[];
async function chat(){}
function json(value,status=200){return new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json'}});}
export default {async fetch(request,env,ctx){const url=new URL(request.url);
if(url.pathname==='/api/books')return json(BOOKS);
if(url.pathname==='/api/chapter'){const key='0:1';return new Response(atob(CHAPTERS[key]));}
if(url.pathname==='/api/offline')return request.method==='GET'?json(CHAPTERS):json({},405);
if(url.pathname==='/api/sync/session')return json({},403);
if(url.pathname==='/release.json')return new Response(ASSETS['/release.json'].body,{headers:{'content-type':'application/json'}});
const asset=ASSETS[url.pathname];if(!asset)return new Response('Missing',{status:404});
return new Response(asset.encoding==='base64'?Uint8Array.from(atob(asset.body),char=>char.charCodeAt(0)):asset.body,{headers:{'content-type':asset.type}});
}};`;
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'biblelens-prepared-assets-'));
const files=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):path.join(dir,e.name));
try{
 for(const eol of ['\n','\r\n'])for(const external of [false,true]){
  const outputs=[];
  for(const prepared of [false,true]){
   const output=path.join(directory,(eol==='\n'?'lf':'crlf')+'-'+String(external)+'-'+String(prepared));fs.mkdirSync(path.join(output,'server'),{recursive:true});
   splitWorker(source(prepared?{}:assets).replace(/\r?\n/g,eol),output,external,{},prepared?assets:undefined);outputs.push(output);
  }
  for(const file of files(outputs[0])){const relative=path.relative(outputs[0],file);assert.deepEqual(fs.readFileSync(file),fs.readFileSync(path.join(outputs[1],relative)),relative+' exact artifact parity');}
  const workers=await Promise.all(outputs.map(p=>import(pathToFileURL(path.join(p,'server/index.js'))).then(m=>m.default)));
  const env=output=>external?{ASSETS:{fetch:async request=>new Response(fs.readFileSync(path.join(output,'client',new URL(request.url).pathname==='/'?'index.html':new URL(request.url).pathname.slice(1))))}}:{};
  for(const route of ['/','/release.json','/hello.txt','/all-bytes.bin','/api/books','/api/chapter','/api/offline','/api/sync/session','/missing']){
   const responses=await Promise.all(workers.map((w,i)=>w.fetch(new Request('https://fixture.test'+route),env(outputs[i]),{})));
   assert.equal(responses[0].status,responses[1].status,route);assert.deepEqual([...responses[0].headers],[...responses[1].headers],route);assert.deepEqual(Buffer.from(await responses[0].arrayBuffer()),Buffer.from(await responses[1].arrayBuffer()),route);
  }
 }
 assert.equal(JSON.stringify(assets),snapshot,'The input asset table is never changed');
 console.log('PASS: prepared assets preserve exact Worker, manifest, immutable prefixes, static files and API/binary response bytes in compressed and static modes with LF and CRLF source; no temporary full Worker is required.');
}finally{fs.rmSync(directory,{recursive:true,force:true});}
