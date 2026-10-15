import api from './device-engine.js';

self.onmessage=async({data})=>{
 const {id,path,method='GET',body}=data;
 try{
  // A synthetic origin keeps the shared request validation unchanged. This
  // Request is passed to the bundled handler; it is never sent over a network.
  const url=new URL(path,'https://scripture.local');
  if(url.origin!=='https://scripture.local'||!url.pathname.startsWith('/api/'))throw Error('Invalid local API path');
  const response=await api.fetch(new Request(url,{method,headers:{'content-type':'application/json'},...(body!==undefined?{body}:{})}),{},{});
  self.postMessage({id,status:response.status,body:await response.text(),headers:Object.fromEntries(response.headers)});
 }catch{self.postMessage({id,status:500,body:JSON.stringify({error:'The on-device search could not finish. Please try again.'}),headers:{'content-type':'application/json'}});}
};
